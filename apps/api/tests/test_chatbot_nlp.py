"""Bateria de demonstração do sistema NLP do chatbot do Inscribing.

Para cada uma das 15 perguntas do FAQ executamos dois casos (30 testes):

- "acerto": uma REFORMULAÇÃO da pergunta. O sistema deve recuperar a MESMA
  pergunta do FAQ com confiança alta (distância L2 <= threshold).
- "erro": uma pergunta FORA DO DOMÍNIO. O sistema deve cair no fallback
  (distância L2 > threshold), demonstrando que ele não "alucina" respostas.

O teste reproduz exatamente o pipeline de produção — pré-processamento (spaCy),
embedding (SentenceTransformers) e vizinho mais próximo por distância L2 (a mesma
operação que o pgvector executa no banco) — porém em memória, sem HTTP nem banco.
"""

import numpy as np
import pytest

from app.routes.chat_routes import THRESHOLD
from app.seed import FAQ_DATA
from app.services.nlp_service import nlp_service

# Para cada pergunta do FAQ: uma reformulação (deve acertar) e uma pergunta
# fora do domínio do produto (deve cair no fallback).
CASES = [
    {
        "question": "Como posso criar um novo bloco de texto no editor?",
        "hit": "De que forma eu adiciono um novo bloco de texto no editor?",
        "miss": "Qual é a receita de um bolo de chocolate?",
    },
    {
        "question": "O chatbot do Inscribing pode inventar respostas ou alucinar?",
        "hit": "O chatbot do Inscribing costuma inventar ou alucinar respostas?",
        "miss": "Em que ano aconteceu a Revolução Francesa?",
    },
    {
        "question": "Como transformo um bloco em uma tarefa com checkbox?",
        "hit": "Como faço para converter um bloco em uma tarefa com caixa de seleção?",
        "miss": "Qual é a capital da Austrália?",
    },
    {
        "question": "Minhas anotações são salvas automaticamente?",
        "hit": "As minhas notas são guardadas de forma automática?",
        "miss": "Qual a profundidade média do oceano Atlântico?",
    },
    {
        "question": "Como crio uma nova coleção?",
        "hit": "De que maneira eu crio uma coleção nova?",
        "miss": "Quem foi o imperador de Roma durante a queda do império?",
    },
    {
        "question": "Como renomeio uma coleção existente?",
        "hit": "Como faço para mudar o nome de uma coleção que já existe?",
        "miss": "Qual o tempo de gestação de um elefante africano?",
    },
    {
        "question": "É possível duplicar uma coleção inteira?",
        "hit": "Consigo duplicar uma coleção inteira de uma vez?",
        "miss": "Quanto pesa em média uma baleia azul adulta?",
    },
    {
        "question": "Como excluo uma coleção e o que acontece com seus blocos?",
        "hit": "Como faço para apagar uma coleção e o que acontece com os blocos dela?",
        "miss": "Quais são as fases da lua ao longo do mês?",
    },
    {
        "question": "Quais tipos de bloco o editor oferece?",
        "hit": "Que tipos de bloco estão disponíveis no editor?",
        "miss": "Qual é a distância da Terra até a Lua?",
    },
    {
        "question": "Como reordeno os blocos dentro de uma coleção?",
        "hit": "Como faço para mudar a ordem dos blocos dentro de uma coleção?",
        "miss": "Qual a temperatura de ebulição da água ao nível do mar?",
    },
    {
        "question": "Como crio uma conta no Inscribing?",
        "hit": "O que preciso fazer para registrar uma conta no Inscribing?",
        "miss": "Como se planta tomate em uma horta caseira?",
    },
    {
        "question": "Quais são os requisitos para a senha?",
        "hit": "Que exigências a senha precisa cumprir?",
        "miss": "Qual foi o primeiro filme colorido da história do cinema?",
    },
    {
        "question": "Esqueci de marcar uma tarefa como concluída; posso alterá-la depois?",
        "hit": "Posso marcar uma tarefa como concluída mais tarde se eu esquecer?",
        "miss": "Qual é a melhor ração para alimentar gatos?",
    },
    {
        "question": "O que o assistente de suporte consegue responder?",
        "hit": "Sobre quais assuntos o assistente de suporte sabe responder?",
        "miss": "Como faço para trocar o pneu furado de um carro?",
    },
    {
        "question": "Por que às vezes o assistente diz que não tem uma resposta?",
        "hit": "Por que em alguns casos o assistente responde que não sabe?",
        "miss": "Qual é o maior rio do mundo em extensão?",
    },
]

# Garante (na coleta) que existe exatamente um caso para cada pergunta do FAQ.
_faq_questions = {item["question"] for item in FAQ_DATA}
_case_questions = {case["question"] for case in CASES}
assert _case_questions == _faq_questions, (
    "Os casos de teste estão fora de sincronia com o FAQ. "
    f"Faltando: {_faq_questions - _case_questions}. "
    f"Sobrando: {_case_questions - _faq_questions}."
)


def _slug(text: str) -> str:
    return "_".join(text.lower().split()[:4]).strip("?.,;:")


@pytest.fixture(scope="session")
def knowledge_base():
    """Carrega os modelos e pré-calcula os embeddings das perguntas do FAQ.

    Equivale ao que o seeder grava no pgvector: cada embedding é o vetor da
    pergunta após o pré-processamento do spaCy.
    """
    nlp_service.load_model()
    questions = [item["question"] for item in FAQ_DATA]
    embeddings = [np.array(nlp_service.vectorize(q)) for q in questions]
    return questions, embeddings


def _closest_match(query: str, knowledge_base) -> tuple[str, float]:
    """Vetoriza a query e retorna (pergunta_mais_próxima, distância_L2).

    Reproduz o `ORDER BY embedding <-> :query LIMIT 1` do pgvector usando NumPy.
    """
    questions, embeddings = knowledge_base
    query_vector = np.array(nlp_service.vectorize(query))
    distances = [float(np.linalg.norm(query_vector - emb)) for emb in embeddings]
    nearest = int(np.argmin(distances))
    return questions[nearest], distances[nearest]


@pytest.mark.parametrize("case", CASES, ids=[_slug(c["question"]) for c in CASES])
def test_acerto_recupera_pergunta_correta(case, knowledge_base):
    """Uma reformulação deve recuperar a pergunta correta com confiança alta."""
    matched, distance = _closest_match(case["hit"], knowledge_base)

    assert distance <= THRESHOLD, (
        f"Esperava confiança alta para {case['hit']!r}, mas a distância "
        f"{distance:.3f} ultrapassou o threshold {THRESHOLD}."
    )
    assert matched == case["question"], (
        f"A reformulação {case['hit']!r} casou com {matched!r} "
        f"em vez de {case['question']!r} (distância {distance:.3f})."
    )


@pytest.mark.parametrize("case", CASES, ids=[_slug(c["question"]) for c in CASES])
def test_erro_cai_no_fallback(case, knowledge_base):
    """Uma pergunta fora do domínio deve cair no fallback (sem alucinar)."""
    matched, distance = _closest_match(case["miss"], knowledge_base)

    assert distance > THRESHOLD, (
        f"Esperava fallback para a pergunta fora do domínio {case['miss']!r}, "
        f"mas ela casou com {matched!r} (distância {distance:.3f} <= "
        f"threshold {THRESHOLD})."
    )
