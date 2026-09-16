@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_apk_windows.ps1"
if errorlevel 1 (
  echo.
  echo Build failed. See the error above.
  pause
  exit /b 1
)
echo.
echo APK generated: %~dp0MMDroidStudio-0.21.0-debug.apk
pause
endlocal
