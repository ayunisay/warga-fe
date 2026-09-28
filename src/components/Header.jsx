import React from 'react';
import { Menu, Bell, ShieldCheck } from 'lucide-react';

export default function Header({ title, onToggleSidebar, activeRole = "Ketua RT" }) {
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
        <span className="user-greeting">Hi, Ketua</span>
        <div 
          className="user-avatar-circle" 
          title="Profil Pengguna - Ketua RT 007"
        >
          <span style={{ fontSize: '15px', fontWeight: 800 }}>KT</span>
        </div>
      </div>
    </header>
  );
}
