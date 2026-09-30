function projectCargoCapacity(){return cargoByCar[S.car.id]||6}
function bodyPanelTransportSlots(k){return ['hood','trunk'].includes(k)?4:['front_bumper','rear_bumper','left_door','right_door'].includes(k)?3:2}

let S=null,projectIndex=0,projectPartIndex=0,jobIndex=0,eventIndex=0,logPageFromEnd=0,storePage=0,storeAisle='oil',storeView='aisles',modalContext='',pendingFailure=null,pendingSideFailure=null,pendingProjectApproach=null,marketIndex=0,partsMarketIndex=0,yardIndex=0,swapIndex=0,sellIndex=0,usedInvIndex=0,installedIndex=0;
const $=id=>document.getElementById(id),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
function item(id){return storeItems.find(x=>x.id===id)}
function ownedToolItems(){return storeItems.filter(i=>i.kind==='tool'&&(S.inventory[i.id]||0)>0)}
function bestScanner(){return ownedToolItems().filter(i=>i.obdTier).sort((a,b)=>(b.obdTier||0)-(a.obdTier||0))[0]||null}
function bestScannerTier(){const x=bestScanner();return x?x.obdTier:0}function sideJobScanner(){const x=bestScanner();return x&&x.id!=='obd_bt'?x:null}
function codeSignature(){return (S.activeCodes||[]).map(c=>c.code).sort().join('|')}
function dtcCandidates(code){return dtcRepairOptions[code]||[]}function ensureCelCause(c){if(!c)return null;if(!c.cause){const opts=dtcCandidates(c.code);c.cause=opts.length?opts[rand(0,opts.length-1)].itemId:null}return c.cause}function newCelInstance(base){const c={...base};ensureCelCause(c);return c}function randomCelCode(){return newCelInstance(celCodes[rand(0,celCodes.length-1)])}
function toolBonus(){return ownedToolItems().filter(i=>!i.obdTier).reduce((a,i)=>a+(i.toolBonus||0),0)}
function bodyToolBonus(){return ownedToolItems().reduce((a,i)=>a+(i.bodyBonus||0),0)}
function toolSummary(){const n=ownedToolItems().length;return n?`Starter kit + ${n}`:'Starter kit'}
