// ── 碰撞 ─────────────────────────────────────────────
function tileAt(wx, wy){
  const tx=Math.floor(wx/T), ty=Math.floor(wy/T);
  if(tx<0||ty<0||tx>=COLS||ty>=ROWS) return 3;
  return MAP[ty][tx];
}

function pointInRect(px,py,r){
  return px>=r.x && px<=r.x+r.w && py>=r.y && py<=r.y+r.h;
}

function decorativeSolidAt(wx,wy){
  const rects=[];

  // 兔叽出生地小木桩围栏，底部中间留门。
  const sx=T, sy=T, sw=6*T, sh=5*T;
  const gateX=sx+2*T+8, gateW=T+8;
  rects.push({x:sx,y:sy,w:sw,h:18});
  rects.push({x:sx,y:sy,w:16,h:sh});
  rects.push({x:sx+sw-16,y:sy,w:16,h:sh});
  rects.push({x:sx,y:sy+sh-18,w:gateX-sx,h:18});
  rects.push({x:gateX+gateW,y:sy+sh-18,w:sx+sw-(gateX+gateW),h:18});

  // 花园栅栏，底边中间留门给兔叽和地面动物。
  for(const garden of GARDENS){
    const gx=garden.x, gy=garden.y, gw=garden.w, gh=garden.h;
    const gardenGateX=gx+gw/2-12, gardenGateW=24;
    rects.push({x:gx,y:gy,w:gw,h:18});
    rects.push({x:gx,y:gy,w:15,h:gh});
    rects.push({x:gx+gw-15,y:gy,w:15,h:gh});
    rects.push({x:gx,y:gy+gh-16,w:gardenGateX-gx,h:16});
    rects.push({x:gardenGateX+gardenGateW,y:gy+gh-16,w:gx+gw-(gardenGateX+gardenGateW),h:16});
  }

  // 音乐喷泉底座。
  rects.push({x:FOUNTAIN.x+5,y:FOUNTAIN.y+12,w:40,h:18});

  // 篝火。
  rects.push({x:CAMPFIRE.x+4,y:CAMPFIRE.y+10,w:22,h:10});

  // 八爪章鱼游乐设施底座。
  rects.push({x:OCTOPUS.x+27,y:OCTOPUS.y+26,w:30,h:28});

  // 蹦蹦云床和泡泡机。
  rects.push({x:TRAMPOLINE.x+9,y:TRAMPOLINE.y+34,w:58,h:18});
  rects.push({x:BUBBLE_RIDE.x+24,y:BUBBLE_RIDE.y+16,w:28,h:28});

  // 3×3 小房子（狗/猫/鸡窝、商店），只挡墙体，门口可进出。
  const H3=3*T;
  for(const n of [NESTS.dog,NESTS.cat,NESTS.chicken])
    rects.push({x:n.x+2, y:n.y+22, w:H3-4, h:H3-30});
  rects.push({x:SHOP.x+2, y:SHOP.y+22, w:H3-4, h:H3-30});

  return rects.some(r=>pointInRect(wx,wy,r));
}

// 水(2)不能走
function solidAt(wx,wy){
  const t=tileAt(wx,wy);
  return decorativeSolidAt(wx,wy)||t===3||t===4||t===7||t===2;
}
function solid(t){ return t===3||t===4||t===2||t===7; }

function rectsOverlap(a,b){
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}

function sheepRect(s){
  return {x:s.x+1, y:s.y+2, w:22, h:17};
}

function playerRect(x=P.x, y=P.y){
  return {x:x+2, y:y+2, w:P.w-4, h:P.h-3};
}

function blockedBySheep(x, y){
  const next=playerRect(x,y);
  return SHEEP.some(s=>rectsOverlap(next, sheepRect(s)));
}

function rabbitHeadRect(x=P.x,y=P.y){
  return {x:x+3, y:y-8, w:18, h:23};
}

function sheepHeadRect(s){
  return s.dir===1
    ? {x:s.x+14, y:s.y+0, w:11, h:12}
    : {x:s.x-3, y:s.y+0, w:11, h:12};
}

