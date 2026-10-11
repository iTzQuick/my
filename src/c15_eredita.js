/* ================= EREDITÀ TRA GENERAZIONI (ROADMAP Fase 5.4) =================
   Blocco 1: la successione vera quando continui come un figlio. L'inventario di ciò che il genitore lascia (`massaEreditaria`), il riparto tra
   tutti gli eredi con le spese e l'imposta (`ripartoEredita`), i debiti (accettare, beneficio d'inventario, rinuncia: evento `ered_debiti` in
   d19_eredita.js) e la parte del genitore rimasto, che arriva quando muore anche lui (`S.fatti.eredAttesa`).
   S.fatti.eredita = {da, daS, anno, attivo, passivo, netto, q, x, imposta, debito, scelta:'pura'|'beneficio'|'rinuncia'|null, pend?, test?}.

   Semplificazioni (scelte consapevoli):
   - tutto viene venduto e diviso in denaro, azienda compresa: i debiti del defunto si pagano con i suoi beni e agli eredi va il netto;
   - il patrimonio è tutto di chi muore (niente comunione dei beni con il coniuge);
   - se i debiti superano i beni, gli altri eredi (persone del gioco) accettano con beneficio d'inventario: i debiti non seguono mai loro;
   - la rinuncia (art. 519) è totale: la tua parte passa ai tuoi figli per rappresentazione (art. 467), debiti compresi, e senza figli si
     accresce agli altri eredi (art. 522); per te, in ogni caso, niente beni e niente debiti;
   - l'imposta di successione ha le regole di oggi in tutti gli anni, tranne il 2001–2006 in cui non c'era. */

const SPESE_SUCC=.04;                 // notaio, pratiche e vendita dei beni
const ANNI_DEB=10,TASSO_DEB=.05;      // il debito ereditato si paga a rate

/* l'inventario: beni e debiti di chi muore, voce per voce (il netto è il `patrimonio`) */
function massaEreditaria(X){
  X=X||S;
  const beni={contanti:Math.max(0,X.soldi),titoli:valoreBorsa(X),immobili:0,veicoli:0,azienda:X.azienda?valoreAzienda(X.azienda):0,collezioni:valoreCollezioni(X)};
  const debiti={conto:Math.max(0,-X.soldi),prestiti:residuoPrestiti(X),mutui:0,finanziamenti:0};
  for(const p of X.prop){beni.immobili+=p.valore;if(p.mutuo)debiti.mutui+=p.mutuo.residuo}
  for(const c of X.veicoli){beni.veicoli+=c.valore;if(c.prestito)debiti.finanziamenti+=c.prestito.rata*c.prestito.anni}
  const somma=o=>Object.values(o).reduce((s,x)=>s+x,0),attivo=Math.round(somma(beni)),netto=Math.round(somma(beni)-somma(debiti));
  return {beni,debiti,attivo,passivo:attivo-netto,netto};
}
/* imposta di successione secondo il grado di parentela (d.lgs. 346/1990, dal 2006): coniuge e parenti in linea retta 4% oltre un milione a testa
   (`impostaSucc`), fratelli e sorelle 6% oltre 100.000 €, tutti gli altri 8%; enti di beneficenza e fondazioni non la pagano */
function impostaEredita(x,ruolo){
  if(['Coniuge','Figlio','Nipote','Madre','Padre'].includes(ruolo))return impostaSucc(x);
  if(ruolo==='Ente'||ruolo==='Stato'||(S.anno>=2001&&S.anno<2007))return 0;
  return Math.round(ruolo==='Fratello'?Math.max(0,x-P(1e5))*.06:x*.08);
}
/* Il riparto dell'eredità di X tra tutti gli eredi. `scelta` è quella dell'erede che giochi (pid): 'pura' (accetta), 'beneficio', 'rinuncia'.
   Ritorna {M, righe:[{p,q,lordo,imposta,x}], spese, imposte, scoperto, mia}: x è quello che ognuno riceve davvero (negativo = debiti da pagare),
   `scoperto` i debiti che nessuno paga. Vale sempre: somma delle x + imposte + spese − scoperto = M.netto.
   L'imposta si calcola sulla parte di ognuno al netto dei debiti. */
