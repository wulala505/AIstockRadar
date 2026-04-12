'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CapexData } from '@/lib/signals';

interface CapexChartProps {
  data: CapexData[];
}

const guidanceColor: Record<string, string> = {
  upgrade: '#22c55e',
  maintain: '#eab308',
  downgrade: '#ef4444',
};

export default function CapexChart({ data }: CapexChartProps) {
  const chartData = data.map(d => ({
    name: d.ticker,
    current: d.currentQ,
    prev: d.prevQ,
    guidance: d.guidance,
    yoyChange: d.yoyChange,
  }));

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#ffffff80', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#ffffff80', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0f1e35',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#f0ad23' }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value: number) => [`$${value}B`, 'Capex']}
          />
          <Bar dataKey="current" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={guidanceColor[entry.guidance] ?? '#6b7280'}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
