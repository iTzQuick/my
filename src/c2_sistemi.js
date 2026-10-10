/* ================= SISTEMI: MONDO, TASSE, BORSA, AZIENDA, SOCIAL, FAMA, CRIMINE, NEMICI, DIALOGHI, COLLOQUI ================= */
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const ip=()=>(S&&S.mondo?S.mondo.ip:1);
const P=x=>Math.round(x*ip());
/* Gli importi scritti nei testi («400 €», «1.800 €», con lo spazio normale) sono ai prezzi del 2026: prezzi() li porta all'anno del gioco.
   eur() scrive con lo spazio non separabile, quindi un testo già convertito non cambia. Usato da fogli, esiti, diario e attività. */
const prezzi=s=>typeof s==='string'&&S&&S.mondo?s.replace(/(\d{1,3}(?:\.\d{3})+|\d+) €/g,(m,n)=>eur(P(+n.replace(/\./g,'')))):s;
function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}

/* ---------- Mondo ---------- */
/* anno: anno di nascita. Chi nasce prima del 2026 trova i prezzi veri di quell'anno (ipAnno in c7_italia.js) */
function mondoBase(anno){const pr={};TITOLI.forEach(t=>pr[t.id]=100);const ip0=anno&&anno<ANNO_OGGI?ipAnno(anno):1;return {ip:ip0,infl:.02,crisi:0,boom:0,pandemia:0,bolla:0,mattone:ip0,pensEta:67,prezzi:pr,var:{},notizie:[]}}
function notizia(t){S.mondo.notizie.push({anno:S.anno,eta:S.eta,t});if(S.mondo.notizie.length>80)S.mondo.notizie.shift();log(t,'n')}
/* Fino al 2026 crisi, pandemie, elezioni e terremoti sono quelli veri (storiaMese in c7_italia.js); dopo, il mondo li inventa */
function annoMondo(){
  const M=S.mondo,anno=S.anno,vero=anno<=ANNO_OGGI;
  if(M.crisi>0){M.crisi--;if(!M.crisi)notizia('L\'economia riparte: la crisi è finita.')}
  if(M.boom>0){M.boom--;if(!M.boom)notizia('Il boom economico rallenta.')}
  if(M.pandemia>0){M.pandemia--;if(!M.pandemia)notizia('La pandemia è finita. Si torna alla normalità.')}
  if(M.bolla>0){M.bolla--;if(!M.bolla){notizia('Scoppia la bolla immobiliare: il valore delle case crolla del 20%.');S.prop.forEach(p=>p.valore=Math.round(p.valore*.8));M.mattone*=.8}}
  if(!vero){
    if(!M.crisi&&!M.boom&&chance(.045)){M.crisi=r(2,3);notizia('Crisi economica: le aziende tagliano posti di lavoro e la Borsa crolla.')}
    else if(!M.crisi&&!M.boom&&chance(.035)){M.boom=r(2,4);notizia('Boom economico: l\'economia corre e le aziende assumono.')}
    if(!M.pandemia&&chance(.012)){M.pandemia=2;notizia('Pandemia: un nuovo virus costringe tutti a restare a casa.');if(S.eta>=3)coda.push({e:EV.lockdown,d:{}})}
    if(!M.bolla&&chance(.02)){M.bolla=r(3,5);notizia('Il mercato immobiliare impazzisce: i prezzi delle case salgono alle stelle.')}
    if(M.pensEta<71&&chance(.015)){M.pensEta++;notizia(`Riforma delle pensioni: ora ci si va a ${M.pensEta} anni.`)}
  }
  M.infl=vero&&INFL_VERA[anno-1]!==undefined?INFL_VERA[anno-1]/100:(M.crisi?r(4,8):M.boom?r(2,4):r(1,3))/100+(M.pandemia?.01:0);
  M.ip*=1+M.infl;
  M.mattone*=1+M.infl+(M.bolla?.06:0)-(M.crisi?.05:0)+r(-2,2)/100;
  for(const t of TITOLI){
    let x=t.drift+t.vol*gauss()+(M.crisi?-.22:0)+(M.boom?.12:0)+(M.pandemia?(t.id==='farma'?.25:t.id==='tech'?.1:-.12):0);
    x=Math.max(-.85,Math.min(3,x));M.var[t.id]=x;M.prezzi[t.id]=Math.max(.5,+(M.prezzi[t.id]*(1+x)).toFixed(2));
  }
  if(vero)return;
  if(anno%4===2&&chance(.07)){notizia('L\'Italia vince i Mondiali di calcio! Si festeggia in tutte le piazze.');mod('felicita',5)}
  if((anno-2022)%5===0)elezioniPolitiche();
  const L=luogo();
  if(['Centro','Sud','Isole'].includes(L.zona)&&chance(.006))coda.push({e:EV.terremoto,d:{}});
  if(chance(.006))coda.push({e:EV.alluvione,d:{}});
}

