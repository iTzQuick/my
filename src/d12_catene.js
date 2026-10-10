/* ================= CATENE: STORIE CHE DURANO MESI O ANNI (ROADMAP, Fase 1.4) =================
   Ogni catena parte da un evento casuale e continua con eventi «link» (fut:[anni,id] o futuro()),
   così una scelta di oggi torna più avanti. Le condizioni dei passi successivi si ricontrollano quando arrivano. */

/* ---------- La ristrutturazione infinita ---------- */
ev({id:'cat_ristrutt',min:28,max:75,once:1,cond:()=>S.casa.tipo==='proprieta',t:'Il bagno da rifare',x:'Il bagno di casa ha quarant\'anni: piastrelle verde salvia e una doccia che gocciola dal 1985. Arrivano due preventivi.',c:[
  {l:'L\'impresa che costa meno',sub:()=>eur(P(7000)),costo:()=>P(7000),pers:{C:-1},fut:[.5,'cat_ristrutt2'],r:'Il titolare è simpaticissimo e promette: «Sei settimane, chiavi in mano.»'},
  {l:'L\'impresa seria, con referenze',sub:()=>eur(P(12000)),costo:()=>P(12000),pers:{C:2},fx:()=>{const c=casaMia();if(c)c.valore=Math.round(c.valore*1.03)},r:'Puntuali, puliti, precisi. Sei settimane esatte. Esistono davvero.'},
  {l:'Rimandi all\'anno prossimo',pers:{N:1},r:'La doccia continua a gocciolare. Ti ci affezioni.'}]});
ev({id:'cat_ristrutt2',link:1,cond:()=>S.casa.tipo==='proprieta',t:'Lavori in corso',x:'Dovevano essere sei settimane. Siamo al quarto mese, il bagno è un cantiere e l\'impresa non si fa vedere da dieci giorni.',c:[
  {l:'Minacci di rivolgerti a un avvocato',pers:{A:-2,E:1},fut:[.5,'cat_ristrutt3'],r:'Il titolare giura che lunedì tornano. Lunedì non tornano.'},
  {l:'Chiami un\'altra ditta per finire',sub:()=>eur(P(4000)),costo:()=>P(4000),pers:{C:2},r:'In tre settimane è tutto finito. Hai pagato due volte, ma hai un bagno.'},
  {l:'Finisci da sol{o} con i tutorial',pers:{O:2,C:1},fx:()=>{S.bis.energia=clamp(S.bis.energia-10);mod('felicita',chance(.6)?4:-4)},r:'Tre weekend tra stucco e silicone. Il risultato è… personale.'}]});
ev({id:'cat_ristrutt3',link:1,t:'Il giudice di pace',x:'Dopo una lettera dell\'avvocato, la causa con l\'impresa arriva davanti al giudice di pace.',c:[
  {l:'Vai fino in fondo',sub:()=>`Avvocato ${eur(P(1200))}`,costo:()=>P(1200),p:.65,si:{fx:()=>soldi(P(5000)),pers:{C:1},r:'Il giudice ti dà ragione: l\'impresa ti restituisce 5.000 €. Il bagno lo finisce un altro, ma con i loro soldi.'},no:{pers:{N:1},r:'L\'impresa nel frattempo è fallita. Vinci la causa, ma non vedrai un euro.'}},
  {l:'Accetti un accordo',pers:{A:1},fx:()=>soldi(P(2000)),r:'Ti restituiscono 2.000 € e ti lasciano le piastrelle avanzate. Chiusa.'}]});

/* ---------- La vertenza di lavoro ---------- */
ev({id:'cat_vertenza',min:25,max:62,once:1,cond:()=>!!S.lavoro&&!JOB[S.lavoro.id].pt&&!isPiva(S.lavoro)&&!(S.lavoro.contratto&&S.lavoro.contratto.t==='carica'),t:'Gli straordinari',x:'Da un anno fai straordinari che nessuno ti paga. In busta paga non compaiono mai.',c:[
  {l:'Ti rivolgi al sindacato',pers:{C:1,E:1},fut:[.5,'cat_vertenza2'],r:'Il sindacalista ascolta, prende appunti e dice: «Ha tenuto traccia delle ore? Bene.»'},
  {l:'Ne parli con l\'ufficio del personale',p:.35,si:{fx:()=>soldi(P(1500)),pers:{E:1},r:'Riconoscono l\'errore: arretrati in busta il mese dopo.'},no:{fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-4)},pers:{N:1},r:'«Qui tutti fanno qualche ora in più.» E da quel giorno ti guardano storto.'}},
  {l:'Lasci perdere: c\'è la crisi',pers:{A:1,N:1},fx:()=>pesa(4,2),r:'Continui a uscire alle otto di sera. Ogni tanto ci ripensi.'}]});
ev({id:'cat_vertenza2',link:1,cond:()=>!!S.lavoro,t:'La conciliazione',x:'Il sindacato ha chiesto all\'azienda il pagamento degli straordinari. L\'azienda propone un incontro di conciliazione.',c:[
  {l:'Accetti la proposta dell\'azienda',pers:{A:1},fx:()=>{const x=P(r(2500,4000));soldi(x);if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-2);return [`Firmi un accordo: ${eur(x)} di arretrati. Meno di quanto ti spettava, ma subito.`,'g']}},
  {l:'Rifiuti e vai in tribunale',pers:{C:1,A:-1},fut:[1.2,'cat_vertenza3'],fx:()=>pesa(5,2),r:'La causa parte. I colleghi ti guardano come un eroe, o come un pazzo.'},
  {l:'Ti licenzi e cerchi altro',pers:{O:2,N:-1},fx:()=>{licenzia(`Ti dimetti per giusta causa: in questo caso spetta anche ${S.anno>=2015?'la NASpI':S.anno>=2013?"l'ASpI":"l'indennità di disoccupazione"}.`);S.fatti.cercaAltro=S.t},r:'Una porta che si chiude. Le offerte sono nella scheda Lavoro.'}]});
ev({id:'cat_vertenza3',link:1,auto:{p:.6,si:{fx:()=>{const x=P(r(7000,14000));soldi(x);mod('felicita',8);return [`Sentenza del giudice del lavoro: l'azienda ti deve ${eur(x)} tra straordinari, interessi e spese. Hai vinto.`,'g']}},no:{fx:()=>{soldi(-P(2500));mod('felicita',-6);return ['Il giudice dà ragione all\'azienda: le ore in più non erano documentate abbastanza. Paghi le spese legali.','b']}}},t:'La sentenza'});

/* ---------- Il figlio che torna a casa ---------- */
ev({id:'cat_ritorno',min:52,max:82,once:1,chi:['Figlio'],pc:p=>p.eta>=28&&p.eta<=42&&p.fuori&&!p.lontano,t:'Si torna a casa',x:'{P}, {eta} anni, ha perso il lavoro e la casa in affitto. Ti chiede se può tornare a vivere da te «per qualche mese».'.replace('{eta}','ormai adult{po}'),c:[
  {l:'Certo, la tua camera è sempre lì',pers:{A:2},fx:d=>{d.p.fuori=false;d.p.rapporto=clamp(d.p.rapporto+6);futuro(1,'cat_ritorno2',d)},r:'La cameretta con i poster dei vent\'anni torna ad abitarsi. Anche la lavatrice lavora il doppio.'},
  {l:'Sì, ma con regole precise',pers:{C:2},fx:d=>{d.p.fuori=false;d.p.rapporto=clamp(d.p.rapporto+2);futuro(1,'cat_ritorno2',d)},r:'Contributo alla spesa, turni per le pulizie e una scadenza: un anno.'},
  {l:'{Gli} dici di cavarsela da sol{po}',pers:{A:-2,C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-12);ricorda(d.p,'Non l\'hai accolt'+gp(d.p,'o','a')+' quando era in difficoltà')},r:'Trova ospitalità da un amico. Le telefonate, per un po\', si fanno rare.'}]});
