@echo off
title Expo React Native Cart App Launcher
echo ========================================================
echo         STARTING EXPO REACT NATIVE CART APP
echo ========================================================
echo.
cd /d "%~dp0"
if not exist "node_modules" (
    echo Installing dependencies (first time setup)...
    call npm install
)
echo.
echo Starting Expo Development Server...
echo Scan the QR code using Expo Go on your mobile device,
echo or press 'w' to launch in your browser.
echo.
call npx expo start
pause

