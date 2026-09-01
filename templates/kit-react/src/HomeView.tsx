/*
 * Automatic overview of all prototypes. It is never maintained manually;
 * it reads the contents of src/prototypes/ (titles and descriptions come from
 * each prototype's `_shared/meta.ts`, see src/prototypes.ts).
 *
 * Two groups: convergent prototypes (/proto) and ideas (/ideate, slug prefix
 * `idea-`). The ideas group appears only when ideas exist. The reference screen
 * is marked and listed first.
 *
 * Styling uses only the `.kit-*` classes from src/kit.css so this file works
 * unchanged in every kit, whatever the design system renames.
 */

import { useState } from 'react'
import { Link } from 'react-router'

import { ideaPrototypes, protoPrototypes, type Prototype } from './prototypes'
import {
  openPath,
  readViewportChoice,
  resolveViewport,
  viewportLabel,
  writeViewportChoice,
  type ViewportChoice,
} from './viewport'

const VIEWPORT_OPTIONS: { value: ViewportChoice; label: string; hint: string }[] = [
  { value: 'auto', label: 'Auto', hint: 'Open each prototype at the viewport it declares' },
  { value: 'desktop', label: 'Desktop', hint: 'Open every prototype full width' },
  { value: 'mobile', label: 'Mobile', hint: 'Open every prototype in a 375 px device frame' },
]

function screenCountLabel(count: number) {
  return count === 1 ? '1 screen' : `${count} screens`
}

function PrototypeCard({ prototype, choice }: { prototype: Prototype; choice: ViewportChoice }) {
  const { slug, title, description, judgeAt, path, screens, isReference, missingIndex } = prototype
  const viewport = resolveViewport(judgeAt, choice)

  return (
    <article className="kit-card">
      <div>
        <Link to={openPath(path, viewport)} className="kit-card-title">
          {title}
        </Link>
        {isReference ? <span className="kit-badge">Reference</span> : null}
      </div>

      {description ? <p className="kit-text">{description}</p> : null}

      <p className="kit-muted">
        <code className="kit-code">{slug}</code> · {screenCountLabel(screens.length)}
        {judgeAt !== 'desktop' ? ` · ${viewportLabel(judgeAt)}` : null}
        {missingIndex ? ' · no index.tsx' : null}
      </p>

      {screens.length > 1 ? (
        <ul className="kit-tags">
          {screens.map((screen) => (
            <li key={screen.path}>
              <Link to={openPath(screen.path, viewport)} className="kit-tag">
                {screen.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

function Section({
  title,
  hint,
  items,
  choice,
}: {
  title: string
  hint: string
  items: Prototype[]
  choice: ViewportChoice
}) {
  return (
    <section className="kit-section">
      <h2 className="kit-heading">{title}</h2>
      <p className="kit-muted">{hint}</p>
      <div className="kit-grid">
        {items.map((prototype) => (
          <PrototypeCard key={prototype.slug} prototype={prototype} choice={choice} />
        ))}
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="kit-empty kit-stack">
      <p className="kit-text">No prototypes yet.</p>
      <p className="kit-muted">
        Create a folder under <code className="kit-code">src/prototypes/</code> and add an{' '}
        <code className="kit-code">index.tsx</code>; the route will be available immediately.
      </p>
    </div>
  )
}

export function HomeView() {
  const [choice, setChoice] = useState<ViewportChoice>(readViewportChoice)
  const hasAny = protoPrototypes.length + ideaPrototypes.length > 0

  function choose(next: ViewportChoice) {
    writeViewportChoice(next)
    setChoice(next)
  }

  return (
    <main className="kit-page">
      <header className="kit-toolbar">
        <div className="kit-stack">
          <h1 className="kit-title">Prototypes</h1>
          <p className="kit-lead">The prototype is the question, not the answer.</p>
        </div>

        <div className="kit-toggle" role="group" aria-label="Open prototypes at">
          {VIEWPORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className="kit-toggle-option"
              aria-pressed={choice === option.value}
              title={option.hint}
              onClick={() => choose(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      {!hasAny ? <EmptyState /> : null}

      {protoPrototypes.length > 0 ? (
        <Section
          title="Prototypes"
          hint="One path, developed end to end."
          items={protoPrototypes}
          choice={choice}
        />
      ) : null}

      {ideaPrototypes.length > 0 ? (
        <Section
          title="Ideas"
          hint="Divergent approaches to one question: rough, fast, and side by side."
          items={ideaPrototypes}
          choice={choice}
        />
      ) : null}
    </main>
  )
}

export default HomeView
