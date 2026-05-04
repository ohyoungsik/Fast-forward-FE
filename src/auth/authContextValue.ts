import { createContext } from 'react';
import type { LoginRequest } from '../api/auth';

type AuthState = {
  isAuthenticated: boolean;
};

export type AuthContextValue = AuthState & {
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

