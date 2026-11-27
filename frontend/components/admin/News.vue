<script setup lang="ts">
const props = defineProps<{ search: string }>()
const { newsList, saveNews, unpublishNews, deleteNews, uploadImage, imageOf, isSysadmin } = useAdminApi()

const editing = ref<any | null>(null)
const saving = ref(false)
const uploading = ref(false)
const confirmDelete = ref(false)
const filter = ref<'all' | 'live' | 'draft'>('all')
const lang = ref<'th' | 'en'>('th')
const pickedDate = ref('')

const CATEGORIES = ['Enterprise Software', 'Service Development', 'E-Commerce']

const searched = computed(() => {
  const q = props.search.trim().toLowerCase()
  return newsList.value.filter(n => !q || [n.title_th, n.title_en, n.category, n.body_th].some(v => (v || '').toLowerCase().includes(q)))
})
const rows = computed(() => searched.value.filter(n => filter.value === 'all' || (filter.value === 'live' ? n._published : !n._published)))
const countOf = (f: 'all' | 'live' | 'draft') => searched.value.filter(n => f === 'all' || (f === 'live' ? n._published : !n._published)).length

const fmtDates = (iso: string) => {
  const d = new Date(iso + 'T00:00:00')
  return {
    th: d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
    en: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}
watch(pickedDate, v => {
  if (!v || !editing.value) return
  const d = fmtDates(v)
  editing.value.date_th = d.th
  editing.value.date_en = d.en
})

const openCreate = () => {
  lang.value = 'th'
  pickedDate.value = new Date().toISOString().slice(0, 10)
  editing.value = {
    title_th: '', title_en: '', subtitle_th: '', subtitle_en: '', body_th: '', body_en: '',
    fullContent_th: '', fullContent_en: '', category: 'Enterprise Software', tag: '', imageUrl: '',
    externalLink: '', readTime: '1 min', ...(() => { const d = fmtDates(new Date().toISOString().slice(0, 10)); return { date_th: d.th, date_en: d.en } })()
  }
}
const openEdit = (n: any) => {
  lang.value = 'th'
  pickedDate.value = ''
  editing.value = { ...n, imageUrl: n.imageUrl || (n.image?.url ? imageOf(n) : '') }
}

// Rough reading time from the Thai/English text
const autoReadTime = computed(() => {
  const e = editing.value
  if (!e) return ''
  const text = `${e.body_th || ''} ${e.fullContent_th || ''}`
  const mins = Math.max(1, Math.round(text.length / 900))
  return `${mins} min`
})

const onFile = async (ev: Event) => {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !editing.value) return
  uploading.value = true
  const url = await uploadImage(file)
  uploading.value = false
  if (url) editing.value.imageUrl = url
  input.value = ''
}

const submit = async (publish: boolean) => {
  if (!editing.value?.title_th?.trim()) return
  saving.value = true
  if (!editing.value.readTime || editing.value.readTime === '1 min') editing.value.readTime = autoReadTime.value
  const ok = await saveNews(editing.value, publish)
  saving.value = false
  if (ok) editing.value = null
}
const hide = async () => {
  saving.value = true
  const ok = await unpublishNews(editing.value)
  saving.value = false
  if (ok) editing.value = null
}
const doDelete = async () => {
  confirmDelete.value = false
  if (await deleteNews(editing.value)) editing.value = null
}

