"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type {
  Block,
  CreateBlockRequest,
  ReorderItem,
  UpdateBlockRequest,
} from "@/types/block";

const BLOCKS_KEY = "blocks";

export function useBlocks(collectionId: number | null) {
  return useQuery({
    queryKey: [BLOCKS_KEY, collectionId],
    queryFn: () => api.get<Block[]>(`/collections/${collectionId}/blocks`),
    enabled: collectionId !== null,
  });
}

export function useCreateBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      collectionId,
      data,
    }: {
      collectionId: number;
      data: CreateBlockRequest;
    }) => api.post<Block>(`/collections/${collectionId}/blocks`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [BLOCKS_KEY, variables.collectionId],
      });
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateBlockRequest;
      collectionId: number;
    }) => api.put<Block>(`/blocks/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [BLOCKS_KEY, variables.collectionId],
      });
    },
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; collectionId: number }) =>
      api.delete(`/blocks/${id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [BLOCKS_KEY, variables.collectionId],
      });
    },
  });
}

export function useReorderBlocks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      collectionId,
      items,
    }: {
      collectionId: number;
      items: ReorderItem[];
    }) =>
      api.patch<Block[]>("/blocks/reorder", {
        collection_id: collectionId,
        items,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [BLOCKS_KEY, variables.collectionId],
      });
    },
  });
}
