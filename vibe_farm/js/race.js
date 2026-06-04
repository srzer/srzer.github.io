// ── 赛车小游戏 ───────────────────────────────────────
// 兔叽与羊叽同时进入入口 → 分屏赛车

const LANE_W = 44;          // 单车道像素宽
const LANES  = 5;           // 车道数
const TRACK_W = LANES * LANE_W;  // 220px
const TRACK_LEN = 10400;     // 赛道总长（px）
const HALF_W = VW / 2;      // 408，每半屏宽

const RACE = {
  active: false,
  state:  'idle',
  cdT:    180,
  endT:   0,
  winner: 0,

  r: { lane:1, laneX:0, y:80, vy:0, laneT:0, boost:0, boostCd:0, stunT:0, finished:false },
  s: { lane:3, laneX:0, y:80, vy:0, laneT:0, boost:0, boostCd:0, stunT:0, finished:false },

  obstacles: [],
  crossers:  [],
  sparks:    [],   // {x, y, vx, vy, life, maxLife, color}  x/y 在赛道本地坐标
  impacts:   [],   // {x, y, text, life}  碰撞文字浮出
  shake:     0,    // 震屏强度
  spawnT:    80,
};

// ── 入口触发 ─────────────────────────────────────────
function checkRacePortal(){
  if(RACE.active) return;
  const rabIn = dist(P.x+P.w/2, P.y+P.h/2, RACE_PORTAL.x, RACE_PORTAL.y) < RACE_PORTAL.r;
  const shpIn = dist(SHEEP[0].x+11, SHEEP[0].y+9,  RACE_PORTAL.x, RACE_PORTAL.y) < RACE_PORTAL.r;
  if(rabIn && shpIn && SPACE_HIT){ startRace(); SPACE_HIT=false; }
}

function startRace(){
  RACE.active=true; RACE.state='countdown'; RACE.cdT=180; RACE.winner=0; RACE.endT=0;
  const r=RACE.r; r.lane=1; r.laneX=1*LANE_W+LANE_W/2; r.y=100; r.vy=0; r.laneT=0; r.boost=0; r.boostCd=0; r.stunT=0; r.finished=false;
  const s=RACE.s; s.lane=3; s.laneX=3*LANE_W+LANE_W/2; s.y=100; s.vy=0; s.laneT=0; s.boost=0; s.boostCd=0; s.stunT=0; s.finished=false;
  RACE.obstacles=[]; RACE.crossers=[]; RACE.spawnT=120;
  genObstacles();
}

function endRace(){
  RACE.active=false; RACE.state='idle';
  P.x=RACE_PORTAL.x-T; P.y=RACE_PORTAL.y+T;
  P.carMode=false;
  SHEEP[0].x=RACE_PORTAL.x+T; SHEEP[0].y=RACE_PORTAL.y+T;
}

function genObstacles(){
  const obs=RACE.obstacles;
  obs.length=0;
  for(let y=500; y<TRACK_LEN-200; y+=70+Math.random()*90|0){
    const lane=Math.floor(Math.random()*LANES);
    obs.push({lane, y, type:Math.random()<0.45?'cone':Math.random()<0.5?'stone':'bale'});
  }
}

// ── 更新 ─────────────────────────────────────────────
function updateRace(){
  if(RACE.state==='countdown'){
    if(--RACE.cdT<=0) RACE.state='racing';
    return;
  }
  if(RACE.state==='finished'){
    if(--RACE.endT<=0) endRace();
    return;
  }

  updateRacer(RACE.r, 'r');
  updateRacer(RACE.s, 's');
  checkCarCarCollision();
  spawnCrossers();
  updateCrossers();
  updateImpacts();
}

