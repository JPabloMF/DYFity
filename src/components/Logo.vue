<script setup>
defineProps({
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <div class="flex items-center gap-2.5 select-none">
    <!-- Icon: hexagonal badge with lightning bolt -->
    <svg
      :width="compact ? 28 : 34"
      :height="compact ? 28 : 34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Outer hex -->
      <path
        d="M17 2L30 8.5V25.5L17 32L4 25.5V8.5L17 2Z"
        fill="#0f2040"
        stroke="#3b82f6"
        stroke-width="1.5"
      />
      <!-- Lightning bolt -->
      <path
        d="M19.5 7L10 18.5H16.5L14.5 27L24 15.5H17.5L19.5 7Z"
        fill="#38bdf8"
      />
    </svg>

    <!-- Wordmark -->
    <span v-if="!compact" class="font-black text-xl tracking-tight leading-none">
      <span class="text-white">DY</span><span class="text-sky-400">Fity</span>
    </span>
  </div>
</template>
