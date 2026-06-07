# API — Referência de Endpoints

Base URL: `http://localhost:8080`

---

## Autenticação

Todas as rotas de coleções e blocos exigem header `Authorization: Bearer <token>`.

### `POST /api/auth/register`

Cria uma nova conta.

**Request:**
```json
{
  "email": "usuario@email.com",
  "nome": "Nome do Usuário",
  "password": "Senha123",
  "confirm_password": "Senha123"
}
```

**Response `201`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "nome": "Nome do Usuário",
    "avatar_url": null,
    "created_at": "2026-06-07T..."
  }
}
```

**Erros:** `400` — e-mail já cadastrado, senha não atende requisitos, senhas não coincidem.

---

### `POST /api/auth/login`

Autentica um usuário existente.

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "Senha123"
}
```

**Response `200`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "nome": "Nome do Usuário",
    "avatar_url": null,
    "created_at": "2026-06-07T..."
  }
}
```

**Erros:** `401` — e-mail ou senha incorretos.

---

### `POST /api/auth/logout`

Invalida a sessão no frontend (stateless — apenas confirma).

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{ "message": "ok" }
```

---

### `GET /api/auth/me`

Retorna os dados do usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "id": 1,
  "email": "usuario@email.com",
  "nome": "Nome do Usuário",
  "avatar_url": null,
  "created_at": "2026-06-07T..."
}
```

---

## Coleções

Todas as rotas exigem `Authorization: Bearer <token>`.

### `GET /api/collections/`

Lista todas as coleções do usuário autenticado.

**Response `200`:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "titulo": "Minha Coleção",
    "created_at": "...",
    "updated_at": "..."
  }
]
```

---

### `POST /api/collections/`

Cria uma nova coleção.

**Request:**
```json
{ "titulo": "Nova Coleção" }
```

**Response `201`:**
```json
{
  "id": 2,
  "user_id": 1,
  "titulo": "Nova Coleção",
  "created_at": "...",
  "updated_at": "..."
}
```

---

### `PUT /api/collections/{id}`

Renomeia uma coleção.

**Request:**
```json
{ "titulo": "Novo Nome" }
```

**Response `200`:** `CollectionResponse`

---

### `DELETE /api/collections/{id}`

Exclui uma coleção e todos os seus blocos.

**Response `204`:** sem body.

---

### `POST /api/collections/{id}/duplicate`

Duplica uma coleção com todos os blocos. O título recebe sufixo `" (cópia)"` com fallback numérico.

**Response `201`:** `CollectionResponse` (nova coleção)

---

## Blocos

Todas as rotas exigem `Authorization: Bearer <token>`.

### `GET /api/collections/{collection_id}/blocks`

Lista blocos de uma coleção ordenados por `ordem`.

**Response `200`:**
```json
[
  {
    "id": 1,
    "collection_id": 1,
    "tipo": "texto",
    "conteudo": "Meu bloco de texto",
    "concluida": false,
    "ordem": 0,
    "created_at": "..."
  }
]
```

**Tipos válidos:** `texto`, `titulo1`, `titulo2`, `titulo3`, `tarefa`, `lista-numerada`, `lista-marcadores`.

---

### `POST /api/collections/{collection_id}/blocks`

Cria um novo bloco.

**Request:**
```json
{
  "tipo": "texto",
  "conteudo": "Conteúdo do bloco",
  "ordem": null
}
```

`ordem` é opcional — se omitido, o bloco é adicionado ao final.

**Response `201`:** `BlockResponse`

---

### `PUT /api/blocks/{id}`

Atualiza um bloco (conteúdo, tipo, concluida). Campos opcionais.

**Request:**
```json
{
  "conteudo": "Novo texto",
  "tipo": "tarefa",
  "concluida": true
}
```

**Response `200`:** `BlockResponse`

---

### `DELETE /api/blocks/{id}`

Remove um bloco.

**Response `204`:** sem body.

---

### `PATCH /api/blocks/reorder`

Reordena múltiplos blocos de uma só vez.

**Request:**
```json
{
  "collection_id": 1,
  "items": [
    { "id": 3, "ordem": 0 },
    { "id": 1, "ordem": 1 },
    { "id": 2, "ordem": 2 }
  ]
}
```

**Response `200`:**
```json
[
  { "id": 3, "collection_id": 1, "tipo": "texto", "conteudo": "...", "concluida": false, "ordem": 0, "created_at": "..." },
  { "id": 1, ... },
  { "id": 2, ... }
]
```

---

## Chat e FAQ

### `POST /api/chat/`

Envia uma pergunta para o chatbot de FAQ. Usa busca semântica (spaCy → SentenceTransformers → pgvector).

**Request:**
```json
{ "query": "Como criar um bloco de texto?" }
```

**Response `200` (match encontrado):**
```json
{
  "answer": "Para criar um novo bloco...",
  "confidence": "high",
  "matched_question": "Como posso criar um novo bloco de texto no editor?",
  "distance": 0.87
}
```

**Response `200` (sem match):**
```json
{
  "answer": "Desculpe, ainda não tenho uma resposta para isso. Tente reformular a pergunta.",
  "confidence": "low",
  "distance": 5.23
}
```

---

### `GET /api/faq`

Lista todas as perguntas e respostas do FAQ (sem autenticação).

**Response `200`:**
```json
[
  {
    "id": 1,
    "question": "Como posso criar um novo bloco de texto no editor?",
    "answer": "Para criar um novo bloco..."
  }
]
```

---

## Códigos de Erro Comuns

| Status | Significado |
|--------|-------------|
| `400` | Erro de validação / regra de negócio (mensagem em `detail`) |
| `401` | Token ausente, inválido ou expirado |
| `404` | Recurso não encontrado (quando aplicável) |
