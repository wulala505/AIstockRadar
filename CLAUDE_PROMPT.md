# Claude Code Prompt — AIstockRadar

## Project Overview

Build a **bilingual (zh-TW / EN) investment signal tracking dashboard** deployed on GCP (Cloud Run + Firebase or Cloud Storage). The site monitors five key signals to determine when to rebalance from Taiwan Semiconductor (TSMC / 2330) growth holdings into cash-flow assets.

---

## Core Purpose

Help investors track **macro and fundamental signals** that indicate when TSMC is approaching overvaluation or when AI capex growth is decelerating — triggering a portfolio rebalance from growth stocks to dividend ETFs.

---

## Five Signals to Track

### Signal 1: AI Hyperscaler Capex
- Companies: NVDA, MSFT, GOOGL, AMZN, META
- Data: Quarterly capex (actual vs prior quarter vs YoY)
- Warning: 2+ companies downgrade capex guidance in same quarter
- Source: Earnings call data / financial APIs

### Signal 2: TSMC Advanced Node Competition
- Track: Samsung 2nm yield news, Intel 18A customer wins
- Track: TSMC advanced node revenue mix (from earnings)
- Warning: Samsung/Intel win major fabless customer from TSMC
- Source: News API + TSMC IR quarterly PDF

### Signal 3: TSMC EPS Growth Rate
- Track: Quarterly EPS (NT$), YoY growth %
- Warning: YoY growth < 15% for 2 consecutive quarters
- Source: TWSE API / financial data API

### Signal 4: P/E Ratio + PEG
- Track: TSMC current P/E (TTM), forward P/E
- Calculate: PEG = P/E ÷ analyst EPS growth estimate
- Warning: P/E > 28x OR PEG > 2
- Source: Financial data API (e.g., Alpha Vantage, Financial Modeling Prep)

### Signal 5: Macro Environment
- Track: Fed Funds Rate + CME FedWatch next-meeting probability
- Track: US ISM Manufacturing PMI (monthly)
- Track: Philadelphia Semiconductor Index (SOX) vs 200-day MA
- Track: US 10Y-2Y yield spread
- Warning: PMI < 50 for 3 months + SOX below 200MA + Fed paused
- Source: FRED API, financial data APIs

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts or Chart.js
- **i18n**: next-intl (zh-TW / EN toggle)
- **Design**: Dark theme, financial dashboard aesthetic
  - Primary: deep navy `#0a1628`
  - Accent: amber/gold `#f0ad23`
  - Signal green: `#22c55e`, yellow: `#eab308`, red: `#ef4444`

### Backend / Data Layer
- **Runtime**: Node.js on GCP Cloud Run
- **Scheduler**: GCP Cloud Scheduler (trigger data refresh)
- **Cache/DB**: Firestore (store latest signal values + history)
- **APIs to integrate**:
  - FRED API (free) → macro data
  - Financial Modeling Prep API or Alpha Vantage → TSMC P/E, EPS
  - TWSE open data API → 2330 monthly revenue
  - NewsAPI or GNews → competition news headlines
- **Environment vars**: Store API keys in GCP Secret Manager

### Deployment
- **Frontend**: Firebase Hosting or Cloud Run
- **Backend**: GCP Cloud Run (containerized with Docker)
- **CI/CD**: GitHub Actions → GCP Cloud Run deploy

---

## File Structure

```
/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # Dashboard home
│   │   ├── signals/
│   │   │   ├── capex/page.tsx
│   │   │   ├── competition/page.tsx
│   │   │   ├── eps/page.tsx
│   │   │   ├── valuation/page.tsx
│   │   │   └── macro/page.tsx
│   │   └── layout.tsx
│   └── api/
│       ├── signals/route.ts      # Aggregated signal status
│       ├── capex/route.ts
│       ├── tsmc-eps/route.ts
│       ├── valuation/route.ts
│       └── macro/route.ts
├── components/
│   ├── SignalCard.tsx             # Green/Yellow/Red status card
│   ├── SignalGauge.tsx            # Overall risk gauge
│   ├── CapexChart.tsx
│   ├── EpsChart.tsx
│   ├── MacroPanel.tsx
│   └── LanguageToggle.tsx
├── lib/
│   ├── fred.ts                   # FRED API client
│   ├── fmp.ts                    # Financial Modeling Prep client
│   ├── twse.ts                   # TWSE API client
│   ├── firestore.ts              # Firestore read/write
│   └── signals.ts                # Signal evaluation logic
├── messages/
│   ├── en.json                   # English translations
│   └── zh-TW.json                # Traditional Chinese translations
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── README.md
```

---

## Key Components to Build

### 1. Signal Status Card (`SignalCard.tsx`)
```
┌─────────────────────────────────┐
│ 🟢 AI Capex Trend               │
│ AI 資本支出趨勢                   │
│                                 │
│ NVDA: $19.3B ↑12%               │
│ MSFT: $21.4B ↑8%                │
│ GOOGL: $14.2B ↑15%              │
│                                 │
│ Status: GROWING — No Warning    │
│ 上次更新: 2025-Q1               │
└─────────────────────────────────┘
```

### 2. Overall Risk Gauge
- Composite score from all 5 signals
- 0–2 signals warning = 🟢 HOLD
- 3 signals warning = 🟡 WATCH
- 4–5 signals warning = 🔴 REBALANCE

