/* ================= EMIGRARE (ROADMAP Fase 5.3c) =================
   Le mete all'estero hanno un'epoca (da quando ci si può andare, e come). Gli eventi car_estero… sono in d17_estero.js.
   Storia vera:
   - Belgio, miniere di carbone: accordo «uomini contro carbone» del 23 giugno 1946; dopo Marcinelle (8 agosto 1956) l'Italia
     sospende le partenze: niente miniere dopo il 1956. Il Belgio resta meta normale solo dal 1968 (Bruxelles, libera circolazione).
   - Germania: accordo di reclutamento del 20 dicembre 1955 (i «Gastarbeiter»); dal 1968 gli italiani, cittadini CEE, circolano liberi.
   - Svizzera: permesso da STAGIONALE (9 mesi, niente famiglia) fino al 2001; dal 2002 gli accordi bilaterali. Con il permesso B,
     dopo tre anni, si può chiamare la famiglia.
   - Regno Unito: permesso di lavoro prima del 1973 (qui 1 su 2); libera circolazione solo 1973–2020; dal 2021 visto (diploma o
     laurea, lingua almeno 40 e un'offerta di lavoro). Irlanda dal 1973.
   - Libera circolazione dei lavoratori CEE: regolamento 1612/68, in vigore dall'autunno 1968 (dal 1961 solo in modo graduale):
     Parigi, Amsterdam, Bruxelles e Berlino (Ovest) dal 1968; Barcellona dal 1986 (la Spagna entra nella CEE; libera circolazione piena 1992).
   Semplificazioni: i contributi esteri valgono come quelli italiani (totalizzazione) e netto() resta quello italiano; all'estero si
   ha sempre un contratto a tempo indeterminato; niente oltreoceano; Minatore non esiste, in Belgio si fa l'«operaio» (ope); lo
   stagionale svizzero è una meccanica leggera (stipendio ×0,75, alloggio dell'azienda, famiglia a casa). */
