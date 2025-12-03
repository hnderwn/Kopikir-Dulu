# Kopikir Saja

## Ringkasan Proyek
Kopikir Saja adalah web app e-commerce mini untuk memamerkan dan menjual kopi mikro-lot nusantara. Aplikasi ini dibangun dengan React + Vite dan Tailwind CSS, dilengkapi integrasi Supabase untuk autentikasi email/password. Fokus utama UI adalah storytelling brand (hero, cerita, timeline), katalog biji, dan pengalaman checkout ringan via WhatsApp.

## Stack & Tooling
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + custom theme warna kopi
- **State & Hooks:** React hooks murni (useState, useEffect, useRef)
- **Backend-as-a-Service:** Supabase Auth
- **Data statis:** `src/data/beans.json`
- **Build tooling:** PostCSS, autoprefixer, ESLint default Vite (opsional)

## Struktur Proyek
```
├─ public/              # Aset statis (hero image, ikon)
├─ src/
│  ├─ App.jsx           # Komponen utama + seluruh UI & logika
│  ├─ main.jsx          # Entry Vite
│  ├─ index.css         # Tailwind layer + utilitas
│  ├─ data/beans.json   # Inventori kopi (20+ varian)
│  └─ lib/supabaseClient.js # Inisialisasi Supabase
├─ .env                 # Tempat menaruh kredensial Supabase (tidak dikomit)
├─ package.json         # Skrip npm, dependencies
└─ tailwind.config.js   # Tema warna bernuansa kopi
```

## Fitur Utama
1. **Landing & Storytelling:** Hero interaktif, highlight brand, timeline "Tonggak Kopikir".
2. **Marketplace Section:** Katalog kartu kopi dengan gambar, catatan rasa, varian harga. Tombol "Masuk/Daftar" muncul jika user belum login.
3. **Autentikasi Supabase:** Modal login/registrasi email + password, menampilkan error dan loading state.
4. **Keranjang Slide-over:** Drawer interaktif dengan animasi buka/tutup, kontrol kuantitas, subtotal.
5. **Add-to-Cart Modal:** Pemilihan varian gram dan kuantitas dengan kalkulasi subtotal.
6. **Checkout Modal:** Form penerima, alamat, WA, catatan; setelah submit membuka WhatsApp grup/link sebagai placeholder proses order.
7. **Order Summary Card:** Menampilkan ringkasan pesanan terakhir pada halaman marketplace.
8. **Testimoni & Kontak:** Testimoni pelanggan dan formulir kolaborasi yang mengarah ke WhatsApp.

## Alur Data & Logika
- **Autentikasi:** `supabase.auth.getSession()` dijalankan saat mount, lalu `supabase.auth.onAuthStateChange` untuk sinkronisasi. Logout mengosongkan keranjang.
- **Inventori:** `beans.json` berisi objek kopi dengan `variants` (gram vs harga). Fungsi `resolveBeanImage` menentukan sumber gambar (lokal/public).
- **Keranjang:** Item disimpan di state lokal (array). Penambahan item menggabungkan varian sama, menyediakan toast status. Drawer memanfaatkan `useRef` + event listener untuk mendeteksi klik di luar.
- **Checkout:** Simulasi proses 800ms, menyimpan snapshot pesanan ke `lastOrderSummary`, membuka link WhatsApp, dan mereset keranjang.

## Konfigurasi Supabase
Tambahkan kredensial pada `.env`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```
Vars harus tersedia sebelum aplikasi dijalankan, karena `supabaseClient.js` akan melempar error jika kosong.

## Cara Menjalankan
1. **Instal dependensi**
   ```bash
   npm install
   ```
2. **Siapkan env** (`.env` di root, isi nilai Supabase seperti di atas).
3. **Jalankan mode pengembangan**
   ```bash
   npm run dev
   ```
   Akses via `http://localhost:5173`.
4. **Build produksi**
   ```bash
   npm run build
   ```
5. **Preview build** (opsional)
   ```bash
   npm run preview
   ```

## Catatan Pengujian Manual
- Buka keranjang saat belum login → tombol add-to-cart akan memicu modal auth.
- Setelah login, tambahkan beberapa varian kopi, ubah kuantitas, hapus item.
- Jalankan checkout untuk memastikan toast status muncul dan ringkasan pesanan tampil.
- Cek responsive layout (hero sticky header, grid beans) di ukuran mobile / desktop.

## Ide Pengembangan Lanjut
- Persistensi keranjang & riwayat order di database Supabase.
- Integrasi pembayaran (Midtrans/Xendit) alih-alih placeholder WhatsApp.
- Backend untuk mengirim email konfirmasi atau webhook ke admin.
- CMS ringan untuk update konten cerita, testimoni, dan hero copy.

---
Laporan ini merangkum kondisi terkini repository per 3 Desember 2025. Silakan gunakan sebagai referensi dokumentasi tugas kuliah atau handover tim.
