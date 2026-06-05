// ── 赛车小游戏 v2 ──────────────────────────────────────
// 🐰 WASD: W加速  S刹车  A/D变道  Space=Boost
// 🐑 方向键: ↑加速  ↓刹车  ←/→变道  Enter=Boost
// 不按键自动巡航；道路有弯道（扫描线渲染）

const TRACK_W   = 220;
const TRACK_LEN = 10400;
const HALF_W    = VW / 2;
const CRUISE_SPD = 1.8;
const MAX_SPD    = 3.0;
const BOOST_SPD  = 4.8;

const RACE = {
  active:false, state:'idle', cdT:180, endT:0, winner:0,
  trackSegs:[],   // [{len, curve}]  curve=px/unit 横向偏移率

  // x=道路中心偏移(-TRACK_W/2~TRACK_W/2), y=沿赛道距离
  r:{ x:-30, y:80, speed:0, steerX:0, boost:0, boostCd:0, stunT:0, finished:false },
  s:{ x: 30, y:80, speed:0, steerX:0, boost:0, boostCd:0, stunT:0, finished:false },

  obstacles:[], crossers:[], sparks:[], impacts:[],
  shake:0, spawnT:80, _carColCd:0,
};

// ── 赛道生成 ─────────────────────────────────────────────
function genTrackSegs(){
  const segs=[];
  let total=0;
  segs.push({len:400,curve:0}); total+=400;
  while(total < TRACK_LEN-500){
    const c=(Math.random()-0.5)*0.28;
    const clen=220+Math.random()*420|0;
    segs.push({len:clen,curve:c}); total+=clen;
    if(Math.random()<0.55){
      const slen=120+Math.random()*200|0;
      segs.push({len:slen,curve:0}); total+=slen;
    }
  }
  segs.push({len:TRACK_LEN-total,curve:0});
  return segs;
}

function getTrackCurveAt(y){
  let offset=0, rem=Math.max(0,y);
  for(const seg of RACE.trackSegs){
    if(rem<=0) break;
    const take=Math.min(rem,seg.len);
    offset+=seg.curve*take; rem-=take;
  }
  return offset;
}

function getInstantCurve(y){
  let rem=Math.max(0,y);
  for(const seg of RACE.trackSegs){
    if(rem<=seg.len) return seg.curve;
    rem-=seg.len;
  }
  return 0;
}

// ── 入口触发 ─────────────────────────────────────────────
function checkRacePortal(){
  if(RACE.active) return;
  const rabIn=dist(P.x+P.w/2,P.y+P.h/2,RACE_PORTAL.x,RACE_PORTAL.y)<RACE_PORTAL.r;
  const shpIn=dist(SHEEP[0].x+11,SHEEP[0].y+9,RACE_PORTAL.x,RACE_PORTAL.y)<RACE_PORTAL.r;
  if(rabIn&&shpIn&&SPACE_HIT){ startRace(); SPACE_HIT=false; }
}

function startRace(){
  RACE.active=true; RACE.state='countdown'; RACE.cdT=180; RACE.winner=0; RACE.endT=0;
  RACE.trackSegs=genTrackSegs();
  const r=RACE.r; r.x=-30; r.y=80; r.speed=0; r.steerX=0; r.boost=0; r.boostCd=0; r.stunT=0; r.finished=false;
  const s=RACE.s; s.x= 30; s.y=80; s.speed=0; s.steerX=0; s.boost=0; s.boostCd=0; s.stunT=0; s.finished=false;
  RACE.obstacles=[]; RACE.crossers=[]; RACE.sparks=[]; RACE.impacts=[];
  RACE.shake=0; RACE.spawnT=120; RACE._carColCd=0;
  genObstacles();
}

function endRace(){
  RACE.active=false; RACE.state='idle';
  P.x=RACE_PORTAL.x-T; P.y=RACE_PORTAL.y+T; P.carMode=false;
  SHEEP[0].x=RACE_PORTAL.x+T; SHEEP[0].y=RACE_PORTAL.y+T;
}

