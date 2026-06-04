function createPoop(c){
  // 水里禁止拉粑粑
  if(tileAt(c.x+10,c.y+16)===2){ c.poopStep=0; c.step=0; return; }
  const p={x:c.x+5,y:c.y+8,owner:c.type,burying:false};
  POOPS.push(p);
  c.step=0;
  c.poopStep=0;
  const line=c.type==='cat'?'埋起来':c.type==='sheep'?'咩粑粑':c.type==='rabbit'?'兔粑粑':'拉粑粑';
  if(c===P) setBubble(line, 90);
  else { c.bubble=line; c.bubT=100; }
  addFloat(c.x+2,c.y-8,'留下了','#c99d58');
  if(c.type==='cat'){
    c.mode='buryPoop';
    c.buryT=180;
    c.buryPoop=p;
    p.burying=true;
  }
}

function createFullBellyPoop(){
  setBubble('好饱好饱', 150);
  addFloat(P.x+2, P.y-12, '好饱！', '#ffd28a');
  const spacing=22;
  const cx=P.x+P.w/2-10;
  const cy=P.y+P.h-5;
  for(let row=0;row<3;row++)
    for(let col=0;col<3;col++)
      POOPS.push({x:cx+(col-1)*spacing, y:cy+(row-1)*spacing, owner:'rabbit', burying:false});
  P.carrots-=30;
}

function trackPoopStep(c, adv){
  if(!c.poopEvery || adv<=0.05) return;
  c.poopStep=(c.poopStep||0)+adv;
  if(c.poopStep>=c.poopEvery) createPoop(c);
}

function createEgg(c){
  const p={x:c.x+5,y:c.y+8,owner:c.name||'小鸡'};
  EGGS.push(p);
  c.eggStep=0;
  c.bubble='下蛋啦';
  c.bubT=100;
  addFloat(c.x+2,c.y-8,'新鸡蛋','#fff2a0');
}

function nearestEdiblePoop(dog){
  let best=null, bestD=Infinity;
  for(const p of POOPS){
    if(p.burying) continue;
    if(solidAt(p.x+10,p.y+16)) continue;
    const d=dist(dog.x+10,dog.y+10,p.x+10,p.y+10);
    if(d<bestD){ best=p; bestD=d; }
  }
  return best ? {poop:best,distance:bestD} : null;
}

function noticeDirtyPoop(c){
  if(c.type==='dog' || c.dirtyCd>0) return;
  for(const p of POOPS){
    if(p.burying) continue;
    if(dist(c.x+10,c.y+10,p.x+10,p.y+10)<T*3){
      c.bubble='好脏';
      c.bubT=85;
      c.dirtyCd=180;
      return;
    }
  }
}

function addHeartEffect(x,y){
  for(let i=0;i<7;i++){
    EFFECTS.push({
      type:'heart',
      x:x+(Math.random()*18-9),
      y:y+(Math.random()*8-4),
      vx:Math.random()*0.6-0.3,
      vy:-0.65-Math.random()*0.45,
      life:75+Math.random()*25|0,
      color:['#ff6fa0','#ff9ac0','#ff4f78'][Math.random()*3|0],
    });
  }
}

function addFireworkEffect(x,y){
  const colors=['#ffe66b','#ff7a4f','#8ef0ff','#b78cff','#ffffff'];
  for(let i=0;i<18;i++){
    const a=Math.PI*2*i/18;
    const sp=0.7+Math.random()*1.3;
    EFFECTS.push({
      type:'spark',
      x,y,
      vx:Math.cos(a)*sp,
      vy:Math.sin(a)*sp,
      life:34+Math.random()*18|0,
      color:colors[Math.random()*colors.length|0],
    });
  }
}

function triggerHeadEffect(x,y){
  if(Math.random()<0.5){
    addHeartEffect(x,y);
    setBubble('心动！',70);
    SHEEP[0].bubble='咩♥';
  } else {
    addFireworkEffect(x,y);
    setBubble('砰！',70);
    SHEEP[0].bubble='哇咩';
  }
  SHEEP[0].bubT=75;
  P.headEffectCd=95;
}

function updateEffects(){
  for(let i=EFFECTS.length-1;i>=0;i--){
    const e=EFFECTS[i];
    e.x+=e.vx;
    e.y+=e.vy;
    if(e.type==='spark') e.vy+=0.035;
    e.life--;
    if(e.life<=0) EFFECTS.splice(i,1);
  }
}

function updateCarrots(){
  const pr=playerRect();
  for(const c of CARROTS){
    if(c.eaten) continue;
    const cr={x:c.x+3,y:c.y+4,w:14,h:18};
    if(rectsOverlap(pr,cr)){
      c.eaten=true;
      P.carrots++;
      P.chew=55;
      if(P.carrots%30===0){
        createFullBellyPoop();
      } else {
        setBubble('咔嚓！+1', 90);
        addFloat(P.x+6, P.y-10, '+胡萝卜', '#ffd28a');
      }
    }
  }
  carrotSpawnT--;
  if(carrotSpawnT<=0){
    carrotSpawnT=420+(Math.random()*360|0);
    if(Math.random()<0.7) spawnRandomCarrot();
  }
  if(P.chew>0) P.chew--;
}

function updateEggs(){
  const pr=playerRect();
  for(let i=EGGS.length-1;i>=0;i--){
    const e=EGGS[i];
    const er={x:e.x+4,y:e.y+6,w:14,h:12};
    if(rectsOverlap(pr,er)){
      EGGS.splice(i,1);
      P.eggs++;
      setBubble('捡到鸡蛋！+1', 90);
      addFloat(P.x+6, P.y-10, '+鸡蛋', '#fff2a0');
    }
  }
}

function updateGrass(){
  for(const g of GRASS_PATCHES){
    if(g.eaten && g.regrow>0){
      g.regrow--;
      if(g.regrow===0){
        g.eaten=false;
        addFloat(g.x+2, g.y+2, '新草', '#b7ff8a');
      }
    }
  }
}

function updateFloats(){
  for(let i=FLOATS.length-1;i>=0;i--){
    FLOATS[i].y-=0.25;
    FLOATS[i].life--;
    if(FLOATS[i].life<=0) FLOATS.splice(i,1);
  }
}

function isNight(){
  return nightAmount()>0.58;
}

function critterHomeTarget(c){
  // 门在房子底部中央，Y 稍微在房子下方（门口台阶处）
  if(c.type==='dog')     return {x:NESTS.dog.x+T+4,     y:NESTS.dog.y+3*T+4};
  if(c.type==='cat')     return {x:NESTS.cat.x+T+4,     y:NESTS.cat.y+3*T+4};
  if(c.type==='chicken') return {x:NESTS.chicken.x+T+4, y:NESTS.chicken.y+3*T+4};
  return null;
}

