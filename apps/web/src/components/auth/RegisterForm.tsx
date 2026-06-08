"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z
  .object({
    nome: z.string().trim().min(1, "Nome obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(8, "Mínimo de 8 caracteres")
      .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
      .regex(/[a-z]/, "Deve conter uma letra minúscula")
      .regex(/[0-9]/, "Deve conter um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: authRegister } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setError(null);
    try {
      await authRegister({
        nome: data.nome,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar conta. Tente novamente.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nome"
        type="text"
        placeholder="Seu nome"
        error={errors.nome?.message}
        {...register("nome")}
      />

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

      <Input
        label="Confirmar senha"
        type="password"
        placeholder="******"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <p className="text-sm text-muted-foreground">
        Já possui um login?{" "}
        <a href="/login" className="text-primary hover:underline">
          Entre
        </a>
      </p>

      {error && <span className="text-sm text-red-500">{error}</span>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Cadastrando..." : "Cadastrar-se"}
      </Button>
    </form>
  );
}
