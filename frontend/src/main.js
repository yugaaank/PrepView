import './styles.css';
import './css/interview.css';
import { AuthService, InterviewService } from './services/api';
import { InterviewController } from './js/interview';

// DOM Elements
const app = document.getElementById('app');
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const newInterviewBtn = document.getElementById('new-interview-btn');
const newInterviewModal = document.getElementById('new-interview-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const newInterviewForm = document.getElementById('new-interview-form');
const menuItems = document.querySelectorAll('.menu-item');
const views = document.querySelectorAll('.view');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is authenticated
const isAuthenticated = AuthService.isAuthenticated();

// Initialize the application
function initApp() {
  // Show appropriate screen based on auth status
  if (isAuthenticated) {
    showMainApp();
  } else {
    showAuthScreen();
  }
  
  // Initialize event listeners
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // Auth form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // New interview button
  if (newInterviewBtn) {
    newInterviewBtn.addEventListener('click', () => {
      newInterviewModal.classList.add('active');
    });
  }
  
  // Close modal buttons
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      newInterviewModal.classList.remove('active');
    });
  });
  
  // Menu navigation
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      showView(view);
    });
  });
  
  // New interview form submission
  if (newInterviewForm) {
    newInterviewForm.addEventListener('submit', handleNewInterview);
  }
}

// Show authentication screen
function showAuthScreen() {
  if (authScreen) authScreen.classList.remove('hidden');
  if (mainApp) mainApp.classList.add('hidden');
}

// Show main application
function showMainApp() {
  if (authScreen) authScreen.classList.add('hidden');
  if (mainApp) mainApp.classList.remove('hidden');
  loadUserProfile();
  showView('dashboard');
}

// Load user profile data
async function loadUserProfile() {
  try {
    const user = await AuthService.getCurrentUser();
    updateUserUI(user);
  } catch (error) {
    console.error('Failed to load user profile:', error);
  }
}

// Update UI with user data
function updateUserUI(user) {
  const userNameElements = document.querySelectorAll('.user-name');
  const userEmailElements = document.querySelectorAll('.user-email');
  const userAvatarElements = document.querySelectorAll('.user-avatar');
  
  if (user) {
    const displayName = user.full_name || user.username || 'User';
    const email = user.email || '';
    const avatarText = displayName.charAt(0).toUpperCase();
    
    userNameElements.forEach(el => el.textContent = displayName);
    userEmailElements.forEach(el => el.textContent = email);
    userAvatarElements.forEach(el => {
      el.textContent = avatarText;
      el.style.backgroundColor = getRandomColor();
    });
  }
}

