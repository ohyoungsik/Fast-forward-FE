// src/components/dashboard/StatusCard.tsx
import React, { type JSX } from 'react';

// Props 타입 정의 (3년 차의 필수 습관)
interface StatusCardProps {
  title: string;      // ex: "서버 상태"
  value: string | number; // ex: 23.5
  unit?: string;     // ex: "%"
  icon: JSX.Element; // Lucide 아이콘 같은 컴포넌트
  color: string;      // ex: 'bg-green-950 text-green-500'
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, unit, icon, color }) => {
  return (
    // Tailwind CSS를 이용한 다크 모드 및 카드 디자인
    <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xl">
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