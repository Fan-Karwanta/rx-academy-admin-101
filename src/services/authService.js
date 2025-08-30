import axios from 'axios';
import { API_BASE_URL } from '../config';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Auth service functions
export const authService = {
  // Login admin
  login: async (username, password) => {
    try {
      console.log('Attempting login with:', { username });
      
      // Use the admin login endpoint with username
      const response = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
        username,
        password
      }, {
        withCredentials: true
      });
      
      console.log('Login response:', response.data);
      
      // Store user info in localStorage (token is in HTTP-only cookie)
      localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Logout admin
  logout: async () => {
    try {
      await axios.post(`${API_BASE_URL}/admin/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_user');
    }
  },
  
  // Check if user is logged in
  isLoggedIn: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/auth/verify`, {
        withCredentials: true
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  },
  
  // Get current user
  getCurrentUser: () => {
    const userJson = localStorage.getItem('admin_user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  // Verify authentication
  verifyAuth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/auth/verify`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
        return response.data.admin;
      }
      
      return null;
    } catch (error) {
      console.error('Auth verification error:', error.response?.data || error.message);
      localStorage.removeItem('admin_user');
      return null;
    }
  }
};
