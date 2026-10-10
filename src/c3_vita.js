/* ================= VITA REALE: TEMPO, CARATTERE, ROUTINE, BISOGNI ================= */
const MESE=i=>cap(MESI[i]);
/* Testi vari: evita di ripetere le ultime frasi usate per la stessa situazione */
function varia(k,L){
  if(!S)return pick(L);
  L=soloEpoca(L);const V=S.fatti._v||(S.fatti._v={});const u=V[k]||[];
  const lib=L.map((_,i)=>i).filter(i=>!u.includes(i));const i=lib.length?pick(lib):r(0,L.length-1);
  u.push(i);while(u.length>Math.min(L.length-1,Math.ceil(L.length*.7)))u.shift();V[k]=u;return L[i];
}
const TESTI={
  natale:['Natale in famiglia: pranzo di quattro ore e tombola.','Natale tranquillo, tra regali e panettone.','La vigilia la passi a incartare regali all\'ultimo minuto.','A Natale tuo zio racconta per la decima volta la stessa barzelletta.','Natale con la neve: a Santo Stefano si esce solo per gli avanzi.','Il pandoro vince sul panettone, come ogni anno. Discussione infinita.','Regali riciclati, cappelli di Babbo Natale e una partita a carte fino a notte.','Per Natale qualcuno porta il cane, che si mangia mezzo arrosto.','Un Natale più piccolo del solito, ma caldo.','Vigilia di pesce, Natale di carne, Santo Stefano di avanzi.','Il presepe quest\'anno ha un dinosauro tra i pastori.','Natale passato tra telefonate di auguri e film già visti.'],
  estateB:['Estate dai nonni, tra bicicletta e ghiaccioli.','Un mese al mare con la famiglia.','Centro estivo: giochi, piscina e nuovi amici.','Estate in città, a giocare in cortile fino a sera.','Campeggio in tenda con i tuoi: piove tre giorni su sette.','Impari a nuotare senza braccioli.','Un\'estate intera a costruire una capanna nel bosco con i cugini.','Settimana in montagna: le prime vesciche e la prima marmotta.','Estate al lago: ti punge una vespa e diventa una leggenda di famiglia.','Collezioni conchiglie, sassi e figurine. Soprattutto figurine.'],
  scuola:['Ricomincia la scuola.','Primo giorno dopo l\'estate: zaino nuovo, stessi compagni.','Settembre: si torna in classe.','Nuovo anno scolastico, nuovi professori, stessi banchi scomodi.','Il primo giorno di scuola ti siedi vicino a qualcuno di nuovo.','Diario nuovo, buone intenzioni nuove.','Settembre: compiti delle vacanze fatti la sera prima, come sempre.'],
  anticipo:['Consegni tutto in anticipo e il capo lo nota.','Metti ordine in un progetto che tutti avevano abbandonato.','Prepari una presentazione impeccabile. Il capo la usa come esempio.','Trovi un errore nei conti che avrebbe fatto perdere un cliente.','Chiudi la settimana con la scrivania vuota. Rarissimo.'],
  curioso:['Ti appassioni a un genere musicale che non avevi mai ascoltato.','Divori una serie di documentari sullo spazio.','Ti metti a imparare qualche parola di giapponese, per curiosità.','Scopri un piccolo museo in città e ci torni tre volte.','Leggi tutto quello che trovi sui funghi. Non si sa perché.','Ti iscrivi a un corso online di astronomia.','Provi a cucinare un piatto etiope. Incredibilmente, è buono.','Passi un pomeriggio intero in una libreria dell\'usato.'],
  mare:['Sole, focacce e bagni fino al tramonto.','Una settimana in Salento: acqua trasparente e pizzica fino a tardi.','Sardegna: spiagge bianche e un\'insolazione memorabile.','Riviera romagnola: piadine, ombrelloni in fila e balli di gruppo.','Isola d\'Elba in campeggio: zanzare e tramonti.','Costiera amalfitana: scale, limoni e panorami che non dimentichi.','Sicilia: granite a colazione e il mare più blu che hai visto.','Cinque Terre a piedi, con lo zaino e il mare sempre sotto.'],
  monti:['Camminate, aria fresca e polenta in rifugio.','Dolomiti: un\'alba dal rifugio che vale la sveglia alle quattro.','Valle d\'Aosta: un sentiero sbagliato e un panorama giusto.','Una settimana in Trentino tra laghi gelati e malghe.','Abruzzo: un orso visto da lontano, per fortuna.','Sila: boschi, funghi e silenzio.','Alto Adige: canederli, bici e un temporale improvviso.'],
  estero:['Lisbona, Porto e un tram che non dimenticherai.','Atene e le isole: traghetti e tramonti.','Un giro della Scozia in auto, sotto la pioggia.','Parigi: musei, crêpe e piedi distrutti.','Barcellona: Gaudí, tapas e una notte sulla spiaggia.','Islanda: geyser, cascate e prezzi folli.','New York: grattacieli, hot dog e jet lag.','Marocco: mercati, spezie e una notte nel deserto.','Croazia in barca: isole, sole e cicale.','Berlino: muri, storia e locali aperti fino all\'alba.','Giappone: templi, treni puntuali e ramen ogni sera.','Vienna e Praga in treno, tra caffè e castelli.'],
  casa:['La città vuota è tutta tua.','Divano, gelato e serie TV: ferie a chilometro zero.','Pomeriggi in piscina comunale e serate in terrazzo.','Sistemi finalmente la cantina. Trovi cose degli anni Novanta.','Gite in giornata e notti a dormire tanto.'],
  regalo:['Hai centrato il regalo.','Il regalo è perfetto: lo usa subito.','Un regalo semplice, ma pensato. Si vede.','Un libro con una dedica scritta a mano: commozione.','Lo apre e ride: avete lo stesso senso dell\'umorismo.'],
  messaggio:['Un messaggio con tre emoji.','Un vocale di auguri di quaranta secondi.','Auguri scritti in fretta, ma arrivati.','Una foto vecchia di voi due con scritto «auguri!».'],
  serata:['Una bella serata.','Si fa tardi senza accorgersene.','Ridete come non facevate da mesi.','Una serata semplice, proprio quella che serviva.','Torni a casa con il mal di pancia dal ridere.']
};
const dataStr=()=>`${MESE(S.mese)} ${S.anno}`;
const pz=k=>((S.pers?S.pers[k]:50)-50)/50;            // -1..1
const ppz=(p,k)=>(((p&&p.pers)?p.pers[k]:50)-50)/50;

