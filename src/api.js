import axios from 'axios';

// Base API URL - Django REST Framework
const API_BASE_URL = 'http://localhost:8000/api';

// Authentication endpoints
const AUTH_URLS = {
    login: `${API_BASE_URL}/token/`,
    refresh: `${API_BASE_URL}/token/refresh/`,
    logout: `${API_BASE_URL}/auth/logout/`,
};

// API endpoints
const API_ENDPOINTS = {
    items: `${API_BASE_URL}/items/`,
    byStatus: `${API_BASE_URL}/items/by_status/`,
    expiryReport: `${API_BASE_URL}/items/expiry_report/`,
    expiryStats: `${API_BASE_URL}/items/expiry_stats/`,
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await axios.post(AUTH_URLS.refresh, {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to attach the Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Handle login to get JWT tokens
export const login = async (username, password) => {
  try {
    console.log('Attempting login to:', AUTH_URLS.login);
    const response = await axios.post(AUTH_URLS.login, { 
      username, 
      password 
    });
    
    const { access, refresh } = response.data;
    
    if (!access) {
      throw new Error('No access token received from server');
    }
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', access);
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
    }
    
    console.log('✓ Login successful, tokens stored');
    return access;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Refresh the token when access token expires
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) throw new Error('No refresh token found');

  try {
    const response = await api.post('/token/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('accessToken', access);
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

// Fetch all items
export const fetchItems = async (searchQuery = '') => {
  try {
    const response = await api.get(`/items/?q=${encodeURIComponent(searchQuery)}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Add a new item
export const addItem = async (itemData) => {
  try {
    const response = await api.post('/items/', itemData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id) => {
  try {
    await api.delete(`/items/${id}/`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export default api;