// Generate a random color for user avatar
function getRandomColor() {
  const colors = [
    '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
    '#5a5c69', '#858796', '#5a5c69', '#e83e8c', '#20c9a6'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Show specific view
function showView(viewId) {
  // Hide all views
  views.forEach(view => view.classList.remove('active'));
  
  // Show selected view
  const targetView = document.getElementById(`${viewId}-view`);
  if (targetView) targetView.classList.add('active');
  
  // Update active menu item
  menuItems.forEach(item => {
    if (item.getAttribute('data-view') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Load view-specific data
  if (viewId === 'interviews') {
    loadInterviews();
  } else if (viewId === 'analytics') {
    loadAnalytics();
  }
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    await AuthService.login(username, password);
    showMainApp();
    
    // Reset form and button
    loginForm.reset();
    loginBtn.disabled = false;
    loginBtn.innerHTML = originalText;
  } catch (error) {
    console.error('Login error:', error);
    showNotification('error', 'Login failed. Please check your credentials.');
    const loginBtn = document.getElementById('login-btn');
    loginBtn.disabled = false;
    loginBtn.innerHTML = 'Login';
  }
}

// Handle registration
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;
  
  try {
    const registerBtn = document.getElementById('register-btn');
    const originalText = registerBtn.innerHTML;
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    
    await AuthService.register({ username, email, password, role });
    
    // Auto-login after registration
    await AuthService.login(username, password);
    showMainApp();
    
    // Reset form and button
    registerForm.reset();
    registerBtn.disabled = false;
    registerBtn.innerHTML = originalText;
  } catch (error) {
    console.error('Registration error:', error);
    showNotification('error', 'Registration failed. Please try again.');
    const registerBtn = document.getElementById('register-btn');
    registerBtn.disabled = false;
    registerBtn.innerHTML = 'Register';
  }
}

// Handle logout
function handleLogout() {
  AuthService.logout();
}

// Handle new interview creation
async function handleNewInterview(e) {
  e.preventDefault();
  
  const interviewType = document.getElementById('interview-type').value;
  const role = document.getElementById('interview-role').value;
  const difficulty = document.getElementById('difficulty').value;
  const timeLimit = document.getElementById('time-limit').value;
  const enableFeedback = document.getElementById('enable-feedback').checked;
  
  try {
    const submitBtn = newInterviewForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    
    const interviewData = {
      type: interviewType,
      role,
      difficulty,
      time_limit: parseInt(timeLimit, 10),
      enable_feedback: enableFeedback
    };
    
    const { data: interview, error } = await InterviewService.createInterview(interviewData);
    
    if (error) throw error;
    
    // Start the interview
    const { data: startedInterview, error: startError } = await InterviewService.startInterview(interview.id);
    
    if (startError) throw startError;
    
    // Initialize the interview controller
    const interviewController = new InterviewController();
    interviewController.startInterview(startedInterview);
    
    // Switch to interview view
    showView('interview');
    
    // Close the modal and reset form
    newInterviewModal.classList.remove('active');
    newInterviewForm.reset();
    
  } catch (error) {
    console.error('Failed to create interview:', error);
    showNotification('error', 'Failed to create interview. Please try again.');
  } finally {
    const submitBtn = newInterviewForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Start Interview';
    }
  }
}

// Load user's interviews
async function loadInterviews() {
  try {
    const interviewsList = document.getElementById('interviews-list');
    if (!interviewsList) return;
    
    interviewsList.innerHTML = '<div class="loading">Loading interviews...</div>';
    
    const { data: interviews, error } = await InterviewService.listInterviews();
    
    if (error) throw error;
    
    if (!interviews || interviews.length === 0) {
      interviewsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No interviews found. Start a new interview to begin practicing!</p>
        </div>
      `;
      return;
    }
    
    const interviewsHtml = interviews.map(interview => `
      <div class="interview-card" data-id="${interview.id}">
        <div class="interview-header">
          <h3>${interview.role} Interview</h3>
          <span class="badge ${interview.status}">${interview.status}</span>
        </div>
        <div class="interview-details">
          <p><i class="fas fa-clock"></i> ${interview.difficulty} • ${interview.duration} min</p>
          <p><i class="fas fa-calendar"></i> ${new Date(interview.created_at).toLocaleDateString()}</p>
        </div>
        <div class="interview-actions">
          <button class="btn btn-sm btn-primary view-interview" data-id="${interview.id}">
            ${interview.status === 'completed' ? 'View Report' : 'Continue'}
          </button>
        </div>
      </div>
    `).join('');
    
    interviewsList.innerHTML = `<div class="interviews-grid">${interviewsHtml}</div>`;
    
    // Add event listeners to interview cards
    document.querySelectorAll('.view-interview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const interviewId = e.target.getAttribute('data-id');
        loadInterview(interviewId);
      });
    });
    
  } catch (error) {
    console.error('Failed to load interviews:', error);
    const interviewsList = document.getElementById('interviews-list');
    if (interviewsList) {
      interviewsList.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>Failed to load interviews. Please try again later.</p>
        </div>
      `;
    }
  }
}

// Load a specific interview
async function loadInterview(interviewId) {
  try {
    const { data: interview, error } = await InterviewService.getInterview(interviewId);
    
    if (error) throw error;
    
    // If interview is not started, start it
    if (interview.status === 'created') {
      const { data: startedInterview, error: startError } = await InterviewService.startInterview(interviewId);
      if (startError) throw startError;
      interview = startedInterview;
    }
    
    // Initialize the interview controller
    const interviewController = new InterviewController();
    interviewController.startInterview(interview);
    
    // Switch to interview view
    showView('interview');
    
  } catch (error) {
    console.error('Failed to load interview:', error);
    showNotification('error', 'Failed to load interview. Please try again.');
  }
}

// Load analytics data
async function loadAnalytics() {
  try {
    const analyticsContainer = document.getElementById('analytics-content');
    if (!analyticsContainer) return;
    
    analyticsContainer.innerHTML = '<div class="loading">Loading analytics...</div>';
    
    // In a real app, you would fetch analytics data from the API
    // For now, we'll use mock data
    setTimeout(() => {
      analyticsContainer.innerHTML = `
        <div class="analytics-grid">
          <div class="analytics-card">
            <h3>Interview Stats</h3>
            <div class="stat">
              <span class="stat-value">12</span>
              <span class="stat-label">Total Interviews</span>
            </div>
            <div class="stat">
              <span class="stat-value">8.2</span>
              <span class="stat-label">Average Score</span>
            </div>
            <div class="stat">
              <span class="stat-value">15</span>
              <span class="stat-label">Questions Answered</span>
            </div>
          </div>
          <div class="analytics-card">
            <h3>Performance by Category</h3>
            <div class="progress-container">
              <div class="progress-label">Algorithms</div>
              <div class="progress-bar">
                <div class="progress" style="width: 75%"></div>
              </div>
              <span class="progress-value">75%</span>
            </div>
            <div class="progress-container">
              <div class="progress-label">Data Structures</div>
              <div class="progress-bar">
                <div class="progress" style="width: 85%"></div>
              </div>
              <span class="progress-value">85%</span>
            </div>
            <div class="progress-container">
              <div class="progress-label">System Design</div>
              <div class="progress-bar">
                <div class="progress" style="width: 65%"></div>
              </div>
              <span class="progress-value">65%</span>
            </div>
          </div>
        </div>
      `;
    }, 1000);
    
  } catch (error) {
    console.error('Failed to load analytics:', error);
    const analyticsContainer = document.getElementById('analytics-content');
    if (analyticsContainer) {
      analyticsContainer.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>Failed to load analytics. Please try again later.</p>
        </div>
      `;
    }
  }
}

// Show notification
function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="close-notification">&times;</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove notification after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
  
  // Close button
  const closeBtn = notification.querySelector('.close-notification');
  closeBtn.addEventListener('click', () => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
