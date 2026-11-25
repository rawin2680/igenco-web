<script setup lang="ts">
import { useAppModal } from '~/composables/useModal'
import { useAppI18n } from '~/composables/useI18n'

const { isUserGroupsModalOpen, closeUserGroups, openDemo } = useAppModal()
const { locale } = useAppI18n()

interface UserGroup {
  id: string
  category: { th: string; en: string }
  badge: string
  title: { th: string; en: string }
  description: { th: string; en: string }
  product: string
  stats: { th: string; en: string }
}

const userGroups: UserGroup[] = [
  {
    id: 'oic',
    category: {
      th: 'หน่วยงานกำกับดูแลภาครัฐ & สถาบันการเงิน',
      en: 'Regulators & Financial Institutions'
    },
    badge: 'RegTech & Compliance',
    title: {
      th: 'สำนักงาน คปภ. และธุรกิจประกันภัย',
      en: 'Office of Insurance Commission (OIC) & Insurers'
    },
    description: {
      th: 'ระบบยื่นขอรับความเห็นชอบแบบและข้อความกรมธรรม์ประกันภัยทางอิเล็กทรอนิกส์ (I-SERFF Enterprise) รองรับบริษัทประกันวินาศภัยและประกันชีวิตทั่วประเทศ',
      en: 'Electronic Policy Filing and Approval System (I-SERFF Enterprise) trusted by non-life and life insurers nationwide.'
    },
    product: 'I-SERFF Enterprise',
    stats: {
      th: '100% สอดคล้องเกณฑ์ คปภ.',
      en: '100% OIC Regulatory Compliant'
    }
  },
  {
    id: 'gov',
    category: {
      th: 'กระทรวงและหน่วยงานภาครัฐ',
      en: 'Ministries & Government Agencies'
    },
    badge: 'e-Government Standard',
    title: {
      th: 'ระบบงานสารบรรณอิเล็กทรอนิกส์ภาครัฐ',
      en: 'Public Sector e-Saraban & Document Workflow'
    },
    description: {
      th: 'หน่วยงานราชการและรัฐวิสาหกิจใช้งาน iSmartFlow ในการบริหารจัดการงานสารบรรณ หนังสือเวียน การเกษียณหนังสือ และระบบลงนามอิเล็กทรอนิกส์มาตรฐาน พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์',
      en: 'Public authorities and state agencies deploy iSmartFlow for e-Office routing, minute endorsement, and legal digital signatures.'
    },
    product: 'iSmartFlow (e-Saraban)',
    stats: {
      th: 'ลดเวลาประมวลผลเอกสาร 75%',
      en: '75% Faster Processing'
    }
  },
  {
    id: 'enterprise',
    category: {
      th: 'องค์กรธุรกิจและกลุ่มอุตสาหกรรม',
      en: 'Corporates & Enterprise Groups'
    },
    badge: 'Enterprise HR Tech',
    title: {
      th: 'ฝ่ายบริหารทรัพยากรบุคคลและองค์กรขนาดใหญ่',
      en: 'Human Resources & Large Enterprises'
    },
    description: {
      th: 'ระบบ HR.ai Platform 2026 รองรับการลงเวลาทำงาน คำนวณเงินเดือน ภาษี กองทุน สวัสดิการ และการประเมินผล KPI พร้อมระบบ Self-Service สำหรับพนักงาน (ESS/MSS)',
      en: 'HR.ai Platform 2026 streamlines enterprise time attendance, automated payroll, tax, benefits, and KPI evaluation with ESS/MSS portals.'
    },
    product: 'HR.ai Platform 2026',
    stats: {
      th: 'รองรับพนักงาน 10,000+ คน',
      en: '10,000+ Employees Supported'
    }
  },
  {
    id: 'service',
    category: {
      th: 'สถานพยาบาล & ศูนย์บริการประชาชน',
      en: 'Hospitals & Citizen Service Centers'
    },
    badge: 'Smart Queuing & Service',
    title: {
      th: 'ศูนย์บริการลูกค้าและโรงพยาบาล',
      en: 'Customer Care & Medical Centers'
    },
    description: {
      th: 'ระบบจัดการคิวอัจฉริยะ iGenQ ช่วยจัดระเบียบการให้บริการ ประเมินระยะเวลารอคอยแบบ Real-time และเชื่อมต่อระบบนัดหมายออนไลน์',
      en: 'iGenQ smart queue management organizes service workflows, real-time wait estimation, and digital appointment scheduling.'
    },
    product: 'iGenQ (Smart Queuing)',
    stats: {
      th: 'ลดเวลารอคอยเฉลี่ย 40%',
      en: '40% Average Wait Time Reduction'
    }
  }
]

const handleConsultClick = () => {
  closeUserGroups()
  openDemo()
}
</script>

