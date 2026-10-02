@echo off
setlocal
cd /d "%~dp0"

if "%ANDROID_HOME%"=="" (
  if exist "%LOCALAPPDATA%\Android\Sdk" set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
)
if "%ANDROID_SDK_ROOT%"=="" set "ANDROID_SDK_ROOT=%ANDROID_HOME%"

if "%ANDROID_HOME%"=="" (
  echo ERROR: Android SDK not found.
  echo Install Android Studio / Android SDK Platform 36, or set ANDROID_HOME.
  exit /b 1
)
if not exist "%ANDROID_HOME%\platforms\android-36\android.jar" (
  echo ERROR: Android SDK Platform 36 is not installed in:
  echo   %ANDROID_HOME%
  echo Install "Android SDK Platform 36" from Android Studio SDK Manager.
  exit /b 1
)

call bootstrap-gradle.cmd
if errorlevel 1 exit /b %errorlevel%

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found - using the committed Android web bundle.
) else (
  node tools\bundle-web.mjs
  if errorlevel 1 exit /b %errorlevel%
)

call gradlew.bat :app:assembleDebug
if errorlevel 1 exit /b %errorlevel%

if not exist "dist" mkdir "dist"
copy /y "app\build\outputs\apk\debug\app-debug.apk" "dist\WrenchLife-0.1.0-alpha-debug.apk" >nul

echo.
echo BUILD COMPLETE
echo APK: %CD%\dist\WrenchLife-0.1.0-alpha-debug.apk