function genObstacles(){
  RACE.obstacles.length=0;
  for(let y=600;y<TRACK_LEN-300;y+=60+Math.random()*90|0){
    const x=(Math.random()-0.5)*(TRACK_W-50);
    RACE.obstacles.push({x,y,hit:false,
      type:Math.random()<0.45?'cone':Math.random()<0.5?'stone':'bale'});
  }
}

// ── 主更新 ───────────────────────────────────────────────
function updateRace(){
  if(RACE.state==='countdown'){ if(--RACE.cdT<=0) RACE.state='racing'; return; }
  if(RACE.state==='finished'){  if(--RACE.endT<=0) endRace(); return; }
  updateRacer(RACE.r,'r');
  updateRacer(RACE.s,'s');
  checkCarCarCollision();
  spawnCrossers();
  updateCrossers();
  updateImpacts();
}

function updateRacer(r,who){
  const isR=who==='r';
  const accel   = isR ? KEYS['w']         : KEYS['arrowup'];
  const brake   = isR ? KEYS['s']         : KEYS['arrowdown'];
  const goLeft  = isR ? KEYS['a']         : KEYS['arrowleft'];
  const goRight = isR ? KEYS['d']         : KEYS['arrowright'];
  const doBoost = isR ? SPACE_HIT         : SHEEP_ENTER_HIT;

  if(r.boostCd>0) r.boostCd--;
  if(r.boost>0)   r.boost--;
  if(doBoost&&r.boostCd===0&&RACE.state==='racing'){
    r.boost=100; r.boostCd=320;
    if(isR) SPACE_HIT=false; else SHEEP_ENTER_HIT=false;
  }
  if(r.stunT>0) r.stunT--;

  const topSpd = r.stunT>0 ? 0.5 : (r.boost>0 ? BOOST_SPD : MAX_SPD);
  const cruise  = r.stunT>0 ? 0   : CRUISE_SPD;

  // 速度：W加速，S刹车，否则滑向巡航速
  if(accel)      r.speed=Math.min(topSpd, r.speed+0.13);
  else if(brake) r.speed=Math.max(0,      r.speed-0.26);
  else           r.speed+=(cruise-r.speed)*0.022;

  // 变道横向速度
  const maxSteer=2.6*Math.min(1,r.speed/1.8);
  if(goLeft)  r.steerX=Math.max(-maxSteer, r.steerX-0.24);
  if(goRight) r.steerX=Math.min( maxSteer, r.steerX+0.24);
  else        r.steerX*=0.82;

  // 前进
  r.y+=r.speed;

  // 弯道离心漂移
  const curve=getInstantCurve(r.y);
  r.x-=curve*r.speed*0.75;

  // 横向移动
  r.x+=r.steerX;
  r.steerX=Math.max(-4,Math.min(4,r.steerX));

  // 撞边墙
  const edge=TRACK_W/2-13;
  if(r.x>edge){
    const pen=r.x-edge; r.x=edge;
    r.steerX=Math.min(0,r.steerX*-0.35);
    r.speed=Math.max(0.2,r.speed*(pen>5?0.70:0.88));
    if(pen>5){ r.stunT=Math.max(r.stunT,20); raceImpact(r.x,r.y,pen,'💥 WALL!'); }
  }
  if(r.x<-edge){
    const pen=-edge-r.x; r.x=-edge;
    r.steerX=Math.max(0,r.steerX*-0.35);
    r.speed=Math.max(0.2,r.speed*(pen>5?0.70:0.88));
    if(pen>5){ r.stunT=Math.max(r.stunT,20); raceImpact(r.x,r.y,pen,'💥 WALL!'); }
  }

  // 障碍物
  for(const obs of RACE.obstacles){
    if(Math.abs(obs.x-r.x)<18&&Math.abs(obs.y-r.y)<22&&!obs.hit){
      obs.hit=true;
      r.speed=Math.max(0.3,r.speed*0.30); r.stunT=70; r.boost=0; r.steerX*=-0.5;
      raceImpact(r.x,r.y,r.speed,obs.type==='stone'?'💥 CRASH!':'💥 BANG!');
      setTimeout(()=>{ obs.hit=false; },600);
    }
  }

  // 横穿动物（crosser.x 已是道路中心坐标）
  for(const a of RACE.crossers){
    if(Math.abs(a.x-r.x)<18&&Math.abs(a.y-r.y)<18&&!a.hit){
      a.hit=true;
      r.speed=Math.max(0.3,r.speed*0.55); r.stunT=35;
      raceImpact(r.x,r.y,r.speed*0.7,'💥 OOF!');
    }
  }

  // 终点
  if(!r.finished&&r.y>=TRACK_LEN){
    r.finished=true; r.speed=0;
    if(RACE.winner===0){ RACE.winner=isR?1:2; RACE.state='finished'; RACE.endT=280; }
  }
}

