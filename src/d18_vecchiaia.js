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

/* ---------- Il circolo (blocco 3) ---------- */
ev({id:'circ_iscrizione',link:1,t:'Il circolo',x:'In quartiere c\'è un posto dove la gente si ritrova ogni pomeriggio. Ci passi davanti da anni, e ogni volta ti dici che prima o poi entri.',c:()=>[
  ...circoliPossibili().map(c=>({l:c.n,sub:c.d,_incl:0,fx:()=>iscriviCircolo(c)})),
  {l:'Non fa per te',_incl:0,pers:{E:-1},fx:()=>{S.fatti.circRif=(S.fatti.circRif||0)+1;S.fatti.circT=S.t},r:'Un giorno, forse. Intanto tiri dritto.'}]});
ev({id:'circ_torneo',link:1,t:'Il torneo',cond:()=>circoloAttivo(),x:()=>{const t=CIRCOLI.find(c=>c.id===S.circolo.tipo).torneo;return `Al circolo c'è ${t[0]}. In palio: ${t[1]}, e soprattutto la gloria di un anno intero.`},c:[
  {l:'Giochi per vincere',p:.35,si:{e:{f:7},fx:()=>{sociCircolo().forEach(p=>relD(p,2))},r:'Vinci. Per una settimana nessuno al circolo ti parla d\'altro, e tu non fai niente perché smettano.'},no:{e:{f:1},fx:()=>{sociCircolo().forEach(p=>relD(p,1))},r:'Perdi in finale contro uno che bara con eleganza. Lo dici a tutti, senza prove.'}},
  {l:'Giochi per stare insieme',e:{f:4},fx:()=>{sociCircolo().forEach(p=>relD(p,4))},pers:{A:1},r:'Non importa chi vince: a fine serata brindate tutti alla coppa, che è di nessuno.'},
  {l:'Fai l\'arbitro',e:{f:3},fx:()=>{sociCircolo().forEach(p=>relD(p,2))},pers:{C:2},r:'Fischi un fallo che non c\'era. Il torneo si salva, la tua reputazione un po\' meno.'}]});
ev({id:'circ_presidente',link:1,t:'Il presidente',cond:()=>circoloAttivo(),x:'Il presidente storico del circolo si ritira. Tutti guardano te: «Chi meglio di te?»',c:[
  {l:'Accetti',sub:'Più responsabilità, più stress, più gente',fx:()=>{S.circolo.pres=2;S.karma=clamp(S.karma+3);S.bis.stress=clamp(S.bis.stress+6);sociCircolo().forEach(p=>relD(p,3))},e:{f:6},pers:{C:3,E:1},r:'Il primo giorno ti consegnano le chiavi e un quaderno di conti che nessuno capisce. Sei il presidente.'},
  {l:'Fai solo il cassiere',fx:()=>{sociCircolo().forEach(p=>relD(p,2))},e:{f:3},pers:{C:2},r:'Sai contare, sai dire di no: la combinazione perfetta.'},
  {l:'Rifiuti',fx:()=>{sociCircolo().forEach(p=>relD(p,-2))},pers:{E:-1},r:'Preferisci giocare e basta. Gli altri capiscono, più o meno.'}]});
ev({id:'circ_sedia',link:1,t:'Un posto libero',cond:()=>circoloAttivo(),x:d=>`${d.x.nome} non verrà più al circolo. Il suo posto, al tavolo, resta libero per un po'. Nessuno ci si siede.`,c:[
  {l:'Vai al funerale',fx:()=>{sociCircolo().forEach(p=>relD(p,4));pesa(2,1)},e:{f:-2},pers:{A:1},r:'Ci sono tutti, nel cappotto buono. Sembrate una squadra a cui hanno tolto un giocatore.'},
  {l:'Metti il suo nome sulla coppa',fx:()=>{S.karma=clamp(S.karma+1);sociCircolo().forEach(p=>relD(p,3))},e:{f:2},r:'Una targhetta nuova, accanto alle altre. Il prossimo torneo si gioca anche per lui.'},
  {l:'Non ce la fai a venire',e:{f:-3},fx:()=>pesa(2,1),r:'Resti a casa. Quando torni al circolo, quella sedia è ancora lì.'}]});
