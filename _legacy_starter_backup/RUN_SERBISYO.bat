@echo off
title SerbisYO PHP Demo
cd /d "%~dp0"
where php >nul 2>nul
if errorlevel 1 (
  echo PHP was not found. Install PHP 8.2+ and add php.exe to PATH.
  pause
  exit /b 1
)
start "SerbisYO PHP API" cmd /k "php -S 127.0.0.1:8000 api/index.php"
timeout /t 2 /nobreak >nul
start "" http://localhost:8000
echo.
echo SerbisYO demo is running.
echo Website: http://localhost:8000
echo API health: http://localhost:8000/api/health
echo API services: http://localhost:8000/api/services
echo.
echo Press any key to close this launcher. The PHP server window can be closed separately.
pause >nul
