import { create } from 'zustand';
import type {
  Wallet, TokenPosition, TradeRecord, ScannerFilters,
  BotConfig, SimrealConfig, LogEntry, Signal, TabId
} from './types';

interface AppState {
  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Terminal
  wallets: Wallet[];
  xrayProtocol: boolean;
  antiMev: boolean;
  autoTakeProfit: boolean;
  masterMonitorActive: boolean;
  apiLatency: number;
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  removeWallet: (id: string) => void;
  toggleXray: () => void;
  toggleAntiMev: () => void;
  toggleAutoTp: () => void;
  toggleMasterMonitor: () => void;
  setApiLatency: (ms: number) => void;

  // Scanner / Alpha
  filters: ScannerFilters;
  updateFilter: <K extends keyof ScannerFilters>(key: K, value: ScannerFilters[K]) => void;
  resetFilters: () => void;
  scannerRunning: boolean;
  toggleScanner: () => void;

  // Bot Config
  botConfig: BotConfig;
  updateBotConfig: <K extends keyof BotConfig>(key: K, value: BotConfig[K]) => void;

  // PNL
  positions: TokenPosition[];
  tradeHistory: TradeRecord[];
  logs: LogEntry[];
  simWalletBalance: number;
  totalTrades: number;
  wins: number;
  losses: number;
  totalPnl: number;
  bestTrade: number;
  uptime: number;
  totalBuffer: number;
  failures: number;
  warnings: number;
  signalHits: number;
  coreTrades: number;
  addPosition: (pos: Omit<TokenPosition, 'id'>) => void;
  updatePosition: (id: string, updates: Partial<TokenPosition>) => void;
  removePosition: (id: string) => void;
  addTrade: (trade: Omit<TradeRecord, 'id'>) => void;
  addLog: (log: Omit<LogEntry, 'id'>) => void;
  clearLogs: () => void;
  setSimBalance: (bal: number) => void;

  // SIMREAL
  simrealConfig: SimrealConfig;
  updateSimrealConfig: <K extends keyof SimrealConfig>(key: K, value: SimrealConfig[K]) => void;
  signals: Signal[];
  addSignal: (signal: Omit<Signal, 'id'>) => void;
  updateSignal: (id: string, updates: Partial<Signal>) => void;
  simrealActive: boolean;
  toggleSimreal: () => void;
}

const defaultFilters: ScannerFilters = {
  minPumpFunCap: 5000,
  minRaydiumCap: 10000,
  maxMarketCap: 1500000,
  minLiquidity: 3000,
  minLiquidityCapRatio: 1.5,
  minBondingPercent: 10,
  maxBondingPercent: 95,
  minAgeMinutes: 0,
  maxAgeMinutes: 240,
  minLatencyMs: 0,
  maxLatencyMs: 500,
  latencyGuardActive: false,
  maxRugcheckScore: 5,
  maxDevWalletShare: 5,
  maxTop10Share: 35,
  minUniqueBuyers30s: 1,
  minProfitMomentum5m: 5,
  minBuys30s: 1,
  maxBuys30s: 1500,
  minVelratio: 2,
  maxVelratio: 5,
  maxPriceChange1m: 70,
};

const defaultBotConfig: BotConfig = {
  primaryRpc: 'https://mainnet.helius-rpc.com/',
  secondaryRpc: 'https://mainnet.helius-rpc.com/',
  customWss: 'wss://mainnet.helius-rpc.com/?api-key=',
  slippagePercent: 1,
  heliusApiKey: '',
  heliusRegion: 'Newark (EWR) - East US Edge',
  grpcFilters: ['Pump.fun Ingestion', 'Raydium Liquidity Pool'],
  dexscreenerEnabled: true,
  tradeSizeSol: 0.1,
  maxPositions: 15,
  maxRebuyTimes: 1,
  takeProfitRaydium: 5,
  takeProfitBonding: 15,
  stopLossRaydium: 20,
  stopLossBonding: 70,
  stopLossPumpswap: 59,
  stopLossUnknown: 15,
  riskLevel: 'medium',
};

const defaultSimrealConfig: SimrealConfig = {
  jupiterApiKey: 'jup_445512a0e981dbcb00b676fee041f',
  jupiterCustomRpc: 'https://mainnet.helius-rpc.com/?api-key=',
  walletPrivateKey: '',
  maxRebuyTimes: 1,
  simulationOnly: true,
  tpRaydium: 50,
  slRaydium: -15,
  tpBonding: 100,
  slBonding: -20,
  slPumpswap: -15,
  slUnknown: -20,
};

