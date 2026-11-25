<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppI18n } from '~/composables/useI18n'
import { useAppModal } from '~/composables/useModal'

const { locale } = useAppI18n()
const { openDemo, openChat } = useAppModal()

export interface ProductItem {
  id: string
  number: string
  categoryKey: 'enterprise-software' | 'service-development' | 'ecommerce'
  categoryName: string
  title: string
  titleColor?: string
  borderColor?: string
  gradeText: string
  gradeColor: 'emerald' | 'sky' | 'amber'
  description: string
  fullDescription?: string
  features?: string[]
  tags: string[]
  priceText: string
  imageType: 'photo' | 'graphic'
  imageUrl?: string
}

// Active States
const selectedLauncherId = ref<string>('hr-ai-platform')
const activeCategory = ref<string>('all')
const selectedProduct = ref<ProductItem | null>(null)

// 4 Categories matching design screenshot
const categories = computed(() => [
  { key: 'all', name: locale.value === 'th' ? 'ทั้งหมด' : 'All Products', count: 9 },
  { key: 'enterprise-software', name: 'Enterprise Software', count: 5 },
  { key: 'service-development', name: 'Service Development', count: 3 },
  { key: 'ecommerce', name: 'E-Commerce', count: 1 }
])

// 9 App Launcher Items matching Apple iOS Inspired Quick Launcher
const appLaunchers = [
  {
    id: 'hr-ai-platform',
    name: 'HR.ai 2026',
    badge: 'NEW',
    badgeColor: 'bg-[#0284C7] text-white',
    iconBg: 'bg-gradient-to-br from-[#0284C7] to-[#0369A1]',
    iconColor: 'text-white'
  },
  {
    id: 'ismartflow',
    name: 'iSmartFlow',
    badge: null,
    iconBg: 'bg-gradient-to-br from-[#00C978] to-[#059669]',
    iconColor: 'text-white'
  },
  {
    id: 'iserff-enterprise',
    name: 'I-SERFF',
    badge: null,
    iconBg: 'bg-gradient-to-br from-[#064E3B] to-[#032B20]',
    iconColor: 'text-[#00E588]'
  },
  {
    id: 'efms-filing',
    name: 'EFMS Suite',
    badge: null,
    iconBg: 'bg-gradient-to-br from-[#0D9488] to-[#0F766E]',
    iconColor: 'text-white'
  },
  {
    id: 'rag-engine',
    name: 'AI RAG',
    badge: 'AI',
    badgeColor: 'bg-[#00C978] text-[#09140E]',
    iconBg: 'bg-gradient-to-br from-[#09140E] to-[#122A1E]',
    iconColor: 'text-[#00E588]'
  },
  {
    id: 'agentic-core',
    name: 'Agentic AI',
    badge: null,
    iconBg: 'bg-gradient-to-br from-[#4F46E5] to-[#4338CA]',
    iconColor: 'text-white'
  },
  {
    id: 'eprocurement-pro',
    name: 'e-Procure',
    badge: null,
    iconBg: 'bg-gradient-to-br from-[#EA580C] to-[#C2410C]',
    iconColor: 'text-white'
  },
  {
    id: 'idp-ocr',
    name: 'AI OCR',
    badge: null,
    iconBg: 'bg-gradient-to-br from-[#1F2937] to-[#111827]',
    iconColor: 'text-white'
  },
  {
    id: 'smart-erp',
    name: 'ERP & WMS',
    badge: null,
    iconBg: 'bg-gradient-to-br from-[#059669] to-[#047857]',
    iconColor: 'text-white'
  }
]

