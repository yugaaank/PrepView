# PrepView - Interview Preparation Platform

PrepView is a comprehensive interview preparation platform that helps candidates practice and improve their interview skills through AI-powered mock interviews, real-time feedback, and salary estimation tools.

## Features

- **AI-Powered Mock Interviews**: Practice with realistic interview questions and receive instant feedback
- **Real-time Feedback**: Get AI analysis of your answers during practice sessions
- **Salary Calculator**: Estimate expected salary ranges based on your profile and location
- **Progress Tracking**: Monitor your improvement over time with detailed analytics
- **Interactive Interview Environment**: Simulate real interview scenarios

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS, JavaScript
- **AI/ML**: Custom AI service for interview analysis
- **Database**: PostgreSQL (configured but not required for basic setup)
- **Authentication**: JWT-based authentication

## Prerequisites

- Python 3.8+
- Node.js 14+ (for frontend development)
- PostgreSQL (optional, for production)
- OpenAI API key (for AI features)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yugaaank/PrepView.git
   cd PrepView
   ```

2. **Set up a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```
    HUGGINGFACE_API_KEY = <your hugging face key>
    MODEL_NAME = <model you want to use>
  
   ```

## Running the Application

### Backend
```bash
uvicorn app:app --reload --port 5000
```

The backend will be available at `http://127.0.0.1:5000`

### Frontend
Open `frontend/index.html` in your web browser or use a simple HTTP server:

```bash
# Using Python's built-in server
cd frontend
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## API Endpoints

- `POST /api/feedback` - Get real-time feedback on interview answers
- `POST /api/analyze` - Analyze interview progress
- `POST /api/salary/calculate` - Calculate expected salary range
- `GET /api/health` - Health check endpoint

## Project Structure

```
PrepView/
├── data/                    # Interview questions and static data
│   └── questions.json       # Interview questions database
│
├── frontend/                # Frontend files
│   ├── css/                 # Stylesheets
│   │   ├── interview.css    # Interview page styles
│   │   ├── interview_new.css # New interview interface styles
│   │   └── salary-calculator.css # Salary calculator styles
│   │
│   ├── js/                  # Legacy JavaScript files
│   │   ├── interview.js     # Legacy interview logic
│   │   ├── interview_new.js # New interview interface
│   │   └── salary-calculator.js # Salary calculator logic
│   │
│   ├── src/                 # Modern frontend source
│   │   ├── controllers/     # Frontend controllers
│   │   │   └── InterviewController.js
│   │   │
│   │   └── services/        # API services
│   │       └── api/
│   │           ├── auth.js           # Authentication service
│   │           ├── config.js         # API configuration
│   │           ├── interview.js      # Interview API service
│   │           └── interviewService.js # Interview service logic
│   │
│   ├── index.html           # Landing page
│   ├── interview.html       # Interview interface
│   ├── script.js            # Main frontend script
│   ├── style.css            # Global styles
│   └── styles.css           # Additional styles (consider merging)
│   └── ai-integration.js    # AI integration script
│
├── services/               # Backend services
│   ├── ai_service.py       # AI service implementation
│   ├── salary_calculator.py # Salary calculator implementation
│   └── user_manager.py     # User management implementation
│
├── .env                    # Environment variables
├── app.py                  # Main FastAPI application
├── config.py               # Application configuration
└── requirements.txt        # Python dependencies
```

## Configuration

Edit `config.py` to modify application settings such as:
- API endpoints
- Default model parameters
- Feature flags
- Environment-specific settings

## Development

1. **Code Style**
   - Follow PEP 8 for Python code
   - Use Prettier for frontend code formatting
   - Document all new functions and classes

2. **Testing**
   ```bash
   # Run tests
   pytest
   
   # Run with coverage
   pytest --cov=.
   ```

3. **Code Quality**
   ```bash
   # Format code
   black .
   isort .
   
   # Type checking
   mypy .
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Note**: This project is under active development. Features and APIs may change in future releases.
