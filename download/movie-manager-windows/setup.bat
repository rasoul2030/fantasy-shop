@echo off
cd /d "%~dp0"
chcp 65001 >nul 2>&1
title Movie Manager - Setup

echo.
echo  ========================================
echo       Movie Manager - Windows Setup
echo  ========================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js not found!
    echo.
    echo  Download and install Node.js first:
    echo  https://nodejs.org/  ^<-- Version 20 LTS
    echo.
    pause
    exit /b 1
)

echo  [OK] Node.js:
node -v
echo.

echo  [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo  [!] Install failed!
    pause
    exit /b 1
)
echo  [OK] Dependencies installed.
echo.

echo  [2/4] Generating database client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo  [!] Prisma generate failed!
    pause
    exit /b 1
)
echo  [OK] Database client generated.
echo.

echo  [3/4] Setting up database...
if not exist "db" mkdir db
call npx prisma db push
if %errorlevel% neq 0 (
    echo  [!] Database setup failed!
    pause
    exit /b 1
)
echo  [OK] Database ready.
echo.

echo  [4/4] Creating posters folder...
if not exist "public\posters" mkdir public\posters
echo  [OK] Done.
echo.

echo  ========================================
echo.
echo  Setup complete!
echo.
echo  Next step: run "run.bat"
echo  Then open: http://localhost:3000
echo.
echo  Optional: run "seed-data.bat" for sample data.
echo ========================================
echo.
pause