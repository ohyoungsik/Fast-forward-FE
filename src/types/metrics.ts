export interface MetricsResponse {
  server_name: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_rx: number;
  network_tx: number;
  created_at: string | null;
}

export interface MetricsHistoryPoint {
  time: string;
  cpu: number;
  memory: number;
  disk: number;
}

export interface ServerItem {
  server_name: string;
  server_role: string;
}

export const DEFAULT_SERVERS: ServerItem[] = [
  { server_name: 'public-bastion', server_role: 'bastion' },
  { server_name: 'nginx-fe-server', server_role: 'frontend' },
  { server_name: 'fastapi-be-server', server_role: 'backend' },
  { server_name: 'postgre-db-server', server_role: 'database' },
];
