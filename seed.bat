@echo off
chcp 65001 >nul 2>&1
title Movie Manager - Seed Data

echo.
echo  ========================================
echo    Seeding sample data...
echo  ========================================
echo.

call npx prisma db seed -- --schema prisma/schema.prisma 2>nul || (
    curl -s -X POST http://localhost:3000/api/seed >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo  Seeding via API failed. Make sure the server is running.
        pause
        exit /b 1
    )
)

echo  Done!
pause
