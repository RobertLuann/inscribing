from sqlmodel import Session

from app.models.block import Block
from app.repositories.block_repository import BlockRepository
from app.repositories.collection_repository import CollectionRepository

VALID_TIPOS = frozenset({
    "texto",
    "titulo1",
    "titulo2",
    "titulo3",
    "tarefa",
    "lista-numerada",
    "lista-marcadores",
})


class BlockService:
    def __init__(self, session: Session):
        self.session = session
        self.block_repo = BlockRepository(session)
        self.collection_repo = CollectionRepository(session)

    def _validate_tipo(self, tipo: str) -> None:
        if tipo not in VALID_TIPOS:
            raise ValueError(
                f"Tipo de bloco inválido: '{tipo}'. "
                f"Tipos válidos: {', '.join(sorted(VALID_TIPOS))}."
            )

    def _get_next_ordem(self, collection_id: int) -> int:
        blocks = self.block_repo.find_by_collection_id(collection_id)
        if not blocks:
            return 0
        return max(b.ordem for b in blocks) + 1

    def _validate_collection_access(
        self, collection_id: int, user_id: int
    ) -> None:
        collection = self.collection_repo.find_by_id(collection_id)
        if not collection:
            raise ValueError("Coleção não encontrada.")
        if collection.user_id != user_id:
            raise ValueError("Você não tem permissão para acessar esta coleção.")

    def _validate_block_access(self, block_id: int, user_id: int) -> Block:
        block = self.block_repo.find_by_id(block_id)
        if not block:
            raise ValueError("Bloco não encontrado.")

        self._validate_collection_access(block.collection_id, user_id)
        return block

    def create(
        self,
        collection_id: int,
        user_id: int,
        tipo: str,
        conteudo: str = "",
        ordem: int | None = None,
    ) -> Block:
        self._validate_collection_access(collection_id, user_id)
        self._validate_tipo(tipo)

        if ordem is None:
            ordem = self._get_next_ordem(collection_id)

        block = Block(
            collection_id=collection_id,
            tipo=tipo,
            conteudo=conteudo,
            ordem=ordem,
        )
        return self.block_repo.create(block)

    def update(
        self, block_id: int, user_id: int, data: dict
    ) -> Block:
        block = self._validate_block_access(block_id, user_id)

        if "tipo" in data:
            self._validate_tipo(data["tipo"])
            block.tipo = data["tipo"]

        if "conteudo" in data:
            block.conteudo = data["conteudo"]

        if "concluida" in data:
            block.concluida = bool(data["concluida"])

        return self.block_repo.update(block)

    def delete(self, block_id: int, user_id: int) -> None:
        self._validate_block_access(block_id, user_id)
        self.block_repo.delete(block_id)

    def reorder(
        self, collection_id: int, user_id: int, items: list[dict]
    ) -> list[Block]:
        self._validate_collection_access(collection_id, user_id)

        tuple_items = [(item["id"], item["ordem"]) for item in items]
        self.block_repo.reorder(tuple_items)

        return self.block_repo.find_by_collection_id(collection_id)

    def list_by_collection(
        self, collection_id: int, user_id: int
    ) -> list[Block]:
        self._validate_collection_access(collection_id, user_id)
        return self.block_repo.find_by_collection_id(collection_id)
