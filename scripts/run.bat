@echo off
chcp 65001 >nul 2>&1
title Movie Manager - Running

echo.
echo  ========================================
echo    Movie Manager - Running
echo  ========================================
echo.
echo  Open in browser:
echo.
echo     http://localhost:3000
echo.
echo  Close this window or press Ctrl+C to stop.
echo  ----------------------------------------
echo.

cd /d "%~dp0"
call npx next dev -p 3000
pause
