import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, 
  Printer, ArrowLeft, ExternalLink, QrCode, FileText,
  Building, User, Calendar, MapPin, Copy, Check
} from 'lucide-react';
import api from '../../services/api';

export default function PublicSuratVerifyView({ token, onBack }) {
  const [loading, setLoading] = useState(true);
  const [verifyData, setVerifyData] = useState(null);
  const [error, setError] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    async function fetchVerification() {
      if (!token) {
        setError('Token verifikasi tidak ditemukan pada tautan.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await api.surat.verifyToken(token);
        if (res?.success && res?.data) {
          setVerifyData(res.data);
        } else {
          setError(res?.message || 'Dokumen surat tidak ditemukan.');
        }
      } catch (err) {
        setError(err.message || 'Surat tidak terdaftar atau token verifikasi salah.');
      } finally {
        setLoading(false);
      }
    }

    fetchVerification();
  }, [token]);

  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '30px 16px'
    }}>
      {/* Top Navbar */}
      <div style={{
        width: '100%',
        maxWidth: '720px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <ArrowLeft size={16} /> Kembali ke Aplikasi
        </button>

        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
          Portal Verifikasi Publik SI-WARGA RT 007
        </span>
      </div>

      {/* Main Verification Card */}
      <div style={{
        width: '100%',
        maxWidth: '720px',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        overflow: 'hidden'
      }}>
        {/* Government Header Strip */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          color: '#ffffff',
          padding: '24px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            marginBottom: '10px'
          }}>
            <ShieldCheck size={28} color="#93c5fd" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '0.5px' }}>
            PEMERINTAH KOTA BEKASI
          </h2>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px', color: '#bfdbfe' }}>
            KECAMATAN BEKASI UTARA • KELURAHAN TELUK PUCUNG
          </h3>
          <p style={{ fontSize: '12.5px', margin: 0, color: '#93c5fd' }}>
            RUKUN TETANGGA 007 / RUKUN WARGA 030
          </p>
          <div style={{
            marginTop: '12px',
            fontSize: '11px',
            display: 'inline-block',
            background: 'rgba(255,255,255,0.12)',
            padding: '4px 12px',
            borderRadius: '20px',
            letterSpacing: '0.5px'
          }}>
            SISTEM VERIFIKASI KEASLIAN DOKUMEN DIGITAL BERBASIS SHA-256
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#0284c7',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                Memvalidasi tanda tangan kriptografi dokumen...
              </div>
            </div>
          ) : error || !verifyData ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <AlertTriangle size={36} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
                Dokumen Tidak Terverifikasi / Tidak Valid!
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                {error || 'Nomor token atau tanda tangan digital surat pengantar ini tidak terdaftar dalam pangkalan data resmi RT 007.'}
              </p>
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#991b1b',
                maxWidth: '480px',
                margin: '0 auto'
              }}>
                ⚠️ <strong>Peringatan Keamanan:</strong> Jangan menerima dokumen fisik jika QR code menghasilkan token yang tidak terdaftar. Hubungi Ketua RT 007 di Teluk Pucung untuk konfirmasi manual.
              </div>
            </div>
          ) : (
            <div>
              {/* Status Banner */}
              <div style={{
                background: verifyData.is_valid ? '#f0fdf4' : '#fffbeb',
                border: `1.5px solid ${verifyData.is_valid ? '#86efac' : '#fde68a'}`,
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: verifyData.is_valid ? '#16a34a' : '#d97706',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {verifyData.is_valid ? <CheckCircle2 size={28} /> : <Clock size={28} />}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: verifyData.is_valid ? '#14532d' : '#92400e' }}>
                    {verifyData.is_valid ? '✓ DOKUMEN SAH & TERDAFTAR RESMI' : `STATUS DOKUMEN: ${verifyData.status}`}
                  </div>
                  <div style={{ fontSize: '12.5px', color: verifyData.is_valid ? '#166534' : '#b45309', marginTop: '2px', lineHeight: 1.4 }}>
                    {verifyData.is_valid 
                      ? 'Surat Pengantar ini telah disetujui dan ditandatangani secara resmi oleh Ketua RT 007 Teluk Pucung.'
                      : 'Surat ini masih dalam proses peninjauan pengurus dan belum dinyatakan sah.'}
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '12px 18px',
                  background: '#f1f5f9',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Rincian Dokumen Resmi
                </div>

                <div style={{ padding: '8px 18px', fontSize: '13px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Nomor Surat</span>
                    <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '13.5px' }}>{verifyData.no_surat}</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Jenis Surat</span>
                    <strong style={{ color: '#0f172a' }}>{verifyData.jenis_surat}</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Nama Pemohon</span>
                    <strong style={{ color: '#0284c7' }}>{verifyData.pemohon}</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>NIK Pemohon</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>
                      {verifyData.nik_masked} <span style={{ fontSize: '10px', color: '#16a34a', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>Dilindungi UU PDP</span>
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Alamat Pemohon</span>
                    <span style={{ color: '#334155' }}>{verifyData.alamat}, RT 007 / RW 030</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Maksud / Tujuan</span>
                    <span style={{ color: '#334155', fontWeight: 600 }}>{verifyData.tujuan}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Tanggal Pengesahan</span>
                    <span style={{ color: '#334155', fontWeight: 600 }}>{verifyData.tanggal_disetujui}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0' }}>
                    <span style={{ color: '#64748b' }}>Penandatangan</span>
                    <span style={{ color: '#15803d', fontWeight: 800 }}>
                      ✓ {verifyData.penandatangan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptographic SHA-256 Signature Stamp */}
              <div style={{
                background: '#f1f5f9',
                borderRadius: '10px',
                padding: '14px 18px',
                fontSize: '11.5px',
                color: '#475569',
                marginBottom: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#1e293b' }}>
                    🔒 Digital Signature Hash (SHA-256 Token):
                  </span>
                  <button
                    onClick={() => handleCopy(verifyData.verify_token)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedToken ? '#15803d' : '#0284c7',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copiedToken ? <Check size={12} /> : <Copy size={12} />}
                    {copiedToken ? 'Tersalin' : 'Salin Hash'}
                  </button>
                </div>
                <code style={{
                  display: 'block',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  background: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a'
                }}>
                  {verifyData.verify_token}
                </code>
                <div style={{ marginTop: '6px', fontSize: '10.5px', color: '#64748b' }}>
                  *Diverifikasi secara langsung dari server basis data RT 007 pada {new Date(verifyData.verified_at).toLocaleString('id-ID')}.
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={handlePrint}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={15} /> Cetak Bukti Verifikasi
                </button>

                <button
                  onClick={onBack}
                  style={{
                    background: '#0284c7',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
