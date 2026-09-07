import 'server-only'
import { cookies } from 'next/headers'
import { compare, hash } from 'bcryptjs'
import { hasDatabase, prisma } from '@/lib/prisma'
import { ADMIN_COOKIE, AUD_ADMIN, signToken, verifyToken } from '@/lib/tokens'
import { logServerError } from '@/lib/http'

const ADMIN_USERNAME = 'admin'
const BCRYPT_ROUNDS = 12
export const SESSION_MINUTES = 30

// Hash factice : sert a comparer en temps constant meme quand le compte n'existe pas,
// pour ne pas reveler l'existence d'un compte par le temps de reponse.
const DUMMY_HASH = '$2b$12$UC0TwD6IgBdppfyjl2z9teMBbYCB7cy/74oDw7P6fd0n6a9ZV005.'

export type AdminSession = { username: string }

/** Cree le compte admin au tout premier lancement, a partir de ADMIN_INITIAL_PASSWORD. */
export async function ensureAdminSeeded(): Promise<{ seeded: boolean; reason?: string }> {
  if (!hasDatabase()) return { seeded: false, reason: 'no-database' }

  try {
    const existing = await prisma.adminUser.findFirst({ select: { id: true } })
    if (existing) return { seeded: false }

    const initial = process.env.ADMIN_INITIAL_PASSWORD
    if (!initial || initial.length < 10) return { seeded: false, reason: 'no-initial-password' }

    await prisma.adminUser.create({
      data: {
        username: ADMIN_USERNAME,
        passwordHash: await hash(initial, BCRYPT_ROUNDS),
      },
    })

    return { seeded: true }
  } catch (error) {
    logServerError('admin:seed', error)
    return { seeded: false, reason: 'error' }
  }
}

/** Verifie le mot de passe. Aucune information sur la cause en cas d'echec. */
export async function verifyCredentials(password: string): Promise<boolean> {
  if (!hasDatabase()) return false

  try {
    await ensureAdminSeeded()

    const user = await prisma.adminUser.findFirst({
      select: { id: true, passwordHash: true },
    })

    if (!user) {
      await compare(password, DUMMY_HASH)
      return false
    }

    const valid = await compare(password, user.passwordHash)
    if (valid) {
      await prisma.adminUser
        .update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
        .catch(() => {})
    }

    return valid
  } catch (error) {
    logServerError('admin:verify', error)
    return false
  }
}

export async function createAdminSession(): Promise<void> {
  const user = await prisma.adminUser.findFirst({
    select: { username: true, sessionVersion: true },
  })
  if (!user) throw new Error('compte admin introuvable')

  const token = await signToken(
    { sub: user.username, v: user.sessionVersion },
    AUD_ADMIN,
    `${SESSION_MINUTES}m`,
  )

  const store = await cookies()
  store.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MINUTES * 60,
  })
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies()
  store.set({
    name: ADMIN_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

/**
 * Verification complete cote serveur : signature du cookie ET version de session en base.
 * Elle est refaite sur CHAQUE page et action admin, en plus du middleware
 * (defense en profondeur, cf. CVE-2025-29927).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!hasDatabase()) return null

  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!token) return null

  const payload = await verifyToken(token, AUD_ADMIN)
  if (!payload || typeof payload.sub !== 'string' || typeof payload.v !== 'number') return null

  try {
    const user = await prisma.adminUser.findUnique({
      where: { username: payload.sub },
      select: { username: true, sessionVersion: true },
    })

    // Un changement de mot de passe invalide les sessions ouvertes.
    if (!user || user.sessionVersion !== payload.v) return null

    return { username: user.username }
  } catch (error) {
    logServerError('admin:session', error)
    return null
  }
}

/** Change le mot de passe et deconnecte les autres sessions. */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean; message?: string }> {
  const session = await getAdminSession()
  if (!session) return { ok: false, message: 'Ta session a expiré, reconnecte-toi.' }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { username: session.username },
      select: { id: true, passwordHash: true },
    })
    if (!user) return { ok: false, message: 'Compte introuvable.' }

    const valid = await compare(currentPassword, user.passwordHash)
    if (!valid) return { ok: false, message: 'Le mot de passe actuel ne correspond pas.' }

    const sameAsBefore = await compare(newPassword, user.passwordHash)
    if (sameAsBefore) return { ok: false, message: 'Choisis un mot de passe différent de l\u2019actuel.' }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        passwordHash: await hash(newPassword, BCRYPT_ROUNDS),
        passwordChangedAt: new Date(),
        sessionVersion: { increment: 1 },
      },
    })

    return { ok: true }
  } catch (error) {
    logServerError('admin:password', error)
    return { ok: false, message: 'Le changement n\u2019a pas pu être enregistré.' }
  }
}
