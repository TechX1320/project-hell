const careerStageDefs=[
 {id:1,name:'BROKE KID',days:'Days 1-7',sidePay:1,shiftPay:1,targetReq:10},
 {id:2,name:'PEOPLE KNOW YOU WRENCH',days:'Days 8-16',sidePay:1.16,shiftPay:1.08,targetReq:26},
 {id:3,name:'BACKYARD MECHANIC',days:'Days 17-27',sidePay:1.32,shiftPay:1.16,targetReq:42},
 {id:4,name:'ESTABLISHED WRENCH',days:'Day 28+',sidePay:1.46,shiftPay:1.23,targetReq:52}
];
function careerStageIndex(){const d=dayNum();return d<=7?1:d<=16?2:d<=27?3:4}
function careerStage(){return careerStageDefs[careerStageIndex()-1]}
function trustedWorkRep(){const r=S&&S.reputationChannels?S.reputationChannels:{friends:0,workmanship:0,scene:0};return clamp(Math.round(r.workmanship*.58+r.friends*.32+r.scene*.10),0,100)}
function ownsCareerTool(id){if(id==='scanner')return !!sideJobScanner();if(id==='scanner2')return bestScannerTier()>=2;return !!(S&&S.inventory&&S.inventory[id])}
function careerToolName(id){if(id==='scanner')return 'Basic LCD OBD-II Scanner or better';if(id==='scanner2')return 'Enhanced Scan Tool or better';const x=item(id);return x?x.name:id}
function missingCareerTools(req){return (req||[]).filter(id=>!ownsCareerTool(id))}
function careerToolList(req){return (req||[]).map(careerToolName).join(', ')}
function sideJobEligible(j){
 if((S.contacts[j.owner]||50)<=15)return false;
 if((j.minDay||1)>dayNum())return false;
 if((j.minKnowledge||0)>S.knowledge)return false;
 if(j.minSkill&&((S.skillKnowledge[j.minSkill[0]]||0)<j.minSkill[1]))return false;
 if((j.minWorkmanship||0)>(S.reputationChannels.workmanship||0))return false;
 if(missingCareerTools(j.requiredTools).length)return false;
 return true
}
function careerSideJobWeight(j){
 const target=careerStage().targetReq,delta=Math.abs((j.req||0)-target);
 let w=1+Math.max(0,8-delta/4);
 if((j.minDay||1)>=8&&careerStageIndex()>=2)w+=2;
 if((j.minDay||1)>=17&&careerStageIndex()>=3)w+=3;
 return Math.max(1,w)
}
function rollCareerWeighted(pool,weightFn){
 const total=pool.reduce((a,x)=>a+weightFn(x),0);let r=Math.random()*total;
 for(let i=0;i<pool.length;i++){r-=weightFn(pool[i]);if(r<=0)return i}
 return pool.length-1
}
function sideJobPayMultiplier(j){
 const stage=careerStage();
 const rep=1+Math.min(.34,trustedWorkRep()*.0055);
 const floor=j.minKnowledge||Math.floor((j.req||0)*.55);
 const knowledge=1+Math.min(.16,Math.max(0,S.knowledge-floor)*.005);
 return stage.sidePay*rep*knowledge
}
function rollSideJobPay(j){const raw=rand(j.pay[0],j.pay[1])*sideJobPayMultiplier(j);return Math.max(5,Math.round(raw/5)*5)}
function sideJobRepReward(j){const req=j.req||0;return {work:req>=50?5:req>=38?4:req>=26?3:req>=16?2:1,friends:req>=35?2:1}}
function scanTipPay(){return Math.max(10,Math.round((8+careerStageIndex()*6+trustedWorkRep()*.35)/5)*5)}
function partTimeEligibleCareer(j){
 if((j.minDay||1)>dayNum())return false;
 if((j.minKnowledge||0)>S.knowledge)return false;
 if((j.minRep||0)>S.reputationChannels.scene)return false;
 if(j.minSkill&&((S.skillKnowledge[j.minSkill[0]]||0)<j.minSkill[1]))return false;
 if(missingCareerTools(j.requiredTools).length)return false;
 return true
}
function partTimeJobWeight(j){
 const k=j.minKnowledge||0,stage=careerStageIndex();
 let w=1+Math.max(0,k/8);
 if(stage>=2&&k>=18)w+=3;
 if(stage>=3&&k>=30)w+=4;
 if(stage===1&&k===0)w+=4;
 return w
}
function partTimePayMultiplier(j){
 const automotive=!!j.category||['CAR-ADJACENT','ENTRY SHOP','SHOP','SIDE HUSTLE','MECHANIC','PERFORMANCE','MOTORSPORT','TUNING'].includes(j.tier);
 const rep=automotive?1+Math.min(.14,trustedWorkRep()*.002):1;
 return careerStage().shiftPay*rep
}
function adjustedShiftPayRange(j){const m=partTimePayMultiplier(j);return [Math.round(j.pay[0]*m/5)*5,Math.round(j.pay[1]*m/5)*5]}
function toolBlockedSideJobs(){return sideJobTemplates.filter(j=>(j.minDay||1)<=dayNum()&&(j.minKnowledge||0)<=S.knowledge&&(!j.minSkill||(S.skillKnowledge[j.minSkill[0]]||0)>=j.minSkill[1])&&(S.contacts[j.owner]||50)>15&&missingCareerTools(j.requiredTools).length)}
