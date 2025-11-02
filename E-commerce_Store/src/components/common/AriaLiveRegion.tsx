import React, { useEffect } from 'react';

/**
 * ARIA Live Region globale pour les annonces aux lecteurs d'écran
 * Doit être placée dans App.tsx
 */
export const AriaLiveRegion: React.FC = () => {
  useEffect(() => {
    // S'assurer qu'il n'y a qu'une seule région live
    const existing = document.getElementById('aria-live-region');
    if (existing && existing !== document.querySelector('[data-aria-live-region]')) {
      existing.remove();
    }
  }, []);

  return (
    <>
      {/* Polite: pour les notifications non urgentes */}
      <div
        id="aria-live-region"
        data-aria-live-region
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
      
      {/* Assertive: pour les erreurs critiques */}
      <div
        id="aria-live-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
      />
    </>
  );
};
