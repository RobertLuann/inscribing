import os

from sqlmodel import Session, SQLModel, create_engine, text

# Pega do .env que você já mapeou no Docker Compose
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_NAME = os.getenv("DB_NAME", "inscribing")
DB_PORT = os.getenv("DB_PORT", "5432")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@localhost:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False)


def init_db():
    with Session(engine) as session:
        # AQUI FOI A MUDANÇA: de session.exec() para session.execute()
        session.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        session.commit()
    SQLModel.metadata.create_all(engine)


def get_session():
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()
