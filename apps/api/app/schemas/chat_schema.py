from pydantic import BaseModel


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    answer: str
    confidence: str
    matched_question: str | None = None
    distance: float | None = None


class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
