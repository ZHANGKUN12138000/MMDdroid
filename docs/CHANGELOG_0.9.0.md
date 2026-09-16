# MMDroid Studio 0.9.0 Changelog

- Added persistent Android SAF `mmddata` resource library.
- Creates `model`, `item`, `stage`, `vmd`, `music`, `scene`, `hdri`, and `output` directories automatically.
- ZIP/RAR model packages are unpacked into `model/<package>/` with relative texture paths preserved.
- Loose PMX/PMD/FBX imports are copied into their own model package after folder scan.
- VMD, music, stage, item, HDRI and scene imports are persisted to matching library folders.
- Added `library_index.json` cache manifest; startup reads the manifest first and validates filesystem changes in background.
- Added left-panel resource browser for models, items, stages, VMD and music.
- Added manual library refresh and directory re-authorization controls.
- All editor GUI panels are hidden by default at app startup; edge tabs remain visible.
