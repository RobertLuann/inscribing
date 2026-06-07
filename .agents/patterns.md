# Padrões de Código e Regras de Negócio

## 🚨 Restrições Críticas da IA (Regra de Ouro)

- **SEM LLMs:** Sob nenhuma circunstância utilize serviços generativos (OpenAI, Gemini, Claude, Llama). Todo o processamento de respostas do FAQ **deve** usar o pipeline clássico (spaCy -> SentenceTransformers -> FAISS/pgvector -> Resposta Estática).

## Backend (Python / FastAPI)

- **Idiomas:** Escreva código e nome de variáveis em **Inglês** (ex: `get_faq`, `FAQItem`). Comentários e documentações devem estar em **Português**.
- **Namespace Packages:** **NÃO** crie arquivos `__init__.py` dentro da pasta `app/` do backend. O projeto utiliza importações implícitas do Python 3.3+.
- **Performance Assíncrona (Async First):** 
  - Rotas FastAPI devem usar `async def`.
  - Serviços pesados (modelos ML do spaCy e SentenceTransformers) devem ser implementados como **Singletons** e carregados apenas uma vez durante o ciclo de vida (Lifespan) da aplicação.
- **Dependency Injection:** Utilize o padrão do FastAPI (ex: `Depends(get_session)`, `Depends(get_current_user)`) para injetar conexões de banco e instâncias de serviços nas rotas.
- **Auth Guard:** Rotas protegidas usam `user: User = Depends(get_current_user)` que extrai o token JWT do header `Authorization: Bearer <token>`.
- **Tratamento de Erros:** Services lançam `ValueError` para regras de negócio. O `main.py` possui um exception handler global que converte `ValueError` → `400 Bad Request` com `{"detail": mensagem}`.
- **PKs Opcionais do SQLModel:** SQLModel tipa chaves primárias como `Optional[int]`. Após `commit()` + `refresh()`, o valor é garantido. Use `cast(int, obj.id)` em vez de `# type: ignore` para resolver a tipagem.
- **Type Ignores Específicos:** Quando inevitável (bibliotecas sem stubs), use o código de erro específico: `# type: ignore[attr-defined]` para métodos desconhecidos (ex: `l2_distance` do pgvector) e `# type: ignore[arg-type]` para tipo de argumento (ex: `Block.ordem` em `order_by`).
- **Config por Env Vars:** Parâmetros sensíveis e configuráveis devem ser lidos via `os.getenv()` com fallback: `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRATION`, `CHAT_THRESHOLD`.

## Frontend (TypeScript / Next.js)

- **Editor Baseado em Nós:** A interface de texto deve ser construída com o `BlockNote`. Nunca utilize um `<textarea>` global para o editor. Tudo é um bloco independente.
- **Design Visual (Tema Pena/Pergaminho):** Mantenha o minimalismo. Se houver inserção de ícones de pena, garanta que a orientação gráfica da mesma esteja logicamente correta para escrita.
- **Tailwind v4:** A configuração utiliza `@import "tailwindcss"` no arquivo CSS global (não utilize a diretiva `@tailwind` da v3).
- **Linter (Biome):** O projeto usa Biome para linting e formatação (2 espaços de indentação, aspas simples/duplas conforme configurado).
- **Scripts Bun:**
  - `bun dev` (servidor local)
  - `bun format` (formata com Biome)
  - `bun lint` (checagem de regras)
- **Path Alias:** Importações internas devem usar o alias `@/` apontando para a raiz `src/`.
