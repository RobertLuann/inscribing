# Stack Tecnológica

## Frontend (`apps/web`)

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js (App Router)| 16.2.6 | Framework React para a interface |
| BlockNote | — | Motor de Rich Text (baseado em Prosemirror) para blocos e listas interativas |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Estilização utilitária |
| Biome | 2.2.0 | Linter + Formatter |
| Bun | — | Gerenciador de pacotes e runtime local |

## Backend (`apps/api`) e Banco de Dados

| Tecnologia | Versão | Uso |
|---|---|---|
| Python | 3.13 | Runtime principal do backend |
| FastAPI | — | API REST assíncrona de alta performance |
| SQLModel | 0.0.38 | ORM (SQLAlchemy + Pydantic) |
| PostgreSQL + pgvector| 18 | Banco de dados relacional e extensão para vetores |
| psycopg2-binary | 2.9.12 | Driver PostgreSQL |
| Uvicorn | 0.48.0 | Servidor ASGI |
| uv (Astral) | — | Gerenciador de dependências e ambientes virtuais |

## Inteligência Artificial (NLP e Busca Semântica)

| Tecnologia | Versão | Uso |
|---|---|---|
| spaCy | 3.8.14 | Processamento (NLP clássico): limpeza de ruídos, tokenização, lematização |
| Sentence-Transformers| 5.5.1 | Geração de Embeddings (ex: `paraphrase-multilingual-MiniLM-L12-v2`) |
| FAISS | 1.14.2 | Facebook AI Similarity Search. Indexação e busca vetorial super rápida (L2/Cosseno) |

## Infraestrutura

- **Docker Compose:** Utilizado para levantar o ambiente de desenvolvimento local (banco de dados PostgreSQL com pgvector exposto na porta 5432). As aplicações `api` e `web` rodam nativamente.
