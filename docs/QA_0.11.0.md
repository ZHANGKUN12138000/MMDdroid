# MMDroid Studio 0.11.0 QA

- Version code/name: 12 / 0.11.0.
- Verify JavaScript syntax with `node --check app/src/main/assets/app.js`.
- Verify every JavaScript UI id exists exactly once in index.html.
- Verify Android XML parses and gradle.properties keeps AndroidX enabled.
- Validate ZIP integrity before release.
- Runtime device checks recommended: native PMX missing-texture diagnostics, converted-PMX eye-bone selection, smoothed normals, PBR fallback IBL, Genshin toon and tear morph visibility.
