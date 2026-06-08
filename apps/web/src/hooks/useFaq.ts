"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { FAQItem } from "@/types/chat";

const FAQ_KEY = "faq";

export function useFaq() {
  return useQuery({
    queryKey: [FAQ_KEY],
    queryFn: () => api.get<FAQItem[]>("/faq"),
    staleTime: 1000 * 60 * 60,
  });
}
