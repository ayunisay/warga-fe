const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api';

/**
 * Helper request wrapper with token and JSON headers
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: (credentials) =>
      request('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    logout: () =>
      request('/logout', {
        method: 'POST',
      }),
    me: () => request('/user'),
  },

  // Citizens (Data Warga)
  citizens: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/citizens${qs ? `?${qs}` : ''}`);
    },
    create: (citizenData) =>
      request('/citizens', {
        method: 'POST',
        body: JSON.stringify(citizenData),
      }),
    getById: (id) => request(`/citizens/${id}`),
    update: (id, citizenData) =>
      request(`/citizens/${id}`, {
        method: 'PUT',
        body: JSON.stringify(citizenData),
      }),
    delete: (id) =>
      request(`/citizens/${id}`, {
        method: 'DELETE',
      }),
    toggleIuran: (id) =>
      request(`/citizens/${id}/toggle-iuran`, {
        method: 'PATCH',
      }),
  },

  // Keuangan & Kas
  transactions: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/transactions${qs ? `?${qs}` : ''}`);
    },
    create: (trxData) =>
      request('/transactions', {
        method: 'POST',
        body: JSON.stringify(trxData),
      }),
    getSummary: () => request('/transactions/summary'),
  },

  // Verifikasi Transfer Iuran
  transfers: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/transfers${qs ? `?${qs}` : ''}`);
    },
    create: (transferData) =>
      request('/transfers', {
        method: 'POST',
        body: JSON.stringify(transferData),
      }),
    verify: (id, verificationData) =>
      request(`/transfers/verify/${id}`, {
        method: 'POST',
        body: JSON.stringify(verificationData),
      }),
  },

  // Payment Gateway Otomatis (Midtrans / Tripay: Dynamic QRIS & Virtual Account)
  payments: {
    charge: (chargeData) =>
      request('/payments/charge', {
        method: 'POST',
        body: JSON.stringify(chargeData),
      }),
    checkStatus: (orderId) => request(`/payments/status/${orderId}`),
    simulatePayment: (orderId) =>
      request(`/payments/simulate/${orderId}`, {
        method: 'POST',
      }),
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/payments${qs ? `?${qs}` : ''}`);
    },
  },

  // Surat Pengantar
  surat: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/surat${qs ? `?${qs}` : ''}`);
    },
    create: (suratData) =>
      request('/surat', {
        method: 'POST',
        body: JSON.stringify(suratData),
      }),
    updateStatus: (id, statusData) =>
      request(`/surat/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData),
      }),
    verifyToken: (token) => request(`/surat/verify/${token}`),
  },

  // Informasi & Agenda RT
  announcements: {
    getAll: () => request('/announcements'),
    create: (data) =>
      request('/announcements', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/announcements/${id}`, {
        method: 'DELETE',
      }),
  },

  // Pengguna & Pengurus
  users: {
    getAll: () => request('/users'),
    create: (userData) =>
      request('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    update: (id, userData) =>
      request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
    delete: (id) =>
      request(`/users/${id}`, {
        method: 'DELETE',
      }),
  },

  // Dashboard Stats & RT Info
  dashboard: {
    getStats: () => request('/dashboard/stats'),
    getRtInfo: () => request('/rt-info'),
  },
};

export default api;
