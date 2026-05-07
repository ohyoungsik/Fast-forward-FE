import { api } from './client';

export interface SecurityLogItem {
  id: number;
  timestamp: string;
  level: string;
  ip: string;
  status_code: string;
  message: string;
  service: string;
}

export async function getSecurityLogs(
  server_name?: string,
  keyword?: string,
): Promise<SecurityLogItem[]> {
  const res = await api.get<SecurityLogItem[]>('/security/logs', {
    params: { server_name, keyword },
  });
  return res.data;
}
