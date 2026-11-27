<script setup lang="ts">
import { JOB_STATUSES, timeAgo } from '~/composables/useAdminApi'

const emit = defineEmits<{ go: [tab: string] }>()
const { jobs, products, newsList, imageOf, currentUser } = useAdminApi()

const count = (s: string) => jobs.value.filter(j => (j.status || 'new') === s).length
const featured = computed(() =>
  products.value.filter(p => p.isFeatured).sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
)
const prodFilter = useState<'all' | 'featured'>('adm-prod-filter', () => 'featured')
const recentJobs = computed(() => jobs.value.slice(0, 6))
const thisWeek = computed(() => jobs.value.filter(j => Date.now() - new Date(j.createdAt).getTime() < 7 * 86400e3).length)

const greet = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'สวัสดีตอนเช้า' : h < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'
})

const dot: Record<string, string> = { new: 'bg-amber-500', contacted: 'bg-sky-500', closed: 'bg-emerald-500' }
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-forestBlack">{{ greet }}, {{ currentUser?.username }}</h2>
      <p class="text-[13px] text-mutedSlate">
        มีงานใหม่รอติดต่อกลับ <b class="text-forestBlack">{{ count('new') }}</b> งาน · สัปดาห์นี้มีคนติดต่อเข้ามา {{ thisWeek }} ราย
      </p>
    </div>

    <!-- KPI -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <button
        v-for="s in JOB_STATUSES" :key="s.key"
        class="text-left bg-white rounded-2xl p-4 ring-1 ring-black/[0.06] hover:ring-[#00C978]/50 transition"
        @click="emit('go', 'jobs')"
      >
        <div class="flex items-center gap-2 text-[13px] text-mutedSlate"><span class="w-2 h-2 rounded-full" :class="dot[s.key]"></span>{{ s.label }}</div>
        <div class="mt-2 text-3xl font-semibold text-forestBlack tabular-nums">{{ count(s.key) }}</div>
        <div class="text-xs text-mutedSlate">{{ s.hint }}</div>
      </button>
      <button class="text-left bg-[#09140E] rounded-2xl p-4 text-white hover:bg-[#13241A] transition" @click="emit('go', 'products')">
        <div class="flex items-center gap-2 text-[13px] text-white/60"><AdminIcon name="box" :size="14" /> ผลิตภัณฑ์</div>
        <div class="mt-2 text-3xl font-semibold tabular-nums">{{ products.length }}</div>
        <div class="text-xs text-[#00E588]">{{ featured.length }} รายการขึ้นไฮไลต์หน้าแรก</div>
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
      <!-- Recent jobs -->
      <section class="bg-white rounded-2xl ring-1 ring-black/[0.06]">
        <header class="flex items-center px-5 py-4 border-b border-black/[0.06]">
          <h3 class="text-sm font-semibold">งานล่าสุด</h3>
          <button class="ml-auto text-[13px] text-[#00875A] font-medium flex items-center gap-1 hover:underline" @click="emit('go', 'jobs')">ดูทั้งหมด <AdminIcon name="arrow" :size="14" /></button>
        </header>
        <ul>
          <li v-for="j in recentJobs" :key="j.documentId || j.id" class="flex items-center gap-3 px-5 py-3 border-b border-black/[0.04] last:border-0">
            <span class="w-2 h-2 rounded-full shrink-0" :class="dot[j.status || 'new']"></span>
            <div class="min-w-0 flex-1">
              <div class="text-[13px] font-medium truncate">{{ j.contactName }} <span class="text-mutedSlate font-normal">· {{ j.organization }}</span></div>
              <div class="text-xs text-mutedSlate truncate">{{ j.interestedProduct || j.subject || '-' }}</div>
            </div>
            <span class="text-xs text-mutedSlate whitespace-nowrap">{{ timeAgo(j.createdAt) }}</span>
          </li>
          <li v-if="!recentJobs.length" class="px-5 py-10 text-center text-sm text-mutedSlate">ยังไม่มีงานเข้ามา</li>
        </ul>
      </section>

      <!-- Featured products -->
      <section class="bg-white rounded-2xl ring-1 ring-black/[0.06]">
        <header class="flex items-center px-5 py-4 border-b border-black/[0.06]">
          <h3 class="text-sm font-semibold">สไลด์ไฮไลต์หน้าแรก</h3>
          <button class="ml-auto text-[13px] text-[#00875A] font-medium flex items-center gap-1 hover:underline" @click="prodFilter = 'featured'; emit('go', 'products')">จัดการ <AdminIcon name="arrow" :size="14" /></button>
        </header>
        <ol class="p-3 space-y-1">
          <li v-for="(p, i) in featured" :key="p.documentId || p.id" class="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F9F8]">
            <span class="w-6 text-center text-xs font-semibold text-mutedSlate">{{ i + 1 }}</span>
            <div class="w-12 h-9 rounded-lg overflow-hidden bg-[#F4F7F5] shrink-0">
              <img v-if="imageOf(p)" :src="imageOf(p)!" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
            </div>
            <div class="min-w-0">
              <div class="text-[13px] font-medium truncate">{{ p.title }}</div>
              <div class="text-xs text-mutedSlate truncate">{{ p.tag }}</div>
            </div>
          </li>
          <li v-if="!featured.length" class="px-2 py-8 text-center text-sm text-mutedSlate">ยังไม่มีผลิตภัณฑ์ไฮไลต์</li>
        </ol>
        <div class="px-5 py-3 border-t border-black/[0.06] text-xs text-mutedSlate">ข่าวสารบนเว็บ {{ newsList.length }} รายการ</div>
      </section>
    </div>
  </div>
</template>