ev({id:'cat_ritorno2',link:1,cond:d=>d.p&&!d.p.fuori,t:'Un anno dopo',x:'È passato un anno. {P} è ancora a casa: qualche lavoretto, molto divano, ogni tanto cucina per tutti.',c:[
  {l:'{Lo} aiuti a cercare lavoro sul serio',pers:{C:2,A:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3);futuro(.5,'cat_ritorno3',d)},r:'Curriculum riscritto insieme, tre colloqui in un mese.'},
  {l:'Va bene così: è bello aver{lo} a casa',pers:{A:2,C:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+5);mod('felicita',3);futuro(1,'cat_ritorno3',d)},r:'Le cene insieme ti erano mancate più di quanto pensassi.'},
  {l:'Fissi una data per l\'uscita',pers:{C:2,A:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-5);futuro(.5,'cat_ritorno3',d)},r:'Un calendario appeso in cucina con un cerchio rosso. Messaggio ricevuto.'}]});
ev({id:'cat_ritorno3',link:1,t:'Di nuovo fuori',x:'{P} ha trovato un lavoro e una casa: a fine mese se ne va di nuovo.',c:[
  {l:'{Lo} aiuti con il trasloco',pers:{A:1},fx:d=>{d.p.fuori=true;d.p.stato='lavora';d.p.rapporto=clamp(d.p.rapporto+6);ricorda(d.p,'Ti ha aiutato nel momento più difficile'.replace('Ti ha aiutato','L\'hai aiutat'+gp(d.p,'o','a')))},r:'Scatoloni, pizza sul pavimento e un abbraccio lunghissimo sulla porta.'},
  {l:'Ti commuovi più del previsto',pers:{N:1,A:1},fx:d=>{d.p.fuori=true;d.p.stato='lavora';mod('felicita',-2)},r:'La casa torna silenziosa. Tieni la sua camera così com\'è, per un po\'.'},
  {l:'Festeggi il ritorno della tua libertà',pers:{E:1},fx:d=>{d.p.fuori=true;d.p.stato='lavora';mod('felicita',5)},r:'Divano libero, telecomando tuo, frigo pieno più a lungo. Ti vergogni un po\' di quanto sei content{o}.'}]});

/* ---------- Il cane randagio ---------- */
ev({id:'cat_randagio',min:8,max:14,once:1,cond:()=>!haAnimale('Cane'),t:'Il randagio',x:'Un cane randagio, magro e con un orecchio storto, ti segue fino a scuola. All\'uscita è ancora lì.',c:[
  {l:'Gli porti da mangiare di nascosto',pers:{A:2,C:-1},fut:[.3,'cat_randagio2'],r:'Ogni mattina mezzo panino in più nello zaino. Il cane ti aspetta al cancello.'},
  {l:'Chiami il canile municipale',pers:{C:2},r:'Lo portano via con delicatezza. Ti promettono che troverà una famiglia.'},
  {l:'Scappi: ti fa paura',pers:{N:2},r:'Lo guardi dalla finestra della classe. Il giorno dopo non c\'è più.'}]});
ev({id:'cat_randagio2',link:1,t:'Il segreto si scopre',x:'Tua madre ti vede dalla finestra mentre dai da mangiare al cane davanti al portone. Ormai lo chiami Briciola.',c:[
  {l:'Implori di tenerlo',p:()=>({umile:.45,media:.6,agiata:.7})[S.classe],si:{fx:()=>{const A=ANIMALI[0];const a=initAnimale({t:'Cane',nome:'Briciola',eta:3,max:r(A.max[0],A.max[1])});S.animali.push(a);mod('felicita',10);futuro(.4,'cat_randagio3',{})},pers:{A:1,E:1},r:'Dopo una settimana di trattative, Briciola entra in casa. Dorme ai piedi del tuo letto.'},no:{fx:()=>mod('felicita',-5),pers:{N:1},r:'«Non possiamo.» Lo portate insieme al canile. Piangi tutta la sera.'}},
  {l:'Proponi di cercargli una famiglia',pers:{C:1,A:1},r:'Volantini in tutto il quartiere. Lo adotta una signora gentile del terzo piano: puoi andarlo a trovare quando vuoi.'}]});
ev({id:'cat_randagio3',link:1,cond:()=>S.animali.some(a=>a.nome==='Briciola'),t:'Il vero padrone',x:'Un anziano del quartiere ferma te e Briciola: «Ma quello è Toby! Mi era scappato un anno fa.»',c:[
  {l:'Glielo restituisci',pers:{A:3},fx:()=>{S.animali=S.animali.filter(a=>a.nome!=='Briciola');mod('felicita',-6);S.karma=clamp(S.karma+6);return ['Il signore piange. Ti invita a portarlo a spasso quando vuoi: lo farai ogni domenica.','']}},
  {l:'Lasciate decidere al cane',pers:{O:2},fx:()=>{if(chance(.6)){mod('felicita',4);return ['Il cane guarda lui, poi te, e si siede sui tuoi piedi. Il signore sorride: «Ha scelto.»','g']}S.animali=S.animali.filter(a=>a.nome!=='Briciola');mod('felicita',-5);return ['Il cane corre dal vecchio padrone scodinzolando. Fa male, ma è giusto così.','']}},
  {l:'Dici che si sbaglia',pers:{A:-2},fx:()=>{S.karma=clamp(S.karma-4);return ['Il signore se ne va a testa bassa. Briciola resta, ma tu ci pensi a lungo.','']}}]});

/* ---------- La capanna ---------- */
ev({id:'cat_capanna',min:8,max:12,once:1,t:'La capanna',x:'Con gli amici trovate un posto perfetto nel boschetto dietro casa: si può costruire una capanna.',c:[
  {l:'Un club segreto, con regole e parola d\'ordine',pers:{C:2,E:1},fut:[.4,'cat_capanna2'],r:'Assi, teli e una bandiera fatta con una maglietta. Il club ha un nome che non si può dire.'},
  {l:'Una capanna aperta a tutti',pers:{A:2,O:1},fut:[.4,'cat_capanna2'],r:'Ogni pomeriggio arriva qualcuno di nuovo con un pezzo di legno.'},
  {l:'Meglio giocare al parco',pers:{O:-1},r:'Il boschetto resta un boschetto.'}]});
ev({id:'cat_capanna2',link:1,t:'L\'assedio',x:'Un gruppo di ragazzi più grandi vuole prendersi la vostra capanna.',c:[
  {l:'La difendete',p:.5,si:{e:{f:5},pers:{E:2,N:-1},fut:[.5,'cat_capanna3'],r:'Fortezza inespugnabile. I grandi se ne vanno ridendo, ma se ne vanno.'},no:{e:{f:-4},pers:{N:1},fut:[.5,'cat_capanna3'],r:'Perdete la capanna e un pallone. Ma il club resta unito.'}},
  {l:'Proponete di dividerla',pers:{A:2},fut:[.5,'cat_capanna3'],r:'I grandi vi insegnano a fare i nodi. Diventa la capanna di tutti.'},
  {l:'Ne costruite un\'altra più in là',pers:{O:2},r:'La seconda capanna è ancora meglio, e nessuno sa dov\'è.'}]});
ev({id:'cat_capanna3',link:1,t:'Il temporale',x:'Un temporale di fine estate spazza via la capanna. Restano assi bagnate e la bandiera impigliata in un ramo.',c:[
  {l:'Fate un patto: ritrovarvi qui da grandi',pers:{A:1,O:1},fx:()=>{futuro(18,'cat_capanna4',{});mod('felicita',2)},r:'Mani una sopra l\'altra: «Tra vent\'anni, qui.» Sembra una promessa da film.'},
  {l:'La ricostruite più forte',pers:{C:2},e:{f:3},r:'Con i chiodi del nonno di qualcuno. Resiste fino all\'inverno.'},
  {l:'È finita un\'epoca',pers:{N:1},r:'Tieni la bandiera in un cassetto. Ce l\'avrai per anni.'}]});
ev({id:'cat_capanna4',link:1,t:'Il patto',x:'Vent\'anni fa, sotto una capanna distrutta dal temporale, avevate fatto un patto. Qualcuno del vecchio club ti scrive: «Allora? Domenica, al boschetto?»',c:[
  {l:'Ci vai',pers:{E:1,A:1},fx:()=>{mod('felicita',8);S.bis.soc=clamp(S.bis.soc+12);const c=candidatoAmico();c.eta=S.eta+r(-1,1);c.nome=nomeLibero(c.sesso,S.anno-c.eta);const p=nuovaPersona('Amico',c.sesso,c.eta,c.cognome,{nome:c.nome,pers:c.pers,rapporto:r(55,70)});return [`Siete in quattro su sei. Al posto della capanna c'è un parcheggio, ma ridete per ore. Con ${p.nome} vi ritrovate davvero.`,'g']}},
  {l:'Non te la senti',pers:{E:-1,N:1},fx:()=>mod('felicita',-2),r:'Guardi le foto della rimpatriata sul telefono. Sembrano felici.'}]});

