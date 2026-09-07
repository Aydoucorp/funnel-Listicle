import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { DeleteLeadForm, PasswordForm } from '@/components/admin/AccountForms'
import { getAdminSession, SESSION_MINUTES } from '@/lib/admin-auth'
import { isMailerLiteConfigured } from '@/lib/mailerlite'

export const dynamic = 'force-dynamic'

export default async function AdminAccountPage() {
  // Verification serveur, en plus du middleware (defense en profondeur).
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <AdminShell
      title="Mon compte"
      subtitle="Ton mot de passe, et les demandes de suppression."
      current="compte"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card px-5 py-6 sm:px-6">
          <h2 className="font-display text-[21px] font-medium text-ink">
            Changer mon mot de passe
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">
            Il est enregistré haché en base de données, jamais en clair. En le changeant, tu
            déconnectes aussi les autres appareils.
          </p>
          <div className="mt-5">
            <PasswordForm />
          </div>
        </section>

        <section className="card px-5 py-6 sm:px-6">
          <h2 className="font-display text-[21px] font-medium text-ink">
            Effacer une adresse (RGPD)
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">
            Si quelqu’un te demande d’effacer ses données, colle son adresse ici. Elle part de la
            base et de MailerLite, tout de suite.
          </p>
          {!isMailerLiteConfigured() ? (
            <p className="mt-3 rounded-field bg-gold/15 px-4 py-3 text-[13.5px] text-ink">
              MailerLite n’est pas encore relié (variable MAILERLITE_API_TOKEN). La suppression se
              fera ici, mais pas là-bas.
            </p>
          ) : null}
          <div className="mt-5">
            <DeleteLeadForm />
          </div>
        </section>
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-muted">
        Petite info au passage : ta session se ferme toute seule après {SESSION_MINUTES} minutes
        sans activité, c’est plus sûr.
      </p>
    </AdminShell>
  )
}
