<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkoutStore } from '../stores/workout'
import { DAYS, DAY_LABELS } from '../data/routines'
import ExerciseCard from '../components/ExerciseCard.vue'
import ProgressRing from '../components/ProgressRing.vue'

const route = useRoute()
const router = useRouter()
const store = useWorkoutStore()

const day = computed(() => route.params.day)
const session = computed(() => store.getSessionForDay(day.value))
const progress = computed(() => store.getRoutineProgress(day.value))
const isDone = computed(() => store.isRoutineDone(day.value))

const todayKey = (() => {
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return map[new Date().getDay()]
})()

const dayIndex = computed(() => DAYS.indexOf(day.value))

// Swipe to navigate between days
const touchStartX = ref(0)
const touchStartY = ref(0)

function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX.value
  const dy = e.changedTouches[0].clientY - touchStartY.value
  if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx) * 0.7) return
  if (dx < 0 && dayIndex.value < DAYS.length - 1) navigateToDay(DAYS[dayIndex.value + 1])
  else if (dx > 0 && dayIndex.value > 0) navigateToDay(DAYS[dayIndex.value - 1])
}

function navigateToDay(d) {
  store.selectDay(d)
  router.push({ name: 'routine', params: { day: d } })
}

const colorAccentMap = {
  blue:    { text: 'text-blue-400',    ring: '#3b82f6' },
  violet:  { text: 'text-violet-400',  ring: '#8b5cf6' },
  emerald: { text: 'text-emerald-400', ring: '#34d399' },
  amber:   { text: 'text-amber-400',   ring: '#fbbf24' },
  rose:    { text: 'text-rose-400',    ring: '#fb7185' },
  cyan:    { text: 'text-cyan-400',    ring: '#22d3ee' },
  slate:   { text: 'text-slate-500',   ring: '#64748b' },
}

const accent = computed(() => colorAccentMap[session.value?.color] ?? colorAccentMap.blue)

function toggleAllSets() {
  if (isDone.value) store.uncompleteRoutine(day.value)
  else store.completeRoutine(day.value)
}

onMounted(() => store.selectDay(day.value))
</script>

<template>
  <div
    class="h-full flex flex-col overflow-hidden"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Day strip (swipeable) -->
    <div class="flex gap-1 px-4 py-3 border-b border-slate-800 overflow-x-auto scrollbar-none flex-shrink-0">
      <button
        v-for="d in DAYS"
        :key="d"
        @click="navigateToDay(d)"
        :class="[
          'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
          d === day
            ? 'bg-sky-500 text-white'
            : d === todayKey && store.isCurrentWeek
              ? 'bg-slate-800 text-sky-400 ring-1 ring-sky-500/40'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800',
        ]"
      >
        {{ DAY_LABELS[d] }}
      </button>
    </div>

    <!-- Session header -->
    <div class="px-4 pt-4 pb-3 flex-shrink-0">
      <div class="flex items-start gap-4">
        <div class="relative flex-shrink-0">
          <ProgressRing
            :percent="progress.percent"
            :size="60"
            :stroke-width="5"
            :color="isDone ? '#34d399' : accent.ring"
            track-color="#1e293b"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <span v-if="isDone" class="text-emerald-400 text-lg">✓</span>
            <span v-else class="text-xs font-mono font-bold text-slate-300">{{ progress.percent }}%</span>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-xl font-black text-white">{{ session?.label }}</h1>
            <span
              v-if="day === todayKey && store.isCurrentWeek"
              class="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-500/15 px-1.5 py-0.5 rounded"
            >Hoy</span>
          </div>
          <p :class="['text-sm font-semibold mt-0.5', accent.text]">{{ session?.tag }}</p>
          <p v-if="session?.type !== 'rest'" class="text-xs text-slate-500 mt-1">
            {{ progress.done }}/{{ progress.total }} ejercicios completados
          </p>
        </div>

        <button
          v-if="session?.type === 'strength'"
          @click="toggleAllSets"
          :class="[
            'flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all',
            isDone
              ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200',
          ]"
        >{{ isDone ? 'Desmarcar' : 'Marcar todo' }}</button>
      </div>
    </div>

    <!-- Rest day -->
    <div
      v-if="session?.type === 'rest'"
      class="flex-1 flex flex-col items-center justify-center px-6 pb-24 lg:pb-6 gap-4"
    >
      <div class="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
        <span class="text-4xl">🛌</span>
      </div>
      <div class="text-center">
        <h2 class="text-xl font-bold text-slate-200">Día de Descanso</h2>
        <p class="text-sm text-slate-500 mt-1 max-w-xs">
          La recuperación es donde ocurren las ganancias. Prioriza el sueño, la proteína y la movilidad.
        </p>
      </div>
    </div>

    <!-- Exercise list -->
    <div
      v-else
      class="flex-1 overflow-y-auto px-4 pb-24 lg:pb-6 pt-1 space-y-2.5"
    >
      <TransitionGroup name="list" tag="div" class="space-y-2.5">
        <ExerciseCard
          v-for="exercise in session?.exercises"
          :key="exercise.id"
          :day="day"
          :exercise="exercise"
        />
      </TransitionGroup>

      <Transition name="fade-in">
        <div
          v-if="isDone"
          class="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center"
        >
          <p class="text-emerald-400 font-bold text-sm">¡Sesión Completada!</p>
          <p class="text-slate-500 text-xs mt-1">{{ progress.total }} ejercicios registrados</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }

.list-move, .list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateY(8px); }
.list-leave-to   { opacity: 0; transform: translateY(-8px); }

.fade-in-enter-active { animation: fade-in 0.4s ease-out; }
</style>
