@echo off
setlocal
cd /d "%~dp0"
call bootstrap-gradle.cmd
if errorlevel 1 exit /b %errorlevel%
node tools\bundle-web.mjs
if errorlevel 1 exit /b %errorlevel%
call gradlew.bat :app:assembleDebug
if errorlevel 1 exit /b %errorlevel%
echo.
echo APK: app\build\outputs\apk\debug\app-debug.apk
