'use client'

type Props = {
  label: string
  selected: boolean
  multi: boolean
  onSelect: () => void
}

export function AnswerCard({ label, selected, multi, onSelect }: Props) {
  return (
    <button
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onClick={onSelect}
      className={`answer-card flex w-full min-h-[56px] items-center gap-3.5 rounded-card border px-4 py-3.5 text-left text-[16px] leading-snug shadow-soft ${
        selected
          ? 'border-blue-dark bg-blue-bg text-ink'
          : 'border-line bg-paper text-ink2'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-colors ${
          multi ? 'rounded-[7px]' : 'rounded-full'
        } ${selected ? 'border-blue-dark bg-blue-dark text-white' : 'border-sand bg-paper'}`}
      >
        {selected ? (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8.5l3.2 3.2L13 4.8" />
          </svg>
        ) : null}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  )
}
