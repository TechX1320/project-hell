function ftueStepData(){
 const steps=[
  {label:'1 / 5 - DIAGNOSE THE CAR',detail:'Start by looking at the car. Diagnosis creates clues; it does not magically replace parts.',button:'diagnoseBtn',feature:'diagnose'},
  {label:'2 / 5 - LEARN SOMETHING',detail:'Follow the research lead created by your inspection. Useful information should come from something you actually observed.',button:'learnBtn',feature:'research'},
  {label:'3 / 5 - DO AN OIL CHANGE',detail:'Use what you learned. The guide keeps you on the oil service and walks you through any supplies you are missing.',button:'workBtn',feature:'work'},
  {label:'4 / 5 - EARN SOME MONEY',detail:'Take one job from the Part-Time Shift board. Project cars eat money, so wrenching cannot be your entire day.',button:'shiftBtn',feature:'shift'},
  {label:'5 / 5 - SLEEP',detail:'Your first day ends with sleep. During the tutorial, bedtime is locked until 10:00 PM so time and fatigue make sense.',button:'sleepBtn',feature:'sleep'},
 ];
 return steps[clamp(S.ftueStep||0,0,steps.length-1)];
}
function ftueActive(){return !!(S&&S.ftueEnabled&&dayNum()===1&&(S.ftueStep||0)<5)}
function ftueBedtimeReady(){return minuteOfDay()>=1320}
function ftueFeatureAllowed(key){if(!ftueActive())return true;const g=ftueStepData();return key===g.feature&&(!(S.ftueStep===4)||ftueBedtimeReady())}
function applyFtueGuards(){
 const actionIds=['workBtn','diagnoseBtn','jobsBtn','storeBtn','learnBtn','driveBtn','shiftBtn','homeBtn','worldBtn','sleepBtn'];
 const alwaysOn=['workBtn','jobsBtn','storeBtn','driveBtn','shiftBtn','homeBtn','worldBtn','sleepBtn'];
 const statIds=['inventoryStat','toolsStat','knowledgeStat','confidenceStat','repStat'];
 if(!ftueActive()){
  alwaysOn.forEach(id=>{const el=$(id);if(el)el.disabled=false});
  statIds.forEach(id=>{const el=$(id);if(el)el.classList.remove('ftue-stat-locked')});
  return;
 }
 actionIds.forEach(id=>{const el=$(id);if(el)el.disabled=true});
 statIds.forEach(id=>{const el=$(id);if(el)el.classList.add('ftue-stat-locked')});
 const g=ftueStepData(),el=$(g.button);if(el&&(!(S.ftueStep===4)||ftueBedtimeReady()))el.disabled=false;
}
function updateFtueTarget(){
 ['diagnoseBtn','learnBtn','workBtn','shiftBtn','sleepBtn','ftueWindBtn'].forEach(id=>{const el=$(id);if(el)el.classList.remove('ftue-target')});
 if(!ftueActive())return;
 const d=ftueStepData();
 if(S.ftueStep===4&&!ftueBedtimeReady()){const w=$('ftueWindBtn');if(w)w.classList.add('ftue-target');return}
 const el=$(d.button);if(el)el.classList.add('ftue-target');
}
function renderGuidePanel(){
 const p=$('guidePanel');if(!p)return;
 if(ftueActive()){
  const g=ftueStepData();
  if(S.ftueStep===4&&!ftueBedtimeReady()){
   p.innerHTML=`<b>FIRST DAY // BEDTIME IS 10:00 PM</b><div class="small" style="margin-top:5px">You finished the required work, but it is only <b>${clockStr()}</b>. Use the rest of the evening for dinner, a shower, TV, texting friends, or staring at the car. Sleep unlocks at 10:00 PM.</div><button class="ftue-wind" id="ftueWindBtn" onclick="ftueWindDown()">WIND DOWN UNTIL 10:00 PM</button><div id="fatigueNote" class="small warning" style="margin-top:5px"></div>`;
  }else p.innerHTML=`<b>FIRST DAY // ${g.label}</b><div class="small" style="margin-top:5px">${g.detail}</div><div class="small" style="margin-top:5px">Everything else is temporarily locked. You can skip the Day 1 guide from the tutorial screens.</div><div id="fatigueNote" class="small warning" style="margin-top:5px"></div>`;
  return;
 }
 p.innerHTML=`<b>Everything has a downside now.</b> <span class="small">Diagnosis creates clues. Research can help or mislead you. Repairs cost time and supplies. Driving creates mileage and risk. Reputation, confidence, storage, money and sleep all matter.</span><div id="fatigueNote" class="small warning" style="margin-top:5px"></div>`;
}
function ftueWindDown(){
 if(!ftueActive()||S.ftueStep!==4||ftueBedtimeReady())return;
 const mins=1320-minuteOfDay(),hours=mins/60;S.totalMin+=mins;S.awakeHours+=hours;S.energy=clamp(S.energy-hours*1.5,0,100);
 addLog('You kill the rest of the evening at home. Dinner, shower, a little TV, and several unnecessary looks at the project later, it is 10:00 PM.','day');render();
}
function ftueAdvance(completedStep,msg){
 if(!S.ftueEnabled||(S.ftueStep||0)!==completedStep)return;
 S.ftueStep=completedStep+1;S.ftueNudge=msg||'';
}
function showFtueNudge(){
 if(!S.ftueNudge)return;const msg=S.ftueNudge;S.ftueNudge=null;
 const done=(S.ftueStep||0)>=5,g=done?null:ftueStepData();
 showModal(`<h2>${done?'Day 1 complete':'Good. Next step.'}</h2><div class="card"><p>${msg}</p>${done?`<p><b>You now know the basic loop:</b> diagnose -> learn -> wrench -> earn -> sleep.</p><p class="small">The guard rails are gone. First-use explanations still appear when you open unfamiliar systems, but Day 2 onward is yours.</p>`:`<p><b>${g.label}</b></p><p class="small">${g.detail}</p>`}</div><div class="modal-actions"><button class="primary" onclick="closeFtueNudge()">${done?'START DAY 2':'GOT IT'}</button>${done?'':`<button onclick="disableFtue()">SKIP DAY 1 GUIDE</button>`}</div>`)
}
function closeFtueNudge(){closeModal();render()}
function showFtueDay(){
 const d=dayNum();if(!S.ftueEnabled||d!==1||S.ftueShownDay===1)return;S.ftueShownDay=1;
 showModal(`<h2>Day 1 - learn the basic loop</h2><div class="card"><p>You are 18, you just bought an old car, and the game is going to keep your first day intentionally simple.</p><p><b>Today only:</b> Diagnose -> Research -> Oil Change -> Part-Time Job -> Sleep.</p><p>Buttons you do not need are disabled. Each step explains what the system is teaching you. After you sleep, the guard rails disappear completely.</p><p class="small">This is not the correct routine forever. It is just enough structure to stop a first-time player from drowning in menus.</p></div><div class="modal-actions"><button class="primary" onclick="closeModal();render()">START DAY 1</button><button onclick="disableFtue()">SKIP DAY 1 GUIDE</button></div>`);
}
function disableFtue(){S.ftueEnabled=false;S.ftueNudge=null;closeModal();render()}
const featureTips={
 diagnose:{title:'Diagnosis is information, not a repair',body:'Inspections and symptom checks cost time. They can expose clues and create focused research leads, but they do not magically tell you which part to replace.'},
 research:{title:'Research can be useful. It can also be garbage.',body:'Focused leads come from things you actually observed and are much more useful. Random rabbit holes can teach you something unrelated, waste time, or confidently teach you the wrong thing.'},
 work:{title:'This is where parts actually become a car',body:'Mechanical service, body work, interior parts and upgrades all happen here. Jobs consume time and supplies. Routine service only appears when it is actually due, and harder jobs will ask whether you want the safer route or to risk it.'},
 jobs:{title:'Friends and family remember what you do to their cars',body:'Side jobs are extra money and experience, but the car belongs to somebody you know. A bad failure can hurt trust, reputation, or leave you paying a real shop to fix your mistake.'},
 store:{title:'Parts stores sell possibilities, not answers',body:'Supplies, tools, tires and upgrades live in aisles. Your garage has limited storage. Supplies bought specifically for a side job are used for that job instead of becoming permanent inventory.'},
 drive:{title:'Driving is part of owning the project',body:'Trips add real mileage, advance service intervals, consume time, get the car dirty and can expose new problems. Longer drives carry more risk.'},
 shift:{title:'The work board changes every day',body:'Only six part-time jobs appear at once. Early jobs are normal teenager work; automotive and higher-paying work enters the pool as your real knowledge and reputation improve.'},
 home:{title:'Your parents do not own a warehouse',body:'Housing controls project-car space and inventory capacity. Hoard too much stuff or fill the driveway and your parents can start pushing you toward a more expensive place of your own.'},
 world:{title:'Old-car ownership happens outside the parts store',body:'Marketplace, Pull-A-Part yards and swap meets are how you find projects and weird used parts. Availability, distance, transport space, condition and seller honesty all matter.'},
 sleep:{title:'Sleep is a resource too',body:'You can sleep up to eight hours. Too little sleep, terrible bedtimes and random bad nights reduce recovery. Staying awake too long makes mechanical work substantially riskier.'},
 inventory:{title:'Inventory means physical garage space',body:'Oil, filters, parts and used junk take actual slots. Stored used parts are not installed from here; put them on the car through Work on Project.'},
 tools:{title:'Tools are individual equipment now',body:'Open this whenever you want to see what you actually own. Better hand tools, specialty tools and scanners improve what you can safely attempt; owning one generic "tool level" does not.'},
 knowledge:{title:'Overall Knowledge is only the headline number',body:'Your real ability is split across makes and systems such as Maintenance, Engine, Brakes and Electrical. Experience also slows down as you become more knowledgeable.'},
 confidence:{title:'Confidence is not the same as competence',body:'Confidence is also split by make and type of work. Too little can make you hesitant; too much confidence compared with your actual knowledge can push you into bad decisions.'},
 reputation:{title:'Different people know you for different things',body:'Friends/family trust, workmanship and the local car scene are separate. A clean show car, a successful brake job and admitting a mistake can affect different kinds of reputation.'}
};
