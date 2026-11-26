<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'

// Auth State
const token = ref<string | null>(null)
const currentUser = ref<any | null>(null)
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')
const isLoggingIn = ref(false)

// Navigation & UI State
type TabType = 'tasks' | 'products' | 'news' | 'settings' | 'users'
const activeTab = ref<TabType>('tasks')
const isLoading = ref(false)
const toastMessage = ref('')

// Data States
const inquiries = ref<any[]>([])
const products = ref<any[]>([])
const newsList = ref<any[]>([])
const siteSetting = ref<any>({})
const usersList = ref<any[]>([])
const rolesList = ref<any[]>([])

// Filters
const taskFilter = ref<'all' | 'new' | 'contacted' | 'closed'>('all')
const productSearch = ref('')
const productFilter = ref<'all' | 'featured'>('all')

// Modals
const editingProduct = ref<any | null>(null)
const editingNews = ref<any | null>(null)
const isCreatingNews = ref(false)
const newUserForm = ref({ username: '', email: '', password: '', roleType: 'editor' })

const isSysadmin = computed(() => {
  const roleType = currentUser.value?.role?.type?.toLowerCase() || ''
  const roleName = currentUser.value?.role?.name?.toLowerCase() || ''
  return roleType === 'sysadmin' || roleName.includes('sysadmin') || roleName.includes('admin')
})

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const authHeaders = () => ({
  Authorization: `Bearer ${token.value}`,
  'Content-Type': 'application/json'
})

// Login Handler
const handleLogin = async (email?: string, password?: string) => {
  isLoggingIn.value = true
  loginError.value = ''
  try {
    const res: any = await $fetch(`${strapiUrl}/api/auth/local`, {
      method: 'POST',
      body: {
        identifier: email || loginEmail.value,
        password: password || loginPassword.value
      }
    })
    token.value = res.jwt
    try { localStorage.setItem('igenco_admin_jwt', res.jwt) } catch {}
    await fetchCurrentUser()
    await loadAllData()
  } catch (err: any) {
    loginError.value = err?.data?.error?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    isLoggingIn.value = false
  }
}

const logout = () => {
  token.value = null
  currentUser.value = null
  try { localStorage.removeItem('igenco_admin_jwt') } catch {}
}

const fetchCurrentUser = async () => {
  if (!token.value) return
  try {
    const me: any = await $fetch(`${strapiUrl}/api/users/me?populate=role`, {
      headers: authHeaders()
    })
    currentUser.value = me
    if (!isSysadmin.value && activeTab.value === 'users') {
      activeTab.value = 'tasks'
    }
  } catch {
    logout()
  }
}

const loadAllData = async () => {
  if (!token.value) return
  isLoading.value = true
  try {
    const [inqRes, prodRes, newsRes, siteRes]: any = await Promise.all([
      $fetch(`${strapiUrl}/api/contact-inquiries?sort=createdAt:desc`, { headers: authHeaders() }).catch(() => ({ data: [] })),
      $fetch(`${strapiUrl}/api/products?sort=featuredOrder:asc,id:asc`, { headers: authHeaders() }).catch(() => ({ data: [] })),
      $fetch(`${strapiUrl}/api/news-articles?sort=id:desc`, { headers: authHeaders() }).catch(() => ({ data: [] })),
      $fetch(`${strapiUrl}/api/site-setting`, { headers: authHeaders() }).catch(() => ({ data: {} }))
    ])
    inquiries.value = inqRes?.data || []
    products.value = prodRes?.data || []
    newsList.value = newsRes?.data || []
    siteSetting.value = siteRes?.data || {}

    if (isSysadmin.value) {
      const [uRes, rRes]: any = await Promise.all([
        $fetch(`${strapiUrl}/api/users?populate=role`, { headers: authHeaders() }).catch(() => []),
        $fetch(`${strapiUrl}/api/users-permissions/roles`, { headers: authHeaders() }).catch(() => ({ roles: [] }))
      ])
      usersList.value = Array.isArray(uRes) ? uRes : []
      rolesList.value = rRes?.roles || []
    }
  } finally {
    isLoading.value = false
  }
}

// Computed Lists & Stats
const newTasksCount = computed(() => inquiries.value.filter(i => i.status === 'new').length)
const featuredProductsCount = computed(() => products.value.filter(p => p.isFeatured).length)

const filteredInquiries = computed(() => {
  if (taskFilter.value === 'all') return inquiries.value
  return inquiries.value.filter(i => i.status === taskFilter.value)
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchFeatured = productFilter.value === 'all' || p.isFeatured
    const q = productSearch.value.trim().toLowerCase()
    const matchSearch = !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.subtitle_th || '').toLowerCase().includes(q) ||
      (p.tag || '').toLowerCase().includes(q)
    return matchFeatured && matchSearch
  })
})

