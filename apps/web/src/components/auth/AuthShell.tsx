import type { ReactNode } from "react";
import { BrandMark } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

// Painel de boas-vindas: "Bem-vindo ao [pena] Inscribing" + subtítulo.
function WelcomePanel() {
  return (
    <div className="flex flex-col items-center justify-center px-10 text-center">
      <p className="flex flex-wrap items-center justify-center gap-x-3 text-3xl font-semibold text-foreground">
        <span>Bem-vindo ao</span>
        <BrandMark className="h-9 w-9" />
        <span>Inscribing</span>
      </p>
      <p className="mt-4 max-w-xs text-lg text-muted-foreground">
        O seu espaço de anotações com suporte inteligente
      </p>
    </div>
  );
}

interface AuthShellProps {
  children: ReactNode;
  // Posição do formulário dentro do "livro" (o painel de boas-vindas fica no lado oposto).
  formSide: "left" | "right";
}

// "Livro" centralizado dividido em duas metades por uma linha vertical.
export function AuthShell({ children, formSide }: AuthShellProps) {
  const form = (
    <div className="flex items-center justify-center px-10 py-12">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="grid min-h-[78vh] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-border md:grid-cols-2">
        <div className={cn(formSide === "right" && "md:order-2")}>{form}</div>
        <div
          className={cn(
            "hidden md:flex",
            // A divisória central acompanha o lado do formulário.
            formSide === "right"
              ? "md:border-r md:border-border"
              : "md:border-l md:border-border",
          )}
        >
          <WelcomePanel />
        </div>
      </div>
    </div>
  );
}