const META_EMI=[
  {id:'charleroi',n:'Charleroi',paese:'Belgio',da:1946,a:1956,mina:1,etaMin:16,lingua:0,f:1.15,v:.95,costo:700,w:3,
    nota:'In Belgio cercano uomini per le miniere di carbone: l\'accordo con l\'Italia prevede carbone in cambio di braccia.'},
  {id:'colonia',n:'Colonia',paese:'Germania',da:1955,lingua:a=>a<1990?0:15,f:a=>a<1980?1.35:1.2,v:1.05,costo:900,w:3,op:a=>a<=1973,
    nota:'In Germania le fabbriche hanno fame di operai: ci sono i contratti di reclutamento, i treni dalla stazione di Verona e le baracche.'},
  {id:'zurigo',n:'Zurigo',paese:'Svizzera',da:1948,lingua:a=>a<2002?0:15,f:1.7,v:1.55,costo:1000,w:3,op:a=>a<2002,stag:a=>a<2002,
    nota:'In Svizzera si guadagna quasi il doppio. Fino al 2001 gli italiani arrivano con il permesso da stagionale: nove mesi l\'anno, e la famiglia non può venire.'},
  {id:'bruxelles',n:'Bruxelles',paese:'Belgio',da:1968,lingua:15,f:1.2,v:1.1,costo:1200,w:2,
    nota:'Bruxelles è la capitale delle istituzioni europee, e per i cittadini della CEE la strada è libera.'},
  {id:'parigi',n:'Parigi',paese:'Francia',da:1968,lingua:15,f:1.15,v:1.2,costo:1400,w:2,
    nota:'Parigi: stipendi più alti, affitti da svenarsi e un francese da imparare.'},
  {id:'amsterdam',n:'Amsterdam',paese:'Paesi Bassi',da:1968,lingua:10,f:1.2,v:1.15,costo:1300,w:2,
    nota:'Ad Amsterdam tutti parlano inglese e le biciclette sono più delle persone.'},
  {id:'berlino',n:'Berlino',paese:'Germania',da:1968,lingua:15,f:1.1,v:1,costo:1100,w:2,
    nota:'Berlino: affitti ancora ragionevoli, una scena che non dorme mai e il tedesco da imparare.'},
  {id:'londra',n:'Londra',paese:'Regno Unito',da:1950,lingua:a=>a>=2021?40:(a<1973?30:20),f:1.25,v:1.25,costo:1500,w:3,perm:a=>a<1973?.5:1,visto:2021,
    nota:'Londra: la città dove arrivano tutti, con stipendi alti e affitti ancora più alti.'},
  {id:'dublino',n:'Dublino',paese:'Irlanda',da:1973,lingua:20,f:1.2,v:1.2,costo:1300,w:2,
    nota:'Dublino: le sedi europee delle aziende tecnologiche, la pioggia, i pub.'},
  {id:'barcellona',n:'Barcellona',paese:'Spagna',da:1986,lingua:10,f:.9,v:.95,costo:1000,w:2,
    nota:'Barcellona: il mare, la vita di notte e stipendi un po\' più bassi dei nostri.'}
];
const perAnno=(x,a)=>typeof x==='function'?x(a):x;
const metaDi=n=>META_EMI.find(m=>m.n===n);
const metaDisponibili=anno=>{anno=anno||S.anno;return META_EMI.filter(m=>anno>=m.da&&anno<=(m.a||9999))};
const linguaMeta=m=>perAnno(m.lingua,S.anno);
const stagMeta=m=>!!perAnno(m.stag,S.anno);
/* cosa manca per partire (vuoto = si può) */
function requisitiMeta(m){
  const o=[],L=linguaMeta(m);
  if(S.eta<(m.etaMin||18))o.push(`${m.etaMin||18} anni`);
  if(S.abil.lingue<L)o.push(`lingue almeno ${L}`);
  if(m.visto&&S.anno>=m.visto&&S.istr.liv<2)o.push('un diploma o una laurea');
  return o;
}
const metaPossibili=()=>metaDisponibili().filter(m=>requisitiMeta(m).length===0);
const esportabile=j=>!!j&&!j.conc&&!j.elez&&!j.pt&&!j.nascosto&&!SPORTIVI.includes(j.id)&&!CONTR_NAZ.includes(j.id)&&!SENZA_SQUADRA.includes(j.id)&&lavoroInEpoca(j);
/* il lavoro che aspetta all'estero: operaio dove si reclutano braccia, altrimenti lo stesso mestiere, altrimenti uno accessibile */
function lavoroEstero(m){
  if(m.mina)return {j:JOB.ope,liv:0,mina:1};
  if(perAnno(m.op,S.anno))return {j:JOB.ope,liv:0};
  const L=S.lavoro;
  if(L&&esportabile(JOB[L.id]))return {j:JOB[L.id],liv:L.liv,trasf:1};
  const c=[].concat(...'RIASEC'.split('').map(lavoriSettore)).filter(esportabile);
  if(!c.length)return {j:JOB.ope,liv:0};
  return {j:pick(c.map(j=>[j,matchLavoro(j.id)+r(-10,10)]).sort((x,y)=>y[1]-x[1]).slice(0,4))[0],liv:0};
}
function offertaMeta(m){const l=lavoroEstero(m);return {m:m.id,j:l.j.id,liv:l.liv,trasf:l.trasf?1:0,mina:l.mina?1:0}}
/* fino a 3 proposte tra le mete possibili adesso, pesate */
function offerteEstero(max){
  const pool=metaPossibili(),o=[];
  while(pool.length&&o.length<(max||3)){const m=pesata(pool.map(x=>[x,perAnno(x.w,S.anno)||2]));pool.splice(pool.indexOf(m),1);o.push(offertaMeta(m))}
  return o;
}
const feMeta=m=>perAnno(m.f,S.anno)*(stagMeta(m)?.75:1);
const stipEstero=o=>{const m=META_EMI.find(x=>x.id===o.m);return Math.round(stipLiv(JOB[o.j],o.liv)*feMeta(m)*fattoreGenere())};
/* lo stipendio all'estero: fattoreZona() lo chiama quando zonaMia() è «Estero» */
function fattoreEsteroOra(){
  const m=metaDi(S.citta);if(!m)return 1;
  const E=S.fatti.estero;
  return perAnno(m.f,S.anno)*(E&&E.stag?.75:1);
}
const costoEstero=m=>P(m.costo);
const alloggioAzienda=()=>({tipo:'affitto',n:'Alloggio dell\'azienda',costo:Math.round(P(2400)/100)*100});