function checkCarCarCollision(){
  const r=RACE.r,s=RACE.s;
  if(r.finished||s.finished) return;
  if(Math.abs(r.x-s.x)<26&&Math.abs(r.y-s.y)<28){
    if(RACE._carColCd>0){ RACE._carColCd--; return; }
    RACE._carColCd=20;
    const force=(r.speed+s.speed)/2;
    r.speed=Math.max(0.3,r.speed*0.42); s.speed=Math.max(0.3,s.speed*0.42);
    r.stunT=Math.max(r.stunT,50); s.stunT=Math.max(s.stunT,50);
    if(r.x<=s.x){ r.steerX-=2.2; s.steerX+=2.2; }
    else         { r.steerX+=2.2; s.steerX-=2.2; }
    r.boost=0; s.boost=0;
    raceImpact((r.x+s.x)/2,(r.y+s.y)/2,force,'💥 CRASH!!');
    RACE.shake=14;
  } else {
    if((RACE._carColCd||0)>0) RACE._carColCd--;
  }
}

// ── 碰撞特效 ─────────────────────────────────────────────
function raceImpact(x,y,force,text){
  const count=8+Math.min(14,force*3|0);
  const cols=['#ffee00','#ff9900','#ffffff','#ff4400','#ffcc44'];
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2, sp=1.2+Math.random()*Math.max(1,force*0.5);
    RACE.sparks.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-0.5,
      life:22+Math.random()*22|0,maxLife:44,color:cols[Math.random()*cols.length|0]});
  }
  RACE.impacts.push({x,y,text,life:52});
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
  if(--RACE.spawnT>0) return;
  RACE.spawnT=80+Math.random()*100|0;
  const ahead=Math.min(RACE.r.y,RACE.s.y);
  const spawnY=ahead+VH*0.6+Math.random()*200;
  if(spawnY>TRACK_LEN-120) return;
  const fromLeft=Math.random()<0.5;
  RACE.crossers.push({
    x: fromLeft?-(TRACK_W/2+30):(TRACK_W/2+30),
    y: spawnY,
    dx: fromLeft?1.8+Math.random()*1.2:-(1.8+Math.random()*1.2),
    life:220, hit:false,
    type:['dog','cat','chicken','bee'][Math.random()*4|0],
  });
}

function updateCrossers(){
  for(let i=RACE.crossers.length-1;i>=0;i--){
    const a=RACE.crossers[i];
    a.x+=a.dx; a.life--;
    if(a.life<=0||Math.abs(a.x)>TRACK_W+80) RACE.crossers.splice(i,1);
  }
}

// ── 绘制 ─────────────────────────────────────────────────
function drawRace(){
  ctx.fillStyle='#111'; ctx.fillRect(0,0,VW,VH);

  ctx.save(); ctx.beginPath(); ctx.rect(0,0,HALF_W,VH); ctx.clip();
  drawHalf(0,RACE.r,RACE.s,true);
  ctx.restore();

  ctx.save(); ctx.beginPath(); ctx.rect(HALF_W,0,HALF_W,VH); ctx.clip();
  drawHalf(HALF_W,RACE.s,RACE.r,false);
  ctx.restore();

  ctx.fillStyle='#f0f0f0'; ctx.fillRect(HALF_W-2,0,4,VH);
  drawRaceHUD();
}

