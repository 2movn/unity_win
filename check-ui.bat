@echo off
echo Checking Windows Optimization UI...
echo.

REM Kill existing processes
taskkill /f /im electron.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

REM Test services first
echo Testing Windows Optimization services...
node test-windows-features.js

echo.
echo Starting application to check UI...
echo.

REM Start dev mode
yarn dev

pause 