// Actions: Tasks (Contact Inquiries)
const updateTaskStatus = async (item: any, newStatus: 'new' | 'contacted' | 'closed') => {
  if (!isSysadmin.value) return
  try {
    await $fetch(`${strapiUrl}/api/contact-inquiries/${item.documentId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: { data: { status: newStatus } }
    })
    item.status = newStatus
    showToast(`อัปเดตสถานะงานของ ${item.contactName} เป็น "${newStatus}" แล้ว`)
  } catch {
    showToast('เกิดข้อผิดพลาดในการอัปเดตสถานะ')
  }
}

// Actions: Products
const toggleProductFeatured = async (prod: any) => {
  if (!isSysadmin.value) return
  const nextVal = !prod.isFeatured
  try {
    await $fetch(`${strapiUrl}/api/products/${prod.documentId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: { data: { isFeatured: nextVal } }
    })
    prod.isFeatured = nextVal
    showToast(nextVal ? `เพิ่ม "${prod.title}" เข้าสไลด์ไฮไลต์แล้ว` : `นำ "${prod.title}" ออกจากสไลด์ไฮไลต์แล้ว`)
  } catch {
    showToast('อัปเดตไม่สำเร็จ')
  }
}

const saveProductEdit = async () => {
  if (!editingProduct.value || !isSysadmin.value) return
  const p = editingProduct.value
  try {
    await $fetch(`${strapiUrl}/api/products/${p.documentId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: {
        data: {
          title: p.title,
          subtitle_th: p.subtitle_th,
          subtitle_en: p.subtitle_en,
          description_th: p.description_th,
          description_en: p.description_en,
          tag: p.tag,
          isFeatured: p.isFeatured,
          featuredOrder: Number(p.featuredOrder) || 0,
          awardBadge: p.awardBadge
        }
      }
    })
    editingProduct.value = null
    await loadAllData()
    showToast('บันทึกข้อมูลผลิตภัณฑ์เรียบร้อยแล้ว')
  } catch {
    showToast('บันทึกข้อมูลไม่สำเร็จ')
  }
}

// Actions: News
const openNewArticleModal = () => {
  isCreatingNews.value = true
  editingNews.value = {
    title_th: '',
    title_en: '',
    subtitle_th: '',
    subtitle_en: '',
    body_th: '',
    body_en: '',
    category: 'Enterprise Software',
    tag: 'Enterprise Software',
    date_th: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
    date_en: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

const saveNewsEdit = async () => {
  if (!editingNews.value) return
  const n = editingNews.value
  const payload = {
    title_th: n.title_th,
    title_en: n.title_en || n.title_th,
    subtitle_th: n.subtitle_th,
    subtitle_en: n.subtitle_en || n.subtitle_th,
    body_th: n.body_th,
    body_en: n.body_en || n.body_th,
    category: n.category,
    tag: n.tag || n.category,
    date_th: n.date_th,
    date_en: n.date_en || n.date_th
  }
  try {
    if (isCreatingNews.value) {
      await $fetch(`${strapiUrl}/api/news-articles`, {
        method: 'POST',
        headers: authHeaders(),
        body: { data: payload }
      })
      showToast('เพิ่มข่าวสารใหม่ขึ้นหน้าเว็บแล้ว')
    } else {
      await $fetch(`${strapiUrl}/api/news-articles/${n.documentId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: { data: payload }
      })
      showToast('อัปเดตข่าวสารเรียบร้อยแล้ว')
    }
    editingNews.value = null
    isCreatingNews.value = false
    await loadAllData()
  } catch {
    showToast('บันทึกข่าวไม่สำเร็จ')
  }
}

// Actions: Site Setting
const saveSiteSetting = async () => {
  try {
    const s = siteSetting.value
    await $fetch(`${strapiUrl}/api/site-setting`, {
      method: 'PUT',
      headers: authHeaders(),
      body: {
        data: {
          hero_badge: s.hero_badge,
          hero_title_th: s.hero_title_th,
          hero_title_en: s.hero_title_en,
          hero_subtitle_th: s.hero_subtitle_th,
          hero_subtitle_en: s.hero_subtitle_en,
          company_name_th: s.company_name_th,
          company_name_en: s.company_name_en,
          address_th: s.address_th,
          address_en: s.address_en,
          phone: s.phone,
          email: s.email,
          officeHours_th: s.officeHours_th,
          officeHours_en: s.officeHours_en
        }
      }
    })
    showToast('บันทึกข้อมูลบริษัท & หน้าแรกเรียบร้อยแล้ว')
  } catch {
    showToast('บันทึกข้อมูลไม่สำเร็จ')
  }
}

// Actions: Users & Roles (Sysadmin only)
const createNewUser = async () => {
  if (!isSysadmin.value) return
  const targetRole = rolesList.value.find((r: any) => r.type === newUserForm.value.roleType)
  if (!targetRole) return showToast('ไม่พบ Role ที่เลือก')
  try {
    await $fetch(`${strapiUrl}/api/users`, {
      method: 'POST',
      headers: authHeaders(),
      body: {
        username: newUserForm.value.username,
        email: newUserForm.value.email,
        password: newUserForm.value.password,
        role: targetRole.id,
        confirmed: true
      }
    })
    newUserForm.value = { username: '', email: '', password: '', roleType: 'editor' }
    await loadAllData()
    showToast('สร้างบัญชีและมอบยศให้ทีมงานเรียบร้อยแล้ว')
  } catch (err: any) {
    showToast(err?.data?.error?.message || 'ไม่สามารถสร้างบัญชีได้ (อีเมลหรือชื่อผู้ใช้อาจซ้ำ)')
  }
}

