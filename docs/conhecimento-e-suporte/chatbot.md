# Chatbot Assistente

**Regras de Negócio:** RN15, RN16, RN17, RN18, RN19, RN20, RN21

**Módulo:** Conhecimento e Suporte

---

## Descrição

O assistente inteligente (chatbot) é um sistema de FAQ interativo que opera exclusivamente por meio de Processamento de Linguagem Natural (NLP) não-generativo e busca semântica vetorial. É acionado por um botão flutuante e processa dúvidas do usuário sem utilizar modelos de linguagem generativos (LLMs).

## Regras de Negócio

### RN15 - Ponto de Acesso (FAB)

O chatbot deve ser acionado através de um Botão Flutuante de Ação (Floating Action Button) com ícone de balão de fala, fixado no canto inferior direito em todas as telas internas do workspace.

- **Descrição:** O FAB é o único ponto de entrada para o chatbot. Deve estar sempre visível em todas as páginas do workspace (após login).

- **Regras de Interface:**
  - Posicionado no canto inferior direito da tela.
  - Distância das bordas: 24px do fundo e 24px da direita.
  - Ícone: balão de fala/chat (`💬` ou ícone SVG de mensagem).
  - Tamanho: 56x56px (padrão Material Design FAB).
  - Cor: primária do sistema (deve contrastar com o fundo do workspace).
  - Sombra: elevação sutil para destacar da interface.
  - Ao clicar, um painel/card de chat abre-se como overlay sobre a interface.
  - Ao abrir o chat, o FAB pode sumir ou transformar-se em um botão de fechar (`X`).

- **Critérios de Aceite:**
  - [ ] O FAB está presente em todas as telas do workspace.
  - [ ] O FAB abre o painel do chat ao ser clicado.
  - [ ] O painel de chat fecha e retorna ao FAB ao clicar no botão de fechar.

---

### RN16 - Restrição de Geração de Texto

O chatbot não pode utilizar modelos generativos (LLMs) ou alucinar textos. Ele opera exclusivamente em modo de recuperação de informação.

- **Descrição:** Esta é uma regra de **restrição absoluta**. Nenhum modelo generativo (OpenAI GPT, Claude, Gemini, Llama, etc.) pode ser utilizado. O sistema deve retornar APENAS respostas pré-cadastradas existentes na base de FAQ.

- **Regras de Dados:**
  - A resposta retornada é exatamente o texto cadastrado no banco para a pergunta mais similar encontrada.
  - Não há formatação dinâmica, sumarização ou paráfrase da resposta.

- **Critérios de Aceite:**
  - [ ] Nenhuma dependência de LLM externo ou local está presente no código.
  - [ ] A resposta do chatbot é sempre idêntica ao texto cadastrado no FAQ.
  - [ ] Não há qualquer geração de texto nova.

---

### RN17 - Base de Conhecimento Fechada

As respostas do chatbot devem ser extraídas única e exclusivamente do banco de dados oficial do FAQ cadastrado no sistema.

- **Descrição:** O chatbot não pode buscar respostas em fontes externas (web, arquivos locais, APIs externas). Toda resposta vem exclusivamente da tabela/cadastro de FAQ no banco de dados relacional.

- **Critérios de Aceite:**
  - [ ] A única fonte de dados do chatbot é a tabela FAQ do banco de dados.
  - [ ] Nenhuma chamada externa a APIs de conhecimento é realizada.
  - [ ] A base de FAQ é gerenciável via seed ou interface administrativa.

---

### RN18 - Processamento de Linguagem Natural Clássico

A entrada do usuário deve obrigatoriamente passar por um pipeline de limpeza textual (tokenização, lematização e remoção de stop words) antes da busca.

- **Descrição:** Antes de vetorizar a pergunta, o texto passa pelo pipeline de NLP do spaCy (ou similar clássico) para normalização.

- **Pipeline obrigatório:**
  1. **Tokenização:** Quebrar a frase em tokens (palavras individuais).
  2. **Remoção de stop words:** Remover palavras de alta frequência sem significado semântico relevante (artigos, preposições, conjunções).
  3. **Lematização:** Reduzir cada palavra à sua forma base (ex: "correndo" → "correr", "casas" → "casa").
  4. **Limpeza adicional:** Remover pontuação excessiva, espaços duplicados, caracteres especiais não relevantes.

- **Regras de Dados:**
  - O mesmo pipeline de limpeza deve ser aplicado tanto na inserção das perguntas no FAQ quanto na consulta do usuário.
  - O texto original do usuário não é alterado — a limpeza é aplicada apenas para o processo de vetorização.

