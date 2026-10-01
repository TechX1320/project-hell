function yardAvailabilityPct(days,rarity='COMMON'){
 let base=days<=3?98:days<=7?94:days<=14?86:days<=20?76:days<=27?58:35;
 const mod=rarity==='RARE'?-14:rarity==='UNCOMMON'?-6:0;
 return clamp(base+mod,12,98)
}
function yardFreshness(days){const p=yardAvailabilityPct(days,'COMMON');return p>=92?'VERY FRESH':p>=82?'FRESH':p>=68?'GOOD ODDS':p>=48?'PICKED OVER':p>=30?'LOW ODDS':'LONG SHOT'}
function yardAttritionChance(days,rarity='COMMON',delta=1){
 let base=days<8?.003:days<15?.008:days<21?.015:days<28?.04:.07;
 const mult=rarity==='RARE'?1.55:rarity==='UNCOMMON'?1.2:1;
 return clamp(base*mult*Math.max(1,delta),.002,.22)
}
function carGenerationKey(c){return c?.generation||c?.id||''}
function sameCarGeneration(a,b){return !!a&&!!b&&carGenerationKey(a)===carGenerationKey(b)}
function yardDonorName(d,c){const y=d?.displayYear||c?.year||Number(String(c?.name||'').slice(0,4))||1996;return `${y} ${String(c?.name||'Unknown car').replace(/^\d{4}\s+/,'')}`}
function yardDonorMatchesCar(d,target){const donor=cars.find(x=>x.id===d?.carId);return sameCarGeneration(donor,target)}
function yardStockTarget(y){return rand(y.stockMin||7,y.stockMax||10)}
function yardPartName(p,c){if(p.kind==='rare')return p.template.name;const k=p.data;if(k.type==='body_panel'){const d=bodyPanelDefs.find(x=>x.id===p.panelKey);return `${d?d.name:'Body panel'} - ${p.panelColor}`}return k.name}
function yardPartRarity(p){return p.kind==='rare'?(p.template.rarity||'UNCOMMON'):(p.data?.rarity||'COMMON')}
function yardPartKey(p){if(p.data?.type==='body_panel')return `panel:${p.panelKey}`;const name=p.kind==='rare'?p.template.name:p.data?.name;return `name:${String(name||'part').toLowerCase()}`}
function yardTemplateFits(t,c){return t.universal||(t.fitCarIds||[]).includes(c.id)||(t.fitCarIds||[]).some(id=>sameCarGeneration(cars.find(x=>x.id===id),c))||(t.fitGenerations||[]).includes(carGenerationKey(c))||(t.fitMakes||[]).includes(c.make)}
function weightedJunkRarity(gemBoost=false){const r=Math.random();if(gemBoost)return r<.22?'RARE':r<.62?'UNCOMMON':'COMMON';return r<.055?'RARE':r<.265?'UNCOMMON':'COMMON'}
function makeYardPart(c,color,days,slot,gemBoost=false,exclude=new Set()){
 const marketGemChance=gemBoost?.30:.055;
 const rareChoices=marketplacePartTemplates.filter(x=>x.rarity!=='COMMON'&&yardTemplateFits(x,c)&&!exclude.has(`name:${x.name.toLowerCase()}`));
 if(rareChoices.length&&Math.random()<marketGemChance){const rt=rareChoices[rand(0,rareChoices.length-1)];return {kind:'rare',template:rt,attempts:0,present:Math.random()*100<yardAvailabilityPct(days,rt.rarity||'UNCOMMON'),cost:Math.max(18,Math.round(rt.base*(gemBoost?.18:.24))),hours:Math.max(1,Math.min(3,rt.slots||1)),req:gemBoost?20:18,slots:rt.slots||1}}
 let rarity=weightedJunkRarity(gemBoost),pool=junkPullKinds.filter(x=>x.rarity===rarity&&(x.type==='body_panel'||!exclude.has(`name:${x.name.toLowerCase()}`)));
 if(!pool.length)pool=junkPullKinds.filter(x=>x.type==='body_panel'||!exclude.has(`name:${x.name.toLowerCase()}`));
 const k=pool[rand(0,pool.length-1)],panelKey=k.type==='body_panel'?bodyPanelDefs.filter(x=>!exclude.has(`panel:${x.id}`))[rand(0,Math.max(0,bodyPanelDefs.filter(x=>!exclude.has(`panel:${x.id}`)).length-1))]?.id:null,panelColor=panelKey?(Math.random()<.84?color:carColors.filter(x=>x!==color)[rand(0,carColors.length-2)]):null,slots=panelKey?bodyPanelTransportSlots(panelKey):k.slots;
 return {kind:'junk',data:k,attempts:0,present:Math.random()*100<yardAvailabilityPct(days,k.rarity||'COMMON'),cost:rand(k.cost[0],k.cost[1]),hours:k.hours,req:k.req,panelKey,panelColor,slots}
}
function makeYardDonor(yardId,age=rand(0,16),forcedCarId=null){
 const forced=cars.find(x=>x.id===forcedCarId),pool=forced?cars.filter(x=>sameCarGeneration(x,forced)):cars,c=pool[rand(0,pool.length-1)],displayYear=rand(c.genStart||c.year||1996,c.genEnd||c.year||1996),color=carColors[rand(0,carColors.length-1)],parts=[],hiddenParts=[],seen=new Set();
 const addUnique=(target,slot,gem)=>{let p=null;for(let tries=0;tries<30;tries++){p=makeYardPart(c,color,age,slot,gem,seen);const key=yardPartKey(p);if(!seen.has(key)){seen.add(key);target.push(p);return}}if(p)target.push(p)};
 for(let j=0;j<4;j++)addUnique(parts,j,false);
 for(let j=4;j<8;j++)addUnique(hiddenParts,j,true);
 return {id:`yd-${yardId}-${Date.now()}-${Math.random()}`,carId:c.id,displayYear,color,daysOnYard:age,studied:false,deepSearched:false,desc:['rear-end hit','rusted underneath','engine bay picked over','front-end wreck','looks weirdly complete','insurance total with surprisingly straight sides'][rand(0,5)],parts,hiddenParts}
}
