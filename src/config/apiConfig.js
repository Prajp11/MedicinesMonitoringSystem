// Backend API Configuration - Django REST Framework

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
};

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  login: `${API_CONFIG.BASE_URL}/token/`,
  refresh: `${API_CONFIG.BASE_URL}/token/refresh/`,
};

// Data endpoints
export const DATA_ENDPOINTS = {
  items: `${API_CONFIG.BASE_URL}/items/`,
  byStatus: `${API_CONFIG.BASE_URL}/items/by_status/`,
  expiryReport: `${API_CONFIG.BASE_URL}/items/expiry_report/`,
  expiryStats: `${API_CONFIG.BASE_URL}/items/expiry_stats/`,
};

// Data endpoints
export const DATA_ENDPOINTS = {
  // Try different endpoint names based on your backend:
  items: `${API_CONFIG.BASE_URL}/items/`,
  medicines: `${API_CONFIG.BASE_URL}/medicines/`,
  inventory: `${API_CONFIG.BASE_URL}/inventory/`,
  products: `${API_CONFIG.BASE_URL}/products/`,
};

// Request headers
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Get authorization header
export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export default API_CONFIG;