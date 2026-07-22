import { useAppStore } from '../store';
import type { TabId } from '../types';
import {
  Activity, TrendingUp, Wallet, Copy, Terminal, FlaskConical
} from 'lucide-react';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'terminal', label: 'Terminal', icon: Activity },
  { id: 'alpha', label: 'Alpha', icon: TrendingUp },
  { id: 'pnl', label: 'PnL', icon: Wallet },
  { id: 'simreal', label: 'SimReal', icon: Copy },
  { id: 'test', label: 'Test', icon: FlaskConical },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-all duration-200 ${
                isActive
                  ? 'text-neon-purple'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-neon-purple rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
