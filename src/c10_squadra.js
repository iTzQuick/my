/* ================= LAVORO VISSUTO: CAPO E COLLEGHI (ROADMAP Fase 5.3a) =================
   Il capo e 2–3 colleghi sono persone vere finché resti in quel lavoro. Non c'è un ruolo nuovo: restano `Conoscente`
   (o `Amico`, se diventate amici) con il marchio p.lav = {id, da, r:'capo'|'collega', t, via?, fine?}:
   - id e da sono quelli di S.lavoro (gli stessi del gruppo lavoro:<id>:<da> di c8_legami.js, dove entrano alla nascita);
   - via = la persona se n'è andata dall'azienda (turnover, pensione); fine = sei tu che hai cambiato lavoro.
   Finché lavInCorso(p) il rapporto non sbiadisce (c4_persone.js) e si muove da solo: il capo secondo il suo carattere e il
   tuo rendimento, i colleghi secondo l'affinità. Quando il lavoro finisce chi ti era vicino resta amico, gli altri diventano
   «ex colleghi» e sbiadiscono come ogni conoscente.
   S.lavoro.sq = {n colleghi, prossimo, capoT, capoN}: undefined = non ancora deciso (salvataggi vecchi), null = nessuna squadra
   (partita IVA, carica elettiva, lavoretti senza posto fisso, e chi ha già un'azienda quando viene assunto).
   Il capo conta (capoEsito: da −1 a +1): ±10 sulla soddisfazione, ∓2,5 sullo stress, ±5 punti sulla probabilità di promozione e aumento.
   Gli sportivi hanno un allenatore e i compagni di squadra. Gli eventi sono in d15_lavoro.js (col_ e prg_). */
const SENZA_SQUADRA=['vol','rip'];
const squadraPossibile=L=>!!L&&!!JOB[L.id]&&!SENZA_SQUADRA.includes(L.id)&&!isPiva(L)&&!(L.contratto&&L.contratto.t==='carica')&&!JOB[L.id].elez;
const lavInCorso=p=>!!(p&&p.vivo&&p.lav&&!p.lav.via&&S&&S.lavoro&&S.lavoro.sq&&p.lav.id===S.lavoro.id&&p.lav.da===S.lavoro.da&&squadraPossibile(S.lavoro));   // se il contratto diventa partita IVA a metà mese la squadra è già finita
const sportSq=()=>!!S.lavoro&&SPORTIVI.includes(S.lavoro.id);
function squadra(){
  const v=S.relazioni.filter(lavInCorso);
  return {capo:v.find(p=>p.lav.r==='capo')||null,colleghi:v.filter(p=>p.lav.r==='collega')};
}
/* com'è il capo con te, da −1 (insopportabile) a +1 (un capo come si deve): carattere suo e rapporto con te */
function capoEsito(){
  const c=squadra().capo;if(!c||!c.pers)return 0;
  return Math.max(-1,Math.min(1,((c.pers.A-50)*.5-(c.pers.N-50)*.25+(c.pers.C-50)*.15+(c.rapporto-50)*.5)/30));
}
function etichettaLav(p){
  const L=p.lav,sport=SPORTIVI.includes(L.id),ex=!lavInCorso(p);
  if(L.r==='capo'){const n=sport?gp(p,'Allenatore','Allenatrice'):['maes','edu','ins'].includes(L.id)?'Dirigente':gp(p,'Capo','Responsabile');return ex?'Ex '+n.toLowerCase():n}
  const n=sport?gp(p,'Compagno di squadra','Compagna di squadra'):'Collega';
  return p.ruolo==='Amico'?(sport?n:gp(p,'Collega e amico','Collega e amica')):(ex?'Ex '+n.toLowerCase():n);
}
const nomeCapoDi=p=>SPORTIVI.includes(p.lav.id)?gp(p,'allenatore','allenatrice'):['maes','edu','ins'].includes(p.lav.id)?'dirigente':gp(p,'capo','responsabile');

