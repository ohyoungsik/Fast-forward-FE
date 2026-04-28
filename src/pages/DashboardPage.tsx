import { useEffect, useState } from 'react';
import { Bell, Info, Search } from 'lucide-react';

import StatusCard from '../components/dashboard/StatusCard';
import InfraChart from '../components/dashboard/InfraChart';
import NginxLogChart from '../components/dashboard/NginxLogChart';
import LogStream from '../components/dashboard/LogStream';
import { initialStatusCards, initialNginxData, initialLogs, generateRealTimeData } from '../constants/mockData';
import type { InfraMetricData } from '../types/dashboard';

export default function DashboardPage() {
  const [infraData, setInfraData] = useState<InfraMetricData[]>([]);
  const [logStream, setLogStream] = useState(initialLogs);

  useEffect(() => {
    const initialInfra: InfraMetricData[] = Array.from({ length: 10 }, (_, i) => ({
      time: `10:${String(10 + i).padStart(2, '0')}`,
      cpu: 20 + Math.random() * 30,
      memory: 40 + Math.random() * 10,
      disk: 62.1,
    }));
    setInfraData(initialInfra);

    const infraInterval = setInterval(() => {
      setInfraData((prev) => generateRealTimeData(prev));
    }, 5000);

    const logInterval = setInterval(() => {
      const now = new Date();
      const newLog = {
        id: Date.now(),
        timestamp: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        level: (Math.random() > 0.3 ? 'INFO' : 'WARN') as 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL',
        message: 'sudo: user as: TTY=pts/0; PWD=/home/user; USER=root; COMMAND=/bin/systemctl restart nginx',
      };
      setLogStream((prev) => [newLog, ...prev.slice(0, 15)]);
    }, 10000);

    return () => {
      clearInterval(infraInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <>
      <header className="flex flex-col gap-5 md:flex-row md:justify-between md:items-center mb-10 pb-6 border-b border-gray-900">
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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-10">
        {initialStatusCards.map((card, index) => {
          if (index === 1) card.value = Math.round(infraData[infraData.length - 1]?.cpu || 0);
          if (index === 2) card.value = Math.round(infraData[infraData.length - 1]?.memory || 0);
          return <StatusCard key={index} {...card} />;
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
          <InfraChart data={infraData} />
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
            실시간 로그 스트림 (요약) <Info size={16} className="text-gray-600" />
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

