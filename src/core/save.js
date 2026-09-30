const WL_SAVE_VERSION=1;
const WL_SAVE_PREFIX='wrenchlife.save.';
const WL_SETTINGS_KEY='wrenchlife.settings';
let activeSaveSlot=null,lastSaveError='';

function saveKey(slot){return WL_SAVE_PREFIX+slot}
function getSettings(){
  try{return {...{ftueDefault:true},...JSON.parse(localStorage.getItem(WL_SETTINGS_KEY)||'{}')}}catch{return {ftueDefault:true}}
}
function updateSettings(patch){
  const next={...getSettings(),...patch};
  localStorage.setItem(WL_SETTINGS_KEY,JSON.stringify(next));
  return next;
}
function saveSummary(slot){
  try{
    const raw=localStorage.getItem(saveKey(slot));if(!raw)return null;
    const p=JSON.parse(raw),st=p.state||{},car=cars.find(c=>c.id===st.carId);
    return {slot,seed:p.seed||st.runSeed||'UNKNOWN',savedAt:p.savedAt||0,day:Math.floor((st.totalMin||0)/1440)+1,car:car?.name||st.carId||'Unknown car',cash:st.cash??0,knowledge:st.knowledge??0,gameOver:!!st.gameOver};
  }catch{return null}
}
function allSaveSummaries(){return [1,2,3].map(saveSummary)}
function newestSaveSlot(){return allSaveSummaries().filter(Boolean).sort((a,b)=>b.savedAt-a.savedAt)[0]?.slot||null}
function saveGame(){
  if(!S||!activeSaveSlot)return false;
  try{
    syncActiveProject();
    const state=JSON.parse(JSON.stringify(S));
    state.carId=S.car?.id||state.carId;
    delete state.car;
    state.runSeed=S.runSeed||currentRunSeed();
    state.saveSlot=activeSaveSlot;
    const payload={version:WL_SAVE_VERSION,savedAt:Date.now(),seed:state.runSeed,rng:rngSnapshot(),state};
    localStorage.setItem(saveKey(activeSaveSlot),JSON.stringify(payload));
    lastSaveError='';
    return true;
  }catch(err){lastSaveError=String(err);console.warn('Wrench Life save failed',err);return false}
}
function resetRuntimeIndexes(){
  projectIndex=projectPartIndex=jobIndex=eventIndex=logPageFromEnd=storePage=marketIndex=partsMarketIndex=yardIndex=swapIndex=sellIndex=usedInvIndex=installedIndex=0;
  storeAisle='oil';storeView='aisles';modalContext='';pendingFailure=null;pendingSideFailure=null;pendingProjectApproach=null;
}
function hydrateLoadedState(state,slot,seed){
  const carId=state.carId||state.car?.id,car=cars.find(c=>c.id===carId);
  if(!car)throw new Error('Saved project car no longer exists.');
  S=state;S.car=car;S.runSeed=seed;S.saveSlot=slot;
  S.logs=S.logs||[];S.projects=S.projects||[];S.usedParts=S.usedParts||[];S.installedUpgrades=S.installedUpgrades||[];
  S.seenTips=S.seenTips||{};S.activeCodes=S.activeCodes||[];S.reputationChannels=S.reputationChannels||{friends:0,workmanship:0,scene:0};
  normalizeInstalledStorage();resetRuntimeIndexes();
}
function loadGame(slot){
  try{
    const raw=localStorage.getItem(saveKey(slot));if(!raw)return false;
    const payload=JSON.parse(raw);if(payload.version!==WL_SAVE_VERSION)throw new Error('Unsupported save version.');
    const seed=activateRunSeed(payload.seed||payload.state?.runSeed,payload.rng);
    activeSaveSlot=slot;hydrateLoadedState(payload.state,slot,seed);
    $('menu').classList.add('hidden');$('start').classList.add('hidden');$('game').classList.remove('hidden');$('menuBtn').classList.remove('hidden');
    closeModal();render();return true;
  }catch(err){console.warn('Wrench Life load failed',err);showModal('<h2>Could not load save</h2><div class="card"><p>'+String(err)+'</p></div><div class="modal-actions"><button onclick="closeModal()">CLOSE</button></div>');return false}
}
function deleteSaveSlot(slot){localStorage.removeItem(saveKey(slot));if(activeSaveSlot===slot)activeSaveSlot=null}
