<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkoutStore } from '../stores/workout'

const props = defineProps({
  day: { type: String, required: true },
  exercise: { type: Object, required: true },
})

const store = useWorkoutStore()
const router = useRouter()

const isDone = computed(() => store.isExerciseDone(props.day, props.exercise.id))
const progress = computed(() => store.getSetProgress(props.day, props.exercise.id))

const hasVideo = computed(() => props.exercise.guide?.type === 'video')

function openDetail() {
  router.push({
    name: 'exercise',
    params: { day: props.day, exerciseId: props.exercise.id },
  })
}
</script>

<template>
  <div
    :class="[
      'group relative rounded-xl border transition-all duration-200 overflow-hidden',
      isDone
        ? 'bg-emerald-500/5 border-emerald-500/25'
        : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600',
    ]"
  >
    <!-- Done stripe -->
    <div
      v-if="isDone"
      class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl"
    />

    <button
      @click="openDetail"
      class="w-full text-left px-4 py-4 pl-5"
    >
      <div class="flex items-start gap-3">
        <!-- Guide type icon -->
        <div
          :class="[
            'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
            isDone ? 'bg-emerald-500/15' : 'bg-slate-700',
          ]"
        >
          <!-- Video icon -->
          <svg v-if="hasVideo" class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6 4l6 4-6 4V4z"/>
          </svg>
          <!-- Image icon -->
          <svg v-else class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 16 16">
            <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="5.5" cy="6.5" r="1" fill="currentColor"/>
            <path d="M2 11l3.5-3 3 2.5 2.5-2 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h3
              :class="[
                'font-semibold text-sm',
                isDone ? 'text-emerald-300' : 'text-slate-100',
              ]"
            >
              {{ exercise.name }}
            </h3>
            <!-- Done badge -->
            <span
              v-if="isDone"
              class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded"
            >Done</span>
          </div>

          <!-- Muscles -->
          <div class="flex flex-wrap gap-1 mt-1.5">
            <span
              v-for="muscle in exercise.muscles.slice(0, 3)"
              :key="muscle"
              class="text-[10px] font-medium text-slate-500 bg-slate-700/60 px-1.5 py-0.5 rounded"
            >
              {{ muscle }}
            </span>
          </div>

          <!-- Sets summary -->
          <div class="flex items-center gap-3 mt-2">
            <span class="font-mono text-xs text-slate-400">
              {{ exercise.sets.length }} sets
              · {{ exercise.sets[0]?.reps }}–{{ exercise.sets.at(-1)?.reps }} reps
              · {{ exercise.sets[0]?.targetWeight }}kg
            </span>
          </div>
        </div>

        <!-- Progress + arrow -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <span
            :class="[
              'font-mono text-xs font-semibold px-2 py-1 rounded-lg',
              isDone
                ? 'bg-emerald-500/15 text-emerald-400'
                : progress.done > 0
                  ? 'bg-sky-500/15 text-sky-400'
                  : 'bg-slate-700 text-slate-500',
            ]"
          >
            {{ progress.done }}/{{ progress.total }}
          </span>
          <svg class="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 16 16">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </button>
  </div>
</template>
