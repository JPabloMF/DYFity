<script setup>
import { computed } from 'vue'
import { useWorkoutStore } from '../stores/workout'
import { DAYS, ACTIVE_DAYS } from '../data/routines'
import DayCard from '../components/DayCard.vue'

const store = useWorkoutStore()

const todayKey = (() => {
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return map[new Date().getDay()]
})()

const weekProgress = computed(() => {
  const done = ACTIVE_DAYS.filter(d => store.isRoutineDone(d)).length
  return { done, total: ACTIVE_DAYS.length }
})

const weekLabel = computed(() => {
  if (store.isCurrentWeek) return 'Esta Semana'
  if (store.weekDelta === 1) return 'Próxima Semana'
  if (store.weekDelta === -1) return 'Semana Pasada'
  return store.weekDelta > 0 ? `+${store.weekDelta} semanas` : `${store.weekDelta} semanas`
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Week header -->
    <div class="px-4 pt-4 pb-3 border-b border-slate-800 flex-shrink-0">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h2 class="text-sm font-bold text-slate-100">{{ weekLabel }}</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ weekProgress.done }}/{{ weekProgress.total }} sesiones completadas
          </p>
        </div>

        <!-- Week navigation arrows -->
        <div class="flex items-center gap-1">
          <button
            @click="store.goToPrevWeek()"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Semana anterior"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 4l-4 4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            v-if="!store.isCurrentWeek"
            @click="store.goToCurrentWeek()"
            class="text-[10px] font-bold text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/15 hover:bg-sky-500/25 transition-colors"
          >Hoy</button>
          <button
            @click="store.goToNextWeek()"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Próxima semana"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Cycle label + mini bars -->
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
          {{ store.cycleLabel }}
        </span>
        <div class="flex gap-1">
          <div
            v-for="day in ACTIVE_DAYS"
            :key="day"
            :class="[
              'w-2 h-4 rounded-full transition-all',
              store.isRoutineDone(day)
                ? 'bg-emerald-500'
                : store.getRoutineProgress(day).done > 0
                  ? 'bg-sky-500/50'
                  : 'bg-slate-700',
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Day list -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <DayCard
        v-for="day in DAYS"
        :key="day"
        :day="day"
        :is-today="day === todayKey && store.isCurrentWeek"
        compact
      />
    </div>
  </div>
</template>