function isBusyMode(c){
  return c.mode==='seesaw' || c.mode==='eatPoop' || c.mode==='buryPoop' ||
         c.mode==='garden' || c.mode==='nectar' || c.mode==='goRide' || c.mode==='playRide' ||
         c.mode==='goFish' || c.mode==='fishing';
}

function guideCritterHome(c){
  const home=critterHomeTarget(c);
  if(!home) return false;
  const d=dist(c.x+10,c.y+10,home.x+10,home.y+10);
  if(d<10){
    c.dx=0;
    c.dy=0;
    if((tick+c.x|0)%90===0){
      c.bubble=c.type==='chicken'?'窝里睡':c.type==='cat'?'睡窝窝':'回窝啦';
      c.bubT=70;
    }
    return true;
  }
  const a=Math.atan2(home.y-c.y,home.x-c.x);
  const sp=c.type==='chicken'?0.34:0.42;
  c.dx=Math.cos(a)*sp;
  c.dy=Math.sin(a)*sp*0.8;
  return true;
}

function updateCritters(){
  for(const c of CRITTERS){
    if(c.dirtyCd>0) c.dirtyCd--;
    if((c.rideCd||0)>0) c.rideCd--;
    if(c.mode==='buryPoop'){
      c.buryT--;
      c.dx=0; c.dy=0;
      c.bubble='埋埋埋';
      c.bubT=20;
      if(c.buryT<=0){
        const idx=POOPS.indexOf(c.buryPoop);
        if(idx>=0) POOPS.splice(idx,1);
        c.buryPoop=null;
        c.mode='';
        c.timer=0;
        c.bubble='干净了';
        c.bubT=90;
      }
      continue;
    }

    c.timer--;
    if(c.type==='bee') c.phase+=0.08;
    c.talkT--;
    if(c.talkT<=0){
      const lines=(isNight()&&c.type==='dog'&&c.coat==='brown')?['巡逻中','守农场','放哨！','夜间警戒']:CRITTER_BUBBLES[c.type];
      c.bubble=lines[Math.random()*lines.length|0];
      c.bubT=110;
      c.talkT=110+Math.random()*170|0;
    }
    if(c.bubT>0) c.bubT--;
    if(isNight() && c.type!=='bee' && c.type!=='cat' && !isBusyMode(c) && c.mode!=='home' && !(c.type==='dog' && c.coat==='brown')){
      if(Math.random()<0.018){ c.mode='home'; c.timer=120; c.homeTimer=180+Math.random()*240|0; c.bubble='回窝'; c.bubT=75; }
    } else if(!isNight() && c.mode==='home'){
      c.mode='';
      c.timer=0;
    }

    if(c.type==='dog' && c.mode!=='home'){
      // 行为模式定时切换：随机游走 ↔ 优先吃便便。
      // 这样小狗不会长期死盯着一坨够不到的便便，从而不再卡位。
      // 初始化：直接进入 hunt 模式，吃粑粑欲望更强
      if(c.behaviorT===undefined){ c.behavior='hunt'; c.behaviorT=480+Math.random()*240|0; }
      c.behaviorT--;
      if(c.behaviorT<=0){
        if(c.behavior==='hunt'){
          c.behavior='wander';
          c.behaviorT=120+Math.random()*90|0;    // 游走 ~2–3.5 秒（更短）
          if(c.mode==='eatPoop'){ c.mode=''; c.targetPoop=null; c.stuckT=0; c.timer=0; }
          c.bubble='溜达溜达'; c.bubT=70;
        } else {
          c.behavior='hunt';
          c.behaviorT=480+Math.random()*300|0;   // 找便便 ~8–13 秒（更长）
          c.bubble='闻到味了！'; c.bubT=70;
        }
      }
      // 只有在「找便便」模式下才会去追便便
      if(c.behavior==='hunt' && !c.mode){
        const target=nearestEdiblePoop(c);
        if(target){
          c.mode='eatPoop';
          c.targetPoop=target.poop;
          c.stuckT=0;
          c.bubble='闻到了！';
          c.bubT=80;
        }
      }
    }

    // 猫每天重置钓鱼计数
    if(c.type==='cat'){
      const dayN=tick/DAY_CYCLE|0;
      if(c.lastFishDay!==dayN){ c.lastFishDay=dayN; c.dayFishCount=0; }
    }

    if(c.mode==='home'){
      if(c.homeTimer>0) c.homeTimer--;
      if(c.homeTimer===0){ c.mode=''; c.homeTimer=-1; c.timer=0; c.bubble='出来溜达'; c.bubT=70; }
      else guideCritterHome(c);
    } else if(c.mode==='eatPoop'){
      const p=c.targetPoop;
      if(!p || !POOPS.includes(p) || p.burying){
        c.mode='';
        c.targetPoop=null;
        c.stuckT=0;
        c.timer=0;
      } else {
        const a=Math.atan2(p.y-c.y,p.x-c.x);
        const side=(c.stuckT||0)>18 ? Math.sin(tick*0.18)*0.5 : 0;
        c.dx=Math.cos(a)*0.7 + Math.cos(a+Math.PI/2)*side;
        c.dy=Math.sin(a)*0.55 + Math.sin(a+Math.PI/2)*side;
        if(dist(c.x+10,c.y+10,p.x+10,p.y+10)<13){
          const idx=POOPS.indexOf(p);
          if(idx>=0) POOPS.splice(idx,1);
          c.mode='';
          c.targetPoop=null;
          c.stuckT=0;
          c.timer=0;
          c.bubble='真好吃！';
          c.bubT=120;
          addFloat(c.x+2,c.y-8,'吧唧','#ffd28a');
        }
      }
    } else if(c.mode==='goRide'){
      const spot=c.rideSpot;
      if(!spot){ c.mode=''; } else {
        const d=dist(c.x+10,c.y+10,spot.cx,spot.cy);
        if(d<18){
          c.dx=0; c.dy=0;
          c.mode='playRide';
          c.ridePlayT=spot.playT+(Math.random()*60|0);
          c.bubble=spot.bubbles[Math.random()*spot.bubbles.length|0];
          c.bubT=110;
        } else {
          const a=Math.atan2(spot.cy-c.y-10,spot.cx-c.x-10);
          c.dx=Math.cos(a)*0.48;
          c.dy=Math.sin(a)*0.42;
        }
      }
    } else if(c.mode==='playRide'){
      c.ridePlayT--;
      c.dx=0; c.dy=0;
      if(c.ridePlayT%85===0 && c.rideSpot){
        c.bubble=c.rideSpot.bubbles[Math.random()*c.rideSpot.bubbles.length|0];
        c.bubT=90;
      }
      if(c.ridePlayT<=0){
        c.mode=''; c.rideSpot=null;
        c.rideCd=280+(Math.random()*200|0);
        c.timer=0; c.bubble='真好玩！'; c.bubT=90;
        addFloat(c.x+2,c.y-8,'开心','#ffe66b');
      }
    } else if(c.mode==='goFish'){
      const sp=c.fishSpot;
      if(!sp){ c.mode=''; } else {
        const d=dist(c.x+10,c.y+10,sp.x+10,sp.y+10);
        if(d<22){
          c.dx=0; c.dy=0;
          c.mode='fishing';
          c.fishT=270+Math.random()*120|0;
          c.bubble='🎣待鱼上钩'; c.bubT=90;
        } else {
          const a=Math.atan2(sp.y-c.y,sp.x-c.x);
          c.dx=Math.cos(a)*0.40;
          c.dy=Math.sin(a)*0.34;
        }
      }
    } else if(c.mode==='fishing'){
      c.dx=0; c.dy=0;
      c.fishT--;
      if(c.fishT%75===0){
        c.bubble=['等鱼...','快咬钩！','耐心...'][Math.random()*3|0];
        c.bubT=65;
      }
      if(c.fishT<=0){
        c.mode=''; c.fishSpot=null; c.timer=0;
        if(Math.random()<0.45){
          P.fish++;
          c.bubble='喵！钓到！'; c.bubT=110;
          addFloat(c.x+2,c.y-10,'+🐟','#60d0ff');
          c.dayFishCount=(c.dayFishCount||0)+1;
        } else {
          c.bubble='没钓到...'; c.bubT=70;
        }
      }
    } else if(c.mode==='seesaw'){
      const targetX=SEESAW.x+42, targetY=SEESAW.y-4;
      const a=Math.atan2(targetY-c.y,targetX-c.x);
      c.dx=Math.cos(a)*0.55;
      c.dy=Math.sin(a)*0.45;
      if(dist(c.x,c.y,targetX,targetY)<10){
        c.dx=0; c.dy=0;
        c.x=targetX; c.y=targetY;
        SEESAW.active=35;
        c.bubble=c.type==='dog'?'汪！好玩':c.type==='cat'?'喵~晃晃':'咯咯！';
        c.bubT=30;
      }
    } else if(c.type==='bee' && c.mode==='garden'){
      const garden=c.garden || GARDEN;
      const targetX=garden.x+garden.w/2-6, targetY=garden.y+garden.h/2-8;
      const a=Math.atan2(targetY-c.y,targetX-c.x);
      c.dx=Math.cos(a)*0.75;
      c.dy=Math.sin(a)*0.55;
      if(dist(c.x,c.y,targetX,targetY)<12){
        c.mode='nectar';
        c.nectarT=95;
        c.bubble='采蜜！';
        c.bubT=95;
      }
    } else if(c.type==='bee' && c.mode==='nectar'){
      c.nectarT--;
      c.dx=Math.sin(tick*0.1)*0.35;
      c.dy=Math.cos(tick*0.08)*0.22;
      if(c.nectarT<=0){
        c.mode='';
        c.garden=null;
        c.timer=0;
        P.honey++;
        addFloat(c.x,c.y,'+蜜 🍯','#ffe66b');
      }
    } else if(c.timer<=0){
      c.timer=70+Math.random()*130|0;
      const a=Math.random()*Math.PI*2;
      const sp=c.type==='bee' ? 0.65 : c.type==='chicken' ? 0.32 : 0.38;
      c.dx=Math.cos(a)*sp;
      c.dy=Math.sin(a)*sp*0.75;
      if(c.type==='bee' && Math.random()<0.45){
        c.mode='garden';
        c.garden=GARDENS[Math.random()*GARDENS.length|0];
        c.bubble='去花园';
        c.bubT=80;
      } else if(c.type==='cat' && !isNight() && (c.dayFishCount||0)<2 && Math.random()<0.5){
        // 猫：50% 概率去钓鱼
        const sp=nearestFishSpot(c.x,c.y);
        if(sp){ c.mode='goFish'; c.fishSpot=sp; c.bubble='去钓鱼~'; c.bubT=70; c.timer=0; }
      } else if(c.type!=='bee' && c.type!=='cat' && !isNight() && (c.rideCd||0)<=0 && Math.random()<0.28){
        let nearest=null, nearestD=Infinity;
        for(const spot of NPC_RIDE_SPOTS){
          const d=dist(c.x+10,c.y+10,spot.cx,spot.cy);
          if(d<spot.triggerR && d<nearestD){ nearest=spot; nearestD=d; }
        }
        if(nearest){ c.mode='goRide'; c.rideSpot=nearest; c.bubble=nearest.name+'！'; c.bubT=80; c.timer=0; }
      } else if(c.type==='cat' && !isNight() && (c.rideCd||0)<=0 && Math.random()<0.28){
        let nearest=null, nearestD=Infinity;
        for(const spot of NPC_RIDE_SPOTS){
          const d=dist(c.x+10,c.y+10,spot.cx,spot.cy);
          if(d<spot.triggerR && d<nearestD){ nearest=spot; nearestD=d; }
        }
        if(nearest){ c.mode='goRide'; c.rideSpot=nearest; c.bubble=nearest.name+'！'; c.bubT=80; c.timer=0; }
      }
    }
    const ox=c.x, oy=c.y;
    let nx=c.x+c.dx;
    let ny=c.y+c.dy+(c.type==='bee'?Math.sin(tick*0.08+c.phase)*0.12:0);

    if(c.type==='bee'){
      // 蜜蜂会飞，不受地面阻挡
      c.x=nx; c.y=ny;
      const adv=dist(ox,oy,c.x,c.y);
      c.step+=adv;
      if(c.poopEvery) c.poopStep=(c.poopStep||0)+adv;
      if(c.eggEvery) c.eggStep=(c.eggStep||0)+adv;
    } else {
      pushOut(c);                       // 保险：绝不嵌在实体里
      if(!blockedAt(c, nx, ny)){
        c.x=nx; c.y=ny;                 // 整体可走
      } else {
        // 分轴滑动：撞树/墙角/其它动物时沿可走的轴继续走，而不是原地反弹
        if(!blockedAt(c, nx, c.y)){ c.x=nx; } else { c.dx=-c.dx; }
        if(!blockedAt(c, c.x, ny)){ c.y=ny; } else { c.dy=-c.dy; }
      }
      const adv=dist(ox,oy,c.x,c.y);
      c.step+=adv;
      if(c.poopEvery) c.poopStep=(c.poopStep||0)+adv;
      if(c.eggEvery) c.eggStep=(c.eggStep||0)+adv;

      // 进展检测：长时间几乎没动 → 强制换方向（保证永远不会卡死）
      if(adv<0.06) c.noProgress=(c.noProgress||0)+1; else c.noProgress=0;
      if(c.noProgress>24){ escapeStuck(c); c.noProgress=0; }

      // 吃便便够不到时：放弃，并切回游走一段时间，避免立刻又去盯同一坨
      if(c.mode==='eatPoop'){
        if(adv<0.06) c.stuckT=(c.stuckT||0)+1; else c.stuckT=0;
        if(c.stuckT>55){
          c.mode=''; c.targetPoop=null; c.stuckT=0; c.timer=0;
          c.bubble='够不到'; c.bubT=80;
          if(c.type==='dog'){ c.behavior='wander'; c.behaviorT=240+Math.random()*150|0; }
        }
      }
      separateCritters(c);              // 极端情况下也能互相推开
    }

    c.x=Math.max(T,Math.min(c.x,(COLS-1)*T-22));
    c.y=Math.max(T,Math.min(c.y,(ROWS-1)*T-18));
    if(c.x<=T || c.x>=(COLS-1)*T-22) c.dx=-c.dx;
    if(c.y<=T || c.y>=(ROWS-1)*T-18) c.dy=-c.dy;
    if(Math.abs(c.dx)>0.05) c.dir=c.dx>=0?1:0;
    if(c.type==='dog'){
      const inWater=tileAt(c.x+10,c.y+16)===2||tileAt(c.x+13,c.y+16)===2;
      if(inWater && !c.wasSwimming){ c.bubble='游游游！'; c.bubT=80; }
      c.wasSwimming=inWater;
    }
    noticeDirtyPoop(c);
    if(c.poopEvery && (c.poopStep||c.step)>=c.poopEvery && c.mode!=='seesaw' && c.mode!=='eatPoop' && c.mode!=='garden' && c.mode!=='nectar' && c.mode!=='home'){
      createPoop(c);
    }
    if(c.eggEvery && (c.eggStep||0)>=c.eggEvery && c.mode!=='seesaw' && c.mode!=='home'){
      createEgg(c);
    }
  }
}

