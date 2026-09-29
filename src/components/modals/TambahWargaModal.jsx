import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, Edit3, AlertCircle, ShieldCheck } from 'lucide-react';

export default function TambahWargaModal({ isOpen, onClose, onSave, citizenToEdit = null }) {
  const initialFormState = {
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
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (citizenToEdit) {
      setFormData({
        nama: citizenToEdit.nama || '',
        nik: citizenToEdit.nik || '',
        noKk: citizenToEdit.noKk || '',
        jenisKelamin: citizenToEdit.jenisKelamin || 'Laki-laki',
        tempatLahir: citizenToEdit.tempatLahir || '',
        tanggalLahir: citizenToEdit.tanggalLahir || '',
        agama: citizenToEdit.agama || 'Islam',
        statusKawin: citizenToEdit.statusKawin || 'Kawin',
        pekerjaan: citizenToEdit.pekerjaan || '',
        alamat: citizenToEdit.alamat || '',
        blok: citizenToEdit.blok || 'A1',
        noRumah: citizenToEdit.noRumah || '',
        statusTinggal: citizenToEdit.statusTinggal || 'Tetap',
        telepon: citizenToEdit.telepon || '',
        peranKeluarga: citizenToEdit.peranKeluarga || 'Kepala Keluarga',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrorMessage('');
  }, [citizenToEdit, isOpen]);

  if (!isOpen) return null;

  // Strict numeric handler for NIK and KK
  const handleNumericChange = (field, maxLen = 16) => (e) => {
    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, maxLen);
    setFormData(prev => ({ ...prev, [field]: numericOnly }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict validation
    if (!formData.nama.trim()) {
      setErrorMessage('Nama Lengkap wajib diisi.');
      return;
    }

    if (!formData.nik || formData.nik.length !== 16) {
      setErrorMessage(`NIK harus tepat 16 digit angka! (Saat ini: ${formData.nik?.length || 0} digit)`);
      return;
    }

    if (formData.noKk && formData.noKk.length !== 16) {
      setErrorMessage(`No. Kartu Keluarga harus tepat 16 digit angka jika diisi! (Saat ini: ${formData.noKk.length} digit)`);
      return;
    }

    const compiledAlamat = formData.alamat || `Jl. Melati Blok ${formData.blok} No. ${formData.noRumah || '01'}`;

    if (citizenToEdit) {
      // Edit mode
      onSave({
        ...citizenToEdit,
        ...formData,
        alamat: compiledAlamat
      });
    } else {
      // Create mode
      onSave({
        ...formData,
        id: Date.now(),
        statusIuran: 'Lunas',
        tanggalDaftar: new Date().toISOString().split('T')[0],
        alamat: compiledAlamat
      });
    }

    onClose();
  };

  const isEditMode = Boolean(citizenToEdit);

  return (
    <div className="modal-backdrop">
      <div className="modal-content-box" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: isEditMode ? '#fef3c7' : '#eaf3f8',
              color: isEditMode ? '#d97706' : '#3B7594',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isEditMode ? <Edit3 size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                {isEditMode ? 'Edit Data Kependudukan Warga' : 'Tambah Data Warga Baru'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                {isEditMode ? `Mengubah data: ${citizenToEdit.nama}` : 'Input data kependudukan RT 007 / RW 030'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            type="button"
            style={{
              background: '#e2e8f0',
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#fee2e2',
              color: '#991b1b',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '18px',
              border: '1px solid #fecaca'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Row 1: Nama & NIK */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  NIK (16 Digit) *
                </label>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: formData.nik.length === 16 ? '#16a34a' : '#d97706'
                }}>
                  {formData.nik.length}/16 digit {formData.nik.length === 16 && '✓'}
                </span>
              </div>
              <input 
                type="text" 
                required
                inputMode="numeric"
                maxLength={16}
                value={formData.nik} 
                onChange={handleNumericChange('nik', 16)}
                placeholder="3275010000000000"
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: '8px', 
                  border: formData.nik.length === 16 ? '1.5px solid #22c55e' : '1px solid #cbd5e1', 
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.5px'
                }}
              />
            </div>
          </div>

          {/* Row 2: No KK & Jenis Kelamin */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  No. Kartu Keluarga (KK)
                </label>
                {formData.noKk && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: formData.noKk.length === 16 ? '#16a34a' : '#d97706'
                  }}>
                    {formData.noKk.length}/16 digit {formData.noKk.length === 16 && '✓'}
                  </span>
                )}
              </div>
              <input 
                type="text" 
                inputMode="numeric"
                maxLength={16}
                value={formData.noKk} 
                onChange={handleNumericChange('noKk', 16)}
                placeholder="3275010000000000"
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: '8px', 
                  border: formData.noKk?.length === 16 ? '1.5px solid #22c55e' : '1px solid #cbd5e1', 
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.5px'
                }}
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

          {/* Row 3: Tempat Lahir & Tanggal Lahir */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Tempat Lahir
              </label>
              <input 
                type="text" 
                value={formData.tempatLahir} 
                onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                placeholder="Contoh: Jakarta / Bekasi"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Tanggal Lahir
              </label>
              <input 
                type="date" 
                value={formData.tanggalLahir} 
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Row 4: Agama, Status Kawin & Peran Keluarga */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Agama
              </label>
              <select 
                value={formData.agama} 
                onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Status Perkawinan
              </label>
              <select 
                value={formData.statusKawin} 
                onChange={(e) => setFormData({ ...formData, statusKawin: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
              >
                <option value="Kawin">Kawin</option>
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                Peran Keluarga
              </label>
              <select 
                value={formData.peranKeluarga} 
                onChange={(e) => setFormData({ ...formData, peranKeluarga: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
              >
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Famili Lain">Famili Lain</option>
              </select>
            </div>
          </div>

          {/* Row 5: Blok, No Rumah, Status Tinggal */}
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

          {/* Row 6: Pekerjaan & Telepon */}
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

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button 
              type="submit"
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                background: isEditMode ? '#d97706' : '#3B7594',
                fontSize: '14px',
                fontWeight: 700,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isEditMode ? '0 4px 12px rgba(217, 119, 6, 0.3)' : '0 4px 12px rgba(59, 117, 148, 0.3)'
              }}
            >
              <Check size={16} />
              {isEditMode ? 'Simpan Perubahan' : 'Simpan Data Warga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
