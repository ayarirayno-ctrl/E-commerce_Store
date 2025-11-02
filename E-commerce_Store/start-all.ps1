# Script pour démarrer backend et frontend ensemble
Write-Host "🚀 Démarrage de l'application E-Commerce..." -ForegroundColor Cyan
Write-Host ""

# Arrêter tous les processus Node existants
Write-Host "🧹 Arrêt des processus existants..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# Démarrer le backend dans un nouveau terminal
Write-Host "📡 Démarrage du Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"
Start-Sleep -Seconds 5

# Démarrer le frontend dans un nouveau terminal
Write-Host "🌐 Démarrage du Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Application démarrée !" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs disponibles:" -ForegroundColor Cyan
Write-Host "   Frontend:     http://localhost:3002" -ForegroundColor White
Write-Host "   Backend:      http://localhost:5000" -ForegroundColor White
Write-Host "   Admin Login:  http://localhost:3002/admin/login" -ForegroundColor White
Write-Host "   Client Login: http://localhost:3002/auth" -ForegroundColor White
Write-Host ""