- **Critérios de Aceite:**
  - [ ] Toda consulta passa pelo pipeline de limpeza textual.
  - [ ] O mesmo pipeline é aplicado na indexação e na consulta.
  - [ ] Stop words em português são corretamente removidas.
  - [ ] A lematização funciona corretamente para o português.

---

### RN19 - Busca Semântica Vetorial

A correspondência de dúvidas não deve ocorrer por palavras-chave literais, mas pelo cálculo numérico do significado da frase usando embeddings vetoriais.

- **Descrição:** Cada pergunta do FAQ é convertida em um vetor numérico (embedding) usando Sentence-Transformers. A consulta do usuário também é vetorizada, e a busca encontra a pergunta mais semanticamente próxima — não por palavras exatas, mas por similaridade de sentido.

- **Fluxo Técnico:**
  1. Todas as perguntas do FAQ são vetorizadas e armazenadas (no banco pgvector ou índice FAISS).
  2. A consulta limpa do usuário é vetorizada usando o mesmo modelo.
  3. O sistema calcula a distância entre o vetor da consulta e todos os vetores do FAQ.
  4. A pergunta com menor distância (maior similaridade) é selecionada.

- **Regras de Dados:**
  - Modelo de embedding recomendado: `paraphrase-multilingual-MiniLM-L12-v2` (384 dimensões, multilíngue).
  - Os embeddings podem ser armazenados como vetores no PostgreSQL (pgvector) ou em índice FAISS na memória.

- **Critérios de Aceite:**
  - [ ] A busca identifica perguntas semanticamente similares, mesmo sem palavras-chave exatas.
  - [ ] O modelo de embedding é carregado localmente (sem API externa).
  - [ ] Perguntas em português são corretamente interpretadas.

---

### RN20 - Cálculo de Similaridade e Retorno

O sistema deve calcular a distância (ex: Similaridade de Cosseno) entre a dúvida do usuário e o FAQ, retornando a resposta com maior pontuação matemática.

- **Descrição:** A métrica de similaridade define a proximidade semântica. A resposta com maior similaridade é retornada, desde que atinja o threshold mínimo (RN21).

- **Detalhamento:**
  - **Distância L2 (Euclidiana)** ou **Similaridade de Cosseno** podem ser utilizadas.
  - A função de similaridade converte distância em uma pontuação de 0 a 1 (quanto mais próximo de 1, mais similar).
  - Apenas o resultado melhor classificado é retornado.

- **Estrutura de Retorno (JSON):**
  ```json
  {
    "answer": "Resposta cadastrada no FAQ",
    "confidence": 0.87,
    "matched_question": "Pergunta que gerou a correspondência",
    "distance": 0.13
  }
  ```

- **Critérios de Aceite:**
  - [ ] A métrica de similaridade é calculada corretamente entre vetores.
  - [ ] A resposta retornada inclui o texto da resposta e a pontuação de confiança.
  - [ ] Apenas o melhor resultado é retornado.

---

### RN21 - Limiar de Confiança (Threshold)

Deve existir um índice mínimo de similaridade pré-configurado. Se a dúvida do usuário não alcançar esse índice com nenhuma pergunta da base, o chatbot acionará um retorno de falha padrão informando que não encontrou a resposta.

- **Descrição:** Para evitar respostas incorretas ou de baixa relevância, um limite mínimo de similaridade é definido. Abaixo dele, o chatbot assume que não possui resposta adequada.

- **Valores de Threshold:**
  - **Threshold padrão:** 0.65 (similaridade de cosseno) ou distância L2 < 4.5 (conforme implementação atual no código).
  - **Ajustável:** O valor deve ser configurável via variável de ambiente ou arquivo de configuração, sem necessidade de deploy.

- **Comportamento abaixo do threshold:**
  - O chatbot exibe a mensagem padrão: "Desculpe, não encontrei uma resposta para sua dúvida. Tente reformular sua pergunta ou consulte nossa página de FAQ."
  - A resposta de falha não deve conter informações parciais ou tentativas de adivinhar a resposta.

- **Regras de Interface:**
  - A mensagem de falha deve ser visualmente distinta das respostas de sucesso (ex: ícone de aviso ou tom de cor diferente).
  - Deve incluir um link para a página de FAQ estático como alternativa.

- **Critérios de Aceite:**
  - [ ] Consultas com similaridade abaixo do threshold retornam mensagem de falha padrão.
  - [ ] O threshold é configurável sem alteração de código.
  - [ ] A mensagem de falha inclui link para a página de FAQ.
  - [ ] Nenhuma resposta com confiança abaixo do threshold é exibida ao usuário.
