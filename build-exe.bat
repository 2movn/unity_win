@echo off
title Build Windows System Manager - EXE

echo ========================================
echo Windows System Manager
echo Build EXE Application
echo ========================================

echo [INFO] Kiểm tra quyền Administrator...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Đang chạy với quyền Administrator
) else (
    echo [ERROR] Cần quyền Administrator để build ứng dụng
    echo Vui lòng chạy lại script này với quyền Administrator
    pause
    exit /b 1
)

echo [INFO] Dọn dẹp thư mục build...
if exist build rmdir /s /q build
if exist renderer\build rmdir /s /q renderer\build
if exist release rmdir /s /q release

echo [INFO] Cài đặt dependencies...
yarn install

echo [INFO] Build ứng dụng...
yarn build

echo [INFO] Kiểm tra build thành công...
if exist "build\main.js" (
    echo [OK] Main process build thành công
) else (
    echo [ERROR] Main process build thất bại
    pause
    exit /b 1
)

if exist "build\renderer\index.html" (
    echo [OK] Renderer process build thành công
) else (
    echo [ERROR] Renderer process build thất bại
    pause
    exit /b 1
)

echo [INFO] Tạo file EXE portable (không code signing)...
yarn package:simple

echo [INFO] Nếu portable thành công, thử tạo installer...
yarn package:no-sign

echo [INFO] Kiểm tra file EXE...
if exist "release\Windows System Manager Setup 1.0.0.exe" (
    echo [OK] File EXE installer đã được tạo thành công!
    echo [INFO] Đường dẫn: release\Windows System Manager Setup 1.0.0.exe
) else if exist "release\Windows System Manager 1.0.0.exe" (
    echo [OK] File EXE portable đã được tạo thành công!
    echo [INFO] Đường dẫn: release\Windows System Manager 1.0.0.exe
) else (
    echo [ERROR] Không tìm thấy file EXE
    echo [INFO] Kiểm tra thư mục release...
    dir release
)

echo.
echo [INFO] Build hoàn thành!
if exist "release\Windows System Manager Setup 1.0.0.exe" (
    echo [INFO] File EXE Installer: release\Windows System Manager Setup 1.0.0.exe
    for %%A in ("release\Windows System Manager Setup 1.0.0.exe") do echo [INFO] Kích thước: %%~zA bytes
) else if exist "release\Windows System Manager 1.0.0.exe" (
    echo [INFO] File EXE Portable: release\Windows System Manager 1.0.0.exe
    for %%A in ("release\Windows System Manager 1.0.0.exe") do echo [INFO] Kích thước: %%~zA bytes
)

pause
