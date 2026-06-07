# Gerenciamento de Coleções

**Regras de Negócio:** RN08

**Módulo:** Gestão de Coleções

---

## Descrição

Cada coleção listada na barra lateral deve oferecer um menu de contexto com ações secundárias para gerenciar a coleção, como renomear, excluir ou duplicar.

## Regra de Negócio

### RN08 - Ações de Coleção

Cada coleção listada na barra lateral expandida deve possuir um botão de menu de contexto (representado por reticências `...`) para abrigar ações secundárias, como renomear, excluir ou duplicar.

- **Inputs e Validações:**

  - **Renomear:**
    - Novo título deve respeitar as mesmas regras de criação (obrigatório, máximo 100 caracteres, único por usuário).
    - O campo deve vir pré-preenchido com o nome atual.
  - **Excluir:**
    - Deve exibir um diálogo de confirmação antes de executar.
    - A exclusão é irreversível — remove a coleção e todo seu conteúdo.
  - **Duplicar:**
    - Cria uma cópia idêntica da coleção com sufixo " (cópia)" no título.
    - Se o título com sufixo já existir, adicionar um número sequencial: " (cópia 2)", " (cópia 3)".

- **Fluxo Principal (Abrir Menu):**
  1. O usuário passa o mouse sobre uma coleção na sidebar expandida.
  2. O botão `...` (reticências) aparece à direita do título da coleção.
  3. O usuário clica no botão.
  4. Um menu suspenso é exibido com as opções: "Renomear", "Duplicar" e "Excluir".

- **Fluxo Principal (Renomear):**
  1. Usuário seleciona "Renomear" no menu.
  2. O título da coleção na sidebar torna-se um campo de texto editável.
  3. O campo vem pré-preenchido com o nome atual e com o texto selecionado.
  4. Usuário edita o título e pressiona `Enter`.
  5. Sistema valida o novo título.
  6. Coleção é atualizada no banco de dados.
  7. Sidebar reflete o novo nome imediatamente.

- **Fluxo Principal (Excluir):**
  1. Usuário seleciona "Excluir" no menu.
  2. Um modal de confirmação é exibido: "Tem certeza que deseja excluir a coleção '[nome]'? Esta ação não pode ser desfeita."
  3. Botões: "Cancelar" (fecha o modal) e "Excluir" (confirma e executa).
  4. Ao confirmar, a coleção e todo seu conteúdo são removidos.
  5. Sidebar remove a coleção da lista.
  6. Se a coleção excluída era a atual no painel principal, o painel volta para a tela inicial do workspace.

- **Fluxo Principal (Duplicar):**
  1. Usuário seleciona "Duplicar" no menu.
  2. Sistema cria uma nova coleção com os mesmos blocos de conteúdo.
  3. O título da nova coleção é o título original + " (cópia)".
  4. A nova coleção aparece imediatamente na sidebar.
  5. Um toast de sucesso é exibido: "Coleção duplicada com sucesso."

- **Fluxos Alternativos / Exceções:**
  - **Sidebar colapsada:** Se a sidebar estiver colapsada, o menu de contexto não deve ser exibido para evitar problemas de espaço. O usuário deve expandir a sidebar para acessar as ações.
  - **Renomear cancelado:** Se o usuário pressionar `Esc` ou clicar fora do campo durante a renomeação, a operação é cancelada e o nome original é restaurado.
  - **Exclusão de última coleção:** O sistema deve permitir excluir todas as coleções (o usuário pode começar do zero).

- **Regras de Interface:**
  - O botão `...` só aparece visível ao passar o mouse sobre o item (hover).
  - O menu de contexto deve aparecer alinhado à direita do botão.
  - Ao clicar em qualquer lugar fora do menu, este deve fechar.
  - O modal de exclusão deve ter fundo escuro semi-transparente (overlay) e estar centralizado.
  - A opção "Excluir" deve ter cor vermelha para indicar ação destrutiva.

- **Regras de Dados:**
  - A duplicação deve copiar todos os blocos associados à coleção original, atribuindo novos IDs.
  - A exclusão é física (DELETE no banco), não lógica.

- **Critérios de Aceite:**
  - [ ] O botão `...` aparece ao hover e desaparece quando o mouse sai.
  - [ ] Renomear permite editar o título com validação e persiste a alteração.
  - [ ] Excluir exibe modal de confirmação e remove a coleção e seu conteúdo.
  - [ ] Duplicar cria cópia com sufixo " (cópia)" e todos os blocos preservados.
  - [ ] Na sidebar colapsada, o menu de contexto não é exibido.
