<script setup lang="ts">
import ProductIcon, { PRODUCT_ICON_TYPES } from '~/components/products/ProductIcon.vue'

const props = defineProps<{ search: string }>()
const {
  products, siteSetting, isSysadmin, imageOf, saveProduct, toggleFeatured, reorderFeatured, deleteProduct,
  uploadImage, saveSiteSetting, productHas, siteHas
} = useAdminApi()

const view = ref<'grid' | 'table'>('grid')
// shared so the overview's "จัดการ" button can open the homepage slides view
const filter = useState<'all' | 'featured'>('adm-prod-filter', () => 'featured')
const editing = ref<any | null>(null)
const lang = ref<'th' | 'en'>('th')
const saving = ref(false)
const confirmDelete = ref(false)

const featuredCount = computed(() => products.value.filter(p => p.isFeatured).length)
const featuredList = computed(() =>
  products.value.filter(p => p.isFeatured).sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
)

// Move a slide up/down and save the new order 1..n
const moveSlide = async (i: number, dir: -1 | 1) => {
  const list = [...featuredList.value]
  const j = i + dir
  if (j < 0 || j >= list.length) return
  ;[list[i], list[j]] = [list[j], list[i]]
  await reorderFeatured(list)
}

// Section headings on the homepage (stored in site setting)
const canEditHeadings = computed(() => siteHas('products_title_th'))
const savingHeadings = ref(false)
const saveHeadings = async () => {
  savingHeadings.value = true
  await saveSiteSetting('บันทึกหัวข้อหน้าแรกแล้ว')
  savingHeadings.value = false
}
const canEditLinks = computed(() => productHas('demoUrl'))

// Live preview of the homepage slide for the product being edited
const previewIndex = computed(() => {
  if (!editing.value) return 1
  const idx = featuredList.value.findIndex(p => p.documentId && p.documentId === editing.value.documentId)
  return idx >= 0 ? idx + 1 : featuredList.value.length + 1
})
const previewTotal = computed(() => {
  if (!editing.value) return 1
  const inList = featuredList.value.some(p => p.documentId && p.documentId === editing.value.documentId)
  return featuredList.value.length + (inList || !editing.value.isFeatured ? 0 : 1) || 1
})
const pad = (n: number) => String(n).padStart(2, '0')

// image upload
const imgInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const handleImage = async (file?: File | null) => {
  if (!file || !editing.value) return
  uploading.value = true
  const up = await uploadImage(file)
  uploading.value = false
  if (up) { editing.value.image = up; editing.value.imageUrl = '' }
}
const removeImage = () => { if (editing.value) { editing.value.image = null; editing.value.imageUrl = '' } }

const rows = computed(() => {
  const q = props.search.trim().toLowerCase()
  // homepage highlights first (in slide order), then the rest
  const rank = (p: any) => (p.isFeatured ? p.featuredOrder || 99 : 1000)
  return products.value
    .filter(p => {
      if (filter.value === 'featured' && !p.isFeatured) return false
      if (!q) return true
      return [p.title, p.subtitle_th, p.subtitle_en, p.tag, ...(p.tags || [])].some(v => (v || '').toLowerCase().includes(q))
    })
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i)
    .map(x => x.p)
})
// searching looks through all products
watch(() => props.search, v => { if (v.trim()) filter.value = 'all' })

const asList = (v: any): string[] => (Array.isArray(v) ? [...v] : [])

const openEdit = (p: any) => {
  lang.value = 'th'
  editing.value = {
    ...p,
    tags: asList(p.tags),
    features_th: asList(p.features_th),
    features_en: asList(p.features_en)
  }
}

const openCreate = () => {
  lang.value = 'th'
  editing.value = {
    title: '', subtitle_th: '', subtitle_en: '', description_th: '', description_en: '',
    tag: '', tags: [], features_th: [''], features_en: [''],
    isFeatured: false, featuredOrder: featuredList.value.length + 1, awardBadge: '', imageUrl: '', iconType: 'document-pen',
    detailUrl: '', demoUrl: ''
  }
}

