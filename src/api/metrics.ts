import { api } from './client';
import type { MetricsHistoryPoint, MetricsResponse } from '../types/metrics';

export function getMetrics(server_name: string): Promise<MetricsResponse> {
  return api
    .get<MetricsResponse>('/infra/metrics', { params: { server_name } })
    .then((res) => res.data);
}

export function getMetricsHistory(server_name: string, limit = 20): Promise<MetricsHistoryPoint[]> {
  return api
    .get<MetricsHistoryPoint[]>('/infra/metrics/history', { params: { server_name, limit } })
    .then((res) => res.data);
}
