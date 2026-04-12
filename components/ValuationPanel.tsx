'use client';
import { ValuationData, evaluatePE, evaluatePEG, SignalStatus } from '@/lib/signals';

interface ValuationPanelProps {
  data: ValuationData;
}

const statusColor: Record<SignalStatus, string> = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
};

export default function ValuationPanel({ data }: ValuationPanelProps) {
  const peStatus = evaluatePE(data.pe);
  const pegStatus = evaluatePEG(data.peg);

  const metrics = [
    { label: 'P/E (TTM)', value: `${data.pe.toFixed(1)}x`, status: peStatus, threshold: '< 25x' },
    { label: 'Forward P/E', value: `${data.forwardPE.toFixed(1)}x`, status: 'green' as SignalStatus, threshold: '—' },
    { label: 'PEG Ratio', value: data.peg.toFixed(2), status: pegStatus, threshold: '< 1.2' },
    {
      label: 'EPS Growth Est.',
      value: `${data.epsGrowthEstimate.toFixed(1)}%`,
      status: 'green' as SignalStatus,
      threshold: '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {metrics.map(m => (
        <div key={m.label} className="bg-white/5 rounded-lg p-3">
          <p className="text-xs text-white/50 mb-1">{m.label}</p>
          <p className="font-mono font-bold text-lg" style={{ color: statusColor[m.status] }}>
            {m.value}
          </p>
          <p className="text-xs text-white/30 mt-0.5">目標: {m.threshold}</p>
        </div>
      ))}
    </div>
  );
}
