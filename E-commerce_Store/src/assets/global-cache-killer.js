/**
 * 🚀 CONFIG GLOBALE : Force le rechargement IMMÉDIAT
 * À ajouter dans index.html AVANT tous les autres scripts
 */

// 1️⃣ BLOQUER le cache AVANT que les fichiers ne se chargent
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      console.log('🗑️  Nettoyage du cache:', cacheName);
      caches.delete(cacheName);
    });
  });
}

// 2️⃣ Forcer le rechargement si on détecte une nouvelle version
(function() {
  const version = localStorage.getItem('app-version') || '0';
  const currentVersion = new Date().getTime().toString();
  
  if (version !== currentVersion) {
    console.log('🔄 Nouvelle version détectée !');
    localStorage.setItem('app-version', currentVersion);
    
    // Ne recharger que si on n'est pas déjà en train de recharger
    if (!window.location.href.includes('reload=true')) {
      console.log('↻ Rechargement en cours...');
      window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'reload=true&t=' + currentVersion;
    }
  }
})();

// 3️⃣ Désactiver le cache pour toutes les ressources
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

// 4️⃣ Ajouter un header anti-cache à TOUS les fetch
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (!args[1]) args[1] = {};
  if (!args[1].headers) args[1].headers = {};
  
  args[1].headers['Cache-Control'] = 'no-store';
  args[1].headers['Pragma'] = 'no-cache';
  args[1].cache = 'no-store';
  
  // Ajouter un timestamp pour éviter le cache
  if (typeof args[0] === 'string' && !args[0].includes('?')) {
    args[0] = args[0] + '?t=' + Date.now();
  }
  
  return originalFetch.apply(this, args);
};

console.log('✅ Configuration globale anti-cache chargée !');
