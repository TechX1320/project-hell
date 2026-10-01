const rarePartTemplates=[
{id:'si_interior',name:'Civic Si-style interior set',type:'interior',fitCarIds:['civic','civicex'],slots:3,style:7,perf:0,base:260,rarity:'RARE',desc:'Better seats and trim. Exactly the sort of thing normal parts stores do not sell.'},
{id:'honda_oem_alloys',name:'Period Honda/Acura OEM alloy set',type:'wheels',fitMakes:['Honda','Acura'],slots:4,style:5,perf:1,base:240,rarity:'UNCOMMON',desc:'OEM-plus before people called it OEM-plus.'},
{id:'bbs_mesh',name:'Old-school 4x100 mesh wheel set',type:'wheels',fitCarIds:['civic','civicex','integra','miata'],slots:4,style:8,perf:1,base:390,rarity:'RARE',desc:'Period-looking wheels that make people at Cars & Coffee actually walk over.'},
{id:'momo_wheel',name:'Used Momo steering wheel + assorted hub',type:'interior',fitMakes:['Honda','Acura','Mazda','Mitsubishi','Toyota','VW','BMW'],slots:1,style:4,perf:0,base:150,rarity:'UNCOMMON',desc:'The wheel is real. Whether the included hub fits your car is another matter.'},
{id:'eclipse_wing',name:'Eclipse GS-T factory rear wing',type:'body',fitCarIds:['eclipse','eclipsegst'],slots:2,style:6,perf:0,base:180,rarity:'RARE',desc:'A factory performance-trim piece somebody saved from a dead car.'},
{id:'gti_seats',name:'GTI VR6 sport seat set',type:'interior',fitCarIds:['gti'],slots:3,style:7,perf:0,base:300,rarity:'RARE',desc:'The bolsters are worn, but they are still much cooler than base seats.'},
{id:'bmw_sport_seats',name:'BMW sport front seats',type:'interior',fitCarIds:['bmw328'],slots:3,style:6,perf:0,base:340,rarity:'RARE',desc:'Heavy, nicer, and probably missing one trim cap.'},
{id:'factory_fogs',name:'Factory fog-light kit',type:'body',fitMakes:['Honda','Acura','Toyota','Mitsubishi','Ford'],slots:1,style:3,perf:0,base:120,rarity:'UNCOMMON',desc:'Switch, housings, brackets, and most of the wiring.'},
{id:'used_coilovers',name:'Used adjustable coilovers',type:'performance',fitMakes:['Honda','Acura','Mazda','Mitsubishi','VW','BMW','Subaru','Nissan'],slots:3,style:3,perf:5,base:420,rarity:'UNCOMMON',desc:'Nobody can tell you how many winters are on them.'},
{id:'period_intake',name:'Used period-correct intake kit',type:'performance',fitMakes:['Honda','Acura','Mazda','Mitsubishi','Toyota','Ford','Dodge','Chevy'],slots:1,style:1,perf:3,base:110,rarity:'COMMON',desc:'Mostly pipe, filter and old stickers. Still counts.'},
{id:'cassette_headunit',name:'Period cassette/CD head unit',type:'interior',fitMakes:['Honda','Acura','Mazda','Mitsubishi','Toyota','VW','BMW','Subaru','Nissan','Ford','Dodge','Chevy'],slots:1,style:3,perf:0,base:95,rarity:'UNCOMMON',desc:'A tiny detail that makes an old interior feel intentional.'}
];
const marketplacePartTemplates=[...rarePartTemplates];
(function buildMarketplaceCatalog(){
 const makeGroups=[['Honda','Acura'],['Mazda'],['Mitsubishi'],['Toyota'],['Ford'],['Chevy','Dodge'],['VW','BMW'],['Subaru','Nissan'],['Honda','Acura','Mazda','Mitsubishi','Toyota','Ford','Chevy','Dodge','VW','BMW','Subaru','Nissan']];
 const wheelNames=['5-spoke alloy wheel set','mesh alloy wheel set','six-spoke touring wheel set','deep-dish period wheel set','lightweight multi-spoke wheel set','OEM-style polished wheel set','black five-spoke wheel set','silver rally-style wheel set'];
 for(let i=0;i<24;i++){const size=14+(i%4),name=`${size}in ${wheelNames[i%wheelNames.length]}`,rare=i%7===0?'RARE':i%3===0?'UNCOMMON':'COMMON';marketplacePartTemplates.push({id:`market_wheel_${i}`,name,type:'wheels',fitMakes:makeGroups[i%makeGroups.length],slots:4,style:3+(i%6),perf:i%4===0?2:1,base:130+(i%8)*45,rarity:rare,desc:'Used wheel set from a private seller. Offset, bends, curb rash and tire age are all your problem.'})}
 const interiors=[
  {name:'Sport front seats',slot:'front_seats'},{name:'Full cloth front seat set',slot:'front_seats'},{name:'Leather front seats',slot:'front_seats'},
  {name:'Rear seat + trim set',slot:'rear_seat'},{name:'Leather rear seat',slot:'rear_seat'},
  {name:'Dashboard assembly',slot:'dash'},{name:'Dash pad + vent set',slot:'dash'},{name:'Gauge cluster',slot:'dash'},{name:'Glovebox + dash trim',slot:'dash'},
  {name:'Center console upgrade',slot:'trim'},{name:'Door-card set',slot:'trim'},{name:'Factory armrest console',slot:'trim'},{name:'Rare color interior trim set',slot:'trim'},
  {name:'Period CD head unit',slot:'radio',universal:true},{name:'Cassette head unit',slot:'radio',universal:true},{name:'MiniDisc head unit',slot:'radio',universal:true},{name:'OEM radio + pocket',slot:'radio'},
  {name:'Factory speaker set',slot:'speakers'},{name:'Period component speaker set',slot:'speakers',universal:true},{name:'Factory amplifier + speaker set',slot:'speakers'},
  {name:'Floor-mat set',slot:'floor_mats',universal:true},{name:'OEM logo floor-mat set',slot:'floor_mats'},
  {name:'Molded carpet / floor set',slot:'floor_carpet'},{name:'Cargo-area trim + carpet set',slot:'floor_carpet'},
  {name:'Sport pedal set',slot:'pedals',universal:true},{name:'OEM pedal / dead-pedal set',slot:'pedals'},
  {name:'OEM leather steering wheel',slot:'controls'},{name:'Shift knob + boot set',slot:'controls',universal:true},
  {name:'Compact powered subwoofer',slot:'subwoofer',universal:true},{name:'Period 10in subwoofer + amplifier',slot:'subwoofer',universal:true},{name:'Dual 12in trunk subwoofer box',slot:'subwoofer',universal:true}
 ];
 for(let i=0;i<interiors.length;i++){const x=interiors[i],rare=i%9===0?'RARE':i%3===0?'UNCOMMON':'COMMON';marketplacePartTemplates.push({id:`market_int_${i}`,name:x.name,type:'interior',interiorSlot:x.slot,fitMakes:x.universal?undefined:makeGroups[(i+2)%makeGroups.length],universal:!!x.universal,slots:x.slot==='front_seats'?3:x.slot==='rear_seat'||x.slot==='floor_carpet'||x.slot==='subwoofer'?2:1,style:2+(i%6),perf:0,base:35+(i%9)*38,rarity:rare,desc:'Used interior piece. Cleaning can help; broken clips, sun damage and mystery wiring cannot always be fixed.'})}
 const bodyBits=['Factory fog-light kit','OEM mud-flap set','Period roof rack','Factory lip spoiler','Side-skirt set','Rear spoiler','Clear corner lamp set','OEM grille','Front lip','Rear valance','Factory splash guards','Mirror pair','Tail-light set','Headlight pair','Dealer accessory wind deflectors'];
 for(let i=0;i<bodyBits.length;i++){marketplacePartTemplates.push({id:`market_body_${i}`,name:bodyBits[i],type:'body',fitMakes:makeGroups[(i+4)%makeGroups.length],slots:i%4===0?2:1,style:2+(i%5),perf:0,base:45+(i%7)*42,rarity:i%6===0?'RARE':i%2?'UNCOMMON':'COMMON',desc:'Old exterior accessory or trim pulled from somebody else\'s build. Fitment and missing hardware are not guaranteed.'})}
 const perf=['Used cold-air intake','Short-ram intake','Header / manifold','Cat-back exhaust','Rear sway bar','Front strut brace','Rear strut brace','Short shifter','Lowering spring set','Adjustable coilover set','Larger throttle body','Lightweight crank pulley','High-flow fuel pump','Adjustable fuel-pressure regulator','Performance injector set','Camshaft set','Adjustable cam gear','Lightweight flywheel','Performance clutch kit','Limited-slip differential core','Oil cooler kit','Catch-can kit','Wideband O2 kit','Boost gauge kit','Aftermarket ECU / piggyback','Performance radiator','Silicone hose kit','Upgraded ignition wire set','Underdrive accessory pulley set','Chassis brace set'];
 for(let i=0;i<perf.length;i++){marketplacePartTemplates.push({id:`market_perf_${i}`,name:perf[i],type:'performance',fitMakes:makeGroups[(i+1)%makeGroups.length],slots:[1,1,2,3,2,1,1,1,3,3,1,1,1,1,1,2,1,2,3,3,2,1,1,1,1,2,1,1,1,2][i],style:i%5===0?2:0,perf:2+(i%6),base:70+(i%10)*58,rarity:i%9===0?'RARE':i%3===0?'UNCOMMON':'COMMON',desc:'Used performance part with unknown history. Cheap speed is still speed, right up until it is not.'})}
 const misc=['Vintage oil-pressure gauge','Vintage coolant-temperature gauge','Period tachometer','DIN gauge pod','Old alarm / keyless-entry kit','Factory service manual set','Rare dealer brochure + accessory book','OEM tool-kit insert','Trunk organizer','Battery tie-down kit','Engine-bay dress-up hardware','Period license-plate frame'];
 for(let i=0;i<misc.length;i++)marketplacePartTemplates.push({id:`market_misc_${i}`,name:misc[i],type:i<5?'interior':'body',universal:true,slots:1,style:1+(i%4),perf:0,base:20+(i%6)*28,rarity:i%5===0?'UNCOMMON':'COMMON',desc:'The kind of small period piece that only appears because somebody cleaned out a garage.'});
})();

