/* ================= SCUOLA E ADOLESCENZA (6–17): ALTRI MOMENTI =================
   Si aggiungono a d4_infanzia.js e d5_adolescenza.js (ROADMAP, Fase 1: almeno 150 eventi possibili per fascia).
   Qui ci sono anche i sacramenti (catechismo → prima comunione → cresima, solo nelle famiglie che li seguono)
   e la pubertà. */
/* Circa due famiglie su tre mandano i figli al catechismo: si decide una volta per vita */
function famReligiosa(){if(S.fatti.famRel===undefined)S.fatti.famRel=chance(.65)?1:0;return !!S.fatti.famRel}
const scuolaDi=()=>S.scuola.stato;
const MARINARE={'Lombardia':'bigiare','Lazio':'fare sega','Campania':'fare filone','Toscana':'fare forca'};
const marinare=()=>MARINARE[luogo().reg]||'marinare la scuola';

/* ---------- Scuola elementare e medie (6–13) ---------- */
ev({id:'bim_grembiule',min:6,max:6,once:1,w:1.3,t:'Il grembiule',x:'Primo giorno di scuola: grembiule nuovo, zaino più grande di te, tanti bambini che non conosci.',c:[
  {l:'Ti presenti a tutti',e:{f:3},pers:{E:2},r:'Alla ricreazione conosci già mezza classe.'},
  {l:'Tieni la mano della mamma fino al cancello',pers:{N:1,A:1},r:'Al cancello la lasci andare. Ci vuole coraggio, e ce l\'hai.'},
  {l:'Ti siedi al primo banco',e:{i:1},pers:{C:2},r:'La maestra ti nota subito. Da lì si vede tutto.'}]});
ev({id:'bim_leggere',min:6,max:7,once:1,t:'Le prime parole',x:'In macchina, tutto d\'un tratto, riesci a leggere le insegne dei negozi.',c:[
  {l:'Le leggi tutte ad alta voce',e:{i:2,f:2},pers:{E:1,O:1},r:'«FAR-MA-CIA! PA-NE!» Il viaggio più lungo della vita dei tuoi.'},
  {l:'Le leggi in silenzio, per te',e:{i:2},pers:{C:1,E:-1},r:'È come avere un superpotere segreto.'},
  {l:'Chiedi un libro tutto tuo',e:{i:3},pers:{O:2},r:'Il primo libro letto da sol{o}: trentadue pagine di orgoglio.'}]});
ev({id:'bim_dettato',min:7,max:8,once:1,t:'Il dettato',x:'Dettato in classe. «Quaderno» si scrive con la q o con la c?',c:[
  {l:'Ci pensi bene e scegli',p:.6,si:{e:{voto:3,i:1},pers:{C:2},r:'Con la q. Zero errori: stellina sul quaderno.'},no:{e:{voto:-1},pers:{C:1},r:'«Cuaderno.» La maestra lo cerchia di rosso, ma con gentilezza.'}},
  {l:'Sbirci dal compagno',pers:{A:-1,C:-1},r:'Il compagno aveva sbagliato. Ora sbagliate in due.'},
  {l:'Scrivi veloce senza pensarci',e:{voto:-1},pers:{C:-1,N:-1},r:'Finisci per prim{o}. Con sei errori.'}]});
ev({id:'bim_catechismo',min:7,max:8,once:1,w:1.5,cond:famReligiosa,t:'Il catechismo',x:'I tuoi ti hanno iscritto al catechismo: il sabato pomeriggio in parrocchia, in vista della prima comunione.',c:[
  {l:'Ci vai volentieri',pers:{A:1,C:1},fl:'catechismo',fut:[1.5,'bim_comunione'],r:'Canzoni, disegni e merenda all\'oratorio. Il sabato diventa un appuntamento.'},
  {l:'Ci vai, ma fai mille domande',e:{i:1},pers:{O:2},fl:'catechismo',fut:[1.5,'bim_comunione'],r:'La catechista ti adora e ti teme. Le tue domande sono difficili.'},
  {l:'Convinci i tuoi a lasciarti a casa',pers:{O:1,C:-1},fx:()=>{relGenitori(-2)},r:'Il sabato resta tuo. La nonna non è contentissima.'}]});
ev({id:'bim_comunione',link:1,t:'La prima comunione',x:'Vestito bianco, chiesa piena, parenti da tutta Italia. Dopo la messa, il pranzo al ristorante.',c:[
  {l:'Vivi la giornata con emozione',pers:{A:2,N:1},fx:()=>{mod('felicita',5);relGruppo(famIn(),2,4);if(chance(.8))futuro(4,'rag_cresima',{})},r:'Ti tremano le mani. È una giornata che ricorderai.'},
  {l:'Pensi soprattutto ai regali',pers:{A:-1},fx:()=>{const x=P(r(150,500));soldi(x);if(chance(.8))futuro(4,'rag_cresima',{});return [`Buste dei parenti, un orologio e una bicicletta: ${eur(x)} solo di buste.`,'g']}},
  {l:'Al pranzo ti annoi a morte',pers:{E:-1},fx:()=>{mod('felicita',1);if(chance(.8))futuro(4,'rag_cresima',{})},r:'Sei portate, quattro ore. Giochi a calcio con i cugini sotto i tavoli.'}]});
ev({id:'bim_nuoto',min:6,max:9,once:1,t:'Il corso di nuoto',x:'Il corso di nuoto è finito: oggi c\'è la prova per il primo brevetto.',c:[
  {l:'Ti impegni al massimo',p:.75,si:{e:{f:4,sport:3},pers:{C:2,N:-1},r:'Brevetto superato! La toppa del delfino cucita sul costume.'},no:{e:{f:-2,sport:1},pers:{N:1},r:'Ti manca una vasca. Riproverai a giugno.'}},
  {l:'Giochi più che nuotare',e:{f:3},pers:{E:1,C:-1},r:'Brevetto rimandato, ma ti sei divertit{o} tantissimo.'},
  {l:'Hai paura della vasca alta',pers:{N:2},r:'L\'istruttore ti fa nuotare vicino al bordo. Un passo alla volta.'}]});
ev({id:'bim_mattoncini',min:6,max:10,once:1,t:'Il castello di mattoncini',x:'Per il compleanno ti regalano una scatola di mattoncini da milleduecento pezzi.',c:[
  {l:'Segui le istruzioni passo passo',e:{i:2},pers:{C:2},r:'Tre giorni e il castello è perfetto, identico alla foto.'},
  {l:'Costruisci quello che vuoi tu',e:{i:1},pers:{O:3},r:'Il castello diventa un\'astronave con il ponte levatoio.'},
  {l:'Lo costruisci con tuo papà',cond:()=>vivi(['Padre']).length>0,pers:{A:1},fx:()=>{const p=vivi(['Padre'])[0];p.rapporto=clamp(p.rapporto+5)},r:'Papà si appassiona più di te. Finisce alle due di notte.'}]});
ev({id:'bim_fumetto',min:8,max:12,once:1,t:'Il fumetto',x:'Hai inventato un supereroe e vuoi disegnare le sue avventure.',c:[
  {l:'Disegni un intero albo',e:{arte:4,f:3},pers:{O:2,C:1},r:'Ventiquattro pagine. In classe se lo passano di banco in banco.'},
  {l:'Lo fai con il tuo migliore amico',pers:{E:1,A:1},fx:()=>{const a=vivi(['Amico'])[0];if(a)a.rapporto=clamp(a.rapporto+5)},e:{arte:2},r:'Tu disegni, l\'altro scrive i dialoghi. Una casa editrice di due persone.'},
  {l:'Lo lasci a metà',pers:{C:-2},r:'Il supereroe resta bloccato a pagina tre, sospeso su un grattacielo. Per sempre.'}]});
