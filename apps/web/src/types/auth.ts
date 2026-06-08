// Espelha os schemas de autenticação do backend (snake_case, português).

export interface User {
  id: number;
  email: string;
  nome: string;
  avatar_url: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  nome: string;
  password: string;
  confirm_password: string;
}

export interface UpdateProfileRequest {
  nome: string;
}
