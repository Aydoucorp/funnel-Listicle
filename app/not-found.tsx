import Link from 'next/link'
import { BrandHeader } from '@/components/BrandHeader'
import { SiteFooter } from '@/components/SiteFooter'

export default function NotFound() {
  return (
    <div className="botanical-bg flex min-h-screen flex-col">
      <BrandHeader compact />
      <main className="flex flex-1 items-center px-5 pb-10">
        <div className="card mx-auto w-full max-w-[480px] px-6 py-9 text-center">
          <p className="text-[28px]" aria-hidden="true">
            🌿
          </p>
          <h1 className="mt-3 font-display text-[26px] font-medium text-ink">
            Cette page s&apos;est envolée
          </h1>
          <p className="mt-3 text-[16px] leading-[1.7] text-ink2">
            Elle n&apos;existe pas, ou elle a changé d&apos;adresse. Rien de grave, on repart du
            bon pied.
          </p>
          <div className="mt-7 flex justify-center">
            <Link href="/" className="btn-primary">
              Revenir à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
