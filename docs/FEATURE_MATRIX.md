# 功能矩阵 0.17.0

| 功能 | 状态 | 说明 |
|---|---|---|
| Android SAF 文件选择 | 已实现 | 原生 `ACTION_OPEN_DOCUMENT`、多选、持久 URI |
| PMX / PMD / FBX | 已实现 | 人物 / 舞台 / 附件 |
| GLB / GLTF / OBJ | 已实现 | 舞台和附件也可使用 |
| 人物只显示阴影修复 | 已实现 | 标准 WebGL 主渲染 + SkinnedMesh culling/material 修复 |
| VMD 骨骼 / Morph 动作 | 已实现 | PMX/PMD |
| VMD 镜头 | 已实现 | Camera track |
| 音乐 | 已实现 | WebView 可解码格式 |
| 半透明边缘箭头 GUI | 已实现 | 顶/左/右/底独立收起，收起后箭头仍可点 |
| 对象层级 / 文件夹 | 已实现 | 真 `THREE.Group`，支持嵌套 |
| 舞台系统 | 已实现 | 独立 Stage 对象类型 |
| 附件系统 | 已实现 | 可绑定人物根节点或指定骨骼 |
| 骨骼树 | 已实现 | 按 Bone parent/child 展示 |
| 材质编辑器 | 已实现 | 颜色、发光、透明、双面、纹理、PBR 参数、Outline |
| IK Inspector | 已实现 | 链、iteration、angle、link enable |
| 眼睛 Pitch 校正 | 已实现 | 双眼 + 左右眼上下旋转微调 |
| HDRI / IBL | 已实现 | RGBELoader + PMREM |
| Bloom | 已实现 | UnrealBloomPass |
| SSAO | 已实现 | SSAOPass |
| DOF | 已实现 | BokehPass |
| 三点布光 / ACES | 已实现 | Key / Fill / Rim / Hemisphere / Exposure |
| 阴影冻结缓存 | 已实现 | Shadow map freeze / rebake |
| Ammo/MMD 物理入口 | 已实现 | 全部刚体、裙摆/头发优先、重力、substeps |
| 多轨时间轴 | 已实现 | VMD 关键点 + 编辑器关键帧 |
| 关键帧编辑 | 已实现 | Object/Bone/Morph/Eye/Material/Camera/Light/Folder |
| 场景保存 / 导入 v4 | 已实现 | 层级、附件、材质、物理、HDRI、后期、关键帧 |
| VMD -> 任意 FBX 自动重定向 | 未实现 | 需要骨骼映射 / bind pose 重定向 |
| MME `.fx` 直接执行 | 未实现 | HLSL/FX 不能直接在 WebGL 执行 |
| UV Lightmap 离线真烘焙 | 未实现 | 当前为实时后期 + Shadow Map 缓存冻结 |

## 0.8.0 渲染增量

| 功能 | 状态 | 说明 |
|---|---|---|
| MMD Classic / Phong | 已实现 | 默认人物管线，受 Key / Fill / Rim / Hemisphere 光照影响 |
| Blender / PBR 兼容 | 已实现 | MeshPhysicalMaterial + HDRI/IBL，角色部位自动粗糙度近似 |
| 经典 Toon | 已实现 | 2–8 阶可调明暗梯度 |
| 原神风 Toon（近似） | 已实现 | 皮肤暖阴影、头发冷阴影、轮廓光近似；非游戏原始 Shader |
| 透明布料/皮肤重叠 | 已实现 | Blend 不写深度、透明双面单次绘制、轻微 polygon offset |
| Namida / tear 黑底透明 | 已实现 | 自动 Additive，可在材质 Inspector 覆盖 |
| PMX Material Morph | 已实现 | type 8 运行时材质颜色/透明/高光/边线更新 |
| PMX Group Morph 传递 | 已实现 | type 0 递归传递到材质/UV Morph |
| PMX UV Morph | 已实现 | type 3 实时更新 UV |
| Material alpha 模式 | 已实现 | Auto / Opaque / Cutout / Blend / Additive / Multiply |


## 0.9.0 资源库增量

