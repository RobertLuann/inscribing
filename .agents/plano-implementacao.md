# Plano de Implementação — Backend

Estratégia de desenvolvimento em camadas para o backend (`apps/api`).

---

## Status Final da Implementação

| Iteração | Conteúdo | Status | Commits |
|----------|----------|--------|---------|
| **Config** | bcrypt + python-jose, JWT env vars, fix seed/database | ✅ | `23ac7ea` |
| **Camada 1 — Models** | FAQItem, User, Collection, Block | ✅ | `ed7f62f` |
| **Camada 2 — Repositories** | FAQRepo, UserRepo, CollectionRepo, BlockRepo | ✅ | `1fffcdd` |
| **Camada 3 — Services** | AuthService, UserService, CollectionService, BlockService + Dependencies | ✅ | `e9c1f38` |
| **Camada 4 — Schemas** | Auth, Collection, Block schemas (Pydantic) | ✅ | `e9dffe3` |
| **Camada 5 — Routes** | Auth (register/login/logout/me), Collections (CRUD + dup), Blocks (CRUD + reorder) | ✅ | `d5cd454` |
| **Camada 6 — NLP spaCy** | Pipeline de limpeza textual (tokenização, stop words, lematização) no NLPService | ✅ | `0e9aaad` |
| **Camada 7 — FAQ** | GET /api/faq + THRESHOLD configurável via env var | ✅ | `457c757` |
| **Type Fixes** | `cast()` para PKs opcionais, type ignores específicos | ✅ | _(junto dos demais)_ |

---

## Arquitetura Final do Backend

```
app/
├── main.py                     # FastAPI app, startup hooks, router includes, exception handler
├── seed.py                     # Popula FAQ no banco (uv run python -m app.seed)
├── dependencies.py             # get_current_user (JWT → User)
├── db/
│   └── database.py             # Engine SQLModel, sessão (get_session), init_db()
├── models/
│   ├── faq.py                  # FAQItem
│   ├── user.py                 # User
│   ├── collection.py           # Collection
│   └── block.py                # Block
├── repositories/
│   ├── faq_repository.py       # find_closest_match (L2 distance via pgvector)
│   ├── user_repository.py      # CRUD + find_by_email
│   ├── collection_repository.py# CRUD + find_by_user_id
│   └── block_repository.py     # CRUD + find_by_collection_id + reorder
├── routes/
│   ├── chat_routes.py          # POST /api/chat + GET /api/faq
│   ├── auth_routes.py          # 4 endpoints (register, login, logout, me)
│   ├── collection_routes.py    # 5 endpoints (CRUD + duplicate)
│   └── block_routes.py         # 5 endpoints (CRUD + reorder)
├── schemas/
│   ├── chat_schema.py          # ChatRequest, ChatResponse, FAQResponse
│   ├── auth_schema.py          # RegisterRequest, LoginRequest, AuthResponse, UserResponse
│   ├── collection_schema.py    # CollectionCreate, CollectionUpdate, CollectionResponse
│   └── block_schema.py         # BlockCreate, BlockUpdate, BlockResponse, ReorderRequest
└── services/
    ├── nlp_service.py          # Singleton: spaCy + SentenceTransformers
    ├── auth_service.py         # Singleton: bcrypt + JWT
    ├── user_service.py         # register, get_by_email, get_by_id
    ├── collection_service.py   # create, rename, delete, duplicate, list_by_user
    └── block_service.py        # create, update, delete, reorder, list_by_collection
```

## Total de Endpoints: 15

| Módulo | Endpoints |
|--------|-----------|
| Auth | POST register, POST login, POST logout, GET me |
| Collections | GET list, POST create, PUT rename, DELETE delete, POST duplicate |
| Blocks | GET list, POST create, PUT update, DELETE delete, PATCH reorder |
| Chat/FAQ | POST chat, GET FAQ list |

## Próximos Passos

- **Frontend:** Implementar interface do usuário (autenticação, sidebar, editor de blocos, chat, FAQ).
- **Testes:** Adicionar testes unitários e de integração para o backend.
