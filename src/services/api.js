// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // Products
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/products?${queryString}`);
  },
  
  getProduct: (id) => {
    return fetch(`${API_BASE_URL}/products/${id}`);
  },
  
  getFeaturedProducts: () => {
    return fetch(`${API_BASE_URL}/products/featured/list`);
  },
  
  // Auth
  login: (credentials) => {
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  },
  
  register: (userData) => {
    return fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  },
  
  // Orders
  createOrder: (orderData, token) => {
    return fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
  }
};