function drawHalf(xOff,self,other,isRabbit){
  const shk=RACE.shake>0.5?(Math.random()-0.5)*RACE.shake:0;
  const selfCurve=getTrackCurveAt(self.y);

  // 草地背景
  ctx.fillStyle='#3d8a34'; ctx.fillRect(xOff,0,HALF_W,VH);
  ctx.fillStyle='#357a2d';
  for(let y=0;y<VH;y+=24) ctx.fillRect(xOff,y,HALF_W,10);

  // 扫描线：每2px算当前行路中心偏移，画弯曲路面
  for(let sy=0;sy<VH;sy+=2){
    const worldY=self.y+(VH/2-sy);
    if(worldY<-100||worldY>TRACK_LEN+100) continue;
    const curveDiff=getTrackCurveAt(worldY)-selfCurve;
    const cx=xOff+HALF_W/2-self.x+curveDiff+shk;

    ctx.fillStyle='#52575e';
    ctx.fillRect(cx-TRACK_W/2|0,sy,TRACK_W,2);

    // 车道虚线
    if((worldY/22|0)%2===0){
      ctx.fillStyle='rgba(255,255,255,0.28)';
      for(let l=1;l<5;l++){
        const lx=cx-TRACK_W/2+l*(TRACK_W/5);
        ctx.fillRect(lx-1|0,sy,2,2);
      }
    }

    // 路缘石
    const col=(worldY/28|0)%2===0?'#dd2222':'#ffffff';
    ctx.fillStyle=col;
    ctx.fillRect(cx-TRACK_W/2-11|0,sy,11,2);
    ctx.fillRect(cx+TRACK_W/2|0,sy,11,2);
  }

  // 将赛道坐标(roadX,worldY)转屏幕坐标（含弯道偏移）
  const r2s=(rx,wy)=>{
    const sy=VH/2-(wy-self.y);
    const cx=xOff+HALF_W/2-self.x+(getTrackCurveAt(wy)-selfCurve)+rx+shk;
    return [cx|0,sy|0];
  };

  // 起跑线 & 终点线
  { const [sx,sy]=r2s(0,150); if(sy>-16&&sy<VH+16) drawChecker(sx-TRACK_W/2|0,sy,TRACK_W,12,0); }
  { const [sx,sy]=r2s(0,TRACK_LEN); if(sy>-16&&sy<VH+16) drawChecker(sx-TRACK_W/2|0,sy,TRACK_W,16,1); }
  { const [sx,sy]=r2s(0,TRACK_LEN-60);
    if(sy>-40&&sy<VH+40){
      ctx.fillStyle='#fff'; ctx.font='bold 13px Courier New'; ctx.textAlign='center';
      ctx.fillText('🏁 FINISH 🏁',sx,sy-6); ctx.textAlign='left';
    }
  }

  // 距离标记
  for(let d=500;d<TRACK_LEN;d+=500){
    const [sx,sy]=r2s(0,d);
    if(sy<0||sy>VH) continue;
    ctx.fillStyle='rgba(255,255,200,0.7)'; ctx.font='9px Courier New';
    ctx.fillText(`${d}m`,sx-TRACK_W/2+4,sy-3);
  }

  // 障碍物
  for(const obs of RACE.obstacles){
    const [sx,sy]=r2s(obs.x,obs.y);
    if(sy<-40||sy>VH+40) continue;
    drawObstacle(sx,sy,obs.type);
  }

  // 横穿动物
  for(const a of RACE.crossers){
    const [sx,sy]=r2s(a.x,a.y);
    if(sy<-30||sy>VH+30) continue;
    drawCrosser(sx,sy,a.type);
  }

  // 对方赛车
  { const [sx,sy]=r2s(other.x,other.y);
    if(sy>-50&&sy<VH+50) drawRaceCar(sx,sy,!isRabbit,other.stunT,other.boost); }

  // 自己（永远在屏幕中央）
  drawRaceCar(xOff+HALF_W/2|0,VH/2,isRabbit,self.stunT,self.boost);

  // 火花
  for(const sp of RACE.sparks){
    const [sx,sy]=r2s(sp.x,sp.y);
    if(sy<-20||sy>VH+20) continue;
    const a=sp.life/sp.maxLife;
    ctx.globalAlpha=Math.max(0,a*0.9);
    ctx.fillStyle=sp.color;
    const sz=Math.max(1,a*4|0);
    ctx.fillRect(sx-sz/2|0,sy-sz/2|0,sz,sz);
    ctx.globalAlpha=1;
  }

  // 碰撞文字
  ctx.textAlign='center';
  for(const im of RACE.impacts){
    const [sx,sy]=r2s(im.x,im.y);
    const fy=sy-((52-im.life)*0.6|0);
    if(fy<-20||fy>VH+20) continue;
    const a=Math.min(1,im.life/18);
    ctx.globalAlpha=a;
    ctx.font='bold 15px Courier New';
    ctx.fillStyle='#000'; ctx.fillText(im.text,sx+2,fy+2);
    ctx.fillStyle='#ffee00'; ctx.fillText(im.text,sx,fy);
    ctx.globalAlpha=1;
  }
  ctx.textAlign='left';

  // HUD
  ctx.fillStyle=isRabbit?'#a0c8ff':'#ffc8a0';
  ctx.font='bold 11px Courier New';
  ctx.fillText(isRabbit?'🐰 BUNNY':'🐑 SHEEP',xOff+6,16);
  drawSpeedBar(xOff+6,22,self);
  drawBoostIndicator(xOff+6,54,self);
  drawSteerBar(xOff+6,78,self);

  // 弯道预警
  const futureCurve=getInstantCurve(self.y+180);
  if(Math.abs(futureCurve)>0.04){
    const str=Math.min(1,(Math.abs(futureCurve)-0.04)/0.10);
    ctx.globalAlpha=0.55+str*0.45;
    ctx.fillStyle=`hsl(${50-str*50},100%,60%)`;
    ctx.font=`bold ${10+str*4|0}px Courier New`;
    ctx.fillText(futureCurve>0?'← CURVE':'CURVE →',xOff+6,70);
    ctx.globalAlpha=1;
  }

  // 进度条
  const prog=Math.min(1,self.y/TRACK_LEN);
  const barW=HALF_W-12;
  ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(xOff+6,VH-12,barW,6);
  ctx.fillStyle=isRabbit?'#88aaff':'#ffaa88';
  ctx.fillRect(xOff+6,VH-12,barW*prog|0,6);
  ctx.strokeStyle='#888'; ctx.lineWidth=1; ctx.strokeRect(xOff+6,VH-12,barW,6);
}