ev({id:'bim_biblioteca',min:7,max:11,once:1,t:'La tessera della biblioteca',x:'La maestra porta la classe in biblioteca. Ognuno riceve la sua tessera.',c:[
  {l:'Prendi il massimo dei libri',e:{i:3},pers:{O:2,C:1},r:'Tre libri a settimana. La bibliotecaria ti saluta per nome.'},
  {l:'Prendi un libro di animali con tante figure',e:{i:1},pers:{O:1},r:'Diventi espert{o} di squali. Lo sapranno tutti, a cena.'},
  {l:'La tessera finisce in fondo allo zaino',pers:{C:-1},r:'Ritrovata due anni dopo, accartocciata. Mai usata.'}]});
ev({id:'bim_intervallo',min:6,max:10,once:1,t:'Il gioco dell\'intervallo',x:'In cortile si decide a cosa giocare: rubabandiera, strega comanda colore o palla prigioniera.',c:[
  {l:'Decidi tu e organizzi le squadre',e:{f:2},pers:{E:2,C:1},r:'Squadre equilibrate, regole chiare. Tutti ti seguono.'},
  {l:'Giochi a quello che vogliono gli altri',pers:{A:2},r:'Un intervallo tranquillo. Nessuna discussione.'},
  {l:'Inventi un gioco nuovo',e:{f:2},pers:{O:3},r:'Le regole sono complicate, ma dopo una settimana ci gioca tutta la scuola.'}]});
ev({id:'bim_quaderno',min:7,max:11,once:1,t:'Il quaderno a casa',x:'Arrivi a scuola e ti accorgi di aver dimenticato il quaderno dei compiti. Fatti, ma a casa.',c:[
  {l:'Lo dici subito alla maestra',pers:{C:1,A:1},r:'Ti crede. Domani lo porti e lo controlla.'},
  {l:'Dici che te l\'ha mangiato il cane',pers:{O:1,A:-1},r:'Non hai un cane. La maestra lo sa.'},
  {l:'Rifai i compiti di corsa prima della campanella',e:{voto:-1},pers:{C:2,N:1},r:'Scrittura illeggibile, ma consegnati. Il cuore a mille.'}]});
ev({id:'bim_maestra_nuova',min:7,max:10,once:1,t:'La maestra nuova',x:'La vostra maestra va in pensione. Arriva una maestra nuova, giovane e con metodi tutti diversi.',c:[
  {l:'Le dai fiducia',e:{voto:2},pers:{O:2,A:1},r:'Lezioni all\'aperto ed esperimenti: la scuola non è mai stata così bella.'},
  {l:'Ti manca la maestra di prima',pers:{N:1,O:-1},r:'Le scrivi una lettera. Lei risponde, con un disegno.'},
  {l:'Metti alla prova la nuova arrivata',pers:{A:-2,E:1},r:'Lei non cade in nessuna trappola. Ti guadagni il suo rispetto, e una nota.'}]});
ev({id:'bim_compagno_carrozzina',min:6,max:10,once:1,t:'Il compagno in carrozzina',x:'In classe arriva un bambino in sedia a rotelle. Tutti lo guardano, nessuno gli parla.',c:[
  {l:'Ti siedi vicino a lui',e:{f:2},pers:{A:3,E:1},r:'Ha un senso dell\'umorismo pazzesco. Diventate inseparabili.'},
  {l:'Lo aiuti solo quando te lo chiede',pers:{A:2,C:1},r:'Ti dice che sei l\'unic{o} a trattarlo normalmente. È il complimento più bello.'},
  {l:'Non sai come comportarti e ti allontani',pers:{E:-1,N:1},r:'Ti senti a disagio per mesi. Poi, un giorno, giocate a carte e passa tutto.'}]});
ev({id:'bim_gomma',min:7,max:10,once:1,t:'La gomma da masticare',x:'Al supermercato, vicino alla cassa, nessuno ti guarda. La gomma da masticare è lì, a portata di mano.',c:[
  {l:'Lasci stare',pers:{C:2,A:1},r:'La chiedi a papà. La risposta è no, ma sei tranquill{o}.'},
  {l:'La metti in tasca',p:.6,si:{e:{k:-3},pers:{C:-2,A:-1},r:'Nessuno se ne accorge. Il sapore è strano: un po\' di fragola, un po\' di colpa.'},no:{e:{k:-2,f:-3},pers:{C:1,N:2},r:'La cassiera ti vede. Tua madre ti fa chiedere scusa davanti a tutti. Che vergogna.'}},
  {l:'Convinci un amico a prenderla per te',pers:{A:-2,O:1},r:'Lui la prende, tu la mastichi. Ma la sera ci pensi a lungo.'}]});
ev({id:'bim_lavagna',min:8,max:11,once:1,t:'Alla lavagna',x:'La maestra ti chiama alla lavagna per un problema con le frazioni.',c:[
  {l:'Ragioni ad alta voce',p:()=>.45+S.intelligenza/250,si:{e:{voto:3,i:1},pers:{N:-2,E:1},r:'Ci arrivi. Applauso della classe.'},no:{e:{voto:-1},pers:{N:1},r:'Ti blocchi a metà. La maestra ti aiuta a finire.'}},
  {l:'Chiedi aiuto a un compagno',pers:{A:1,E:1},r:'Lo risolvete insieme. La maestra vi dà un mezzo voto in più a testa.'},
  {l:'Fai il pagliaccio per far ridere',e:{voto:-2},pers:{E:2,C:-1},r:'Ride tutta la classe. La maestra no.'}]});
ev({id:'bim_papa_lavora',min:6,max:12,once:1,cond:()=>famG().length>0,t:'Fino a tardi',x:'In questo periodo i tuoi lavorano fino a tardi. A cena c\'è un posto vuoto quasi tutte le sere.',c:[
  {l:'Aspetti svegli{o} per salutarli',pers:{A:1,N:1},r:'Un abbraccio alle dieci di sera vale tutta la giornata.'},
  {l:'Lasci un disegno sul tavolo',pers:{A:2,O:1},r:'La mattina dopo trovi un cuore disegnato sotto il tuo.'},
  {l:'Ti arrabbi e non parli a cena',pers:{N:2,A:-1},fx:()=>relGenitori(-2),r:'Lo capiscono. La domenica dopo la passate tutta insieme.'}]});
ev({id:'bim_coro',min:7,max:11,once:1,t:'Il coro della scuola',x:'Si forma il coro della scuola per il concerto di fine anno.',c:[
  {l:'Ti offri come solista',p:()=>.4+S.abil.musica/150,si:{e:{musica:4,f:5},pers:{E:2,N:-1},r:'Canti da sol{o} davanti a tutti i genitori. Qualcuno si commuove.'},no:{e:{musica:2,f:-2},pers:{E:1,N:1},r:'Ti trema la voce. Ma l\'hai fatto.'}},
  {l:'Canti in fondo, con gli altri',e:{musica:2},pers:{A:1},r:'Nessuno ti sente, ma tu ti diverti.'},
  {l:'Dici che sei stonat{o}',pers:{E:-1},r:'Fai il tecnico delle luci. Ruolo fondamentale.'}]});
ev({id:'bim_sport_nuovo',min:8,max:11,once:1,t:'Uno sport diverso',x:'Alla giornata dello sport a scuola provi scherma, rugby e judo.',c:[
  {l:'La scherma, eleganza e strategia',e:{sport:2},pers:{C:2,O:1},r:'La maschera, la pedana, il saluto. Ti senti un moschettiere.'},
  {l:'Il rugby, nel fango con la squadra',e:{sport:3,f:2},pers:{E:2,N:-1},r:'Sporc{o} dalla testa ai piedi e felicissim{o}.'},
  {l:'Il judo, cadere e rialzarsi',e:{sport:2},pers:{N:-2,C:1},r:'La prima cosa che impari è cadere. Ti servirà anche fuori dal tatami.'}]});
