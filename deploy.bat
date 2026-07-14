@echo off
chcp 65001 >nul 2>&1
title Movie Manager - Deploy to Vercel

echo.
echo  ========================================
echo    Deploying to Vercel...
echo  ========================================
echo.

where vercel >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  Installing Vercel CLI...
    call npm i -g vercel
    if %ERRORLEVEL% neq 0 (
        echo  ERROR: Failed to install Vercel CLI!
        pause
        exit /b 1
    )
)

echo  Make sure you have set these env vars on Vercel:
echo    - DATABASE_URL (libsql://...)
echo    - ADMIN_PASSWORD (your password)
echo    - NEXT_PUBLIC_DISABLE_FOLDER=true
echo.
echo  Starting deployment...
echo.

cd /d "%~dp0"
call vercel --prod

echo.
echo  ========================================
echo    Deploy complete!
echo  ========================================
echo.
pause