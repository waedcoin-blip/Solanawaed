# JUPITER.AUTO — Solana Trading Terminal

A comprehensive Solana trading web application featuring paper trading (SIMREAL), live wallet monitoring, advanced token scanning with 20+ filters, P&L tracking, and strategy backtesting. Built with React 18, TypeScript, Tailwind CSS, and Zustand state management.

![Platform](https://img.shields.io/badge/Solana-Blockchain-9945FF?logo=solana)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## Features

### 5 Trading Tabs

| Tab | Features |
|-----|----------|
| **TERMINAL** | Wallet management (add/remove/monitor), X-Ray Protocol toggle, Anti-MEV protection, Auto Take-Profit, Master Monitor engagement |
| **ALPHA** | 20+ scanner filters: Market Cap limits, Liquidity & Depth Protection, Pump.fun Bonding Curve, Security & Anti-Rug thresholds, Momentum & Velocity Gates, Activity/Spike filters |
| **PNL** | Sim wallet balance, Win/Loss stats, Trade history table, Live console logs with filtering, Active positions with emergency exit, A.I. Advisor, Infrastructure monitoring |
| **SIMREAL** | Jupiter API integration, Direct independent swap execution, Auto-sell limits per platform (Raydium/Bonding/Pumpswap), Cross-page buy signals pipeline, On-chain credentials management |
| **TEST** | Strategy backtesting with equity curves, Sharpe ratio analysis, Profit factor calculation, Parameter optimization sliders |

### Key Capabilities

- **Real-time Monitoring**: Live API latency tracking, position status updates, log streaming
- **Risk Management**: Per-platform stop losses, take profits, max position limits, rugcheck integration
- **Paper Trading**: Full simulation mode with virtual SOL balance, trade history, P&L tracking
- **Signal Pipeline**: Cross-page signal bridge between PnL and SimReal for automated copy trading
- **Mobile-First**: Responsive design optimized for mobile trading with bottom navigation

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Solana wallet with devnet SOL for testing

### Installation

```bash
# Clone or extract the project
cd solana-trader

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Static files will be output to `dist/` directory.

### Deploy to Render (Free)

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect your GitHub repo
4. Set build command: `npm install && npm run build`
5. Set publish directory: `dist`
6. Deploy!

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## Configuration

### Jupiter API

1. Get a free Jupiter API key from [Jupiter Station](https://station.jup.ag/)
2. Enter it in the SIMREAL tab under "Jupiter API Key"
3. Add your Helius RPC URL for reliable transaction submission

### RPC Endpoints

Default configuration uses Helius RPC. For production:

```typescript
// Primary RPC (required)
https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

// Secondary RPC (fallback)
https://rpc.ankr.com/solana/YOUR_KEY
```

### Wallet Setup

For live trading (not simulation):

1. Export your wallet private key in Base58 format
2. Paste into SIMREAL tab "Wallet Private Key" field
3. Toggle off "Simulation Only" mode
4. **WARNING**: Never share private keys. Use a dedicated trading wallet with limited funds.

## Architecture

```
src/
├── components/
│   ├── BottomNav.tsx      # Tab navigation
│   ├── StatusBar.tsx      # Live status footer
│   ├── TerminalTab.tsx    # Wallet & monitor controls
│   ├── AlphaTab.tsx       # Scanner filters
│   ├── PnlTab.tsx         # Portfolio & logs
│   ├── SimrealTab.tsx     # Paper trading & swaps
│   └── TestTab.tsx        # Backtesting
├── store.ts               # Zustand global state
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   └── index.ts           # Formatting helpers
├── App.tsx                # Root component
├── main.tsx               # Entry point
└── index.css              # Tailwind + custom styles
```

## State Management

Uses Zustand for lightweight global state:

- **Wallets**: Monitored wallet addresses with labels
- **Positions**: Active token positions with entry/exit data
- **Trades**: Historical trade records
- **Logs**: Real-time system logs with filtering
- **Signals**: Cross-page trading signals
- **Config**: Scanner filters, bot config, SIMREAL settings

## Security Notes

1. **Private keys** are stored in memory only (not persisted)
2. **Simulation mode** is enabled by default — no real trades execute
3. **Anti-MEV** uses Jito bundle simulation
4. **Rugcheck integration** filters high-risk tokens
5. **Latency guard** prevents execution during RPC degradation

## Customization

### Adding New Filters

Edit `src/store.ts` — add fields to `ScannerFilters` interface and `defaultFilters` object.

### Adding New Tabs

1. Add tab ID to `TabId` type in `src/types/index.ts`
2. Create component in `src/components/`
3. Register in `src/App.tsx` and `src/components/BottomNav.tsx`

### Styling

Uses Tailwind CSS with custom design tokens:

- `card` — Standard panel background
- `card-elevated` — Prominent panel with shadow
- `btn-primary` — Purple gradient action button
- `btn-success` — Green gradient action button
- `badge-*` — Status indicators

## License

MIT — Use at your own risk. Trading cryptocurrencies carries significant risk of loss.

## Disclaimer

This software is for educational purposes. Always verify trades before execution. The authors are not responsible for any financial losses incurred through use of this application.