ev({id:'bim_ultimo',min:8,max:12,once:1,t:'L\'ultimo posto',x:'Corsa campestre della scuola. Arrivi ultim{o}, staccat{o} di parecchio.',c:[
  {l:'Arrivi comunque in fondo, sorridendo',pers:{N:-2,C:1},r:'Il prof ti applaude più degli altri. Arrivare conta.'},
  {l:'Ti ritiri prima del traguardo',pers:{N:1,C:-1},r:'Ti siedi sull\'erba. L\'anno prossimo, forse.'},
  {l:'Ti alleni tutta l\'estate per rifarti',e:{sport:4},pers:{C:3},r:'L\'anno dopo arrivi a metà classifica. Una vittoria tutta tua.'}]});
ev({id:'bim_amico_lutto',min:8,max:12,once:1,t:'Il papà di un compagno',x:'Il papà di un tuo compagno di classe è morto all\'improvviso. Domani lui torna a scuola.',c:[
  {l:'Gli stai vicino senza dire niente',pers:{A:3,N:-1},r:'All\'intervallo gli offri metà della merenda. Lui la prende. Basta questo.'},
  {l:'Gli scrivi un biglietto',pers:{A:2,O:1},r:'«Se vuoi giocare, ci sono.» Lo conserverà per anni.'},
  {l:'Non sai cosa dire e lo eviti',pers:{E:-1,N:1},r:'Ti senti in colpa. Anni dopo glielo dirai, e lui capirà.'}]});
ev({id:'bim_finestra',min:8,max:11,once:1,t:'La finestra rotta',x:'Giocando a pallone in cortile, una tua pallonata rompe la finestra del vicino.',c:[
  {l:'Suoni al campanello e confessi',pers:{C:2,A:2},fx:()=>{const x=P(80);soldi(-Math.min(S.soldi,x))},r:'Il vicino brontola, ma apprezza. Paghi il vetro con la paghetta di due mesi.'},
  {l:'Scappate tutti',pers:{C:-2,N:1},p:.5,si:{r:'Nessuno vi ha visti. Per un mese giocate dall\'altra parte del palazzo.'},no:{fx:()=>relGenitori(-3),r:'Il vicino vi ha visti dalla finestra. La chiamata ai tuoi arriva prima di te.'}},
  {l:'Dai la colpa a un altro',pers:{A:-3},r:'Funziona. Il tuo amico paga il vetro. Lui non lo dimenticherà.'}]});
ev({id:'bim_museo',min:8,max:12,once:1,t:'Il museo',x:'Gita al museo di storia naturale: scheletri di dinosauro, minerali e animali impagliati.',c:[
  {l:'Leggi ogni cartellino',e:{i:3},pers:{O:2,C:1},r:'Torni a casa con un quaderno pieno di appunti e un sogno: studiare i dinosauri.'},
  {l:'Fai le smorfie davanti al T-rex',e:{f:2},pers:{E:2},r:'La foto più bella della gita.'},
  {l:'Ti annoi e conti i minuti',pers:{O:-2},r:'Il momento migliore è il pranzo al sacco.'}]});
ev({id:'bim_compiti_papa',min:7,max:10,once:1,cond:()=>famG().length>0,t:'I compiti con i grandi',x:'I tuoi ti aiutano con i compiti di matematica. Peccato che usino un metodo che la maestra non vuole.',c:[
  {l:'Fai come dicono loro',e:{voto:-1},pers:{A:1},r:'Il risultato è giusto, il metodo no. La maestra scrive «Bravi i genitori» sul quaderno.'},
  {l:'Spieghi tu il metodo della maestra',e:{i:2},pers:{C:1,E:1},r:'Dopo mezz\'ora l\'hanno capito anche loro. Il professore sei tu.'},
  {l:'Li fai da sol{o}, a modo tuo',e:{i:1},pers:{C:1,O:1},r:'Sbagli un esercizio, ma li hai fatti tutti tu.'}]});
ev({id:'bim_pidocchi',min:6,max:9,once:1,t:'I pidocchi',x:'Circolare della scuola: in classe ci sono i pidocchi. Stasera ti grattano la testa.',c:[
  {l:'Lo dici subito ai tuoi',pers:{C:1},r:'Shampoo puzzolente e pettinino. In tre giorni è tutto finito.'},
  {l:'Ti vergogni e non dici niente',pers:{N:2,E:-1},r:'Se ne accorgono comunque. E nel frattempo li hai passati a tutta la famiglia.'},
  {l:'Lo trovi divertente',pers:{O:1,N:-1},r:'Racconti a tutti di avere degli animali domestici in testa.'}]});
ev({id:'bim_topolino',min:6,max:7,once:1,t:'Il dentino',x:'Ti è caduto il primo dente da latte. Stanotte passa il topolino.',c:[
  {l:'Lo metti sotto il cuscino',fx:()=>soldi(P(2)),pers:{O:1},r:'La mattina trovi una moneta. Il topolino paga bene.'},
  {l:'Resti svegli{o} per vedere il topolino',pers:{O:2,C:-1},r:'Ti addormenti alle undici. Il topolino è più furbo.'},
  {l:'Lo tieni in una scatolina',pers:{C:1},r:'Inizia la collezione di dentini. Un po\' inquietante, dicono in famiglia.'}]});
ev({id:'bim_aquilone',min:7,max:11,once:1,t:'L\'aquilone',x:'Una domenica ventosa: è il giorno giusto per l\'aquilone costruito con il nonno.',c:[
  {l:'Corri controvento finché vola',e:{f:4,s:1},pers:{C:1,E:1},r:'Vola altissimo. Per un\'ora il cielo è tuo.'},
  {l:'Lo lasci andare per vedere dove arriva',pers:{O:2,C:-1},r:'Arriva su un albero. Ci resterà tutto l\'inverno.'},
  {l:'Lo fai volare insieme a un bambino che non ce l\'ha',pers:{A:2},r:'Fate a turno. A fine pomeriggio siete amici.'}]});
ev({id:'bim_neve_scuola',min:6,max:11,once:1,cond:()=>luogo().zona!=='Isole',t:'Scuole chiuse per neve',x:'Il sindaco ha chiuso le scuole: è nevicato tutta la notte.',c:[
  {l:'Battaglia di palle di neve con tutto il quartiere',e:{f:5,s:1},pers:{E:2},r:'Una guerra epica. Torni a casa con le guance rosse e i guanti fradici.'},
  {l:'Costruisci un pupazzo gigante',e:{f:3},pers:{C:1,O:1},r:'Due metri, con la sciarpa di papà. Il pupazzo più fotografato della via.'},
  {l:'Ne approfitti per finire i compiti',e:{voto:2},pers:{C:2,E:-1},r:'Mentre tutti giocano, tu sei avanti di una settimana.'}]});
ev({id:'bim_evacuazione',min:6,max:10,once:1,t:'La prova di evacuazione',x:'Suona l\'allarme: è la prova di evacuazione. Tutti in fila verso il cortile.',c:[
  {l:'Fai l\'aprifila con serietà',pers:{C:2,E:1},r:'Il preside vi cronometra: la tua classe è la più veloce.'},
  {l:'Approfitti della confusione per scherzare',pers:{C:-1,E:1},r:'Una nota collettiva per tutta la fila. Valeva la pena? Forse.'},
  {l:'Ti spaventi davvero',pers:{N:2},r:'La maestra ti tiene per mano fino in cortile. Era solo una prova.'}]});
ev({id:'bim_parolaccia',min:7,max:10,once:1,t:'La parolaccia',x:'A cena, davanti ai nonni, ti scappa una parolaccia sentita a scuola.',c:[
  {l:'Chiedi cosa vuol dire',pers:{O:1,A:1},r:'Silenzio di tomba, poi il nonno scoppia a ridere. Nessuno ti risponde.'},
  {l:'Fai finta di niente',pers:{C:-1},r:'Purtroppo l\'hanno sentita tutti.'},
  {l:'Chiedi scusa e diventi ross{o}',pers:{N:1,A:1},r:'Il rossore dura più della predica.'}]});
