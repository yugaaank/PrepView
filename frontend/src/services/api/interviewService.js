// API service for interview-related operations
const API_BASE_URL = '/api/v1';

/**
 * Start a new interview session
 * @param {string} sessionType - Type of interview (technical, behavioral, mixed)
 * @returns {Promise<Object>} - The created interview session
 */
export const startInterview = async (sessionType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interviews/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ session_type: sessionType })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start interview');
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting interview:', error);
    throw error;
  }
};

/**
 * Submit a response to the current interview question
 * @param {number} sessionId - The interview session ID
 * @param {string} question - The interview question
 * @param {string} userResponse - The user's response
 * @returns {Promise<Object>} - The evaluation and next question
 */
export const submitResponse = async (sessionId, question, userResponse) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interviews/${sessionId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        question,
        user_response: userResponse
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit response');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting response:', error);
    throw error;
  }
};

/**
 * Complete the interview session
 * @param {number} sessionId - The interview session ID
 * @returns {Promise<Object>} - The interview summary and analysis
 */
export const completeInterview = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interviews/${sessionId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to complete interview');
    }

    return await response.json();
  } catch (error) {
    console.error('Error completing interview:', error);
    throw error;
  }
};

/**
 * Get interview session details
 * @param {number} sessionId - The interview session ID
 * @returns {Promise<Object>} - The interview session details
 */
export const getInterview = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interviews/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get interview');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting interview:', error);
    throw error;
  }
};
