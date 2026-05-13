import { api } from './client';

export interface AppLogItem {
  id: number;
  server_name: string;
  log_type: string;
  level: string;
  client_ip: string;
  method: string;
  path: string;
  status_code: string;
  response_time_ms: number | null;
  message: string;
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
