<!--
  DsButton: template example component.

  GENERATOR FOLDER: `/playground` replaces src/components/ with the target design
  system's components (adopted from a code library or generated).
  DsButton remains only when the target design system has no button component.

  Pattern for generated components:
   - no hex or px values; use only token utilities from src/styles.css
   - variants as a string union, not a collection of booleans
   - keep fallthrough attributes enabled (`inheritAttrs` stays on), so prototypes
     can attach `@click`, `disabled`, and `aria-*` directly
   - declare types in the regular <script> block so the barrel can re-export them;
     this is not possible from <script setup>
   - the design/components-meta.json entry is part of the component
-->

<script lang="ts">
export type DsButtonVariant = 'primary' | 'secondary' | 'ghost'
export type DsButtonSize = 'sm' | 'md'

export type DsButtonProps = {
  variant?: DsButtonVariant
  size?: DsButtonSize
  type?: 'button' | 'submit' | 'reset'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const {
  variant = 'primary',
  size = 'md',
  type = 'button',
} = defineProps<DsButtonProps>()

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants: Record<DsButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line bg-canvas text-ink hover:bg-surface',
  ghost: 'text-accent hover:bg-surface',
}

const sizes: Record<DsButtonSize, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
}

const classes = computed(() => [base, variants[variant], sizes[size]].join(' '))
</script>

<template>
  <button :type="type" :class="classes">
    <slot />
  </button>
</template>
