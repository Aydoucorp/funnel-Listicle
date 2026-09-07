import 'server-only'
import { PROFILE_KEYS, ProfileKey, questions, quiz } from '@/lib/quiz'
import { logServerError } from '@/lib/http'
import type { ValidatedAnswers } from '@/lib/validation'

// API MailerLite : https://developer.mailerlite.com
// Le token vit UNIQUEMENT dans process.env, cote serveur. Jamais dans le code, jamais en NEXT_PUBLIC_.
const API_BASE = 'https://connect.mailerlite.com/api'
const TIMEOUT_MS = 9000

// Correspondance profil -> variable d'environnement (voir mailerlite-groups-ids.md).
// Les IDs eux-memes sont dans Vercel, jamais ici.
const GROUP_ENV_BY_PROFILE: Record<ProfileKey, string> = {
  bebe: 'MAILERLITE_GROUP_BEBE',
  animal: 'MAILERLITE_GROUP_ANIMAL',
  air: 'MAILERLITE_GROUP_AIR',
  budget: 'MAILERLITE_GROUP_BUDGET',
  charge: 'MAILERLITE_GROUP_CHARGE',
}

const GROUP_ENV_ALL = 'MAILERLITE_GROUP_ALL'

export type MailerLiteResult = { ok: boolean; reason?: 'not-configured' | 'api-error' }

export function isMailerLiteConfigured(): boolean {
  return Boolean(process.env.MAILERLITE_API_TOKEN?.trim())
}

/** Groupes cibles : celui du profil gagnant + le groupe « Quiz - toutes ». */
export function getGroupIds(profile: ProfileKey): string[] {
  const ids: string[] = []
  const profileGroup = process.env[GROUP_ENV_BY_PROFILE[profile]]?.trim()
  const allGroup = process.env[GROUP_ENV_ALL]?.trim()

  if (profileGroup) ids.push(profileGroup)
  if (allGroup && allGroup !== profileGroup) ids.push(allGroup)

  return ids
}

/** Les reponses sont stockees en champs MailerLite, pour du ciblage fin plus tard. */
function buildFields(prenom: string, profile: ProfileKey, answers: ValidatedAnswers) {
  const fields: Record<string, string> = {
    name: prenom,
    quiz_profil: profile,
    quiz_profil_label: quiz.profiles[profile].label,
    quiz_groupe: quiz.profiles[profile].group,
  }

  for (const question of questions) {
    const values = (answers as Record<string, string[]>)[question.id] ?? []
    const labels = values
      .map((value) => question.options.find((o) => o.value === value)?.label ?? value)
      .join(', ')
    fields[`quiz_${question.id}`] = labels.slice(0, 250)
  }

  return fields
}

async function callMailerLite(body: unknown): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    return await fetch(`${API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_TOKEN}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    })
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Cree ou met a jour l'abonne, puis l'ajoute au groupe de son profil et au groupe « Quiz - toutes ».
 * On n'envoie jamais de `status` : c'est le reglage double opt-in de MailerLite qui decide,
 * et il doit rester active dans le compte.
 */
export async function upsertSubscriber(params: {
  email: string
  prenom: string
  profile: ProfileKey
  answers: ValidatedAnswers
}): Promise<MailerLiteResult> {
  if (!isMailerLiteConfigured()) {
    return { ok: false, reason: 'not-configured' }
  }

  const groups = getGroupIds(params.profile)
  const body = {
    email: params.email,
    fields: buildFields(params.prenom, params.profile, params.answers),
    ...(groups.length > 0 ? { groups } : {}),
  }

  // Une tentative, puis une seule reprise en cas de souci reseau ou d'erreur serveur.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await callMailerLite(body)

      if (response.ok) return { ok: true }

      // 4xx : inutile de reessayer, la requete ne passera pas davantage.
      if (response.status < 500 && response.status !== 429) {
        logServerError('mailerlite', new Error(`reponse ${response.status}`))
        return { ok: false, reason: 'api-error' }
      }

      logServerError('mailerlite', new Error(`reponse ${response.status}, nouvelle tentative`))
    } catch (error) {
      logServerError('mailerlite', error)
    }

    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 600))
  }

  return { ok: false, reason: 'api-error' }
}

/** Utilise par /admin pour honorer une demande de suppression (RGPD). */
export async function deleteSubscriber(email: string): Promise<MailerLiteResult> {
  if (!isMailerLiteConfigured()) return { ok: false, reason: 'not-configured' }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const search = await fetch(
      `${API_BASE}/subscribers/${encodeURIComponent(email)}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.MAILERLITE_API_TOKEN}`,
        },
        signal: controller.signal,
        cache: 'no-store',
      },
    )

    if (search.status === 404) return { ok: true }
    if (!search.ok) return { ok: false, reason: 'api-error' }

    const data = (await search.json()) as { data?: { id?: string } }
    const id = data?.data?.id
    if (!id) return { ok: false, reason: 'api-error' }

    const removed = await fetch(`${API_BASE}/subscribers/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_TOKEN}`,
      },
      cache: 'no-store',
    })

    return { ok: removed.ok, reason: removed.ok ? undefined : 'api-error' }
  } catch (error) {
    logServerError('mailerlite-delete', error)
    return { ok: false, reason: 'api-error' }
  } finally {
    clearTimeout(timeout)
  }
}

export const PROFILE_GROUP_ENV_NAMES = PROFILE_KEYS.map((key) => GROUP_ENV_BY_PROFILE[key])
