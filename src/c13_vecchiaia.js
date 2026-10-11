/* ================= VECCHIAIA PIENA (ROADMAP Fase 5.2) =================
   Blocco 1: testamento con la legittima protetta e la quota disponibile libera, ultimo desiderio.
   Gli eventi sono in d18_vecchiaia.js. */

/* ---------- Testamento ---------- */
/* Quote riservate ai legittimari (codice civile, artt. 536–544): coniuge e un figlio 1/3 + 1/3, coniuge e più figli 1/4 + 1/2,
   solo figli 1/2 (uno) o 2/3 (più), solo coniuge 1/2 (1/4 ai genitori, se ci sono), solo genitori 1/3. Fratelli, nipoti e amici
   non hanno una quota riservata. Il resto è la «quota disponibile». */
function legittima(X){
  X=X||S;const v=R=>X.relazioni.filter(p=>p.vivo&&R.includes(p.ruolo));
  const con=v(['Coniuge'])[0],figli=v(['Figlio']),gen=v(['Madre','Padre']),q=[];
  if(figli.length){
    const tf=con?(figli.length===1?1/3:1/2):(figli.length===1?1/2:2/3),qc=con?(figli.length===1?1/3:1/4):0;
    if(con)q.push([con,qc]);for(const f of figli)q.push([f,tf/figli.length]);
  }else if(con){q.push([con,.5]);for(const x of gen)q.push([x,.25/gen.length])}
  else for(const x of gen)q.push([x,1/3/gen.length]);
  return q;
}
const quotaDisponibile=X=>Math.max(0,1-legittima(X).reduce((s,x)=>s+x[1],0));

/* S.testamento = {t, eta, dest:[{pid} | {nipoti:1} | {ente:'beneficenza'|'fondazione'}]}: a chi va la quota disponibile (in parti uguali
   tra le voci). Chi è morto prima di te salta; senza destinatari vivi si torna alla successione per legge. */
const ENTI={beneficenza:'La beneficenza',fondazione:'La Fondazione'};
function destinatariTest(X){
  X=X||S;const T=X.testamento;if(!T||!T.dest)return [];
  const out=[];
  for(const d of T.dest){
    if(d.ente){if(d.ente==='fondazione'&&!(X.lusso&&X.lusso.fond))continue;out.push([{id:'ente_'+d.ente,nome:ENTI[d.ente]||'Un ente',ruolo:'Ente',vivo:true},1])}
    else if(d.nipoti){const n=X.relazioni.filter(p=>p.vivo&&p.ruolo==='Nipote');for(const p of n)out.push([p,1/n.length])}
    else{const p=X.relazioni.find(p=>p.id===d.pid&&p.vivo);if(p)out.push([p,1])}
  }
  const tot=out.reduce((s,x)=>s+x[1],0);
  return tot?out.map(([p,w])=>[p,w/tot]):[];
}
/* le quote di ognuno (somma 1): legittima + la quota disponibile ai destinatari scelti */
function quoteSuccessione(X){
  X=X||S;const dest=destinatariTest(X);
  if(!dest.length)return quoteLegge(X);
  const L=legittima(X),disp=Math.max(0,1-L.reduce((s,x)=>s+x[1],0)),m=new Map();
  const add=(p,f)=>{const e=m.get(p.id);if(e)e[1]+=f;else m.set(p.id,[p,f])};
  for(const [p,f] of L)add(p,f);
  for(const [p,w] of dest)add(p,disp*w);
  return [...m.values()];
}
function testoLegittima(){
  const L=legittima();if(!L.length)return 'Non hai eredi che la legge tuteli: puoi lasciare tutto a chi vuoi.';
  const ruoli=[...new Set(L.map(([p])=>p.ruolo))],nome={Coniuge:gp(L.find(x=>x[0].ruolo==='Coniuge')?.[0]||{sesso:'M'},'al marito','alla moglie'),Figlio:'ai figli',Madre:'ai genitori',Padre:'ai genitori'};
  const lista=[...new Set(ruoli.map(r=>nome[r]))],tot=Math.round(L.reduce((s,x)=>s+x[1],0)*100);
  return `La legge riserva il ${tot}% dell'eredità ${lista.join(' e ')} (la «legittima»): nessun testamento può toglierlo. Il resto, il ${100-tot}%, è la quota disponibile e la lasci a chi vuoi.`;
}

