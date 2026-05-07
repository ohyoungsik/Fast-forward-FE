import { useEffect, useMemo, useState } from 'react';
import { Cpu, HardDrive, Activity, Server, Loader2 } from 'lucide-react';

import { Card, CardHeader } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import ServerDropdown from '../components/ServerDropdown';
import { getMetrics, getMetricsHistory } from '../api/metrics';
import type { MetricsResponse, MetricsHistoryPoint } from '../types/metrics';
import type { InfraRow } from '../types/logs';

function infraStatusBadge(status: InfraRow['status']) {
  if (status === 'healthy') return <Badge variant="SUCCESS">HEALTHY</Badge>;
  if (status === 'degraded') return <Badge variant="WARN">DEGRADED</Badge>;
  return <Badge variant="CRITICAL">CRITICAL</Badge>;
}

function deriveStatus(cpu: number, memory: number, disk: number): InfraRow['status'] {
  if (cpu >= 90 || memory >= 90 || disk >= 90) return 'critical';
  if (cpu >= 70 || memory >= 70 || disk >= 70) return 'degraded';
  return 'healthy';
}

let rowId = 1;

export default function InfrastructureMonitoringPage() {
  const [query, setQuery] = useState('');
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [historyRows, setHistoryRows] = useState<InfraRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;

    setMetrics(null);
    setHistoryRows([]);
    setError(null);

    let cancelled = false;

    const fetchAll = async () => {
      if (!cancelled) setIsLoading(true);
      try {
        const [latest, history] = await Promise.all([
          getMetrics(selectedServer),
          getMetricsHistory(selectedServer, 30),
        ]);
        if (cancelled) return;
        setMetrics(latest);
        setHistoryRows(
          history.map((p: MetricsHistoryPoint) => ({
            id: rowId++,
            timestamp: p.time,
            host: selectedServer,
            cpu: parseFloat(p.cpu.toFixed(1)),
            memory: parseFloat(p.memory.toFixed(1)),
            disk: parseFloat(p.disk.toFixed(1)),
            status: deriveStatus(p.cpu, p.memory, p.disk),
          })),
        );
        setError(null);
      } catch {
        if (!cancelled) setError('메트릭 조회 실패');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();
    const id = setInterval(fetchAll, 5000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [selectedServer]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return historyRows;
    return historyRows.filter((r) => {
      const hay = `${r.timestamp} ${r.host} ${r.status} cpu:${r.cpu} mem:${r.memory} disk:${r.disk}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, historyRows]);

  const columns: Column<InfraRow>[] = [
    { key: 'timestamp', header: 'Timestamp', cell: (r) => <span className="text-gray-400 font-mono">{r.timestamp}</span>, className: 'whitespace-nowrap' },
    { key: 'host', header: 'Host', cell: (r) => <span className="font-semibold text-white">{r.host}</span>, className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', cell: (r) => infraStatusBadge(r.status), className: 'whitespace-nowrap' },
    { key: 'cpu', header: 'CPU', cell: (r) => `${r.cpu}%`, className: 'whitespace-nowrap' },
    { key: 'memory', header: 'Memory', cell: (r) => `${r.memory}%`, className: 'whitespace-nowrap' },
    { key: 'disk', header: 'Disk', cell: (r) => `${r.disk}%`, className: 'whitespace-nowrap' },
  ];

  const cpuValue = metrics ? metrics.cpu_usage.toFixed(1) : '—';
  const memValue = metrics ? metrics.memory_usage.toFixed(1) : '—';
  const diskValue = metrics ? metrics.disk_usage.toFixed(1) : '—';

  return (
    <div className="space-y-8">
      <header className="mb-2">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">인프라 모니터링</h2>
        <p className="text-gray-500 mt-2">호스트별 CPU/메모리/디스크 지표와 상태를 빠르게 탐색하세요.</p>
      </header>

      <div className="flex items-center gap-4">
        <ServerDropdown value={selectedServer} onChange={setSelectedServer} />
        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Loader2 size={13} className="animate-spin" /> 갱신 중...
          </span>
        )}
        {error && !isLoading && (
          <span className="text-xs text-red-400 bg-red-950/30 border border-red-900/30 px-3 py-1.5 rounded-lg">
            {error}
          </span>
        )}
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="검색: host, status, cpu/memory/disk, timestamp" />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-green-950 text-green-500"><Cpu /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">CPU 사용률</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {cpuValue}
              {metrics && <span className="text-base ml-1 font-medium text-gray-400">%</span>}
            </p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-purple-950 text-purple-500"><Activity /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">메모리 사용률</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {memValue}
              {metrics && <span className="text-base ml-1 font-medium text-gray-400">%</span>}
            </p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-yellow-950 text-yellow-500"><HardDrive /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">디스크 사용률</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {diskValue}
              {metrics && <span className="text-base ml-1 font-medium text-gray-400">%</span>}
            </p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-950 text-blue-500"><Server /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">수집 데이터</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {historyRows.length}<span className="text-base ml-1 font-medium text-gray-400">건</span>
            </p>
          </div>
        </Card>
      </section>

      <Card>
        <CardHeader
          title="호스트 상태 리스트"
          description="검색 입력 시 실시간 필터링됩니다."
          right={<div className="text-xs text-gray-500">rows: {filtered.length}</div>}
        />
        {filtered.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
            {selectedServer ? '수집된 데이터가 없습니다.' : '서버를 선택해 주세요.'}
          </div>
        ) : (
          <DataTable columns={columns} rows={filtered} />
        )}
      </Card>
    </div>
  );
}
