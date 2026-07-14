@echo off
cd /d "%~dp0"
chcp 65001 >nul 2>&1
title Movie Manager

echo.
echo  ========================================
echo       Movie Manager - Running
echo  ========================================
echo.
echo  Website is running...
echo  Open your browser:
echo.
echo     http://localhost:3000
echo.
echo  To stop: close this window or press Ctrl+C
echo  ----------------------------------------
echo.

call npx next dev -p 3000 --no-turbopack
pause