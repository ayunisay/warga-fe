import React from 'react';
import { Menu, Bell, ShieldCheck, LogOut } from 'lucide-react';

export default function Header({ title, onToggleSidebar, currentUserRole = "Ketua RT", onLogout }) {
  const getGreeting = () => {
    if (currentUserRole.includes('Ketua')) return { name: 'Hi, Ketua RT', initial: 'KT', color: '#3B7594' };
    if (currentUserRole.includes('Sekretaris')) return { name: 'Hi, Sekretaris', initial: 'SK', color: '#0284c7' };
    if (currentUserRole.includes('Bendahara')) return { name: 'Hi, Bendahara', initial: 'BD', color: '#059669' };
    return { name: 'Hi, Warga', initial: 'WG', color: '#64748b' };
  };

  const user = getGreeting();

  return (
    <header className="top-header">
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxSizing: 'border-box'
      }}>
        <div className="header-left">
          <button 
            className="header-hamburger-btn" 
            onClick={onToggleSidebar}
            title="Buka Menu Navigasi"
            style={{ 
              color: '#3B7594', 
              width: '40px', 
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            <Menu size={24} strokeWidth={2.4} />
          </button>
          <h1 className="header-title">{title}</h1>
        </div>

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="user-greeting" style={{ fontSize: '13.5px', lineHeight: 1.2, fontWeight: 800 }}>{user.name}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{currentUserRole}</div>
          </div>
          <div 
            className="user-avatar-circle" 
            style={{ background: user.color, pointerEvents: 'none' }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800 }}>{user.initial}</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Keluar / Ganti Akun"
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
            >
              <LogOut size={15} /> Keluar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