const demoPositions: TokenPosition[] = [
  {
    id: '1',
    name: 'StareCat',
    symbol: 'STARE',
    mint: 'AE6n7d3A...dYc4qPCD',
    platform: 'pumpswap',
    entryPrice: 0.00000014,
    currentPrice: null,
    amount: 712938.9323,
    valueSol: 0.1,
    pnlPercent: -59,
    stopLoss: -59,
    takeProfit: 50,
    buyTime: new Date(Date.now() - 3600000),
    status: 'migrating',
    isExciting: false,
  },
  {
    id: '2',
    name: 'MELON',
    symbol: 'MELON',
    mint: 'HK3J9zTF...6GBuKHrT',
    platform: 'pumpswap',
    entryPrice: 0.00000215,
    currentPrice: null,
    amount: 46420.6964,
    valueSol: 0.1,
    pnlPercent: -59,
    stopLoss: -59,
    takeProfit: 50,
    buyTime: new Date(Date.now() - 3500000),
    status: 'migrating',
    isExciting: false,
  },
  {
    id: '3',
    name: 'Agamemnon',
    symbol: 'AGAM',
    mint: 'hnu5iBK8...Tf9T1CYN',
    platform: 'pumpswap',
    entryPrice: 0.00000150,
    currentPrice: null,
    amount: 66572.1491,
    valueSol: 0.1,
    pnlPercent: -15,
    stopLoss: -15,
    takeProfit: 50,
    buyTime: new Date(Date.now() - 300000),
    status: 'migrating',
    isExciting: false,
  },
  {
    id: '4',
    name: 'Cricket',
    symbol: 'CRICK',
    mint: 'J33WbC...k3pump',
    platform: 'pumpswap',
    entryPrice: 0.00000120,
    currentPrice: 0.00000125,
    amount: 38627.7457,
    valueSol: 0.1,
    pnlPercent: 4.2,
    stopLoss: -15,
    takeProfit: 50,
    buyTime: new Date(Date.now() - 600000),
    status: 'active',
    isExciting: true,
  },
  {
    id: '5',
    name: 'SWOLEDOGE',
    symbol: 'SWOLE',
    mint: '9AwZKi...So1111',
    platform: 'pumpswap',
    entryPrice: 0.00000150,
    currentPrice: null,
    amount: 66572.1491,
    valueSol: 0.1,
    pnlPercent: 0,
    stopLoss: -15,
    takeProfit: 50,
    buyTime: new Date(Date.now() - 120000),
    status: 'migrating',
    isExciting: false,
  },
];

