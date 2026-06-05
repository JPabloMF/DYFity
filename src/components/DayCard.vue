<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkoutStore } from '../stores/workout'
import { DAY_LABELS } from '../data/routines'
import ProgressRing from './ProgressRing.vue'

const props = defineProps({
  day: { type: String, required: true },
  isToday: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
})

const store = useWorkoutStore()
const router = useRouter()

const session = computed(() => store.getSessionForDay(props.day))
const progress = computed(() => store.getRoutineProgress(props.day))
const isSelected = computed(() => store.selectedDay === props.day)
const isDone = computed(() => store.isRoutineDone(props.day))

const colorMap = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  emerald: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  cyan: '#22d3ee',
  slate: '#64748b',
}

const accentColor = computed(() => colorMap[session.value?.color] ?? '#3b82f6')

function select() {
  store.selectDay(props.day)
  router.push({ name: 'routine', params: { day: props.day } })
}
</script>

<template>
  <button
    @click="select"
    :class="[
      'w-full text-left rounded-xl border transition-all duration-200 group',
      compact ? 'p-3' : 'p-4',
      isSelected
        ? 'bg-slate-800 border-slate-600 ring-1 ring-slate-500'
        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700',
    ]"
  >
    <div class="flex items-center gap-3">
      <!-- Progress ring -->
      <div class="relative flex-shrink-0">
        <ProgressRing
          :percent="progress.percent"
          :size="compact ? 40 : 44"
          :stroke-width="3"
          :color="isDone ? '#34d399' : accentColor"
          track-color="#1e293b"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <span v-if="isDone" class="text-emerald-400 text-sm">✓</span>
          <span v-else-if="session?.type === 'rest'" class="text-slate-500 text-xs">—</span>
          <span v-else class="text-slate-400 text-[10px] font-mono font-bold">{{ progress.percent }}%</span>
        </div>
      </div>

      <!-- Text -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-bold text-sm text-slate-100">{{ DAY_LABELS[day] }}</span>
          <span
            v-if="isToday"
            class="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400"
          >Hoy</span>
        </div>
        <span class="text-xs text-slate-400 truncate block mt-0.5">
          {{ session?.tag }}
        </span>
      </div>

      <!-- Progress count -->
      <div v-if="!compact && session?.type !== 'rest'" class="text-right flex-shrink-0">
        <span class="text-xs font-mono text-slate-500">{{ progress.done }}/{{ progress.total }}</span>
      </div>

      <!-- Arrow -->
      <svg class="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 16 16">
        <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </button>
</template>
