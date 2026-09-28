import React, { useState } from 'react';
import Header from './components/Header';
import SidebarDrawer from './components/SidebarDrawer';
import Footer from './components/Footer';
import DashboardView from './components/views/DashboardView';
import DataWargaView from './components/views/DataWargaView';
import KeuanganView from './components/views/KeuanganView';
import SuratView from './components/views/SuratView';
import SettingsView from './components/views/SettingsView';
import SuratPrintModal from './components/modals/SuratPrintModal';
import TambahWargaModal from './components/modals/TambahWargaModal';
import { INITIAL_CITIZENS, INITIAL_SURAT, INITIAL_TRANSACTIONS, INITIAL_USERS } from './data/mockData';
import './index.css';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState('master');
  
  // App States
  const [citizens, setCitizens] = useState(INITIAL_CITIZENS);
  const [suratList, setSuratList] = useState(INITIAL_SURAT);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserRole, setCurrentUserRole] = useState('Ketua RT (Superadmin)');
  
  // Modals
  const [selectedSuratForPrint, setSelectedSuratForPrint] = useState(null);
  const [isAddCitizenModalOpen, setIsAddCitizenModalOpen] = useState(false);

  // Navigation title mapper
  const getPageTitle = () => {
    switch (activeMenu) {
      case 'dashboard':
        return 'DASHBOARD';
      case 'warga':
        return 'DATA WARGA';
      case 'keuangan':
        return 'KEUANGAN & IURAN';
      case 'surat':
        return 'PERMOHONAN SURAT';
      case 'settings':
        return 'MANAJEMEN PENGGUNA';
      default:
        return 'DASHBOARD';
    }
  };

  const handleSelectMenu = (menu) => {
    setActiveMenu(menu);
    if (menu === 'warga') setActiveSubMenu('master');
    if (menu === 'keuangan') setActiveSubMenu('rekap');
    if (menu === 'surat') setActiveSubMenu('masuk');
  };

  const handleSelectSubMenu = (menu, subMenu) => {
    setActiveMenu(menu);
    setActiveSubMenu(subMenu);
  };

  const handleApproveSurat = (suratId) => {
    setSuratList(prev => prev.map(s => {
      if (s.id === suratId) {
        return { ...s, status: 'Disetujui' };
      }
      return s;
    }));
    if (selectedSuratForPrint && selectedSuratForPrint.id === suratId) {
      setSelectedSuratForPrint(prev => ({ ...prev, status: 'Disetujui' }));
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
      />

      {/* 3. Main Content Body */}
      <main className="main-wrapper">
        {/* Top Header */}
        <Header 
          title={getPageTitle()}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          currentUserRole={currentUserRole}
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
            />
          )}

          {activeMenu === 'surat' && (
            <SuratView 
              suratList={suratList}
              activeSubMenu={activeSubMenu}
              onSelectSubMenu={handleSelectSubMenu}
              onOpenSuratModal={(surat) => setSelectedSuratForPrint(surat)}
              onApproveSurat={handleApproveSurat}
              onAddSurat={handleAddSurat}
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
