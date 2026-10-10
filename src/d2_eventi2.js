/* ================= EVENTI NUOVI ================= */
Object.assign(REATI,{corruzione:{n:'Corruzione',g:3},furtocasa:{n:'Furto',g:3}});
const REG=()=>luogo().reg;
const ZONA=()=>luogo().zona;
const conDesc=(f,d)=>{f.desc=d;return f};
const elencoE=a=>a.length>1?a.slice(0,-1).join(', ')+' o '+a[a.length-1]:a[0];
const inReg=(...a)=>conDesc(()=>a.includes(REG()),'Vivi in '+elencoE(a));
const inZona=(...a)=>conDesc(()=>a.includes(ZONA()),'Vivi nel '+elencoE(a.map(z=>z==='Isole'?'le Isole':z)));
const inCitta=(...a)=>conDesc(()=>a.includes(S.citta),'Vivi a '+elencoE(a));
const inProv=(...a)=>conDesc(()=>a.includes(S.prov),'Vivi in provincia di '+elencoE(a.map(x=>PROV[x]?PROV[x].n:x)));
const conAz=()=>!!S.azienda;
const social=()=>S.social.attivo;

/* ---------- Momenti storici ---------- */
ev({id:'elezioni',link:1,t:'Elezioni politiche',x:()=>{const v=S.fatti.voto;return `Si vota per il nuovo Parlamento. ${!v?'È la prima volta che voti per le politiche.':v==='no'?`L'ultima volta sei rimast${g('o','a')} a casa.`:v==='bianca'?`L'ultima volta hai votato scheda bianca.`:`L'ultima volta hai votato ${conArt(v)}.`} Per chi voti?`},c:()=>[...shuffle(PARTITI).map(pt=>({l:pt,fx:()=>{S.fatti.voto=pt;const vince=pick(PARTITI);notizia(`Elezioni: vince ${conArt(vince)}.`);if(vince===pt){mod('felicita',3);return [`Vince ${conArt(pt)}! Festeggi davanti alla TV.`,'g']}mod('felicita',-1);return [`Vince ${conArt(vince)}. Il tuo partito resta all'opposizione.`,'']}})),{l:'Non vado a votare',fx:()=>{S.fatti.voto='no';S.karma=clamp(S.karma-1);notizia(`Elezioni: vince ${conArt(pick(PARTITI))}.`);return ['Resti a casa. «Tanto sono tutti uguali.»','']}},{l:'Scheda bianca',fx:()=>{S.fatti.voto='bianca';notizia(`Elezioni: vince ${conArt(pick(PARTITI))}.`);return ['Entri, non metti la croce da nessuna parte, esci.','']}}]});
ev({id:'lockdown',link:1,t:'Tutti a casa',x:'Per la pandemia si può uscire solo per lavoro, salute o spesa.',c:[
  {l:'Rispetta le regole',e:{f:-5,k:2},r:'Mesi tra le quattro mura. Balconi, applausi e lievito di birra introvabile.'},
  {l:'Approfitta per imparare qualcosa',e:{f:-2,i:3,lingue:4,tech:4},r:'Corsi online, lingue e un sacco di tutorial.'},
  {l:'Impara a fare il pane',e:{f:-1,cucina:8},r:'Il tuo lievito madre ha un nome e una personalità.'},
  {l:'Esci di nascosto',p:.7,si:{e:{f:2,k:-3},r:'Una passeggiata clandestina. Nessuno ti ferma.'},no:{e:{m:-400,k:-3},r:'Ti fermano: 400 € di multa.'}}]});
ev({id:'terremoto',link:1,t:'Il terremoto',x:'Una forte scossa di terremoto colpisce la tua zona nel cuore della notte.',c:[
  {l:'Aiuta i soccorritori',fx:()=>{danniCasa(.2);eff({k:8,f:-3,s:-2})},r:'Passi giorni a scavare tra le macerie con i volontari.'},
  {l:'Dormi in macchina per una settimana',fx:()=>{danniCasa(.2);eff({f:-6,s:-2})},r:'Notti scomode, ma al sicuro.'},
  {l:'Vai dai parenti lontano',fx:()=>{danniCasa(.2);eff({f:-3})},r:'Ti ospitano finché le scosse non si calmano.'}]});
ev({id:'alluvione',link:1,t:'Alluvione',x:'Piogge torrenziali: il fiume esce dagli argini e allaga il quartiere.',c:[
  {l:'Spala il fango con i vicini',fx:()=>{danniCasa(.1);eff({k:6,s:-2,f:-2})},r:'Una catena umana di secchi e pale. Nasce un\'amicizia con i vicini.'},
  {l:'Salva l\'auto portandola in collina',cond:()=>S.veicoli.length>0,p:.6,si:{r:'L\'auto è salva.',k:'g'},no:{fx:()=>{const v=S.veicoli.shift();return [`Arrivi tardi: ${v.n.toLowerCase()} è da rottamare.`,'b']}}},
  {l:'Chiudi tutto e aspetta',fx:()=>{danniCasa(.15);eff({f:-4})},r:'La cantina è un acquario.'}]});
function danniCasa(k){const m=casaMia();if(m){m.valore=Math.round(m.valore*(1-k));m.stato=clamp(m.stato-Math.round(k*150))}}
ev({id:'offerta_boom',min:20,max:60,cond:()=>S.mondo.boom>0&&lavora(),t:'Ti cercano',x:"Con il boom economico un'azienda concorrente ti offre il 20% in più.",c:[
  {l:'Accetta',fx:()=>{S.lavoro.stip=Math.round(S.lavoro.stip*1.2);S.lavoro.perf=60;S.lavoro.anniLiv=0;mod('felicita',5);return ['Cambi azienda: +20% di stipendio.','g']}},
  {l:'Usa l\'offerta per un aumento',p:.6,si:{fx:()=>{S.lavoro.stip=Math.round(S.lavoro.stip*1.1)},r:'Il tuo capo rilancia: +10%.',k:'g'},no:{e:{perf:-5},r:'Il capo non ci sta.'}},
  {l:'Resta dove sei',e:{perf:2},r:'Squadra che vince non si cambia.'}]});

/* ---------- Catene: la lite col vicino ---------- */
ev({id:'vicino_lite',min:25,max:85,cond:()=>['affitto','proprieta'].includes(S.casa.tipo),t:'Il passo carraio',x:'Il vicino parcheggia ogni giorno davanti al tuo passo carraio.',c:[
  {l:'Lascia un biglietto gentile',p:.6,si:{pers:{A:2},e:{f:3},r:'Si scusa e non lo fa più.'},no:{pers:{A:1},e:{f:-2},r:'Il biglietto finisce per terra. La macchina resta lì.'}},
  {l:'Chiama i vigili',pers:{C:1,A:-1},e:{f:2},fut:[1,'vicino_causa'],r:'Multa per il vicino. Ti guarda malissimo.',k:''},
  {l:'Righi la sua macchina',pers:{A:-4,C:-2},e:{k:-6,f:3},fx:()=>{const n=creaNemico('vicino',null,'M');n.nome=n.nome;log(`${n.nome}, il vicino, ora ce l'ha a morte con te.`,'b')},r:'Una bella riga lungo la portiera. Soddisfazione, per ora.'}]});
ev({id:'vicino_causa',link:1,t:'Carta bollata',x:'Il vicino ti fa causa: sostiene che il tuo condizionatore è sul suo muro.',c:[
  {l:'Prendi un avvocato',costo:()=>P(2000),fut:[2,'vicino_sentenza'],r:'Inizia una causa civile. Ci vorrà tempo.',k:''},
  {l:'Proponi un accordo',costo:()=>P(800),e:{f:3},r:'Sposti il condizionatore e fate pace con una bottiglia di vino.'},
  {l:'Ignora la lettera',fx:()=>{soldi(-P(4000));return ['Non ti presenti in tribunale. Perdi in contumacia: 4.000 € e spese.','b']}}]});
ev({id:'vicino_sentenza',link:1,auto:{p:.5,si:{e:{m:3000,f:8},r:'Il giudice ti dà ragione: il vicino ti risarcisce 3.000 €.',k:'g'},no:{e:{m:-4000,f:-6},r:'Il giudice dà ragione al vicino. Paghi 4.000 € tra danni e spese.',k:'b'}}});

/* ---------- Catene: la band ---------- */
ev({id:'band',min:14,max:28,once:1,t:'La band',x:'Gli amici vogliono fondare una band e cercano qualcuno.',c:[
  {l:'Entra come cantante',e:{musica:6,f:5},fl:'band',fut:[2,'band_concerto'],r:'Prove ogni sabato nel garage del batterista.',k:'g'},
  {l:'Entra come chitarrista',e:{musica:8,f:4},fl:'band',fut:[2,'band_concerto'],r:'Calli sulle dita e accordi in barré.',k:'g'},
  {l:'No grazie',pers:{O:-1},r:'Li andrai a sentire.'}]});
ev({id:'band_concerto',link:1,t:'Il primo concerto',x:'La band suona per la prima volta dal vivo in un pub pieno.',c:[
  {l:'Dai tutto',p:()=>.3+S.abil.musica/120,si:{e:{f:10,musica:5},fut:[2,'band_contratto'],r:'Il pub viene giù dagli applausi. Qualcuno filma e il video gira.'},no:{e:{f:-6,musica:2},r:'Si rompe una corda e il microfono fischia per tutta la sera.'}},
  {l:'Suona tranquillo',e:{f:4,musica:3},r:'Un concerto onesto. Gli amici applaudono.'}]});
ev({id:'band_contratto',link:1,t:'Il contratto',x:'Un\'etichetta discografica vuole mettere sotto contratto la band.',c:[
  {l:'Firma',fx:()=>{if(!S.lavoro||JOB[S.lavoro.id].pt){assumi(JOB.mus);S.lavoro.liv=1;S.lavoro.stip=stipLiv(JOB.mus,1);S.lavoro.nome=nomeJob(JOB.mus,1)}S.fama=clamp(S.fama+8);mod('felicita',12);futuro(r(12,20),'band_reunion',{});return ['Firmate! Il primo singolo passa in radio.','g']}},
  {l:'Rifiuta: la musica resta un hobby',e:{f:-2},r:'Gli altri ci restano malissimo. La band si scioglie poco dopo.'}]});
ev({id:'band_reunion',link:1,t:'La reunion',x:'Dopo tanti anni, la vecchia band riceve un\'offerta per un tour nostalgico.',c:[
  {l:'Si riparte!',e:{f:12,m:[8000,40000]},r:'Palazzetti pieni di gente che cantava le vostre canzoni da ragazzi.'},
  {l:'Meglio di no',e:{f:-1},r:'Il passato resta un bel ricordo.'}]});

/* ---------- Catene: amore estivo ---------- */
ev({id:'amore_estivo',min:17,max:35,once:1,cond:()=>single()&&S.carcere===0,t:'Amore d\'estate',x:'In vacanza conosci una persona che vive dall\'altra parte d\'Italia. Due settimane bellissime.',c:[
  {l:'Proviamo a stare insieme a distanza',fx:()=>{const c=candidato();const lontano=pick(comuni().filter(x=>x.p>40000&&PROV[x.s].z!==luogo().zona));const n=nuovaPersona('Partner',c.sesso,c.eta,c.cognome,{nome:c.nome,tr:c.tr,rapporto:r(65,85),daCitta:lontano.n,daProv:lontano.s});futuro(1,'amore_estivo2',{p:n});mod('felicita',10);return [`Tu e ${n.nome}, di ${lontano.n}, vi giurate amore eterno.`,'g']}},
  {l:'Era solo un\'avventura',e:{f:3},r:'Un bel ricordo da tenere in tasca.'}]});
ev({id:'amore_estivo2',link:1,cond:d=>d.p&&d.p.ruolo==='Partner',t:'Un anno di treni',x:d=>`Dopo un anno di viaggi, ${d.p.nome} ti chiede di decidere: o ti trasferisci a ${d.p.daCitta}, o viene ${gp(d.p,'lui','lei')} da te.`,c:[
  {l:d=>`Ti trasferisci a ${d.p.daCitta}`,fx:d=>{const t=vaiA(d.p.daCitta,d.p.daProv);convivi(d.p);d.p.rapporto=clamp(d.p.rapporto+15);return [t[0]+` Vai a vivere con ${d.p.nome}.`,'g']}},
  {l:'Chiedi che venga da te',p:.5,si:{fx:d=>{convivi(d.p);d.p.rapporto=clamp(d.p.rapporto+10)},r:'Fa le valigie e arriva. Ora vivete insieme.'},no:{fx:d=>chiudiRelazione(d.p,'{P} non se la sente di lasciare tutto. Vi lasciate.')}},
  {l:'Lasciarsi',fx:d=>chiudiRelazione(d.p,'Troppa distanza. Con {P} finisce qui.')}]});

/* ---------- Catene: la startup dell'amico ---------- */
ev({id:'startup_amico',min:22,max:50,chi:['Amico'],cond:()=>S.soldi>=P(5000),t:'L\'idea geniale',x:'{Tuo} {P} ha un\'idea per una startup e cerca un socio. Servono 5.000 €.',c:[
  {l:'Entra come socio',costo:()=>P(5000),x:5000,e:{rel:8},fut:[2,'startup_cresce'],r:'Firmate i documenti in un bar. Che emozione.',k:''},
  {l:'Rifiuta',e:{rel:-3},r:'Gli auguri buona fortuna.'}]});
ev({id:'startup_cresce',link:1,t:'La startup cresce',x:'La startup con {P} va bene: un fondo d\'investimento vuole entrare.',c:[
  {l:'Continua e punta in alto',fut:[2,'startup_finale'],e:{f:5},r:'Ufficio nuovo, dieci dipendenti e notti in bianco.',k:'g'},
  {l:'Vendi la tua quota adesso',fx:d=>{const x=P(20000);soldi(x);return [`Vendi la tua parte per ${eur(x)}. Quattro volte quello che avevi messo.`,'g']}}]});
ev({id:'startup_finale',link:1,auto:{p:.35,si:{fx:d=>{const x=P(r(150,600)*1000);soldi(x);d.p.rapporto=clamp(d.p.rapporto+15);mod('felicita',20);return [`Una multinazionale compra la startup con ${d.p.nome}. La tua quota vale ${eur(x)}!`,'g']}},no:{fx:d=>{creaNemico('startup',d.p);mod('felicita',-10);return [`${d.p.nome} ti estromette dalla società con un cavillo. Ora è ${gp(d.p,'il tuo peggior nemico','la tua peggior nemica')}.`,'b']}}}});

/* ---------- Catene: l'eredità misteriosa ---------- */
ev({id:'eredita_misteriosa',min:28,max:75,once:1,w:.4,t:'La lettera del notaio',x:'Un notaio ti scrive: una prozia di cui non sapevi nulla ti ha nominato erede.',c:[
  {l:'Vai dal notaio',fx:()=>{coda.unshift({e:EV.eredita2,d:{}});return null}},
  {l:'Sarà una truffa',pers:{C:1},r:'Butti la lettera. Non saprai mai cosa c\'era dietro.'}]});
ev({id:'eredita2',link:1,t:'La scatola',x:'Il notaio ti consegna 20.000 €, una chiave e la foto di una persona che ti somiglia moltissimo.',c:[
  {l:'Cerca la persona della foto',e:{m:20000},fut:[1,'eredita3'],r:'Inizi a fare domande in giro.',k:'g'},
  {l:'Prendi i soldi e basta',e:{m:20000,f:5},r:'Il passato è passato.'}]});
ev({id:'eredita3',link:1,t:'Un segreto di famiglia',x:'Dopo mesi di ricerche scopri la verità: hai un fratellastro.',c:[
  {l:'Incontralo',fx:()=>{const f=nuovaPersona('Fratello',pick(['M','F']),Math.max(1,S.eta+r(-12,12)),pick(COGNOMI),{rapporto:r(40,70),mezzo:true});mod('felicita',6);return [`Conosci ${f.nome}. Avete lo stesso sorriso.`,'g']}},
  {l:'Lascia stare',e:{f:-3},r:'Certe porte è meglio non aprirle.'}]});

/* ---------- Catene: truffa sentimentale ---------- */
ev({id:'truffa_amore',min:30,max:85,cond:()=>single(),w:.6,t:'Un messaggio',x:'Una persona affascinante conosciuta online ti scrive ogni giorno. Ora ti chiede 2.000 € per il biglietto aereo per venirti a trovare.',c:[
  {l:'Manda i soldi',costo:()=>P(2000),fut:[1,'truffa_amore2'],r:'Bonifico fatto. Non vedi l\'ora di incontrarl{o}.',k:''},
  {l:'Chiedi una videochiamata',e:{i:2},r:'Trova sempre una scusa. Capisci che è una truffa e blocchi il profilo.'},
  {l:'Blocca',pers:{C:1},r:'Troppo bello per essere vero.'}]});
ev({id:'truffa_amore2',link:1,t:'Un\'emergenza',x:'All\'aeroporto «ha avuto un problema»: servono altri 5.000 € subito.',c:[
  {l:'Manda anche questi',costo:()=>P(5000),fx:()=>{mod('felicita',-15);return ['Il profilo sparisce. Era una truffa sentimentale: hai perso 7.000 €.','b']}},
  {l:'Rifiuta',e:{f:-8},r:'Il profilo sparisce. Hai perso 2.000 €, ma hai capito in tempo.'}]});

/* ---------- Catene: l'usuraio ---------- */
ev({id:'usuraio',min:20,max:75,cond:()=>S.soldi<-P(2000),t:'Soldi facili',x:'Un conoscente ti presenta un tizio che presta soldi «senza troppe domande».',c:[
  {l:'Prendi 10.000 €',e:{m:10000,k:-2},fut:[1,'usura2'],r:'Contanti in una busta. Nessun contratto.',k:''},
  {l:'Rifiuta',e:{k:1},r:'Non ti fidi. Hai ragione.'}]});
ev({id:'usura2',link:1,t:'Il conto',x:'Il tizio rivuole 15.000 €. Entro una settimana.',c:[
  {l:'Paga',costo:()=>P(15000),r:'Paghi e chiudi la faccenda. Lezione costosa.',k:'b'},
  {l:'Denuncialo',p:.6,si:{e:{k:5,f:6},fx:()=>{creaNemico('usura')},r:'Lo arrestano per usura. Ma i suoi amici non dimenticano.'},no:{e:{s:-15,f:-10},r:'La denuncia non va avanti e ti fanno visita in due.'}},
  {l:'Prendi tempo',fut:[1,'usura3'],r:'«Una settimana, non di più.»',k:'b'}]});
ev({id:'usura3',link:1,auto:{p:.5,si:{e:{s:-20,f:-12,m:-15000},r:'Ti aspettano sotto casa. Finisci in ospedale e paghi comunque.',k:'b'},no:{e:{m:-18000,f:-8},r:'Paghi 18.000 € tra interessi e «disturbo». Finalmente è finita.',k:'b'}}});

/* ---------- Eventi rari e folli ---------- */
ev({id:'superenalotto',min:18,max:95,w:.12,t:'La schedina',x:'Giochi al Superenalotto con le date di nascita della tua famiglia.',c:[
  {l:'Gioca',costo:()=>P(2),p:.004,si:{fx:()=>{const x=r(2,60)*1000000;soldi(x);mod('felicita',30);S.fama=clamp(S.fama+10);notizia(`Un fortunato vincitore di ${S.citta} porta a casa il jackpot del Superenalotto.`);return [`HAI FATTO 6! Vinci ${eur(x)}! Il telefono non smette di squillare.`,'g']}},no:{e:{gio:1},r:'Nemmeno un numero. Sarà per la prossima.'}},
  {l:'Non ci credo',pers:{C:1},r:'Risparmi 2 €.'}]});
ev({id:'alieni',min:14,max:95,once:1,w:.06,t:'La luce',x:'Una notte, tornando a casa, vedi una luce fortissima sopra i campi. Ti risvegli all\'alba in un campo di girasoli.',c:[
  {l:'Racconta tutto ai giornali',e:{f:4},fx:()=>{S.fama=clamp(S.fama+6)},r:'Nessuno ti crede, ma ti invitano in un programma TV del sabato sera.'},
  {l:'Tieni il segreto',e:{i:2},r:'Da quella notte, ogni tanto, guardi il cielo.'}]});
ev({id:'vip',min:15,max:80,w:.25,t:'Al bancone',x:'Al bar ti ritrovi accanto a un cantante famosissimo che beve un caffè.',c:[
  {l:'Chiedi un selfie',fx:()=>{if(S.social.attivo){S.social.follower+=r(50,800)}mod('felicita',5)},r:'Ti sorride per la foto. La pubblichi subito.'},
  {l:'Chiedi un consiglio sulla musica',e:{musica:4,f:3},r:'«Suona ogni giorno, anche quando non ne hai voglia.»'},
  {l:'Fai finta di niente',e:{k:1},r:'Gli lasci il suo caffè in pace.'}]});
ev({id:'sosia',min:18,max:65,once:1,w:.15,t:'Lo scambio',x:'Per strada tutti ti fermano: ti scambiano per un attore famoso.',c:[
  {l:'Stai al gioco',e:{f:6},r:'Firmi autografi e ti offrono la cena in un ristorante stellato.'},
  {l:'Chiarisci l\'equivoco',e:{k:1},r:'Delusione generale. Però ti chiedono lo stesso un selfie.'}]});
ev({id:'tesoro',min:20,max:85,once:1,w:.1,cond:()=>!!casaMia()||S.casa.tipo==='genitori',t:'In cantina',x:'Mentre svuoti la cantina trovi una cassetta piena di monete d\'oro antiche.',c:[
  {l:'Consegnale alle autorità',e:{k:8,m:8000,f:6},r:'La legge ti riconosce un premio di 8.000 €. Le monete vanno in un museo.'},
  {l:'Tienile e vendile',p:.7,si:{e:{m:30000,k:-6},r:'Un collezionista te le paga 30.000 € senza fare domande.'},no:{e:{k:-6},pr:'ricettazione',r:'Il collezionista era un carabiniere in borghese.'}}]});
ev({id:'fulmine',min:6,max:95,w:.06,t:'Il temporale',x:'Un fulmine colpisce l\'albero accanto a te durante un temporale.',c:[
  {l:'Corri al riparo',p:.85,si:{e:{f:-2},r:'Sei illes{o}, ma hai i capelli dritti per un\'ora.'},no:{e:{s:-15},r:'La scarica ti sfiora. Qualche giorno in ospedale.'}}]});
ev({id:'gemello',min:20,max:70,once:1,w:.04,t:'Allo specchio',x:'Al supermercato incroci una persona identica a te. Stessa faccia, stesso modo di camminare.',c:[
  {l:'Fai il test del DNA',fx:()=>{const f=nuovaPersona('Fratello',S.sesso,S.eta,pick(COGNOMI),{rapporto:r(50,75),gemello:true});mod('felicita',10);return [`Il test lo conferma: ${f.nome} è ${g('il tuo gemello','la tua gemella')}, separat${g('o','a')} alla nascita.`,'g']}},
  {l:'Sarà una coincidenza',e:{f:-1},r:'Ci pensi per settimane.'}]});
ev({id:'ministro',min:25,max:75,once:1,w:.08,t:'Il nastro',x:'A una cerimonia ti scambiano per il sottosegretario e ti mettono in mano le forbici per tagliare il nastro.',c:[
  {l:'Taglia il nastro',e:{f:7},fx:()=>{S.fama=clamp(S.fama+3)},r:'Discorso improvvisato, applausi e foto sul giornale locale.'},
  {l:'Scappa',e:{f:2},r:'Ti dilegui prima che arrivi quello vero.'}]});
ev({id:'piccione',min:5,max:95,w:.3,t:'In piazza',x:'Un piccione ti ruba il panino dalle mani.',c:[
  {l:'Inseguilo',e:{f:1,sport:1},r:'Lo insegui per tutta la piazza. I turisti filmano.'},
  {l:'Arrenditi',e:{f:-1},r:'Il piccione mangia meglio di te.'}]});
ev({id:'quadro',min:25,max:90,once:1,w:.12,t:'Il mercatino',x:'Al mercatino compri un vecchio quadro per 20 €. Un signore ti dice che potrebbe essere di un pittore famoso.',c:[
  {l:'Fallo periziare',costo:()=>P(500),p:.2,si:{e:{m:150000,f:15},r:'È autentico! Una casa d\'aste lo vende per 150.000 €.'},no:{e:{f:-2},r:'È una crosta. Ma ora è la crosta più famosa del quartiere.'}},
  {l:'Appendilo in salotto',e:{f:2},r:'Ci sta benissimo sopra il divano.'}]});
ev({id:'valigia',min:20,max:75,once:1,w:.12,t:'La valigia sbagliata',x:'All\'aeroporto prendi per sbaglio una valigia identica alla tua. Dentro ci sono 50.000 € in contanti.',c:[
  {l:'Consegnala alla polizia',e:{k:8,m:2000,f:4},r:'Ti ringraziano e ti danno una ricompensa. I soldi erano di un\'indagine in corso.'},
  {l:'Tienila',e:{m:50000,k:-15},fut:[1,'valigia2'],r:'Chiudi la valigia e torni a casa con il cuore a mille.',k:''}]});
ev({id:'valigia2',link:1,auto:{p:.5,si:{e:{s:-25,f:-15,m:-50000},fx:()=>{creaNemico('valigia')},r:'I proprietari della valigia ti trovano. Ti riprendono tutto, con gli interessi.',k:'b'},no:{e:{f:3},r:'Nessuno è venuto a cercare la valigia. Per ora.',k:''}}});
ev({id:'guinness',min:16,max:60,once:1,w:.1,t:'Il record',x:'Un amico ti iscrive a un tentativo di record: mangiare più arancini possibile in dieci minuti.',c:[
  {l:'Accetta la sfida',p:.2,si:{e:{f:10},fx:()=>{S.fama=clamp(S.fama+5)},r:'Ventitré arancini! Entri nel libro dei record.'},no:{e:{s:-4,f:-2},r:'Ti fermi a nove. Mal di pancia per due giorni.'}},
  {l:'Fai il tifo',e:{f:2},r:'Ti godi lo spettacolo.'}]});
ev({id:'invito_reale',min:20,max:80,once:1,w:.05,t:'Un invito importante',x:'Per un errore di indirizzo ricevi un invito a un matrimonio reale in Europa.',c:[
  {l:'Ci vai',costo:()=>P(2500),e:{f:12},fx:()=>{S.fama=clamp(S.fama+4)},r:'Nessuno ti chiede niente. Balli il valzer con una contessa.'},
  {l:'Restituisci l\'invito',e:{k:2},r:'Ti rispondono con una lettera di ringraziamento col sigillo.'}]});
ev({id:'gatto_ladro',min:8,max:90,w:.2,cond:()=>S.animali.some(a=>a.t==='Gatto'),t:'Il ladro di casa',x:()=>`${S.animali.find(a=>a.t==='Gatto').nome} porta a casa ogni giorno un oggetto dei vicini: calzini, guanti, perfino un portafoglio.`,c:[
  {l:'Restituisci tutto',e:{k:3,f:3},r:'I vicini ridono. Diventate amici.'},
  {l:'Apri un profilo social per il gatto',cond:()=>S.eta>=14,fx:()=>{S.social.attivo=true;S.social.follower+=r(500,20000);mod('felicita',6)},r:'Il gatto ladro diventa famoso su internet.'}]});

/* ---------- Eventi regionali ---------- */
ev({id:'nebbia',min:18,max:90,cond:()=>inReg('Lombardia','Piemonte','Emilia-Romagna','Veneto')()&&S.patente&&haAuto(),t:'La nebbia',x:'Nebbia fittissima in tangenziale: non vedi oltre il cofano.',c:[
  {l:'Vai piano con le quattro frecce',e:{f:-1},r:'Arrivi in ritardo, ma intero.'},
  {l:'Fermati in un\'area di servizio',e:{f:1},r:'Un caffè e aspetti che si alzi.'},
  {l:'Vai come sempre',p:.7,si:{r:'Arrivi. Non sai bene come.',k:''},no:{fx:()=>{if(S.veicoli[0])S.veicoli[0].stato=clamp(S.veicoli[0].stato-40);mod('salute',-10)},r:'Tamponamento a catena. Ammaccature per te e per l\'auto.',k:'b'}}]});
ev({id:'settimana_bianca',min:8,max:65,cond:inZona('Nord-ovest','Nord-est'),t:'Settimana bianca',x:'Gli amici organizzano una settimana sulla neve.',c:[
  {l:'Scia sulle piste nere',costo:()=>P(900),p:()=>.6+S.abil.sport/250,si:{e:{f:9,sport:4},r:'Neve fresca, sole e polenta al rifugio.'},no:{e:{s:-12,f:-4},fx:()=>{ammala('Frattura al braccio',2)},r:'Una caduta spettacolare. Torni con il gesso.'}},
  {l:'Solo sci di fondo e cioccolata calda',costo:()=>P(600),e:{f:6,s:2},r:'Pace, silenzio e boschi innevati.'},
  {l:'Resta a casa',e:{f:-1},r:'Guardi le foto degli altri.'}]});
ev({id:'bagna_cauda',min:16,max:90,cond:inReg('Piemonte'),t:'Bagna cauda',x:'Serata di bagna cauda con gli amici: aglio a volontà.',c:[
  {l:'Intingi tutto',e:{f:6},fx:()=>{const p=partnerAttuale();if(p&&!p.conv)p.rapporto=clamp(p.rapporto-3)},r:'Buonissima. Per due giorni nessuno ti si avvicina.'},
  {l:'Con moderazione',e:{f:3},r:'Assaggi e passi alle verdure.'}]});
/* chi ti propone la focaccia dipende dall'età (a 6 anni non hai colleghi, e il cappuccino è da grandi) */
const chiFocaccia=()=>S.eta<14?'Tua nonna':S.eta<19?'Un compagno di classe':S.lavoro?'Il collega':'Un amico';
ev({id:'focaccia',min:6,max:90,cond:inReg('Liguria'),t:'Colazione ligure',x:()=>`${chiFocaccia()} ti propone la colazione dei veri liguri: focaccia inzuppata ${S.eta<14?'nel latte':'nel cappuccino'}.`,c:[
  {l:'Provala',e:{f:4,cucina:1},r:'Strano, ma ti piace. Diventa un rito.'},
  {l:'Brioche, grazie',pers:{O:-1},r:()=>`${chiFocaccia()} ti guarda con compassione.`}]});
ev({id:'navigli',min:18,max:60,cond:inCitta('Milano'),t:'Aperitivo sui Navigli',x:'Gli amici ti trascinano all\'aperitivo sui Navigli. Lo spritz costa 12 €.',c:[
  {l:'Offri tu il giro',costo:()=>P(80),e:{f:5},fx:()=>relAmici(5),r:'Serata da cartolina sul naviglio.'},
  {l:'Proponi il bar sotto casa',e:{f:2},r:'Spritz a 4 €. Nessuno si lamenta.'}]});
ev({id:'derby',min:10,max:85,cond:inCitta('Torino','Milano','Roma','Genova'),t:'Il derby',x:()=>`Domenica c'è il derby cittadino. ${S.eta<16?'Hai un biglietto per andarci con la famiglia.':'Hai un biglietto per la curva.'}`,c:[
  {l:'Vai allo stadio',costo:()=>P(60),p:.5,si:{e:{f:9},r:'Vincete all\'ultimo minuto. Pianti e abbracci con sconosciuti.'},no:{e:{f:-5},r:()=>`Sconfitta. Lunedì ${S.lavoro?'al lavoro':iscritto()?'a scuola':'al bar'} sarà durissima.`}},
  {l:'Guardala al bar',cond:()=>S.eta>=16,e:{f:3},r:'Birra, urla e moviola infinita.'},
  {l:'Guardala in TV',cond:()=>S.eta<16,e:{f:3},r:'Urla dal divano e moviola infinita.'}]});
ev({id:'acqua_alta',min:6,max:95,cond:inCitta('Venezia'),t:'Acqua alta',x:'Suona la sirena: acqua alta in città.',c:[
  {l:'Stivali e via',e:{f:1},r:'Cammini sulle passerelle tra i turisti a piedi nudi.'},
  {l:'Aiuta il negozio sotto casa',e:{k:4,s:-1},r:'Sacchi e paratie. Il negoziante ti regala una bottiglia.'}]});
ev({id:'riviera',min:15,max:45,cond:inReg('Emilia-Romagna','Marche'),t:'Estate in Riviera',x:'Una settimana in Riviera: piadina, ombrelloni e discoteche.',c:[
  {l:'Vai con gli amici',costo:()=>P(600),e:{f:9,bev:1},fx:()=>relAmici(6),r:'Sole, piadina con lo squacquerone e alba sulla spiaggia.'},
  {l:'Lavora come bagnino',e:{m:2500,sport:4},r:"Una stagione al sole, 2.500 € e un'abbronzatura perfetta."}]});
ev({id:'sagra',min:6,max:95,cond:inZona('Nord-est','Nord-ovest','Centro'),t:'La sagra',x:'Nel paese vicino c\'è la sagra: polenta, salsicce e orchestra di liscio.',c:[
  {l:'Vai e mangia tutto',e:{f:5,s:-1},r:'Tre porzioni e un ballo con la signora del banco della lotteria.'},
  {l:'Fai il volontario in cucina',e:{k:4,cucina:4,f:3},r:'Friggi per sei ore. Ti senti parte del paese.'}]});
ev({id:'rifugio',min:12,max:75,cond:inReg('Trentino-Alto Adige',"Valle d'Aosta"),t:'Il rifugio',x:'Escursione a un rifugio a 2.500 metri.',c:[
  {l:'Sali a piedi',p:()=>S.salute/100,si:{e:{f:8,s:4,sport:3},r:'Canederli in cima e una vista che toglie il fiato.'},no:{e:{s:-6},r:'A metà salita ti manca il fiato. Torni indietro.'}},
  {l:'Prendi la funivia',costo:()=>P(40),e:{f:5},r:'Vista mozzafiato senza fatica.'}]});
ev({id:'palio',min:6,max:95,cond:inCitta('Siena'),t:'Il Palio',x:'Arriva il Palio. La tua contrada corre.',c:[
  {l:'Tifa in piazza',p:.12,si:{e:{f:15},r:'La tua contrada vince! Festeggi per una settimana.'},no:{e:{f:-3},r:'Vince la contrada rivale. Lutto cittadino.'}},
  {l:'Guardalo in TV',e:{f:2},r:'Novanta secondi di adrenalina.'}]});
ev({id:'raccordo',min:18,max:85,cond:()=>inCitta('Roma')()&&haAuto(),t:'Il Raccordo',x:'Raccordo anulare bloccato: due ore per fare dieci chilometri.',c:[
  {l:'Accendi la radio e pazienta',e:{f:-2},r:'Ascolti tre programmi interi.'},
  {l:'Suona il clacson',e:{f:-4},r:'Non serve a niente, ma ti sfoghi.'},
  {l:'Prendi lo scooter da domani',e:{f:2},r:'Libertà a due ruote. E un po\' di paura.'}]});
ev({id:'carbonara',min:14,max:90,cond:inReg('Lazio'),t:'Sacrilegio',x:'Un amico mette la panna nella carbonara.',c:[
  {l:'Fai una scenata',e:{f:2},fx:()=>relAmici(-3),r:'Gli spieghi a voce alta che si fa con guanciale, uovo e pecorino.'},
  {l:'Insegnagli quella vera',e:{cucina:5,f:4},fx:()=>relAmici(4),r:'Lezione di cucina. Ora è un convertito.'},
  {l:'Mangia in silenzio',e:{f:-2},r:'Soffri, ma mangi.'}]});
ev({id:'vendemmia',min:14,max:80,cond:inReg('Toscana','Umbria','Piemonte','Veneto','Marche','Abruzzo','Puglia'),t:'La vendemmia',x:'Un amico ti invita a dare una mano con la vendemmia.',c:[
  {l:'Lavora tutto il giorno',e:{m:300,s:2,f:5},r:'Schiena a pezzi, ma il pranzo nei campi vale tutto.'},
  {l:'Assaggia più che raccogliere',e:{f:6,bev:1},r:'Il vino dell\'anno scorso è ottimo.'}]});
ev({id:'cioccolato',min:6,max:90,cond:inProv('PG'),t:'Festival del cioccolato',x:'In città c\'è il festival del cioccolato.',c:[
  {l:'Assaggia tutto',e:{f:6,s:-1},r:'Torni a casa con una sacca di cioccolatini e il mal di pancia.'},
  {l:'Un assaggio e via',e:{f:3},r:'Giusto un cioccolatino fondente.'}]});
ev({id:'caffe_sospeso',min:14,max:95,cond:inReg('Campania'),t:'Il caffè sospeso',x:'Al bar il barista ti chiede se vuoi lasciare un caffè sospeso per chi non può permetterselo.',c:[
  {l:'Sì, anche due',e:{k:3,f:2},r:'Un piccolo gesto che ti mette di buon umore.'},
  {l:'Oggi no',e:{k:-1},r:'Bevi il tuo caffè e vai.'}]});
ev({id:'pizza_portafoglio',min:6,max:90,cond:inCitta('Napoli'),t:'Pizza a portafoglio',x:'Passeggiando per il centro senti il profumo della pizza a portafoglio.',c:[
  {l:'Prendine due',costo:()=>P(6),e:{f:5},r:'Piegata in quattro, bollente, perfetta.'},
  {l:'Tira dritto',e:{f:-1},r:'Il profumo ti segue fino a casa.'}]});
ev({id:'taranta',min:14,max:80,cond:inReg('Puglia'),t:'La Notte della Taranta',x:'Ad agosto c\'è il grande concerto di pizzica nel Salento.',c:[
  {l:'Balla fino all\'alba',e:{f:9,s:2,sport:2},fx:()=>{if(single()&&S.eta>=18&&chance(.3))coda.unshift({e:EV.incontro,d:{}})},r:'Tamburelli, sudore e cento persone che ballano con te.'},
  {l:'Resta al mare',e:{f:3},r:'Senti la musica da lontano.'}]});
ev({id:'peperoncino',min:14,max:80,cond:inReg('Calabria'),t:'Il festival del peperoncino',x:'Gara di chi mangia il peperoncino più piccante.',c:[
  {l:'Partecipa',p:.3,si:{e:{f:10},fx:()=>{S.fama=clamp(S.fama+2)},r:'Vinci! Non senti più la lingua, ma hai la coppa.'},no:{e:{s:-3,f:-2},r:'Ti ritiri al terzo peperoncino, in lacrime.'}},
  {l:'Guarda gli altri soffrire',e:{f:4},r:'Spettacolo impagabile.'}]});
ev({id:'arrosticini',min:10,max:90,cond:inReg('Abruzzo','Molise'),t:'Gli arrosticini',x:'Gli amici sfidano chi mangia più arrosticini.',c:[
  {l:'Accetta la sfida',p:.4,si:{e:{f:7},r:'Ottantadue spiedini. Sei una leggenda.'},no:{e:{f:2,s:-1},r:'Ti fermi a quaranta. Onorevole.'}},
  {l:'Tu fai la brace',e:{cucina:3,f:3},r:'Il re della canalina.'}]});
ev({id:'sassi',min:16,max:70,once:1,cond:inProv('MT'),t:'Hollywood tra i Sassi',x:'Una produzione americana gira un film tra i Sassi e cerca comparse.',c:[
  {l:'Fai il provino',p:()=>.4+S.aspetto/250,si:{e:{m:600,f:8,arte:4},fx:()=>{S.fatti.provino=true},r:'Ti prendono! Compari per tre secondi. Ora puoi fare provini da attore.'},no:{e:{f:-2},r:'Non hai il «look giusto».'}},
  {l:'Guarda le riprese',e:{f:3},r:'Vedi una star prendere un caffè al bar sotto casa.'}]});
ev({id:'emigrazione',min:19,max:35,cond:()=>inZona('Sud','Isole')()&&!S.lavoro&&S.carcere===0&&S.scuola.stato==='finita',t:'La valigia',x:'Tanti amici sono partiti per lavorare al Nord o all\'estero. Parti anche tu?',c:[
  {l:'Parto per Milano',fx:()=>{const t=vaiA('Milano','MI');mod('felicita',-3);return [t[0]+' Ti mancherà casa.','']}},
  {l:'Parto per Torino',fx:()=>{const t=vaiA('Torino','TO');mod('felicita',-3);return [t[0]+' Ti mancherà casa.','']}},
  {l:'Vado all\'estero, a Londra',cond:()=>S.abil.lingue>=30,fx:()=>{const t=vaiA('Londra',null);mod('felicita',-4);return [t[0],'']}},
  {l:'Resto qui',e:{f:2},r:'Questa terra merita qualcuno che resti.'}]});
ev({id:'processione',min:16,max:75,cond:inReg('Campania','Puglia','Calabria','Sicilia','Basilicata','Sardegna'),t:'La processione',x:'Ti chiedono di portare la statua del santo patrono durante la processione.',c:[
  {l:'Accetta l\'onore',e:{s:-2,k:4,f:5},r:'Ore sotto il peso della statua, tra fuochi d\'artificio e banda.'},
  {l:'Preferisci guardare',e:{f:2},r:'Ti godi la festa dal marciapiede.'}]});
ev({id:'arancina',min:8,max:95,cond:inReg('Sicilia'),t:'Questione delicata',x:'Un amico ti provoca: si dice arancina o arancino?',c:[
  {l:'Arancina',e:{f:2},r:'Mezza Sicilia ti applaude, l\'altra metà ti toglie il saluto.'},
  {l:'Arancino',e:{f:2},r:'Mezza Sicilia ti applaude, l\'altra metà ti toglie il saluto.'},
  {l:'Basta che sia fritta bene',e:{f:4,k:1},r:'La risposta più saggia mai pronunciata.'}]});
ev({id:'etna',min:6,max:95,cond:inProv('CT'),t:'La Montagna',x:'L\'Etna si risveglia e copre la città di cenere nera.',c:[
  {l:'Spazza il balcone',e:{f:-1},r:'Sabbia nera ovunque, anche nel caffè.'},
  {l:'Vai a vedere la colata',e:{f:6},r:'Un fiume di fuoco nella notte. Spettacolo unico.'}]});
ev({id:'sardegna_turisti',min:18,max:85,cond:inReg('Sardegna'),t:'Agosto',x:'Ad agosto la tua spiaggia preferita è piena di turisti.',c:[
  {l:'Affitta casa ai turisti',cond:()=>!!casaMia(),e:{m:4000},r:'Un mese di affitto: 4.000 €. Tu vai dai tuoi.'},
  {l:'Scopri una caletta segreta',e:{f:6,s:1},r:'Acqua trasparente e nessuno intorno.'},
  {l:'Resta in città',e:{f:-1},r:'Aria condizionata e mirto ghiacciato.'}]});

/* ---------- Azienda ---------- */
ev({id:'az_aumento',min:18,max:90,cond:()=>conAz()&&S.azienda.dip>0,t:'Un aumento',x:()=>`Un dipendente di ${S.azienda.n} ti chiede un aumento.`,c:[
  {l:'Concedilo',fx:()=>{S.azienda.cassa-=P(2000);S.azienda.rep=clamp(S.azienda.rep+3)},r:'Il dipendente è felice e lavora meglio.',k:'g'},
  {l:'Rifiuta',p:.6,si:{r:'Accetta il no, ma con il muso.',k:''},no:{fx:()=>{S.azienda.dip--;S.azienda.rep=clamp(S.azienda.rep-3)},r:'Si licenzia e va da un concorrente.',k:'b'}}]});
ev({id:'az_ispezione',min:18,max:90,cond:conAz,t:'Ispezione',x:()=>`Arrivano gli ispettori a controllare ${S.azienda.n}.`,c:[
  {l:'Mostra tutto',p:()=>({base:.45,buona:.75,top:.9})[S.azienda.qualita],si:{r:'Tutto in regola. Gli ispettori se ne vanno soddisfatti.',k:'g'},no:{fx:()=>{S.azienda.cassa-=P(5000);S.azienda.rep=clamp(S.azienda.rep-5)},r:'Trovano delle irregolarità: 5.000 € di multa.',k:'b'}},
  {l:'Offri «un caffè» all\'ispettore',p:.45,si:{e:{k:-6},r:'Chiude un occhio.'},no:{e:{k:-6},pr:'corruzione',r:'L\'ispettore registrava tutto.'}}]});
ev({id:'az_recensione',min:18,max:90,cond:conAz,t:'La recensione',x:()=>`Un famoso recensore parla di ${S.azienda.n}.`,c:[
  {l:'Leggi la recensione',p:()=>S.azienda.rep/110,si:{fx:()=>{S.azienda.rep=clamp(S.azienda.rep+15)},e:{f:6},r:'Cinque stelle! Il giorno dopo c\'è la fila.'},no:{fx:()=>{S.azienda.rep=clamp(S.azienda.rep-15)},e:{f:-6},r:'Una stroncatura feroce. Il calo si sente subito.'}}]});
ev({id:'az_concorrente',min:18,max:90,cond:conAz,t:'Il concorrente',x:'Apre un concorrente proprio di fronte a te.',c:[
  {l:'Abbassa i prezzi',fx:()=>{S.azienda.prezzo='basso'},r:'Guerra dei prezzi. I clienti restano, i margini scendono.',k:''},
  {l:'Punta sulla qualità',fx:()=>{S.azienda.qualita='top'},r:'Investi nella qualità per distinguerti.',k:''},
  {l:'Ignoralo',fx:()=>{S.azienda.rep=clamp(S.azienda.rep-6)},r:'Qualche cliente prova il nuovo arrivato.',k:'b'}]});
ev({id:'az_offerta',min:25,max:90,cond:()=>conAz()&&valoreAzienda(S.azienda)>20000,w:.6,t:'Un\'offerta',x:()=>`Un grande gruppo vuole comprare ${S.azienda.n} per ${eur(valoreAzienda(S.azienda)*1.5)}.`,c:[
  {l:'Vendi',fx:()=>{const v=Math.round(valoreAzienda(S.azienda)*1.5);soldi(v);const n=S.azienda.n;S.azienda=null;mod('felicita',10);return [`Vendi ${n} per ${eur(v)}.`,'g']}},
  {l:'Non è in vendita',e:{f:2},r:'È la tua creatura. Te la tieni.'}]});
ev({id:'az_furto',min:18,max:90,cond:()=>conAz()&&S.azienda.dip>0,t:'La cassa',x:'Scopri che un dipendente prende soldi dalla cassa.',c:[
  {l:'Licenzialo e denuncialo',fx:()=>{S.azienda.dip--},e:{k:1},r:'Giustizia è fatta. Ora devi trovare un sostituto.',k:''},
  {l:'Parlaci e dagli una seconda possibilità',p:.6,si:{e:{k:4},r:'Si scusa e restituisce tutto. Diventa il tuo dipendente più leale.'},no:{fx:()=>{S.azienda.cassa-=P(4000)},r:'Ci ricasca. Altri 4.000 € spariti.'}}]});
ev({id:'az_cliente',min:18,max:90,cond:()=>conAz()&&['agenzia','startup','edile','shop'].includes(S.azienda.id),t:'Il grande cliente',x:'Un cliente importante vuole un contratto in esclusiva.',c:[
  {l:'Firma',fx:()=>{S.azienda.cassa+=P(r(10,40)*1000);S.azienda.rep=clamp(S.azienda.rep+5)},e:{f:6},r:'Un contratto che cambia l\'anno.',k:'g'},
  {l:'Rifiuta: troppi vincoli',e:{f:1},r:'Preferisci restare liber{o}.'}]});
ev({id:'fallimento',link:1,t:'La cassa è vuota',x:()=>`${S.azienda?S.azienda.n:'L\'azienda'} ha ${eur(S.azienda?-S.azienda.cassa:0)} di debiti. Le banche chiudono i rubinetti.`,c:[
  {l:'Dichiara fallimento',fx:()=>{const n=S.azienda.n;S.azienda=null;S.fatti.crif=S.eta;mod('felicita',-15);return [`${n} fallisce. Per sette anni niente prestiti.`,'b']}},
  {l:'Copri i debiti con i tuoi soldi',fx:()=>{soldi(S.azienda.cassa);S.azienda.cassa=0;mod('felicita',-5);return ['Svuoti i tuoi risparmi per salvare l\'azienda.','b']}},
  {l:'Svendi tutto',fx:()=>{const v=Math.round(valoreAzienda(S.azienda)*.3);soldi(v+Math.min(0,S.azienda.cassa));S.azienda=null;mod('felicita',-8);return ['Svendi l\'azienda per coprire i debiti.','b']}}]});

/* ---------- Social ---------- */
ev({id:'soc_hater',min:13,max:90,cond:()=>social()&&S.social.follower>800,t:'L\'hater',x:'Un utente anonimo ti insulta sotto ogni post.',c:[
  {l:'Blocca',e:{f:1},r:'Sparito. Ne arriverà un altro.'},
  {l:'Rispondi con ironia',p:.6,si:{fx:()=>{S.social.follower=Math.round(S.social.follower*1.08)},e:{f:4},r:'La tua risposta diventa virale.'},no:{e:{f:-4},r:'Si scatena una rissa nei commenti.'}},
  {l:'Denuncia per diffamazione',cond:()=>S.eta>=18,costo:()=>P(1500),p:.5,si:{e:{f:6,m:3000},r:'La polizia postale lo trova. Ti risarcisce 3.000 €.'},no:{e:{f:-2},r:'Profilo all\'estero, impossibile trovarlo.'}}]});
ev({id:'soc_brand',min:14,max:90,cond:()=>social()&&S.social.follower>=5000,t:'Sponsorizzazione',x:'Un marchio di integratori ti propone di pubblicizzare i suoi prodotti.',c:[
  {l:'Accetta',fx:()=>{const x=P(Math.round(S.social.follower*.06));soldi(x);if(chance(.3)){S.social.follower=Math.round(S.social.follower*.85);return [`Incassi ${eur(x)}, ma i follower scoprono che il prodotto è una bufala. Ne perdi parecchi.`,'b']}return [`Incassi ${eur(x)}. Facile.`,'g']}},
  {l:'Rifiuta: non lo useresti mai',e:{k:3},r:'I follower apprezzano la tua coerenza.'}]});
ev({id:'soc_dm',min:18,max:70,cond:()=>social()&&single()&&S.social.follower>200,t:'Un messaggio privato',x:'«Ti seguo da tanto. Ci prendiamo un caffè?»',c:[
  {l:'Rispondi',fx:()=>{coda.unshift({e:EV.incontro,d:{}});return null}},
  {l:'Ignora',pers:{C:1},r:'Potrebbe essere chiunque.'}]});
ev({id:'soc_challenge',min:12,max:25,cond:social,t:'La challenge',x:'Una challenge pericolosa è virale: tutti si filmano mentre saltano da un muretto alto.',c:[
  {l:'Partecipa',p:.6,si:{fx:()=>{S.social.follower+=r(100,3000)},e:{f:3},r:'Video perfetto, pioggia di like.'},no:{e:{s:-12},fx:()=>{ammala('Distorsione alla caviglia',1)},r:'Atterri male. Pronto soccorso.'}},
  {l:'Non ne vale la pena',e:{k:1},r:'Scelta saggia.'}]});
ev({id:'soc_vecchio_post',min:20,max:80,cond:()=>social()&&S.fama>=10,t:'Il vecchio post',x:'Qualcuno ripesca una tua battuta infelice di dieci anni fa.',c:[
  {l:'Chiedi scusa',e:{f:-2,k:2},r:'Le scuse sincere chiudono la polemica.'},
  {l:'Ignora',p:.5,si:{r:'Dopo tre giorni non ne parla più nessuno.',k:''},no:{fx:()=>{S.social.follower=Math.round(S.social.follower*.85);S.fama=clamp(S.fama-3)},r:'La polemica cresce. Perdi follower e un contratto.',k:'b'}},
  {l:'Contrattacca',fx:()=>{if(chance(.4)){S.social.follower=Math.round(S.social.follower*1.1);return ['I tuoi fan ti difendono a spada tratta.','g']}S.social.follower=Math.round(S.social.follower*.8);return ['Peggio di prima. Shitstorm totale.','b']}}]});

/* ---------- Fama ---------- */
ev({id:'paparazzi',min:16,max:95,cond:()=>S.fama>=30,t:'I paparazzi',x:'Un paparazzo ti fotografa in spiaggia.',c:[
  {l:'Posa',e:{f:2},fx:()=>{S.fama=clamp(S.fama+2)},r:'Finisci in copertina su un settimanale.'},
  {l:'Scappa',e:{f:-3},r:'La foto in fuga è ancora più ridicola.'},
  {l:'Querela il giornale',costo:()=>P(3000),p:.5,si:{e:{m:15000,f:4},r:'Il giudice ti dà ragione: 15.000 € di risarcimento.'},no:{e:{f:-3},r:'Querela respinta: era un luogo pubblico.'}}]});
ev({id:'scandalo',min:18,max:95,cond:()=>S.fama>=35,t:'Lo scandalo',x:'Un giornale scandalistico pubblica una storia inventata su di te.',c:[
  {l:'Smentisci tutto',p:()=>S.fatti.addettoStampa?.85:.5,si:{e:{f:-1},r:'La smentita convince. Storia sgonfiata.'},no:{fx:()=>{S.fama=clamp(S.fama-5);S.social.follower=Math.round(S.social.follower*.85)},e:{f:-8},r:'Nessuno ti crede. Mesi difficili.'}},
  {l:'Querela per diffamazione',costo:()=>P(5000),p:.6,si:{e:{m:25000,f:6},r:'Vinci la causa: 25.000 € e una rettifica in prima pagina.'},no:{e:{f:-6},r:'La causa va per le lunghe e i giornali ci sguazzano.'}},
  {l:'Silenzio totale',e:{f:-5},r:'Aspetti che passi. Passa, lentamente.'}]});
ev({id:'fan_ossessivo',min:16,max:90,cond:()=>S.fama>=40,t:'Il fan',x:'Un fan ossessivo si apposta ogni giorno sotto casa tua.',c:[
  {l:'Chiama la polizia',e:{f:-2},r:'Gli vietano di avvicinarsi.'},
  {l:'Parlaci',p:.5,si:{e:{f:3,k:2},r:'Era solo una persona sola. Lo convinci a lasciarti in pace.'},no:{e:{f:-6},r:'Peggiora tutto. Ora ti segue anche al supermercato.'}},
  {l:'Trasloca',fx:()=>{const c=pick(comuni().filter(x=>x.p>50000&&x.n!==S.citta));return vaiA(c.n,c.s)}}]});
ev({id:'premio',min:18,max:95,cond:()=>S.fama>=45&&S.lavoro&&['att','mus'].includes(S.lavoro.id),t:'Il Premio Stella d\'Oro',x:'Sei tra i candidati al Premio Stella d\'Oro.',c:[
  {l:'Vai alla cerimonia',p:()=>.25+S.abil.arte/400+S.abil.musica/400,si:{e:{f:15},fx:()=>{S.fama=clamp(S.fama+10);if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+20)},r:'Vinci! Discorso in lacrime davanti a milioni di persone.'},no:{e:{f:-3},r:'Vince un altro. Applaudi con il sorriso di circostanza.'}}]});
ev({id:'festival',min:16,max:80,cond:()=>S.lavoro&&S.lavoro.id==='mus'&&S.lavoro.liv>=1,once:1,t:'Il Festival della Canzone',x:'Ti invitano a gareggiare al Festival della Canzone Italiana.',c:[
  {l:'Partecipa',p:()=>S.abil.musica/150,si:{e:{f:15,m:[20000,80000]},fx:()=>{S.fama=clamp(S.fama+15);S.lavoro.perf=clamp(S.lavoro.perf+25)},r:'Vinci il Festival! La tua canzone è ovunque.'},no:{e:{f:-6},fx:()=>{S.fama=clamp(S.fama+4)},r:'Ultimo posto, ma la canzone diventa un tormentone ironico.'}},
  {l:'Non sei pront{o}',pers:{N:1},r:'Forse l\'anno prossimo.'}]});
ev({id:'reality_vip',min:18,max:80,cond:()=>S.fama>=30,once:1,t:'L\'isola dei VIP',x:'Ti offrono 50.000 € per partecipare a un reality su un\'isola deserta.',c:[
  {l:'Accetta',fx:()=>{soldi(P(50000));S.fama=clamp(S.fama+6);mod('felicita',-4);mod('salute',-4);return ['Due mesi di riso e litigi. Torni più magr'+g('o','a')+', più ricc'+g('o','a')+' e più famos'+g('o','a')+'.','']}},
  {l:'Rifiuta',e:{k:2},r:'Hai una dignità da difendere.'}]});
ev({id:'selfie',min:14,max:95,cond:()=>S.fama>=20,t:'Il selfie',x:'Un gruppo di ragazzi ti chiede un selfie mentre stai mangiando.',c:[
  {l:'Certo!',e:{k:2,f:2},r:'Sorrisi, foto e un tavolo di ragazzi felici.'},
  {l:'Non ora, sto mangiando',fx:()=>{if(chance(.3)&&S.social.attivo){S.social.follower=Math.round(S.social.follower*.97);return ['Il video del tuo rifiuto gira online. «Montat'+g('o','a')+'!»','b']}},r:'Capiscono e si allontanano.',k:''}]});

/* ---------- Nemici ---------- */
ev({id:'nem_voci',min:10,max:95,chi:['Nemico'],t:'Le voci',x:'{P} sparge voci false su di te.',c:[
  {l:'Ignora',e:{f:-3},fx:d=>{d.p.rancore=clamp(d.p.rancore-5)},r:'Le voci si spengono da sole, piano piano.'},
  {l:'Affrontal{po}',p:.5,si:{fx:d=>{d.p.rancore=clamp(d.p.rancore-15)},e:{f:3},r:'Davanti a tutti ritratta.'},no:{fx:d=>{d.p.rancore=clamp(d.p.rancore+10)},e:{f:-4},r:'Finisce in una scenata pubblica.'}},
  {l:'Denuncia per diffamazione',cond:()=>S.eta>=18,costo:()=>P(1500),p:.45,si:{fx:d=>{S.relazioni=S.relazioni.filter(x=>x!==d.p)},e:{f:6},r:'Condannat{po}. Non ti darà più fastidio.'},no:{e:{f:-3},r:'Archiviata per mancanza di prove.'}}]});
ev({id:'nem_auto',min:18,max:95,chi:['Nemico'],cond:()=>haAuto(),t:'La riga',x:'Trovi la macchina rigata da una parte all\'altra. Sospetti di {P}.',c:[
  {l:'Ripara',costo:()=>P(400),r:'Carrozziere e tanta pazienza.',k:''},
  {l:'Vendicati',p:.6,si:{e:{f:4,k:-5},fx:d=>{d.p.rancore=clamp(d.p.rancore+15)},r:'Gomme a terra per {P}. Pari e patta.'},no:{e:{k:-5},pr:'graffiti',r:'Una telecamera ti riprende.'}},
  {l:'Denuncia contro ignoti',e:{f:-1},r:'Il verbale finisce in un cassetto.'}]});
ev({id:'nem_lavoro',min:18,max:67,chi:['Nemico'],cond:()=>lavora(),t:'Il nuovo collega',x:'{P} viene assunt{po} nella tua azienda e ti mette i bastoni tra le ruote.',c:[
  {l:'Lavora il doppio',pers:{C:2},e:{perf:8,f:-3},r:'Il capo vede chi lavora davvero.'},
  {l:'Parlane col capo',p:.5,si:{e:{perf:3},r:'Il capo lo sposta in un altro reparto.'},no:{e:{perf:-5},r:'Il capo pensa che tu sia geloso.'}},
  {l:'Sabotal{po}',p:.5,si:{pers:{A:-3},e:{k:-6,f:3},fx:d=>{d.p.rancore=clamp(d.p.rancore+20)},r:'Un suo errore finisce sulla scrivania del capo.'},no:{pers:{A:-3,N:1},e:{perf:-15,k:-6},r:'Ti scoprono. Richiamo ufficiale.'}}]});
ev({id:'nem_social',min:13,max:90,chi:['Nemico'],cond:social,t:'Attacco online',x:'{P} scrive cattiverie su di te sui social.',c:[
  {l:'Rispondi pubblicamente',p:.5,si:{fx:()=>{S.social.follower=Math.round(S.social.follower*1.05)},e:{f:3},r:'I tuoi follower ti difendono.'},no:{fx:()=>{S.social.follower=Math.round(S.social.follower*.92)},e:{f:-4},r:'Il litigio online ti fa perdere follower.'}},
  {l:'Blocca e vai avanti',e:{f:-1},r:'Fuori dalla tua vista, fuori dalla tua testa.'}]});
ev({id:'nem_incontro',min:8,max:95,chi:['Nemico'],t:'Al supermercato',x:'Incontri {P} tra gli scaffali del supermercato.',c:[
  {l:'Saluta con educazione',fx:d=>{d.p.rancore=clamp(d.p.rancore-10)},e:{k:2},r:'Ti risponde con un cenno. È un inizio.'},
  {l:'Fai finta di niente',pers:{N:1},r:'Cambi corsia.'},
  {l:'Lancia una frecciatina',fx:d=>{d.p.rancore=clamp(d.p.rancore+12)},e:{f:3},r:'Colpit{po} e affondat{po}.'}]});
ev({id:'nem_pace',min:10,max:95,chi:['Nemico'],pc:p=>(p.rancore||50)<45,t:'Bandiera bianca',x:'{P} ti scrive: vorrebbe chiudere la faccenda una volta per tutte.',c:[
  {l:'Accetta',fx:d=>{S.relazioni=S.relazioni.filter(x=>x!==d.p);mod('felicita',6);S.karma=clamp(S.karma+3);return [`Tu e ${d.p.nome} fate pace. Che sollievo.`,'g']}},
  {l:'Rifiuta',fx:d=>{d.p.rancore=clamp(d.p.rancore+20)},r:'Non dimentichi così in fretta.'}]});
ev({id:'bullo_scuola',min:9,max:16,cond:()=>iscritto()&&!vivi(['Nemico']).length,t:'Il bullo',x:'Un ragazzo della tua scuola ti prende di mira ogni giorno.',c:[
  {l:'Tieni testa',p:.5,si:{e:{f:5},r:'Ti rispetta. Ti lascia in pace.'},no:{e:{s:-5,f:-6},fx:()=>{creaNemico('scuola')},r:'Finisce male. E da oggi ce l\'ha ancora di più con te.'}},
  {l:'Dillo a un adulto',e:{k:2,f:-1},r:'La scuola interviene. Le cose migliorano.'},
  {l:'Evitalo',e:{f:-3},fx:()=>{creaNemico('scuola')},r:'Cambi strada ogni giorno. Lui se ne accorge.'}]});
ev({id:'rivale_lavoro',min:20,max:65,cond:()=>lavora()&&!vivi(['Nemico']).length,t:'Il rivale',x:'Un collega ambizioso vuole la tua stessa promozione e non si fa scrupoli.',c:[
  {l:'Gioca pulito',pers:{A:2,C:1},e:{k:3,perf:3},r:'Lavori meglio di lui. Che vinca il migliore.'},
  {l:'Fagli lo sgambetto',p:.5,si:{pers:{A:-4},e:{perf:8,k:-5},fx:()=>{creaNemico('lavoro')},r:'Il capo scopre un suo errore. Ora ti odia.'},no:{pers:{A:-3,N:1},e:{perf:-8,k:-5},fx:()=>{creaNemico('lavoro')},r:'Ti scopre lui. Guerra aperta.'}}]});

/* ---------- Famiglia allargata ---------- */
ev({id:'zio_pranzo',min:14,max:60,chi:['Zio'],t:'Il pranzo di Natale',x:()=>pick(['Al pranzo di Natale {tuo} {P} ti chiede davanti a tutti: «E il fidanzamento?»','Al pranzo di Natale {tuo} {P} ti chiede davanti a tutti: «E il lavoro? Quanto guadagni?»','Al pranzo di Natale {tuo} {P} commenta: «Ti vedo ingrassat{o}!»']),c:[
  {l:'Rispondi con ironia',e:{f:3,rel:4},r:'Ridono tutti, anche {P}.'},
  {l:'Sorridi e cambia discorso',e:{f:-1},r:'Passi al panettone.'},
  {l:'Rispondi male',e:{rel:-15,f:-2},r:'Il pranzo si gela. La nonna ti guarda male.'}]});
ev({id:'zio_america',min:20,max:80,once:1,w:.3,chi:['Zio'],pc:p=>p.eta>=60,t:'Lo zio d\'America',x:'{Tuo} {P}, emigrat{po} in America decenni fa, ti nomina nel testamento.',c:[
  {l:'Accetta l\'eredità',fx:d=>{const x=P(r(100,500)*1000);soldi(x);d.p.vivo=false;mod('felicita',8);return [`${d.p.nome} ti lascia ${eur(x)}. Lo zio d'America esiste davvero.`,'g']}}]});
ev({id:'cugino_affare',min:20,max:65,chi:['Cugino'],pc:p=>p.eta>=20,cond:()=>S.soldi>=P(3000),t:'L\'affare del cugino',x:'{Tuo} {P} ti propone di investire 3.000 € in un «affare sicuro».',c:[
  {l:'Investi',costo:()=>P(3000),p:.25,si:{e:{m:9000,rel:10,f:5},r:'Incredibile: l\'affare funziona. Triplichi i soldi.'},no:{e:{rel:-10,f:-5},r:'Spariti. Il cugino non risponde più al telefono.'}},
  {l:'Rifiuta',e:{rel:-3},r:'«Peggio per te», dice.'}]});
ev({id:'cugino_matrimonio',min:16,max:80,chi:['Cugino'],pc:p=>p.eta>=24&&!p.sposato,t:'Il matrimonio del cugino',x:'{Tuo} {P} si sposa. Pranzo di dodici portate.',c:[
  {l:'Vai e fai un bel regalo',costo:()=>P(200),e:{f:6,rel:10},fx:d=>{d.p.sposato=true;if(single()&&S.eta>=18&&chance(.3))coda.unshift({e:EV.incontro,d:{x:'matrimonio'}})},r:'Balli, confetti e zie commosse.'},
  {l:'Inventa una scusa',e:{rel:-10},fx:d=>{d.p.sposato=true},r:'La famiglia se lo ricorderà.'}]});
ev({id:'suocera',min:20,max:90,chi:['Suocero'],pc:p=>p.sesso==='F',t:'La suocera',x:'Tua suocera {P} critica come tieni la casa.',c:[
  {l:'Sorridi e annuisci',pers:{A:2},e:{f:-2,rel:4},r:'Pazienza infinita.'},
  {l:'Rispondi a tono',pers:{A:-3},e:{rel:-15},fx:()=>{const p=partnerAttuale();if(p)p.rapporto=clamp(p.rapporto-6)},r:'Litigata storica. Il tuo partner è in mezzo.'},
  {l:'Chiedi al partner di intervenire',fx:()=>{const p=partnerAttuale();if(p)p.rapporto=clamp(p.rapporto+r(-6,6))},r:'Il partner ci prova. Con risultati alterni.',k:''}]});
ev({id:'suoceri_casa',min:22,max:50,chi:['Suocero'],cond:()=>!casaMia(),t:'Un aiuto per la casa',x:'I tuoi suoceri vogliono aiutarvi con l\'anticipo per una casa.',c:[
  {l:'Accetta',e:{m:20000,rel:5},fx:()=>{const p=partnerAttuale();if(p)p.rapporto=clamp(p.rapporto+6)},r:'20.000 € per la casa. Ora però avranno qualcosa da dire sull\'arredamento.'},
  {l:'Rifiuta con gentilezza',e:{rel:-4,k:1},r:'Preferite farcela da soli.'}]});
ev({id:'cognato_prestito',min:20,max:80,chi:['Cognato'],pc:p=>p.eta>=18,cond:()=>S.soldi>=P(1000),t:'Il cognato',x:'{Tuo} {P} ti chiede 1.000 € in prestito.',c:[
  {l:'Presta',costo:()=>P(1000),x:1000,fut:[1,'restituzione'],e:{rel:6},r:'Bonifico fatto.',k:''},
  {l:'Rifiuta',e:{rel:-8},r:'Pranzi di famiglia un po\' più freddi.'}]});
ev({id:'nuovo_compagno',min:6,max:30,once:1,chi:['Madre','Padre'],cond:()=>!!S.fatti.separati&&!vivi(['Patrigno']).length,t:'Una nuova persona',x:'{Tuo} {P} ti presenta la persona con cui ha iniziato una relazione.',c:[
  {l:'Dagli una possibilità',fx:d=>{const p=nuovaPersona('Patrigno',sessoCompagnoNpc(d.p),d.p.eta+r(-5,5),null,{rapporto:r(45,70)});return [`Conosci ${p.nome}. Sembra una brava persona.`,'g']}},
  {l:'Non l\'accetti',fx:d=>{const p=nuovaPersona('Patrigno',sessoCompagnoNpc(d.p),d.p.eta+r(-5,5),null,{rapporto:r(10,25)});d.p.rapporto=clamp(d.p.rapporto-10);return [`Con ${p.nome} sarà guerra fredda.`,'b']}}]});
ev({id:'patrigno',min:6,max:40,chi:['Patrigno'],t:'In famiglia',x:'{P} prova a farti da genitore e ti dà un consiglio.',c:[
  {l:'Ascolta',e:{rel:8,i:1},r:'Non è così male, dopotutto.'},
  {l:d=>`«Non sei ${gp(d.p,'mio padre','mia madre')}!»`,e:{rel:-12},r:'Porta sbattuta.'}]});

/* ---------- Crimine e clan ---------- */
ev({id:'contatto_clan',min:18,max:45,cond:()=>S.crim.exp>=3&&!S.crim.clan&&S.carcere===0,t:'Un uomo elegante',x:'Un uomo in giacca e cravatta ti offre un «lavoretto per la famiglia». Ha sentito parlare di te.',c:[
  {l:'Accetta',fx:()=>{S.crim.exp=Math.max(S.crim.exp,4);const r0=avvicinaClan();if(!S.crim.clan){S.crim.clan={nome:'il clan del Porto',grado:0,lealta:50,anni:0,missioni:0};return ['Entri nel clan del Porto. Da qui non si torna indietro facilmente.','']}return r0}},
  {l:'Rifiuta',e:{k:3},r:'Ti guarda a lungo. Poi sorride e se ne va.'}]});
ev({id:'clan_sospetto',link:1,t:'Il sospetto',x:'Il capo sospetta che tu sia un infame.',c:[
  {l:'Dimostra lealtà con un lavoro rischioso',p:.5,si:{fx:()=>{if(S.crim.clan)S.crim.clan.lealta=clamp(S.crim.clan.lealta+30)},r:'Il capo ti abbraccia: «Sei dei nostri».',k:'g'},no:{fx:()=>{processo('associazione')},r:'Il lavoro va male. Arriva la polizia.',k:'b'}},
  {l:'Collabora con la giustizia',fx:()=>lasciaClan(true)},
  {l:'Scappa in un\'altra città',fx:()=>{S.crim.clan=null;creaNemico('clan');const c=pick(comuni().filter(x=>x.p>30000&&x.n!==S.citta));return vaiA(c.n,c.s)}}]});
ev({id:'clan_rivale',min:18,max:80,cond:()=>!!S.crim.clan&&S.carcere===0,t:'Il clan rivale',x:'Un clan rivale vuole prendersi il vostro territorio.',c:[
  {l:'Difendi il territorio',p:.5,si:{fx:()=>{S.crim.clan.lealta=clamp(S.crim.clan.lealta+15);S.crim.clan.missioni++},r:'Il rivale si ritira. Il capo ti nota.',k:'g'},no:{e:{s:-25,f:-6},r:'Finisci all\'ospedale.'}},
  {l:'Proponi una tregua',fx:()=>{S.crim.clan.lealta=clamp(S.crim.clan.lealta-5)},r:'Tregua fragile. Il capo ti considera debole.',k:''},
  {l:'Sparisci per un po\'',fx:()=>{S.crim.clan.lealta=clamp(S.crim.clan.lealta-12)},r:'Ti nascondi. Al ritorno ti guardano storto.',k:'b'}]});
ev({id:'clan_infiltrato',min:18,max:80,cond:()=>!!S.crim.clan&&S.carcere===0,t:'Il nuovo arrivato',x:'Un nuovo arrivato fa troppe domande.',c:[
  {l:'Ti fidi di lui',p:.5,si:{r:'Era solo un ragazzo curioso.',k:''},no:{fx:()=>{processo('associazione')},r:'Era un poliziotto sotto copertura.',k:'b'}},
  {l:'Lo smascheri',fx:()=>{S.crim.clan.lealta=clamp(S.crim.clan.lealta+15)},r:'Avevi ragione: era un infiltrato. Il clan ti è grato.',k:'g'}]});
ev({id:'indagine',link:1,auto:{fx:d=>{processo(d.x||'furto');return ['Un\'indagine risale a un vecchio colpo. Ti convocano in procura.','b']}}});
ev({id:'ricettatore',min:16,max:70,cond:()=>S.crim.exp>=2,t:'Merce a metà prezzo',x:'Un ricettatore ti offre uno smartphone nuovo a metà prezzo. Chiaramente rubato.',c:[
  {l:'Compra',costo:()=>P(400),p:.8,si:{e:{f:3,k:-3},r:'Telefono nuovo. Non fai domande.'},no:{e:{k:-3},pr:'ricettazione',r:'Il telefono era tracciato.'}},
  {l:'Rifiuta',e:{k:2},r:'Meglio pagarlo il doppio che avere problemi.'}]});
ev({id:'pentimento',min:20,max:90,cond:()=>S.crim.colpi>=3&&!S.crim.clan&&S.carcere===0,t:'Allo specchio',x:'Una sera ripensi a tutti i colpi che hai fatto.',c:[
  {l:'Decidi di cambiare vita',pers:{C:3,A:2},e:{k:10,f:4},fx:()=>{S.crim.exp=Math.max(0,S.crim.exp-5)},r:'Chiudi con quel mondo. Ti senti più leggero.'},
  {l:'È solo un momento',e:{f:-1},r:'Domani è un altro giorno.'}]});

/* ---------- Carcere ---------- */
ev({id:'rivolta',prig:1,t:'La rivolta',x:'Scoppia una rivolta nel tuo braccio.',c:[
  {l:'Partecipa',p:.5,si:{fx:()=>{if(S.galera)S.galera.rispetto+=15},r:'I detenuti ti rispettano di più.',k:'g'},no:{fx:()=>{S.carcere++;if(S.galera)S.galera.pena++},r:'Ti identificano tra i capi: un anno in più.',k:'b'}},
  {l:'Resta in cella',fx:()=>{if(S.galera)S.galera.condotta++},r:'Gli agenti apprezzano.',k:'g'}]});
ev({id:'perquisizione',prig:1,t:'Perquisizione',x:'Perquisizione a sorpresa nella tua cella.',c:[
  {l:'Collabora',e:{k:1},fx:()=>{if(S.galera)S.galera.condotta++},r:'Non trovano niente. Buon segno.'},
  {l:'Protesta',e:{f:-3},r:'Una settimana di isolamento.'}]});
ev({id:'lettera_casa',prig:1,t:'Una lettera',x:'Ricevi una lettera da casa.',c:[
  {l:'Rispondi subito',e:{f:6},fx:()=>relGenitori(6),r:'Scrivi quattro pagine. Ti senti meno solo.'},
  {l:'Non riesci a rispondere',e:{f:-3},r:'La lettera resta sotto il cuscino.'}]});
ev({id:'banda_favore',prig:1,cond:()=>S.galera&&S.galera.banda,t:'Un favore',x:()=>`${cap(S.galera.banda)} ti chiedono di nascondere un telefono in cella.`,c:[
  {l:'Accetta',p:.7,si:{fx:()=>{S.galera.rispetto+=10},r:'Nessuno se ne accorge. Ti devono un favore.',k:'g'},no:{fx:()=>{S.carcere++;S.galera.pena++},r:'Trovano il telefono: un anno in più.',k:'b'}},
  {l:'Rifiuta',e:{s:-10},fx:()=>{S.galera.rispetto-=10},r:'Te la fanno pagare in cortile.'}]});
ev({id:'vecchio_detenuto',prig:1,t:'Il vecchio',x:'Un anziano detenuto ti racconta la sua storia e ti dice: «Non fare come me».',c:[
  {l:'Ascolta',e:{k:5,i:2,f:2},r:'Quelle parole ti restano dentro.'},
  {l:'Ignora',pers:{E:-1},r:'Ognuno ha la sua strada.'}]});
ev({id:'calcio_carcere',prig:1,t:'Il torneo',x:'Torneo di calcio tra detenuti e agenti.',c:[
  {l:'Gioca',e:{f:5,sport:3},r:'Segni su punizione. Per un pomeriggio dimentichi dove sei.'},
  {l:'Fai il tifo',e:{f:2},r:'Urli dal muretto.'}]});
ev({id:'reinserimento',link:1,t:'Ricominciare',x:'Una cooperativa sociale offre lavoro a chi esce dal carcere.',c:[
  {l:'Accetta',fx:()=>{assumi(JOB[pick(['mag','ope','cam'])]);mod('felicita',6);S.karma=clamp(S.karma+4);return [`Ti assumono come ${S.lavoro.nome.toLowerCase()}. Un nuovo inizio.`,'g']}},
  {l:'Ce la faccio da sol{o}',e:{f:1},r:'Cercherai lavoro per conto tuo.'}]});

/* ---------- Fisco ---------- */
ev({id:'dichiarazione',min:22,max:95,cond:()=>conAz()||S.prop.some(p=>p.affittata)||(S.lavoro&&JOB[S.lavoro.id].var),t:'La dichiarazione dei redditi',x:'Il commercialista prepara la tua dichiarazione dei redditi.',c:[
  {l:'Dichiara tutto',costo:()=>P(300),e:{k:1},r:'Paghi la parcella e dormi tranquill{o}.',k:''},
  {l:'Dimentica qualche entrata',e:{m:4000,k:-4},fut:[2,'controllo_fiscale'],r:'Risparmi 4.000 € di tasse. Per ora.',k:''}]});
ev({id:'controllo_fiscale',link:1,cond:()=>chance(.45),t:'La Guardia di Finanza',x:'La Guardia di Finanza controlla i tuoi conti degli ultimi anni.',c:[
  {l:'Prendi un tributarista',costo:()=>P(3000),p:.5,si:{e:{f:4},r:'Trova un cavillo. Te la cavi.'},no:{e:{m:-15000,f:-6},r:'Sanzione di 15.000 €.'}},
  {l:'Paga subito la sanzione ridotta',e:{m:-10000,f:-3},r:'10.000 € e la questione è chiusa.'}]});
