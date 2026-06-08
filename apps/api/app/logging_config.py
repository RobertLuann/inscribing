"""Configuração de logging para fins educativos/demonstrativos.

Centraliza um logger dedicado ("inscribing") com saída legível no stdout, para
que o passo a passo do pipeline do chatbot (NLP -> embedding -> busca vetorial
-> decisão) fique explícito no terminal durante a demonstração.
"""

import logging
import sys

# Logger raiz da aplicação. Os módulos usam filhos como "inscribing.chat".
logger = logging.getLogger("inscribing")


def setup_logging() -> None:
    # Evita adicionar handlers duplicados em recarregamentos (reload do uvicorn).
    if logger.handlers:
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s | %(levelname)-5s | %(name)s | %(message)s",
            datefmt="%H:%M:%S",
        )
    )

    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    # Não propaga para o root para evitar mensagens duplicadas com o uvicorn.
    logger.propagate = False
