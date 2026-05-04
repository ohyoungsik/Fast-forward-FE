import { api } from './client';
import { setTokens, clearTokens, type AuthTokens } from '../auth/tokenStorage';

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

export async function login(payload: LoginRequest) {
  const res = await api.post<LoginResponse>('/auth/login', payload, {
    // do not attach stale token if any
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

export function logout() {
  clearTokens();
}

