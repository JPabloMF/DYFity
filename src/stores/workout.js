import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DAYS, ACTIVE_DAYS, REST_DAYS, REST_SESSION, WORKOUT_CYCLE } from '../data/routines'

// ─── Week helpers ─────────────────────────────────────────
function getMondayOf(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const diff = (d.getDay() + 6) % 7 // Mon=0 … Sun=6
  d.setDate(d.getDate() - diff)
  return d
}

function weekKey(mondayDate) {
  const m = mondayDate
  return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-${String(m.getDate()).padStart(2, '0')}`
}

// Reference Monday for cycle offset 0  (Empuje A starts on Monday)
const REFERENCE_MONDAY = new Date('2026-06-01')

function calcCycleOffset(mondayDate) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weeksDiff = Math.round((mondayDate - REFERENCE_MONDAY) / msPerWeek)
  const n = WORKOUT_CYCLE.length // 6
  const activeSlotsPerWeek = ACTIVE_DAYS.length // 5
  return ((weeksDiff * activeSlotsPerWeek) % n + n) % n
}

function getTodayKey() {
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return map[new Date().getDay()]
}

function setKey(weekK, day, exerciseId, setIndex) {
  return `${weekK}:${day}:${exerciseId}:${setIndex}`
}

// ─── Store ────────────────────────────────────────────────
export const useWorkoutStore = defineStore('workout', () => {
  const selectedDay = ref(getTodayKey())

  // Manual week offset in weeks (0 = current week)
  const weekDelta = ref(0)

  const currentMonday = computed(() => {
    const base = getMondayOf(new Date())
    base.setDate(base.getDate() + weekDelta.value * 7)
    return base
  })

  const currentWeekKey = computed(() => weekKey(currentMonday.value))

  const cycleOffset = computed(() => calcCycleOffset(currentMonday.value))

  // ─── Session resolver ──────────────────────────────────
  function getSessionForDay(day) {
    if (REST_DAYS.includes(day)) return REST_SESSION
    const slotIndex = ACTIVE_DAYS.indexOf(day)
    if (slotIndex === -1) return REST_SESSION
    return WORKOUT_CYCLE[(cycleOffset.value + slotIndex) % WORKOUT_CYCLE.length]
  }

  // Cycle label for UI (e.g. "Semana 1 · Ciclo A")
  const cycleLabel = computed(() => {
    const names = ['Empuje A', 'Jalón A', 'Pierna A', 'Empuje B', 'Jalón B', 'Pierna B']
    return `Lunes: ${names[cycleOffset.value]}`
  })

  // ─── Tracking storage ──────────────────────────────────
  // Key: `${weekKey}:${day}:${exerciseId}:${setIndex}`
  const completedSets = ref({})
  const loggedWeights = ref({})

  const restTimer = ref({
    active: false,
    duration: 90,
    remaining: 90,
    exerciseId: null,
    _intervalId: null,
  })

  // ─── Getters ───────────────────────────────────────────
  function isSetDone(day, exerciseId, setIndex) {
    return !!completedSets.value[setKey(currentWeekKey.value, day, exerciseId, setIndex)]
  }

  function getLoggedWeight(day, exerciseId, setIndex) {
    const k = setKey(currentWeekKey.value, day, exerciseId, setIndex)
    if (loggedWeights.value[k] !== undefined) return loggedWeights.value[k]
    const session = getSessionForDay(day)
    const ex = session?.exercises.find(e => e.id === exerciseId)
    return ex?.sets[setIndex]?.targetWeight ?? 0
  }

  function isExerciseDone(day, exerciseId) {
    const session = getSessionForDay(day)
    const ex = session?.exercises.find(e => e.id === exerciseId)
    if (!ex) return false
    return ex.sets.every((_, i) => isSetDone(day, exerciseId, i))
  }

  function getRoutineProgress(day) {
    const session = getSessionForDay(day)
    if (!session || session.type === 'rest') return { done: 0, total: 0, percent: 0, isRest: true }
    const total = session.exercises.length
    const done = session.exercises.filter(e => isExerciseDone(day, e.id)).length
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0, isRest: false }
  }

  function isRoutineDone(day) {
    const p = getRoutineProgress(day)
    return !p.isRest && p.total > 0 && p.done === p.total
  }

  function getSetProgress(day, exerciseId) {
    const session = getSessionForDay(day)
    const ex = session?.exercises.find(e => e.id === exerciseId)
    if (!ex) return { done: 0, total: 0 }
    const total = ex.sets.length
    const done = ex.sets.filter((_, i) => isSetDone(day, exerciseId, i)).length
    return { done, total }
  }

  // ─── Actions ───────────────────────────────────────────
  function selectDay(day) {
    selectedDay.value = day
  }

  function goToPrevWeek() { weekDelta.value-- }
  function goToNextWeek() { weekDelta.value++ }
  function goToCurrentWeek() { weekDelta.value = 0 }

  function toggleSet(day, exerciseId, setIndex) {
    const k = setKey(currentWeekKey.value, day, exerciseId, setIndex)
    completedSets.value[k] = !completedSets.value[k]
  }

  function updateWeight(day, exerciseId, setIndex, weight) {
    loggedWeights.value[setKey(currentWeekKey.value, day, exerciseId, setIndex)] = Number(weight)
  }

  function completeRoutine(day) {
    const session = getSessionForDay(day)
    if (!session || session.type === 'rest') return
    session.exercises.forEach(ex => {
      ex.sets.forEach((_, i) => {
        completedSets.value[setKey(currentWeekKey.value, day, ex.id, i)] = true
      })
    })
  }

  function uncompleteRoutine(day) {
    const session = getSessionForDay(day)
    if (!session) return
    session.exercises.forEach(ex => {
      ex.sets.forEach((_, i) => {
        delete completedSets.value[setKey(currentWeekKey.value, day, ex.id, i)]
      })
    })
  }

  // Rest timer
  function startRestTimer(duration, exerciseId) {
    _clearTimer()
    restTimer.value.duration = duration
    restTimer.value.remaining = duration
    restTimer.value.exerciseId = exerciseId
    restTimer.value.active = true
    restTimer.value._intervalId = setInterval(() => {
      if (restTimer.value.remaining > 0) {
        restTimer.value.remaining--
      } else {
        _clearTimer()
      }
    }, 1000)
  }

  function stopRestTimer() { _clearTimer() }

  function _clearTimer() {
    if (restTimer.value._intervalId) {
      clearInterval(restTimer.value._intervalId)
      restTimer.value._intervalId = null
    }
    restTimer.value.active = false
  }

  // ─── Computed stats ────────────────────────────────────
  const weeklyProgress = computed(() =>
    DAYS.map(day => ({ day, ...getRoutineProgress(day) }))
  )

  const completedRoutinesCount = computed(() =>
    DAYS.filter(day => isRoutineDone(day)).length
  )

  const totalVolumeKg = computed(() => {
    let vol = 0
    DAYS.forEach(day => {
      const session = getSessionForDay(day)
      if (!session || session.type === 'rest') return
      session.exercises.forEach(ex => {
        ex.sets.forEach((set, i) => {
          if (isSetDone(day, ex.id, i)) {
            vol += getLoggedWeight(day, ex.id, i) * set.reps
          }
        })
      })
    })
    return vol
  })

  const totalSetsCompleted = computed(() =>
    Object.entries(completedSets.value)
      .filter(([k, v]) => v && k.startsWith(currentWeekKey.value))
      .length
  )

  const isCurrentWeek = computed(() => weekDelta.value === 0)

  return {
    selectedDay,
    weekDelta,
    currentWeekKey,
    cycleOffset,
    cycleLabel,
    isCurrentWeek,
    completedSets,
    loggedWeights,
    restTimer,
    getSessionForDay,
    isSetDone,
    isExerciseDone,
    isRoutineDone,
    getRoutineProgress,
    getLoggedWeight,
    getSetProgress,
    selectDay,
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek,
    toggleSet,
    updateWeight,
    completeRoutine,
    uncompleteRoutine,
    startRestTimer,
    stopRestTimer,
    weeklyProgress,
    completedRoutinesCount,
    totalVolumeKg,
    totalSetsCompleted,
  }
})
