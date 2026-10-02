@echo off
setlocal
cd /d "%~dp0"
if exist gradlew.bat exit /b 0
echo Gradle wrapper not found. Bootstrapping Gradle 8.13...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $zip='%CD%\gradle-8.13-bin.zip'; $dir='%CD%\.gradle-bootstrap'; if (!(Test-Path $zip)) { Invoke-WebRequest 'https://services.gradle.org/distributions/gradle-8.13-bin.zip' -OutFile $zip }; if (Test-Path $dir) { Remove-Item $dir -Recurse -Force }; Expand-Archive $zip $dir; & "$dir\gradle-8.13\bin\gradle.bat" wrapper"
if errorlevel 1 exit /b %errorlevel%
echo Gradle wrapper created.
