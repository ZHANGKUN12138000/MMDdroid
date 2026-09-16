import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import { DDSLoader } from 'three/addons/loaders/DDSLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';

window.__MMDROID_READY = true;

const $ = id => document.getElementById(id);
const ids = [
  'viewport','topbar','resourcePanel','scenePanel','renderPanel','inspectorPanel','transport','sceneTree','sceneSummary','sceneStats','inspectorTitle','inspectorSubtitle',
  'topTab','leftTab','renderTab','rightTab','bottomTab','btnResources','btnSceneExpand','btnSceneCollapse','btnTransformMove','btnTransformRotate','btnTransformReset','btnToggleBones','transformHint','libraryStatus','btnLibraryRefresh','btnLibraryPermission','libraryTabs','libraryList',
  'btnImportModel','btnImportStage','btnImportMotion','btnImportCamera','btnImportAudio','btnImportHdri','btnNewFolder','btnSaveScene','btnLoadScene','btnExportModel','btnFit',
  'modelInput','costumeInput','hairInput','stageInput','accessoryInput','motionInput','cameraInput','audioInput','hdriInput','sceneInput',
  'activeVisible','btnDeleteObject','scale','scaleOut','btnResetScale','posX','posY','posZ','btnResetPosition','rotX','rotY','rotZ','btnResetRotation','objectFolder','btnRepairVisibility','mmdCompatInfo','smoothPreset','smoothAngle','smoothAngleOut','smoothStrength','smoothStrengthOut','btnApplySmooth','btnRestoreNormals','textureQuality','textureSharpness','textureSharpnessOut','textureQualityInfo',
  'costumeLibrarySelect','btnApplyCostumeLibrary','btnImportCostumeLocal','hairLibrarySelect','btnApplyHairLibrary','btnImportHairLocal','accessoryLibrarySelect','btnApplyAccessoryLibrary','btnImportAccessoryLocal','modelPartList','btnShowAllCostume','btnHideAllCostume','btnShowAllHair','btnHideAllHair','btnShowAllAccessory','btnHideAllAccessory','btnResetModelParts','expressionPreset','expressionPresetStrength','expressionPresetStrengthOut','btnApplyExpressionPreset','btnClearExpression','expressionPresetInfo','morphSelect','morphWeight','morphOut','btnResetMorph','eyeSection','eyeBoneInfo','eyeBoneLeftSelect','eyeBoneRightSelect','btnAutoEyeBones','eyePitch','eyePitchOut','eyePitchLeft','eyePitchLeftOut','eyePitchRight','eyePitchRightOut','btnResetEyes',
  'boneNameLabel','bonePosX','bonePosY','bonePosZ','boneRotX','boneRotY','boneRotZ','btnResetBone',
  'ikNameLabel','ikGlobal','ikEnabled','ikIteration','ikIterationOut','ikMinAngle','ikMaxAngle','ikLinkSelect','ikLinkEnabled',
  'materialNameLabel','matColor','matEmissive','matOpacity','matOpacityOut','matAlphaMode','matAlphaCutoff','matAlphaCutoffOut','matTransparent','matDepthWrite','matDoubleSide','matWireframe','matTextureEnabled','matOutlineVisible','matRoughness','matRoughnessOut','matMetalness','matMetalnessOut','matOutlineThickness','matOutlineThicknessOut','btnResetMaterial',
  'attachModel','attachBone','btnApplyAttachment','btnDetachAttachment','folderName','folderParent','btnApplyFolder','btnDeleteFolder',
  'physicsObjectName','physicsEnabled','physicsProfile','gravity','gravityOut','physicsSteps','physicsStepsOut','btnRebuildPhysics','physicsStatus',
  'motionTargetModel','btnUseSelectedAsMotionTarget','motionTargetInfo','motionInfo','btnRemoveMotion','cameraEnabled','fov','fovOut','camTargetX','camTargetY','camTargetZ','volume','volumeOut','audioInfo',
  'renderPipeline','skinPreset','skinPresetStrength','skinPresetStrengthOut','skinPresetInfo','toonBands','toonBandsOut','clothAlphaBoost','clothAlphaBoostOut','hosieryOpacity','hosieryOpacityOut','renderPipelineInfo','btnRebuildMaterials','keyColor','keyLight','keyLightOut','lightAz','lightEl','fillColor','fillLight','fillLightOut','fillAz','fillEl','rimColor','rimLight','rimLightOut','rimAz','rimEl','ambient','ambientOut','ambientSky','ambientGround','exposure','exposureOut',
  'shadows','characterSelfShadow','outlineEnabled','shadowMapSize','shadowBias','shadowBiasOut','shadowNormalBias','shadowNormalBiasOut','shadowRadius','shadowRadiusOut','btnBakeShadow','btnRealtimeShadow','btnRefreshBake','bakeStatus',
  'postEnabled','bloomEnabled','bloomStrength','bloomStrengthOut','bloomThreshold','bloomThresholdOut','bloomRadius','bloomRadiusOut','ssaoEnabled','ssaoRadius','ssaoRadiusOut','ssaoMin','ssaoMax','dofEnabled','dofFocus','dofFocusOut','dofAperture','dofApertureOut','dofMaxBlur','dofMaxBlurOut',
  'btnCopyRealtimeOffline','btnRenderBgPick','btnRenderBgClear','offlineBgInfo','offlineBgSource','offlineBuiltinBg','offlineBgFit','offlineFrameStyle','outputOrientation','offlinePipeline','offlineSkinPreset','offlineSkinStrength','offlineSkinStrengthOut','offlineKeyColor','offlineKeyAz','offlineKeyEl','offlineKey','offlineKeyOut','offlineFillColor','offlineFillAz','offlineFillEl','offlineFill','offlineFillOut','offlineRimColor','offlineRimAz','offlineRimEl','offlineRim','offlineRimOut','offlineAmbientSky','offlineAmbientGround','offlineAmbient','offlineAmbientOut','offlineIbl','offlineIblOut','offlineExposure','offlineExposureOut','offlineResolution','offlineWidth','offlineHeight','offlineSamples','offlineShadowMap','offlineShadowRadius','offlineShadowRadiusOut','offlineHideBuiltin','offlineHideFloor','btnOfflineRender','offlineRenderStatus','renderBgInput',
  'builtinEnvironment','builtinEnvironmentInfo','hdriInfo','hdriBackground','hdriIntensity','hdriIntensityOut','bgColor','floorColor','floorRoughness','floorRoughnessOut','floorMetalness','floorMetalnessOut','gridVisible','floorVisible','fogEnabled','fogColor','fogDensity',
  'btnPlay','btnStop','btnPrevKey','btnNextKey','btnAddKey','btnDeleteKey','keyChannel','timeLabel','timelineFps','timelineZoom','loop','status','timelineTrackLabels','timelineCanvas','toast','loading','loadingText'
];
const ui = Object.fromEntries(ids.map(id => [id, $(id)]));

const state = {
  objects: [], folders: [], activeId: null, nextObjectId: 1, nextFolderId: 1,
  selection: { type: 'scene', id: null, sub: null }, collapsed: new Set(),
  playing: false, time: 0, duration: 10, manualDuration: 10, lastNow: performance.now(),
  cameraAnimation: false, cameraMixer: null, cameraClip: null, cameraDuration: 0, cameraPack: null, cameraUris: [],
  audioUrl: null, audioUri: null, audioName: null,
  hdriUri: null, hdriName: null, hdriSource: null, hdriEnv: null,
  shadowFrozen: false, shadowDirty: false,
  editorKeys: {}, selectedKey: null, allTreeKeys: new Set(), lastTimelineDraw: 0,
  outlineEnabled: false,
  renderPipeline: 'mmdPhong', skinPreset: 'natural', skinPresetStrength: 0.70, toonBands: 4, textureQuality: 'high', textureSharpness: 0.55, antiBanding: true, characterSelfShadow: false, clothAlphaBoost: 1.28, hosieryOpacity: 0.48, builtinEnvironment: 'solid',
  transformEdit: false, transformMode: 'translate', transformTargetId: null, transformObject: null, expandedBoneModels: new Set(),
  ammoReady: false, ammoLoading: null,
  libraryManifest: null, libraryCategory: 'model', libraryScanning: false, libraryAvailable: false,
  offlineBackground: null, offlineBackgroundUri: null, offlineRendering: false,
  motionTargetId: null,
  pendingWearableTargetId: null, pendingWearableKind: null,
  renderDirty: true, lastRenderedAt: 0, lastInteractionAt: performance.now(),
};

function markRenderDirty(){state.renderDirty=true;state.lastInteractionAt=performance.now();}

const renderer = new THREE.WebGLRenderer({ canvas: ui.viewport, antialias: true, alpha: false, precision: 'highp', powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = Number(ui.exposure.value);
const outlineEffect = new OutlineEffect(renderer, { defaultThickness: 0.003 });

const scene = new THREE.Scene();
scene.background = new THREE.Color(ui.bgColor.value);
const pbrPmrem = new THREE.PMREMGenerator(renderer);
const pbrFallbackEnv = pbrPmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pbrPmrem.dispose();
const camera = new THREE.PerspectiveCamera(Number(ui.fov.value), innerWidth / innerHeight, 0.05, 5000);
camera.position.set(0, 12, 35);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.target.set(0, 10, 0);
controls.minDistance = 0.15; controls.maxDistance = 2000; controls.screenSpacePanning = true; controls.update();
controls.addEventListener('change',markRenderDirty);

const transformControls = new TransformControls(camera, renderer.domElement);
const transformHelper = transformControls.getHelper();
transformHelper.visible = false;
scene.add(transformHelper);
transformControls.setMode('translate');
transformControls.setSpace('world');
transformControls.setSize(1.15);transformControls.enabled=true;renderer.domElement.style.touchAction='none';
transformControls.addEventListener('dragging-changed', event => {
  controls.enabled = !event.value && (!state.cameraAnimation || !ui.cameraEnabled.checked);
});
transformControls.addEventListener('objectChange', () => {
  markRenderDirty();
  const rec = objectById(state.transformTargetId);
  if (rec) { updateTransformUI(rec); markBakeDirty(); }
  else if (state.selection.type === 'folder') syncFolderUI(selectedFolder());
});

const ambientLight = new THREE.HemisphereLight(ui.ambientSky.value, ui.ambientGround.value, Number(ui.ambient.value));
const keyLight = new THREE.DirectionalLight(ui.keyColor.value, Number(ui.keyLight.value));
const fillLight = new THREE.DirectionalLight(ui.fillColor.value, Number(ui.fillLight.value));
const rimLight = new THREE.DirectionalLight(ui.rimColor.value, Number(ui.rimLight.value));
keyLight.castShadow = true; keyLight.shadow.camera.near = 0.1; keyLight.shadow.camera.far = 500;
keyLight.shadow.camera.left = -42; keyLight.shadow.camera.right = 42; keyLight.shadow.camera.top = 42; keyLight.shadow.camera.bottom = -42;
scene.add(ambientLight, keyLight, keyLight.target, fillLight, fillLight.target, rimLight, rimLight.target);

const floorMaterial = new THREE.MeshStandardMaterial({ color: ui.floorColor.value, roughness: Number(ui.floorRoughness.value), metalness: Number(ui.floorMetalness.value) });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), floorMaterial);
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; floor.renderOrder = -12000; scene.add(floor);
const grid = new THREE.GridHelper(200, 100, 0x4e5d73, 0x2c3441); grid.position.y = 0.008; grid.renderOrder = -11000; grid.frustumCulled=false;
for (const gm of (Array.isArray(grid.material)?grid.material:[grid.material])) { if(!gm) continue; gm.depthTest=true; gm.depthWrite=false; gm.transparent=true; gm.opacity=.34; gm.toneMapped=false; }
scene.add(grid);

let builtinEnvironmentGroup=null;
let builtinSkyDome=null;
let appliedBuiltinEnvironment='solid';
function clearBuiltinEnvironment(){
  if(builtinEnvironmentGroup){scene.remove(builtinEnvironmentGroup);builtinEnvironmentGroup.traverse(o=>{o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m?.dispose?.());else o.material?.dispose?.();if(o.material?.map)o.material.map.dispose?.();});builtinEnvironmentGroup=null;}
  if(builtinSkyDome){scene.remove(builtinSkyDome);builtinSkyDome.geometry?.dispose?.();builtinSkyDome.material?.dispose?.();builtinSkyDome=null;}
}
function makeSkyDome(top='#5d8fcf',horizon='#d7e4f4',bottom='#8290a0',sun='#fff1c4',sunStrength=.35,stars=0){
  const geo=new THREE.SphereGeometry(900,32,20);
  const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,toneMapped:false,uniforms:{top:{value:new THREE.Color(top)},horizon:{value:new THREE.Color(horizon)},bottom:{value:new THREE.Color(bottom)},sun:{value:new THREE.Color(sun)},sunStrength:{value:sunStrength},stars:{value:stars},sunDir:{value:new THREE.Vector3(-.35,.45,-.82).normalize()}},vertexShader:`varying vec3 vWorldDir; void main(){ vec4 wp=modelMatrix*vec4(position,1.0); vWorldDir=normalize(wp.xyz-cameraPosition); gl_Position=projectionMatrix*viewMatrix*wp; gl_Position.z=gl_Position.w; }`,fragmentShader:`varying vec3 vWorldDir; uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sun; uniform float sunStrength; uniform float stars; uniform vec3 sunDir; float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);} void main(){float y=clamp(vWorldDir.y,-1.0,1.0);float up=smoothstep(-.08,.72,y);vec3 c=mix(bottom,horizon,smoothstep(-.75,.02,y));c=mix(c,top,up);float sd=max(dot(normalize(vWorldDir),normalize(sunDir)),0.0);c+=sun*pow(sd,420.0)*sunStrength;c+=sun*pow(sd,38.0)*sunStrength*.18;if(stars>0.0&&y>.05){vec2 p=floor((vWorldDir.xz/max(.08,abs(vWorldDir.y))+6.0)*180.0);float h=hash(p);float st=step(.9935,h)*pow(h,18.0)*stars;c+=vec3(st);}gl_FragColor=vec4(c,1.0);}`});
  const mesh=new THREE.Mesh(geo,mat);mesh.frustumCulled=false;mesh.renderOrder=-30000;mesh.onBeforeRender=()=>mesh.position.copy(camera.position);scene.add(mesh);builtinSkyDome=mesh;return mesh;
}
function canvasLabelTexture(text,bg='#f7f7f7',fg='#152030',accent='#45b77c'){
  const c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);x.fillStyle=accent;x.fillRect(0,0,c.width,42);x.fillRect(0,c.height-34,c.width,34);x.fillStyle=fg;x.font='bold 112px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2+6);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.max(1,renderer.capabilities.getMaxAnisotropy?.()||1);return t;
}
function buildConvenienceStreet(){
  const g=new THREE.Group();g.name='Builtin:Japanese Convenience Street';
  const box=(name,size,pos,mat)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);m.name=name;m.position.set(...pos);m.receiveShadow=true;m.castShadow=false;g.add(m);return m;};
  const wall=new THREE.MeshStandardMaterial({color:0xe7e8e4,roughness:.78,metalness:0});
  const dark=new THREE.MeshStandardMaterial({color:0x30353a,roughness:.58,metalness:.18});
  const glass=new THREE.MeshPhysicalMaterial({color:0xcfe9f2,roughness:.18,metalness:0,transparent:true,opacity:.56,depthWrite:false,transmission:.08,clearcoat:.45,clearcoatRoughness:.15,emissive:0x24343d,emissiveIntensity:.28});
  const lit=new THREE.MeshStandardMaterial({color:0xfff3d2,roughness:.55,emissive:0xffd995,emissiveIntensity:1.4});
  box('Building',[40,12,8],[0,6,-25],wall);box('Canopy',[42,.7,4],[0,9.6,-20.7],dark);
  for(let i=-3;i<=3;i++){box(`Window${i}`,[4.3,6,.16],[i*5.1,5.1,-20.88],glass);box(`InteriorLight${i}`,[3.7,.18,2.8],[i*5.1,8.2,-22.3],lit);}
  box('Door',[3.5,6,.18],[0,4.9,-20.65],glass);
  const signTex=canvasLabelTexture('24H MARKET','#f6f6f2','#17212d','#33a86f');const signMat=new THREE.MeshBasicMaterial({map:signTex,toneMapped:false});const sign=new THREE.Mesh(new THREE.PlaneGeometry(18,4.5),signMat);sign.position.set(0,11.3,-20.52);g.add(sign);
  const vendingMats=[0x8bbedb,0xd98787];for(let i=0;i<2;i++){const vm=new THREE.MeshStandardMaterial({color:vendingMats[i],roughness:.42,emissive:0x18242a,emissiveIntensity:.18});box(`Vending${i}`,[2.0,4.3,1.2],[14+i*2.5,2.2,-19.9],vm);}
  const poleMat=new THREE.MeshStandardMaterial({color:0x4a4f54,roughness:.55,metalness:.35});for(const x of [-20,20]){box('Pole',[.35,9,.35],[x,4.5,-18],poleMat);const lamp=box('StreetLamp',[2.8,.18,1.2],[x,8.8,-18],lit);lamp.material=lit;}
  const curb=new THREE.MeshStandardMaterial({color:0x6d7072,roughness:.96});box('Sidewalk',[52,.25,9],[0,.08,-17.7],curb);
  const road=new THREE.MeshStandardMaterial({color:0x202326,roughness:.98});box('Road',[70,.12,28],[0,-.02,-2.5],road);
  g.traverse(o=>{o.renderOrder=-9000;});scene.add(g);builtinEnvironmentGroup=g;return g;
}
function applyBuiltinEnvironmentPreset(preset=state.builtinEnvironment||'solid'){
  preset=preset||'solid';state.builtinEnvironment=preset;appliedBuiltinEnvironment=preset;clearBuiltinEnvironment();
  if(preset==='studio'){makeSkyDome('#aebfd4','#e5e9ee','#8c9299','#ffffff',.18,0);scene.background=new THREE.Color('#bcc5d1');}
  else if(preset==='clearSky'){makeSkyDome('#3f7fc8','#d9ebfb','#9db5c8','#fff2c8',.48,0);scene.background=new THREE.Color('#8fc2ee');}
  else if(preset==='sunset'){makeSkyDome('#3f426c','#f4a06d','#4c4c58','#ffd9a0',.68,0);scene.background=new THREE.Color('#bd7b72');}
  else if(preset==='night'){makeSkyDome('#07152d','#183654','#111820','#a8c7ff',.07,1.0);scene.background=new THREE.Color('#081326');}
  else if(preset==='konbini'){makeSkyDome('#07152d','#20364d','#101821','#9fc8ff',.06,.72);buildConvenienceStreet();scene.background=new THREE.Color('#091525');}
  else scene.background=new THREE.Color(ui.bgColor.value);
  if(ui.builtinEnvironmentInfo){const names={solid:'纯色 / 自定义 HDRI',studio:'摄影棚柔光',clearSky:'晴空天空盒',sunset:'黄昏天空盒',night:'城市夜空',konbini:'原创日本便利店街景'};ui.builtinEnvironmentInfo.textContent=`当前：${names[preset]||preset}。内置环境离线生成，不依赖外部图片。`;}
}

const helper = new MMDAnimationHelper({ sync: false, afterglow: 0.0, resetPhysicsOnLoop: true });
helper.enable('physics', false); helper.enable('ik', true);
const audio = new Audio(); audio.preload = 'auto'; audio.volume = Number(ui.volume.value);
const nativeWaiters = new Map();

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const ssaoPass = new SSAOPass(scene, camera, innerWidth, innerHeight);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .5, .35, .85);
const bokehPass = new BokehPass(scene, camera, { focus: 25, aperture: .025, maxblur: .01 });
const textureDetailPass = new ShaderPass({
  uniforms:{ tDiffuse:{value:null}, texelSize:{value:new THREE.Vector2(1/Math.max(1,innerWidth),1/Math.max(1,innerHeight))}, amount:{value:0.12} },
  vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader:`uniform sampler2D tDiffuse; uniform vec2 texelSize; uniform float amount; varying vec2 vUv;
    void main(){
      vec4 c=texture2D(tDiffuse,vUv);
      vec3 n=texture2D(tDiffuse,vUv+vec2(0.0,texelSize.y)).rgb;
      vec3 s=texture2D(tDiffuse,vUv-vec2(0.0,texelSize.y)).rgb;
      vec3 e=texture2D(tDiffuse,vUv+vec2(texelSize.x,0.0)).rgb;
      vec3 w=texture2D(tDiffuse,vUv-vec2(texelSize.x,0.0)).rgb;
      vec3 blur=(n+s+e+w)*0.25;
      vec3 detail=c.rgb-blur;
      float l=dot(abs(detail),vec3(.2126,.7152,.0722));
      float limiter=1.0-smoothstep(.18,.42,l);
      vec3 outColor=clamp(c.rgb+detail*amount*limiter,0.0,1.0);
      gl_FragColor=vec4(outColor,c.a);
    }`
});
const antiBandingPass = new ShaderPass({
  uniforms:{ tDiffuse:{value:null}, strength:{value:1.0/255.0} },
  vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader:`uniform sampler2D tDiffuse; uniform float strength; varying vec2 vUv;
    float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
    void main(){ vec4 c=texture2D(tDiffuse,vUv); float n=hash12(gl_FragCoord.xy)-0.5; c.rgb=clamp(c.rgb+n*strength,0.0,1.0); gl_FragColor=c; }`
});
antiBandingPass.enabled = true;
const outputPass = new OutputPass();
composer.addPass(renderPass); composer.addPass(ssaoPass); composer.addPass(bloomPass); composer.addPass(bokehPass); composer.addPass(textureDetailPass); composer.addPass(antiBandingPass); composer.addPass(outputPass);
ssaoPass.enabled = false; bloomPass.enabled = false; bokehPass.enabled = false;

function showToast(message, ms = 2800) { ui.toast.textContent = message; ui.toast.classList.add('show'); clearTimeout(showToast._timer); showToast._timer = setTimeout(() => ui.toast.classList.remove('show'), ms); }
function setLoading(on, text = '正在载入...') { ui.loadingText.textContent = text; ui.loading.classList.toggle('hidden', !on); }
function setStatus(message) { ui.status.textContent = message; }
function num(el, fallback = 0) { const v = Number(el?.value); return Number.isFinite(v) ? v : fallback; }
function ext(name) { const p = String(name || '').toLowerCase().split('.'); return p.length > 1 ? p.pop() : ''; }
function normalizeTextKey(value){let s=String(value||'');try{s=decodeURIComponent(s);}catch(_){}try{s=s.normalize('NFKC');}catch(_){}return s.trim().toLowerCase();}
function basename(path) { return normalizeTextKey(String(path).split(/[\\/]/).pop().split(/[?#]/)[0]); }
function normalizeRel(path){const out=[];for(const raw of String(path||'').replace(/[\\\uFF3C]/g,'/').split('/')){const part=normalizeTextKey(raw);if(!part||part==='.')continue;if(part==='..'){if(out.length)out.pop();continue;}out.push(part);}return out.join('/');}
function stemName(path){const b=basename(path),i=b.lastIndexOf('.');return i>0?b.slice(0,i):b;}
function virtualUrl(prefix, file) { const rel=String(file?.__relativePath||file?.webkitRelativePath||file?.name||'file').replace(/\\/g,'/').split('/').filter(Boolean).map(encodeURIComponent).join('/'); return `https://mmd.local/${prefix}/${rel}`; }
function deg(v) { return THREE.MathUtils.degToRad(Number(v) || 0); }
function rad(v) { return THREE.MathUtils.radToDeg(Number(v) || 0); }
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,t){return a+(b-a)*t;}

function makeManager(files, prefix = `pack-${Date.now()}-${Math.random().toString(16).slice(2)}`) {
  const manager = new THREE.LoadingManager(), urls = [], byName = new Map(), byRelative = new Map(), byStem = new Map(), missing = new Set(), loadErrors = new Set(), idleCallbacks = [];
  let idle = false, baseDir = '';
  const fallbackPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=';
  const tga = new Uint8Array(22); tga[2]=2; tga[12]=1; tga[14]=1; tga[16]=32; tga[17]=0x28; tga[18]=255; tga[19]=255; tga[20]=255; tga[21]=255;
  const fallbackTga = URL.createObjectURL(new Blob([tga], {type:'application/octet-stream'})); urls.push(fallbackTga);
  const textureExtensions = new Set(['png','jpg','jpeg','bmp','webp','gif','tga','spa','sph','dds']);
  for (const file of files) {
    const url = file.__nativeUrl || URL.createObjectURL(file); if(!file.__nativeUrl) urls.push(url);
    const nameKey=basename(file.name);byName.set(nameKey,url);
    const rel=normalizeRel(file.__relativePath||file.webkitRelativePath||'');
    if(rel) byRelative.set(rel,url);
    const stem=stemName(file.name);if(stem){const arr=byStem.get(stem)||[];arr.push({url,name:nameKey,rel});byStem.set(stem,arr);}
  }
  manager.onStart = () => { idle = false; };
  manager.onError = url => {
    const raw=String(url||'');
    // If the loading manager already resolved the request to a blob/data URL, the file exists and
    // the failure is a decoder/format issue rather than a missing texture. Keep those diagnostics
    // separate so the UI does not falsely report 'missing texture'.
    if(raw.startsWith('blob:')||raw.startsWith('data:')) return;
    else if(resolveLocal(raw)) loadErrors.add(raw);
    else markMissing(raw);
  };
  manager.onLoad = () => {
    idle = true;
    for (const cb of idleCallbacks.splice(0)) { try { cb(); } catch (err) { console.warn(err); } }
  };
  function resolveLocal(url) {
    if (!url) return null;
    if (String(url).startsWith('blob:') || String(url).startsWith('data:')) return String(url);
    const raw=decodeURIComponent(String(url)).replace(/\\/g,'/');
    const lower=raw.toLowerCase();
    let requestPath=lower;
    const marker=`/${prefix.toLowerCase()}/`;const mi=lower.indexOf(marker);if(mi>=0)requestPath=lower.slice(mi+marker.length);
    else if(!/^[a-z]+:/i.test(raw))requestPath=normalizeRel(raw);
    requestPath=normalizeRel(requestPath);
    const based=normalizeRel(baseDir?`${baseDir}/${requestPath}`:requestPath);
    if(byRelative.has(based))return byRelative.get(based);
    if(byRelative.has(requestPath))return byRelative.get(requestPath);
    const rels=Array.from(byRelative.entries()).sort((a,b)=>b[0].length-a[0].length);
    for (const [rel, objectUrl] of rels) if (normalizeRel(lower).endsWith('/'+rel)||normalizeRel(lower)===rel) return objectUrl;
    const bn=basename(url);if(byName.has(bn))return byName.get(bn);
    // Some converted MMD packs rename a texture extension without changing the stem (for example
    // .spa/.sph <-> .bmp, or a TGA converted to PNG). If the stem is unique, accept that alias.
    const stem=stemName(bn),candidates=byStem.get(stem)||[];
    if(candidates.length===1)return candidates[0].url;
    const reqExt=ext(bn),imageExt=new Set(['png','jpg','jpeg','bmp','webp','gif','tga','spa','sph','dds']);
    if(imageExt.has(reqExt)){const imageCandidates=candidates.filter(c=>imageExt.has(ext(c.name)));if(imageCandidates.length===1)return imageCandidates[0].url;}
    return null;
  }
  function markMissing(url) {
    if (!url) return;
    try { missing.add(decodeURIComponent(String(url)).replace(/\\/g, '/')); } catch (_) { missing.add(String(url)); }
  }
  manager.setURLModifier(url => {
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    const found = resolveLocal(url);
    if (found) return found;
    const e = ext(basename(url));
    if (textureExtensions.has(e)) {
      markMissing(url);
      return e === 'tga' ? fallbackTga : fallbackPng;
    }
    return url;
  });
  return {
    manager, prefix, missing, loadErrors,
    setBase(file){const rel=normalizeRel(file?.__relativePath||file?.webkitRelativePath||file?.name||'');const i=rel.lastIndexOf('/');baseDir=i>=0?rel.slice(0,i):'';},
    virtual(file) { return virtualUrl(prefix, file); },
    resolveFile(path) { return resolveLocal(path); },
    markMissing,
    markLoadError(url){if(url)loadErrors.add(String(url));},
    onIdle(cb) { if (idle) setTimeout(cb, 0); else idleCallbacks.push(cb); },
    dispose() { urls.forEach(u => URL.revokeObjectURL(u)); }
  };
}

// MMDroid material / render-pipeline builder.
// three r171 keeps the PMX parser/geometry/IK path, but its legacy MMD material path is brittle on
// Android and does not execute PMX material/UV morphs. We replace the MaterialBuilder and retain
// the parsed PMX morph data for the runtime morph layer below.
const toonGradientCache=new Map();
const textureAlphaCache=new WeakMap();
function mmdTextureName(data, material) {
  if (!material) return '';
  if (data?.metadata?.format === 'pmd') {
    const raw=String(material.fileName||'');
    return raw ? raw.split('*')[0] : '';
  }
  const index=Number(material.textureIndex);
  return Number.isInteger(index) && index >= 0 ? String(data?.textures?.[index]||'') : '';
}
function mmdDiffuse(material) {
  const d=Array.isArray(material?.diffuse)?material.diffuse:[1,1,1,1];
  return [Number.isFinite(+d[0])?+d[0]:1,Number.isFinite(+d[1])?+d[1]:1,Number.isFinite(+d[2])?+d[2]:1,Number.isFinite(+d[3])?+d[3]:1];
}
function mmdVec3(v,fallback=0){return [0,1,2].map(i=>Number.isFinite(+v?.[i])?+v[i]:fallback);}
function classifyMmdMaterial(src,textureName=''){
  const text=`${src?.name||''} ${src?.englishName||src?.nameEn||''} ${src?.comment||''} ${textureName||''}`.toLowerCase();
  if(/namida|ナミダ|なみだ|涙|tear|teardrop|泪|涙目/.test(text))return 'tear';
  if(/目影|eye.?shadow|eyeshadow|瞳影|highlight|ハイライト/.test(text))return 'eyeOverlay';
  if(/瞳|虹彩|hitomi|iris|pupil|eye/.test(text))return 'eye';
  if(/face|顔|肌|skin|body|hada|頬|cheek/.test(text))return 'skin';
  if(/hairshad|hair.?shadow|髪影/.test(text))return 'hairOverlay';
  if(/hair|髪|前髪|後髪/.test(text))return 'hair';
  if(/stocking|pantyhose|hosiery|tights|ストッキング|タイツ|丝袜|絲襪|连裤袜|連褲襪/.test(text))return 'hosiery';
  if(/cloth|服|衣|skirt|スカート|dress|ribbon|リボン|lace|レース|frill|フリル|靴下|袜|veil|シースルー|mesh|薄纱|薄紗/.test(text))return 'cloth';
  return 'generic';
}
function toonGradientTexture(style='classic',role='generic',bands=4){
  bands=Math.max(2,Math.min(8,Math.round(Number(bands)||4)));
  const key=`${style}:${role}:${bands}`;if(toonGradientCache.has(key))return toonGradientCache.get(key);
  const data=new Uint8Array(bands*4);
  for(let i=0;i<bands;i++){
    const t=i/(bands-1);let r,g,b;
    if(style==='genshin'){
      const shadow=role==='skin'||role==='eye'?[0.50,0.34,0.34]:role==='hair'?[0.38,0.42,0.56]:[0.43,0.45,0.52];
      const k=Math.pow(t,0.72);r=shadow[0]+(1-shadow[0])*k;g=shadow[1]+(1-shadow[1])*k;b=shadow[2]+(1-shadow[2])*k;
    }else{const v=.38+.62*Math.pow(t,.8);r=g=b=v;}
    data[i*4]=Math.round(clamp(r,0,1)*255);data[i*4+1]=Math.round(clamp(g,0,1)*255);data[i*4+2]=Math.round(clamp(b,0,1)*255);data[i*4+3]=255;
  }
  const tex=new THREE.DataTexture(data,bands,1,THREE.RGBAFormat);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;tex.needsUpdate=true;toonGradientCache.set(key,tex);return tex;
}

function chainMaterialCompilePatch(mat,tag,patch){
  if(!mat||typeof patch!=='function')return;
  const prev=mat.onBeforeCompile;
  const prevKey=mat.customProgramCacheKey?.bind(mat);
  mat.onBeforeCompile=shader=>{ if(typeof prev==='function')prev(shader); patch(shader); };
  mat.customProgramCacheKey=()=>`${prevKey?prevKey():mat.type}:${tag}`;
}
function alphaResponseValues(){
  return {cloth:clamp(num(ui.clothAlphaBoost,state.clothAlphaBoost||1.28),.75,1.8),hosiery:clamp(num(ui.hosieryOpacity,state.hosieryOpacity||.48),.18,.85)};
}
function applyAlphaResponsePatch(mat,role){
  if(!mat||!['cloth','hosiery'].includes(role))return;
  chainMaterialCompilePatch(mat,`alpha-response-${role}-v2`,shader=>{
    const a=alphaResponseValues();
    shader.uniforms.mmdroidClothAlphaBoost={value:a.cloth};
    shader.uniforms.mmdroidHosieryOpacity={value:a.hosiery};
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>\nuniform float mmdroidClothAlphaBoost;\nuniform float mmdroidHosieryOpacity;`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <alphatest_fragment>',`
      ${role==='cloth'?'if ( diffuseColor.a < 0.999 ) diffuseColor.a = clamp( pow(max(diffuseColor.a,0.0), 0.68) * mmdroidClothAlphaBoost, 0.0, 1.0 );':'diffuseColor.a = clamp( diffuseColor.a * mmdroidHosieryOpacity, 0.0, 0.88 );'}
      #include <alphatest_fragment>`);
    mat.userData._mmdroidShader=shader;
  });
}
function updateAlphaResponseUniforms(){
  const a=alphaResponseValues();state.clothAlphaBoost=a.cloth;state.hosieryOpacity=a.hosiery;
  if(ui.clothAlphaBoostOut)ui.clothAlphaBoostOut.value=a.cloth.toFixed(2);
  if(ui.hosieryOpacityOut)ui.hosieryOpacityOut.value=a.hosiery.toFixed(2);
  for(const rec of state.objects)for(const m of rec.materials||[]){const sh=m.userData?._mmdroidShader;if(!sh?.uniforms)continue;if(sh.uniforms.mmdroidClothAlphaBoost)sh.uniforms.mmdroidClothAlphaBoost.value=a.cloth;if(sh.uniforms.mmdroidHosieryOpacity)sh.uniforms.mmdroidHosieryOpacity.value=a.hosiery;}
}
function applyHairFiberPatch(mat,pipeline){
  if(!mat)return;
  chainMaterialCompilePatch(mat,`hair-fiber-${pipeline}-v2`,shader=>{
    shader.uniforms.mmdroidHairSheen={value:pipelineUsesPhysical(pipeline)?.22:.14};
    shader.uniforms.mmdroidHairRim={value:new THREE.Color(.82,.87,1.0)};
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>\nuniform float mmdroidHairSheen;\nuniform vec3 mmdroidHairRim;`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
      float mmdHairNdotV=clamp(dot(normalize(normal),normalize(vViewPosition)),0.0,1.0);
      float mmdHairRibbon=pow(max(0.0,1.0-abs(mmdHairNdotV-0.56)*2.15),7.0);
      float mmdHairEdge=pow(1.0-mmdHairNdotV,3.4);
      outgoingLight += vec3(mmdHairRibbon*mmdroidHairSheen) + mmdroidHairRim*mmdHairEdge*0.055;
      #include <opaque_fragment>`);
    mat.userData._mmdroidShader=shader;
  });
}
function applyRampCelPatch(mat,role){
  const shadow=role==='skin'||role==='eye'?new THREE.Color(.72,.58,.56):role==='hair'?new THREE.Color(.56,.61,.72):new THREE.Color(.63,.66,.72);
  chainMaterialCompilePatch(mat,`ramp-cel-v4-${role}`,shader=>{
    shader.uniforms.mmdroidCelShadow={value:shadow};
    shader.uniforms.mmdroidCelBands={value:Math.max(2,Math.min(8,state.toonBands||4))};
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>\nuniform vec3 mmdroidCelShadow;\nuniform float mmdroidCelBands;`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
      float mmdBase=max(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),.04);
      float mmdLum=max(dot(outgoingLight,vec3(.2126,.7152,.0722)),0.0);
      float mmdRatio=clamp(mmdLum/mmdBase,0.0,1.45);
      float mmdQ=floor(clamp(mmdRatio,0.0,0.999)*mmdroidCelBands)/max(1.0,mmdroidCelBands-1.0);
      vec3 mmdShadowed=diffuseColor.rgb*mmdroidCelShadow;
      vec3 mmdLit=diffuseColor.rgb*(1.02+0.09*mmdQ);
      outgoingLight=mix(mmdShadowed,mmdLit,smoothstep(.22,.76,mmdQ));
      float mmdNdotV=clamp(dot(normalize(normal),normalize(vViewPosition)),0.0,1.0);
      float mmdRim=step(.78,pow(1.0-mmdNdotV,2.3))*0.045;
      float mmdSpec=step(1.04,mmdRatio)*${role==='eye'?'.24':role==='hair'?'.12':'.045'};
      outgoingLight += vec3(mmdSpec+mmdRim);
      #include <opaque_fragment>`);
    mat.userData._mmdroidShader=shader;
  });
}

function genshinRoleParams(role){
  if(role==='skin'||role==='eye')return{deep:new THREE.Color(.58,.46,.45),shadow:new THREE.Color(.82,.69,.66),t0:.55,t1:.82,rim:.30};
  if(role==='hair'||role==='hairOverlay')return{deep:new THREE.Color(.20,.27,.45),shadow:new THREE.Color(.43,.50,.72),t0:.50,t1:.78,rim:.72};
  if(role==='cloth'||role==='hosiery')return{deep:new THREE.Color(.28,.31,.43),shadow:new THREE.Color(.56,.59,.75),t0:.53,t1:.80,rim:.45};
  return{deep:new THREE.Color(.27,.31,.43),shadow:new THREE.Color(.58,.61,.74),t0:.53,t1:.80,rim:.42};
}
function applyGenshinShaderPatch(mat,role){
  const p=genshinRoleParams(role);
  chainMaterialCompilePatch(mat,`layered-anime-npr-v5-${role}`,shader=>{
    shader.uniforms.mmdroidDeepTint={value:p.deep.clone()};
    shader.uniforms.mmdroidShadowTint={value:p.shadow.clone()};
    shader.uniforms.mmdroidRimColor={value:new THREE.Color(ui.rimColor?.value||'#d8c7ff')};
    shader.uniforms.mmdroidThreshold0={value:p.t0};
    shader.uniforms.mmdroidThreshold1={value:p.t1};
    shader.uniforms.mmdroidRimPower={value:role==='hair'?2.0:2.7};
    shader.uniforms.mmdroidRimStrength={value:p.rim*Math.max(.22,num(ui.rimLight,.70))};
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
uniform vec3 mmdroidDeepTint;
uniform vec3 mmdroidShadowTint;
uniform vec3 mmdroidRimColor;
uniform float mmdroidThreshold0;
uniform float mmdroidThreshold1;
uniform float mmdroidRimPower;
uniform float mmdroidRimStrength;`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
      float mmdBaseLum=max(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),.035);
      float mmdLitLum=max(dot(outgoingLight,vec3(.2126,.7152,.0722)),0.0);
      float mmdRatio=clamp(mmdLitLum/mmdBaseLum,0.0,1.55);
      float z0=smoothstep(mmdroidThreshold0-.025,mmdroidThreshold0+.025,mmdRatio);
      float z1=smoothstep(mmdroidThreshold1-.022,mmdroidThreshold1+.022,mmdRatio);
      vec3 deep=diffuseColor.rgb*mmdroidDeepTint;
      vec3 shade=diffuseColor.rgb*mmdroidShadowTint;
      vec3 base=diffuseColor.rgb*1.035;
      vec3 hi=diffuseColor.rgb*1.12;
      outgoingLight=mix(deep,shade,z0);
      outgoingLight=mix(outgoingLight,base,z1);
      float hiGate=smoothstep(1.02,1.20,mmdRatio);
      outgoingLight=mix(outgoingLight,hi,hiGate*.58);
      float mmdNdotV=clamp(dot(normalize(normal),normalize(vViewPosition)),0.0,1.0);
      float mmdRim=pow(1.0-mmdNdotV,mmdroidRimPower);
      float roleSpec=${role==='hair'?'pow(max(mmdNdotV,0.0),11.0)*0.18':role==='eye'?'pow(max(mmdNdotV,0.0),24.0)*0.28':role==='skin'?'pow(max(mmdNdotV,0.0),18.0)*0.045':'pow(max(mmdNdotV,0.0),14.0)*0.07'};
      outgoingLight += vec3(roleSpec) + mmdroidRimColor*mmdRim*mmdroidRimStrength;
      #include <opaque_fragment>`);
    mat.userData._mmdroidShader=shader;
  });
}
function updatePipelineShaderUniforms(overrides=null){
  const rim=new THREE.Color(overrides?.rimColor||ui.rimColor?.value||'#f0e7ff'),strength=Math.max(.16,Number(overrides?.rim??num(ui.rimLight,.70)))*Math.max(.55,pipelineProfile().lightGain);
  for(const rec of state.objects)for(const m of rec.materials||[]){const sh=m.userData?._mmdroidShader;if(!sh?.uniforms)continue;if(sh.uniforms.mmdroidRimColor)sh.uniforms.mmdroidRimColor.value.copy(rim);if(sh.uniforms.mmdroidRimStrength){const role=m.userData?._mmdroidRole||'generic';sh.uniforms.mmdroidRimStrength.value=genshinRoleParams(role).rim*strength;}}
}

