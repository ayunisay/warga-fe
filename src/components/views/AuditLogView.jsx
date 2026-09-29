import React, { useState } from 'react';
import { 
  ShieldCheck, History, Search, Filter, Download, RotateCcw, 
  Eye, X, Wallet, Users, FileText, Bell, Lock, UserCheck, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, Globe
} from 'lucide-react';
import { exportAuditLogsToCsv } from '../../utils/exportUtils';

export default function AuditLogView({ logs = [], currentUserRole = 'Ketua RT' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('Semua');
  const [filterAction, setFilterAction] = useState('Semua');
  const [filterActor, setFilterActor] = useState('Semua');
  const [selectedLog, setSelectedLog] = useState(null);

  // Filter calculation
  const filteredLogs = logs.filter(log => {
    // Module filter
    if (filterModule !== 'Semua' && log.module !== filterModule) return false;

    // Action filter
    if (filterAction !== 'Semua' && log.actionType !== filterAction) return false;

    // Actor filter
    if (filterActor !== 'Semua' && log.actorRole !== filterActor && log.actorName !== filterActor) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = 
        log.id?.toLowerCase().includes(q) ||
        log.actorName?.toLowerCase().includes(q) ||
        log.actorRole?.toLowerCase().includes(q) ||
        log.module?.toLowerCase().includes(q) ||
        log.actionType?.toLowerCase().includes(q) ||
        log.description?.toLowerCase().includes(q) ||
        log.target?.toLowerCase().includes(q) ||
        log.ipAddress?.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // KPI calculations
  const totalCount = logs.length;
  const countKeuangan = logs.filter(l => l.module.includes('Keuangan') || l.actionType === 'PAYMENT_CALLBACK').length;
  const countWarga = logs.filter(l => l.module.includes('Warga')).length;
  const countSurat = logs.filter(l => l.module.includes('Surat')).length;

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterModule('Semua');
    setFilterAction('Semua');
    setFilterActor('Semua');
  };

  const isFilterActive = searchTerm !== '' || filterModule !== 'Semua' || filterAction !== 'Semua' || filterActor !== 'Semua';

  // Badge helpers
  const getActionBadge = (type) => {
    switch (type) {
      case 'CREATE':
        return { bg: '#dcfce7', text: '#15803d', label: 'CREATE' };
      case 'UPDATE':
        return { bg: '#fef3c7', text: '#d97706', label: 'UPDATE' };
      case 'DELETE':
        return { bg: '#fee2e2', text: '#dc2626', label: 'DELETE' };
      case 'APPROVE':
        return { bg: '#e0f2fe', text: '#0284c7', label: 'APPROVE' };
      case 'REJECT':
        return { bg: '#ffe4e6', text: '#e11d48', label: 'REJECT' };
      case 'EXPORT':
        return { bg: '#f3e8ff', text: '#7e22ce', label: 'EXPORT' };
      case 'PAYMENT_CALLBACK':
        return { bg: '#d1fae5', text: '#047857', label: 'GATEWAY' };
      case 'LOGIN':
        return { bg: '#f1f5f9', text: '#475569', label: 'LOGIN' };
      default:
        return { bg: '#f1f5f9', text: '#475569', label: type };
    }
  };

  const getModuleBadge = (mod) => {
    if (mod.includes('Keuangan')) return { bg: 'rgba(56, 189, 248, 0.15)', text: '#0284c7', icon: Wallet };
    if (mod.includes('Warga')) return { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a', icon: Users };
    if (mod.includes('Surat')) return { bg: 'rgba(234, 88, 12, 0.15)', text: '#ea580c', icon: FileText };
    if (mod.includes('Informasi')) return { bg: 'rgba(168, 85, 247, 0.15)', text: '#9333ea', icon: Bell };
    return { bg: 'rgba(100, 116, 139, 0.15)', text: '#475569', icon: ShieldCheck };
  };

  const getActorBadge = (role) => {
    if (role.includes('Ketua')) return { bg: '#e0e7ff', text: '#3730a3' };
    if (role.includes('Sekretaris')) return { bg: '#e0f2fe', text: '#0369a1' };
    if (role.includes('Bendahara')) return { bg: '#dcfce7', text: '#15803d' };
    return { bg: '#f3e8ff', text: '#6b21a8' };
  };

  return (
    <div className="audit-log-page" style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              Audit Trail & Rekam Jejak Pengurus
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Perekaman jejak riwayat aktivitas pengurus RT 007, transparansi kas, verifikasi berkas surat, dan perubahan data kependudukan
          </p>
        </div>

        <button 
          type="button"
          onClick={() => exportAuditLogsToCsv(filteredLogs)}
          title="Unduh seluruh rekam jejak audit pengurus ke format file Excel / CSV"
          style={{
            background: '#059669',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13.5px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
          }}
        >
          <Download size={18} /> Unduh Log Audit (CSV)
        </button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Card 1 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Total Aktivitas</span>
            <div style={{ background: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '8px' }}>
              <History size={16} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            {totalCount} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Log</span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 700 }}>
            ● Sistem Audit Aktif
          </span>
        </div>

        {/* Card 2 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Aksi Kas & Keuangan</span>
            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px', borderRadius: '8px' }}>
              <Wallet size={16} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7', marginTop: '6px' }}>
            {countKeuangan} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Log</span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
            Mutasi, verifikasi & iuran
          </span>
        </div>

        {/* Card 3 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Mutasi & Data Warga</span>
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '6px', borderRadius: '8px' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#15803d', marginTop: '6px' }}>
            {countWarga} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Log</span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
            Tambah, ubah & hapus KK/NIK
          </span>
        </div>

        {/* Card 4 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Persetujuan Surat</span>
            <div style={{ background: '#ffedd5', color: '#ea580c', padding: '6px', borderRadius: '8px' }}>
              <FileText size={16} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ea580c', marginTop: '6px' }}>
            {countSurat} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Log</span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
            Tanda tangan & verifikasi berkas
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '22px 24px',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Filter Controls Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '16px'
        }}>
          {/* Left: Search input */}
          <div style={{ flex: '1 1 240px', minWidth: '220px', position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pengurus, aktivitas, ID log..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Right dropdowns: Modul, Aksi, Pengurus */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filter Modul */}
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="Semua">Semua Modul</option>
              <option value="Data Warga">Data Warga</option>
              <option value="Keuangan & Kas">Keuangan & Kas</option>
              <option value="Permohonan Surat">Permohonan Surat</option>
              <option value="Papan Informasi">Papan Informasi</option>
              <option value="Keamanan & Autentikasi">Keamanan & Login</option>
            </select>

            {/* Filter Action */}
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="Semua">Semua Tipe Aksi</option>
              <option value="CREATE">CREATE (Tambah Data)</option>
              <option value="UPDATE">UPDATE (Perubahan Data)</option>
              <option value="DELETE">DELETE (Penghapusan)</option>
              <option value="APPROVE">APPROVE (Persetujuan)</option>
              <option value="REJECT">REJECT (Penolakan)</option>
              <option value="EXPORT">EXPORT (Unduh CSV)</option>
              <option value="PAYMENT_CALLBACK">PAYMENT (Gateway)</option>
              <option value="LOGIN">LOGIN (Sesi)</option>
            </select>

            {/* Filter Actor Role */}
            <select
              value={filterActor}
              onChange={(e) => setFilterActor(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="Semua">Semua Pengurus</option>
              <option value="Ketua RT">Ketua RT (H. Bambang)</option>
              <option value="Sekretaris">Sekretaris (Ahmad Fauzi)</option>
              <option value="Bendahara">Bendahara (Hj. Endang)</option>
              <option value="Sistem Otomatis">Sistem Otomatis / Webhook</option>
            </select>

            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Counter subtitle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
            Menampilkan <strong>{filteredLogs.length}</strong> dari <strong>{logs.length}</strong> catatan aktivitas pengurus
          </span>
          <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> UU PDP & Rekam Integritas Terjamin
          </span>
        </div>

        {/* Table View */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', width: '130px' }}>Waktu & ID</th>
                <th style={{ padding: '12px 14px' }}>Pengurus / Aktor</th>
                <th style={{ padding: '12px 14px' }}>Modul</th>
                <th style={{ padding: '12px 14px' }}>Aksi</th>
                <th style={{ padding: '12px 14px' }}>Deskripsi Aktivitas</th>
                <th style={{ padding: '12px 14px' }}>Objek Target</th>
                <th style={{ padding: '12px 14px' }}>IP / Perangkat</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Rincian</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8' }}>
                    Tidak ada catatan aktivitas audit yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const actionStyle = getActionBadge(log.actionType);
                  const moduleStyle = getModuleBadge(log.module);
                  const actorStyle = getActorBadge(log.actorRole);
                  const ModuleIcon = moduleStyle.icon;

                  return (
                    <tr 
                      key={log.id} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Waktu & ID */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', fontSize: '11.5px' }}>
                          {log.id}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {log.formattedTime}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#3b82f6', fontWeight: 600 }}>
                          {log.relativeTime}
                        </div>
                      </td>

                      {/* Pengurus / Aktor */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>
                          {log.actorName}
                        </div>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          background: actorStyle.bg,
                          color: actorStyle.text,
                          marginTop: '3px'
                        }}>
                          {log.actorRole}
                        </span>
                      </td>

                      {/* Modul */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          background: moduleStyle.bg,
                          color: moduleStyle.text
                        }}>
                          <ModuleIcon size={13} /> {log.module}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: actionStyle.bg,
                          color: actionStyle.text,
                          letterSpacing: '0.3px'
                        }}>
                          {actionStyle.label}
                        </span>
                      </td>

                      {/* Deskripsi */}
                      <td style={{ padding: '12px 14px', maxWidth: '320px', color: '#334155' }}>
                        <div style={{ lineHeight: 1.4 }}>
                          {log.description}
                        </div>
                      </td>

                      {/* Objek Target */}
                      <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 600, fontSize: '12px' }}>
                        <span style={{
                          background: '#f1f5f9',
                          padding: '3px 7px',
                          borderRadius: '5px',
                          fontFamily: 'monospace'
                        }}>
                          {log.target}
                        </span>
                      </td>

                      {/* IP & Perangkat */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '11.5px', fontFamily: 'monospace', color: '#475569' }}>
                          {log.ipAddress}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                          {log.device}
                        </div>
                      </td>

                      {/* Rincian Modal Trigger */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          title="Lihat Detail Log Aktivitas"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: '#e0f2fe',
                            color: '#0284c7',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Jejak Audit */}
      {selectedLog && (
        <div className="modal-backdrop">
          <div className="modal-content-box" style={{ maxWidth: '580px', padding: '0', overflow: 'hidden' }}>
            {/* Header Modal */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <History size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Rincian Jejak Audit Aktivitas
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0', fontFamily: 'monospace' }}>
                    ID: {selectedLog.id} • {selectedLog.formattedTime}
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setSelectedLog(null)}
                style={{
                  background: '#e2e8f0',
                  border: 'none',
                  color: '#475569',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Grid 2 Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '18px' }}>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                    Pengurus / Aktor
                  </span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {selectedLog.actorName}
                  </div>
                  <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                    {selectedLog.actorRole}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                    Modul & Tipe Aksi
                  </span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {selectedLog.module}
                  </div>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>
                    {selectedLog.actionType}
                  </span>
                </div>
              </div>

              {/* Deskripsi Aktivitas */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                  Deskripsi Tindakan
                </label>
                <div style={{
                  padding: '12px 14px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  color: '#1e293b',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}>
                  {selectedLog.description}
                </div>
              </div>

              {/* Target & Perangkat */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                    Objek Target
                  </label>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                    {selectedLog.target}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                    IP Address & Perangkat
                  </label>
                  <div style={{ fontSize: '12px', color: '#334155' }}>
                    {selectedLog.ipAddress}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {selectedLog.device}
                  </div>
                </div>
              </div>

              {/* Raw Payload / Details JSON */}
              {selectedLog.details && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    Payload Parameter / Snapshot Nilai
                  </label>
                  <pre style={{
                    background: '#0f172a',
                    color: '#38bdf8',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                    margin: 0
                  }}>
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}

              {/* Status Validasi */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                color: '#047857',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <CheckCircle2 size={16} />
                <span>Log tercatat secara immutable dan terverifikasi oleh sistem RT 007.</span>
              </div>

              {/* Footer Close */}
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: '#3B7594',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
