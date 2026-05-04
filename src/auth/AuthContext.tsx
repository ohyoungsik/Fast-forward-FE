import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { login as loginApi, logout as logoutApi, type LoginRequest } from '../api/auth';
import { clearTokens, getTokens } from './tokenStorage';
import { AuthContext, type AuthContextValue } from './authContextValue';

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getTokens()));

  const login = useCallback(async (payload: LoginRequest) => {
    await loginApi(payload);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    logoutApi();
    clearTokens();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

