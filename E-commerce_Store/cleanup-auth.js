// 🧹 SCRIPT DE NETTOYAGE D'URGENCE
// Copier/coller dans la console du navigateur (F12)

console.log('🔧 Début du nettoyage...');

// 1. Vider localStorage
localStorage.clear();
console.log('✅ localStorage vidé');

// 2. Vider sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage vidé');

// 3. Supprimer les cookies de session
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log('✅ Cookies supprimés');

// 4. Forcer le rechargement
console.log('🔄 Rechargement forcé...');
setTimeout(() => {
    window.location.href = 'http://localhost:3002/emergency-reset';
}, 1000);
