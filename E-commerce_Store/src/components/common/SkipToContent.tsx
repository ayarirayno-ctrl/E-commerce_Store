import React from 'react';

/**
 * Skip to Content Link
 * Améliore l'accessibilité en permettant aux utilisateurs de clavier
 * de sauter directement au contenu principal
 */
const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
