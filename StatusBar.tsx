import { useAppStore } from '../store';
import { Globe } from 'lucide-react';

export default function StatusBar() {
  const apiLatency = useAppStore((s) => s.apiLatency);
  const masterMonitorActive = useAppStore((s) => s.masterMonitorActive);

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 z-40">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${masterMonitorActive ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            {masterMonitorActive ? 'Live' : 'Idle'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Globe size={12} />
          <span className="text-xs font-mono">{apiLatency}ms</span>
        </div>
      </div>
    </div>
  );
}
