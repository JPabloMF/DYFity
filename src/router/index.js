import { createRouter, createWebHistory } from 'vue-router'

const getTodayKey = () => {
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return map[new Date().getDay()]
}

const routes = [
  {
    path: '/',
    redirect: () => ({ name: 'routine', params: { day: getTodayKey() } }),
  },
  {
    path: '/week',
    name: 'week',
    component: () => import('../views/WeekView.vue'),
  },
  {
    path: '/routine/:day',
    name: 'routine',
    component: () => import('../views/RoutineView.vue'),
  },
  {
    path: '/exercise/:day/:exerciseId',
    name: 'exercise',
    component: () => import('../views/ExerciseDetailView.vue'),
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/ProgressView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