const pipelineProfiles={
  mmdPhong:{label:'Studio Blinn–Phong Character',lightGain:.64,exposure:.96,env:.00,dither:true},
  blenderPbr:{label:'GGX IBL Principled PBR',lightGain:.28,exposure:.88,env:.42,dither:true},
  skinOily:{label:'Dual-Lobe Dermal Specular',lightGain:.25,exposure:.86,env:.34,dither:true},
  skinSilicone:{label:'Polymer SSS Approximation',lightGain:.27,exposure:.88,env:.28,dither:true},
  toonClassic:{label:'Multi-Band Cel NPR',lightGain:.62,exposure:.96,env:.02,dither:false},
  genshin:{label:'Layered Anime NPR',lightGain:.58,exposure:.96,env:.02,dither:false},
  unlit:{label:'Unlit Diagnostic',lightGain:0,exposure:1.00,env:0,dither:false}
};
const skinPresets={
  natural:{label:'Natural Neutral',tint:new THREE.Color('#b97869'),mix:.025,roughness:.50,specular:.34,clearcoat:.018,coatRough:.42,sheen:.018,scatter:.035},
  warm:{label:'Warm Dermal',tint:new THREE.Color('#b86f5f'),mix:.045,roughness:.47,specular:.37,clearcoat:.024,coatRough:.38,sheen:.024,scatter:.050},
  porcelain:{label:'Porcelain Matte',tint:new THREE.Color('#c99a8e'),mix:.030,roughness:.61,specular:.28,clearcoat:.010,coatRough:.52,sheen:.014,scatter:.026},
  tan:{label:'Sun-Kissed',tint:new THREE.Color('#95513f'),mix:.070,roughness:.49,specular:.34,clearcoat:.018,coatRough:.42,sheen:.022,scatter:.045},
  sebum:{label:'Sebum Gloss',tint:new THREE.Color('#b87564'),mix:.032,roughness:.34,specular:.46,clearcoat:.25,coatRough:.16,sheen:.035,scatter:.045},
  silicone:{label:'Soft Silicone',tint:new THREE.Color('#bd8174'),mix:.038,roughness:.46,specular:.36,clearcoat:.08,coatRough:.31,sheen:.24,scatter:.115}
};
function pipelineProfile(p=state.renderPipeline){return pipelineProfiles[p]||pipelineProfiles.mmdPhong;}
function pipelineUsesPhysical(p=state.renderPipeline){return p==='blenderPbr'||p==='skinOily'||p==='skinSilicone';}
function currentSkinPreset(){
  const key=state.skinPreset||ui.skinPreset?.value||'natural';
  return skinPresets[key]||skinPresets.natural;
}
function skinPresetStrength(){return clamp(Number.isFinite(Number(state.skinPresetStrength))?Number(state.skinPresetStrength):num(ui.skinPresetStrength,.70),0,1);}
function skinPresetMaterialValues(pipeline=state.renderPipeline){
  const neutral=skinPresets.natural, chosen=currentSkinPreset(), strength=skinPresetStrength();
  const mix=(a,b,t)=>a+(b-a)*t;
  let v={
    tint:neutral.tint.clone().lerp(chosen.tint,strength),
    tintMix:mix(neutral.mix,chosen.mix,strength)*strength,
    roughness:mix(neutral.roughness,chosen.roughness,strength),
    specular:mix(neutral.specular,chosen.specular,strength),
    clearcoat:mix(neutral.clearcoat,chosen.clearcoat,strength),
    coatRough:mix(neutral.coatRough,chosen.coatRough,strength),
    sheen:mix(neutral.sheen,chosen.sheen,strength),
    scatter:mix(neutral.scatter,chosen.scatter,strength)
  };
  // Pipeline controls the shading model while the user-selected preset remains the base skin.
  // This deliberately avoids the old behaviour where Dermal/Silicone silently replaced the preset.
  if(pipeline==='skinOily'){
    v.roughness=clamp(v.roughness*.76,.24,.46);v.specular=clamp(v.specular+.11,.38,.58);
    v.clearcoat=clamp(v.clearcoat+.20,.18,.34);v.coatRough=clamp(v.coatRough*.58,.11,.24);v.scatter=Math.max(v.scatter,.045);
  }else if(pipeline==='skinSilicone'){
    v.roughness=clamp(v.roughness*.96+.015,.36,.60);v.specular=clamp(v.specular+.03,.32,.48);
    v.clearcoat=clamp(v.clearcoat+.055,.06,.16);v.coatRough=clamp(v.coatRough+.02,.24,.42);v.sheen=clamp(v.sheen+.18,.18,.42);v.scatter=Math.max(v.scatter,.105);
  }
  return v;
}
function applySkinPresetColor(color,role){
  if(role!=='skin')return color;
  const p=skinPresetMaterialValues();
  return color.clone().lerp(p.tint,p.tintMix);
}
function liftedTextureColor(color,role,hasTexture,pipeline){
  if(!hasTexture)return color;
  const lum=.2126*color.r+.7152*color.g+.0722*color.b;
  // PMX diffuse is a multiplier. Many converted models bake the visible colour into the texture
  // but also export a mid-grey diffuse; multiplying both causes the persistent grey cast. Keep
  // deliberately dark materials dark, otherwise move the multiplier toward neutral white.
  if(lum<.16)return color;
  let amount=role==='skin'?.92:role==='eye'?.20:role==='cloth'?.34:role==='hosiery'?.18:role==='hair'?.20:.28;
  if(pipeline==='toonClassic'||pipeline==='genshin')amount*=.74;
  return color.clone().lerp(new THREE.Color(1,1,1),amount);
}
function applyContinuousDithering(mat,pipeline=state.renderPipeline){
  if(!mat)return;const enable=!!pipelineProfile(pipeline).dither;mat.dithering=enable;
  // alphaToCoverage is deterministic and helps cutout edges under MSAA without the crawling noise
  // that alphaHash can produce on moving cloth/hair.
  if('alphaToCoverage' in mat && mat.userData?._mmdroidResolvedAlphaMode!=='hairSoft')mat.alphaToCoverage=false;
}
function applySkinSurfacePatch(mat,style='natural'){
  chainMaterialCompilePatch(mat,`hs2-skin-${style}-v4`,shader=>{
    const preset=skinPresetMaterialValues(state.renderPipeline),scatter=style==='silicone'?Math.max(.10,preset.scatter):style==='oily'?Math.max(.045,preset.scatter):Math.max(.028,preset.scatter),tint=preset.tint.clone();
    shader.uniforms.mmdroidSkinScatter={value:scatter};shader.uniforms.mmdroidSkinTint={value:tint};shader.uniforms.mmdroidSkinRimSoft={value:style==='silicone'?.72:style==='oily'?.42:.54};
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
uniform float mmdroidSkinScatter;
uniform vec3 mmdroidSkinTint;
uniform float mmdroidSkinRimSoft;`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
      float mmdSkinNdotV=clamp(dot(normalize(normal),normalize(vViewPosition)),0.0,1.0);
      float mmdSkinBase=max(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)),.025);
      float mmdSkinLit=max(dot(outgoingLight,vec3(.2126,.7152,.0722)),0.0);
      float mmdSkinShadow=1.0-smoothstep(.28,.92,mmdSkinLit/max(mmdSkinBase,.025));
      float mmdSkinRim=pow(1.0-mmdSkinNdotV,2.25);
      vec3 mmdSkinSub=mix(diffuseColor.rgb,mmdroidSkinTint,.20);
      outgoingLight += mmdSkinSub*mmdroidSkinScatter*(mmdSkinShadow*.16 + mmdSkinRim*mmdroidSkinRimSoft*.055);
      float mmdSkinLum=max(dot(outgoingLight,vec3(.2126,.7152,.0722)),.001);
      vec3 mmdSkinChroma=clamp(diffuseColor.rgb/max(mmdSkinBase,.035),vec3(.76),vec3(1.24));
      outgoingLight *= mix(vec3(1.0),mmdSkinChroma,.055);
      #include <opaque_fragment>`);
    mat.userData._mmdroidShader=shader;
  });
}
function prepareHairGeometry(root){
  root?.traverse?.(o=>{
    if(!o.isMesh&&!o.isSkinnedMesh)return;
    const mats=Array.isArray(o.material)?o.material:[o.material];
    const hairSlots=new Set();mats.forEach((m,i)=>{if(m?.userData?._mmdroidRole==='hair')hairSlots.add(i);});
    if(!hairSlots.size)return;
    const g=o.geometry,pos=g?.attributes?.position,nrm=g?.attributes?.normal;if(!g||!pos||!nrm)return;
    for(const i of hairSlots){const m=mats[i];if(m){m.side=THREE.DoubleSide;if('flatShading' in m)m.flatShading=false;m.needsUpdate=true;}}
    const ids=new Set(),idx=g.index,groups=(g.groups?.length?g.groups:[{start:0,count:idx?idx.count:pos.count,materialIndex:0}]);
    for(const gr of groups){if(!hairSlots.has(Number(gr.materialIndex)||0))continue;const stop=Math.min((gr.start||0)+(gr.count||0),idx?idx.count:pos.count);for(let k=gr.start||0;k<stop;k++)ids.add(idx?idx.getX(k):k);}
    if(ids.size>1){
      g.computeBoundingBox?.();const diag=g.boundingBox?g.boundingBox.getSize(new THREE.Vector3()).length():1,eps=Math.max(1e-6,diag*2.2e-5),q=1/eps,buckets=new Map();
      for(const i of ids){const key=`${Math.round(pos.getX(i)*q)},${Math.round(pos.getY(i)*q)},${Math.round(pos.getZ(i)*q)}`;const a=buckets.get(key)||[];a.push(i);buckets.set(key,a);}
      const v=new THREE.Vector3(),t=new THREE.Vector3();
      for(const list of buckets.values()){if(list.length<2)continue;v.set(0,0,0);for(const i of list)v.add(t.set(nrm.getX(i),nrm.getY(i),nrm.getZ(i)).normalize());if(v.lengthSq()<1e-10)continue;v.normalize();for(const i of list){t.set(nrm.getX(i),nrm.getY(i),nrm.getZ(i)).normalize().lerp(v,.94).normalize();nrm.setXYZ(i,t.x,t.y,t.z);}}
      nrm.needsUpdate=true;g.normalizeNormals?.();
    }
    try{if(g.index&&g.attributes?.uv&&g.attributes?.normal)g.computeTangents?.();}catch(_){}
  });
}
const textureQualityProfiles={performance:{pixel:1.0,aniso:2,label:'性能'},balanced:{pixel:1.6,aniso:8,label:'均衡'},high:{pixel:2.5,aniso:999,label:'高清'},ultra:{pixel:3.5,aniso:999,label:'超清'}};
function textureQualityProfile(){return textureQualityProfiles[state.textureQuality]||textureQualityProfiles.high;}
function configureTextureSampling(tex){
  if(!tex)return;const q=textureQualityProfile(),max=Math.max(1,renderer.capabilities.getMaxAnisotropy?.()||1);tex.anisotropy=Math.min(max,q.aniso);tex.magFilter=THREE.LinearFilter;tex.minFilter=state.textureQuality==='ultra'?THREE.LinearMipmapNearestFilter:THREE.LinearMipmapLinearFilter;tex.generateMipmaps=true;tex.needsUpdate=true;
}
function applyTextureQualitySettings(notify=false){
  state.textureQuality=ui.textureQuality?.value||state.textureQuality||'high';
  state.textureSharpness=clamp(num(ui.textureSharpness,state.textureSharpness??.55),0,1);
  const q=textureQualityProfile(),ratio=Math.min(window.devicePixelRatio||1,q.pixel);renderer.setPixelRatio(ratio);composer.setPixelRatio?.(ratio);
  for(const rec of state.objects)for(const m of rec.materials||[])for(const key of ['map','alphaMap','normalMap','roughnessMap','metalnessMap','emissiveMap'])configureTextureSampling(m?.[key]);
  const renderW=Math.max(1,Math.round(innerWidth*ratio)),renderH=Math.max(1,Math.round(innerHeight*ratio));
  textureDetailPass.uniforms.texelSize.value.set(1/renderW,1/renderH);
  textureDetailPass.uniforms.amount.value=state.textureSharpness*.62;
  textureDetailPass.enabled=state.textureSharpness>.005;
  if(ui.textureSharpnessOut)ui.textureSharpnessOut.value=state.textureSharpness.toFixed(2);
  if(ui.textureQualityInfo){const max=Math.max(1,renderer.capabilities.getMaxAnisotropy?.()||1);ui.textureQualityInfo.textContent=`${q.label}：渲染像素比 ${ratio.toFixed(2)}× · 各向异性 ${Math.min(max,q.aniso)}× · 三线性 Mipmap · 细节锐化 ${state.textureSharpness.toFixed(2)}。`; }
  renderer.setSize(innerWidth,innerHeight,false);outlineEffect.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);if(notify)showToast(`纹理质量：${q.label} · 锐化 ${state.textureSharpness.toFixed(2)}`);
}
function syncToneMappingForPipeline(){
  const p=pipelineProfile();
  renderer.toneMapping=pipelineUsesPhysical()?((THREE.NeutralToneMapping??THREE.ACESFilmicToneMapping)):THREE.NoToneMapping;
  renderer.toneMappingExposure=num(ui.exposure,1)*p.exposure;
  // Continuous pipelines need final-frame de-banding, not normal smoothing. A small static
  // screen-space dither breaks 8-bit gradient bands without shimmering during animation.
  antiBandingPass.enabled=!!p.dither;
  antiBandingPass.uniforms.strength.value=(pipelineUsesPhysical()?1.75:1.45)/255.0;
}

function analyzeTextureAlpha(tex){
  if(!tex)return null;if(textureAlphaCache.has(tex))return textureAlphaCache.get(tex);
  let stats=null;try{
    const image=tex.image||tex.source?.data;if(!image)return null;let data,w,h;
    if(image.data&&Number(image.width)>0&&Number(image.height)>0){data=image.data;w=image.width;h=image.height;}
    else if(Number(image.naturalWidth||image.width)>0){w=image.naturalWidth||image.width;h=image.naturalHeight||image.height;const scale=Math.min(1,96/Math.max(w,h)),cw=Math.max(1,Math.round(w*scale)),ch=Math.max(1,Math.round(h*scale));const c=document.createElement('canvas');c.width=cw;c.height=ch;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,cw,ch);const d=ctx.getImageData(0,0,cw,ch);data=d.data;w=cw;h=ch;}
    if(data&&data.length>=w*h*4){let translucent=0,partial=0,transparent=0,opaque=0,sum=0,total=w*h,min=255,max=0;for(let i=3;i<data.length;i+=4){const a=data[i];sum+=a;min=Math.min(min,a);max=Math.max(max,a);if(a<253)translucent++;if(a<=8)transparent++;else if(a<247)partial++;else opaque++;}stats={translucentFraction:translucent/total,partialFraction:partial/total,transparentFraction:transparent/total,opaqueFraction:opaque/total,meanAlpha:(sum/total)/255,minAlpha:min/255,maxAlpha:max/255};}
  }catch(err){console.warn('alpha scan',err);}textureAlphaCache.set(tex,stats);return stats;
}
function materialMorphElementChangesAlpha(el){
  if(!el)return false;
  const identity=Number(el.type)===0?1:0;
  const changed=v=>Number.isFinite(Number(v))&&Math.abs(Number(v)-identity)>1e-5;
  // Only diffuse/texture alpha affects the base surface opacity in our runtime. Color-only
  // material morphs must NOT force a whole face/clothing material into the transparent pass.
  return changed(el.diffuse?.[3])||changed(el.textureColor?.[3]);
}
function alphaMorphMaterialIndices(data) {
  const out=new Set(),count=Number(data?.metadata?.materialCount)||Number(data?.materials?.length)||0;
  for(const morph of data?.morphs||[]){
    if(morph?.type!==8)continue;
    for(const el of morph.elements||[]){
      if(!materialMorphElementChangesAlpha(el))continue;
      const idx=Number(el.index);
      if(idx===-1){for(let i=0;i<count;i++)out.add(i);}
      else if(Number.isInteger(idx)&&idx>=0)out.add(idx);
    }
  }
  return out;
}
function applyMaterialAlphaMode(mat,mode='auto',opacity=getMaterialOpacity(mat,1),stats=null){
  if(!mat)return;
  mat.userData=mat.userData||{};
  const role=mat.userData._mmdroidRole||'generic';
  const alphaMorph=!!mat.userData._mmdroidAlphaMorph;
  const override=mat.userData._mmdroidAlphaModeOverride||'auto';
  mode=override!=='auto'?override:mode;let resolved=mode;
  if(mode==='auto'){
    // Skin is special: a face/body texture often contains soft alpha at UV islands or unused
    // pixels. That must NEVER make the whole skin material semi-transparent. Only an actual PMX
    // material/morph opacity below 1 may blend skin; otherwise skin stays opaque, with cutout used
    // only when the texture contains genuinely empty pixels.
    if(role==='tear')resolved='additive';
    else if(role==='skin'&&opacity>=.995){
      resolved=(stats?.transparentFraction>.003&&stats?.opaqueFraction>.10)?'cutout':'opaque';
    }
    else if(role==='eyeOverlay'||role==='hairOverlay')resolved='blend';
    else if(role==='hair'&&stats?.translucentFraction>.001)resolved='hairSoft';
    else if(role==='hosiery')resolved='hybrid';
    else if(opacity<.995)resolved='blend';
    // Texture alpha on normal clothing/hair is normally a mask. Mixed solid + partial alpha uses
    // stable blend; binary/edge alpha uses cutout.
    else if(stats?.partialFraction>.002&&stats?.opaqueFraction>.02)resolved='hybrid';
    else if(stats?.translucentFraction>.001)resolved='cutout';
    else resolved='opaque';
  }
  mat.alphaTest=0;mat.premultipliedAlpha=false;mat.blending=THREE.NormalBlending;mat.depthTest=true;
  mat.forceSinglePass=false;if('alphaHash' in mat)mat.alphaHash=false;
  if(resolved==='opaque'){
    mat.transparent=false;mat.depthWrite=true;
  }else if(resolved==='cutout'){
    mat.transparent=false;mat.depthWrite=true;mat.alphaTest=Number(mat.userData._mmdroidAlphaCutoff??0.08);
  }else if(resolved==='hairSoft'){
    mat.transparent=false;mat.depthWrite=true;mat.depthTest=true;mat.alphaTest=Math.min(.045,Number(mat.userData._mmdroidAlphaCutoff??.035));mat.side=THREE.DoubleSide;mat.forceSinglePass=true;
    if('alphaToCoverage' in mat)mat.alphaToCoverage=true;
  }else if(resolved==='hybrid'){
    // Stable hybrid transparency. AlphaHash can visibly crawl on animated cloth because the hashed
    // coverage pattern changes as the surface moves. Use deterministic single-pass alpha blending
    // with a small depth offset instead; opaque texels remain visually solid while lace/stockings
    // keep their per-pixel alpha.
    mat.transparent=true;mat.depthWrite=false;mat.depthTest=true;mat.alphaTest=0;mat.blending=THREE.NormalBlending;mat.forceSinglePass=true;
    if('alphaHash' in mat)mat.alphaHash=false;
  }else if(resolved==='additive'){
    mat.transparent=true;mat.depthWrite=false;mat.blending=THREE.AdditiveBlending;mat.forceSinglePass=true;
  }else if(resolved==='multiply'){
    mat.transparent=true;mat.depthWrite=false;mat.blending=THREE.MultiplyBlending;mat.forceSinglePass=true;
  }else{
    // Never write depth for true alpha-blended cloth/face overlays.  Skin is rendered in the
    // opaque pass first, so semi-transparent fabric can correctly reveal it instead of erasing it.
    mat.transparent=true;mat.depthWrite=false;mat.blending=THREE.NormalBlending;
    if(role==='cloth'||role==='eyeOverlay'||role==='hairOverlay')mat.forceSinglePass=true;
  }
  const overlayLike=role==='tear'||role==='eyeOverlay'||role==='hairOverlay';
  const clothBlend=(role==='cloth'||role==='hosiery')&&(resolved==='blend'||resolved==='hybrid'||resolved==='additive');
  mat.polygonOffset=overlayLike||clothBlend;
  mat.polygonOffsetFactor=overlayLike?-1.25:clothBlend?-.22:0;
  mat.polygonOffsetUnits=overlayLike?-1.25:clothBlend?-.22:0;
  mat.userData._mmdroidResolvedAlphaMode=resolved;applyContinuousDithering(mat);mat.needsUpdate=true;
}
function attachMmdTexture(mat, pack, path) {
  if (!path) return false;
  const url=pack.resolveFile(path);
  if (!url) { pack.markMissing(path); return false; }
  const onLoad=tex=>{
    tex.flipY=false; tex.wrapS=THREE.RepeatWrapping; tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;configureTextureSampling(tex);
    mat.map=tex;mat._mmdroidSavedMap=tex;const stats=analyzeTextureAlpha(tex);mat.userData._mmdroidTextureAlpha=stats;applyMaterialAlphaMode(mat,'auto',getMaterialOpacity(mat,1),stats);mat.needsUpdate=true;markRenderDirty();
  };
  const onError=()=>{
    if(pack.resolveFile(path))pack.markLoadError?.(path);else pack.markMissing(path);mat.map=null;
    // A failed eye texture must not fall back to pure PMX white, otherwise irises look like a
    // blank sclera.  Use a visible diagnostic fallback while keeping other materials neutral.
    const role=mat.userData?._mmdroidRole||'generic';
    if(mat.color){if(role==='eye')mat.color.setRGB(.32,.34,.38);else if(role==='tear')mat.color.setRGB(1,1,1);else mat.color.setRGB(.78,.78,.78);}
    if(role==='tear')setMaterialOpacity(mat,0);
    mat.needsUpdate=true;
  };
  let loader;const e=ext(path);if(e==='tga')loader=new TGALoader(pack.manager);else if(e==='dds')loader=new DDSLoader(pack.manager);else loader=new THREE.TextureLoader(pack.manager);
  try { loader.load(url,onLoad,undefined,onError); return true; } catch (_) { onError(); return false; }
}
function createPipelineMaterial(src,textureName,pack,format,index,alphaMorph=false,pipeline=state.renderPipeline){
  const [r,g,b,a]=mmdDiffuse(src),role=classifyMmdMaterial(src,textureName),resolvedFile=textureName?pack.resolveFile(textureName):null,hasTexture=!!resolvedFile;
  if(textureName&&!hasTexture)pack.markMissing(textureName);
  let rr=r,gg=g,bb=b;
  if(textureName&&!hasTexture){if(role==='eye')rr=.32,gg=.34,bb=.38;else rr=gg=bb=.78;}
  if(role==='tear'){rr=gg=bb=1;}
  let color=new THREE.Color(clamp(rr,0,1),clamp(gg,0,1),clamp(bb,0,1));color=liftedTextureColor(color,role,hasTexture,pipeline);color=applySkinPresetColor(color,role);
  let opacity=clamp(a,0,1);const sourceOpacity=opacity;if(role==='tear')opacity=0;else if(role==='skin'&&opacity>.50)opacity=1;const ambient=mmdVec3(src?.ambient,0),spec=mmdVec3(src?.specular,0),shin=Math.max(0,Number(src?.shininess)||0);
  const common={
    name:String(src?.name||`Material ${index+1}`),color,opacity,
    side:(format==='pmx'&&((Number(src?.flag)||0)&1))?THREE.DoubleSide:(opacity<.999?THREE.DoubleSide:THREE.FrontSide),
    fog:true
  };
  // MMD ambient is not physically identical to emissive.  Keep it weak so key/fill/rim lights
  // remain visible on the character instead of the material self-lighting itself flat.
  const emissiveScale=role==='eye'?0.012:role==='skin'?0.010:0.05;
  const emissive=new THREE.Color(ambient[0],ambient[1],ambient[2]).multiplyScalar(emissiveScale);
  let mat;
  if(role==='tear'){
    // Most namida/tear cards use black as empty space. Additive makes black contribute zero while
    // preserving the bright tear/highlight pixels. Material morphs control when it appears.
    mat=new THREE.MeshBasicMaterial({...common,toneMapped:false});
  }else if(pipelineUsesPhysical(pipeline)){
    const sourceRough=clamp(Math.sqrt(2/(shin+2)),.10,.96),skin=skinPresetMaterialValues(pipeline);
    let roleRough=role==='skin'?skin.roughness:role==='eye'?.055:role==='hair'?.16:role==='cloth'?.78:role==='hosiery'?.54:sourceRough;
    let clearcoat=role==='eye'?.92:role==='hair'?.34:role==='skin'?skin.clearcoat:.01;
    let coatRough=role==='eye'?.035:role==='hair'?.12:role==='skin'?skin.coatRough:.45;
    let specularIntensity=role==='eye'?.92:role==='skin'?skin.specular:role==='hair'?.78:.34;
    let sheen=role==='cloth'?.18:role==='hosiery'?.14:role==='hair'?.48:role==='skin'?skin.sheen:.02;
    if(pipeline==='blenderPbr'){
      // Texture-first HS2-style body response: broad GGX, restrained white IBL and little clearcoat.
      roleRough=role==='skin'?clamp(skin.roughness+.015,.40,.66):roleRough;
      clearcoat=role==='skin'?Math.min(.08,skin.clearcoat+.015):clearcoat;
      specularIntensity=role==='skin'?Math.min(.44,skin.specular+.035):specularIntensity;
    }else if(pipeline==='skinOily'&&role==='skin'){
      // Dermal + sebum dual lobe: base skin stays coloured; the narrow lobe is intentionally restrained.
      roleRough=clamp(skin.roughness,.24,.46);clearcoat=clamp(skin.clearcoat,.18,.34);coatRough=clamp(skin.coatRough,.11,.24);
      specularIntensity=clamp(skin.specular,.38,.58);sheen=Math.max(.03,skin.sheen);
    }else if(pipeline==='skinSilicone'&&role==='skin'){
      // Soft polymer: wide lobe + stronger subsurface/sheens, not a white plastic coat.
      roleRough=clamp(skin.roughness,.36,.60);clearcoat=clamp(skin.clearcoat,.06,.16);coatRough=clamp(skin.coatRough,.24,.42);
      specularIntensity=clamp(skin.specular,.32,.48);sheen=clamp(skin.sheen,.18,.42);
    }
    mat=new THREE.MeshPhysicalMaterial({
      ...common,emissive,roughness:roleRough,metalness:0,
      envMapIntensity:Math.max(.025,num(ui.hdriIntensity,1)*pipelineProfile(pipeline).env*(role==='skin'?.52:role==='hair'?.88:1)),
      ior:role==='eye'?1.38:role==='skin'?1.43:1.48,
      clearcoat,clearcoatRoughness:coatRough,
      sheen,sheenRoughness:role==='cloth'?.72:role==='hosiery'?.60:role==='hair'?.20:role==='skin'?(pipeline==='skinSilicone'?.58:.48):.74,
      sheenColor:(role==='cloth'||role==='hosiery')?color.clone().lerp(new THREE.Color(1,1,1),.035):role==='hair'?color.clone().lerp(new THREE.Color(1,1,1),.055):skin.tint.clone(),
      specularIntensity,
      specularColor:role==='skin'?new THREE.Color(.72,.58,.53):new THREE.Color(1,1,1)
    });
    if('anisotropy' in mat){mat.anisotropy=role==='hair'?.94:(role==='cloth'||role==='hosiery')?.03:0;if('anisotropyRotation' in mat)mat.anisotropyRotation=0;}
    if(role==='skin'&&(pipeline==='skinOily'||pipeline==='skinSilicone'||skinPresetStrength()>.01))applySkinSurfacePatch(mat,pipeline==='skinSilicone'?'silicone':pipeline==='skinOily'?'oily':'natural');
  }else if(pipeline==='toonClassic'){
    mat=new THREE.MeshToonMaterial({...common,emissive,gradientMap:toonGradientTexture('classic',role,state.toonBands)});
    applyRampCelPatch(mat,role);
  }else if(pipeline==='genshin'){
    mat=new THREE.MeshPhongMaterial({...common,emissive,specular:new THREE.Color(role==='eye'?.55:role==='hair'?.34:.08,role==='eye'?.55:role==='hair'?.37:.08,role==='eye'?.60:role==='hair'?.46:.09),shininess:role==='eye'?118:role==='hair'?58:18});
    applyGenshinShaderPatch(mat,role);
  }else if(pipeline==='unlit'){
    mat=new THREE.MeshBasicMaterial({...common,toneMapped:false});
  }else{
    if(role==='hair'){
      mat=new THREE.MeshPhongMaterial({...common,emissive,specular:new THREE.Color(.48,.48,.54),shininess:72});
    }else{
      const skin=skinPresetMaterialValues(pipeline);
      mat=new THREE.MeshPhongMaterial({
        ...common,emissive,
        specular:role==='skin'?new THREE.Color(.12+.16*skin.specular,.10+.12*skin.specular,.09+.10*skin.specular):new THREE.Color(spec[0],spec[1],spec[2]),
        shininess:clamp(role==='skin'?(12+(1-skin.roughness)*34):role==='eye'?Math.max(shin,105):shin,0,180)
      });
    }
  }
  mat.userData={
    MMD:{mapFileName:textureName||null},_mmdroidRole:role,_mmdroidAlphaMorph:alphaMorph,
    _mmdroidAlphaModeOverride:'auto',_mmdroidAlphaCutoff:.08,_mmdroidTextureTint:[1,1,1,1],
    _mmdroidBaseDiffuse:[r,g,b,a],_mmdroidTexturePath:textureName||'',_mmdroidSourceOpacity:sourceOpacity,_mmdroidTearDefaultHidden:role==='tear'
  };
  if(format==='pmx')mat.userData.outlineParameters={
    thickness:(Number(src?.edgeSize)||0)/300,
    color:Array.isArray(src?.edgeColor)?src.edgeColor.slice(0,3):[0,0,0],
    alpha:Array.isArray(src?.edgeColor)?Number(src.edgeColor[3]??1):1,
    visible:((Number(src?.flag)||0)&0x10)!==0&&(Number(src?.edgeSize)||0)>0
  };
  else mat.userData.outlineParameters={thickness:src?.edgeFlag===1?.003:0,color:[0,0,0],alpha:1,visible:src?.edgeFlag===1};
  applyContinuousDithering(mat,pipeline);mat._mmdroidCompat=true;mat._mmdroidCompatMode=pipeline;mat._mmdroidSourceData=src;mat._mmdroidTextureName=textureName||'';mat._mmdroidFormat=format;mat._mmdroidMaterialIndex=index;mat._mmdroidAlphaMorph=alphaMorph;
  applyMaterialAlphaMode(mat,'auto',opacity,null);
  if(role==='hair')applyHairFiberPatch(mat,pipeline);
  if(role==='cloth'||role==='hosiery')applyAlphaResponsePatch(mat,role);
  if(textureName&&hasTexture)attachMmdTexture(mat,pack,textureName);
  return mat;
}
function buildAndroidMmdMaterials(data, geometry, pack) {
  const count=Number(data?.metadata?.materialCount)||0,result=[],alphaMorphs=alphaMorphMaterialIndices(data),format=data?.metadata?.format||'pmx';
  geometry.userData=geometry.userData||{};geometry.userData.MMDroid={format,morphs:data?.morphs||[],materials:data?.materials||[],textures:data?.textures||[]};
  for(let i=0;i<count;i++){const src=data.materials?.[i]||{},textureName=mmdTextureName(data,src);result.push(createPipelineMaterial(src,textureName,pack,format,i,alphaMorphs.has(i),state.renderPipeline));}
  return result;
}
function createAndroidMmdLoader(pack) {
  const loader=new MMDLoader(pack.manager);
  if (loader?.meshBuilder) loader.meshBuilder.materialBuilder={setCrossOrigin(){return this;},setResourcePath(){return this;},build(data,geometry){return buildAndroidMmdMaterials(data,geometry,pack);}};
  return loader;
}
function rebuildMmdObjectMaterials(rec,pipeline=state.renderPipeline){
  if(!rec||!['pmx','pmd'].includes(rec.type))return 0;let changed=0;const cache=new Map();
  rec.root.traverse(o=>{if(!o.isMesh&&!o.isSkinnedMesh)return;const old=Array.isArray(o.material)?o.material:[o.material];const next=old.map(m=>{if(!m?._mmdroidSourceData)return m;if(cache.has(m))return cache.get(m);const n=createPipelineMaterial(m._mmdroidSourceData,m._mmdroidTextureName,rec.pack,m._mmdroidFormat,m._mmdroidMaterialIndex,m._mmdroidAlphaMorph,pipeline);n.visible=m.visible!==false;if(textureHasPixels(m.map)){n.map=m.map;n._mmdroidSavedMap=m.map;n.userData._mmdroidTextureAlpha=m.userData?._mmdroidTextureAlpha||analyzeTextureAlpha(m.map);}const ov=m.userData?._mmdroidAlphaModeOverride;if(ov)n.userData._mmdroidAlphaModeOverride=ov;if(Number.isFinite(m.userData?._mmdroidAlphaCutoff))n.userData._mmdroidAlphaCutoff=m.userData._mmdroidAlphaCutoff;applyMaterialAlphaMode(n,'auto',getMaterialOpacity(n,1),n.userData._mmdroidTextureAlpha||null);cache.set(m,n);changed++;return n;});o.material=Array.isArray(o.material)?next:next[0];});
  rec.materials=collectMaterials(rec.root);rec.materialOriginal=rec.materials.map(materialState);installMmdMorphRuntime(rec);if(rec.category==='model'){buildModelParts(rec);buildExpressionPresets(rec);}repairRenderable(rec.root,modelReceivesSelfShadow(rec));return changed;
}
function rebuildAllMmdMaterials(){let n=0;for(const rec of state.objects)n+=rebuildMmdObjectMaterials(rec,state.renderPipeline);syncEnvironmentFromUI();syncInspector();renderer.shadowMap.needsUpdate=true;return n;}
function countCompatMaterials(root){return collectMaterials(root).filter(m=>m?._mmdroidCompat).length;}


