// src/components/dashboard/NginxLogChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';
import type { NginxLogStatus } from '../../types/dashboard';

interface NginxLogChartProps {
  data: NginxLogStatus[];
}

const NginxLogChart: React.FC<NginxLogChartProps> = ({ data }) => {
  const totalRequests = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie data={data} innerRadius={65} outerRadius={90} dataKey="value" stroke="none">
          {data.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
        </Pie>
        {/* 도넛 중앙의 총 요청 수 텍스트 */}
        <Text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-gray-500 text-sm font-medium"
        >
          총 요청 수
        </Text>
        <Text
          x="50%"
          y="62%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-3xl font-extrabold text-white"
        >
          {totalRequests.toLocaleString()}
        </Text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default NginxLogChart;