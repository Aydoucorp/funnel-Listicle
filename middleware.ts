import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Premiere barriere devant /admin. La verification serieuse (signature ET base de donnees)
// est refaite dans chaque page et chaque action admin : on ne se fie jamais au seul middleware
// (cf. CVE-2025-29927).
const ADMIN_COOKIE = 'qms_admin'
const AUD_ADMIN = 'admin-session'
const ISSUER = 'quiz-maison-saine'
const DEV_FALLBACK_SECRET = 'dev-only-secret-quiz-maison-saine-32-chars'

function key(): Uint8Array | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.trim().length < 16) {
    if (process.env.NODE_ENV === 'production') return null
    return new TextEncoder().encode(DEV_FALLBACK_SECRET)
  }
  return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value
  const secretKey = key()

  if (token && secretKey) {
    try {
      await jwtVerify(token, secretKey, {
        issuer: ISSUER,
        audience: AUD_ADMIN,
        algorithms: ['HS256'],
      })
      return NextResponse.next()
    } catch {
      /* jeton absent, expire ou invalide */
    }
  }

  const loginUrl = new URL('/admin/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
