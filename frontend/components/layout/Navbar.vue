<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppI18n, type SupportedLocale } from '~/composables/useI18n'
import { useAppModal } from '~/composables/useModal'

const { locale, setLocale } = useAppI18n()
const { openDemo, openAbout, openNews, openChat, openUserGroups, isAboutModalOpen } = useAppModal()

const isHidden = ref(false)
const isMobileMenuOpen = ref(false)
const isAboutDropdownOpen = ref(false)
const isProductsDropdownOpen = ref(false)
const isLangDropdownOpen = ref(false)
const isDarkMode = ref(false)

// Active menu indicator state (ScrollSpy + Click)
const activeSection = ref<'hero' | 'news' | 'about' | 'products' | 'clients' | 'contact'>('hero')

let lastScrollY = 0
const sections: Array<'hero' | 'news' | 'products' | 'clients' | 'contact'> = ['hero', 'news', 'products', 'clients', 'contact']

const handleScroll = () => {
  const currentY = window.scrollY
  if (currentY > 120 && currentY > lastScrollY && !isMobileMenuOpen.value) {
    isHidden.value = true
    closeAllDropdowns()
  } else {
    isHidden.value = false
  }
  lastScrollY = currentY

  // If user is at the very top, activate 'hero'
  if (currentY < 150) {
    if (activeSection.value !== 'about') {
      activeSection.value = 'hero'
    }
    return
  }

  // ScrollSpy: detect which section is currently in view
  const scrollMiddle = currentY + 260
  for (let i = sections.length - 1; i >= 0; i--) {
    const secId = sections[i]
    const el = document.getElementById(secId)
    if (el) {
      const top = el.offsetTop
      if (scrollMiddle >= top) {
        if (activeSection.value !== 'about' || !isAboutModalOpen.value) {
          activeSection.value = secId
        }
        break
      }
    }
  }
}

const setDarkMode = (val: boolean) => {
  isDarkMode.value = val
  if (val) {
    document.documentElement.classList.add('dark')
    try { localStorage.setItem('igenco_theme', 'dark') } catch {}
  } else {
    document.documentElement.classList.remove('dark')
    try { localStorage.setItem('igenco_theme', 'light') } catch {}
  }
}

const toggleDarkMode = () => {
  setDarkMode(!isDarkMode.value)
}

const closeAllDropdowns = () => {
  isAboutDropdownOpen.value = false
  isProductsDropdownOpen.value = false
  isLangDropdownOpen.value = false
}

