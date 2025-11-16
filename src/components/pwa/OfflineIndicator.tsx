import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useServiceWorker } from '../../hooks/useServiceWorker';

export function OfflineIndicator() {
  const { isOnline } = useServiceWorker();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-yellow-400" />
        <div>
          <p className="font-semibold text-sm">You&apos;re offline</p>
          <p className="text-xs text-gray-300">Browsing cached content</p>
        </div>
      </div>
    </div>
  );
}

export function OnlineIndicator() {
  const { isOnline } = useServiceWorker();
  const [wasOffline, setWasOffline] = React.useState(false);
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!showReconnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-green-600 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-3">
        <Wifi className="w-5 h-5" />
        <p className="font-semibold text-sm">Back online!</p>
      </div>
    </div>
  );
}
