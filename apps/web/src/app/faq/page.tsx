"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { useAuth } from "@/contexts/AuthContext";
import { useFaq } from "@/hooks/useFaq";

export default function FAQPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: faqItems = [] } = useFaq();

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login");
    }
  }, [token, authLoading, router]);

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/workspace"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Perguntas Frequentes
        </h1>
        <p className="text-muted-foreground mb-8">
          Tire suas dúvidas sobre o Inscribing.
        </p>

        {faqItems.length > 0 ? (
          <Accordion>
            {faqItems.map((item) => (
              <AccordionItem key={item.id} title={item.question}>
                {item.answer}
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma pergunta disponível no momento.
          </p>
        )}
      </div>
    </div>
  );
}
