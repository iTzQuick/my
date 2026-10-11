/* ================= LAVORO VISSUTO: SCELTE DI CARRIERA (ROADMAP Fase 5.3b) =================
   car_  cambiare settore (car_settore → car_corso → car_nuovo), mettersi in proprio (car_proprio → car_proprio2) e il collega che
         propone di andare via insieme (car_collega_via). Le funzioni sono in c11_carriera.js. Si aprono da lavoro_pesa, dopo un
         licenziamento (licenzia), dalla lista COL_EV (d15_lavoro.js) e da car_collega_via. */

/* ---------- Cambiare settore ---------- */
ev({id:'car_settore',link:1,k:'Cambiare strada',t:'Un\'altra strada?',cond:()=>S.eta>=22&&S.eta<=58&&!S.pensione&&S.carcere===0&&settoriPossibili().length>0&&S.t-(S.fatti.carSettoreT===undefined?-999:S.fatti.carSettoreT)>=72,
  x:d=>{d.v=d.v||(S.fatti.carSettoreT=S.t);const L=S.lavoro,cod=codiceRiasec(),inter=interessi().slice(0,2).map(x=>RIASEC[x[0]].toLowerCase()).join(' e ');
    return L?`Fai ${L.nome.toLowerCase()}, e da un po' ti chiedi se è davvero la tua strada. Il tuo profilo di interessi è ${cod}: ${inter}. Con un corso di riqualificazione, sei mesi di sabati e di sere, potresti ripartire da un'altra parte.`
      :`Senza un lavoro, forse è il momento giusto per pensarci: il tuo profilo di interessi è ${cod}: ${inter}. Un corso di riqualificazione di sei mesi e potresti ripartire da un'altra parte.`},
  c:()=>{const top=interessi().map(x=>x[0]);
    return settoriPossibili().map(l=>({l:RIASEC_VIA[l],sub:()=>`${lavoriSettore(l).length} lavori possibili · corso ${eur(P(COSTO_CORSO))}`,costo:()=>P(COSTO_CORSO),
      _incl:top.indexOf(l)>=0&&top.indexOf(l)<3?[.8,.5,.2][top.indexOf(l)]:-.3,pers:{O:3},
      fx:()=>{pesa(4,1);S.fatti.settoreT=S.t;futuro(.5,'car_corso',{x:{l,f:0}});return [`Ti iscrivi al corso: ${RIASEC_VIA[l].toLowerCase()}. Sei mesi di sabati e di sere, e poi si vedrà.`,'g']}}))
      .concat([{l:'Resti dove sei',_incl:0,pers:{C:2},r:'Il lunedì, in fondo, non è così terribile.'}])}});
ev({id:'car_corso',link:1,k:'Cambiare strada',t:'L\'esame finale',cond:()=>!!S.vivo,
  x:d=>d.x.f?'Hai mancato l\'esame di poco. Puoi ripeterlo: l\'iscrizione si paga di nuovo.':'Il corso di riqualificazione è finito. Resta l\'esame finale, il sabato mattina, dopo sei mesi di appunti sul tavolo della cucina.',
  c:d=>d.x.f?[{l:'Ripeti l\'esame',sub:()=>eur(P(COSTO_RITENTA)),costo:()=>P(COSTO_RITENTA),fx:d=>esameCorso(d)},{l:'Lasci perdere',_incl:0,pers:{N:1},r:'Il corso resta nel cassetto. A volte le strade si chiudono presto.'}]
    :[{l:'Ti presenti all\'esame',fx:d=>esameCorso(d)}]});
ev({id:'car_nuovo',link:1,k:'Cambiare strada',t:'Tre proposte',cond:()=>!!S.vivo,
  x:d=>`Con l'attestato in mano bastano due settimane di invii e colloqui: arrivano tre proposte nel settore che hai scelto (${RIASEC_VIA[d.x.l].toLowerCase()}). Si riparte dal gradino più basso, ma in un lavoro che somiglia di più a te.`,
  c:d=>{if(!d.x.pr)d.x.pr=proposteSettore(d.x.l).map(j=>j.id);
    const L=d.x.pr.map(id=>{const j=JOB[id];return {l:nomeJob(j,0),sub:()=>`${eur(stipLiv(j,0))} RAL · affinità ${matchLavoro(id)}%`,pers:{O:2},fx:()=>nuovoSettore(j)}});
    return L.length?L:[{l:'Resti dove sei',r:'Nessuna delle proposte regge il confronto con quello che hai già.'}]}});

