// Invarianti del gioco (ROADMAP 0.2 e 0.6): cose che non devono mai succedere.
// Si controllano dopo ogni mese in tools/invarianti.py e in tools/fuzz.py.
// INV.controlla() ritorna una lista di [codice, dettaglio]; vuota = tutto a posto.
window.INV={
 // cose che crescono da sole (ROADMAP 0.4), in euro reali (ai prezzi dell'anno di nascita) e soglie realistiche
 SOGLIE:{patrimonio:1e9,follower:40e6,azienda:1e9,borsa:3e8,collezioni:5e7,debiti:5e6},
 valori(){const ip=S.mondo.ip;return {patrimonio:patrimonio()/ip,follower:S.social.follower,azienda:valoreAzienda(S.azienda)/ip,borsa:valoreBorsa()/ip,collezioni:valoreCollezioni()/ip,debiti:Math.max(0,residuoPrestiti()-S.soldi)/ip}},
 // tiene in pk il massimo di ogni valore (un NaN resta: lo segnala controlla())
 picchi(pk){const v=this.valori();for(const k in v)if(pk[k]===undefined||!(v[k]<=pk[k]))pk[k]=v[k];return pk},
 // mesi trascorsi dalla nascita di una persona (le persone compiono gli anni nel loro mese p.mn)
 mesiDi(p){return p.eta*12+((S.mese-(p.mn||0)+12)%12)},
 controlla(){
  const out=[],no=(c,m)=>out.push([c,m]);
  const fin=x=>typeof x==='number'&&isFinite(x);
  const in100=(x,lo=0,hi=100)=>fin(x)&&x>=lo&&x<=hi;
  const chi=p=>`${p.ruolo} ${p.nome} (${p.eta})`;
  // 1. statistiche, bisogni e carattere del giocatore
  for(const k of ['salute','felicita','intelligenza','aspetto','karma'])if(!in100(S[k]))no('stat fuori 0-100',`${k}=${S[k]}`);
  for(const k of ['energia','stress','soc','forma'])if(S.bis&&!in100(S.bis[k]))no('bisogno fuori 0-100',`${k}=${S.bis[k]}`);
  for(const k of 'OCEAN')if(!in100(S.pers[k]))no('carattere fuori 0-100',`${k}=${S.pers[k]}`);
  // 2. numeri finiti e tetti
  if(!fin(S.soldi))no('soldi non finiti',String(S.soldi));
  const pat=patrimonio();if(!fin(pat))no('patrimonio non finito',String(pat));
  if(!fin(S.social.follower)||S.social.follower>CAP_FOLLOWER*1.01)no('follower oltre il tetto',String(S.social.follower));
  if(!fin(S.fama))no('fama non finita',String(S.fama));
  for(const k in S.borsa)if(!fin(S.borsa[k])||S.borsa[k]<0)no('borsa non valida',`${k}=${S.borsa[k]}`);
  for(const p of S.prop)if(!fin(p.valore))no('casa senza valore',String(p.valore));
  // 3. età del giocatore coerente con i mesi vissuti
  if(Math.abs(S.eta-Math.floor(S.t/12))>1)no('età giocatore incoerente',`eta ${S.eta}, t ${S.t}`);
  if(S.lavoro){const j=JOB[S.lavoro.id],min=Math.max(14,(j&&j.req&&j.req.eta&&j.req.eta[0])||0);   // il volantinaggio è permesso dai 14
   if(S.eta<min)no('lavoro sotto l\'età minima',`${S.lavoro.nome} a ${S.eta} anni (minimo ${min})`)}
  if(S.carcere>0&&S.eta<14)no('carcere sotto i 14 anni',`a ${S.eta}`);
  // 4. persone: valori validi, nessun doppione
  const ids=new Set();
  for(const p of S.relazioni){
   if(ids.has(p.id))no('id doppio',chi(p));ids.add(p.id);
   if(!Number.isInteger(p.eta)||p.eta<0||p.eta>125)no('età persona non valida',chi(p));
   if(!p.vivo)continue;
   if(!in100(p.rapporto))no('rapporto fuori 0-100',`${chi(p)}: ${p.rapporto}`);
   if(p.pers)for(const k of 'OCEAN')if(!in100(p.pers[k]))no('carattere persona fuori 0-100',`${chi(p)} ${k}=${p.pers[k]}`);
   if(p.lontano&&p.dove&&p.dove===S.citta)no('lontano ma nella tua città',chi(p));
   if(p.lontano&&p.conv)no('lontano ma convivente',chi(p));
  }
  const V=r=>S.relazioni.filter(p=>p.vivo&&p.ruolo===r);
  if(V('Coniuge').length>1)no('più di un coniuge',V('Coniuge').map(chi).join(', '));
  if(V('Madre').length>1)no('più di una madre',V('Madre').map(chi).join(', '));
  if(V('Padre').length>1)no('più di un padre',V('Padre').map(chi).join(', '));
  if(V('Coniuge').length&&S.eta<18)no('sposato da minorenne',`a ${S.eta}`);
  // 5. coppia: nessun adulto con un minorenne (oltre i 3 anni: l'età scelta è al massimo ±2, più i compleanni in mesi diversi)
  for(const p of [...V('Partner'),...V('Coniuge')]){
   const min=Math.min(p.eta,S.eta),max=Math.max(p.eta,S.eta);
   if(min<18&&max>=18&&max-min>3)no('coppia adulto-minorenne',`tu ${S.eta}, ${chi(p)}`);
  }
  // 6. famiglia credibile (ROADMAP 0.6): età dei genitori alla nascita dei figli
  const ora=S.anno*12+S.mese,nascita=p=>ora-this.mesiDi(p),io=ora-S.t;
  const fr=V('Fratello').filter(f=>!f.mezzo&&!f.gemello);
  const figliDiMamma=[{nome:'tu',b:io},...fr.map(f=>({nome:chi(f),b:nascita(f)}))];
  for(const [r,lo,hi] of [['Madre',14,50],['Padre',15,75]])for(const g of V(r))for(const f of figliDiMamma){
   const a=(f.b-nascita(g))/12;if(a<lo||a>hi)no(`${r.toLowerCase()} troppo ${a<lo?'giovane':'vecchia'} alla nascita`,`${chi(g)} aveva ${a.toFixed(1)} anni alla nascita di ${f.nome}`);
  }
  for(let i=0;i<figliDiMamma.length;i++)for(let j=i+1;j<figliDiMamma.length;j++){
   const d=Math.abs(figliDiMamma[i].b-figliDiMamma[j].b);
   if(d>=2&&d<=8)no('fratelli nati a pochi mesi',`${figliDiMamma[i].nome} e ${figliDiMamma[j].nome}: ${d} mesi`);
  }
  // (i morti non invecchiano più: si confrontano solo persone vive)
  for(const n of V('Nonno'))if(io-nascita(n)<30*12)no('nonno troppo giovane',`${chi(n)}, tu ${S.eta}`);
  for(const f of V('Figlio')){const a=(nascita(f)-io)/12,lo=f.adottato?18:14;if(a<lo)no('figlio con genitore troppo giovane',`avevi ${a.toFixed(1)} anni alla nascita di ${chi(f)}`)}
  const byId=id=>S.relazioni.find(p=>p.id===id&&p.vivo);
  for(const c of V('Cugino')){const z=c.di&&byId(c.di);if(z&&nascita(c)-nascita(z)<14*12)no('cugino con zio troppo giovane',`${chi(z)} e ${chi(c)}`)}
  for(const n of V('Nipote')){const g0=n.gen&&byId(n.gen);if(g0&&nascita(n)-nascita(g0)<14*12)no('nipote con genitore troppo giovane',`${chi(g0)} e ${chi(n)}`)}
  // 7. animali con nomi diversi
  const nomiA=(S.animali||[]).map(a=>a.nome);if(new Set(nomiA).size<nomiA.length)no('animali con lo stesso nome',nomiA.join(', '));
  // 8. persone vere (Fase 2): coppie tra le tue persone reciproche, legami con persone che esistono, stile da genitore valido
  for(const p of S.relazioni)if(p.vivo&&p.pId){const q=byId(p.pId);if(q&&q.pId!==p.id)no('coppia tra persone non reciproca',`${chi(p)} → ${chi(q)}`)}
  if(S.legami)for(const l of S.legami){if(l.a===l.b)no('legame con sé stessi',String(l.a));if(!in100(l.f))no('forza del legame fuori 0-100',String(l.f))}
  if(S.genit&&(!in100(S.genit.cal)||!in100(S.genit.reg)))no('stile da genitore non valido',JSON.stringify(S.genit));
  if(S.gruppi)for(const g of S.gruppi)if(new Set(g.m).size<g.m.length)no('persona due volte nello stesso gruppo',g.n);
  // 9. lavoro vissuto (Fase 5.3a): un solo capo, al massimo 4 colleghi, tutti nel gruppo lavoro:<id>:<da>; nessuna squadra senza posto fisso
  if(typeof lavInCorso==='function'){
   const sq=S.relazioni.filter(lavInCorso),L=S.lavoro;
   if(sq.filter(p=>p.lav.r==='capo').length>1)no('squadra: due capi',sq.filter(p=>p.lav.r==='capo').map(chi).join(', '));
   if(sq.filter(p=>p.lav.r==='collega').length>4)no('squadra: troppi colleghi',String(sq.length));
   if(L&&L.sq&&typeof squadraPossibile==='function'&&!squadraPossibile(L)&&sq.length)no('squadra con un lavoro senza squadra',L.id);
   const G=L&&(S.gruppi||[]).find(g=>g.k===`lavoro:${L.id}:${L.da||0}`);
   for(const p of sq)if(!G||!G.m.includes(p.id))no('collega fuori dal gruppo del lavoro',chi(p));
   // se il lavoro finisce in un evento a fine mese, i colleghi si chiudono al mese dopo (meseSquadra): un mese di tolleranza, poi è un orfano vero
   const W=this._orf||(this._orf=new WeakMap());
   for(const p of S.relazioni)if(p.vivo&&p.lav&&!p.lav.via&&!p.lav.fine&&!lavInCorso(p)){if(!W.has(p))W.set(p,S.t);else if(S.t>W.get(p))no('collega orfano (il lavoro è finito e non è stato chiuso)',chi(p))}
  }
  return out;
 }
};
