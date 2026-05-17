import { api } from './client';

export interface AppLogItem {
  id: number;
  server_name: string | null;
  log_type: string;
  level: string;
  client_ip: string | null;
  method: string | null;
  path: string | null;
  status_code: string | null;
  response_time_ms: number | null;
  message: string | null;
  collected_at: string;
}

export async function getWebappLogs(params?: {
  log_type?: string;
  keyword?: string;
  limit?: number;
}): Promise<AppLogItem[]> {
  const res = await api.get<AppLogItem[]>('/logs/webapp', { params });
  return res.data;
}

export async function getNginxLogs(params?: {
  log_type?: 'access' | 'error';
  keyword?: string;
  limit?: number;
}): Promise<AppLogItem[]> {
  const res = await api.get<AppLogItem[]>('/logs/nginx', { params });
  return res.data;
}