function drawChecker(x,y,w,h,style){
  const sz=8;
  for(let ix=0;ix<w;ix+=sz) for(let iy=0;iy<h;iy+=sz){
    const even=((ix/sz|0)+(iy/sz|0))%2===0;
    ctx.fillStyle=style===0?(even?'#ffffff':'#000000'):(even?'#ffdd00':'#000000');
    ctx.fillRect(x+ix,y+iy,sz,sz);
  }
}

function drawRaceCar(cx,cy,isRabbit,stunT,boost){
  cx=Math.floor(cx); cy=Math.floor(cy);
  const C =isRabbit?'#3060e8':'#e03020';
  const CD=isRabbit?'#1840a0':'#a01010';
  const CH=isRabbit?'#88aaff':'#ff8866';
  const W='#1a1a1a', R='#777';

  ctx.fillStyle='rgba(0,0,0,0.28)';
  ctx.beginPath(); ctx.ellipse(cx,cy+16,14,5,0,0,Math.PI*2); ctx.fill();

  for(const [wx,wy] of [[-13,-12],[8,-12],[-13,8],[8,8]]){
    ctx.fillStyle=W; ctx.fillRect(cx+wx,cy+wy,6,10);
    ctx.fillStyle=R; ctx.fillRect(cx+wx+1,cy+wy+1,4,8);
  }

  ctx.fillStyle=CD; ctx.fillRect(cx-10,cy-16,22,32);
  ctx.fillStyle=C;  ctx.fillRect(cx-9, cy-17,22,32);
  ctx.fillStyle=CH; ctx.fillRect(cx-8, cy-16,20,4);
  ctx.fillStyle='#b0d8f8'; ctx.fillRect(cx-7,cy-14,16,9);
  ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillRect(cx-5,cy-13,5,3);
  ctx.fillStyle='#ffe870'; ctx.fillRect(cx-8,cy-18,5,3); ctx.fillRect(cx+3,cy-18,5,3);
  ctx.fillStyle='#ff3333'; ctx.fillRect(cx-8,cy+13,5,3); ctx.fillRect(cx+3,cy+13,5,3);
  ctx.fillStyle='#ffe060'; ctx.fillRect(cx-9,cy-4,22,4);

  if(stunT>0){
    if(tick%6<3){ ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fillRect(cx-11,cy-19,24,36); }
    ctx.font='11px sans-serif'; ctx.textAlign='center';
    for(let i=0;i<3;i++){
      const a=(tick*0.25+i*2.1);
      ctx.fillStyle=['#ffee00','#ff8800','#fff'][i];
      ctx.fillText(['★','✦','✸'][i],cx+Math.cos(a)*18,cy-20+Math.sin(a)*8);
    }
    ctx.textAlign='left';
  }

  if(boost>0){
    const f=Math.sin(tick*0.4)*2|0;
    ctx.fillStyle='#ff9900'; ctx.fillRect(cx-5,cy+14+f,12,8);
    ctx.fillStyle='#ffee00'; ctx.fillRect(cx-3,cy+15+f,8,5);
    ctx.fillStyle='#fff';    ctx.fillRect(cx-1,cy+16+f,4,3);
  }

  ctx.font='11px sans-serif'; ctx.textAlign='center';
  ctx.fillText(isRabbit?'🐰':'🐑',cx,cy+5);
  ctx.textAlign='left';
}

