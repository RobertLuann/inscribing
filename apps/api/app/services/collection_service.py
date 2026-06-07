from sqlmodel import Session

from app.models.block import Block
from app.models.collection import Collection
from app.repositories.block_repository import BlockRepository
from app.repositories.collection_repository import CollectionRepository


class CollectionService:
    def __init__(self, session: Session):
        self.session = session
        self.collection_repo = CollectionRepository(session)
        self.block_repo = BlockRepository(session)

    def _validate_titulo(
        self, user_id: int, titulo: str, exclude_id: int | None = None
    ) -> None:
        if not titulo or not titulo.strip():
            raise ValueError("O título da coleção não pode estar em branco.")

        if len(titulo) > 100:
            raise ValueError("O título da coleção deve ter no máximo 100 caracteres.")

        collections = self.collection_repo.find_by_user_id(user_id)
        for col in collections:
            if col.titulo.lower() == titulo.strip().lower() and col.id != exclude_id:
                raise ValueError("Já existe uma coleção com este nome.")

    def _generate_duplicate_titulo(self, user_id: int, titulo: str) -> str:
        collections = self.collection_repo.find_by_user_id(user_id)
        existing_titles = {c.titulo.lower() for c in collections}

        base = f"{titulo.strip()} (cópia)"
        if base.lower() not in existing_titles:
            return base

        counter = 2
        while True:
            candidate = f"{titulo.strip()} (cópia {counter})"
            if candidate.lower() not in existing_titles:
                return candidate
            counter += 1

    def create(self, user_id: int, titulo: str) -> Collection:
        self._validate_titulo(user_id, titulo)

        collection = Collection(user_id=user_id, titulo=titulo.strip())
        return self.collection_repo.create(collection)

    def rename(self, collection_id: int, user_id: int, new_titulo: str) -> Collection:
        collection = self.collection_repo.find_by_id(collection_id)
        if not collection:
            raise ValueError("Coleção não encontrada.")

        if collection.user_id != user_id:
            raise ValueError("Você não tem permissão para renomear esta coleção.")

        self._validate_titulo(user_id, new_titulo, exclude_id=collection_id)

        collection.titulo = new_titulo.strip()
        return self.collection_repo.update(collection)

    def delete(self, collection_id: int, user_id: int) -> None:
        collection = self.collection_repo.find_by_id(collection_id)
        if not collection:
            raise ValueError("Coleção não encontrada.")

        if collection.user_id != user_id:
            raise ValueError("Você não tem permissão para excluir esta coleção.")

        blocks = self.block_repo.find_by_collection_id(collection_id)
        for block in blocks:
            self.block_repo.delete(block.id)  # type: ignore

        self.collection_repo.delete(collection_id)

    def duplicate(self, collection_id: int, user_id: int) -> Collection:
        original = self.collection_repo.find_by_id(collection_id)
        if not original:
            raise ValueError("Coleção não encontrada.")

        if original.user_id != user_id:
            raise ValueError("Você não tem permissão para duplicar esta coleção.")

        new_titulo = self._generate_duplicate_titulo(user_id, original.titulo)

        new_collection = Collection(user_id=user_id, titulo=new_titulo)
        new_collection = self.collection_repo.create(new_collection)

        original_blocks = self.block_repo.find_by_collection_id(collection_id)
        for block in original_blocks:
            new_block = Block(
                collection_id=new_collection.id,  # type: ignore
                tipo=block.tipo,
                conteudo=block.conteudo,
                concluida=block.concluida,
                ordem=block.ordem,
            )
            self.block_repo.create(new_block)

        return new_collection

    def list_by_user(self, user_id: int) -> list[Collection]:
        return self.collection_repo.find_by_user_id(user_id)
