<script setup lang="ts">
useHead({ title: 'IGENCO Admin', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const {
  token, currentUser, isLoading, toast, isSysadmin, jobs, products, newsList,
  login, logout, restoreSession, loadAll
} = useAdminApi()

type Tab = 'overview' | 'jobs' | 'products' | 'news' | 'settings' | 'users'
const tab = ref<Tab>('overview')
const search = ref('')
const mobileNav = ref(false)
const booting = ref(true)

// ---------- Login ----------
const email = ref('')
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)
const showPassword = ref(false)
const submitLogin = async () => {
  loggingIn.value = true
  loginError.value = ''
  try {
    await login(email.value, password.value)
    tab.value = 'overview'
  } catch (e: any) {
    loginError.value = e?.data?.error?.message === 'Invalid identifier or password'
      ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      : e?.data?.error?.message || 'เข้าสู่ระบบไม่สำเร็จ ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์'
  } finally {
    loggingIn.value = false
  }
}

// Keep jobs fresh: on the overview/jobs tabs, reload when the browser tab
// regains focus and every 60s, so new contact-form submissions show up
// without a manual refresh. Edit tabs are skipped so unsaved edits stay.
let refreshTimer: ReturnType<typeof setInterval> | undefined
const refreshIfVisible = () => {
  if (!token.value || isLoading.value || document.visibilityState !== 'visible') return
  if (tab.value === 'overview' || tab.value === 'jobs') loadAll()
}

onMounted(async () => {
  await restoreSession()
  booting.value = false
  document.addEventListener('visibilitychange', refreshIfVisible)
  window.addEventListener('focus', refreshIfVisible)
  refreshTimer = setInterval(refreshIfVisible, 60_000)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', refreshIfVisible)
  window.removeEventListener('focus', refreshIfVisible)
  if (refreshTimer) clearInterval(refreshTimer)
})

// ---------- Navigation ----------
const newJobs = computed(() => jobs.value.filter(j => (j.status || 'new') === 'new').length)

const nav = computed(() => [
  { group: 'งานหลัก', items: [
    { key: 'overview', label: 'ภาพรวม', icon: 'home' },
    { key: 'jobs', label: 'งาน', icon: 'inbox', badge: newJobs.value },
    { key: 'products', label: 'ผลิตภัณฑ์', icon: 'box', count: products.value.length }
  ] },
  { group: 'เนื้อหาเว็บไซต์', items: [
    { key: 'news', label: 'ข่าวสาร', icon: 'news', count: newsList.value.length },
    { key: 'settings', label: 'ข้อมูลบริษัท', icon: 'building' },
    ...(isSysadmin.value ? [{ key: 'users', label: 'ทีมงาน', icon: 'users' }] : [])
  ] }
] as { group: string; items: { key: Tab; label: string; icon: string; badge?: number; count?: number }[] }[])

const pageMeta: Record<Tab, { title: string; desc: string; searchable?: boolean }> = {
  overview: { title: 'ภาพรวม', desc: 'สรุปงานและผลิตภัณฑ์ทั้งหมด' },
  jobs: { title: 'งาน', desc: 'คำขอใบเสนอราคาและนัด Demo จากหน้าเว็บ', searchable: true },
  products: { title: 'ผลิตภัณฑ์', desc: 'ผลิตภัณฑ์และบริการที่แสดงบนเว็บไซต์', searchable: true },
  news: { title: 'ข่าวสาร', desc: 'ข่าวและกิจกรรมบนหน้าเว็บ', searchable: true },
  settings: { title: 'ข้อมูลบริษัท', desc: 'ที่อยู่ เบอร์โทร และข้อความหน้าแรก' },
  users: { title: 'ทีมงาน', desc: 'บัญชีผู้ใช้และสิทธิ์การเข้าถึง' }
}

const go = (t: string) => {
  tab.value = t as Tab
  search.value = ''
  mobileNav.value = false
}

const doLogout = () => {
  logout()
  tab.value = 'overview'
}
</script>

<template>
  <div class="fixed inset-0 z-[60] overflow-hidden bg-[#F4F6F5] text-forestBlack font-thai antialiased">
    <!-- Toast -->
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-2" leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div
        v-if="toast"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-[150] px-4 py-2.5 rounded-xl shadow-lg text-[13px] font-medium flex items-center gap-2"
        :class="toast.kind === 'ok' ? 'bg-forestBlack text-white' : 'bg-red-600 text-white'"
      >
        <AdminIcon :name="toast.kind === 'ok' ? 'check' : 'x'" :size="15" :class="toast.kind === 'ok' && 'text-[#00E588]'" />
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- Boot -->
    <div v-if="booting" class="h-full flex items-center justify-center">
      <div class="w-8 h-8 rounded-full border-2 border-[#00C978] border-t-transparent animate-spin"></div>
    </div>

    <!-- ===================== LOGIN ===================== -->
    <div v-else-if="!token" class="h-full overflow-y-auto grid lg:grid-cols-2">
      <div class="hidden lg:flex flex-col justify-between p-12 bg-[#09140E] text-white relative overflow-hidden">
        <div class="absolute -right-32 -bottom-32 w-[480px] h-[480px] rounded-full bg-[#00C978]/20 blur-3xl"></div>
        <div class="flex items-center gap-2.5 relative">
          <div class="w-9 h-9 rounded-xl bg-[#00C978] flex items-center justify-center">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 3.5 19.5 7.8v8.4L12 20.5l-7.5-4.3V7.8z" stroke="#09140E" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.2" fill="#09140E"/></svg>
          </div>
          <span class="font-semibold tracking-wide">IGENCO Admin</span>
        </div>
        <div class="relative max-w-md">
          <h1 class="text-3xl font-semibold leading-tight">จัดการงานและผลิตภัณฑ์<br />ได้ในที่เดียว</h1>
          <p class="mt-3 text-white/60 text-sm leading-relaxed">ติดตามลูกค้าที่ติดต่อเข้ามาจากหน้าเว็บ อัปเดตผลิตภัณฑ์ และเลือกสิ่งที่จะขึ้นหน้าแรก โดยไม่ต้องเข้า Strapi</p>
        </div>
        <div class="relative text-xs text-white/40">© IGENCO Co., Ltd.</div>
      </div>

      <div class="flex items-center justify-center p-6">
        <form class="w-full max-w-sm" @submit.prevent="submitLogin">
          <div class="lg:hidden flex items-center gap-2.5 mb-8">
            <div class="w-9 h-9 rounded-xl bg-[#09140E] flex items-center justify-center">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 3.5 19.5 7.8v8.4L12 20.5l-7.5-4.3V7.8z" stroke="#00E588" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.2" fill="#00E588"/></svg>
            </div>
            <span class="font-semibold">IGENCO Admin</span>
          </div>
          <h2 class="text-2xl font-semibold">เข้าสู่ระบบ</h2>
          <p class="mt-1 text-[13px] text-mutedSlate">ใช้บัญชีทีมงาน IGENCO</p>

          <label class="block mt-8">
            <span class="block text-xs font-semibold mb-1.5">อีเมล</span>
            <input v-model="email" type="email" required autocomplete="username" placeholder="name@igenco.co.th"
              class="w-full px-3.5 py-2.5 rounded-lg bg-white ring-1 ring-black/[0.12] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C978]" />
          </label>
          <div class="mt-4">
            <label for="admin-password" class="block text-xs font-semibold mb-1.5">รหัสผ่าน</label>
            <div class="relative">
              <input id="admin-password" v-model="password" :type="showPassword ? 'text' : 'password'" required autocomplete="current-password"
                class="w-full pl-3.5 pr-11 py-2.5 rounded-lg bg-white ring-1 ring-black/[0.12] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C978]" />
              <button
                type="button"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-mutedSlate hover:text-forestBlack"
                :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                :title="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              ><AdminIcon :name="showPassword ? 'eye-off' : 'eye'" :size="18" /></button>
            </div>
          </div>
          <p v-if="loginError" class="mt-3 text-[13px] text-red-600">{{ loginError }}</p>
          <button type="submit" :disabled="loggingIn"
            class="mt-6 w-full py-2.5 rounded-lg bg-[#09140E] hover:bg-[#13241A] disabled:opacity-60 text-white text-sm font-semibold">
            {{ loggingIn ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ' }}
          </button>
          <NuxtLink to="/" class="block mt-6 text-center text-[13px] text-mutedSlate hover:text-[#00875A]">← กลับหน้าเว็บไซต์</NuxtLink>
        </form>
      </div>
    </div>

    <!-- ===================== APP ===================== -->
    <div v-else class="h-full flex">
      <!-- Sidebar -->
      <div v-if="mobileNav" class="lg:hidden fixed inset-0 z-[70] bg-black/30" @click="mobileNav = false"></div>
      <aside
        class="fixed lg:static inset-y-0 left-0 z-[75] w-64 shrink-0 bg-white border-r border-black/[0.06] flex flex-col transition-transform"
        :class="mobileNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <div class="h-16 flex items-center gap-2.5 px-5 border-b border-black/[0.06]">
          <div class="w-8 h-8 rounded-lg bg-[#09140E] flex items-center justify-center">
            <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none"><path d="M12 3.5 19.5 7.8v8.4L12 20.5l-7.5-4.3V7.8z" stroke="#00E588" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.2" fill="#00E588"/></svg>
          </div>
          <div class="leading-tight">
            <div class="text-sm font-semibold">IGENCO</div>
            <div class="text-[11px] text-mutedSlate">ระบบจัดการหลังบ้าน</div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div v-for="g in nav" :key="g.group">
            <div class="px-3 mb-1.5 text-[11px] font-semibold text-mutedSlate/80">{{ g.group }}</div>
            <button
              v-for="item in g.items"
              :key="item.key"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition"
              :class="tab === item.key ? 'bg-[#E8F8F2] text-[#006B47] font-semibold' : 'text-obsidianInk/75 hover:bg-[#F4F6F5] hover:text-forestBlack'"
              @click="go(item.key)"
            >
              <AdminIcon :name="item.icon" :size="18" />
              <span>{{ item.label }}</span>
              <span v-if="item.badge" class="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-white text-[11px] font-semibold flex items-center justify-center">{{ item.badge }}</span>
              <span v-else-if="item.count != null" class="ml-auto text-xs text-mutedSlate">{{ item.count }}</span>
            </button>
          </div>
        </nav>

        <div class="p-3 border-t border-black/[0.06]">
          <div class="flex items-center gap-2.5 p-2 rounded-lg">
            <div class="w-8 h-8 rounded-full bg-[#09140E] text-[#00E588] text-xs font-bold flex items-center justify-center">
              {{ (currentUser?.username || '?')[0].toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1 leading-tight">
              <div class="text-[13px] font-semibold truncate">{{ currentUser?.username }}</div>
              <div class="text-[11px] text-mutedSlate truncate">{{ isSysadmin ? 'Sysadmin · สิทธิ์เต็ม' : 'Editor' }}</div>
            </div>
            <button class="p-1.5 rounded-lg text-mutedSlate hover:bg-[#F4F6F5] hover:text-red-600" title="ออกจากระบบ" @click="doLogout"><AdminIcon name="logout" :size="17" /></button>
          </div>
          <a href="/" target="_blank" class="mt-1 flex items-center gap-2 px-2 py-1.5 text-xs text-mutedSlate hover:text-[#00875A]">
            <AdminIcon name="external" :size="14" /> เปิดหน้าเว็บไซต์
          </a>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 min-w-0 flex flex-col">
        <header class="h-16 shrink-0 flex items-center gap-3 px-4 sm:px-6 bg-white/80 backdrop-blur border-b border-black/[0.06]">
          <button class="lg:hidden p-2 -ml-2 rounded-lg text-mutedSlate hover:bg-[#F4F6F5]" aria-label="เมนู" @click="mobileNav = true"><AdminIcon name="menu" /></button>
          <div class="min-w-0">
            <h1 class="text-[17px] font-semibold leading-tight">{{ pageMeta[tab].title }}</h1>
            <p class="hidden sm:block text-xs text-mutedSlate truncate">{{ pageMeta[tab].desc }}</p>
          </div>
          <div v-if="pageMeta[tab].searchable" class="ml-auto relative w-full max-w-[280px]">
            <AdminIcon name="search" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-mutedSlate" />
            <input v-model="search" type="search" :placeholder="tab === 'jobs' ? 'ค้นหาชื่อ องค์กร อีเมล…' : 'ค้นหา…'"
              class="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F4F6F5] text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00C978]" />
          </div>
          <button
            class="p-2 rounded-lg text-mutedSlate hover:bg-[#F4F6F5] hover:text-forestBlack"
            :class="!pageMeta[tab].searchable && 'ml-auto'"
            title="โหลดข้อมูลใหม่"
            @click="loadAll"
          ><AdminIcon name="refresh" :size="18" :class="isLoading && 'animate-spin'" /></button>
        </header>

        <main class="flex-1 overflow-y-auto">
          <div class="max-w-[1400px] mx-auto p-4 sm:p-6">
            <div v-if="!isSysadmin && (tab === 'jobs' || tab === 'products')" class="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-800 text-[13px]">
              <AdminIcon name="lock" :size="15" /> บัญชี Editor ดูข้อมูลส่วนนี้ได้อย่างเดียว ถ้าต้องแก้ไขให้ใช้บัญชี Sysadmin
            </div>
            <AdminOverview v-if="tab === 'overview'" @go="go" />
            <AdminJobs v-else-if="tab === 'jobs'" :search="search" />
            <AdminProducts v-else-if="tab === 'products'" :search="search" />
            <AdminNews v-else-if="tab === 'news'" :search="search" />
            <AdminSettings v-else-if="tab === 'settings'" />
            <AdminUsers v-else-if="tab === 'users' && isSysadmin" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
