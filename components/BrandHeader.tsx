import Link from 'next/link'
import { quiz } from '@/lib/quiz'

export function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={compact ? 'py-5' : 'py-7'}>
      <Link
        href="/"
        className="mx-auto flex w-fit items-center gap-2.5 rounded-full px-3 py-1.5 text-ink transition-colors hover:bg-cream2"
      >
        <span aria-hidden="true" className="text-[18px]">
          🌿
        </span>
        <span className="font-display text-[16px] font-medium tracking-[0.01em]">
          {quiz.meta.brand}
        </span>
      </Link>
    </header>
  )
}
