/*
 * src/prototypes/example/Detail.tsx  →  Route /p/example/detail
 *
 * Second screen in the same prototype. The file name is lowercased for the
 * route; another screen would simply be another file alongside it.
 *
 * Parameters are passed through the query string (?id=…), which also works in
 * the single-file export after the hash: #/p/example/detail?id=A-2481
 */

import { Link, useSearchParams } from 'react-router'

import { DsButton } from '../../components'
import { statusColor, workOrderById } from './_shared/data'
import { Shell } from './_shared/Shell'

export default function Detail() {
  const [params] = useSearchParams()
  const workOrder = workOrderById(params.get('id'))

  if (!workOrder) {
    return (
      <Shell title="Work order" back={{ to: '/p/example', label: 'Work orders' }}>
        <p className="text-base text-ink">This work order does not exist.</p>
        <p className="mt-3 text-sm text-ink-muted">
          Empty state: considered explicitly, not omitted.
        </p>
        <Link to="/p/example" className="mt-6 inline-block">
          <DsButton variant="secondary">Back to list</DsButton>
        </Link>
      </Shell>
    )
  }

  return (
    <Shell title={workOrder.title} back={{ to: '/p/example', label: 'Work orders' }}>
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-mono text-sm text-ink-muted">{workOrder.id}</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[workOrder.status]}`}
        >
          {workOrder.status}
        </span>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-ink-muted">Customer</dt>
          <dd className="mt-1 text-base text-ink">{workOrder.customer}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Service location</dt>
          <dd className="mt-1 text-base text-ink">{workOrder.location}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Due</dt>
          <dd className="mt-1 text-base text-ink">{workOrder.dueDate}</dd>
        </div>
      </dl>

      <p className="mt-6 max-w-2xl text-base text-ink">{workOrder.description}</p>

      <h2 className="mt-8 text-lg font-medium text-ink">Line items</h2>
      <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
        {workOrder.items.map((item) => (
          <li key={item.name} className="flex justify-between gap-4 p-4">
            <span className="text-base text-ink">{item.name}</span>
            <span className="font-mono text-sm text-ink-muted">{item.quantity}×</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <DsButton>Complete</DsButton>
        <DsButton variant="secondary">Reschedule</DsButton>
        <DsButton variant="ghost" size="sm">
          View service report
        </DsButton>
      </div>
    </Shell>
  )
}
