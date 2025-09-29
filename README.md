# โปรเจ็คในวิชาเรียนปี 3 (2024)
# NextAuth Prisma App — ระบบยืนยันตัวตน

![Banner](Review/R1.png)

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000?logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-3b82f6)](https://next-auth.js.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Dev-Docker-2496ED?logo=docker&logoColor=white)](./docker-compose.yml)
[![Google OAuth](https://img.shields.io/badge/OAuth-Google-FBBC05?logo=google)](https://console.cloud.google.com/)

แอปพลิเคชันยืนยันตัวตนสำเร็จรูปสำหรับใช้งานเป็น **Starter / Showcase** รองรับ:
- Email + Password (Credentials)
- Google OAuth Login
- จัดการ Session แบบ JWT
- เก็บข้อมูลผู้ใช้ใน PostgreSQL ผ่าน Prisma
- บันทึก Role (admin / member) + แสดงผลบนโปรไฟล์
- แสดงรูปโปรไฟล์จาก Google (Remote Image Config)
- Seed ผู้ใช้ตัวอย่างอัตโนมัติ
- Docker Compose สำหรับ Dev DB + pgAdmin

---

## 📋 คุณสมบัติเด่น
- Sign in ด้วย Google / Credentials
- หน้า Profile แสดง: Avatar, Name, Email, Role
- ระบบ Role-Based (ค่าตั้งต้น: member, seed มี admin)
- มี pgAdmin UI จัดการฐานข้อมูลที่ `http://localhost:5050`
- ใช้ Tailwind UI แบบเรียบง่าย + component ย่อย

---

## 🏗️ สถาปัตยกรรม & เทคโนโลยี
```
- Next.js 15 (App Router)
- NextAuth.js (Credentials + Google Provider)
- Prisma ORM + PostgreSQL
- JWT Session Strategy
- TailwindCSS
- Docker Compose (postgres + pgadmin)
```
โครงสร้างหลัก:
```
app/
  api/auth/[...nextauth]/route.js   # Config และ callbacks
  api/auth/signup/route.js          # สมัครผู้ใช้แบบ credentials
  profile/page.js                   # หน้าโปรไฟล์ (Protected)
  components/                       # SessionProvider, UserInfo, UI
prisma/
  schema.prisma
  seed.js
```

---

## 🚀 การติดตั้งและเริ่มต้นใช้งาน
### 1) เตรียมเครื่องมือ
- Node.js 20+
- Docker Desktop (ถ้าจะใช้ DB แบบ container)

### 2) Clone & Install
```powershell
npm install
```

### 3) ตั้งค่า Environment
สร้างไฟล์ `.env` (อ้างอิงตัวอย่างที่แนบไว้ใน repo):
```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="สร้างสุ่ม base64 32 ตัว"
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4) รันฐานข้อมูล (Docker)
```powershell
docker-compose up -d
```

### 5) Prisma Migration & Seed
```powershell
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```
> เปิด Prisma Studio (เลือกได้):
```powershell
npx prisma studio
```
Prisma Studio: http://localhost:5555

### 6) รันแอป
```powershell
npm run dev
```
เปิด: http://localhost:3000

---

## 🔐 Authentication Flow (สรุป)
1. ผู้ใช้ Sign in (Google หรือ Credentials)
2. ใน callbacks จะ upsert user + กำหนด role ถ้ายังไม่มี
3. JWT จะบรรจุ: id, email, role, image
4. หน้า Profile ดึงผ่าน `useSession()` และแสดงผลทันที

---

## 🖼️ สกรีนช็อต
![R1](Review/R1.png)
![R2](Review/R2.png)

---