// English translations dictionary for dynamic locale switching
const enTranslations: Record<string, { categoryName?: string; title?: string; description?: string; fullDescription?: string; features?: string[]; priceText?: string }> = {
  ismartflow: {
    categoryName: 'Smart Software',
    title: 'iSmartFlow',
    description: 'Electronic office administration system (e-Office / e-Saraban) and automated approval routing, streamlining enterprise document workflows.',
    fullDescription: 'iSmartFlow is an enterprise e-Office & e-Saraban platform certified under ISO/IEC 29110 standards. It features legally-binding Digital Signatures, dynamic multi-tier approval routing, and seamless REST API integrations.',
    features: [
      'Electronic document lifecycle: dispatch, receipt, endorsement, and digital signature',
      'Fully customizable, multi-tier dynamic approval workflows',
      'Omnichannel alerts via LINE Notify, Email, and Mobile Web',
      'Optical Character Recognition (OCR) and high-speed full-text search'
    ],
    priceText: 'Contact Sales'
  },
  'hr-ai-platform': {
    categoryName: 'HR Management',
    title: 'HR.ai Platform 2026',
    description: 'Smart Human Resource Management platform encompassing Time Attendance, Automated Payroll, Flexible Benefits, and OKRs/KPIs.',
    fullDescription: 'HR.ai Platform 2026 elevates human capital management with AI-powered automation, mobile GPS time tracking, Thai labor law-compliant payroll, flexible benefit plans, and 360-degree performance intelligence.',
    features: [
      'Mobile time attendance with facial recognition and geo-fenced GPS',
      '1-click payroll, social security, withholding tax, and bank file generation',
      'Comprehensive Employee Self-Service (ESS) and Manager Portals (MSS)',
      '360-degree smart OKR and KPI evaluation dashboards'
    ],
    priceText: 'Starts 15,000 THB/mo'
  },
  'iserff-enterprise': {
    categoryName: 'OIC Regulatory Standard',
    title: 'I-SERFF Enterprise',
    description: 'Electronic insurance policy filing and endorsement submission system compliant with OIC national regulatory standards.',
    fullDescription: 'Purpose-built to interface with the Office of Insurance Commission (OIC) I-SERFF infrastructure, enabling non-life and life insurance enterprises to validate and submit regulatory filings with bank-grade encryption.',
    features: [
      'Direct API integration with the OIC regulatory gateway',
      'Automated document completeness & schema compliance validation',
      'Zero-trust security and end-to-end cryptographic encryption',
      'Real-time regulatory approval status tracking and audit trail'
    ],
    priceText: 'Tailored for Enterprise'
  },
  'efms-filing': {
    categoryName: 'DPA RegTech System',
    title: 'EFMS Data Filing Suite',
    description: 'Electronic filing and data exchange gateway between the Deposit Protection Agency and member financial institutions.',
    fullDescription: 'A high-throughput electronic filing pipeline connecting commercial banks with the Deposit Protection Agency (DPA), guaranteeing 99.99% availability and cryptographic data integrity.',
    features: [
      'AES-256 encrypted banking file interchange protocols',
      'Automated deposit data structure validation & anomaly detection',
      'Comprehensive immutable audit logging for regulatory inspection'
    ],
    priceText: 'Contact Sales'
  },
  'rag-engine': {
    categoryName: 'AI & Knowledge Base',
    title: 'AI Knowledge & RAG Engine',
    description: 'Enterprise semantic search and RAG synthesis engine with 100% verified citations, zero hallucination.',
    fullDescription: 'Unleash sovereign Large Language Models atop internal document repositories, transforming corporate policies, manuals, and compliance archives into an interactive, verifiable Knowledge Graph.',
    features: [
      'Bilingual Thai/English deep semantic retrieval',
      'Exact citation page references on every response for total audibility',
      'Deployable On-Premise or in dedicated Sovereign Private Cloud'
    ],
    priceText: 'Starts 29,000 THB/mo'
  },
  'agentic-core': {
    categoryName: 'Autonomous AI',
    title: 'Autonomous Agentic Core',
    description: 'Autonomous cognitive AI agent network collaborating 24/7 with human teams for automated workflow execution.',
    fullDescription: 'Multi-Agent collaborative intelligence that plans, reasons, and executes multi-stage enterprise operations with human-in-the-loop governance.',
    features: [
      'Multi-Agent orchestration architecture with shared memory',
      'Secure external API & database tool invocation framework',
      'Human-in-the-loop approval gates for critical actions'
    ],
    priceText: 'Custom Assessment'
  },
  'eprocurement-pro': {
    categoryName: 'Procurement & Contract',
    title: 'e-Procurement & Contract',
    description: 'Comprehensive procurement lifecycle management, e-Bidding auctions, and transparent contract tracking.',
    fullDescription: 'Comprehensive procurement lifecycle management from PR/PO initiation, online e-Bidding auctions, vendor vetting, through goods receipt and ERP reconciliation.',
    features: [
      'Full compliance with Ministry of Finance procurement regulations',
      'Interactive Vendor Portal for online bid submission and invoice tracking',
      'Automated multi-criteria price comparison and scoring analytics'
    ],
    priceText: 'Contact Sales'
  },
  'idp-ocr': {
    categoryName: 'Smart AI OCR',
    title: 'AI Vision & Document OCR',
    description: 'High-precision intelligent document processing to extract structured data from tax invoices, IDs, and financial contracts.',
    fullDescription: 'Converts scanned paperwork and digital PDFs into ERP-ready structured data using specialized Computer Vision and Thai-English NLP models.',
    features: [
      'Scans receipts, tax invoices, national IDs, and structured business forms',
      '>99.4% extraction accuracy on complex Thai fonts and numerical tables',
      'Automated structured data dispatch to SAP, Oracle, and enterprise ERPs'
    ],
    priceText: 'Starts 19,000 THB/mo'
  },
  'smart-erp': {
    categoryName: 'ERP & Warehouse',
    title: 'Enterprise ERP & Inventory',
    description: 'Enterprise resource planning & smart inventory management linking supply chain, accounting, and barcode/QR logistics.',
    fullDescription: 'Real-time multi-branch ERP and inventory optimization, tracking stock movements, profitability analytics, and AI predictive demand forecasting.',
    features: [
      'Real-time multi-warehouse inventory and barcode tracking',
      'Integrated general ledger, corporate finance, and budget allocation',
      'Predictive sales trends and automated re-order planning',
      'Unified Point of Sale (POS) and omnichannel e-Commerce synchronization'
    ],
    priceText: 'Tailored for Enterprise'
  }
}

