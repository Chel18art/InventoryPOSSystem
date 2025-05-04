import axios from 'axios';

// ✅ Set your backend IP here
const BASE_URL = 'http://192.168.87.113:8000/api'; // <-- Update this if IP changes

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

// ✅ FETCH SALES REPORT
export const getSalesReport = async (period, from_date = null, to_date = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/sales_report/`, {
      params: {
        period,      // e.g., 'today', 'week', 'month', 'year', or custom date range
        from_date,   // Starting date (required for custom range)
        to_date,     // Ending date (required for custom range)
      },
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

// ✅ GET INVENTORY ITEMS
export const getInventoryItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/items/`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || 'Error fetching inventory items.';
    console.error(message);
    alert(message);
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
    console.error('Error fetching total items:', error.response?.data?.detail || error.message);
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
    console.error('Error fetching dashboard stats:', error.response?.data?.detail || error.message);
    return {
      total_items: 0,
      total_sales: 0,
      total_categories: 0,
      total_users: 0,
    };
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
    console.error('Error fetching categories:', error.response?.data?.detail || error.message);
    return [];
  }
};

// ✅ REFRESH TOKEN (JWT-based flow)
export const refreshToken = async () => {
  const token = getAuthToken();
  if (!token) {
    console.warn('No token available to refresh.');
    return null;
  }

  try {
    const response = await axios.post(`${BASE_URL}/token/refresh/`, {
      token: token,
    });
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data?.detail || error.message);
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
    console.error(`Error fetching item ${itemId}:`, error.response?.data?.detail || error.message);
    return null;
  }
};


// ✅ FETCH USERS
export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data?.detail || error.message);
    return [];
  }
};


  
export const getSuppliers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/suppliers/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error.response?.data?.detail || error.message);
    return [];
  }
};
