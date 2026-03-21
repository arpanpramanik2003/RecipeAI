from fastapi import APIRouter, HTTPException
from models.schemas import RecipeRequest, RecipeResponse, ChatRequest, ChatResponse
from services.recipe_service import generate_recipe
from services.chat_service import chat_with_ai

router = APIRouter()

@router.post("/generate-recipe", response_model=RecipeResponse)
def generate_recipe_endpoint(request: RecipeRequest):
    try:
        recipe = generate_recipe(request)
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        chat_response = chat_with_ai(request)
        return chat_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