ev({id:'circ_chiude',link:1,t:'Il circolo chiude',cond:()=>circoloAttivo(),x:'I soci sono sempre meno, l\'affitto sempre di più. Il presidente appende il cartello alla porta.',c:[
  {l:'Provi a tenerlo aperto con una colletta',sub:()=>eur(P(300)),costo:()=>P(300),p:.4,si:{fx:()=>{for(let i=0;i<2;i++)nuovaPersona('Conoscente',pick(['M','F']),r(60,78),null,{rapporto:r(28,45),dove:'circolo'});S.circolo.chiude=0;S.circolo.dal=S.t},e:{f:7},pers:{C:2},r:'Funziona: arrivano due soci nuovi, e un nipote che sistema il sito. Il circolo resta aperto.'},no:{fx:()=>{S.circolo.attivo=false},e:{f:-3},r:'Non basta. Si chiude con una cena, tutti insieme, nel locale vuoto.'}},
  {l:'Cerchi un altro circolo',_incl:0,fx:()=>{S.circolo.attivo=false;S.fatti.circT=S.t-60;coda.push({e:EV.circ_iscrizione,d:{}})},r:'Ti guardi intorno. Un altro posto, un\'altra gente.'},
  {l:'Accetti la fine',fx:()=>{S.circolo.attivo=false},e:{f:-4},pers:{N:1},r:'È la fine di un\'epoca. Ti tieni, almeno, i numeri di telefono.'}]});

/* ---------- Il volontariato (blocco 3) ---------- */
ev({id:'vol_inizio',link:1,t:'Una mano agli altri',x:'Hai tempo, e ne hai di più da quando il lavoro non scandisce più le tue giornate. In parrocchia, in comune, in bacheca: gli annunci chiedono volontari.',c:()=>[
  ...volPossibili().map(v=>({l:v.n,sub:v.d,_incl:0,fx:()=>iniziaVol(v)})),
  {l:'Non adesso',_incl:0,fx:()=>{S.fatti.volT=S.t},r:'Ci pensi. Intanto sfogli un altro annuncio.'}]});
ev({id:'vol_storia',link:1,t:'Un incontro',cond:()=>volAttivo(),x:()=>{const v=VOL.find(x=>x.id===S.volont.tipo);return v.storie[(S.volont.storie||0)%v.storie.length]},c:[
  {l:'Ti fermi un\'ora in più',fx:()=>{S.volont.storie=(S.volont.storie||0)+1;S.karma=clamp(S.karma+2);S.bis.energia=clamp(S.bis.energia-4)},e:{f:6},pers:{A:2},r:'Torni a casa tardi e stanco. Per cena non mangi quasi niente, ma dormi come un ghiro.'},
  {l:'Fai il tuo turno, e basta',fx:()=>{S.volont.storie=(S.volont.storie||0)+1;S.karma=clamp(S.karma+1)},e:{f:3},r:'Hai fatto la tua parte. Domani c\'è un altro turno.'},
  {l:'Chiedi aiuto a chi sa come fare',fx:()=>{S.volont.storie=(S.volont.storie||0)+1;S.karma=clamp(S.karma+1)},e:{f:4},pers:{C:1},r:'Chiami la responsabile. Fa una telefonata, e una cosa che sembrava senza uscita ce l\'ha.'}]});
ev({id:'vol_stanco',link:1,t:'Il turno pesa',cond:()=>volAttivo(),x:'I turni si sono fatti più lunghi, o sei tu che sei più lento. Alla fine ti tremano le mani. Nessuno dice niente, ma qualcuno guarda.',c:[
  {l:'Riduci i turni',fx:()=>{S.routine.volont=Math.max(1,(S.routine.volont||0)-1)},e:{f:2},pers:{C:1},r:'Un turno in meno a settimana. La responsabile ti ringrazia di averlo detto.'},
  {l:'Continui così',fx:()=>{S.salute=clamp(S.salute-2);S.karma=clamp(S.karma+1)},e:{f:3},pers:{C:-1},r:'Non ti fermi, anche se dovresti. Qualcuno ti toglie il secchio di mano senza che tu lo chieda.'},
  {l:'Smetti, con onore',fx:()=>{S.volont.attivo=false;S.routine.volont=0},e:{f:-2},r:'Ti salutano con una torta e un biglietto firmato da tutti. Ti manca già.'}]});
