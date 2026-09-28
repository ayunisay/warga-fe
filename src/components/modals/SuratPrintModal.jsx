import React from 'react';
import { Printer, X, CheckCircle, FileText } from 'lucide-react';
import { RT_INFO } from '../../data/mockData';

export default function SuratPrintModal({ surat, onClose, onApprove }) {
  if (!surat) return null;

  const handlePrint = () => {
    window.print();
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
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
              Pratinjau Surat Resmi RT 007
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {surat.status !== 'Disetujui' && surat.status !== 'Selesai' && (
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
                  gap: '6px'
                }}
              >
                <CheckCircle size={15} />
                Setujui & TTD
              </button>
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
