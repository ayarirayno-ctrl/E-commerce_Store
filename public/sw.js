/* SERVICE WORKER COMPLÈTEMENT DÉSACTIVÉ - AUCUN REFRESH */

// Service Worker minimal qui ne fait RIEN pour éviter tout refresh
self.addEventListener('install', () => {
  console.log('SW: Installation - AUCUNE ACTION');
  // PAS de skipWaiting() - PAS d'activation automatique
});

self.addEventListener('activate', () => {
  console.log('SW: Activation - AUCUNE ACTION'); 
  // PAS de claim() - PAS de nettoyage de cache
});

self.addEventListener('fetch', () => {
  console.log('SW: Fetch intercepté mais IGNORÉ');
  // NE PAS intercepter les requêtes - laisser le navigateur gérer
  return; // Pas de event.respondWith() = comportement normal du navigateur
});

// Désactiver complètement ce Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('SW: SKIP_WAITING ignoré volontairement');
    // Ne pas faire self.skipWaiting()
  }
});
