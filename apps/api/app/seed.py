from db.database import engine, init_db
from models.faq import FAQItem
from services.nlp_service import nlp_service
from sqlmodel import Session, select


def run_seeder():
    print(
        "1. A inicializar a base de dados (e criar tabelas/extensões se necessário)..."
    )
    init_db()

    print("2. A carregar o modelo de Inteligência Artificial para a memória...")
    nlp_service.load_model()

    # Dados de teste baseados no contexto do Inscribing
    faq_data = [
        {
            "question": "Como posso criar um novo bloco de texto no editor?",
            "answer": "Para criar um novo bloco, basta pressionar 'Enter' no final de um bloco existente ou clicar no botão '+' que aparece à esquerda na interface.",
        },
        {
            "question": "O chatbot do Inscribing pode inventar respostas ou alucinar?",
            "answer": "Não. O nosso chatbot utiliza Recuperação de Informação e Busca Semântica clássica. Ele não gera textos, apenas recupera respostas validadas da nossa base de conhecimento, o que garante 100% de precisão e zero alucinações.",
        },
    ]

    with Session(engine) as session:
        # Verifica se a base de dados já tem dados para não duplicar em testes futuros
        existing_items = session.exec(select(FAQItem)).all()
        if len(existing_items) > 0:
            print(
                "A base de dados já contém dados. A ignorar o seeding para evitar duplicados."
            )
            return

        print("3. A gerar vetores (embeddings) e a guardar na base de dados...")
        for item in faq_data:
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