function objectById(id) { return state.objects.find(o => o.id === String(id)) || null; }
function folderById(id) { return state.folders.find(f => f.id === String(id)) || null; }
function activeObject() { return objectById(state.activeId); }
function selectedObject() { return objectById(state.selection.id); }
function selectedFolder() { return folderById(state.selection.id); }
function selectedBoneName() { return state.selection.type === 'bone' ? String(state.selection.sub || '') : ''; }
function selectedMaterialIndex() { return state.selection.type === 'material' ? Number(state.selection.sub) : -1; }
function selectedIkIndex() { return state.selection.type === 'ik' ? Number(state.selection.sub) : -1; }
function objectTransformNode(rec){return rec?.transformNode||rec?.root||null;}

function firstMmdMesh(root) { let found = null; root.traverse(o => { if (!found && o.geometry?.userData?.MMD) found = o; }); return found || (root.geometry?.userData?.MMD ? root : null); }
function findBoneMap(root) { const map = new Map(); root.traverse(o => { if (o.isBone && o.name && !map.has(o.name)) map.set(o.name, o); }); return map; }
function collectMorphs(root) { const names = new Set(); root.traverse(o => { if (o.morphTargetDictionary) Object.keys(o.morphTargetDictionary).forEach(n => names.add(n)); }); return Array.from(names).sort((a,b) => a.localeCompare(b, 'ja')); }
function setMorph(root, name, value) { root.traverse(o => { const d=o.morphTargetDictionary,i=o.morphTargetInfluences; if(d&&i&&d[name]!==undefined)i[d[name]]=value; }); const rec=state.objects.find(r=>r.root===root);if(rec)applyMmdExtraMorphs(rec); }
function getMorph(root, name) { let value=0,found=false;root.traverse(o=>{if(found)return;const d=o.morphTargetDictionary,i=o.morphTargetInfluences;if(d&&i&&d[name]!==undefined){value=i[d[name]]||0;found=true;}});return value; }

const modelAccessoryMaterialRe=/accessor|prop|weapon|glasses|megane|メガネ|眼鏡|眼镜|hat|帽|cap|hairpin|髪飾|发饰|頭飾|头饰|necklace|首飾|项链|earring|ピアス|耳飾|耳环|bag|バッグ|包|sword|剣|剑|staff|杖|wing|翼|tail|尻尾|尾巴|bracelet|腕輪|手镯/i;
const modelCostumeMaterialRe=/cloth|clothes|costume|outfit|shirt|blouse|skirt|dress|pants|trouser|sock|stocking|hosiery|tights|shoe|boot|glove|sleeve|jacket|coat|uniform|bra|underwear|belt|cape|cloak|服|衣|裙|裤|褲|襪|袜|鞋|袖|外套|上衣|下装|下裝|制服|ドレス|スカート|シャツ|ズボン|靴|服装|ストッキング|タイツ/i;
const modelHairMaterialRe=/hair|hairstyle|bang|fringe|ponytail|髪|发|頭髮|头发|前髪|後髪|横髪|毛髪/i;
function modelMaterialText(m){const src=m?._mmdroidSourceData||{};return `${m?.name||''} ${src?.name||''} ${src?.englishName||src?.nameEn||''} ${m?._mmdroidTextureName||''}`.trim();}
function modelPartKindForMaterial(m){const role=m?.userData?._mmdroidRole||'';const text=modelMaterialText(m);if(role==='hair'||role==='hairOverlay'||modelHairMaterialRe.test(text))return'hair';if(modelAccessoryMaterialRe.test(text))return'accessory';if(role==='cloth'||role==='hosiery'||modelCostumeMaterialRe.test(text))return'costume';return null;}
function preferredModelPartName(m,index){const src=m?._mmdroidSourceData||{};return String(src?.name||src?.englishName||src?.nameEn||m?.name||basename(m?._mmdroidTextureName||'')||`Material ${index+1}`);}
function cleanModelPartName(name,index){let s=String(name||'').trim();if(!s)s=`Material ${index+1}`;s=s.replace(/\b(material|mat)\b/ig,'').replace(/材質|材质/g,'').replace(/([_ .-])(base|main|shadow|shade|alpha|edge|outline|toon|sph|spa|裏|影|縁|边|邊)$/ig,'').replace(/([_ .-])\d+$/,'').replace(/^[_ .-]+|[_ .-]+$/g,'').trim();return s||String(name||`Material ${index+1}`);}
function morphPartKind(name){const s=String(name||'');if(modelHairMaterialRe.test(s))return'hair';if(modelAccessoryMaterialRe.test(s))return'accessory';if(modelCostumeMaterialRe.test(s))return'costume';return null;}
function morphHideAtOne(m,raw){const name=String(m?.name||'');if(/hide|off|非表示|隐藏|隱藏|消す|消去|脱|脫|外す/i.test(name))return true;if(/show|on|表示|显示|顯示|装着|裝著/i.test(name))return false;const inspect=x=>{if(Number(x?.type)!==8)return null;let score=0;for(const el of x.elements||[]){const a=Number(el?.diffuse?.[3]);if(!Number.isFinite(a))continue;const op=Number(el?.type??el?.operation??0);if(op===0)score+=a<.55?-2:a>.95?1:0;else score+=a<-.35?-2:a>.25?1:0;}return score<0?true:score>0?false:null;};const direct=inspect(m);if(direct!==null)return direct;if(Number(m?.type)===0){let hide=0,show=0;for(const el of m.elements||[]){const r=inspect(raw?.[Number(el.index)]);if(r===true)hide++;else if(r===false)show++;}if(hide||show)return hide>=show;}return true;}
function buildModelParts(rec){if(!rec||rec.category!=='model')return[];const oldDefaults=new Map((rec.modelParts||[]).map(p=>[p.key,p.defaultVisible]));const groups=new Map();(rec.materials||[]).forEach((m,i)=>{const kind=modelPartKindForMaterial(m);if(!kind)return;const raw=preferredModelPartName(m,i),name=cleanModelPartName(raw,i),key=`material:${kind}:${normalizeTextKey(name)||i}`;let g=groups.get(key);if(!g){g={key,kind,name,control:'material',materialIndices:[],visible:true,defaultVisible:true};groups.set(key,g);}g.materialIndices.push(i);const v=m.visible!==false;g.visible=g.visible&&v;g.defaultVisible=g.defaultVisible&&v;});const rawMorphs=rawMorphsFor(rec);for(let i=0;i<rawMorphs.length;i++){const m=rawMorphs[i],name=String(m?.name||'').trim();if(!name)continue;let kind=morphPartKind(name);if(!kind&&Number(m?.type)===0){for(const el of m.elements||[]){const child=rawMorphs[Number(el.index)];kind=morphPartKind(child?.name);if(kind)break;}}if(!kind||![0,8].includes(Number(m?.type)))continue;const hideAtOne=morphHideAtOne(m,rawMorphs),w=getMorph(rec.root,name),visible=hideAtOne?w<.5:w>=.5,key=`morph:${i}`;groups.set(key,{key,kind,name:`${name} · Morph`,control:'morph',morphName:name,hideAtOne,materialIndices:[],visible,defaultVisible:visible});}
  rec.modelParts=Array.from(groups.values()).sort((a,b)=>a.kind.localeCompare(b.kind)||a.name.localeCompare(b.name,'ja'));rec.partVisibility=rec.partVisibility||{};for(const part of rec.modelParts){if(oldDefaults.has(part.key))part.defaultVisible=oldDefaults.get(part.key)!==false;if(rec.partVisibility[part.key]===undefined)rec.partVisibility[part.key]=part.defaultVisible;part.visible=rec.partVisibility[part.key]!==false;}applyModelPartStates(rec);return rec.modelParts;}
function setPartActualVisibility(rec,part,actual){if(part.control==='morph'&&part.morphName){const w=part.hideAtOne?(actual?0:1):(actual?1:0);setMorph(rec.root,part.morphName,w);return;}for(const idx of part.materialIndices||[]){const m=rec.materials?.[idx];if(m){m.userData=m.userData||{};m.userData._mmdroidVisibilityManaged=true;m.visible=actual;}}}
function applyModelPartStates(rec){if(!rec?.modelParts)return;for(const part of rec.modelParts){const suppressed=part.kind==='costume'?!!rec.suppressInternalCostume:part.kind==='hair'?!!rec.suppressInternalHair:!!rec.suppressInternalAccessory;const desired=rec.partVisibility?.[part.key]!==false;part.visible=desired;setPartActualVisibility(rec,part,desired&&!suppressed);}}
function setModelPartVisible(rec,key,visible){if(!rec?.partVisibility)return;rec.partVisibility[key]=!!visible;applyModelPartStates(rec);if(selectedObject()?.id===rec.id)renderModelPartsUI(rec);markBakeDirty();markRenderDirty();}
function externalWearablesFor(rec,kind){const field=activeBundleField(kind),active=rec?.[field]||null;return state.objects.filter(o=>o.category===kind&&(o.wearable?.targetModelId===rec?.id||o.attachment?.modelId===rec?.id)&&(!active||bundleOf(o)===active));}
function setModelPartKindVisible(rec,kind,visible){if(!rec)return;for(const p of rec.modelParts||[])if(p.kind===kind)rec.partVisibility[p.key]=!!visible;applyModelPartStates(rec);for(const o of externalWearablesFor(rec,kind)){o.visibleWanted=!!visible;objectTransformNode(o).visible=!!visible;}renderModelPartsUI(rec);markBakeDirty();markRenderDirty();}
function resetModelPartVisibility(rec){if(!rec)return;for(const p of rec.modelParts||[])rec.partVisibility[p.key]=p.defaultVisible!==false;applyModelPartStates(rec);for(const kind of ['costume','hair','accessory'])for(const o of externalWearablesFor(rec,kind)){o.visibleWanted=true;objectTransformNode(o).visible=true;}renderModelPartsUI(rec);markBakeDirty();markRenderDirty();}
function renderModelPartsUI(rec){if(!ui.modelPartList)return;ui.modelPartList.innerHTML='';const parts=rec?.modelParts||[];let total=0;for(const kind of ['costume','hair','accessory']){const arr=parts.filter(p=>p.kind===kind),external=externalWearablesFor(rec,kind);if(!arr.length&&!external.length)continue;total+=arr.length+external.length;const title=document.createElement('div');title.className='model-part-group-title';title.textContent=kind==='costume'?`服装 (${arr.length+external.length})`:kind==='hair'?`头发 (${arr.length+external.length})`:`配件 (${arr.length+external.length})`;ui.modelPartList.append(title);for(const part of arr){const row=document.createElement('label');row.className='model-part-row';const cb=document.createElement('input');cb.type='checkbox';cb.checked=rec.partVisibility?.[part.key]!==false;cb.addEventListener('change',()=>setModelPartVisible(rec,part.key,cb.checked));const name=document.createElement('span');name.className='part-name';name.textContent=part.name;name.title=part.name;const tag=document.createElement('span');tag.className='part-tag';tag.textContent=part.control==='morph'?'MORPH':`${part.materialIndices.length} MAT`;row.append(cb,name,tag);ui.modelPartList.append(row);}for(const extRec of external){const row=document.createElement('label');row.className='model-part-row external-part-row';const cb=document.createElement('input');cb.type='checkbox';cb.checked=extRec.visibleWanted!==false;cb.addEventListener('change',()=>{extRec.visibleWanted=cb.checked;objectTransformNode(extRec).visible=cb.checked;markBakeDirty();markRenderDirty();});const name=document.createElement('span');name.className='part-name';name.textContent=extRec.name;name.title=extRec.name;const tag=document.createElement('span');tag.className='part-tag';tag.textContent='适配';row.append(cb,name,tag);ui.modelPartList.append(row);}}if(!total)ui.modelPartList.innerHTML='<div class="tree-empty">没有识别到可独立控制的服装、头发或配件；应用外部装扮后这里会自动刷新。</div>';}
function rawMorphsFor(rec){return rec?.mmdMorphRuntime?.morphs||[];}
function isExpressionMorphMeta(m){const panel=Number(m?.panel);if(panel>=1&&panel<=4)return true;return /smile|happy|laugh|blink|wink|angry|sad|surprise|blush|照|笑|喜|楽|怒|困|悲|泣|驚|びっくり|まばたき|ウィンク|赤面|頬|眉|目|口/i.test(String(m?.name||''));}
function expressionMorphNames(rec){const raw=rawMorphsFor(rec),set=new Set();for(const m of raw){if(isExpressionMorphMeta(m))set.add(String(m.name||''));if(Number(m?.type)===0){let hits=0;for(const el of m.elements||[]){const child=raw[Number(el.index)];if(isExpressionMorphMeta(child))hits++;}if(hits)set.add(String(m.name||''));}}if(!set.size)for(const n of rec?.morphs||[])if(/smile|happy|laugh|blink|wink|angry|sad|surprise|blush|笑|怒|悲|泣|驚|まばたき|ウィンク|赤面|眉|目|口/i.test(n))set.add(n);return set;}
function expressionSemantic(name){const n=String(name||'').toLowerCase();if(/neutral|通常|標準|標准|normal|default/.test(n))return'neutral';if(/笑|smile|happy|にこ|ニコ|joy|laugh/.test(n))return'smile';if(/怒|angry|mad|ぷん/.test(n))return'angry';if(/悲|sad|泣|cry|困/.test(n))return'sad';if(/驚|surprise|びっくり|shock/.test(n))return'surprise';if(/まばたき|blink|閉じ|closeeye/.test(n))return'blink';if(/ウィンク|wink/.test(n))return'wink';if(/照|赤面|blush|shy/.test(n))return'blush';return null;}
function buildExpressionPresets(rec){if(!rec||rec.category!=='model')return[];const raw=rawMorphsFor(rec),presets=[{key:'neutral',name:'Neutral · 中性',weights:{},source:'system'}],seen=new Set(['neutral']);const add=(key,name,weights,source)=>{if(!key||seen.has(key))return;seen.add(key);presets.push({key,name,weights,source});};for(let i=0;i<raw.length;i++){const m=raw[i],name=String(m?.name||'').trim();if(!name)continue;if(Number(m?.type)===0){let expr=0;for(const el of m.elements||[])if(isExpressionMorphMeta(raw[Number(el.index)]))expr++;if(expr){add(`group:${i}`,`${name} · 模型预设`,{[name]:1},'group');continue;}}if(isExpressionMorphMeta(m)){const semantic=expressionSemantic(name),label=semantic?`${name} · ${semantic}`:name;add(`morph:${i}`,label,{[name]:1},'morph');}}
  if(presets.length===1){for(const [i,name] of (rec.morphs||[]).entries()){const sem=expressionSemantic(name);if(sem)add(`fallback:${i}`,`${name} · ${sem}`,{[name]:1},'fallback');}}
  rec.expressionMorphNames=expressionMorphNames(rec);rec.expressionPresets=presets;rec.expressionPresetKey=rec.expressionPresetKey||'neutral';rec.expressionPresetStrength=Number.isFinite(rec.expressionPresetStrength)?rec.expressionPresetStrength:1;return presets;}
function applyExpressionPreset(rec,key='neutral',strength=1){if(!rec)return;const presets=rec.expressionPresets?.length?rec.expressionPresets:buildExpressionPresets(rec),preset=presets.find(p=>p.key===key)||presets[0];for(const name of rec.expressionMorphNames||expressionMorphNames(rec))setMorph(rec.root,name,0);strength=clamp(Number(strength)||0,0,1);for(const [name,w] of Object.entries(preset?.weights||{}))setMorph(rec.root,name,clamp(Number(w)||0,0,1)*strength);rec.expressionPresetKey=preset?.key||'neutral';rec.expressionPresetStrength=strength;updateMorphUI(rec);syncExpressionPresetUI(rec);markBakeDirty();}
function syncExpressionPresetUI(rec){if(!ui.expressionPreset)return;const presets=rec?.expressionPresets?.length?rec.expressionPresets:buildExpressionPresets(rec);ui.expressionPreset.innerHTML='';for(const p of presets)ui.expressionPreset.append(new Option(p.name,p.key));ui.expressionPreset.value=presets.some(p=>p.key===rec?.expressionPresetKey)?rec.expressionPresetKey:'neutral';ui.expressionPresetStrength.value=String(rec?.expressionPresetStrength??1);ui.expressionPresetStrengthOut.value=Number(ui.expressionPresetStrength.value).toFixed(2);const p=presets.find(x=>x.key===ui.expressionPreset.value);if(ui.expressionPresetInfo)ui.expressionPresetInfo.textContent=p?.source==='group'?'使用模型自身 Group Morph 预设，会联动该预设包含的眼睛/眉毛/嘴部 Morph。':`已识别 ${Math.max(0,presets.length-1)} 个模型表情预设；高级 Morph 仍可单独微调。`;}
function collectIks(root) { const m = firstMmdMesh(root); return m?.geometry?.userData?.MMD?.iks || []; }
function collectRigidBodies(root) { const m=firstMmdMesh(root); return m?.geometry?.userData?.MMD?.rigidBodies || []; }
function eyeBoneScore(name,bone,side){
  const n=String(name||''),l=n.toLowerCase();let score=0;
  if(/socket|orbit|eyelid|eye.?lid|lid[_. -]|まぶた|瞼|眼眶|眼窩|目尻|目頭|眉/.test(l))score-=120;
  if(/眼球|eyeball|eye.?ball|hitomi|瞳|iris|pupil/.test(l))score+=55;
  if(/eye|目|眼/.test(l))score+=22;
  if(side==='left'){if(/^左目$/.test(n))score+=80;if(/left|[_ .-]l(?:$|[_ .-])|^l[_ .-]|左/.test(l))score+=28;if(/right|[_ .-]r(?:$|[_ .-])|^r[_ .-]|右/.test(l))score-=40;}
  else{if(/^右目$/.test(n))score+=80;if(/right|[_ .-]r(?:$|[_ .-])|^r[_ .-]|右/.test(l))score+=28;if(/left|[_ .-]l(?:$|[_ .-])|^l[_ .-]|左/.test(l))score-=40;}
  const boneChildren=(bone?.children||[]).filter(c=>c.isBone).length;if(boneChildren===0)score+=4;else if(boneChildren>2)score-=3;
  return score;
}
function eyeBoneCandidates(rec,side){return Array.from(rec?.boneMap?.entries?.()||[]).map(([name,bone])=>({name,score:eyeBoneScore(name,bone,side)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ja'));}
function findEyeBones(rec){const pick=side=>eyeBoneCandidates(rec,side)[0]?.name||null;return{left:pick('left'),right:pick('right')};}

const smoothPresets={source:{angle:0,strength:0,label:'原始'},conservative:{angle:55,strength:.38,label:'保守'},standard:{angle:105,strength:.78,label:'标准'},strong:{angle:150,strength:.92,label:'强力'},ultra:{angle:180,strength:1,label:'超平滑'}};
function ensureSourceNormals(geometry){
  if(!geometry?.attributes?.position)return false;if(!geometry.attributes.normal){try{geometry.computeVertexNormals();}catch(_){return false;}}const n=geometry.attributes.normal;if(!geometry.userData._mmdroidSourceNormals)geometry.userData._mmdroidSourceNormals=new Float32Array(n.array);return true;
}
function restoreSourceNormalsGeometry(geometry){if(!ensureSourceNormals(geometry))return false;const n=geometry.attributes.normal,src=geometry.userData._mmdroidSourceNormals;if(src?.length===n.array.length){n.array.set(src);n.needsUpdate=true;geometry.normalizeNormals?.();return true;}return false;}
function autoSmoothGeometry(geometry,angleDeg=105,strength=.78,preset='standard'){
  const pos=geometry?.attributes?.position;if(!pos||pos.count<3||!ensureSourceNormals(geometry))return false;if(preset==='source')return restoreSourceNormalsGeometry(geometry);
  const src=geometry.userData._mmdroidSourceNormals;try{geometry.computeVertexNormals();}catch(_){return false;}const normal=geometry.attributes.normal;if(!normal)return false;
  const computed=new Float32Array(normal.array),base=new Float32Array(normal.array.length);const sourceWeight=preset==='conservative'?.65:preset==='standard'?.22:0;for(let i=0;i<base.length;i++)base[i]=computed[i]*(1-sourceWeight)+src[i]*sourceWeight;
  const box=geometry.boundingBox||(()=>{geometry.computeBoundingBox?.();return geometry.boundingBox;})();
  const diag=box?box.getSize(new THREE.Vector3()).length():1;
  // Converted meshes often duplicate seam vertices with tiny positional drift. Use a model-scale
  // aware weld tolerance so smoothing crosses those seams instead of requiring bit-identical XYZ.
  const weldEps=Math.max(1e-6,diag*(preset==='ultra'?2.5e-5:preset==='strong'?1.4e-5:7e-6));
  const q=1/weldEps,groups=new Map();for(let i=0;i<pos.count;i++){const key=`${Math.round(pos.getX(i)*q)},${Math.round(pos.getY(i)*q)},${Math.round(pos.getZ(i)*q)}`;const a=groups.get(key)||[];a.push(i);groups.set(key,a);}
  const cosLimit=Math.cos(THREE.MathUtils.degToRad(clamp(angleDeg,0,180))),v=new THREE.Vector3(),ni=new THREE.Vector3(),nj=new THREE.Vector3(),out=new THREE.Vector3();strength=clamp(strength,0,1);
  for(let i=0;i<normal.count;i++){out.set(base[i*3],base[i*3+1],base[i*3+2]).normalize();normal.setXYZ(i,out.x,out.y,out.z);}
  for(const list of groups.values()){if(list.length<2)continue;for(const i of list){ni.set(base[i*3],base[i*3+1],base[i*3+2]).normalize();v.set(0,0,0);let c=0;for(const j of list){nj.set(base[j*3],base[j*3+1],base[j*3+2]).normalize();if(ni.dot(nj)>=cosLimit){v.add(nj);c++;}}if(c&&v.lengthSq()>1e-10){v.normalize();out.copy(ni).lerp(v,strength).normalize();normal.setXYZ(i,out.x,out.y,out.z);}}}
  normal.needsUpdate=true;geometry.normalizeNormals?.();return true;
}
function autoSmoothCharacter(root,preset='standard',angle=105,strength=.78){let count=0;root?.traverse?.(o=>{if(!o.isMesh&&!o.isSkinnedMesh)return;if(autoSmoothGeometry(o.geometry,angle,strength,preset))count++;if(o.material){for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m&&'flatShading'in m){m.flatShading=false;m.needsUpdate=true;}}});return count;}
function applySmoothToRecord(rec,preset='standard',angle=105,strength=.78,notify=false){if(!rec)return 0;const cfg=smoothPresets[preset];if(cfg){angle=cfg.angle;strength=cfg.strength;}const count=autoSmoothCharacter(rec.root,preset,angle,strength);rec.smoothing={preset,angle,strength};rec.smoothCount=count;prepareHairGeometry(rec.root);if(notify)showToast(`${rec.name}：${cfg?.label||'自定义'}光滑 · ${angle}° · ${(strength*100).toFixed(0)}%`);return count;}
function syncSurfaceQualityUI(rec){if(!rec||!ui.smoothPreset)return;const sm=rec.smoothing||{preset:'standard',angle:105,strength:.78};ui.smoothPreset.value=sm.preset||'custom';ui.smoothAngle.value=String(sm.angle??105);ui.smoothStrength.value=String(sm.strength??.78);ui.smoothAngleOut.value=`${Math.round(num(ui.smoothAngle,105))}°`;ui.smoothStrengthOut.value=num(ui.smoothStrength,.78).toFixed(2);ui.textureQuality.value=state.textureQuality||'high';ui.textureSharpness.value=String(state.textureSharpness??.55);ui.textureSharpnessOut.value=num(ui.textureSharpness,.55).toFixed(2);const q=textureQualityProfile(),ratio=Math.min(window.devicePixelRatio||1,q.pixel),max=Math.max(1,renderer.capabilities.getMaxAnisotropy?.()||1);ui.textureQualityInfo.textContent=`${q.label}：渲染像素比 ${ratio.toFixed(2)}× · 各向异性 ${Math.min(max,q.aniso)}× · 三线性 Mipmap · 锐化 ${num(ui.textureSharpness,.55).toFixed(2)}。`; }

function collectMaterials(root) { const out=[],seen=new Set();root.traverse(o=>{if(!o.isMesh&&!o.isSkinnedMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(m&&!seen.has(m.uuid)){seen.add(m.uuid);out.push(m);}}});return out; }
function installMmdMorphRuntime(rec){
  const mesh=firstMmdMesh(rec?.root);const raw=mesh?.geometry?.userData?.MMDroid?.morphs;if(!mesh||!Array.isArray(raw)){if(rec)rec.mmdMorphRuntime=null;return;}
  const uv=mesh.geometry?.attributes?.uv;rec.mmdMorphRuntime={mesh,morphs:raw,baseUv:uv?new Float32Array(uv.array):null,lastExtraActive:false};
  for(const m of rec.materials||[])captureMmdMorphBase(m);
}
function captureMmdMorphBase(m){
  if(!m)return;
  const c=m.color?.toArray?.()||[1,1,1],e=m.emissive?.toArray?.()||[0,0,0],sp=m.specular?.toArray?.()||[0,0,0],ol=m.userData?.outlineParameters||{};
  const baseOpacity=m.userData?._mmdroidRole==='tear'?Number(m.userData?._mmdroidSourceOpacity??getMaterialOpacity(m,1)):getMaterialOpacity(m,1);
  m._mmdroidMorphBase={
    color:[...c],opacity:Number.isFinite(baseOpacity)?baseOpacity:1,emissive:[...e],specular:[...sp],shininess:Number(m.shininess)||0,
    textureTint:[1,1,1,1],
    outline:{thickness:Number(ol.thickness)||0,alpha:Number.isFinite(Number(ol.alpha))?Number(ol.alpha):1}
  };
}
function effectiveMmdMorphWeights(rec){
  const rt=rec?.mmdMorphRuntime;if(!rt)return null;
  const raw=rt.morphs,w=new Float32Array(raw.length),mesh=rt.mesh,d=mesh.morphTargetDictionary||{},inf=mesh.morphTargetInfluences||[];
  for(let i=0;i<raw.length;i++){const j=d[raw[i]?.name];if(j!==undefined)w[i]=Number(inf[j])||0;}
  const propagate=(idx,weight,depth,stack)=>{
    if(depth>10||Math.abs(weight)<1e-6||stack.has(idx))return;
    const m=raw[idx];if(!m||m.type!==0)return;
    const ns=new Set(stack);ns.add(idx);
    for(const el of m.elements||[]){const ci=Number(el.index),cw=weight*(Number(el.ratio)||0);if(ci<0||ci>=w.length)continue;w[ci]+=cw;propagate(ci,cw,depth+1,ns);}
  };
  for(let i=0;i<raw.length;i++)if(raw[i]?.type===0&&Math.abs(w[i])>1e-6)propagate(i,w[i],0,new Set());
  return w;
}
function morphMixMul(base,target,w){return base*(1+(Number(target)-1)*w);}
function morphMixAdd(base,target,w){return base+Number(target)*w;}
function morphVec(base,target,w,mult,count){
  const out=base.slice(0,count);
  for(let k=0;k<count;k++)out[k]=mult?morphMixMul(out[k],Number(target?.[k]??1),w):morphMixAdd(out[k],Number(target?.[k]??0),w);
  return out;
}
function applyMmdExtraMorphs(rec){
  const rt=rec?.mmdMorphRuntime;if(!rt)return;
  const weights=effectiveMmdMorphWeights(rec);if(!weights)return;
  const raw=rt.morphs,mats=rec.materials||[];let active=false;
  const tearMorphActive=raw.some((m,i)=>/namida|ナミダ|なみだ|涙|tear|teardrop|泪|涙目/i.test(String(m?.name||''))&&Math.abs(weights[i]||0)>1e-6);
  const runtime=mats.map(m=>{
    const b=m?._mmdroidMorphBase;if(!b)return null;
    return {diffuse:[...b.color,b.opacity],texture:[1,1,1,1],emissive:[...b.emissive],specular:[...b.specular],shininess:b.shininess,outline:[b.outline.thickness,b.outline.alpha]};
  });

  // PMX material morph is separate from vertex morphing.  Keep diffuse and texture tint as
  // independent channels, then combine them once at the end.  This avoids the old behaviour
  // where textureColor was added directly to eye/skin diffuse and could turn irises white/black.
  for(let mi=0;mi<raw.length;mi++){
    const morph=raw[mi],w=weights[mi];if(Math.abs(w)<1e-6||morph?.type!==8)continue;active=true;
    for(const el of morph.elements||[]){
      const targets=Number(el.index)===-1?mats.map((_,i)=>i):[Number(el.index)];
      for(const ti of targets){
        const st=runtime[ti];if(!st)continue;const mult=Number(el.type)===0;
        st.diffuse=morphVec(st.diffuse,el.diffuse,w,mult,4);
        st.texture=morphVec(st.texture,el.textureColor,w,mult,4);
        st.emissive=morphVec(st.emissive,el.ambient,w,mult,3);
        st.specular=morphVec(st.specular,el.specular,w,mult,3);
        if(Number.isFinite(Number(el.shininess)))st.shininess=Math.max(0,mult?morphMixMul(st.shininess,el.shininess,w):morphMixAdd(st.shininess,el.shininess,w));
        const ec=el.edgeColor||[mult?1:0,mult?1:0,mult?1:0,mult?1:0];
        st.outline[1]=mult?morphMixMul(st.outline[1],ec[3]??1,w):morphMixAdd(st.outline[1],ec[3]??0,w);
        if(Number.isFinite(Number(el.edgeSize)))st.outline[0]=Math.max(0,mult?morphMixMul(st.outline[0],el.edgeSize,w):morphMixAdd(st.outline[0],el.edgeSize,w));
      }
    }
  }

  for(let i=0;i<mats.length;i++){
    const m=mats[i],st=runtime[i];if(!m||!st)continue;
    if(m.color)m.color.setRGB(clamp(st.diffuse[0]*st.texture[0],0,4),clamp(st.diffuse[1]*st.texture[1],0,4),clamp(st.diffuse[2]*st.texture[2],0,4));
    let opacity=clamp(st.diffuse[3]*st.texture[3],0,1);if(m.userData?._mmdroidRole==='tear'&&!tearMorphActive)opacity=0;setMaterialOpacity(m,opacity);
    if(m.emissive)m.emissive.setRGB(clamp(st.emissive[0],0,4),clamp(st.emissive[1],0,4),clamp(st.emissive[2],0,4));
    if(m.specular)m.specular.setRGB(clamp(st.specular[0],0,4),clamp(st.specular[1],0,4),clamp(st.specular[2],0,4));
    if('shininess'in m)m.shininess=st.shininess;
    if(m.userData?.outlineParameters){m.userData.outlineParameters.thickness=st.outline[0];m.userData.outlineParameters.alpha=clamp(st.outline[1],0,1);}
    m.userData=m.userData||{};m.userData._mmdroidTextureTint=st.texture;
    applyMaterialAlphaMode(m,'auto',opacity,m.userData._mmdroidTextureAlpha||null);m.needsUpdate=true;
  }

  const uv=rt.mesh.geometry?.attributes?.uv;
  if(uv&&rt.baseUv){
    let uvActive=false;uv.array.set(rt.baseUv);
    for(let mi=0;mi<raw.length;mi++){
      const morph=raw[mi],w=weights[mi];if(Math.abs(w)<1e-6||morph?.type!==3)continue;active=uvActive=true;
      for(const el of morph.elements||[]){const vi=Number(el.index),off=el.uv||[];if(vi<0||vi*2+1>=uv.array.length)continue;uv.array[vi*2]+=Number(off[0]||0)*w;uv.array[vi*2+1]+=Number(off[1]||0)*w;}
    }
    if(uvActive||rt.lastExtraActive)uv.needsUpdate=true;
  }
  rt.lastExtraActive=active;
}
function applyAllMmdExtraMorphs(){for(const rec of state.objects)applyMmdExtraMorphs(rec);}
function safeMaterialProp(m,name,fallback=null){if(!m)return fallback;try{const v=m[name];return v===undefined?fallback:v;}catch(_){return fallback;}}
function getMaterialOpacity(m,fallback=1){const v=Number(safeMaterialProp(m,'opacity',fallback));return Number.isFinite(v)?v:fallback;}
function setMaterialOpacity(m,value){if(!m)return;try{m.opacity=value;}catch(_){if(m.uniforms?.opacity)m.uniforms.opacity.value=value;}if(m.userData?._mmdroidRole)applyMaterialAlphaMode(m,'auto',Number(value),m.userData?._mmdroidTextureAlpha||null);}
function materialState(m){if(!m)return{};const color=safeMaterialProp(m,'color',null)||safeMaterialProp(m,'diffuse',null),emissive=safeMaterialProp(m,'emissive',null),ud=safeMaterialProp(m,'userData',{})||{};return{color:color?.getHexString?.()||null,emissive:emissive?.getHexString?.()||null,visible:m.visible!==false,opacity:getMaterialOpacity(m,1),transparent:!!safeMaterialProp(m,'transparent',false),depthWrite:safeMaterialProp(m,'depthWrite',true)!==false,wireframe:!!safeMaterialProp(m,'wireframe',false),side:safeMaterialProp(m,'side',THREE.FrontSide),roughness:safeMaterialProp(m,'roughness',undefined),metalness:safeMaterialProp(m,'metalness',undefined),alphaMode:ud._mmdroidAlphaModeOverride||'auto',alphaCutoff:Number(ud._mmdroidAlphaCutoff??.08),map:safeMaterialProp(m,'map',null),outline:ud.outlineParameters?{...ud.outlineParameters,color:Array.isArray(ud.outlineParameters.color)?[...ud.outlineParameters.color]:ud.outlineParameters.color}:null};}
function serializeMaterial(m){const o=materialState(m);delete o.map;return o;}
function applyMaterialState(m,s){if(!m||!s)return;const c=safeMaterialProp(m,'color',null)||safeMaterialProp(m,'diffuse',null);m.userData=m.userData||{};if(s.alphaMode)m.userData._mmdroidAlphaModeOverride=s.alphaMode;if(Number.isFinite(Number(s.alphaCutoff)))m.userData._mmdroidAlphaCutoff=Number(s.alphaCutoff);if(typeof s.visible==='boolean')m.visible=s.visible;if(s.color&&c)c.set('#'+s.color.replace('#',''));if(s.emissive&&safeMaterialProp(m,'emissive',null))m.emissive.set('#'+s.emissive.replace('#',''));if(Number.isFinite(s.opacity))setMaterialOpacity(m,s.opacity);if(typeof s.transparent==='boolean'&&m.userData._mmdroidAlphaModeOverride==='auto')m.transparent=s.transparent;if(typeof s.depthWrite==='boolean'&&m.userData._mmdroidAlphaModeOverride==='auto')m.depthWrite=s.depthWrite;if(typeof s.wireframe==='boolean'&&'wireframe'in m)m.wireframe=s.wireframe;if(Number.isFinite(s.side))m.side=s.side;if(Number.isFinite(s.roughness)&&'roughness'in m)m.roughness=s.roughness;if(Number.isFinite(s.metalness)&&'metalness'in m)m.metalness=s.metalness;if(s.outline)m.userData.outlineParameters={...(m.userData.outlineParameters||{}),...s.outline};applyMaterialAlphaMode(m,'auto',getMaterialOpacity(m,1),m.userData?._mmdroidTextureAlpha||null);m.needsUpdate=true;}

function textureHasPixels(texture){
  if(!texture)return false;
  const image=texture.image||texture.source?.data;
  if(!image)return false;
  if(image.data && Number(image.width)>0 && Number(image.height)>0)return true;
  return Number(image.naturalWidth||image.videoWidth||image.width||0)>0 && Number(image.naturalHeight||image.videoHeight||image.height||0)>0;
}
function cloneColor(value,fallback){return value?.isColor?value.clone():new THREE.Color(fallback);}
function safeMmdUniform(source,name,fallback=null){
  try{const u=source?.uniforms?.[name];return u&&u.value!==undefined?u.value:fallback;}catch(_){return fallback;}
}
function safeMmdProp(source,name,fallback=null){
  // MMDToonMaterial exposes Shader uniforms through property getters. Some Android/WebView +
  // Three.js combinations can throw when a getter is absent (notably `opacity`). Never let a
  // compatibility conversion depend on those getters.
  try{const v=source?.[name];return v===undefined?fallback:v;}catch(_){return fallback;}
}
function makeMmdCompatMaterial(source){
  const opacityRaw=safeMmdUniform(source,'opacity',1);
  const opacity=Number.isFinite(Number(opacityRaw))?Number(opacityRaw):1;
  const diffuse=safeMmdUniform(source,'diffuse',safeMmdUniform(source,'color',null));
  const map=safeMmdUniform(source,'map',null);
  // Use an unlit fallback first. This guarantees that a valid PMX is visible even when a
  // device/WebView has broken MMD toon/Phong lighting. Shadows can still be cast by the mesh.
  const mat=new THREE.MeshBasicMaterial({
    name:safeMmdProp(source,'name','')||'',
    color:cloneColor(diffuse,0xffffff),
    opacity,
    transparent:opacity<0.995,
    side:THREE.DoubleSide,
    depthTest:safeMmdProp(source,'depthTest',true)!==false,
    depthWrite:opacity>=0.995 && safeMmdProp(source,'depthWrite',true)!==false,
    alphaTest:0,
    fog:true,
    map:textureHasPixels(map)?map:null
  });
  mat.userData={...(safeMmdProp(source,'userData',{})||{})};
  mat._mmdroidSourceMaterial=source;
  mat._mmdroidCompat=true;
  mat._mmdroidCompatMode='unlit-safe';
  return mat;
}
function refreshCompatMaterialTextures(root){
  let refreshed=0;
  root.traverse(o=>{
    if(!o.isMesh&&!o.isSkinnedMesh)return;
    const mats=Array.isArray(o.material)?o.material:[o.material];
    for(const mat of mats){
      const src=mat?._mmdroidSourceMaterial;if(!src)continue;
      for(const key of ['map','alphaMap','normalMap','emissiveMap','specularMap']){
        const raw=safeMmdUniform(src,key,null);const next=textureHasPixels(raw)?raw:null;
        if(mat[key]!==next){mat[key]=next;refreshed++;}
      }
      mat.needsUpdate=true;
    }
  });
  return refreshed;
}
function convertMmdMaterialsForAndroid(root){
  let converted=0;
  root.traverse(o=>{
    if(!o.isMesh&&!o.isSkinnedMesh)return;
    const src=Array.isArray(o.material)?o.material:[o.material];
    if(!src.some(m=>m?.isMMDToonMaterial))return;
    o.userData=o.userData||{};
    o.userData._mmdroidNativeMaterials=src;
    const next=src.map(m=>m?.isMMDToonMaterial?makeMmdCompatMaterial(m):m);
    converted+=next.filter((m,i)=>m!==src[i]).length;
    o.material=Array.isArray(o.material)?next:next[0];
  });
  return converted;
}
function repairRenderable(root, receiveShadow=true) {
  let meshCount=0,materialCount=0;
  root.visible=true; root.updateMatrixWorld(true);
  root.traverse(o=>{
    if(!o.isMesh&&!o.isSkinnedMesh)return; meshCount++; o.visible=true; o.castShadow=true; o.receiveShadow=!!receiveShadow;
    if(o.isSkinnedMesh) o.frustumCulled=false;
    const mats=Array.isArray(o.material)?o.material:[o.material];
    for(const mat of mats){if(!mat)continue;materialCount++;if(mat.userData?._mmdroidVisibilityManaged!==true)mat.visible=true;if('colorWrite'in mat)mat.colorWrite=true;let op=getMaterialOpacity(mat,1);if(!Number.isFinite(op)){op=1;setMaterialOpacity(mat,1);}if(op<=0&&mat._mmdroidSourceMaterial){const srcOp=Number(safeMmdUniform(mat._mmdroidSourceMaterial,'opacity',1));if(Number.isFinite(srcOp)&&srcOp>0)setMaterialOpacity(mat,srcOp);}mat.needsUpdate=true;}
    try{o.geometry?.computeBoundingSphere?.();}catch(_){ }
  });
  root.updateMatrixWorld(true);
  return {meshCount,materialCount};
}

function setShadowFlags(root,receiveShadow=true){return repairRenderable(root,receiveShadow);}

function modelReceivesSelfShadow(recOrCategory){
  const category=typeof recOrCategory==='string'?recOrCategory:recOrCategory?.category;
  return category!=='model'||!!ui.characterSelfShadow?.checked;
}
function syncCharacterShadowReception(){
  state.characterSelfShadow=!!ui.characterSelfShadow?.checked;
  for(const rec of state.objects){const receive=modelReceivesSelfShadow(rec);rec.root?.traverse?.(o=>{if(o.isMesh||o.isSkinnedMesh)o.receiveShadow=receive;});}
  renderer.shadowMap.needsUpdate=true;
}

function fitObject(root) {
  if(!root)return;root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(root);if(box.isEmpty()){showToast('对象包围盒为空，无法聚焦。');return;}
  const sphere=box.getBoundingSphere(new THREE.Sphere()),r=Math.max(sphere.radius,.5);const distance=(r/Math.sin(deg(camera.fov)/2))*1.12;
  controls.target.copy(sphere.center);camera.position.copy(sphere.center).add(new THREE.Vector3(0,.16,1).normalize().multiplyScalar(distance));camera.near=Math.max(.01,distance/1500);camera.far=Math.max(5000,distance*50);camera.updateProjectionMatrix();controls.update();updateCameraUI();
}

function createFolder(name='Folder',parentId=null,id=null){
  const folder={id:id||`f${state.nextFolderId++}`,name,parentId:parentId||null,group:new THREE.Group()};folder.group.name=`Folder:${name}`;
  const p=folderById(folder.parentId);(p?.group||scene).add(folder.group);state.folders.push(folder);return folder;
}
function setFolderParent(folder,parentId){
  if(!folder)return; if(parentId===folder.id)return showToast('文件夹不能作为自己的父级。');
  let p=folderById(parentId);let q=p;while(q){if(q.id===folder.id)return showToast('不能形成循环层级。');q=folderById(q.parentId);}
  (p?.group||scene).attach(folder.group);folder.parentId=p?.id||null;
}
function assignObjectFolder(rec,folderId){
  if(!rec)return;if(rec.attachment?.modelId){showToast('服装/配件已绑定人物时不同时放入场景文件夹；请先解除绑定。');return;}
  const f=folderById(folderId);(f?.group||scene).attach(objectTransformNode(rec));rec.folderId=f?.id||null;
}
function deleteFolder(folder){
  if(!folder)return;const parent=folderById(folder.parentId);const dest=parent?.group||scene;
  for(const rec of state.objects.filter(o=>o.folderId===folder.id)){dest.attach(objectTransformNode(rec));rec.folderId=parent?.id||null;}
  for(const child of state.folders.filter(f=>f.parentId===folder.id)){dest.attach(child.group);child.parentId=parent?.id||null;}
  folder.group.removeFromParent();state.folders=state.folders.filter(f=>f!==folder);selectNode('scene');updateSceneTree();
}

function getBoneOverride(rec,name,create=false){if(!rec||!name)return null;if(!rec.boneOverrides[name]&&create)rec.boneOverrides[name]={pos:[0,0,0],rot:[0,0,0]};return rec.boneOverrides[name]||null;}
function boneOffsetFor(rec,name){
  const o=getBoneOverride(rec,name,false)||{pos:[0,0,0],rot:[0,0,0]},pos=new THREE.Vector3(...o.pos),euler=new THREE.Euler(...o.rot.map(deg),'XYZ'),q=new THREE.Quaternion().setFromEuler(euler);
  const er=rec.eyeRotation||{pitch:0,left:0,right:0};let pitch=0;if(name===rec.eyeBones?.left)pitch=er.pitch+er.left;if(name===rec.eyeBones?.right)pitch=er.pitch+er.right;if(pitch)q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),deg(pitch)));
  return{pos,q};
}
function overrideNames(rec){return new Set([...Object.keys(rec.boneOverrides||{}),rec.eyeBones?.left,rec.eyeBones?.right].filter(Boolean));}
function removeBoneOverrides(rec){if(!rec?._overridesApplied)return;for(const name of overrideNames(rec)){const bone=rec.boneMap.get(name);if(!bone)continue;const off=boneOffsetFor(rec,name);bone.position.sub(off.pos);bone.quaternion.multiply(off.q.clone().invert());}rec._overridesApplied=false;}
function applyBoneOverrides(rec){if(!rec||rec._overridesApplied)return;for(const name of overrideNames(rec)){const bone=rec.boneMap.get(name);if(!bone)continue;const off=boneOffsetFor(rec,name);bone.position.add(off.pos);bone.quaternion.multiply(off.q);}rec._overridesApplied=true;}
function removeAllBoneOverrides(){state.objects.forEach(removeBoneOverrides);}function applyAllBoneOverrides(){state.objects.forEach(applyBoneOverrides);}

