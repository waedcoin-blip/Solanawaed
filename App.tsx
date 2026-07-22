import { useAppStore } from './store';
import BottomNav from './components/BottomNav';
import TerminalTab from './components/TerminalTab';
import AlphaTab from './components/AlphaTab';
import PnlTab from './components/PnlTab';
import SimrealTab from './components/SimrealTab';
import TestTab from './components/TestTab';
import StatusBar from './components/StatusBar';

function App() {
  const activeTab = useAppStore((s) => s.activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col max-w-md mx-auto relative">
      {/* Scan line effect */}
      <div className="scan-line opacity-30" />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin pb-24">
        {activeTab === 'terminal' && <TerminalTab />}
        {activeTab === 'alpha' && <AlphaTab />}
        {activeTab === 'pnl' && <PnlTab />}
        {activeTab === 'simreal' && <SimrealTab />}
        {activeTab === 'test' && <TestTab />}
      </main>

      {/* Status Bar */}
      <StatusBar />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default App;
