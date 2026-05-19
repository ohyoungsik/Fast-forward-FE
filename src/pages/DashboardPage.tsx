import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import StatusCard from '../components/dashboard/StatusCard';
import InfraChart from '../components/dashboard/InfraChart';
import NginxLogChart from '../components/dashboard/NginxLogChart';
import LogStream from '../components/dashboard/LogStream';
import ServerDropdown from '../components/ServerDropdown';
import { initialStatusCards, initialNginxData } from '../constants/mockData';
import { getMetrics } from '../api/metrics';
import { getWebappLogs, type AppLogItem } from '../api/webapp_logs';
import { getSecurityAccessLogs, type SecurityAccessLogItem } from '../api/security';
import type { MetricsResponse } from '../types/metrics';
import type { InfraMetricData, RealTimeLog } from '../types/dashboard';
import CpuKill from '../components/dashboard/CpuKill';

const LEVEL_COLOR: Record<string, string> = {
  INFO: 'text-blue-400',
  WARN: 'text-yellow-400',
  ERROR: 'text-red-400',
  CRITICAL: 'text-red-600',
};

function formatNetwork(bytesPerSec: number): { value: string; unit: string } {
  if (bytesPerSec >= 1e9) return { value: (bytesPerSec / 1e9).toFixed(1), unit: 'GB/s' };
  if (bytesPerSec >= 1e6) return { value: (bytesPerSec / 1e6).toFixed(1), unit: 'MB/s' };
  if (bytesPerSec >= 1e3) return { value: (bytesPerSec / 1e3).toFixed(1), unit: 'KB/s' };
  return { value: bytesPerSec.toFixed(0), unit: 'B/s' };
}

function nowTimestamp() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function toStreamLevel(level: string): RealTimeLog['level'] {
  if (level === 'INFO' || level === 'WARN' || level === 'ERROR' || level === 'CRITICAL') return level;
  return 'INFO';
}

export default function DashboardPage() {
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [infraData, setInfraData] = useState<InfraMetricData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webappLogs, setWebappLogs] = useState<AppLogItem[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAccessLogItem[]>([]);
  const [recoveryState, setRecoveryState] = useState<'idle'|'running'|'done'|'fail'>('idle');
  useEffect(() => {
    if (!selectedServer) return;

    setInfraData([]);
    setMetrics(null);
    setError(null);

    let cancelled = false;

    const fetchAndUpdate = async () => {
      if (!cancelled) setIsLoading(true);
      try {
        const data = await getMetrics(selectedServer);
        if (cancelled) return;
        setMetrics(data);
        setInfraData((prev) => {
          const next = [...prev, { time: nowTimestamp(), cpu: data.cpu_usage, memory: data.memory_usage, disk: data.disk_usage }];
          return next.length > 15 ? next.slice(-15) : next;
        });
        setError(null);
      } catch {
        if (!cancelled) setError('메트릭 조회 실패. 서버 연결을 확인하세요.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAndUpdate();
    const id = setInterval(fetchAndUpdate, 5000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [selectedServer]);

  useEffect(() => {
    const fetchLogs = () => {
      getWebappLogs({ limit: 15 })
        .then((data) => setWebappLogs(data))
        .catch(() => {});
      getSecurityAccessLogs({ limit: 15 })
        .then((data) => setSecurityLogs(data))
        .catch(() => {});
    };
    fetchLogs();
    const id = setInterval(fetchLogs, 15000);
    return () => clearInterval(id);
  }, []);

  const streamLogs = useMemo<RealTimeLog[]>(() => {
    const combined: RealTimeLog[] = [
      ...webappLogs.map((log) => ({
        id: `wa-${log.id}`,
        timestamp: log.collected_at.slice(11, 19),
        level: toStreamLevel(log.level),
        message: `[${log.log_type}] ${log.message ?? ''}`,
      })),
      ...securityLogs.map((log) => ({
        id: `sec-${log.id}`,
        timestamp: log.collected_at.slice(11, 19),
        level: toStreamLevel(log.level),
        message: `[${log.log_type}] ${log.user_id ? log.user_id + ' ' : ''}${log.message ?? ''}`,
      })),
    ];
    return combined
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 20);
  }, [webappLogs, securityLogs]);

  return (
    <>
      <header className="mb-6 pb-6 border-b border-gray-900">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          통합 모니터링 대시보드 <span className="text-green-500 text-sm ml-3 font-semibold">● 실시간</span>
        </h2>
        <p className="text-gray-500 mt-2">다양한 로그와 시스템 지표를 한눈에 확인하고, 이상 징후를 빠르게 탐지하세요.</p>
      </header>

      <div className="flex items-center gap-4 mb-8">
        <ServerDropdown value={selectedServer} onChange={setSelectedServer} />
        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Loader2 size={13} className="animate-spin" /> 데이터 갱신 중...
          </span>
        )}
        {error && !isLoading && (
          <span className="text-xs text-red-400 bg-red-950/30 border border-red-900/30 px-3 py-1.5 rounded-lg">
            {error}
          </span>
        )}
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-10">
        {initialStatusCards.map((card, index) => {
          const overrides: { value?: string | number; unit?: string } = {};
          if (metrics) {
            if (index === 1) overrides.value = metrics.cpu_usage.toFixed(1);
            if (index === 2) overrides.value = metrics.memory_usage.toFixed(1);
            if (index === 3) overrides.value = metrics.disk_usage.toFixed(1);
            if (index === 4) {
              const net = formatNetwork(metrics.network_rx + metrics.network_tx);
              overrides.value = net.value;
              overrides.unit = net.unit;
            }
          }
          return <StatusCard key={index} {...card} {...overrides} recoveryState={index === 1 ? recoveryState : undefined} />;
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-lg tracking-tight">인프라 모니터링</h3>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          {infraData.length === 0 && !error ? (
            <div className="flex items-center justify-center h-[280px] text-gray-600 text-sm">
              <Loader2 size={20} className="animate-spin mr-2" /> 데이터 수집 중...
            </div>
          ) : (
            <InfraChart data={infraData} />
          )}
        </div>

        <div className="bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-lg tracking-tight">Web Application 로그</h3>
            <Link to="/webapp-logs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">전체 보기 →</Link>
          </div>
          {webappLogs.length === 0 ? (
            <div className="flex items-center justify-center h-[260px] text-gray-600 text-sm">수집된 로그가 없습니다.</div>
          ) : (
            <div className="space-y-2.5 overflow-hidden h-[260px] font-mono text-xs">
              {webappLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-[80px_48px_36px_1fr] gap-2 items-start">
                  <span className="text-gray-600 whitespace-nowrap">{log.collected_at.slice(11, 19)}</span>
                  <span className={`${LEVEL_COLOR[log.level] ?? 'text-gray-400'} font-semibold`}>[{log.level}]</span>
                  <span className="text-gray-500">{log.status_code ?? '-'}</span>
                  <span className="text-gray-300 break-all line-clamp-1">{log.message ?? '-'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl">
          <h3 className="font-extrabold text-lg tracking-tight mb-6">Nginx Log</h3>
          <NginxLogChart data={initialNginxData} />
        </div>

        <div className="lg:col-span-8 bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
          <h3 className="font-extrabold text-lg tracking-tight mb-6 flex justify-between items-center">
            실시간 로그 스트림 (요약)
            <span className="text-xs text-gray-600 font-normal">15초마다 갱신</span>
          </h3>
          <LogStream logs={streamLogs} />
        </div>
      </section>

      <CpuKill onStateChange={setRecoveryState} />
    </>
  );
}