function drawObstacle(cx,cy,type){
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
  } else {
    ctx.fillStyle='#c8a040'; ctx.fillRect(cx-11,cy-8,22,16);
    ctx.fillStyle='#e8c060'; ctx.fillRect(cx-10,cy-7,20,5);
    for(let i=0;i<3;i++){ ctx.fillStyle='#a07830'; ctx.fillRect(cx-10,cy-7+i*5,20,1); }
  }
}

function drawCrosser(cx,cy,type){
  cx=Math.floor(cx); cy=Math.floor(cy);
  const colors={dog:'#b87534',cat:'#6f737a',chicken:'#fff4dc',bee:'#ffd441'};
  ctx.fillStyle=colors[type]||'#888';
  ctx.beginPath(); ctx.ellipse(cx,cy,10,7,0,0,Math.PI*2); ctx.fill();
  ctx.font='13px sans-serif'; ctx.textAlign='center';
  ctx.fillText({dog:'🐕',cat:'🐱',chicken:'🐔',bee:'🐝'}[type]||'🐾',cx,cy+5);
  ctx.textAlign='left';
}

function drawSpeedBar(x,y,r){
  const W=80,H=8;
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(x,y,W,H);
  const frac=Math.min(1,r.speed/(r.boost>0?BOOST_SPD:MAX_SPD));
  ctx.fillStyle=r.boost>0?'#ffcc00':frac>0.7?'#40e060':frac>0.4?'#e0e040':'#e06040';
  ctx.fillRect(x,y,W*frac|0,H);
  ctx.strokeStyle='#888'; ctx.lineWidth=1; ctx.strokeRect(x,y,W,H);
  ctx.fillStyle='#fff'; ctx.font='7px Courier New';
  ctx.fillText(`SPD ${(r.speed*10|0)/10}`,x+2,y+H-1);
}

function drawBoostIndicator(x,y,r){
  const W=80,H=7;
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(x,y,W,H);
  if(r.boost>0){
    ctx.fillStyle='#ffcc00'; ctx.fillRect(x,y,W*(r.boost/100)|0,H);
    if(tick%12<6){ ctx.fillStyle='#fff'; ctx.font='7px Courier New'; ctx.fillText('BOOST!',x+18,y+H-1); }
  } else {
    const frac=1-Math.min(1,r.boostCd/320);
    ctx.fillStyle=frac>=1?'#40d0ff':'#2860a0'; ctx.fillRect(x,y,W*frac|0,H);
    ctx.fillStyle='#aaa'; ctx.font='7px Courier New';
    ctx.fillText(frac>=1?'BOOST RDY':'BOOST CD',x+2,y+H-1);
  }
  ctx.strokeStyle='#888'; ctx.lineWidth=1; ctx.strokeRect(x,y,W,H);
}