function updateSeesaw(){
  if(SEESAW.cooldown>0) SEESAW.cooldown--;
  if(SEESAW.active>0) SEESAW.active--;
  if(SEESAW.seated){
    P.x=SEESAW.x+4;
    P.y=SEESAW.y-10;
    SEESAW.active=35;

    // 被点名的小动物延迟一小会儿回应「来啦！」
    if(SEESAW.replyT>0){
      SEESAW.replyT--;
      if(SEESAW.replyT===0 && SEESAW.guestObj){
        SEESAW.guestObj.bubble='来啦！';
        SEESAW.guestObj.bubT=85;
      }
    }

    if(SPACE_HIT){
      releaseSeesawGuest();
      SEESAW.seated=false;
      SEESAW.guest=null;
      SEESAW.guestObj=null;
      SEESAW.replyT=0;
      SEESAW.cooldown=45;
      P.x=SEESAW.x+8;
      P.y=SEESAW.y+24;
      setBubble('跳下来！',70);
      return;
    }

    if(SEESAW.guest==='sheep'){
      const s=SHEEP[0];
      if(s.mode==='seesaw'){
        const targetX=SEESAW.x+42, targetY=SEESAW.y-2;
        const a=Math.atan2(targetY-s.y,targetX-s.x);
        s.dx=Math.cos(a)*0.6;
        s.dy=Math.sin(a)*0.5;
        if(dist(s.x,s.y,targetX,targetY)<10){
          s.x=targetX; s.y=targetY;
          s.dx=0; s.dy=0;
          s.bubble='咩！高高';
          s.bubT=35;
        }
      }
    }
    return;
  }

  const near=dist(P.x+P.w/2,P.y+P.h,SEESAW.x+28,SEESAW.y+12)<34;
  if(near && SPACE_HIT && SEESAW.cooldown<=0 && !SEESAW.guest && !SEESAW.sheepSeated){
    const pool=CRITTERS.filter(c=>c.type!=='bee');
    if(pool.length===0) return;
    const guest=pool[Math.random()*pool.length|0];
    const guestName=guest.name||guest.type;
    P.carMode=false;
    SEESAW.seated=true;
    SEESAW.playT=0;
    SEESAW.active=35;
    if(guest.mode==='buryPoop' && guest.buryPoop) guest.buryPoop.burying=false;
    guest.targetPoop=null;
    guest.buryPoop=null;
    guest.mode='seesaw';
    guest.playT=0;
    guest.bubble=''; guest.bubT=0;
    SEESAW.guest=guest.type;
    SEESAW.guestObj=guest;
    SEESAW.replyT=18;
    setBubble(guestName+'快来玩！', 95);
  }
}

