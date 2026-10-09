/* ================= ETÀ ADULTA (18+): IL CARATTERE CONTINUA A CAMBIARE =================
   Da adulti il carattere si muove meno (plasticita()), ma le scelte importanti lo spostano ancora:
   valori pers 3–4 → circa 1,5 punti tra i 30 e i 50 anni. */
const vedovo=()=>S.relazioni.find(p=>!p.vivo&&p.ruolo==='Coniuge');
const inCasaTua=()=>!['genitori','carcere'].includes(S.casa.tipo);

/* ---------- Giovani adulti ---------- */
ev({id:'ad_coinquilino',min:19,max:30,rip:6,cond:()=>S.fatti.fuorisede||S.casa.tipo==='affitto',t:'Il coinquilino',x:'Il tuo coinquilino non lava mai i piatti. La pila nel lavandino ormai ha una personalità tutta sua.',c:[
  {l:'Glielo dici chiaro e tondo',p:.6,si:{e:{f:2},pers:{A:-3,N:-1},r:'Si offende per un giorno, poi compra perfino un detersivo nuovo.'},no:{e:{f:-3},pers:{A:-3,N:1},r:'Litigate. Per un mese vi parlate solo con i post-it sul frigo.'}},
  {l:'Proponi i turni delle pulizie',e:{f:1},pers:{C:3,A:1},r:'Tabella sul frigo, un colore per ognuno. Funziona per ben tre settimane.'},
  {l:'Li lavi tu, come sempre',e:{f:-2},pers:{A:2,N:2},r:'Pace in casa. Un po\' meno pace dentro di te.'},
  {l:'Smetti di lavarli anche tu',pers:{C:-3},r:'Dopo dieci giorni la cucina è zona rossa. Ordinate pizza e fingete che vada tutto bene.'}]});
ev({id:'ad_teatro',min:18,max:60,rip:15,t:'Improvvisazione',x:'Un\'amica ti trascina a una lezione di prova di teatro d\'improvvisazione. «Dai, sali anche tu!»',c:[
  {l:'Sali sul palco e ti butti',p:()=>.45+pz('E')*.25,si:{e:{f:6},pers:{E:4,O:2,N:-1},r:'Fai ridere tutta la sala. Il giorno dopo ti iscrivi al corso.'},no:{e:{f:-2},pers:{E:2,N:1},r:'Ti blocchi davanti a tutti. Però sei salit{o}, e la seconda volta va meglio.'}},
  {l:'Guardi dal fondo della sala',pers:{E:-2},r:'Ridi tantissimo. Ma dal fondo.'}]});
ev({id:'ad_terapia',min:18,max:65,rip:6,cond:()=>S.bis.stress>55||S.felicita<45,t:'Un consiglio',x:'Un\'amica ti guarda e dice: «Ti vedo strano da mesi. Hai mai pensato di parlarne con uno psicologo?»'.replace('strano','stran{o}'),c:[
  {l:'Prendi un appuntamento',sub:()=>'Dieci sedute, circa '+eur(P(600)),cond:()=>S.soldi>=P(600),fx:()=>{soldi(-P(600));S.bis.stress=clamp(S.bis.stress-12);mod('felicita',4)},pers:{N:-5,O:1},r:'Le prime sedute sono strane. Poi, un martedì, dici una cosa ad alta voce e capisci molte cose.'},
  {l:'Ce la faccio da sol{o}',pers:{N:2,E:-1},r:'Stringi i denti. Funziona, più o meno.'},
  {l:'Ne parli con gli amici',fx:()=>{const a=pick(vivi(['Amico']));if(a){a.rapporto=clamp(a.rapporto+5);ricorda(a,'Ti sei confidat'+g('o','a')+' in un periodo difficile')}S.bis.stress=clamp(S.bis.stress-5)},pers:{E:2,N:-1},r:'Una serata a parlare davvero. Non risolve tutto, ma ti senti meno sol{o}.'}]});
