/*
 * src/prototypes/beispiel/Detail.tsx  →  Route /p/beispiel/detail
 *
 * Zweiter Screen desselben Prototyps. Der Dateiname wird für die Route klein
 * geschrieben; ein weiterer Screen wäre einfach eine weitere Datei daneben.
 *
 * Parameter kommen über die Query (?id=…) — das funktioniert auch im
 * Einzeldatei-Export hinter dem Hash: #/p/beispiel/detail?id=A-2481
 */

import { Link, useSearchParams } from 'react-router'

import { DsButton } from '../../components'
import { auftragById, statusFarbe } from './_shared/data'
import { Shell } from './_shared/Shell'

export default function Detail() {
  const [params] = useSearchParams()
  const auftrag = auftragById(params.get('id'))

  if (!auftrag) {
    return (
      <Shell titel="Auftrag" zurueck={{ to: '/p/beispiel', label: 'Aufträge' }}>
        <p className="text-base text-ink">Dieser Auftrag existiert nicht.</p>
        <p className="mt-3 text-sm text-ink-muted">
          Leerer Zustand — mitgedacht, nicht weggelassen.
        </p>
        <Link to="/p/beispiel" className="mt-6 inline-block">
          <DsButton variant="secondary">Zurück zur Liste</DsButton>
        </Link>
      </Shell>
    )
  }

  return (
    <Shell titel={auftrag.titel} zurueck={{ to: '/p/beispiel', label: 'Aufträge' }}>
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-mono text-sm text-ink-muted">{auftrag.id}</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusFarbe[auftrag.status]}`}
        >
          {auftrag.status}
        </span>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-ink-muted">Kunde</dt>
          <dd className="mt-1 text-base text-ink">{auftrag.kunde}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Einsatzort</dt>
          <dd className="mt-1 text-base text-ink">{auftrag.ort}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Fällig</dt>
          <dd className="mt-1 text-base text-ink">{auftrag.faellig}</dd>
        </div>
      </dl>

      <p className="mt-6 max-w-2xl text-base text-ink">{auftrag.beschreibung}</p>

      <h2 className="mt-8 text-lg font-medium text-ink">Positionen</h2>
      <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
        {auftrag.positionen.map((position) => (
          <li key={position.bezeichnung} className="flex justify-between gap-4 p-4">
            <span className="text-base text-ink">{position.bezeichnung}</span>
            <span className="font-mono text-sm text-ink-muted">{position.menge}×</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <DsButton>Abschließen</DsButton>
        <DsButton variant="secondary">Termin verschieben</DsButton>
        <DsButton variant="ghost" size="sm">
          Protokoll ansehen
        </DsButton>
      </div>
    </Shell>
  )
}