function moveSheepToSeesaw(s){
  const targetX=SEESAW.x+42, targetY=SEESAW.y-2;
  const a=Math.atan2(targetY-s.y,targetX-s.x);
  const nx=s.x+Math.cos(a)*0.6;
  const ny=s.y+Math.sin(a)*0.5;
  s.dx=nx-s.x;
  s.dy=ny-s.y;
  if(dist(s.x,s.y,targetX,targetY)<10){
    s.x=targetX; s.y=targetY;
    s.dx=0; s.dy=0;
    s.bubble='咩！高高';
    s.bubT=35;
  } else if(canSheepMove(s,nx,ny) || SEESAW.seated){
    s.x=nx;
    s.y=ny;
  } else {
    s.x += Math.cos(a)*0.35;
    s.y += Math.sin(a)*0.3;
  }
  s.dir=s.dx>=0?1:0;
}

function releaseSeesawGuest(){
  if(SEESAW.guest==='sheep'){
    const s=SHEEP[0];
    s.mode='';
    s.timer=0;
    chooseSheepDirection(s);
    return;
  }
  // 用记录的具体对象，避免两只狗共用 type 时认错
  const c=SEESAW.guestObj || (SEESAW.guest && CRITTERS.find(v=>v.type===SEESAW.guest));
  if(c){
    c.mode='';
    c.timer=0;
    c.playT=0;
    c.targetPoop=null;
    c.buryPoop=null;
    if(c.type==='dog'){ c.behavior='wander'; c.behaviorT=180+Math.random()*120|0; }
  }
}

function updateOctopus(){
  if(OCTOPUS.cooldown>0) OCTOPUS.cooldown--;
  if(OCTOPUS.active>0) OCTOPUS.active--;
  if(OCTOPUS.active>0) OCTOPUS.angle += 0.11 + (OCTOPUS.active/600)*0.09;
  else OCTOPUS.angle += (0 - OCTOPUS.angle) * 0.04;

  if(OCTOPUS.seated){
    const bob=Math.sin(tick*0.18)*2;
    P.x=OCTOPUS.x+32;
    P.y=OCTOPUS.y+10+bob;
    P.dir=2;
    P.moving=false;
    if(OCTOPUS.active<=0 || SPACE_HIT){
      OCTOPUS.seated=false;
      OCTOPUS.cooldown=45;
      P.x=OCTOPUS.x+31;
      P.y=OCTOPUS.y+63;
      setBubble(OCTOPUS.active<=0?'转完啦！':'下来啦！',75);
    }
    return;
  }

  const near=dist(P.x+P.w/2,P.y+P.h,OCTOPUS.x+42,OCTOPUS.y+36)<42;
  if(near && SPACE_HIT && OCTOPUS.cooldown<=0){
    P.carMode=false;
    OCTOPUS.seated=true;
    OCTOPUS.active=600;
    OCTOPUS.angle=0;
    addFloat(OCTOPUS.x+28,OCTOPUS.y+2,'转转转','#e2a1ff');
    setBubble('坐稳咯！',75);
  }
}

