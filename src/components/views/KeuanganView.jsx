import React, { useState } from 'react';
import { 
  Wallet, ArrowDownRight, ArrowUpRight, Plus, 
  Calendar, FileSpreadsheet, CheckCircle2, Clock, Filter,
  Eye, XCircle, Check, AlertCircle, X, ShieldCheck, CreditCard, ExternalLink, QrCode, Search, Zap
} from 'lucide-react';

export default function KeuanganView({ 
  transactions, 
  onAddTransaction, 
  activeSubMenu, 
  onSelectSubMenu,
  citizens,
  onToggleIuran,
  transferVerifications = [],
  onApproveTransfer,
  onRejectTransfer,
  currentUserRole = 'Bendahara'
}) {
  const [showAddTrx, setShowAddTrx] = useState(false);
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [selectedProof, setSelectedProof] = useState(null);
  const [rejectingTransfer, setRejectingTransfer] = useState(null);
  const [rejectTransferReason, setRejectTransferReason] = useState('');
  const [filterVerifikasi, setFilterVerifikasi] = useState('Semua');
  const [searchVerifikasi, setSearchVerifikasi] = useState('');
  const [trxForm, setTrxForm] = useState({
    kategori: 'Pemasukan',
    sumber: '',
    nominal: '',
    keterangan: '',
    petugas: 'Hj. Endang (Bendahara)'
  });

  const totalMasuk = transactions.filter(t => t.kategori === 'Pemasukan').reduce((a, b) => a + b.nominal, 0);
  const totalKeluar = transactions.filter(t => t.kategori === 'Pengeluaran').reduce((a, b) => a + b.nominal, 0);
  const saldo = 14520000 + totalMasuk - totalKeluar;

  const filteredTrx = transactions.filter(t => {
    if (filterKategori === 'Semua') return true;
    return t.kategori === filterKategori;
  });

  const handleSubmitTrx = (e) => {
    e.preventDefault();
    if (!trxForm.sumber || !trxForm.nominal) {
      alert('Sumber dan nominal wajib diisi!');
      return;
    }
    onAddTransaction({
      id: `TRX-${Date.now()}`,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      kategori: trxForm.kategori,
      sumber: trxForm.sumber,
      nominal: parseInt(trxForm.nominal, 10),
      keterangan: trxForm.keterangan || '-',
      petugas: trxForm.petugas
    });
    setShowAddTrx(false);
    setTrxForm({
      kategori: 'Pemasukan',
      sumber: '',
      nominal: '',
      keterangan: '',
      petugas: 'Hj. Endang (Bendahara)'
    });
  };

  return (
    <div className="keuangan-page">
      {/* Submenu Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onSelectSubMenu('keuangan', 'rekap')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeSubMenu === 'rekap' ? '#3B7594' : '#e2e8f0',
              color: activeSubMenu === 'rekap' ? '#ffffff' : '#334155',
              cursor: 'pointer'
            }}
          >
            Rekapitulasi Kas Masuk & Keluar
          </button>
          <button 
            onClick={() => onSelectSubMenu('keuangan', 'iuran')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeSubMenu === 'iuran' ? '#3B7594' : '#e2e8f0',
              color: activeSubMenu === 'iuran' ? '#ffffff' : '#334155',
              cursor: 'pointer'
            }}
          >
            Catatan Iuran Warga (Rp 60.000 / KK)
          </button>
          {currentUserRole === 'Bendahara' && (
            <button 
              onClick={() => onSelectSubMenu('keuangan', 'verifikasi')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                background: activeSubMenu === 'verifikasi' ? '#3B7594' : '#e2e8f0',
                color: activeSubMenu === 'verifikasi' ? '#ffffff' : '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Verifikasi Bukti Transfer Warga
              {transferVerifications.filter(v => v.status === 'Menunggu Verifikasi').length > 0 && (
                <span style={{
                  background: '#ea580c',
                  color: '#ffffff',
                  fontSize: '10px',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontWeight: 800
                }}>
                  {transferVerifications.filter(v => v.status === 'Menunggu Verifikasi').length} Baru
                </span>
              )}
            </button>
          )}
          <button 
            onClick={() => onSelectSubMenu('keuangan', 'laporan')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeSubMenu === 'laporan' ? '#3B7594' : '#e2e8f0',
              color: activeSubMenu === 'laporan' ? '#ffffff' : '#334155',
              cursor: 'pointer'
            }}
          >
            Laporan Keuangan & Audit
          </button>
        </div>

        <button 
          onClick={() => setShowAddTrx(true)}
          style={{
            background: '#3B7594',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(59, 117, 148, 0.3)'
          }}
        >
          <Plus size={18} /> Catat Transaksi Baru
        </button>
      </div>

      {/* Pill header matching wireframe Image 5 left */}
      <div className="section-pill-header section-pill-dark">
        <Wallet size={16} />
        <span>Detail Pembukuan Kas RT 007 / RW 030</span>
      </div>

      {/* Big Dark Section Card matching wireframe Image 5 left */}
      <div className="big-section-card big-card-dark" style={{ minHeight: '480px' }}>
        {/* Top Summary Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ background: '#262525', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Saldo Kas Saat Ini</span>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              Rp {saldo.toLocaleString('id-ID')}
            </div>
          </div>
          <div style={{ background: '#262525', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Pemasukan (Maret 2026)</span>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#4ade80', marginTop: '4px' }}>
              + Rp {totalMasuk.toLocaleString('id-ID')}
            </div>
          </div>
          <div style={{ background: '#262525', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Pengeluaran (Maret 2026)</span>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>
              - Rp {totalKeluar.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {activeSubMenu === 'iuran' ? (
          /* TAB CATATAN IURAN WARGA */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                Status Pembayaran Iuran Warga per KK (Rp 60.000 / Bulan)
              </h4>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                Rincian: Kebersihan Rp 25.000 + Keamanan Rp 35.000
              </span>
            </div>

            <div style={{ background: '#262525', borderRadius: '12px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#f1f5f9' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '12px 14px' }}>Kepala Keluarga / Rumah</th>
                    <th style={{ padding: '12px 14px' }}>Blok & Alamat</th>
                    <th style={{ padding: '12px 14px' }}>Tagihan Maret</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Aksi Pembayaran</th>
                  </tr>
                </thead>
                <tbody>
                  {citizens.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{c.nama}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.peranKeluarga}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>{c.alamat}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>Rp 60.000</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: c.statusIuran === 'Lunas' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: c.statusIuran === 'Lunas' ? '#4ade80' : '#f87171'
                        }}>
                          {c.statusIuran}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          onClick={() => onToggleIuran(c.id)}
                          style={{
                            background: c.statusIuran === 'Lunas' ? '#475569' : '#16a34a',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700
                          }}
                        >
                          {c.statusIuran === 'Lunas' ? 'Ubah ke Belum Lunas' : 'Tandai Lunas'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (activeSubMenu === 'verifikasi' && currentUserRole === 'Bendahara') ? (
          /* TAB VERIFIKASI BUKTI TRANSFER DARI WARGA */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Verifikasi Bukti Pembayaran Transfer Bank & QRIS Warga
                </h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '4px 0 0' }}>
                  Periksa struk transfer m-banking warga, cocokkan dengan mutasi rekening kas RT 007, lalu verifikasi untuk mencatat kas masuk otomatis
                </p>
              </div>

              {/* Status Filter & Search */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#262525', borderRadius: '8px', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Search size={15} color="#94a3b8" style={{ marginRight: '8px' }} />
                  <input 
                    type="text"
                    placeholder="Cari nama warga / ref..."
                    value={searchVerifikasi}
                    onChange={(e) => setSearchVerifikasi(e.target.value)}
                    style={{ background: 'none', border: 'none', color: '#fff', fontSize: '12.5px', outline: 'none', width: '160px' }}
                  />
                </div>

                <select
                  value={filterVerifikasi}
                  onChange={(e) => setFilterVerifikasi(e.target.value)}
                  style={{
                    background: '#262525',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '12.5px'
                  }}
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>
            </div>

            {/* KPI Ringkasan Verifikasi */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#262525', borderLeft: '4px solid #f59e0b', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Menunggu Verifikasi</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                  {transferVerifications.filter(v => v.status === 'Menunggu Verifikasi').length} Pembayaran
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  Total: Rp {transferVerifications.filter(v => v.status === 'Menunggu Verifikasi').reduce((a, b) => a + b.nominal, 0).toLocaleString('id-ID')}
                </div>
              </div>

              <div style={{ background: '#262525', borderLeft: '4px solid #10b981', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Terverifikasi (Masuk Kas)</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  {transferVerifications.filter(v => v.status === 'Terverifikasi').length} Pembayaran
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  Total: Rp {transferVerifications.filter(v => v.status === 'Terverifikasi').reduce((a, b) => a + b.nominal, 0).toLocaleString('id-ID')}
                </div>
              </div>

              <div style={{ background: '#262525', borderLeft: '4px solid #ef4444', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Ditolak / Belum Valid</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>
                  {transferVerifications.filter(v => v.status === 'Ditolak').length} Pembayaran
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  Memerlukan klarifikasi warga
                </div>
              </div>
            </div>

            {/* Tabel Data Verifikasi Transfer */}
            <div style={{ background: '#262525', borderRadius: '12px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#f1f5f9' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '12px 14px' }}>ID / Waktu Transfer</th>
                    <th style={{ padding: '12px 14px' }}>Warga Pembayar</th>
                    <th style={{ padding: '12px 14px' }}>Periode Tagihan</th>
                    <th style={{ padding: '12px 14px' }}>Nominal (Rp)</th>
                    <th style={{ padding: '12px 14px' }}>Metode & Tujuan</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Bukti Transfer</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Aksi Bendahara</th>
                  </tr>
                </thead>
                <tbody>
                  {transferVerifications
                    .filter(v => {
                      if (filterVerifikasi !== 'Semua' && v.status !== filterVerifikasi) return false;
                      if (!searchVerifikasi) return true;
                      return (
                        v.namaWarga.toLowerCase().includes(searchVerifikasi.toLowerCase()) ||
                        v.noReferensi.toLowerCase().includes(searchVerifikasi.toLowerCase()) ||
                        v.id.toLowerCase().includes(searchVerifikasi.toLowerCase())
                      );
                    })
                    .map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>{item.id}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.tanggalTransfer}</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>Ref: {item.noReferensi}</div>
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#ffffff' }}>{item.namaWarga}</div>
                          <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Blok {item.blok} No. {item.noRumah}</div>
                        </td>

                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                          {item.periode}
                        </td>

                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#4ade80' }}>
                          Rp {item.nominal.toLocaleString('id-ID')}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600 }}>{item.metode}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.rekeningTujuan}</div>
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          {item.metode?.includes('Gateway') || item.catatanBendahara?.includes('Webhook') ? (
                            <span style={{
                              background: 'rgba(2, 132, 199, 0.2)',
                              color: '#38bdf8',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Zap size={12} fill="#38bdf8" /> Gateway Auto
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedProof(item)}
                              style={{
                                background: '#0284c7',
                                color: '#ffffff',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={13} /> Lihat Bukti
                            </button>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {item.metode?.includes('Gateway') || item.catatanBendahara?.includes('Webhook') ? (
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              background: 'rgba(56, 189, 248, 0.2)',
                              color: '#38bdf8',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Zap size={11} fill="#38bdf8" /> Terverifikasi Gateway
                            </span>
                          ) : (
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: item.status === 'Menunggu Verifikasi' ? 'rgba(245, 158, 11, 0.2)' : item.status === 'Terverifikasi' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: item.status === 'Menunggu Verifikasi' ? '#fbbf24' : item.status === 'Terverifikasi' ? '#4ade80' : '#f87171'
                            }}>
                              {item.status}
                            </span>
                          )}
                          {item.catatanBendahara && (
                            <div style={{ fontSize: '10.5px', color: '#cbd5e1', marginTop: '4px', maxWidth: '160px' }}>
                              Note: {item.catatanBendahara}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          {item.metode?.includes('Gateway') || item.catatanBendahara?.includes('Webhook') ? (
                            <span style={{ fontSize: '11.5px', color: '#4ade80', fontWeight: 700 }}>
                              ✓ Auto Settlement (Kas)
                            </span>
                          ) : item.status === 'Menunggu Verifikasi' ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <button
                                onClick={() => {
                                  if (onApproveTransfer) {
                                    onApproveTransfer(item.id);
                                    alert(`Pembayaran atas nama ${item.namaWarga} berhasil diverifikasi dan dicatat ke kas masuk RT 007!`);
                                  }
                                }}
                                title="Terima & Masukkan Kas"
                                style={{
                                  background: '#16a34a',
                                  color: '#ffffff',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                <Check size={13} /> Terima
                              </button>

                              <button
                                onClick={() => {
                                  setRejectingTransfer(item);
                                  setRejectTransferReason('');
                                }}
                                title="Tolak Bukti Transfer"
                                style={{
                                  background: '#dc2626',
                                  color: '#ffffff',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                <X size={13} /> Tolak
                              </button>
                            </div>
                          ) : item.status === 'Terverifikasi' ? (
                            <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>
                              ✓ Kas Tercatat
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 700 }}>
                              ✕ Ditolak
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* TAB REKAPITULASI KAS & LAPORAN */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Filter size={16} color="#94a3b8" />
                <select 
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  style={{
                    background: '#262525',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '13px'
                  }}
                >
                  <option value="Semua">Semua Kategori (Pemasukan & Pengeluaran)</option>
                  <option value="Pemasukan">Khusus Pemasukan</option>
                  <option value="Pengeluaran">Khusus Pengeluaran</option>
                </select>
              </div>

              <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>
                Total {filteredTrx.length} catatan transaksi
              </span>
            </div>

            <div style={{ background: '#262525', borderRadius: '12px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#f1f5f9' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '12px 14px' }}>No. Transaksi / Tgl</th>
                    <th style={{ padding: '12px 14px' }}>Kategori</th>
                    <th style={{ padding: '12px 14px' }}>Sumber / Penerima</th>
                    <th style={{ padding: '12px 14px' }}>Keterangan Keperluan</th>
                    <th style={{ padding: '12px 14px' }}>Nominal (Rp)</th>
                    <th style={{ padding: '12px 14px' }}>Petugas Bendahara</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrx.map((trx) => (
                    <tr key={trx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{trx.id}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{trx.tanggal}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
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
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{trx.sumber}</td>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{trx.keterangan}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: trx.kategori === 'Pemasukan' ? '#4ade80' : '#fca5a5' }}>
                        {trx.kategori === 'Pemasukan' ? '+' : '-'} Rp {trx.nominal.toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{trx.petugas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Catat Transaksi Baru */}
      {showAddTrx && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '520px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
              Catat Transaksi Kas RT 007 Baru
            </h3>
            <form onSubmit={handleSubmitTrx}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Jenis Mutasi Kas
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setTrxForm({ ...trxForm, kategori: 'Pemasukan' })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      background: trxForm.kategori === 'Pemasukan' ? '#16a34a' : '#f1f5f9',
                      color: trxForm.kategori === 'Pemasukan' ? '#fff' : '#334155'
                    }}
                  >
                    Pemasukan Kas
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setTrxForm({ ...trxForm, kategori: 'Pengeluaran' })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      background: trxForm.kategori === 'Pengeluaran' ? '#dc2626' : '#f1f5f9',
                      color: trxForm.kategori === 'Pengeluaran' ? '#fff' : '#334155'
                    }}
                  >
                    Pengeluaran Kas
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Sumber / Pos Pengeluaran *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Misal: Iuran Warga Blok C atau Pembelian Lampu Jalan"
                  value={trxForm.sumber}
                  onChange={(e) => setTrxForm({ ...trxForm, sumber: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Nominal (Rp) *
                </label>
                <input 
                  type="number" 
                  required
                  placeholder="Contoh: 500000"
                  value={trxForm.nominal}
                  onChange={(e) => setTrxForm({ ...trxForm, nominal: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Keterangan Tambahan
                </label>
                <textarea 
                  rows={3}
                  placeholder="Catatan detail bukti atau peruntukan kas..."
                  value={trxForm.keterangan}
                  onChange={(e) => setTrxForm({ ...trxForm, keterangan: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setShowAddTrx(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', background: '#3B7594', color: '#fff', fontWeight: 700 }}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 1: Pratinjau Bukti Transfer Digital Warga (Struk M-Banking Mockup) */}
      {selectedProof && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '440px', padding: '0', overflow: 'hidden' }}>
            {/* Header Struk M-Banking */}
            <div style={{
              background: selectedProof.metode.includes('Mandiri') 
                ? 'linear-gradient(135deg, #003d79 0%, #022347 100%)' 
                : selectedProof.metode.includes('BCA')
                  ? 'linear-gradient(135deg, #005696 0%, #003366 100%)'
                  : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              padding: '20px 24px',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
                  Bukti Pembayaran Elektronik
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0 0' }}>
                  {selectedProof.metode}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProof(null)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Body Struk */}
            <div style={{ padding: '24px', background: '#ffffff', color: '#1e293b' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#15803d' }}>
                  TRANSFER DANA BERHASIL
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                  Rp {selectedProof.nominal.toLocaleString('id-ID')}
                </div>
                <span style={{
                  display: 'inline-block',
                  background: '#f1f5f9',
                  color: '#475569',
                  fontSize: '11.5px',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  marginTop: '6px',
                  fontFamily: 'monospace'
                }}>
                  Ref: {selectedProof.noReferensi}
                </span>
              </div>

              {/* Rincian Transaksi */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Waktu Transaksi</span>
                  <span style={{ fontWeight: 700 }}>{selectedProof.tanggalTransfer}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Pengirim (Warga)</span>
                  <span style={{ fontWeight: 700 }}>{selectedProof.namaWarga} (Blok {selectedProof.blok}/{selectedProof.noRumah})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Tujuan Transfer</span>
                  <span style={{ fontWeight: 700, textAlign: 'right', maxWidth: '200px' }}>{selectedProof.rekeningTujuan}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Periode Tagihan</span>
                  <span style={{ fontWeight: 800, color: '#0284c7' }}>{selectedProof.periode}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Catatan Warga</span>
                  <span style={{ fontWeight: 600, fontStyle: 'italic' }}>"{selectedProof.catatanWarga}"</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ color: '#64748b' }}>Status Verifikasi</span>
                  <strong style={{
                    color: selectedProof.status === 'Terverifikasi' ? '#15803d' : selectedProof.status === 'Ditolak' ? '#dc2626' : '#d97706'
                  }}>
                    {selectedProof.status}
                  </strong>
                </div>
              </div>

              {selectedProof.catatanBendahara && (
                <div style={{ marginTop: '12px', background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', fontSize: '12px' }}>
                  <strong style={{ color: '#991b1b' }}>Catatan Bendahara:</strong>
                  <div style={{ color: '#b91c1c', marginTop: '2px' }}>{selectedProof.catatanBendahara}</div>
                </div>
              )}

              {/* Action Buttons for Bendahara */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {selectedProof.status === 'Menunggu Verifikasi' && (
                  <>
                    <button
                      onClick={() => {
                        setRejectingTransfer(selectedProof);
                        setRejectTransferReason('');
                        setSelectedProof(null);
                      }}
                      style={{
                        flex: 1,
                        background: '#dc2626',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <X size={15} /> Tolak Bukti
                    </button>

                    <button
                      onClick={() => {
                        if (onApproveTransfer) {
                          onApproveTransfer(selectedProof.id);
                        }
                        setSelectedProof(null);
                        alert(`Bukti transfer ${selectedProof.namaWarga} diverifikasi! Iuran ditandai lunas dan tercatat di kas RT.`);
                      }}
                      style={{
                        flex: 1.3,
                        background: '#16a34a',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Check size={15} /> Terima & Masukkan Kas
                    </button>
                  </>
                )}

                {selectedProof.status !== 'Menunggu Verifikasi' && (
                  <button
                    onClick={() => setSelectedProof(null)}
                    style={{
                      width: '100%',
                      background: '#3B7594',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Tutup Pratinjau
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Dialog Tolak Bukti Pembayaran Transfer */}
      {rejectingTransfer && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #fee2e2', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={20} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#991b1b' }}>
                  Tolak Bukti Transfer Warga
                </h3>
              </div>
              <button 
                onClick={() => setRejectingTransfer(null)}
                style={{ padding: '6px', borderRadius: '6px', background: '#f1f5f9', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0', fontSize: '12.5px' }}>
              <div><strong>Warga:</strong> {rejectingTransfer.namaWarga} (Blok {rejectingTransfer.blok} No. {rejectingTransfer.noRumah})</div>
              <div style={{ marginTop: '2px' }}><strong>Tagihan:</strong> {rejectingTransfer.periode} — Rp {rejectingTransfer.nominal.toLocaleString('id-ID')}</div>
              <div style={{ marginTop: '2px', color: '#64748b' }}>Ref: {rejectingTransfer.noReferensi}</div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Pilih Alasan Penolakan (Template Cepat):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {[
                  'Nominal transfer tidak sesuai tagihan iuran',
                  'Dana belum masuk ke mutasi kas rekening RT 007',
                  'Nomor rekening tujuan kas RT salah / tidak sesuai',
                  'Tangkapan layar struk buram, palsu, atau tidak terbaca'
                ].map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRejectTransferReason(tpl)}
                    style={{
                      background: rejectTransferReason === tpl ? '#fee2e2' : '#f1f5f9',
                      color: rejectTransferReason === tpl ? '#991b1b' : '#475569',
                      border: `1px solid ${rejectTransferReason === tpl ? '#fca5a5' : '#cbd5e1'}`,
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    • {tpl}
                  </button>
                ))}
              </div>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Catatan Penolakan (Akan muncul di portal warga) *
              </label>
              <textarea
                rows={3}
                value={rejectTransferReason}
                onChange={(e) => setRejectTransferReason(e.target.value)}
                placeholder="Tuliskan alasan penolakan secara jelas..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectingTransfer(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!rejectTransferReason.trim()) {
                    alert('Mohon tuliskan alasan penolakan transfer!');
                    return;
                  }
                  if (onRejectTransfer) {
                    onRejectTransfer(rejectingTransfer.id, rejectTransferReason);
                  }
                  setRejectingTransfer(null);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <XCircle size={15} /> Konfirmasi Tolak Bukti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
