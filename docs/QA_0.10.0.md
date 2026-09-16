# MMDroid Studio 0.10.0 QA

- Version code/name: 11 / 0.10.0.
- JavaScript syntax checked with Node.
- HTML IDs checked for duplicates and JS-bound IDs checked for missing elements.
- Resource library DOM moved out of the scene panel; only one set of library IDs remains.
- Startup resource drawer is hidden and the top Resource button toggles it.
- Alpha-morph detection now checks actual PMX diffuse/texture alpha deltas instead of any material morph reference.
- Automatic alpha path uses opaque/cutout for ordinary surfaces and blend only for actual opacity below 0.995 or overlay roles.
- Android XML parsed successfully.
- ZIP integrity checked after packaging.
