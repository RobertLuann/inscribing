import uvicorn
from fastapi import FastAPI

from app.db.database import init_db
from app.routes import chat_routes as chat
from app.services.nlp_service import nlp_service

app = FastAPI(
    title="Inscribing API",
    description="Backend para o Inscribing com busca semântica em pgvector",
)

# Registra as rotas
app.include_router(chat.router)


@app.on_event("startup")
def on_startup():
    # Inicializa banco e carrega o modelo na memória ao ligar a API
    init_db()
    nlp_service.load_model()


@app.get("/")
def read_root():
    return {
        "status": "ok",
        "mensagem": "Inscribing API está rodando na porta 8080 com SQLModel e pgvector!",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
