# Script de téléchargement et lancement de Keycloak (sans Docker)

Write-Host "`n=== INSTALLATION KEYCLOAK STANDALONE ===" -ForegroundColor Cyan

$keycloakVersion = "23.0.0"
$keycloakUrl = "https://github.com/keycloak/keycloak/releases/download/$keycloakVersion/keycloak-$keycloakVersion.zip"
$downloadPath = "$env:TEMP\keycloak-$keycloakVersion.zip"
$extractPath = "C:\keycloak"

# 1. Télécharger Keycloak
if (-not (Test-Path $extractPath)) {
    Write-Host "`n1. Téléchargement de Keycloak $keycloakVersion..." -ForegroundColor Yellow
    Write-Host "   URL: $keycloakUrl" -ForegroundColor Gray
    
    try {
        Invoke-WebRequest -Uri $keycloakUrl -OutFile $downloadPath -UseBasicParsing
        Write-Host "   ✅ Téléchargement terminé" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erreur de téléchargement: $_" -ForegroundColor Red
        exit 1
    }

    # 2. Extraire l'archive
    Write-Host "`n2. Extraction de l'archive..." -ForegroundColor Yellow
    try {
        Expand-Archive -Path $downloadPath -DestinationPath "C:\" -Force
        Rename-Item "C:\keycloak-$keycloakVersion" $extractPath -Force
        Write-Host "   ✅ Extraction terminée: $extractPath" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erreur d'extraction: $_" -ForegroundColor Red
        exit 1
    }

    # Nettoyer
    Remove-Item $downloadPath -Force
} else {
    Write-Host "`n✅ Keycloak déjà installé dans: $extractPath" -ForegroundColor Green
}

# 3. Configurer les variables d'environnement
Write-Host "`n3. Configuration de l'environnement..." -ForegroundColor Yellow
$env:KEYCLOAK_ADMIN = "admin"
$env:KEYCLOAK_ADMIN_PASSWORD = "admin"

# 4. Lancer Keycloak en mode développement
Write-Host "`n4. Démarrage de Keycloak..." -ForegroundColor Yellow
Write-Host "   Mode: Développement" -ForegroundColor Gray
Write-Host "   Port: 8080" -ForegroundColor Gray
Write-Host "   Admin: admin / admin" -ForegroundColor Gray
Write-Host "`n⏳ Keycloak va démarrer (cela peut prendre 1-2 minutes)..." -ForegroundColor Yellow
Write-Host "   Appuyez sur Ctrl+C pour arrêter Keycloak`n" -ForegroundColor Gray

try {
    Set-Location "$extractPath\bin"
    .\kc.bat start-dev --http-port=8080
} catch {
    Write-Host "`n❌ Erreur de démarrage: $_" -ForegroundColor Red
    Write-Host "`nVérifiez que Java est installé:" -ForegroundColor Yellow
    Write-Host "   java -version" -ForegroundColor Gray
    exit 1
}
