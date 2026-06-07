from pydantic import BaseModel


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    answer: str
    confidence: str
    matched_question: str | None = None
    distance: float | None = None