/* chi puoi scegliere per la quota disponibile: [{l, sub, dest}] */
function opzioniTest(){
  const o=[],per=R=>vivi(R).slice().sort((a,b)=>b.rapporto-a.rapporto);
  o.push({l:'Come prevede la legge',sub:'Nessuna scelta: la quota disponibile segue la successione',dest:[]});
  const con=per(['Coniuge'])[0]||per(['Partner']).find(p=>p.conv);
  if(con)o.push({l:`A ${con.nome}`,sub:con.ruolo==='Partner'?'Chi convive senza essere sposato non eredita per legge':'',dest:[{pid:con.id}]});
  for(const f of per(['Figlio']).slice(0,3))o.push({l:`A ${f.nome}`,sub:`${gp(f,'Tuo figlio','Tua figlia')}, ${f.eta} anni`,dest:[{pid:f.id}]});
  const nip=per(['Nipote']);if(nip.length)o.push({l:'Ai nipoti, in parti uguali',sub:nip.length===1?nip[0].nome:`${nip.length} nipoti`,dest:[{nipoti:1}]});
  const fr=per(['Fratello']).find(p=>p.rapporto>=50);if(fr)o.push({l:`A ${fr.nome}`,sub:gp(fr,'Tuo fratello','Tua sorella'),dest:[{pid:fr.id}]});
  const am=per(['Amico']).find(p=>p.rapporto>=75);if(am)o.push({l:`A ${am.nome}`,sub:gp(am,'Un amico di una vita','Un\'amica di una vita'),dest:[{pid:am.id}]});
  o.push({l:'Alla beneficenza',sub:'Un\'associazione che aiuta chi ha bisogno',dest:[{ente:'beneficenza'}]});
  if(S.lusso&&S.lusso.fond)o.push({l:`Alla Fondazione ${S.cognome}`,sub:'Continua a esistere dopo di te',dest:[{ente:'fondazione'}]});
  return o.slice(0,9);
}
function firmaTestamento(o){
  S.testamento={t:S.t,eta:S.eta,dest:o.dest};S.fatti.testamento=true;mod('felicita',2);
  if(o.dest.some(d=>d.ente))S.karma=clamp(S.karma+2);
  const q=testoSuccessione();
  return [o.dest.length?`Il notaio firma e sigilla. Se morissi oggi: ${q}.`:`Il notaio mette a verbale: «Si applica la legge». Se morissi oggi: ${q}.`,'g'];
}

/* ---------- Ultimo desiderio ---------- */
/* Verso i 75–80 anni si sceglie, tra quelli che la tua vita rende possibili, una cosa da fare ancora (`ult_desiderio`);
   dopo qualche mese `ult_realizza` la realizza. Se muori prima, il necrologio lo ricorda. S.fatti.desiderio = {id,testo,t,pid?,fatto?}.
   Ogni voce: l (come si scrive la scelta), cond, costo, txt (l'evento), fx (la realizzazione: ritorna [testo,tipo]), nec (per il necrologio). */
