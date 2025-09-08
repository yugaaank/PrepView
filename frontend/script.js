// Enhanced PrepView Interview Preparation Application with AI Integration
class PrepViewApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.questions = [];
        this.interviewSession = null;
        this.interviewTimer = null;
        this.chatbot = null;
        // Pass 'this' to the AIIntegration constructor
        this.aiIntegration = new AIIntegration(this);
        this.voiceIntegration = null;
        this.currentTheme = 'dark';

        // Hexagon abilities
        this.hexagonAbilities = [
            'communication',
            'problem_solving',
            'technical_expertise',
            'adaptability',
            'critical_thinking',
            'confidence'
        ];

        // Company data
        this.companies = this.initializeCompanyData();

        this.init().catch(error => {
            console.error('Error initializing app:', error);
        });
    }

    async init() {
        console.log('Initializing PrepView app...');

        try {
            console.log('Loading question data...');
            await this.loadEnhancedQuestionData();
            console.log('Questions loaded:', this.questions.length);

            console.log('Initializing theme...');
            this.initializeTheme();

            console.log('Initializing voice integration...');
            this.initializeVoiceIntegration();

            console.log('Setting up event listeners...');
            this.setupEventListeners();

            console.log('Initializing chatbot...');
            this.initializeChatbot();

            console.log('Checking user status...');
            this.checkUserStatus();

            console.log('Setting up router...');
            this.router();

            console.log('Hiding loading screen...');
            setTimeout(() => this.hideLoading(), 1500);

            console.log('PrepView app initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    // Fetch questions from backend API
    async fetchQuestions(domain = "general") {
        try {
            console.log(`Fetching questions for domain: ${domain}`);
            const response = await fetch('/start_interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain })
            });

            console.log('API response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response data:', data);

            const questions = data.questions || [];
            console.log(`Received ${questions.length} questions from API`);

            return questions;
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }

    // Enhanced Questions Database with Hexagon Impact
    async loadEnhancedQuestionData() {
        // Fetch questions from API
        this.questions = await this.fetchQuestions("general");

        // Ensure we have questions from API
        if (!this.questions || this.questions.length === 0) {
            console.error('No questions received from API. Please check your connection and try again.');
            this.questions = [];
        }
    }

    // Company Data Initialization
    initializeCompanyData() {
        return [
            {
                id: 'google',
                name: 'Google',
                logo: '🔍',
                color: '#4285f4',
                description: 'Search and AI technology leader',
                difficulty: 'Very Hard',
                processTime: '2-4 weeks',
                successRate: '3%',
                interviewFormat: [
                    { type: 'Phone Screen', duration: '45 min', focus: 'Coding & System Design' },
                    { type: 'Technical Rounds', duration: '4-5 rounds', focus: 'Algorithms & Problem Solving' },
                    { type: 'System Design', duration: '45 min', focus: 'Large Scale Systems' },
                    { type: 'Behavioral', duration: '30 min', focus: 'Leadership & Culture Fit' }
                ],
                processTimeline: [
                    { step: 'Application Review', duration: '1-2 weeks', icon: 'fas fa-file-alt' },
                    { step: 'Phone Screen', duration: '1 week', icon: 'fas fa-phone' },
                    { step: 'Onsite Interviews', duration: '1-2 weeks', icon: 'fas fa-building' },
                    { step: 'Team Matching', duration: '2-4 weeks', icon: 'fas fa-users' },
                    { step: 'Final Decision', duration: '1 week', icon: 'fas fa-check-circle' }
                ],
                tips: [
                    'Master data structures and algorithms - Google loves complex problems',
                    'Practice system design for large-scale applications',
                    'Be ready for behavioral questions using the STAR method',
                    'Understand Google\'s culture and values (Googleyness)',
                    'Prepare for coding interviews with clean, efficient solutions'
                ],
                successCriteria: 'Strong technical skills, cultural fit, and problem-solving ability'
            },
            {
                id: 'amazon',
                name: 'Amazon',
                logo: '📦',
                color: '#ff9900',
                description: 'E-commerce and cloud computing giant',
                difficulty: 'Hard',
                processTime: '3-6 weeks',
                successRate: '5%',
                interviewFormat: [
                    { type: 'Online Assessment', duration: '90 min', focus: 'Coding & Logic' },
                    { type: 'Phone Interview', duration: '60 min', focus: 'Technical & Behavioral' },
                    { type: 'Onsite Loop', duration: '4-5 rounds', focus: 'Leadership Principles' }
                ],
                processTimeline: [
                    { step: 'Application', duration: '1-2 weeks', icon: 'fas fa-file-alt' },
                    { step: 'Online Assessment', duration: '1 week', icon: 'fas fa-laptop-code' },
                    { step: 'Phone Interview', duration: '1 week', icon: 'fas fa-phone' },
                    { step: 'Onsite Loop', duration: '1-2 weeks', icon: 'fas fa-building' },
                    { step: 'Decision', duration: '1-2 weeks', icon: 'fas fa-check-circle' }
                ],
                tips: [
                    'Study Amazon\'s 16 Leadership Principles thoroughly',
                    'Prepare behavioral examples using the STAR method',
                    'Practice system design for distributed systems',
                    'Be ready for customer obsession scenarios',
                    'Understand AWS services and cloud architecture'
                ],
                successCriteria: 'Leadership principles alignment, technical competency, and customer focus'
            },
            {
                id: 'meta',
                name: 'Meta',
                logo: '📘',
                color: '#1877f2',
                description: 'Social media and metaverse platform',
                difficulty: 'Hard',
                processTime: '2-4 weeks',
                successRate: '4%',
                interviewFormat: [
                    { type: 'Phone Screen', duration: '45 min', focus: 'Coding' },
                    { type: 'Technical Rounds', duration: '3-4 rounds', focus: 'Algorithms & System Design' },
                    { type: 'Behavioral', duration: '45 min', focus: 'Culture & Values' }
                ],
                processTimeline: [
                    { step: 'Application', duration: '1-2 weeks', icon: 'fas fa-file-alt' },
                    { step: 'Phone Screen', duration: '1 week', icon: 'fas fa-phone' },
                    { step: 'Technical Rounds', duration: '1-2 weeks', icon: 'fas fa-code' },
                    { step: 'Behavioral Round', duration: '1 week', icon: 'fas fa-comments' },
                    { step: 'Decision', duration: '1 week', icon: 'fas fa-check-circle' }
                ],
                tips: [
                    'Focus on algorithms and data structures mastery',
                    'Practice system design for social platforms',
                    'Understand Meta\'s mission and values',
                    'Be ready for behavioral questions about impact',
                    'Prepare for coding interviews with optimal solutions'
                ],
                successCriteria: 'Technical excellence, cultural alignment, and impact-driven mindset'
            },
            {
                id: 'apple',
                name: 'Apple',
                logo: '🍎',
                color: '#007aff',
                description: 'Consumer electronics and software',
                difficulty: 'Hard',
                processTime: '3-5 weeks',
                successRate: '4%',
                interviewFormat: [
                    { type: 'Phone Screen', duration: '45 min', focus: 'Technical & Behavioral' },
                    { type: 'Technical Rounds', duration: '3-4 rounds', focus: 'iOS/System Design' },
                    { type: 'Design Review', duration: '60 min', focus: 'Product & UX' }
                ],
                processTimeline: [
                    { step: 'Application', duration: '1-2 weeks', icon: 'fas fa-file-alt' },
                    { step: 'Phone Screen', duration: '1 week', icon: 'fas fa-phone' },
                    { step: 'Technical Rounds', duration: '1-2 weeks', icon: 'fas fa-code' },
                    { step: 'Design Review', duration: '1 week', icon: 'fas fa-palette' },
                    { step: 'Decision', duration: '1-2 weeks', icon: 'fas fa-check-circle' }
                ],
                tips: [
                    'Understand Apple\'s design philosophy and attention to detail',
                    'Practice iOS development and Swift if applicable',
                    'Be ready for system design questions',
                    'Prepare behavioral examples showing innovation',
                    'Study Apple\'s products and ecosystem'
                ],
                successCriteria: 'Technical skills, design thinking, and innovation mindset'
            },
            {
                id: 'netflix',
                name: 'Netflix',
                logo: '🎬',
                color: '#e50914',
                description: 'Streaming entertainment platform',
                difficulty: 'Very Hard',
                processTime: '2-3 weeks',
                successRate: '2%',
                interviewFormat: [
                    { type: 'Phone Screen', duration: '60 min', focus: 'Technical & Culture' },
                    { type: 'Onsite Rounds', duration: '4-5 rounds', focus: 'System Design & Leadership' }
                ],
                processTimeline: [
                    { step: 'Application', duration: '1 week', icon: 'fas fa-file-alt' },
                    { step: 'Phone Screen', duration: '1 week', icon: 'fas fa-phone' },
                    { step: 'Onsite Rounds', duration: '1 week', icon: 'fas fa-building' },
                    { step: 'Decision', duration: '1 week', icon: 'fas fa-check-circle' }
                ],
                tips: [
                    'Understand Netflix\'s culture of freedom and responsibility',
                    'Master system design for high-scale streaming',
                    'Be ready for leadership and decision-making scenarios',
                    'Practice behavioral questions about impact and judgment',
                    'Study Netflix\'s engineering blog and practices'
                ],
                successCriteria: 'High performance, judgment, and cultural fit'
            },
            {
                id: 'microsoft',
                name: 'Microsoft',
                logo: '🪟',
                color: '#00bcf2',
                description: 'Software and cloud services',
                difficulty: 'Medium',
                processTime: '3-4 weeks',
                successRate: '8%',
                interviewFormat: [
                    { type: 'Phone Screen', duration: '45 min', focus: 'Technical' },
                    { type: 'Onsite Rounds', duration: '4-5 rounds', focus: 'Coding & System Design' },
                    { type: 'Behavioral', duration: '30 min', focus: 'Leadership & Teamwork' }
                ],
                processTimeline: [
                    { step: 'Application', duration: '1-2 weeks', icon: 'fas fa-file-alt' },
                    { step: 'Phone Screen', duration: '1 week', icon: 'fas fa-phone' },
                    { step: 'Onsite Rounds', duration: '1-2 weeks', icon: 'fas fa-building' },
                    { step: 'Behavioral Round', duration: '1 week', icon: 'fas fa-comments' },
                    { step: 'Decision', duration: '1 week', icon: 'fas fa-check-circle' }
                ],
                tips: [
                    'Practice coding problems and system design',
                    'Understand Microsoft\'s mission and values',
                    'Be ready for behavioral questions about teamwork',
                    'Study Azure services and cloud architecture',
                    'Prepare examples showing growth mindset'
                ],
                successCriteria: 'Technical competency, teamwork, and growth mindset'
            },
            {
                id: 'startups',
                name: 'Startups',
                logo: '🚀',
                color: '#ff6b35',
                description: 'Fast-growing innovative companies',
                difficulty: 'Medium',
                processTime: '1-2 weeks',
                successRate: '15%',
                interviewFormat: [
                    { type: 'Initial Call', duration: '30 min', focus: 'Culture & Motivation' },
                    { type: 'Technical Round', duration: '60 min', focus: 'Practical Skills' },
                    { type: 'Founder/Team Meet', duration: '45 min', focus: 'Vision & Fit' }
                ],
                processTimeline: [
                    { step: 'Application', duration: '3-5 days', icon: 'fas fa-file-alt' },
                    { step: 'Initial Call', duration: '2-3 days', icon: 'fas fa-phone' },
                    { step: 'Technical Round', duration: '3-5 days', icon: 'fas fa-code' },
                    { step: 'Team Meet', duration: '2-3 days', icon: 'fas fa-users' },
                    { step: 'Decision', duration: '1-2 days', icon: 'fas fa-check-circle' }
                ],
                tips: [
                    'Show passion for the company\'s mission',
                    'Be ready to wear multiple hats and adapt quickly',
                    'Demonstrate practical problem-solving skills',
                    'Prepare questions about company growth and challenges',
                    'Show entrepreneurial mindset and initiative'
                ],
                successCriteria: 'Cultural fit, adaptability, and passion for the mission'
            }
        ];
    }

    // Theme Management
    initializeTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('prepview_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);
        this.updateThemeToggle();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('prepview_theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.updateThemeToggle();
    }

    updateThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        const darkIcon = document.getElementById('dark-icon');
        const lightIcon = document.getElementById('light-icon');

        if (toggle) {
            toggle.setAttribute('data-theme', this.currentTheme);
        }

        if (darkIcon && lightIcon) {
            if (this.currentTheme === 'dark') {
                darkIcon.classList.add('active');
                lightIcon.classList.remove('active');
            } else {
                lightIcon.classList.add('active');
                darkIcon.classList.remove('active');
            }
        }
    }

    // Voice Integration
    initializeVoiceIntegration() {
        if (typeof VoiceIntegration !== 'undefined') {
            this.voiceIntegration = new VoiceIntegration();
        }
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigateTo(route);
            }
        });

        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Username modal
        const saveUsernameBtn = document.getElementById('save-username');
        const usernameInput = document.getElementById('username-input');

        if (saveUsernameBtn) {
            saveUsernameBtn.addEventListener('click', () => this.saveUsername());
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.saveUsername();
            });
        }

        // Interview page
        this.setupInterviewListeners();

        // Assessment page
        this.setupAssessmentListeners();

        // Salary calculator
        this.setupSalaryListeners();

        // History page
        this.setupHistoryListeners();

        // Companies page
        this.setupCompanyListeners();
    }

    setupInterviewListeners() {
        const startInterviewBtn = document.getElementById('start-interview');
        const skipQuestionBtn = document.getElementById('skip-question');
        const submitAnswerBtn = document.getElementById('submit-answer');
        const restartInterviewBtn = document.getElementById('restart-interview');
        const saveInterviewBtn = document.getElementById('save-interview');

        if (startInterviewBtn) {
            startInterviewBtn.addEventListener('click', () => this.startInterview());
        }
        if (skipQuestionBtn) {
            skipQuestionBtn.addEventListener('click', () => this.skipQuestion());
        }
        if (submitAnswerBtn) {
            submitAnswerBtn.addEventListener('click', () => this.submitAnswer());
        }
        if (restartInterviewBtn) {
            restartInterviewBtn.addEventListener('click', () => this.resetInterview());
        }
        if (saveInterviewBtn) {
            saveInterviewBtn.addEventListener('click', () => this.saveInterviewToHistory());
        }

        // Real-time answer feedback
        const answerInput = document.getElementById('answer-input');
        if (answerInput) {
            let feedbackTimeout;
            answerInput.addEventListener('input', () => {
                clearTimeout(feedbackTimeout);
                feedbackTimeout = setTimeout(() => {
                    this.provideRealTimeFeedback(answerInput.value);
                }, 1000);
            });
        }

        // Voice mode toggle
        const voiceToggle = document.getElementById('enable-voice-mode');
        if (voiceToggle) {
            voiceToggle.addEventListener('change', (e) => {
                this.toggleVoiceMode(e.target.checked);
            });
        }

        // Voice controls
        this.setupVoiceControls();
    }

    setupAssessmentListeners() {
        const compareAverageBtn = document.getElementById('compare-average');
        const viewHistoryBtn = document.getElementById('view-history');

        if (compareAverageBtn) {
            compareAverageBtn.addEventListener('click', () => this.toggleAverageComparison());
        }
        if (viewHistoryBtn) {
            viewHistoryBtn.addEventListener('click', () => this.showHexagonHistory());
        }
    }

    setupSalaryListeners() {
        const salaryForm = document.getElementById('salary-form');
        const exportReportBtn = document.getElementById('export-report');
        const saveCalculationBtn = document.getElementById('save-calculation');

        if (salaryForm) {
            salaryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateSalary();
            });
        }
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => this.exportSalaryReport());
        }
        if (saveCalculationBtn) {
            saveCalculationBtn.addEventListener('click', () => this.saveSalaryCalculation());
        }

        // Generate skills checkboxes
        this.generateSkillsGrid();
    }

    setupHistoryListeners() {
        const historyFilter = document.getElementById('history-filter');
        const exportHistoryBtn = document.getElementById('export-history');

        if (historyFilter) {
            historyFilter.addEventListener('change', () => this.filterHistory());
        }
        if (exportHistoryBtn) {
            exportHistoryBtn.addEventListener('click', () => this.exportHistory());
        }
    }

    setupCompanyListeners() {
        // Company modal close
        const companyModalClose = document.getElementById('company-modal-close');
        const companyModal = document.getElementById('company-modal');

        if (companyModalClose) {
            companyModalClose.addEventListener('click', () => this.closeCompanyModal());
        }

        if (companyModal) {
            companyModal.addEventListener('click', (e) => {
                if (e.target === companyModal) {
                    this.closeCompanyModal();
                }
            });
        }
    }

    // Chatbot Initialization
    initializeChatbot() {
        console.log('Initializing chatbot...');

        const chatFab = document.getElementById('chat-fab');
        const chatbotContainer = document.getElementById('chatbot-container');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatbotMinimize = document.getElementById('chatbot-minimize');
        const sendMessageBtn = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');

        console.log('Chatbot elements found:', {
            chatFab: !!chatFab,
            chatbotContainer: !!chatbotContainer,
            chatbotClose: !!chatbotClose,
            chatbotMinimize: !!chatbotMinimize,
            sendMessageBtn: !!sendMessageBtn,
            chatInput: !!chatInput
        });

        // Add direct event listener to the chat button with better error handling
        if (chatFab) {
            // Remove any existing click listeners to prevent duplicates
            const newChatFab = chatFab.cloneNode(true);
            chatFab.parentNode.replaceChild(newChatFab, chatFab);
            
            newChatFab.addEventListener('click', (e) => {
                console.log('Chat button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.toggleChatbot();
            });
        } else {
            console.error('Chat FAB not found in the DOM');
        }

        // Other event listeners with better error handling
        if (chatbotClose) {
            chatbotClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeChatbot();
            });
        }

        if (chatbotMinimize) {
            chatbotMinimize.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.minimizeChatbot();
            });
        }

        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendChatMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
        }

        // Quick prompt buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.prompt-btn')) {
                const prompt = e.target.getAttribute('data-prompt');
                this.sendChatMessage(prompt);
            }
        });

        // Load chat history
        this.loadChatHistory();
    }

    // User Management
    checkUserStatus() {
        const storedUser = localStorage.getItem('prepview_user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.initializeUserHexagon();
        } else {
            this.showUsernameModal();
        }
    }

    showUsernameModal() {
        const modal = document.getElementById('username-modal');
        if (modal) {
            modal.classList.add('show');
            document.getElementById('username-input').focus();
        }
    }

    saveUsername() {
        const usernameInput = document.getElementById('username-input');
        const username = usernameInput.value.trim();

        if (username.length < 2) {
            alert('Username must be at least 2 characters long');
            return;
        }

        this.currentUser = {
            username: username,
            totalPoints: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            categoryStats: {},
            hexagonStats: this.initializeHexagonStats(),
            interviewHistory: [],
            salaryCalculations: [],
            joinDate: new Date().toISOString()
        };

        localStorage.setItem('prepview_user', JSON.stringify(this.currentUser));
        document.getElementById('username-modal').classList.remove('show');
        this.updateDashboard();
        this.renderHexagonChart();
    }

    initializeHexagonStats() {
        const stats = {};
        this.hexagonAbilities.forEach(ability => {
            stats[ability] = Math.floor(Math.random() * 30) + 20; // Start with 20-50 range
        });
        return stats;
    }

    initializeUserHexagon() {
        if (!this.currentUser.hexagonStats) {
            this.currentUser.hexagonStats = this.initializeHexagonStats();
            this.saveUserData();
        }
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('prepview_user', JSON.stringify(this.currentUser));
        }
    }

    // Routing
    router() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        this.navigateTo(hash);
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Show selected page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;

            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-route') === page) {
                    link.classList.add('active');
                }
            });

            // Close mobile menu
            document.querySelector('.nav-menu')?.classList.remove('active');
            document.querySelector('.hamburger')?.classList.remove('active');

            // Load page-specific data
            this.loadPageData(page);
        }

        window.location.hash = page;
    }

    loadPageData(page) {
        switch (page) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'assessment':
                this.renderHexagonChart();
                this.generateHexagonInsights();
                break;
            case 'interview':
                this.resetInterview();
                break;
            case 'salary':
                this.resetSalaryCalculator();
                break;
            case 'companies':
                this.renderCompaniesPage();
                break;
            case 'history':
                this.loadInterviewHistory();
                this.generateProgressAnalysis();
                break;
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    // Dashboard Functions
    updateDashboard() {
        if (!this.currentUser) return;

        const stats = this.getUserStats();

        document.getElementById('total-points').textContent = stats.totalPoints;
        document.getElementById('questions-answered').textContent = stats.questionsAnswered;
        document.getElementById('accuracy-rate').textContent = stats.accuracyRate + '%';
        document.getElementById('user-rank').textContent = '#' + stats.rank;

        this.renderDashboardHexagon();
        this.renderHexagonStatsSummary();
        this.renderAchievementPreview();
        this.renderCategoryProgress();
        this.renderRecentActivity();
    }

    getUserStats() {
        if (!this.currentUser) {
            return {
                totalPoints: 0,
                questionsAnswered: 0,
                accuracyRate: 0,
                rank: 0
            };
        }

        const accuracyRate = this.currentUser.questionsAnswered > 0
            ? Math.round((this.currentUser.correctAnswers / this.currentUser.questionsAnswered) * 100)
            : 0;

        return {
            totalPoints: this.currentUser.totalPoints || 0,
            questionsAnswered: this.currentUser.questionsAnswered || 0,
            accuracyRate: accuracyRate,
            rank: 1 // Simplified for demo
        };
    }

    renderCategoryProgress() {
        const container = document.getElementById('category-progress');
        if (!container || !this.currentUser || !this.questions || this.questions.length === 0) return;

        const categories = [...new Set(this.questions.map(q => q.category))];
        const categoryStats = this.currentUser.categoryStats || {};

        container.innerHTML = categories.map(category => {
            const stats = categoryStats[category] || { answered: 0, total: 0, points: 0 };
            const totalQuestions = this.questions.filter(q => q.category === category).length;
            const progress = totalQuestions > 0 ? (stats.answered / totalQuestions) * 100 : 0;

            return `
                <div class="progress-item">
                    <div style="min-width: 120px;">
                        <strong>${category}</strong>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">
                            ${stats.answered}/${totalQuestions} questions
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div style="min-width: 60px; text-align: right; color: var(--text-accent); font-weight: 600;">
                        ${stats.points || 0} pts
                    </div>
                </div>
            `;
        }).join('');
    }

    renderDashboardHexagon() {
        const container = document.getElementById('dashboard-hexagon-chart');
        if (!container || !this.currentUser) return;

        const stats = this.currentUser.hexagonStats;
        const abilities = this.hexagonAbilities;

        // Create interactive SVG hexagon chart
        const svg = this.createInteractiveHexagonSVG(stats, abilities, 250);
        container.innerHTML = svg;

        // Add click handlers for hexagon corners
        this.addHexagonClickHandlers();
    }

    createInteractiveHexagonSVG(stats, abilities, size) {
        const center = size / 2;
        const radius = 80;

        // Calculate points for hexagon
        const points = abilities.map((ability, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const value = stats[ability] || 0;
            const distance = (value / 100) * radius;

            return {
                x: center + Math.cos(angle) * distance,
                y: center + Math.sin(angle) * distance,
                labelX: center + Math.cos(angle) * (radius + 25),
                labelY: center + Math.sin(angle) * (radius + 25),
                ability: ability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: value,
                angle: angle
            };
        });

        // Create hexagon path with animation
        const hexagonPath = points.map((point, index) =>
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ') + ' Z';

        // Create grid lines
        const gridLines = [20, 40, 60, 80, 100].map(percent => {
            const gridPoints = abilities.map((ability, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const distance = (percent / 100) * radius;
                return {
                    x: center + Math.cos(angle) * distance,
                    y: center + Math.sin(angle) * distance
                };
            });

            const gridPath = gridPoints.map((point, index) =>
                `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
            ).join(' ') + ' Z';

            return `<path d="${gridPath}" fill="none" stroke="rgba(0, 212, 255, 0.2)" stroke-width="1"/>`;
        }).join('');

        // Create axis lines
        const axisLines = abilities.map((ability, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const endX = center + Math.cos(angle) * radius;
            const endY = center + Math.sin(angle) * radius;

            return `<line x1="${center}" y1="${center}" x2="${endX}" y2="${endY}" stroke="rgba(0, 212, 255, 0.3)" stroke-width="1"/>`;
        }).join('');

        return `
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="dashboard-hexagon-svg">
                <defs>
                    <linearGradient id="dashboardHexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(0, 212, 255, 0.4)"/>
                        <stop offset="100%" style="stop-color:rgba(0, 102, 255, 0.4)"/>
                    </linearGradient>
                    <filter id="dashboardGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                ${gridLines}
                ${axisLines}

                <path d="${hexagonPath}" fill="url(#dashboardHexGradient)" stroke="#00d4ff" stroke-width="2" filter="url(#dashboardGlow)" class="hexagon-path"/>

                ${points.map((point, index) => `
                    <circle cx="${point.x}" cy="${point.y}" r="5" fill="#00d4ff" stroke="white" stroke-width="2" class="hexagon-point" data-ability="${abilities[index]}" style="cursor: pointer;"/>
                    <text x="${point.labelX}" y="${point.labelY}" text-anchor="middle" fill="var(--text-primary)" font-size="10" font-weight="600" class="hexagon-label">
                        ${point.ability}
                    </text>
                    <text x="${point.labelX}" y="${point.labelY + 12}" text-anchor="middle" fill="var(--text-accent)" font-size="9" font-weight="700" class="hexagon-value">
                        ${point.value}
                    </text>
                `).join('')}
            </svg>
        `;
    }

    addHexagonClickHandlers() {
        const points = document.querySelectorAll('.hexagon-point');
        points.forEach(point => {
            point.addEventListener('click', (e) => {
                const ability = e.target.getAttribute('data-ability');
                this.showAbilityTip(ability);
            });

            point.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.2)';
                e.target.style.filter = 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.8))';
            });

            point.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.filter = 'none';
            });
        });
    }

    showAbilityTip(ability) {
        const tips = {
            communication: "Practice explaining complex concepts clearly and concisely. Use the STAR method for behavioral questions.",
            problem_solving: "Focus on breaking down problems into smaller parts. Practice algorithm patterns and system design.",
            technical_expertise: "Stay updated with latest technologies. Practice coding challenges and review fundamentals.",
            adaptability: "Show flexibility in your approach. Practice different types of questions and scenarios.",
            critical_thinking: "Analyze problems from multiple angles. Practice reasoning through complex scenarios.",
            confidence: "Practice mock interviews regularly. Prepare well and trust in your abilities."
        };

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'ability-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>${ability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                <p>${tips[ability]}</p>
            </div>
        `;

        document.body.appendChild(tooltip);

        // Position and animate tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        }, 10);

        // Remove tooltip after 3 seconds
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        }, 3000);
    }

    renderHexagonStatsSummary() {
        const container = document.getElementById('hexagon-stats-summary');
        if (!container || !this.currentUser) return;

        const stats = this.currentUser.hexagonStats;
        const abilities = Object.entries(stats);

        // Calculate overall score
        const overallScore = Math.round(abilities.reduce((sum, [_, value]) => sum + value, 0) / abilities.length);

        // Find strongest and weakest abilities
        const sortedAbilities = abilities.sort((a, b) => b[1] - a[1]);
        const strongest = sortedAbilities[0];
        const weakest = sortedAbilities[sortedAbilities.length - 1];

        // Calculate progress (simplified - compare with previous session)
        const progress = this.calculateHexagonProgress();

        container.innerHTML = `
            <div class="hexagon-stat-item">
                <div class="hexagon-stat-value">${overallScore}%</div>
                <div class="hexagon-stat-label">Overall Score</div>
            </div>
            <div class="hexagon-stat-item">
                <div class="hexagon-stat-value">${strongest[1]}</div>
                <div class="hexagon-stat-label">${strongest[0].replace('_', ' ')}</div>
            </div>
            <div class="hexagon-stat-item">
                <div class="hexagon-progress-indicator">
                    <span class="progress-arrow ${progress > 0 ? 'up' : progress < 0 ? 'down' : ''}">
                        ${progress > 0 ? '↗' : progress < 0 ? '↘' : '→'}
                    </span>
                    <span>${Math.abs(progress)}%</span>
                </div>
                <div class="hexagon-stat-label">This Week</div>
            </div>
        `;
    }

    calculateHexagonProgress() {
        // Simplified progress calculation - in real app, compare with previous week
        return Math.floor(Math.random() * 20) - 10; // Random -10 to +10 for demo
    }

    renderAchievementPreview() {
        const container = document.getElementById('achievement-preview');
        if (!container || !this.currentUser) return;

        // Get recent achievements (placeholder for now)
        const recentAchievements = this.getRecentAchievements();

        if (recentAchievements.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 1rem;">
                    <i class="fas fa-trophy" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                    <p>Complete interviews to earn achievements!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentAchievements.map(achievement => `
            <div class="achievement-badge" data-tooltip="${achievement.name}">
                <i class="${achievement.icon}"></i>
            </div>
        `).join('');
    }

    getRecentAchievements() {
        // Placeholder - return some sample achievements
        return [
            { name: "First Interview", icon: "fas fa-play", earned: true },
            { name: "Perfect Score", icon: "fas fa-star", earned: true },
            { name: "7 Day Streak", icon: "fas fa-fire", earned: false }
        ].filter(a => a.earned).slice(0, 3);
    }

    startQuickInterview() {
        // Navigate to interview page with quick setup
        this.navigateTo('interview');
        // Auto-fill some quick settings
        setTimeout(() => {
            document.getElementById('num-questions').value = '5';
            document.getElementById('time-per-question').value = '120';
        }, 100);
    }

    // Company Page Methods
    renderCompaniesPage() {
        const container = document.getElementById('companies-grid');
        if (!container) return;

        container.innerHTML = this.companies.map(company => `
            <div class="company-card" onclick="prepViewApp.showCompanyDetails('${company.id}')">
                <div class="company-header">
                    <div class="company-logo" style="background: ${company.color};">
                        ${company.logo}
                    </div>
                    <div class="company-info">
                        <h3>${company.name}</h3>
                        <p>${company.description}</p>
                    </div>
                </div>

                <div class="company-stats">
                    <div class="company-stat">
                        <div class="company-stat-value">${company.difficulty}</div>
                        <div class="company-stat-label">Difficulty</div>
                    </div>
                    <div class="company-stat">
                        <div class="company-stat-value">${company.processTime}</div>
                        <div class="company-stat-label">Process Time</div>
                    </div>
                    <div class="company-stat">
                        <div class="company-stat-value">${company.successRate}</div>
                        <div class="company-stat-label">Success Rate</div>
                    </div>
                </div>

                <div class="company-process">
                    <h4>Interview Process</h4>
                    <div class="process-timeline">
                        ${company.processTimeline.slice(0, 3).map(step => `
                            <div class="process-step">
                                <i class="${step.icon}"></i>
                                <span>${step.step}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="company-actions">
                    <button class="hexagon-btn primary" onclick="event.stopPropagation(); prepViewApp.startCompanyInterview('${company.id}')">
                        <i class="fas fa-play"></i> Practice
                    </button>
                    <button class="hexagon-btn secondary" onclick="event.stopPropagation(); prepViewApp.showCompanyDetails('${company.id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    showCompanyDetails(companyId) {
        const company = this.companies.find(c => c.id === companyId);
        if (!company) return;

        const modal = document.getElementById('company-modal');
        const title = document.getElementById('company-modal-title');
        const body = document.getElementById('company-modal-body');

        title.textContent = `${company.name} Interview Guide`;

        body.innerHTML = `
            <div class="company-detail-section">
                <h3>Interview Format</h3>
                <div class="interview-format">
                    ${company.interviewFormat.map(format => `
                        <div class="format-card">
                            <h4>${format.type}</h4>
                            <p><strong>Duration:</strong> ${format.duration}</p>
                            <p><strong>Focus:</strong> ${format.focus}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="company-detail-section">
                <h3>Process Timeline</h3>
                <div class="process-timeline">
                    ${company.processTimeline.map(step => `
                        <div class="process-step">
                            <i class="${step.icon}"></i>
                            <div>
                                <strong>${step.step}</strong>
                                <span style="color: var(--text-muted); font-size: 0.9rem;"> - ${step.duration}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="company-detail-section">
                <h3>Success Tips</h3>
                <ul class="tips-list">
                    ${company.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>

            <div class="company-detail-section">
                <h3>Success Criteria</h3>
                <p style="background: var(--bg-tertiary); padding: var(--spacing-md); border-radius: var(--radius); border: 1px solid rgba(0, 212, 255, 0.2);">
                    ${company.successCriteria}
                </p>
            </div>

            <div class="company-actions" style="margin-top: var(--spacing-lg);">
                <button class="hexagon-btn primary large" onclick="prepViewApp.startCompanyInterview('${company.id}')">
                    <i class="fas fa-play"></i> Start Practice Interview
                </button>
            </div>
        `;

        modal.classList.add('show');
    }

    closeCompanyModal() {
        const modal = document.getElementById('company-modal');
        modal.classList.remove('show');
    }

    startCompanyInterview(companyId) {
        const company = this.companies.find(c => c.id === companyId);
        if (!company) return;

        // Navigate to interview page and set company
        this.navigateTo('interview');

        // Auto-fill company-specific settings
        setTimeout(() => {
            const companySelect = document.getElementById('company-select');
            if (companySelect) {
                companySelect.value = company.name;
            }

            // Set company-specific question count and time
            const numQuestions = document.getElementById('num-questions');
            const timePerQuestion = document.getElementById('time-per-question');

            if (numQuestions) {
                // More questions for harder companies
                const questionCount = company.difficulty === 'Very Hard' ? '15' :
                                    company.difficulty === 'Hard' ? '10' : '5';
                numQuestions.value = questionCount;
            }

            if (timePerQuestion) {
                // More time for harder companies
                const timePerQ = company.difficulty === 'Very Hard' ? '300' :
                               company.difficulty === 'Hard' ? '180' : '120';
                timePerQuestion.value = timePerQ;
            }
        }, 100);

        this.closeCompanyModal();
    }

    // Voice Control Methods
    setupVoiceControls() {
        const startRecordingBtn = document.getElementById('start-recording');
        const stopRecordingBtn = document.getElementById('stop-recording');
        const playQuestionBtn = document.getElementById('play-question');

        if (startRecordingBtn) {
            startRecordingBtn.addEventListener('click', () => this.startVoiceRecording());
        }

        if (stopRecordingBtn) {
            stopRecordingBtn.addEventListener('click', () => this.stopVoiceRecording());
        }

        if (playQuestionBtn) {
            playQuestionBtn.addEventListener('click', () => this.playCurrentQuestion());
        }
    }

    toggleVoiceMode(enabled) {
        const voiceControls = document.getElementById('voice-controls');
        if (!voiceControls) return;

        if (enabled && this.voiceIntegration && this.voiceIntegration.isVoiceAvailable()) {
            voiceControls.style.display = 'block';
        } else {
            voiceControls.style.display = 'none';
            // Stop any ongoing recording
            if (this.voiceIntegration) {
                this.voiceIntegration.stopVoiceRecording();
            }
        }
    }

    async startVoiceRecording() {
        if (!this.voiceIntegration) return;

        const success = await this.voiceIntegration.startVoiceRecording();
        if (success) {
            this.updateVoiceUI(true);
            this.animateWaveform(true);
        }
    }

    stopVoiceRecording() {
        if (!this.voiceIntegration) return;

        this.voiceIntegration.stopVoiceRecording();
        this.updateVoiceUI(false);
        this.animateWaveform(false);
    }

    updateVoiceUI(isRecording) {
        const startBtn = document.getElementById('start-recording');
        const stopBtn = document.getElementById('stop-recording');

        if (startBtn && stopBtn) {
            if (isRecording) {
                startBtn.style.display = 'none';
                stopBtn.style.display = 'flex';
            } else {
                startBtn.style.display = 'flex';
                stopBtn.style.display = 'none';
            }
        }
    }

    animateWaveform(isActive) {
        const waveform = document.getElementById('voice-waveform');
        if (waveform) {
            if (isActive) {
                waveform.classList.add('active');
            } else {
                waveform.classList.remove('active');
            }
        }
    }

    playCurrentQuestion() {
        if (!this.voiceIntegration || !this.interviewSession) return;

        const questionElement = document.getElementById('interview-question');
        if (questionElement) {
            const questionText = questionElement.textContent;
            this.voiceIntegration.speakText(questionText);
        }
    }

    renderRecentActivity() {
        const container = document.getElementById('recent-activity-list');
        if (!container || !this.currentUser) return;

        const recentInterviews = (this.currentUser.interviewHistory || []).slice(-3);

        if (recentInterviews.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    <i class="fas fa-history" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No recent activity. Start your first mock interview!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentInterviews.map(interview => `
            <div class="activity-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius); margin-bottom: 0.5rem;">
                <div>
                    <strong>${interview.company || 'General'} Interview</strong>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">
                        ${new Date(interview.date).toLocaleDateString()}
                    </div>
                </div>
                <div style="color: var(--text-accent); font-weight: 600;">
                    ${interview.totalScore} pts
                </div>
            </div>
        `).join('');
    }

    // Hexagon Assessment Functions
    renderHexagonChart() {
        const container = document.getElementById('hexagon-chart');
        if (!container) {
            console.error('Hexagon chart container not found');
            return;
        }
        if (!this.currentUser) {
            console.error('No current user found, showing username modal');
            this.showUsernameModal();
            return;
        }

        const stats = this.currentUser.hexagonStats;
        if (!stats) {
            console.error('No hexagon stats found for user');
            this.initializeUserHexagon();
            return;
        }
        const abilities = this.hexagonAbilities;

        // Create SVG hexagon chart
        const svg = this.createHexagonSVG(stats, abilities);
        container.innerHTML = svg;

        // Render abilities breakdown
        this.renderAbilitiesBreakdown();
    }

    createHexagonSVG(stats, abilities) {
        const size = 300;
        const center = size / 2;
        const radius = 100;

        // Calculate points for hexagon
        const points = abilities.map((ability, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const value = stats[ability] || 0;
            const distance = (value / 100) * radius;

            return {
                x: center + Math.cos(angle) * distance,
                y: center + Math.sin(angle) * distance,
                labelX: center + Math.cos(angle) * (radius + 30),
                labelY: center + Math.sin(angle) * (radius + 30),
                ability: ability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: value
            };
        });

        // Create hexagon path
        const hexagonPath = points.map((point, index) =>
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ') + ' Z';

        // Create grid lines
        const gridLines = [20, 40, 60, 80, 100].map(percent => {
            const gridPoints = abilities.map((ability, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const distance = (percent / 100) * radius;
                return {
                    x: center + Math.cos(angle) * distance,
                    y: center + Math.sin(angle) * distance
                };
            });

            const gridPath = gridPoints.map((point, index) =>
                `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
            ).join(' ') + ' Z';

            return `<path d="${gridPath}" fill="none" stroke="rgba(0, 212, 255, 0.2)" stroke-width="1"/>`;
        }).join('');

        // Create axis lines
        const axisLines = abilities.map((ability, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180);
            const endX = center + Math.cos(angle) * radius;
            const endY = center + Math.sin(angle) * radius;

            return `<line x1="${center}" y1="${center}" x2="${endX}" y2="${endY}" stroke="rgba(0, 212, 255, 0.3)" stroke-width="1"/>`;
        }).join('');

        return `
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                <defs>
                    <linearGradient id="hexagonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(0, 212, 255, 0.3)"/>
                        <stop offset="100%" style="stop-color:rgba(0, 102, 255, 0.3)"/>
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                ${gridLines}
                ${axisLines}

                <path d="${hexagonPath}" fill="url(#hexagonGradient)" stroke="#00d4ff" stroke-width="2" filter="url(#glow)"/>

                ${points.map(point => `
                    <circle cx="${point.x}" cy="${point.y}" r="4" fill="#00d4ff" stroke="white" stroke-width="2"/>
                    <text x="${point.labelX}" y="${point.labelY}" text-anchor="middle" fill="var(--text-primary)" font-size="12" font-weight="600">
                        ${point.ability}
                    </text>
                    <text x="${point.labelX}" y="${point.labelY + 15}" text-anchor="middle" fill="var(--text-accent)" font-size="10" font-weight="700">
                        ${point.value}
                    </text>
                `).join('')}
            </svg>
        `;
    }

    renderAbilitiesBreakdown() {
        const container = document.getElementById('abilities-breakdown');
        if (!container || !this.currentUser) return;

        const stats = this.currentUser.hexagonStats;
        const abilityDescriptions = {
            communication: "Your ability to clearly express ideas and collaborate effectively",
            problem_solving: "Your capacity to analyze problems and develop creative solutions",
            technical_expertise: "Your depth of knowledge in technical domains and tools",
            adaptability: "Your flexibility in handling change and learning new concepts",
            critical_thinking: "Your skill in evaluating information and making reasoned decisions",
            confidence: "Your self-assurance and ability to present ideas with conviction"
        };

        container.innerHTML = this.hexagonAbilities.map(ability => {
            const score = stats[ability] || 0;
            const name = ability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const description = abilityDescriptions[ability];

            return `
                <div class="ability-item">
                    <div class="ability-header">
                        <span class="ability-name">${name}</span>
                        <span class="ability-score">${score}/100</span>
                    </div>
                    <div class="ability-description">${description}</div>
                </div>
            `;
        }).join('');
    }

    async generateHexagonInsights() {
        const container = document.getElementById('hexagon-ai-insights');
        if (!container || !this.currentUser) return;

        try {
            const insights = await this.aiIntegration.generateHexagonInsights(this.currentUser);

            container.innerHTML = `
                <div class="ai-insight-content">
                    <div class="insight-summary">
                        <h4>Assessment Summary</h4>
                        <p>${insights.summary}</p>
                    </div>

                    ${insights.strengths.length > 0 ? `
                        <div class="insight-section">
                            <h4><i class="fas fa-star"></i> Your Strengths</h4>
                            <ul>
                                ${insights.strengths.map(strength => `<li>${strength}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${insights.areasForImprovement.length > 0 ? `
                        <div class="insight-section">
                            <h4><i class="fas fa-arrow-up"></i> Areas for Growth</h4>
                            <ul>
                                ${insights.areasForImprovement.map(area => `<li>${area}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${insights.recommendations.length > 0 ? `
                        <div class="insight-section">
                            <h4><i class="fas fa-lightbulb"></i> AI Recommendations</h4>
                            <ul>
                                ${insights.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        } catch (error) {
            console.error('Error generating hexagon insights:', error);
            container.innerHTML = `
                <div class="insight-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to generate insights at this time. Please try again later.</p>
                </div>
            `;
        }
    }

    toggleAverageComparison() {
        // Toggle average comparison overlay on hexagon chart
        console.log('Toggle average comparison');
    }

    showHexagonHistory() {
        // Show historical hexagon progression
        console.log('Show hexagon history');
    }

    // Enhanced Interview Functions
    async startInterview() {
        console.log('Starting interview...');

        const company = document.getElementById('company-select').value;
        const role = document.getElementById('role-select').value;
        const numQuestions = parseInt(document.getElementById('num-questions').value);
        const timePerQuestion = parseInt(document.getElementById('time-per-question').value);

        console.log('Interview settings:', { company, role, numQuestions, timePerQuestion });

        // Fetch questions from API based on domain/role
        const domain = role || "general";
        console.log('Fetching questions for domain:', domain);

        let availableQuestions;
        try {
            availableQuestions = await this.fetchQuestions(domain);
            console.log('Fetched questions:', availableQuestions.length);

            if (!availableQuestions || availableQuestions.length === 0) {
                console.error('No questions available for interview');
                alert('No questions available from the server. Please check if the server is running and try again.');
                return;
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert(`Error fetching questions: ${error.message}. Please check if the server is running.`);
            return;
        }

        // Filter questions based on company if specified
        let filteredQuestions = availableQuestions;
        if (company) {
            filteredQuestions = availableQuestions.filter(q =>
                !q.companies || q.companies.includes(company)
            );
        }

        // Randomly select questions
        const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, numQuestions);

        this.interviewSession = {
            company: company || 'General',
            role: role || 'General',
            questions: selectedQuestions,
            currentIndex: 0,
            timePerQuestion: timePerQuestion,
            timeRemaining: timePerQuestion,
            score: 0,
            answers: [],
            startTime: new Date(),
            hexagonUpdates: {}
        };

        document.getElementById('interview-setup').classList.add('hidden');
        document.getElementById('interview-session').classList.remove('hidden');

        this.displayCurrentQuestion();
        this.startTimer();
    }

    displayCurrentQuestion() {
        if (!this.interviewSession) return;

        const session = this.interviewSession;
        const question = session.questions[session.currentIndex];

        document.getElementById('current-question').textContent = session.currentIndex + 1;
        document.getElementById('total-questions').textContent = session.questions.length;
        document.getElementById('current-score').textContent = session.score;
        document.getElementById('question-difficulty').textContent = question.difficulty;
        document.getElementById('question-difficulty').className = `difficulty-badge ${question.difficulty}`;
        document.getElementById('question-category').textContent = question.category;
        document.getElementById('question-company').textContent = session.company;
        document.getElementById('interview-question').textContent = question.question;
        document.getElementById('question-points').textContent = question.expected_points;

        // Display hexagon impact
        const impactContainer = document.getElementById('question-hexagon-impact');
        if (question.hexagon_impact) {
            impactContainer.innerHTML = Object.entries(question.hexagon_impact)
                .map(([ability, impact]) => `
                    <span class="impact-tag" style="background: rgba(0, 212, 255, 0.1); color: var(--primary-blue); padding: 0.25rem 0.5rem; border-radius: var(--radius); font-size: 0.8rem; margin-right: 0.5rem;">
                        ${ability.replace('_', ' ')}: +${impact}
                    </span>
                `).join('');
        }

        document.getElementById('answer-input').value = '';
        document.getElementById('real-time-feedback').innerHTML = '';

        // Reset timer
        session.timeRemaining = session.timePerQuestion;
        this.updateTimerDisplay();
    }

    startTimer() {
        if (this.interviewTimer) {
            clearInterval(this.interviewTimer);
        }

        this.interviewTimer = setInterval(() => {
            if (!this.interviewSession) return;

            this.interviewSession.timeRemaining--;
            this.updateTimerDisplay();

            if (this.interviewSession.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        if (!this.interviewSession) return;

        const minutes = Math.floor(this.interviewSession.timeRemaining / 60);
        const seconds = this.interviewSession.timeRemaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const timerElement = document.getElementById('timer');
        timerElement.textContent = display;

        // Add warning class when time is low
        if (this.interviewSession.timeRemaining <= 30) {
            timerElement.classList.add('warning');
        } else {
            timerElement.classList.remove('warning');
        }
    }

    async provideRealTimeFeedback(answer) {
        const feedbackContainer = document.getElementById('real-time-feedback');
        if (!feedbackContainer || !answer.trim()) {
            feedbackContainer.innerHTML = '';
            return;
        }

        try {
            const feedback = await this.aiIntegration.getRealTimeFeedback(answer);
            feedbackContainer.innerHTML = `
                <div class="feedback-item">
                    <i class="fas fa-robot"></i>
                    <span>${feedback}</span>
                </div>
            `;
        } catch (error) {
            console.error('Real-time feedback error:', error);
        }
    }

    async submitAnswer() {
        if (!this.interviewSession) return;

        const answer = document.getElementById('answer-input').value.trim();
        const question = this.interviewSession.questions[this.interviewSession.currentIndex];

        // Show assessment loading
        const indicator = document.getElementById('ai-feedback-indicator');
        indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Assessing answer...</span>';

        try {
            // Submit answer to backend API
            const response = await fetch('/submit_answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Answer submission response:', data);

            // Create assessment object from API response
            const assessment = {
                score: data.score || 0,
                feedback: data.feedback || 'Answer submitted successfully',
                strengths: [],
                improvements: []
            };

            this.interviewSession.answers.push({
                question: question,
                answer: answer,
                assessment: assessment,
                timeSpent: this.interviewSession.timePerQuestion - this.interviewSession.timeRemaining
            });

            this.interviewSession.score += assessment.score;

            // Update hexagon stats based on question's hexagon impact
            if (question.hexagon_impact) {
                Object.entries(question.hexagon_impact).forEach(([ability, impact]) => {
                    if (!this.interviewSession.hexagonUpdates[ability]) {
                        this.interviewSession.hexagonUpdates[ability] = 0;
                    }
                    // Scale impact based on answer score (0-100)
                    const scaledImpact = (impact * assessment.score) / 100;
                    this.interviewSession.hexagonUpdates[ability] += scaledImpact;
                });
            }

            this.nextQuestion();
        } catch (error) {
            console.error('Answer submission error:', error);
            // Fallback to skip question on error
            this.skipQuestion();
        }
    }

    skipQuestion() {
        if (!this.interviewSession) return;

        const question = this.interviewSession.questions[this.interviewSession.currentIndex];
        this.interviewSession.answers.push({
            question: question,
            answer: '',
            assessment: { score: 0, feedback: 'Question skipped', strengths: [], improvements: [] },
            timeSpent: this.interviewSession.timePerQuestion - this.interviewSession.timeRemaining
        });

        this.nextQuestion();
    }

    timeUp() {
        this.skipQuestion();
    }

    nextQuestion() {
        if (!this.interviewSession) return;

        this.interviewSession.currentIndex++;

        if (this.interviewSession.currentIndex >= this.interviewSession.questions.length) {
            this.endInterview();
        } else {
            this.displayCurrentQuestion();
            this.startTimer();
        }
    }

    async endInterview() {
        if (this.interviewTimer) {
            clearInterval(this.interviewTimer);
            this.interviewTimer = null;
        }

        // Update user stats
        if (this.currentUser && this.interviewSession) {
            this.updateUserStatsFromInterview();
        }

        // Show results
        await this.showInterviewResults();
    }

    updateUserStatsFromInterview() {
        if (!this.currentUser || !this.interviewSession) return;

        const session = this.interviewSession;
        const answeredQuestions = session.answers.filter(a => a.answer.length > 0).length;
        const earnedPoints = session.answers.reduce((sum, a) => sum + a.assessment.score, 0);

        // Update overall stats
        this.currentUser.totalPoints = (this.currentUser.totalPoints || 0) + earnedPoints;
        this.currentUser.questionsAnswered = (this.currentUser.questionsAnswered || 0) + session.questions.length;
        this.currentUser.correctAnswers = (this.currentUser.correctAnswers || 0) + answeredQuestions;

        // Update category stats
        if (!this.currentUser.categoryStats) {
            this.currentUser.categoryStats = {};
        }

        session.answers.forEach(answer => {
            const category = answer.question.category;
            if (!this.currentUser.categoryStats[category]) {
                this.currentUser.categoryStats[category] = { answered: 0, total: 0, points: 0 };
            }
            this.currentUser.categoryStats[category].answered++;
            this.currentUser.categoryStats[category].points += answer.assessment.score;
        });

        // Update hexagon stats
        Object.entries(session.hexagonUpdates).forEach(([ability, update]) => {
            this.currentUser.hexagonStats[ability] = Math.min(
                (this.currentUser.hexagonStats[ability] || 0) + Math.round(update),
                100
            );
        });

        this.saveUserData();
    }

    async showInterviewResults() {
        if (!this.interviewSession) return;

        const session = this.interviewSession;
        const answeredCount = session.answers.filter(a => a.answer.length > 0).length;
        const avgScore = session.answers.reduce((sum, a) => sum + a.assessment.score, 0) / session.answers.length;

        document.getElementById('final-score').textContent = session.score;
        document.getElementById('answered-count').textContent = `${answeredCount}/${session.questions.length}`;
        document.getElementById('avg-score').textContent = `${avgScore.toFixed(1)}/10`;

        // Show hexagon updates
        const hexagonChanges = document.getElementById('hexagon-changes');
        if (Object.keys(session.hexagonUpdates).length > 0) {
            hexagonChanges.innerHTML = Object.entries(session.hexagonUpdates)
                .map(([ability, change]) => `
                    <div class="hexagon-change" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${ability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span style="color: var(--success-color); font-weight: 600;">+${Math.round(change)}</span>
                    </div>
                `).join('');
        } else {
            hexagonChanges.innerHTML = '<p style="color: var(--text-secondary);">No significant changes</p>';
        }

        // Generate AI analysis
        await this.generateInterviewAnalysis();

        document.getElementById('interview-session').classList.add('hidden');
        document.getElementById('interview-results').classList.remove('hidden');
    }

    async generateInterviewAnalysis() {
        const container = document.getElementById('ai-interview-analysis');
        if (!container || !this.interviewSession) return;

        try {
            // Simulate AI analysis based on interview performance
            const session = this.interviewSession;
            const avgScore = session.answers.reduce((sum, a) => sum + a.assessment.score, 0) / session.answers.length;

            let analysis = "";
            let recommendations = [];

            if (avgScore >= 8) {
                analysis = "Outstanding performance! You demonstrated strong technical knowledge and excellent communication skills throughout the interview.";
                recommendations.push("Continue practicing advanced system design questions");
                recommendations.push("Focus on leadership and behavioral scenarios");
            } else if (avgScore >= 6) {
                analysis = "Good performance with room for improvement. Your technical foundation is solid, but work on structuring your responses more clearly.";
                recommendations.push("Practice the STAR method for behavioral questions");
                recommendations.push("Work on explaining your thought process step-by-step");
            } else {
                analysis = "This interview highlighted several areas for growth. Focus on building your fundamentals and practicing regularly.";
                recommendations.push("Review basic algorithms and data structures");
                recommendations.push("Practice mock interviews more frequently");
            }

            // Add specific feedback based on question categories
            const categoryPerformance = {};
            session.answers.forEach(answer => {
                const category = answer.question.category;
                if (!categoryPerformance[category]) categoryPerformance[category] = [];
                categoryPerformance[category].push(answer.assessment.score);
            });

            Object.entries(categoryPerformance).forEach(([category, scores]) => {
                const avgCategoryScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                if (avgCategoryScore < 6) {
                    recommendations.push(`Strengthen your ${category.toLowerCase()} skills - average score: ${avgCategoryScore.toFixed(1)}/10`);
                }
            });

            container.innerHTML = `
                <div class="analysis-content">
                    <div class="analysis-summary">
                        <p>${analysis}</p>
                    </div>

                    <div class="analysis-recommendations">
                        <h4><i class="fas fa-lightbulb"></i> Personalized Recommendations</h4>
                        <ul>
                            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="analysis-next-steps">
                        <h4><i class="fas fa-arrow-right"></i> Next Steps</h4>
                        <p>Based on your performance, I recommend taking another mock interview in 3-5 days after practicing the suggested areas.</p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error generating interview analysis:', error);
            container.innerHTML = `
                <div class="analysis-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to generate analysis at this time. Please try again later.</p>
                </div>
            `;
        }
    }

    saveInterviewToHistory() {
        if (!this.currentUser || !this.interviewSession) return;

        const interviewRecord = {
            id: Date.now(),
            date: new Date().toISOString(),
            company: this.interviewSession.company,
            role: this.interviewSession.role,
            totalScore: this.interviewSession.score,
            questionsAnswered: this.interviewSession.answers.length,
            avgScore: this.interviewSession.answers.reduce((sum, a) => sum + a.assessment.score, 0) / this.interviewSession.answers.length,
            hexagonUpdates: this.interviewSession.hexagonUpdates,
            answers: this.interviewSession.answers
        };

        if (!this.currentUser.interviewHistory) {
            this.currentUser.interviewHistory = [];
        }

        this.currentUser.interviewHistory.push(interviewRecord);
        this.saveUserData();

        // Show success message
        alert('Interview saved to history successfully!');
        this.navigateTo('history');
    }

    resetInterview() {
        this.interviewSession = null;
        if (this.interviewTimer) {
            clearInterval(this.interviewTimer);
            this.interviewTimer = null;
        }

        document.getElementById('interview-setup').classList.remove('hidden');
        document.getElementById('interview-session').classList.add('hidden');
        document.getElementById('interview-results').classList.add('hidden');
    }

    // Salary Calculator Functions
    generateSkillsGrid() {
        const container = document.getElementById('skills-grid');
        if (!container) return;

        const skills = [
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL',
            'AWS', 'Docker', 'Kubernetes', 'Git', 'MongoDB', 'PostgreSQL',
            'TypeScript', 'Vue.js', 'Angular', 'Express.js', 'Django', 'Flask',
            'Redis', 'GraphQL', 'REST APIs', 'Microservices', 'CI/CD', 'Agile'
        ];

        container.innerHTML = skills.map(skill => `
            <label class="skill-checkbox">
                <input type="checkbox" name="skills" value="${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
                <span>${skill}</span>
            </label>
        `).join('');
    }

    async calculateSalary() {
        const formData = new FormData(document.getElementById('salary-form'));
        const userProfile = {
            experienceLevel: formData.get('experience-level'),
            jobRole: formData.get('job-role'),
            location: formData.get('location'),
            education: formData.get('education'),
            skills: Array.from(formData.getAll('skills'))
        };

        // Show loading state
        const resultsContainer = document.getElementById('salary-results');
        resultsContainer.style.display = 'block';

        const insightsContainer = document.getElementById('ai-salary-advice');
        insightsContainer.innerHTML = `
            <div class="insight-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Calculating personalized salary insights...
            </div>
        `;

        try {
            const salaryData = await this.aiIntegration.calculateSalaryRange(userProfile);

            // Update salary display
            document.getElementById('salary-amount').textContent =
                `$${salaryData.range.min.toLocaleString()} - $${salaryData.range.max.toLocaleString()}`;
            document.getElementById('salary-median').textContent =
                `$${salaryData.median.toLocaleString()}`;

            // Update market comparison
            const marketContainer = document.getElementById('market-data');
            marketContainer.innerHTML = `
                <div class="market-stats">
                    <div class="market-stat">
                        <span>25th Percentile:</span>
                        <span>$${salaryData.marketComparison.percentile25.toLocaleString()}</span>
                    </div>
                    <div class="market-stat">
                        <span>75th Percentile:</span>
                        <span>$${salaryData.marketComparison.percentile75.toLocaleString()}</span>
                    </div>
                    <div class="market-stat">
                        <span>Market Average:</span>
                        <span>$${salaryData.marketComparison.average.toLocaleString()}</span>
                    </div>
                </div>
            `;

            // Update AI insights
            insightsContainer.innerHTML = `
                <div class="salary-insights">
                    <p>${salaryData.insights}</p>
                </div>
            `;

            // Simple salary chart
            this.renderSalaryChart(salaryData);

        } catch (error) {
            console.error('Salary calculation error:', error);
            insightsContainer.innerHTML = `
                <div class="insight-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to calculate salary at this time. Please try again later.</p>
                </div>
            `;
        }
    }

    renderSalaryChart(salaryData) {
        const container = document.getElementById('salary-chart');
        if (!container) return;

        // Simple bar chart representation
        const { range, median, marketComparison } = salaryData;
        const max = Math.max(range.max, marketComparison.percentile75);

        container.innerHTML = `
            <div class="salary-bars" style="display: flex; align-items: end; height: 150px; gap: 1rem; padding: 1rem;">
                <div class="salary-bar" style="flex: 1; text-align: center;">
                    <div style="background: var(--gradient-primary); height: ${(range.min / max) * 100}px; border-radius: var(--radius); margin-bottom: 0.5rem;"></div>
                    <small>Your Min</small>
                </div>
                <div class="salary-bar" style="flex: 1; text-align: center;">
                    <div style="background: var(--gradient-primary); height: ${(median / max) * 100}px; border-radius: var(--radius); margin-bottom: 0.5rem;"></div>
                    <small>Your Median</small>
                </div>
                <div class="salary-bar" style="flex: 1; text-align: center;">
                    <div style="background: var(--gradient-primary); height: ${(range.max / max) * 100}px; border-radius: var(--radius); margin-bottom: 0.5rem;"></div>
                    <small>Your Max</small>
                </div>
                <div class="salary-bar" style="flex: 1; text-align: center;">
                    <div style="background: rgba(255, 255, 255, 0.3); height: ${(marketComparison.average / max) * 100}px; border-radius: var(--radius); margin-bottom: 0.5rem;"></div>
                    <small>Market Avg</small>
                </div>
            </div>
        `;
    }

    exportSalaryReport() {
        // Generate and download salary report
        const reportData = {
            timestamp: new Date().toISOString(),
            user: this.currentUser?.username,
            salaryData: 'Generated salary report data would go here'
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salary-report.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    saveSalaryCalculation() {
        if (!this.currentUser) return;

        // Save calculation to user data
        const calculation = {
            id: Date.now(),
            date: new Date().toISOString(),
            // Add calculation data here
        };

        if (!this.currentUser.salaryCalculations) {
            this.currentUser.salaryCalculations = [];
        }

        this.currentUser.salaryCalculations.push(calculation);
        this.saveUserData();

        alert('Salary calculation saved successfully!');
    }

    resetSalaryCalculator() {
        document.getElementById('salary-form').reset();
        document.getElementById('salary-results').style.display = 'none';
    }

    // History Functions
    loadInterviewHistory() {
        const container = document.getElementById('history-items');
        if (!container || !this.currentUser) return;

        const history = this.currentUser.interviewHistory || [];

        if (history.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    <i class="fas fa-history" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No interview history yet. Complete your first mock interview!</p>
                </div>
            `;
            return;
        }

        // Update overview stats
        document.getElementById('total-interviews').textContent = history.length;
        const avgScore = history.reduce((sum, interview) => sum + interview.avgScore, 0) / history.length;
        document.getElementById('average-score').textContent = avgScore.toFixed(1);

        // Calculate improvement rate
        if (history.length > 1) {
            const recentAvg = history.slice(-3).reduce((sum, interview) => sum + interview.avgScore, 0) / Math.min(3, history.length);
            const earlierAvg = history.slice(0, -3).reduce((sum, interview) => sum + interview.avgScore, 0) / Math.max(1, history.length - 3);
            const improvement = ((recentAvg - earlierAvg) / earlierAvg) * 100;
            document.getElementById('improvement-rate').textContent = `${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%`;
        }

        // Render history items
        container.innerHTML = history.reverse().map(interview => `
            <div class="history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius); margin-bottom: 1rem; border: 1px solid rgba(0, 212, 255, 0.2);">
                <div>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <strong>${interview.company} - ${interview.role}</strong>
                        <span class="interview-date" style="color: var(--text-secondary); font-size: 0.9rem;">
                            ${new Date(interview.date).toLocaleDateString()}
                        </span>
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">
                        ${interview.questionsAnswered} questions • Avg: ${interview.avgScore.toFixed(1)}/10
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--text-accent); font-weight: 700; font-size: 1.2rem;">
                        ${interview.totalScore} pts
                    </div>
                    <button class="hexagon-btn secondary" style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="prepViewApp.viewInterviewDetails(${interview.id})">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </div>
            </div>
        `).join('');

        // Render performance chart
        this.renderPerformanceChart(history);
    }

    renderPerformanceChart(history) {
        const container = document.getElementById('performance-chart');
        if (!container || history.length === 0) return;

        // Simple line chart representation
        const maxScore = Math.max(...history.map(h => h.avgScore));
        const chartHeight = 150;

        container.innerHTML = `
            <div class="chart-container" style="height: ${chartHeight}px; position: relative; background: var(--bg-tertiary); border-radius: var(--radius); padding: 1rem;">
                <svg width="100%" height="100%" viewBox="0 0 400 ${chartHeight}">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:rgba(0, 212, 255, 0.3)"/>
                            <stop offset="100%" style="stop-color:rgba(0, 212, 255, 0.1)"/>
                        </linearGradient>
                    </defs>
                    ${history.map((interview, index) => {
                        const x = (index / (history.length - 1)) * 380 + 10;
                        const y = chartHeight - 20 - ((interview.avgScore / 10) * (chartHeight - 40));
                        return `<circle cx="${x}" cy="${y}" r="4" fill="#00d4ff" stroke="white" stroke-width="2"/>`;
                    }).join('')}
                    <polyline points="${history.map((interview, index) => {
                        const x = (index / (history.length - 1)) * 380 + 10;
                        const y = chartHeight - 20 - ((interview.avgScore / 10) * (chartHeight - 40));
                        return `${x},${y}`;
                    }).join(' ')}" fill="none" stroke="#00d4ff" stroke-width="2"/>
                </svg>
            </div>
        `;
    }

    async generateProgressAnalysis() {
        const container = document.getElementById('ai-progress-insights');
        if (!container || !this.currentUser) return;

        try {
            const analysis = await this.aiIntegration.generateProgressAnalysis(this.currentUser.interviewHistory);

            container.innerHTML = `
                <div class="progress-analysis">
                    <div class="analysis-summary">
                        <p>${analysis.summary}</p>
                    </div>

                    ${analysis.trends.length > 0 ? `
                        <div class="analysis-section">
                            <h4><i class="fas fa-chart-line"></i> Performance Trends</h4>
                            <ul>
                                ${analysis.trends.map(trend => `<li>${trend}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${analysis.recommendations.length > 0 ? `
                        <div class="analysis-section">
                            <h4><i class="fas fa-lightbulb"></i> Recommendations</h4>
                            <ul>
                                ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        } catch (error) {
            console.error('Error generating progress analysis:', error);
            container.innerHTML = `
                <div class="analysis-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to generate progress analysis at this time.</p>
                </div>
            `;
        }
    }

    viewInterviewDetails(interviewId) {
        const interview = this.currentUser.interviewHistory.find(i => i.id === interviewId);
        if (!interview) return;

        // Create detailed view modal or navigate to detailed page
        alert(`Interview Details:\nCompany: ${interview.company}\nRole: ${interview.role}\nScore: ${interview.totalScore}\nDate: ${new Date(interview.date).toLocaleDateString()}`);
    }

    filterHistory() {
        // Filter history based on selected time range
        this.loadInterviewHistory();
    }

    exportHistory() {
        if (!this.currentUser || !this.currentUser.interviewHistory) return;

        const historyData = {
            user: this.currentUser.username,
            exportDate: new Date().toISOString(),
            interviews: this.currentUser.interviewHistory
        };

        const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'interview-history.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Chatbot Functions
    toggleChatbot() {
        console.log('Toggling chatbot...');
        const container = document.getElementById('chatbot-container');
        const notification = document.getElementById('chat-notification');
        const chatInput = document.getElementById('chat-input');

        if (!container) {
            console.error('Chatbot container not found');
            return;
        }

        // Toggle the 'open' class
        container.classList.toggle('open');
        
        // Log the current state for debugging
        const isOpen = container.classList.contains('open');
        console.log(`Chatbot is now ${isOpen ? 'open' : 'closed'}`);
        
        // Focus the input when opening
        if (isOpen && chatInput) {
            setTimeout(() => {
                chatInput.focus();
            }, 100);
        }

        // Hide notification if opening
        if (isOpen && notification) {
            notification.style.display = 'none';
        }
    }

    closeChatbot() {
        document.getElementById('chatbot-container').classList.remove('open');
    }

    minimizeChatbot() {
        document.getElementById('chatbot-container').classList.remove('open');
    }

    async sendChatMessage(message = null) {
        const input = document.getElementById('chat-input');
        const messageText = message || input.value.trim();

        if (!messageText) return;

        // Clear input
        if (!message) input.value = '';

        // Add user message to chat
        this.addChatMessage(messageText, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.aiIntegration.chatWithAI(messageText);

            // Hide typing indicator and add AI response
            this.hideTypingIndicator();
            this.addChatMessage(response, 'bot');

            // Save chat history
            this.saveChatHistory();

        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addChatMessage("I'm sorry, I'm having trouble responding right now. Please try again later.", 'bot');
        }
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        document.getElementById('typing-indicator').style.display = 'flex';
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator').style.display = 'none';
    }

    loadChatHistory() {
        const history = this.aiIntegration.getConversationHistory();
        const messagesContainer = document.getElementById('chat-messages');

        // Clear existing messages except welcome message
        const welcomeMessage = messagesContainer.querySelector('.bot-message');
        messagesContainer.innerHTML = '';
        if (welcomeMessage) {
            messagesContainer.appendChild(welcomeMessage);
        }

        // Load history messages
        history.forEach(msg => {
            if (msg.role !== 'system') {
                this.addChatMessage(msg.content, msg.role === 'user' ? 'user' : 'bot');
            }
        });
    }

    saveChatHistory() {
        // Chat history is automatically saved in AIIntegration class
        // Additional local storage could be implemented here if needed
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.prepViewApp = new PrepViewApp();

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', () => {
        window.prepViewApp.router();
    });
});
async function startInterview(domain) {
  const res = await fetch("/start_interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain })
  });
  return await res.json();
}

async function submitAnswer(answer) {
  const res = await fetch("/submit_answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer })
  });
  return await res.json();
}
