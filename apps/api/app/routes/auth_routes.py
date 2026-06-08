from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.db.database import get_session
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth_schema import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest,
    UserResponse,
)
from app.services.auth_service import auth_service
from app.services.user_service import UserService

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])


@router.post(
    "/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
def register(request: RegisterRequest, session: Session = Depends(get_session)):
    service = UserService(session)

    try:
        user = service.register(
            email=request.email,
            nome=request.nome,
            password=request.password,
            confirm_password=request.confirm_password,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    token = auth_service.create_token(user.id)  # type: ignore
    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,  # type: ignore
            email=user.email,
            nome=user.nome,
            avatar_url=user.avatar_url,
            created_at=user.created_at,
        ),
    )


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    service = UserService(session)
    user = service.get_by_email(request.email)

    if not user or not auth_service.verify_password(request.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )

    token = auth_service.create_token(user.id)  # type: ignore
    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,  # type: ignore
            email=user.email,
            nome=user.nome,
            avatar_url=user.avatar_url,
            created_at=user.created_at,
        ),
    )


@router.post("/logout")
def logout(_user: User = Depends(get_current_user)):
    return {"message": "ok"}


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return UserResponse(
        id=user.id,  # type: ignore
        email=user.email,
        nome=user.nome,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
    )


@router.put("/me", response_model=UserResponse)
def update_me(
    request: UpdateProfileRequest,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    service = UserService(session)

    try:
        updated = service.update_profile(user_id=user.id, nome=request.nome)  # type: ignore
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return UserResponse(
        id=updated.id,  # type: ignore
        email=updated.email,
        nome=updated.nome,
        avatar_url=updated.avatar_url,
        created_at=updated.created_at,
    )
