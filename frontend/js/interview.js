// Interview Page Controller
class InterviewController {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.questions = [];
        this.userResponses = [];
        this.timer = null;
        this.timeElapsed = 0;
        this.interviewType = '';
        this.interviewId = null;
        
        // DOM Elements
        this.elements = {
            questionText: document.getElementById('question-text'),
            questionNumber: document.getElementById('question-number'),
            totalQuestions: document.getElementById('total-questions'),
            codeEditor: document.getElementById('code-editor'),
            behavioralResponse: document.getElementById('behavioral-response'),
            prevButton: document.getElementById('prev-question'),
            nextButton: document.getElementById('next-question'),
            progressBar: document.querySelector('.progress'),
            timerElement: document.querySelector('#interview-timer span'),
            submitButton: document.getElementById('submit-interview'),
            feedbackTabs: document.querySelectorAll('.panel-tabs .tab-btn'),
            tabContents: document.querySelectorAll('.tab-content')
        };
        
        // Initialize the interview
        this.initializeEventListeners();
        this.initializeTabs();
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        // Navigation buttons
        this.elements.prevButton.addEventListener('click', () => this.navigateQuestion(-1));
        this.elements.nextButton.addEventListener('click', () => this.navigateQuestion(1));
        
        // Submit button
        if (this.elements.submitButton) {
            this.elements.submitButton.addEventListener('click', () => this.submitInterview());
        }
        
        // Auto-resize textareas
        this.setupAutoResize();
    }
    
    // Initialize tab functionality
    initializeTabs() {
        this.elements.feedbackTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    // Switch between tabs
    switchTab(tabId) {
        // Update active tab
        this.elements.feedbackTabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Show corresponding content
        this.elements.tabContents.forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // Set up auto-resize for textareas
    setupAutoResize() {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        });
    }
    
    // Start the interview
    async startInterview(interviewData) {
        try {
            // Show loading state
            this.showLoading();
            
            // Store interview data
            this.interviewType = interviewData.type;
            this.interviewId = interviewData.id;
            this.totalQuestions = interviewData.questions.length;
            this.questions = interviewData.questions;
            
            // Initialize user responses
            this.userResponses = Array(this.totalQuestions).fill(null);
            
            // Update UI
            this.updateQuestionCounter();
            this.showQuestion(0);
            this.startTimer();
            
            // Hide loading state
            this.hideLoading();
            
        } catch (error) {
            console.error('Error starting interview:', error);
            this.showError('Failed to start interview. Please try again.');
        }
    }
    
    // Show a specific question
    showQuestion(index) {
        if (index < 0 || index >= this.questions.length) return;
        
        this.currentQuestion = index;
        const question = this.questions[index];
        
        // Update question text
        this.elements.questionText.textContent = question.text;
        
        // Show appropriate input based on question type
        if (question.type === 'coding') {
            this.showCodeEditor(question);
        } else {
            this.showBehavioralResponse(question);
        }
        
        // Update navigation buttons
        this.updateNavigation();
        
        // Update progress
        this.updateProgress();
    }
    
    // Show code editor for coding questions
    showCodeEditor(question) {
        this.elements.codeEditor.style.display = 'block';
        this.elements.behavioralResponse.style.display = 'none';
        
        // Initialize or update code editor content
        if (this.userResponses[this.currentQuestion]) {
            this.elements.codeEditor.textContent = this.userResponses[this.currentQuestion].code || '';
        } else {
            this.elements.codeEditor.textContent = question.starterCode || '// Your code here';
        }
    }
    
    // Show text area for behavioral questions
    showBehavioralResponse(question) {
        this.elements.codeEditor.style.display = 'none';
        this.elements.behavioralResponse.style.display = 'block';
        
        const textarea = this.elements.behavioralResponse.querySelector('textarea');
        if (this.userResponses[this.currentQuestion]) {
            textarea.value = this.userResponses[this.currentQuestion].response || '';
        } else {
            textarea.value = '';
        }
        
        // Trigger resize
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    }
    
    // Navigate between questions
    navigateQuestion(direction) {
        // Save current response
        this.saveCurrentResponse();
        
        // Navigate to next/previous question
        const newIndex = this.currentQuestion + direction;
        if (newIndex >= 0 && newIndex < this.questions.length) {
            this.showQuestion(newIndex);
        }
    }
    
    // Save the current response
    saveCurrentResponse() {
        const currentQuestion = this.questions[this.currentQuestion];
        let response;
        
        if (currentQuestion.type === 'coding') {
            response = {
                type: 'code',
                code: this.elements.codeEditor.textContent
            };
        } else {
            const textarea = this.elements.behavioralResponse.querySelector('textarea');
            response = {
                type: 'text',
                response: textarea.value
            };
        }
        
        this.userResponses[this.currentQuestion] = response;
    }
    
    // Update question counter
    updateQuestionCounter() {
        this.elements.questionNumber.textContent = this.currentQuestion + 1;
        this.elements.totalQuestions.textContent = this.questions.length;
    }
    
    // Update progress bar
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
    }
    
    // Start the interview timer
    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateTimerDisplay();
        }, 1000);
    }
    
    // Update the timer display
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        this.elements.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Submit the interview
    async submitInterview() {
        try {
            // Save current response
            this.saveCurrentResponse();
            
            // Show loading state
            this.showLoading();
            
            // Prepare submission data
            const submission = {
                interviewId: this.interviewId,
                responses: this.userResponses,
                timeElapsed: this.timeElapsed
            };
            
            // Send submission to server
            const response = await fetch('/api/interviews/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(submission)
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit interview');
            }
            
            const result = await response.json();
            
            // Redirect to results page
            window.location.href = `/results/${result.interviewId}`;
            
        } catch (error) {
            console.error('Error submitting interview:', error);
            this.showError('Failed to submit interview. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('auth_token');
    }
    
    // Show loading state
    showLoading() {
        // Implement loading state UI
    }
    
    // Hide loading state
    hideLoading() {
        // Hide loading state UI
    }
    
    // Show error message
    showError(message) {
        // Show error message in UI
        console.error(message);
    }
}

// Initialize the interview controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the interview page
    if (document.getElementById('interview-view')) {
        const interviewController = new InterviewController();
        
        // Example: Start interview with sample data
        // In a real app, this would come from your API
        const sampleInterview = {
            id: 'sample-interview-123',
            type: 'technical',
            questions: [
                {
                    id: 'q1',
                    type: 'coding',
                    text: 'Write a function that reverses a string in place.',
                    starterCode: 'function reverseString(str) {\n    // Your code here\n}',
                    difficulty: 'easy'
                },
                {
                    id: 'q2',
                    type: 'behavioral',
                    text: 'Tell me about a time you faced a difficult challenge and how you overcame it.',
                    difficulty: 'medium'
                },
                {
                    id: 'q3',
                    type: 'coding',
                    text: 'Find the first non-repeating character in a string.',
                    starterCode: 'function firstNonRepeatingChar(str) {\n    // Your code here\n}',
                    difficulty: 'medium'
                }
            ]
        };
        
        // Start the interview with sample data
        interviewController.startInterview(sampleInterview);
    }
});
