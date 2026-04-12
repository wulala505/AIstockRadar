import { CapexData, EPSData, ValuationData, MacroData, CompetitionData } from './signals';

export const mockCapexData: CapexData[] = [
  { company: 'NVIDIA', ticker: 'NVDA', currentQ: 19.3, prevQ: 17.2, yoyChange: 12.2, guidance: 'upgrade' },
  { company: 'Microsoft', ticker: 'MSFT', currentQ: 21.4, prevQ: 19.8, yoyChange: 8.1, guidance: 'maintain' },
  { company: 'Alphabet', ticker: 'GOOGL', currentQ: 14.2, prevQ: 12.3, yoyChange: 15.4, guidance: 'upgrade' },
  { company: 'Amazon', ticker: 'AMZN', currentQ: 22.1, prevQ: 20.5, yoyChange: 7.8, guidance: 'maintain' },
  { company: 'Meta', ticker: 'META', currentQ: 10.8, prevQ: 9.2, yoyChange: 17.4, guidance: 'upgrade' },
];

export const mockEPSData: EPSData[] = [
  { quarter: '2024 Q1', eps: 8.70, yoyGrowth: 36.3 },
  { quarter: '2024 Q2', eps: 9.56, yoyGrowth: 36.3 },
  { quarter: '2024 Q3', eps: 12.54, yoyGrowth: 54.2 },
  { quarter: '2024 Q4', eps: 14.45, yoyGrowth: 57.0 },
  { quarter: '2025 Q1', eps: 13.94, yoyGrowth: 60.2 },
];

export const mockValuationData: ValuationData = {
  pe: 22.4,
  forwardPE: 18.9,
  peg: 0.87,
  price: 165.2,
  epsGrowthEstimate: 25.8,
};

export const mockMacroData: MacroData = {
  fedRate: 4.33,
  nextMeetingCutProb: 18.5,
  ismPMI: 49.3,
  pmiBelowHistory: 2,
  sox: 4821,
  sox200ma: 4650,
  yieldSpread10y2y: 0.42,
};

export const mockCompetitionData: CompetitionData = {
  headlines: [
    { title: 'Samsung 2nm yield rate remains below 40%, TSMC maintains lead', date: '2025-04-08', sentiment: 'positive' },
    { title: 'Intel 18A process sees first tape-out from external customer', date: '2025-04-05', sentiment: 'warning' },
    { title: 'Apple confirms TSMC 2nm production for A20 chip', date: '2025-04-01', sentiment: 'positive' },
  ],
  samsungStatus: 'watch',
  intelStatus: 'watch',
};
