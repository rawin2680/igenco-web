<script setup lang="ts">
import { useAppModal } from '~/composables/useModal'
import { useAppI18n } from '~/composables/useI18n'

const { isNewsModalOpen, closeNews, openDemo } = useAppModal()
const { locale } = useAppI18n()

const articles = [
  {
    id: 1,
    tag: 'PRODUCT LAUNCH',
    date: '2026-11-20',
    title: {
      th: 'IGENCO เปิดตัวสถาปัตยกรรม Enterprise Neural Core 3.0 สำหรับองค์กรยุคใหม่',
      en: 'IGENCO Releases Enterprise Neural Core 3.0 Architecture'
    },
    summary: {
      th: 'ยกระดับประสิทธิภาพการประมวลผลข้อมูลองค์กรด้วยระบบ Multi-Agent Orchestration และ Private Knowledge Graph แบบเรียลไทม์',
      en: 'Next-gen enterprise intelligence featuring real-time multi-agent orchestration and sovereign knowledge graphs.'
    }
  },
  {
    id: 2,
    tag: 'COMPLIANCE & SECURITY',
    date: '2026-10-15',
    title: {
      th: 'IGENCO AI ผ่านการรับรองมาตรฐานความปลอดภัยข้อมูลสากล ISO/IEC 27001:2022',
      en: 'IGENCO AI Achieves ISO/IEC 27001:2022 Certification'
    },
    summary: {
      th: 'ตอกย้ำความเชื่อมั่นด้านการรักษาความปลอดภัยของข้อมูลลูกค้าขั้นสูงสุดและสถาปัตยกรรม On-Premise ที่พร้อมสำหรับสถาบันการเงิน',
      en: 'Validating our military-grade security posture for regulated banking, manufacturing, and healthcare sectors.'
    }
  },
  {
    id: 3,
    tag: 'STRATEGIC PARTNERSHIP',
    date: '2026-09-28',
    title: {
      th: 'ขยายความร่วมมือขับเคลื่อน AI ในภาคอุตสาหกรรมการผลิตและพลังงาน',
      en: 'Strategic Expansion into Industrial Manufacturing & Energy AI'
    },
    summary: {
      th: 'ร่วมพัฒนาระบบ AI Predictive Maintenance และ Autonomous Quality Inspection ช่วยลด Downtime ของสายการผลิตได้กว่า 42%',
      en: 'Deploying autonomous quality inspection and predictive maintenance agents across heavy industry pipelines.'
    }
  }
]
</script>

<template>
  <div
    v-if="isNewsModalOpen"
    class="fixed inset-0 z-50 bg-forestBlack/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    @click.self="closeNews"
  >
    <div class="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-forestBlack/10 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button -->
      <button
        @click="closeNews"
        class="absolute top-6 right-6 w-9 h-9 rounded-full bg-forestBlack/5 hover:bg-forestBlack/10 text-mutedSlate hover:text-forestBlack flex items-center justify-center cursor-pointer transition-colors"
        aria-label="Close"
      >
        ✕
      </button>

      <!-- Badge & Title -->
      <div class="flex items-center gap-2 mb-3">
        <span class="w-2 h-2 rounded-full bg-emeraldBright animate-ping"></span>
        <span class="text-xs font-mono font-semibold text-emeraldCore uppercase tracking-wider">
          {{ locale === 'th' ? 'ข่าวสารและอัปเดต' : 'NEWS & INSIGHTS' }}
        </span>
      </div>

      <h2 class="text-2xl sm:text-3xl font-bold text-forestBlack mb-2">
        {{ locale === 'th' ? 'ข่าวสารและนวัตกรรมล่าสุด' : 'Latest News & Innovations' }}
      </h2>
      <p class="text-xs sm:text-sm text-mutedSlate mb-6">
        {{ locale === 'th'
          ? 'ติดตามความเคลื่อนไหวทางเทคโนโลยี AI และโซลูชันระดับองค์กรจากทีมงาน IGENCO'
          : 'Stay updated with cutting-edge artificial intelligence milestones and enterprise deployments.' }}
      </p>

      <!-- News Feed -->
      <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <article
          v-for="item in articles"
          :key="item.id"
          class="p-5 rounded-2xl bg-[#F7F9F8] border border-forestBlack/5 hover:border-emerald-500/30 transition-all hover:shadow-sm"
        >
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emeraldCore">
              {{ item.tag }}
            </span>
            <span class="text-[11px] text-mutedSlate font-mono">
              {{ item.date }}
            </span>
          </div>

          <h3 class="font-semibold text-forestBlack text-sm sm:text-base mb-2">
            {{ locale === 'th' ? item.title.th : item.title.en }}
          </h3>

          <p class="text-xs text-mutedSlate leading-relaxed">
            {{ locale === 'th' ? item.summary.th : item.summary.en }}
          </p>
        </article>
      </div>

      <!-- Action Footer -->
      <div class="mt-6 pt-4 border-t border-forestBlack/10 flex items-center justify-between">
        <span class="text-xs text-mutedSlate">
          {{ locale === 'th' ? 'มีคำถามเพิ่มเติมสำหรับทีมงาน?' : 'Have inquiries for our media team?' }}
        </span>
        <button
          @click="closeNews(); openDemo()"
          class="px-5 py-2 rounded-full text-xs font-semibold bg-forestBlack text-white hover:bg-emeraldCore transition-all cursor-pointer"
        >
          {{ locale === 'th' ? 'ติดต่อสอบถาม' : 'Contact Us' }}
        </button>
      </div>

    </div>
  </div>
</template>
