import { ref } from 'vue'
import type { ChatMessage } from '~/types/concierge'

export const useAiConcierge = () => {
  const messages = ref<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: 'สวัสดีครับ! ผมคือ AI GENCO ผู้ช่วยอัจฉริยะประจำ บริษัท ไอเจนโก้ จำกัด (IGENCO) พร้อมให้คำแนะนำเกี่ยวกับผลิตภัณฑ์ซอฟต์แวร์ระดับองค์กร มาตรฐาน ISO/IEC 29110 กลุ่มผู้ใช้งาน และการนัดสาธิตระบบครับ มีเรื่องใดให้ผมช่วยเหลือไหมครับ?',
      timestamp: new Date()
    }
  ])

  const isTyping = ref(false)

  const presetQuestions = [
    '📦 แนะนำผลิตภัณฑ์ซอฟต์แวร์ทั้งหมด',
    '👥 กลุ่มผู้ใช้ผลิตภัณฑ์และลูกค้าองค์กร',
    '📑 iSmartFlow (ระบบงานสารบรรณอิเล็กทรอนิกส์)',
    '🛡️ I-SERFF Enterprise (มาตรฐาน คปภ.)',
    '🏢 เกี่ยวกับ IGENCO และมาตรฐาน ISO 29110',
    '📞 ข้อมูลติดต่อและนัดหมายสาธิต (Demo)'
  ]

  const sendMessage = async (userText: string) => {
    const text = userText.trim()
    if (!text) return

    // Add user message
    messages.value.push({
      id: String(Date.now()),
      sender: 'user',
      content: text,
      timestamp: new Date()
    })

    isTyping.value = true

    setTimeout(() => {
      let reply = 'ขอบคุณสำหรับข้อความครับ! AI GENCO ยินดีให้บริการ หากท่านต้องการคำปรึกษาเฉพาะทาง นัดสาธิตระบบ (Demo) หรือขอใบเสนอราคา สามารถแจ้งเรื่องได้เลย หรือคลิกปุ่ม "นัดหมายสาธิตระบบ" ด้านล่างได้ทันทีครับ'

      const lower = text.toLowerCase()

      if (lower.includes('ผลิตภัณฑ์ทั้งหมด') || lower.includes('แนะนำผลิตภัณฑ์') || lower.includes('product') || lower.includes('มีอะไรบ้าง') || lower.includes('ซอฟต์แวร์ทั้งหมด')) {
        reply = 'บริษัท ไอเจนโก้ จำกัด พัฒนาและให้บริการโซลูชันซอฟต์แวร์ระดับองค์กร 4 ระบบหลักครับ:\n\n' +
          '1. 📑 iSmartFlow — ระบบบริหารสำนักงานอิเล็กทรอนิกส์ (e-Office / e-Saraban) และสายอนุมัติอัตโนมัติ ลดกระดาษ 100%\n' +
          '2. 💼 HR.ai Platform 2026 — ระบบบริหารงานบุคคลอัจฉริยะ ครอบคลุมลงเวลา เงินเดือน ภาษี สวัสดิการ และประเมิน KPI\n' +
          '3. 🛡️ I-SERFF Enterprise — ระบบยื่นขอรับความเห็นชอบแบบและข้อความกรมธรรม์ประกันภัย เชื่อมต่อมาตรฐาน คปภ.\n' +
          '4. 🎫 iGenQ — ระบบจัดคิวและบริการอัจฉริยะ (Smart Queuing) ลดเวลารอคอยของผู้รับบริการ\n\n' +
          'ท่านสนใจสอบถามรายละเอียดหรือฟังก์ชันของระบบใดเป็นพิเศษไหมครับ?'
      } else if (lower.includes('ismartflow') || lower.includes('smartflow') || lower.includes('สารบรรณ') || lower.includes('เอกสาร') || lower.includes('office') || lower.includes('saraban')) {
        reply = '📑 iSmartFlow (e-Saraban & e-Office Automation):\n\n' +
          '• จัดการงานสารบรรณ รับ-ส่งหนังสือราชการและหนังสือภายใน-ภายนอกองค์กร\n' +
          '• ระบบตรวจทาน เกษียณหนังสือ และลงนามอิเล็กทรอนิกส์ (Digital Signature) ถูกต้องตามกฎหมาย\n' +
          '• กำหนดเส้นทางเดินเอกสารและสายการอนุมัติ (Workflow) ได้ยืดหยุ่นตามโครงสร้างหน่วยงาน\n' +
          '• สถาปัตยกรรม Cloud Native และ API Ready ปลอดภัยตามมาตรฐานสากล'
      } else if (lower.includes('hr.ai') || lower.includes('hr') || lower.includes('เงินเดือน') || lower.includes('บุคคล') || lower.includes('payroll') || lower.includes('kpi')) {
        reply = '💼 HR.ai Platform 2026 (ระบบบริหารทรัพยากรบุคคลอัจฉริยะ):\n\n' +
          '• บันทึกเวลาเข้า-ออกงานผ่าน Mobile GPS, ใบหน้า หรือเครื่องสแกนนิ้ว\n' +
          '• ระบบคำนวณเงินเดือน (Payroll) ภาษี หัก ณ ที่จ่าย และประกันสังคมอัตโนมัติ 100% แม่นยำ\n' +
          '• พอร์ทัลพนักงาน (ESS/MSS) ขอลา เบิกค่าใช้จ่าย และดูสลิปเงินเดือนออนไลน์\n' +
          '• โมดูลประเมินผลการปฏิบัติงานตาม KPI และ Competency แบบรอบทิศทาง'
      } else if (lower.includes('i-serff') || lower.includes('serff') || lower.includes('คปภ') || lower.includes('ประกัน') || lower.includes('oic')) {
        reply = '🛡️ I-SERFF Enterprise (ระบบมาตรฐาน คปภ.):\n\n' +
          '• ระบบยื่นขอรับความเห็นชอบแบบและข้อความกรมธรรม์ประกันภัยทางอิเล็กทรอนิกส์\n' +
          '• เชื่อมต่อระบบงานของ สำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย (คปภ.)\n' +
          '• ตรวจสอบความถูกต้องของโครงสร้างเอกสารและไฟล์แนบก่อนส่งมอบ\n' +
          '• สถาปัตยกรรม Zero-Trust และผ่านมาตรฐานรับรอง ISO/IEC 29110'
      } else if (lower.includes('igenq') || lower.includes('คิว') || lower.includes('queue') || lower.includes('รอคิว')) {
        reply = '🎫 iGenQ (ระบบจัดคิวอัจฉริยะสำหรับองค์กร):\n\n' +
          '• จัดการลำดับคิวและแบ่งหมวดหมู่การให้บริการตามเคาน์เตอร์อัตโนมัติ\n' +
          '• จองคิวล่วงหน้าผ่านสมาร์ทโฟนและรับแจ้งเตือนเมื่อใกล้ถึงคิว\n' +
          '• หน้าจอ Dashboard แสดงผลสถิติและระยะเวลาการให้บริการแบบ Real-Time\n' +
          '• เหมาะสำหรับโรงพยาบาล สถาบันการเงิน และศูนย์บริการประชาชน'
      } else if (lower.includes('กลุ่มผู้ใช้') || lower.includes('ผู้ใช้') || lower.includes('ลูกค้า') || lower.includes('ใครใช้') || lower.includes('client')) {
        reply = '👥 กลุ่มผู้ใช้ผลิตภัณฑ์และลูกค้าที่ไว้วางใจ IGENCO:\n\n' +
          '1. 🏛️ สำนักงาน คปภ. และธุรกิจประกันภัย — ใช้งานระบบยื่นแบบกรมธรรม์ I-SERFF ทั่วประเทศ\n' +
          '2. 🏛️ หน่วยงานภาครัฐและกระทรวง — ใช้งานระบบงานสารบรรณอิเล็กทรอนิกส์ iSmartFlow\n' +
          '3. 🏢 องค์กรธุรกิจและรัฐวิสาหกิจ — ใช้งานระบบบริหารทรัพยากรบุคคล HR.ai\n' +
          '4. 🏥 โรงพยาบาลและศูนย์บริการประชาชน — ใช้งานระบบจัดคิวอัจฉริยะ iGenQ\n\n' +
          'สามารถกดที่ปุ่ม "กลุ่มผู้ใช้ผลิตภัณฑ์" บนแถบเมนูเพื่อดูรายละเอียดเพิ่มเติมได้ครับ!'
      } else if (lower.includes('เกี่ยวกับ') || lower.includes('iso') || lower.includes('29110') || lower.includes('บริษัท') || lower.includes('ประวัติ') || lower.includes('8 ปี')) {
        reply = '🏢 เกี่ยวกับ บริษัท ไอเจนโก้ จำกัด (IGENCO Co., Ltd.):\n\n' +
          '• ก่อตั้งและดำเนินธุรกิจพัฒนาซอฟต์แวร์ระดับองค์กรมาอย่างยาวนานกว่า 8 ปี\n' +
          '• ผ่านการรับรองมาตรฐานสากล ISO/IEC 29110 ด้านกระบวนการบริหารโครงการและสร้างซอฟต์แวร์\n' +
          '• มุ่งมั่นยกระดับสมรรถนะองค์กรภาครัฐและเอกชนด้วยเทคโนโลยีสารสนเทศที่มั่นคงและมีประสิทธิภาพสูงสุด'
      } else if (lower.includes('ที่อยู่') || lower.includes('โทร') || lower.includes('อีเมล') || lower.includes('email') || lower.includes('เบอร์') || lower.includes('ติดต่อ') || lower.includes('tax') || lower.includes('แผนที่')) {
        reply = '📍 ช่องทางการติดต่อ บริษัท ไอเจนโก้ จำกัด (IGENCO.Co.,Ltd):\n\n' +
          '🏢 ที่อยู่: 89/35 อาคารจูเคี่ยวเล้ง ชั้น 3 ถนนวิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กรุงเทพมหานคร 10210\n' +
          '📞 โทรศัพท์: 0-2523-3559 (ชั้น 2), 0-2523-3560 (ชั้น 3), 063-5254850\n' +
          '✉️ อีเมล: sales@igenco.co.th\n' +
          '📄 เลขประจำตัวผู้เสียภาษี: 0115553003741\n' +
          '🕒 เวลาทำการ: วันจันทร์ – วันศุกร์ เวลา 08:30 – 17:30 น.'
      } else if (lower.includes('สาธิต') || lower.includes('demo') || lower.includes('นัด') || lower.includes('ราคา') || lower.includes('ใบเสนอราคา') || lower.includes('tor')) {
        reply = '📅 ท่านสามารถนัดหมายสาธิตระบบ (Demo) หรือขอใบเสนอราคา (TOR / Quote) ได้ทันทีครับ:\n\n' +
          '• เลื่อนลงไปยังส่วน "ติดต่อเราเพื่อปรึกษาและนัดสาธิตระบบ" ด้านล่างของเว็บไซต์\n' +
          '• หรือกรอกแบบฟอร์มติดต่อ ทีมวิศวกรซอฟต์แวร์ของเราจะติดต่อกลับภายใน 1 วันทำการครับ'
      }

      messages.value.push({
        id: String(Date.now() + 1),
        sender: 'assistant',
        content: reply,
        timestamp: new Date()
      })
      isTyping.value = false
    }, 400)
  }

  return {
    messages,
    isTyping,
    presetQuestions,
    sendMessage
  }
}

