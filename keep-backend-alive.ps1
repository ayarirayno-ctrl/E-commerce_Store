# Garde le backend actif en permanence
Write-Host "🚀 Démarrage permanent du Backend..." -ForegroundColor Green
Write-Host "Pour arrêter : Fermez cette fenêtre ou appuyez sur Ctrl+C" -ForegroundColor Yellow
Write-Host ""

Set-Location "$PSScriptRoot\backend"

while ($true) {
    Write-Host "⏰ [$(Get-Date -Format 'HH:mm:ss')] Démarrage du serveur..." -ForegroundColor Cyan
    
    # Démarrer le serveur
    node src/server.js
    
    # Si le serveur s'arrête, attendre 2 secondes avant de redémarrer
    Write-Host "⚠️  [$(Get-Date -Format 'HH:mm:ss')] Serveur arrêté. Redémarrage dans 2s..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
}
