const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Start the backend (cd backend && npm run dev) and ensure MongoDB is running (e.g. mongod or brew services start mongodb-community).');
    }
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}

export const api = {
  auth: {
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me'),
  },
  products: {
    list: () => request('/products'),
    get: (id) => request(`/products/${id}`),
    byBarcode: (barcode) => request(`/products/barcode/${encodeURIComponent(barcode)}`),
    create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  },
  warehouses: {
    list: () => request('/warehouses'),
    get: (id) => request(`/warehouses/${id}`),
    create: (body) => request('/warehouses', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/warehouses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/warehouses/${id}`, { method: 'DELETE' }),
  },
  receipts: { list: () => request('/receipts'), get: (id) => request(`/receipts/${id}`), create: (body) => request('/receipts', { method: 'POST', body: JSON.stringify(body) }) },
  deliveries: { list: () => request('/deliveries'), get: (id) => request(`/deliveries/${id}`), create: (body) => request('/deliveries', { method: 'POST', body: JSON.stringify(body) }) },
  transfers: { list: () => request('/transfers'), get: (id) => request(`/transfers/${id}`), create: (body) => request('/transfers', { method: 'POST', body: JSON.stringify(body) }) },
  adjustments: { list: () => request('/adjustments'), get: (id) => request(`/adjustments/${id}`), create: (body) => request('/adjustments', { method: 'POST', body: JSON.stringify(body) }) },
  moveHistory: { list: (params) => request(`/move-history${params ? '?' + new URLSearchParams(params).toString() : ''}`) },
  analytics: { dashboard: () => request('/analytics/dashboard'), inventoryValue: () => request('/analytics/inventory-value'), movementTrends: (days) => request(`/analytics/movement-trends?days=${days || 30}`) },
  ai: { restockingPrediction: () => request('/ai/restocking-prediction') },
  alerts: { lowStock: () => request('/alerts/low-stock') },
};
