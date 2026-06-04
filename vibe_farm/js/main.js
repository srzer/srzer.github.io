// ── 存档系统（纯本地文件，不使用任何浏览器存储）────────────────────
let saveFlash = 0;

function saveGame(){
  const extraDogs = CRITTERS.filter(c=>c.type==='dog').slice(2);
  const s = SHEEP[0];
  const save = {
    seed:       _INIT_SEED,
    px: P.x,   py: P.y,  pdir: P.dir,
    carrots:    P.carrots, eggs: P.eggs, honey: P.honey,
    fish:       P.fish,    fishRod: P.fishRod,
    hasFloatie: P.hasFloatie, hasCar: P.hasCar,
    extraChickens: Math.max(0, CRITTERS.filter(c=>c.type==='chicken').length - 2),
    extraDogs:  extraDogs.length, dogPatrols: extraDogs.map(c=>c.coat==='brown'),
    extraBees:  Math.max(0, CRITTERS.filter(c=>c.type==='bee').length - 2),
    sheepFloatie: s.hasFloatie, sheepCar: s.hasCar,
    sheepFishRod: s.fishRod,   sheepFish: s.fish,
  };
  const blob = new Blob([JSON.stringify(save, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `vibefarm_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  saveFlash = 120;
  addFloat(P.x+4, P.y-14, 'Saved!', '#ffe060');
}

function applyLoadData(save){
  P.x = save.px  ?? P.x;
  P.y = save.py  ?? P.y;
  P.dir = save.pdir ?? 2;
  P.carrots    = save.carrots    || 0;
  P.eggs       = save.eggs       || 0;
  P.honey      = save.honey      || 0;
  P.fish       = save.fish       || 0;
  P.fishRod    = save.fishRod    || false;
  P.hasFloatie = save.hasFloatie || false;
  P.hasCar     = save.hasCar     || false;
  const s = SHEEP[0];
  s.hasFloatie = save.sheepFloatie || false;
  s.hasCar     = save.sheepCar     || false;
  s.fishRod    = save.sheepFishRod || false;
  s.fish       = save.sheepFish    || 0;
  // 移除所有购买的动物（原始 7 只：索引 0-6）
  while(CRITTERS.length > 7) CRITTERS.pop();
  // 恢复购买的狗
  const dogNames=['小黑','大毛','球球','旺财'];
  const dogPatrols = save.dogPatrols || [];
  for(let i=0; i<(save.extraDogs||0); i++){
    const patrol = dogPatrols[i] !== false;
    CRITTERS.push({
      type:'dog', name:dogNames[i%dogNames.length],
      coat: patrol?'brown':'white',
      x:NESTS.dog.x+(i%3-1)*T*2, y:NESTS.dog.y+T,
      dir:1, dx:0.35, dy:0, timer:60, talkT:50,
      bubble:'', bubT:0, step:0, poopEvery:550,
    });
  }
  // 恢复购买的蜜蜂
  for(let i=0; i<(save.extraBees||0); i++){
    CRITTERS.push({ type:'bee', name:'小蜜'+(i+3),
      x:GARDEN.x+Math.random()*GARDEN.w, y:GARDEN.y+Math.random()*GARDEN.h,
      dir:1, dx:0.55, dy:0.15, timer:30, talkT:60,
      bubble:'', bubT:0, phase:Math.random()*3, step:0 });
  }
  // 恢复购买的鸡
  const chickenNames=['花鸡','胖鸡','小黄鸡','懒鸡'];
  for(let i=0; i<(save.extraChickens||0); i++){
    CRITTERS.push({
      type:'chicken', name:chickenNames[i%chickenNames.length],
      x:NESTS.chicken.x+(i%3-1)*T*2, y:NESTS.chicken.y+T,
      dir:1, dx:0.26, dy:0, timer:90, talkT:70,
      bubble:'', bubT:0, step:0, poopEvery:600, eggEvery:500,
    });
  }
}

function loadSaveFile(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        // 编码为 base64 放入 URL hash，触发页面重载以还原地图种子
        location.href = location.pathname + '#' + btoa(ev.target.result);
      } catch(err){
        addFloat(P.x+4, P.y-14, 'Load failed!', '#ff6060');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

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
  checkRacePortal();
  if(RACE.active){
    updateRace();
    SPACE_HIT=false; SHEEP_ENTER_HIT=false; X_HIT=false; Q_HIT=false; TAB_HIT=false;
    return;
  }
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
  // 玩家/羊推开动物（开车时推力更大）
  if(P.moving) pushCrittersByMover(P.x, P.y, P.w, P.h, P.carMode?18:4);
  const _s=SHEEP[0];
  if((_s.hasCar||Math.hypot(_s.dx,_s.dy)>0.1) && !_s.rideMode)
    pushCrittersByMover(_s.x, _s.y, 22, 18, _s.hasCar?14:3);

  if(tick%200===0 && Math.random()<0.45){
    bubble=BUBBLES[Math.random()*BUBBLES.length|0];
    bubT=100;
  }
  if(bubT>0) bubT--;
  if(P.carMode) emitCarExhaust();
  if(saveFlash>0) saveFlash--;
  // 钓鱼小游戏更新（最先消费按键）
  updateFishMini();
  // 兔叽钓鱼触发
  if(P.fishRod && SPACE_HIT && !SHOP.open && !SEESAW.seated && !OCTOPUS.seated && !TRAMPOLINE.seated && !BUBBLE_RIDE.seated
     && isNearWater(P.x, P.y, P.w, P.h)){
    startFishing('rabbit');
    SPACE_HIT=false;
  }
  if(TAB_HIT) saveGame();
  SPACE_HIT=false;
  SHEEP_ENTER_HIT=false;
  X_HIT=false;
  Q_HIT=false;
  TAB_HIT=false;
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

if(_HASH_SAVE) applyLoadData(_HASH_SAVE);

function loop(){ update(); draw(); requestAnimationFrame(loop); }
loop();
