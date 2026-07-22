import { useState } from 'react';
import { useAppStore } from '../store';
import { formatSol, formatTime, formatHoldTime, formatDuration } from '../utils';
import {
  Terminal, BarChart3, Radio, Target, Search, Filter,
  Pause, ArrowUpDown, Trash2, Download, ChevronDown, ChevronUp,
  Brain, Globe, Zap
} from 'lucide-react';

type PnlSubTab = 'console' | 'diags' | 'telemetry' | 'prospects' | 'ai' | 'hosting';

export default function PnlTab() {
  const [subTab, setSubTab] = useState<PnlSubTab>('console');
  const [logFilter, setLogFilter] = useState('all');
  const [logLevel, setLogLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    positions, tradeHistory, logs, simWalletBalance,
    totalTrades, wins, losses, totalPnl, bestTrade, uptime,
    totalBuffer, failures, warnings, signalHits, coreTrades,
    clearLogs, removePosition,
  } = useAppStore();

  const activeCount = positions.filter((p) => p.status === 'active' || p.status === 'migrating').length;
  const excitingCount = positions.filter((p) => p.isExciting).length;

  const filteredLogs = logs.filter((log) => {
    if (logFilter !== 'all' && log.category !== logFilter) return false;
    if (logLevel !== 'all' && log.level !== logLevel) return false;
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const subTabs: { id: PnlSubTab; label: string; icon: React.ElementType }[] = [
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'diags', label: 'Diags', icon: BarChart3 },
    { id: 'telemetry', label: 'Telemetry', icon: Radio },
    { id: 'prospects', label: 'Prospects', icon: Target },
    { id: 'ai', label: 'A.I. Advisor', icon: Brain },
    { id: 'hosting', label: 'Hosting', icon: Globe },
  ];

  return (
    <div className="animate-fade-in">
      {/* Sim Wallet Balance */}
      <div className="p-4">
        <div className="card-elevated p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="badge badge-yellow text-[10px]">ACTIVE</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-amber-400">{simWalletBalance.toFixed(4)}</span>
            <span className="text-lg text-amber-500/70 font-medium">SOL</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Simulation mode active. Live feedback during trades.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 space-y-3">
        <StatRow label="Total Trades" value={totalTrades.toString()} />
        <StatRow label="Wins / Losses" value={`${wins} / ${losses}`} />
        <StatRow
          label="Total P&L"
          value={`${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)} SOL`}
          valueClass={totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}
        />
        <StatRow label="Best Trade" value={`+${bestTrade.toFixed(1)}%`} valueClass="text-emerald-400" />
        <StatRow label="Uptime" value={formatDuration(uptime)} />
      </div>

      {/* Sub Tabs */}
      <div className="px-4 mt-6">
        <div className="flex flex-wrap gap-2">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Console View */}
      {subTab === 'console' && (
        <div className="p-4 space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Total Buffer" value={`${totalBuffer} / 1000`} />
            <MetricCard label="Failures" value={`${failures} (0%)`} valueClass="text-red-400" />
            <MetricCard label="Warnings" value={warnings.toString()} valueClass="text-amber-400" />
            <MetricCard label="Signal Hits" value={signalHits.toString()} valueClass="text-emerald-400" />
          </div>
          <MetricCard label="Core Trades" value={coreTrades.toString()} valueClass="text-emerald-400" fullWidth />

          {/* Log Controls */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Search live logs (terms, symbols...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => {}} className="btn-ghost text-xs flex items-center gap-1">
                <Pause size={12} /> Freeze
              </button>
              <button onClick={() => {}} className="btn-ghost text-xs flex items-center gap-1">
                <ArrowUpDown size={12} /> Newest
              </button>
              <button onClick={clearLogs} className="btn-ghost text-xs flex items-center gap-1">
                <Trash2 size={12} /> Clear
              </button>
              <button onClick={() => {}} className="btn-ghost text-xs flex items-center gap-1">
                <Download size={12} /> Export
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5">
              {['all', 'scanner', 'trade', 'risk', 'dexscreener', 'wallet', 'system'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLogFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider transition-all ${
                    logFilter === cat
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Level Filters */}
            <div className="flex flex-wrap gap-1.5">
              {['all', 'success', 'info', 'warning', 'error'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogLevel(lvl)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider transition-all ${
                    logLevel === lvl
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Log Entries */}
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
            {filteredLogs.map((log) => (
              <div key={log.id} className="log-entry">
                <div className="flex items-start gap-2">
                  <span className="text-slate-600 shrink-0">[{formatTime(log.timestamp)}]</span>
                  <span className={`uppercase px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    log.category === 'system' ? 'bg-slate-700 text-slate-300' :
                    log.category === 'scanner' ? 'bg-cyan-500/15 text-cyan-400' :
                    log.category === 'trade' ? 'bg-purple-500/15 text-purple-400' :
                    log.category === 'risk' ? 'bg-red-500/15 text-red-400' :
                    'bg-amber-500/15 text-amber-400'
                  }`}>
                    {log.category.slice(0, 3)}
                  </span>
                  <span className={`${
                    log.level === 'success' ? 'log-success' :
                    log.level === 'warning' ? 'log-warning' :
                    log.level === 'error' ? 'log-error' :
                    'log-info'
                  }`}>
                    {log.message}
                  </span>
                </div>
                {log.details && Object.keys(log.details).length > 0 && (
                  <pre className="mt-1 ml-20 text-[10px] text-slate-600 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diags View - Active Positions */}
      {subTab === 'diags' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300">
              Active Positions ({activeCount}/{positions.length})
            </h3>
            {excitingCount > 0 && (
              <span className="badge badge-green text-[10px]">↗ {excitingCount} Exciting Tokens</span>
            )}
          </div>

          <div className="space-y-3">
            {positions.map((pos) => (
              <div key={pos.id} className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                      {pos.name[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-white">{pos.name}</span>
                      <div className="flex gap-1.5 mt-0.5">
                        <span className="badge badge-blue text-[10px]">{pos.platform.toUpperCase()}</span>
                        <span className="badge badge-red text-[10px]">SL: {pos.stopLoss}%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removePosition(pos.id)}
                    className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {pos.status === 'migrating' && (
                  <div className="text-center py-2">
                    <p className="text-amber-400 font-mono text-sm tracking-widest animate-pulse">MIGRATING...</p>
                    <p className="text-xs text-slate-500">On-Chain Price Processing</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Entry Price</p>
                    <p className="text-sm font-mono text-white">{formatSol(pos.entryPrice)} SOL</p>
                    <p className="text-[10px] text-slate-600">
                      {pos.amount.toLocaleString()} tokens for {pos.valueSol.toFixed(4)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Current</p>
                    {pos.currentPrice ? (
                      <p className="text-sm font-mono text-white">{formatSol(pos.currentPrice)} SOL</p>
                    ) : (
                      <div>
                        <p className="text-sm font-mono text-amber-400">STALE</p>
                        <p className="text-[10px] text-amber-500/70">(Gaping)</p>
                      </div>
                    )}
                    {pos.status === 'force_exit' && (
                      <span className="badge badge-red text-[10px] mt-1">EMERGENCY FORCE EXIT</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Buy: {formatTime(pos.buyTime)}</span>
                  <button className="text-slate-500 hover:text-slate-300 flex items-center gap-1">
                    DEXSCREENER <Search size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade History */}
      {subTab === 'telemetry' && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Trade History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="text-left py-2 font-medium">Token</th>
                  <th className="text-left py-2 font-medium">Buy</th>
                  <th className="text-left py-2 font-medium">Hold</th>
                  <th className="text-right py-2 font-medium">Buy SOL</th>
                  <th className="text-right py-2 font-medium">Sell SOL</th>
                  <th className="text-right py-2 font-medium">Profit</th>
                  <th className="text-right py-2 font-medium">PnL %</th>
                </tr>
              </thead>
              <tbody>
                {tradeHistory.map((trade) => (
                  <tr key={trade.id} className="border-b border-slate-800/50 hover:bg-slate-900/50">
                    <td className="py-2 font-mono text-slate-400">{shortenAddr(trade.tokenAddress)}</td>
                    <td className="py-2 text-slate-400">{formatTime(trade.buyTime)}</td>
                    <td className="py-2 text-slate-400">{formatHoldTime(trade.holdTimeSeconds)}</td>
                    <td className="py-2 text-right font-mono text-slate-400">{trade.buySol.toFixed(4)}</td>
                    <td className="py-2 text-right font-mono text-slate-400">
                      {trade.sellSol ? trade.sellSol.toFixed(4) : '-'}
                    </td>
                    <td className={`py-2 text-right font-mono ${trade.profitSol >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.profitSol >= 0 ? '+' : ''}{trade.profitSol.toFixed(4)} SOL
                    </td>
                    <td className={`py-2 text-right font-mono ${trade.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prospects */}
      {subTab === 'prospects' && (
        <div className="p-4 space-y-4">
          <div className="card p-4 text-center">
            <Target size={32} className="mx-auto text-slate-600 mb-2" />
            <p className="text-sm text-slate-400">No prospects matched current filters.</p>
            <p className="text-xs text-slate-600 mt-1">Adjust scanner thresholds to discover opportunities.</p>
          </div>
        </div>
      )}

      {/* AI Advisor */}
      {subTab === 'ai' && (
        <div className="p-4 space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-purple-400" />
              <h3 className="text-sm font-semibold text-slate-300">A.I. Advisor</h3>
            </div>
            <div className="space-y-3 text-xs text-slate-400">
              <p>• Current win rate: <span className="text-emerald-400">{(wins / totalTrades * 100).toFixed(1)}%</span> over {totalTrades} trades</p>
              <p>• Average hold time: <span className="text-slate-300">4m 32s</span></p>
              <p>• Best performing platform: <span className="text-slate-300">Pump.fun</span></p>
              <p>• Risk-adjusted return: <span className="text-amber-400">Medium</span></p>
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="text-slate-300 font-medium mb-1">Recommendation:</p>
                <p>Consider lowering max bonding curve to 85% to avoid late-stage entries. Increase min liquidity to $5K for better exit liquidity.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hosting */}
      {subTab === 'hosting' && (
        <div className="p-4 space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={18} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Infrastructure</h3>
            </div>
            <div className="space-y-2 text-xs">
              <StatRow label="Region" value="US-East (N. Virginia)" />
              <StatRow label="Latency" value="42ms avg" />
              <StatRow label="Uptime" value="99.97%" />
              <StatRow label="Last Deploy" value="2h ago" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, valueClass = 'text-white' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-mono font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function MetricCard({ label, value, valueClass = 'text-white', fullWidth = false }: {
  label: string; value: string; valueClass?: string; fullWidth?: boolean;
}) {
  return (
    <div className={`card p-3 ${fullWidth ? 'col-span-2' : ''}`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono ${valueClass}`}>{value}</p>
    </div>
  );
}

function shortenAddr(addr: string): string {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
}