ev({id:'ad_segreto',min:18,max:70,rip:10,chi:['Amico'],pc:p=>p.rapporto>=40,t:'Il segreto',x:'{Tuo} {P} ha raccontato a mezzo mondo una cosa che ti aveva giurato di tenere per sé.',c:[
  {l:'Glielo rinfacci, poi perdoni',e:{rel:-3},pers:{A:3,N:-1},r:'Una discussione dura. Poi una birra. {P} ti chiede scusa, e stavolta sembra sincer{po}.'},
  {l:'Chiudi i rapporti',fx:d=>{d.p.rapporto=clamp(d.p.rapporto-40);ricorda(d.p,'Avete chiuso per un segreto tradito')},pers:{A:-3,N:1},r:'Esce dalla tua vita. Da oggi ti fiderai meno facilmente.'},
  {l:'Fai finta di niente',e:{rel:-8},pers:{A:1,N:2,E:-1},r:'Sorridi come sempre. Ma da oggi gli racconti molto meno.'.replace('gli','{gli}')}]});
ev({id:'ad_resto',min:18,max:90,rip:10,t:'Il resto sbagliato',x:'Al supermercato la cassiera ti dà cinquanta euro di resto in più. Te ne accorgi in macchina.',c:[
  {l:'Torni indietro a restituirli',e:{k:4,f:1},pers:{A:2,C:2},r:'La cassiera quasi si commuove: a fine turno li avrebbe dovuti mettere lei.'},
  {l:'Te li tieni',e:{m:()=>P(50),k:-4},k:'',pers:{A:-2,C:-1},r:'Un regalo dell\'universo, ti dici. L\'universo prende nota.'}]});
ev({id:'ad_strada',min:20,max:85,rip:6,cond:()=>haAuto(),t:'Al semaforo',x:'Un automobilista ti taglia la strada e poi suona pure. Al semaforo vi ritrovate fianco a fianco.',c:[
  {l:'Abbassi il finestrino e gliene dici quattro',p:.7,si:{e:{f:1},pers:{A:-3,N:2},r:'Ti senti benissimo per dieci secondi. Poi il cuore ti batte forte fino a casa.'},no:{e:{s:-2,f:-3},pers:{A:-3,N:3},r:'Scende dall\'auto. Volano parole grosse, quasi le mani. Arrivi a casa tremando.'}},
  {l:'Respiri e alzi il volume della radio',pers:{N:-3,A:1},r:'Scatta il verde. Lui sgomma, tu canti.'},
  {l:'Gli fai un sorriso enorme',pers:{A:2,O:1},r:'Lo spiazzi completamente. Vincere così ha tutto un altro sapore.'}]});
ev({id:'ad_tram',min:18,max:80,rip:10,t:'Sul tram',x:'Sul tram un uomo insulta pesantemente una ragazza straniera. Tutti fissano il telefono.',c:[
  {l:'Ti alzi e intervieni',p:.7,si:{e:{k:5,f:3},pers:{A:3,N:-2,E:1},r:'Lui borbotta e scende alla fermata dopo. La ragazza ti ringrazia con un filo di voce.'},no:{e:{k:5,s:-3},pers:{A:2,N:1},r:'Ti spinge, nessuno si muove. Scendi con un livido e la coscienza pulita.'}},
  {l:'Ti siedi accanto a lei',e:{k:3},pers:{A:2},r:'Non dici una parola, ma lui capisce e smette.'},
  {l:'Guardi anche tu il telefono',pers:{A:-2,N:1},r:'Scendi alla tua fermata. Ci ripensi tutto il giorno.'}]});
ev({id:'ad_detox',min:18,max:65,rip:10,t:'Lo schermo',x:'Il telefono ti informa che la settimana scorsa l\'hai usato in media cinque ore al giorno.',c:[
  {l:'Niente social per un mese',p:()=>.4+pz('C')*.4,si:{fx:()=>{S.bis.stress=clamp(S.bis.stress-8)},e:{f:5},pers:{C:3},r:'Il primo weekend è un\'astinenza. Il quarto leggi due libri.'},no:{pers:{C:1},r:'Resisti undici giorni. Poi un video di gatti ti riporta dentro.'}},
  {l:'Metti un limite di un\'ora al giorno',pers:{C:2},r:'L\'app ti blocca. Tu sblocchi. L\'app ti blocca. Tu sblocchi.'},
  {l:'Cinque ore? Pensavo peggio',pers:{C:-2},r:'Lo dici ridendo. Poi ci ripensi, ma solo per un attimo.'}]});

