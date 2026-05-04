import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { login as loginApi, logout as logoutApi, getMe, type LoginRequest, type MeResponse } from '../api/auth';
import { getTokens } from './tokenStorage';
import { AuthContext, type AuthContextValue } from './authContextValue';

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getTokens()));
  const [user, setUser] = useState<MeResponse | null>(null);

  const fetchMe = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMe();
    }
  }, [isAuthenticated, fetchMe]);

  const login = useCallback(async (payload: LoginRequest) => {
    await loginApi(payload);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // 로컬 상태는 어떤 경우든 초기화
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, user, login, logout, fetchMe }),
    [isAuthenticated, user, login, logout, fetchMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