function nuovoDelLavoro(rl,L){
  const sport=SPORTIVI.includes(L.id),f=DONNE[L.id]!==undefined?DONNE[L.id]:.42;
  const ses=chance(rl==='capo'?f*.8:f)?'F':'M';
  // il capo di solito è più grande di te, ma con gli anni cala la differenza (a 55 anni il capo ne ha 35–58); nessuno è vicino alla pensione all'arrivo
  let eta=rl==='capo'?(S.eta>=50?r(36,58):S.eta+r(-4,16)):S.eta+r(-9,9);
  if(sport)eta=rl==='capo'?S.eta+r(4,22):S.eta+r(-3,5);
  const lo=sport?(rl==='capo'?28:16):(rl==='capo'?27:17),hi=sport?(rl==='capo'?60:42):(rl==='capo'?60:62);
  eta=Math.max(lo,Math.min(hi,eta));
  return nuovaPersona('Conoscente',ses,eta,null,{rapporto:rl==='capo'?r(30,45):r(30,48),dove:'lavoro',look:lookCasuale(ses),stato:'lavora',lavoro:L.id,lav:{id:L.id,da:L.da,r:rl,t:S.t}});
}
function arrivoCapo(L,silenzioso){
  const p=nuovoDelLavoro('capo',L),sq=L.sq;sq.capoN=(sq.capoN||0)+1;sq.capoT=undefined;
  if(!silenzioso){
    const sport=SPORTIVI.includes(L.id);
    log(`${sq.capoN>1?gp(p,'Il nuovo','La nuova')+' '+nomeCapoDi(p)+' è':gp(p,sport?'Il tuo allenatore è':'Il tuo capo è',sport?'La tua allenatrice è':'La tua responsabile è')} ${p.nome} ${p.cognome}, ${p.eta} anni. Sembra ${descrPers(p.pers,p.sesso)}.`,'h');
    if(sq.capoN>1&&!coda.length&&S.carcere===0&&S.t-(S.fatti.nuovoCapoT===undefined?-999:S.fatti.nuovoCapoT)>=36){S.fatti.nuovoCapoT=S.t;coda.push({e:EV.col_nuovo_capo,d:{p}})}
  }
  return p;
}
function arrivoCollega(L,silenzioso){
  const p=nuovoDelLavoro('collega',L),sq=L.sq;
  sq.arr=(sq.arr||0)+1;sq.prossimo=S.t+(sq.arr<sq.n?1:r(1,3));   // i primi uno al mese, poi i ricambi a caso
  if(!silenzioso)log(SPORTIVI.includes(L.id)?`${p.nome} ${p.cognome}, ${p.eta} anni, entra in squadra con te. Sembra ${descrPers(p.pers,p.sesso)}.`
    :`${p.nome} ${p.cognome}, ${p.eta} anni, ${gp(p,'è il tuo nuovo collega','è la tua nuova collega')}. Sembra ${descrPers(p.pers,p.sesso)}.`,'h');
  return p;
}
/* all'assunzione: il capo subito, i colleghi uno al mese nei primi tre mesi (silenzioso = salvataggi vecchi e prove: tutti subito, senza diario) */
function iniziaSquadra(silenzioso){
  const L=S&&S.lavoro;
  if(!L||L.sq!==undefined||!S.vivo||!S.relazioni)return;
  if(!S.gruppi)iniziaLegami();
  if(!squadraPossibile(L)||S.azienda){L.sq=null;return}
  L.sq={n:r(2,3),prossimo:S.t+1,capoN:0};
  arrivoCapo(L,silenzioso);
  if(silenzioso)completaSquadra(true);
}
function completaSquadra(silenzioso){
  const L=S.lavoro;if(!L)return;
  if(L.sq===undefined){iniziaSquadra(true);return}
  if(!L.sq||!squadraPossibile(L))return;
  if(!squadra().capo)arrivoCapo(L,true);
  for(let k=0;k<8&&squadra().colleghi.length<L.sq.n;k++){const p=arrivoCollega(L,true);if(silenzioso)p.rapporto=r(38,62)}
  if(silenzioso)for(const p of S.relazioni.filter(lavInCorso))if(p.lav.r==='capo')p.rapporto=r(38,62);
}
function vaViaDalLavoro(p,txt,k){
  p.lav.via=S.t;p.stato=p.eta>=65?'pensione':'lavora';
  if(p.eta>=65)p.pensT=S.t;
  if(txt)log(txt,k||'h');
}
function meseSquadra(){
  if(!S.relazioni||!S.gruppi)return;
  // il lavoro è finito (o è cambiato): chi ti era vicino resta amico, gli altri sono ex colleghi che sbiadiscono
  const restano=[];
  for(const p of S.relazioni){
    if(!p.vivo||!p.lav||p.lav.via||p.lav.fine||lavInCorso(p))continue;
    p.lav.fine=S.t;
    if(p.ruolo==='Conoscente'&&p.rapporto>=(p.lav.r==='capo'?65:55)&&vivi(['Amico']).length<12){p.ruolo='Amico';restano.push(p)}
  }
  if(restano.length)log(`Di chi lavorava con te ${restano.length===1?`${restano[0].nome} resta ${gp(restano[0],'un amico',"un'amica")}`:`restano amici ${nomi(restano.map(p=>p.nome))}`}.`,'g');
  const L=S.lavoro;if(!L||S.carcere>0)return;
  if(L.sq===undefined)iniziaSquadra(true);
  if(!L.sq)return;
  if(!squadraPossibile(L)){L.sq=null;return}     // diventi partita IVA o eletto: la squadra finisce
  const sq=L.sq;let {capo,colleghi}=squadra();
  // il capo se ne va (pensione, trasferimento…) o non c'è più: ne arriva un altro
  if(capo&&(capo.eta>=65||chance(1/72))){
    const sport=SPORTIVI.includes(L.id);
    vaViaDalLavoro(capo,capo.eta>=65?`${capo.nome} ${capo.cognome}, ${gp(capo,'il tuo '+nomeCapoDi(capo),'la tua '+nomeCapoDi(capo))}, va in pensione.`:sport?`${capo.nome} ${capo.cognome} lascia la panchina.`:`${capo.nome} ${capo.cognome}, ${gp(capo,'il tuo '+nomeCapoDi(capo),'la tua '+nomeCapoDi(capo))}, viene trasferit${gp(capo,'o','a')} in un'altra sede.`);
    sq.capoT=S.t+r(0,2);capo=null;
  }
  if(!capo&&(sq.capoT===undefined||S.t>=sq.capoT))capo=arrivoCapo(L,false);
  // i colleghi vanno e vengono
  for(const p of colleghi){
    if(p.eta>=65||chance(1/40)){
      const sport=SPORTIVI.includes(L.id);
      vaViaDalLavoro(p,p.eta>=65?`${p.nome} va in pensione.`:sport?`${p.nome} viene ceduto${gp(p,'','a')} a un'altra squadra.`:pick([`${p.nome} lascia l'azienda: ha trovato un altro lavoro.`,`${p.nome} si trasferisce in un'altra sede.`]));
      sq.prossimo=Math.max(sq.prossimo||0,S.t+r(1,4));
    }
  }
  colleghi=colleghi.filter(p=>lavInCorso(p));
  if(colleghi.length<sq.n&&S.t>=(sq.prossimo||0))colleghi.push(arrivoCollega(L,false));
  // il rapporto si muove da solo: il capo secondo il suo carattere e come lavori, i colleghi secondo l'affinità
  for(const p of [capo,...colleghi]){
    if(!p)continue;
    p.stato='lavora';p.ultimo=S.t;
    const t=p.lav.r==='capo'?clamp(46+(p.pers.A-50)*.3-(p.pers.N-50)*.1+(L.perf-60)*.18):clamp(36+affinita(p)*.4+(S.pers.E-50)*.05);
    relD(p,(t-p.rapporto)*.06);
    if(p.lav.r==='collega'&&p.ruolo==='Conoscente'&&p.rapporto>=62&&S.t-(p.da||0)>=6&&vivi(['Amico']).length<12){
      p.ruolo='Amico';p.rapporto=Math.max(p.rapporto,60);
      log(`${p.nome} non è più solo ${gp(p,'un collega','una collega')}: siete diventati amici.`,'g');
    }
  }
  eventoLavoro();
}
/* un fatto del lavoro ogni tanto (circa 5–6 in una carriera): la lista COL_EV è in d15_lavoro.js */
function eventoLavoro(){
  if(coda.length||S.carcere>0||S.fatti.congedo>S.t||(S.lavoro.cig>0)||!chance(.012))return;
  const sq=squadra();if(!sq.capo&&!sq.colleghi.length)return;
  const lista=COL_EV.filter(e=>S.t-(S.fatti['colT_'+e.id]===undefined?-9999:S.fatti['colT_'+e.id])>=e.rip*12&&e.ok(sq,S.lavoro));
  if(!lista.length)return;
  const e=pesata(lista.map(x=>[x,typeof x.w==='function'?x.w():x.w])),d=e.d(sq);
  if(!d)return;
  S.fatti['colT_'+e.id]=S.t;
  coda.push({e:EV[e.id],d});
}
