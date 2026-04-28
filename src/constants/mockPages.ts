import type { InfraRow, LogRow, LogLevel } from '../types/logs';

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]!;

const ips = ['192.168.0.12', '10.0.2.15', '172.16.0.8', '203.0.113.24', '198.51.100.77'] as const;
const hosts = ['edge-01', 'api-01', 'worker-02'] as const;
const users = ['admin', 'deploy', 'service', 'unknown'] as const;
const paths = ['/login', '/api/v1/users', '/api/v1/orders', '/health', '/assets/app.js'] as const;
const ua = ['Mozilla/5.0', 'curl/8.0', 'k6/0.49', 'PostmanRuntime/7.36'] as const;

function tsAt(minutesAgo: number) {
  const d = new Date(Date.now() - minutesAgo * 60_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(
    d.getHours(),
  ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

function levelByStatus(code: number): LogLevel {
  if (code >= 500) return 'ERROR';
  if (code >= 400) return 'WARN';
  return 'INFO';
}

export const mockInfraRows: InfraRow[] = Array.from({ length: 18 }, (_, i) => {
  const cpu = Math.round(10 + Math.random() * 85);
  const memory = Math.round(20 + Math.random() * 75);
  const disk = Math.round(45 + Math.random() * 50);
  const status: InfraRow['status'] = cpu > 85 || memory > 85 ? 'critical' : cpu > 70 || memory > 75 ? 'degraded' : 'healthy';

  return {
    id: i + 1,
    timestamp: tsAt(i * 3),
    host: pick(hosts),
    cpu,
    memory,
    disk,
    status,
  };
});

function makeLog(id: number, service: LogRow['service'], minutesAgo: number, statusCode: number, message: string): LogRow {
  return {
    id,
    timestamp: tsAt(minutesAgo),
    level: levelByStatus(statusCode),
    message,
    ip: pick(ips),
    statusCode,
    service,
  };
}

export const mockAccessSecurityLogs: LogRow[] = [
  makeLog(1, 'ssh', 3, 401, `sshd: Failed password for invalid user ${pick(users)} from ${pick(ips)} port 51234 ssh2`),
  makeLog(2, 'ssh', 7, 200, `sudo: ${pick(users)} : TTY=pts/0 ; PWD=/home/${pick(users)} ; USER=root ; COMMAND=/bin/systemctl restart nginx`),
  makeLog(3, 'ssh', 11, 403, `pam_unix(sshd:auth): authentication failure; rhost=${pick(ips)} user=${pick(users)}`),
  makeLog(4, 'ssh', 15, 200, `sshd: Accepted publickey for ${pick(users)} from ${pick(ips)} port 50411 ssh2`),
  makeLog(5, 'ssh', 21, 429, `fail2ban: Ban ${pick(ips)} after multiple auth failures`),
];

export const mockWebAppLogs: LogRow[] = Array.from({ length: 30 }, (_, i) => {
  const code = pick([200, 200, 200, 201, 204, 302, 400, 401, 403, 404, 429, 500, 502] as const);
  const p = pick(paths);
  const msg =
    code >= 500
      ? `webapp: upstream timeout on ${p} (traceId=${Math.random().toString(16).slice(2, 10)})`
      : code === 401 || code === 403
        ? `webapp: auth blocked (user=${pick(users)}) ${p}`
        : `webapp: ${p} ${code} ua="${pick(ua)}"`;
  return makeLog(1000 + i, 'webapp', i * 2, code, msg);
});

export const mockNginxLogs: LogRow[] = Array.from({ length: 28 }, (_, i) => {
  const code = pick([200, 200, 200, 301, 302, 304, 404, 404, 499, 500, 502] as const);
  const p = pick(paths);
  const msg =
    code >= 500
      ? `nginx: [error] upstream sent invalid response while reading response header from upstream, request: "GET ${p} HTTP/1.1"`
      : `nginx: "${p}" ${code} bytes=${Math.round(200 + Math.random() * 5000)}`;
  return makeLog(2000 + i, 'nginx', i * 3, code, msg);
});

export const mockKernelLogs: LogRow[] = [
  makeLog(3001, 'kernel', 2, 500, 'kernel: Out of memory: Kill process 1234 (node) score 988 or sacrifice child'),
  makeLog(3002, 'kernel', 8, 200, 'kernel: eth0: Link is Up - 1Gbps/Full - flow control rx/tx'),
  makeLog(3003, 'kernel', 12, 500, 'kernel: EXT4-fs error (device sda1): ext4_find_entry:1450: inode #2: comm systemd: reading directory lblock 0'),
  makeLog(3004, 'kernel', 18, 200, 'kernel: CPU0: Core temperature above threshold, cpu clock throttled'),
  makeLog(3005, 'kernel', 26, 500, 'kernel: audit: type=1400 apparmor="DENIED" operation="open" profile="snap" name="/proc/1/environ"'),
];

