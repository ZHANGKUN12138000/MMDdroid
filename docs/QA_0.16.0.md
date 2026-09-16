# QA 0.16.0

Static checks:
- JavaScript syntax via `node --check`.
- HTML IDs are unique and every JS UI binding exists in HTML.
- Android XML parses successfully.
- AndroidX remains enabled.
- Build metadata is versionCode 17 / versionName 0.16.0.
- Archive integrity checked before delivery.

Runtime items to verify on Android GPU/WebView:
- texture sharpening amount versus device resolution;
- PBR/Classic visual separation under different HDRI choices;
- six skin presets on native and converted PMX models;
- procedural sky domes and convenience-store background on low-memory devices.
