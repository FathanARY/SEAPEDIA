# SEAPEDIA E-Commerce Platform

SEAPEDIA adalah platform e-commerce multi-peran (multi-role) yang komprehensif, dibangun dengan Next.js dan Prisma. Platform ini menghubungkan Penjual (Seller), Pembeli (Buyer), dan Kurir (Driver) dalam satu pengalaman marketplace, yang dipantau oleh Admin.

## 🚀 Persiapan Cepat & Demo

### 1. Prasyarat
- Node.js (v18+)
- SQLite (database bawaan yang digunakan oleh Prisma dalam pengaturan ini)

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
- **Superuser (Admin, Seller, Buyer, Driver)**: `super@seapedia.com` (Dilengkapi dengan toko 'Super Store ID' dan saldo dompet Rp 5.000.000)
- **Buyer (Pembeli Reguler)**: `buyer@seapedia.com` (Dilengkapi dengan saldo dompet Rp 2.000.000)
- **Driver (Kurir)**: `driver@seapedia.com` (Dilengkapi dengan saldo dompet Rp 100.000)

**Catatan Tambahan Data Demo**:
- Kode Promo yang tersedia: `COMPFEST` (Diskon Rp 50.000).

**Catatan Pembuatan Admin**: Jika Anda perlu membuat akun admin secara manual di luar data seed, Anda harus mendaftar akun pengguna normal melalui UI terlebih dahulu, kemudian memperbarui peran (role) mereka secara langsung di database SQLite menjadi `ADMIN` (karena tidak ada halaman pendaftaran admin publik untuk alasan keamanan).

### 5. Menjalankan Aplikasi
```bash
npm run dev
```
Kunjungi `http://localhost:3000` untuk mulai menjelajah!

---

## 💼 Aturan Bisnis Inti & Konfigurasi

SEAPEDIA menerapkan aturan bisnis yang ketat baik di frontend maupun backend:

1. **Aturan Checkout Satu Toko (Single-Store Checkout)**
   - Karena SEAPEDIA adalah marketplace multi-penjual, satu keranjang (cart) hanya boleh berisi produk dari satu toko.
   - **Perilaku**: Jika pembeli mencoba menambahkan produk dari toko lain sementara keranjangnya memiliki barang dari toko yang berbeda, sistem akan menolak tindakan tersebut dan meminta pembeli untuk mengosongkan keranjangnya terlebih dahulu. Hal ini diterapkan secara ketat di backend.

2. **Aturan Kombinasi Diskon**
   - Sistem checkout mendukung Voucher (dengan batas penggunaan) dan Promo.
   - **Aturan**: Pembeli hanya dapat menerapkan **satu kode diskon** per checkout (Voucher ATAU Promo). Diskon tidak dapat digabungkan atau ditumpuk.

3. **Aturan Perhitungan PPN 12%**
   - Pajak (PPN) sebesar 12% diterapkan pada **Subtotal setelah diskon**.
   - **Rumus**: `Pajak = (Subtotal - Diskon) * 12%`
   - Jika jumlah diskon lebih besar dari subtotal, subtotal dianggap Rp 0 untuk keperluan pajak, sehingga dasar pengenaan pajak menjadi Rp 0. PPN terlihat jelas dalam ringkasan checkout.

4. **Aturan Pendapatan Kurir (Driver Earning)**
   - Seluruh biaya pengiriman yang dibayarkan oleh pembeli (misal Rp 10.000 untuk Regular, Rp 20.000 untuk Instant) menjadi **100% pendapatan Kurir**.
   - Kurir dapat melihat akumulasi pendapatan dari pekerjaan yang telah diselesaikan di Dashboard Kurir mereka.

5. **SLA Keterlambatan (Overdue SLA) & Simulasi Waktu**
   - **SLA Pengiriman**: Instant (1 Hari), Next Day (2 Hari), Regular (5 Hari).
   - Jika pesanan melewati SLA ini berdasarkan metode pengiriman yang dipilih, pesanan tersebut memenuhi syarat untuk pengembalian dana otomatis (auto-refund) / retur otomatis (status menjadi `DIKEMBALIKAN`).
   - Pengembalian dana secara otomatis mengembalikan jumlah yang dibayarkan ke dompet Pembeli, membatalkan pendapatan Penjual, dan mengembalikan stok produk.
   - **Simulasi Waktu**: Admin dapat mensimulasikan hari esok dengan menavigasi ke Dashboard Admin (`/dashboard/admin`) dan menggunakan alat **Simulasi Hari Esok (Simulate Next Day)**. Ini memicu mesin verifikasi SLA secara manual tanpa harus menunggu waktu nyata.

---

## 🛡️ Langkah-Langkah Keamanan (Catatan Keamanan)

SEAPEDIA menerapkan pengerasan keamanan yang kuat untuk semua alur sensitif:

