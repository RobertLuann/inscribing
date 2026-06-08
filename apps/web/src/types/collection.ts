// Espelha CollectionResponse / CollectionCreate / CollectionUpdate do backend.

export interface Collection {
  id: number;
  user_id: number;
  titulo: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCollectionRequest {
  titulo: string;
}

export interface UpdateCollectionRequest {
  titulo: string;
}
