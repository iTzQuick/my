/* ================= LAVORO VISSUTO: SCELTE DI CARRIERA (ROADMAP Fase 5.3b) =================
   Cambiare settore e mettersi in proprio (emigrare è la 5.3c). Gli eventi car_ sono in d16_carriera.js.
   - SETTORE = la prima lettera RIASEC di JOB_RIASEC (c3_vita.js). Si sceglie una lettera diversa da quella del lavoro di adesso, si
     fa un corso di riqualificazione (6 mesi circa, P(2400), riesce 3 volte su 4, si ripete pagando P(900)) e arrivano 3 proposte tra i
     lavori di quella lettera i cui requisiti, tolti certificati e abilità (che il corso aggira), sono già soddisfatti: niente titoli di
     studio da conquistare, niente concorsi. Si riparte dal livello 0 (assumi), con più soddisfazione per 3 anni (L.cambioSett).
   - IN PROPRIO: partita IVA nello stesso mestiere (solo i mestieri di PIVA_LIV, dal livello 1) o un'attività di AZIENDE adatta al mestiere
     (PROPRIO_AZ, costo -15%, si finanzia con i risparmi e la liquidazione). Con la partita IVA il reddito parte al 70%, arriva al 100%
     in 24 mesi e al 115% in 60 (fattoreProprio, dentro ralEff). Un collega che propone di andare via insieme diventa amico e, con
     un'attività, il primo dipendente. */
const RIASEC_VIA={R:'Lavorare con le mani',I:'Capire e analizzare',A:'Creare',S:'Aiutare le persone',E:'Guidare, vendere, convincere',C:'Organizzare e far tornare i conti'};
const letteraJob=id=>(JOB_RIASEC[id]||'C')[0];
const COSTO_CORSO=2400,COSTO_RITENTA=900;
/* i requisiti che un corso aggira: i certificati che si prendono con un corso normale (fino a 5.000 € di oggi: non la licenza di volo né quella del taxi);
   il resto (titoli, abilitazioni, abilità, età, patente, fedina…) deve già esserci */
