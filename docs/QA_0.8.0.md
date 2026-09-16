# MMDroid Studio 0.8.0 QA

Static release checks:
- JavaScript syntax checked with `node --check`.
- HTML id uniqueness and JS UI-id mapping checked.
- Android XML parsed.
- AndroidX remains enabled for DocumentFile.
- App version/build script output names checked for 0.8.0.
- Source ZIP integrity checked after packaging.

Rendering regression targets for device testing:
1. Key/fill/rim light visibly changes a PMX character in MMD Classic / Phong.
2. Semi-transparent cloth reveals underlying skin instead of replacing it with an opaque/dark layer.
3. `namida/涙/tear` black backgrounds disappear under Additive mode.
4. Material/group morphs can reveal/hide tear and face-overlay materials.
5. Eye/iris base texture remains visible and is not forced to white by material morph calculations.
6. Switching among MMD Classic, Blender/PBR, Classic Toon, Genshin-style Toon and Unlit rebuilds PMX/PMD materials without losing animation/IK.
