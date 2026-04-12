import { NextResponse } from 'next/server';
import { getHyperscalerQuotes } from '@/lib/fmp';
import { mockCapexData } from '@/lib/mockData';
import { evaluateCapex } from '@/lib/signals';

export async function GET() {
  try {
    const quotes = await getHyperscalerQuotes();

    // We primarily use mock capex data since FMP quote data
    // doesn't directly include capex guidance
    // In production, you'd pull from earnings call data or analyst reports
    const capexData = mockCapexData.map(d => {
      const quote = quotes.find(q => q.symbol === d.ticker);
      return {
        ...d,
        // Update current price if available
        ...(quote ? { price: quote.price } : {}),
      };
    });

    const status = evaluateCapex(capexData);

    return NextResponse.json({
      status,
      data: capexData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Capex API error:', error);
    return NextResponse.json({
      status: evaluateCapex(mockCapexData),
      data: mockCapexData,
      updatedAt: new Date().toISOString(),
    });
  }
}
