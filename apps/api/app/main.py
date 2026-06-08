import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.responses import JSONResponse

from app.db.database import init_db
from app.logging_config import setup_logging
from app.routes import auth_routes as auth
from app.routes import block_routes as block
from app.routes import chat_routes as chat
from app.routes import collection_routes as collection
from app.services.nlp_service import nlp_service

# Configura o logging educativo do chatbot logo na importação da aplicação.
setup_logging()

app = FastAPI(
    title="Inscribing API",
    description="Backend para o Inscribing com busca semântica em pgvector",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handler global para regras de negócio
@app.exception_handler(ValueError)
def value_error_handler(_request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


# Registra as rotas
app.include_router(chat.router)
app.include_router(chat.faq_router)
app.include_router(auth.router)
app.include_router(collection.router)
app.include_router(block.router)


@app.on_event("startup")
def on_startup():
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
