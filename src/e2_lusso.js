/* ================= RICCHEZZA E LASCITO · ANIMALI · DA AMICI A INNAMORATI · ATTIVITÀ PER BENI ED ETÀ ================= */

/* ---------- Ricchezza: cosa fare quando i soldi non sono più un problema ----------
   S.lusso = {coll:{id:[{i,v}]}, donato (euro reali), fond (anno di nascita della fondazione), borse:[anni], onori:[], esp:{id:volte}} */
const LX=()=>S.lusso||(S.lusso={coll:{},donato:0,fond:null,borse:[],onori:[],esp:{}});
const COLLEZIONI=[
  {id:'arte',n:'Arte',d:'Quadri e sculture',var:[-.08,.14],pezzi:[['Un acquerello di un giovane pittore',2500],['Una litografia firmata di Miró',9000],['Una tela di un maestro del Novecento',60000],['Una scultura in bronzo di un grande nome',180000],['Un paesaggio metafisico di De Chirico',900000],['Un Modigliani passato per tre aste',4500000]]},
  {id:'auto',n:'Auto d\'epoca',d:'Da guardare più che da guidare',var:[-.05,.10],pezzi:[['Una Fiat 500 del 1968',9000],['Un\'Alfa Romeo Giulia GT',45000],['Una Lancia Fulvia HF',70000],['Una Porsche 911 del 1973',160000],['Una Mercedes «Ali di gabbiano»',1200000],['Una Ferrari 250 GTO',9000000]]},
  {id:'vino',n:'Cantina',d:'Bottiglie che non aprirai mai',var:[-.03,.09],pezzi:[['Una cassa di Barolo',600],['Sei Brunello di Montalcino Riserva',2000],['Una verticale di Sassicaia',9000],['Un Romanée-Conti del 1990',30000],['La cantina intera di un vecchio collezionista',150000],['La bottiglia più antica d\'Italia',400000]]},
  {id:'orologi',n:'Orologi',d:'Il tempo, ma costoso',var:[-.04,.08],pezzi:[['Uno Swatch introvabile',400],['Un Omega Speedmaster',7000],['Un Rolex Daytona',35000],['Un Patek Philippe Nautilus',120000],['Un orologio appartenuto a un re',600000],['Il pezzo unico di un orologiaio ginevrino',2500000]]}
];
function valoreCollezioni(X){X=X||S;const L=X.lusso;if(!L)return 0;let t=0;for(const k in L.coll)for(const x of L.coll[k])t+=x.v;return Math.round(t)}
const realeEur=x=>x/(S.mondo?S.mondo.ip:1);
const ONORI=[[100000,'Socio benemerito','Ti consegnano una targa da socio benemerito: finisce appesa in salotto, ben in vista.'],[1000000,'Cavaliere della Repubblica','Una lettera dal Quirinale: sei Cavaliere al merito della Repubblica.'],[10000000,'Commendatore','Il Presidente della Repubblica ti nomina Commendatore.']];
const CAUSE_BENEF=['la ricerca sul cancro','un ospedale pediatrico','il canile della tua città','le scuole di un villaggio in Africa','una mensa per chi non ha casa','la parrocchia del tuo paese','una casa famiglia','il restauro di una chiesa del Seicento'];
function dona(x){
  if(S.soldi<x)return ['Non hai abbastanza soldi.','x'];
  const L=LX(),prima=L.donato;soldi(-x);L.donato+=realeEur(x);
  const peso=Math.log10(Math.max(10,realeEur(x)));        // 1.000 € → 3 · 1 milione → 6
  S.karma=clamp(S.karma+Math.round(peso*1.5));mod('felicita',Math.round(peso));if(realeEur(x)>=100000)S.fama=clamp(S.fama+2);
  let t=`Doni ${eur(x)} per ${pick(CAUSE_BENEF)}. ${realeEur(x)>=100000?'I giornali locali ne parlano.':'Nessuno lo saprà, ed è giusto così.'}`;
  for(const [soglia,n,txt] of ONORI)if(prima<soglia&&L.donato>=soglia&&!L.onori.includes(n)&&(soglia<1000000||S.karma>=55)){L.onori.push(n);t+=' '+txt;mod('felicita',8)}
  return [t,'g'];
}
function annoLusso(){
  const L=S.lusso;if(!L)return;
  for(const c of COLLEZIONI)for(const x of (L.coll[c.id]||[]))x.v=Math.round(x.v*(1+S.mondo.infl+c.var[0]+Math.random()*(c.var[1]-c.var[0])));
  if(L.fond){S.karma=clamp(S.karma+2);mod('felicita',2);
    if(chance(.6))log(`La Fondazione ${S.cognome} ${varia('fond',['finanzia una mensa per chi non ha casa','paga cento borse di studio','restaura la biblioteca del tuo paese','apre un ambulatorio gratuito','compra un pulmino per un centro disabili','sostiene una ricerca sulle malattie rare'])}.`,'g')}
}
/* traguardi: obiettivi visibili per chi è ricco */
function traguardi(){
  const L=LX(),pr=realeEur(patrimonio());
  const complete=COLLEZIONI.filter(c=>(L.coll[c.id]||[]).length>=c.pezzi.length).length;
  const esp=Object.keys(L.esp).length;
  return [
    ['Primo milione','Un patrimonio di un milione di euro (di oggi)',pr>=1e6],
    ['Collezionista','Completa una collezione',complete>=1],
    ['Gran collezionista','Completa tutte e quattro le collezioni',complete>=4],
    ['Mecenate','Finanzia tre borse di studio',L.borse.length>=3],
    ['Filantropo','Dona in tutto un milione di euro',L.donato>=1e6],
    ['Fondatore','Crea una fondazione col tuo nome',!!L.fond],
    ['Ha visto tutto','Vivi cinque esperienze di lusso diverse',esp>=5],
    ['Commendatore','Ricevi la più alta onorificenza',L.onori.includes('Commendatore')]
  ];
}
function htmlRicchezza(){
  const L=LX();
  const visibile=patrimonio()>=P(200000)||L.donato>0||Object.keys(L.coll).length||L.fond;
  if(!visibile||S.eta<18)return '';
  const T=traguardi(),fatti=T.filter(x=>x[2]).length;
  let h=`<div class="sec"><span>Ricchezza e lascito</span><span>${fatti}/${T.length} traguardi</span></div><div class="panel">
    <div class="traguardi">${T.map(([n,d,ok])=>`<span class="tg${ok?' ok':''}" title="${esc(d)}">${ok?'✓ ':''}${esc(n)}</span>`).join('')}</div>
    <div class="meta">${esc(T.find(x=>!x[2])?'Prossimo: '+T.find(x=>!x[2])[1].toLowerCase()+'.':'Hai fatto tutto quello che i soldi possono fare. Quasi.')}</div></div>`;
  h+=`<div class="list">${COLLEZIONI.map(c=>{const ho=L.coll[c.id]||[],v=ho.reduce((s,x)=>s+x.v,0);
    return `<button class="person" data-coll="${c.id}"><span class="pa obj">${ho.length}/${c.pezzi.length}</span><span class="pi"><span class="pn">${esc(c.n)}</span><span class="pr">${ho.length?`Valore ${eur(v)}`:esc(c.d)}</span></span></button>`}).join('')}</div>`;
  h+=`<div class="panel" style="margin-top:10px">${kv('Donato in tutto',eur(L.donato*S.mondo.ip))}${L.onori.length?kv('Onorificenze',esc(L.onori.join(', '))):''}${L.fond?kv('Fondazione',`Fondazione ${esc(S.cognome)}, dal ${L.fond}`):''}${L.borse.length?kv('Borse di studio',L.borse.length):''}
    <div class="row-btns"><button class="chip pri" id="btnDona">Fai una donazione</button>${!L.fond?`<button class="chip" id="btnFond" ${S.soldi<P(1000000)?'disabled':''}>Crea una fondazione · ${eur(P(1000000))}</button>`:''}<button class="chip" id="btnBorsa" ${S.soldi<P(50000)||fatto('borsa')?'disabled':''}>${fatto('borsa')?attesa('borsa'):'Borsa di studio · '+eur(P(50000))}</button></div></div>`;
  return h;
}
function legaRicchezza(V){
  V.querySelectorAll('[data-coll]').forEach(b=>b.onclick=()=>apriCollezione(b.dataset.coll));
  const on=(id,fn)=>{const b=V.querySelector('#'+id);if(b)b.onclick=fn};
  on('btnDona',()=>{const tagli=[1000,10000,100000,1000000,10000000].map(P).filter(x=>x<=Math.max(S.soldi,P(1000)));
    showSheet({k:'Beneficenza',t:'Quanto vuoi donare?',p:'La causa la scegli tu col cuore; il gioco la sceglie a caso.',chiudi:true,scelte:tagli.map(x=>({l:eur(x),_incl:0,disabled:S.soldi<x,fx:()=>dona(x)}))})});
  on('btnFond',()=>showSheet({k:'Fondazione',t:`La Fondazione ${S.cognome}`,p:`Versi ${eur(P(1000000))} in una fondazione che porterà il tuo nome. Ogni anno finanzierà qualcosa di buono, anche dopo di te.`,chiudi:true,scelte:[
    {l:'Creala',_incl:0,fx:()=>{if(S.soldi<P(1000000))return ['Non hai abbastanza soldi.','x'];soldi(-P(1000000));const L=LX();L.fond=S.anno;L.donato+=1000000;S.karma=clamp(S.karma+10);S.fama=clamp(S.fama+4);mod('felicita',12);return [`Nasce la Fondazione ${S.cognome}. Al taglio del nastro c'è anche il sindaco.`,'g']}}]}));
  on('btnBorsa',()=>azione(una('borsa',P(50000),()=>{const L=LX();L.borse.push(S.anno);L.donato+=50000;S.karma=clamp(S.karma+4);mod('felicita',4);futuro(r(8,12),'borsa_grazie');
    return [`Istituisci una borsa di studio a tuo nome. La vince ${pick(['una ragazza di Crotone','un ragazzo di Bergamo','una studentessa di Sassari','uno studente di Avellino'])} che vuole fare ${pick(['il medico','l\'ingegnera','il ricercatore','la veterinaria','l\'architetto'])}.`,'g']},4)));
}
function apriCollezione(id){
  const c=COLLEZIONI.find(x=>x.id===id),L=LX(),ho=L.coll[id]||(L.coll[id]=[]);
  const prossimo=c.pezzi[ho.length];
  const sc=[];
  if(prossimo){const pz0=P(prossimo[1]);sc.push({l:`Compra: ${prossimo[0]}`,sub:eur(pz0),costo:pz0,_incl:0,fx:()=>{ho.push({i:ho.length,v:pz0});mod('felicita',ho.length===c.pezzi.length?10:3);
    if(ho.length===c.pezzi.length){S.fama=clamp(S.fama+3);return [`Collezione completa! Un museo ti chiede di esporla: «Collezione ${S.cognome}».`,'g']}return [`${prossimo[0]} è tuo. Ora sono ${ho.length} su ${c.pezzi.length}.`,'g']}})}
  if(ho.length)sc.push({l:'Vendi tutto all\'asta',sub:`Circa ${eur(ho.reduce((s,x)=>s+x.v,0)*.9)} dopo la commissione`,_incl:0,fx:()=>{const x=Math.round(ho.reduce((s,y)=>s+y.v,0)*.9);soldi(x);L.coll[id]=[];mod('felicita',-2);return [`All'asta incassi ${eur(x)}. Le pareti sembrano vuote.`,'']}});
  showSheet({k:`Collezione · ${ho.length}/${c.pezzi.length}`,t:c.n,p:(ho.length?ho.map(x=>`${c.pezzi[x.i][0]} · ${eur(x.v)}`).join('\n'):'Ancora niente.')+'\n\nIl valore dei pezzi cambia ogni anno, come all\'asta.',chiudi:true,scelte:sc});
}
/* Esperienze di lusso: ogni volta rendono un po' meno (ci si abitua a tutto) */
const ESPERIENZE=[
  {id:'chef',n:'Cena da uno chef tre stelle',costo:900,f:6,t:'Undici portate, una più piccola dell\'altra. Esci con fame e felice.'},
  {id:'montecarlo',n:'Weekend a Montecarlo',costo:12000,f:10,t:'Casinò, yacht e un caffè da 18 euro.'},
  {id:'safari',n:'Safari in Tanzania',costo:25000,f:14,o:3,t:'Un leone ti guarda dritto negli occhi. Poi sbadiglia.'},
  {id:'isola',n:'Un mese su un\'isola privata',costo:150000,f:18,t:'Nessuno per chilometri. Il terzo giorno ti manca perfino il traffico.'},
  {id:'concerto',n:'Concerto privato del tuo cantante preferito',costo:300000,f:20,t:'Canta solo per te e per i tuoi amici. Ti chiede pure come ti chiami.'},
  {id:'spazio',n:'Un volo nello spazio',costo:450000,f:28,o:4,t:'Dieci minuti senza peso e la Terra là sotto, tutta intera. Niente sarà più come prima.',una:1}
];
ATTIVITA.push(...ESPERIENZE.map(x=>({sez:'Lusso',id:'esp_'+x.id,n:x.n,d:x.una?'Una volta nella vita':'Ci si abitua a tutto',costo:x.costo,min:18,en:0,
  cond:()=>S.soldi>=P(x.costo)*.6&&!(x.una&&LX().esp[x.id]),fx:()=>{const L=LX(),v=L.esp[x.id]||0;L.esp[x.id]=v+1;const f=Math.max(1,Math.round(x.f*Math.pow(.6,v)));mod('felicita',f);S.bis.stress=clamp(S.bis.stress-10);
    const pr=x.o?' '+applicaPers({O:x.o}).trim():'';
    return [v===0?x.t+pr:`${x.t} ${v===1?'La seconda volta è bello, ma non come la prima.':'Ormai è quasi routine.'}`,'g']}})));

