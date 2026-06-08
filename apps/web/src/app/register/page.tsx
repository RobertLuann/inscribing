"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
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
    <AuthShell formSide="right">
      <h2 className="mb-8 text-2xl font-semibold text-foreground">
        Cadastre-se com suas credenciais
      </h2>
      <RegisterForm />
    </AuthShell>
  );
}
