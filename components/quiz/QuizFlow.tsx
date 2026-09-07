'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { QuizContent, QuizQuestion } from '@/lib/quiz'
import { startSession, track, trackAbandon } from '@/lib/track'
import { AnswerCard } from '@/components/quiz/AnswerCard'
import { ProgressBar } from '@/components/quiz/ProgressBar'
import { LeadGate } from '@/components/quiz/LeadGate'

type Answers = Record<string, string[]>

const PROGRESS_KEY = 'qms_progress'

type Props = {
  questions: QuizQuestion[]
  leadGate: QuizContent['leadGate']
  formToken: string
}

export function QuizFlow({ questions, leadGate, formToken }: Props) {
  const total = questions.length
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [restored, setRestored] = useState(false)
  const finishedRef = useRef(false)
  const viewedRef = useRef<Set<string>>(new Set())
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reprise en cas de rafraichissement de la page.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(PROGRESS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as { step?: number; answers?: Answers }
        if (parsed.answers && typeof parsed.answers === 'object') setAnswers(parsed.answers)
        if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= total) {
          setStep(parsed.step)
        }
      }
    } catch {
      /* on repart simplement du debut */
    }
    setRestored(true)
    void startSession()
  }, [total])

  useEffect(() => {
    if (!restored) return
    try {
      window.sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ step, answers }))
    } catch {
      /* pas grave */
    }
  }, [step, answers, restored])

  // Vue de question (une seule fois par question et par session).
  useEffect(() => {
    if (!restored || step >= total) return
    const question = questions[step]
    if (viewedRef.current.has(question.id)) return
    viewedRef.current.add(question.id)
    void track('question_view', { questionId: question.id })
  }, [step, restored, questions, total])

  // Abandon : quand la personne s'en va sans avoir fini.
  useEffect(() => {
    const handleLeave = () => {
      if (finishedRef.current) return
      const questionId = step < total ? questions[step].id : 'lead_gate'
      trackAbandon({ questionId })
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') handleLeave()
    }
    window.addEventListener('pagehide', handleLeave)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('pagehide', handleLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [step, total, questions])

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, total))
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [total])

  const goBack = useCallback(() => {
    const questionId = step < total ? questions[step].id : 'lead_gate'
    void track('question_back', { questionId })
    setStep((s) => Math.max(s - 1, 0))
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step, total, questions])

  const handleSelect = useCallback(
    (question: QuizQuestion, value: string) => {
      if (question.type === 'multi') {
        setAnswers((prev) => {
          const current = prev[question.id] ?? []
          const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value]
          return { ...prev, [question.id]: next }
        })
        return
      }

      setAnswers((prev) => ({ ...prev, [question.id]: [value] }))
      void track('question_answer', { questionId: question.id, answerValue: value })

      if (advanceTimer.current) clearTimeout(advanceTimer.current)
      advanceTimer.current = setTimeout(goNext, 320)
    },
    [goNext],
  )

  const handleMultiNext = useCallback(
    (question: QuizQuestion) => {
      const selected = answers[question.id] ?? []
      for (const value of selected) {
        void track('question_answer', { questionId: question.id, answerValue: value })
      }
      goNext()
    },
    [answers, goNext],
  )

  if (!restored) {
    return <div className="min-h-[320px]" aria-hidden="true" />
  }

  if (step >= total) {
    return (
      <>
        <ProgressBar current={total} total={total} atLeadGate />
        <LeadGate
          content={leadGate}
          answers={answers}
          formToken={formToken}
          onBack={goBack}
          onSubmitted={() => {
            finishedRef.current = true
            try {
              window.sessionStorage.removeItem(PROGRESS_KEY)
            } catch {
              /* pas grave */
            }
          }}
        />
      </>
    )
  }

  const question = questions[step]
  const selected = answers[question.id] ?? []
  const isMulti = question.type === 'multi'

  return (
    <>
      <ProgressBar current={step + 1} total={total} />

      <div key={question.id} className="fade-in">
        <div className="card px-5 py-7 sm:px-8">
          <h1
            id={`title-${question.id}`}
            className="text-center font-display text-[clamp(24px,5.5vw,28px)] font-medium leading-[1.25] text-ink"
          >
            {question.title}
          </h1>
          {question.help ? (
            <p className="mt-2.5 text-center text-[14px] text-muted">{question.help}</p>
          ) : null}

          <div
            role={isMulti ? 'group' : 'radiogroup'}
            aria-labelledby={`title-${question.id}`}
            className="mt-6 space-y-3"
          >
            {question.options.map((option) => (
              <AnswerCard
                key={option.value}
                label={option.label}
                multi={isMulti}
                selected={selected.includes(option.value)}
                onSelect={() => handleSelect(question, option.value)}
              />
            ))}
          </div>

          {isMulti ? (
            <div className="mt-7">
              <button
                type="button"
                onClick={() => handleMultiNext(question)}
                disabled={selected.length === 0}
                className="btn-primary w-full"
              >
                Continuer
              </button>
              {selected.length === 0 ? (
                <p className="mt-2.5 text-center text-[13px] text-muted">
                  Choisis au moins une réponse, tu peux en cocher plusieurs.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          {step > 0 ? (
            <button type="button" onClick={goBack} className="btn-ghost">
              ← Précédent
            </button>
          ) : (
            <span />
          )}
          <span className="pr-2 text-[13px] text-muted">
            {isMulti ? 'Plusieurs réponses possibles' : 'Une seule réponse'}
          </span>
        </div>
      </div>
    </>
  )
}
