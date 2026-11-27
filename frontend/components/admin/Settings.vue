<script setup lang="ts">
const { siteSetting: s, saveSiteSetting } = useAdminApi()
const fields: { key: string; label: string; area?: boolean; full?: boolean }[] = [
  { key: 'company_name_th', label: 'ชื่อบริษัท (ไทย)' },
  { key: 'company_name_en', label: 'ชื่อบริษัท (English)' },
  { key: 'phone', label: 'เบอร์โทรศัพท์' },
  { key: 'email', label: 'อีเมลติดต่อ' },
  { key: 'officeHours_th', label: 'เวลาทำการ (ไทย)' },
  { key: 'officeHours_en', label: 'เวลาทำการ (English)' },
  { key: 'address_th', label: 'ที่อยู่ (ไทย)', area: true, full: true },
  { key: 'address_en', label: 'ที่อยู่ (English)', area: true, full: true }
]
const hero: { key: string; label: string; area?: boolean }[] = [
  { key: 'hero_badge', label: 'ป้ายเล็กเหนือพาดหัว' },
  { key: 'hero_title_th', label: 'พาดหัวใหญ่ (ไทย)' },
  { key: 'hero_title_en', label: 'พาดหัวใหญ่ (English)' },
  { key: 'hero_subtitle_th', label: 'คำอธิบายใต้พาดหัว (ไทย)', area: true },
  { key: 'hero_subtitle_en', label: 'คำอธิบายใต้พาดหัว (English)', area: true }
]
const inputCls = 'w-full px-3 py-2 rounded-lg bg-white ring-1 ring-black/[0.12] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00C978]'
</script>

<template>
  <form class="space-y-4 max-w-4xl" @submit.prevent="saveSiteSetting()">
    <section class="bg-white rounded-2xl ring-1 ring-black/[0.06] p-5">
      <h3 class="text-sm font-semibold mb-4">ข้อมูลบริษัท</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="f in fields" :key="f.key" :class="f.full && 'sm:col-span-2'">
          <span class="block text-xs font-semibold mb-1">{{ f.label }}</span>
          <textarea v-if="f.area" v-model="s[f.key]" rows="2" :class="inputCls"></textarea>
          <input v-else v-model="s[f.key]" :class="inputCls" />
        </label>
      </div>
    </section>
    <section class="bg-white rounded-2xl ring-1 ring-black/[0.06] p-5">
      <h3 class="text-sm font-semibold mb-4">ข้อความหน้าแรก</h3>
      <div class="grid grid-cols-1 gap-4">
        <label v-for="f in hero" :key="f.key">
          <span class="block text-xs font-semibold mb-1">{{ f.label }}</span>
          <textarea v-if="f.area" v-model="s[f.key]" rows="2" :class="inputCls"></textarea>
          <input v-else v-model="s[f.key]" :class="inputCls" />
        </label>
      </div>
    </section>
    <div class="flex justify-end">
      <button type="submit" class="px-5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] text-forestBlack text-[13px] font-semibold">บันทึกขึ้นหน้าเว็บ</button>
    </div>
  </form>
</template>
