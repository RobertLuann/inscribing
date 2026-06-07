from fastapi import Depends, Header, HTTPException, status
from sqlmodel import Session

from app.db.database import get_session
from app.models.user import User
from app.services.auth_service import auth_service
from app.services.user_service import UserService


def get_current_user(
    authorization: str = Header(...),
    session: Session = Depends(get_session),
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso não fornecido.",
        )

    token = authorization.removeprefix("Bearer ").strip()
    user_id = auth_service.decode_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
        )

    user_service = UserService(session)
    user = user_service.get_by_id(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado.",
        )

    return user