function updateRacer(r, who){
  const isR = who==='r';
  const accel  = isR ? KEYS['w']         : KEYS['arrowup'];
  const brake  = isR ? KEYS['s']         : KEYS['arrowdown'];
  const goLeft = isR ? KEYS['a']         : KEYS['arrowleft'];
  const goRight= isR ? KEYS['d']         : KEYS['arrowright'];
  const doBoost= isR ? SPACE_HIT         : SHEEP_ENTER_HIT;

  // 加速道具
  if(r.boostCd>0) r.boostCd--;
  if(r.boost>0)   r.boost--;
  if(doBoost && r.boostCd===0 && RACE.state==='racing'){
    r.boost=100; r.boostCd=320;
    if(isR) SPACE_HIT=false; else SHEEP_ENTER_HIT=false;
  }

  const maxV = r.stunT>0 ? 1 : (r.boost>0 ? 4.2 : 2.1);

  if(accel)  r.vy=Math.min(r.vy+0.12, maxV);
  else       r.vy=Math.max(0, r.vy-0.045);
  if(brake)  r.vy=Math.max(0, r.vy-0.20);
  if(r.stunT>0) r.stunT--;

  // 换道（带防抖）
  if(r.laneT>0){ r.laneT--; }
  else {
    if(goLeft  && r.lane>0)         { r.lane--; r.laneT=14; }
    if(goRight && r.lane<LANES-1)   { r.lane++; r.laneT=14; }
  }
  // 平滑横向插值
  const targetX = r.lane*LANE_W + LANE_W/2;
  r.laneX += (targetX-r.laneX)*0.18;

  r.y += r.vy;

  // 障碍物碰撞（像素距离）
  for(const obs of RACE.obstacles){
    const ox=obs.lane*LANE_W+LANE_W/2;
    if(Math.abs(ox-r.laneX)<22 && Math.abs(obs.y-r.y)<24 && !obs.hit){
      obs.hit=true; // 防止连续触发
      const force=r.vy;
      r.vy=Math.max(0.4, r.vy*0.28); r.stunT=65; r.boost=0;
      raceImpact(r.laneX, r.y, force, obs.type==='stone'?'💥 CRASH!':'💥 BANG!');
      setTimeout(()=>{ obs.hit=false; }, 500);
    }
  }
  // 冲过来的动物碰撞
  for(const a of RACE.crossers){
    if(Math.abs(a.y-r.y)<18 && Math.abs(a.x-r.laneX)<22 && !a.hit){
      a.hit=true;
      const force=r.vy;
      r.vy=Math.max(0.3, r.vy*0.42); r.stunT=38;
      raceImpact(r.laneX, r.y, force*0.7, '💥 OOF!');
    }
  }

  // 到达终点
  if(!r.finished && r.y>=TRACK_LEN){
    r.finished=true; r.vy=0;
    if(RACE.winner===0){
      RACE.winner=isR?1:2;
      RACE.state='finished'; RACE.endT=260;
    }
  }
}

function checkCarCarCollision(){
  const r=RACE.r, s=RACE.s;
  if(r.finished||s.finished) return;
  const dx=Math.abs(r.laneX-s.laneX), dy=Math.abs(r.y-s.y);
  if(dx<28 && dy<30){
    if(RACE._carColCd>0){ RACE._carColCd--; return; }
    RACE._carColCd=18; // 防止帧间重复触发
    const force=(r.vy+s.vy)/2;
    r.vy=Math.max(0.3, r.vy*0.40); s.vy=Math.max(0.3, s.vy*0.40);
    r.stunT=Math.max(r.stunT,50); s.stunT=Math.max(s.stunT,50);
    // 横向弹开
    if(r.laneX<=s.laneX){ if(r.lane>0) r.lane--; if(s.lane<LANES-1) s.lane++; }
    else                 { if(r.lane<LANES-1) r.lane++; if(s.lane>0) s.lane--; }
    r.boost=0; s.boost=0;
    const mx=(r.laneX+s.laneX)/2, my=(r.y+s.y)/2;
    raceImpact(mx, my, force, '💥 CRASH!!');
    RACE.shake=12;
  } else {
    if((RACE._carColCd||0)>0) RACE._carColCd--;
  }
}

// ── 碰撞特效 ─────────────────────────────────────────
function raceImpact(x, y, force, text){
  const count = 8+Math.min(14, force*3|0);
  const cols=['#ffee00','#ff9900','#ffffff','#ff4400','#ffcc44'];
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2;
    const sp=1.2+Math.random()*Math.max(1,force*0.6);
    RACE.sparks.push({
      x, y,
      vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-0.8,
      life:22+Math.random()*22|0,
      maxLife:44,
      color:cols[Math.random()*cols.length|0],
    });
  }
  RACE.impacts.push({x, y, text, life:52});
  if(RACE.shake<8) RACE.shake=8;
}

function updateImpacts(){
  for(let i=RACE.sparks.length-1;i>=0;i--){
    const sp=RACE.sparks[i];
    sp.x+=sp.vx; sp.y+=sp.vy; sp.vy+=0.08; sp.life--;
    if(sp.life<=0) RACE.sparks.splice(i,1);
  }
  for(let i=RACE.impacts.length-1;i>=0;i--){
    RACE.impacts[i].life--;
    if(RACE.impacts[i].life<=0) RACE.impacts.splice(i,1);
  }
  if(RACE.shake>0) RACE.shake*=0.78;
}

