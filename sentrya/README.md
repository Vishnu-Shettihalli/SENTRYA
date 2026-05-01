# SENTRYA — AI-Powered Fraud Prevention

An AI cybersecurity platform protecting rural banking users from social engineering and fraud in real time.

## Features

- **Scam Detection** — Paste any SMS or call transcript; Claude AI analyzes it for fraud patterns
- **Transaction Guard** — AI reviews transfer details before you send money
- **Community Fraud Check** — Crowdsourced scam number database
- **Live Alerts Feed** — Real-time threat event stream

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic Claude (claude-sonnet-4-20250514)
- Vercel (deployment)

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key at: https://console.anthropic.com/

### 3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

### Option A: One-click via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts, then add your env variable:

```bash
vercel env add ANTHROPIC_API_KEY
```

### Option B: Via GitHub + Vercel Dashboard

1. Push this repo to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: SENTRYA"
git remote add origin https://github.com/YOUR_USERNAME/sentrya.git
git push -u origin main
```

2. Go to https://vercel.com/new
3. Import your GitHub repository
4. In **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-key-here`
5. Click **Deploy**

Your app will be live at `https://sentrya.vercel.app` (or similar).

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze-scam` | POST | Analyzes message for scam patterns |
| `/api/analyze-transaction` | POST | Evaluates transaction fraud risk |

---

## Project Structure

```
sentrya/
├── app/
│   ├── layout.tsx                    # Root layout + metadata
│   ├── page.tsx                      # Main SPA with tab state
│   ├── globals.css                   # Design system + keyframes
│   └── api/
│       ├── analyze-scam/route.ts     # Scam detection endpoint
│       └── analyze-transaction/route.ts  # Transaction risk endpoint
├── components/
│   ├── Navbar.tsx                    # Sticky nav with tabs
│   ├── HeroSection.tsx               # Landing + feature cards
│   ├── ScamDetector.tsx              # Scam analysis UI
│   ├── TransactionGuard.tsx          # Transaction protection UI
│   ├── CommunityCheck.tsx            # Phone number checker
│   └── AlertsFeed.tsx                # Live alerts stream
├── lib/
│   └── anthropic.ts                  # Anthropic client singleton
├── types/
│   └── index.ts                      # TypeScript interfaces
└── .env.example                      # Environment variable template
```
