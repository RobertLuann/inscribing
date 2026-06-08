"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useSendMessage } from "@/hooks/useChat";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface ChatPanelProps {
  onClose: () => void;
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const sendMessage = useSendMessage();

  async function handleSend(content: string) {
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendMessage.mutateAsync({ query: content });
      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro. Tente novamente.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 flex h-[500px] w-[380px] flex-col rounded-lg border border-border bg-background shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          Chat de Suporte
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-8">
            Pergunte sobre funcionalidades, blocos, ou como usar o Inscribing.
          </p>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} author={msg.role} content={msg.content} />
        ))}
        {sendMessage.isPending && (
          <ChatMessage author="assistant" content="Pensando..." />
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={sendMessage.isPending} />
    </div>
  );
}
