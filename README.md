# IGENCO AI — Enterprise Website Architecture

ระบบเว็บไซต์องค์กร **IGENCO AI** สถาปัตยกรรมแบบ **Headless (API-First)** พัฒนาด้วย **TypeScript** ทั้งระบบ
แยกอิสระระหว่างหน้าบ้าน (Nuxt 3) และหลังบ้าน (Strapi CMS) โดยเชื่อมต่อผ่าน REST/GraphQL API และรันผ่าน **Docker**

---

## 🏛️ สถาปัตยกรรมระบบ (System Architecture)

```
newigenco2/
├── frontend/                   # [Phase 1: พัฒนาก่อน] Nuxt 3 (Vue 3 + TypeScript + Tailwind CSS)
│   ├── assets/css/main.css     # โทนสีเขียวอ่อน Futuristic Mint & Emerald + Glassmorphism
│   ├── components/             # Bento Grid, 3D Three.js Neural Core, Modals, Concierge
│   ├── composables/            # useStrapiApi (Mock & Live API), useAppI18n, useModal
│   ├── types/                  # Typed CMS Interfaces รองรับ Strapi 1:1
│   ├── pages/index.vue         # หน้า Landing Page หลัก
│   └── Dockerfile              # Multi-stage Nuxt Container
│
├── backend/                    # [Phase 2: พัฒนาถัดไป] Strapi v5 (Headless CMS + TypeScript)
│   ├── Dockerfile              # Strapi Container
│   └── README.md               # รายละเอียด Content-Types และ API Schema
│
├── docker-compose.yml          # จัดการ 3 คอนเทนเนอร์: frontend, backend, postgres
├── .env.example                # การตั้งค่า Environment ทั่วทั้งระบบ
└── README.md
```

---

## 🎨 Design System: โทนสีเขียวอ่อน Futuristic AI (Light Green Tech)

| ชื่อสี | รหัส HEX | บทบาทการใช้งาน |
|---|---|---|
| **Soft Mint Canvas** | `#F7F9F8` | พื้นหลังหลักแบบ Off-White สะอาดตา สบายตา |
| **Emerald Core** | `#059669` | สีหลักของแบรนด์ (ปุ่ม CTA, หัวข้อ, กราฟ, จุดเน้น) |
| **Emerald Bright** | `#10B981` | สีเขียวเทคโนโลยีประกายแสง (Glowing border, Badges) |
| **Mint Glow** | `#34D399` | สีไฮไลท์และสถานะ Online ของ AI Concierge |
| **Forest Black** | `#09140E` | ข้อความหลัก และพื้นหลัง Dark Glass ตัดอารมณ์ |
| **Muted Slate** | `#526058` | ข้อความบรรยายและปุ่มเครื่องมือรอง |

---

## 🚀 แผนการทำงาน (Execution Roadmap)

### 🟢 Phase 1: พัฒนาและตรวจสอบ Frontend (ปัจจุบัน)
1. พัฒนาหน้าตาเว็บด้วย Nuxt 3 ตาม Prototype ทั้งหมด
2. นำ Three.js Neural Core 3D, Bento Grid, AI Sandbox Simulator และ Floating Concierge มาเป็น Vue Components
3. ใช้ระบบ Mock Data ผ่าน `useStrapiApi.ts` เพื่อให้ทีมสามารถรีวิวหน้าตา ปรับฟอนต์ สี และการโต้ตอบได้สมบูรณ์ 100% โดยยังไม่ต้องเปิด Backend

### 🔵 Phase 2: ติดตั้ง Strapi CMS (หลังบ้าน)
1. ติดตั้ง Strapi v5 ด้วยคำสั่ง `npx create-strapi-app@latest backend --typescript --dbclient=postgres`
2. สร้าง Content Types 5 รายการตามเอกสารใน [backend/README.md](file:///c:/Users/thana/OneDrive/Desktop/newigenco2/backend/README.md)
3. ให้ทีมฝ่ายคอนเทนต์หรือการตลาดเข้ากรอกข้อมูลภาษาไทยและภาษาอังกฤษ

### 🟣 Phase 3: เชื่อมต่อ API (Frontend <-> Backend)
1. ปรับค่าใน `.env`:
   ```env
   FRONTEND_USE_MOCK=false
   ```
2. Nuxt จะดึงข้อมูลแบบไดนามิกจาก Strapi ทันที
3. ฟอร์ม Request Demo จะส่งข้อมูลเข้าสู่ตาราง `demo-inquiries` ใน PostgreSQL โดยตรง

---

## 💻 วิธีการรันโปรเจกต์

### วิธีที่ 1: รันเฉพาะ Frontend (ทดสอบหน้าเว็บทันที)
```bash
cd frontend
npm install
npm run dev
```
เปิดบราวเซอร์ที่: `http://localhost:3000`

---

### วิธีที่ 2: รันทั้งระบบผ่าน Docker
```bash
# คัดลอก environment file
cp .env.example .env

# สั่งรัน Docker Compose
docker-compose up -d
```
- **Frontend (Nuxt)**: `http://localhost:3000`
- **Backend (Strapi)**: `http://localhost:1337/admin`
- **Database (PostgreSQL)**: `localhost:5432`