<template>
  <div
    v-if="isUserGroupsModalOpen"
    class="fixed inset-0 z-50 bg-forestBlack/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    @click.self="closeUserGroups"
  >
    <div class="w-full max-w-3xl bg-white dark:bg-[#0D1D16] rounded-3xl p-6 sm:p-8 border border-forestBlack/10 dark:border-[#00C978]/30 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button -->
      <button
        @click="closeUserGroups"
        class="absolute top-6 right-6 w-9 h-9 rounded-full bg-forestBlack/5 dark:bg-white/10 hover:bg-forestBlack/10 dark:hover:bg-white/20 text-mutedSlate dark:text-neutral-300 hover:text-forestBlack dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        :title="locale === 'th' ? 'ปิดหน้าต่าง' : 'Close'"
        aria-label="Close"
      >
        ✕
      </button>

      <!-- Badge & Title -->
      <div class="flex items-center gap-2 mb-3">
        <span class="w-2.5 h-2.5 rounded-full bg-[#00C978] animate-ping"></span>
        <span class="text-xs font-mono font-semibold text-[#00875A] dark:text-[#00E588] uppercase tracking-wider">
          {{ locale === 'th' ? 'กลุ่มผู้ใช้ผลิตภัณฑ์ & ลูกค้าองค์กร' : 'PRODUCT USER GROUPS & CLIENTS' }}
        </span>
      </div>

      <h2 class="text-2xl sm:text-3xl font-bold text-forestBlack dark:text-white mb-2">
        {{ locale === 'th' ? 'กลุ่มผู้ใช้งานระบบซอฟต์แวร์ IGENCO' : 'Enterprise User Groups & Client Portfolio' }}
      </h2>
      <p class="text-sm font-medium text-mutedSlate dark:text-neutral-300 mb-6">
        {{ locale === 'th'
          ? 'โซลูชันซอฟต์แวร์ที่ได้รับความไว้วางใจจากหน่วยงานภาครัฐ รัฐวิสาหกิจ และองค์กรเอกชนชั้นนำทั่วประเทศ'
          : 'Trusted enterprise solutions empowering government agencies, public enterprises, and leading corporations.' }}
      </p>

      <!-- User Groups Grid -->
      <div class="space-y-4 max-h-[58vh] overflow-y-auto pr-1 sm:pr-2">
        <div
          v-for="group in userGroups"
          :key="group.id"
          class="p-4 sm:p-5 rounded-2xl bg-[#F8FAF9] dark:bg-[#12261C] border border-forestBlack/5 dark:border-[#00C978]/20 hover:border-emerald-500/40 transition-all shadow-xs"
        >
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span class="text-xs font-bold text-[#00875A] dark:text-[#00E588] bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
              {{ locale === 'th' ? group.category.th : group.category.en }}
            </span>
            <span class="text-[11px] font-mono text-mutedSlate dark:text-neutral-400">
              {{ group.badge }}
            </span>
          </div>

          <h3 class="text-base sm:text-lg font-bold text-forestBlack dark:text-white mb-1.5">
            {{ locale === 'th' ? group.title.th : group.title.en }}
          </h3>

          <p class="text-xs sm:text-sm text-forestBlack/80 dark:text-neutral-300 leading-relaxed mb-3">
            {{ locale === 'th' ? group.description.th : group.description.en }}
          </p>

          <div class="flex flex-wrap items-center justify-between pt-3 border-t border-forestBlack/5 dark:border-white/10 gap-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-emeraldCore dark:text-[#00E588]">
              <span>{{ locale === 'th' ? '📦 ซอฟต์แวร์ที่ใช้งาน:' : '📦 Deployed Solution:' }}</span>
              <span class="underline decoration-emerald-400/50">{{ group.product }}</span>
            </div>
            <div class="text-[11px] font-mono font-medium text-forestBlack/70 dark:text-neutral-400 bg-white dark:bg-[#07120D] px-2.5 py-1 rounded-lg border border-forestBlack/10 dark:border-white/10">
              ✓ {{ locale === 'th' ? group.stats.th : group.stats.en }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer CTA -->
      <div class="mt-6 pt-4 border-t border-forestBlack/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-xs text-mutedSlate dark:text-neutral-400">
          {{ locale === 'th' ? 'มาตรฐานสากล ISO/IEC 29110 รับประกันคุณภาพทุกระบบ' : 'ISO/IEC 29110 Certified Software Engineering Standards' }}
        </div>
        <button
          @click="handleConsultClick"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00C978] hover:bg-[#00B368] text-forestBlack font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{{ locale === 'th' ? 'ปรึกษาทีมผู้เชี่ยวชาญ / นัดสาธิตระบบ' : 'Consult Specialists / Request Demo' }}</span>
          <span>↗</span>
        </button>
      </div>

    </div>
  </div>
</template>
