@echo off
chcp 65001 >nul 2>&1
title Movie Manager - Setup

echo.
echo  ========================================
echo    Installing Movie Manager...
echo  ========================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  Node.js is not installed!
    echo  Please download it from: https://nodejs.org
    pause
    exit /b 1
)

call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo  ERROR: npm install failed!
    pause
    exit /b 1
)

cd /d "%~dp0"
npx prisma db push --accept-data-loss
if %ERRORLEVEL% neq 0 (
    echo.
    echo  ERROR: Database setup failed!
    pause
    exit /b 1
)

npx prisma generate
if %ERRORLEVEL% neq 0 (
    echo.
    echo  ERROR: Prisma generate failed!
    pause
    exit /b 1
)

echo.
echo  ========================================
echo    Setup complete!
echo  ========================================
echo.
echo  Now run: run.bat
echo.
pause