/* ---------- Tasse ---------- */
/* Scaglioni IRPEF veri per anno: fino al 2021 cinque aliquote, 2022–23 quattro, 2024–25 tre (23/35/43), dal 2026 23/33/43 (legge 199/2025).
   Dopo il 2026 gli scaglioni seguono i prezzi (fattoreFisco), altrimenti in 60 anni d'inflazione tutti finirebbero al 43%. */
const SCAGLIONI=[[2022,[[15000,.23],[28000,.27],[55000,.38],[75000,.41],[1/0,.43]]],[2024,[[15000,.23],[28000,.25],[50000,.35],[1/0,.43]]],[2026,[[28000,.23],[50000,.35],[1/0,.43]]],[1e9,[[28000,.23],[50000,.33],[1/0,.43]]]];
const annoFisco=()=>S&&S.anno?S.anno:2026;
const fattoreFisco=()=>annoFisco()>2026?Math.max(1,ip()):1;
function irpef(i){
  const sc=SCAGLIONI.find(x=>annoFisco()<x[0])[1],f=fattoreFisco();
  let t=0,da=0;for(const [a,al] of sc){const lim=a*f;if(i>da)t+=(Math.min(i,lim)-da)*al;da=lim}
  return t;
}
function detrazione(r0){const f=fattoreFisco();r0/=f;let d;if(r0<=15000)d=1955;else if(r0<=28000)d=1910+1190*(28000-r0)/13000;else if(r0<=50000)d=1910*(50000-r0)/22000;else d=0;return d*f}
function netto(l){if(l<=0)return 0;const inps=l*.0919,imp=l-inps;const t=Math.max(0,irpef(imp)-detrazione(imp))+imp*.02;return Math.round(l-inps-t)}
function tasseDettaglio(l){const inps=l*.0919,imp=l-inps;const ir=Math.max(0,irpef(imp)-detrazione(imp)),add=imp*.02;return {inps:Math.round(inps),irpef:Math.round(ir),addiz:Math.round(add),netto:Math.round(l-inps-ir-add)}}

/* ---------- Borsa ---------- */
function valoreBorsa(X){X=X||S;let t=0;for(const id in X.borsa)t+=X.borsa[id]*X.mondo.prezzi[id];return Math.round(t)}
function compraTitolo(id,imp){
  const t=TITOLI.find(x=>x.id===id);
  if(S.soldi<imp)return [`Non hai abbastanza soldi (servono ${eur(imp)}).`,'x'];
  S.borsa[id]=(S.borsa[id]||0)+imp/S.mondo.prezzi[id];S.costoBorsa[id]=(S.costoBorsa[id]||0)+imp;soldi(-imp);
  return [`Compri ${eur(imp)} di ${t.n}.`,''];
}
function vendiTitolo(id){
  const t=TITOLI.find(x=>x.id===id),q=S.borsa[id]||0;if(!q)return ['Non possiedi questo titolo.','x'];
  const v=Math.round(q*S.mondo.prezzi[id]),gain=v-(S.costoBorsa[id]||0),tax=gain>0?Math.round(gain*.26):0;
  soldi(v-tax);delete S.borsa[id];delete S.costoBorsa[id];
  return [`Vendi ${t.n} per ${eur(v)}${tax?`, con ${eur(tax)} di tasse sul guadagno`:gain<0?`, in perdita di ${eur(-gain)}`:''}.`,gain>=0?'g':'b'];
}
function dividendi(){let t=0;for(const id in S.borsa){const T0=TITOLI.find(x=>x.id===id);if(T0)t+=S.borsa[id]*S.mondo.prezzi[id]*T0.div}return Math.round(t*.74)}

