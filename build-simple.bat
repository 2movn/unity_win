@echo off
title Build Windows System Manager - Simple

echo ========================================
echo Windows System Manager
echo Simple Build - No Code Signing
echo ========================================

echo [INFO] Dọn dẹp thư mục build...
if exist build rmdir /s /q build
if exist renderer\build rmdir /s /q renderer\build
if exist release rmdir /s /q release

echo [INFO] Build ứng dụng...
yarn build

echo [INFO] Tạo file EXE portable...
yarn package:config

echo [INFO] Kiểm tra file EXE...
if exist "release\Windows System Manager.exe" (
    echo [OK] File EXE portable đã được tạo thành công!
    echo [INFO] Đường dẫn: release\Windows System Manager.exe
    for %%A in ("release\Windows System Manager.exe") do echo [INFO] Kích thước: %%~zA bytes
) else (
    echo [ERROR] Không tìm thấy file EXE
    echo [INFO] Kiểm tra thư mục release...
    dir release
)

echo.
echo [INFO] Build hoàn thành!
pause
