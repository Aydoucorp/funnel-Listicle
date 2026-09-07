import { NextResponse } from 'next/server'
import { hasDatabase, prisma } from '@/lib/prisma'
import { eventSchema } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp, isSameOrigin, jsonError, logServerError } from '@/lib/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Le tracking ne doit jamais bloquer l'experience : on repond ok meme si l'ecriture echoue.
function ok(extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: true, ...extra })
}

// Limite large mais reelle : un parcours complet fait une vingtaine d'evenements.
const EVENT_LIMIT = 120
const EVENT_WINDOW_SECONDS = 60

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError(403, 'Requête refusée.')
  }

  const allowed = await checkRateLimit('event', getClientIp(request), EVENT_LIMIT, EVENT_WINDOW_SECONDS)
  if (!allowed) {
    return jsonError(429, 'Trop de requêtes, réessaie dans une minute.')
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(400, 'Requête invalide.')
  }

  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(400, 'Requête invalide.')
  }

  const { type, sessionId, questionId, answerValue, context } = parsed.data

  if (!hasDatabase()) {
    // Pas de base configuree (dev local sans Postgres) : le quiz continue de fonctionner.
    return ok({ sessionId: null })
  }

  try {
    if (type === 'quiz_start') {
      const session = await prisma.session.create({
        data: {
          device: context?.device ?? null,
          referrer: context?.referrer ?? null,
          utmSource: context?.utmSource ?? null,
          utmMedium: context?.utmMedium ?? null,
          utmCampaign: context?.utmCampaign ?? null,
          events: { create: { type: 'quiz_start' } },
        },
        select: { id: true },
      })

      return ok({ sessionId: session.id })
    }

    if (!sessionId) {
      return jsonError(400, 'Requête invalide.')
    }

    // Aucune donnee personnelle n'est enregistree ici (RGPD).
    await prisma.event.create({
      data: {
        sessionId,
        type,
        questionId: questionId ?? null,
        answerValue: answerValue ?? null,
      },
    })

    await prisma.session.update({
      where: { id: sessionId },
      data: { lastSeenAt: new Date() },
    })

    return ok()
  } catch (error) {
    logServerError('event', error)
    // Session inconnue ou base indisponible : on n'embete pas la visiteuse avec ca.
    return ok({ sessionId: null })
  }
}
