import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Card, CardHeader } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import ServerDropdown from '../components/ServerDropdown';
import { getSecurityLogs, type SecurityLogItem } from '../api/security';

function levelBadge(level: string) {
  if (level === 'INFO') return <Badge variant="INFO">INFO</Badge>;
  if (level === 'WARN') return <Badge variant="WARN">WARN</Badge>;
  if (level === 'ERROR') return <Badge variant="ERROR">ERROR</Badge>;
  return <Badge variant="CRITICAL">CRITICAL</Badge>;
}

export default function AccessSecurityLogsPage() {
  const [query, setQuery] = useState('');
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [logs, setLogs] = useState<SecurityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getSecurityLogs(selectedServer)
      .then((data) => { if (!cancelled) setLogs(data); })
      .catch(() => { if (!cancelled) setError('로그 조회 실패. 서버 연결을 확인하세요.'); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [selectedServer]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((r) => {
      const hay = `${r.timestamp} ${r.level} ${r.ip} ${r.status_code} ${r.message}`.toLowerCase();
      return hay.includes(q);
    });
  }, [logs, query]);

  const columns: Column<SecurityLogItem>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      cell: (r) => <span className="text-gray-400 font-mono">{r.timestamp}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'level',
      header: 'Level',
      cell: (r) => levelBadge(r.level),
      className: 'whitespace-nowrap',
    },
    {
      key: 'ip',
      header: 'IP',
      cell: (r) => <span className="font-mono text-gray-200">{r.ip}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'status_code',
      header: 'Status',
      cell: (r) => <span className="text-gray-200">{r.status_code}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'message',
      header: 'Message',
      cell: (r) => <span className="text-gray-200 break-all">{r.message}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">접근 보안 로그</h2>
        <p className="text-gray-500 mt-2">서버별 접근 이벤트를 키워드(IP, 상태코드, 메시지)로 빠르게 탐색합니다.</p>
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

      <SearchBar value={query} onChange={setQuery} placeholder="검색: IP, status code, level, message" />

      <Card>
        <CardHeader
          title="Access Security Events"
          description="입력 즉시 필터링됩니다."
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
