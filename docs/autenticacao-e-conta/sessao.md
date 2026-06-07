# Identificação da Sessão

**Regras de Negócio:** RN03

**Módulo:** Autenticação e Conta

---

## Descrição

Após autenticado, o sistema deve identificar visualmente o usuário logado em todas as telas do workspace, exibindo seu nome e um avatar personalizado.

## Regra de Negócio

### RN03 - Identificação da Sessão

O sistema deve exibir o nome do usuário logado e um ícone de avatar no canto superior direito do cabeçalho principal, garantindo a identificação da sessão ativa.

- **Inputs e Validações:**
  - **Nome do usuário:** Obtido automaticamente da sessão ativa (e-mail ou nome cadastrado).
  - **Avatar:** Caso o usuário não tenha feito upload de uma imagem de perfil, o sistema deve gerar um avatar padrão com as iniciais do nome.

- **Fluxo Principal:**
  1. O usuário realiza login com sucesso.
  2. O sistema carrega o workspace.
  3. No canto superior direito do cabeçalho, o sistema exibe o nome do usuário e o avatar (ou iniciais).
  4. Ao clicar no avatar/nome, um menu suspenso é exibido com opções: "Perfil", "Configurações" e "Sair".
  5. O usuário permanece identificado durante toda a sessão.

- **Fluxos Alternativos / Exceções:**
  - **Sessão expirada:** Se o token/sessão expirar, ao carregar qualquer tela o sistema deve redirecionar automaticamente para a página de login com a mensagem: "Sessão expirada. Faça login novamente."
  - **Avatar personalizado:** Se o usuário tiver feito upload de imagem, exibir a imagem em um círculo de 36x36px.

- **Regras de Interface:**
  - O avatar deve estar fixo no canto superior direito do cabeçalho (header), acima de qualquer scroll da página.
  - O nome exibido deve ser o nome completo do usuário, truncado com reticências (`...`) se exceder 20 caracteres.
  - O menu suspenso deve ter um pequeno triângulo indicando a direção e abrir com animação suave.
  - Ao clicar fora do menu, este deve fechar automaticamente.

- **Regras de Dados:**
  - A sessão deve ser mantida via token JWT armazenado em cookie HTTP-only ou localStorage.
  - O token deve ter expiração de 24 horas por padrão.
  - Ao clicar em "Sair", o token deve ser invalidado tanto no frontend quanto no backend.

- **Critérios de Aceite:**
  - [ ] O nome e avatar do usuário são exibidos no cabeçalho imediatamente após o login.
  - [ ] O menu suspenso com opções de Perfil, Configurações e Sair é funcional.
  - [ ] Ao deslogar, o token é invalidado e o usuário é redirecionado ao login.
  - [ ] Sessão expirada redireciona automaticamente para a tela de login.
