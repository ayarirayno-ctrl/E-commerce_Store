# Test de connexion admin
Write-Host "🚀 Test de connexion admin..." -ForegroundColor Green

$uri = "http://localhost:5000/api/admin/auth/login"
$body = @{
    email = "ayarirayen539@gmail.com"
    password = "admin123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    Write-Host "📧 Email: ayarirayen539@gmail.com" -ForegroundColor Cyan
    Write-Host "🌐 Endpoint: $uri" -ForegroundColor Cyan
    Write-Host ""
    
    $response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -Headers $headers
    
    Write-Host "✅ CONNEXION RÉUSSIE!" -ForegroundColor Green
    Write-Host "📦 RÉPONSE DU SERVEUR:" -ForegroundColor Yellow
    Write-Host "=" * 50 -ForegroundColor Gray
    
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    Write-Host ""
    Write-Host "🔍 ANALYSE DÉTAILLÉE:" -ForegroundColor Yellow
    if ($response.admin) {
        Write-Host "   ID Admin: $($response.admin.id)" -ForegroundColor White
        Write-Host "   Nom: $($response.admin.name)" -ForegroundColor White
        Write-Host "   Email: $($response.admin.email)" -ForegroundColor White
        Write-Host "   Rôle: $($response.admin.role)" -ForegroundColor White
        
        if ($response.admin.role -eq "admin") {
            Write-Host "   ✅ Rôle correct pour AdminRoute" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Problème: rôle '$($response.admin.role)' != 'admin'" -ForegroundColor Red
        }
    }
    
    if ($response.token) {
        $tokenPreview = $response.token.Substring(0, [Math]::Min(50, $response.token.Length))
        Write-Host "   🎟️ Token JWT: $tokenPreview..." -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ ERREUR DE CONNEXION:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Message -like "*connexion*" -or $_.Exception.Message -like "*connect*") {
        Write-Host ""
        Write-Host "💡 Le backend n'est probablement pas démarré sur le port 5000" -ForegroundColor Yellow
        Write-Host "   Démarrez-le avec: node simple-admin-server.js" -ForegroundColor Yellow
    }
}