function initIkMetadata(rec){rec.iks.forEach(ik=>{if(ik._mmdroidEnabled===undefined)ik._mmdroidEnabled=true;for(const link of ik.links||[])if(link._mmdroidUserEnabled===undefined)link._mmdroidUserEnabled=link.enabled!==false;});}
function applyIkFlags(ik){const chain=ik?._mmdroidEnabled!==false;for(const link of ik?.links||[])link.enabled=chain&&(link._mmdroidUserEnabled!==false);}
function ikLabel(rec,ik,index){const bones=rec.bones||Array.from(rec.boneMap.values()),t=bones[ik.target]?.name||`#${ik.target}`,e=bones[ik.effector]?.name||`#${ik.effector}`;return`${index+1}: ${t} ← ${e}`;}

function addRecord(rec,fit=true){state.objects.push(rec);state.activeId=rec.id;markRenderDirty();const folder=folderById(rec.folderId);(folder?.group||scene).add(objectTransformNode(rec));repairRenderable(rec.root,modelReceivesSelfShadow(rec));syncMotionTargetUI();selectNode(rec.category,rec.id);if(fit)fitObject(objectTransformNode(rec));recomputeDuration();}
function applyVisibility(){for(const r of state.objects)objectTransformNode(r).visible=r.visibleWanted!==false;}
function deleteRecord(rec){
  if(!rec)return;
  if(rec.category==='model'){for(const w of [...state.objects])if(w!==rec&&w.wearable?.targetModelId===rec.id)detachWearable(w);}
  else if(['costume','hair','accessory'].includes(rec.category)&&rec.wearable?.targetModelId)detachWearable(rec);
  if(state.transformObject===objectTransformNode(rec))detachTransform();removeBoneOverrides(rec);if(helper.objects.get(rec.root))helper.remove(rec.root);rec.externalMixer?.stopAllAction();objectTransformNode(rec).removeFromParent();rec.pack?.dispose?.();rec.motionPack?.dispose?.();state.objects=state.objects.filter(o=>o!==rec);state.expandedBoneModels.delete(rec.id);if(state.motionTargetId===rec.id)state.motionTargetId=null;if(state.activeId===rec.id)state.activeId=state.objects[0]?.id||null;syncMotionTargetUI();selectNode(state.activeId?(objectById(state.activeId)?.category||'model'):'scene',state.activeId);recomputeDuration();
}
function clearObjects(){for(const rec of [...state.objects])deleteRecord(rec);}
function clearFolders(){for(const f of [...state.folders]){f.group.removeFromParent();}state.folders=[];}

function materialLabel(mat,index){return mat.name?.trim()||`Material ${index+1}`;}
function recordDisplay(rec){const icon={model:'◆',costume:'◈',hair:'✦',stage:'▣',accessory:'◇'}[rec.category]||'◆';return{icon,tag:rec.type.toUpperCase()};}
function categoryLabel(c){return{model:'人物',costume:'服装',hair:'头发',stage:'舞台',accessory:'配件'}[c]||c;}

function inspectorSectionsFor(type){document.querySelectorAll('.inspector-section').forEach(sec=>{const types=(sec.dataset.types||'').split(/[\s,]+/).map(x=>x.trim()).filter(Boolean);sec.classList.toggle('inspector-visible',types.includes(type));});}
function updateInspectorHeader(){
  const s=state.selection,rec=selectedObject(),folder=selectedFolder();let title='场景',sub='Scene Inspector';
  if(['model','costume','hair','stage','accessory'].includes(s.type)&&rec){title=rec.name;sub=`${categoryLabel(rec.category)} · ${rec.type.toUpperCase()}`;}
  else if(s.type==='bone'&&rec){title=s.sub;sub=`骨骼 · ${rec.name}`;}
  else if(s.type==='material'&&rec){title=materialLabel(rec.materials[Number(s.sub)],Number(s.sub));sub=`材质 · ${rec.name}`;}
  else if(s.type==='ik'&&rec){title=ikLabel(rec,rec.iks[Number(s.sub)],Number(s.sub));sub=`IK · ${rec.name}`;}
  else if(s.type==='motion'&&rec){title=rec.motionNames?.join(' + ')||'动作';sub=`VMD · ${rec.name}`;}
  else if(s.type==='physics'&&rec){title=`${rec.name} 物理`;sub='Rigid Body / Skirt / Hair';}
  else if(s.type==='folder'&&folder){title=folder.name;sub='Folder / Group';}
  else{const labels={camera:'镜头',audio:'音乐',lighting:'灯光与后期',environment:'环境 / HDRI'};if(labels[s.type]){title=labels[s.type];sub=labels[s.type];}}
  ui.inspectorTitle.textContent=title;ui.inspectorSubtitle.textContent=sub;
}
function selectNode(type,id=null,sub=null){
  state.selection={type,id:id?String(id):null,sub};
  if(id&&['model','costume','hair','stage','accessory','bone','material','ik','motion','physics'].includes(type))state.activeId=String(id);
  if(id&&['model','motion'].includes(type))state.motionTargetId=String(id);
  inspectorSectionsFor(type);updateInspectorHeader();updateSceneTree();syncInspector();drawTimeline();updateTransformToolbar();
  if(state.transformEdit) attachTransformToSelection();
}

function makeTreeBranch({icon='•',name,type=null,id=null,sub=null,tag='',children=[],key='',folder=false,root=false}){
  if(key) state.allTreeKeys.add(key);
  const wrap=document.createElement('div'),row=document.createElement('div');row.className='tree-row'+(folder?' folder-row':'')+(root?' scene-root':'');
  const active=type&&state.selection.type===type&&String(state.selection.id||'')===String(id||'')&&String(state.selection.sub??'')===String(sub??'');if(active)row.classList.add('active');
  const has=children.length>0,collapsed=key&&state.collapsed.has(key);row.innerHTML=`<span class="twisty">${has?(collapsed?'▸':'▾'):''}</span><span class="icon">${icon}</span><span class="name"></span>${tag?`<span class="tag">${tag}</span>`:''}`;row.querySelector('.name').textContent=name;
  row.addEventListener('click',e=>{if(e.target.classList.contains('twisty')&&has){if(collapsed)state.collapsed.delete(key);else state.collapsed.add(key);updateSceneTree();return;}if(type)selectNode(type,id,sub);});wrap.append(row);
  if(has){const ch=document.createElement('div');ch.className='tree-children'+(collapsed?' collapsed':'');children.forEach(c=>ch.append(c));wrap.append(ch);}return wrap;
}
function boneTreeFor(rec){
  const bones=Array.from(rec.boneMap.values()),set=new Set(bones);function build(b){const kids=b.children.filter(x=>x.isBone&&set.has(x)).map(build);return makeTreeBranch({icon:'└',name:b.name,type:'bone',id:rec.id,sub:b.name,children:kids,key:`bone:${rec.id}:${b.uuid}`});}
  const roots=bones.filter(b=>!b.parent?.isBone||!set.has(b.parent));return roots.map(build);
}
function objectTree(rec){
  const d=recordDisplay(rec),children=[];
  if(rec.category==='model'){
    if(rec.motionNames?.length)children.push(makeTreeBranch({icon:'↝',name:rec.motionNames.join(' + '),type:'motion',id:rec.id,tag:'VMD'}));
    const attached=state.objects.filter(o=>['costume','hair','accessory'].includes(o.category)&&o.attachment?.modelId===rec.id);if(attached.length)children.push(makeTreeBranch({icon:'◇',name:`已绑定服装/头发/配件 (${attached.length})`,children:attached.map(objectTree),key:`attached:${rec.id}`}));
    if(rec.boneMap.size){const open=state.expandedBoneModels.has(rec.id),bones=open?boneTreeFor(rec):[];children.push(makeTreeBranch({icon:'♢',name:`骨骼 (${rec.boneMap.size})`,children:bones,key:`bones:${rec.id}`,tag:open?'已展开':'未展开'}));}
    if(rec.iks.length)children.push(makeTreeBranch({icon:'⌁',name:`IK (${rec.iks.length})`,children:rec.iks.map((ik,i)=>makeTreeBranch({icon:'↯',name:ikLabel(rec,ik,i),type:'ik',id:rec.id,sub:i})),key:`iks:${rec.id}`}));
    children.push(makeTreeBranch({icon:'◌',name:'物理刚体 / 裙摆',type:'physics',id:rec.id,tag:rec.rigidBodies.length?String(rec.rigidBodies.length):'—'}));
  }
  if(rec.materials.length)children.push(makeTreeBranch({icon:'◫',name:`材质 (${rec.materials.length})`,children:rec.materials.map((m,i)=>makeTreeBranch({icon:'▧',name:materialLabel(m,i),type:'material',id:rec.id,sub:i})),key:`mats:${rec.id}`}));
  return makeTreeBranch({icon:d.icon,name:rec.name,type:rec.category,id:rec.id,tag:d.tag,children,key:`obj:${rec.id}`});
}
function folderTree(folder){
  const childFolders=state.folders.filter(f=>f.parentId===folder.id).map(folderTree),objects=state.objects.filter(o=>o.folderId===folder.id&&!o.attachment?.modelId).map(objectTree);return makeTreeBranch({icon:'▾',name:folder.name,type:'folder',id:folder.id,children:[...childFolders,...objects],key:`folder:${folder.id}`,folder:true});
}
function updateSceneTree(){
  ui.sceneTree.innerHTML='';state.allTreeKeys.clear();const rootChildren=[];state.folders.filter(f=>!f.parentId).forEach(f=>rootChildren.push(folderTree(f)));
  for(const cat of ['model','costume','hair','stage','accessory']){const arr=state.objects.filter(o=>o.category===cat&&!o.folderId&&!o.attachment?.modelId);if(arr.length)rootChildren.push(makeTreeBranch({icon:cat==='model'?'◆':cat==='stage'?'▣':'◇',name:`${categoryLabel(cat)} (${arr.length})`,children:arr.map(objectTree),key:`cat:${cat}`,folder:true}));}
  rootChildren.push(makeTreeBranch({icon:'◉',name:state.cameraAnimation?'VMD Camera':'Orbit Camera',type:'camera',tag:'CAM'}),makeTreeBranch({icon:'♫',name:state.audioName||'Audio',type:'audio',tag:state.audioName?'AUDIO':'EMPTY'}),makeTreeBranch({icon:'☀',name:'灯光 / 后期',type:'lighting',tag:'FX'}),makeTreeBranch({icon:'▦',name:state.hdriName?`环境 · ${state.hdriName}`:'环境 / HDRI',type:'environment',tag:'ENV'}));
  ui.sceneTree.append(makeTreeBranch({icon:'◈',name:'Scene',type:'scene',children:rootChildren,key:'scene-root',root:true}));
  const modelCount=state.objects.filter(o=>o.category==='model').length;ui.sceneSummary.textContent=`${state.objects.length} 对象 · ${modelCount} 人物 · ${state.folders.length} 文件夹`;
  ui.sceneStats.textContent=`人物 ${modelCount} · 服装 ${state.objects.filter(o=>o.category==='costume').length} · 头发 ${state.objects.filter(o=>o.category==='hair').length} · 舞台 ${state.objects.filter(o=>o.category==='stage').length} · 配件 ${state.objects.filter(o=>o.category==='accessory').length} · 文件夹 ${state.folders.length} · 编辑器关键帧 ${Object.values(state.editorKeys).reduce((a,b)=>a+(b.keys?.length||0),0)}`;
}

function populateFolderSelect(select,current='',excludeId=null){select.innerHTML='';select.append(new Option('场景根节点',''));for(const f of state.folders){if(f.id===excludeId)continue;select.append(new Option(f.name,f.id));}select.value=current||'';}
function updateTransformUI(rec){if(!rec)return;ui.activeVisible.checked=rec.visibleWanted!==false;ui.scale.value=rec.userScale??1;ui.scaleOut.value=Number(rec.userScale??1).toFixed(3);const tn=objectTransformNode(rec);ui.posX.value=tn.position.x.toFixed(4);ui.posY.value=tn.position.y.toFixed(4);ui.posZ.value=tn.position.z.toFixed(4);ui.rotX.value=rad(tn.rotation.x).toFixed(2);ui.rotY.value=rad(tn.rotation.y).toFixed(2);ui.rotZ.value=rad(tn.rotation.z).toFixed(2);populateFolderSelect(ui.objectFolder,rec.folderId||'');}
function updateMorphUI(rec){const prev=ui.morphSelect.value;ui.morphSelect.innerHTML='';if(!rec?.morphs?.length){ui.morphSelect.append(new Option('暂无表情',''));ui.morphWeight.value=0;ui.morphOut.value='0.00';return;}rec.morphs.forEach(n=>ui.morphSelect.append(new Option(n,n)));ui.morphSelect.value=rec.morphs.includes(prev)?prev:rec.morphs[0];const w=getMorph(rec.root,ui.morphSelect.value);ui.morphWeight.value=w;ui.morphOut.value=w.toFixed(2);}
function populateEyeBoneSelect(select,rec,side,current){
  if(!select)return;select.innerHTML='';const candidates=eyeBoneCandidates(rec,side);
  if(!candidates.length){select.append(new Option('未识别',''));return;}
  for(const c of candidates.slice(0,40))select.append(new Option(`${c.name}  · ${Math.round(c.score)}`,c.name));
  if(current&&!Array.from(select.options).some(o=>o.value===current))select.append(new Option(`${current} · 手动`,current));
  select.value=current||candidates[0].name;
}
function updateEyePitchOutputs(rec,writeInputs=true){const e=rec?.eyeRotation||{pitch:0,left:0,right:0};if(writeInputs){ui.eyePitch.value=e.pitch;ui.eyePitchLeft.value=e.left;ui.eyePitchRight.value=e.right;}ui.eyePitchOut.value=`${e.pitch.toFixed(1)}°`;ui.eyePitchLeftOut.value=`${e.left.toFixed(1)}°`;ui.eyePitchRightOut.value=`${e.right.toFixed(1)}°`;}
function updateEyeUI(rec){if(!rec)return;rec.eyeBones=rec.eyeBones||findEyeBones(rec);populateEyeBoneSelect(ui.eyeBoneLeftSelect,rec,'left',rec.eyeBones.left);populateEyeBoneSelect(ui.eyeBoneRightSelect,rec,'right',rec.eyeBones.right);ui.eyeBoneInfo.textContent=`左眼球: ${rec.eyeBones.left||'未识别'} · 右眼球: ${rec.eyeBones.right||'未识别'} · 已排除眼眶/眼皮类骨骼`;updateEyePitchOutputs(rec,true);}
function syncBoneUI(rec,name){const o=rec&&name?getBoneOverride(rec,name,false):null,p=o?.pos||[0,0,0],r=o?.rot||[0,0,0];ui.boneNameLabel.textContent=name||'未选择骨骼';[ui.bonePosX.value,ui.bonePosY.value,ui.bonePosZ.value]=p.map(v=>Number(v).toFixed(4));[ui.boneRotX.value,ui.boneRotY.value,ui.boneRotZ.value]=r.map(v=>Number(v).toFixed(2));if(rec){const isEye=name===rec.eyeBones?.left||name===rec.eyeBones?.right;ui.eyeSection.classList.toggle('inspector-visible',isEye);if(isEye)updateEyeUI(rec);}}
function syncIkUI(rec,index){const ik=rec?.iks?.[index];if(!ik)return;ui.ikNameLabel.textContent=ikLabel(rec,ik,index);ui.ikEnabled.checked=ik._mmdroidEnabled!==false;ui.ikIteration.value=ik.iteration||1;ui.ikIterationOut.value=String(ik.iteration||1);ui.ikMinAngle.value=Number.isFinite(ik.minAngle)?rad(ik.minAngle).toFixed(2):'';ui.ikMaxAngle.value=Number.isFinite(ik.maxAngle)?rad(ik.maxAngle).toFixed(2):'';const bones=rec.bones||Array.from(rec.boneMap.values());ui.ikLinkSelect.innerHTML='';(ik.links||[]).forEach((l,j)=>ui.ikLinkSelect.append(new Option(`${j+1}: ${bones[l.index]?.name||'#'+l.index}`,String(j))));if(!ik.links?.length)ui.ikLinkSelect.append(new Option('暂无链节',''));syncIkLinkUI(rec,index);}
function syncIkLinkUI(rec,index){const ik=rec?.iks?.[index],link=ik?.links?.[Number(ui.ikLinkSelect.value)||0];ui.ikLinkEnabled.checked=!!link&&link._mmdroidUserEnabled!==false;}
function syncMaterialUI(rec,index){const m=rec?.materials?.[index];if(!m)return;ui.materialNameLabel.textContent=`${materialLabel(m,index)} · ${m.type} · ${m.userData?._mmdroidRole||'generic'} / ${m.userData?._mmdroidResolvedAlphaMode||'auto'}`;const mc=m.color||m.diffuse;if(mc)ui.matColor.value=`#${mc.getHexString()}`;ui.matEmissive.disabled=!m.emissive;if(m.emissive)ui.matEmissive.value=`#${m.emissive.getHexString()}`;ui.matOpacity.value=getMaterialOpacity(m,1);ui.matOpacityOut.value=Number(ui.matOpacity.value).toFixed(2);ui.matAlphaMode.value=m.userData?._mmdroidAlphaModeOverride||'auto';ui.matAlphaCutoff.value=Number(m.userData?._mmdroidAlphaCutoff??m.alphaTest??.03);ui.matAlphaCutoffOut.value=Number(ui.matAlphaCutoff.value).toFixed(2);ui.matTransparent.checked=!!m.transparent;ui.matDepthWrite.checked=m.depthWrite!==false;ui.matDoubleSide.checked=m.side===THREE.DoubleSide;ui.matWireframe.checked=!!m.wireframe;ui.matTextureEnabled.checked=!!m.map;ui.matRoughness.disabled=!('roughness'in m);ui.matMetalness.disabled=!('metalness'in m);ui.matRoughness.value='roughness'in m?m.roughness:.5;ui.matMetalness.value='metalness'in m?m.metalness:0;ui.matRoughnessOut.value='roughness'in m?Number(m.roughness).toFixed(2):'—';ui.matMetalnessOut.value='metalness'in m?Number(m.metalness).toFixed(2):'—';const op=m.userData?.outlineParameters||{};ui.matOutlineVisible.checked=op.visible!==false;ui.matOutlineThickness.value=Number.isFinite(op.thickness)?op.thickness:.003;ui.matOutlineThicknessOut.value=Number(ui.matOutlineThickness.value).toFixed(4);}
function updateAttachmentUI(rec){ui.attachModel.innerHTML='';ui.attachModel.append(new Option('不绑定',''));state.objects.filter(o=>o.category==='model').forEach(m=>ui.attachModel.append(new Option(m.name,m.id)));ui.attachModel.value=rec?.attachment?.modelId||'';refreshAttachBoneOptions(rec?.attachment?.boneName||'');}
function refreshAttachBoneOptions(current=''){ui.attachBone.innerHTML='';const model=objectById(ui.attachModel.value);if(!model){ui.attachBone.append(new Option('—',''));return;}ui.attachBone.append(new Option('模型根节点','__root__'));for(const n of model.boneMap.keys())ui.attachBone.append(new Option(n,n));ui.attachBone.value=current&&([...model.boneMap.keys()].includes(current)||current==='__root__')?current:'__root__';}
function syncFolderUI(folder){if(!folder)return;ui.folderName.value=folder.name;populateFolderSelect(ui.folderParent,folder.parentId||'',folder.id);}
function syncPhysicsUI(rec){if(!rec)return;ui.physicsObjectName.textContent=`${rec.name} · 刚体 ${rec.rigidBodies.length}`;ui.physicsEnabled.checked=!!rec.physics.enabled;ui.physicsProfile.value=rec.physics.profile||'all';ui.gravity.value=rec.physics.gravity??-98;ui.gravityOut.value=Number(ui.gravity.value).toFixed(1);ui.physicsSteps.value=rec.physics.steps??3;ui.physicsStepsOut.value=String(ui.physicsSteps.value);ui.physicsStatus.textContent=rec.physics.enabled?'物理已启用。修改范围/重力后点击“重建当前人物物理”。':'物理未启用。首次开启会加载 Ammo.js。';}
function availableMotionModels(requireMmd=true){return state.objects.filter(o=>o.category==='model'&&(!requireMmd||['pmx','pmd'].includes(o.type)));}
function preferredSelectedModel(requireMmd=true){const rec=selectedObject();if(rec?.category==='model'&&(!requireMmd||['pmx','pmd'].includes(rec.type)))return rec;const active=activeObject();if(active?.category==='model'&&(!requireMmd||['pmx','pmd'].includes(active.type)))return active;return null;}
function resolveMotionTarget(preferred=null,{quiet=false,requireMmd=true}={}){
  let rec=preferred?.category==='model'?preferred:null;
  if(!rec&&state.motionTargetId)rec=objectById(state.motionTargetId);
  if(!rec||rec.category!=='model')rec=preferredSelectedModel(requireMmd);
  if(rec&&requireMmd&&!['pmx','pmd'].includes(rec.type)){if(!quiet)showToast('动作目标需要是 PMX / PMD 人物。');return null;}
  if(!rec&&requireMmd&&!quiet)showToast('请选择要绑定动作的人物，或在右侧动作面板中指定目标人物。');
  return rec||null;
}
function syncMotionTargetUI(){
  if(!ui.motionTargetModel)return;
  const prev=state.motionTargetId&&objectById(state.motionTargetId)?.category==='model'?String(state.motionTargetId):'';
  const models=availableMotionModels(false);
  ui.motionTargetModel.innerHTML='';ui.motionTargetModel.append(new Option('自动跟随当前选中人物',''));
  for(const m of models){const tag=['pmx','pmd'].includes(m.type)?'':' · 仅内嵌动画';ui.motionTargetModel.append(new Option(`${m.name} · ${m.type.toUpperCase()}${tag}`,m.id));}
  ui.motionTargetModel.value=models.some(m=>m.id===prev)?prev:'';
  state.motionTargetId=ui.motionTargetModel.value||null;
  const target=resolveMotionTarget(null,{quiet:true,requireMmd:false});
  const selectedModel=preferredSelectedModel(false);
  if(!models.length){ui.motionTargetInfo.textContent='当前场景还没有人物模型；请先导入人物，再为不同人物分别绑定动作。';return;}
  if(state.motionTargetId){
    ui.motionTargetInfo.textContent=target?`当前动作目标：${target.name} · ${target.type.toUpperCase()}。之后导入的 VMD 将只绑定到这个人物。`:'当前已指定动作目标，但该人物已不存在。';
    return;
  }
  if(selectedModel){
    ui.motionTargetInfo.textContent=['pmx','pmd'].includes(selectedModel.type)?`自动模式：当前跟随人物 ${selectedModel.name}。每个人物都可以单独导入不同动作。`:`自动模式：当前选中 ${selectedModel.name}，但它是 ${selectedModel.type.toUpperCase()}，VMD 只支持绑定到 PMX / PMD。`;
    return;
  }
  ui.motionTargetInfo.textContent='自动模式：尚未选中人物。导入 VMD 前请先选中人物，或在这里手动指定目标人物。';
}
function updateCameraUI(){ui.fov.value=camera.fov;ui.fovOut.value=`${Math.round(camera.fov)}°`;ui.camTargetX.value=controls.target.x.toFixed(2);ui.camTargetY.value=controls.target.y.toFixed(2);ui.camTargetZ.value=controls.target.z.toFixed(2);}
function syncMotionUI(rec){const target=rec||resolveMotionTarget(null,{quiet:true,requireMmd:false});if(!ui.motionInfo)return;if(!target){ui.motionInfo.textContent='尚未指定动作目标人物';return;}const header=`目标人物：${target.name} · ${target.type.toUpperCase()}`;ui.motionInfo.textContent=target.motionNames?.length?`${header}\n${target.motionNames.join(' + ')} · ${formatTime(target.duration||0)}`:`${header}\n当前人物没有 VMD 动作`;if(ui.btnRemoveMotion)ui.btnRemoveMotion.disabled=!target.motionNames?.length;}
function syncInspector(){
  const s=state.selection,rec=selectedObject();
  if(['model','costume','hair','stage','accessory'].includes(s.type)&&rec){updateTransformUI(rec);if(ui.mmdCompatInfo){const miss=rec.missingResources?.length||0,decode=rec.textureLoadErrors?.length||0,missNames=(rec.missingResources||[]).map(basename).filter(Boolean).slice(0,2).join(', ');ui.mmdCompatInfo.textContent=(rec.type==='pmx'||rec.type==='pmd')?`${ui.renderPipeline?.selectedOptions?.[0]?.textContent||state.renderPipeline} · 管线材质 ${rec.materials?.length||0} · 光滑 ${smoothPresets[rec.smoothing?.preset]?.label||'自定义'} ${Math.round(rec.smoothing?.angle??105)}°/${Math.round((rec.smoothing?.strength??.78)*100)}% · 缺失贴图 ${miss}${missNames?` (${missNames})`:''}${decode?` · 解码失败 ${decode}`:''}${miss?' · 已使用可见预览':''}`:'标准材质渲染';}if(s.type==='model'){updateMorphUI(rec);updateEyeUI(rec);syncSurfaceQualityUI(rec);syncWearableLibrarySelectors();renderModelPartsUI(rec);syncExpressionPresetUI(rec);}if(['costume','hair','accessory'].includes(s.type))updateAttachmentUI(rec);}
  else if(s.type==='bone'&&rec)syncBoneUI(rec,String(s.sub||''));
  else if(s.type==='ik'&&rec)syncIkUI(rec,Number(s.sub));
  else if(s.type==='material'&&rec)syncMaterialUI(rec,Number(s.sub));
  else if(s.type==='folder')syncFolderUI(selectedFolder());
  else if(s.type==='physics'&&rec)syncPhysicsUI(rec);
  else if(s.type==='motion'&&rec)syncMotionUI(rec);
  else if(s.type==='camera')updateCameraUI();
  else if(s.type==='audio')ui.audioInfo.textContent=state.audioName||'未导入音乐';
  if(['scene','model','motion'].includes(s.type))syncMotionUI(s.type==='model'?rec:(s.type==='motion'?rec:null));
  syncMotionTargetUI();
}

