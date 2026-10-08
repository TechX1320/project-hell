const WL_WEEKLY_RUN_PREFIX='wrenchlife.weekly.run.';
const WL_WEEKLY_BEST_PREFIX='wrenchlife.weekly.best.';
const WL_WEEKLY_START_SCORE=1000;
const WL_WEEKLY_DAYS=7;
const WL_WEEKLY_CASH=3000;

const WL_WEEKLY_ROTATION=[
 {carId:'cavalier',title:'CHEAP BEATER WEEK',blurb:'Seven days. One cheap Z24. Make the most of what you have without turning it into scrap.'},
 {carId:'rx8',title:'ROTARY HELL',blurb:'Compression anxiety is part of the experience. Keep the RX-8 alive and make real progress.'},
 {carId:'gti04',title:'GERMAN MISTAKE',blurb:'A cheap 1.8T, old hoses, questionable decisions. Earn points faster than it drains your wallet.'},
 {carId:'crx88',title:'NO OBD-II',blurb:'Old-school diagnosis only. Knowledge and careful work matter more than a scan tool this week.'},
 {carId:'impreza',title:'AWD WEIRDNESS',blurb:'Useful, weird, and probably making a bearing noise. Seven days to make it better.'},
 {carId:'srt4',title:'BOOSTED BAD DECISION',blurb:'Cheap boost and limited time. Improve it without becoming the reason another SRT-4 disappears.'},
 {carId:'eclipsegst',title:'DSM WEEK',blurb:'Factory turbo temptation. Progress scores; broken parts absolutely do not.'},
 {carId:'miata',title:'SMALL CAR, BIG PLANS',blurb:'The simple stuff still punishes sloppy work. Build the cleanest seven-day run you can.'},
 {carId:'bmw328',title:'CHEAP GERMAN LUXURY',blurb:'The purchase price was the easy part. Survive seven days and improve the E36.'},
 {carId:'focus13',title:'HOT HATCH WEEK',blurb:'Fast enough to encourage bad choices, practical enough to keep making them.'},
 {carId:'rx7fc',title:'ROTARY HOMEWORK',blurb:'No OBD-II and no excuses. Keep the FC healthy while learning as much as possible.'},
 {carId:'mustang94',title:'CHEAP V8 WEEK',blurb:'Torque is easy. Keeping an old SN95 sorted on a tiny budget is the challenge.'}
];