/* ---------- Lavoro ---------- */
ev({id:'ad_errore',min:18,max:66,rip:8,cond:()=>lavora(),t:'L\'errore',x:'Ti accorgi di aver sbagliato un conto importante. Nessuno se n\'è accorto, per ora.',c:[
  {l:'Lo dici subito al capo',p:.7,si:{e:{perf:2},pers:{C:3,N:-2},r:'«Grazie per avermelo detto.» Da quel giorno si fida di te.'},no:{e:{perf:-4},pers:{C:2},r:'Una sfuriata memorabile. Ma almeno la notte dormi.'}},
  {l:'Lo correggi di nascosto',p:.65,si:{pers:{C:-1,N:2},r:'Nessuno se ne accorge. Però per settimane apri la posta col cuore in gola.'},no:{e:{perf:-8},pers:{N:3},r:'Se ne accorgono. E capiscono che hai provato a nasconderlo.'}},
  {l:'Dai la colpa al programma',p:.55,si:{e:{k:-3},pers:{A:-3},r:'Il reparto informatico incassa. Tu un po\' meno, la sera.'},no:{e:{perf:-6,k:-3},pers:{A:-3,N:1},r:'Il tecnico dimostra che il programma funziona benissimo. Figuraccia.'}}]});
ev({id:'ad_mobbing',min:22,max:66,rip:10,cond:()=>lavora(),t:'Il collega preso di mira',x:'Da settimane il capo umilia un collega davanti a tutti. Nessuno dice niente.',c:[
  {l:'Lo difendi in riunione',p:.55,si:{e:{k:5,f:3,perf:-2},pers:{A:3,N:-2,E:1},r:'Cala il silenzio. Il giorno dopo tre colleghi ti ringraziano a bassa voce.'},no:{e:{k:5,perf:-6},pers:{A:3,N:1},r:'Ora il capo ce l\'ha anche con te. Ma il collega non lo dimenticherà.'}},
  {l:'Lo inviti a pranzo e lo ascolti',fx:()=>{if(vivi(['Amico']).length<12){const a=nuovaPersona('Amico','M',Math.max(22,S.eta+r(-8,8)),null,{rapporto:r(45,60)});ricorda(a,'L\'hai ascoltato quando il capo lo umiliava')}},e:{k:3},pers:{A:3},r:'In ufficio non cambia niente. Per lui, invece, cambia parecchio.'},
  {l:'Tieni la testa bassa',pers:{A:-1,N:2},r:'Meglio lui che te. Lo pensi, e non ti piace pensarlo.'},
  {l:'Ti allinei al capo',e:{perf:3,k:-5},pers:{A:-4},r:'Una battuta in più alle sue spalle. Il capo ti sorride.'}]});
ev({id:'ad_firma',min:25,max:66,once:1,cond:()=>lavora(),t:'La firma',x:'Ti chiedono di firmare un documento con dei numeri gonfiati. «Lo fanno tutti, è una formalità.»',c:[
  {l:'Rifiuti di firmare',p:.6,si:{e:{k:6},pers:{C:3,A:1},r:'Firma qualcun altro. Sei mesi dopo arriva la Finanza, e il tuo nome non c\'è.'},no:{e:{k:6,perf:-10},pers:{C:3,N:1},r:'Ti spostano in un ufficio senza finestre. Hai la coscienza pulita e un cactus.'}},
  {l:'Firmi e non ci pensi più',e:{perf:3,k:-4},fut:[2,'ad_firma_conto'],pers:{C:-2,A:-1},r:'Una firma veloce. Il capo ti dà una pacca sulla spalla.'},
  {l:'Lo segnali all\'ufficio legale',p:.5,si:{e:{perf:4,k:6},pers:{C:2,E:2,N:-1},r:'Indagine interna. Il capo viene trasferito e tu diventi «quell{o} di cui fidarsi».'},no:{e:{perf:-12,f:-6,k:6},pers:{C:2,N:2},r:'Insabbiano tutto. Ti fanno capire che hai sbagliato a parlare.'}}]});
