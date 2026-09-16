# QA 0.21.0

Static verification completed in the build workspace.

- JavaScript syntax: PASS (`node --check`).
- HTML IDs: 337 total / 337 unique.
- JS-bound UI IDs: 336 / all present.
- AndroidManifest + values XML: PASS.
- AndroidX: `android.useAndroidX=true` confirmed.
- Wearable resource rows: costume / hair / accessory are display-only in the top library.
- Character-scoped wardrobe controls: costume / hair / accessory selectors and local import controls are present.
- Wardrobe swap refresh: active target model is restored after import and the part list is refreshed.
- External accessory visibility: attached costume / hair / accessory records are included in the selected model part list.
- Render output panel: inspector section forced visible; hidden handle anchored to the left edge.
- Idle thermal optimization: full WebGL frame rendering is skipped while static; animation and user interaction still render at configured quality.
- Wearable retarget optimization: hidden inactive sets no longer receive per-frame pose retargeting and temporary quaternion/vector allocations were removed.
- GLB model export: JS GLTFExporter path and Android chunked model writer bridge are present.
- Java brace balance: PASS; `javac` reported only expected missing Android SDK classes and no syntax-like errors.
- Android version: versionCode 22 / versionName 0.21.0.
