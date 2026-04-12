# AIstockRadar — 台積電再平衡訊號追蹤

> 五大關鍵訊號，自動判斷台積電是否進入轉換時機  
> Five signals. One dashboard. Know when to rebalance.

**Live:** https://aistockradar-235152534697.asia-east1.run.app

---

## What This Does

This dashboard tracks **five macro and fundamental signals** to help investors decide when to rebalance from TSMC (growth) into cash-flow assets (e.g., dividend ETFs).

| # | Signal | Warning Condition |
|---|--------|------------------|
| 1 | AI Hyperscaler Capex | 2+ companies downgrade capex guidance |
| 2 | Advanced Node Competition | Samsung/Intel win major TSMC customer |
| 3 | TSMC EPS YoY Growth | < 15% for 2 consecutive quarters |
| 4 | P/E + PEG Valuation | P/E > 28x OR PEG > 2.0 |
| 5 | Macro Environment | PMI < 50 + SOX below 200MA + Fed paused |

**Composite Score**
- 🟢 0–1 warnings → HOLD（繼續持有）
- 🟡 2–3 warnings → WATCH（注意觀察）
- 🔴 4–5 warnings → CONSIDER REBALANCING（準備轉換）

---

## Signal Definitions — 每區塊指標定義

### 🟩 Signal 1 — AI Hyperscaler Capex（AI 超大廠資本支出）

追蹤 NVIDIA、Microsoft、Alphabet、Amazon、Meta 五家 AI 基礎設施最大買家的季度資本支出，判斷 AI 投資動能是否持續。

| 指標 | 說明 | 資料來源 |
|------|------|----------|
| **Quarterly Capex (B USD)** | 各公司當季資本支出金額（十億美元）| 財報 / FMP API |
| **YoY Change (%)** | 與去年同期相比的資本支出成長率 | 財報計算 |
| **Guidance** | 公司對下季資本支出的指引方向（upgrade / maintain / downgrade）| 法說會紀錄 |

**判斷邏輯：**
```
全部維持或上調          → 🟢 無警示
1 家下調              → 🟡 注意觀察
2 家以上同期下調        → 🔴 警示觸發
```

**為何重要：** TSMC 的先進製程需求（N3、N2）主要由這五家公司驅動。若多家同步縮減資本支出，代表 AI 算力需求放緩，直接影響 TSMC 未來訂單。

---

### 🟩 Signal 2 — Advanced Node Competition（先進製程競爭格局）

監控三星（Samsung）與英特爾（Intel Foundry）在 2nm 以下製程的良率進展與客戶動態，評估 TSMC 護城河是否遭受威脅。

| 指標 | 說明 | 資料來源 |
|------|------|----------|
| **Samsung 2nm Yield** | 三星 2nm 製程良率狀態（是否達商業化水準）| 科技新聞 / GNews API |
| **Intel 18A Customer Wins** | Intel Foundry 18A 製程是否贏得主要外部客戶 | 科技新聞 / GNews API |
| **競爭威脅評級** | no-threat / watch / threat 三級 | 綜合分析 |

**判斷邏輯：**
```
Samsung & Intel 均無實質威脅     → 🟢 護城河穩固
任一方出現「watch」級進展       → 🟡 開始關注
任一方贏得主要 Fabless 客戶     → 🔴 市佔威脅確認
```

**為何重要：** TSMC 先進製程幾乎是 Apple、NVIDIA、AMD、Qualcomm 的唯一選擇。若競爭對手良率突破，大型客戶可能分散下單，影響 TSMC 高毛利業務。

---

### 🟩 Signal 3 — TSMC EPS Growth（台積電 EPS 成長率）

追蹤台積電每季 EPS（每股盈餘）的年增率（YoY），判斷基本面成長動能是否持續支撐高估值。

| 指標 | 說明 | 資料來源 |
|------|------|----------|
| **EPS (NT$)** | 當季每股盈餘（新台幣元）| TWSE / FMP API |
| **YoY Growth (%)** | 與去年同期 EPS 的成長百分比 | 計算得出 |
| **連續衰退季數** | 連續低於 15% 門檻的季數（需達 2 季才觸發紅燈）| 歷史資料比對 |

**判斷邏輯：**
```
YoY > 20%                     → 🟢 強勁成長
YoY 15%–20%                   → 🟡 成長放緩
YoY < 15% 連續 2 季            → 🔴 成長趨勢破壞
```

**為何重要：** TSMC 高 P/E 估值需要強勁 EPS 成長支撐。若 EPS 成長連續低於 15%，PEG 將快速惡化，估值合理性下降，是最直接的轉換訊號。

---

### 🟩 Signal 4 — P/E + PEG Valuation（本益比 + 成長股估值）

同時追蹤台積電的靜態本益比（TTM P/E）與 PEG 比率，綜合評估當前股價是否反映過度樂觀預期。