/* ---------- L'orto urbano ---------- */
ev({id:'cat_orto',min:40,max:85,once:1,cond:()=>luogo().p>=30000,t:'Gli orti comunali',x:'Il Comune assegna piccoli orti ai cittadini: una striscia di terra, un rubinetto in comune e un capanno per gli attrezzi.',c:[
  {l:'Fai domanda',sub:()=>eur(P(60))+' l\'anno',costo:()=>P(60),pers:{C:1,O:1},fut:[.4,'cat_orto2'],r:'Ti assegnano il lotto numero 23. Il vicino di lotto ti saluta con una zucchina in mano.'},
  {l:'Preferisci i vasi sul balcone',pers:{E:-1},r:'Basilico, pomodorini e un peperoncino che diventa il tuo orgoglio.'},
  {l:'Non hai il pollice verde',pers:{O:-1},r:'Le piante finte non muoiono mai.'}]});
ev({id:'cat_orto2',link:1,t:'Le zucchine sparite',x:'L\'orto cresce bene. Ma qualcuno, la notte, ti ruba le zucchine più belle.',c:[
  {l:'Fai la posta all\'alba',pers:{C:1,E:1},fx:()=>{futuro(.5,'cat_orto3',{x:'amico'})},r:'Il ladro è il signor Gino, 82 anni: «Le tue venivano meglio delle mie.» Finisce con un caffè.'},
  {l:'Lasci un biglietto: «Basta chiedere»',pers:{A:2},fx:()=>{S.karma=clamp(S.karma+2);futuro(.5,'cat_orto3',{x:'biglietto'})},r:'Il giorno dopo trovi un barattolo di marmellata fatta in casa al posto delle zucchine.'},
  {l:'Recinti il lotto',pers:{A:-1,C:1},fx:()=>{soldi(-P(80));futuro(.5,'cat_orto3',{x:'recinto'})},r:'Rete e lucchetto. Le zucchine sono salve, il clima tra gli ortolani un po\' meno.'}]});
ev({id:'cat_orto3',link:1,t:'La festa degli orti',x:'A settembre c\'è la festa degli orti con la gara della zucca più grande.',c:[
  {l:'Presenti la tua zucca',p:()=>.35+pz('C')*.15,si:{e:{f:7},pers:{E:1},fx:()=>S.bis.soc=clamp(S.bis.soc+10),r:'Trentadue chili: primo premio! Una targa e la foto sul giornale del quartiere.'},no:{e:{f:2},pers:{N:-1},r:'Arrivi quart{o}. La zucca diventa vellutata per tutto il palazzo.'}},
  {l:'Cucini per tutti con quello che hai raccolto',pers:{A:2,E:1},fx:()=>{S.bis.soc=clamp(S.bis.soc+12);mod('felicita',5);const c=candidatoAmico();c.eta=Math.max(40,S.eta+r(-10,10));c.nome=nomeLibero(c.sesso,S.anno-c.eta);const n=nuovoConoscente(c,'orto');return [`La tua parmigiana di melanzane finisce in dieci minuti. ${n.nome} ti chiede la ricetta.`,'g']}}]});

/* ---------- Il romanzo nel cassetto ---------- */
ev({id:'cat_romanzo',min:25,max:72,once:1,cond:()=>pz('O')>-.2,t:'Un\'idea per un romanzo',x:'Da mesi ti gira in testa una storia. I personaggi ti parlano mentre aspetti l\'autobus.',c:[
  {l:'Scrivi ogni sera, un\'ora',pers:{C:3,O:2},fut:[1.5,'cat_romanzo2'],fx:()=>{S.abil.arte=clamp(S.abil.arte+3)},r:'Le prime pagine sono terribili. Le centesime un po\' meno.'},
  {l:'Scrivi solo quando arriva l\'ispirazione',pers:{O:2,C:-1},fut:[3,'cat_romanzo2'],r:'L\'ispirazione arriva di rado, ma arriva.'},
  {l:'Un giorno, forse',pers:{O:-1},r:'La storia resta nella tua testa. Ogni tanto la racconti agli amici.'}]});
ev({id:'cat_romanzo2',link:1,t:'La parola «fine»',x:'Trecentoventi pagine. Hai scritto la parola «fine». E adesso?',c:[
  {l:'Lo mandi a trenta case editrici',p:.18,si:{x:'editore',fut:[1,'cat_romanzo3'],pers:{C:1},r:'Ventinove non rispondono. La trentesima chiama: «Vorremmo pubblicarlo.»'},no:{pers:{N:1},fx:()=>mod('felicita',-4),r:'Ventotto silenzi e due «non rientra nella nostra linea editoriale». Il manoscritto torna nel cassetto.'}},
  {l:'Lo pubblichi da sol{o} online',x:'self',fut:[1,'cat_romanzo3'],pers:{O:1,E:1},sub:()=>eur(P(400)),costo:()=>P(400),r:'Copertina, impaginazione, codice ISBN. Il libro esiste.'},
  {l:'Lo fai leggere solo a chi ami',pers:{A:1,E:-1},fx:()=>mod('felicita',4),r:'Tre lettori, tre lettori commossi. Ti basta.'}]});
ev({id:'cat_romanzo3',link:1,t:'La presentazione',x:d=>d.x==='editore'?'È il giorno della presentazione in libreria. Sedie in fila, il tuo nome sul manifesto.':'Il tuo libro autopubblicato è online da un anno. Una libreria del quartiere ti invita a presentarlo.',c:[
  {l:'Leggi un brano con la voce che trema',pers:{E:2,N:-1},fx:d=>{const ok=chance(d.x==='editore'?.35:.12);const x=P(ok?r(4000,15000):r(300,1500));soldi(x);mod('felicita',ok?12:6);if(ok)S.fama=clamp(S.fama+4);return ok?[`Il libro funziona: ristampe, recensioni e ${eur(x)} di diritti. Ti scrivono lettori che non conosci.`,'g']:[`Venti persone in sala, quaranta copie vendute. ${eur(x)} di diritti, e la sensazione di aver fatto una cosa grande.`,'g']}},
  {l:'Ti nascondi dietro la moderatrice',pers:{E:-1},fx:()=>{mod('felicita',3);soldi(P(r(200,800)))},r:'Parla quasi solo lei. Alla fine qualcuno ti chiede l\'autografo, e arrossisci.'}]});

/* ---------- Il primo amore ritrovato ---------- */
ev({id:'cat_primo_amore',min:38,max:72,once:1,cond:()=>S.anno>=2008,t:'Un nome dal passato',x:'Ti arriva una richiesta di amicizia: è il tuo primo amore del liceo. Nella foto profilo sorride come allora.',c:[
  {l:'Accetti e scrivi «Quanto tempo!»',pers:{O:1,E:1},fut:[.3,'cat_primo_amore2'],r:'Vi scrivete fino a tardi. Ricordi che credevi di aver perso.'},
  {l:'Accetti, ma non scrivi',pers:{E:-1},r:'Ogni tanto metti un «mi piace» alle sue foto delle vacanze.'},
  {l:'Ignori la richiesta',pers:{N:1},r:'Certe porte è meglio lasciarle chiuse.'}]});
ev({id:'cat_primo_amore2',link:1,t:'Un caffè?',x:()=>`Dopo settimane di messaggi arriva la proposta: «Sono a ${S.citta} venerdì. Ci prendiamo un caffè?»${partnerAttuale()?' A casa c\'è chi ti aspetta.':''}`,c:[
  {l:'Vai',pers:{O:1,E:1},fut:[.1,'cat_primo_amore3'],r:'Ti cambi tre volte. Per un caffè.'},
  {l:'Proponi di vedervi con le rispettive famiglie',cond:()=>!!partnerAttuale(),pers:{C:2,A:1},fx:()=>{mod('felicita',3);const pa=partnerAttuale();pa.imp=clamp(pa.imp+3)},r:'Una cena a quattro, piacevole e un po\' surreale. Il passato resta passato.'},
  {l:'Declini con gentilezza',pers:{C:1},r:'«Magari un\'altra volta.» Sapete entrambi che non ci sarà.'}]});
