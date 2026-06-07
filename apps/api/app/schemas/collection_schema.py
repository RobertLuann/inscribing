from datetime import datetime

from pydantic import BaseModel


class CollectionCreate(BaseModel):
    titulo: str


class CollectionUpdate(BaseModel):
    titulo: str


class CollectionResponse(BaseModel):
    id: int
    user_id: int
    titulo: str
    created_at: datetime
    updated_at: datetime