function ripartoEredita(X,pid,scelta){
  X=X||S;const M=massaEreditaria(X),N=M.netto;
  // chi rinuncia non eredita: al suo posto i suoi figli (i `Nipote` con gen = lui), altrimenti la parte va agli altri
  const Q=quoteSuccessione(scelta==='rinuncia'?{...X,relazioni:X.relazioni.map(p=>p.id===pid?{...p,vivo:false}:p)}:X);
  const righe=[];let spese=0,imposte=0,scoperto=0;
  if(N>0){
    spese=Math.round(N*SPESE_SUCC);const D=N-spese;
    if(!Q.length)righe.push({p:{id:'stato',nome:'Lo Stato',ruolo:'Stato',vivo:true},q:1,lordo:D,imposta:0,x:D});   // nessun erede: allo Stato (art. 586)
    for(const [p,q] of Q){const lordo=Math.floor(D*q),imposta=Math.min(lordo,impostaEredita(lordo,p.ruolo));righe.push({p,q,lordo,imposta,x:lordo-imposta});imposte+=imposta}
    spese+=D-righe.reduce((s,r)=>s+r.lordo,0);   // gli spiccioli degli arrotondamenti restano tra le spese
  }else{
    // più debiti che beni: solo chi accetta senza beneficio d'inventario paga la sua parte (art. 752); il resto i creditori non lo vedono
    for(const [p,q] of Q){const x=p.id===pid&&(scelta||'pura')==='pura'?-Math.floor(-N*q):0;righe.push({p,q,lordo:x,imposta:0,x})}
    scoperto=righe.reduce((s,r)=>s+r.x,0)-N;
  }
  return {M,righe,spese,imposte,scoperto,mia:righe.find(r=>r.p.id===pid)||null};
}

/* dopo `continuaCome`: scrive nel diario che cosa lascia il genitore, mette da parte la quota del genitore rimasto e, se i debiti superano i beni,
   apre la scelta (i minorenni accettano sempre con beneficio d'inventario, art. 471) */
function apriSuccessione(old,R){
  const M=R.M,mia=R.mia,pct=mia?Math.round(mia.q*100):0;
  const E=S.fatti.eredita={da:old.nome,daS:old.sesso,anno:S.anno,attivo:M.attivo,passivo:M.passivo,netto:M.netto,q:mia?mia.q:0,x:mia?Math.max(0,mia.x):0,imposta:mia?mia.imposta:0,debito:0,scelta:'pura'};
  if(destinatariTest(old).length)E.test=1;
  const con=old.relazioni.find(p=>p.vivo&&p.ruolo==='Coniuge'),rc=con&&R.righe.find(r=>r.p.id===con.id);
  if(con)S.fatti.eredAttesa={pid:con.id,x:rc?Math.max(0,rc.x):0,ip:S.mondo.ip};   // la sua parte: la dividerete quando non ci sarà più
  if(M.passivo>0)log(`${old.nome} lascia beni per ${eur(M.attivo)} e debiti per ${eur(M.passivo)}.`,'h');
  if(E.x>0)log(`Erediti ${eur(E.x)}${mia.q<1?`: la tua parte (${pct}%) secondo ${E.test?'il testamento':'la legge'}`:''}${E.imposta?`, tolta l'imposta di successione (${eur(E.imposta)})`:''}.`,'g');
  if(M.netto<0&&mia&&mia.x<0){
    if(S.eta<18){E.scelta='beneficio';log('I debiti superano i beni. Sei minorenne: per legge l\'eredità si accetta per te con beneficio d\'inventario, e i debiti restano fuori dalla tua vita.','h')}
    else{E.debito=-mia.x;E.scelta=null;E.pend=1;coda.push({e:EV.ered_debiti,d:{}})}
  }
}
/* la scelta davanti a un'eredità di debiti: solo chi accetta senza beneficio d'inventario si porta a casa la sua parte di debiti */
function scegliEredita(scelta){
  const E=S.fatti.eredita;if(!E||!E.pend)return 0;
  delete E.pend;E.scelta=scelta;
  const deb=E.debito;if(scelta!=='pura'){E.debito=0;return 0}
  if(deb>0)S.prestiti.push({n:'Debito ereditato',residuo:deb,rata:rataMutuo(deb,ANNI_DEB,TASSO_DEB),anni:ANNI_DEB,tasso:TASSO_DEB});
  return deb;
}
/* se il foglio si è chiuso senza una scelta (partita ricaricata), la domanda torna il mese dopo */
function successionePendente(){
  const E=S.fatti.eredita;
  if(E&&E.pend&&S.vivo&&!coda.some(q=>q.e.id==='ered_debiti'))coda.push({e:EV.ered_debiti,d:{}});
}
/* quando muore anche il genitore rimasto: tu e i tuoi fratelli dividete quello che aveva avuto dall'eredità (ai prezzi di oggi) */
function ereditaAttesa(A){
  const fr=vivi(['Fratello']),n=fr.length+1,tot=Math.round(A.x*S.mondo.ip/(A.ip||S.mondo.ip));
  const lordo=Math.floor((tot-Math.round(tot*SPESE_SUCC))/n),x=lordo-Math.min(lordo,impostaSucc(lordo));
  if(x>0){soldi(x);log(`Erediti ${eur(x)}: la tua parte di quello che era rimasto in famiglia${n>1?`, divisa in ${n}`:''}.`,'g')}
  if(S.casa.tipo==='genitori'&&S.eta>=18){S.casa=affittoBase('Monolocale');log('La casa dei tuoi non c\'è più: prendi un monolocale tutto tuo.','h')}
  if(fr.length&&x>0&&chance(.25))coda.push({e:EV.fra_eredita,d:{p:pick(fr)}});
  return x;
}
