<script setup lang="ts">
import { useAppI18n } from '~/composables/useI18n'
import { useAppModal } from '~/composables/useModal'

const { locale } = useAppI18n()
const { openDemo, openAbout, openUserGroups } = useAppModal()

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  } else if (id === 'hero' || id === '') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <footer id="footer" class="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-[#09140E] text-white border-t border-emerald-500/25 overflow-hidden">
    
    <!-- Subtle Emerald Ambient Underglow at Top of Dark Footer -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[radial-gradient(ellipse_at_top,rgba(0,201,120,0.18),transparent_70%)] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      
      <!-- Top Grid: Brand Column + Navigation Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/10">
        
        <!-- Column 1: Brand Info & Company Profile (5 cols on lg) -->
        <div class="lg:col-span-5 space-y-5">
          
          <!-- Logo Capsule in White/Emerald for Dark Mode -->
          <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border-2 border-emerald-400/40 bg-white/5 backdrop-blur-xs">
            <div class="w-7 h-7 rounded-full bg-[#051A12] flex items-center justify-center shrink-0 border border-[#00C978]/40 shadow-xs">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 3.5L19.5 7.8V16.2L12 20.5L4.5 16.2V7.8L12 3.5Z" stroke="#00E588" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="2.2" fill="#00E588"/>
              </svg>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="font-black tracking-wider text-sm text-white">IGENCO</span>
              <span class="font-black text-sm text-[#00E588]">AI</span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-md">
            {{ locale === 'th'
              ? 'บริษัท ไอเจนโก้ จำกัด — ผู้เชี่ยวชาญด้านการพัฒนาซอฟต์แวร์ระดับองค์กร ระบบงานสารบรรณอิเล็กทรอนิกส์ ระบบบริหารทรัพยากรบุคคล และโซลูชันตามมาตรฐานสากล ISO/IEC 29110'
              : 'IGENCO Co., Ltd. — Enterprise software solutions, e-Office, HR management, and solutions certified under ISO/IEC 29110 international standard.' }}
          </p>

          <!-- Quick Contact Chips -->
          <div class="space-y-2 text-xs text-neutral-300 font-mono">
            <div class="flex items-center gap-2.5">
              <span class="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00C978] text-[10px]">📞</span>
              <a href="tel:025233559" class="hover:text-[#00C978] transition-colors">0-2523-3559, 063-525-4850</a>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00C978] text-[10px]">✉️</span>
              <a href="mailto:sales@igenco.co.th" class="hover:text-[#00C978] transition-colors">sales@igenco.co.th</a>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00C978] text-[10px]">📍</span>
              <span class="text-neutral-400">เขตดอนเมือง กรุงเทพมหานคร 10210</span>
            </div>
          </div>

        </div>

        <!-- Column 2: เมนูหลัก (2 cols on lg) -->
        <div class="lg:col-span-2 space-y-4">
          <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-[#00C978]">
            {{ locale === 'th' ? 'เมนูหลัก' : 'NAVIGATION' }}
          </h4>
          <ul class="space-y-2.5 text-xs text-neutral-300">
            <li>
              <a href="#hero" @click.prevent="scrollToSection('hero')" class="hover:text-[#00C978] transition-colors flex items-center gap-1.5 cursor-pointer">
                <span>หน้าแรก</span>
              </a>
            </li>
            <li>
              <a href="#news" @click.prevent="scrollToSection('news')" class="hover:text-[#00C978] transition-colors flex items-center gap-1.5 cursor-pointer">
                <span>ข่าวสาร</span>
              </a>
            </li>
            <li>
              <button type="button" @click="openAbout" class="hover:text-[#00C978] transition-colors cursor-pointer text-left">
                <span>เกี่ยวกับเรา</span>
              </button>
            </li>
            <li>
              <a href="#products" @click.prevent="scrollToSection('products')" class="hover:text-[#00C978] transition-colors flex items-center gap-1.5 cursor-pointer">
                <span>ผลิตภัณฑ์</span>
              </a>
            </li>
            <li>
              <a href="#clients" @click.prevent="scrollToSection('clients')" class="text-[#00E588] hover:underline transition-colors cursor-pointer flex items-center gap-1.5 font-medium">
                <span>กลุ่มผู้ใช้ผลิตภัณฑ์</span>
              </a>
            </li>
            <li>
              <a href="#contact" @click.prevent="scrollToSection('contact')" class="hover:text-[#00C978] transition-colors flex items-center gap-1.5 cursor-pointer">
                <span>ติดต่อเรา</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 3: โซลูชันและผลิตภัณฑ์เด่น (3 cols on lg) -->
        <div class="lg:col-span-3 space-y-4">
          <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-[#00C978]">
            {{ locale === 'th' ? 'ผลิตภัณฑ์เด่น' : 'FEATURED PRODUCTS' }}
          </h4>
          <ul class="space-y-2.5 text-xs text-neutral-300">
            <li>
              <a href="#products" @click.prevent="scrollToSection('products')" class="hover:text-[#00C978] transition-colors flex items-center justify-between group cursor-pointer">
                <span>iSmartFlow (e-Saraban)</span>
                <span class="text-[10px] font-mono text-neutral-500 group-hover:text-[#00C978]">e-Office</span>
              </a>
            </li>
            <li>
              <a href="#products" @click.prevent="scrollToSection('products')" class="hover:text-[#00C978] transition-colors flex items-center justify-between group cursor-pointer">
                <span>HR.ai Platform 2026</span>
                <span class="text-[10px] font-mono text-[#38BDF8]">HR Tech</span>
              </a>
            </li>
            <li>
              <a href="#products" @click.prevent="scrollToSection('products')" class="hover:text-[#00C978] transition-colors flex items-center justify-between group cursor-pointer">
                <span>I-SERFF Enterprise</span>
                <span class="text-[10px] font-mono text-neutral-500 group-hover:text-[#00C978]">คปภ.</span>
              </a>
            </li>
            <li>
              <a href="#products" @click.prevent="scrollToSection('products')" class="hover:text-[#00C978] transition-colors flex items-center justify-between group cursor-pointer">
                <span>AI Knowledge & RAG Engine</span>
                <span class="text-[10px] font-mono text-[#00C978]">AI Core</span>
              </a>
            </li>
            <li>
              <a href="#products" @click.prevent="scrollToSection('products')" class="hover:text-[#00C978] transition-colors flex items-center justify-between group cursor-pointer">
                <span>iGenQ (Smart Queuing)</span>
                <span class="text-[10px] font-mono text-neutral-500 group-hover:text-[#00C978]">Queuing</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 4: มาตรฐานและการรับรอง (2 cols on lg) -->
        <div class="lg:col-span-2 space-y-4">
          <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-[#00C978]">
            {{ locale === 'th' ? 'มาตรฐานสากล' : 'COMPLIANCE' }}
          </h4>
          <div class="space-y-3">
            <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div class="text-[11px] font-bold text-white mb-0.5">ISO/IEC 29110</div>
              <div class="text-[10px] text-neutral-400">Software Engineering Certified</div>
            </div>
            <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div class="text-[11px] font-bold text-white mb-0.5">PDPA Thailand</div>
              <div class="text-[10px] text-neutral-400">100% Data Sovereignty</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Bar: Copyright & Verified Badges -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        
        <div>
          © 2026 IGENCO Co., Ltd. {{ locale === 'th' ? 'สงวนลิขสิทธิ์ทั้งหมด' : 'All rights reserved.' }}
        </div>

        <!-- Badges & Legal links -->
        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
          <button type="button" @click="openAbout" class="hover:text-white transition-colors cursor-pointer">
            {{ locale === 'th' ? 'นโยบายความเป็นส่วนตัว (PDPA)' : 'Privacy Policy' }}
          </button>
          <span class="text-neutral-600">•</span>
          <button type="button" @click="openAbout" class="hover:text-white transition-colors cursor-pointer">
            {{ locale === 'th' ? 'ข้อกำหนดการให้บริการ' : 'Terms of Service' }}
          </button>
          <span class="text-neutral-600">•</span>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00C978] text-[11px] font-medium font-mono">
            <span class="w-1.5 h-1.5 rounded-full bg-[#00C978] animate-pulse"></span>
            <span>ISO 29110 Certified</span>
          </div>
        </div>

      </div>

    </div>
  </footer>
</template>
