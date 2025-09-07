// Interview Controller
class InterviewController {
    constructor() {
        // DOM Elements
        this.elements = {
            // Screens
            startScreen: document.getElementById('start-screen'),
            interviewScreen: document.getElementById('interview-screen'),
            resultsScreen: document.getElementById('results-screen'),
            
            // Start Screen
            startButtons: document.querySelectorAll('.start-interview'),
            
            // Interview Screen
            chatContainer: document.getElementById('chat-container'),
            messageInput: document.getElementById('message-input'),
            sendButton: document.getElementById('send-button'),
            endInterviewBtn: document.getElementById('end-interview-btn'),
            
            // Results Screen
            scoreElement: document.getElementById('score'),
            feedbackElement: document.getElementById('feedback'),
            strengthsList: document.getElementById('strengths-list'),
            improvementsList: document.getElementById('improvements-list'),
            startNewInterviewBtn: document.getElementById('start-new-interview')
        };
        
        // Interview state
        this.interviewType = '';
        this.sessionId = null;
        this.messages = [];
        this.isTyping = false;
        this.currentQuestion = null;
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Start screen buttons
        this.elements.startButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.startInterview(type);
            });
        });
        
        // Chat input
        this.elements.messageInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.elements.sendButton?.addEventListener('click', () => this.sendMessage());
        
        // End interview button
        this.elements.endInterviewBtn?.addEventListener('click', () => this.endInterview());
        
        // Start new interview button
        this.elements.startNewInterviewBtn?.addEventListener('click', () => this.showScreen('start'));
    }
    
    async startInterview(type) {
        this.interviewType = type;
        this.messages = [];
        
        try {
            // Show loading state
            this.showScreen('interview');
            this.setLoadingState(true);
            this.addMessage('assistant', 'Starting your interview...');
            
            // Import the interview service
            const { default: InterviewService } = await import('../src/services/api/interview.js');
            
            // Start a new interview session
            const response = await InterviewService.startInterview(type);
            this.sessionId = response.data.session_id;
            this.currentQuestion = response.data.first_question;
            
            // Clear loading message and add welcome message
            this.clearChat();
            this.addMessage('assistant', `Welcome to your ${type} interview!`);
            this.addMessage('assistant', this.currentQuestion);
            
            // Enable input
            this.setInputState(true);
            
        } catch (error) {
            console.error('Error starting interview:', error);
            this.addMessage('assistant', `Sorry, there was an error starting your interview: ${error.message || 'Please try again later.'}`);
            this.showScreen('start');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async sendMessage() {
        const message = this.elements.messageInput?.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addMessage('user', message);
        this.elements.messageInput.value = '';
        this.setTypingIndicator(true);
        
        try {
            // Import the interview service
            const { default: InterviewService } = await import('../src/services/api/interview.js');
            
            // Submit the response to the current question
            const response = await InterviewService.submitResponse(
                this.sessionId,
                this.currentQuestion,
                message
            );
            
            // Handle the response
            const { feedback, next_question, is_complete } = response.data;
            
            // Add feedback to chat if available
            if (feedback) {
                this.addMessage('assistant', feedback);
            }
            
            // If interview is complete, show results
            if (is_complete) {
                await this.completeInterview();
            } else if (next_question) {
                // Update current question and show next question
                this.currentQuestion = next_question;
                this.addMessage('assistant', next_question);
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('assistant', 'Sorry, there was an error processing your response. Please try again.');
        } finally {
            this.setTypingIndicator(false);
        }
    }
    
    async endInterview() {
        if (!confirm('Are you sure you want to end the interview? You cannot return to it once ended.')) {
            return;
        }
        
        try {
            // Show loading state
            this.showTypingIndicator(true);
            
            // Import the interview service
            const { default: InterviewService } = await import('../src/services/api/interview.js');
            
            // Complete the interview and get results
            const response = await InterviewService.completeInterview(this.sessionId);
            
            // Show the results
            this.showResults(response.data);
            
        } catch (error) {
            console.error('Error ending interview:', error);
            this.addMessage('assistant', 'There was an error ending the interview. Please try again.');
        } finally {
            this.showTypingIndicator(false);
        }
    }
    
    showResults(results) {
        // Update results screen with data
        if (this.elements.scoreElement) {
            this.elements.scoreElement.textContent = results.score || 'N/A';
        }
        
        if (this.elements.feedbackElement) {
            this.elements.feedbackElement.textContent = results.feedback || 'No feedback available.';
        }
        
        // Update strengths
        if (this.elements.strengthsList) {
            this.elements.strengthsList.innerHTML = '';
            const strengths = results.strengths || [];
            strengths.forEach(strength => {
                const li = document.createElement('li');
                li.textContent = strength;
                this.elements.strengthsList.appendChild(li);
            });
        }
        
        // Update improvements
        if (this.elements.improvementsList) {
            this.elements.improvementsList.innerHTML = '';
            const improvements = results.improvements || [];
            improvements.forEach(improvement => {
                const li = document.createElement('li');
                li.textContent = improvement;
                this.elements.improvementsList.appendChild(li);
            });
        }
        
        // Show results screen
        this.showScreen('results');
    }
    
    showScreen(screenName) {
        // Hide all screens
        this.elements.startScreen?.classList.add('hidden');
        this.elements.interviewScreen?.classList.add('hidden');
        this.elements.resultsScreen?.classList.add('hidden');
        
        // Show the requested screen
        switch (screenName) {
            case 'start':
                this.elements.startScreen?.classList.remove('hidden');
                break;
            case 'interview':
                this.elements.interviewScreen?.classList.remove('hidden');
                this.elements.messageInput?.focus();
                break;
            case 'results':
                this.elements.resultsScreen?.classList.remove('hidden');
                window.scrollTo(0, 0);
                break;
        }
    }
    
    addMessage(role, content) {
        if (!this.elements.chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        this.elements.chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
        
        // Add to messages array
        this.messages.push({ role, content });
    }
    
    clearChat() {
        if (this.elements.chatContainer) {
            this.elements.chatContainer.innerHTML = '';
        }
        this.messages = [];
    }
    
    showTypingIndicator(show) {
        this.isTyping = show;
        let indicator = document.querySelector('.typing-indicator');
        
        if (show && !indicator) {
            indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = 'AI is thinking<span>.</span><span>.</span><span>.</span>';
            this.elements.chatContainer?.appendChild(indicator);
            this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
        } else if (!show && indicator) {
            indicator.remove();
        }
    }
    
    setTypingIndicator(show) {
        this.isTyping = show;
        let indicator = document.querySelector('.typing-indicator');
        
        if (show && !indicator) {
            indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = 'AI is thinking<span>.</span><span>.</span><span>.</span>';
            this.elements.chatContainer?.appendChild(indicator);
            this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
        } else if (!show && indicator) {
            indicator.remove();
        }
    }
    
    setLoadingState(isLoading) {
        document.body.classList.toggle('loading', isLoading);
        
        // Disable/enable all interactive elements
        const interactiveElements = document.querySelectorAll('button, input, textarea, select');
        interactiveElements.forEach(el => {
            if (el !== this.elements.endInterviewBtn) { // Keep end interview button enabled
                el.disabled = isLoading;
            }
        });
    }
    
    setInputState(isEnabled) {
        if (this.elements.messageInput) {
            this.elements.messageInput.disabled = !isEnabled;
            this.elements.messageInput.placeholder = isEnabled 
                ? 'Type your response here...' 
                : 'Please wait...';
        }
        
        if (this.elements.sendButton) {
            this.elements.sendButton.disabled = !isEnabled;
        }
    }
    
    /**
     * Get the authentication token from localStorage
     * @returns {string|null} The authentication token or null if not found
     */
    getAuthToken() {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.warn('No authentication token found');
                // Redirect to login or handle unauthenticated state
                window.location.href = '/login.html';
                return null;
            }
            return token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }
}

// Initialize the interview controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the interview page
    if (document.getElementById('start-screen')) {
        window.interviewController = new InterviewController();
    }
});
