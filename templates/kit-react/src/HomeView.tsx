/*
 * Automatic overview of all prototypes. It is never maintained manually;
 * it reads the contents of src/prototypes/.
 *
 * Two groups: convergent prototypes (/proto) and ideas (/ideate, slug prefix
 * `idea-`). The ideas group appears only when ideas exist.
 */

import { Link } from 'react-router'

import { ideaPrototypes, protoPrototypes, type Prototype } from './prototypes'

function screenCountLabel(count: number) {
  return count === 1 ? '1 Screen' : `${count} Screens`
}

function PrototypeCard({ prototype }: { prototype: Prototype }) {
  const { slug, path, screens, missingIndex } = prototype

  return (
    <article className="flex flex-col rounded-lg border border-line bg-canvas p-6 shadow-sm">
      <Link
        to={path}
        className="text-lg font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
      >
        {slug}
      </Link>

      <p className="mt-1 text-sm text-ink-muted">
        {screenCountLabel(screens.length)}
        {missingIndex ? ' · no index.tsx' : null}
      </p>

      {screens.length > 1 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {screens.map((screen) => (
            <li key={screen.path}>
              <Link
                to={screen.path}
                className="inline-block rounded-sm bg-surface px-3 py-1 font-mono text-xs text-ink-muted hover:text-accent"
              >
                {screen.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

function Section({ title, hint, items }: { title: string; hint: string; items: Prototype[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-medium text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{hint}</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((prototype) => (
          <PrototypeCard key={prototype.slug} prototype={prototype} />
        ))}
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-lg border border-line border-dashed p-8">
      <p className="text-base text-ink">No prototypes yet.</p>
      <p className="mt-3 text-sm text-ink-muted">
        Create a folder under <code className="font-mono">src/prototypes/</code> and add an{' '}
        <code className="font-mono">index.tsx</code>; the route will be available immediately.
      </p>
    </div>
  )
}

export function HomeView() {
  const hasAny = protoPrototypes.length + ideaPrototypes.length > 0

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header>
        <h1 className="text-2xl font-bold text-ink">Prototypes</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-muted">
          The prototype is the question, not the answer.
        </p>
      </header>

      {!hasAny ? <EmptyState /> : null}

      {protoPrototypes.length > 0 ? (
        <Section
          title="Prototypes"
          hint="One path, developed end to end."
          items={protoPrototypes}
        />
      ) : null}

      {ideaPrototypes.length > 0 ? (
        <Section
          title="Ideas"
          hint="Divergent approaches to one question: rough, fast, and side by side."
          items={ideaPrototypes}
        />
      ) : null}
    </main>
  )
}

export default HomeView