- **Pencegahan SQL Injection**: Kami menggunakan Prisma ORM, yang secara inheren melakukan escaping nilai dan menggunakan parameterized queries, secara ketat mencegah SQL injection di seluruh akses database.
- **Pencegahan XSS**: React/Next.js secara otomatis melakukan escaping konten buatan pengguna di JSX sebelum dirender. Kami tidak menggunakan `dangerouslySetInnerHTML`. Ulasan aplikasi publik dan deskripsi produk dirender dengan aman sebagai teks standar untuk mencegah eksekusi skrip atau rusaknya tata letak (layout).
- **Validasi Input**: Semua form (pendaftaran, pembuatan produk, ulasan, checkout) secara ketat memvalidasi field yang wajib diisi, mencegah kuantitas negatif, harga negatif, dan tipe data yang tidak valid menggunakan validasi backend yang kuat sebelum menyimpan atau memproses data.
- **Perilaku Sesi (Session Behavior)**: Autentikasi ditangani melalui cookie JWT HttpOnly yang aman. Logout segera membatalkan/membersihkan cookie sesi aktif. Token diverifikasi pada setiap permintaan (request) yang aman.
- **Kontrol Akses Berbasis Peran (RBAC)**: Peran (role) aktif diverifikasi secara ketat di sisi server. Mengubah rute frontend saja tidak cukup; endpoint privat mengotorisasi tindakan hanya berdasarkan peran aktif saat ini. Selain itu, pengguna tidak dapat mengakses atau mengubah sumber daya (resource) milik pengguna lain (misalnya, Penjual hanya dapat mengedit produknya sendiri, dan Kurir hanya dapat mengambil pekerjaan yang belum diambil orang lain).

---

## 📡 Gambaran Umum Dokumentasi API

Backend menggunakan Route Handlers Next.js yang terletak di `src/app/api/`. Berikut adalah ringkasan yang jelas tentang namespace API inti dan tujuannya:

- **`/api/auth/*`**: Alur autentikasi (Pendaftaran, Login, Logout, Manajemen Sesi/Peran).
- **`/api/admin/*`**: Metrik pemantauan, Pemicu mesin keterlambatan SLA, Pembuatan dan pengelolaan Voucher & Promo.
- **`/api/buyer/*`**: Top-up dompet, Manajemen keranjang (Pengecekan satu toko), Eksekusi checkout, dan Pengiriman ulasan.
- **`/api/seller/*`**: Pembuatan toko, Operasi CRUD produk, Pemrosesan pesanan (Sedang Dikemas -> Menunggu Pengirim), dan Laporan pendapatan.
- **`/api/driver/*`**: Siaran pekerjaan (mencari pekerjaan yang tersedia), Penerimaan pekerjaan, Konfirmasi penyelesaian, dan Laporan pendapatan.
- **`/api/public/*`**: Daftar katalog produk di halaman utama dan ulasan aplikasi publik.

---

## 📖 Panduan Pengujian End-to-End

Untuk merasakan alur lengkap SEAPEDIA:

1. **Penjelajahan Tamu & Ulasan**
   - Kunjungi halaman utama tanpa login. Jelajahi katalog produk dan lihat detail produk.
   - Kirim Ulasan Aplikasi dari form di halaman utama.
2. **Login sebagai Superuser/Admin** (`super@seapedia.com`)
   - Pilih peran **Admin**.
   - Buka Dashboard Admin. Pantau metrik platform.
   - Buka bagian Diskon dan buat kode Promo atau Voucher.
3. **Login sebagai Buyer** (`buyer@seapedia.com`)
   - Top-up dompet Anda (top-up dummy).
   - Tambahkan produk ke keranjang.
   - Buka Keranjang -> Checkout.
   - Terapkan kode diskon yang Anda buat atau `COMPFEST`. Pilih Metode Pengiriman.
   - Selesaikan Checkout.
4. **Login sebagai Superuser (Peran Seller)** (`super@seapedia.com`)
   - Pilih peran **Seller**.
   - Buka `/dashboard/seller/orders` (Pesanan Masuk).
   - Temukan pesanan baru (Sedang Dikemas) dan klik **Proses Pesanan**. Status akan berubah menjadi `MENUNGGU_PENGIRIM`.
5. **Login sebagai Driver** (`driver@seapedia.com`)
   - Buka `/dashboard/driver/jobs` (Bursa Kerja).
   - Ambil pekerjaan pengiriman yang tersedia.
   - Buka pekerjaan aktif dan klik **Selesaikan Pengiriman** untuk menyelesaikannya.
6. **Simulasi Waktu & Pengecekan Keterlambatan**
   - Lakukan pesanan lain tetapi jangan selesaikan pengiriman.
   - Login sebagai Admin, gunakan tombol **"Simulasi Hari Esok"** hingga SLA terlampaui, dan verifikasi status pesanan berubah menjadi `DIKEMBALIKAN`.