/* ---------- Carattere (Big Five) ---------- */
const B5=[
  {k:'O',n:'Apertura mentale',lo:[['Concreto','Concreta'],['Abitudinario','Abitudinaria']],hi:[['Curioso','Curiosa'],['Creativo','Creativa']],dlo:'Preferisce abitudini, cose pratiche e certezze.',dhi:'Cerca idee nuove, arte, viaggi e cambiamenti.'},
  {k:'C',n:'Coscienziosità',lo:[['Spontaneo','Spontanea'],['Disordinato','Disordinata']],hi:[['Organizzato','Organizzata'],['Disciplinato','Disciplinata']],dlo:'Vive alla giornata: rimanda, improvvisa, cede alle tentazioni.',dhi:'Pianifica, mantiene gli impegni e resiste alle tentazioni.'},
  {k:'E',n:'Estroversione',lo:[['Riservato','Riservata'],['Introverso','Introversa']],hi:[['Socievole','Socievole'],['Estroverso','Estroversa']],dlo:'Si ricarica da solo: troppa gente lo stanca.',dhi:'Si ricarica stando con gli altri: la solitudine lo spegne.'},
  {k:'A',n:'Amicalità',lo:[['Diretto','Diretta'],['Competitivo','Competitiva']],hi:[['Gentile','Gentile'],['Altruista','Altruista']],dlo:'Dice quello che pensa, difende i propri interessi, litiga più facilmente.',dhi:'Evita i conflitti, aiuta gli altri, perdona facilmente.'},
  {k:'N',n:'Emotività',lo:[['Calmo','Calma'],['Stabile','Stabile']],hi:[['Sensibile','Sensibile'],['Ansioso','Ansiosa']],dlo:'Regge bene lo stress e torna in fretta di buon umore.',dhi:'Sente tutto più forte: lo stress e le delusioni pesano di più.'}
];
function nuovoCarattere(genitori){
  const p={};
  for(const {k} of B5){
    const g0=(genitori||[]).filter(x=>x&&x.pers);
    const m=g0.length?g0.reduce((s,x)=>s+x.pers[k],0)/g0.length:50;
    p[k]=clamp(50+(m-50)*.45+gauss()*15,3,97);
  }
  return p;
}
function trDaPers(p){
  const c=[[TR.GENEROSO,(p.A-50)*.8+(p.E-50)*.2],[TR.GELOSO,(p.N-50)*.8-(p.A-50)*.3],[TR.DIVERTENTE,(p.E-50)*.9+(p.O-50)*.2],[TR.AMBIZIOSO,(p.C-50)*.8+(p.E-50)*.2-(p.A-50)*.2],[TR.PIGRO,-(p.C-50)*.9],[TR.PREMUROSO,(p.A-50)*.7+(p.C-50)*.3],[TR.LUNATICO,(p.N-50)*.9],[TR.TESTARDO,-(p.A-50)*.5+(p.C-50)*.3-(p.O-50)*.3],[TR.TIMIDO,-(p.E-50)*.8+(p.N-50)*.3],[TR.AVVENTUROSO,(p.O-50)*.6+(p.E-50)*.5],[TR.LEALE,(p.A-50)*.5+(p.C-50)*.5],[TR.EGOISTA,-(p.A-50)*.9]];
  return c.map(([i,v])=>[i,v+gauss()*5]).sort((a,b)=>b[1]-a[1])[0][0];
}
function persDaTr(tr){
  const p={O:r(30,70),C:r(30,70),E:r(30,70),A:r(30,70),N:r(30,70)};
  const sp={[TR.GENEROSO]:{A:25},[TR.GELOSO]:{N:25,A:-10},[TR.DIVERTENTE]:{E:25},[TR.AMBIZIOSO]:{C:22,E:8},[TR.PIGRO]:{C:-28},[TR.PREMUROSO]:{A:20,C:10},[TR.LUNATICO]:{N:28},[TR.TESTARDO]:{A:-15,O:-12},[TR.TIMIDO]:{E:-25,N:10},[TR.AVVENTUROSO]:{O:20,E:15},[TR.LEALE]:{A:15,C:15},[TR.EGOISTA]:{A:-28}}[tr]||{};
  for(const k in sp)p[k]=clamp(p[k]+sp[k],3,97);
  return p;
}
function aggettivi(p,ses,n){
  n=n||2;const f=ses==='F'?1:0;
  return B5.map(b=>[b,(p[b.k]-50)]).filter(([,v])=>Math.abs(v)>=12).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,n)
    .map(([b,v])=>(v>0?b.hi:b.lo)[Math.abs(v)>28?1:0][f].toLowerCase());
}
function descrPers(p,ses){const a=aggettivi(p,ses,2);return a.length?a.join(', '):(ses==='F'?'equilibrata':'equilibrato')}
// il carattere si tiene con i decimali: clamp() arrotonda e farebbe sparire i piccoli cambiamenti (maturazione, rientro)
const clampF=(v,lo,hi)=>Math.round(Math.max(lo,Math.min(hi,v))*100)/100;
function cambiaPers(k,d){if(!S.pers)return;const v0=S.pers[k];S.pers[k]=clampF(v0+d,2,98);if(causaPers&&S.pers[k]!==v0)segnaCausa(k,S.pers[k]-v0)}
/* Quanto il carattere si lascia plasmare dalle esperienze: tanto da bambini, sempre meno (ma mai zero) da adulti */
const plasticita=e=>e<7?1.5:e<13?1.2:e<18?.8:e<30?.6:e<50?.45:e<70?.35:.3;
/* Le svolte: cosa ha cambiato il carattere (eventi, esperienze), per la scheda Carattere */
let causaPers=null;
function conCausa(c,fn){const old=causaPers;causaPers=old||c||null;try{return fn()}finally{causaPers=old}}
function segnaCausa(k,d){
  const L=S.persSegni=S.persSegni||[];
  let x=L[L.length-1];
  if(!x||x.t!==S.t||x.c!==causaPers){x={t:S.t,eta:S.eta,c:causaPers,d:{}};L.push(x)}
  x.d[k]=Math.round(((x.d[k]||0)+d)*10)/10;
  if(L.length>90)L.splice(0,L.length-90);
}
function fotoCarattere(){
  const H=S.persStoria=S.persStoria||[];
  if(H.some(h=>h.eta===S.eta))return;
  const p={};for(const {k} of B5)p[k]=Math.round(S.pers[k]);H.push({eta:S.eta,p});
}
/* Da adulti il carattere ha un punto di equilibrio (S.persBase): le esperienze lo spostano subito,
   poi ogni anno rientra del 6% verso l'equilibrio, mentre l'equilibrio si avvicina del 2% a come sei.
   Così un lutto ti rende più fragile per qualche anno e ne resta circa un quarto; scelte ripetute cambiano davvero chi sei. */
const RIENTRO=.06,ASSESTA=.02;
function maturazione(){
  const e=S.eta;
  const matura=(k,d)=>{cambiaPers(k,d);if(S.persBase)S.persBase[k]=clampF(S.persBase[k]+d,2,98)};
  if(e>=18&&e<=40){matura('C',r(0,2)*.25+.25);matura('A',.2);matura('N',-.45)}
  else if(e>40&&e<=65){matura('A',.15);matura('N',-.2)}
  else if(e>70){matura('O',-.4);matura('E',-.3)}
  if(e>=12&&e<=17){cambiaPers('N',r(-1,2));cambiaPers('C',r(-2,1))}
  for(const {k} of B5)cambiaPers(k,gauss()*.8);
  if(e>=18){
    if(!S.persBase){S.persBase={...S.pers};return}
    for(const {k} of B5){const p=S.pers[k],b=S.persBase[k];S.pers[k]=clampF(p+(b-p)*RIENTRO,2,98);S.persBase[k]=clampF(b+(p-b)*ASSESTA,2,98)}
  }
}
/* Esperienze che cambiano il carattere */
const SEGNA_X={viaggio:()=>{S.fatti.viaggi=(S.fatti.viaggi||0)+1}};
const SEGNA={lutto:{N:2},carcere:{N:4,A:-2},divorzio:{N:3},licenziato:{N:2,C:-1},laurea:{C:2,O:1},promozione:{N:-1,C:1},matrimonio:{N:-2,A:1},figlio:{C:2,A:1},terapia:{N:-5},viaggio:{O:.4},volontariato:{A:.5},burnout:{N:3},solitudine:{N:2,E:-1}};
function cambioPers(k,v){const f=S.sesso==='F';return {O:v>0?(f?'curiosa':'curioso'):(f?'abitudinaria':'abitudinario'),C:v>0?'responsabile':(f?'spontanea':'spontaneo'),E:v>0?'socievole':(f?'riservata':'riservato'),A:v>0?'gentile':(f?'combattiva':'combattivo'),N:v>0?'sensibile':(f?'sicura di sé':'sicuro di sé')}[k]}
const SEGNA_N={lutto:'Un lutto',carcere:'Il carcere',divorzio:'Una separazione',licenziato:'Il licenziamento',laurea:'La laurea',promozione:'Una promozione',matrimonio:'Il matrimonio',figlio:'Diventare genitore',terapia:'La terapia',viaggio:'Un viaggio',volontariato:'Il volontariato',burnout:'Il burnout',solitudine:'La solitudine'};
function segnaVita(t){if(SEGNA_X[t])SEGNA_X[t]();const s=SEGNA[t];if(!s||!S.pers)return;conCausa(SEGNA_N[t],()=>{for(const k in s)cambiaPers(k,s[k])})}

