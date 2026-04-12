import { NextResponse } from 'next/server';
import { getTSMCEarnings } from '@/lib/fmp';
import { mockEPSData } from '@/lib/mockData';
import { evaluateEPS, EPSData } from '@/lib/signals';

export async function GET() {
  try {
    const earnings = await getTSMCEarnings();

    let epsData: EPSData[] = mockEPSData;

    if (earnings && earnings.length > 0) {
      // Convert FMP earnings format to our EPSData format
      const sorted = earnings.slice().reverse();
      epsData = sorted.map((e, i) => {
        const prevYearIdx = i - 4;
        const prevYearEps = prevYearIdx >= 0 ? sorted[prevYearIdx].eps : e.epsEstimated;
        const yoyGrowth = prevYearEps ? ((e.eps - prevYearEps) / Math.abs(prevYearEps)) * 100 : 0;
        return {
          quarter: e.date.substring(0, 7),
          eps: e.eps,
          yoyGrowth,
        };
      });
    }

    const status = evaluateEPS(epsData);

    return NextResponse.json({
      status,
      data: epsData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('TSMC EPS API error:', error);
    return NextResponse.json({
      status: evaluateEPS(mockEPSData),
      data: mockEPSData,
      updatedAt: new Date().toISOString(),
    });
  }
}