ev({id:'bim_maestra_regalo',min:8,max:10,once:1,t:'Il regalo alla maestra',x:'Fine della quinta: la classe vuole fare un regalo alla maestra.',c:[
  {l:'Organizzi tu la raccolta',pers:{C:2,E:1},fx:()=>soldi(-Math.min(S.soldi,P(5))),r:'Una pianta, un biglietto firmato da tutti e una maestra in lacrime.'},
  {l:'Scrivi una lettera tutta tua',e:{i:1},pers:{A:2,O:1},r:'La maestra la legge davanti a tutti. Poi la mette nella borsa, con cura.'},
  {l:'Firmi il biglietto degli altri',pers:{A:1},r:'Il tuo nome tra ventidue. Va bene anche così.'}]});
ev({id:'bim_pesca',min:6,max:10,once:1,t:'La pesca di beneficenza',x:'Alla festa del quartiere c\'è la pesca di beneficenza. Un biglietto, un premio.',c:[
  {l:'Peschi un pesce rosso',e:{f:4},pers:{A:1},r:'Lo chiami Bolla. Vivrà sei anni, contro ogni previsione.'},
  {l:'Peschi un servizio di bicchieri',e:{f:-1},pers:{O:1},r:'La nonna lo trova bellissimo. Lo prende lei.'},
  {l:'Spendi tutti i soldi per vincere il peluche gigante',pers:{C:-2,E:1},fx:()=>soldi(-Math.min(S.soldi,P(10))),r:'Dieci biglietti, dieci saponette. Il peluche lo vince un bambino al primo tentativo.'}]});
ev({id:'bim_colletta',min:8,max:11,once:1,t:'Il regalo di classe',x:'Per il compleanno di un compagno la classe mette insieme i soldi per un regalo. Lui ha la famiglia in difficoltà.',c:[
  {l:'Metti più degli altri, in silenzio',pers:{A:3},fx:()=>soldi(-Math.min(S.soldi,P(10))),r:'Nessuno lo sa. Il compagno scarta il pallone nuovo con gli occhi lucidi.'},
  {l:'Proponi un regalo fatto a mano',e:{arte:2},pers:{O:2,A:1},r:'Un album di disegni di tutta la classe. Il regalo più bello della festa.'},
  {l:'Dai la tua parte e basta',pers:{C:1},fx:()=>soldi(-Math.min(S.soldi,P(3))),r:'Tre euro nella busta. Il dovere è fatto.'}]});
ev({id:'bim_pane',min:9,max:12,once:1,t:'Da sol{o} al forno',x:'Per la prima volta i tuoi ti mandano da sol{o} a comprare il pane, all\'angolo.',c:[
  {l:'Vai e torni con il resto giusto',pers:{C:2,N:-1},r:'Missione compiuta. Il fornaio ti regala una pizzetta.'},
  {l:'Ti fermi a giocare con gli amici',pers:{C:-2,E:1},r:'Torni un\'ora dopo. Con il pane, almeno.'},
  {l:'Compri anche un dolce con il resto',pers:{O:1,A:-1},r:'Lo mangi per strada. I conti a casa non tornano.'}]});
ev({id:'bim_chiavi',min:10,max:12,once:1,t:'Le chiavi di casa',x:'I tuoi ti danno le chiavi di casa: il pomeriggio torni da scuola da sol{o}.',c:[
  {l:'Le attacchi allo zaino con un nastro',pers:{C:2},r:'Mai perse. Un anno intero di rientri perfetti.'},
  {l:'Le perdi la prima settimana',pers:{C:-2,N:1},r:'Il fabbro costa più di quanto immaginassi. I tuoi te lo ricorderanno a lungo.'},
  {l:'Ti senti grandissim{o}',e:{f:3},pers:{E:1,N:-1},r:'Casa tutta per te fino alle sei. Merenda, compiti e un po\' di TV.'}]});
ev({id:'bim_ciclo',min:11,max:13,once:1,cond:()=>S.sesso==='F',t:'Diventare grande',x:'Una mattina, a scuola, te ne accorgi: ti è venuto il ciclo per la prima volta. Il corpo sta cambiando.',c:[
  {l:'Ne parli con la mamma',cond:()=>vivi(['Madre']).length>0,pers:{A:1,N:-1},fx:()=>{const m=vivi(['Madre'])[0];m.rapporto=clamp(m.rapporto+5)},r:'Ti spiega tutto con calma e la sera ti porta a prendere un gelato. Ti senti più grande.'},
  {l:'Chiedi aiuto alla tua amica del cuore',pers:{E:1,A:1},r:'Ti presta tutto quello che serve e ti accompagna in bagno come una guardia del corpo.'},
  {l:'Non lo dici a nessuno',pers:{N:2,E:-1},r:'Te la cavi da sola, con la testa piena di domande. Le risposte arriveranno.'}]});
ev({id:'bim_voce',min:12,max:14,once:1,cond:()=>S.sesso==='M',t:'La voce',x:'Durante l\'interrogazione la voce ti fa un falsetto improvviso. Tutta la classe ride.',c:[
  {l:'Ridi anche tu',pers:{N:-2,E:1},r:'Ridere di sé è un superpotere. In due giorni nessuno ci pensa più.'},
  {l:'Diventi rosso e ti zittisci',pers:{N:2,E:-1},r:'Per un mese parli il meno possibile. Poi la voce si assesta, più profonda.'},
  {l:'Rifai il falsetto apposta',e:{f:2},pers:{E:2,O:1},r:'La classe ride con te, non di te. Anche il prof sorride.'}]});
ev({id:'bim_medie',min:11,max:11,once:1,w:1.3,cond:()=>scuolaDi()==='medie',t:'Le medie',x:'Primo giorno di scuola media: un professore per ogni materia, corridoi enormi e ragazzi di terza altissimi.',c:[
  {l:'Ti siedi vicino a qualcuno che non conosci',pers:{E:2,O:1},r:'Diventa il tuo compagno di banco per tre anni.'},
  {l:'Cerchi i compagni delle elementari',pers:{A:1,E:-1},r:'Fate gruppo in un angolo. Al sicuro.'},
  {l:'Ti perdi nei corridoi',pers:{N:1},r:'Arrivi in classe con dieci minuti di ritardo. Il prof di matematica ti guarda da sopra gli occhiali.'}]});
ev({id:'bim_bigliettino',min:10,max:12,once:1,t:'Il bigliettino',x:'Ti arriva un bigliettino piegato in quattro: «Ti piaccio? Sì / No / Forse».',c:[
  {l:'Barri «Sì»',e:{f:4},pers:{E:1,O:1},r:'Il giorno dopo vi tenete per mano all\'uscita. Per una settimana è amore.'},
  {l:'Barri «Forse»',pers:{N:1},r:'La risposta più diplomatica della storia della scuola.'},
  {l:'Lo strappi',pers:{A:-1,E:-1},r:'Il bigliettino finisce nel cestino. Chi l\'ha scritto ci resta male.'}]});
ev({id:'bim_chat_classe',min:12,max:13,once:1,cond:()=>S.anno>=2013,t:'Il gruppo della classe',x:'Nel gruppo della classe sul telefono girano prese in giro su un compagno.',c:[
  {l:'Scrivi che non è divertente',pers:{A:2,N:-1},r:'Qualcuno ti dà ragione. Il gruppo si calma.'},
  {l:'Mandi una risata anche tu',pers:{A:-2},r:'Lui legge tutto. A scuola non ti guarda più.'},
  {l:'Lo scrivi ai prof, di nascosto',pers:{C:2,E:-1},r:'I prof ne parlano in classe. Nessuno sa che sei stat{o} tu.'}]});
ev({id:'bim_prof_mate',min:11,max:13,once:1,cond:()=>scuolaDi()==='medie',t:'La prof di matematica',x:'La professoressa di matematica è la più severa della scuola. Domani c\'è la verifica.',c:[
  {l:'Studi fino a tardi',e:{voto:4},pers:{C:2,N:1},r:'Sette e mezzo. La prof ti guarda con rispetto.'},
  {l:'Chiedi aiuto a un compagno bravo',e:{voto:2},pers:{E:1,A:1},r:'Studiare in due funziona. Vi salvate entrambi.'},
  {l:'Ti rassegni al quattro',e:{voto:-3},pers:{C:-2},r:'Quattro. Era una profezia.'}]});