/* ---------- Attaccamento ---------- */
const ATTACCAMENTI={
  sicuro:{n:'Sicuro',d:'Si fida degli altri e sta bene sia in coppia sia da solo.'},
  ansioso:{n:'Ansioso',d:'Teme di essere lasciato: in amore è più geloso e soffre di più le distanze.'},
  evitante:{n:'Evitante',d:'Tiene le distanze: fatica a impegnarsi e a chiedere aiuto.'},
  timoroso:{n:'Timoroso',d:'Desidera vicinanza ma ne ha paura: relazioni intense e altalenanti.'}
};
function formaAttaccamento(){
  const gen=S.relazioni.filter(p=>['Madre','Padre','Patrigno'].includes(p.ruolo)&&p.vivo);
  const calore=gen.length?gen.reduce((s,p)=>s+p.rapporto,0)/gen.length:35;
  const conf=(S.fatti.genitoriSeparati?1:0)+(S.fatti.famigliaDifficile?1:0)+(gen.length<2?1:0);
  const ans=(S.pers.N-50)*.6+(78-calore)*.5+conf*12+gauss()*13;
  const evi=(50-S.pers.E)*.35+(78-calore)*.4+(50-S.pers.A)*.25+conf*6+gauss()*13;
  const TA=9,TE=3;   // soglie tarate sulla distribuzione reale (vedi ANALISI.md)
  S.att=ans<TA&&evi<TE?'sicuro':ans>=TA&&evi<TE?'ansioso':evi>=TE&&ans<TA?'evitante':'timoroso';
}

/* ---------- Interessi (RIASEC di Holland) ---------- */
const RIASEC={R:'Pratico',I:'Investigativo',A:'Artistico',S:'Sociale',E:'Intraprendente',C:'Convenzionale'};
const JOB_RIASEC={colf:'RC',badante:'SR',bracc:'RC',idra:'RI',elet:'RI',mecc:'RI',fale:'RA',pane:'RC',past:'RA',macel:'RE',camion:'RC',cass:'CE',puli:'RC',callc:'CS',segr:'CS',este:'SA',edu:'SA',maes:'SA',cara:'RS',mil:'RE',gdf:'CE',post:'RC',taxi:'RE',guida:'SE',anim:'ES',bagn:'RS',hostess:'SE',pilota:'RI',vet:'IS',dent:'IR',fisio:'SR',notaio:'CE',magis:'IE',agcom:'EC',ds:'IC',poli:'ES',volley:'RS',cicl:'RE',tennis:'RE',vol:'RC',rip:'SI',bpt:'SE',cpt:'EC',rider:'RE',cam:'SE',com:'EC',mag:'RC',ope:'RC',mur:'RC',aut:'RC',oss:'SR',cuoco:'RA',parr:'AS',pt:'SR',imp:'CE',rec:'SC',tec:'IR',agi:'EC',gra:'AI',pol:'RS',vvf:'RS',comu:'CS',ins:'SA',inf:'SI',pro:'IC',gio:'AI',mkt:'EA',cons:'EC',comm:'CE',avv:'ES',psi:'SI',ing:'IR',arc:'AI',far:'IC',bio:'IR',med:'IS',ric:'IA',man:'ES',mus:'AE',crea:'AE',calc:'RE',att:'AE'};
function interessi(X){
  X=X||S;const p=X.pers,a=X.abil;
  const s={R:28+a.sport*.3+a.cucina*.25+(50-p.O)*.15,I:24+X.intelligenza*.3+p.O*.2+a.tech*.25,A:22+p.O*.3+a.arte*.3+a.musica*.3,S:24+p.A*.32+p.E*.18,E:24+p.E*.3+(100-p.A)*.12+p.C*.1,C:26+p.C*.36+(100-p.O)*.15+a.tech*.05};
  return Object.entries(s).sort((x,y)=>y[1]-x[1]);
}
const codiceRiasec=()=>interessi().slice(0,3).map(x=>x[0]).join('');
function matchLavoro(id){
  const c=JOB_RIASEC[id]||'C',top=interessi().map(x=>x[0]);
  const i0=top.indexOf(c[0]),i1=top.indexOf(c[1]||c[0]);
  return Math.round(100-i0*14-i1*6);   // 100 = perfetto, ~30 = lontanissimo
}
function soddLavoro(){
  const L=S.lavoro;if(!L)return 50;
  const j=JOB[L.id];
  const m=matchLavoro(L.id);
  const paga=Math.min(25,netto(L.stip)/P(1000));
  return clamp(m*.55+paga+(L.perf-50)*.2+(L.liv*3)-(S.fatti.capoCattivo?15:0));
}

/* ---------- Routine settimanale ---------- */
const ATT_R=[
  {id:'sport',n:'Sport e movimento',d:'Forma fisica, salute, meno stress',min:4},
  {id:'amici',n:'Amici',d:'Rapporti con gli amici, socialità',min:5},
  {id:'famiglia',n:'Famiglia',d:'Genitori, fratelli, nonni',min:0},
  {id:'partner',n:'Partner',d:'Intimità e complicità di coppia',min:14,cond:()=>!!partnerAttuale()},
  {id:'figli',n:'Figli',d:'Rapporto e crescita dei figli',min:16,cond:()=>vivi(['Figlio']).some(p=>p.eta<18&&!p.fuori)},
  {id:'hobby',n:'Hobby',d:'Allena l\'abilità della tua attività',min:4,cond:()=>!!S.hobby},
  {id:'studio',n:'Studio',d:'Voti, intelletto',min:6},
  {id:'uscite',n:'Uscite e locali',d:'Divertimento e nuove conoscenze, costa',min:14},
  {id:'schermi',n:'Videogiochi e serie',d:'Svago facile, poco altro',min:5},
  {id:'social',n:'Social network',d:'Fa crescere i follower',min:14,cond:()=>S.social.attivo},
  {id:'extra',n:'Lavoro extra',d:'Straordinari o lavoretti: soldi in più',min:15},
  {id:'volont',n:'Volontariato',d:'Karma, senso di utilità, persone nuove',min:14}
];
function nomeAttR(a){
  if(a.id==='studio')return iscritto()?'Studio e compiti':'Lettura e studio personale';
  if(a.id==='extra')return S.lavoro&&!JOB[S.lavoro.id].pt?'Straordinari':'Lavoretti';
  return a.n;
}
function attDisponibile(a){return S.eta>=a.min&&(!a.cond||a.cond())&&S.carcere===0&&!fuoriEpoca(a.n||'')}
function sonnoDefault(e){return e<6?11:e<13?10:e<18?8.5:e<65?7.5:7.5}
function routineDefault(){
  const e=S.eta,R={};
  if(e<6)return R;
  if(e<14)return {sport:3,amici:5,famiglia:8,studio:5,schermi:6};
  if(e<19)return {sport:4,amici:7,famiglia:4,studio:8,schermi:8,uscite:3};
  return {sport:2,amici:5,famiglia:3,studio:1,schermi:7,uscite:3};
}
function oreScuola(){
  const s=S.scuola.stato;
  return {asilo:25,elementari:28,medie:30,superiori:30,serale:14,universita:18,magistrale:18,dottorato:38,master:22,its:24,spec:42}[s]||0;
}
function oreLavoro(){
  const L=S.lavoro;if(!L)return 0;const j=JOB[L.id];
  if(j.pt)return 18;
  const h=(j.ore||40)+(['med','man','cuoco','avv','spec','calc','dent','vet','notaio','magis','poli'].includes(L.id)?6:0)+(L.liv>=2&&!j.conc?3:0);
  return L.ptv?Math.round(h*.6):h;
}
function obblighi(){
  const o=[];const e=S.eta;
  if(S.carcere>0)return [['Sonno',S.sonno*7],['Vita in carcere',100]];
  o.push(['Sonno',Math.round(S.sonno*7)]);
  const sc=oreScuola();if(sc)o.push([S.scuola.stato==='asilo'?'Scuola dell\'infanzia':['universita','magistrale','dottorato','master','its','spec'].includes(S.scuola.stato)?'Lezioni e corsi':'Scuola',sc]);
  const lv=oreLavoro();if(lv)o.push(['Lavoro',lv]);
  if(S.azienda)o.push([`${S.azienda.n}`,S.lavoro?12:35]);
  if((lv||sc>=14)&&e>=14)o.push(['Spostamenti',S.veicoli.length?4:6]);
  if(e>=18&&!['genitori','figlio','carcere'].includes(S.casa.tipo))o.push(['Casa, spesa e faccende',convivente()?6:8]);
  const conv=convivente();
  let cura=0;
  for(const f of vivi(['Figlio']))if(!f.fuori){if(f.eta<3)cura+=conv?12:22;else if(f.eta<6)cura+=conv?8:14;else if(f.eta<14)cura+=conv?4:7}
  if(cura)o.push(['Cura dei figli',cura]);
  const as=S.fatti.assisti&&S.relazioni.find(p=>p.id===S.fatti.assisti&&p.vivo);
  if(as)o.push([`Assistenza a ${as.nome}`,12]);
  if(e<6)o.push(['Gioco e famiglia',168-Math.round(S.sonno*7)-sc]);
  return o;
}
function oreLibere(){return Math.max(0,168-obblighi().reduce((s,x)=>s+x[1],0))}
function oreRoutine(){let t=0;for(const a of ATT_R)if(attDisponibile(a))t+=S.routine[a.id]||0;return t}
function normalizzaRoutine(){
  if(!S.routine)S.routine={};
  for(const a of ATT_R)if(!attDisponibile(a)&&S.routine[a.id])S.routine[a.id]=0;
  let lib=oreLibere(),tot=oreRoutine();
  if(tot>lib){
    const k=lib/Math.max(1,tot);
    for(const a of ATT_R)if(S.routine[a.id])S.routine[a.id]=Math.floor(S.routine[a.id]*k);
  }
}
const rOre=id=>{const a=ATT_R.find(x=>x.id===id);return a&&attDisponibile(a)?(S.routine[id]||0):0};

