# Script de Test Rapide - Création de Compte et Réinitialisation

Write-Host "`n=== 🧪 Test de Réinitialisation de Mot de Passe ===" -ForegroundColor Cyan
Write-Host ""

# Variables
$email = Read-Host "Entrez votre email (pour recevoir le code de réinitialisation)"
$backendUrl = "http://localhost:5000"

Write-Host "`n📝 Étape 1 : Création du compte client..." -ForegroundColor Yellow

# Créer le compte
$createBody = @{
    name = "Test User"
    email = $email
    password = "test123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/client-auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $createBody
    
    Write-Host "✅ Compte créé avec succès !" -ForegroundColor Green
    Write-Host "   ID: $($response.client.id)" -ForegroundColor Gray
    Write-Host "   Nom: $($response.client.name)" -ForegroundColor Gray
    Write-Host "   Email: $($response.client.email)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Erreur lors de la création du compte:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody -ForegroundColor Red
    }
    exit 1
}

Write-Host "`n🔑 Étape 2 : Demande de code de réinitialisation..." -ForegroundColor Yellow

# Demander le code
$forgotBody = @{
    email = $email
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/client-auth/forgot-password" `
        -Method Post `
        -ContentType "application/json" `
        -Body $forgotBody
    
    Write-Host "✅ Code envoyé à votre email !" -ForegroundColor Green
    Write-Host "   $($response.message)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Erreur lors de l'envoi du code:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "`n📧 Étape 3 : Vérifiez votre email" -ForegroundColor Yellow
Write-Host "   Cherchez un email de 'E-commerce Store' avec un code à 6 chiffres" -ForegroundColor Gray
Write-Host ""
$code = Read-Host "Entrez le code à 6 chiffres reçu par email"

Write-Host "`n🔐 Étape 4 : Réinitialisation du mot de passe..." -ForegroundColor Yellow

# Réinitialiser le mot de passe
$resetBody = @{
    email = $email
    code = $code
    newPassword = "newpass123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/client-auth/reset-password" `
        -Method Post `
        -ContentType "application/json" `
        -Body $resetBody
    
    Write-Host "✅ Mot de passe réinitialisé avec succès !" -ForegroundColor Green
    Write-Host "   $($response.message)" -ForegroundColor Gray
    Write-Host "   Nouveau mot de passe: newpass123" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Erreur lors de la réinitialisation:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody -ForegroundColor Red
    }
    exit 1
}

Write-Host "`n✅ Étape 5 : Test de connexion avec le nouveau mot de passe..." -ForegroundColor Yellow

# Tester la connexion
$loginBody = @{
    email = $email
    password = "newpass123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/client-auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "✅ Connexion réussie avec le nouveau mot de passe !" -ForegroundColor Green
    Write-Host "   Token généré: $($response.token.Substring(0, 50))..." -ForegroundColor Gray
}
catch {
    Write-Host "❌ Erreur lors de la connexion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !" -ForegroundColor Green
Write-Host ""
Write-Host "Résumé:" -ForegroundColor Cyan
Write-Host "  ✅ Compte créé" -ForegroundColor Green
Write-Host "  ✅ Code de réinitialisation envoyé par email" -ForegroundColor Green
Write-Host "  ✅ Mot de passe réinitialisé" -ForegroundColor Green
Write-Host "  ✅ Connexion avec nouveau mot de passe réussie" -ForegroundColor Green
Write-Host ""
Write-Host "Identifiants de test:" -ForegroundColor Yellow
Write-Host "  Email: $email" -ForegroundColor Gray
Write-Host "  Mot de passe: newpass123" -ForegroundColor Gray
Write-Host ""