function lightPosition(light,azDeg,elDeg,r=80){const az=deg(azDeg),el=deg(elDeg);light.position.set(Math.cos(el)*Math.sin(az)*r,Math.sin(el)*r,Math.cos(el)*Math.cos(az)*r);light.target.position.set(0,8,0);}
function syncLightingFromUI(mark=true){
  const p=pipelineProfile(),gain=p.lightGain;
  const k=num(ui.keyLight,1.35),f=num(ui.fillLight,.42),r=num(ui.rimLight,.70),a=num(ui.ambient,.58);
  keyLight.color.set(ui.keyColor.value);keyLight.intensity=k*gain;fillLight.color.set(ui.fillColor.value);fillLight.intensity=f*gain;rimLight.color.set(ui.rimColor.value);rimLight.intensity=r*gain;ambientLight.color.set(ui.ambientSky.value);ambientLight.groundColor.set(ui.ambientGround.value);ambientLight.intensity=a*Math.max(.58,gain);
  syncToneMappingForPipeline();
  lightPosition(keyLight,num(ui.lightAz,-35),num(ui.lightEl,50));lightPosition(fillLight,num(ui.fillAz,45),num(ui.fillEl,25));lightPosition(rimLight,num(ui.rimAz,150),num(ui.rimEl,35));
  ui.keyLightOut.value=k.toFixed(2);ui.fillLightOut.value=f.toFixed(2);ui.rimLightOut.value=r.toFixed(2);ui.ambientOut.value=a.toFixed(2);ui.exposureOut.value=num(ui.exposure,1).toFixed(2);
  updatePipelineShaderUniforms();if(mark)markBakeDirty();
}
function syncShadowFromUI(mark=true){renderer.shadowMap.enabled=ui.shadows.checked;keyLight.castShadow=ui.shadows.checked;state.characterSelfShadow=!!ui.characterSelfShadow?.checked;syncCharacterShadowReception();const size=Number(ui.shadowMapSize.value)||2048;keyLight.shadow.mapSize.set(size,size);if(keyLight.shadow.map){keyLight.shadow.map.dispose();keyLight.shadow.map=null;}keyLight.shadow.bias=num(ui.shadowBias,.0002);keyLight.shadow.normalBias=num(ui.shadowNormalBias,.045);keyLight.shadow.radius=num(ui.shadowRadius,1.5);ui.shadowBiasOut.value=keyLight.shadow.bias.toFixed(5);ui.shadowNormalBiasOut.value=keyLight.shadow.normalBias.toFixed(3);ui.shadowRadiusOut.value=keyLight.shadow.radius.toFixed(1);renderer.shadowMap.needsUpdate=true;if(mark)markBakeDirty();}
function transformSelectionTarget(){
  if(state.selection.type==='folder'){
    const f=selectedFolder();return f?{object:f.group,id:null,label:f.name,kind:'folder'}:null;
  }
  const rec=selectedObject();
  return rec?{object:objectTransformNode(rec),id:rec.id,label:rec.name,kind:'object'}:null;
}
function updateTransformToolbar(){
  const target=transformSelectionTarget(),rec=selectedObject(),boneTarget=rec?.category==='model'?rec:null;
  ui.btnTransformMove.classList.toggle('active-tool',state.transformEdit&&state.transformMode==='translate');
  ui.btnTransformRotate.classList.toggle('active-tool',state.transformEdit&&state.transformMode==='rotate');
  ui.btnToggleBones.disabled=!boneTarget;ui.btnToggleBones.textContent=boneTarget&&state.expandedBoneModels.has(boneTarget.id)?'收起骨骼':'展开骨骼';
  ui.transformHint.textContent=state.transformEdit?(target?`正在编辑：${target.label} · ${state.transformMode==='translate'?'移动':'旋转'}轴`:'请在树中选择人物/服装/舞台/配件/文件夹'):'选择对象后点“移动模型”或“旋转模型”显示三维坐标轴';
}
function detachTransform(){
  transformControls.detach();transformHelper.visible=false;state.transformObject=null;state.transformTargetId=null;updateTransformToolbar();
}
function attachTransformToSelection(){
  const target=transformSelectionTarget();if(!state.transformEdit||!target){detachTransform();return;}
  target.object.matrixAutoUpdate=true;target.object.matrixWorldAutoUpdate=true;target.object.updateMatrixWorld(true);transformControls.enabled=true;transformControls.attach(target.object);transformHelper.visible=true;transformControls.setMode(state.transformMode);state.transformObject=target.object;state.transformTargetId=target.id;updateTransformToolbar();
}
function setTransformEdit(enabled){
  state.transformEdit=!!enabled;if(state.transformEdit)attachTransformToSelection();else detachTransform();updateTransformToolbar();
}
function setTransformMode(mode){
  state.transformMode=mode==='rotate'?'rotate':'translate';transformControls.setMode(state.transformMode);if(state.transformEdit)attachTransformToSelection();updateTransformToolbar();
}
function resetTransformTarget(){
  const target=transformSelectionTarget();if(!target)return showToast('请先选择要归零的人物、服装、舞台、配件或文件夹。');
  target.object.position.set(0,0,0);target.object.rotation.set(0,0,0);target.object.updateMatrixWorld(true);markBakeDirty();
  const rec=target.id?objectById(target.id):null;if(rec)updateTransformUI(rec);else if(target.kind==='folder')syncFolderUI(selectedFolder());
  showToast(`${target.label} 已回到原点（位置/旋转归零，缩放保持不变）`);updateTransformToolbar();
}

function markBakeDirty(){if(!state.shadowFrozen)return;state.shadowDirty=true;ui.bakeStatus.textContent='阴影模式：冻结缓存（场景已变化，建议重新烘焙）';}
function setShadowFrozen(frozen,notify=true){state.shadowFrozen=!!frozen;state.shadowDirty=false;renderer.shadowMap.autoUpdate=!state.shadowFrozen;renderer.shadowMap.needsUpdate=true;ui.bakeStatus.textContent=state.shadowFrozen?'阴影模式：冻结缓存':'阴影模式：实时';if(notify)showToast(state.shadowFrozen?'已冻结当前阴影缓存。':'已恢复实时阴影。');}
function refreshShadowBake(){renderer.shadowMap.needsUpdate=true;state.shadowDirty=false;ui.bakeStatus.textContent=state.shadowFrozen?'阴影模式：冻结缓存（已更新）':'阴影模式：实时';}
function syncEnvironmentFromUI(){
  const pp=pipelineProfile(),physical=pipelineUsesPhysical();scene.environment=state.hdriEnv||(physical?pbrFallbackEnv:null);
  const preset=ui.builtinEnvironment?.value||state.builtinEnvironment||'solid';
  if(appliedBuiltinEnvironment!==preset||(!builtinSkyDome&&!builtinEnvironmentGroup&&preset!=='solid'))applyBuiltinEnvironmentPreset(preset);
  else if(preset==='solid'&&!state.hdriSource)scene.background=new THREE.Color(ui.bgColor.value);
  floorMaterial.color.set(ui.floorColor.value);floorMaterial.roughness=num(ui.floorRoughness,.82);floorMaterial.metalness=num(ui.floorMetalness,.03);floorMaterial.needsUpdate=true;floor.visible=ui.floorVisible.checked;grid.visible=ui.gridVisible.checked;ui.floorRoughnessOut.value=floorMaterial.roughness.toFixed(2);ui.floorMetalnessOut.value=floorMaterial.metalness.toFixed(2);
  scene.fog=ui.fogEnabled.checked?new THREE.FogExp2(ui.fogColor.value,Math.max(0,num(ui.fogDensity,.006))):null;const envI=num(ui.hdriIntensity,1);scene.environmentIntensity=physical?envI*pp.env:0;
  for(const rec of state.objects)for(const m of rec.materials||[])if('envMapIntensity' in m){const role=m.userData?._mmdroidRole||'generic',rg=role==='skin'?.52:role==='hair'?.88:1;m.envMapIntensity=physical?Math.max(.025,envI*pp.env*rg):0;}
  ui.hdriIntensityOut.value=envI.toFixed(2);
  const hdriBg=!!(state.hdriSource&&ui.hdriBackground.checked);
  if(builtinSkyDome)builtinSkyDome.visible=!hdriBg;
  if(state.hdriSource&&hdriBg)scene.background=state.hdriSource;
  else if(preset==='solid')scene.background=new THREE.Color(ui.bgColor.value);
}
function syncPostFromUI(){const enabled=ui.postEnabled.checked;ssaoPass.enabled=enabled&&ui.ssaoEnabled.checked;bloomPass.enabled=enabled&&ui.bloomEnabled.checked;bokehPass.enabled=enabled&&ui.dofEnabled.checked;bloomPass.strength=num(ui.bloomStrength,.5);bloomPass.threshold=num(ui.bloomThreshold,.85);bloomPass.radius=num(ui.bloomRadius,.35);ssaoPass.kernelRadius=num(ui.ssaoRadius,8);ssaoPass.minDistance=Math.max(0,num(ui.ssaoMin,.005));ssaoPass.maxDistance=Math.max(ssaoPass.minDistance,num(ui.ssaoMax,.1));bokehPass.uniforms.focus.value=num(ui.dofFocus,25);bokehPass.uniforms.aperture.value=num(ui.dofAperture,.025);bokehPass.uniforms.maxblur.value=num(ui.dofMaxBlur,.01);ui.bloomStrengthOut.value=bloomPass.strength.toFixed(2);ui.bloomThresholdOut.value=bloomPass.threshold.toFixed(2);ui.bloomRadiusOut.value=bloomPass.radius.toFixed(2);ui.ssaoRadiusOut.value=String(Math.round(ssaoPass.kernelRadius));ui.dofFocusOut.value=num(ui.dofFocus,25).toFixed(1);ui.dofApertureOut.value=num(ui.dofAperture,.025).toFixed(3);ui.dofMaxBlurOut.value=num(ui.dofMaxBlur,.01).toFixed(3);}

async function loadObjectRoot(type,file,pack){
  pack.setBase?.(file);
  if(type==='pmx'||type==='pmd'){const loader=createAndroidMmdLoader(pack);return await new Promise((res,rej)=>loader.load(pack.virtual(file),res,undefined,rej));}
  if(type==='fbx'){const loader=new FBXLoader(pack.manager);return await new Promise((res,rej)=>loader.load(pack.virtual(file),res,undefined,rej));}
  if(type==='glb'||type==='gltf'){const loader=new GLTFLoader(pack.manager);const gltf=await new Promise((res,rej)=>loader.load(pack.virtual(file),res,undefined,rej));gltf.scene.animations=gltf.animations||[];return gltf.scene;}
  if(type==='obj'){const loader=new OBJLoader(pack.manager);return await new Promise((res,rej)=>loader.load(pack.virtual(file),res,undefined,rej));}
  throw new Error(`不支持的模型格式：${type}`);
}
const bodyRoleRe=/body|skin|face|head|eye|brow|lash|mouth|tooth|tongue|ear|arm|leg|hand|torso|neck|胸|素体|身体|脸|顔|頭|目|眉|睫|口|歯|耳/i;
const costumeRoleRe=/cloth|clothes|costume|outfit|shirt|skirt|dress|pants|sock|stocking|shoe|glove|sleeve|jacket|coat|uniform|bra|underwear|belt|cape|cloak|服|衣|裙|裤|襪|鞋|袖|外套|上衣|下装|制服|ドレス|スカート|シャツ|ズボン|靴|服装/i;
const accessoryRoleRe=/accessor|prop|weapon|glasses|glass|hat|cap|ribbon|hairpin|necklace|earring|bag|sword|staff|wing|tail|item|配件|附件|道具|武器|眼镜|帽|头饰|耳环|项链|包|翅膀|リボン|メガネ|アクセ/i;
const wearableTranslationSemantics=new Set(['root','center','groove','hips','leftFootIK','rightFootIK','leftToeIK','rightToeIK']);
const semanticFallbacks={center:['hips','groove','root'],groove:['center','hips'],hips:['center','groove'],spine:['chest','hips'],chest:['spine','neck'],leftFootIK:['leftFoot','leftToe'],rightFootIK:['rightFoot','rightToe'],leftToeIK:['leftToe','leftFootIK'],rightToeIK:['rightToe','rightFootIK']};
function meshRole(obj){const mats=Array.isArray(obj.material)?obj.material:[obj.material];const s=[obj.name,obj.parent?.name,...mats.map(m=>m?.name)].filter(Boolean).join(' ').toLowerCase();if(accessoryRoleRe.test(s))return 'accessory';if(costumeRoleRe.test(s))return 'costume';if(bodyRoleRe.test(s))return 'body';return 'body';}
function computeRoleBounds(root,role){const box=new THREE.Box3();let found=false;root.traverse(o=>{if(o.isMesh&&(!role||meshRole(o)===role)){o.updateWorldMatrix(true,false);box.expandByObject(o);found=true;}});return found&&!box.isEmpty()?box:null;}
function morphMaterialRoles(root){const map=new Map(),mesh=firstMmdMesh(root),raw=mesh?.geometry?.userData?.MMDroid?.morphs||[];const apply=(m,kind)=>{if(!m||Number(m.type)!==8||!kind)return;for(const el of m.elements||[]){const idx=Number(el.index);if(Number.isInteger(idx)&&idx>=0)map.set(idx,kind);}};for(const m of raw){let kind=morphPartKind(m?.name);if(Number(m?.type)===8)apply(m,kind);else if(Number(m?.type)===0){for(const el of m.elements||[]){const child=raw[Number(el.index)],ck=kind||morphPartKind(child?.name);apply(child,ck);}}}return map;}
function filterMeshesForCategory(root,category){const stats={body:0,costume:0,hair:0,accessory:0},morphRoles=morphMaterialRoles(root);if(category==='model'){root.traverse(o=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];for(let i=0;i<mats.length;i++){const m=mats[i],k=modelPartKindForMaterial(m)||morphRoles.get(i)||'body';stats[k]=(stats[k]||0)+1;if(m)m.visible=true;}o.visible=true;});return stats;}const keep=category==='costume'?'costume':category==='hair'?'hair':category==='accessory'?'accessory':null;if(!keep)return stats;root.traverse(o=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];let any=false;for(let i=0;i<mats.length;i++){const m=mats[i],role=modelPartKindForMaterial(m)||morphRoles.get(i)||'body';stats[role]=(stats[role]||0)+1;if(m){m.userData=m.userData||{};m.userData._mmdroidVisibilityManaged=true;m.visible=role===keep;if(m.visible)any=true;}}o.visible=any;});return stats;}
function boneKey(name){let s=normalizeTextKey(name);s=s.replace(/^mixamorig[:_.\-\s]*/,'');s=s.replace(/^j[:_.\-\s]*bip[:_.\-\s]*l[:_.\-\s]*/,'left');s=s.replace(/^j[:_.\-\s]*bip[:_.\-\s]*r[:_.\-\s]*/,'right');s=s.replace(/^j[:_.\-\s]*bip[:_.\-\s]*c[:_.\-\s]*/,'');s=s.replace(/(^|[:_.\-\s])l($|[:_.\-\s])/g,'$1left$2').replace(/(^|[:_.\-\s])r($|[:_.\-\s])/g,'$1right$2');return s.replace(/[\s_.:\-\/\\()\[\]{}]/g,'');}
function sideOfBone(k){if(/左|left|(^|[^a-z])l($|[^a-z])/.test(k))return 'left';if(/右|right|(^|[^a-z])r($|[^a-z])/.test(k))return 'right';return '';}
function semanticBone(name){const k=boneKey(name),side=sideOfBone(k);if(!k)return null;
  if(/全ての親|全亲|root|armature|master/.test(k))return 'root';
  if(/グルーブ|groove/.test(k))return 'groove';
  if(/センター|center|centre/.test(k))return 'center';
  if(/左足ik|leftfootik|legik_l|llegik/.test(k))return 'leftFootIK';if(/右足ik|rightfootik|legik_r|rlegik/.test(k))return 'rightFootIK';
  if(/左つま先ik|lefttoeik/.test(k))return 'leftToeIK';if(/右つま先ik|righttoeik/.test(k))return 'rightToeIK';
  if(/下半身|pelvis|hips|hip|waist|腰/.test(k)&&!/leg|足/.test(k))return 'hips';
  if(/上半身2|upperchest|spine2|spine02|chest2/.test(k))return 'chest';
  if(/上半身|spine1|spine01|spine|chest|torso|胸/.test(k))return 'spine';
  if(/首|neck/.test(k))return 'neck';if(/頭|头|head/.test(k))return 'head';
  if(/肩|shoulder|clavicle|collar/.test(k))return side==='left'?'leftShoulder':side==='right'?'rightShoulder':null;
  if(/ひじ|肘|elbow|forearm|lowerarm/.test(k))return side==='left'?'leftLowerArm':side==='right'?'rightLowerArm':null;
  if(/手首|wrist|hand/.test(k))return side==='left'?'leftHand':side==='right'?'rightHand':null;
  if(/腕|upperarm|arm/.test(k))return side==='left'?'leftUpperArm':side==='right'?'rightUpperArm':null;
  if(/つま先|toe/.test(k))return side==='left'?'leftToe':side==='right'?'rightToe':null;
  if(/足首|ankle|foot/.test(k))return side==='left'?'leftFoot':side==='right'?'rightFoot':null;
  if(/ひざ|膝|knee|calf|lowerleg/.test(k))return side==='left'?'leftLowerLeg':side==='right'?'rightLowerLeg':null;
  if(/足|upleg|upperleg|thigh|leg/.test(k))return side==='left'?'leftUpperLeg':side==='right'?'rightUpperLeg':null;
  return null;
}
function localPointInTransform(rec,obj){objectTransformNode(rec).updateMatrixWorld(true);obj.updateWorldMatrix(true,false);const inv=objectTransformNode(rec).matrixWorld.clone().invert();return obj.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);}
function captureSkeletonProfile(rec){const profile={bones:[],byKey:new Map(),bySemantic:new Map(),bodyBounds:computeRoleBounds(rec.root,'body'),costumeBounds:computeRoleBounds(rec.root,'costume'),allBounds:computeRoleBounds(rec.root,null),basis:new THREE.Quaternion(),anchorSemantic:null};
  for(const [name,bone] of rec.boneMap||[]){const entry={name,key:boneKey(name),semantic:semanticBone(name),bone,restPos:bone.position.clone(),restQuat:bone.quaternion.clone(),restScale:bone.scale.clone(),wrapperPos:localPointInTransform(rec,bone)};profile.bones.push(entry);if(entry.key&&!profile.byKey.has(entry.key))profile.byKey.set(entry.key,entry);if(entry.semantic&&!profile.bySemantic.has(entry.semantic))profile.bySemantic.set(entry.semantic,entry);}
  const get=s=>profile.bySemantic.get(s)?.wrapperPos||null;const lsh=get('leftShoulder')||get('leftUpperArm'),rsh=get('rightShoulder')||get('rightUpperArm'),hips=get('hips')||get('center')||get('groove'),head=get('head')||get('neck');
  if(lsh&&rsh&&hips&&head){const x=rsh.clone().sub(lsh).normalize(),y=head.clone().sub(hips).normalize(),z=x.clone().cross(y).normalize();if(z.lengthSq()>.5){y.copy(z).cross(x).normalize();profile.basis.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z));}}
  profile.anchorSemantic=profile.bySemantic.has('hips')?'hips':profile.bySemantic.has('center')?'center':profile.bySemantic.has('groove')?'groove':null;
  profile.metrics=measureSkeletonProfile(profile);return profile;
}
function sizeOfBox(box){return box&&!box.isEmpty()?box.getSize(new THREE.Vector3()):new THREE.Vector3();}
function distSemantic(profile,a,b){const pa=profile.bySemantic.get(a)?.wrapperPos,pb=profile.bySemantic.get(b)?.wrapperPos;return pa&&pb?pa.distanceTo(pb):0;}
function measureSkeletonProfile(profile){const body=sizeOfBox(profile.bodyBounds),all=sizeOfBox(profile.allBounds),box=body.lengthSq()>1e-10?body:all;const shoulder=distSemantic(profile,'leftShoulder','rightShoulder')||distSemantic(profile,'leftUpperArm','rightUpperArm');const hip=distSemantic(profile,'leftUpperLeg','rightUpperLeg');const torso=distSemantic(profile,'hips','neck')||distSemantic(profile,'center','neck');const leg=Math.max(distSemantic(profile,'leftUpperLeg','leftFoot'),distSemantic(profile,'rightUpperLeg','rightFoot'));const head=profile.bySemantic.get('head')?.wrapperPos;const lf=profile.bySemantic.get('leftFoot')?.wrapperPos,rf=profile.bySemantic.get('rightFoot')?.wrapperPos;let skeletonHeight=0;if(head&&(lf||rf)){const foot=lf&&rf?lf.clone().add(rf).multiplyScalar(.5):(lf||rf);skeletonHeight=Math.abs(head.y-foot.y);}return{width:box.x||shoulder||hip||1,height:box.y||skeletonHeight||torso+leg||1,depth:box.z||Math.max((shoulder||1)*.35,1e-3),shoulder,hip,torso,leg,skeletonHeight};}
function medianPositive(values,fallback=1){const a=values.filter(v=>Number.isFinite(v)&&v>1e-5).sort((x,y)=>x-y);if(!a.length)return fallback;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])*.5;}
function safeRatio(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&a>1e-5&&b>1e-5?a/b:0;}
function currentProfilePoint(rec,p){if(!p)return null;const pivot=rec.root?.position||new THREE.Vector3(),s=Number(rec.userScale)||1;return pivot.clone().add(p.clone().sub(pivot).multiplyScalar(s));}
function profileEntry(profile,semantic){if(!profile||!semantic)return null;let e=profile.bySemantic.get(semantic);if(e)return e;for(const alt of semanticFallbacks[semantic]||[]){e=profile.bySemantic.get(alt);if(e)return e;}return null;}
function findTargetRestForSource(src,targetProfile){if(!src||!targetProfile)return null;let t=src.key?targetProfile.byKey.get(src.key):null;if(t)return t;if(src.semantic){t=profileEntry(targetProfile,src.semantic);if(t)return t;}return null;}
function buildWearableBoneMap(rec,model){const sp=rec.skeletonProfile||captureSkeletonProfile(rec),tp=model.skeletonProfile||captureSkeletonProfile(model),pairs=[];let semanticMatches=0,exactMatches=0;for(const src of sp.bones){const tgt=findTargetRestForSource(src,tp);if(!tgt)continue;const exact=!!(src.key&&tgt.key===src.key);if(exact)exactMatches++;else semanticMatches++;pairs.push({sourceBone:src.bone,targetBone:tgt.bone,srcRest:src,tgtRest:tgt,semantic:src.semantic||tgt.semantic||null,exact});}return{pairs,exactMatches,semanticMatches,sourceBones:sp.bones.length,targetBones:tp.bones.length,coverage:sp.bones.length?pairs.length/sp.bones.length:0};}
function adaptationScale(rec,model){const sm=rec.skeletonProfile?.metrics||{},tm=model.skeletonProfile?.metrics||{},targetUser=Number(model.userScale)||1;const h=safeRatio((tm.height||0)*targetUser,sm.height),torso=safeRatio((tm.torso||0)*targetUser,sm.torso),shoulder=safeRatio((tm.shoulder||0)*targetUser,sm.shoulder),hip=safeRatio((tm.hip||0)*targetUser,sm.hip),width=safeRatio((tm.width||0)*targetUser,sm.width),depth=safeRatio((tm.depth||0)*targetUser,sm.depth);let sy=medianPositive([h,torso],1),sx=medianPositive([shoulder,hip,width,sy],sy),sz=medianPositive([depth,sx,sy],sx);sy=clamp(sy,.25,4);sx=clamp(sx,sy*.68,sy*1.48);sz=clamp(sz,sy*.62,sy*1.55);return new THREE.Vector3(sx,sy,sz);}
function wearableFitKey(rec,model){return `${model.id}|${Number(model.userScale||1).toFixed(5)}|${Number(rec.userScale||1).toFixed(5)}|${rec.skeletonProfile?.bones?.length||0}|${model.skeletonProfile?.bones?.length||0}`;}
function fitWearableToModel(rec,model,force=false){if(!rec||!model||!['costume','hair','accessory'].includes(rec.category))return;rec.skeletonProfile=rec.skeletonProfile||captureSkeletonProfile(rec);model.skeletonProfile=model.skeletonProfile||captureSkeletonProfile(model);rec.wearable=rec.wearable||{};const key=wearableFitKey(rec,model);if(!force&&rec.wearable.lastFitKey===key)return;const targetNode=objectTransformNode(model),wearNode=objectTransformNode(rec);if(wearNode.parent!==targetNode)targetNode.add(wearNode);const scale=adaptationScale(rec,model),q=model.skeletonProfile.basis.clone().multiply(rec.skeletonProfile.basis.clone().invert());wearNode.scale.copy(scale);wearNode.quaternion.copy(q);
  const srcAnchorRest=profileEntry(rec.skeletonProfile,rec.skeletonProfile.anchorSemantic)?.wrapperPos||rec.skeletonProfile.allBounds?.getCenter(new THREE.Vector3())||new THREE.Vector3();const tgtAnchorRest=profileEntry(model.skeletonProfile,model.skeletonProfile.anchorSemantic)?.wrapperPos||model.skeletonProfile.bodyBounds?.getCenter(new THREE.Vector3())||new THREE.Vector3();const srcAnchor=currentProfilePoint(rec,srcAnchorRest),tgtAnchor=currentProfilePoint(model,tgtAnchorRest);const transformed=srcAnchor.clone().multiply(scale).applyQuaternion(q);wearNode.position.copy(tgtAnchor).sub(transformed);wearNode.updateMatrixWorld(true);
  rec.wearable.fitScale=scale.toArray();rec.wearable.alignQuat=q.toArray();rec.wearable.lastFitKey=key;rec.wearable.boneMap=buildWearableBoneMap(rec,model);const rb=rec.baseScale||new THREE.Vector3(1,1,1),mb=model.baseScale||new THREE.Vector3(1,1,1),ru=Math.max(1e-6,Number(rec.userScale)||1),mu=Math.max(1e-6,Number(model.userScale)||1);rec.wearable.translationComp=[Math.abs(mb.x*mu/Math.max(1e-6,rb.x*ru*scale.x)),Math.abs(mb.y*mu/Math.max(1e-6,rb.y*ru*scale.y)),Math.abs(mb.z*mu/Math.max(1e-6,rb.z*ru*scale.z))];}
const wearableScratchQuat=new THREE.Quaternion(),wearableScratchVec=new THREE.Vector3();
function applyWearablePose(rec,model){const map=rec.wearable?.boneMap;if(!map?.pairs?.length)return;const comp=rec.wearable.translationComp||[1,1,1];for(const p of map.pairs){const tb=p.targetBone,sb=p.sourceBone;if(!tb||!sb)continue;wearableScratchQuat.copy(p.tgtRest.restQuat).invert().multiply(tb.quaternion);sb.quaternion.copy(p.srcRest.restQuat).multiply(wearableScratchQuat);sb.scale.copy(p.srcRest.restScale);if(wearableTranslationSemantics.has(p.semantic)){wearableScratchVec.copy(tb.position).sub(p.tgtRest.restPos);wearableScratchVec.set(wearableScratchVec.x*comp[0],wearableScratchVec.y*comp[1],wearableScratchVec.z*comp[2]);sb.position.copy(p.srcRest.restPos).add(wearableScratchVec);}else sb.position.copy(p.srcRest.restPos);sb.updateMatrix();}}
function syncWearableBones(rec){if(!rec?.wearable?.targetModelId||rec.visibleWanted===false||objectTransformNode(rec)?.visible===false)return;const model=objectById(rec.wearable.targetModelId);if(!model||model.category!=='model')return;const riggedAccessory=rec.category==='accessory'&&(rec.boneMap?.size||0)>=3;if(rec.category==='accessory'&&!riggedAccessory){const targetRoot=boneOrRootTarget(model,rec.wearable.boneName);if(targetRoot&&objectTransformNode(rec).parent!==targetRoot)targetRoot.attach(objectTransformNode(rec));return;}fitWearableToModel(rec,model,false);applyWearablePose(rec,model);}
function boneOrRootTarget(model,boneName){return boneName&&boneName!=='__root__'?model.boneMap?.get(boneName):model.transformNode||model.root;}
function prepareSplitRole(rec){rec.skeletonProfile=captureSkeletonProfile(rec);rec.sourceBodyBounds=rec.skeletonProfile.bodyBounds;rec.sourceHeight=rec.skeletonProfile.metrics.height;if(rec.rolePackageTrusted&&['costume','hair','accessory'].includes(rec.category)){let meshes=0;rec.root.traverse(o=>{if(!o.isMesh)return;meshes++;o.visible=true;for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m)m.visible=true;});rec.splitStats={body:0,costume:rec.category==='costume'?meshes:0,hair:rec.category==='hair'?meshes:0,accessory:rec.category==='accessory'?meshes:0};}else rec.splitStats=filterMeshesForCategory(rec.root,rec.category);}
function activeBundleField(kind){return kind==='costume'?'activeCostumeBundleId':kind==='hair'?'activeHairBundleId':'activeAccessoryBundleId';}
function suppressField(kind){return kind==='costume'?'suppressInternalCostume':kind==='hair'?'suppressInternalHair':'suppressInternalAccessory';}
function bundleOf(rec){return rec?.bundleId||rec?.id||null;}
function restoreInternalPartsAfterDetach(model,kind){if(!model)return;model[activeBundleField(kind)]=null;model[suppressField(kind)]=false;applyModelPartStates(model);if(selectedObject()?.id===model.id)renderModelPartsUI(model);}
function detachWearable(rec){if(!rec)return;const model=objectById(rec.wearable?.targetModelId||rec.attachment?.modelId),kind=rec.category,bundle=bundleOf(rec);scene.attach(objectTransformNode(rec));rec.attachment=null;rec.wearable=null;if(model&&['costume','hair','accessory'].includes(kind)){const field=activeBundleField(kind);if(model[field]===bundle){const others=state.objects.some(o=>o!==rec&&o.category===kind&&bundleOf(o)===bundle&&(o.wearable?.targetModelId===model.id||o.attachment?.modelId===model.id)&&o.visibleWanted!==false);if(!others)restoreInternalPartsAfterDetach(model,kind);}}updateSceneTree();}
function hideOtherWearableSets(model,kind,except){const keepBundle=bundleOf(except);for(const other of state.objects){if(other===except||other.category!==kind)continue;if((other.wearable?.targetModelId===model.id||other.attachment?.modelId===model.id)&&bundleOf(other)!==keepBundle){other.visibleWanted=false;objectTransformNode(other).visible=false;}}}
function attachWearable(rec,modelId,boneName){if(!rec||!['costume','hair','accessory'].includes(rec.category))return;const model=objectById(modelId);if(!model||model.category!=='model'){detachWearable(rec);return;}const bundle=bundleOf(rec);rec.folderId=null;rec.attachment={modelId:model.id,boneName:boneName||'__root__'};rec.wearable={...(rec.wearable||{}),targetModelId:model.id,boneName:boneName||'__root__'};hideOtherWearableSets(model,rec.category,rec);rec.visibleWanted=true;objectTransformNode(rec).visible=true;model[activeBundleField(rec.category)]=bundle;model[suppressField(rec.category)]=true;applyModelPartStates(model);
  if(rec.category==='accessory'){
    const rigged=(rec.boneMap?.size||0)>=3;if(rigged){fitWearableToModel(rec,model,true);applyWearablePose(rec,model);const bm=rec.wearable.boneMap,coverage=Math.round((bm?.coverage||0)*100);showToast(`配件套装已切换并骨架自适应到 ${model.name} · 匹配 ${bm?.pairs?.length||0}/${bm?.sourceBones||0} (${coverage}%)`,4200);}else{const target=boneOrRootTarget(model,boneName);if(!target)return showToast('指定骨骼不存在。');target.attach(objectTransformNode(rec));}
  }else{
    fitWearableToModel(rec,model,true);applyWearablePose(rec,model);const bm=rec.wearable.boneMap,coverage=Math.round((bm?.coverage||0)*100),scale=rec.wearable.fitScale||[1,1,1],label=rec.category==='hair'?'头发套装':'服装套装';showToast(`${label}已整体切换并自适应到 ${model.name} · 骨骼匹配 ${bm?.pairs?.length||0}/${bm?.sourceBones||0} (${coverage}%) · XYZ ${scale.map(v=>Number(v).toFixed(2)).join('/')}`,4600);
  }
  if(selectedObject()?.id===model.id)renderModelPartsUI(model);updateSceneTree();
}
function syncAllWearables(){for(const rec of state.objects)if(rec?.wearable?.targetModelId&&rec.visibleWanted!==false&&objectTransformNode(rec)?.visible!==false)syncWearableBones(rec);}


async function importObjectFiles(fileList,category='model',sourceUris=[],restoreSpec=null){
  const files=Array.from(fileList||[]);if(!files.length)return[];const importBundleId=['costume','hair','accessory'].includes(category)?(restoreSpec?.bundleId||`${category}-bundle-${Date.now()}-${Math.random().toString(16).slice(2)}`):null;const pendingTarget=state.pendingWearableTargetId?objectById(state.pendingWearableTargetId):null;const autoWearTarget=['costume','hair','accessory'].includes(category)?((pendingTarget?.category==='model'?pendingTarget:null)||preferredSelectedModel(false)||((state.motionTargetId&&objectById(state.motionTargetId)?.category==='model')?objectById(state.motionTargetId):(state.objects.filter(o=>o.category==='model').length===1?state.objects.find(o=>o.category==='model'):null))):null;const supported=['pmx','pmd','fbx','glb','gltf','obj'];let modelFiles=files.filter(f=>supported.includes(ext(f.name)));
  const primaryModels=modelFiles.filter(f=>f.__primaryModel===true);if(primaryModels.length)modelFiles=primaryModels;
  if(restoreSpec?.sourceFileName)modelFiles=modelFiles.filter(f=>f.name.toLowerCase()===String(restoreSpec.sourceFileName).toLowerCase()||String(f.__relativePath||'').toLowerCase()===String(restoreSpec.sourceFileName).toLowerCase());
  if(!modelFiles.length){showToast('请选择 PMX / PMD / FBX / GLB / GLTF / OBJ，并尽量同时多选纹理文件。');return[];}
  const created=[];
  for(const modelFile of modelFiles){setLoading(true,`载入 ${modelFile.name}...`);const pack=makeManager(files,`${category}-${state.nextObjectId}`);try{
    const type=ext(modelFile.name),root=await loadObjectRoot(type,modelFile,pack);root.name=modelFile.name;
    const smoothPreset=restoreSpec?.smoothing?.preset||'standard',smoothCfg=smoothPresets[smoothPreset]||{angle:Number(restoreSpec?.smoothing?.angle)||105,strength:Number(restoreSpec?.smoothing?.strength)||.78};const smoothCount=(category==='model'&&(type==='pmx'||type==='pmd'))?autoSmoothCharacter(root,smoothPreset,smoothCfg.angle,smoothCfg.strength):0;
    if(type==='pmx'||type==='pmd')convertMmdMaterialsForAndroid(root);
    const compatConverted=(type==='pmx'||type==='pmd')?countCompatMaterials(root):0;
    const visibility=repairRenderable(root,category!=='model'||!!ui.characterSelfShadow?.checked);const boneMap=findBoneMap(root),materials=collectMaterials(root),iks=collectIks(root),rigidBodies=collectRigidBodies(root);
    const mmdMesh=firstMmdMesh(root),bones=mmdMesh?.skeleton?.bones||Array.from(boneMap.values());
    const transformNode=new THREE.Group();transformNode.name=`Transform:${modelFile.name}`;transformNode.matrixAutoUpdate=true;transformNode.matrixWorldAutoUpdate=true;root.matrixAutoUpdate=true;root.matrixWorldAutoUpdate=true;transformNode.add(root);
    const rec={id:String(state.nextObjectId++),name:modelFile.name.replace(/\.[^.]+$/,''),sourceFileName:modelFile.__sourceType==='archive'?(modelFile.__relativePath||modelFile.name):modelFile.name,type,category,root,transformNode,pack,sourceUris:[...sourceUris],motionUris:[],motionNames:[],motionPack:null,mmdClip:null,userScale:1,baseScale:root.scale.clone(),morphs:collectMorphs(root),duration:0,visibleWanted:true,externalMixer:null,boneMap,bones,boneOverrides:{},eyeRotation:{pitch:0,left:0,right:0},eyeBones:null,iks,rigidBodies,materials,materialOriginal:materials.map(materialState),attachment:null,wearable:null,rolePackageTrusted:modelFile.__sourceType==='library-bundle',modelParts:[],partVisibility:{},suppressInternalCostume:false,suppressInternalHair:false,suppressInternalAccessory:false,activeCostumeBundleId:null,activeHairBundleId:null,activeAccessoryBundleId:null,bundleId:restoreSpec?.bundleId||importBundleId,expressionPresets:[],expressionMorphNames:new Set(),expressionPresetKey:'neutral',expressionPresetStrength:1,sourceBodyBounds:null,sourceHeight:0,splitStats:null,folderId:null,physics:{enabled:false,profile:'all',gravity:-98,steps:3},_overridesApplied:false,meshCount:visibility.meshCount,mmdCompatConverted:compatConverted,missingResources:[],textureLoadErrors:[],smoothCount,smoothing:{preset:smoothPreset,angle:smoothCfg.angle,strength:smoothCfg.strength}};
    rec.eyeBones=findEyeBones(rec);initIkMetadata(rec);installMmdMorphRuntime(rec);prepareHairGeometry(root);prepareSplitRole(rec);if(category==='model'){buildModelParts(rec);buildExpressionPresets(rec);}
    if(['fbx','glb','gltf'].includes(type)&&Array.isArray(root.animations)&&root.animations.length){rec.externalMixer=new THREE.AnimationMixer(root);const action=rec.externalMixer.clipAction(root.animations[0]);action.setLoop(ui.loop.checked?THREE.LoopRepeat:THREE.LoopOnce,Infinity);action.clampWhenFinished=!ui.loop.checked;action.play();rec.duration=root.animations[0].duration||0;}
    if(restoreSpec)applyObjectSpec(rec,restoreSpec);
    addRecord(rec,!restoreSpec);created.push(rec);if(['costume','hair','accessory'].includes(category)&&autoWearTarget&&!restoreSpec)attachWearable(rec,autoWearTarget.id,'__root__');
    pack.onIdle(()=>{
      rec.missingResources=Array.from(pack.missing||[]);rec.textureLoadErrors=Array.from(pack.loadErrors||[]);refreshCompatMaterialTextures(root);repairRenderable(root,modelReceivesSelfShadow(rec));for(const m of rec.materials||[])captureMmdMorphBase(m);applyMmdExtraMorphs(rec);
      if(selectedObject()?.id===rec.id)syncInspector();
      const miss=rec.missingResources.length?` · 缺少 ${rec.missingResources.length} 个纹理资源（已使用安全材质回退）`:'';const decode=rec.textureLoadErrors.length?` · ${rec.textureLoadErrors.length} 个贴图解码失败`:'';
      setStatus(`${modelFile.name} 已载入 · Mesh ${visibility.meshCount} · Material ${visibility.materialCount}${smoothCount?` · 自动光滑 ${smoothCount}`:''}${miss}${decode}`);
    });
    setStatus(`${modelFile.name} 已载入 · Mesh ${visibility.meshCount} · Material ${visibility.materialCount}${compatConverted?` · Android兼容材质 ${compatConverted}`:''}`);
  }catch(err){console.error(err);pack.dispose();showToast(`载入失败：${modelFile.name}\n${err?.message||err}`,5500);setStatus('对象载入失败');}}
  setLoading(false);for(const id of ['modelInput','costumeInput','hairInput','stageInput','accessoryInput'])if(ui[id])ui[id].value='';if(autoWearTarget&&['costume','hair','accessory'].includes(category)){state.pendingWearableTargetId=null;state.pendingWearableKind=null;selectNode('model',autoWearTarget.id);renderModelPartsUI(autoWearTarget);}return created;
}
function applyObjectSpec(rec,spec){
  if(spec.id){rec.id=String(spec.id);const n=Number(spec.id);if(Number.isFinite(n))state.nextObjectId=Math.max(state.nextObjectId,n+1);}
  rec.name=spec.name||rec.name;rec.bundleId=spec.bundleId||rec.bundleId;rec.userScale=Number(spec.userScale)||1;rec.root.scale.copy(rec.baseScale).multiplyScalar(rec.userScale);rec.visibleWanted=spec.visibleWanted!==false;rec.folderId=spec.folderId||null;rec.boneOverrides=spec.boneOverrides||{};rec.wearable=spec.wearable||null;rec.partVisibility={...(rec.partVisibility||{}),...(spec.partVisibility||{})};rec.expressionPresetKey=spec.expressionPresetKey||rec.expressionPresetKey||'neutral';rec.expressionPresetStrength=Number.isFinite(Number(spec.expressionPresetStrength))?Number(spec.expressionPresetStrength):(rec.expressionPresetStrength??1);rec.eyeRotation={...rec.eyeRotation,...(spec.eyeRotation||{})};if(spec.smoothing)applySmoothToRecord(rec,spec.smoothing.preset||'custom',Number(spec.smoothing.angle)||105,(Number.isFinite(Number(spec.smoothing.strength))?Number(spec.smoothing.strength):.78),false);if(spec.eyeBones)rec.eyeBones={...rec.eyeBones,...spec.eyeBones};rec.physics={...rec.physics,...(spec.physics||{})};
  const tn=objectTransformNode(rec);if(spec.position)tn.position.fromArray(spec.position);if(spec.rotation)tn.rotation.set(spec.rotation[0]||0,spec.rotation[1]||0,spec.rotation[2]||0,spec.rotation[3]||'XYZ');
  for(const [name,w] of Object.entries(spec.morphs||{}))setMorph(rec.root,name,Number(w)||0);
  if(Array.isArray(spec.iks))spec.iks.forEach((saved,i)=>{const ik=rec.iks[i];if(!ik)return;ik._mmdroidEnabled=saved.enabled!==false;if(Number.isFinite(saved.iteration))ik.iteration=saved.iteration;if(Number.isFinite(saved.minAngle))ik.minAngle=saved.minAngle;else delete ik.minAngle;if(Number.isFinite(saved.maxAngle))ik.maxAngle=saved.maxAngle;else delete ik.maxAngle;(saved.links||[]).forEach((enabled,j)=>{if(ik.links?.[j])ik.links[j]._mmdroidUserEnabled=enabled!==false;});applyIkFlags(ik);});
  if(Array.isArray(spec.materials))spec.materials.forEach((s,i)=>applyMaterialState(rec.materials[i],s));if(rec.category==='model'){buildModelParts(rec);buildExpressionPresets(rec);rec.expressionPresetKey=spec.expressionPresetKey||rec.expressionPresetKey||'neutral';rec.expressionPresetStrength=Number.isFinite(Number(spec.expressionPresetStrength))?Number(spec.expressionPresetStrength):(rec.expressionPresetStrength??1);}for(const m of rec.materials||[])captureMmdMorphBase(m);applyMmdExtraMorphs(rec);applyBoneOverrides(rec);
}

