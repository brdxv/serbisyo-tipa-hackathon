@echo off
setlocal

title SerbisYO Launcher
cd /d "%~dp0"

echo ==============================================
echo              SerbisYO Local Launcher
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or is not available in PATH.
    echo Install Node.js 20 or newer, then run this file again.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm is not available in PATH.
    echo Reinstall Node.js with npm, then run this file again.
    echo.
    pause
    exit /b 1
)

where php >nul 2>nul
if errorlevel 1 (
    echo [ERROR] PHP is not installed or is not available in PATH.
    echo Install PHP 8.2 or newer, then run this file again.
    echo If you use XAMPP, add its PHP folder to your Windows PATH.
    echo.
    pause
    exit /b 1
)

php -m | findstr /I /X "pdo_pgsql" >nul 2>nul
if errorlevel 1 (
    echo [WARNING] PHP pdo_pgsql is not enabled.
    echo The app can start, but PostgreSQL-backed API routes will require this extension.
    echo.
)

echo [1/3] Checking frontend dependencies...
call npm install --no-audit --no-fund
if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Check the error above and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] Starting SerbisYO frontend and API...
start "SerbisYO Development Server" cmd /k "npm run dev"

echo [3/3] Waiting for frontend and PHP API...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$urls=@('http://localhost:5173','http://localhost:8000/api/health'); for($i=0; $i -lt 60; $i++){ $ready=$true; foreach($url in $urls){ try { $response=Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 1; if($response.StatusCode -lt 200){ $ready=$false } } catch { $ready=$false } }; if($ready){ exit 0 }; Start-Sleep -Milliseconds 500 }; exit 1"

if errorlevel 1 (
    echo.
    echo [WARNING] The frontend or PHP API did not respond within 30 seconds.
    echo Check the "SerbisYO Development Server" window for errors.
    echo You can still try opening http://localhost:5173 manually.
) else (
    echo.
    echo SerbisYO is ready.
    echo Frontend: http://localhost:5173
    echo PHP API:  http://localhost:8000
    echo.
    if /I not "%~1"=="--no-browser" start "" "http://localhost:5173"
)

echo.
echo Keep the "SerbisYO Development Server" window open while using the app.
echo Press Ctrl+C in that window, or close it, to stop the local servers.
echo.
pause

endlocal