ev({id:'bim_grest',min:6,max:11,once:1,t:'Il centro estivo',x:'Estate all\'oratorio: giochi, gite in piscina e una squadra con un colore.',c:[
  {l:'Diventi capo della tua squadra',e:{f:4},pers:{E:2,C:1},r:'I gialli vincono il torneo finale. Merito tuo, e di un rigore fortunato.'},
  {l:'Fai amicizia con gli animatori',pers:{E:1,A:1},r:'Gli animatori ti sembrano adulti fantastici. Hanno sedici anni.'},
  {l:'Ti nascondi a leggere all\'ombra',pers:{E:-1,O:1},r:'Il tuo posto segreto dietro la chiesa. Libri e ghiaccioli.'}]});
ev({id:'bim_oratorio',min:8,max:12,once:1,t:'Il campetto',x:'Al campetto dell\'oratorio i ragazzi più grandi non vi fanno mai giocare.',c:[
  {l:'Sfidate i grandi a una partita',p:.3,si:{e:{f:6,sport:2},pers:{E:2,N:-1},r:'Vincete 3 a 2. Il campetto, il martedì, ora è vostro.'},no:{e:{f:-2,sport:1},pers:{E:1},r:'Perdete 10 a 1. Ma ora vi rispettano.'}},
  {l:'Chiedete al parroco di fare i turni',pers:{C:1,A:1},r:'Il parroco appende un foglio con gli orari. Giustizia è fatta.'},
  {l:'Giocate in cortile',pers:{A:1},r:'Le porte sono due zaini. Funziona benissimo.'}]});
ev({id:'bim_presepe_vivente',min:7,max:10,once:1,t:'Il presepe vivente',x:'In paese si fa il presepe vivente e ti hanno scelto come pastorello.',c:[
  {l:'Interpreti il ruolo con serietà',pers:{C:2},r:'Due ore immobile con una pecora vera. Professionalità assoluta.'},
  {l:'Fai ridere i visitatori',e:{f:3},pers:{E:2,C:-1},r:'Saluti tutti, fai le facce. Il pastorello più fotografato.'},
  {l:'Ti affezioni alla pecora',pers:{A:2},r:'Vuoi portarla a casa. La pecora sembra d\'accordo, il pastore vero no.'}]});
ev({id:'bim_halloween',min:6,max:11,once:1,t:'Dolcetto o scherzetto',x:'La sera di Halloween si gira per il palazzo travestiti.',c:[
  {l:'Il travestimento più spaventoso',e:{f:3},pers:{O:2,E:1},r:'Una signora del secondo piano grida davvero. Bottino: due chili di caramelle.'},
  {l:'Fai gli scherzetti a chi non apre',pers:{A:-2,E:1},r:'Carta igienica sulla porta del signore del terzo. Lui sa chi sei.'},
  {l:'Dividi le caramelle con i più piccoli',pers:{A:2},r:'Un bambino più piccolo del palazzo ti considera un eroe.'}]});
ev({id:'bim_scacchi',min:7,max:11,once:1,cond:()=>!!nonnoV(),t:'Gli scacchi del nonno',x:d=>{const n=nonnoV();return `${n?n.nome:'Il nonno'} tira fuori una vecchia scacchiera di legno: «Ti insegno.»`},c:[
  {l:'Studi ogni mossa',e:{i:3},pers:{C:2,O:1},fx:()=>{const n=nonnoV();if(n)n.rapporto=clamp(n.rapporto+5)},r:'Dopo un anno lo batti. Lui finge di essere arrabbiato, ma è orgoglioso.'},
  {l:'Muovi i pezzi a caso per vedere cosa succede',pers:{O:1,C:-1},r:'Il cavallo che va a zig zag ti piace moltissimo.'},
  {l:'Preferisci le carte',pers:{E:1},fx:()=>{const n=nonnoV();if(n)n.rapporto=clamp(n.rapporto+3)},r:'Il nonno ti insegna scopa e briscola. E a barare un pochino.'}]});
ev({id:'bim_castello_letto',min:6,max:10,once:1,cond:()=>vivi(['Fratello']).some(f=>f.eta<18),t:'Il letto a castello',x:d=>{const f=vivi(['Fratello']).find(x=>x.eta<18);return `Nella cameretta arriva un letto a castello. Tu e ${f.nome} volete entrambi quello di sopra.`},c:[
  {l:'Lo vinci a testa o croce',pers:{O:1},fx:()=>{const f=vivi(['Fratello']).find(x=>x.eta<18);if(f)f.rapporto=clamp(f.rapporto-1)},r:'La fortuna è dalla tua. Per ora.'},
  {l:'Lo lasci a lui o lei',pers:{A:2},fx:()=>{const f=vivi(['Fratello']).find(x=>x.eta<18);if(f)f.rapporto=clamp(f.rapporto+4)},r:'Dal basso si chiacchiera benissimo, la sera, al buio.'},
  {l:'Litigate finché decide la mamma',pers:{A:-2,N:1},fx:()=>{const f=vivi(['Fratello']).find(x=>x.eta<18);if(f)f.rapporto=clamp(f.rapporto-3)},r:'Turni di un mese a testa. Un trattato di pace firmato a malincuore.'}]});
ev({id:'bim_tavola',min:8,max:12,once:1,t:'Apparecchiare',x:'Da oggi tocca a te apparecchiare e sparecchiare la tavola tutte le sere.',c:[
  {l:'Lo fai ogni sera, senza storie',pers:{C:3},r:'Diventi velocissim{o}. Le forchette a sinistra, sempre.'},
  {l:'Lo fai quando te lo ricordano',pers:{C:-1},r:'Te lo ricordano. Ogni sera.'},
  {l:'Contratti: lo fai in cambio della paghetta',pers:{O:1,A:-1},fx:()=>soldi(P(5)),r:'Un accordo sindacale in piena regola.'}]});
ev({id:'bim_tema_famiglia',min:8,max:10,once:1,t:'Il tema sulla famiglia',x:'Il compito per domani: «Descrivi la tua famiglia».',c:[
  {l:'Racconti la verità, con tutti i difetti',e:{i:1},pers:{O:1,A:-1},r:'La maestra ride tantissimo. I tuoi un po\' meno, al colloquio.'},
  {l:'Scrivi solo le cose belle',pers:{A:2},r:'Una famiglia da pubblicità. La maestra mette «Brav{o}» e un cuore.'},
  {l:'Inventi una famiglia da film',e:{arte:2},pers:{O:3},r:'Tuo padre è un astronauta, tua madre una spia. Otto in fantasia.'}]});

/* ---------- Adolescenza: scuola, corpo, sacramenti ---------- */
ev({id:'rag_cresima',link:1,t:'La cresima',x:'Tocca alla cresima. Serve un padrino o una madrina che ti accompagni.',c:[
  {l:'Scegli uno zio o una zia',cond:()=>vivi(['Zio']).length>0,pers:{A:1},fx:()=>{const z=vivi(['Zio'])[0];z.rapporto=clamp(z.rapporto+8);ricorda(z,'L\'hai scelt'+gp(z,'o','a')+' per la cresima');const x=P(r(100,300));soldi(x);return [`${z.nome} si commuove. Il regalo è una busta da ${eur(x)} e una promessa: «Per qualsiasi cosa, ci sono.»`,'g']}},
  {l:'Scegli un nonno',cond:()=>!!nonnoV(),pers:{A:1},fx:()=>{const n=nonnoV();n.rapporto=clamp(n.rapporto+8);mod('felicita',4);return [`${n.nome} si mette il vestito buono. Non l'hai mai vist${gp(n,'o','a')} così fier${gp(n,'o','a')}.`,'g']}},
  {l:'Dici che non ci credi più',pers:{O:2,A:-1},fx:()=>{relGenitori(-4);return ['Discussione lunga in famiglia. Alla fine decidi tu: niente cresima.','']}},
  {l:'Lo fai per i tuoi, senza troppo entusiasmo',pers:{A:1},fx:()=>{const x=P(r(100,250));soldi(x);relGenitori(2);return [`Una mattinata in chiesa e un pranzo con i parenti. Buste per ${eur(x)}.`,'']}}]});
