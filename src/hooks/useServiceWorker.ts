import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  needsUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isOnline: navigator.onLine,
    needsUpdate: false,
    registration: null,
  });

  useEffect(() => {
    // Service Worker DÉSACTIVÉ pour éviter toute interférence avec Keycloak
    // Ne pas enregistrer de service worker pour une meilleure compatibilité
    
    // Handle online/offline status uniquement
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateServiceWorker = () => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      console.log('Service Worker mis à jour - refresh désactivé - utilisez F5 manuellement');
      // window.location.reload() SUPPRIMÉ
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  return {
    ...state,
    updateServiceWorker,
    requestNotificationPermission,
  };
}
