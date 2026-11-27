<script setup lang="ts">
import { JOB_STATUSES, timeAgo, formatDate, type JobStatus } from '~/composables/useAdminApi'

const props = defineProps<{ search: string }>()
const { jobs, spamJobs, isSysadmin, setJobStatus, deleteJob, setSpam, deleteSpamAll } = useAdminApi()
const showSpam = ref(false)
const confirmClearSpam = ref(false)
const spamRows = computed(() => spamJobs.value.filter(matches))
const toggleSpam = async (j: any, val: boolean) => {
  if (await setSpam(j, val)) selected.value = null
}
const doClearSpam = async () => {
  confirmClearSpam.value = false
  await deleteSpamAll()
}

const view = ref<'board' | 'list'>('board')
const statusFilter = ref<'all' | JobStatus>('all')
const selected = ref<any | null>(null)
const confirmDelete = ref(false)

const tone: Record<JobStatus, { dot: string; chip: string; col: string }> = {
  new: { dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 ring-amber-200', col: 'bg-amber-50/60' },
  contacted: { dot: 'bg-sky-500', chip: 'bg-sky-50 text-sky-700 ring-sky-200', col: 'bg-sky-50/60' },
  closed: { dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200', col: 'bg-emerald-50/60' }
}

const matches = (j: any) => {
  const q = props.search.trim().toLowerCase()
  if (!q) return true
  return [j.contactName, j.organization, j.email, j.phone, j.interestedProduct, j.subject]
    .some(v => (v || '').toLowerCase().includes(q))
}

const visible = computed(() => jobs.value.filter(matches))
const byStatus = (s: JobStatus) => visible.value.filter(j => (j.status || 'new') === s)
const listRows = computed(() =>
  statusFilter.value === 'all' ? visible.value : visible.value.filter(j => (j.status || 'new') === statusFilter.value)
)

const initials = (name = '') => name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
const statusLabel = (s: JobStatus) => JOB_STATUSES.find(x => x.key === s)?.label || s

// Drag & drop between board columns (sysadmin only)
const dragging = ref<any | null>(null)
const overCol = ref<JobStatus | null>(null)
const onDrop = (s: JobStatus) => {
  if (dragging.value) setJobStatus(dragging.value, s)
  dragging.value = null
  overCol.value = null
}

const doDelete = async () => {
  if (selected.value && (await deleteJob(selected.value))) selected.value = null
  confirmDelete.value = false
}
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2">
      <p v-if="showSpam" class="text-[13px] text-mutedSlate">ข้อความที่ระบบกรองไว้ ไม่นับรวมในงาน ตรวจดูแล้วกด “ไม่ใช่สแปม” ถ้าเป็นลูกค้าจริง</p>
      <div v-else-if="view === 'list'" class="flex flex-wrap gap-1.5">
        <button
          v-for="f in [{ key: 'all', label: 'ทั้งหมด' }, ...JOB_STATUSES]"
          :key="f.key"
          class="px-3 py-1.5 rounded-lg text-[13px] font-medium transition"
          :class="statusFilter === f.key ? 'bg-forestBlack text-white' : 'bg-white text-mutedSlate ring-1 ring-black/[0.06] hover:text-forestBlack'"
          @click="statusFilter = f.key as any"
        >
          {{ f.label }}
          <span class="ml-1 opacity-60">{{ f.key === 'all' ? visible.length : byStatus(f.key as JobStatus).length }}</span>
        </button>
      </div>
      <p v-else class="text-[13px] text-mutedSlate">
        <template v-if="isSysadmin">ลากการ์ดไปคอลัมน์อื่นเพื่อเปลี่ยนสถานะ หรือคลิกเพื่อดูรายละเอียด</template>
        <template v-else>คลิกการ์ดเพื่อดูรายละเอียด</template>
      </p>
      <button
        class="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium ring-1 transition"
        :class="showSpam ? 'bg-red-600 text-white ring-red-600' : 'bg-white text-mutedSlate ring-black/[0.06] hover:text-red-600'"
        :title="'ข้อความที่ระบบกรองว่าน่าจะเป็นสแปม'"
        @click="showSpam = !showSpam"
      >
        <AdminIcon name="lock" :size="14" /> สแปม
        <span class="opacity-70">{{ spamJobs.length }}</span>
      </button>
      <div v-if="!showSpam" class="inline-flex rounded-lg bg-white p-0.5 ring-1 ring-black/[0.06]">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium"
          :class="view === 'board' ? 'bg-[#E8F8F2] text-[#00875A]' : 'text-mutedSlate'"
          @click="view = 'board'"
        ><AdminIcon name="columns" :size="15" /> บอร์ด</button>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium"
          :class="view === 'list' ? 'bg-[#E8F8F2] text-[#00875A]' : 'text-mutedSlate'"
          @click="view = 'list'"
        ><AdminIcon name="list" :size="15" /> รายการ</button>
      </div>
    </div>

    <!-- Spam folder -->
    <div v-if="showSpam" class="bg-white rounded-2xl ring-1 ring-black/[0.06] overflow-hidden">
      <div class="flex items-center gap-2 px-5 py-3 border-b border-black/[0.06] bg-[#FFF8F8]">
        <span class="text-[13px] font-semibold text-red-700">กล่องสแปม</span>
        <span class="text-xs text-mutedSlate">{{ spamRows.length }} รายการ</span>
        <button v-if="isSysadmin && spamJobs.length" class="ml-auto px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-1" @click="confirmClearSpam = true">
          <AdminIcon name="trash" :size="14" /> ลบสแปมทั้งหมด
        </button>
      </div>
      <div v-for="j in spamRows" :key="j.documentId || j.id" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3.5 border-b border-black/[0.04] last:border-0">
        <button class="min-w-0 flex-1 text-left" @click="selected = j">
          <div class="text-sm font-semibold truncate">{{ j.contactName }} <span class="font-normal text-mutedSlate">· {{ j.email }}</span></div>
          <div class="text-xs text-mutedSlate truncate">{{ j.details || j.subject || '-' }}</div>
          <div v-if="j.spamReason" class="mt-1 text-[11px] text-red-600">เหตุผล: {{ j.spamReason }}</div>
        </button>
        <span class="text-[11px] text-mutedSlate whitespace-nowrap">{{ timeAgo(j.createdAt) }}</span>
        <button v-if="isSysadmin" class="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-[#E8F8F2] text-[#00875A] hover:bg-[#d6f3e8] whitespace-nowrap" @click="toggleSpam(j, false)">
          ไม่ใช่สแปม
        </button>
      </div>
      <div v-if="!spamRows.length" class="py-14 text-center text-sm text-mutedSlate">ไม่มีข้อความสแปม 🎉</div>
    </div>

    <!-- Board view -->
    <div v-else-if="view === 'board'" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <section
        v-for="col in JOB_STATUSES"
        :key="col.key"
        class="rounded-2xl p-3 transition min-h-[200px]"
        :class="[tone[col.key].col, overCol === col.key ? 'ring-2 ring-[#00C978]' : 'ring-1 ring-black/[0.04]']"
        @dragover.prevent="overCol = col.key"
        @dragleave="overCol = null"
        @drop="onDrop(col.key)"
      >
        <header class="flex items-center gap-2 px-1.5 pb-3">
          <span class="w-2 h-2 rounded-full" :class="tone[col.key].dot"></span>
          <h3 class="text-sm font-semibold text-forestBlack">{{ col.label }}</h3>
          <span class="text-xs text-mutedSlate">{{ byStatus(col.key).length }}</span>
          <span class="ml-auto text-[11px] text-mutedSlate">{{ col.hint }}</span>
        </header>

        <div class="space-y-2.5">
          <article
            v-for="j in byStatus(col.key)"
            :key="j.documentId || j.id"
            :draggable="isSysadmin"
            class="group bg-white rounded-xl p-3.5 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(9,20,14,0.04)] hover:shadow-md hover:ring-[#00C978]/40 transition cursor-pointer"
            @dragstart="dragging = j"
            @dragend="dragging = null; overCol = null"
            @click="selected = j"
          >
            <div class="flex items-start gap-2.5">
              <div class="w-8 h-8 shrink-0 rounded-full bg-[#09140E] text-[#00E588] text-[11px] font-bold flex items-center justify-center">
                {{ initials(j.contactName) }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-forestBlack truncate">{{ j.contactName }}</div>
                <div class="text-xs text-mutedSlate truncate">{{ j.organization }}</div>
              </div>
              <span class="text-[11px] text-mutedSlate whitespace-nowrap">{{ timeAgo(j.createdAt) }}</span>
            </div>
            <p v-if="j.subject || j.details" class="mt-2.5 text-[13px] text-obsidianInk/80 line-clamp-2">
              {{ j.subject || j.details }}
            </p>
            <div v-if="j.interestedProduct" class="mt-2.5">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4F7F5] text-[11px] font-medium text-obsidianInk/80">
                <AdminIcon name="box" :size="12" /> {{ j.interestedProduct }}
              </span>
            </div>
          </article>

          <div v-if="!byStatus(col.key).length" class="text-center text-xs text-mutedSlate py-8 border border-dashed border-black/10 rounded-xl">
            ไม่มีงานในคอลัมน์นี้
          </div>
        </div>
      </section>
    </div>

    <!-- List view -->
    <div v-else class="bg-white rounded-2xl ring-1 ring-black/[0.06] overflow-hidden">
      <div class="hidden md:grid grid-cols-[2fr_1.6fr_1.4fr_1fr_1fr] gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-mutedSlate border-b border-black/[0.06] bg-[#FAFBFA]">
        <div>ผู้ติดต่อ</div><div>สนใจ / เรื่อง</div><div>ช่องทาง</div><div>สถานะ</div><div class="text-right">รับเรื่อง</div>
      </div>
      <button
        v-for="j in listRows"
        :key="j.documentId || j.id"
        class="w-full text-left grid grid-cols-1 md:grid-cols-[2fr_1.6fr_1.4fr_1fr_1fr] gap-1 md:gap-4 px-5 py-3.5 border-b border-black/[0.04] last:border-0 hover:bg-[#F7FBF9] transition"
        @click="selected = j"
      >
        <div class="min-w-0">
          <div class="text-sm font-semibold truncate">{{ j.contactName }}</div>
          <div class="text-xs text-mutedSlate truncate">{{ j.organization }}</div>
        </div>
        <div class="text-[13px] text-obsidianInk/80 truncate self-center">{{ j.interestedProduct || j.subject || '-' }}</div>
        <div class="text-xs text-mutedSlate truncate self-center">{{ j.email }}<span v-if="j.phone"> · {{ j.phone }}</span></div>
        <div class="self-center">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ring-1" :class="tone[(j.status || 'new') as JobStatus].chip">
            <span class="w-1.5 h-1.5 rounded-full" :class="tone[(j.status || 'new') as JobStatus].dot"></span>
            {{ statusLabel(j.status || 'new') }}
          </span>
        </div>
        <div class="text-xs text-mutedSlate self-center md:text-right">{{ timeAgo(j.createdAt) }}</div>
      </button>
      <div v-if="!listRows.length" class="py-14 text-center text-sm text-mutedSlate">ไม่พบงานที่ตรงกับตัวกรอง</div>
    </div>

    <!-- Detail drawer -->
    <AdminDrawer :open="!!selected" :title="selected?.contactName" :subtitle="selected?.organization" @close="selected = null">
      <div v-if="selected" class="space-y-6">
        <div v-if="selected.isSpam" class="p-3 rounded-xl bg-red-50 ring-1 ring-red-200 text-[13px] text-red-700">
          <b>ระบบกรองว่าเป็นสแปม</b><span v-if="selected.spamReason"> · {{ selected.spamReason }}</span>
        </div>
        <!-- Status stepper -->
        <div>
          <div class="text-xs font-semibold text-mutedSlate mb-2">สถานะงาน</div>
          <div class="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#F4F7F5]">
            <button
              v-for="s in JOB_STATUSES"
              :key="s.key"
              :disabled="!isSysadmin"
              class="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-medium transition disabled:cursor-not-allowed"
              :class="(selected.status || 'new') === s.key ? 'bg-white shadow-sm text-forestBlack' : 'text-mutedSlate hover:text-forestBlack'"
              @click="setJobStatus(selected, s.key)"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="tone[s.key].dot"></span>{{ s.label }}
            </button>
          </div>
          <p v-if="!isSysadmin" class="mt-2 text-xs text-mutedSlate flex items-center gap-1"><AdminIcon name="lock" :size="12" /> บัญชี Editor ดูได้อย่างเดียว</p>
        </div>

        <!-- Contact -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a :href="`mailto:${selected.email}`" class="flex items-center gap-2.5 p-3 rounded-xl ring-1 ring-black/[0.06] hover:ring-[#00C978] transition">
            <span class="w-8 h-8 rounded-lg bg-[#E8F8F2] text-[#00875A] flex items-center justify-center"><AdminIcon name="mail" :size="16" /></span>
            <span class="min-w-0"><span class="block text-[11px] text-mutedSlate">อีเมล</span><span class="block text-[13px] font-medium truncate">{{ selected.email }}</span></span>
          </a>
          <a v-if="selected.phone" :href="`tel:${selected.phone}`" class="flex items-center gap-2.5 p-3 rounded-xl ring-1 ring-black/[0.06] hover:ring-[#00C978] transition">
            <span class="w-8 h-8 rounded-lg bg-[#E8F8F2] text-[#00875A] flex items-center justify-center"><AdminIcon name="phone" :size="16" /></span>
            <span class="min-w-0"><span class="block text-[11px] text-mutedSlate">โทร</span><span class="block text-[13px] font-medium truncate">{{ selected.phone }}</span></span>
          </a>
        </div>

        <dl class="grid grid-cols-[110px_1fr] gap-y-3 text-[13px]">
          <dt class="text-mutedSlate">หัวข้อ</dt><dd class="font-medium">{{ selected.subject || '-' }}</dd>
          <dt class="text-mutedSlate">สนใจผลิตภัณฑ์</dt><dd class="font-medium">{{ selected.interestedProduct || '-' }}</dd>
          <dt class="text-mutedSlate">รับเรื่องเมื่อ</dt><dd>{{ formatDate(selected.createdAt) }}</dd>
          <dt class="text-mutedSlate">อัปเดตล่าสุด</dt><dd>{{ formatDate(selected.updatedAt) }}</dd>
        </dl>

        <div>
          <div class="text-xs font-semibold text-mutedSlate mb-2">รายละเอียดจากลูกค้า</div>
          <div class="p-4 rounded-xl bg-[#F7F9F8] text-[13px] leading-relaxed whitespace-pre-line">{{ selected.details || 'ไม่มีรายละเอียดเพิ่มเติม' }}</div>
        </div>
      </div>

      <template #footer>
        <div v-if="selected" class="flex items-center gap-2">
          <button v-if="isSysadmin" class="px-3 py-2 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-1.5" @click="confirmDelete = true">
            <AdminIcon name="trash" :size="15" /> ลบงาน
          </button>
          <button v-if="isSysadmin" class="px-3 py-2 rounded-lg text-[13px] font-medium text-mutedSlate hover:bg-black/[0.04]" @click="toggleSpam(selected, !selected.isSpam)">
            {{ selected.isSpam ? 'ไม่ใช่สแปม' : 'เป็นสแปม' }}
          </button>
          <a :href="`mailto:${selected.email}?subject=${encodeURIComponent('IGENCO: ' + (selected.subject || selected.interestedProduct || 'ติดต่อกลับ'))}`"
             class="ml-auto px-4 py-2 rounded-lg bg-[#00C978] hover:bg-[#00B36B] text-forestBlack text-[13px] font-semibold flex items-center gap-1.5">
            <AdminIcon name="mail" :size="15" /> ตอบกลับทางอีเมล
          </a>
        </div>
      </template>
    </AdminDrawer>

    <AdminConfirm
      :open="confirmDelete"
      title="ลบงานนี้?"
      :message="`งานของ ${selected?.contactName || ''} จะถูกลบถาวร และกู้คืนไม่ได้`"
      confirm-label="ลบถาวร"
      @cancel="confirmDelete = false"
      @confirm="doDelete"
    />
    <AdminConfirm
      :open="confirmClearSpam"
      title="ลบสแปมทั้งหมด?"
      :message="`ข้อความสแปม ${spamJobs.length} รายการจะถูกลบถาวร`"
      confirm-label="ลบทั้งหมด"
      @cancel="confirmClearSpam = false"
      @confirm="doClearSpam"
    />
  </div>
</template>
