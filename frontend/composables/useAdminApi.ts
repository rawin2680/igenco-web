// Shared state + Strapi calls for the custom admin portal (/admin).
// The page is client-only in practice (token lives in localStorage), so data is
// loaded in onMounted and never during SSR.

export type JobStatus = 'new' | 'contacted' | 'closed'

export const JOB_STATUSES: { key: JobStatus; label: string; hint: string }[] = [
  { key: 'new', label: 'งานใหม่', hint: 'ยังไม่ได้ติดต่อกลับ' },
  { key: 'contacted', label: 'กำลังติดตาม', hint: 'ติดต่อลูกค้าแล้ว' },
  { key: 'closed', label: 'ปิดงาน', hint: 'จบงานแล้ว' }
]

export const useAdminApi = () => {
  const config = useRuntimeConfig()
  const strapiUrl = (config.public.strapiUrl as string) || 'http://localhost:1337'

  const token = useState<string | null>('adm-token', () => null)
  const currentUser = useState<any | null>('adm-user', () => null)
  const isLoading = useState('adm-loading', () => false)
  const toast = useState<{ msg: string; kind: 'ok' | 'err' } | null>('adm-toast', () => null)

  const jobs = useState<any[]>('adm-jobs', () => [])
  const spamJobs = useState<any[]>('adm-spam', () => [])
  const products = useState<any[]>('adm-products', () => [])
  const newsList = useState<any[]>('adm-news', () => [])
  const siteSetting = useState<any>('adm-site', () => ({}))
  const usersList = useState<any[]>('adm-users', () => [])
  const rolesList = useState<any[]>('adm-roles', () => [])

  const isSysadmin = computed(() => {
    const t = currentUser.value?.role?.type?.toLowerCase() || ''
    const n = currentUser.value?.role?.name?.toLowerCase() || ''
    return t === 'sysadmin' || n.includes('sysadmin') || n === 'admin'
  })

  let toastTimer: any
  const notify = (msg: string, kind: 'ok' | 'err' = 'ok') => {
    toast.value = { msg, kind }
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (toast.value = null), 3200)
  }

  const headers = () => ({ Authorization: `Bearer ${token.value}` })
  const api = <T = any>(path: string, opts: any = {}) =>
    $fetch<T>(`${strapiUrl}${path}`, { ...opts, headers: { ...headers(), ...(opts.headers || {}) } })

  const imageOf = (item: any): string | null => {
    const u = item?.image?.url
    if (u) return u.startsWith('http') ? u : `${strapiUrl}${u}`
    return item?.imageUrl || null
  }

  // ---------------- Auth ----------------
  const login = async (identifier: string, password: string) => {
    const res: any = await $fetch(`${strapiUrl}/api/auth/local`, {
      method: 'POST',
      body: { identifier, password }
    })
    token.value = res.jwt
    try { localStorage.setItem('igenco_admin_jwt', res.jwt) } catch {}
    await fetchMe()
    await loadAll()
  }

  const logout = () => {
    token.value = null
    currentUser.value = null
    try { localStorage.removeItem('igenco_admin_jwt') } catch {}
  }

  const fetchMe = async () => {
    if (!token.value) return
    try {
      currentUser.value = await api('/api/users/me?populate=role')
    } catch {
      logout()
    }
  }

  const restoreSession = async () => {
    try {
      const saved = localStorage.getItem('igenco_admin_jwt')
      if (!saved) return
      token.value = saved
      await fetchMe()
      if (token.value) await loadAll()
    } catch {}
  }

  // ---------------- Load ----------------
  // News: load draft versions (= latest edits, includes hidden ones) and mark which are live.
  const loadNewsList = async () => {
    const q = 'sort=id:desc&pagination[pageSize]=100&populate=image'
    const [drafts, live]: any = await Promise.all([
      api(`/api/news-articles?status=draft&${q}`).catch(() => null),
      api(`/api/news-articles?${q}`).catch(() => ({ data: [] }))
    ])
    const liveList: any[] = live?.data || []
    if (!drafts?.data) return liveList.map(n => ({ ...n, _published: true }))
    const liveIds = new Set(liveList.map(n => n.documentId))
    return (drafts.data as any[]).map(n => ({ ...n, _published: liveIds.has(n.documentId) }))
  }

  const loadAll = async () => {
    if (!token.value) return
    isLoading.value = true
    try {
      const [j, p, n, s]: any = await Promise.all([
        api('/api/contact-inquiries?sort=createdAt:desc&pagination[pageSize]=200').catch(() => ({ data: [] })),
        api('/api/products?populate=image&sort=featuredOrder:asc,id:asc&pagination[pageSize]=200').catch(() => ({ data: [] })),
        loadNewsList(),
        api('/api/site-setting').catch(() => ({ data: {} }))
      ])
      const allJobs: any[] = j?.data || []
      jobs.value = allJobs.filter(x => !x.isSpam)
      spamJobs.value = allJobs.filter(x => x.isSpam)
      products.value = p?.data || []
      newsList.value = n
      siteSetting.value = s?.data || {}

      if (isSysadmin.value) {
        const [u, r]: any = await Promise.all([
          api('/api/users?populate=role').catch(() => []),
          api('/api/users-permissions/roles').catch(() => ({ roles: [] }))
        ])
        usersList.value = Array.isArray(u) ? u : []
        rolesList.value = r?.roles || []
      }
    } finally {
      isLoading.value = false
    }
  }

  // ---------------- Jobs (contact inquiries) ----------------
  const setJobStatus = async (job: any, status: JobStatus) => {
    if (!isSysadmin.value || job.status === status) return
    const prev = job.status
    job.status = status
    try {
      await api(`/api/contact-inquiries/${job.documentId}`, { method: 'PUT', body: { data: { status } } })
      notify(`ย้ายงานของ ${job.contactName} ไปที่ "${JOB_STATUSES.find(s => s.key === status)?.label}" แล้ว`)
    } catch {
      job.status = prev
      notify('อัปเดตสถานะงานไม่สำเร็จ', 'err')
    }
  }

  const deleteJob = async (job: any) => {
    if (!isSysadmin.value) return false
    try {
      await api(`/api/contact-inquiries/${job.documentId}`, { method: 'DELETE' })
      jobs.value = jobs.value.filter(j => j.documentId !== job.documentId)
      spamJobs.value = spamJobs.value.filter(j => j.documentId !== job.documentId)
      notify('ลบงานแล้ว')
      return true
    } catch {
      notify('ลบงานไม่สำเร็จ', 'err')
      return false
    }
  }

  // Mark / unmark a message as spam (sysadmin only)
  const setSpam = async (job: any, isSpam: boolean) => {
    if (!isSysadmin.value) return false
    try {
      await api(`/api/contact-inquiries/${job.documentId}`, { method: 'PUT', body: { data: { isSpam, spamReason: isSpam ? (job.spamReason || 'ทำเครื่องหมายโดยผู้ดูแล') : null } } })
      job.isSpam = isSpam
      if (isSpam) {
        jobs.value = jobs.value.filter(j => j.documentId !== job.documentId)
        spamJobs.value = [job, ...spamJobs.value]
        notify(`ย้ายข้อความของ ${job.contactName} ไปที่สแปมแล้ว`)
      } else {
        spamJobs.value = spamJobs.value.filter(j => j.documentId !== job.documentId)
        jobs.value = [job, ...jobs.value].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        notify(`ย้าย ${job.contactName} กลับเข้างานใหม่แล้ว`)
      }
      return true
    } catch (e: any) {
      notify(e?.data?.error?.message?.includes('Invalid key') ? 'ต้องอัปเดตระบบหลังบ้านก่อนจึงจะใช้ได้' : 'อัปเดตไม่สำเร็จ', 'err')
      return false
    }
  }

  const deleteSpamAll = async () => {
    if (!isSysadmin.value) return
    const list = [...spamJobs.value]
    let ok = 0
    for (const j of list) {
      try { await api(`/api/contact-inquiries/${j.documentId}`, { method: 'DELETE' }); ok++ } catch {}
    }
    await loadAll()
    notify(`ลบสแปม ${ok} รายการแล้ว`)
  }

  // ---------------- Upload ----------------
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) { notify('เลือกได้เฉพาะไฟล์รูปภาพ', 'err'); return null }
    if (file.size > 5 * 1024 * 1024) { notify('รูปใหญ่เกิน 5MB', 'err'); return null }
    const fd = new FormData()
    fd.append('files', file)
    try {
      const res: any = await api('/api/upload', { method: 'POST', body: fd })
      const url = res?.[0]?.url
      if (!url) throw new Error('no url')
      return url.startsWith('http') ? url : `${strapiUrl}${url}`
    } catch (e: any) {
      const st = e?.statusCode || e?.status
      notify(st === 403 ? 'บัญชีนี้ยังไม่มีสิทธิ์อัปโหลดรูป (ต้องอัปเดตระบบหลังบ้าน) ใช้ลิงก์รูปแทนได้' : 'อัปโหลดรูปไม่สำเร็จ', 'err')
      return null
    }
  }

  // ---------------- Products ----------------
  const productPayload = (p: any) => ({
    title: p.title,
    subtitle_th: p.subtitle_th || null,
    subtitle_en: p.subtitle_en || null,
    description_th: p.description_th || null,
    description_en: p.description_en || null,
    tag: p.tag || null,
    tags: (p.tags || []).filter((t: string) => t && t.trim()),
    features_th: (p.features_th || []).filter((t: string) => t && t.trim()),
    features_en: (p.features_en || []).filter((t: string) => t && t.trim()),
    isFeatured: !!p.isFeatured,
    featuredOrder: Number(p.featuredOrder) || 0,
    awardBadge: p.awardBadge || null,
    imageUrl: p.imageUrl || null,
    iconType: p.iconType || 'document-pen'
  })

  // status=published so the change shows on the live site straight away
  const saveProduct = async (p: any) => {
    if (!isSysadmin.value) return false
    try {
      if (p.documentId) {
        await api(`/api/products/${p.documentId}?status=published`, { method: 'PUT', body: { data: productPayload(p) } })
        notify(`บันทึก "${p.title}" แล้ว`)
      } else {
        await api('/api/products?status=published', { method: 'POST', body: { data: productPayload(p) } })
        notify(`เพิ่มผลิตภัณฑ์ "${p.title}" แล้ว`)
      }
      await loadAll()
      return true
    } catch (e: any) {
      notify(e?.data?.error?.message || 'บันทึกผลิตภัณฑ์ไม่สำเร็จ', 'err')
      return false
    }
  }

  const toggleFeatured = async (p: any) => {
    if (!isSysadmin.value) return
    const next = !p.isFeatured
    p.isFeatured = next
    try {
      await api(`/api/products/${p.documentId}?status=published`, { method: 'PUT', body: { data: { isFeatured: next } } })
      notify(next ? `"${p.title}" ขึ้นสไลด์ไฮไลต์แล้ว` : `เอา "${p.title}" ออกจากไฮไลต์แล้ว`)
    } catch {
      p.isFeatured = !next
      notify('อัปเดตไม่สำเร็จ', 'err')
    }
  }

  const deleteProduct = async (p: any) => {
    if (!isSysadmin.value) return false
    try {
      await api(`/api/products/${p.documentId}`, { method: 'DELETE' })
      products.value = products.value.filter(x => x.documentId !== p.documentId)
      notify(`ลบ "${p.title}" แล้ว`)
      return true
    } catch {
      notify('ลบผลิตภัณฑ์ไม่สำเร็จ', 'err')
      return false
    }
  }

  // ---------------- News ----------------
  const newsPayload = (n: any) => ({
    title_th: n.title_th,
    title_en: n.title_en || n.title_th,
    subtitle_th: n.subtitle_th || null,
    subtitle_en: n.subtitle_en || n.subtitle_th || null,
    body_th: n.body_th || null,
    body_en: n.body_en || n.body_th || null,
    fullContent_th: n.fullContent_th || null,
    fullContent_en: n.fullContent_en || null,
    category: n.category,
    tag: n.tag || n.category,
    readTime: n.readTime || '1 min',
    date_th: n.date_th,
    date_en: n.date_en || n.date_th,
    imageUrl: n.imageUrl || null,
    externalLink: n.externalLink || null
  })

  /** publish=true → live on the site now; false → saved as draft only (hidden). */
  const saveNews = async (n: any, publish = true) => {
    const qs = publish ? '?status=published' : ''
    try {
      if (n.documentId) {
        await api(`/api/news-articles/${n.documentId}${qs}`, { method: 'PUT', body: { data: newsPayload(n) } })
      } else {
        await api(`/api/news-articles${qs}`, { method: 'POST', body: { data: newsPayload(n) } })
      }
      notify(publish ? 'บันทึกและเผยแพร่ข่าวแล้ว' : 'บันทึกเป็นฉบับร่างแล้ว (ยังไม่ขึ้นเว็บ)')
      await loadAll()
      return true
    } catch (e: any) {
      notify(e?.data?.error?.message || 'บันทึกข่าวไม่สำเร็จ', 'err')
      return false
    }
  }

  const unpublishNews = async (n: any) => {
    try {
      await api(`/api/news-articles/${n.documentId}/unpublish`, { method: 'POST' })
      notify('ซ่อนข่าวจากหน้าเว็บแล้ว (ยังเก็บไว้เป็นฉบับร่าง)')
      await loadAll()
      return true
    } catch (e: any) {
      const st = e?.statusCode || e?.status
      notify(st === 404 || st === 405 || st === 403 ? 'ต้องอัปเดตระบบหลังบ้านก่อนจึงจะซ่อนข่าวได้' : 'ซ่อนข่าวไม่สำเร็จ', 'err')
      return false
    }
  }

  const deleteNews = async (n: any) => {
    try {
      await api(`/api/news-articles/${n.documentId}`, { method: 'DELETE' })
      newsList.value = newsList.value.filter(x => x.documentId !== n.documentId)
      notify('ลบข่าวแล้ว')
      return true
    } catch {
      notify('ลบข่าวไม่สำเร็จ', 'err')
      return false
    }
  }

  // ---------------- Site setting ----------------
  const saveSiteSetting = async () => {
    const s = siteSetting.value
    const keys = ['hero_badge', 'hero_title_th', 'hero_title_en', 'hero_subtitle_th', 'hero_subtitle_en',
      'company_name_th', 'company_name_en', 'address_th', 'address_en', 'phone', 'email',
      'officeHours_th', 'officeHours_en']
    const data: any = {}
    keys.forEach(k => (data[k] = s[k]))
    try {
      await api('/api/site-setting?status=published', { method: 'PUT', body: { data } })
      notify('บันทึกข้อมูลบริษัทแล้ว')
    } catch {
      notify('บันทึกไม่สำเร็จ', 'err')
    }
  }

  // ---------------- Users ----------------
  const createUser = async (f: { username: string; email: string; password: string; roleType: string }) => {
    const role = rolesList.value.find((r: any) => r.type === f.roleType)
    if (!role) { notify('ไม่พบสิทธิ์ที่เลือก', 'err'); return false }
    try {
      await api('/api/users', { method: 'POST', body: { ...f, role: role.id, confirmed: true } })
      notify('สร้างบัญชีแล้ว')
      await loadAll()
      return true
    } catch (e: any) {
      notify(e?.data?.error?.message || 'สร้างบัญชีไม่สำเร็จ', 'err')
      return false
    }
  }

  const changeUserRole = async (u: any, roleType: string) => {
    const role = rolesList.value.find((r: any) => r.type === roleType)
    if (!role) return
    try {
      await api(`/api/users/${u.id}`, { method: 'PUT', body: { role: role.id } })
      notify(`เปลี่ยนสิทธิ์ของ ${u.username} แล้ว`)
      await loadAll()
    } catch {
      notify('เปลี่ยนสิทธิ์ไม่สำเร็จ', 'err')
    }
  }

  return {
    strapiUrl, token, currentUser, isLoading, toast, isSysadmin,
    jobs, spamJobs, products, newsList, siteSetting, usersList, rolesList,
    notify, imageOf, login, logout, restoreSession, loadAll,
    setJobStatus, deleteJob, setSpam, deleteSpamAll, uploadImage,
    saveProduct, toggleFeatured, deleteProduct,
    saveNews, unpublishNews, deleteNews, saveSiteSetting, createUser, changeUserRole
  }
}

// Small helpers used across admin components
export const timeAgo = (iso?: string) => {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'เมื่อสักครู่'
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} วันที่แล้ว`
  return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
}

export const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'
