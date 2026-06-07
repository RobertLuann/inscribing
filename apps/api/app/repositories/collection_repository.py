from sqlmodel import Session, select

from app.models.collection import Collection


class CollectionRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, collection: Collection) -> Collection:
        self.session.add(collection)
        self.session.commit()
        self.session.refresh(collection)
        return collection

    def find_by_id(self, id: int) -> Collection | None:
        statement = select(Collection).where(Collection.id == id)
        return self.session.exec(statement).first()

    def find_all(self) -> list[Collection]:
        statement = select(Collection).order_by(Collection.titulo)
        return list(self.session.exec(statement).all())

    def find_by_user_id(self, user_id: int) -> list[Collection]:
        statement = (
            select(Collection)
            .where(Collection.user_id == user_id)
            .order_by(Collection.titulo)
        )
        return list(self.session.exec(statement).all())

    def update(self, collection: Collection) -> Collection:
        self.session.add(collection)
        self.session.commit()
        self.session.refresh(collection)
        return collection

    def delete(self, id: int) -> None:
        collection = self.find_by_id(id)
        if collection:
            self.session.delete(collection)
            self.session.commit()
