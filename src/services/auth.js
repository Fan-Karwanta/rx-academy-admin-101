import { authAPI } from './api.js';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('rx_admin_token');
    this.user = JSON.parse(localStorage.getItem('rx_admin_user') || 'null');
  }

  async login(email, password) {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        this.token = response.data.token;
        this.user = response.data.user;
        
        // Store in localStorage
        localStorage.setItem('rx_admin_token', this.token);
        localStorage.setItem('rx_admin_user', JSON.stringify(this.user));
        localStorage.setItem('rx_admin_logged_in', 'true');
        
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      if (!this.token) {
        throw new Error('No token available');
      }

      const response = await authAPI.getCurrentUser();
      
      if (response.success) {
        this.user = response.data.user;
        localStorage.setItem('rx_admin_user', JSON.stringify(this.user));
        return this.user;
      }
      
      throw new Error(response.message || 'Failed to get user');
    } catch (error) {
      console.error('Get current user error:', error);
      this.logout();
      throw error;
    }
  }

  async logout() {
    try {
      if (this.token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.token = null;
      this.user = null;
      localStorage.removeItem('rx_admin_token');
      localStorage.removeItem('rx_admin_user');
      localStorage.removeItem('rx_admin_logged_in');
    }
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  // Check if user has specific permission
  hasPermission(permission) {
    return this.user?.permissions?.includes(permission) || false;
  }

  // Check if user is super admin
  isSuperAdmin() {
    return this.user?.role === 'super_admin';
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
