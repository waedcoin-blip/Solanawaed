import { useState } from 'react';
import { useAppStore } from '../store';
import {
  Trash2, Plus, Shield, Target, Zap, Activity, Eye, EyeOff
} from 'lucide-react';

export default function TerminalTab() {
  const {
    wallets, xrayProtocol, antiMev, autoTakeProfit, masterMonitorActive,
    addWallet, removeWallet, toggleXray, toggleAntiMev, toggleAutoTp, toggleMasterMonitor,
  } = useAppStore();

  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!newAddress.trim()) return;
    addWallet({
      address: newAddress,
      label: newLabel || `Wallet ${wallets.length + 1}`,
      balance: Math.random() * 10,
      isMonitored: true,
    });
    setNewAddress('');
    setNewLabel('');
    setShowAdd(false);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-wider text-slate-200">MANAGE WALLETS</h1>
        <button
          onClick={toggleXray}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
            xrayProtocol
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}
        >
          X-RAY PROTOCOL {xrayProtocol ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Add Wallet */}
      {showAdd ? (
        <div className="card p-4 space-y-3">
          <input
            placeholder="Address (0x...)"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full"
          />
          <input
            placeholder="Label (Optional)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary flex-1 text-sm">
              <Plus size={16} className="inline mr-1" /> Add to Monitor
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} /> ADD TO MONITOR
        </button>
      )}

      {/* Wallet List */}
      <div className="space-y-3">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="card p-4 flex items-center justify-between group hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{wallet.label}</span>
                <span className="badge badge-blue">{wallet.balance.toFixed(2)} SOL</span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-1">{wallet.address}</p>
            </div>
            <button
              onClick={() => removeWallet(wallet.id)}
              className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Protection Settings */}
      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">ANTI-MEV PROTECTION</h3>
            <p className="text-xs text-slate-500">JITO Bundle Execution</p>
          </div>
          <button
            onClick={toggleAntiMev}
            className={`w-12 h-7 rounded-full transition-all duration-200 flex items-center px-0.5 ${
              antiMev ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              antiMev ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">AUTO TAKE-PROFIT</h3>
            <p className="text-xs text-slate-500">TP: 60% @ 2X Gain</p>
          </div>
          <button
            onClick={toggleAutoTp}
            className={`w-12 h-7 rounded-full transition-all duration-200 flex items-center px-0.5 ${
              autoTakeProfit ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              autoTakeProfit ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Master Monitor Button */}
      <button
        onClick={toggleMasterMonitor}
        className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
          masterMonitorActive
            ? 'bg-emerald-600 shadow-lg shadow-emerald-900/40 animate-glow'
            : 'bg-emerald-700 hover:bg-emerald-600'
        }`}
      >
        <Activity size={18} />
        {masterMonitorActive ? 'MASTER MONITOR ACTIVE' : 'ENGAGE MASTER MONITOR'}
      </button>
    </div>
  );
}
