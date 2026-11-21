# AniMoS

จดลิสต์หนัง อนิเมะ และซีรี่ส์ที่อยากดู (Vue 3 + Quasar + Pinia + Axios + JSON Server)

## วิธีรัน
1. ต้องมี Node.js 22 ขึ้นไป (เช็คด้วย `node -v`)
2. `npm install`
3. เปิด terminal 1 รัน API ข้อมูล (JSON Server, ใช้ไฟล์ `db.json`): `npm run api`
4. เปิด terminal 2 รันเว็บ: `npm run dev`

ถ้าเปลี่ยน port ของ JSON Server ให้แก้ `QCLI_API_URL` ใน `.env` ให้ตรงกัน แล้วรัน `npm run dev` ใหม่

## Login
ใช้ Backend ของรายวิชา (`QCLI_AUTH_URL` ใน `.env`) ต้องต่อเครือข่ายมหาวิทยาลัย
บัญชีทดสอบ: `student` / `teacher` / `admin` รหัสผ่าน `123456` (ปุ่ม Admin แสดงเฉพาะ `admin`)

## โครงสร้างหน้า
- `/login` → LoginPage
- `/` (route `main`) → MainPage
- `/add` → FormPage
- `/admin` → AdminPage (เฉพาะ admin)

ค่าที่ใช้ในข้อมูล: status = `ยังไม่ได้ดู` / `กำลังดู` / `ดูจบแล้ว`
