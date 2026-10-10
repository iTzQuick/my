/* ================= PERSONE VERE (ROADMAP, Fase 2) =================
   - GRUPPI (S.gruppi): le cerchie in cui conosci le persone (la classe, i colleghi, i genitori della scuola, il corso…).
     Chi è nello stesso gruppo si conosce; frequentare un amico fa vedere un po' anche il suo gruppo.
   - LEGAMI (S.legami): amicizie, coppie e rivalità tra le persone del gioco (non con te): {a,b,t,f,dal}.
   - RICORDI con un segno (v, da −3 a +3): chi hai aiutato ti aiuta, chi hai ferito non si fida;
     nel gruppo le voci girano. Quando un ricordo di almeno 10 anni prima torna in gioco si conta in S.fatti.ritorni.
   - STILE DA GENITORE (S.genit: calore e regole, il modello di Baumrind) che forma il carattere dei figli.
   - CONTESTO delle persone (lutto, lavoro nuovo, neonato, separazione…) per conversazioni che c'entrano. */

/* ---------- Gruppi ---------- */
const GRUPPO_N={asilo:'I bambini dell\'asilo',elementari:'La classe delle elementari',medie:'La classe delle medie',universita:'Gli amici dell\'università',festa:'La compagnia del sabato sera',volont:'I volontari',online:'Il gruppo online',cane:'Il parco dei cani',parco:'Il parco giochi',viaggio:'Gli amici delle vacanze',carcere:'Il carcere',treno:'Il treno del mattino',orto:'Gli orti comunali'};
const TIPI_INC=['scuola','parco','lavoro','tramite','vicino','treno','cane','genitori','corso','festa','volont','online','quartiere','viaggio','orto','carcere'];
function scuolaGruppo(){const s=S.scuola.stato;return s==='asilo'?'asilo':s==='elementari'?'elementari':s==='medie'?'medie':['superiori','serale'].includes(s)?'superiori':['universita','magistrale','dottorato','master','its','spec'].includes(s)?'universita':null}
const figlioScuola=()=>vivi(['Figlio']).filter(f=>f.eta>=3&&f.eta<=13&&!f.fuori&&!f.conEx).sort((a,b)=>a.eta-b.eta)[0];
function contestoAttuale(){if(S.carcere>0)return 'carcere';const sg=scuolaGruppo();if(sg&&iscritto())return sg;if(S.lavoro&&!JOB[S.lavoro.id].pt)return 'lavoro';if(S.eta<6)return 'parco';return 'quartiere'}
function chiaveGruppo(tipo){
  if(tipo==='scuola')tipo=scuolaGruppo()||'quartiere';
  switch(tipo){
    case 'lavoro':return S.lavoro?'lavoro:'+S.lavoro.id+':'+(S.lavoro.da||0):'quartiere:'+S.citta;
    case 'genitori':{const f=figlioScuola();return f?'genitori:'+f.id:'quartiere:'+S.citta}
    case 'corso':return 'corso:'+(S.hobby&&rOre('hobby')>=rOre('sport')?S.hobby:'palestra');
    case 'quartiere':case 'vicino':return tipo+':'+S.citta;
    default:return tipo;
  }
}
function nomeGruppo(k){
  const [tipo,a]=k.split(':');
  if(tipo==='superiori')return /liceo/i.test(S.scuola.tipo||'')?'La compagnia del liceo':'La compagnia delle superiori';
  if(tipo==='lavoro')return S.lavoro?`I colleghi (${S.lavoro.nome.toLowerCase()})`:'I colleghi';
  if(tipo==='genitori'){const f=persona(+a);return `I genitori della classe di ${f?f.nome:'tuo figlio'}`}
  if(tipo==='corso'){const hb=HOBBY.find(z=>z.id===a);return hb?`Il corso di ${hb.n.toLowerCase()}`:'La palestra'}
  if(tipo==='quartiere')return `Il quartiere, a ${a}`;
  if(tipo==='vicino')return `Il palazzo, a ${a}`;
  return GRUPPO_N[tipo]||'Gli amici';
}
const persona=id=>S.relazioni.find(x=>x.id===id);
/* «ad Arianna», «ed Elia»: la d eufonica davanti alla stessa vocale */
const aNome=n=>/^[Aa]/.test(n)?'ad '+n:'a '+n;
const eNome=n=>/^[Ee]/.test(n)?'ed '+n:'e '+n;
function gruppo(k){let G=S.gruppi.find(g=>g.k===k);if(!G){G={id:S.nextId++,k,n:nomeGruppo(k),m:[],dal:S.t}; S.gruppi.push(G)}return G}
function gruppiDi(p){return (S.gruppi||[]).filter(g=>g.m.includes(p.id))}
function membriVivi(G,escl){return G.m.map(persona).filter(x=>x&&x.vivo&&x!==escl&&x.ruolo!=='Nemico')}
/* un gruppo è «attivo» finché ne fai parte: stessa scuola, stesso lavoro, stessa città, figlio ancora in quella classe */
function gruppoAttivo(G){
  const [tipo,a,b]=G.k.split(':');
  if(['asilo','elementari','medie','superiori','universita'].includes(tipo))return scuolaGruppo()===tipo&&iscritto();
  if(tipo==='lavoro')return !!S.lavoro&&S.lavoro.id===a&&String(S.lavoro.da||0)===b;
  if(tipo==='genitori'){const f=persona(+a);return !!f&&f.vivo&&f.eta<=13}
  if(tipo==='quartiere'||tipo==='vicino')return S.citta===a;
  if(tipo==='carcere')return S.carcere>0;
  if(tipo==='corso')return a==='palestra'?rOre('sport')>=2:S.hobby===a&&rOre('hobby')>0;
  return true;
}
/* ogni amico o conoscente nuovo entra nel gruppo del posto in cui l'hai conosciuto (dove), o in quello della tua vita di adesso */
function assegnaGruppo(p,dove,via){
  if(!S.gruppi)return;
  let t=dove&&String(dove).startsWith('tramite')?'tramite':dove;
  if(!TIPI_INC.includes(t))t=contestoAttuale();
  const amico=via?persona(via):null;
  if(t==='tramite'){
    if(amico){legame(p,amico,'amici',r(55,75));const g=gruppiDi(amico)[0];if(g&&!g.m.includes(p.id))g.m.push(p.id);return}
    t=contestoAttuale();
  }
  if(t==='viaggio'&&p.lontano)return;      // l'amico delle vacanze vive altrove: niente gruppo
  const G=gruppo(chiaveGruppo(t));if(!G.m.includes(p.id))G.m.push(p.id);
  if(amico)legame(p,amico,'amici',r(55,75));
}

