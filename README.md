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

- **Ketua RT & Sekretaris RT**:
  - 📊 **Dashboard Eksekutif**: Statistik penduduk, ringkasan kas RT, pengajuan surat aktif, dan status iuran warga.
  - 👥 **Data Kependudukan**: Pengelolaan data master penduduk, warga berdomisili/sementara, dan pencatatan mutasi (kelahiran, kematian, pindah/datang).
  - 📜 **Persetujuan & Penolakan Surat**:
    - **Persetujuan Digital**: Tinjauan permohonan surat warga, pengesahan digital, dan cetak surat resmi berstempel & QR code.
    - **Catatan Penolakan Surat**: Pengurus dapat menolak permohonan surat dengan mencantumkan alasan/catatan perbaikan (dengan template cepat & input bebas) yang langsung terbaca oleh warga.
  - 📢 **Papan Informasi RT**: Mengelola pengumuman dan agenda kegiatan warga dengan tombol aktifasi status serta *live preview*.
  - ⚙️ **Manajemen Pengguna**: Pengaturan akun dan peranan pengurus.
  - 🔒 **Pembatasan Hak Akses Keuangan**: *Ketua RT dan Sekretaris RT **tidak diberi akses** untuk memverifikasi pembayaran/bukti transfer warga demi menegakkan prinsip pemisahan wewenang (segregation of duties).*

- **Bendahara RT**:
  - 💰 **Keuangan & Kas RT**: Pencatatan transaksi pemasukan dan pengeluaran kas operasional serta rekapitulasi buku kas.
  - 🔍 **Verifikasi Bukti Transfer Warga (Eksklusif Bendahara RT)**:
    - *Hak akses eksklusif:* Hanya Bendahara RT yang berwenang memeriksa dan memverifikasi bukti transfer pembayaran warga.
    - Memeriksa unggahan struk transfer m-banking / QRIS warga secara detail melalui modal struk digital resmi.
    - Tombol **Verifikasi & Terima** (otomatis menandai iuran warga lunas dan mencatat kas masuk RT).
    - Tombol **Tolak Bukti Transfer** lengkap dengan catatan alasan penolakan ke warga.
  - 💳 **Pencatatan Iuran Warga**: Monitor status pembayaran iuran warga per bulan, konfirmasi setoran tunai atau pembayaran online.
  - *(Catatan: Akses pengajuan surat disembunyikan untuk menjaga fokus pada akuntansi & kas).*

---

### 🏡 2. Portal Mandiri Warga (`Portal Warga`)
Akses khusus warga untuk kemudahan swalayan (*self-service*):

- 📄 **Pengajuan Surat Pengantar Online**:
  - Pengajuan surat kapan saja (SKCK, KTP, Domisili, SKU/UMKM, Pengantar Nikah, SKTM, dsb.).
  - Pantau progres verifikasi surat secara *real-time*.
  - **Notifikasi Penolakan Transparan**: Jika ditolak pengurus, warga dapat membaca alasan penolakan secara jelas dan langsung memperbaiki permohonan melalui tombol *Perbaiki & Ajukan Ulang*.
  - Pratinjau dan cetak surat pengantar resmi yang telah disetujui Ketua RT.

- 💳 **Pembayaran Iuran RT Fleksibel**:
  - **Online via Web**: Scan **QRIS Digital RT 007** (dukung GoPay, OVO, Dana, ShopeePay, BCA, Mandiri) atau Transfer Bank Kas RT (BCA & Mandiri) dengan fitur unggah bukti transfer.
  - **Status Verifikasi Transfer**: Warga dapat memantau status verifikasi bukti transfer yang diunggah secara *live* (*Menunggu Verifikasi*, *Terverifikasi*, atau *Ditolak* lengkap dengan catatan dari Bendahara).
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

## ⚠️ Status Data & Keterbatasan Frontend Saat Ini

