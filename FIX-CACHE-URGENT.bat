@echo off
echo 🔧 SOLUTION URGENTE - Probleme Cache et Rafraichissement
echo.

echo 1. Arret des serveurs...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 2. Nettoyage cache navigateur total...
powershell -Command "& {
    # Chrome
    $chromePath = '$env:LOCALAPPDATA\Google\Chrome\User Data\Default'
    if (Test-Path $chromePath) {
        Remove-Item -Path '$chromePath\Cache' -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path '$chromePath\Service Worker' -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host '✅ Cache Chrome nettoye'
    }
    
    # Edge
    $edgePath = '$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default'
    if (Test-Path $edgePath) {
        Remove-Item -Path '$edgePath\Cache' -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path '$edgePath\Service Worker' -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host '✅ Cache Edge nettoye'
    }
}"

echo 3. Suppression Service Worker problematique...
del "public\sw.js" >nul 2>&1

echo 4. Creation Service Worker ULTRA SIMPLE...
echo /* Service Worker Ultra Simple - Pas de cache */ > "public\sw.js"
echo self.addEventListener('install', () => { >> "public\sw.js"
echo   console.log('SW: Installation sans cache'); >> "public\sw.js"
echo   self.skipWaiting(); >> "public\sw.js"
echo }); >> "public\sw.js"
echo. >> "public\sw.js"
echo self.addEventListener('activate', () => { >> "public\sw.js"
echo   console.log('SW: Suppression de tous les caches'); >> "public\sw.js"
echo   caches.keys().then(names => names.forEach(name => caches.delete(name))); >> "public\sw.js"
echo   self.clients.claim(); >> "public\sw.js"
echo }); >> "public\sw.js"
echo. >> "public\sw.js"
echo self.addEventListener('fetch', (event) => { >> "public\sw.js"
echo   event.respondWith(fetch(event.request, { cache: 'no-store' })); >> "public\sw.js"
echo }); >> "public\sw.js"

echo 5. Ajout headers anti-cache dans Vite...
powershell -Command "
$viteConfig = Get-Content 'vite.config.ts' -Raw
if ($viteConfig -notmatch 'no-cache') {
    $newConfig = $viteConfig -replace '(server:\s*{[^}]*)', '$1
      headers: {
        \"Cache-Control\": \"no-store, no-cache, must-revalidate\",
        \"Pragma\": \"no-cache\",
        \"Expires\": \"0\"
      },'
    Set-Content 'vite.config.ts' $newConfig
    Write-Host '✅ Headers anti-cache ajoutes'
}
"

echo 6. Demarrage serveur backend...
start "Backend" cmd /k "cd backend && node src/server.js"
timeout /t 3 /nobreak >nul

echo 7. Demarrage serveur frontend avec force refresh...
start "Frontend" cmd /k "npm run dev -- --force"

echo.
echo 🎯 SOLUTION APPLIQUEE !
echo.
echo 📍 Ouvrez maintenant : http://localhost:3002
echo 🔄 Appuyez sur Ctrl+F5 (force refresh) dans le navigateur
echo 🚨 Si ca marche pas : Ctrl+Shift+R puis F12 > Application > Storage > Clear storage
echo.
echo ✅ Votre projet sera maintenant TOUJOURS a jour !
pause