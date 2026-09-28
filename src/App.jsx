import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarDrawer from './components/SidebarDrawer';
import Footer from './components/Footer';
import DashboardView from './components/views/DashboardView';
import DataWargaView from './components/views/DataWargaView';
import KeuanganView from './components/views/KeuanganView';
import SuratView from './components/views/SuratView';
import SettingsView from './components/views/SettingsView';
import InformasiView from './components/views/InformasiView';
import WargaPortalView from './components/views/WargaPortalView';
import LoginPage from './components/auth/LoginPage';
import SuratPrintModal from './components/modals/SuratPrintModal';
import { INITIAL_CITIZENS, INITIAL_SURAT, INITIAL_TRANSACTIONS, INITIAL_USERS, INITIAL_ANNOUNCEMENTS, INITIAL_TRANSFER_VERIFICATIONS } from './data/mockData';
import './index.css';

export default function App() {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState(null); // null = tampil halaman login

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState('master');
  
  // App States
  const [citizens, setCitizens] = useState(INITIAL_CITIZENS);
  const [suratList, setSuratList] = useState(INITIAL_SURAT);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [transferVerifications, setTransferVerifications] = useState(INITIAL_TRANSFER_VERIFICATIONS);
  const [currentUserRole, setCurrentUserRole] = useState('Ketua RT');

  // Sinkronisasi currentUserRole dengan currentUser
  useEffect(() => {
    if (currentUser?.role) {
      setCurrentUserRole(currentUser.role);
    }
  }, [currentUser]);

  // Bila role diubah ke Bendahara dan menu sedang di surat, alihkan ke dashboard
  // Bila role bukan Bendahara (Ketua RT / Sekretaris) dan subMenu verifikasi, alihkan ke rekap
  useEffect(() => {
    if (currentUserRole === 'Bendahara' && activeMenu === 'surat') {
      setActiveMenu('dashboard');
    }
    if (currentUserRole !== 'Bendahara' && activeMenu === 'keuangan' && activeSubMenu === 'verifikasi') {
      setActiveSubMenu('rekap');
    }
  }, [currentUserRole, activeMenu, activeSubMenu]);
  
  // Modals
  const [selectedSuratForPrint, setSelectedSuratForPrint] = useState(null);
  const [isAddCitizenModalOpen, setIsAddCitizenModalOpen] = useState(false);

  // Navigation title mapper
  const getPageTitle = () => {
    switch (activeMenu) {
      case 'dashboard':
        return 'DASHBOARD PENGURUS';
      case 'warga':
        return 'DATA WARGA';
      case 'keuangan':
        return 'KEUANGAN & IURAN';
      case 'surat':
        return 'PERMOHONAN SURAT';
      case 'informasi':
        return 'PAPAN INFORMASI & AGENDA RT';
      case 'settings':
        return 'MANAJEMEN PENGGUNA';
      default:
        return 'DASHBOARD';
    }
  };

  const handleSelectMenu = (menu) => {
    if (currentUserRole === 'Bendahara' && menu === 'surat') {
      return;
    }
    setActiveMenu(menu);
    if (menu === 'warga') setActiveSubMenu('master');
    if (menu === 'keuangan') setActiveSubMenu('rekap');
    if (menu === 'surat') setActiveSubMenu('masuk');
  };

  const handleSelectSubMenu = (menu, subMenu) => {
    if (currentUserRole === 'Bendahara' && menu === 'surat') {
      return;
    }
    // Ketua RT dan Sekretaris tidak diberi akses ke verifikasi pembayaran transfer
    if (currentUserRole !== 'Bendahara' && menu === 'keuangan' && subMenu === 'verifikasi') {
      return;
    }
    setActiveMenu(menu);
    setActiveSubMenu(subMenu);
  };

  const handleApproveSurat = (suratId) => {
    setSuratList(prev => prev.map(s => {
      if (s.id === suratId) {
        return { ...s, status: 'Disetujui', catatanPenolakan: undefined };
      }
      return s;
    }));
    if (selectedSuratForPrint && selectedSuratForPrint.id === suratId) {
      setSelectedSuratForPrint(prev => ({ ...prev, status: 'Disetujui', catatanPenolakan: undefined }));
    }
  };

  const handleRejectSurat = (suratId, catatanPenolakan) => {
    const reason = catatanPenolakan || 'Permohonan surat belum memenuhi persyaratan administratif RT 007.';
    setSuratList(prev => prev.map(s => {
      if (s.id === suratId) {
        return { ...s, status: 'Ditolak', catatanPenolakan: reason };
      }
      return s;
    }));
    if (selectedSuratForPrint && selectedSuratForPrint.id === suratId) {
      setSelectedSuratForPrint(prev => ({ ...prev, status: 'Ditolak', catatanPenolakan: reason }));
    }
  };

  const handleAddCitizen = (newCitizen) => {
    setCitizens(prev => [newCitizen, ...prev]);
  };

  const handleDeleteCitizen = (citizenId) => {
    if (window.confirm('Yakin ingin menghapus data warga ini?')) {
      setCitizens(prev => prev.filter(c => c.id !== citizenId));
    }
  };

  const handleAddTransaction = (newTrx) => {
    setTransactions(prev => [newTrx, ...prev]);
  };

  const handleToggleIuran = (citizenId) => {
    setCitizens(prev => prev.map(c => {
      if (c.id === citizenId) {
        return {
          ...c,
          statusIuran: c.statusIuran === 'Lunas' ? 'Menunggak' : 'Lunas'
        };
      }
      return c;
    }));
  };

  const handleAddSurat = (newSurat) => {
    setSuratList(prev => [newSurat, ...prev]);
  };

  const handleUpdateUser = (userId, updatedData) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updatedData };
      }
      return u;
    }));
  };

  const handleAddUser = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleCitizenPayIuran = (citizenId, nominal, citizenNama, paymentDetails = {}) => {
    // Jika via transfer bank, tambahkan ke antrean verifikasi transfer Bendahara
    if (paymentDetails.metode === 'transfer') {
      const newVerification = {
        id: `TRF-${Date.now().toString().slice(-6)}`,
        citizenId: citizenId || 3,
        namaWarga: citizenNama || 'Andi Pratama',
        blok: paymentDetails.blok || 'B2',
        noRumah: paymentDetails.noRumah || '14',
        periode: paymentDetails.periode || 'Maret 2026',
        nominal: nominal || 60000,
        metode: `Transfer Bank ${paymentDetails.bank === 'mandiri' ? 'Mandiri' : 'BCA'}`,
        rekeningTujuan: paymentDetails.bank === 'mandiri' ? 'Bank Mandiri 156-00-1928374-1 (Kas RT 007)' : 'Bank BCA 731-098-7654 (Kas RT 007)',
        tanggalTransfer: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
        noReferensi: `TRF-${Date.now().toString().slice(-5)}`,
        buktiUrl: paymentDetails.buktiTransfer || 'struk_transfer_warga.jpg',
        status: 'Menunggu Verifikasi',
        catatanWarga: paymentDetails.catatan || 'Pembayaran transfer diunggah warga dari Portal Warga',
        catatanBendahara: ''
      };
      setTransferVerifications(prev => [newVerification, ...prev]);
    } else {
      // Pembayaran langsung (QRIS atau Tunai offline terkonfirmasi)
      setCitizens(prev => prev.map(c => {
        if (c.id === citizenId || c.nama === citizenNama) {
          return { ...c, statusIuran: 'Lunas' };
        }
        return c;
      }));

      if (currentUser && (currentUser.id === citizenId || currentUser.nama === citizenNama)) {
        setCurrentUser(prev => ({ ...prev, statusIuran: 'Lunas' }));
      }

      const newTrx = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        kategori: 'Pemasukan',
        sumber: `Iuran Warga - ${citizenNama}`,
        keterangan: `Iuran (${paymentDetails.periode || 'Maret 2026'}) via ${paymentDetails.metode === 'tunai' ? 'Setor Tunai' : 'QRIS Digital'}`,
        nominal: nominal || 60000,
        petugas: paymentDetails.metode === 'tunai' ? 'Hj. Endang (Setor Tunai)' : 'Sistem QRIS RT 007'
      };
      setTransactions(prev => [newTrx, ...prev]);
    }
  };

  const handleApproveTransfer = (verificationId, catatanBendahara = '') => {
    let verifiedItem = null;
    setTransferVerifications(prev => prev.map(item => {
      if (item.id === verificationId) {
        verifiedItem = item;
        return {
          ...item,
          status: 'Terverifikasi',
          catatanBendahara: catatanBendahara || 'Pembayaran valid & telah masuk mutasi kas RT 007'
        };
      }
      return item;
    }));

    if (verifiedItem) {
      // 1. Update status citizen to Lunas
      setCitizens(prev => prev.map(c => {
        if (c.id === verifiedItem.citizenId || c.nama === verifiedItem.namaWarga) {
          return { ...c, statusIuran: 'Lunas' };
        }
        return c;
      }));

      // 2. Add into kas transactions
      const newTrx = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        kategori: 'Pemasukan',
        sumber: `Iuran Warga - ${verifiedItem.namaWarga}`,
        keterangan: `Verifikasi transfer iuran ${verifiedItem.periode} (${verifiedItem.metode})`,
        nominal: verifiedItem.nominal,
        petugas: 'Hj. Endang (Bendahara)'
      };
      setTransactions(prev => [newTrx, ...prev]);
    }
  };

  const handleRejectTransfer = (verificationId, catatanPenolakan = '') => {
    setTransferVerifications(prev => prev.map(item => {
      if (item.id === verificationId) {
        return {
          ...item,
          status: 'Ditolak',
          catatanBendahara: catatanPenolakan || 'Bukti transfer tidak valid atau dana belum masuk rekening RT.'
        };
      }
      return item;
    }));
  };

  const handleAddAnnouncement = (newAnn) => {
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const handleUpdateAnnouncement = (id, updatedData) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleAnnouncement = (id) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === 'Aktif' ? 'Draft' : 'Aktif' };
      }
      return a;
    }));
  };

  // Jika belum login, tampilkan Halaman Login
  if (!currentUser) {
    return (
      <LoginPage 
        onLogin={(user) => {
          setCurrentUser(user);
          setCurrentUserRole(user.role);
        }} 
      />
    );
  }

  // Jika login sebagai Warga, arahkan ke Portal Layanan Warga RT 007
  if (currentUser.role === 'Warga') {
    return (
      <>
        <WargaPortalView 
          citizen={currentUser}
          suratList={suratList}
          announcements={announcements}
          transferVerifications={transferVerifications}
          onAddSurat={handleAddSurat}
          onOpenSuratModal={(surat) => setSelectedSuratForPrint(surat)}
          onPayIuran={handleCitizenPayIuran}
          onLogout={() => setCurrentUser(null)}
        />

        {selectedSuratForPrint && (
          <SuratPrintModal 
            surat={selectedSuratForPrint}
            onClose={() => setSelectedSuratForPrint(null)}
            onApprove={handleApproveSurat}
            onReject={handleRejectSurat}
          />
        )}
      </>
    );
  }

  // Tampilan Pengurus RT (Ketua RT, Sekretaris, Bendahara)
  return (
    <div className="app-container">
      {/* 1. Slide-out Navigation Drawer (Image 2) */}
      <SidebarDrawer 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeMenu={activeMenu}
        activeSubMenu={activeSubMenu}
        onSelectMenu={handleSelectMenu}
        onSelectSubMenu={handleSelectSubMenu}
        currentUserRole={currentUserRole}
        currentUserName={currentUser.nama}
        onLogout={() => setCurrentUser(null)}
      />

      {/* 3. Main Content Body */}
      <main className="main-wrapper">
        {/* Top Header */}
        <Header 
          title={getPageTitle()}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          currentUserRole={currentUserRole}
          onLogout={() => setCurrentUser(null)}
        />

        {/* Page Content based on active navigation */}
        <div className="page-body">
          {activeMenu === 'dashboard' && (
            <DashboardView 
              citizens={citizens}
              suratList={suratList}
              transactions={transactions}
              onNavigate={handleSelectSubMenu}
              onOpenSuratModal={(surat) => setSelectedSuratForPrint(surat)}
              onApproveSurat={handleApproveSurat}
              currentUserRole={currentUserRole}
            />
          )}

          {activeMenu === 'warga' && (
            <DataWargaView 
              citizens={citizens}
              activeSubMenu={activeSubMenu}
              onSelectSubMenu={handleSelectSubMenu}
              onOpenAddModal={() => setIsAddCitizenModalOpen(true)}
              onDeleteCitizen={handleDeleteCitizen}
            />
          )}

          {activeMenu === 'keuangan' && (
            <KeuanganView 
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              activeSubMenu={activeSubMenu}
              onSelectSubMenu={handleSelectSubMenu}
              citizens={citizens}
              onToggleIuran={handleToggleIuran}
              transferVerifications={transferVerifications}
              onApproveTransfer={handleApproveTransfer}
              onRejectTransfer={handleRejectTransfer}
              currentUserRole={currentUserRole}
            />
          )}

          {activeMenu === 'surat' && currentUserRole !== 'Bendahara' && (
            <SuratView 
              suratList={suratList}
              activeSubMenu={activeSubMenu}
              onSelectSubMenu={handleSelectSubMenu}
              onOpenSuratModal={(surat) => setSelectedSuratForPrint(surat)}
              onApproveSurat={handleApproveSurat}
              onRejectSurat={handleRejectSurat}
              onAddSurat={handleAddSurat}
              currentUserRole={currentUserRole}
            />
          )}

          {activeMenu === 'informasi' && (
            <InformasiView 
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onUpdateAnnouncement={handleUpdateAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onToggleAnnouncement={handleToggleAnnouncement}
              currentUserRole={currentUserRole}
            />
          )}

          {activeMenu === 'settings' && (
            <SettingsView 
              users={users}
              currentUserRole={currentUserRole}
              onChangeCurrentRole={setCurrentUserRole}
              onUpdateUser={handleUpdateUser}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>

        {/* Footer (matches wireframe footer bar) */}
        <Footer />
      </main>

      {/* Modals */}
      {selectedSuratForPrint && (
        <SuratPrintModal 
          surat={selectedSuratForPrint}
          onClose={() => setSelectedSuratForPrint(null)}
          onApprove={handleApproveSurat}
          onReject={handleRejectSurat}
        />
      )}

      {isAddCitizenModalOpen && (
        <TambahWargaModal 
          isOpen={isAddCitizenModalOpen}
          onClose={() => setIsAddCitizenModalOpen(false)}
          onSave={handleAddCitizen}
        />
      )}
    </div>
  );
}