/* ---------- Legami tra le persone del gioco ---------- */
const coppiaId=(a,b)=>a.id<b.id?[a.id,b.id]:[b.id,a.id];
function legameTra(a,b){if(!S.legami||!a||!b)return null;const [x,y]=coppiaId(a,b);return S.legami.find(l=>l.a===x&&l.b===y)||null}
function legame(a,b,t,f){
  if(!S.legami||!a||!b||a===b)return null;
  let L=legameTra(a,b);
  if(!L){const [x,y]=coppiaId(a,b);L={a:x,b:y,t,f:clamp(f===undefined?60:f),dal:S.t};S.legami.push(L)}
  else{L.t=t;if(f!==undefined)L.f=clamp(f)}
  return L;
}
/* affinità tra due persone del gioco (come affinita(), ma tra loro) */
function affNpc(a,b){
  if(!a.pers||!b.pers)return 50;const x=a.pers,y=b.pers;
  return clamp(62-Math.abs(x.O-y.O)*.25-Math.abs(x.C-y.C)*.15-Math.abs(x.E-y.E)*.1+(x.A-50)*.15+(y.A-50)*.15-(x.N-50)*.1-(y.N-50)*.1);
}
const FAM_LEG=['Madre','Padre','Patrigno','Fratello','Nonno','Zio','Cugino','Figlio','Nipote'];
/* si conoscono? legame esplicito, stesso gruppo, oppure famiglia (la tua famiglia si conosce tutta; il partner che vive con te la conosce) */
function siConoscono(a,b){
  if(!a||!b||a===b)return false;
  const L=legameTra(a,b);if(L&&L.t!=='nessuno')return true;
  if(S.gruppi&&S.gruppi.some(g=>g.m.includes(a.id)&&g.m.includes(b.id)))return true;
  const fa=FAM_LEG.includes(a.ruolo)||(['Partner','Coniuge'].includes(a.ruolo)&&a.conv),fb=FAM_LEG.includes(b.ruolo)||(['Partner','Coniuge'].includes(b.ruolo)&&b.conv);
  if(fa&&fb)return true;
  if(a.famDi===b.id||b.famDi===a.id||(a.famDi&&a.famDi===b.famDi))return true;
  if(a.pId===b.id||b.pId===a.id)return true;
  // il partner che vive con te da un anno conosce i tuoi amici stretti; gli amici d'infanzia conoscono la tua famiglia
  for(const [x,y] of [[a,b],[b,a]]){
    if(['Partner','Coniuge'].includes(x.ruolo)&&x.conv&&S.t-(x.dal||0)>=12&&y.ruolo==='Amico'&&(y.rapporto>=60||y.best))return true;
    if(y.ruolo==='Amico'&&['Madre','Padre','Fratello','Patrigno'].includes(x.ruolo)&&y.da!==undefined&&S.eta-(S.t-y.da)/12<20)return true;
  }
  return false;
}
/* le persone vive (che conosci) collegate a p */
function conoscentiDi(p){return S.relazioni.filter(x=>x.vivo&&x!==p&&x.ruolo!=='Nemico'&&siConoscono(p,x))}
const legatoAqualcuno=p=>S.relazioni.some(x=>x.vivo&&x!==p&&x.ruolo!=='Nemico'&&siConoscono(p,x));
/* chi vuoi bene davvero: amici stretti (rapporto ≥60 o migliore amico) */
const amiciStretti=()=>vivi(['Amico']).filter(a=>(a.rapporto>=60||a.best)&&!a.cella);

