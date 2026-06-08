"use client";

import { MessageCircleQuestion } from "lucide-react";

interface ChatFABProps {
  onClick: () => void;
}

export function ChatFAB({ onClick }: ChatFABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir chat de suporte"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-card"
    >
      <MessageCircleQuestion size={22} />
    </button>
  );
}
