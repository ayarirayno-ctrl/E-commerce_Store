# Test simple d'envoi d'email
$email = "ayarirayen539@gmail.com"
$backendUrl = "http://localhost:5000"

Write-Host "`n🧪 Test d'envoi de code de réinitialisation..." -ForegroundColor Cyan

$body = @{
    email = $email
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/client-auth/forgot-password" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -Verbose
    
    Write-Host "✅ Succès !" -ForegroundColor Green
    Write-Host $response
}
catch {
    Write-Host "❌ Erreur :" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nDétails de l'erreur:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}
