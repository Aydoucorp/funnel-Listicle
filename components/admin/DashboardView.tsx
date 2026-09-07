import type { DashboardData } from '@/lib/analytics'
import { PROFILE_EMOJI } from '@/lib/quiz'

function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value)
}

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value)} %`
}

function formatDay(day: string): string {
  const [year, month, date] = day.split('-')
  return `${date}/${month}`
}

function KpiCard({
  label,
  value,
  hint,
  tone = 'neutre',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'neutre' | 'bleu' | 'vert' | 'dore'
}) {
  const tones = {
    neutre: 'bg-paper',
    bleu: 'bg-blue-bg/70',
    vert: 'bg-sage-bg/70',
    dore: 'bg-gold/10',
  } as const

  return (
    <div className={`rounded-card border border-line px-5 py-4 shadow-soft ${tones[tone]}`}>
      <p className="kicker">{label}</p>
      <p className="mt-2 font-display text-[28px] font-medium leading-none text-ink">{value}</p>
      {hint ? <p className="mt-1.5 text-[13px] text-muted">{hint}</p> : null}
    </div>
  )
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="card mb-6 px-5 py-6 sm:px-6">
      <h2 className="font-display text-[21px] font-medium text-ink">{title}</h2>
      {description ? <p className="mt-1 text-[14px] text-muted">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-card bg-cream2/60 px-4 py-6 text-center text-[14px] leading-relaxed text-muted">
      {children}
    </p>
  )
}

export function DashboardView({ data }: { data: DashboardData }) {
  const { totals, funnel, questionStats, profiles, daily, recentLeads } = data
  const maxFunnel = Math.max(...funnel.map((step) => step.sessions), 1)
  const maxDaily = Math.max(...daily.map((row) => row.sessions), 1)

  if (!data.available) {
    return (
      <EmptyNote>
        La base de données n’est pas encore connectée, alors il n’y a rien à afficher pour le
        moment. Ajoute la variable DATABASE_URL, et les chiffres arriveront tout seuls.
      </EmptyNote>
    )
  }

  return (
    <>
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Quiz démarrés"
          value={formatNumber(totals.sessions)}
          hint="sur la période choisie"
        />
        <KpiCard
          label="Taux de complétion"
          value={formatPercent(totals.completionRate)}
          hint={`${formatNumber(totals.completed)} personnes ont vu leur résultat`}
          tone="bleu"
        />
        <KpiCard
          label="Taux d’opt-in"
          value={formatPercent(totals.optInRate)}
          hint="parmi celles qui ont vu le formulaire"
          tone="vert"
        />
        <KpiCard
          label="Emails récoltés"
          value={formatNumber(totals.leads)}
          hint={
            totals.leadsNotSynced > 0
              ? `${formatNumber(totals.leadsNotSynced)} pas encore partis vers MailerLite`
              : 'tous partis vers MailerLite'
          }
          tone="dore"
        />
      </div>

      <SectionCard
        title="L’entonnoir"
        description="Combien de personnes atteignent chaque étape, et où elles s’arrêtent."
      >
        {totals.sessions === 0 ? (
          <EmptyNote>
            Personne n’est encore passé sur cette période. Dès qu’une visiteuse commencera le quiz,
            tout s’affichera ici.
          </EmptyNote>
        ) : (
          <ol className="space-y-2.5">
            {funnel.map((step, index) => (
              <li key={step.key}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[14px] font-medium text-ink">{step.label}</span>
                  <span className="text-[13px] text-muted">
                    {formatNumber(step.sessions)} ({formatPercent(step.shareOfStart)} du départ)
                    {index > 0 && step.dropFromPrevious > 0 ? (
                      <span className="ml-2 text-ink2">
                        perte {formatNumber(step.dropFromPrevious)} ({formatPercent(step.dropRate)})
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-sand/40">
                  <div
                    className="progress-fill h-full rounded-full"
                    style={{ width: `${Math.max((step.sessions / maxFunnel) * 100, 1)}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </SectionCard>

      <SectionCard
        title="Question par question"
        description="Vues, temps passé, retours en arrière, sorties de page et réponses choisies."
      >
        <div className="space-y-5">
          {questionStats.map((question) => (
            <div key={question.id} className="rounded-card border border-line bg-cream2/30 px-4 py-4">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-[16px] font-semibold text-ink">
                  Q{question.order}. {question.title}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
                  <span>{formatNumber(question.views)} vues</span>
                  <span>
                    {question.avgSeconds === null ? 'temps inconnu' : `${question.avgSeconds} s en moyenne`}
                  </span>
                  <span>{formatNumber(question.backs)} retours</span>
                  <span>{formatNumber(question.abandons)} sorties</span>
                </div>
              </div>

              <ul className="space-y-2">
                {question.options.map((option) => (
                  <li key={option.value} className="flex items-center gap-3">
                    <span className="w-[45%] shrink-0 text-[13.5px] leading-snug text-ink2 sm:w-[38%]">
                      {option.label}
                    </span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand/40">
                      <span
                        className="block h-full rounded-full bg-blue"
                        style={{ width: `${option.share}%` }}
                      />
                    </span>
                    <span className="w-[74px] shrink-0 text-right text-[13px] text-muted">
                      {formatPercent(option.share)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Répartition par profil" description="Qui sont tes visiteuses.">
          {profiles.every((profile) => profile.total === 0) ? (
            <EmptyNote>Aucun résultat calculé sur cette période, pour l’instant.</EmptyNote>
          ) : (
            <ul className="space-y-3">
              {profiles.map((profile) => (
                <li key={profile.key}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-[14px] font-medium text-ink">
                      <span aria-hidden="true">{PROFILE_EMOJI[profile.key]}</span> {profile.label}
                    </span>
                    <span className="text-[13px] text-muted">
                      {formatNumber(profile.total)} ({formatPercent(profile.share)})
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-sand/40">
                    <div
                      className="h-full rounded-full bg-sage"
                      style={{ width: `${profile.share}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Jour après jour" description="Sessions et emails laissés, par journée.">
          {daily.length === 0 ? (
            <EmptyNote>Rien à tracer encore sur cette période.</EmptyNote>
          ) : (
            <>
              <div className="flex items-end gap-1.5 overflow-x-auto pb-2" style={{ height: 180 }}>
                {daily.map((row) => (
                  <div key={row.day} className="flex w-8 shrink-0 flex-col items-center gap-1.5">
                    <div className="relative flex h-[130px] w-full items-end justify-center">
                      <div
                        className="w-full rounded-t-[6px] bg-blue-bg"
                        style={{ height: `${Math.max((row.sessions / maxDaily) * 100, 2)}%` }}
                        title={`${row.sessions} sessions`}
                      />
                      <div
                        className="absolute bottom-0 w-1/2 rounded-t-[6px] bg-sage-dark"
                        style={{ height: `${Math.max((row.optIns / maxDaily) * 100, 0)}%` }}
                        title={`${row.optIns} emails`}
                      />
                    </div>
                    <span className="text-[10.5px] text-muted">{formatDay(row.day)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-4 text-[13px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-[4px] bg-blue-bg" aria-hidden="true" /> sessions
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-[4px] bg-sage-dark" aria-hidden="true" /> emails
                  laissés
                </span>
              </div>
            </>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Les derniers emails"
        description="Les douze plus récents, toutes périodes confondues."
      >
        {recentLeads.length === 0 ? (
          <EmptyNote>
            Aucun email pour l’instant. Ça viendra, laisse le lien vivre un peu sur Instagram.
          </EmptyNote>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-line text-[12.5px] uppercase tracking-[0.08em] text-muted">
                  <th className="py-2 pr-3 font-semibold">Prénom</th>
                  <th className="py-2 pr-3 font-semibold">Email</th>
                  <th className="py-2 pr-3 font-semibold">Profil</th>
                  <th className="py-2 pr-3 font-semibold">Date</th>
                  <th className="py-2 font-semibold">MailerLite</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.email} className="border-b border-line/60 last:border-0">
                    <td className="py-2.5 pr-3 text-ink">{lead.prenom}</td>
                    <td className="py-2.5 pr-3 text-ink2">{lead.email}</td>
                    <td className="py-2.5 pr-3 text-ink2">{lead.profile}</td>
                    <td className="py-2.5 pr-3 text-muted">
                      {new Intl.DateTimeFormat('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Europe/Paris',
                      }).format(lead.createdAt)}
                    </td>
                    <td className="py-2.5">
                      {lead.synced ? (
                        <span className="rounded-full bg-sage-bg px-2.5 py-1 text-[12.5px] font-medium text-sage-dark">
                          envoyé
                        </span>
                      ) : (
                        <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[12.5px] font-medium text-ink">
                          à reprendre
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </>
  )
}
