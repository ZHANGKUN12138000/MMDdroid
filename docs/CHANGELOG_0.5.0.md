# MMDroid Studio 0.5.0 Change Log

- Fixed PMX `opacity` compatibility crash by reading MMD shader uniforms directly instead of proxy properties.
- PMX/PMD Android compatibility material now defaults to an unlit `MeshBasicMaterial` fallback so valid characters cannot become all-black because of lighting/toon shader incompatibility.
- Imported objects now use a dedicated outer Transform Group. MMD animation/IK/physics update the inner model while the transform gizmo edits the outer group.
- Move/Rotate buttons directly activate the TransformControls gizmo; reset restores outer-group position and rotation to zero while preserving character scale.
- Side workspaces restored to compact widths and extended to the bottom edge.
- Left workspace keeps the original scene-tree emphasis with only Move, Rotate, and Reset transform operations added.
- Android versionCode 5 / versionName 0.5.0.
