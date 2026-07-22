import { useAppStore } from '../store';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

export default function AlphaTab() {
  const { filters, updateFilter, resetFilters, scannerRunning, toggleScanner } = useAppStore();

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mt-6 mb-3">{children}</h3>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs text-slate-400 mb-1.5 block">{children}</label>
  );

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-neon-purple" />
          <h1 className="text-lg font-semibold text-slate-200">SCANNER FILTERS</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
            title="Restore Defaults"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={toggleScanner}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all ${
              scannerRunning
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {scannerRunning ? 'STOP SCAN' : 'START SCAN'}
          </button>
        </div>
      </div>

      {/* Market Cap Limits */}
      <SectionTitle>Market Cap Limits (USD)</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min Pump.fun</Label>
          <input
            type="number"
            value={filters.minPumpFunCap}
            onChange={(e) => updateFilter('minPumpFunCap', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <Label>Min Raydium</Label>
          <input
            type="number"
            value={filters.minRaydiumCap}
            onChange={(e) => updateFilter('minRaydiumCap', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      <div>
        <Label>Max Market Cap</Label>
        <input
          type="number"
          value={filters.maxMarketCap}
          onChange={(e) => updateFilter('maxMarketCap', Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Liquidity */}
      <SectionTitle>Liquidity & Depth Protection</SectionTitle>
      <div>
        <Label>Min Liquidity (USD)</Label>
        <input
          type="number"
          value={filters.minLiquidity}
          onChange={(e) => updateFilter('minLiquidity', Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <Label>Min Liquidity / Cap Ratio</Label>
          <span className="text-xs text-neon-purple font-mono">{filters.minLiquidityCapRatio}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={filters.minLiquidityCapRatio}
          onChange={(e) => updateFilter('minLiquidityCapRatio', Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Bonding Curve */}
      <SectionTitle>Pump.fun Bonding Curve Limits</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min Bonding %</Label>
          <input
            type="number"
            value={filters.minBondingPercent}
            onChange={(e) => updateFilter('minBondingPercent', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <Label>Max Bonding %</Label>
          <input
            type="number"
            value={filters.maxBondingPercent}
            onChange={(e) => updateFilter('maxBondingPercent', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Age */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min Age (min)</Label>
          <input
            type="number"
            value={filters.minAgeMinutes}
            onChange={(e) => updateFilter('minAgeMinutes', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <Label>Max Age (min)</Label>
          <input
            type="number"
            value={filters.maxAgeMinutes}
            onChange={(e) => updateFilter('maxAgeMinutes', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Latency */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min Latency (ms)</Label>
          <input
            type="number"
            value={filters.minLatencyMs}
            onChange={(e) => updateFilter('minLatencyMs', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <Label>Max Latency (ms)</Label>
          <input
            type="number"
            value={filters.maxLatencyMs}
            onChange={(e) => updateFilter('maxLatencyMs', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex items-center justify-between card p-3">
        <span className="text-sm text-slate-300">Latency Guard Active</span>
        <button
          onClick={() => updateFilter('latencyGuardActive', !filters.latencyGuardActive)}
          className={`w-12 h-7 rounded-full transition-all duration-200 flex items-center px-0.5 ${
            filters.latencyGuardActive ? 'bg-purple-600' : 'bg-slate-700'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            filters.latencyGuardActive ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Security */}
      <SectionTitle>Security & Anti-Rug Thresholds</SectionTitle>
      <div>
        <div className="flex justify-between mb-1">
          <Label>Max Rugcheck Risk Score</Label>
          <span className="text-xs text-neon-purple font-mono">{filters.maxRugcheckScore}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={filters.maxRugcheckScore}
          onChange={(e) => updateFilter('maxRugcheckScore', Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <Label>Max Dev Wallet Share</Label>
          <span className="text-xs text-neon-purple font-mono">{filters.maxDevWalletShare}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="1"
          value={filters.maxDevWalletShare}
          onChange={(e) => updateFilter('maxDevWalletShare', Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <Label>Max Top 10 Holders Share</Label>
          <span className="text-xs text-neon-purple font-mono">{filters.maxTop10Share}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={filters.maxTop10Share}
          onChange={(e) => updateFilter('maxTop10Share', Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Momentum */}
      <SectionTitle>Momentum & Velocity Gates (30s)</SectionTitle>
      <div>
        <Label>Min Unique Buyers (30s)</Label>
        <input
          type="number"
          value={filters.minUniqueBuyers30s}
          onChange={(e) => updateFilter('minUniqueBuyers30s', Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <Label>5M Profit Momentum (%)</Label>
        <input
          type="number"
          value={filters.minProfitMomentum5m}
          onChange={(e) => updateFilter('minProfitMomentum5m', Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min Buys (30s)</Label>
          <input
            type="number"
            value={filters.minBuys30s}
            onChange={(e) => updateFilter('minBuys30s', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <Label>Max Buys (30s)</Label>
          <input
            type="number"
            value={filters.maxBuys30s}
            onChange={(e) => updateFilter('maxBuys30s', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Activity Filters */}
      <SectionTitle>Activity and Spike Filters</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min Velratio</Label>
          <input
            type="number"
            value={filters.minVelratio}
            onChange={(e) => updateFilter('minVelratio', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <Label>Max Velratio</Label>
          <input
            type="number"
            value={filters.maxVelratio}
            onChange={(e) => updateFilter('maxVelratio', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <Label>Max Price Change 1-Min</Label>
          <span className="text-xs text-neon-purple font-mono">{filters.maxPriceChange1m}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="5"
          value={filters.maxPriceChange1m}
          onChange={(e) => updateFilter('maxPriceChange1m', Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Restore Defaults */}
      <button
        onClick={resetFilters}
        className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-800 transition-all"
      >
        Restore Defaults (Conservative)
      </button>
    </div>
  );
}
