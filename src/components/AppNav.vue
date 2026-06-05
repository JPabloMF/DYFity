<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkoutStore } from '../stores/workout'

const route = useRoute()
const store = useWorkoutStore()

const activeTab = computed(() => {
  if (route.name === 'week') return 'week'
  if (route.name === 'progress') return 'progress'
  return 'today'
})
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80">
    <div class="flex items-center h-16 px-2">

      <!-- Week tab -->
      <RouterLink
        :to="{ name: 'week' }"
        class="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors"
        :class="activeTab === 'week' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M7 2v4M13 2v4M3 9h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="7" cy="13" r="1" fill="currentColor"/>
          <circle cx="10" cy="13" r="1" fill="currentColor"/>
          <circle cx="13" cy="13" r="1" fill="currentColor"/>
        </svg>
        <span class="text-[10px] font-semibold">Week</span>
      </RouterLink>

      <!-- Today tab -->
      <RouterLink
        :to="{ name: 'routine', params: { day: store.selectedDay } }"
        class="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors"
        :class="activeTab === 'today' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'"
      >
        <!-- Dumbbell icon -->
        <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20">
          <rect x="2" y="8.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.7"/>
          <rect x="1" y="7" width="2" height="6" rx="0.5" fill="currentColor"/>
          <rect x="15" y="8.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.7"/>
          <rect x="17" y="7" width="2" height="6" rx="0.5" fill="currentColor"/>
          <rect x="5" y="9.25" width="10" height="1.5" rx="0.5" fill="currentColor"/>
        </svg>
        <span class="text-[10px] font-semibold">Today</span>
      </RouterLink>

      <!-- Progress tab -->
      <RouterLink
        :to="{ name: 'progress' }"
        class="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors"
        :class="activeTab === 'progress' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20">
          <path d="M3 15l4-5 3 3 3-5 4 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 17h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="text-[10px] font-semibold">Progress</span>
      </RouterLink>

    </div>
  </nav>
</template>