/* Alla tua festa di compleanno (o al matrimonio) gli amici si conoscono tra loro */
function presentaAmici(occasione,tutti){
  if(!S.legami||S.eta<7||S.carcere>0)return;
  const C=vivi(['Amico']).filter(a=>(a.rapporto>=50||a.best)&&!a.lontano&&!a.cella);
  const soli=vivi(['Amico']).filter(a=>(a.rapporto>=50||a.best)&&!a.cella&&!legatoAqualcuno(a));   // anche chi vive lontano torna per la festa
  if(C.length<1||C.length+soli.length<2)return;
  const coppie=[];
  if(tutti){for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++)if(!siConoscono(C[i],C[j]))coppie.push([C[i],C[j]])}
  else if(soli.length&&chance(.85)){for(const a of shuffle(soli).slice(0,2)){const b=pick(C.filter(x=>x!==a));if(b)coppie.push([a,b])}}
  if(!coppie.length)return;
  for(const [a,b] of coppie.slice(0,tutti?12:2))legame(a,b,'amici',affNpc(a,b));
  if(!tutti){const [a,b]=coppie[0],af=affNpc(a,b);log(`${occasione||'Alla tua festa'} ${a.nome} ${eNome(b.nome)} si conoscono${af>=58?': vanno subito d\'accordo.':af<42?'. Non si piacciono granché.':'.'}`,'')}
}

/* Frequentare un amico porta un po' di tempo anche con il suo gruppo (contatti() in c4_persone.js) */
function contattoGruppo(p,h){
  if(!S.gruppi||h<=0)return;
  for(const G of gruppiDi(p)){if(!gruppoAttivo(G))continue;
    for(const m of membriVivi(G,p))if(['Amico','Conoscente'].includes(m.ruolo)&&!m.lontano){relD(m,Math.min(1.5,h*.2));m.ultimo=S.t}}
}

