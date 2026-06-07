# Arquitetura e Fluxo de Dados

## Visão Geral do Fluxo do Chatbot (Passo a Passo)

```
Next.js (Frontend)
    │
    ├─ Fluxo de Autenticação
    │   POST /api/auth/register  →  register  →  bcrypt hash  →  JWT token
    │   POST /api/auth/login     →  verify    →  JWT token
    │   GET  /api/auth/me        →  Bearer token  →  decode  →  User
    │
    ├─ Fluxo de Coleções e Blocos (autenticado)
    │   GET/POST   /api/collections          →  CRUD
    │   PUT/DELETE /api/collections/{id}     →  rename / delete
    │   POST       /api/collections/{id}/duplicate → cópia + blocos
    │   GET/POST   /api/collections/{id}/blocks   →  listar / criar blocos
    │   PUT/DELETE /api/blocks/{id}          →  update / delete
    │   PATCH      /api/blocks/reorder       →  reordenar
    │
    └─ Fluxo do Chatbot
        POST /api/chat { query }
            │
            ├─ 2. spaCy: Limpeza e normalização do texto da query
            │    (tokenização, remoção de stop words, lematização).
            │
            ├─ 3. SentenceTransformers: Geração de Embedding (list[float] 384d).
            │
            ├─ 4. pgvector: Busca de similaridade (distância L2).
            │
            ├─ 5. Threshold: Se L2 > CHAT_THRESHOLD (env var, default 4.5),
            │    retorna mensagem de falloff.
            │
            └─ 6. Retorno: JSON { answer, confidence, matched_question, distance }
```

## Estrutura do Backend (`apps/api/app/`)

O projeto utiliza **Namespace Packages** do Python, logo, não possui (nem deve possuir) arquivos `__init__.py`.

```
app/
├── main.py                     # FastAPI app, startup hooks, router includes, exception handler
├── seed.py                     # Popula FAQ no banco (executado via `uv run python -m app.seed`)
├── db/
│   └── database.py             # Engine SQLModel, sessão (get_session), init_db()
├── dependencies.py             # get_current_user (JWT → User)
├── models/
│   ├── faq.py                  # FAQItem (id, question, answer, embedding vector)
│   ├── user.py                 # User (id, email, nome, senha_hash, avatar_url)
│   ├── collection.py           # Collection (id, user_id FK, titulo, timestamps)
│   └── block.py                # Block (id, collection_id FK, tipo, conteudo, concluida, ordem)
├── repositories/
│   ├── faq_repository.py       # find_closest_match (L2 distance)
│   ├── user_repository.py      # create, find_by_email, find_by_id
│   ├── collection_repository.py# CRUD + find_by_user_id
│   └── block_repository.py     # CRUD + find_by_collection_id + reorder
├── routes/
│   ├── chat_routes.py          # POST /api/chat + GET /api/faq
│   ├── auth_routes.py          # register, login, logout, me
│   ├── collection_routes.py    # CRUD + duplicate
│   └── block_routes.py         # CRUD + reorder
├── schemas/
│   ├── chat_schema.py          # ChatRequest, ChatResponse, FAQResponse
│   ├── auth_schema.py          # RegisterRequest, LoginRequest, AuthResponse, UserResponse
│   ├── collection_schema.py    # CollectionCreate, CollectionUpdate, CollectionResponse
│   └── block_schema.py         # BlockCreate, BlockUpdate, BlockResponse, ReorderRequest
└── services/
    ├── nlp_service.py          # Singleton: spaCy + SentenceTransformers
    ├── auth_service.py         # Singleton: bcrypt hash + JWT create/decode
    ├── user_service.py         # register, get_by_email, get_by_id
    ├── collection_service.py   # create, rename, delete, duplicate, list_by_user
    └── block_service.py        # create, update, delete, reorder, list_by_collection
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

- **PostgreSQL (`pgvector`)** armazena os dados persistentes (usuários, coleções, blocos e embeddings do FAQ).
- **FAISS** (opcional/complementar) pode ser usado como um índice carregado em memória no backend para reduzir a carga de queries no banco de dados durante picos de suporte, calculando a distância matemática de forma segregada.

## Variáveis de Ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `DB_USER` | `postgres` | Usuário do PostgreSQL |
| `DB_PASSWORD` | `postgres` | Senha do PostgreSQL |
| `DB_NAME` | `inscribing` | Nome do banco de dados |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `JWT_SECRET` | — | Chave secreta para assinar tokens JWT |
| `JWT_ALGORITHM` | `HS256` | Algoritmo de assinatura JWT |
| `JWT_EXPIRATION` | `3600` | Tempo de expiração do token em segundos |
| `CHAT_THRESHOLD` | `4.5` | Distância L2 máxima para considerar match no FAQ |

## Comandos Úteis (Backend)

```bash
uv run uvicorn app.main:app --reload   # Iniciar servidor dev
uv run python -m app.seed              # Popular FAQ no banco
uv run task lint                       # Lint (se configurado)
```
