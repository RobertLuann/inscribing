# Inscribing — Visão Geral

Plataforma web de anotações e gestão de tarefas inspirada no modelo de blocos do Notion, equipada com um chatbot FAQ interno projetado para suporte ao usuário utilizando técnicas clássicas de Inteligência Artificial e Recuperação de Informação (IR).

## Propósito e Contexto Acadêmico

- **Tema** Chatbot Simples para suporte ao cliente.
- **Restrição Absoluta:** É **estritamente proibido** o uso de Modelos de Linguagem de Grande Escala (LLMs) ou IA Generativa (como OpenAI, Gemini, Claude, Llama).
- **Abordagem:** O sistema opera via Processamento de Linguagem Natural (NLP) não-generativo e Busca Semântica em um banco de dados local pré-validado.

## Identidade Visual e UI/UX

- **Conceito:** Design minimalista, funcional e limpo.
- **Identidade Temática:** Composição de pergaminho e pena (onde a ponta da caneta deve estar sempre posicionada no lado correto da pena).
- **Comportamento do Editor:** A edição de texto não utiliza um campo único (`textarea`), mas sim nós independentes (blocos), permitindo reordenação e formatação modular nativa.

## Estrutura do Projeto (Monorepo)

```
├── .agents/               # Contexto para agentes LLM
├── apps/
│   ├── api/               # Backend FastAPI (Python 3.13)
│   └── web/               # Frontend Next.js (TypeScript)
├── dev.docker-compose.yml # Banco PostgreSQL + pgvector
└── README.md
```

## Estado Atual do Repositório

- **Backend:** Completo. 15 endpoints REST, autenticação JWT (registro, login, sessão), gestão de coleções e blocos (CRUD + duplicação + reordenação), pipeline NLP spaCy (tokenização, lematização, stop words) + SentenceTransformers, busca semântica com pgvector e threshold configurável via env var. Seed do FAQ funcional.
- **Frontend:** Encontra-se no scaffold inicial do Next.js (template padrão). A interface do editor BlockNote, chat, autenticação e FAQ ainda não foram implementadas.
