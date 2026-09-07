import 'server-only'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

// Deux usages, une seule cle, des audiences distinctes verifiees strictement.
export const AUD_RESULT = 'quiz-result'
export const AUD_ADMIN = 'admin-session'
export const AUD_FORM = 'lead-form'

const ISSUER = 'quiz-maison-saine'

// Secret de repli UNIQUEMENT en developpement local, pour pouvoir tester sans rien configurer.
// En production, l'absence de ADMIN_SESSION_SECRET est une erreur bloquante.
const DEV_FALLBACK_SECRET = 'dev-only-secret-quiz-maison-saine-32-chars'

function key(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.trim().length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SESSION_SECRET manquant ou trop court')
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET)
  }
  return new TextEncoder().encode(secret)
}

export async function signToken(
  payload: JWTPayload,
  audience: string,
  expiresIn: string,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(audience)
    .setExpirationTime(expiresIn)
    .sign(key())
}

export async function verifyToken(token: string, audience: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key(), {
      issuer: ISSUER,
      audience,
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}

export const RESULT_COOKIE = 'qms_result'
export const ADMIN_COOKIE = 'qms_admin'
