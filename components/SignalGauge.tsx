'use client';
import { useTranslations } from 'next-intl';
import { SignalStatus } from '@/lib/signals';
import clsx from 'clsx';

interface SignalGaugeProps {
  status: SignalStatus;
  warningCount: number;
  totalSignals: number;
}

export default function SignalGauge({ status, warningCount, totalSignals }: SignalGaugeProps) {
  const t = useTranslations();

  const statusColor = {
    green: '#22c55e',
    yellow: '#eab308',
    red: '#ef4444',
  }[status];

  const percentage = (warningCount / totalSignals) * 100;

  const bgGradient = {
    green: 'from-emerald-500/20 to-green-500/5',
    yellow: 'from-yellow-500/20 to-amber-500/5',
    red: 'from-red-500/20 to-rose-500/5',
  }[status];

  const emoji = {
    green: '✓',
    yellow: '!',
    red: '✕',
  }[status];

  return (
    <div
      className={clsx(
        'glass-card rounded-2xl p-6 bg-gradient-to-br text-center h-full flex flex-col justify-center',
        bgGradient
      )}
    >
      {/* Big status indicator */}
      <div className="mb-4">
        <div
          className={clsx(
            'inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold',
            status === 'red' && 'animate-pulse'
          )}
          style={{
            background: `radial-gradient(circle, ${statusColor}33, ${statusColor}11)`,
            border: `2px solid ${statusColor}66`,
            color: statusColor,
          }}
        >
          {emoji}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">{t(`status.${status}`)}</h2>

      <p className="text-white/60 text-sm mb-4">
        {warningCount} / {totalSignals} {t('dashboard.signalCount')}
      </p>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: statusColor }}
        />
      </div>

      {/* Action text */}
      <div
        className="text-sm font-medium px-4 py-3 rounded-lg leading-relaxed"
        style={{ background: `${statusColor}22`, color: statusColor }}
      >
        {t(`actions.${status}`)}
      </div>
    </div>
  );
}
