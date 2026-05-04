import { createContext } from 'react';
import type { LoginRequest, MeResponse } from '../api/auth';

type AuthState = {
  isAuthenticated: boolean;
  user: MeResponse | null;
};

export type AuthContextValue = AuthState & {
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

