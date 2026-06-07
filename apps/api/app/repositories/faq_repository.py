from sqlmodel import Session, select

from app.models.faq import FAQItem


class FAQRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, faq: FAQItem) -> FAQItem:
        self.session.add(faq)
        self.session.commit()
        self.session.refresh(faq)
        return faq

    def find_by_id(self, id: int) -> FAQItem | None:
        statement = select(FAQItem).where(FAQItem.id == id)
        return self.session.exec(statement).first()

    def find_all(self) -> list[FAQItem]:
        statement = select(FAQItem).order_by(FAQItem.question)
        return list(self.session.exec(statement).all())

    def find_closest_match(self, query_vector: list[float]) -> FAQItem | None:
        statement = (
            select(FAQItem)
            .order_by(FAQItem.embedding.l2_distance(query_vector))  # type: ignore
            .limit(1)
        )
        return self.session.exec(statement).first()

    def update(self, faq: FAQItem) -> FAQItem:
        self.session.add(faq)
        self.session.commit()
        self.session.refresh(faq)
        return faq

    def delete(self, id: int) -> None:
        faq = self.find_by_id(id)
        if faq:
            self.session.delete(faq)
            self.session.commit()