/* ---------- Ricordi con un segno ---------- */
const RIC_NEG=/^(Non |Ti sei dimenticat|Hai rifiutat|Hai detto di no|Hai raccontato il suo segreto|Hai lasciato a loro|Hai reagito male|Avete litigato|Avete chiuso|Vi siete lasciati|Gli hai risposto male|Le hai risposto male|Gli hai staccato|Le hai staccato|Gli hai nascosto|Le hai nascosto|Gli hai dato la colpa|Le hai dato la colpa|Si è sentit|La festa a sorpresa non|L'hai portat. in una RSA|L'hai punit|Ti ha scoperto|Ha scoperto|Te la sei pres|Non sei|Hai litigato|Ti ha tradit|L'hai tradit|L'hai lasciat)/;
const RIC_FORTE=/(prestato|regalato una casa|regalo importante|ospitat|vicin. quando|accanto|trovato lavoro|bussato|abbracciat. quando|insegnato il mestiere|aiutat. a pagare|scelt. per la cresima|rimast. con (lui|lei) in ospedale|segreto tradito|reagito male|raccontato il suo segreto|lasciato a loro|tradit)/;
function valenza(s){const neg=RIC_NEG.test(s);const forte=RIC_FORTE.test(s);return (neg?-1:1)*(forte?2:1)}
const vRic=m=>m.v!==undefined?m.v:valenza(m.s);
function bilancioRicordi(p){return (p&&p.ricordi||[]).reduce((s,m)=>s+vRic(m),0)}
/* il ricordo più forte di quel segno, almeno minAnni fa */
function ricordoDi(p,segno,minAnni){
  const L=(p&&p.ricordi||[]).filter(m=>vRic(m)*segno>0&&S.t-m.t>=(minAnni||0)*12);
  return L.sort((a,b)=>Math.abs(vRic(b))-Math.abs(vRic(a))||a.t-b.t)[0]||null;
}
/* un ricordo torna in gioco: si conta (per la ROADMAP, quelli di almeno 10 anni prima) */
function ritorno(p,m,dove){
  if(!p||!m)return;
  S.ritorni=S.ritorni||[];S.ritorni.push({t:S.t,pid:p.id,da:m.t,dove:dove||''});if(S.ritorni.length>80)S.ritorni.shift();
  if(S.t-m.t>=120)S.fatti.ritorni=(S.fatti.ritorni||0)+1;
}
const quanto=m=>{const a=Math.round((S.t-m.t)/12);return a<=1?'poco tempo fa':a<10?`${a} anni fa`:`ormai ${a} anni fa`};
/* nel gruppo le voci girano: quello che fai a una persona lo vengono a sapere anche gli altri */
function voci(p,v){
  if(!S.gruppi||Math.abs(v)<2)return;
  for(const G of gruppiDi(p))for(const m of membriVivi(G,p))if(['Amico','Conoscente'].includes(m.ruolo))relD(m,v*.8);
}

/* Chi non dimentica: nei momenti difficili si fa avanti chi hai aiutato (al massimo una volta ogni due anni) */
const MOTIVI_AIUTO={lutto:'È un periodo di lutto',lavoro:'Hai appena perso il lavoro',malattia:'La diagnosi ti ha tolto il fiato',separazione:'La tua storia è appena finita',carcere:'Sei in carcere',stanchezza:'Sei allo stremo'};
function bisognoAiuto(motivo,escl){
  if(!S||!S.vivo||S.eta<14||S.t-(S.fatti.aiutoT||-99)<24||coda.some(q=>q.e===EV.mem_aiuto))return;
  const C=S.relazioni.filter(p=>p.vivo&&p!==escl&&!['Nemico','Ex','Conoscente'].includes(p.ruolo)&&p.eta>=14)
    .map(p=>{const m=ricordoDi(p,1);return m&&vRic(m)>=1?[p,m,bilancioRicordi(p)+vRic(m)+(S.t-m.t)/60]:null}).filter(Boolean).sort((a,b)=>b[2]-a[2]);
  if(!C.length||!chance(.65))return;
  const [p,m]=C[0];S.fatti.aiutoT=S.t;
  coda.push({e:EV.mem_aiuto,d:{p,x:motivo,mt:m.t}});
}