const demoTrades: TradeRecord[] = [
  { id: '1', tokenAddress: '98KqVY...Cmpump', tokenName: 'Token1', buyTime: new Date(Date.now() - 7200000), sellTime: new Date(Date.now() - 7100000), holdTimeSeconds: 93, buySol: 0.1, sellSol: 0.1020, profitSol: 0.0020, pnlPercent: 2.04, platform: 'pumpfun' },
  { id: '2', tokenAddress: 'Cnm8Pa...TKpump', tokenName: 'Token2', buyTime: new Date(Date.now() - 8000000), sellTime: new Date(Date.now() - 7700000), holdTimeSeconds: 2337, buySol: 0.1, sellSol: 0.1048, profitSol: 0.0048, pnlPercent: 4.76, platform: 'pumpfun' },
  { id: '3', tokenAddress: 'J33WbC...k3pump', tokenName: 'Cricket', buyTime: new Date(Date.now() - 7500000), sellTime: new Date(Date.now() - 5500000), holdTimeSeconds: 1976, buySol: 0.1, sellSol: 0.1257, profitSol: 0.0257, pnlPercent: 25.65, platform: 'pumpfun' },
  { id: '4', tokenAddress: 'FgdpA3...3Qpump', tokenName: 'Token4', buyTime: new Date(Date.now() - 7800000), sellTime: new Date(Date.now() - 7100000), holdTimeSeconds: 688, buySol: 0.1, sellSol: 0.1041, profitSol: 0.0041, pnlPercent: 4.10, platform: 'pumpfun' },
  { id: '5', tokenAddress: '7nE4LS...bCpump', tokenName: 'Token5', buyTime: new Date(Date.now() - 7900000), sellTime: new Date(Date.now() - 7500000), holdTimeSeconds: 386, buySol: 0.1, sellSol: 0.1013, profitSol: 0.0013, pnlPercent: 1.28, platform: 'pumpfun' },
  { id: '6', tokenAddress: 'Qs3Zkx...RZpump', tokenName: 'Token6', buyTime: new Date(Date.now() - 7600000), sellTime: new Date(Date.now() - 6500000), holdTimeSeconds: 103, buySol: 0.1, sellSol: 0.1108, profitSol: 0.0108, pnlPercent: 10.77, platform: 'pumpfun' },
  { id: '7', tokenAddress: 'simHC3...V0pump', tokenName: 'Token7', buyTime: new Date(Date.now() - 7900000), sellTime: new Date(Date.now() - 7600000), holdTimeSeconds: 221, buySol: 0.1, sellSol: 0.0774, profitSol: -0.0226, pnlPercent: -22.63, platform: 'pumpfun' },
  { id: '8', tokenAddress: 'bsfUxD...iapump', tokenName: 'Token8', buyTime: new Date(Date.now() - 7800000), sellTime: new Date(Date.now() - 7500000), holdTimeSeconds: 277, buySol: 0.1, sellSol: 0.1014, profitSol: 0.0014, pnlPercent: 1.36, platform: 'pumpfun' },
  { id: '9', tokenAddress: 'simSZ3...V6WDV0', tokenName: 'Token9', buyTime: new Date(Date.now() - 7700000), sellTime: new Date(Date.now() - 7600000), holdTimeSeconds: 55, buySol: 0.1, sellSol: 0.1012, profitSol: 0.0012, pnlPercent: 1.24, platform: 'simreal' },
  { id: '10', tokenAddress: 'sim34X...8PWDV0', tokenName: 'Token10', buyTime: new Date(Date.now() - 7800000), sellTime: new Date(Date.now() - 7700000), holdTimeSeconds: 79, buySol: 0.1, sellSol: 0.1119, profitSol: 0.0119, pnlPercent: 11.88, platform: 'simreal' },
  { id: '11', tokenAddress: 'simROR...0QWDV0', tokenName: 'Token11', buyTime: new Date(Date.now() - 7700000), sellTime: new Date(Date.now() - 7600000), holdTimeSeconds: 21, buySol: 0.1, sellSol: 11.2601, profitSol: 11.1601, pnlPercent: 11160.10, platform: 'simreal' },
  { id: '12', tokenAddress: 'bsfUxD...iapump', tokenName: 'Token12', buyTime: new Date(Date.now() - 8000000), sellTime: new Date(Date.now() - 7700000), holdTimeSeconds: 263, buySol: 0.1, sellSol: 0.1166, profitSol: 0.0166, pnlPercent: 16.58, platform: 'pumpfun' },
  { id: '13', tokenAddress: '7nE4LS...bCpump', tokenName: 'Token13', buyTime: new Date(Date.now() - 8100000), sellTime: new Date(Date.now() - 7900000), holdTimeSeconds: 69, buySol: 0.1, sellSol: 0.1069, profitSol: 0.0069, pnlPercent: 6.91, platform: 'pumpfun' },
  { id: '14', tokenAddress: 'Cnm8Pa...TKpump', tokenName: 'Token14', buyTime: new Date(Date.now() - 8200000), sellTime: new Date(Date.now() - 7900000), holdTimeSeconds: 137, buySol: 0.1, sellSol: 0.0770, profitSol: -0.0230, pnlPercent: -23.04, platform: 'pumpfun' },
  { id: '15', tokenAddress: '98KqVY...Cmpump', tokenName: 'Token15', buyTime: new Date(Date.now() - 8300000), sellTime: new Date(Date.now() - 8000000), holdTimeSeconds: 277, buySol: 0.1, sellSol: 0.0771, profitSol: -0.0229, pnlPercent: -22.90, platform: 'pumpfun' },
  { id: '16', tokenAddress: 'J33WbC...k3pump', tokenName: 'Cricket2', buyTime: new Date(Date.now() - 8400000), sellTime: new Date(Date.now() - 8300000), holdTimeSeconds: 32, buySol: 0.1, sellSol: 0.1020, profitSol: 0.0020, pnlPercent: 2.04, platform: 'pumpfun' },
];

