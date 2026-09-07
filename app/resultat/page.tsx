import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { BrandHeader } from '@/components/BrandHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ResultViewTracker } from '@/components/quiz/ResultViewTracker'
import { isProfileKey, PROFILE_ACCENT, PROFILE_EMOJI, quiz } from '@/lib/quiz'
import { AUD_RESULT, RESULT_COOKIE, verifyToken } from '@/lib/tokens'

export const dynamic = 'force-dynamic'

/** « de Sophie » mais « d'Emilie » : petite elision pour que ca sonne juste. */
function avecPrenom(prenom: string): string {
  const premiere = prenom.trim().charAt(0).toLowerCase()
  const voyelles = ['a', 'e', 'i', 'o', 'u', 'y', 'h', 'à', 'â', 'é', 'è', 'ê', 'î', 'ô', 'û']
  return voyelles.includes(premiere) ? `Le diagnostic d’${prenom}` : `Le diagnostic de ${prenom}`
}

export const metadata: Metadata = {
  title: 'Ton diagnostic',
  robots: { index: false, follow: false },
}

export default async function ResultPage() {
  const store = await cookies()
  const raw = store.get(RESULT_COOKIE)?.value
  const payload = raw ? await verifyToken(raw, AUD_RESULT) : null
  const profile = payload && isProfileKey(payload.p) ? payload.p : null
  const prenom = typeof payload?.n === 'string' ? payload.n : ''

  if (!profile) {
    return (
      <div className="botanical-bg flex min-h-screen flex-col">
        <BrandHeader compact />
        <main className="flex flex-1 items-center px-5 pb-10">
          <div className="mx-auto w-full max-w-[520px] card px-6 py-9 text-center">
            <p className="text-[28px]" aria-hidden="true">
              🌿
            </p>
            <h1 className="mt-3 font-display text-[26px] font-medium text-ink">
              Ton résultat n&apos;est plus affiché ici
            </h1>
            <p className="mt-3 text-[16px] leading-[1.7] text-ink2">
              Pas d&apos;inquiétude, si tu as déjà laissé ton email, tout t&apos;attend dans ta boîte
              mail. Sinon, tu peux refaire le quiz en deux minutes, je t&apos;accompagne.
            </p>
            <div className="mt-7 flex justify-center">
              <Link href="/quiz" className="btn-primary">
                Refaire le quiz
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const result = quiz.resultPages[profile]
  const info = quiz.profiles[profile]

  return (
    <div className="botanical-bg flex min-h-screen flex-col">
      <ResultViewTracker />
      <BrandHeader compact />

      <main className="flex-1 px-5 pb-10">
        <div className="mx-auto w-full max-w-[560px] fade-in">
          <div
            className="card overflow-hidden"
            style={{ borderTop: `5px solid ${PROFILE_ACCENT[profile]}` }}
          >
            <div className="px-6 py-8 sm:px-8">
              <p className="kicker text-center">
                {prenom ? avecPrenom(prenom) : 'Ton diagnostic'}
              </p>

              <p className="mt-4 text-center text-[44px] leading-none" aria-hidden="true">
                {PROFILE_EMOJI[profile]}
              </p>

              <h1 className="mt-4 text-center font-display text-[clamp(24px,5.5vw,32px)] font-medium leading-[1.2] text-ink">
                {result.headline}
              </h1>

              <p className="mt-3 text-center text-[13px] font-medium text-muted">{info.label}</p>

              <p className="mt-5 text-[16px] leading-[1.75] text-ink2">{result.body}</p>

              <div className="mt-7 rounded-card border border-line bg-blue-bg/60 px-5 py-5">
                <p className="kicker text-blue-dark">Ton guide offert</p>
                <p className="mt-2 font-display text-[20px] font-medium leading-snug text-ink">
                  {result.ebook}
                </p>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-card border border-gold/40 bg-gold/10 px-5 py-4">
                <span aria-hidden="true" className="text-[20px]">
                  🎁
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{result.bonus}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink2">
                    {quiz.bonusForAll.ebook}
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-card bg-sage-bg/70 px-5 py-5">
                <p className="text-[15px] leading-[1.7] text-ink2">{result.nextStep}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[14px] leading-relaxed text-muted">
              Tu ne trouves pas l&apos;email ? Regarde dans les promotions ou les indésirables, il
              aime bien s&apos;y cacher.
            </p>
            <Link
              href="/"
              className="btn-ghost mt-3"
            >
              Revenir à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