### 3. Action Recommendation Panel
```
Based on current signals:
Current P/E: 24.3x | PEG: 0.91
Recommendation: HOLD — Growth still justified
Action: No rebalancing needed

根據目前訊號：
建議：持有 — 成長動能仍支撐估值
操作：尚無需轉換
```

---

## Signal Evaluation Logic (`lib/signals.ts`)

```typescript
export type SignalStatus = 'green' | 'yellow' | 'red';

export interface SignalResult {
  id: string;
  status: SignalStatus;
  value: number | string;
  threshold: string;
  lastUpdated: string;
  zh: string;
  en: string;
}

// P/E Signal
export function evaluatePE(pe: number): SignalStatus {
  if (pe < 25) return 'green';
  if (pe < 30) return 'yellow';
  return 'red';
}

// PEG Signal
export function evaluatePEG(peg: number): SignalStatus {
  if (peg < 1.2) return 'green';
  if (peg < 2.0) return 'yellow';
  return 'red';
}

// EPS Growth Signal
export function evaluateEPSGrowth(yoyGrowth: number): SignalStatus {
  if (yoyGrowth > 20) return 'green';
  if (yoyGrowth > 15) return 'yellow';
  return 'red';
}

// Composite Score
export function compositeSignal(signals: SignalResult[]): SignalStatus {
  const reds = signals.filter(s => s.status === 'red').length;
  const yellows = signals.filter(s => s.status === 'yellow').length;
  if (reds >= 3) return 'red';
  if (reds >= 1 || yellows >= 3) return 'yellow';
  return 'green';
}
```

---

## i18n Keys (messages/zh-TW.json excerpt)

```json
{
  "dashboard": {
    "title": "台積電再平衡訊號追蹤",
    "subtitle": "五大關鍵訊號 · 自動更新",
    "lastUpdated": "上次更新",
    "overallStatus": "整體狀態",
    "recommendation": "操作建議"
  },
  "signals": {
    "capex": {
      "title": "AI 資本支出趨勢",
      "description": "追蹤 NVDA / MSFT / GOOGL / AMZN / META 季度資本支出"
    },
    "competition": {
      "title": "先進製程競爭格局",
      "description": "三星 / 英特爾製程進展與客戶動態"
    },
    "eps": {
      "title": "台積電 EPS 成長率",
      "description": "季度 EPS YoY 成長率追蹤"
    },
    "valuation": {
      "title": "本益比 + PEG",
      "description": "台積電估值水位監控"
    },
    "macro": {
      "title": "總體環境",
      "description": "Fed 利率 · ISM PMI · SOX 指數 · 殖利率曲線"
    }
  },
  "status": {
    "green": "正常持有",
    "yellow": "注意觀察",
    "red": "準備轉換"
  },
  "actions": {
    "green": "目前無需調整，繼續持有台積電",
    "yellow": "開始關注，準備分批轉換計畫",
    "red": "觸發轉換條件，考慮將 10-15% 移轉至高息 ETF"
  }
}
```

---

## GCP Deployment Instructions

### Cloud Run Setup
```bash
# Build and push Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/aistockradar

# Deploy to Cloud Run
gcloud run deploy aistockradar \
  --image gcr.io/PROJECT_ID/aistockradar \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production"
```

### Cloud Scheduler (data refresh)
```bash
# Refresh macro data daily at 9AM Taiwan time
gcloud scheduler jobs create http refresh-macro \
  --schedule="0 9 * * *" \
  --uri="https://YOUR_CLOUD_RUN_URL/api/refresh" \
  --time-zone="Asia/Taipei"

# Refresh earnings data on earnings season dates
# (manual trigger or quarterly cron)
```

### Firestore Data Schema
```
/signals (collection)
  /latest (document)
    capex: { status, data, updatedAt }
    competition: { status, data, updatedAt }
    eps: { status, data, updatedAt }
    valuation: { status, data, updatedAt }
    macro: { status, data, updatedAt }
    composite: { status, updatedAt }

/history (collection)
  /2025-Q1 (document)
    ...same structure, archived
```

---

## Design Direction

**Aesthetic**: Dark financial terminal — think Bloomberg meets modern SaaS
- Background: deep navy with subtle grid texture
- Cards: dark glass morphism with colored left border (green/yellow/red)
- Typography: `IBM Plex Mono` for numbers, `Noto Sans TC` for Chinese body text
- Accent color: amber `#f0ad23` for highlights and CTAs
- Animations: subtle fade-in on data load, pulse on red signals
- Mobile: single column, signals stacked, gauge prominent at top

---

## Development Order

1. `lib/signals.ts` — core evaluation logic + types
2. API routes — data fetching from external APIs
3. Firestore integration — caching layer
4. `SignalCard.tsx` + `SignalGauge.tsx` — core UI components
5. Dashboard page — compose all signals
6. i18n setup — zh-TW / EN toggle
7. Docker + Cloud Run deployment
8. Cloud Scheduler setup

---

## Free APIs to Use

| Data | API | Cost |
|------|-----|------|
| FRED (PMI, yield curve, Fed rate) | api.stlouisfed.org | Free |
| TSMC financials | financialmodelingprep.com | Free tier |
| Stock price / P/E | Alpha Vantage | Free tier |
| TWSE monthly revenue | openapi.twse.com.tw | Free |
| Competition news | gnews.io or newsapi.org | Free tier |
