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

/* ---------- Nipoti: dalla nascita ai pronipoti (blocco 2). Ogni passo con un nipote si fa una volta (p.nv) ---------- */
ev({id:'fig_nipote',link:1,min:40,max:100,t:'Diventi {nonno}!',x:d=>{const n=persona(d.x.n);return `${d.p.nome} ha avuto ${n.sesso==='M'?'un maschietto':'una femminuccia'}: si chiama ${n.nome}. Ti chiamano alle tre di notte per dirtelo, e tu non hai mai dormito meno di così.`},c:[
  {l:'Voglio esserci sempre',sub:'Un nonno presente',pers:{A:2},fx:d=>nasceNonno(d,'presente')},
  {l:'Ci sono quando serve',sub:'Né invadente né assente',fx:d=>nasceNonno(d,'richiesta')},
  {l:'Meglio da lontano',sub:'Hai già dato: i nipoti si godono a piccole dosi',pers:{E:-1},fx:d=>nasceNonno(d,'distante')}]});
function nasceNonno(d,stile){
  const n=persona(d.x.n);S.fatti.nonnoStile=stile;
  mod('felicita',stile==='distante'?8:12);n.rapporto=clamp(n.rapporto+(stile==='presente'?10:stile==='distante'?-12:0));
  if(!S.fatti.primoNipote){S.fatti.primoNipote=1;momento('nipote',{tit:n.nome,sub:g('Diventi nonno','Diventi nonna'),pids:[n.id]})}
  return [`È nat${gp(n,'o','a')} ${n.nome}. Sei ${g('nonno','nonna')}!${stile==='presente'?' Appena puoi, vai a trovarl'+gp(n,'o','a')+'.':stile==='distante'?' Lo vedrai alle feste.':''}`,'g'];
}

ev({id:'nip_dai_nonni',min:40,max:100,w:3,rip:1,chi:['Nipote'],pc:p=>p.eta>=3&&p.eta<=10&&!p.lontano&&stileNonno()!=='distante',t:'Un fine settimana da te',x:'{P} dorme da te per il fine settimana. Alle nove di sera è ancora svegli{po}, in pigiama, con il libro in mano: «Ancora una storia».',c:[
  {l:'Una storia, poi un\'altra',e:{f:4},fx:d=>{relD(d.p,6);ricorda(d.p,'Ti raccontava le storie fino a tardi',2)},pers:{A:1,O:1},r:'Ti addormenti prima di {lui}. Al mattino ti rimbocca le coperte.'},
  {l:'Giocate a carte fino a tardi',e:{f:3},fx:d=>{relD(d.p,8);S.bis.energia=clamp(S.bis.energia-5);ricorda(d.p,'Avete giocato a carte fino a mezzanotte',2)},pers:{E:1},r:'Ti batte tre volte su quattro. Sospetti che bari.'},
  {l:'Si va a letto, è tardi',fx:d=>{relD(d.p,-1)},pers:{C:1},r:'Protesta per cinque minuti, poi crolla.'}]});

ev({id:'nip_comunione',min:40,max:100,w:3,rip:1,chi:['Nipote'],pc:p=>p.eta>=8&&p.eta<=10&&!nv(p,'com'),t:'La prima comunione',x:d=>{nvSet(d.p,'com');return '{P} fa la prima comunione. Il vestito è nuovo, i capelli pettinati con la riga, e continua a girarsi per vedere se ci sei.'},c:[
  {l:'Un regalo importante',sub:()=>eur(P(150)),costo:()=>P(150),fx:d=>{relD(d.p,10);ricorda(d.p,'Ti ha fatto un bel regalo il giorno della sua comunione',2)},e:{f:3},r:'Ti abbraccia così forte che gli cade il fiocco.'},
  {l:'Un pensiero e il pranzo insieme',fx:d=>{relD(d.p,5);ricorda(d.p,'Eri alla sua comunione',2)},e:{f:3},r:'Il pranzo dura quattro ore. I bambini scappano dopo il secondo.'},
  {l:'Non riesci ad andare',fx:d=>{relD(d.p,-8);ricorda(d.p,'Non sei venuto alla sua comunione',-2)},pers:{A:-1},r:'Mandi un biglietto. Lo sa lui, lo sai tu.'}]});

