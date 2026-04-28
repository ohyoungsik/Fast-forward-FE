import { useMemo, useState } from 'react';
import { Cpu, HardDrive, Activity, Server } from 'lucide-react';

import { Card, CardHeader } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { mockInfraRows } from '../constants/mockPages';
import type { InfraRow } from '../types/logs';

function infraStatusBadge(status: InfraRow['status']) {
  if (status === 'healthy') return <Badge variant="SUCCESS">HEALTHY</Badge>;
  if (status === 'degraded') return <Badge variant="WARN">DEGRADED</Badge>;
  return <Badge variant="CRITICAL">CRITICAL</Badge>;
}

export default function InfrastructureMonitoringPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockInfraRows;
    return mockInfraRows.filter((r) => {
      const hay = `${r.timestamp} ${r.host} ${r.status} cpu:${r.cpu} mem:${r.memory} disk:${r.disk}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const summary = useMemo(() => {
    const rows = filtered.length ? filtered : mockInfraRows;
    const avg = (k: keyof Pick<InfraRow, 'cpu' | 'memory' | 'disk'>) =>
      Math.round(rows.reduce((acc, r) => acc + r[k], 0) / Math.max(1, rows.length));
    return { cpu: avg('cpu'), memory: avg('memory'), disk: avg('disk'), hosts: new Set(rows.map((r) => r.host)).size };
  }, [filtered]);

  const columns: Column<InfraRow>[] = [
    { key: 'timestamp', header: 'Timestamp', cell: (r) => <span className="text-gray-400 font-mono">{r.timestamp}</span>, className: 'whitespace-nowrap' },
    { key: 'host', header: 'Host', cell: (r) => <span className="font-semibold text-white">{r.host}</span>, className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', cell: (r) => infraStatusBadge(r.status), className: 'whitespace-nowrap' },
    { key: 'cpu', header: 'CPU', cell: (r) => `${r.cpu}%`, className: 'whitespace-nowrap' },
    { key: 'memory', header: 'Memory', cell: (r) => `${r.memory}%`, className: 'whitespace-nowrap' },
    { key: 'disk', header: 'Disk', cell: (r) => `${r.disk}%`, className: 'whitespace-nowrap' },
  ];

  return (
    <div className="space-y-8">
      <header className="mb-2">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">인프라 모니터링</h2>
        <p className="text-gray-500 mt-2">호스트별 CPU/메모리/디스크 지표와 상태를 빠르게 탐색하세요.</p>
      </header>

      <SearchBar value={query} onChange={setQuery} placeholder="검색: host, status, cpu/memory/disk, timestamp" />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-green-950 text-green-500"><Cpu /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">평균 CPU</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">{summary.cpu}<span className="text-base ml-1 font-medium text-gray-400">%</span></p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-purple-950 text-purple-500"><Activity /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">평균 메모리</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">{summary.memory}<span className="text-base ml-1 font-medium text-gray-400">%</span></p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-yellow-950 text-yellow-500"><HardDrive /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">평균 디스크</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">{summary.disk}<span className="text-base ml-1 font-medium text-gray-400">%</span></p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-950 text-blue-500"><Server /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">관측 호스트</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">{summary.hosts}<span className="text-base ml-1 font-medium text-gray-400">대</span></p>
          </div>
        </Card>
      </section>

      <Card>
        <CardHeader title="호스트 상태 리스트" description="검색 입력 시 실시간 필터링됩니다." right={<div className="text-xs text-gray-500">rows: {filtered.length}</div>} />
        <DataTable columns={columns} rows={filtered} />
      </Card>
    </div>
  );
}

