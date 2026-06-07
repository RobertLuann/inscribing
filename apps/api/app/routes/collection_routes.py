from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.db.database import get_session
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.collection_schema import (
    CollectionCreate,
    CollectionResponse,
    CollectionUpdate,
)
from app.services.collection_service import CollectionService

router = APIRouter(prefix="/api/collections", tags=["Coleções"])


@router.get("/", response_model=list[CollectionResponse])
def list_collections(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = CollectionService(session)
    return service.list_by_user(user.id)  # type: ignore


@router.post(
    "/", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED
)
def create_collection(
    request: CollectionCreate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = CollectionService(session)
    return service.create(user_id=user.id, titulo=request.titulo)  # type: ignore


@router.put("/{id}", response_model=CollectionResponse)
def rename_collection(
    id: int,
    request: CollectionUpdate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = CollectionService(session)
    return service.rename(collection_id=id, user_id=user.id, new_titulo=request.titulo)  # type: ignore


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collection(
    id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = CollectionService(session)
    service.delete(collection_id=id, user_id=user.id)  # type: ignore


@router.post(
    "/{id}/duplicate",
    response_model=CollectionResponse,
    status_code=status.HTTP_201_CREATED,
)
def duplicate_collection(
    id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = CollectionService(session)
    return service.duplicate(collection_id=id, user_id=user.id)  # type: ignore
