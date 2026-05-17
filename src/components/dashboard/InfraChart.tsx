// src/components/dashboard/InfraChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { InfraMetricData } from '../../types/dashboard';
// cicd test 
interface InfraChartProps {
  data: InfraMetricData[];
}

const InfraChart: React.FC<InfraChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
      {/* 다크 모드에 어울리는 희미한 그리드 */}
      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
      <XAxis dataKey="time" hide /> {/* 시간 값은 숨겨서 깔끔하게 */}
      <YAxis hide domain={[0, 100]} /> {/* 범위 고정 [0, 100] */}
      
      {/* 툴팁 디자인 커스텀 */}
      <Tooltip 
        contentStyle={{ backgroundColor: '#000', border: '1px solid #2d3748', borderRadius: '8px', padding: '10px' }}
        itemStyle={{ color: '#e2e8f0' }}
        labelStyle={{ color: '#a0aec0' }}
      />

      {/* 이미지와 동일한 색상 및 곡선 타입 */}
      <Line type="monotone" dataKey="cpu" stroke="#48bb78" strokeWidth={3} dot={false} name="CPU" />
      <Line type="monotone" dataKey="memory" stroke="#4299e1" strokeWidth={3} dot={false} name="Memory" />
      <Line type="monotone" dataKey="disk" stroke="#f6ad55" strokeWidth={3} dot={false} name="Disk" />
    </LineChart>
  </ResponsiveContainer>
);

export default InfraChart;