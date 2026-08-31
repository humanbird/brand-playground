<!--
  src/prototypes/example/index.vue  →  Route /p/example

  Entry screen. Links to Detail.vue (→ /p/example/detail), making the flow
  clickable. A prototype that cannot be clicked through answers no question.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { DsButton } from '../../components'
import { statusColor, workOrders } from './_shared/data'
import Shell from './_shared/Shell.vue'
</script>

<template>
  <Shell title="Work orders">
    <div class="flex flex-wrap items-baseline justify-between gap-4">
      <p class="text-base text-ink-muted">{{ workOrders.length }} work orders this week</p>
      <DsButton>Create work order</DsButton>
    </div>

    <ul class="mt-6 divide-y divide-line rounded-lg border border-line">
      <li
        v-for="workOrder in workOrders"
        :key="workOrder.id"
        class="flex flex-wrap items-center gap-4 p-6"
      >
        <div class="min-w-0 flex-1">
          <RouterLink
            :to="`/p/example/detail?id=${workOrder.id}`"
            class="text-base font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
          >
            {{ workOrder.title }}
          </RouterLink>
          <p class="mt-1 text-sm text-ink-muted">
            <span class="font-mono">{{ workOrder.id }}</span> · {{ workOrder.customer }} · due
            {{ workOrder.dueDate }}
          </p>
        </div>

        <span
          class="rounded-full px-3 py-1 text-xs font-medium"
          :class="statusColor[workOrder.status]"
        >
          {{ workOrder.status }}
        </span>
      </li>
    </ul>

    <p class="mt-8 text-sm text-ink-muted">
      Assumption: work orders are assigned to a week and are not paginated. This list
      stops working well at around 40 entries.
    </p>
  </Shell>
</template>