/* ---------- Attività che richiedono un bene ---------- */
const isBarca=v=>/Gommone|Barca|Yacht/.test(v.n);
const haMoto=()=>S.veicoli.some(v=>/Moto|Scooter/.test(v.n));
const haBarca=()=>S.veicoli.some(isBarca);
const haYacht=()=>S.veicoli.some(v=>/Yacht/.test(v.n));
const haGiardino=()=>{const c=casaMia();return !!c&&/giardino|Casale/.test(c.tipo)};
const casaPropria=()=>!['genitori','carcere','figlio'].includes(S.casa.tipo);
const conAmici=n=>{const A=vivi(['Amico']).slice(0,n||3);A.forEach(p=>{relD(p,r(4,8));p.ultimo=S.t});return A};
ATTIVITA.push(
  {sez:'Con quello che hai',id:'gita',n:'Gita fuori porta',d:'Serve un\'auto e la patente',costo:60,min:18,cond:()=>haAuto()&&S.patente,fx:()=>{eff({f:[3,6]});S.bis.stress=clamp(S.bis.stress-6);const pa=partnerAttuale();if(pa)relD(pa,4);return [pick(['Colline, una trattoria e il tramonto dal belvedere.','Un borgo medievale e una sagra trovata per caso.','Lago, gelato e due ore di coda al ritorno.']),'g']}},
  {sez:'Con quello che hai',id:'roadtrip',n:'Road trip di una settimana',d:'Auto, patente e tanta musica',costo:900,min:18,en:10,cond:()=>haAuto()&&S.patente,fx:()=>{eff({f:[8,12]});S.bis.stress=clamp(S.bis.stress-15);const A=conAmici(2);return [`Una settimana sulla costa${A.length?` con ${A.map(p=>p.nome).join(' e ')}`:''}: finestrini giù e playlist infinita.`,'g']}},
  {sez:'Con quello che hai',id:'moto',n:'Giro in moto sui passi',d:'Serve una moto',costo:30,min:16,cond:()=>haMoto(),fx:()=>{eff({f:[4,7]});if(chance(.04)){mod('salute',-8);return ['Una curva presa male. Qualche graffio, tanta paura.','b']}return ['Tornanti, aria fresca e un panino al rifugio.','g']}},
  {sez:'Con quello che hai',id:'barca',n:'Uscita in barca',d:'Serve una barca',costo:150,min:16,cond:()=>haBarca(),fx:()=>{eff({f:[6,9]});S.bis.stress=clamp(S.bis.stress-10);conAmici(2);return ['Un tuffo in una caletta dove arrivano solo le barche.','g']}},
  {sez:'Con quello che hai',id:'crociera_yacht',n:'Crociera sul tuo yacht',d:'Con gli amici, per una settimana',costo:6000,min:18,cond:()=>haYacht(),fx:()=>{eff({f:[10,14]});const A=conAmici(5);A.forEach(p=>relD(p,6));return ['Isole Eolie, aperitivo al tramonto, nessuno che vuole tornare a casa.','g']}},
  {sez:'Con quello che hai',id:'grigliata',n:'Grigliata in giardino',d:'Serve una casa col giardino',costo:80,min:18,cond:()=>haGiardino(),fx:()=>{eff({f:[4,7]});S.bis.soc=clamp(S.bis.soc+12);conAmici(4);return ['Fumo, risate e un vicino che si autoinvita.','g']}},
  {sez:'Con quello che hai',id:'festa',n:'Festa a casa tua',d:'Serve una casa tua (anche in affitto)',costo:150,min:18,en:10,cond:()=>casaPropria(),fx:()=>{eff({f:[4,8]});S.bis.soc=clamp(S.bis.soc+15);conAmici(5);if(chance(.15)){soldi(-P(200));return ['Gran festa. Il divano però non sarà più lo stesso.','']}return ['Musica, pizza e gente che non conoscevi in cucina alle tre.','g']}}
);
/* ---------- Attività secondo l'età ---------- */
ATTIVITA.push(
  {sez:'Per la tua età',id:'parco',n:'Parco giochi',d:'Scivolo e altalena',costo:0,min:2,max:9,en:4,fx:()=>{eff({f:[2,4]});S.bis.soc=clamp(S.bis.soc+6);return [pick(['Dieci volte sullo scivolo. Undici.','Conquisti la cima della struttura con le corde.','Fai amicizia con un bambino in cinque secondi, poi ve ne andate.']),'g']}},
  {sez:'Per la tua età',id:'pigiama',n:'Pigiama party',d:'Dormire da un amico (si fa per dire)',costo:0,min:7,max:13,en:8,cond:()=>vivi(['Amico']).length>0,fx:()=>{const a=pick(vivi(['Amico']));relD(a,8);a.ultimo=S.t;eff({f:[4,6]});return [`Da ${a.nome}: film dell'orrore, torcia sotto le coperte e alle tre ancora svegli.`,'g']}},
  {sez:'Per la tua età',id:'lunapark',n:'Luna park',d:'Zucchero filato e autoscontro',costo:20,min:5,max:15,en:6,fx:()=>{eff({f:[3,6]});return [pick(['Vinci un peluche enorme al tiro a segno. Non sai dove metterlo.','Le montagne russe: mai più. Anzi, ancora.','Autoscontro: tre incidenti, tutti voluti.']),'g']}},
  {sez:'Per la tua età',id:'salagiochi',n:'Sala giochi',d:'Gettoni e flipper',costo:10,min:11,max:19,en:4,fx:()=>{eff({f:[2,4]});return ['Record personale a un gioco di ballo. Nessuno ti ha vist'+g('o','a')+', per fortuna.','g']}},
  {sez:'Per la tua età',id:'concerto',n:'Concerto',d:'In piedi sotto il palco',costo:60,min:14,en:10,fx:()=>{eff({f:[5,8]});S.bis.soc=clamp(S.bis.soc+8);return [pick(['Canti tutte le canzoni. Il giorno dopo non hai voce.','Un concerto all\'aperto, sotto la pioggia. Il più bello di sempre.']),'g']}},
  {sez:'Per la tua età',id:'bocce',n:'Bocce al circolo',d:'Accosto e bocciata',costo:0,min:60,en:3,fx:()=>{eff({f:[2,4]});S.bis.soc=clamp(S.bis.soc+10);return [pick(['Vinci la partita e lo fai notare per tutta la settimana.','Discussione di venti minuti su un centimetro. Ha ragione l\'altro.']),'g']}},
  {sez:'Per la tua età',id:'liscio',n:'Ballo liscio',d:'Il sabato sera al centro anziani',costo:10,min:60,en:6,fx:()=>{eff({f:[3,6],s:1});S.bis.soc=clamp(S.bis.soc+10);if(single()&&chance(.12)){coda.unshift({e:EV.incontro,d:{x:'ballo'}});return null}return ['Valzer, mazurka e un cavaliere che pesta i piedi a tutti.'.replace('un cavaliere','qualcuno'),'g']}},
  {sez:'Per la tua età',id:'cantiere',n:'Guarda un cantiere',d:'Tradizione nazionale',costo:0,min:65,en:2,fx:()=>{eff({f:[1,3]});return ['Commenti i lavori con altri tre pensionati. Secondo te la gettata è venuta storta, e hai ragione.','g']}},
  {sez:'Per la tua età',id:'nipoti_parco',n:'Porta i nipoti al parco',d:'Gelato compreso',costo:10,min:50,en:6,cond:()=>vivi(['Nipote']).some(n=>n.eta<12),fx:()=>{vivi(['Nipote']).filter(n=>n.eta<12).forEach(n=>{relD(n,8);n.ultimo=S.t});eff({f:[4,7]});return ['Gelato prima di pranzo: è un segreto tra voi.','g']}}
);

