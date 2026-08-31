/*
 * src/prototypes/example/index.tsx  →  Route /p/example
 *
 * Entry screen. Links to Detail.tsx (→ /p/example/detail), making the flow
 * clickable. A prototype that cannot be clicked through answers no question.
 */

import { Link } from 'react-router'

import { DsButton } from '../../components'
import { auftraege, statusFarbe } from './_shared/data'
import { Shell } from './_shared/Shell'

export default function Uebersicht() {
  return (
    <Shell titel="Work orders">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="text-base text-ink-muted">
          {auftraege.length} work orders this week
        </p>
        <DsButton>Create work order</DsButton>
      </div>

      <ul className="mt-6 divide-y divide-line rounded-lg border border-line">
        {auftraege.map((auftrag) => (
          <li key={auftrag.id} className="flex flex-wrap items-center gap-4 p-6">
            <div className="min-w-0 flex-1">
              <Link
                to={`/p/example/detail?id=${auftrag.id}`}
                className="text-base font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
              >
                {auftrag.titel}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">
                <span className="font-mono">{auftrag.id}</span> · {auftrag.kunde} · due{' '}
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
        Assumption: work orders are assigned to a week and are not paginated. This list
        stops working well at around 40 entries.
      </p>
    </Shell>
  )
}