ev({id:'cat_primo_amore3',link:1,t:'Venerdì',x:'Il caffè diventa un pranzo, il pranzo una passeggiata. Sembra che non sia passato un giorno.',c:d=>partnerAttuale()?[
  {l:'Torni a casa e racconti tutto',pers:{C:2,A:1},fx:()=>{const pa=partnerAttuale();pa.intim=clamp(pa.intim+(chance(.6)?4:-6));return [`Racconti tutto a ${pa.nome}. Ne parlate a lungo. È una sera strana, ma onesta.`,'']}},
  {l:'Tieni questo ricordo per te',pers:{N:1},fx:()=>{pesa(4,3);return ['Non è successo niente. Ma qualcosa, dentro, si è mosso.','']}},
  {l:'Lasci che succeda',pers:{C:-3,A:-2},fx:()=>{const pa=partnerAttuale();if(chance(.4)){pa.intim=clamp(pa.intim-25);pa.imp=clamp(pa.imp-25);ricorda(pa,'Ti ha scoperto con il tuo primo amore'.replace('Ti ha scoperto','Ha scoperto il tuo tradimento'));return [`${pa.nome} trova i messaggi. La crisi è profonda.`,'b']}pesa(8,4);return ['Un pomeriggio che nessuno saprà mai. Il senso di colpa invece resta, e pesa.','b']}}]:[
  {l:'Lasci che succeda',pers:{O:2,E:1},fx:()=>{const c=candidato();c.eta=S.eta+r(-1,1);const p=nuovaPersona('Partner',c.sesso,c.eta,c.cognome,{nome:c.nome,pers:c.pers,rapporto:r(70,88),primoAmore:1});mod('felicita',12);return [`Con ${p.nome} ricominciate, trent'anni dopo, da dove vi eravate lasciati.`,'g']}},
  {l:'Rimanete amici',pers:{A:1},fx:()=>{const c=candidatoAmico();c.eta=S.eta+r(-1,1);c.nome=nomeLibero(c.sesso,S.anno-c.eta);const p=nuovaPersona('Amico',c.sesso,c.eta,c.cognome,{nome:c.nome,pers:c.pers,rapporto:r(60,75)});return [`Con ${p.nome} nasce un'amicizia nuova, con radici vecchie.`,'g']}}]});

/* ---------- La bottega del nonno ---------- */
ev({id:'cat_bottega',min:25,max:55,once:1,cond:()=>S.relazioni.some(p=>p.ruolo==='Nonno'&&!p.vivo),t:'La bottega',x:'La vecchia bottega di falegname del nonno è chiusa da anni. Gli attrezzi sono ancora lì, coperti dalla polvere.',c:[
  {l:'La riapri, nel tempo libero',sub:()=>eur(P(6000)),costo:()=>P(6000),pers:{O:2,C:2},fut:[1,'cat_bottega2'],r:'Una mano di vernice, l\'insegna rifatta, gli attrezzi oliati. Il quartiere passa a curiosare.'},
  {l:'Vendi gli attrezzi a un collezionista',pers:{O:-1},fx:()=>{const x=P(r(2000,5000));soldi(x);return [`Un collezionista paga ${eur(x)} per pialle e scalpelli. Tieni solo il metro pieghevole del nonno.`,'']}},
  {l:'Lasci tutto com\'è',pers:{N:1},r:'Ogni tanto ci passi davanti. Sa ancora di segatura.'}]});
ev({id:'cat_bottega2',link:1,t:'Il primo anno',x:'Il primo anno in bottega: pochi clienti, tante schegge, una passione che cresce.',c:[
  {l:'Corsi di falegnameria per principianti',pers:{E:2,A:1},fx:()=>{S.bis.soc=clamp(S.bis.soc+8);futuro(1,'cat_bottega3',{x:'corsi'})},r:'Il martedì sera sei persone imparano a fare una mensola. Tu impari a insegnare.'},
  {l:'Restauri mobili antichi su ordinazione',pers:{C:2},fx:()=>{S.abil.arte=clamp(S.abil.arte+3);futuro(1,'cat_bottega3',{x:'restauro'})},r:'Una credenza dell\'Ottocento torna a vivere. Il passaparola funziona.'},
  {l:'Chiudi: non c\'è tempo',pers:{C:-1},fx:()=>mod('felicita',-3),r:'Abbassi la saracinesca. Il nonno avrebbe capito.'}]});
ev({id:'cat_bottega3',link:1,auto:{p:()=>.45+pz('C')*.2,si:{fx:d=>{const x=P(r(3000,9000));soldi(x);mod('felicita',8);S.fama=clamp(S.fama+2);return [d.x==='corsi'?`I corsi hanno la lista d'attesa e un giornale locale ti dedica un articolo: «La bottega che insegna». Quest'anno ci guadagni anche ${eur(x)}.`:`Gli antiquari della zona ti mandano i lavori più difficili. Quest'anno la bottega rende ${eur(x)}.`,'g']}},no:{fx:()=>{soldi(-P(2000));mod('felicita',-4);return ['Le spese superano gli incassi. Chiudi la bottega, ma tieni un tavolo fatto da te in salotto.','b']}}},t:'La bottega, due anni dopo'});

/* ---------- Il figlio e la canna ---------- */
ev({id:'cat_canna',min:32,max:65,once:1,chi:['Figlio'],pc:p=>p.eta>=14&&p.eta<=17&&!p.fuori&&!p.conEx,t:'Nella giacca',x:'Mettendo a lavare la giacca di {P}, trovi una canna.',c:[
  {l:'Ne parli con calma, quella sera',pers:{A:2,N:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+2);futuro(.5,'cat_canna2',Object.assign({},d,{x:'parlato'}))},r:'Imbarazzo, mezze verità, poi una conversazione vera. Non sai se ti ha detto tutto.'},
  {l:'Punizione: un mese senza uscire',pers:{C:2,A:-2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-10);ricorda(d.p,'L\'hai punit'+gp(d.p,'o','a')+' per la canna');futuro(.5,'cat_canna2',Object.assign({},d,{x:'punito'}))},r:'Porte sbattute e silenzi. Un mese lunghissimo per tutti.'},
  {l:'Fai finta di niente',pers:{E:-1,C:-1},fx:d=>futuro(.5,'cat_canna2',Object.assign({},d,{x:'niente'})),r:'Rimetti la canna dove l\'hai trovata. Ci pensi tutta la notte.'}]});
ev({id:'cat_canna2',link:1,cond:d=>d.p&&d.p.eta<20,t:'Amici nuovi',x:'{P} frequenta amici nuovi, torna tardi e i voti sono crollati.',c:[
  {l:'Proponi uno psicologo per ragazzi',sub:()=>eur(P(600)),costo:()=>P(600),pers:{C:1,A:1},fx:d=>{d.p.umore=clamp((d.p.umore||50)+10);futuro(1,'cat_canna3',Object.assign({},d,{x:'aiuto'}))},r:'All\'inizio non vuole. Poi, dopo qualche seduta, torna a parlarti.'},
  {l:'{Lo} iscrivi a uno sport di squadra',pers:{C:1,E:1},fx:d=>futuro(1,'cat_canna3',Object.assign({},d,{x:'sport'})),r:'Rugby, tre sere a settimana. Torna a casa stanc{po} morto e senza tempo per altro.'.replace('morto','mort{po}')},
  {l:'{Gli} dai fiducia',pers:{A:2,C:-1},fx:d=>futuro(1,'cat_canna3',Object.assign({},d,{x:'fiducia'})),r:'«Lo so che sai cosa fai.» Speri di avere ragione.'}]});
ev({id:'cat_canna3',link:1,auto:{p:d=>.45+(d.p?d.p.rapporto:50)/250+(d.x==='aiuto'||d.x==='sport'?.15:0),si:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);d.p.voto=clamp((d.p.voto||50)+10);mod('felicita',6);return [`Un anno dopo ${d.p.nome} ha ritrovato la sua strada: amici diversi, voti in risalita e una sera ti ringrazia, a modo ${gp(d.p,'suo','suo')}.`,'g']}},no:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto-6);d.p.voto=clamp((d.p.voto||50)-10);pesa(8,4);return [`${d.p.nome} viene bocciat${gp(d.p,'o','a')}. Il periodo difficile non è finito, e ti tiene sveglio la notte.`.replace('sveglio',g('sveglio','sveglia')),'b']}}},t:'Un anno dopo'});

