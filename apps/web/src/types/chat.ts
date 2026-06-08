// Espelha ChatRequest / ChatResponse / FAQResponse do backend.

// Mensagem renderizada no painel de chat (estado puramente local do front).
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatRequest {
  query: string;
}

export interface ChatResponse {
  answer: string;
  confidence: string;
  matched_question: string | null;
  distance: number | null;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}
