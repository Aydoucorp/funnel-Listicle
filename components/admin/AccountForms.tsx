'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { changePasswordAction, deleteLeadAction } from '@/app/admin/actions'
import { initialActionState, type ActionState } from '@/lib/action-state'

function Feedback({ state }: { state: ActionState }) {
  if (state.status === 'idle') return null

  return (
    <p
      role="alert"
      className={`rounded-field px-4 py-3 text-[14px] ${
        state.status === 'success' ? 'bg-sage-bg text-sage-dark' : 'bg-gold/15 text-ink'
      }`}
    >
      {state.message}
    </p>
  )
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? pendingLabel : label}
    </button>
  )
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialActionState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="mb-1.5 block text-[14px] font-medium text-ink">
          Ton mot de passe actuel
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="mb-1.5 block text-[14px] font-medium text-ink">
          Le nouveau
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={200}
          className="field-input"
        />
        <p className="mt-1.5 text-[13px] text-muted">12 caractères minimum, prends-en plus si tu peux.</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-[14px] font-medium text-ink">
          Le nouveau, une deuxième fois
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={200}
          className="field-input"
        />
      </div>

      <Feedback state={state} />

      <SubmitButton label="Enregistrer mon nouveau mot de passe" pendingLabel="Un instant…" />
    </form>
  )
}

export function DeleteLeadForm() {
  const [state, formAction] = useActionState(deleteLeadAction, initialActionState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[14px] font-medium text-ink">
          Adresse email à effacer
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          required
          maxLength={180}
          className="field-input"
          placeholder="quelquun@exemple.fr"
        />
      </div>

      <Feedback state={state} />

      <SubmitButton label="Effacer cette adresse" pendingLabel="Suppression…" />
    </form>
  )
}