/* ---------- Il coro ---------- */
ev({id:'cat_coro',min:45,max:85,once:1,t:'Il coro',x:'Il coro del quartiere cerca nuove voci. «Non serve saper leggere la musica», dice il volantino.',c:[
  {l:'Vai alla prima prova',pers:{E:2,O:1},fut:[.5,'cat_coro2'],fx:()=>{S.abil.musica=clamp(S.abil.musica+3);S.bis.soc=clamp(S.bis.soc+8)},r:'Ti mettono tra i contralti. O i baritoni. Non è chiarissimo, ma canti.'},
  {l:'Canti solo sotto la doccia',pers:{E:-1},r:'Il tuo pubblico resta lo specchio del bagno.'}]});
ev({id:'cat_coro2',link:1,t:'Il concerto di Natale',x:'Il maestro ti ha affidato un breve assolo per il concerto di Natale in chiesa.',c:[
  {l:'Ti eserciti ogni giorno',p:()=>.55+S.abil.musica/200,si:{pers:{C:2,N:-1},fx:()=>{mod('felicita',7);futuro(1,'cat_coro3',{})},r:'La voce non trema. Alla fine applaudono in piedi, anche il parroco.'},no:{pers:{N:1},fx:()=>{mod('felicita',2);futuro(1,'cat_coro3',{})},r:'Una nota stonata, poi ti riprendi. Il coro ti copre con affetto.'}},
  {l:'Chiedi di cantare con gli altri',pers:{E:-1},fx:()=>futuro(1,'cat_coro3',{}),r:'Il maestro capisce. L\'assolo lo fa la signora Pina, che aspettava da anni.'}]});
ev({id:'cat_coro3',link:1,t:'La trasferta',x:'Il coro è invitato a un festival di cori a Salisburgo. Due giorni di pullman, prove e canzoni.',c:[
  {l:'Parti con tutti',sub:()=>eur(P(350)),costo:()=>P(350),pers:{E:2,O:2},fx:()=>{segnaVita('viaggio');mod('felicita',8);S.bis.soc=clamp(S.bis.soc+12);vivi(['Amico','Conoscente']).slice(0,2).forEach(a=>a.rapporto=clamp(a.rapporto+4))},r:'Si canta anche in pullman, a ogni curva. Tornate con una menzione speciale e mille foto.'},
  {l:'Resti a casa',pers:{E:-1},r:'Segui il concerto in diretta dal tablet. Un po\' ti dispiace.'}]});

/* ---------- Il rudere in collina ---------- */
ev({id:'cat_rudere',min:40,max:70,once:1,cond:()=>S.soldi>=P(60000),t:'Il rudere',x:'Durante una gita vedi un vecchio casale in vendita: tetto sfondato, ulivi intorno, vista sulla valle. Costa come un monolocale in città.',c:[
  {l:'Lo compri',sub:()=>eur(P(45000)),costo:()=>P(45000),pers:{O:3},fx:()=>{S.prop.push({id:S.nextId++,tipo:'Casale in collina',citta:S.citta,valore:Math.round(P(40000)),stato:20,rudere:1});futuro(1,'cat_rudere2',{})},r:'Firmi dal notaio con le mani che tremano. È tuo, con tutti i suoi spifferi.'},
  {l:'Ci pensi a lungo, troppo',pers:{C:1,O:-1},r:'Quando ti decidi, l\'ha già comprato una coppia di tedeschi.'},
  {l:'È una follia',pers:{C:2},r:'Torni in città. Ogni tanto lo cerchi sul sito dell\'agenzia.'}]});
ev({id:'cat_rudere2',link:1,cond:()=>S.prop.some(p=>p.rudere),t:'Il cantiere',x:'Tetto, impianti, permessi del Comune, il geometra che non risponde. Ristrutturare il casale è un secondo lavoro.',c:[
  {l:'Fai tutto subito, con un mutuo',sub:()=>eur(P(60000)),pers:{C:1,N:1},fx:()=>{const c=S.prop.find(p=>p.rudere);soldi(-P(60000));if(c){c.valore=Math.round(P(150000));c.stato=90}futuro(1,'cat_rudere3',{})},r:'Diciotto mesi di cantiere e notti insonni. Ma a primavera il tetto c\'è.'},
  {l:'Un pezzo alla volta, nei weekend',pers:{C:2,O:1},fx:()=>{const c=S.prop.find(p=>p.rudere);soldi(-P(25000));if(c){c.valore=Math.round(P(110000));c.stato=70}S.bis.energia=clamp(S.bis.energia-10);futuro(2.5,'cat_rudere3',{})},r:'Ogni sabato con la cazzuola in mano. Le mani piene di calli, la testa leggera.'},
  {l:'Rivendi così com\'è',pers:{O:-1},fx:()=>{const i=S.prop.findIndex(p=>p.rudere);if(i>=0)S.prop.splice(i,1);soldi(P(38000));mod('felicita',-3)},r:'Ci perdi qualcosa, ma ti liberi di un pensiero.'}]});
ev({id:'cat_rudere3',link:1,cond:()=>S.prop.some(p=>p.rudere),t:'Il casale è pronto',x:'Il casale è finito: pietra a vista, camino, gli ulivi potati. E adesso?',c:[
  {l:'Ci vai a vivere',pers:{O:2,E:-1},fx:()=>{const c=S.prop.find(p=>p.rudere);c.rudere=0;S.fatti.casale=1;mod('felicita',10);S.bis.stress=clamp(S.bis.stress-15)},r:'Il silenzio la sera, l\'olio tuo a novembre. Gli amici di città vengono a trovarti e non vogliono più ripartire.'},
  {l:'Weekend e vacanze',pers:{A:1},fx:()=>{const c=S.prop.find(p=>p.rudere);c.rudere=0;mod('felicita',7);relGruppo(famIn(),2,4)},r:'Diventa la casa di tutti: compleanni, vendemmie, Ferragosto con trenta persone.'},
  {l:'Lo affitti ai turisti',pers:{C:2},fx:()=>{const c=S.prop.find(p=>p.rudere);c.rudere=0;c.affittata=true;const x=P(r(6000,12000));soldi(x);return [`Recensioni a cinque stelle e una stagione piena: ${eur(x)} il primo anno.`,'g']}}]});

/* ---------- L'infortunio ---------- */
ev({id:'cat_crociato',min:16,max:45,once:1,cond:()=>rOre('sport')>=3,t:'Il ginocchio',x:'Un cambio di direzione durante la partita, un crack al ginocchio e un dolore che toglie il fiato. Rottura del legamento crociato.',c:[
  {l:'Ti operi con il Servizio sanitario',pers:{N:1},fx:()=>{mod('salute',-6);S.bis.forma=clamp(S.bis.forma-15);futuro(.6,'cat_crociato2',{})},r:'Quattro mesi di attesa con le stampelle. Poi l\'intervento va bene.'},
  {l:'In una clinica privata, subito',sub:()=>eur(P(6000)),costo:()=>P(6000),pers:{C:1},fx:()=>{mod('salute',-4);S.bis.forma=clamp(S.bis.forma-10);futuro(.3,'cat_crociato2',{})},r:'Operat{o} dopo dieci giorni. Il chirurgo è ottimista.'}]});
ev({id:'cat_crociato2',link:1,t:'La riabilitazione',x:'Sei mesi di fisioterapia: esercizi noiosi, dolore e progressi lentissimi.',c:[
  {l:'Non salti una seduta',pers:{C:3,N:-1},x:'bravo',fut:[.5,'cat_crociato3'],fx:()=>{mod('salute',4);S.bis.forma=clamp(S.bis.forma+6)},r:'Il fisioterapista dice che sei il paziente più testardo che abbia mai avuto. È un complimento.'.replace('il paziente più testardo','la persona più testarda')},
  {l:'Fai il minimo indispensabile',pers:{C:-2},x:'pigro',fut:[.5,'cat_crociato3'],r:'Il ginocchio guarisce, ma senza fretta. E senza muscoli.'},
  {l:'Ti abbatti',pers:{N:2},x:'triste',fut:[.5,'cat_crociato3'],fx:()=>pesa(5,3),r:'Vedere gli altri giocare ti fa male più del ginocchio.'}]});
