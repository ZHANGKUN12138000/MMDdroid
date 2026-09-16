# QA 0.6.0

Static / structural QA performed before packaging:

- `node --check app/src/main/assets/app.js`: PASS
- HTML IDs: 215, duplicate IDs: 0
- JS-bound GUI IDs: 214, missing HTML elements: 0
- Android XML parse: PASS
- `versionCode=6`, `versionName=0.6.0`
- no stale `btnTransformEdit` code reference
- PMX loader uses a replacement materialBuilder object before `MeshBuilder.build()` material construction
- missing PMX color textures receive neutral unlit preview material (`DoubleSide`, `toneMapped=false`)
- bone hierarchy default state is lazy; full `boneTreeFor()` generation occurs only when the selected model is in `expandedBoneModels`
- model-specific bone toggle clears/restores the branch collapse state

Uploaded PMX diagnostic used during development (not included in release):

- PMX 2.0
- 71,516 vertices
- 16 declared external textures
- 13 materials
- normal opaque materials use nonzero alpha; the file is not globally transparent

This environment does not contain an Android SDK / Android GPU WebView device, so runtime APK/device rendering is not claimed as tested here.
