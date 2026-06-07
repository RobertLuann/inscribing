# Cadastro de Usuário

**Regras de Negócio:** RN02

**Módulo:** Autenticação e Conta

---

## Descrição

A tela de criação de conta permite que novos usuários se registrem no sistema, fornecendo e-mail e senha com confirmação para prevenir erros de digitação.

## Regra de Negócio

### RN02 - Validação de Cadastro

Na tela de criação de conta, o sistema deve exigir o preenchimento do e-mail, da senha e um campo obrigatório de "Confirmar senha" para validação e prevenção de erros de digitação.

- **Inputs e Validações:**
  - **E-mail:**
    - Obrigatório.
    - Deve ser único no sistema (não pode existir outro cadastro com o mesmo e-mail).
    - Deve seguir o formato `usuario@dominio.com`.
    - Validação de formato em tempo real (enquanto o usuário digita).
  - **Senha:**
    - Obrigatória.
    - Deve ter no mínimo 8 caracteres.
    - Deve conter ao menos uma letra maiúscula, uma letra minúscula e um número.
  - **Confirmar Senha:**
    - Obrigatório.
    - Deve ser exatamente igual ao campo "Senha".
    - Validação em tempo real: o sistema deve indicar visualmente se as senhas coincidem ou não.

- **Fluxo Principal:**
  1. O usuário acessa a página de cadastro (via link na tela de login).
  2. O sistema exibe o formulário com os campos: E-mail, Senha e Confirmar Senha.
  3. O usuário preenche os campos.
  4. O sistema valida cada campo em tempo real.
  5. Com todos os campos válidos, o botão "Criar conta" é habilitado.
  6. O usuário clica em "Criar conta".
  7. O sistema verifica a unicidade do e-mail no banco de dados.
  8. O sistema armazena a conta com senha hasheada.
  9. O sistema exibe mensagem de sucesso e redireciona para a tela de login.

- **Fluxos Alternativos / Exceções:**
  - **E-mail já cadastrado:** Se o e-mail já existir, o sistema exibe: "Este e-mail já está cadastrado. Faça login ou utilize outro e-mail."
  - **Senhas não coincidentes:** Se "Senha" e "Confirmar Senha" diferirem, o sistema exibe: "As senhas não coincidem." abaixo do campo de confirmação.
  - **Senha fraca:** Se a senha não atender aos requisitos mínimos, o sistema exibe uma lista de requisitos pendentes: "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula e um número."
  - **Erro de rede:** Se a requisição falhar por problemas de rede, exibir: "Erro de conexão. Verifique sua internet e tente novamente."

- **Regras de Interface:**
  - A página de cadastro deve ter o logo do Inscribing centralizado no topo.
  - O formulário deve ser centralizado na tela (largura máxima de 400px).
  - O campo "Senha" deve possuir indicador visual de força da senha (fraca / média / forte) atualizado em tempo real.
  - O campo "Confirmar Senha" deve ter um ícone de check verde ou X vermelho indicando se as senhas coincidem.
  - O botão de submissão deve exibir estado de carregamento (spinner) durante o cadastro.
  - Deve haver um link "Já tem conta? Faça login" ao final do formulário.

- **Regras de Dados:**
  - A senha deve ser armazenada com hash bcrypt.
  - O e-mail deve ser armazenado em minúsculas.
  - A data de criação da conta deve ser registrada.
  - A conta é criada com status "ativa" imediatamente.

- **Critérios de Aceite:**
  - [ ] Um novo usuário com dados válidos consegue se cadastrar e é redirecionado ao login.
  - [ ] Tentativa de cadastro com e-mail duplicado é rejeitada com mensagem clara.
  - [ ] Validação de senha e confirmação ocorre em tempo real, sem chamada ao backend.
  - [ ] Senha fraca é rejeitada com indicação visual dos requisitos.
