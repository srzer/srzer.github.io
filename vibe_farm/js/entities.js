const CARROTS = [
  {x:9*T,    y:7*T,   eaten:false},
  {x:25*T,   y:8*T,   eaten:false},
  {x:38*T,   y:21*T,  eaten:false},
  {x:6*T,    y:25*T,  eaten:false},
  {x:27*T,   y:29*T,  eaten:false},
  {x:44*T,   y:24*T,  eaten:false},
  {x:21*T,   y:16*T,  eaten:false},
  {x:36*T,   y:11*T,  eaten:false},
];
let carrotSpawnT = 360;

const GRASS_PATCHES = [
  {x:23*T,   y:10*T,  eaten:false, regrow:0},
  {x:30*T,   y:15*T,  eaten:false, regrow:0},
  {x:35*T,   y:18*T,  eaten:false, regrow:0},
  {x:8*T,    y:23*T,  eaten:false, regrow:0},
  {x:14*T,   y:27*T,  eaten:false, regrow:0},
  {x:26*T,   y:5*T,   eaten:false, regrow:0},
  {x:44*T,   y:28*T,  eaten:false, regrow:0},
  {x:13*T,   y:17*T,  eaten:false, regrow:0},
];

const FLOATS = [];
const EFFECTS = [];
const POOPS = [];
const EGGS = [];

const CRITTERS = [
  {type:'dog',     name:'小狗', coat:'brown', x:NESTS.dog.x+T,    y:NESTS.dog.y+T,    dir:1, dx:0.35,  dy:0,     timer:40,  talkT:20,  bubble:'', bubT:0, step:0, poopEvery:520},
  {type:'dog',     name:'白狗', coat:'white', x:NESTS.dog.x+3*T,  y:NESTS.dog.y,      dir:0, dx:-0.32, dy:0,     timer:60,  talkT:50,  bubble:'', bubT:0, step:0},
  {type:'cat',     name:'小猫',               x:NESTS.cat.x,      y:NESTS.cat.y,      dir:0, dx:-0.3,  dy:0.15,  timer:80,  talkT:55,  bubble:'', bubT:0, step:0, poopEvery:500},
  {type:'bee',     name:'蜜叽',               x:33*T,             y:4*T,              dir:1, dx:0.55,  dy:0.15,  timer:20,  talkT:35,  bubble:'', bubT:0, phase:0,   step:0},
  {type:'bee',     name:'小蜜蜂',             x:10*T,             y:29*T,             dir:1, dx:0.48,  dy:-0.08, timer:75,  talkT:90,  bubble:'', bubT:0, phase:1.7, step:0},
  {type:'chicken', name:'小鸡',               x:NESTS.chicken.x,  y:NESTS.chicken.y,  dir:1, dx:0.28,  dy:0,     timer:110, talkT:75,  bubble:'', bubT:0, step:0, poopEvery:620, eggEvery:500},
  {type:'chicken', name:'黑鸡', coat:'black', x:NESTS.chicken.x+2*T, y:NESTS.chicken.y, dir:0, dx:-0.26, dy:0,  timer:90,  talkT:120, bubble:'', bubT:0, step:0, poopEvery:660, eggEvery:540},
];


const P = {
  x: 3*T, y: 3.5*T,
  w: 21, h: 28,
  speed: 0.85,
  dir: 2, frame: 0, ft: 0, moving: false,
  carrots: 0, eggs: 0, chew: 0, interactCd: 0, headEffectCd: 0,
  type: 'rabbit', poopEvery: 760, poopStep: 0,
  hasFloatie: false, hasCar: false, carMode: false,
  honey: 0, fishRod: false, fish: 0,
};

// ── NPC 羊 ───────────────────────────────────────────
const SHEEP = [
  {type:'sheep', x:5*T, y:3.5*T, dir:1, dx:0, dy:0,
   talkT:150, bubble:'', bubT:0, poopEvery:720, poopStep:0, step:0,
   rideMode:'', ridePhase:0, rideBubble:null,
   hasFloatie:false, hasCar:false, carMode:false,
   fishRod:false, fish:0},
];

// ── 钓鱼小游戏状态 ────────────────────────────────────
const FISH_MINI = {
  who: null, active: false,
  barY: 0.6, barV: 0, barH: 0.26,
  fishY: 0.35, fishV: 0, fishTarget: 0.35, fishChangeT: 60,
  catchMeter: 0.5,
  result: '', resultT: 0,
};

const KEYS = {};
let SPACE_HIT=false;
let SHEEP_ENTER_HIT=false;
let X_HIT=false;
let Q_HIT=false;
let TAB_HIT=false;
document.addEventListener('keydown', e=>{
  const k=e.key.toLowerCase();
  if(k===' ' && !KEYS[k]) SPACE_HIT=true;
  if(e.key==='Enter') SHEEP_ENTER_HIT=true;
  if(k==='x' && !KEYS[k]) X_HIT=true;
  if(k==='q' && !KEYS[k]) Q_HIT=true;
  if(e.key==='Tab') TAB_HIT=true;
  KEYS[k]=true;
  e.preventDefault();
});
document.addEventListener('keyup',   e=>{ KEYS[e.key.toLowerCase()]=false; });


const BUBBLES=['哔哔！','咩咩~','好天气','摸鱼中','zzZ','嗷呜！','好困','胡萝卜！'];
const CRITTER_BUBBLES = {
  dog: ['汪！','闻闻','跑跑！','守农场'],
  cat: ['喵~','伸懒腰','盯蜜蜂','想鱼了'],
  bee: ['嗡嗡','采花','忙忙忙','花香！'],
  chicken: ['咯咯','下蛋？','啄啄','早安！'],
};
let bubble='', bubT=0;

// ── 小鸟（在树之间飞行）────────────────────────────────
// 树的位置在 map 生成后才确定，initBirds() 在 main.js initWorld 结束后调用
const BIRDS = [];
const BIRD_COLORS = ['#e84040','#30c040','#3070e8','#9030c8','#222222'];
function initBirds(){
  // 收集地图上所有树的格子（tile 4）
  const trees=[];
  for(let ty=1;ty<ROWS-1;ty++) for(let tx=1;tx<COLS-1;tx++)
    if(MAP[ty][tx]===4) trees.push({x:tx*T+8,y:ty*T+4});
  if(trees.length<2) return;
  for(let i=0;i<5;i++){
    const t=trees[Math.random()*trees.length|0];
    BIRDS.push({
      x:t.x, y:t.y,
      color:BIRD_COLORS[i],
      tx:t.x, ty:t.y,       // 目标树位置
      trees,                  // 共享引用
      phase:Math.random()*Math.PI*2,
      speed:0.9+Math.random()*0.5,
      waitT:60+Math.random()*120|0,  // 停在树上等待帧数
      flying:false,
      wingF:0,
    });
  }
}


function dist(a,b,c,d){
  return Math.hypot(a-c,b-d);
}

function addFloat(x,y,text,color='#fff6a8'){
  FLOATS.push({x,y,text,color,life:70});
}

function setBubble(text, time=95){
  bubble=text;
  bubT=time;
}