ev({id:'nip_tema',min:40,max:100,w:3,rip:1,chi:['Nipote'],pc:p=>p.eta>=7&&p.eta<=12&&!nv(p,'tema')&&p.rapporto>=40,t:'Il tema',x:d=>{nvSet(d.p,'tema');return '{P} ha un tema per la scuola: «Intervista a una persona anziana della famiglia». Ha scelto te, e tiene la penna come un microfono.'},c:[
  {l:'Racconti la tua infanzia con cura',fx:d=>{relD(d.p,8);ricorda(d.p,'Ti ha intervistato per un tema: gli hai raccontato tutto',3)},e:{f:5},pers:{A:1,O:1},r:'Dopo due ore ha riempito tre fogli e ha un\'idea nuova del tempo.'},
  {l:'Solo le cose belle',fx:d=>{relD(d.p,5);ricorda(d.p,'Ti ha intervistato per un tema',1)},e:{f:3},r:'Tutto sole e merende. Prende nota senza fare domande.'},
  {l:'«Chiedi a tua madre»',fx:d=>{relD(d.p,-4)},pers:{C:-1},r:'Resta un po\' deluso: aveva già scritto la prima riga.'}]});

ev({id:'nip_segreto',min:40,max:100,w:3,rip:1,chi:['Nipote'],pc:p=>p.eta>=13&&p.eta<=17&&!nv(p,'segr')&&p.rapporto>=55,t:'Un segreto',x:d=>{nvSet(d.p,'segr');return '{P} ti prende da parte, in cucina, a voce bassa: '+pick(['ha una persona del cuore e non lo ha detto a nessuno','vorrebbe lasciare la scuola','ha fatto una cavolata con il motorino e ha paura di dirlo','ha il terrore di non essere all\'altezza di nessuno'])+'. «Non dirlo a nessuno, ti prego.»'},c:[
  {l:'Ascolti e tieni il segreto',fx:d=>{relD(d.p,14);ricorda(d.p,'Ti ha confidato un segreto e non l\'hai detto a nessuno',3)},e:{f:3},pers:{A:2},r:'Parla per un\'ora. Alla fine ti dice: «Sei l\'unica persona a cui potevo dirlo».'},
  {l:'Lo convinci a parlarne con i genitori',fx:d=>{relD(d.p,5);const gn=genitoreDi(d.p);if(gn)relD(gn,4);ricorda(d.p,'Ti ha confidato un segreto e ti ha dato retta',2)},pers:{C:2},r:'«Vengo con te, se vuoi.» Non ce n\'è bisogno. Ma ti ringrazia.'},
  {l:'Lo dici subito ai suoi',fx:d=>{relD(d.p,-18);const gn=genitoreDi(d.p);if(gn)relD(gn,6);ricorda(d.p,'Hai raccontato il suo segreto ai genitori',-3)},pers:{A:-1,C:1},r:'Hai fatto quello che ritenevi giusto. Non ti parla per un po\'.'}]});

ev({id:'nip_diciotto',link:1,t:'Diciotto anni',cond:d=>!d.p||d.p.vivo,x:d=>{const p=d.p,agg=aggettivi(p.pers,p.sesso,2).join(' e ')||(p.sesso==='F'?'equilibrata':'equilibrato'),a=affinita(p);return `${p.nome} compie 18 anni: è ${gp(p,'un ragazzo','una ragazza')} ${agg}. ${a>=65?'Ti somiglia più di quanto ammetta.':a<=40?'Non avete molto in comune, e si vede, ma vi volete bene lo stesso.':'Con te si trova bene, e non lo dice mai.'}`},c:[
  {l:'Un regalo per i diciotto anni',sub:()=>eur(P(300)),costo:()=>P(300),fx:d=>{relD(d.p,10);ricorda(d.p,'Ti ha dato un regalo per i suoi diciotto anni',2)},e:{f:3},r:'Lo apre davanti a tutti. Poi viene a ringraziarti senza fretta.'},
  {l:'Una lettera scritta a mano',fx:d=>{relD(d.p,9);ricorda(d.p,'Ti ha scritto una lettera per i suoi diciotto anni',3)},e:{f:4},pers:{O:1},r:'La legge da solo, in camera. Ti chiama la sera, e non sa bene cosa dire.'},
  {l:'Un abbraccio basta',fx:d=>{relD(d.p,4)},e:{f:2},r:'Basta, sì. Le parole non erano il tuo forte.'}]});

