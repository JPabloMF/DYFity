<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Logo from './Logo.vue'

const route = useRoute()
const router = useRouter()

const showBack = computed(() =>
  route.name === 'exercise'
)

function goBack() {
  router.back()
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-navy-950/90 backdrop-blur-md border-b border-slate-800/80">
    <div class="flex items-center h-14 px-4 gap-4">
      <!-- Back button (mobile exercise detail) -->
      <button
        v-if="showBack"
        @click="goBack"
        class="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors"
        aria-label="Go back"
      >
        <svg class="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 20 20">
          <path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Logo -->
      <RouterLink to="/" class="flex-shrink-0">
        <Logo />
      </RouterLink>

      <div class="flex-1" />

      <!-- Desktop nav pills -->
      <nav class="hidden lg:flex items-center gap-1">
        <RouterLink
          :to="{ name: 'progress' }"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            route.name === 'progress'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
          ]"
        >
          Progress
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
