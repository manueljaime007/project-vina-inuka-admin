import { api } from './api.service';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
}

export interface LoginResponse {
  success: boolean;
  admin: User;
}

export interface VerifyResponse {
  valid: boolean;
  admin: User | null;
}

export const authService = {
  // Login - envia email e senha, recebe user + cookie
  login: (email: string, password: string) => {
    return api.post<LoginResponse>('/auth/login', { email, password });
  },

  // Logout - limpa o cookie no backend
  logout: () => {
    return api.post('/auth/logout');
  },

  // Verificar se o token é válido
  verify: () => {
    return api.get<VerifyResponse>('/auth/verify');
  },
};