import logging
import os

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db.database import get_session
from app.repositories.faq_repository import FAQRepository
from app.schemas.chat_schema import ChatRequest, ChatResponse, FAQResponse
from app.services.nlp_service import nlp_service

logger = logging.getLogger("inscribing.chat")

router = APIRouter(prefix="/api/chat", tags=["Chat"])

THRESHOLD = float(os.getenv("CHAT_THRESHOLD", "4.5"))


@router.post("/", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, session: Session = Depends(get_session)):
    repo = FAQRepository(session)

    logger.info("=" * 70)
    logger.info("[CHATBOT] Nova requisição recebida.")
    logger.info("[CHATBOT] Pergunta do usuário: %r", request.query)

    # 1. Vetoriza a pergunta (spaCy normaliza + SentenceTransformers gera o embedding)
    logger.info(
        "[CHATBOT] Passo 1/4 — Pré-processamento (spaCy) e vetorização "
        "(SentenceTransformers)."
    )
    query_vector = nlp_service.vectorize(request.query)

    # 2. Busca o vizinho mais próximo no banco via pgvector (distância L2)
    logger.info(
        "[CHATBOT] Passo 2/4 — Busca por similaridade no pgvector (distância L2)."
    )
    closest_faq = repo.find_closest_match(query_vector)

    if not closest_faq:
        logger.info(
            "[CHATBOT] Base de conhecimento vazia — encerrando (confidence=low)."
        )
        logger.info("=" * 70)
        return ChatResponse(answer="Base de conhecimento vazia.", confidence="low")

    # 3. Calcula a distância L2 entre a pergunta do usuário e a correspondente
    logger.info(
        "[CHATBOT] Passo 3/4 — Cálculo da distância L2 entre a pergunta do usuário "
        "e a pergunta correspondente (id=%s).",
        closest_faq.id,
    )
    l2_dist = nlp_service.calculate_distance(query_vector, closest_faq.question)

    # 4. Decide com base no threshold configurável (env CHAT_THRESHOLD)
    logger.info(
        "[CHATBOT] Passo 4/4 — Decisão pelo threshold: distância=%.4f vs "
        "threshold=%.4f.",
        l2_dist,
        THRESHOLD,
    )

    if l2_dist > THRESHOLD:
        logger.info(
            "[CHATBOT] Distância ACIMA do threshold → resposta de fallback "
            "(confidence=low)."
        )
        logger.info("=" * 70)
        return ChatResponse(
            answer="Desculpe, ainda não tenho uma resposta para isso. Tente reformular a pergunta.",
            confidence="low",
            distance=l2_dist,
        )

    logger.info(
        "[CHATBOT] Distância DENTRO do threshold → resposta encontrada "
        "(confidence=high)."
    )
    logger.info("[CHATBOT] Pergunta correspondente: %r", closest_faq.question)
    logger.info("=" * 70)

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