function isoWeekInfo(date=new Date()){
 const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
 const day=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-day);
 const year=d.getUTCFullYear(),yearStart=new Date(Date.UTC(year,0,1));
 const week=Math.ceil((((d-yearStart)/86400000)+1)/7);
 const monday=new Date(d);monday.setUTCDate(d.getUTCDate()-3);
 const sunday=new Date(monday);sunday.setUTCDate(monday.getUTCDate()+6);
 return {year,week,monday,sunday};
}
function weeklyDateText(d){return d.toLocaleDateString(undefined,{month:'short',day:'numeric',timeZone:'UTC'})}
function weeklyChallengeConfig(date=new Date()){
 const w=isoWeekInfo(date),index=((w.year*53+w.week)%WL_WEEKLY_ROTATION.length+WL_WEEKLY_ROTATION.length)%WL_WEEKLY_ROTATION.length,rot=WL_WEEKLY_ROTATION[index];
 const car=cars.find(c=>c.id===rot.carId)||cars[0],id=`${w.year}-W${String(w.week).padStart(2,'0')}`;
 return {id,year:w.year,week:w.week,title:rot.title,blurb:rot.blurb,carId:car.id,carName:car.name,seed:`WL-${w.year}-W${String(w.week).padStart(2,'0')}`,durationDays:WL_WEEKLY_DAYS,startScore:WL_WEEKLY_START_SCORE,startCash:WL_WEEKLY_CASH,dateText:`${weeklyDateText(w.monday)} - ${weeklyDateText(w.sunday)}`};
}
function weeklyRunKey(id){return WL_WEEKLY_RUN_PREFIX+id}
function weeklyBestKey(id){return WL_WEEKLY_BEST_PREFIX+id}
function weeklyChallengeMode(){return !!S?.weeklyChallenge}
function weeklyChallengeActive(){return !!S?.weeklyChallenge&&!S.weeklyChallenge.finished}
function weeklyProjectState(){
 const c=S?.weeklyChallenge;if(!S||!c)return null;
 if(S.activeProjectUid===c.projectUid)return S;
 return (S.projects||[]).find(p=>p.uid===c.projectUid)||S;
}
function weeklyMetricSnapshot(){return {...(S?.weekMetrics||{})}}
function weeklyChallengeSnapshot(){
 const p=weeklyProjectState()||S;
 return {progress:p.progress||0,reliability:p.reliability||0,knowledge:S.knowledge||0,reputation:S.reputation||0,confidence:S.confidence||0,parentPatience:S.parentPatience??100,bodyCondition:p.bodyCondition||0,interiorCondition:p.interiorCondition||0,styleScore:p.styleScore||0,performanceScore:p.performanceScore||0,startable:p.startable!==false,driveable:p.driveable!==false,completed:!!p.completed,gameOver:!!S.gameOver,metrics:weeklyMetricSnapshot()};
}
function freshWeeklyLedger(){return {restoration:0,reliability:0,knowledge:0,reputation:0,confidence:0,appearance:0,performance:0,projectWins:0,projectFails:0,sideJobs:0,sideJobFails:0,research:0,scans:0,work:0,recovery:0,penalties:0,finish:0}}
function weeklyChallengeAdjust(key,amount,label){
 const c=S?.weeklyChallenge;if(!c||c.finished||!amount)return 0;
 const before=c.score,after=Math.max(0,Math.round(before+amount)),applied=after-before;if(!applied)return 0;
 c.score=after;c.ledger[key]=(c.ledger[key]||0)+applied;c.recent=c.recent||[];c.recent.unshift({day:dayNum(),label,points:applied});c.recent=c.recent.slice(0,16);return applied;
}
function weeklyValueDelta(cur,prev,posRate,negRate,key,label){const d=Math.round(cur-prev);if(d>0)weeklyChallengeAdjust(key,d*posRate,`${label} +${d}`);else if(d<0)weeklyChallengeAdjust(key,d*negRate,`${label} ${d}`)}
function weeklyMetricDelta(cur,prev,rate,key,label){const d=Math.max(0,(cur||0)-(prev||0));if(d)weeklyChallengeAdjust(key,d*rate,`${label} x${d}`)}
function resetWeeklyChallengeMetricSnapshot(){if(weeklyChallengeActive()&&S.weeklyChallenge.snapshot)S.weeklyChallenge.snapshot.metrics=weeklyMetricSnapshot()}
function syncWeeklyChallengeScore(allowFinish=true){
 const c=S?.weeklyChallenge;if(!c||c.finished)return;
 const prev=c.snapshot||weeklyChallengeSnapshot(),now=weeklyChallengeSnapshot();
 weeklyValueDelta(now.progress,prev.progress,5,6,'restoration','Restoration');
 weeklyValueDelta(now.reliability,prev.reliability,4,7,'reliability','Reliability');
 weeklyValueDelta(now.knowledge,prev.knowledge,8,4,'knowledge','Knowledge');
 weeklyValueDelta(now.reputation,prev.reputation,10,6,'reputation','Reputation');
 weeklyValueDelta(now.confidence,prev.confidence,2,3,'confidence','Confidence');
 weeklyValueDelta(now.bodyCondition,prev.bodyCondition,3,3,'appearance','Body condition');
 weeklyValueDelta(now.interiorCondition,prev.interiorCondition,2,2,'appearance','Interior condition');
 weeklyValueDelta(now.styleScore,prev.styleScore,4,2,'appearance','Style');
 weeklyValueDelta(now.performanceScore,prev.performanceScore,5,3,'performance','Performance');
 if(now.parentPatience<prev.parentPatience)weeklyChallengeAdjust('penalties',(now.parentPatience-prev.parentPatience)*2,`Parent patience ${now.parentPatience-prev.parentPatience}`);
 const a=now.metrics||{},b=prev.metrics||{};
 weeklyMetricDelta(a.projectSuccess,b.projectSuccess,60,'projectWins','Project success');
 weeklyMetricDelta(a.projectFail,b.projectFail,-60,'projectFails','Project failure');
 weeklyMetricDelta(a.jobsSuccess,b.jobsSuccess,75,'sideJobs','Side-job success');
 weeklyMetricDelta(a.jobsFail,b.jobsFail,-90,'sideJobFails','Side-job failure');
 weeklyMetricDelta(a.research,b.research,10,'research','Useful research');
 weeklyMetricDelta(a.codesScanned,b.codesScanned,20,'scans','Code scan');
 weeklyMetricDelta(a.bodyJobs,b.bodyJobs,30,'appearance','Body/detail job');
 const shiftHours=Math.max(0,(a.shiftHours||0)-(b.shiftHours||0));if(shiftHours)weeklyChallengeAdjust('work',Math.round(shiftHours*4),`Part-time work +${shiftHours}h`);
 if(prev.startable&&!now.startable)weeklyChallengeAdjust('penalties',-150,'Project became a no-start');
 if(!prev.startable&&now.startable)weeklyChallengeAdjust('recovery',80,'Recovered a no-start');
 if(prev.driveable&&!now.driveable)weeklyChallengeAdjust('penalties',-120,'Project became immobile');
 if(!prev.driveable&&now.driveable)weeklyChallengeAdjust('recovery',60,'Project became driveable again');
 if(!prev.completed&&now.completed)weeklyChallengeAdjust('finish',250,'Project milestone completed');
 if(!prev.gameOver&&now.gameOver)weeklyChallengeAdjust('penalties',-500,'Run-ending failure');
 c.snapshot=now;
 if(allowFinish&&(dayNum()>c.durationDays||S.gameOver))finishWeeklyChallenge(S.gameOver?'RUN ENDED EARLY':'SEVEN DAYS COMPLETE');
}
function weeklyLedgerRows(c){
 const labels={restoration:'Restoration',reliability:'Reliability',knowledge:'Knowledge',reputation:'Reputation',confidence:'Confidence',appearance:'Appearance / body',performance:'Performance',projectWins:'Project wins',projectFails:'Project failures',sideJobs:'Side jobs',sideJobFails:'Side-job failures',research:'Research',scans:'Diagnostics',work:'Part-time work',recovery:'Recoveries',penalties:'Penalties',finish:'Finish bonuses'};
 return Object.entries(labels).filter(([k])=>c.ledger[k]).map(([k,n])=>`<div><span>${n}</span><b class="${c.ledger[k]<0?'badtxt':'goodtxt'}">${c.ledger[k]>0?'+':''}${c.ledger[k]}</b></div>`).join('')||'<div><span>No score changes yet</span><b>0</b></div>';
}
function weeklyChallengeBest(id){try{return JSON.parse(localStorage.getItem(weeklyBestKey(id))||'null')}catch{return null}}
function weeklyChallengeSaved(id){try{return JSON.parse(localStorage.getItem(weeklyRunKey(id))||'null')}catch{return null}}
function saveWeeklyChallenge(){
 if(!S?.weeklyChallenge)return false;try{syncActiveProject();const state=JSON.parse(JSON.stringify(S));state.carId=S.car?.id||state.carId;delete state.car;const payload={version:1,savedAt:Date.now(),seed:S.runSeed||currentRunSeed(),rng:rngSnapshot(),state};localStorage.setItem(weeklyRunKey(S.weeklyChallenge.id),JSON.stringify(payload));return true}catch(err){console.warn('Weekly challenge save failed',err);return false}
}
function loadWeeklyChallenge(){
 const cfg=weeklyChallengeConfig(),raw=weeklyChallengeSaved(cfg.id);if(!raw)return false;try{const seed=activateRunSeed(raw.seed||cfg.seed,raw.rng);activeSaveSlot=null;hydrateLoadedState(raw.state,null,seed);$('menu').classList.add('hidden');$('start').classList.add('hidden');$('game').classList.remove('hidden');$('menuBtn').classList.remove('hidden');closeModal();render();return true}catch(err){console.warn('Weekly challenge load failed',err);localStorage.removeItem(weeklyRunKey(cfg.id));openWeeklyChallengeMenu();return false}
}
function beginWeeklyChallenge(){
 const cfg=weeklyChallengeConfig();localStorage.removeItem(weeklyRunKey(cfg.id));activeSaveSlot=null;activateRunSeed(cfg.seed);$('menu').classList.add('hidden');$('start').classList.add('hidden');$('game').classList.remove('hidden');closeModal();startGame(cfg.carId);
 S.cash=cfg.startCash;S.ftueEnabled=false;S.ftueStep=5;S.ftueNudge=null;S.weeklyDue=null;S.logs=[];S.runSeed=cfg.seed;S.saveSlot=null;S.weekStart={week:1,cash:S.cash,mileage:S.mileage,progress:S.progress,knowledge:S.knowledge,reputation:S.reputation};
 S.weeklyChallenge={...cfg,score:cfg.startScore,ledger:freshWeeklyLedger(),recent:[],finished:false,projectUid:S.activeProjectUid,startedAt:Date.now(),snapshot:null};S.weeklyChallenge.snapshot=weeklyChallengeSnapshot();
 addLog(`WEEKLY CHALLENGE ${cfg.id}: ${cfg.title}.`,'day');addLog(`${cfg.carName}. Seven in-game days. Starting score ${cfg.startScore}. Score can never fall below zero.`,'good');addLog('Positive outcomes add points. Failures, reliability losses and bad decisions remove them. The challenge project is locked for the run.','warn');$('menuBtn').classList.remove('hidden');render();
}
function confirmRestartWeeklyChallenge(){const cfg=weeklyChallengeConfig();showModal(`<h2>Restart ${cfg.id}?</h2><div class="card"><p>Your current run for this week will be replaced. Your recorded local best is not deleted.</p></div><div class="modal-actions"><button class="danger" onclick="beginWeeklyChallenge()">RESTART CHALLENGE</button><button onclick="openWeeklyChallengeMenu()">BACK</button></div>`)}
function finishWeeklyChallenge(reason){
 const c=S?.weeklyChallenge;if(!c||c.finished)return;
 if(!c.finalBonusApplied){const p=weeklyProjectState()||S;if(p.startable!==false&&p.driveable!==false)weeklyChallengeAdjust('finish',250,'Finished with a running, driveable project');c.finalBonusApplied=true}
 c.finished=true;c.finishReason=reason;c.finishedAt=Date.now();c.finalDay=Math.min(dayNum(),c.durationDays);S.weeklyDue=null;
 const old=weeklyChallengeBest(c.id);if(!old||c.score>old.score)localStorage.setItem(weeklyBestKey(c.id),JSON.stringify({score:c.score,finishedAt:c.finishedAt,carName:c.carName,title:c.title}));saveWeeklyChallenge();showWeeklyChallengeResults();
}
function showWeeklyChallengeResults(){
 const c=S?.weeklyChallenge;if(!c)return;const best=weeklyChallengeBest(c.id),isBest=best?.score===c.score;
 showModal(`<h2>Weekly Challenge Complete</h2><div class="card"><div class="jobhead"><div><b>${c.id} - ${c.title}</b><div class="small">${c.carName}</div></div><span class="risk">${c.finishReason||'COMPLETE'}</span></div><div class="kv"><div><span>FINAL SCORE</span><b>${c.score.toLocaleString()}</b></div><div><span>STARTED</span><b>${c.startScore.toLocaleString()}</b></div><div><span>LOCAL BEST</span><b>${best?.score?.toLocaleString()||c.score.toLocaleString()}</b></div></div>${isBest?'<p class="goodtxt"><b>NEW LOCAL BEST.</b></p>':''}</div><div class="knowledgegrid">${weeklyLedgerRows(c)}</div><div class="card"><p class="small">Global weekly ranking is intentionally not faked in this local build. When the leaderboard backend lands, this same challenge ID + fixed seed is what everyone will compete on.</p></div><div class="modal-actions"><button class="primary" onclick="initMainMenu()">MAIN MENU</button><button onclick="confirmRestartWeeklyChallenge()">REPLAY THIS WEEK</button></div>`,'weekly-complete')
}
function openWeeklyChallengeScore(){
 const c=S?.weeklyChallenge;if(!c)return;const left=Math.max(0,c.durationDays-dayNum()+1),recent=(c.recent||[]).slice(0,6).map(x=>`<div class="invrow"><span>D${x.day} - ${x.label}</span><b class="${x.points<0?'badtxt':'goodtxt'}">${x.points>0?'+':''}${x.points}</b></div>`).join('');
 showModal(`<h2>${c.id} - ${c.title}</h2><div class="card"><div class="kv"><div><span>SCORE</span><b>${c.score.toLocaleString()}</b></div><div><span>DAY</span><b>${Math.min(dayNum(),c.durationDays)} / ${c.durationDays}</b></div><div><span>DAYS LEFT</span><b>${left}</b></div></div><p class="small">Score never goes below zero. Repeating a button is not itself worth points; outcomes are.</p></div><div class="knowledgegrid">${weeklyLedgerRows(c)}</div>${recent?`<h2 style="margin-top:9px">Recent scoring</h2><div class="savegrid">${recent}</div>`:''}<div class="modal-actions"><button class="primary" onclick="closeModal()">BACK TO RUN</button><button onclick="openGameMenu()">RUN MENU</button></div>`)
}
function renderWeeklyChallengeHud(){const b=$('challengeScoreBtn');if(!b)return;const c=S?.weeklyChallenge;if(!c){b.classList.add('hidden');return}b.classList.remove('hidden');b.textContent=`W${c.week} - ${c.score.toLocaleString()} PTS - D${Math.min(dayNum(),c.durationDays)}/${c.durationDays}`}
function renderWeeklyChallengeMenuButton(){const b=$('weeklyChallengeBtn');if(!b)return;const c=weeklyChallengeConfig(),run=weeklyChallengeSaved(c.id),best=weeklyChallengeBest(c.id);b.innerHTML=`WEEKLY CHALLENGE<br><span class="small">${c.id} - ${c.carName}${run&&!run.state?.weeklyChallenge?.finished?' - RUN IN PROGRESS':best?` - BEST ${best.score.toLocaleString()}`:''}</span>`}
function openWeeklyChallengeMenu(){
 const c=weeklyChallengeConfig(),run=weeklyChallengeSaved(c.id),wc=run?.state?.weeklyChallenge,best=weeklyChallengeBest(c.id),resume=run&&wc&&!wc.finished;
 showModal(`<h2>${c.id} - ${c.title}</h2><div class="card"><div class="jobhead"><div><b>${c.carName}</b><div class="small">${c.dateText}</div></div><span class="risk">FIXED SEED</span></div><p>${c.blurb}</p><div class="kv"><div><span>DURATION</span><b>${c.durationDays} DAYS</b></div><div><span>START SCORE</span><b>${c.startScore.toLocaleString()}</b></div><div><span>START CASH</span><b>$${c.startCash.toLocaleString()}</b></div></div><p class="small">Seed: <b>${c.seed}</b>. Everyone on this weekly challenge gets the same starting project and random world. Score cannot go below zero.</p></div><div class="card"><b>How scoring works</b><p class="small">Restoration, reliability, knowledge, reputation, successful repairs, successful side jobs, diagnostics and useful work add points. Failed repairs/jobs, reliability losses, no-starts, immobile states and run-ending mistakes remove points. Repetitive button presses do not score by themselves.</p>${best?`<p><b>Local best:</b> ${best.score.toLocaleString()} points</p>`:'<p class="small">No local score recorded for this week yet.</p>'}</div><div class="modal-actions three">${resume?'<button class="primary" onclick="loadWeeklyChallenge()">RESUME CHALLENGE</button>':''}<button class="${resume?'danger':'primary'}" onclick="${resume?'confirmRestartWeeklyChallenge()':'beginWeeklyChallenge()'}">${resume?'RESTART':'START CHALLENGE'}</button><button disabled>GLOBAL LEADERBOARD<br><span class="small">Online backend later</span></button></div><div class="modal-actions"><button onclick="closeModal()">BACK</button></div>`)
}
