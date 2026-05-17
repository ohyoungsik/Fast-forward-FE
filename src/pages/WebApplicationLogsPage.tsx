import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Card, CardHeader } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { getWebappLogs, getNginxLogs, type AppLogItem } from '../api/webapp_logs';

const LOG_TYPES = [
  { value: '', label: '전체' },
  { value: 'fastapi_error', label: 'FastAPI Error' },
  { value: 'auth_login', label: '인증 로그' },
  { value: 'nginx_access', label: 'Nginx Access' },
  { value: 'nginx_error', label: 'Nginx Error' },
];

const NGINX_TABS = new Set(['nginx_access', 'nginx_error']);

function levelBadge(level: string) {
  if (level === 'INFO') return <Badge variant="INFO">INFO</Badge>;
  if (level === 'WARN') return <Badge variant="WARN">WARN</Badge>;
  if (level === 'ERROR') return <Badge variant="ERROR">ERROR</Badge>;
  return <Badge variant="CRITICAL">CRITICAL</Badge>;
}

export default function WebApplicationLogsPage() {
  const [query, setQuery] = useState('');
  const [logType, setLogType] = useState('');
  const [logs, setLogs] = useState<AppLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const isNginxTab = NGINX_TABS.has(logType);
    const fetchFn = isNginxTab
      ? getNginxLogs({
          log_type: logType === 'nginx_access' ? 'access' : 'error',
          limit: 200,
        })
      : getWebappLogs({ log_type: logType || undefined, limit: 200 });

    fetchFn
      .then((data) => { if (!cancelled) setLogs(data); })
      .catch(() => { if (!cancelled) setError('로그 조회 실패. 서버 연결을 확인하세요.'); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [logType]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((r) => {
      const hay = `${r.collected_at} ${r.level} ${r.client_ip} ${r.status_code} ${r.path} ${r.message} ${r.method}`.toLowerCase();
      return hay.includes(q);
    });
  }, [logs, query]);

  const columns: Column<AppLogItem>[] = [
    {
      key: 'collected_at',
      header: 'Timestamp',
      cell: (r) => <span className="text-gray-400 font-mono">{r.collected_at}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'log_type',
      header: 'Type',
      cell: (r) => <span className="text-xs text-gray-400 font-mono">{r.log_type}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'level',
      header: 'Level',
      cell: (r) => levelBadge(r.level),
      className: 'whitespace-nowrap',
    },
    {
      key: 'method',
      header: 'Method',
      cell: (r) => <span className="font-mono text-gray-300">{r.method ?? '-'}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'path',
      header: 'Path',
      cell: (r) => <span className="font-mono text-gray-200 break-all">{r.path ?? '-'}</span>,
    },
    {
      key: 'status_code',
      header: 'Status',
      cell: (r) => <span className="text-gray-200">{r.status_code ?? '-'}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'client_ip',
      header: 'Client IP',
      cell: (r) => <span className="font-mono text-gray-400">{r.client_ip ?? '-'}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'response_time_ms',
      header: 'ms',
      cell: (r) => <span className="text-gray-400">{r.response_time_ms ?? '-'}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'message',
      header: 'Message',
      cell: (r) => <span className="text-gray-200 break-all">{r.message ?? '-'}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Web Application 로그</h2>
        <p className="text-gray-500 mt-2">
          Nginx access/error 및 FastAPI 에러 로그를 통합해서 보여줍니다.
        </p>
      </header>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          {LOG_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setLogType(t.value)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                logType === t.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Loader2 size={13} className="animate-spin" /> 로드 중...
          </span>
        )}
        {error && !isLoading && (
          <span className="text-xs text-red-400 bg-red-950/30 border border-red-900/30 px-3 py-1.5 rounded-lg">
            {error}
          </span>
        )}
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="검색: path, status code, IP, method, message" />

      <Card>
        <CardHeader
          title="Web Application Events"
          description="Nginx (nginx_logs) + FastAPI/인증 (app_logs) 통합 뷰"
          right={<div className="text-xs text-gray-500">rows: {filtered.length}</div>}
        />
        {filtered.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
            수집된 로그가 없습니다.
          </div>
        ) : (
          <DataTable columns={columns} rows={filtered} />
        )}
      </Card>
    </div>
  );
}
