from typing import Optional

import numpy as np
import spacy
from sentence_transformers import SentenceTransformer


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

        doc = self.nlp(text)

        tokens = [
            token.lemma_.lower().strip()
            for token in doc
            if not token.is_stop
            and not token.is_punct
            and not token.is_space
            and not token.like_num
        ]

        return " ".join(tokens)

    def vectorize(self, text: str) -> list[float]:
        current_model = self.model

        if current_model is None:
            raise RuntimeError(
                "O modelo NLP não foi carregado. Chame load_model() primeiro."
            )

        cleaned = self.preprocess(text)
        return current_model.encode(cleaned).tolist()

    def calculate_distance(self, vec1, text2: str) -> float:
        current_model = self.model

        if current_model is None:
            raise RuntimeError(
                "O modelo NLP não foi carregado. Chame load_model() primeiro."
            )

        cleaned = self.preprocess(text2)
        vec2 = current_model.encode(cleaned)
        return float(np.linalg.norm(vec1 - vec2))


nlp_service = NLPService()
