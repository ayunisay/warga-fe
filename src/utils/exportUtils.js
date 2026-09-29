/**
 * Utility functions for exporting data to CSV with UTF-8 BOM
 * Compatible with Microsoft Excel, Google Sheets, and LibreOffice.
 */

// Helper to trigger browser download
function downloadCsvFile(content, filename) {
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Escape cell content for CSV
function escapeCsvCell(val, isTextOnlyNumber = false) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  
  // Format as Excel text formula if it's a long number string like NIK/KK to prevent scientific notation
  if (isTextOnlyNumber && str.length > 0) {
    return `="""${str.replace(/"/g, '""""')}"""`;
  }
  
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Export Citizens data to formatted CSV
 * @param {Array} citizens
 * @param {string} customFilename
 */
export function exportCitizensToCsv(citizens = [], customFilename) {
  const headers = [
    'No',
    'Nama Lengkap',
    'NIK',
    'No. Kartu Keluarga',
    'Jenis Kelamin',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Agama',
    'Status Perkawinan',
    'Pekerjaan',
    'Alamat Domisili',
    'Blok',
    'No Rumah',
    'Status Tinggal',
    'No. HP / WA',
    'Peran Keluarga',
    'Status Iuran',
    'Tanggal Terdaftar'
  ];

  const rows = citizens.map((c, idx) => [
    idx + 1,
    escapeCsvCell(c.nama),
    escapeCsvCell(c.nik, true),
    escapeCsvCell(c.noKk, true),
    escapeCsvCell(c.jenisKelamin),
    escapeCsvCell(c.tempatLahir || '-'),
    escapeCsvCell(c.tanggalLahir || '-'),
    escapeCsvCell(c.agama || '-'),
    escapeCsvCell(c.statusKawin || '-'),
    escapeCsvCell(c.pekerjaan || '-'),
    escapeCsvCell(c.alamat || '-'),
    escapeCsvCell(c.blok || '-'),
    escapeCsvCell(c.noRumah || '-'),
    escapeCsvCell(c.statusTinggal || '-'),
    escapeCsvCell(c.telepon || '-', true),
    escapeCsvCell(c.peranKeluarga || '-'),
    escapeCsvCell(c.statusIuran || '-'),
    escapeCsvCell(c.tanggalDaftar || '-')
  ]);

  const csvContent = [
    headers.map(h => `"${h}"`).join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\r\n');

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filename = customFilename || `Data_Warga_RT007_RW030_${dateStr}.csv`;

  downloadCsvFile(csvContent, filename);
}

/**
 * Export Kas RT Ledger to formatted CSV
 * @param {Array} transactions
 * @param {Object} options
 */
export function exportKasLedgerToCsv(transactions = [], options = {}) {
  const headers = [
    'No',
    'ID Transaksi',
    'Tanggal',
    'Kategori',
    'Sumber / Penerima',
    'Keterangan Keperluan',
    'Pemasukan (Rp)',
    'Pengeluaran (Rp)',
    'Petugas Bendahara'
  ];

  let totalMasuk = 0;
  let totalKeluar = 0;

  const rows = transactions.map((t, idx) => {
    const isMasuk = t.kategori === 'Pemasukan';
    const masukVal = isMasuk ? Number(t.nominal || 0) : 0;
    const keluarVal = !isMasuk ? Number(t.nominal || 0) : 0;
    
    totalMasuk += masukVal;
    totalKeluar += keluarVal;

    return [
      idx + 1,
      escapeCsvCell(t.id),
      escapeCsvCell(t.tanggal),
      escapeCsvCell(t.kategori),
      escapeCsvCell(t.sumber),
      escapeCsvCell(t.keterangan || '-'),
      masukVal > 0 ? masukVal : 0,
      keluarVal > 0 ? keluarVal : 0,
      escapeCsvCell(t.petugas || '-')
    ];
  });

  const netSaldo = totalMasuk - totalKeluar;

  // Add Summary Rows at the bottom
  const summaryRows = [
    ['', '', '', '', 'TOTAL PEMASUKAN', '', totalMasuk, 0, ''],
    ['', '', '', '', 'TOTAL PENGELUARAN', '', 0, totalKeluar, ''],
    ['', '', '', '', 'SALDO AKHIR PERIODE INI', '', netSaldo, '', '']
  ];

  const csvLines = [
    `"LAPORAN BUKU KAS RT 007 / RW 030"`,
    `"Periode: ${options.periode || 'Semua Data'}"`,
    `"Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`,
    '',
    headers.map(h => `"${h}"`).join(';'),
    ...rows.map(row => row.join(';')),
    '',
    ...summaryRows.map(row => row.map(v => typeof v === 'number' ? v : escapeCsvCell(v)).join(';'))
  ];

  const csvContent = csvLines.join('\r\n');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filename = options.filename || `Buku_Kas_RT007_${dateStr}.csv`;

  downloadCsvFile(csvContent, filename);
}

/**
 * Export Iuran Warga Status to formatted CSV
 * @param {Array} citizens
 * @param {string} bulan
 */
export function exportIuranToCsv(citizens = [], bulan = 'Maret 2026') {
  const headers = [
    'No',
    'Kepala Keluarga / Nama',
    'NIK',
    'No. Kartu Keluarga',
    'Blok',
    'No. Rumah',
    'Alamat Lengkap',
    'Periode Tagihan',
    'Nominal Iuran (Rp)',
    'Status Pembayaran'
  ];

  const rows = citizens.map((c, idx) => [
    idx + 1,
    escapeCsvCell(c.nama),
    escapeCsvCell(c.nik, true),
    escapeCsvCell(c.noKk, true),
    escapeCsvCell(c.blok || '-'),
    escapeCsvCell(c.noRumah || '-'),
    escapeCsvCell(c.alamat || '-'),
    escapeCsvCell(bulan),
    60000,
    escapeCsvCell(c.statusIuran || 'Belum Lunas')
  ]);

  const csvLines = [
    `"REKAPITULASI PEMBAYARAN IURAN WARGA RT 007 / RW 030"`,
    `"Periode: ${bulan}"`,
    `"Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`,
    '',
    headers.map(h => `"${h}"`).join(';'),
    ...rows.map(row => row.join(';'))
  ];

  const csvContent = csvLines.join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsvFile(csvContent, `Rekap_Iuran_RT007_${bulan.replace(/\s+/g, '_')}_${dateStr}.csv`);
}

/**
 * Export Audit Logs to formatted CSV
 * @param {Array} logs
 * @param {string} customFilename
 */
export function exportAuditLogsToCsv(logs = [], customFilename) {
  const headers = [
    'No',
    'ID Log',
    'Waktu & Tanggal',
    'Pengurus / Aktor',
    'Jabatan / Role',
    'Modul',
    'Tipe Aksi',
    'Deskripsi Aktivitas',
    'Objek Target',
    'IP Address & Perangkat',
    'Status'
  ];

  const rows = logs.map((log, idx) => [
    idx + 1,
    escapeCsvCell(log.id),
    escapeCsvCell(log.formattedTime || log.timestamp),
    escapeCsvCell(log.actorName),
    escapeCsvCell(log.actorRole),
    escapeCsvCell(log.module),
    escapeCsvCell(log.actionType),
    escapeCsvCell(log.description),
    escapeCsvCell(log.target),
    escapeCsvCell(`${log.ipAddress} (${log.device})`),
    escapeCsvCell(log.status || 'SUCCESS')
  ]);

  const csvLines = [
    `"AUDIT TRAIL & LOG AKTIVITAS PENGURUS RT 007 / RW 030"`,
    `"Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`,
    `"Total Baris: ${logs.length} catatan"`,
    '',
    headers.map(h => `"${h}"`).join(';'),
    ...rows.map(row => row.join(';'))
  ];

  const csvContent = csvLines.join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Audit_Log_RT007_${dateStr}.csv`;
  downloadCsvFile(csvContent, filename);
}