ev({id:'cat_crociato3',link:1,t:'Il ritorno in campo',x:'Il medico ti dà l\'idoneità: puoi tornare a giocare.',c:[
  {l:'Torni in campo',p:d=>d.x==='bravo'?.85:d.x==='pigro'?.5:.6,si:{e:{f:8},pers:{N:-2},fx:()=>S.bis.forma=clamp(S.bis.forma+8),r:'Il primo contrasto ti fa tremare le gambe, il primo gol te le fa dimenticare.'},no:{e:{f:-4,s:-3},pers:{N:2},r:'Il ginocchio cede di nuovo. Il medico ti consiglia sport meno traumatici.'}},
  {l:'Passi al nuoto, per sicurezza',pers:{C:1,O:1},fx:()=>{S.bis.forma=clamp(S.bis.forma+5)},r:'Vasche lente al mattino presto. Una pace che non conoscevi.'}]});

/* ---------- Lo studente straniero ---------- */
ev({id:'cat_ospite',min:14,max:17,once:1,cond:()=>S.casa.tipo==='genitori'&&S.classe!=='umile',t:'Uno studente in casa',x:'La tua famiglia potrebbe ospitare per un anno uno studente di scambio. Si chiama Kenji e viene da Osaka.',c:[
  {l:'Convinci i tuoi a dire di sì',pers:{O:2,E:1},fut:[.4,'cat_ospite2'],r:'Kenji arriva con una valigia enorme e un italiano imparato dalle canzoni di Sanremo.'},
  {l:'Preferisci di no',pers:{O:-1},r:'Kenji va a stare da un tuo compagno. Ogni tanto lo vedi in corridoio.'}]});
ev({id:'cat_ospite2',link:1,t:'Kenji',x:'Kenji vive con voi da qualche mese. Gli manca casa, non capisce il dialetto di tuo nonno e ha scoperto la carbonara.',c:[
  {l:'Lo porti ovunque con i tuoi amici',pers:{E:2,A:2},fx:()=>{S.abil.lingue=clamp(S.abil.lingue+5);futuro(3,'cat_ospite3',{})},r:'Diventa la mascotte della compagnia. A fine anno piangete tutti all\'aeroporto.'},
  {l:'Ti insegna il giapponese, tu il dialetto',pers:{O:2},fx:()=>{S.abil.lingue=clamp(S.abil.lingue+8);futuro(3,'cat_ospite3',{})},r:'Lui dice «mannaggia» con un accento perfetto. Tu sai contare fino a mille in giapponese.'},
  {l:'Ognuno fa la sua vita',pers:{E:-1},r:'Convivenza educata. Ti saluta con un inchino il giorno della partenza.'}]});
ev({id:'cat_ospite3',link:1,t:'Una lettera da Osaka',x:'Kenji ti scrive: «Vieni a trovarmi quest\'estate? La mia famiglia vuole conoscerti.»',c:[
  {l:'Parti per il Giappone',sub:()=>eur(P(1800)),costo:()=>P(1800),pers:{O:3,E:1},fx:()=>{segnaVita('viaggio');S.abil.lingue=clamp(S.abil.lingue+4);mod('felicita',12);const p=nuovaPersona('Amico','M',S.eta+r(-1,1),'Tanaka',{nome:'Kenji',rapporto:r(70,85),lontano:true,dove:'Osaka'});return [`Templi, ramen alle due di notte e la mamma di ${p.nome} che ti tratta come un figlio. Un viaggio che ti cambia.`.replace('come un figlio',g('come un figlio','come una figlia')),'g']}},
  {l:'Non puoi, ma restate in contatto',pers:{A:1},fx:()=>{nuovaPersona('Amico','M',S.eta+r(-1,1),'Tanaka',{nome:'Kenji',rapporto:r(55,70),lontano:true,dove:'Osaka'})},r:'Una videochiamata ogni tanto, gli auguri a ogni compleanno. Un amico dall\'altra parte del mondo.'}]});

/* ---------- La tesi ---------- */
ev({id:'cat_tesi',min:21,max:30,once:1,cond:()=>['universita','magistrale'].includes(S.scuola.stato)&&(S.scuola.anni||9)<=1,t:'Il relatore',x:'È ora di scegliere il relatore per la tesi.',c:[
  {l:'Il professore famoso',pers:{E:1,C:1},x:'famoso',fut:[.4,'cat_tesi2'],r:'Ti accetta con una stretta di mano distratta. «Mi scriva.»'},
  {l:'La giovane ricercatrice',pers:{A:1,O:1},x:'giovane',fut:[.4,'cat_tesi2'],r:'Ti risponde in dieci minuti e ti propone tre argomenti bellissimi.'},
  {l:'Un argomento tutto tuo',pers:{O:3},x:'mio',fut:[.4,'cat_tesi2'],r:'Convinci un professore a seguire un\'idea tua. Sarà più difficile, ma è tua.'}]});
ev({id:'cat_tesi2',link:1,cond:()=>iscritto(),t:'Silenzio',x:d=>d.x==='famoso'?(S.anno>=1999?'Il relatore non risponde alle email da due mesi. La sessione di laurea si avvicina.':'Il relatore non si fa trovare al ricevimento da due mesi. La sessione di laurea si avvicina.'):'La tesi è a metà e ti sembra tutto sbagliato. La bibliografia è un mostro.',c:[
  {l:'Ti presenti al ricevimento ogni settimana',pers:{C:2,E:1},fx:d=>{futuro(.3,'cat_tesi3',{x:'bene'})},r:'Alla quarta volta ti riconosce e ti dà le correzioni. In rosso, tantissime, ma ci sono.'},
  {l:'Scrivi giorno e notte',pers:{C:2,N:1},fx:d=>{S.bis.stress=clamp(S.bis.stress+10);futuro(.3,'cat_tesi3',{x:'bene'})},r:'Caffè, biblioteca, caffè. Centoventi pagine.'},
  {l:'Rimandi alla sessione dopo',pers:{C:-2},fx:d=>{futuro(.6,'cat_tesi3',{x:'tardi'})},r:'Sei mesi in più. Almeno dormi.'}]});
ev({id:'cat_tesi3',link:1,t:'La discussione',x:'Il giorno della discussione: completo buono, parenti in prima fila, una slide con un refuso che noti solo adesso.',c:[
  {l:'Parli con sicurezza',p:()=>.55+pz('E')*.15+S.intelligenza/400,si:{e:{f:8},pers:{N:-2,E:1},fx:()=>{S.fatti.lodeTesi=1;relGruppo(famIn(),2,5)},r:'La commissione fa una sola domanda, e la sai. Il presidente sorride: punti pieni.'},no:{e:{f:3},pers:{N:1},fx:()=>relGruppo(famIn(),2,4),r:'Ti blocchi sulla terza slide, poi riparti. Voto meno alto del previsto, ma è fatta.'}},
  {l:'Ringrazi tutti, con la voce rotta',pers:{A:2},e:{f:6},fx:()=>relGruppo(famIn(),3,6),r:'Tua nonna piange in prima fila. Anche il relatore, forse.'}]});

/* ---------- La vicina del piano di sotto ---------- */
ev({id:'cat_vicina',min:22,max:70,once:1,cond:()=>inCasaMia(),t:'La signora Ada',x:'La signora Ada, ottantacinque anni, abita al piano di sotto e vive da sola. Oggi la incontri sulle scale con due borse della spesa pesantissime.',c:[
  {l:'Le porti le borse, e da oggi la spesa la fai anche per lei',pers:{A:3},fut:[.5,'cat_vicina2'],fx:()=>S.karma=clamp(S.karma+3),r:'Ti offre un caffè e mezz\'ora di racconti. Torni a casa più tardi del previsto, e più contento.'.replace('contento','content{o}')},
  {l:'Le porti le borse fino alla porta',pers:{A:1},r:()=>S.sesso==='F'?'«Grazie, signorina.» Anche se non lo sei da un po\'.':'«Grazie, giovanotto.» Anche se non lo sei da un po\'.'},
  {l:'Fai finta di avere fretta',pers:{A:-2},r:'Sali le scale a due a due. Un pensiero ti segue fino in casa.'}]});
