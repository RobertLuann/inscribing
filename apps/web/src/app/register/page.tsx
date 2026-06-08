"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/workspace");
    }
  }, [token, isLoading, router]);

  if (isLoading || token) return null;

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex flex-1 flex-col justify-center bg-card px-16">
        <h1 className="text-4xl font-bold text-foreground">Inscribing</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md">
          O seu espaço de anotações com suporte inteligente.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Bem-vindo ao Inscribing
          </h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
