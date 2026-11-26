<script setup lang="ts">
const props = defineProps<{ search: string }>()
const { newsList, saveNews, imageOf } = useAdminApi()
const editing = ref<any | null>(null)
const saving = ref(false)

const rows = computed(() => {
  const q = props.search.trim().toLowerCase()
  return newsList.value.filter(n => !q || [n.title_th, n.title_en, n.category].some(v => (v || '').toLowerCase().includes(q)))
})

const openCreate = () => {
  editing.value = {
    title_th: '', title_en: '', subtitle_th: '', subtitle_en: '', body_th: '', body_en: '',
    category: 'Enterprise Software', tag: '', imageUrl: '',
    date_th: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
    date_en: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}
const submit = async () => {
  saving.value = true
  const ok = await saveNews(editing.value)
  saving.value = false
  if (ok) editing.value = null
}
const inputCls = 'w-full px-3 py-2 rounded-lg bg-white ring-1 ring-black/[0.12] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00C978]'
</script>

<template>
  <div class="space-y-4">
    <div class="flex">
      <button class="ml-auto px-3.5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] text-forestBlack text-[13px] font-semibold flex items-center gap-1.5 shadow-sm" @click="openCreate">
        <AdminIcon name="plus" :size="16" /> เพิ่มข่าว
      </button>
    </div>
    <div class="bg-white rounded-2xl ring-1 ring-black/[0.06] overflow-hidden">
      <button v-for="n in rows" :key="n.documentId || n.id" class="w-full text-left flex items-center gap-4 px-5 py-3.5 border-b border-black/[0.04] last:border-0 hover:bg-[#F7FBF9]" @click="editing = { ...n }">
        <div class="w-16 h-11 rounded-lg overflow-hidden bg-[#F4F7F5] shrink-0">
          <img v-if="imageOf(n)" :src="imageOf(n)!" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-semibold truncate">{{ n.title_th }}</div>
          <div class="text-xs text-mutedSlate truncate">{{ n.category }} · {{ n.date_th }}</div>
        </div>
        <AdminIcon name="edit" :size="15" class="text-mutedSlate shrink-0" />
      </button>
      <div v-if="!rows.length" class="py-14 text-center text-sm text-mutedSlate">ยังไม่มีข่าว</div>
    </div>

    <AdminDrawer :open="!!editing" wide :title="editing?.documentId ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'" subtitle="บันทึกแล้วขึ้นหน้าเว็บทันที" @close="editing = null">
      <form v-if="editing" id="news-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="submit">
        <label class="sm:col-span-2"><span class="block text-xs font-semibold mb-1">หัวข้อ (ไทย) *</span><input v-model="editing.title_th" required :class="inputCls" /></label>
        <label class="sm:col-span-2"><span class="block text-xs font-semibold mb-1">หัวข้อ (English)</span><input v-model="editing.title_en" :class="inputCls" placeholder="เว้นว่างได้ จะใช้ภาษาไทยแทน" /></label>
        <label><span class="block text-xs font-semibold mb-1">หัวข้อย่อย (ไทย)</span><input v-model="editing.subtitle_th" :class="inputCls" /></label>
        <label><span class="block text-xs font-semibold mb-1">หมวดหมู่</span>
          <select v-model="editing.category" :class="inputCls">
            <option>Enterprise Software</option><option>Service Development</option><option>E-Commerce</option>
          </select>
        </label>
        <label><span class="block text-xs font-semibold mb-1">วันที่ (แสดงบนเว็บ)</span><input v-model="editing.date_th" :class="inputCls" /></label>
        <label><span class="block text-xs font-semibold mb-1">ลิงก์รูปภาพ</span><input v-model="editing.imageUrl" :class="inputCls" placeholder="https://..." /></label>
        <label class="sm:col-span-2"><span class="block text-xs font-semibold mb-1">เนื้อหาย่อ (ไทย)</span><textarea v-model="editing.body_th" rows="5" :class="inputCls"></textarea></label>
        <label class="sm:col-span-2"><span class="block text-xs font-semibold mb-1">เนื้อหาย่อ (English)</span><textarea v-model="editing.body_en" rows="4" :class="inputCls"></textarea></label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 rounded-lg text-[13px] font-medium text-mutedSlate hover:bg-black/[0.04]" @click="editing = null">ยกเลิก</button>
          <button type="submit" form="news-form" :disabled="saving" class="px-5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] disabled:opacity-60 text-forestBlack text-[13px] font-semibold">{{ saving ? 'กำลังบันทึก…' : 'บันทึกและเผยแพร่' }}</button>
        </div>
      </template>
    </AdminDrawer>
  </div>
</template>
