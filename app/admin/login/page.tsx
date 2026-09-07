import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/LoginForm'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  // Deja connectee : inutile de repasser par le formulaire.
  const session = await getAdminSession()
  if (session) redirect('/admin')

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-[380px]">
        <div className="card px-6 py-8">
          <p className="kicker text-center">Back-office</p>
          <h1 className="mt-3 text-center font-display text-[26px] font-medium text-ink">
            Coucou toi 🌿
          </h1>
          <p className="mt-2 text-center text-[14px] leading-relaxed text-muted">
            Entre ton mot de passe pour voir les chiffres du quiz.
          </p>

          <div className="mt-7">
            <LoginForm />
          </div>
        </div>

        <p className="mt-5 text-center text-[12.5px] leading-relaxed text-muted">
          Cette page n’est pas indexée et n’est liée nulle part sur le site.
        </p>
      </div>
    </main>
  )
}
