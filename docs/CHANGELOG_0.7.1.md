# MMDroid Studio 0.7.1

## Build fix

- Enabled AndroidX with `android.useAndroidX=true` in the root `gradle.properties`.
- Required by `androidx.documentfile:documentfile:1.1.0`, which was introduced for direct PMX/PMD/FBX folder scanning.
- Kept the bundled Windows build script pinned to Gradle 8.13.
- Bumped Android versionCode to 8 and versionName to 0.7.1.

The Gradle 9.x deprecation message is a warning and was not the cause of `checkDebugAarMetadata` failing.