function nearRects(a,b,pad=0){
  return rectsOverlap(
    {x:a.x-pad,y:a.y-pad,w:a.w+pad*2,h:a.h+pad*2},
    {x:b.x-pad,y:b.y-pad,w:b.w+pad*2,h:b.h+pad*2}
  );
}

// ── 玩家 ─────────────────────────────────────────────

function canMove(nx,ny){
  const m=3;
  const clearTiles = [
    [nx+m,     ny+m     ],
    [nx+P.w-m, ny+m     ],
    [nx+m,     ny+P.h-m ],
    [nx+P.w-m, ny+P.h-m ],
  ].every(([cx,cy])=>{
    if(P.hasFloatie && tileAt(cx,cy)===2) return true;
    return !solidAt(cx,cy);
  });
  return clearTiles && !blockedBySheep(nx,ny);
}

function canSheepMove(s,nx,ny){
  const m=2;
  const clearTiles = [
    [nx+m,  ny+m ],
    [nx+22, ny+m ],
    [nx+m,  ny+18],
    [nx+22, ny+18],
  ].every(([cx,cy])=>{
    if(s.hasFloatie && tileAt(cx,cy)===2) return true;
    return !solidAt(cx,cy);
  });
  return clearTiles && !rectsOverlap({x:nx+1,y:ny+2,w:22,h:17}, playerRect());
}

function chooseSheepDirection(s, speed=0.45){
  for(let i=0;i<10;i++){
    const a=Math.random()*Math.PI*2;
    const dx=Math.cos(a)*speed, dy=Math.sin(a)*speed;
    if(canSheepMove(s,s.x+dx*8,s.y+dy*8)){
      s.dx=dx; s.dy=dy;
      return;
    }
  }
  // 实在找不到可走方向：朝世界中心，避免原地震荡
  const a=Math.atan2(WORLD_H/2 - s.y, WORLD_W/2 - s.x);
  s.dx=Math.cos(a)*speed; s.dy=Math.sin(a)*speed;
}

// ── 地面动物：用脚部小范围 footprint 判断碰撞（多点采样）──
function critterSolid(x,y){
  return solidAt(x+5, y+15) || solidAt(x+16, y+15) ||
         solidAt(x+5, y+18) || solidAt(x+16, y+18);
}
// 狗专用：水不算固体（可以游泳）
function critterSolidDog(x,y){
  const f=(wx,wy)=>{const t=tileAt(wx,wy);return decorativeSolidAt(wx,wy)||t===3||t===4||t===7;};
  return f(x+5,y+15)||f(x+16,y+15)||f(x+5,y+18)||f(x+16,y+18);
}
// 地面动物的身体碰撞盒（小猫小狗小鸡互相不能重叠）
function critterBody(c, x=c.x, y=c.y){ return {x:x+3, y:y+7, w:18, h:13}; }
function blockedByCritter(self, x, y){
  if(self.type==='bee' || self.mode==='seesaw') return false;
  const me=critterBody(self, x, y);
  for(const o of CRITTERS){
    if(o===self || o.type==='bee' || o.mode==='seesaw') continue;
    if(rectsOverlap(me, critterBody(o))) return true;
  }
  return false;
}
// 综合：地形 + 其它动物 都算「不可走」
function blockedAt(c, x, y){ return (c.type==='dog'?critterSolidDog(x,y):critterSolid(x,y)) || blockedByCritter(c,x,y); }
// 万一两只动物重叠（理论上不会），沿连线轻轻推开，但不穿墙
function separateCritters(c){
  if(c.type==='bee' || c.mode==='seesaw') return;
  for(const o of CRITTERS){
    if(o===c || o.type==='bee' || o.mode==='seesaw') continue;
    if(!rectsOverlap(critterBody(c), critterBody(o))) continue;
    let ax=c.x-o.x, ay=c.y-o.y;
    if(Math.abs(ax)<0.01 && Math.abs(ay)<0.01){ ax=Math.random()-0.5; ay=Math.random()-0.5; }
    const m=Math.hypot(ax,ay)||1;
    const sx=c.x+ax/m*0.8, sy=c.y+ay/m*0.8;
    if(!critterSolid(sx,sy)){ c.x=sx; c.y=sy; }
  }
}
// 被实体环绕时，选一个真正能走的新方向（彻底防卡死）
function escapeStuck(c){
  const sp = c.type==='chicken' ? 0.32 : 0.4;
  for(let i=0;i<18;i++){
    const a=Math.random()*Math.PI*2;
    const dx=Math.cos(a)*sp, dy=Math.sin(a)*sp*0.85;
    if(!blockedAt(c, c.x+dx*12, c.y+dy*12)){
      c.dx=dx; c.dy=dy;
      c.timer=60+Math.random()*80|0;
      if(c.mode==='eatPoop'){
        c.mode=''; c.targetPoop=null; c.stuckT=0;
        // 小狗追便便被困 → 切回游走，避免立刻又盯上同一坨
        if(c.type==='dog'){ c.behavior='wander'; c.behaviorT=220+Math.random()*160|0; }
      } else if(c.mode==='goRide'){
        c.mode=''; c.rideSpot=null; c.rideCd=180;
      }
      return;
    }
  }
  // 兜底：朝地图中心缓慢移动
  const a=Math.atan2(WORLD_H/2 - c.y, WORLD_W/2 - c.x);
  c.dx=Math.cos(a)*sp; c.dy=Math.sin(a)*sp; c.timer=60;
}
// 若不慎嵌入实体（理论上不该发生），向外推出
function pushOut(c){
  const sfn=c.type==='dog'?critterSolidDog:critterSolid;
  if(!sfn(c.x, c.y)) return;
  for(let r=2;r<=48;r+=2) for(let i=0;i<12;i++){
    const a=Math.PI*2*i/12;
    const nx=c.x+Math.cos(a)*r, ny=c.y+Math.sin(a)*r;
    if(!sfn(nx,ny)){ c.x=nx; c.y=ny; return; }
  }
}