/* ---------- Contesto: quello che sta vivendo una persona ---------- */
function contestoNpc(p){
  const t=S.t,f=p.sesso==='F';
  if(p.luttoT&&t-p.luttoT<12)return {id:'lutto',s:`ha perso ${p.luttoChi||'una persona cara'}`};
  if(p.malato>=2)return {id:'malato',s:`sta male${p.malattia?' ('+p.malattia.toLowerCase()+')':''}`};
  if(p.neoT&&t-p.neoT<12)return {id:'neonato',s:`è appena diventat${f?'a mamma':'o papà'}`};
  if(p.sepT&&t-p.sepT<12)return {id:'separazione',s:`si è appena separat${f?'a':'o'}`};
  if(p.stato==='disoccupato'&&p.eta>=18)return {id:'disoccupato',s:'cerca lavoro'};
  if(p.lavT&&t-p.lavT<12)return {id:'lavoro',s:'ha un lavoro nuovo'};
  if(p.nuovoT&&t-p.nuovoT<10&&p.pNome)return {id:'amore',s:`si è innamorat${f?'a':'o'} di ${p.pNome}`};
  if(p.trasfT&&t-p.trasfT<12&&p.lontano)return {id:'lontano',s:`si è trasferit${f?'a':'o'} a ${p.dove||'un\'altra città'}`};
  if(p.pensT&&t-p.pensT<12)return {id:'pensione',s:`è appena andat${f?'a':'o'} in pensione`};
  return null;
}
/* chi è vicino a una persona che muore vive un lutto (serve alle conversazioni) */
function luttoPerChi(q){
  const chi=[],rel=x=>S.relazioni.filter(p=>p.vivo&&p!==q&&x.includes(p.ruolo));
  if(['Madre','Padre'].includes(q.ruolo))chi.push(...rel(['Madre','Padre','Fratello']));
  else if(q.ruolo==='Coniuge'||q.ruolo==='Partner')chi.push(...rel(['Figlio']));
  else if(q.ruolo==='Figlio')chi.push(...rel(['Coniuge','Partner','Figlio']));
  else if(q.ruolo==='Nonno')chi.push(...rel(['Madre','Padre','Fratello','Zio','Cugino']));
  else if(q.ruolo==='Fratello')chi.push(...rel(['Madre','Padre','Fratello']));
  if(q.pId){const x=persona(q.pId);if(x&&x.vivo)chi.push(x)}
  for(const g of gruppiDi(q))if(gruppoAttivo(g)||q.ruolo==='Amico')chi.push(...membriVivi(g,q).filter(x=>x.ruolo==='Amico'));
  const nome=q.ruolo==='Madre'?'la madre':q.ruolo==='Padre'?'il padre':q.ruolo==='Nonno'?gp(q,'il nonno','la nonna'):q.ruolo==='Fratello'?gp(q,'un fratello','una sorella'):q.ruolo==='Figlio'?gp(q,'un figlio','una figlia'):q.nome;
  for(const p of new Set(chi)){p.luttoT=S.t;p.luttoChi=['Madre','Padre'].includes(q.ruolo)&&['Madre','Padre'].includes(p.ruolo)?(gp(q,'il marito','la moglie')):p.ruolo==='Amico'?q.nome:nome}
}

/* ---------- Lo stile da genitore ---------- */
/* calore (cal) e regole (reg), 0–100: autorevole (tanto di entrambi), permissivo (calore senza regole),
   autoritario (regole senza calore), distaccato (poco di entrambi). Si muovono con le ore passate con i figli e le scelte negli eventi (gen:{cal,reg}). */
