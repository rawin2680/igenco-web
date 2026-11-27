<script setup lang="ts">
import { timeAgo } from '~/composables/useAdminApi'
import { renderMarkdown, estimateReadTime, newsDateValue } from '~/utils/markdown'
// News management: list (search / status / category / sort) + full-screen
// editor with draft & publish, cover upload, Markdown content with preview,
// autosave to this browser, unsaved-changes guard and a pre-publish checklist.
const props = defineProps<{ search: string }>()
const { newsList, isSysadmin, imageOf, saveNews, publishNews, unpublishNews, deleteNews, uploadImage } = useAdminApi()

const CATEGORIES = ['Enterprise Software', 'Service Development', 'E-Commerce']
const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  published: { label: 'เผยแพร่แล้ว', cls: 'bg-[#E8F8F2] text-[#006B47]', dot: 'bg-[#00C978]' },
  modified: { label: 'มีแก้ไขยังไม่เผยแพร่', cls: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  draft: { label: 'ฉบับร่าง', cls: 'bg-[#F1F3F2] text-mutedSlate', dot: 'bg-[#9AA5A0]' }
}

// ---------------------------------------------------------------- list
const statusFilter = ref<'all' | 'published' | 'draft'>('all')
const catFilter = ref('')
const sortBy = ref<'updated' | 'date'>('updated')
const menuFor = ref<string | null>(null)

const counts = computed(() => ({
  all: newsList.value.length,
  published: newsList.value.filter(n => n._status !== 'draft').length,
  draft: newsList.value.filter(n => n._status === 'draft').length
}))

const rows = computed(() => {
  const q = props.search.trim().toLowerCase()
  const list = newsList.value.filter(n => {
    if (statusFilter.value === 'published' && n._status === 'draft') return false
    if (statusFilter.value === 'draft' && n._status !== 'draft') return false
    if (catFilter.value && n.category !== catFilter.value) return false
    if (!q) return true
    return [n.title_th, n.title_en, n.subtitle_th, n.body_th, n.category, n.tag].some(v => (v || '').toLowerCase().includes(q))
  })
  if (sortBy.value === 'date') {
    return [...list].sort((a, b) => {
      const va = newsDateValue(a.date_en), vb = newsDateValue(b.date_en)
      if (Number.isNaN(va) && Number.isNaN(vb)) return 0
      if (Number.isNaN(va)) return 1
      if (Number.isNaN(vb)) return -1
      return vb - va
    })
  }
  return list // already newest-updated first from the API
})

const closeMenu = () => (menuFor.value = null)
onMounted(() => document.addEventListener('click', closeMenu))
onBeforeUnmount(() => document.removeEventListener('click', closeMenu))

// ---------------------------------------------------------------- editor state
const editing = ref<any | null>(null)
const lang = ref<'th' | 'en'>('th')
const pane = ref<'write' | 'preview'>('write')
const showPreview = ref(false)
const saving = ref<'' | 'draft' | 'publish'>('')
const uploading = ref(false)
const snapshot = ref('')
const restoreOffer = ref<{ at: number; data: any } | null>(null)
const confirm = ref<null | { kind: 'close' | 'delete' | 'unpublish'; item?: any }>(null)
const contentEl = ref<HTMLTextAreaElement | null>(null)
const lastLocalSave = ref<number | null>(null)

const FIELDS = ['title_th', 'title_en', 'subtitle_th', 'subtitle_en', 'body_th', 'body_en', 'fullContent_th', 'fullContent_en',
  'category', 'tag', 'date_th', 'date_en', 'imageUrl', 'externalLink'] as const
const serialize = (n: any) => JSON.stringify([...FIELDS.map(k => n?.[k] || ''), n?.image?.id || null])
const isDirty = computed(() => !!editing.value && serialize(editing.value) !== snapshot.value)

const toIsoDay = (t: number) => {
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const fmtDates = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const o: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return { th: dt.toLocaleDateString('th-TH', o), en: dt.toLocaleDateString('en-US', o) }
}

const autosaveKey = (n: any) => `igenco_news_autosave_${n?.documentId || 'new'}`

const openEditor = (n: any) => {
  const v = newsDateValue(n.date_en)
  editing.value = { ...n, pubDate: Number.isNaN(v) ? '' : toIsoDay(v) }
  snapshot.value = serialize(editing.value)
  lang.value = 'th'
  pane.value = 'write'
  showPreview.value = false
  restoreOffer.value = null
  lastLocalSave.value = null
  try {
    const saved = JSON.parse(localStorage.getItem(autosaveKey(n)) || 'null')
    const base = n.updatedAt ? new Date(n.updatedAt).getTime() : 0
    if (saved?.data && saved.at > base && serialize(saved.data) !== snapshot.value) restoreOffer.value = saved
  } catch {}
}