ev({id:'rag_terza_media',min:13,max:14,once:1,w:1.4,cond:()=>scuolaDi()==='medie',t:'L\'esame di terza media',x:'Ultimo anno delle medie: scritti, prova di matematica e il colloquio orale con la tesina.',c:[
  {l:'Prepari una tesina originale',e:{voto:4,i:2},pers:{O:2,C:1},r:'Colleghi la Divina Commedia ai videogiochi. La commissione è colpita.'},
  {l:'Studi tutto con metodo',e:{voto:5},pers:{C:2,N:1},r:'Otto. Un risultato solido, costruito pagina dopo pagina.'},
  {l:'Vai all\'orale e improvvisi',p:.5,si:{e:{voto:2},pers:{E:1,C:-1},r:'Parli per dieci minuti senza fermarti. Funziona.'},no:{e:{voto:-3},pers:{N:1,C:-1},r:'Il prof di storia ti fa una domanda sola. Quella che non sapevi.'}}]});
ev({id:'rag_debito',min:14,max:17,once:1,cond:()=>scuolaDi()==='superiori'&&S.scuola.voto<55,t:'Il debito',x:'Pagella di giugno: debito in matematica. A fine agosto c\'è l\'esame di riparazione.',c:[
  {l:'Studi tutta l\'estate',e:{voto:6,f:-3},pers:{C:3},r:'Esame superato. Hai visto il mare tre volte, ma ne valeva la pena.'},
  {l:'Prendi ripetizioni',cond:()=>S.classe!=='umile',fx:()=>soldi(-Math.min(S.soldi,P(150))),e:{voto:5},pers:{C:1},r:'Un universitario paziente ti spiega le equazioni in un modo nuovo. Superato.'},
  {l:'Ti ricordi del debito il 20 agosto',p:.4,si:{e:{voto:1},pers:{C:-1},r:'Una settimana di panico, e lo passi per un pelo.'},no:{e:{voto:-4,f:-5},pers:{C:-1,N:2},r:'Non lo passi. Si ripete l\'anno.'}}]});
ev({id:'rag_clima',min:15,max:17,once:1,cond:()=>S.anno>=2019&&iscritto(),t:'Lo sciopero per il clima',x:'Venerdì c\'è lo sciopero degli studenti per il clima. Mezza scuola va in piazza.',c:[
  {l:'Vai in piazza con un cartello fatto a mano',e:{f:3,k:2},pers:{O:2,E:1},r:'Migliaia di ragazzi, un cartello che fa ridere e pensare. Ti senti parte di qualcosa.'},
  {l:'Vai, ma soprattutto per saltare la verifica',pers:{C:-1,E:1},r:'Bella giornata. La verifica è solo rimandata a lunedì.'},
  {l:'Resti in classe',pers:{C:1,O:-1},r:'In classe siete in sei. Il prof fa lezione lo stesso.'}]});
ev({id:'rag_alternanza',min:16,max:17,once:1,cond:()=>S.anno>=2016&&scuolaDi()==='superiori',t:'L\'alternanza scuola-lavoro',x:'Tre settimane di alternanza scuola-lavoro in un\'azienda della zona.',c:[
  {l:'Ti fai notare per l\'impegno',pers:{C:3,E:1},r:'Ti offrono di tornare d\'estate. Primo contatto con il mondo del lavoro.'},
  {l:'Fai fotocopie per tre settimane',pers:{N:1},r:'Diventi espert{o} di fotocopiatrici. Non era il piano.'},
  {l:'Chiedi di fare qualcosa di vero',p:.55,si:{e:{i:2},pers:{E:2,O:1},r:'Ti affiancano a un tecnico. Impari più lì che in un anno di teoria.'},no:{pers:{E:1},r:'«Intanto inizia da qui.» E ti indicano la fotocopiatrice.'}}]});
ev({id:'rag_gruppo',min:14,max:17,once:1,cond:()=>iscritto(),t:'Il lavoro di gruppo',x:'Lavoro di gruppo per la presentazione di storia. Uno dei quattro non fa niente.',c:[
  {l:'Lo fai presente al prof',pers:{C:2,A:-2},r:'Il prof lo valuta a parte. Il gruppo ti è grato, lui no.'},
  {l:'Fai tu anche la sua parte',e:{voto:2},pers:{A:2,N:1},r:'Nove a tutti. Anche a lui. Ti brucia un po\'.'},
  {l:'Gli parli e lo coinvolgi',pers:{E:1,A:1},r:'Non sapeva da dove iniziare. Alla fine prepara le slide più belle.'}]});
ev({id:'rag_palestra',min:15,max:17,once:1,t:'La palestra',x:'Gli amici si sono iscritti in palestra e parlano solo di allenamenti e proteine.',c:[
  {l:'Ti iscrivi anche tu',fx:()=>{soldi(-Math.min(S.soldi,P(40)));S.bis.forma=clamp(S.bis.forma+5)},e:{sport:2},pers:{C:2},r:'Tre volte a settimana. Dopo due mesi le scale non ti fanno più paura.'},
  {l:'Preferisci correre al parco, gratis',e:{sport:2},pers:{O:1,E:-1},r:'Le cuffie, il parco, i tuoi pensieri. Ti basta.'},
  {l:'Ti metti a dieta per sembrare come loro',e:{s:-2},pers:{N:2},r:'Salti la merenda per un mese e sei sempre di cattivo umore. Non ne vale la pena.'}]});
ev({id:'rag_brufolo',min:13,max:15,once:1,t:'Il brufolo',x:'Sabato c\'è la festa e stamattina, in mezzo alla fronte, è comparso un brufolo enorme.',c:[
  {l:'Vai alla festa e chi se ne importa',e:{f:3},pers:{N:-2,E:1},r:'Nessuno lo nota. O tutti fanno finta, che è uguale.'},
  {l:'Provi a coprirlo',pers:{N:1},r:'Lo copri benissimo. Ci pensi tutta la sera.'},
  {l:'Resti a casa',e:{f:-2},pers:{N:2,E:-1},r:'Il lunedì scopri che la festa era bellissima.'}]});
ev({id:'rag_motorino_rubato',min:14,max:17,once:1,cond:()=>S.veicoli.some(v=>/Scooter/.test(v.n)),t:'Il motorino',x:'Esci da scuola e il tuo scooter non c\'è più. Rubato.',c:[
  {l:'Fai la denuncia con i tuoi',pers:{C:2},r:'Dopo tre settimane la polizia lo ritrova in periferia, senza specchietti. Ma è tuo.'},
  {l:'Lo cerchi da sol{o} per tutto il quartiere',pers:{O:1,N:-1},r:'Lo trovi due vie più in là, appoggiato a un muro. Qualcuno l\'ha usato e mollato.'},
  {l:'Ti disperi',e:{f:-5},pers:{N:2},r:'Torni a piedi per mesi. I tuoi dicono che lo ricomprerete «quando ci sarà l\'occasione».'}]});
ev({id:'rag_ripetizioni',min:15,max:17,once:1,cond:()=>S.scuola.voto>=65,t:'Le ripetizioni',x:'Una vicina ti chiede di dare ripetizioni di matematica a suo figlio di terza media.',c:[
  {l:'Accetti e ti impegni',fx:()=>soldi(P(r(150,300))),pers:{C:2,A:1},r:'Il ragazzino passa da cinque a sette. Tu guadagni i tuoi primi soldi e un po\' di orgoglio.'},
  {l:'Accetti, ma lo fai giocare alla console',fx:()=>soldi(P(100)),pers:{C:-2,E:1},r:'Diventate amici. Il suo voto in matematica no.'},
  {l:'Non hai la pazienza',pers:{A:-1},r:'Rifiuti gentilmente. Insegnare non fa per te, almeno per ora.'}]});
