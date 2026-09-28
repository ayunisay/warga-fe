import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';

export default function TambahWargaModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    noKk: '',
    jenisKelamin: 'Laki-laki',
    tempatLahir: '',
    tanggalLahir: '',
    agama: 'Islam',
    statusKawin: 'Kawin',
    pekerjaan: '',
    alamat: '',
    blok: 'A1',
    noRumah: '',
    statusTinggal: 'Tetap',
    telepon: '',
    peranKeluarga: 'Kepala Keluarga',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik) {
      alert('Nama dan NIK wajib diisi!');
      return;
    }
    onSave({
      ...formData,
      id: Date.now(),
      statusIuran: 'Lunas',
      alamat: `Jl. Melati Blok ${formData.blok} No. ${formData.noRumah || '01'}`
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-box" style={{ maxWidth: '640px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#eaf3f8',
              color: '#3B7594',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b' }}>
                Tambah Data Warga Baru
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Input data kependudukan RT 007 / RW 030
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: '#e2e8f0',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Nama Lengkap *
              </label>
              <input 
                type="text" 
                required
                value={formData.nama} 
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Ahmad Fauzi"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                NIK (16 Digit) *
              </label>
              <input 
                type="text" 
                required
                maxLength={16}
                value={formData.nik} 
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                placeholder="327501..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                No. Kartu Keluarga (KK)
              </label>
              <input 
                type="text" 
                maxLength={16}
                value={formData.noKk} 
                onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                placeholder="327501..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Jenis Kelamin
              </label>
              <select 
                value={formData.jenisKelamin} 
                onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Blok Rumah
              </label>
              <select 
                value={formData.blok} 
                onChange={(e) => setFormData({ ...formData, blok: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
              >
                <option value="A1">Blok A1</option>
                <option value="A2">Blok A2</option>
                <option value="B1">Blok B1</option>
                <option value="B2">Blok B2</option>
                <option value="C1">Blok C1</option>
                <option value="C2">Blok C2</option>
                <option value="C3">Blok C3</option>
                <option value="D1">Blok D1</option>
                <option value="D2">Blok D2</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                No. Rumah
              </label>
              <input 
                type="text" 
                value={formData.noRumah} 
                onChange={(e) => setFormData({ ...formData, noRumah: e.target.value })}
                placeholder="Misal: 14"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Status Tinggal
              </label>
              <select 
                value={formData.statusTinggal} 
                onChange={(e) => setFormData({ ...formData, statusTinggal: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
              >
                <option value="Tetap">Warga Tetap</option>
                <option value="Sementara / Kontrak">Sementara / Kontrak</option>
                <option value="Domisili Usaha">Domisili Usaha</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Pekerjaan
              </label>
              <input 
                type="text" 
                value={formData.pekerjaan} 
                onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                placeholder="Karyawan Swasta / Wiraswasta"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                No. HP / WhatsApp
              </label>
              <input 
                type="text" 
                value={formData.telepon} 
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                placeholder="0812-..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 600,
                color: '#475569'
              }}
            >
              Batal
            </button>
            <button 
              type="submit"
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                background: '#3B7594',
                fontSize: '14px',
                fontWeight: 700,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Check size={16} />
              Simpan Data Warga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