/* ---------- Prestiti ---------- */
function residuoPrestiti(X){X=X||S;return (X.prestiti||[]).reduce((s,p)=>s+p.residuo,0)}
function chiediPrestito(imp){
  const L=S.lavoro;
  if(!L||JOB[L.id].pt)return ['La banca rifiuta: serve un lavoro stabile.','b'];
  if(S.fatti.crif!==undefined&&S.eta-S.fatti.crif<7)return ['La banca rifiuta: sei segnalat'+g('o','a')+' come cattivo pagatore.','b'];
  const rata=rataMutuo(imp,5,.085),gia=S.prestiti.reduce((s,p)=>s+p.rata,0)+S.prop.reduce((s,p)=>s+(p.mutuo?p.mutuo.rata:0),0);
  if(rata+gia>netto(L.stip)*.35)return [`La banca rifiuta: le rate supererebbero il 35% del tuo stipendio netto.`,'b'];
  S.prestiti.push({n:'Prestito personale',residuo:imp,rata,anni:5,tasso:.085});soldi(imp);
  return [`La banca ti concede ${eur(imp)}. Rata: ${eur(rata)} l'anno per 5 anni.`,''];
}
function annoPrestiti(){
  for(const p of S.prestiti){p.residuo=Math.max(0,Math.round(p.residuo*(1+p.tasso)-p.rata));p.anni--}
  const fin=S.prestiti.filter(p=>p.anni<=0||p.residuo<=0);
  fin.forEach(p=>log(`Hai finito di pagare: ${p.n.toLowerCase()}.`,'h'));
  S.prestiti=S.prestiti.filter(p=>p.anni>0&&p.residuo>0);
}

/* ---------- Azienda ---------- */
const AZ=id=>AZIENDE.find(a=>a.id===id);
function nuovaAzienda(t){
  const nomi={shop:`${S.cognome} Store`,agenzia:`Studio ${S.cognome}`,estetico:`Bellezza ${S.nome}`,startup:`${S.cognome.replace(/\W/g,'')}Lab`,edile:`Costruzioni ${S.cognome}`,bar:`Bar ${S.nome}`,pizzeria:`Pizzeria da ${S.nome}`,palestra:`${S.cognome} Fitness`};
  S.azienda={id:t.id,n:nomi[t.id]||t.n,tipo:t.n,sedi:1,dip:0,prezzo:'medio',qualita:'buona',mkt:0,compenso:15000,cassa:0,rep:50,anni:0,investito:t.costo,ultimo:null};
}
function calcolaAzienda(A,simula){
  const T0=AZ(A.id),Pr=PREZZI_AZ[A.prezzo],Q=QUALITA_AZ[A.qualita],M=MKT_AZ[A.mkt],W=S.mondo;
  const mondo=(W.crisi?.75:1)*(W.boom?1.15:1)*(W.pandemia&&['bar','pizzeria','palestra','estetico'].includes(A.id)?.55:1)*(W.pandemia&&A.id==='shop'?1.4:1);
  const sk=1+(S.abil[T0.sk]-30)/200+(S.intelligenza-50)/400;
  const domanda=Math.round(T0.domanda*A.sedi*Pr.d*M.d*(.5+A.rep/100)*mondo*Math.max(.6,sk)*(1+S.fama/200)*(simula?1:r(85,115)/100));
  const te=S.carcere>0?0:(S.lavoro&&!JOB[S.lavoro.id].pt?.5:1);
  const cap=Math.round(T0.cap*(A.dip+te));
  const clienti=Math.min(domanda,cap);
  const ricavi=Math.round(clienti*T0.scontrino*Pr.k*ip());
  const materie=Math.round(ricavi*(1-T0.margine));
  const personale=Math.round(A.dip*T0.stip*1.35*ip());
  const affitti=Math.round(A.sedi*T0.affitto*ip());
  const qual=Math.round(ricavi*Q.costo);
  const mkt=Math.round(M.v*ip());
  const lordo=ricavi-materie-personale-affitti-qual-mkt-A.compenso;
  const tasse=lordo>0?Math.round(lordo*.27):0;
  return {domanda,cap,clienti,ricavi,materie,personale,affitti,qual,mkt,compenso:A.compenso,tasse,utile:lordo-tasse};
}
function annoAzienda(){
  const A=S.azienda;const c=calcolaAzienda(A,false);
  A.cassa+=c.utile;A.ultimo=c;A.anni++;
  A.rep=clamp(A.rep+QUALITA_AZ[A.qualita].rep+(c.domanda>c.cap*1.15?-6:0)+(A.prezzo==='basso'?1:A.prezzo==='alto'?-1:0)+r(-3,3));
  if(A.cassa<-A.investito*.6&&!coda.some(q=>q.e===EV.fallimento))coda.push({e:EV.fallimento,d:{}});
  return A.compenso?netto(A.compenso):0;
}
function valoreAzienda(A){if(!A)return 0;const T0=AZ(A.id);return Math.max(0,Math.round((A.ultimo?Math.max(0,A.ultimo.utile):0)*T0.mult+A.cassa+A.sedi*T0.aprire*ip()*.5))}

