/*
 * src/prototypes/beispiel/index.tsx  →  Route /p/beispiel
 *
 * Einstiegs-Screen. Verlinkt auf Detail.tsx (→ /p/beispiel/detail), damit der
 * Ablauf durchklickbar ist: ein Prototyp, den man nicht durchklicken kann,
 * beantwortet keine Frage.
 */

import { Link } from 'react-router'

import { DsButton } from '../../components'
import { auftraege, statusFarbe } from './_shared/data'
import { Shell } from './_shared/Shell'

export default function Uebersicht() {
  return (
    <Shell titel="Aufträge">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="text-base text-ink-muted">
          {auftraege.length} Aufträge in dieser Woche
        </p>
        <DsButton>Auftrag anlegen</DsButton>
      </div>

      <ul className="mt-6 divide-y divide-line rounded-lg border border-line">
        {auftraege.map((auftrag) => (
          <li key={auftrag.id} className="flex flex-wrap items-center gap-4 p-6">
            <div className="min-w-0 flex-1">
              <Link
                to={`/p/beispiel/detail?id=${auftrag.id}`}
                className="text-base font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
              >
                {auftrag.titel}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">
                <span className="font-mono">{auftrag.id}</span> · {auftrag.kunde} · fällig{' '}
                {auftrag.faellig}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusFarbe[auftrag.status]}`}
            >
              {auftrag.status}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-ink-muted">
        Annahme: Aufträge sind einer Woche zugeordnet und werden nicht paginiert. Ab etwa
        40 Einträgen trägt diese Liste nicht mehr.
      </p>
    </Shell>
  )
}
