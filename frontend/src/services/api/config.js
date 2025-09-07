// API configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = 'v1';

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
  },
  INTERVIEWS: {
    BASE: '/api/interviews',
    BY_ID: (id) => `/api/interviews/${id}`,
    RESPOND: (id) => `/api/interviews/${id}/respond`,
    COMPLETE: (id) => `/api/interviews/${id}/complete`,
  },
  QUESTIONS: {
    BASE: '/api/questions',
    BY_ID: (id) => `/api/questions/${id}`,
  },
};

// Default headers
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export { API_BASE_URL, API_VERSION, DEFAULT_HEADERS };
