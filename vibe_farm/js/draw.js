// ── 像素画工具 ────────────────────────────────────────
function px(x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(x,y,w,h); }

// ── 画兔叽 (24×28px) ─────────────────────────────────
// dir: 0=上 1=右 2=下 3=左
function drawRabbit(rx, ry, dir, frame, isPlayer){
  const ox = Math.floor(rx), oy = Math.floor(ry);
  // 颜色
  const W1 = isPlayer ? '#ffffff' : '#f0e8ff';
  const W2 = isPlayer ? '#e8e8e8' : '#e0d0f8';
  const EAR = '#ffb8d0';
  const NOSE= '#ff7090';
  const EYE = '#222';
  const SHINE='#ffffff';
  const LEG = isPlayer ? '#d8d8d8' : '#c8b8f0';
  const TAIL= '#ffffff';

  // 腿偏移（行走动画）
  const lA = frame===1 ?  2 : 0;
  const lB = frame===1 ? -2 : 0;  // 反相

  if(dir===2){ // 正面
    // 左腿
    px(ox+3,  oy+22+lA, 5,6, LEG);
    // 右腿
    px(ox+13, oy+22+lB, 5,6, LEG);
    // 身体
    px(ox+2,  oy+12, 17,12, W2);
    px(ox+3,  oy+11, 15,13, W1);
    // 头
    px(ox+4,  oy+2,  13,13, W1);
    px(ox+3,  oy+4,  15,11, W1);
    // 耳朵
    px(ox+5,  oy-8,  4,12, W2);
    px(ox+6,  oy-7,  2,10, EAR);
    px(ox+12, oy-8,  4,12, W2);
    px(ox+13, oy-7,  2,10, EAR);
    // 眼睛
    px(ox+6,  oy+6,  3,3, EYE);
    px(ox+7,  oy+6,  1,1, SHINE);
    px(ox+12, oy+6,  3,3, EYE);
    px(ox+13, oy+6,  1,1, SHINE);
    // 鼻子
    px(ox+9,  oy+10, 3,2, NOSE);
    // 腮红
    px(ox+4,  oy+9,  3,3, '#ffb0b0');
    px(ox+14, oy+9,  3,3, '#ffb0b0');
    // 尾巴
    px(ox+17, oy+14, 5,5, TAIL);
  } else if(dir===0){ // 背面
    px(ox+3,  oy+22+lA, 5,6, LEG);
    px(ox+13, oy+22+lB, 5,6, LEG);
    px(ox+2,  oy+12, 17,12, W2);
    px(ox+3,  oy+11, 15,13, W1);
    px(ox+4,  oy+2,  13,13, W1);
    px(ox+3,  oy+4,  15,11, W1);
    px(ox+5,  oy-8,  4,12, W2);
    px(ox+6,  oy-7,  2,10, EAR);
    px(ox+12, oy-8,  4,12, W2);
    px(ox+13, oy-7,  2,10, EAR);
    // 后脑不露眼
    px(ox+7,  oy+7,  3,2, W2); // 假发线
    px(ox+11, oy+7,  3,2, W2);
    px(ox+10, oy+14, 5,5, TAIL);
  } else if(dir===1){ // 右
    px(ox+6,  oy+22+lB, 5,6, LEG);
    px(ox+14, oy+22+lA, 5,6, LEG);
    px(ox+6,  oy+22+lB+4, 5,2, '#bfc0c4');
    px(ox+4,  oy+12, 14,12, W2);
    px(ox+5,  oy+11, 12,13, W1);
    px(ox+6,  oy+2,  12,13, W1);
    px(ox+5,  oy+4,  13,11, W1);
    // 侧耳
    px(ox+11, oy-8,  4,12, W2);
    px(ox+12, oy-7,  2,10, EAR);
    // 侧眼
    px(ox+14, oy+6,  3,3, EYE);
    px(ox+15, oy+6,  1,1, SHINE);
    // 鼻子
    px(ox+17, oy+10, 2,2, NOSE);
    // 腮红
    px(ox+15, oy+9,  2,3, '#ffb0b0');
    // 尾巴
    px(ox+2,  oy+14, 5,5, TAIL);
  } else { // 左
    px(ox+10, oy+22+lB, 5,6, LEG);
    px(ox+2,  oy+22+lA, 5,6, LEG);
    px(ox+10, oy+22+lB+4, 5,2, '#bfc0c4');
    px(ox+3,  oy+12, 14,12, W2);
    px(ox+4,  oy+11, 12,13, W1);
    px(ox+3,  oy+2,  12,13, W1);
    px(ox+3,  oy+4,  13,11, W1);
    px(ox+6,  oy-8,  4,12, W2);
    px(ox+7,  oy-7,  2,10, EAR);
    px(ox+3,  oy+6,  3,3, EYE);
    px(ox+4,  oy+6,  1,1, SHINE);
    px(ox+2,  oy+10, 2,2, NOSE);
    px(ox+4,  oy+9,  2,3, '#ffb0b0');
    px(ox+14, oy+14, 5,5, TAIL);
  }
}

// ── 画羊叽 (22×18px sprite) ──────────────────────────
function drawSheep(sx, sy, dir){
  const ox=Math.floor(sx), oy=Math.floor(sy);
  const W1='#f5f2ee', W2='#ece8e2', W3='#ddd8d0';
  const SKIN='#d4c4a8', DARK='#b8a888', EYE='#333', SHINE='#fff';
  const HOOF='#7a6a50';

  // 蹄子
  px(ox+3, oy+14, 4,4, HOOF);
  px(ox+15,oy+14, 4,4, HOOF);

  // 身体羊毛（多层叠加感）
  px(ox+2, oy+4,  18,12, W3);
  px(ox+1, oy+3,  20,12, W2);
  px(ox+2, oy+2,  18,11, W1);
  px(ox+3, oy+1,  16,10, W1);
  // 高光点缀
  px(ox+5, oy+2,  3,2, '#ffffff');
  px(ox+12,oy+3,  2,2, '#ffffff');

  if(dir===1){ // 头朝右
    // 头
    px(ox+15,oy+2,  8,8, SKIN);
    px(ox+14,oy+3,  9,7, SKIN);
    // 吻部
    px(ox+20,oy+6,  3,4, DARK);
    // 眼睛
    px(ox+16,oy+4,  3,3, EYE);
    px(ox+17,oy+4,  1,1, SHINE);
    // 耳朵
    px(ox+14,oy+2,  3,5, SKIN);
    px(ox+15,oy+3,  2,3, DARK);
    // 犄角
    px(ox+17,oy+0,  2,3, '#c8b898');
    px(ox+18,oy-1,  2,2, '#b8a888');
  } else { // 头朝左
    px(ox-1, oy+2,  8,8, SKIN);
    px(ox-1, oy+3,  9,7, SKIN);
    px(ox-3, oy+6,  3,4, DARK);
    px(ox+3, oy+4,  3,3, EYE);
    px(ox+3, oy+4,  1,1, SHINE);
    px(ox+5, oy+2,  3,5, SKIN);
    px(ox+5, oy+3,  2,3, DARK);
    px(ox+3, oy+0,  2,3, '#c8b898');
    px(ox+2, oy-1,  2,2, '#b8a888');
  }
}

function drawDog(x,y,dir,frame,coat,swimming){
  const ox=Math.floor(x), oy=Math.floor(y);
  const C = coat==='white'
    ? {fur:'#f3f1ea', body:'#e6e1d6', dark:'#c2bbac', cream:'#ffe7c6', eye:'#3a2a1a', nose:'#5a4636'}
    : {fur:'#b87534', body:'#c9863d', dark:'#70451f', cream:'#f0c98a', eye:'#20160f', nose:'#111'};
  if(swimming){
    const bob=Math.sin(tick*0.22)*2|0;
    const pad=(tick>>3)&1;
    px(ox+4, oy+6+bob, 15,8, C.fur);
    px(ox+6, oy+4+bob, 11,7, C.body);
    px(ox+1, oy+8+bob, 5,4, C.dark);
    px(ox+17,oy+7+bob, 5,5, C.fur);
    px(ox+4, oy+12+bob+(pad?1:-1), 5,3, C.dark);
    px(ox+14,oy+12+bob+(pad?-1:1), 5,3, C.dark);
    if(dir===1){
      px(ox+16,oy+2+bob, 8,8, C.fur);
      px(ox+19,oy+5+bob, 4,3, C.cream);
      px(ox+18,oy+0+bob, 3,4, C.dark);
      px(ox+17,oy+4+bob, 2,2, C.eye);
      px(ox+23,oy+7+bob, 2,2, C.nose);
    } else {
      px(ox-2, oy+2+bob, 8,8, C.fur);
      px(ox-1, oy+5+bob, 4,3, C.cream);
      px(ox+3, oy+0+bob, 3,4, C.dark);
      px(ox+4, oy+4+bob, 2,2, C.eye);
      px(ox-3, oy+7+bob, 2,2, C.nose);
    }
    ctx.fillStyle='rgba(74,154,216,0.70)';
    ctx.fillRect(ox-2, oy+13+bob, 28, 9);
    px(ox+1, oy+13+bob, 7,2,'rgba(255,255,255,0.55)');
    px(ox+13,oy+15+bob, 6,2,'rgba(255,255,255,0.40)');
    return;
  }
  const step=frame ? 1 : 0;
  px(ox+3, oy+14+step, 4,4, C.dark);
  px(ox+14,oy+14-step, 4,4, C.dark);
  px(ox+4, oy+8,  15,8, C.fur);
  px(ox+6, oy+6,  11,7, C.body);
  px(ox+1, oy+10, 5,4, C.dark);
  px(ox+17,oy+9,  5,5, C.fur);
  if(dir===1){
    px(ox+16,oy+4, 8,8, C.fur);
    px(ox+19,oy+7, 4,3, C.cream);
    px(ox+18,oy+2, 3,5, C.dark);
    px(ox+17,oy+6, 2,2, C.eye);
    px(ox+23,oy+9, 2,2, C.nose);
    px(ox+2, oy+7, 3,3, C.dark);
  } else {
    px(ox-2, oy+4, 8,8, C.fur);
    px(ox-1, oy+7, 4,3, C.cream);
    px(ox+3, oy+2, 3,5, C.dark);
    px(ox+4, oy+6, 2,2, C.eye);
    px(ox-3, oy+9, 2,2, C.nose);
    px(ox+19,oy+7, 3,3, C.dark);
  }
}

function drawCat(x,y,dir,frame){
  const ox=Math.floor(x), oy=Math.floor(y);
  const fur='#6f737a', light='#bfc3c8', eye='#ffe66b', pink='#f0a0b0';
  const step=frame ? 1 : 0;
  px(ox+4, oy+14+step, 3,4, '#444950');
  px(ox+14,oy+14-step, 3,4, '#444950');
  px(ox+4, oy+8, 14,8, fur);
  px(ox+6, oy+9, 8,5, light);
  px(ox+16,oy+6, 4,3, fur);
  px(ox+19,oy+5, 3,3, fur);
  if(dir===1){
    px(ox+13,oy+3, 9,9, fur);
    px(ox+14,oy+0, 3,4, fur);
    px(ox+19,oy+0, 3,4, fur);
    px(ox+16,oy+7, 2,2, eye);
    px(ox+21,oy+8, 2,1, pink);
  } else {
    px(ox-1, oy+3, 9,9, fur);
    px(ox,  oy+0, 3,4, fur);
    px(ox+5, oy+0, 3,4, fur);
    px(ox+4, oy+7, 2,2, eye);
    px(ox-2, oy+8, 2,1, pink);
  }
}