const luogoNascita=()=>nomeLuogo(S.fatti.cittaNascita||S.citta,S.fatti.provNascita||S.prov);
const famigliaViva=()=>vivi(['Figlio','Nipote','Fratello','Coniuge']);
const defuntoCaro=()=>{const c=S.relazioni.find(p=>!p.vivo&&p.ruolo==='Coniuge')||S.relazioni.find(p=>!p.vivo&&(p.ruolo==='Madre'||p.ruolo==='Padre'));return c||null};
const DES={
  luogo:{cond:()=>!!(S.fatti.cittaNascita)&&S.fatti.cittaNascita!==S.citta,costo:()=>P(500),
    l:()=>`Rivedere ${luogoNascita()}`,nec:()=>`rivedere ${luogoNascita()}`,
    txt:()=>`Hai deciso: prima di non poterlo più fare, vuoi rivedere ${luogoNascita()}.`,
    fx:()=>{mod('felicita',14);const v=vivi(['Amico','Cugino','Fratello']).filter(p=>p.lontano);v.forEach(p=>relD(p,3));
      return [`Torni a ${luogoNascita()}. La piazza è più piccola di come la ricordavi, il bar ha un altro nome. Davanti alla tua vecchia scuola ti viene da ridere e poi da piangere.`,'g']}},
  pace:{cond:()=>vivi(['Figlio','Fratello','Amico','Ex','Nemico']).some(p=>p.rapporto<35),costo:()=>0,
    scegli:()=>vivi(['Figlio','Fratello','Amico','Ex','Nemico']).filter(p=>p.rapporto<35).sort((a,b)=>a.rapporto-b.rapporto)[0],
    l:x=>`Fare pace con ${x.p.nome}`,nec:D=>`fare pace con ${D.nome}`,
    txt:d=>`Ti pesa ancora quello che è successo con ${d.p.nome}. Non vuoi andartene così.`,
    fx:d=>{
      const p=d.p;
      if(chance(.45+.25*pz('A')+p.rapporto/250)){p.rapporto=clamp(p.rapporto+35);if(p.ruolo==='Nemico')p.ruolo='Amico';ricorda(p,'Avete fatto pace, dopo tanti anni',3);mod('felicita',13);return [`Vai da ${p.nome}. All'inizio non sapete cosa dire; poi ridete della stessa cosa. Prima di salutarvi vi abbracciate.`,'g']}
      p.rapporto=clamp(p.rapporto+5);ricorda(p,'Sei venuto a chiedere scusa, ma era troppo presto',-1);mod('felicita',2);
      return [`${p.nome} ti ascolta fino alla fine, poi dice: «Non ce la faccio». Ma non chiude la porta del tutto.`,'b']}},
  tavola:{cond:()=>famigliaViva().length>=3,costo:()=>P(400),
    l:()=>'Una tavolata con tutta la famiglia',nec:()=>'una tavolata con tutta la famiglia',
    txt:()=>'Vorresti averli tutti intorno a un tavolo, una volta ancora.',
    fx:()=>{const f=famigliaViva();f.forEach(p=>{p.rapporto=clamp(p.rapporto+8);ricorda(p,'Una tavolata con tutta la famiglia, con te a capotavola',3)});mod('felicita',14);
      return [`Tre tavoli uniti, i bambini sotto, le voci che si accavallano. Nessuno guarda il telefono. Resti zitt${g('o','a')} un momento a guardarli.`,'g']}},
  viaggio:{cond:()=>S.soldi>=P(2500)&&S.salute>=30,costo:()=>P(2500),
    l:d=>`Un ultimo viaggio: ${d.dove}`,nec:D=>`un ultimo viaggio (${D.dove})`,extra:()=>({dove:pick(['il mare della tua gioventù','una città d\'arte','le montagne di una volta',`un posto dove non sei mai stat${g('o','a')}`])}),
    txt:d=>`Hai in mente un ultimo viaggio: ${d.dove}.`,
    fx:d=>{mod('felicita',14);segnaVita('viaggio');return [`Parti con una valigia piccola e una gran voglia: ${d.dove}. Tornano le foto e un po' di mal di schiena. Ne è valsa la pena.`,'g']}},
  memorie:{cond:()=>vivi(['Figlio','Nipote']).length>0,costo:()=>0,
    l:()=>'Scrivere le tue memorie',nec:()=>'scrivere le sue memorie per figli e nipoti',
    txt:()=>'Vorresti lasciare qualcosa di scritto: com\'era la tua vita, a chi la racconti.',
    fx:()=>{vivi(['Figlio','Nipote']).forEach(p=>{p.rapporto=clamp(p.rapporto+6);ricorda(p,'Ti ha lasciato le sue memorie, scritte a mano',3)});mod('felicita',10);S.fatti.memorie=1;
      return ['Ci metti dei mesi, un quaderno dopo l\'altro. Quando le dai ai tuoi, nessuno parla. Poi qualcuno si soffia il naso.','g']}},
  tomba:{cond:()=>!!defuntoCaro(),costo:()=>P(1800),
    l:()=>`Riposare accanto a ${defuntoCaro().nome}`,nec:()=>`riposare accanto a ${(defuntoCaro()||{}).nome||'chi ha amato'}`,
    txt:()=>`Pensi spesso al posto accanto a ${defuntoCaro().nome}. Vorresti che fosse tuo.`,
    fx:()=>{const c=defuntoCaro();S.fatti.tomba=c?c.nome:'';mod('felicita',8);return [`Parli con l'impresa del cimitero e firmi le carte: il posto accanto a ${c?c.nome:'chi hai amato'} è tuo. Esci con una calma nuova.`,'g']}}
};
const desideriPossibili=()=>Object.keys(DES).filter(k=>DES[k].cond());
function descriviDesiderio(D,fatto){const e=DES[D.id];return e?e.nec(D):D.testo}
function testoDesiderio(){
  const D=S.fatti.desiderio;if(!D)return S.fatti.desiderioRif?'Nessuno: gli bastava com\'era':'';
  return `${D.fatto?'Realizzato: ':'Non fece in tempo: '}${D.testo}`;
}

