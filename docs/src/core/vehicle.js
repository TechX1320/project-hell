function starterCarsForSeed(seed=currentRunSeed()){
 const roles=['easy','fun','wild'];
 return roles.map(role=>{const pool=cars.filter(c=>c.starterRole===role),h=hashSeed(`${seed}|starter|${role}`);return pool[h%pool.length]})
}
function makeCars(){const starters=starterCarsForSeed();$('carChoices').innerHTML=starters.map(c=>`<div class="car"><h3>${c.name}</h3><span class="tag">${c.trait}</span><p>${c.desc}</p><div class="price">${c.price.toLocaleString()}</div><button onclick="startGame('${c.id}')">BUY THIS PROBLEM</button></div>`).join('')}

const interiorSlotDefs=[
 {id:'front_seats',name:'Front Seats',req:12,cat:'Bodywork',soft:true},
 {id:'rear_seat',name:'Rear Seats',req:11,cat:'Bodywork',soft:true,rear:true},
 {id:'dash',name:'Dashboard',req:18,cat:'Bodywork'},
 {id:'trim',name:'Interior Trim / Door Cards',req:14,cat:'Bodywork'},
 {id:'radio',name:'Radio / Head Unit',req:17,cat:'Electrical',electrical:true},
 {id:'speakers',name:'Speakers',req:18,cat:'Electrical',electrical:true},
 {id:'floor_mats',name:'Floor Mats',req:6,cat:'Bodywork',soft:true},
 {id:'floor_carpet',name:'Floor / Carpet / Boards',req:17,cat:'Bodywork',soft:true},
 {id:'pedals',name:'Pedals',req:11,cat:'Maintenance'},
 {id:'controls',name:'Steering / Shifter Trim',req:14,cat:'Maintenance'},
 {id:'subwoofer',name:'Subwoofer System',req:22,cat:'Electrical',electrical:true,aftermarket:true}
];
const twoSeatGenerations=new Set(['miata_na','miata_nb','mr2_aw11','mr2_sw20','z33','crx_2g']);
function interiorSlotsForCar(car=S?.car){return interiorSlotDefs.filter(d=>!d.rear||!twoSeatGenerations.has(carGenerationKey(car)))}
function buildInteriorComponents(base,car){const out={};for(const d of interiorSlotsForCar(car)){if(d.aftermarket)continue;out[d.id]=clamp(base+rand(-18,18),18,94)}return out}
function interiorAverage(parts=S?.interiorComponents,car=S?.car){const vals=interiorSlotsForCar(car).filter(d=>!d.aftermarket).map(d=>parts?.[d.id]).filter(Number.isFinite);return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):50}
function interiorIssue(v){if(v>=88)return 'very clean';if(v>=74)return 'normal wear';if(v>=58)return 'worn / faded';if(v>=40)return 'rough / damaged';return 'trashed'}
function interiorSlotForPart(p){if(p?.interiorSlot)return p.interiorSlot;const n=String(p?.name||'').toLowerCase();if(/subwoofer|sub box|powered sub|sub system/.test(n))return 'subwoofer';if(/speaker/.test(n))return 'speakers';if(/radio|head unit|headunit|stereo|cassette|minidisc|cd player/.test(n))return 'radio';if(/rear seat/.test(n))return 'rear_seat';if(/front seat|sport seat|seat pair|leather front/.test(n))return 'front_seats';if(/floor mat/.test(n))return 'floor_mats';if(/carpet|floor board|floorboard|cargo-area trim|cargo area trim/.test(n))return 'floor_carpet';if(/pedal/.test(n))return 'pedals';if(/steering wheel|shift knob|shift trim|boot set/.test(n))return 'controls';if(/dash|gauge cluster|glovebox|clock|switch panel|map-light|map light/.test(n))return 'dash';if(/door-card|door card|console|armrest|cupholder|sun visor|interior trim|conversion pieces|interior set/.test(n))return 'trim';return 'trim'}
function interiorSlotDef(id){return interiorSlotDefs.find(d=>d.id===id)}
function installedInteriorPart(slot){return (S?.installedUpgrades||[]).find(p=>p.type==='interior'&&(p.interiorSlot||interiorSlotForPart(p))===slot)}
function interiorReplacementParts(slot){return (S?.usedParts||[]).filter(p=>p.type==='interior'&&usedPartFits(p)&&interiorSlotForPart(p)===slot)}
function recalcInterior(){if(S)S.interiorCondition=interiorAverage(S.interiorComponents,S.car)}

const bodyPanelDefs=[
 {id:'hood',name:'Hood'},{id:'front_bumper',name:'Front bumper'},{id:'lf_fender',name:'Left front fender'},{id:'rf_fender',name:'Right front fender'},
 {id:'left_door',name:'Left door'},{id:'right_door',name:'Right door'},{id:'trunk',name:'Trunk / hatch'},{id:'rear_bumper',name:'Rear bumper'}
];
function buildBodyPanels(base){const out={};for(const p of bodyPanelDefs)out[p.id]=clamp(base+rand(-14,14),18,92);return out}
function bodyAverage(panels=S.bodyPanels){const vals=Object.values(panels||{});return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):50}
function buildBodyPanelColors(base){const out={};for(const p of bodyPanelDefs)out[p.id]=base;return out}
function mismatchedPanelCount(){return Object.values(S.bodyPanelColors||{}).filter(c=>c&&c!==S.paintColor).length}
function panelIssue(v){if(v>=88)return 'very clean';if(v>=75)return 'minor scratches / fade';if(v>=60)return 'visible dents / paint damage';if(v>=42)return 'rough paint / rust starting';return 'heavy rust / damage'}
function appearanceScore(){return clamp(Math.round((S.bodyCondition||50)*.60+(S.interiorCondition||50)*.20+(S.cleanliness||50)*.08+(S.styleScore||0)*1.6-mismatchedPanelCount()*4),0,100)}
function bodyChance(req){return clamp(58+(effectiveKnowledge(S.car.make,'Bodywork')+bodyToolBonus()-req)*1.65-fatiguePenalty(),5,96)}
function bodyRisk(req){const c=bodyChance(req);return c>=85?'VERY SAFE':c>=70?'PROBABLY FINE':c>=50?'SKETCHY':c>=30?'BAD IDEA':'ABSOLUTELY NOT'}
function recalcBody(){S.bodyCondition=bodyAverage();}
