# Deploy Backend (Strapi + PostgreSQL) บน Railway

Frontend (Nuxt) อยู่บน Vercel: https://igenco-demo2.vercel.app
Backend (Strapi v5) + PostgreSQL อยู่บน Railway (ได้ https ให้อัตโนมัติ)

## 1. สร้างโปรเจกต์และฐานข้อมูล
1. เข้า https://railway.com แล้วล็อกอินด้วย GitHub
2. **New Project → Deploy PostgreSQL** (จะได้ service ชื่อ `Postgres`)
3. ในโปรเจกต์เดียวกัน กด **+ Create → GitHub Repo** เลือก `rawin2680/igenco-web`

## 2. ตั้งค่า service ของ backend
ที่ service ของ repo → **Settings**
- **Root Directory**: `backend`
  (Railway จะอ่าน `backend/railway.json` และ build จาก `backend/Dockerfile` เอง)
- **Networking → Generate Domain** แล้วจด URL ไว้ เช่น `https://igenco-backend-production.up.railway.app`

## 3. ใส่ Variables (แท็บ Variables → Raw Editor)
สร้าง secret แต่ละตัวด้วย `openssl rand -base64 32`

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
PUBLIC_URL=https://<โดเมนจากข้อ 2>
FRONTEND_URL=https://igenco-demo2.vercel.app

APP_KEYS=<secret1>,<secret2>
API_TOKEN_SALT=<secret>
ADMIN_JWT_SECRET=<secret>
TRANSFER_TOKEN_SALT=<secret>
JWT_SECRET=<secret>

SEED_SYSADMIN_PASSWORD=<รหัสผ่านบัญชี sysadmin ของหน้า /admin>
SEED_EDITOR_PASSWORD=<รหัสผ่านบัญชี editor>
```

ไม่ต้องตั้ง `PORT` เพราะ Railway ใส่ให้เอง

## 4. เก็บรูปที่อัปโหลดไม่ให้หาย
ดิสก์ของ Railway จะถูกล้างทุกครั้งที่ deploy
ที่ service backend → **+ Add Volume** → Mount path: `/app/public/uploads`

## 5. ตั้งค่า Vercel ให้ชี้มาที่ backend
Vercel → โปรเจกต์ frontend → Settings → Environment Variables
```env
NUXT_PUBLIC_STRAPI_URL=https://<โดเมน Railway>
NUXT_PUBLIC_USE_MOCK=false
NUXT_PUBLIC_SITE_URL=https://igenco-demo2.vercel.app
```
แล้วกด **Redeploy**

## 6. ตรวจสอบ
- `https://<โดเมน Railway>/api/site-setting` ต้องตอบเป็น JSON
- `https://<โดเมน Railway>/admin` สร้างบัญชี Super Admin ของ Strapi ครั้งแรก
- หน้าเว็บบน Vercel ต้องแสดงข้อมูลจาก CMS และล็อกอิน `/admin` ได้

## (ทางเลือก) ย้ายข้อมูลจาก Docker บนเครื่องไป Railway
ใน Railway → Postgres → Connect จะมี `DATABASE_PUBLIC_URL` ใช้คำสั่งนี้บนเครื่องตัวเอง
(อย่าส่ง URL นี้ให้ใคร เพราะมีรหัสผ่านอยู่ข้างใน)

```bash
docker exec igenco_postgres pg_dump -U postgres -d igenco_db --no-owner --no-acl -Fc > igenco.dump
pg_restore --no-owner --no-acl --clean --if-exists -d "<DATABASE_PUBLIC_URL>" igenco.dump
```
ชื่อ container อาจต่างไป ดูได้ด้วย `docker ps`
