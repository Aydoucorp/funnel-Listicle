export function ProgressBar({
  current,
  total,
  atLeadGate = false,
}: {
  current: number
  total: number
  atLeadGate?: boolean
}) {
  // Le formulaire compte comme une etape de plus : la barre n'atteint 100 % qu'a la fin.
  const steps = total + 1
  const position = atLeadGate ? steps : Math.min(Math.max(current, 1), total)
  const percent = Math.round((position / steps) * 100)

  return (
    <div className="mb-7">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="kicker">
          {atLeadGate ? 'Dernière étape' : `Question ${position} / ${total}`}
        </span>
        <span className="text-[12px] font-medium text-muted">{percent}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-sand/50"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Avancement du quiz"
      >
        <div className="progress-fill h-full rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