ev({id:'vol_targa',link:1,t:'Una targa',x:'L\'associazione ti consegna una targa per gli anni di servizio. Sul retro c\'è il tuo nome. Sbagliato: manca una lettera.',c:[
  {l:'La appendi in corridoio',e:{f:6},fx:()=>{S.karma=clamp(S.karma+2)},r:'Ogni mattina la guardi, e ogni mattina sorridi della lettera mancante.'},
  {l:'La regali a un nuovo volontario',e:{f:5},fx:()=>{S.karma=clamp(S.karma+3)},pers:{A:2},r:'«Serve più a te.» Lo guarda come se gli avessi dato le chiavi di casa.'},
  {l:'Dici che non serviva',e:{f:2},pers:{E:-1},r:'Preferivi non fare cerimonie. Te la mettono comunque nella borsa.'}]});
ev({id:'vol_giovane',link:1,t:'Un nuovo volontario',cond:()=>volAttivo(),x:'Dalla settimana scorsa c\'è un ragazzo nuovo. Fa tutto di fretta e sbaglia tutto con entusiasmo.',c:[
  {l:'Gli insegni come si fa',fx:()=>{const p=nuovaPersona('Conoscente',pick(['M','F']),r(18,26),null,{rapporto:r(55,72),dove:'volont'});ricorda(p,'Ti ha insegnato come si fa, con pazienza',3)},e:{f:6},pers:{A:2,O:1},r:'Dopo un mese lavora quasi meglio di te. Te lo dice, e ti fa piacere.'},
  {l:'Lo lasci imparare da solo',fx:()=>{nuovaPersona('Conoscente',pick(['M','F']),r(18,26),null,{rapporto:r(35,50),dove:'volont'})},e:{f:2},r:'Sbaglia, si arrangia, impara. È un modo anche quello.'}]});

/* ---------- La solitudine dopo i 65 anni (blocco 3) ---------- */
ev({id:'sol_silenzio',link:1,t:'Il telefono',x:'Oggi il telefono non ha squillato. Nemmeno ieri, a pensarci. La casa ha un rumore di frigorifero che non avevi mai sentito.',c:[
  {l:'Chiami tu',cond:()=>vivi(['Figlio','Nipote','Fratello','Amico']).length>0,fx:()=>{const p=vivi(['Figlio','Nipote','Fratello','Amico']).sort((a,b)=>b.rapporto-a.rapporto)[0];relD(p,8);p.ultimo=S.t;S.bis.soc=clamp(S.bis.soc+15);return [`Chiami ${p.nome}. Parlate quaranta minuti di niente. Quando riattacchi, la casa è meno grande.`,'g']}},
  {l:'Vai al circolo',cond:()=>!circoloAttivo(),_incl:0,fx:()=>{coda.push({e:EV.circ_iscrizione,d:{}})},r:'Ti metti la giacca.'},
  {l:'Fai qualcosa per gli altri',cond:()=>!S.volont||!S.volont.attivo,_incl:0,fx:()=>{coda.push({e:EV.vol_inizio,d:{}})},r:'Se nessuno ha bisogno di te qui, qualcuno ne avrà altrove.'},
  {l:'Tieni accesa la radio',fx:()=>{segnaVita('solitudine');mod('felicita',-4)},pers:{N:1},r:'Una voce in casa, anche se non parla con te. Per stasera basta.'}]});
ev({id:'sol_agenda',link:1,t:'L\'agenda dei numeri',x:()=>`Apri la vecchia agenda dei numeri di telefono. ${amiciMorti()} nomi sono ormai cancellati con una riga. Altri non rispondono più, o risponde un figlio che dice «mio padre non c'è più».`,c:[
  {l:'Chiami quelli che restano',fx:()=>{S.fatti.solAgenda=1;vivi(['Amico','Fratello','Cugino']).sort((a,b)=>b.rapporto-a.rapporto).slice(0,3).forEach(p=>{relD(p,6);p.ultimo=S.t});S.bis.soc=clamp(S.bis.soc+12)},e:{f:4},pers:{A:1},r:'Telefoni ai tre che rispondono ancora. Scherzate sull\'età e sulle gambe, e vi promettete un pranzo.'},
  {l:'Non la riapri più',fx:()=>{S.fatti.solAgenda=1;pesa(2,1)},e:{f:-3},pers:{N:1},r:'La rimetti nel cassetto. Lì stanno meglio, dici. Non è vero.'},
  {l:'Ne scrivi una nuova',fx:()=>{S.fatti.solAgenda=1},e:{f:3},pers:{O:1},r:'Sulla prima pagina, i nipoti. Poi gli amici del circolo. Un\'agenda nuova è un modo di dire che non è finita.'}]});