/* ---------- Partire ---------- */
/* chi vive con te e non può venire (stagionale): partner e figli minorenni restano «a casa», cioè lontani */
function lasciaFamiglia(da,fam){
  for(const p of S.relazioni){
    if(!p.vivo)continue;
    if(['Partner','Coniuge'].includes(p.ruolo)&&p.conv){p.conv=false;p.lontano=true;p.dove=da;fam.push(p.id)}
    else if(p.ruolo==='Figlio'&&p.eta<18&&!p.fuori&&!p.conEx){p.conEx=true;p.lontano=true;p.dove=da;fam.push(p.id)}
  }
}
/* la famiglia ti raggiunge (permesso B) oppure torni tu da loro */
function ricongiungi(ids){
  const E=S.fatti.estero;let n=0;
  for(const id of (ids||(E&&E.fam)||[])){
    const p=persona(id);if(!p||!p.vivo)continue;
    p.lontano=false;p.dove=null;n++;relD(p,8);
    if(['Partner','Coniuge'].includes(p.ruolo))p.conv=true;
    else if(p.eta>=18)p.fuori=true;
    p.conEx=false;
  }
  if(E)E.fam=[];
  return n;
}
function assumiEstero(o,m){
  const j=JOB[o.j];
  assumi(j);
  const L=S.lavoro;
  if(o.liv>0){L.liv=o.liv;L.nome=nomeJob(j,o.liv);L.stip=Math.round(stipLiv(j,o.liv)*(1+r(-3,6)/100)*fattoreGenere()*fattoreZona(j));S.ultimoLavoro=L.nome}
  L.contratto={t:'ind'};L.estero=m.id;if(o.mina)L.miniera=1;
  if(L.sq===null&&squadraPossibile(L)){L.sq=undefined;iniziaSquadra(false)}
  return L;
}
/* o: l'offerta; x: i dati dell'evento (x.off = c'è un'offerta di lavoro vera, x.v = visto già garantito) */
function avviaEstero(o,x){
  const m=META_EMI.find(k=>k.id===o.m),a=S.anno,costo=costoEstero(m);
  if(S.soldi<costo)return [`Ti servono ${eur(costo)} tra viaggio e primo mese: per ora non ci sei.`,'x'];
  const perm=perAnno(m.perm,a);
  if(perm!==undefined&&perm<1&&!chance(perm)){soldi(-P(80));mod('felicita',-3);return ['Il permesso di lavoro non arriva. Hai speso in carte e raccomandate, e resti dove sei.','b']}
  if(m.visto&&a>=m.visto&&!(x&&x.off)&&!chance(.55)){mod('felicita',-2);return ['Senza un\'offerta di lavoro che ti sponsorizzi, il visto non viene concesso.','b']}
  const da=S.citta,prov=S.prov,stag=stagMeta(m),fam=[];
  soldi(-costo);
  vaiA(m.n,null);
  if(stag)lasciaFamiglia(da,fam);
  S.fatti.estero={id:m.id,n:m.n,t:S.t,da,prov,stag:stag?1:0,fam,mina:o.mina?1:0};   // prima dell'assunzione: lo stipendio dello stagionale ne dipende
  const L=assumiEstero(o,m);
  if(stag||o.mina)S.casa=alloggioAzienda();
  S.fatti.vissutoEstero=(S.fatti.vissutoEstero||0)+1;
  mod('felicita',-2);
  futuro(.5,'car_estero2',{x:{}});
  futuro(3,'car_estero3',{x:{}});
  const lavoro=`${L.nome.toLowerCase()}, con una RAL di ${eur(L.stip)}`;
  let t=`Parti per ${m.n}. Ti aspetta un posto da ${lavoro}.`;
  if(stag)t+=` Hai il permesso da stagionale: ${fam.length?'la famiglia resta a casa, e chiamarla non si può':'niente famiglia al seguito, e non si può chiamarla'}. L'azienda ti dà un letto in una baracca.`;
  else if(o.mina)t+=' Dormirai in una baracca vicino al pozzo.';
  return [t,'g'];
}
/* tornare in Italia (o altrove): la famiglia si riunisce, il periodo estero si chiude */
function tornatoDaEstero(){
  const E=S.fatti.estero;if(!E)return;
  const n=ricongiungi();
  S.fatti.esteroMesi=(S.fatti.esteroMesi||0)+(S.t-E.t);
  S.fatti.esteroStorico={id:E.id,n:E.n,t:E.t,a:S.t};
  delete S.fatti.estero;
  if(n)log('La tua famiglia vi riunisce di nuovo: ricominciate insieme.','g');
}

/* ---------- Ogni mese ---------- */
function meseEstero(){
  const E=S.fatti.estero;
  if(!E){
    /* un'offerta da fuori: più spesso a chi è senza lavoro e a chi vive al Sud, meno a chi ha figli piccoli o una famiglia in casa */
    if(!S.azienda&&S.eta>=20&&S.eta<=45&&!S.pensione&&S.carcere===0&&!coda.length&&S.scuola.stato==='finita'
      &&S.t-(S.fatti.esteroOffT===undefined?-999:S.fatti.esteroOffT)>=60){
      const p=(S.lavoro?.0012:.004)*(alSud(zonaMia())?2:1)*(minoriConTe()?.5:1)*(convivente()?.6:1);
      if(chance(p)&&metaPossibili().length){S.fatti.esteroOffT=S.t;coda.push({e:EV.car_estero,d:{x:{off:1}}})}
    }
    return;
  }
  if(S.citta!==E.n){tornatoDaEstero();return}
  if(S.abil.lingue<75&&chance(.12))S.abil.lingue=clamp(S.abil.lingue+1);
  if(E.stag&&E.fam&&E.fam.length&&chance(.35)){mod('felicita',-1);S.bis.stress=clamp(S.bis.stress+1)}
  const L=S.lavoro;
  if(L&&L.miniera){
    S.fatti.minieraMesi=(S.fatti.minieraMesi||0)+1;
    if(chance(.25))mod('salute',-1);                                             // −3 punti l'anno, senza una malattia nuova
    if(chance(.004)){mod('salute',-r(8,22));pesa(8,4);log('Un cedimento in galleria: ti portano fuori ferito.','b')}
  }
}