const getProductField = (product: ProductItem, field: 'categoryName' | 'title' | 'description' | 'fullDescription' | 'priceText'): string => {
  if (locale.value === 'en' && enTranslations[product.id] && enTranslations[product.id][field]) {
    return enTranslations[product.id][field] as string
  }
  return product[field] || ''
}

const getProductFeatures = (product: ProductItem): string[] => {
  if (locale.value === 'en' && enTranslations[product.id] && enTranslations[product.id].features) {
    return enTranslations[product.id].features as string[]
  }
  return product.features || []
}

// 9 Products List matching Image 1, 2, 3, 4
const products = ref<ProductItem[]>([
  {
    id: 'ismartflow',
    number: '01',
    categoryKey: 'enterprise-software',
    categoryName: 'ซอฟต์แวร์อัจฉริยะ',
    title: 'iSmartFlow',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'emerald',
    description: 'ระบบบริหารสำนักงานอิเล็กทรอนิกส์ (e-Office / e-Saraban) และสายอนุมัติอัตโนมัติ ลดขั้นตอนงานเอกสารภายในองค์กรอย่างครบวงจร',
    fullDescription: 'iSmartFlow เป็นระบบบริหารจัดการงานสารบรรณอิเล็กทรอนิกส์และเอกสารเวียนภายในองค์กร (e-Saraban) ที่ออกแบบตามระเบียบสารบรรณอิเล็กทรอนิกส์ภาครัฐและมาตรฐาน ISO 29110 รองรับการลงนามดิจิทัล (Digital Signature), การสร้างสายอนุมัติแบบ Dynamic Approval Flow, และการเชื่อมต่อผ่าน REST API',
    features: [
      'ระบบสารบรรณอิเล็กทรอนิกส์ รับ-ส่ง เกษียณหนังสือ และลงนามดิจิทัล',
      'ออกแบบ Workflow สายอนุมัติได้อิสระ ไม่จำกัดลำดับขั้น',
      'แจ้งเตือนผ่าน Line Notify, Email และ Mobile Web App',
      'รองรับการค้นหาเอกสารแบบ OCR และ Full-Text Search'
    ],
    tags: ['Cloud Native', 'API Ready', 'Paperless'],
    priceText: 'ติดต่อฝ่ายขาย',
    imageType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hr-ai-platform',
    number: '02',
    categoryKey: 'enterprise-software',
    categoryName: 'บริหารทรัพยากรบุคคล',
    title: 'HR.ai Platform 2026',
    titleColor: 'text-[#0284C7]',
    borderColor: 'border-2 border-[#38BDF8] ring-4 ring-[#38BDF8]/15',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'sky',
    description: 'ระบบบริหารทรัพยากรมนุษย์อัจฉริยะ ครอบคลุมการลงเวลา คำนวณเงินเดือน ภาษี สวัสดิการ และประเมินผล KPI ครบวงจร',
    fullDescription: 'HR.ai Platform 2026 ยกระดับการบริหารงานบุคคลด้วยเทคโนโลยีปัญญาประดิษฐ์ ผสานโมดูล Time Attendance แบบ GPS Check-in, คำนวณ Payroll อัตโนมัติตามกฎหมายแรงงานไทย, บริหารสวัสดิการยืดหยุ่น (Flexible Benefits) และวิเคราะห์ Performance ด้วย AI Insights',
    features: [
      'ลงเวลางานผ่านมือถือ พร้อมระบบตรวจจับใบหน้าและพิกัด GPS',
      'คำนวณเงินเดือน ภาษี ประกันสังคม และส่งออกไฟล์ธนาคารในคลิกเดียว',
      'ระบบ Employee Self-Service (ESS) และ Manager Self-Service (MSS)',
      'ระบบประเมินผลงาน OKRs / KPIs อัจฉริยะแบบ 360 องศา'
    ],
    tags: ['Enterprise Grade', 'ESS / MSS', 'AI Analytics'],
    priceText: 'เริ่มต้น 15,000 บาท/เดือน',
    imageType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'iserff-enterprise',
    number: '03',
    categoryKey: 'enterprise-software',
    categoryName: 'ระบบมาตรฐาน คปภ.',
    title: 'I-SERFF Enterprise',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'amber',
    description: 'ระบบยื่นขอรับความเห็นชอบแบบและข้อความกรมธรรม์ประกันภัยทางอิเล็กทรอนิกส์ เชื่อมต่อมาตรฐานสำนักงาน คปภ.',
    fullDescription: 'I-SERFF Enterprise Solution พัฒนาขึ้นเพื่อเชื่อมต่อและทำงานร่วมกับระบบ I-SERFF ของสำนักงาน คปภ. โดยเฉพาะ ช่วยให้บริษัทประกันวินาศภัยและประกันชีวิตสามารถจัดเตรียม ตรวจสอบ และยื่นแบบเอกสารได้อย่างถูกต้อง รวดเร็ว ปลอดภัยตามมาตรฐานความปลอดภัยข้อมูลระดับสถาบันการเงิน',
    features: [
      'เชื่อมโยงระบบการยื่นเอกสารกับมาตรฐาน คปภ. โดยตรง',
      'ระบบตรวจสอบความครบถ้วนของเอกสารและไฟล์แนบก่อนนำส่ง',
      'มาตรการความปลอดภัย Zero-Trust และการเข้ารหัสแบบ End-to-End',
      'รายงานสถานะการขอรับความเห็นชอบแบบเรียลไทม์'
    ],
    tags: ['OIC Standard', 'Zero-Trust', 'ISO 29110'],
    priceText: 'ประเมินราคาตามขนาดองค์กร',
    imageType: 'graphic'
  },
  {
    id: 'efms-filing',
    number: '04',
    categoryKey: 'enterprise-software',
    categoryName: 'ระบบข้อมูล สคฝ.',
    title: 'EFMS Data Filing Suite',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'emerald',
    description: 'ระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ระหว่างสถาบันคุ้มครองเงินฝากและสถาบันการเงิน มาตรฐานความปลอดภัยสูงสุด',
    fullDescription: 'ระบบเชื่อมโยงและจัดเก็บข้อมูลอิเล็กทรอนิกส์ระหว่างสถาบันการเงินและสถาบันคุ้มครองเงินฝาก (สคฝ.) มั่นใจในความถูกต้องของข้อมูลเงินฝากและการประมวลผลที่มีเสถียรภาพระดับ 99.99%',
    features: [
      'ระบบรับส่งไฟล์ข้อมูลที่เข้ารหัสขั้นสูง AES-256',
      'การตรวจสอบรูปแบบและโครงสร้างข้อมูลเงินฝากอัตโนมัติ (Automated Validation)',
      'ระบบ Audit Trail บันทึกประวัติการเข้าถึงข้อมูลทุกจุด'
    ],
    tags: ['RegTech', 'AES-256', 'Audit Trail'],
    priceText: 'ติดต่อฝ่ายขาย',
    imageType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rag-engine',
    number: '05',
    categoryKey: 'service-development',
    categoryName: 'AI & Knowledge Base',
    title: 'AI Knowledge & RAG Engine',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'emerald',
    description: 'ระบบสืบค้นและสังเคราะห์ฐานความรู้องค์กรแบบ Semantic Search แม่นยำ 100% ปราศจาก AI Hallucination',
    fullDescription: 'ผสานพลัง Private Large Language Model เข้ากับฐานข้อมูลเอกสารภายในองค์กร แปลงข้อมูลนโยบาย ระเบียบปฏิบัติ และคู่มือการทำงานให้เป็น Knowledge Graph ที่ค้นหาและตอบคำถามได้อย่างชาญฉลาด',
    features: [
      'ค้นหาความหมาย (Semantic Search) ได้ทั้งภาษาไทยและอังกฤษ',
      'แสดงเอกสารและหน้าอ้างอิงทุกคำตอบ ตรวจสอบย้อนกลับได้ทันที',
      'ติดตั้งได้ทั้งแบบ On-Premise หรือ Private Cloud'
    ],
    tags: ['Private LLM', 'Semantic Search', 'Hallucination-Free'],
    priceText: 'เริ่มต้น 29,000 บาท/เดือน',
    imageType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'agentic-core',
    number: '06',
    categoryKey: 'service-development',
    categoryName: 'Autonomous AI',
    title: 'Autonomous Agentic Core',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'sky',
    description: 'ระบบตัวแทน AI อัตโนมัติ ปฏิบัติการร่วมกับมนุษย์ 24/7 เพื่อวิเคราะห์ข้อมูลเชิงลึกและบริหารขั้นตอนธุรกิจอัตโนมัติ',
    fullDescription: 'โครงข่าย Multi-Agent AI ที่สามารถแบ่งงาน วางแผน และประสานงานกันทำงานที่ซับซ้อน เช่น การสรุปรายงานการประชุม, การจัดสรรทรัพยากร, และการตรวจสอบทุจริตธุรกรรม',
    features: [
      'รองรับการทำงานแบบ Multi-Agent Collaborative Architecture',
      'เชื่อมต่อ Tool, API และฐานข้อมูลภายนอกได้อย่างปลอดภัย',
      'Human-in-the-loop มีระบบให้มนุษย์อนุมัติการตัดสินใจสำคัญ'
    ],
    tags: ['Multi-Agent', 'Real-Time', 'Workflow Automation'],
    priceText: 'ประเมินตามเวิร์กโฟลว์',
    imageType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'eprocurement-pro',
    number: '07',
    categoryKey: 'ecommerce',
    categoryName: 'จัดซื้อจัดจ้าง',
    title: 'e-Procurement & Contract',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'emerald',
    description: 'ระบบบริหารการจัดซื้อจัดจ้าง ประกวดราคา และติดตามสัญญาองค์กรอย่างโปร่งใส ตรวจสอบได้ทุกขั้นตอน',
    fullDescription: 'ระบบบริหารการจัดซื้อจัดจ้างแบบครบวงจร ตั้งแต่การเปิดขอซื้อ (PR), ขอจ้าง (PO), การประมูลออนไลน์ (e-Bidding), จนถึงการตรวจรับพัสดุและเชื่อมโยงระบบบัญชี',
    features: [
      'รองรับระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างพัสดุ',
      'ระบบ Portal สำหรับคู่ค้า (Vendor Portal) ส่งใบเสนอราคาออนไลน์',
      'เปรียบเทียบราคาและประเมินเกณฑ์การคัดเลือกอัตโนมัติ'
    ],
    tags: ['e-Bidding', 'Contract Lifecycle', 'Audit Ready'],
    priceText: 'ติดต่อฝ่ายขาย',
    imageType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'idp-ocr',
    number: '08',
    categoryKey: 'service-development',
    categoryName: 'AI OCR อัจฉริยะ',
    title: 'AI Vision & Document OCR',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'emerald',
    description: 'ระบบอ่านและแปลงข้อมูลจากเอกสารภาษาไทยและอังกฤษ ใบกำกับภาษี บัตรประชาชน และสัญญาเป็นข้อมูลดิจิทัลอัตโนมัติ',
    fullDescription: 'เปลี่ยนเอกสารกระดาษและไฟล์ภาพสแกนให้เป็นข้อมูลดิจิทัลพร้อมใช้งานในระบบ ERP ทันที ด้วยโมเดล Computer Vision & NLP ที่ผ่านการฝึกฝนเอกสารภาษาไทยเฉพาะทาง',
    features: [
      'อ่านเอกสารใบเสร็จ ใบกำกับภาษี บัตรประชาชน และแบบฟอร์มธุรกิจ',
      'ความแม่นยำภาษาไทยและตัวเลขสูงกว่า 99.4%',
      'ส่งออกข้อมูลสู่ระบบ ERP, SAP, Oracle ได้อัตโนมัติ'
    ],
    tags: ['Thai/EN OCR', 'Auto Indexing', '99.4% Accuracy'],
    priceText: 'เริ่มต้น 19,000 บาท/เดือน',
    imageType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'smart-erp',
    number: '09',
    categoryKey: 'enterprise-software',
    categoryName: 'ERP & คลังสินค้า',
    title: 'Enterprise ERP & Inventory',
    gradeText: 'ENTERPRISE GRADE',
    gradeColor: 'emerald',
    description: 'ระบบบริหารทรัพยากรองค์กร บัญชี การเงิน และบริหารคลังสินค้าอัจฉริยะ รองรับการเชื่อมต่อบาร์โค้ดและ QR Code',
    fullDescription: 'แพลตฟอร์มบริหารจัดการทรัพยากรองค์กรแบบเรียลไทม์ ติดตามสต็อกสินค้าข้ามสาขา วิเคราะห์ยอดขาย พยากรณ์ความต้องการสินค้าล่วงหน้าด้วย AI Predictive Models',
    features: [
      'บริหารจัดการสต็อก คลังสินค้า และบาร์โค้ดแบบ Real-time',
      'ระบบบัญชี การเงิน และการจัดทำงบประมาณองค์กร',
      'แดชบอร์ดสรุปผลการดำเนินงานสำหรับผู้บริหารระดับ C-Level'
    ],
    tags: ['Financial Core', 'Smart Warehouse', 'ISO 29110'],
    priceText: 'ประเมินราคาตามขนาดองค์กร',
    imageType: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  }
])

