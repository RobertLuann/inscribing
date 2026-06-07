# Login

**Regras de Negócio:** RN01

**Módulo:** Autenticação e Conta

---

## Descrição

O acesso ao ambiente interno do webapp é restrito a usuários autenticados. A tela de login é a porta de entrada para o sistema, exigindo credenciais válidas para liberar o acesso ao workspace.

## Regra de Negócio

### RN01 - Credenciais de Acesso (Login)

O acesso ao ambiente interno do webapp é restrito a usuários autenticados, exigindo e-mail e senha.

- **Inputs e Validações:**
  - **E-mail:** Deve ser um e-mail válido (formato `usuario@dominio.com`). O sistema deve validar a presença do caractere `@` e de um domínio após o mesmo.
  - **Senha:** Campo obrigatório. Não pode estar vazio.
  - **Campos obrigatórios:** Ambos os campos (e-mail e senha) devem ser preenchidos para habilitar o botão de submissão.

- **Fluxo Principal:**
  1. O usuário acessa a página de login.
  2. O sistema exibe o formulário com os campos de e-mail e senha.
  3. O usuário preenche ambos os campos.
  4. O usuário clica no botão "Entrar" (ou pressiona `Enter`).
  5. O sistema valida as credenciais contra o banco de dados.
  6. Em caso de sucesso, o sistema redireciona o usuário para o workspace principal.
  7. Uma sessão é iniciada e o usuário é identificado pelo sistema.

- **Fluxos Alternativos / Exceções:**
  - **E-mail inválido:** Se o e-mail não seguir o formato esperado, o sistema exibe uma mensagem de erro imediatamente abaixo do campo: "Insira um e-mail válido." O botão de submissão permanece desabilitado.
  - **Campos vazios:** Se o usuário tentar submeter sem preencher ambos os campos, o sistema exibe "Preencha todos os campos obrigatórios" em destaque no topo do formulário.
  - **Credenciais incorretas:** Se o e-mail não existir ou a senha estiver errada, o sistema exibe uma mensagem de erro genérica acima do formulário: "E-mail ou senha incorretos. Tente novamente." (não revelar qual campo está errado por segurança).
  - **Múltiplas tentativas:** Após 5 tentativas consecutivas com falha no mesmo e-mail, o sistema deve bloquear o login por 60 segundos e exibir: "Muitas tentativas. Tente novamente em 1 minuto."

- **Regras de Interface:**
  - A página de login deve ter o logo do Inscribing centralizado no topo.
  - O formulário deve ser centralizado na tela com largura máxima de 400px.
  - O botão de submissão deve exibir um estado de carregamento (spinner) durante a validação das credenciais.
  - O campo de senha deve possuir um ícone de "olho" para alternativa entre ocultar/exibir o texto da senha.
  - Deve haver um link "Criar conta" ao final do formulário para redirecionar à página de cadastro.

- **Regras de Dados:**
  - As credenciais são armazenadas no banco de dados relacional.
  - A senha deve ser armazenada com hash seguro (bcrypt ou similar).
  - A sessão deve utilizar tokens JWT ou sessões HTTP seguras.

- **Critérios de Aceite:**
  - [ ] Um usuário com credenciais válidas consegue acessar o workspace em até 3 segundos.
  - [ ] Um usuário com e-mail inválido recebe feedback visual imediato sem chamada ao backend.
  - [ ] Um usuário com credenciais incorretas recebe mensagem genérica de erro.
  - [ ] O bloqueio por múltiplas tentativas falhas é aplicado corretamente.
  - [ ] A senha não é exibida em texto plano em nenhum momento.
