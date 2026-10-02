# Wrench Life Android beta

This folder exists only on the `android-app` branch. Do not merge Android packaging work to `main` unless that is explicitly requested later.

## Android targets

- Package: `com.techx1320.wrenchlife`
- minSdk: **29 (Android 10)**
- targetSdk: **36 (Android 16)**
- compileSdk: **36**
- Current version: `0.1.0-alpha`

Android 10 is intentionally the minimum. The game itself is a local HTML/CSS/JS application running inside Android WebView, so there is no gameplay reason to require a newer minimum right now.

## Web game source

The canonical game source remains in `../docs/` on this branch. Android uses a generated single-file web bundle at:

`app/src/main/assets/wrenchlife/index.html`

Refresh it after gameplay changes with:

`node tools/bundle-web.mjs`

The bundled app does not require the GitHub Pages site in order to run.

## Windows debug build

Install Android Studio with Android SDK Platform 36 / Build Tools 36, then either open this `android/` directory in Android Studio or run:

`build-debug.cmd`

The script creates a Gradle wrapper if necessary, refreshes the web bundle, and builds a debug APK.

The output is:

`dist\WrenchLife-0.1.0-alpha-debug.apk`

The Windows script auto-detects the normal Android Studio SDK location (`%LOCALAPPDATA%\Android\Sdk`), verifies API 36 is installed, and uses the already-committed web bundle when Node.js is unavailable.

## Play Store later

No Play developer registration is needed for local APK testing. When the beta is stable, create a release signing key and build an Android App Bundle (AAB) for Play Console.


### Android 15/16 display handling

The native WebView shell applies system-bar insets itself so the game UI is not hidden under the status/navigation bars when targeting API 36. Rotation and fold/unfold screen-size changes are handled without recreating the Activity, which prevents unnecessary game reloads on foldables and tablets.
