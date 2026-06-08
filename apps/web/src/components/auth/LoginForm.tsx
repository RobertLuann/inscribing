"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);
    try {
      await login(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "E-mail ou senha inválidos",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="E-mail"
        type="email"
        placeholder="usuario.cadastrado@email.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="******"
        error={errors.password?.message}
        {...register("password")}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando..." : "Fazer Login"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Não possui um login?{" "}
        <a href="/register" className="text-primary hover:underline">
          Cadastre-se
        </a>
      </p>
    </form>
  );
}
