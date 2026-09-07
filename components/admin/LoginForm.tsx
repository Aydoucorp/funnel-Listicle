'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/admin/actions'
import { initialActionState } from '@/lib/action-state'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? 'Un instant…' : 'Entrer'}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialActionState)

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[14px] font-medium text-ink">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
          className="field-input"
          placeholder="••••••••••"
        />
      </div>

      {/* Piege a robots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="admin-site">Ne remplis pas ce champ</label>
        <input id="admin-site" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' ? (
        <p role="alert" className="rounded-field bg-gold/15 px-4 py-3 text-[14px] text-ink">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
