import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Backend API base URL
  timeout: 10000, // Optional timeout
});

// Helper function to attach the Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Handle login to get JWT tokens
export const login = async (username, password) => {
  try {
    // For demo purposes, simulate API call with hardcoded credentials
    if (username === 'Prajwalp11' && password === 'Prajwal@123') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return a dummy JWT token
      const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6IlByYWp3YWxwMTEiLCJleHAiOjE3NDAyMjU2MDB9.dummy_signature';
      return dummyToken;
    } else {
      // Simulate authentication error
      throw new Error('Invalid credentials');
    }
    
    // Original backend code (commented out for demo):
    /*
    const response = await api.post('/token/', { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem('accessToken', access); // Store the tokens
    localStorage.setItem('refreshToken', refresh);
    return access; // Return the access token
    */
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Throw error to be caught in the component
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