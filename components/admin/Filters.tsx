export const PERIODS = [
  { value: '7', label: '7 derniers jours' },
  { value: '30', label: '30 derniers jours' },
  { value: '90', label: '90 derniers jours' },
  { value: 'all', label: 'Depuis le début' },
] as const

export function Filters({
  periode,
  source,
  appareil,
  utmSources,
  devices,
}: {
  periode: string
  source: string
  appareil: string
  utmSources: string[]
  devices: string[]
}) {
  const selectClass =
    'w-full rounded-field border border-line bg-paper px-3.5 py-2.5 text-[14px] text-ink'

  return (
    <form
      method="GET"
      className="card mb-7 flex flex-wrap items-end gap-4 px-5 py-4"
      aria-label="Filtres du tableau de bord"
    >
      <div className="min-w-[170px] flex-1">
        <label htmlFor="periode" className="mb-1.5 block text-[13px] font-medium text-muted">
          Période
        </label>
        <select id="periode" name="periode" defaultValue={periode} className={selectClass}>
          {PERIODS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[170px] flex-1">
        <label htmlFor="source" className="mb-1.5 block text-[13px] font-medium text-muted">
          Source (utm_source)
        </label>
        <select id="source" name="source" defaultValue={source} className={selectClass}>
          <option value="">Toutes les sources</option>
          {utmSources.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[150px] flex-1">
        <label htmlFor="appareil" className="mb-1.5 block text-[13px] font-medium text-muted">
          Appareil
        </label>
        <select id="appareil" name="appareil" defaultValue={appareil} className={selectClass}>
          <option value="">Tous les appareils</option>
          {devices.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary min-h-[44px] px-6 py-2.5">
        Appliquer
      </button>
    </form>
  )
}