function GEN(){if(!S.genit)S.genit={cal:50,reg:50,st:[]};return S.genit}
function cambiaGen(o){const G=GEN();if(o.cal)G.cal=Math.max(5,Math.min(95,G.cal+o.cal));if(o.reg)G.reg=Math.max(5,Math.min(95,G.reg+o.reg));G.st.push(S.t);if(G.st.length>30)G.st.shift()}
function stileGen(){const G=GEN();return G.cal>=55&&G.reg>=55?'autorevole':G.cal>=55?'permissivo':G.reg>=55?'autoritario':'distaccato'}
const STILE_GEN={autorevole:{n:'Autorevole',d:'tanto affetto e regole chiare: i figli crescono più sicuri e responsabili',pers:{C:.8,A:.5,N:-.6}},
  permissivo:{n:'Permissivo',d:'tanto affetto, poche regole: figli socievoli, meno costanti',pers:{E:.6,A:.3,C:-.5}},
  autoritario:{n:'Autoritario',d:'regole rigide e poco calore: figli diligenti ma più ansiosi e chiusi',pers:{C:.6,N:.6,E:-.4,A:-.2}},
  distaccato:{n:'Distaccato',d:'poco tempo e poche regole: i figli si arrangiano, ma pesa',pers:{N:.7,C:-.5,A:-.4}}};
const cambiaPersNpc=(p,k,d)=>{if(p.pers)p.pers[k]=Math.max(3,Math.min(97,p.pers[k]+d))};
/* ogni anno lo stile lascia un segno sul carattere dei figli che vivono con te (annoFiglio) */
function crescitaFiglio(p){
  if(!S.genit||p.eta>=18||p.fuori||p.conEx||!p.pers)return;
  const G=S.genit,st=STILE_GEN[stileGen()],forza=Math.min(1,(Math.abs(G.cal-50)+Math.abs(G.reg-50))/50);
  for(const k in st.pers)cambiaPersNpc(p,k,st.pers[k]*(.4+forza*.8));
  if(G.cal>=60)p.rapporto=clamp(p.rapporto+1);else if(G.cal<40)p.rapporto=clamp(p.rapporto-1);
  if(p.eta>=6){if(G.reg>=55)p.voto=clamp((p.voto||50)+1);else if(G.reg<35)p.voto=clamp((p.voto||50)-1)}
}
/* a 18 anni: com'è diventato, quanto ti somiglia */
function bilancioFiglio(p){
  if(!p.pers||!S.pers)return;
  const vicini=B5.map(b=>[b,Math.abs(p.pers[b.k]-S.pers[b.k]),p.pers[b.k]-50]).filter(x=>Math.abs(x[2])>=12).sort((a,b)=>a[1]-b[1]);
  const som=vicini.length&&vicini[0][1]<12?vicini[0]:null;
  const agg=aggettivi(p.pers,p.sesso,2).join(' e ')||(p.sesso==='F'?'equilibrata':'equilibrato');
  const G=S.genit,vecchie=G&&G.st.some(t=>S.t-t>=120);
  let t=`${p.nome} compie 18 anni: è ${gp(p,'un ragazzo','una ragazza')} ${agg}.`;
  if(som)t+=` Su una cosa ti somiglia moltissimo: è ${(som[2]>0?som[0].hi:som[0].lo)[0][p.sesso==='F'?1:0].toLowerCase()} come te.`;
  if(G&&G.st.length){const st=STILE_GEN[stileGen()];t+=` Crescere con un genitore ${st.n.toLowerCase()} ha lasciato il segno: ${st.d.split(': ')[1]||st.d}.`;if(vecchie){S.fatti.ritorni=(S.fatti.ritorni||0)+1;(S.ritorni=S.ritorni||[]).push({t:S.t,pid:p.id,da:G.st[0],dove:'figlio18'})}}
  log(t,'g');
}

