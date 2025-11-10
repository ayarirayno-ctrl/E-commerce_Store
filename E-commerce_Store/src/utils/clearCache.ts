/**
 * Utilitaire pour nettoyer toutes les données en cache
 */

export const clearAllCache = () => {
  // Nettoyer localStorage
  localStorage.clear();
  
  // Nettoyer sessionStorage
  sessionStorage.clear();
  
  // Nettoyer IndexedDB si utilisé
  if ('indexedDB' in window) {
    const databases = window.indexedDB.databases().then(dbs => {
      dbs.forEach(db => {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      });
    }).catch(err => console.error('Erreur nettoyage IndexedDB:', err));
  }
  
  // Nettoyer les cookies
  document.cookie.split(";").forEach(c => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
  
  console.log('✅ Cache complètement nettoyé');
};

export const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  sessionStorage.clear();
  console.log('✅ Données utilisateur nettoyées');
};
