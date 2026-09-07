'use client'

import { useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { QuizContent } from '@/lib/quiz'
import { cancelAbandon, getStoredSessionId, track } from '@/lib/track'

type Props = {
  content: QuizContent['leadGate']
  answers: Record<string, string[]>
  formToken: string
  onBack: () => void
  onSubmitted: () => void
}

export function LeadGate({ content, answers, formToken, onBack, onSubmitted }: Props) {
  const router = useRouter()
  const ids = useId()
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    void track('lead_gate_view')
  }, [])

  const emailLooksOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
  const canSubmit = prenom.trim().length > 0 && emailLooksOk && consent && status !== 'sending'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setStatus('sending')
    setErrorMessage('')
    void track('opt_in_submit')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: prenom.trim(),
          email: email.trim(),
          consent,
          answers,
          sessionId: getStoredSessionId(),
          formToken,
          site_web: honeypot,
        }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null
        setStatus('error')
        setErrorMessage(
          data?.message ||
            "Ça n'a pas voulu partir. Tu peux réessayer dans un petit instant ?",
        )
        return
      }

      cancelAbandon()
      onSubmitted()
      router.push('/resultat')
    } catch {
      setStatus('error')
      setErrorMessage("Ça n'a pas voulu partir. Tu peux réessayer dans un petit instant ?")
    }
  }

  return (
    <div className="fade-in">
      <div className="card px-6 py-8 sm:px-8">
        <h1 className="text-center font-display text-[clamp(22px,5.5vw,30px)] font-medium text-ink">
          {content.title}
        </h1>
        <p className="mx-auto mt-3 max-w-[420px] text-center text-[15px] leading-[1.7] text-ink2">
          {content.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
          <div>
            <label htmlFor={`${ids}-prenom`} className="mb-1.5 block text-[14px] font-medium text-ink">
              Ton prénom
            </label>
            <input
              id={`${ids}-prenom`}
              name="prenom"
              type="text"
              autoComplete="given-name"
              required
              maxLength={60}
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="field-input"
              placeholder="Émilie"
            />
          </div>

          <div>
            <label htmlFor={`${ids}-email`} className="mb-1.5 block text-[14px] font-medium text-ink">
              Ton email
            </label>
            <input
              id={`${ids}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={180}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="toi@exemple.fr"
            />
          </div>

          {/* Piege a robots : invisible pour toi, tentant pour eux. */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
            <label htmlFor={`${ids}-site`}>Ne remplis pas ce champ</label>
            <input
              id={`${ids}-site`}
              name="site_web"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-field border border-line bg-cream2/40 px-4 py-3.5">
            <input
              type="checkbox"
              name="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-[6px] border-2 border-sand accent-[#3f77b0]"
            />
            <span className="text-[13px] leading-relaxed text-muted">
              {content.consent.label}{' '}
              <Link
                href="/confidentialite"
                target="_blank"
                className="text-blue-dark underline underline-offset-2"
              >
                Politique de confidentialité
              </Link>
              .
            </span>
          </label>

          {status === 'error' ? (
            <p role="alert" className="rounded-field bg-gold/15 px-4 py-3 text-[14px] text-ink">
              {errorMessage}
            </p>
          ) : null}

          <button type="submit" disabled={!canSubmit} className="btn-primary w-full">
            {status === 'sending' ? 'Un instant…' : content.cta}
          </button>

          <p className="text-center text-[12.5px] leading-relaxed text-muted">
            Tu recevras un email pour confirmer ton adresse (c&apos;est la règle), et tu peux te
            désinscrire en un clic quand tu veux.
          </p>
        </form>
      </div>

      <div className="mt-4 flex justify-center">
        <button type="button" onClick={onBack} className="btn-ghost">
          ← Revenir à la question précédente
        </button>
      </div>
    </div>
  )
}
