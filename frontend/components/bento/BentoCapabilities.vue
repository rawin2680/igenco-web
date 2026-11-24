<script setup lang="ts">
import { ref } from 'vue'
import { useAppI18n } from '~/composables/useI18n'
import type { CapabilityItem } from '~/types/cms'

const props = defineProps<{
  capabilities?: CapabilityItem[]
}>()

const { locale, t } = useAppI18n()

// Bento Card mouse spotlight tracker
const onMouseMove = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}

// Computer Vision Interactive Scan State
const isVisionActive = ref(true)
const toggleVision = () => {
  isVisionActive.value = !isVisionActive.value
}
</script>

<template>
  <section id="capabilities" class="relative z-10 py-28 sm:py-36 px-6 bg-white">
    <div class="max-w-6xl mx-auto">
      
      <!-- Section Header -->
      <div class="max-w-2xl mb-16">
        <p class="text-xs font-semibold tracking-[0.2em] uppercase text-emeraldCore mb-3">
          CORE CAPABILITIES
        </p>
        <h2 class="text-3xl sm:text-5xl font-semibold tracking-tight text-forestBlack mb-5 leading-tight">
          {{ locale === 'th' ? 'เทคโนโลยี AI ที่สร้างผลลัพธ์ทางธุรกิจอย่างเป็นรูปธรรม' : 'Enterprise AI Built for Measurable Business Impact' }}
        </h2>
        <p class="text-mutedSlate text-base sm:text-lg font-normal">
          {{ locale === 'th' ? 'สถาปัตยกรรมที่ออกแบบมาเพื่อความเสถียร ความเร็ว และการขยายตัวในระดับองค์กรขนาดใหญ่' : 'Engineered for ultra-low latency, enterprise-grade governance, and effortless scale.' }}
        </p>
      </div>

      <!-- Asymmetric Bento Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- CARD 1 (7 cols): Enterprise LLM & Autonomous Agents -->
        <div
          @mousemove="onMouseMove"
          class="lg:col-span-7 glass-panel bg-[#F7F9F8]/90 bento-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[380px]"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <span class="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emeraldCore border border-emerald-500/20">
                Enterprise LLM & Agents
              </span>
              <span class="text-xs text-mutedSlate font-mono">REAL-TIME REASONING</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-semibold text-forestBlack mb-3">
              {{ locale === 'th' ? 'Enterprise LLM & Autonomous Agents' : 'Enterprise LLM & Autonomous Agents' }}
            </h3>
            <p class="text-mutedSlate text-sm sm:text-base max-w-lg leading-relaxed">
              {{ locale === 'th'
                ? 'ระบบ AI Agent อัจฉริยะที่สามารถวางแผน วิเคราะห์เอกสารซับซ้อน และเชื่อมต่อ API ภายในองค์กรเพื่อทำงานอัตโนมัติแบบครบวงจร'
                : 'Autonomous cognitive agents capable of multi-step planning, deep document synthesis, and automated enterprise API orchestration.' }}
            </p>
          </div>

          <!-- Minimalist Interactive Workflow Node Visualizer -->
          <div class="mt-10 pt-6 border-t border-forestBlack/[0.07]">
            <div class="relative flex items-center justify-between gap-2 sm:gap-4">
              <!-- Connecting Line -->
              <div class="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[1.5px] bg-forestBlack/10 overflow-hidden">
                <div class="flow-particle absolute top-0 w-14 h-full bg-gradient-to-r from-transparent via-emeraldBright to-transparent"></div>
              </div>

              <!-- Node 1 -->
              <div class="relative z-10 flex flex-col items-center gap-2 bg-white border border-forestBlack/10 rounded-2xl px-4 py-3 shadow-sm">
                <div class="w-2.5 h-2.5 rounded-full bg-mutedSlate"></div>
                <span class="text-[11px] font-medium text-forestBlack">Data Input</span>
              </div>

              <!-- Node 2 (Core Highlight) -->
              <div class="relative z-10 flex flex-col items-center gap-2 bg-forestBlack border border-emeraldBright/50 rounded-2xl px-5 py-3.5 shadow-[0_10px_28px_rgba(5,150,105,0.22)]">
                <div class="w-2.5 h-2.5 rounded-full bg-mintGlow animate-ping"></div>
                <span class="text-[11px] font-semibold text-mintGlow">Neural Orchestrator</span>
              </div>

              <!-- Node 3 -->
              <div class="relative z-10 flex flex-col items-center gap-2 bg-white border border-emeraldCore/30 rounded-2xl px-4 py-3 shadow-sm">
                <div class="w-2.5 h-2.5 rounded-full bg-emeraldCore"></div>
                <span class="text-[11px] font-medium text-emeraldCore">Auto Execution</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 2 (5 cols): Predictive Data Engine -->
        <div
          @mousemove="onMouseMove"
          class="lg:col-span-5 glass-panel bg-white bento-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[380px]"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <span class="px-3.5 py-1 rounded-full text-xs font-semibold bg-forestBlack text-mintGlow">
                Predictive Engine
              </span>
              <span class="text-xs font-mono font-medium text-emeraldCore">● 12ms Latency</span>
            </div>
            <h3 class="text-2xl font-semibold text-forestBlack mb-3">
              Predictive Data Engine
            </h3>
            <p class="text-mutedSlate text-sm leading-relaxed">
              {{ locale === 'th'
                ? 'เปลี่ยนข้อมูลมหาศาลให้เป็นการคาดการณ์ทางธุรกิจที่แม่นยำด้วยโมเดล Deep Learning เฉพาะทาง'
                : 'Transform vast enterprise telemetry into high-accuracy business foresight with domain-specific deep learning models.' }}
            </p>
          </div>

          <!-- Clean Minimalist Spline Visualization -->
          <div class="mt-8">
            <div class="flex items-baseline justify-between mb-3">
              <div>
                <span class="text-3xl sm:text-4xl font-semibold text-forestBlack">99.4%</span>
                <span class="text-xs text-mutedSlate ml-2">Model Precision</span>
              </div>
              <span class="text-xs text-emeraldCore font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">+42% ROI</span>
            </div>
            <svg viewBox="0 0 320 90" class="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="chartGradEmeraldNuxt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10B981" stop-opacity="0.26"/>
                  <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,75 C50,70 80,45 130,50 C180,55 210,20 260,24 C290,26 305,10 320,6 L320,90 L0,90 Z" fill="url(#chartGradEmeraldNuxt)"/>
              <path class="sparkline-path" d="M0,75 C50,70 80,45 130,50 C180,55 210,20 260,24 C290,26 305,10 320,6" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="320" cy="6" r="4.5" fill="#10B981" class="animate-pulse"/>
            </svg>
          </div>
        </div>

        <!-- CARD 3 (5 cols): Private On-Premise AI (Dark Obsidian Contrast) -->
        <div
          @mousemove="onMouseMove"
          class="lg:col-span-5 glass-dark bento-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[360px] text-white"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <span class="px-3.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-mintGlow border border-emerald-400/25">
                Zero-Trust Security
              </span>
              <span class="text-xs font-mono text-neutral-400">ISO / PDPA READY</span>
            </div>
            <h3 class="text-2xl font-semibold text-white mb-3">
              Private On-Premise AI
            </h3>
            <p class="text-neutral-300 text-sm leading-relaxed">
              {{ locale === 'th'
                ? 'ติดตั้งโมเดล AI บนเซิร์ฟเวอร์ส่วนตัวขององค์กร ข้อมูลความลับทางธุรกิจไม่รั่วไหลออกสู่ภายนอก 100%'
                : 'Deploy proprietary neural weights strictly within sovereign enterprise perimeters. Zero data leakage guaranteed.' }}
            </p>
          </div>

          <!-- Layered Glass Shield -->
          <div class="mt-8 flex items-center justify-center py-4">
            <div class="relative flex items-center justify-center">
              <div class="w-28 h-28 rounded-full border border-emerald-400/25 flex items-center justify-center animate-pulse-slow">
                <div class="w-20 h-20 rounded-full border border-mintGlow/40 bg-emerald-500/[0.08] flex items-center justify-center">
                  <svg class="w-8 h-8 text-mintGlow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
              </div>
              <span class="absolute -bottom-3 px-3 py-0.5 rounded-full text-[10px] font-mono bg-obsidianInk border border-emerald-400/30 text-mintGlow">
                AES-256 + Air-Gapped Option
              </span>
            </div>
          </div>
        </div>

        <!-- CARD 4 (7 cols): Computer Vision & Edge -->
        <div
          @mousemove="onMouseMove"
          class="lg:col-span-7 glass-panel bg-[#F7F9F8]/90 bento-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between min-h-[360px]"
        >
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span class="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emeraldCore border border-emerald-500/20 inline-block mb-4">
                Spatial & Edge Intelligence
              </span>
              <h3 class="text-2xl sm:text-3xl font-semibold text-forestBlack mb-3">
                Computer Vision & Edge
              </h3>
              <p class="text-mutedSlate text-sm sm:text-base max-w-md leading-relaxed">
                {{ locale === 'th'
                  ? 'วิเคราะห์ภาพและวิดีโอแบบเรียลไทม์สำหรับสายการผลิต อุตสาหกรรมพลังงาน และโครงสร้างพื้นฐานอัจฉริยะ'
                  : 'Sub-millisecond visual analytics and anomaly detection designed for smart manufacturing, utilities, and infrastructure.' }}
              </p>
            </div>

            <!-- Inspection Mode Toggle -->
            <button
              @click="toggleVision"
              class="self-start px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-emerald-50 border border-forestBlack/12 text-forestBlack shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span
                class="w-2 h-2 rounded-full transition-colors"
                :class="isVisionActive ? 'bg-emeraldBright' : 'bg-neutral-400'"
              ></span>
              <span>Neural Scan: {{ isVisionActive ? 'ON' : 'STANDBY' }}</span>
            </button>
          </div>

          <!-- Spatial Vector Grid Simulation -->
          <div class="mt-8 relative h-36 rounded-2xl bg-white border border-forestBlack/[0.08] overflow-hidden flex items-center justify-around px-6 shadow-inner">
            <div
              class="absolute inset-0 opacity-35"
              style="background-image: radial-gradient(#10B981 1.1px, transparent 1.1px); background-size: 20px 20px;"
            ></div>
            
            <!-- Detected Object 1 -->
            <div
              class="relative z-10 px-4 py-3 rounded-xl border border-emeraldCore/50 bg-emerald-50/90 backdrop-blur-sm transition-all duration-500"
              :class="isVisionActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'"
            >
              <div class="text-[10px] font-mono font-semibold text-emeraldCore mb-1">UNIT_A01 • 99.8%</div>
              <div class="text-xs font-semibold text-forestBlack">Optimal Telemetry</div>
            </div>

            <!-- Detected Object 2 -->
            <div
              class="relative z-10 px-4 py-3 rounded-xl border border-forestBlack/20 bg-forestBlack text-white transition-all duration-500 shadow-md"
              :class="isVisionActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'"
            >
              <div class="text-[10px] font-mono text-mintGlow mb-1">ANOMALY_CHECK • 0.00%</div>
              <div class="text-xs font-medium text-white">Zero Defect Verified</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
