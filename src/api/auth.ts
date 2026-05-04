import { api } from './client';
import { setTokens, clearTokens, getRefreshToken, type AuthTokens } from '../auth/tokenStorage';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type SignupRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type MeResponse = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export async function login(payload: LoginRequest) {
  const res = await api.post<LoginResponse>('/auth/login', payload, {
    headers: { 'X-Skip-Auth': '1' },
  });
  const tokens: AuthTokens = { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken };
  setTokens(tokens);
  return tokens;
}

export async function signup(payload: SignupRequest) {
  const res = await api.post('/auth/signup', payload, {
    headers: { 'X-Skip-Auth': '1' },
  });
  return res.data;
}

export async function getMe(): Promise<MeResponse> {
  const res = await api.get<MeResponse>('/auth/me');
  return res.data;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // 토큰이 만료됐거나 이미 무효화된 경우에도 로컬 토큰은 삭제
    }
  }
  clearTokens();
}

