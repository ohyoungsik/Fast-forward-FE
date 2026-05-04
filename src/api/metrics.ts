import { api } from './client';
import type { MetricsResponse } from '../types/metrics';

export function getMetrics(server: string): Promise<MetricsResponse> {
  return api.get<MetricsResponse>('/metrics', { params: { server } }).then((res) => res.data);
}