const demoLogs: LogEntry[] = [
  { id: '1', timestamp: new Date(Date.now() - 300000), category: 'system', level: 'info', message: 'Scanner initialized. Filters loaded.', details: {} },
  { id: '2', timestamp: new Date(Date.now() - 290000), category: 'scanner', level: 'success', message: 'New token detected: StareCat (AE6n7d3A...)', details: { marketCap: 8500, liquidity: 3200 } },
  { id: '3', timestamp: new Date(Date.now() - 280000), category: 'trade', level: 'success', message: 'BUY executed: 0.1 SOL → 712,938.93 StareCat', details: { tx: '5xK9...', price: 0.00000014 } },
  { id: '4', timestamp: new Date(Date.now() - 270000), category: 'scanner', level: 'success', message: 'New token detected: MELON (HK3J9zTF...)', details: { marketCap: 12000, liquidity: 4500 } },
  { id: '5', timestamp: new Date(Date.now() - 260000), category: 'trade', level: 'success', message: 'BUY executed: 0.1 SOL → 46,420.70 MELON', details: { tx: '8mN2...', price: 0.00000215 } },
  { id: '6', timestamp: new Date(Date.now() - 200000), category: 'risk', level: 'warning', message: 'Ownership %: 203.9% vs Req: <= 95.0% | Bonding Curve Progress: 0.0% vs Req: 10%-95%', details: {} },
  { id: '7', timestamp: new Date(Date.now() - 190000), category: 'system', level: 'info', message: 'MANDATORY FAILURE: Pump.fun bonding progress 0.0% is outside required limits (10%-95%).', details: {} },
  { id: '8', timestamp: new Date(Date.now() - 150000), category: 'dexscreener', level: 'success', message: 'Synced 6 premium feeds. 1,247 tokens indexed.', details: {} },
  { id: '9', timestamp: new Date(Date.now() - 120000), category: 'trade', level: 'warning', message: 'Position StareCat: STALE (Gaping). Price feed delayed >30s.', details: {} },
  { id: '10', timestamp: new Date(Date.now() - 60000), category: 'system', level: 'info', message: 'API Health: 188ms. Jupiter router responsive.', details: {} },
];

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'terminal',
  setActiveTab: (tab) => set({ activeTab: tab }),

  wallets: [
    { id: '1', address: 'AE6n7d3A...dYc4qPCD', label: 'محفظة 23', balance: 2.34, isMonitored: true },
    { id: '2', address: 'HK3J9zTF...6GBuKHrT', label: 'محفظة 49', balance: 5.67, isMonitored: true },
    { id: '3', address: 'hnu5iBK8...Tf9T1CYN', label: 'محفظة 86', balance: 1.23, isMonitored: true },
  ],
  xrayProtocol: true,
  antiMev: true,
  autoTakeProfit: true,
  masterMonitorActive: false,
  apiLatency: 42,
  addWallet: (wallet) => set((s) => ({ wallets: [...s.wallets, { ...wallet, id: crypto.randomUUID() }] })),
  removeWallet: (id) => set((s) => ({ wallets: s.wallets.filter((w) => w.id !== id) })),
  toggleXray: () => set((s) => ({ xrayProtocol: !s.xrayProtocol })),
  toggleAntiMev: () => set((s) => ({ antiMev: !s.antiMev })),
  toggleAutoTp: () => set((s) => ({ autoTakeProfit: !s.autoTakeProfit })),
  toggleMasterMonitor: () => set((s) => ({ masterMonitorActive: !s.masterMonitorActive })),
  setApiLatency: (ms) => set({ apiLatency: ms }),

  filters: defaultFilters,
  updateFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: defaultFilters }),
  scannerRunning: false,
  toggleScanner: () => set((s) => ({ scannerRunning: !s.scannerRunning })),

  botConfig: defaultBotConfig,
  updateBotConfig: (key, value) => set((s) => ({ botConfig: { ...s.botConfig, [key]: value } })),

  positions: demoPositions,
  tradeHistory: demoTrades,
  logs: demoLogs,
  simWalletBalance: 8.8661,
  totalTrades: 16,
  wins: 13,
  losses: 3,
  totalPnl: 0.07,
  bestTrade: 23.3,
  uptime: 153746,
  totalBuffer: 539,
  failures: 0,
  warnings: 155,
  signalHits: 181,
  coreTrades: 46,
  addPosition: (pos) => set((s) => ({ positions: [...s.positions, { ...pos, id: crypto.randomUUID() }] })),
  updatePosition: (id, updates) => set((s) => ({
    positions: s.positions.map((p) => p.id === id ? { ...p, ...updates } : p),
  })),
  removePosition: (id) => set((s) => ({ positions: s.positions.filter((p) => p.id !== id) })),
  addTrade: (trade) => set((s) => ({ tradeHistory: [trade, ...s.tradeHistory] })),
  addLog: (log) => set((s) => ({ logs: [{ ...log, id: crypto.randomUUID() }, ...s.logs].slice(0, 1000) })),
  clearLogs: () => set({ logs: [] }),
  setSimBalance: (bal) => set({ simWalletBalance: bal }),

  simrealConfig: defaultSimrealConfig,
  updateSimrealConfig: (key, value) => set((s) => ({ simrealConfig: { ...s.simrealConfig, [key]: value } })),
  signals: [],
  addSignal: (signal) => set((s) => ({ signals: [...s.signals, { ...signal, id: crypto.randomUUID() }] })),
  updateSignal: (id, updates) => set((s) => ({
    signals: s.signals.map((sig) => sig.id === id ? { ...sig, ...updates } : sig),
  })),
  simrealActive: false,
  toggleSimreal: () => set((s) => ({ simrealActive: !s.simrealActive })),
}));
