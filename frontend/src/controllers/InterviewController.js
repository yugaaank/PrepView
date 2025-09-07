import { 
  startInterview, 
  submitResponse, 
  completeInterview, 
  getInterview 
} from '../services/api/interviewService';

export class InterviewController {
  constructor() {
    this.currentQuestion = '';
    this.conversation = [];
    this.sessionId = null;
    this.sessionType = '';
    this.isLoading = false;
    this.isComplete = false;
    
    // DOM Elements
    this.elements = {
      chatContainer: document.getElementById('chat-container'),
      inputField: document.getElementById('user-input'),
      sendButton: document.getElementById('send-button'),
      loadingIndicator: document.getElementById('loading-indicator'),
      startScreen: document.getElementById('start-screen'),
      interviewScreen: document.getElementById('interview-screen'),
      resultsScreen: document.getElementById('results-screen'),
      startButtons: document.querySelectorAll('.start-interview')
    };
    
    // Initialize the controller
    this.initializeEventListeners();
  }
  
  // Initialize event listeners
  initializeEventListeners() {
    // Start interview buttons
    this.elements.startButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleStartInterview(e.target.dataset.type);
      });
    });
    
    // Send message on button click or Enter key
    this.elements.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.elements.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });
  }
  
  // Handle starting a new interview
  async handleStartInterview(interviewType) {
    try {
      this.showLoading(true);
      this.sessionType = interviewType;
      
      // Start a new interview session
      const response = await startInterview(interviewType);
      this.sessionId = response.data.id;
      
      // Show the interview screen
      this.elements.startScreen.classList.add('hidden');
      this.elements.interviewScreen.classList.remove('hidden');
      this.elements.inputField.focus();
      
      // Start with a welcome message
      this.addMessage('assistant', 'Welcome to your interview! I\'ll be asking you questions to evaluate your skills. Let\'s begin with the first question...');
      
      // Get the first question
      this.getNextQuestion();
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      this.showLoading(false);
    }
  }
  
  // Handle sending a message
  async handleSendMessage() {
    const message = this.elements.inputField.value.trim();
    if (!message || this.isLoading) return;
    
    // Add user message to chat
    this.addMessage('user', message);
    this.elements.inputField.value = '';
    
    try {
      this.showLoading(true);
      
      // Submit the response and get evaluation
      const response = await submitResponse(this.sessionId, this.currentQuestion, message);
      const { evaluation, next_question, is_complete } = response.data;
      
      // Add evaluation to chat
      this.addMessage('assistant', evaluation.feedback);
      
      if (is_complete) {
        // Interview is complete, show results
        await this.completeInterview();
      } else if (next_question) {
        // Show next question
        this.currentQuestion = next_question;
        this.addMessage('assistant', next_question);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.addMessage('assistant', 'Sorry, there was an error processing your response. Please try again.');
    } finally {
      this.showLoading(false);
      this.scrollToBottom();
    }
  }
  
  // Complete the interview and show results
  async completeInterview() {
    try {
      this.showLoading(true);
      this.isComplete = true;
      
      // Complete the interview
      const response = await completeInterview(this.sessionId);
      const { analysis } = response.data;
      
      // Show results screen
      this.elements.interviewScreen.classList.add('hidden');
      this.elements.resultsScreen.classList.remove('hidden');
      
      // Display results
      document.getElementById('overall-score').textContent = analysis.overall_score.toFixed(1);
      document.getElementById('detailed-feedback').textContent = analysis.detailed_feedback;
      
      // Display strengths
      const strengthsList = document.getElementById('strengths-list');
      analysis.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
      });
      
      // Display improvement areas
      const improvementsList = document.getElementById('improvements-list');
      analysis.areas_for_improvement.forEach(area => {
        const li = document.createElement('li');
        li.textContent = area;
        improvementsList.appendChild(li);
      });
      
    } catch (error) {
      console.error('Error completing interview:', error);
      alert('Failed to complete interview. Please try again.');
    } finally {
      this.showLoading(false);
    }
  }
  
  // Add a message to the chat
  addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
    this.elements.chatContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }
  
  // Show/hide loading indicator
  showLoading(show) {
    this.isLoading = show;
    if (show) {
      this.elements.loadingIndicator.classList.remove('hidden');
      this.elements.inputField.disabled = true;
      this.elements.sendButton.disabled = true;
    } else {
      this.elements.loadingIndicator.classList.add('hidden');
      this.elements.inputField.disabled = false;
      this.elements.sendButton.disabled = false;
    }
  }
  
  // Scroll chat to bottom
  scrollToBottom() {
    this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
  }
  
  // Get the next question from the server
  async getNextQuestion() {
    try {
      this.showLoading(true);
      
      // In a real implementation, this would fetch the next question from the server
      // For now, we'll use a simple array of questions
      const questions = {
        technical: [
          "Can you explain the difference between let, const, and var in JavaScript?",
          "What is the event loop in JavaScript?",
          "How would you optimize the performance of a React application?"
        ],
        behavioral: [
          "Tell me about a time you faced a difficult technical challenge and how you overcame it.",
          "Describe a situation where you had to work with a difficult team member.",
          "How do you handle tight deadlines and multiple priorities?"
        ],
        mixed: [
          "Explain how you would design a URL shortening service like bit.ly.",
          "Tell me about a time you had to learn a new technology quickly.",
          "How would you implement a caching system for a high-traffic web application?"
        ]
      };
      
      // Get a random question
      const questionList = questions[this.sessionType] || questions.mixed;
      this.currentQuestion = questionList[Math.floor(Math.random() * questionList.length)];
      
      // Add the question to the chat
      this.addMessage('assistant', this.currentQuestion);
      
    } catch (error) {
      console.error('Error getting next question:', error);
      this.addMessage('assistant', 'I encountered an error getting the next question. Please try again.');
    } finally {
      this.showLoading(false);
    }
  }
}

// Initialize the controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('chat-container')) {
    window.interviewController = new InterviewController();
  }
});
