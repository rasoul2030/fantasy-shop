@echo off
chcp 65001 >nul 2>&1
title Movie Manager - Running

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║                                              ║
echo  ║           مدیریت فیلم - در حال اجرا         ║
echo  ║           Movie Manager - Running             ║
echo  ║                                              ║
echo  ╚══════════════════════════════════════════════╝
echo.
echo  سایت در حال اجراست...
echo  مرورگر خود را باز کنید:
echo.
echo     http://localhost:3000
echo.
echo  برای توقف برنامه، این پنجره را ببندید یا Ctrl+C بزنید.
echo  ───────────────────────────────────────────────
echo.

call npx next dev -p 3000
pause