async function importMotionFiles(fileList,targetRec=null,sourceUris=[]){
  const rec=resolveMotionTarget(targetRec,{quiet:false,requireMmd:true});if(!rec)return;
  const files=Array.from(fileList||[]).filter(f=>ext(f.name)==='vmd');if(!files.length)return;setLoading(true,`绑定 ${files.length} 个 VMD...`);const pack=makeManager(files,`motion-${rec.id}-${Date.now()}`);
  try{removeBoneOverrides(rec);const loader=new MMDLoader(pack.manager),urls=files.map(f=>pack.virtual(f));const clip=await new Promise((res,rej)=>loader.loadAnimation(urls,rec.root,res,undefined,rej));rec.mmdClip=clip;rec.duration=clip.duration||0;rec.motionPack?.dispose?.();rec.motionPack=pack;rec.motionNames=files.map(f=>f.name);rec.motionUris=[...sourceUris];await rebuildMmdHelper(rec,false);state.time=0;seekAll(0);recomputeDuration();updateSceneTree();syncMotionTargetUI();selectNode('motion',rec.id);showToast(`VMD 已绑定到 ${rec.name}`);}catch(err){console.error(err);pack.dispose();showToast(`动作载入失败：${err?.message||err}`,5000);}finally{applyBoneOverrides(rec);setLoading(false);ui.motionInput.value='';}
}
function removeMotion(rec=null){const target=resolveMotionTarget(rec,{quiet:false,requireMmd:false});if(!target)return;removeBoneOverrides(target);if(helper.objects.get(target.root))helper.remove(target.root);target.motionPack?.dispose?.();target.motionPack=null;target.mmdClip=null;target.motionNames=[];target.motionUris=[];target.duration=0;target.physics.enabled=false;applyBoneOverrides(target);helper.enable('physics',state.objects.some(o=>o.physics?.enabled));recomputeDuration();updateSceneTree();syncMotionTargetUI();selectNode(target.category,target.id);}
async function importCameraFiles(fileList,sourceUris=[]){const files=Array.from(fileList||[]).filter(f=>ext(f.name)==='vmd');if(!files.length)return;setLoading(true,'载入 VMD 镜头...');const pack=makeManager(files,`camera-${Date.now()}`);try{const loader=new MMDLoader(pack.manager),urls=files.map(f=>pack.virtual(f));const clip=await new Promise((res,rej)=>loader.loadAnimation(urls,camera,res,undefined,rej));if(helper.objects.get(camera))helper.remove(camera);helper.add(camera,{animation:clip});state.cameraMixer=helper.objects.get(camera)?.mixer||null;state.cameraClip=clip;state.cameraDuration=clip.duration||0;state.cameraAnimation=true;state.cameraUris=[...sourceUris];ui.cameraEnabled.checked=true;controls.enabled=false;state.cameraPack?.dispose?.();state.cameraPack=pack;recomputeDuration();updateSceneTree();selectNode('camera');showToast('VMD 镜头已载入');}catch(err){console.error(err);pack.dispose();showToast(`镜头载入失败：${err?.message||err}`,5000);}finally{setLoading(false);ui.cameraInput.value='';}}
function importAudioFile(file,sourceUri=null){if(!file)return;if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);state.audioUrl=URL.createObjectURL(file);state.audioUri=sourceUri;state.audioName=file.name;audio.src=state.audioUrl;audio.loop=ui.loop.checked;audio.volume=num(ui.volume,.8);audio.onloadedmetadata=()=>{recomputeDuration();updateSceneTree();ui.audioInfo.textContent=file.name;showToast(`音乐已载入：${file.name}`);};audio.onerror=()=>showToast('音乐文件无法解码，建议 MP3 / WAV / OGG / AAC。');ui.audioInput.value='';}
async function importHdriFile(file,sourceUri=null){if(!file)return;setLoading(true,'载入 HDRI...');const url=URL.createObjectURL(file);try{const tex=await new Promise((res,rej)=>new RGBELoader().load(url,res,undefined,rej));tex.mapping=THREE.EquirectangularReflectionMapping;state.hdriSource?.dispose?.();state.hdriEnv?.dispose?.();state.hdriSource=tex;const pmrem=new THREE.PMREMGenerator(renderer);pmrem.compileEquirectangularShader();state.hdriEnv=pmrem.fromEquirectangular(tex).texture;pmrem.dispose();scene.environment=state.hdriEnv;state.hdriUri=sourceUri;state.hdriName=file.name;ui.hdriInfo.textContent=file.name;syncEnvironmentFromUI();updateSceneTree();showToast(`HDRI 已载入：${file.name}`);}catch(err){console.error(err);showToast(`HDRI 载入失败：${err?.message||err}`,5000);}finally{URL.revokeObjectURL(url);setLoading(false);ui.hdriInput.value='';}}


function ensureAmmo(){
  if(state.ammoReady)return Promise.resolve(true);if(state.ammoLoading)return state.ammoLoading;
  state.ammoLoading=new Promise((resolve,reject)=>{const finish=async()=>{try{if(typeof window.Ammo==='function')window.Ammo=await window.Ammo();if(!window.Ammo)throw new Error('Ammo 初始化失败');state.ammoReady=true;resolve(true);}catch(e){reject(e);}};if(window.Ammo){finish();return;}const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/ammo.js@0.0.10/ammo.js';s.onload=finish;s.onerror=()=>reject(new Error('无法加载 Ammo.js，请确认设备联网'));document.head.appendChild(s);}).finally(()=>{state.ammoLoading=null;});return state.ammoLoading;
}
function preparePhysicsProfile(rec){const bodies=rec.rigidBodies||[],bones=rec.bones||Array.from(rec.boneMap.values());for(const rb of bodies){if(rb._mmdroidOriginalType===undefined)rb._mmdroidOriginalType=rb.type;}if(rec.physics.profile!=='skirtHair'){for(const rb of bodies)rb.type=rb._mmdroidOriginalType;return;}const re=/スカート|skirt|髪|hair|前髪|後髪|横髪|胸|bust|リボン|ribbon|袖|sleeve/i;for(const rb of bodies){const name=String(rb.name||bones[rb.boneIndex]?.name||'');rb.type=re.test(name)?rb._mmdroidOriginalType:0;}}
function restorePhysicsMetadata(rec){for(const rb of rec.rigidBodies||[])if(rb._mmdroidOriginalType!==undefined)rb.type=rb._mmdroidOriginalType;}
async function rebuildMmdHelper(rec,fromPhysicsButton=true){
  if(!rec||!['pmx','pmd'].includes(rec.type))return;if(rec.physics.enabled&&!rec.rigidBodies.length){rec.physics.enabled=false;showToast('该模型没有 MMD 刚体数据。');}
  if(rec.physics.enabled){try{ui.physicsStatus.textContent='正在加载/初始化 Ammo.js...';await ensureAmmo();}catch(err){rec.physics.enabled=false;ui.physicsEnabled.checked=false;ui.physicsStatus.textContent=err.message;showToast(err.message,5000);}}
  removeBoneOverrides(rec);if(helper.objects.get(rec.root))helper.remove(rec.root);
  try{const params={};if(rec.mmdClip)params.animation=rec.mmdClip;if(rec.physics.enabled){preparePhysicsProfile(rec);params.physics=true;params.unitStep=1/60;params.maxStepNum=Math.max(1,Math.round(rec.physics.steps||3));params.gravity=new THREE.Vector3(0,rec.physics.gravity??-98,0);}if(params.animation||params.physics)helper.add(rec.root,params);if(rec.mmdClip){const h=helper.objects.get(rec.root);h?.mixer?.setTime(state.time);}helper.enable('ik',ui.ikGlobal.checked);helper.enable('physics',state.objects.some(o=>o.physics?.enabled));if(rec.physics.enabled)ui.physicsStatus.textContent=`物理运行中 · ${rec.physics.profile==='skirtHair'?'裙摆/头发优先':'全部刚体'} · Gravity ${rec.physics.gravity}`;else ui.physicsStatus.textContent='物理未启用。';}
  catch(err){console.error(err);rec.physics.enabled=false;ui.physicsEnabled.checked=false;ui.physicsStatus.textContent=`物理创建失败：${err.message}`;if(fromPhysicsButton)showToast(`物理创建失败：${err.message}`,5000);}finally{restorePhysicsMetadata(rec);applyBoneOverrides(rec);}
}

function formatTime(sec){if(!Number.isFinite(sec))sec=0;const m=Math.floor(sec/60),s=Math.floor(sec%60),cs=Math.floor((sec-Math.floor(sec))*100);return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;}
function recomputeDuration(){let d=Math.max(10,state.manualDuration||10);for(const rec of state.objects)d=Math.max(d,rec.duration||0);if(state.cameraDuration)d=Math.max(d,state.cameraDuration);if(Number.isFinite(audio.duration))d=Math.max(d,audio.duration||0);for(const tr of Object.values(state.editorKeys)){for(const k of tr.keys||[])d=Math.max(d,k.time||0);}state.duration=d;updateTimeUI();drawTimeline();}
function updateTimeUI(){state.time=clamp(state.time,0,Math.max(state.duration,0));ui.timeLabel.textContent=`${formatTime(state.time)} / ${formatTime(state.duration)}`;}

function currentKeyDescriptor(){
  const s=state.selection,rec=selectedObject(),channel=ui.keyChannel.value;
  if(rec&&channel==='morph'&&rec.category==='model'){const name=ui.morphSelect.value;if(!name)return null;return{key:`morph:${rec.id}:${name}`,kind:'morph',objectId:rec.id,name,label:`${rec.name} · Morph · ${name}`};}
  if(rec&&channel==='eye'&&rec.category==='model')return{key:`eye:${rec.id}`,kind:'eye',objectId:rec.id,label:`${rec.name} · Eye Pitch`};
  if(rec&&channel==='transform'&&['model','costume','hair','stage','accessory'].includes(rec.category))return{key:`object:${rec.id}`,kind:'object',objectId:rec.id,label:`${rec.name} · Transform`};
  if(['model','costume','hair','stage','accessory'].includes(s.type)&&rec)return{key:`object:${rec.id}`,kind:'object',objectId:rec.id,label:`${rec.name} · Transform`};
  if(s.type==='bone'&&rec)return{key:`bone:${rec.id}:${s.sub}`,kind:'bone',objectId:rec.id,name:String(s.sub),label:`${rec.name} · Bone · ${s.sub}`};
  if(s.type==='material'&&rec)return{key:`material:${rec.id}:${s.sub}`,kind:'material',objectId:rec.id,index:Number(s.sub),label:`${rec.name} · ${materialLabel(rec.materials[Number(s.sub)],Number(s.sub))}`};
  if(s.type==='camera')return{key:'camera',kind:'camera',label:'Camera'};
  if(s.type==='lighting')return{key:'lighting',kind:'lighting',label:'Lighting'};
  if(s.type==='folder'){const f=selectedFolder();if(f)return{key:`folder:${f.id}`,kind:'folder',folderId:f.id,label:`Folder · ${f.name}`};}
  return null;
}
function captureDescriptor(d){
  if(!d)return null;const rec=objectById(d.objectId);
  if(d.kind==='object'&&rec){const tn=objectTransformNode(rec);return{pos:tn.position.toArray(),quat:tn.quaternion.toArray(),scale:tn.scale.toArray()};}
  if(d.kind==='bone'&&rec){const o=getBoneOverride(rec,d.name,false)||{pos:[0,0,0],rot:[0,0,0]};return{pos:[...o.pos],rot:[...o.rot]};}
  if(d.kind==='morph'&&rec)return{value:getMorph(rec.root,d.name)};
  if(d.kind==='eye'&&rec)return{...rec.eyeRotation};
  if(d.kind==='material'&&rec){const m=rec.materials[d.index];return{color:m.color?.toArray?.()||null,emissive:m.emissive?.toArray?.()||null,opacity:getMaterialOpacity(m,1)};}
  if(d.kind==='camera')return{pos:camera.position.toArray(),quat:camera.quaternion.toArray(),target:controls.target.toArray(),fov:camera.fov};
  if(d.kind==='lighting')return{key:keyLight.intensity,fill:fillLight.intensity,rim:rimLight.intensity,ambient:ambientLight.intensity,exposure:renderer.toneMappingExposure,keyPos:keyLight.position.toArray(),fillPos:fillLight.position.toArray(),rimPos:rimLight.position.toArray()};
  if(d.kind==='folder'){const f=folderById(d.folderId);if(f)return{pos:f.group.position.toArray(),quat:f.group.quaternion.toArray(),scale:f.group.scale.toArray()};}
  return null;
}
function addKeyframe(){const d=currentKeyDescriptor();if(!d)return showToast('当前选择没有可记录的关键帧通道。');const data=captureDescriptor(d);if(!data)return;const fps=Math.max(1,Number(ui.timelineFps.value)||30),time=Math.round(state.time*fps)/fps;const tr=state.editorKeys[d.key]||(state.editorKeys[d.key]={meta:d,keys:[]});const ix=tr.keys.findIndex(k=>Math.abs(k.time-time)<.0005);const key={time,data};if(ix>=0)tr.keys[ix]=key;else tr.keys.push(key);tr.keys.sort((a,b)=>a.time-b.time);state.selectedKey={track:d.key,time};recomputeDuration();updateSceneTree();showToast(`关键帧已记录 · ${d.label} · ${formatTime(time)}`);}
function deleteCurrentKey(){const sel=state.selectedKey,d=currentKeyDescriptor(),key=sel?.track||d?.key;if(!key||!state.editorKeys[key])return;const tr=state.editorKeys[key];let index=-1;if(sel&&sel.track===key)index=tr.keys.findIndex(k=>Math.abs(k.time-sel.time)<.0005);if(index<0){const fps=Number(ui.timelineFps.value)||30,index2=tr.keys.findIndex(k=>Math.abs(k.time-state.time)<=.51/fps);index=index2;}if(index>=0){tr.keys.splice(index,1);if(!tr.keys.length)delete state.editorKeys[key];state.selectedKey=null;recomputeDuration();updateSceneTree();}}
function allKeyTimes(){const times=[];for(const tr of Object.values(state.editorKeys))for(const k of tr.keys||[])times.push(k.time);for(const rec of state.objects){if(rec.mmdClip)for(const t of rec.mmdClip.tracks)times.push(...t.times);}if(state.cameraClip)for(const t of state.cameraClip.tracks)times.push(...t.times);return Array.from(new Set(times.map(v=>Number(v).toFixed(5)))).map(Number).sort((a,b)=>a-b);}
function jumpKey(dir){const arr=allKeyTimes();if(!arr.length)return;let t;if(dir<0){t=[...arr].reverse().find(x=>x<state.time-.0001);if(t===undefined)t=arr[0];}else{t=arr.find(x=>x>state.time+.0001);if(t===undefined)t=arr[arr.length-1];}seekAll(t);}
function interpolateArray(a,b,t){return a.map((v,i)=>lerp(Number(v)||0,Number(b?.[i])||0,t));}
function sampleEditorTrack(tr,time){const keys=tr.keys;if(!keys?.length)return null;if(time<=keys[0].time)return{a:keys[0],b:keys[0],t:0};if(time>=keys[keys.length-1].time)return{a:keys[keys.length-1],b:keys[keys.length-1],t:0};for(let i=0;i<keys.length-1;i++){const a=keys[i],b=keys[i+1];if(time>=a.time&&time<=b.time)return{a,b,t:(time-a.time)/Math.max(.000001,b.time-a.time)};}return null;}
function applyEditorTrack(tr,time){const s=sampleEditorTrack(tr,time);if(!s)return;const d=tr.meta,a=s.a.data,b=s.b.data,t=s.t,rec=objectById(d.objectId);
  if(d.kind==='object'&&rec){const tn=objectTransformNode(rec);tn.position.fromArray(interpolateArray(a.pos,b.pos,t));const qa=new THREE.Quaternion().fromArray(a.quat),qb=new THREE.Quaternion().fromArray(b.quat);qa.slerp(qb,t);tn.quaternion.copy(qa);tn.scale.fromArray(interpolateArray(a.scale,b.scale,t));}
  else if(d.kind==='bone'&&rec){const o=getBoneOverride(rec,d.name,true);o.pos=interpolateArray(a.pos,b.pos,t);o.rot=interpolateArray(a.rot,b.rot,t);}
  else if(d.kind==='morph'&&rec)setMorph(rec.root,d.name,lerp(a.value,b.value,t));
  else if(d.kind==='eye'&&rec){rec.eyeRotation={pitch:lerp(a.pitch,b.pitch,t),left:lerp(a.left,b.left,t),right:lerp(a.right,b.right,t)};}
  else if(d.kind==='material'&&rec){const m=rec.materials[d.index];if(m){if(a.color&&b.color&&m.color)m.color.fromArray(interpolateArray(a.color,b.color,t));if(a.emissive&&b.emissive&&m.emissive)m.emissive.fromArray(interpolateArray(a.emissive,b.emissive,t));setMaterialOpacity(m,lerp(a.opacity,b.opacity,t));m.needsUpdate=true;}}
  else if(d.kind==='camera'){camera.position.fromArray(interpolateArray(a.pos,b.pos,t));const q=new THREE.Quaternion().fromArray(a.quat),qb=new THREE.Quaternion().fromArray(b.quat);q.slerp(qb,t);camera.quaternion.copy(q);controls.target.fromArray(interpolateArray(a.target,b.target,t));camera.fov=lerp(a.fov,b.fov,t);camera.updateProjectionMatrix();}
  else if(d.kind==='lighting'){keyLight.intensity=lerp(a.key,b.key,t);fillLight.intensity=lerp(a.fill,b.fill,t);rimLight.intensity=lerp(a.rim,b.rim,t);ambientLight.intensity=lerp(a.ambient,b.ambient,t);renderer.toneMappingExposure=lerp(a.exposure,b.exposure,t);keyLight.position.fromArray(interpolateArray(a.keyPos,b.keyPos,t));fillLight.position.fromArray(interpolateArray(a.fillPos,b.fillPos,t));rimLight.position.fromArray(interpolateArray(a.rimPos,b.rimPos,t));}
  else if(d.kind==='folder'){const f=folderById(d.folderId);if(f){f.group.position.fromArray(interpolateArray(a.pos,b.pos,t));const q=new THREE.Quaternion().fromArray(a.quat),qb=new THREE.Quaternion().fromArray(b.quat);q.slerp(qb,t);f.group.quaternion.copy(q);f.group.scale.fromArray(interpolateArray(a.scale,b.scale,t));}}
}
function applyEditorKeys(time){for(const tr of Object.values(state.editorKeys))applyEditorTrack(tr,time);}

let timelineTracks=[];
function importedTracksFor(rec){if(!rec?.mmdClip)return[];const groups=new Map();for(const track of rec.mmdClip.tracks){let name=track.name.replace(/\.(position|quaternion|scale|morphTargetInfluences.*)$/,'');name=name.replace(/^\./,'');if(!groups.has(name))groups.set(name,[]);groups.get(name).push(...Array.from(track.times));}const out=[];for(const [name,times] of groups){const unique=Array.from(new Set(times.map(x=>Number(x).toFixed(4)))).map(Number);const step=Math.max(1,Math.ceil(unique.length/400));out.push({kind:'imported',key:`vmd:${rec.id}:${name}`,label:`VMD · ${name}`,times:unique.filter((_,i)=>i%step===0),rec,name});}return out.slice(0,80);}
function getTimelineTracks(){const out=[];for(const [key,tr] of Object.entries(state.editorKeys))out.push({kind:'editor',key,label:tr.meta?.label||key,times:(tr.keys||[]).map(k=>k.time),track:tr});const rec=activeObject();if(rec?.mmdClip)out.push(...importedTracksFor(rec));if(state.cameraClip){const times=Array.from(new Set(state.cameraClip.tracks.flatMap(t=>Array.from(t.times)).map(x=>Number(x).toFixed(4)))).map(Number);out.push({kind:'imported',key:'vmd:camera',label:'VMD · Camera',times});}return out;}
function drawTimeline(){
  if(!ui.timelineCanvas)return;timelineTracks=getTimelineTracks();ui.timelineTrackLabels.innerHTML='';for(const tr of timelineTracks){const d=document.createElement('div');d.className='track-label'+(state.selectedKey?.track===tr.key?' active':'');d.textContent=tr.label;d.title=tr.label;d.addEventListener('click',()=>{if(tr.kind==='editor'){const meta=tr.track.meta;if(meta.objectId){const r=objectById(meta.objectId);selectNode(meta.kind==='bone'?'bone':r?.category||'model',meta.objectId,meta.name||null);}}});ui.timelineTrackLabels.append(d);}
  const zoom=num(ui.timelineZoom,60),rowH=24,ruler=23,cssW=Math.max(ui.timelineCanvas.parentElement.clientWidth,state.duration*zoom+50),cssH=Math.max(ui.timelineCanvas.parentElement.clientHeight,ruler+Math.max(1,timelineTracks.length)*rowH),dpr=Math.min(devicePixelRatio||1,2);ui.timelineCanvas.style.width=`${cssW}px`;ui.timelineCanvas.style.height=`${cssH}px`;ui.timelineCanvas.width=Math.floor(cssW*dpr);ui.timelineCanvas.height=Math.floor(cssH*dpr);const c=ui.timelineCanvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,cssW,cssH);c.fillStyle='rgba(6,8,12,.62)';c.fillRect(0,0,cssW,cssH);
  c.font='8px sans-serif';c.textBaseline='middle';const major=zoom<35?5:zoom<60?2:1;for(let s=0;s<=state.duration;s+=major){const x=s*zoom;c.strokeStyle='rgba(255,255,255,.11)';c.beginPath();c.moveTo(x,0);c.lineTo(x,cssH);c.stroke();c.fillStyle='rgba(190,205,226,.7)';c.fillText(`${s.toFixed(0)}s`,x+3,10);}c.strokeStyle='rgba(255,255,255,.08)';c.beginPath();c.moveTo(0,ruler);c.lineTo(cssW,ruler);c.stroke();
  timelineTracks.forEach((tr,i)=>{const y=ruler+i*rowH;c.fillStyle=i%2?'rgba(255,255,255,.015)':'rgba(255,255,255,.025)';c.fillRect(0,y,cssW,rowH);c.strokeStyle='rgba(255,255,255,.04)';c.beginPath();c.moveTo(0,y+rowH);c.lineTo(cssW,y+rowH);c.stroke();for(const tm of tr.times){const x=tm*zoom,cy=y+rowH/2;if(tr.kind==='editor'){c.save();c.translate(x,cy);c.rotate(Math.PI/4);c.fillStyle=state.selectedKey?.track===tr.key&&Math.abs(state.selectedKey.time-tm)<.0005?'#ffd27a':'#78aefc';c.fillRect(-4,-4,8,8);c.restore();}else{c.fillStyle='rgba(185,156,255,.78)';c.fillRect(x-1,cy-5,2,10);}}});
  const px=state.time*zoom;c.strokeStyle='#ff8d78';c.lineWidth=1.4;c.beginPath();c.moveTo(px,0);c.lineTo(px,cssH);c.stroke();c.fillStyle='#ff8d78';c.beginPath();c.moveTo(px-5,0);c.lineTo(px+5,0);c.lineTo(px,7);c.closePath();c.fill();
}
function timelinePointer(e){const rect=ui.timelineCanvas.getBoundingClientRect(),x=(e.clientX-rect.left)*(ui.timelineCanvas.clientWidth/rect.width),y=(e.clientY-rect.top)*(ui.timelineCanvas.clientHeight/rect.height),zoom=num(ui.timelineZoom,60),time=clamp(x/zoom,0,state.duration),row=Math.floor((y-23)/24);if(row>=0&&row<timelineTracks.length){const tr=timelineTracks[row],nearest=tr.times.reduce((best,t)=>Math.abs(t-time)<Math.abs((best??1e9)-time)?t:best,null);if(nearest!==null&&Math.abs(nearest-time)*zoom<8){if(tr.kind==='editor')state.selectedKey={track:tr.key,time:nearest};seekAll(nearest);drawTimeline();return;}}state.selectedKey=null;seekAll(time);drawTimeline();}
function seekAll(t){t=clamp(Number(t)||0,0,state.duration);state.time=t;removeAllBoneOverrides();for(const rec of state.objects){const h=helper.objects.get(rec.root);if(h?.mixer)h.mixer.setTime(t);if(rec.externalMixer)rec.externalMixer.setTime(t);}if(state.cameraMixer&&ui.cameraEnabled.checked)state.cameraMixer.setTime(t);applyEditorKeys(t);applyAllMmdExtraMorphs();applyAllBoneOverrides();syncAllWearables();if(audio.src&&Number.isFinite(audio.duration)){try{audio.currentTime=Math.min(t,Math.max(0,audio.duration-.001));}catch(_){}}updateTimeUI();drawTimeline();syncInspector();}
async function setPlaying(v){state.playing=!!v;ui.btnPlay.textContent=state.playing?'❚❚':'▶';state.lastNow=performance.now();if(audio.src){try{if(state.playing){if(Math.abs(audio.currentTime-state.time)>.25)audio.currentTime=Math.min(state.time,Math.max(0,audio.duration-.001));await audio.play();}else audio.pause();}catch(err){console.warn(err);showToast('音乐播放被系统拦截，请再次点击播放。');}}}
function stopAll(){setPlaying(false);audio.pause();if(audio.src)audio.currentTime=0;seekAll(0);}

function syncLoopModes(){audio.loop=ui.loop.checked;for(const rec of state.objects){if(rec.externalMixer&&rec.root.animations?.length){for(const clip of rec.root.animations){const a=rec.externalMixer.existingAction(clip);if(a){a.setLoop(ui.loop.checked?THREE.LoopRepeat:THREE.LoopOnce,Infinity);a.clampWhenFinished=!ui.loop.checked;}}}const h=helper.objects.get(rec.root);if(h?.mixer&&rec.mmdClip){const a=h.mixer.existingAction(rec.mmdClip);if(a){a.setLoop(ui.loop.checked?THREE.LoopRepeat:THREE.LoopOnce,Infinity);a.clampWhenFinished=!ui.loop.checked;}}}}
function clearSceneMedia(){if(helper.objects.get(camera))helper.remove(camera);state.cameraMixer=null;state.cameraClip=null;state.cameraDuration=0;state.cameraAnimation=false;state.cameraUris=[];state.cameraPack?.dispose?.();state.cameraPack=null;controls.enabled=true;ui.cameraEnabled.checked=true;audio.pause();audio.removeAttribute('src');audio.load();if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);state.audioUrl=null;state.audioUri=null;state.audioName=null;state.hdriSource?.dispose?.();state.hdriEnv?.dispose?.();state.hdriSource=null;state.hdriEnv=null;state.hdriUri=null;state.hdriName=null;scene.environment=null;applyBuiltinEnvironmentPreset(ui.builtinEnvironment?.value||state.builtinEnvironment||'solid');}