/* ---------- Effetti mensili della routine ---------- */
const BIS0=()=>({energia:75,stress:20,soc:60,forma:55});
function meseRoutine(){
  const B=S.bis,e=S.eta;
  if(e<6||S.carcere>0)return;
  const ader=.62+S.pers.C/260;                 // costanza: quanto delle ore previste fai davvero
  const sp=rOre('sport')*ader,st=rOre('studio')*ader,hb=rOre('hobby')*(.8+S.pers.O/500);
  // forma fisica
  let tf=22+Math.min(72,sp*8.5)-Math.max(0,e-45)*.55-(S.dip.fumo?8:0)-(S.dip.alcol?6:0);
  B.forma=clamp(B.forma+(tf-B.forma)*.12);
  if(sp>0){S.abil.sport=clamp(S.abil.sport+sp*.09*(e<30?1:.5));if(B.forma>65&&S.aspetto<85&&chance(.04))mod('aspetto',1)}
  // studio
  if(st>0){
    if(iscritto()){
      const att={elementari:4,medie:6,superiori:9,serale:6,universita:14,magistrale:14,dottorato:6,master:10,its:8,spec:6}[S.scuola.stato]||6;
      S.scuola.voto=clamp(S.scuola.voto+(st-att)*.1+(52+(S.intelligenza-50)*.45+pz('C')*6-S.scuola.voto)*.05);
    }
    if(S.intelligenza<92&&chance(Math.min(.15,st*.007)*(e<30?1:.5)*(1-S.intelligenza/130)))mod('intelligenza',1);
    if(e>=10&&st>=4&&chance(.05))S.abil.lingue=clamp(S.abil.lingue+1);
  }else if(iscritto()&&!['elementari','asilo'].includes(S.scuola.stato))S.scuola.voto=clamp(S.scuola.voto-1.2);
  // hobby
  if(hb>0&&S.hobby){const h=HOBBY.find(x=>x.id===S.hobby);if(h){S.abil[h.sk]=clamp(S.abil[h.sk]+hb*.11);if(h.s&&hb>=3&&chance(.15))mod('salute',1)}}
  // schermi
  const sch=rOre('schermi');
  if(sch>0){if(chance(sch*.006))S.abil.tech=clamp(S.abil.tech+1);if(iscritto()&&sch>14)S.scuola.voto=clamp(S.scuola.voto-(sch-14)*.08)}
  // social
  const so=rOre('social');
  if(so>0&&S.social.attivo){const q=(S.aspetto+S.abil.arte+S.abil.tech)/300;const f0=S.social.follower;S.social.follower=f0+crescita(f0,f0*so*.004*(.5+q)+so*r(2,8));S.fatti.postati=(S.fatti.postati||0)+1}
  // lavoro extra
  const ex=rOre('extra');
  if(ex>0){
    const L=S.lavoro;
    if(L&&!JOB[L.id].pt){const h=L.stip/1750*1.25;const x=Math.round(netto(L.stip+h*ex*52)-netto(L.stip))/12;soldi(x);S.fatti.extraMese=Math.round(x);L.perf=clamp(L.perf+ex*.2)}
    else{const x=Math.round(P(7.5)*ex*4.3);soldi(x);S.fatti.extraMese=x}
  }else S.fatti.extraMese=0;
  // volontariato
  const vo=rOre('volont');
  if(vo>0){S.karma=clamp(S.karma+vo*.12);if(chance(.008*vo))segnaVita('volontariato')}
  // costi
  const sp0=[];
  if(e>=14){
    if(rOre('sport')>=3)sp0.push(P(e>=18?35:20));
    if(rOre('uscite'))sp0.push(P(e>=18?9:4)*rOre('uscite')*4.3);
    if(rOre('amici')&&e>=16)sp0.push(P(2.5)*rOre('amici')*4.3);
    if(S.hobby&&rOre('hobby')&&(e>=18||!genitoriVivi()))sp0.push(P(38));
  }
  const tot=Math.round(sp0.reduce((s,x)=>s+x,0)*(1.2-S.pers.C/250));
  if(tot){soldi(-tot);S.fatti.spesaSvago=tot}else S.fatti.spesaSvago=0;
  // alcol e uscite
  if(rOre('uscite')>=5&&chance(.05+pz('E')*.02-pz('C')*.02))beve(1);
  contatti();
}

/* ---------- Bisogni e umore ---------- */
function oreSociali(){
  let h=rOre('amici')+rOre('famiglia')+rOre('partner')+rOre('figli')+rOre('uscite')*.8+rOre('volont')*.5;
  if(S.casa.tipo==='genitori'&&genitoriVivi())h+=5;
  if(convivente())h+=7;
  if(S.lavoro)h+=2.5;
  if(iscritto()&&S.scuola.stato!=='asilo')h+=4;
  return h;
}
function qualitaRelazioni(){
  const L=S.relazioni.filter(p=>p.vivo&&!['Nemico','Ex','Conoscente'].includes(p.ruolo)&&!p.lontanoDaTe).map(p=>p.rapporto).sort((a,b)=>b-a).slice(0,5);
  return L.length?L.reduce((s,x)=>s+x,0)/L.length:25;
}
function carico(){
  return oreScuola()+oreLavoro()+(S.azienda?(S.lavoro?12:35):0)+rOre('studio')*.8+rOre('extra')+(obblighi().find(x=>x[0]==='Cura dei figli')||[0,0])[1]*.7+(S.fatti.assisti?12:0);
}
function bisogni(){
  const B=S.bis,e=S.eta;
  if(e<3)return;
  const fig=e<14;
  // socialità
  const bisSoc=4+S.pers.E*.13;
  const oreS=oreSociali();
  const tS=clamp(Math.min(1.2,oreS/bisSoc)*55+(qualitaRelazioni()-60)*.3+(partnerAttuale()?5:0)-(S.carcere?25:0));
  B.soc=clamp(B.soc+(tS-B.soc)*.5);
  // carico ed energia
  const ca=carico()*(fig?.55:1);
  const lib=oreLibere()-oreRoutine();
  const malG=S.malattie.reduce((s,m)=>s+pesoMal(m)*.6,0);
  const extraSoc=Math.max(0,oreS-bisSoc)*(-pz('E'))*1.1;   // gli introversi si stancano
  const tE=clamp(58+(S.sonno-7.5)*9+Math.min(16,lib*.4)-Math.max(0,ca-30)*.6+(B.forma-50)*.15-(B.stress-35)*.2-malG-extraSoc-Math.max(0,e-65)*.5);
  B.energia=clamp(B.energia+(tE-B.energia)*.6);
  // stress
  const deb=S.soldi<0&&e>=18?Math.min(18,-S.soldi/P(1500)):0;
  const insodd=S.lavoro?Math.max(0,50-soddLavoro())*.25:0;
  const prec=S.lavoro&&S.lavoro.contratto?({det:4,app:1,piva:2}[S.lavoro.contratto.t]||0):0;   // l'incertezza del contratto pesa
  const disocc=e>=20&&e<S.mondo.pensEta&&!S.lavoro&&!iscritto()&&!S.azienda&&!S.pensione&&S.casa.tipo!=='carcere'?8:0;
  let tSt=22+Math.max(0,ca-20)*.7*(1+pz('N')*.6)+deb+insodd+prec+disocc+(S.tensione||0)+malG*.6+(S.fatti.assisti?6:0)
    -Math.min(10,rOre('sport')*1.1)-Math.min(e>=65?5:10,lib*.25)-Math.min(6,rOre('hobby')*.6)-(B.soc>60?3:0)
    +Math.max(0,62-S.salute)*.25+Math.max(0,40-B.soc)*.2+(e>=70?5:0)
    +(S.sonno<6.5?(6.5-S.sonno)*9:0)+(S.carcere?25:0)+pz('N')*10;
  if(fig)tSt*=.7;
  B.stress=clamp(B.stress+(tSt-B.stress)*.45);
  S.tensione=Math.max(0,(S.tensione||0)*.6-1);
  // umore
  const pa=partnerAttuale();
  let tU=50+pz('E')*6-pz('N')*14+(B.soc-55)*.22+(B.energia-55)*.1-Math.max(0,B.stress-30)*.42+(S.salute-75)*.14;
  if(S.lavoro)tU+=(soddLavoro()-50)*.12;
  if(disocc)tU-=7;
  if(iscritto()&&e>=11)tU+=(S.scuola.voto-50)*.06;
  if(S.soldi<0&&e>=18)tU-=6;
  if(e>=18&&patrimonio()>P(150000))tU+=3;
  if(S.casa.tipo==='genitori'&&e>=30)tU-=4;
  if(casaMia())tU+=2;
  if(pa)tU+=(pa.rapporto-50)*.12;else if(e>=22&&S.att==='ansioso')tU-=3;
  if(vivi(['Figlio']).some(f=>f.rapporto>60))tU+=3;
  if(S.animali.length)tU+=Math.min(4,legameAnimali());   // più legame, più compagnia
  if(rOre('hobby')>=2)tU+=2+pz('O')*2;
  tU-=(S.dip.alcol?5:0)+(S.dip.gioco?5:0)+S.malattie.filter(m=>m.g>=2).length*4;
  if(S.carcere)tU-=14;
  tU+=meseAspir();
  S.umoreTarget=clamp(tU);
  S.felicita=clamp(S.felicita+(S.umoreTarget-S.felicita)*.22);
}
function umoreFrase(){
  const B=S.bis,f=S.felicita;
  if(S.eta<3)return 'Mangi, dormi e scopri il mondo.';
  const motivi=[];
  if(B.stress>70)motivi.push('lo stress');if(B.energia<30)motivi.push('la stanchezza');if(B.soc<30)motivi.push('la solitudine');
  if(S.soldi<0&&S.eta>=18)motivi.push('i debiti');if(S.malattie.some(m=>m.g>=2))motivi.push('la salute');
  if(f>=75)return motivi.length?`Stai bene, nonostante ${motivi[0]}.`:'Ti senti in gran forma: è un bel periodo.';
  if(f>=50)return motivi.length?`Abbastanza sereno, ma pesa ${motivi.join(' e ')}.`.replace('sereno',g('sereno','serena')):'Un periodo tranquillo.';
  return motivi.length?`Un periodo difficile: ${motivi.join(', ')}.`:'Ti senti giù senza un motivo preciso.';
}