ev({id:'ad_firma_conto',min:18,max:100,link:1,t:'L\'ispezione',x:'Arriva la Guardia di Finanza. Controllano proprio i documenti che avevi firmato.',auto:{fx:()=>{if(chance(.45)){const m=P(3000);soldi(-m);mod('felicita',-8);if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-15);applicaPers({N:3,C:2});return [`L'ispezione trova tutto. Ti tocca una sanzione di ${eur(m)} e una lunga serie di notti in bianco.`,'b']}return ['L\'ispezione si concentra su altro. Ti è andata bene, ma il cuore ti è arrivato in gola.','']}}});
ev({id:'ad_valutazione',min:22,max:66,rip:8,cond:()=>lavora(),t:'La valutazione',x:'Nella valutazione annuale il capo scrive di te: «Manca di iniziativa». E lo legge davanti a tutto il gruppo.',c:[
  {l:'Ringrazi e chiedi come migliorare',e:{perf:4},pers:{C:2,N:-2},r:'Il capo resta spiazzato. Tre mesi dopo ti affida un progetto tutto tuo.'},
  {l:'Ti difendi, punto per punto',p:.5,si:{e:{perf:2},pers:{A:-2,N:-1},r:'Hai ragione tu, e alla fine lo ammette pure.'},no:{e:{perf:-4},pers:{A:-2,N:1},r:'Sembri una persona che non accetta critiche. E un po\' è vero.'}},
  {l:'Ci rimugini per settimane',e:{f:-4},pers:{N:3},r:'Rileggi quella frase mille volte. Di notte, soprattutto.'}]});
ev({id:'ad_fallimento',min:22,max:55,once:1,cond:()=>lavora()||iscritto(),t:'Il no',x:'Il progetto su cui hai lavorato per due anni viene bocciato. Tutto da rifare, o da buttare.',c:[
  {l:'Ricominci il giorno dopo',e:{perf:3,f:-1},pers:{C:3,N:-2},r:'Lo smonti, lo rifai, lo ripresenti. La seconda volta passa.'},
  {l:'Ti prendi una pausa e ci ripensi',e:{f:1},pers:{N:-1,O:2},r:'Un mese senza pensarci. Poi lo guardi con altri occhi, e ti viene un\'idea migliore.'},
  {l:'Basta, non fa per te',e:{f:-4},pers:{C:-2,N:2},r:'Chiudi la cartella sul computer. Non la riaprirai più.'}]});

/* ---------- Mezza età ---------- */
ev({id:'ad_lingua',min:25,max:75,once:1,t:'Una nuova lingua',x:d=>{d.lng=d.lng||pick(['giapponese','portoghese','arabo','russo','coreano','svedese']);return `Il comune organizza un corso serale di ${d.lng}. Le iscrizioni chiudono domani.`},c:[
  {l:'Ti iscrivi',p:()=>.4+pz('C')*.3,si:{e:{lingue:8,i:2,f:4},pers:{O:3,C:2},r:'Due anni di lezioni. Ora sai ordinare, chiedere scusa e litigare in {lng}.'},no:{e:{lingue:2},pers:{O:2,C:-1},r:'Vai alle prime quattro lezioni. Poi arriva l\'inverno, e con lui il divano.'}},
  {l:'Non è il momento',pers:{O:-1},r:'Ci sarà tempo.'}]});
