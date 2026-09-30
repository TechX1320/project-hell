const projectTasks=[
{id:'oil',name:'Oil + filter change',category:'Maintenance',req:4,hours:1,gain:2,rel:3,xp:2,special:'oil',fail:'You finish the oil change and immediately notice something does not feel right.'},
{id:'plugs',name:'Spark plugs',category:'Engine',req:8,hours:1.5,gain:4,rel:4,xp:4,special:'plugs',needs:{spark_set:1},fail:'One plug starts going in wrong. The threads feel suspicious.'},
{id:'vcg',name:'Valve cover gasket',category:'Engine',req:11,hours:2,gain:5,rel:4,xp:5,needs:{vc_gasket:1},fail:'The gasket rolls out of the groove while you tighten the cover. You catch the leak before calling it done.'},
{id:'brakes',name:'Front brake service',category:'Brakes',req:20,hours:3,gain:6,rel:6,xp:7,needs:{front_pads:1},fail:'A caliper bolt rounds off. The car is now more stationary than before.'},
{id:'rear_brakes',name:'Rear brake service',category:'Brakes',req:23,hours:3.5,gain:5,rel:5,xp:7,needs:{rear_pads:1},fail:'A rear caliper or parking-brake mechanism refuses to cooperate and the job stops being simple.'},
{id:'starter',name:'Replace starter',category:'Electrical',req:31,hours:4,gain:7,rel:8,xp:9,needs:{starter:1},fail:'You remove three unrelated brackets and still cannot reach the top bolt.'},
{id:'bearing',name:'Press-in wheel bearing',category:'Brakes',req:36,hours:5,gain:8,rel:7,xp:11,needs:{wheel_bearing:1},requiresTool:'shop_press',fail:'The bearing has fused itself to the hub sometime during the Clinton administration.'},
{id:'timing',name:'Timing belt service',category:'Engine',req:44,hours:6,gain:12,rel:12,xp:14,needs:{timing_kit:1},fail:'The timing marks no longer agree with reality. Starting it right now would be brave.'},
{id:'head',name:'Head gasket',category:'Engine',req:54,hours:10,gain:18,rel:17,xp:20,needs:{head_gasket_kit:1},fail:'The head is off. You have entered the bags-of-labeled-bolts phase of ownership.'},
{id:'clutch',name:'Clutch replacement',category:'Drivetrain',req:58,hours:8,gain:14,rel:10,xp:17,needs:{clutch_kit:1},fail:'The transmission is on the floor and alignment is not cooperating.'},
{id:'intake',name:'Install intake upgrade',category:'Performance',req:12,hours:1.5,gain:2,rel:-1,xp:4,perfGain:2,needs:{intake_kit:1},minKnowledge:20,restoreMin:40,fail:'The intake does not sit where the instructions swear it should.'},
{id:'exhaust',name:'Install cat-back exhaust',category:'Performance',req:23,hours:3,gain:3,rel:-1,xp:6,perfGain:3,needs:{exhaust_kit:1},minKnowledge:25,restoreMin:45,prereq:'intake',fail:'A rusty exhaust fastener rounds off and the old system is now half attached.'},
{id:'springs',name:'Install lowering springs',category:'Drivetrain',req:25,hours:4.5,gain:2,rel:-1,xp:6,perfGain:2,needs:{lowering_springs:1},minKnowledge:25,restoreMin:45,prereq:'exhaust',fail:'One spring is still under tension in a way you do not like. You stop before learning about stored energy personally.'},
{id:'sway',name:'Install upgraded rear sway bar',category:'Drivetrain',req:22,hours:2.5,gain:2,rel:0,xp:5,perfGain:2,needs:{rear_sway:1},minKnowledge:25,restoreMin:45,prereq:'exhaust',fail:'A rusty end-link turns a simple sway-bar install into a hardware problem.'},
{id:'shifter',name:'Install short shifter',category:'Drivetrain',req:18,hours:2,gain:1,rel:0,xp:4,perfGain:1,needs:{short_shifter:1},minKnowledge:26,restoreMin:45,prereq:'exhaust',fail:'The linkage goes back together, but the shifter suddenly has a gear called absolutely nowhere.'},
{id:'headers',name:'Install header / manifold upgrade',category:'Performance',req:30,hours:4,gain:4,rel:-2,xp:7,perfGain:4,needs:{header_kit:1},minKnowledge:28,restoreMin:50,prereq:'exhaust',fail:'An exhaust stud snaps and suddenly this is a drill-and-extractor project.'},
{id:'fuelpump',name:'Install high-flow fuel pump',category:'Performance',req:31,hours:3,gain:2,rel:-1,xp:7,perfGain:2,needs:{fuel_pump:1},minKnowledge:30,restoreMin:50,prereq:'headers',fail:'The fuel system is open, the garage smells terrible, and a connector does not want to seal.'},
{id:'injectors',name:'Install performance fuel injectors',category:'Performance',req:39,hours:3.5,gain:4,rel:-3,xp:8,perfGain:5,needs:{injector_set:1},minKnowledge:31,restoreMin:55,prereq:'fuelpump',minSkill:['Tuning',8],fail:'The engine runs rich, stumbles badly, and smells like raw fuel. More injector is not automatically better.'},
{id:'cams',name:'Install performance camshaft',category:'Performance',req:46,hours:7,gain:6,rel:-4,xp:12,perfGain:7,needs:{cam_kit:1},minKnowledge:35,restoreMin:60,prereq:'injectors',minSkill:['Tuning',12],fail:'Valve timing and calibration both matter now. The engine sounds deeply unhappy with your first attempt.'}
];
const sideJobTemplates=[
{owner:'Jake',relation:'friend',name:'Oil change',make:'Honda',car:'Jake\'s 1998 Honda Civic',category:'Maintenance',req:5,pay:[48,72],hours:1,xp:3,oil:'oil_5w30',filter:'filter_honda',starts:true,canCome:true,desc:'He says the oil light only flickered once. Probably.'},
{owner:'Erin',relation:'cousin',name:'Battery replacement',make:'Toyota',car:'Erin\'s 1997 Toyota Corolla',category:'Electrical',req:8,pay:[40,65],hours:1,xp:3,needs:{},starts:false,canCome:false,desc:'She already bought the battery. She just does not own a 10mm.'},
{owner:'Mike',relation:'neighbor',name:'Spark plugs',make:'Dodge',car:'Mike\'s 1996 Dodge Neon',category:'Engine',req:12,pay:[70,105],hours:1.5,xp:4,needs:{spark_set:1},starts:true,canCome:true,desc:'Your neighbor heard you "work on cars now." Congratulations.'},
{owner:'Marcus',relation:'friend',name:'Front brake pads',make:'Honda',car:'Marcus\'s 1994 Honda Accord',category:'Brakes',req:20,pay:[135,185],hours:3,xp:7,needs:{front_pads:1},starts:true,canCome:false,desc:'The grinding noise started yesterday. He promises.'},
{owner:'Aunt Lisa',relation:'family',name:'Alternator diagnosis',make:'Chevy',car:'Aunt Lisa\'s 1998 Chevy Cavalier',category:'Electrical',req:26,pay:[120,175],hours:3,xp:7,needs:{},starts:false,canCome:false,desc:'She needs the car for work tomorrow morning.'},
{owner:'Sam',relation:'coworker',name:'Valve cover gasket',make:'Toyota',car:'Sam\'s 1995 Toyota Camry',category:'Engine',req:32,pay:[175,240],hours:4,xp:9,needs:{vc_gasket:1},starts:true,canCome:true,desc:'There is oil everywhere. Sam swears it only started recently.'},
{owner:'Nate',relation:'friend-of-friend',name:'Wheel bearing',make:'Ford',car:'Nate\'s 1998 Ford Explorer',category:'Brakes',req:44,pay:[250,340],hours:6,xp:12,needs:{wheel_bearing:1},starts:true,canCome:false,desc:'It sounds like an airplane above 35 mph.'},
{owner:'Tyler',relation:'friend',name:'Runs rough after tune-up',make:'VW',car:'Tyler\'s 1998 Volkswagen Jetta',category:'Engine',req:28,pay:[150,220],hours:3,xp:8,needs:{},starts:true,canCome:true,desc:'He replaced "a bunch of stuff" and now it runs worse.'},
{owner:'Ashley',relation:'coworker',name:'Check engine light diagnosis',make:'Chevy',car:'Ashley\'s 1999 Chevy Cavalier',category:'Electrical',req:18,pay:[70,125],hours:1.5,xp:5,needs:{},starts:true,canCome:true,cel:true,desc:'The check-engine light came on, but it still seems to drive normally.'},
{owner:'Chris',relation:'older cousin',name:'Cooling system diagnosis',make:'BMW',car:'Chris\'s 1996 BMW 328i',category:'Engine',req:38,pay:[220,320],hours:5,xp:11,needs:{},starts:true,canCome:false,desc:'The temperature gauge moved once. Everyone is pretending that is normal.'}
];
const eventTemplates=[
{name:'Cars & Coffee',kind:'meet',startHour:9,duration:2,entry:0,miles:18,minRel:20,minProgress:0,desc:'Low stakes. Park, look at cars, talk to people who know more than you.'},
{name:'Local Cruise Night',kind:'cruise',startHour:19,duration:3,entry:0,miles:28,minRel:35,minProgress:0,desc:'A parking lot full of questionable exhaust choices and useful conversations.'},
{name:'Test & Tune Night',kind:'race',startHour:18,duration:4,entry:35,miles:36,minRel:50,minProgress:40,desc:'Cheap entry. Real timing slips. Mechanical sympathy sold separately.'},
{name:'Autocross Sunday',kind:'race',startHour:8,duration:6,entry:45,miles:42,minRel:55,minProgress:45,desc:'Cones, helmets, and discovering every worn bushing at once.'},
{name:'Local Car Show',kind:'show',startHour:11,duration:4,entry:20,miles:24,minRel:45,minProgress:60,desc:'Nobody cares that much about perfection, but your car should at least look intentional.'}
];
const partTimeJobs=[
{id:'grocery',name:'Grocery Store Stocker',hours:5,pay:[72,92],desc:'Boring, predictable money. Your back may disagree.',perk:'Low drama, moderate fatigue.',tier:'NORMAL'},
{id:'dishwasher',name:'Restaurant Dishwasher',hours:5,pay:[70,94],desc:'Hot kitchen, wet shoes, zero automotive value.',perk:'Reliable cash when the garage is going badly.',tier:'NORMAL'},
{id:'gasstation',name:'Gas Station Clerk',hours:4,pay:[58,82],desc:'A short shift with a lot of weird conversations in the parking lot.',perk:'Small chance to hear about a local car lead.',tier:'NORMAL'},
{id:'landscape',name:'Landscaping Helper',hours:6,pay:[92,122],desc:'Physical work, decent cash, absolutely no shade.',perk:'Extra energy hit.',tier:'NORMAL'},
{id:'warehouse',name:'Warehouse Evening Shift',hours:8,pay:[125,158],desc:'Best guaranteed early-game cash, but it eats the day.',perk:'High fatigue.',tier:'NORMAL'},
{id:'delivery',name:'Pizza Delivery',hours:4,pay:[58,76],desc:'Base pay plus tips, but your project becomes the delivery vehicle.',perk:'Adds 30-55 miles and real breakdown risk.',requiresCar:true,tier:'NORMAL'},
{id:'carwash',name:'Local Car Wash',hours:5,pay:[76,102],desc:'Wet shoes, vacuum dust and a steady stream of interesting cars.',perk:'Small chance to gain Car Scene reputation.',tier:'CAR-ADJACENT'},
{id:'dealerwash',name:'Dealership Wash Bay',hours:6,pay:[92,122],desc:'Wash trade-ins and new cars while hearing techs complain in the next bay.',perk:'Occasional useful shop conversation.',tier:'CAR-ADJACENT'},
{id:'partsstock',name:'Parts Store Stock / Delivery',hours:4,pay:[62,86],desc:'Boxes, rotors and batteries all shift.',perk:'Good odds of a useful research lead.',tier:'CAR-ADJACENT'},
{id:'junkrunner',name:'Junkyard Yard Runner',hours:5,pay:[82,112],desc:'Move parts, tag cars, haul wheels and learn how quickly cars get picked clean.',perk:'Builds junkyard / parts familiarity.',tier:'CAR-ADJACENT',minKnowledge:6,category:'Maintenance'},
{id:'tirehelper',name:'Tire Shop Helper',hours:5,pay:[88,120],desc:'Stack tires, torque wheels and learn that impact guns are not torque wrenches.',perk:'Hands-on Brakes knowledge.',tier:'ENTRY SHOP',minKnowledge:10,category:'Brakes',handsOn:true},
{id:'quicklube',name:'Quick-Lube Bay Helper',hours:5,pay:[92,128],desc:'Oil, filters, tire pressure and a supervisor checking your work.',perk:'Hands-on Maintenance knowledge.',tier:'ENTRY SHOP',minKnowledge:12,category:'Maintenance',handsOn:true},
{id:'detailer',name:'Detail Shop Helper',hours:5,pay:[96,135],desc:'Interior cleaning, polishing and learning what paint damage actually looks like.',perk:'Bodywork knowledge without immediately grabbing a sander.',tier:'ENTRY SHOP',minKnowledge:12,category:'Bodywork',handsOn:true},
{id:'parts',name:'Parts Store Counter',hours:4,pay:[76,108],desc:'Catalogs, customers and figuring out which Civic they actually own.',perk:'Strong chance to pick up a useful research lead.',tier:'ENTRY SHOP',minKnowledge:14},
{id:'battery',name:'Mobile Battery Installer',hours:4,pay:[105,150],desc:'Basic roadside battery swaps and charging-system checks.',perk:'Electrical experience on unfamiliar cars.',tier:'ENTRY SHOP',minKnowledge:16,category:'Electrical',handsOn:true,requiresCar:true},
{id:'stereo',name:'Stereo Shop Install Helper',hours:5,pay:[110,155],desc:'Trim panels, wiring, grounds and discovering previous-owner wiring crimes.',perk:'Electrical + interior confidence.',tier:'ENTRY SHOP',minKnowledge:18,category:'Electrical',handsOn:true},
{id:'shopcleanup',name:'Independent Shop Helper',hours:6,pay:[118,165],desc:'Clean bays, fetch tools, hold lights and occasionally get trusted with simple work.',perk:'Broad hands-on learning.',tier:'SHOP',minKnowledge:18,category:'Engine',handsOn:true},
{id:'oilroute',name:'Backyard Mobile Oil Changes',hours:4,pay:[135,205],desc:'People outside your friend group pay you for basic services. You provide the labor and judgment.',perk:'Higher pay, real customer reputation risk.',tier:'SIDE HUSTLE',minKnowledge:22,category:'Maintenance',handsOn:true,requiresCar:true},
{id:'brakehelper',name:'Brake Shop Helper',hours:6,pay:[145,205],desc:'Pads, rotors and cleaning hardware under someone more experienced.',perk:'Strong Brakes experience.',tier:'SHOP',minKnowledge:24,category:'Brakes',handsOn:true},
{id:'usedinspect',name:'Used-Car Pre-Purchase Inspection',hours:2.5,pay:[120,190],desc:'A stranger pays you to look over a cheap Marketplace car before they buy it.',perk:'Diagnostic experience; being wrong can hurt.',tier:'SIDE HUSTLE',minKnowledge:26,category:'Engine',handsOn:true},
{id:'yardpuller',name:'Junkyard Parts Puller',hours:5,pay:[155,220],desc:'A local reseller pays you to pull specific parts from yard cars.',perk:'Hands-on work across random makes.',tier:'SIDE HUSTLE',minKnowledge:27,category:'Drivetrain',handsOn:true},
{id:'backyardbrakes',name:'Backyard Mechanic - Brake Jobs',hours:4.5,pay:[190,290],desc:'Now strangers are trusting you with brakes in driveways. This should feel serious.',perk:'Good money, workmanship reputation at stake.',tier:'MECHANIC',minKnowledge:30,minSkill:['Brakes',24],category:'Brakes',handsOn:true},
{id:'performancegofer',name:'Performance Shop Gofer',hours:6,pay:[150,220],desc:'Mostly support work, but you are finally around modified cars and better equipment.',perk:'Performance knowledge + Car Scene rep.',tier:'PERFORMANCE',minKnowledge:30,minRep:6,category:'Performance',handsOn:true},
{id:'diagnostichelper',name:'Diagnostic Shop Helper',hours:5,pay:[185,265],desc:'Scan data, multimeters and being forced to prove a theory instead of firing the parts cannon.',perk:'Electrical / diagnostic knowledge.',tier:'MECHANIC',minKnowledge:34,minSkill:['Electrical',22],category:'Electrical',handsOn:true},
{id:'trackpit',name:'Track-Day Pit Helper',hours:7,pay:[190,290],desc:'Tire pressures, brakes, fluids and fixing whatever people break between sessions.',perk:'Drivetrain + Performance learning, Scene rep.',tier:'MOTORSPORT',minKnowledge:36,minRep:10,category:'Drivetrain',handsOn:true},
{id:'dynohelper',name:'Dyno Shop Assistant',hours:6,pay:[210,315],desc:'Strap cars down, log runs and learn why one number never tells the whole story.',perk:'Tuning knowledge and serious Car Scene exposure.',tier:'PERFORMANCE',minKnowledge:40,minRep:12,category:'Tuning',handsOn:true},
{id:'mobilemechanic',name:'Mobile Mechanic Service Calls',hours:6,pay:[260,390],desc:'You are taking real paid jobs from the public now. Diagnosis, tools and reputation all matter.',perk:'High money; failures can become expensive.',tier:'MECHANIC',minKnowledge:44,minRep:10,category:'Engine',handsOn:true,requiresCar:true},
{id:'tuneshop',name:'Tuning Shop Junior Helper',hours:6,pay:[270,420],desc:'Basic logging, sensor checks and setup work around cars that can actually hurt themselves.',perk:'Tuning knowledge; requires earned credibility.',tier:'TUNING',minKnowledge:48,minRep:18,minSkill:['Tuning',25],category:'Tuning',handsOn:true}
];
const celCodes=[
{code:'P0101',desc:'Mass or Volume Air Flow Circuit Range/Performance',category:'Engine',hint:'air metering / intake leak / MAF signal'},
{code:'P0113',desc:'Intake Air Temperature Sensor 1 Circuit High Input',category:'Electrical',hint:'IAT sensor / open circuit / connector'},
{code:'P0128',desc:'Coolant Thermostat Temperature Below Regulating Temperature',category:'Engine',hint:'thermostat / coolant temperature behavior'},
{code:'P0133',desc:'O2 Sensor Circuit Slow Response - Bank 1 Sensor 1',category:'Electrical',hint:'upstream oxygen sensor / exhaust leak / fueling'},
{code:'P0171',desc:'System Too Lean - Bank 1',category:'Engine',hint:'vacuum leak / fuel delivery / air metering'},
{code:'P0300',desc:'Random/Multiple Cylinder Misfire Detected',category:'Engine',hint:'ignition / fueling / vacuum / mechanical condition'},
{code:'P0301',desc:'Cylinder 1 Misfire Detected',category:'Engine',hint:'plug / coil / injector / compression on cylinder 1'},
{code:'P0420',desc:'Catalyst System Efficiency Below Threshold - Bank 1',category:'Engine',hint:'catalyst / exhaust leak / oxygen-sensor data'},
{code:'P0442',desc:'EVAP System Leak Detected - Small Leak',category:'Electrical',hint:'gas cap / EVAP hose / purge or vent system'},
{code:'P0455',desc:'EVAP System Leak Detected - Gross Leak',category:'Electrical',hint:'loose cap / disconnected hose / large EVAP leak'},
{code:'P0500',desc:'Vehicle Speed Sensor Malfunction',category:'Electrical',hint:'speed sensor / wiring / signal'},
{code:'P0505',desc:'Idle Control System Malfunction',category:'Engine',hint:'idle-air control / throttle body / vacuum leak'}
];
const dtcRepairOptions={
 P0101:[
  {itemId:'maf_cleaner',label:'Clean the MAF sensor',req:10,hours:.7},
  {itemId:'engine_air_filter',label:'Replace the engine air filter',req:8,hours:.5},
  {itemId:'vacuum_hose_kit',label:'Repair an intake / vacuum leak',req:17,hours:1.5},
  {itemId:'maf_sensor',label:'Replace the MAF sensor',req:18,hours:1.2}
 ],
 P0113:[{itemId:'iat_sensor',label:'Replace the IAT sensor',req:16,hours:1},{itemId:'vacuum_hose_kit',label:'Inspect / repair nearby intake wiring and hose routing',req:20,hours:1.5}],
 P0128:[{itemId:'thermostat',label:'Replace the thermostat',req:20,hours:2.5}],
 P0133:[{itemId:'upstream_o2',label:'Replace the upstream O2 sensor',req:21,hours:1.5},{itemId:'vacuum_hose_kit',label:'Chase an intake leak affecting fuel trims',req:21,hours:1.8}],
 P0171:[{itemId:'vacuum_hose_kit',label:'Repair a vacuum leak',req:18,hours:1.5},{itemId:'maf_cleaner',label:'Clean the MAF sensor',req:10,hours:.7},{itemId:'maf_sensor',label:'Replace the MAF sensor',req:18,hours:1.2},{itemId:'fuel_filter',label:'Replace the fuel filter',req:20,hours:1.5},{itemId:'single_injector',label:'Replace a suspect injector',req:26,hours:2}],
 P0300:[{itemId:'spark_set',label:'Replace spark plugs',req:10,hours:1.5},{itemId:'ignition_coil',label:'Replace a suspect ignition coil',req:16,hours:1},{itemId:'fuel_filter',label:'Address restricted fuel delivery',req:20,hours:1.5},{itemId:'single_injector',label:'Replace a suspect injector',req:27,hours:2}],
 P0301:[{itemId:'spark_set',label:'Replace spark plugs',req:10,hours:1.5},{itemId:'ignition_coil',label:'Replace cylinder 1 ignition coil',req:16,hours:1},{itemId:'single_injector',label:'Replace cylinder 1 injector',req:27,hours:2}],
 P0420:[{itemId:'upstream_o2',label:'Replace the upstream O2 sensor',req:21,hours:1.5},{itemId:'catalytic_converter',label:'Replace the catalytic converter',req:31,hours:3.5}],
 P0442:[{itemId:'gas_cap',label:'Replace the gas cap',req:5,hours:.2},{itemId:'evap_hose_kit',label:'Repair a small EVAP hose leak',req:17,hours:1.5}],
 P0455:[{itemId:'gas_cap',label:'Replace the gas cap',req:5,hours:.2},{itemId:'evap_hose_kit',label:'Repair a large EVAP hose / connector leak',req:18,hours:1.5}],
 P0500:[{itemId:'vss_sensor',label:'Replace the vehicle speed sensor',req:22,hours:1.5}],
 P0505:[{itemId:'iac_valve',label:'Replace the idle air control valve',req:22,hours:1.7},{itemId:'vacuum_hose_kit',label:'Repair a vacuum leak',req:18,hours:1.5}]
};
const nonsense=[
{t:'bad',msg:'You lose the 10mm socket. Again.',hours:.25,effect:s=>s.confidence-=1},{t:'warn',msg:'Marketplace seller says "5 minutes away" for 47 minutes.',hours:1,effect:s=>{}},{t:'bad',msg:'A bolt snaps with almost no warning. Naturally.',hours:.5,effect:s=>{s.cash-=12;s.confidence-=2;s.projectClues++}},{t:'good',msg:'Dad finds an old breaker bar in the garage. It is enormous and immediately useful.',hours:.25,effect:s=>s.confidence+=1},{t:'warn',msg:'It starts raining halfway through the job. The driveway does not care about your plans.',hours:1,effect:s=>{}},{t:'bad',msg:'You buy something labeled "fits 1990-1999." It absolutely does not.',hours:.5,effect:s=>s.cash-=18}
];
const sleepEvents=[{msg:'You sleep normally.',factor:1},{msg:'A nightmare wakes you up twice.',factor:.72},{msg:'You wake up feeling vaguely sick.',factor:.62},{msg:'Someone starts mowing absurdly early.',factor:.78},{msg:'You sleep incredibly well for once.',factor:1.08}];
const categories=['Maintenance','Engine','Brakes','Electrical','Drivetrain','Bodywork','Performance','Tuning'];
const makes=['Honda','Acura','Mazda','Mitsubishi','Toyota','Dodge','Chevy','Ford','VW','BMW','Subaru','Nissan'];
const itemSlotOverrides={timing_kit:2,clutch_kit:3,head_gasket_kit:2,starter:2,wheel_bearing:2,cv_axle:2,steel_wheels:4,alloy_wheels:4,used_tires:4,street_tires:4,performance_tires:4,jackstands:2,shop_press:4};
const marketSellerLines=['Need gone this week.','No trades unless it is interesting.','Ran when parked.','My kid lost interest.','I know what I have.','Moving and cannot take it.','Daily drove it until last month.','Just needs TLC.'];
const hiddenIssues=['oil leak underneath','intermittent overheating','front-end clunk','rough idle when warm','charging-system problem','wheel-bearing growl','occasional no-start','check-engine light that comes and goes'];
