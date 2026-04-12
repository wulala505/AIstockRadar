'use client';
import { MacroData } from '@/lib/signals';

interface MacroPanelProps {
  data: MacroData;
}

export default function MacroPanel({ data }: MacroPanelProps) {
  const soxAboveMA = data.sox > data.sox200ma;
  const pmiColor =
    data.ismPMI > 50 ? '#22c55e' : data.ismPMI > 48 ? '#eab308' : '#ef4444';
  const spreadColor = data.yieldSpread10y2y > 0 ? '#22c55e' : '#ef4444';
  const soxColor = soxAboveMA ? '#22c55e' : '#ef4444';

  const indicators = [
    {
      label: 'Fed Rate',
      value: `${data.fedRate.toFixed(2)}%`,
      color: '#f0ad23',
      sub: `Cut prob: ${data.nextMeetingCutProb}%`,
    },
    {
      label: 'ISM PMI',
      value: data.ismPMI.toFixed(1),
      color: pmiColor,
      sub: data.ismPMI > 50 ? 'Expansionary' : 'Contractionary',
    },
    {
      label: 'SOX vs 200MA',
      value: soxAboveMA ? 'Above' : 'Below',
      color: soxColor,
      sub: `${data.sox.toFixed(0)} / ${data.sox200ma.toFixed(0)}`,
    },
    {
      label: '10Y-2Y Spread',
      value: `${data.yieldSpread10y2y > 0 ? '+' : ''}${data.yieldSpread10y2y.toFixed(2)}%`,
      color: spreadColor,
      sub: data.yieldSpread10y2y > 0 ? 'Normal' : 'Inverted',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {indicators.map(ind => (
        <div key={ind.label} className="bg-white/5 rounded-lg p-3">
          <p className="text-xs text-white/50 mb-1">{ind.label}</p>
          <p className="font-mono font-semibold text-base" style={{ color: ind.color }}>
            {ind.value}
          </p>
          <p className="text-xs text-white/40 mt-0.5">{ind.sub}</p>
        </div>
      ))}
    </div>
  );
}
