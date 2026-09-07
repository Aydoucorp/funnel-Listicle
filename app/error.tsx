'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Le detail reste cote serveur, on ne montre jamais l'interne a la visiteuse.
    console.error('Une erreur est survenue', error.digest ?? '')
  }, [error])

  return (
    <div className="botanical-bg flex min-h-screen flex-col items-center justify-center px-5">
      <div className="card w-full max-w-[480px] px-6 py-9 text-center">
        <p className="text-[28px]" aria-hidden="true">
          🌿
        </p>
        <h1 className="mt-3 font-display text-[26px] font-medium text-ink">
          Petit couac de mon côté
        </h1>
        <p className="mt-3 text-[16px] leading-[1.7] text-ink2">
          Ça arrive, et ce n&apos;est pas de ta faute. Réessaie dans un instant, ça devrait
          repartir.
        </p>
        <div className="mt-7 flex justify-center">
          <button type="button" onClick={reset} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    </div>
  )
}