/* ---------- Quando arrivano (compleanno) ---------- */
function vecchiaiaAnno(){
  if(S.carcere>0)return;const F=S.fatti;
  if(F.testEta===undefined)F.testEta=r(66,72);
  if(!S.testamento&&!F.testamento&&S.eta>=F.testEta&&S.eta<=85&&(F.testProv||0)<2&&S.eta-(F.testUltima===undefined?-99:F.testUltima)>=5&&vivi(['Coniuge','Figlio','Nipote','Fratello','Amico']).length)
    {F.testProv=(F.testProv||0)+1;F.testUltima=S.eta;coda.push({e:EV.testamento,d:{}})}
  if(F.desEta===undefined)F.desEta=r(75,80);
  if(!F.desiderio&&!F.desiderioRif&&S.eta>=F.desEta&&S.eta<=88&&desideriPossibili().length&&!coda.some(q=>q.e===EV.ult_desiderio))coda.push({e:EV.ult_desiderio,d:{}});
}

/* ---------- Nipoti con una vita propria (blocco 2) ---------- */
/* Un tuo figlio ha un bambino: nasce un Nipote vero (gen = id del genitore) e si apre `fig_nipote`.
   Gli eventi `nip_` seguono la sua età; i passi già vissuti con ogni nipote stanno in p.nv. S.fatti.nonnoStile: presente, richiesta, distante. */
const nv=(p,k)=>p&&p.nv&&p.nv[k];
const nvSet=(p,k,v)=>{if(p){p.nv=p.nv||{};p.nv[k]=v===undefined?1:v}};
function nasceNipote(f){
  const n=nuovaPersona('Nipote',pick(['M','F']),0,f.sesso==='M'?f.cognome:pick(COGNOMI),{rapporto:f.lontano?r(45,70):r(65,92),gen:f.id});
  coda.push({e:EV.fig_nipote,d:{p:f,x:{n:n.id}}});
  return n;
}
function annoNipote(p){
  if(p.vivo&&p.eta===18&&!nv(p,'diciotto')&&!coda.some(q=>q.e===EV.nip_diciotto)){nvSet(p,'diciotto');coda.push({e:EV.nip_diciotto,d:{p}})}
}
const stileNonno=()=>S.fatti.nonnoStile||'richiesta';
const genitoreDi=p=>p&&p.gen!==undefined?persona(p.gen):null;
