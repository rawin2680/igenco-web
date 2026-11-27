import { newsDateValue } from '~/utils/markdown'
import { useRuntimeConfig, useState } from '#app'
import { useAppI18n } from '~/composables/useI18n'
import type {
  HeroContent,
  CapabilityItem,
  IndustryBlueprint,
  DeploymentModel,
  PartnerBrand,
  DemoLeadForm
} from '~/types/cms'

export const useStrapiApi = () => {
  const config = useRuntimeConfig()
  const useMock = config.public.useMock
  const strapiUrl = config.public.strapiUrl

  // ----------------------------------------------------------------------------
  // Mock Data (matches prototype with high fidelity)
  // ----------------------------------------------------------------------------
  const mockHero: HeroContent = {
    badge: {
      th: 'NEXT-GEN ENTERPRISE AI ARCHITECTURE',
      en: 'NEXT-GEN ENTERPRISE AI ARCHITECTURE'
    },
    title: {
      th: 'ยกระดับองค์กรสู่อนาคต ด้วยสถาปัตยกรรม AI อัจฉริยะ',
      en: 'Intelligence, Engineered for Tomorrow’s Enterprise.'
    },
    subtitle: {
      th: 'ออกแบบและพัฒนาโซลูชันปัญญาประดิษฐ์ระดับองค์กร ผสานความแม่นยำของข้อมูล ความปลอดภัยสูงสุด และประสบการณ์ดิจิทัลที่ไร้รอยต่อ',
      en: 'We architect sovereign enterprise AI systems combining precision data intelligence, zero-trust security, and seamless digital experiences.'
    },
    primaryCtaText: {
      th: 'ทดลองสัมผัส AI Demo',
      en: 'Launch Interactive Demo'
    },
    secondaryCtaText: {
      th: 'สำรวจนวัตกรรมของเรา',
      en: 'Explore Capabilities'
    },
    hintText: {
      th: 'ขยับเมาส์หรือแตะเพื่อโต้ตอบกับ Neural Core 3 มิติ',
      en: 'Move cursor or touch to interact with the 3D Neural Core'
    }
  }

  const mockCapabilities: CapabilityItem[] = [
    {
      id: 'cap-1',
      tag: 'REAL-TIME REASONING',
      pillBadge: 'Enterprise LLM & Agents',
      title: {
        th: 'Enterprise LLM & Autonomous Agents',
        en: 'Enterprise LLM & Autonomous Agents'
      },
      description: {
        th: 'ระบบ AI Agent อัจฉริยะที่สามารถวางแผน วิเคราะห์เอกสารซับซ้อน และเชื่อมต่อ API ภายในองค์กรเพื่อทำงานอัตโนมัติแบบครบวงจร',
        en: 'Autonomous cognitive agents capable of multi-step planning, deep document synthesis, and automated enterprise API orchestration.'
      },
      gridSpan: 'large',
      theme: 'light',
      interactiveType: 'flow'
    },
    {
      id: 'cap-2',
      tag: '● 12ms Latency',
      pillBadge: 'Predictive Engine',
      title: {
        th: 'Predictive Data Engine',
        en: 'Predictive Data Engine'
      },
      description: {
        th: 'เปลี่ยนข้อมูลมหาศาลให้เป็นการคาดการณ์ทางธุรกิจที่แม่นยำด้วยโมเดล Deep Learning เฉพาะทาง',
        en: 'Transform vast enterprise telemetry into high-accuracy business foresight with domain-specific deep learning models.'
      },
      gridSpan: 'medium',
      theme: 'light',
      interactiveType: 'chart'
    },
    {
      id: 'cap-3',
      tag: 'ISO / PDPA READY',
      pillBadge: 'Zero-Trust Security',
      title: {
        th: 'Private On-Premise AI',
        en: 'Private On-Premise AI'
      },
      description: {
        th: 'ติดตั้งโมเดล AI บนเซิร์ฟเวอร์ส่วนตัวขององค์กร ข้อมูลความลับทางธุรกิจไม่รั่วไหลออกสู่ภายนอก 100%',
        en: 'Deploy proprietary neural weights strictly within sovereign enterprise perimeters. Zero data leakage guaranteed.'
      },
      gridSpan: 'medium',
      theme: 'dark',
      interactiveType: 'shield'
    },
    {
      id: 'cap-4',
      tag: 'EDGE INFERENCE',
      pillBadge: 'Spatial & Edge Intelligence',
      title: {
        th: 'Computer Vision & Edge',
        en: 'Computer Vision & Edge'
      },
      description: {
        th: 'วิเคราะห์ภาพและวิดีโอแบบเรียลไทม์สำหรับสายการผลิต อุตสาหกรรมพลังงาน และโครงสร้างพื้นฐานอัจฉริยะ',
        en: 'Sub-millisecond visual analytics and anomaly detection designed for smart manufacturing, utilities, and infrastructure.'
      },
      gridSpan: 'large',
      theme: 'light',
      interactiveType: 'vision'
    }
  ]

  const mockBlueprints: Record<string, IndustryBlueprint> = {
    manufacturing: {
      key: 'manufacturing',
      name: { th: 'Manufacturing', en: 'Manufacturing' },
      tag: 'BLUEPRINT // VISION-TWIN-X',
      title: {
        th: 'ระบบตรวจสอบคุณภาพสายการผลิตและคาดการณ์การซ่อมบำรุง',
        en: 'Automated Line Quality Inspection & Predictive Maintenance'
      },
      summary: {
        th: 'ใช้ Computer Vision ความเร็วสูงตรวจจับความผิดปกติระดับไมครอนบนสายการผลิต พร้อมวิเคราะห์ข้อมูลเซนเซอร์ IoT เพื่อลด Downtime ก่อนเกิดความเสียหาย',
        en: 'High-speed edge computer vision detecting sub-micron defects in real-time, paired with IoT telemetry to preempt mechanical failures.'
      },
      pipeline: [
        '1. High-Speed Edge Vision',
        '2. Predictive Telemetry',
        '3. Auto ERP Alert'
      ],
      metric1: {
        value: '-54%',
        label: { th: 'Unplanned Downtime', en: 'Unplanned Downtime' }
      },
      metric2: {
        value: '99.8%',
        label: { th: 'Defect Precision', en: 'Defect Precision' }
      }
    },
    finance: {
      key: 'finance',
      name: { th: 'Finance', en: 'Finance' },
      tag: 'BLUEPRINT // FIN-CORE-LLM',
      title: {
        th: 'ระบบวิเคราะห์สินเชื่อและตรวจจับความเสี่ยงอัตโนมัติ',
        en: 'Automated Credit Underwriting & Real-Time Risk Radar'
      },
      summary: {
        th: 'ผสาน Enterprise RAG เข้ากับโมเดลวิเคราะห์พฤติกรรมธุรกรรมแบบเรียลไทม์ ช่วยตรวจสอบเอกสารทางการเงินและประเมินความเสี่ยงได้อย่างแม่นยำภายใต้มาตรฐานความปลอดภัยระดับธนาคาร',
        en: 'Enterprise multi-modal RAG coupled with behavioral neural nets to accelerate compliance verification and institutional risk scoring.'
      },
      pipeline: [
        '1. Multi-Modal Doc OCR',
        '2. Risk Scoring Neural Net',
        '3. Instant Decision API'
      ],
      metric1: {
        value: '-72%',
        label: { th: 'Processing Time', en: 'Processing Time' }
      },
      metric2: {
        value: '99.6%',
        label: { th: 'Detection Accuracy', en: 'Detection Accuracy' }
      }
    },
    healthcare: {
      key: 'healthcare',
      name: { th: 'Healthcare', en: 'Healthcare' },
      tag: 'BLUEPRINT // MED-SOVEREIGN-AI',
      title: {
        th: 'ระบบผู้ช่วยวิเคราะห์ข้อมูลทางการแพทย์และคัดกรองผู้ป่วยอัจฉริยะ',
        en: 'Sovereign Clinical Intelligence & Smart Patient Triage'
      },
      summary: {
        th: 'ติดตั้งบนเซิร์ฟเวอร์ส่วนตัวของโรงพยาบาล (On-Premise) เพื่อสรุปประวัติการรักษา วิเคราะห์ภาพถ่ายทางการแพทย์ และจัดลำดับความเร่งด่วนอย่างปลอดภัยตามมาตรฐาน PDPA & HIPAA',
        en: 'On-premise air-gapped medical LLM assisting with EHR summarization, diagnostic imaging triage, and patient prioritization.'
      },
      pipeline: [
        '1. Air-Gapped Clinical LLM',
        '2. Diagnostic Imaging Assist',
        '3. Smart Triage Workflow'
      ],
      metric1: {
        value: '-61%',
        label: { th: 'Admin Workload', en: 'Admin Workload' }
      },
      metric2: {
        value: '100%',
        label: { th: 'Patient Data Privacy', en: 'Patient Data Privacy' }
      }
    },
    retail: {
      key: 'retail',
      name: { th: 'Retail', en: 'Retail' },
      tag: 'BLUEPRINT // HYPER-PERSONALIZE',
      title: {
        th: 'ระบบแนะนำสินค้าอัจฉริยะและคาดการณ์ความต้องการตลาด',
        en: 'Hyper-Personalized Recommendation & Demand Forecasting'
      },
      summary: {
        th: 'วิเคราะห์พฤติกรรมลูกค้าแบบเฉพาะบุคคล (Hyper-Personalization) แบบเรียลไทม์ พร้อมพยากรณ์ยอดขายและบริหารจัดการสต็อกสินค้าอัตโนมัติ',
        en: 'Real-time contextual personalization engine driving conversion uplifts while synchronizing dynamic supply chain replenishment.'
      },
      pipeline: [
        '1. Behavioral Stream',
        '2. Demand Forecasting',
        '3. Omnichannel Concierge'
      ],
      metric1: {
        value: '+38%',
        label: { th: 'Conversion Uplift', en: 'Conversion Uplift' }
      },
      metric2: {
        value: '-31%',
        label: { th: 'Inventory Waste', en: 'Inventory Waste' }
      }
    }
  }

  const mockDeployments: DeploymentModel[] = [
    {
      id: 'dep-1',
      code: '01 / CLOUD API',
      title: { th: 'Managed AI Cloud', en: 'Managed AI Cloud' },
      description: {
        th: 'เริ่มต้นใช้งานได้อย่างรวดเร็วผ่าน Dedicated API ความเร็วสูง พร้อมระบบ Auto-scaling รองรับปริมาณการใช้งานไม่จำกัด',
        en: 'Rapid onboarding via dedicated high-throughput endpoints with fully managed automated scaling.'
      },
      features: [
        { th: 'Deploy ภายใน 48 ชั่วโมง', en: 'Deploy in under 48 hours' },
        { th: 'SLA Uptime 99.99%', en: '99.99% Guaranteed SLA Uptime' }
      ],
      theme: 'light'
    },
    {
      id: 'dep-2',
      code: '02 / HYBRID ENTERPRISE',
      badge: 'Recommended',
      title: { th: 'Hybrid Private VPC', en: 'Hybrid Private VPC' },
      description: {
        th: 'ผสานพลังการประมวลผลบน Cloud เข้ากับฐานข้อมูลภายในองค์กรอย่างปลอดภัย ควบคุมสิทธิ์การเข้าถึงได้ละเอียดทุกขั้นตอน',
        en: 'Bridge secure cloud computing with sovereign internal databases with granular zero-trust IAM control.'
      },
      features: [
        { th: 'Custom Fine-tuned Models', en: 'Custom Fine-tuned Models' },
        { th: 'Zero Data Retention Policy', en: 'Zero Data Retention Policy' }
      ],
      theme: 'highlight'
    },
    {
      id: 'dep-3',
      code: '03 / SOVEREIGN ON-PREMISE',
      title: { th: 'Dedicated On-Premise', en: 'Dedicated On-Premise' },
      description: {
        th: 'ติดตั้งระบบ AI เต็มรูปแบบภายใน Data Center ขององค์กร สำหรับธุรกิจการเงิน พลังงาน และหน่วยงานที่ต้องการความปลอดภัยสูงสุด',
        en: 'Complete air-gapped deployment on institutional bare-metal infrastructure for high-compliance sectors.'
      },
      features: [
        { th: '100% Air-Gapped Capable', en: '100% Air-Gapped Capable' },
        { th: 'Full Model Weights Ownership', en: 'Full Model Weights Ownership' }
      ],
      theme: 'dark'
    }
  ]

  const mockPartners: PartnerBrand[] = [
    { id: '1', name: 'NEXUS CORP' },
    { id: '2', name: 'AETHER BANK' },
    { id: '3', name: 'VORTEX ENERGY' },
    { id: '4', name: 'SYNAPSE LABS' },
    { id: '5', name: 'KINETIC GROUP' }
  ]

  // Helper: use internal Docker service URL during SSR, public URL in browser
  const apiBase = import.meta.server && process.env.NUXT_INTERNAL_STRAPI_URL
    ? process.env.NUXT_INTERNAL_STRAPI_URL
    : strapiUrl

  // ----------------------------------------------------------------------------
  // API Methods (Strapi v5 Compatible + Graceful Fallback)
  // ----------------------------------------------------------------------------
  const getHeroContent = async (): Promise<HeroContent> => {
    if (useMock) return mockHero
    try {
      const res = await $fetch<{ data: any }>(`${apiBase}/api/site-setting`)
      if (res?.data?.hero_title_th) {
        return {
          badge: { th: res.data.hero_badge || mockHero.badge.th, en: res.data.hero_badge || mockHero.badge.en },
          title: { th: res.data.hero_title_th, en: res.data.hero_title_en || res.data.hero_title_th },
          subtitle: { th: res.data.hero_subtitle_th || mockHero.subtitle.th, en: res.data.hero_subtitle_en || mockHero.subtitle.en },
          primaryCtaText: mockHero.primaryCtaText,
          secondaryCtaText: mockHero.secondaryCtaText,
          hintText: mockHero.hintText
        }
      }
      return mockHero
    } catch (e) {
      return mockHero
    }
  }

  const getNewsArticles = async () => {
    if (useMock) return null
    try {
      const res = await $fetch<{ data: any[] }>(`${apiBase}/api/news-articles?populate=*&sort=id:desc`)
      if (!Array.isArray(res?.data) || res.data.length === 0) return null
      const list = res.data.map(item => {
        const u = item.image?.url
        const uploadedImg = u ? (u.startsWith('http') ? u : `${strapiUrl}${u}`) : null
        return {
          id: item.id,
          tag: item.tag || item.category || 'Enterprise Software',
          category: item.category || 'Enterprise Software',
          readTime: item.readTime || '1 min',
          date: { th: item.date_th || '', en: item.date_en || item.date_th || '' },
          title: { th: item.title_th, en: item.title_en || item.title_th },
          subtitle: { th: item.subtitle_th || '', en: item.subtitle_en || item.subtitle_th || '' },
          body: { th: item.body_th || '', en: item.body_en || item.body_th || '' },
          fullContent: { th: item.fullContent_th || '', en: item.fullContent_en || item.fullContent_th || '' },
          image: uploadedImg || item.imageUrl || '/images/news/iso29110.jpg',
          link: item.externalLink || undefined,
          _sort: newsDateValue(item.date_en || item.date_th)
        }
      })
      // Newest news date first; articles without a parseable date go last.
      list.sort((a, b) => {
        const va = a._sort, vb = b._sort
        if (Number.isNaN(va) && Number.isNaN(vb)) return 0
        if (Number.isNaN(va)) return 1
        if (Number.isNaN(vb)) return -1
        return vb - va
      })
      return list
    } catch (e) {
      console.warn('Strapi News API fallback to local data:', e)
      return null
    }
  }

  const getProductsFromCms = async () => {
    if (useMock) return null
    try {
      const res = await $fetch<{ data: any[] }>(`${apiBase}/api/products?populate=*&sort=id:asc`)
      if (!Array.isArray(res?.data) || res.data.length === 0) return null
      return res.data.map(item => {
        const uploadedImg = item.image?.url ? `${strapiUrl}${item.image.url}` : null
        return {
          ...item,
          resolvedImage: uploadedImg || item.imageUrl || null
        }
      })
    } catch (e) {
      console.warn('Strapi Products API fallback to local data:', e)
      return null
    }
  }

  const getClientPartnersFromCms = async () => {
    if (useMock) return null
    try {
      const res = await $fetch<{ data: any[] }>(`${apiBase}/api/client-partners?populate=*&sort=id:asc`)
      if (!Array.isArray(res?.data) || res.data.length === 0) return null
      return res.data
    } catch (e) {
      console.warn('Strapi Clients API fallback to local data:', e)
      return null
    }
  }

  const submitContactInquiry = async (payload: {
    contactName: string
    organization: string
    phone?: string
    email: string
    subject?: string
    interestedProduct?: string
    details?: string
  }, guard: { startedAt?: number; honeypot?: string } = {}): Promise<{ success: boolean; message: string }> => {
    const isTh = useAppI18n().locale.value === 'th'
    // Anti-spam (client side): honeypot filled or form sent too fast → pretend success, send nothing.
    const elapsed = guard.startedAt ? Date.now() - guard.startedAt : 0
    if (guard.honeypot || (guard.startedAt && elapsed < 3000)) {
      await new Promise(r => setTimeout(r, 600))
      return { success: true, message: 'ok' }
    }
    // Simple cooldown so double clicks / repeated sends don't flood the inbox.
    try {
      const last = Number(localStorage.getItem('igenco_contact_last') || 0)
      if (Date.now() - last < 60_000) {
        return { success: false, message: isTh ? 'คุณเพิ่งส่งข้อความไป กรุณารอ 1 นาทีแล้วลองใหม่' : 'You just sent a message. Please wait a minute and try again.' }
      }
    } catch {}
    if (useMock) {
      console.log('[MOCK API] Contact Inquiry:', payload)
      await new Promise(r => setTimeout(r, 500))
      return { success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว (Mock)' }
    }
    try {
      await $fetch(`${apiBase}/api/contact-inquiries`, {
        method: 'POST',
        headers: { 'X-Form-Elapsed': String(elapsed || ''), 'X-Form-HP': '' },
        body: { data: payload }
      })
      try { localStorage.setItem('igenco_contact_last', String(Date.now())) } catch {}
      return { success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว' }
    } catch (err: any) {
      console.error('Error submitting contact inquiry to Strapi:', err)
      const status = err?.statusCode || err?.status
      if (status === 429) {
        return { success: false, message: isTh ? 'ส่งข้อความบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่ หรือโทรหาเราโดยตรง' : 'Too many messages. Please wait a moment or call us directly.' }
      }
      const serverMsg = err?.data?.error?.message
      return { success: false, message: serverMsg || (isTh ? 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่' : 'Could not send. Please try again.') }
    }
  }

  const getCapabilities = async (): Promise<CapabilityItem[]> => {
    return mockCapabilities
  }

  const getBlueprints = async (): Promise<Record<string, IndustryBlueprint>> => {
    return mockBlueprints
  }

  const getDeployments = async (): Promise<DeploymentModel[]> => {
    return mockDeployments
  }

  const getPartners = async (): Promise<PartnerBrand[]> => {
    return mockPartners
  }

  const submitDemoLead = async (payload: DemoLeadForm, guard: { startedAt?: number; honeypot?: string } = {}): Promise<{ success: boolean; message: string }> => {
    return submitContactInquiry({
      contactName: payload.fullName,
      organization: payload.companyName,
      email: payload.workEmail,
      subject: 'นัดสาธิตการใช้งานระบบ (Modal Request Demo)',
      interestedProduct: payload.industry || 'Enterprise AI',
      details: payload.notes || `Industry: ${payload.industry || '-'}`
    }, guard)
  }

  const getSiteSetting = () => {
    return useState('igenco_site_setting', () => ({
      hero_badge: 'NEXT-GEN ENTERPRISE AI ARCHITECTURE',
      hero_title_th: 'ยกระดับองค์กรสู่อนาคต ด้วยสถาปัตยกรรม AI อัจฉริยะ',
      hero_title_en: 'Elevating Enterprises with Autonomous AI Architecture',
      hero_subtitle_th: 'ออกแบบและพัฒนาโซลูชันปัญญาประดิษฐ์ระดับองค์กร ผสานความแม่นยำของข้อมูล ความปลอดภัยสูงสุด และประสบการณ์ดิจิทัลที่ไร้รอยต่อ',
      hero_subtitle_en: 'Designing enterprise artificial intelligence solutions blending data precision, military-grade security, and seamless digital transformation.',
      company_name_th: 'บริษัท ไอเจนโก้ จำกัด',
      company_name_en: 'IGENCO Co., Ltd.',
      address_th: '89/35 อาคารจูเคี่ยวเล้ง ชั้น 3 ถนนวิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กรุงเทพมหานคร 10210',
      address_en: '89/35 Chu Kiao Leng Bldg., 3rd Fl., Vibhavadi Rangsit Rd., Sanambin, Don Mueang, Bangkok 10210',
      phone: '0-2523-3559, 0-2523-3560, 063-525-4850',
      email: 'sales@igenco.co.th',
      taxId: '0115553003741',
      officeHours_th: 'จันทร์ - ศุกร์ เวลา 08:30 - 17:30 น.',
      officeHours_en: 'Mon - Fri, 08:30 - 17:30'
    }))
  }

  const refreshSiteSetting = async () => {
    const state = getSiteSetting()
    if (useMock) return state.value
    try {
      const res = await $fetch<{ data: any }>(`${apiBase}/api/site-setting`)
      if (res?.data) {
        state.value = {
          ...state.value,
          ...res.data
        }
      }
    } catch (e) {
      console.warn('Strapi SiteSetting fallback to default:', e)
    }
    return state.value
  }

  return {
    getHeroContent,
    getSiteSetting,
    refreshSiteSetting,
    getNewsArticles,
    getProductsFromCms,
    getClientPartnersFromCms,
    submitContactInquiry,
    getCapabilities,
    getBlueprints,
    getDeployments,
    getPartners,
    submitDemoLead
  }
}
