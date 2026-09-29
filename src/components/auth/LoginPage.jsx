import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, Key, Lock, Mail, Users, 
  ArrowRight, CheckCircle2, Building, Home, FileText, Wallet
} from 'lucide-react';
import { RT_INFO, INITIAL_USERS, INITIAL_CITIZENS } from '../../data/mockData';

import api from '../../services/api';

export default function LoginPage({ onLogin }) {
  const [loginType, setLoginType] = useState('pengurus'); // 'pengurus' | 'warga'
  const [emailOrNik, setEmailOrNik] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPengurusRole, setSelectedPengurusRole] = useState('Ketua RT');
  const [selectedCitizenId, setSelectedCitizenId] = useState(INITIAL_CITIZENS[2]?.id || 3); // Andi Pratama default
  const [isLoading, setIsLoading] = useState(false);

  // Demo accounts
  const demoPengurus = [
    {
      role: 'Ketua RT',
      name: 'H. Bambang Sugiarto, S.T.',
      email: 'ketua.rt007@gmail.com',
      badge: 'Superadmin RT',
      color: '#3B7594',
      icon: '👑',
      desc: 'Akses penuh seluruh modul sistem'
    },
    {
      role: 'Sekretaris',
      name: 'Ahmad Fauzi',
      email: 'sekretaris.rt007@gmail.com',
      badge: 'Pelayanan & Arsip',
      color: '#0284c7',
      icon: '✍️',
      desc: 'Administrasi surat, data warga & user'
    },
    {
      role: 'Bendahara',
      name: 'Hj. Endang Suryaningsih',
      email: 'bendahara.rt007@gmail.com',
      badge: 'Keuangan & Kas',
      color: '#059669',
      icon: '💰',
      desc: 'Kelola kas, mutasi & status iuran warga'
    }
  ];

  const demoWargaList = INITIAL_CITIZENS.slice(0, 4);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (loginType === 'pengurus') {
        const user = demoPengurus.find(p => p.role === selectedPengurusRole);
        const res = await api.auth.login({
          login: emailOrNik || user.email,
          role: selectedPengurusRole,
          password: password || 'password',
        });
        if (res?.token) {
          localStorage.setItem('auth_token', res.token);
        }
        onLogin(res.user);
      } else {
        const citizen = INITIAL_CITIZENS.find(c => c.id === Number(selectedCitizenId)) || INITIAL_CITIZENS[0];
        const res = await api.auth.login({
          nik: emailOrNik || citizen.nik,
          role: 'Warga',
          password: password || 'password',
        });
        if (res?.token) {
          localStorage.setItem('auth_token', res.token);
        }
        onLogin(res.user?.citizen ? { ...res.user.citizen, ...res.user } : { ...citizen, role: 'Warga', jabatan: `Warga (${citizen.blok} No. ${citizen.noRumah})` });
      }
    } catch (err) {
      console.warn('API login failed, using fallback:', err);
      if (loginType === 'pengurus') {
        const user = demoPengurus.find(p => p.role === selectedPengurusRole);
        onLogin({
          id: selectedPengurusRole === 'Ketua RT' ? 1 : selectedPengurusRole === 'Sekretaris' ? 2 : 3,
          nama: user.name,
          role: user.role,
          email: user.email,
          jabatan: `${user.role} RT 007`
        });
      } else {
        const citizen = INITIAL_CITIZENS.find(c => c.id === Number(selectedCitizenId)) || INITIAL_CITIZENS[0];
        onLogin({
          ...citizen,
          role: 'Warga',
          jabatan: `Warga (${citizen.blok} No. ${citizen.noRumah})`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLoginPengurus = async (pengurus) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({
        role: pengurus.role,
        password: 'password',
      });
      if (res?.token) {
        localStorage.setItem('auth_token', res.token);
      }
      onLogin(res.user);
    } catch (err) {
      console.warn('Quick login fallback:', err);
      onLogin({
        id: pengurus.role === 'Ketua RT' ? 1 : pengurus.role === 'Sekretaris' ? 2 : 3,
        nama: pengurus.name,
        role: pengurus.role,
        email: pengurus.email,
        jabatan: `${pengurus.role} RT 007`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLoginWarga = async (citizen) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({
        nik: citizen.nik,
        role: 'Warga',
        password: 'password',
      });
      if (res?.token) {
        localStorage.setItem('auth_token', res.token);
      }
      onLogin(res.user?.citizen ? { ...res.user.citizen, ...res.user } : { ...citizen, role: 'Warga', jabatan: `Warga (${citizen.blok} No. ${citizen.noRumah})` });
    } catch (err) {
      console.warn('Quick login fallback:', err);
      onLogin({
        ...citizen,
        role: 'Warga',
        jabatan: `Warga (${citizen.blok} No. ${citizen.noRumah})`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e3a5f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Glows */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 117, 148, 0.25) 0%, rgba(0,0,0,0) 70%)',
        top: '-100px',
        left: '-100px',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 196, 67, 0.15) 0%, rgba(0,0,0,0) 70%)',
        bottom: '-50px',
        right: '-50px',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '1000px',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Left Side: Brand & Quick Demo Access */}
        <div style={{
          background: 'linear-gradient(180deg, #2c5c75 0%, #1a3848 100%)',
          color: '#ffffff',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#f5c443',
                color: '#1a3848',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '24px',
                boxShadow: '0 6px 14px rgba(245, 196, 67, 0.35)'
              }}>
                S
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px', margin: 0, color: '#ffffff' }}>
                  SI-WARGA 07
                </h2>
                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  RT 007 / RW 030 Teluk Pucung
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '24px' }}>
              Sistem Informasi Pelayanan Warga, Administrasi Surat Digital, & Rekapitulasi Kas RT yang transparan.
            </p>

            {/* Quick Demo Switcher Title */}
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: '#f5c443',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>⚡ Akses Cepat Simulasi Role (1-Klik Masuk):</span>
            </div>

            {/* Pengurus Role Quick Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {demoPengurus.map((p) => (
                <div 
                  key={p.role}
                  onClick={() => handleQuickLoginPengurus(p)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                        {p.role}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#cbd5e1' }}>
                        {p.name}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(245, 196, 67, 0.2)',
                    color: '#fef08a'
                  }}>
                    Masuk →
                  </span>
                </div>
              ))}

              {/* Citizen Quick Card */}
              <div 
                onClick={() => handleQuickLoginWarga(INITIAL_CITIZENS[2])}
                style={{
                  background: 'rgba(245, 196, 67, 0.15)',
                  border: '1px solid rgba(245, 196, 67, 0.35)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 196, 67, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 196, 67, 0.15)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🏡</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#fef08a' }}>
                      Portal Warga RT 007
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#e2e8f0' }}>
                      Andi Pratama (Blok B2 No. 14)
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: '#f5c443',
                  color: '#1a3848'
                }}>
                  Portal Warga →
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            Kecamatan Bekasi Utara • Kelurahan Teluk Pucung
          </div>
        </div>

        {/* Right Side: Tabbed Login Form */}
        <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Selamat Datang
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>
              Silakan pilih mode login untuk masuk ke aplikasi
            </p>
          </div>

          {/* Toggle Type Login */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '26px'
          }}>
            <button
              type="button"
              onClick={() => setLoginType('pengurus')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                transition: 'all 0.2s',
                background: loginType === 'pengurus' ? '#ffffff' : 'transparent',
                color: loginType === 'pengurus' ? '#3B7594' : '#64748b',
                boxShadow: loginType === 'pengurus' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ShieldCheck size={16} /> Pengurus RT
            </button>
            <button
              type="button"
              onClick={() => setLoginType('warga')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                transition: 'all 0.2s',
                background: loginType === 'warga' ? '#ffffff' : 'transparent',
                color: loginType === 'warga' ? '#3B7594' : '#64748b',
                boxShadow: loginType === 'warga' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Home size={16} /> Warga RT 007
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {loginType === 'pengurus' ? (
              <>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Pilih Peran Pengurus RT *
                  </label>
                  <select
                    value={selectedPengurusRole}
                    onChange={(e) => setSelectedPengurusRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none'
                    }}
                  >
                    <option value="Ketua RT">Ketua RT (H. Bambang Sugiarto - Superadmin)</option>
                    <option value="Sekretaris">Sekretaris (Ahmad Fauzi - Pengantar Surat & Warga)</option>
                    <option value="Bendahara">Bendahara (Hj. Endang - Kas & Iuran Warga)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Email Pengurus
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                    <input 
                      type="email"
                      readOnly
                      value={demoPengurus.find(p => p.role === selectedPengurusRole)?.email}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        fontSize: '13.5px',
                        background: '#f8fafc',
                        color: '#475569'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Kata Sandi / PIN
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                    <input 
                      type="password"
                      defaultValue="••••••••"
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13.5px',
                        color: '#0f172a'
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Pilih Identitas Warga (Demo RT 007) *
                  </label>
                  <select
                    value={selectedCitizenId}
                    onChange={(e) => setSelectedCitizenId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none'
                    }}
                  >
                    {demoWargaList.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nama} • {c.alamat} ({c.statusIuran === 'Lunas' ? 'Iuran Lunas' : 'Menunggak'})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Nomor Induk Kependudukan (NIK)
                  </label>
                  <input 
                    type="text"
                    readOnly
                    value={INITIAL_CITIZENS.find(c => c.id === Number(selectedCitizenId))?.nik}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13.5px',
                      background: '#f8fafc',
                      color: '#475569',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Nomor Kartu Keluarga (KK)
                  </label>
                  <input 
                    type="text"
                    readOnly
                    value={INITIAL_CITIZENS.find(c => c.id === Number(selectedCitizenId))?.noKk}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13.5px',
                      background: '#f8fafc',
                      color: '#475569',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#3B7594',
                color: '#ffffff',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '14.5px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(59, 117, 148, 0.35)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2c5c75'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3B7594'}
            >
              <span>Masuk Sekarang</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '12.5px',
            color: '#94a3b8'
          }}>
            Mengalami kesulitan login? Hubungi Sekretariat RT 007 di Pos RT Teluk Pucung
          </div>
        </div>
      </div>
    </div>
  );
}
