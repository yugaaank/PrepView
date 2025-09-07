import { ENDPOINTS } from './config';
import AuthService from './auth';

/**
 * Interview service for handling interview-related API calls
 */
class InterviewService {
  /**
   * Start a new interview session
   * @param {string} interviewType - Type of interview (e.g., 'technical', 'behavioral', 'mixed')
   * @returns {Promise<Object>} Created interview session with first question
   */
  static async startInterview(interviewType) {
    try {
      const response = await AuthService.authRequest(ENDPOINTS.INTERVIEWS.BASE, {
        method: 'POST',
        body: JSON.stringify({
          session_type: interviewType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start interview');
      }

      return await response.json();
    } catch (error) {
      console.error('Start interview error:', error);
      throw error;
    }
  }

  /**
   * Submit a response to an interview question
   * @param {string} sessionId - Interview session ID
   * @param {string} question - The question being answered
   * @param {string} userResponse - User's response to the question
   * @returns {Promise<Object>} Evaluation and next question
   */
  static async submitResponse(sessionId, question, userResponse) {
    try {
      const response = await AuthService.authRequest(
        ENDPOINTS.INTERVIEWS.RESPOND(sessionId),
        {
          method: 'POST',
          body: JSON.stringify({
            question,
            user_response: userResponse,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to submit response');
      }

      return await response.json();
    } catch (error) {
      console.error('Submit response error:', error);
      throw error;
    }
  }

  /**
   * Complete an interview session
   * @param {string} sessionId - Interview session ID
   * @returns {Promise<Object>} Interview summary
   */
  static async completeInterview(sessionId) {
    try {
      const response = await AuthService.authRequest(
        ENDPOINTS.INTERVIEWS.COMPLETE(sessionId),
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to complete interview');
      }

      return await response.json();
    } catch (error) {
      console.error('Complete interview error:', error);
      throw error;
    }
  }

  /**
   * List all interviews for the current user
   * @param {Object} params - Query parameters (skip, limit, status, etc.)
   * @returns {Promise<Array>} List of interviews
   */
  static async listInterviews(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${ENDPOINTS.INTERVIEWS.BASE}${query ? `?${query}` : ''}`;
      
      const response = await AuthService.authRequest(url);

      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }

      return await response.json();
    } catch (error) {
      console.error('List interviews error:', error);
      throw error;
    }
  }

  /**
   * Get interview details by ID
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object>} Interview details
   */
  static async getInterview(interviewId) {
    try {
      const response = await AuthService.authRequest(
        ENDPOINTS.INTERVIEWS.BY_ID(interviewId)
      );

      if (!response.ok) {
        throw new Error('Failed to fetch interview details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get interview error:', error);
      throw error;
    }
  }
}

export default InterviewService;
