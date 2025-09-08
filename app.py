# app.py
from fastapi import FastAPI, HTTPException

from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from pathlib import Path
from pydantic import BaseModel
from typing import  List

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR / "frontend"
QUESTIONS_FILE = BASE_DIR / "data" / "questions.json"

app = FastAPI()

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

class AnalysisRequest(BaseModel):
    history: List[dict]

class SalaryRequest(BaseModel):
    profile: dict

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

class HexagonInsightRequest(BaseModel):
    user_data: dict

def load_questions():
    if not QUESTIONS_FILE.exists():
        return {}
    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@app.post("/api/v1/real_time_feedback")
async def get_real_time_feedback(request: RealTimeFeedbackRequest):
    """Accepts a POST request with the user's answer and returns real-time feedback."""
    answer = request.answer

    # Simple placeholder logic for real-time feedback
    if len(answer) < 10:
        feedback = "Keep going! Try to elaborate on your point."
    elif len(answer) < 50:
        feedback = "Good start! Think about adding a specific example to support your answer."
    else:
        feedback = "That's a very comprehensive answer. You are on the right track!"

    return {"feedback": feedback}

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
    score = min(100, len(answer))  # toy scoring system
    feedback = "Answer too short" if len(answer) < 30 else "Good length"
    return {"status": "ok", "score": score, "feedback": feedback}

# Serve data files
app.mount("/data", StaticFiles(directory=str(BASE_DIR / "data"), html=True), name="data")

# Serve frontend files (must be last to avoid interfering with API routes)
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