const scrollToSection = (id: 'hero' | 'news' | 'products' | 'clients' | 'contact') => {
  closeAllDropdowns()
  isMobileMenuOpen.value = false
  activeSection.value = id
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  } else if (id === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const selectLanguage = (lang: SupportedLocale) => {
  setLocale(lang)
  isLangDropdownOpen.value = false
}

const handleAboutItem = () => {
  closeAllDropdowns()
  activeSection.value = 'about'
  openAbout()
}

const handleProductItem = (sectionId: 'products') => {
  closeAllDropdowns()
  scrollToSection(sectionId)
}

const handleUserGroupsClick = () => {
  closeAllDropdowns()
  scrollToSection('clients')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  try {
    const saved = localStorage.getItem('igenco_theme')
    if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true)
    }
  } catch {}
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    id="navbar"
    class="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none transition-transform duration-500 ease-out"
    :class="{ '-translate-y-full': isHidden }"
  >
    <nav class="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto relative">
      
      <!-- Left: Brand Capsule Badge (Matches Screenshot) -->
      <a
        href="#"
        @click.prevent="scrollToSection('hero')"
        class="inline-flex items-center gap-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border-2 border-forestBlack dark:border-[#00C978]/60 hover:border-emerald-500 hover:shadow-sm transition-all group focus:outline-none bg-white dark:bg-[#0E2017] shrink-0"
        title="IGENCO AI"
      >
        <!-- Circular dark badge with green hexagon & center dot -->
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#051A12] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
          <svg class="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3.5L19.5 7.8V16.2L12 20.5L4.5 16.2V7.8L12 3.5Z"
              stroke="#00E588"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="12" r="2.2" fill="#00E588" />
          </svg>
        </div>

        <!-- Text: IGENCO (Dark) + AI (Green) -->
        <div class="flex items-center gap-1.5">
          <span class="font-black tracking-wider text-xs sm:text-sm text-forestBlack dark:text-white whitespace-nowrap">
            IGENCO
          </span>
          <span class="font-black text-xs sm:text-sm text-[#00A86B] dark:text-[#00E588] whitespace-nowrap">
            AI
          </span>
        </div>
      </a>

      <!-- Center: Floating Capsule with Reactive Green Highlight Box for Selected Menu -->
      <div class="hidden lg:flex items-center gap-0.5 xl:gap-1 px-2 xl:px-3 py-1 xl:py-1.5 bg-white/95 dark:bg-[#0E2017]/95 rounded-full shadow-[0_4px_25px_rgba(9,20,14,0.06)] border border-forestBlack/[0.08] dark:border-[#00C978]/30 backdrop-blur-md shrink-0 flex-nowrap">
        
        <!-- 1. 🏠 หน้าแรก -->
        <a
          href="#hero"
          @click.prevent="scrollToSection('hero')"
          class="px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full flex items-center gap-1 xl:gap-1.5 text-xs xl:text-[13px] whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer"
          :class="activeSection === 'hero'
            ? 'bg-[#E7F8F0] dark:bg-[#0E2C1E] text-[#00875A] dark:text-[#00E588] border border-[#00C978]/70 dark:border-[#00C978]/50 font-bold shadow-xs'
            : 'text-forestBlack/80 dark:text-neutral-200 hover:text-forestBlack dark:hover:text-white hover:bg-forestBlack/5 dark:hover:bg-white/10 font-medium border border-transparent'"
        >
          <svg
            class="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-colors"
            :class="activeSection === 'hero' ? 'text-[#00875A] dark:text-[#00E588]' : 'text-forestBlack/70 dark:text-neutral-300'"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="whitespace-nowrap">{{ locale === 'th' ? 'หน้าแรก' : 'Home' }}</span>
        </a>

        <!-- 2. 📰 ข่าวสาร -->
        <a
          href="#news"
          @click.prevent="scrollToSection('news')"
          class="px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full flex items-center gap-1 xl:gap-1.5 text-xs xl:text-[13px] whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer"
          :class="activeSection === 'news'
            ? 'bg-[#E7F8F0] dark:bg-[#0E2C1E] text-[#00875A] dark:text-[#00E588] border border-[#00C978]/70 dark:border-[#00C978]/50 font-bold shadow-xs'
            : 'text-forestBlack/80 dark:text-neutral-200 hover:text-forestBlack dark:hover:text-white hover:bg-forestBlack/5 dark:hover:bg-white/10 font-medium border border-transparent'"
        >
          <svg
            class="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-colors"
            :class="activeSection === 'news' ? 'text-[#00875A] dark:text-[#00E588]' : 'text-forestBlack/70 dark:text-neutral-300'"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
          <span class="whitespace-nowrap">{{ locale === 'th' ? 'ข่าวสาร' : 'News' }}</span>
        </a>

        <!-- 3. 🏢 เกี่ยวกับเรา ˅ (Dropdown + Opens Modal) -->
        <div class="relative shrink-0" @mouseenter="isAboutDropdownOpen = true" @mouseleave="isAboutDropdownOpen = false">
          <button
            type="button"
            @click="handleAboutItem"
            class="px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full flex items-center gap-1 xl:gap-1.5 text-xs xl:text-[13px] whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus:outline-none"
            :class="activeSection === 'about'
              ? 'bg-[#E7F8F0] dark:bg-[#0E2C1E] text-[#00875A] dark:text-[#00E588] border border-[#00C978]/70 dark:border-[#00C978]/50 font-bold shadow-xs'
              : 'text-forestBlack/80 dark:text-neutral-200 hover:text-forestBlack dark:hover:text-white hover:bg-forestBlack/5 dark:hover:bg-white/10 font-medium border border-transparent'"
          >
            <svg
              class="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-colors"
              :class="activeSection === 'about' ? 'text-[#00875A] dark:text-[#00E588]' : 'text-forestBlack/70 dark:text-neutral-300'"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span class="whitespace-nowrap">{{ locale === 'th' ? 'เกี่ยวกับเรา' : 'About Us' }}</span>
            <svg class="w-3 h-3 shrink-0 text-forestBlack/60 dark:text-neutral-400 transition-transform duration-200" :class="{ 'rotate-180': isAboutDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- About Dropdown Menu -->
          <div
            v-show="isAboutDropdownOpen"
            class="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#0E2017] rounded-2xl shadow-xl border border-forestBlack/10 dark:border-[#00C978]/30 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <button
              @click="handleAboutItem"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-forestBlack/5 dark:hover:bg-white/10 hover:text-emeraldCore dark:hover:text-[#00E588] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emeraldCore dark:bg-[#00C978]"></span>
              <div>
                <div class="font-semibold text-forestBlack dark:text-white">{{ locale === 'th' ? 'บริษัท ไอเจนโก้ จำกัด' : 'IGENCO Co., Ltd.' }}</div>
                <div class="text-[10px] text-mutedSlate dark:text-neutral-400">{{ locale === 'th' ? 'ประวัติ วิสัยทัศน์ และข้อมูลองค์กร' : 'History, Vision & Company Info' }}</div>
              </div>
            </button>
            <button
              @click="handleAboutItem"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-forestBlack/5 dark:hover:bg-white/10 hover:text-emeraldCore dark:hover:text-[#00E588] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emeraldCore dark:bg-[#00C978]"></span>
              <div>
                <div class="font-semibold text-forestBlack dark:text-white">{{ locale === 'th' ? 'มาตรฐานสากล ISO/IEC 29110' : 'ISO/IEC 29110 Standard' }}</div>
                <div class="text-[10px] text-mutedSlate dark:text-neutral-400">{{ locale === 'th' ? 'กระบวนการวิศวกรรมซอฟต์แวร์' : 'Software Engineering Process' }}</div>
              </div>
            </button>
            <button
              @click="scrollToSection('contact')"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-forestBlack/5 dark:hover:bg-white/10 hover:text-emeraldCore dark:hover:text-[#00E588] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emeraldCore dark:bg-[#00C978]"></span>
              <div>
                <div class="font-semibold text-forestBlack dark:text-white">{{ locale === 'th' ? 'ที่ตั้งและช่องทางติดต่อ' : 'Location & Contacts' }}</div>
                <div class="text-[10px] text-mutedSlate dark:text-neutral-400">{{ locale === 'th' ? 'อาคารจูเคี่ยวเล้ง ถ.วิภาวดีรังสิต' : 'Jukieoleng Bldg, Vibhavadi Rangsit Rd' }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- 4. 📦 ผลิตภัณฑ์ ˅ (Dropdown to Products) -->
        <div class="relative shrink-0" @mouseenter="isProductsDropdownOpen = true" @mouseleave="isProductsDropdownOpen = false">
          <a
            href="#products"
            @click.prevent="scrollToSection('products')"
            class="px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full flex items-center gap-1 xl:gap-1.5 text-xs xl:text-[13px] whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus:outline-none"
            :class="activeSection === 'products'
              ? 'bg-[#E7F8F0] dark:bg-[#0E2C1E] text-[#00875A] dark:text-[#00E588] border border-[#00C978]/70 dark:border-[#00C978]/50 font-bold shadow-xs'
              : 'text-forestBlack/80 dark:text-neutral-200 hover:text-forestBlack dark:hover:text-white hover:bg-forestBlack/5 dark:hover:bg-white/10 font-medium border border-transparent'"
          >
            <svg
              class="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-colors"
              :class="activeSection === 'products' ? 'text-[#00875A] dark:text-[#00E588]' : 'text-forestBlack/70 dark:text-neutral-300'"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span class="whitespace-nowrap">{{ locale === 'th' ? 'ผลิตภัณฑ์' : 'Products' }}</span>
            <svg class="w-3 h-3 shrink-0 text-forestBlack/60 dark:text-neutral-400 transition-transform duration-200" :class="{ 'rotate-180': isProductsDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </a>

          <!-- Products Dropdown Menu -->
          <div
            v-show="isProductsDropdownOpen"
            class="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#0E2017] rounded-2xl shadow-xl border border-forestBlack/10 dark:border-[#00C978]/30 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <button
              @click="handleProductItem('products')"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-forestBlack/5 dark:hover:bg-white/10 hover:text-emeraldCore dark:hover:text-[#00E588] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emeraldCore dark:bg-[#00C978]"></span>
              <div>
                <div class="font-semibold text-forestBlack dark:text-white">iSmartFlow (e-Saraban)</div>
                <div class="text-[10px] text-mutedSlate dark:text-neutral-400">{{ locale === 'th' ? 'ระบบงานสารบรรณอิเล็กทรอนิกส์' : 'Electronic Document & Approval System' }}</div>
              </div>
            </button>
            <button
              @click="handleProductItem('products')"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-forestBlack/5 dark:hover:bg-white/10 hover:text-emeraldCore dark:hover:text-[#00E588] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emeraldCore dark:bg-[#00C978]"></span>
              <div>
                <div class="font-semibold text-forestBlack dark:text-white">HR.ai Platform 2026</div>
                <div class="text-[10px] text-mutedSlate dark:text-neutral-400">{{ locale === 'th' ? 'ระบบบริหารทรัพยากรบุคคลอัจฉริยะ' : 'Smart Human Resource Management' }}</div>
              </div>
            </button>
            <button
              @click="handleProductItem('products')"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-forestBlack/5 dark:hover:bg-white/10 hover:text-emeraldCore dark:hover:text-[#00E588] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emeraldCore dark:bg-[#00C978]"></span>
              <div>
                <div class="font-semibold text-forestBlack dark:text-white">I-SERFF Enterprise</div>
                <div class="text-[10px] text-mutedSlate dark:text-neutral-400">{{ locale === 'th' ? 'ระบบยื่นแบบมาตรฐาน คปภ.' : 'OIC Insurance Filing Standard Solution' }}</div>
              </div>
            </button>
            <button
              @click="handleProductItem('products')"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-forestBlack/5 dark:hover:bg-white/10 hover:text-emeraldCore dark:hover:text-[#00E588] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emeraldCore dark:bg-[#00C978]"></span>
              <div>
                <div class="font-semibold text-forestBlack dark:text-white">iGenQ (Smart Queuing)</div>
                <div class="text-[10px] text-mutedSlate dark:text-neutral-400">{{ locale === 'th' ? 'ระบบจัดคิวอัจฉริยะสำหรับองค์กร' : 'Smart Enterprise Queue Management' }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- 5. 👥 กลุ่มผู้ใช้ผลิตภัณฑ์ (Highlight Green Pill Box when Active) -->
        <a
          href="#clients"
          @click.prevent="handleUserGroupsClick"
          class="px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full flex items-center gap-1 xl:gap-1.5 text-xs xl:text-[13px] whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus:outline-none"
          :class="activeSection === 'clients'
            ? 'bg-[#E7F8F0] dark:bg-[#0E2C1E] text-[#00875A] dark:text-[#00E588] border border-[#00C978]/70 dark:border-[#00C978]/50 font-bold shadow-xs'
            : 'text-forestBlack/80 dark:text-neutral-200 hover:text-forestBlack dark:hover:text-white hover:bg-forestBlack/5 dark:hover:bg-white/10 font-medium border border-transparent'"
          title="ดูกลุ่มผู้ใช้ผลิตภัณฑ์และลูกค้าองค์กร"
        >
          <svg
            class="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-colors"
            :class="activeSection === 'clients' ? 'text-[#00875A] dark:text-[#00E588]' : 'text-forestBlack/70 dark:text-neutral-300'"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="whitespace-nowrap">{{ locale === 'th' ? 'กลุ่มผู้ใช้ผลิตภัณฑ์' : 'User Groups' }}</span>
        </a>

        <!-- 6. ✉️ ติดต่อเรา -->
        <a
          href="#contact"
          @click.prevent="scrollToSection('contact')"
          class="px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full flex items-center gap-1 xl:gap-1.5 text-xs xl:text-[13px] whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer"
          :class="activeSection === 'contact'
            ? 'bg-[#E7F8F0] dark:bg-[#0E2C1E] text-[#00875A] dark:text-[#00E588] border border-[#00C978]/70 dark:border-[#00C978]/50 font-bold shadow-xs'
            : 'text-forestBlack/80 dark:text-neutral-200 hover:text-forestBlack dark:hover:text-white hover:bg-forestBlack/5 dark:hover:bg-white/10 font-medium border border-transparent'"
        >
          <svg
            class="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-colors"
            :class="activeSection === 'contact' ? 'text-[#00875A] dark:text-[#00E588]' : 'text-forestBlack/70 dark:text-neutral-300'"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span class="whitespace-nowrap">{{ locale === 'th' ? 'ติดต่อเรา' : 'Contact Us' }}</span>
        </a>

      </div>

      <!-- Right Action Items: [ 🌐 TH / EN ], [ ◐ ] Theme Squircle & [ สอบถาม / ขอคำปรึกษา ↗ ] -->
      <div class="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
        
        <!-- Language Switcher Capsule (TH / EN) with Modern Globe SVG Icon -->
        <div class="inline-flex items-center p-0.5 rounded-full bg-white/95 dark:bg-[#0E2017]/95 border border-forestBlack/[0.12] dark:border-white/20 shadow-xs backdrop-blur-md shrink-0">
          <!-- Minimal Globe Icon -->
          <div class="pl-2 pr-1 flex items-center justify-center text-forestBlack/70 dark:text-neutral-300" title="เลือกภาษา (Switch Language)">
            <svg class="w-3.5 h-3.5 text-emeraldCore dark:text-[#00E588]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>

          <!-- TH Button -->
          <button
            type="button"
            @click="selectLanguage('th')"
            class="px-2 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none whitespace-nowrap"
            :class="locale === 'th'
              ? 'bg-[#00C978] text-forestBlack shadow-xs scale-105'
              : 'text-forestBlack/70 dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white'"
            title="เปลี่ยนเป็นภาษาไทย (TH)"
          >
            TH
          </button>

          <!-- EN Button -->
          <button
            type="button"
            @click="selectLanguage('en')"
            class="px-2 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none whitespace-nowrap"
            :class="locale === 'en'
              ? 'bg-[#00C978] text-forestBlack shadow-xs scale-105'
              : 'text-forestBlack/70 dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white'"
            title="Switch to English (EN)"
          >
            EN
          </button>
        </div>

        <!-- Theme Mode Button (Squircle with ◐ icon) -->
        <button
          type="button"
          @click="toggleDarkMode"
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white/95 dark:bg-[#0E2017]/95 border border-forestBlack/[0.12] dark:border-white/20 hover:border-forestBlack/30 dark:hover:border-white/40 shadow-xs flex items-center justify-center text-forestBlack dark:text-white transition-all cursor-pointer focus:outline-none shrink-0"
          :title="isDarkMode ? 'เปลี่ยนเป็นโหมดสว่าง (Light Mode)' : 'เปลี่ยนเป็นโหมดมืด (Dark Mode)'"
          aria-label="Toggle Theme"
        >
          <!-- ◐ Minimal Half-Filled Contrast Circle -->
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>
          </svg>
        </button>

        <!-- Vibrant Green CTA Pill Button: [ สอบถาม / ขอคำปรึกษา ↗ ] (Opens AI GENCO Chat Box!) -->
        <button
          type="button"
          @click="openChat"
          class="inline-flex items-center gap-1.5 px-3 sm:px-4 xl:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-bold bg-[#00C978] hover:bg-[#00B36B] text-forestBlack active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,201,120,0.3)] hover:shadow-[0_6px_20px_rgba(0,201,120,0.4)] cursor-pointer whitespace-nowrap shrink-0"
          title="สอบถามข้อมูลผลิตภัณฑ์หรือขอคำปรึกษากับ AI GENCO"
        >
          <span class="whitespace-nowrap">{{ locale === 'th' ? 'สอบถาม / ขอคำปรึกษา' : 'Consult / Inquire' }}</span>
          <span class="text-xs sm:text-sm font-bold">↗</span>
        </button>

        <!-- Mobile Hamburger Toggle -->
        <button
          type="button"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden p-2 rounded-full bg-white dark:bg-[#0E2017] border border-forestBlack/10 dark:border-white/10 text-forestBlack dark:text-white hover:bg-forestBlack/5 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg v-if="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

      </div>

      <!-- Mobile Slide-out Menu (With Green Box Active States) -->
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden absolute top-full left-0 right-0 mt-3 bg-white dark:bg-[#0D1D16] rounded-3xl p-5 shadow-2xl border border-forestBlack/10 dark:border-[#00C978]/30 space-y-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
      >
        <button
          @click="scrollToSection('hero')"
          class="w-full text-left py-2.5 px-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          :class="activeSection === 'hero'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-[#00C978]/40 text-[#00875A] dark:text-[#00E588] font-bold shadow-xs'
            : 'hover:bg-forestBlack/5 dark:hover:bg-white/10 text-forestBlack dark:text-white font-medium'"
        >
          <span>🏠</span>
          <span>{{ locale === 'th' ? 'หน้าแรก' : 'Home' }}</span>
        </button>

        <button
          @click="scrollToSection('news')"
          class="w-full text-left py-2.5 px-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          :class="activeSection === 'news'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-[#00C978]/40 text-[#00875A] dark:text-[#00E588] font-bold shadow-xs'
            : 'hover:bg-forestBlack/5 dark:hover:bg-white/10 text-forestBlack dark:text-white font-medium'"
        >
          <span>📰</span>
          <span>{{ locale === 'th' ? 'ข่าวสาร' : 'News' }}</span>
        </button>

        <button
          @click="handleAboutItem"
          class="w-full text-left py-2.5 px-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          :class="activeSection === 'about'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-[#00C978]/40 text-[#00875A] dark:text-[#00E588] font-bold shadow-xs'
            : 'hover:bg-forestBlack/5 dark:hover:bg-white/10 text-forestBlack dark:text-white font-medium'"
        >
          <span>🏢</span>
          <span>{{ locale === 'th' ? 'เกี่ยวกับเรา' : 'About Us' }}</span>
        </button>

        <button
          @click="scrollToSection('products')"
          class="w-full text-left py-2.5 px-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          :class="activeSection === 'products'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-[#00C978]/40 text-[#00875A] dark:text-[#00E588] font-bold shadow-xs'
            : 'hover:bg-forestBlack/5 dark:hover:bg-white/10 text-forestBlack dark:text-white font-medium'"
        >
          <span>📦</span>
          <span>{{ locale === 'th' ? 'ผลิตภัณฑ์' : 'Products' }}</span>
        </button>

        <button
          @click="handleUserGroupsClick"
          class="w-full text-left py-2.5 px-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          :class="activeSection === 'clients'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-[#00C978]/40 text-[#00875A] dark:text-[#00E588] font-bold shadow-xs'
            : 'hover:bg-forestBlack/5 dark:hover:bg-white/10 text-forestBlack dark:text-white font-medium'"
        >
          <span>👥</span>
          <span>{{ locale === 'th' ? 'กลุ่มผู้ใช้ผลิตภัณฑ์' : 'User Groups' }}</span>
        </button>

        <button
          @click="scrollToSection('contact')"
          class="w-full text-left py-2.5 px-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          :class="activeSection === 'contact'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-[#00C978]/40 text-[#00875A] dark:text-[#00E588] font-bold shadow-xs'
            : 'hover:bg-forestBlack/5 dark:hover:bg-white/10 text-forestBlack dark:text-white font-medium'"
        >
          <span>✉️</span>
          <span>{{ locale === 'th' ? 'ติดต่อเรา' : 'Contact Us' }}</span>
        </button>

        <!-- Mobile Language Selector -->
        <div class="pt-3 border-t border-forestBlack/10 dark:border-white/10 flex items-center justify-between">
          <span class="text-xs text-mutedSlate dark:text-neutral-300 font-medium">ภาษา (Language)</span>
          <div class="inline-flex items-center p-0.5 rounded-full bg-forestBlack/5 dark:bg-white/10 border border-forestBlack/10 dark:border-white/10">
            <button
              type="button"
              @click="selectLanguage('th')"
              class="px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer"
              :class="locale === 'th' ? 'bg-[#00C978] text-forestBlack shadow-xs' : 'text-forestBlack/70 dark:text-neutral-300'"
            >
              🇹🇭 TH
            </button>
            <button
              type="button"
              @click="selectLanguage('en')"
              class="px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer"
              :class="locale === 'en' ? 'bg-[#00C978] text-forestBlack shadow-xs' : 'text-forestBlack/70 dark:text-neutral-300'"
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        <div class="pt-2 border-t border-forestBlack/10 dark:border-white/10 flex items-center justify-between">
          <span class="text-xs text-mutedSlate dark:text-neutral-300 font-medium">โหมดการแสดงผล</span>
          <button
            type="button"
            @click="toggleDarkMode"
            class="w-8 h-8 rounded-xl bg-forestBlack/5 dark:bg-white/10 flex items-center justify-center text-forestBlack dark:text-white"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div class="pt-2">
          <button
            @click="openChat(); isMobileMenuOpen = false"
            class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#00C978] text-forestBlack text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>{{ locale === 'th' ? 'สอบถาม / ขอคำปรึกษา' : 'Consult / Inquire' }}</span>
            <span>↗</span>
          </button>
        </div>
      </div>

    </nav>
  </header>
</template>
