"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from "@/types/collection";

const COLLECTIONS_KEY = "collections";

export function useCollections() {
  return useQuery({
    queryKey: [COLLECTIONS_KEY],
    queryFn: () => api.get<Collection[]>("/collections/"),
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCollectionRequest) =>
      api.post<Collection>("/collections/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_KEY] });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCollectionRequest }) =>
      api.put<Collection>(`/collections/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_KEY] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/collections/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_KEY] });
    },
  });
}

export function useDuplicateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post<Collection>(`/collections/${id}/duplicate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_KEY] });
    },
  });
}
