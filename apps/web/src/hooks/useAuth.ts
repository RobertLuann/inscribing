"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      api.post<AuthResponse>("/auth/login", data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      api.post<AuthResponse>("/auth/register", data),
  });
}
