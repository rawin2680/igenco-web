<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppI18n } from '~/composables/useI18n'
import { useAppModal } from '~/composables/useModal'

const { locale } = useAppI18n()
const { openDemo, openChat } = useAppModal()

// ============================================================================
// 1. FEATURED HIGHLIGHT CAROUSEL (ผลิตภัณฑ์ไฮไลต์ของ IGENCO)
// ============================================================================
export interface FeaturedSlide {
  id: string
  numberBadge: string
  awardBadge: string
  title: { th: string; en: string }
  description: { th: string; en: string }
  image: string
  features: { th: string; en: string }[]
}

const featuredSlides: FeaturedSlide[] = [
  {
    id: 'hr-ai',
    numberBadge: '01 / 05 • FLAGSHIP HR & PAYROLL',
    awardBadge: '🏆 The Winner OIIO',
    title: {
      th: 'HR.ai — ระบบบริหารทรัพยากรมนุษย์อัจฉริยะ',
      en: 'HR.ai — Intelligent Human Resource & Payroll'
    },
    description: {
      th: 'ลงเวลาทำงานผ่าน GPS / Face Recognition บนมือถือ คำนวณเงินเดือน ภาษี สวัสดิการ และประเมินผล KPI อัตโนมัติ ครบจบในแพลตฟอร์มเดียวสำหรับองค์กรยุคใหม่',
      en: 'Mobile GPS & Face Recognition check-in, automated payroll, tax, benefits, and 360° KPI performance evaluations on a unified platform for modern enterprises.'
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    features: [
      { th: 'ลงเวลางานผ่านมือถือพร้อมตรวจจับใบหน้าและพิกัด GPS', en: 'Mobile GPS & facial recognition attendance tracking' },
      { th: 'คำนวณเงินเดือน ภาษี ประกันสังคมอัตโนมัติ ถูกต้องตามกฎหมาย 100%', en: '100% automated payroll, tax, and social security processing' },
      { th: 'ระบบพอร์ทัลพนักงาน ESS และหัวหน้างาน MSS ออนไลน์', en: 'Employee Self-Service (ESS) and Manager Portals (MSS)' }
    ]
  },
  {
    id: 'ismartflow',
    numberBadge: '02 / 05 • E-OFFICE & SARABAN',
    awardBadge: '⭐ ISO/IEC 29110 Certified',
    title: {
      th: 'i-SMARTFLOW — ระบบสารบรรณและสำนักงานอัตโนมัติ',
      en: 'i-SMARTFLOW — e-Saraban & Office Automation'
    },
    description: {
      th: 'ระบบบริหารงานสารบรรณอิเล็กทรอนิกส์ จัดการหนังสือราชการและเอกสารภายใน เกษียณหนังสือ และลงนามดิจิทัลมาตรฐานสากล ลดกระดาษ 100%',
      en: 'Enterprise e-Office & e-Saraban platform for document routing, legal digital signatures, and workflow automation, achieving 100% paperless efficiency.'
    },
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    features: [
      { th: 'รับ-ส่งหนังสือราชการ เกษียณหนังสือ และลงนามดิจิทัลถูกต้องตามกฎหมาย', en: 'Electronic memo receipt, dispatch, minute endorsement, and digital signature' },
      { th: 'กำหนดสายการอนุมัติ (Approval Workflow) ได้ยืดหยุ่นตามโครงสร้างหน่วยงาน', en: 'Customizable multi-tier approval routing for complex organizations' },
      { th: 'ระบบสืบค้นเอกสารอัจฉริยะแบบ OCR และ Full-Text Search', en: 'High-speed OCR and full-text document search' }
    ]
  },
  {
    id: 'iserff',
    numberBadge: '03 / 05 • REGULATORY REGTECH',
    awardBadge: '🏛️ มาตรฐาน คปภ.',
    title: {
      th: 'I-SERFF Enterprise — ระบบยื่นแบบกรมธรรม์ประกันภัย',
      en: 'I-SERFF Enterprise — OIC Regulatory Filing System'
    },
    description: {
      th: 'ระบบยื่นขอรับความเห็นชอบแบบและข้อความกรมธรรม์ประกันภัยทางอิเล็กทรอนิกส์ เชื่อมต่อสำนักงาน คปภ. ทั่วประเทศ ปลอดภัยระดับ Zero-Trust',
      en: 'Electronic insurance policy filing and endorsement submission gateway directly connecting with the Office of Insurance Commission nationwide.'
    },
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    features: [
      { th: 'เชื่อมต่อระบบยื่นแบบกับสำนักงาน คปภ. โดยตรง', en: 'Direct API integration with the OIC regulatory gateway' },
      { th: 'ตรวจสอบความถูกต้องของเอกสารและไฟล์แนบก่อนนำส่งอัตโนมัติ', en: 'Automated schema and document completeness validation' },
      { th: 'สถาปัตยกรรมความปลอดภัย Zero-Trust และการเข้ารหัสข้อมูลระดับสถาบันการเงิน', en: 'Zero-Trust security posture and bank-grade data encryption' }
    ]
  },
  {
    id: 'ifinsoft',
    numberBadge: '04 / 05 • ACCOUNTING & ERP',
    awardBadge: '💼 Enterprise Solution',
    title: {
      th: 'i-FINSOFT ERP — ระบบบริหารบัญชี การเงิน และทรัพยากรองค์กร',
      en: 'i-FINSOFT ERP — Financial & Resource Management'
    },
    description: {
      th: 'ระบบบัญชีและการเงินมาตรฐานครบวงจร เชื่อมโยงบัญชีแยกประเภท งบประมาณ ลูกหนี้ เจ้าหนี้ และออกงบการเงินได้อย่างแม่นยำ',
      en: 'Comprehensive accounting and financial management software integrating general ledger, receivables, payables, and corporate budgeting.'
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    features: [
      { th: 'เชื่อมโยงข้อมูลผังบัญชี ลูกหนี้ เจ้าหนี้ และระบบจัดซื้อครบวงจร', en: 'Unified chart of accounts, AR, AP, and procurement integration' },
      { th: 'บริหารงบประมาณและออกงบการเงินแบบเรียลไทม์', en: 'Real-time budget control and automated financial reporting' },
      { th: 'ผ่านการรับรองมาตรฐานซอฟต์แวร์วิศวกรรม ISO/IEC 29110', en: 'Certified under ISO/IEC 29110 software engineering standards' }
    ]
  },
  {
    id: 'iregist-igenq',
    numberBadge: '05 / 05 • SMART REGISTRATION & QUEUING',
    awardBadge: '🎫 Event & Service Tech',
    title: {
      th: 'i-Regist & iGenQ — ระบบลงทะเบียนและคิวอัจฉริยะ',
      en: 'i-Regist & iGenQ — Smart Registration & Queuing'
    },
    description: {
      th: 'แพลตฟอร์มบริหารการลงทะเบียนงานสัมมนา อีเวนต์ พร้อมระบบจัดคิวอัจฉริยะ ออก QR Code เช็กอินหน้างาน และลดเวลารอคอยได้อย่างมีประสิทธิภาพ',
      en: 'End-to-end event registration, automated QR check-in, and smart queuing orchestration tailored for conferences, hospitals, and citizen centers.'
    },
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    features: [
      { th: 'ระบบจองและออก QR Code เช็กอินเข้าร่วมงานสะดวกรวดเร็ว', en: 'Instant online booking and QR Code digital badge check-in' },
      { th: 'ระบบจัดคิวอัจฉริยะ iGenQ คำนวณเวลารอคอยแบบเรียลไทม์', en: 'iGenQ intelligent queuing with real-time wait estimation' },
      { th: 'ออกใบประกาศนียบัตรออนไลน์และสรุปสถิติผู้เข้าร่วมงาน', en: 'Automated e-Certificates and live attendee analytics' }
    ]
  }
]

const currentSlideIndex = ref(0)
const isAutoPlay = ref(true)
let autoPlayTimer: any = null

const nextSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % featuredSlides.length
}

const prevSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value - 1 + featuredSlides.length) % featuredSlides.length
}

