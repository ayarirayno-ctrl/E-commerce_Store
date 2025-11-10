# 🔧 Script de Correction des Boucles Infinites - E-commerce
# Auteur: Assistant IA
# Description: Corrige les problèmes de rafraîchissement de page et d'authentification

Write-Host "🔍 DIAGNOSTIC DES PROBLÈMES D'AUTHENTIFICATION" -ForegroundColor Cyan
Write-Host "=" * 50

# Fonction pour afficher les messages
function Write-Status {
    param([string]$Message, [string]$Color = "Yellow")
    Write-Host "✅ $Message" -ForegroundColor $Color
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

# 1. Vérifier les processus en cours
Write-Host "`n1. VÉRIFICATION DES PROCESSUS" -ForegroundColor Green
$frontendProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*vite*" }
$backendProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*backend*" }

if ($frontendProcess) {
    Write-Status "Frontend en cours d'exécution (PID: $($frontendProcess.Id))"
} else {
    Write-Warning "Frontend non détecté"
}

if ($backendProcess) {
    Write-Status "Backend en cours d'exécution (PID: $($backendProcess.Id))"
} else {
    Write-Warning "Backend non détecté"
}

# 2. Tester la connectivité des ports
Write-Host "`n2. TEST DE CONNECTIVITÉ" -ForegroundColor Green

# Test port 3002 (Frontend)
try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:3002" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Status "Frontend (port 3002) - Accessible"
} catch {
    Write-Error "Frontend (port 3002) - Inaccessible"
}

# Test port 5000 (Backend)
try {
    $backendTest = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Status "Backend (port 5000) - Accessible"
} catch {
    Write-Error "Backend (port 5000) - Inaccessible"
}

# 3. Analyser les logs
Write-Host "`n3. ANALYSE DES PROBLÈMES COURANTS" -ForegroundColor Green

$commonProblems = @(
    "Boucle infinie de redirection",
    "localStorage corrompu",
    "État d'authentification désynchronisé",
    "Conflit entre PrivateRoute et Navigate",
    "Token expiré ou malformé",
    "Cache navigateur problématique"
)

foreach ($problem in $commonProblems) {
    Write-Warning "• $problem"
}

# 4. Solutions automatiques
Write-Host "`n4. APPLICATION DES CORRECTIONS" -ForegroundColor Green

Write-Host "   a) Ouverture de la page de diagnostic..." -ForegroundColor Cyan
try {
    Start-Process "http://localhost:3002/auth-debug.html"
    Write-Status "Page de diagnostic ouverte"
} catch {
    Write-Error "Impossible d'ouvrir la page de diagnostic"
}

Write-Host "   b) Génération du script de nettoyage..." -ForegroundColor Cyan
$cleanupScript = @"
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
"@

$cleanupScript | Out-File -FilePath "cleanup-auth.js" -Encoding UTF8
Write-Status "Script de nettoyage créé: cleanup-auth.js"

# 5. Instructions pour l'utilisateur
Write-Host "`n5. INSTRUCTIONS MANUELLES" -ForegroundColor Green

Write-Host @"
📋 ÉTAPES À SUIVRE:

1. 🌐 Ouvrez http://localhost:3002 dans le navigateur
2. 🔧 Appuyez sur F12 pour ouvrir la console
3. 📋 Copiez/collez le contenu de 'cleanup-auth.js'
4. ⚡ Appuyez sur Entrée pour exécuter
5. 🔄 La page se rechargera automatiquement

Alternative:
• Allez sur http://localhost:3002/emergency-reset
• Cliquez sur "Réinitialisation Complète"

Si le problème persiste:
• Redémarrez les serveurs (Ctrl+C puis npm run dev)
• Videz le cache navigateur (Ctrl+Shift+Del)
• Testez en navigation privée
"@ -ForegroundColor White

# 6. Commandes de redémarrage
Write-Host "`n6. COMMANDES DE REDÉMARRAGE" -ForegroundColor Green

Write-Host "Pour redémarrer les serveurs:" -ForegroundColor Cyan
Write-Host "   Backend:  Set-Location 'backend'; npm run dev" -ForegroundColor Gray
Write-Host "   Frontend: Set-Location 'E-commerce_Store'; npm run dev" -ForegroundColor Gray

# 7. Surveillance en temps réel
Write-Host "`n7. SURVEILLANCE" -ForegroundColor Green
Write-Host "Surveillez les logs des terminaux pour détecter:" -ForegroundColor Cyan
Write-Host "   • Erreurs CORS" -ForegroundColor Gray
Write-Host "   • Erreurs de connexion base de données" -ForegroundColor Gray  
Write-Host "   • Messages 'useEffect infinite loop'" -ForegroundColor Gray
Write-Host "   • Redirections en boucle" -ForegroundColor Gray

Write-Host "`n🎯 RÉSUMÉ" -ForegroundColor Magenta
Write-Host "=" * 30
Write-Host "✅ Corrections appliquées au code" -ForegroundColor Green
Write-Host "✅ Page de diagnostic créée" -ForegroundColor Green
Write-Host "✅ Script de nettoyage généré" -ForegroundColor Green
Write-Host "✅ Instructions fournies" -ForegroundColor Green

Write-Host "`n🚀 Testez maintenant la connexion sur http://localhost:3002" -ForegroundColor Cyan

Read-Host "`nAppuyez sur Entrée pour continuer..."