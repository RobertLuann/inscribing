# Navegação Estrutural (Breadcrumbs)

**Regras de Negócio:** RN05

**Módulo:** Interface e Navegação

---

## Descrição

O cabeçalho superior do painel principal deve exibir o caminho estrutural atual do usuário, orientando sua localização espacial dentro do webapp.

## Regra de Negócio

### RN05 - Rastreio de Navegação (Breadcrumbs)

O cabeçalho superior do painel principal deve exibir o caminho estrutural atual do usuário (ex: `Inscribing / Coleção 1`), orientando a localização espacial dentro do webapp.

- **Inputs e Validações:**
  - O breadcrumb é montado automaticamente com base na navegação do usuário.
  - O primeiro nível é sempre "Inscribing" (raiz).
  - Os níveis seguintes correspondem à hierarquia da página atual (Coleção > Página > Bloco).

- **Fluxo Principal:**
  1. O usuário navega para uma coleção.
  2. O breadcrumb exibe: `Inscribing / Nome da Coleção`.
  3. Ao navegar para dentro de uma página/bloco dentro da coleção, o breadcrumb atualiza: `Inscribing / Coleção / Nome da Página`.
  4. Cada segmento do breadcrumb, exceto o atual, é um link clicável que navega para aquele nível.

- **Fluxos Alternativos / Exceções:**
  - **Caminho muito longo:** Se o breadcrumb exceder a largura disponível, segmentos intermediários devem ser colapsados em `...` com tooltip exibindo o caminho completo.
  - **Nível único:** Na página inicial do workspace, exibir apenas `Inscribing`.

- **Regras de Interface:**
  - O breadcrumb deve estar posicionado no canto superior esquerdo da área de conteúdo principal, abaixo do cabeçalho.
  - Separador entre níveis: ` / ` (barra com espaços).
  - O texto do nível atual (último) deve estar em negrito, indicando a página ativa.
  - Os níveis anteriores devem ser clicáveis com cor diferente (ex: azul/cinza claro) e hover sublinhado.
  - Fonte de tamanho pequeno (0.875rem / 14px) para não competir com o título da página.

- **Regras de Dados:**
  - O breadcrumb é derivado da rota/navegação atual no frontend.
  - Não requer armazenamento persistente dedicado.

- **Critérios de Aceite:**
  - [ ] O breadcrumb reflete corretamente a hierarquia de navegação atual.
  - [ ] Cada segmento clicável redireciona para o nível correspondente.
  - [ ] Caminhos longos são colapsados com `...` e exibem tooltip.
  - [ ] O nível atual está sempre em negrito.