function spawnCrossers(){
  RACE.spawnT--;
  if(RACE.spawnT>0) return;
  RACE.spawnT=80+Math.random()*100|0;
  const ahead = Math.min(RACE.r.y,RACE.s.y);
  const spawnY = ahead + VH*0.6 + Math.random()*200;
  if(spawnY>TRACK_LEN-120) return;
  const fromLeft = Math.random()<0.5;
  RACE.crossers.push({
    x: fromLeft ? -30 : TRACK_W+30,
    y: spawnY,
    dx: fromLeft ? 1.8+Math.random()*1.2 : -(1.8+Math.random()*1.2),
    life: 220,
    type: ['dog','cat','chicken','bee'][Math.random()*4|0],
  });
}

function updateCrossers(){
  for(let i=RACE.crossers.length-1;i>=0;i--){
    const a=RACE.crossers[i];
    a.x+=a.dx; a.life--;
    if(a.life<=0||a.x<-60||a.x>TRACK_W+60) RACE.crossers.splice(i,1);
  }
}

// ── 绘制 ─────────────────────────────────────────────
function drawRace(){
  ctx.fillStyle='#111'; ctx.fillRect(0,0,VW,VH);

  // 左半屏：兔叽视角
  ctx.save();
  ctx.beginPath(); ctx.rect(0,0,HALF_W,VH); ctx.clip();
  drawHalf(0, RACE.r, RACE.s, true);
  ctx.restore();

  // 右半屏：羊叽视角
  ctx.save();
  ctx.beginPath(); ctx.rect(HALF_W,0,HALF_W,VH); ctx.clip();
  drawHalf(HALF_W, RACE.s, RACE.r, false);
  ctx.restore();

  // 中间分割线
  ctx.fillStyle='#f0f0f0';
  ctx.fillRect(HALF_W-2,0,4,VH);

  drawRaceHUD();
}

function trackLeft(xOff){ return xOff + (HALF_W-TRACK_W)/2; }
function worldToScreenY(worldY, camY){ return camY - worldY + VH/2; }

