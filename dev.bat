@echo off
title Windows System Manager - Development Mode

echo ========================================
echo Windows System Manager
echo Development Mode - Administrator Required
echo ========================================

:: Kiểm tra quyền Administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Đang chạy với quyền Administrator
) else (
    echo [ERROR] Cần quyền Administrator để chạy ứng dụng
    echo Vui lòng chạy lại script này với quyền Administrator
    echo.
    echo Nhấn phím bất kỳ để thoát...
    pause >nul
    exit /b 1
)

echo [INFO] Kiểm tra và cài đặt dependencies...
yarn install

echo [INFO] Dọn dẹp thư mục build...
if exist build rmdir /s /q build
if exist renderer\build rmdir /s /q renderer\build

echo [INFO] Khởi động development server với hot reload...
yarn dev

echo.
echo [INFO] Ứng dụng đã dừng. Nhấn phím bất kỳ để thoát...
pause >nul 