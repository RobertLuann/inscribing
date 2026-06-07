from typing import Optional

import numpy as np
from sentence_transformers import SentenceTransformer


class NLPService:
    def __init__(self):
        self.model: Optional[SentenceTransformer] = None

    def load_model(self):
        if not self.model:
            self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

    def vectorize(self, text: str) -> list[float]:
        # 1. Atribuímos o atributo da classe a uma variável local
        current_model = self.model

        # 2. Fazemos a verificação na variável local
        if current_model is None:
            raise RuntimeError(
                "O modelo NLP não foi carregado. Chame load_model() primeiro."
            )

        # 3. Usamos a variável local. O Pylance sabe que current_model NÃO é None!
        return current_model.encode(text).tolist()

    def calculate_distance(self, vec1, text2: str) -> float:
        current_model = self.model

        if current_model is None:
            raise RuntimeError(
                "O modelo NLP não foi carregado. Chame load_model() primeiro."
            )

        vec2 = current_model.encode(text2)
        return float(np.linalg.norm(vec1 - vec2))


nlp_service = NLPService()
