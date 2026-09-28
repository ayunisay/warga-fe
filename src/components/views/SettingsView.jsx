import React, { useState } from 'react';
import { 
  Settings, Shield, User, Key, CheckCircle, Building, 
  Edit3, Trash2, UserPlus, ShieldAlert, Check, X, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { RT_INFO } from '../../data/mockData';

export default function SettingsView({ 
  users, 
  currentUserRole, 
  onChangeCurrentRole, 
  onUpdateUser, 
  onAddUser, 
  onDeleteUser 
}) {
  const [activeTab, setActiveTab] = useState('pengurus');
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Cek apakah peran saat ini berhak mengedit user & role (Hanya Ketua RT & Sekretaris)
  const isAuthorized = currentUserRole === 'Ketua RT' || currentUserRole === 'Sekretaris';

  // Form state untuk Edit User
  const [editForm, setEditForm] = useState({
    nama: '',
    jabatan: '',
    role: '',
    email: '',
    telp: '',
    status: 'Aktif'
  });

  // Form state untuk Tambah User Baru
  const [newUserForm, setNewUserForm] = useState({
    nama: '',
    jabatan: '',
    role: 'Bendahara',
    email: '',
    telp: '',
    status: 'Aktif'
  });

  const handleOpenEdit = (user) => {
    if (!isAuthorized) {
      alert('Akses Ditolak: Hanya Ketua RT dan Sekretaris yang memiliki wewenang mengedit data dan role user.');
      return;
    }
    setEditingUser(user);
    setEditForm({
      nama: user.nama,
      jabatan: user.jabatan,
      role: user.role,
      email: user.email,
      telp: user.telp,
      status: user.status
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.nama) {
      alert('Nama tidak boleh kosong');
      return;
    }
    onUpdateUser(editingUser.id, editForm);
    setEditingUser(null);
  };

  const handleSaveNewUser = (e) => {
    e.preventDefault();
    if (!newUserForm.nama || !newUserForm.email) {
      alert('Nama dan Email wajib diisi');
      return;
    }
    const initials = newUserForm.nama.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    onAddUser({
      ...newUserForm,
      id: Date.now(),
      avatarInitial: initials || 'US'
    });
    setShowAddModal(false);
    setNewUserForm({
      nama: '',
      jabatan: '',
      role: 'Bendahara',
      email: '',
      telp: '',
      status: 'Aktif'
    });
  };

  const availableRoles = [
    { value: 'Ketua RT', desc: 'Akses penuh seluruh modul (Kependudukan, Keuangan, Surat, Pengguna & Role)' },
    { value: 'Sekretaris', desc: 'Kelola Surat Pengantar, Data Warga, & Edit Role Pengguna' },
    { value: 'Bendahara', desc: 'Kelola Kas Masuk, Kas Keluar, & Status Iuran Warga' },
  ];

  return (
    <div className="settings-page">
      {/* Role Simulation Switcher & Notice */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '18px 22px',
        border: '1px solid #e2e8f0',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: isAuthorized ? '#dcfce7' : '#fee2e2',
            color: isAuthorized ? '#15803d' : '#b91c1c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isAuthorized ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Simulasi Pengguna Aktif (Role-Based Access):</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
              Login Sebagai: <span style={{ color: '#3B7594' }}>{currentUserRole}</span>
            </div>
          </div>
        </div>

        {/* Quick Role Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569' }}>Ganti Akun Simulasi:</span>
          <select 
            value={currentUserRole}
            onChange={(e) => onChangeCurrentRole(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: 700,
              background: '#f8fafc',
              color: '#1e293b',
              cursor: 'pointer'
            }}
          >
            <option value="Ketua RT">Ketua RT (Punya Akses Edit User & Role)</option>
            <option value="Sekretaris">Sekretaris (Punya Akses Edit User & Role)</option>
            <option value="Bendahara">Bendahara (Tanpa Akses Edit User & Role)</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
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
          Manajemen Pengguna & Role ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('matriks')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            background: activeTab === 'matriks' ? '#3B7594' : '#e2e8f0',
            color: activeTab === 'matriks' ? '#ffffff' : '#334155'
          }}
        >
          Matriks Hak Akses Role
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

      {/* TAB 1: USER & ROLE MANAGEMENT */}
      {activeTab === 'pengurus' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Header Action & Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Daftar Pengguna & Hak Akses RT 007
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                {isAuthorized ? (
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>
                    ✓ Anda memiliki wewenang untuk mengubah data user dan menetapkan role / hak akses.
                  </span>
                ) : (
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>
                    ✕ Anda tidak memiliki hak edit. Hanya Ketua RT dan Sekretaris yang dapat mengedit user & role.
                  </span>
                )}
              </p>
            </div>

            {isAuthorized && (
              <button 
                onClick={() => setShowAddModal(true)}
                style={{
                  background: '#3B7594',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(59, 117, 148, 0.3)'
                }}
              >
                <UserPlus size={18} /> Tambah Pengguna Baru
              </button>
            )}
          </div>

          {/* User Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {users.map((u) => (
              <div 
                key={u.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'box-shadow 0.2s',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#3B7594',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '16px'
                      }}>
                        {u.avatarInitial || u.nama.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>{u.nama}</h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{u.jabatan}</span>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: u.status === 'Aktif' ? '#dcfce7' : '#fee2e2',
                      color: u.status === 'Aktif' ? '#15803d' : '#b91c1c'
                    }}>
                      {u.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                    <div>📧 <strong>Email:</strong> {u.email}</div>
                    <div>📱 <strong>WhatsApp:</strong> {u.telp}</div>
                  </div>

                  {/* Role Badge & Description */}
                  <div style={{
                    background: u.role.includes('Ketua') ? '#fef3c7' : u.role.includes('Sekretaris') ? '#e0f2fe' : '#f1f5f9',
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                      Role / Hak Akses:
                    </div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: u.role.includes('Ketua') ? '#92400e' : u.role.includes('Sekretaris') ? '#0369a1' : '#334155'
                    }}>
                      🛡️ {u.role}
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Authorized Users */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                  <button 
                    onClick={() => handleOpenEdit(u)}
                    disabled={!isAuthorized}
                    style={{
                      flex: 1,
                      background: isAuthorized ? '#3B7594' : '#cbd5e1',
                      color: '#ffffff',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: isAuthorized ? 'pointer' : 'not-allowed'
                    }}
                    title={isAuthorized ? "Edit Profil & Role Pengguna" : "Hanya Ketua RT & Sekretaris yang dapat mengedit"}
                  >
                    <Edit3 size={15} /> Edit User & Role
                  </button>

                  {isAuthorized && u.role !== 'Ketua RT' && (
                    <button 
                      onClick={() => onDeleteUser(u.id)}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Hapus Pengguna"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MATRIKS HAK AKSES */}
      {activeTab === 'matriks' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Matriks Hak Akses & Kewenangan Pengguna
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Ketua RT dan Sekretaris memiliki wewenang khusus dalam administrasi data dan peran pengguna sistem SI-WARGA 07
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Role / Peran</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Data Warga</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Keuangan & Iuran</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Pelayanan Surat</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', background: '#fef3c7' }}>Edit User & Role</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#92400e' }}>
                    Ketua RT
                  </td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>Akses Penuh</td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>Akses Penuh</td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>Akses & TTD</td>
                  <td style={{ textAlign: 'center', background: '#fef9c3', color: '#15803d', fontWeight: 800 }}>✓ BISA EDIT ROLE</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0369a1' }}>
                    Sekretaris
                  </td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>Akses Penuh</td>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>Lihat Laporan</td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>Buat & Cetak</td>
                  <td style={{ textAlign: 'center', background: '#fef9c3', color: '#15803d', fontWeight: 800 }}>✓ BISA EDIT ROLE</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#15803d' }}>
                    Bendahara
                  </td>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>Lihat Data</td>
                  <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>Kelola Kas & Iuran</td>
                  <td style={{ textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>✕ Tidak Ada Akses</td>
                  <td style={{ textAlign: 'center', color: '#dc2626' }}>✕ Tidak Bisa</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROFIL WILAYAH */}
      {activeTab === 'wilayah' && (
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

      {/* MODAL 1: EDIT USER & ROLE (Fitur Khusus Ketua RT & Sekretaris) */}
      {editingUser && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '560px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Edit Pengguna & Ubah Role
                </h3>
                <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                  Wewenang: Dilakukan oleh {currentUserRole}
                </p>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                style={{ padding: '6px', borderRadius: '8px', background: '#f1f5f9' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Nama Lengkap *
                </label>
                <input 
                  type="text" 
                  required
                  value={editForm.nama}
                  onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {/* UBAH ROLE PENGGUNA (PENTING) */}
              <div style={{ marginBottom: '16px', background: '#f0f9ff', padding: '14px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>
                  🛡️ Tetapkan Role / Hak Akses User:
                </label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #38bdf8',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    background: '#ffffff',
                    color: '#0f172a'
                  }}
                >
                  {availableRoles.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.value}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '11.5px', color: '#0284c7', marginTop: '6px' }}>
                  Role menentukan menu dan aksi apa saja yang diizinkan untuk akun ini.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Jabatan Organisasi
                  </label>
                  <input 
                    type="text" 
                    value={editForm.jabatan}
                    onChange={(e) => setEditForm({ ...editForm, jabatan: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Status Akun
                  </label>
                  <select 
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    No. WhatsApp / HP
                  </label>
                  <input 
                    type="text" 
                    value={editForm.telp}
                    onChange={(e) => setEditForm({ ...editForm, telp: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', background: '#3B7594', color: '#fff', fontWeight: 700 }}
                >
                  Simpan Perubahan Role & User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH USER BARU */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '560px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Tambah Akun Pengguna Baru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ padding: '6px', borderRadius: '8px', background: '#f1f5f9' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewUser}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Nama Lengkap *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Dedi Kurniawan"
                  value={newUserForm.nama}
                  onChange={(e) => setNewUserForm({ ...newUserForm, nama: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '16px', background: '#f0f9ff', padding: '14px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>
                  Pilih Role / Hak Akses:
                </label>
                <select 
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #38bdf8',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    background: '#ffffff'
                  }}
                >
                  {availableRoles.map(r => (
                    <option key={r.value} value={r.value}>{r.value}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Jabatan Organisasi
                  </label>
                  <input 
                    type="text" 
                    placeholder="Misal: Staf Tata Usaha RT"
                    value={newUserForm.jabatan}
                    onChange={(e) => setNewUserForm({ ...newUserForm, jabatan: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Status Akun
                  </label>
                  <select 
                    value={newUserForm.status}
                    onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Email *
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="email@gmail.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    No. WhatsApp / HP
                  </label>
                  <input 
                    type="text" 
                    placeholder="0812-..."
                    value={newUserForm.telp}
                    onChange={(e) => setNewUserForm({ ...newUserForm, telp: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', background: '#3B7594', color: '#fff', fontWeight: 700 }}
                >
                  Simpan Pengguna Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
