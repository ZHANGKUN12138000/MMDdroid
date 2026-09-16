# MMDroid Studio 0.8.0 Changelog

## Rendering
- Replaced the 0.7.x unlit-first MMD preview path with a lit MMD Classic / Phong default pipeline.
- Added Blender/PBR compatibility, Classic Toon, Genshin-style Toon approximation, and Unlit diagnostic pipelines.
- Added role-aware material treatment for skin, eyes, hair, cloth, eye overlays, hair overlays, and tear/namida cards.

## Transparency
- Split automatic alpha handling into Opaque, Cutout, Blend, Additive, and Multiply modes.
- Semi-transparent cloth uses normal alpha blending with depthWrite disabled and single-pass double-sided rendering.
- Tear/namida materials default to additive black-background transparency.
- Overlay-like materials use a small polygon offset to reduce coplanar face/eye/cloth artifacts.

## PMX Morph runtime
- Added runtime handling for PMX material morphs (type 8).
- Added recursive group-morph propagation for PMX group morphs (type 0).
- Added UV morph handling (type 3).
- Diffuse and textureColor channels are evaluated separately before being combined, preventing eye/face colour corruption.
- Material alpha morphs update blend/depth policy at runtime.

## Texture diagnostics
- Eye texture decode/load failure now falls back to a dark neutral diagnostic colour rather than flat white.
- Missing tear textures are hidden instead of rendering a white card.

## Scene format
- Scene manifest version increased to 4 and retains renderer pipeline/toon-band settings.
