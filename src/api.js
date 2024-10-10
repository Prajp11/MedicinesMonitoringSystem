import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Your backend URL
});

// Handle login to get JWT tokens
export const login = async (username, password) => {
  try {
    const response = await api.post('/token/', { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem('accessToken', access); // Store the tokens
    localStorage.setItem('refreshToken', refresh);
    return access; // Return the access token
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Throw error to be caught in the component
  }
};

// Refresh token when access token expires
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken'); // Get refresh token from localStorage
  try {
    const response = await api.post('/token/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('accessToken', access); // Update access token
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Fetch items with token authentication
export const fetchItems = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await api.get('/items', {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the request header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export default api;