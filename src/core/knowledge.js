function diminishingScale(v){if(v<25)return 1;if(v<40)return .65;if(v<60)return .40;if(v<78)return .22;return .10}
function addDiminishing(current,raw){return clamp(current+raw*diminishingScale(current),0,100)}
function learningRetention(raw=1){if(!S)return 1;const load=S.learningLoad||0;let r=load<6?1:load<12?.62:load<18?.32:.14;if(S.awakeHours>16)r*=.72;if(S.energy<35)r*=.82;S.learningLoad=load+Math.max(.25,raw);return clamp(r,.08,1)}
function calculateOverallKnowledge(){if(!S)return 0;const core=S.knowledgeCore??S.knowledge??0,skills=categories.map(c=>S.skillKnowledge[c]||0).sort((a,b)=>b-a).slice(0,4),skillAvg=skills.length?skills.reduce((a,b)=>a+b,0)/skills.length:0,vals=makes.map(m=>S.makeKnowledge[m]||0).sort((a,b)=>b-a).slice(0,3);while(vals.length<3)vals.push(0);const makeAvg=vals.reduce((a,b)=>a+b,0)/3;return clamp(Math.round(core*.60+skillAvg*.30+makeAvg*.10),0,100)}
function recalcOverallKnowledge(){if(S)S.knowledge=calculateOverallKnowledge()}
function gainGeneralKnowledge(raw){const kept=Math.max(.05,raw*learningRetention(raw*.7));S.knowledgeCore=addDiminishing(S.knowledgeCore??S.knowledge??0,kept);recalcOverallKnowledge()}
