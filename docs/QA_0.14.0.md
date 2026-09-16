# QA 0.14.0

- JavaScript `node --check`：通过。
- HTML ID 唯一性/JS 绑定：构建前检查。
- Android XML：构建前检查。
- AndroidX：保持启用。
- 皮肤自动 Alpha：Skin 在基础 Alpha >= 0.995 时只允许 Opaque/Cutout。
- 人物自阴影：默认关闭 receiveShadow，castShadow 保持开启。
- 抗层纹：连续管线启用静态屏幕空间 Dither Pass。
