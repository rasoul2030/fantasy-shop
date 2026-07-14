@echo off
chcp 65001 >nul 2>&1
title Movie Manager - Seed Database

echo.
echo  در حال افزودن داده‌های نمونه به دیتابیس...
echo.

curl -s -X POST http://localhost:3000/api/seed

echo.
echo  [✓] داده‌های نمونه اضافه شدند!
echo  صفحه وب را رفرش کنید.
echo.
pause