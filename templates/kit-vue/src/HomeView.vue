<!--
  Automatic overview of all prototypes. It is never maintained manually;
  it reads the contents of src/prototypes/ (titles and descriptions come from
  each prototype's `_shared/meta.ts`, see src/prototypes.ts).

  Two groups: convergent prototypes (/proto) and ideas (/ideate, slug prefix
  `idea-`). The ideas group appears only when ideas exist. The reference screen
  is marked and listed first.

  Styling uses only the `.kit-*` classes from src/kit.css so this file works
  unchanged in every kit, whatever the design system renames.
-->

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

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

const choice = ref<ViewportChoice>(readViewportChoice())

function choose(next: ViewportChoice) {
  writeViewportChoice(next)
  choice.value = next
}

const hasAny = protoPrototypes.length + ideaPrototypes.length > 0

const groups: { title: string; hint: string; items: Prototype[] }[] = [
  { title: 'Prototypes', hint: 'One path, developed end to end.', items: protoPrototypes },
  {
    title: 'Ideas',
    hint: 'Divergent approaches to one question: rough, fast, and side by side.',
    items: ideaPrototypes,
  },
].filter((group) => group.items.length > 0)

function screenCountLabel(count: number) {
  return count === 1 ? '1 screen' : `${count} screens`
}

function open(path: string, prototype: Prototype) {
  return openPath(path, resolveViewport(prototype.judgeAt, choice.value))
}
</script>

<template>
  <main class="kit-page">
    <header class="kit-toolbar">
      <div class="kit-stack">
        <h1 class="kit-title">Prototypes</h1>
        <p class="kit-lead">The prototype is the question, not the answer.</p>
      </div>

      <div class="kit-toggle" role="group" aria-label="Open prototypes at">
        <button
          v-for="option in VIEWPORT_OPTIONS"
          :key="option.value"
          type="button"
          class="kit-toggle-option"
          :aria-pressed="choice === option.value"
          :title="option.hint"
          @click="choose(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </header>

    <div v-if="!hasAny" class="kit-empty kit-stack">
      <p class="kit-text">No prototypes yet.</p>
      <p class="kit-muted">
        Create a folder under <code class="kit-code">src/prototypes/</code> and add an
        <code class="kit-code">index.vue</code>; the route will be available immediately.
      </p>
    </div>

    <section v-for="group in groups" :key="group.title" class="kit-section">
      <h2 class="kit-heading">{{ group.title }}</h2>
      <p class="kit-muted">{{ group.hint }}</p>

      <div class="kit-grid">
        <article v-for="prototype in group.items" :key="prototype.slug" class="kit-card">
          <div>
            <RouterLink :to="open(prototype.path, prototype)" class="kit-card-title">
              {{ prototype.title }}
            </RouterLink>
            <span v-if="prototype.isReference" class="kit-badge">Reference</span>
          </div>

          <p v-if="prototype.description" class="kit-text">{{ prototype.description }}</p>

          <p class="kit-muted">
            <code class="kit-code">{{ prototype.slug }}</code> ·
            {{ screenCountLabel(prototype.screens.length) }}
            <template v-if="prototype.judgeAt !== 'desktop'">
              · {{ viewportLabel(prototype.judgeAt) }}
            </template>
            <template v-if="prototype.missingIndex"> · no index.vue</template>
          </p>

          <ul v-if="prototype.screens.length > 1" class="kit-tags">
            <li v-for="screen in prototype.screens" :key="screen.path">
              <RouterLink :to="open(screen.path, prototype)" class="kit-tag">
                {{ screen.label }}
              </RouterLink>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </main>
</template>
