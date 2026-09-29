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
import AuditLogView from './components/views/AuditLogView';
import LoginPage from './components/auth/LoginPage';
import SuratPrintModal from './components/modals/SuratPrintModal';
import PublicSuratVerifyView from './components/views/PublicSuratVerifyView';
import { INITIAL_CITIZENS, INITIAL_SURAT, INITIAL_TRANSACTIONS, INITIAL_USERS, INITIAL_ANNOUNCEMENTS, INITIAL_TRANSFER_VERIFICATIONS } from './data/mockData';
import { INITIAL_AUDIT_LOGS } from './data/auditLogData';
import api from './services/api';
import './index.css';

export default function App() {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState(null); // null = tampil halaman login

  // Public QR Code Surat Verification Token
  const [publicVerifyToken, setPublicVerifyToken] = useState(null);

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
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [currentUserRole, setCurrentUserRole] = useState('Ketua RT');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Check URL query parameters for public QR verification link (?verify=TOKEN or /verifikasi-surat/TOKEN)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyParam = params.get('verify');
    if (verifyParam) {
      setPublicVerifyToken(verifyParam);
    } else {
      const path = window.location.pathname;
      if (path.includes('/verifikasi-surat/')) {
        const parts = path.split('/verifikasi-surat/');
        if (parts[1]) {
          setPublicVerifyToken(parts[1]);
        }
      }
    }
  }, []);

  // Sinkronisasi data awal dari PostgreSQL backend REST API
  const refreshData = async () => {
    try {
      const [citizensRes, suratRes, trxRes, usersRes, annRes, trfRes] = await Promise.allSettled([
        api.citizens.getAll(),
        api.surat.getAll(),
        api.transactions.getAll(),
        api.users.getAll(),
        api.announcements.getAll(),
        api.transfers.getAll(),
      ]);

      if (citizensRes.status === 'fulfilled' && citizensRes.value?.data) {
        setCitizens(citizensRes.value.data);
        setIsBackendConnected(true);
      }
      if (suratRes.status === 'fulfilled' && suratRes.value?.data) {
        setSuratList(suratRes.value.data);
      }
      if (trxRes.status === 'fulfilled' && trxRes.value?.data) {
        setTransactions(trxRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value?.data) {
        setUsers(usersRes.value.data);
      }
      if (annRes.status === 'fulfilled' && annRes.value?.data) {
        setAnnouncements(annRes.value.data);
      }
      if (trfRes.status === 'fulfilled' && trfRes.value?.data) {
        setTransferVerifications(trfRes.value.data);
      }
    } catch (err) {
      console.warn('API error, using mock fallback:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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
  const [editingCitizen, setEditingCitizen] = useState(null);

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
      case 'audit':
        return 'AUDIT TRAIL & LOG AKTIVITAS';
      default:
        return 'DASHBOARD';
    }
  };

  // Global Activity Audit Logger
  const addAuditLog = (actionType, module, description, target, details = null) => {
    const newLog = {
      id: `LOG-2026-${String(Date.now()).slice(-4)}`,
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
      relativeTime: 'Baru saja',
      actorName: currentUser?.name || (currentUserRole === 'Ketua RT' ? 'H. Bambang' : currentUserRole === 'Sekretaris' ? 'Ahmad Fauzi' : currentUserRole === 'Bendahara' ? 'Hj. Endang' : 'Warga RT 007'),
      actorRole: currentUserRole,
      actionType,
      module,
      description,
      target,
      ipAddress: '192.168.1.15',
      device: 'Desktop Browser (Active Session)',
      status: 'SUCCESS',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
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

  const handleApproveSurat = async (suratId) => {
    setSuratList(prev => prev.map(s => {
      if (s.id === suratId) {
        return { ...s, status: 'Disetujui', catatanPenolakan: undefined };
      }
      return s;
    }));
    if (selectedSuratForPrint && selectedSuratForPrint.id === suratId) {
      setSelectedSuratForPrint(prev => ({ ...prev, status: 'Disetujui', catatanPenolakan: undefined }));
    }
    addAuditLog('APPROVE', 'Permohonan Surat', 'Menyetujui permohonan surat pengantar & tanda tangan digital SHA-256', `Surat ${suratId}`);
    try {
      await api.surat.updateStatus(suratId, { status: 'Disetujui' });
    } catch (err) {
      console.warn('API error updating surat status:', err);
    }
  };

  const handleRejectSurat = async (suratId, catatanPenolakan) => {
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
    addAuditLog('REJECT', 'Permohonan Surat', `Menolak permohonan surat pengantar: ${reason}`, `Surat ${suratId}`);
    try {
      await api.surat.updateStatus(suratId, { status: 'Ditolak', catatanPenolakan: reason });
    } catch (err) {
      console.warn('API error rejecting surat:', err);
    }
  };

  const handleAddCitizen = async (newCitizen) => {
    setCitizens(prev => [newCitizen, ...prev]);
    addAuditLog('CREATE', 'Data Warga', `Mendaftarkan data warga baru: ${newCitizen.nama}`, `NIK ${newCitizen.nik}`);
    try {
      const res = await api.citizens.create(newCitizen);
      if (res?.data) {
        setCitizens(prev => prev.map(c => c.nik === newCitizen.nik ? res.data : c));
      }
    } catch (err) {
      console.warn('API error adding citizen:', err);
    }
  };

  const handleUpdateCitizen = async (updatedCitizen) => {
    setCitizens(prev => prev.map(c => c.id === updatedCitizen.id ? updatedCitizen : c));
    addAuditLog('UPDATE', 'Data Warga', `Memperbarui data kependudukan warga: ${updatedCitizen.nama}`, `NIK ${updatedCitizen.nik}`);
    try {
      const res = await api.citizens.update(updatedCitizen.id, updatedCitizen);
      if (res?.data) {
        setCitizens(prev => prev.map(c => c.id === updatedCitizen.id ? res.data : c));
      }
    } catch (err) {
      console.warn('API error updating citizen:', err);
    }
  };

  const handleDeleteCitizen = async (citizenId) => {
    if (window.confirm('Yakin ingin menghapus data warga ini?')) {
      const targetCit = citizens.find(c => c.id === citizenId);
      setCitizens(prev => prev.filter(c => c.id !== citizenId));
      addAuditLog('DELETE', 'Data Warga', `Menghapus data kependudukan warga: ${targetCit?.nama || citizenId}`, `Warga ID ${citizenId}`);
      try {
        await api.citizens.delete(citizenId);
      } catch (err) {
        console.warn('API error deleting citizen:', err);
      }
    }
  };

  const handleAddTransaction = async (newTrx) => {
    setTransactions(prev => [newTrx, ...prev]);
    addAuditLog('CREATE', 'Keuangan & Kas', `Mencatat mutasi kas baru (${newTrx.kategori}): ${newTrx.sumber}`, `${newTrx.id} (Rp ${Number(newTrx.nominal || 0).toLocaleString('id-ID')})`);
    try {
      await api.transactions.create(newTrx);
    } catch (err) {
      console.warn('API error adding transaction:', err);
    }
  };

  const handleToggleIuran = async (citizenId) => {
    const citizen = citizens.find(c => c.id === citizenId);
    const newStatus = citizen?.statusIuran === 'Lunas' ? 'Menunggak' : 'Lunas';
    setCitizens(prev => prev.map(c => {
      if (c.id === citizenId) {
        return {
          ...c,
          statusIuran: newStatus
        };
      }
      return c;
    }));
    addAuditLog('UPDATE', 'Keuangan & Kas', `Mengubah status iuran ${citizen?.nama || ''} menjadi ${newStatus}`, `Warga ID ${citizenId}`);
    try {
      await api.citizens.toggleIuran(citizenId);
    } catch (err) {
      console.warn('API error toggling iuran:', err);
    }
  };

  const handleAddSurat = async (newSurat) => {
    setSuratList(prev => [newSurat, ...prev]);
    try {
      const res = await api.surat.create(newSurat);
      if (res?.data) {
        setSuratList(prev => prev.map(s => s.id === newSurat.id ? res.data : s));
      }
    } catch (err) {
      console.warn('API error adding surat:', err);
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updatedData };
      }
      return u;
    }));
    try {
      await api.users.update(userId, updatedData);
    } catch (err) {
      console.warn('API error updating user:', err);
    }
  };

  const handleAddUser = async (newUser) => {
    setUsers(prev => [...prev, newUser]);
    try {
      const res = await api.users.create(newUser);
      if (res?.data) {
        setUsers(prev => prev.map(u => (u.id === newUser.id || u.email === newUser.email) ? res.data : u));
      }
    } catch (err) {
      console.warn('API error adding user:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      try {
        await api.users.delete(userId);
      } catch (err) {
        console.warn('API error deleting user:', err);
      }
    }
  };

  const handleCitizenPayIuran = async (citizenId, nominal, citizenNama, paymentDetails = {}) => {
    // Jika pembayaran via Payment Gateway Otomatis (QRIS Dinamis / Virtual Account)
    if (paymentDetails.isGateway) {
      setCitizens(prev => prev.map(c => {
        if (c.id === citizenId || c.nama === citizenNama) {
          return { ...c, statusIuran: 'Lunas' };
        }
        return c;
      }));

      if (currentUser && (currentUser.id === citizenId || currentUser.nama === citizenNama)) {
        setCurrentUser(prev => ({ ...prev, statusIuran: 'Lunas' }));
      }

      // Sinkronisasi data terbaru dari database backend (kas, verifikasi transfer, warga)
      await refreshData();
      return;
    }

    // Jika via transfer bank manual, tambahkan ke antrean verifikasi transfer Bendahara
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
      try {
        await api.transfers.create(newVerification);
      } catch (err) {
        console.warn('API error submitting transfer:', err);
      }
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
      try {
        await api.transactions.create(newTrx);
        if (citizenId) {
          await api.citizens.toggleIuran(citizenId);
        }
      } catch (err) {
        console.warn('API error recording transaction:', err);
      }
    }
  };

  const handleApproveTransfer = async (verificationId, catatanBendahara = '') => {
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

      addAuditLog(
        'APPROVE', 
        'Keuangan & Kas', 
        `Verifikasi pembayaran transfer iuran warga ${verifiedItem.namaWarga} (${verifiedItem.periode}) ke kas RT`, 
        `Transfer ${verificationId} (Rp ${Number(verifiedItem.nominal || 0).toLocaleString('id-ID')})`,
        { metode: verifiedItem.metode, noRef: verifiedItem.noReferensi }
      );

      try {
        await api.transfers.verify(verificationId, {
          status: 'Terverifikasi',
          catatanBendahara: catatanBendahara || 'Pembayaran valid & telah masuk mutasi kas RT 007'
        });
      } catch (err) {
        console.warn('API error approving transfer:', err);
      }
    }
  };

  const handleRejectTransfer = async (verificationId, catatanPenolakan = '') => {
    const reason = catatanPenolakan || 'Bukti transfer tidak valid atau dana belum masuk rekening RT.';
    setTransferVerifications(prev => prev.map(item => {
      if (item.id === verificationId) {
        return {
          ...item,
          status: 'Ditolak',
          catatanBendahara: reason
        };
      }
      return item;
    }));

    addAuditLog(
      'REJECT', 
      'Keuangan & Kas', 
      `Menolak bukti pembayaran transfer warga. Catatan: ${reason}`, 
      `Transfer ${verificationId}`
    );

    try {
      await api.transfers.verify(verificationId, {
        status: 'Ditolak',
        catatanBendahara: reason
      });
    } catch (err) {
      console.warn('API error rejecting transfer:', err);
    }
  };

  const handleAddAnnouncement = async (newAnn) => {
    setAnnouncements(prev => [newAnn, ...prev]);
    try {
      const res = await api.announcements.create(newAnn);
      if (res?.data) {
        setAnnouncements(prev => prev.map(a => a.id === newAnn.id ? res.data : a));
      }
    } catch (err) {
      console.warn('API error creating announcement:', err);
    }
  };

  const handleUpdateAnnouncement = (id, updatedData) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const handleDeleteAnnouncement = async (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await api.announcements.delete(id);
    } catch (err) {
      console.warn('API error deleting announcement:', err);
    }
  };

  const handleToggleAnnouncement = (id) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === 'Aktif' ? 'Draft' : 'Aktif' };
      }
      return a;
    }));
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
  };

  // Jika sedang membuka tautan verifikasi keaslian surat publik (dari scan QR code HP)
  if (publicVerifyToken) {
    return (
      <PublicSuratVerifyView 
        token={publicVerifyToken} 
        onBack={() => {
          setPublicVerifyToken(null);
          const url = new URL(window.location.href);
          url.searchParams.delete('verify');
          window.history.replaceState({}, '', url.pathname || '/');
        }} 
      />
    );
  }

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
          onLogout={handleLogout}
        />

        {selectedSuratForPrint && (
          <SuratPrintModal 
            surat={selectedSuratForPrint}
            onClose={() => setSelectedSuratForPrint(null)}
            onApprove={handleApproveSurat}
            onReject={handleRejectSurat}
            onOpenVerify={(token) => setPublicVerifyToken(token)}
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
        onLogout={handleLogout}
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
              onOpenAddModal={() => {
                setEditingCitizen(null);
                setIsAddCitizenModalOpen(true);
              }}
              onEditCitizen={(citizen) => {
                setEditingCitizen(citizen);
                setIsAddCitizenModalOpen(true);
              }}
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
              onOpenVerify={(token) => setPublicVerifyToken(token)}
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

          {activeMenu === 'audit' && currentUserRole !== 'Warga' && (
            <AuditLogView 
              logs={auditLogs}
              currentUserRole={currentUserRole}
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
          onOpenVerify={(token) => setPublicVerifyToken(token)}
        />
      )}

      {isAddCitizenModalOpen && (
        <TambahWargaModal 
          isOpen={isAddCitizenModalOpen}
          citizenToEdit={editingCitizen}
          onClose={() => {
            setIsAddCitizenModalOpen(false);
            setEditingCitizen(null);
          }}
          onSave={editingCitizen ? handleUpdateCitizen : handleAddCitizen}
        />
      )}
    </div>
  );
}
