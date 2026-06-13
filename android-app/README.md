# Devi Jewellers Signage - Native Android App

This directory contains the Android Studio project setup for the native mobile interface, built using **Kotlin** and **Jetpack Compose**. It interacts with the AI Studio backend API to control TV displays across showrooms.

## Architecture & Infrastructure
- **UI Framework**: Jetpack Compose (Material 3)
- **Networking**: Retrofit 2 + OkHttp + Gson
- **Coroutines**: Android Architecture Components (ViewModel, StateFlow)
- **Architecture**: MVVM (Model-View-ViewModel)

## Integrating Into Android Studio
1. Open Android Studio and create a new **Empty Compose Activity** project.
2. Set the package name to `com.devijewellers.signage`.
3. Copy the contents of this `android-app` folder directly into your Android Studio project structure.
4. Add the dependencies listed in `build.gradle.kts` to your module-level build file.
5. In `SignageApi.kt`, make sure to update the `BASE_URL` to point to your live backend endpoint.

## Features Included
- **Control Panel**: Toggles for Background Rotation, Slideshow Loop, and TV Mode.
- **Timing Configuration**: Native sliders for Refresh Interval, Duration, and Font Sizes.
- **Color Customization**: Aesthetic UI representing the web-based theme (Dark gold/slate accents).
- **Live Sync**: Uses Retrofit to POST updates directly to the web app's standard NodeJS server.
