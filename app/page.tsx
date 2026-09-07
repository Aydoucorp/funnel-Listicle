import Link from 'next/link'
import { BrandHeader } from '@/components/BrandHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { quiz, TOTAL_QUESTIONS } from '@/lib/quiz'

export default function HomePage() {
  return (
    <div className="botanical-bg flex min-h-screen flex-col">
      <BrandHeader />

      <main className="flex flex-1 items-center px-5 pb-10">
        <div className="mx-auto w-full max-w-[560px] fade-in">
          <div className="card px-6 py-9 sm:px-9 sm:py-11">
            <p className="kicker mb-4 text-center">Petit diagnostic maison</p>

            <h1 className="text-center font-display text-[clamp(30px,7vw,48px)] font-medium leading-[1.1] text-ink">
              {quiz.meta.quizTitle}
            </h1>

            <p className="mx-auto mt-5 max-w-[440px] text-center text-[16px] leading-[1.7] text-ink2">
              {quiz.meta.quizSubtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-bg px-3.5 py-1.5 text-[13px] font-medium text-blue-dark">
                ⏱️ {quiz.meta.estimatedTime}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-bg px-3.5 py-1.5 text-[13px] font-medium text-sage-dark">
                {TOTAL_QUESTIONS} questions
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-[13px] font-medium text-ink">
                🎁 Recettes offertes
              </span>
            </div>

            <div className="mt-8 flex justify-center">
              <Link href="/quiz" className="btn-primary w-full sm:w-auto sm:px-10">
                Commencer
              </Link>
            </div>

            <p className="mt-5 text-center text-[13px] leading-relaxed text-muted">
              À la fin, je t&apos;offre le guide qui te correspond et ma trousse de recettes maison.
              C&apos;est gratuit, et c&apos;est de bon cœur 💙
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-card border border-line/70 bg-paper/70 px-5 py-4">
            <span aria-hidden="true" className="text-[18px]">
              🌿
            </span>
            <p className="text-[14px] leading-relaxed text-muted">
              Aucune bonne ou mauvaise réponse ici. On parle juste de ton quotidien, de ce que tu
              ressens chez toi, et de ce qui t&apos;aiderait le plus en ce moment.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
