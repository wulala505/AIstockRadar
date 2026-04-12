const FMP_BASE = 'https://financialmodelingprep.com/api/v3';
const API_KEY = process.env.FMP_API_KEY || '';

export interface FMPQuote {
  symbol: string;
  price: number;
  pe: number;
  eps: number;
  priceAvg200: number;
  yearHigh: number;
  yearLow: number;
}

export interface FMPEarnings {
  date: string;
  eps: number;
  epsEstimated: number;
  revenue: number;
}

export async function getTSMCQuote(): Promise<FMPQuote | null> {
  if (!API_KEY) return null;
  try {
    // TSM is TSMC ADR on NYSE
    const res = await fetch(`${FMP_BASE}/quote/TSM?apikey=${API_KEY}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch {
    return null;
  }
}

export async function getHyperscalerQuotes(): Promise<FMPQuote[]> {
  if (!API_KEY) return [];
  try {
    const tickers = ['NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META'];
    const res = await fetch(
      `${FMP_BASE}/quote/${tickers.join(',')}?apikey=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getTSMCEarnings(): Promise<FMPEarnings[]> {
  if (!API_KEY) return [];
  try {
    const res = await fetch(
      `${FMP_BASE}/earnings-surprises/TSM?apikey=${API_KEY}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 8);
  } catch {
    return [];
  }
}

export async function getAnalystEstimates(symbol: string): Promise<{ epsGrowth: number }> {
  if (!API_KEY) return { epsGrowth: 25.8 };
  try {
    const res = await fetch(
      `${FMP_BASE}/analyst-estimates/${symbol}?apikey=${API_KEY}&limit=4`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return { epsGrowth: 25.8 };
    const data = await res.json();
    if (!data || data.length < 2) return { epsGrowth: 25.8 };
    const currentEps = data[0]?.estimatedEpsAvg || 1;
    const prevEps = data[1]?.estimatedEpsAvg || 1;
    const growth = ((currentEps - prevEps) / Math.abs(prevEps)) * 100;
    return { epsGrowth: growth };
  } catch {
    return { epsGrowth: 25.8 };
  }
}
