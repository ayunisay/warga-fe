import React, { useState } from 'react';
import { 
  Home, FileText, Wallet, Bell, LogOut, CheckCircle2, 
  Clock, Plus, Calendar, AlertCircle, Phone, MapPin, 
  QrCode, CreditCard, ChevronRight, Download, Printer, ShieldCheck,
  Copy, Check, MessageSquare, UploadCloud, ExternalLink, User, Users
} from 'lucide-react';
import { RT_INFO } from '../../data/mockData';
import Footer from '../Footer';

export default function WargaPortalView({ 
  citizen = {}, 
  suratList = [], 
  announcements = [],
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
  const [selectedMonth, setSelectedMonth] = useState('Maret 2026');
  const [selectedBank, setSelectedBank] = useState('mandiri');
  const [copiedBank, setCopiedBank] = useState(false);
  const [transferProof, setTransferProof] = useState(null);
  const [offlineNoticeSent, setOfflineNoticeSent] = useState(false);
  const [offlineSchedule, setOfflineSchedule] = useState('Hari ini (16.00 - 18.00 WIB)');
  const [paidMonths, setPaidMonths] = useState({
    'Januari 2026': true,
    'Februari 2026': true,
    'Maret 2026': citizen?.statusIuran === 'Lunas',
    'April 2026': false,
    'Mei 2026': false,
    'Juni 2026': false,
  });

  const MONTHS_DATA = [
    { bulan: 'Januari 2026', tgl: '08 Jan 2026' },
    { bulan: 'Februari 2026', tgl: '07 Feb 2026' },
    { bulan: 'Maret 2026', tgl: '12 Mar 2026' },
    { bulan: 'April 2026', tgl: '10 Apr 2026' },
    { bulan: 'Mei 2026', tgl: '10 Mei 2026' },
    { bulan: 'Juni 2026', tgl: '10 Jun 2026' },
  ];

  // Hitung apakah masih ada bulan di riwayat 2026 yang belum dibayar
  const unpaidMonthsList = MONTHS_DATA.filter(item => !paidMonths[item.bulan]);
  const isLunas = unpaidMonthsList.length === 0;
  const nextUnpaidMonth = unpaidMonthsList[0]?.bulan || 'Maret 2026';
  const totalUnpaidNominal = unpaidMonthsList.length * 60000;

  const activeAnnouncementsList = announcements.filter(a => a.status === 'Aktif');

  const handleCopyAccount = (number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(number);
    }
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

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
    const isPayAll = selectedMonth === 'Semua Tagihan';
    const amountToPay = isPayAll ? (unpaidMonthsList.length * 60000) : 60000;
    const periodeToDisplay = isPayAll 
      ? `Pelunasan Semua Tagihan (${unpaidMonthsList.map(m => m.bulan.split(' ')[0]).join(', ')} 2026)` 
      : selectedMonth;

    const receiptData = {
      noKuitansi: `KWT-RT007-${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      periode: periodeToDisplay,
      nominal: amountToPay,
      metode: selectedPaymentMethod === 'qris' 
        ? 'QRIS Digital RT 007' 
        : selectedPaymentMethod === 'transfer' 
          ? `Transfer Bank ${selectedBank === 'mandiri' ? 'Mandiri' : 'BCA'}` 
          : 'Setoran Tunai (Ketemu Pengurus)',
      pembayar: citizen?.nama || 'Warga RT 007',
      alamat: citizen?.alamat || 'RT 007 / RW 030',
      blok: citizen?.blok || '',
      noRumah: citizen?.noRumah || '',
      catatan: selectedPaymentMethod === 'tunai' 
        ? 'Setor tunai ke Bendahara Ibu Hj. Endang' 
        : 'Verifikasi instan via Web SI-WARGA 07'
    };

    if (isPayAll) {
      setPaidMonths(prev => {
        const next = { ...prev };
        MONTHS_DATA.forEach(item => {
          next[item.bulan] = true;
        });
        return next;
      });
    } else {
      setPaidMonths(prev => ({
        ...prev,
        [selectedMonth]: true
      }));
    }

    if (onPayIuran) {
      onPayIuran(citizen?.id, amountToPay, citizen?.nama);
    }
    setShowPaymentModal(false);
    setPaymentSuccessReceipt(receiptData);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b' }}>
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
              background: isLunas ? '#dcfce7' : '#fee2e2',
              color: isLunas ? '#15803d' : '#b91c1c',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '6px',
              fontWeight: 800
            }}>
              {isLunas ? 'Lunas' : 'Belum Lunas'}
            </span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px 20px 60px', boxSizing: 'border-box' }}>
        
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

                {!isLunas && (
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
                    Status Iuran Tahun 2026
                  </span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isLunas ? '#dcfce7' : '#fee2e2',
                    color: isLunas ? '#15803d' : '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Wallet size={18} />
                  </div>
                </div>

                <div style={{ fontSize: '22px', fontWeight: 800, color: isLunas ? '#15803d' : '#dc2626', marginBottom: '4px' }}>
                  {isLunas ? '✓ Sudah Lunas' : `${unpaidMonthsList.length} Bulan Belum Bayar`}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
                  {isLunas ? 'Semua tagihan iuran 2026 telah selesai' : `Total: Rp ${totalUnpaidNominal.toLocaleString('id-ID')} (${unpaidMonthsList.map(m => m.bulan.split(' ')[0]).join(', ')})`}
                </div>

                <button
                  onClick={() => isLunas ? setActiveTab('iuran') : setShowPaymentModal(true)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    background: isLunas ? '#f1f5f9' : '#3B7594',
                    color: isLunas ? '#334155' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {isLunas ? 'Lihat Riwayat Iuran' : 'Bayar via QRIS / Transfer →'}
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
                  {activeAnnouncementsList.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      Belum ada agenda atau pengumuman aktif saat ini.
                    </div>
                  ) : (
                    activeAnnouncementsList.map((item) => (
                      <div 
                        key={item.id} 
                        style={{ 
                          background: '#f8fafc', 
                          borderRadius: '12px', 
                          padding: '14px', 
                          borderLeft: `4px solid ${item.color || '#3B7594'}` 
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                            {item.icon} {item.judul}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: item.color || '#3B7594', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                            {item.tanggal}
                          </span>
                        </div>
                        <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                          {item.deskripsi}
                        </p>
                        {(item.lokasi || item.waktu) && (
                          <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>
                            {item.waktu && <span>⏰ {item.waktu}</span>}
                            {item.lokasi && <span>📍 {item.lokasi}</span>}
                          </div>
                        )}
                      </div>
                    ))
                  )}
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
            {/* Header Tab Iuran */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '22px'
            }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  Catatan & Pembayaran Iuran Warga RT 007
                </h2>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                  {isLunas 
                    ? 'Catatan riwayat pembayaran iuran warga Anda tercatat rapi di bawah ini' 
                    : 'Bisa bayar online langsung di web (Transfer Bank / QRIS) atau bayar offline ketemu pengurus RT'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  background: isLunas ? '#dcfce7' : '#fee2e2',
                  color: isLunas ? '#15803d' : '#dc2626',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  letterSpacing: '0.5px'
                }}>
                  {isLunas 
                    ? '✓ LUNAS' 
                    : `Tagihan: ${unpaidMonthsList.length} Bulan (Rp ${totalUnpaidNominal.toLocaleString('id-ID')})`}
                </span>

                {!isLunas && (
                  <button
                    onClick={() => {
                      setSelectedMonth(nextUnpaidMonth);
                      setShowPaymentModal(true);
                    }}
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
                    <Wallet size={18} /> Bayar Iuran ({nextUnpaidMonth})
                  </button>
                )}
              </div>
            </div>

            {/* SEKSI UTAMA: DUA JALUR PEMBAYARAN HANYA TAMPIL JIKA BELUM LUNAS */}
            {isLunas ? (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '1.5px solid #86efac',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                marginBottom: '22px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#16a34a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#14532d' }}>
                      Semua Kewajiban Iuran Warga Anda Telah LUNAS
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '2px' }}>
                      Tidak ada tagihan tertunggak. Terima kasih atas partisipasi aktif Bapak/Ibu {citizen?.nama || 'Warga'} dalam mendukung kegiatan RT 007.
                    </div>
                  </div>
                </div>
                <span style={{
                  background: '#15803d',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  padding: '6px 14px',
                  borderRadius: '6px',
                  letterSpacing: '0.5px'
                }}>
                  LUNAS
                </span>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '20px',
                marginBottom: '26px'
              }}>
              {/* JALUR 1: BAYAR ONLINE DI WEB (QRIS & TRANSFER BANK) */}
              <div style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '2px solid #bae6fd',
                padding: '24px',
                boxShadow: '0 4px 14px rgba(59, 117, 148, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                          1. Bayar Online di Web
                        </h3>
                        <span style={{ fontSize: '11.5px', color: '#0369a1', fontWeight: 600 }}>
                          Otomatis • Cepat • Bukti Digital
                        </span>
                      </div>
                    </div>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      ⚡ Rekomendasi
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                    Bayar langsung dari HP atau komputer menggunakan QRIS (semua e-wallet / mobile banking) atau Transfer Bank Kas RT.
                  </p>

                  {/* Sub-Option 1: QRIS */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: '#f5c443', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b' }}>
                        <QrCode size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                          Scan QRIS RT 007
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          BCA, Mandiri, BRI, GoPay, OVO, Dana, ShopeePay
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPaymentMethod('qris');
                        setSelectedMonth(paidMonths['Maret 2026'] ? 'April 2026' : 'Maret 2026');
                        setShowPaymentModal(true);
                      }}
                      style={{
                        background: '#3B7594',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Buka QR →
                    </button>
                  </div>

                  {/* Sub-Option 2: Transfer Bank (TF) */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
                        <CreditCard size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                          Transfer Bank (TF)
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Bank Mandiri (156-00-128938-7) & Bank BCA
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPaymentMethod('transfer');
                        setSelectedMonth(paidMonths['Maret 2026'] ? 'April 2026' : 'Maret 2026');
                        setShowPaymentModal(true);
                      }}
                      style={{
                        background: '#3B7594',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Pilih Bank →
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 700 }}>
                    ✓ Kuitansi terbit otomatis setelah konfirmasi
                  </span>
                </div>
              </div>

              {/* JALUR 2: BAYAR OFFLINE (KETEMU LANGSUNG PENGURUS RT) */}
              <div style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '2px solid #fed7aa',
                padding: '24px',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                          2. Bayar Offline (Ketemu Pengurus)
                        </h3>
                        <span style={{ fontSize: '11.5px', color: '#c2410c', fontWeight: 600 }}>
                          Tatap Muka • Setor Tunai • Kuitansi Cetak
                        </span>
                      </div>
                    </div>
                    <span style={{
                      background: '#ffedd5',
                      color: '#9a3412',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      💵 Tunai
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                    Bagi warga yang ingin membayar langsung secara tunai, dapat menemui pengurus di lokasi berikut:
                  </p>

                  {/* Lokasi 1: Bendahara RT */}
                  <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '12px 14px', border: '1px solid #fef3c7', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
                          🏠 Rumah Bendahara RT (Ibu Hj. Endang)
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#78350f', marginTop: '2px' }}>
                          Jl. Cempaka Blok C1 No. 04 (Dekat Taman RT)
                        </div>
                        <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px' }}>
                          🕒 Layanan: Setiap Hari, Pukul 08.00 - 20.00 WIB
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lokasi 2: Pos Sekretariat RT 007 */}
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                      🏢 Pos Sekretariat RT 007 Teluk Pucung
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                      Gerbang Utama RT 007 • Buka setiap Sabtu & Minggu pagi saat piket
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setSelectedPaymentMethod('tunai');
                      setSelectedMonth(paidMonths['Maret 2026'] ? 'April 2026' : 'Maret 2026');
                      setShowPaymentModal(true);
                    }}
                    style={{
                      flex: 1,
                      background: '#ea580c',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Calendar size={15} /> Buat Pemberitahuan Setor Tunai
                  </button>

                  <a
                    href="https://wa.me/6285671239900?text=Halo%20Ibu%20Endang,%20saya%20ingin%20bayar%20iuran%20RT%20007%20secara%20tunai."
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#25d366',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageSquare size={15} /> WA Bendahara
                  </a>
                </div>
              </div>
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
            </>
            )}

            {/* Matriks Status Bulanan Tahun 2026 */}
            <div style={{
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Riwayat & Status Pembayaran Iuran Tahun 2026
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Klik bulan yang ingin dibayar untuk membuka menu pembayaran
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                {MONTHS_DATA.map((item, idx) => {
                  const isPaid = Boolean(paidMonths[item.bulan]);
                  return (
                    <div 
                      key={idx}
                      style={{
                        background: isPaid ? '#f0fdf4' : '#ffffff',
                        border: `1px solid ${isPaid ? '#bbf7d0' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                          {item.bulan}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          Rp 60.000
                        </div>
                      </div>

                      <div style={{ marginTop: '14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: isPaid ? '#dcfce7' : '#fee2e2',
                          color: isPaid ? '#15803d' : '#dc2626'
                        }}>
                          {isPaid ? '✓ Lunas' : 'Belum Lunas'}
                        </span>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '4px' }}>
                          {isPaid ? (['Januari 2026', 'Februari 2026', 'Maret 2026'].includes(item.bulan) ? item.tgl : 'Telah Dibayar') : `Jatuh tempo ${item.tgl}`}
                        </div>

                        {!isPaid && (
                          <button
                            onClick={() => {
                              setSelectedMonth(item.bulan);
                              setShowPaymentModal(true);
                            }}
                            style={{
                              marginTop: '8px',
                              width: '100%',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              background: '#3B7594',
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Bayar Bulan Ini →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
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

      {/* ================= MODAL 2: BAYAR IURAN LENGKAP (ONLINE TF / QRIS & OFFLINE) ================= */}
      {showPaymentModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '580px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Pembayaran Iuran Warga RT 007
                </h3>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Wajib RT 007: Kebersihan & Keamanan Satpam
                </span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                style={{ padding: '6px', borderRadius: '8px', background: '#f1f5f9', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Pilih Bulan Tagihan */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Periode Iuran yang Dibayar:
                </span>
                <div style={{ marginTop: '4px' }}>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: '#ffffff'
                    }}
                  >
                    {unpaidMonthsList.map(item => (
                      <option key={item.bulan} value={item.bulan}>
                        {item.bulan} (Rp 60.000)
                      </option>
                    ))}
                    {unpaidMonthsList.length > 1 && (
                      <option value="Semua Tagihan">
                        🌟 Lunaskan Semua ({unpaidMonthsList.length} Bulan) - Rp {(unpaidMonthsList.length * 60000).toLocaleString('id-ID')}
                      </option>
                    )}
                  </select>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Total Tagihan:</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#16a34a' }}>
                  Rp {(selectedMonth === 'Semua Tagihan' ? (unpaidMonthsList.length * 60000) : 60000).toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Tab Pilihan Metode: QRIS vs Transfer vs Offline */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>
                Pilih Jalur & Metode Pembayaran:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {/* Tab 1: QRIS */}
                <div
                  onClick={() => setSelectedPaymentMethod('qris')}
                  style={{
                    border: selectedPaymentMethod === 'qris' ? '2px solid #3B7594' : '1px solid #cbd5e1',
                    background: selectedPaymentMethod === 'qris' ? '#f0f9ff' : '#ffffff',
                    borderRadius: '10px',
                    padding: '12px 6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <QrCode size={22} color={selectedPaymentMethod === 'qris' ? '#0284c7' : '#64748b'} style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '12px', fontWeight: 800, color: selectedPaymentMethod === 'qris' ? '#0369a1' : '#1e293b' }}>
                    1. QRIS (QR)
                  </div>
                  <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>Web Online</div>
                </div>

                {/* Tab 2: Transfer Bank */}
                <div
                  onClick={() => setSelectedPaymentMethod('transfer')}
                  style={{
                    border: selectedPaymentMethod === 'transfer' ? '2px solid #3B7594' : '1px solid #cbd5e1',
                    background: selectedPaymentMethod === 'transfer' ? '#f0f9ff' : '#ffffff',
                    borderRadius: '10px',
                    padding: '12px 6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <CreditCard size={22} color={selectedPaymentMethod === 'transfer' ? '#0284c7' : '#64748b'} style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '12px', fontWeight: 800, color: selectedPaymentMethod === 'transfer' ? '#0369a1' : '#1e293b' }}>
                    2. Transfer (TF)
                  </div>
                  <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>Mandiri / BCA</div>
                </div>

                {/* Tab 3: Offline / Tunai */}
                <div
                  onClick={() => setSelectedPaymentMethod('tunai')}
                  style={{
                    border: selectedPaymentMethod === 'tunai' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                    background: selectedPaymentMethod === 'tunai' ? '#fff7ed' : '#ffffff',
                    borderRadius: '10px',
                    padding: '12px 6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Users size={22} color={selectedPaymentMethod === 'tunai' ? '#ea580c' : '#64748b'} style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '12px', fontWeight: 800, color: selectedPaymentMethod === 'tunai' ? '#9a3412' : '#1e293b' }}>
                    3. Offline Tunai
                  </div>
                  <div style={{ fontSize: '10px', color: '#ea580c', fontWeight: 600 }}>Ketemu Pengurus</div>
                </div>
              </div>
            </div>

            {/* DETAIL METODE 1: QRIS */}
            {selectedPaymentMethod === 'qris' && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '18px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                  SCAN KODE QRIS RESMI KAS RT 007 TELUK PUCUNG
                </div>

                {/* Simulated QR Code Box */}
                <div style={{
                  width: '170px',
                  height: '170px',
                  margin: '0 auto 10px',
                  background: '#ffffff',
                  border: '2px solid #0f172a',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                }}>
                  <QrCode size={140} color="#0f172a" />
                  <span style={{ position: 'absolute', bottom: '6px', fontSize: '9px', fontWeight: 900, background: '#f5c443', color: '#1a3848', padding: '2px 6px', borderRadius: '4px' }}>
                    QRIS KAS RT 007
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                  NMID: <strong>ID102026007030</strong> • Nominal: <strong style={{ color: '#15803d' }}>Rp 60.000</strong>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', background: '#e0f2fe', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>
                  Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau e-Wallet (GoPay, OVO, Dana) lalu scan QR di atas.
                </div>
              </div>
            )}

            {/* DETAIL METODE 2: TRANSFER BANK (TF) */}
            {selectedPaymentMethod === 'transfer' && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '18px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  Pilih Bank Tujuan Transfer:
                </label>

                {/* Bank Toggle */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedBank('mandiri')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      border: selectedBank === 'mandiri' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: selectedBank === 'mandiri' ? '#e0f2fe' : '#ffffff',
                      color: selectedBank === 'mandiri' ? '#0369a1' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Bank Mandiri
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBank('bca')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      border: selectedBank === 'bca' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: selectedBank === 'bca' ? '#e0f2fe' : '#ffffff',
                      color: selectedBank === 'bca' ? '#0369a1' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Bank BCA
                  </button>
                </div>

                {/* Rekening Card */}
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {selectedBank === 'mandiri' ? 'Bank Mandiri Kantor Cabang Bekasi' : 'Bank BCA KCU Bekasi'}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', letterSpacing: '1px', marginTop: '2px' }}>
                        {selectedBank === 'mandiri' ? '156-00-128938-7' : '522-091-8842'}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#3B7594', marginTop: '2px' }}>
                        a.n. KAS RT 007 RW 030 TELUK PUCUNG
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyAccount(selectedBank === 'mandiri' ? '156001289387' : '5220918842')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: copiedBank ? '#dcfce7' : '#f1f5f9',
                        color: copiedBank ? '#15803d' : '#334155',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedBank ? <Check size={14} /> : <Copy size={14} />}
                      {copiedBank ? 'Tersalin!' : 'Salin Rek'}
                    </button>
                  </div>
                </div>

                {/* Upload Bukti TF */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Lampirkan Bukti Transfer (Opsional):
                  </label>
                  <div style={{
                    border: '1px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                      <UploadCloud size={18} color="#0284c7" />
                      <span>{transferProof ? '✓ Struk_Transfer.jpg (Terlampir)' : 'Pilih foto struk / tangkapan layar m-banking'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTransferProof('struk_transfer_maret.jpg')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      {transferProof ? 'Ganti' : 'Pilih File'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL METODE 3: OFFLINE / TUNAI KETEMU PENGURUS */}
            {selectedPaymentMethod === 'tunai' && (
              <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', marginBottom: '18px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400e', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🤝 Setor Tunai Langsung ke Pengurus RT 007
                </div>
                <p style={{ fontSize: '12.5px', color: '#78350f', margin: '0 0 12px', lineHeight: 1.5 }}>
                  Anda dapat menyetorkan uang tunai sebesar <strong>Rp 60.000</strong> langsung kepada <strong>Ibu Hj. Endang Suryaningsih (Bendahara RT)</strong> di Jl. Cempaka Blok C1 No. 04.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                    Perkiraan Waktu Kedatangan Setor Tunai:
                  </label>
                  <select
                    value={offlineSchedule}
                    onChange={(e) => setOfflineSchedule(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #fcd34d',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      background: '#ffffff'
                    }}
                  >
                    <option value="Hari ini (16.00 - 18.00 WIB)">Hari ini (16.00 - 18.00 WIB)</option>
                    <option value="Malam ini (19.00 - 20.30 WIB)">Malam ini (19.00 - 20.30 WIB)</option>
                    <option value="Besok pagi (08.00 - 10.00 WIB)">Besok pagi (08.00 - 10.00 WIB)</option>
                    <option value="Saat Piket Pos RT di Akhir Pekan">Saat Piket Pos RT di Akhir Pekan</option>
                  </select>
                </div>

                <div style={{ fontSize: '11.5px', color: '#b45309' }}>
                  💡 Setelah menyetorkan uang tunai, Bendahara akan memberikan cap stempel dan kuitansi tanda terima fisik/digital.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => setShowPaymentModal(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b', cursor: 'pointer' }}
              >
                Batal
              </button>
              
              <button 
                type="button"
                onClick={handleConfirmPayment}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: selectedPaymentMethod === 'tunai' ? '#ea580c' : '#16a34a',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <CheckCircle2 size={18} />
                {selectedPaymentMethod === 'qris' 
                  ? 'Saya Sudah Bayar via QRIS' 
                  : selectedPaymentMethod === 'transfer' 
                    ? 'Konfirmasi Transfer Selesai' 
                    : 'Kirim Pemberitahuan Setor Tunai'}
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

      {/* Footer Portal Warga */}
      <Footer />
    </div>
  );
}
