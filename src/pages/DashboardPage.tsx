import { useEffect, useState } from 'react';
import { Bell, Loader2, Search } from 'lucide-react';

import StatusCard from '../components/dashboard/StatusCard';
import InfraChart from '../components/dashboard/InfraChart';
import NginxLogChart from '../components/dashboard/NginxLogChart';
import LogStream from '../components/dashboard/LogStream';
import ServerDropdown from '../components/ServerDropdown';
import { initialStatusCards, initialNginxData, initialLogs } from '../constants/mockData';
import { getMetrics } from '../api/metrics';
import { SERVERS, type ServerName, type MetricsResponse } from '../types/metrics';
import type { InfraMetricData } from '../types/dashboard';

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

export default function DashboardPage() {
  const [selectedServer, setSelectedServer] = useState<ServerName>(SERVERS[0]);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [infraData, setInfraData] = useState<InfraMetricData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logStream, setLogStream] = useState(initialLogs);

  useEffect(() => {
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
          const next = [...prev, { time: nowTimestamp(), cpu: data.cpu, memory: data.memory, disk: data.disk }];
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
    const id = setInterval(() => {
      const now = new Date();
      const newLog = {
        id: Date.now(),
        timestamp: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        level: (Math.random() > 0.3 ? 'INFO' : 'WARN') as 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL',
        message: 'sudo: user as: TTY=pts/0; PWD=/home/user; USER=root; COMMAND=/bin/systemctl restart nginx',
      };
      setLogStream((prev) => [newLog, ...prev.slice(0, 15)]);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <header className="flex flex-col gap-5 md:flex-row md:justify-between md:items-center mb-6 pb-6 border-b border-gray-900">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            통합 모니터링 대시보드 <span className="text-green-500 text-sm ml-3 font-semibold">● 실시간</span>
          </h2>
          <p className="text-gray-500 mt-2">다양한 로그와 시스템 지표를 한눈에 확인하고, 이상 징후를 빠르게 탐지하세요.</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-2.5 rounded-xl shadow-inner w-full md:w-auto">
          <Search className="text-gray-600" />
          <input type="text" placeholder="검색..." className="bg-transparent text-sm focus:outline-none flex-1 md:flex-none" />
          <span className="text-gray-700">|</span>
          <select className="bg-transparent text-sm focus:outline-none text-gray-400">
            <option>최근 1시간</option>
          </select>
          <Bell className="text-gray-400 cursor-pointer" />
        </div>
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
            if (index === 1) overrides.value = metrics.cpu.toFixed(1);
            if (index === 2) overrides.value = metrics.memory.toFixed(1);
            if (index === 3) overrides.value = metrics.disk.toFixed(1);
            if (index === 4) {
              const net = formatNetwork(metrics.network);
              overrides.value = net.value;
              overrides.unit = net.unit;
            }
          }
          return <StatusCard key={index} {...card} {...overrides} />;
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-4 bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl">
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

        <div className="lg:col-span-4 bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl">
          <h3 className="font-extrabold text-lg tracking-tight mb-6">접근 보안 로그</h3>
          <div className="text-gray-500 text-sm flex items-center justify-center h-[280px]">구현 생략 (막대 차트)</div>
        </div>

        <div className="lg:col-span-4 bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl">
          <h3 className="font-extrabold text-lg tracking-tight mb-6">Web Application 로그</h3>
          <div className="text-gray-500 text-sm flex items-center justify-center h-[280px]">구현 생략 (step 차트)</div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl">
          <h3 className="font-extrabold text-lg tracking-tight mb-6">Nginx Log</h3>
          <NginxLogChart data={initialNginxData} />
        </div>

        <div className="lg:col-span-6 bg-gray-900 p-7 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
          <h3 className="font-extrabold text-lg tracking-tight mb-6 flex justify-between items-center">
            실시간 로그 스트림 (요약)
          </h3>
          <LogStream logs={logStream} />
        </div>

        <div className="lg:col-span-3 bg-red-950/20 p-7 rounded-3xl border border-red-900/30 shadow-inner">
          <h3 className="font-extrabold text-lg tracking-tight text-red-500 mb-6">알림 예시</h3>
          <div className="space-y-4">
            <div className="text-xs border-l-2 border-red-600 pl-3">
              <p className="text-white font-medium">CPU 사용률 90% 이상 지속</p>
              <p className="text-gray-600 mt-1">10:45</p>
            </div>
            <div className="text-xs border-l-2 border-orange-600 pl-3">
              <p className="text-white font-medium">SSH 로그인 실패 10회 이상</p>
              <p className="text-gray-600 mt-1">10:40</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
