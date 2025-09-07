import os
import json
import logging
import requests
import difflib
import re
from typing import Dict, Any, Optional
from pathlib import Path
from config import Config

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = Config.HUGGINGFACE_API_KEY
        self.model_name = Config.MODEL_NAME
        if not self.api_key or not self.model_name:
            raise ValueError("Missing required configuration. Please check your .env file.")
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model_name}"
        self.headers = {"Authorization": f"Bearer {self.api_key}"}
        logger.info(f"Initialized AI Service with model: {self.model_name}")
        
        # Load questions data for fallback
        self.questions_data = self._load_questions_data()
    
    def _load_questions_data(self) -> Dict[str, Any]:
        """Load questions data from JSON file."""
        try:
            questions_path = Path(__file__).parent.parent / 'data' / 'questions.json'
            with open(questions_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading questions data: {str(e)}")
            return []
    
    def _find_question_data(self, question_text: str) -> Optional[Dict[str, Any]]:
        """Find question data by matching question text."""
        if not self.questions_data:
            return None
            
        # Simple text matching to find the most similar question
        questions = [q['question'] for q in self.questions_data]
        matches = difflib.get_close_matches(question_text, questions, n=1, cutoff=0.7)
        
        if not matches:
            return None
            
        # Return the first matching question's data
        return next((q for q in self.questions_data if q['question'] == matches[0]), None)
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts (0-1)."""
        return difflib.SequenceMatcher(None, text1.lower(), text2.lower()).ratio()
    
    def _evaluate_with_fallback(self, question: str, answer: str) -> Dict[str, Any]:
        """Fallback evaluation using questions.json data."""
        logger.warning("Falling back to local evaluation using questions.json")
        
        # Default fallback response
        fallback_response = {
            'status': 'success',
            'score': 50,  # Middle score as fallback
            'hexagon_updates': {
                'technical_expertise': 5,
                'problem_solving': 5,
                'communication': 5
            },
            'reasoning': 'Evaluation completed using fallback method.',
            'used_fallback': True
        }
        
        try:
            # Try to find the question in our database
            question_data = self._find_question_data(question)
            if not question_data:
                logger.warning("Question not found in database, using default fallback")
                return fallback_response
            
            # Get ideal answer and hexagon impact
            ideal_answer = question_data.get('ideal_answer_outline', '')
            hex_impact = question_data.get('hexagon_impact', {
                'technical_expertise': 5,
                'problem_solving': 5,
                'communication': 5
            })
            
            # Calculate similarity between ideal and actual answer
            if ideal_answer:
                similarity = self._calculate_similarity(ideal_answer, answer)
                score = int(similarity * 100)  # Convert to 0-100 scale
                
                # Adjust hexagon values based on score
                def adjust_hex_value(value: int, score: int) -> int:
                    # Scale the hex value based on the score (0-100)
                    return max(1, min(10, int(value * (score / 100))))
                
                hex_updates = {
                    'technical_expertise': adjust_hex_value(hex_impact.get('technical_expertise', 5), score),
                    'problem_solving': adjust_hex_value(hex_impact.get('problem_solving', 5), score),
                    'communication': adjust_hex_value(hex_impact.get('communication', 5), score)
                }
                
                return {
                    'status': 'success',
                    'score': score,
                    'hexagon_updates': hex_updates,
                    'reasoning': 'Evaluation completed by comparing with ideal answer pattern.',
                    'used_fallback': True
                }
            
            return fallback_response
            
        except Exception as e:
            logger.error(f"Error in fallback evaluation: {str(e)}")
            return fallback_response
    
    async def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze text using the configured model.
        
        Args:
            text: The text to analyze
            
        Returns:
            Dict containing the analysis results
        """
        try:
            logger.info(f"Sending request to model: {self.model_name}")
            
            # Prepare the payload for the API with a more specific prompt for FLAN-T5
            prompt = f"""
            Analyze the following text and provide a detailed response.
            Text: "{text}"
            
            Provide your analysis in the following JSON format:
            {{
                "analysis": "Detailed analysis of the text",
                "sentiment": "positive/negative/neutral",
                "key_points": ["point 1", "point 2", "point 3"]
            }}
            """.strip()
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_length": Config.MAX_LENGTH,
                    "do_sample": True,
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "return_full_text": False
                }
            }
            
            # Make the API request with timeout
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=30  # 30 seconds timeout
            )
            
            # Check for errors
            response.raise_for_status()
            
            # Parse the response
            result = response.json()
            logger.info("Received response from model")
            
            # For FLAN-T5, the response is a list with a dictionary containing 'generated_text'
            if isinstance(result, list) and len(result) > 0 and 'generated_text' in result[0]:
                return {
                    'status': 'success',
                    'analysis': result[0]['generated_text']
                }
            else:
                return {
                    'status': 'error',
                    'message': 'Unexpected response format from model',
                    'raw_response': result
                }
            
        except requests.exceptions.HTTPError as http_err:
            error_msg = f"HTTP error occurred: {http_err}. Status code: {getattr(http_err.response, 'status_code', 'N/A')}"
            logger.error(error_msg)
            print(f"[ERROR] {error_msg}")
            return {
                'status': 'error',
                'message': f"API request failed: {str(http_err)}",
                'status_code': getattr(http_err.response, 'status_code', None)
            }
        except Exception as e:
            error_msg = f"Error in analyze_text: {str(e)}"
            logger.error(error_msg, exc_info=True)
            print(f"[ERROR] {error_msg}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    async def assess_interview_answer(
        self, 
        question: str, 
        answer: str,
        ideal_answer: str = None,
        hexagon_impact: dict = None
    ) -> Dict[str, Any]:
        """
        Assess an interview answer using the configured model with fallback to local evaluation.
        """
        logger.info(f"Assessing answer for question: {question[:100]}...")
        
        # Default hexagon impact values if not provided
        if hexagon_impact is None:
            hexagon_impact = {
                'technical_expertise': 5,
                'problem_solving': 5,
                'communication': 5
            }
            
        try:
            # First try to use the AI model
            analysis_result = await self.analyze_text(f"""
            You are an AI assistant evaluating an interview answer. 
            
            Question: {question}
            Answer: {answer}
            
            Please evaluate this answer and provide:
            1. A score from 0-100 based on answer quality
            2. Ratings from 0-10 for technical expertise, problem solving, and communication
            3. A brief reasoning for your evaluation
            
            Format your response as a JSON object with these fields:
            - score (0-100)
            - hexagon_updates (with technical_expertise, problem_solving, communication)
            - reasoning
            
            Response:
            """.strip())
            
            if analysis_result.get('status') != 'success':
                raise ValueError(f"AI analysis failed: {analysis_result.get('message', 'Unknown error')}")
            
            # Process the model's response
            response_text = analysis_result.get('analysis', '')
            
            try:
                import json
                # Try to find JSON in the response
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if not json_match:
                    raise ValueError("No JSON found in model response")
                
                # Parse the JSON
                analysis = json.loads(json_match.group(0))
                
                # Extract and validate the score
                score = min(100, max(0, int(analysis.get('score', 50))))
                
                # Extract and validate hexagon updates
                hex_updates = {
                    'technical_expertise': min(10, max(0, int(analysis.get('hexagon_updates', {}).get('technical_expertise', 5)))),
                    'problem_solving': min(10, max(0, int(analysis.get('hexagon_updates', {}).get('problem_solving', 5)))),
                    'communication': min(10, max(0, int(analysis.get('hexagon_updates', {}).get('communication', 5))))
                }
                
                # Get reasoning or use a default
                reasoning = analysis.get('reasoning', 'No reasoning provided')
                
                # Additional validation for very short answers
                if len(answer.strip()) < 10:
                    score = min(score, 30)
                    hex_updates = {k: max(1, v // 2) for k, v in hex_updates.items()}
                
                return {
                    'status': 'success',
                    'score': score,
                    'hexagon_updates': hex_updates,
                    'reasoning': reasoning,
                    'used_fallback': False
                }
                
            except (json.JSONDecodeError, ValueError, AttributeError) as e:
                logger.warning(f"Error parsing model response, falling back to local evaluation: {str(e)}")
                # Fall through to local evaluation
                
        except Exception as e:
            logger.warning(f"AI evaluation failed, falling back to local evaluation: {str(e)}")
            # Fall through to local evaluation
        
        # If we get here, either the AI model failed or the response was invalid
        # Use the fallback evaluation method
        return self._evaluate_with_fallback(question, answer)

# Note: Instance is created in app.py on startup to avoid double initialization
