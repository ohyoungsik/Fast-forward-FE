import { useMemo, useState } from 'react';

import { Card, CardHeader } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { mockAccessSecurityLogs } from '../constants/mockPages';
import type { LogRow } from '../types/logs';

function levelBadge(level: LogRow['level']) {
  if (level === 'INFO') return <Badge variant="INFO">INFO</Badge>;
  if (level === 'WARN') return <Badge variant="WARN">WARN</Badge>;
  if (level === 'ERROR') return <Badge variant="ERROR">ERROR</Badge>;
  return <Badge variant="CRITICAL">CRITICAL</Badge>;
}

export default function AccessSecurityLogsPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockAccessSecurityLogs;
    return mockAccessSecurityLogs.filter((r) => {
      const hay = `${r.timestamp} ${r.level} ${r.ip} ${r.statusCode} ${r.message}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const columns: Column<LogRow>[] = [
    { key: 'timestamp', header: 'Timestamp', cell: (r) => <span className="text-gray-400 font-mono">{r.timestamp}</span>, className: 'whitespace-nowrap' },
    { key: 'level', header: 'Level', cell: (r) => levelBadge(r.level), className: 'whitespace-nowrap' },
    { key: 'ip', header: 'IP', cell: (r) => <span className="font-mono text-gray-200">{r.ip}</span>, className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', cell: (r) => <span className="text-gray-200">{r.statusCode}</span>, className: 'whitespace-nowrap' },
    { key: 'message', header: 'Message', cell: (r) => <span className="text-gray-200 break-all">{r.message}</span> },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">접근 보안 로그</h2>
        <p className="text-gray-500 mt-2">SSH 인증/권한 이벤트를 키워드(IP, 상태코드, 메시지)로 빠르게 탐색합니다.</p>
      </header>

      <SearchBar value={query} onChange={setQuery} placeholder="검색: IP, status code, level, message" />

      <Card>
        <CardHeader title="Access Security Events" description="입력 즉시 필터링됩니다." right={<div className="text-xs text-gray-500">rows: {filtered.length}</div>} />
        <DataTable columns={columns} rows={filtered} />
      </Card>
    </div>
  );
}

