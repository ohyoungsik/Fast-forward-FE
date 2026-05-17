import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Card, CardHeader } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import ServerDropdown from '../components/ServerDropdown';
import { getSecurityAccessLogs, type SecurityAccessLogItem } from '../api/security';

function levelBadge(level: string) {
  if (level === 'INFO') return <Badge variant="INFO">INFO</Badge>;
  if (level === 'WARN') return <Badge variant="WARN">WARN</Badge>;
  if (level === 'ERROR') return <Badge variant="ERROR">ERROR</Badge>;
  return <Badge variant="CRITICAL">CRITICAL</Badge>;
}

function statusBadge(status: string | null) {
  if (!status) return <span className="text-gray-600">-</span>;
  if (status === 'success' || status === 'session_opened')
    return <span className="text-green-400 font-mono text-xs">{status}</span>;
  if (status === 'failed')
    return <span className="text-red-400 font-mono text-xs">{status}</span>;
  return <span className="text-gray-400 font-mono text-xs">{status}</span>;
}

export default function AccessSecurityLogsPage() {
  const [query, setQuery] = useState('');
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [logs, setLogs] = useState<SecurityAccessLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getSecurityAccessLogs({ server_name: selectedServer })
      .then((data) => { if (!cancelled) setLogs(data); })
      .catch(() => { if (!cancelled) setError('로그 조회 실패. 서버 연결을 확인하세요.'); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [selectedServer]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((r) => {
      const hay = `${r.collected_at} ${r.level} ${r.user_id} ${r.source_ip} ${r.auth_method} ${r.status} ${r.log_type} ${r.message}`.toLowerCase();
      return hay.includes(q);
    });
  }, [logs, query]);

  const columns: Column<SecurityAccessLogItem>[] = [
    {
      key: 'collected_at',
      header: 'Timestamp',
      cell: (r) => <span className="text-gray-400 font-mono">{r.collected_at}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'level',
      header: 'Level',
      cell: (r) => levelBadge(r.level),
      className: 'whitespace-nowrap',
    },
    {
      key: 'log_type',
      header: 'Type',
      cell: (r) => <span className="text-xs text-gray-400 font-mono">{r.log_type}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'user_id',
      header: 'User',
      cell: (r) => <span className="font-mono text-gray-200">{r.user_id ?? '-'}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'source_ip',
      header: 'Source IP',
      cell: (r) => <span className="font-mono text-gray-300">{r.source_ip ?? '-'}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'auth_method',
      header: 'Method',
      cell: (r) => <span className="text-gray-400 font-mono text-xs">{r.auth_method ?? '-'}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (r) => statusBadge(r.status),
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
        <h2 className="text-3xl font-extrabold text-white tracking-tight">접근 보안 로그</h2>
        <p className="text-gray-500 mt-2">서버별 SSH / sudo / 세션 인증 이벤트를 탐색합니다.</p>
      </header>

      <div className="flex items-center gap-4">
        <ServerDropdown value={selectedServer} onChange={setSelectedServer} />
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

      <SearchBar value={query} onChange={setQuery} placeholder="검색: user, IP, method, status, message" />

      <Card>
        <CardHeader
          title="Access Security Events"
          description="SSH / sudo / 세션 인증 로그 (security_access_logs)"
          right={<div className="text-xs text-gray-500">rows: {filtered.length}</div>}
        />
        {filtered.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
            {selectedServer ? '해당 서버의 로그가 없습니다.' : '서버를 선택해 주세요.'}
          </div>
        ) : (
          <DataTable columns={columns} rows={filtered} />
        )}
      </Card>
    </div>
  );
}
