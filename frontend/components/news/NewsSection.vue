<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppI18n } from '~/composables/useI18n'
import { useAppModal } from '~/composables/useModal'

const { locale } = useAppI18n()
const { openDemo } = useAppModal()

interface Article {
  id: number
  tag: string
  category: 'Enterprise Software' | 'Service Development' | 'E-Commerce'
  readTime: string
  date: { th: string; en: string }
  title: { th: string; en: string }
  subtitle: { th: string; en: string }
  body: { th: string; en: string }
  fullContent?: { th: string; en: string }
  image: string
  link?: string
}

const articles = ref<Article[]>([
  {
    id: 1,
    tag: 'Enterprise Software',
    category: 'Enterprise Software',
    readTime: '1 min',
    date: { th: '25 มกราคม 2560', en: 'January 25, 2017' },
    title: {
      th: 'IGENCO ผ่านการรับรองมาตรฐาน ISO/IEC 29110',
      en: 'IGENCO Achieves ISO/IEC 29110 International Certification'
    },
    subtitle: {
      th: 'กระบวนการด้านการบริหารโครงการและกระบวนการด้านการสร้างซอฟต์แวร์',
      en: 'Project Management & Software Implementation Engineering Standards'
    },
    body: {
      th: 'มาตรฐาน ISO 29110 ช่วยในการปรับปรุงสมรรถนะองค์กร ทำให้มีการบริหารจัดการคุณภาพและบริการด้านซอฟต์แวร์ที่มีประสิทธิภาพและมีศักยภาพในการเติบโตทางธุรกิจขององค์กร อีกทั้งยังสร้างความน่าเชื่อถือ',
      en: 'The ISO/IEC 29110 standard enhances organizational performance, ensuring quality software services, high operational efficiency, and international credibility for all enterprise clients.'
    },
    fullContent: {
      th: 'บริษัท ไอเจนโก้ จำกัด ได้ผ่านการตรวจประเมินและได้รับการรับรองมาตรฐานสากล ISO/IEC 29110 ในส่วนของกระบวนการด้านการบริหารโครงการ (Project Management) และกระบวนการด้านการสร้างซอฟต์แวร์ (Software Implementation) โดยมาตรฐาน ISO 29110 ช่วยในการปรับปรุงสมรรถนะองค์กร ทำให้มีการบริหารจัดการคุณภาพและบริการด้านซอฟต์แวร์ที่มีประสิทธิภาพและมีศักยภาพในการเติบโตทางธุรกิจขององค์กร อีกทั้งยังสร้างความน่าเชื่อถือแก่คู่ค้าและหน่วยงานผู้รับบริการในระดับสากล',
      en: 'IGENCO Co., Ltd. has successfully passed rigorous audits and achieved ISO/IEC 29110 international software engineering certification covering Project Management and Software Implementation. This standard validates our systematic engineering rigor, enterprise quality assurance, and proven capability in delivering mission-critical public and private software projects.'
    },
    image: '/images/news/iso29110.jpg',
    link: 'https://igenco.co.th/index.php/th/content?view=article&id=37:i-serff-training-day-1&catid=8'
  },
  {
    id: 2,
    tag: 'Service Development',
    category: 'Service Development',
    readTime: '1 min',
    date: { th: '21 มีนาคม 2561', en: 'March 21, 2018' },
    title: {
      th: 'IGENCO ครบรอบ 8 ปี — กิจกรรมเพื่อสังคม (CSR)',
      en: 'IGENCO 8th Anniversary — Corporate Social Responsibility (CSR)'
    },
    subtitle: {
      th: 'ร่วมบริจาคเงินสนับสนุนและสิ่งของเครื่องใช้ ณ สถานสงเคราะห์เด็กอ่อนปากเกร็ด',
      en: 'Donation and community support at Pakkred Babies Home'
    },
    body: {
      th: 'วันที่ 21 มีนาคม 2561 ผู้บริหารและทีมงาน บริษัท ไอเจนโก้ จำกัด ร่วมกันจัดกิจกรรมบริจาคเงินสนับสนุนและสิ่งของเครื่องใช้จำเป็นให้กับน้องๆ ในสถานสงเคราะห์เด็กอ่อนปากเกร็ด ในวาระที่บริษัทฯ ได้เปิดมาครบ',
      en: 'On March 21, 2018, executives and staff from IGENCO Co., Ltd. organized a charitable donation of necessary supplies and financial support to children at Pakkred Babies Home in celebration of our 8th corporate anniversary.'
    },
    fullContent: {
      th: 'วันที่ 21 มีนาคม 2561 ผู้บริหารและทีมงาน บริษัท ไอเจนโก้ จำกัด ร่วมกันจัดกิจกรรมบริจาคเงินสนับสนุนและสิ่งของเครื่องใช้จำเป็นให้กับน้องๆ ในสถานสงเคราะห์เด็กอ่อนปากเกร็ด ในวาระที่บริษัทฯ ได้เปิดมาครบ 8 ปี เพื่อส่งเสริมและร่วมเป็นส่วนหนึ่งในการตอบแทนสังคมอย่างยั่งยืน',
      en: 'On March 21, 2018, the executive team and employees of IGENCO Co., Ltd. united to host a CSR initiative providing essential goods and donations to the Pakkred Babies Home, marking 8 years of corporate growth and sustainable community support.'
    },
    image: '/images/news/csr8years.jpg',
    link: 'https://igenco.co.th/index.php/th/content?view=article&id=70:erp&catid=8'
  },
  {
    id: 3,
    tag: 'Enterprise Software',
    category: 'Enterprise Software',
    readTime: '1 min',
    date: { th: '27 กุมภาพันธ์ 2558', en: 'February 27, 2015' },
    title: {
      th: 'I-SERFF Training Day — อบรมระบบยื่นแบบ คปภ.',
      en: 'I-SERFF Training Day — OIC Regulatory Filing Workshop'
    },
    subtitle: {
      th: 'ความร่วมมือกับสำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย (คปภ.)',
      en: 'Strategic collaboration with the Office of Insurance Commission (OIC)'
    },
    body: {
      th: 'ภาพกิจกรรมการจัดอบรมหลักสูตรสำหรับผู้ใช้งานตัวแทนบริษัทประกันภัย สำหรับการใช้งานระบบ I-SERFF โดยความร่วมมือจากสำนักงานคณะกรรมการกำกับและส่งเสริมการ...',
      en: 'Highlights from the official certification workshop for insurance company representatives using the I-SERFF system, held in close collaboration with the Office of Insurance Commission.'
    },
    fullContent: {
      th: 'บริษัท ไอเจนโก้ จำกัด ร่วมกับสำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย (คปภ.) จัดการอบรมเชิงปฏิบัติการให้แก่ตัวแทนและเจ้าหน้าที่จากบริษัทประกันภัยชั้นนำ เพื่อเตรียมความพร้อมในการใช้งานระบบยื่นแบบและขอรับความเห็นชอบอัตราเบี้ยประกันภัยทางอิเล็กทรอนิกส์ (I-SERFF) ช่วยเพิ่มความสะดวกรวดเร็ว ความโปร่งใส และลดขั้นตอนเอกสารลงอย่างมีนัยสำคัญ',
      en: 'IGENCO Co., Ltd., in partnership with the Office of Insurance Commission (OIC), hosted a comprehensive hands-on training workshop for underwriters and officers from top insurance enterprises across Thailand, ensuring streamlined electronic filing and rapid regulatory approval under the I-SERFF platform.'
    },
    image: '/images/news/iserff.jpg',
    link: 'https://igenco.co.th/index.php/th/content?view=article&id=35:i-serff-training-day&catid=8'
  },
  {
    id: 4,
    tag: 'E-Commerce',
    category: 'E-Commerce',
    readTime: '1 min',
    date: { th: 'โครงการระบบข้อมูล สคฝ.', en: 'DPA System Initiative' },
    title: {
      th: 'การประชุมชี้แจงการใช้งานระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ (EFMS)',
      en: 'EFMS Electronic Filing Management System Orientation'
    },
    subtitle: {
      th: 'โครงการพัฒนาระบบเชื่อมต่อข้อมูลระหว่างสถาบันคุ้มครองเงินฝากและสถาบันการเงิน',
      en: 'Data integration gateway between Deposit Protection Agency and financial institutions'
    },
    body: {
      th: 'สถาบันคุ้มครองเงินฝาก (สคฝ.) จัดการประชุมชี้แจงการใช้งานระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ระหว่างสถาบันคุ้มครองเงินฝากและสถาบันการเงิน (EFMS) ให้กับเจ้าหน้าที่...',
      en: 'The Deposit Protection Agency (DPA) organized a technical briefing session for bank executives and IT officers on deploying the Electronic Filing Management System (EFMS).'
    },
    fullContent: {
      th: 'ทีมวิศวกรผู้พัฒนาของไอเจนโก้ ได้เข้าร่วมการประชุมชี้แจงและถ่ายทอดการใช้งานระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ (Electronic Filing Management System: EFMS) ร่วมกับสถาบันคุ้มครองเงินฝาก (สคฝ.) และผู้แทนจากสถาบันการเงิน เพื่อสร้างมาตรฐานความปลอดภัยในการรับส่งข้อมูลทางการเงินที่มีความสำคัญสูง พร้อมระบบตรวจสอบความถูกต้องอัตโนมัติแบบเรียลไทม์',
      en: 'IGENCO software architects participated in the orientation and technical handover of the Electronic Filing Management System (EFMS) alongside the Deposit Protection Agency and delegates from commercial banks, securing financial-grade electronic data interchanges with real-time validation.'
    },
    image: '/images/news/smartflow.png',
    link: 'https://igenco.co.th/index.php/th/content'
  }
])

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedArticle = ref<Article | null>(null)

