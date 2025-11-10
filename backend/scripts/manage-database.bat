@echo off
echo ===============================================
echo       GESTION DE LA BASE DE DONNÉES 
echo ===============================================
echo.

:MENU
echo Choisissez une action :
echo.
echo 1. Nettoyer la base de données (supprimer produits/clients)
echo 2. Ajouter des produits d'exemple (8 produits)
echo 3. Nettoyer ET ajouter des exemples (recommandé)
echo 4. Quitter
echo.

set /p choice=Entrez votre choix (1-4): 

if "%choice%"=="1" goto CLEAN
if "%choice%"=="2" goto ADD_PRODUCTS
if "%choice%"=="3" goto CLEAN_AND_ADD
if "%choice%"=="4" goto EXIT

echo Choix invalide. Veuillez entrer 1, 2, 3 ou 4.
goto MENU

:CLEAN
echo.
echo 🧹 Nettoyage de la base de données...
cd /d "%~dp0"
node clean-database.js
pause
goto MENU

:ADD_PRODUCTS
echo.
echo 📦 Ajout des produits d'exemple...
cd /d "%~dp0"
node add-sample-products.js
pause
goto MENU

:CLEAN_AND_ADD
echo.
echo 🧹📦 Nettoyage et ajout de produits d'exemple...
cd /d "%~dp0"
echo Étape 1/2 : Nettoyage...
node clean-database.js
echo.
echo Étape 2/2 : Ajout des produits...
node add-sample-products.js
pause
goto MENU

:EXIT
echo Au revoir !
exit