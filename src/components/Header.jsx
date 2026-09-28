import React from 'react';
import { Menu, Bell, ShieldCheck } from 'lucide-react';

export default function Header({ title, onToggleSidebar, currentUserRole = "Ketua RT (Superadmin)" }) {
  const getGreeting = () => {
    if (currentUserRole.includes('Ketua')) return { name: 'Hi, Ketua', initial: 'KT', color: '#3B7594' };
    if (currentUserRole.includes('Sekretaris')) return { name: 'Hi, Sekretaris', initial: 'SK', color: '#0284c7' };
    if (currentUserRole.includes('Bendahara')) return { name: 'Hi, Bendahara', initial: 'BD', color: '#059669' };
    return { name: 'Hi, Warga', initial: 'WG', color: '#64748b' };
  };

  const user = getGreeting();

  return (
    <header className="top-header">
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

      <div className="header-right">
        <div style={{ textAlign: 'right' }}>
          <div className="user-greeting">{user.name}</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{currentUserRole.split(' ')[0]}</div>
        </div>
        <div 
          className="user-avatar-circle" 
          style={{ background: user.color, pointerEvents: 'none' }}
        >
          <span style={{ fontSize: '15px', fontWeight: 800 }}>{user.initial}</span>
        </div>
      </div>
    </header>
  );
}
