import axios from 'axios';

// ✅ Set your backend IP here
const BASE_URL = 'http://192.168.92.114:8000/api'; // <-- Update this if IP changes

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
    alert('Error fetching inventory items.');
    return [];
  }
};

// ✅ FETCH TOTAL ITEMS (returns count or list depending on backend)
export const getTotalItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/items/`, {
      headers: getHeaders(),
    });

    const data = response.data;

    // Handle both array and paginated result
    if (Array.isArray(data)) {
      return data.length;
    } else if (data.count !== undefined) {
      return data.count;
    } else {
      console.warn('Unexpected response format for total items:', data);
      return 0;
    }
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

// ✅ DASHBOARD STATS
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

// ✅ ADD ITEM
export const addItem = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/items/`, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// ✅ FETCH CATEGORIES
export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories/`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// ✅ REFRESH TOKEN (JWT-based flow)
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

// ✅ GET ITEM DETAILS (optional)
export const getItemDetails = async (itemId) => {
  try {
    const response = await axios.get(`${BASE_URL}/items/${itemId}/`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    return null;
  }
};
