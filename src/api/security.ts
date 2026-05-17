import { api } from './client';

export interface SecurityAccessLogItem {
  id: number;
  server_name: string | null;
  server_role: string | null;
  log_type: string;
  level: string;
  user_id: string | null;
  source_ip: string | null;
  auth_method: string | null;
  status: string | null;
  source_path: string | null;
  message: string | null;
  collected_at: string;
}

export async function getSecurityAccessLogs(params?: {
  server_name?: string;
  level?: string;
  status?: string;
  keyword?: string;
  limit?: number;
}): Promise<SecurityAccessLogItem[]> {
  const res = await api.get<SecurityAccessLogItem[]>('/security/logs/access', { params });
  return res.data;
}
