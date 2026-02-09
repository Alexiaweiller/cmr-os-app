# CMR.AI — Startup OS

Internal operating system for CMR.AI. 9 modules: Command Center, Product Hub, Investor & Raise, Addressable Market, Client Pipeline, Financials, Legal, Task Tracker, HR & People.

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to Vercel (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com), sign in with GitHub
3. Click "Import Project" → select this repo
4. Click "Deploy"

Live URL provided instantly. Auto-deploys on every `git push`.

## Tech Stack

- React 18 + Vite
- Recharts for data visualization
- localStorage for data persistence
- Zero backend — runs entirely in the browser