/* ---------- Ogni mese: la vita sociale delle tue persone ---------- */
function meseSociale(){
  if(!S.gruppi){S.gruppi=[];S.legami=[]}
  // pulizia: legami e gruppi con persone che non ci sono più
  if(S.mese===0){const ids=new Set(S.relazioni.map(p=>p.id));S.legami=S.legami.filter(l=>ids.has(l.a)&&ids.has(l.b));S.gruppi.forEach(g=>g.m=g.m.filter(i=>ids.has(i)));S.gruppi=S.gruppi.filter(g=>g.m.length)}
  eduMese();
  if(S.carcere>0||S.eta<8||coda.length||S.t-(S.fatti.socT||-99)<6)return;
  const cand=[];
  for(const G of S.gruppi){
    const M=membriVivi(G).filter(x=>['Amico','Conoscente'].includes(x.ruolo)&&!x.lontano);
    if(gruppoAttivo(G)&&M.length>=2&&S.t-(G.cenaT||-99)>=36)cand.push([.012,()=>{G.cenaT=S.t;return {e:EV.leg_gruppo,d:{g:G.id}}}]);
    if(!gruppoAttivo(G)&&!G.riunito&&G.fine&&S.t-G.fine>=120&&membriVivi(G).length>=2&&S.eta>=25)cand.push([.01,()=>{G.riunito=1;return {e:EV.leg_rimpatriata,d:{g:G.id}}}]);
  }
  const am=vivi(['Amico']).filter(x=>x.eta>=16&&!x.pId&&['single','separato','vedovo'].includes(x.coppia||'single')&&!x.lontano&&!x.cella);
  for(let i=0;i<am.length;i++)for(let j=i+1;j<am.length;j++){
    const a=am[i],b=am[j];
    if(Math.abs(a.eta-b.eta)>9||!siConoscono(a,b))continue;
    const oa=orientNpc(a),ob=orientNpc(b),sesso=a.sesso===b.sesso;
    const ok=(sesso?(oa!=='etero'&&ob!=='etero'):(oa!=='omo'&&ob!=='omo'));
    if(ok&&affNpc(a,b)>=48)cand.push([.004,()=>{formaCoppiaNpc(a,b);return {e:EV.leg_coppia,d:{p:a,q:b.id}}}]);
  }
  for(const L of S.legami){
    const a=persona(L.a),b=persona(L.b);if(!a||!b||!a.vivo||!b.vivo)continue;
    if(L.t==='coppia'&&a.pId===b.id&&a.coppia!=='sposato'&&S.t-L.dal>=12)cand.push([.006,()=>{a.coppia='separato';a.sepT=S.t;separaNpc(a);return {e:EV.leg_lasciati,d:{p:a,q:b.id}}}]);
    if(L.t==='amici'&&['Amico','Fratello','Cugino'].includes(a.ruolo)&&['Amico','Fratello','Cugino'].includes(b.ruolo)&&L.f<55)cand.push([.004,()=>({e:EV.leg_lite,d:{p:a,q:b.id}})]);
  }
  const pa=partnerAttuale(),ma=vivi(['Madre'])[0],best=vivi(['Amico']).find(x=>x.best);
  if(pa&&ma&&S.eta>=20&&S.t-(pa.dal||0)>=12&&affNpc(pa,ma)<52&&!S.fatti.suoceraT)cand.push([.006,()=>{S.fatti.suoceraT=S.t;return {e:EV.leg_madre_partner,d:{p:pa,q:ma.id}}}]);
  if(pa&&best&&best.sesso!==S.sesso&&S.t-(S.fatti.gelosT||-99)>=60)cand.push([.004,()=>{S.fatti.gelosT=S.t;return {e:EV.leg_gelosia,d:{p:pa,q:best.id}}}]);
  for(const [w,f] of shuffle(cand)){if(chance(w)){S.fatti.socT=S.t;coda.push(f());return}}
}
/* crescere i figli: ogni tanto una scelta da genitore (eventi edu_), per un figlio che vive con te */
function eduMese(){
  if(coda.length||S.carcere>0||S.t-(S.fatti.eduT||-99)<8||!chance(.08))return;
  const F=vivi(['Figlio']).filter(f=>f.eta>=2&&f.eta<18&&!f.fuori&&!f.conEx);if(!F.length)return;
  const opz=[];
  for(const e of Object.values(EV)){if(!e.id.startsWith('edu_')||S.eta<e.min||S.eta>e.max)continue;if(e.once&&S.fatti['ev_'+e.id])continue;const u=S.ultimi[e.id];if(u!==undefined&&S.eta-u<(e.rip||2))continue;
    const ps=F.filter(f=>!e.pc||e.pc(f));if(ps.length)opz.push([{e,ps},1])}
  if(!opz.length)return;const sel=pesata(opz);segna(sel.e);S.fatti.eduT=S.t;coda.push({e:sel.e,d:{p:pick(sel.ps)}});
}
/* i gruppi della scuola e del lavoro si chiudono quando cambi vita (servono alle rimpatriate) */
function chiudiGruppi(){if(!S.gruppi)return;for(const G of S.gruppi){const a=gruppoAttivo(G);if(!a&&!G.fine)G.fine=S.t;else if(a&&G.fine)G.fine=0}}
/* due tue persone si mettono insieme */
function formaCoppiaNpc(a,b){for(const [x,y] of [[a,b],[b,a]]){x.coppia='coppia';x.pId=y.id;x.pNome=y.nome;x.pSesso=y.sesso;x.dalC=S.t;x.nuovoT=S.t}legame(a,b,'coppia',80);S.fatti.coppieAmici=(S.fatti.coppieAmici||0)+1}
/* due persone del gioco si lasciano: sistema entrambi */
function separaNpc(p){const q=p.pId?persona(p.pId):null;p.pId=null;if(q){q.pId=null;q.coppia='separato';q.pNome=null;q.sepT=S.t;q.umore=clamp((q.umore||50)-20);const L=legameTra(p,q);if(L)L.t='ex'}}

