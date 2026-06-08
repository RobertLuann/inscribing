"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/workspace");
    }
  }, [token, isLoading, router]);

  if (isLoading || token) return null;

  return (
    <AuthShell formSide="left">
      <h2 className="mb-8 text-2xl font-semibold text-foreground">
        Faça login na sua conta
      </h2>
      <LoginForm />
    </AuthShell>
  );
}