function updateTrampoline(){
  if(TRAMPOLINE.cooldown>0) TRAMPOLINE.cooldown--;
  if(TRAMPOLINE.active>0) TRAMPOLINE.active--;
  if(TRAMPOLINE.seated){
    TRAMPOLINE.phase+=0.18;
    const hop=Math.abs(Math.sin(TRAMPOLINE.phase))*34;
    P.x=TRAMPOLINE.x+28;
    P.y=TRAMPOLINE.y+18-hop;
    P.dir=2;
    P.moving=false;
    if(tick%18===0) addFloat(P.x+6,P.y-4,'boing','#bfefff');
    if(TRAMPOLINE.active<=0 || SPACE_HIT){
      TRAMPOLINE.seated=false;
      TRAMPOLINE.cooldown=40;
      P.x=TRAMPOLINE.x+30;
      P.y=TRAMPOLINE.y+58;
      setBubble(TRAMPOLINE.active<=0?'弹够啦！':'跳下来！',70);
    }
    return;
  }
  const near=dist(P.x+P.w/2,P.y+P.h,TRAMPOLINE.x+38,TRAMPOLINE.y+34)<42;
  if(near && SPACE_HIT && TRAMPOLINE.cooldown<=0){
    P.carMode=false;
    TRAMPOLINE.seated=true;
    TRAMPOLINE.active=360;
    TRAMPOLINE.phase=0;
    setBubble('蹦起来！',70);
  }
}

function updateBubbleRide(){
  if(BUBBLE_RIDE.cooldown>0) BUBBLE_RIDE.cooldown--;
  if(BUBBLE_RIDE.active>0) BUBBLE_RIDE.active--;
  if(BUBBLE_RIDE.seated){
    if(!BUBBLE_RIDE.bubble){
      BUBBLE_RIDE.bubble={x:BUBBLE_RIDE.x+26,y:BUBBLE_RIDE.y+2,phase:Math.random()*Math.PI*2};
    }
    const b=BUBBLE_RIDE.bubble;
    b.phase+=0.045;
    b.x+=Math.sin(b.phase)*0.28;
    b.y-=0.12;
    b.x=Math.max(T,Math.min(b.x,WORLD_W-T));
    b.y=Math.max(T,Math.min(b.y,WORLD_H-T));
    P.x=b.x+7;
    P.y=b.y+8;
    P.dir=2;
    P.moving=false;
    if(tick%16===0) addFloat(P.x+6,P.y-6,'泡','#d8f6ff');
    if(BUBBLE_RIDE.active<=0 || SPACE_HIT){
      BUBBLE_RIDE.seated=false;
      BUBBLE_RIDE.cooldown=50;
      BUBBLE_RIDE.bubble=null;
      setBubble(BUBBLE_RIDE.active<=0?'啪！':'出泡泡！',75);
    }
    return;
  }
  const near=dist(P.x+P.w/2,P.y+P.h,BUBBLE_RIDE.x+37,BUBBLE_RIDE.y+29)<43;
  if(near && SPACE_HIT && BUBBLE_RIDE.cooldown<=0){
    P.carMode=false;
    BUBBLE_RIDE.seated=true;
    BUBBLE_RIDE.active=420;
    BUBBLE_RIDE.bubble={x:BUBBLE_RIDE.x+26,y:BUBBLE_RIDE.y+2,phase:0};
    setBubble('泡泡飞！',75);
  }
}

// ── 商店购买函数 ─────────────────────────────────────
function buyFloatie(){
  P.eggs-=10; P.carrots-=10;
  P.hasFloatie=true;
  setBubble('买到游泳圈！', 110);
  addFloat(P.x+6, P.y-10, '+游泳圈！', '#ffe060');
  addFireworkEffect(P.x+P.w/2, P.y);
}

function buyFishRod(){
  P.eggs-=10; P.carrots-=10;
  P.fishRod=true;
  setBubble('买到鱼竿！站水边按Space', 120);
  addFloat(P.x+6, P.y-10, '+鱼竿！', '#90c840');
  addFireworkEffect(P.x+P.w/2, P.y);
}

function buyChicken(){
  P.eggs-=20; P.carrots-=10;
  let cx=NESTS.chicken.x, cy=NESTS.chicken.y;
  for(let i=0;i<40;i++){
    const tx=NESTS.chicken.x+(Math.random()*5-2)*T;
    const ty=NESTS.chicken.y+(Math.random()*5-2)*T;
    if(tileAt(tx+10,ty+16)===0 && !solidAt(tx+10,ty+16)){ cx=tx; cy=ty; break; }
  }
  const names=['花鸡','胖鸡','小黄鸡','懒鸡'];
  CRITTERS.push({ type:'chicken', name:names[CRITTERS.filter(c=>c.type==='chicken').length%names.length],
    x:cx, y:cy, dir:1, dx:0.26, dy:0, timer:90, talkT:70, bubble:'', bubT:0, step:0,
    poopEvery:600+(Math.random()*80|0), eggEvery:500+(Math.random()*80|0) });
  setBubble('新小鸡加入！', 110);
  addFloat(P.x+6, P.y-10, '+小鸡！', '#ffd860');
  addFireworkEffect(P.x+P.w/2, P.y);
}

function buyDog(){
  P.eggs-=20; P.carrots-=10;
  const patrol=Math.random()<0.5;
  const names=['小黑','大毛','球球','旺财'];
  CRITTERS.push({ type:'dog', name:names[Math.floor(Math.random()*names.length)],
    coat:patrol?'brown':'white', x:NESTS.dog.x+(ri(3)-1)*T*2, y:NESTS.dog.y+T,
    dir:1, dx:0.35, dy:0, timer:60, talkT:50, bubble:'', bubT:0, step:0, poopEvery:550 });
  setBubble(patrol?'新狗狗！夜间巡逻型':'新狗狗！普通型', 110);
  addFloat(P.x+6, P.y-10, '+狗狗！', '#f0c878');
  addFireworkEffect(P.x+P.w/2, P.y);
}

