export interface TSMCRevenue {
  year: number;
  month: number;
  revenue: number; // in thousands NTD
  yoyChange: number;
}

export async function getTSMCRevenue(): Promise<TSMCRevenue[]> {
  try {
    // TWSE monthly revenue for stock 2330
    const res = await fetch(
      'https://openapi.twse.com.tw/v1/opendata/t187ap06_L',
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return getMockRevenue();
    const data = await res.json();
    // Filter for 2330 (TSMC)
    const tsmc = data.filter((d: Record<string, string>) => d['公司代號'] === '2330');
    if (!tsmc.length) return getMockRevenue();
    return tsmc.map((d: Record<string, string>) => ({
      year: parseInt(d['年度']),
      month: parseInt(d['月份']),
      revenue: parseInt(d['當月營收'].replace(/,/g, '')) || 0,
      yoyChange: parseFloat(d['去年同月增減(%)'] || '0')
    }));
  } catch {
    return getMockRevenue();
  }
}

function getMockRevenue(): TSMCRevenue[] {
  return [
    { year: 2025, month: 1, revenue: 868000000, yoyChange: 36.1 },
    { year: 2024, month: 12, revenue: 867900000, yoyChange: 34.9 },
    { year: 2024, month: 11, revenue: 814100000, yoyChange: 34.0 },
  ];
}
