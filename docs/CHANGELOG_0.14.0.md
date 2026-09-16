# MMDroid Studio 0.14.0

## 修复

- 修复脸部/身体因贴图软 Alpha 被误判为 Hybrid Blend 后整体透明。
- 连续渲染管线加入最终帧静态 Dither，降低 8-bit banding。
- 人物默认关闭接收自身 Shadow Map，保留投射阴影，降低 shadow acne 层纹。
- 光滑焊接改成模型尺度自适应容差，增强转换 PMX 的 UV 缝跨缝法线平均。
- WebGL Renderer 请求 highp 精度。

## 兼容

- 场景清单版本升级到 8，并保存角色自阴影开关。
- 旧场景未保存该字段时默认关闭人物自阴影。