const openCreate = () => {
  const today = toIsoDay(Date.now())
  const d = fmtDates(today)
  openEditor({
    title_th: '', title_en: '', subtitle_th: '', subtitle_en: '', body_th: '', body_en: '',
    fullContent_th: '', fullContent_en: '', category: 'Enterprise Software', tag: '',
    imageUrl: '', image: null, externalLink: '', date_th: d.th, date_en: d.en, _status: 'new'
  })
  editing.value.pubDate = today
}

const duplicate = (n: any) => {
  const { id, documentId, createdAt, updatedAt, publishedAt, _publishedAt, ...rest } = n
  openEditor({ ...rest, title_th: `${n.title_th} (สำเนา)`, title_en: n.title_en ? `${n.title_en} (copy)` : '', _status: 'new' })
  snapshot.value = '' // a copy is unsaved by definition
}

const restoreAutosave = () => {
  if (!restoreOffer.value || !editing.value) return
  Object.assign(editing.value, restoreOffer.value.data)
  restoreOffer.value = null
}
const dropAutosave = () => {
  try { localStorage.removeItem(autosaveKey(editing.value)) } catch {}
  restoreOffer.value = null
}

// Autosave the open article to this browser (debounced), so a closed tab or a
// lost connection doesn't lose work.
let autosaveTimer: any
watch(editing, n => {
  if (!n || !isDirty.value) return
  clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(() => {
    try {
      const data: any = {}
      FIELDS.forEach(k => (data[k] = n[k]))
      data.image = n.image || null
      data.pubDate = n.pubDate
      localStorage.setItem(autosaveKey(n), JSON.stringify({ at: Date.now(), data }))
      lastLocalSave.value = Date.now()
    } catch {}
  }, 800)
}, { deep: true })

const onDatePick = () => {
  const iso = editing.value?.pubDate
  if (!iso) return
  const d = fmtDates(iso)
  editing.value.date_th = d.th
  editing.value.date_en = d.en
}

const closeNow = () => {
  if (editing.value && !isDirty.value) { try { localStorage.removeItem(autosaveKey(editing.value)) } catch {} }
  editing.value = null
  confirm.value = null
}
const requestClose = () => {
  if (isDirty.value) confirm.value = { kind: 'close' }
  else closeNow()
}
const discardAndClose = () => {
  try { localStorage.removeItem(autosaveKey(editing.value)) } catch {}
  editing.value = null
  confirm.value = null
}

// ---------------------------------------------------------------- checks
const L = (k: string) => `${k}_${lang.value}`
const checks = computed(() => {
  const n = editing.value || {}
  return [
    { ok: !!n.title_th?.trim(), label: 'มีหัวข้อภาษาไทย', required: true },
    { ok: !!imageOf(n), label: 'มีรูปปก' },
    { ok: !!n.body_th?.trim(), label: 'มีเนื้อหาย่อ (แสดงบนการ์ด)' },
    { ok: (n.title_th || '').length <= 90, label: 'หัวข้อไม่ยาวเกิน 90 ตัวอักษร' },
    { ok: !!n.title_en?.trim(), label: 'มีหัวข้อภาษาอังกฤษ' }
  ]
})
const canPublish = computed(() => checks.value.filter(c => c.required).every(c => c.ok))
const readTime = computed(() => estimateReadTime(editing.value?.body_th, editing.value?.fullContent_th))

// ---------------------------------------------------------------- actions
const save = async (publish: boolean) => {
  if (!editing.value || saving.value) return
  if (!editing.value.title_th?.trim()) { lang.value = 'th'; pane.value = 'write'; return }
  saving.value = publish ? 'publish' : 'draft'
  editing.value.readTime = readTime.value
  const res = await saveNews(editing.value, publish)
  saving.value = ''
  if (!res) return
  try { localStorage.removeItem(autosaveKey(editing.value)) } catch {}
  if (res?.documentId) {
    try { localStorage.removeItem(autosaveKey({})) } catch {}
    const fresh = newsList.value.find(x => x.documentId === res.documentId)
    if (fresh) {
      const pubDate = editing.value.pubDate
      editing.value = { ...fresh, pubDate }
      snapshot.value = serialize(editing.value)
    }
  }
  if (publish) editing.value = null
}

const onConfirm = async () => {
  const c = confirm.value
  if (!c) return
  if (c.kind === 'close') return discardAndClose()
  confirm.value = null
  if (c.kind === 'delete' && (await deleteNews(c.item)) && editing.value?.documentId === c.item.documentId) editing.value = null
  if (c.kind === 'unpublish' && (await unpublishNews(c.item)) && editing.value?.documentId === c.item.documentId) editing.value = null
}