ev({id:'sol_animale',link:1,t:'Un coinquilino',cond:()=>!S.animali.length,x:'Una vicina ha una cucciolata di gatti da regalare. Ti guarda come se la risposta fosse già sì.',c:[
  {l:'Ne prendi uno',fx:()=>{S.fatti.solAnimale=1;return adotta(ANIMALI.find(a=>a.t==='Gatto'))},pers:{A:1}},
  {l:'No, grazie',fx:()=>{S.fatti.solAnimale=1},r:'Gli animali hanno bisogno di cure: te lo ricordi, e sai che non è una scusa.'}]});
ev({id:'sol_anniversario',link:1,t:'Una data',x:d=>`Sono passati ${d.x.anni} ${d.x.anni===1?'anno':'anni'} da quando non c'è più ${d.x.nome}. Oggi la casa è piena della sua assenza.`,c:[
  {l:'Vai al cimitero',fx:()=>{pesa(2,1)},e:{f:-1},pers:{N:1},r:'Un fiore, una mano sulla pietra. Resti più del solito, poi torni a piedi.'},
  {l:'Chiami i figli, state insieme',cond:()=>vivi(['Figlio']).length>0,fx:()=>{vivi(['Figlio']).forEach(p=>relD(p,6));S.bis.soc=clamp(S.bis.soc+10)},e:{f:3},pers:{A:2},r:'Una messa, poi un pranzo. Raccontate tutti, a turno, qualcosa che non sapevate.'},
  {l:'Resti a casa con le sue foto',fx:()=>{pesa(3,2)},e:{f:-3},pers:{N:2},r:'Le guardi tutte, due volte. Alla fine non sai se ti ha fatto bene.'}]});

/* ---------- Viaggi da anziano (blocco 4): gite, crociere, le radici, un viaggio con il nipote, le nozze d'oro, l'ultimo viaggio ---------- */
ev({id:'vi_gruppo',min:62,max:92,w:3,rip:3,cond:viaggiabile,t:'La gita',x:d=>{d.x=d.x||{dove:pick(['Assisi e Loreto','le Dolomiti','i laghi del Nord','la Costiera Amalfitana','Lourdes','Venezia e le isole','la Sicilia barocca'])};return `${circoloAttivo()?'Al circolo':'In parrocchia'} organizzano una gita in pullman di tre giorni: ${d.x.dove}. Si parte alle sei, ci si siede sempre negli stessi posti e si canta, prima o poi, qualcosa che non si ricorda per intero.`},c:[
  {l:'Parti',sub:()=>eur(P(450)),costo:()=>P(450),fx:d=>{contaViaggio();S.bis.soc=clamp(S.bis.soc+15);if(chance(.5))nuovaPersona('Conoscente',pick(['M','F']),r(60,80),null,{rapporto:r(30,50),dove:'viaggio',lontano:true});return [`${d.x.dove}: ${pick(['le gambe non reggono come una volta, ma la compagnia sì','il pullman ha l\'aria condizionata al massimo e nessuno ha il coraggio di dirlo','l\'albergo ha il letto più duro della tua vita e la colazione più buona'])}. Torni con le foto e un paio di numeri di telefono nuovi.`,'g']},e:{f:8},pers:{E:1}},
  {l:'Ci vai con un amico',cond:()=>vivi(['Amico']).length>0,sub:()=>eur(P(450)),costo:()=>P(450),fx:d=>{contaViaggio();const a=vivi(['Amico']).sort((x,y)=>y.rapporto-x.rapporto)[0];relD(a,10);ricorda(a,'Siete andati in gita insieme',2);S.bis.soc=clamp(S.bis.soc+12);return [`Con ${a.nome} ti diverti il doppio, e vi prendete in giro per tutto il viaggio. ${d.x.dove} passa in secondo piano.`,'g']},e:{f:9}},
  {l:'Preferisci restare a casa',fx:()=>{S.fatti.viaggiRif=(S.fatti.viaggiRif||0)+1},e:{f:-1},pers:{O:-1},r:'Ti dici che le gite non ti piacciono più. In pullman ti piacevano, una volta.'}]});

