'use client';
import { CompetitionData } from '@/lib/signals';

interface CompetitionPanelProps {
  data: CompetitionData;
}

const sentimentConfig = {
  positive: { color: '#22c55e' },
  warning: { color: '#eab308' },
  neutral: { color: '#6b7280' },
};

const competitorStatus = {
  'no-threat': { color: '#22c55e', labelZh: '無威脅', labelEn: 'No Threat' },
  'watch': { color: '#eab308', labelZh: '觀察中', labelEn: 'Watch' },
  'threat': { color: '#ef4444', labelZh: '威脅', labelEn: 'Threat' },
};

export default function CompetitionPanel({ data }: CompetitionPanelProps) {
  return (
    <div className="space-y-2">
      {data.headlines.map((h, i) => {
        const cfg = sentimentConfig[h.sentiment];
        return (
          <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg p-2.5">
            <span
              className="shrink-0 mt-1 w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: cfg.color }}
            />
            <div className="min-w-0">
              <p className="text-xs text-white/80 leading-relaxed">{h.title}</p>
              <p className="text-xs text-white/40 mt-0.5">{h.date}</p>
            </div>
          </div>
        );
      })}

      <div className="flex gap-2 mt-2">
        {(['samsung', 'intel'] as const).map(competitor => {
          const status =
            competitor === 'samsung' ? data.samsungStatus : data.intelStatus;
          const cfg = competitorStatus[status];
          return (
            <div
              key={competitor}
              className="flex-1 bg-white/5 rounded-lg p-2 text-center"
            >
              <p className="text-xs text-white/50 capitalize">
                {competitor === 'samsung' ? '三星' : '英特爾'}
              </p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: cfg.color }}>
                {cfg.labelZh}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
