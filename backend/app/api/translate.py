from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from google.generativeai import GenerativeModel

# Define the request and response models for the translation endpoint
class TranslationRequest(BaseModel):
    text: str
    target_language: str = "Urdu" # Default to Urdu as per the feature request

class TranslationResponse(BaseModel):
    translated_text: str

# Initialize the router for the translation API
router = APIRouter()

# Configure Gemini API (ensure GEMINI_API_KEY is set in your environment)
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set for Python backend.")
    # No direct 'configure' needed for this library version, key is passed to model
except ValueError as e:
    print(f"Configuration Error: {e}")
    # This will cause an error when the model is initialized if the key is missing

# Define the model to be used for translation
GEMINI_TRANSLATION_MODEL = 'gemini-2.5-flash' # gemini-pro is excellent for translation tasks

@router.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """
    Translates the given text to the target language using the Gemini API.
    """
    if not gemini_api_key:
        raise HTTPException(status_code=500, detail="Server is not configured for translation (missing API key).")

    model = GenerativeModel(GEMINI_TRANSLATION_MODEL)
    
    # Construct a clear and direct prompt for the translation task
    prompt = f"Translate the following text to {request.target_language}:\n\n---\n{request.text}\n---"
    
    try:
        print(f"Sending translation request to Gemini for target language: {request.target_language}")
        response = await model.generate_content_async(prompt)
        
        # Extract the translated text from the response
        translated_text = response.text.strip()
        
        print("Successfully received translation from Gemini.")
        return TranslationResponse(translated_text=translated_text)

    except Exception as e:
        print(f"An unexpected error occurred during translation with Gemini: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred during translation: {e}")