const goToSlide = (idx: number) => {
  currentSlideIndex.value = idx
}

const toggleAutoPlay = () => {
  isAutoPlay.value = !isAutoPlay.value
  if (isAutoPlay.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayTimer = setInterval(() => {
    if (isAutoPlay.value) {
      nextSlide()
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// ============================================================================
// 2. 12 ALL PRODUCTS & SERVICES OF IGENCO (ผลิตภัณฑ์และบริการทั้งหมด)
// ============================================================================
export interface SolutionCard {
  id: string
  iconType: string
  iconBg: string
  iconColor: string
  tag: string
  title: string
  subtitle: { th: string; en: string }
  description: { th: string; en: string }
  tags: string[]
}

const solutionsList: SolutionCard[] = [
  {
    id: 'i-smartflow',
    iconType: 'document-pen',
    iconBg: 'bg-[#E8F8F2] border border-[#B5EAD3]',
    iconColor: 'text-[#00875A]',
    tag: 'e-Office & Workflow',
    title: 'i-SMARTFLOW',
    subtitle: {
      th: 'โปรแกรมระบบบริหารสำนักงานอัตโนมัติ (e-Office)',
      en: 'Enterprise e-Office & Workflow Automation'
    },
    description: {
      th: 'ระบบสารบรรณอิเล็กทรอนิกส์และสายอนุมัติเอกสารอัตโนมัติ ลดการใช้กระดาษ ติดตามสถานะเอกสารแบบเรียลไทม์ รองรับการลงนามดิจิทัล',
      en: 'Electronic document lifecycle management with dynamic approval flows, digital signatures, and real-time tracking.'
    },
    tags: ['e-Saraban', 'Paperless', 'Digital Sign']
  },
  {
    id: 'hr-ai',
    iconType: 'users',
    iconBg: 'bg-[#E0F2FE] border border-[#BAE6FD]',
    iconColor: 'text-[#0284C7]',
    tag: 'HR & Payroll Cloud',
    title: 'HR.ai (i-Huris)',
    subtitle: {
      th: 'ระบบบริหารทรัพยากรมนุษย์และเงินเดือนครบวงจร',
      en: 'Comprehensive Human Capital & Payroll Suite'
    },
    description: {
      th: 'ซอฟต์แวร์บริหารงานบุคคลรางวัลชนะเลิศ The Winner OIIO ครอบคลุมการลงเวลา คำนวณเงินเดือน ภาษี สวัสดิการ และประเมินผล KPI',
      en: 'Award-winning OIIO human resource software covering mobile attendance, payroll, tax, benefits, and KPI evaluation.'
    },
    tags: ['Payroll', 'Mobile Time', 'OIIO Winner']
  },
  {
    id: 'i-finsoft',
    iconType: 'pie-chart',
    iconBg: 'bg-[#CCFBF1] border border-[#99F6E4]',
    iconColor: 'text-[#0D9488]',
    tag: 'Accounting & ERP',
    title: 'i-FINSOFT — ERP',
    subtitle: {
      th: 'ระบบบริหารบัญชี การเงิน และทรัพยากรองค์กร',
      en: 'Financial Accounting & Enterprise Planning'
    },
    description: {
      th: 'ระบบบัญชีและการเงินมาตรฐานครบวงจร เชื่อมโยงข้อมูลบัญชีแยกประเภท เจ้าหนี้ ลูกหนี้ งบประมาณ และออกงบการเงินได้อย่างแม่นยำ',
      en: 'Standardized accounting and finance management linking GL, AR, AP, budgeting, and precision financial statements.'
    },
    tags: ['General Ledger', 'Budgeting', 'Financial Report']
  },
  {
    id: 'igenco-bsc',
    iconType: 'target',
    iconBg: 'bg-[#EDE9FE] border border-[#DDD6FE]',
    iconColor: 'text-[#7C3AED]',
    tag: 'KPI & Balanced Scorecard',
    title: 'iGenco BSC',
    subtitle: {
      th: 'ระบบประเมินและวัดผลการปฏิบัติงานองค์กร',
      en: 'Enterprise Performance & KPI Measurement'
    },
    description: {
      th: 'ระบบบริหารจัดการตัวชี้วัด (KPI) ตามแนวคิด Balanced Scorecard เชื่อมโยงเป้าหมายระดับองค์กรสู่ระดับฝ่ายและรายบุคคลอย่างเป็นรูปธรรม',
      en: 'Balanced Scorecard and KPI performance tracking aligning strategic corporate objectives with department and employee goals.'
    },
    tags: ['KPI Tracking', 'Scorecard', 'Performance']
  },
  {
    id: 'i-regist',
    iconType: 'badge-id',
    iconBg: 'bg-[#F3E8FF] border border-[#E9D5FF]',
    iconColor: 'text-[#9333EA]',
    tag: 'Smart Registration',
    title: 'i-Regist',
    subtitle: {
      th: 'ระบบลงทะเบียนที่ตอบโจทย์ทุกการลงทะเบียน',
      en: 'Smart Event & Seminar Registration Platform'
    },
    description: {
      th: 'แพลตฟอร์มบริหารจัดการการลงทะเบียนงานสัมมนา อีเวนต์ และการอบรม รองรับการออก QR Code เช็กอินหน้างาน และออกใบประกาศฯ',
      en: 'Event, training, and conference registration platform with automated QR Code on-site check-in and e-Certificate generation.'
    },
    tags: ['QR Check-in', 'Event Badge', 'Certificate']
  },
  {
    id: 'i-education',
    iconType: 'graduation',
    iconBg: 'bg-[#FEF3C7] border border-[#FDE68A]',
    iconColor: 'text-[#D97706]',
    tag: 'Academic Management',
    title: 'i-EDUCATION',
    subtitle: {
      th: 'ระบบบริหารจัดการด้านการศึกษาและสถานศึกษา',
      en: 'Academic & Institutional Management System'
    },
    description: {
      th: 'ระบบสารสนเทศสำหรับสถาบันการศึกษา ครอบคลุมประวัตินักศึกษา การลงทะเบียนเรียน ตารางสอน การวัดผล และระบบเกรดออนไลน์',
      en: 'Campus information system covering student records, course registration, scheduling, assessment, and online grading.'
    },
    tags: ['Student Portal', 'Grading System', 'Course Registration']
  },
  {
    id: 'i-real-estate',
    iconType: 'building',
    iconBg: 'bg-[#E6F4EA] border border-[#CEEAD6]',
    iconColor: 'text-[#137333]',
    tag: 'Property & Condo CRM',
    title: 'i-Real Estate',
    subtitle: {
      th: 'ระบบบริหารการขายและจองโครงการอสังหาริมทรัพย์',
      en: 'Property Sales & Booking Management'
    },
    description: {
      th: 'ระบบบริหารการขายสำหรับโครงการคอนโดมิเนียมและบ้านจัดสรร แสดงผังห้องว่างแบบเรียลไทม์ คำนวณค่างวด สัญญาจอง และโอนกรรมสิทธิ์',
      en: 'Sales and unit reservation management for condominiums and residential projects with real-time floor plans and installment calculators.'
    },
    tags: ['Unit Layout', 'Booking & Contract', 'Installment']
  },
  {
    id: 'ipos',
    iconType: 'cash-register',
    iconBg: 'bg-[#FFE4E6] border border-[#FECDD3]',
    iconColor: 'text-[#E11D48]',
    tag: 'Point of Sale & Stock',
    title: 'iPOS',
    subtitle: {
      th: 'ระบบบริหารการขายหน้าร้านและคลังสินค้าอัจฉริยะ',
      en: 'Smart Retail POS & Inventory Management'
    },
    description: {
      th: 'ระบบขายหน้าร้าน (Point of Sale) ที่ใช้งานง่าย รองรับการสแกนบาร์โค้ด จัดโปรโมชัน ตัดสต็อกสินค้าอัตโนมัติ และดูยอดขายได้ทุกสาขา',
      en: 'User-friendly Point of Sale system with barcode scanning, automated stock deduction, promotional tools, and multi-branch sales analytics.'
    },
    tags: ['Barcode Scan', 'Multi-Branch', 'Stock Alert']
  },
  {
    id: 'imme-application',
    iconType: 'heart',
    iconBg: 'bg-[#FCE7F3] border border-[#FBCFE8]',
    iconColor: 'text-[#DB2777]',
    tag: 'Wedding & Event App',
    title: 'iMme Application',
    subtitle: {
      th: 'แอปพลิเคชันบันทึกงานแต่งงานและจัดการแขกผู้ร่วมงาน',
      en: 'Wedding & Guest Experience Application'
    },
    description: {
      th: 'แพลตฟอร์มดิจิทัลสำหรับคู่บ่าวสาวและออแกไนเซอร์ ช่วยบันทึกของขวัญ ซองร่วมแสดงความยินดี รายชื่อแขก และจัดการงบประมาณงานแต่ง',
      en: 'Digital platform for couples and wedding organizers to manage guest lists, monetary blessings, gift registries, and budget plans.'
    },
    tags: ['Gift Registry', 'Guest List', 'Mobile App']
  },
  {
    id: 'i-smartsoft',
    iconType: 'document-case',
    iconBg: 'bg-[#CFFAFE] border border-[#A5F3FC]',
    iconColor: 'text-[#0891B2]',
    tag: 'Document & Case Tracking',
    title: 'i-SMARTSOFT',
    subtitle: {
      th: 'ชุดซอฟต์แวร์บริหารงานเอกสารและติดตามงานองค์กร',
      en: 'Document Management & Workflow Tracking'
    },
    description: {
      th: 'โซลูชันจัดการเอกสารดิจิทัล จัดเก็บไฟล์อย่างเป็นหมวดหมู่ กำหนดสิทธิ์การเข้าถึง และติดตามความคืบหน้าของงานในแต่ละแผนก',
      en: 'Digital document repository with category indexing, role-based access permissions, and departmental task tracking.'
    },
    tags: ['Document Mgmt', 'Permission Control', 'Task Tracking']
  },
  {
    id: 'software-ondemand',
    iconType: 'code',
    iconBg: 'bg-[#F1F5F9] border border-[#E2E8F0]',
    iconColor: 'text-[#334155]',
    tag: 'Custom Development',
    title: 'Software OnDemand',
    subtitle: {
      th: 'บริการออกแบบและพัฒนาซอฟต์แวร์ตามความต้องการเฉพาะ',
      en: 'Tailored Software Design & Development'
    },
    description: {
      th: 'บริการพัฒนาเว็บแอปพลิเคชัน โมบายแอปพลิเคชัน และเชื่อมต่อ API ตามกระบวนการธุรกิจเฉพาะขององค์กร ภายใต้มาตรฐาน ISO/IEC 29110',
      en: 'Custom web and mobile application engineering, system integrations, and API workflows certified under ISO/IEC 29110.'
    },
    tags: ['Custom Web/App', 'API Integration', 'ISO 29110']
  },
  {
    id: 'outsource-service',
    iconType: 'user-tech',
    iconBg: 'bg-[#DCFCE7] border border-[#BBF7D0]',
    iconColor: 'text-[#15803D]',
    tag: 'IT Professional Team',
    title: 'OutSource Service',
    subtitle: {
      th: 'บริการจัดหาบุคลากรผู้เชี่ยวชาญด้านเทคโนโลยีสารสนเทศ',
      en: 'IT Talent Outsourcing & Professional Staffing'
    },
    description: {
      th: 'บริการจัดส่งทีมนักวิเคราะห์ระบบ (SA) โปรแกรมเมอร์ (Developer) และผู้ดูแลระบบมืออาชีพ เพื่อขับเคลื่อนโครงการไอทีขององค์กร',
      en: 'Dedicated IT staffing including System Analysts (SA), Developers, and System Administrators to drive enterprise projects.'
    },
    tags: ['Dedicated Team', 'SA & Developer', 'Enterprise SLA']
  }
]

// Modal State
const selectedDetailItem = ref<any | null>(null)

const openModalForSlide = (slide: FeaturedSlide) => {
  selectedDetailItem.value = {
    title: slide.title[locale.value] || slide.title.th,
    tag: slide.numberBadge,
    subtitle: slide.awardBadge,
    description: slide.description[locale.value] || slide.description.th,
    features: slide.features.map(f => f[locale.value] || f.th),
    tags: ['ISO 29110', 'Enterprise Solution', 'Sovereign Architecture']
  }
}

const openModalForSolution = (item: SolutionCard) => {
  selectedDetailItem.value = {
    title: item.title,
    tag: item.tag,
    subtitle: item.subtitle[locale.value] || item.subtitle.th,
    description: item.description[locale.value] || item.description.th,
    features: [
      item.subtitle[locale.value] || item.subtitle.th,
      item.description[locale.value] || item.description.th
    ],
    tags: item.tags
  }
}

const closeModal = () => {
  selectedDetailItem.value = null
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <section id="products" class="relative z-10 py-20 sm:py-28 px-4 sm:px-6 bg-[#F8FAF9] border-t border-forestBlack/[0.06] scroll-mt-20">
    
    <!-- Background Tech Grid Lines -->
    <div class="absolute inset-0 bg-grid-dots pointer-events-none opacity-40"></div>

    <div class="max-w-7xl mx-auto relative z-10 space-y-20 sm:space-y-28">
      
      <!-- ==================================================================== -->
      <!-- 1. FEATURED HIGHLIGHT CAROUSEL (ผลิตภัณฑ์ไฮไลต์ของ IGENCO)            -->
      <!-- ==================================================================== -->
      <div>
        
        <!-- Header Bar & Slide Controls Matching Image 1 -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <!-- Eyebrow -->
            <div class="text-xs sm:text-[13px] font-mono font-semibold tracking-[0.2em] uppercase text-[#059669] mb-2">
              FEATURED SOLUTIONS • PRODUCT SHOWCASE
            </div>
            <!-- Headline with dot -->
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-forestBlack">
              {{ locale === 'th' ? 'ผลิตภัณฑ์ไฮไลต์ของ IGENCO.' : 'Featured Highlights of IGENCO.' }}
            </h2>
          </div>

          <!-- Controls: [⏸ เลื่อนอัตโนมัติ] & [<] [>] Navigation -->
          <div class="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
            <!-- Auto-slide toggle pill -->
            <button
              type="button"
              @click="toggleAutoPlay"
              class="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs active:scale-95 whitespace-nowrap"
              :class="isAutoPlay
                ? 'bg-[#E8F8F2] border-[#B5EAD3] text-[#00875A]'
                : 'bg-white border-forestBlack/15 text-mutedSlate hover:text-forestBlack'"
              :title="isAutoPlay ? 'คลิกเพื่อหยุดเลื่อนอัตโนมัติ' : 'คลิกเพื่อเปิดเลื่อนอัตโนมัติ'"
            >
              <span>{{ isAutoPlay ? '⏸' : '▶' }}</span>
              <span>{{ isAutoPlay ? (locale === 'th' ? 'เลื่อนอัตโนมัติ' : 'Auto Playing') : (locale === 'th' ? 'หยุดเลื่อน' : 'Paused') }}</span>
            </button>

            <!-- Prev Arrow -->
            <button
              type="button"
              @click="prevSlide"
              class="w-9 h-9 rounded-full bg-white hover:bg-forestBlack/5 text-forestBlack border border-forestBlack/15 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              :title="locale === 'th' ? 'สไลด์ก่อนหน้า' : 'Previous slide'"
              aria-label="Previous"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <!-- Next Arrow -->
            <button
              type="button"
              @click="nextSlide"
              class="w-9 h-9 rounded-full bg-white hover:bg-forestBlack/5 text-forestBlack border border-forestBlack/15 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              :title="locale === 'th' ? 'สไลด์ถัดไป' : 'Next slide'"
              aria-label="Next"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Main Featured Card Carousel (Split Content Left / Image Right) -->
        <div
          class="relative bg-white rounded-[32px] border border-forestBlack/[0.08] shadow-[0_12px_45px_rgba(9,20,14,0.06)] overflow-hidden transition-all duration-500"
          @mouseenter="stopAutoPlay"
          @mouseleave="isAutoPlay ? startAutoPlay() : null"
        >
          <!-- Current Active Slide -->
          <div
            :key="featuredSlides[currentSlideIndex].id"
            class="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] lg:min-h-[460px] animate-in fade-in duration-300"
          >
            <!-- Left Half: Badges + Title + Description + Actions (6 cols) -->
            <div class="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
              
              <!-- Badges Row -->
              <div class="flex flex-wrap items-center gap-2.5 mb-4">
                <span class="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#00C978] text-forestBlack shadow-xs">
                  {{ featuredSlides[currentSlideIndex].numberBadge }}
                </span>
                <span class="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  {{ featuredSlides[currentSlideIndex].awardBadge }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-forestBlack leading-[1.25] mb-4">
                {{ featuredSlides[currentSlideIndex].title[locale] || featuredSlides[currentSlideIndex].title.th }}
              </h3>

              <!-- Description -->
              <p class="text-sm sm:text-base text-mutedSlate leading-relaxed mb-8">
                {{ featuredSlides[currentSlideIndex].description[locale] || featuredSlides[currentSlideIndex].description.th }}
              </p>

              <!-- Action Buttons: [ดูรายละเอียด] & [ขอทดสอบระบบ ↗] -->
              <div class="flex flex-wrap items-center gap-3 mt-auto">
                <button
                  type="button"
                  @click="openModalForSlide(featuredSlides[currentSlideIndex])"
                  class="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-forestBlack/5 text-forestBlack border border-forestBlack/15 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {{ locale === 'th' ? 'ดูรายละเอียด' : 'View Details' }}
                </button>
                <button
                  type="button"
                  @click="openDemo"
                  class="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#00C978] hover:bg-[#00B36B] text-forestBlack transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <span>{{ locale === 'th' ? 'ขอทดสอบระบบ' : 'Request Demo' }}</span>
                  <span class="font-bold">↗</span>
                </button>
              </div>

            </div>

            <!-- Right Half: Full Bleed Photo (6 cols) -->
            <div class="lg:col-span-6 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-forestBlack/5">
              <img
                :src="featuredSlides[currentSlideIndex].image"
                :alt="featuredSlides[currentSlideIndex].title[locale] || featuredSlides[currentSlideIndex].title.th"
                class="w-full h-full object-cover"
                loading="eager"
              />
              <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        <!-- Carousel Pagination Dots (5 Indicators Matching Screenshot) -->
        <div class="flex items-center justify-center gap-2 mt-6">
          <button
            v-for="(slide, idx) in featuredSlides"
            :key="slide.id"
            type="button"
            @click="goToSlide(idx)"
            class="transition-all duration-300 cursor-pointer p-1"
            :title="slide.title[locale] || slide.title.th"
          >
            <span
              class="block rounded-full transition-all duration-300"
              :class="currentSlideIndex === idx
                ? 'w-7 h-2 bg-forestBlack'
                : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'"
            ></span>
          </button>
        </div>

      </div>

      <!-- ==================================================================== -->
      <!-- 2. ALL PRODUCTS & SERVICES OF IGENCO (12 SOLUTIONS GRID)             -->
      <!-- ==================================================================== -->
      <div>
        
        <!-- Header Bar Matching Image 2 -->
        <div class="flex items-center justify-between mb-8 pb-3 border-b border-forestBlack/[0.08]">
          <h2 class="text-2xl sm:text-3xl font-bold text-forestBlack">
            {{ locale === 'th' ? 'ผลิตภัณฑ์และบริการทั้งหมดของ IGENCO' : 'All Products & Services of IGENCO' }}
          </h2>
          <div class="text-xs sm:text-sm font-mono text-mutedSlate font-semibold">
            12 Solutions
          </div>
        </div>

        <!-- 12 Solutions Clean Apple Grid (3 columns x 4 rows) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          
          <div
            v-for="item in solutionsList"
            :key="item.id"
            class="bg-white rounded-[26px] p-6 sm:p-7 border border-forestBlack/[0.08] shadow-[0_6px_25px_rgba(9,20,14,0.03)] hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col group"
          >
            <!-- Card Top: Squircle App Icon (Left) + Tag Badge (Right) -->
            <div class="flex items-start justify-between gap-3 mb-5">
              
              <!-- Left Squircle Icon Capsule -->
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105"
                :class="[item.iconBg, item.iconColor]"
              >
                <!-- 1. Document Pen (i-SMARTFLOW) -->
                <svg v-if="item.iconType === 'document-pen'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>

                <!-- 2. Users (HR.ai) -->
                <svg v-else-if="item.iconType === 'users'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>

                <!-- 3. Pie Chart (i-FINSOFT) -->
                <svg v-else-if="item.iconType === 'pie-chart'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                </svg>

                <!-- 4. Target / BSC (iGenco BSC) -->
                <svg v-else-if="item.iconType === 'target'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>

                <!-- 5. Badge ID (i-Regist) -->
                <svg v-else-if="item.iconType === 'badge-id'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2"/>
                  <circle cx="12" cy="10" r="3"/>
                  <path d="M7 17a5 5 0 0 1 10 0"/>
                </svg>

                <!-- 6. Graduation Cap (i-EDUCATION) -->
                <svg v-else-if="item.iconType === 'graduation'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>

                <!-- 7. Building (i-Real Estate) -->
                <svg v-else-if="item.iconType === 'building'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <line x1="8" y1="6" x2="8" y2="6.01"/>
                  <line x1="12" y1="6" x2="12" y2="6.01"/>
                  <line x1="16" y1="6" x2="16" y2="6.01"/>
                  <line x1="8" y1="10" x2="8" y2="10.01"/>
                  <line x1="12" y1="10" x2="12" y2="10.01"/>
                  <line x1="16" y1="10" x2="16" y2="10.01"/>
                  <line x1="8" y1="14" x2="8" y2="14.01"/>
                  <line x1="12" y1="14" x2="12" y2="14.01"/>
                  <line x1="16" y1="14" x2="16" y2="14.01"/>
                  <path d="M10 22v-4h4v4"/>
                </svg>

                <!-- 8. Cash Register / POS (iPOS) -->
                <svg v-else-if="item.iconType === 'cash-register'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                  <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>
                  <line x1="7" y1="15" x2="7.01" y2="15"/>
                  <line x1="11" y1="15" x2="11.01" y2="15"/>
                  <line x1="15" y1="15" x2="15.01" y2="15"/>
                  <line x1="7" y1="18" x2="7.01" y2="18"/>
                  <line x1="11" y1="18" x2="11.01" y2="18"/>
                  <line x1="15" y1="18" x2="15.01" y2="18"/>
                </svg>

                <!-- 9. Heart (iMme Application) -->
                <svg v-else-if="item.iconType === 'heart'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>

                <!-- 10. Document Case (i-SMARTSOFT) -->
                <svg v-else-if="item.iconType === 'document-case'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="9"/>
                  <rect x="14" y="3" width="7" height="5"/>
                  <rect x="14" y="12" width="7" height="9"/>
                  <rect x="3" y="16" width="7" height="5"/>
                </svg>

                <!-- 11. Code Brackets (Software OnDemand) -->
                <svg v-else-if="item.iconType === 'code'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>

                <!-- 12. IT Professional (OutSource Service) -->
                <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>

              <!-- Right Pill Tag -->
              <span class="px-3 py-1 rounded-full text-[11px] font-mono font-medium text-mutedSlate bg-[#F8FAF9] border border-forestBlack/10">
                {{ item.tag }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-lg sm:text-xl font-bold text-forestBlack mb-1 group-hover:text-[#00875A] transition-colors">
              {{ item.title }}
            </h3>

            <!-- Subtitle in green font -->
            <h4 class="text-xs font-semibold text-[#00875A] mb-3 leading-normal">
              {{ item.subtitle[locale] || item.subtitle.th }}
            </h4>

            <!-- Description -->
            <p class="text-xs text-mutedSlate leading-relaxed line-clamp-3 mb-5">
              {{ item.description[locale] || item.description.th }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap items-center gap-1.5 mb-6">
              <span
                v-for="(t, idx) in item.tags"
                :key="idx"
                class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#F8FAF9] text-mutedSlate border border-forestBlack/5"
              >
                {{ t }}
              </span>
            </div>

            <!-- Action Buttons: [ดูรายละเอียด] (Left) | [สอบถาม ↗] (Right) -->
            <div class="mt-auto pt-4 border-t border-forestBlack/[0.06] flex items-center justify-between gap-3">
              <button
                type="button"
                @click="openModalForSolution(item)"
                class="px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-forestBlack/5 text-forestBlack border border-forestBlack/15 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {{ locale === 'th' ? 'ดูรายละเอียด' : 'Details' }}
              </button>

              <button
                type="button"
                @click="openDemo"
                class="px-5 py-2 rounded-full text-xs font-semibold bg-forestBlack hover:bg-[#00C978] text-white hover:text-forestBlack transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span>{{ locale === 'th' ? 'สอบถาม' : 'Inquire' }}</span>
                <span class="text-xs">↗</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- ==================================================================== -->
    <!-- DETAIL MODAL                                                         -->
    <!-- ==================================================================== -->
    <div
      v-if="selectedDetailItem"
      class="fixed inset-0 z-50 bg-forestBlack/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-forestBlack/10 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-6 right-6 w-9 h-9 rounded-full bg-forestBlack/5 hover:bg-forestBlack/10 text-mutedSlate hover:text-forestBlack flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <!-- Badge -->
        <div class="flex items-center gap-2 mb-2">
          <span class="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E8F8F2] text-[#00875A] border border-[#B5EAD3]">
            {{ selectedDetailItem.tag }}
          </span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold text-forestBlack mb-1 leading-snug">
          {{ selectedDetailItem.title }}
        </h2>

        <p class="text-xs font-semibold text-[#00875A] mb-4">
          {{ selectedDetailItem.subtitle }}
        </p>

        <!-- Description -->
        <p class="text-xs sm:text-sm text-forestBlack/80 leading-relaxed mb-5">
          {{ selectedDetailItem.description }}
        </p>

        <!-- Features list if any -->
        <div v-if="selectedDetailItem.features && selectedDetailItem.features.length > 0" class="mb-6 p-4 rounded-2xl bg-[#F8FAF9] border border-forestBlack/5">
          <h4 class="font-bold text-xs text-forestBlack mb-2.5 flex items-center gap-2">
            <span class="w-1.5 h-3.5 rounded-full bg-[#00C978]"></span>
            <span>{{ locale === 'th' ? 'จุดเด่นและคุณสมบัติสำคัญ:' : 'Key Capabilities & Features:' }}</span>
          </h4>
          <ul class="space-y-2 text-xs text-mutedSlate">
            <li v-for="(feat, i) in selectedDetailItem.features" :key="i" class="flex items-start gap-2">
              <span class="text-[#00C978] font-bold">✓</span>
              <span>{{ feat }}</span>
            </li>
          </ul>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap items-center gap-1.5 mb-6">
          <span
            v-for="(t, idx) in selectedDetailItem.tags"
            :key="idx"
            class="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8FAF9] text-forestBlack/80 border border-forestBlack/10"
          >
            #{{ t }}
          </span>
        </div>

        <!-- Action Footer -->
        <div class="pt-4 border-t border-forestBlack/10 flex items-center justify-end gap-3">
          <button
            @click="closeModal"
            class="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#F8FAF9] text-forestBlack border border-forestBlack/10 hover:bg-forestBlack/5 transition-colors cursor-pointer"
          >
            {{ locale === 'th' ? 'ปิด' : 'Close' }}
          </button>
          <button
            @click="closeModal(); openDemo()"
            class="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#00C978] hover:bg-[#00B36B] text-forestBlack transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>{{ locale === 'th' ? 'ขอใบเสนอราคา / นัดสาธิต' : 'Request Demo' }}</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </div>

  </section>
</template>