/* ---------- Social e fama ---------- */
/* Tetto dei follower: dipende da quanto sei bravo a farti seguire (aspetto, arte, tecnologia, fama). Il massimo assoluto è 40 milioni. */
const CAP_FOLLOWER=40e6;
function tettoFollower(){const q=(S.aspetto+S.abil.arte+S.abil.tech)/300+S.fama/250;return Math.round(CAP_FOLLOWER*Math.pow(Math.max(.15,Math.min(1,q)),3))}
const crescita=(f,n)=>Math.round(n*Math.max(0,1-f/tettoFollower()));
function famaDaFollower(f){return f<1000?0:clamp(15*Math.log10(f)-40)}
function famaDaLavoro(){const L=S.lavoro;if(!L)return 0;if(L.id==='att')return [5,15,30,50,80][L.liv];if(L.id==='mus')return [2,10,30,70][L.liv];if(L.id==='calc')return [10,20,45,75][L.liv];return 0}
function annoFama(){
  const so=S.social;
  if(so.attivo){
    if(!S.fatti.postati)so.follower=Math.round(so.follower*.92);
    const tt=tettoFollower();if(so.follower>tt)so.follower=Math.round(Math.min(CAP_FOLLOWER,tt+(so.follower-tt)*.8));
    S.fatti.postati=0;
    if(so.comprati&&chance(.2)){so.follower=Math.round(so.follower*.5);so.comprati=0;log('Il social scopre i tuoi follower falsi e te ne cancella metà.','b')}
  }
  const prima=S.fama;
  S.fama=clamp(Math.max(S.fama*.9,famaDaFollower(so.follower),famaDaLavoro()));
  if(prima<40&&S.fama>=40)log('Ormai ti riconoscono per strada.','g');
  if(S.fama>=30&&chance(.25))mod('felicita',-2);
}
function pubblica(id){
  const so=S.social;const k='post_'+id;
  if(S.azioni[k])return [attesa(k)+'.','x'];segnaAz(k);S.fatti.postati=(S.fatti.postati||0)+1;
  const q={a:S.aspetto,v:(S.abil.arte+S.abil.tech)/2+20,k:(S.karma+S.felicita)/2,o:50}[POST.find(p=>p.id===id).sk]/100;
  let n=Math.round((30+so.follower*.03)*(.4+q*1.6)*r(50,150)/100*(1+S.fama/60));
  if(id==='opinione'&&chance(.35)){const x=Math.round(so.follower*r(10,25)/100);so.follower=Math.max(0,so.follower-x);mod('felicita',-6);if(chance(.3)){const ne=creaNemico('social');if(ne)log(`${ne.nome} ti ha preso di mira dopo il tuo post.`,'b')}return [`Shitstorm! Il tuo post fa infuriare mezzo internet. Perdi ${nf(x)} follower.`,'b']}
  if(id==='opinione')n*=2;
  n=crescita(so.follower,n);
  if(chance(.04+q*.05)){n=Math.max(n,Math.round(Math.min(n*r(10,40),Math.max(0,tettoFollower()-so.follower)*.3)));so.follower+=n;mod('felicita',8);S.fama=clamp(S.fama+3);return [`Virale! Il post fa il giro d'Italia: +${nf(n)} follower.`,'g']}
  so.follower+=n;mod('felicita',r(1,3));
  return [`${pick(['Un sacco di like.','Qualche commento carino.','Il post va bene.','I tuoi amici condividono.'])} +${nf(n)} follower.`,'g'];
}
const nf=n=>new Intl.NumberFormat('it-IT').format(Math.round(n));
function redditoSocial(X){X=X||S;const f=X.social.follower;return f>=5000?Math.round(f*.04*ip()):0}