/* Salvataggi di prima della Fase 2: amici e conoscenti entrano nei gruppi secondo dove li avevi conosciuti */
function iniziaLegami(){
  if(S.gruppi)return;S.gruppi=[];S.legami=[];
  for(const p of S.relazioni)if(p.vivo&&['Amico','Conoscente'].includes(p.ruolo)&&!p.cella){
    const t=p.dove&&TIPI_INC.includes(p.dove)?p.dove:'quartiere';const G=gruppo(chiaveGruppo(t));if(!G.m.includes(p.id))G.m.push(p.id)}
}

/* ---------- Chiedere aiuto: i ricordi pesano ---------- */
/* ×0,4 con i torti, fino a ×1,6 con quello che hai fatto per loro */
function memoriaAiuto(p){return Math.max(.4,Math.min(1.6,1+bilancioRicordi(p)*.12))}
const minus=s=>s.charAt(0).toLowerCase()+s.slice(1);
function rifiutoRicordo(p){const m=ricordoDi(p,-1);if(!m||bilancioRicordi(p)>=0)return '';ritorno(p,m,'rifiuto');return `${p.nome} non ha dimenticato, ${quanto(m)}: ${minus(m.s)}. «Adesso ti ricordi di me?»`}
function aiutoRicordo(p){const m=ricordoDi(p,1,3);if(!m||!chance(.6))return '';ritorno(p,m,'aiuto');return ' «Con tutto quello che hai fatto per me…»'}
/* per i compleanni tondi qualcuno si ricorda di una cosa di tanti anni fa */
function auguriDalPassato(){
  const L=S.relazioni.filter(x=>x.vivo&&!['Nemico','Ex','Conoscente'].includes(x.ruolo)).map(x=>[x,ricordoDi(x,1,10)]).filter(x=>x[1]);
  if(!L.length||!chance(.7))return;const [x,m]=pick(L);
  log(`Per i tuoi ${S.eta} anni ${x.nome} ti fa gli auguri e ricorda una cosa di ${quanto(m)}: ${minus(m.s)}.`,'g');ritorno(x,m,'auguri');
}
const contestoId=p=>{const c=contestoNpc(p);return c?c.id:null};
/* un'altra persona che conosci e che conosce anche p: per parlare di amici in comune */
function inComune(p){return conoscentiDi(p).filter(x=>!['Partner','Coniuge'].includes(x.ruolo)||x.ruolo!==p.ruolo)}
