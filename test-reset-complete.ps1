# Test complet de réinitialisation de mot de passe
$email = "ayarirayen539@gmail.com"
$backendUrl = "http://localhost:5000"

Write-Host "`n=== 🎯 Test Complet de Réinitialisation ===" -ForegroundColor Cyan
Write-Host ""

# Demander le code reçu par email
$code = Read-Host "Entrez le code à 6 chiffres reçu par email"

Write-Host "`n🔐 Réinitialisation du mot de passe..." -ForegroundColor Yellow

$resetBody = @{
    email = $email
    code = $code
    newPassword = "nouveaumotdepasse123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/client-auth/reset-password" `
        -Method Post `
        -ContentType "application/json" `
        -Body $resetBody
    
    Write-Host "✅ Mot de passe réinitialisé avec succès !" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor Gray
    Write-Host ""
    
    # Test de connexion avec le nouveau mot de passe
    Write-Host "🔑 Test de connexion avec le nouveau mot de passe..." -ForegroundColor Yellow
    
    $loginBody = @{
        email = $email
        password = "nouveaumotdepasse123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$backendUrl/api/client-auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "✅ Connexion réussie !" -ForegroundColor Green
    Write-Host "   Token: $($loginResponse.token.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Résumé:" -ForegroundColor Cyan
    Write-Host "  ✅ Email envoyé" -ForegroundColor Green
    Write-Host "  ✅ Code vérifié" -ForegroundColor Green
    Write-Host "  ✅ Mot de passe réinitialisé" -ForegroundColor Green
    Write-Host "  ✅ Connexion avec nouveau mot de passe réussie" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nouveaux identifiants:" -ForegroundColor Yellow
    Write-Host "  Email: $email" -ForegroundColor Gray
    Write-Host "  Mot de passe: nouveaumotdepasse123" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "❌ Erreur :" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nDétails:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Red
    }
}
