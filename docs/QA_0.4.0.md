# QA 0.4.0

打包前执行：

- `node --check app/src/main/assets/app.js`：通过。
- HTML id 唯一性：通过；JS `ui.xxx` 引用均存在于绑定 ID 数组和 HTML。
- AndroidManifest / strings / styles XML：可解析。
- TransformControls 使用 r171 的 `getHelper()` 方式加入 scene，避免把 Controls 实例本身当 Object3D。
- PMX 安全材质路径：`MMDToonMaterial` -> `MeshPhongMaterial`，SkinnedMesh/骨骼/几何对象保持不变。
- 缺失纹理资源：普通图片返回 1x1 白色 PNG；TGA 返回有效 1x1 32-bit TGA，避免 TGALoader 解析 PNG 占位失败。
- 用户测试模型 `五十铃.pmx`（未打包）做二进制结构核对：PMX 2.0，71516 顶点，118238 三角面，13 材质，16 个外部纹理引用；主体材质不是全透明。
- 当前容器无 Android SDK，不能在这里实际 Gradle 打包 APK；容器 Chromium 也缺少可用 EGL/WebGL 环境，因此不把容器 GPU 初始化失败当作 Android 运行结果。
