# FAQ Estático

**Regras de Negócio:** RN13, RN14

**Módulo:** Conhecimento e Suporte

---

## Descrição

O sistema deve possuir uma página dedicada às Perguntas Frequentes (FAQ), organizada em componentes de expansão (accordion) para que o usuário possa consultar visualmente as dúvidas e respostas disponíveis. Esta é a base de conhecimento oficial do sistema, alimentando também o chatbot.

## Regras de Negócio

### RN13 - Visualização do FAQ

O sistema deve possuir uma página dedicada às Perguntas Frequentes.

- **Descrição:** Existe uma rota/página acessível no sistema que lista todas as perguntas e respostas do FAQ em formato de leitura, permitindo ao usuário consultar a base de conhecimento de forma autônoma.

- **Fluxo Principal:**
  1. O usuário clica no ícone de `?` ou "Ajuda" na sidebar.
  2. O sistema navega para a página de FAQ.
  3. A página exibe todas as perguntas cadastradas no sistema, agrupadas por categoria (se houver).
  4. O usuário visualiza as perguntas e pode ler as respostas expandindo os accordions individuais ou visualizando abertas para consulta textual.

- **Regras de Interface:**
  - A página de FAQ deve ter um cabeçalho com o título "Perguntas Frequentes" e uma breve descrição.
  - As perguntas devem ser listadas verticalmente.
  - Um campo de busca textual (básico, não semântico) pode estar disponível para filtrar perguntas por palavra-chave na própria página.
  - A página de FAQ deve estar acessível para todos os tipos de usuários (logados e autenticados, conforme regra de acesso geral à funcionalidade).

- **Regras de Dados:**
  - Carrega a lista de perguntas e respostas da mesma tabela/base de dados utilizada pelo chatbot.
  - O FAQ estático é uma representação textual da base cadastrada, sem interação de "busca semântica" — é apenas uma página de consulta visual.

- **Critérios de Aceite:**
  - [ ] Existe uma página acessível listando todas as perguntas e respostas do FAQ.
  - [ ] A página pode ser acessada via sidebar (ícone de ajuda).
  - [ ] As perguntas são carregadas da mesma base de dados usada pelo chatbot.
  - [ ] A página reflete visualmente as perguntas e respostas cadastradas no banco.

---

### RN14 - Componente de Sanfona (Accordion)

As dúvidas no FAQ devem ser organizadas em componentes de expansão (accordion), permitindo ao usuário expandir e retrair as respostas em texto de forma individual.

- **Descrição:** Cada pergunta do FAQ é um item de accordion. O usuário clica na pergunta (ou no ícone de expandir) para visualizar a resposta correspondente. Apenas um accordion pode estar aberto por vez.

- **Fluxo Principal:**
  1. A página carrega exibindo apenas as perguntas (respostas ocultas).
  2. Cada pergunta é um cabeçalho clicável.
  3. O usuário clica em uma pergunta.
  4. A resposta é exibida com uma animação de expansão suave.
  5. Se outro accordion estiver aberto, ele é recolhido automaticamente (comportamento accordion puro).
  6. O usuário clica novamente na mesma pergunta para recolher a resposta.

- **Regras de Interface:**
  - Cada item de accordion deve ter:
    - Um cabeçalho com a pergunta em negrito.
    - Um ícone de seta para baixo (`▾`) ou sinal de `+` indicando que está colapsado.
    - Quando expandido, o ícone gira 180 graus ou muda para `−`.
    - A resposta aparece abaixo com padding e cor de fundo ligeiramente diferente.
  - A animação de expansão/recolhimento deve ter duração de 200ms.
  - Apenas um accordion pode estar aberto por vez (comportamento de acordeão padrão).
  - Perguntas que contém respostas muito longas devem ter altura máxima com scroll interno.

- **Critérios de Aceite:**
  - [ ] Ao clicar em uma pergunta, a resposta expande com animação suave.
  - [ ] Ao clicar novamente, a resposta recolhe.
  - [ ] Apenas um accordion permanece aberto por vez.
  - [ ] O ícone de estado (aberto/fechado) é visível e intuitivo.
