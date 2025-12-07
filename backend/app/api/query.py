from fastapi import APIRouter, HTTPException
from ..schemas import QueryRequest, QueryResponse
from ..services.rag_service import get_rag_response

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query_chatbot(request: QueryRequest):
    try:
        response_text, sources = await get_rag_response(request.message, request.selected_text)
        return QueryResponse(response=response_text, sources=sources)
    except Exception as e:
        # Log the full error to the backend console for debugging
        print(f"An unexpected error occurred: {e}")
        # Return a generic but informative error to the frontend
        raise HTTPException(status_code=500, detail=f"An internal error occurred in the backend: {e}")