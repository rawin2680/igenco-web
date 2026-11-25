<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppI18n } from '~/composables/useI18n'
import { useAppModal } from '~/composables/useModal'
import { useStrapiApi } from '~/composables/useStrapiApi'

const { locale } = useAppI18n()
const { openDemo } = useAppModal()
const { getClientPartnersFromCms } = useStrapiApi()

// Speed controller for dual-track stream
const streamSpeed = ref<'normal' | 'fast'>('normal')

// Category filter
const activeCategory = ref<'all' | 'gov' | 'private' | 'tech'>('all')

// Selected client for detail modal
const selectedClient = ref<any | null>(null)

interface ClientPartnerItem {
  id: string
  categoryKey: 'gov' | 'private' | 'tech'
  categoryName: string
  title: string
  subtitle: string
  description: string
  iconType: 'shield' | 'bank' | 'briefcase' | 'cert' | 'globe' | 'chip' | 'cloud' | 'hospital' | 'enterprise'
  accentColor: string
  badgeBg: string
  solution: string
  stats?: string
}

const clientsData = ref<ClientPartnerItem[]>([
  {
    id: 'oic',
    categoryKey: 'gov',
    categoryName: 'ภาครัฐและกำกับดูแล',
    title: 'สำนักงาน คปภ. (OIC)',
    subtitle: 'ระบบยื่นแบบกรมธรรม์ I-SERFF',
    description: 'ระบบยื่นขอรับความเห็นชอบแบบและข้อความกรมธรรม์ประกันภัยทางอิเล็กทรอนิกส์ เชื่อมโยงภาคธุรกิจประกันภัยทั่วประเทศ',
    iconType: 'shield',
    accentColor: '#00C978',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-[#00E588] border-emerald-200 dark:border-emerald-800/60',
    solution: 'I-SERFF Enterprise',
    stats: '100% ครอบคลุมธุรกิจประกันภัยทั่วประเทศ'
  },
  {
    id: 'dpa',
    categoryKey: 'gov',
    categoryName: 'ภาครัฐและกำกับดูแล',
    title: 'สถาบันคุ้มครองเงินฝาก (สคฝ.)',
    subtitle: 'ระบบเชื่อมต่อข้อมูล EFMS',
    description: 'ระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ระหว่างสถาบันคุ้มครองเงินฝากและสถาบันการเงินสมาชิกทั่วประเทศ',
    iconType: 'bank',
    accentColor: '#0284C7',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
    solution: 'Electronic Financial Management Gateway',
    stats: 'เชื่อมโยงสถาบันการเงินสมาชิกทั่วประเทศ'
  },
  {
    id: 'insurance-group',
    categoryKey: 'private',
    categoryName: 'ภาคเอกชนและประกันภัย',
    title: 'กลุ่มบริษัทประกันภัยชั้นนำ',
    subtitle: 'ผู้ใช้งานระบบ I-SERFF & HR.ai',
    description: 'ติดตั้งระบบเชื่อมต่อข้อมูล I-SERFF ภายในองค์กรและระบบบริหารทรัพยากรบุคคล HR.ai สำหรับธุรกิจประกันภัย',
    iconType: 'briefcase',
    accentColor: '#8B5CF6',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    solution: 'I-SERFF Connector & HR.ai Platform',
    stats: 'ลดระยะเวลาประมวลผลเอกสารกว่า 70%'
  },
  {
    id: 'tuv-nord',
    categoryKey: 'tech',
    categoryName: 'พันธมิตรเทคโนโลยี',
    title: 'TÜV NORD Thailand',
    subtitle: 'ISO/IEC 29110 Certified',
    description: 'รับรองมาตรฐานวิศวกรรมซอฟต์แวร์ระดับสากล ISO/IEC 29110:2011 ครอบคลุมกระบวนการบริหารโครงการและการพัฒนาซอฟต์แวร์',
    iconType: 'cert',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-[#00E588] border-emerald-200 dark:border-emerald-800/60',
    solution: 'Software Engineering Assurance',
    stats: 'มาตรฐานระดับสากล ISO/IEC 29110'
  },
  {
    id: 'depa',
    categoryKey: 'tech',
    categoryName: 'พันธมิตรเทคโนโลยี',
    title: 'depa Thailand',
    subtitle: 'Digital Ecosystem Partner',
    description: 'ร่วมขับเคลื่อนมาตรฐานอุตสาหกรรมซอฟต์แวร์ไทยและยกระดับผู้ประกอบการสู่ยุคเศรษฐกิจดิจิทัล',
    iconType: 'globe',
    accentColor: '#2563EB',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    solution: 'Digital Economy Promotion Partnership',
    stats: 'เครือข่ายพันธมิตรระบบนิเวศดิจิทัล'
  },
  {
    id: 'nvidia',
    categoryKey: 'tech',
    categoryName: 'พันธมิตรเทคโนโลยี',
    title: 'NVIDIA AI Inception',
    subtitle: 'AI Computing Partner',
    description: 'โครงสร้างพื้นฐานการประมวลผล AI ประสิทธิภาพสูง สำหรับโซลูชัน Enterprise AI และระบบวิเคราะห์ข้อมูลอัจฉริยะ',
    iconType: 'chip',
    accentColor: '#16A34A',
    badgeBg: 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/60',
    solution: 'GPU Accelerated AI Compute',
    stats: 'โครงสร้างพื้นฐาน AI ความเร็วสูง'
  },
  {
    id: 'cloud-partners',
    categoryKey: 'tech',
    categoryName: 'พันธมิตรเทคโนโลยี',
    title: 'AWS & Oracle Cloud',
    subtitle: 'Cloud & Enterprise Database',
    description: 'สถาปัตยกรรมคลาวด์และฐานข้อมูลระดับองค์กรที่มีเสถียรภาพและความปลอดภัยสูงสุดสำหรับระบบงานสำคัญ',
    iconType: 'cloud',
    accentColor: '#F97316',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60',
    solution: 'Enterprise Cloud Architecture',
    stats: 'Uptime 99.99% Enterprise Grade'
  },
  {
    id: 'hospital-group',
    categoryKey: 'private',
    categoryName: 'ภาคเอกชนและประกันภัย',
    title: 'องค์กรเอกชนและโรงพยาบาล',
    subtitle: 'ผู้ใช้งานระบบ iSmartFlow & iGenQ',
    description: 'ยกระดับการให้บริการจุดต้อนรับด้วยระบบคิวอัจฉริยะ iGenQ และลดการใช้กระดาษด้วยระบบสำนักงานอิเล็กทรอนิกส์ iSmartFlow',
    iconType: 'hospital',
    accentColor: '#E11D48',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    solution: 'iSmartFlow & iGenQ Queuing System',
    stats: 'ลดเวลารอคอยเฉลี่ยของผู้รับบริการ 40%'
  },
  {
    id: 'soe-group',
    categoryKey: 'gov',
    categoryName: 'ภาครัฐและกำกับดูแล',
    title: 'หน่วยงานรัฐวิสาหกิจ',
    subtitle: 'ระบบบริหารงานบุคคลและ ERP',
    description: 'วางระบบสารสนเทศบริหารทรัพยากรองค์กร เชื่อมโยงข้อมูลระหว่างหน่วยงาน และจัดทำคลังข้อมูลกลาง (Data Lake)',
    iconType: 'enterprise',
    accentColor: '#0D9488',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60',
    solution: 'ERP & Centralized Enterprise Data Lake',
    stats: 'รองรับผู้ใช้งานขนาดใหญ่กว่า 10,000 คน'
  }
])

// Filtered cards
const enClientTranslations: Record<string, { categoryName?: string; title?: string; subtitle?: string; description?: string; solution?: string; stats?: string }> = {
  oic: {
    categoryName: 'Government & Regulators',
    title: 'Office of Insurance Commission (OIC)',
    subtitle: 'I-SERFF Insurance Filing System',
    description: 'Nationwide electronic policy filing and regulatory compliance submission gateway connecting all Thai insurance carriers.',
    solution: 'I-SERFF Enterprise Gateway',
    stats: '100% Nationwide Insurance Coverage'
  },
  dpa: {
    categoryName: 'Government & Regulators',
    title: 'Deposit Protection Agency (DPA)',
    subtitle: 'EFMS Electronic Data Exchange',
    description: 'Secure electronic data filing and reconciliation infrastructure between the Deposit Protection Agency and member financial institutions.',
    solution: 'Electronic Financial Management Gateway',
    stats: 'Connecting all commercial bank members'
  },
  'insurance-group': {
    categoryName: 'Private Sector & Insurance',
    title: 'Leading Insurance Groups',
    subtitle: 'Users of I-SERFF & HR.ai',
    description: 'Implemented automated I-SERFF data connectors and smart HR.ai human capital management for insurance enterprises.',
    solution: 'I-SERFF Connector & HR.ai Platform',
    stats: '70% reduction in paper processing time'
  },
  'tuv-nord': {
    categoryName: 'Technology Partners',
    title: 'TÜV NORD Thailand',
    subtitle: 'ISO/IEC 29110 Certified',
    description: 'Certified under international software engineering standard ISO/IEC 29110:2011 covering project management and software implementation.',
    solution: 'Software Engineering Assurance',
    stats: 'International ISO/IEC 29110 Standard'
  },
  depa: {
    categoryName: 'Technology Partners',
    title: 'depa Thailand',
    subtitle: 'Digital Ecosystem Partner',
    description: 'Partnering to advance Thai software industry standards and accelerate enterprise digital transformation in the digital economy.',
    solution: 'Digital Economy Promotion Partnership',
    stats: 'Digital Ecosystem Network Partner'
  },
  nvidia: {
    categoryName: 'Technology Partners',
    title: 'NVIDIA AI Inception',
    subtitle: 'AI Computing Partner',
    description: 'High-performance AI compute infrastructure powering Enterprise AI models and autonomous analytics pipelines.',
    solution: 'GPU Accelerated AI Compute',
    stats: 'High-Throughput Enterprise AI'
  },
  'cloud-partners': {
    categoryName: 'Technology Partners',
    title: 'AWS & Oracle Cloud',
    subtitle: 'Cloud & Enterprise Database',
    description: 'Mission-critical enterprise cloud architecture and database hosting ensuring high security and resilient uptime.',
    solution: 'Enterprise Cloud Architecture',
    stats: '99.99% Enterprise Uptime'
  },
  'hospital-group': {
    categoryName: 'Private Sector & Insurance',
    title: 'Private Enterprises & Hospitals',
    subtitle: 'Users of iSmartFlow & iGenQ',
    description: 'Elevated reception workflows with iGenQ Smart Queuing and reduced paper usage with iSmartFlow electronic document management.',
    solution: 'iSmartFlow & iGenQ Queuing System',
    stats: '40% reduction in average wait times'
  },
  'soe-group': {
    categoryName: 'Government & Regulators',
    title: 'State-Owned Enterprises',
    subtitle: 'HR Management & Enterprise ERP',
    description: 'Enterprise resource planning and human capital management linking cross-departmental operations and central Data Lake.',
    solution: 'ERP & Centralized Enterprise Data Lake',
    stats: 'Supporting 10,000+ enterprise users'
  }
}

const getClientField = (client: ClientPartnerItem, field: 'categoryName' | 'title' | 'subtitle' | 'description' | 'solution' | 'stats'): string => {
  if (locale.value === 'en' && enClientTranslations[client.id] && enClientTranslations[client.id][field]) {
    return enClientTranslations[client.id][field] as string
  }
  return (client as any)[field] || ''
}

const filteredClients = computed(() => {
  if (activeCategory.value === 'all') return clientsData.value
  return clientsData.value.filter(c => c.categoryKey === activeCategory.value)
})

// Dual-track marquee items
const track1Items = computed(() => {
  const list = clientsData.value
  if (list.length < 5) return list
  return [list[1], list[2], list[3], list[4], list[0]]
})

const track2Items = computed(() => {
  const list = clientsData.value
  if (list.length < 9) return list
  return [list[6], list[7], list[8], list[5], list[4]]
})

onMounted(async () => {
  const cmsClients = await getClientPartnersFromCms()
  if (cmsClients && cmsClients.length > 0) {
    const badgeStyles: Record<string, string> = {
      gov: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-[#00E588] border-emerald-200 dark:border-emerald-800/60',
      private: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
      tech: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
    }
    clientsData.value = cmsClients.map((c: any) => {
      const idKey = c.documentId || String(c.id)
      enClientTranslations[idKey] = {
        categoryName: c.categoryName_en || c.categoryName_th,
        title: c.title_en || c.title_th,
        subtitle: c.subtitle_en || c.subtitle_th,
        description: c.description_en || c.description_th,
        solution: c.solution_en || c.solution_th,
        stats: c.stats_en || c.stats_th
      }
      return {
        id: idKey,
        categoryKey: c.categoryKey || 'gov',
        categoryName: c.categoryName_th || '',
        title: c.title_th || '',
        subtitle: c.subtitle_th || '',
        description: c.description_th || '',
        iconType: c.iconType || 'shield',
        accentColor: c.accentColor || '#00C978',
        badgeBg: badgeStyles[c.categoryKey || 'gov'] || badgeStyles.gov,
        solution: c.solution_th || '',
        stats: c.stats_th || ''
      }
    })
  }
})

const openClientDetail = (client: ClientPartnerItem) => {
  selectedClient.value = client
}

const closeClientDetail = () => {
  selectedClient.value = null
}
</script>

<template>
  <section id="clients" class="relative py-20 sm:py-28 overflow-hidden bg-[#F7F9F8] dark:bg-[#07120D] transition-colors duration-300">
    
    <!-- Background Architectural Grid Lines -->
    <div class="absolute inset-0 bg-grid-dots opacity-40 dark:opacity-20 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header (Matches Screenshot 1) -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <!-- Tag Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-[#0E2C1E] border border-emerald-200 dark:border-[#00C978]/40 mb-3 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-[#00C978] animate-pulse"></span>
            <span class="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#00875A] dark:text-[#00E588] uppercase">
              TRUSTED ECOSYSTEM // {{ locale === 'th' ? 'กลุ่มผู้ใช้ผลิตภัณฑ์และพันธมิตร' : 'Clients & Strategic Partners' }}
            </span>
          </div>

          <!-- Main Heading -->
          <h2 class="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-forestBlack dark:text-white leading-[1.2]">
            {{ locale === 'th' ? 'กลุ่มผู้ใช้ผลิตภัณฑ์และพันธมิตรที่ให้ความไว้วางใจ IGENCO' : 'Trusted by Regulators, Financial Institutions & Enterprises' }}
          </h2>
        </div>

        <!-- Speed Controls (ความเร็วปกติ / ความเร็วสูง 2x) -->
        <div class="flex items-center gap-1.5 p-1 rounded-full bg-white dark:bg-[#0E2017] border border-forestBlack/10 dark:border-white/10 shadow-xs self-start md:self-auto shrink-0">
          <button
            type="button"
            @click="streamSpeed = 'normal'"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
            :class="streamSpeed === 'normal'
              ? 'bg-forestBlack dark:bg-[#00C978] text-white dark:text-forestBlack font-bold shadow-xs'
              : 'text-mutedSlate dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white'"
          >
            {{ locale === 'th' ? 'ความเร็วปกติ' : 'Normal (1x)' }}
          </button>
          <button
            type="button"
            @click="streamSpeed = 'fast'"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
            :class="streamSpeed === 'fast'
              ? 'bg-forestBlack dark:bg-[#00C978] text-white dark:text-forestBlack font-bold shadow-xs'
              : 'text-mutedSlate dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white'"
          >
            {{ locale === 'th' ? 'ความเร็วสูง (2x)' : 'High Speed (2x)' }}
          </button>
        </div>
      </div>

      <!-- ==================== DUAL-TRACK STREAM (MARQUEE TICKER) ==================== -->
      <div class="mb-14 space-y-4 overflow-hidden relative">
        <!-- Edge Gradient Shadows for Infinite Horizon Feel -->
        <div class="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#F7F9F8] dark:from-[#07120D] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#F7F9F8] dark:from-[#07120D] to-transparent z-10 pointer-events-none"></div>

        <!-- Stream Track 1 (Leftward Flow) -->
        <div class="flex items-center gap-4 group/track1">
          <div
            class="flex items-center gap-4 shrink-0 animate-marquee"
            :class="streamSpeed === 'fast' ? 'duration-[16s]' : 'duration-[34s]'"
          >
            <div
              v-for="(item, idx) in [...track1Items, ...track1Items]"
              :key="`t1-${idx}`"
              @click="openClientDetail(item)"
              class="w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-[#0D1D16] border border-forestBlack/[0.08] dark:border-[#00C978]/25 shadow-xs hover:shadow-md hover:border-emerald-500/50 dark:hover:border-[#00C978] transition-all cursor-pointer flex items-center gap-3.5 group shrink-0"
            >
              <!-- Icon Container -->
              <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner" :style="{ backgroundColor: `${item.accentColor}15` }">
                <!-- SVG by Icon Type -->
                <svg v-if="item.iconType === 'shield'" class="w-5 h-5 text-[#00C978]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <svg v-else-if="item.iconType === 'bank'" class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <svg v-else-if="item.iconType === 'briefcase'" class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <svg v-else-if="item.iconType === 'cert'" class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
                <svg v-else class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
              </div>

              <!-- Text Details -->
              <div class="overflow-hidden">
                <div class="text-[13px] font-bold text-forestBlack dark:text-white truncate group-hover:text-emeraldCore dark:group-hover:text-[#00E588] transition-colors">
                  {{ getClientField(item, 'title') }}
                </div>
                <div class="text-[11px] text-mutedSlate dark:text-neutral-400 truncate">
                  {{ getClientField(item, 'subtitle') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stream Track 2 (Rightward Flow) -->
        <div class="flex items-center gap-4 group/track2">
          <div
            class="flex items-center gap-4 shrink-0 animate-marquee-reverse"
            :class="streamSpeed === 'fast' ? 'duration-[16s]' : 'duration-[34s]'"
          >
            <div
              v-for="(item, idx) in [...track2Items, ...track2Items]"
              :key="`t2-${idx}`"
              @click="openClientDetail(item)"
              class="w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-[#0D1D16] border border-forestBlack/[0.08] dark:border-[#00C978]/25 shadow-xs hover:shadow-md hover:border-emerald-500/50 dark:hover:border-[#00C978] transition-all cursor-pointer flex items-center gap-3.5 group shrink-0"
            >
              <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner" :style="{ backgroundColor: `${item.accentColor}15` }">
                <svg v-if="item.iconType === 'cloud'" class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"/>
                </svg>
                <svg v-else-if="item.iconType === 'hospital'" class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                <svg v-else-if="item.iconType === 'chip'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
                <svg v-else class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
              </div>

              <div class="overflow-hidden">
                <div class="text-[13px] font-bold text-forestBlack dark:text-white truncate group-hover:text-emeraldCore dark:group-hover:text-[#00E588] transition-colors">
                  {{ getClientField(item, 'title') }}
                </div>
                <div class="text-[11px] text-mutedSlate dark:text-neutral-400 truncate">
                  {{ getClientField(item, 'subtitle') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Instructional caption below ticker (Matches Screenshot 1) -->
        <p class="text-xs text-mutedSlate dark:text-neutral-400 text-center pt-2">
          {{ locale === 'th' ? '• วางเมาส์เหนือการ์ดเพื่อหยุดเลื่อนชั่วคราว หรือคลิกที่การ์ดเพื่อดูรายละเอียดโครงการ' : '• Hover over any card to pause stream, or click to view project details' }}
        </p>
      </div>

      <!-- ==================== DETAILED CARDS GRID (Matches Screenshots 2 & 3) ==================== -->
      <div class="mt-16">
        
        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-forestBlack/10 dark:border-white/10">
          <div>
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#00875A] dark:text-[#00E588]">
              FEATURED CASE STUDIES
            </span>
            <h3 class="text-xl sm:text-2xl font-bold text-forestBlack dark:text-white">
              {{ locale === 'th' ? 'โครงการสำคัญระดับประเทศและพันธมิตรเชิงกลยุทธ์' : 'Flagship Enterprise Deployments & Strategic Alliances' }}
            </h3>
          </div>

          <!-- Category Filter Buttons -->
          <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#0E2017] border border-forestBlack/10 dark:border-white/10 shadow-xs">
            <button
              type="button"
              @click="activeCategory = 'all'"
              class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
              :class="activeCategory === 'all'
                ? 'bg-emerald-500 text-white font-bold shadow-xs'
                : 'text-mutedSlate dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white'"
            >
              {{ locale === 'th' ? 'ทั้งหมด' : 'All' }} ({{ clientsData.length }})
            </button>
            <button
              type="button"
              @click="activeCategory = 'gov'"
              class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
              :class="activeCategory === 'gov'
                ? 'bg-emerald-500 text-white font-bold shadow-xs'
                : 'text-mutedSlate dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white'"
            >
              {{ locale === 'th' ? 'ภาครัฐและกำกับดูแล' : 'Government & Regulators' }}
            </button>
            <button
              type="button"
              @click="activeCategory = 'private'"
              class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
              :class="activeCategory === 'private'
                ? 'bg-emerald-500 text-white font-bold shadow-xs'
                : 'text-mutedSlate dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white'"
            >
              {{ locale === 'th' ? 'ภาคเอกชนและประกันภัย' : 'Private & Insurance' }}
            </button>
            <button
              type="button"
              @click="activeCategory = 'tech'"
              class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
              :class="activeCategory === 'tech'
                ? 'bg-emerald-500 text-white font-bold shadow-xs'
                : 'text-mutedSlate dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white'"
            >
              {{ locale === 'th' ? 'พันธมิตรเทคโนโลยี' : 'Tech Partners' }}
            </button>
          </div>
        </div>

        <!-- 3-Column Grid of 9 Cards (Matches Screenshot 2 & 3 Exactly) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <div
            v-for="card in filteredClients"
            :key="card.id"
            @click="openClientDetail(card)"
            class="group p-6 rounded-3xl bg-white dark:bg-[#0D1D16] border border-forestBlack/[0.08] dark:border-[#00C978]/25 hover:border-emerald-500/50 dark:hover:border-[#00C978] shadow-[0_4px_20px_rgba(9,20,14,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative"
          >
            <!-- Card Top: Icon & Category Tag -->
            <div>
              <div class="flex items-center justify-between gap-3 mb-5">
                <!-- Icon with colored tint -->
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" :style="{ backgroundColor: `${card.accentColor}18` }">
                  <svg v-if="card.iconType === 'shield'" class="w-6 h-6 text-[#00C978]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <svg v-else-if="card.iconType === 'bank'" class="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <svg v-else-if="card.iconType === 'briefcase'" class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <svg v-else-if="card.iconType === 'cert'" class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                  <svg v-else-if="card.iconType === 'globe'" class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                  <svg v-else-if="card.iconType === 'chip'" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                  </svg>
                  <svg v-else-if="card.iconType === 'cloud'" class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"/>
                  </svg>
                  <svg v-else-if="card.iconType === 'hospital'" class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  <svg v-else class="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                  </svg>
                </div>

                <!-- Category Pill Tag (Matches screenshot) -->
                <span class="text-[11px] font-medium px-3 py-1 rounded-full border" :class="card.badgeBg">
                  {{ getClientField(card, 'categoryName') }}
                </span>
              </div>

              <!-- Card Title -->
              <h4 class="text-lg sm:text-xl font-bold text-forestBlack dark:text-white mb-1 group-hover:text-emeraldCore dark:group-hover:text-[#00E588] transition-colors">
                {{ getClientField(card, 'title') }}
              </h4>

              <!-- Card Subtitle -->
              <div class="text-xs font-mono font-semibold text-[#00875A] dark:text-[#00E588] mb-3">
                {{ getClientField(card, 'subtitle') }}
              </div>

              <!-- Card Description -->
              <p class="text-xs sm:text-sm text-forestBlack/75 dark:text-neutral-300 leading-relaxed mb-6">
                {{ getClientField(card, 'description') }}
              </p>
            </div>

            <!-- Card Bottom: Link Action (ดูข้อมูลความร่วมมือ ↗) -->
            <div class="pt-4 border-t border-forestBlack/5 dark:border-white/10 flex items-center justify-between">
              <span class="text-xs font-semibold text-forestBlack/80 dark:text-neutral-300 group-hover:text-emeraldCore dark:group-hover:text-[#00E588] transition-colors flex items-center gap-1.5">
                <span>{{ locale === 'th' ? 'ดูข้อมูลความร่วมมือ' : 'View Collaboration' }}</span>
                <span class="text-sm transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </span>

              <span v-if="getClientField(card, 'stats')" class="text-[10px] font-mono text-mutedSlate dark:text-neutral-400">
                {{ getClientField(card, 'stats') }}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- ==================== CLIENT DETAIL MODAL ==================== -->
    <div
      v-if="selectedClient"
      class="fixed inset-0 z-[9999] bg-forestBlack/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      @click.self="closeClientDetail"
    >
      <div class="w-full max-w-xl bg-white dark:bg-[#0D1D16] rounded-3xl p-6 sm:p-8 border border-forestBlack/10 dark:border-[#00C978]/30 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        <!-- Close Button -->
        <button
          @click="closeClientDetail"
          class="absolute top-6 right-6 w-9 h-9 rounded-full bg-forestBlack/5 dark:bg-white/10 hover:bg-forestBlack/10 dark:hover:bg-white/20 text-mutedSlate dark:text-neutral-300 hover:text-forestBlack dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        <!-- Category Tag -->
        <div class="inline-block text-[11px] font-medium px-3 py-1 rounded-full border mb-3" :class="selectedClient.badgeBg">
          {{ getClientField(selectedClient, 'categoryName') }}
        </div>

        <h3 class="text-2xl font-bold text-forestBlack dark:text-white mb-1">
          {{ getClientField(selectedClient, 'title') }}
        </h3>
        <p class="text-xs font-mono font-semibold text-emeraldCore dark:text-[#00E588] mb-4">
          {{ getClientField(selectedClient, 'subtitle') }}
        </p>

        <div class="space-y-4 text-xs sm:text-sm text-forestBlack/80 dark:text-neutral-200 leading-relaxed">
          <p>{{ getClientField(selectedClient, 'description') }}</p>

          <div class="p-4 rounded-2xl bg-[#F8FAF9] dark:bg-[#12261C] border border-forestBlack/5 dark:border-[#00C978]/20 space-y-2">
            <div class="flex items-center gap-2 text-xs font-semibold text-emeraldCore dark:text-[#00E588]">
              <span>{{ locale === 'th' ? '📦 ซอฟต์แวร์ / โซลูชันที่นำไปใช้งาน:' : '📦 Deployed Software & Solution Architecture:' }}</span>
            </div>
            <div class="font-bold text-forestBlack dark:text-white">
              {{ getClientField(selectedClient, 'solution') }}
            </div>
            <div v-if="getClientField(selectedClient, 'stats')" class="text-xs text-mutedSlate dark:text-neutral-300">
              {{ locale === 'th' ? '• ผลลัพธ์:' : '• Outcome:' }} {{ getClientField(selectedClient, 'stats') }}
            </div>
          </div>
        </div>

        <!-- Action CTA -->
        <div class="mt-6 pt-4 border-t border-forestBlack/10 dark:border-white/10 flex items-center justify-between gap-3">
          <button
            @click="closeClientDetail"
            class="px-4 py-2.5 rounded-xl border border-forestBlack/15 dark:border-white/20 text-xs font-semibold text-forestBlack dark:text-white hover:bg-forestBlack/5 transition-colors cursor-pointer"
          >
            {{ locale === 'th' ? 'ปิดหน้าต่าง' : 'Close' }}
          </button>
          <button
            @click="closeClientDetail(); openDemo()"
            class="px-5 py-2.5 rounded-xl bg-[#00C978] hover:bg-[#00B36B] text-forestBlack font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>{{ locale === 'th' ? 'สอบถามแนวทางการนำไปใช้งาน' : 'Inquire About Deployment' }}</span>
            <span>↗</span>
          </button>
        </div>

      </div>
    </div>

  </section>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

@keyframes marqueeReverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0%); }
}

.animate-marquee {
  animation: marquee 34s linear infinite;
}

.animate-marquee-reverse {
  animation: marqueeReverse 34s linear infinite;
}

.group\/track1:hover .animate-marquee,
.group\/track2:hover .animate-marquee-reverse {
  animation-play-state: paused;
}
</style>
