<script setup>
import AppHeader from './components/AppHeader.vue'
import AppNav from './components/AppNav.vue'
import RestTimer from './components/RestTimer.vue'
import WeekView from './views/WeekView.vue'
</script>

<template>
  <div class="flex flex-col h-full" style="background:#03091a;color:#f1f5f9;">
    <!-- Global rest timer modal -->
    <RestTimer />

    <!-- Top header -->
    <AppHeader />

    <!-- ── Desktop layout (lg+) ───────────────────────────────── -->
    <div class="hidden lg:flex flex-1 overflow-hidden">
      <!-- Left sidebar: always the week overview -->
      <aside class="w-72 flex-shrink-0 border-r border-slate-800 overflow-hidden flex flex-col">
        <WeekView />
      </aside>

      <!-- Main panel: routed content -->
      <main class="flex-1 overflow-hidden flex flex-col">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" class="flex-1 h-full" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <!-- ── Mobile layout (<lg) ────────────────────────────────── -->
    <div class="lg:hidden flex-1 overflow-hidden flex flex-col">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" class="flex-1 h-full" />
        </Transition>
      </RouterView>
    </div>

    <!-- Bottom navigation — mobile only -->
    <AppNav class="lg:hidden" />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
