/* ================= ITALIA VERA: EVENTI (ROADMAP, Fase 3) =================
   naja (fino ai nati del 1985), sanità (medico di base, liste d'attesa, screening dell'ASL), lavoro (cassa integrazione),
   territorio (partire per il Nord, tornare al Sud), casa (IMU, mutuo fisso o variabile) e momenti d'epoca. */

/* ---------- La naja ---------- */
ev({id:'naja',link:1,k:'Servizio militare',t:'La cartolina',x:()=>`Arriva la cartolina precetto: il servizio militare è obbligatorio. Sono ${mesiNaja()} mesi, lontano da casa.`,c:[
  {l:'Parti per la naja',pers:{C:2,E:1,N:-1},fx:()=>{S.fatti.naja='fatta';S.fatti.najaFine=S.t+mesiNaja();mod('felicita',-4);S.bis.stress=clamp(S.bis.stress+6);
    const c=candidatoAmico();c.sesso='M';c.eta=S.eta+r(-1,1);c.nome=nomeLibero('M',S.anno-c.eta);const p=nuovaPersona('Amico','M',c.eta,c.cognome,{nome:c.nome,pers:c.pers,rapporto:r(55,75),dove:'naja'});
    futuro(mesiNaja()/12,'naja_congedo',{p});
    return [`Visita, capelli rasati, branda in camerata. Il primo amico è ${p.nome}, che russa come un trattore.`,'']}},
  {l:'Obiettore di coscienza: servizio civile',cond:()=>S.anno>=1972,pers:{A:2,O:1},fx:()=>{S.fatti.naja='civile';S.karma=clamp(S.karma+4);mod('felicita',1);return [`Rifiuti le armi: fai il servizio civile in una casa di riposo. È più lungo della naja, ma ti insegna moltissimo.`,'g']}},
  {l:'Provi a farti riformare',pers:{C:-2},p:.3,si:{fx:()=>{S.fatti.naja='riformato'},r:'Alla visita medica ti dichiarano «non idoneo». Resti a casa, un po\' sollevato e un po\' in colpa.'.replace('sollevato','sollevat{o}').replace('{o}','o')},no:{fx:()=>{S.fatti.naja='fatta';mod('felicita',-6);futuro(mesiNaja()/12,'naja_congedo',{})},r:'Il medico militare non ci casca: «Abile e arruolato». Parti lo stesso.'}}]});
ev({id:'naja_congedo',link:1,k:'Servizio militare',t:'Il congedo',x:'Finisce la naja. L\'ultima sera in caserma, la festa dei congedanti: «Alba!»',c:[
  {l:'Saluti i commilitoni promettendo di rivedervi',pers:{A:1},fx:d=>{mod('felicita',5);if(d.p)d.p.rapporto=clamp(d.p.rapporto+5);return ['Torni a casa più magro, più adulto e con un amico per la vita. Forse.','g']}},
  {l:'Non vedi l\'ora di tornare',pers:{E:-1},fx:()=>{mod('felicita',4);return ['Il treno di ritorno sembra il più bel viaggio della tua vita.','g']}}]});

/* ---------- Cassa integrazione (S.lavoro.cig: mesi che restano; S.fatti.cigN: mesi in tutta la vita) ---------- */
ev({id:'ita_cig',link:1,k:'Lavoro',cond:()=>!!S.lavoro,t:'Cassa integrazione',x:d=>d.covid?'Con il lockdown l\'azienda chiude i cancelli. Per tutti c\'è la cassa integrazione: a casa, con circa l\'80% dello stipendio (e un tetto), finché non si riparte.':'Gli ordini calano e l\'azienda chiede la cassa integrazione: per qualche mese si lavora poco o niente, e lo stipendio lo paga in parte l\'INPS, circa l\'80% con un tetto.',c:[
  {l:'Stringi i denti e aspetti',pers:{N:1},fx:d=>{const m=d.covid?r(2,4):r(3,9);avviaCIG(m);pesa(4,2);return [`${m} mesi di cassa integrazione. Le giornate sono lunghe e i conti più corti.`,'b']}},
  {l:'Ne approfitti per fare un corso',pers:{O:2,C:1},fx:d=>{const m=d.covid?r(2,4):r(3,9);avviaCIG(m);S.intelligenza=clamp(S.intelligenza+2);return [`${m} mesi di cassa integrazione, e intanto un corso serale: almeno il tempo non va sprecato.`,'']}},
  {l:'Accetti l\'incentivo e te ne vai',cond:()=>S.anno!==2020&&!!S.lavoro,sub:()=>S.lavoro?`${eur(Math.round(ralEff(S.lavoro)/13*6))} di buonuscita`:'',pers:{O:1,N:-1},fx:()=>{if(!S.lavoro)return;const x=Math.round(ralEff(S.lavoro)/13*6);soldi(x);licenzia('Firmi la risoluzione con l\'incentivo e lasci l\'azienda.');return ['Sei mesi di stipendio come incentivo, la liquidazione e l\'indennità di disoccupazione. Ora tocca cercare altro.','']}}]});