const junkPullKinds=[
// COMMON - normal stuff you can realistically find on almost any donor
{id:'oem_steel_wheels',name:'OEM steel wheel set',type:'wheels',slots:4,style:0,perf:0,cost:[35,75],hours:1.8,req:10,fit:'car',rarity:'COMMON'},
{id:'oem_alloy_wheels',name:'OEM alloy wheel set',type:'wheels',slots:4,style:3,perf:0,cost:[45,95],hours:2,req:12,fit:'car',rarity:'COMMON'},
{id:'front_seats',name:'Front seat pair',type:'interior',slots:3,style:2,perf:0,cost:[30,70],hours:1.3,req:10,fit:'car',rarity:'COMMON'},
{id:'rear_seat',name:'Rear seat + trim',type:'interior',slots:2,style:1,perf:0,cost:[20,55],hours:1.1,req:9,fit:'car',rarity:'COMMON'},
{id:'center_console',name:'Center console / cupholder trim',type:'interior',slots:1,style:2,perf:0,cost:[15,45],hours:.8,req:8,fit:'car',rarity:'COMMON'},
{id:'gauge_cluster',name:'Gauge cluster',type:'interior',slots:1,style:2,perf:0,cost:[18,48],hours:1,req:11,fit:'car',rarity:'COMMON'},
{id:'switch_pack',name:'Dash switch / control pack',type:'interior',slots:1,style:1,perf:0,cost:[12,35],hours:.7,req:8,fit:'car',rarity:'COMMON'},
{id:'dash_assembly',name:'Dashboard / dash-pad assembly',type:'interior',interiorSlot:'dash',slots:3,style:2,perf:0,cost:[28,75],hours:1.8,req:16,fit:'car',rarity:'COMMON'},
{id:'floor_mats_yard',name:'OEM floor-mat set',type:'interior',interiorSlot:'floor_mats',slots:1,style:1,perf:0,cost:[8,28],hours:.3,req:4,fit:'car',rarity:'COMMON'},
{id:'carpet_set_yard',name:'Molded carpet / floor-board trim',type:'interior',interiorSlot:'floor_carpet',slots:2,style:2,perf:0,cost:[18,55],hours:1.3,req:12,fit:'car',rarity:'COMMON'},
{id:'speaker_set_yard',name:'Factory speaker set',type:'interior',interiorSlot:'speakers',slots:1,style:1,perf:0,cost:[15,45],hours:.9,req:12,fit:'car',rarity:'COMMON'},
{id:'pedal_set_yard',name:'Factory pedal / dead-pedal set',type:'interior',interiorSlot:'pedals',slots:1,style:1,perf:0,cost:[10,32],hours:.7,req:9,fit:'car',rarity:'COMMON'},
{id:'headlights',name:'Headlight pair',type:'body',slots:2,style:2,perf:0,cost:[25,65],hours:1,req:9,fit:'car',rarity:'COMMON'},
{id:'taillights',name:'Tail-light pair',type:'body',slots:2,style:2,perf:0,cost:[22,60],hours:.9,req:8,fit:'car',rarity:'COMMON'},
{id:'mirrors',name:'Mirror pair',type:'body',slots:1,style:1,perf:0,cost:[18,50],hours:.9,req:9,fit:'car',rarity:'COMMON'},
{id:'side_glass',name:'Door / quarter window glass',type:'body',slots:2,style:0,perf:0,cost:[18,48],hours:1.2,req:14,fit:'car',rarity:'COMMON'},
{id:'window_regulator',name:'Window regulator / motor',type:'engine',slots:1,style:0,perf:0,cost:[18,45],hours:1.1,req:15,fit:'car',rarity:'COMMON'},
{id:'airbox',name:'Factory airbox / intake tube',type:'engine',slots:1,style:0,perf:0,cost:[15,45],hours:.8,req:9,fit:'car',rarity:'COMMON'},
{id:'throttle_body',name:'Throttle body / intake hardware',type:'engine',slots:1,style:0,perf:0,cost:[25,60],hours:1.2,req:16,fit:'car',rarity:'COMMON'},
{id:'starter_core',name:'Starter motor core',type:'engine',slots:1,style:0,perf:0,cost:[25,55],hours:1.3,req:14,fit:'make',rarity:'COMMON'},
{id:'alternator_core',name:'Alternator core',type:'engine',slots:1,style:0,perf:0,cost:[28,62],hours:1.3,req:14,fit:'make',rarity:'COMMON'},
{id:'radiator_fan',name:'Radiator fan / shroud',type:'engine',slots:2,style:0,perf:0,cost:[22,58],hours:1.2,req:13,fit:'car',rarity:'COMMON'},
{id:'brake_calipers',name:'Brake caliper pair',type:'engine',slots:2,style:0,perf:0,cost:[30,75],hours:1.6,req:18,fit:'car',rarity:'COMMON'},

// UNCOMMON - nicer factory pieces, useful upgrades and period aftermarket stuff
{id:'factory_spoiler',name:'Factory spoiler / exterior trim',type:'body',slots:2,style:4,perf:0,cost:[35,90],hours:1.2,req:10,fit:'car',rarity:'UNCOMMON'},
{id:'factory_fogs_yard',name:'Factory fog-light set',type:'body',slots:1,style:3,perf:0,cost:[28,70],hours:1.1,req:13,fit:'car',rarity:'UNCOMMON'},
{id:'premium_audio',name:'Premium factory radio / amplifier',type:'interior',slots:1,style:3,perf:0,cost:[30,85],hours:1,req:12,fit:'car',rarity:'UNCOMMON'},
{id:'premium_speakers',name:'Premium factory speaker set',type:'interior',interiorSlot:'speakers',slots:1,style:4,perf:0,cost:[35,95],hours:1.1,req:15,fit:'car',rarity:'UNCOMMON'},
{id:'factory_subwoofer',name:'Factory subwoofer / amplifier module',type:'interior',interiorSlot:'subwoofer',slots:2,style:4,perf:0,cost:[40,110],hours:1.4,req:18,fit:'car',rarity:'UNCOMMON'},
{id:'sport_pedals_yard',name:'Factory sport pedal set',type:'interior',interiorSlot:'pedals',slots:1,style:4,perf:0,cost:[25,70],hours:.8,req:12,fit:'car',rarity:'UNCOMMON'},
{id:'sport_seats',name:'Factory sport seat pair',type:'interior',slots:3,style:5,perf:0,cost:[55,135],hours:1.5,req:12,fit:'car',rarity:'UNCOMMON'},
{id:'leather_wheel',name:'Leather steering wheel / shift trim',type:'interior',slots:1,style:4,perf:0,cost:[28,80],hours:1,req:13,fit:'car',rarity:'UNCOMMON'},
{id:'sunroof_parts',name:'Sunroof panel / mechanism',type:'body',slots:3,style:2,perf:0,cost:[40,110],hours:2.1,req:22,fit:'car',rarity:'UNCOMMON'},
{id:'windshield',name:'Windshield glass',type:'body',slots:4,style:0,perf:0,cost:[35,95],hours:2,req:28,fit:'car',rarity:'UNCOMMON'},
{id:'oem_lip',name:'Factory lip / valance',type:'body',slots:2,style:4,perf:0,cost:[35,95],hours:1.1,req:12,fit:'car',rarity:'UNCOMMON'},
{id:'mudflaps',name:'OEM mud-flap / splash-guard set',type:'body',slots:1,style:3,perf:0,cost:[18,55],hours:.8,req:8,fit:'car',rarity:'UNCOMMON'},
{id:'roof_rack',name:'Period roof-rack / accessory bars',type:'body',slots:2,style:4,perf:0,cost:[35,100],hours:1.1,req:10,fit:'car',rarity:'UNCOMMON'},
{id:'rear_sway',name:'Larger rear sway bar',type:'performance',slots:2,style:0,perf:3,cost:[40,105],hours:1.8,req:24,fit:'car',rarity:'UNCOMMON'},
{id:'strut_brace',name:'Aftermarket strut-tower brace',type:'performance',slots:1,style:1,perf:2,cost:[28,85],hours:.8,req:16,fit:'car',rarity:'UNCOMMON'},
{id:'lowering_springs',name:'Used lowering spring set',type:'performance',slots:3,style:2,perf:4,cost:[55,135],hours:2.4,req:30,fit:'car',rarity:'UNCOMMON'},
{id:'short_shifter',name:'Aftermarket short shifter',type:'performance',slots:1,style:1,perf:3,cost:[30,90],hours:1.2,req:22,fit:'car',rarity:'UNCOMMON'},
{id:'cold_air_intake',name:'Old-school cold-air intake',type:'performance',slots:1,style:1,perf:3,cost:[28,85],hours:.9,req:18,fit:'car',rarity:'UNCOMMON'},
{id:'performance_muffler',name:'Period performance muffler / axle-back',type:'performance',slots:2,style:2,perf:3,cost:[40,115],hours:1.5,req:24,fit:'car',rarity:'UNCOMMON'},

// RARE - the stuff that makes digging through a yard worth losing an afternoon
{id:'period_mesh_wheels',name:'Period mesh alloy wheel set',type:'wheels',slots:4,style:8,perf:1,cost:[85,220],hours:2.2,req:16,fit:'car',rarity:'RARE'},
{id:'sport_trim_interior',name:'Higher-trim interior conversion pieces',type:'interior',slots:3,style:7,perf:0,cost:[65,180],hours:1.8,req:18,fit:'car',rarity:'RARE'},
{id:'rare_cluster',name:'Rare sport / high-spec gauge cluster',type:'interior',slots:1,style:6,perf:0,cost:[55,150],hours:1.2,req:18,fit:'car',rarity:'RARE'},
{id:'period_headunit',name:'Period premium cassette / CD head unit',type:'interior',slots:1,style:5,perf:0,cost:[45,140],hours:1,req:16,fit:'car',rarity:'RARE'},
{id:'period_sub_system',name:'Period aftermarket subwoofer + amplifier system',type:'interior',interiorSlot:'subwoofer',slots:2,style:7,perf:0,cost:[70,190],hours:1.8,req:22,fit:'make',rarity:'RARE'},
{id:'rare_dash_trim',name:'Rare high-spec dashboard / trim conversion',type:'interior',interiorSlot:'dash',slots:3,style:7,perf:0,cost:[70,185],hours:1.8,req:20,fit:'car',rarity:'RARE'},
{id:'component_speakers',name:'Period component speaker / crossover set',type:'interior',interiorSlot:'speakers',slots:1,style:6,perf:0,cost:[55,150],hours:1.3,req:20,fit:'make',rarity:'RARE'},
{id:'dealer_accessory',name:'Rare dealer accessory package',type:'body',slots:1,style:6,perf:0,cost:[40,135],hours:1,req:14,fit:'car',rarity:'RARE'},
{id:'rare_tail_lamps',name:'Rare factory / period tail-light set',type:'body',slots:2,style:6,perf:0,cost:[65,180],hours:1.2,req:16,fit:'car',rarity:'RARE'},
{id:'rare_front_lamps',name:'Rare factory / period headlight set',type:'body',slots:2,style:6,perf:0,cost:[65,185],hours:1.3,req:17,fit:'car',rarity:'RARE'},
{id:'coilovers_yard',name:'Old adjustable coilover set',type:'performance',slots:3,style:3,perf:6,cost:[95,260],hours:2.8,req:34,fit:'car',rarity:'RARE'},
{id:'header_yard',name:'Aftermarket header / manifold',type:'performance',slots:2,style:1,perf:5,cost:[70,190],hours:2.1,req:30,fit:'car',rarity:'RARE'},
{id:'ecu_yard',name:'Period piggyback / aftermarket ECU',type:'performance',slots:1,style:1,perf:6,cost:[90,260],hours:1.2,req:36,fit:'car',rarity:'RARE'},
{id:'wideband_yard',name:'Wideband O2 controller + gauge',type:'performance',slots:1,style:2,perf:4,cost:[65,175],hours:1.4,req:30,fit:'car',rarity:'RARE'},
{id:'cam_gear_yard',name:'Adjustable cam gear / timing hardware',type:'performance',slots:1,style:1,perf:5,cost:[55,165],hours:1.5,req:34,fit:'car',rarity:'RARE'},
{id:'intake_manifold_yard',name:'Aftermarket / high-spec intake manifold',type:'performance',slots:2,style:1,perf:5,cost:[70,210],hours:2,req:32,fit:'car',rarity:'RARE'},
{id:'lsd_core_yard',name:'Limited-slip differential core',type:'performance',slots:3,style:0,perf:7,cost:[120,320],hours:3,req:40,fit:'car',rarity:'RARE'},
{id:'vintage_gauge_set',name:'Vintage oil / temp / volt gauge set',type:'interior',slots:1,style:6,perf:0,cost:[35,130],hours:1,req:14,fit:'car',rarity:'RARE'},

// Body panel is handled specially so it can inherit the donor's actual color.
{id:'straight_body_panel',name:'Straight OEM body panel',type:'body_panel',slots:2,style:0,perf:0,cost:[28,85],hours:1.5,req:12,fit:'car',rarity:'COMMON'}
];
const locations={
 parents:{name:"Parents' Garage",capacity:10,bays:1,rent:0,moveCost:0,desc:'Free, cramped, and absolutely not your warehouse. A second car can be risked in the driveway.'},
 apartment:{name:'Apartment + Rented Garage',capacity:24,bays:2,rent:160,moveCost:250,desc:'Your own place and two parking spots / one workable garage bay. Weekly bills begin.'},
 house:{name:'Cheap House + Garage',capacity:50,bays:4,rent:280,moveCost:700,desc:'Garage, driveway and a little yard. Expensive, but finally room for multiple bad decisions.'}
};

const carColors=['Black','White','Silver','Red','Blue','Green','Tan','Gold','Purple','Dark Gray'];
const yardLocations=[
 {id:'east',name:'Eastside U-Pull',distance:6,entry:3,stockMin:7,stockMax:9,desc:'Small local yard. Fast trip, inventory gets picked over quickly.'},
 {id:'county',name:'County Pull & Save',distance:15,entry:4,stockMin:7,stockMax:10,desc:'Bigger rows and more turnover. Usually the best balance of distance and selection.'},
 {id:'river',name:'Riverside Auto Recyclers',distance:28,entry:5,stockMin:7,stockMax:10,desc:'Farther away, but older and stranger cars tend to survive here longer.'},
 {id:'interstate',name:'Interstate Self-Service Auto Parts',distance:52,entry:7,stockMin:8,stockMax:10,desc:'A huge yard way out of town. The drive hurts, but weird cars and less-picked-over inventory can make it worthwhile.'}
];
const cargoByCar={civic:8,miata:3,eclipse:7,civicex:6,integra:7,prelude:6,celica:7,zx2:7,cavalier:7,neon:7,gti:8,bmw328:8,impreza:10,'240sx':6,eclipsegst:7,mustanggt:6};
