<script setup>
import { computed } from 'vue'
import { useWorkoutStore } from '../stores/workout'
import ProgressRing from './ProgressRing.vue'

const store = useWorkoutStore()

const timer = computed(() => store.restTimer)

const minutes = computed(() => Math.floor(timer.value.remaining / 60))
const seconds = computed(() => String(timer.value.remaining % 60).padStart(2, '0'))
const percent = computed(() =>
  timer.value.duration > 0
    ? Math.round((timer.value.remaining / timer.value.duration) * 100)
    : 0
)

const presets = [30, 60, 90, 120, 180]

function setDuration(s) {
  store.startRestTimer(s, timer.value.exerciseId)
}

function addTime(s) {
  store.restTimer.remaining = Math.min(
    store.restTimer.remaining + s,
    store.restTimer.duration + s
  )
  store.restTimer.duration = Math.max(store.restTimer.duration, store.restTimer.remaining)
}
</script>

<template>
  <Transition name="timer-fade">
    <div
      v-if="timer.active"
      class="fixed inset-0 z-50 flex items-end justify-center pb-6 px-4 lg:items-center"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="store.stopRestTimer()"
      />

      <!-- Card -->
      <div
        class="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 animate-[slide-up_0.3s_ease-out] shadow-2xl"
      >
        <!-- Label -->
        <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest text-center mb-4">
          Rest Period
        </p>

        <!-- Ring + time -->
        <div class="flex items-center justify-center mb-6 relative">
          <ProgressRing
            :percent="percent"
            :size="140"
            :stroke-width="6"
            :color="percent > 25 ? '#34d399' : '#f87171'"
            track-color="#1e293b"
          />
          <div class="absolute text-center">
            <span class="font-mono text-4xl font-bold text-white tabular-nums">
              {{ minutes }}:{{ seconds }}
            </span>
          </div>
        </div>

        <!-- Add time buttons -->
        <div class="flex gap-2 justify-center mb-4">
          <button
            v-for="s in [15, 30]"
            :key="s"
            @click="addTime(s)"
            class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            +{{ s }}s
          </button>
        </div>

        <!-- Preset durations -->
        <div class="flex gap-2 justify-center mb-5">
          <button
            v-for="s in presets"
            :key="s"
            @click="setDuration(s)"
            :class="[
              'px-2.5 py-1 rounded-md text-xs font-semibold transition-colors',
              timer.duration === s
                ? 'bg-sky-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            ]"
          >
            {{ s >= 60 ? `${s / 60}m` : `${s}s` }}
          </button>
        </div>

        <!-- Stop button -->
        <button
          @click="store.stopRestTimer()"
          class="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-colors"
        >
          Skip Rest
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.timer-fade-enter-active,
.timer-fade-leave-active { transition: opacity 0.2s ease; }
.timer-fade-enter-from,
.timer-fade-leave-to   { opacity: 0; }
</style>
