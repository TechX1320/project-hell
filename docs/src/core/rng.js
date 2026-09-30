const WL_NATIVE_RANDOM=Math.random.bind(Math);
let WL_RNG={active:false,seed:'',state:0,calls:0};

function normalizeSeed(value){
  const cleaned=String(value||'').trim().toUpperCase().replace(/\s+/g,'-').replace(/[^A-Z0-9_-]/g,'').slice(0,32);
  return cleaned||generateRunSeed();
}
function hashSeed(value){
  let h=2166136261>>>0;
  for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  h+=h<<13;h^=h>>>7;h+=h<<3;h^=h>>>17;h+=h<<5;
  return h>>>0;
}
function wrenchRandom(){
  WL_RNG.state=(WL_RNG.state+0x6D2B79F5)>>>0;
  let t=WL_RNG.state;
  t=Math.imul(t^(t>>>15),t|1);
  t^=t+Math.imul(t^(t>>>7),t|61);
  WL_RNG.calls++;
  return ((t^(t>>>14))>>>0)/4294967296;
}
function activateRunSeed(seed,snapshot=null){
  const normalized=normalizeSeed(seed);
  WL_RNG={active:true,seed:normalized,state:snapshot?.state??hashSeed(normalized),calls:snapshot?.calls??0};
  Math.random=wrenchRandom;
  return normalized;
}
function deactivateRunSeed(){Math.random=WL_NATIVE_RANDOM;WL_RNG={active:false,seed:'',state:0,calls:0}}
function currentRunSeed(){return WL_RNG.seed||''}
function rngSnapshot(){return {seed:WL_RNG.seed,state:WL_RNG.state>>>0,calls:WL_RNG.calls||0}}
function generateRunSeed(){
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes=new Uint8Array(8);
  if(globalThis.crypto?.getRandomValues)crypto.getRandomValues(bytes);
  else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(WL_NATIVE_RANDOM()*256);
  let s='WL-';
  for(let i=0;i<bytes.length;i++){if(i===4)s+='-';s+=alphabet[bytes[i]%alphabet.length]}
  return s;
}
