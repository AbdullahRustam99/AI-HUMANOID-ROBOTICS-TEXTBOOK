from typing import List, Optional
from pydantic import BaseModel

class QueryRequest(BaseModel):
    message: str
    selected_text: Optional[str] = None

class QueryResponse(BaseModel):
    response: str
    sources: List[str]