ev({id:'ad_cassetto',min:32,max:58,once:1,t:'Il sogno nel cassetto',x:'Mettendo in ordine trovi un quaderno di quando avevi vent\'anni, con la lista delle cose che volevi fare nella vita.',c:[
  {l:'Ne scegli una e la fai davvero',fx:()=>{mod('felicita',8);return [pick(['Impari a suonare il pianoforte, una nota storta alla volta.','Vai a vedere l\'aurora boreale. Piangi un po\', di nascosto.','Corri la tua prima gara, arrivando trecentesim{o}. Felicissim{o}.','Scrivi un racconto e lo mandi a un concorso. Arriva quarto.']).replace(/\{o\}/g,g('o','a'))+' Non era troppo tardi.','g']},pers:{O:3,C:2}},
  {l:'Sorridi e lo rimetti nel cassetto',e:{f:-1},pers:{N:1},r:'Era un\'altra persona. O forse no.'},
  {l:'Lo butti',pers:{O:-2,N:-1},r:'Il passato è passato. Ti senti più legger{o}, o almeno così ti dici.'}]});
ev({id:'ad_vicini',min:25,max:85,rip:12,cond:inCasaTua,t:'I vicini nuovi',x:d=>{d.da=d.da||pick(['dal Senegal','dal Perù','dall\'Ucraina','dal Bangladesh','dal Marocco','dalle Filippine']);return `Nell'appartamento accanto si trasferisce una famiglia arrivata ${d.da}. I bambini ti salutano ogni mattina.`},c:[
  {l:'Li inviti a cena',p:.75,si:{e:{f:5},fx:()=>{nuovoAmico()},pers:{O:3,E:2,A:2},r:'Portano un piatto che non avevi mai assaggiato. Da allora vi scambiate ricette e chiavi di casa.'},no:{e:{f:1},pers:{O:2,A:2},r:'Una serata impacciata, tra silenzi e sorrisi. Ma il ghiaccio è rotto.'}},
  {l:'Saluti e basta',pers:{E:-1},r:'Buongiorno, buonasera. Va bene così.'},
  {l:'Ti lamenti degli odori di cucina',e:{k:-3},pers:{A:-3,O:-2},r:'Lo dici all\'amministratore. In condominio in tanti smettono di salutarti.'}]});
ev({id:'ad_figlio_bullo',min:30,max:65,rip:5,chi:['Figlio'],pc:p=>p.eta>=9&&p.eta<=15,t:'La telefonata da scuola',x:'Ti chiamano da scuola: {P} prende in giro un compagno di classe da settimane.',c:[
  {l:'L{po} porti a chiedere scusa di persona',e:{rel:-3,k:3},fx:d=>{if(d.p.pers)d.p.pers.A=clamp(d.p.pers.A+4)},pers:{A:2,C:2},r:'Un pomeriggio difficile. {P} borbotta le scuse, poi in macchina piange. Qualcosa ha capito.'},
  {l:'Ci parli a lungo, senza urlare',e:{rel:3},fx:d=>{if(d.p.pers)d.p.pers.A=clamp(d.p.pers.A+2)},pers:{A:2,N:-2},r:'Scopri che l\'anno prima era {lui} a essere pres{po} di mira.'},
  {l:'Niente telefono per un mese',e:{rel:-6},pers:{C:2,A:-1},r:'Un mese di musi lunghi. Le prese in giro finiscono, il rancore un po\' meno.'},
  {l:'«Saranno ragazzate»',e:{k:-3},fx:d=>{if(d.p.pers)d.p.pers.A=clamp(d.p.pers.A-3)},pers:{A:-3},r:'La scuola insiste. Tu cambi discorso.'}]});
ev({id:'ad_salute',min:40,max:75,once:1,t:'Un campanello d\'allarme',x:'Il medico è serio: «Se non cambia stile di vita, tra dieci anni ne riparliamo in ospedale».',c:[
  {l:'Cambi davvero: dieta e passeggiate',p:()=>.45+pz('C')*.35,si:{e:{s:8,f:3},fx:()=>{S.bis.forma=clamp(S.bis.forma+10)},pers:{C:4,N:-1},r:'Un anno dopo hai otto chili in meno e le analisi di un ventenne. Il medico quasi non ci crede.'},no:{e:{s:2},pers:{C:2},r:'Ci provi sul serio per tre mesi. Poi tornano le vecchie abitudini, ma qualcosa resta.'}},
  {l:'Da lunedì, giuri',pers:{C:-2},r:'Il lunedì arriva ogni settimana. Il cambiamento no.'},
  {l:'Ti fai prendere dal panico',e:{f:-4},pers:{N:4},r:'Notti a cercare sintomi su internet. Scopri malattie che non sapevi esistessero.'}]});
