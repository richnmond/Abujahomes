// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  // Properties endpoints
  PROPERTIES: {
    LIST: `${API_BASE_URL}/api/properties`,
    DETAIL: (id) => `${API_BASE_URL}/api/properties/${id}`,
    CREATE: `${API_BASE_URL}/api/properties`,
    UPDATE: (id) => `${API_BASE_URL}/api/properties/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/properties/${id}`,
  },
  // Bookings endpoints
  BOOKINGS: {
    LIST: `${API_BASE_URL}/api/bookings`,
    CREATE: `${API_BASE_URL}/api/bookings`,
    DETAIL: (id) => `${API_BASE_URL}/api/bookings/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/bookings/${id}`,
    CANCEL: (id) => `${API_BASE_URL}/api/bookings/${id}/cancel`,
  },
  // Payments endpoints
  PAYMENTS: {
    INITIALIZE: `${API_BASE_URL}/api/payments/initialize`,
    VERIFY: `${API_BASE_URL}/api/payments/verify`,
  },
  // Admin endpoints
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    PROPERTIES: `${API_BASE_URL}/api/admin/properties`,
  },
};

export default API_ENDPOINTS;
