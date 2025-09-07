import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    # Hugging Face Configuration
    HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
    MODEL_NAME = os.getenv('MODEL_NAME')
    MAX_LENGTH = int(os.getenv('MAX_LENGTH', 512))
    
    # API Configuration
    API_PREFIX = "/api/v1"
    
    @classmethod
    def validate(cls):
        """Validate that all required configurations are set."""
        if not cls.HUGGINGFACE_API_KEY or cls.HUGGINGFACE_API_KEY == 'your_huggingface_api_key_here':
            raise ValueError("HUGGINGFACE_API_KEY is not properly set in .env file")
        if not cls.MODEL_NAME:
            raise ValueError("MODEL_NAME is not set in .env file")
