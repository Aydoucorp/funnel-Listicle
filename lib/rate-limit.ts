import 'server-only'
import { createHash } from 'crypto'
import { hasDatabase, prisma } from '@/lib/prisma'
import { logServerError } from '@/lib/http'

// Compteur de secours en memoire : utilise seulement si la base est indisponible.
// La reference reste Postgres, car en serverless plusieurs instances tournent en parallele.
const memoryCounters = new Map<string, { count: number; expiresAt: number }>()

/** L'IP n'est jamais stockee en clair (RGPD) : on en garde une empreinte courte. */
export function hashIdentifier(value: string): string {
  const salt = process.env.ADMIN_SESSION_SECRET || 'sel-local'
  return createHash('sha256').update(`${salt}:${value}`).digest('hex').slice(0, 32)
}

function windowStartFor(windowSeconds: number): Date {
  const windowMs = windowSeconds * 1000
  return new Date(Math.floor(Date.now() / windowMs) * windowMs)
}

function checkInMemory(bucket: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now()
  const key = `${bucket}:${Math.floor(now / (windowSeconds * 1000))}`
  const entry = memoryCounters.get(key)

  if (!entry || entry.expiresAt < now) {
    memoryCounters.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 })
    return true
  }

  entry.count += 1

  if (memoryCounters.size > 5000) {
    for (const [k, v] of memoryCounters) {
      if (v.expiresAt < now) memoryCounters.delete(k)
    }
  }

  return entry.count <= limit
}

/**
 * Renvoie true si la requete peut passer.
 * `scope` decrit l'endpoint (subscribe, event, admin-login), `identifier` l'appelant.
 */
export async function checkRateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const bucket = `${scope}:${hashIdentifier(identifier)}`

  if (!hasDatabase()) {
    return checkInMemory(bucket, limit, windowSeconds)
  }

  try {
    const windowStart = windowStartFor(windowSeconds)
    const record = await prisma.rateLimit.upsert({
      where: { bucket_windowStart: { bucket, windowStart } },
      create: { bucket, windowStart, count: 1 },
      update: { count: { increment: 1 } },
      select: { count: true },
    })

    // Nettoyage opportuniste des vieilles fenetres.
    if (Math.random() < 0.02) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
      await prisma.rateLimit.deleteMany({ where: { windowStart: { lt: cutoff } } })
    }

    return record.count <= limit
  } catch (error) {
    logServerError('rate-limit', error)
    return checkInMemory(bucket, limit, windowSeconds)
  }
}
