"use client";

import { MessageSquare } from "lucide-react";

interface ChatFABProps {
  onClick: () => void;
}

export function ChatFAB({ onClick }: ChatFABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 active:bg-primary/80 transition-all"
    >
      <MessageSquare size={24} />
    </button>
  );
}
