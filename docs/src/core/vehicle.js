function starterCarsForSeed(seed=currentRunSeed()){
 const roles=['easy','fun','wild'];
 return roles.map(role=>{const pool=cars.filter(c=>c.starterRole===role),h=hashSeed(`${seed}|starter|${role}`);return pool[h%pool.length]})
}
function makeCars(){const starters=starterCarsForSeed();$('carChoices').innerHTML=starters.map(c=>`<div class="car"><h3>${c.name}</h3><span class="tag">${c.trait}</span><p>${c.desc}</p><div class="price">${c.price.toLocaleString()}</div><button onclick="startGame('${c.id}')">BUY THIS PROBLEM</button></div>`).join('')}

const bodyPanelDefs=[
 {id:'hood',name:'Hood'},{id:'front_bumper',name:'Front bumper'},{id:'lf_fender',name:'Left front fender'},{id:'rf_fender',name:'Right front fender'},
 {id:'left_door',name:'Left door'},{id:'right_door',name:'Right door'},{id:'trunk',name:'Trunk / hatch'},{id:'rear_bumper',name:'Rear bumper'}
];
function buildBodyPanels(base){const out={};for(const p of bodyPanelDefs)out[p.id]=clamp(base+rand(-14,14),18,92);return out}
function bodyAverage(panels=S.bodyPanels){const vals=Object.values(panels||{});return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):50}
function buildBodyPanelColors(base){const out={};for(const p of bodyPanelDefs)out[p.id]=base;return out}
function mismatchedPanelCount(){return Object.values(S.bodyPanelColors||{}).filter(c=>c&&c!==S.paintColor).length}
function panelIssue(v){if(v>=88)return 'very clean';if(v>=75)return 'minor scratches / fade';if(v>=60)return 'visible dents / paint damage';if(v>=42)return 'rough paint / rust starting';return 'heavy rust / damage'}
function appearanceScore(){return clamp(Math.round((S.bodyCondition||50)*.78+(S.cleanliness||50)*.12+(S.styleScore||0)*1.9-mismatchedPanelCount()*4),0,100)}
function bodyChance(req){return clamp(58+(effectiveKnowledge(S.car.make,'Bodywork')+bodyToolBonus()-req)*1.65-fatiguePenalty(),5,96)}
function bodyRisk(req){const c=bodyChance(req);return c>=85?'VERY SAFE':c>=70?'PROBABLY FINE':c>=50?'SKETCHY':c>=30?'BAD IDEA':'ABSOLUTELY NOT'}
function recalcBody(){S.bodyCondition=bodyAverage();}
