from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
import uvicorn
import json
from pathlib import Path
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from services.ai_service import AIService
from services.salary_calculator import SalaryCalculator

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR / "frontend"
QUESTIONS_FILE = BASE_DIR / "data" / "questions.json"

app = FastAPI()

# Initialize services
ai_service = None
salary_calculator = SalaryCalculator()

# Initialize AI Service (lazy loaded when needed)
@app.on_event("startup")
async def startup_event():
    global ai_service
    print("\n=== PrepView API Starting Up ===")
    ai_service = AIService()
    print(f"Using model: {ai_service.model_name}")
    print("API is ready to accept requests\n")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request bodies
class RealTimeFeedbackRequest(BaseModel):
    answer: str
    question: str

class AnalysisRequest(BaseModel):
    history: List[dict]

class SalaryRequest(BaseModel):
    profile: dict

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

class HexagonInsightRequest(BaseModel):
    user_data: dict

class InterviewSessionRequest(BaseModel):
    qa_pairs: List[Dict[str, str]]
    context: Optional[Dict[str, Any]] = None

class SalaryCalculatorRequest(BaseModel):
    base_salary: float
    country: str
    bonuses: Dict[str, float] = {}
    deductions: Dict[str, float] = {}

def load_questions():
    if not QUESTIONS_FILE.exists():
        return {}
    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@app.post("/api/v1/real_time_feedback")
async def get_real_time_feedback(request: RealTimeFeedbackRequest):
    """Accepts a POST request with the user's answer and returns real-time feedback."""
    answer = request.answer
    question = request.question

    # Use the AI service for evaluation
    try:
        evaluation = await ai_service.assess_interview_answer(
            question=question,
            answer=answer
        )

        if evaluation.get('status') == 'success':
            return {
                "status": "ok",
                "score": evaluation.get('score', 0),
                "feedback": evaluation.get('reasoning', 'No feedback provided'),
                "hexagon_updates": evaluation.get('hexagon_updates', {})
            }
        else:
            return {
                "status": "error",
                "message": evaluation.get('message', 'Failed to evaluate answer'),
                "score": 0,
                "feedback": "An error occurred while evaluating your answer."
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "score": 0,
            "feedback": "An unexpected error occurred."
        }

@app.post("/api/v1/analysis/progress")
async def analyze_progress(request: AnalysisRequest):
    """Analyze user's interview progress"""
    return {
        "status": "ok",
        "analysis": {
            "improvement_areas": ["Data Structures", "System Design"],
            "strengths": ["Problem Solving", "Communication"],
            "progress_score": 75
        }
    }

@app.post("/api/v1/salary/calculate")
async def calculate_salary(request: SalaryRequest):
    """Calculate expected salary range based on profile"""
    return {
        "status": "ok",
        "salary_range": {
            "min": 80000,
            "max": 120000,
            "currency": "USD",
            "position": "Software Engineer"
        }
    }

@app.post("/api/v1/chat")
async def chat(request: ChatRequest):
    """Handle chat messages"""
    return {
        "status": "ok",
        "response": "This is a placeholder response. Chat functionality will be implemented soon.",
        "suggested_questions": [
            "Can you explain your experience with Python?",
            "What projects have you worked on?"
        ]
    }

@app.post("/api/v1/users/{username}/insights/hexagon")
async def get_hexagon_insights(username: str, request: HexagonInsightRequest):
    """Generate hexagon insights for user profile"""
    return {
        "status": "ok",
        "insights": {
            "technical_skills": 75,
            "communication": 85,
            "problem_solving": 80,
            "teamwork": 70,
            "leadership": 65,
            "domain_knowledge": 60
        },
        "username": username
    }

@app.post("/api/v1/evaluate_session")
async def evaluate_interview_session(request: InterviewSessionRequest):
    """
    Evaluate a complete interview session with multiple Q&A pairs.
    """
    try:
        result = await ai_service.evaluate_interview_session(
            qa_pairs=request.qa_pairs,
            additional_context=request.context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/start_interview")
async def start_interview(payload: dict):
    domain = payload.get("domain", "general")
    questions = load_questions()

    # Handle both array and object formats
    if isinstance(questions, list):
        selected = questions
    elif isinstance(questions, dict):
        selected = questions.get(domain, questions.get("general", []))
    else:
        selected = []

    return {"status": "ok", "domain": domain, "questions": selected}

@app.post("/submit_answer")
async def submit_answer(payload: dict):
    answer = payload.get("answer")
    if not answer:
        raise HTTPException(status_code=400, detail="Missing answer")

    # Use the AI service for evaluation
    try:
        evaluation = await ai_service.assess_interview_answer(
            question=payload.get("question", ""),
            answer=answer
        )

        if evaluation['status'] == 'success':
            return {
                "status": "ok",
                "score": evaluation['score'],
                "feedback": evaluation.get('reasoning', 'Evaluation complete')
            }
        else:
            return {
                "status": "error",
                "message": "Failed to evaluate answer"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.post("/api/salary/calculate")
async def calculate_salary_endpoint(request: SalaryCalculatorRequest):
    """Calculate salary based on base salary, country, bonuses, and deductions"""
    try:
        # Calculate net salary
        net_salary = salary_calculator.calculate_net_salary(
            base_salary=request.base_salary,
            country_code=request.country.upper(),
            bonuses=request.bonuses,
            deductions=request.deductions
        )

        # Calculate CTC
        ctc_result = salary_calculator.calculate_ctc(
            base_salary=request.base_salary,
            country_code=request.country.upper()
        )

        # Prepare response
        response = {
            **net_salary,
            'ctc_breakdown': ctc_result.get('benefits', {}),
            'ctc': ctc_result.get('ctc', 0),
            'status': 'success'
        }

        return response

    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

@app.get("/api/health")
async def health_check():
    """Health check endpoint to verify the backend is running"""
    return {"status": "ok", "message": "PrepView API is running"}


# Serve data files
app.mount("/data", StaticFiles(directory=str(BASE_DIR / "data"), html=True), name="data")

# Serve frontend files (must be last to avoid interfering with API routes)
app.mount("/js", StaticFiles(directory=str(FRONTEND_DIR / "js")), name="js")
app.mount("/css", StaticFiles(directory=str(FRONTEND_DIR / "css")), name="css")

# Serve the main HTML file
@app.get("/")
async def read_root():
    return FileResponse(FRONTEND_DIR / "index.html")

# Serve other HTML files directly from the frontend directory
@app.get("/{file_name:path}")
async def serve_html(file_name: str):
    file_path = FRONTEND_DIR / file_name
    if file_path.is_file():
        return FileResponse(file_path)
    return FileResponse(FRONTEND_DIR / "index.html")  # Fallback to index.html for client-side routing

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
