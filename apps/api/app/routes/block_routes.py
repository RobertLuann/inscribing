from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.db.database import get_session
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.block_schema import (
    BlockCreate,
    BlockResponse,
    BlockUpdate,
    ReorderRequest,
)
from app.services.block_service import BlockService

router = APIRouter(tags=["Blocos"])


@router.get(
    "/api/collections/{collection_id}/blocks",
    response_model=list[BlockResponse],
)
def list_blocks(
    collection_id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = BlockService(session)
    return service.list_by_collection(collection_id=collection_id, user_id=user.id)  # type: ignore


@router.post(
    "/api/collections/{collection_id}/blocks",
    response_model=BlockResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_block(
    collection_id: int,
    request: BlockCreate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = BlockService(session)
    return service.create(
        collection_id=collection_id,
        user_id=user.id,  # type: ignore
        tipo=request.tipo,
        conteudo=request.conteudo,
        ordem=request.ordem,
    )


@router.patch("/api/blocks/reorder", response_model=list[BlockResponse])
def reorder_blocks(
    request: ReorderRequest,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = BlockService(session)
    return service.reorder(
        collection_id=request.collection_id,
        user_id=user.id,  # type: ignore
        items=[item.model_dump() for item in request.items],
    )


@router.put("/api/blocks/{id}", response_model=BlockResponse)
def update_block(
    id: int,
    request: BlockUpdate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = BlockService(session)
    data = request.model_dump(exclude_none=True)
    return service.update(block_id=id, user_id=user.id, data=data)  # type: ignore


@router.delete("/api/blocks/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_block(
    id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = BlockService(session)
    service.delete(block_id=id, user_id=user.id)  # type: ignore