const confirmText = computed(() => {
  const c = confirm.value
  if (!c) return { title: '', message: '', label: '' }
  if (c.kind === 'close') return { title: 'ปิดโดยไม่บันทึก?', message: 'การแก้ไขที่ยังไม่ได้บันทึกจะหายไป', label: 'ทิ้งการแก้ไข' }
  if (c.kind === 'delete') return { title: `ลบ "${c.item.title_th}"?`, message: 'ข่าวจะหายจากหน้าเว็บและลบถาวร กู้คืนไม่ได้', label: 'ลบถาวร' }
  return { title: `ซ่อน "${c.item.title_th}" จากหน้าเว็บ?`, message: 'ข่าวจะไม่แสดงบนเว็บ แต่ยังเก็บไว้เป็นฉบับร่าง เผยแพร่ใหม่ได้ภายหลัง', label: 'ซ่อนจากเว็บ' }
})

// cover image
const coverInput = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
const handleCover = async (file?: File | null) => {
  if (!file || !editing.value) return
  uploading.value = true
  const up = await uploadImage(file)
  uploading.value = false
  if (up) { editing.value.image = up; editing.value.imageUrl = '' }
}
const onCoverDrop = (e: DragEvent) => { dragOver.value = false; handleCover(e.dataTransfer?.files?.[0]) }
const removeCover = () => { if (editing.value) { editing.value.image = null; editing.value.imageUrl = '' } }

// markdown toolbar
const contentKey = computed(() => L('fullContent'))
const wrap = async (before: string, after = '', placeholder = '') => {
  const el = contentEl.value
  if (!el || !editing.value) return
  const v: string = editing.value[contentKey.value] || ''
  const s = el.selectionStart, e = el.selectionEnd
  const sel = v.slice(s, e) || placeholder
  editing.value[contentKey.value] = v.slice(0, s) + before + sel + after + v.slice(e)
  await nextTick()
  el.focus()
  el.setSelectionRange(s + before.length, s + before.length + sel.length)
}
const linePrefix = async (prefix: string) => {
  const el = contentEl.value
  if (!el || !editing.value) return
  const v: string = editing.value[contentKey.value] || ''
  const s = v.lastIndexOf('\n', el.selectionStart - 1) + 1
  const e = el.selectionEnd
  const block = v.slice(s, e) || 'ข้อความ'
  const out = block.split('\n').map((l, i) => (prefix === '1. ' ? `${i + 1}. ` : prefix) + l).join('\n')
  editing.value[contentKey.value] = v.slice(0, s) + out + v.slice(e)
  await nextTick()
  el.focus()
}
const inlineImgInput = ref<HTMLInputElement | null>(null)
const insertImage = async (file?: File | null) => {
  if (!file) return
  uploading.value = true
  const up = await uploadImage(file)
  uploading.value = false
  if (up?.url) wrap(`\n\n![${file.name.replace(/\.[^.]+$/, '')}](${imageOf({ image: up })})\n\n`)
}
const toolbar = [
  { icon: 'heading', title: 'หัวข้อย่อย', run: () => linePrefix('## ') },
  { icon: 'bold', title: 'ตัวหนา', run: () => wrap('**', '**', 'ตัวหนา') },
  { icon: 'italic', title: 'ตัวเอียง', run: () => wrap('*', '*', 'ตัวเอียง') },
  { icon: 'list', title: 'รายการ', run: () => linePrefix('- ') },
  { icon: 'numbered', title: 'รายการตัวเลข', run: () => linePrefix('1. ') },
  { icon: 'quote', title: 'คำพูด', run: () => linePrefix('> ') },
  { icon: 'link', title: 'ลิงก์', run: () => wrap('[', '](https://)', 'ข้อความลิงก์') },
  { icon: 'image', title: 'แทรกรูป', run: () => inlineImgInput.value?.click() }
]

// keyboard: Esc closes, Ctrl/Cmd+S saves a draft
const onKey = (e: KeyboardEvent) => {
  if (!editing.value || confirm.value) return
  if (e.key === 'Escape') { e.preventDefault(); requestClose() }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(false) }
}
const onBeforeUnload = (e: BeforeUnloadEvent) => { if (isDirty.value) { e.preventDefault(); e.returnValue = '' } }
onMounted(() => { window.addEventListener('keydown', onKey); window.addEventListener('beforeunload', onBeforeUnload) })
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); window.removeEventListener('beforeunload', onBeforeUnload); document.body.style.overflow = '' })
watch(editing, v => { document.body.style.overflow = v ? 'hidden' : '' }, { flush: 'post' })

// preview helpers (mirror the public site's fallbacks)
const pv = computed(() => {
  const n = editing.value || {}
  const l = lang.value
  const pick = (k: string) => (l === 'en' ? n[`${k}_en`] || n[`${k}_th`] : n[`${k}_th`]) || ''
  return {
    title: pick('title') || 'หัวข้อข่าว', subtitle: pick('subtitle'), body: pick('body'),
    content: (l === 'en' ? n.fullContent_en : n.fullContent_th) || '',
    date: pick('date'), tag: n.tag || n.category, image: imageOf(n) || '/images/news/iso29110.jpg'
  }
})

