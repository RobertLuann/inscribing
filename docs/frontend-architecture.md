# Arquitetura do Frontend

## Visão Geral

O frontend da aplicação Inscribing será desenvolvido utilizando Next.js 16 (App Router), React 19, Tailwind v4, Biome e TypeScript. O foco é em um design limpo, moderno e minimalista, conforme o sistema de design fornecido.

## Dependências Principais

*   `@blocknote/react`, `@blocknote/core`: Editor de blocos.
*   `lucide-react`: Biblioteca de ícones.
*   `clsx`, `tailwind-merge`: Utilitários para classes CSS.
*   `react-hook-form`, `@hookform/resolvers`, `zod`: Gerenciamento de formulários e validação.
*   `@tanstack/react-query`: Gerenciamento de estado do servidor (cache, fetching, etc.).

## Configuração do Tailwind CSS

*   **Paleta de Cores:**
    *   `primary: #2381df` (Azul principal)
    *   `background: #ffffff`
    *   `foreground: #000000` (Texto principal)
    *   `muted-foreground: #333333` (Texto secundário)
    *   `border: #cccccc` (Bordas, separadores)
    *   `card: #f7f7f7` (Fundo de elementos sutis, ex: item ativo da sidebar)
*   **Tipografia:** `font-sans` e `font-mono` usando variáveis da Geist.
*   **Espaçamento e Arredondamento:** Definições consistentes.

## Estrutura de Diretórios

```
src/
├── app/
│   ├── layout.tsx              # Root layout + QueryProvider + AuthProvider
│   ├── globals.css             # Tailwind imports + custom CSS para Geist
│   ├── page.tsx                # Redirect para /workspace ou /login
│   ├── login/page.tsx          # Formulário de login (react-hook-form + zod)
│   ├── register/page.tsx       # Formulário de cadastro (react-hook-form + zod)
│   ├── workspace/
│   │   └── page.tsx            # Layout principal: Sidebar + Header + Editor
│   └── faq/page.tsx            # Página estática de FAQ
├── components/
│   ├── ui/                     # Primitivas reutilizáveis (alinhadas ao DS)
│   │   ├── Button.tsx          # Estilo primário azul, secundário neutro
│   │   ├── Input.tsx           # Borda cinza clara, cantos arredondados
│   │   ├── Modal.tsx           # Para confirmação de exclusão
│   │   └── Accordion.tsx       # Para página de FAQ
│   ├── layout/
│   │   ├── Sidebar.tsx         # Lógica de expansão/colapso (64px/256px)
│   │   ├── Header.tsx          # Logo, Breadcrumbs, Avatar do usuário
│   │   └── Breadcrumbs.tsx     # Estilo de navegação hierárquica
│   ├── auth/
│   │   ├── LoginForm.tsx       # UI alinhada ao Login.png
│   │   └── RegisterForm.tsx    # UI alinhada ao Cadastro.png
│   ├── collections/
│   │   ├── CollectionList.tsx
│   │   ├── CollectionItem.tsx  # Item com fundo card na seleção, menu '...'
│   │   └── CollectionMenu.tsx  # Menu de contexto (renomear, duplicar, excluir)
│   ├── editor/
│   │   ├── BlockEditor.tsx     # Wrapper do BlockNote, checkboxes customizados
│   │   └── TaskBlock.tsx       # Renderização de bloco de tarefa customizado
│   └── chat/
│       ├── ChatFAB.tsx         # Botão flutuante estilizado
│       ├── ChatPanel.tsx       # Overlay do chat
│       ├── ChatMessage.tsx
│       └── ChatInput.tsx
├── contexts/
│   ├── AuthContext.tsx          # user + token + login/logout/register (único state global)
│   └── QueryProvider.tsx        # QueryClientProvider wrapper
├── hooks/                       # Custom hooks com tanstack query
│   ├── useCollections.ts       # useQuery + useMutation (CRUD)
│   ├── useBlocks.ts            # useQuery + useMutation (CRUD + reorder)
│   ├── useAuth.ts              # useMutation (login, register)
│   ├── useChat.ts              # useMutation (POST /api/chat)
│   └── useFaq.ts               # useQuery (GET /api/faq)
├── services/
│   └── api.ts                  # fetch wrapper com auth header
├── types/
│   ├── auth.ts, collection.ts, block.ts, chat.ts
├── lib/
│   ├── utils.ts                # cn(), formatDate, etc.
│   └── constants.ts            # API_BASE_URL, THRESHOLD, etc.
└── middleware.ts                # Redireciona / → /login ou /workspace baseado no token
```

## Ordem de Implementação Sugerida

1.  **Configuração do Ambiente:** Instalar dependências, configurar `tailwind.config.ts` com paleta de cores e tipografia.
2.  **Definição de Tipos:** Criar arquivos de tipos em `types/`.
3.  **Utilitários e Constantes:** Implementar `services/api.ts`, `lib/utils.ts`, `lib/constants.ts`.
4.  **Contextos e Provedor de Query:** Criar `AuthContext.tsx` e `QueryProvider.tsx`.
5.  **Hooks de Dados (Tanstack Query):** Implementar hooks em `hooks/` para coleções, blocos, autenticação, chat e FAQ.
6.  **Componentes UI Primitivos:** Desenvolver `Button.tsx`, `Input.tsx`, `Modal.tsx`, `Accordion.tsx` com base no design system.
7.  **Componentes de Layout Base:** Implementar `Sidebar.tsx` (64px/256px), `Header.tsx`, `Breadcrumbs.tsx`.
8.  **Páginas de Autenticação:** Criar `login/page.tsx`, `register/page.tsx`, `middleware.ts` com formulários (`LoginForm.tsx`, `RegisterForm.tsx`).
9.  **Página Principal (Workspace):** Desenvolver `workspace/page.tsx` integrando o layout e seleção de coleção.
10. **Editor de Blocos:** Integrar `BlockEditor.tsx` (BlockNote) à coleção ativa, com suporte a checkboxes.
11. **Componentes de Coleções:** `CollectionList.tsx`, `CollectionItem.tsx`, `CollectionMenu.tsx` com as ações de CRUD.
12. **Chatbot:** Implementar `ChatFAB.tsx` e `ChatPanel.tsx` e seus sub-componentes.
13. **Página de FAQ:** Criar `faq/page.tsx` com o componente `Accordion`.
