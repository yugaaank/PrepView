/**
 * Handles API response and error handling consistently
 * @param {Promise<Response>} apiCall - The fetch promise
 * @returns {Promise<{data: any, error: Error|null}>} Object containing data or error
 */
export async function handleApiResponse(apiCall) {
  try {
    const response = await apiCall;
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.detail || 'API request failed');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { data: null, error: null };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error };
  }
}

/**
 * Creates URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} Formatted URL with query parameters
 */
export function createUrlWithParams(baseUrl, params = {}) {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Handles API errors consistently
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error, defaultMessage = 'An error occurred') {
  if (!error) return defaultMessage;
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
}
