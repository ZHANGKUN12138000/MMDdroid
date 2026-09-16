# MMDroid Studio 0.13.0

- 修复连续光照中的层纹：非 Toon 管线启用材质 Dithering，高精度连续色阶；Toon/NPR 保留设计性的分层。
- 统一灯光能量：同一组 Key/Fill/Rim/Environment 参数在不同管线内部自动归一化。
- 专业化重命名渲染管线并增大管线差异。
- Principled PBR 降低过强 IBL 洗色，强化 Hair anisotropy、cloth sheen、eye clearcoat。
- Dual-Tone Anime NPR 增加角色分类双色暗部、亮部高光带与 Rim。
- Hybrid 透明由 AlphaHash 改成 deterministic single-pass Blend，降低动画闪烁。
- 新增 Hosiery 分类；丝袜/连裤袜默认使用稳定半透明策略。
- 调整纹理 diffuse multiplier、环境色和补光色，降低皮肤/服装发灰。
- 场景格式升级为 v7。