ev({id:'ad_rimpatriata',min:37,max:60,once:1,cond:()=>S.istr.liv>=2,t:'Vent\'anni dopo',x:'Arriva l\'invito alla cena per i vent\'anni dalla maturità. Il gruppo WhatsApp è già impazzito.',c:[
  {l:'Ci vai e parli con tutti',e:{f:5},fx:()=>{if(chance(.4))nuovoAmico()},pers:{E:3},r:'Chi è ingrassato, chi ha divorziato, chi è diventato dirigente. Siete tutti uguali, solo più stanchi.'},
  {l:'Ci vai, ma stai con i soliti due',e:{f:3},r:'Un angolo del ristorante, tre vecchi amici e mille ricordi.'},
  {l:'Non vai: il passato è passato',pers:{E:-3},r:'Il giorno dopo guardi le foto. Non ti sei pers{o} niente. Forse.'}]});
ev({id:'ad_riconcilia',min:25,max:85,once:1,chi:['Madre','Padre','Fratello'],pc:p=>p.rapporto<35&&p.eta>=18,t:'Una telefonata inattesa',x:'{Tuo} {P}, con cui non parli quasi più, ti chiama: «Possiamo vederci? Vorrei chiederti scusa».',c:[
  {l:'Accetti e ascolti',e:{rel:25,f:6},fx:d=>{ricorda(d.p,'Avete fatto pace dopo anni')},pers:{A:4,N:-2},r:'Un caffè che dura tre ore. Non si sistema tutto, ma qualcosa sì.'},
  {l:'Accetti, ma metti le cose in chiaro',e:{rel:12,f:3},pers:{A:1,N:-2},r:'Dici tutto quello che non avevi mai detto. {Lui} incassa. È un inizio.'},
  {l:'Non sei pront{o}',e:{rel:-3},pers:{A:-2,N:1},r:'Riattacchi. Ci ripensi per giorni.'}]});
ev({id:'ad_meditazione',min:25,max:80,rip:15,t:'Il ritiro',x:'Un collega ti racconta di un weekend di meditazione in silenzio in un monastero. «Ti cambia la vita, giuro.»',c:[
  {l:'Ci vai',p:()=>.5+pz('O')*.3,si:{e:{f:6},fx:()=>{S.bis.stress=clamp(S.bis.stress-15)},pers:{N:-4,O:2},r:'Due giorni senza parlare. Ti accorgi che non avevi mai davvero ascoltato i tuoi pensieri.'},no:{pers:{O:1},r:'Il secondo giorno scappi al bar del paese a prendere un caffè. Però ci hai provato.'}},
  {l:'Non fa per te',pers:{O:-2},r:'Il silenzio ti mette ansia solo a pensarci.'}]});
ev({id:'ad_bugia',min:20,max:80,rip:8,chi:['Partner','Coniuge'],t:'La piccola bugia',x:'{P} scopre che avevi detto di essere al lavoro, ma eri al bar a guardare la partita con un amico.',c:[
  {l:'Ammetti e chiedi scusa',e:{rel:-2},pers:{A:2,C:2},r:'«Bastava dirmelo.» Ha ragione.'},
  {l:'Inventi un\'altra bugia',p:.5,si:{e:{rel:-1},pers:{C:-2,A:-2},r:'Regge. Per ora.'},no:{e:{rel:-12},pers:{C:-2,A:-2,N:1},r:'Due bugie sono peggio di una. Stanotte dormi sul divano.'}},
  {l:'Ti arrabbi: «Mi controlli?»',e:{rel:-8},pers:{A:-3,N:2},r:'Il contrattacco funziona male. Come sempre.'}]});
