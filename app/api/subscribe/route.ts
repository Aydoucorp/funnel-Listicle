import { NextResponse } from 'next/server'
import { computeProfile } from '@/lib/scoring'
import { subscribeSchema } from '@/lib/validation'
import { AUD_FORM, AUD_RESULT, RESULT_COOKIE, signToken, verifyToken } from '@/lib/tokens'
import { getClientIp, isSameOrigin, jsonError, logServerError } from '@/lib/http'
import { checkRateLimit } from '@/lib/rate-limit'
import { hasDatabase, prisma } from '@/lib/prisma'
import { upsertSubscriber } from '@/lib/mailerlite'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Message unique cote client : on ne detaille jamais ce qui a bloque.
const GENERIC_ERROR = "Ça n'a pas voulu partir. Tu peux réessayer dans un petit instant ?"
const TOO_MANY = 'Doucement, laisse-moi une minute et recommence 💙'

// Piege temporel : un formulaire rempli en moins de 3 secondes vient d'un robot.
const MIN_FORM_SECONDS = 3
const SUBSCRIBE_LIMIT = 5
const SUBSCRIBE_WINDOW_SECONDS = 60

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError(403, GENERIC_ERROR)
  }

  const allowed = await checkRateLimit(
    'subscribe',
    getClientIp(request),
    SUBSCRIBE_LIMIT,
    SUBSCRIBE_WINDOW_SECONDS,
  )
  if (!allowed) {
    return jsonError(429, TOO_MANY)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(400, GENERIC_ERROR)
  }

  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(400, GENERIC_ERROR)
  }

  const { prenom, email, answers, sessionId, formToken, site_web: honeypot } = parsed.data

  // Honeypot : rempli = robot. On repond comme si tout allait bien, sans rien faire.
  if (honeypot && honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  const tokenPayload = await verifyToken(formToken, AUD_FORM)
  if (!tokenPayload || typeof tokenPayload.iat !== 'number') {
    return jsonError(400, GENERIC_ERROR)
  }

  const elapsedSeconds = Math.floor(Date.now() / 1000) - tokenPayload.iat
  if (elapsedSeconds < MIN_FORM_SECONDS) {
    return NextResponse.json({ ok: true })
  }

  try {
    // Le profil est recalcule ici, a partir des reponses validees. Jamais celui du navigateur.
    const { profile } = computeProfile(answers)

    // Les donnees personnelles ne sont enregistrees qu'ici, apres consentement explicite.
    const leadId = await saveLead({ email, prenom, profile, sessionId: sessionId ?? null })

    const delivery = await upsertSubscriber({ email, prenom, profile, answers })

    if (leadId && delivery.ok) {
      await prisma.lead
        .update({ where: { id: leadId }, data: { mailerliteOk: true } })
        .catch((error) => logServerError('subscribe:lead-flag', error))
    }

    const resultToken = await signToken({ p: profile, n: prenom }, AUD_RESULT, '2h')

    const response = NextResponse.json({ ok: true, delivery: delivery.ok ? 'sent' : 'pending' })
    response.cookies.set({
      name: RESULT_COOKIE,
      value: resultToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2,
    })

    return response
  } catch (error) {
    logServerError('subscribe', error)
    return jsonError(500, GENERIC_ERROR)
  }
}

/**
 * Enregistre le lead et marque la session comme convertie.
 * Un souci de base ne doit pas priver la visiteuse de son resultat.
 */
async function saveLead(params: {
  email: string
  prenom: string
  profile: string
  sessionId: string | null
}): Promise<string | null> {
  if (!hasDatabase()) return null

  try {
    const sessionExists = params.sessionId
      ? await prisma.session.findUnique({ where: { id: params.sessionId }, select: { id: true } })
      : null

    const linkedSessionId = sessionExists?.id ?? null

    if (linkedSessionId) {
      await prisma.session.update({
        where: { id: linkedSessionId },
        data: {
          optedIn: true,
          resultProfile: params.profile,
          completedAt: new Date(),
          lastSeenAt: new Date(),
        },
      })
    }

    // Une meme personne peut refaire le quiz : on met a jour son profil.
    const lead = await prisma.lead.upsert({
      where: { email: params.email },
      create: {
        email: params.email,
        prenom: params.prenom,
        profile: params.profile,
        sessionId: linkedSessionId,
        consentAt: new Date(),
      },
      update: {
        prenom: params.prenom,
        profile: params.profile,
        consentAt: new Date(),
        mailerliteOk: false,
      },
      select: { id: true },
    })

    return lead.id
  } catch (error) {
    logServerError('subscribe:save-lead', error)
    return null
  }
}
