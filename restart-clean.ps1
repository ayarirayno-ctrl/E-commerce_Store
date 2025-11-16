# Script pour redémarrer React sans cache
Write-Host "🧹 Nettoyage du cache..." -ForegroundColor Yellow

# Arrêter tous les processus Node/Vite
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Nettoyer le cache Vite
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✅ Cache Vite supprimé" -ForegroundColor Green
}

# Nettoyer dist
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Dossier dist supprimé" -ForegroundColor Green
}

Write-Host "🚀 Démarrage du serveur React..." -ForegroundColor Cyan
npm run dev
