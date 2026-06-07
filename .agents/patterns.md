# Padrões de Código e Regras de Negócio

## 🚨 Restrições Críticas da IA (Regra de Ouro)

- **SEM LLMs:** Sob nenhuma circunstância utilize serviços generativos (OpenAI, Gemini, Claude, Llama). Todo o processamento de respostas do FAQ **deve** usar o pipeline clássico (spaCy -> SentenceTransformers -> FAISS/pgvector -> Resposta Estática).

## Backend (Python / FastAPI)

- **Idiomas:** Escreva código e nome de variáveis em **Inglês** (ex: `get_faq`, `FAQItem`). Comentários e documentações devem estar em **Português**.
- **Namespace Packages:** **NÃO** crie arquivos `__init__.py` dentro da pasta `app/` do backend. O projeto utiliza importações implícitas do Python 3.3+.
- **Performance Assíncrona (Async First):** 
  - Rotas FastAPI devem usar `async def`. 
  - Serviços pesados (modelos ML do spaCy e SentenceTransformers) devem ser implementados como **Singletons** e carregados apenas uma vez durante o ciclo de vida (Lifespan) da aplicação.
- **Dependency Injection:** Utilize o padrão do FastAPI (ex: `Depends(get_session)`) para injetar conexões de banco e instâncias de serviços nas rotas.

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
