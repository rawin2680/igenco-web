/**
 * Spam protection for the public contact form (contact-inquiry create).
 *
 * Layers (cheap → strict), following common practice (OWASP, form-spam guides):
 *  1. Honeypot field + minimum fill time  → bots get a fake "success", nothing is saved.
 *  2. Per-IP rate limit                    → HTTP 429.
 *  3. Strict validation / length limits    → HTTP 400.
 *  4. Content heuristics (links, keywords,
 *     foreign scripts, duplicates)         → saved but flagged isSpam=true so a
 *                                            human can review (no silent loss of real leads).
 */

type Hit = number[]
const hitsByIp = new Map<string, Hit>()

const TEN_MIN = 10 * 60 * 1000
const DAY = 24 * 60 * 60 * 1000
export const LIMIT_10_MIN = Number(process.env.CONTACT_LIMIT_10MIN || 5)
export const LIMIT_DAY = Number(process.env.CONTACT_LIMIT_DAY || 20)
export const MIN_FILL_MS = Number(process.env.CONTACT_MIN_FILL_MS || 3000)

/** Returns true when the IP is over its limit (and records the hit otherwise). */
export const isRateLimited = (ip: string, now = Date.now()) => {
  const list = (hitsByIp.get(ip) || []).filter(t => now - t < DAY)
  const recent = list.filter(t => now - t < TEN_MIN).length
  if (recent >= LIMIT_10_MIN || list.length >= LIMIT_DAY) {
    hitsByIp.set(ip, list)
    return true
  }
  list.push(now)
  hitsByIp.set(ip, list)
  // keep memory bounded
  if (hitsByIp.size > 5000) {
    for (const [k, v] of hitsByIp) if (!v.length || now - v[v.length - 1] > DAY) hitsByIp.delete(k)
  }
  return false
}

export const FIELD_LIMITS: Record<string, number> = {
  contactName: 100,
  organization: 150,
  phone: 30,
  email: 254,
  subject: 200,
  interestedProduct: 200,
  details: 3000,
}
export const ALLOWED_FIELDS = Object.keys(FIELD_LIMITS)

const EMAIL_RE = /^[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}$/i
const PHONE_RE = /^[0-9+\-().\s#]{6,30}$/
const URL_RE = /(https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(ru|cn|xyz|top|click|link|online|site|shop|bet|casino|loan|icu|buzz)\b/gi
const HTML_RE = /<\s*\/?\s*(a|script|iframe|img|div|span|p|br)\b|\[url=|\[\/url\]/i

// Common spam vocabulary seen on B2B contact forms (EN + TH gambling/loan spam).
const SPAM_WORDS = [
  'casino', 'viagra', 'cialis', 'porn', 'xxx', 'escort', 'bitcoin', 'crypto', 'forex', 'binary option',
  'backlink', 'seo service', 'seo services', 'guest post', 'rank your website', 'first page of google',
  'web traffic', 'increase traffic', 'lead generation service', 'payday loan', 'loan offer', 'betting',
  'unsubscribe', 'buy followers', 'telegram @', 'whatsapp +',
  'บาคาร่า', 'สล็อต', 'เว็บพนัน', 'แทงบอล', 'คาสิโน', 'เครดิตฟรี', 'ฝากถอน', 'เว็บตรง', 'หวยออนไลน์', 'กู้เงินด่วน', 'ปั่นยอด',
]

export type CleanResult =
  | { ok: true; data: Record<string, string> }
  | { ok: false; message: string }

export const cleanAndValidate = (raw: any): CleanResult => {
  if (!raw || typeof raw !== 'object') return { ok: false, message: 'ข้อมูลไม่ถูกต้อง' }
  const data: Record<string, string> = {}
  for (const key of ALLOWED_FIELDS) {
    const v = raw[key]
    if (v === undefined || v === null || v === '') continue
    if (typeof v !== 'string') return { ok: false, message: `ข้อมูล ${key} ไม่ถูกต้อง` }
    // strip control chars except newline/tab
    const s = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
    if (s.length > FIELD_LIMITS[key]) return { ok: false, message: `ข้อความในช่อง ${key} ยาวเกินไป (สูงสุด ${FIELD_LIMITS[key]} ตัวอักษร)` }
    if (s) data[key] = s
  }
  if (!data.contactName || data.contactName.length < 2) return { ok: false, message: 'กรุณากรอกชื่อผู้ติดต่อ' }
  if (!data.organization) return { ok: false, message: 'กรุณากรอกชื่อหน่วยงาน' }
  if (!data.email || !EMAIL_RE.test(data.email)) return { ok: false, message: 'อีเมลไม่ถูกต้อง' }
  if (data.phone && !PHONE_RE.test(data.phone)) return { ok: false, message: 'เบอร์โทรไม่ถูกต้อง' }
  return { ok: true, data }
}

/** Returns a list of reasons; empty list = looks clean. */
export const spamReasons = (d: Record<string, string>, meta: { elapsedMs?: number | null } = {}) => {
  const reasons: string[] = []
  const all = Object.values(d).join(' \n ')
  const lower = all.toLowerCase()

  const links = (all.match(URL_RE) || []).length
  if (links >= 2) reasons.push(`มีลิงก์ ${links} ลิงก์`)
  const shortFields = [d.contactName, d.organization, d.phone].filter(Boolean).join(' ')
  if (/(https?:\/\/|www\.)/i.test(shortFields)) reasons.push('มีลิงก์ในชื่อ/หน่วยงาน')
  if (HTML_RE.test(all)) reasons.push('มีโค้ด HTML/BBCode')

  const words = SPAM_WORDS.filter(w => lower.includes(w))
  if (words.length) reasons.push(`คำต้องสงสัย: ${words.slice(0, 3).join(', ')}`)

  // This site serves Thai/English customers; long text mostly in other scripts is a strong spam signal.
  const letters = all.replace(/[\s\d\p{P}\p{S}]/gu, '')
  if (letters.length >= 20) {
    const foreign = (letters.match(/[Ѐ-ӿ぀-ヿ一-鿿가-힯؀-ۿ]/g) || []).length
    if (foreign / letters.length > 0.3) reasons.push('ภาษาไม่ตรงกลุ่มลูกค้า (รัสเซีย/จีน/อาหรับ ฯลฯ)')
  }

  if (d.contactName && /\d{3,}/.test(d.contactName)) reasons.push('ชื่อมีตัวเลขยาว')
  if (meta.elapsedMs === null) reasons.push('ไม่ได้ส่งจากหน้าเว็บ')
  return reasons
}
