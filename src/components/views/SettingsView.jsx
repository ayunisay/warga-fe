import React, { useState } from 'react';
import { Settings, Shield, User, Key, CheckCircle, Building } from 'lucide-react';
import { RT_INFO } from '../../data/mockData';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('pengurus');

  const pengurusList = [
    { nama: RT_INFO.ketuaRt, jabatan: "Ketua RT 007", role: "Superadmin", email: "ketua.rt007@gmail.com", telp: "0812-3456-7890" },
    { nama: RT_INFO.sekretaris, jabatan: "Sekretaris", role: "Administrator Surat", email: "sekretaris.rt007@gmail.com", telp: "0813-8899-7711" },
    { nama: RT_INFO.bendahara, jabatan: "Bendahara", role: "Administrator Keuangan", email: "bendahara.rt007@gmail.com", telp: "0856-7123-9900" },
    { nama: "Wawan Kurniawan", jabatan: "Koordinator Keamanan", role: "Petugas Lapangan", email: "keamanan.rt007@gmail.com", telp: "0819-0821-3322" },
  ];

  return (
    <div className="settings-page">
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <button 
          onClick={() => setActiveTab('pengurus')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            background: activeTab === 'pengurus' ? '#3B7594' : '#e2e8f0',
            color: activeTab === 'pengurus' ? '#ffffff' : '#334155'
          }}
        >
          Daftar Pengurus & Hak Akses
        </button>
        <button 
          onClick={() => setActiveTab('wilayah')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            background: activeTab === 'wilayah' ? '#3B7594' : '#e2e8f0',
            color: activeTab === 'wilayah' ? '#ffffff' : '#334155'
          }}
        >
          Profil Wilayah RT 007
        </button>
      </div>

      {activeTab === 'pengurus' ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Manajemen Akun Pengurus RT 007 / RW 030
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Daftar pengurus yang memiliki wewenang mengelola data kependudukan, iuran, dan surat warga
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {pengurusList.map((p, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#3B7594',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  {p.nama.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '14px' }}>{p.nama}</div>
                  <div style={{ fontSize: '12px', color: '#3B7594', fontWeight: 700 }}>{p.jabatan}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>📧 {p.email}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>📱 {p.telp}</div>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    padding: '2px 8px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '6px'
                  }}>
                    {p.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Identitas Wilayah RT / RW
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '13.5px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Nama Rukun Tetangga (RT)</span>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>RT {RT_INFO.rt}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Nama Rukun Warga (RW)</span>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>RW {RT_INFO.rw}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Kelurahan</span>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>{RT_INFO.kelurahan}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Kecamatan</span>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>{RT_INFO.kecamatan}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Kota & Provinsi</span>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>{RT_INFO.kota}, {RT_INFO.provinsi}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '12px' }}>Alamat Sekretariat Pos RT</span>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>{RT_INFO.alamatSekretariat}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