/* ---------- Crimine ---------- */
function commettiCrimine(id){
  const C=CRIMINI.find(x=>x.id===id),k='crim_'+id;
  if(S.azioni[k])return ['Meglio non tentare la fortuna due volte di fila: '+attesa(k).toLowerCase()+'.','x'];if(S.bis.energia<14)return [stanco(),'x'];S.bis.energia=clamp(S.bis.energia-10);segnaAz(k);
  let p=C.p+S.crim.exp/150+(S.intelligenza-50)/400+(C.sk?(S.abil[C.sk]-30)/200:0);p=Math.max(.05,Math.min(.92,p));
  S.karma=clamp(S.karma+C.k);
  if(chance(p)){
    const b=P(r(C.b[0],C.b[1]));soldi(b);S.crim.exp+=C.exp;S.crim.colpi++;if(C.f)mod('felicita',C.f);
    if(chance(.08))futuro(r(1,3),'indagine',{x:C.reato});
    if(id==='rapina')S.crim.noto+=10;
    return [b?`Colpo riuscito: ${eur(b)} in tasca.`:'Nessuno ti ha vist'+g('o','a')+'.',''];
  }
  S.crim.exp+=1;
  if(chance(.7)){processo(C.reato);return ['Qualcosa va storto. Ti arrestano sul posto.','b']}
  return ['Va male, ma riesci a scappare a mani vuote.','b'];
}
function avvicinaClan(){
  if(S.crim.clan)return ['Fai già parte di un clan.','x'];
  if(S.crim.exp<4)return ['Nessuno nella malavita si fida di te. Hai bisogno di più esperienza.','b'];
  if(chance(.6)){S.crim.clan={nome:`il clan ${pick(['dei Ferraro','del Porto','della Collina','dei Santoro','del Viale','dei Marino'])}`,grado:0,lealta:50,anni:0,missioni:0};S.karma=clamp(S.karma-8);return [`Entri nel ${S.crim.clan.nome.replace('il ','')} come ${GRADI_CLAN[0].toLowerCase()}. Da qui non si torna indietro facilmente.`,'']}
  return ['Ti fanno aspettare. Forse l\'anno prossimo.',''];
}
function missione(id){
  const C=S.crim.clan,M=MISSIONI.find(x=>x.id===id),k='mis_'+id;if(!C)return ['Non sei in un clan.','x'];
  if(S.azioni[k])return ['Il clan ti darà altri incarichi l\'anno prossimo.','x'];
  if(C.grado<(M.grado||0))return [`Serve il grado di ${GRADI_CLAN[M.grado].toLowerCase()}.`,'x'];
  S.azioni[k]=1;S.karma=clamp(S.karma-3);
  if(chance(Math.min(.95,M.p+S.crim.exp/250))){
    const b=P(r(M.b[0],M.b[1]));soldi(b);C.lealta=clamp(C.lealta+M.lealta);C.missioni++;S.crim.exp+=2;
    let t=`Missione compiuta. Il clan ti dà ${eur(b)}.`;
    if(C.grado<GRADI_CLAN.length-1&&C.missioni>=(C.grado+1)*3&&C.lealta>=60&&chance(.5)){C.grado++;t+=` Sali di grado: ora sei ${GRADI_CLAN[C.grado].toLowerCase()}.`;S.crim.noto+=5}
    return [t,'g'];
  }
  C.lealta=clamp(C.lealta-5);
  if(chance(M.arr*2)){processo('associazione');return ['Una retata della polizia. Ti arrestano.','b']}
  mod('salute',-r(5,15));return ['La missione fallisce e torni a casa ferit'+g('o','a')+'. Il capo non è contento.','b'];
}
function annoClan(){
  const C=S.crim.clan;if(!C)return 0;
  C.anni++;C.lealta=clamp(C.lealta-r(0,6));
  if(C.lealta<25&&!coda.some(q=>q.e===EV.clan_sospetto))coda.push({e:EV.clan_sospetto,d:{}});
  return S.carcere>0?0:P([0,3000,9000,25000,70000][C.grado]);
}
function lasciaClan(pentito){
  const C=S.crim.clan;if(!C)return null;
  if(pentito){
    S.crim.clan=null;S.fatti.pentito=1;S.karma=clamp(S.karma+6);creaNemico('clan');
    const altre=comuni().filter(c=>c.p>20000&&PROV[c.s]&&PROV[c.s].z!==luogo().zona);const nuova=pick(altre);
    const da=S.citta;S.citta=nuova.n;S.prov=nuova.s;if(S.casa.tipo!=='carcere')S.casa=affittoBase('Monolocale');dopoTrasloco(da);
    if(S.carcere>0)S.carcere=Math.max(1,Math.ceil(S.carcere/2));
    return [`Collabori con la giustizia. Il programma di protezione ti trasferisce a ${nuova.n}. Il clan non te lo perdonerà.`,''];
  }
  if(chance(.45)){S.crim.clan=null;creaNemico('clan');return ['Riesci a uscire dal clan. Ma ora qualcuno ce l\'ha con te.','']}
  mod('salute',-25);mod('felicita',-10);C.lealta=clamp(C.lealta+10);return ['Ti fanno capire, con le cattive, che dal clan non si esce.','b'];
}

