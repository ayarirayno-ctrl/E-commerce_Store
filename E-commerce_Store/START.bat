@echo off
echo ========================================
echo  E-COMMERCE - DEMARRAGE COMPLET
echo ========================================
echo.

REM Arrêter tous les processus Node
echo Arret des processus existants...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Démarrer Backend
echo Demarrage du Backend...
start "BACKEND - Port 5000" cmd /k "cd backend && node src\server.js"
timeout /t 3 >nul

REM Démarrer Frontend  
echo Demarrage du Frontend...
start "FRONTEND - Port 3002" cmd /k "npm run dev"
timeout /t 2 >nul

echo.
echo ========================================
echo  SERVEURS DEMARRES !
echo ========================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3002
echo  Admin:    http://localhost:3002/admin/login
echo.
echo Appuyez sur une touche pour continuer...
pause >nul