/* ---------- Salute mensile ----------
   Malattie lievi (molto più spesso da bambini), acute, croniche che crescono con l'età, tumori per tipo con cure e remissione,
   demenza, depressione e ansia. I numeri veri sono in ANALISI.md (ISTAT, AIRC, ISS). */
const MANUALI=['mur','ope','mag','aut','vvf','bracc','idra','elet','mecc','fale','camion','mil','cara'];
const PESO_CRON={'Cardiopatia ischemica':6,'Ipertensione':2,'Artrosi':3,'Asma':3,'Emicrania cronica':3,'Diabete di tipo 2':5,'BPCO':7,'Demenza':8};
const pesoMal=m=>m.g===3?(PESO_CRON[m.n]||6):({1:3,2:7,4:22}[m.g]||0);
const fattoreSesso=s=>s==='F'?.62:.9;   // le donne vivono circa 4 anni in più (ISTAT 2025: 85,7 contro 81,7)
const K_GIOCATORE=.4;                  // il rischio «di base» del giocatore: il resto arriva dalle malattie (tumori, demenza, cuore)
function incidenzaTumore(e,ses){
  let p=e<15?.00015:e<30?.0003:e<40?.001:e<50?.0028:e<60?.007:e<70?.014:e<80?.022:.025;
  p*=ses==='M'?1.15:(e<55?1.4:.65);
  if(S.dip.fumo)p*=1.5;if(S.dip.alcol)p*=1.1;
  return p;
}
function tumorePer(ses,e,fuma){
  const L=TUMORI.filter(t=>(t.w[ses]||0)>0&&e>=(t.min||0));
  return pesata(L.map(t=>[t,t.w[ses]*(fuma&&t.fumo?t.fumo:1)]));
}
function ammalaTumore(t,avanz){
  if(!t||haMal(t.n))return;
  ammala(t.n,4);const m=S.malattie.find(x=>x.n===t.n);
  if(m){m.tum=1;if(avanz)m.avanz=1;if(S.t-(S.fatti.screenT||-99)<=36)m.screen=1}
}
function probRemissione(m,privata){
  const t=TUMORE[m.n]||TUMORE.Tumore;
  let p=t.sopr+(privata?.05:0)+(m.screen?.1:0)-(m.avanz?.25:0)+(S.eta<50?.08:S.eta<65?.04:S.eta>75?-.1:0)+(S.salute-70)/300;
  p*=Math.pow(.4,m.linee||0);
  return Math.max(.02,Math.min(.97,p));
}
function avviaCura(m,privata){m.cura={fine:S.t+(privata?r(4,9):r(6,12)),p:probRemissione(m,privata)};m.linee=(m.linee||0)+1}
/* rischio di morte in un anno dato da ogni malattia */
function rischioMalattia(m){
  if(m.tum||TUMORE[m.n]){const t=TUMORE[m.n]||TUMORE.Tumore;return t.m*(m.cura?.6:1)*(m.avanz?1.8:1)}
  const x=MORTALI[m.n];if(x)return x*(m.ctrl?.6:1);
  return m.g===4?.07:0;
}
function meseSalute(){
  const B=S.bis,e=S.eta;
  const malG=S.malattie.reduce((s,m)=>s+pesoMal(m),0);
  let tS=97-Math.max(0,e-35)*.42-Math.max(0,e-65)*.55-Math.max(0,e-80)*.8+(B.forma-50)*.18-Math.max(0,B.stress-60)*.25-(S.sonno<6.5?(6.5-S.sonno)*5:0)-(S.dip.fumo?8:0)-(S.dip.alcol?10:0)-malG;
  if(S.fatti.terapiaAnno===S.anno||S.fatti.terapiaCron)tS+=S.malattie.some(m=>m.g===3)?6:0;
  S.salute=clamp(S.salute+(tS-S.salute)*.09);
  // guarigioni: le lievi e le acute passano, le croniche no, i tumori secondo le cure
  S.malattie=S.malattie.filter(m=>{
    if(m.tum||TUMORE[m.n]){
      m.tum=1;
      if(m.cura&&S.t>=m.cura.fine){
        if(chance(m.cura.p)){log(`Le cure hanno funzionato: ${m.n.toLowerCase()} è in remissione. Controlli ogni sei mesi, ma ne sei fuori.`,'g');mod('felicita',12);mod('salute',8);S.fatti.tumoriSuperati=(S.fatti.tumoriSuperati||0)+1;return false}
        m.cura=null;m.avanz=1;log(`Le cure non sono bastate: ${m.n.toLowerCase()} avanza.`,'b');pesa(12,6);
        if((m.linee||0)<3&&!coda.some(q=>q.e.id==='diagnosi'))coda.push({e:EV.diagnosi,d:{x:m.n}});
      }else if(!m.cura&&!m.avanz&&S.t-(m.t||0)>=12&&chance(.06))m.avanz=1;
      return true;
    }
    const p={1:.55,2:.09,3:0,4:0}[m.g];
    if(p&&chance(p)){if(m.g>=2||e>=12)log(`Guarisci: ${m.n.toLowerCase()}.`,'g');return false}
    return true;
  });
  const inv=[11,0,1].includes(S.mese)?1.8:[5,6,7].includes(S.mese)?.7:1;
  // malattie lievi: i bambini piccoli due all'anno, gli adulti una ogni due anni
  if(e>=1&&chance((e<6?2:e<13?1:e<65?.5:.6)/12*inv)){
    if(e<12&&!S.fatti.varicella&&chance(.3)){S.fatti.varicella=1;ammala('Varicella',1)}
    else ammala(pick(e<13?MAL_BIMBI:MALATTIE[1]),1);
    mod('salute',-2);
  }
  // malattie acute più serie
  const pA=(.012+Math.max(0,e-30)*.0006+(S.dip.fumo?.01:0)+(S.dip.alcol?.01:0)+(S.salute<40?.03:0)+(B.stress>75?.01:0))/12;
  if(e>=3&&chance(pA*inv)){ammala(pick(MALATTIE[2]),2);mod('salute',-6)}
  // croniche: crescono con l'età (la pressione alta riguarda oltre metà degli anziani)
  const cron=[['Ipertensione',e<40?.002:e<55?.012:e<70?.025:.03],['Diabete di tipo 2',(e<40?.0005:e<60?.004:e<75?.008:.01)*(B.forma<35?1.6:1)],['Artrosi',e<50?0:.012],['Asma',.0008],['Emicrania cronica',e>=15&&e<=50?(S.sesso==='F'?.004:.0015):0],['BPCO',S.dip.fumo&&e>=45?.006:0]];
  for(const [n,p] of cron)if(p&&e>=3&&!haMal(n)&&chance(p/12)){ammala(n,3);mod('salute',-4)}
  // cuore: più facile con pressione alta, diabete e fumo
  if(e>=55&&!haMal('Insufficienza cardiaca')&&chance((.0015+(haMal('Ipertensione')?.002:0)+(haMal('Diabete di tipo 2')?.002:0)+(S.dip.fumo?.002:0))/12)){ammala('Insufficienza cardiaca',4);mod('salute',-10)}
  // tumori: circa 1 uomo su 2 e 1 donna su 3 entro gli 84 anni (AIRC)
  if(e>=1&&chance(incidenzaTumore(e,S.sesso)/12)){ammalaTumore(tumorePer(S.sesso,e,S.dip.fumo));mod('salute',-8)}
  if(S.dip.alcol&&e>40&&chance(.0012))ammala('Cirrosi epatica',4);
  // demenza: circa 8% degli over 65, oltre il 20% degli over 80 (ISS); più frequente nelle donne
  if(e>=65&&!haMal('Demenza')&&chance((e<75?.003:e<85?.015:.045)*(S.sesso==='F'?1.3:1)/12))ammala('Demenza',3);
  if(haMal('Demenza')){S.intelligenza=clamp(S.intelligenza+passo(-.5));if(chance(.05))log(pick(['Chiami tuo figlio con il nome di tuo fratello.','Non trovi più le chiavi. Erano in frigo.','Racconti la stessa storia due volte nello stesso pranzo.','Per un attimo non riconosci la strada di casa.']),'h')}
  if(S.mondo.pandemia&&e>=65&&chance(.01))ammala('Polmonite',2);
  // mente: depressione e ansia, più probabili con l'umore basso, l'emotività alta, lo stress e la solitudine
  if(e>=12&&!haMal('Depressione')&&chance(Math.max(0,(48-S.felicita)/48)*.012*(1+.7*pz('N'))+(B.soc<25?.002:0)))ammala('Depressione',2);
  if(e>=12&&!haMal('Disturbo d\'ansia')&&B.stress>65&&chance(.004*(1+pz('N'))))ammala('Disturbo d\'ansia',2);
}
function morteMese(){
  if(S.salute<=0)return 1-Math.pow(.5,1/12);
  const p=morteP(S.eta,S.salute,S.sesso)*K_GIOCATORE+S.malattie.reduce((s,m)=>s+rischioMalattia(m),0)+(S.dip.alcol?.01:0);
  return 1-Math.pow(1-Math.min(.95,p),1/12);
}
/* La causa di morte: una delle malattie, in proporzione al suo rischio, oppure una causa tipica dell'età */
function causaMorte(){
  const voci=[['base',morteP(S.eta,S.salute,S.sesso)*K_GIOCATORE+(S.dip.alcol?.01:0)]];
  for(const m of S.malattie){const x=rischioMalattia(m);if(x)voci.push([m,x])}
  const v=pesata(voci);
  if(v!=='base')return v.tum||TUMORE[v.n]?causaTumore(v.n):(CAUSE[v.n]||'per una grave malattia');
  const e=S.eta,manuale=S.lavoro&&MANUALI.includes(S.lavoro.id);
  const L=e<30?[['in un incidente stradale',40],['in un incidente in montagna',8],['in un incidente in mare',6],['per un malore improvviso',20],['in un incidente sul lavoro',manuale?10:0]]
    :e<60?[['per un infarto',30],['per un ictus',15],['per un malore improvviso',15],['in un incidente stradale',12],['in un incidente sul lavoro',manuale?6:0],['per una polmonite',4]]
    :e<80?[['per un infarto',25],['per un ictus',22],['per una polmonite',7],['per un\'insufficienza respiratoria',S.dip.fumo?9:4],['per un malore improvviso',3],['per le conseguenze di una caduta',3],['per un\'infezione',8],['per un\'insufficienza renale',7],['per una malattia del fegato',4],['serenamente, nel sonno',4]]
    :[['per un infarto',18],['per un ictus',18],['per una polmonite',10],['per un\'insufficienza respiratoria',4],['per le conseguenze di una caduta',7],['per un\'infezione',10],['per un\'insufficienza renale',8],['serenamente, nel sonno',10],['per un malore improvviso',2]];
  return pesata(L);
}

