<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppI18n } from '~/composables/useI18n'
import { useAppModal } from '~/composables/useModal'
import { useStrapiApi } from '~/composables/useStrapiApi'
import type { IndustryBlueprint } from '~/types/cms'

const { locale, t } = useAppI18n()
const { openDemo } = useAppModal()
const { getBlueprints } = useStrapiApi()

const blueprints = await getBlueprints()
const activeKey = ref<string>('manufacturing')

const currentBlueprint = computed<IndustryBlueprint>(() => {
  return blueprints[activeKey.value] || blueprints.manufacturing
})

const selectIndustry = (key: string) => {
  activeKey.value = key
}
</script>

<template>
  <section id="playground" class="relative z-10 py-28 px-6 bg-[#F7F9F8]">
    <div class="max-w-5xl mx-auto">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-14">
        <p class="text-xs font-semibold tracking-[0.2em] uppercase text-emeraldCore mb-3">
          INTERACTIVE AI SANDBOX
        </p>
        <h2 class="text-3xl sm:text-5xl font-semibold tracking-tight text-forestBlack mb-4">
          {{ locale === 'th' ? 'จำลองสถาปัตยกรรม AI สำหรับธุรกิจของคุณ' : 'Simulate Your Enterprise AI Blueprint' }}
        </h2>
        <p class="text-mutedSlate text-base font-normal">
          {{ locale === 'th' ? 'เลือกกลุ่มอุตสาหกรรมเพื่อดูแนวทางการประยุกต์ใช้ AI และผลลัพธ์ที่คาดว่าจะเกิดขึ้นจริง' : 'Select an industry vertical to preview tailored AI architecture and projected efficiency gains.' }}
        </p>
      </div>

      <!-- Focused Obsidian-Forest Contrast Container -->
      <div class="glass-dark rounded-[32px] p-6 sm:p-10 md:p-12 text-white">
        
        <!-- Industry Selector Pills -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          <button
            v-for="(item, key) in blueprints"
            :key="key"
            @click="selectIndustry(String(key))"
            class="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer"
            :class="activeKey === key
              ? 'bg-emeraldBright text-forestBlack font-semibold shadow-[0_0_20px_rgba(16,185,129,0.35)]'
              : 'bg-white/[0.06] text-neutral-300 hover:text-white border border-white/10'"
          >
            {{ t(item.name) }}
          </button>
        </div>

        <!-- Simulation Output Area -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Left: Blueprint Narrative -->
          <div class="lg:col-span-7 space-y-5">
            <div class="inline-flex items-center gap-2 text-xs font-mono text-mintGlow">
              <span class="w-2 h-2 rounded-full bg-mintGlow"></span>
              <span>{{ currentBlueprint.tag }}</span>
            </div>
            
            <h3 class="text-2xl sm:text-3xl font-semibold text-white transition-all">
              {{ t(currentBlueprint.title) }}
            </h3>
            
            <p class="text-neutral-300 text-sm sm:text-base leading-relaxed min-h-[72px]">
              {{ t(currentBlueprint.summary) }}
            </p>

            <!-- Pipeline Chips -->
            <div class="flex flex-wrap items-center gap-2 pt-2">
              <template v-for="(step, index) in currentBlueprint.pipeline" :key="index">
                <span
                  class="px-3.5 py-1.5 rounded-xl text-xs transition-all"
                  :class="index === 1
                    ? 'bg-emerald-500/15 border border-emerald-400/30 text-mintGlow font-medium'
                    : 'bg-white/[0.06] border border-white/10 text-neutral-200'"
                >
                  {{ step }}
                </span>
                <span v-if="index < currentBlueprint.pipeline.length - 1" class="text-neutral-500">
                  →
                </span>
              </template>
            </div>
          </div>

          <!-- Right: Projected Impact Card -->
          <div class="lg:col-span-5 bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div class="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Projected Impact Metrics
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                <div class="text-2xl sm:text-3xl font-semibold text-gradient-emerald">
                  {{ currentBlueprint.metric1.value }}
                </div>
                <div class="text-xs text-neutral-400 mt-1">
                  {{ t(currentBlueprint.metric1.label) }}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                <div class="text-2xl sm:text-3xl font-semibold text-white">
                  {{ currentBlueprint.metric2.value }}
                </div>
                <div class="text-xs text-neutral-400 mt-1">
                  {{ t(currentBlueprint.metric2.label) }}
                </div>
              </div>
            </div>

            <button
              @click="openDemo"
              class="w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-forestBlack hover:bg-mintGlow transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{{ locale === 'th' ? 'ขอรับการสาธิตโซลูชันนี้' : 'Request This Blueprint' }}</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