const inputCls = 'w-full px-3 py-2 rounded-lg bg-white ring-1 ring-black/[0.12] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00C978]'
const labelCls = 'block text-xs font-semibold mb-1'
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="f in [{ key: 'all', label: 'ทั้งหมด' }, { key: 'live', label: 'เผยแพร่อยู่' }, { key: 'draft', label: 'ฉบับร่าง / ซ่อน' }]"
          :key="f.key"
          class="px-3 py-1.5 rounded-lg text-[13px] font-medium transition"
          :class="filter === f.key ? 'bg-forestBlack text-white' : 'bg-white text-mutedSlate ring-1 ring-black/[0.06] hover:text-forestBlack'"
          @click="filter = f.key as any"
        >
          {{ f.label }} <span class="ml-1 opacity-60">{{ countOf(f.key as any) }}</span>
        </button>
      </div>
      <button class="ml-auto px-3.5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] text-forestBlack text-[13px] font-semibold flex items-center gap-1.5 shadow-sm" @click="openCreate">
        <AdminIcon name="plus" :size="16" /> เพิ่มข่าว
      </button>
    </div>

    <!-- List -->
    <div class="bg-white rounded-2xl ring-1 ring-black/[0.06] overflow-hidden">
      <button v-for="n in rows" :key="n.documentId || n.id" class="w-full text-left flex items-center gap-4 px-5 py-3.5 border-b border-black/[0.04] last:border-0 hover:bg-[#F7FBF9]" @click="openEdit(n)">
        <div class="w-20 h-12 rounded-lg overflow-hidden bg-[#F4F7F5] shrink-0 flex items-center justify-center text-mutedSlate">
          <img v-if="imageOf(n)" :src="imageOf(n)!" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
          <AdminIcon v-else name="image" :size="18" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-semibold truncate">{{ n.title_th }}</div>
          <div class="text-xs text-mutedSlate truncate">{{ n.category }} · {{ n.date_th || '-' }}<span v-if="n.externalLink"> · มีลิงก์อ่านต่อ</span></div>
        </div>
        <span
          class="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ring-1 shrink-0"
          :class="n._published ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-gray-50 text-gray-600 ring-gray-200'"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="n._published ? 'bg-emerald-500' : 'bg-gray-400'"></span>
          {{ n._published ? 'เผยแพร่อยู่' : 'ฉบับร่าง' }}
        </span>
        <AdminIcon name="edit" :size="15" class="text-mutedSlate shrink-0" />
      </button>
      <div v-if="!rows.length" class="py-14 text-center text-sm text-mutedSlate">ยังไม่มีข่าวในหมวดนี้</div>
    </div>

    <!-- Editor -->
    <AdminDrawer
      :open="!!editing"
      wide
      :title="editing?.documentId ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'"
      :subtitle="editing?.documentId ? (editing?._published ? 'ข่าวนี้แสดงบนเว็บอยู่' : 'ข่าวนี้ยังไม่แสดงบนเว็บ') : 'เลือกได้ว่าจะเผยแพร่ทันทีหรือเก็บเป็นฉบับร่าง'"
      @close="editing = null"
    >
      <form v-if="editing" id="news-form" class="space-y-5" @submit.prevent="submit(true)">
        <!-- Image -->
        <div class="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 items-start">
          <div class="aspect-[16/10] rounded-xl overflow-hidden bg-[#F4F7F5] ring-1 ring-black/[0.06] flex items-center justify-center text-mutedSlate">
            <img v-if="editing.imageUrl" :src="editing.imageUrl" class="w-full h-full object-cover" onerror="this.style.opacity='0.2'" />
            <div v-else class="text-center text-xs"><AdminIcon name="image" :size="22" class="mx-auto mb-1" />ยังไม่มีรูป</div>
          </div>
          <div class="space-y-2">
            <span :class="labelCls">รูปหน้าปกข่าว</span>
            <label class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg ring-1 ring-black/[0.12] text-[13px] font-medium cursor-pointer hover:ring-[#00C978]">
              <AdminIcon name="image" :size="15" /> {{ uploading ? 'กำลังอัปโหลด…' : 'อัปโหลดรูปจากเครื่อง' }}
              <input type="file" accept="image/*" class="hidden" :disabled="uploading" @change="onFile" />
            </label>
            <input v-model="editing.imageUrl" :class="inputCls" placeholder="หรือวางลิงก์รูป https://..." />
            <p class="text-[11px] text-mutedSlate">แนะนำรูปแนวนอน 1200×750 px ไม่เกิน 5MB</p>
          </div>
        </div>

        <!-- Language switch -->
        <div class="inline-flex rounded-lg bg-[#F4F7F5] p-0.5">
          <button type="button" class="px-3 py-1.5 rounded-md text-[13px] font-medium" :class="lang === 'th' ? 'bg-white shadow-sm' : 'text-mutedSlate'" @click="lang = 'th'">ภาษาไทย</button>
          <button type="button" class="px-3 py-1.5 rounded-md text-[13px] font-medium" :class="lang === 'en' ? 'bg-white shadow-sm' : 'text-mutedSlate'" @click="lang = 'en'">English</button>
        </div>

        <div v-show="lang === 'th'" class="space-y-4">
          <label class="block"><span :class="labelCls">หัวข้อข่าว *</span><input v-model="editing.title_th" required maxlength="200" :class="inputCls" /></label>
          <label class="block"><span :class="labelCls">หัวข้อย่อย</span><input v-model="editing.subtitle_th" maxlength="200" :class="inputCls" /></label>
          <label class="block">
            <span :class="labelCls">เนื้อหาย่อ (แสดงบนการ์ดข่าว) <span class="font-normal text-mutedSlate">{{ (editing.body_th || '').length }}/400</span></span>
            <textarea v-model="editing.body_th" rows="3" maxlength="400" :class="inputCls"></textarea>
          </label>
          <label class="block">
            <span :class="labelCls">เนื้อหาเต็ม (แสดงเมื่อกดอ่านข่าว)</span>
            <textarea v-model="editing.fullContent_th" rows="8" :class="inputCls" placeholder="เว้นว่างได้ จะใช้เนื้อหาย่อแทน"></textarea>
          </label>
        </div>
        <div v-show="lang === 'en'" class="space-y-4">
          <p class="text-[12px] text-mutedSlate">เว้นว่างได้ ระบบจะใช้ภาษาไทยแทน</p>
          <label class="block"><span :class="labelCls">Title</span><input v-model="editing.title_en" maxlength="200" :class="inputCls" /></label>
          <label class="block"><span :class="labelCls">Subtitle</span><input v-model="editing.subtitle_en" maxlength="200" :class="inputCls" /></label>
          <label class="block">
            <span :class="labelCls">Summary <span class="font-normal text-mutedSlate">{{ (editing.body_en || '').length }}/400</span></span>
            <textarea v-model="editing.body_en" rows="3" maxlength="400" :class="inputCls"></textarea>
          </label>
          <label class="block"><span :class="labelCls">Full content</span><textarea v-model="editing.fullContent_en" rows="8" :class="inputCls"></textarea></label>
        </div>

        <!-- Meta -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-black/[0.06]">
          <label class="block pt-4"><span :class="labelCls">หมวดหมู่</span>
            <select v-model="editing.category" :class="inputCls">
              <option v-for="c in CATEGORIES" :key="c">{{ c }}</option>
            </select>
          </label>
          <label class="block sm:pt-4"><span :class="labelCls">วันที่ข่าว</span>
            <input v-model="pickedDate" type="date" :class="inputCls" />
            <span class="block mt-1 text-[11px] text-mutedSlate">แสดงบนเว็บ: {{ editing.date_th || '-' }}</span>
          </label>
          <label class="block"><span :class="labelCls">ลิงก์อ่านต่อ (ถ้ามี)</span><input v-model="editing.externalLink" type="url" :class="inputCls" placeholder="https://..." /></label>
          <label class="block"><span :class="labelCls">เวลาอ่าน</span><input v-model="editing.readTime" :class="inputCls" :placeholder="autoReadTime" /></label>
        </div>

        <!-- Preview -->
        <div>
          <div class="text-xs font-semibold text-mutedSlate mb-2">ตัวอย่างการ์ดบนหน้าเว็บ</div>
          <div class="max-w-sm rounded-2xl overflow-hidden ring-1 ring-black/[0.08] bg-white">
            <div class="aspect-[16/9] bg-[#F4F7F5]"><img v-if="editing.imageUrl" :src="editing.imageUrl" class="w-full h-full object-cover" /></div>
            <div class="p-4">
              <div class="text-[11px] font-semibold text-[#00875A] mb-1">{{ editing.category }} · {{ editing.date_th }}</div>
              <div class="text-sm font-semibold text-forestBlack line-clamp-2">{{ (lang === 'en' && editing.title_en) || editing.title_th || 'หัวข้อข่าว' }}</div>
              <div class="mt-1 text-xs text-mutedSlate line-clamp-3">{{ (lang === 'en' && editing.body_en) || editing.body_th }}</div>
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <div v-if="editing" class="flex flex-wrap items-center gap-2">
          <button v-if="editing.documentId && isSysadmin" type="button" class="px-3 py-2 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-1.5" @click="confirmDelete = true">
            <AdminIcon name="trash" :size="15" /> ลบ
          </button>
          <button v-if="editing.documentId && editing._published" type="button" :disabled="saving" class="px-3 py-2 rounded-lg text-[13px] font-medium text-mutedSlate hover:bg-black/[0.04] flex items-center gap-1.5" @click="hide">
            <AdminIcon name="eye" :size="15" /> ซ่อนจากเว็บ
          </button>
          <div class="ml-auto flex gap-2">
            <button v-if="!editing._published" type="button" :disabled="saving || !editing.title_th" class="px-4 py-2 rounded-lg text-[13px] font-medium ring-1 ring-black/[0.12] hover:bg-black/[0.03] disabled:opacity-60" @click="submit(false)">
              บันทึกฉบับร่าง
            </button>
            <button type="submit" form="news-form" :disabled="saving" class="px-5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] disabled:opacity-60 text-forestBlack text-[13px] font-semibold">
              {{ saving ? 'กำลังบันทึก…' : 'บันทึกและเผยแพร่' }}
            </button>
          </div>
        </div>
      </template>
    </AdminDrawer>

    <AdminConfirm
      :open="confirmDelete"
      title="ลบข่าวนี้?"
      :message="`“${editing?.title_th || ''}” จะถูกลบถาวร และหายจากหน้าเว็บ`"
      confirm-label="ลบถาวร"
      @cancel="confirmDelete = false"
      @confirm="doDelete"
    />
  </div>
</template>