const newTag = ref('')
const addTag = () => {
  const t = newTag.value.trim()
  if (t && editing.value && !editing.value.tags.includes(t)) editing.value.tags.push(t)
  newTag.value = ''
}

const featureKey = computed(() => (lang.value === 'th' ? 'features_th' : 'features_en'))

const submit = async () => {
  if (!editing.value?.title?.trim()) return
  saving.value = true
  const ok = await saveProduct(editing.value)
  saving.value = false
  if (ok) editing.value = null
}

const doDelete = async () => {
  if (editing.value && (await deleteProduct(editing.value))) editing.value = null
  confirmDelete.value = false
}

const inputCls = 'w-full px-3 py-2 rounded-lg bg-white ring-1 ring-black/[0.12] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00C978] disabled:bg-[#F7F9F8] disabled:text-mutedSlate'
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex gap-1.5">
        <button
          class="px-3 py-1.5 rounded-lg text-[13px] font-medium transition flex items-center gap-1"
          :class="filter === 'featured' ? 'bg-forestBlack text-white' : 'bg-white text-mutedSlate ring-1 ring-black/[0.06]'"
          @click="filter = 'featured'"
        ><AdminIcon name="star" :size="13" /> สไลด์หน้าแรก <span class="opacity-60">{{ featuredCount }}</span></button>
        <button
          class="px-3 py-1.5 rounded-lg text-[13px] font-medium transition"
          :class="filter === 'all' ? 'bg-forestBlack text-white' : 'bg-white text-mutedSlate ring-1 ring-black/[0.06]'"
          @click="filter = 'all'"
        >ทั้งหมด <span class="opacity-60">{{ products.length }}</span></button>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <div v-if="filter === 'all'" class="inline-flex rounded-lg bg-white p-0.5 ring-1 ring-black/[0.06]">
          <button class="p-1.5 rounded-md" :class="view === 'grid' ? 'bg-[#E8F8F2] text-[#00875A]' : 'text-mutedSlate'" aria-label="แสดงแบบการ์ด" @click="view = 'grid'"><AdminIcon name="grid" :size="16" /></button>
          <button class="p-1.5 rounded-md" :class="view === 'table' ? 'bg-[#E8F8F2] text-[#00875A]' : 'text-mutedSlate'" aria-label="แสดงแบบตาราง" @click="view = 'table'"><AdminIcon name="list" :size="16" /></button>
        </div>
        <button
          v-if="isSysadmin"
          class="px-3.5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] text-forestBlack text-[13px] font-semibold flex items-center gap-1.5 shadow-sm"
          @click="openCreate"
        ><AdminIcon name="plus" :size="16" /> เพิ่มผลิตภัณฑ์</button>
      </div>
    </div>

    <!-- Homepage slides manager -->
    <div v-if="filter === 'featured'" class="space-y-4">
      <div class="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#E8F8F2] text-[#00563A] text-[13px]">
        <AdminIcon name="home" :size="16" class="mt-0.5 shrink-0" />
        <div>ส่วน <b>"ผลิตภัณฑ์ไฮไลต์ของ IGENCO"</b> บนหน้าแรก แก้ได้ที่นี่ทั้งหมด: หัวข้อ ลำดับสไลด์ และเนื้อหาแต่ละสไลด์ (กด "แก้ไขสไลด์")</div>
      </div>

      <!-- Slide order -->
      <section class="bg-white rounded-2xl ring-1 ring-black/[0.06]">
        <header class="flex items-center gap-2 px-5 py-4 border-b border-black/[0.06]">
          <h3 class="text-sm font-semibold">สไลด์ ({{ featuredList.length }})</h3>
          <span class="text-xs text-mutedSlate">เรียงตามลำดับที่ขึ้นบนเว็บ</span>
        </header>
        <ol class="p-2">
          <li v-for="(p, i) in featuredList" :key="p.documentId || p.id" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F7F9F8]">
            <div v-if="isSysadmin" class="flex flex-col">
              <button type="button" class="p-0.5 rounded text-mutedSlate hover:text-forestBlack disabled:opacity-25" :disabled="i === 0" aria-label="เลื่อนขึ้น" @click="moveSlide(i, -1)">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 15l-6-6-6 6"/></svg>
              </button>
              <button type="button" class="p-0.5 rounded text-mutedSlate hover:text-forestBlack disabled:opacity-25" :disabled="i === featuredList.length - 1" aria-label="เลื่อนลง" @click="moveSlide(i, 1)">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            </div>
            <span class="w-7 text-center text-xs font-mono font-semibold text-mutedSlate">{{ pad(i + 1) }}</span>
            <div class="w-20 h-12 rounded-lg overflow-hidden bg-[#F4F7F5] shrink-0">
              <img v-if="imageOf(p)" :src="imageOf(p)!" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-[13px] font-semibold truncate">{{ p.title }}<span v-if="p.subtitle_th" class="font-normal text-mutedSlate"> — {{ p.subtitle_th }}</span></div>
              <div class="text-xs text-mutedSlate truncate">{{ p.tag || '-' }}<span v-if="p.awardBadge"> · {{ p.awardBadge }}</span></div>
            </div>
            <button type="button" class="px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#00875A] hover:bg-[#E8F8F2] flex items-center gap-1 shrink-0" @click="openEdit(p)">
              <AdminIcon :name="isSysadmin ? 'edit' : 'eye'" :size="14" /> <span class="hidden sm:inline">{{ isSysadmin ? 'แก้ไขสไลด์' : 'ดู' }}</span>
            </button>
            <button v-if="isSysadmin" type="button" class="p-1.5 rounded-lg text-mutedSlate hover:text-red-600 hover:bg-red-50 shrink-0" title="เอาออกจากสไลด์" @click="toggleFeatured(p)">
              <AdminIcon name="x" :size="15" />
            </button>
          </li>
          <li v-if="!featuredList.length" class="px-2 py-8 text-center text-sm text-mutedSlate">ยังไม่มีสไลด์ กดรูปดาว ☆ บนการ์ดผลิตภัณฑ์เพื่อเพิ่ม</li>
        </ol>
      </section>
      <p class="text-xs text-mutedSlate">เพิ่มสไลด์: ไปที่ "ทั้งหมด" แล้วกดรูปดาวบนการ์ดผลิตภัณฑ์ หรือเปิดแก้ไขแล้วเปิดสวิตช์ "แสดงในสไลด์หน้าแรก"</p>

      <!-- Section headings -->
      <section class="bg-white rounded-2xl ring-1 ring-black/[0.06] p-5">
        <h3 class="text-sm font-semibold mb-1">หัวข้อส่วนผลิตภัณฑ์บนหน้าแรก</h3>
        <p class="text-xs text-mutedSlate mb-4">ข้อความเหนือสไลด์ และหัวข้อของรายการผลิตภัณฑ์ทั้งหมดด้านล่าง</p>
        <div v-if="!canEditHeadings" class="px-3 py-2.5 rounded-lg bg-amber-50 text-amber-800 text-xs">
          ต้องอัปเดตระบบหลังบ้าน (Railway) ก่อน จึงจะแก้หัวข้อตรงนี้ได้
        </div>
        <form v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="saveHeadings">
          <fieldset :disabled="!isSysadmin" class="contents">
            <label class="block sm:col-span-2">
              <span class="block text-xs font-semibold mb-1">ข้อความเล็กด้านบน</span>
              <input v-model="siteSetting.products_eyebrow" :class="inputCls" placeholder="FEATURED SOLUTIONS • PRODUCT SHOWCASE" />
            </label>
            <label class="block">
              <span class="block text-xs font-semibold mb-1">หัวข้อสไลด์ (ไทย)</span>
              <input v-model="siteSetting.products_title_th" :class="inputCls" placeholder="ผลิตภัณฑ์ไฮไลต์ของ IGENCO." />
            </label>
            <label class="block">
              <span class="block text-xs font-semibold mb-1">หัวข้อสไลด์ (English)</span>
              <input v-model="siteSetting.products_title_en" :class="inputCls" placeholder="Featured Highlights of IGENCO." />
            </label>
            <label class="block">
              <span class="block text-xs font-semibold mb-1">หัวข้อผลิตภัณฑ์ทั้งหมด (ไทย)</span>
              <input v-model="siteSetting.solutions_title_th" :class="inputCls" placeholder="ผลิตภัณฑ์และบริการทั้งหมดของ IGENCO" />
            </label>
            <label class="block">
              <span class="block text-xs font-semibold mb-1">หัวข้อผลิตภัณฑ์ทั้งหมด (English)</span>
              <input v-model="siteSetting.solutions_title_en" :class="inputCls" placeholder="All Products & Services of IGENCO" />
            </label>
            <div v-if="isSysadmin" class="sm:col-span-2 flex justify-end">
              <button type="submit" :disabled="savingHeadings" class="px-5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] disabled:opacity-60 text-forestBlack text-[13px] font-semibold">
                {{ savingHeadings ? 'กำลังบันทึก…' : 'บันทึกหัวข้อ' }}
              </button>
            </div>
          </fieldset>
        </form>
      </section>
    </div>

    <!-- Grid -->
    <div v-else-if="view === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      <article
        v-for="p in rows"
        :key="p.documentId || p.id"
        class="group bg-white rounded-2xl ring-1 ring-black/[0.06] overflow-hidden hover:shadow-lg hover:ring-[#00C978]/40 transition cursor-pointer flex flex-col"
        @click="openEdit(p)"
      >
        <div class="relative aspect-[16/9] bg-gradient-to-br from-[#E8F8F2] to-[#F4F7F5]">
          <img v-if="imageOf(p)" :src="imageOf(p)!" :alt="p.title" class="absolute inset-0 w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
          <div v-else class="absolute inset-0 flex items-center justify-center text-[#00875A]/40"><AdminIcon name="box" :size="40" /></div>
          <button
            class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur transition"
            :class="p.isFeatured ? 'bg-amber-400 text-white' : 'bg-white/90 text-mutedSlate hover:text-amber-500'"
            :title="p.isFeatured ? 'อยู่ในสไลด์ไฮไลต์ (คลิกเพื่อเอาออก)' : 'เพิ่มเข้าสไลด์ไฮไลต์'"
            :disabled="!isSysadmin"
            @click.stop="toggleFeatured(p)"
          ><AdminIcon name="star" :size="15" /></button>
          <span v-if="p.isFeatured" class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 text-[11px] font-semibold text-forestBlack">ไฮไลต์ #{{ p.featuredOrder || '-' }}</span>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <div class="text-[11px] font-medium text-[#00875A]">{{ p.tag || 'ไม่มีหมวด' }}</div>
          <h3 class="mt-0.5 text-[15px] font-semibold text-forestBlack leading-snug">{{ p.title }}</h3>
          <p class="mt-1 text-[13px] text-mutedSlate line-clamp-2">{{ p.subtitle_th || p.description_th || '-' }}</p>
          <div class="mt-auto pt-3 flex items-center gap-2 text-[11px] text-mutedSlate">
            <span v-if="p.awardBadge" class="truncate">{{ p.awardBadge }}</span>
            <span class="ml-auto inline-flex items-center gap-1 text-forestBlack/70 group-hover:text-[#00875A]">
              <AdminIcon :name="isSysadmin ? 'edit' : 'arrow'" :size="13" /> {{ isSysadmin ? 'แก้ไข' : 'ดู' }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl ring-1 ring-black/[0.06] overflow-hidden">
      <div class="hidden md:grid grid-cols-[56px_2fr_1.4fr_110px_90px] gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-mutedSlate border-b border-black/[0.06] bg-[#FAFBFA]">
        <div></div><div>ผลิตภัณฑ์</div><div>หมวด</div><div>ไฮไลต์</div><div class="text-right">ลำดับ</div>
      </div>
      <div
        v-for="p in rows"
        :key="p.documentId || p.id"
        class="grid grid-cols-[56px_1fr] md:grid-cols-[56px_2fr_1.4fr_110px_90px] gap-x-4 gap-y-1 items-center px-5 py-3 border-b border-black/[0.04] last:border-0 hover:bg-[#F7FBF9] cursor-pointer"
        @click="openEdit(p)"
      >
        <div class="w-14 h-10 rounded-lg overflow-hidden bg-[#F4F7F5] row-span-2 md:row-span-1">
          <img v-if="imageOf(p)" :src="imageOf(p)!" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
        </div>
        <div class="min-w-0">
          <div class="text-sm font-semibold truncate">{{ p.title }}</div>
          <div class="text-xs text-mutedSlate truncate">{{ p.subtitle_th }}</div>
        </div>
        <div class="text-[13px] text-mutedSlate truncate">{{ p.tag || '-' }}</div>
        <div>
          <button
            class="relative inline-flex h-5 w-9 rounded-full transition disabled:opacity-60"
            :class="p.isFeatured ? 'bg-[#00C978]' : 'bg-black/15'"
            :disabled="!isSysadmin"
            @click.stop="toggleFeatured(p)"
          ><span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :class="p.isFeatured ? 'left-[18px]' : 'left-0.5'"></span></button>
        </div>
        <div class="hidden md:block text-right text-[13px] text-mutedSlate">{{ p.isFeatured ? p.featuredOrder : '-' }}</div>
      </div>
    </div>

    <div v-if="!rows.length && filter === 'all'" class="py-16 text-center text-sm text-mutedSlate bg-white rounded-2xl ring-1 ring-black/[0.06]">
      ไม่พบผลิตภัณฑ์
    </div>

    <!-- Editor drawer -->
    <AdminDrawer
      :open="!!editing"
      wide
      :title="editing?.documentId ? editing.title || 'แก้ไขผลิตภัณฑ์' : 'เพิ่มผลิตภัณฑ์ใหม่'"
      :subtitle="isSysadmin ? 'บันทึกแล้วขึ้นหน้าเว็บทันที' : 'บัญชี Editor ดูได้อย่างเดียว'"
      @close="editing = null"
    >
      <form v-if="editing" id="product-form" class="space-y-6" @submit.prevent="submit">
        <!-- Live preview of the homepage slide -->
        <section class="rounded-2xl bg-[#F8FAF9] ring-1 ring-black/[0.06] p-3">
          <div class="flex items-center gap-2 mb-2 px-1">
            <AdminIcon name="eye" :size="14" class="text-mutedSlate" />
            <span class="text-xs font-semibold">ตัวอย่างบนสไลด์หน้าแรก</span>
            <span v-if="!editing.isFeatured" class="ml-auto text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">ยังไม่ได้แสดงบนสไลด์</span>
          </div>
          <div class="bg-white rounded-xl ring-1 ring-black/[0.06] grid grid-cols-1 sm:grid-cols-2 overflow-hidden">
            <div class="p-4 flex flex-col">
              <div class="flex items-center gap-1.5 flex-wrap mb-2">
                <span class="relative w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#00C978] to-[#059669] text-white">
                  <ProductIcon :type="editing.iconType" class="w-3.5 h-3.5" />
                  <span class="absolute -bottom-1.5 -left-1 text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 flex items-center justify-center">6</span>
                </span>
                <span class="relative px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00C978] text-forestBlack">
                  {{ pad(previewIndex) }} / {{ pad(previewTotal) }} • {{ (editing.tag || 'ENTERPRISE').toUpperCase() }}
                  <span class="absolute -top-1.5 -right-1 text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 flex items-center justify-center">2</span>
                </span>
                <span class="relative px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  {{ editing.awardBadge || '⭐ Enterprise Solution' }}
                  <span class="absolute -top-1.5 -right-1 text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 flex items-center justify-center">3</span>
                </span>
              </div>
              <div class="relative text-[15px] font-bold leading-snug pr-4">
                {{ editing.title || 'ชื่อผลิตภัณฑ์' }}<template v-if="editing.subtitle_th"> — {{ editing.subtitle_th }}</template>
                <span class="absolute top-0 right-0 text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 flex items-center justify-center">4</span>
              </div>
              <p class="relative mt-1.5 text-xs text-mutedSlate line-clamp-3 pr-4">
                {{ editing.description_th || 'รายละเอียด…' }}
                <span class="absolute top-0 right-0 text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 flex items-center justify-center">5</span>
              </p>
              <div class="mt-auto pt-3 flex gap-1.5">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold ring-1 ring-black/15">ดูรายละเอียด</span>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#00C978]">ขอทดสอบระบบ ↗</span>
              </div>
            </div>
            <div class="relative p-2">
              <div class="aspect-[16/10] rounded-lg overflow-hidden bg-[#F4F7F5] flex items-center justify-center text-mutedSlate">
                <img v-if="imageOf(editing)" :src="imageOf(editing)!" class="w-full h-full object-cover" />
                <AdminIcon v-else name="image" :size="26" />
              </div>
              <span class="absolute top-3.5 right-3.5 text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 flex items-center justify-center">1</span>
            </div>
          </div>
          <p class="mt-2 px-1 text-[11px] text-mutedSlate">ตัวเลขสีฟ้าตรงกับช่องที่แก้ด้านล่าง</p>
        </section>

        <fieldset :disabled="!isSysadmin" class="space-y-6">
          <!-- Featured toggle -->
          <section class="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-[#F7F9F8]">
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="editing.isFeatured" type="checkbox" class="sr-only peer" />
              <span class="relative inline-flex h-6 w-11 rounded-full bg-black/15 peer-checked:bg-[#00C978] transition after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:left-[22px]"></span>
              <span>
                <span class="block text-[13px] font-semibold">แสดงในสไลด์หน้าแรก</span>
                <span class="block text-xs text-mutedSlate">ส่วน "ผลิตภัณฑ์ไฮไลต์ของ IGENCO"</span>
              </span>
            </label>
            <label v-if="editing.isFeatured" class="ml-auto flex items-center gap-2 text-[13px]">
              ลำดับสไลด์
              <input v-model.number="editing.featuredOrder" type="number" min="1" class="w-20 px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/[0.12] text-[13px]" />
            </label>
          </section>

          <!-- Image -->
          <section>
            <span class="flex items-center gap-1.5 text-xs font-semibold mb-1.5"><span class="text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center">1</span> รูปภาพ</span>
            <div class="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 items-start">
              <div class="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#F4F7F5] ring-1 ring-black/[0.06] flex items-center justify-center text-mutedSlate">
                <img v-if="imageOf(editing)" :src="imageOf(editing)!" class="w-full h-full object-cover" />
                <AdminIcon v-else name="image" :size="28" />
              </div>
              <div class="space-y-2.5">
                <div v-if="isSysadmin" class="flex flex-wrap gap-2">
                  <button type="button" class="px-3 py-1.5 rounded-lg ring-1 ring-black/[0.12] bg-white text-[13px] font-medium flex items-center gap-1.5 hover:bg-[#F7F9F8]" :disabled="uploading" @click="imgInput?.click()">
                    <AdminIcon name="upload" :size="14" /> {{ uploading ? 'กำลังอัปโหลด…' : 'อัปโหลดรูป' }}
                  </button>
                  <button v-if="imageOf(editing)" type="button" class="px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50" @click="removeImage">ลบรูป</button>
                </div>
                <input ref="imgInput" type="file" accept="image/*" class="hidden" @change="handleImage(($event.target as HTMLInputElement).files?.[0]); ($event.target as HTMLInputElement).value = ''" />
                <label class="block">
                  <span class="block text-[11px] text-mutedSlate mb-1">หรือใส่ลิงก์รูปภาพ</span>
                  <input v-model="editing.imageUrl" :class="inputCls" placeholder="https://..." @input="editing.image = null" />
                </label>
                <span class="block text-[11px] text-mutedSlate">แนะนำรูปแนวนอน 1200×750 px ไม่เกิน 5 MB</span>
              </div>
            </div>
          </section>

          <!-- Badges -->
          <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="block">
              <span class="flex items-center gap-1.5 text-xs font-semibold mb-1"><span class="text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center">2</span> หมวดหมู่ (ป้ายสีเขียว)</span>
              <input v-model="editing.tag" :class="inputCls" placeholder="เช่น Smart Registration" />
              <span class="block mt-1 text-[11px] text-mutedSlate">ใช้ที่มุมการ์ดในรายการผลิตภัณฑ์ทั้งหมดด้วย</span>
            </label>
            <label class="block">
              <span class="flex items-center gap-1.5 text-xs font-semibold mb-1"><span class="text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center">3</span> ป้ายสีเหลือง (รางวัล / จุดขาย)</span>
              <input v-model="editing.awardBadge" :class="inputCls" placeholder="เช่น 🎫 Event & Service Tech" />
            </label>
          </section>

          <!-- Title -->
          <label class="block">
            <span class="block text-xs font-semibold mb-1">ชื่อผลิตภัณฑ์ <span class="text-red-500">*</span></span>
            <input v-model="editing.title" required :class="inputCls" placeholder="เช่น i-Regist" />
            <span class="block mt-1 text-[11px] text-mutedSlate">ใช้เป็นชื่อปุ่มเลือกผลิตภัณฑ์เหนือสไลด์ และชื่อการ์ด</span>
          </label>

          <!-- Language content -->
          <section class="rounded-xl ring-1 ring-black/[0.06]">
            <div class="flex items-center gap-1 px-3 pt-3">
              <button type="button" class="px-3 py-1.5 rounded-lg text-[13px] font-medium" :class="lang === 'th' ? 'bg-forestBlack text-white' : 'text-mutedSlate'" @click="lang = 'th'">ภาษาไทย</button>
              <button type="button" class="px-3 py-1.5 rounded-lg text-[13px] font-medium" :class="lang === 'en' ? 'bg-forestBlack text-white' : 'text-mutedSlate'" @click="lang = 'en'">English</button>
            </div>
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="flex items-center gap-1.5 text-xs font-semibold mb-1"><span class="text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center">4</span> คำโปรย (ต่อท้ายชื่อในหัวข้อสไลด์)</span>
                <input v-model="editing[`subtitle_${lang}`]" :class="inputCls" placeholder="เช่น ระบบลงทะเบียนที่ตอบโจทย์ทุกการลงทะเบียน" />
              </label>
              <label class="block">
                <span class="flex items-center gap-1.5 text-xs font-semibold mb-1"><span class="text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center">5</span> รายละเอียด</span>
                <textarea v-model="editing[`description_${lang}`]" rows="4" :class="inputCls"></textarea>
              </label>
              <div>
                <span class="block text-xs font-semibold mb-1.5">จุดเด่น <span class="font-normal text-mutedSlate">(แสดงเมื่อกด "ดูรายละเอียด")</span></span>
                <div class="space-y-2">
                  <div v-for="(_, i) in editing[featureKey]" :key="i" class="flex items-center gap-2">
                    <span class="w-6 h-6 shrink-0 rounded-full bg-[#E8F8F2] text-[#00875A] flex items-center justify-center"><AdminIcon name="check" :size="13" /></span>
                    <input v-model="editing[featureKey][i]" :class="inputCls" />
                    <button v-if="isSysadmin" type="button" class="p-1.5 rounded-lg text-mutedSlate hover:text-red-600 hover:bg-red-50" @click="editing[featureKey].splice(i, 1)"><AdminIcon name="x" :size="15" /></button>
                  </div>
                  <button v-if="isSysadmin" type="button" class="text-[13px] font-medium text-[#00875A] hover:underline flex items-center gap-1" @click="editing[featureKey].push('')">
                    <AdminIcon name="plus" :size="14" /> เพิ่มจุดเด่น
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Icon -->
          <section>
            <span class="flex items-center gap-1.5 text-xs font-semibold mb-1.5"><span class="text-[9px] font-bold text-white bg-sky-600 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center">6</span> ไอคอน</span>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="ic in PRODUCT_ICON_TYPES" :key="ic.key" type="button" :title="ic.label"
                class="w-9 h-9 rounded-lg flex items-center justify-center ring-1 transition"
                :class="editing.iconType === ic.key ? 'bg-[#E8F8F2] ring-2 ring-[#00C978] text-[#00875A]' : 'bg-white ring-black/[0.1] text-mutedSlate hover:text-forestBlack'"
                @click="editing.iconType = ic.key"
              ><ProductIcon :type="ic.key" class="w-4 h-4" /></button>
            </div>
          </section>

          <!-- Tags -->
          <div>
            <span class="block text-xs font-semibold mb-1">แท็ก <span class="font-normal text-mutedSlate">(ใต้การ์ด และในหน้าต่างรายละเอียด)</span></span>
            <div class="flex flex-wrap items-center gap-1.5 p-2 rounded-lg ring-1 ring-black/[0.12] bg-white">
              <span v-for="(t, i) in editing.tags" :key="t" class="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md bg-[#E8F8F2] text-[#00875A] text-xs font-medium">
                {{ t }}
                <button v-if="isSysadmin" type="button" class="p-0.5 rounded hover:bg-white/60" @click="editing.tags.splice(i, 1)"><AdminIcon name="x" :size="11" /></button>
              </span>
              <input
                v-if="isSysadmin" v-model="newTag" class="flex-1 min-w-[120px] text-[13px] px-1 py-0.5 outline-none"
                placeholder="พิมพ์แล้วกด Enter" @keydown.enter.prevent="addTag" @blur="addTag"
              />
            </div>
          </div>

          <!-- Button links -->
          <section class="rounded-xl ring-1 ring-black/[0.06] p-4 space-y-3">
            <div>
              <h4 class="text-[13px] font-semibold">ลิงก์ปุ่มบนสไลด์</h4>
              <p class="text-xs text-mutedSlate">เว้นว่าง = ปุ่มทำงานแบบเดิม ("ดูรายละเอียด" เปิดหน้าต่างรายละเอียด, "ขอทดสอบระบบ" เปิดฟอร์มขอทดสอบ)</p>
            </div>
            <div v-if="!canEditLinks" class="px-3 py-2.5 rounded-lg bg-amber-50 text-amber-800 text-xs">
              ต้องอัปเดตระบบหลังบ้าน (Railway) ก่อน จึงจะตั้งลิงก์ปุ่มได้
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="block">
                <span class="block text-xs font-semibold mb-1">ปุ่ม "ดูรายละเอียด"</span>
                <input v-model="editing.detailUrl" :class="inputCls" placeholder="https://… (ไม่บังคับ)" />
              </label>
              <label class="block">
                <span class="block text-xs font-semibold mb-1">ปุ่ม "ขอทดสอบระบบ"</span>
                <input v-model="editing.demoUrl" :class="inputCls" placeholder="https://… (ไม่บังคับ)" />
              </label>
            </div>
          </section>
        </fieldset>
      </form>

      <template #footer>
        <div v-if="editing" class="flex items-center gap-2">
          <button v-if="isSysadmin && editing.documentId" type="button" class="px-3 py-2 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-1.5" @click="confirmDelete = true">
            <AdminIcon name="trash" :size="15" /> ลบ
          </button>
          <button type="button" class="ml-auto px-4 py-2 rounded-lg text-[13px] font-medium text-mutedSlate hover:bg-black/[0.04]" @click="editing = null">
            {{ isSysadmin ? 'ยกเลิก' : 'ปิด' }}
          </button>
          <button
            v-if="isSysadmin" type="submit" form="product-form" :disabled="saving"
            class="px-5 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] disabled:opacity-60 text-forestBlack text-[13px] font-semibold"
          >{{ saving ? 'กำลังบันทึก…' : editing.documentId ? 'บันทึกการแก้ไข' : 'เพิ่มผลิตภัณฑ์' }}</button>
        </div>
      </template>
    </AdminDrawer>

    <AdminConfirm
      :open="confirmDelete"
      title="ลบผลิตภัณฑ์นี้?"
      :message="`“${editing?.title || ''}” จะหายจากหน้าเว็บทันที และกู้คืนไม่ได้`"
      confirm-label="ลบถาวร"
      @cancel="confirmDelete = false"
      @confirm="doDelete"
    />
  </div>
</template>
