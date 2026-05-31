# Inscribing 📝🤖

Uma plataforma web de anotações e gestão de tarefas inspirada no modelo de blocos do Notion, equipada com um chatbot interno de suporte baseado estritamente em **Busca Semântica** e **Recuperação de Informação (IR)**.

Este projeto foi desenvolvido como uma solução de suporte controlada, eliminando o uso de IAs generativas (LLMs) para evitar alucinações de respostas e reduzir o custo computacional em ambientes acadêmicos e corporativos restritos.

---

## ✨ Funcionalidades Principais

* **Editor Baseado em Blocos:** Interface intuitiva para criação e organização de notas e tarefas.
* **Chatbot FAQ Não-Generativo:** Sistema de suporte em tempo real que responde a dúvidas dos usuários extraindo informações exatas de uma base de dados pré-validada.
* **Busca Semântica Avançada:** Compreensão de contexto e intenção (ao invés de correspondência exata de palavras) utilizando embeddings vetoriais.
* **Alta Performance:** Backend assíncrono e motor de busca vetorial otimizado para respostas em milissegundos.

---

## 🛠️ Tecnologias Utilizadas

O projeto adota uma arquitetura cliente-servidor desacoplada (Monorepo), dividida em duas camadas principais:

### Frontend (`apps/web`)
* **Next.js (App Router):** Framework React para renderização e estruturação da interface.
* **TypeScript & Tailwind CSS:** Tipagem estática e estilização utilitária.
* **Bun:** Gerenciador de pacotes e runtime de altíssima performance.

### Backend (`apps/api`)
* **FastAPI:** Framework Python assíncrono para a construção da API REST.
* **uv:** Gerenciador de dependências e ambientes virtuais Python extremamente rápido.
* **spaCy:** Biblioteca de NLP clássico para pré-processamento e normalização textual.
* **Sentence-Transformers:** Geração de vetores densos (Embeddings) para mapeamento semântico.
* **FAISS (Facebook AI Similarity Search):** Indexação e busca vetorial de similaridade em larga escala.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
* [Bun](https://bun.sh/)
* [uv](https://docs.astral.sh/uv/)

### 1. Clonando o repositório
```bash
git clone https://github.com/RobertLuann/inscribing.git
cd inscribing
```

### 2. Configurando a API (Backend)
```bash
cd apps/api

# O uv sync cria o ambiente virtual (.venv) e instala as dependências do uv.lock automaticamente
uv sync

# Baixa o modelo de linguagem em português do spaCy
uv run python -m spacy download pt_core_news_sm

# Executa o servidor FastAPI (rodando na porta 8080)
uv run python main.py
```

### 3. Configurando a WEB (Frontend)
```bash
cd apps/web

# Instala as dependências via Bun
bun install

# Inicia o servidor de desenvolvimento do Next.js
bun dev
```
