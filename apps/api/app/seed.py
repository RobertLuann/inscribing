from app.db.database import engine, init_db
from app.models.faq import FAQItem
from app.services.nlp_service import nlp_service
from sqlmodel import Session, select

# Base de conhecimento canônica do FAQ. Exposta no nível do módulo para ser
# reutilizada tanto pelo seeder quanto pela bateria de testes do chatbot.
FAQ_DATA = [
    {
        "question": "Como posso criar um novo bloco de texto no editor?",
        "answer": "Para criar um novo bloco, basta pressionar 'Enter' no final de um bloco existente ou clicar no botão '+' que aparece à esquerda na interface.",
    },
    {
        "question": "O chatbot do Inscribing pode inventar respostas ou alucinar?",
        "answer": "Não. O nosso chatbot utiliza Recuperação de Informação e Busca Semântica clássica. Ele não gera textos, apenas recupera respostas validadas da nossa base de conhecimento, o que garante zero alucinações.",
    },
    {
        "question": "Como transformo um bloco em uma tarefa com checkbox?",
        "answer": "Altere o tipo do bloco para 'tarefa'. Ele passará a exibir uma caixa de seleção à esquerda; clique nela para marcar a tarefa como concluída.",
    },
    {
        "question": "Minhas anotações são salvas automaticamente?",
        "answer": "Sim. As alterações nos blocos são sincronizadas com o servidor automaticamente enquanto você edita, sem necessidade de salvar manualmente.",
    },
    {
        "question": "Como crio uma nova coleção?",
        "answer": "Clique em 'Nova Coleção' na barra lateral. Você poderá dar um título e a coleção aparecerá na lista para receber seus blocos.",
    },
    {
        "question": "Como renomeio uma coleção existente?",
        "answer": "Abra o menu de opções ('...') ao lado da coleção na barra lateral e escolha 'Renomear'.",
    },
    {
        "question": "É possível duplicar uma coleção inteira?",
        "answer": "Sim. No menu de opções ('...') da coleção, selecione 'Duplicar'. Uma cópia com todos os blocos será criada com o sufixo '(cópia)'.",
    },
    {
        "question": "Como excluo uma coleção e o que acontece com seus blocos?",
        "answer": "No menu de opções ('...'), selecione 'Excluir' e confirme. A coleção e todos os seus blocos são removidos permanentemente.",
    },
    {
        "question": "Quais tipos de bloco o editor oferece?",
        "answer": "O editor suporta texto, títulos (níveis 1, 2 e 3), tarefas com checkbox, listas numeradas e listas com marcadores.",
    },
    {
        "question": "Como reordeno os blocos dentro de uma coleção?",
        "answer": "Arraste o bloco pela alça que aparece à esquerda ao passar o mouse e solte-o na posição desejada; a nova ordem é salva automaticamente.",
    },
    {
        "question": "Como crio uma conta no Inscribing?",
        "answer": "Na tela de cadastro, informe seu e-mail e defina uma senha que atenda aos requisitos de segurança. Após o cadastro, você é direcionado ao seu espaço de trabalho.",
    },
    {
        "question": "Quais são os requisitos para a senha?",
        "answer": "A senha deve ter no mínimo 8 caracteres, incluindo ao menos uma letra maiúscula, uma minúscula e um número.",
    },
    {
        "question": "Esqueci de marcar uma tarefa como concluída; posso alterá-la depois?",
        "answer": "Sim. Clique na caixa de seleção do bloco de tarefa a qualquer momento para marcá-la ou desmarcá-la; o estado é atualizado e salvo automaticamente.",
    },
    {
        "question": "O que o assistente de suporte consegue responder?",
        "answer": "O assistente responde dúvidas sobre as funcionalidades do Inscribing, como blocos, coleções, tarefas e conta, recuperando respostas da base de conhecimento por busca semântica.",
    },
    {
        "question": "Por que às vezes o assistente diz que não tem uma resposta?",
        "answer": "Quando a sua pergunta não é semanticamente próxima o suficiente de nenhuma pergunta da base, o assistente informa que não encontrou resposta. Tente reformular usando outros termos.",
    },
]


def run_seeder():
    print(
        "1. A inicializar a base de dados (e criar tabelas/extensões se necessário)..."
    )
    init_db()

    print("2. A carregar o modelo de Inteligência Artificial para a memória...")
    nlp_service.load_model()

    with Session(engine) as session:
        # Verifica se a base de dados já tem dados para não duplicar em testes futuros
        existing_items = session.exec(select(FAQItem)).all()
        if len(existing_items) > 0:
            print(
                "A base de dados já contém dados. A ignorar o seeding para evitar duplicados."
            )
            return

        print("3. A gerar vetores (embeddings) e a guardar na base de dados...")
        for item in FAQ_DATA:
            print(f"   -> A processar: '{item['question']}'")

            # Gera a lista de floats usando o modelo local
            vetor = nlp_service.vectorize(item["question"])

            # Cria a entidade do SQLModel com o vetor
            faq = FAQItem(
                question=item["question"], answer=item["answer"], embedding=vetor
            )
            session.add(faq)

        # Confirma a transação
        session.commit()
        print(
            "\n✅ Seeder concluído com sucesso! A base de dados foi populada com vetores de teste."
        )


if __name__ == "__main__":
    run_seeder()
