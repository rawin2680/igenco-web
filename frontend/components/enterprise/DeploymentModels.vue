<script setup lang="ts">
import { useAppI18n } from '~/composables/useI18n'
import { useStrapiApi } from '~/composables/useStrapiApi'

const { locale, t } = useAppI18n()
const { getDeployments, getPartners } = useStrapiApi()

const deployments = await getDeployments()
const partners = await getPartners()
</script>

<template>
  <section id="architecture" class="relative z-10 py-24 px-6 bg-white border-t border-forestBlack/[0.06]">
    <div class="max-w-6xl mx-auto">
      
      <!-- Minimal Monochrome Partner Strip -->
      <div class="text-center mb-24">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-mutedSlate mb-8">
          {{ locale === 'th'
            ? 'ได้รับความไว้วางใจจากองค์กรชั้นนำและระบบนิเวศเทคโนโลยีระดับสากล'
            : 'TRUSTED BY FORWARD-THINKING ENTERPRISES & TECHNOLOGY ECOSYSTEMS' }}
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
          <div
            v-for="partner in partners"
            :key="partner.id"
            class="text-lg font-semibold tracking-widest text-forestBlack/45 hover:text-forestBlack transition-colors text-center"
          >
            {{ partner.name }}
          </div>
        </div>
      </div>

      <!-- 3-Column Tailored Deployment -->
      <div class="max-w-2xl mb-14">
        <p class="text-xs font-semibold tracking-[0.2em] uppercase text-emeraldCore mb-3">
          DEPLOYMENT MODELS
        </p>
        <h2 class="text-3xl sm:text-4xl font-semibold text-forestBlack tracking-tight">
          {{ locale === 'th' ? 'ยืดหยุ่นตามโครงสร้างพื้นฐานขององค์กรคุณ' : 'Flexible Deployment for Your Infrastructure' }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Cards -->
        <div
          v-for="dep in deployments"
          :key="dep.id"
          class="rounded-3xl p-8 transition-all"
          :class="{
            'glass-panel bg-[#F7F9F8]': dep.theme === 'light',
            'glass-panel bg-white border-emeraldCore/40 shadow-[0_18px_45px_rgba(5,150,105,0.08)]': dep.theme === 'highlight',
            'glass-dark text-white': dep.theme === 'dark'
          }"
        >
          <!-- Header tag -->
          <div class="flex items-center justify-between mb-4">
            <span
              class="text-xs font-mono font-semibold"
              :class="dep.theme === 'dark' ? 'text-mintGlow' : 'text-emeraldCore'"
            >
              {{ dep.code }}
            </span>
            <span
              v-if="dep.badge"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emeraldCore"
            >
              {{ dep.badge }}
            </span>
          </div>

          <!-- Title -->
          <h3
            class="text-xl font-semibold mb-3"
            :class="dep.theme === 'dark' ? 'text-white' : 'text-forestBlack'"
          >
            {{ t(dep.title) }}
          </h3>

          <!-- Description -->
          <p
            class="text-sm leading-relaxed mb-6"
            :class="dep.theme === 'dark' ? 'text-neutral-300' : 'text-mutedSlate'"
          >
            {{ t(dep.description) }}
          </p>

          <!-- Feature items -->
          <ul
            class="space-y-2.5 text-xs font-medium"
            :class="dep.theme === 'dark' ? 'text-neutral-200' : 'text-forestBlack/80'"
          >
            <li
              v-for="(feature, fIndex) in dep.features"
              :key="fIndex"
              class="flex items-center gap-2"
            >
              <span
                class="font-bold"
                :class="dep.theme === 'dark' ? 'text-mintGlow' : 'text-emeraldCore'"
              >
                ✓
              </span>
              <span>{{ t(feature) }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>
</template>
