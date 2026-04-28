export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export type LogRow = {
  id: number;
  timestamp: string;
  level: LogLevel;
  message: string;
  ip: string;
  statusCode: number;
  service: 'ssh' | 'webapp' | 'nginx' | 'kernel';
};

export type InfraRow = {
  id: number;
  timestamp: string;
  host: string;
  cpu: number;
  memory: number;
  disk: number;
  status: 'healthy' | 'degraded' | 'critical';
};

