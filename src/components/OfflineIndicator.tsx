import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-md px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
        <WifiOff className="w-3.5 h-3.5" />
      </div>
      <div>
        <p className="font-semibold text-white">Offline Mode Active</p>
        <p className="text-[11px] text-slate-300">Using cached study material & local notes. Real-time features will sync when online.</p>
      </div>
    </div>
  );
};