function nearestGrass(s){
  let best=null, bestD=Infinity;
  for(const g of GRASS_PATCHES){
    if(g.eaten) continue;
    const d=dist(s.x+11,s.y+10,g.x+10,g.y+10);
    if(d<bestD){ best=g; bestD=d; }
  }
  return best ? {patch:best, distance:bestD} : null;
}

function liveCarrotCount(){
  return CARROTS.reduce((n,c)=>n+(c.eaten?0:1),0);
}

function canSpawnCarrotAt(x,y){
  if(tileAt(x+10,y+16)!==0) return false;
  if(solidAt(x+10,y+16) || decorativeSolidAt(x+10,y+16)) return false;
  if(dist(P.x+P.w/2,P.y+P.h,x+10,y+16)<70) return false;
  for(const c of CARROTS)
    if(!c.eaten && dist(c.x+10,c.y+12,x+10,y+12)<T*2) return false;
  for(const g of GRASS_PATCHES)
    if(dist(g.x+10,g.y+12,x+10,y+12)<T*1.4) return false;
  for(const s of SHEEP)
    if(rectsOverlap({x:x+3,y:y+4,w:14,h:18}, sheepRect(s))) return false;
  for(const c of CRITTERS)
    if(c.type!=='bee' && rectsOverlap({x:x+3,y:y+4,w:14,h:18}, critterBody(c))) return false;
  return true;
}

function spawnRandomCarrot(){
  if(liveCarrotCount()>=18) return false;
  for(let i=0;i<45;i++){
    const tx=1+(Math.random()*(COLS-2)|0);
    const ty=1+(Math.random()*(ROWS-2)|0);
    const x=tx*T, y=ty*T;
    if(!canSpawnCarrotAt(x,y)) continue;
    const old=CARROTS.find(c=>c.eaten);
    if(old){
      old.x=x; old.y=y; old.eaten=false;
    } else {
      CARROTS.push({x,y,eaten:false});
    }
    addFloat(x+3,y+2,'新胡萝卜','#ffd28a');
    return true;
  }
  return false;
}