/* ---------- Tornare giù: dopo anni al Centro-Nord o all'estero (S.fatti.emigrato) ---------- */
ev({id:'ita_ritorno',link:1,k:'Casa',cond:()=>!!S.fatti.emigrato&&!S.fatti.ritornato,t:'Tornare giù',x:()=>{const em=S.fatti.emigrato,n=Math.max(1,Math.round((S.t-em.t)/12)),m=vivi(['Madre'])[0];
    return `Sono passati ${n} anni da quando sei partit${g('o','a')} da ${em.da}. ${m?'Tua madre, al telefono, te lo chiede ogni volta: «E quando torni?»':'Ogni estate, quando scendi, ti chiedi se non sia il momento di tornare per sempre.'}${S.pensione?' Ora che sei in pensione, niente ti tiene più qui.':''}`},c:[
  {l:'Torni a casa, per sempre',sub:()=>S.lavoro?'Lasci il lavoro':'',pers:{A:1,O:-1},fx:()=>{const em=S.fatti.emigrato;S.fatti.ritornato=S.t;vaiA(em.da,em.prov);mod('felicita',6);return [`Torni a ${em.da}. I parenti, il dialetto, i pranzi della domenica: sembra che tu non sia mai partit${g('o','a')}. Quasi.`,'g']}},
  {l:'Torni e lavori da remoto',cond:()=>S.anno>=2020&&!!S.lavoro&&REMOTO.includes(S.lavoro.id),sub:'Stesso lavoro, stesso stipendio',pers:{O:1},fx:()=>{const em=S.fatti.emigrato,L=S.lavoro;S.lavoro=null;vaiA(em.da,em.prov);S.lavoro=L;S.fatti.ritornato=S.t;mod('felicita',8);return [`Porti il computer giù a ${em.da}: lo stesso lavoro, lo stipendio di prima e il pranzo con la famiglia la domenica.`,'g']}},
  {l:'Resti: ormai la tua vita è qui',pers:{O:1,A:-1},fx:()=>{mod('felicita',-1);return ['Giù ci torni per le feste. Casa, ormai, è dove sei.','']}},
  {l:'Torni solo d\'estate e a Natale',pers:{C:1},fx:()=>{mod('felicita',2);return ['Due settimane ad agosto e il Natale con i tuoi: abbastanza per non dimenticare il dialetto.','']}}]});

/* ---------- Sanità: il primo invito allo screening, le liste d'attesa ---------- */
ev({id:'ita_screening',link:1,k:'Sanità',t:'La lettera dell\'ASL',x:d=>`Nella cassetta della posta c'è una lettera dell'ASL: ti invitano ${d.n||'alla mammografia'}, gratis. È il programma di prevenzione per chi ha la tua età.`,c:[
  {l:'Prenoti e ci vai',pers:{C:2},fx:d=>{S.fatti.scrAbit=1;if(faiScreening(d.id||'mx'))return ['L\'esame trova qualcosa. Il medico vuole parlarti subito.','b'];return ['Dieci minuti, un po\' di imbarazzo, e la risposta arriva per posta: tutto a posto. D\'ora in poi ci vai ogni volta che arriva la lettera.','g']}},
  {l:'La lasci tra le carte da fare',pers:{C:-2},fx:()=>{S.fatti.scrAbit=0;S.fatti.scrChiesto=S.t;return ['Resta sul mobile dell\'ingresso per settimane, poi sparisce sotto le bollette.','']}}]});
ev({id:'ita_attesa',link:1,k:'Sanità',t:'La lista d\'attesa',x:d=>`Con il Servizio sanitario la prima visita libera è fra ${d.m||3} ${(d.m||3)===1?'mese':'mesi'}.${alSud(zonaMia())?' Al Sud e nelle Isole le attese sono spesso le più lunghe d\'Italia.':''}`,c:[
  {l:'Aspetti il tuo turno',_incl:0,sub:d=>`${S.anno<1983?'Gratis':'Ticket 60 €'} · fra ${d.m||3} ${(d.m||3)===1?'mese':'mesi'}`,costo:()=>S.anno<1983?0:P(60),fx:d=>{futuro((d.m||3)/12,'ita_visita',{});return ['Segni la data sul calendario. Intanto, pazienza.','']}},
  {l:'Paghi la visita in intramoenia',_incl:0,sub:'150 € · lo stesso specialista, in una settimana',cond:()=>S.anno>=1999,costo:()=>P(150),fx:()=>cura(.6,.15)},
  {l:'Vai da uno specialista privato',_incl:0,sub:'200 € · subito',costo:()=>P(200),fx:()=>cura(.65,.2)},
  {l:'Prenoti in un\'altra regione',_incl:0,sub:'Viaggio e ticket 350 € · fra un mese',cond:()=>S.anno>=1980&&['Centro','Sud','Isole'].includes(zonaMia()),costo:()=>P(350),fx:()=>{futuro(1/12,'ita_visita',{v:1});return [`Prenoti a ${pick(['Milano','Bologna','Padova','Verona'])}: come tanti, per curarti fai qualche centinaio di chilometri.`,'']}},
  {l:'Lasci perdere',pers:{C:-1},r:'Magari passa da solo.'}]});
ev({id:'ita_visita',link:1,k:'Sanità',t:'La visita',x:d=>d.v?'Treno all\'alba, un ospedale che non conosci, una sala d\'attesa piena di accenti di tutta Italia. Poi tocca a te.':'Arriva il giorno della visita prenotata mesi fa. In sala d\'attesa, ognuno racconta i suoi acciacchi.',c:[
  {l:'Entri nello studio',_incl:0,fx:()=>cura(.6,.15)}]});