/* ---------- Animali: legame, pappa e cure ----------
   a = {id,t,nome,eta,max,leg (legame 0–100),sal (salute),pappa (mesi da quando gli hai dato da mangiare tu)} */
function initAnimale(a){if(!a.id)a.id=S.nextId++;if(a.leg===undefined)a.leg=r(45,65);if(a.sal===undefined)a.sal=100;if(a.pappa===undefined)a.pappa=0;return a}
function nomeAnimale(A){const usati=new Set(S.animali.map(a=>a.nome));const liberi=A.nomi.filter(n=>!usati.has(n));return liberi.length?pick(liberi):pick(A.nomi)+' '+['II','junior','bis'][r(0,2)]}
const qualcunoACasa=()=>S.casa.tipo==='genitori'||convivente()||vivi(['Figlio']).some(f=>!f.fuori&&f.eta>=10);
function meseAnimali(){
  for(const a of S.animali){
    initAnimale(a);
    a.m=(a.m||0)+1;if(a.m%12===0)a.eta++;
    a.pappa++;a.leg=clamp(a.leg-passo(.6));
    if(a.pappa>=2){
      if(qualcunoACasa()){a.leg=clamp(a.leg-2);if(a.pappa===2&&chance(.5))log(`Ci pensa qualcun altro a dare da mangiare a ${a.nome}. Ti guarda come per dire «e tu dov'eri?».`,'h')}
      else{a.sal=clamp(a.sal-12);a.leg=clamp(a.leg-6);if(a.pappa===2)log(`${a.nome} ha la ciotola vuota da giorni e ti segue per casa${a.t==='Gatto'?' miagolando':a.t==='Cane'?' guaendo':''}.`,'b');S.karma=clamp(S.karma-1)}
    }else a.sal=clamp(a.sal+3);
    if(a.sal<=30&&chance(.25)){a.morto=true;S.karma=clamp(S.karma-8);mod('felicita',-8);pesa(6,3);log(`${a.nome} si ammala per l'incuria e non ce la fa. Il veterinario non dice niente, ma il suo sguardo basta.`,'b');continue}
    if(a.leg<=8&&chance(.15)){a.morto=true;mod('felicita',-5);log(`${a.nome} scappa e non torna più. Forse ha trovato qualcuno che lo coccola di più.`,'b');continue}
    if(a.eta>a.max&&chance(.045)){a.morto=true;mod('felicita',-(6+Math.round(a.leg/10)));pesa(Math.round(3+a.leg/12),3);log(`${a.nome}, il tuo ${a.t.toLowerCase()}, se n'è andato a ${a.eta} anni.${a.leg>=70?' Eravate inseparabili.':''}`,'b')}
  }
  S.animali=S.animali.filter(a=>!a.morto);
}
const legameAnimali=()=>S.animali.reduce((s,a)=>s+1+(a.leg||50)/50,0);
const VERSI={Cane:['Si mangia la pappa in quattro secondi e ti guarda come per dire «tutto qui?».','Scodinzola così forte che si sbilancia.'],Gatto:['Annusa la pappa, ti guarda, se ne va. Torna dieci minuti dopo e la finisce.','Fa le fusa contro le tue caviglie per tutta la cena.'],Coniglio:['Sgranocchia una carota con impegno professionale.','Fa un saltello di gioia, detto binky. Te lo sei cercato su internet.'],Pappagallo:['Mangia i semi e ripete «buono!» con la tua voce.','Ti ringrazia fischiettando la sigla del telegiornale.']};
function apriAnimale(i){
  const a=S.animali[i];if(!a)return;initAnimale(a);
  const k=a.id,sc=[];
  sc.push({l:`Dai da mangiare a ${a.nome}`,sub:a.pappa>=1?'Ha fame':'Ha già mangiato questo mese',_incl:0,disabled:fatto('pap'+k),fx:una('pap'+k,0,()=>{a.pappa=0;a.leg=clamp(a.leg+3);a.sal=clamp(a.sal+5);return [pick(VERSI[a.t]||VERSI.Cane),'g']},1)});
  sc.push({l:`Gioca con ${a.nome}`,_incl:0,disabled:fatto('anim'+k),fx:una('anim'+k,0,()=>{a.leg=clamp(a.leg+6);mod('felicita',3+Math.round(a.leg/40));return [`${a.nome} non sta più nella pelle.`,'g']})});
  if(a.t==='Cane')sc.push({l:'Portalo a spasso',_incl:0,disabled:fatto('spasso'+k),fx:una('spasso'+k,0,()=>{a.leg=clamp(a.leg+5);S.bis.forma=clamp(S.bis.forma+3);S.bis.stress=clamp(S.bis.stress-4);if(chance(.15)){const c=candidatoAmico();c.eta=candidatoEta();const n=nuovoConoscente(c,'al parco dei cani');return [`Al parco ${a.nome} fa amicizia con un altro cane, e tu con ${n.nome}.`,'g']}return ['Un\'ora al parco: lui torna stanco, tu più seren'+g('o','a')+'.','g']},4)});
  if(a.t==='Gatto'||a.t==='Coniglio')sc.push({l:'Coccole sul divano',_incl:0,disabled:fatto('coc'+k),fx:una('coc'+k,0,()=>{a.leg=clamp(a.leg+5);S.bis.stress=clamp(S.bis.stress-5);return [a.t==='Gatto'?'Ti si addormenta in grembo. Non puoi più alzarti, è la legge.':'Si lascia accarezzare le orecchie a occhi chiusi.','g']})});
  if(a.t==='Pappagallo')sc.push({l:'Insegnagli una parola',_incl:0,disabled:fatto('par'+k),fx:una('par'+k,0,()=>{a.leg=clamp(a.leg+4);const w=pick(['«ciao bello»','il tuo nome','«pronto?» con la suoneria del telefono','una parolaccia (non da te, giuri)']);return [`${a.nome} impara ${w}.`,'g']})});
  sc.push({l:'Portalo dal veterinario',sub:eur(P(80)),costo:P(80),_incl:0,disabled:a.sal>=95||fatto('vet'+k),fx:una('vet'+k,0,()=>{a.sal=100;return ['Vaccini, controllo e un biscotto. Sta benissimo.','g']})});
  sc.push({l:'Dallo in adozione',_incl:0,fx:()=>{S.animali=S.animali.filter(x=>x!==a);mod('felicita',-(4+Math.round(a.leg/20)));S.karma=clamp(S.karma-2);return [`${a.nome} va a vivere con un'altra famiglia.`,'b']}});
  const stato=a.sal<50?'non sta bene':a.pappa>=1?'ha fame':'sta bene';
  showSheet({k:`${a.t} · ${a.eta} ${a.eta===1?'anno':'anni'}`,t:a.nome,p:`Legame ${a.leg}% · salute ${a.sal}% · ${stato}.\nDagli da mangiare ogni mese: se vivi da sol${g('o','a')} e te ne dimentichi, si ammala.`,chiudi:true,scelte:sc});
}