ev({id:'vi_crociera',min:62,max:90,w:2,rip:6,dal:1980,cond:()=>viaggiabile()&&S.soldi>=P(3000),t:'Una crociera',x:'L\'agenzia ti manda l\'opuscolo: sette notti nel Mediterraneo, tutto compreso, con il buffet che a un certo punto sembra una minaccia.',c:[
  {l:'Ci vai con il tuo partner',cond:()=>!!partnerAttuale(),sub:()=>eur(P(3400)),costo:()=>P(3400),fx:()=>{contaViaggio();segnaVita('viaggio');const pa=partnerAttuale();pa.rapporto=clamp(pa.rapporto+10);ricorda(pa,'Una crociera insieme, a quest\'età',3);return [`Cabina con il balcone, tramonti in mezzo al mare e il ballo del sabato sera. ${pa.nome} ti dice che è la vacanza più bella da vent'anni.`,'g']},e:{f:12},pers:{O:1}},
  {l:'Da sol{o}, in cabina singola',sub:()=>eur(P(2800)),costo:()=>P(2800),fx:()=>{contaViaggio();segnaVita('viaggio');S.bis.soc=clamp(S.bis.soc+14);return ['Al tavolo con altri tre, ognuno con la sua storia e la sua vedovanza. Alla fine ci scambiamo gli indirizzi, e ogni tanto una cartolina arriva davvero.','g']},e:{f:9},pers:{E:2}},
  {l:'Con i nipoti',cond:()=>vivi(['Nipote']).some(n=>n.eta>=8&&n.eta<=22),sub:()=>eur(P(5200)),costo:()=>P(5200),fx:()=>{contaViaggio();const n=vivi(['Nipote']).filter(x=>x.eta>=8&&x.eta<=22);n.forEach(x=>{relD(x,10);ricorda(x,'Una crociera con il nonno',3)});return ['Passano tutto il tempo allo scivolo d\'acqua e a mangiare gelati. Quando tornano a casa raccontano che sei il più simpatico della nave.','g']},e:{f:11},pers:{A:2}},
  {l:'Non fa per te',fx:()=>{S.fatti.viaggiRif=(S.fatti.viaggiRif||0)+1},r:'Una città galleggiante ti mette in agitazione. Strappi l\'opuscolo.'}]});

ev({id:'vi_radici',min:62,max:90,w:3,once:1,cond:()=>viaggiabile()&&(!!S.fatti.esteroStorico||(!!S.fatti.cittaNascita&&S.fatti.cittaNascita!==S.citta))&&!(S.fatti.desiderio&&S.fatti.desiderio.id==='luogo'),t:'Le tue radici',x:()=>{const E=S.fatti.esteroStorico;return E?`Sono passati decenni da quando vivevi a ${E.n}. Ogni tanto ne parli ancora, e ogni volta ti accorgi che la città è nei tuoi racconti più grande di com'era.`:`Non rivedi ${luogoNascita()} da una vita. Ti sono rimasti i nomi delle strade e l'odore del forno, e ti chiedi quanto ne sia rimasto.`},c:[
  {l:'Parti',sub:()=>eur(P(700)),costo:()=>P(700),fx:()=>{contaViaggio();const E=S.fatti.esteroStorico,luogo=E?E.n:luogoNascita();vivi(['Amico','Cugino','Fratello']).filter(p=>p.lontano).forEach(p=>relD(p,3));mod('felicita',12);return [`Torni a ${luogo}. ${pick(['La strada della tua infanzia è asfaltata e ha un\'altra gente','Il vecchio bar non c\'è più, ma qualcuno ricorda ancora il tuo nome','Una porta che conoscevi è rimasta uguale, e con quella dietro tutto il resto'])}. Resti tre giorni in più del previsto.`,'g']},pers:{O:2}},
  {l:'Ci vai con un figlio o un nipote',cond:()=>vivi(['Figlio','Nipote']).length>0,sub:()=>eur(P(1000)),costo:()=>P(1000),fx:()=>{contaViaggio();const p=pick(vivi(['Figlio','Nipote']));relD(p,10);ricorda(p,'Ti ha portato a rivedere i posti della sua infanzia',3);mod('felicita',13);return [`${p.nome} ti accompagna e ti fa da guida a rovescio: sei tu a raccontargli i posti. Per una volta, tocca a lui ascoltare.`,'g']},pers:{A:1,O:1}},
  {l:'Preferisci ricordarlo com\'era',fx:()=>{S.fatti.viaggiRif=(S.fatti.viaggiRif||0)+1},e:{f:-1},pers:{N:1},r:'Alcuni posti è meglio tenerli dentro, dove nessuno li cambia.'}]});

