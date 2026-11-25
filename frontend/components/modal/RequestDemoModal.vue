<script setup lang="ts">
import { ref } from 'vue'
import { useAppModal } from '~/composables/useModal'
import { useAppI18n } from '~/composables/useI18n'
import { useStrapiApi } from '~/composables/useStrapiApi'
import type { DemoLeadForm } from '~/types/cms'

const { isDemoModalOpen, closeDemo } = useAppModal()
const { locale } = useAppI18n()
const { submitDemoLead } = useStrapiApi()

const form = ref<DemoLeadForm>({
  fullName: '',
  workEmail: '',
  companyName: '',
  industry: 'Manufacturing'
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    const res = await submitDemoLead(form.value)
    if (res.success) {
      isSubmitted.value = true
    } else {
      errorMessage.value = res.message
    }
  } catch (err: any) {
    errorMessage.value = err.message || (locale.value === 'th' ? 'เกิดข้อผิดพลาดในการส่งข้อมูล' : 'Failed to submit form')
  } finally {
    isSubmitting.value = false
  }
}

const resetAndClose = () => {
  isSubmitted.value = false
  form.value = {
    fullName: '',
    workEmail: '',
    companyName: '',
    industry: 'Manufacturing'
  }
  closeDemo()
}
</script>

<template>
  <div
    v-if="isDemoModalOpen"
    class="fixed inset-0 z-50 bg-forestBlack/55 backdrop-blur-sm flex items-center justify-center px-4"
    @click.self="resetAndClose"
  >
    <div class="w-full max-w-md bg-white rounded-3xl p-8 border border-forestBlack/10 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button -->
      <button
        @click="resetAndClose"
        class="absolute top-6 right-6 text-mutedSlate hover:text-forestBlack cursor-pointer p-1"
        :title="locale === 'th' ? 'ปิด' : 'Close'"
        aria-label="Close"
      >
        ✕
      </button>

      <div class="text-xs font-mono font-semibold text-emeraldCore mb-2">
        EXECUTIVE CONSULTATION
      </div>
      
      <h3 class="text-2xl font-semibold text-forestBlack mb-2">
        {{ locale === 'th' ? 'นัดหมายสาธิตเทคโนโลยี AI & ปรึกษาผู้เชี่ยวชาญ' : 'Request Enterprise Demo & AI Consultation' }}
      </h3>
      <p class="text-xs text-mutedSlate mb-6">
        {{ locale === 'th'
          ? 'ทีมวิศวกรซอฟต์แวร์ของ IGENCO จะติดต่อกลับภายใน 24 ชั่วโมงพร้อมข้อเสนอที่เหมาะกับองค์กรของคุณ'
          : 'Our enterprise software team will reach out within 24 hours with tailored solutions.' }}
      </p>

      <!-- Form -->
      <form
        v-if="!isSubmitted"
        @submit.prevent="handleSubmit"
        class="space-y-4"
      >
        <div>
          <input
            v-model="form.fullName"
            required
            type="text"
            :placeholder="locale === 'th' ? 'ชื่อ - นามสกุล' : 'Full Name'"
            class="w-full px-4 py-3 rounded-xl bg-[#F7F9F8] border border-forestBlack/10 text-sm text-forestBlack placeholder-mutedSlate focus:outline-none focus:border-emeraldCore"
          />
        </div>

        <div>
          <input
            v-model="form.workEmail"
            required
            type="email"
            :placeholder="locale === 'th' ? 'อีเมลองค์กร (Work Email)' : 'Corporate Work Email'"
            class="w-full px-4 py-3 rounded-xl bg-[#F7F9F8] border border-forestBlack/10 text-sm text-forestBlack placeholder-mutedSlate focus:outline-none focus:border-emeraldCore"
          />
        </div>

        <div>
          <input
            v-model="form.companyName"
            required
            type="text"
            :placeholder="locale === 'th' ? 'ชื่อบริษัท / องค์กร' : 'Company / Organization Name'"
            class="w-full px-4 py-3 rounded-xl bg-[#F7F9F8] border border-forestBlack/10 text-sm text-forestBlack placeholder-mutedSlate focus:outline-none focus:border-emeraldCore"
          />
        </div>

        <div>
          <select
            v-model="form.industry"
            class="w-full px-4 py-3 rounded-xl bg-[#F7F9F8] border border-forestBlack/10 text-sm text-forestBlack focus:outline-none focus:border-emeraldCore"
          >
            <option value="Manufacturing">{{ locale === 'th' ? 'อุตสาหกรรมการผลิต (Manufacturing)' : 'Manufacturing & Industrial' }}</option>
            <option value="Finance">{{ locale === 'th' ? 'การเงินและประกันภัย (Finance & Insurance)' : 'Banking, Finance & Insurance' }}</option>
            <option value="Healthcare">{{ locale === 'th' ? 'การแพทย์และสาธารณสุข (Healthcare)' : 'Healthcare & Medical' }}</option>
            <option value="Retail">{{ locale === 'th' ? 'ค้าปลีกและอีคอมเมิร์ซ (Retail & E-Commerce)' : 'Retail & E-Commerce' }}</option>
            <option value="Energy">{{ locale === 'th' ? 'พลังงานและสาธารณูปโภค (Energy & Infrastructure)' : 'Energy & Infrastructure' }}</option>
            <option value="Other">{{ locale === 'th' ? 'ธุรกิจองค์กรอื่นๆ (Other Enterprise Sector)' : 'Other Enterprise Sector' }}</option>
          </select>
        </div>

        <div v-if="errorMessage" class="text-xs text-red-500 font-medium">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3.5 rounded-xl text-sm font-semibold bg-forestBlack text-white hover:bg-emeraldCore transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <span v-if="!isSubmitting">{{ locale === 'th' ? 'ยืนยันการนัดหมาย' : 'Confirm Request' }}</span>
          <span v-else>{{ locale === 'th' ? 'กำลังส่งข้อมูล...' : 'Submitting...' }}</span>
        </button>
      </form>

      <!-- Success Feedback State -->
      <div v-else class="text-center py-6 space-y-3">
        <div class="w-12 h-12 rounded-full bg-emerald-500/15 text-emeraldCore flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <div class="text-lg font-semibold text-forestBlack">
          {{ locale === 'th' ? 'ได้รับข้อมูลเรียบร้อยแล้ว' : 'Request Submitted Successfully' }}
        </div>
        <p class="text-xs text-mutedSlate leading-relaxed">
          {{ locale === 'th'
            ? `ทีมผู้เชี่ยวชาญของ IGENCO AI จะติดต่อกลับไปยัง ${form.workEmail} โดยเร็วที่สุด`
            : `Our enterprise solutions team will contact you at ${form.workEmail} shortly.` }}
        </p>
        <button
          @click="resetAndClose"
          class="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#F7F9F8] hover:bg-emerald-50 text-forestBlack border border-forestBlack/10 transition-colors cursor-pointer"
        >
          {{ locale === 'th' ? 'ปิดหน้าต่าง' : 'Close' }}
        </button>
      </div>

    </div>
  </div>
</template>
