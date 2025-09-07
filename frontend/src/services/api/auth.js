import { ENDPOINTS, API_BASE_URL, DEFAULT_HEADERS } from './config';

/**
 * Authentication service for handling user login, registration, and token management
 */
class AuthService {
  /**
   * Login user with email/username and password
   * @param {string} identifier - Email or username
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and tokens
   */
  static async login(identifier, password) {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      this.setAuthTokens(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data
   */
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @returns {Promise<Object>} New tokens
   */
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.setAuthTokens(data);
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthTokens();
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  static async getCurrentUser() {
    try {
      const response = await this.authRequest(ENDPOINTS.AUTH.PROFILE, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Make an authenticated request with token refresh if needed
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  static async authRequest(url, options = {}) {
    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers,
      Authorization: `Bearer ${this.getAccessToken()}`,
    };

    let response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // If token expired, try to refresh it and retry the request
    if (response.status === 401) {
      try {
        await this.refreshToken();
        headers.Authorization = `Bearer ${this.getAccessToken()}`;
        response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
        });
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        this.clearAuthTokens();
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
    }

    return response;
  }

  // Helper methods for token management
  static setAuthTokens({ access_token, refresh_token }) {
    if (access_token) localStorage.setItem('access_token', access_token);
    if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
  }

  static getAccessToken() {
    return localStorage.getItem('access_token');
  }

  static clearAuthTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  static isAuthenticated() {
    return !!this.getAccessToken();
  }

  static logout() {
    this.clearAuthTokens();
    window.location.href = '/login';
  }
}

export default AuthService;
