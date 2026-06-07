from sqlmodel import Session, select

from app.models.user import User


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def find_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def find_by_id(self, id: int) -> User | None:
        statement = select(User).where(User.id == id)
        return self.session.exec(statement).first()

    def find_all(self) -> list[User]:
        statement = select(User).order_by(User.nome)
        return list(self.session.exec(statement).all())

    def update(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete(self, id: int) -> None:
        user = self.find_by_id(id)
        if user:
            self.session.delete(user)
            self.session.commit()
