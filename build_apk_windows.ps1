$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "[MMDroid Studio 0.21.0] Android APK builder" -ForegroundColor Cyan

# 1) Java 17+
$javaExe = $null
$javaCandidates = @(
    (Get-Command java -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
    (Join-Path ${env:ProgramFiles} "Android\Android Studio\jbr\bin\java.exe"),
    (Join-Path ${env:ProgramFiles} "Android\Android Studio\jre\bin\java.exe")
) | Where-Object { $_ -and (Test-Path $_) }

if (-not $javaCandidates -or $javaCandidates.Count -eq 0) {
    throw "Java 17+ not found. Install Android Studio or JDK 17 and put java.exe on PATH."
}
$javaExe = $javaCandidates[0]
$javaVersionText = (& $javaExe -version 2>&1 | Select-Object -First 1)
Write-Host "Java: $javaVersionText"

# If using Android Studio's embedded JBR, expose JAVA_HOME to Gradle.
$javaBinDir = Split-Path $javaExe -Parent
$javaHomeCandidate = Split-Path $javaBinDir -Parent
if (Test-Path (Join-Path $javaHomeCandidate "bin\java.exe")) {
    $env:JAVA_HOME = $javaHomeCandidate
    $env:Path = "$javaBinDir;$env:Path"
}

# 2) Android SDK 36
$candidates = @(
    $env:ANDROID_HOME,
    $env:ANDROID_SDK_ROOT,
    (Join-Path $env:LOCALAPPDATA "Android\Sdk")
) | Where-Object { $_ -and (Test-Path $_) }

if (-not $candidates -or $candidates.Count -eq 0) {
    throw "Android SDK not found. Install Android Studio + Android SDK 36, or set ANDROID_HOME."
}
$sdk = $candidates[0]
$androidJar = Join-Path $sdk "platforms\android-36\android.jar"
if (-not (Test-Path $androidJar)) {
    throw "Android SDK Platform 36 not found at $sdk. Install API 36 from Android Studio > SDK Manager."
}
Write-Host "Android SDK: $sdk"

$sdkProp = $sdk.Replace('\','/')
"sdk.dir=$sdkProp" | Set-Content -Encoding ASCII "local.properties"

# 3) Gradle 8.13
$tooling = Join-Path $PSScriptRoot ".tooling"
$gradleHome = Join-Path $tooling "gradle-8.13"
$gradleBat = Join-Path $gradleHome "bin\gradle.bat"
if (-not (Test-Path $gradleBat)) {
    New-Item -ItemType Directory -Force -Path $tooling | Out-Null
    $zip = Join-Path $tooling "gradle-8.13-bin.zip"
    if (-not (Test-Path $zip)) {
        Write-Host "Downloading Gradle 8.13..." -ForegroundColor Yellow
        Invoke-WebRequest -UseBasicParsing "https://services.gradle.org/distributions/gradle-8.13-bin.zip" -OutFile $zip
    }
    Write-Host "Extracting Gradle..." -ForegroundColor Yellow
    Expand-Archive -Force $zip $tooling
}

# 4) Build
Write-Host "Building debug APK..." -ForegroundColor Green
& $gradleBat --no-daemon :app:assembleDebug
if ($LASTEXITCODE -ne 0) { throw "Gradle build failed with exit code $LASTEXITCODE" }

$apk = Join-Path $PSScriptRoot "app\build\outputs\apk\debug\app-debug.apk"
if (-not (Test-Path $apk)) { throw "Build reported success but APK was not found." }
$out = Join-Path $PSScriptRoot "MMDroidStudio-0.21.0-debug.apk"
Copy-Item -Force $apk $out
Write-Host "DONE: $out" -ForegroundColor Cyan
