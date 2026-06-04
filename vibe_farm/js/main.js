
// ── 主循环 ───────────────────────────────────────────
let tick=0;

function updateCamera(){
  const tx = P.x + P.w/2 - VW/2;
  const ty = P.y + P.h/2 - VH/2;
  cam.x += (tx - cam.x) * 0.12;
  cam.y += (ty - cam.y) * 0.12;
  cam.x = Math.max(0, Math.min(cam.x, WORLD_W - VW));
  cam.y = Math.max(0, Math.min(cam.y, WORLD_H - VH));
}

function update(){
  tick++;
  updateCamera();
  updateCarrots();
  updateEggs();
  updateGrass();
  updateFloats();
  updateEffects();
  updateCritters();
  updateSeesaw();
  updateOctopus();
  updateTrampoline();
  updateBubbleRide();
  updateShop();

  // X 键切换开/关车
  if(X_HIT && P.hasCar && !SEESAW.seated && !OCTOPUS.seated && !TRAMPOLINE.seated && !BUBBLE_RIDE.seated){
    P.carMode=!P.carMode;
    setBubble(P.carMode?'发动！呜呜呜！':'停车了~', 80);
    addFloat(P.x+6, P.y-12, P.carMode?'VROOM!':'停车', P.carMode?'#6a9aff':'#cccccc');
  }

  let dx=0, dy=0;
  const pOx=P.x, pOy=P.y;
  const sp = P.carMode ? P.speed*3 : P.speed;
  if(!SEESAW.seated && !OCTOPUS.seated && !TRAMPOLINE.seated && !BUBBLE_RIDE.seated && !SHOP.open){
    if(KEYS['w']) { dy=-sp; P.dir=0; }
    if(KEYS['s']) { dy= sp; P.dir=2; }
    if(KEYS['a']) { dx=-sp; P.dir=3; }
    if(KEYS['d']) { dx= sp; P.dir=1; }
  }

  P.moving = dx!==0||dy!==0;
  if(dx && canMove(P.x+dx, P.y)) P.x+=dx;
  else if(dx && P.interactCd<=0 && blockedBySheep(P.x+dx,P.y)){
    setBubble('别挤咩~',70);
    const s=SHEEP[0]; s.bubble='咩？'; s.bubT=70;
    P.interactCd=120;
  }
  if(dy && canMove(P.x, P.y+dy)) P.y+=dy;
  else if(dy && P.interactCd<=0 && blockedBySheep(P.x,P.y+dy)){
    setBubble('贴贴！',70);
    const s=SHEEP[0]; s.bubble='咩咩'; s.bubT=70;
    P.interactCd=120;
  }
  P.x=Math.max(T, Math.min(P.x, (COLS-1)*T-P.w));
  P.y=Math.max(T, Math.min(P.y, (ROWS-1)*T-P.h));
  if(P.interactCd>0) P.interactCd--;
  const pAdv=dist(pOx,pOy,P.x,P.y);
  if(pAdv>0.05 && !SEESAW.seated && !OCTOPUS.seated && !TRAMPOLINE.seated && !BUBBLE_RIDE.seated){
    trackPoopStep(P, pAdv);
  }

  if(P.moving){ P.ft++; if(P.ft>10){P.ft=0;P.frame^=1;} }
  else { P.frame=0; }
  updateHeadEffect();
  updateSheepPlayer();

  if(tick%200===0 && Math.random()<0.45){
    bubble=BUBBLES[Math.random()*BUBBLES.length|0];
    bubT=100;
  }
  if(bubT>0) bubT--;
  if(P.carMode) emitCarExhaust();
  SPACE_HIT=false;
  SHEEP_ENTER_HIT=false;
  X_HIT=false;
  Q_HIT=false;
}


(function initWorld(){
  const ents=[...CARROTS, ...GRASS_PATCHES, ...CRITTERS, ...SHEEP, P];
  for(const e of ents){
    let tries=0;
    while(tries<60 && (
      tileAt(e.x+10,e.y+16)===2 || tileAt(e.x+10,e.y+16)===4 ||
      tileAt(e.x+10,e.y+16)===7 || tileAt(e.x+10,e.y+16)===3)){
      const a=Math.random()*Math.PI*2, r=(tries/8+1)*T;
      e.x=Math.max(T,Math.min(e.x+Math.cos(a)*r, WORLD_W-2*T));
      e.y=Math.max(T,Math.min(e.y+Math.sin(a)*r, WORLD_H-2*T));
      tries++;
    }
  }
  cam.x=Math.max(0,Math.min(P.x+P.w/2-VW/2, WORLD_W-VW));
  cam.y=Math.max(0,Math.min(P.y+P.h/2-VH/2, WORLD_H-VH));
})();

function loop(){ update(); draw(); requestAnimationFrame(loop); }
loop();
