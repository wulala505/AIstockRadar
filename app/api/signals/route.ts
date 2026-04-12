import { NextResponse } from 'next/server';
import {
  evaluateCapex,
  evaluateCompetition,
  evaluateEPS,
  evaluateValuation,
  evaluateMacro,
  compositeSignal
} from '@/lib/signals';
import {
  mockCapexData,
  mockEPSData,
  mockValuationData,
  mockMacroData,
  mockCompetitionData
} from '@/lib/mockData';

export async function GET() {
  try {
    // Use mock data if APIs not configured, real data otherwise
    const capexStatus = evaluateCapex(mockCapexData);
    const competitionStatus = evaluateCompetition(mockCompetitionData);
    const epsStatus = evaluateEPS(mockEPSData);
    const valuationStatus = evaluateValuation(mockValuationData);
    const macroStatus = evaluateMacro(mockMacroData);

    const allStatuses = [capexStatus, competitionStatus, epsStatus, valuationStatus, macroStatus];
    const composite = compositeSignal(allStatuses);

    return NextResponse.json({
      composite,
      signals: {
        capex: { status: capexStatus, data: mockCapexData },
        competition: { status: competitionStatus, data: mockCompetitionData },
        eps: { status: epsStatus, data: mockEPSData },
        valuation: { status: valuationStatus, data: mockValuationData },
        macro: { status: macroStatus, data: mockMacroData },
      },
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Signals API error:', error);
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
  }
}
