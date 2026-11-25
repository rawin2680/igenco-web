<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppModal } from '~/composables/useModal'
import { useAppI18n } from '~/composables/useI18n'

const { isCommandModalOpen, closeCommand, openDemo } = useAppModal()
const { locale } = useAppI18n()
const searchInput = ref('')

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (isCommandModalOpen.value) {
      closeCommand()
    } else {
      isCommandModalOpen.value = true
    }
  } else if (e.key === 'Escape' && isCommandModalOpen.value) {
    closeCommand()
  }
}

const jumpTo = (hash: string) => {
  closeCommand()
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const triggerDemo = () => {
  closeCommand()
  openDemo()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    v-if="isCommandModalOpen"
    class="fixed inset-0 z-50 bg-forestBlack/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
    @click.self="closeCommand"
  >
    <div class="w-full max-w-xl bg-white rounded-2xl border border-forestBlack/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Input header -->
      <div class="flex items-center px-4 py-3.5 border-b border-forestBlack/[0.08]">
        <svg class="w-5 h-5 text-emeraldCore mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchInput"
          autofocus
          type="text"
          :placeholder="locale === 'th' ? 'ค้นหาโซลูชัน หรือถามคำถาม AI ทันที...' : 'Search enterprise solutions, or ask AI...'"
          class="w-full bg-transparent text-sm sm:text-base text-forestBlack placeholder-mutedSlate focus:outline-none"
        />
        <button
          @click="closeCommand"
          class="text-xs text-mutedSlate hover:text-forestBlack px-2 py-1 rounded bg-[#F7F9F8] border border-forestBlack/10 cursor-pointer"
        >
          ESC
        </button>
      </div>

      <!-- Quick Actions List -->
      <div class="p-3 space-y-1 text-sm">
        <div class="px-3 py-1.5 text-[11px] font-mono text-mutedSlate">
          {{ locale === 'th' ? 'เมนูด่วนและการนำทาง AI' : 'QUICK NAVIGATION & AI ACTIONS' }}
        </div>
        
        <button
          @click="jumpTo('#products')"
          class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F9F8] text-forestBlack flex items-center justify-between cursor-pointer transition-colors"
        >
          <span>{{ locale === 'th' ? 'สำรวจผลิตภัณฑ์ซอฟต์แวร์ทั้งหมด (iSmartFlow, HR.ai, I-SERFF, iGenQ)' : 'Explore All Enterprise Products (iSmartFlow, HR.ai, I-SERFF, iGenQ)' }}</span>
          <span class="text-xs font-semibold text-emeraldCore">Jump →</span>
        </button>

        <button
          @click="jumpTo('#clients')"
          class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F9F8] text-forestBlack flex items-center justify-between cursor-pointer transition-colors"
        >
          <span>{{ locale === 'th' ? 'ดูกลุ่มผู้ใช้ผลิตภัณฑ์และลูกค้าองค์กรชั้นนำ' : 'View Enterprise Clients & User Sectors' }}</span>
          <span class="text-xs font-semibold text-emeraldCore">Clients →</span>
        </button>

        <button
          @click="triggerDemo"
          class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F9F8] text-forestBlack flex items-center justify-between cursor-pointer transition-colors"
        >
          <span>{{ locale === 'th' ? 'นัดหมายสาธิตระบบสำหรับองค์กร (Request Enterprise Demo)' : 'Request Enterprise Demo & AI Consultation' }}</span>
          <span class="text-xs font-semibold text-forestBlack">Action →</span>
        </button>
      </div>

    </div>
  </div>
</template>
