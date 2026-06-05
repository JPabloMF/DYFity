<script setup>
import { computed, ref } from 'vue'
import { useWorkoutStore } from '../stores/workout'

const props = defineProps({
  day: { type: String, required: true },
  exerciseId: { type: String, required: true },
  setIndex: { type: Number, required: true },
  set: { type: Object, required: true },
  restSeconds: { type: Number, default: 90 },
})

const store = useWorkoutStore()

const isDone = computed(() => store.isSetDone(props.day, props.exerciseId, props.setIndex))
const weight = computed({
  get: () => store.getLoggedWeight(props.day, props.exerciseId, props.setIndex),
  set: (v) => store.updateWeight(props.day, props.exerciseId, props.setIndex, v),
})

const editing = ref(false)

function toggle() {
  const wasDone = isDone.value
  store.toggleSet(props.day, props.exerciseId, props.setIndex)
  if (!wasDone) {
    // Just completed — start rest timer
    store.startRestTimer(props.restSeconds, props.exerciseId)
  }
}

function onWeightBlur() {
  editing.value = false
}

function onWeightFocus() {
  editing.value = true
}

function increment(delta) {
  const next = Math.max(0, parseFloat(weight.value) + delta)
  weight.value = Math.round(next * 4) / 4 // 0.25 step
}
</script>

<template>
  <div
    :class="[
      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
      isDone
        ? 'bg-emerald-500/8 border border-emerald-500/20'
        : 'bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/60',
    ]"
  >
    <!-- Set number -->
    <span class="text-xs font-mono font-bold text-slate-500 w-5 text-center select-none">
      {{ setIndex + 1 }}
    </span>

    <!-- Checkbox -->
    <button
      @click="toggle"
      :class="[
        'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
        isDone
          ? 'bg-emerald-500 border-emerald-500 scale-110'
          : 'border-slate-600 hover:border-emerald-500/60 hover:bg-emerald-500/10',
      ]"
      :aria-label="`Set ${setIndex + 1} ${isDone ? 'done' : 'incomplete'}`"
    >
      <svg
        v-if="isDone"
        class="w-3.5 h-3.5 text-white"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path d="M2 7l4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Reps -->
    <div class="flex-1">
      <span
        :class="[
          'font-mono text-sm font-semibold',
          isDone ? 'text-emerald-300' : 'text-slate-200',
        ]"
      >
        {{ set.reps }}
        <span class="text-slate-500 font-normal text-xs ml-0.5">reps</span>
      </span>
    </div>

    <!-- Weight control -->
    <div class="flex items-center gap-1.5">
      <button
        @click="increment(-2.5)"
        class="w-6 h-6 rounded-md bg-slate-700 text-slate-300 text-sm font-bold hover:bg-slate-600 transition-colors flex items-center justify-center"
        aria-label="Decrease weight"
      >−</button>

      <div class="relative">
        <input
          type="number"
          :value="weight"
          @change="weight = $event.target.value"
          @focus="onWeightFocus"
          @blur="onWeightBlur"
          :class="[
            'w-16 text-center font-mono text-sm font-semibold rounded-lg py-1 px-1 border transition-colors',
            isDone
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-200 focus:border-sky-500 focus:outline-none',
          ]"
          step="2.5"
          min="0"
        />
        <span class="absolute -bottom-4 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">kg</span>
      </div>

      <button
        @click="increment(2.5)"
        class="w-6 h-6 rounded-md bg-slate-700 text-slate-300 text-sm font-bold hover:bg-slate-600 transition-colors flex items-center justify-center"
        aria-label="Increase weight"
      >+</button>
    </div>

    <!-- Target indicator -->
    <span
      v-if="weight !== set.targetWeight"
      :class="[
        'text-[10px] font-mono px-1.5 py-0.5 rounded',
        Number(weight) > set.targetWeight
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-amber-500/15 text-amber-400',
      ]"
      :title="`Target: ${set.targetWeight}kg`"
    >
      {{ Number(weight) > set.targetWeight ? '↑' : '↓' }}{{ set.targetWeight }}
    </span>
  </div>
</template>
