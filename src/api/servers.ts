import { api } from './client';
import type { ServerItem } from '../types/metrics';

export async function getServers(): Promise<ServerItem[]> {
  const res = await api.get<ServerItem[]>('/servers');
  return res.data;
}
