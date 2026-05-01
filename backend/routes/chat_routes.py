from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from ..utils.gemini_client import chat_with_ai

router = APIRouter(prefix="/api/chat", tags=["Chat"])

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

@router.post("/")
def chat_endpoint(request: ChatRequest):
    history_dicts = [{"role": h.role, "text": h.text} for h in request.history]
    reply = chat_with_ai(request.message, history_dicts)
    return {"reply": reply}