/* ---------- Carcere ---------- */
function azCarcere(id){
  const G=S.galera,k='c_'+id;
  if(S.azioni[k])return [attesa(k)+'.','x'];segnaAz(k);
  switch(id){
    case 'condotta':G.condotta++;if(S.carcere>1&&chance(.35)){S.carcere--;return ['Il magistrato di sorveglianza ti riduce la pena di un anno.','g']}S.karma=clamp(S.karma+2);return ['Ti comporti bene. Gli agenti lo notano.',''];
    case 'studia':mod('intelligenza',r(2,4));G.studio++;
      if(S.istr.liv<2&&G.studio>=3){S.istr.liv=2;S.istr.dip='Istituto professionale';G.studio=0;return ['Ottieni il diploma in carcere!','g']}
      if(S.istr.liv>=2&&S.istr.liv<3&&G.studio>=4){S.istr.liv=3;S.istr.lauree.push({n:'Lettere',liv:'triennale',voto:r(95,110)});G.studio=0;return ['Ti laurei in Lettere al polo universitario del carcere!','g']}
      return ['Un altro anno sui libri.','g'];
    case 'palestra':eff({s:3,a:1,sport:3});return ['Ti alleni ogni giorno.','g'];
    case 'lavora':soldi(P(1800));return ['Lavori in lavanderia: 1.800 € in un anno.','g'];
    case 'cucina':eff({cucina:8});if(!S.istr.cert.includes('Cuoco professionista')&&chance(.4)){S.istr.cert.push('Cuoco professionista');return ['Il corso di cucina del carcere ti dà l\'attestato da cuoco.','g']}return ['Impari a cucinare per duecento persone.','g'];
    case 'banda':if(G.banda)return ['Fai già parte di una banda.','x'];G.banda=pick(BANDE);G.rispetto=20;S.karma=clamp(S.karma-3);return [`Entri con ${G.banda}. Ora hai protezione, ma anche obblighi.`,''];
    case 'permesso':if(G.scontata<1||G.condotta<2){S.azioni[k]=0;return ['Per il permesso premio servono almeno un anno scontato e due anni di buona condotta.','x']}
      if(chance(.55)){mod('felicita',10);relGenitori(6);const pa=partnerAttuale();if(pa)pa.rapporto=clamp(pa.rapporto+8);return ['Ottieni un permesso premio: tre giorni a casa con chi ami.','g']}return ['Il giudice respinge il permesso.','b'];
    case 'udienza':if(G.scontata<Math.ceil(G.pena/2)||G.condotta<2){S.azioni[k]=0;return ['Puoi chiedere la libertà condizionale dopo metà pena e con buona condotta.','x']}
      if(chance(.25+G.condotta*.08-(G.banda?.1:0))){esciCarcere();return ['Libertà condizionale concessa! Finirai la pena ai servizi sociali.','g']}return ['Libertà condizionale negata. Riprova l\'anno prossimo.','b'];
  }
}
function evadi(modo){
  const k='c_evadi';if(S.azioni[k])return ['Gli agenti ti tengono d\'occhio. Riprova l\'anno prossimo.','x'];S.azioni[k]=1;
  const p={tunnel:.1,guardia:.35,furgone:.15}[modo];
  if(modo==='guardia'){if(S.soldi<P(15000)){S.azioni[k]=0;return ['Per corrompere una guardia servono 15.000 €.','x']}soldi(-P(15000))}
  if(chance(p)){S.carcere=0;S.latitante=true;S.casa=genitoriVivi()?{tipo:'genitori'}:affittoBase('Stanza in condivisione');mod('felicita',10);return [`Sei fuori! Liber${g('o','a')}, ma ora sei latitante.`,'g']}
  S.carcere+=2;S.galera.pena+=2;mod('salute',-5);return ['Ti scoprono. Due anni in più di pena e isolamento.','b'];
}

/* ---------- Nemici ---------- */
function creaNemico(origine,persona,sesso){
  if(persona){persona.ruolo='Nemico';persona.rancore=r(50,85);persona.conv=false;persona.best=false;return persona}
  const ses=sesso||pick(['M','F']);
  return nuovaPersona('Nemico',ses,Math.max(8,S.eta+r(-6,8)),null,{rancore:r(40,80),rapporto:0,origine});
}
function annoNemici(){
  for(const p of S.relazioni.filter(x=>x.vivo&&x.ruolo==='Nemico')){p.rancore=clamp((p.rancore||50)-r(0,5));if(p.rancore<10){p.ruolo='Conoscente';p.rimuovi=true;log(`${p.nome} sembra essersi dimenticat${gp(p,'o','a')} di te.`,'h')}}
}