> [!IMPORTANT]
> **PEMBERITAHUAN DATA DUMMY / MOCK DATA:**
> Seluruh data yang ditampilkan di dalam aplikasi frontend ini (data master penduduk, NIK, No. KK, mutasi kas RT, arsip surat pengantar, pengumuman, dan riwayat transfer iuran) **100% masih menggunakan data tiruan statis (*mock data*)** yang didefinisikan pada berkas [`src/data/mockData.js`](file:///c:/laragon/www/warga-fe/src/data/mockData.js). Aplikasi ini **belum terhubung ke backend API maupun basis data (database) riil**.

---

### 🔍 Analisis Kekurangan Sistem Sampai Detail Terkecil

Meskipun antarmuka dan interaksi pengguna telah lengkap dan teruji secara fungsional di sisi frontend, berikut adalah daftar celah kritis, keterbatasan arsitektur, dan isu keamanan yang **wajib dipahami dan diperbaiki** sebelum sistem masuk ke tahap *production*:

#### 1. 🛡️ Keamanan & Privasi Data (Security & Privacy Vulnerabilities)
- **Autentikasi Bersifat *Client-Side Only* (Palsu):**
  - Proses login hanya memanipulasi *state* React (`currentUser`). Tidak ada token sesi rahasia (seperti JWT atau session cookie aman beratribut `HttpOnly` dan `SameSite`).
  - Siapa pun yang membuka *DevTools Console* di browser dapat memanipulasi variabel state untuk menaikkan hak akses (*privilege escalation*) menjadi Ketua RT atau Bendahara tanpa verifikasi kredensial.
- **Kebocoran Data Pribadi Sensitif (Pelanggaran UU PDP):**
  - Nomor Induk Kependudukan (NIK), No. KK, nomor telepon, dan riwayat keluarga tersimpan dalam berkas JavaScript statis yang di-*bundle*. Siapa pun dapat menginspeksi kode sumber web (*View Source* / Network tab) dan melihat seluruh data warga tanpa perlu login.
  - Belum ada mekanisme penyembunyian (*masking* data) seperti `327501******0001` untuk publik atau non-admin.
- **Simulasi Berkas & Bukti Transfer Tanpa Sanitasi:**
  - Unggahan struk bukti transfer saat ini hanya berupa simulasi string nama berkas (`struk_transfer_warga.jpg`).
  - Tidak ada validasi tipe MIME biner, pemindaian virus/malware, batasan ukuran berkas (*file size limit*), maupun proteksi terhadap *malicious payload* (misalnya berkas executable `.exe` atau skrip `.php` yang disamarkan sebagai gambar).
- **Integritas Dokumen Surat & Stempel Digital:**
  - Stempel RT dan tanda tangan digital saat ini dirender menggunakan elemen visual CSS & HTML biasa.
  - Dokumen pengantar sangat rentan dipalsukan karena siapa pun bisa mengubah teks nama, nomor surat, atau tanggal melalui fitur *Inspect Element* browser sebelum melakukan pencetakan PDF. Dokumen belum dibubuhi sertifikat digital kriptografi (*cryptographic digital signature* / SHA-256 hash).

#### 2. 💾 Integritas & Persistensi Data (State & Data Integrity)
- **Tidak Ada Persistensi Antar Sesi (*Volatile State*):**
  - Perubahan data (surat yang baru diajukan, surat yang ditolak, status iuran yang diverifikasi, atau transaksi kas baru) hanya hidup di memori RAM browser. Begitu halaman di-refresh keras (*hard reload* / F5), seluruh data akan kembali ke *default mock data*.
- **Celah *Race Condition* & Duplikasi:**
  - Tidak ada validasi unik di tingkat database untuk mencegah 1 NIK terdaftar dua kali.
  - Tidak ada penguncian transaksi (*transaction lock* / idempotency key) untuk mencegah anggota keluarga dalam 1 KK membayar iuran bulan yang sama secara bersamaan melalui dua gawai berbeda.

#### 3. ⚡ Skalabilitas & Performa (Client Bottlenecks)
- **Pemrosesan Data 100% di Memori Klien (*Client-side Filtering*):**
  - Seluruh fungsi pencarian nama, filter kategori, dan kalkulasi saldo kas dilakukan di peramban pengguna.
  - Untuk lingkup 1 RT (±100-200 KK) beban masih tergolong ringan. Namun jika sistem diperluas ke tingkat RW (puluhan RT) atau Kelurahan (ribuan warga), browser pengguna gawai berdaya rendah (*low-end smartphones*) akan mengalami *freeze* / lag akibat kehabisan memori.
- **Absennya Paginasi Server (*Server-Side Pagination*):**
  - Seluruh baris data warga dan mutasi keuangan dimuat sekaligus di satu waktu (*no infinite scroll / server pagination*).

---

### 💡 Saran & Rekomendasi Tindak Lanjut (Roadmap Pengembangan Backend)

Untuk mengubah prototipe frontend ini menjadi aplikasi siap pakai di lingkungan RT nyata, langkah-langkah berikut sangat disarankan:

| Area | Tindakan yang Harus Dilakukan | Teknologi yang Direkomendasikan |
| :--- | :--- | :--- |
| **Backend API** | Membangun RESTful API atau GraphQL yang menangani seluruh *business logic*, sanitasi input, dan transaksi database. | Node.js (Express / NestJS), Laravel, atau Go (Gin/Fiber). |
| **Database** | Menggunakan basis data relasional dengan indeks pada NIK, No KK, dan status transaksi. | PostgreSQL atau MySQL / MariaDB. |
| **Autentikasi Aman** | Menerapkan autentikasi berbasis JWT yang disimpan di cookie `HttpOnly` + `Secure` + `SameSite=Strict`, dilengkapi hashing password `bcrypt` / `argon2`. | Passport.js, Laravel Sanctum, atau Supabase Auth. |
| **Perlindungan Data (UU PDP)** | Enkripsi kolom sensitif (NIK, KK) di database (*encryption at rest*), serta implementasi *data masking* pada tampilan warga. | AES-256 encryption. |
| **Penyimpanan Berkas Bukti** | Mengunggah foto bukti transfer dan scan KTP ke *Object Storage* yang aman menggunakan *Presigned Upload URL* dan validasi tipe berkas ketat (hanya JPG, PNG, PDF maks. 2MB). | AWS S3, Google Cloud Storage, Cloudinary, atau MinIO lokal. |
| **Payment Gateway Otomatis** | Menggantikan upload struk manual dengan integrasi payment gateway resmi agar verifikasi transfer bank dan QRIS berjalan otomatis melalui *Webhook callback*. | Midtrans, Xendit, atau Tripay (QRIS Dinamis & Virtual Account). |
| **Verifikasi Keaslian Surat** | Menghasilkan QR code resmi pada surat pengantar yang ketika dipindai kamera HP akan membuka laman verifikasi publik backend: `https://domain-rt.id/verify-surat/{hash}` untuk membuktikan keaslian surat tanpa bisa dimanipulasi warga. | SHA-256 token verification endpoint. |

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