function drawHalf(xOff, self, other, isRabbit){
  // 震屏偏移
  const shk = RACE.shake>0.5 ? (Math.random()-0.5)*RACE.shake : 0;
  const camY = self.y;
  const tx   = trackLeft(xOff) + shk|0;

  // 草地背景
  ctx.fillStyle='#3d8a34'; ctx.fillRect(xOff,0,HALF_W,VH);
  // 草地纹理
  ctx.fillStyle='#357a2d';
  for(let y=0;y<VH;y+=24) ctx.fillRect(xOff,y,HALF_W,10);

  // 路面
  ctx.fillStyle='#555a60'; ctx.fillRect(tx,0,TRACK_W,VH);
  // 路面纹理竖条
  ctx.fillStyle='rgba(0,0,0,0.12)';
  for(let i=0;i<LANES+1;i++) ctx.fillRect(tx+i*LANE_W,0,3,VH);

  // 路缘石（赛道两侧红白相间）
  for(let wy=0; wy<TRACK_LEN; wy+=32){
    const sy=worldToScreenY(wy,camY);
    if(sy<-32||sy>VH+32) continue;
    const col=(wy/32|0)%2===0?'#dd2222':'#ffffff';
    ctx.fillStyle=col;
    ctx.fillRect(tx-12,sy,12,32);
    ctx.fillRect(tx+TRACK_W,sy,12,32);
  }

  // 车道虚线
  ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=2;
  ctx.setLineDash([28,22]);
  for(let l=1;l<LANES;l++){
    ctx.beginPath();
    ctx.moveTo(tx+l*LANE_W, 0); ctx.lineTo(tx+l*LANE_W, VH);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // 起跑线（y=150附近）
  drawChecker(tx, worldToScreenY(150, camY), TRACK_W, 12, 0);

  // 终点线
  drawChecker(tx, worldToScreenY(TRACK_LEN, camY), TRACK_W, 16, 1);
  // 终点旗
  const finY = worldToScreenY(TRACK_LEN-60, camY);
  if(finY>-40&&finY<VH+40){
    ctx.fillStyle='#fff'; ctx.font='bold 13px Courier New'; ctx.textAlign='center';
    ctx.fillText('🏁 FINISH 🏁', tx+TRACK_W/2, finY-6);
    ctx.textAlign='left';
  }

  // 距离标记
  for(let dist=500; dist<TRACK_LEN; dist+=500){
    const dsy=worldToScreenY(dist,camY);
    if(dsy<0||dsy>VH) continue;
    ctx.fillStyle='rgba(255,255,200,0.7)'; ctx.font='9px Courier New'; ctx.textAlign='left';
    ctx.fillText(`${dist}m`, tx+4, dsy-3);
    ctx.textAlign='left';
  }

  // 障碍物
  for(const obs of RACE.obstacles){
    const sy=worldToScreenY(obs.y, camY);
    if(sy<-40||sy>VH+40) continue;
    const ox=tx+obs.lane*LANE_W+LANE_W/2;
    drawObstacle(ox,sy,obs.type);
  }

  // 冲过来的动物
  for(const a of RACE.crossers){
    const sy=worldToScreenY(a.y, camY);
    if(sy<-30||sy>VH+30) continue;
    drawCrosser(tx+a.x, sy, a.type);
  }

  // 对方赛车
  const otherSY = worldToScreenY(other.y, camY);
  if(otherSY>-50&&otherSY<VH+50)
    drawRaceCar(tx+other.laneX, otherSY, !isRabbit, other.stunT, other.boost);

  // 自己（永远在屏幕中央）
  drawRaceCar(tx+self.laneX, VH/2, isRabbit, self.stunT, self.boost);

  // ── 火花粒子 ──────────────────────────────────────
  for(const sp of RACE.sparks){
    const sy=worldToScreenY(sp.y, camY);
    if(sy<-20||sy>VH+20) continue;
    const sx=tx+sp.x;
    const a=sp.life/sp.maxLife;
    ctx.globalAlpha=Math.max(0,a*0.9);
    ctx.fillStyle=sp.color;
    const sz=Math.max(1,a*4|0);
    ctx.fillRect(sx-sz/2|0, sy-sz/2|0, sz, sz);
    ctx.globalAlpha=1;
  }

  // ── 碰撞文字浮出 ─────────────────────────────────
  ctx.textAlign='center';
  for(const im of RACE.impacts){
    const sy=worldToScreenY(im.y, camY)-((52-im.life)*0.6|0);
    if(sy<-20||sy>VH+20) continue;
    const sx=tx+im.x;
    const a=Math.min(1, im.life/18);
    ctx.globalAlpha=a;
    ctx.font='bold 15px Courier New';
    ctx.fillStyle='#000';  ctx.fillText(im.text, sx+2, sy+2);
    ctx.fillStyle='#ffee00'; ctx.fillText(im.text, sx, sy);
    ctx.globalAlpha=1;
  }
  ctx.textAlign='left';

  // 玩家标签
  ctx.fillStyle=isRabbit?'#a0c8ff':'#ffc8a0';
  ctx.font='bold 11px Courier New';
  ctx.fillText(isRabbit?'🐰 BUNNY':'🐑 SHEEP', xOff+6, 16);

  // 速度条
  drawSpeedBar(xOff+6, 22, self);

  // Boost 指示器
  drawBoostIndicator(xOff+6, 54, self);
}

function drawChecker(x, y, w, h, style){
  const sz=8;
  for(let ix=0;ix<w;ix+=sz){
    for(let iy=0;iy<h;iy+=sz){
      const even=((ix/sz|0)+(iy/sz|0))%2===0;
      ctx.fillStyle=(style===0)
        ? (even?'#ffffff':'#000000')
        : (even?'#ffdd00':'#000000');
      ctx.fillRect(x+ix,y+iy,sz,sz);
    }
  }
}

function drawRaceCar(cx, cy, isRabbit, stunT, boost){
  cx=Math.floor(cx); cy=Math.floor(cy);
  const C  = isRabbit ? '#3060e8' : '#e03020';
  const CD = isRabbit ? '#1840a0' : '#a01010';
  const CH = isRabbit ? '#88aaff' : '#ff8866';
  const W  = '#1a1a1a', R = '#777';

  // 阴影
  ctx.fillStyle='rgba(0,0,0,0.28)';
  ctx.beginPath(); ctx.ellipse(cx,cy+16,14,5,0,0,Math.PI*2); ctx.fill();

  // 车轮
  const wheels=[[-13,-12],[ 8,-12],[-13, 8],[ 8, 8]];
  for(const [wx,wy] of wheels){
    ctx.fillStyle=W; ctx.fillRect(cx+wx,cy+wy,6,10);
    ctx.fillStyle=R; ctx.fillRect(cx+wx+1,cy+wy+1,4,8);
  }

  // 车身
  ctx.fillStyle=CD; ctx.fillRect(cx-10,cy-16,22,32);
  ctx.fillStyle=C;  ctx.fillRect(cx-9, cy-17,22,32);
  ctx.fillStyle=CH; ctx.fillRect(cx-8, cy-16,20,4);

  // 挡风玻璃
  ctx.fillStyle='#b0d8f8'; ctx.fillRect(cx-7,cy-14,16,9);
  ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillRect(cx-5,cy-13,5,3);

  // 车头灯
  ctx.fillStyle='#ffe870'; ctx.fillRect(cx-8,cy-18,5,3); ctx.fillRect(cx+3,cy-18,5,3);
  // 尾灯
  ctx.fillStyle='#ff3333'; ctx.fillRect(cx-8,cy+13,5,3); ctx.fillRect(cx+3,cy+13,5,3);

  // 赛车条纹
  ctx.fillStyle='#ffe060'; ctx.fillRect(cx-9,cy-4,22,4);

  // 被撞特效：星光 + 闪白
  if(stunT>0){
    if(tick%6<3){
      ctx.fillStyle='rgba(255,255,255,0.55)';
      ctx.fillRect(cx-11,cy-19,24,36);
    }
    // 震动小星
    const stars=['★','✦','✸'];
    ctx.font='11px sans-serif'; ctx.textAlign='center';
    for(let i=0;i<3;i++){
      const a=(tick*0.25+i*2.1);
      const sr=18, sx2=cx+Math.cos(a)*sr, sy2=cy-20+Math.sin(a)*8;
      ctx.fillStyle=['#ffee00','#ff8800','#fff'][i];
      ctx.fillText(stars[i], sx2, sy2);
    }
    ctx.textAlign='left';
  }

  // 加速特效（尾部火焰）
  if(boost>0){
    const flick=Math.sin(tick*0.4)*2|0;
    ctx.fillStyle='#ff9900'; ctx.fillRect(cx-5,cy+14+flick,12,8);
    ctx.fillStyle='#ffee00'; ctx.fillRect(cx-3,cy+15+flick,8,5);
    ctx.fillStyle='#fff';    ctx.fillRect(cx-1,cy+16+flick,4,3);
  }

  // 角色标识
  ctx.font='11px sans-serif'; ctx.textAlign='center';
  ctx.fillText(isRabbit?'🐰':'🐑', cx, cy+5);
  ctx.textAlign='left';
}

function drawObstacle(cx, cy, type){
  cx=Math.floor(cx); cy=Math.floor(cy);
  if(type==='cone'){
    ctx.fillStyle='#ff6800';
    ctx.beginPath(); ctx.moveTo(cx,cy-14); ctx.lineTo(cx-9,cy+8); ctx.lineTo(cx+9,cy+8); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#ffffff'; ctx.fillRect(cx-7,cy-2,14,3);
  } else if(type==='stone'){
    ctx.fillStyle='#7a8090';
    ctx.beginPath(); ctx.ellipse(cx,cy,12,8,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#a0a8b4';
    ctx.beginPath(); ctx.ellipse(cx-3,cy-2,5,3,0,0,Math.PI*2); ctx.fill();
  } else { // bale
    ctx.fillStyle='#c8a040'; ctx.fillRect(cx-11,cy-8,22,16);
    ctx.fillStyle='#e8c060'; ctx.fillRect(cx-10,cy-7,20,5);
    for(let i=0;i<3;i++){ ctx.fillStyle='#a07830'; ctx.fillRect(cx-10,cy-7+i*5,20,1); }
  }
}

function drawCrosser(cx, cy, type){
  cx=Math.floor(cx); cy=Math.floor(cy);
  const colors={dog:'#b87534',cat:'#6f737a',chicken:'#fff4dc',bee:'#ffd441'};
  ctx.fillStyle=colors[type]||'#888';
  ctx.beginPath(); ctx.ellipse(cx,cy,10,7,0,0,Math.PI*2); ctx.fill();
  ctx.font='13px sans-serif'; ctx.textAlign='center';
  ctx.fillText({dog:'🐕',cat:'🐱',chicken:'🐔',bee:'🐝'}[type]||'🐾',cx,cy+5);
  ctx.textAlign='left';
}

function drawSpeedBar(x, y, r){
  const W=80, H=8;
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(x,y,W,H);
  const frac=Math.min(1,r.vy/(r.boost>0?6.2:4.2));
  const col=r.boost>0?'#ffcc00':frac>0.7?'#40e060':frac>0.4?'#e0e040':'#e06040';
  ctx.fillStyle=col; ctx.fillRect(x,y,W*frac|0,H);
  ctx.strokeStyle='#888'; ctx.lineWidth=1; ctx.strokeRect(x,y,W,H);
  ctx.fillStyle='#fff'; ctx.font='7px Courier New';
  ctx.fillText('SPD', x+2, y+H-1);
}

function drawBoostIndicator(x, y, r){
  const W=80, H=7;
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(x,y,W,H);
  if(r.boost>0){
    const frac=r.boost/100;
    ctx.fillStyle='#ffcc00'; ctx.fillRect(x,y,W*frac|0,H);
    if(tick%12<6){ ctx.fillStyle='#fff'; ctx.font='7px Courier New'; ctx.fillText('BOOST!',x+18,y+H-1); }
  } else {
    const frac=1-Math.min(1,r.boostCd/320);
    ctx.fillStyle=frac>=1?'#40d0ff':'#2860a0'; ctx.fillRect(x,y,W*frac|0,H);
    ctx.fillStyle='#aaa'; ctx.font='7px Courier New';
    ctx.fillText(frac>=1?'BOOST RDY':'BOOST CD',x+2,y+H-1);
  }
  ctx.strokeStyle='#888'; ctx.lineWidth=1; ctx.strokeRect(x,y,W,H);
}

function drawRaceHUD(){
  ctx.textAlign='center';

  if(RACE.state==='countdown'){
    const n=Math.ceil(RACE.cdT/60);
    const txt=n>0?String(n):'GO!';
    const col=n>0?'#ffee00':'#40ff80';
    ctx.font='bold 72px Courier New';
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillText(txt, VW/2+3, VH/2+53);
    ctx.fillStyle=col; ctx.fillText(txt, VW/2, VH/2+50);
  }

  if(RACE.state==='finished'){
    const winner = RACE.winner===1 ? '🐰 BUNNY WINS!' : '🐑 SHEEP WINS!';
    const a=Math.min(1,RACE.endT/40);
    ctx.globalAlpha=a;
    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.fillRect(VW/2-200, VH/2-50, 400, 80);
    ctx.font='bold 28px Courier New';
    ctx.fillStyle='#ffee44';
    ctx.fillText(winner, VW/2, VH/2+8);
    ctx.font='12px Courier New';
    ctx.fillStyle='#ccc';
    ctx.fillText('Returning to farm...', VW/2, VH/2+30);
    ctx.globalAlpha=1;
  }

  ctx.textAlign='left';
}

// ── 入口建筑（在主地图里画）────────────────────────────
function drawRacePortal(){
  const x=RACE_PORTAL.x, y=RACE_PORTAL.y, r=RACE_PORTAL.r;
  const cx=x, cy=y;
  const pulse=1+Math.sin(tick*0.08)*0.12;

  // 地面发光
  ctx.save();
  const grd=ctx.createRadialGradient(cx,cy,8,cx,cy,r*pulse);
  grd.addColorStop(0,'rgba(255,220,0,0.30)');
  grd.addColorStop(1,'rgba(255,160,0,0)');
  ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(cx,cy,r*pulse,0,Math.PI*2); ctx.fill();

  // 跑道标记线
  ctx.strokeStyle='rgba(255,200,0,0.70)'; ctx.lineWidth=2; ctx.setLineDash([8,8]);
  ctx.beginPath(); ctx.arc(cx,cy,r*0.85,0,Math.PI*2); ctx.stroke();
  ctx.setLineDash([]);

  // 棋格旗图标
  ctx.font='26px sans-serif'; ctx.textAlign='center';
  ctx.fillText('🏁', cx, cy+9);

  // 文字标签
  ctx.font='bold 8px Courier New'; ctx.fillStyle='#ffe060';
  ctx.fillText('RACE', cx, cy+24);
  ctx.restore();
  ctx.textAlign='left';

  // 双人靠近时显示提示
  const rabIn=dist(P.x+P.w/2,P.y+P.h/2,cx,cy)<r;
  const shpIn=dist(SHEEP[0].x+11,SHEEP[0].y+9,cx,cy)<r;
  if(rabIn&&shpIn) drawBubble(cx, cy-r-6, 'Space! RACE!');
  else if(rabIn||shpIn) drawBubble(cx, cy-r-6, '需要两人进入');
}
