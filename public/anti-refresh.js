// Anti-Refresh Global - Bloque TOUS les refresh
(function() {
  'use strict';
  
  console.log('🚫 ANTI-REFRESH ACTIVÉ - TOUS REFRESH BLOQUÉS');
  
  // Bloquer window.location.reload
  window.location.reload = function() {
    console.warn('🚫 window.location.reload() BLOQUÉ !');
    return false;
  };
  
  // Bloquer location.reload
  if (window.location.reload) {
    Object.defineProperty(window.location, 'reload', {
      value: function() {
        console.warn('🚫 location.reload() BLOQUÉ !');
        return false;
      },
      writable: false,
      configurable: false
    });
  }
  
  // Bloquer F5 et Ctrl+R
  document.addEventListener('keydown', function(e) {
    // F5
    if (e.key === 'F5' || e.keyCode === 116) {
      e.preventDefault();
      e.stopPropagation();
      console.warn('🚫 F5 REFRESH BLOQUÉ !');
      alert('Refresh désactivé ! Redémarrez les serveurs pour voir les changements.');
      return false;
    }
    
    // Ctrl+R
    if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.keyCode === 82)) {
      e.preventDefault();
      e.stopPropagation();
      console.warn('🚫 Ctrl+R REFRESH BLOQUÉ !');
      alert('Refresh désactivé ! Redémarrez les serveurs pour voir les changements.');
      return false;
    }
    
    // Ctrl+F5
    if ((e.ctrlKey || e.metaKey) && (e.key === 'F5' || e.keyCode === 116)) {
      e.preventDefault();
      e.stopPropagation();
      console.warn('🚫 Ctrl+F5 REFRESH BLOQUÉ !');
      alert('Refresh désactivé ! Redémarrez les serveurs pour voir les changements.');
      return false;
    }
  });
  
  // Bloquer le beforeunload pour empêcher refresh
  window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = '';
    console.warn('🚫 Page refresh tenté et BLOQUÉ !');
    return 'Refresh désactivé ! Êtes-vous sûr de vouloir quitter ?';
  });
  
  // Bloquer les tentatives de navigation refresh
  if (window.history && window.history.go) {
    const originalGo = window.history.go;
    window.history.go = function(delta) {
      if (delta === 0) {
        console.warn('🚫 history.go(0) REFRESH BLOQUÉ !');
        return false;
      }
      return originalGo.call(this, delta);
    };
  }
  
  // Bloquer document.location.reload
  if (document.location && document.location.reload) {
    document.location.reload = function() {
      console.warn('🚫 document.location.reload() BLOQUÉ !');
      return false;
    };
  }
  
  console.log('✅ ANTI-REFRESH INSTALLÉ - Tous les refresh sont bloqués');
})();