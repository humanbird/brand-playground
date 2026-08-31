<!--
  src/prototypes/beispiel/index.vue  →  Route /p/beispiel

  Einstiegs-Screen. Verlinkt auf Detail.vue (→ /p/beispiel/detail), damit der
  Ablauf durchklickbar ist: ein Prototyp, den man nicht durchklicken kann,
  beantwortet keine Frage.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { DsButton } from '../../components'
import { auftraege, statusFarbe } from './_shared/data'
import Shell from './_shared/Shell.vue'
</script>

<template>
  <Shell titel="Aufträge">
    <div class="flex flex-wrap items-baseline justify-between gap-4">
      <p class="text-base text-ink-muted">{{ auftraege.length }} Aufträge in dieser Woche</p>
      <DsButton>Auftrag anlegen</DsButton>
    </div>

    <ul class="mt-6 divide-y divide-line rounded-lg border border-line">
      <li
        v-for="auftrag in auftraege"
        :key="auftrag.id"
        class="flex flex-wrap items-center gap-4 p-6"
      >
        <div class="min-w-0 flex-1">
          <RouterLink
            :to="`/p/beispiel/detail?id=${auftrag.id}`"
            class="text-base font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
          >
            {{ auftrag.titel }}
          </RouterLink>
          <p class="mt-1 text-sm text-ink-muted">
            <span class="font-mono">{{ auftrag.id }}</span> · {{ auftrag.kunde }} · fällig
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
      Annahme: Aufträge sind einer Woche zugeordnet und werden nicht paginiert. Ab etwa
      40 Einträgen trägt diese Liste nicht mehr.
    </p>
  </Shell>
</template>
