# MMDroid Studio 0.4.0 Change Log

## MMD 人物可见性

- PMX/PMD 导入后，MMD `MMDToonMaterial` 默认转换为 Android 兼容 `MeshPhongMaterial`。
- 保留原模型颜色、Emissive、Specular、Opacity、Side、Outline metadata。
- SkinnedMesh 保持双面、可见、colorWrite、关闭易误判的 frustum culling。
- 对未授权/缺失的外部纹理使用立即可用的安全占位资源；TGA 使用有效 1x1 TGA，占位不会触发 TGALoader 格式错误。
- 已选入的真实纹理加载完成后自动刷新到兼容材质。
- Inspector 显示兼容材质数量及缺失纹理数量。

## 场景编辑操作

- 新增 TransformControls。
- 左侧新增“编辑/变换、移动、旋转、回原点”。
- 场景树切换对象时，编辑模式中的操纵器同步切换目标。
- 拖动操纵器期间 OrbitControls 自动禁用，结束后恢复。
- 回原点归零 Position / Rotation，保留 Scale。

## GUI / 时间轴

- 左侧默认 360 px、右侧默认 440 px，并为中小屏设置较大的响应式尺寸。
- 树行、输入框、Inspector 字体和触控高度提升。
- 底部“上一/下一关键帧”改用文本按钮和固定宽度布局，工具条允许横向滚动。

## 版本

- Android versionCode 4 / versionName 0.4.0。
- Windows 构建脚本输出 `MMDroidStudio-0.4.0-debug.apk`。
