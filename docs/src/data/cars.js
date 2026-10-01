const cars=[
{id:'civic',starter:true,make:'Honda',name:'1996 Honda Civic DX Hatch',price:1200,reliability:57,progress:28,trait:'Cheap, simple, forgiving',desc:'Slow. Reliable-ish. Parts are everywhere. Probably the least terrible first choice.',bonusK:4,mileage:168420,oil:'oil_5w30',filter:'filter_honda',obd2:true},
{id:'miata',starter:true,make:'Mazda',name:'1996 Mazda Miata',price:1800,reliability:48,progress:32,trait:'Light, RWD, rusty somewhere',desc:'More expensive, more fun, and almost guaranteed to need something you did not budget for.',bonusK:2,mileage:154880,oil:'oil_10w30',filter:'filter_mazda',obd2:true},
{id:'eclipse',starter:true,make:'Mitsubishi',name:'1996 Mitsubishi Eclipse GS',price:1500,reliability:41,progress:25,trait:'Cooler than it is sensible',desc:'Looks fast sitting still. More complicated and more likely to turn one job into three.',bonusK:1,mileage:181260,oil:'oil_5w30',filter:'filter_mitsu',obd2:true},
{id:'civicex',make:'Honda',name:'1998 Honda Civic EX Coupe',price:2200,reliability:56,progress:31,trait:'Slightly nicer Civic',desc:'Still cheap to learn on, but sellers know what they have.',bonusK:3,mileage:174000,oil:'oil_5w30',filter:'filter_honda',obd2:true},
{id:'integra',make:'Acura',name:'1997 Acura Integra LS',price:2600,reliability:53,progress:33,trait:'Honda-adjacent temptation',desc:'A little sportier, a little pricier, and increasingly hard to find unmodified.',bonusK:2,mileage:176000,oil:'oil_5w30',filter:'filter_honda',obd2:true},
{id:'prelude',make:'Honda',name:'1997 Honda Prelude',price:3200,reliability:48,progress:36,trait:'More car, more complexity',desc:'The kind of car that convinces you you are ready for harder jobs.',bonusK:2,mileage:171000,oil:'oil_5w30',filter:'filter_honda',obd2:true},
{id:'celica',make:'Toyota',name:'1997 Toyota Celica GT',price:2400,reliability:55,progress:32,trait:'Dependable until neglected',desc:'Usually sensible. This example has still had twenty-something years to be abused.',bonusK:1,mileage:167000,oil:'oil_5w30',filter:'filter_toyota',obd2:true},
{id:'zx2',make:'Ford',name:'1998 Ford Escort ZX2',price:1600,reliability:49,progress:27,trait:'Cheap forgotten coupe',desc:'Nobody flexes about owning one, which is why you can still afford it.',bonusK:0,mileage:158000,oil:'oil_5w30',filter:'filter_ford',obd2:true},
{id:'cavalier',make:'Chevy',name:'1998 Chevy Cavalier Z24',price:1500,reliability:45,progress:26,trait:'Peak cheap-car energy',desc:'It has survived this long through stubbornness and replacement alternators.',bonusK:0,mileage:183000,oil:'oil_5w30',filter:'filter_chevy',obd2:true},
{id:'neon',make:'Dodge',name:'1997 Dodge Neon Sport',price:1300,reliability:43,progress:24,trait:'Cheap speed-adjacent chaos',desc:'Every listing says it only needs one small thing.',bonusK:0,mileage:169000,oil:'oil_5w30',filter:'filter_dodge',obd2:true},
{id:'gti',make:'VW',name:'1997 Volkswagen GTI VR6',price:2900,reliability:39,progress:33,trait:'Sounds expensive already',desc:'Six cylinders, German wiring, and exactly enough confidence to ruin your week.',bonusK:0,mileage:177000,oil:'oil_5w40',filter:'filter_vw',obd2:true},
{id:'bmw328',make:'BMW',name:'1998 BMW 328i',price:3400,reliability:37,progress:36,trait:'Cheap German luxury trap',desc:'The purchase price is the least expensive part of the experience.',bonusK:0,mileage:186000,oil:'oil_5w30',filter:'filter_bmw',obd2:true},
{id:'impreza',make:'Subaru',name:'1998 Subaru Impreza L',price:2500,reliability:51,progress:31,trait:'AWD before you need AWD',desc:'Useful, weird, and probably making at least one bearing noise.',bonusK:1,mileage:179000,oil:'oil_5w30',filter:'filter_subaru',obd2:true},
{id:'240sx',make:'Nissan',name:'1997 Nissan 240SX',price:4400,reliability:44,progress:39,trait:'Marketplace tax included',desc:'Someone already tried to drift it. They will not mention that in the ad.',bonusK:0,mileage:188000,oil:'oil_5w30',filter:'filter_nissan',obd2:true},
{id:'eclipsegst',make:'Mitsubishi',name:'1997 Mitsubishi Eclipse GS-T',price:3700,reliability:33,progress:41,trait:'Factory turbo, factory temptation',desc:'More performance potential and many more ways to turn money into smoke.',bonusK:0,mileage:165000,oil:'oil_5w30',filter:'filter_mitsu',obd2:true},
{id:'mustanggt',make:'Ford',name:'1996 Ford Mustang GT',price:3100,reliability:46,progress:34,trait:'V8 noise solves nothing',desc:'Simple enough to understand, old enough to have been launched badly many times.',bonusK:0,mileage:151000,oil:'oil_5w30',filter:'filter_ford',obd2:true}
];

const carGenerationMeta={
 civic:{year:1996,generation:'civic_ek',genStart:1996,genEnd:2000},
 civicex:{year:1998,generation:'civic_ek',genStart:1996,genEnd:2000},
 miata:{year:1996,generation:'miata_na',genStart:1990,genEnd:1997},
 eclipse:{year:1996,generation:'eclipse_2g',genStart:1995,genEnd:1999},
 eclipsegst:{year:1997,generation:'eclipse_2g',genStart:1995,genEnd:1999},
 integra:{year:1997,generation:'integra_dc2',genStart:1994,genEnd:2001},
 prelude:{year:1997,generation:'prelude_5g',genStart:1997,genEnd:2001},
 celica:{year:1997,generation:'celica_t200',genStart:1994,genEnd:1999},
 zx2:{year:1998,generation:'escort_zx2',genStart:1998,genEnd:2003},
 cavalier:{year:1998,generation:'cavalier_3g',genStart:1995,genEnd:2002},
 neon:{year:1997,generation:'neon_1g',genStart:1995,genEnd:1999},
 gti:{year:1997,generation:'golf_mk3',genStart:1995,genEnd:1998},
 bmw328:{year:1998,generation:'bmw_e36_328',genStart:1996,genEnd:1998},
 impreza:{year:1998,generation:'impreza_gc',genStart:1993,genEnd:2001},
 '240sx':{year:1997,generation:'240sx_s14',genStart:1995,genEnd:1998},
 mustanggt:{year:1996,generation:'mustang_sn95',genStart:1994,genEnd:1998}
};
for(const c of cars){
 const parsed=Number(String(c.name).slice(0,4))||1996;
 Object.assign(c,{year:parsed,generation:c.id,genStart:parsed,genEnd:parsed},carGenerationMeta[c.id]||{});
}
