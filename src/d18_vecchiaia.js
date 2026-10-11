/* ================= EVENTI DELLA VECCHIAIA PIENA (ROADMAP Fase 5.2) =================
   Blocco 1: testamento (testamento → testamento_dispo, testamento_rivedi) e ultimo desiderio (ult_desiderio → ult_realizza).
   La logica è in c13_vecchiaia.js; `vecchiaiaAnno()` li apre dal compleanno. */

/* ---------- Il testamento: la legittima non si tocca, la quota disponibile è tua ---------- */
ev({id:'testamento',link:1,min:65,max:100,t:'Il testamento',x:()=>`Il notaio ti consiglia di fare testamento. ${testoLegittima()} Senza testamento, tutto va per legge: ${testoSuccessione()}.`,c:[
  {l:'Fai testamento',sub:()=>eur(P(500)),costo:()=>P(500),_incl:0,fx:()=>{coda.push({e:EV.testamento_dispo,d:{}})},r:'Il notaio apre una cartellina nuova: «Allora, a chi vuole lasciare la parte libera?»'},
  {l:'Non ora',pers:{C:-1},r:'Ci penserai. I notai, di solito, aspettano.'}]});
ev({id:'testamento_dispo',link:1,t:'A chi lasci la parte libera',x:()=>`${testoLegittima()} Sceglie solo la parte libera: il resto spetta per legge.`,c:()=>
  opzioniTest().map(o=>({l:o.l,sub:o.sub,_incl:0,fx:()=>firmaTestamento(o)}))});
ev({id:'testamento_rivedi',link:1,t:'Un nome da togliere',cond:()=>!!S.testamento,x:d=>`${d.x&&d.x.nome||'Chi nel tuo testamento'} non c'è più, e il tuo testamento lo nominava. Ora quella parte segue la legge: ${testoSuccessione()}.`,c:[
  {l:'Lo rifai',sub:()=>eur(P(300)),costo:()=>P(300),_incl:0,fx:()=>{coda.push({e:EV.testamento_dispo,d:{}})},r:'Dal notaio, ancora. Questa volta lo conoscono per nome.'},
  {l:'Lasci com\'è',pers:{C:-1},r:'Per ora va bene così.'}]});

/* ---------- L'ultimo desiderio (75–80 anni): si sceglie, poi lo si realizza ---------- */
ev({id:'ult_desiderio',link:1,min:75,max:88,t:'Una cosa sola',x:()=>`${S.eta} anni. Una sera ti chiedi: se potessi scegliere una cosa sola da fare ancora, quale sarebbe?`,c:()=>{
  const o=desideriPossibili().map(k=>{
    const E=DES[k],x=Object.assign(E.extra?E.extra():{},{p:E.scegli?E.scegli():null}),D=Object.assign({id:k},x.dove?{dove:x.dove}:{},x.p?{nome:x.p.nome}:{});
    return {l:E.l(x),sub:E.costo()?'Circa '+eur(E.costo()):'',_incl:0,fx:()=>{D.testo=E.nec(D);D.t=S.t;S.fatti.desiderio=D;futuro(.6,'ult_realizza',{p:x.p});return ['Lo scrivi su un foglio e lo metti nel cassetto, dove stanno le cose importanti.','g']}};
  }).slice(0,6);
  o.push({l:'Nessuno: ti basta com\'è',_incl:0,pers:{N:-1},fx:()=>{S.fatti.desiderioRif=1}, r:'Sorridi. Hai già avuto abbastanza di tutto.'});
  return o}});
ev({id:'ult_realizza',link:1,t:'Il momento',cond:()=>!!S.fatti.desiderio&&!S.fatti.desiderio.fatto,x:d=>{const D=S.fatti.desiderio;return DES[D.id].txt(Object.assign({},D,{p:d.p}))+' È il momento?'},c:[
  {l:'Lo fai adesso',sub:()=>{const c=DES[S.fatti.desiderio.id].costo();return c?eur(c):''},costo:()=>DES[S.fatti.desiderio.id].costo(),_incl:0,fx:d=>{const D=S.fatti.desiderio;D.fatto=S.t;return DES[D.id].fx(Object.assign({},D,{p:d.p}))}},
  {l:'Non ancora',_incl:0,fx:d=>{const D=S.fatti.desiderio;if(!D.rinv){D.rinv=1;futuro(.5,'ult_realizza',{p:d.p});return ['Rimandi. Ma non per sempre, ti dici.','']}return ['Lo lasci andare, con un po\' di malinconia.','']}}]});