| 指標 | 說明 | 計算方式 |
|------|------|----------|
| **P/E (TTM)** | 過去 12 個月實際 EPS 的本益比 | 股價 ÷ 過去 12 月 EPS |
| **Forward P/E** | 以分析師預估 EPS 計算的預期本益比 | 股價 ÷ 預估 EPS |
| **PEG Ratio** | 將 P/E 除以 EPS 成長率，衡量成長調整後估值 | TTM P/E ÷ EPS YoY 成長率 |
| **EPS Growth Estimate (%)** | 分析師共識預估的未來 EPS 成長率 | FMP Analyst Estimates |

**判斷邏輯：**
```
P/E < 25x  且  PEG < 1.2    → 🟢 估值合理
P/E 25–30x 或  PEG 1.2–2.0  → 🟡 估值偏高，留意
P/E > 30x  或  PEG > 2.0    → 🔴 估值過高，成長溢價過大
```

> **PEG < 1** 通常被視為「成長被低估」；**PEG > 2** 代表投資人為成長支付過高溢價。

**為何重要：** 單看 P/E 容易忽略成長速度。PEG 結合成長預期，是判斷高成長股是否「貴得合理」的核心工具。

---

### 🟩 Signal 5 — Macro Environment（總體經濟環境）

整合四項宏觀指標，評估外部環境對半導體股估值的壓力程度。

| 指標 | 說明 | 資料來源 |
|------|------|----------|
| **Fed Funds Rate (%)** | 聯準會基準利率，影響成長股折現率 | FRED: `FEDFUNDS` |
| **Next Meeting Cut Prob (%)** | CME FedWatch 下次會議降息機率 | CME FedWatch / 市場利率期貨 |
| **ISM Manufacturing PMI** | 美國製造業採購經理人指數，50 以上代表擴張 | FRED: `NAPM` |
| **SOX vs 200-day MA** | 費城半導體指數（SOXX）是否在 200 日均線上方 | 市場數據 |
| **10Y–2Y Yield Spread (%)** | 美國 10 年期與 2 年期公債殖利率利差，負值代表倒掛 | FRED: `T10Y2Y` |

**判斷邏輯：**
```
PMI > 50  + SOX > 200MA  + 殖利率正常  → 🟢 宏觀環境支持
任一指標出現輕微惡化                    → 🟡 宏觀環境轉弱
PMI < 48 連續 3 月 + SOX 跌破 200MA    → 🔴 系統性風險升高
```

**為何重要：** 
- **PMI < 50**：製造業萎縮，半導體庫存循環壓力上升
- **SOX < 200MA**：市場對半導體前景悲觀，動能轉弱
- **殖利率倒掛**：歷史上衰退領先指標，壓縮成長股估值
- **Fed 暫停降息**：維持高利率環境，成長股折現率偏高

---

## Composite Score — 綜合評分邏輯

```
紅燈訊號數 × 2 + 黃燈訊號數 = 警示分數

0–1 分   → 🟢 HOLD      繼續持有台積電
2–4 分   → 🟡 WATCH     密切關注，準備轉換計畫
5+ 分    → 🔴 REBALANCE 觸發轉換，考慮移轉 10–15% 至高息 ETF
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Recharts |
| i18n | next-intl (zh-TW / EN) |
| Backend | Node.js API routes on GCP Cloud Run |
| Database | Firestore (signal cache + history) |
| Scheduler | GCP Cloud Scheduler |
| CI/CD | GitHub Actions → GCP Cloud Run |
| Hosting | GCP Cloud Run (`moose` project, `asia-east1`) |

---

## Data Sources (All Free Tier)

| Signal | API | Series / Endpoint |
|--------|-----|----------|
| Fed Rate | FRED | `FEDFUNDS` |
| ISM PMI | FRED | `NAPM` |
| Yield Spread | FRED | `T10Y2Y` |
| TSMC P/E, EPS | Financial Modeling Prep | `/quote/TSM`, `/earnings-surprises/TSM` |
| Hyperscaler Capex | Financial Modeling Prep | `/quote/NVDA,MSFT,GOOGL,AMZN,META` |
| TWSE Monthly Revenue | TWSE Open API | `openapi.twse.com.tw/v1/opendata/t187ap06_L` |
| Competition News | GNews | `gnews.io/api/v4/search` |

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/YOUR_ORG/aistockradar
cd aistockradar
npm install

# Environment setup
cp .env.example .env.local
# Fill in API keys

# Development (port 3002)
npm run dev
# → http://localhost:3002/zh-TW
```

### Required Environment Variables

