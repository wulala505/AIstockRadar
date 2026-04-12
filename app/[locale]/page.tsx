import SignalCard from '@/components/SignalCard';
import SignalGauge from '@/components/SignalGauge';
import CapexChart from '@/components/CapexChart';
import EpsChart from '@/components/EpsChart';
import MacroPanel from '@/components/MacroPanel';
import CompetitionPanel from '@/components/CompetitionPanel';
import ValuationPanel from '@/components/ValuationPanel';
import LanguageToggle from '@/components/LanguageToggle';
import {
  evaluateCapex,
  evaluateCompetition,
  evaluateEPS,
  evaluateValuation,
  evaluateMacro,
  compositeSignal,
  SignalStatus,
} from '@/lib/signals';
import {
  mockCapexData,
  mockEPSData,
  mockValuationData,
  mockMacroData,
  mockCompetitionData,
} from '@/lib/mockData';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations();

  const capexStatus = evaluateCapex(mockCapexData);
  const competitionStatus = evaluateCompetition(mockCompetitionData);
  const epsStatus = evaluateEPS(mockEPSData);
  const valuationStatus = evaluateValuation(mockValuationData);
  const macroStatus = evaluateMacro(mockMacroData);

  const allStatuses: SignalStatus[] = [
    capexStatus,
    competitionStatus,
    epsStatus,
    valuationStatus,
    macroStatus,
  ];
  const composite = compositeSignal(allStatuses);
  const warningCount = allStatuses.filter(s => s !== 'green').length;

  const updatedAt = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const signalIds = ['capex', 'competition', 'eps', 'valuation', 'macro'] as const;

  const statusColor = (s: SignalStatus) =>
    s === 'green' ? '#22c55e' : s === 'yellow' ? '#eab308' : '#ef4444';

  const statusIcon = (s: SignalStatus) =>
    s === 'green' ? '✓' : s === 'yellow' ? '!' : '✕';

  return (
    <div className="min-h-screen bg-[#0a1628] bg-grid-pattern">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-4 sticky top-0 z-10 bg-[#0a1628]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#f0ad23] font-mono text-xl font-bold leading-none">◆</span>
              <h1 className="text-white font-bold text-lg leading-tight">
                {t('dashboard.title')}
              </h1>
            </div>
            <p className="text-white/50 text-xs mt-0.5 pl-7">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 hidden sm:block">
              {t('dashboard.lastUpdated')}: {updatedAt}
            </span>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Top: Gauge + Recommendation Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-1">
            <SignalGauge
              status={composite}
              warningCount={warningCount}
              totalSignals={5}
            />
          </div>

          <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-[#f0ad23] font-mono text-xs font-semibold mb-3 uppercase tracking-wider">
                {t('dashboard.recommendation')}
              </h2>
              <p className="text-white text-base font-medium mb-5 leading-relaxed">
                {t(`actions.${composite}`)}
              </p>
            </div>

            {/* Signal mini status row */}
            <div className="grid grid-cols-5 gap-2">
              {allStatuses.map((status, i) => {
                const color = statusColor(status);
                return (
                  <div key={i} className="text-center">
                    <div
                      className="w-9 h-9 rounded-full mx-auto mb-1.5 flex items-center justify-center text-sm font-bold"
                      style={{
                        background: `${color}22`,
                        border: `1px solid ${color}55`,
                        color,
                      }}
                    >
                      {statusIcon(status)}
                    </div>
                    <p className="text-xs text-white/40 leading-tight">
                      {t(`signals.${signalIds[i]}.title`).split(' ')[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Signal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Signal 1: AI Capex */}
          <SignalCard
            id="capex"
            status={capexStatus}
            titleKey="signals.capex.title"
            descriptionKey="signals.capex.description"
            lastUpdated="2025 Q1"
            warningThreshold="2+ downgrades"
          >
            <CapexChart data={mockCapexData} />
            <div className="mt-2 space-y-1.5">
              {mockCapexData.map(d => (
                <div key={d.ticker} className="flex items-center justify-between text-xs">
                  <span className="text-white/70 font-mono w-12">{d.ticker}</span>
                  <span className="text-white/50">${d.currentQ}B</span>
                  <span
                    className="font-mono"
                    style={{ color: d.yoyChange > 0 ? '#22c55e' : '#ef4444' }}
                  >
                    {d.yoyChange > 0 ? '↑' : '↓'}
                    {Math.abs(d.yoyChange).toFixed(1)}%
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background:
                        d.guidance === 'upgrade'
                          ? '#22c55e22'
                          : d.guidance === 'maintain'
                            ? '#eab30822'
                            : '#ef444422',
                      color:
                        d.guidance === 'upgrade'
                          ? '#22c55e'
                          : d.guidance === 'maintain'
                            ? '#eab308'
                            : '#ef4444',
                    }}
                  >
                    {d.guidance}
                  </span>
                </div>
              ))}
            </div>
          </SignalCard>

          {/* Signal 2: Competition */}
          <SignalCard
            id="competition"
            status={competitionStatus}
            titleKey="signals.competition.title"
            descriptionKey="signals.competition.description"
            lastUpdated={new Date().toLocaleDateString('zh-TW')}
            warningThreshold="Major customer win"
          >
            <CompetitionPanel data={mockCompetitionData} />
          </SignalCard>

          {/* Signal 3: EPS Growth */}
          <SignalCard
            id="eps"
            status={epsStatus}
            titleKey="signals.eps.title"
            descriptionKey="signals.eps.description"
            lastUpdated="2025 Q1"
            warningThreshold="< 15% for 2Q"
          >
            <EpsChart data={mockEPSData} />
            <div className="mt-2 flex items-center justify-between text-xs bg-white/5 rounded-lg px-3 py-2">
              <span className="text-white/50">Latest EPS</span>
              <span className="font-mono text-white">
                NT${mockEPSData[mockEPSData.length - 1].eps.toFixed(2)}
              </span>
              <span className="font-mono text-[#22c55e]">
                +{mockEPSData[mockEPSData.length - 1].yoyGrowth.toFixed(1)}% YoY
              </span>
            </div>
          </SignalCard>

          {/* Signal 4: Valuation */}
          <SignalCard
            id="valuation"
            status={valuationStatus}
            titleKey="signals.valuation.title"
            descriptionKey="signals.valuation.description"
            lastUpdated={updatedAt}
            warningThreshold="P/E > 28x or PEG > 2"
          >
            <ValuationPanel data={mockValuationData} />
          </SignalCard>

          {/* Signal 5: Macro */}
          <SignalCard
            id="macro"
            status={macroStatus}
            titleKey="signals.macro.title"
            descriptionKey="signals.macro.description"
            lastUpdated={updatedAt}
            warningThreshold="PMI < 48 + SOX < 200MA"
          >
            <MacroPanel data={mockMacroData} />
          </SignalCard>

          {/* Signal Matrix Summary Card */}
          <div className="glass-card rounded-xl p-5 border border-[#f0ad23]/20 flex flex-col justify-between">
            <div>
              <h3 className="text-[#f0ad23] font-mono text-xs uppercase tracking-wider mb-4">
                Signal Matrix
              </h3>
              <div className="space-y-3">
                {allStatuses.map((status, i) => {
                  const color = statusColor(status);
                  const barWidth =
                    status === 'green' ? '25%' : status === 'yellow' ? '60%' : '100%';
                  return (
                    <div key={signalIds[i]} className="flex items-center justify-between gap-3">
                      <span className="text-xs text-white/60 w-20 shrink-0">
                        {t(`signals.${signalIds[i]}.title`).split(' ').slice(0, 2).join(' ')}
                      </span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: barWidth, backgroundColor: color }}
                        />
                      </div>
                      <span
                        className="text-xs font-mono w-14 text-right shrink-0"
                        style={{ color }}
                      >
                        {status.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/30 leading-relaxed">
                {t('common.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-4 mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xs text-white/30 font-mono">AIstockRadar v0.1</span>
          <span className="text-xs text-white/30">
            {t('dashboard.dataSource')}: FMP · FRED · TWSE
          </span>
        </div>
      </footer>
    </div>
  );
}
