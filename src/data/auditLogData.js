/**
 * Initial historical Audit Log Data for SI-WARGA 07
 * Records administrative actions across Data Warga, Keuangan, Surat, and System Security.
 */

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-2026-001',
    timestamp: '2026-03-26T10:45:12+07:00',
    formattedTime: '26 Maret 2026, 10:45 WIB',
    relativeTime: '15 menit lalu',
    actorName: 'Hj. Endang',
    actorRole: 'Bendahara',
    actionType: 'APPROVE',
    module: 'Keuangan & Kas',
    description: 'Verifikasi bukti transfer pembayaran iuran Maret dari warga Ahmad Fauzi',
    target: 'TRX-2026-TRF-001 (Rp 60.000)',
    ipAddress: '192.168.1.18',
    device: 'Desktop Chrome / Windows 11',
    status: 'SUCCESS',
    details: {
      nominal: 60000,
      metode: 'Transfer Bank Mandiri',
      catatan: 'Bukti transfer valid dan dana telah masuk ke rekening RT 007.'
    }
  },
  {
    id: 'LOG-2026-002',
    timestamp: '2026-03-26T09:30:00+07:00',
    formattedTime: '26 Maret 2026, 09:30 WIB',
    relativeTime: '1 jam lalu',
    actorName: 'Sistem Gateway',
    actorRole: 'Sistem Otomatis',
    actionType: 'PAYMENT_CALLBACK',
    module: 'Keuangan & Kas',
    description: 'Penerimaan Webhook Callback: Pembayaran QRIS Dinamis otomatis lunas',
    target: 'QRIS-TRX-88219 (Rp 60.000)',
    ipAddress: '143.244.152.12 (Midtrans/Tripay Gateway)',
    device: 'Server API Webhook',
    status: 'SUCCESS',
    details: {
      pembayar: 'Budi Santoso',
      statusBayar: 'Settled',
      kodeIuran: 'Kebersihan & Keamanan Maret 2026'
    }
  },
  {
    id: 'LOG-2026-003',
    timestamp: '2026-03-25T16:15:40+07:00',
    formattedTime: '25 Maret 2026, 16:15 WIB',
    relativeTime: 'Kemarin',
    actorName: 'H. Bambang',
    actorRole: 'Ketua RT',
    actionType: 'APPROVE',
    module: 'Permohonan Surat',
    description: 'Menyetujui Permohonan Surat Pengantar Domisili Tinggal & menandatangani digital SHA-256',
    target: 'SRT-2026-001 (Bpk. Ahmad Fauzi)',
    ipAddress: '192.168.1.12',
    device: 'Mobile Safari / iOS 17',
    status: 'SUCCESS',
    details: {
      noSurat: '045/RT.007-RW.030/TP/III/2026',
      keperluan: 'Syarat Pengajuan Paspor Baru',
      verifikasiHash: 'a7c93e4f8812...sha256'
    }
  },
  {
    id: 'LOG-2026-004',
    timestamp: '2026-03-25T14:20:10+07:00',
    formattedTime: '25 Maret 2026, 14:20 WIB',
    relativeTime: 'Kemarin',
    actorName: 'Ahmad Fauzi',
    actorRole: 'Sekretaris',
    actionType: 'UPDATE',
    module: 'Data Warga',
    description: 'Memperbarui data kependudukan warga Rina Wulandari (Pembaruan status pekerjaan dan nomor telepon)',
    target: 'NIK 3275016503920006',
    ipAddress: '192.168.1.15',
    device: 'Desktop Edge / Windows 11',
    status: 'SUCCESS',
    details: {
      fieldDiubah: ['pekerjaan', 'telepon'],
      nilaiLama: { pekerjaan: 'Honorer', telepon: '0812-3344-5500' },
      nilaiBaru: { pekerjaan: 'Akuntan Perusahaan Swasta', telepon: '0877-2233-4455' }
    }
  },
  {
    id: 'LOG-2026-005',
    timestamp: '2026-03-25T11:05:22+07:00',
    formattedTime: '25 Maret 2026, 11:05 WIB',
    relativeTime: 'Kemarin',
    actorName: 'Hj. Endang',
    actorRole: 'Bendahara',
    actionType: 'CREATE',
    module: 'Keuangan & Kas',
    description: 'Pencatatan mutasi kas keluar operasional pengangkutan sampah LH lingkungan',
    target: 'TRX-004 (Rp 1.200.000)',
    ipAddress: '192.168.1.18',
    device: 'Desktop Chrome / Windows 11',
    status: 'SUCCESS',
    details: {
      kategori: 'Pengeluaran',
      sumber: 'Pengangkutan Sampah Lingkungan',
      petugas: 'Ahmad Fauzi (Sekretaris)'
    }
  },
  {
    id: 'LOG-2026-006',
    timestamp: '2026-03-24T15:40:00+07:00',
    formattedTime: '24 Maret 2026, 15:40 WIB',
    relativeTime: '2 hari lalu',
    actorName: 'Ahmad Fauzi',
    actorRole: 'Sekretaris',
    actionType: 'EXPORT',
    module: 'Data Warga',
    description: 'Mengunduh rekapitulasi data kependudukan RT 007 ke format CSV/Excel untuk pelaporan RW',
    target: 'Data_Warga_RT007_RW030.csv',
    ipAddress: '192.168.1.15',
    device: 'Desktop Edge / Windows 11',
    status: 'SUCCESS',
    details: {
      totalBaris: 10,
      kriteria: 'Semua Warga Terdata (UU PDP Masked Formula)'
    }
  },
  {
    id: 'LOG-2026-007',
    timestamp: '2026-03-24T09:12:45+07:00',
    formattedTime: '24 Maret 2026, 09:12 WIB',
    relativeTime: '2 hari lalu',
    actorName: 'H. Bambang',
    actorRole: 'Ketua RT',
    actionType: 'REJECT',
    module: 'Permohonan Surat',
    description: 'Menolak permohonan surat keterangan izin usaha karena berkas foto tempat usaha belum dilampirkan',
    target: 'SRT-2026-009 (Ibu Sumiati)',
    ipAddress: '192.168.1.12',
    device: 'Mobile Safari / iOS 17',
    status: 'SUCCESS',
    details: {
      alasan: 'Foto kios UMKM dan izin sewa tempat belum lengkap. Silakan ajukan kembali.',
      statusSurat: 'Ditolak'
    }
  },
  {
    id: 'LOG-2026-008',
    timestamp: '2026-03-23T14:00:30+07:00',
    formattedTime: '23 Maret 2026, 14:00 WIB',
    relativeTime: '3 hari lalu',
    actorName: 'Ahmad Fauzi',
    actorRole: 'Sekretaris',
    actionType: 'CREATE',
    module: 'Data Warga',
    description: 'Mendaftarkan warga baru ke sistem database RT: Dimas Anggara (Blok C3 No. 05)',
    target: 'NIK 3275012810010007',
    ipAddress: '192.168.1.15',
    device: 'Desktop Edge / Windows 11',
    status: 'SUCCESS',
    details: {
      nama: 'Dimas Anggara',
      statusTinggal: 'Tetap',
      pekerjaan: 'Mahasiswa'
    }
  },
  {
    id: 'LOG-2026-009',
    timestamp: '2026-03-22T20:10:15+07:00',
    formattedTime: '22 Maret 2026, 20:10 WIB',
    relativeTime: '4 hari lalu',
    actorName: 'Ahmad Fauzi',
    actorRole: 'Sekretaris',
    actionType: 'CREATE',
    module: 'Papan Informasi',
    description: 'Mempublikasikan pengumuman agenda ronda malam & jadwal kerja bakti menjelang Ramadhan',
    target: 'Pengumuman: Jadwal Ronda Ramadhan 1447H',
    ipAddress: '192.168.1.15',
    device: 'Desktop Edge / Windows 11',
    status: 'SUCCESS',
    details: {
      prioritas: 'Tinggi',
      targetWarga: 'Seluruh Warga RT 007'
    }
  },
  {
    id: 'LOG-2026-010',
    timestamp: '2026-03-21T08:00:00+07:00',
    formattedTime: '21 Maret 2026, 08:00 WIB',
    relativeTime: '5 hari lalu',
    actorName: 'H. Bambang',
    actorRole: 'Ketua RT',
    actionType: 'LOGIN',
    module: 'Keamanan & Autentikasi',
    description: 'Autentikasi sesi login berhasil sebagai Ketua RT',
    target: 'Sesi Pengurus RT 007',
    ipAddress: '192.168.1.12',
    device: 'Mobile Safari / iOS 17',
    status: 'SUCCESS',
    details: {
      username: 'ketuart',
      tokenExpiry: '24 Jam'
    }
  }
];
