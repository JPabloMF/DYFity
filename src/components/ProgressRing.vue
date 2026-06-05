<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, default: 0 },
  size: { type: Number, default: 48 },
  strokeWidth: { type: Number, default: 4 },
  color: { type: String, default: '#38bdf8' },
  trackColor: { type: String, default: '#1e293b' },
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => {
  const clamped = Math.min(100, Math.max(0, props.percent))
  return circumference.value * (1 - clamped / 100)
})
const center = computed(() => props.size / 2)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    class="rotate-[-90deg]"
    aria-hidden="true"
  >
    <!-- Track -->
    <circle
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke="trackColor"
      :stroke-width="strokeWidth"
    />
    <!-- Progress -->
    <circle
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
      style="transition: stroke-dashoffset 0.4s ease"
    />
  </svg>
</template>
