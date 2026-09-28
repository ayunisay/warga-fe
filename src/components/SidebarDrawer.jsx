import React from 'react';
import { X, ChevronDown, ChevronRight, Home, Users, Wallet, FileText, Settings, UserCheck } from 'lucide-react';

export default function SidebarDrawer({ 
  isOpen, 
  onClose, 
  activeMenu, 
  activeSubMenu, 
  onSelectMenu, 
  onSelectSubMenu 
}) {
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
          {/* 1. Dashboard */}
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

          {/* 2. Data Warga / Kependudukan */}
          <div>
            <div 
              className={`nav-section-title ${activeMenu === 'warga' ? 'active' : ''}`}
              onClick={() => onSelectMenu('warga')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={18} />
                <span>Data Warga / Kependudukan</span>
              </div>
              {activeMenu === 'warga' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

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
          </div>

          {/* 3. Keuangan & Iuran */}
          <div>
            <div 
              className={`nav-section-title ${activeMenu === 'keuangan' ? 'active' : ''}`}
              onClick={() => onSelectMenu('keuangan')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wallet size={18} />
                <span>Keuangan & Iuran</span>
              </div>
              {activeMenu === 'keuangan' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            <ul className="nav-sub-list">
              <li className={`nav-sub-item ${activeMenu === 'keuangan' && activeSubMenu === 'iuran' ? 'active' : ''}`}>
                <button onClick={() => { onSelectSubMenu('keuangan', 'iuran'); onClose(); }}>
                  • Catatan Iuran Warga
                </button>
              </li>
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
          </div>

          {/* 4. Pelayanan Surat / Administrasi */}
          <div>
            <div 
              className={`nav-section-title ${activeMenu === 'surat' ? 'active' : ''}`}
              onClick={() => onSelectMenu('surat')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={18} />
                <span>Pelayanan Surat / Administrasi</span>
              </div>
              {activeMenu === 'surat' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

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
          </div>

          {/* 5. Manajemen Pengguna / User Settings */}
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
        </nav>

        {/* User Footer Profile */}
        <div className="sidebar-user-footer">
          <div className="user-avatar-circle" style={{ width: '38px', height: '38px', background: '#2c5c75' }}>
            <UserCheck size={18} />
          </div>
          <div className="info">
            <h4>H. Bambang Sugiarto</h4>
            <p>Ketua RT 007 / RW 030</p>
          </div>
        </div>
      </aside>
    </>
  );
}
