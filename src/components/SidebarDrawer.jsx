import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Home, Users, Wallet, FileText, Settings, UserCheck, Bell, LogOut, History } from 'lucide-react';

export default function SidebarDrawer({ 
  isOpen, 
  onClose, 
  activeMenu, 
  activeSubMenu, 
  onSelectMenu, 
  onSelectSubMenu,
  currentUserRole = 'Ketua RT',
  currentUserName = 'H. Bambang Sugiarto',
  onLogout
}) {
  // State dropdown terbuka / tertutup per kategori menu
  const [openDropdowns, setOpenDropdowns] = useState({
    warga: false,
    keuangan: false,
    surat: false,
  });

  // Otomatis buka dropdown jika menu tersebut sedang aktif
  useEffect(() => {
    if (activeMenu === 'warga' || activeMenu === 'keuangan' || activeMenu === 'surat') {
      setOpenDropdowns(prev => ({
        ...prev,
        [activeMenu]: true
      }));
    }
  }, [activeMenu]);

  // Handler toggle dropdown saat judul diklik
  const handleToggle = (menuKey) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <aside className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo-s">S</div>
            <div className="brand-text">
              <h2>SI-WARGA 07</h2>
              <span>RT 007 / RW 030 Teluk Pucung</span>
            </div>
          </div>
          <button 
            className="close-drawer-btn" 
            onClick={onClose}
            title="Tutup Menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* 1. Dashboard (Single menu tanpa dropdown) */}
          <div 
            className={`nav-section-title ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              onSelectMenu('dashboard');
              onClose();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Home size={18} />
              <span>Dashboard</span>
            </div>
          </div>

          {/* 2. Data Warga / Kependudukan (Dropdown Accordion) */}
          <div>
            <div 
              className={`nav-section-title ${activeMenu === 'warga' ? 'active' : ''}`}
              onClick={() => handleToggle('warga')}
              title="Klik untuk buka / tutup sub-menu Data Warga"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={18} />
                <span>Data Warga / Kependudukan</span>
              </div>
              <ChevronRight 
                size={16} 
                style={{ 
                  transition: 'transform 0.25s ease',
                  transform: openDropdowns.warga ? 'rotate(90deg)' : 'rotate(0deg)'
                }} 
              />
            </div>

            {openDropdowns.warga && (
              <ul className="nav-sub-list">
                <li className={`nav-sub-item ${activeMenu === 'warga' && activeSubMenu === 'master' ? 'active' : ''}`}>
                  <button onClick={() => { onSelectSubMenu('warga', 'master'); onClose(); }}>
                    • Data Master Penduduk
                  </button>
                </li>
                <li className={`nav-sub-item ${activeMenu === 'warga' && activeSubMenu === 'sementara' ? 'active' : ''}`}>
                  <button onClick={() => { onSelectSubMenu('warga', 'sementara'); onClose(); }}>
                    • Penduduk Sementara / Domisili
                  </button>
                </li>
                <li className={`nav-sub-item ${activeMenu === 'warga' && activeSubMenu === 'mutasi' ? 'active' : ''}`}>
                  <button onClick={() => { onSelectSubMenu('warga', 'mutasi'); onClose(); }}>
                    • Mutasi Kependudukan (Kelahiran, Kematian, Pindah/Datang)
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* 3. Keuangan & Iuran (Dropdown Accordion) */}
          <div>
            <div 
              className={`nav-section-title ${activeMenu === 'keuangan' ? 'active' : ''}`}
              onClick={() => handleToggle('keuangan')}
              title="Klik untuk buka / tutup sub-menu Keuangan"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wallet size={18} />
                <span>Keuangan & Iuran</span>
              </div>
              <ChevronRight 
                size={16} 
                style={{ 
                  transition: 'transform 0.25s ease',
                  transform: openDropdowns.keuangan ? 'rotate(90deg)' : 'rotate(0deg)'
                }} 
              />
            </div>

            {openDropdowns.keuangan && (
              <ul className="nav-sub-list">
                <li className={`nav-sub-item ${activeMenu === 'keuangan' && activeSubMenu === 'iuran' ? 'active' : ''}`}>
                  <button onClick={() => { onSelectSubMenu('keuangan', 'iuran'); onClose(); }}>
                    • Catatan Iuran Warga
                  </button>
                </li>
                {currentUserRole === 'Bendahara' && (
                  <li className={`nav-sub-item ${activeMenu === 'keuangan' && activeSubMenu === 'verifikasi' ? 'active' : ''}`}>
                    <button onClick={() => { onSelectSubMenu('keuangan', 'verifikasi'); onClose(); }}>
                      • Verifikasi Bukti Transfer
                    </button>
                  </li>
                )}
                <li className={`nav-sub-item ${activeMenu === 'keuangan' && activeSubMenu === 'rekap' ? 'active' : ''}`}>
                  <button onClick={() => { onSelectSubMenu('keuangan', 'rekap'); onClose(); }}>
                    • Rekapitulasi Kas Masuk & Keluar
                  </button>
                </li>
                <li className={`nav-sub-item ${activeMenu === 'keuangan' && activeSubMenu === 'laporan' ? 'active' : ''}`}>
                  <button onClick={() => { onSelectSubMenu('keuangan', 'laporan'); onClose(); }}>
                    • Laporan Keuangan
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* 4. Pelayanan Surat / Administrasi (Dropdown Accordion - Khusus Ketua RT & Sekretaris) */}
          {currentUserRole !== 'Bendahara' && (
            <div>
              <div 
                className={`nav-section-title ${activeMenu === 'surat' ? 'active' : ''}`}
                onClick={() => handleToggle('surat')}
                title="Klik untuk buka / tutup sub-menu Pelayanan Surat"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} />
                  <span>Pelayanan Surat / Administrasi</span>
                </div>
                <ChevronRight 
                  size={16} 
                  style={{ 
                    transition: 'transform 0.25s ease',
                    transform: openDropdowns.surat ? 'rotate(90deg)' : 'rotate(0deg)'
                  }} 
                />
              </div>

              {openDropdowns.surat && (
                <ul className="nav-sub-list">
                  <li className={`nav-sub-item ${activeMenu === 'surat' && activeSubMenu === 'masuk' ? 'active' : ''}`}>
                    <button onClick={() => { onSelectSubMenu('surat', 'masuk'); onClose(); }}>
                      • Permohonan Surat Masuk & Verifikasi
                    </button>
                  </li>
                  <li className={`nav-sub-item ${activeMenu === 'surat' && activeSubMenu === 'buat' ? 'active' : ''}`}>
                    <button onClick={() => { onSelectSubMenu('surat', 'buat'); onClose(); }}>
                      • Pembuatan & Cetak/Export PDF Surat Otomatis
                    </button>
                  </li>
                  <li className={`nav-sub-item ${activeMenu === 'surat' && activeSubMenu === 'arsip' ? 'active' : ''}`}>
                    <button onClick={() => { onSelectSubMenu('surat', 'arsip'); onClose(); }}>
                      • Arsip / Riwayat Surat Keluar
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* 5. Papan Informasi & Pengumuman Warga */}
          <div 
            className={`nav-section-title ${activeMenu === 'informasi' ? 'active' : ''}`}
            onClick={() => {
              onSelectMenu('informasi');
              onClose();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={18} />
              <span>Papan Informasi & Pengumuman</span>
            </div>
          </div>

          {/* 6. Manajemen Pengguna / User Settings */}
          <div 
            className={`nav-section-title ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => {
              onSelectMenu('settings');
              onClose();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={18} />
              <span>Manajemen Pengguna / User Settings</span>
            </div>
          </div>

          {/* 7. Audit Trail & Log Aktivitas (Khusus Pengurus RT) */}
          {currentUserRole !== 'Warga' && (
            <div 
              className={`nav-section-title ${activeMenu === 'audit' ? 'active' : ''}`}
              onClick={() => {
                onSelectMenu('audit');
                onClose();
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <History size={18} />
                <span>Audit Trail & Log Aktivitas</span>
              </div>
            </div>
          )}
        </nav>

        {/* Tombol Keluar di atas dan di luar kotak profil footer */}
        {onLogout && (
          <div style={{ padding: '0 16px 12px' }}>
            <button
              onClick={() => { onClose(); onLogout(); }}
              title="Keluar"
              style={{
                width: '100%',
                background: '#fee2e2',
                color: '#dc2626',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: '1px solid #fecaca',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <LogOut size={14} /> Keluar
            </button>
          </div>
        )}

        {/* User Footer Profile (Kotak Biru Tua) */}
        <div className="sidebar-user-footer">
          <div className="user-avatar-circle" style={{ width: '38px', height: '38px', background: '#2c5c75' }}>
            <UserCheck size={18} />
          </div>
          <div className="info">
            <h4 style={{ fontSize: '13.5px', margin: 0 }}>{currentUserName}</h4>
            <p style={{ fontSize: '11px', margin: 0 }}>{currentUserRole} RT 007</p>
          </div>
        </div>
      </aside>
    </>
  );
}
