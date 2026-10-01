let pendingNewGameSlot=null,pendingNewGameSeed='';

function initMainMenu(){
  if(S)saveGame();
  S=null;activeSaveSlot=null;deactivateRunSeed();resetRuntimeIndexes();
  $('game').classList.add('hidden');$('start').classList.add('hidden');$('menu').classList.remove('hidden');$('menuBtn').classList.add('hidden');
  closeModal();renderMainMenu();
}

function renderMainMenu(){
  const latest=newestSaveSlot(),summary=latest?saveSummary(latest):null,btn=$('continueBtn');
  btn.disabled=!summary;
  btn.innerHTML=summary?`CONTINUE<br><span class="small">Slot ${summary.slot} - Day ${summary.day} - ${summary.car}</span>`:'CONTINUE<br><span class="small">No local save yet</span>';
  const slotText=allSaveSummaries().filter(Boolean).length;
  $('localSaveStatus').textContent=slotText?`${slotText}/3 local save slots in use`:'No local saves yet';
  const eb=$('endingsBtn');if(eb)eb.innerHTML=`ENDINGS<br><span class="small">Good ${goodEndingCount()}/${Object.keys(GOOD_ENDING_DEFS).length} - Bad ${badEndingUniqueCount()}/${Object.keys(BAD_ENDING_DEFS).length}</span>`;
}

function continueLatest(){const slot=newestSaveSlot();if(slot)loadGame(slot)}

function openLoadMenu(){
  const rows=[1,2,3].map(slot=>{
    const s=saveSummary(slot);
    if(!s)return `<div class="savecard"><div><b>SLOT ${slot}</b><div class="small">EMPTY</div></div><button disabled>LOAD</button></div>`;
    return `<div class="savecard"><div><b>SLOT ${slot} - DAY ${s.day}</b><div>${s.car}</div><div class="small">Seed ${s.seed} - ${Math.round(s.cash).toLocaleString()} - Knowledge ${s.knowledge}${s.gameOver?` - ${s.endingType||'RUN'} ENDING${s.endingTitle?': '+s.endingTitle:''}`:''}</div></div><div class="mini-actions"><button class="primary" onclick="loadGame(${slot})">LOAD</button><button class="danger" onclick="confirmDeleteSlot(${slot})">DELETE</button></div></div>`
  }).join('');
  showModal(`<h2>Local Saves</h2><div class="card"><p>Saves live only in this browser/device for now. No account or cloud sync.</p></div><div class="savegrid">${rows}</div><div class="modal-actions"><button onclick="closeModal()">BACK</button></div>`)
}

function confirmDeleteSlot(slot){
  const s=saveSummary(slot);if(!s)return openLoadMenu();
  showModal(`<h2>Delete Slot ${slot}?</h2><div class="card"><p><b>${s.car}</b> - Day ${s.day} - Seed ${s.seed}</p><p class="badtxt">This local save cannot be recovered after deletion.</p></div><div class="modal-actions"><button class="danger" onclick="deleteSlotAndRefresh(${slot})">DELETE SAVE</button><button onclick="openLoadMenu()">KEEP IT</button></div>`)
}

function deleteSlotAndRefresh(slot){deleteSaveSlot(slot);renderMainMenu();openLoadMenu()}

function openNewGameMenu(){
  const cards=[1,2,3].map(slot=>{const s=saveSummary(slot);return `<button class="slotpick ${s?'occupied':''}" onclick="chooseNewGameSlot(${slot})"><b>SLOT ${slot}</b><span>${s?`Day ${s.day} - ${s.car}`:'EMPTY'}</span><span class="small">${s?`Seed ${s.seed}`:'Ready for a new run'}</span></button>`}).join('');
  showModal(`<h2>New Game - Choose Local Slot</h2><div class="card"><p>Every new run gets a deterministic seed. Share the seed and another player can generate the same underlying random world.</p><p class="small">Your choices still make the run diverge. Occupied slots will ask before being overwritten.</p></div><div class="slotgrid">${cards}</div><div class="modal-actions"><button onclick="closeModal()">BACK</button></div>`)
}

function chooseNewGameSlot(slot){pendingNewGameSlot=slot;pendingNewGameSeed=generateRunSeed();showSeedSetup()}

