<!--
  src/prototypes/example/Detail.vue  →  Route /p/example/detail

  Second screen in the same prototype. The file name is lowercased for the
  route; another screen would simply be another file alongside it.

  Parameters are passed through the query string (?id=…), which also works in
  the single-file export after the hash: #/p/example/detail?id=A-2481
-->

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { DsButton } from '../../components'
import { statusColor, workOrderById } from './_shared/data'
import Shell from './_shared/Shell.vue'

const route = useRoute()
const id = computed(() => {
  const value = route.query.id
  return typeof value === 'string' ? value : null
})
const workOrder = computed(() => workOrderById(id.value))
const back = { to: '/p/example', label: 'Work orders' }
</script>

<template>
  <Shell v-if="!workOrder" title="Work order" :back="back">
    <p class="text-base text-ink">This work order does not exist.</p>
    <p class="mt-3 text-sm text-ink-muted">
      Empty state: considered explicitly, not omitted.
    </p>
    <RouterLink to="/p/example" class="mt-6 inline-block">
      <DsButton variant="secondary">Back to list</DsButton>
    </RouterLink>
  </Shell>

  <Shell v-else :title="workOrder.title" :back="back">
    <div class="flex flex-wrap items-center gap-4">
      <span class="font-mono text-sm text-ink-muted">{{ workOrder.id }}</span>
      <span
        class="rounded-full px-3 py-1 text-xs font-medium"
        :class="statusColor[workOrder.status]"
      >
        {{ workOrder.status }}
      </span>
    </div>

    <dl class="mt-6 grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="text-xs text-ink-muted">Customer</dt>
        <dd class="mt-1 text-base text-ink">{{ workOrder.customer }}</dd>
      </div>
      <div>
        <dt class="text-xs text-ink-muted">Service location</dt>
        <dd class="mt-1 text-base text-ink">{{ workOrder.location }}</dd>
      </div>
      <div>
        <dt class="text-xs text-ink-muted">Due</dt>
        <dd class="mt-1 text-base text-ink">{{ workOrder.dueDate }}</dd>
      </div>
    </dl>

    <p class="mt-6 max-w-2xl text-base text-ink">{{ workOrder.description }}</p>

    <h2 class="mt-8 text-lg font-medium text-ink">Line items</h2>
    <ul class="mt-4 divide-y divide-line rounded-lg border border-line">
      <li
        v-for="item in workOrder.items"
        :key="item.name"
        class="flex justify-between gap-4 p-4"
      >
        <span class="text-base text-ink">{{ item.name }}</span>
        <span class="font-mono text-sm text-ink-muted">{{ item.quantity }}×</span>
      </li>
    </ul>

    <div class="mt-8 flex flex-wrap gap-3">
      <DsButton>Complete</DsButton>
      <DsButton variant="secondary">Reschedule</DsButton>
      <DsButton variant="ghost" size="sm">View service report</DsButton>
    </div>
  </Shell>
</template>
