from sqlmodel import Session, select

from app.models.faq import FAQItem


class FAQRepository:
    def __init__(self, session: Session):
        self.session = session

    def find_closest_match(self, query_vector: list[float]) -> FAQItem | None:
        statement = (
            select(FAQItem)
            .order_by(FAQItem.embedding.l2_distance(query_vector))  # type: ignore
            .limit(1)
        )
        return self.session.exec(statement).first()