function buyBee(){
  P.eggs-=10; P.carrots-=5;
  CRITTERS.push({ type:'bee', name:'小蜜'+CRITTERS.filter(c=>c.type==='bee').length,
    x:GARDEN.x+Math.random()*GARDEN.w, y:GARDEN.y+Math.random()*GARDEN.h,
    dir:1, dx:0.55, dy:0.15, timer:30, talkT:60,
    bubble:'', bubT:0, phase:Math.random()*3, step:0 });
  setBubble('新蜜蜂来啦！', 100);
  addFloat(P.x+6, P.y-10, '+蜜蜂！', '#ffe060');
  addFireworkEffect(P.x+P.w/2, P.y);
}

function buyCar(){
  P.eggs-=40; P.carrots-=20;
  P.hasCar=true;
  setBubble('买到小车！按X开车！', 130);
  addFloat(P.x+6, P.y-10, '+小车！', '#6a9aff');
  addFireworkEffect(P.x+P.w/2, P.y);
  addFireworkEffect(P.x+P.w/2-20, P.y-10);
  addFireworkEffect(P.x+P.w/2+20, P.y-10);
}

function sellFish(){
  P.fish--; P.eggs+=5;
  setBubble('+5个蛋！', 80);
  addFloat(P.x+6, P.y-10, '+5🥚', '#fff2a0');
}

function sellHoney(){
  P.honey-=10; P.eggs+=1;
  setBubble('+1个蛋！', 80);
  addFloat(P.x+6, P.y-10, '+1🥚', '#fff2a0');
}

// ── 商店菜单逻辑（兔叽，8 个选项）──────────────────────
function updateShop(){
  const N=8;
  const nearShop = dist(P.x+P.w/2, P.y+P.h, SHOP.x+61, SHOP.y+20) < 76;

  if(Q_HIT && SHOP.open){ SHOP.open=false; return; }

  if(SHOP.open){
    if(SHOP.navCd>0) SHOP.navCd--;
    if(SHOP.navCd===0){
      if(KEYS['w']){ SHOP.cursor=(SHOP.cursor+N-1)%N; SHOP.navCd=10; }
      if(KEYS['s']){ SHOP.cursor=(SHOP.cursor+1)%N;   SHOP.navCd=10; }
    }
    if(SPACE_HIT){
      const c=SHOP.cursor;
      if(c===0){
        if(P.hasFloatie) setBubble('已有游泳圈！',80);
        else if(P.eggs>=10&&P.carrots>=10) buyFloatie();
        else setBubble(`差 蛋x${Math.max(0,10-P.eggs)} 萝卜x${Math.max(0,10-P.carrots)}`,100);
      } else if(c===1){
        if(P.fishRod) setBubble('已有鱼竿！',80);
        else if(P.eggs>=10&&P.carrots>=10) buyFishRod();
        else setBubble(`差 蛋x${Math.max(0,10-P.eggs)} 萝卜x${Math.max(0,10-P.carrots)}`,100);
      } else if(c===2){
        if(P.eggs>=20&&P.carrots>=10) buyChicken();
        else setBubble('蛋x20+萝卜x10才够',100);
      } else if(c===3){
        if(P.eggs>=20&&P.carrots>=10) buyDog();
        else setBubble('蛋x20+萝卜x10才够',100);
      } else if(c===4){
        if(P.eggs>=10&&P.carrots>=5) buyBee();
        else setBubble('蛋x10+萝卜x5才够',100);
      } else if(c===5){
        if(P.hasCar) setBubble('已有小车！按X开',80);
        else if(P.eggs>=40&&P.carrots>=20) buyCar();
        else setBubble('蛋x40+萝卜x20才够',100);
      } else if(c===6){
        if(P.fish>0) sellFish();
        else setBubble('没有鱼可以卖',80);
      } else {
        if(P.honey>=10) sellHoney();
        else setBubble(`还差${Math.max(0,10-P.honey)}个蜂蜜`,80);
      }
    }
    return;
  }

  if(nearShop && SPACE_HIT && !FISH_MINI.active){
    SHOP.open=true; SHOP.cursor=0; SHOP.navCd=12;
    setBubble('欢迎光临！',80);
  }
}

// ── 碰撞推动：玩家/羊移动时推开附近动物 ───────────────
function pushCrittersByMover(mx, my, mw, mh, strength){
  const cx=mx+mw/2, cy=my+mh/2;
  for(const c of CRITTERS){
    if(c.type==='bee') continue;
    const ccx=c.x+11, ccy=c.y+14;
    const d=dist(cx,cy,ccx,ccy);
    if(d<32 && d>0.5){
      const pushStr=strength/Math.max(d,8);
      const ax=(ccx-cx)/d, ay=(ccy-cy)/d;
      const nx=c.x+ax*pushStr, ny=c.y+ay*pushStr;
      if(!blockedAt(c,nx,ny)){ c.x=nx; c.y=ny; }
      else if(!blockedAt(c,nx,c.y)) c.x=nx;
      else if(!blockedAt(c,c.x,ny)) c.y=ny;
      if(d<18 && strength>6){ c.bubble='哎哟！'; c.bubT=45; }
    }
  }
}

function updateHeadEffect(){
  if(P.headEffectCd>0) P.headEffectCd--;
  const s=SHEEP[0];
  const rh=rabbitHeadRect();
  const sh=sheepHeadRect(s);
  const rc={x:rh.x+rh.w/2,y:rh.y+rh.h/2};
  const sc={x:sh.x+sh.w/2,y:sh.y+sh.h/2};
  const isHeadBump = P.moving && P.headEffectCd<=0 && (
    nearRects(rh,sh,5) || dist(rc.x,rc.y,sc.x,sc.y)<24
  );
  if(isHeadBump) triggerHeadEffect((rc.x+sc.x)/2, Math.min(rc.y,sc.y)-10);
}

function guideSheepHome(s){
  const home={x:3*T, y:6*T};
  const d=dist(s.x+11,s.y+10,home.x+11,home.y+10);
  if(d<14){
    s.dx=0; s.dy=0;
    if(tick%120===0){ s.bubble='陪兔叽'; s.bubT=80; }
    return;
  }
  const ox=s.x, oy=s.y;
  const a=Math.atan2(home.y-s.y,home.x-s.x);
  const nx=s.x+Math.cos(a)*0.42;
  const ny=s.y+Math.sin(a)*0.36;
  s.dx=nx-s.x;
  s.dy=ny-s.y;
  if(canSheepMove(s,nx,ny)){ s.x=nx; s.y=ny; }
  else if(canSheepMove(s,nx,s.y)){ s.x=nx; }
  else if(canSheepMove(s,s.x,ny)){ s.y=ny; }
  else chooseSheepDirection(s,0.32);
  trackPoopStep(s, dist(ox,oy,s.x,s.y));
  s.dir=s.dx>=0?1:0;
}

// ── 对话气泡 ─────────────────────────────────────────

