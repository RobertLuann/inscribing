import os
import re
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt


class AuthService:
    def __init__(self):
        self.jwt_secret = os.getenv("JWT_SECRET", "dev-secret-change-in-production")
        self.jwt_algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.jwt_expiration = int(os.getenv("JWT_EXPIRATION", "3600"))

    def hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    def verify_password(self, password: str, hash: str) -> bool:
        return bcrypt.checkpw(password.encode(), hash.encode())

    def validate_password_strength(self, password: str) -> list[str]:
        errors: list[str] = []
        if len(password) < 8:
            errors.append("A senha deve ter no mínimo 8 caracteres.")
        if not re.search(r"[A-Z]", password):
            errors.append("A senha deve conter ao menos uma letra maiúscula.")
        if not re.search(r"[a-z]", password):
            errors.append("A senha deve conter ao menos uma letra minúscula.")
        if not re.search(r"\d", password):
            errors.append("A senha deve conter ao menos um número.")
        return errors

    def create_token(self, user_id: int) -> str:
        payload = {
            "sub": str(user_id),
            "exp": datetime.now(timezone.utc)
            + timedelta(seconds=self.jwt_expiration),
        }
        return jwt.encode(payload, self.jwt_secret, algorithm=self.jwt_algorithm)

    def decode_token(self, token: str) -> int | None:
        try:
            payload = jwt.decode(
                token, self.jwt_secret, algorithms=[self.jwt_algorithm]
            )
            return int(payload["sub"])
        except (JWTError, KeyError, ValueError):
            return None


auth_service = AuthService()
