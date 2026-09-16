# MMDroid Studio 0.20.0

- Resource library package model changed to one physical model package plus lightweight costume/hair/accessory bundle references.
- Added `mmddata/hair` and Hair resource tab.
- Complete model archives expose one Model, one Costume bundle, one Hair bundle, and one Accessory bundle instead of listing every part/texture.
- Bundle loader groups all matching `parts/*clothing*`, `parts/*hair*`, and `parts/*accessory*` PMX parts as one switchable set.
- Archive model rendering no longer waits for full SAF persistence; persistence runs in background.
- Main-model library reload skips the `parts/` subtree for faster display.
- Left workspace and render-output hide handles are vertically staggered.
- Android versionCode 21 / versionName 0.20.0.
