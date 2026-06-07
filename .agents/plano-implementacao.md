# Plano de Implementação — Backend

Estratégia de desenvolvimento em camadas para o backend (`apps/api`), partindo dos modelos de dados até os endpoints da API.

---

## Camada 1 — Models (definições de dados)

Criar todos os modelos SQLModel que faltam no diretório `app/models/`.

| Model | Arquivo | Campos |
|---|---|---|
| `FAQItem` | `app/models/faq.py` | id, question, answer, embedding (vector), created_at |
| `User` | `app/models/user.py` | id, email, nome, senha_hash, avatar_url, created_at |
| `Collection` | `app/models/collection.py` | id, user_id (FK), titulo, created_at, updated_at |
| `Block` | `app/models/block.py` | id, collection_id (FK), tipo (enum), conteudo, concluida, ordem, created_at |

## Camada 2 — Repositories (acesso a dados)

Abrir/abstrair consultas ao banco no diretório `app/repositories/`.

| Repository | Operações |
|---|---|
| `FAQRepository` | ✅ Já existe. Ajustar para a model criada na camada 1 |
| `UserRepository` | create, find_by_email, find_by_id |
| `CollectionRepository` | create, find_by_id, find_by_user_id, update, delete, duplicate |
| `BlockRepository` | create, find_by_collection_id, update, delete, reorder, find_by_id |

## Camada 3 — Services (regras de negócio)

Encapsular lógica de negócio no diretório `app/services/`.

| Service | Responsabilidades |
|---|---|
| `NLPService` | ✅ Já existe. Adicionar pipeline spaCy (RN18) + FAISS como cache de índice |
| `AuthService` | Hash de senha (bcrypt), geração/validação de JWT, validação de cadastro |
| `CollectionService` | Lógica de criação, validação de título único por usuário, duplicação |
| `BlockService` | Lógica de tipos de bloco, reordenação, validação de conteúdo |

## Camada 4 — Routes (endpoints da API)

Registrar rotas no FastAPI. Autenticação protege as rotas de coleções e blocos.

### Autenticação (`app/routes/auth_routes.py`)

| Método | Rota | Funcionalidade | RN |
|---|---|---|---|
| POST | `/api/auth/register` | Cadastro de usuário | RN02 |
| POST | `/api/auth/login` | Login | RN01 |
| POST | `/api/auth/logout` | Logout | — |
| GET | `/api/auth/me` | Sessão atual | RN03 |

### Coleções (`app/routes/collection_routes.py`)

| Método | Rota | Funcionalidade | RN |
|---|---|---|---|
| GET | `/api/collections` | Listar coleções do usuário | RN07 |
| POST | `/api/collections` | Criar coleção | RN07 |
| PUT | `/api/collections/{id}` | Renomear | RN08 |
| DELETE | `/api/collections/{id}` | Excluir | RN08 |
| POST | `/api/collections/{id}/duplicate` | Duplicar | RN08 |

### Blocos (`app/routes/block_routes.py`)

| Método | Rota | Funcionalidade | RN |
|---|---|---|---|
| GET | `/api/collections/{id}/blocks` | Listar blocos | RN09 |
| POST | `/api/collections/{id}/blocks` | Criar bloco | RN10 |
| PUT | `/api/blocks/{id}` | Atualizar bloco (conteúdo, tipo, concluida) | RN11, RN12 |
| DELETE | `/api/blocks/{id}` | Deletar bloco | RN09 |
| PATCH | `/api/blocks/reorder` | Reordenar blocos | RN09 |

### Chat e FAQ (`app/routes/chat_routes.py` — já existe)

| Método | Rota | Funcionalidade | RN |
|---|---|---|---|
| POST | `/api/chat` | ✅ Já existe. Integrar pipeline spaCy | RN15-RN21 |
| GET | `/api/faq` | Listar FAQ (para página estática) | RN13 |

---

## Ordem de Execução

```
Iteração 1 — Models:      FAQItem, User, Collection, Block
Iteração 2 — Repositories: UserRepo, CollectionRepo, BlockRepo
Iteração 3 — Services:     AuthService, CollectionService, BlockService + melhorias NLP
Iteração 4 — Routes:       Auth, Collections, Blocks
Iteração 5 — Ajustes:      Pipeline spaCy no NLPService + rota GET /api/faq
```