/* ---------- Scelte coerenti con il carattere ---------- */
const INCL=[
  ['E',1,/\b(festa|balla|discoteca|esci|uscite|presentat|chiacchier|invit|unisciti|canta|palco|provin|conosc|organizz|feste|aperitiv|serata|in piazza|abbraccia|parla a tutti|fai amicizia)/i],
  ['E',-1,/\b(resta a casa|resti a casa|stai a casa|in disparte|da sol|non rispondere|declin|ritir|silenzio|tranquill|in camera|evita la gente|libro)/i],
  ['C',1,/\b(studi|risparmi|metti da parte|pianific|prepar|rinunci|restituisc|paga |paghi|prudent|controll|aspetta|rifletti|assicura|regole|fai la cosa giusta|lavora sodo)/i],
  ['C',-1,/\b(spendi|compra subito|marin|salta|rimand|improvvis|scommett|azzard|tutto in|fuggi|scappa|al volo|fregatene|lascia stare tutto|molla|subito)/i],
  ['A',1,/\b(aiut|perdon|consol|scus|regal|presta|dona|accett|sostien|ascolt|fai pace|accompagn|difend|perdoni|comprendi|lascia correre|vai a trovar)/i],
  ['A',-1,/\b(litig|insult|picchi|vendic|minacc|ricatt|umili|rispondi male|urla|truff|sfrutt|ignora|rifiut|tieni il punto|pretendi|ruba|denunc|mandal|vai via|lascial|lascialo|lasciala)/i],
  ['O',1,/\b(prova|sperimenta|viaggi|parti\b|partire|trasferisc|nuov|avventur|arte|scrivi|dipingi|esplor|sfida|cambia|osa|iscriviti|impara)/i],
  ['O',-1,/\b(resta|rimani|come sempre|tradizion|non cambiare|lascia stare|solito|sicuro|rifiuta la proposta)/i],
  ['N',1,/\b(piang|panico|ansia|preoccup|sfog|dispera|crolli|ti chiudi)/i]
];
function inclinazione(c){
  if(!S||!S.pers||!c||typeof c.l!=='string')return 0;
  if(c._incl!==undefined)return c._incl;
  let s=0,n=0;const t=c.l+' '+(typeof c.sub==='string'?c.sub:'');
  for(const [k,sg,re] of INCL)if(re.test(t)){s+=sg*pz(k);n++}
  if(c.p!==undefined&&!/\b(rifiut|lascia|evit)/i.test(t)){s+=(pz('E')*.4-pz('C')*.5-pz('N')*.3)*.6;n+=.6}
  return n?Math.max(-1,Math.min(1,s/Math.sqrt(n))):0;
}
function etichettaIncl(c){const f=inclinazione(c);return f>=.22?'da te':f<=-.22?'non è da te':''}
function effettoIncl(c){
  const f=inclinazione(c);if(!S||!S.bis)return;
  if(f<=-.22){S.bis.stress=clamp(S.bis.stress+Math.round(-f*10));S.bis.energia=clamp(S.bis.energia-4)}
  else if(f>=.22)mod('felicita',1);
}
function pIncl(c,p){const f=inclinazione(c);return Math.max(.02,Math.min(.98,p+f*.1))}

