# Barra Lateral (Sidebar)

**Regras de Negócio:** RN04

**Módulo:** Interface e Navegação

---

## Descrição

A barra lateral é o principal componente de navegação do workspace. Deve ser responsiva e retrátil, otimizando o espaço de tela e adaptando-se ao contexto de uso.

## Regra de Negócio

### RN04 - Comportamento da Barra Lateral (Sidebar)

A barra lateral de navegação deve ser responsiva e retrátil. Quando colapsada, o sistema deve ocultar os rótulos de texto e exibir apenas os ícones representativos (livros para coleções, '+' para adição, '?' para ajuda).

- **Inputs e Validações:**
  - **Estado expandido:** Largura padrão de 240px. Exibe ícone + rótulo de texto de cada item.
  - **Estado colapsado:** Largura reduzida para 56px. Exibe apenas o ícone de cada item.
  - **Alternância:** Um botão de toggle (ícone de dupla seta ou hambúrguer) no topo da sidebar controla o estado.
  - O estado da sidebar (expandido/colapsado) deve ser salvo em preferências do usuário para persistir entre sessões.

- **Fluxo Principal:**
  1. O usuário acessa o workspace com a sidebar no último estado salvo (expandida por padrão).
  2. O usuário visualiza os ícones e rótulos de cada seção: Coleções (ícone de livro), Criar (+) e Ajuda (?).
  3. O usuário clica no botão de toggle.
  4. A sidebar colapsa suavemente para 56px, ocultando os textos e mantendo apenas os ícones.
  5. O conteúdo principal da página expande-se para ocupar o espaço liberado.
  6. Ao passar o mouse sobre a sidebar colapsada, exibir um tooltip com o nome do item.

- **Fluxos Alternativos / Exceções:**
  - **Tela pequena (< 768px):** Em dispositivos com largura de tela pequena, a sidebar deve iniciar oculta e ser acionada por um botão de menu no cabeçalho.
  - **Animação:** A transição entre expandido e colapsado deve ter duração de 200ms com easing suave (`ease-in-out`).

- **Regras de Interface:**
  - A sidebar deve ocupar 100% da altura da viewport.
  - O fundo deve ter uma cor sutilmente diferente do conteúdo principal.
  - Cada item da sidebar deve ter hover state com destaque.
  - O item ativo (página atual) deve ser destacado com cor de fundo diferente ou borda lateral.
  - Ícone do toggle deve rotacionar 180 graus quando a sidebar estiver colapsada.

- **Regras de Dados:**
  - O estado da sidebar (expandida/colapsada) deve ser armazenado no `localStorage` do navegador.
  - Não requer persistência no backend.

- **Critérios de Aceite:**
  - [ ] A sidebar colapsa e expande com animação suave ao clicar no toggle.
  - [ ] Ao colapsar, os textos somem e apenas os ícones permanecem visíveis.
  - [ ] O estado é preservado ao recarregar a página.
  - [ ] Em telas pequenas, a sidebar inicia oculta e é acionada por botão no cabeçalho.
  - [ ] Tooltips aparecem ao passar o mouse sobre ícones na sidebar colapsada.