/* ---------- Famiglia allargata ---------- */
function creaZii(gen,cog){
  const n=pesata([[0,25],[1,35],[2,25],[3,15]]);
  for(let i=0;i<n;i++){
    const ses=pick(['M','F']);const z=nuovaPersona('Zio',ses,Math.max(16,gen.eta+r(-10,10)),ses==='M'&&cog?cog:pick(COGNOMI),{rapporto:r(40,80),lato:gen.ruolo});
    if(z.eta>=24&&chance(.65)){z.sposato=true;const k=pesata([[1,40],[2,40],[3,20]]);for(let j=0;j<k;j++)nuovaPersona('Cugino',pick(['M','F']),Math.max(0,Math.min(z.eta-20,S.eta+r(-8,10))),z.sesso==='M'?z.cognome:pick(COGNOMI),{rapporto:r(35,75),di:z.id})}
  }
}
function creaSuoceri(p){
  if(p.suoceri)return;p.suoceri=true;
  const vivo=e=>e<=100&&chance(e<80?1:e<90?.6:.3);
  const eP=p.eta+r(24,32),eM=p.eta+r(22,30);
  if(vivo(eP))nuovaPersona('Suocero','M',eP,p.cognome,{rapporto:r(35,75),famDi:p.id});
  if(vivo(eM))nuovaPersona('Suocero','F',eM,pick(COGNOMI),{rapporto:r(35,75),famDi:p.id});
  const k=pesata([[0,40],[1,40],[2,20]]);for(let i=0;i<k;i++)nuovaPersona('Cognato',pick(['M','F']),Math.max(10,p.eta+r(-8,8)),p.cognome,{rapporto:r(35,70),famDi:p.id});
  S.relazioni.filter(x=>x.famDi===p.id&&x.eta>95).forEach(x=>x.vivo=false);
}
function rimuoviSuoceri(p){S.relazioni=S.relazioni.filter(x=>x.famDi!==p.id||!['Suocero','Cognato'].includes(x.ruolo))}

/* ---------- Dialoghi ---------- */
function parla(p){
  const temi=TEMI.filter(t=>!t.c&&(!t.min||S.eta>=t.min)&&(!t.max||S.eta<=t.max)&&(!t.pmin||p.eta>=t.pmin)&&(!t.solo||t.solo.includes(p.ruolo))&&(!t.etaMax||p.eta<=t.etaMax)&&(!t.basso||p.rapporto<60)&&(t.id!=='scuola_fig'||p.eta>=6));
  // gli argomenti legati a quello che sta vivendo (lutto, neonato, lavoro nuovo…) vengono per primi
  const ctx=TEMI.filter(t=>t.c&&(!t.min||S.eta>=t.min)&&t.c(p)).slice(0,2);
  const scelte=ctx.concat(shuffle(temi.filter(t=>!t.solo&&!t.basso)).slice(0,5-ctx.length)).concat(temi.filter(t=>t.solo||t.basso));
  showSheet({k:`Parli con ${p.nome}`,t:'Di cosa parlate?',p:`${tratto(p)} · rapporto ${p.rapporto}%`,chiudi:true,d:{p},scelte:scelte.map(t=>({l:T(t.l,{p}),disabled:fatto(p.id+'t_'+t.id),fx:una(p.id+'t_'+t.id,0,()=>{
    const ok=t.ok.includes(p.tr),ko=t.ko.includes(p.tr);
    let d0,txt,k;
    if(t.c){   // parlare di quello che sta vivendo: di solito fa bene, e se ne ricorda
      if(ok||chance(.6+ppz(p,'A')*.15+p.rapporto/300)){d0=r(6,11);txt=t.si;k='g';p.umore=clamp((p.umore||50)+10);if(t.mem)ricorda(p,t.mem(p),1);if(t.dopo)t.dopo(p)}
      else{d0=-r(0,3);txt=t.no;k=''}
    }
    else if(ok||(!ko&&chance(.55+p.rapporto/300))){d0=ok?r(5,10):r(2,5);txt=t.si;k='g';if(t.id==='scuse')d0+=10;if(t.id==='ricordi'){const m=ricordoDi(p,1,10);if(m)ritorno(p,m,'ricordi')}}
    else{d0=-(ko?r(4,10):r(1,4));txt=t.no;k='b';if(t.id==='segreto'){mod('felicita',-4)}}
    p.rapporto=clamp(p.rapporto+d0);if(k==='g')mod('felicita',1);
    return [T(txt,{p})+` (${d0>0?'+':''}${d0})`,k];
  })}))});
  return KEEP;
}

