from typing import Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column
from sqlmodel import Field, SQLModel


class FAQItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str
    embedding: Optional[list[float]] = Field(
        default=None, sa_column=Column(Vector(384))
    )
