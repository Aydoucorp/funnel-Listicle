import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Back-office',
  // Le back-office ne doit jamais apparaitre dans un moteur de recherche.
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-cream">{children}</div>
}
