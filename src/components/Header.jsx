import React from 'react';
import { Menu, Bell, ShieldCheck } from 'lucide-react';

export default function Header({ title, onToggleSidebar, activeRole = "Ketua RT" }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="hamburger-btn-strip" 
          onClick={onToggleSidebar}
          title="Buka Menu Navigasi"
          style={{ color: '#3B7594', width: '38px', height: '38px' }}
        >
          <Menu size={28} strokeWidth={2.4} />
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