ev({id:'vi_nipote',min:60,max:100,w:3,rip:1,chi:['Nipote'],cond:viaggiabile,pc:p=>p.eta>=10&&p.eta<=22&&!nv(p,'viag')&&p.rapporto>=55&&stileNonno()!=='distante',t:'Un viaggio con te',x:d=>{nvSet(d.p,'viag');return '{P} ti guarda come se avesse preparato il discorso: «Mi porti da qualche parte? In un posto che per te è importante?»'},c:[
  {l:'Un weekend in treno',sub:()=>eur(P(350)),costo:()=>P(350),fx:d=>{contaViaggio();relD(d.p,12);ricorda(d.p,'Un weekend in treno con te',3)},e:{f:7},pers:{A:1},r:'Un posto piccolo, tre cose da vedere e una trattoria. Tornate con gli stessi ricordi e storie diverse da raccontare.'},
  {l:'Un viaggio lungo, solo voi due',sub:()=>eur(P(1200)),costo:()=>P(1200),fx:d=>{contaViaggio();segnaVita('viaggio');relD(d.p,16);ricorda(d.p,'Un viaggio solo noi due, e non l\'ho più dimenticato',3);S.bis.energia=clamp(S.bis.energia-8)},e:{f:11},pers:{O:2,A:1},r:'Vi stancate, vi perdete due volte e vi capite sempre. Alla fine ti dice: «Il prossimo lo scelgo io».'},
  {l:'«Magari quando sarai più grande»',fx:d=>{relD(d.p,-4);ricorda(d.p,'Hai rimandato il viaggio che ti chiedeva',-1)},pers:{O:-1},r:'Lui annuisce, ma capisce che «più grande» è lontano.'}]});

ev({id:'vi_nozze_oro',min:70,max:100,w:6,once:1,chi:['Coniuge'],pc:p=>p.nozze!==undefined&&S.t-p.nozze>=600,t:'Cinquant\'anni insieme',x:'Cinquant\'anni di matrimonio. I figli, a un certo punto, hanno cominciato a sussurrare in cucina, e ora ti dicono: «Abbiamo pensato a una cosa».',c:[
  {l:'Un viaggio a due, dove siete andati la prima volta',sub:()=>eur(P(1800)),costo:()=>P(1800),cond:()=>viaggiabile(),fx:d=>{contaViaggio();segnaVita('viaggio');d.p.intim=clamp((d.p.intim||50)+8);d.p.imp=clamp((d.p.imp||50)+8);ricorda(d.p,'Le nozze d\'oro, nello stesso posto della prima volta',3);return [`Lo stesso albergo, o quel che ne resta. Camminate lenti, mano nella mano, a guardare ciò che avete già visto e che sembra nuovo.`,'g']},e:{f:14},pers:{A:1}},
  {l:'Una festa con tutta la famiglia',sub:()=>eur(P(1500)),costo:()=>P(1500),fx:d=>{famigliaViva().forEach(p=>{p.rapporto=clamp(p.rapporto+6);ricorda(p,'Alle nozze d\'oro, tutti insieme',3)});d.p.imp=clamp((d.p.imp||50)+6);return ['Una torta a quattro piani e tre generazioni a tavola. Il discorso lo fai in piedi, senza foglietto, e per una volta non ti tremano le mani.','g']},e:{f:12},pers:{E:2}},
  {l:'Una cena in due, e basta',fx:d=>{d.p.intim=clamp((d.p.intim||50)+5);d.p.imp=clamp((d.p.imp||50)+5)},e:{f:8},r:'Una candela, il vostro piatto, il vecchio disco. Cinquant\'anni e non avete più nulla da dimostrare.'}]});
ev({id:'vi_stop',link:1,t:'L\'ultimo viaggio',x:()=>`Il medico è stato chiaro: niente più viaggi lunghi. Sul tavolo ci sono le foto di ${S.fatti.viaggiAnz===1?'quel viaggio':'questi '+S.fatti.viaggiAnz+' viaggi'}, in una scatola di scarpe.`,c:[
  {l:'Le riguardi una per una',e:{f:3},pers:{N:-1},r:'Hai viaggiato fin dove potevi. A pensarci, è un buon conto.'},
  {l:'Le dai ai nipoti',cond:()=>vivi(['Nipote']).length>0,fx:()=>{vivi(['Nipote']).forEach(p=>{relD(p,5);ricorda(p,'Ti ha dato le foto dei suoi viaggi, con i nomi sul retro',2)})},e:{f:4},pers:{A:2},r:'Sul retro hai scritto data e luogo. Lo faceva anche tua madre, e non lo sapevi.'},
  {l:'Ti arrabbi con il medico',e:{f:-3},pers:{N:2},r:'Dici che ne sa meno di te, e poi per tre giorni non mangi la minestra.'}]});
