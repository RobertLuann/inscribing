import os

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db.database import get_session
from app.repositories.faq_repository import FAQRepository
from app.schemas.chat_schema import ChatRequest, ChatResponse, FAQResponse
from app.services.nlp_service import nlp_service

router = APIRouter(prefix="/api/chat", tags=["Chat"])

THRESHOLD = float(os.getenv("CHAT_THRESHOLD", "4.5"))


@router.post("/", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, session: Session = Depends(get_session)):
    repo = FAQRepository(session)

    # 1. Vetoriza a pergunta
    query_vector = nlp_service.vectorize(request.query)

    # 2. Busca no banco
    closest_faq = repo.find_closest_match(query_vector)

    if not closest_faq:
        return ChatResponse(answer="Base de conhecimento vazia.", confidence="low")

    # 3. Valida a distância
    l2_dist = nlp_service.calculate_distance(query_vector, closest_faq.question)

    if l2_dist > THRESHOLD:
        return ChatResponse(
            answer="Desculpe, ainda não tenho uma resposta para isso. Tente reformular a pergunta.",
            confidence="low",
            distance=l2_dist,
        )

    return ChatResponse(
        answer=closest_faq.answer,
        matched_question=closest_faq.question,
        distance=l2_dist,
        confidence="high",
    )


faq_router = APIRouter(tags=["FAQ"])


@faq_router.get("/api/faq", response_model=list[FAQResponse])
def list_faq(session: Session = Depends(get_session)):
    repo = FAQRepository(session)
    items = repo.find_all()
    return [
        FAQResponse(id=item.id, question=item.question, answer=item.answer)  # type: ignore
        for item in items
    ]
