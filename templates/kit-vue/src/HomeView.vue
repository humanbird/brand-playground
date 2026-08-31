<!--
  Automatische Übersicht aller Prototypen. Wird nie von Hand gepflegt —
  sie liest, was unter src/prototypes/ liegt.

  Zwei Gruppen: konvergente Prototypen (/proto) und Ideen (/ideate, Slug-Präfix
  `idea-`). Die Ideen-Gruppe erscheint erst, wenn es Ideen gibt.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { ideaPrototypes, protoPrototypes, type Prototype } from './prototypes'

const hasAny = protoPrototypes.length + ideaPrototypes.length > 0

const gruppen: { title: string; hint: string; items: Prototype[] }[] = [
  { title: 'Prototypen', hint: 'Ein Strang, sauber durchgebaut.', items: protoPrototypes },
  {
    title: 'Ideen',
    hint: 'Divergente Varianten zu einer Fragestellung — grob, schnell, nebeneinander.',
    items: ideaPrototypes,
  },
].filter((gruppe) => gruppe.items.length > 0)

function screenCountLabel(count: number) {
  return count === 1 ? '1 Screen' : `${count} Screens`
}
</script>

<template>
  <main class="mx-auto max-w-5xl px-6 py-12">
    <header>
      <h1 class="text-2xl font-bold text-ink">Prototypen</h1>
      <p class="mt-3 max-w-2xl text-base text-ink-muted">
        Der Prototyp ist die Frage, nicht die Antwort.
      </p>
    </header>

    <div v-if="!hasAny" class="mt-12 rounded-lg border border-line border-dashed p-8">
      <p class="text-base text-ink">Noch kein Prototyp vorhanden.</p>
      <p class="mt-3 text-sm text-ink-muted">
        Ordner unter <code class="font-mono">src/prototypes/</code> anlegen, darin eine
        <code class="font-mono">index.vue</code> — die Route existiert dann sofort.
      </p>
    </div>

    <section v-for="gruppe in gruppen" :key="gruppe.title" class="mt-12">
      <h2 class="text-lg font-medium text-ink">{{ gruppe.title }}</h2>
      <p class="mt-1 text-sm text-ink-muted">{{ gruppe.hint }}</p>

      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="prototype in gruppe.items"
          :key="prototype.slug"
          class="flex flex-col rounded-lg border border-line bg-canvas p-6 shadow-sm"
        >
          <RouterLink
            :to="prototype.path"
            class="text-lg font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
          >
            {{ prototype.slug }}
          </RouterLink>

          <p class="mt-1 text-sm text-ink-muted">
            {{ screenCountLabel(prototype.screens.length) }}
            <template v-if="prototype.missingIndex"> · keine index.vue</template>
          </p>

          <ul v-if="prototype.screens.length > 1" class="mt-4 flex flex-wrap gap-2">
            <li v-for="screen in prototype.screens" :key="screen.path">
              <RouterLink
                :to="screen.path"
                class="inline-block rounded-sm bg-surface px-3 py-1 font-mono text-xs text-ink-muted hover:text-accent"
              >
                {{ screen.label }}
              </RouterLink>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </main>
</template>