ev({id:'rag_like',min:13,max:16,once:1,cond:()=>S.anno>=2011,t:'I like',x:'Hai pubblicato una foto. Dopo un\'ora ha solo tre like. Quella della tua amica ne ha centocinquanta.',c:[
  {l:'La cancelli',pers:{N:2},r:'Ne pubblichi un\'altra, più studiata. Ventisei like. Non ti senti meglio.'},
  {l:'Chi se ne importa',pers:{N:-2,O:1},r:'La foto era bella. Lo sai tu.'},
  {l:'Lasci il telefono ed esci',e:{f:2},pers:{N:-1,E:1},r:'Un pomeriggio vero, senza notifiche. Ti ricordi com\'era.'}]});
ev({id:'rag_amicizia_finita',min:14,max:17,once:1,cond:()=>vivi(['Amico']).length>0,t:'Strade diverse',x:d=>{const a=vivi(['Amico']).sort((x,y)=>y.rapporto-x.rapporto)[0];d.q=a.id;return `Tu e ${a.nome} eravate inseparabili. Da quando avete cambiato scuola vi vedete sempre meno.`},c:[
  {l:'Lo cerchi tu, ogni settimana',pers:{A:2,C:1},fx:d=>{const a=S.relazioni.find(x=>x.id===d.q);if(a){a.rapporto=clamp(a.rapporto+10);ricorda(a,'Non vi siete persi di vista')}},r:'Il sabato pomeriggio è sacro. L\'amicizia regge.'},
  {l:'Lasci che le cose vadano',pers:{O:1},fx:d=>{const a=S.relazioni.find(x=>x.id===d.q);if(a)a.rapporto=clamp(a.rapporto-15)},r:'Succede. Vi salutate per strada con affetto, e un po\' di nostalgia.'},
  {l:'Ci rimani male e gliene parli',pers:{E:1,N:1},fx:d=>{const a=S.relazioni.find(x=>x.id===d.q);if(a)a.rapporto=clamp(a.rapporto+4)},r:'Vi dite le cose come stanno. Un po\' imbarazzante, ma vi riavvicina.'}]});
ev({id:'rag_diciottesimo',min:17,max:17,once:1,cond:()=>vivi(['Amico']).length>0,t:'Il diciottesimo di un amico',x:'Un amico festeggia i diciotto anni in una villa in campagna. Il regalo si fa con una colletta: cinquanta euro a testa.',c:[
  {l:'Partecipi e balli fino all\'alba',fx:()=>soldi(-Math.min(S.soldi,P(50))),e:{f:5},pers:{E:2},r:'Torni alle cinque, con le scarpe in mano. Una festa che ricorderai a lungo.'},
  {l:'Vai, ma torni presto',fx:()=>soldi(-Math.min(S.soldi,P(50))),pers:{C:1},r:'Torta, foto e un saluto prima di mezzanotte. Equilibrio.'},
  {l:'Non puoi permettertelo e non vai',e:{f:-3},pers:{N:1,E:-1},r:'Vedi le foto il giorno dopo. Ti dici che non importa.'}]});
ev({id:'rag_lettera',min:15,max:17,once:1,cond:()=>iscritto(),t:'Una lettera a te stess{o}',x:'La prof di italiano vi chiede di scrivere una lettera a voi stessi tra dieci anni. La terrà lei.',c:[
  {l:'Scrivi i tuoi sogni più grandi',pers:{O:2,E:1},fut:[10,'lettera_ritorno'],r:'Tre pagine fitte. Le sigilli nella busta con un po\' di imbarazzo.'},
  {l:'Scrivi le tue paure',pers:{N:1,O:1},fut:[10,'lettera_ritorno'],r:'Paure che non avevi mai scritto. Metterle nero su bianco le rende più piccole.'},
  {l:'Scrivi due righe e basta',pers:{C:-1},r:'«Ciao, spero tu stia bene.» Essenziale.'}]});
ev({id:'lettera_ritorno',link:1,t:'Una lettera dal passato',x:d=>`Nella buca delle lettere c'è una busta scritta con la tua calligrafia di quando avevi ${S.eta-10} anni. La prof l'ha conservata per dieci anni.`,c:[
  {l:'La leggi subito',pers:{O:1},fx:()=>{const ok=(S.aspOk||[]).length>0||S.felicita>=65;mod('felicita',ok?6:-2);if(!ok)futuro(5,'lettera_promessa',{});return ok?['Rileggi i sogni di allora. Qualcuno l\'hai realizzato davvero. Sorridi per tutta la sera.','g']:['Rileggi i sogni di allora. Sono ancora lì, quasi tutti da realizzare. Ti fai una promessa.','']}},
  {l:'La rileggi insieme a un amico',cond:()=>vivi(['Amico']).length>0,pers:{E:1},fx:()=>{const a=pick(vivi(['Amico']));a.rapporto=clamp(a.rapporto+5);mod('felicita',4);return [`Tu e ${a.nome} ridete e vi commuovete. Era un\'altra vita.`,'g']}},
  {l:'La metti in un cassetto senza aprirla',pers:{N:1},r:'Non sei ancora pront{o}. Un giorno la aprirai.'}]});
ev({id:'lettera_promessa',link:1,t:'La promessa',x:'Cinque anni fa, rileggendo la lettera di quando eri ragazz{o}, ti eri fatt{o} una promessa. A che punto sei?',c:[
  {l:'Fai finalmente quel passo',pers:{O:2,C:2},fx:()=>{mod('felicita',8);S.bis.stress=clamp(S.bis.stress+4);return ['Cambi qualcosa di importante. Il ragazzo che eri sarebbe fiero di te.'.replace('Il ragazzo che eri sarebbe fiero',g('Il ragazzo che eri sarebbe fiero','La ragazza che eri sarebbe fiera')),'g']}},
  {l:'Accetti che i sogni cambino',pers:{N:-2,A:1},fx:()=>{mod('felicita',3);return ['Non sei la persona che immaginavi. Sei un\'altra, e va bene così.','g']}},
  {l:'Rimandi ancora',pers:{N:1},fx:()=>{mod('felicita',-3);return ['Un\'altra volta. Forse.','b']}}]});
ev({id:'rag_agonismo',min:13,max:16,once:1,cond:()=>rOre('sport')>=3||S.abil.sport>=50,t:'Agonismo',x:'L\'allenatore ti vuole nella squadra agonistica: allenamenti quattro volte a settimana e gare la domenica.',c:[
  {l:'Accetti',e:{sport:6,f:3},pers:{C:3,E:1},fx:()=>{S.bis.energia=clamp(S.bis.energia-8)},r:'Sveglie all\'alba, trasferte in pullman, medaglie e sconfitte. Cresci tantissimo.'},
  {l:'Preferisci giocare per divertimento',e:{f:2},pers:{O:1,C:-1},r:'Resti nel gruppo del giovedì. Lo sport resta una gioia, non un dovere.'},
  {l:'Chiedi consiglio ai tuoi',pers:{A:1},fx:()=>relGenitori(3),r:'Ne parlate a cena. Decidete di provare per un anno.'}]});
ev({id:'rag_marinare',min:14,max:17,once:1,cond:()=>scuolaDi()==='superiori',t:()=>`${cap(marinare())}`,x:()=>`Gli amici ti propongono di ${marinare()} domani: c'è la verifica di latino e c'è il sole.`,c:[
  {l:'Ci stai: giornata al parco',p:.7,si:{e:{f:4,voto:-2},pers:{C:-2,E:1},r:'Una giornata perfetta. La giustificazione la firmi tu, con una calligrafia molto adulta.'},no:{e:{f:-3,voto:-2},fx:()=>relGenitori(-6),pers:{C:-1,N:1},r:'Vi becca tua zia mentre passa in macchina. A casa ti aspettano.'}},
  {l:'Vai a scuola',e:{voto:2},pers:{C:2},r:'In classe siete in otto. La verifica è più facile del previsto.'},
  {l:'Convinci tutti a rimandare a dopo la verifica',pers:{E:1,C:1},r:'Il compromesso perfetto: verifica fatta, pomeriggio al lago.'}]});
