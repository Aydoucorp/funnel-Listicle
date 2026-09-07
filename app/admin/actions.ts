'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  changeAdminPassword,
  createAdminSession,
  destroyAdminSession,
  getAdminSession,
  verifyCredentials,
} from '@/lib/admin-auth'
import { adminLoginSchema, adminPasswordChangeSchema, deleteLeadSchema } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rate-limit'
import { hasDatabase, prisma } from '@/lib/prisma'
import { deleteSubscriber } from '@/lib/mailerlite'
import { logServerError } from '@/lib/http'
import type { ActionState } from '@/lib/action-state'

async function clientIp(): Promise<string> {
  const store = await headers()
  const forwarded = store.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim().slice(0, 64) || 'inconnue'
  return store.get('x-real-ip')?.slice(0, 64) || 'inconnue'
}

/** Connexion admin : 5 essais par quart d'heure et par IP. */
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const allowed = await checkRateLimit('admin-login', await clientIp(), 5, 15 * 60)
  if (!allowed) {
    return {
      status: 'error',
      message: 'Trop d’essais. Reviens dans un quart d’heure.',
    }
  }

  if (!hasDatabase()) {
    return {
      status: 'error',
      message: 'La base de données n’est pas encore connectée (variable DATABASE_URL).',
    }
  }

  const parsed = adminLoginSchema.safeParse({
    password: formData.get('password'),
    site_web: formData.get('site_web'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Mot de passe incorrect.' }
  }

  // Honeypot : on fait comme si de rien n'etait.
  if (parsed.data.site_web && parsed.data.site_web.trim().length > 0) {
    return { status: 'error', message: 'Mot de passe incorrect.' }
  }

  const valid = await verifyCredentials(parsed.data.password)
  if (!valid) {
    return { status: 'error', message: 'Mot de passe incorrect.' }
  }

  await createAdminSession()
  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession()
  redirect('/admin/login')
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getAdminSession()
  if (!session) {
    return { status: 'error', message: 'Ta session a expiré, reconnecte-toi.' }
  }

  const parsed = adminPasswordChangeSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return {
      status: 'error',
      message:
        first?.message === 'Required'
          ? 'Il manque un champ.'
          : first?.message || 'Le mot de passe ne convient pas (12 caractères minimum).',
    }
  }

  const result = await changeAdminPassword(parsed.data.currentPassword, parsed.data.newPassword)
  if (!result.ok) {
    return { status: 'error', message: result.message || 'Le changement n’a pas pu se faire.' }
  }

  // On renouvelle la session pour ne pas te deconnecter juste apres le changement.
  await createAdminSession()

  return { status: 'success', message: 'C’est fait, ton nouveau mot de passe est en place 💙' }
}

/** Suppression sur demande (RGPD) : en base et chez MailerLite. */
export async function deleteLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getAdminSession()
  if (!session) {
    return { status: 'error', message: 'Ta session a expiré, reconnecte-toi.' }
  }

  const parsed = deleteLeadSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { status: 'error', message: 'Cette adresse email ne semble pas valide.' }
  }

  const email = parsed.data.email

  try {
    const deleted = await prisma.lead.deleteMany({ where: { email } })
    const remote = await deleteSubscriber(email)

    if (deleted.count === 0 && !remote.ok) {
      return {
        status: 'error',
        message: 'Aucune trace de cette adresse ici, et MailerLite n’a pas répondu.',
      }
    }

    revalidatePath('/admin')

    return {
      status: 'success',
      message: remote.ok
        ? 'Adresse effacée, ici et dans MailerLite.'
        : 'Adresse effacée ici. Pense à la retirer aussi dans MailerLite.',
    }
  } catch (error) {
    logServerError('admin:delete-lead', error)
    return { status: 'error', message: 'La suppression n’a pas pu se faire.' }
  }
}
