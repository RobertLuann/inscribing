"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 p-3 border-t border-border"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua pergunta..."
        disabled={disabled}
        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!input.trim() || disabled}
        className="shrink-0"
      >
        <Send size={16} />
      </Button>
    </form>
  );
}