/* ---------- Impulsi: il carattere che agisce da solo ---------- */
const ACQUISTI=[
  {t:'un\'altra cover per il telefono',p:[12,30]},{t:'una felpa che non ti serviva',p:[30,70]},{t:'scarpe da ginnastica nuove',p:[60,140]},
  {t:'un paio di cuffie wireless',p:[40,180]},{t:'un abbonamento che non userai',p:[10,20]},{t:'tre libri che resteranno sul comodino',p:[35,60]},
  {t:'un videogioco appena uscito',p:[60,80]},{t:'un gadget tecnologico inutile',p:[25,90]},{t:'un profumo costoso',p:[70,140]},
  {t:'una cena in un ristorante stellato',p:[120,250],min:18},{t:'attrezzatura da campeggio mai usata',p:[80,250],min:16},
  {t:'uno smartwatch',p:[150,400],min:16},{t:'un monopattino elettrico',p:[300,600],min:16},{t:'una bici da corsa',p:[600,1500],min:18},
  {t:'un divano nuovo, anche se il vecchio andava bene',p:[700,1800],min:22,c:()=>!['genitori','carcere'].includes(S.casa.tipo)},
  {t:'un telefono di ultima generazione',p:[900,1400],min:16},{t:'un weekend last minute',p:[200,450],min:18},
  {t:'accessori per il tuo animale che non userà mai',p:[30,90],c:()=>S.animali.length>0},
  {t:'cerchi in lega per l\'auto',p:[400,900],min:18,c:()=>haAuto()}
];
function impulsi(){
  if(S.eta<12||S.carcere>0)return;
  const B=S.bis;
  if(B.stress>68&&chance(.06+pz('N')*.05-pz('A')*.02)){
    const vit=pick(S.relazioni.filter(p=>p.vivo&&['Madre','Padre','Fratello','Partner','Coniuge','Amico'].includes(p.ruolo)));
    if(vit){vit.rapporto=clamp(vit.rapporto-r(4,10));ricorda(vit,'Gli hai risposto male in un momento di stress'.replace('Gli',gp(vit,'Gli','Le')));log(`Sei sotto pressione e rispondi male a ${vit.nome}. Te ne penti subito.`,'b');return}
  }
  if(B.stress>75&&pz('N')>.2&&chance(.05)){S.tensione=(S.tensione||0)+4;log('Una notte d\'ansia: il cuore che batte forte e mille pensieri.','b');return}
  if(S.eta>=14&&S.soldi>P(150)&&chance(.035-pz('C')*.03)){
    const L=ACQUISTI.filter(a=>(!a.min||S.eta>=a.min)&&(!a.c||a.c())&&!fuoriEpoca(a.t)&&P(a.p[1])<=S.soldi*.25+P(a.p[0]));
    if(L.length){const a=pick(L);const x=P(r(a.p[0],a.p[1]));soldi(-x);log(`Acquisto d'impulso: ${a.t} (${eur(x)}).`,'');return}
  }
  if(B.soc<35&&pz('E')>.2&&chance(.08)){const a=pick(vivi(['Amico','Fratello','Cugino']));if(a){a.rapporto=clamp(a.rapporto+r(4,8));log(`Ti manca la gente: chiami ${a.nome} e passate ore al telefono.`,'g');B.soc=clamp(B.soc+8);return}}
  if(pz('O')>.3&&chance(.02)&&S.eta>=14){log(varia('curioso',TESTI.curioso),'g');mod('felicita',2);return}
  if(pz('C')<-.3&&iscritto()&&chance(.04)){S.scuola.voto=clamp(S.scuola.voto-3);log('Rimandi lo studio fino all\'ultimo, come sempre. Il compito va male.','b');return}
  if(pz('C')>.35&&S.lavoro&&chance(.03)){S.lavoro.perf=clamp(S.lavoro.perf+3);log(varia('anticipo',TESTI.anticipo),'g')}
}

/* ---------- Calendario ---------- */
function calendario(){
  const m=S.mese,e=S.eta;
  if(m===8&&S.carcere===0)inizioScuola();
  if(m===5&&S.carcere===0)fineScuola();
  if(m===11){
    if(S.lavoro&&!JOB[S.lavoro.id].pt&&!S.fatti.tred){S.fatti.tred=1;log(`Arriva la tredicesima: a dicembre lo stipendio è doppio.`,'h')}
    natale();   // d8_ritmo.js: un evento solo se c'è una novità, altrimenti una riga di diario
  }
  if(m===0)capodanno();
  if(m===1&&partnerAttuale()&&e>=16&&chance(.25))log(varia('sv',['San Valentino con {P}: cena fuori e ristorante pieno di coppie.','A San Valentino {P} ti fa una sorpresa.','San Valentino a casa, pizza e film con {P}.','Per San Valentino tu e {P} vi scambiate regali fatti a mano.']).replace('{P}',partnerAttuale().nome),'g');
  if(m===7)ferieAgosto();
  // propositi: il carattere decide se li mantieni
  const Pp=S.proposito;
  if(Pp&&Pp.anno===S.anno&&m>=2&&!Pp.fine&&chance(.22-pz('C')*.16)){
    Pp.fine=true;log(`Abbandoni il buon proposito di inizio anno (${Pp.n}).`,'h');
    if(Pp.id&&S.routine[Pp.id]!==undefined)S.routine[Pp.id]=Math.max(0,S.routine[Pp.id]+(Pp.d?-Pp.d:0));
  }
}

/* ---------- Avanzamento rapido ---------- */
function avanti(n){
  for(let i=0;i<n;i++){
    if(!S||!S.vivo||sheetOpen)break;
    mese(true);
    if(sheetOpen||coda.length||momentiDaMostrare.length)break;
  }
  render();
}

/* ---------- Aspirazioni: ciò che dà senso alla vita ----------
   Ogni aspirazione è una scala di tappe [nome, cosa serve, condizione, avanzamento 0–1 verso quella tappa].
   L'ultima tappa è sempre l'ok() del sogno (ASP la completa da sola). S.aspTappe[id] = [null | {t,anno,eta,pre}]:
   le tappe raggiunte restano anche se la situazione cambia; «pre» = già raggiunta quando il sogno è stato scelto. */
