class AIIntegration {
    constructor(prepViewAppInstance) {
        this.conversationHistory = [];
        this.app = prepViewAppInstance;
        this.assessmentCache = new Map();
    }

    /**
     * Assesses an interview answer by sending it to the AI service.
     * @param {object} question The question object.
     * @param {string} answer The user's answer.
     * @returns {Promise<object>} The assessment object from the API.
     */
    async assessInterviewAnswer(question, answer) {
        // Create a cache key
        const cacheKey = `${question.id}-${answer.substring(0, 50)}`;
        
        // Return cached result if available
        if (this.assessmentCache.has(cacheKey)) {
            return this.assessmentCache.get(cacheKey);
        }

        const payload = {
            question: question.question || '',
            answer: answer,
        };

        try {
            const response = await fetch('/submit_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            // Normalize to a common shape
            const normalized = {
                status: result.status || 'ok',
                score: result.score ?? 0,
                feedback: result.feedback || 'Answer processed',
                strengths: [],
                improvements: []
            };
            
            // Cache the result
            this.assessmentCache.set(cacheKey, normalized);
            
            return normalized;
        } catch (error) {
            console.error('Error assessing interview answer:', error);
            return this.getFallbackAssessment(question, answer, error);
        }
    }

    /**
     * Provides a fallback assessment when the AI service fails.
     * @private
     */
    getFallbackAssessment(question, answer, error) {
        // Simple fallback assessment based on answer length
        const answerLength = answer.length;
        let score = Math.min(100, Math.floor(answerLength / 5));
        
        return {
            status: 'success',
            score: score,
            feedback: 'Assessment service is currently unavailable. Using fallback scoring.',
            strengths: answerLength > 100 ? ['Detailed response'] : [],
            improvements: answerLength < 50 
                ? ['Please provide a more detailed answer'] 
                : ['Consider adding more specific examples'],
            isFallback: true,
            error: error?.message
        };
    }

    /**
     * Provides real-time feedback on an interview answer.
     * @param {string} answer The user's partial or complete answer.
     * @param {string} question The question being answered.
     * @returns {Promise<string>} A string containing the real-time feedback.
     */
    async getRealTimeFeedback(answer, question) {
        if (!answer || answer.trim().length < 10) {
            return 'Keep typing...';
        }

        try {
            const response = await fetch('/api/v1/real_time_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answer: answer,
                    question: question || 'General interview question'
                }),
            });

