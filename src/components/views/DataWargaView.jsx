import React, { useState } from 'react';
import { 
  Users, UserCheck, Home, Baby, UserPlus, Search, Filter, 
  Calendar, RotateCcw, Eye, Trash2, Edit3, MapPin, Phone, ShieldCheck 
} from 'lucide-react';
import { DEMOGRAFI_DATA } from '../../data/mockData';

const NAMA_BULAN = [
  { code: '01', name: 'Januari' },
  { code: '02', name: 'Februari' },
  { code: '03', name: 'Maret' },
  { code: '04', name: 'April' },
  { code: '05', name: 'Mei' },
  { code: '06', name: 'Juni' },
  { code: '07', name: 'Juli' },
  { code: '08', name: 'Agustus' },
  { code: '09', name: 'September' },
  { code: '10', name: 'Oktober' },
  { code: '11', name: 'November' },
  { code: '12', name: 'Desember' }
];

export default function DataWargaView({ 
  citizens, 
  activeSubMenu, 
  onSelectSubMenu, 
  onOpenAddModal, 
  onDeleteCitizen 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBulan, setFilterBulan] = useState('Semua');
  const [filterTahun, setFilterTahun] = useState('Semua');
  const [selectedCitizen, setSelectedCitizen] = useState(null);

  // Quick period presets
  const handleSetPeriod = (bulan, tahun) => {
    setFilterBulan(bulan);
    setFilterTahun(tahun);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterBulan('Semua');
    setFilterTahun('Semua');
  };

  const isFilterActive = searchTerm !== '' || filterBulan !== 'Semua' || filterTahun !== 'Semua';

  // Filter logic based on submenu, month, year, and search
  const filteredCitizens = citizens.filter((citizen) => {
    // 1. Submenu filter
    if (activeSubMenu === 'sementara' && citizen.statusTinggal !== 'Sementara / Kontrak') {
      return false;
    }
    if (activeSubMenu === 'mutasi' && !citizen.statusTinggal.includes('Mutasi')) {
      return false;
    }

    // 3. Filter Per-Bulan dan Per-Tahun
    if (citizen.tanggalDaftar) {
      const [year, month] = citizen.tanggalDaftar.split('-');
      if (filterTahun !== 'Semua' && year !== filterTahun) {
        return false;
      }
      if (filterBulan !== 'Semua' && month !== filterBulan) {
        return false;
      }
    }

    // 4. Search query
    const matchQuery = 
      citizen.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.nik.includes(searchTerm) ||
      citizen.alamat.toLowerCase().includes(searchTerm.toLowerCase());

    return matchQuery;
  });

  const formatTanggalIndo = (tglStr) => {
    if (!tglStr) return '-';
    const [thn, bln, tgl] = tglStr.split('-');
    const bulanObj = NAMA_BULAN.find(b => b.code === bln);
    return `${tgl} ${bulanObj ? bulanObj.name : bln} ${thn}`;
  };

  return (
    <div className="data-warga-page">
      {/* 8 Yellow Cards (Grid 4x2, EXACTLY MATCHES Image 4) */}
      <div className="yellow-cards-grid-8">
        <div className="yellow-card" style={{ minHeight: '120px', padding: '18px 20px' }}>
          <div className="card-label" style={{ marginTop: 0 }}>Total Penduduk</div>
          <div className="card-value" style={{ fontSize: '28px' }}>{DEMOGRAFI_DATA.totalWarga} <span style={{ fontSize: '14px' }}>Jiwa</span></div>
          <div className="card-subtext">Warga terdata di RT 007</div>
        </div>

        <div className="yellow-card" style={{ minHeight: '120px', padding: '18px 20px' }}>
          <div className="card-label" style={{ marginTop: 0 }}>Kepala Keluarga</div>
          <div className="card-value" style={{ fontSize: '28px' }}>{DEMOGRAFI_DATA.totalKK} <span style={{ fontSize: '14px' }}>KK</span></div>
          <div className="card-subtext">Kepala Rumah Tangga</div>
        </div>

        <div className="yellow-card" style={{ minHeight: '120px', padding: '18px 20px' }}>
          <div className="card-label" style={{ marginTop: 0 }}>Laki - Laki</div>
          <div className="card-value" style={{ fontSize: '28px' }}>{DEMOGRAFI_DATA.pria} <span style={{ fontSize: '14px' }}>Jiwa</span></div>
          <div className="card-subtext">51% Rasio Pria</div>
        </div>

        <div className="yellow-card" style={{ minHeight: '120px', padding: '18px 20px' }}>
          <div className="card-label" style={{ marginTop: 0 }}>Perempuan</div>
          <div className="card-value" style={{ fontSize: '28px' }}>{DEMOGRAFI_DATA.wanita} <span style={{ fontSize: '14px' }}>Jiwa</span></div>
          <div className="card-subtext">49% Rasio Wanita</div>
        </div>

        <div className="yellow-card" style={{ minHeight: '120px', padding: '18px 20px' }}>
          <div className="card-label" style={{ marginTop: 0 }}>Balita & Anak</div>
          <div className="card-value" style={{ fontSize: '28px' }}>{DEMOGRAFI_DATA.balita} <span style={{ fontSize: '14px' }}>Jiwa</span></div>
          <div className="card-subtext">Usia di bawah 17 thn</div>
        </div>

        <div className="yellow-card" style={{ minHeight: '120px', padding: '18px 20px' }}>
          <div className="card-label" style={{ marginTop: 0 }}>Usia Produktif</div>
          <div className="card-value" style={{ fontSize: '28px' }}>{DEMOGRAFI_DATA.usiaProduktif} <span style={{ fontSize: '14px' }}>Jiwa</span></div>
          <div className="card-subtext">Usia 18 - 59 thn</div>
        </div>

        <div className="yellow-card" style={{ minHeight: '120px', padding: '18px 20px' }}>
          <div className="card-label" style={{ marginTop: 0 }}>Lansia (≥60)</div>
          <div className="card-value" style={{ fontSize: '28px' }}>{DEMOGRAFI_DATA.lansia} <span style={{ fontSize: '14px' }}>Jiwa</span></div>
          <div className="card-subtext">Penerima posyandu lansia</div>
        </div>

        <div className="yellow-card" style={{ minHeight: '120px', padding: '18px 20px' }}>
          <div className="card-label" style={{ marginTop: 0 }}>Domisili Sementara</div>
          <div className="card-value" style={{ fontSize: '28px' }}>{DEMOGRAFI_DATA.wargaSementara} <span style={{ fontSize: '14px' }}>Jiwa</span></div>
          <div className="card-subtext">Kontrak / Kos / Sementara</div>
        </div>
      </div>

      {/* Submenu Filter Tabs & Controls */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        {/* Row 1: Submenu Tabs & Tambah Warga Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '16px',
          marginBottom: '16px'
        }}>
          {/* Submenu Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onSelectSubMenu('warga', 'master')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                background: activeSubMenu === 'master' ? '#3B7594' : '#f1f5f9',
                color: activeSubMenu === 'master' ? '#ffffff' : '#475569'
              }}
            >
              Data Master Penduduk
            </button>
            <button 
              onClick={() => onSelectSubMenu('warga', 'sementara')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                background: activeSubMenu === 'sementara' ? '#3B7594' : '#f1f5f9',
                color: activeSubMenu === 'sementara' ? '#ffffff' : '#475569'
              }}
            >
              Penduduk Sementara / Domisili ({citizens.filter(c => c.statusTinggal === 'Sementara / Kontrak').length})
            </button>
            <button 
              onClick={() => onSelectSubMenu('warga', 'mutasi')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                background: activeSubMenu === 'mutasi' ? '#3B7594' : '#f1f5f9',
                color: activeSubMenu === 'mutasi' ? '#ffffff' : '#475569'
              }}
            >
              Mutasi Kependudukan ({citizens.filter(c => c.statusTinggal.includes('Mutasi')).length})
            </button>
          </div>

          {/* Action button */}
          <button 
            onClick={onOpenAddModal}
            style={{
              background: '#3B7594',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(59, 117, 148, 0.3)'
            }}
          >
            <UserPlus size={18} /> Tambah Warga Baru
          </button>
        </div>

        {/* Row 2: Search Bar & Filters (Blok, Bulan, Tahun) */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search input */}
          <div style={{ flex: '1 1 240px', minWidth: '220px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama warga, NIK, atau alamat..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px'
              }}
            />
          </div>

          {/* Filter Per-Bulan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="#3B7594" />
            <select 
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: filterBulan !== 'Semua' ? '1.5px solid #3B7594' : '1px solid #cbd5e1',
                fontSize: '13px',
                background: filterBulan !== 'Semua' ? '#eaf3f8' : '#ffffff',
                color: filterBulan !== 'Semua' ? '#2c5c75' : '#334155',
                fontWeight: 700
              }}
              title="Filter Kategori Berdasarkan Bulan"
            >
              <option value="Semua">Semua Bulan</option>
              {NAMA_BULAN.map(b => (
                <option key={b.code} value={b.code}>Bulan {b.name}</option>
              ))}
            </select>
          </div>

          {/* Filter Per-Tahun */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select 
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: filterTahun !== 'Semua' ? '1.5px solid #3B7594' : '1px solid #cbd5e1',
                fontSize: '13px',
                background: filterTahun !== 'Semua' ? '#eaf3f8' : '#ffffff',
                color: filterTahun !== 'Semua' ? '#2c5c75' : '#334155',
                fontWeight: 700
              }}
              title="Filter Kategori Berdasarkan Tahun"
            >
              <option value="Semua">Semua Tahun</option>
              <option value="2026">Tahun 2026</option>
              <option value="2025">Tahun 2025</option>
              <option value="2024">Tahun 2024</option>
            </select>
          </div>

          {/* Reset Filter Button */}
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#dc2626',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Reset semua filter"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        {/* Row 3: Quick Filter Presets (Kategori Cepat Periode) */}
        <div style={{ 
          marginTop: '14px', 
          paddingTop: '12px', 
          borderTop: '1px dashed #e2e8f0', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          flexWrap: 'wrap' 
        }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
            Kategori Periode Cepat:
          </span>
          <button
            onClick={() => handleSetPeriod('Semua', 'Semua')}
            style={{
              fontSize: '11.5px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: filterBulan === 'Semua' && filterTahun === 'Semua' ? '#3B7594' : '#f1f5f9',
              color: filterBulan === 'Semua' && filterTahun === 'Semua' ? '#ffffff' : '#475569',
              fontWeight: 600
            }}
          >
            Semua Waktu
          </button>
          <button
            onClick={() => handleSetPeriod('03', '2026')}
            style={{
              fontSize: '11.5px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: filterBulan === '03' && filterTahun === '2026' ? '#3B7594' : '#f1f5f9',
              color: filterBulan === '03' && filterTahun === '2026' ? '#ffffff' : '#475569',
              fontWeight: 600
            }}
          >
            Bulan Ini (Maret 2026)
          </button>
          <button
            onClick={() => handleSetPeriod('02', '2026')}
            style={{
              fontSize: '11.5px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: filterBulan === '02' && filterTahun === '2026' ? '#3B7594' : '#f1f5f9',
              color: filterBulan === '02' && filterTahun === '2026' ? '#ffffff' : '#475569',
              fontWeight: 600
            }}
          >
            Februari 2026
          </button>
          <button
            onClick={() => handleSetPeriod('01', '2026')}
            style={{
              fontSize: '11.5px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: filterBulan === '01' && filterTahun === '2026' ? '#3B7594' : '#f1f5f9',
              color: filterBulan === '01' && filterTahun === '2026' ? '#ffffff' : '#475569',
              fontWeight: 600
            }}
          >
            Januari 2026
          </button>
          <button
            onClick={() => handleSetPeriod('Semua', '2026')}
            style={{
              fontSize: '11.5px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: filterBulan === 'Semua' && filterTahun === '2026' ? '#3B7594' : '#f1f5f9',
              color: filterBulan === 'Semua' && filterTahun === '2026' ? '#ffffff' : '#475569',
              fontWeight: 600
            }}
          >
            Tahun Penuh 2026
          </button>
          <button
            onClick={() => handleSetPeriod('Semua', '2025')}
            style={{
              fontSize: '11.5px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: filterBulan === 'Semua' && filterTahun === '2025' ? '#3B7594' : '#f1f5f9',
              color: filterBulan === 'Semua' && filterTahun === '2025' ? '#ffffff' : '#475569',
              fontWeight: 600
            }}
          >
            Tahun 2025
          </button>
        </div>
      </div>

      {/* Citizen Data Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
              Daftar Warga RT 007 ({filteredCitizens.length} Data Ditampilkan)
            </h3>
            {(filterBulan !== 'Semua' || filterTahun !== 'Semua') && (
              <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 600 }}>
                Filter Aktif: {filterBulan !== 'Semua' ? `Bulan ${NAMA_BULAN.find(b => b.code === filterBulan)?.name} ` : ''}{filterTahun !== 'Semua' ? `Tahun ${filterTahun}` : ''}
              </span>
            )}
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Wilayah: Kelurahan Teluk Pucung, Bekasi Utara
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 18px' }}>Nama & NIK</th>
                <th style={{ padding: '12px 14px' }}>Jenis Kelamin</th>
                <th style={{ padding: '12px 14px' }}>Alamat / Blok</th>
                <th style={{ padding: '12px 14px' }}>Pekerjaan</th>
                <th style={{ padding: '12px 14px' }}>Status Tinggal</th>
                <th style={{ padding: '12px 14px' }}>Tgl Terdaftar</th>
                <th style={{ padding: '12px 14px' }}>Iuran RT</th>
                <th style={{ padding: '12px 18px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitizens.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    Tidak ada data warga yang cocok dengan filter periode (Bulan / Tahun) atau pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredCitizens.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>{c.nama}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>NIK: {c.nik}</div>
                    </td>
                    <td style={{ padding: '14px 14px', color: '#334155' }}>{c.jenisKelamin}</td>
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.alamat}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Blok {c.blok} - No. {c.noRumah}</div>
                    </td>
                    <td style={{ padding: '14px 14px', color: '#475569' }}>{c.pekerjaan}</td>
                    <td style={{ padding: '14px 14px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: c.statusTinggal === 'Tetap' ? '#dcfce7' : c.statusTinggal.includes('Mutasi') ? '#fee2e2' : '#fef9c3',
                        color: c.statusTinggal === 'Tetap' ? '#15803d' : c.statusTinggal.includes('Mutasi') ? '#b91c1c' : '#854d0e'
                      }}>
                        {c.statusTinggal}
                      </span>
                    </td>
                    <td style={{ padding: '14px 14px', color: '#334155', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {formatTanggalIndo(c.tanggalDaftar)}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: c.statusIuran === 'Lunas' ? '#dcfce7' : '#fee2e2',
                        color: c.statusIuran === 'Lunas' ? '#15803d' : '#b91c1c'
                      }}>
                        {c.statusIuran}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => setSelectedCitizen(c)}
                          title="Lihat Detail Profil"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: '#e0f2fe',
                            color: '#0284c7'
                          }}
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          onClick={() => onDeleteCitizen(c.id)}
                          title="Hapus Warga"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: '#fee2e2',
                            color: '#dc2626'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Detail Popup */}
      {selectedCitizen && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '540px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{selectedCitizen.nama}</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>NIK: {selectedCitizen.nik} | KK: {selectedCitizen.noKk}</p>
              </div>
              <button 
                onClick={() => setSelectedCitizen(null)}
                style={{ padding: '6px', borderRadius: '8px', background: '#f1f5f9' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>TEMPAT, TGL LAHIR</span>
                <span style={{ fontWeight: 600 }}>{selectedCitizen.tempatLahir}, {selectedCitizen.tanggalLahir}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>TANGGAL TERDAFTAR / MUTASI</span>
                <span style={{ fontWeight: 700, color: '#3B7594' }}>{formatTanggalIndo(selectedCitizen.tanggalDaftar)}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>AGAMA</span>
                <span style={{ fontWeight: 600 }}>{selectedCitizen.agama}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>PERAN DALAM KELUARGA</span>
                <span style={{ fontWeight: 600 }}>{selectedCitizen.peranKeluarga}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>PEKERJAAN</span>
                <span style={{ fontWeight: 600 }}>{selectedCitizen.pekerjaan}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>ALAMAT</span>
                <span style={{ fontWeight: 600 }}>{selectedCitizen.alamat}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>KONTAK / HP</span>
                <span style={{ fontWeight: 600 }}>{selectedCitizen.telepon}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>STATUS TINGGAL</span>
                <span style={{ fontWeight: 600, color: '#15803d' }}>{selectedCitizen.statusTinggal}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedCitizen(null)}
                style={{
                  background: '#3B7594',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
