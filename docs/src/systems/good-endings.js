const WL_GOOD_ENDINGS_KEY='wrenchlife.goodEndings';
const GOOD_ENDING_DEFS={
  roadworthy:{
    title:'ROADWORTHY',
    body:'The project is finally something you trust enough to take the long way home. It starts, drives, stops, and no longer looks abandoned.',
    hint:'Finish a project and make it genuinely dependable.',
    check:()=>S.completed&&S.startable&&S.driveable&&S.reliability>=75&&S.bodyCondition>=72
  },
  built_not_bought:{
    title:'BUILT NOT BOUGHT',
    body:'You did not just restore it. You made it yours, learned enough to understand the changes, and built something that still works afterward.',
    hint:'Finish a reliable project with real performance work and a reputation for doing the work correctly.',
    check:()=>S.completed&&S.startable&&S.driveable&&S.reliability>=80&&(S.performanceScore||0)>=20&&S.knowledge>=30&&(S.reputationChannels?.workmanship||0)>=20
  },
  under_the_lights:{
    title:'UNDER THE LIGHTS',
    body:'You park under the meet lights and people stop walking. The same rough project that started in the driveway now looks like somebody cared.',
    hint:'Build a finished car with excellent appearance and real car-scene reputation.',
    check:()=>S.completed&&S.startable&&appearanceScore()>=90&&(S.styleScore||0)>=10&&(S.reputationChannels?.scene||0)>=30
  },
  out_of_the_driveway:{
    title:'OUT OF THE DRIVEWAY',
    body:'The project car is finished, the toolbox has a permanent home, and your parents finally get their driveway back.',
    hint:'Finish a project, build a reputation, save money, and move into your own house/garage.',
    check:()=>S.completed&&S.location==='house'&&S.cash>=1500&&S.reputation>=25
  },
  wrench_life:{
    title:'WRENCH LIFE',
    body:'One project became two. Friends started trusting your work. Somewhere along the way, messing with broken cars stopped being a phase and became your life.',
    hint:'Complete multiple projects and become genuinely knowledgeable and trusted.',
    check:()=>completedProjectCount()>=2&&S.knowledge>=45&&(S.reputationChannels?.workmanship||0)>=40&&(S.reputationChannels?.friends||0)>=30
  }
};
function readGoodEndings(){try{return JSON.parse(localStorage.getItem(WL_GOOD_ENDINGS_KEY)||'[]')}catch{return []}}
function recordGoodEnding(e){const arr=readGoodEndings();arr.unshift(e);localStorage.setItem(WL_GOOD_ENDINGS_KEY,JSON.stringify(arr.slice(0,30)))}
function discoveredGoodEndingIds(){return [...new Set(readGoodEndings().map(e=>e.id))]}
function goodEndingCount(){return discoveredGoodEndingIds().length}
function badEndingUniqueCount(){return [...new Set(readBadEndings().map(e=>e.id))].length}
function completedProjectCount(){
  if(!S)return 0;
  syncActiveProject();
  return (S.projects||[]).filter(p=>p.completed).length;
}
function availableGoodEndings(){
  if(!S||S.gameOver)return [];
  S.goodEndingsEarned=S.goodEndingsEarned||[];
  return Object.entries(GOOD_ENDING_DEFS).filter(([id,d])=>!S.goodEndingsEarned.includes(id)&&(()=>{try{return d.check()}catch{return false}})()).map(([id,d])=>({id,...d}));
}
function triggerGoodEnding(id){
  if(!S||S.gameOver)return false;
  const d=GOOD_ENDING_DEFS[id];if(!d||!d.check())return false;
  S.goodEndingsEarned=S.goodEndingsEarned||[];
  if(S.goodEndingsEarned.includes(id))return false;
  const ending={id,title:d.title,body:d.body,day:dayNum(),seed:S.runSeed||currentRunSeed(),car:S.car.name,cash:Math.round(S.cash),knowledge:S.knowledge,reputation:S.reputation,reliability:S.reliability,appearance:appearanceScore(),projects:completedProjectCount(),when:Date.now()};
  S.goodEndingsEarned.push(id);
  S.lastGoodEnding=ending;
  if(!S.goodEndingOffersSeen?.includes(id)){S.goodEndingOffersSeen=S.goodEndingOffersSeen||[];S.goodEndingOffersSeen.push(id)}
  recordGoodEnding(ending);saveGame();showGoodEndingModal();return true;
}
function showGoodEndingModal(){
  const e=S?.lastGoodEnding;if(!e)return;
  showModal(`<h2>GOOD ENDING ACHIEVED: ${e.title}</h2><div class="card endingcard"><p class="goodtxt"><b>${e.body}</b></p><div class="market-meta"><div><span>DAY</span><b>${e.day}</b></div><div><span>CAR</span><b>${e.car}</b></div><div><span>KNOWLEDGE</span><b>${e.knowledge}</b></div><div><span>REPUTATION</span><b>${e.reputation}</b></div></div><p class="seed-display">${e.seed}</p><p class="small">This ending is now collected for the run and saved locally. The run is <b>not over</b> — keep buying cars, finishing projects, hunting parts, and collecting other endings.</p></div><div class="modal-actions three"><button class="good" onclick="continueAfterGoodEnding()">CONTINUE WRENCHING</button><button onclick="openEndingsArchive('good')">ENDINGS</button><button onclick="saveAndReturnToMenu()">SAVE + MAIN MENU</button></div>`,'ending');
}
function continueAfterGoodEnding(){closeModal();saveGame();render()}
function offerGoodEnding(id){
  const d=GOOD_ENDING_DEFS[id];if(!d||!d.check()||(S.goodEndingsEarned||[]).includes(id))return false;
  showModal(`<h2>GOOD ENDING AVAILABLE: ${d.title}</h2><div class="card"><p><b>${d.body}</b></p><p class="small">You reached a major Wrench Life milestone. Claiming it adds it to this run's collection — it does <b>not</b> end the run.</p></div><div class="modal-actions"><button class="good" onclick="triggerGoodEnding('${id}')">CLAIM GOOD ENDING</button><button onclick="keepWrenchingFromGoodEnding()">NOT YET</button></div>`,'good-ending-offer');
  return true;
}
function keepWrenchingFromGoodEnding(){
  S.goodEndingOffersSeen=S.goodEndingOffersSeen||[];
  for(const e of availableGoodEndings())if(!S.goodEndingOffersSeen.includes(e.id))S.goodEndingOffersSeen.push(e.id);
  closeModal();saveGame();render();
}
function maybeOfferGoodEnding(){
  if(!S||S.gameOver)return false;
  S.goodEndingOffersSeen=S.goodEndingOffersSeen||[];
  const next=availableGoodEndings().find(e=>!S.goodEndingOffersSeen.includes(e.id));
  return next?offerGoodEnding(next.id):false;
}
function openGoodEndingOptions(){
  const arr=availableGoodEndings(),earned=S.goodEndingsEarned||[];
  const earnedRows=earned.length?earned.map(id=>GOOD_ENDING_DEFS[id]).filter(Boolean).map(e=>`<div class="card"><div class="jobhead"><b>${e.title}</b><span class="goodtxt">COLLECTED THIS RUN</span></div><p class="small">${e.body}</p></div>`).join(''):'';
  const rows=arr.length?arr.map(e=>`<div class="card"><div class="jobhead"><b>${e.title}</b><span class="risk">AVAILABLE</span></div><p>${e.body}</p><button class="good" onclick="triggerGoodEnding('${e.id}')">CLAIM: ${e.title}</button></div>`).join(''):'<div class="card"><p>No unclaimed good ending is available right now.</p><p class="small">Keep building. The Endings archive on the main menu has hints.</p></div>';
  showModal(`<h2>Good Endings</h2><div class="card"><p>Good endings are collectible milestones. Claiming one never ends your save.</p></div>${earnedRows}${rows}<div class="modal-actions"><button onclick="openProjectState()">BACK TO PROJECT STATE</button></div>`);
}
function openEndingsArchive(fromGame=false){
  const good=readGoodEndings(),bad=readBadEndings(),goodIds=new Set(good.map(e=>e.id)),badIds=new Set(bad.map(e=>e.id));
  const goodRows=Object.entries(GOOD_ENDING_DEFS).map(([id,d])=>{
    const found=good.find(e=>e.id===id);
    return found?`<div class="card"><div class="jobhead"><b>${d.title}</b><span class="goodtxt">DISCOVERED</span></div><p>${d.body}</p><p class="small">First/most recent record: Day ${found.day} - ${found.car} - Seed ${found.seed}</p></div>`:`<div class="card"><div class="jobhead"><b>???</b><span class="small">UNDISCOVERED</span></div><p class="small">Hint: ${d.hint}</p></div>`;
  }).join('');
  const badRows=Object.entries(BAD_ENDING_DEFS).map(([id,d])=>{
    const found=bad.find(e=>e.id===id);
    return found?`<div class="card"><div class="jobhead"><b>${d.title}</b><span class="badtxt">DISCOVERED</span></div><p>${d.body}</p><p class="small">Day ${found.day} - ${found.car} - Seed ${found.seed}</p></div>`:`<div class="card"><div class="jobhead"><b>???</b><span class="small">UNDISCOVERED</span></div><p class="small">Some bad endings are better left undiscovered.</p></div>`;
  }).join('');
  const back=fromGame==='good'?'showGoodEndingModal()':fromGame?'showBadEndingModal()':'closeModal()';
  showModal(`<h2>Endings</h2><div class="card"><div class="market-meta"><div><span>GOOD</span><b>${goodIds.size}/${Object.keys(GOOD_ENDING_DEFS).length}</b></div><div><span>BAD</span><b>${badIds.size}/${Object.keys(BAD_ENDING_DEFS).length}</b></div></div><p class="small">Good endings are deliberate goals. Bad endings usually come from ignoring a warning and doubling down.</p></div><h2>Good Endings</h2>${goodRows}<h2>Bad Endings</h2>${badRows}<div class="modal-actions"><button onclick="${back}">BACK</button></div>`,fromGame?'ending':'');
}
