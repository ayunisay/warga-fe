/**
 * Utilitas Data Masking & Privasi Kependudukan
 * Sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)
 */

export function maskNik(nik) {
  if (!nik) return '-';
  const str = String(nik).trim();
  if (str.length < 10) return str;
  // Format: 6 digit pertama (kode wilayah/provinsi/kab), 6 digit tengah sensor, 4 digit akhir
  return `${str.slice(0, 6)}******${str.slice(-4)}`;
}

export function maskKk(noKk) {
  if (!noKk) return '-';
  const str = String(noKk).trim();
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}******${str.slice(-4)}`;
}

export function maskPhone(phone) {
  if (!phone || phone === '-') return '-';
  const clean = String(phone).replace(/[\s-+]/g, '');
  if (clean.length >= 10) {
    return `${clean.slice(0, 4)}-****-${clean.slice(-4)}`;
  }
  return `${clean.slice(0, 3)}****${clean.slice(-2)}`;
}
