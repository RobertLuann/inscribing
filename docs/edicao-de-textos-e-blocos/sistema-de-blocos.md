# Sistema de Blocos

**Regras de Negócio:** RN09, RN10

**Módulo:** Edição de Textos e Blocos

---

## Descrição

Diferente de editores tradicionais baseados em textarea, o Inscribing adota um modelo de edição baseado em nós independentes (blocos). Cada parágrafo ou elemento visual é uma entidade separada que pode ser manipulada individualmente.

## Regras de Negócio

### RN09 - Estrutura Baseada em Nós (Blocos)

O conteúdo das coleções não deve ser tratado como um texto contínuo em bloco único, mas sim dividido em blocos independentes, onde cada parágrafo ou elemento é uma entidade separada.

- **Descrição:** A edição é modular. Cada bloco pode ser:
  - **Bloco de texto:** Parágrafo simples com formatação inline (negrito, itálico, sublinhado).
  - **Bloco de título:** Cabeçalhos (H1, H2, H3).
  - **Bloco de tarefa:** Checklist com caixa de seleção.
  - **Bloco de lista:** Lista numerada ou com marcadores.

- **Fluxo Principal:**
  1. O usuário abre uma coleção.
  2. A área de conteúdo exibe os blocos existentes empilhados verticalmente.
  3. Cada bloco ocupa uma linha independente e pode ser selecionado clicando sobre ele.
  4. O usuário digita texto normalmente dentro de um bloco.
  5. O cursor pode navegar entre blocos usando as setas do teclado.
  6. Blocos podem ser reordenados via drag-and-drop (ícone de alça na margem esquerda).
  7. Blocos podem ser deletados individualmente (backspace em bloco vazio ou menu de contexto).

- **Fluxos Alternativos / Exceções:**
  - **Bloco vazio:** Um bloco sem conteúdo deve exibir um placeholder sutil: "Digite algo ou digite '/' para comandos..."
  - **Reordenação:** Ao arrastar, os blocos adjacentes devem se afastar para indicar visualmente onde o bloco será inserido.

- **Regras de Interface:**
  - Cada bloco deve ter um padding vertical mínimo de 4px e máximo de 12px entre parágrafos.
  - Ao selecionar um bloco, uma borda sutil deve aparecer à esquerda do bloco (ou o fundo pode mudar ligeiramente).
  - A alça de arrasto (`⠿` ou `⋮⋮`) deve aparecer à esquerda do bloco ao passar o mouse.
  - Cada bloco deve possuir um menu de tipo no canto esquerdo (ícone de `T` para texto, caixa para checklist, etc.) permitindo alterar o tipo do bloco.

- **Regras de Dados:**
  - Cada bloco possui: `{ id, collection_id, tipo, conteudo, ordem, criado_em, atualizado_em }`.
  - A ordem dos blocos é controlada por um campo numérico sequencial.
  - Ao reordenar, apenas os campos de ordem dos blocos afetados são alterados (não a coleção inteira).

- **Critérios de Aceite:**
  - [ ] O conteúdo é renderizado como blocos independentes, não como textarea.
  - [ ] É possível navegar entre blocos usando as setas do teclado.
  - [ ] Blocos podem ser reordenados via drag-and-drop.
  - [ ] Blocos vazios exibem placeholder.
  - [ ] Cada bloco pode mudar de tipo (texto, título, tarefa, lista) via menu.

---

### RN10 - Acionadores de Criação de Bloco

A criação de um novo bloco ocorre de duas formas: pressionando `Enter` ao final de uma linha ativa ou clicando em um ícone de `+` que aparece flutuando na margem esquerda ao passar o mouse sobre uma área vazia.

- **Fluxo Principal (Teclado):**
  1. O usuário está digitando em um bloco ativo.
  2. O cursor está ao final do texto.
  3. O usuário pressiona `Enter`.
  4. Um novo bloco do tipo "texto" é criado imediatamente abaixo do bloco atual.
  5. O cursor move-se para o novo bloco.

- **Fluxo Principal (Clique):**
  1. O usuário passa o mouse sobre uma área vazia entre dois blocos.
  2. Um ícone `+` circular aparece centralizado entre os blocos.
  3. O usuário clica no `+`.
  4. Um novo bloco do tipo "texto" é inserido entre os blocos adjacentes.
  5. O cursor posiciona-se no novo bloco.

- **Fluxo Principal (Comando `/`):**
  1. O usuário digita `/` no início de um bloco vazio.
  2. Um menu de tipos de bloco é exibido (Texto, Título 1, Título 2, Título 3, Lista de tarefas, Lista numerada, Lista com marcadores).
  3. O usuário seleciona um tipo.
  4. O bloco atual se transforma no tipo selecionado.
  5. O menu `/` desaparece.

- **Fluxos Alternativos / Exceções:**
  - **Enter no meio do texto:** Se o cursor estiver no meio de uma frase ao pressionar `Enter`, o texto a partir do cursor é movido para o novo bloco.
  - **Shift+Enter:** Deve inserir uma quebra de linha dentro do mesmo bloco (sem criar novo bloco).
  - **Enter em bloco vazio:** Se o bloco estiver vazio e o usuário pressionar `Enter`, nada acontece (sem criar bloco duplicado vazio).

- **Regras de Interface:**
  - O ícone `+` deve ter tamanho pequeno (24x24px), com borda circular e cor de destave.
  - O menu de comando `/` deve aparecer como um dropdown flutuante com animação suave.
  - O menu de comando `/` deve filtrar os tipos enquanto o usuário digita (ex: `/tex` filtra para "Texto").
  - A criação de bloco via `Enter` deve ser instantânea, sem atraso perceptível.

- **Critérios de Aceite:**
  - [ ] `Enter` ao final de um bloco cria um novo bloco do tipo texto abaixo.
  - [ ] `Enter` no meio do texto divide o bloco em dois.
  - [ ] O ícone `+` aparece entre blocos ao passar o mouse e cria bloco ao clicar.
  - [ ] O menu `/` exibe tipos de bloco e transforma o bloco atual no tipo selecionado.
  - [ ] `Shift+Enter` insere quebra de linha dentro do mesmo bloco.
