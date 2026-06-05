<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkoutStore } from '../stores/workout'
import SetRow from '../components/SetRow.vue'
import ProgressRing from '../components/ProgressRing.vue'

const route = useRoute()
const router = useRouter()
const store = useWorkoutStore()

const day = computed(() => route.params.day)
const exerciseId = computed(() => route.params.exerciseId)

const session = computed(() => store.getSessionForDay(day.value))
const exercise = computed(() =>
  session.value?.exercises.find(e => e.id === exerciseId.value)
)

const isDone = computed(() => store.isExerciseDone(day.value, exerciseId.value))
const setProgress = computed(() => store.getSetProgress(day.value, exerciseId.value))

const exList = computed(() => session.value?.exercises ?? [])
const currentIdx = computed(() => exList.value.findIndex(e => e.id === exerciseId.value))
const prevEx = computed(() => currentIdx.value > 0 ? exList.value[currentIdx.value - 1] : null)
const nextEx = computed(() => currentIdx.value < exList.value.length - 1 ? exList.value[currentIdx.value + 1] : null)

function navigateTo(ex) {
  router.push({ name: 'exercise', params: { day: day.value, exerciseId: ex.id } })
}

function goBack() {
  router.push({ name: 'routine', params: { day: day.value } })
}

// Video player simulation (local video placeholder)
const videoPlaying = ref(false)
const videoProgress = ref(0)
const videoInterval = ref(null)

function toggleVideo() {
  if (videoPlaying.value) {
    clearInterval(videoInterval.value)
    videoPlaying.value = false
  } else {
    videoPlaying.value = true
    videoInterval.value = setInterval(() => {
      videoProgress.value = (videoProgress.value + 0.5) % 100
    }, 50)
  }
}

function scrubVideo(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  videoProgress.value = Math.round(((e.clientX - rect.left) / rect.width) * 100)
}

// YouTube embed
function parseYoutubeId(url) {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

const youtubeEmbedUrl = computed(() => {
  const id = parseYoutubeId(exercise.value?.guide?.src)
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : null
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden" v-if="exercise">
    <!-- Header bar -->
    <div class="flex items-center gap-3 px-4 h-12 flex-shrink-0 border-b border-slate-800">
      <button
        @click="goBack"
        class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors"
      >
        <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 20 20">
          <path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="text-xs text-slate-500 font-medium flex-1 truncate">
        {{ session?.label }} · {{ session?.tag }}
      </span>
      <span class="font-mono text-xs text-slate-500">{{ currentIdx + 1 }}/{{ exList.length }}</span>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto pb-24 lg:pb-6">
      <!-- Guide media -->
      <div class="relative w-full bg-slate-900 overflow-hidden" style="aspect-ratio: 16/9;">

        <!-- ① YouTube embed -->
        <template v-if="exercise.guide.type === 'youtube' && youtubeEmbedUrl">
          <iframe
            :src="youtubeEmbedUrl"
            class="absolute inset-0 w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </template>

        <!-- ② Local image -->
        <template v-else-if="exercise.guide.type === 'image' && exercise.guide.src">
          <img
            :src="exercise.guide.src"
            :alt="exercise.name"
            class="absolute inset-0 w-full h-full object-contain"
          />
        </template>

        <!-- ③ Local video -->
        <template v-else-if="exercise.guide.type === 'video' && exercise.guide.src">
          <video
            :src="exercise.guide.src"
            class="absolute inset-0 w-full h-full object-contain"
            controls
            playsinline
            loop
          />
        </template>

        <!-- ④ Placeholder (no src yet) -->
        <template v-else>
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div class="relative">
              <div class="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                <svg class="w-14 h-14 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="4" r="2"/>
                  <path d="M12 6v6M8 14l4-2 4 2M9 9l-2 3h10l-2-3"/>
                  <line x1="10" y1="12" x2="8" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <line x1="14" y1="12" x2="16" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <rect x="4" y="8" width="16" height="2" rx="1" opacity="0.5"/>
                  <rect x="2" y="7" width="3" height="4" rx="0.5" opacity="0.7"/>
                  <rect x="19" y="7" width="3" height="4" rx="0.5" opacity="0.7"/>
                </svg>
              </div>
            </div>
            <p class="text-slate-600 text-xs font-medium">Sin guía · próximamente</p>
          </div>
        </template>

      </div>

      <!-- Exercise info -->
      <div class="px-4 pt-4">
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-xl font-black text-white">{{ exercise.name }}</h1>
              <span v-if="isDone" class="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                Listo
              </span>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span
                v-for="muscle in exercise.muscles"
                :key="muscle"
                class="text-xs font-medium text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full"
              >{{ muscle }}</span>
            </div>
          </div>
          <div class="relative flex-shrink-0">
            <ProgressRing
              :percent="setProgress.total > 0 ? Math.round((setProgress.done / setProgress.total) * 100) : 0"
              :size="48"
              :stroke-width="4"
              :color="isDone ? '#34d399' : '#38bdf8'"
              track-color="#1e293b"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-[10px] font-mono font-bold text-slate-300">
                {{ setProgress.done }}/{{ setProgress.total }}
              </span>
            </div>
          </div>
        </div>

        <p class="text-sm text-slate-400 leading-relaxed mt-3 mb-5">{{ exercise.description }}</p>

        <!-- Sets section -->
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500">Series</h2>
          <div class="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Descanso: {{ exercise.restSeconds }}s</span>
            <button
              @click="store.startRestTimer(exercise.restSeconds, exercise.id)"
              class="px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 transition-colors font-semibold"
            >Iniciar</button>
          </div>
        </div>

        <div class="space-y-2.5 mb-6">
          <SetRow
            v-for="(set, i) in exercise.sets"
            :key="i"
            :day="day"
            :exercise-id="exercise.id"
            :set-index="i"
            :set="set"
            :rest-seconds="exercise.restSeconds"
          />
        </div>

        <!-- Target box -->
        <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 mb-6">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Objetivo</p>
          <p class="font-mono text-sm text-slate-300">
            {{ exercise.sets.length }}×{{ exercise.sets[0]?.reps }}
            · {{ exercise.sets[0]?.targetWeight }}–{{ exercise.sets.at(-1)?.targetWeight }}kg
          </p>
        </div>
      </div>

      <!-- Prev / Next navigation -->
      <div class="flex gap-3 px-4 mb-4">
        <button
          v-if="prevEx"
          @click="navigateTo(prevEx)"
          class="flex-1 flex items-center gap-2 px-3 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition-colors text-left"
        >
          <svg class="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 16 16">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="min-w-0">
            <p class="text-[10px] text-slate-600 font-semibold uppercase">Anterior</p>
            <p class="text-xs text-slate-300 font-medium truncate">{{ prevEx.name }}</p>
          </div>
        </button>
        <div v-else class="flex-1" />

        <button
          v-if="nextEx"
          @click="navigateTo(nextEx)"
          class="flex-1 flex items-center justify-end gap-2 px-3 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition-colors text-right"
        >
          <div class="min-w-0">
            <p class="text-[10px] text-slate-600 font-semibold uppercase">Siguiente</p>
            <p class="text-xs text-slate-300 font-medium truncate">{{ nextEx.name }}</p>
          </div>
          <svg class="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 16 16">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div v-else class="flex-1 flex items-center justify-center">
    <p class="text-slate-500">Ejercicio no encontrado.</p>
  </div>
</template>