            if (!response.ok) {
                if (response.status === 405) {
                    console.error('Method Not Allowed. The server endpoint does not accept POST requests.');
                    return 'Feedback is temporarily unavailable.';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Backend returns {status, score, feedback, hexagon_updates}
            return data.feedback || '...';
        } catch (error) {
            console.error('Real-time feedback error:', error);
            return 'Thinking...';
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
                body: JSON.stringify({ user_data: user }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const api = await response.json();
            // Synthesize object expected by script.js
            const strengths = Object.entries(user.hexagonStats || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([k]) => this.formatCategoryName(k));
            const areasForImprovement = Object.entries(user.hexagonStats || {})
                .sort((a, b) => a[1] - b[1])
                .slice(0, 3)
                .map(([k]) => this.formatCategoryName(k));

            return {
                summary: 'Here is a brief analysis of your current strengths and areas to focus on based on your recent activity.',
                strengths,
                areasForImprovement,
                recommendations: ['Practice with timed questions', 'Review system design basics', 'Do a mock interview this week'],
                raw: api
            };
        } catch (error) {
            console.error('Error generating hexagon insights:', error);
            return {
                summary: 'Insights are temporarily unavailable. Showing default guidance.',
                strengths: ['Communication'],
                areasForImprovement: ['System Design'],
                recommendations: ['Practice more coding problems']
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

            const api = await response.json();
            const a = api.analysis || {};
            return {
                summary: `Your progress score is ${a.progress_score ?? 0}. Focus on: ${(a.improvement_areas || []).join(', ')}`,
                trends: a.strengths || [],
                recommendations: a.improvement_areas || []
            };
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

            const api = await response.json();
            const r = api.salary_range || { min: 0, max: 0 };
            const median = (r.min + r.max) / 2 || 0;
            return {
                range: { min: r.min || 0, max: r.max || 0 },
                median,
                marketComparison: { percentile25: Math.round(r.min * 0.9), percentile75: Math.round(r.max * 1.1), average: median },
                insights: 'Based on your profile and market data, this is a reasonable range.'
            };
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
            message: message,
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
            const botResponse = data.response || '...';
            this.addToHistory(botResponse, false);
            return botResponse;
        } catch (error) {
            console.error('Chat error:', error);
            const fallbackResponse = "I'm sorry, I'm having trouble responding right now. Please try again later.";
            this.addToHistory(fallbackResponse, false);
            return fallbackResponse;
        }
    }

    /**
     * Evaluate the complete interview session
     * @param {Array} qaPairs - Array of question-answer objects with metadata
     * @param {Object} context - Additional context about the interview
     * @returns {Promise<Object>} - Comprehensive evaluation of the interview
     */
    async evaluateCompleteInterview(qaPairs, context = {}) {
        try {
            // Prepare the request data
            const requestData = {
                qa_pairs: qaPairs.map(qa => ({
                    question: qa.question,
                    answer: qa.answer,
                    metadata: qa.metadata || {}
                })),
                context: context
            };

            const response = await fetch('/api/v1/evaluate_session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.status === 'success') {
                // Update the UI with the evaluation results
                this.updateEvaluationUI(result.evaluation);
                
                // Log the evaluation for debugging
                console.log('Interview Evaluation:', result.evaluation);
                
                return result.evaluation;
            } else {
                throw new Error(result.message || 'Failed to evaluate interview session');
            }
        } catch (error) {
            console.error('Error evaluating interview session:', error);
            
            // Show error to the user
            this.showError('Failed to evaluate interview session', error.message);
            
            return {
                status: 'error',
                message: error.message || 'An unknown error occurred during evaluation'
            };
        }
    }
    
    /**
     * Update the UI with evaluation results
     * @param {Object} evaluation - The evaluation results
     */
    updateEvaluationUI(evaluation) {
        console.log('=== Starting updateEvaluationUI ===');
        console.log('Full evaluation object:', JSON.stringify(evaluation, null, 2));
        
        if (!evaluation) {
            console.error('No evaluation data provided to updateEvaluationUI');
            return;
        }

        try {
            // Debug: Check if the rating element exists in the DOM
            const debugElement = document.getElementById('ai-performance-rating');
            console.log('AI Performance Rating element found in DOM:', !!debugElement);
            if (debugElement) {
                console.log('Current content:', debugElement.textContent);
            }
            
            // Update overall score
            const scoreElement = document.getElementById('final-score');
            if (scoreElement) {
                scoreElement.textContent = (evaluation.overall_score || 0).toFixed(1);
                console.log('Updated final score to:', scoreElement.textContent);
            } else {
                console.warn('Could not find final-score element');
            }
            
            // Update questions answered
            const answeredCountElement = document.getElementById('answered-count');
            if (answeredCountElement) {
                answeredCountElement.textContent = evaluation.questions_answered || '0/0';
            } else {
                console.warn('Could not find answered-count element');
            }
            
            // Update average score
            const avgScoreElement = document.getElementById('avg-score');
            if (avgScoreElement) {
                const avgScoreNum = Number(evaluation.overall_score || 0);
                avgScoreElement.textContent = `${avgScoreNum.toFixed(2)}%`;
                console.log('Updated average score to:', avgScoreNum);
            } else {
                console.warn('Could not find avg-score element');
            }
            
            // Update AI performance rating
            const aiRatingElement = document.getElementById('ai-performance-rating');
            if (aiRatingElement) {
                console.log('Found ai-performance-rating element, setting rating...');
                const rating = this.getPerformanceRating(evaluation.overall_score);
                console.log('Calculated rating:', rating);
                aiRatingElement.textContent = rating;
                console.log('Rating updated to:', aiRatingElement.textContent);
            } else {
                console.error('Could not find ai-performance-rating element in DOM');
                // Try to find the element again after a short delay
                setTimeout(() => {
                    const retryElement = document.getElementById('ai-performance-rating');
                    console.log('Retry - found element:', !!retryElement);
                    if (retryElement) {
                        const rating = this.getPerformanceRating(evaluation.overall_score);
                        console.log('Retry - setting rating to:', rating);
                        retryElement.textContent = rating;
                    }
                }, 1000);
            }
            
            // Update hexagon changes
            const hexagonChangesElement = document.getElementById('hexagon-changes');
            if (hexagonChangesElement && evaluation.hexagon_updates) {
                hexagonChangesElement.innerHTML = '';
                
                for (const [category, value] of Object.entries(evaluation.hexagon_updates)) {
                    const changeElement = document.createElement('div');
                    changeElement.className = 'hexagon-update';
                    changeElement.textContent = `${this.formatCategoryName(category)}+${value}`;
                    hexagonChangesElement.appendChild(changeElement);
                }
            }
            
            // Show detailed feedback if available
            if (evaluation.detailed_feedback) {
                this.showDetailedFeedback(evaluation.detailed_feedback);
            }
            
        } catch (error) {
            console.error('Error in updateEvaluationUI:', error);
        }
        
        console.log('=== Finished updateEvaluationUI ===');
    }
    
    /**
     * Format category name for display
     * @param {string} category - The category name in snake_case
     * @returns {string} Formatted category name
     */
    formatCategoryName(category) {
        return category
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    /**
     * Get performance rating based on score
     * @param {number} score - The overall score (0-100)
     * @returns {string} Performance rating
     */
    getPerformanceRating(score) {
        console.log('Calculating performance rating for score:', score);
        if (score === undefined || score === null) {
            console.warn('Invalid score provided to getPerformanceRating:', score);
            return 'Not Rated';
        }
        
        // Ensure score is a number
        const numericScore = Number(score);
        if (isNaN(numericScore)) {
            console.error('Non-numeric score provided to getPerformanceRating:', score);
            return 'Error';
        }
        
        if (numericScore >= 85) return 'Excellent';
        if (numericScore >= 70) return 'Very Good';
        if (numericScore >= 55) return 'Good';
        if (numericScore >= 40) return 'Fair';
        return 'Needs Improvement';
    }
    
    /**
     * Display detailed feedback for each question
     * @param {Array} feedback - Array of feedback objects
     */
    showDetailedFeedback(feedback) {
        const feedbackContainer = document.getElementById('detailed-feedback');
        if (!feedbackContainer) return;
        
        feedbackContainer.innerHTML = '<h3>Detailed Feedback</h3>';
        
        feedback.forEach((item, index) => {
            const feedbackElement = document.createElement('div');
            feedbackElement.className = 'feedback-item';
            feedbackElement.innerHTML = `
                <div class="feedback-question">
                    <strong>Question ${index + 1}:</strong> ${item.question}
                    <span class="feedback-score">${(item.score).toFixed(1)}%</span>
                </div>
                <div class="feedback-message">${item.feedback}</div>
                <div class="feedback-hexagon">
                    ${Object.entries(item.hexagon_updates || {})
                        .map(([key, value]) => 
                            `<span class="hex-tag">${this.formatCategoryName(key)}: +${value}</span>`
                        ).join(' ')}
                </div>
            `;
            feedbackContainer.appendChild(feedbackElement);
        });
    }
    
    /**
     * Show error message to the user
     * @param {string} title - Error title
     * @param {string} message - Error message
     */
    showError(title, message) {
        // Implement your error display logic here
        console.error(`${title}: ${message}`);
        // Example: show a toast or modal with the error
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
