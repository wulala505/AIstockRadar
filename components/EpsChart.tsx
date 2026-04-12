'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { EPSData } from '@/lib/signals';

interface EpsChartProps {
  data: EPSData[];
}

export default function EpsChart({ data }: EpsChartProps) {
  const chartData = data.map(d => ({
    quarter: d.quarter.replace('20', "'"),
    yoyGrowth: d.yoyGrowth,
    eps: d.eps,
  }));

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="quarter"
            tick={{ fill: '#ffffff80', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#ffffff80', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              background: '#0f1e35',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#f0ad23' }}
            itemStyle={{ color: '#22c55e' }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'YoY Growth']}
          />
          <ReferenceLine y={20} stroke="#22c55e44" strokeDasharray="5 5" />
          <ReferenceLine y={15} stroke="#eab30844" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="yoyGrowth"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: '#22c55e', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
