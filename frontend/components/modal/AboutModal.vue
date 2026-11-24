<script setup lang="ts">
import { useAppModal } from '~/composables/useModal'
import { useAppI18n } from '~/composables/useI18n'

const { isAboutModalOpen, closeAbout, openDemo } = useAppModal()
const { locale } = useAppI18n()

const handleConsultClick = () => {
  closeAbout()
  openDemo()
}
</script>

<template>
  <div
    v-if="isAboutModalOpen"
    class="fixed inset-0 z-50 bg-forestBlack/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    @click.self="closeAbout"
  >
    <div class="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-forestBlack/10 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button -->
      <button
        @click="closeAbout"
        class="absolute top-6 right-6 w-9 h-9 rounded-full bg-forestBlack/5 hover:bg-forestBlack/10 text-mutedSlate hover:text-forestBlack flex items-center justify-center cursor-pointer transition-colors"
        aria-label="Close"
      >
        ✕
      </button>

      <!-- Badge & Title -->
      <div class="flex items-center gap-2 mb-3">
        <span class="w-2 h-2 rounded-full bg-emeraldBright animate-ping"></span>
        <span class="text-xs font-mono font-semibold text-emeraldCore uppercase tracking-wider">
          {{ locale === 'th' ? 'เกี่ยวกับเรา' : 'ABOUT IGENCO' }}
        </span>
      </div>

      <h2 class="text-2xl sm:text-3xl font-bold text-forestBlack mb-1">
        {{ locale === 'th' ? 'บริษัท ไอเจนโก้ จำกัด' : 'IGENCO Co., Ltd.' }}
      </h2>
      <p class="text-sm font-medium text-emeraldCore mb-6">
        {{ locale === 'th' ? 'ผู้เชี่ยวชาญด้าน AI และนวัตกรรมดิจิทัลสำหรับองค์กร' : 'Enterprise Artificial Intelligence & Digital Innovation Specialists' }}
      </p>

      <div class="space-y-6 text-sm text-forestBlack/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
        <!-- Overview -->
        <div class="p-4 rounded-2xl bg-[#F7F9F8] border border-forestBlack/5">
          <h3 class="font-semibold text-forestBlack mb-2 flex items-center gap-2">
            <span class="w-1.5 h-4 rounded-full bg-emeraldBright"></span>
            {{ locale === 'th' ? 'วิสัยทัศน์องค์กร (Vision)' : 'Corporate Vision' }}
          </h3>
          <p class="text-xs sm:text-sm text-mutedSlate">
            {{ locale === 'th'
              ? 'เรามุ่งมั่นขับเคลื่อนองค์กรธุรกิจสู่ยุคอัจฉริยะด้วยการออกแบบและวางรากฐานสถาปัตยกรรมปัญญาประดิษฐ์ (Enterprise AI Architecture) ที่มีความแม่นยำสูง ปลอดภัยตามมาตรฐานสากล และสามารถต่อยอดได้อย่างไร้ขีดจำกัด'
              : 'Empowering modern enterprises with resilient, high-precision artificial intelligence architecture and sovereign data governance tailored for real-world enterprise transformation.' }}
          </p>
        </div>

        <!-- Pillars Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl border border-forestBlack/10 hover:border-emerald-500/40 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emeraldCore flex items-center justify-center font-bold mb-2 text-sm">
              01
            </div>
            <h4 class="font-semibold text-forestBlack text-sm mb-1">
              {{ locale === 'th' ? 'สถาปัตยกรรม AI ส่วนตัว' : 'Private AI Architecture' }}
            </h4>
            <p class="text-xs text-mutedSlate">
              {{ locale === 'th'
                ? 'ติดตั้งระบบ AI บน On-Premise หรือ Private Cloud เพื่อความปลอดภัยสูงสุดของข้อมูลองค์กร'
                : 'Sovereign on-premise and hybrid deployments ensuring absolute privacy and data sovereignty.' }}
            </p>
          </div>

          <div class="p-4 rounded-2xl border border-forestBlack/10 hover:border-emerald-500/40 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emeraldCore flex items-center justify-center font-bold mb-2 text-sm">
              02
            </div>
            <h4 class="font-semibold text-forestBlack text-sm mb-1">
              {{ locale === 'th' ? 'ระบบเอเจนต์อัตโนมัติ' : 'Autonomous AI Agents' }}
            </h4>
            <p class="text-xs text-mutedSlate">
              {{ locale === 'th'
                ? 'เพิ่มประสิทธิภาพการทำงานด้วย AI Agents ที่สามารถวิเคราะห์และตัดสินใจร่วมกับมนุษย์'
                : 'Multi-agent orchestration that automates critical business operations and decision pipelines.' }}
            </p>
          </div>

          <div class="p-4 rounded-2xl border border-forestBlack/10 hover:border-emerald-500/40 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emeraldCore flex items-center justify-center font-bold mb-2 text-sm">
              03
            </div>
            <h4 class="font-semibold text-forestBlack text-sm mb-1">
              {{ locale === 'th' ? 'ความปลอดภัยระดับมาตรฐาน' : 'Certified Security' }}
            </h4>
            <p class="text-xs text-mutedSlate">
              {{ locale === 'th'
                ? 'ปฏิบัติตามมาตรฐาน ISO/IEC 27001:2022 และข้อกำหนด PDPA อย่างเคร่งครัด'
                : 'Compliance with ISO/IEC 27001:2022 and stringent data governance standards.' }}
            </p>
          </div>

          <div class="p-4 rounded-2xl border border-forestBlack/10 hover:border-emerald-500/40 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emeraldCore flex items-center justify-center font-bold mb-2 text-sm">
              04
            </div>
            <h4 class="font-semibold text-forestBlack text-sm mb-1">
              {{ locale === 'th' ? 'การสนับสนุนแบบครบวงจร' : 'Full-Lifecycle Support' }}
            </h4>
            <p class="text-xs text-mutedSlate">
              {{ locale === 'th'
                ? 'ตั้งแต่การให้คำปรึกษา ออกแบบ พัฒนา จนถึงการดูแลรักษาระบบตลอด 24 ชั่วโมง'
                : 'End-to-end consulting, architecture blueprints, model fine-tuning, and enterprise SLA.' }}
            </p>
          </div>
        </div>

        <!-- Contact & Info -->
        <div class="pt-3 border-t border-forestBlack/10 text-xs text-mutedSlate space-y-1.5">
          <div><strong class="text-forestBlack">{{ locale === 'th' ? 'สำนักงานใหญ่:' : 'Headquarters:' }}</strong> 89/35 อาคารจูเคี่ยวเล้ง ชั้น 3 ถนนวิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กรุงเทพมหานคร 10210</div>
          <div><strong class="text-forestBlack">{{ locale === 'th' ? 'เบอร์โทรศัพท์:' : 'Phone:' }}</strong> 0-2523-3559 (ชั้น 2), 0-2523-3560 (ชั้น 3), 063-525-4850</div>
          <div><strong class="text-forestBlack">{{ locale === 'th' ? 'อีเมลติดต่อ:' : 'Email:' }}</strong> sales@igenco.co.th</div>
          <div><strong class="text-forestBlack">{{ locale === 'th' ? 'เลขประจำตัวผู้เสียภาษี:' : 'Tax ID:' }}</strong> 0115553003741</div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="mt-6 pt-4 border-t border-forestBlack/10 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          @click="closeAbout"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold bg-[#F7F9F8] hover:bg-forestBlack/5 text-forestBlack border border-forestBlack/10 transition-colors cursor-pointer"
        >
          {{ locale === 'th' ? 'ปิด' : 'Close' }}
        </button>
        <button
          @click="handleConsultClick"
          class="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold bg-emeraldCore hover:bg-emeraldBright text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{{ locale === 'th' ? 'ปรึกษาทีมสถาปนิก AI' : 'Consult Our AI Architects' }}</span>
          <span>→</span>
        </button>
      </div>

    </div>
  </div>
</template>
