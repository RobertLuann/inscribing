// Espelha BlockResponse / BlockCreate / BlockUpdate / ReorderRequest do backend.

// Tipos de bloco aceitos pelo backend.
export type BlockType =
  | "texto"
  | "titulo1"
  | "titulo2"
  | "titulo3"
  | "tarefa"
  | "lista-numerada"
  | "lista-marcadores";

export interface Block {
  id: number;
  collection_id: number;
  tipo: BlockType;
  conteudo: string;
  concluida: boolean;
  ordem: number;
  created_at: string;
}

export interface CreateBlockRequest {
  tipo: BlockType;
  conteudo?: string;
  ordem?: number | null;
}

export interface UpdateBlockRequest {
  tipo?: BlockType;
  conteudo?: string;
  concluida?: boolean;
}

export interface ReorderItem {
  id: number;
  ordem: number;
}

export interface ReorderRequest {
  collection_id: number;
  items: ReorderItem[];
}