const timeShort = (t: number | null) => (t ? new Date(t).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '')
const inputCls = 'w-full px-3 py-2 rounded-lg bg-white ring-1 ring-black/[0.12] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00C978]'
const cardCls = 'bg-white rounded-2xl ring-1 ring-black/[0.06] p-4'
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex gap-1.5">
        <button v-for="s in ([['all', 'ทั้งหมด'], ['published', 'บนเว็บ'], ['draft', 'ฉบับร่าง']] as const)" :key="s[0]"
          class="px-3 py-1.5 rounded-lg text-[13px] font-medium transition"
          :class="statusFilter === s[0] ? 'bg-forestBlack text-white' : 'bg-white text-mutedSlate ring-1 ring-black/[0.06] hover:text-forestBlack'"
          @click="statusFilter = s[0]">{{ s[1] }} <span class="opacity-60">{{ counts[s[0]] }}</span></button>
      </div>
      <select v-model="catFilter" class="px-2.5 py-1.5 rounded-lg bg-white ring-1 ring-black/[0.06] text-[13px] text-mutedSlate focus:outline-none">
        <option value="">ทุกหมวดหมู่</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="sortBy" class="px-2.5 py-1.5 rounded-lg bg-white ring-1 ring-black/[0.06] text-[13px] text-mutedSlate focus:outline-none">
        <option value="updated">แก้ไขล่าสุด</option>
        <option value="date">วันที่ข่าว (ใหม่ → เก่า)</option>
      </select>
      <button class="ml-auto px-3.5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] text-forestBlack text-[13px] font-semibold flex items-center gap-1.5 shadow-sm" @click="openCreate">
        <AdminIcon name="plus" :size="16" /> เขียนข่าวใหม่
      </button>
    </div>

    <!-- List -->
    <div class="bg-white rounded-2xl ring-1 ring-black/[0.06]">
      <div class="hidden md:grid grid-cols-[minmax(0,1fr)_150px_140px_120px_44px] gap-4 px-5 py-2.5 border-b border-black/[0.06] text-[11px] font-semibold uppercase tracking-wide text-mutedSlate">
        <span>ข่าว</span><span>สถานะ</span><span>วันที่ข่าว</span><span>แก้ไขล่าสุด</span><span></span>
      </div>
      <div v-for="n in rows" :key="n.documentId || n.id"
        class="group relative grid grid-cols-[minmax(0,1fr)_36px] md:grid-cols-[minmax(0,1fr)_150px_140px_120px_44px] gap-x-4 gap-y-1 items-center px-4 md:px-5 py-3 border-b border-black/[0.04] last:border-0 hover:bg-[#F7FBF9] cursor-pointer"
        @click="openEditor(n)">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-16 h-11 rounded-lg overflow-hidden bg-[#F4F7F5] shrink-0 flex items-center justify-center text-mutedSlate/50">
            <img v-if="imageOf(n)" :src="imageOf(n)!" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
            <AdminIcon v-else name="image" :size="16" />
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold truncate">{{ n.title_th }}</div>
            <div class="text-xs text-mutedSlate truncate">{{ n.category }}<template v-if="n.subtitle_th"> · {{ n.subtitle_th }}</template></div>
            <!-- mobile meta -->
            <div class="md:hidden mt-1 flex items-center gap-2 text-[11px] text-mutedSlate">
              <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-medium" :class="STATUS_META[n._status]?.cls">
                <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_META[n._status]?.dot"></span>{{ STATUS_META[n._status]?.label }}
              </span>
              <span class="truncate">{{ n.date_th }}</span>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium" :class="STATUS_META[n._status]?.cls">
            <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_META[n._status]?.dot"></span>{{ STATUS_META[n._status]?.label }}
          </span>
        </div>
        <div class="hidden md:block text-xs text-mutedSlate truncate">{{ n.date_th || '-' }}</div>
        <div class="hidden md:block text-xs text-mutedSlate">{{ timeAgo(n.updatedAt) }}</div>
        <div class="relative justify-self-end" @click.stop>
          <button class="p-2 rounded-lg text-mutedSlate hover:bg-black/[0.05] hover:text-forestBlack" aria-label="ตัวเลือก"
            @click="menuFor = menuFor === n.documentId ? null : n.documentId">
            <AdminIcon name="more" :size="18" />
          </button>
          <div v-if="menuFor === n.documentId" class="absolute right-0 top-full mt-1 z-20 w-52 bg-white rounded-xl shadow-xl ring-1 ring-black/[0.08] py-1.5 text-[13px]">
            <button class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F7F5]" @click="menuFor = null; openEditor(n)"><AdminIcon name="edit" :size="15" />แก้ไข</button>
            <button class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F7F5]" @click="menuFor = null; duplicate(n)"><AdminIcon name="copy" :size="15" />ทำสำเนา</button>
            <button v-if="n._status !== 'published'" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F7F5] text-[#006B47]" @click="menuFor = null; publishNews(n)"><AdminIcon name="globe" :size="15" />{{ n._status === 'draft' ? 'เผยแพร่ขึ้นเว็บ' : 'เผยแพร่การแก้ไข' }}</button>
            <a v-if="n._status !== 'draft'" href="/#news" target="_blank" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F7F5]" @click="menuFor = null"><AdminIcon name="external" :size="15" />ดูบนหน้าเว็บ</a>
            <template v-if="isSysadmin">
              <div class="my-1 border-t border-black/[0.06]"></div>
              <button v-if="n._status !== 'draft'" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F7F5]" @click="menuFor = null; confirm = { kind: 'unpublish', item: n }"><AdminIcon name="eye-off" :size="15" />ซ่อนจากหน้าเว็บ</button>
              <button class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 text-red-600" @click="menuFor = null; confirm = { kind: 'delete', item: n }"><AdminIcon name="trash" :size="15" />ลบ</button>
            </template>
          </div>
        </div>
      </div>
      <div v-if="!rows.length" class="py-14 text-center">
        <div class="text-sm text-mutedSlate">{{ newsList.length ? 'ไม่พบข่าวที่ตรงกับตัวกรอง' : 'ยังไม่มีข่าว' }}</div>
        <button v-if="!newsList.length" class="mt-3 text-[13px] font-semibold text-[#00875A] hover:underline" @click="openCreate">+ เขียนข่าวแรก</button>
      </div>
    </div>

    <!-- ================= Full-screen editor ================= -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-2"
        leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <div v-if="editing" class="fixed inset-0 z-[90] bg-[#F4F6F5] flex flex-col font-thai text-forestBlack" role="dialog" aria-modal="true">
          <!-- top bar -->
          <header class="h-14 shrink-0 bg-white border-b border-black/[0.06] flex items-center gap-2 px-3 sm:px-5">
            <button class="p-2 rounded-lg text-mutedSlate hover:bg-[#F4F7F5] hover:text-forestBlack" aria-label="ปิด" @click="requestClose"><AdminIcon name="x" /></button>
            <div class="min-w-0">
              <div class="text-[15px] font-semibold truncate">{{ editing.documentId ? 'แก้ไขข่าว' : 'เขียนข่าวใหม่' }}</div>
              <div class="text-[11px] text-mutedSlate truncate">
                <template v-if="isDirty">มีการแก้ไขที่ยังไม่บันทึก<template v-if="lastLocalSave"> · สำรองในเครื่องแล้ว {{ timeShort(lastLocalSave) }}</template></template>
                <template v-else-if="editing.updatedAt">บันทึกล่าสุด {{ timeAgo(editing.updatedAt) }}</template>
                <template v-else>ยังไม่ได้บันทึก</template>
              </div>
            </div>
            <span v-if="STATUS_META[editing._status]" class="hidden sm:inline-flex ml-1 items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium" :class="STATUS_META[editing._status].cls">
              <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_META[editing._status].dot"></span>{{ STATUS_META[editing._status].label }}
            </span>
            <div class="ml-auto flex items-center gap-1.5">
              <button class="hidden sm:flex px-3 py-2 rounded-lg text-[13px] font-medium items-center gap-1.5"
                :class="showPreview ? 'bg-forestBlack text-white' : 'text-mutedSlate hover:bg-[#F4F7F5]'" @click="showPreview = !showPreview">
                <AdminIcon name="eye" :size="16" /> ดูตัวอย่าง
              </button>
              <button :disabled="!!saving" class="px-3 py-2 rounded-lg text-[13px] font-medium ring-1 ring-black/[0.12] bg-white hover:bg-[#F7F9F8] disabled:opacity-60" title="Ctrl/⌘ + S" @click="save(false)">
                {{ saving === 'draft' ? 'กำลังบันทึก…' : 'บันทึกร่าง' }}
              </button>
              <button :disabled="!!saving || !canPublish" class="px-4 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] disabled:opacity-50 text-forestBlack text-[13px] font-semibold" @click="save(true)">
                {{ saving === 'publish' ? 'กำลังเผยแพร่…' : editing._status === 'published' || editing._status === 'modified' ? 'อัปเดตบนเว็บ' : 'เผยแพร่' }}
              </button>
            </div>
          </header>

          <div class="flex-1 overflow-y-auto">
            <div class="max-w-6xl mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5">
              <!-- main column -->
              <div class="space-y-4 min-w-0">
                <div v-if="restoreOffer" class="flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 text-amber-800 text-[13px] ring-1 ring-amber-200">
                  <AdminIcon name="alert" :size="16" />
                  <span>พบฉบับที่ยังไม่ได้บันทึกในเครื่องนี้ ({{ timeShort(restoreOffer.at) }})</span>
                  <button class="ml-auto px-3 py-1 rounded-lg bg-amber-600 text-white font-semibold" @click="restoreAutosave">กู้คืน</button>
                  <button class="px-3 py-1 rounded-lg hover:bg-amber-100" @click="dropAutosave">ทิ้ง</button>
                </div>

                <!-- language switch -->
                <div class="flex items-center gap-2">
                  <div class="inline-flex p-1 rounded-xl bg-white ring-1 ring-black/[0.06]">
                    <button v-for="l in (['th', 'en'] as const)" :key="l" class="px-3.5 py-1.5 rounded-lg text-[13px] font-medium"
                      :class="lang === l ? 'bg-forestBlack text-white' : 'text-mutedSlate hover:text-forestBlack'" @click="lang = l">
                      {{ l === 'th' ? 'ภาษาไทย' : 'English' }}
                      <span v-if="l === 'en' && !editing.title_en" class="ml-1 w-1.5 h-1.5 inline-block rounded-full bg-amber-400 align-middle"></span>
                    </button>
                  </div>
                  <span v-if="lang === 'en'" class="text-xs text-mutedSlate">ช่องที่เว้นว่างจะใช้ภาษาไทยแทนบนเว็บ</span>
                  <button class="sm:hidden ml-auto px-3 py-1.5 rounded-lg text-[13px] font-medium flex items-center gap-1"
                    :class="showPreview ? 'bg-forestBlack text-white' : 'bg-white ring-1 ring-black/[0.06] text-mutedSlate'" @click="showPreview = !showPreview">
                    <AdminIcon name="eye" :size="15" /> ตัวอย่าง
                  </button>
                </div>

                <!-- PREVIEW (looks like the public article popup) -->
                <article v-if="showPreview" class="bg-white rounded-3xl ring-1 ring-black/[0.06] p-5 sm:p-8">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8F2] text-[#00875A] border border-[#B5EAD3]">{{ pv.tag }}</span>
                    <span class="text-xs text-mutedSlate font-mono">{{ pv.date }}</span>
                  </div>
                  <h2 class="text-xl sm:text-2xl font-bold leading-snug mb-2">{{ pv.title }}</h2>
                  <h3 v-if="pv.subtitle" class="text-sm font-semibold text-[#00875A] mb-5">{{ pv.subtitle }}</h3>
                  <img :src="pv.image" class="w-full max-h-80 object-cover rounded-2xl mb-6" />
                  <div class="text-sm text-forestBlack/80 leading-relaxed space-y-4">
                    <p v-if="pv.body" class="font-medium">{{ pv.body }}</p>
                    <div class="space-y-3" v-html="renderMarkdown(pv.content)"></div>
                  </div>
                  <p class="mt-6 pt-4 border-t border-black/[0.06] text-xs text-mutedSlate">ตัวอย่างนี้แสดงเหมือนหน้าต่างอ่านข่าวบนเว็บไซต์</p>
                </article>

                <!-- WRITE -->
                <template v-else>
                  <div :class="cardCls" class="space-y-4">
                    <label class="block">
                      <div class="flex justify-between mb-1"><span class="text-xs font-semibold">หัวข้อ {{ lang === 'th' ? '(ไทย) *' : '(English)' }}</span>
                        <span class="text-[11px]" :class="(editing[L('title')] || '').length > 90 ? 'text-amber-600' : 'text-mutedSlate'">{{ (editing[L('title')] || '').length }}/90</span></div>
                      <input v-model="editing[L('title')]" :required="lang === 'th'" class="w-full px-3 py-2.5 rounded-lg bg-white ring-1 ring-black/[0.12] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#00C978]"
                        :placeholder="lang === 'th' ? 'เช่น IGENCO ผ่านการรับรองมาตรฐาน ISO/IEC 29110' : editing.title_th || 'English headline'" />
                    </label>
                    <label class="block">
                      <span class="block text-xs font-semibold mb-1">หัวข้อย่อย</span>
                      <input v-model="editing[L('subtitle')]" :class="inputCls" :placeholder="lang === 'en' ? editing.subtitle_th : 'ประโยคสั้นๆ ใต้หัวข้อ'" />
                    </label>
                    <label class="block">
                      <div class="flex justify-between mb-1"><span class="text-xs font-semibold">เนื้อหาย่อ <span class="font-normal text-mutedSlate">· แสดงบนการ์ดข่าว</span></span>
                        <span class="text-[11px]" :class="(editing[L('body')] || '').length > 200 ? 'text-amber-600' : 'text-mutedSlate'">{{ (editing[L('body')] || '').length }}/200</span></div>
                      <textarea v-model="editing[L('body')]" rows="3" :class="inputCls" :placeholder="lang === 'en' ? editing.body_th : 'สรุปข่าว 1–2 ประโยค'"></textarea>
                    </label>
                  </div>

                  <div class="bg-white rounded-2xl ring-1 ring-black/[0.06] overflow-hidden">
                    <div class="flex items-center gap-0.5 px-2 py-1.5 border-b border-black/[0.06] overflow-x-auto">
                      <span class="px-2 text-xs font-semibold shrink-0">เนื้อหาเต็ม</span>
                      <template v-if="pane === 'write'">
                        <button v-for="t in toolbar" :key="t.icon" type="button" :title="t.title" class="p-2 rounded-lg text-mutedSlate hover:bg-[#F4F7F5] hover:text-forestBlack shrink-0" @click="t.run()">
                          <AdminIcon :name="t.icon" :size="16" />
                        </button>
                      </template>
                      <div class="ml-auto inline-flex p-0.5 rounded-lg bg-[#F4F6F5] shrink-0">
                        <button class="px-2.5 py-1 rounded-md text-xs font-medium" :class="pane === 'write' ? 'bg-white shadow-sm' : 'text-mutedSlate'" @click="pane = 'write'">เขียน</button>
                        <button class="px-2.5 py-1 rounded-md text-xs font-medium" :class="pane === 'preview' ? 'bg-white shadow-sm' : 'text-mutedSlate'" @click="pane = 'preview'">แสดงผล</button>
                      </div>
                    </div>
                    <textarea v-if="pane === 'write'" ref="contentEl" v-model="editing[contentKey]" rows="16"
                      class="block w-full px-4 py-3 text-[14px] leading-relaxed focus:outline-none resize-y min-h-[260px]"
                      placeholder="เขียนเนื้อหาข่าวที่นี่… เว้นบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่ ใช้แถบเครื่องมือด้านบนจัดรูปแบบ"></textarea>
                    <div v-else class="px-4 py-3 min-h-[260px] text-[14px] leading-relaxed space-y-3">
                      <div v-if="editing[contentKey]" v-html="renderMarkdown(editing[contentKey])" class="space-y-3"></div>
                      <p v-else class="text-mutedSlate">ยังไม่มีเนื้อหา</p>
                    </div>
                    <div class="px-4 py-2 border-t border-black/[0.04] text-[11px] text-mutedSlate flex flex-wrap gap-x-3">
                      <span>**ตัวหนา**</span><span>*ตัวเอียง*</span><span>## หัวข้อ</span><span>- รายการ</span><span>[ลิงก์](https://…)</span>
                      <span class="ml-auto">เวลาอ่านประมาณ {{ readTime }}</span>
                    </div>
                    <input ref="inlineImgInput" type="file" accept="image/*" class="hidden" @change="insertImage(($event.target as HTMLInputElement).files?.[0]); ($event.target as HTMLInputElement).value = ''" />
                  </div>
                </template>
              </div>

              <!-- sidebar -->
              <aside class="space-y-4">
                <!-- publish checklist -->
                <section :class="cardCls">
                  <h3 class="text-[13px] font-semibold mb-2.5">ก่อนเผยแพร่</h3>
                  <ul class="space-y-1.5">
                    <li v-for="c in checks" :key="c.label" class="flex items-center gap-2 text-[13px]" :class="c.ok ? 'text-forestBlack' : c.required ? 'text-red-600' : 'text-mutedSlate'">
                      <span class="w-4 h-4 rounded-full flex items-center justify-center shrink-0" :class="c.ok ? 'bg-[#00C978] text-white' : 'ring-1 ring-current'">
                        <AdminIcon v-if="c.ok" name="check" :size="11" />
                      </span>
                      {{ c.label }}<span v-if="c.required && !c.ok" class="text-[11px]">(จำเป็น)</span>
                    </li>
                  </ul>
                  <p v-if="editing._status === 'modified'" class="mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">บนเว็บยังเป็นฉบับเก่า กด "อัปเดตบนเว็บ" เพื่อเผยแพร่การแก้ไข</p>
                </section>

                <!-- cover image -->
                <section :class="cardCls">
                  <h3 class="text-[13px] font-semibold mb-2.5">รูปปก</h3>
                  <div class="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#F4F7F5] ring-1 ring-dashed transition"
                    :class="dragOver ? 'ring-2 ring-[#00C978] bg-[#E8F8F2]' : 'ring-black/[0.1]'"
                    @dragover.prevent="dragOver = true" @dragleave="dragOver = false" @drop.prevent="onCoverDrop">
                    <img v-if="imageOf(editing)" :src="imageOf(editing)!" class="w-full h-full object-cover" />
                    <button v-else type="button" class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-mutedSlate text-xs" @click="coverInput?.click()">
                      <AdminIcon name="upload" :size="22" />
                      <span>{{ uploading ? 'กำลังอัปโหลด…' : 'ลากรูปมาวาง หรือคลิกเพื่อเลือก' }}</span>
                      <span class="text-[11px] opacity-70">แนะนำ 1200×750 px, ไม่เกิน 5 MB</span>
                    </button>
                    <div v-if="imageOf(editing)" class="absolute bottom-2 right-2 flex gap-1.5">
                      <button type="button" class="px-2.5 py-1 rounded-lg bg-white/95 text-xs font-medium shadow" @click="coverInput?.click()">{{ uploading ? 'กำลังอัปโหลด…' : 'เปลี่ยน' }}</button>
                      <button type="button" class="px-2.5 py-1 rounded-lg bg-white/95 text-xs font-medium text-red-600 shadow" @click="removeCover">ลบ</button>
                    </div>
                  </div>
                  <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="handleCover(($event.target as HTMLInputElement).files?.[0]); ($event.target as HTMLInputElement).value = ''" />
                  <label class="block mt-3">
                    <span class="block text-[11px] text-mutedSlate mb-1">หรือใส่ลิงก์รูปภาพ</span>
                    <input v-model="editing.imageUrl" :class="inputCls" placeholder="https://…" @input="editing.image = null" />
                  </label>
                </section>

                <!-- details -->
                <section :class="cardCls" class="space-y-3">
                  <h3 class="text-[13px] font-semibold">รายละเอียด</h3>
                  <label class="block"><span class="block text-xs font-semibold mb-1">วันที่ข่าว</span>
                    <input v-model="editing.pubDate" type="date" :class="inputCls" @change="onDatePick" />
                    <span class="block mt-1 text-[11px] text-mutedSlate">แสดงบนเว็บ: {{ editing.date_th || '-' }} / {{ editing.date_en || '-' }}</span>
                  </label>
                  <label class="block"><span class="block text-xs font-semibold mb-1">หมวดหมู่</span>
                    <select v-model="editing.category" :class="inputCls"><option v-for="c in CATEGORIES" :key="c">{{ c }}</option></select>
                  </label>
                  <label class="block"><span class="block text-xs font-semibold mb-1">ป้ายบนการ์ด</span>
                    <input v-model="editing.tag" :class="inputCls" :placeholder="editing.category" />
                  </label>
                  <label class="block"><span class="block text-xs font-semibold mb-1">ลิงก์บทความต้นฉบับ <span class="font-normal text-mutedSlate">(ถ้ามี)</span></span>
                    <input v-model="editing.externalLink" type="url" :class="inputCls" placeholder="https://igenco.co.th/…" />
                  </label>
                </section>

                <!-- card preview -->
                <section :class="cardCls">
                  <h3 class="text-[13px] font-semibold mb-2.5">การ์ดบนหน้าเว็บ</h3>
                  <div class="rounded-2xl ring-1 ring-black/[0.08] overflow-hidden">
                    <div class="relative h-32 bg-[#F4F7F5]">
                      <img :src="pv.image" class="w-full h-full object-cover" />
                      <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95">{{ pv.tag }}</span>
                    </div>
                    <div class="p-3">
                      <div class="text-[10px] text-mutedSlate font-mono mb-1">{{ readTime }} · {{ pv.date }}</div>
                      <div class="text-[13px] font-bold leading-snug line-clamp-2">{{ pv.title }}</div>
                      <div class="text-[11px] text-mutedSlate mt-1 line-clamp-2">{{ pv.body || pv.subtitle }}</div>
                    </div>
                  </div>
                </section>

                <section v-if="isSysadmin && editing.documentId" class="flex flex-col gap-2">
                  <button v-if="editing._status !== 'draft'" class="w-full px-3 py-2 rounded-lg text-[13px] font-medium text-mutedSlate ring-1 ring-black/[0.1] bg-white hover:bg-[#F7F9F8] flex items-center justify-center gap-1.5" @click="confirm = { kind: 'unpublish', item: editing }">
                    <AdminIcon name="eye-off" :size="15" /> ซ่อนจากหน้าเว็บ
                  </button>
                  <button class="w-full px-3 py-2 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5" @click="confirm = { kind: 'delete', item: editing }">
                    <AdminIcon name="trash" :size="15" /> ลบข่าวนี้
                  </button>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <AdminConfirm :open="!!confirm" :title="confirmText.title" :message="confirmText.message" :confirm-label="confirmText.label"
      :icon="confirm?.kind === 'delete' ? 'trash' : confirm?.kind === 'unpublish' ? 'eye-off' : 'alert'"
      :tone="confirm?.kind === 'delete' ? 'danger' : 'warn'"
      @confirm="onConfirm" @cancel="confirm = null" />
  </div>
</template>
