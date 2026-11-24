<script setup lang="ts">
import AiConciergeDrawer from '~/components/ai/AiConciergeDrawer.vue'
import CommandPalette from '~/components/ai/CommandPalette.vue'
import RequestDemoModal from '~/components/modal/RequestDemoModal.vue'
import AboutModal from '~/components/modal/AboutModal.vue'
import NewsModal from '~/components/modal/NewsModal.vue'
import UserGroupsModal from '~/components/modal/UserGroupsModal.vue'
</script>

<template>
  <div class="relative min-h-screen bg-[#F7F9F8] text-[#09140E] selection:bg-emerald-500/20 selection:text-[#09140E]">
    <!-- Subtle Architectural Tech Dot Grid -->
    <div class="fixed inset-0 bg-grid-dots pointer-events-none opacity-50 z-0"></div>

    <!-- Subtle Ambient Emerald Lighting on Off-White Canvas -->
    <div class="ambient-glow bg-emerald-300/60 -top-44 -left-32"></div>
    <div class="ambient-glow bg-teal-200/50 top-1/3 -right-40"></div>

    <!-- Main Page Content -->
    <NuxtPage />

    <!-- Global Floating Widgets & Modals -->
    <AiConciergeDrawer />
    <CommandPalette />
    <RequestDemoModal />
    <AboutModal />
    <NewsModal />
    <UserGroupsModal />
  </div>
</template>
