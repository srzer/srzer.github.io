// 0=草 1=泥土 2=水 3=栅栏 4=树 5=花 6=小屋地板 7=石头 8=作物 9=路
const MAP = [];
for(let y=0;y<ROWS;y++) MAP.push(new Array(COLS).fill(0));

function inB(x,y){ return x>0 && y>0 && x<COLS-1 && y<ROWS-1; }
function setT(x,y,t){ if(inB(x,y)) MAP[y][x]=t; }
function rectT(x0,y0,w,h,t){ for(let y=y0;y<y0+h;y++) for(let x=x0;x<x0+w;x++) setT(x,y,t); }

// 有机形状的池塘
function pond(cx,cy,rx,ry){
  for(let y=cy-ry;y<=cy+ry;y++) for(let x=cx-rx;x<=cx+rx;x++){
    const dx=(x-cx)/rx, dy=(y-cy)/ry;
    if(dx*dx+dy*dy <= 1 + (rnd()-0.5)*0.22) setT(x,y,2);
  }
}
// 作物田：泥土底 + 间隔种作物
function field(x0,y0,w,h){
  for(let y=y0;y<y0+h;y++) for(let x=x0;x<x0+w;x++){
    if(!inB(x,y)) continue;
    setT(x,y, ((x-x0)%2===1 && (y-y0)%2===1) ? 8 : 1);
  }
}
// 折线小路（绕开水面）
function path(x0,y0,x1,y1){
  let x=x0,y=y0;
  const lay=()=>{ if(inB(x,y) && MAP[y][x]!==2 && MAP[y][x]!==1 && MAP[y][x]!==8) setT(x,y,9); };
  while(x!==x1){ lay(); x+=x<x1?1:-1; }
  while(y!==y1){ lay(); y+=y<y1?1:-1; }
  lay();
}

// 边界栅栏
for(let x=0;x<COLS;x++){ MAP[0][x]=3; MAP[ROWS-1][x]=3; }
for(let y=0;y<ROWS;y++){ MAP[y][0]=3; MAP[y][COLS-1]=3; }

// 两块作物田
field(10,9,6,6);
field(31,21,7,6);
// 池塘：中下方大池 + 右上小池
pond(18,22,5,4);
pond(30,5,3,2);
// 果园（留出空隙，动物可穿行）
for(let y=8;y<=15;y++) for(let x=39;x<=45;x++)
  if((x+y)%2===0 && rnd()<0.72) setT(x,y,4);
// 随机散布：树 / 石头 / 花（仅落在草地上）
for(let i=0;i<24;i++){ const x=3+ri(COLS-6), y=3+ri(ROWS-6); if(MAP[y][x]===0) setT(x,y,4); }
for(let i=0;i<22;i++){ const x=2+ri(COLS-4), y=2+ri(ROWS-4); if(MAP[y][x]===0) setT(x,y,7); }
for(let i=0;i<70;i++){ const x=2+ri(COLS-4), y=2+ri(ROWS-4); if(MAP[y][x]===0) setT(x,y,5); }

// 道路网（出生区 → 喷泉中心 → 各景点）
path(3,6, 18,14);
path(18,14, 13,11);
path(18,14, 36,23);
path(18,14, 33,5);
path(18,14, 41,14);
path(18,14, 6,19);
path(33,5, 41,5);
path(6,19, 7,30);

// 清出关键设施所在地的空地，避免被随机物占用
rectT(1,1,6,5,0);                                   // 出生围栏
MAP[5][3]=9;                                        // 围栏出口小路
rectT(17,12,4,4,0);                                 // 喷泉
rectT(7,4,3,3,0);                                   // 跷跷板
rectT(12,3,4,3,0);                                  // 蹦蹦云床
rectT(7,7,3,2,0);                                   // 篝火
rectT(23,3,5,4,0);                                  // 八爪章鱼
rectT(38,8,4,3,0);                                  // 泡泡机
for(const g of GARDENS) rectT(g.x/T,g.y/T, g.w/T, g.h/T, 0); // 花园
rectT(4,18,3,2,0);                                  // 狗窝
rectT(41,17,3,2,0);                                 // 猫窝
rectT(34,27,3,2,0);                                 // 鸡窝

// ── 地图绘制颜色 ──────────────────────────────────────
const TCOL = {
  0: ['#6bc96b','#5db85d'],
  1: ['#c2845a','#ae7048'],
  2: ['#5aa8e8','#4a98d8'],
  3: ['#9a6835','#7a5025'],
  6: ['#e0c080','#d0b070'],
  9: ['#d7b06a','#c99d58'],
};

