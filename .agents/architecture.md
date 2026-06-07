# Arquitetura e Fluxo de Dados

## Visão Geral do Fluxo do Chatbot (Passo a Passo)

```
Next.js (Frontend)
    │ 1. POST /api/chat { query }
    ▼
FastAPI (Backend)
    │
    ├─ 2. spaCy: Limpeza e normalização do texto da query.
    │
    ├─ 3. SentenceTransformers: Geração de Embedding (list[float]).
    │
    ├─ 4. FAISS / pgvector: Busca de similaridade no índice vetorial 
    │     (Calcula a menor distância L2 entre a query e o banco de FAQs).
    │
    ├─ 5. Database (PostgreSQL): Resgata a resposta em texto exata baseada na ID/Threshold (< 4.5).
    │
    └─ 6. Retorno: JSON { answer, confidence, ... } -> Renderizado no frontend.
```

## Estrutura do Backend (`apps/api/app/`)

O projeto utiliza **Namespace Packages** do Python, logo, não possui (nem deve possuir) arquivos `__init__.py`.

```
app/
├── main.py                     # FastAPI app, startup hooks, router includes
├── seed.py                     # Popula FAQ no banco (executado via `uv run python app/seed.py`)
├── db/
│   └── database.py             # Engine SQLModel, sessão (get_session), init_db()
├── models/
│   └── faq.py                  # Modelos SQLModel (ex: FAQItem com vetor) - A SER CRIADO
├── repositories/
│   └── faq_repository.py       # Interação com BD (find_closest_match)
├── routes/
│   └── chat_routes.py          # POST /api/chat
├── schemas/
│   └── chat_schema.py          # Pydantic (ChatRequest / ChatResponse)
└── services/
    └── nlp_service.py          # Singleton carregado no startup (spaCy/SentenceTransformers)
```

## Estrutura do Frontend (`apps/web/src/`)

A edição de texto é tratada como uma árvore de nós (blocos via BlockNote/Prosemirror), nunca como um texto plano gigante.

```
src/
└── app/
    ├── layout.tsx              # Root layout com tipografia (Geist fonts)
    ├── page.tsx                # Página principal (atualmente scaffold)
    └── globals.css             # Tailwind v4 (@import "tailwindcss") + custom CSS vars
```

## Persistência vs Busca em Memória

- **PostgreSQL (`pgvector`)** armazena os dados persistentes, as páginas, blocos do usuário e os embeddings do FAQ.
- **FAISS** (opcional/complementar) pode ser usado como um índice carregado em memória no backend para reduzir a carga de queries no banco de dados durante picos de suporte, calculando a distância matemática de forma segregada.
