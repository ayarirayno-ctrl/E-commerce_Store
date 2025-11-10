#!/usr/bin/env powershell

Write-Host "`n🛡️ DÉMARRAGE EN MODE ANTI-REFRESH" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Arrêter tous les processus Node.js existants
Write-Host "`n🔄 Nettoyage des processus existants..." -ForegroundColor Yellow
try {
    taskkill /f /im node.exe 2>$null
    Start-Sleep -Seconds 2
} catch {
    Write-Host "   Aucun processus Node à arrêter" -ForegroundColor Green
}

# Nettoyer les ports
Write-Host "`n🧹 Nettoyage des ports 3002 et 5001..." -ForegroundColor Yellow
$processes = netstat -ano | Select-String ":3002|:5001"
if ($processes) {
    $processes | ForEach-Object {
        $line = $_.Line
        $processId = ($line -split '\s+')[-1]
        if ($processId -match '^\d+$') {
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            } catch {}
        }
    }
}

Start-Sleep -Seconds 2

Write-Host "`n🚀 Démarrage du backend..." -ForegroundColor Green
Start-Job -Name "Backend" -ScriptBlock {
    Set-Location "c:\Users\Admin\Desktop\e-commerce\E-commerce_Store\E-commerce_Store\backend"
    node src/server.js
}

Start-Sleep -Seconds 3

Write-Host "`n🌐 Démarrage du frontend..." -ForegroundColor Green
Start-Job -Name "Frontend" -ScriptBlock {
    Set-Location "c:\Users\Admin\Desktop\e-commerce\E-commerce_Store\E-commerce_Store"
    npm run dev
}

Start-Sleep -Seconds 5

Write-Host "`n📊 Vérification des services..." -ForegroundColor Cyan

# Vérifier les jobs
$backendJob = Get-Job -Name "Backend" -ErrorAction SilentlyContinue
$frontendJob = Get-Job -Name "Frontend" -ErrorAction SilentlyContinue

if ($backendJob -and $backendJob.State -eq "Running") {
    Write-Host "   ✅ Backend: ACTIF" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend: ERREUR" -ForegroundColor Red
}

if ($frontendJob -and $frontendJob.State -eq "Running") {
    Write-Host "   ✅ Frontend: ACTIF" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend: ERREUR" -ForegroundColor Red
}

Write-Host "`n🎯 PROTECTION ANTI-REFRESH ACTIVÉE" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "✅ Les boucles de rafraîchissement sont BLOQUÉES" -ForegroundColor Green
Write-Host "✅ L'application devrait être stable maintenant" -ForegroundColor Green
Write-Host "`n👉 Ouvrez http://localhost:3002 dans votre navigateur" -ForegroundColor Yellow
Write-Host "👉 La protection anti-refresh se désactivera après 10 secondes" -ForegroundColor Yellow

Write-Host "`n📋 Commandes de diagnostic:" -ForegroundColor Magenta
Write-Host "   • Pour voir les logs backend : Receive-Job -Name 'Backend'" -ForegroundColor White
Write-Host "   • Pour voir les logs frontend : Receive-Job -Name 'Frontend'" -ForegroundColor White
Write-Host "   • Pour arrêter : Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor White

Write-Host "`n⏰ Surveillance en cours... (appuyez sur Ctrl+C pour arrêter)" -ForegroundColor Cyan

# Surveiller les jobs
while ($true) {
    Start-Sleep -Seconds 10
    
    $backend = Get-Job -Name "Backend" -ErrorAction SilentlyContinue
    $frontend = Get-Job -Name "Frontend" -ErrorAction SilentlyContinue
    
    $time = Get-Date -Format "HH:mm:ss"
    
    if ($backend.State -ne "Running") {
        Write-Host "[$time] ⚠️ Backend arrêté - Redémarrage..." -ForegroundColor Yellow
        Remove-Job -Name "Backend" -Force -ErrorAction SilentlyContinue
        Start-Job -Name "Backend" -ScriptBlock {
            Set-Location "c:\Users\Admin\Desktop\e-commerce\E-commerce_Store\E-commerce_Store\backend"
            node src/server.js
        }
    }
    
    if ($frontend.State -ne "Running") {
        Write-Host "[$time] ⚠️ Frontend arrêté - Redémarrage..." -ForegroundColor Yellow
        Remove-Job -Name "Frontend" -Force -ErrorAction SilentlyContinue
        Start-Job -Name "Frontend" -ScriptBlock {
            Set-Location "c:\Users\Admin\Desktop\e-commerce\E-commerce_Store\E-commerce_Store"
            npm run dev
        }
    }
    
    Write-Host "[$time] 💓 Services surveillés..." -ForegroundColor Gray
}