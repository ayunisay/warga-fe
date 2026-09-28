import React, { useState } from 'react';
import { 
  Bell, Plus, Search, Edit2, Trash2, Eye, EyeOff, Calendar, 
  MapPin, Clock, CheckCircle2, AlertCircle, Info, Sparkles,
  ArrowRight, ShieldCheck, Tag, Filter
} from 'lucide-react';

export default function InformasiView({
  announcements = [],
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onToggleAnnouncement,
  currentUserRole = 'Ketua RT'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const initialFormState = {
    judul: '',
    kategori: 'Kegiatan Lingkungan',
    tanggal: '',
    waktu: '',
    lokasi: 'Wilayah RT 007 Teluk Pucung',
    icon: '📢',
    color: '#3B7594',
    deskripsi: '',
    status: 'Aktif',
    prioritas: 'Penting',
    penulis: `${currentUserRole} RT 007`
  };

  const [formData, setFormData] = useState(initialFormState);

  // Quick Emoji Presets
  const emojiPresets = ['📢', '🧹', '👶', '🚛', '🚨', '🕌', '⚽', '🩺', '💡', '💧', '🌳', '🛡️'];

  // Color Presets
  const colorPresets = [
    { label: 'Biru RT', hex: '#3B7594' },
    { label: 'Hijau Sehat', hex: '#16a34a' },
    { label: 'Kuning / Oranye', hex: '#f59e0b' },
    { label: 'Merah Penting', hex: '#dc2626' },
    { label: 'Ungu Kegiatan', hex: '#7c3aed' },
  ];

  // Category Presets
  const kategoriList = [
    'Semua',
    'Kegiatan Lingkungan',
    'Kesehatan / Posyandu',
    'Layanan Kebersihan',
    'Keamanan & Ronda',
    'Pengumuman Penting',
    'Keagamaan & Sosial'
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      ...initialFormState,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.deskripsi.trim()) {
      alert('Mohon isi judul dan isi pengumuman!');
      return;
    }

    if (editingItem) {
      onUpdateAnnouncement(editingItem.id, formData);
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        penulis: `${currentUserRole} RT 007`
      };
      onAddAnnouncement(newItem);
    }

    setIsModalOpen(false);
  };

  // Filtered list
  const filteredList = announcements.filter(item => {
    const matchesSearch = 
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = filterKategori === 'Semua' || item.kategori === filterKategori;
    const matchesStatus = filterStatus === 'Semua' || item.status === filterStatus;
    return matchesSearch && matchesKategori && matchesStatus;
  });

  // Active items for preview (sorted as seen by residents)
  const activeAnnouncements = announcements.filter(a => a.status === 'Aktif');

  return (
    <div style={{ width: '100%' }}>
      {/* Header Halaman */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Pengaturan Papan Informasi & Agenda RT 007
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>
                Kelola pengumuman, agenda kerja bakti, posyandu, dan informasi yang langsung tampil di Portal Warga.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            background: '#3B7594',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '13.5px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(59, 117, 148, 0.25)',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          <Plus size={18} /> Buat Pengumuman Baru
        </button>
      </div>

      {/* Quick Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Informasi & Agenda</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            {announcements.length} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Postingan</span>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #bbf7d0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 700 }}>✓ Tampil di Portal Warga (Aktif)</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>
            {activeAnnouncements.length} <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>Pengumuman</span>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Draft / Disembunyikan</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#64748b', marginTop: '4px' }}>
            {announcements.length - activeAnnouncements.length} <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Item</span>
          </div>
        </div>
      </div>

      {/* Split-Layout: Sisi Kiri Kelola Data | Sisi Kanan Live Preview Portal Warga */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* ================= SISI KIRI: DAFTAR PENGUMUMAN & EDIT ================= */}
        <div>
          {/* Filter & Search Bar */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari pengumuman atau kegiatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  background: '#f8fafc',
                  color: '#334155'
                }}
              >
                {kategoriList.map(kat => (
                  <option key={kat} value={kat}>{kat === 'Semua' ? 'Semua Kategori' : kat}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  background: '#f8fafc',
                  color: '#334155'
                }}
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif (Tampil di Warga)</option>
                <option value="Draft">Draft / Tersembunyi</option>
              </select>
            </div>
          </div>

          {/* List Card Pengumuman */}
          {filteredList.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px dashed #cbd5e1',
              padding: '40px 20px',
              textAlign: 'center'
            }}>
              <Bell size={40} color="#cbd5e1" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontSize: '15px', color: '#475569', margin: '0 0 4px' }}>Tidak Ada Pengumuman Ditemukan</h4>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px' }}>Coba ubah kata kunci pencarian atau buat pengumuman baru.</p>
              <button
                onClick={handleOpenAdd}
                style={{
                  background: '#3B7594',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                + Buat Pengumuman Baru
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    borderLeft: `5px solid ${item.color || '#3B7594'}`,
                    padding: '18px 20px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Baris Atas Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{item.icon}</span>
                      <div>
                        <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {item.judul}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: '#f1f5f9',
                            color: '#475569'
                          }}>
                            {item.kategori}
                          </span>
                          <span style={{ fontSize: '11.5px', color: item.color || '#3B7594', fontWeight: 700 }}>
                            📅 {item.tanggal}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => onToggleAnnouncement(item.id)}
                        title={item.status === 'Aktif' ? 'Sembunyikan dari Portal Warga' : 'Tampilkan di Portal Warga'}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${item.status === 'Aktif' ? '#bbf7d0' : '#e2e8f0'}`,
                          background: item.status === 'Aktif' ? '#dcfce7' : '#f8fafc',
                          color: item.status === 'Aktif' ? '#15803d' : '#64748b',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {item.status === 'Aktif' ? <><Eye size={13} /> Aktif</> : <><EyeOff size={13} /> Draft</>}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Pengumuman"
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#0284c7',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus pengumuman "${item.judul}"?`)) {
                            onDeleteAnnouncement(item.id);
                          }
                        }}
                        title="Hapus Pengumuman"
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          background: '#ffffff',
                          color: '#dc2626',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Isi Pengumuman */}
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '8px 0 10px' }}>
                    {item.deskripsi}
                  </p>

                  {/* Footer Info Tambahan */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11.5px',
                    color: '#94a3b8',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '8px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {item.lokasi && (
                        <span>📍 {item.lokasi}</span>
                      )}
                      {item.waktu && (
                        <span>⏰ {item.waktu}</span>
                      )}
                    </div>
                    <span>Dibuat oleh: <strong>{item.penulis || 'Pengurus RT'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= SISI KANAN: LIVE PREVIEW PERSIS SEPERTI DI PORTAL WARGA ================= */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '2px solid #fed7aa',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            {/* Header Badge Pratinjau */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📱</span>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Pratinjau Live di Portal Warga
                  </h4>
                  <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: 600 }}>
                    Tampilan langsung yang dilihat warga secara real-time
                  </span>
                </div>
              </div>
              <span style={{
                background: '#ffedd5',
                color: '#c2410c',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                {activeAnnouncements.length} Tayang
              </span>
            </div>

            {/* KOMPONEN WIDGET PAPAN INFORMASI PERSIS SEPERTI DI PORTAL WARGA */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bell size={18} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Papan Informasi & Agenda RT 007
                </h3>
              </div>

              {activeAnnouncements.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '12.5px' }}>
                  Tidak ada pengumuman aktif saat ini.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activeAnnouncements.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: '#f8fafc',
                        borderRadius: '12px',
                        padding: '14px',
                        borderLeft: `4px solid ${item.color || '#3B7594'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                          {item.icon} {item.judul}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: item.color || '#3B7594', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                          {item.tanggal}
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        {item.deskripsi}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '11.5px', color: '#64748b' }}>
              💡 Pengumuman dengan status <strong>Aktif</strong> akan otomatis muncul di beranda seluruh warga.
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL TAMBAH / EDIT PENGUMUMAN ================= */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '580px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{formData.icon}</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {editingItem ? 'Edit Pengumuman / Agenda' : 'Tambah Pengumuman Baru'}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Ditulis oleh: <strong>{currentUserRole} RT 007</strong>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '6px', borderRadius: '8px', background: '#f1f5f9', cursor: 'pointer', border: 'none' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Judul */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Judul Pengumuman / Agenda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kerja Bakti Massal Menyambut Idul Fitri"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Emoji Icon Picker & Kategori */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Ikon Emoji
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {emojiPresets.map(em => (
                      <button
                        type="button"
                        key={em}
                        onClick={() => setFormData({ ...formData, icon: em })}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          fontSize: '16px',
                          border: formData.icon === em ? '2px solid #3B7594' : '1px solid #cbd5e1',
                          background: formData.icon === em ? '#e0f2fe' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Kategori Informasi
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Kegiatan Lingkungan">Kegiatan Lingkungan</option>
                    <option value="Kesehatan / Posyandu">Kesehatan / Posyandu</option>
                    <option value="Layanan Kebersihan">Layanan Kebersihan</option>
                    <option value="Keamanan & Ronda">Keamanan & Ronda</option>
                    <option value="Pengumuman Penting">Pengumuman Penting</option>
                    <option value="Keagamaan & Sosial">Keagamaan & Sosial</option>
                  </select>
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Tanggal / Periode Pelaksanaan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 12 Apr 2026 atau Rutin"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Waktu / Jam Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 08.00 WIB - Selesai"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Lokasi & Warna Aksen */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Lokasi / Tempat
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Balai Pos RT 007 / Lapangan"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Warna Garis Aksen
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    {colorPresets.map(col => (
                      <div
                        key={col.hex}
                        onClick={() => setFormData({ ...formData, color: col.hex })}
                        title={col.label}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          background: col.hex,
                          cursor: 'pointer',
                          border: formData.color === col.hex ? '3px solid #0f172a' : '2px solid transparent',
                          transform: formData.color === col.hex ? 'scale(1.15)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Isi / Deskripsi */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Isi / Detail Pengumuman *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan pesan lengkap yang ingin disampaikan kepada seluruh warga..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Status Tampil */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Tampilkan di Papan Informasi Portal Warga
                  </span>
                  <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0' }}>
                    Jika diaktifkan, informasi ini langsung dapat dibaca oleh warga saat login.
                  </p>
                </div>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: formData.status === 'Aktif' ? '1px solid #86efac' : '1px solid #cbd5e1',
                    background: formData.status === 'Aktif' ? '#dcfce7' : '#ffffff',
                    color: formData.status === 'Aktif' ? '#15803d' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: 700
                  }}
                >
                  <option value="Aktif">✓ Aktif (Tampil)</option>
                  <option value="Draft">Draft (Sembunyi)</option>
                </select>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b', cursor: 'pointer', background: '#ffffff' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', background: '#3B7594', color: '#ffffff', fontWeight: 700, cursor: 'pointer', border: 'none' }}
                >
                  {editingItem ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
