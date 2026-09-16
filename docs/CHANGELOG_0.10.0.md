# MMDroid Studio 0.10.0 Changelog

- Moved the persistent `mmddata` library out of the left scene hierarchy into a top-bar Resource drawer.
- Added a top `资源` toggle button; the library is hidden until explicitly opened.
- Kept all main UI panels hidden on startup.
- Fixed false transparent face/clothing surfaces caused by treating every material-morph target as an alpha-morph material.
- Alpha-morph detection now checks actual diffuse/texture alpha changes against PMX multiply/add identities.
- Changed automatic texture-alpha handling to opaque-first: ordinary surfaces use cutout for alpha-bearing textures; only real opacity < 1 and overlays use blend.
- Increased default alpha cutoff from 0.03 to 0.08.
- Legacy compatibility conversion no longer inherits a stray transparent flag when source opacity is effectively opaque.
