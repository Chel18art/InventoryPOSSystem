import axios from 'axios';

// ✅ Base URL of your Django backend
const BASE_URL = 'http://192.168.229.113:8000/api';

// ✅ Auth token management
let authToken = null;

// Set token
export const setAuthToken = (token) => {
  authToken = token;
};

// Get token
export const getAuthToken = () => authToken;

// Get headers with Authorization if token exists
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken && { Authorization: `Token ${authToken}` }),
});

// ✅ LOGIN
export const handleLogin = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/`, { username, password }, {
      headers: getHeaders(),
    });
    const token = response.data.token;
    setAuthToken(token);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || error.message;
    alert('Login failed: ' + message);
    return null;
  }
};

// ✅ FETCH INVENTORY ITEMS
export const getInventoryItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/items/`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    alert('Error fetching items: ' + (error.response?.data?.detail || error.message));
    return [];
  }
};

// ✅ TOTAL ITEMS
export const getTotalItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/total-items/`, {
      headers: getHeaders(),
    });
    return response.data.total_items;
  } catch (error) {
    console.error('Error fetching total items:', error);
    return 0;
  }
};

// ✅ TOTAL SALES
export const getTotalSales = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/total-sales/`, {
      headers: getHeaders(),
    });
    return response.data.total_sales;
  } catch (error) {
    console.error('Error fetching total sales:', error);
    return 0;
  }
};

// ✅ DASHBOARD STATS (recommended API for dashboard)
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      total_items: 0,
      total_sales: 0,
      total_categories: 0,
      total_users: 0,
    };
  }
};

// ✅ REFRESH TOKEN (optional if using JWT refresh endpoint)
export const refreshToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/token/refresh/`, {
      token: getAuthToken(),
    });
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};