function serializeObject(rec){const morphs={};for(const n of rec.morphs){const w=getMorph(rec.root,n);if(Math.abs(w)>1e-6)morphs[n]=w;}return{id:rec.id,name:rec.name,category:rec.category,bundleId:rec.bundleId||null,sourceFileName:rec.sourceFileName,type:rec.type,sourceUris:rec.sourceUris||[],motionUris:rec.motionUris||[],userScale:rec.userScale,position:objectTransformNode(rec).position.toArray(),rotation:[objectTransformNode(rec).rotation.x,objectTransformNode(rec).rotation.y,objectTransformNode(rec).rotation.z,objectTransformNode(rec).rotation.order],visibleWanted:rec.visibleWanted,folderId:rec.folderId||null,attachment:rec.attachment||null,wearable:rec.wearable||null,partVisibility:rec.partVisibility||{},expressionPresetKey:rec.expressionPresetKey||'neutral',expressionPresetStrength:rec.expressionPresetStrength??1,morphs,boneOverrides:rec.boneOverrides,eyeRotation:rec.eyeRotation,eyeBones:rec.eyeBones,smoothing:rec.smoothing,physics:rec.physics,materials:rec.materials.map(serializeMaterial),iks:rec.iks.map(ik=>({enabled:ik._mmdroidEnabled!==false,iteration:ik.iteration||1,minAngle:Number.isFinite(ik.minAngle)?ik.minAngle:null,maxAngle:Number.isFinite(ik.maxAngle)?ik.maxAngle:null,links:(ik.links||[]).map(l=>l._mmdroidUserEnabled!==false)}))};}
function sceneManifest(){return{format:'MMDroidScene',version:12,savedAt:new Date().toISOString(),folders:state.folders.map(f=>({id:f.id,name:f.name,parentId:f.parentId,position:f.group.position.toArray(),rotation:[f.group.rotation.x,f.group.rotation.y,f.group.rotation.z,f.group.rotation.order],scale:f.group.scale.toArray()})),objects:state.objects.map(serializeObject),camera:{position:camera.position.toArray(),target:controls.target.toArray(),fov:camera.fov,enabled:ui.cameraEnabled.checked,vmdUris:state.cameraUris||[]},audio:{uri:state.audioUri,name:state.audioName,volume:num(ui.volume,.8)},hdri:{uri:state.hdriUri,name:state.hdriName,background:ui.hdriBackground.checked,intensity:num(ui.hdriIntensity,1)},renderer:{pipeline:state.renderPipeline,skinPreset:state.skinPreset,skinPresetStrength:state.skinPresetStrength,toonBands:state.toonBands,textureQuality:state.textureQuality,textureSharpness:state.textureSharpness,clothAlphaBoost:state.clothAlphaBoost,hosieryOpacity:state.hosieryOpacity},lighting:{keyColor:ui.keyColor.value,keyLight:ui.keyLight.value,lightAz:ui.lightAz.value,lightEl:ui.lightEl.value,fillColor:ui.fillColor.value,fillLight:ui.fillLight.value,fillAz:ui.fillAz.value,fillEl:ui.fillEl.value,rimColor:ui.rimColor.value,rimLight:ui.rimLight.value,rimAz:ui.rimAz.value,rimEl:ui.rimEl.value,ambient:ui.ambient.value,ambientSky:ui.ambientSky.value,ambientGround:ui.ambientGround.value,exposure:ui.exposure.value},shadow:{enabled:ui.shadows.checked,characterSelfShadow:!!ui.characterSelfShadow?.checked,outline:ui.outlineEnabled.checked,mapSize:ui.shadowMapSize.value,bias:ui.shadowBias.value,normalBias:ui.shadowNormalBias.value,radius:ui.shadowRadius.value,frozen:state.shadowFrozen},post:{enabled:ui.postEnabled.checked,bloom:ui.bloomEnabled.checked,bloomStrength:ui.bloomStrength.value,bloomThreshold:ui.bloomThreshold.value,bloomRadius:ui.bloomRadius.value,ssao:ui.ssaoEnabled.checked,ssaoRadius:ui.ssaoRadius.value,ssaoMin:ui.ssaoMin.value,ssaoMax:ui.ssaoMax.value,dof:ui.dofEnabled.checked,dofFocus:ui.dofFocus.value,dofAperture:ui.dofAperture.value,dofMaxBlur:ui.dofMaxBlur.value},environment:{builtin:ui.builtinEnvironment?.value||state.builtinEnvironment||'solid',bgColor:ui.bgColor.value,floorColor:ui.floorColor.value,floorRoughness:ui.floorRoughness.value,floorMetalness:ui.floorMetalness.value,gridVisible:ui.gridVisible.checked,floorVisible:ui.floorVisible.checked,fogEnabled:ui.fogEnabled.checked,fogColor:ui.fogColor.value,fogDensity:ui.fogDensity.value},offlineRender:{...offlineConfigFromUI(),backgroundUri:state.offlineBackgroundUri||null,backgroundName:state.offlineBackground?.name||null,resolution:ui.offlineResolution?.value||'3840x2160'},playback:{loop:ui.loop.checked,fps:ui.timelineFps.value,zoom:ui.timelineZoom.value},editorKeys:state.editorKeys};}
function setIf(id,value){if(value!==undefined&&value!==null&&ui[id])ui[id].value=String(value);}function setCheck(id,value){if(value!==undefined&&ui[id])ui[id].checked=!!value;}
function applySceneSettings(m){const rp=m.renderer||{};setIf('renderPipeline',rp.pipeline||'mmdPhong');setIf('skinPreset',rp.skinPreset||'natural');setIf('skinPresetStrength',rp.skinPresetStrength??.70);setIf('toonBands',rp.toonBands??4);setIf('textureQuality',rp.textureQuality||'high');setIf('textureSharpness',rp.textureSharpness??.55);setIf('clothAlphaBoost',rp.clothAlphaBoost??1.28);setIf('hosieryOpacity',rp.hosieryOpacity??.48);state.textureQuality=ui.textureQuality?.value||'high';state.textureSharpness=num(ui.textureSharpness,.55);state.skinPreset=ui.skinPreset?.value||'natural';state.skinPresetStrength=num(ui.skinPresetStrength,.70);syncRenderPipelineUI();updateAlphaResponseUniforms();applyTextureQualitySettings(false);const l=m.lighting||{};for(const k of ['keyColor','keyLight','lightAz','lightEl','fillColor','fillLight','fillAz','fillEl','rimColor','rimLight','rimAz','rimEl','ambient','ambientSky','ambientGround','exposure'])setIf(k,l[k]);syncLightingFromUI(false);const s=m.shadow||{};setCheck('shadows',s.enabled??true);setCheck('characterSelfShadow',s.characterSelfShadow??false);setCheck('outlineEnabled',s.outline??false);setIf('shadowMapSize',s.mapSize);setIf('shadowBias',s.bias);setIf('shadowNormalBias',s.normalBias);setIf('shadowRadius',s.radius);syncShadowFromUI(false);setShadowFrozen(!!s.frozen,false);const p=m.post||{};setCheck('postEnabled',p.enabled??false);setCheck('bloomEnabled',p.bloom??false);setIf('bloomStrength',p.bloomStrength);setIf('bloomThreshold',p.bloomThreshold);setIf('bloomRadius',p.bloomRadius);setCheck('ssaoEnabled',p.ssao??false);setIf('ssaoRadius',p.ssaoRadius);setIf('ssaoMin',p.ssaoMin);setIf('ssaoMax',p.ssaoMax);setCheck('dofEnabled',p.dof??false);setIf('dofFocus',p.dofFocus);setIf('dofAperture',p.dofAperture);setIf('dofMaxBlur',p.dofMaxBlur);syncPostFromUI();const e=m.environment||{};setIf('builtinEnvironment',e.builtin||'solid');state.builtinEnvironment=ui.builtinEnvironment?.value||'solid';for(const k of ['bgColor','floorColor','floorRoughness','floorMetalness','fogColor','fogDensity'])setIf(k,e[k]);setCheck('gridVisible',e.gridVisible??true);setCheck('floorVisible',e.floorVisible??true);setCheck('fogEnabled',e.fogEnabled??false);setCheck('loop',m.playback?.loop??true);setIf('timelineFps',m.playback?.fps??30);setIf('timelineZoom',m.playback?.zoom??60);setIf('volume',m.audio?.volume??.8);audio.volume=num(ui.volume,.8);ui.volumeOut.value=audio.volume.toFixed(2);setCheck('hdriBackground',m.hdri?.background??false);setIf('hdriIntensity',m.hdri?.intensity??1);syncEnvironmentFromUI();const or=m.offlineRender||{};setIf('offlinePipeline',or.pipeline);setIf('offlineSkinPreset',or.skinPreset);setIf('offlineSkinStrength',or.skinStrength);for(const k of ['offlineKey','offlineFill','offlineRim','offlineAmbient','offlineIbl','offlineExposure','offlineKeyColor','offlineKeyAz','offlineKeyEl','offlineFillColor','offlineFillAz','offlineFillEl','offlineRimColor','offlineRimAz','offlineRimEl','offlineAmbientSky','offlineAmbientGround','offlineWidth','offlineHeight','offlineSamples','offlineShadowMap','offlineShadowRadius','offlineBgFit']){const key=k.replace(/^offline/,'');const prop=key.charAt(0).toLowerCase()+key.slice(1);if(or[prop]!==undefined)setIf(k,or[prop]);}if(or.resolution)setIf('offlineResolution',or.resolution);setCheck('offlineHideBuiltin',or.hideBuiltin??true);setCheck('offlineHideFloor',or.hideFloor??true);syncOfflineOutputs();syncLoopModes();}
async function saveScene(){const json=JSON.stringify(sceneManifest(),null,2),name=`MMDroidScene_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.mmdscene.json`;if(window.AndroidBridge?.saveScene){window.AndroidBridge.saveScene(json,name);return;}const blob=new Blob([json],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);showToast('场景文件已生成。');}
function pruneExportClone(root){root.traverse(o=>{if(!o.isMesh&&!o.isSkinnedMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];if(mats.length<=1){if(mats[0]?.visible===false)o.visible=false;return;}const g=o.geometry;if(!g)return;const groups=g.groups?.length?g.groups.slice():[];if(!groups.length)return;const ng=g.clone();ng.clearGroups();for(const gr of groups){const m=mats[Number(gr.materialIndex)||0];if(m?.visible!==false)ng.addGroup(gr.start,gr.count,gr.materialIndex);}o.geometry=ng;if(!ng.groups.length)o.visible=false;});return root;}
function safeExportName(name){return String(name||'Character').replace(/[\/:*?"<>|]+/g,'_').replace(/\s+/g,'_').slice(0,80)||'Character';}
async function saveModelBlob(blob,name){if(window.AndroidBridge?.beginModelExportSave&&window.AndroidBridge?.appendModelExportChunk&&window.AndroidBridge?.finishModelExportSave){if(!window.AndroidBridge.beginModelExportSave(name))throw new Error('无法初始化模型导出');const chunkBytes=192*1024;try{for(let off=0;off<blob.size;off+=chunkBytes){const bytes=new Uint8Array(await blob.slice(off,Math.min(blob.size,off+chunkBytes)).arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,Math.min(bytes.length,i+0x8000)));if(!window.AndroidBridge.appendModelExportChunk(btoa(binary)))throw new Error('模型分块写入失败');await new Promise(r=>setTimeout(r,0));}window.AndroidBridge.finishModelExportSave();}catch(err){window.AndroidBridge.abortModelExportSave?.();throw err;}return;}const a=document.createElement('a');a.download=name;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);}
async function exportSelectedModel(){const rec=preferredSelectedModel(false);if(!rec)return showToast('请先在左侧选择要导出的人物。');setLoading(true,'正在导出当前人物与装扮...');try{removeBoneOverrides(rec);applyModelPartStates(rec);syncAllWearables();objectTransformNode(rec).updateMatrixWorld(true);const cloned=pruneExportClone(cloneSkeleton(objectTransformNode(rec)));cloned.name=`${rec.name}_export`;const exporter=new GLTFExporter();const result=await new Promise((resolve,reject)=>exporter.parse(cloned,resolve,reject,{binary:true,onlyVisible:true,trs:true,animations:[],includeCustomExtensions:false,maxTextureSize:8192}));const blob=new Blob([result],{type:'model/gltf-binary'}),name=`${safeExportName(rec.name)}_MMDroid.glb`;await saveModelBlob(blob,name);showToast(`模型已导出：${name} · 当前服装/头发/配件状态已写入`,5000);}catch(err){console.error('model export',err);showToast(`模型导出失败：${err?.message||err}`,6000);}finally{applyBoneOverrides(rec);setLoading(false);markRenderDirty();}}
async function restoreSceneManifest(m){if(m?.format!=='MMDroidScene')throw new Error('不是 MMDroidScene 场景文件');setLoading(true,'正在恢复场景层级...');stopAll();clearObjects();clearFolders();clearSceneMedia();state.editorKeys={};state.nextObjectId=1;state.nextFolderId=1;applySceneSettings(m);try{
  for(const fs of m.folders||[]){const f=createFolder(fs.name||'Folder',null,String(fs.id));const n=Number(String(fs.id).replace(/^f/,''));if(Number.isFinite(n))state.nextFolderId=Math.max(state.nextFolderId,n+1);if(fs.position)f.group.position.fromArray(fs.position);if(fs.rotation)f.group.rotation.set(fs.rotation[0]||0,fs.rotation[1]||0,fs.rotation[2]||0,fs.rotation[3]||'XYZ');if(fs.scale)f.group.scale.fromArray(fs.scale);}
  for(const fs of m.folders||[]){const f=folderById(String(fs.id));if(f)setFolderParent(f,fs.parentId||null);}
  const specs=m.objects||m.models||[];for(const spec of specs){if(!spec.sourceUris?.length){showToast(`场景中的 ${spec.name} 没有持久 URI，需要重新导入。`,4500);continue;}const items=await reopenNativeUris(spec.sourceUris),files=await nativeItemsToFiles(items);const made=await importObjectFiles(files,spec.category||'model',spec.sourceUris,spec);const rec=made[0];if(rec&&spec.motionUris?.length){const mi=await reopenNativeUris(spec.motionUris),mf=await nativeItemsToFiles(mi);await importMotionFiles(mf,rec,spec.motionUris);}else if(rec?.physics?.enabled)await rebuildMmdHelper(rec,false);}
  for(const spec of specs){const rec=objectById(spec.id);if(rec&&(spec.wearable?.targetModelId||spec.attachment?.modelId))attachWearable(rec,spec.wearable?.targetModelId||spec.attachment.modelId,(spec.wearable?.boneName||spec.attachment?.boneName||'__root__'));}
  const c=m.camera||{};if(c.vmdUris?.length){const ci=await reopenNativeUris(c.vmdUris),cf=await nativeItemsToFiles(ci);await importCameraFiles(cf,c.vmdUris);}else{state.cameraAnimation=false;state.cameraUris=[];controls.enabled=true;}if(c.position)camera.position.fromArray(c.position);if(c.target)controls.target.fromArray(c.target);if(Number.isFinite(Number(c.fov))){camera.fov=Number(c.fov);camera.updateProjectionMatrix();}setCheck('cameraEnabled',c.enabled??true);controls.update();updateCameraUI();
  if(m.audio?.uri){const ai=await reopenNativeUris([m.audio.uri]),af=await nativeItemsToFiles(ai);if(af[0])importAudioFile(af[0],m.audio.uri);}if(m.hdri?.uri){const hi=await reopenNativeUris([m.hdri.uri]),hf=await nativeItemsToFiles(hi);if(hf[0])await importHdriFile(hf[0],m.hdri.uri);}if(m.offlineRender?.backgroundUri){try{const bi=await reopenNativeUris([m.offlineRender.backgroundUri]),bf=await nativeItemsToFiles(bi);if(bf[0])await importOfflineBackground(bf[0],m.offlineRender.backgroundUri);}catch(err){console.warn('offline background restore',err);}}
  state.editorKeys=m.editorKeys||{};recomputeDuration();applyVisibility();selectNode('scene');updateSceneTree();showToast('场景恢复完成。');
}finally{setLoading(false);}}
async function importSceneFile(file){if(!file)return;try{const text=await file.text(),m=JSON.parse(text);await restoreSceneManifest(m);}catch(err){console.error(err);showToast(`场景导入失败：${err?.message||err}`,5500);}finally{ui.sceneInput.value='';}}


function formatBytes(bytes){const n=Number(bytes)||0;if(n<1024)return `${n} B`;if(n<1024*1024)return `${(n/1024).toFixed(1)} KB`;if(n<1024*1024*1024)return `${(n/1024/1024).toFixed(1)} MB`;return `${(n/1024/1024/1024).toFixed(2)} GB`;}
function libraryCategoryLabel(cat){return({model:'人物',costume:'服装',hair:'头发',accessory:'配件',item:'旧道具',stage:'舞台',vmd:'VMD',music:'音乐',scene:'场景',hdri:'HDRI',output:'输出'})[cat]||cat;}
function libraryCategoryIcon(cat){return({model:'♙',costume:'◈',hair:'✦',accessory:'◇',item:'◆',stage:'▦',vmd:'▶',music:'♪',scene:'◈',hdri:'☼',output:'□'})[cat]||'•';}
function libraryEntries(cat=state.libraryCategory){const cats=state.libraryManifest?.categories||{};const arr=cats?.[cat];return Array.isArray(arr)?arr:[];}
function updateLibraryStatus(text){if(ui.libraryStatus)ui.libraryStatus.textContent=text||'';}
function renderLibrary(){
  if(!ui.libraryList)return;
  for(const b of ui.libraryTabs?.querySelectorAll?.('button[data-library-category]')||[])b.classList.toggle('active',b.dataset.libraryCategory===state.libraryCategory);
  const entries=libraryEntries(),wearOnly=['costume','hair','accessory'].includes(state.libraryCategory);ui.libraryList.innerHTML='';
  if(!state.libraryAvailable){ui.libraryList.innerHTML='<div class="tree-empty">资源库尚未授权。点击右上角 ⌂ 可重新选择目录。</div>';return;}
  if(!entries.length){ui.libraryList.innerHTML=`<div class="tree-empty">${libraryCategoryLabel(state.libraryCategory)}目录暂无资源</div>`;return;}
  for(const e of entries){
    const row=document.createElement('div');row.className='library-entry'+(wearOnly?' library-display-only':'');row.title=wearOnly?'仅展示；请先选择人物，再到右侧“装扮资源”中应用。':`载入 ${e.name||e.path||''}`;
    const meta=[];if(e.bundle){meta.push(Number(e.bundlePartCount)>0?`整套 · ${e.bundlePartCount} 部件`:'整套资源');}else if(Number(e.fileCount)>1)meta.push(`${e.fileCount} 文件`);if(Number(e.textureCount)>0)meta.push(`${e.textureCount} 贴图`);if(!e.bundle&&Number(e.size)>=0)meta.push(formatBytes(e.size));if(e.type&&!e.bundle)meta.push(String(e.type).toUpperCase());
    row.innerHTML=`<div class="lib-icon">${libraryCategoryIcon(state.libraryCategory)}</div><div class="lib-main"><div class="lib-name"></div><div class="lib-meta"></div></div><div class="lib-open">${wearOnly?'展示':'载入'}</div>`;
    row.querySelector('.lib-name').textContent=e.name||e.mainName||e.path||'资源';row.querySelector('.lib-meta').textContent=meta.join(' · ');
    if(!wearOnly)row.addEventListener('click',()=>openLibraryEntry(e));ui.libraryList.append(row);
  }
}
function openLibraryEntry(entry,category=state.libraryCategory){
  if(!entry)return;if(!window.AndroidBridge?.openLibraryEntry)return showToast('浏览器模式无法直接读取 Android mmddata 资源库。');
  if(['costume','hair','accessory'].includes(category))return showToast('服装 / 头发 / 配件需要先选中人物，再从右侧“装扮资源”应用。',4200);
  if(category==='vmd'&&!resolveMotionTarget(null,{quiet:true,requireMmd:true}))return showToast('请先选择一个 PMX / PMD 人物，或在动作面板中指定动作目标人物。');
  updateLibraryStatus(`正在载入 ${entry.name||''}...`);window.AndroidBridge.openLibraryEntry(category,String(entry.path||''),String(entry.mainPath||''));setResourcePanelVisible(false);
}
function syncWearableLibrarySelectors(){
  const configs=[['costume',ui.costumeLibrarySelect,'暂无服装资源'],['hair',ui.hairLibrarySelect,'暂无头发资源'],['accessory',ui.accessoryLibrarySelect,'暂无配件资源']];
  for(const [kind,sel,empty] of configs){if(!sel)continue;const prev=sel.value,arr=libraryEntries(kind);sel.innerHTML='';sel.append(new Option(arr.length?`选择${libraryCategoryLabel(kind)}资源` : empty,''));for(const e of arr){const count=Number(e.bundlePartCount)||0,tag=count?` · ${count} 部件`:'';const o=new Option(`${e.name||e.mainName||e.path}${tag}`,String(e.path||''));o.dataset.mainPath=String(e.mainPath||'');sel.append(o);}if(arr.some(e=>String(e.path||'')===prev))sel.value=prev;}
}
function wearableLibraryEntry(kind,path){return libraryEntries(kind).find(e=>String(e.path||'')===String(path||''))||null;}
function applyWearableLibrary(kind){
  const model=preferredSelectedModel(false);if(!model)return showToast('请先在左侧选择要换装的人物。');
  const sel=kind==='costume'?ui.costumeLibrarySelect:kind==='hair'?ui.hairLibrarySelect:ui.accessoryLibrarySelect,entry=wearableLibraryEntry(kind,sel?.value);if(!entry)return showToast(`请选择${libraryCategoryLabel(kind)}资源。`);
  if(!window.AndroidBridge?.openLibraryEntry)return showToast('仅 Android APK 支持从 mmddata 装扮库载入。');
  state.pendingWearableTargetId=model.id;state.pendingWearableKind=kind;updateLibraryStatus(`正在为 ${model.name} 载入${libraryCategoryLabel(kind)}...`);window.AndroidBridge.openLibraryEntry(kind,String(entry.path||''),String(entry.mainPath||''));
}
function setLibraryManifest(manifest,changed=false,scanning=false){
  state.libraryManifest=manifest||null;state.libraryAvailable=!!manifest;state.libraryScanning=!!scanning;
  const total=['model','costume','hair','accessory','stage','vmd','music'].reduce((n,c)=>n+libraryEntries(c).length,0);
  updateLibraryStatus(scanning?`已读取清单 · 后台校验中 · ${total} 项`:`${changed?'清单已更新':'清单已校验'} · ${total} 项`);renderLibrary();syncWearableLibrarySelectors();
}
function requestLibraryRefresh(){if(window.AndroidBridge?.refreshLibrary){state.libraryScanning=true;updateLibraryStatus('正在扫描文件清单...');window.AndroidBridge.refreshLibrary();}else showToast('仅 Android APK 支持 mmddata 资源库。');}
function blobFromUrl(url){return new Promise((resolve,reject)=>{const x=new XMLHttpRequest();x.open('GET',url,true);x.responseType='blob';x.onload=()=>x.status===0||x.status<400?resolve(x.response):reject(new Error(`读取缓存文件失败 HTTP ${x.status}`));x.onerror=()=>reject(new Error('读取 Android 缓存文件失败'));x.send();});}
async function nativeItemsToFiles(items){const files=[];for(const item of items||[]){if(item.error){console.warn(item.error);continue;}const blob=await blobFromUrl(item.url),f=new File([blob],item.name||'file',{type:blob.type||'application/octet-stream'});f.__sourceUri=item.uri;f.__relativePath=String(item.relativePath||item.name||'file').replace(/\\/g,'/');f.__primaryModel=item.primaryModel===true;f.__sourceType=item.sourceType||'document';files.push(f);}return files;}
function payloadItems(payload){try{return JSON.parse(payload||'[]');}catch{return[];}}
function uniqueUris(items){return Array.from(new Set((items||[]).filter(x=>!x.error&&x.uri).map(x=>x.uri)));}

// ----- Independent offline reference renderer -----
function offlineBuiltinColor(){return({white:'#ffffff',softgray:'#e8ebf0',beige:'#efe4d2',pink:'#f7dce9',sky:'#dfeefe',mint:'#ddf4eb',lavender:'#ebe7fb',charcoal:'#23262d'})[ui.offlineBuiltinBg?.value||'white']||'#ffffff';}
function offlineConfigFromUI(){
  return {
    pipeline:ui.offlinePipeline?.value||'blenderPbr',
    skinPreset:ui.offlineSkinPreset?.value||'natural',
    skinStrength:clamp(num(ui.offlineSkinStrength,.70),0,1),
    key:num(ui.offlineKey,1),fill:num(ui.offlineFill,.28),rim:num(ui.offlineRim,.45),ambient:num(ui.offlineAmbient,.42),ibl:num(ui.offlineIbl,.75),exposure:num(ui.offlineExposure,.88),
    keyColor:ui.offlineKeyColor?.value||'#ffffff',fillColor:ui.offlineFillColor?.value||'#c8d6ff',rimColor:ui.offlineRimColor?.value||'#f0e7ff',ambientSky:ui.offlineAmbientSky?.value||'#ffffff',ambientGround:ui.offlineAmbientGround?.value||'#66656b',
    keyAz:num(ui.offlineKeyAz,-35),keyEl:num(ui.offlineKeyEl,50),fillAz:num(ui.offlineFillAz,45),fillEl:num(ui.offlineFillEl,25),rimAz:num(ui.offlineRimAz,150),rimEl:num(ui.offlineRimEl,35),
    width:Math.max(512,Math.min(8192,Math.round(num(ui.offlineWidth,3840)))),height:Math.max(512,Math.min(8192,Math.round(num(ui.offlineHeight,2160)))),
    samples:Math.max(1,Math.min(16,Math.round(num(ui.offlineSamples,4)))),shadowMap:Math.max(1024,Math.min(8192,Math.round(num(ui.offlineShadowMap,4096)))),shadowRadius:clamp(num(ui.offlineShadowRadius,3),0,12),
    bgSource:ui.offlineBgSource?.value||'builtin',builtinBg:ui.offlineBuiltinBg?.value||'white',bgFit:ui.offlineBgFit?.value||'cover',frameStyle:ui.offlineFrameStyle?.value||'none',orientation:ui.outputOrientation?.value||'landscape',hideBuiltin:!!ui.offlineHideBuiltin?.checked,hideFloor:!!ui.offlineHideFloor?.checked
  };
}
function syncOfflineOutputs(){
  const pairs=[['offlineSkinStrength','offlineSkinStrengthOut',2],['offlineKey','offlineKeyOut',2],['offlineFill','offlineFillOut',2],['offlineRim','offlineRimOut',2],['offlineAmbient','offlineAmbientOut',2],['offlineIbl','offlineIblOut',2],['offlineExposure','offlineExposureOut',2],['offlineShadowRadius','offlineShadowRadiusOut',1]];
  for(const [i,o,d] of pairs)if(ui[i]&&ui[o])ui[o].value=num(ui[i],0).toFixed(d);
  updateOfflineBackgroundInfo();
}
function copyRealtimeToOffline(){
  ui.offlinePipeline.value=state.renderPipeline;ui.offlineSkinPreset.value=state.skinPreset;ui.offlineSkinStrength.value=state.skinPresetStrength;
  ui.offlineKey.value=ui.keyLight.value;ui.offlineFill.value=ui.fillLight.value;ui.offlineRim.value=ui.rimLight.value;ui.offlineAmbient.value=ui.ambient.value;ui.offlineIbl.value=ui.hdriIntensity.value;ui.offlineExposure.value=ui.exposure.value;
  ui.offlineKeyColor.value=ui.keyColor.value;ui.offlineFillColor.value=ui.fillColor.value;ui.offlineRimColor.value=ui.rimColor.value;ui.offlineAmbientSky.value=ui.ambientSky.value;ui.offlineAmbientGround.value=ui.ambientGround.value;
  ui.offlineKeyAz.value=ui.lightAz.value;ui.offlineKeyEl.value=ui.lightEl.value;ui.offlineFillAz.value=ui.fillAz.value;ui.offlineFillEl.value=ui.fillEl.value;ui.offlineRimAz.value=ui.rimAz.value;ui.offlineRimEl.value=ui.rimEl.value;
  syncOfflineOutputs();showToast('已将当前实时参数复制到离线输出；之后两套参数互不联动。');
}
function offlineResolutionChanged(){
  const v=ui.offlineResolution?.value||'3840x2160';if(v!=='custom'){const m=v.match(/^(\d+)x(\d+)$/);if(m){ui.offlineWidth.value=m[1];ui.offlineHeight.value=m[2];}}
  let w=Math.max(512,Number(ui.offlineWidth?.value)||3840),h=Math.max(512,Number(ui.offlineHeight?.value)||2160),o=ui.outputOrientation?.value||'landscape';
  if(o==='landscape'&&h>w)[w,h]=[h,w];else if(o==='portrait'&&w>h)[w,h]=[h,w];ui.offlineWidth.value=String(w);ui.offlineHeight.value=String(h);
}
function updateOfflineBackgroundInfo(){if(!ui.offlineBgInfo)return;const mode=ui.offlineBgSource?.value||'builtin';if(mode==='image'){if(state.offlineBackground){const img=state.offlineBackground.img,w=img?.naturalWidth||img?.width||0,h=img?.naturalHeight||img?.height||0;ui.offlineBgInfo.textContent=`2D 输出背景：${state.offlineBackground.name} · ${w}×${h}`;}else ui.offlineBgInfo.textContent='2D 输出背景：尚未选择图片。';}else if(mode==='scene')ui.offlineBgInfo.textContent='2D 输出背景：沿用实时 3D 场景背景。';else ui.offlineBgInfo.textContent=`2D 输出背景：内置纯色 · ${ui.offlineBuiltinBg?.selectedOptions?.[0]?.textContent||'纯白'}`;}
function releaseOfflineBackground(){const old=state.offlineBackground;if(old?.url)URL.revokeObjectURL(old.url);state.offlineBackground=null;state.offlineBackgroundUri=null;updateOfflineBackgroundInfo();}
async function importOfflineBackground(file,uri=null){
  if(!file)return;releaseOfflineBackground();const url=URL.createObjectURL(file),img=new Image();img.decoding='async';
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('2D 背景图片解码失败'));img.src=url;});
  state.offlineBackground={file,url,img,name:file.name||'background'};state.offlineBackgroundUri=uri||file.__sourceUri||null;if(ui.offlineBgSource)ui.offlineBgSource.value='image';updateOfflineBackgroundInfo();
}
function drawOfflineBackground(ctx,w,h,bg,fit='cover',source='builtin'){
  ctx.clearRect(0,0,w,h);if(source==='builtin'){ctx.fillStyle=offlineBuiltinColor();ctx.fillRect(0,0,w,h);return true;}if(source==='scene')return false;if(!bg?.img){ctx.fillStyle=offlineBuiltinColor();ctx.fillRect(0,0,w,h);return true;}
  const img=bg.img,iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;if(!iw||!ih)return false;if(fit==='stretch'){ctx.drawImage(img,0,0,w,h);return true;}const scale=fit==='contain'?Math.min(w/iw,h/ih):Math.max(w/iw,h/ih),dw=iw*scale,dh=ih*scale,dx=(w-dw)/2,dy=(h-dh)/2;ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);ctx.drawImage(img,dx,dy,dw,dh);return true;
}
function drawOfflineFrame(ctx,w,h,style='none'){if(style==='none')return;ctx.save();if(style==='whiteThin'||style==='blackThin'){const lw=Math.max(6,Math.round(Math.min(w,h)*.012));ctx.strokeStyle=style==='whiteThin'?'rgba(255,255,255,.95)':'rgba(18,18,18,.95)';ctx.lineWidth=lw;ctx.strokeRect(lw*.5,lw*.5,w-lw,h-lw);}else if(style==='gallery'){const pad=Math.round(Math.min(w,h)*.06);ctx.fillStyle='rgba(252,252,250,.98)';ctx.fillRect(0,0,w,pad);ctx.fillRect(0,h-pad,w,pad);ctx.fillRect(0,0,pad,h);ctx.fillRect(w-pad,0,pad,h);ctx.strokeStyle='rgba(210,210,210,.92)';ctx.lineWidth=Math.max(2,Math.round(pad*.05));ctx.strokeRect(pad*.52,pad*.52,w-pad*1.04,h-pad*1.04);}else if(style==='polaroid'){const side=Math.round(Math.min(w,h)*.045),top=side,bottom=Math.round(Math.min(w,h)*.14);ctx.fillStyle='rgba(255,255,255,.98)';ctx.fillRect(0,0,w,top);ctx.fillRect(0,h-bottom,w,bottom);ctx.fillRect(0,0,side,h);ctx.fillRect(w-side,0,side,h);ctx.strokeStyle='rgba(220,220,220,.95)';ctx.lineWidth=Math.max(2,Math.round(side*.06));ctx.strokeRect(side*.52,top*.52,w-side*1.04,h-bottom-top*.02);}ctx.restore();}
function snapshotRealtimeRenderState(){
  return {pipeline:state.renderPipeline,skinPreset:state.skinPreset,skinStrength:state.skinPresetStrength,hdri:String(ui.hdriIntensity.value),tone:renderer.toneMapping,exposure:renderer.toneMappingExposure,
    shadowMap:Number(ui.shadowMapSize.value),shadowRadius:num(ui.shadowRadius,1.5),shadowBias:num(ui.shadowBias,.0002),shadowNormalBias:num(ui.shadowNormalBias,.045),shadowAuto:renderer.shadowMap.autoUpdate,outline:state.outlineEnabled,clearColor:renderer.getClearColor(new THREE.Color()).getHex(),clearAlpha:renderer.getClearAlpha(),
    skyVisible:builtinSkyDome?.visible,envVisible:builtinEnvironmentGroup?.visible,floorVisible:floor.visible,gridVisible:grid.visible,background:scene.background};
}
function applyOfflineRenderState(c){
  state.renderPipeline=c.pipeline;state.skinPreset=c.skinPreset;state.skinPresetStrength=c.skinStrength;ui.hdriIntensity.value=String(c.ibl);
  rebuildAllMmdMaterials();
  const pp=pipelineProfile(c.pipeline),gain=pp.lightGain;
  keyLight.color.set(c.keyColor);fillLight.color.set(c.fillColor);rimLight.color.set(c.rimColor);ambientLight.color.set(c.ambientSky);ambientLight.groundColor.set(c.ambientGround);
  keyLight.intensity=c.key*gain;fillLight.intensity=c.fill*gain;rimLight.intensity=c.rim*gain;ambientLight.intensity=c.ambient*Math.max(.50,gain);
  lightPosition(keyLight,c.keyAz,c.keyEl);lightPosition(fillLight,c.fillAz,c.fillEl);lightPosition(rimLight,c.rimAz,c.rimEl);
  renderer.toneMapping=pipelineUsesPhysical(c.pipeline)?((THREE.NeutralToneMapping??THREE.ACESFilmicToneMapping)):THREE.NoToneMapping;renderer.toneMappingExposure=c.exposure*pp.exposure;
  scene.environment=state.hdriEnv||(pipelineUsesPhysical(c.pipeline)?pbrFallbackEnv:null);scene.environmentIntensity=pipelineUsesPhysical(c.pipeline)?c.ibl*pp.env:0;
  for(const rec of state.objects)for(const m of rec.materials||[])if('envMapIntensity'in m){const role=m.userData?._mmdroidRole||'generic',rg=role==='skin'?.52:role==='hair'?.88:1;m.envMapIntensity=pipelineUsesPhysical(c.pipeline)?Math.max(.025,c.ibl*pp.env*rg):0;}
  const maxTex=renderer.capabilities.maxTextureSize||4096,size=Math.min(c.shadowMap,maxTex);keyLight.shadow.mapSize.set(size,size);if(keyLight.shadow.map){keyLight.shadow.map.dispose();keyLight.shadow.map=null;}keyLight.shadow.radius=c.shadowRadius;keyLight.shadow.bias=.00028;keyLight.shadow.normalBias=.055;renderer.shadowMap.autoUpdate=true;renderer.shadowMap.needsUpdate=true;
  state.outlineEnabled=(c.pipeline==='toonClassic'||c.pipeline==='genshin');updatePipelineShaderUniforms({rimColor:c.rimColor,rim:c.rim});
}
function restoreRealtimeRenderState(snap){
  state.renderPipeline=snap.pipeline;state.skinPreset=snap.skinPreset;state.skinPresetStrength=snap.skinStrength;ui.hdriIntensity.value=snap.hdri;
  rebuildAllMmdMaterials();syncLightingFromUI(false);syncShadowFromUI(false);syncEnvironmentFromUI();syncToneMappingForPipeline();state.outlineEnabled=snap.outline;
  renderer.shadowMap.autoUpdate=snap.shadowAuto;keyLight.shadow.radius=snap.shadowRadius;keyLight.shadow.bias=snap.shadowBias;keyLight.shadow.normalBias=snap.shadowNormalBias;
  if(builtinSkyDome&&snap.skyVisible!==undefined)builtinSkyDome.visible=snap.skyVisible;if(builtinEnvironmentGroup&&snap.envVisible!==undefined)builtinEnvironmentGroup.visible=snap.envVisible;floor.visible=snap.floorVisible;grid.visible=snap.gridVisible;scene.background=snap.background;renderer.setClearColor(snap.clearColor,snap.clearAlpha);
}
function halton(i,b){let f=1,r=0;while(i>0){f/=b;r+=f*(i%b);i=Math.floor(i/b);}return r;}
async function renderOfflineReference(){
  if(state.offlineRendering)return;state.offlineRendering=true;const c=offlineConfigFromUI(),snap=snapshotRealtimeRenderState();const bg=state.offlineBackground,use2D=c.bgSource!=='scene',wasPlaying=state.playing;if(wasPlaying)await setPlaying(false);
  setLoading(true,'正在准备离线高质量输出...');if(ui.offlineRenderStatus)ui.offlineRenderStatus.textContent='正在准备离线材质与灯光...';
  let target=null;
  try{
    applyOfflineRenderState(c);
    const oldClear=renderer.getClearColor(new THREE.Color()).clone(),oldAlpha=renderer.getClearAlpha();
    const oldBg=scene.background,oldFloor=floor.visible,oldGrid=grid.visible,oldSky=builtinSkyDome?.visible,oldEnv=builtinEnvironmentGroup?.visible;
    if(use2D){scene.background=null;if(c.hideBuiltin){if(builtinSkyDome)builtinSkyDome.visible=false;if(builtinEnvironmentGroup)builtinEnvironmentGroup.visible=false;}if(c.hideFloor){floor.visible=false;grid.visible=false;}renderer.setClearColor(0x000000,0);}
    const output=document.createElement('canvas');output.width=c.width;output.height=c.height;const outCtx=output.getContext('2d',{alpha:true});drawOfflineBackground(outCtx,c.width,c.height,bg,c.bgFit,c.bgSource);
    const tileSize=Math.min(1024,renderer.capabilities.maxTextureSize||1024),tilesX=Math.ceil(c.width/tileSize),tilesY=Math.ceil(c.height/tileSize),total=tilesX*tilesY;
    let done=0;renderer.shadowMap.autoUpdate=true;
    for(let ty=0;ty<tilesY;ty++)for(let tx=0;tx<tilesX;tx++){
      const x=tx*tileSize,y=ty*tileSize,tw=Math.min(tileSize,c.width-x),th=Math.min(tileSize,c.height-y);
      if(target)target.dispose();target=new THREE.WebGLRenderTarget(tw,th,{format:THREE.RGBAFormat,type:THREE.UnsignedByteType,depthBuffer:true,stencilBuffer:false});
      target.texture.colorSpace=THREE.SRGBColorSpace;if('samples'in target)target.samples=Math.min(4,renderer.capabilities.isWebGL2?4:0);
      const px=new Uint8Array(tw*th*4),acc=new Uint16Array(tw*th*4);
      for(let si=0;si<c.samples;si++){
        const jx=c.samples>1?halton(si+1,2)-.5:0,jy=c.samples>1?halton(si+1,3)-.5:0;
        camera.setViewOffset(c.width,c.height,x+jx,y+jy,tw,th);renderer.setRenderTarget(target);renderer.clear(true,true,true);
        if(state.outlineEnabled)outlineEffect.render(scene,camera);else renderer.render(scene,camera);
        renderer.readRenderTargetPixels(target,0,0,tw,th,px);for(let i=0;i<px.length;i++)acc[i]+=px[i];renderer.shadowMap.autoUpdate=false;
      }
      const img=outCtx.createImageData(tw,th),dst=img.data;
      for(let yy=0;yy<th;yy++){const sy=th-1-yy;for(let xx=0;xx<tw;xx++){const si=(sy*tw+xx)*4,di=(yy*tw+xx)*4;dst[di]=acc[si]/c.samples;dst[di+1]=acc[si+1]/c.samples;dst[di+2]=acc[si+2]/c.samples;dst[di+3]=acc[si+3]/c.samples;}}
      const tc=document.createElement('canvas');tc.width=tw;tc.height=th;tc.getContext('2d').putImageData(img,0,0);outCtx.drawImage(tc,x,y);
      done++;const pct=Math.round(done/total*100);if(ui.offlineRenderStatus)ui.offlineRenderStatus.textContent=`渲染中 ${pct}% · ${c.width}×${c.height} · ${c.samples}× 子像素采样`;setLoading(true,`高质量输出 ${pct}%`);await new Promise(r=>setTimeout(r,0));
    }
    drawOfflineFrame(outCtx,c.width,c.height,c.frameStyle);camera.clearViewOffset();renderer.setRenderTarget(null);renderer.setClearColor(oldClear,oldAlpha);scene.background=oldBg;floor.visible=oldFloor;grid.visible=oldGrid;if(builtinSkyDome&&oldSky!==undefined)builtinSkyDome.visible=oldSky;if(builtinEnvironmentGroup&&oldEnv!==undefined)builtinEnvironmentGroup.visible=oldEnv;
    const name=`MMDroid_Reference_${c.width}x${c.height}_${new Date().toISOString().replace(/[:.]/g,'-').slice(0,19)}.png`;
    const blob=await new Promise((resolve,reject)=>output.toBlob(b=>b?resolve(b):reject(new Error('PNG 编码失败')),'image/png'));
    if(window.AndroidBridge?.beginRenderImageSave&&window.AndroidBridge?.appendRenderImageChunk&&window.AndroidBridge?.finishRenderImageSave){
      if(!window.AndroidBridge.beginRenderImageSave(name))throw new Error('无法初始化 mmddata/output 写入');
      const chunkBytes=192*1024;let written=0;
      for(let off=0;off<blob.size;off+=chunkBytes){
        const bytes=new Uint8Array(await blob.slice(off,Math.min(blob.size,off+chunkBytes)).arrayBuffer());let binary='';
        for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,Math.min(bytes.length,i+0x8000)));
        if(!window.AndroidBridge.appendRenderImageChunk(btoa(binary))){window.AndroidBridge.abortRenderImageSave?.();throw new Error('PNG 分块写入失败');}
        written+=bytes.length;if(ui.offlineRenderStatus)ui.offlineRenderStatus.textContent=`PNG 写入 ${Math.round(written/blob.size*100)}% · ${(blob.size/1048576).toFixed(1)} MB`;await new Promise(r=>setTimeout(r,0));
      }
      window.AndroidBridge.finishRenderImageSave();
    }else if(window.AndroidBridge?.saveRenderImage){const data=await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=()=>reject(fr.error||new Error('PNG 读取失败'));fr.readAsDataURL(blob);});window.AndroidBridge.saveRenderImage(data,name);}
    else{const a=document.createElement('a');a.download=name;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);if(ui.offlineRenderStatus)ui.offlineRenderStatus.textContent=`已生成 ${name}`;}
  }catch(err){console.error('offline render',err);if(ui.offlineRenderStatus)ui.offlineRenderStatus.textContent=`输出失败：${err?.message||err}`;showToast(`高质量输出失败：${err?.message||err}`,6000);}
  finally{try{camera.clearViewOffset();renderer.setRenderTarget(null);target?.dispose?.();restoreRealtimeRenderState(snap);}catch(err){console.warn('restore offline state',err);}state.offlineRendering=false;setLoading(false);if(wasPlaying)setPlaying(true);}
}

