const NO_START_CAUSES={
  battery:{item:'battery_12v',cat:'Electrical',group:'no_crank',symptom:'one heavy click and the lights sag hard'},
  cables:{item:'battery_terminal_kit',cat:'Electrical',group:'no_crank',symptom:'the lights flicker and the starter chatters like the battery connection is barely hanging on'},
  starter:{item:'starter',cat:'Electrical',group:'no_crank',symptom:'the dash stays bright but the engine will not crank normally'},
  ignition:{item:'spark_set',cat:'Engine',group:'crank_no_fire',symptom:'the engine cranks normally but never catches'},
  timing:{item:'timing_kit',cat:'Engine',group:'mechanical',symptom:'the engine cranks strangely fast / uneven'}
};
function noStartCause(source='legacy'){
  if(source==='starter')return 'starter';
  if(source==='plugs')return 'ignition';
  if(source==='timing'||source==='head'||source==='cams')return 'timing';
  if(source==='legacy')return Math.random()<.72?'battery':'cables';
  return 'battery';
}
function ensureNoStartIssue(source='legacy'){
  if(S.startable)return null;
  if(S.noStartIssue){
    if(S.noStartIssue.cause==='battery'&&!S.noStartIssue.batteryState)S.noStartIssue.batteryState=Math.random()<.58?'discharged':'failed';
    return S.noStartIssue;
  }
  const cause=noStartCause(source),d=NO_START_CAUSES[cause];
  S.noStartIssue={id:`NS-${S.activeProjectUid||'p1'}-${S.projectClues||0}`,cause,item:d.item,cat:d.cat,group:d.group,symptom:d.symptom,diagnosed:false,researched:false,fixed:false,tries:0,batteryState:cause==='battery'?(Math.random()<.58?'discharged':'failed'):null,jumpTested:false};
  return S.noStartIssue;
}
function setNoStartIssue(source='legacy'){S.startable=false;return ensureNoStartIssue(source)}
function createNoStartLead(){
  const n=ensureNoStartIssue();if(!n||n.researched)return;
  if(S.learningLead&&!S.learningLead.noStart){showModal('<h2>Finish the current lead first</h2><div class="card"><p>You already have another focused research lead open.</p></div><div class="modal-actions"><button onclick="openProjectState()">BACK</button></div>');return}
  if(!S.learningLead&&maybeCreateLead(`no-start symptom: ${n.symptom}`,S.car.make,n.cat,1)){S.learningLead.noStart=true;S.learningLead.truth=true;S.learningLead.sourceMake=S.car.make}
  openResearch();
}
function diagnoseNoStart(){
  const n=ensureNoStartIssue();if(!n||n.diagnosed)return openProjectState();
  passTime(.75,true);n.diagnosed=true;addLog(`No-start diagnosis: ${n.symptom}. Now you have something specific to research.`,'warn');createNoStartLead();render();
}
function noStartOptions(n=ensureNoStartIssue()){
  if(!n)return [];
  if(n.group==='no_crank')return [
    {id:'battery_terminal_kit',label:'Clean / repair battery terminals',req:7,h:.8},
    {id:'battery_12v',label:'Replace the 12V battery',req:8,h:.8},
    {id:'starter',label:'Replace the starter motor',req:31,h:4}
  ];
  if(n.group==='crank_no_fire')return [
    {id:'spark_set',label:'Re-check / replace spark plugs',req:10,h:1.5},
    {id:'ignition_coil',label:'Replace a suspect ignition coil',req:16,h:1}
  ];
  return [
    {id:'spark_set',label:'Re-check ignition basics',req:10,h:1.5},
    {id:'timing_kit',label:'Re-open / verify timing service',req:44,h:6}
  ];
}
function scanProjectState(){
  const sc=bestScanner();if(!sc)return;
  if(S.activeCodes.length){scanProjectCodes();return}
  passTime(.2,true);const n=!S.startable?ensureNoStartIssue():null;
  let detail='No stored generic powertrain DTCs.';
  if(n&&n.group==='no_crank')detail='No stored generic DTCs. A no-crank can still be battery, cable, or starter related.';
  if(n&&n.group==='crank_no_fire')detail='No stored generic DTCs. The engine cranks, so spark / fuel / sensor diagnosis still matters.';
  if(n&&n.group==='mechanical')detail='No stored generic DTCs. Mechanical / timing faults may not give the scanner anything useful.';
  addLog(`Scan with ${sc.name}: ${detail}`,'day');
  showModal(`<h2>Scan results - ${sc.name}</h2><div class="card"><p><b>NO STORED GENERIC DTCs</b></p><p>${detail}</p><p class="small">No code does not mean no fault.</p></div><div class="modal-actions"><button onclick="openProjectState()">BACK</button></div>`);
}
function openProjectState(){
  const n=!S.startable?ensureNoStartIssue():null,sc=bestScanner(),hasJump=(S.inventory.jump_pack||0)>0,danger=n&&n.group==='mechanical'&&!n.fixed?'<p class="badtxt"><b>MECHANICAL NO-START:</b> repeated start attempts can turn diagnosis into permanent engine damage.</p>':'',endingCountNow=availableGoodEndings().length;
  showModal(`<h2>Project State - ${S.car.name}</h2><div class="card"><div class="market-meta"><div><span>STATE</span><b>${S.startable?(S.driveable?'STARTS / DRIVES':'STARTS / IMMOBILE'):'NO START'}</b></div><div><span>CEL</span><b>${S.activeCodes.length?'ON':'OFF'}</b></div><div><span>SCANNER</span><b>${sc?sc.name:'NONE'}</b></div><div><span>JUMP PACK</span><b>${hasJump?'OWNED':'NONE'}</b></div></div><p>${n?(n.fixed?'A repair may have fixed the cause. Try starting it.':n.diagnosed?`Observed: <b>${n.symptom}</b>`:'It will not start, but you have not characterized the symptom yet.'):'The engine is currently considered startable.'}</p>${danger}</div><div class="modal-actions four"><button class="primary" onclick="attemptProjectStart()">TRY TO START</button><button onclick="attemptJumpPack()" ${(!n||!hasJump)?'disabled':''}>TRY JUMP PACK</button><button onclick="diagnoseNoStart()" ${(!n||n.diagnosed)?'disabled':''}>DIAGNOSE NO-START</button><button onclick="scanProjectState()" ${sc?'':'disabled'}>SCAN CAR</button></div><div class="modal-actions three"><button onclick="createNoStartLead()" ${(!n||!n.diagnosed||n.researched)?'disabled':''}>RESEARCH NO-START</button><button onclick="openNoStartRepair()" ${(!n||!n.researched||n.fixed)?'disabled':''}>WORK ON NO-START</button><button class="good" onclick="openGoodEndingOptions()" ${endingCountNow?'':'disabled'}>GOOD ENDING${endingCountNow===1?'':'S'} (${endingCountNow})</button></div><div class="modal-actions"><button onclick="closeModal()">CLOSE</button></div>`);
}
function attemptJumpPack(){
  if(S.startable||!(S.inventory.jump_pack||0))return openProjectState();
  const n=ensureNoStartIssue();passTime(.2,true);n.jumpTested=true;
  if(n.cause==='battery'&&n.batteryState==='discharged'){
    S.startable=true;S.noStartIssue=null;gainExperience(S.car.make,'Electrical',1);gainConfidence(S.car.make,'Electrical',2);addLog('The jump pack wakes it right up. The battery was discharged, not necessarily dead. You let the car run long enough to recover some charge.','good');closeModal();render();return
  }
  if(n.cause==='battery'&&n.batteryState==='failed'){
    n.diagnosed=true;n.researched=true;n.item='battery_12v';addLog('The jump pack brings the electrical system alive, but the battery falls flat again immediately. That is strong evidence the battery itself is bad. Replacement battery is now the sensible repair.','warn');openProjectState();render();return
  }
  if(n.cause==='cables'){
    n.diagnosed=true;addLog('The jump pack has plenty of power, but the car still flickers / chatters. Battery charge is probably not the whole problem; the terminals and cables deserve attention.','warn');openProjectState();render();return
  }
  if(n.cause==='starter'){
    n.diagnosed=true;addLog('The jump pack changes basically nothing: bright dash, no normal crank. That points you away from a simple dead battery and toward the starting circuit.','warn');openProjectState();render();return
  }
  n.diagnosed=true;addLog('The jump pack makes it crank strongly, but it still does not fire. Battery power is probably not the reason for this no-start.','warn');openProjectState();render()
}
function attemptProjectStart(){
  passTime(.1,true);
  if(S.startable){addLog('You turn the key. It starts. That is a useful test result.','good');closeModal();render();return}
  const n=ensureNoStartIssue();n.tries++;
  if(n.fixed){S.startable=true;S.noStartIssue=null;gainConfidence(S.car.make,n.cat,2);gainRep('workmanship',1);addLog('You turn the key after the repair. It starts. No-start cleared.','good');closeModal();render();return}
  if(n.group==='mechanical'){
    const chance=Math.min(.30,.01+n.tries*.045+(S.awakeHours>=20?.08:0));
    if(Math.random()<chance){triggerBadEnding('engine_destroyed','You kept cranking a mechanically unhappy engine until it stopped being a diagnosis problem.');return}
  }
  addLog(`You try to start it: ${n.symptom}. Repeating the key turn is not a diagnosis.`,'bad');openProjectState();render();
}
function openNoStartRepair(){
  const n=ensureNoStartIssue();if(!n||!n.researched)return openProjectState();
  const cards=noStartOptions(n).map(o=>{const it=item(o.id),owned=S.inventory[o.id]||0,ch=Math.round(chanceFor(o.req,68,S.car.make,n.cat));return `<div class="storeitem"><b>${o.label}</b><span>$${it?.price||0}</span><div class="small">${it?.name||o.id}</div><div class="small">Owned: ${owned} - work success ~${ch}%</div><button onclick="attemptNoStartRepair('${o.id}')" ${owned?'':'disabled'}>${owned?'TRY THIS':'NEED PART'}</button></div>`}).join('');
  showModal(`<h2>No-start recovery</h2><div class="card"><p><b>Observed:</b> ${n.symptom}</p><p class="small">Research narrows the path. It does not reveal the hidden correct part.</p></div><div class="storegrid">${cards}</div><div class="modal-actions three"><button onclick="storeAisle='engine';storePage=0;openStore()">ENGINE SUPPLIES</button><button onclick="openProjectState()">PROJECT STATE</button><button onclick="showProjectWorkHub()">BACK</button></div>`);
}
function attemptNoStartRepair(id){
  const n=ensureNoStartIssue(),o=noStartOptions(n).find(x=>x.id===id);if(!n||!o||(S.inventory[id]||0)<1)return;
  S.inventory[id]--;passTime(o.h,true);garageNoiseCheck(o.h);
  if(Math.random()*100>=chanceFor(o.req,68,S.car.make,n.cat)){S.reliability-=rand(1,3);loseConfidence(S.car.make,n.cat,2);addLog(`The ${item(id)?.name||id} attempt goes badly. The no-start remains.`,'bad');closeModal();render();return}
  gainExperience(S.car.make,n.cat,id===n.item?2:1);gainConfidence(S.car.make,n.cat,1);
  if(id===n.item){n.fixed=true;addLog(`The ${item(id)?.name||id} repair matches your strongest theory. Try starting it from Project State.`,'good')}
  else addLog(`You install / service ${item(id)?.name||id} correctly, but the no-start symptom is unchanged.`,'warn');
  closeModal();render();
}

function markNoStartTaskRepair(taskId){
  if(S.startable)return false;
  const n=ensureNoStartIssue(),map={starter:'starter',plugs:'spark_set',timing:'timing_kit',head:'timing_kit'};
  if(!n)return false;
  if(map[taskId]&&map[taskId]===n.item){n.fixed=true;addLog('That successful repair matches the current no-start theory. Use Project State to actually try starting the car.','good')}
  else if(map[taskId])addLog('The repair succeeds, but it does not prove the no-start is fixed. Test it from Project State.','warn');
  return true;
}
