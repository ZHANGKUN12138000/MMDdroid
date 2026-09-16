# MMDroid Studio 0.6.0

## PMX loading

- Replaces Three.js r171 MMDLoader `MaterialBuilder` as an object before mesh construction instead of converting `MMDToonMaterial` after load.
- Prevents loader-side access to the r171 MMDToonMaterial `opacity` uniform proxy.
- Keeps MMD parser, geometry, skeleton, morph geometry, IK, grant, rigid body and constraint metadata intact.

## Black model fallback

- Materials with an external color texture that is not authorized by Android SAF now use a neutral 0.78 gray `MeshBasicMaterial` preview.
- Preview materials are `DoubleSide` and `toneMapped=false` to remain visible independent of scene lighting/tone mapping.
- Missing textures are no longer described as missing materials.
- Real textures are attached only when an actually selected file can be resolved.

## Scene tree

- Bone hierarchy is lazy by default.
- A model shows only a `骨骼 (N)` branch until the user selects that model and presses `展开骨骼`.
- The same button toggles to `收起骨骼`.
- Scene-wide expand no longer implicitly generates all model bone nodes.
