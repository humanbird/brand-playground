<!--
  Automatic overview of all prototypes. It is never maintained manually;
  it reads the contents of src/prototypes/.

  Two groups: convergent prototypes (/proto) and ideas (/ideate, slug prefix
  `idea-`). The ideas group appears only when ideas exist.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { ideaPrototypes, protoPrototypes, type Prototype } from './prototypes'

const hasAny = protoPrototypes.length + ideaPrototypes.length > 0

const gruppen: { title: string; hint: string; items: Prototype[] }[] = [
  { title: 'Prototypes', hint: 'One path, developed end to end.', items: protoPrototypes },
  {
    title: 'Ideas',
    hint: 'Divergent approaches to one question: rough, fast, and side by side.',
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
      <h1 class="text-2xl font-bold text-ink">Prototypes</h1>
      <p class="mt-3 max-w-2xl text-base text-ink-muted">
        The prototype is the question, not the answer.
      </p>
    </header>

    <div v-if="!hasAny" class="mt-12 rounded-lg border border-line border-dashed p-8">
      <p class="text-base text-ink">No prototypes yet.</p>
      <p class="mt-3 text-sm text-ink-muted">
        Create a folder under <code class="font-mono">src/prototypes/</code> and add an
        <code class="font-mono">index.vue</code>; the route will be available immediately.
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
            <template v-if="prototype.missingIndex"> · no index.vue</template>
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
