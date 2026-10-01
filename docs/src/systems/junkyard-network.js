function yardAlertMatchesDonor(alertCarId,d){
 const target=cars.find(x=>x.id===alertCarId),donor=cars.find(x=>x.id===d.carId);
 return sameCarGeneration(target,donor)
}
function checkYardAlerts(){S.yardAlertCarIds=S.yardAlertCarIds||[];S.yardAlertSeen=S.yardAlertSeen||[];const seen=new Set(S.yardAlertSeen),hits=[];for(const y of yardLocations)for(const d of (S.yardsData[y.id]||[]))if(S.yardAlertCarIds.some(id=>yardAlertMatchesDonor(id,d))&&!seen.has(d.id)){hits.push({y,d});seen.add(d.id)}S.yardAlertSeen=[...seen].slice(-160);if(hits.length){const h=hits[0],c=cars.find(x=>x.id===h.d.carId);addLog(`PULL-A-PART ALERT: ${h.y.name} just listed a ${yardDonorName(h.d,c)} from the same generation as one of your alerts. It is ${h.y.distance} miles away.`,'good')}}
function toggleYardAlertForCurrent(){S.yardAlertCarIds=S.yardAlertCarIds||[];const id=S.car.id,i=S.yardAlertCarIds.indexOf(id);if(i>=0){S.yardAlertCarIds.splice(i,1);addLog(`Junkyard alerts turned off for the ${S.car.genStart}-${S.car.genEnd} ${S.car.make} generation.`,'day')}else{S.yardAlertCarIds.push(id);addLog(`Junkyard alerts enabled for the ${S.car.genStart}-${S.car.genEnd} generation. Same-generation donor arrivals can now ping the log.`,'good')}openJunkyardFinder();render()}
function topUpYard(y,arr,target,freshAgeMax=2){let added=0;while(arr.length<target){arr.push(makeYardDonor(y.id,rand(0,freshAgeMax),Math.random()<.14?S.car.id:null));added++}return added}
function ensureYardNetwork(){
 const today=dayNum();if(!S.yardsData)S.yardsData={};S.yardAlertCarIds=S.yardAlertCarIds||[];S.yardAlertSeen=S.yardAlertSeen||[];S.yardDailyArrivals=S.yardDailyArrivals||{};
 if(!S.yardsDay){
  for(const y of yardLocations){const target=yardStockTarget(y);S.yardsData[y.id]=[];S.yardDailyArrivals[y.id]=topUpYard(y,S.yardsData[y.id],target,16)}
  S.yardsDay=today;checkYardAlerts();return
 }
 if(today===S.yardsDay){
  for(const y of yardLocations){const arr=S.yardsData[y.id]||[];const min=y.stockMin||7;S.yardDailyArrivals[y.id]=(S.yardDailyArrivals[y.id]||0)+topUpYard(y,arr,min,3);S.yardsData[y.id]=arr}
  checkYardAlerts();return
 }
 const delta=Math.max(1,today-S.yardsDay);S.yardDailyArrivals={};
 for(const y of yardLocations){
  let arr=S.yardsData[y.id]||[];
  for(const d of arr){if(!d.displayYear){const c=cars.find(x=>x.id===d.carId);d.displayYear=rand(c?.genStart||c?.year||1996,c?.genEnd||c?.year||1996)}d.daysOnYard+=delta;d.hiddenParts=d.hiddenParts||[];for(const p of [...d.parts,...d.hiddenParts])if(p.present&&!p.attempted&&Math.random()<yardAttritionChance(d.daysOnYard,yardPartRarity(p),delta))p.present=false}
  arr=arr.filter(d=>d.daysOnYard<=35&&!(d.daysOnYard>18&&Math.random()<.08*delta));
  let turnover=Math.min(arr.length,delta+(Math.random()<Math.min(.75,.30*delta)?1:0));
  while(turnover>0&&arr.length){const candidates=arr.map((d,i)=>({d,i})).filter(x=>x.d.daysOnYard>=2);if(!candidates.length)break;const pick=candidates[rand(0,candidates.length-1)].i;arr.splice(pick,1);turnover--}
  const target=yardStockTarget(y);while(arr.length>target){let oldest=0;for(let i=1;i<arr.length;i++)if(arr[i].daysOnYard>arr[oldest].daysOnYard)oldest=i;arr.splice(oldest,1)}
  S.yardDailyArrivals[y.id]=topUpYard(y,arr,target,2);S.yardsData[y.id]=arr
 }
 S.yardsDay=today;S.yardTrip=null;checkYardAlerts()
}
function yardOpenNow(){const m=minuteOfDay();return m>=480&&m<1140}
function yardRushWindow(){const m=minuteOfDay();return m>=1080&&m<1140}
function yardStatusText(){const m=minuteOfDay();if(m<480)return `CLOSED - opens 8:00 AM`;if(m>=1140)return `CLOSED - opens tomorrow 8:00 AM`;if(m>=1080)return `OPEN - closes 7:00 PM / RUSH WINDOW`;return `OPEN - closes 7:00 PM`}
function oneWayYardHours(y,mode='project'){return Math.max(.18,y.distance/(mode==='project'?32:34))}
function canReachYardBeforeClose(y,mode='project'){const arrival=minuteOfDay()+Math.round(oneWayYardHours(y,mode)*60);return dayNum()===Math.floor((S.totalMin+Math.round(oneWayYardHours(y,mode)*60))/1440)+1&&arrival<1140&&arrival>=480}
