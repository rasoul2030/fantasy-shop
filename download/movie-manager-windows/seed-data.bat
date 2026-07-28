@echo off
cd /d "%~dp0"
chcp 65001 >nul 2>&1
title Movie Manager - Seed Data

echo.
echo  Adding sample data to database...
echo.

curl -s -X POST http://localhost:3000/api/seed

echo.
echo  [OK] Sample data added! Refresh the page.
echo.
pause