window.MMDroidNative={async onFilesSelected(kind,payload){const items=payloadItems(payload),waiter=nativeWaiters.get(kind);if(waiter){nativeWaiters.delete(kind);waiter.resolve(items);return;}try{const files=await nativeItemsToFiles(items),uris=uniqueUris(items);if(kind==='model')await importObjectFiles(files,'model',uris);else if(kind==='costume')await importObjectFiles(files,'costume',uris);else if(kind==='hair')await importObjectFiles(files,'hair',uris);else if(kind==='stage')await importObjectFiles(files,'stage',uris);else if(kind==='accessory')await importObjectFiles(files,'accessory',uris);else if(kind==='motion')await importMotionFiles(files,resolveMotionTarget(null,{quiet:false,requireMmd:true}),uris);else if(kind==='camera')await importCameraFiles(files,uris);else if(kind==='audio')importAudioFile(files[0],uris[0]||null);else if(kind==='hdri')await importHdriFile(files[0],uris[0]||null);else if(kind==='renderBackground')await importOfflineBackground(files[0],uris[0]||null);else if(kind==='scene')await importSceneFile(files[0]);updateLibraryStatus('资源已载入');}catch(err){console.error(err);showToast(`文件处理失败：${err?.message||err}`,5000);}},onLibraryManifest(payload,changed,scanning){try{setLibraryManifest(JSON.parse(payload||'{}'),!!changed,!!scanning);}catch(err){console.warn('library manifest',err);}},onLibraryUnavailable(message){state.libraryAvailable=false;state.libraryManifest=null;updateLibraryStatus('未授权');renderLibrary();showToast(message||'mmddata 资源库不可用',5000);},onLibraryNotice(message){if(message)showToast(message,3200);},onPackageScanned(resources,textures){showToast(`模型包已解压：${resources} 个资源 · ${textures} 个贴图`,4200);},onResourceFolderScanned(resources,textures){showToast(`同级目录扫描完成：${resources} 个资源 · ${textures} 个贴图`,4200);},onResourceFolderSkipped(){showToast('未授权同级目录：仍会导入模型，并对缺失贴图使用安全预览。',4200);},onPickerCancelled(kind){if(['costume','hair','accessory'].includes(kind)){state.pendingWearableTargetId=null;state.pendingWearableKind=null;}const w=nativeWaiters.get(kind);if(w){nativeWaiters.delete(kind);w.reject(new Error('用户取消选择'));}},onNativeError(kind,message){if(['costume','hair','accessory'].includes(kind)){state.pendingWearableTargetId=null;state.pendingWearableKind=null;}const w=nativeWaiters.get(kind);if(w){nativeWaiters.delete(kind);w.reject(new Error(message));}showToast(message,5000);},onSceneSaved(ok,message){showToast(message||(ok?'场景已保存':'场景保存失败'),4000);},onRenderSaved(ok,message){if(ui.offlineRenderStatus)ui.offlineRenderStatus.textContent=message||(ok?'高质量输出已保存':'高质量输出保存失败');showToast(message||(ok?'高质量输出已保存':'高质量输出保存失败'),5000);},onModelExportSaved(ok,message){showToast(message||(ok?'模型已导出':'模型导出失败'),5000);if(ok)requestLibraryRefresh();}};
function reopenNativeUris(uris){if(!window.AndroidBridge?.reopenUris)throw new Error('当前环境无法通过持久 URI 恢复资源；请在 Android APK 中打开该场景。');const token=`restore-${Date.now()}-${Math.random().toString(16).slice(2)}`;return new Promise((resolve,reject)=>{nativeWaiters.set(token,{resolve,reject});window.AndroidBridge.reopenUris(token,JSON.stringify(uris));});}
function triggerPicker(kind,multiple){if(window.AndroidBridge?.openPicker){window.AndroidBridge.openPicker(kind,!!multiple);return;}const input={model:ui.modelInput,costume:ui.costumeInput,hair:ui.hairInput,stage:ui.stageInput,accessory:ui.accessoryInput,motion:ui.motionInput,camera:ui.cameraInput,audio:ui.audioInput,hdri:ui.hdriInput,scene:ui.sceneInput,renderBackground:ui.renderBgInput}[kind];input?.click();}
function beginLocalWearableImport(kind){const model=preferredSelectedModel(false);if(!model)return showToast('请先在左侧选择要适配装扮的人物。');state.pendingWearableTargetId=model.id;state.pendingWearableKind=kind;triggerPicker(kind,true);}

// ----- Commands and editor bindings -----
ui.btnImportModel.addEventListener('click',()=>triggerPicker('model',false));
ui.btnImportStage.addEventListener('click',()=>triggerPicker('stage',true));
ui.btnImportMotion.addEventListener('click',()=>{if(!availableMotionModels(false).length)return showToast('请先导入人物模型。');triggerPicker('motion',true);});
ui.btnImportCamera.addEventListener('click',()=>triggerPicker('camera',true));
ui.btnImportAudio.addEventListener('click',()=>triggerPicker('audio',false));
ui.btnImportHdri.addEventListener('click',()=>triggerPicker('hdri',false));
ui.btnLoadScene.addEventListener('click',()=>triggerPicker('scene',false));
ui.btnSaveScene.addEventListener('click',saveScene);
ui.btnExportModel?.addEventListener('click',exportSelectedModel);
ui.btnNewFolder.addEventListener('click',()=>{const f=createFolder(`Folder ${state.nextFolderId}`);updateSceneTree();selectNode('folder',f.id);});
ui.btnFit.addEventListener('click',()=>{const r=activeObject();if(r)fitObject(objectTransformNode(r));else showToast('请先在左侧选择要聚焦的对象。');});

ui.libraryTabs?.addEventListener('click',e=>{const b=e.target.closest('button[data-library-category]');if(!b)return;state.libraryCategory=b.dataset.libraryCategory||'model';renderLibrary();});
ui.btnLibraryRefresh?.addEventListener('click',requestLibraryRefresh);
ui.btnLibraryPermission?.addEventListener('click',()=>{if(window.AndroidBridge?.requestLibraryPermission)window.AndroidBridge.requestLibraryPermission();else showToast('仅 Android APK 支持目录授权。');});

ui.modelInput.addEventListener('change',()=>importObjectFiles(ui.modelInput.files,'model',[]));
ui.costumeInput?.addEventListener('change',()=>importObjectFiles(ui.costumeInput.files,'costume',[]));
ui.hairInput?.addEventListener('change',()=>importObjectFiles(ui.hairInput.files,'hair',[]));
ui.stageInput.addEventListener('change',()=>importObjectFiles(ui.stageInput.files,'stage',[]));
ui.accessoryInput.addEventListener('change',()=>importObjectFiles(ui.accessoryInput.files,'accessory',[]));
ui.motionInput.addEventListener('change',()=>importMotionFiles(ui.motionInput.files,resolveMotionTarget(null,{quiet:false,requireMmd:true}),[]));
ui.cameraInput.addEventListener('change',()=>importCameraFiles(ui.cameraInput.files,[]));
ui.audioInput.addEventListener('change',()=>importAudioFile(ui.audioInput.files?.[0],null));
ui.hdriInput.addEventListener('change',()=>importHdriFile(ui.hdriInput.files?.[0],null));
ui.sceneInput.addEventListener('change',()=>importSceneFile(ui.sceneInput.files?.[0]));
ui.renderBgInput?.addEventListener('change',()=>importOfflineBackground(ui.renderBgInput.files?.[0],null));

ui.activeVisible.addEventListener('change',()=>{const r=selectedObject();if(r){r.visibleWanted=ui.activeVisible.checked;applyVisibility();}});
ui.btnDeleteObject.addEventListener('click',()=>deleteRecord(selectedObject()));
ui.scale.addEventListener('input',()=>{const r=selectedObject();if(!r)return;r.userScale=num(ui.scale,1);r.root.scale.copy(r.baseScale).multiplyScalar(r.userScale);ui.scaleOut.value=r.userScale.toFixed(3);markBakeDirty();});
ui.btnResetScale.addEventListener('click',()=>{const r=selectedObject();if(!r)return;r.userScale=1;r.root.scale.copy(r.baseScale);updateTransformUI(r);markBakeDirty();});
for(const id of ['posX','posY','posZ'])ui[id].addEventListener('input',()=>{const r=selectedObject();if(!r)return;objectTransformNode(r).position.set(num(ui.posX),num(ui.posY),num(ui.posZ));markBakeDirty();});
ui.btnResetPosition.addEventListener('click',()=>{const r=selectedObject();if(!r)return;objectTransformNode(r).position.set(0,0,0);updateTransformUI(r);markBakeDirty();});
for(const id of ['rotX','rotY','rotZ'])ui[id].addEventListener('input',()=>{const r=selectedObject();if(!r)return;objectTransformNode(r).rotation.set(deg(num(ui.rotX)),deg(num(ui.rotY)),deg(num(ui.rotZ)));markBakeDirty();});
ui.btnResetRotation.addEventListener('click',()=>{const r=selectedObject();if(!r)return;objectTransformNode(r).rotation.set(0,0,0);updateTransformUI(r);markBakeDirty();});
ui.objectFolder.addEventListener('change',()=>{const r=selectedObject();if(!r)return;assignObjectFolder(r,ui.objectFolder.value);updateSceneTree();syncInspector();});
ui.btnRepairVisibility.addEventListener('click',()=>{const r=selectedObject();if(!r)return;const t=refreshCompatMaterialTextures(r.root);const n=repairRenderable(r.root,modelReceivesSelfShadow(r));renderer.render(scene,camera);showToast(`已重置可见性：Mesh ${n.meshCount} · Material ${n.materialCount} · 纹理刷新 ${t}`);});

ui.btnApplyCostumeLibrary?.addEventListener('click',()=>applyWearableLibrary('costume'));
ui.btnApplyHairLibrary?.addEventListener('click',()=>applyWearableLibrary('hair'));
ui.btnApplyAccessoryLibrary?.addEventListener('click',()=>applyWearableLibrary('accessory'));
ui.btnImportCostumeLocal?.addEventListener('click',()=>beginLocalWearableImport('costume'));
ui.btnImportHairLocal?.addEventListener('click',()=>beginLocalWearableImport('hair'));
ui.btnImportAccessoryLocal?.addEventListener('click',()=>beginLocalWearableImport('accessory'));
ui.btnShowAllCostume?.addEventListener('click',()=>{const r=selectedObject();if(r?.category==='model')setModelPartKindVisible(r,'costume',true);});
ui.btnHideAllCostume?.addEventListener('click',()=>{const r=selectedObject();if(r?.category==='model')setModelPartKindVisible(r,'costume',false);});
ui.btnShowAllHair?.addEventListener('click',()=>{const r=selectedObject();if(r?.category==='model')setModelPartKindVisible(r,'hair',true);});
ui.btnHideAllHair?.addEventListener('click',()=>{const r=selectedObject();if(r?.category==='model')setModelPartKindVisible(r,'hair',false);});
ui.btnShowAllAccessory?.addEventListener('click',()=>{const r=selectedObject();if(r?.category==='model')setModelPartKindVisible(r,'accessory',true);});
ui.btnHideAllAccessory?.addEventListener('click',()=>{const r=selectedObject();if(r?.category==='model')setModelPartKindVisible(r,'accessory',false);});
ui.btnResetModelParts?.addEventListener('click',()=>{const r=selectedObject();if(r?.category==='model')resetModelPartVisibility(r);});
ui.expressionPreset?.addEventListener('change',()=>{const r=selectedObject();if(!r)return;r.expressionPresetKey=ui.expressionPreset.value||'neutral';syncExpressionPresetUI(r);});
ui.expressionPresetStrength?.addEventListener('input',()=>{ui.expressionPresetStrengthOut.value=num(ui.expressionPresetStrength,1).toFixed(2);});
ui.btnApplyExpressionPreset?.addEventListener('click',()=>{const r=selectedObject();if(!r)return;applyExpressionPreset(r,ui.expressionPreset.value||'neutral',num(ui.expressionPresetStrength,1));showToast(`已应用表情预设：${ui.expressionPreset.selectedOptions[0]?.textContent||'Neutral'}`);});
ui.btnClearExpression?.addEventListener('click',()=>{const r=selectedObject();if(!r)return;applyExpressionPreset(r,'neutral',1);showToast('已恢复中性表情。');});

ui.morphSelect.addEventListener('change',()=>updateMorphUI(selectedObject()));
ui.morphWeight.addEventListener('input',()=>{const r=selectedObject(),name=ui.morphSelect.value;if(!r||!name)return;const w=num(ui.morphWeight);setMorph(r.root,name,w);ui.morphOut.value=w.toFixed(2);markBakeDirty();});
ui.btnResetMorph.addEventListener('click',()=>{const r=selectedObject();if(!r)return;r.morphs.forEach(n=>setMorph(r.root,n,0));updateMorphUI(r);markBakeDirty();});

function changeEyes(){const r=selectedObject();if(!r)return;removeBoneOverrides(r);r.eyeRotation={pitch:num(ui.eyePitch),left:num(ui.eyePitchLeft),right:num(ui.eyePitchRight)};applyBoneOverrides(r);updateEyePitchOutputs(r,false);markBakeDirty();}
for(const id of ['eyePitch','eyePitchLeft','eyePitchRight'])ui[id].addEventListener('input',changeEyes);
function changeEyeBoneSelection(){const r=selectedObject();if(!r)return;removeBoneOverrides(r);r.eyeBones={left:ui.eyeBoneLeftSelect.value||null,right:ui.eyeBoneRightSelect.value||null};applyBoneOverrides(r);updateEyeUI(r);markBakeDirty();}
ui.eyeBoneLeftSelect.addEventListener('change',changeEyeBoneSelection);ui.eyeBoneRightSelect.addEventListener('change',changeEyeBoneSelection);
ui.btnAutoEyeBones.addEventListener('click',()=>{const r=selectedObject();if(!r)return;removeBoneOverrides(r);r.eyeBones=findEyeBones(r);applyBoneOverrides(r);updateEyeUI(r);showToast(`眼球骨骼：${r.eyeBones.left||'未识别'} / ${r.eyeBones.right||'未识别'}`);});
ui.btnResetEyes.addEventListener('click',()=>{const r=selectedObject();if(!r)return;removeBoneOverrides(r);r.eyeRotation={pitch:0,left:0,right:0};applyBoneOverrides(r);updateEyeUI(r);markBakeDirty();});

function changeBone(){const r=selectedObject(),name=selectedBoneName();if(!r||!name)return;removeBoneOverrides(r);const o=getBoneOverride(r,name,true);o.pos=[num(ui.bonePosX),num(ui.bonePosY),num(ui.bonePosZ)];o.rot=[num(ui.boneRotX),num(ui.boneRotY),num(ui.boneRotZ)];applyBoneOverrides(r);markBakeDirty();}
for(const id of ['bonePosX','bonePosY','bonePosZ','boneRotX','boneRotY','boneRotZ'])ui[id].addEventListener('input',changeBone);
ui.btnResetBone.addEventListener('click',()=>{const r=selectedObject(),name=selectedBoneName();if(!r||!name)return;removeBoneOverrides(r);delete r.boneOverrides[name];applyBoneOverrides(r);syncBoneUI(r,name);markBakeDirty();});

ui.ikGlobal.addEventListener('change',()=>helper.enable('ik',ui.ikGlobal.checked));
function updateSelectedIk(){const r=selectedObject(),i=selectedIkIndex(),ik=r?.iks?.[i];if(!ik)return;ik._mmdroidEnabled=ui.ikEnabled.checked;ik.iteration=Math.max(1,Math.round(num(ui.ikIteration,1)));const mn=Number(ui.ikMinAngle.value),mx=Number(ui.ikMaxAngle.value);if(Number.isFinite(mn))ik.minAngle=deg(mn);else delete ik.minAngle;if(Number.isFinite(mx))ik.maxAngle=deg(mx);else delete ik.maxAngle;applyIkFlags(ik);syncIkUI(r,i);}
ui.ikEnabled.addEventListener('change',updateSelectedIk);ui.ikIteration.addEventListener('input',updateSelectedIk);ui.ikMinAngle.addEventListener('change',updateSelectedIk);ui.ikMaxAngle.addEventListener('change',updateSelectedIk);ui.ikLinkSelect.addEventListener('change',()=>syncIkLinkUI(selectedObject(),selectedIkIndex()));ui.ikLinkEnabled.addEventListener('change',()=>{const r=selectedObject(),ik=r?.iks?.[selectedIkIndex()],link=ik?.links?.[Number(ui.ikLinkSelect.value)||0];if(link){link._mmdroidUserEnabled=ui.ikLinkEnabled.checked;applyIkFlags(ik);}});

function editSelectedMaterial(){const r=selectedObject(),i=selectedMaterialIndex(),m=r?.materials?.[i];if(!m)return;const mc=m.color||safeMaterialProp(m,'diffuse',null);if(mc)mc.set(ui.matColor.value);if(m.emissive)m.emissive.set(ui.matEmissive.value);const op=num(ui.matOpacity,1);m.userData=m.userData||{};m.userData._mmdroidAlphaModeOverride=ui.matAlphaMode.value||'auto';m.userData._mmdroidAlphaCutoff=num(ui.matAlphaCutoff,.08);setMaterialOpacity(m,op);applyMaterialAlphaMode(m,'auto',op,m.userData._mmdroidTextureAlpha||null);if(m.userData._mmdroidAlphaModeOverride==='auto'){m.transparent=!!m.transparent;}else{m.transparent=m.userData._mmdroidResolvedAlphaMode!=='opaque'&&m.userData._mmdroidResolvedAlphaMode!=='cutout';}if('wireframe'in m)m.wireframe=ui.matWireframe.checked;m.side=ui.matDoubleSide.checked?THREE.DoubleSide:THREE.FrontSide;if('roughness'in m)m.roughness=num(ui.matRoughness,.5);if('metalness'in m)m.metalness=num(ui.matMetalness,0);m.userData.outlineParameters={...(m.userData.outlineParameters||{}),visible:ui.matOutlineVisible.checked,thickness:num(ui.matOutlineThickness,.003)};captureMmdMorphBase(m);m.needsUpdate=true;syncMaterialUI(r,i);markBakeDirty();}
for(const id of ['matColor','matEmissive','matOpacity','matAlphaMode','matAlphaCutoff','matTransparent','matDepthWrite','matDoubleSide','matWireframe','matRoughness','matMetalness','matOutlineVisible','matOutlineThickness'])ui[id].addEventListener('input',editSelectedMaterial);
ui.matTextureEnabled.addEventListener('change',()=>{const r=selectedObject(),i=selectedMaterialIndex(),m=r?.materials?.[i];if(!m)return;if(ui.matTextureEnabled.checked)m.map=m._mmdroidSavedMap||r.materialOriginal[i]?.map||null;else{if(m.map)m._mmdroidSavedMap=m.map;m.map=null;}m.needsUpdate=true;syncMaterialUI(r,i);});
ui.btnResetMaterial.addEventListener('click',()=>{const r=selectedObject(),i=selectedMaterialIndex(),m=r?.materials?.[i],orig=r?.materialOriginal?.[i];if(!m||!orig)return;applyMaterialState(m,orig);m.map=orig.map||null;m.userData._mmdroidAlphaModeOverride='auto';applyMaterialAlphaMode(m,'auto',getMaterialOpacity(m,1),m.userData?._mmdroidTextureAlpha||null);captureMmdMorphBase(m);m.needsUpdate=true;syncMaterialUI(r,i);markBakeDirty();});

ui.attachModel.addEventListener('change',()=>refreshAttachBoneOptions());
ui.btnApplyAttachment.addEventListener('click',()=>{const r=selectedObject();if(!r)return;attachWearable(r,ui.attachModel.value,ui.attachBone.value);syncInspector();markBakeDirty();});
ui.btnDetachAttachment?.addEventListener('click',()=>{const r=selectedObject();if(!r)return;detachWearable(r);syncInspector();markBakeDirty();});
ui.btnApplyFolder.addEventListener('click',()=>{const f=selectedFolder();if(!f)return;f.name=ui.folderName.value.trim()||f.name;f.group.name=`Folder:${f.name}`;setFolderParent(f,ui.folderParent.value||null);updateSceneTree();updateInspectorHeader();});
ui.btnDeleteFolder.addEventListener('click',()=>deleteFolder(selectedFolder()));

ui.physicsEnabled.addEventListener('change',async()=>{const r=selectedObject();if(!r)return;r.physics.enabled=ui.physicsEnabled.checked;await rebuildMmdHelper(r,true);syncPhysicsUI(r);});
ui.physicsProfile.addEventListener('change',()=>{const r=selectedObject();if(r)r.physics.profile=ui.physicsProfile.value;});
ui.gravity.addEventListener('input',()=>{const r=selectedObject();if(r)r.physics.gravity=num(ui.gravity,-98);ui.gravityOut.value=num(ui.gravity,-98).toFixed(1);});
ui.physicsSteps.addEventListener('input',()=>{const r=selectedObject();if(r)r.physics.steps=Math.round(num(ui.physicsSteps,3));ui.physicsStepsOut.value=String(Math.round(num(ui.physicsSteps,3)));});
ui.btnRebuildPhysics.addEventListener('click',async()=>{const r=selectedObject();if(!r)return;r.physics.enabled=ui.physicsEnabled.checked;r.physics.profile=ui.physicsProfile.value;r.physics.gravity=num(ui.gravity,-98);r.physics.steps=Math.round(num(ui.physicsSteps,3));await rebuildMmdHelper(r,true);syncPhysicsUI(r);});
ui.motionTargetModel?.addEventListener('change',()=>{state.motionTargetId=ui.motionTargetModel.value||null;syncMotionTargetUI();syncMotionUI(resolveMotionTarget(null,{quiet:true,requireMmd:false}));});
ui.btnUseSelectedAsMotionTarget?.addEventListener('click',()=>{const rec=preferredSelectedModel(false);if(!rec)return showToast('请先在左侧场景树中选择一个人物。');state.motionTargetId=rec.id;syncMotionTargetUI();syncMotionUI(rec);showToast(`动作目标已切换到 ${rec.name}`);});
ui.btnRemoveMotion.addEventListener('click',()=>removeMotion(resolveMotionTarget(null,{quiet:false,requireMmd:false})||selectedObject()));
ui.outputOrientation?.addEventListener('change',()=>offlineResolutionChanged());

ui.smoothPreset?.addEventListener('change',()=>{const cfg=smoothPresets[ui.smoothPreset.value];if(cfg){ui.smoothAngle.value=String(cfg.angle);ui.smoothStrength.value=String(cfg.strength);}ui.smoothAngleOut.value=`${Math.round(num(ui.smoothAngle,105))}°`;ui.smoothStrengthOut.value=num(ui.smoothStrength,.78).toFixed(2);});
ui.smoothAngle?.addEventListener('input',()=>{ui.smoothPreset.value='custom';ui.smoothAngleOut.value=`${Math.round(num(ui.smoothAngle,105))}°`;});
ui.smoothStrength?.addEventListener('input',()=>{ui.smoothPreset.value='custom';ui.smoothStrengthOut.value=num(ui.smoothStrength,.78).toFixed(2);});
ui.btnApplySmooth?.addEventListener('click',()=>{const r=selectedObject();if(!r)return;applySmoothToRecord(r,ui.smoothPreset.value,num(ui.smoothAngle,105),num(ui.smoothStrength,.78),true);syncInspector();});
ui.btnRestoreNormals?.addEventListener('click',()=>{const r=selectedObject();if(!r)return;applySmoothToRecord(r,'source',0,0,true);syncInspector();});
ui.textureQuality?.addEventListener('change',()=>applyTextureQualitySettings(true));
ui.textureSharpness?.addEventListener('input',()=>applyTextureQualitySettings(false));

ui.cameraEnabled.addEventListener('change',()=>{helper.enable('cameraAnimation',ui.cameraEnabled.checked);controls.enabled=!ui.cameraEnabled.checked||!state.cameraAnimation;});
ui.fov.addEventListener('input',()=>{camera.fov=num(ui.fov,42);camera.updateProjectionMatrix();ui.fovOut.value=`${Math.round(camera.fov)}°`;});
for(const id of ['camTargetX','camTargetY','camTargetZ'])ui[id].addEventListener('input',()=>{controls.target.set(num(ui.camTargetX),num(ui.camTargetY),num(ui.camTargetZ));controls.update();});
ui.volume.addEventListener('input',()=>{audio.volume=num(ui.volume,.8);ui.volumeOut.value=audio.volume.toFixed(2);});


function syncRenderPipelineUI(){
  state.renderPipeline=ui.renderPipeline.value||'mmdPhong';
  state.skinPreset=ui.skinPreset?.value||state.skinPreset||'natural';
  state.skinPresetStrength=clamp(num(ui.skinPresetStrength,state.skinPresetStrength??.70),0,1);
  state.toonBands=Math.max(2,Math.min(8,Math.round(num(ui.toonBands,4))));
  ui.toonBandsOut.value=String(state.toonBands);if(ui.skinPresetStrengthOut)ui.skinPresetStrengthOut.value=state.skinPresetStrength.toFixed(2);
  const sp=currentSkinPreset();if(ui.skinPresetInfo)ui.skinPresetInfo.textContent=`${sp.label} · 粗糙度 ${sp.roughness.toFixed(2)} · 高光 ${sp.specular.toFixed(2)} · 清漆 ${sp.clearcoat.toFixed(2)} · 强度 ${state.skinPresetStrength.toFixed(2)}`;
  updateAlphaResponseUniforms();
  const desc={
    mmdPhong:'Studio Blinn–Phong Character：仅直接光照的经典角色着色，传统高光、无 IBL，作为稳定基准。',
    blenderPbr:'GGX IBL Principled PBR：参考 HS2/AI 的材质分工思路，皮肤采用贴图优先、低白化 IBL、宽 GGX 高光与轻微次表面色散。',
    skinOily:'Dual-Lobe Dermal Specular：HS2 风格皮肤底层 + 受控皮脂双波瓣；保留肤色纹理，不再用强白色清漆覆盖。',
    skinSilicone:'Polymer SSS Approximation：HS2 风格贴图底色 + 更宽高光、柔和 Sheen 与较强散射，强调柔软聚合物而非白色塑料。',
    toonClassic:'Multi-Band Cel NPR：离散多级明暗、冷暖阴影与硬高光。',
    genshin:'Layered Anime NPR：皮肤/头发/衣料采用不同的深影、中影、亮面和角色高光层。',
    unlit:'Unlit Diagnostic：完全绕过灯光和 IBL，只显示贴图/透明/几何，用于排查资源问题。'
  };ui.renderPipelineInfo.textContent=desc[state.renderPipeline]||'';syncToneMappingForPipeline();
}
ui.renderPipeline.addEventListener('change',()=>{syncRenderPipelineUI();if(state.renderPipeline==='genshin'||state.renderPipeline==='toonClassic'){ui.outlineEnabled.checked=true;state.outlineEnabled=true;}else if(pipelineUsesPhysical()){ui.outlineEnabled.checked=false;state.outlineEnabled=false;}syncLightingFromUI(false);const n=rebuildAllMmdMaterials();syncEnvironmentFromUI();showToast(`已切换渲染管线：${ui.renderPipeline.selectedOptions[0]?.textContent||state.renderPipeline} · 已自动校准灯光能量 · 重建 ${n} 个材质`);});
ui.skinPreset?.addEventListener('change',()=>{syncRenderPipelineUI();const n=rebuildAllMmdMaterials();showToast(`皮肤预设：${ui.skinPreset.selectedOptions[0]?.textContent||state.skinPreset} · 重建 ${n} 个材质`);});
ui.skinPresetStrength?.addEventListener('input',()=>{syncRenderPipelineUI();clearTimeout(ui.skinPresetStrength._timer);ui.skinPresetStrength._timer=setTimeout(()=>rebuildAllMmdMaterials(),80);});
ui.toonBands.addEventListener('input',()=>{syncRenderPipelineUI();if(state.renderPipeline==='toonClassic'||state.renderPipeline==='genshin')rebuildAllMmdMaterials();});
for(const id of ['clothAlphaBoost','hosieryOpacity'])ui[id]?.addEventListener('input',()=>{updateAlphaResponseUniforms();});
ui.btnRebuildMaterials.addEventListener('click',()=>{syncRenderPipelineUI();const n=rebuildAllMmdMaterials();showToast(`已重建 ${n} 个 MMD 材质并重新应用透明策略。`);});
for(const id of ['keyColor','keyLight','lightAz','lightEl','fillColor','fillLight','fillAz','fillEl','rimColor','rimLight','rimAz','rimEl','ambient','ambientSky','ambientGround','exposure'])ui[id].addEventListener('input',()=>syncLightingFromUI(true));
for(const id of ['shadows','characterSelfShadow','shadowMapSize','shadowBias','shadowNormalBias','shadowRadius'])ui[id].addEventListener('input',()=>syncShadowFromUI(true));
ui.outlineEnabled.addEventListener('change',()=>{state.outlineEnabled=ui.outlineEnabled.checked;});ui.btnBakeShadow.addEventListener('click',()=>setShadowFrozen(true));ui.btnRealtimeShadow.addEventListener('click',()=>setShadowFrozen(false));ui.btnRefreshBake.addEventListener('click',refreshShadowBake);
for(const id of ['postEnabled','bloomEnabled','bloomStrength','bloomThreshold','bloomRadius','ssaoEnabled','ssaoRadius','ssaoMin','ssaoMax','dofEnabled','dofFocus','dofAperture','dofMaxBlur'])ui[id].addEventListener('input',syncPostFromUI);
for(const id of ['offlineSkinStrength','offlineKey','offlineFill','offlineRim','offlineAmbient','offlineIbl','offlineExposure','offlineShadowRadius'])ui[id]?.addEventListener('input',syncOfflineOutputs);
ui.offlineResolution?.addEventListener('change',offlineResolutionChanged);ui.btnCopyRealtimeOffline?.addEventListener('click',copyRealtimeToOffline);ui.btnRenderBgPick?.addEventListener('click',()=>triggerPicker('renderBackground',false));ui.btnRenderBgClear?.addEventListener('click',()=>{releaseOfflineBackground();showToast('已清除 2D 输出背景。');});ui.btnOfflineRender?.addEventListener('click',renderOfflineReference);
for(const id of ['bgColor','floorColor','floorRoughness','floorMetalness','gridVisible','floorVisible','fogEnabled','fogColor','fogDensity','hdriBackground','hdriIntensity'])ui[id].addEventListener('input',syncEnvironmentFromUI);
ui.builtinEnvironment?.addEventListener('change',()=>{state.builtinEnvironment=ui.builtinEnvironment.value||'solid';if(state.builtinEnvironment!=='solid')ui.hdriBackground.checked=false;applyBuiltinEnvironmentPreset(state.builtinEnvironment);syncEnvironmentFromUI();showToast(`环境：${ui.builtinEnvironment.selectedOptions[0]?.textContent||state.builtinEnvironment}`);});
ui.loop.addEventListener('change',syncLoopModes);

ui.btnPlay.addEventListener('click',()=>setPlaying(!state.playing));ui.btnStop.addEventListener('click',stopAll);ui.btnAddKey.addEventListener('click',addKeyframe);ui.btnDeleteKey.addEventListener('click',deleteCurrentKey);ui.btnPrevKey.addEventListener('click',()=>jumpKey(-1));ui.btnNextKey.addEventListener('click',()=>jumpKey(1));ui.timelineZoom.addEventListener('input',drawTimeline);ui.timelineFps.addEventListener('change',drawTimeline);ui.timelineCanvas.addEventListener('pointerdown',timelinePointer);
const timelineWrap=ui.timelineCanvas.parentElement;timelineWrap.addEventListener('scroll',()=>{ui.timelineTrackLabels.scrollTop=timelineWrap.scrollTop;});ui.timelineTrackLabels.addEventListener('scroll',()=>{timelineWrap.scrollTop=ui.timelineTrackLabels.scrollTop;});

function setResourcePanelVisible(show){if(!ui.resourcePanel)return;ui.resourcePanel.classList.toggle('hidden-resource',!show);ui.resourcePanel.setAttribute('aria-hidden',show?'false':'true');ui.btnResources?.classList.toggle('active-tool',show);}
function toggleResourcePanel(){setResourcePanelVisible(ui.resourcePanel?.classList.contains('hidden-resource'));}
function togglePanel(panel,tab,side,forceHidden=null){if(!panel||!tab)return;const hidden=forceHidden===null?panel.classList.toggle('hidden-panel'):!!forceHidden;panel.classList.toggle('hidden-panel',hidden);tab.classList.toggle('panel-is-hidden',hidden);const icons={left:hidden?'›':'‹',right:hidden?'‹':'›',top:hidden?'⌄':'⌃',bottom:hidden?'⌃':'⌄'};tab.textContent=icons[side];if(side==='top'&&hidden)setResourcePanelVisible(false);}
ui.btnResources?.addEventListener('click',toggleResourcePanel);
ui.btnTransformMove.addEventListener('click',()=>{setTransformEdit(true);setTransformMode('translate');});
ui.btnTransformRotate.addEventListener('click',()=>{setTransformEdit(true);setTransformMode('rotate');});
ui.btnTransformReset.addEventListener('click',resetTransformTarget);
ui.btnToggleBones.addEventListener('click',()=>{const r=selectedObject();if(!r||r.category!=='model')return showToast('请先在场景树中选择人物模型。');const key=`bones:${r.id}`;if(state.expandedBoneModels.has(r.id)){state.expandedBoneModels.delete(r.id);state.collapsed.add(key);}else{state.expandedBoneModels.add(r.id);state.collapsed.delete(key);}updateSceneTree();updateTransformToolbar();});

ui.leftTab.addEventListener('click',()=>{const show=ui.scenePanel.classList.contains('hidden-panel');if(show&&ui.renderPanel&&!ui.renderPanel.classList.contains('hidden-panel'))togglePanel(ui.renderPanel,ui.renderTab,'left',true);togglePanel(ui.scenePanel,ui.leftTab,'left');});ui.renderTab?.addEventListener('click',()=>{const show=ui.renderPanel.classList.contains('hidden-panel');if(show&&!ui.scenePanel.classList.contains('hidden-panel'))togglePanel(ui.scenePanel,ui.leftTab,'left',true);togglePanel(ui.renderPanel,ui.renderTab,'left');});ui.rightTab.addEventListener('click',()=>togglePanel(ui.inspectorPanel,ui.rightTab,'right'));ui.topTab.addEventListener('click',()=>togglePanel(ui.topbar,ui.topTab,'top'));ui.bottomTab.addEventListener('click',()=>togglePanel(ui.transport,ui.bottomTab,'bottom'));
ui.btnSceneExpand.addEventListener('click',()=>{state.collapsed.clear();updateSceneTree();});ui.btnSceneCollapse.addEventListener('click',()=>{state.collapsed=new Set(state.allTreeKeys);updateSceneTree();});

document.addEventListener('input',markRenderDirty,true);document.addEventListener('change',markRenderDirty,true);document.addEventListener('click',markRenderDirty,true);
window.addEventListener('resize',()=>{markRenderDirty();const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);outlineEffect.setSize(w,h);composer.setSize(w,h);ssaoPass.setSize(w,h);bokehPass.setSize(w,h);const pr=renderer.getPixelRatio?.()||1;textureDetailPass.uniforms.texelSize.value.set(1/Math.max(1,w*pr),1/Math.max(1,h*pr));drawTimeline();});
window.addEventListener('error',e=>{console.error(e.error||e.message);showToast(`运行错误：${e.message||'未知错误'}`,5000);});window.addEventListener('unhandledrejection',e=>{console.error(e.reason);});audio.addEventListener('ended',()=>{if(!ui.loop.checked)setPlaying(false);});

function animate(now){requestAnimationFrame(animate);const delta=Math.min(.1,Math.max(0,(now-state.lastNow)/1000));state.lastNow=now;let needsRender=state.playing||state.renderDirty;if(state.playing){removeAllBoneOverrides();try{helper.update(delta);}catch(err){console.warn('MMD helper update',err);}for(const rec of state.objects)if(rec.externalMixer)rec.externalMixer.update(delta);state.time+=delta;if(state.duration>0&&state.time>=state.duration){if(ui.loop.checked){state.time%=state.duration;seekAll(state.time);}else{state.time=state.duration;setPlaying(false);}}applyEditorKeys(state.time);applyAllMmdExtraMorphs();applyAllBoneOverrides();syncAllWearables();updateTimeUI();if(now-state.lastTimelineDraw>120){drawTimeline();state.lastTimelineDraw=now;}}controls.update();if(needsRender){if(state.outlineEnabled)outlineEffect.render(scene,camera);else if(ui.postEnabled.checked||antiBandingPass.enabled||textureDetailPass.enabled)composer.render();else renderer.render(scene,camera);state.renderDirty=false;state.lastRenderedAt=now;}}

setResourcePanelVisible(false);syncRenderPipelineUI();syncOfflineOutputs();offlineResolutionChanged();if(ui.renderPanel&&ui.renderTab){ui.renderPanel.classList.add('hidden-panel');ui.renderTab.classList.add('panel-is-hidden');ui.renderTab.textContent='›';}applyTextureQualitySettings(false);syncLightingFromUI(false);syncShadowFromUI(false);syncEnvironmentFromUI();syncPostFromUI();state.outlineEnabled=ui.outlineEnabled.checked;updateCameraUI();updateSceneTree();syncMotionTargetUI();selectNode('scene');updateTransformToolbar();recomputeDuration();renderLibrary();setStatus(window.AndroidBridge?'就绪 · mmddata 资源库':'就绪 · 浏览器文件选择');if(window.AndroidBridge?.uiReady)window.AndroidBridge.uiReady();requestAnimationFrame(animate);
