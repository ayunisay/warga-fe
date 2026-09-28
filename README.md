# 🏘️ SAPA WARGA 07 (SI-WARGA 07)
### Sistem Informasi & Pelayanan Administrasi Warga RT 007 / RW 030
**Kelurahan Teluk Pucung, Kecamatan Bekasi Utara, Kota Bekasi**

---

## 📌 Tentang Aplikasi
**SAPA WARGA 07** adalah platform web modern untuk digitalisasi pelayanan administrasi warga dan tata kelola rukun tetangga. Aplikasi ini dirancang untuk mempermudah warga dalam mengurus surat pengantar dan membayar iuran warga, sekaligus membantu jajaran pengurus RT (Ketua RT, Sekretaris, dan Bendahara) dalam mengelola data kependudukan, pembukuan kas, serta publikasi papan informasi.

---

## 🚀 Fitur Utama Berdasarkan Peran (Role-Based Access)

### 👨‍💼 1. Panel Pengurus RT
Sistem dilengkapi pembagian hak akses sesuai tupoksi kepengurusan:

- **Ketua RT**:
  - 📊 **Dashboard Eksekutif**: Statistik penduduk, ringkasan kas RT, pengajuan surat aktif, dan status iuran warga.
  - 👥 **Data Kependudukan**: Pengelolaan data master penduduk, warga berdomisili/sementara, dan pencatatan mutasi (kelahiran, kematian, pindah/datang).
  - 📜 **Persetujuan & Pengesahan Surat**: Tinjauan permohonan surat warga, persetujuan digital, dan cetak surat resmi berstempel digital & QR code verifikasi.
  - 📢 **Papan Informasi RT**: Mengelola pengumuman dan agenda kegiatan warga dengan tombol aktifasi status serta *live preview*.
  - ⚙️ **Manajemen Pengguna**: Pengaturan akun dan peranan pengurus.

- **Sekretaris RT**:
  - Fokus pada administrasi surat-menyurat pengantar dan pendataan kependudukan warga.
  - Verifikasi kelengkapan berkas dan pencetakan surat pengantar warga.

- **Bendahara RT**:
  - 💰 **Keuangan & Kas RT**: Pencatatan transaksi pemasukan dan pengeluaran kas operasional.
  - 💳 **Pencatatan Iuran Warga**: Monitor status pembayaran iuran warga per bulan, konfirmasi setoran tunai atau pembayaran online.
  - *(Catatan: Akses pengajuan surat disembunyikan untuk menjaga fokus pada akuntansi & kas).*

---

### 🏡 2. Portal Mandiri Warga (`Portal Warga`)
Akses khusus warga untuk kemudahan swalayan (*self-service*):

- 📄 **Pengajuan Surat Pengantar Online**:
  - Pengajuan surat kapan saja (SKCK, KTP, Domisili, SKU/UMKM, Pengantar Nikah, SKTM, dsb.).
  - Pantau progres verifikasi surat secara *real-time*.
  - Pratinjau dan cetak surat pengantar resmi yang telah disetujui Ketua RT.

- 💳 **Pembayaran Iuran RT Fleksibel**:
  - **Online via Web**: Scan **QRIS Digital RT 007** (dukung GoPay, OVO, Dana, ShopeePay, BCA, Mandiri) atau Transfer Bank Kas RT (BCA & Mandiri) dengan fitur unggah bukti transfer.
  - **Offline / Setor Tunai**: Jadwalkan waktu kedatangan untuk setor langsung ke rumah Bendahara RT (Ibu Hj. Endang) dengan integrasi pesan WhatsApp otomatis.
  - **Kuitansi Digital**: Kuitansi bukti pembayaran resmi terbit otomatis setelah konfirmasi pembayaran.
  - **Status Tagihan Dinamis**: Matriks riwayat pembayaran per bulan tahun 2026 dengan indikator otomatis *Lunas* / *Belum Lunas*.

- 📢 **Papan Informasi & Kontak Siaga**:
  - Pengumuman kerja bakti, posyandu, pos ronda, dan agenda lingkungan.
  - Kontak cepat darurat Ketua RT, Sekretaris, Bendahara, dan Pos Satpam 24 Jam.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Icon Library**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern Vanilla CSS (Desain responsif, Palet warna elegan, Sticky footer layout)
- **State Management**: React Hooks (`useState`, `useEffect`) dengan Mock Dataset kependudukan realistik RT 007 Teluk Pucung

---

## 📂 Struktur Direktori Proyek

```plaintext
warga-fe/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/              # Aset statis & logo
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx        # Halaman autentikasi & pilih peran demo
│   │   ├── modals/
│   │   │   ├── SuratPrintModal.jsx  # Modal pratinjau & cetak surat berformat resmi
│   │   │   └── TambahWargaModal.jsx # Form tambah data kependudukan baru
│   │   ├── views/
│   │   │   ├── DashboardView.jsx    # Ringkasan analitik pengurus
│   │   │   ├── DataWargaView.jsx    # Tabel kependudukan & mutasi
│   │   │   ├── InformasiView.jsx    # Manajemen papan pengumuman
│   │   │   ├── KeuanganView.jsx     # Buku kas & rekonsiliasi iuran
│   │   │   ├── SettingsView.jsx     # Pengaturan hak akses pengguna
│   │   │   ├── SuratView.jsx        # Pengelolaan arsip permohonan surat
│   │   │   └── WargaPortalView.jsx  # Portal dashboard mandiri warga
│   │   ├── Footer.jsx       # Komponen footer aplikasi
│   │   ├── Header.jsx       # Header bar pengurus dengan avatar & tombol keluar
│   │   └── SidebarDrawer.jsx# Drawer navigasi pengurus
│   ├── data/
│   │   └── mockData.js      # Data awal warga, kas, surat, dan pengumuman
│   ├── App.jsx              # Komponen utama & router logika peran
│   ├── index.css            # Styling sistem, utility class, dan layout
│   └── main.jsx             # Entry point React
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚡ Panduan Menjalankan Aplikasi

### 1. Klon Repositori
```bash
git clone https://github.com/ayunisay/warga-fe.git
cd warga-fe
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses alamat yang tertera (biasanya `http://localhost:5173/`).

### 4. Build untuk Produksi
```bash
npm run build
```

---

## 🔑 Akun Uji Coba Cepat (Demo Logins)

Halaman login menyediakan menu cepat (*one-click switch*) untuk menguji berbagai sudut pandang akun:

| Peran | Nama Akun | NIK / ID | Akses Utama |
| :--- | :--- | :--- | :--- |
| **Ketua RT** | H. Bambang Sugiarto, S.T. | `3275011204850001` | Seluruh menu pengurus + Pengesahan surat |
| **Sekretaris** | Ahmad Fauzi, S.Kom. | `3275018809910008` | Administrasi warga & permohonan surat |
| **Bendahara** | Hj. Endang Suryaningsih | `3275016703800007` | Kas masuk/keluar & konfirmasi iuran |
| **Warga** | Andi Pratama | `3275012301900003` | Portal mandiri: ajukan surat & bayar iuran |

---

## 📄 Lisensi
Hak Cipta © 2026 **SAPA WARGA 07** — RT 007 / RW 030 Kelurahan Teluk Pucung. Dilindungi Undang-Undang.
