import uvicorn
from fastapi import FastAPI

app = FastAPI(
    title="Inscribing API", description="Backend para o Inscribing com busca semântica"
)


@app.get("/")
def read_root():
    return {"status": "ok", "mensagem": "Inscribing API está rodando na porta 8080!"}


if __name__ == "__main__":
    # Rodando o servidor com a porta 8080 pré-definida e reload ativado para dev
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
