# QA 0.3.0

打包前已执行：

- `node --check app/src/main/assets/app.js`：通过。
- HTML 静态 ID：209 个，全部唯一；JS 显式绑定 208 个，全部能在 HTML 中找到；剩余 `app` 为页面根容器。
- AndroidManifest / strings / styles XML：可解析。
- 旧版眼睛位置控件与独立 GUI 隐藏控制面板引用扫描：无残留。
- 0.3.0 版本号、构建脚本输出名与文档一致。
- PMX/PMD 主渲染路径默认使用 WebGLRenderer；OutlineEffect 仅在用户开启且后期关闭时使用。

当前执行容器没有 Android SDK，因此这里不能实际运行 Gradle 生成 APK。容器的 headless Chromium 也没有可用的 EGL/WebGL 上下文，所以没有把“容器里无法建立 GPU 上下文”误判为应用运行失败。最终设备侧仍建议用至少一个 PMX（带纹理）、一个 VMD、一个带刚体裙摆模型做真机回归测试。
