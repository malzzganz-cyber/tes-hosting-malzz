# Malzz Hosting — Pterodactyl Panel SaaS

Platform hosting premium berbasis Pterodactyl dengan Firebase. Dibangun dengan Next.js 14 App Router + TypeScript + Tailwind CSS + Framer Motion.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui, Radix UI, Lucide React
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **State**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Panel**: Pterodactyl API Integration

---

## Setup & Installation

### 1. Clone & Install

```bash
npm install
```

### 2. Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password
3. Enable **Firestore Database**
4. Buat **Service Account** di Project Settings → Service Accounts → Generate New Private Key
5. Copy credentials ke `.env.local`

### 3. Environment Variables

Copy `.env.local.example` ke `.env.local` dan isi semua value:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

SETUP_SECRET=your_random_secret_for_admin_setup
```

### 4. Setup Admin Pertama

Setelah server berjalan, jalankan setup admin sekali saja:

```bash
curl -X POST http://localhost:3000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -H "x-setup-secret: YOUR_SETUP_SECRET" \
  -d '{"email":"admin@malzz.id","password":"AdminPass123!","displayName":"Admin Malzz"}'
```

### 5. Setup Pterodactyl di Admin Panel

1. Login ke `/premium` dengan akun admin
2. Buka `/admin/settings`
3. Isi konfigurasi Pterodactyl:
   - Domain panel
   - Application API Key (dari Admin → API)
   - Client API Key
   - Node ID, Egg ID, Nest ID, Location ID
   - Allocation ID default
4. Klik **Simpan Semua**

### 6. Deploy Firestore Rules

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 7. Jalankan Development

```bash
npm run dev
```

---

## Deploy ke Vercel

1. Push ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan semua environment variables di Vercel dashboard
4. Deploy!

---

## Struktur Project

```
malzz-hosting/
├── app/
│   ├── api/
│   │   ├── panel/
│   │   │   ├── create/          # Create panel API
│   │   │   ├── list/            # List panels API
│   │   │   └── [id]/            # Get/Delete panel API
│   │   ├── admin/
│   │   │   ├── create-reseller/ # Create reseller API
│   │   │   └── create-premium/  # Create premium user API
│   │   ├── settings/            # Settings API
│   │   └── auth/setup-admin/    # Initial admin setup
│   ├── admin/                   # Admin pages
│   ├── dashboard/               # User dashboard pages
│   ├── free/                    # Free panel create page
│   ├── premium/                 # Premium login page
│   └── page.tsx                 # Landing page
├── components/
│   ├── charts/                  # Recharts components
│   ├── forms/                   # Form components
│   ├── layout/                  # Navbar, Sidebar
│   ├── modals/                  # Modal components
│   ├── providers/               # Context providers
│   └── ui/                      # UI components
├── hooks/                       # Custom React hooks
├── lib/
│   ├── firebase.ts              # Firebase client config
│   ├── firebase-admin.ts        # Firebase admin SDK
│   ├── pterodactyl.ts           # Pterodactyl API client
│   └── utils.ts                 # Utility functions
├── store/                       # Zustand stores
├── types/                       # TypeScript types
├── firestore.rules              # Firebase security rules
├── firestore.indexes.json       # Firestore indexes
└── vercel.json                  # Vercel config
```

---

## Role System

| Role | Akses |
|------|-------|
| **Free** | Tidak perlu login, max 3 panel, cooldown 24 jam, wajib join WA |
| **Premium** | Login Firebase, unlimited panel, unlimited resources |
| **Reseller** | Bisa buat premium user, manage users tertentu |
| **Admin** | Full access, edit config Pterodactyl, analytics, create reseller |

---

## Pterodactyl Config (disimpan di Firestore)

Semua config Pterodactyl disimpan di `settings/pterodactyl` di Firestore dan di-fetch realtime saat create panel. **Tidak ada hardcode config di kode.**

---

## Catatan Penting

- Setelah deploy, setup admin pertama via API endpoint
- Konfigurasi Pterodactyl HANYA bisa diubah via Admin Panel → Settings
- Free panel menggunakan localStorage + server-side device tracking untuk anti-abuse
- Cooldown system bekerja di client (localStorage) + server (rate limit map)
- Firebase Security Rules wajib di-deploy agar keamanan terjaga
