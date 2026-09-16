# MMDroid Studio 0.11.0 Changelog

- Fixed false-positive texture-missing reports by separating missing resources from decoder failures.
- Added Unicode-normalized, relative-path and unique-stem texture resolution.
- Added automatic normal smoothing for PMX/PMD character meshes.
- Added independent reset actions for scale, position and rotation.
- Reworked eye-bone detection to prefer eyeball/iris/pupil bones and reject socket/eyelid bones; added manual selectors.
- Namida/tear layers are hidden at rest and become visible only when a matching morph is active.
- Upgraded PBR with a fallback studio IBL and role-specific physical parameters.
- Upgraded Genshin-style toon with stronger banding, role-specific shadow tint, rim shader and automatic outline.
- Bumped Android versionCode to 12 and versionName to 0.11.0.
