// Backend Detection Utility
// Automatically detects which backend endpoint is available

import { API_CONFIG } from './apiConfig.js';

// All possible backend endpoints to try
export const BACKEND_OPTIONS = [
  {
    name: 'Django REST (localhost:8000)',
    baseUrl: 'http://localhost:8000/api',
    endpoints: {
      items: '/items/',
      medicines: '/medicines/',
      auth: '/token/',
    }
  },
  {
    name: 'Django REST (127.0.0.1:8000)',
    baseUrl: 'http://127.0.0.1:8000/api',
    endpoints: {
      items: '/items/',
      medicines: '/medicines/',
      auth: '/token/',
    }
  },
  {
    name: 'Node.js/Express (localhost:3001)',
    baseUrl: 'http://localhost:3001/api',
    endpoints: {
      items: '/items/',
      medicines: '/medicines/',
      auth: '/auth/login/',
    }
  },
  {
    name: 'Flask/FastAPI (localhost:5000)',
    baseUrl: 'http://localhost:5000/api',
    endpoints: {
      items: '/items/',
      medicines: '/medicines/',
      auth: '/token/',
    }
  }
];

// Test if a backend endpoint is accessible
export const testEndpoint = async (url, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'HEAD', // Just check if endpoint exists
      headers,
    });

    return {
      available: response.status !== 404,
      authenticated: response.status !== 401,
      status: response.status
    };
  } catch (error) {
    return {
      available: false,
      authenticated: false,
      error: error.message
    };
  }
};

// Detect available backend
export const detectBackend = async (token = null) => {
  console.log('🔍 Detecting available backend...');
  
  for (const backend of BACKEND_OPTIONS) {
    console.log(`Testing ${backend.name}...`);
    
    // Test items endpoint
    const itemsTest = await testEndpoint(
      `${backend.baseUrl}${backend.endpoints.items}`,
      token
    );
    
    // Test medicines endpoint as fallback
    const medicinesTest = await testEndpoint(
      `${backend.baseUrl}${backend.endpoints.medicines}`,
      token
    );
    
    if (itemsTest.available || medicinesTest.available) {
      const primaryEndpoint = itemsTest.available ? 'items' : 'medicines';
      console.log(`✅ Found working backend: ${backend.name}`);
      console.log(`📊 Primary endpoint: ${primaryEndpoint}`);
      
      return {
        ...backend,
        primaryEndpoint,
        itemsEndpoint: itemsTest.available ? backend.endpoints.items : backend.endpoints.medicines,
        authRequired: !itemsTest.authenticated || !medicinesTest.authenticated
      };
    }
  }
  
  console.log('❌ No working backend detected');
  return null;
};

// Get the working API URL for items
export const getWorkingItemsUrl = async (token = null) => {
  const backend = await detectBackend(token);
  if (backend) {
    return `${backend.baseUrl}${backend.itemsEndpoint}`;
  }
  throw new Error('No working backend endpoint found');
};

export default detectBackend;