function showSeedSetup(){
  const old=saveSummary(pendingNewGameSlot);
  showModal(`<h2>New Game - Seed</h2><div class="card"><p><b>Slot ${pendingNewGameSlot}</b>${old?` currently contains Day ${old.day} - ${old.car}. Starting the run will overwrite it.`:' is empty.'}</p><p>A seed controls the game's random stream: starting condition, body state, jobs, Marketplace, junkyards, events, failures, finds, and other random rolls.</p><p class="small">Use the same seed to compare runs with friends, or hit Random Seed and let fate choose.</p></div><label class="seed-label">RUN SEED<input id="seedInput" class="seed-input" maxlength="32" value="${pendingNewGameSeed}"></label><div class="modal-actions three"><button onclick="randomizeSeedField()">RANDOM SEED</button><button class="primary" onclick="acceptSeedSetup()">CHOOSE STARTER CAR</button><button onclick="openNewGameMenu()">BACK</button></div>`)
}

function randomizeSeedField(){pendingNewGameSeed=generateRunSeed();$('seedInput').value=pendingNewGameSeed}

function acceptSeedSetup(){
  pendingNewGameSeed=normalizeSeed($('seedInput').value);
  const old=saveSummary(pendingNewGameSlot);
  if(old){showModal(`<h2>Overwrite Slot ${pendingNewGameSlot}?</h2><div class="card"><p>This will replace <b>Day ${old.day} - ${old.car}</b>.</p><p>New seed: <b>${pendingNewGameSeed}</b></p></div><div class="modal-actions"><button class="danger" onclick="beginSeededNewGame()">OVERWRITE / CONTINUE</button><button onclick="showSeedSetup()">BACK</button></div>`);return}
  beginSeededNewGame();
}

function beginSeededNewGame(){
  activeSaveSlot=pendingNewGameSlot;activateRunSeed(pendingNewGameSeed);
  $('menu').classList.add('hidden');$('game').classList.add('hidden');$('start').classList.remove('hidden');$('menuBtn').classList.add('hidden');
  $('newGameSeedLabel').textContent='SEED '+currentRunSeed()+' // SLOT '+activeSaveSlot;
  closeModal();makeCars();
}

function cancelStarterSelection(){activeSaveSlot=null;pendingNewGameSlot=null;pendingNewGameSeed='';deactivateRunSeed();initMainMenu()}

function openSettings(){
  const s=getSettings();
  showModal(`<h2>Settings</h2><div class="card"><div class="jobhead"><div><b>Day 1 guided tutorial</b><div class="small">Applies to new games only.</div></div><button onclick="toggleFtueDefault()">${s.ftueDefault?'ON':'OFF'}</button></div></div><div class="card"><b>Saving</b><p class="small">Autosave is always on for this local prototype. Save data stays in this browser/device.</p></div><div class="modal-actions"><button onclick="closeModal()">BACK</button></div>`)
}

function toggleFtueDefault(){const s=getSettings();updateSettings({ftueDefault:!s.ftueDefault});openSettings()}

function openGameMenu(){
  saveGame();
  showModal(`<h2>Wrench Life</h2><div class="card"><div class="market-meta"><div><span>SAVE SLOT</span><b>${activeSaveSlot||'-'}</b></div><div><span>SEED</span><b>${S.runSeed||currentRunSeed()}</b></div><div><span>DAY</span><b>${dayNum()}</b></div><div><span>AUTOSAVE</span><b>${lastSaveError?'ERROR':'OK'}</b></div></div></div><div class="modal-actions"><button class="primary" onclick="closeModal()">RESUME</button><button onclick="saveAndReturnToMenu()">SAVE + MAIN MENU</button><button onclick="openRunInfo()">RUN / SEED INFO</button><button onclick="openSettings()">SETTINGS</button></div>`)
}

function saveAndReturnToMenu(){saveGame();closeModal();initMainMenu()}

function openRunInfo(){
  const seed=S?.runSeed||currentRunSeed();
  showModal(`<h2>Run Seed</h2><div class="card"><p class="seed-display">${seed}</p><p class="small">A saved game also stores the exact RNG position, so Continue resumes the same random stream instead of restarting the seed.</p></div><div class="modal-actions"><button class="primary" onclick="copyRunSeed()">COPY SEED</button><button onclick="openGameMenu()">BACK</button></div>`)
}

async function copyRunSeed(){const seed=S?.runSeed||currentRunSeed();try{await navigator.clipboard.writeText(seed);addLog('Run seed copied to clipboard.','day');closeModal();render()}catch{showModal(`<h2>Run Seed</h2><div class="card"><p class="seed-display">${seed}</p><p class="small">Clipboard access was blocked. Select the seed above manually.</p></div><div class="modal-actions"><button onclick="openGameMenu()">BACK</button></div>`)}}
