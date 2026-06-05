<script setup>
import { computed } from 'vue'
import { useWorkoutStore } from '../stores/workout'
import { DAYS, DAY_LABELS, ACTIVE_DAYS } from '../data/routines'
import ProgressRing from '../components/ProgressRing.vue'

const store = useWorkoutStore()

const weeklyData = computed(() =>
  DAYS.map(day => ({
    day,
    label: DAY_LABELS[day],
    session: store.getSessionForDay(day),
    progress: store.getRoutineProgress(day),
    done: store.isRoutineDone(day),
  }))
)

const strengthDays = computed(() =>
  weeklyData.value.filter(d => d.session?.type === 'strength')
)

const weekCompletion = computed(() => {
  const total = strengthDays.value.length
  const done = strengthDays.value.filter(d => d.done).length
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
})

const totalSets = computed(() => store.totalSetsCompleted)
const totalVolume = computed(() => store.totalVolumeKg)
const completedRoutines = computed(() => store.completedRoutinesCount)

const colorMap = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  emerald: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  cyan: '#22d3ee',
  slate: '#475569',
}

function getAccentColor(day) {
  return colorMap[store.getSessionForDay(day)?.color] ?? '#3b82f6'
}

const stats = computed(() => [
  {
    label: 'Semana',
    value: `${weekCompletion.value.percent}%`,
    sub: `${weekCompletion.value.done}/${weekCompletion.value.total} sesiones`,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
  },
  {
    label: 'Volumen Total',
    value: totalVolume.value >= 1000
      ? `${(totalVolume.value / 1000).toFixed(1)}t`
      : `${totalVolume.value}kg`,
    sub: 'Peso × reps registrado',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    label: 'Series Completadas',
    value: String(totalSets.value),
    sub: 'Esta semana',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Sesiones',
    value: String(completedRoutines.value),
    sub: `De ${weekCompletion.value.total} planificadas`,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
])
</script>

<template>
  <div class="h-full overflow-y-auto pb-24 lg:pb-6">
    <!-- Hero ring -->
    <div class="flex flex-col items-center pt-6 pb-4 px-4">
      <div class="relative">
        <ProgressRing
          :percent="weekCompletion.percent"
          :size="140"
          :stroke-width="8"
          :color="weekCompletion.percent === 100 ? '#34d399' : '#38bdf8'"
          track-color="#1e293b"
        />
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="font-black text-4xl text-white tabular-nums">{{ weekCompletion.percent }}%</span>
          <span class="text-xs text-slate-500 mt-0.5">esta semana</span>
        </div>
      </div>
      <h1 class="text-xl font-black text-white mt-4">Progreso Semanal</h1>
      <p class="text-sm text-slate-500 mt-1">
        {{ weekCompletion.done }} de {{ weekCompletion.total }} sesiones completadas
      </p>
      <!-- Cycle label -->
      <span class="text-[11px] text-slate-600 mt-1.5 font-medium">{{ store.cycleLabel }}</span>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 gap-3 px-4 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        :class="['rounded-xl p-4 border border-slate-800', stat.bg]"
      >
        <p class="text-xs text-slate-500 font-medium mb-1">{{ stat.label }}</p>
        <p :class="['text-2xl font-black tabular-nums', stat.color]">{{ stat.value }}</p>
        <p class="text-[11px] text-slate-600 mt-0.5">{{ stat.sub }}</p>
      </div>
    </div>

    <!-- Day breakdown bar chart -->
    <div class="px-4 mb-6">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Desglose Diario</h2>
      <div class="space-y-2">
        <div v-for="item in weeklyData" :key="item.day" class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-500 w-8 flex-shrink-0">{{ item.label }}</span>
          <div class="flex-1 h-6 rounded-lg bg-slate-800 overflow-hidden relative">
            <div
              :class="['h-full rounded-lg transition-all duration-500', item.done ? 'opacity-100' : 'opacity-70']"
              :style="{
                width: item.session?.type === 'rest' ? '100%' : `${item.progress.percent}%`,
                backgroundColor: item.session?.type === 'rest' ? '#1e293b' : getAccentColor(item.day),
                minWidth: item.session?.type !== 'rest' && item.progress.done > 0 ? '4px' : '0',
              }"
            />
            <span
              v-if="item.session?.type === 'rest'"
              class="absolute inset-0 flex items-center px-2 text-xs text-slate-600 font-medium"
            >Descanso</span>
          </div>
          <span class="text-xs font-mono text-slate-500 w-10 text-right flex-shrink-0">
            <template v-if="item.session?.type === 'rest'">—</template>
            <template v-else-if="item.done">✓</template>
            <template v-else>{{ item.progress.percent }}%</template>
          </span>
        </div>
      </div>
    </div>

    <!-- Per-session detail -->
    <div class="px-4">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Sesiones</h2>
      <div class="space-y-2">
        <div
          v-for="item in strengthDays"
          :key="item.day"
          :class="[
            'flex items-center gap-3 p-3 rounded-xl border transition-all',
            item.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/40 border-slate-700/50',
          ]"
        >
          <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: getAccentColor(item.day) }" />
          <div class="flex-1 min-w-0">
            <p :class="['text-sm font-semibold', item.done ? 'text-emerald-300' : 'text-slate-200']">
              {{ item.session?.label }}
            </p>
            <p class="text-xs text-slate-500 truncate">{{ item.session?.tag }}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p :class="['font-mono text-xs font-bold', item.done ? 'text-emerald-400' : 'text-slate-500']">
              {{ item.progress.done }}/{{ item.progress.total }}
            </p>
            <p class="text-[10px] text-slate-600">ejercicios</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
