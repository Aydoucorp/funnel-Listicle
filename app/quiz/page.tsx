import type { Metadata } from 'next'
import { BrandHeader } from '@/components/BrandHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { QuizFlow } from '@/components/quiz/QuizFlow'
import { questions, quiz } from '@/lib/quiz'
import { AUD_FORM, signToken } from '@/lib/tokens'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Le quiz',
  description: quiz.meta.quizSubtitle,
}

export default async function QuizPage() {
  // Jeton signe au rendu de la page : il date l'ouverture du formulaire cote serveur
  // (piege temporel infalsifiable, voir SECURITE.md section D).
  const formToken = await signToken({}, AUD_FORM, '2h')

  return (
    <div className="botanical-bg flex min-h-screen flex-col">
      <BrandHeader compact />
      <main className="flex-1 px-5 pb-10">
        <div className="mx-auto w-full max-w-[560px]">
          <QuizFlow questions={questions} leadGate={quiz.leadGate} formToken={formToken} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