ev({id:'cat_vicina2',link:1,t:'Le storie di Ada',x:'Il giovedì pomeriggio ormai lo passi da Ada. Oggi tira fuori una scatola di fotografie.',c:[
  {l:'Ascolti la sua storia',pers:{O:2,A:1},fx:()=>{mod('felicita',4);futuro(1.5,'cat_vicina3',{})},r:'Era staffetta partigiana a diciassette anni, poi maestra elementare per quarant\'anni. Ti racconta tutto, con una precisione incredibile.'},
  {l:'Le insegni a fare le videochiamate con i nipoti',pers:{C:1,A:2},fx:()=>{mod('felicita',3);futuro(1.5,'cat_vicina3',{})},r:'Alla terza lezione chiama il nipote in Australia. Piange di gioia, poi chiede come si spegne.'}]});
ev({id:'cat_vicina3',link:1,t:'Una busta per te',x:'La signora Ada è morta nel sonno, a quasi novant\'anni. Il nipote ti consegna una busta con il tuo nome.',c:[
  {l:'La apri subito',pers:{A:1},fx:()=>{mod('felicita',-3);pesa(3,1);S.karma=clamp(S.karma+3);return ['«Grazie per i giovedì. Mi hai fatto compagnia quando nessuno lo faceva più.» Dentro, la sua vecchia spilla della Resistenza.','']}},
  {l:'Vai al funerale con il quartiere',pers:{E:1,A:1},fx:()=>{mod('felicita',-2);S.bis.soc=clamp(S.bis.soc+6);return ['C\'è mezzo quartiere, e tanti ex alunni con i capelli bianchi. Ada era amata da tutti.','']}}]});

/* ---------- La compagnia teatrale ---------- */
ev({id:'cat_teatro',min:20,max:70,once:1,t:'La compagnia amatoriale',x:'La compagnia teatrale del quartiere cerca attori per la commedia di primavera. Si prova due sere a settimana.',c:[
  {l:'Fai il provino',pers:{E:2,O:2},p:()=>.6+pz('E')*.2,si:{fut:[.4,'cat_teatro2'],r:'Ti danno una parte piccola: il cameriere del secondo atto. Tre battute, tutte tue.'},no:{e:{f:-2},pers:{N:1},r:'Ti tremano le gambe e dimentichi tutto. Però ti chiedono di fare l\'aiuto scenografo.'}},
  {l:'Ti offri per le scenografie',pers:{C:1,O:1},e:{arte:3},r:'Un salotto dell\'Ottocento costruito con cartone e colla vinilica. Bellissimo.'}]});
ev({id:'cat_teatro2',link:1,t:'Il protagonista si ritira',x:'A un mese dal debutto il protagonista si rompe una gamba. Il regista ti guarda: «Te la senti?»',c:[
  {l:'Accetti e studi giorno e notte',pers:{C:2,E:2},x:'prot',fut:[.1,'cat_teatro3'],fx:()=>S.bis.stress=clamp(S.bis.stress+8),r:'Ottanta pagine di copione. Le ripeti in doccia, in macchina, nel sonno.'},
  {l:'Resti al tuo posto',pers:{E:-1},x:'cam',fut:[.1,'cat_teatro3'],r:'Il ruolo va a un altro. Le tue tre battute le dici benissimo.'}]});
ev({id:'cat_teatro3',link:1,t:'La prima',x:'Sera della prima. Teatro parrocchiale pieno: duecento persone, tra cui chiunque tu conosca.',c:[
  {l:'Sali sul palco',p:d=>d.x==='prot'?.65+pz('E')*.15:.85,si:{fx:d=>{mod('felicita',d.x==='prot'?14:6);S.bis.soc=clamp(S.bis.soc+12);if(d.x==='prot')S.fama=clamp(S.fama+2);return [d.x==='prot'?'Tre chiamate alla fine, applausi in piedi. Il giornale del quartiere scrive: «Una rivelazione».':'Le tue tre battute fanno ridere tutta la sala. Il cameriere del secondo atto è il preferito del pubblico.','g']}},no:{fx:()=>{mod('felicita',-2);return ['Una battuta saltata, un silenzio lunghissimo. Poi qualcuno suggerisce dalla quinta, e si va avanti. Ridete tutti, dopo.','']}}}]});

/* ---------- La maratona ---------- */
ev({id:'cat_maratona',min:22,max:60,once:1,cond:()=>rOre('sport')>=2,t:'La mezza maratona',x:'Un collega ti sfida: tra sei mesi c\'è la mezza maratona della città. Ventuno chilometri.',c:[
  {l:'Accetti e segui una tabella',pers:{C:3},fut:[.5,'cat_maratona2'],fx:()=>aggiungiOre('sport',3),r:'Sveglia alle sei, tre uscite a settimana. Le prime settimane sono un trauma.'},
  {l:'Rifiuti: il divano è il tuo sport',pers:{C:-1},r:'Gli fai il tifo dal bar. Con convinzione.'}]});
ev({id:'cat_maratona2',link:1,t:'Ventuno chilometri',x:'Il giorno della mezza maratona. Pettorale appuntato, cuore a mille.',c:[
  {l:'Parti piano e gestisci',p:()=>.75+pz('C')*.15,si:{e:{f:9,s:2},pers:{C:1,N:-1},fx:()=>futuro(1,'cat_maratona3',{}),r:'Due ore e cinque minuti. Al traguardo ti metti a piangere senza motivo.'},no:{e:{f:-2},pers:{N:1},r:'Crampi al diciassettesimo chilometro. Finisci camminando. Finisci, però.'}},
  {l:'Parti fortissimo',p:.4,si:{e:{f:10},pers:{E:1},fx:()=>futuro(1,'cat_maratona3',{}),r:'Un tempo incredibile per un principiante. Il collega non ci crede.'},no:{e:{f:-3,s:-2},pers:{C:-1},r:'Esplodi al dodicesimo. Ti ritiri al ristoro, con un\'arancia in mano.'}}]});
ev({id:'cat_maratona3',link:1,t:'Quarantadue',x:'Dopo la mezza, l\'idea ti perseguita: la maratona intera. Quarantadue chilometri e centonovantacinque metri.',c:[
  {l:'Ti iscrivi alla maratona di Roma',sub:()=>eur(P(500)),costo:()=>P(500),p:()=>.6+pz('C')*.2,si:{e:{f:15,s:3},pers:{C:2,N:-2},fx:()=>S.fatti.maratoneta=1,r:()=>`Passi davanti al Colosseo al trentesimo chilometro e non senti più le gambe. Arrivi. Sei ${S.sesso==='F'?'una maratoneta':'un maratoneta'}.`},no:{e:{f:-3},pers:{N:1},r:'Il famoso «muro» del trentacinquesimo. Ti fermi. La rifarai, forse.'}},
  {l:'Ti bastano i ventuno chilometri',pers:{O:-1},r:'La medaglia della mezza resta appesa in camera. Ti basta.'}]});

/* ---------- Il furto d'identità ---------- */
ev({id:'cat_identita',min:22,max:80,once:1,cond:()=>S.anno>=2005,t:'Una multa da Bari',x:'Ti arriva a casa una multa per divieto di sosta a Bari. Non sei mai stat{o} a Bari.',c:[
  {l:'Fai ricorso e indaghi',pers:{C:2},fut:[.3,'cat_identita2'],r:'All\'ufficio multe scopri che a tuo nome è intestata un\'auto che non hai mai visto.'},
  {l:'Paghi per non avere problemi',pers:{A:1,C:-1},fx:()=>soldi(-P(42)),fut:[.4,'cat_identita2'],r:'Quarantadue euro e la faccenda è chiusa. Almeno così credi.'}]});
ev({id:'cat_identita2',link:1,t:'Qualcuno è te',x:'Arriva una lettera di una finanziaria: rata non pagata di un prestito da 8.000 € che non hai mai chiesto. Qualcuno ha usato i tuoi documenti.',c:[
  {l:'Denuncia alla polizia postale',pers:{C:2},fx:()=>{pesa(6,3);futuro(.8,'cat_identita3',{x:'denuncia'})},r:'Ore di attesa, moduli e copie di documenti. Ma ora c\'è un fascicolo.'},
  {l:'Ti affidi a un avvocato',sub:()=>eur(P(1500)),costo:()=>P(1500),pers:{C:1},fx:()=>futuro(.5,'cat_identita3',{x:'avvocato'}),r:'L\'avvocato si muove in fretta: contesta il prestito e blocca tutto.'}]});
