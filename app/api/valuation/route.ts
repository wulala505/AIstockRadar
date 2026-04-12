import { NextResponse } from 'next/server';
import { getTSMCQuote, getAnalystEstimates } from '@/lib/fmp';
import { mockValuationData } from '@/lib/mockData';
import { evaluateValuation } from '@/lib/signals';

export async function GET() {
  try {
    const [quote, estimates] = await Promise.allSettled([
      getTSMCQuote(),
      getAnalystEstimates('TSM'),
    ]);

    const quoteData = quote.status === 'fulfilled' ? quote.value : null;
    const estimatesData = estimates.status === 'fulfilled' ? estimates.value : null;

    const valuationData = quoteData ? {
      pe: quoteData.pe || mockValuationData.pe,
      forwardPE: mockValuationData.forwardPE,
      peg: mockValuationData.peg,
      price: quoteData.price || mockValuationData.price,
      epsGrowthEstimate: estimatesData?.epsGrowth || mockValuationData.epsGrowthEstimate,
    } : mockValuationData;

    const status = evaluateValuation(valuationData);

    return NextResponse.json({
      status,
      data: valuationData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Valuation API error:', error);
    return NextResponse.json({
      status: evaluateValuation(mockValuationData),
      data: mockValuationData,
      updatedAt: new Date().toISOString(),
    });
  }
}