- 首次启动 SAF 目录授权与 `mmddata` 自动创建
- model/item/stage/vmd/music/scene/hdri/output 分类目录
- ZIP/RAR 模型包持久导入并保留贴图相对路径
- 直接模型 + 同级目录扫描后持久化
- `library_index.json` 启动缓存与后台变更校验
- 左侧资源浏览器直接加载模型、道具、舞台、VMD、音乐
- 全部主 GUI 默认隐藏，仅保留边缘箭头


## 0.10.0 界面与透明材质修复

- mmddata 资源库移动到顶部 GUI 的“资源”抽屉，默认关闭。
- 左侧面板只保留当前场景层级和移动/旋转/归零/骨骼展开工具。
- 修复颜色型 Material Morph 被错误当作 Alpha Morph 导致脸/衣服默认半透明。
- 自动 Alpha 策略改为 Opaque-first：普通贴图 Alpha 走 Cutout，真实 opacity<1 才走 Blend；namida 保持 Additive。


## 0.11.0 模型兼容与渲染

- [x] 缺失贴图 / 解码失败分离诊断
- [x] Unicode + 相对路径 + 同 stem 贴图别名匹配
- [x] PMX/PMD 角色自动平滑法线
- [x] Scale / Position / Rotation 独立还原
- [x] 眼球骨骼智能评分和手动选择
- [x] Namida 默认隐藏，Morph 激活显示
- [x] PBR 默认工作室 IBL
- [x] Genshin-style 强化 Toon Shader / Rim / 分色阴影


## 0.12.0 表面与材质质量
- 可调法线光滑预设、角度、强度与原始法线恢复。
- 性能/均衡/高清/超清纹理采样。
- Alpha Hash 混合透明。
- 发丝各向异性 PBR。
- 油润皮肤与硅胶皮肤渲染管线。


## 0.13.0 渲染稳定性与管线分化
- 连续光照管线：Dithering 抗色阶 banding；Toon/NPR 保留设计性色阶。
- 默认阴影 Bias/Normal Bias 与角色阴影相机范围重新校准，降低 shadow acne 层纹。
- 管线灯光能量归一化，切换管线时无需重新调 Key/Fill/Rim。
- Hybrid 透明使用 Stable Blend，不再默认 AlphaHash，降低动画衣物闪烁。
- Hosiery 独立材质分类与半透明默认策略。
- 降低 PBR IBL 洗色与灰雾感，增强头发/布料/皮肤之间的 BRDF 差异。


## 0.14.0 皮肤透明与抗层纹
- Skin 自动模式默认 Opaque/Cutout；贴图软 Alpha 不再让整张皮肤透明。
- 连续光照管线加入高精度最终帧静态 Dither。
- 人物默认关闭接收自身 Shadow Map，保留 castShadow；高级阴影可重新打开。
- 法线焊接使用模型尺度自适应容差。


## 0.15.0 发丝 / 透明 / NPR
- Hair group normal rebuild + Alpha-to-Coverage
- Cloth alpha response / Hosiery opacity split
- Ramp-Quantized Cel NPR
- Layered Character Anime NPR
- Grid depth-order fix

## 0.16.0 纹理 / 皮肤 / 内置环境
- [x] 新贴图立即应用纹理质量采样
- [x] 高清/超清最大各向异性
- [x] 可调纹理细节锐化
- [x] 6 种皮肤预设
- [x] Classic Blinn-Phong 与 GGX PBR 分离
- [x] 油润皮肤 / 硅胶皮肤增强
- [x] Anime NPR 皮肤去过红
- [x] 摄影棚 / 晴空 / 黄昏 / 夜空天空盒
- [x] 原创日本便利店街景
- [x] 自阴影开关排版修复


## 0.17.0 高质量输出
- [x] 实时 / 离线参数完全独立
- [x] 4K / DCI 4K / 5K / 8K / 自定义输出
- [x] 多重子像素累积与分块输出
- [x] 输出专用 2D 背景与画幅适配
- [x] 输出 PNG 保存到 mmddata/output
- [x] 皮肤 BRDF 预设强度真正影响材质参数
- [x] GGX / Dermal / Polymer 写实管线光照重新归一化


## 0.21.0 人物定向装扮 / 模型导出
- 资源栏装扮类只展示；右侧人物 Inspector 定向应用。
- 外部装扮逐件显示状态自动刷新。
- 当前人物 + 可见装扮导出 GLB。
- 静止帧按需渲染，保持实时画质设置不变。