const categoryCounts = computed(() => {
  return {
    all: articles.value.length,
    'Enterprise Software': 7,
    'Service Development': 2,
    'E-Commerce': 3
  }
})

const filteredArticles = computed(() => {
  return articles.value.filter(item => {
    const matchCategory = selectedCategory.value === 'all' || item.category === selectedCategory.value
    const curTitle = item.title[locale.value] || item.title.th
    const curSubtitle = item.subtitle[locale.value] || item.subtitle.th
    const curBody = item.body[locale.value] || item.body.th
    const matchSearch = !searchQuery.value.trim() || 
      curTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      curSubtitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      curBody.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchSearch
  })
})

const openArticle = (article: Article) => {
  selectedArticle.value = article
}

const closeArticle = () => {
  selectedArticle.value = null
}
</script>

<template>
  <section id="news" class="relative z-10 py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAF9] border-t border-forestBlack/[0.06] scroll-mt-20">
    
    <!-- Background Tech Grid -->
    <div class="absolute inset-0 bg-grid-dots pointer-events-none opacity-40"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      
      <!-- Section Header Matching Screenshot -->
      <div class="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <!-- Eyebrow Pill -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#B5EAD3] shadow-xs mb-4">
          <span class="w-2 h-2 rounded-full bg-[#00C978] animate-pulse"></span>
          <span class="text-xs font-semibold tracking-wider uppercase text-[#00875A]">
            NEWS, EVENTS & ENTERPRISE UPDATES
          </span>
        </div>

        <!-- Section Title (Two-tone / Bold Dark Green) -->
        <h2 class="text-3xl sm:text-5xl font-bold text-forestBlack tracking-tight mb-4">
          <template v-if="locale === 'th'">
            ข่าวสารและ<span class="text-[#00A86B]">กิจกรรมองค์กร</span>
          </template>
          <template v-else>
            News & <span class="text-[#00A86B]">Corporate Updates</span>
          </template>
        </h2>

        <!-- Section Subtitle -->
        <p class="text-mutedSlate text-sm sm:text-base leading-relaxed px-2">
          {{ locale === 'th'
            ? 'ติดตามความเคลื่อนไหว การรับรองมาตรฐานสากล ISO/IEC 29110 การอบรมผู้ใช้งานระบบ และกิจกรรมเพื่อสังคมของบริษัท ไอเจนโก้ จำกัด'
            : 'Keep up with our latest milestones, ISO/IEC 29110 international certifications, system training workshops, and corporate activities at IGENCO.' }}
        </p>
      </div>

      <!-- Main Content Grid: 2-Col News List + Right Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: News Articles Grid (8 cols on lg) -->
        <div class="lg:col-span-8">
          <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <article
              v-for="item in filteredArticles"
              :key="item.id"
              class="bg-white rounded-3xl border border-forestBlack/[0.08] shadow-[0_10px_30px_rgba(9,20,14,0.04)] hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <!-- Card Image with Overlays -->
              <div class="relative h-52 sm:h-56 overflow-hidden bg-forestBlack/5">
                <img
                  :src="item.image"
                  :alt="item.title[locale] || item.title.th"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                <!-- Tag Badge Top-Left -->
                <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-forestBlack shadow-sm backdrop-blur-xs">
                  {{ item.tag }}
                </span>

                <!-- Gallery Circle Icon Top-Right -->
                <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#00C978] text-white flex items-center justify-center shadow-md">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>

              <!-- Card Body Content -->
              <div class="p-6 flex-1 flex flex-col">
                <!-- Meta: Read Time + Date -->
                <div class="flex items-center gap-1.5 text-xs text-mutedSlate/80 font-mono mb-2.5">
                  <svg class="w-3.5 h-3.5 text-[#00C978]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke-width="2"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/>
                  </svg>
                  <span>{{ locale === 'th' ? 'เวลาอ่าน:' : 'Read Time:' }} {{ item.readTime }}</span>
                  <span class="mx-1">•</span>
                  <span>{{ item.date[locale] || item.date.th }}</span>
                </div>

                <!-- Headline with blue hyperlink style matching live site and screenshot -->
                <h3
                  class="text-base sm:text-lg font-bold leading-snug mb-2"
                >
                  <a
                    v-if="item.link"
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[#0052cc] hover:text-[#00875A] hover:underline transition-colors inline-flex items-center gap-1"
                    :title="'igenco.co.th: ' + (item.title[locale] || item.title.th)"
                  >
                    <span>{{ item.title[locale] || item.title.th }}</span>
                    <svg class="w-3.5 h-3.5 opacity-60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                  <span
                    v-else
                    @click="openArticle(item)"
                    class="text-forestBlack hover:text-[#00875A] transition-colors cursor-pointer"
                  >
                    {{ item.title[locale] || item.title.th }}
                  </span>
                </h3>

                <!-- Subtitle -->
                <h4 class="text-xs font-semibold text-mutedSlate mb-2.5 leading-normal">
                  {{ item.subtitle[locale] || item.subtitle.th }}
                </h4>

                <!-- Excerpt Body -->
                <p class="text-xs text-mutedSlate/85 leading-relaxed line-clamp-3 mb-6">
                  {{ item.body[locale] || item.body.th }}
                </p>

                <!-- Action Button at Bottom -->
                <div class="mt-auto pt-2">
                  <button
                    type="button"
                    @click="openArticle(item)"
                    class="px-5 py-2 rounded-full text-xs font-semibold bg-forestBlack hover:bg-[#00C978] text-white hover:text-forestBlack transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{{ locale === 'th' ? 'อ่านเพิ่มเติม' : 'Read More' }}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </article>

          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-3xl p-12 text-center border border-forestBlack/10">
            <div class="text-3xl mb-3">🔍</div>
            <h3 class="font-bold text-forestBlack text-base mb-1">{{ locale === 'th' ? 'ไม่พบข่าวสารที่ค้นหา' : 'No articles found' }}</h3>
            <p class="text-xs text-mutedSlate mb-4">{{ locale === 'th' ? 'ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะครับ' : 'Try searching with different keywords or clear your filter.' }}</p>
            <button
              @click="searchQuery = ''; selectedCategory = 'all'"
              class="px-4 py-2 rounded-full text-xs font-semibold bg-forestBlack text-white hover:bg-emeraldCore transition-all cursor-pointer"
            >
              {{ locale === 'th' ? 'ดูข่าวสารทั้งหมด' : 'View All News' }}
            </button>
          </div>
        </div>

        <!-- Right: Sidebar Widgets (4 cols on lg) -->
        <aside class="lg:col-span-4 space-y-6">
          
          <!-- Widget 1: ค้นหาข่าวสารและบทความ (Search) -->
          <div class="bg-white rounded-3xl p-6 border border-forestBlack/[0.08] shadow-[0_6px_20px_rgba(9,20,14,0.03)]">
            <h3 class="font-bold text-sm text-forestBlack flex items-center gap-2 mb-3.5">
              <svg class="w-4 h-4 text-[#00C978]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span>{{ locale === 'th' ? 'ค้นหาข่าวสารและบทความ' : 'Search News & Articles' }}</span>
            </h3>

            <div class="relative flex items-center">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="locale === 'th' ? 'พิมพ์คำค้นหา เช่น ISO, I-SERFF, EFMS' : 'Search keywords e.g. ISO, I-SERFF, EFMS'"
                class="w-full bg-[#F8FAF9] text-xs text-forestBlack placeholder-mutedSlate pl-3.5 pr-20 py-2.5 rounded-full border border-forestBlack/10 focus:outline-none focus:border-[#00C978]"
              />
              <button
                type="button"
                class="absolute right-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-forestBlack text-white hover:bg-[#00C978] hover:text-forestBlack transition-colors cursor-pointer"
              >
                {{ locale === 'th' ? 'ค้นหา' : 'Search' }}
              </button>
            </div>
          </div>

          <!-- Widget 2: หมวดหมู่ (Categories) -->
          <div class="bg-white rounded-3xl p-6 border border-forestBlack/[0.08] shadow-[0_6px_20px_rgba(9,20,14,0.03)]">
            <h3 class="font-bold text-sm text-forestBlack flex items-center gap-2 mb-4">
              <svg class="w-4 h-4 text-[#00C978]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
              </svg>
              <span>{{ locale === 'th' ? 'หมวดหมู่ (Categories)' : 'Categories' }}</span>
            </h3>

            <div class="space-y-1 text-xs">
              <!-- ข่าวสารทั้งหมด -->
              <button
                type="button"
                @click="selectedCategory = 'all'"
                class="w-full text-left px-3.5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer"
                :class="selectedCategory === 'all'
                  ? 'bg-[#E8F8F2] text-[#00875A] font-bold border border-[#B5EAD3]'
                  : 'hover:bg-forestBlack/5 text-forestBlack/80'"
              >
                <span>{{ locale === 'th' ? 'ข่าวสารทั้งหมด' : 'All News' }}</span>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold"
                  :class="selectedCategory === 'all' ? 'bg-[#00C978] text-white' : 'bg-forestBlack/5 text-mutedSlate'">
                  {{ categoryCounts.all }}
                </span>
              </button>

              <!-- Enterprise Software -->
              <button
                type="button"
                @click="selectedCategory = 'Enterprise Software'"
                class="w-full text-left px-3.5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer"
                :class="selectedCategory === 'Enterprise Software'
                  ? 'bg-[#E8F8F2] text-[#00875A] font-bold border border-[#B5EAD3]'
                  : 'hover:bg-forestBlack/5 text-forestBlack/80'"
              >
                <span>Enterprise Software</span>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold"
                  :class="selectedCategory === 'Enterprise Software' ? 'bg-[#00C978] text-white' : 'bg-forestBlack/5 text-mutedSlate'">
                  {{ categoryCounts['Enterprise Software'] }}
                </span>
              </button>

              <!-- Service Development -->
              <button
                type="button"
                @click="selectedCategory = 'Service Development'"
                class="w-full text-left px-3.5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer"
                :class="selectedCategory === 'Service Development'
                  ? 'bg-[#E8F8F2] text-[#00875A] font-bold border border-[#B5EAD3]'
                  : 'hover:bg-forestBlack/5 text-forestBlack/80'"
              >
                <span>Service Development</span>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold"
                  :class="selectedCategory === 'Service Development' ? 'bg-[#00C978] text-white' : 'bg-forestBlack/5 text-mutedSlate'">
                  {{ categoryCounts['Service Development'] }}
                </span>
              </button>

              <!-- E-Commerce -->
              <button
                type="button"
                @click="selectedCategory = 'E-Commerce'"
                class="w-full text-left px-3.5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer"
                :class="selectedCategory === 'E-Commerce'
                  ? 'bg-[#E8F8F2] text-[#00875A] font-bold border border-[#B5EAD3]'
                  : 'hover:bg-forestBlack/5 text-forestBlack/80'"
              >
                <span>E-Commerce</span>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold"
                  :class="selectedCategory === 'E-Commerce' ? 'bg-[#00C978] text-white' : 'bg-forestBlack/5 text-mutedSlate'">
                  {{ categoryCounts['E-Commerce'] }}
                </span>
              </button>
            </div>
          </div>

          <!-- Widget 3: ข่าวสารล่าสุด (Recent Posts) & Featured Solution Banner -->
          <div class="bg-white rounded-3xl p-6 border border-forestBlack/[0.08] shadow-[0_6px_20px_rgba(9,20,14,0.03)] space-y-4">
            <h3 class="font-bold text-sm text-forestBlack flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-[#00C978]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/>
              </svg>
              <span>{{ locale === 'th' ? 'ข่าวสารล่าสุด (Recent Posts)' : 'Recent Posts' }}</span>
            </h3>

            <!-- Recent Item 1 -->
            <a
              :href="articles[0].link"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-2 rounded-2xl hover:bg-forestBlack/5 transition-colors cursor-pointer group"
              title="เปิดอ่านบทความบนเว็บไซต์"
            >
              <img
                :src="articles[0].image"
                class="w-14 h-14 rounded-xl object-cover shrink-0 border border-forestBlack/10"
                alt="thumb"
              />
              <div>
                <h4 class="font-bold text-xs text-[#0052cc] group-hover:text-[#00875A] group-hover:underline leading-snug transition-colors line-clamp-2">
                  {{ articles[0].title[locale] || articles[0].title.th }}
                </h4>
                <p class="text-[10px] text-mutedSlate mt-1 font-mono">
                  {{ articles[0].date[locale] || articles[0].date.th }} • 1 min read
                </p>
              </div>
            </a>

            <!-- Featured Solution Banner (Matches Screenshot with iSmartFlow logo) -->
            <div class="bg-[#E8F8F2] border border-[#B5EAD3] rounded-2xl p-4 my-2 flex items-center justify-between gap-3 shadow-xs">
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="'/images/news/smartflow.png'"
                  alt="iSmartFlow"
                  class="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-forestBlack/10 shrink-0"
                />
                <div class="min-w-0">
                  <div class="text-[10px] font-mono font-bold tracking-wider text-[#00875A]">
                    FEATURED SOLUTION
                  </div>
                  <div class="font-bold text-xs sm:text-sm text-forestBlack mt-0.5 truncate">
                    iSmartFlow (e-Saraban)
                  </div>
                  <div class="text-[11px] text-mutedSlate mt-0.5 truncate">
                    {{ locale === 'th' ? 'ระบบบริหารสำนักงานอิเล็กทรอนิกส์' : 'Electronic Office Management System' }}
                  </div>
                </div>
              </div>

              <button
                type="button"
                @click="openDemo"
                class="w-8 h-8 rounded-full bg-[#00C978] hover:bg-[#00B36B] text-forestBlack flex items-center justify-center font-bold text-sm shrink-0 transition-transform active:scale-95 cursor-pointer shadow-sm"
                title="ดูรายละเอียดระบบ iSmartFlow"
              >
                →
              </button>
            </div>

            <!-- Recent Item 2 -->
            <a
              :href="articles[1].link"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-2 rounded-2xl hover:bg-forestBlack/5 transition-colors cursor-pointer group"
              title="เปิดอ่านบทความบนเว็บไซต์"
            >
              <img
                :src="articles[1].image"
                class="w-14 h-14 rounded-xl object-cover shrink-0 border border-forestBlack/10"
                alt="thumb"
              />
              <div>
                <h4 class="font-bold text-xs text-[#0052cc] group-hover:text-[#00875A] group-hover:underline leading-snug transition-colors line-clamp-2">
                  {{ articles[1].title[locale] || articles[1].title.th }}
                </h4>
                <p class="text-[10px] text-mutedSlate mt-1 font-mono">
                  {{ articles[1].date[locale] || articles[1].date.th }} • 1 min read
                </p>
              </div>
            </a>

          </div>

        </aside>

      </div>

    </div>

    <!-- Article Reading Modal (When clicking "อ่านเพิ่มเติม →") -->
    <div
      v-if="selectedArticle"
      class="fixed inset-0 z-50 bg-forestBlack/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="closeArticle"
    >
      <div class="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-forestBlack/10 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Close Button -->
        <button
          @click="closeArticle"
          class="absolute top-6 right-6 w-9 h-9 rounded-full bg-forestBlack/5 hover:bg-forestBlack/10 text-mutedSlate hover:text-forestBlack flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <!-- Category & Date Badge -->
        <div class="flex items-center gap-3 mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8F2] text-[#00875A] border border-[#B5EAD3]">
            {{ selectedArticle.tag }}
          </span>
          <span class="text-xs text-mutedSlate font-mono">
            {{ selectedArticle.date[locale] || selectedArticle.date.th }}
          </span>
        </div>

        <h2 class="text-xl sm:text-2xl font-bold text-forestBlack mb-2 leading-snug">
          {{ selectedArticle.title[locale] || selectedArticle.title.th }}
        </h2>
        <h3 class="text-xs sm:text-sm font-semibold text-[#00875A] mb-5 leading-normal">
          {{ selectedArticle.subtitle[locale] || selectedArticle.subtitle.th }}
        </h3>

        <!-- Article Image -->
        <div class="rounded-2xl overflow-hidden mb-6 max-h-72">
          <img
            :src="selectedArticle.image"
            :alt="selectedArticle.title[locale] || selectedArticle.title.th"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Full Content -->
        <div class="text-xs sm:text-sm text-forestBlack/80 leading-relaxed space-y-4 max-h-[40vh] overflow-y-auto pr-2">
          <p>{{ selectedArticle.body[locale] || selectedArticle.body.th }}</p>
          <p v-if="selectedArticle.fullContent">{{ selectedArticle.fullContent[locale] || selectedArticle.fullContent.th }}</p>
        </div>

        <!-- Footer -->
        <div class="mt-6 pt-4 border-t border-forestBlack/10 flex items-center justify-between gap-3 flex-wrap">
          <a
            v-if="selectedArticle.link"
            :href="selectedArticle.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#0052cc] bg-[#f0f4ff] hover:bg-[#e1ebff] border border-[#d0e0ff] transition-colors"
          >
            <span>{{ locale === 'th' ? 'เปิดอ่านบทความต้นฉบับบนเว็บหลัก (igenco.co.th)' : 'Read original article on igenco.co.th' }}</span>
            <span>↗</span>
          </a>
          <span v-else class="text-xs text-mutedSlate">
            บริษัท ไอเจนโก้ จำกัด (IGENCO Co., Ltd.)
          </span>
          <button
            @click="closeArticle"
            class="px-5 py-2 rounded-full text-xs font-semibold bg-forestBlack text-white hover:bg-[#00C978] hover:text-forestBlack transition-colors cursor-pointer ml-auto"
          >
            {{ locale === 'th' ? 'ปิดหน้าต่าง' : 'Close' }}
          </button>
        </div>

      </div>
    </div>

  </section>
</template>
