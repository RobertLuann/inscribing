from sqlmodel import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.services.auth_service import auth_service


class UserService:
    def __init__(self, session: Session):
        self.session = session
        self.user_repo = UserRepository(session)

    def register(
        self, email: str, nome: str, password: str, confirm_password: str
    ) -> User:
        email = email.lower().strip()
        nome = nome.strip()

        if not nome:
            raise ValueError("O nome é obrigatório.")

        existing = self.user_repo.find_by_email(email)
        if existing:
            raise ValueError("Este e-mail já está cadastrado.")

        if password != confirm_password:
            raise ValueError("As senhas não coincidem.")

        errors = auth_service.validate_password_strength(password)
        if errors:
            raise ValueError("; ".join(errors))

        user = User(
            email=email,
            nome=nome,
            senha_hash=auth_service.hash_password(password),
        )
        return self.user_repo.create(user)

    def update_profile(self, user_id: int, nome: str) -> User:
        nome = nome.strip()

        if not nome:
            raise ValueError("O nome é obrigatório.")

        user = self.user_repo.find_by_id(user_id)
        if not user:
            raise ValueError("Usuário não encontrado.")

        user.nome = nome
        return self.user_repo.update(user)

    def get_by_id(self, user_id: int) -> User | None:
        return self.user_repo.find_by_id(user_id)

    def get_by_email(self, email: str) -> User | None:
        return self.user_repo.find_by_email(email.lower().strip())
