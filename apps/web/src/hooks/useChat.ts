"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { ChatRequest, ChatResponse } from "@/types/chat";

export function useSendMessage() {
  return useMutation({
    mutationFn: (data: ChatRequest) => api.post<ChatResponse>("/chat/", data),
  });
}
