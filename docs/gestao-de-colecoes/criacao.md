# Criação de Coleções

**Regras de Negócio:** RN06, RN07

**Módulo:** Gestão de Coleções

---

## Descrição

As coleções são a estrutura primária de agrupamento de anotações no sistema. Cada coleção possui um título e uma área de conteúdo, funcionando como um contêiner para blocos de texto e tarefas.

## Regras de Negócio

### RN06 - Nomenclatura Padrão

As estruturas de agrupamento de anotações no sistema devem ser referenciadas exclusivamente como "Coleções".

- **Descrição:** Toda referência na interface, documentação e código ao agrupamento de anotações deve utilizar o termo "Coleção" (ou "Coleções" no plural). Não utilizar termos alternativos como "pastas", "categorias", "projetos", "cadernos" ou similares.

- **Regras de Interface:**
  - O botão de criar novo agrupamento deve exibir "Nova Coleção".
  - O título da seção na sidebar deve ser "Coleções".
  - Qualquer tooltip, placeholder ou mensagem deve usar exclusivamente o termo "Coleção".

- **Critérios de Aceite:**
  - [ ] O termo "Coleção" é usado consistentemente em toda a interface.
  - [ ] Nenhum termo alternativo aparece na interface do usuário.

---

### RN07 - Criação de Coleções

O sistema deve permitir que o usuário crie, acesse e gerencie coleções individuais. Cada coleção deve possuir um título e uma área de conteúdo.

- **Inputs e Validações:**
  - **Título da coleção:**
    - Obrigatório.
    - Máximo de 100 caracteres.
    - Não pode estar em branco.
    - Deve ser único dentro do mesmo usuário (não permitir duas coleções com o mesmo nome).
  - **Área de conteúdo:** Inicializada como vazia, pronta para receber blocos de texto e tarefas.

- **Fluxo Principal:**
  1. O usuário clica no botão "+" na sidebar.
  2. Um campo de texto é exibido no topo da lista de coleções com placeholder "Nome da nova coleção".
  3. O usuário digita o título e pressiona `Enter`.
  4. O sistema valida o título (tamanho, unicidade).
  5. A coleção é criada no banco de dados.
  6. A sidebar atualiza exibindo a nova coleção na lista.
  7. O conteúdo principal carrega a área da coleção vazia, pronta para edição.

- **Fluxos Alternativos / Exceções:**
  - **Usuário clica fora:** Se o usuário clicar fora do campo sem digitar nada, o campo de criação é ocultado sem criar coleção.
  - **Título duplicado:** Se já existir uma coleção com o mesmo nome, o sistema exibe: "Já existe uma coleção com este nome." e o campo mantém o foco para correção.
  - **Título máximo excedido:** O campo não deve permitir digitar mais de 100 caracteres.
  - **Esc pressionado:** Se o usuário pressionar `Esc`, a criação é cancelada e o campo é ocultado.

- **Regras de Interface:**
  - A lista de coleções na sidebar é ordenada alfabeticamente por padrão.
  - A coleção recém-criada deve aparecer destacada por 2 segundos.
  - Ao criar, a sidebar deve automaticamente selecionar e destacar a nova coleção.
  - O campo de criação deve estar sempre acessível no topo da lista ou flutuando na sidebar.

- **Regras de Dados:**
  - Cada coleção pertence a um único usuário.
  - Estrutura esperada: `{ id, user_id, titulo, created_at, updated_at }`.
  - Ao excluir um usuário, todas as suas coleções devem ser removidas em cascata.

- **Critérios de Aceite:**
  - [ ] O usuário consegue criar uma coleção com título válido em até 2 cliques.
  - [ ] A nova coleção aparece imediatamente na sidebar.
  - [ ] Títulos duplicados são rejeitados com feedback claro.
  - [ ] O campo de criação não permite mais de 100 caracteres.
  - [ ] Ao pressionar `Esc`, a criação é cancelada sem efeitos colaterais.
