import { NextResponse } from 'next/server';
import { getFedFundsRate, getISMPMI, getYieldSpread } from '@/lib/fred';
import { mockMacroData } from '@/lib/mockData';
import { evaluateMacro } from '@/lib/signals';

export async function GET() {
  try {
    // Try to get real FRED data, fall back to mock
    const [fedRate, pmi, yieldSpread] = await Promise.allSettled([
      getFedFundsRate(),
      getISMPMI(),
      getYieldSpread(),
    ]);

    const macroData = {
      ...mockMacroData,
      fedRate: fedRate.status === 'fulfilled' ? fedRate.value.value : mockMacroData.fedRate,
      ismPMI: pmi.status === 'fulfilled' ? pmi.value.value : mockMacroData.ismPMI,
      yieldSpread10y2y: yieldSpread.status === 'fulfilled' ? yieldSpread.value.value : mockMacroData.yieldSpread10y2y,
    };

    const status = evaluateMacro(macroData);

    return NextResponse.json({
      status,
      data: macroData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Macro API error:', error);
    return NextResponse.json({
      status: evaluateMacro(mockMacroData),
      data: mockMacroData,
      updatedAt: new Date().toISOString(),
    });
  }
}
