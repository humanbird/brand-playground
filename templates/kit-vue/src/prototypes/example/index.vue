<!--
  src/prototypes/example/index.vue  →  Route /p/example

  Entry screen. Links to Detail.vue (→ /p/example/detail), making the flow
  clickable. A prototype that cannot be clicked through answers no question.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { DsButton } from '../../components'
import { auftraege, statusFarbe } from './_shared/data'
import Shell from './_shared/Shell.vue'
</script>

<template>
  <Shell titel="Work orders">
    <div class="flex flex-wrap items-baseline justify-between gap-4">
      <p class="text-base text-ink-muted">{{ auftraege.length }} work orders this week</p>
      <DsButton>Create work order</DsButton>
    </div>

    <ul class="mt-6 divide-y divide-line rounded-lg border border-line">
      <li
        v-for="auftrag in auftraege"
        :key="auftrag.id"
        class="flex flex-wrap items-center gap-4 p-6"
      >
        <div class="min-w-0 flex-1">
          <RouterLink
            :to="`/p/example/detail?id=${auftrag.id}`"
            class="text-base font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
          >
            {{ auftrag.titel }}
          </RouterLink>
          <p class="mt-1 text-sm text-ink-muted">
            <span class="font-mono">{{ auftrag.id }}</span> · {{ auftrag.kunde }} · due
            {{ auftrag.faellig }}
          </p>
        </div>

        <span
          class="rounded-full px-3 py-1 text-xs font-medium"
          :class="statusFarbe[auftrag.status]"
        >
          {{ auftrag.status }}
        </span>
      </li>
    </ul>

    <p class="mt-8 text-sm text-ink-muted">
      Assumption: work orders are assigned to a week and are not paginated. This list
      stops working well at around 40 entries.
    </p>
  </Shell>
</template>
