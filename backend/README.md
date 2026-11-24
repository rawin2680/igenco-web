# IGENCO AI — Strapi Backend (Headless CMS & API)

ส่วนหลังบ้าน (Backend) สำหรับจัดการเนื้อหาเว็บไซต์ IGENCO AI และให้บริการ REST/GraphQL API แก่ Nuxt Frontend
พัฒนาด้วย **TypeScript** และเชื่อมต่อกับ **PostgreSQL**

---

## 1. วิธีสร้างโปรเจกต์ Strapi เมื่อพร้อมทำ Backend (Phase 2)

เมื่อคุณพัฒนา Frontend เสร็จและพร้อมขึ้นระบบ Strapi สามารถรันคำสั่งต่อไปนี้ในโฟลเดอร์ `backend/`:

```bash
# ในกรณีสร้างผ่าน npx:
npx create-strapi-app@latest . --typescript --dbclient=postgres --no-run
```

หรือใช้ `docker-compose up backend` ตามที่ตั้งค่าไว้ใน root `docker-compose.yml`.

---

## 2. โครงสร้าง Content-Types ที่ออกแบบไว้รองรับ Frontend 1:1

### ก. Single Type: `HeroSection`
| Field Name | Type | Description |
|---|---|---|
| `badge_th` / `badge_en` | String | ป้ายข้อความด้านบน ("NEXT-GEN ENTERPRISE AI ARCHITECTURE") |
| `title_th` / `title_en` | Text / String | หัวข้อหลัก ("ยกระดับองค์กรสู่อนาคต...") |
| `subtitle_th` / `subtitle_en` | Text | คำอธิบาย 2 บรรทัด |
| `primary_cta_th` / `primary_cta_en` | String | ปุ่มหลัก ("ทดลองสัมผัส AI Demo") |
| `secondary_cta_th` / `secondary_cta_en` | String | ปุ่มรอง ("สำรวจนวัตกรรมของเรา") |

---

### ข. Collection Type: `Capabilities` (Bento Grid)
| Field Name | Type | Description |
|---|---|---|
| `tag` | String | เช่น `REAL-TIME REASONING`, `● 12ms Latency` |
| `pillBadge` | String | เช่น `Enterprise LLM & Agents` |
| `title_th` / `title_en` | String | ชื่อบริการ |
| `description_th` / `description_en` | Text | รายละเอียด |
| `gridSpan` | Enumeration | `large` (7 คอลัมน์) / `medium` (5 คอลัมน์) |
| `theme` | Enumeration | `light` / `dark` |
| `interactiveType` | Enumeration | `flow` / `chart` / `shield` / `vision` |

---

### ค. Collection Type: `IndustryBlueprints` (Interactive AI Sandbox)
| Field Name | Type | Description |
|---|---|---|
| `key` | String (UID) | `manufacturing`, `finance`, `healthcare`, `retail` |
| `name_th` / `name_en` | String | ชื่ออุตสาหกรรมบนแท็บ |
| `tag` | String | Blueprint Tag เช่น `BLUEPRINT // VISION-TWIN-X` |
| `title_th` / `title_en` | String | หัวข้อ Blueprint |
| `summary_th` / `summary_en` | Text | เนื้อหาภาพรวม |
| `pipeline` | JSON | ลำดับขั้นตอน Pipeline (Array of strings) |
| `metric1_value` / `metric1_label_th` / `metric1_label_en` | String | ตัวเลขและคำอธิบาย Metric ที่ 1 |
| `metric2_value` / `metric2_label_th` / `metric2_label_en` | String | ตัวเลขและคำอธิบาย Metric ที่ 2 |

---

### ง. Collection Type: `DeploymentModels`
| Field Name | Type | Description |
|---|---|---|
| `code` | String | `01 / CLOUD API`, `02 / HYBRID ENTERPRISE`, `03 / SOVEREIGN ON-PREMISE` |
| `title_th` / `title_en` | String | ชื่อโมเดลการติดตั้ง |
| `description_th` / `description_en` | Text | รายละเอียด |
| `badge` | String | เช่น `Recommended` (เว้นว่างได้) |
| `features` | JSON | รายการจุดเด่น (Array of `{ th: string, en: string }`) |
| `theme` | Enumeration | `light` / `highlight` / `dark` |

---

### จ. Collection Type: `DemoInquiries` (รับข้อมูลจากฟอร์ม Request Demo)
| Field Name | Type | Description |
|---|---|---|
| `fullName` | String (Required) | ชื่อ - นามสกุล |
| `workEmail` | Email (Required) | อีเมลองค์กร |
| `companyName` | String (Required) | ชื่อบริษัท / องค์กร |
| `industry` | String | กลุ่มอุตสาหกรรมที่เลือก |
| `status` | Enumeration | `new`, `contacted`, `closed` (Default: `new`) |

---

## 3. การตั้งค่าสิทธิ์ API ใน Strapi (Roles & Permissions)

เมื่อสร้าง Content-Types แล้ว ให้ไปที่หน้า **Strapi Admin Panel**:
1. เมนู **Settings** -> **Users & Permissions Plugin** -> **Roles**
2. เลือก Role **Public**
3. กำหนดสิทธิ์:
   - `HeroSection`: ติ๊กถูกที่ `find`
   - `Capabilities`: ติ๊กถูกที่ `find`, `findOne`
   - `IndustryBlueprints`: ติ๊กถูกที่ `find`, `findOne`
   - `DeploymentModels`: ติ๊กถูกที่ `find`, `findOne`
   - `DemoInquiries`: ติ๊กถูกที่ `create` (เพื่อให้หน้าบ้านส่งฟอร์มเข้ามาได้)
4. กด **Save**

---

## 4. การเปิดเชื่อมต่อกับ Nuxt Frontend

ในไฟล์ root `.env` หรือ `frontend/.env`:
เปลี่ยนค่า:
```env
FRONTEND_USE_MOCK=false
```
เพียงเท่านี้ Nuxt จะเปลี่ยนจากการใช้ข้อมูลจำลอง (Mock) มาดึงข้อมูลจริงจาก Strapi API อัตโนมัติทันทีโดยไม่ต้องแก้โค้ดหน้าบ้าน!
