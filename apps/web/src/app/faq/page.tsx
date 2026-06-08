"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Logo } from "@/components/ui/Logo";
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
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        leading={<Logo />}
        items={[
          { label: "Inscribing", href: "/workspace" },
          { label: "Perguntas Frequentes" },
        ]}
      />

      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="mb-10 text-4xl font-bold text-foreground">
          Perguntas Frequentes
        </h1>

        {faqItems.length > 0 ? (
          <Accordion>
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.id}
                title={`${index + 1}. ${item.question}`}
                defaultOpen={index === 0}
              >
                {item.answer}
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma pergunta disponível no momento.
          </p>
        )}
      </main>
    </div>
  );
}
