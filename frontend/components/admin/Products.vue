<script setup lang="ts">
const props = defineProps<{ search: string }>()
const { products, isSysadmin, imageOf, saveProduct, toggleFeatured, deleteProduct } = useAdminApi()

const view = ref<'grid' | 'table'>('grid')
const filter = ref<'all' | 'featured'>('all')
const editing = ref<any | null>(null)
const lang = ref<'th' | 'en'>('th')
const saving = ref(false)
const confirmDelete = ref(false)

const featuredCount = computed(() => products.value.filter(p => p.isFeatured).length)

const rows = computed(() => {
  const q = props.search.trim().toLowerCase()
  return products.value.filter(p => {
    if (filter.value === 'featured' && !p.isFeatured) return false
    if (!q) return true
    return [p.title, p.subtitle_th, p.subtitle_en, p.tag, ...(p.tags || [])].some(v => (v || '').toLowerCase().includes(q))
  })
})

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
    isFeatured: false, featuredOrder: 0, awardBadge: '', imageUrl: '', iconType: 'document-pen'
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
          class="px-3 py-1.5 rounded-lg text-[13px] font-medium transition"
          :class="filter === 'all' ? 'bg-forestBlack text-white' : 'bg-white text-mutedSlate ring-1 ring-black/[0.06]'"
          @click="filter = 'all'"
        >ทั้งหมด <span class="opacity-60">{{ products.length }}</span></button>
        <button
          class="px-3 py-1.5 rounded-lg text-[13px] font-medium transition flex items-center gap-1"
          :class="filter === 'featured' ? 'bg-forestBlack text-white' : 'bg-white text-mutedSlate ring-1 ring-black/[0.06]'"
          @click="filter = 'featured'"
        ><AdminIcon name="star" :size="13" /> ไฮไลต์หน้าแรก <span class="opacity-60">{{ featuredCount }}</span></button>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <div class="inline-flex rounded-lg bg-white p-0.5 ring-1 ring-black/[0.06]">
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

    <!-- Grid -->
    <div v-if="view === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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

    <div v-if="!rows.length" class="py-16 text-center text-sm text-mutedSlate bg-white rounded-2xl ring-1 ring-black/[0.06]">
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
        <fieldset :disabled="!isSysadmin" class="space-y-6">
          <!-- Image -->
          <section class="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4">
            <div class="aspect-[16/10] rounded-xl overflow-hidden bg-[#F4F7F5] ring-1 ring-black/[0.06] flex items-center justify-center text-mutedSlate">
              <img v-if="imageOf(editing)" :src="imageOf(editing)!" class="w-full h-full object-cover" />
              <AdminIcon v-else name="image" :size="28" />
            </div>
            <div class="space-y-3">
              <label class="block">
                <span class="block text-xs font-semibold mb-1">ชื่อผลิตภัณฑ์ <span class="text-red-500">*</span></span>
                <input v-model="editing.title" required :class="inputCls" placeholder="เช่น i-SMARTFLOW" />
              </label>
              <label class="block">
                <span class="block text-xs font-semibold mb-1">ลิงก์รูปภาพ</span>
                <input v-model="editing.imageUrl" :class="inputCls" placeholder="https://..." />
                <span v-if="editing.image?.url" class="block mt-1 text-[11px] text-mutedSlate">มีรูปที่อัปโหลดใน Strapi อยู่แล้ว ระบบจะใช้รูปนั้นก่อน</span>
              </label>
            </div>
          </section>

          <!-- Category & tags -->
          <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="block">
              <span class="block text-xs font-semibold mb-1">หมวดหมู่ (ป้ายหลัก)</span>
              <input v-model="editing.tag" :class="inputCls" placeholder="เช่น HR & Payroll Cloud" />
            </label>
            <label class="block">
              <span class="block text-xs font-semibold mb-1">ป้ายรางวัล / การรับรอง</span>
              <input v-model="editing.awardBadge" :class="inputCls" placeholder="เช่น 🏆 The Winner OIIO" />
            </label>
            <div class="sm:col-span-2">
              <span class="block text-xs font-semibold mb-1">แท็ก</span>
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
          </section>

          <!-- Language content -->
          <section class="rounded-xl ring-1 ring-black/[0.06]">
            <div class="flex items-center gap-1 px-3 pt-3">
              <button type="button" class="px-3 py-1.5 rounded-lg text-[13px] font-medium" :class="lang === 'th' ? 'bg-forestBlack text-white' : 'text-mutedSlate'" @click="lang = 'th'">ภาษาไทย</button>
              <button type="button" class="px-3 py-1.5 rounded-lg text-[13px] font-medium" :class="lang === 'en' ? 'bg-forestBlack text-white' : 'text-mutedSlate'" @click="lang = 'en'">English</button>
            </div>
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="block text-xs font-semibold mb-1">คำโปรย</span>
                <input v-model="editing[`subtitle_${lang}`]" :class="inputCls" />
              </label>
              <label class="block">
                <span class="block text-xs font-semibold mb-1">รายละเอียด</span>
                <textarea v-model="editing[`description_${lang}`]" rows="4" :class="inputCls"></textarea>
              </label>
              <div>
                <span class="block text-xs font-semibold mb-1.5">จุดเด่น</span>
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

          <!-- Featured -->
          <section class="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-[#F7F9F8]">
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="editing.isFeatured" type="checkbox" class="sr-only peer" />
              <span class="relative inline-flex h-6 w-11 rounded-full bg-black/15 peer-checked:bg-[#00C978] transition after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:left-[22px]"></span>
              <span>
                <span class="block text-[13px] font-semibold">แสดงในสไลด์ไฮไลต์หน้าแรก</span>
                <span class="block text-xs text-mutedSlate">ผลิตภัณฑ์เด่นที่ขึ้นสไลด์ด้านบนของเว็บ</span>
              </span>
            </label>
            <label v-if="editing.isFeatured" class="ml-auto flex items-center gap-2 text-[13px]">
              ลำดับ
              <input v-model.number="editing.featuredOrder" type="number" min="0" class="w-20 px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/[0.12] text-[13px]" />
            </label>
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
