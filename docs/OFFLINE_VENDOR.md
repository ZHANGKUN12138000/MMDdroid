# 完全离线运行方案

0.3.0 默认使用固定版本 **Three.js r171 (`0.171.0`)**。选择 r171 是因为它仍包含 MMDLoader / MMDAnimationHelper；不要直接替换成当前最新 Three.js，否则 MMD addon 可能已经不存在。

默认从 HTTPS CDN 载入，所以首次运行需要联网。要制作完全离线 APK：

1. 在有网络的电脑安装 Node.js。
2. 临时目录执行：`npm install three@0.171.0`
3. 将 `node_modules/three/build/three.module.js` 复制到 `app/src/main/assets/vendor/three/build/`
4. 将 `node_modules/three/examples/jsm/` 整个复制到 `app/src/main/assets/vendor/three/examples/jsm/`
5. 把 `index.html` 中 import map 改为：

```json
{
  "imports": {
    "three": "./vendor/three/build/three.module.js",
    "three/addons/": "./vendor/three/examples/jsm/"
  }
}
```

重新构建 APK 后，3D/MMD 运行库不再依赖网络。模型、VMD、纹理、音乐仍由 Android SAF 选择。