function drawBee(x,y,dir,tick){
  const ox=Math.floor(x), oy=Math.floor(y+Math.sin(tick*0.16)*2);
  const wing=tick%12<6;
  px(ox+5, oy+5+(wing?0:1), 6,4, 'rgba(210,245,255,0.72)');
  px(ox+11,oy+5+(wing?1:0), 6,4, 'rgba(210,245,255,0.72)');
  px(ox+6, oy+10, 12,7, '#ffd441');
  px(ox+8, oy+10, 2,7, '#302010');
  px(ox+13,oy+10, 2,7, '#302010');
  px(ox+16,oy+12, 3,2, '#302010');
  px(ox+4, oy+12, 3,3, '#302010');
}

function drawChicken(x,y,dir,frame,coat){
  const ox=Math.floor(x), oy=Math.floor(y);
  const dark=coat==='black';
  const body=dark?'#2b2b30':'#fff4dc';
  const shade=dark?'#16181d':'#e8d8b8';
  const wing=dark?'#3d4048':'#ffffff';
  const eye=dark?'#ffe66b':'#222';
  const red='#d93624', beak='#f0a020';
  const step=frame ? 1 : 0;
  px(ox+6, oy+14+step, 2,5, '#d08024');
  px(ox+13,oy+14-step, 2,5, '#d08024');
  px(ox+4, oy+7, 14,10, shade);
  px(ox+5, oy+6, 12,10, body);
  px(ox+8, oy+8, 6,4, wing);
  if(dir===1){
    px(ox+14,oy+4, 7,8, body);
    px(ox+16,oy+1, 2,3, red);
    px(ox+19,oy+2, 2,3, red);
    px(ox+17,oy+7, 2,2, eye);
    px(ox+21,oy+8, 4,2, beak);
    px(ox+15,oy+11, 4,3, red);
  } else {
    px(ox+1, oy+4, 7,8, body);
    px(ox+3, oy+1, 2,3, red);
    px(ox+5, oy+2, 2,3, red);
    px(ox+5, oy+7, 2,2, eye);
    px(ox-3, oy+8, 4,2, beak);
    px(ox+4, oy+11,4,3, red);
  }
}

function drawCritter(c){
  const frame=(tick>>4)&1;
  if(c.type==='dog'){
    const swimming=(tileAt(c.x+10,c.y+16)===2||tileAt(c.x+13,c.y+16)===2);
    drawDog(c.x,c.y,c.dir,frame,c.coat,swimming);
  } else if(c.type==='cat') drawCat(c.x,c.y,c.dir,frame);
  else if(c.type==='bee') drawBee(c.x,c.y,c.dir,tick);
  else if(c.type==='chicken') drawChicken(c.x,c.y,c.dir,frame,c.coat);
}

function drawSeesaw(){
  const x=SEESAW.x, y=SEESAW.y;
  const tilt=SEESAW.active>0 ? Math.sin(tick*0.15)*9 : 0;
  px(x+19,y+27,18,4,'rgba(0,0,0,0.18)');
  px(x+23,y+20,10,7,'#6a4424');
  px(x+25,y+16,7,8,'#8a5a30');
  px(x+21,y+15,13,3,'#c99d58');
  ctx.save();
  ctx.translate(x+28,y+16);
  ctx.rotate(tilt*Math.PI/180);
  px(-30,-4,60,7,'#d88932');
  px(-29,-5,58,2,'#ffd060');
  px(-30,2,60,2,'#8a5a30');
  px(-29,-8,13,5,'#f2b35a');
  px(16,-8,13,5,'#f2b35a');
  px(-22,-14,4,9,'#7a5025');
  px(20,-14,4,9,'#7a5025');
  px(-24,-16,8,3,'#9a6835');
  px(18,-16,8,3,'#9a6835');
  ctx.restore();
  px(x+5,y+29,50,3,'rgba(0,0,0,0.15)');
  if(!SEESAW.seated && dist(P.x+P.w/2,P.y+P.h,x+28,y+12)<34){
    drawBubble(x+28,y-2,'Space');
  }
}

function drawOctopus(){
  const x=OCTOPUS.x, y=OCTOPUS.y;
  const cx=x+42, cy=y+36;
  const spin=OCTOPUS.angle;
  px(x+12,y+48,60,8,'rgba(0,0,0,0.18)');
  px(x+33,y+30,18,23,'#7a3d9a');
  px(x+36,y+26,12,7,'#a85bd0');

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(spin);
  const arms=[
    [-36,-4,28,7], [8,-4,28,7],
    [-5,-36,7,28], [-5,8,7,28],
    [-28,-28,23,6], [5,-28,23,6],
    [-28,22,23,6], [5,22,23,6],
  ];
  for(const [ax,ay,aw,ah] of arms){
    px(ax,ay,aw,ah,'#b765d8');
    px(ax+2,ay+2,Math.max(3,aw-4),2,'#e2a1ff');
  }
  px(-15,-15,30,30,'#bf6ee0');
  px(-11,-18,22,8,'#d98cff');
  px(-8,-2,5,5,'#212035');
  px(3,-2,5,5,'#212035');
  px(-6,8,14,3,'#7a3d9a');
  px(-28,-10,12,10,'#ffc46b');
  px(16,-10,12,10,'#ffc46b');
  px(-10,-28,20,10,'#ffc46b');
  px(-10,18,20,10,'#ffc46b');
  ctx.restore();

  if(!OCTOPUS.seated && dist(P.x+P.w/2,P.y+P.h,cx,cy)<42 && OCTOPUS.cooldown<=0){
    drawBubble(cx,y+7,'Space');
  }
}

function drawTrampoline(){
  const x=TRAMPOLINE.x, y=TRAMPOLINE.y;
  const bounce=TRAMPOLINE.active>0 ? Math.sin(tick*0.32)*3 : 0;
  px(x+9,y+47,58,6,'rgba(0,0,0,0.16)');
  px(x+10,y+35,7,15,'#7a5025');
  px(x+58,y+35,7,15,'#7a5025');
  px(x+13,y+39,50,4,'#9a6835');
  px(x+16,y+28+bounce,44,14,'#bfefff');
  px(x+12,y+31+bounce,52,9,'#d8f6ff');
  px(x+19,y+24+bounce,12,9,'#ffffff');
  px(x+33,y+22+bounce,15,10,'#eefcff');
  px(x+48,y+25+bounce,11,8,'#ffffff');
  px(x+19,y+38+bounce,38,3,'#8ed8ff');
  if(!TRAMPOLINE.seated && dist(P.x+P.w/2,P.y+P.h,x+38,y+34)<42 && TRAMPOLINE.cooldown<=0){
    drawBubble(x+38,y+15,'Space');
  }
}

function drawBubbleRide(){
  const x=BUBBLE_RIDE.x, y=BUBBLE_RIDE.y;
  px(x+14,y+39,46,5,'rgba(0,0,0,0.15)');
  px(x+28,y+24,17,18,'#7a5025');
  px(x+24,y+20,25,6,'#9a6835');
  px(x+30,y+13,13,10,'#c99d58');
  px(x+34,y+4,5,14,'#d8f6ff');
  px(x+11,y+31,14,8,'#6fb8ee');
  px(x+53,y+30,13,8,'#6fb8ee');
  const on=BUBBLE_RIDE.active>0 || (tick%90)<42;
  if(on){
    const colors=['rgba(210,245,255,0.58)','rgba(255,220,250,0.45)','rgba(255,246,166,0.42)'];
    for(let i=0;i<7;i++){
      const bx=x+8+i*9+Math.sin(tick*0.04+i)*4;
      const by=y+4+((tick*0.25+i*17)%34);
      ctx.strokeStyle=colors[i%colors.length];
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.arc(bx,by,3+(i%3),0,Math.PI*2);
      ctx.stroke();
    }
  }
  if(!BUBBLE_RIDE.seated && dist(P.x+P.w/2,P.y+P.h,x+37,y+29)<43 && BUBBLE_RIDE.cooldown<=0){
    drawBubble(x+37,y+5,'Space');
  }
}

