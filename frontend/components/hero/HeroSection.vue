<script setup lang="ts">
import { useAppI18n } from '~/composables/useI18n'
import { useAppModal } from '~/composables/useModal'
import HeroNeuralCore3D from '~/components/hero/NeuralCore3D.client.vue'
import type { HeroContent } from '~/types/cms'

const props = defineProps<{
  hero?: HeroContent
}>()

const { locale, t } = useAppI18n()
const { openAbout, openDemo, openChat } = useAppModal()
</script>

<template>
  <section id="hero" class="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-white via-[#F8FAF9] to-[#F1F6F3]">
    
    <!-- 3D Neural Core WebGL Canvas (Client-only interactive 3D) -->
    <ClientOnly>
      <HeroNeuralCore3D />
      <template #fallback>
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div class="w-64 h-64 rounded-full bg-emerald-400 blur-3xl animate-pulse"></div>
        </div>
      </template>
    </ClientOnly>

    <!-- Main Hero Center Overlay (Centered Title & Subtitle Matching Screenshot) -->
    <div class="relative z-10 max-w-4xl mx-auto text-center pointer-events-none flex flex-col items-center justify-center">
      
      <!-- Top Eyebrow Tag (NEXT-GEN ENTERPRISE AI ARCHITECTURE) -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-3 sm:mb-4 pointer-events-auto">
        <span class="text-xs sm:text-[13px] font-semibold tracking-[0.22em] uppercase text-[#059669]">
          NEXT-GEN ENTERPRISE AI ARCHITECTURE
        </span>
      </div>

      <!-- Hero Headline (Two-Tone Contrast: Line 1 Black / Lines 2 & 3 Vibrant Emerald Green) -->
      <h1 class="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.18] sm:leading-[1.14] mb-5 sm:mb-6 select-none">
        <template v-if="locale === 'th'">
          <!-- Line 1: Dark Charcoal / Black (White in Dark Mode) -->
          <span class="text-forestBlack dark:text-white block">ยกระดับองค์กรสู่อนาคต</span>
          <!-- Lines 2 & 3: Vibrant Emerald Green -->
          <span class="text-[#00A86B] dark:text-[#00E588] block">ด้วยสถาปัตยกรรม AI</span>
          <span class="text-[#00A86B] dark:text-[#00E588] block">อัจฉริยะ</span>
        </template>
        <template v-else>
          <span class="text-forestBlack dark:text-white block">Elevating Enterprises</span>
          <span class="text-[#00A86B] dark:text-[#00E588] block">with Autonomous AI</span>
          <span class="text-[#00A86B] dark:text-[#00E588] block">Architecture</span>
        </template>
      </h1>

      <!-- Subtitle Description -->
      <p class="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#526058] dark:text-[#9BB3A5] font-normal leading-relaxed mb-6 sm:mb-10 px-2 select-none">
        {{ locale === 'th'
          ? 'ออกแบบและพัฒนาโซลูชันปัญญาประดิษฐ์ระดับองค์กร ผสานความแม่นยำของข้อมูล ความปลอดภัยสูงสุด และประสบการณ์ดิจิทัลที่ไร้รอยต่อ'
          : 'Designing enterprise artificial intelligence solutions blending data precision, military-grade security, and seamless digital transformation.' }}
      </p>

      <!-- Floating Card for Mobile/Tablet Screens (appears below subtitle on smaller devices) -->
      <div class="lg:hidden w-full max-w-xs mx-auto mb-8 pointer-events-auto">
        <div class="bg-white dark:bg-[#0D1D16] rounded-3xl p-5 shadow-[0_12px_35px_rgba(9,20,14,0.08)] border border-forestBlack/[0.06] dark:border-[#00C978]/30 text-left">
          <h2 class="font-bold text-sm text-forestBlack dark:text-white">
            {{ locale === 'th' ? 'บริษัท ไอเจนโก้ จำกัด' : 'IGENCO Co., Ltd.' }}
          </h2>
          <p class="text-[11px] text-mutedSlate/70 dark:text-neutral-400 font-medium mt-0.5">IGENCO.Co.,Ltd</p>
          <p class="text-xs text-mutedSlate dark:text-neutral-300 mt-2.5 mb-4 leading-relaxed">
            {{ locale === 'th' ? 'ผู้เชี่ยวชาญด้าน AI และนวัตกรรมดิจิทัลสำหรับองค์กร' : 'Enterprise AI & Digital Innovation Specialists' }}
          </p>
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              @click="openAbout"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-[#059669] hover:bg-[#047857] text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>About Us</span>
              <span>→</span>
            </button>
            <button
              type="button"
              @click="openDemo"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-forestBlack/5 text-forestBlack border border-forestBlack/15 transition-all active:scale-95 cursor-pointer"
            >
              Consult
            </button>
          </div>
        </div>
      </div>

      <!-- Subtle Interactive 3D Hint (Bottom center) -->
      <div class="flex items-center justify-center gap-2 text-xs text-mutedSlate/80 pointer-events-auto mt-2">
        <span class="w-1.5 h-1.5 rounded-full bg-emeraldBright animate-pulse"></span>
        <span>
          {{ locale === 'th' ? 'ขยับเมาส์หรือแตะเพื่อโต้ตอบกับ Neural Core 3 มิติ' : 'Move cursor or tap to interact with 3D Neural Core' }}
        </span>
      </div>

    </div>

    <!-- Floating Company Card on Bottom-Left for Desktop (Exact match to Screenshot) -->
    <div class="hidden lg:block absolute left-8 xl:left-14 bottom-12 xl:bottom-16 z-20 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="bg-white dark:bg-[#0D1D16] rounded-3xl p-6 shadow-[0_15px_40px_rgba(9,20,14,0.07)] border border-forestBlack/[0.06] dark:border-[#00C978]/30 w-72 text-left">
        <h2 class="font-bold text-[15px] text-forestBlack dark:text-white">
          {{ locale === 'th' ? 'บริษัท ไอเจนโก้ จำกัด' : 'IGENCO Co., Ltd.' }}
        </h2>
        <p class="text-[11px] text-mutedSlate/70 dark:text-neutral-400 font-medium mt-0.5">IGENCO.Co.,Ltd</p>
        <p class="text-xs text-mutedSlate dark:text-neutral-300 mt-3 mb-5 leading-relaxed">
          {{ locale === 'th' ? 'ผู้เชี่ยวชาญด้าน AI และนวัตกรรมดิจิทัลสำหรับองค์กร' : 'Enterprise AI & Digital Innovation Specialists' }}
        </p>
        <div class="flex items-center gap-3">
          <!-- About Us Button -->
          <button
            type="button"
            @click="openAbout"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-[#059669] hover:bg-[#047857] text-white flex items-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
            title="เกี่ยวกับบริษัท ไอเจนโก้ จำกัด"
          >
            <span>About Us</span>
            <span>→</span>
          </button>
          
          <!-- Consult Button -->
          <button
            type="button"
            @click="openChat"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#13281E] hover:bg-forestBlack/5 dark:hover:bg-[#1A382A] text-forestBlack dark:text-white border border-forestBlack/15 dark:border-[#00C978]/30 transition-all hover:border-emerald-500/40 active:scale-95 cursor-pointer"
            title="ปรึกษาทีมงาน IGENCO AI"
          >
            Consult
          </button>
        </div>
      </div>
    </div>

  </section>
</template>
