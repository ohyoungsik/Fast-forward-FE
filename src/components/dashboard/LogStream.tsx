// src/components/dashboard/LogStream.tsx
import React from 'react';
import type { RealTimeLog } from '../../types/dashboard';

interface LogStreamProps {
  logs: RealTimeLog[];
}

const logColors: Record<RealTimeLog['level'], string> = {
  INFO: 'text-blue-500',
  WARN: 'text-yellow-500',
  ERROR: 'text-red-500',
  CRITICAL: 'text-red-700',
};

const LogStream: React.FC<LogStreamProps> = ({ logs }) => (
  <div className="text-xs space-y-2.5 font-mono overflow-y-auto h-[230px]">
    {logs.map((log) => (
      <p key={log.id} className="flex space-x-2">
        <span className="text-gray-600 whitespace-nowrap">{log.timestamp}</span>
        <span className={`${logColors[log.level]} font-semibold`}>[{log.level}]</span>
        <span className="text-gray-300 break-all">{log.message}</span>
      </p>
    ))}
  </div>
);

export default LogStream;