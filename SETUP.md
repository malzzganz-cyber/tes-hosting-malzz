# Panduan Setup Malzz Hosting

## Langkah 1 — Install Dependencies

```bash
cd malzz-hosting
npm install
```

## Langkah 2 — Buat Firebase Project

1. Buka https://console.firebase.google.com
2. Klik "Add Project" → beri nama (misal: malzz-hosting)
3. Aktifkan **Firestore Database** (mode production)
4. Aktifkan **Authentication** → Sign-in method → Email/Password → Enable
5. Buka Project Settings → Service Accounts → Generate New Private Key → download JSON

## Langkah 3 — Isi .env.local

```bash
cp .env.local.example .env.local
```

Buka `.env.local` dan isi:

**Firebase Client (dari Project Settings → General → Your apps):**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=malzz-hosting.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=malzz-hosting
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=malzz-hosting.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

**Firebase Admin (dari service account JSON yang didownload):**
```
FIREBASE_ADMIN_PROJECT_ID=malzz-hosting
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@malzz-hosting.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

**App Config:**
```
SETUP_SECRET=buat_string_random_panjang_di_sini
```

## Langkah 4 — Deploy Firestore Rules & Indexes

```bash
npm install -g firebase-tools
firebase login
firebase use malzz-hosting  # ganti dengan project ID kamu
firebase deploy --only firestore:rules,firestore:indexes
```

## Langkah 5 — Jalankan Dev Server

```bash
npm run dev
```

Buka http://localhost:3000

## Langkah 6 — Buat Akun Admin Pertama

```bash
curl -X POST http://localhost:3000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -H "x-setup-secret: ISI_SETUP_SECRET_KAMU" \
  -d '{
    "email": "admin@malzz.id",
    "password": "AdminPassword123!",
    "displayName": "Admin Malzz"
  }'
```

Jika berhasil, response: `{"success":true,"message":"Admin \"Admin Malzz\" berhasil dibuat"}`

## Langkah 7 — Login & Setup Pterodactyl

1. Buka http://localhost:3000/premium
2. Login dengan email & password admin yang baru dibuat
3. Kamu akan diarahkan ke Admin Dashboard
4. Buka **Admin → Pengaturan**
5. Isi semua config Pterodactyl:
   - **Domain**: `https://panel-kamu.com`
   - **Application API Key**: buat di Pterodactyl → Admin → API → Application APIs
   - **Client API Key**: buat di Pterodactyl → Account → API Credentials
   - **Node ID**: lihat di Admin → Nodes
   - **Egg ID, Nest ID**: lihat di Admin → Nests
   - **Location ID**: lihat di Admin → Locations
   - **Allocation ID**: lihat di server → Allocations
6. Klik **Simpan Semua**

## Langkah 8 — Deploy ke Vercel

1. Push ke GitHub:
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/username/malzz-hosting.git
git push -u origin main
```

2. Buka https://vercel.com → Import from GitHub
3. Tambahkan semua Environment Variables (sama dengan .env.local tapi tanpa tanda kutip)
4. Deploy!

## Catatan Penting

- `FIREBASE_ADMIN_PRIVATE_KEY` di Vercel: isi TANPA escape `\n`, Vercel akan handle sendiri
- Jika ada error "Module not found", jalankan `npm install` lagi
- Free panel menggunakan kombinasi localStorage + server-side rate limiting
- Cooldown default 24 jam bisa diubah di Admin → Pengaturan
