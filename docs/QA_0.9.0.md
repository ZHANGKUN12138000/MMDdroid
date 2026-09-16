# MMDroid Studio 0.9.0 QA

Static checks performed in the generation environment:

- `app.js` passes `node --check`.
- HTML IDs are unique and all JavaScript UI IDs exist in `index.html`.
- AndroidManifest XML parses successfully.
- `gradle.properties` keeps `android.useAndroidX=true`.
- Java source braces are balanced; `javac` parse attempt shows only expected missing Android SDK classes in this environment and no Java syntax diagnostics.
- Version code/name updated to 10 / 0.9.0.
- Windows build scripts target `MMDroidStudio-0.9.0-debug.apk` and Gradle 8.13.
- ZIP archive integrity checked after packaging.

Runtime items that require an Android device/provider:

- First-run ACTION_OPEN_DOCUMENT_TREE permission and mmddata creation.
- Provider-specific DocumentFile write behavior.
- Large library scan performance on the user's storage provider.