const changeUserRole = async (user: any, roleType: 'sysadmin' | 'editor') => {
  if (!isSysadmin.value) return
  const targetRole = rolesList.value.find((r: any) => r.type === roleType)
  if (!targetRole) return
  try {
    await $fetch(`${strapiUrl}/api/users/${user.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: { role: targetRole.id }
    })
    await loadAllData()
    showToast(`เปลี่ยนยศของ ${user.username} เป็น ${roleType.toUpperCase()} แล้ว`)
  } catch {
    showToast('เปลี่ยนยศไม่สำเร็จ')
  }
}

onMounted(async () => {
  try {
    const savedJwt = localStorage.getItem('igenco_admin_jwt')
    if (savedJwt) {
      token.value = savedJwt
      await fetchCurrentUser()
      await loadAllData()
    }
  } catch {}
})
</script>

<template>
  <div class="min-h-screen bg-[#F4F7F5] text-forestBlack relative z-10">

    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl bg-[#09140E] text-white text-xs font-semibold shadow-2xl border border-[#00C978]/40 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3"
    >
      <span class="w-2 h-2 rounded-full bg-[#00C978] animate-ping"></span>
      <span>{{ toastMessage }}</span>
    </div>

    <!-- ==================================================================== -->
    <!-- 1. LOGIN VIEW (เมื่อยังไม่ได้เข้าสู่ระบบ)                             -->
    <!-- ==================================================================== -->
    <div v-if="!token" class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F7F9F8] via-white to-[#E8F8F2]">
      <div class="w-full max-w-md bg-white rounded-[32px] p-8 border border-forestBlack/10 shadow-[0_20px_60px_rgba(9,20,14,0.08)]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-[#09140E] flex items-center justify-center border border-[#00C978]/40">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M12 3.5L19.5 7.8V16.2L12 20.5L4.5 16.2V7.8L12 3.5Z" stroke="#00E588" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="2.2" fill="#00E588"/>
            </svg>
          </div>
          <div>
            <div class="font-black text-base tracking-wide text-forestBlack">IGENCO <span class="text-[#00A86B]">ADMIN</span></div>
            <div class="text-[11px] text-mutedSlate">ระบบจัดการงาน ผลิตภัณฑ์ และเนื้อหาเว็บไซต์</div>
          </div>
        </div>

        <form @submit.prevent="handleLogin()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-forestBlack mb-1.5">อีเมลผู้ใช้งาน (Email)</label>
            <input
              v-model="loginEmail"
              type="email"
              required
              placeholder="sysadmin@igenco.co.th"
              class="w-full px-4 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-sm focus:outline-none focus:border-[#00C978]"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-forestBlack mb-1.5">รหัสผ่าน (Password)</label>
            <input
              v-model="loginPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-sm focus:outline-none focus:border-[#00C978]"
            />
          </div>

          <div v-if="loginError" class="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
            {{ loginError }}
          </div>

          <button
            type="submit"
            :disabled="isLoggingIn"
            class="w-full py-3 rounded-xl bg-[#09140E] hover:bg-[#00C978] text-white hover:text-forestBlack font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {{ isLoggingIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบหลังบ้าน' }}
          </button>
        </form>

        <!-- Quick Demo Login Switcher -->
        <div class="mt-6 pt-5 border-t border-forestBlack/10">
          <div class="text-[11px] font-mono text-mutedSlate text-center mb-3 uppercase tracking-wider">
            เข้าสู่ระบบทดสอบ 2 Roles ทันที
          </div>
          <div class="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              @click="handleLogin('sysadmin@igenco.co.th', 'Igenco@2026')"
              class="p-2.5 rounded-xl bg-[#E8F8F2] hover:bg-[#00C978]/25 border border-[#00C978]/40 text-left transition-all cursor-pointer"
            >
              <div class="text-xs font-bold text-[#00875A]">🛡️ Sysadmin</div>
              <div class="text-[10px] text-mutedSlate mt-0.5">สิทธิ์เต็ม + มอบยศ</div>
            </button>
            <button
              type="button"
              @click="handleLogin('editor@igenco.co.th', 'Editor@2026')"
              class="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-left transition-all cursor-pointer"
            >
              <div class="text-xs font-bold text-sky-700">✏️ Editor</div>
              <div class="text-[10px] text-mutedSlate mt-0.5">อัปเดตข่าว & ข้อมูล</div>
            </button>
          </div>
        </div>

        <div class="mt-5 text-center">
          <NuxtLink to="/" class="text-xs text-mutedSlate hover:text-[#00875A] underline">
            ← กลับหน้าเว็บไซต์หลัก
          </NuxtLink>
        </div>

      </div>
    </div>

    <!-- ==================================================================== -->
    <!-- 2. MAIN ADMIN DASHBOARD WORKSPACE                                    -->
    <!-- ==================================================================== -->
    <div v-else class="flex min-h-screen">
      
      <!-- Left Sidebar -->
      <aside class="w-64 lg:w-72 bg-[#09140E] text-white flex flex-col justify-between p-5 shrink-0 border-r border-white/10">
        <div>
          <!-- Brand Header -->
          <div class="flex items-center gap-2.5 px-2 pb-6 border-b border-white/10">
            <div class="w-9 h-9 rounded-xl bg-[#051A12] border border-[#00C978]/40 flex items-center justify-center">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 3.5L19.5 7.8V16.2L12 20.5L4.5 16.2V7.8L12 3.5Z" stroke="#00E588" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="2.2" fill="#00E588"/>
              </svg>
            </div>
            <div>
              <div class="font-black text-sm tracking-wider">IGENCO <span class="text-[#00E588]">WORKSPACE</span></div>
              <div class="text-[10px] text-neutral-400 font-mono">PostgreSQL + Strapi API</div>
            </div>
          </div>

          <!-- Logged-in User Pill -->
          <div class="my-5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-xs font-bold text-white truncate">{{ currentUser?.username }}</span>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase"
                :class="isSysadmin ? 'bg-[#00C978]/20 text-[#00E588] border border-[#00C978]/40' : 'bg-sky-500/20 text-sky-300 border border-sky-400/40'"
              >
                {{ isSysadmin ? 'SYSADMIN' : 'EDITOR' }}
              </span>
            </div>
            <div class="text-[11px] text-neutral-400 truncate">{{ currentUser?.email }}</div>
          </div>

          <!-- Navigation Menu -->
          <nav class="space-y-1.5 text-xs font-medium">
            <button
              @click="activeTab = 'tasks'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              :class="activeTab === 'tasks' ? 'bg-[#00C978] text-forestBlack font-bold shadow-md' : 'text-neutral-300 hover:bg-white/10'"
            >
              <span class="flex items-center gap-2.5">
                <span>📋</span>
                <span>งาน & กล่องข้อความ</span>
              </span>
              <span
                v-if="newTasksCount > 0"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="activeTab === 'tasks' ? 'bg-forestBlack text-[#00E588]' : 'bg-[#00C978] text-forestBlack'"
              >
                {{ newTasksCount }} ใหม่
              </span>
            </button>

            <button
              @click="activeTab = 'products'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              :class="activeTab === 'products' ? 'bg-[#00C978] text-forestBlack font-bold shadow-md' : 'text-neutral-300 hover:bg-white/10'"
            >
              <span class="flex items-center gap-2.5">
                <span>📦</span>
                <span>ผลิตภัณฑ์และบริการ</span>
              </span>
              <span class="text-[10px] opacity-75 font-mono">{{ products.length }}</span>
            </button>

            <button
              @click="activeTab = 'news'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              :class="activeTab === 'news' ? 'bg-[#00C978] text-forestBlack font-bold shadow-md' : 'text-neutral-300 hover:bg-white/10'"
            >
              <span class="flex items-center gap-2.5">
                <span>📰</span>
                <span>ข่าวสารและกิจกรรม</span>
              </span>
              <span class="text-[10px] opacity-75 font-mono">{{ newsList.length }}</span>
            </button>

            <button
              @click="activeTab = 'settings'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              :class="activeTab === 'settings' ? 'bg-[#00C978] text-forestBlack font-bold shadow-md' : 'text-neutral-300 hover:bg-white/10'"
            >
              <span class="flex items-center gap-2.5">
                <span>🏢</span>
                <span>ข้อมูลบริษัท & หน้าแรก</span>
              </span>
            </button>

            <button
              v-if="isSysadmin"
              @click="activeTab = 'users'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              :class="activeTab === 'users' ? 'bg-[#00C978] text-forestBlack font-bold shadow-md' : 'text-neutral-300 hover:bg-white/10'"
            >
              <span class="flex items-center gap-2.5">
                <span>👥</span>
                <span>จัดการทีมงาน & มอบยศ</span>
              </span>
            </button>
          </nav>
        </div>

        <!-- Bottom Actions -->
        <div class="pt-5 border-t border-white/10 space-y-2 text-xs">
          <NuxtLink
            to="/"
            class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 transition-colors"
          >
            <span>🌐 ดูหน้าเว็บจริง</span>
            <span>↗</span>
          </NuxtLink>
          <button
            @click="logout"
            class="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 font-semibold transition-colors cursor-pointer"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        
        <!-- Top Header & KPI Cards -->
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-forestBlack">
                <span v-if="activeTab === 'tasks'">📋 งานติดตามลูกค้า & นัดสาธิตระบบ</span>
                <span v-else-if="activeTab === 'products'">📦 จัดการผลิตภัณฑ์และไฮไลต์</span>
                <span v-else-if="activeTab === 'news'">📰 จัดการข่าวสารและกิจกรรมองค์กร</span>
                <span v-else-if="activeTab === 'settings'">🏢 ข้อมูลเบื้องต้นบริษัท & หน้าแรก</span>
                <span v-else>👥 จัดการบัญชีทีมงาน & มอบยศ (Sysadmin)</span>
              </h1>
              <p class="text-xs sm:text-sm text-mutedSlate mt-1">
                เชื่อมต่อฐานข้อมูล PostgreSQL ผ่าน Strapi API แบบเรียลไทม์
              </p>
            </div>

            <button
              @click="loadAllData"
              class="px-4 py-2 rounded-full bg-white hover:bg-forestBlack/5 border border-forestBlack/15 text-xs font-semibold flex items-center gap-2 shadow-2xs cursor-pointer self-start"
            >
              <span>🔄 รีเฟรชข้อมูล</span>
            </button>
          </div>

          <!-- 4 KPI Summary Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-2xl p-4 sm:p-5 border border-forestBlack/[0.08] shadow-2xs">
              <div class="text-[11px] font-mono text-mutedSlate uppercase">งานใหม่รอดำเนินการ</div>
              <div class="text-2xl sm:text-3xl font-black text-[#00875A] mt-1">{{ newTasksCount }}</div>
              <div class="text-[11px] text-mutedSlate mt-1">จากลูกค้าติดต่อหน้าเว็บ</div>
            </div>
            <div class="bg-white rounded-2xl p-4 sm:p-5 border border-forestBlack/[0.08] shadow-2xs">
              <div class="text-[11px] font-mono text-mutedSlate uppercase">งานติดต่อทั้งหมด</div>
              <div class="text-2xl sm:text-3xl font-black text-forestBlack mt-1">{{ inquiries.length }}</div>
              <div class="text-[11px] text-mutedSlate mt-1">บันทึกใน PostgreSQL</div>
            </div>
            <div class="bg-white rounded-2xl p-4 sm:p-5 border border-forestBlack/[0.08] shadow-2xs">
              <div class="text-[11px] font-mono text-mutedSlate uppercase">ผลิตภัณฑ์ทั้งหมด</div>
              <div class="text-2xl sm:text-3xl font-black text-forestBlack mt-1">{{ products.length }}</div>
              <div class="text-[11px] text-[#0284C7] font-semibold mt-1">⭐ ไฮไลต์ {{ featuredProductsCount }} รายการ</div>
            </div>
            <div class="bg-white rounded-2xl p-4 sm:p-5 border border-forestBlack/[0.08] shadow-2xs">
              <div class="text-[11px] font-mono text-mutedSlate uppercase">ข่าวสารที่เผยแพร่</div>
              <div class="text-2xl sm:text-3xl font-black text-forestBlack mt-1">{{ newsList.length }}</div>
              <div class="text-[11px] text-mutedSlate mt-1">อัปเดตได้ทั้ง TH / EN</div>
            </div>
          </div>

          <!-- ================================================================ -->
          <!-- TAB 1: TASKS & INBOX (ดูงานและรายการติดต่อ)                     -->
          <!-- ================================================================ -->
          <div v-if="activeTab === 'tasks'" class="space-y-5">
            <!-- Status Filter Pills -->
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="f in [
                  { k: 'all', l: 'ทั้งหมด' },
                  { k: 'new', l: '🆕 งานใหม่ (New)' },
                  { k: 'contacted', l: '📞 ติดต่อแล้ว (Contacted)' },
                  { k: 'closed', l: '✅ ปิดงาน (Closed)' }
                ]"
                :key="f.k"
                @click="taskFilter = f.k as any"
                class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                :class="taskFilter === f.k ? 'bg-[#09140E] text-white' : 'bg-white text-mutedSlate border border-forestBlack/10 hover:bg-forestBlack/5'"
              >
                {{ f.l }}
              </button>
            </div>

            <!-- Tasks List -->
            <div v-if="filteredInquiries.length === 0" class="bg-white rounded-3xl p-12 text-center border border-forestBlack/10">
              <div class="text-3xl mb-2">📭</div>
              <div class="font-bold text-forestBlack">ยังไม่มีรายการติดต่อในหมวดนี้</div>
              <p class="text-xs text-mutedSlate mt-1">เมื่อลูกค้ากรอกแบบฟอร์มติดต่อหรือนัด Demo หน้าเว็บ ข้อมูลจะแสดงที่นี่ทันที</p>
            </div>

            <div v-else class="grid grid-cols-1 gap-4">
              <div
                v-for="item in filteredInquiries"
                :key="item.id"
                class="bg-white rounded-2xl p-5 sm:p-6 border border-forestBlack/[0.08] shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div class="space-y-1.5">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase"
                      :class="{
                        'bg-emerald-100 text-emerald-800': item.status === 'new',
                        'bg-sky-100 text-sky-800': item.status === 'contacted',
                        'bg-neutral-200 text-neutral-700': item.status === 'closed'
                      }"
                    >
                      {{ item.status === 'new' ? '🆕 งานใหม่' : item.status === 'contacted' ? '📞 กำลังติดต่อ' : '✅ ปิดงานแล้ว' }}
                    </span>
                    <span class="text-sm font-bold text-forestBlack">{{ item.contactName }}</span>
                    <span class="text-xs text-mutedSlate">• {{ item.organization }}</span>
                  </div>

                  <div class="text-xs text-[#00875A] font-semibold">
                    📌 สนใจ: {{ item.interestedProduct || 'สอบถามทั่วไป' }} <span v-if="item.subject" class="text-mutedSlate font-normal">({{ item.subject }})</span>
                  </div>

                  <p v-if="item.details" class="text-xs text-mutedSlate bg-[#F8FAF9] p-2.5 rounded-xl border border-forestBlack/5">
                    {{ item.details }}
                  </p>

                  <div class="flex flex-wrap items-center gap-4 text-[11px] font-mono text-mutedSlate pt-1">
                    <span>✉️ {{ item.email }}</span>
                    <span v-if="item.phone">📞 {{ item.phone }}</span>
                    <span>🕒 {{ new Date(item.createdAt).toLocaleString('th-TH') }}</span>
                  </div>
                </div>

                <!-- Status Switcher (Sysadmin can update status) -->
                <div v-if="isSysadmin" class="flex items-center gap-2 shrink-0">
                  <button
                    @click="updateTaskStatus(item, 'new')"
                    class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                    :class="item.status === 'new' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-mutedSlate border-forestBlack/15 hover:bg-emerald-50'"
                  >
                    งานใหม่
                  </button>
                  <button
                    @click="updateTaskStatus(item, 'contacted')"
                    class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                    :class="item.status === 'contacted' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-mutedSlate border-forestBlack/15 hover:bg-sky-50'"
                  >
                    ติดต่อแล้ว
                  </button>
                  <button
                    @click="updateTaskStatus(item, 'closed')"
                    class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                    :class="item.status === 'closed' ? 'bg-forestBlack text-white border-forestBlack' : 'bg-white text-mutedSlate border-forestBlack/15 hover:bg-neutral-100'"
                  >
                    ปิดงาน
                  </button>
                </div>
                <div v-else class="text-[11px] text-mutedSlate italic shrink-0">
                  (ดูอย่างเดียวสำหรับ Editor)
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================================ -->
          <!-- TAB 2: PRODUCTS (จัดการผลิตภัณฑ์และสไลด์ไฮไลต์)                 -->
          <!-- ================================================================ -->
          <div v-if="activeTab === 'products'" class="space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <button
                  @click="productFilter = 'all'"
                  class="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
                  :class="productFilter === 'all' ? 'bg-[#09140E] text-white' : 'bg-white border border-forestBlack/10 text-mutedSlate'"
                >
                  ทั้งหมด ({{ products.length }})
                </button>
                <button
                  @click="productFilter = 'featured'"
                  class="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
                  :class="productFilter === 'featured' ? 'bg-[#00C978] text-forestBlack font-bold' : 'bg-white border border-forestBlack/10 text-mutedSlate'"
                >
                  ⭐ แสดงบนสไลด์ไฮไลต์ ({{ featuredProductsCount }})
                </button>
              </div>

              <input
                v-model="productSearch"
                type="text"
                placeholder="🔍 ค้นหาชื่อผลิตภัณฑ์..."
                class="px-4 py-2 rounded-full bg-white border border-forestBlack/15 text-xs w-full sm:w-64 focus:outline-none focus:border-[#00C978]"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div
                v-for="prod in filteredProducts"
                :key="prod.id"
                class="bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between transition-all"
                :class="prod.isFeatured ? 'border-[#00C978] ring-2 ring-[#00C978]/15' : 'border-forestBlack/[0.08]'"
              >
                <div>
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#F8FAF9] border border-forestBlack/10 text-mutedSlate">
                      {{ prod.tag }}
                    </span>
                    <span
                      v-if="prod.isFeatured"
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F2] text-[#00875A] border border-[#B5EAD3]"
                    >
                      ⭐ ไฮไลต์ #{{ prod.featuredOrder || '-' }}
                    </span>
                  </div>

                  <h3 class="text-base font-bold text-forestBlack mb-0.5">{{ prod.title }}</h3>
                  <div class="text-xs font-semibold text-[#00875A] mb-2">{{ prod.subtitle_th }}</div>
                  <p class="text-xs text-mutedSlate line-clamp-2 mb-4">{{ prod.description_th }}</p>
                </div>

                <div v-if="isSysadmin" class="pt-3 border-t border-forestBlack/5 flex items-center justify-between gap-2">
                  <button
                    @click="toggleProductFeatured(prod)"
                    class="px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer"
                    :class="prod.isFeatured ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' : 'bg-[#F8FAF9] text-mutedSlate border-forestBlack/10 hover:bg-emerald-50'"
                  >
                    {{ prod.isFeatured ? 'เอาออกจากไฮไลต์' : '⭐ ตั้งเป็นไฮไลต์' }}
                  </button>
                  <button
                    @click="editingProduct = { ...prod }"
                    class="px-3.5 py-1.5 rounded-xl text-[11px] font-semibold bg-[#09140E] hover:bg-[#00C978] text-white hover:text-forestBlack transition-all cursor-pointer"
                  >
                    ✏️ แก้ไข
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================================ -->
          <!-- TAB 3: NEWS (จัดการข่าวสารและกิจกรรม - Sysadmin & Editor)         -->
          <!-- ================================================================ -->
          <div v-if="activeTab === 'news'" class="space-y-5">
            <div class="flex justify-end">
              <button
                @click="openNewArticleModal"
                class="px-5 py-2.5 rounded-full bg-[#00C978] hover:bg-[#00B36B] text-forestBlack font-bold text-xs shadow-sm cursor-pointer"
              >
                + เพิ่มข่าวสารใหม่
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="n in newsList"
                :key="n.id"
                class="bg-white rounded-2xl p-5 border border-forestBlack/[0.08] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#E8F8F2] text-[#00875A] font-semibold">
                      {{ n.category }}
                    </span>
                    <span class="text-[11px] text-mutedSlate font-mono">{{ n.date_th }}</span>
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-forestBlack">{{ n.title_th }}</h3>
                  <p class="text-xs text-mutedSlate line-clamp-1">{{ n.subtitle_th }}</p>
                </div>

                <button
                  @click="isCreatingNews = false; editingNews = { ...n }"
                  class="px-4 py-2 rounded-xl text-xs font-semibold bg-[#09140E] hover:bg-[#00C978] text-white hover:text-forestBlack transition-all cursor-pointer shrink-0 self-start sm:self-center"
                >
                  ✏️ แก้ไขข่าว
                </button>
              </div>
            </div>
          </div>

          <!-- ================================================================ -->
          <!-- TAB 4: SITE SETTING (ข้อมูลบริษัท & หน้าแรก - Sysadmin & Editor)   -->
          <!-- ================================================================ -->
          <div v-if="activeTab === 'settings'" class="bg-white rounded-3xl p-6 sm:p-8 border border-forestBlack/[0.08] shadow-2xs">
            <form @submit.prevent="saveSiteSetting" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold mb-1">พาดหัวใหญ่หน้าแรก (ภาษาไทย)</label>
                  <input v-model="siteSetting.hero_title_th" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1">พาดหัวใหญ่หน้าแรก (English)</label>
                  <input v-model="siteSetting.hero_title_en" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1">ชื่อบริษัท (ภาษาไทย)</label>
                  <input v-model="siteSetting.company_name_th" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1">ชื่อบริษัท (English)</label>
                  <input v-model="siteSetting.company_name_en" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1">เบอร์โทรศัพท์</label>
                  <input v-model="siteSetting.phone" type="text" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1">อีเมลติดต่อ</label>
                  <input v-model="siteSetting.email" type="email" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold mb-1">ที่อยู่สำนักงานใหญ่ (ภาษาไทย)</label>
                  <textarea v-model="siteSetting.address_th" rows="2" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs"></textarea>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold mb-1">ที่อยู่สำนักงานใหญ่ (English)</label>
                  <textarea v-model="siteSetting.address_en" rows="2" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs"></textarea>
                </div>
              </div>

              <div class="pt-3 flex justify-end">
                <button
                  type="submit"
                  class="px-6 py-2.5 rounded-full bg-[#00C978] hover:bg-[#00B36B] text-forestBlack font-bold text-xs shadow-sm cursor-pointer"
                >
                  💾 บันทึกข้อมูลขึ้นหน้าเว็บทันที
                </button>
              </div>
            </form>
          </div>

          <!-- ================================================================ -->
          <!-- TAB 5: USERS & ROLES (จัดการทีมงาน & มอบยศ - Sysadmin Only)       -->
          <!-- ================================================================ -->
          <div v-if="activeTab === 'users' && isSysadmin" class="space-y-6">
            <!-- Create New User Form -->
            <div class="bg-white rounded-3xl p-6 border border-forestBlack/[0.08] shadow-2xs">
              <h3 class="text-sm font-bold text-forestBlack mb-4">+ เพิ่มสมาชิกทีมงานและมอบยศ</h3>
              <form @submit.prevent="createNewUser" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <div>
                  <label class="block text-[11px] font-semibold mb-1">Username</label>
                  <input v-model="newUserForm.username" required type="text" placeholder="editor2" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold mb-1">Email</label>
                  <input v-model="newUserForm.email" required type="email" placeholder="staff@igenco.co.th" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold mb-1">Password</label>
                  <input v-model="newUserForm.password" required type="password" placeholder="อย่างน้อย 6 ตัว" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold mb-1">มอบยศ (Role)</label>
                  <select v-model="newUserForm.roleType" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15 text-xs">
                    <option value="editor">✏️ Editor (ข่าวสาร/ข้อมูล)</option>
                    <option value="sysadmin">🛡️ Sysadmin (สิทธิ์เต็ม)</option>
                  </select>
                </div>
                <button type="submit" class="px-4 py-2 rounded-xl bg-[#00C978] hover:bg-[#00B36B] text-forestBlack font-bold text-xs cursor-pointer">
                  + สร้างบัญชี
                </button>
              </form>
            </div>

            <!-- Existing Users Table -->
            <div class="bg-white rounded-3xl p-6 border border-forestBlack/[0.08] shadow-2xs space-y-3">
              <h3 class="text-sm font-bold text-forestBlack mb-2">รายชื่อทีมงานทั้งหมด</h3>
              <div
                v-for="u in usersList"
                :key="u.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F8FAF9] border border-forestBlack/5"
              >
                <div>
                  <div class="text-xs font-bold text-forestBlack">{{ u.username }} <span class="text-mutedSlate font-normal">({{ u.email }})</span></div>
                  <div class="text-[11px] text-[#00875A] font-mono mt-0.5">ยศปัจจุบัน: {{ u.role?.name || '-' }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="changeUserRole(u, 'editor')"
                    class="px-3 py-1.5 rounded-xl text-[11px] font-semibold border cursor-pointer"
                    :class="u.role?.type === 'editor' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-forestBlack/15 text-mutedSlate'"
                  >
                    มอบยศ Editor
                  </button>
                  <button
                    @click="changeUserRole(u, 'sysadmin')"
                    class="px-3 py-1.5 rounded-xl text-[11px] font-semibold border cursor-pointer"
                    :class="u.role?.type === 'sysadmin' ? 'bg-[#09140E] text-[#00E588] border-[#09140E]' : 'bg-white border-forestBlack/15 text-mutedSlate'"
                  >
                    มอบยศ Sysadmin
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- ==================================================================== -->
    <!-- EDIT PRODUCT MODAL                                                   -->
    <!-- ==================================================================== -->
    <div v-if="editingProduct" class="fixed inset-0 z-50 bg-forestBlack/60 backdrop-blur-xs flex items-center justify-center p-4" @click.self="editingProduct = null">
      <div class="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold">แก้ไขผลิตภัณฑ์: {{ editingProduct.title }}</h3>
          <button @click="editingProduct = null" class="text-mutedSlate hover:text-forestBlack cursor-pointer">✕</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="sm:col-span-2">
            <label class="block font-semibold mb-1">ชื่อผลิตภัณฑ์</label>
            <input v-model="editingProduct.title" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15" />
          </div>
          <div>
            <label class="block font-semibold mb-1">คำโปรย (ไทย)</label>
            <input v-model="editingProduct.subtitle_th" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15" />
          </div>
          <div>
            <label class="block font-semibold mb-1">คำโปรย (English)</label>
            <input v-model="editingProduct.subtitle_en" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15" />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-semibold mb-1">รายละเอียด (ไทย)</label>
            <textarea v-model="editingProduct.description_th" rows="2" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15"></textarea>
          </div>
          <div>
            <label class="block font-semibold mb-1">ป้ายหมวดหมู่</label>
            <input v-model="editingProduct.tag" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15" />
          </div>
          <div>
            <label class="block font-semibold mb-1">ลำดับในสไลด์ไฮไลต์ (1-5)</label>
            <input v-model="editingProduct.featuredOrder" type="number" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15" />
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="editingProduct = null" class="px-4 py-2 rounded-full text-xs font-semibold bg-[#F8FAF9] border border-forestBlack/10 cursor-pointer">ยกเลิก</button>
          <button @click="saveProductEdit" class="px-5 py-2 rounded-full text-xs font-bold bg-[#00C978] text-forestBlack cursor-pointer">💾 บันทึก</button>
        </div>
      </div>
    </div>

    <!-- ==================================================================== -->
    <!-- EDIT / CREATE NEWS MODAL                                             -->
    <!-- ==================================================================== -->
    <div v-if="editingNews" class="fixed inset-0 z-50 bg-forestBlack/60 backdrop-blur-xs flex items-center justify-center p-4" @click.self="editingNews = null">
      <div class="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold">{{ isCreatingNews ? '+ เพิ่มข่าวสารใหม่' : 'แก้ไขข่าวสาร' }}</h3>
          <button @click="editingNews = null" class="text-mutedSlate hover:text-forestBlack cursor-pointer">✕</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="sm:col-span-2">
            <label class="block font-semibold mb-1">หัวข้อข่าว (ภาษาไทย)</label>
            <input v-model="editingNews.title_th" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15" />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-semibold mb-1">หัวข้อข่าว (English)</label>
            <input v-model="editingNews.title_en" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15" />
          </div>
          <div>
            <label class="block font-semibold mb-1">หัวข้อย่อย (ไทย)</label>
            <input v-model="editingNews.subtitle_th" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15" />
          </div>
          <div>
            <label class="block font-semibold mb-1">หมวดหมู่</label>
            <select v-model="editingNews.category" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15">
              <option value="Enterprise Software">Enterprise Software</option>
              <option value="Service Development">Service Development</option>
              <option value="E-Commerce">E-Commerce</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="block font-semibold mb-1">เนื้อหาย่อ (ภาษาไทย)</label>
            <textarea v-model="editingNews.body_th" rows="3" class="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-forestBlack/15"></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="editingNews = null" class="px-4 py-2 rounded-full text-xs font-semibold bg-[#F8FAF9] border border-forestBlack/10 cursor-pointer">ยกเลิก</button>
          <button @click="saveNewsEdit" class="px-5 py-2 rounded-full text-xs font-bold bg-[#00C978] text-forestBlack cursor-pointer">💾 เผยแพร่ขึ้นหน้าเว็บ</button>
        </div>
      </div>
    </div>

  </div>
</template>