function drawPlayerBubbleShell(){
  if(!BUBBLE_RIDE.seated) return;
  const cx=P.x+P.w/2, cy=P.y+14;
  ctx.save();
  ctx.strokeStyle='rgba(210,245,255,0.78)';
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(cx,cy,22,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='rgba(255,220,250,0.42)';
  ctx.beginPath(); ctx.arc(cx-4,cy-3,15,0,Math.PI*2); ctx.stroke();
  px(cx-10,cy-15,7,3,'rgba(255,255,255,0.52)');
  ctx.restore();
}

function drawSheepBubbleShell(){
  const s=SHEEP[0];
  if(s.rideMode!=='bubble' || !s.rideBubble) return;
  const cx=s.x+11, cy=s.y+10;
  ctx.save();
  ctx.strokeStyle='rgba(210,245,255,0.78)';
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(cx,cy,22,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='rgba(255,220,250,0.42)';
  ctx.beginPath(); ctx.arc(cx-4,cy-3,15,0,Math.PI*2); ctx.stroke();
  px(cx-10,cy-15,7,3,'rgba(255,255,255,0.52)');
  ctx.restore();
}

function drawSpawnFence(){
  const fx=T, fy=T, fw=6*T, fh=5*T;
  const gateX=fx+2*T+8, gateW=T+8;

  function stake(sx, sy, h){
    const v = (sx*3+sy*7)%3; // 微小高度变化
    const sh = h + v;
    px(sx+1, sy-sh+3, 3, 3, '#6a3e18'); // 尖顶渐变
    px(sx+2, sy-sh,   1, 4, '#5a3010'); // 最尖端
    px(sx,   sy-sh+5, 5, sh-5, '#9a6030'); // 桩主体
    px(sx,   sy-sh+5, 1, sh-5, '#6a3e18'); // 左侧阴影
    px(sx+4, sy-sh+5, 1, sh-5, '#7a4a22'); // 右侧
    px(sx+1, sy-sh+7, 1, sh-9, '#b07840'); // 高光线
  }

  // 上边
  for(let sx=fx+1; sx<fx+fw-4; sx+=9) stake(sx, fy+18, 16);
  // 下边（留门）
  for(let sx=fx+1; sx<fx+fw-4; sx+=9){
    if(sx+5<=gateX || sx>=gateX+gateW) stake(sx, fy+fh, 16);
  }
  // 左边
  for(let sy=fy+20; sy<fy+fh-8; sy+=9) stake(fx+1, sy, 16);
  // 右边
  for(let sy=fy+20; sy<fy+fh-8; sy+=9) stake(fx+fw-6, sy, 16);

  // 门口：草地小路标记
  px(gateX, fy+fh-10, gateW, 8, '#7bc96b');
  px(gateX+4, fy+fh-8, gateW-8, 3, '#c99d58');
}

function drawFountain(){
  const x=FOUNTAIN.x, y=FOUNTAIN.y;
  px(x+7,y+20,34,8,'#607d94');
  px(x+5,y+17,38,5,'#83a8bd');
  px(x+10,y+13,28,7,'#4a9ad6');
  px(x+14,y+10,20,5,'#6fb8ee');
  px(x+21,y+6,6,9,'#d8eef8');
  const phase=tick%FOUNTAIN.cycle;
  if(phase<FOUNTAIN.spray){
    const h=22+Math.sin(tick*0.18)*4;
    px(x+23,y+2-h,2,h,'#bfefff');
    px(x+17,y+10-h*0.65,2,12,'#d8f6ff');
    px(x+31,y+10-h*0.65,2,12,'#d8f6ff');
    px(x+12+Math.sin(tick*0.2)*4,y+6-h*0.3,3,3,'#ffffff');
    px(x+35-Math.sin(tick*0.18)*5,y+7-h*0.35,3,3,'#ffffff');
    if(tick%18===0) addFloat(x+14,y-8,'♪','#bfefff');
  }
}

function drawGarden(garden=GARDEN){
  const x=garden.x, y=garden.y, w=garden.w, h=garden.h;
  px(x+4,y+4,w-8,h-8,'rgba(76,160,86,0.24)');
  for(let gx=x; gx<=x+w-T; gx+=T){
    px(gx+2,y+2,3,T-4,'#7a5025');
    px(gx+2,y+h-T+2,3,T-4,'#7a5025');
    px(gx+2,y+6,T-5,3,'#9a6835');
    px(gx+2,y+h-8,T-5,3,'#9a6835');
  }
  for(let gy=y; gy<=y+h-T; gy+=T){
    px(x+2,gy+2,3,T-4,'#7a5025');
    px(x+w-5,gy+2,3,T-4,'#7a5025');
    px(x+5,gy+6,3,T-8,'#9a6835');
    px(x+w-8,gy+6,3,T-8,'#9a6835');
  }
  for(let i=0;i<16;i++){
    const fx=x+10+(i%4)*34;
    const fy=y+12+(i/4|0)*18;
    const c=['#ff6fa0','#ffd060','#b78cff','#ffffff'][i%4];
    px(fx,fy+5,2,6,'#3a9438');
    px(fx-2,fy+2,3,3,c);
    px(fx+2,fy+2,3,3,c);
    px(fx,fy,3,3,c);
    px(fx,fy+3,3,3,'#ffe66b');
  }
  px(x+w/2-9,y+h-8,18,6,'#c99d58');
}

function drawNestHouse(wx, wy, type){
  const x=Math.floor(wx), y=Math.floor(wy), S=3*T; // S=72

  // 地面阴影
  ctx.fillStyle='rgba(0,0,0,0.16)';
  ctx.beginPath(); ctx.ellipse(x+S/2,y+S+3,S/2-6,6,0,0,Math.PI*2); ctx.fill();

  if(type==='dog'){
    // 暖棕色木板小屋
    const wall='#c8903a', dark='#8a5c20', plank='#b07830', lite='#e8b460', roof='#6e3018', roofL='#984228';
    // 墙体（垂直木板纹理）
    px(x+3,  y+26, S-6, 48, dark);
    px(x+4,  y+25, S-8, 48, wall);
    for(let bx=x+9; bx<x+S-4; bx+=8) px(bx,y+25,2,48,plank); // 板缝
    px(x+4,  y+25, S-8, 3, lite); // 顶部高光
    // 屋顶（深棕三角）
    ctx.fillStyle=roof;
    ctx.beginPath(); ctx.moveTo(x-4,y+30); ctx.lineTo(x+S/2,y-4); ctx.lineTo(x+S+4,y+30); ctx.fill();
    ctx.fillStyle=roofL;
    ctx.beginPath(); ctx.moveTo(x+2,y+28); ctx.lineTo(x+S/2,y-1); ctx.lineTo(x+S-2,y+28); ctx.fill();
    // 屋顶骨头装饰
    px(x+S/2-7,y-12, 14,4,'#f0e8da'); px(x+S/2-9,y-14,6,4,'#f0e8da'); px(x+S/2+3,y-14,6,4,'#f0e8da');
    // 左窗
    px(x+6,  y+32, 16,14,'#a8d8f8'); px(x+7,y+33,14,5,'#d8f0ff'); px(x+13,y+32,2,14,'#7a9ab8');
    // 右窗
    px(x+S-22,y+32, 16,14,'#a8d8f8'); px(x+S-21,y+33,14,5,'#d8f0ff'); px(x+S-16,y+32,2,14,'#7a9ab8');
    // 圆形犬门（特色！）
    px(x+S/2-9,y+50,18,22,dark);
    ctx.fillStyle=dark; ctx.beginPath(); ctx.arc(x+S/2,y+51,9,Math.PI,0); ctx.fill();
    px(x+S/2-7,y+51,14,21,'#1e0e04');
    ctx.fillStyle='#1e0e04'; ctx.beginPath(); ctx.arc(x+S/2,y+52,7,Math.PI,0); ctx.fill();
    // 爪印
    px(x+S/2-4,y+42,3,3,'#c87030'); px(x+S/2+1,y+42,3,3,'#c87030');
    px(x+S/2-6,y+45,3,3,'#c87030'); px(x+S/2+3,y+45,3,3,'#c87030'); px(x+S/2-1,y+44,4,4,'#c87030');

  }else if(type==='cat'){
    // 优雅薰衣草小屋
    const wall='#e8d8f4', dark='#b89ad0', trim='#7840b0', roof='#4a2878', roofL='#7048b0';
    px(x+3,  y+26, S-6, 48, dark);
    px(x+4,  y+25, S-8, 48, wall);
    px(x+4,  y+25, S-8, 3, '#fff8ff');
    px(x+4,  y+48, S-8, 2, trim); // 腰线装饰
    // 屋顶
    ctx.fillStyle=roof;
    ctx.beginPath(); ctx.moveTo(x-4,y+30); ctx.lineTo(x+S/2,y-4); ctx.lineTo(x+S+4,y+30); ctx.fill();
    ctx.fillStyle=roofL;
    ctx.beginPath(); ctx.moveTo(x+3,y+28); ctx.lineTo(x+S/2,y-1); ctx.lineTo(x+S-3,y+28); ctx.fill();
    // 屋顶：鱼装饰
    px(x+S/2-8,y-13,16,7,'#c8ecff'); px(x+S/2+6,y-11,7,4,'#c8ecff');
    px(x+S/2-5,y-11,2,2,'#333');
    // 圆月窗（特色！）
    ctx.fillStyle=trim; ctx.beginPath(); ctx.arc(x+S/2,y+38,13,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#a8d8f8'; ctx.beginPath(); ctx.arc(x+S/2,y+38,11,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#d0ecff'; ctx.beginPath(); ctx.arc(x+S/2,y+38,9,0,Math.PI*2); ctx.fill();
    px(x+S/2-1,y+28,2,20,trim); px(x+S/2-11,y+37,22,2,trim); // 十字
    // 小侧窗
    px(x+6,  y+32,12,10,'#a8d8f8'); px(x+S-18,y+32,12,10,'#a8d8f8');
    // 拱形门
    px(x+S/2-9,y+50,18,22,dark);
    ctx.fillStyle=dark; ctx.beginPath(); ctx.arc(x+S/2,y+51,9,Math.PI,0); ctx.fill();
    px(x+S/2-7,y+51,14,21,'#180828');
    ctx.fillStyle='#180828'; ctx.beginPath(); ctx.arc(x+S/2,y+52,7,Math.PI,0); ctx.fill();
    px(x+S/2+3,y+62,3,3,'#d4a820'); // 门把手

  }else if(type==='chicken'){
    // 红白谷仓
    const wall='#f2ece0', dark='#d0c4a8', trim='#c42820', roof='#c42820', roofL='#e03828';
    px(x+3,  y+26, S-6, 48, dark);
    px(x+4,  y+25, S-8, 48, wall);
    // 垂直红条纹（谷仓风格）
    for(let bx=x+10; bx<x+S-4; bx+=10) px(bx,y+25,3,48,trim);
    px(x+4,  y+25, S-8, 3, '#fff8f0');
    // A字形屋顶
    ctx.fillStyle=roof;
    ctx.beginPath(); ctx.moveTo(x-6,y+30); ctx.lineTo(x+S/2,y-6); ctx.lineTo(x+S+6,y+30); ctx.fill();
    ctx.fillStyle=roofL;
    ctx.beginPath(); ctx.moveTo(x+2,y+28); ctx.lineTo(x+S/2,y-3); ctx.lineTo(x+S-2,y+28); ctx.fill();
    // 风向标（特色！）
    px(x+S/2-1,y-20,2,16,'#888'); px(x+S/2-6,y-20,12,2,'#aaa');
    px(x+S/2+2, y-22,6,4,'#c84020'); // 小公鸡剪影
    px(x+S/2+4, y-20,4,2,'#c84020');
    // 窗（麦秆色）
    px(x+6,  y+30,16,14,'#e0c060'); for(let r=y+31;r<y+43;r+=3) px(x+7,r,14,2,'#c8a840');
    px(x+S-22,y+30,16,14,'#e0c060'); for(let r=y+31;r<y+43;r+=3) px(x+S-21,r,14,2,'#c8a840');
    // 双扇谷仓门（特色！）
    px(x+S/2-12,y+48,24,24,dark);
    px(x+S/2-10,y+49,20,23,'#3a1a08');
    px(x+S/2,   y+49, 1,23,'#5a2a10'); // 门缝
    ctx.strokeStyle='#5a2a10'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x+S/2-10,y+49); ctx.lineTo(x+S/2-1, y+72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S/2-1, y+49); ctx.lineTo(x+S/2-10,y+72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S/2+1, y+49); ctx.lineTo(x+S/2+10,y+72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S/2+10,y+49); ctx.lineTo(x+S/2+1, y+72); ctx.stroke();
  }
}

function drawNests(){
  drawNestHouse(NESTS.dog.x,     NESTS.dog.y,     'dog');
  drawNestHouse(NESTS.cat.x,     NESTS.cat.y,     'cat');
  drawNestHouse(NESTS.chicken.x, NESTS.chicken.y, 'chicken');
}

function drawCampfire(){
  const x=CAMPFIRE.x, y=CAMPFIRE.y;
  px(x+4,y+14,20,5,'rgba(0,0,0,0.18)');
  ctx.save();
  ctx.translate(x+14,y+15);
  ctx.rotate(-0.35);
  px(-13,-2,25,5,'#6b3f24');
  px(-11,-1,22,2,'#9a6835');
  ctx.rotate(0.7);
  px(-13,-2,25,5,'#5a341e');
  px(-11,-1,22,2,'#b8793a');
  ctx.restore();
  const flick=Math.sin(tick*0.28)*2;
  px(x+9,y+5+flick,10,10,'#ff7a24');
  px(x+11,y+1+flick,6,12,'#ffd060');
  px(x+12,y+5+flick,4,7,'#fff2a0');
  px(x+7,y+10,14,5,'#d9441f');
}

// ── 画树 ─────────────────────────────────────────────
function drawTree(tx, ty){
  const x=tx*T, y=ty*T;
  const v=(tx*7+ty*13)%3;            // 三种微变体
  const lift=v===1?-1:v===2?1:0;
  // 地面阴影
  ctx.fillStyle='rgba(0,0,0,0.18)';
  ctx.beginPath(); ctx.ellipse(x+12,y+24,11,4,0,0,Math.PI*2); ctx.fill();
  // 树干
  px(x+9, y+15, 6,11, '#6e4724');
  px(x+10,y+14, 4,11, '#8a5e34');
  px(x+11,y+16, 2,9,  '#a87a44');
  // 树冠 4 层
  px(x+3, y+9+lift,  18,11, '#1c6a12');
  px(x+1, y+5+lift,  22,11, '#2a8420');
  px(x+4, y+1+lift,  16,9,  '#33a82f');
  px(x+6, y-1+lift,  12,6,  '#3fc23a');
  // 阴影侧 & 高光
  px(x+3, y+12+lift, 5,5,  'rgba(10,60,10,0.35)');
  px(x+7, y+1+lift,  5,3,  '#6fe060');
  px(x+13,y+4+lift,  3,2,  '#5bd24f');
}

// ── 画花 ─────────────────────────────────────────────
function drawFlower(tx, ty, tick){
  const x=tx*T+7, y=ty*T+8;
  const bob=Math.sin(tick*0.04+tx*1.7)|0;
  px(x+3, y+6+bob, 2,5, '#4a9030');
  // 花瓣
  px(x+2, y+2+bob, 2,2, '#ff6060');
  px(x+5, y+2+bob, 2,2, '#ff6060');
  px(x+3, y+0+bob, 3,2, '#ff6060');
  px(x+3, y+4+bob, 3,2, '#ff6060');
  // 花心
  px(x+3, y+2+bob, 3,3, '#ffd040');
}

function drawGrassPatchAt(x, y, eaten, tick){
  const ox=Math.floor(x), oy=Math.floor(y);
  px(ox+2, oy+15, 17,3, 'rgba(20,80,20,0.18)');
  if(eaten){
    px(ox+5, oy+12, 3,4, '#5a9d4b');
    px(ox+13,oy+13, 2,3, '#4f8e43');
    return;
  }
  const sway=Math.sin(tick*0.06+x*0.01)|0;
  px(ox+3, oy+8+sway, 2,10, '#277b2e');
  px(ox+6, oy+6-sway, 2,12, '#3fa044');
  px(ox+10,oy+7+sway, 2,11, '#2f8c38');
  px(ox+14,oy+5-sway, 2,13, '#4fb64e');
  px(ox+17,oy+9+sway, 2,9,  '#2d7c32');
  px(ox+7, oy+10, 9,3, '#68c95f');
}

function drawCarrot(c, tick){
  if(c.eaten) return;
  const x=Math.floor(c.x), y=Math.floor(c.y);
  const bob=Math.sin(tick*0.05+c.x*0.02)|0;
  px(x+4, y+5+bob,  3,4, '#3aa044');
  px(x+7, y+3+bob,  3,6, '#4fb64e');
  px(x+10,y+5+bob,  3,4, '#2f8c38');
  px(x+5, y+9+bob,  10,4, '#f08a24');
  px(x+6, y+13+bob, 8,4, '#e87518');
  px(x+8, y+17+bob, 4,3, '#c95714');
  px(x+7, y+10+bob, 5,1, '#ffd28a');
}

function drawRabbitChew(rx, ry, dir, tick){
  if(P.chew<=0) return;
  const ox=Math.floor(rx), oy=Math.floor(ry);
  const blink=(tick>>3)%2;
  const mx = dir===3 ? ox+1 : dir===1 ? ox+18 : ox+10;
  const my = dir===0 ? oy+13 : oy+12;
  px(mx, my, 3,2, '#f08a24');
  if(blink) px(mx+(dir===3?-3:4), my+3, 2,2, '#ffd28a');
}

function drawFloat(f){
  const a=Math.max(0, f.life/70);
  ctx.globalAlpha=a;
  ctx.fillStyle=f.color;
  ctx.font='bold 11px Courier New';
  ctx.fillText(f.text, Math.floor(f.x), Math.floor(f.y));
  ctx.globalAlpha=1;
}

function drawPoop(p){
  const x=Math.floor(p.x), y=Math.floor(p.y);
  px(x+4,y+12,13,5,'#5b341c');
  px(x+6,y+8,9,6,'#744324');
  px(x+8,y+5,6,5,'#8a552e');
  px(x+11,y+4,3,2,'#a06a3c');
  px(x+4,y+17,14,2,'rgba(0,0,0,0.16)');
}

function drawEgg(e){
  const x=Math.floor(e.x), y=Math.floor(e.y);
  const bob=Math.sin(tick*0.05+e.x*0.02)|0;
  px(x+5,y+14,11,3,'rgba(0,0,0,0.14)');
  px(x+6,y+7+bob,10,10,'#f7f0d6');
  px(x+5,y+10+bob,12,7,'#eadfbf');
  px(x+8,y+8+bob,5,3,'#ffffff');
  px(x+7,y+15+bob,8,2,'#d8c8a0');
}


function drawHeart(x,y,c){
  const ox=Math.floor(x), oy=Math.floor(y);
  px(ox+1,oy,2,2,c);
  px(ox+5,oy,2,2,c);
  px(ox,oy+2,8,4,c);
  px(ox+1,oy+6,6,2,c);
  px(ox+3,oy+8,2,2,c);
}

function drawEffect(e){
  const a=Math.max(0, e.life/(e.type==='heart'?95:52));
  ctx.globalAlpha=a;
  if(e.type==='heart') drawHeart(e.x,e.y,e.color);
  else {
    px(e.x,e.y,3,3,e.color);
    px(e.x-e.vx*2,e.y-e.vy*2,2,2,'rgba(255,255,255,0.55)');
  }
  ctx.globalAlpha=1;
}

// ── 画石头 ─────────────────────────────────────────────
function drawStone(tx, ty){
  const x=tx*T, y=ty*T;
  px(x+5, y+12, 15,8, '#8c949c');
  px(x+7, y+8,  12,8, '#a6adb4');
  px(x+11,y+7,  6,3, '#c4c9ce');
  px(x+4, y+18, 17,3, 'rgba(0,0,0,0.15)');
}

// ── 画作物 ─────────────────────────────────────────────
function drawCrop(tx, ty, tick){
  const x=tx*T, y=ty*T;
  const sway=Math.sin(tick*0.04+tx+ty)|0;
  px(x+5,  y+8+sway,  3,12, '#2f8a38');
  px(x+11, y+7-sway,  3,13, '#3aa044');
  px(x+17, y+9+sway,  3,11, '#2f8a38');
  px(x+4,  y+11+sway, 6,3, '#58b85a');
  px(x+10, y+10-sway, 6,3, '#65c665');
  px(x+16, y+12+sway, 6,3, '#58b85a');
}

// ── 画水 ─────────────────────────────────────────────
function drawWater(tx, ty, tick){
  const x=tx*T, y=ty*T;
  const w=Math.sin(tick*0.04+tx*0.9+ty*0.6)>0;
  px(x,y,T,T, w?'#4a9ae0':'#5aaaf0');
  px(x, y, T, 2, 'rgba(30,80,120,0.22)');
  px(x, y+T-2, T, 2, 'rgba(255,255,255,0.12)');
  px(x+2, y+5, 8,2, 'rgba(255,255,255,0.35)');
  px(x+12,y+12, 6,2, 'rgba(255,255,255,0.25)');
  px(x+4, y+16, 5,2, 'rgba(255,255,255,0.2)');
}

// ── 画小屋 ───────────────────────────────────────────
function drawHouse(){
  const hx=T, hy=T;
  const hw=5*T, hh=4*T;
  // 屋顶
  ctx.fillStyle='#c0322a';
  ctx.beginPath();
  ctx.moveTo(hx-6, hy+T);
  ctx.lineTo(hx+hw/2, hy-T+4);
  ctx.lineTo(hx+hw+6, hy+T);
  ctx.fill();
  ctx.fillStyle='#e04030';
  ctx.beginPath();
  ctx.moveTo(hx, hy+T);
  ctx.lineTo(hx+hw/2, hy-T+8);
  ctx.lineTo(hx+hw, hy+T);
  ctx.fill();
  // 墙
  px(hx, hy+T, hw, hh-T, '#f5e0c0');
  // 砖缝
  ctx.fillStyle='#ddc8a0';
  for(let row=0;row<3;row++){
    const off=(row%2)*T;
    for(let col=-1;col<6;col++)
      px(hx+col*T+off, hy+T+row*(T*0.6), T-2, 2, '#cbb888');
  }
  // 门
  px(hx+2*T, hy+2.2*T, T+2, 1.8*T, '#7a4e22');
  px(hx+2*T+4, hy+2.2*T, T-6, 1.8*T-4, '#9a6835');
  px(hx+2*T+T/2-1, hy+3*T, 3,3, '#f5d060'); // 门把
  // 左窗
  px(hx+T*0.4, hy+T*1.4, T*0.9, T*0.8, '#a8d8f8');
  px(hx+T*0.4+T*0.45-1, hy+T*1.4, 2, T*0.8, '#7a5025');
  px(hx+T*0.4, hy+T*1.4+T*0.4-1, T*0.9, 2, '#7a5025');
  // 右窗
  px(hx+T*3.7, hy+T*1.4, T*0.9, T*0.8, '#a8d8f8');
  px(hx+T*3.7+T*0.45-1, hy+T*1.4, 2, T*0.8, '#7a5025');
  px(hx+T*3.7, hy+T*1.4+T*0.4-1, T*0.9, 2, '#7a5025');
  // 烟囱
  px(hx+hw-T*1.2, hy-T*0.6, T*0.5, T*1.2, '#9a7050');
}


function drawShop(){
  const x=Math.floor(SHOP.x), y=Math.floor(SHOP.y), S=3*T;

  // 地面阴影
  ctx.fillStyle='rgba(0,0,0,0.16)';
  ctx.beginPath(); ctx.ellipse(x+S/2,y+S+3,S/2-6,6,0,0,Math.PI*2); ctx.fill();

  // 墙体（奶白色砖墙）
  px(x+3,  y+26, S-6, 48, '#c8b880');
  px(x+4,  y+25, S-8, 48, '#f5ecd4');
  for(let by=y+31; by<y+73; by+=8){       // 横向砖缝
    const off=(((by-y)/8|0)%2)*4;
    for(let bx=x+4+off; bx<x+S-4; bx+=12) px(bx,by,10,1,'#d8ca9a');
  }
  px(x+4, y+25, S-8, 3, '#fff8e8');

  // 遮阳棚（红黄条纹，特色！）
  for(let i=0;i<8;i++) px(x-2+i*10, y+22, 6, 12, i%2===0?'#e03020':'#ffe040');
  px(x-2, y+22, S+4, 12, 'rgba(200,30,10,0.15)');
  px(x-2, y+22, S+4, 3,  'rgba(255,220,80,0.4)');

  // 屋顶（翠绿三角）
  const rc='#2a7a50', rl='#3aaa70';
  ctx.fillStyle=rc;
  ctx.beginPath(); ctx.moveTo(x-4,y+30); ctx.lineTo(x+S/2,y-4); ctx.lineTo(x+S+4,y+30); ctx.fill();
  ctx.fillStyle=rl;
  ctx.beginPath(); ctx.moveTo(x+3,y+28); ctx.lineTo(x+S/2,y-1); ctx.lineTo(x+S-3,y+28); ctx.fill();

  // 屋顶招牌
  px(x+S/2-16, y-16, 32, 12, '#fffce0');
  ctx.strokeStyle='#1a5a38'; ctx.lineWidth=1.5;
  ctx.strokeRect(x+S/2-15.5, y-15.5, 31, 11);
  ctx.fillStyle='#1a4030'; ctx.font='bold 8px Courier New';
  ctx.fillText('SHOP', x+S/2-11, y-7);

  // 展示橱窗（特色！）
  px(x+4,  y+36, S-8, 18, '#b8e0f8');
  px(x+5,  y+37, S-10, 6, '#daf0ff'); // 玻璃反光
  // 橱窗里的小图标
  px(x+8,  y+42, 6, 7, '#f7f0d6'); px(x+9, y+43, 4, 3, '#fff'); // 蛋
  px(x+19, y+44, 10, 4, '#f08a24'); px(x+20, y+42, 3, 5, '#3a9438'); // 胡萝卜
  px(x+34, y+43, 18, 8, '#3a6ae8'); px(x+34, y+42, 18, 3, '#6a9aff'); // 小车
  px(x+39, y+45, 8, 5, '#c0e8f8');
  ctx.strokeStyle='#8a6030'; ctx.lineWidth=1.5;
  ctx.strokeRect(x+4.5, y+36.5, S-9, 17); // 窗框
  px(x+S/2, y+36, 1, 18, '#8a6030'); // 竖分格

  // 门
  px(x+S/2-9, y+50, 18, 22, '#c8a040');
  px(x+S/2-7, y+51, 14, 21, '#7a4818');
  px(x+S/2-5, y+52, 10,  9, '#a8d8f8'); // 门上窗
  px(x+S/2+3, y+63,  3,  4, '#e0c040'); // 把手

  // 靠近提示
  const near = dist(P.x+P.w/2, P.y+P.h, x+S/2, y+S/2) < S;
  if(near && !SHOP.open) drawBubble(x+S/2, y-20, 'Space');
}

// ── 屏幕空间商店菜单（在 ctx.restore() 之后调用）────────
function drawShopMenu(){
  const MW=360, MH=360;
  const mx=(VW-MW)/2|0, my=(VH-MH)/2|0;

  // backdrop
  ctx.fillStyle='rgba(20,14,34,0.60)';
  ctx.fillRect(0,0,VW,VH);

  // drop shadow
  ctx.fillStyle='rgba(0,0,0,0.45)';
  ctx.fillRect(mx+5, my+5, MW, MH);

  // panel border + fill
  px(mx,   my,   MW,   MH,   '#2a1e0e');
  px(mx+3, my+3, MW-6, MH-6, '#f5e8c0');
  px(mx+3, my+3, MW-6, 5,    '#e8c880');

  // title bar
  px(mx+3, my+3, MW-6, 32, '#c84a20');
  px(mx+3, my+3, MW-6, 5,  '#e87050');
  ctx.fillStyle='#fff8e0';
  ctx.font='bold 14px Courier New';
  ctx.textAlign='center';
  ctx.fillText('* Animal Shop *', mx+MW/2, my+24);
  ctx.textAlign='left';

  // divider
  px(mx+10, my+37, MW-20, 2, '#b08840');

  // items
  const items=[
    {label:'Swim Ring',   sub:'Walk on water',       icon:drawMenuIconFloatie,  price:'Egg x10 + Carrot x10',  afford:P.eggs>=10&&P.carrots>=10,   owned:P.hasFloatie},
    {label:'Fish Rod',    sub:'Fish near water',      icon:drawMenuIconFishRod,  price:'Egg x10 + Carrot x10',  afford:P.eggs>=10&&P.carrots>=10,   owned:P.fishRod},
    {label:'Chick',       sub:'Lays eggs',            icon:drawMenuIconChicken,  price:'Egg x20 + Carrot x10',  afford:P.eggs>=20&&P.carrots>=10,   owned:false},
    {label:'Dog',         sub:'50% night patrol',     icon:drawMenuIconDog,      price:'Egg x20 + Carrot x10',  afford:P.eggs>=20&&P.carrots>=10,   owned:false},
    {label:'Bee',         sub:'Collects honey',       icon:drawMenuIconBee,      price:'Egg x10 + Carrot x5',   afford:P.eggs>=10&&P.carrots>=5,    owned:false},
    {label:'Car',         sub:'3x speed  [X]',        icon:drawMenuIconCar,      price:'Egg x40 + Carrot x20',  afford:P.eggs>=40&&P.carrots>=20,   owned:P.hasCar},
    {label:'Sell Fish',   sub:`Have: ${P.fish} 🐟`,   icon:drawMenuIconSellFish, price:'1 Fish  →  5 Eggs',     afford:P.fish>0,                    owned:false},
    {label:'Sell Honey',  sub:`Have: ${P.honey} 🍯`,  icon:drawMenuIconSellHoney,price:'10 Honey → 1 Egg',      afford:P.honey>=10,                 owned:false},
  ];

  const ROW_H=36, ROW_START=my+41;
  for(let i=0;i<items.length;i++){
    const iy=ROW_START+i*ROW_H, it=items[i], sel=SHOP.cursor===i;
    if(sel){ px(mx+7,iy,MW-14,ROW_H,'#ffe8a0'); px(mx+7,iy,5,ROW_H,'#e8a020'); }
    else    { px(mx+7,iy,MW-14,ROW_H,i%2===0?'#f0dfa8':'#e8d498'); }

    ctx.fillStyle=sel?'#c04000':'#c0a870'; ctx.font='bold 13px Courier New';
    ctx.fillText(sel?'>':' ', mx+11, iy+25);

    it.icon(mx+24, iy+3);

    ctx.fillStyle=sel?'#2a0e00':'#5a3a10'; ctx.font=`bold ${sel?11:10}px Courier New`;
    ctx.fillText(it.label, mx+60, iy+14);
    ctx.fillStyle='#7a5828'; ctx.font='9px Courier New';
    ctx.fillText(it.sub, mx+60, iy+24);
    if(it.owned){ ctx.fillStyle='#1e8a1e'; ctx.font='bold 9px Courier New'; ctx.fillText('✓ Owned',mx+60,iy+34); }
    else { ctx.fillStyle=it.afford?'#1a6a1a':'#8a2020'; ctx.font='9px Courier New'; ctx.fillText(it.price,mx+60,iy+34); }
    if(sel&&it.afford&&!it.owned&&tick%30<15){ ctx.fillStyle='#40c040'; ctx.fillRect(mx+MW-18,iy+ROW_H/2-5,9,9); }
  }

  const fy=my+MH-28;
  px(mx+3,fy,MW-6,25,'#b07838'); px(mx+3,fy,MW-6,3,'#d0a060');
  ctx.fillStyle='#fff4d8'; ctx.font='bold 10px Courier New'; ctx.textAlign='center';
  ctx.fillText('[W / S]  Navigate      [Space]  Buy      [Q]  Close', mx+MW/2, fy+17);
  ctx.textAlign='left';
}

function drawSheepShopMenu(){
  const s=SHEEP[0];
  const MW=360, MH=360;
  const mx=(VW-MW)/2|0, my=(VH-MH)/2|0;

  ctx.fillStyle='rgba(20,14,34,0.60)'; ctx.fillRect(0,0,VW,VH);
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(mx+5,my+5,MW,MH);
  px(mx,my,MW,MH,'#1e1428');
  px(mx+3,my+3,MW-6,MH-6,'#f0e8d8');
  px(mx+3,my+3,MW-6,5,'#e0d0b0');
  px(mx+3,my+3,MW-6,32,'#7840b0');
  px(mx+3,my+3,MW-6,5,'#a060e0');
  ctx.fillStyle='#fff8e0'; ctx.font='bold 14px Courier New'; ctx.textAlign='center';
  ctx.fillText('* Sheep Shop *', mx+MW/2, my+24); ctx.textAlign='left';
  px(mx+10,my+37,MW-20,2,'#9060c0');

  const items=[
    {label:'Swim Ring',  sub:'Walk on water',       icon:drawMenuIconFloatie,   price:'Egg x10 + Carrot x10',  afford:P.eggs>=10&&P.carrots>=10,  owned:s.hasFloatie},
    {label:'Fish Rod',   sub:'Fish near water',      icon:drawMenuIconFishRod,   price:'Egg x10 + Carrot x10',  afford:P.eggs>=10&&P.carrots>=10,  owned:s.fishRod},
    {label:'Chick',      sub:'Lays eggs',            icon:drawMenuIconChicken,   price:'Egg x20 + Carrot x10',  afford:P.eggs>=20&&P.carrots>=10,  owned:false},
    {label:'Dog',        sub:'50% night patrol',     icon:drawMenuIconDog,       price:'Egg x20 + Carrot x10',  afford:P.eggs>=20&&P.carrots>=10,  owned:false},
    {label:'Bee',        sub:'Collects honey',       icon:drawMenuIconBee,       price:'Egg x10 + Carrot x5',   afford:P.eggs>=10&&P.carrots>=5,   owned:false},
    {label:'Car',        sub:'3x speed  [↑↓]',       icon:drawMenuIconCar,       price:'Egg x40 + Carrot x20',  afford:P.eggs>=40&&P.carrots>=20,  owned:s.hasCar},
    {label:'Sell Fish',  sub:`Have: ${s.fish} 🐟`,   icon:drawMenuIconSellFish,  price:'1 Fish  →  5 Eggs',     afford:s.fish>0,                   owned:false},
    {label:'Sell Honey', sub:`Have: ${P.honey} 🍯`,  icon:drawMenuIconSellHoney, price:'10 Honey → 1 Egg',      afford:P.honey>=10,                owned:false},
  ];

  const ROW_H=36, ROW_START=my+41;
  for(let i=0;i<items.length;i++){
    const iy=ROW_START+i*ROW_H, it=items[i], sel=SHOP.sheepCursor===i;
    if(sel){ px(mx+7,iy,MW-14,ROW_H,'#ffe8a0'); px(mx+7,iy,5,ROW_H,'#a040e0'); }
    else    { px(mx+7,iy,MW-14,ROW_H,i%2===0?'#f0dfa8':'#e8d498'); }
    ctx.fillStyle=sel?'#600090':'#9060c0'; ctx.font='bold 13px Courier New';
    ctx.fillText(sel?'>':' ',mx+11,iy+25);
    it.icon(mx+24,iy+3);
    ctx.fillStyle=sel?'#2a0840':'#5a3a10'; ctx.font=`bold ${sel?11:10}px Courier New`;
    ctx.fillText(it.label,mx+60,iy+14);
    ctx.fillStyle='#7a5828'; ctx.font='9px Courier New';
    ctx.fillText(it.sub,mx+60,iy+24);
    if(it.owned){ ctx.fillStyle='#1e8a1e'; ctx.font='bold 9px Courier New'; ctx.fillText('✓ Owned',mx+60,iy+34); }
    else { ctx.fillStyle=it.afford?'#1a6a1a':'#8a2020'; ctx.font='9px Courier New'; ctx.fillText(it.price,mx+60,iy+34); }
    if(sel&&it.afford&&!it.owned&&tick%30<15){ ctx.fillStyle='#a040e0'; ctx.fillRect(mx+MW-18,iy+ROW_H/2-5,9,9); }
  }
  const fy=my+MH-28;
  px(mx+3,fy,MW-6,25,'#6030a0'); px(mx+3,fy,MW-6,3,'#9060d0');
  ctx.fillStyle='#fff4d8'; ctx.font='bold 10px Courier New'; ctx.textAlign='center';
  ctx.fillText('[↑/↓] Navigate    [Enter] Buy/Sell    [Q] Close', mx+MW/2, fy+17);
  ctx.textAlign='left';
}

function drawFishMini(){
  const m=FISH_MINI;
  if(!m.active && m.resultT<=0) return;

  // 尺寸
  const BH=220, BW=52;      // 主水柱区
  const MX_OFF=BW+14;       // 捕获表 X 偏移
  const MW=18;               // 捕获表宽
  const PAD=36;              // 面板边距
  const panelW=BW+MW+MX_OFF+PAD*2-14;
  const panelH=BH+90;
  const px0=(VW-panelW)/2|0, py0=(VH-panelH)/2|0;
  const bx=px0+PAD, by=py0+54;

  // 整体背景面板
  ctx.fillStyle='rgba(4,12,30,0.82)'; ctx.fillRect(px0-4,py0-4,panelW+8,panelH+8);
  px(px0,py0,panelW,panelH,'#0d2240');
  px(px0+2,py0+2,panelW-4,panelH-4,'#132e52');
  px(px0+2,py0+2,panelW-4,3,'rgba(80,160,255,0.35)'); // 顶部高光

  // 标题
  const who=m.who==='rabbit'?'[ Space ]':'[ Enter ]';
  ctx.fillStyle='#7ad4ff'; ctx.font='bold 11px Courier New'; ctx.textAlign='center';
  ctx.fillText('🎣  Fishing  —  Hold '+who+' to rise', px0+panelW/2, py0+22);
  ctx.fillStyle='rgba(80,160,255,0.2)';
  ctx.fillRect(px0+2,py0+28,panelW-4,1);
  ctx.textAlign='left';

  // 结果界面
  if(!m.active){
    const ok=m.result==='catch';
    ctx.save();
    const a=Math.min(1,m.resultT/30);
    ctx.globalAlpha=a;
    ctx.font='bold 22px Courier New'; ctx.textAlign='center';
    ctx.fillStyle=ok?'#40ff80':'#ff5050';
    ctx.fillText(ok?'🐟  Got one!':'Gone...', px0+panelW/2, py0+panelH/2+8);
    if(ok){
      ctx.fillStyle='rgba(64,255,128,0.15)';
      ctx.fillRect(px0,py0,panelW,panelH);
    }
    ctx.restore();
    ctx.textAlign='left';
    return;
  }

  // ── 水柱区 ──────────────────────────────────────────
  // 深水渐变背景
  const grad=ctx.createLinearGradient(bx,by,bx,by+BH);
  grad.addColorStop(0,'#0e2d58');
  grad.addColorStop(1,'#071828');
  ctx.fillStyle=grad; ctx.fillRect(bx,by,BW,BH);

  // 水波纹
  for(let i=0;i<7;i++){
    const wy=by+14+i*28+(Math.sin(tick*0.03+i*0.8)*4|0);
    ctx.fillStyle=`rgba(80,160,240,${0.12+i%2*0.06})`;
    ctx.fillRect(bx+4,wy,BW-8,2);
  }

  // 气泡
  for(let i=0;i<4;i++){
    const bub_x=bx+8+(i*11+tick*0.15)%(BW-16);
    const bub_y=by+BH-8-((tick*0.4+i*55)%BH);
    ctx.fillStyle='rgba(180,230,255,0.25)';
    ctx.beginPath(); ctx.arc(bub_x,bub_y,2,0,Math.PI*2); ctx.fill();
  }

  // ── 绿色玩家条 ──────────────────────────────────────
  const pY=(by+m.barY*BH)|0, pH=Math.max(8,(m.barH*BH)|0);
  const inBar=m.fishY>=m.barY && m.fishY<=m.barY+m.barH;
  // 发光效果（在目标范围内时更亮）
  ctx.fillStyle=inBar?'rgba(60,230,80,0.80)':'rgba(60,200,60,0.55)';
  ctx.fillRect(bx,pY,BW,pH);
  // 顶边高光
  ctx.fillStyle=inBar?'#a0ffb0':'#60e070';
  ctx.fillRect(bx,pY,BW,3);
  // 底边阴影
  ctx.fillStyle='rgba(0,80,0,0.5)';
  ctx.fillRect(bx,pY+pH-2,BW,2);
  // 内部纹理横线
  ctx.fillStyle='rgba(255,255,255,0.08)';
  for(let y=pY+6;y<pY+pH-4;y+=5) ctx.fillRect(bx+3,y,BW-6,1);

  // ── 鱼图标 ──────────────────────────────────────────
  const fY=(by+m.fishY*BH)|0;
  const bob=(Math.sin(tick*0.14)*2)|0;
  const fishX=bx+BW/2;
  // 尾鳍
  ctx.fillStyle='#88ddff';
  ctx.beginPath();
  ctx.moveTo(fishX-14,fY+bob);
  ctx.lineTo(fishX-22,fY+bob-7);
  ctx.lineTo(fishX-22,fY+bob+7);
  ctx.closePath(); ctx.fill();
  // 身体
  ctx.fillStyle='#c0ecff';
  ctx.beginPath(); ctx.ellipse(fishX-4,fY+bob,13,7,0,0,Math.PI*2); ctx.fill();
  // 高光
  ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.ellipse(fishX-6,fY+bob-3,5,3,0,0,Math.PI*2); ctx.fill();
  // 眼睛
  ctx.fillStyle='#0a0a1a';
  ctx.beginPath(); ctx.arc(fishX+5,fY+bob-1,3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ffffff';
  ctx.beginPath(); ctx.arc(fishX+6,fY+bob-2,1,0,Math.PI*2); ctx.fill();
  // 鱼鳞纹
  ctx.strokeStyle='rgba(100,200,240,0.4)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(fishX-2,fY+bob,6,Math.PI*0.6,Math.PI*1.5); ctx.stroke();
  ctx.beginPath(); ctx.arc(fishX-8,fY+bob,5,Math.PI*0.5,Math.PI*1.4); ctx.stroke();

  // ── 水柱外框 ──────────────────────────────────────
  ctx.strokeStyle='#2a5888'; ctx.lineWidth=2;
  ctx.strokeRect(bx+1,by+1,BW-2,BH-2);

  // ── 捕获仪表 ────────────────────────────────────────
  const mx2=bx+MX_OFF;
  // 背景
  const mGrad=ctx.createLinearGradient(mx2,by,mx2,by+BH);
  mGrad.addColorStop(0,'#1a0808'); mGrad.addColorStop(1,'#0a0404');
  ctx.fillStyle=mGrad; ctx.fillRect(mx2,by,MW,BH);

  // 分段刻度
  for(let s=1;s<5;s++){
    ctx.fillStyle='rgba(255,255,255,0.12)';
    ctx.fillRect(mx2+2,by+(s/5*BH)|0,MW-4,1);
  }

  // 填充颜色（渐变：底红→中黄→顶绿）
  const fillH=(m.catchMeter*BH)|0;
  const fillY=(by+BH-fillH)|0;
  if(fillH>0){
    const mFill=ctx.createLinearGradient(mx2,fillY,mx2,fillY+fillH);
    mFill.addColorStop(0,'#60ff80');
    mFill.addColorStop(0.5,'#e8e040');
    mFill.addColorStop(1,'#ff4444');
    ctx.fillStyle=mFill; ctx.fillRect(mx2,fillY,MW,fillH);
    // 顶边高光
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillRect(mx2,fillY,MW,2);
  }

  // 捕获表外框
  ctx.strokeStyle='#4a2828'; ctx.lineWidth=1.5;
  ctx.strokeRect(mx2+.5,by+.5,MW-1,BH-1);

  // 标签
  ctx.fillStyle='#80b8ff'; ctx.font='bold 8px Courier New'; ctx.textAlign='center';
  ctx.fillText('CATCH', mx2+MW/2, by-8);
  // 百分比
  ctx.fillStyle='#ffe080'; ctx.font='bold 9px Courier New';
  ctx.fillText((m.catchMeter*100|0)+'%', mx2+MW/2, by+BH+14);
  ctx.textAlign='left';
}

function drawMenuIconFloatie(x, y){
  ctx.save(); ctx.lineWidth=5;
  for(let s=0;s<8;s++){
    const a1=(s/8)*Math.PI*2, a2=((s+1)/8)*Math.PI*2;
    ctx.strokeStyle=s%2===0?'#e84040':'#ffe060';
    ctx.beginPath(); ctx.arc(x+14,y+14,11,a1,a2); ctx.stroke();
  }
  ctx.restore();
}
function drawMenuIconChicken(x, y){
  px(x+7,  y+15, 16,12, '#fff4dc');
  px(x+8,  y+7,  9,10,  '#fff4dc');
  px(x+10, y+4,  3,4,   '#d93624');
  px(x+13, y+5,  3,4,   '#d93624');
  px(x+12, y+10, 3,3,   '#222');
  px(x+18, y+12, 6,3,   '#f0a020');
  px(x+7,  y+24, 3,5,   '#d08024');
  px(x+16, y+24, 3,5,   '#d08024');
}
function drawMenuIconDog(x, y){
  // 棕色小狗头（正面）
  px(x+2,  y+6,  8, 12, '#c8903a'); // 左耳
  px(x+20, y+6,  8, 12, '#c8903a'); // 右耳
  px(x+5,  y+8,  20,16, '#c8903a'); // 头
  px(x+7,  y+7,  16,14, '#e8b460'); // 浅色面部
  px(x+9,  y+12, 3,  3, '#2a1a0a'); // 左眼
  px(x+18, y+12, 3,  3, '#2a1a0a'); // 右眼
  px(x+10, y+9,  1,  1, '#fff');    // 左眼高光
  px(x+19, y+9,  1,  1, '#fff');    // 右眼高光
  px(x+10, y+18, 10, 5, '#d4a060'); // 吻部
  px(x+13, y+17, 4,  3, '#5a2a18'); // 鼻子
  // 红色颈圈
  px(x+5,  y+22, 20, 4, '#e83030');
  px(x+13, y+23, 4,  3, '#f0c040'); // 牌牌
}

function drawMenuIconCar(x, y){
  px(x+2,  y+12, 26,14, '#3a6ae8');
  px(x+2,  y+11, 26, 4, '#6a9aff');
  px(x+6,  y+14, 14, 8, '#c0e8f8');
  px(x+2,  y+9,  6,  2, '#ffe060');
  px(x+22, y+9,  6,  2, '#ffe060');
  px(x,    y+16, 5,  7, '#111'); px(x+1, y+17, 3,5, '#666');
  px(x+23, y+16, 5,  7, '#111'); px(x+24,y+17, 3,5, '#666');
}

function drawMenuIconFishRod(x, y){
  // 鱼竿杆
  ctx.save(); ctx.strokeStyle='#8a5a28'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(x+4,y+28); ctx.lineTo(x+26,y+4); ctx.stroke();
  // 钓线
  ctx.strokeStyle='#aaaaaa'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x+26,y+4); ctx.lineTo(x+28,y+20); ctx.stroke();
  // 鱼钩
  ctx.strokeStyle='#888'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(x+28,y+21,3,0,Math.PI); ctx.stroke();
  // 装饰小鱼
  px(x+4, y+18, 12,6, '#60c8f0');
  px(x+4, y+19, 4, 4, '#40a8d0'); // 尾
  px(x+12,y+19, 2, 2, '#111');    // 眼
  ctx.restore();
}

function drawMenuIconBee(x, y){
  const bob=Math.sin(tick*0.18)*1|0;
  px(x+5, y+4+(bob?1:0), 8, 5, 'rgba(200,240,255,0.7)');
  px(x+15,y+4+(bob?0:1), 8, 5, 'rgba(200,240,255,0.7)');
  px(x+6, y+10, 16, 9, '#ffd441');
  px(x+9, y+10, 3,  9, '#302010');
  px(x+15,y+10, 3,  9, '#302010');
  px(x+19,y+12, 4,  3, '#302010');
  px(x+5, y+12, 4,  4, '#302010');
}

function drawMenuIconSellFish(x, y){
  // 鱼
  px(x+2,  y+10, 18,10, '#60c8f0');
  px(x+2,  y+11, 5, 8,  '#40a8d0');
  px(x+14, y+12, 3, 3,  '#111');
  // 箭头 → 蛋
  ctx.fillStyle='#888'; ctx.font='bold 11px Courier New'; ctx.fillText('→',x+20,y+19);
  px(x+24, y+8, 8, 10, '#f7f0d6');
  px(x+23, y+11, 10, 7, '#eadfbf');
  px(x+26, y+9, 3,  3, '#ffffff');
}

function drawMenuIconSellHoney(x, y){
  // 蜂蜜罐
  px(x+8,  y+5,  14, 3, '#c89020'); // 盖子
  px(x+6,  y+8,  18,18, '#e8a020'); // 罐体
  px(x+7,  y+9,  16, 8, '#f0c040'); // 高光
  px(x+10, y+22, 10, 4, '#b87818'); // 底部
  // 箭头 → 蛋
  ctx.fillStyle='#888'; ctx.font='bold 9px Courier New'; ctx.fillText('→',x+24,y+18);
  px(x+28, y+10, 6, 8, '#f7f0d6');
  px(x+27, y+13, 8, 6, '#eadfbf');
}

function drawCar(rx, ry, dir){
  const ox=Math.floor(rx)-10, oy=Math.floor(ry)-4;
  const body='#3a6ae8', dark='#2248b0', shine='#6a9aff';
  const glass='#c0e8f8', wheel='#1a1a1a', rim='#888';
  const stripe='#ffe060';

  // 阴影
  ctx.fillStyle='rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.ellipse(ox+20, oy+38, 24, 7, 0, 0, Math.PI*2); ctx.fill();

  if(dir===2||dir===0){ // 正面/背面
    // 车轮
    px(ox-1,  oy+12, 7, 10, wheel); px(ox,    oy+13, 5, 8,  rim);
    px(ox+35, oy+12, 7, 10, wheel); px(ox+36, oy+13, 5, 8,  rim);
    px(ox,    oy+26, 6, 8,  wheel); px(ox+1,  oy+27, 4, 6,  rim);
    px(ox+35, oy+26, 6, 8,  wheel); px(ox+36, oy+27, 4, 6,  rim);
    // 车身
    px(ox+3,  oy+10, 36, 24, dark);
    px(ox+4,  oy+9,  34, 24, body);
    px(ox+5,  oy+8,  32, 4, shine);
    // 赛车条纹
    px(ox+4,  oy+19, 34, 4, stripe);
    // 前/后挡风玻璃
    if(dir===2){
      px(ox+8,  oy+26, 26, 7, glass);
      px(ox+10, oy+27, 8,  3, '#fff');
      // 车头灯
      px(ox+6,  oy+31, 7,  3, '#ffe860');
      px(ox+29, oy+31, 7,  3, '#ffe860');
    } else {
      px(ox+8,  oy+10, 26, 8, glass);
      px(ox+10, oy+11, 8,  3, '#fff');
      // 尾灯
      px(ox+6,  oy+9,  7,  3, '#ff4444');
      px(ox+29, oy+9,  7,  3, '#ff4444');
    }
  } else { // 侧面 (dir 1=右, 3=左)
    const flip = dir===3;
    const bx = flip ? ox+6 : ox+2;
    // 车轮
    px(bx,     oy+20, 9, 12, wheel); px(bx+1,   oy+21, 7, 10, rim);
    px(bx+24,  oy+20, 9, 12, wheel); px(bx+25,  oy+21, 7, 10, rim);
    // 车身
    px(bx-1,   oy+8,  42, 22, dark);
    px(bx,     oy+7,  40, 22, body);
    px(bx+1,   oy+6,  38, 4,  shine);
    // 赛车条纹
    px(bx,     oy+17, 40, 4, stripe);
    // 侧窗
    const wx = flip ? bx+24 : bx+2;
    px(wx, oy+9,  14, 12, glass);
    px(wx+2, oy+10, 6, 4, '#fff');
    // 车头/尾灯
    if(!flip){
      px(bx+36, oy+8,  4, 8, '#ffe860'); // 车头（右）
      px(bx,    oy+8,  3, 6, '#ff4444'); // 尾灯（左）
    } else {
      px(bx,    oy+8,  4, 8, '#ffe860'); // 车头（左）
      px(bx+37, oy+8,  3, 6, '#ff4444'); // 尾灯（右）
    }
  }
}

// 画在兔子之后：盖住兔子腰部以下，让兔子"坐进"车里
function drawCarOverlay(rx, ry, dir){
  const ox=Math.floor(rx)-10, oy=Math.floor(ry)-4;
  const body='#3a6ae8', dark='#2248b0', shine='#6a9aff';
  const glass='#c0e8f8', stripe='#ffe060';

  if(dir===2||dir===0){
    // 覆盖 ry+20~ry+36（兔子腰/腿区域）
    px(ox+3, oy+24, 36, 12, dark);
    px(ox+4, oy+23, 34, 12, body);
    px(ox+4, oy+23, 34,  3, shine);
    px(ox+4, oy+26, 34,  3, stripe);
    // dir=2 挡风玻璃恰好在覆盖区内，重画
    if(dir===2){
      px(ox+8,  oy+26, 26, 7, glass);
      px(ox+10, oy+27,  8, 3, '#fff');
      px(ox+6,  oy+31,  7, 3, '#ffe860');
      px(ox+29, oy+31,  7, 3, '#ffe860');
    }
  } else {
    const flip=dir===3, bx=flip?ox+6:ox+2;
    // 侧面：覆盖 ry+22~ry+34
    px(bx-1, oy+26, 42, 10, dark);
    px(bx,   oy+25, 40, 10, body);
    px(bx+1, oy+25, 38,  3, shine);
    px(bx,   oy+27, 40,  3, stripe);
    // 重画车灯（可能被覆盖）
    if(!flip){ px(bx+36,oy+8,4,8,'#ffe860'); px(bx,oy+8,3,6,'#ff4444'); }
    else     { px(bx,oy+8,4,8,'#ffe860');    px(bx+37,oy+8,3,6,'#ff4444'); }
  }
}

function emitCarExhaust(){
  if(!P.moving) return;
  if(tick%4!==0) return;
  let ex=P.x+P.w/2, ey=P.y+P.h;
  if(P.dir===0){ ey=P.y+P.h+4; }
  else if(P.dir===2){ ey=P.y-6; }
  else if(P.dir===1){ ex=P.x-14; ey=P.y+18; }
  else { ex=P.x+P.w+14; ey=P.y+18; }
  const colors=['rgba(200,200,200,0.7)','rgba(180,180,220,0.5)','rgba(160,160,200,0.4)'];
  EFFECTS.push({
    type:'spark',
    x:ex+(Math.random()*6-3),
    y:ey+(Math.random()*4-2),
    vx:(Math.random()-0.5)*0.4,
    vy:-0.6-Math.random()*0.5,
    life:22+Math.random()*14|0,
    color:colors[Math.random()*colors.length|0],
  });
}

function drawRabbitFloatie(rx, ry){
  if(!P.hasFloatie) return;
  const onWater=tileAt(rx+10, ry+22)===2||tileAt(rx+14, ry+22)===2;
  if(!onWater) return;
  const cx=Math.floor(rx+P.w/2);
  const cy=Math.floor(ry+21);
  const bob=Math.sin(tick*0.15)|0;
  ctx.save();
  ctx.lineWidth=6;
  const sections=8;
  for(let i=0;i<sections;i++){
    const a1=(i/sections)*Math.PI*2, a2=((i+1)/sections)*Math.PI*2;
    ctx.strokeStyle=i%2===0?'#e84040':'#ffe060';
    ctx.beginPath(); ctx.arc(cx, cy+bob, 14, a1, a2); ctx.stroke();
  }
  // 水波涟漪
  ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.ellipse(cx, cy+bob+3, 18, 5, 0, 0, Math.PI*2); ctx.stroke();
  // 高光
  ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(cx-4, cy+bob-7, 5, Math.PI*1.1, Math.PI*1.6); ctx.stroke();
  ctx.restore();
}

function drawBubble(bx, by, text){
  const tw=text.length*7+12;
  const lx=bx-tw/2|0, ly=by-26;
  px(lx,ly,tw,17,'#ffffffee');
  // 边框
  ctx.strokeStyle='#7a5025'; ctx.lineWidth=1.5;
  ctx.strokeRect(lx+0.5,ly+0.5,tw-1,16);
  // 小箭头
  ctx.fillStyle='#ffffffee';
  ctx.beginPath(); ctx.moveTo(bx-4,ly+16); ctx.lineTo(bx+4,ly+16); ctx.lineTo(bx,ly+22); ctx.fill();
  ctx.strokeStyle='#7a5025'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(bx-4,ly+16); ctx.lineTo(bx,ly+22); ctx.lineTo(bx+4,ly+16);
  ctx.stroke();
  ctx.fillStyle='#3a2010';
  ctx.font='bold 9px Courier New';
  ctx.fillText(text, lx+6, ly+12);
}

// ── HUD ──────────────────────────────────────────────


function farmTime(){
  const phase=(tick%DAY_CYCLE)/DAY_CYCLE;
  const minutes=Math.floor(phase*24*60);
  return {phase, hour:Math.floor(minutes/60), minute:minutes%60};
}

function nightAmount(){
  const {phase}=farmTime();
  const sun=Math.max(0, Math.sin((phase-0.25)*Math.PI*2));
  const duskBoost=Math.pow(1-Math.abs(Math.sin((phase-0.25)*Math.PI*2)), 3)*0.18;
  return Math.min(1, 1-sun+duskBoost);
}

function drawHUD(tick){
  px(4,4,460,22,'rgba(0,0,0,0.5)');
  ctx.fillStyle='#f5e642';
  ctx.font='bold 12px Courier New';
  const tm=farmTime();
  const hh=String(tm.hour).padStart(2,'0');
  const mm=String(tm.minute).padStart(2,'0');
  const floatieStr = P.hasFloatie ? ' 🏊' : '';
  const carStr = P.hasCar ? (P.carMode?' 🚗[X]关':' 🚗[X]开') : '';
  const honeyStr = P.honey>0 ? `  🍯x${P.honey}` : '';
  const fishStr  = P.fish>0  ? `  🐟x${P.fish}`  : '';
  const poopStr  = POOPS.length>0 ? `  💩x${POOPS.length}` : '';
  ctx.fillText(`🌾 Vibe Farm  ${hh}:${mm}  🥕x${P.carrots}  🥚x${P.eggs}${honeyStr}${fishStr}${poopStr}${floatieStr}${carStr}`, 10, 20);
}

function softShadow(cx, cy, rx, ry){
  ctx.fillStyle='rgba(0,0,0,0.16)';
  ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
}

function drawVignette(){
  const g=ctx.createRadialGradient(VW/2,VH/2,VH*0.34,VW/2,VH/2,VH*0.8);
  g.addColorStop(0,'rgba(0,0,0,0)');
  g.addColorStop(1,'rgba(18,14,34,0.30)');
  ctx.fillStyle=g; ctx.fillRect(0,0,VW,VH);
}

function drawDayNight(){
  const n=nightAmount();
  if(n>0.03){
    ctx.fillStyle=`rgba(30,38,86,${0.23*n})`;
    ctx.fillRect(0,0,VW,VH);
  }
  if(n>0.35){
    const sx=CAMPFIRE.x+14-cam.x;
    const sy=CAMPFIRE.y+11-cam.y;
    const pulse=1+Math.sin(tick*0.12)*0.06;
    const glow=ctx.createRadialGradient(sx,sy,8,sx,sy,118*pulse);
    glow.addColorStop(0,`rgba(255,216,106,${0.44*n})`);
    glow.addColorStop(0.36,`rgba(255,142,54,${0.24*n})`);
    glow.addColorStop(1,'rgba(255,142,54,0)');
    ctx.fillStyle=glow;
    ctx.fillRect(0,0,VW,VH);
  }
  const {phase}=farmTime();
  const warm=Math.pow(1-Math.abs(Math.sin((phase-0.25)*Math.PI*2)), 4);
  if(warm>0.02){
    ctx.fillStyle=`rgba(255,160,78,${0.09*warm})`;
    ctx.fillRect(0,0,VW,VH);
  }
  if(n>0.45){
    ctx.globalAlpha=Math.min(0.65,(n-0.35)*0.8);
    ctx.fillStyle='#fff7c8';
    for(let i=0;i<30;i++){
      const sx=(i*97 + Math.floor(cam.x*0.08))%VW;
      const sy=(i*53 + 19)%Math.floor(VH*0.42);
      px(sx,sy,1+(i%5===0?1:0),1,'#fff7c8');
    }
    ctx.globalAlpha=1;
  }
}

function draw(){
  ctx.clearRect(0,0,VW,VH);
  ctx.save();
  ctx.translate(-Math.round(cam.x), -Math.round(cam.y));

  // 仅绘制相机可见范围内的格子
  const c0=Math.max(0,(cam.x/T|0)-1), c1=Math.min(COLS,((cam.x+VW)/T|0)+2);
  const r0=Math.max(0,(cam.y/T|0)-1), r1=Math.min(ROWS,((cam.y+VH)/T|0)+2);

  // 地图底层
  for(let ty=r0;ty<r1;ty++){
    for(let tx=c0;tx<c1;tx++){
      const t=MAP[ty][tx];
      if(t===2){ drawWater(tx,ty,tick); continue; }
      if(t===4||t===5||t===6||t===7){
        // 先画草底
        const c=(tx+ty)%2===0?'#6bc96b':'#5db85d';
        px(tx*T,ty*T,T,T,c); continue;
      }
      if(t===8){
        const c=(tx+ty)%2===0?'#c2845a':'#ae7048';
        px(tx*T,ty*T,T,T,c); continue;
      }
      const cols=TCOL[t]||['#6bc96b','#5db85d'];
      px(tx*T,ty*T,T,T,cols[(tx+ty)%2]);

      if(t===3){ // 栅栏细节
        px(tx*T+2,ty*T+2,3,T-4,'#7a5025');
        px(tx*T+T-5,ty*T+2,3,T-4,'#7a5025');
        px(tx*T+2,ty*T+5,T-4,3,'#9a6835');
        px(tx*T+2,ty*T+T-8,T-4,3,'#9a6835');
        px(tx*T+5,ty*T+3,T-10,1,'rgba(255,230,150,0.18)');
      } else if(t===1 || t===9){
        px(tx*T+3,ty*T+5,4,2,'rgba(80,50,20,0.18)');
        px(tx*T+13,ty*T+12,6,2,'rgba(80,50,20,0.15)');
        px(tx*T+7,ty*T+19,3,2,'rgba(255,255,255,0.12)');
        if(t===1){
          px(tx*T+2,ty*T+8,T-4,1,'rgba(80,45,18,0.18)');
          px(tx*T+4,ty*T+17,T-8,1,'rgba(80,45,18,0.16)');
        }
      } else if(t===0){
        const seed=(tx*31+ty*17)%11;
        if(seed===0) px(tx*T+5,ty*T+15,2,5,'#469b47');
        if(seed===3) px(tx*T+15,ty*T+7,2,4,'#4faa50');
        if(seed===6){
          px(tx*T+9,ty*T+13,2,2,'#fff2a0');
          px(tx*T+11,ty*T+13,2,2,'#ffd060');
        }
      }
    }
  }

  // 小地物
  for(let ty=r0;ty<r1;ty++)
    for(let tx=c0;tx<c1;tx++)
      if(MAP[ty][tx]===5) drawFlower(tx,ty,tick);
      else if(MAP[ty][tx]===7) drawStone(tx,ty);
      else if(MAP[ty][tx]===8) drawCrop(tx,ty,tick);

  GRASS_PATCHES.forEach(g=>drawGrassPatchAt(g.x,g.y,g.eaten,tick));
  CARROTS.forEach(c=>drawCarrot(c,tick));
  POOPS.forEach(drawPoop);
  EGGS.forEach(drawEgg);
  drawSpawnFence();
  GARDENS.forEach(drawGarden);
  drawNests();
  drawCampfire();
  drawFountain();
  drawSeesaw();
  drawOctopus();
  drawTrampoline();
  drawBubbleRide();
  drawShop();

  // Y排序精灵列表
  const sprites=[];

  for(let ty=r0;ty<r1;ty++)
    for(let tx=c0;tx<c1;tx++)
      if(MAP[ty][tx]===4)
        sprites.push({y:ty*T+T*2, draw:()=>drawTree(tx,ty)});

  for(const s of SHEEP)
    sprites.push({y:s.y+18, draw:()=>{
      softShadow(s.x+11, s.y+19, 11, 4);
      drawSheep(s.x,s.y,s.dir);
      drawSheepBubbleShell();
      // 羊的游泳圈
      if(s.hasFloatie && (tileAt(s.x+11,s.y+20)===2)){
        const cx=Math.floor(s.x+11), cy=Math.floor(s.y+20);
        const bob=Math.sin(tick*0.15)|0;
        ctx.save(); ctx.lineWidth=5;
        for(let i=0;i<8;i++){
          const a1=(i/8)*Math.PI*2, a2=((i+1)/8)*Math.PI*2;
          ctx.strokeStyle=i%2===0?'#e84040':'#ffe060';
          ctx.beginPath(); ctx.arc(cx,cy+bob,11,a1,a2); ctx.stroke();
        }
        ctx.restore();
      }
      if(s.bubT>0) drawBubble(s.x+11, s.y-4, s.bubble);
      // 商店提示
      if(!s.rideMode && !SHOP.sheepOpen && dist(s.x+11,s.y+10,SHOP.x+61,SHOP.y+20)<76)
        drawBubble(s.x+11, s.y-4, 'Enter逛店');
      // 娱乐设施提示
      else if(!s.rideMode && !SHOP.sheepOpen){
        const sx=s.x+11, sy=s.y+10;
        if(!SEESAW.sheepSeated && SEESAW.cooldown<=0 && dist(sx,sy,SEESAW.x+28,SEESAW.y+12)<48)
          drawBubble(s.x+11,s.y-4,'Enter seesaw');
        else if(!TRAMPOLINE.sheepSeated && TRAMPOLINE.cooldown<=0 && dist(sx,sy,TRAMPOLINE.x+38,TRAMPOLINE.y+34)<56)
          drawBubble(s.x+11,s.y-4,'Enter jump');
        else if(!OCTOPUS.sheepSeated && OCTOPUS.cooldown<=0 && dist(sx,sy,OCTOPUS.x+42,OCTOPUS.y+36)<58)
          drawBubble(s.x+11,s.y-4,'Enter spin');
        else if(!BUBBLE_RIDE.sheepSeated && BUBBLE_RIDE.cooldown<=0 && dist(sx,sy,BUBBLE_RIDE.x+37,BUBBLE_RIDE.y+29)<56)
          drawBubble(s.x+11,s.y-4,'Enter bubble');
      }
    }});

  for(const c of CRITTERS)
    sprites.push({y:c.y+(c.type==='bee'?12:18), draw:()=>{
      if(c.type!=='bee') softShadow(c.x+11, c.y+19, 10, 4);
      drawCritter(c);
      if(c.bubT>0) drawBubble(c.x+11, c.y+(c.type==='bee'?4:0), c.bubble);
    }});

  sprites.push({
    y: P.y+P.h,
    draw:()=>{
      softShadow(P.x+P.w/2, P.y+P.h-1, P.carMode?22:10, P.carMode?8:4);
      if(P.carMode) drawCar(P.x, P.y, P.dir);
      drawRabbitFloatie(P.x, P.y);
      drawRabbit(P.x, P.y, P.dir, P.frame, true);
      drawRabbitChew(P.x, P.y, P.dir, tick);
      if(P.carMode) drawCarOverlay(P.x, P.y, P.dir);
      drawPlayerBubbleShell();
      if(bubT>0) drawBubble(P.x+P.w/2, P.y-4, bubble);
    }
  });

  sprites.sort((a,b)=>a.y-b.y);
  sprites.forEach(s=>s.draw());
  FLOATS.forEach(drawFloat);
  EFFECTS.forEach(drawEffect);

  ctx.restore();

  // 屏幕空间叠加层（不随相机滚动）
  drawDayNight();
  drawVignette();
  drawHUD(tick);
  if(SHOP.open) drawShopMenu();
  if(SHOP.sheepOpen) drawSheepShopMenu();
  drawFishMini();
  // 存档提示
  if(saveFlash>0){
    const a=Math.min(1, saveFlash/30);
    ctx.globalAlpha=a;
    px(VW/2-48, VH/2-14, 96, 22, 'rgba(20,14,34,0.75)');
    ctx.fillStyle='#ffe060'; ctx.font='bold 13px Courier New';
    ctx.textAlign='center'; ctx.fillText('💾  SAVED', VW/2, VH/2+3); ctx.textAlign='left';
    ctx.globalAlpha=1;
  }
}

// 启动前：把所有实体推到非实体格子，并让相机对准兔叽
