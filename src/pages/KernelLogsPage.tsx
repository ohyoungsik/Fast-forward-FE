import { useMemo, useState } from 'react';

import { Card, CardHeader } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { usePagination } from '../hooks/usePagination';
import { mockKernelLogs } from '../constants/mockPages';
import type { LogRow } from '../types/logs';

function levelBadge(level: LogRow['level']) {
  if (level === 'INFO') return <Badge variant="INFO">INFO</Badge>;
  if (level === 'WARN') return <Badge variant="WARN">WARN</Badge>;
  if (level === 'ERROR') return <Badge variant="ERROR">ERROR</Badge>;
  return <Badge variant="CRITICAL">CRITICAL</Badge>;
}

export default function KernelLogsPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockKernelLogs;
    return mockKernelLogs.filter((r) => {
      const hay = `${r.timestamp} ${r.level} ${r.ip} ${r.statusCode} ${r.message}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const { page, setPage, pageCount, paginatedItems } = usePagination(filtered);

  const columns: Column<LogRow>[] = [
    { key: 'timestamp', header: 'Timestamp', cell: (r) => <span className="text-gray-400 font-mono">{r.timestamp}</span>, className: 'whitespace-nowrap' },
    { key: 'level', header: 'Level', cell: (r) => levelBadge(r.level), className: 'whitespace-nowrap' },
    { key: 'ip', header: 'Source', cell: (r) => <span className="font-mono text-gray-200">{r.ip}</span>, className: 'whitespace-nowrap' },
    { key: 'status', header: 'Code', cell: (r) => <span className="text-gray-200">{r.statusCode}</span>, className: 'whitespace-nowrap' },
    { key: 'message', header: 'Message', cell: (r) => <span className="text-gray-200 break-all">{r.message}</span> },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">커널 로그</h2>
        <p className="text-gray-500 mt-2">OOM/파일시스템/네트워크 등 커널 이벤트를 빠르게 필터링합니다.</p>
      </header>

      <SearchBar value={query} onChange={setQuery} placeholder="검색: OOM, EXT4, audit, temperature, message" />

      <Card>
        <CardHeader
          title="Kernel Events"
          description="입력 즉시 필터링됩니다."
          right={<div className="text-xs text-gray-500">rows: {filtered.length}</div>}
        />
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          <>
            <DataTable columns={columns} rows={paginatedItems} />
            <Pagination
              page={page}
              pageCount={pageCount}
              total={filtered.length}
              pageSize={50}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}
