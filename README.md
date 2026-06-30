<div align="center">

<h1> SEAPEDIA E-Commerce Platform </h1>
<br/>

SEAPEDIA adalah platform e-commerce multi-peran (multi-role) yang komprehensif, dibangun dengan Next.js dan Prisma. Platform ini menghubungkan Penjual (Seller), Pembeli (Buyer), dan Kurir (Driver) dalam satu pengalaman marketplace, yang dipantau oleh Admin.
<br/>

  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>


## Live Demo
**Coba aplikasinya langsung di sini! [https://seapedia-rust.vercel.app/](https://seapedia-rust.vercel.app/)**

---

## Tech Stack

Daftar teknologi, library, dan tools yang digunakan dalam proyek ini.

| Kategori | Teknologi |
| :--- | :--- |
| **Framework Utama** | [Next.js](https://nextjs.org/), [React](https://react.dev/) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Backend & Akses Data** | [Prisma](https://www.prisma.io/), Next.js Route Handlers / Server Actions |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/)) |
| **Autentikasi** | Custom JWT ([jose](https://github.com/panva/jose)), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## Persiapan Cepat (Lokal)

### 0. Prasyarat
- Node.js (v18+)
- npm (biasanya bawaan instalasi Node.js)

### 1. Clone Repository
Clone repositori ini ke komputer lokal Anda:
```bash
git clone https://github.com/FathanARY/SEAPEDIA.git
cd SEAPEDIA
```

### 2. Instalasi
```bash
# Instal dependensi
npm install
```

### 3. Variabel Lingkungan (Environment Variables)
Buat file `.env` di root direktori `SEAPEDIA` dengan variabel berikut:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seapedia-secret-key-change-in-production"
```

### 4. Pengaturan Database & Seeding
```bash
# Push skema database
npm run db:push

# Seed Akun Demo dan Data Demo
npm run db:seed
```

Ini akan menghasilkan akun-akun berikut (semua kata sandi adalah `password123`):

| No | Username | Peran | Keterangan |
| :-: | :--- | :--- | :--- |
| 1 | `superuser` | Admin, Seller, Buyer, Driver | Dilengkapi dengan toko 'Super Store ID' dan saldo dompet Rp 5.000.000 |
| 2 | `pembeli_biasa` | Buyer (Pembeli Reguler) | Dilengkapi dengan saldo dompet Rp 2.000.000 |
| 3 | `kurir_kilat` | Driver (Kurir) | Dilengkapi dengan saldo dompet Rp 100.000 |

**Catatan Tambahan Data Demo**:
- Kode Promo yang tersedia: `COMPFEST` (Diskon Rp 50.000).

**Catatan Pembuatan Admin**: Jika Anda perlu membuat akun admin secara manual di luar data seed, Anda harus mendaftar akun pengguna normal melalui UI terlebih dahulu, kemudian memperbarui peran (role) mereka secara langsung di database menjadi `ADMIN` (karena tidak ada halaman pendaftaran admin publik untuk alasan keamanan).

### 5. Menjalankan Aplikasi
```bash
npm run dev
```
Kunjungi `http://localhost:3000` untuk mulai menjelajah!

---

## Langkah-Langkah Keamanan (Catatan Keamanan)

SEAPEDIA menerapkan pengerasan keamanan yang kuat untuk semua alur sensitif:

- **Pencegahan SQL Injection**: Project ini menggunakan Prisma ORM, yang secara inheren melakukan escaping nilai dan menggunakan parameterized queries, secara ketat mencegah SQL injection di seluruh akses database.
- **Pencegahan XSS**: React/Next.js secara otomatis melakukan escaping konten buatan pengguna di JSX sebelum dirender. Project ini tidak menggunakan `dangerouslySetInnerHTML`. Ulasan aplikasi publik dan deskripsi produk dirender dengan aman sebagai teks standar untuk mencegah eksekusi skrip atau rusaknya tata letak (layout).
- **Validasi Input**: Semua form (pendaftaran, pembuatan produk, ulasan, checkout) secara ketat memvalidasi field yang wajib diisi, mencegah kuantitas negatif, harga negatif, dan tipe data yang tidak valid menggunakan validasi backend yang kuat sebelum menyimpan atau memproses data.
- **Perilaku Sesi (Session Behavior)**: Autentikasi ditangani melalui cookie JWT HttpOnly yang aman. Logout segera membatalkan/membersihkan cookie sesi aktif. Token diverifikasi pada setiap permintaan (request) yang aman.
- **Kontrol Akses Berbasis Peran (RBAC)**: Peran (role) aktif diverifikasi secara ketat di sisi server. Mengubah rute frontend saja tidak cukup; endpoint privat mengotorisasi tindakan hanya berdasarkan peran aktif saat ini. Selain itu, pengguna tidak dapat mengakses atau mengubah sumber daya (resource) milik pengguna lain (misalnya, Penjual hanya dapat mengedit produknya sendiri, dan Kurir hanya dapat mengambil pekerjaan yang belum diambil orang lain).

---

## Gambaran Umum Dokumentasi API

Backend menggunakan Route Handlers Next.js yang terletak di `src/app/api/`. Berikut adalah ringkasan yang jelas tentang namespace API inti dan tujuannya:

- **`/api/auth/*`**: Alur autentikasi (Pendaftaran, Login, Logout, Manajemen Sesi/Peran).
- **`/api/admin/*`**: Metrik pemantauan, Pemicu mesin keterlambatan SLA, Pembuatan dan pengelolaan Voucher & Promo.
- **`/api/buyer/*`**: Top-up dompet, Manajemen keranjang (Pengecekan satu toko), Eksekusi checkout, dan Pengiriman ulasan.
- **`/api/seller/*`**: Pembuatan toko, Operasi CRUD produk, Pemrosesan pesanan (Sedang Dikemas -> Menunggu Pengirim), dan Laporan pendapatan.
- **`/api/driver/*`**: Siaran pekerjaan (mencari pekerjaan yang tersedia), Penerimaan pekerjaan, Konfirmasi penyelesaian, dan Laporan pendapatan.
- **`/api/public/*`**: Daftar katalog produk di halaman utama dan ulasan aplikasi publik.

---

## Panduan Pengujian End-to-End

Untuk merasakan alur lengkap SEAPEDIA:

1. **Penjelajahan Tamu & Ulasan**
   - Kunjungi halaman utama tanpa login. Jelajahi katalog produk dan lihat detail produk.
   - Kirim Ulasan Aplikasi dari form di halaman utama.
2. **Login sebagai Superuser/Admin** (`superuser`)
   - Pilih peran **Admin**.
   - Buka Dashboard Admin. Pantau metrik platform.
   - Buka bagian Diskon dan buat kode Promo atau Voucher.
3. **Login sebagai Buyer** (`pembeli_biasa`)
   - Top-up dompet Anda (top-up dummy).
   - Tambahkan produk ke keranjang.
   - Buka Keranjang -> Checkout.
   - Terapkan kode diskon yang Anda buat atau `COMPFEST`. Pilih Metode Pengiriman.
   - Selesaikan Checkout.
4. **Login sebagai Superuser (Peran Seller)** (`superuser`)
   - Pilih peran **Seller**.
   - Buka `/dashboard/seller/orders` (Pesanan Masuk).
   - Temukan pesanan baru (Sedang Dikemas) dan klik **Proses Pesanan**. Status akan berubah menjadi `MENUNGGU_PENGIRIM`.
5. **Login sebagai Driver** (`kurir_kilat`)
   - Buka `/dashboard/driver/jobs` (Bursa Kerja).
   - Ambil pekerjaan pengiriman yang tersedia.
   - Buka pekerjaan aktif dan klik **Selesaikan Pengiriman** untuk menyelesaikannya.
6. **Simulasi Waktu & Pengecekan Keterlambatan**
   - Lakukan pesanan lain tetapi jangan selesaikan pengiriman.
   - Login sebagai Admin, gunakan tombol **"Simulasi Hari Esok"** hingga SLA terlampaui, dan verifikasi status pesanan berubah menjadi `DIKEMBALIKAN`.