/* ---------- Da amici a innamorati ---------- */
const attratto=p=>S.attrazione==='E'||S.attrazione===p.sesso||(!S.attrazione&&p.sesso!==S.sesso);
function ricambia(p){if(!p.orient)p.orient=pesata([['etero',88],['omo',6],['bi',6]]);return p.orient==='bi'||(p.orient==='etero'?p.sesso!==S.sesso:p.sesso===S.sesso)}
function etaCompatibile(p){const d=Math.abs(p.eta-S.eta);if(S.eta<14||p.eta<14)return false;if(S.eta<18||p.eta<18)return d<=3;return d<=15}
const amorePossibile=p=>p.ruolo==='Amico'&&single()&&attratto(p)&&etaCompatibile(p);
function diventaPartner(p){
  p.ruolo='Partner';p.best=false;p.dal=S.t;p.conv=false;
  p.intim=clamp(p.rapporto-5);p.pass=r(55,80);p.imp=r(35,55);p.rapporto=clamp(p.rapporto+5);p.ultimo=S.t;
  ricorda(p,'Da amici a qualcosa di più');orePartnerAuto();mod('felicita',10);
}
function dichiarati(p){
  const ok=ricambia(p)?.15+(p.rapporto-50)/110+(affinita(p)-50)/200+(S.aspetto-50)/300+pz('E')*.05:.03;
  if(chance(Math.max(.03,Math.min(.85,ok)))){diventaPartner(p);return [`${p.nome} resta in silenzio, poi sorride: «Ci pensavo anch'io da tanto». Ora state insieme.`,'g']}
  relD(p,-12);mod('felicita',-5);pesa(5,2);
  return [pick([`${p.nome} ti abbraccia: «Ti voglio bene, ma come amic${g('o','a')}». Per qualche settimana è tutto un po' strano.`,`${p.nome} arrossisce e cambia discorso. La prossima volta che vi vedete fate finta di niente.`]),'b'];
}
ev({id:'amico_confessa',min:15,max:70,w:.6,rip:6,chi:['Amico'],pc:p=>p.rapporto>=70&&amorePossibile(p)&&ricambia(p),cond:()=>single(),t:'Una confessione',
  x:d=>`${d.p.nome} ti guarda in modo strano da qualche tempo. Stasera, dopo una birra di troppo${S.eta<18?' (anzi, un succo)':''}, te lo dice: «Credo di essermi innamorat${gp(d.p,'o','a')} di te».`,c:[
  {l:'Anche tu provi lo stesso',fx:d=>{diventaPartner(d.p);return [`Il primo bacio arriva goffo e perfetto. Tu e ${d.p.nome} ora state insieme.`,'g']}},
  {l:'Hai bisogno di tempo',fx:d=>{relD(d.p,-3);return [`${d.p.nome} dice che aspetterà. Per ora restate amici, con un pensiero in più.`,'']}},
  {l:'Per te è solo amicizia',fx:d=>{relD(d.p,-15);pesa(3,1);return [`${d.p.nome} annuisce e dice che va bene. Non va benissimo.`,'b']}}]});
ev({id:'borsa_grazie',link:1,t:'Una lettera',x:()=>`Ti arriva una lettera scritta a mano: «Ho potuto studiare grazie alla sua borsa di studio. Oggi sono ${pick(['medico','ingegnere','ricercatrice','insegnante','veterinaria'])}. Volevo che lo sapesse.»`,auto:{e:{f:8,k:2},r:'Una lettera scritta a mano: chi ha studiato grazie alla tua borsa di studio ti ringrazia. La rileggi tre volte.',k:'g'}});
