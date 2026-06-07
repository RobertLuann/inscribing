from sqlmodel import Session, select

from app.models.block import Block


class BlockRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, block: Block) -> Block:
        self.session.add(block)
        self.session.commit()
        self.session.refresh(block)
        return block

    def find_by_id(self, id: int) -> Block | None:
        statement = select(Block).where(Block.id == id)
        return self.session.exec(statement).first()

    def find_all(self) -> list[Block]:
        statement = select(Block).order_by(Block.ordem)  # type: ignore
        return list(self.session.exec(statement).all())

    def find_by_collection_id(self, collection_id: int) -> list[Block]:
        statement = (
            select(Block)
            .where(Block.collection_id == collection_id)
            .order_by(Block.ordem)  # type: ignore
        )
        return list(self.session.exec(statement).all())

    def update(self, block: Block) -> Block:
        self.session.add(block)
        self.session.commit()
        self.session.refresh(block)
        return block

    def delete(self, id: int) -> None:
        block = self.find_by_id(id)
        if block:
            self.session.delete(block)
            self.session.commit()

    def reorder(self, items: list[tuple[int, int]]) -> None:
        for block_id, nova_ordem in items:
            block = self.find_by_id(block_id)
            if block:
                block.ordem = nova_ordem
                self.session.add(block)
        self.session.commit()
