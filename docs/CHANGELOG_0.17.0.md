# MMDroid Studio 0.17.0

## Offline Reference Render
- Added an independent offline/reference render configuration. Realtime preview settings and offline output settings are separate.
- Separate pipeline, skin preset/strength, Key/Fill/Rim/Ambient light intensity, light color/direction, IBL, exposure, shadow map, shadow softness and supersampling controls.
- Copy-from-realtime is one-way only; subsequent edits do not stay linked.
- Added 4K UHD, DCI 4K, 5K, 8K and custom output sizes.
- Added tiled high-resolution rendering with Halton subpixel accumulation. This is a high-quality raster/PBR reference mode, not hardware path tracing.
- Added Android PNG export to `mmddata/output/`.

## 2D output backgrounds
- Added independent output-only 2D background selection.
- Cover, Contain and Stretch fit modes.
- Background resolution is reported; 4K+ images are recommended.
- Output can hide built-in 3D sky/street and floor/grid while retaining imported scene geometry.

## Skin and pipeline corrections
- Rebalanced GGX IBL PBR, Dual-Lobe Dermal and Polymer SSS lighting energy to avoid blown-out skin.
- Skin preset strength now interpolates Roughness, Specular, Clearcoat, Clearcoat Roughness, Sheen and Scatter, not only tint.
- Dermal/Silicone pipelines no longer replace the selected skin preset.
- GGX uses restrained clearcoat with IBL; Dermal uses a narrow sebum coat over a broad base lobe; Polymer uses broad specular + sheen/scatter approximation.

## Build
- Android versionCode 18 / versionName 0.17.0.