ev({id:'ad_figlio_strada',min:42,max:85,once:1,chi:['Figlio'],pc:p=>p.eta>=19&&p.eta<=35,t:'La sua strada',x:d=>{d.sogno=d.sogno||pick(['lascia il posto in banca per aprire un chiosco sulla spiaggia in Portogallo','molla l\'università per fare il musicista','si trasferisce in Australia, «almeno per qualche anno»','vuole aprire un rifugio per cani in montagna']);return `${d.p.nome} ti annuncia che ${d.sogno}. Poi ti guarda, in attesa.`},c:[
  {l:'L{po} sostieni, anche se hai paura',e:{rel:10,f:2},pers:{A:3,O:3,N:-1},r:'«Grazie», ti dice. Non ti abbracciava così da quando era piccol{po}.'},
  {l:'Provi a fargli cambiare idea'.replace('gli','{gli}'),e:{rel:-6},pers:{C:2,O:-2},r:'Un lungo discorso su futuro e sicurezza. Ti ascolta, educatamente, e poi fa di testa sua.'},
  {l:'Ti arrabbi: «Non contare su di me»',e:{rel:-18,f:-3},fx:d=>{ricorda(d.p,'Non hai appoggiato la sua scelta')},pers:{A:-3,O:-2},r:'Una porta sbattuta. Per mesi vi sentite solo a Natale.'}]});

/* ---------- Terza età ---------- */
ev({id:'ad_primo_lunedi',min:60,max:80,once:1,cond:()=>!S.lavoro&&S.pensione>0,t:'Il primo lunedì',x:'Primo lunedì da pensionat{o}. Ti svegli alle sei per abitudine e non sai cosa fare.',c:[
  {l:'Ti butti nel volontariato',e:{k:6,f:5},pers:{A:3,E:2},r:'Al banco alimentare ti aspettano il martedì e il giovedì. Ti senti di nuovo utile.'},
  {l:'Riprendi una vecchia passione',e:{f:5,arte:3},pers:{O:3},r:'I pennelli erano in cantina da trent\'anni. Non hanno dimenticato niente, e neanche tu.'},
  {l:'Ti godi il divano, finalmente',e:{f:2},pers:{E:-2,O:-2},r:'Il primo mese è bellissimo. Il secondo un po\' meno.'},
  {l:'Organizzi le giornate al minuto',e:{f:2},pers:{C:3},r:'Spesa alle nove, passeggiata alle dieci, pranzo a mezzogiorno in punto. In famiglia ti prendono in giro.'}]});
ev({id:'ad_lettera',min:55,max:90,once:1,t:'Una lettera',x:'Al laboratorio di scrittura vi chiedono di scrivere una lettera a voi stessi a vent\'anni.',c:[
  {l:'Scrivi di non avere paura',e:{f:4},pers:{N:-3},r:'«Andrà meglio di quanto pensi.» Rileggendola, capisci che vale anche adesso.'},
  {l:'Scrivi di osare di più',e:{f:2},pers:{O:3},r:'«Di\' più spesso di sì.» Il giorno dopo ti iscrivi a un corso di ballo.'},
  {l:'Ci metti dentro tutti i rimpianti',e:{f:-3},pers:{N:3},r:'Viene fuori lunga. Più lunga di quanto credevi.'},
  {l:'Scrivi solo «grazie»',e:{f:3},pers:{A:2,N:-2},r:'Grazie per non aver mollato. È la lettera più corta del laboratorio, e la più applaudita.'}]});
ev({id:'ad_vecchio_rancore',min:60,max:95,once:1,chi:['Nemico','Ex'],t:'Dopo tanti anni',x:'{P} ti scrive dopo tanti anni: «Siamo vecchi, non ha più senso avercela l\'uno con l\'altro».',c:[
  {l:'Fai pace',e:{f:6},fx:d=>{if(d.p.ruolo==='Nemico'){d.p.ruolo='Conoscente';d.p.rancore=0}d.p.rapporto=clamp(d.p.rapporto+25);ricorda(d.p,'Avete fatto pace da anziani')},pers:{A:4,N:-2},r:'Un caffè, due persone anziane che ridono di cose di quarant\'anni fa. Più leggero di così.'},
  {l:'Rispondi gentilmente, ma a distanza',pers:{A:1},r:'Un messaggio cordiale. Il resto può restare dov\'è.'},
  {l:'Non rispondi',pers:{A:-3},r:'Certe cose non si dimenticano. Neanche a ottant\'anni.'}]});
