const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const API_KEY = process.env.FRED_API_KEY || '';

interface FREDObservation {
  date: string;
  value: string;
}

interface FREDResponse {
  observations: FREDObservation[];
}

export async function getFREDSeries(seriesId: string, limit = 12): Promise<FREDObservation[]> {
  if (!API_KEY) return [];
  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`FRED API error: ${res.status}`);
  const data: FREDResponse = await res.json();
  return data.observations;
}

export async function getISMPMI(): Promise<{ value: number; date: string; history: number[] }> {
  try {
    const pmiObs = await getFREDSeries('NAPM', 6);
    const valid = pmiObs.filter(o => o.value !== '.');
    return {
      value: parseFloat(valid[0]?.value || '49.3'),
      date: valid[0]?.date || '',
      history: valid.map(o => parseFloat(o.value)).reverse()
    };
  } catch {
    return { value: 49.3, date: '', history: [] };
  }
}

export async function getFedFundsRate(): Promise<{ value: number; date: string }> {
  try {
    const obs = await getFREDSeries('FEDFUNDS', 1);
    const valid = obs.filter(o => o.value !== '.');
    return {
      value: parseFloat(valid[0]?.value || '4.33'),
      date: valid[0]?.date || ''
    };
  } catch {
    return { value: 4.33, date: '' };
  }
}

export async function getYieldSpread(): Promise<{ value: number; date: string }> {
  try {
    // T10Y2Y: 10-Year Treasury minus 2-Year Treasury
    const obs = await getFREDSeries('T10Y2Y', 1);
    const valid = obs.filter(o => o.value !== '.');
    return {
      value: parseFloat(valid[0]?.value || '0.42'),
      date: valid[0]?.date || ''
    };
  } catch {
    return { value: 0.42, date: '' };
  }
}
