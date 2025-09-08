class AIIntegration {
    constructor(prepViewAppInstance) {
        this.conversationHistory = [];
        this.app = prepViewAppInstance;
    }

    /**
     * Assesses an interview answer by sending it to a server-side AI model.
     * @param {object} question The question object.
     * @param {string} answer The user's answer.
     * @returns {Promise<object>} The assessment object from the API.
     */
    async assessInterviewAnswer(question, answer) {
        const payload = {
            question: question.question,
            user_answer: answer,
            expected_points: question.expected_points,
            ideal_answer_outline: question.ideal_answer_outline,
        };

        try {
            const response = await fetch('/api/v1/assess_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error assessing interview answer:', error);
            return {
                score: 0,
                feedback: 'An error occurred during assessment. Please try again later.',
                strengths: [],
                improvements: [],
            };
        }
    }

    /**
     * Provides real-time feedback on an interview answer.
     * @param {string} answer The user's partial or complete answer.
     * @returns {Promise<string>} A string containing the real-time feedback.
     */
    async getRealTimeFeedback(answer) {
        try {
            const response = await fetch('/api/v1/real_time_feedback', {
                method: 'POST', // The server needs to accept this method.
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answer: answer,
                }),
            });

            if (!response.ok) {
                // Check for a 405 error specifically and handle it gracefully
                if (response.status === 405) {
                    console.error("Method Not Allowed. The server endpoint does not accept POST requests.");
                    return "Feedback is temporarily unavailable.";
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.feedback; // Assuming the API returns a JSON object with a 'feedback' property.
        } catch (error) {
            console.error('Real-time feedback error:', error);
            return "Thinking...";
        }
    }

    /**
     * Generates a personalized analysis of the user's hexagon stats.
     * @param {object} user The current user object.
     * @returns {Promise<object>} The AI-generated insights.
     */
    async generateHexagonInsights(user) {
        try {
            const response = await fetch(`/api/v1/users/${user.username}/insights/hexagon`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hexagon_stats: user.hexagonStats }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating hexagon insights:', error);
            return {
                summary: 'Unable to generate insights at this time. Please try again later.',
                strengths: [],
                areasForImprovement: [],
                recommendations: [],
            };
        }
    }

    /**
     * Generates an analysis of the user's interview history and progress.
     * @param {array} history The user's interview history.
     * @returns {Promise<object>} The AI-generated analysis.
     */
    async generateProgressAnalysis(history) {
        try {
            const response = await fetch('/api/v1/analysis/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ interview_history: history }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating progress analysis:', error);
            return {
                summary: 'Unable to generate progress analysis at this time.',
                trends: [],
                recommendations: [],
            };
        }
    }

    /**
     * Calculates a salary range based on a user's profile and market data.
     * @param {object} profile The user's profile data (experience, skills, etc.).
     * @returns {Promise<object>} The calculated salary data and insights.
     */
    async calculateSalaryRange(profile) {
        try {
            const response = await fetch('/api/v1/salary/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error calculating salary range:', error);
            return {
                range: { min: 0, max: 0 },
                median: 0,
                marketComparison: { percentile25: 0, percentile75: 0, average: 0 },
                insights: 'An error occurred during salary calculation. Please try again later.',
            };
        }
    }

    /**
     * Chats with the AI assistant.
     * @param {string} message The user's message.
     * @returns {Promise<string>} The AI's response.
     */
    async chatWithAI(message) {
        this.addToHistory(message, true);

        const payload = {
            prompt: message,
            history: this.conversationHistory,
        };

        try {
            const response = await fetch('/api/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botResponse = data.response;
            this.addToHistory(botResponse, false);
            return botResponse;
        } catch (error) {
            console.error('Chat error:', error);
            const fallbackResponse = "I'm sorry, I'm having trouble responding right now. Please try again later.";
            this.addToHistory(fallbackResponse, false);
            return fallbackResponse;
        }
    }

    // Existing methods that don't need to call the server
    getConversationHistory() {
        return this.conversationHistory;
    }

    addToHistory(message, isUser = true) {
        const role = isUser ? 'user' : 'bot';
        this.conversationHistory.push({ role, content: message, timestamp: new Date().toISOString() });
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}
