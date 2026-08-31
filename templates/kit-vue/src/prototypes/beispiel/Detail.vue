<!--
  src/prototypes/beispiel/Detail.vue  →  Route /p/beispiel/detail

  Zweiter Screen desselben Prototyps. Der Dateiname wird für die Route klein
  geschrieben; ein weiterer Screen wäre einfach eine weitere Datei daneben.

  Parameter kommen über die Query (?id=…) — das funktioniert auch im
  Einzeldatei-Export hinter dem Hash: #/p/beispiel/detail?id=A-2481
-->

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { DsButton } from '../../components'
import { auftragById, statusFarbe } from './_shared/data'
import Shell from './_shared/Shell.vue'

const route = useRoute()
const id = computed(() => {
  const value = route.query.id
  return typeof value === 'string' ? value : null
})
const auftrag = computed(() => auftragById(id.value))
const zurueck = { to: '/p/beispiel', label: 'Aufträge' }
</script>

<template>
  <Shell v-if="!auftrag" titel="Auftrag" :zurueck="zurueck">
    <p class="text-base text-ink">Dieser Auftrag existiert nicht.</p>
    <p class="mt-3 text-sm text-ink-muted">
      Leerer Zustand — mitgedacht, nicht weggelassen.
    </p>
    <RouterLink to="/p/beispiel" class="mt-6 inline-block">
      <DsButton variant="secondary">Zurück zur Liste</DsButton>
    </RouterLink>
  </Shell>

  <Shell v-else :titel="auftrag.titel" :zurueck="zurueck">
    <div class="flex flex-wrap items-center gap-4">
      <span class="font-mono text-sm text-ink-muted">{{ auftrag.id }}</span>
      <span
        class="rounded-full px-3 py-1 text-xs font-medium"
        :class="statusFarbe[auftrag.status]"
      >
        {{ auftrag.status }}
      </span>
    </div>

    <dl class="mt-6 grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="text-xs text-ink-muted">Kunde</dt>
        <dd class="mt-1 text-base text-ink">{{ auftrag.kunde }}</dd>
      </div>
      <div>
        <dt class="text-xs text-ink-muted">Einsatzort</dt>
        <dd class="mt-1 text-base text-ink">{{ auftrag.ort }}</dd>
      </div>
      <div>
        <dt class="text-xs text-ink-muted">Fällig</dt>
        <dd class="mt-1 text-base text-ink">{{ auftrag.faellig }}</dd>
      </div>
    </dl>

    <p class="mt-6 max-w-2xl text-base text-ink">{{ auftrag.beschreibung }}</p>

    <h2 class="mt-8 text-lg font-medium text-ink">Positionen</h2>
    <ul class="mt-4 divide-y divide-line rounded-lg border border-line">
      <li
        v-for="position in auftrag.positionen"
        :key="position.bezeichnung"
        class="flex justify-between gap-4 p-4"
      >
        <span class="text-base text-ink">{{ position.bezeichnung }}</span>
        <span class="font-mono text-sm text-ink-muted">{{ position.menge }}×</span>
      </li>
    </ul>

    <div class="mt-8 flex flex-wrap gap-3">
      <DsButton>Abschließen</DsButton>
      <DsButton variant="secondary">Termin verschieben</DsButton>
      <DsButton variant="ghost" size="sm">Protokoll ansehen</DsButton>
    </div>
  </Shell>
</template>