function drawSteerBar(x,y,r){
  const W=80,H=6,cx=x+W/2;
  ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(x,y,W,H);
  const f=r.steerX/4;
  const bw=W/2*Math.abs(f)|0;
  ctx.fillStyle=f>0?'#ffaa44':'#44aaff';
  if(f>0) ctx.fillRect(cx,y,bw,H); else ctx.fillRect(cx-bw,y,bw,H);
  ctx.fillStyle='#fff'; ctx.fillRect(cx-1,y,2,H);
  ctx.strokeStyle='#666'; ctx.lineWidth=1; ctx.strokeRect(x,y,W,H);
  ctx.fillStyle='#ccc'; ctx.font='7px Courier New'; ctx.fillText('STEER',x+2,y+H-1);
}

function drawRaceHUD(){
  ctx.textAlign='center';
  if(RACE.state==='countdown'){
    const n=Math.ceil(RACE.cdT/60);
    const txt=n>0?String(n):'GO!';
    ctx.font='bold 72px Courier New';
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillText(txt,VW/2+3,VH/2+53);
    ctx.fillStyle=n>0?'#ffee00':'#40ff80'; ctx.fillText(txt,VW/2,VH/2+50);
    if(RACE.cdT>100){
      ctx.font='10px Courier New'; ctx.fillStyle='rgba(255,255,220,0.85)';
      ctx.fillText('🐰 WASD  W加速  S刹车  A/D变道  Space=Boost',VW/4,VH-30);
      ctx.fillText('🐑 方向键  ↑加速  ↓刹车  ←/→变道  Enter=Boost',VW*3/4,VH-30);
    }
  }
  if(RACE.state==='finished'){
    const winner=RACE.winner===1?'🐰 BUNNY WINS!':'🐑 SHEEP WINS!';
    ctx.globalAlpha=Math.min(1,RACE.endT/40);
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(VW/2-200,VH/2-50,400,80);
    ctx.font='bold 28px Courier New'; ctx.fillStyle='#ffee44';
    ctx.fillText(winner,VW/2,VH/2+8);
    ctx.font='12px Courier New'; ctx.fillStyle='#ccc';
    ctx.fillText('Returning to farm...',VW/2,VH/2+30);
    ctx.globalAlpha=1;
  }
  ctx.textAlign='left';
}

// ── 主地图入口建筑 ────────────────────────────────────────
function drawRacePortal(){
  const x=RACE_PORTAL.x,y=RACE_PORTAL.y,r=RACE_PORTAL.r;
  const pulse=1+Math.sin(tick*0.08)*0.12;
  ctx.save();
  const grd=ctx.createRadialGradient(x,y,8,x,y,r*pulse);
  grd.addColorStop(0,'rgba(255,220,0,0.30)');
  grd.addColorStop(1,'rgba(255,160,0,0)');
  ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(x,y,r*pulse,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(255,200,0,0.70)'; ctx.lineWidth=2; ctx.setLineDash([8,8]);
  ctx.beginPath(); ctx.arc(x,y,r*0.85,0,Math.PI*2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font='26px sans-serif'; ctx.textAlign='center';
  ctx.fillText('🏁',x,y+9);
  ctx.font='bold 8px Courier New'; ctx.fillStyle='#ffe060';
  ctx.fillText('RACE',x,y+24);
  ctx.restore(); ctx.textAlign='left';
  const rabIn=dist(P.x+P.w/2,P.y+P.h/2,x,y)<r;
  const shpIn=dist(SHEEP[0].x+11,SHEEP[0].y+9,x,y)<r;
  if(rabIn&&shpIn) drawBubble(x,y-r-6,'Space! RACE!');
  else if(rabIn||shpIn) drawBubble(x,y-r-6,'需要两人进入');
}