```env
# Financial Data
FMP_API_KEY=your_financial_modeling_prep_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
FRED_API_KEY=your_fred_api_key

# News
GNEWS_API_KEY=your_gnews_key

# GCP
GOOGLE_CLOUD_PROJECT=moose-307301
FIRESTORE_DATABASE=aistockradar

# App
NEXT_PUBLIC_DEFAULT_LOCALE=zh-TW
CRON_SECRET=your_cron_secret_for_scheduler
```

---

## Project Structure

```
/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # Main dashboard (server component)
│   │   └── layout.tsx            # Locale layout + Google Fonts
│   └── api/
│       ├── signals/route.ts      # GET: all signals status
│       ├── refresh/route.ts      # POST: triggered by Cloud Scheduler
│       ├── capex/route.ts        # Hyperscaler capex data
│       ├── tsmc-eps/route.ts     # TSMC earnings data
│       ├── valuation/route.ts    # P/E + PEG calculation
│       └── macro/route.ts        # FRED macro indicators
├── components/
│   ├── SignalCard.tsx             # Individual signal card (green/yellow/red border)
│   ├── SignalGauge.tsx            # Composite risk gauge
│   ├── CapexChart.tsx             # Recharts BarChart — quarterly capex
│   ├── EpsChart.tsx               # Recharts LineChart — EPS growth
│   ├── MacroPanel.tsx             # 2×2 macro indicators grid
│   ├── ValuationPanel.tsx         # P/E + PEG metrics grid
│   ├── CompetitionPanel.tsx       # News headlines + competitor status
│   └── LanguageToggle.tsx         # zh-TW / EN toggle
├── lib/
│   ├── signals.ts                 # Signal evaluation logic + types
│   ├── mockData.ts                # Dev mock data (used when APIs not configured)
│   ├── fred.ts                    # FRED API client
│   ├── fmp.ts                     # Financial Modeling Prep client
│   ├── twse.ts                    # TWSE open data client
│   └── firestore.ts               # Firestore helpers (optional, graceful fallback)
├── messages/
│   ├── en.json                    # English translations
│   └── zh-TW.json                 # Traditional Chinese translations
├── Dockerfile                     # Multi-stage build → standalone output
├── .env.example
└── .github/
    └── workflows/
        └── deploy.yml             # GitHub Actions → GCP Cloud Run
```

---

## GCP Deployment (`moose` project)

### 1. Build & Deploy to Cloud Run

```bash
# Set project
gcloud config set project moose-307301

# Build image via Cloud Build
gcloud builds submit --tag gcr.io/moose-307301/aistockradar

# Deploy to Cloud Run (asia-east1)
gcloud run deploy aistockradar \
  --image gcr.io/moose-307301/aistockradar \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT=moose-307301"
```

### 2. Set Up Cloud Scheduler

```bash
# Daily macro refresh (9AM Taiwan time)
gcloud scheduler jobs create http refresh-daily \
  --schedule="0 9 * * *" \
  --uri="https://YOUR_CLOUD_RUN_URL/api/refresh?type=macro" \
  --time-zone="Asia/Taipei" \
  --location=asia-east1

# Weekly full refresh (Monday 8AM)
gcloud scheduler jobs create http refresh-weekly \
  --schedule="0 8 * * 1" \
  --uri="https://YOUR_CLOUD_RUN_URL/api/refresh?type=all" \
  --time-zone="Asia/Taipei" \
  --location=asia-east1
```

### 3. Firestore Setup

```bash
gcloud firestore databases create \
  --location=asia-east1 \
  --database=aistockradar \
  --project=moose-307301
```

---

## Firestore Schema

```
signals/
  latest/
    capex:        { status: "green"|"yellow"|"red", data: {...}, updatedAt: timestamp }
    competition:  { status, data, updatedAt }
    eps:          { status, data, updatedAt }
    valuation:    { status, data, updatedAt }
    macro:        { status, data, updatedAt }
    composite:    { status, warningCount, updatedAt }

history/
  2025-Q1/        (archived snapshots per quarter)
  2025-Q2/
```

---

## Update Frequency

| Signal | Frequency | Trigger |
|--------|-----------|---------|
| Macro (PMI, Fed, Yield) | Daily | Cloud Scheduler 09:00 CST |
| TSMC Stock P/E | Daily | Cloud Scheduler 09:00 CST |
| TSMC EPS | Quarterly | Manual or earnings date cron |
| AI Capex | Quarterly | Manual after earnings season |
| Competition News | Daily | Cloud Scheduler 09:00 CST |

---

## Contributing

This is a personal/public investment research tool.  
Data is informational only — not financial advice.

Pull requests welcome for:
- Additional signals (e.g., CoWoS capacity, HBM supply)
- New language translations
- API source alternatives
- Mobile UX improvements

---

## Disclaimer

> 本網站提供之資訊僅供參考，不構成任何投資建議或邀約。  
> This website is for informational purposes only and does not constitute financial advice.  
> Past signal accuracy does not guarantee future results.
