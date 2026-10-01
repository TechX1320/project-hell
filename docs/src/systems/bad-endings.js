const WL_ENDINGS_KEY='wrenchlife.badEndings';
const BAD_ENDING_DEFS={
 broke:{title:'BURIED IN RECEIPTS',body:'You are more than $750 underwater. Nobody is fronting you more money, and the project has to stop.'},
 engine_destroyed:{title:'INTERFERENCE',body:'You pushed a critical engine repair past the point where it wanted to be pushed. The engine is now expensive sculpture.'},
 garage_fire:{title:'GARAGE PRIVILEGES REVOKED',body:'Fuel, fatigue, and bad decisions finally become a small garage fire. The project survives only as a cautionary story.'},
 microsleep_wreck:{title:'ONE MORE DRIVE',body:'You stayed awake long enough to stop making useful decisions. The drive ends with a totaled project and a hospital bill.'},
 totaled_project:{title:'RAN OUT OF TALENT',body:'Something gives up at speed and the project leaves the road. You walk away. The car does not.'}
};
function readBadEndings(){try{return JSON.parse(localStorage.getItem(WL_ENDINGS_KEY)||'[]')}catch{return []}}
function recordBadEnding(e){const arr=readBadEndings();arr.unshift(e);localStorage.setItem(WL_ENDINGS_KEY,JSON.stringify(arr.slice(0,30)))}
function endingCount(){return readBadEndings().length}
function triggerBadEnding(id,extra=''){
 if(!S||S.gameOver)return false;
 const d=BAD_ENDING_DEFS[id]||{title:'RUN OVER',body:'The build ends here.'};
 S.gameOver=true;
 S.badEnding={id,title:d.title,body:d.body+(extra?' '+extra:''),day:dayNum(),seed:S.runSeed||currentRunSeed(),car:S.car.name,cash:Math.round(S.cash),knowledge:S.knowledge,when:Date.now()};
 recordBadEnding(S.badEnding);saveGame();showBadEndingModal();return true;
}
function showBadEndingModal(){
 if(!S?.badEnding)return;
 const e=S.badEnding;
 showModal(`<h2>BAD ENDING: ${e.title}</h2><div class="card endingcard"><p class="badtxt"><b>${e.body}</b></p><div class="market-meta"><div><span>DAY</span><b>${e.day}</b></div><div><span>CAR</span><b>${e.car}</b></div><div><span>KNOWLEDGE</span><b>${e.knowledge}</b></div><div><span>CASH</span><b>$${Math.round(e.cash).toLocaleString()}</b></div></div><p class="seed-display">${e.seed}</p><p class="small">The ending is saved locally. The seed is preserved if you want another shot at the exact same world.</p></div><div class="modal-actions three"><button class="danger" onclick="restartBadEndingSameSeed()">RESTART SAME SEED</button><button onclick="openBadEndingsArchive(true)">BAD ENDINGS</button><button onclick="returnFromBadEnding()">MAIN MENU</button></div>`,'ending');
}
function restartBadEndingSameSeed(){
 const slot=activeSaveSlot||S?.saveSlot||1,seed=S?.badEnding?.seed||S?.runSeed||currentRunSeed();
 deleteSaveSlot(slot);S=null;pendingNewGameSlot=slot;pendingNewGameSeed=seed;activateRunSeed(seed);activeSaveSlot=slot;
 $('menu').classList.add('hidden');$('game').classList.add('hidden');$('start').classList.remove('hidden');$('menuBtn').classList.add('hidden');
 $('newGameSeedLabel').textContent='SEED '+seed+' // SLOT '+slot;closeModal();makeCars();
}
function returnFromBadEnding(){closeModal();initMainMenu()}
function openBadEndingsArchive(fromGame=false){
 const arr=readBadEndings(),rows=arr.length?arr.slice(0,12).map(e=>`<div class="card"><div class="jobhead"><b>${e.title}</b><span class="risk">DAY ${e.day}</span></div><p>${e.car}</p><p class="small">Seed ${e.seed} - Knowledge ${e.knowledge} - $${Math.round(e.cash).toLocaleString()}</p></div>`).join(''):'<div class="card"><p>No bad endings found yet. Give it time.</p></div>';
 showModal(`<h2>Bad Endings</h2><div class="card"><p>These are local discoveries from this browser. Some are preventable. Some require you to make a very questionable second decision after the first one already went badly.</p></div>${rows}<div class="modal-actions"><button onclick="${fromGame?'showBadEndingModal()':'closeModal()'}">BACK</button></div>`,fromGame?'ending':'');
}
function catastrophicRepairCapable(t){return !!t&&['timing','head','cams','fuelpump','injectors'].includes(t.id)}
function maybeCatastrophicRepair(t,approach='normal'){
 if(!catastrophicRepairCapable(t))return false;
 let chance=approach==='risk'?.16:.035;
 if(S.awakeHours>=24||S.energy<20)chance+=.16;else if(S.awakeHours>=20||S.energy<35)chance+=.09;else if(S.awakeHours>=16)chance+=.04;
 if(t.id==='timing'||t.id==='head'||t.id==='cams'){
  if(Math.random()<chance)return triggerBadEnding('engine_destroyed',`The ${t.name.toLowerCase()} failure was the final one.`);
 }else{
  if(Math.random()<chance*.72)return triggerBadEnding('garage_fire',`The ${t.name.toLowerCase()} job was the one that did it.`);
 }
 return false;
}
function maybeCatastrophicDrive(kind='street'){
 let chance=0;
 if(S.awakeHours>=24||S.energy<18)chance=.24;else if(S.awakeHours>=20||S.energy<28)chance=.12;else if(S.awakeHours>=18)chance=.045;
 if(S.reliability<15)chance+=.10;else if(S.reliability<25)chance+=.05;
 if(kind==='race')chance+=.07;
 if(chance<=0||Math.random()>=clamp(chance,0,.45))return false;
 return triggerBadEnding(S.awakeHours>=22?'microsleep_wreck':'totaled_project');
}
