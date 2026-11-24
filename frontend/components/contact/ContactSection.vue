<script setup lang="ts">
import { ref } from 'vue'
import { useAppI18n } from '~/composables/useI18n'

const { locale } = useAppI18n()

// สถานะการคัดลอก (Copy Feedback)
const copiedField = ref<string | null>(null)

const copyToClipboard = async (text: string, fieldName: string) => {
  try {
    if (navigator && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
    copiedField.value = fieldName
    setTimeout(() => {
      copiedField.value = null
    }, 2500)
  } catch (err) {
    // Fallback
    copiedField.value = fieldName
    setTimeout(() => {
      copiedField.value = null
    }, 2500)
  }
}

// แบบฟอร์มติดต่อ (Inquiry Form State)
const form = ref({
  contactName: '',
  organization: '',
  phone: '',
  email: '',
  subject: 'นัดสาธิตการใช้งานระบบ (Request Demo)',
  interestedProduct: 'iSmartFlow — ระบบสำนักงานอิเล็กทรอนิกส์ (e-Saraban)',
  details: ''
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const handleSubmitInquiry = async () => {
  isSubmitting.value = true
  // จำลองการส่งข้อมูลแบบฟอร์ม
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true
  }, 600)
}

const resetForm = () => {
  isSubmitted.value = false
  form.value = {
    contactName: '',
    organization: '',
    phone: '',
    email: '',
    subject: 'นัดสาธิตการใช้งานระบบ (Request Demo)',
    interestedProduct: 'iSmartFlow — ระบบสำนักงานอิเล็กทรอนิกส์ (e-Saraban)',
    details: ''
  }
}
</script>

<template>
  <section id="contact" class="relative z-10 pt-20 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 bg-[#F8FAF9] border-t border-forestBlack/[0.06] scroll-mt-20">
    
    <!-- Background Tech Grid Lines -->
    <div class="absolute inset-0 bg-grid-dots pointer-events-none opacity-40"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      
      <!-- ==================================================================== -->
      <!-- TOP BANNER: ติดต่อเราเพื่อปรึกษาและนัดสาธิตระบบ (Matches Image 1)       -->
      <!-- ==================================================================== -->
      <div class="bg-white rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#B5EAD3] shadow-[0_10px_35px_rgba(9,20,14,0.04)] mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Left Column: Title & Description -->
          <div class="lg:col-span-6">
            <!-- Eyebrow Pill Badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F8F2] border border-[#B5EAD3] mb-4">
              <span class="w-2 h-2 rounded-full bg-[#00C978] animate-pulse"></span>
              <span class="text-xs font-semibold tracking-wider uppercase text-[#00875A]">
                CONTACT US • ENTERPRISE SOLUTIONS
              </span>
            </div>

            <!-- Two-Tone Headline -->
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] mb-5">
              <span class="text-forestBlack block">ติดต่อเราเพื่อปรึกษาและนัด</span>
              <span class="text-[#00A86B] block">สาธิตระบบ</span>
            </h2>

            <!-- Description -->
            <p class="text-xs sm:text-sm text-mutedSlate leading-relaxed">
              ทีมที่ปรึกษาและวิศวกรซอฟต์แวร์ของ <strong>บริษัท ไอเจนโก้ จำกัด (IGENCO)</strong> พร้อมให้คำแนะนำการวางระบบสารสนเทศระดับองค์กร นัดสาธิตการใช้งานผลิตภัณฑ์ (Demo) และจัดทำใบเสนอราคาที่ตอบโจทย์หน่วยงานของคุณโดยเฉพาะ
            </p>
          </div>

          <!-- Right Column: 2x2 Feature Cards Grid -->
          <div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Card 1: นัดสาธิตระบบ (Demo) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-forestBlack/10 hover:border-[#00C978]/40 transition-all shadow-xs flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-[#E8F8F2] text-[#00875A] flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-xs sm:text-sm text-forestBlack mb-1">
                  นัดสาธิตระบบ (Demo)
                </h4>
                <p class="text-[11px] text-mutedSlate leading-relaxed">
                  ชมการทำงานจริงของ iSmartFlow, HR.ai, I-SERFF และ iGenQ
                </p>
              </div>
            </div>

            <!-- Card 2: ขอใบเสนอราคา (TOR / Quote) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-forestBlack/10 hover:border-[#00C978]/40 transition-all shadow-xs flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-[#E8F8F2] text-[#00875A] flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-xs sm:text-sm text-forestBlack mb-1">
                  ขอใบเสนอราคา (TOR / Quote)
                </h4>
                <p class="text-[11px] text-mutedSlate leading-relaxed">
                  ประเมินงบประมาณและขอบเขตงาน สำหรับหน่วยงานภาครัฐและเอกชน
                </p>
              </div>
            </div>

            <!-- Card 3: ฝ่ายบริการลูกค้า & MA -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-forestBlack/10 hover:border-[#00C978]/40 transition-all shadow-xs flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-[#E8F8F2] text-[#00875A] flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-xs sm:text-sm text-forestBlack mb-1">
                  ฝ่ายบริการลูกค้า & MA
                </h4>
                <p class="text-[11px] text-mutedSlate leading-relaxed">
                  ดูแลบำรุงรักษาระบบและให้คำปรึกษาทางเทคนิคอย่างต่อเนื่อง
                </p>
              </div>
            </div>

            <!-- Card 4: เวลาทำการสำนักงาน -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-forestBlack/10 hover:border-[#00C978]/40 transition-all shadow-xs flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-[#E8F8F2] text-[#00875A] flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-xs sm:text-sm text-forestBlack mb-1">
                  เวลาทำการสำนักงาน
                </h4>
                <p class="text-[11px] text-mutedSlate leading-relaxed">
                  วันจันทร์ – วันศุกร์ เวลา 08:30 – 17:30 น.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- BOTTOM: DIRECT CHANNELS + SEND AN INQUIRY FORM (Matches Image 2)      -->
      <!-- ==================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Direct Channels & Headquarters (5 cols on lg) -->
        <div class="lg:col-span-5 space-y-6">
          
          <!-- Card 1: ช่องทางติดต่อบริษัทโดยตรง (Direct Channels) -->
          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-forestBlack/[0.08] shadow-[0_6px_25px_rgba(9,20,14,0.03)]">
            <!-- Eyebrow -->
            <div class="text-[11px] font-mono font-bold tracking-wider uppercase text-[#00875A] mb-1">
              DIRECT CHANNELS
            </div>
            <!-- Title -->
            <h3 class="text-lg font-bold text-forestBlack mb-5">
              ช่องทางติดต่อบริษัทโดยตรง
            </h3>

            <!-- Phone Section -->
            <div class="mb-5 pb-5 border-b border-forestBlack/5">
              <div class="flex items-center gap-2 text-xs font-semibold text-forestBlack mb-3">
                <svg class="w-4 h-4 text-[#00C978]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>โทรศัพท์ติดต่อฝ่ายขายและบริการ</span>
              </div>
              <!-- Phone Pills -->
              <div class="flex flex-wrap gap-2">
                <a
                  href="tel:025233559"
                  class="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#F8FAF9] hover:bg-[#E8F8F2] hover:text-[#00875A] border border-forestBlack/10 transition-colors"
                  title="โทร 0-2523-3559 (ชั้น 2)"
                >
                  0-2523-3559 <span class="text-[10px] text-mutedSlate font-sans font-normal">(ชั้น 2)</span>
                </a>
                <a
                  href="tel:025233560"
                  class="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#F8FAF9] hover:bg-[#E8F8F2] hover:text-[#00875A] border border-forestBlack/10 transition-colors"
                  title="โทร 0-2523-3560 (ชั้น 3)"
                >
                  0-2523-3560 <span class="text-[10px] text-mutedSlate font-sans font-normal">(ชั้น 3)</span>
                </a>
                <a
                  href="tel:0635254850"
                  class="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#F8FAF9] hover:bg-[#E8F8F2] hover:text-[#00875A] border border-forestBlack/10 transition-colors"
                  title="โทร 063-525-4850"
                >
                  063-525-4850
                </a>
              </div>
            </div>

            <!-- Email Section -->
            <div>
              <div class="flex items-center gap-2 text-xs font-semibold text-forestBlack mb-2">
                <svg class="w-4 h-4 text-[#00C978]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>อีเมลติดต่อฝ่ายขาย (Sales & Support)</span>
              </div>
              <div class="flex items-center justify-between gap-3 bg-[#F8FAF9] p-3 rounded-2xl border border-forestBlack/5">
                <span class="font-mono text-xs sm:text-sm font-bold text-[#00875A]">
                  sales@igenco.co.th
                </span>
                <button
                  type="button"
                  @click="copyToClipboard('sales@igenco.co.th', 'email')"
                  class="px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-forestBlack/5 text-forestBlack border border-forestBlack/15 transition-all cursor-pointer active:scale-95"
                >
                  <span v-if="copiedField === 'email'" class="text-[#00875A]">✓ คัดลอกแล้ว</span>
                  <span v-else>คัดลอกอีเมล</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Card 2: สำนักงานใหญ่ (HEADQUARTERS) -->
          <div class="bg-white rounded-3xl p-6 sm:p-7 border border-forestBlack/[0.08] shadow-[0_6px_25px_rgba(9,20,14,0.03)]">
            <div class="flex items-start gap-3.5 mb-3">
              <div class="w-9 h-9 rounded-xl bg-[#00875A] text-white flex items-center justify-center shrink-0 shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <div class="text-[11px] font-mono font-bold tracking-wider uppercase text-[#00875A]">
                  HEADQUARTERS
                </div>
                <h3 class="text-sm sm:text-base font-bold text-forestBlack leading-snug">
                  บริษัท ไอเจนโก้ จำกัด (IGENCO.Co.,Ltd)
                </h3>
              </div>
            </div>

            <!-- Address Text -->
            <p class="text-xs text-mutedSlate leading-relaxed mb-3">
              89/35 อาคารจูเคี่ยวเล้ง ชั้น 3 ถนนวิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กรุงเทพมหานคร 10210
            </p>
            <div class="text-[11px] text-mutedSlate/80 font-mono mb-5">
              เลขประจำตัวผู้เสียภาษี : 0115553003741
            </div>

            <!-- Map & Copy Buttons -->
            <div class="flex flex-wrap items-center gap-2.5">
              <!-- Google Maps Link -->
              <a
                href="https://www.google.com/maps/search/?api=1&query=89/35+อาคารจูเคี่ยวเล้ง+ถนนวิภาวดีรังสิต+แขวงสนามบิน+เขตดอนเมือง+กรุงเทพมหานคร+10210"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 rounded-full text-xs font-semibold bg-[#00875A] hover:bg-[#00704A] text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span>🗺️ เปิดแผนที่ Google Maps</span>
                <span>↗</span>
              </a>

              <!-- Copy Address Button -->
              <button
                type="button"
                @click="copyToClipboard('89/35 อาคารจูเคี่ยวเล้ง ชั้น 3 ถนนวิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กรุงเทพมหานคร 10210', 'address')"
                class="px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-forestBlack/5 text-forestBlack border border-forestBlack/15 transition-all cursor-pointer active:scale-95"
              >
                <span v-if="copiedField === 'address'" class="text-[#00875A]">✓ คัดลอกแล้ว</span>
                <span v-else>คัดลอกที่อยู่</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Right Column: แบบฟอร์มติดต่อเรา / ขอคำปรึกษา (7 cols on lg) -->
        <div class="lg:col-span-7">
          <div class="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-forestBlack/[0.08] shadow-[0_6px_25px_rgba(9,20,14,0.03)]">
            
            <!-- Eyebrow -->
            <div class="text-[11px] font-mono font-bold tracking-wider uppercase text-[#00875A] mb-1">
              SEND AN INQUIRY
            </div>
            <!-- Title -->
            <h3 class="text-xl sm:text-2xl font-bold text-forestBlack mb-2">
              แบบฟอร์มติดต่อเรา / ขอคำปรึกษา
            </h3>
            <!-- Subtitle -->
            <p class="text-xs text-mutedSlate mb-6 leading-relaxed">
              กรอกรายละเอียดความต้องการของหน่วยงานท่าน เพื่อให้ทีมผู้เชี่ยวชาญติดต่อกลับภายใน 1 วันทำการ
            </p>

            <!-- Form -->
            <form v-if="!isSubmitted" @submit.prevent="handleSubmitInquiry" class="space-y-4">
              
              <!-- Row 1: Name & Organization -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-forestBlack mb-1.5">
                    ชื่อ-นามสกุล ผู้ติดต่อ <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.contactName"
                    required
                    type="text"
                    placeholder="ระบุชื่อ-นามสกุล"
                    class="w-full bg-[#F8FAF9] text-xs sm:text-sm text-forestBlack placeholder-mutedSlate px-3.5 py-2.5 rounded-xl border border-forestBlack/10 focus:outline-none focus:border-[#00C978]"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-forestBlack mb-1.5">
                    ชื่อหน่วยงาน / บริษัท <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.organization"
                    required
                    type="text"
                    placeholder="ระบุชื่อหน่วยงานหรือบริษัท"
                    class="w-full bg-[#F8FAF9] text-xs sm:text-sm text-forestBlack placeholder-mutedSlate px-3.5 py-2.5 rounded-xl border border-forestBlack/10 focus:outline-none focus:border-[#00C978]"
                  />
                </div>
              </div>

              <!-- Row 2: Phone & Email -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-forestBlack mb-1.5">
                    เบอร์โทรศัพท์ติดต่อ <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.phone"
                    required
                    type="tel"
                    placeholder="02-XXX-XXXX / 08X-XXX-XXXX"
                    class="w-full bg-[#F8FAF9] text-xs sm:text-sm text-forestBlack placeholder-mutedSlate px-3.5 py-2.5 rounded-xl border border-forestBlack/10 focus:outline-none focus:border-[#00C978]"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-forestBlack mb-1.5">
                    อีเมลติดต่อ <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    required
                    type="email"
                    placeholder="name@organization.co.th"
                    class="w-full bg-[#F8FAF9] text-xs sm:text-sm text-forestBlack placeholder-mutedSlate px-3.5 py-2.5 rounded-xl border border-forestBlack/10 focus:outline-none focus:border-[#00C978]"
                  />
                </div>
              </div>

              <!-- Row 3: Subject & Interested Product -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-forestBlack mb-1.5">
                    เรื่องที่ต้องการติดต่อ <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.subject"
                    class="w-full bg-[#F8FAF9] text-xs sm:text-sm text-forestBlack px-3.5 py-2.5 rounded-xl border border-forestBlack/10 focus:outline-none focus:border-[#00C978]"
                  >
                    <option value="นัดสาธิตการใช้งานระบบ (Request Demo)">นัดสาธิตการใช้งานระบบ (Request Demo)</option>
                    <option value="ขอใบเสนอราคา (Request Quotation / TOR)">ขอใบเสนอราคา (Request Quotation / TOR)</option>
                    <option value="ปรึกษาการวางสถาปัตยกรรม AI ระดับองค์กร">ปรึกษาการวางสถาปัตยกรรม AI ระดับองค์กร</option>
                    <option value="สอบถามบริการบำรุงรักษา (MA Service)">สอบถามบริการบำรุงรักษา (MA Service)</option>
                    <option value="เรื่องอื่นๆ">เรื่องอื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-forestBlack mb-1.5">
                    ผลิตภัณฑ์ที่สนใจ
                  </label>
                  <select
                    v-model="form.interestedProduct"
                    class="w-full bg-[#F8FAF9] text-xs sm:text-sm text-forestBlack px-3.5 py-2.5 rounded-xl border border-forestBlack/10 focus:outline-none focus:border-[#00C978]"
                  >
                    <option value="iSmartFlow — ระบบสำนักงานอิเล็กทรอนิกส์ (e-Saraban)">iSmartFlow — ระบบสำนักงานอิเล็กทรอนิกส์</option>
                    <option value="HR.ai Platform 2026 — ระบบบริหารงานบุคคลอัจฉริยะ">HR.ai Platform 2026 — บริหารงานบุคคล</option>
                    <option value="I-SERFF Enterprise — ระบบยื่นแบบมาตรฐาน คปภ.">I-SERFF Enterprise — มาตรฐาน คปภ.</option>
                    <option value="EFMS Data Filing Suite — ระบบจัดเก็บข้อมูล สคฝ.">EFMS Data Filing Suite — ข้อมูล สคฝ.</option>
                    <option value="AI Knowledge & RAG Engine">AI Knowledge & RAG Engine</option>
                    <option value="Autonomous Agentic Core">Autonomous Agentic Core</option>
                    <option value="สนใจหลายผลิตภัณฑ์ / ปรึกษาภาพรวม">สนใจหลายผลิตภัณฑ์ / ปรึกษาภาพรวม</option>
                  </select>
                </div>
              </div>

              <!-- Row 4: Details -->
              <div>
                <label class="block text-xs font-semibold text-forestBlack mb-1.5">
                  รายละเอียดเพิ่มเติม <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="form.details"
                  required
                  rows="4"
                  placeholder="ระบุรายละเอียดความต้องการ จำนวนผู้ใช้งาน หรือช่วงเวลาที่สะดวกให้เจ้าหน้าที่ติดต่อกลับ..."
                  class="w-full bg-[#F8FAF9] text-xs sm:text-sm text-forestBlack placeholder-mutedSlate p-3.5 rounded-xl border border-forestBlack/10 focus:outline-none focus:border-[#00C978] resize-none"
                ></textarea>
              </div>

              <!-- Bottom Action & PDPA Note -->
              <div class="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-[11px] text-mutedSlate text-center sm:text-left">
                  ข้อมูลของท่านได้รับการคุ้มครองตามนโยบายความเป็นส่วนตัว (PDPA)
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#00C978] hover:bg-[#00B36B] text-forestBlack active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span v-if="!isSubmitting">ยืนยันการส่งข้อความติดต่อ</span>
                  <span v-else>กำลังส่งข้อมูล...</span>
                  <span class="text-sm">↗</span>
                </button>
              </div>

            </form>

            <!-- Success Feedback State -->
            <div v-else class="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div class="w-14 h-14 rounded-full bg-[#E8F8F2] text-[#00875A] flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
                ✓
              </div>
              <h4 class="text-lg font-bold text-forestBlack">
                ส่งข้อมูลเรียบร้อยแล้ว
              </h4>
              <p class="text-xs text-mutedSlate max-w-md mx-auto leading-relaxed">
                ขอบคุณสำหรับความสนใจในโซลูชันของ IGENCO ทีมวิศวกรผู้เชี่ยวชาญจะติดต่อกลับไปยังหมายเลข <strong>{{ form.phone }}</strong> หรืออีเมล <strong>{{ form.email }}</strong> ภายใน 1 วันทำการครับ
              </p>
              <button
                type="button"
                @click="resetForm"
                class="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold bg-forestBlack text-white hover:bg-emeraldCore transition-colors cursor-pointer"
              >
                ส่งข้อความเพิ่มเติม
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  </section>
</template>
