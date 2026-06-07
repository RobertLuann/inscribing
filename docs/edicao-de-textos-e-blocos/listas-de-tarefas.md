# Listas de Tarefas (Checklists)

**Regras de Negócio:** RN11, RN12

**Módulo:** Edição de Textos e Blocos

---

## Descrição

O sistema deve reconhecer e permitir a criação de blocos do tipo "lista de tarefas", onde cada item possui uma caixa de seleção interativa que, quando marcada como concluída, aplica formatação automática de texto tachado.

## Regras de Negócio

### RN11 - Blocos de Tarefas (Checklists)

O sistema deve reconhecer e permitir a criação de blocos do tipo "lista de tarefas" utilizando a sintaxe `[]`.

- **Inputs e Validações:**
  - **Sintaxe de reconhecimento:** Quando o usuário digita `[]` no início de um bloco, seguido ou não de texto, o sistema deve converter automaticamente o bloco para o tipo "lista de tarefas".
  - **Forma alternativa:** Usuário pode selecionar o tipo "Lista de tarefas" no menu de tipos de bloco (via comando `/`).
  - **Estado da caixa:** Cada item pode estar "não concluído" (vazio) ou "concluído" (marcado com check).

- **Fluxo Principal:**
  1. O usuário está em um bloco vazio e digita `[]` (ou seleciona o tipo via menu `/`).
  2. O sistema converte o bloco para o tipo "lista de tarefas".
  3. Uma caixa de seleção (checkbox) quadrada aparece à esquerda do bloco.
  4. O `[]` digitado some, e o cursor fica posicionado após a caixa, aguardando o texto da tarefa.
  5. O usuário digita o conteúdo da tarefa.
  6. Ao pressionar `Enter`, um novo bloco do mesmo tipo (lista de tarefas) é criado abaixo com sua própria caixa de seleção.

- **Fluxo Principal (Marcar como concluída):**
  1. O usuário clica na caixa de seleção de uma tarefa.
  2. A caixa é preenchida com um ícone de check (✓).
  3. O texto da tarefa recebe formatação tachada (strikethrough).

- **Fluxo Alternativo (Desmarcar):**
  1. O usuário clica novamente na caixa de seleção já marcada.
  2. A caixa volta ao estado vazio.
  3. O tachado é removido do texto.

- **Regras de Interface:**
  - A caixa de seleção deve ser quadrada (não redonda), com tamanho de 18x18px.
  - O checkbox deve estar alinhado verticalmente com o texto da tarefa.
  - Ao passar o mouse sobre a caixa, uma leve sombra/circular outline deve aparecer para indicar clicabilidade.
  - O texto com tachado deve manter um contraste de pelo menos 4.5:1 (não pode sumir).
  - Mesmo com tachado, o conteúdo da tarefa continua editável.

- **Regras de Dados:**
  - Cada bloco do tipo "lista de tarefas" armazena: `{ id, collection_id, tipo: "tarefa", conteudo, concluida: boolean, ordem }`.
  - O campo `concluida` controla o estado da caixa de seleção.

- **Critérios de Aceite:**
  - [ ] `[]` no início de um bloco converte para checklist automaticamente.
  - [ ] A caixa de seleção é clicável e alterna entre marcado/desmarcado.
  - [ ] Ao marcar a tarefa, o texto recebe formatação tachada.
  - [ ] Ao desmarcar, o tachado é removido.
  - [ ] `Enter` em uma tarefa cria uma nova tarefa abaixo do mesmo tipo.

---

### RN12 - Estilização de Tarefas Concluídas

Ao marcar a caixa de seleção de um bloco de tarefa como "concluída", o sistema deve aplicar automaticamente a formatação de texto tachado (strikethrough) no conteúdo desse bloco.

- **Descrição:** A formatação strikethrough (`<s>` ou `text-decoration: line-through`) é o indicador visual de uma tarefa concluída.

- **Regras de Interface:**
  - O texto tachado deve ser renderizado com uma linha horizontal contínua na altura mediana do texto.
  - A cor do texto tachado deve ter opacidade reduzida em 30% em relação ao texto normal.
  - A transição entre estado normal e tachado deve ser suave (animação de 150ms).

- **Regras de Dados:**
  - O estado de conclusão (`concluida: true/false`) determina a formatação.
  - A formatação nunca é armazenada como HTML ou markdown — é sempre derivada do estado booleano no banco de dados.

- **Fluxos Alternativos / Exceções:**
  - **Edição de texto concluído:** O usuário pode editar o texto de uma tarefa já concluída. O tachado deve ser mantido e aplicado ao novo texto.
  - **Converter de volta:** Se o usuário mudar o tipo do bloco de "tarefa" para "texto", a caixa de seleção é removida e o tachado é removido (caso estivesse concluída). O conteúdo textual permanece.

- **Critérios de Aceite:**
  - [ ] Tarefa concluída exibe texto com strikethrough.
  - [ ] Tarefa não concluída exibe texto normal.
  - [ ] A formatação tachada não impede a edição do texto.
  - [ ] Alterar o tipo do bloco de tarefa para texto remove o tachado e a caixa de seleção.
