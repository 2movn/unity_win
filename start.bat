@echo off
echo Cleaning up previous processes...
taskkill /f /im electron.exe 2>nul
taskkill /f /im node.exe 2>nul
taskkill /f /im yarn.exe 2>nul

echo Starting production build...
yarn start 