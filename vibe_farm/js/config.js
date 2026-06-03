const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const T = 24;            // tile size
// ── 世界（约为原来的两倍）与相机视口 ──────────────────
const COLS = 48;         // 世界宽（原 34）
const ROWS = 34;         // 世界高（原 24）   48×34 = 原 816 格的 2 倍
const WORLD_W = T * COLS; // 1152
const WORLD_H = T * ROWS; // 816
const VIEW_COLS = 34;    // 屏幕可见宽
const VIEW_ROWS = 24;    // 屏幕可见高
const VW = T * VIEW_COLS; // 816 画布宽
const VH = T * VIEW_ROWS; // 576 画布高
const W = VW, H = VH;    // 兼容旧引用（清屏用屏幕尺寸）
canvas.width  = VW;
canvas.height = VH;
const cam = { x:0, y:0 }; // 相机左上角（世界坐标），平滑跟随兔叽

// ── 可复用位置（生成地图前先定义，方便清出空地）──────
const GARDEN   = {x:31*T, y:2*T, w:7*T, h:4*T};
const GARDEN2  = {x:4*T,  y:28*T, w:7*T, h:4*T};
const GARDENS  = [GARDEN, GARDEN2];
const FOUNTAIN = {x:18*T, y:13*T, cycle:260, spray:90};
const SEESAW   = {x:7*T,  y:4.6*T, active:0, cooldown:0, guest:null, seated:false, sheepSeated:false, playT:0};
const OCTOPUS  = {x:24*T, y:4*T, active:0, cooldown:0, seated:false, sheepSeated:false, angle:0};
const TRAMPOLINE = {x:13*T, y:3*T, active:0, cooldown:0, seated:false, sheepSeated:false, phase:0};
const BUBBLE_RIDE = {x:39*T, y:8*T, active:0, cooldown:0, seated:false, sheepSeated:false, bubble:null};
const NPC_RIDE_SPOTS = [
  {name:'跷跷板', cx:SEESAW.x+50,     cy:SEESAW.y+8,       triggerR:130, playT:170, bubbles:['荡来荡去','好好玩！','嘿！哈！']},
  {name:'蹦蹦云', cx:TRAMPOLINE.x+52, cy:TRAMPOLINE.y+24,  triggerR:130, playT:150, bubbles:['蹦高啦！','嘻嘻！','好弹~']},
  {name:'章鱼机', cx:OCTOPUS.x+10,    cy:OCTOPUS.y+30,     triggerR:140, playT:190, bubbles:['旋转！','晕晕的','好刺激！']},
  {name:'泡泡机', cx:BUBBLE_RIDE.x+7, cy:BUBBLE_RIDE.y+34, triggerR:120, playT:160, bubbles:['泡泡！','好漂亮','好圆圆']},
];
const CAMPFIRE = {x:8*T, y:7*T};
const NESTS = {
  dog:     {x:4*T,  y:18*T},
  cat:     {x:41*T, y:17*T},
  chicken: {x:34*T, y:27*T},
};

// ── 确定性随机（保证地图布局每次一致）────────────────
let _seed = Date.now() & 0x7fffffff;
function rnd(){ _seed = (_seed*1103515245 + 12345) & 0x7fffffff; return _seed / 0x7fffffff; }
function ri(n){ return Math.floor(rnd()*n); }


// ── 日夜周期 ─────────────────────────────────────────────
const DAY_CYCLE = 7200;
