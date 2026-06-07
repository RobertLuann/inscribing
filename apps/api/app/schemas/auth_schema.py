from datetime import datetime

from pydantic import BaseModel


class RegisterRequest(BaseModel):
    email: str
    nome: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    nome: str
    avatar_url: str | None = None
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
