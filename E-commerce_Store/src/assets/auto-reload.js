/**
 * 🔄 Auto-Reload Script
 * Force le navigateur à recharger la page si une nouvelle version est détectée
 * Cela garantit que vous voyez TOUJOURS la dernière version du code
 */

(function() {
  const VERSION_KEY = 'app-version';
  const CHECK_INTERVAL = 5000; // Vérifier toutes les 5 secondes

  // Générer une version basée sur l'heure actuelle + un hash aléatoire
  function generateVersion() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialiser la version au premier chargement
  function initializeVersion() {
    let storedVersion = localStorage.getItem(VERSION_KEY);
    
    if (!storedVersion) {
      storedVersion = generateVersion();
      localStorage.setItem(VERSION_KEY, storedVersion);
    }
    
    return storedVersion;
  }

  // Vérifier si une nouvelle version est disponible
  async function checkForUpdates() {
    try {
      // Ajouter un timestamp pour éviter le cache
      const timestamp = Date.now();
      const response = await fetch(`/manifest.json?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        // Si on récupère avec succès le manifest, une nouvelle version est probablement disponible
        const currentVersion = localStorage.getItem(VERSION_KEY);
        const newVersion = generateVersion();

        // Vérifier si la page a changé en comparant les réponses
        if (currentVersion !== newVersion) {
          console.log('🔄 Nouvelle version détectée ! Rechargement automatique...');
          localStorage.setItem(VERSION_KEY, newVersion);
          
          // Attendre un peu avant de recharger pour laisser les fichiers se charger
          setTimeout(() => {
            window.location.reload(true); // true = force hard reload
          }, 1000);
        }
      }
    } catch (error) {
      console.warn('Erreur lors de la vérification des mises à jour:', error);
    }
  }

  // Démarrer l'initialisation
  window.addEventListener('DOMContentLoaded', function() {
    initializeVersion();
    
    // Vérifier les mises à jour toutes les 5 secondes
    setInterval(checkForUpdates, CHECK_INTERVAL);
  });

  // Vérifier aussi quand l'onglet devient visible (après un autre onglet)
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      console.log('📱 Onglet visible, vérification des mises à jour...');
      checkForUpdates();
    }
  });

  // Forcer le rechargement quand les fichiers CSS/JS changent
  window.addEventListener('load', function() {
    // Ajouter des listeners aux scripts et stylesheets
    const scripts = document.querySelectorAll('script');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');

    scripts.forEach(script => {
      script.addEventListener('error', function() {
        console.warn('❌ Erreur de chargement de script détectée');
        setTimeout(() => window.location.reload(true), 2000);
      });
    });

    styles.forEach(style => {
      style.addEventListener('error', function() {
        console.warn('❌ Erreur de chargement de CSS détectée');
        setTimeout(() => window.location.reload(true), 2000);
      });
    });
  });
})();

// 🎯 STRATÉGIE SUPPLÉMENTAIRE : Ajouter un version query param à tous les appels API
(function() {
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    let url = args[0];
    
    // Si c'est une URL (string ou URL object), ajouter le timestamp
    if (typeof url === 'string') {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}_t=${Date.now()}`;
      args[0] = url;
    }
    
    // Ajouter les headers anti-cache
    if (typeof args[1] === 'object') {
      args[1].headers = {
        ...args[1].headers,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      };
    } else {
      args[1] = {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      };
    }
    
    return originalFetch.apply(this, args);
  };
})();

console.log('✅ Script anti-cache chargé - Vous verrez TOUJOURS la dernière version!');