// ── 玩家控制羊叽 ─────────────────────────────────────
function updateSheepPlayer(){
  const s=SHEEP[0];
  if(s.bubT>0) s.bubT--;
  s.talkT--;
  if(s.talkT<=0){
    const lines=['咩~','玩玩~','好好玩','好开心'];
    s.bubble=lines[Math.random()*lines.length|0];
    s.bubT=85; s.talkT=180+Math.random()*220|0;
  }

  // ── 跷跷板 ──
  if(s.rideMode==='seesaw'){
    s.x=SEESAW.x+42; s.y=SEESAW.y-4;
    SEESAW.active=35;
    if(SHEEP_ENTER_HIT){
      s.rideMode=''; SEESAW.sheepSeated=false; SEESAW.cooldown=45;
      s.x=SEESAW.x+50; s.y=SEESAW.y+26;
      s.bubble='跳下来！'; s.bubT=70;
    }
    return;
  }
  // ── 蹦蹦云 ──
  if(s.rideMode==='trampoline'){
    s.ridePhase+=0.18;
    const hop=Math.abs(Math.sin(s.ridePhase))*34;
    s.x=TRAMPOLINE.x+44; s.y=TRAMPOLINE.y+18-hop;
    TRAMPOLINE.active=35;
    if(tick%18===0) addFloat(s.x+6,s.y-4,'boing','#bfefff');
    if(SHEEP_ENTER_HIT){
      s.rideMode=''; TRAMPOLINE.sheepSeated=false; TRAMPOLINE.cooldown=40;
      s.x=TRAMPOLINE.x+52; s.y=TRAMPOLINE.y+60;
      s.bubble='弹够啦！'; s.bubT=70;
    }
    return;
  }
  // ── 八爪章鱼 ──
  if(s.rideMode==='octopus'){
    const bob=Math.sin(tick*0.18)*2;
    s.x=OCTOPUS.x+18; s.y=OCTOPUS.y+40+bob;
    if(OCTOPUS.active<35) OCTOPUS.active=35;
    if(SHEEP_ENTER_HIT){
      s.rideMode=''; OCTOPUS.sheepSeated=false; OCTOPUS.cooldown=45;
      s.x=OCTOPUS.x+12; s.y=OCTOPUS.y+68;
      s.bubble='转完啦！'; s.bubT=75;
    }
    return;
  }
  // ── 泡泡机 ──
  if(s.rideMode==='bubble'){
    if(!s.rideBubble) s.rideBubble={x:BUBBLE_RIDE.x+40,y:BUBBLE_RIDE.y+2,phase:Math.random()*Math.PI*2};
    const b=s.rideBubble;
    b.phase+=0.045; b.x+=Math.sin(b.phase)*0.28; b.y-=0.12;
    b.x=Math.max(T,Math.min(b.x,WORLD_W-T)); b.y=Math.max(T,Math.min(b.y,WORLD_H-T));
    s.x=b.x+7; s.y=b.y+8;
    if(BUBBLE_RIDE.active<35) BUBBLE_RIDE.active=35;
    if(tick%16===0) addFloat(s.x+6,s.y-6,'泡','#d8f6ff');
    if(SHEEP_ENTER_HIT){
      s.rideMode=''; BUBBLE_RIDE.sheepSeated=false; BUBBLE_RIDE.cooldown=50; s.rideBubble=null;
      s.bubble='啪！'; s.bubT=75;
    }
    return;
  }

  // ── 移动 ──
  const sp = s.hasCar ? 0.7*3 : 0.7;
  const ox=s.x, oy=s.y;
  if(KEYS['arrowleft'])  { if(canSheepMove(s,s.x-sp,s.y)) s.x-=sp; s.dir=0; }
  if(KEYS['arrowright']) { if(canSheepMove(s,s.x+sp,s.y)) s.x+=sp; s.dir=1; }
  if(KEYS['arrowup'])    { if(canSheepMove(s,s.x,s.y-sp)) s.y-=sp; }
  if(KEYS['arrowdown'])  { if(canSheepMove(s,s.x,s.y+sp)) s.y+=sp; }
  s.x=Math.max(T,Math.min(s.x,(COLS-1)*T-22));
  s.y=Math.max(T,Math.min(s.y,(ROWS-1)*T-18));
  trackPoopStep(s, dist(ox,oy,s.x,s.y));

  // ── 羊叽钓鱼 ──
  if(s.fishRod && SHEEP_ENTER_HIT && !SHOP.sheepOpen && !s.rideMode
     && isNearWater(s.x, s.y, 22, 18)){
    startFishing('sheep');
    SHEEP_ENTER_HIT=false;
    return;
  }

  // ── 羊叽购物（Enter 开关菜单，W/S 选，Enter 买）──
  const sheepNearShop = dist(s.x+11, s.y+10, SHOP.x+61, SHOP.y+20) < 76;
  const SN=8;
  if(!SHOP.sheepOpen && sheepNearShop && SHEEP_ENTER_HIT){
    SHOP.sheepOpen=true; SHOP.sheepCursor=0; SHOP.navCd=12;
    s.bubble='咩！逛店！'; s.bubT=80; return;
  }
  if(SHOP.sheepOpen){
    if(SHOP.navCd>0) SHOP.navCd--;
    if(SHOP.navCd===0){
      if(KEYS['arrowup'])   { SHOP.sheepCursor=(SHOP.sheepCursor+SN-1)%SN; SHOP.navCd=10; }
      if(KEYS['arrowdown']) { SHOP.sheepCursor=(SHOP.sheepCursor+1)%SN;    SHOP.navCd=10; }
    }
    if(Q_HIT){ SHOP.sheepOpen=false; return; }
    if(SHEEP_ENTER_HIT){
      const sc=SHOP.sheepCursor;
      const ok=(msg)=>{ s.bubble=msg; s.bubT=100; addFireworkEffect(s.x+11,s.y); };
      const no=(msg)=>{ s.bubble=msg; s.bubT=80; };
      if(sc===0){
        if(s.hasFloatie) no('已有游泳圈！');
        else if(P.eggs>=10&&P.carrots>=10){ P.eggs-=10; P.carrots-=10; s.hasFloatie=true; ok('咩！游泳圈！'); }
        else no('材料不够！');
      } else if(sc===1){
        if(s.fishRod) no('已有鱼竿！');
        else if(P.eggs>=10&&P.carrots>=10){ P.eggs-=10; P.carrots-=10; s.fishRod=true; ok('咩！鱼竿！'); }
        else no('材料不够！');
      } else if(sc===2){
        if(P.eggs>=20&&P.carrots>=10){ buyChicken(); ok('咩！新小鸡！'); }
        else no('蛋x20+萝卜x10才够');
      } else if(sc===3){
        if(P.eggs>=20&&P.carrots>=10){ buyDog(); ok('咩！新狗狗！'); }
        else no('蛋x20+萝卜x10才够');
      } else if(sc===4){
        if(P.eggs>=10&&P.carrots>=5){ buyBee(); ok('咩！新蜜蜂！'); }
        else no('蛋x10+萝卜x5才够');
      } else if(sc===5){
        if(s.hasCar) no('已有小车！');
        else if(P.eggs>=40&&P.carrots>=20){ P.eggs-=40; P.carrots-=20; s.hasCar=true; ok('咩！有车了！'); }
        else no('蛋x40+萝卜x20才够');
      } else if(sc===6){
        if(s.fish>0){ s.fish--; P.eggs+=5; s.bubble='卖鱼+5蛋！'; s.bubT=90; }
        else no('没有鱼！');
      } else {
        if(P.honey>=10){ P.honey-=10; P.eggs+=1; s.bubble='卖蜜+1蛋！'; s.bubT=90; }
        else no(`还差${Math.max(0,10-P.honey)}个蜂蜜`);
      }
    }
    return;
  }

  // ── 娱乐设施入口 ──
  if(SHEEP_ENTER_HIT){
    const sx=s.x+11, sy=s.y+10;
    if(!SEESAW.sheepSeated && SEESAW.cooldown<=0 && dist(sx,sy,SEESAW.x+28,SEESAW.y+12)<48){
      s.rideMode='seesaw'; SEESAW.sheepSeated=true; SEESAW.active=35;
      s.bubble='荡秋千！'; s.bubT=80;
    } else if(!TRAMPOLINE.sheepSeated && TRAMPOLINE.cooldown<=0 && dist(sx,sy,TRAMPOLINE.x+38,TRAMPOLINE.y+34)<56){
      s.rideMode='trampoline'; TRAMPOLINE.sheepSeated=true; TRAMPOLINE.active=35; s.ridePhase=0;
      s.bubble='咩！蹦！'; s.bubT=70;
    } else if(!OCTOPUS.sheepSeated && OCTOPUS.cooldown<=0 && dist(sx,sy,OCTOPUS.x+42,OCTOPUS.y+36)<58){
      s.rideMode='octopus'; OCTOPUS.sheepSeated=true; OCTOPUS.active=600;
      s.bubble='转转转！'; s.bubT=75;
    } else if(!BUBBLE_RIDE.sheepSeated && BUBBLE_RIDE.cooldown<=0 && dist(sx,sy,BUBBLE_RIDE.x+37,BUBBLE_RIDE.y+29)<56){
      s.rideMode='bubble'; BUBBLE_RIDE.sheepSeated=true; BUBBLE_RIDE.active=420;
      s.rideBubble={x:BUBBLE_RIDE.x+40,y:BUBBLE_RIDE.y+2,phase:0};
      s.bubble='泡泡飞！'; s.bubT=75;
    }
  }
}