/* ---------- Mettersi in proprio ---------- */
ev({id:'car_proprio',link:1,k:'In proprio',t:'In proprio?',cond:()=>!!S.lavoro&&!S.azienda,
  x:d=>{const L=S.lavoro,q=qDi(d);
    return `${q?`${q.nome} ti ha proposto di lasciare l'azienda e fare da soli. `:''}Fai ${L.nome.toLowerCase()} da ${L.anni} ${L.anni===1?'anno':'anni'}, e ormai il mestiere lo sai fare meglio di chi lo organizza. Mettersi in proprio costa soldi e tranquillità, e i primi anni sono i più duri.`},
  c:d=>opzioniProprio().map(o=>o.k==='piva'
      ?{l:`Apri ${S.anno>=1973?'la partita IVA':'un\'attività tua'}, nel tuo mestiere`,sub:()=>`${eur(costoProprio(o))} di avvio · due anni più magri, poi si guadagna di più`,pers:{E:3,C:1},fx:d=>avviaProprio(o,d.x&&d.x.q)}
      :{l:`Apri: ${o.t.n}`,sub:()=>`${eur(costoProprio(o))} · conta ${ABIL[o.t.sk]}`,pers:{E:3,O:1},fx:d=>avviaProprio(o,d.x&&d.x.q)})
    .concat([{l:'Resti dipendente',_incl:0,pers:{C:2},r:'Lo stipendio il 27 del mese vale più di tante idee brillanti.'}])});
ev({id:'car_proprio2',link:1,k:'In proprio',t:'Due anni dopo',cond:()=>!!S.vivo,
  x:d=>{const A=S.azienda,k=d.x&&d.x.k;
    return `Sono passati due anni da quando ti sei ${g('messo','messa')} in proprio. ${k==='az'&&A?`Il conto dell'attività ha chiuso l'ultimo anno ${A.ultimo&&A.ultimo.utile>=0?'in utile':'in perdita'}.`:'I primi clienti sono diventati abituali, ma ogni fine mese è ancora un piccolo esame.'}`},
  c:d=>[
    {l:'Resisti: il peggio è passato',pers:{C:3},fx:()=>{mod('felicita',3);return ['Non è facile, ma è tuo. E questa cosa pesa più di quanto pensassi.','g']}},
    {l:'Torni dipendente',cond:d=>d.x&&d.x.k==='piva'&&!!S.lavoro&&isPiva(S.lavoro),fx:()=>{const L=S.lavoro;L.contratto={t:'ind'};delete L.proprioT;mod('felicita',-2);return ['Trovi un posto fisso nello stesso mestiere. La libertà era bella, la tredicesima di più.','']}},
    {l:'Chiudi e cerchi un posto fisso',cond:d=>d.x&&d.x.k==='az'&&!!S.azienda,fx:()=>{const A=S.azienda;if(A.cassa>0)soldi(A.cassa);S.azienda=null;mod('felicita',-4);S.fatti.cercaAltro=S.t;return ['Chiudi le serrande con più dignità che rimpianti. Le offerte sono nella scheda Lavoro.','b']}},
    {l:'Ripensi tutto: cambi settore',_incl:0,cond:()=>settoriPossibili().length>0,pers:{O:2},fx:()=>{coda.unshift({e:EV.car_settore,d:{}});return null}}]});

/* ---------- Il collega che propone di andare via insieme ---------- */
ev({id:'car_collega_via',link:1,k:'Cambiare strada',t:'Andiamocene insieme',cond:()=>!!S.lavoro,
  x:d=>`${cap(tuoColl(d.p))} ${d.p.nome} ti aspetta fuori dall'ufficio con due caffè: «Ho una proposta. Qui non ci cresce nessuno. Perché non ce ne andiamo insieme?»`,
  c:d=>[
    {l:'Partite in proprio insieme',sub:'Costi e rischi, ma tutto vostro',cond:()=>proprioPossibile(),pers:{E:2,O:1},fx:d=>{coda.unshift({e:EV.car_proprio,d:{x:{q:d.p.id}}});return null}},
    {l:'Passate insieme a un\'altra azienda',sub:'+10% di stipendio, una squadra nuova',pers:{O:2},fx:d=>passaAltraAzienda(d.p)},
    {l:'Rispondi che qui stai bene',pers:{C:2},fx:d=>{relD(d.p,-4);ricorda(d.p,`${gp(d.p,'Gli','Le')} hai detto di no quando proponeva di andare via insieme`,-1);return [`${d.p.nome} annuisce, ma non è ${gp(d.p,'contento','contenta')}. Le cose, tra voi, non sono più le stesse.`,'']}}]});
COL_EV.push(
  {id:'car_settore',w:2,rip:7,ok:()=>S.eta>=25&&S.eta<=55&&!sportSq()&&soddLavoro()<52&&settoriPossibili().length>0,d:()=>({})},
  {id:'car_proprio',w:12,rip:8,ok:()=>proprioPossibile()&&S.soldi+tfrNetto()>=Math.min(...opzioniProprio().map(costoProprio))+P(3000)&&S.eta>=26,d:()=>({x:{}})},
  {id:'car_collega_via',w:2,rip:8,ok:sq=>!sportSq()&&S.eta>=25&&S.eta<=55&&(S.lavoro.anni||0)>=2&&!isPiva(S.lavoro)&&sq.colleghi.some(p=>p.rapporto>=55&&p.eta>=24&&p.eta<=58),
    d:sq=>({p:pick(sq.colleghi.filter(p=>p.rapporto>=55&&p.eta>=24&&p.eta<=58))})});