ev({id:'cat_identita3',link:1,auto:{p:d=>d.x==='avvocato'?.9:.7,si:{fx:()=>{mod('felicita',6);return ['Le indagini trovano chi ha usato i tuoi documenti: il prestito e l\'auto vengono annullati. Ti resta l\'abitudine di non mandare mai più foto dei documenti a nessuno.','g']}},no:{fx:()=>{soldi(-P(2000));mod('felicita',-5);return ['Ci vuole più di un anno per chiudere tutto. Nel frattempo paghi spese e interessi che nessuno ti rimborserà.','b']}}},t:'Il fascicolo'});

/* ---------- I gattini del cortile ---------- */
ev({id:'cat_gattini',min:6,max:12,once:1,t:'I gattini',x:'La gatta del cortile ha avuto cinque gattini sotto la scala della cantina.',c:[
  {l:'Porti latte e una coperta',pers:{A:2},fut:[.2,'cat_gattini2'],r:'La gatta ti guarda con sospetto, poi si lascia avvicinare.'},
  {l:'Lo dici all\'amministratore',pers:{C:1},r:'Arrivano i volontari dell\'associazione felina. Li portano via tutti.'}]});
ev({id:'cat_gattini2',link:1,t:'Cinque gattini da sistemare',x:'I gattini crescono e il condominio è in rivolta. Bisogna trovare una casa a tutti.',c:[
  {l:'Fai i volantini e bussi a tutte le porte',pers:{E:2,C:1},fx:()=>{S.karma=clamp(S.karma+3);futuro(.2,'cat_gattini3',{})},r:'Quattro su cinque trovano casa in una settimana. Resta il più piccolo, nero con le zampe bianche.'},
  {l:'Chiedi aiuto alla maestra',pers:{A:1},fx:()=>futuro(.2,'cat_gattini3',{}),r:'La maestra ne adotta uno e convince due famiglie della classe. Ne resta uno.'}]});
ev({id:'cat_gattini3',link:1,t:'L\'ultimo',x:'Ne è rimasto solo uno, il più piccolo. Ti segue dappertutto.',c:[
  {l:'Implori i tuoi di tenerlo',p:()=>({umile:.5,media:.65,agiata:.75})[S.classe],si:{pers:{A:1},fx:()=>{const A=ANIMALI[1];S.animali.push(initAnimale({t:'Gatto',nome:'Calzino',eta:0,max:r(A.max[0],A.max[1])}));mod('felicita',10)},r:'Lo chiami Calzino, per le zampe bianche. Dorme sul tuo cuscino da quella sera.'},no:{pers:{N:1},fx:()=>mod('felicita',-4),r:'Lo adotta la vicina del secondo piano. Puoi andarlo a trovare quando vuoi.'}},
  {l:'Lo affidi all\'associazione felina',pers:{C:1},r:'Ti mandano una foto un mese dopo: vive in una casa con giardino.'}]});

/* ---------- Il viaggio dei sogni ---------- */
ev({id:'cat_sogno',min:28,max:70,once:1,cond:()=>(S.fatti.viaggi||0)<4,t:'Il salvadanaio',x:'Da sempre sogni un viaggio in Giappone. Un amico ti sfida: «Se non ora, quando?»',c:[
  {l:'Apri un conto apposta e metti da parte ogni mese',pers:{C:3,O:1},fut:[1.5,'cat_sogno2'],r:'Un salvadanaio digitale chiamato «Tokyo». Ogni mese un po\'.'},
  {l:'Un giorno, quando sarò in pensione',pers:{C:-1},r:'Il sogno torna nel cassetto, accanto agli altri.'}]});
ev({id:'cat_sogno2',link:1,t:'Il conto «Tokyo»',x:'Il conto «Tokyo» è quasi pieno. Proprio adesso si rompe la macchina.',c:[
  {l:'Usi i soldi del viaggio per la macchina',pers:{C:2,O:-1},fx:()=>{soldi(-P(1500));futuro(2,'cat_sogno3',{x:'rinviato'})},r:'La macchina riparte. Il Giappone aspetta.'},
  {l:'La macchina può aspettare: prenoti il volo',pers:{O:2,C:-1},fx:()=>futuro(.3,'cat_sogno3',{x:'subito'}),r:'Biglietto comprato. Fino alla partenza vai al lavoro in autobus, sorridendo.'}]});
ev({id:'cat_sogno3',link:1,t:'Giappone',x:d=>d.x==='rinviato'?'Due anni dopo, il conto «Tokyo» è di nuovo pieno. Questa volta niente scuse.':'Atterri a Tokyo. Dopo anni di sogni, sei davvero qui.',c:[
  {l:'Tre settimane, da Tokyo a Kyoto',sub:()=>eur(P(4000)),costo:()=>P(4000),pers:{O:2},fx:()=>{segnaVita('viaggio');mod('felicita',15);S.bis.stress=clamp(S.bis.stress-15);return ['Templi all\'alba, treni puntuali al secondo, una tazza di tè in una casa da tè di Kyoto. Valeva ogni soldo e ogni attesa.','g']}},
  {l:'Una settimana sola, per non esagerare',sub:()=>eur(P(2200)),costo:()=>P(2200),pers:{C:1},fx:()=>{segnaVita('viaggio');mod('felicita',9);return ['Una settimana corsa, ma piena. Torni con la voglia di ripartire.','g']}}]});

/* ---------- L'amico che sparisce ---------- */
ev({id:'cat_amico_buio',min:20,max:75,once:1,chi:['Amico'],pc:p=>p.rapporto>=55&&!p.lontano,t:'Il silenzio di {P}',x:'{P} non risponde ai messaggi da settimane. Al telefono ha la voce spenta.',c:[
  {l:'Vai a casa sua senza avvisare',pers:{A:3,E:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6);futuro(.4,'cat_amico_buio2',d)},r:'Ti apre in pigiama alle cinque del pomeriggio. Ti fa entrare. Parlate a lungo.'},
  {l:'{Gli} scrivi che ci sei, quando vuole',pers:{A:1},fx:d=>{futuro(.5,'cat_amico_buio2',d)},r:'Una spunta, due spunte. Nessuna risposta. Ma il messaggio è lì.'},
  {l:'Aspetti che si faccia viv{po}',pers:{E:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-8)},r:'Passano mesi. Quando vi rivedete, qualcosa si è raffreddato.'}]});
ev({id:'cat_amico_buio2',link:1,t:'Un periodo nero',x:'{P} ti confida che da mesi non riesce ad alzarsi dal letto. Il medico ha parlato di depressione.',c:[
  {l:'{Lo} accompagni dallo psicologo',pers:{A:2,C:1},fx:d=>{d.p.umore=clamp((d.p.umore||40)+15);futuro(1,'cat_amico_buio3',Object.assign({},d,{x:'cura'}))},r:'In sala d\'attesa ti stringe il braccio. La prima seduta è il passo più difficile.'},
  {l:'{Lo} porti fuori ogni settimana, anche solo a camminare',pers:{E:1,A:2},fx:d=>{d.p.umore=clamp((d.p.umore||40)+8);futuro(1,'cat_amico_buio3',Object.assign({},d,{x:'vicino'}))},r:'Camminate senza parlare molto. Il giovedì diventa sacro.'},
  {l:'Non sai come aiutar{lo}',pers:{N:1},fx:d=>{futuro(1,'cat_amico_buio3',Object.assign({},d,{x:'solo'}))},r:'Ti senti impotente. Gli scrivi ogni tanto.'.replace('Gli','{Gli}')}]});
ev({id:'cat_amico_buio3',link:1,auto:{p:d=>d.x==='cura'?.8:d.x==='vicino'?.7:.5,si:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto+12);ricorda(d.p,'Gli sei stat'+g('o','a')+' accanto nel periodo più buio');mod('felicita',6);return [`Un anno dopo ${d.p.nome} sta meglio. Una sera, a cena, alza il bicchiere: «A chi c'era quando non c'ero.» Guarda te.`,'g']}},no:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto-4);pesa(4,2);return [`${d.p.nome} ha ancora giorni molto difficili. La strada è lunga: la guarigione non è una linea retta.`,'']}}},t:'Un anno dopo'});