ev({id:'nip_soldi',min:40,max:100,w:3,rip:1,chi:['Nipote'],pc:p=>p.eta>=19&&p.eta<=28&&!nv(p,'soldi')&&p.rapporto>=45,t:'Una mano',x:d=>{nvSet(d.p,'soldi');return '{P} ti chiama con la voce di chi ha provato tre volte la frase: gli servono dei soldi per '+pick(['la patente','un anticipo per l\'affitto','un corso che lo porterebbe lontano','un computer per lavorare'])+'.'},c:[
  {l:'Lo aiuti',sub:()=>eur(P(1500)),costo:()=>P(1500),fx:d=>{relD(d.p,12);ricorda(d.p,'Ti ha aiutato quando ne avevi bisogno',3)},e:{f:4},pers:{A:2},r:'«Te li ridò, giuro.» Sai che lo farà, o non lo farà, e ti va bene uguale.'},
  {l:'Gli dai una mano a cavarsela da solo',fx:d=>{relD(d.p,6);ricorda(d.p,'Ti ha dato un consiglio invece dei soldi',1)},pers:{C:1},r:'Lo aiuti a fare un preventivo. Non è quello che sperava, ma ti ascolta.'},
  {l:'Dici di no',fx:d=>{relD(d.p,-8);ricorda(d.p,'Hai detto di no quando ti ha chiesto aiuto',-2)},pers:{A:-1},r:'«Capisco.» Non capisce, ma è educato.'}]});

ev({id:'nip_laurea',min:50,max:100,w:3,rip:1,chi:['Nipote'],pc:p=>p.eta>=22&&p.eta<=27&&!nv(p,'lau')&&p.id%3!==0,t:'La corona d\'alloro',x:d=>{nvSet(d.p,'lau');return '{P} si laurea. Nell\'aula c\'è il solito brusio di famiglie, e tu sei in terza fila con il vestito buono. Quando lo chiamano ti commuovi, ma non lo dai a vedere.'},c:[
  {l:'Gli fai un regalo',sub:()=>eur(P(200)),costo:()=>P(200),fx:d=>{relD(d.p,9);ricorda(d.p,'Eri alla sua laurea',3)},e:{f:6},r:'Ti presenta ai professori come {nonno}: ti si stringe la gola.'},
  {l:'Ci sei, e basta',fx:d=>{relD(d.p,6);ricorda(d.p,'Eri alla sua laurea',2)},e:{f:5},r:'Alla fine dice a tutti: «Lui c\'era».'},
  {l:'Non vieni',fx:d=>{relD(d.p,-8);ricorda(d.p,'Non sei venuto alla sua laurea',-2)},r:'Manda una foto della corona d\'alloro, con un messaggio breve.'}]});

ev({id:'nip_nozze',min:55,max:100,w:3,rip:1,chi:['Nipote'],pc:p=>p.eta>=26&&p.eta<=40&&!nv(p,'noz')&&p.rapporto>=40,t:'Il matrimonio del nipote',x:d=>{nvSet(d.p,'noz');return '{P} si sposa. Ti hanno messo al tavolo d\'onore: «Il posto più bello». Tra una portata e l\'altra ti accorgi di quanta gente è venuta anche per via di te.'},c:[
  {l:'Fai un brindisi',fx:d=>{relD(d.p,10);ricorda(d.p,'Hai fatto un brindisi al suo matrimonio',3)},e:{f:7},pers:{E:2},r:'Parli due minuti e tutti ridono. Sulla fine non ride nessuno, ed è bellissimo.'},
  {l:'Balli con la sposa',fx:d=>{relD(d.p,8);ricorda(d.p,'Hai ballato al suo matrimonio',2)},e:{f:6},r:'Un liscio da manuale. Gli invitati fanno il cerchio.'},
  {l:'Resti al tuo tavolo, tra gli anziani',fx:d=>{relD(d.p,3)},e:{f:3},r:'Vi raccontate com\'era il mondo. Alla fine qualcuno ti porta il dolce.'}]});

ev({id:'nip_pronipote',min:62,max:100,w:3,rip:1,chi:['Nipote'],pc:p=>p.eta>=27&&p.eta<=42&&!nv(p,'pron')&&p.rapporto>=35,t:'Diventi {nonno}, di nuovo',x:d=>{nvSet(d.p,'pron');return '{P} ti chiama con una voce strana: «Devo dirti una cosa». Ti siedi. Hai capito prima ancora che finisca la frase.'},c:[
  {l:'Piangi, e non te ne vergogni',fx:d=>{S.fatti.pronipoti=(S.fatti.pronipoti||0)+1;relD(d.p,8);ricorda(d.p,'Hai pianto di gioia quando ti ha detto del bambino',3);if(S.fatti.pronipoti===1)momento('nipote',{tit:'Un pronipote',sub:g('Diventi bisnonno','Diventi bisnonna'),pids:[d.p.id]})},e:{f:12},r:'Un pronipote. Un\'altra generazione che non conoscevi, e che porta un pezzo di te.'}]});
