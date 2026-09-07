import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { DashboardView } from '@/components/admin/DashboardView'
import { Filters } from '@/components/admin/Filters'
import { getAdminSession } from '@/lib/admin-auth'
import { getDashboard } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

const PERIOD_DAYS: Record<string, number | null> = {
  '7': 7,
  '30': 30,
  '90': 90,
  all: null,
}

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Verification serveur, en plus du middleware (defense en profondeur).
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const params = await searchParams
  const periode = firstValue(params.periode) in PERIOD_DAYS ? firstValue(params.periode) : '30'
  const source = firstValue(params.source).slice(0, 120)
  const appareil = firstValue(params.appareil).slice(0, 20)

  const days = PERIOD_DAYS[periode]
  const to = new Date()
  const from = days === null ? new Date(0) : new Date(to.getTime() - days * 24 * 60 * 60 * 1000)

  const data = await getDashboard({
    from,
    to,
    utmSource: source || null,
    device: appareil || null,
  })

  const periodLabel =
    days === null ? 'depuis le tout début' : `sur les ${days} derniers jours`

  return (
    <AdminShell
      title="Comment va ton quiz ?"
      subtitle={`Les chiffres ${periodLabel}. Tout est anonyme jusqu’à l’email.`}
      current="dashboard"
    >
      <Filters
        periode={periode}
        source={source}
        appareil={appareil}
        utmSources={data.filterOptions.utmSources}
        devices={data.filterOptions.devices}
      />
      <DashboardView data={data} />
    </AdminShell>
  )
}
