import logging
from typing import Optional

import numpy as np
import spacy
from sentence_transformers import SentenceTransformer

logger = logging.getLogger("inscribing.nlp")


class NLPService:
    def __init__(self):
        self.model: Optional[SentenceTransformer] = None
        self.nlp: Optional[spacy.Language] = None

    def load_model(self):
        if self.model is None:
            self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

        if self.nlp is None:
            self.nlp = spacy.load("pt_core_news_sm")

    def preprocess(self, text: str) -> str:
        if self.nlp is None:
            raise RuntimeError(
                "O modelo spaCy não foi carregado. Chame load_model() primeiro."
            )

        logger.info("    [spaCy] Texto recebido para pré-processamento: %r", text)

        doc = self.nlp(text)
        logger.info(
            "    [spaCy] Tokens brutos (%d): %s",
            len(doc),
            [token.text for token in doc],
        )

        removidos = [
            token.text
            for token in doc
            if token.is_stop or token.is_punct or token.is_space or token.like_num
        ]
        if removidos:
            logger.info(
                "    [spaCy] Removidos (stopwords/pontuação/espaços/números): %s",
                removidos,
            )

        tokens = [
            token.lemma_.lower().strip()
            for token in doc
            if not token.is_stop
            and not token.is_punct
            and not token.is_space
            and not token.like_num
        ]

        cleaned = " ".join(tokens)
        logger.info("    [spaCy] Tokens lematizados mantidos: %s", tokens)
        logger.info("    [spaCy] Texto normalizado final: %r", cleaned)
        return cleaned

    def vectorize(self, text: str) -> list[float]:
        current_model = self.model

        if current_model is None:
            raise RuntimeError(
                "O modelo NLP não foi carregado. Chame load_model() primeiro."
            )

        cleaned = self.preprocess(text)
        logger.info(
            "    [SentenceTransformers] Gerando embedding do texto normalizado..."
        )
        vector = current_model.encode(cleaned)
        logger.info(
            "    [SentenceTransformers] Embedding gerado: dimensão=%d, prévia[0:5]=%s",
            len(vector),
            np.round(vector[:5], 4).tolist(),
        )
        return vector.tolist()

    def calculate_distance(self, vec1, text2: str) -> float:
        current_model = self.model

        if current_model is None:
            raise RuntimeError(
                "O modelo NLP não foi carregado. Chame load_model() primeiro."
            )

        cleaned = self.preprocess(text2)
        vec2 = current_model.encode(cleaned)
        distance = float(np.linalg.norm(np.array(vec1) - vec2))
        logger.info(
            "    [NumPy] Distância L2 (euclidiana) entre os embeddings: %.4f",
            distance,
        )
        return distance


nlp_service = NLPService()
