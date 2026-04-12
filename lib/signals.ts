export type SignalStatus = 'green' | 'yellow' | 'red';

export interface SignalResult {
  id: string;
  status: SignalStatus;
  value: number | string;
  threshold: string;
  lastUpdated: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface CapexData {
  company: string;
  ticker: string;
  currentQ: number;
  prevQ: number;
  yoyChange: number;
  guidance: 'upgrade' | 'maintain' | 'downgrade';
}

export interface EPSData {
  quarter: string;
  eps: number;
  yoyGrowth: number;
}

export interface ValuationData {
  pe: number;
  forwardPE: number;
  peg: number;
  price: number;
  epsGrowthEstimate: number;
}

export interface MacroData {
  fedRate: number;
  nextMeetingCutProb: number;
  ismPMI: number;
  pmiBelowHistory: number; // consecutive months below 50
  sox: number;
  sox200ma: number;
  yieldSpread10y2y: number;
}

export interface CompetitionData {
  headlines: Array<{ title: string; date: string; sentiment: 'neutral' | 'warning' | 'positive' }>;
  samsungStatus: 'no-threat' | 'watch' | 'threat';
  intelStatus: 'no-threat' | 'watch' | 'threat';
}

export function evaluateCapex(data: CapexData[]): SignalStatus {
  const downgrades = data.filter(d => d.guidance === 'downgrade').length;
  if (downgrades === 0) return 'green';
  if (downgrades === 1) return 'yellow';
  return 'red';
}

export function evaluateCompetition(data: CompetitionData): SignalStatus {
  const threatCount = [data.samsungStatus, data.intelStatus].filter(s => s === 'threat').length;
  const watchCount = [data.samsungStatus, data.intelStatus].filter(s => s === 'watch').length;
  if (threatCount > 0) return 'red';
  if (watchCount > 0) return 'yellow';
  return 'green';
}

export function evaluateEPS(data: EPSData[]): SignalStatus {
  if (data.length === 0) return 'green';
  const latest = data[data.length - 1];
  const prev = data.length > 1 ? data[data.length - 2] : null;
  if (latest.yoyGrowth > 20) return 'green';
  if (latest.yoyGrowth > 15) return 'yellow';
  // Red only if 2 consecutive quarters below 15%
  if (prev && prev.yoyGrowth < 15) return 'red';
  return 'yellow';
}

export function evaluatePE(pe: number): SignalStatus {
  if (pe < 25) return 'green';
  if (pe < 30) return 'yellow';
  return 'red';
}

export function evaluatePEG(peg: number): SignalStatus {
  if (peg < 1.2) return 'green';
  if (peg < 2.0) return 'yellow';
  return 'red';
}

export function evaluateValuation(data: ValuationData): SignalStatus {
  const peStatus = evaluatePE(data.pe);
  const pegStatus = evaluatePEG(data.peg);
  const statuses = [peStatus, pegStatus];
  if (statuses.includes('red')) return 'red';
  if (statuses.includes('yellow')) return 'yellow';
  return 'green';
}

export function evaluateMacro(data: MacroData): SignalStatus {
  const warnings: number[] = [];
  // PMI check
  if (data.ismPMI < 48 && data.pmiBelowHistory >= 3) warnings.push(2);
  else if (data.ismPMI < 50) warnings.push(1);
  // SOX check
  if (data.sox < data.sox200ma) warnings.push(1);
  // Yield curve
  if (data.yieldSpread10y2y < 0) warnings.push(1);

  const total = warnings.reduce((a, b) => a + b, 0);
  if (total >= 3) return 'red';
  if (total >= 1) return 'yellow';
  return 'green';
}

export function compositeSignal(signals: SignalStatus[]): SignalStatus {
  const reds = signals.filter(s => s === 'red').length;
  const yellows = signals.filter(s => s === 'yellow').length;
  if (reds >= 3) return 'red';
  if (reds >= 1 || yellows >= 3) return 'yellow';
  return 'green';
}

export function getCompositeScore(signals: SignalStatus[]): number {
  return signals.filter(s => s === 'red').length * 2 + signals.filter(s => s === 'yellow').length;
}
