'use client';
import { useTranslations } from 'next-intl';
import { SignalStatus } from '@/lib/signals';
import clsx from 'clsx';

interface SignalCardProps {
  id: string;
  status: SignalStatus;
  titleKey: string;
  descriptionKey: string;
  children: React.ReactNode;
  lastUpdated?: string;
  warningThreshold?: string;
}

const statusConfig = {
  green: {
    badge: 'bg-signal-green/20 text-signal-green',
    dot: 'bg-signal-green',
    borderColor: '#22c55e',
    shadowColor: 'rgba(34,197,94,0.1)',
  },
  yellow: {
    badge: 'bg-signal-yellow/20 text-signal-yellow',
    dot: 'bg-signal-yellow',
    borderColor: '#eab308',
    shadowColor: 'rgba(234,179,8,0.1)',
  },
  red: {
    badge: 'bg-signal-red/20 text-signal-red',
    dot: 'bg-signal-red animate-pulse',
    borderColor: '#ef4444',
    shadowColor: 'rgba(239,68,68,0.15)',
  },
};

export default function SignalCard({
  id,
  status,
  children,
  lastUpdated,
  warningThreshold
}: SignalCardProps) {
  const t = useTranslations();
  const config = statusConfig[status];

  return (
    <div
      className={clsx(
        'glass-card rounded-xl p-5 border-l-4 animate-fade-in transition-all duration-300'
      )}
      style={{
        borderLeftColor: config.borderColor,
        boxShadow: status === 'red' ? `0 4px 24px ${config.shadowColor}` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={clsx('inline-block w-2.5 h-2.5 rounded-full shrink-0', config.dot)}
            />
            <h3 className="font-semibold text-white text-sm leading-tight">
              {t(`signals.${id}.title`)}
            </h3>
          </div>
          <p className="text-xs text-white/50 pl-4">{t(`signals.${id}.description`)}</p>
        </div>
        <span
          className={clsx(
            'text-xs font-mono px-2.5 py-1 rounded-full font-semibold ml-2 shrink-0',
            config.badge
          )}
        >
          {t(`status.${status}`)}
        </span>
      </div>

      {/* Content */}
      <div className="mt-3">{children}</div>

      {/* Footer */}
      {(lastUpdated || warningThreshold) && (
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
          {warningThreshold && (
            <span className="text-xs text-white/40">
              {t('common.threshold')}: {warningThreshold}
            </span>
          )}
          {lastUpdated && (
            <span className="text-xs text-white/40 ml-auto">
              {t('dashboard.lastUpdated')}: {lastUpdated}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
