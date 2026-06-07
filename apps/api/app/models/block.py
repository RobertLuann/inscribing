from typing import Optional

from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


class Block(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    collection_id: int = Field(foreign_key="collection.id", nullable=False)
    tipo: str = Field(nullable=False)
    conteudo: str = Field(default="")
    concluida: bool = Field(default=False)
    ordem: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
