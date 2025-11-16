@echo off
echo 🔧 REDEMARRAGE E-COMMERCE - Correction Boucle Infinie
echo =====================================================

echo.
echo 1. Arrêt des processus existants...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2. Démarrage Backend...
cd /d "c:\Users\Admin\Desktop\e-commerce\E-commerce_Store\backend"
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo 3. Démarrage Frontend...  
cd /d "C:\Users\Admin\Desktop\e-commerce\E-commerce_Store\frontend"
start "Frontend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ✅ Serveurs démarrés !
echo.
echo 📋 INSTRUCTIONS IMPORTANTES:
echo =============================
echo 1. Attendez que les deux serveurs se lancent (30 secondes)
echo 2. Ouvrez http://localhost:3002 dans le navigateur
echo 3. Si la page rafraîchit sans arrêt :
echo    - Appuyez sur F12 (Console)
echo    - Tapez : localStorage.clear(); sessionStorage.clear();
echo    - Appuyez sur F5 pour actualiser
echo 4. Ou allez sur : http://localhost:3002/emergency-reset
echo.
echo 🔗 URLs importantes:
echo - Frontend: http://localhost:3002
echo - Backend API: http://localhost:5000
echo - Diagnostic: http://localhost:3002/auth-debug.html
echo - Reset urgence: http://localhost:3002/emergency-reset
echo.
pause