ev({id:'rag_firma',min:14,max:17,once:1,cond:()=>iscritto(),t:'La firma',x:'Un brutto voto da far firmare sul libretto. Tua madre ha una firma facilissima da imitare.',c:[
  {l:'Fai firmare e ascolti la predica',pers:{C:2,A:1},fx:()=>relGenitori(1),r:'La predica dura dieci minuti. Ti senti stranamente più legger{o}.'},
  {l:'La falsifichi',p:.6,si:{pers:{C:-2,A:-1},r:'Perfetta. Da domani mezza classe ti chiede di firmare al posto dei genitori.'},no:{fx:()=>relGenitori(-6),e:{voto:-2},pers:{C:-1,N:2},r:'Il prof chiama a casa. È stata la serata più lunga della tua adolescenza.'}},
  {l:'Recuperi il voto prima di dirlo',e:{voto:3},pers:{C:2,N:1},r:'Con l\'otto della settimana dopo, il quattro fa meno paura.'}]});
ev({id:'rag_piercing',min:15,max:17,once:1,t:'Il piercing',x:'Vuoi fare un piercing al naso. I tuoi hanno detto di no, tre volte.',c:[
  {l:'Lo fai di nascosto',p:.5,si:{e:{f:4},pers:{O:2,A:-1},r:'Per un mese lo nascondi con un cerotto. Poi te ne dimentichi e lo vedono. Ormai è fatto.'},no:{e:{f:-2,s:-2},pers:{O:1,N:1},r:'Si infiamma. Il medico ti consiglia di toglierlo. Ti resta un puntino.'}},
  {l:'Aspetti i diciotto anni',pers:{C:2},r:'A diciotto anni non ti interessa più. Succede.'},
  {l:'Contratti: orecchino sì, naso no',pers:{A:1,O:1},fx:()=>relGenitori(2),r:'Un secondo foro all\'orecchio. Pace in famiglia.'}]});
ev({id:'rag_capelli',min:14,max:17,once:1,t:'I capelli blu',x:'Vorresti tingerti i capelli di blu elettrico.',c:[
  {l:'Lo fai, con un\'amica, in bagno',e:{f:3},pers:{O:3,E:1},r:'Il risultato è più verde che blu. Lo adori lo stesso. La vasca un po\' meno.'},
  {l:'Solo una ciocca',pers:{O:1,C:1},r:'Una ciocca blu dietro l\'orecchio. Si vede solo quando vuoi tu.'},
  {l:'Lasci perdere',pers:{O:-1},r:'I tuoi capelli restano i tuoi capelli.'}]});
ev({id:'rag_discoteca',min:14,max:16,once:1,t:'La discoteca del pomeriggio',x:'Domenica c\'è la discoteca pomeridiana per ragazzi, dalle tre alle sette.',c:[
  {l:'Vai e balli tutto il pomeriggio',e:{f:4},pers:{E:2},r:'Musica a palla, luci colorate, analcolici e un lento imbarazzantissimo.'},
  {l:'Vai, ma resti appoggiat{o} al muro',pers:{E:-1,N:1},r:'Guardi gli altri ballare. La prossima volta, forse.'},
  {l:'Preferisci un pomeriggio con pochi amici',pers:{E:-1,A:1},r:'Pizza e film da qualcuno. Si parla di più.'}]});
ev({id:'rag_presenta',min:15,max:17,once:1,cond:()=>!!partnerAttuale(),t:'Lo presenti ai tuoi?',x:d=>{const p=partnerAttuale();return `State insieme da qualche mese. ${p.nome} chiede quando conoscerà i tuoi.`},c:[
  {l:'Domenica a pranzo',pers:{E:1,A:1},fx:()=>{const p=partnerAttuale();relGenitori(2);p.rapporto=clamp(p.rapporto+6);return [`Tuo padre fa domande da interrogatorio, tua madre tira fuori le foto di quando eri piccol${g('o','a')}. ${p.nome} sopravvive.`,'g']}},
  {l:'Un saluto veloce sulla porta',pers:{N:1},fx:()=>{const p=partnerAttuale();p.rapporto=clamp(p.rapporto+2)},r:'«Piacere», «Piacere». Cinque secondi. Il resto, un\'altra volta.'},
  {l:'Rimandi: è troppo presto',pers:{E:-1},fx:()=>{const p=partnerAttuale();p.rapporto=clamp(p.rapporto-4)},r:'Ci resta un po\' male. Capisce, o almeno ci prova.'}]});
ev({id:'rag_tema_ia',min:14,max:17,once:1,cond:()=>S.anno>=2023&&iscritto(),t:'Il tema scritto dal computer',x:'Il tema per domani: un programma di intelligenza artificiale potrebbe scriverlo in dieci secondi.',c:[
  {l:'Lo scrivi tu, parola per parola',e:{voto:2,i:2},pers:{C:2},r:'Ci metti due ore. È tuo, con tutti i difetti. Sette e mezzo.'},
  {l:'Lo fai scrivere al programma',p:.5,si:{e:{voto:1},pers:{C:-2},r:'Otto. Il prof scrive: «Stile insolitamente maturo».'},no:{e:{voto:-4},pers:{C:-1,N:1},r:'Il prof se ne accorge subito: tre per tutti quelli con lo stesso tema.'}},
  {l:'Lo usi per farti spiegare l\'argomento, poi scrivi',e:{voto:3,i:1},pers:{O:2,C:1},r:'Impari più del solito, e il tema è tutto tuo.'}]});
ev({id:'rag_poesie',min:14,max:17,once:1,t:'Il quaderno',x:'Da qualche mese scrivi poesie su un quaderno che nessuno ha mai visto.',c:[
  {l:'Le fai leggere alla prof di italiano',e:{arte:3},pers:{E:1,O:2},r:'Ti propone di partecipare a un concorso. Arrivi terz{o}.'},
  {l:'Le tieni solo per te',e:{arte:2},pers:{E:-1,O:1},r:'Il quaderno si riempie. Un giorno lo rileggerai.'},
  {l:'Le pubblichi con uno pseudonimo',cond:()=>S.anno>=2010,e:{arte:2,f:2},pers:{O:2},r:'Qualche sconosciuto le apprezza. Nessuno sa che sei tu.'}]});
ev({id:'rag_campestre',min:13,max:15,once:1,cond:()=>iscritto(),t:'La campestre',x:'C\'è la corsa campestre provinciale. Il prof di educazione fisica ti ha iscritt{o}.',c:[
  {l:'Corri al massimo',p:()=>.3+S.abil.sport/150,si:{e:{f:5,sport:3},pers:{C:1,N:-1},r:'Arrivi tra i primi dieci. Il prof ti appende in bacheca.'},no:{e:{sport:2},pers:{N:1},r:'Il fango e la salita ti tagliano le gambe. Arrivi, comunque.'}},
  {l:'Corri insieme a un amico, chiacchierando',e:{f:2,sport:1},pers:{A:1,E:1},r:'Ultimi della vostra categoria, primi per divertimento.'},
  {l:'Ti inventi un mal di pancia',pers:{C:-2},r:'Il prof non ci crede, ma ti lascia stare. Per quest\'anno.'}]});
ev({id:'rag_film_vietato',min:13,max:14,once:1,t:'Il film vietato',x:'Gli amici vogliono vedere un film horror vietato ai minori di quattordici anni.',c:[
  {l:'Lo guardi con loro, di nascosto',pers:{O:1,C:-1},r:'Fai il dur{o} per due ore. Per una settimana dormi con la luce accesa.'},
  {l:'Dici che preferisci un altro film',pers:{N:1,C:1},r:'Ti prendono in giro un po\'. Poi qualcuno ti dà ragione.'},
  {l:'Lo guardi e ridi degli effetti speciali',pers:{N:-2,E:1},r:'Il mostro è fatto malissimo. Lo fai notare ogni cinque minuti.'}]});
