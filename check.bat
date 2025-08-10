@echo off
echo Checking Windows System Manager environment...
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Check Yarn
echo Checking Yarn...
yarn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Yarn not found! Please install Yarn first.
    pause
    exit /b 1
)
echo ✅ Yarn found

REM Check dependencies
echo Checking dependencies...
if not exist node_modules (
    echo 📦 Installing dependencies...
    yarn install
) else (
    echo ✅ Dependencies found
)

REM Check build
echo Checking build...
if not exist build (
    echo 🔨 Building application...
    yarn build
) else (
    echo ✅ Build found
)

REM Kill existing processes
echo Killing existing processes...
taskkill /f /im electron.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

echo.
echo ✅ Environment check completed!
echo 🚀 Starting application...
echo.

yarn dev

pause 