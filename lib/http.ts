import 'server-only'
import { NextResponse } from 'next/server'

/** Reponse d'erreur : toujours generique cote client, le detail reste dans les logs serveur. */
export function jsonError(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status })
}

/** IP de l'appelant, telle que Vercel la transmet. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first.slice(0, 64)
  }
  return request.headers.get('x-real-ip')?.slice(0, 64) || 'inconnue'
}

/**
 * Protection CSRF : on verifie que la requete vient bien de notre propre site
 * (en plus des cookies sameSite).
 */
export function isSameOrigin(request: Request): boolean {
  const host = request.headers.get('host')
  if (!host) return false

  const allowedHosts = new Set<string>([host])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    try {
      allowedHosts.add(new URL(siteUrl).host)
    } catch {
      /* URL mal formee : on ignore */
    }
  }

  const candidate = request.headers.get('origin') || request.headers.get('referer')
  if (!candidate) return false

  try {
    return allowedHosts.has(new URL(candidate).host)
  } catch {
    return false
  }
}

/** Journal serveur : jamais de secret, jamais de donnee personnelle. */
export function logServerError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : 'erreur inconnue'
  console.error(`[${scope}] ${message}`)
}
