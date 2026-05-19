import type { JSX } from "react";

// src/types/dashboard.ts
export interface StatusCardInfo {
  title: string;
  value: string | number;
  unit?: string;
  icon: JSX.Element; // Lucide 아이콘 컴포넌트
  color: string;      // 아이콘의 배경색 클래스 (ex: 'bg-green-950 text-green-500')
}

export interface InfraMetricData {
  time: string; // ex: '10:15:30'
  cpu: number;
  memory: number;
  disk: number;
}

// cicd test
export interface NginxLogStatus {
  name: string; // ex: '200 (Success)', '404'
  value: number; // 로그 개수
  fill: string;  // 차트 색상 (ex: '#48bb78')
}

export interface RealTimeLog {
  id: string | number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  message: string;
}