// Filtered products list based on active category
const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.categoryKey === activeCategory.value)
})

// Quick Launcher Click Action
const handleSelectLauncher = (productId: string) => {
  selectedLauncherId.value = productId
  
  // Ensure the card is visible by resetting category if filtered out
  const targetProduct = products.value.find(p => p.id === productId)
  if (targetProduct && activeCategory.value !== 'all' && targetProduct.categoryKey !== activeCategory.value) {
    activeCategory.value = 'all'
  }

  // Smooth scroll to card
  setTimeout(() => {
    const el = document.getElementById(`product-card-${productId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 50)
}

const handleInquireProduct = (product: ProductItem) => {
  openDemo()
}

const openProductModal = (product: ProductItem) => {
  selectedProduct.value = product
}

const closeProductModal = () => {
  selectedProduct.value = null
}
</script>

<template>
  <section id="products" class="relative z-10 py-20 sm:py-28 px-4 sm:px-6 bg-white border-t border-forestBlack/[0.06] scroll-mt-20">
    
    <!-- Background Tech Grid Lines -->
    <div class="absolute inset-0 bg-grid-dots pointer-events-none opacity-40"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      
      <!-- ==================================================================== -->
      <!-- QUICK APP LAUNCHER (APPLE iOS INSPIRED • 9 ENTERPRISE SOLUTIONS)      -->
      <!-- ==================================================================== -->
      <div class="mb-10 sm:mb-14">
        
        <!-- Header Bar above Launcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 px-1">
          <div class="text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase text-mutedSlate">
            QUICK APP LAUNCHER • 9 ENTERPRISE SOLUTIONS
          </div>
          <div class="text-[11px] text-mutedSlate/80 font-normal">
            {{ locale === 'th' ? 'แตะที่ไอคอนเพื่อดูสเปกผลิตภัณฑ์ทันที' : 'Tap an icon to view product specs instantly' }}
          </div>
        </div>

        <!-- Horizontal Squircle Apps Capsule Container -->
        <div class="bg-white/95 rounded-[28px] p-3 sm:p-4 border border-forestBlack/[0.08] shadow-[0_4px_25px_rgba(9,20,14,0.04)] overflow-x-auto scrollbar-none">
          <div class="flex items-center justify-between min-w-[760px] gap-2 lg:gap-3 px-1">
            
            <button
              v-for="app in appLaunchers"
              :key="app.id"
              type="button"
              @click="handleSelectLauncher(app.id)"
              class="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl transition-all duration-200 cursor-pointer group flex-1"
              :class="selectedLauncherId === app.id
                ? 'border border-[#38BDF8]/70 bg-sky-50/60 shadow-xs'
                : 'border border-transparent hover:bg-forestBlack/5'"
              :title="app.name"
            >
              <!-- Squircle Icon Capsule -->
              <div
                class="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center relative shadow-sm transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
                :class="[app.iconBg, app.iconColor]"
              >
                <!-- Badge (NEW / AI) Top Right -->
                <span
                  v-if="app.badge"
                  class="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ring-2 ring-white shadow-xs"
                  :class="app.badgeColor"
                >
                  {{ app.badge }}
                </span>

                <!-- 1. HR.ai 2026 Icon (Users / People) -->
                <svg v-if="app.id === 'hr-ai-platform'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>

                <!-- 2. iSmartFlow Icon (Document Pen) -->
                <svg v-else-if="app.id === 'ismartflow'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>

                <!-- 3. I-SERFF Icon (Shield) -->
                <svg v-else-if="app.id === 'iserff-enterprise'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>

                <!-- 4. EFMS Suite Icon (Bank Building) -->
                <svg v-else-if="app.id === 'efms-filing'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="21" x2="21" y2="21"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <polyline points="5 10 12 3 19 10"/>
                  <line x1="6" y1="14" x2="6" y2="18"/>
                  <line x1="10" y1="14" x2="10" y2="18"/>
                  <line x1="14" y1="14" x2="14" y2="18"/>
                  <line x1="18" y1="14" x2="18" y2="18"/>
                </svg>

                <!-- 5. AI RAG Icon (Brain Network) -->
                <svg v-else-if="app.id === 'rag-engine'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/>
                </svg>

                <!-- 6. Agentic AI Icon (Robot) -->
                <svg v-else-if="app.id === 'agentic-core'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                  <circle cx="12" cy="5" r="2"/>
                  <path d="M12 7v4"/>
                  <line x1="8" y1="16" x2="8" y2="16"/>
                  <line x1="16" y1="16" x2="16" y2="16"/>
                </svg>

                <!-- 7. e-Procure Icon (Document Dollar) -->
                <svg v-else-if="app.id === 'eprocurement-pro'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <path d="M10 14h3a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1h-2a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1h3"/>
                </svg>

                <!-- 8. AI OCR Icon (Scanner Frame) -->
                <svg v-else-if="app.id === 'idp-ocr'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                  <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>

                <!-- 9. ERP & WMS Icon (Warehouse / Forklift Boxes) -->
                <svg v-else-if="app.id === 'smart-erp'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>

              <!-- Label below icon -->
              <span
                class="text-[11px] font-semibold mt-2 whitespace-nowrap transition-colors"
                :class="selectedLauncherId === app.id
                  ? 'text-[#0284C7] font-bold'
                  : 'text-forestBlack/80 group-hover:text-forestBlack'"
              >
                {{ app.name }}
              </span>
            </button>

          </div>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- SECTION HEADER & CATEGORY FILTER PILLS (MATCHING SCREENSHOT)         -->
      <!-- ==================================================================== -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-14">
        
        <!-- Left: Eyebrow + Headline + Description -->
        <div class="max-w-2xl">
          <!-- Eyebrow Pill -->
          <div class="text-xs sm:text-[13px] font-mono font-semibold tracking-[0.2em] uppercase text-[#059669] mb-3">
            ENTERPRISE PRODUCTS & SOLUTIONS
          </div>

          <!-- Headline: Line 1 Black / Line 2 Green with dot -->
          <h2 class="text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight leading-[1.18] mb-4">
            <template v-if="locale === 'th'">
              <span class="text-forestBlack block">ผลิตภัณฑ์ซอฟต์แวร์และ</span>
              <span class="text-[#00A86B] block">โซลูชันองค์กร.</span>
            </template>
            <template v-else>
              <span class="text-forestBlack block">Enterprise Software &</span>
              <span class="text-[#00A86B] block">Organization Solutions.</span>
            </template>
          </h2>

          <!-- Description Matching Screenshot -->
          <p class="text-xs sm:text-sm text-mutedSlate leading-relaxed">
            {{ locale === 'th'
              ? 'ออกแบบด้วยความประณีตระดับ iOS และวิศวกรรมซอฟต์แวร์มาตรฐานสากล ISO/IEC 29110 เพื่อตอบโจทย์หน่วยงานภาครัฐ รัฐวิสาหกิจ และองค์กรเอกชน'
              : 'Crafted with iOS-grade finesse and ISO/IEC 29110 international software engineering standards to meet the demands of government agencies, state enterprises, and corporations.' }}
          </p>
        </div>

        <!-- Right: Category Filter Pills Matching Image 1 & 2 -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            v-for="cat in categories"
            :key="cat.key"
            type="button"
            @click="activeCategory = cat.key"
            class="px-4 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95"
            :class="activeCategory === cat.key
              ? 'bg-[#00C978] text-forestBlack font-bold shadow-xs'
              : 'bg-white hover:bg-forestBlack/5 text-forestBlack/80 border border-forestBlack/10'"
          >
            <span>{{ cat.name }}</span>
          </button>
        </div>

      </div>

      <!-- ==================================================================== -->
      <!-- 9 PRODUCTS 3-COLUMN GRID (MATCHING IMAGE 2, 3, 4)                    -->
      <!-- ==================================================================== -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        
        <div
          v-for="item in filteredProducts"
          :id="`product-card-${item.id}`"
          :key="item.id"
          class="bg-white rounded-[28px] p-5 sm:p-6 shadow-[0_10px_35px_rgba(9,20,14,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col group scroll-mt-28"
          :class="selectedLauncherId === item.id
            ? 'border-2 border-[#38BDF8] ring-4 ring-[#38BDF8]/15 shadow-xl'
            : (item.borderColor || 'border border-forestBlack/[0.08] hover:border-emerald-500/40')"
        >
          <!-- Card Image Thumbnail Container with Overlays -->
          <div class="relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-forestBlack/5 mb-5 flex items-center justify-center">
            
            <!-- Standard Photo Image (01, 02, 04, 05, 06, 07, 08, 09) -->
            <template v-if="item.imageType === 'photo'">
              <img
                :src="item.imageUrl"
                :alt="getProductField(item, 'title')"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
            </template>

            <!-- Custom Graphic (For Card 03 - I-SERFF Enterprise Solution Graphic) -->
            <template v-else>
              <div class="w-full h-full bg-[#051E14] flex flex-col items-center justify-center relative p-6 select-none">
                <!-- Glowing Outer Circle -->
                <div class="w-32 h-32 rounded-full border border-emerald-400/20 bg-emerald-500/5 flex items-center justify-center relative">
                  <!-- Wireframe Triangle matching Image 2 Card 03 -->
                  <svg class="w-16 h-16 text-[#00C978]/70" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polygon points="50,15 90,85 10,85"/>
                  </svg>
                </div>
                <!-- Brand Title inside Graphic -->
                <div class="text-[11px] font-mono font-bold tracking-widest text-[#00C978] uppercase mt-2">
                  IGENCO ENTERPRISE SOLUTION
                </div>
              </div>
            </template>

            <!-- Top-Left Category Badge Inside Image -->
            <div class="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-forestBlack/80 backdrop-blur-xs text-white/95 text-[11px] font-medium border border-white/10">
              {{ getProductField(item, 'categoryName') }}
            </div>

            <!-- Top-Right Number Badge Inside Image (01 - 09) -->
            <div class="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-forestBlack/80 backdrop-blur-xs text-white/95 text-[11px] font-mono font-semibold border border-white/10">
              {{ item.number }}
            </div>
          </div>

          <!-- Grade Dot & Tag (• ENTERPRISE GRADE) -->
          <div class="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider mb-2">
            <span
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-[#00C978]': item.gradeColor === 'emerald',
                'bg-[#0284C7]': item.gradeColor === 'sky',
                'bg-[#D97706]': item.gradeColor === 'amber'
              }"
            ></span>
            <span
              :class="{
                'text-[#00875A]': item.gradeColor === 'emerald',
                'text-[#0284C7]': item.gradeColor === 'sky',
                'text-[#D97706]': item.gradeColor === 'amber'
              }"
            >
              {{ item.gradeText }}
            </span>
          </div>

          <!-- Product Title -->
          <h3
            class="text-lg sm:text-xl font-bold leading-snug mb-2 transition-colors cursor-pointer"
            :class="item.titleColor || 'text-forestBlack group-hover:text-[#00875A]'"
            @click="openProductModal(item)"
          >
            {{ getProductField(item, 'title') }}
          </h3>

          <!-- Product Short Description -->
          <p class="text-xs text-mutedSlate leading-relaxed line-clamp-3 mb-4">
            {{ getProductField(item, 'description') }}
          </p>

          <!-- Feature Tag Pills -->
          <div class="flex flex-wrap items-center gap-1.5 mb-6">
            <span
              v-for="(tag, idx) in item.tags"
              :key="idx"
              class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#F8FAF9] text-mutedSlate border border-forestBlack/5"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Card Footer Action Bar Matching Image 2, 3, 4 -->
          <div class="mt-auto pt-4 border-t border-forestBlack/[0.06] flex items-center justify-between gap-2">
            
            <!-- Left: Price / Status Label -->
            <div class="text-xs font-semibold text-[#00875A] truncate max-w-[110px]" :title="getProductField(item, 'priceText')">
              {{ getProductField(item, 'priceText') }}
            </div>

            <!-- Right Buttons: [ℹ ดูรายละเอียด] & [สอบถามสินค้านี้ ↗] -->
            <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              <!-- View Details Button -->
              <button
                type="button"
                @click="openProductModal(item)"
                class="px-3 py-1.5 rounded-full text-xs font-medium text-forestBlack/80 hover:text-forestBlack bg-white hover:bg-forestBlack/5 border border-forestBlack/15 transition-all flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap"
                :title="locale === 'th' ? 'ดูรายละเอียดผลิตภัณฑ์' : 'View product details'"
              >
                <span class="text-[11px] text-mutedSlate">🛈</span>
                <span>{{ locale === 'th' ? 'ดูรายละเอียด' : 'Details' }}</span>
              </button>

              <!-- Inquire Product Button -->
              <button
                type="button"
                @click="handleInquireProduct(item)"
                class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-forestBlack hover:bg-[#00C978] text-white hover:text-forestBlack transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap"
                :title="locale === 'th' ? 'สอบถามสินค้านี้กับทีมงาน' : 'Inquire about this product'"
              >
                <span>{{ locale === 'th' ? 'สอบถามสินค้านี้' : 'Inquire' }}</span>
                <span class="text-xs text-[#00C978] group-hover:text-forestBlack">↗</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- ==================================================================== -->
    <!-- PRODUCT DETAIL MODAL (เมื่อคลิก "🛈 ดูรายละเอียด")                      -->
    <!-- ==================================================================== -->
    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 bg-forestBlack/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="closeProductModal"
    >
      <div class="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-forestBlack/10 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Close Button -->
        <button
          @click="closeProductModal"
          class="absolute top-6 right-6 w-9 h-9 rounded-full bg-forestBlack/5 hover:bg-forestBlack/10 text-mutedSlate hover:text-forestBlack flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <!-- Badge & Number -->
        <div class="flex items-center gap-2.5 mb-2">
          <span class="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E8F8F2] text-[#00875A] border border-[#B5EAD3]">
            {{ getProductField(selectedProduct, 'categoryName') }}
          </span>
          <span class="text-xs font-mono text-mutedSlate font-semibold">
            No. {{ selectedProduct.number }}
          </span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold text-forestBlack mb-3 leading-snug">
          {{ getProductField(selectedProduct, 'title') }}
        </h2>

        <!-- Description -->
        <p class="text-xs sm:text-sm text-forestBlack/80 leading-relaxed mb-5">
          {{ getProductField(selectedProduct, 'fullDescription') || getProductField(selectedProduct, 'description') }}
        </p>

        <!-- Key Features List -->
        <div v-if="getProductFeatures(selectedProduct).length > 0" class="mb-6 p-4 rounded-2xl bg-[#F8FAF9] border border-forestBlack/5">
          <h4 class="font-bold text-xs text-forestBlack mb-2.5 flex items-center gap-2">
            <span class="w-1.5 h-3.5 rounded-full bg-[#00C978]"></span>
            <span>{{ locale === 'th' ? 'จุดเด่นและคุณสมบัติสำคัญ (Key Capabilities):' : 'Key Capabilities & Features:' }}</span>
          </h4>
          <ul class="space-y-2 text-xs text-mutedSlate">
            <li v-for="(feat, i) in getProductFeatures(selectedProduct)" :key="i" class="flex items-start gap-2">
              <span class="text-[#00C978] font-bold">✓</span>
              <span>{{ feat }}</span>
            </li>
          </ul>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap items-center gap-1.5 mb-6">
          <span
            v-for="(t, idx) in selectedProduct.tags"
            :key="idx"
            class="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8FAF9] text-forestBlack/80 border border-forestBlack/10"
          >
            #{{ t }}
          </span>
        </div>

        <!-- Price & Action Footer -->
        <div class="pt-4 border-t border-forestBlack/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div class="text-[11px] text-mutedSlate">{{ locale === 'th' ? 'ประมาณการราคาเบื้องต้น:' : 'Estimated Pricing:' }}</div>
            <div class="text-sm font-bold text-[#00875A]">{{ getProductField(selectedProduct, 'priceText') }}</div>
          </div>

          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              @click="closeProductModal"
              class="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs font-semibold bg-[#F8FAF9] text-forestBlack border border-forestBlack/10 hover:bg-forestBlack/5 transition-colors cursor-pointer"
            >
              {{ locale === 'th' ? 'ปิด' : 'Close' }}
            </button>
            <button
              @click="closeProductModal(); openDemo()"
              class="flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-semibold bg-[#00C978] hover:bg-[#00B36B] text-forestBlack transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{{ locale === 'th' ? 'ขอใบเสนอราคา / นัดหมายสาธิต' : 'Request Proposal / Schedule Demo' }}</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>