const ASP=(n,ok,w,t)=>({n,ok,w,tappe:t.map(([nome,d,c,p])=>({n:nome,d,c:c||ok,p}))});
const ASPIR={
  famiglia:ASP('Avere una famiglia',()=>!!S.relazioni.find(p=>p.vivo&&(p.ruolo==='Coniuge'||(p.ruolo==='Partner'&&p.conv)))&&S.relazioni.some(p=>p.ruolo==='Figlio'),()=>pz('A')*.6+pz('C')*.2,[
    ['Una vita in due','Andare a vivere con qualcuno o sposarti',()=>!!S.relazioni.find(p=>p.vivo&&(p.ruolo==='Coniuge'||(p.ruolo==='Partner'&&p.conv)))],
    ['Un figlio','Avere il tuo primo figlio',()=>S.relazioni.some(p=>p.ruolo==='Figlio')],
    ['Una famiglia tua','Un figlio e qualcuno accanto a te']]),
  carriera:ASP('Fare carriera',()=>(S.lavoro&&S.lavoro.liv>=2)||(S.azienda&&S.azienda.sedi>=2),()=>pz('C')*.5+pz('E')*.3-pz('A')*.1,[
    ['Un lavoro stabile','Un contratto stabile, la partita IVA o un\'attività tua',()=>!!S.azienda||(!!S.lavoro&&['ind','piva','carica'].includes((S.lavoro.contratto||{t:'ind'}).t))],
    ['Il primo avanzamento','Salire al primo livello della carriera',()=>!!S.lavoro&&S.lavoro.liv>=1],
    ['Il vertice','Il terzo livello della carriera o un\'azienda con due sedi']]),
  ricchezza:ASP('Diventare ricc{o}',()=>patrimonio()>=P(500000),()=>-pz('A')*.4+pz('E')*.2,[
    ['Un quarto della strada','Un quarto del patrimonio che sogni',()=>patrimonio()>=P(125000),()=>patrimonio()/P(125000)],
    ['Metà strada','La metà del patrimonio che sogni',()=>patrimonio()>=P(250000),()=>patrimonio()/P(250000)],
    ['Ricc{o} davvero','Un patrimonio di 500.000 €',null,()=>patrimonio()/P(500000)]]),
  fama:ASP('Diventare famos{o}',()=>S.fama>=40,()=>pz('E')*.5+pz('O')*.2-pz('A')*.2,[
    ['Qualcuno ti riconosce','Fama almeno 10',()=>S.fama>=10,()=>S.fama/10],
    ['Hai un nome','Fama almeno 25',()=>S.fama>=25,()=>S.fama/25],
    ['Famos{o}','Fama almeno 40',null,()=>S.fama/40]]),
  viaggi:ASP('Vedere il mondo',()=>(S.fatti.viaggi||0)>=6,()=>pz('O')*.6+pz('E')*.2,[
    ['Il primo viaggio','Un viaggio che conta',()=>(S.fatti.viaggi||0)>=1,()=>(S.fatti.viaggi||0)/1],
    ['Tre viaggi','Tre viaggi che contano',()=>(S.fatti.viaggi||0)>=3,()=>(S.fatti.viaggi||0)/3],
    ['Il mondo visto','Sei viaggi che contano',null,()=>(S.fatti.viaggi||0)/6]]),
  sapere:ASP('Studiare e capire il mondo',()=>S.istr.liv>=4,()=>pz('O')*.5+pz('C')*.3,[
    ['Il diploma','Prendere il diploma',()=>S.istr.liv>=2],
    ['La laurea','Laurearti',()=>S.istr.liv>=3],
    ['La magistrale','Prendere la laurea magistrale']]),
  altri:ASP('Aiutare gli altri',()=>S.karma>=85,()=>pz('A')*.7,[
    ['Una brava persona','Karma almeno 60',()=>S.karma>=60,()=>S.karma/60],
    ['Un aiuto che dura','Karma almeno 75, o 65 con due anni di volontariato o una bella donazione',()=>S.karma>=75||(S.karma>=65&&((S.fatti.volMesi||0)>=24||LX().donato>=5000)),()=>S.karma/75],
    ['Un punto di riferimento','Karma almeno 85',null,()=>S.karma/85]]),
  casa:ASP('Una casa tutta mia',()=>!!casaMia(),()=>pz('C')*.4-pz('O')*.2,[
    ['Fuori di casa','Andare a vivere fuori dalla casa dei genitori',()=>S.eta>=18&&!['genitori','figlio','carcere'].includes(S.casa.tipo)],
    ['Un affitto tuo','Un anno in una casa in affitto',()=>(S.fatti.affMesi||0)>=12,()=>(S.fatti.affMesi||0)/12],
    ['Casa tua','Vivere in una casa di proprietà']]),
  serenita:ASP('Una vita serena',()=>(S.fatti.sereni||0)>=60,()=>-pz('O')*.2+pz('N')*.3,[
    ['Un anno sereno','12 mesi con poco stress e buon umore',()=>(S.fatti.sereni||0)>=12,()=>(S.fatti.sereni||0)/12],
    ['Due anni e mezzo','30 mesi sereni',()=>(S.fatti.sereni||0)>=30,()=>(S.fatti.sereni||0)/30],
    ['Cinque anni di pace','60 mesi sereni',null,()=>(S.fatti.sereni||0)/60]])
};
/* quante tappe sono vere adesso (indice dell'ultima vera, -1 se nessuna); le precedenti valgono come raggiunte */
function aspAltezza(id){const T=ASPIR[id].tappe;for(let i=T.length-1;i>=0;i--)if(T[i].c())return i;return -1}
function aspTappeDi(id){
  S.aspTappe=S.aspTappe||{};const n=ASPIR[id].tappe.length,a=S.aspTappe[id]||[];
  return S.aspTappe[id]=Array.from({length:n},(_,i)=>a[i]||null);
}
/* quante tappe ha già raggiunto + quanto manca alla prossima, da 0 a 1 */
function aspProg(id){
  const T=ASPIR[id].tappe,a=aspTappeDi(id);let k=0;while(k<T.length&&a[k])k++;
  if(k>=T.length)return 1;
  const p=T[k].p?Math.max(0,Math.min(.95,T[k].p())):0;
  return Math.min(1,(k+p)/T.length);
}
/* quando si sceglie un sogno (o si carica una partita vecchia) le tappe già fatte si segnano senza premi né diario */
function aspAvvia(id){
  const a=aspTappeDi(id),k=aspAltezza(id);
  for(let i=0;i<=k;i++)if(!a[i])a[i]={t:S.t,anno:S.anno,eta:S.eta,pre:1};
}
const aspAttive=()=>(S.aspir||[]).filter(id=>ASPIR[id]&&!(S.aspOk||[]).includes(id));
/* testo del foglio «I tuoi sogni»: per ogni sogno la barra, le tappe fatte (con l'età) e la prossima */
function barraTesto(f,n=10){const k=Math.round(Math.max(0,Math.min(1,f))*n);return '▰'.repeat(k)+'▱'.repeat(n-k)}
function testoSogni(){
  const ids=(S.aspir||[]).filter(id=>ASPIR[id]);
  if(!ids.length)return 'Non hai ancora deciso che cosa conta di più per te. Succederà a 18 anni.';
  const blocco=id=>{
    const A=ASPIR[id],a=aspTappeDi(id),ok=(S.aspOk||[]).includes(id),pr=ok?1:aspProg(id);
    const righe=A.tappe.map((t,i)=>{
      const prossima=!a[i]&&(i===0||a[i-1]);
      return `${a[i]?'✓':prossima?'›':'·'} ${T(t.n)}${a[i]?(a[i].pre?' (già fatto)':` · ${a[i].eta} anni`):prossima?` — ${T(t.d)}`:''}`}).join('\n');
    const extra=id==='altri'&&((S.fatti.volMesi||0)>0||LX().donato>0)?`\nVolontariato: ${S.fatti.volMesi||0} mesi · Donato: ${eur(LX().donato*S.mondo.ip)}`:id==='serenita'?`\nMesi sereni: ${S.fatti.sereni||0}`:id==='viaggi'?`\nViaggi che contano: ${S.fatti.viaggi||0}`:'';
    return `${T(A.n)}${ok?' — realizzato':''}\n${barraTesto(pr)} ${Math.round(pr*100)}%\n${righe}${extra}`};
  return ids.map(blocco).join('\n\n')+'\n\nOgni tappa raggiunta ti dà un po\' di felicità; il sogno intero molta di più. Più avanti potrai ripensare cosa vuoi.';
}
function meseAspir(){
  if(S.eta>=18&&S.casa.tipo==='affitto')S.fatti.affMesi=(S.fatti.affMesi||0)+1;
  if(rOre('volont')>0)S.fatti.volMesi=(S.fatti.volMesi||0)+1;
  if(!S.aspir||!S.aspir.length)return 0;
  if(S.bis.stress<35&&S.felicita>=62)S.fatti.sereni=(S.fatti.sereni||0)+1;
  S.aspOk=S.aspOk||[];let b=0,veri=0;
  for(const id of S.aspir){
    const A=ASPIR[id];if(!A)continue;
    if(S.aspOk.includes(id)){if(++veri<=2)b+=4;continue}
    const a=aspTappeDi(id),k=aspAltezza(id),ult=A.tappe.length-1;let ultima=-1;
    for(let i=0;i<=k;i++)if(!a[i]){a[i]={t:S.t,anno:S.anno,eta:S.eta};if(i<ult){mod('felicita',2);ultima=i}}
    if(k===ult){S.aspOk.push(id);mod('felicita',12);log(`Un sogno realizzato: ${T(A.n).toLowerCase()}.`,'g');b+=4;veri++;
      if(typeof momento==='function')momento('sogno',{tit:T(A.n),sub:'Un sogno realizzato',txt:'Quello che volevi dalla vita, adesso ce l\'hai.'})}
    else{
      if(ultima>=0)log(`Un passo verso un sogno (${T(A.n).toLowerCase()}): ${T(A.tappe[ultima].n).toLowerCase()}.`,'g');
      if(S.eta>=45)b-=2*(1-aspProg(id));
    }
  }
  return b;
}
