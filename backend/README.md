# IGENCO AI — Backend CMS (Strapi v5 + PostgreSQL)

ระบบหลังบ้านสำหรับจัดการเนื้อหาเว็บไซต์ IGENCO AI เชื่อมต่อกับฐานข้อมูล **PostgreSQL 16** พร้อมระบบแบ่งสิทธิ์ผู้ดูแล **2 Roles (`sysadmin` และ `editor`)**

---

## 1. ขั้นตอนเริ่มต้นรันระบบ (PostgreSQL + Strapi)

โปรเจกต์ตั้งค่า `docker-compose.yml` และไฟล์ Strapi v5 ไว้ให้ครบแล้ว คุณสามารถเปิดใช้งานทั้ง **PostgreSQL + Strapi + Nuxt Frontend** ได้ด้วยคำสั่งเดียวจากโฟลเดอร์หลัก:

```bash
cd /Users/m2/Downloads/newigenco2-main
docker compose up -d --build
```

> **หมายเหตุ:** รอประมาณ 1-2 นาทีในการดาวน์โหลด/ติดตั้งแพ็กเกจครั้งแรก สามารถเช็ก Log ได้ด้วยคำสั่ง:
> ```bash
> docker logs -f igenco_backend
> ```
> เมื่อเห็นข้อความ `✅ IGENCO Bootstrap: Public API Permissions, Roles (sysadmin/editor), and Initial Seed Data ready!` แสดงว่าระบบพร้อมใช้งานแล้วครับ

---

## 2. การเข้าใช้งานครั้งแรก & ตั้งค่า 2 Roles (`sysadmin` และ `editor`)

เปิดเบราว์เซอร์ไปที่: **`http://localhost:1337/admin`**

### ขั้นตอนที่ 1: สร้างบัญชี `sysadmin` (คนแรก)
- หน้าแรกที่เปิดเข้ามา Strapi จะให้กรอกชื่อ, อีเมล และรหัสผ่านเพื่อสร้าง **Super Admin**
- บัญชีแรกนี้คือ **`sysadmin`** ที่มีสิทธิ์สูงสุดในระบบ (แก้ไขได้ทุกอย่าง และสร้าง/มอบสิทธิ์ให้คนอื่นได้)

### ขั้นตอนที่ 2: วิธีที่ `sysadmin` มอบยศ `editor` ให้ทีมงาน
1. ล็อกอินด้วยบัญชี `sysadmin` เข้าหน้า `http://localhost:1337/admin`
2. ไปที่เมนูซ้ายล่าง **Settings** → **Administration Panel** → **Users**
3. กดปุ่ม **+ Invite new user** (มุมขวาบน)
4. กรอกชื่อ + อีเมลของทีมงาน แล้วตรงช่อง **Roles** ให้ติ๊กเลือก **`Editor`**
5. กด **Save** (ระบบจะสร้างลิงก์หรือส่งคำเชิญให้ทีมงานตั้งรหัสผ่านเข้าใช้งาน)

### ขั้นตอนที่ 3: ปรับสิทธิ์ของ `Editor` ให้ตรงตามหน้าที่
ไปที่ **Settings** → **Administration Panel** → **Roles** → คลิกที่ **`Editor`** เพื่อตรวจสอบ/ปรับสิทธิ์:
- ✅ **อนุญาต (ติ๊กถูก):**
  - `News Article` (Create, Read, Update, Delete, Publish) → อัปเดตข่าวสาร
  - `Site Setting` (Read, Update) → แก้ไขข้อมูลเบื้องต้นบริษัท/ที่อยู่/เบอร์โทร
  - `Product & Solution` (Read, Update) → แก้ไขข้อมูลผลิตภัณฑ์เบื้องต้น
  - `Client & Partner` (Read, Update) → แก้ไขรายชื่อลูกค้าเบื้องต้น
  - `Contact Inquiry` (Read) → ดูรายการผู้ติดต่อจากหน้าเว็บ
- ❌ **ไม่อนุญาต (ไม่ต้องติ๊ก):**
  - **Settings / Users / Roles / Plugins** → Editor จะไม่เห็นเมนูตั้งค่าระบบและไม่สามารถมอบยศให้ใครได้

---

## 3. สรุปเปรียบเทียบสิทธิ์ 2 Roles

| ความสามารถ | `sysadmin` (Super Admin) | `editor` (Editor) |
|---|---|---|
| เพิ่ม / ลบ / แก้ไข / เผยแพร่ **ข่าวสาร** | ✅ ได้ทั้งหมด | ✅ ได้ทั้งหมด |
| แก้ไข **ข้อมูลเบื้องต้น** (ที่อยู่, เบอร์โทร, Hero) | ✅ ได้ทั้งหมด | ✅ แก้ไขได้ |
| แก้ไข **ผลิตภัณฑ์ / ลูกค้า** | ✅ ได้ทั้งหมด | ✅ แก้ไขได้ (หรือจำกัดเฉพาะดู) |
| ดูข้อมูลผู้ติดต่อ (**Contact Inquiries**) | ✅ ดู/จัดการสถานะได้ | ✅ ดูได้ (ปรับได้ตามต้องการ) |
| สร้าง User ใหม่ & **มอบยศ Editor ให้คนอื่น** | ✅ **ทำได้** | ❌ **ทำไม่ได้** |
| แก้ไข **Settings / API Permissions / Database** | ✅ **ทำได้** | ❌ **ทำไม่ได้** |

---

## 4. โครงสร้างฐานข้อมูล (Content-Types) ที่สร้างไว้ให้แล้ว

1. **`NewsArticle`** (`news-articles`) — ข่าวสารและกิจกรรมองค์กร (รองรับ TH/EN + รูปภาพ)
2. **`Product`** (`products`) — ผลิตภัณฑ์ไฮไลต์ 5 ตัว และโซลูชันทั้ง 12 ตัว (รองรับ TH/EN + Tags)
3. **`ClientPartner`** (`client-partners`) — กลุ่มผู้ใช้ผลิตภัณฑ์ ภาครัฐ รัฐวิสาหกิจ และเอกชน
4. **`ContactInquiry`** (`contact-inquiries`) — เก็บข้อมูลจากแบบฟอร์มติดต่อ/นัด Demo หน้าเว็บ
5. **`SiteSetting`** (`site-setting`) — ข้อมูลเบื้องต้นบริษัท (ชื่อบริษัท, ที่อยู่, เบอร์โทร, อีเมล, Hero, เวลาทำการ)

*(ระบบ Bootstrap ใน `src/index.ts` จะเปิดสิทธิ์ Public API และใส่ข้อมูลตัวอย่างเริ่มต้นลง PostgreSQL ให้อัตโนมัติ)*

---

## 5. วิธีเชื่อมต่อกับ Frontend (Nuxt 3)

เมื่อต้องการให้หน้าเว็บดึงข้อมูลจริงจาก Strapi + PostgreSQL แทนข้อมูล Mock:
1. แก้ไขไฟล์ `.env` ที่ root ของโปรเจกต์:
   ```env
   FRONTEND_USE_MOCK=false
   ```
2. รีสตาร์ท frontend container:
   ```bash
   docker compose restart frontend
   ```
