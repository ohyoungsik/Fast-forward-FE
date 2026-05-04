export interface MetricsResponse {
  server: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export const SERVERS = ['public-server', 'private-server-1', 'private-server-2', 'private-server-3'] as const;
export type ServerName = (typeof SERVERS)[number];
