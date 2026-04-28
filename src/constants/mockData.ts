// src/constants/mockData.ts
import type { StatusCardInfo, InfraMetricData, NginxLogStatus, RealTimeLog } from '../types/dashboard';
import { Server, Cpu, Activity, HardDrive, Wifi, AlertTriangle } from 'lucide-react';
import React from 'react';

// --- 초기 상태 카드 데이터 (변하지 않는 값들) ---
export const initialStatusCards: StatusCardInfo[] = [
  { title: "서버 상태", value: "3", unit: "전체 3대", icon: React.createElement(Server), color: "bg-blue-950 text-blue-500" },
  { title: "CPU 사용률", value: "0.0", unit: "%", icon: React.createElement(Cpu), color: "bg-green-950 text-green-500" },
  { title: "메모리 사용률", value: "0.0", unit: "%", icon: React.createElement(Activity), color: "bg-purple-950 text-purple-500" },
  { title: "디스크 사용률", value: "62.1", unit: "%", icon: React.createElement(HardDrive), color: "bg-yellow-950 text-yellow-500" },
  { title: "네트워크 트래픽", value: "1.2", unit: "Gbps", icon: React.createElement(Wifi), color: "bg-cyan-950 text-cyan-500" },
  { title: "경고 발생", value: "5", unit: "최근 1시간", icon: React.createElement(AlertTriangle), color: "bg-red-950 text-red-500" },
];

// --- Nginx 로그 초기 데이터 ---
export const initialNginxData: NginxLogStatus[] = [
  { name: '200 (Success)', value: 1920, fill: '#48bb78' },
  { name: '301/302', value: 320, fill: '#4299e1' },
  { name: '404', value: 80, fill: '#f6ad55' },
  { name: '500 (Server Error)', value: 40, fill: '#f56565' },
];

// --- 실시간 로그 초기 데이터 ---
export const initialLogs: RealTimeLog[] = [
  { id: 1, timestamp: '10:49:21', level: 'INFO', message: 'systemd[1]: Started nginx.service' },
  { id: 2, timestamp: '10:49:19', level: 'WARN', message: 'sshd[1234]: Failed password for invalid user' },
  { id: 3, timestamp: '10:49:18', level: 'ERROR', message: 'kernel: Out of memory: Kill process 1234' },
  { id: 4, timestamp: '10:49:17', level: 'INFO', message: 'nginx: 192.168.1.10 - [22/Apr/2026:10:49:17 +0900] "GET /index.html" 200 1024' },
];

// --- 실시간 모킹 함수 (App.tsx에서 사용) ---
export const generateRealTimeData = (currentInfra: InfraMetricData[]): InfraMetricData[] => {
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  // 이전 데이터의 마지막 값을 기반으로 랜덤하게 변경 (자연스러운 그래프)
  const lastMetric = currentInfra[currentInfra.length - 1] || { cpu: 20, memory: 40, disk: 62 };
  
  const newMetric: InfraMetricData = {
    time: time,
    cpu: Math.max(0, Math.min(100, lastMetric.cpu + (Math.random() - 0.5) * 10)),
    memory: Math.max(0, Math.min(100, lastMetric.memory + (Math.random() - 0.5) * 5)),
    disk: lastMetric.disk + (Math.random() - 0.5) * 1, // 디스크는 서서히 변경
  };

  const updatedData = [...currentInfra, newMetric];
  // 최근 15개 데이터만 유지 (화면 스크롤 방지)
  if (updatedData.length > 15) {
    return updatedData.slice(1);
  }
  return updatedData;
};