const CERT_BREVI=()=>CORSI.filter(c=>c.cert&&c.costo<=5000).map(c=>c.cert);
const senzaCert=q=>{if(!q)return q;const q2={...q};if(q2.cert&&CERT_BREVI().includes(q2.cert))delete q2.cert;if(q2.or)q2.or=q2.or.map(senzaCert);return q2};
const aggirabile=q=>mancanti(senzaCert(q)).length===0;
function lavoriSettore(l){
  return LAVORI.filter(j=>!j.pt&&!j.conc&&!j.elez&&!j.nascosto&&lavoroInEpoca(j)&&letteraJob(j.id)===l&&!(S.lavoro&&j.id===S.lavoro.id)
    &&!SENZA_SQUADRA.includes(j.id)&&!SPORTIVI.includes(j.id)&&aggirabile(j.req));
}
function settoriPossibili(){
  const cur=S.lavoro?letteraJob(S.lavoro.id):null;
  return 'RIASEC'.split('').filter(l=>l!==cur&&lavoriSettore(l).length>0);
}
/* tre proposte: i lavori della lettera più vicini ai tuoi interessi (con un po' di caso) */
function proposteSettore(l){
  return lavoriSettore(l).map(j=>[j,matchLavoro(j.id)+r(-8,8)]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
}
function esameCorso(d){
  const l=d.x.l,f=d.x.f||0;
  if(chance(.75)){S.fatti.corsoRiq=(S.fatti.corsoRiq||0)+1;mod('felicita',3);coda.unshift({e:EV.car_nuovo,d:{x:{l}}});return null}
  pesa(5,2);mod('felicita',-3);futuro(.1,'car_corso',{x:{l,f:f+1}});
  return ['Per pochi punti. Ti dicono che puoi ripetere l\'esame tra un mese, pagando di nuovo l\'iscrizione.','b'];
}
function nuovoSettore(j){
  const vecchio=S.lavoro?S.lavoro.nome:null;
  assumi(j);
  const L=S.lavoro;L.cambioSett=S.t;S.fatti.cambiSett=(S.fatti.cambiSett||0)+1;
  mod('felicita',8);S.bis.stress=clamp(S.bis.stress-4);
  return [`${vecchio?`Lasci il posto da ${vecchio.toLowerCase()}. `:''}Ti assumono come ${L.nome.toLowerCase()}, con una RAL di ${eur(L.stip)}: si riparte dal gradino più basso, ma ti senti più nel posto giusto.`,'g'];
}

/* ---------- In proprio ---------- */
const PROPRIO_AZ={cuoco:['pizzeria','bar'],cam:['bar','pizzeria'],bpt:['bar'],parr:['estetico'],este:['estetico'],pt:['palestra'],mur:['edile'],idra:['edile'],elet:['edile'],fale:['edile'],
  pane:['negozio'],past:['negozio'],macel:['negozio'],com:['negozio'],cpt:['negozio'],cass:['negozio'],mag:['negozio'],tec:['shop','startup'],pro:['startup','shop'],ds:['startup'],
  gra:['agenzia'],mkt:['agenzia'],cons:['agenzia','startup'],gio:['agenzia'],imp:['negozio','shop'],segr:['negozio'],man:['agenzia','startup'],ing:['edile','startup'],ope:['edile']};
const COSTO_PIVA=5000;
const tfrNetto=()=>Math.round((S.lavoro&&S.lavoro.tfr||0)*.77);
/* il primo anno e mezzo rende meno, poi si guadagna più che da dipendente */
function fattoreProprio(L){
  if(!L||L.proprioT===undefined)return 1;
  const m=S.t-L.proprioT;
  return m<24?.7+.3*(m/24):Math.min(1.15,1+.15*((m-24)/36));
}
function opzioniProprio(){
  const L=S.lavoro;if(!L||S.azienda)return [];
  const o=[];
  if(PIVA_LIV[L.id]!==undefined&&!isPiva(L)&&L.liv>=1)o.push({k:'piva'});
  for(const id of (PROPRIO_AZ[L.id]||[])){const t=AZ(id);if(t&&!fuoriEpoca(t.n))o.push({k:'az',t})}
  return o;
}
function proprioPossibile(){
  const L=S.lavoro;
  return !!L&&!S.azienda&&!sportSq()&&S.eta>=24&&S.eta<=58&&(L.anni||0)>=2&&!(L.contratto&&L.contratto.t==='carica')&&!JOB[L.id].elez&&!SENZA_SQUADRA.includes(L.id)&&opzioniProprio().length>0;
}
const costoProprio=o=>o.k==='piva'?P(COSTO_PIVA):P(o.t.costo*.85);
function avviaProprio(o,qid){
  const L=S.lavoro,costo=costoProprio(o);
  if(!L)return ['Non hai più un lavoro da cui partire.','x'];
  if(S.soldi+tfrNetto()<costo)return [`Ti servono ${eur(costo)} tra risparmi e liquidazione: per ora non ci sei.`,'x'];
  const q=qid?persona(qid):null;
  pagaTFR();soldi(-costo);S.fatti.proprioT=S.t;
  let txt;
  if(o.k==='piva'){
    L.contratto={t:'piva',da:S.t};L.proprioT=S.t;L.sq=null;
    txt=`Apri ${S.anno>=1973?'la partita IVA':'un\'attività tua'} come ${L.nome.toLowerCase()}. I primi due anni saranno più magri; poi, se tieni, si guadagna di più che da dipendente.`;
    futuro(2,'car_proprio2',{x:{k:'piva'}});
  }else{
    const nome=L.nome;S.storico.push(nome);S.lavoro=null;nuovaAzienda(o.t);
    if(q&&q.vivo)S.azienda.dip=1;
    txt=`Lasci il posto da ${nome.toLowerCase()} e apri ${S.azienda.n}. In bocca al lupo!`;
    futuro(2,'car_proprio2',{x:{k:'az'}});
  }
  mod('felicita',6);
  if(q&&q.vivo){
    if(q.lav)q.lav.via=S.t;
    if(q.ruolo==='Conoscente'&&vivi(['Amico']).length<12)q.ruolo='Amico';
    relD(q,12);q.stato='lavora';ricorda(q,'Siete partiti insieme: adesso lavorate per voi',3);
    txt+=` ${q.nome} viene con te${o.k==='az'?' come primo dipendente':''}.`;
  }
  return [txt,'g'];
}
/* il collega e tu cambiate azienda insieme: stesso mestiere e livello, +10%, anzianità dimezzata; lui entra nella tua nuova squadra */
function passaAltraAzienda(p){
  const old=S.lavoro,j=JOB[old.id],liv=old.liv,stip=old.stip,anni=old.anni,anniLiv=old.anniLiv;
  assumi(j);
  const L=S.lavoro;L.liv=liv;L.nome=nomeJob(j,liv);L.stip=Math.round(stip*1.1);L.anni=Math.floor(anni/2);L.anniLiv=anniLiv;S.ultimoLavoro=L.nome;
  mod('felicita',5);
  if(p&&p.vivo&&L.sq){
    p.lav={id:L.id,da:L.da,r:'collega',t:S.t};p.stato='lavora';
    const G=gruppo(chiaveGruppo('lavoro'));if(!G.m.includes(p.id))G.m.push(p.id);
    relD(p,10);ricorda(p,'Avete cambiato azienda insieme',3);
  }
  return [`Date le dimissioni lo stesso giorno. Nella nuova azienda sei ${L.nome.toLowerCase()} con una RAL di ${eur(L.stip)}, +10%${p?`, e c'è anche ${p.nome}`:''}.`,'g'];
}
