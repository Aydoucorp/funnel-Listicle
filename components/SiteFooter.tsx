import Link from 'next/link'
import { quiz } from '@/lib/quiz'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line/70 py-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-5 text-center">
        <p className="text-[13px] text-muted">
          {quiz.meta.brand} · {quiz.meta.instagram}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px]">
          <Link href="/confidentialite" className="text-muted underline underline-offset-2 hover:text-ink">
            Politique de confidentialité
          </Link>
          <Link href="/mentions-legales" className="text-muted underline underline-offset-2 hover:text-ink">
            Mentions légales
          </Link>
        </nav>
        <p className="max-w-md text-[12px] leading-relaxed text-muted/80">
          Ce quiz parle de ressenti et d&apos;habitudes, jamais de diagnostic médical. Mesure
          d&apos;audience sans cookie, tes réponses restent anonymes tant que tu ne me laisses pas
          ton email.
        </p>
      </div>
    </footer>
  )
}
