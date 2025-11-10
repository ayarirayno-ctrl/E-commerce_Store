# 🔧 DIAGNOSTIC ADMIN LOGIN - Script PowerShell

Write-Host "🔍 DIAGNOSTIC ADMIN LOGIN PROBLEM" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# 1. Vérifier si MongoDB fonctionne
Write-Host "`n1️⃣ Test MongoDB Connection..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB is NOT running" -ForegroundColor Red
        Write-Host "💡 Start MongoDB with: mongod" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Cannot check MongoDB status" -ForegroundColor Yellow
}

# 2. Vérifier si le backend Node.js fonctionne sur port 5000
Write-Host "`n2️⃣ Test Backend Server (port 5000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend server is running" -ForegroundColor Green
    Write-Host "📊 Health status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend server is NOT running on port 5000" -ForegroundColor Red
    Write-Host "💡 Start backend with: npm run dev (from backend folder)" -ForegroundColor Yellow
}

# 3. Vérifier si le frontend fonctionne sur port 3002
Write-Host "`n3️⃣ Test Frontend Server (port 3002)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Frontend server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend server is NOT running on port 3002" -ForegroundColor Red
    Write-Host "💡 Start frontend with: npm run dev (from E-commerce_Store folder)" -ForegroundColor Yellow
}

# 4. Test API Admin Login
Write-Host "`n4️⃣ Test Admin Login API..." -ForegroundColor Yellow
try {
    $body = @{
        email = "ayarirayen539@gmail.com"
        password = "admin123"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/auth/login" -Method POST -Body $body -Headers $headers -TimeoutSec 10
    
    Write-Host "✅ Admin login API works!" -ForegroundColor Green
    Write-Host "📊 Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)

} catch {
    Write-Host "❌ Admin login API failed" -ForegroundColor Red
    Write-Host "📊 Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        $responseText = $reader.ReadToEnd()
        Write-Host "📊 Response body: $responseText" -ForegroundColor Yellow
    }
}

Write-Host "`n🎯 DIAGNOSTIC COMPLETE" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host "💡 If all tests pass, the admin login should work in the frontend." -ForegroundColor White