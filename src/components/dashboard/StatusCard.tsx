// src/components/dashboard/StatusCard.tsx
import React, { type JSX } from 'react';

// Props 타입 정의 (3년 차의 필수 습관)
interface StatusCardProps {
  title: string;      // ex: "서버 상태"
  value: string | number; // ex: 23.5
  unit?: string;     // ex: "%"
  icon: JSX.Element; // Lucide 아이콘 같은 컴포넌트
  color: string;      // ex: 'bg-green-950 text-green-500'
  recoveryState?: 'idle' | 'running' | 'done' | 'fail'; // ← kill표시추가
}

// kill 표시 추가
const recoveryConfig = {
  idle:    { dot: 'bg-gray-600',                  text: 'text-gray-600',    label: '자동복구2' },
  running: { dot: 'bg-orange-400 animate-pulse',  text: 'text-orange-400',  label: '실행중'    },
  done:    { dot: 'bg-green-400',                  text: 'text-green-400',   label: '완료'      },
  fail:    { dot: 'bg-red-400',                    text: 'text-red-400',     label: '실패'      },
};


const StatusCard: React.FC<StatusCardProps> = ({ title, value, unit, icon, color, recoveryState }) => {
  const rc = recoveryState ? recoveryConfig[recoveryState] : null; // 추가

  return (
    // Tailwind CSS를 이용한 다크 모드 및 카드 디자인
    <div className="relative bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xl">
      {/* 추가 */}
      {rc && (
        <div className="absolute top-2 right-3 flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
          <span className={`text-[9px] font-semibold ${rc.text}`}>{rc.label}</span>
        </div>
      )}
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-extrabold text-white tracking-tight">
          {value}
          <span className="text-base ml-1 font-medium text-gray-400">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default StatusCard;