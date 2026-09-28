import React from 'react';
import { 
  Users, Home, Wallet, FileText, TrendingUp, AlertCircle, 
  ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, Printer,
  ChevronRight, Building2, ShieldAlert
} from 'lucide-react';
import { DEMOGRAFI_DATA } from '../../data/mockData';

export default function DashboardView({ 
  citizens, 
  suratList, 
  transactions, 
  onNavigate, 
  onOpenSuratModal,
  onApproveSurat 
}) {
  const pendingSurat = suratList.filter(s => s.status === 'Menunggu Verifikasi');
  const totalKasMasuk = transactions.filter(t => t.kategori === 'Pemasukan').reduce((acc, curr) => acc + curr.nominal, 0);
  const totalKasKeluar = transactions.filter(t => t.kategori === 'Pengeluaran').reduce((acc, curr) => acc + curr.nominal, 0);
  const saldoKas = 14520000 + totalKasMasuk - totalKasKeluar;

  return (
    <div className="dashboard-content">
      {/* 4 Yellow Cards (2x2 Grid, exactly matches wireframe Images 1 & 3) */}
      <div className="yellow-cards-grid-4">
        {/* Card 1: Data Warga */}
        <div 
          className="yellow-card" 
          onClick={() => onNavigate('warga', 'master')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-top-row">
            <span className="card-label">Total Warga Terdaftar</span>
            <div className="card-icon-pill">
              <Users size={22} color="#1c1401" />
            </div>
          </div>
          <div>
            <div className="card-value">{DEMOGRAFI_DATA.totalWarga} <span style={{ fontSize: '18px', fontWeight: 600 }}>Jiwa</span></div>
            <div className="card-subtext" style={{ display: 'flex', gap: '12px' }}>
              <span>👨 <strong>{DEMOGRAFI_DATA.pria}</strong> Pria</span>
              <span>•</span>
              <span>👩 <strong>{DEMOGRAFI_DATA.wanita}</strong> Wanita</span>
              <span>•</span>
              <span style={{ color: '#166534', fontWeight: 700 }}>+3 bulan ini</span>
            </div>
          </div>
        </div>

        {/* Card 2: Kepala Keluarga */}
        <div 
          className="yellow-card" 
          onClick={() => onNavigate('warga', 'master')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-top-row">
            <span className="card-label">Kepala Keluarga (KK)</span>
            <div className="card-icon-pill">
              <Home size={22} color="#1c1401" />
            </div>
          </div>
          <div>
            <div className="card-value">{DEMOGRAFI_DATA.totalKK} <span style={{ fontSize: '18px', fontWeight: 600 }}>KK</span></div>
            <div className="card-subtext" style={{ display: 'flex', gap: '12px' }}>
              <span>🏠 138 KK Warga Tetap</span>
              <span>•</span>
              <span>🏢 4 Domisili Kontrak</span>
            </div>
          </div>
        </div>

        {/* Card 3: Keuangan Kas RT */}
        <div 
          className="yellow-card" 
          onClick={() => onNavigate('keuangan', 'rekap')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-top-row">
            <span className="card-label">Kas RT & Saldo Berjalan</span>
            <div className="card-icon-pill">
              <Wallet size={22} color="#1c1401" />
            </div>
          </div>
          <div>
            <div className="card-value">Rp {saldoKas.toLocaleString('id-ID')}</div>
            <div className="card-subtext" style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#166534', fontWeight: 700 }}>↑ 94% Iuran Lunas</span>
              <span>•</span>
              <span>Iuran Warga: Rp 60.000 / KK / Bln</span>
            </div>
          </div>
        </div>

        {/* Card 4: Permohonan Surat */}
        <div 
          className="yellow-card" 
          onClick={() => onNavigate('surat', 'masuk')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-top-row">
            <span className="card-label">Permohonan Surat Aktif</span>
            <div className="card-icon-pill" style={{ background: pendingSurat.length > 0 ? '#ffedd5' : 'rgba(255,255,255,0.5)' }}>
              <FileText size={22} color={pendingSurat.length > 0 ? '#c2410c' : '#1c1401'} />
            </div>
          </div>
          <div>
            <div className="card-value">
              {suratList.length} <span style={{ fontSize: '18px', fontWeight: 600 }}>Berkas</span>
            </div>
            <div className="card-subtext" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ 
                background: '#ea580c', 
                color: '#fff', 
                padding: '2px 8px', 
                borderRadius: '6px', 
                fontWeight: 700, 
                fontSize: '11px' 
              }}>
                {pendingSurat.length} Perlu Verifikasi
              </span>
              <span>•</span>
              <span>6 Surat Selesai Diterbitkan</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: YELLOW BIG CARD (Demografi & Distribusi Penduduk) */}
      <div style={{ marginTop: '12px' }}>
        <div className="section-pill-header section-pill-yellow">
          <Users size={16} />
          <span>Demografi & Distribusi Penduduk RT 007 / RW 030</span>
        </div>

        <div className="big-section-card big-card-yellow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e1602' }}>
                Komposisi Penduduk & Blok Hunian
              </h3>
              <p style={{ fontSize: '13px', color: '#523f05', marginTop: '2px' }}>
                Monitoring sebaran kelompok umur dan pemetaan per blok di lingkungan Teluk Pucung
              </p>
            </div>
            <button 
              onClick={() => onNavigate('warga', 'master')}
              style={{
                background: '#2c1e02',
                color: '#fef08a',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Lihat Detail Kependudukan <ChevronRight size={16} />
            </button>
          </div>

          {/* Grid Metrics Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Kelompok Umur */}
            <div style={{ background: 'rgba(255, 255, 255, 0.45)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#654e0b', marginBottom: '8px' }}>
                Kategori Umur Warga
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                    <span>Balita & Anak (&lt;17 thn)</span>
                    <span>{DEMOGRAFI_DATA.balita} ({Math.round(DEMOGRAFI_DATA.balita/DEMOGRAFI_DATA.totalWarga*100)}%)</span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '3px' }}>
                    <div style={{ width: `${(DEMOGRAFI_DATA.balita/DEMOGRAFI_DATA.totalWarga)*100}%`, height: '100%', background: '#d97706' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                    <span>Usia Produktif (18-59 thn)</span>
                    <span>{DEMOGRAFI_DATA.usiaProduktif} ({Math.round(DEMOGRAFI_DATA.usiaProduktif/DEMOGRAFI_DATA.totalWarga*100)}%)</span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '3px' }}>
                    <div style={{ width: `${(DEMOGRAFI_DATA.usiaProduktif/DEMOGRAFI_DATA.totalWarga)*100}%`, height: '100%', background: '#16a34a' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                    <span>Lansia (≥60 thn)</span>
                    <span>{DEMOGRAFI_DATA.lansia} ({Math.round(DEMOGRAFI_DATA.lansia/DEMOGRAFI_DATA.totalWarga*100)}%)</span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '3px' }}>
                    <div style={{ width: `${(DEMOGRAFI_DATA.lansia/DEMOGRAFI_DATA.totalWarga)*100}%`, height: '100%', background: '#b45309' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sebaran Blok Rumah */}
            <div style={{ background: 'rgba(255, 255, 255, 0.45)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#654e0b', marginBottom: '8px' }}>
                Sebaran Warga per Blok
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#654e0b', fontWeight: 600 }}>Blok A (Jl. Melati)</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{DEMOGRAFI_DATA.blokA} <span style={{ fontSize: '11px' }}>Jiwa</span></div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#654e0b', fontWeight: 600 }}>Blok B (Jl. Mawar)</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{DEMOGRAFI_DATA.blokB} <span style={{ fontSize: '11px' }}>Jiwa</span></div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#654e0b', fontWeight: 600 }}>Blok C (Jl. Cempaka)</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{DEMOGRAFI_DATA.blokC} <span style={{ fontSize: '11px' }}>Jiwa</span></div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '8px 12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#654e0b', fontWeight: 600 }}>Blok D (Jl. Anggrek)</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{DEMOGRAFI_DATA.blokD} <span style={{ fontSize: '11px' }}>Jiwa</span></div>
                </div>
              </div>
            </div>

            {/* Status Tinggal */}
            <div style={{ background: 'rgba(255, 255, 255, 0.45)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#654e0b', marginBottom: '8px' }}>
                  Status Domisili
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1401' }}>
                  Warga Tetap: 448 Jiwa (92%)
                </div>
                <div style={{ fontSize: '13px', color: '#523f05', marginTop: '4px' }}>
                  Kontrak / Sementara: {DEMOGRAFI_DATA.wargaSementara} Jiwa (8%)
                </div>
              </div>
              <div style={{ fontSize: '11.5px', background: 'rgba(255,255,255,0.6)', padding: '8px 10px', borderRadius: '8px', marginTop: '8px', color: '#453202' }}>
                💡 Data kependudukan terintegrasi dengan Kelurahan Teluk Pucung.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DARK GRAY BIG CARD (Keuangan & Arus Kas RT) */}
      <div style={{ marginTop: '12px' }}>
        <div className="section-pill-header section-pill-dark">
          <Wallet size={16} />
          <span>Rekapitulasi Kas & Iuran Warga (Periode Maret 2026)</span>
        </div>

        <div className="big-section-card big-card-dark">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                Arus Kas Masuk, Pengeluaran & Transaksi Terkini
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>
                Transparansi pengelolaan kas RT 007 untuk operasional satpam, sampah & fasilitas umum
              </p>
            </div>
            <button 
              onClick={() => onNavigate('keuangan', 'rekap')}
              style={{
                background: '#ffffff',
                color: '#1e293b',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Buka Rekap Keuangan <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '22px' }}>
            <div style={{ background: '#272626', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '13px', fontWeight: 600 }}>
                <ArrowDownRight size={16} /> Total Pemasukan Bulan Ini
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px' }}>
                Rp {totalKasMasuk.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Iuran warga & infaq sukarela</div>
            </div>

            <div style={{ background: '#272626', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '13px', fontWeight: 600 }}>
                <ArrowUpRight size={16} /> Total Pengeluaran Operasional
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px' }}>
                Rp {totalKasKeluar.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Gaji satpam, sampah, & lampu jalan</div>
            </div>

            <div style={{ background: '#272626', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '13px', fontWeight: 600 }}>
                <Wallet size={16} /> Total Saldo Kas Tersedia
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px' }}>
                Rp {saldoKas.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Disimpan di rekening Kas RT 007</div>
            </div>
          </div>

          {/* Table Transaksi Terkini */}
          <div style={{ background: '#2b2a2a', borderRadius: '14px', padding: '16px', overflowX: 'auto' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', textTransform: 'uppercase' }}>
              4 Mutasi Kas Terakhir
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#f1f5f9' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                  <th style={{ padding: '8px 10px' }}>Tanggal</th>
                  <th style={{ padding: '8px 10px' }}>Kategori</th>
                  <th style={{ padding: '8px 10px' }}>Keterangan & Sumber</th>
                  <th style={{ padding: '8px 10px' }}>Nominal</th>
                  <th style={{ padding: '8px 10px' }}>Petugas</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 4).map((trx) => (
                  <tr key={trx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{trx.tanggal}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: trx.kategori === 'Pemasukan' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: trx.kategori === 'Pemasukan' ? '#4ade80' : '#f87171'
                      }}>
                        {trx.kategori}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 600 }}>{trx.sumber}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{trx.keterangan}</div>
                    </td>
                    <td style={{ padding: '10px', fontWeight: 700, color: trx.kategori === 'Pemasukan' ? '#4ade80' : '#fca5a5' }}>
                      {trx.kategori === 'Pemasukan' ? '+' : '-'} Rp {trx.nominal.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '10px', color: '#cbd5e1', fontSize: '12px' }}>{trx.petugas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 3: RED BIG CARD (Permohonan Surat Masuk & Tindakan Mendesak) */}
      <div style={{ marginTop: '12px' }}>
        <div className="section-pill-header section-pill-red">
          <ShieldAlert size={16} />
          <span>Perlu Tindakan & Permohonan Surat Masuk Terkini</span>
        </div>

        <div className="big-section-card big-card-red">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                Verifikasi Surat & Pengumuman Penting RT
              </h3>
              <p style={{ fontSize: '13px', color: '#fee2e2', marginTop: '2px' }}>
                Ada {pendingSurat.length} surat pengantar warga yang menunggu tanda tangan dan persetujuan Ketua RT
              </p>
            </div>
            <button 
              onClick={() => onNavigate('surat', 'masuk')}
              style={{
                background: '#ffffff',
                color: '#dc2626',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Lihat Semua Permohonan ({suratList.length}) <ChevronRight size={16} />
            </button>
          </div>

          {/* Cards of Urgent Letters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {suratList.slice(0, 2).map((srt) => (
              <div 
                key={srt.id} 
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      background: srt.status === 'Menunggu Verifikasi' ? '#fef08a' : '#bbf7d0',
                      color: srt.status === 'Menunggu Verifikasi' ? '#854d0e' : '#166534',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {srt.status}
                    </span>
                    <span style={{ fontSize: '11px', color: '#fee2e2' }}>{srt.tanggalPengajuan}</span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                    {srt.jenisSurat}
                  </h4>
                  <div style={{ fontSize: '13px', color: '#fef2f2', fontWeight: 600 }}>
                    👤 {srt.pemohon} ({srt.alamat})
                  </div>
                  <p style={{ fontSize: '12px', color: '#fecaca', marginTop: '6px', lineHeight: 1.4 }}>
                    Keperluan: {srt.tujuan}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button 
                    onClick={() => onOpenSuratModal(srt)}
                    style={{
                      flex: 1,
                      background: '#ffffff',
                      color: '#b91c1c',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Printer size={15} /> Pratinjau Surat
                  </button>
                  {srt.status === 'Menunggu Verifikasi' && (
                    <button 
                      onClick={() => onApproveSurat(srt.id)}
                      style={{
                        background: '#15803d',
                        color: '#ffffff',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Setujui dan beri stempel RT"
                    >
                      <CheckCircle2 size={15} /> Setujui
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Announcement / Alert Note */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '14px',
              padding: '16px 18px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fef08a', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  📢 Agenda Kerja Bakti & Posyandu
                </div>
                <p style={{ fontSize: '12.5px', color: '#fef2f2', lineHeight: 1.5 }}>
                  Kerja bakti pembersihan saluran air drainase menghadapi musim hujan akan dilaksanakan pada hari Minggu pagi, 29 Maret 2026 di Lapangan RT 007.
                </p>
              </div>
              <div style={{ fontSize: '11px', color: '#fecaca', marginTop: '10px' }}>
                Koordinator: Sie Keamanan & Lingkungan Hidup
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