// ── 钓鱼系统 ─────────────────────────────────────────
function isNearWater(x, y, w, h){
  return tileAt(x+w/2, y-10)===2 || tileAt(x+w/2, y+h+10)===2 ||
         tileAt(x-10,  y+h/2)===2 || tileAt(x+w+10, y+h/2)===2;
}

function nearestFishSpot(cx, cy){
  let best=null, bestD=Infinity;
  const tx=cx/T|0, ty=cy/T|0;
  for(let dy=-16;dy<=16;dy++) for(let dx=-16;dx<=16;dx++){
    const wx=tx+dx, wy=ty+dy;
    if(!MAP[wy]||MAP[wy][wx]!==2) continue;
    for(const [ndx,ndy] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const nx=wx+ndx, ny=wy+ndy;
      if(!MAP[ny]) continue;
      const t=MAP[ny][nx];
      if(t===3||t===2||t===4) continue; // 只排除围栏/水/树
      const d=Math.hypot(dx+ndx,dy+ndy);
      if(d<bestD){ bestD=d; best={x:nx*T+4,y:ny*T+4}; }
    }
  }
  return best;
}

function startFishing(who){
  if(FISH_MINI.active||FISH_MINI.resultT>0) return;
  FISH_MINI.who=who;
  FISH_MINI.active=true;
  FISH_MINI.barY=0.6; FISH_MINI.barV=0;
  FISH_MINI.fishY=0.15+Math.random()*0.7;
  FISH_MINI.fishV=0;
  FISH_MINI.fishTarget=0.2+Math.random()*0.6;
  FISH_MINI.fishChangeT=50+Math.random()*60|0;
  FISH_MINI.catchMeter=0.5;
  FISH_MINI.result='';
}

function updateFishMini(){
  const m=FISH_MINI;
  if(m.resultT>0){ m.resultT--; return; }
  if(!m.active) return;

  // 消费按键，防止其他系统响应
  if(m.who==='rabbit') SPACE_HIT=false;
  else SHEEP_ENTER_HIT=false;

  const pressing = m.who==='rabbit' ? KEYS[' '] : KEYS['enter'];

  // 玩家绿条
  // 绿条：上升和下落都很缓慢
  m.barV += pressing ? -0.010 : 0.004;
  m.barV = Math.max(-0.030, Math.min(0.030, m.barV));
  m.barY = Math.max(0, Math.min(1-m.barH, m.barY+m.barV));

  // 鱼移动：更慢更流畅
  if(--m.fishChangeT<=0){
    m.fishTarget=0.08+Math.random()*0.84;
    m.fishChangeT=60+Math.random()*120|0;
  }
  m.fishV += (m.fishTarget-m.fishY)*0.008;
  m.fishV *= 0.90;
  m.fishV += (Math.random()-0.5)*0.004;
  m.fishV = Math.max(-0.028, Math.min(0.028, m.fishV));
  m.fishY = Math.max(0.02, Math.min(0.98, m.fishY+m.fishV));

  // 捕获仪表（稍微容易一点）
  const inBar = m.fishY>=m.barY && m.fishY<=m.barY+m.barH;
  m.catchMeter = Math.max(0, Math.min(1, m.catchMeter + (inBar?0.020:-0.010)));

  if(m.catchMeter>=1){
    m.active=false; m.result='catch'; m.resultT=90;
    if(m.who==='rabbit'){ P.fish++; setBubble('钓到了！🐟',90); addFloat(P.x+4,P.y-14,'+Fish!','#60d0ff'); }
    else { const s=SHEEP[0]; s.fish++; s.bubble='咩！钓到！'; s.bubT=90; addFloat(s.x+4,s.y-14,'+Fish!','#60d0ff'); }
  } else if(m.catchMeter<=0){
    m.active=false; m.result='fail'; m.resultT=60;
    if(m.who==='rabbit') setBubble('跑掉了...',70);
    else { SHEEP[0].bubble='咩...跑了'; SHEEP[0].bubT=70; }
  }
}

