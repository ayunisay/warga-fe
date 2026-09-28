import React, { useState } from 'react';
import { 
  Home, FileText, Wallet, Bell, LogOut, CheckCircle2, 
  Clock, Plus, Calendar, AlertCircle, Phone, MapPin, 
  QrCode, CreditCard, ChevronRight, Download, Printer, ShieldCheck
} from 'lucide-react';
import { RT_INFO } from '../../data/mockData';

export default function WargaPortalView({ 
  citizen, 
  suratList, 
  onAddSurat, 
  onOpenSuratModal,
  onPayIuran,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'surat' | 'iuran'
  const [showAddSuratModal, setShowAddSuratModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qris'); // 'qris' | 'transfer' | 'tunai'

  // Form pengajuan surat warga
  const [suratForm, setSuratForm] = useState({
    jenisSurat: 'Surat Pengantar SKCK (Catatan Kepolisian)',
    tujuan: '',
    urgensi: 'Biasa'
  });

  // Filter riwayat surat yang diajukan oleh warga ini (berdasarkan nama atau nik)
  const mySuratList = suratList.filter(s => 
    s.pemohon.toLowerCase() === citizen.nama.toLowerCase() ||
    s.nik === citizen.nik
  );

  const pendingSuratCount = mySuratList.filter(s => s.status === 'Menunggu Verifikasi').length;
  const approvedSuratCount = mySuratList.filter(s => s.status === 'Disetujui' || s.status === 'Selesai').length;

  const handleKirimSurat = (e) => {
    e.preventDefault();
    if (!suratForm.tujuan.trim()) {
      alert('Mohon cantumkan keperluan atau tujuan pengajuan surat!');
      return;
    }

    const newSurat = {
      id: `SRT-2026-${String(suratList.length + 1).padStart(3, '0')}`,
      noSurat: `0${50 + suratList.length}/RT.007-RW.030/TP/III/2026`,
      jenisSurat: suratForm.jenisSurat,
      pemohon: citizen.nama,
      nik: citizen.nik,
      alamat: citizen.alamat,
      tujuan: suratForm.tujuan,
      tanggalPengajuan: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Menunggu Verifikasi',
      urgensi: suratForm.urgensi,
      catatan: 'Diajukan langsung oleh warga melalui Portal Warga SI-WARGA 07'
    };

    onAddSurat(newSurat);
    setShowAddSuratModal(false);
    setSuratForm({
      jenisSurat: 'Surat Pengantar SKCK (Catatan Kepolisian)',
      tujuan: '',
      urgensi: 'Biasa'
    });
    alert('Permohonan surat berhasil dikirim! Pengurus RT akan segera memverifikasi permohonan Anda.');
    setActiveTab('surat');
  };

  const handleConfirmPayment = () => {
    const receiptData = {
      noKuitansi: `KWT-RT007-${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      periode: 'Maret 2026',
      nominal: 60000,
      metode: selectedPaymentMethod === 'qris' ? 'QRIS Digital RT 007' : selectedPaymentMethod === 'transfer' ? 'Transfer Bank Mandiri' : 'Tunai via Bendahara RT',
      pembayar: citizen.nama,
      alamat: citizen.alamat,
      blok: citizen.blok,
      noRumah: citizen.noRumah
    };

    onPayIuran(citizen.id, 60000, citizen.nama);
    setShowPaymentModal(false);
    setPaymentSuccessReceipt(receiptData);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      {/* 1. Header Portal Warga */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#3B7594',
              color: '#ffffff',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '20px'
            }}>
              S
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#1e293b' }}>
                SI-WARGA 07
              </h2>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                Portal Layanan Warga RT 007 / RW 030 Teluk Pucung
              </span>
            </div>
          </div>

          {/* User info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                {citizen.nama}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {citizen.alamat}
              </div>
            </div>

            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#e0f2fe',
              color: '#0369a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px'
            }}>
              {citizen.nama.charAt(0)}
            </div>

            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#dc2626',
                fontSize: '12.5px',
                fontWeight: 700,
                border: '1px solid #fecaca',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Keluar dari Akun Warga"
            >
              <LogOut size={15} /> Keluar
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeTab === 'dashboard' ? '3px solid #3B7594' : '3px solid transparent',
              color: activeTab === 'dashboard' ? '#3B7594' : '#64748b',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Home size={16} /> Dashboard Informasi
          </button>

          <button
            onClick={() => setActiveTab('surat')}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeTab === 'surat' ? '3px solid #3B7594' : '3px solid transparent',
              color: activeTab === 'surat' ? '#3B7594' : '#64748b',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} /> Pengajuan Surat
            {pendingSuratCount > 0 && (
              <span style={{
                background: '#ea580c',
                color: '#fff',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 800
              }}>
                {pendingSuratCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('iuran')}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeTab === 'iuran' ? '3px solid #3B7594' : '3px solid transparent',
              color: activeTab === 'iuran' ? '#3B7594' : '#64748b',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Wallet size={16} /> Bayar Iuran RT
            <span style={{
              background: citizen.statusIuran === 'Lunas' ? '#dcfce7' : '#fee2e2',
              color: citizen.statusIuran === 'Lunas' ? '#15803d' : '#b91c1c',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '6px',
              fontWeight: 800
            }}>
              {citizen.statusIuran === 'Lunas' ? 'Lunas' : 'Belum Lunas'}
            </span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 60px' }}>
        
        {/* ================= TAB 1: DASHBOARD INFORMASI ================= */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Hero Welcome Card */}
            <div style={{
              background: 'linear-gradient(135deg, #3B7594 0%, #254d63 100%)',
              borderRadius: '20px',
              padding: '28px',
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(59, 117, 148, 0.25)',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700
                  }}>
                    RT 007 / RW 030 TELUK PUCUNG
                  </span>
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>
                    • Warga {citizen.statusTinggal}
                  </span>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px' }}>
                  Halo, {citizen.nama} 👋
                </h1>
                <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '600px', lineHeight: 1.5, margin: 0 }}>
                  Akses layanan administrasi surat pengantar online dan bayar iuran kebersihan/keamanan RT 007 dengan mudah langsung dari gawai Anda.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowAddSuratModal(true)}
                  style={{
                    background: '#f5c443',
                    color: '#1a3848',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(245, 196, 67, 0.35)',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={18} /> Buat Surat Pengantar
                </button>

                {citizen.statusIuran !== 'Lunas' && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    style={{
                      background: '#ffffff',
                      color: '#0f172a',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Wallet size={18} /> Bayar Iuran Sekarang
                  </button>
                )}
              </div>
            </div>

            {/* Quick Summary Cards (3 Columns) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px',
              marginBottom: '28px'
            }}>
              {/* Card 1: Status Iuran Keluarga */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
                    Status Iuran Maret 2026
                  </span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: citizen.statusIuran === 'Lunas' ? '#dcfce7' : '#fee2e2',
                    color: citizen.statusIuran === 'Lunas' ? '#15803d' : '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Wallet size={18} />
                  </div>
                </div>

                <div style={{ fontSize: '22px', fontWeight: 800, color: citizen.statusIuran === 'Lunas' ? '#15803d' : '#dc2626', marginBottom: '4px' }}>
                  {citizen.statusIuran === 'Lunas' ? '✓ Sudah Lunas' : 'Belum Dibayar'}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
                  Nominal: Rp 60.000 / KK (Kebersihan & Keamanan)
                </div>

                <button
                  onClick={() => citizen.statusIuran === 'Lunas' ? setActiveTab('iuran') : setShowPaymentModal(true)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    background: citizen.statusIuran === 'Lunas' ? '#f1f5f9' : '#3B7594',
                    color: citizen.statusIuran === 'Lunas' ? '#334155' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {citizen.statusIuran === 'Lunas' ? 'Lihat Riwayat Iuran' : 'Bayar via QRIS / Transfer →'}
                </button>
              </div>

              {/* Card 2: Permohonan Surat Saya */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
                    Permohonan Surat Saya
                  </span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={18} />
                  </div>
                </div>

                <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>
                  {mySuratList.length} <span style={{ fontSize: '15px', fontWeight: 600, color: '#64748b' }}>Pengajuan</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#ea580c', fontWeight: 700 }}>{pendingSuratCount} Proses</span>
                  <span>•</span>
                  <span style={{ color: '#15803d', fontWeight: 700 }}>{approvedSuratCount} Disetujui</span>
                </div>

                <button
                  onClick={() => setActiveTab('surat')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    background: '#f1f5f9',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Kelola Pengajuan Surat →
                </button>
              </div>

              {/* Card 3: Profil Hunian RT */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
                    Data Hunian & Keluarga
                  </span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#fef3c7',
                    color: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Home size={18} />
                  </div>
                </div>

                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>
                  {citizen.blok} No. {citizen.noRumah}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
                  No. KK: <code style={{ color: '#0f172a', fontWeight: 600 }}>{citizen.noKk}</code>
                </div>

                <div style={{
                  fontSize: '11.5px',
                  background: '#f8fafc',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  color: '#475569'
                }}>
                  Terdaftar di database kependudukan Kel. Teluk Pucung
                </div>
              </div>
            </div>

            {/* Announcements & Emergency Contacts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Pengumuman Warga */}
              <div style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={18} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Papan Informasi & Agenda RT 007
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Event 1 */}
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', borderLeft: '4px solid #3B7594' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                        🧹 Kerja Bakti Saluran Drainase & Fogging
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#3B7594' }}>
                        29 Mar 2026
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                      Seluruh warga dimohon partisipasinya membersihkan got dan lingkungan menjelang musim hujan. Titik kumpul di Lapangan RT 007 pukul 07.30 WIB.
                    </p>
                  </div>

                  {/* Event 2 */}
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', borderLeft: '4px solid #16a34a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                        👶 Posyandu Balita & Imunisasi Melati 07
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>
                        05 Apr 2026
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                      Pemeriksaan tumbuh kembang balita, vitamin A, dan konsultasi gizi balita gratis di Balai Pos RT 007 pukul 08.30 - 11.30 WIB.
                    </p>
                  </div>

                  {/* Event 3 */}
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                        🚛 Jadwal Pengambilan Sampah Domestik
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706' }}>
                        Rutin
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                      Petugas kebersihan mengambil sampah setiap hari <strong>Selasa, Kamis, dan Sabtu</strong> pagi. Harap meletakkan sampah dalam kantong tertutup di depan pagar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kontak Pengurus RT & Darurat */}
              <div style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Kontak Pengurus RT & Siaga
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Ketua RT 007</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>H. Bambang Sugiarto, S.T.</div>
                    </div>
                    <a href="tel:081234567890" style={{ fontSize: '12px', color: '#3B7594', fontWeight: 700, textDecoration: 'none' }}>
                      0812-3456-7890
                    </a>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Sekretaris RT</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Ahmad Fauzi (Surat & Dokumen)</div>
                    </div>
                    <a href="tel:081388997711" style={{ fontSize: '12px', color: '#3B7594', fontWeight: 700, textDecoration: 'none' }}>
                      0813-8899-7711
                    </a>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Bendahara RT</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Hj. Endang Suryaningsih (Kas & Iuran)</div>
                    </div>
                    <a href="tel:085671239900" style={{ fontSize: '12px', color: '#3B7594', fontWeight: 700, textDecoration: 'none' }}>
                      0856-7123-9900
                    </a>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fef2f2', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#b91c1c' }}>Pos Keamanan / Satpam 24 Jam</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Gerbang Utama Teluk Pucung</div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 800 }}>
                      0811-9988-7766
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PENGAJUAN SURAT ================= */}
        {activeTab === 'surat' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  Layanan Pengajuan Surat Pengantar Online
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Surat yang Anda ajukan akan diverifikasi dan ditandatangani oleh Ketua RT 007
                </p>
              </div>

              <button
                onClick={() => setShowAddSuratModal(true)}
                style={{
                  background: '#3B7594',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(59, 117, 148, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <Plus size={18} /> Ajukan Surat Baru
              </button>
            </div>

            {/* Riwayat Surat yang diajukan oleh Warga ini */}
            {mySuratList.length === 0 ? (
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <FileText size={48} color="#94a3b8" style={{ marginBottom: '14px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Belum Ada Permohonan Surat
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '400px', margin: '0 auto 18px' }}>
                  Anda belum pernah mengajukan surat pengantar. Klik tombol di bawah untuk membuat permohonan baru.
                </p>
                <button
                  onClick={() => setShowAddSuratModal(true)}
                  style={{
                    background: '#3B7594',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + Ajukan Surat Pengantar Sekarang
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {mySuratList.map((srt) => (
                  <div
                    key={srt.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      padding: '20px 24px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: srt.status === 'Menunggu Verifikasi' ? '#fef3c7' : '#dcfce7',
                          color: srt.status === 'Menunggu Verifikasi' ? '#b45309' : '#15803d'
                        }}>
                          {srt.status}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                          No: {srt.noSurat}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          • {srt.tanggalPengajuan}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                        {srt.jenisSurat}
                      </h3>

                      <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0 0' }}>
                        <strong>Keperluan:</strong> {srt.tujuan}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        onClick={() => onOpenSuratModal(srt)}
                        style={{
                          background: srt.status === 'Disetujui' ? '#16a34a' : '#3B7594',
                          color: '#ffffff',
                          padding: '9px 16px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        {srt.status === 'Disetujui' ? (
                          <><Printer size={15} /> Cetak / Unduh Surat Resmi</>
                        ) : (
                          <><FileText size={15} /> Pratinjau Permohonan</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: BAYAR IURAN RT ================= */}
        {activeTab === 'iuran' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  Catatan & Pembayaran Iuran Warga RT 007
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Iuran wajib bulanan Rp 60.000 / Kepala Keluarga untuk operasional satpam & kebersihan lingkungan
                </p>
              </div>

              {citizen.statusIuran !== 'Lunas' ? (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                    cursor: 'pointer'
                  }}
                >
                  <Wallet size={18} /> Bayar Iuran Sekarang (Rp 60.000)
                </button>
              ) : (
                <div style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={16} /> Iuran Bulan Ini Sudah Lunas
                </div>
              )}
            </div>

            {/* Breakdown Rincian Iuran */}
            <div style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>
                Rincian Tarif Iuran Bulanan RT 007
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>1. Retribusi Sampah & Kebersihan</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>Rp 35.000 / bln</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Pengangkutan sampah 3x seminggu</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>2. Keamanan & Pos Satpam 24 Jam</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>Rp 25.000 / bln</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Honor satpam & operasional portal</div>
                </div>

                <div style={{ background: '#f0f9ff', padding: '14px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: 700 }}>Total Tagihan per KK</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>Rp 60.000 / bln</div>
                  <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '2px' }}>Jatuh tempo tgl 10 tiap bulan</div>
                </div>
              </div>
            </div>

            {/* Matriks Status Bulanan Tahun 2026 */}
            <div style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>
                Riwayat Pembayaran Iuran Tahun 2026
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                {[
                  { bulan: 'Januari 2026', status: 'Lunas', tgl: '08 Jan 2026' },
                  { bulan: 'Februari 2026', status: 'Lunas', tgl: '07 Feb 2026' },
                  { bulan: 'Maret 2026', status: citizen.statusIuran, tgl: citizen.statusIuran === 'Lunas' ? '12 Mar 2026' : 'Belum Bayar' },
                  { bulan: 'April 2026', status: 'Mendatang', tgl: 'Jatuh tempo 10 Apr' },
                  { bulan: 'Mei 2026', status: 'Mendatang', tgl: 'Jatuh tempo 10 Mei' },
                  { bulan: 'Juni 2026', status: 'Mendatang', tgl: 'Jatuh tempo 10 Jun' },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: item.status === 'Lunas' ? '#f0fdf4' : item.status === 'Menunggak' ? '#fef2f2' : '#f8fafc',
                      border: `1px solid ${item.status === 'Lunas' ? '#bbf7d0' : item.status === 'Menunggak' ? '#fecaca' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                        {item.bulan}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Rp 60.000
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: item.status === 'Lunas' ? '#dcfce7' : item.status === 'Menunggak' ? '#fee2e2' : '#e2e8f0',
                        color: item.status === 'Lunas' ? '#15803d' : item.status === 'Menunggak' ? '#dc2626' : '#64748b'
                      }}>
                        {item.status}
                      </span>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '4px' }}>
                        {item.tgl}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL 1: FORM AJUKAN SURAT ================= */}
      {showAddSuratModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '580px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Ajukan Permohonan Surat Pengantar RT
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Pemohon: <strong>{citizen.nama}</strong> (NIK: {citizen.nik})
                </span>
              </div>
              <button 
                onClick={() => setShowAddSuratModal(false)}
                style={{ padding: '6px', borderRadius: '8px', background: '#f1f5f9', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleKirimSurat}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Jenis Surat yang Dibutuhkan *
                </label>
                <select 
                  value={suratForm.jenisSurat}
                  onChange={(e) => setSuratForm({ ...suratForm, jenisSurat: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    Alamat Pemohon (Tercatat di RT 007)
                  </label>
                  <input 
                    type="text" 
                    readOnly
                    value={citizen.alamat}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '12.5px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    Tingkat Urgensi
                  </label>
                  <select 
                    value={suratForm.urgensi}
                    onChange={(e) => setSuratForm({ ...suratForm, urgensi: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  >
                    <option value="Biasa">Biasa (1-2 Hari)</option>
                    <option value="Penting / Cepat">Penting / Cepat (Hari ini)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Keperluan / Maksud Pengajuan Surat *
                </label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Contoh: Persyaratan melamar pekerjaan di BUMN / pengurusan visa / perpanjangan KTP..."
                  value={suratForm.tujuan}
                  onChange={(e) => setSuratForm({ ...suratForm, tujuan: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', marginBottom: '18px', border: '1px solid #bae6fd', fontSize: '12px', color: '#0369a1' }}>
                ℹ️ Setelah dikirim, surat akan masuk ke antrean verifikasi Sekretariat RT 007. Anda dapat mencetak surat resmi berstempel setelah disetujui.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setShowAddSuratModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', background: '#3B7594', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Kirim Permohonan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: BAYAR IURAN INTERAKTIF ================= */}
      {showPaymentModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '540px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Pembayaran Iuran Warga RT 007
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Periode: <strong>Maret 2026</strong> • Total: <strong style={{ color: '#15803d' }}>Rp 60.000</strong>
                </span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                style={{ padding: '6px', borderRadius: '8px', background: '#f1f5f9', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                Pilih Metode Pembayaran:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div
                  onClick={() => setSelectedPaymentMethod('qris')}
                  style={{
                    border: selectedPaymentMethod === 'qris' ? '2px solid #3B7594' : '1px solid #cbd5e1',
                    background: selectedPaymentMethod === 'qris' ? '#f0f9ff' : '#ffffff',
                    borderRadius: '10px',
                    padding: '12px 8px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <QrCode size={22} color={selectedPaymentMethod === 'qris' ? '#0284c7' : '#64748b'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>QRIS RT 007</div>
                  <div style={{ fontSize: '10px', color: '#16a34a' }}>Otomatis</div>
                </div>

                <div
                  onClick={() => setSelectedPaymentMethod('transfer')}
                  style={{
                    border: selectedPaymentMethod === 'transfer' ? '2px solid #3B7594' : '1px solid #cbd5e1',
                    background: selectedPaymentMethod === 'transfer' ? '#f0f9ff' : '#ffffff',
                    borderRadius: '10px',
                    padding: '12px 8px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <CreditCard size={22} color={selectedPaymentMethod === 'transfer' ? '#0284c7' : '#64748b'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Transfer Bank</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Bank Mandiri</div>
                </div>

                <div
                  onClick={() => setSelectedPaymentMethod('tunai')}
                  style={{
                    border: selectedPaymentMethod === 'tunai' ? '2px solid #3B7594' : '1px solid #cbd5e1',
                    background: selectedPaymentMethod === 'tunai' ? '#f0f9ff' : '#ffffff',
                    borderRadius: '10px',
                    padding: '12px 8px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Wallet size={22} color={selectedPaymentMethod === 'tunai' ? '#0284c7' : '#64748b'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Tunai / Cash</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>via Bendahara</div>
                </div>
              </div>
            </div>

            {/* Method Details */}
            {selectedPaymentMethod === 'qris' && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '18px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  SCAN KODE QRIS KAS RT 007 TELUK PUCUNG
                </div>
                {/* Simulated QR Code Box */}
                <div style={{
                  width: '160px',
                  height: '160px',
                  margin: '0 auto 10px',
                  background: '#ffffff',
                  border: '2px solid #0f172a',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <QrCode size={130} color="#0f172a" />
                  <span style={{ position: 'absolute', bottom: '6px', fontSize: '9px', fontWeight: 800, background: '#f5c443', padding: '1px 6px', borderRadius: '4px' }}>
                    QRIS RESMI RT 007
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Bisa menggunakan BCA, Mandiri, GoPay, OVO, Dana, ShopeePay, LinkAja
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#15803d', marginTop: '6px' }}>
                  Nominal: Rp 60.000
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'transfer' && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '18px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  REKENING RESMI KAS RT 007:
                </div>
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Bank Mandiri Kantor Cabang Bekasi</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', letterSpacing: '1px' }}>
                    156-00-128938-7
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#3B7594', marginTop: '2px' }}>
                    a.n. KAS RT 007 RW 030 TELUK PUCUNG
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                  Harap transfer pas Rp 60.000 sesuai tagihan bulanan.
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'tunai' && (
              <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', marginBottom: '18px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                  💵 Pembayaran Tunai Langsung
                </div>
                <p style={{ fontSize: '12.5px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
                  Anda dapat menyetorkan uang tunai Rp 60.000 langsung ke rumah Bendahara RT 007 (Ibu Hj. Endang Suryaningsih di Jl. Cempaka Blok C1 No. 04).
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => setShowPaymentModal(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b', cursor: 'pointer' }}
              >
                Tutup
              </button>
              <button 
                type="button"
                onClick={handleConfirmPayment}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: '#16a34a',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={16} /> Konfirmasi Pembayaran Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: KUITANSI DIGITAL PEMBAYARAN IURAN ================= */}
      {paymentSuccessReceipt && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '480px', padding: '28px', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>
              Pembayaran Iuran Berhasil!
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Terima kasih telah membayar iuran RT 007 tepat waktu.
            </p>

            {/* Receipt Box */}
            <div style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left',
              fontSize: '12.5px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>No. Kuitansi:</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{paymentSuccessReceipt.noKuitansi}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Waktu Bayar:</span>
                <span style={{ fontWeight: 600 }}>{paymentSuccessReceipt.tanggal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Nama Warga:</span>
                <span style={{ fontWeight: 700 }}>{paymentSuccessReceipt.pembayar}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Alamat:</span>
                <span>{paymentSuccessReceipt.alamat}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Periode:</span>
                <span style={{ fontWeight: 700, color: '#3B7594' }}>{paymentSuccessReceipt.periode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Metode:</span>
                <span>{paymentSuccessReceipt.metode}</span>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>TOTAL DIBAYAR:</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#15803d' }}>
                  Rp {paymentSuccessReceipt.nominal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setPaymentSuccessReceipt(null)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#3B7594',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Simpan & Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
