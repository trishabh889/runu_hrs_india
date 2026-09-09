@echo off
title RUNO HRS INDIA - Shortcut Setup
color 0F
cls
echo ========================================================
echo        RUNO HRS INDIA - MIS SHORTCUT INSTALLER
echo ========================================================
echo.
echo Creating Desktop and Start Menu Shortcuts...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0runo HRS\install_shortcut.ps1"

echo.
echo ========================================================
echo [SUCCESS] Shortcuts installed!
echo - Desktop: "RUNO HRS INDIA - MIS"
echo - Start Menu / Windows Search: "RUNO HRS INDIA - MIS"
echo ========================================================
echo.
set /p launch="Do you want to launch the application now? (Y/N): "
if /i "%launch%"=="Y" (
    start "" "%~dp0runo HRS\dist\RUNO_HRS_INDIA_MIS\RUNO_HRS_INDIA_MIS.exe"
)
exit
