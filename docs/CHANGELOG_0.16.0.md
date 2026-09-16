# MMDroid Studio 0.16.0

## Rendering and texture quality
- Fixed imported textures not immediately receiving the selected texture-quality sampling policy.
- High/Ultra now request the device maximum anisotropy and higher render pixel density.
- Added adjustable post detail sharpening for clothing weave, printed patterns and fine facial/hair texture detail.
- Reduced the excessive diffuse-to-white lift on textured skin and hair.

## Skin system
- Added independent skin presets: Natural Neutral, Warm Dermal, Porcelain Matte, Sun-Kissed, Sebum Gloss and Soft Silicone.
- Skin preset is independent from the renderer pipeline and is saved with scenes.
- Reworked GGX/PBR skin values and strengthened the silicone profile with broader clearcoat, sheen and edge-scatter approximation.
- Neutralized the overly red skin shadow palette of the layered anime NPR renderer.

## Renderer differentiation
- Renamed renderer modes to professional pipeline names.
- Classic Blinn-Phong now uses direct character lighting without IBL.
- GGX Principled PBR uses stronger Room/HDRI IBL and physical microfacet parameters.
- Dermal Clearcoat and Soft-Polymer modes now have visibly different skin response rather than being small parameter variations.

## Built-in environments
- Added offline procedural environments: Studio Cyclorama, Clear Day Skybox, Golden Hour Skybox, Urban Night Skybox and an original Japanese convenience-store street scene.
- Built-in environment choice is saved in the scene manifest.

## UI
- Fixed Character Self Shadow control alignment in the shadow panel.
- Scene manifest bumped to version 9.
- Android versionCode 17 / versionName 0.16.0.
