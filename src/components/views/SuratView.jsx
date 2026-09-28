import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Clock, Printer, Plus, 
  Search, Eye, ShieldCheck, AlertCircle, XCircle, X
} from 'lucide-react';

export default function SuratView({ 
  suratList, 
  activeSubMenu, 
  onSelectSubMenu, 
  onOpenSuratModal,
  onApproveSurat,
  onRejectSurat,
  onAddSurat,
  currentUserRole = 'Ketua RT'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSuratModal, setShowAddSuratModal] = useState(false);
  const [rejectingSurat, setRejectingSurat] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [formData, setFormData] = useState({
    jenisSurat: 'Surat Pengantar SKCK (Catatan Kepolisian)',
    pemohon: '',
    nik: '',
    alamat: 'Jl. Melati Blok A1 No. 01',
    tujuan: '',
    urgensi: 'Biasa'
  });

  const isBendahara = currentUserRole === 'Bendahara';
  const canPengajuanSurat = !isBendahara;

  const filteredSurat = suratList.filter(s => {
    if (activeSubMenu === 'masuk' && s.status !== 'Menunggu Verifikasi') {
      return true; // show all or filter if user selects
    }
    if (activeSubMenu === 'arsip' && s.status !== 'Selesai') {
      return false;
    }
    return (
      s.jenisSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pemohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.noSurat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateSurat = (e) => {
    e.preventDefault();
    if (!canPengajuanSurat) {
      alert('Akses Ditolak: Bendahara tidak memiliki akses untuk pengajuan surat.');
      return;
    }
    if (!formData.pemohon || !formData.nik || !formData.tujuan) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    const newSurat = {
      id: `SRT-2026-${String(suratList.length + 1).padStart(3, '0')}`,
      noSurat: `0${50 + suratList.length}/RT.007-RW.030/TP/III/2026`,
      jenisSurat: formData.jenisSurat,
      pemohon: formData.pemohon,
      nik: formData.nik,
      alamat: formData.alamat,
      tujuan: formData.tujuan,
      tanggalPengajuan: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Menunggu Verifikasi',
      urgensi: formData.urgensi,
      catatan: 'Permohonan surat baru saja diajukan.'
    };

    onAddSurat(newSurat);
    setShowAddSuratModal(false);
    setFormData({
      jenisSurat: 'Surat Pengantar SKCK (Catatan Kepolisian)',
      pemohon: '',
      nik: '',
      alamat: 'Jl. Melati Blok A1 No. 01',
      tujuan: '',
      urgensi: 'Biasa'
    });
  };

  if (currentUserRole === 'Bendahara') {
    return null;
  }

  return (
    <div className="surat-page">
      {/* Submenu Tabs & Action Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onSelectSubMenu('surat', 'masuk')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeSubMenu === 'masuk' ? '#3B7594' : '#e2e8f0',
              color: activeSubMenu === 'masuk' ? '#ffffff' : '#334155'
            }}
          >
            Permohonan Surat Masuk & Verifikasi ({suratList.filter(s => s.status === 'Menunggu Verifikasi').length})
          </button>
          <button 
            onClick={() => onSelectSubMenu('surat', 'buat')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeSubMenu === 'buat' ? '#3B7594' : '#e2e8f0',
              color: activeSubMenu === 'buat' ? '#ffffff' : '#334155'
            }}
          >
            Pembuatan & Cetak PDF Otomatis
          </button>
          <button 
            onClick={() => onSelectSubMenu('surat', 'arsip')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeSubMenu === 'arsip' ? '#3B7594' : '#e2e8f0',
              color: activeSubMenu === 'arsip' ? '#ffffff' : '#334155'
            }}
          >
            Arsip / Riwayat Surat Keluar
          </button>
        </div>

        {/* Tombol Buat Surat */}
        {canPengajuanSurat && (
          <button 
            onClick={() => setShowAddSuratModal(true)}
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
            <Plus size={18} /> Buat Permohonan Surat Baru
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '14px 20px',
        border: '1px solid #e2e8f0',
        marginBottom: '22px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Search size={18} color="#94a3b8" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan nomor surat, jenis surat, atau nama pemohon..."
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '13.5px' }}
        />
      </div>

      {/* 8 WIDE ROUNDED CARDS (Stacked Vertically, EXACTLY MATCHES Image 5 right!) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {filteredSurat.map((srt) => (
          <div 
            key={srt.id}
            style={{
              background: '#373636',
              borderRadius: '18px',
              padding: '22px 26px',
              color: '#f8fafc',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: srt.status === 'Menunggu Verifikasi' 
                      ? '#f59e0b' 
                      : srt.status === 'Disetujui' 
                        ? '#10b981' 
                        : srt.status === 'Ditolak'
                          ? '#ef4444'
                          : '#64748b',
                    color: '#ffffff'
                  }}>
                    {srt.status}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    No: {srt.noSurat}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#cbd5e1' }}>
                    • Diajukan: {srt.tanggalPengajuan}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                  {srt.jenisSurat}
                </h3>

                <div style={{ fontSize: '13.5px', color: '#e2e8f0', marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                  <span>👤 <strong>Pemohon:</strong> {srt.pemohon}</span>
                  <span>📄 <strong>NIK:</strong> {srt.nik}</span>
                  <span>🏠 <strong>Alamat:</strong> {srt.alamat}</span>
                </div>

                <div style={{ fontSize: '12.5px', color: '#cbd5e1', marginTop: '6px', background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '8px' }}>
                  <strong>Keperluan / Maksud:</strong> {srt.tujuan}
                </div>

                {srt.status === 'Ditolak' && (
                  <div style={{
                    fontSize: '12.5px',
                    color: '#fca5a5',
                    marginTop: '8px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} color="#f87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: '#fca5a5' }}>Alasan Penolakan dari Pengurus:</strong>
                      <div style={{ marginTop: '2px', color: '#fee2e2' }}>
                        {srt.catatanPenolakan || 'Permohonan surat belum memenuhi persyaratan administratif RT 007.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => onOpenSuratModal(srt)}
                  style={{
                    background: '#3B7594',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={15} /> Cetak & Pratinjau
                </button>

                {canPengajuanSurat && srt.status === 'Menunggu Verifikasi' && (
                  <>
                    <button 
                      onClick={() => onApproveSurat(srt.id)}
                      style={{
                        background: '#16a34a',
                        color: '#ffffff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <CheckCircle2 size={15} /> Setujui
                    </button>

                    <button 
                      onClick={() => {
                        setRejectingSurat(srt);
                        setRejectReason('');
                      }}
                      style={{
                        background: '#dc2626',
                        color: '#ffffff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <XCircle size={15} /> Tolak
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Permohonan Surat */}
      {showAddSuratModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '580px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
              Ajukan Permohonan Surat Pengantar Baru
            </h3>
            <form onSubmit={handleCreateSurat}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Jenis Surat Pengantar *
                </label>
                <select 
                  value={formData.jenisSurat}
                  onChange={(e) => setFormData({ ...formData, jenisSurat: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Surat Pengantar SKCK (Catatan Kepolisian)">Surat Pengantar SKCK (Catatan Kepolisian)</option>
                  <option value="Surat Keterangan Domisili Tempat Tinggal">Surat Keterangan Domisili Tempat Tinggal</option>
                  <option value="Surat Pengantar Pembuatan KTP Baru">Surat Pengantar Pembuatan KTP Baru</option>
                  <option value="Surat Keterangan Usaha (SKU - UMKM)">Surat Keterangan Usaha (SKU - UMKM)</option>
                  <option value="Surat Pengantar Pengurusan Nikah (N1-N4)">Surat Pengantar Pengurusan Nikah (N1-N4)</option>
                  <option value="Surat Keterangan Kematian">Surat Keterangan Kematian</option>
                  <option value="Surat Pengantar Pindah Domisili Keluar">Surat Pengantar Pindah Domisili Keluar</option>
                  <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Nama Lengkap Pemohon *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nama warga..."
                    value={formData.pemohon}
                    onChange={(e) => setFormData({ ...formData, pemohon: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    NIK Pemohon *
                  </label>
                  <input 
                    type="text" 
                    required
                    maxLength={16}
                    placeholder="327501..."
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Alamat Lengkap di RT 007
                </label>
                <input 
                  type="text" 
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Tujuan / Keperluan Surat *
                </label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Misal: Persyaratan pengurusan visa / perpanjangan KTP..."
                  value={formData.tujuan}
                  onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setShowAddSuratModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', background: '#3B7594', color: '#fff', fontWeight: 700 }}
                >
                  Ajukan Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog Tolak Permohonan Surat */}
      {rejectingSurat && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #fee2e2', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={20} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#991b1b' }}>
                  Tolak Permohonan Surat
                </h3>
              </div>
              <button 
                onClick={() => setRejectingSurat(null)}
                style={{ padding: '6px', borderRadius: '6px', background: '#f1f5f9', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0', fontSize: '12.5px' }}>
              <div><strong>Pemohon:</strong> {rejectingSurat.pemohon} ({rejectingSurat.nik})</div>
              <div style={{ marginTop: '2px' }}><strong>Jenis Surat:</strong> {rejectingSurat.jenisSurat}</div>
              <div style={{ marginTop: '2px', color: '#64748b' }}>No: {rejectingSurat.noSurat}</div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Pilih Alasan Penolakan (Template Cepat):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {[
                  'Lampiran KTP / KK belum jelas atau tidak terbaca',
                  'Ada tunggakan iuran bulanan RT yang belum diselesaikan',
                  'Keperluan surat di luar kewenangan pengurus RT 007',
                  'Data pemohon tidak cocok dengan database kependudukan'
                ].map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRejectReason(tpl)}
                    style={{
                      background: rejectReason === tpl ? '#fee2e2' : '#f1f5f9',
                      color: rejectReason === tpl ? '#991b1b' : '#475569',
                      border: `1px solid ${rejectReason === tpl ? '#fca5a5' : '#cbd5e1'}`,
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
                Catatan Penolakan (Akan dibaca oleh pemohon di portal warga) *
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tuliskan catatan perbaikan atau alasan penolakan secara spesifik..."
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
                onClick={() => setRejectingSurat(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!rejectReason.trim()) {
                    alert('Mohon cantumkan alasan penolakan agar warga mengetahui kekurangan berkasnya!');
                    return;
                  }
                  onRejectSurat(rejectingSurat.id, rejectReason);
                  setRejectingSurat(null);
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
                <XCircle size={15} /> Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