ev({id:'ad_nonni_sitter',min:50,max:85,rip:8,chi:['Figlio'],pc:p=>vivi(['Nipote']).some(n=>n.gen===p.id&&n.eta<11),t:'Nonni a tempo pieno',x:'{Tuo} {P} ti chiede di tenere i bambini tre pomeriggi a settimana.',c:[
  {l:'Sì, con gioia',e:{rel:8,f:4},fx:d=>{S.bis.energia=clamp(S.bis.energia-8);vivi(['Nipote']).filter(n=>n.gen===d.p.id).forEach(n=>n.rapporto=clamp(n.rapporto+10))},pers:{A:3,E:1},r:'Merende, compiti, cartoni animati. Torni a casa sfinit{o} e felice.'},
  {l:'Un pomeriggio sì, gli altri no',e:{rel:-2},pers:{C:2},r:'Metti dei paletti. {P} capisce, più o meno.'},
  {l:'No: hai già dato',e:{rel:-10},pers:{A:-3},r:'«Ho cresciuto te, adesso tocca a te.» Silenzio al telefono.'}]});
ev({id:'ad_viaggio_tardi',min:65,max:85,once:1,cond:()=>S.soldi>=P(3500)&&S.salute>45,t:'Il viaggio rimandato',x:d=>{d.dove=d.dove||pick(['il Giappone','la Patagonia','l\'Islanda','New York','l\'India','il Canada']);return `Da cinquant'anni dici che un giorno vedrai ${d.dove}. Le gambe ancora reggono.`},c:[
  {l:'Prenoti e parti',sub:()=>'Circa '+eur(P(3500)),fx:()=>{soldi(-P(3500));segnaVita('viaggio')},e:{f:12},pers:{O:4,E:1},r:'Un viaggio lungo e faticoso, e bellissimo. Torni con mille foto e una ginocchiera.'},
  {l:'Non è più cosa per te',e:{f:-2},pers:{O:-2},r:'Lo guardi in un documentario. È quasi la stessa cosa, ti dici.'}]});
ev({id:'ad_apprendista',min:50,max:80,once:1,t:'L\'apprendista',x:'Un ragazzo del quartiere ti chiede di insegnargli quello che sai fare meglio.',c:[
  {l:'Gli dedichi un pomeriggio a settimana',e:{f:6,k:3},fx:()=>{if(vivi(['Amico']).length<12){const a=nuovaPersona('Amico','M',r(16,22),null,{rapporto:r(55,70)});ricorda(a,'Gli hai insegnato il mestiere')}},pers:{A:3,C:1,E:1},r:'All\'inizio è un disastro. Un anno dopo è più bravo di te, e te lo dice pure.'},
  {l:'Non hai la pazienza',pers:{A:-2},r:'«Guarda i tutorial», gli dici. Ci rimane male.'}]});
ev({id:'ad_casa_vuota',min:55,max:95,once:1,cond:()=>!!vedovo()&&single(),t:'La casa vuota',x:()=>`Da quando non c'è più ${vedovo().nome}, la casa è troppo silenziosa.`,c:[
  {l:'Ti iscrivi al centro anziani',e:{f:6},fx:()=>{nuovoAmico()},pers:{E:4,N:-2},r:'Burraco il lunedì, gite il giovedì. La sera racconti la giornata alla sua foto.'},
  {l:'Chiami più spesso i tuoi cari',fx:()=>{vivi(['Figlio','Fratello','Nipote']).forEach(p=>p.rapporto=clamp(p.rapporto+5))},e:{f:3},pers:{A:2,E:1},r:'Una telefonata al giorno. Scopri che anche loro ne avevano bisogno.'},
  {l:'Resti a casa con i ricordi',e:{f:-4},pers:{E:-3,N:3},r:'Riguardi gli album per giorni. Ogni foto è una stanza.'}]});
