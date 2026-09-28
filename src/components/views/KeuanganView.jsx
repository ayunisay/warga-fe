import React, { useState } from 'react';
import { 
  Wallet, ArrowDownRight, ArrowUpRight, Plus, 
  Calendar, FileSpreadsheet, CheckCircle2, Clock, Filter 
} from 'lucide-react';

export default function KeuanganView({ 
  transactions, 
  onAddTransaction, 
  activeSubMenu, 
  onSelectSubMenu,
  citizens,
  onToggleIuran 
}) {
  const [showAddTrx, setShowAddTrx] = useState(false);
  const [filterKategori, setFilterKategori] = useState('Semua');
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onSelectSubMenu('keuangan', 'rekap')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeSubMenu === 'rekap' ? '#3B7594' : '#e2e8f0',
              color: activeSubMenu === 'rekap' ? '#ffffff' : '#334155'
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
              color: activeSubMenu === 'iuran' ? '#ffffff' : '#334155'
            }}
          >
            Catatan Iuran Warga (Rp 60.000 / KK)
          </button>
          <button 
            onClick={() => onSelectSubMenu('keuangan', 'laporan')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeSubMenu === 'laporan' ? '#3B7594' : '#e2e8f0',
              color: activeSubMenu === 'laporan' ? '#ffffff' : '#334155'
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
    </div>
  );
}
