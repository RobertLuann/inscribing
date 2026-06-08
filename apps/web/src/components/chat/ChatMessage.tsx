"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  author: "user" | "assistant";
  content: string;
}

export function ChatMessage({ author, content }: ChatMessageProps) {
  const isUser = author === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-white" : "bg-card text-muted-foreground",
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 text-sm",
          isUser ? "bg-primary text-white" : "bg-card text-foreground",
        )}
      >
        {content}
      </div>
    </div>
  );
}
