from datetime import datetime

from pydantic import BaseModel


class BlockCreate(BaseModel):
    tipo: str
    conteudo: str = ""
    ordem: int | None = None


class BlockUpdate(BaseModel):
    tipo: str | None = None
    conteudo: str | None = None
    concluida: bool | None = None


class BlockResponse(BaseModel):
    id: int
    collection_id: int
    tipo: str
    conteudo: str
    concluida: bool
    ordem: int
    created_at: datetime


class ReorderItem(BaseModel):
    id: int
    ordem: int


class ReorderRequest(BaseModel):
    items: list[ReorderItem]
