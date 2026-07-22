import { useState } from 'react';
import { useAppStore } from '../store';
import { FlaskConical, Play, Pause, RotateCcw, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface BacktestResult {
  strategy: string;
  period: string;
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  totalReturn: number;
}

const mockResults: BacktestResult[] = [
  {
    strategy: 'Momentum Scanner v2',
    period: 'Last 7 Days',
    totalTrades: 142,
    winRate: 68.3,
    avgReturn: 12.4,
    maxDrawdown: -23.1,
    sharpeRatio: 1.82,
    profitFactor: 2.14,
    totalReturn: 34.2,
  },
  {
    strategy: 'Conservative Filter',
    period: 'Last 7 Days',
    totalTrades: 89,
    winRate: 74.2,
    avgReturn: 8.7,
    maxDrawdown: -14.5,
    sharpeRatio: 2.34,
    profitFactor: 2.89,
    totalReturn: 28.6,
  },
  {
    strategy: 'Aggressive Entry',
    period: 'Last 7 Days',
    totalTrades: 234,
    winRate: 52.1,
    avgReturn: 18.9,
    maxDrawdown: -41.2,
    sharpeRatio: 1.12,
    profitFactor: 1.67,
    totalReturn: 42.8,
  },
];

export default function TestTab() {
  const [selectedStrategy, setSelectedStrategy] = useState('momentum');
  const [testPeriod, setTestPeriod] = useState('7d');
  const [isRunning, setIsRunning] = useState(false);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  const runBacktest = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FlaskConical size={20} className="text-purple-400" />
        <h1 className="text-lg font-semibold text-slate-200">STRATEGY TESTER</h1>
      </div>

      {/* Strategy Selector */}
      <div className="card p-4 space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Strategy</label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="w-full"
          >
            <option value="momentum">Momentum Scanner v2</option>
            <option value="conservative">Conservative Filter</option>
            <option value="aggressive">Aggressive Entry</option>
            <option value="custom">Custom Strategy</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Test Period</label>
          <div className="flex gap-2">
            {[
              { value: '24h', label: '24H' },
              { value: '7d', label: '7D' },
              { value: '30d', label: '30D' },
              { value: '90d', label: '90D' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setTestPeriod(p.value)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                  testPeriod === p.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={runBacktest}
            disabled={isRunning}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isRunning ? <Pause size={16} className="animate-pulse" /> : <Play size={16} />}
            {isRunning ? 'RUNNING...' : 'RUN BACKTEST'}
          </button>
          <button className="btn-ghost flex items-center justify-center gap-2">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Live Progress */}
      {isRunning && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Processing historical data...</span>
            <span className="text-xs text-purple-400 font-mono">67%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-pulse" style={{ width: '67%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 font-mono">
            <span>Analyzing 14,203 tokens</span>
            <span>ETA: 1.2s</span>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300">Backtest Results</h3>
          <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300">
            <Download size={12} /> Export CSV
          </button>
        </div>

        {mockResults.map((result, idx) => (
          <div
            key={idx}
            className="card overflow-hidden transition-all"
          >
            <button
              onClick={() => setExpandedResult(expandedResult === idx ? null : idx)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{result.strategy}</p>
                <p className="text-xs text-slate-500">{result.period}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold font-mono ${result.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.totalReturn >= 0 ? '+' : ''}{result.totalReturn}%
                </span>
                {expandedResult === idx ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
              </div>
            </button>

            {expandedResult === idx && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-800/50 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <ResultMetric label="Total Trades" value={result.totalTrades.toString()} />
                  <ResultMetric label="Win Rate" value={`${result.winRate}%`} valueClass="text-emerald-400" />
                  <ResultMetric label="Avg Return" value={`${result.avgReturn}%`} />
                  <ResultMetric label="Max Drawdown" value={`${result.maxDrawdown}%`} valueClass="text-red-400" />
                  <ResultMetric label="Sharpe Ratio" value={result.sharpeRatio.toFixed(2)} />
                  <ResultMetric label="Profit Factor" value={result.profitFactor.toFixed(2)} />
                </div>

                {/* Equity Curve Placeholder */}
                <div className="h-24 bg-slate-800/50 rounded-lg flex items-end justify-between px-2 pb-2 gap-0.5">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const h = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 40;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-emerald-500/40 rounded-t"
                        style={{ height: `${Math.min(h, 90)}%` }}
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-600 text-center">Equity Curve (Simulated)</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strategy Parameters */}
      <div className="card p-4 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Strategy Parameters</h3>

        <div className="space-y-3">
          <ParamSlider label="Entry Confidence" value={75} min={0} max={100} unit="%" />
          <ParamSlider label="Position Size" value={10} min={1} max={50} unit="%" />
          <ParamSlider label="Stop Loss" value={15} min={5} max={50} unit="%" />
          <ParamSlider label="Take Profit" value={50} min={10} max={200} unit="%" />
          <ParamSlider label="Max Slippage" value={1} min={0.1} max={5} unit="%" step={0.1} />
        </div>
      </div>
    </div>
  );
}

function ResultMetric({ label, value, valueClass = 'text-white' }: {
  label: string; value: string; valueClass?: string;
}) {
  return (
    <div className="card p-2.5">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-bold font-mono ${valueClass}`}>{value}</p>
    </div>
  );
}

function ParamSlider({ label, value, min, max, unit, step = 1 }: {
  label: string; value: number; min: number; max: number; unit: string; step?: number;
}) {
  const [val, setVal] = useState(value);
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-xs text-slate-400">{label}</label>
        <span className="text-xs text-neon-purple font-mono">{val}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