/* ---------- Colloqui ---------- */
function colloquio(j){
  const set=DOMANDE_SET[SETTORE_JOB[j.id]]||[];
  const qs=[...shuffle(DOMANDE_GEN).slice(0,set.length?2:3),...(set.length?[pick(set)]:[])];
  let score=0,i=0,mstip=1;
  const finale=()=>{
    const z=luogo().zona,M0=S.mondo;
    const mercato=({'Nord-ovest':.03,'Nord-est':.04,Centro:-.03,Sud:-.12,Isole:-.13}[z]||0)-(S.eta<25?.05:0)-(S.eta>50?.1:0)-(S.eta>58?.1:0)-(M0.crisi?.12:0)+(M0.boom?.08:0);
    let p=.42+mercato+(S.intelligenza-50)/200+(S.aspetto-50)/400+Math.min(S.contributi,10)/40-(j.stip>40000?.15:0)-(S.fedina.length?.2:0)+(S.fatti.esperienza?.05:0)+S.fama/400+score*.06;
    p=Math.max(.04,Math.min(.92,p));
    let res;
    if(chance(p)){assumi(j);S.lavoro.stip=Math.round(S.lavoro.stip*mstip);if(j.id==='med'&&S.istr.spec){S.lavoro.liv=1;S.lavoro.stip=P(stipLiv(j,1));S.lavoro.nome=nomeJob(j,1);S.ultimoLavoro=S.lavoro.nome}mod('felicita',8);
      res=[`Ti prendono! Ora sei ${S.lavoro.nome.toLowerCase()}, con una RAL di ${eur(S.lavoro.stip)}.${score>=4?' Il colloquio è andato benissimo.':''}`,'g']}
    else{mod('felicita',-3);res=[score<=0?'Il colloquio è andato male. «Le faremo sapere.»':'Bel colloquio, ma hanno scelto un altro candidato.','b']}
    log(res[0],res[1]);save();risultato(res);
  };
  const step=()=>{
    if(i>=qs.length)return finale();
    const q=qs[i];
    showSheet({k:`Colloquio · ${nomeJob(j,0)} · domanda ${i+1} di ${qs.length}`,t:q.q,p:'',scelte:shuffle(q.a).map(a=>({l:a[0],fx:()=>{
      let v=a[1];
      if(a[2]==='int'&&S.intelligenza>60)v+=1;
      if(a[2]==='rischio')v=chance(.5)?2:-2;
      if(a[2]==='azzardo'){if(chance(.35)){v=2;mstip=1.1}else v=-2}
      if(a[2]==='umile')mstip=.97;
      if(a[2]==='arte')v=S.abil.arte>=50?a[1]:S.abil.arte>=30?Math.min(a[1],1):-1;
      score+=v;i++;step();return KEEP}}))});
  };
  step();
}
/* Le cariche politiche si conquistano alle elezioni: contano notorietà, reputazione, estroversione e titolo di studio */
function elezione(j){
  const p=Math.max(.03,Math.min(.7,.12+S.fama/150+(S.karma-50)/200+pz('E')*.08+(S.istr.liv>=3?.05:0)+(S.eta>=40?.04:0)));
  showSheet({k:'Elezioni comunali',t:'Ti candidi?',p:`Una campagna elettorale costa circa ${eur(P(5000))} tra manifesti, incontri e cene. Con la tua notorietà hai circa il ${Math.round(p*100)}% di possibilità di essere elett${g('o','a')}.`,chiudi:true,scelte:[
    {l:'Candidati',costo:()=>P(5000),_incl:0,fx:()=>{if(chance(p)){assumi(j);mod('felicita',10);return [`Elett${g('o','a')}! Ora sei ${S.lavoro.nome.toLowerCase()}.`,'g']}mod('felicita',-6);pesa(5,2);return ['Pochi voti: questa volta non ce la fai.','b']}}]});
}
function concorso(j){
  const qs=shuffle(QUIZ).slice(0,3);let giuste=0,i=0;
  const finale=()=>{
    const p=Math.max(.02,Math.min(.9,(.06+giuste*.24+(S.istr.liv>=3?.05:0)+(S.intelligenza-50)/500)*(j.cdiff||1)));   // notaio e magistrato: concorsi molto più difficili
    let res;
    if(chance(p)){assumi(j);mod('felicita',10);res=[`Hai risposto giusto a ${giuste} domande su 3 e vinci il concorso! Ora sei ${S.lavoro.nome.toLowerCase()}.`,'g']}
    else{mod('felicita',-3);res=[`Hai risposto giusto a ${giuste} domande su 3. Non basta: il posto va a qualcun altro.`,'b']}
    log(res[0],res[1]);save();risultato(res);
  };
  const step=()=>{
    if(i>=qs.length)return finale();
    const q=qs[i];
    showSheet({k:`Concorso · ${nomeJob(j,0)} · domanda ${i+1} di 3`,t:q[0],p:'',scelte:shuffle([1,2,3]).map(n=>({l:q[n],fx:()=>{if(n===1)giuste++;i++;step();return KEEP}}))});
  };
  step();
}
