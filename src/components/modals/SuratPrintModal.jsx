import React, { useState } from 'react';
import { Printer, X, CheckCircle, FileText, XCircle, AlertCircle } from 'lucide-react';
import { RT_INFO } from '../../data/mockData';

export default function SuratPrintModal({ surat, onClose, onApprove, onReject }) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!surat) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Mohon tuliskan alasan penolakan surat!');
      return;
    }
    if (onReject) {
      onReject(surat.id, rejectReason);
    }
    setShowRejectForm(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-box" style={{ maxWidth: '750px', padding: '0' }}>
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#3B7594" />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Pratinjau Surat Resmi RT 007
              </h3>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Status: <strong style={{ 
                  color: surat.status === 'Disetujui' ? '#16a34a' : surat.status === 'Ditolak' ? '#dc2626' : '#d97706' 
                }}>{surat.status}</strong>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {surat.status !== 'Disetujui' && surat.status !== 'Selesai' && surat.status !== 'Ditolak' && (
              <>
                <button 
                  onClick={() => onApprove(surat.id)}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle size={15} />
                  Setujui & TTD
                </button>

                {onReject && (
                  <button 
                    onClick={() => setShowRejectForm(true)}
                    style={{
                      background: '#dc2626',
                      color: '#ffffff',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <XCircle size={15} />
                    Tolak
                  </button>
                )}
              </>
            )}
            <button 
              onClick={handlePrint}
              style={{
                background: '#3B7594',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={15} />
              Cetak / Unduh PDF
            </button>
            <button 
              onClick={onClose}
              style={{
                background: '#e2e8f0',
                color: '#475569',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {/* Banner Penolakan jika surat ditolak */}
        {surat.status === 'Ditolak' && (
          <div style={{
            background: '#fee2e2',
            borderBottom: '1px solid #fca5a5',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={22} color="#dc2626" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#991b1b' }}>
                PERMOHONAN SURAT INI TELAH DITOLAK PENGURUS RT
              </div>
              <div style={{ fontSize: '12.5px', color: '#b91c1c', marginTop: '2px' }}>
                <strong>Catatan / Alasan:</strong> {surat.catatanPenolakan || 'Belum memenuhi persyaratan administratif RT 007.'}
              </div>
            </div>
          </div>
        )}

        {/* Dialog Form Alasan Penolakan */}
        {showRejectForm && (
          <div style={{
            background: '#fff1f2',
            borderBottom: '2px solid #fecdd3',
            padding: '18px 24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#9f1239', margin: 0 }}>
                Konfirmasi Penolakan Surat Pengantar
              </h4>
              <button 
                onClick={() => setShowRejectForm(false)}
                style={{ background: 'none', border: 'none', color: '#881337', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕ Batal
              </button>
            </div>
            
            <p style={{ fontSize: '12px', color: '#9f1239', margin: '0 0 10px' }}>
              Pilih template alasan atau ketik alasan penolakan yang akan dikirimkan ke pemohon ({surat.pemohon}):
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {[
                'Lampiran KTP / KK belum jelas atau tidak terbaca',
                'Ada tunggakan iuran bulanan RT yang belum diselesaikan',
                'Keperluan surat di luar kewenangan pengurus RT 007',
                'Data pemohon tidak sesuai dengan database kependudukan'
              ].map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRejectReason(tpl)}
                  style={{
                    background: rejectReason === tpl ? '#f43f5e' : '#ffffff',
                    color: rejectReason === tpl ? '#ffffff' : '#881337',
                    border: '1px solid #fda4af',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  • {tpl}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ketik catatan penolakan spesifik..."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #fda4af',
                fontSize: '12.5px',
                boxSizing: 'border-box',
                marginBottom: '10px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  background: '#e11d48',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Kirim Penolakan Surat
              </button>
            </div>
          </div>
        )}

        {/* Official Letter Content (Printable) */}
        <div className="printable-area" style={{ padding: '36px 44px', background: '#ffffff', color: '#111827', fontFamily: "'Times New Roman', serif" }}>
          {/* KOP SURAT */}
          <div style={{ textAlign: 'center', borderBottom: '3px double #000000', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', margin: 0 }}>
              PENGURUS RUKUN TETANGGA 007 / RUKUN WARGA 030
            </h2>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '3px 0' }}>
              KELURAHAN TELUK PUCUNG - KECAMATAN BEKASI UTARA
            </h3>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '2px 0' }}>
              KOTA BEKASI - JAWA BARAT
            </h3>
            <p style={{ fontSize: '11px', margin: '4px 0 0', fontStyle: 'italic' }}>
              Sekretariat: {RT_INFO.alamatSekretariat} | Kontak RT: 0812-3456-7890 | Kode Pos: 17121
            </p>
          </div>

          {/* JUDUL SURAT */}
          <div style={{ textAlign: 'center', margin: '24px 0 20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase', margin: 0 }}>
              {surat.jenisSurat}
            </h4>
            <p style={{ fontSize: '13px', margin: '4px 0 0' }}>
              Nomor: {surat.noSurat}
            </p>
          </div>

          {/* ISI SURAT */}
          <div style={{ fontSize: '13.5px', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '14px', textIndent: '30px' }}>
              Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 007 / RW 030 Kelurahan Teluk Pucung, Kecamatan Bekasi Utara, Kota Bekasi, menerangkan dengan sebenarnya bahwa:
            </p>

            <table style={{ width: '100%', marginBottom: '16px', marginLeft: '20px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '180px', padding: '3px 0' }}>Nama Lengkap</td>
                  <td style={{ width: '20px' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{surat.pemohon}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>NIK (No. KTP)</td>
                  <td>:</td>
                  <td>{surat.nik}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>Alamat / Blok</td>
                  <td>:</td>
                  <td>{surat.alamat}, RT 007 / RW 030 Kel. Teluk Pucung</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>Maksud / Tujuan</td>
                  <td>:</td>
                  <td style={{ fontWeight: '600' }}>{surat.tujuan}</td>
                </tr>
              </tbody>
            </table>

            <p style={{ marginBottom: '14px', textIndent: '30px' }}>
              Bahwa nama tersebut di atas adalah benar-benar warga yang bertempat tinggal / berdomisili di lingkungan RT 007 / RW 030 Kelurahan Teluk Pucung, serta berkelakuan baik dalam kehidupan bermasyarakat.
            </p>

            <p style={{ marginBottom: '24px', textIndent: '30px' }}>
              Demikian surat keterangan / pengantar ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* TANDA TANGAN */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingRight: '20px', paddingLeft: '20px' }}>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>Mengetahui,</p>
              <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '2px 0 60px' }}>Pemohon</p>
              <p style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                {surat.pemohon}
              </p>
            </div>

            <div style={{ textAlign: 'center', width: '240px', position: 'relative' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>Bekasi, {surat.tanggalPengajuan}</p>
              <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '2px 0 60px' }}>
                Ketua RT 007 / RW 030
              </p>

              {/* Digital Stamp Simulation */}
              <div style={{
                position: 'absolute',
                top: '35px',
                left: '25px',
                border: '2px dashed #3B7594',
                color: '#3B7594',
                borderRadius: '50%',
                width: '85px',
                height: '85px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                transform: 'rotate(-15deg)',
                opacity: surat.status === 'Disetujui' || surat.status === 'Selesai' ? 0.75 : 0.2,
                pointerEvents: 'none',
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                RT 007 / RW 030<br />TELUK PUCUNG<br />KOTA BEKASI
              </div>

              <p style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
                {RT_INFO.ketuaRt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
