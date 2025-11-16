// Anti-Refresh Protection Component
import { useEffect, useRef } from 'react';

export function useAntiRefresh() {
  const hasLoaded = useRef(false);
  const refreshCount = useRef(0);
  const lastRefreshTime = useRef(0);

  useEffect(() => {
    // Marquer que le composant a été monté
    hasLoaded.current = true;
    
    // Empêcher les rafraîchissements rapides
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) { // 5 secondes minimum entre refreshs
      refreshCount.current++;
      if (refreshCount.current > 3) {
        console.warn('🚫 ANTI-REFRESH: Trop de rafraîchissements détectés, arrêt forcé');
        return;
      }
    } else {
      refreshCount.current = 0;
    }
    lastRefreshTime.current = now;

    // Override window.location.reload temporairement
    const originalReload = window.location.reload;
    window.location.reload = () => {
      console.warn('🚫 ANTI-REFRESH: reload() bloqué temporairement');
      return;
    };

    // Empêcher les redirections automatiques
    const originalReplace = window.location.replace;
    window.location.replace = (url: string) => {
      console.warn('🚫 ANTI-REFRESH: replace() bloqué:', url);
      return;
    };

    // Log pour debug
    console.log('🛡️ ANTI-REFRESH: Protection activée');

    return () => {
      // Restaurer les fonctions originales après 10 secondes
      setTimeout(() => {
        window.location.reload = originalReload;
        window.location.replace = originalReplace;
        console.log('🔓 ANTI-REFRESH: Protection désactivée');
      }, 10000);
    };
  }, []);

  return {
    hasLoaded: hasLoaded.current,
    refreshCount: refreshCount.current
  };
}

export function AntiRefreshProvider({ children }: { children: React.ReactNode }) {
  const { refreshCount } = useAntiRefresh();

  // Afficher un message si trop de rafraîchissements
  if (refreshCount > 5) {
    return (
      <div className="fixed inset-0 bg-red-100 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            🚫 Boucle de Rafraîchissement Détectée
          </h2>
          <p className="text-gray-700 mb-4">
            La page se rafraîchit trop souvent. Protection anti-refresh activée.
          </p>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retourner à l&apos;accueil manuellement
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}