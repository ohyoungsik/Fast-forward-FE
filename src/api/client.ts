import axios, { AxiosError, AxiosHeaders, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens, type AuthTokens } from '../auth/tokenStorage';

const API_BASE_URL = 'http://localhost:8001/api/v1';

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function resolveRefreshQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

async function refreshAccessToken(client: AxiosInstance): Promise<AuthTokens> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('Missing refresh token');

  // Refresh call should not itself trigger refresh loop.
  const res = await client.post<RefreshResponse>('/auth/refresh', { refreshToken }, { headers: { 'X-Skip-Auth': '1' } });
  const accessToken = res.data.accessToken;
  const nextRefreshToken = res.data.refreshToken ?? refreshToken;
  const tokens = { accessToken, refreshToken: nextRefreshToken };
  setTokens(tokens);
  return tokens;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  if (headers.get('X-Skip-Auth')) {
    headers.delete('X-Skip-Auth');
    config.headers = headers;
    return config;
  }

  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const originalConfig = (err.config ?? {}) as RetriableConfig;

    if (status !== 401 || originalConfig._retry) {
      return Promise.reject(err);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return Promise.reject(err);
    }

    originalConfig._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) return reject(err);
          const headers = AxiosHeaders.from(originalConfig.headers);
          headers.set('Authorization', `Bearer ${token}`);
          originalConfig.headers = headers;
          resolve(api(originalConfig));
        });
      });
    }

    isRefreshing = true;
    try {
      const tokens = await refreshAccessToken(api);
      resolveRefreshQueue(tokens.accessToken);
      const headers = AxiosHeaders.from(originalConfig.headers);
      headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      originalConfig.headers = headers;
      return api(originalConfig);
    } catch (refreshErr) {
      resolveRefreshQueue(null);
      clearTokens();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

