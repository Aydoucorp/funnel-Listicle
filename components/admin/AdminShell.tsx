import Link from 'next/link'
import { logoutAction } from '@/app/admin/actions'

export function AdminShell({
  title,
  subtitle,
  current,
  children,
}: {
  title: string
  subtitle?: string
  current: 'dashboard' | 'compte'
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true">🌿</span>
            <span className="font-display text-[16px] font-medium text-ink">Back-office</span>
          </div>

          <nav className="flex items-center gap-1.5">
            <Link
              href="/admin"
              className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
                current === 'dashboard' ? 'bg-blue-bg text-blue-dark' : 'text-muted hover:bg-cream2'
              }`}
            >
              Tableau de bord
            </Link>
            <Link
              href="/admin/compte"
              className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
                current === 'compte' ? 'bg-blue-bg text-blue-dark' : 'text-muted hover:bg-cream2'
              }`}
            >
              Mon compte
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full px-3.5 py-1.5 text-[14px] font-medium text-muted transition-colors hover:bg-cream2 hover:text-ink"
              >
                Me déconnecter
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5 py-8">
        <div className="mb-7">
          <h1 className="font-display text-[clamp(24px,4vw,32px)] font-medium text-ink">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-[15px] text-muted">{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  )
}
