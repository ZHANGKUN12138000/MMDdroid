# MMDroid Studio 0.15.0

## 渲染修正
- 头发：材质组级法线焊接、双面、Alpha-to-Coverage 柔边、连续发丝高光。
- 透明衣料：Alpha 响应曲线提高实体区域保留，减少“整件过透”。
- 丝袜：独立基础不透明度，默认 0.48，可在渲染管线面板调节。
- NPR：重做 Ramp-Quantized Cel 与 Layered Character Anime 两套 Shader，增加角色材质分类、四区分层、Rim、头发亮带与眼睛高光。
- 地面网格：负 renderOrder + depthTest + no depthWrite，避免透明排序时穿到人物前方。
