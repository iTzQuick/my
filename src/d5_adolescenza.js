/* ================= ADOLESCENZA (13–17): CHI DIVENTI ================= */
const amicoV=()=>pick(vivi(['Amico']).filter(p=>!p.cella));
const genV=()=>pick(famG());

/* ---------- Identità ---------- */
ev({id:'ado_look',min:13,max:16,once:1,t:'Allo specchio',x:'Ti guardi allo specchio e non ti piaci per niente.',c:[
  {l:'Cambi look da capo a piedi',e:{f:3,a:2},pers:{O:2,E:1},r:'Capelli nuovi, vestiti nuovi. In classe ci mettono una settimana a riconoscerti.'},
  {l:'Inizi ad allenarti tutti i giorni',e:{sport:3,s:2},pers:{C:2},r:'Dopo due mesi ti senti meglio, e non solo allo specchio.'},
  {l:'Ti chiudi in camera e non esci',e:{f:-4},pers:{N:3,E:-2},r:'Un weekend intero sotto le coperte.'},
  {l:'Ne parli con qualcuno di cui ti fidi',fx:()=>{const p=genV()||amicoV();if(p){p.rapporto=clamp(p.rapporto+5);cambiaPers('N',-2);return [`${p.nome} ti ascolta e ti dice una cosa che non dimenticherai: «Sei molto di più di quello che vedi».`,'g']}cambiaPers('N',1);return ['Non sai con chi parlarne.','']}}]});
ev({id:'ado_musica',min:13,max:16,once:1,t:'La tua musica',x:'Scopri un genere musicale che nessuno dei tuoi amici ascolta.',c:[
  {l:'Diventa la tua ossessione',e:{musica:3,f:2},pers:{O:3,E:-1},r:'Conosci a memoria ogni disco. Ti senti diverso da tutti, e ti piace.'.replace('diverso','divers{o}')},
  {l:'Lo fai ascoltare a tutti',e:{f:2},pers:{E:2,O:1},r:'Metà della classe ora lo ascolta. L\'altra metà ti odia.'},
  {l:'Torni ad ascoltare quello che ascoltano gli altri',pers:{O:-2,A:1},r:'Meglio non sembrare strani.'}]});
ev({id:'ado_valori',min:14,max:17,once:1,t:'La manifestazione',x:'Gli studenti scendono in piazza per il clima. La tua classe si divide.',c:[
  {l:'Vai e porti anche un cartello',e:{f:2,k:2},pers:{O:2,E:2},r:'Urli slogan per tre ore. Torni senza voce e con nuovi amici.'},
  {l:'Resti in classe: c\'è la verifica',e:{voto:2},pers:{C:2,O:-1},r:'Unico in aula con altri tre. Prendi otto.'.replace('Unico','Unic{o}')},
  {l:'Ne approfitti per stare al parco',e:{f:2},pers:{C:-2},r:'Nessuno controlla. Una mattina di sole.'}]});
ev({id:'ado_veg',min:14,max:17,once:1,t:'Il documentario',x:'Guardi un documentario sugli allevamenti intensivi.',c:[
  {l:'Diventi vegetariano',fx:()=>{S.fatti.veg=1;cambiaPers('O',2);cambiaPers('A',1);cambiaPers('C',1);famG().forEach(p=>p.rapporto=clamp(p.rapporto-1));return [`Diventi vegetarian${g('o','a')}. Il nonno non si dà pace.`,'']}},
  {l:'Ci pensi per una settimana e poi dimentichi',pers:{C:-1},r:'La carbonara ha vinto.'},
  {l:'Inizi a informarti su tutto',e:{i:2},pers:{O:3},r:'Passi le notti a leggere articoli e statistiche.'}]});
ev({id:'ado_fede',min:13,max:16,once:1,t:'Domande grandi',x:'Una sera, senza motivo, ti chiedi che senso abbia tutto.',c:[
  {l:'Ne parli con un adulto di cui ti fidi',fx:()=>{const p=genV()||nonnoV();if(p)p.rapporto=clamp(p.rapporto+5);cambiaPers('N',-1);cambiaPers('A',1);return ['Non trovi tutte le risposte, ma ti senti meno sol'+g('o','a')+'.','g']}},
  {l:'Ti metti a leggere filosofia',e:{i:3},pers:{O:3,E:-1},r:'Platone, Nietzsche e un fumetto sull\'esistenzialismo.'},
  {l:'Lo scrivi in una poesia',e:{arte:3},pers:{O:2,N:1},r:'Una poesia che non farai leggere a nessuno.'},
  {l:'Scacci il pensiero e guardi una serie',pers:{O:-1},r:'Domani c\'è scuola.'}]});
ev({id:'ado_corpo',min:13,max:15,once:1,t:'Lo spogliatoio',x:'Nello spogliatoio qualcuno fa una battuta pesante sul tuo corpo.',c:[
  {l:'Rispondi a tono',p:.6,si:{e:{f:2},pers:{N:-2,A:-1},r:'Risata generale. Non ci riproverà.'},no:{e:{f:-3},pers:{N:1},r:'La tua risposta non fa ridere nessuno.'}},
  {l:'Fai finta di niente',e:{f:-2},pers:{N:2,E:-1},r:'Ci ripensi per giorni.'},
  {l:'Lo dici al professore',pers:{C:1,A:-1},r:'Il ragazzo viene ripreso. Qualcuno ti dà del delatore.'}]});

/* ---------- Amicizie e amori ---------- */
ev({id:'ado_compagnia',min:13,max:15,once:1,w:1.3,t:'La compagnia',x:'All\'inizio delle superiori si formano i gruppi. Due ti vogliono.',c:[
  {l:'I ragazzi popolari',fx:()=>{nuovoAmico();cambiaPers('E',2);cambiaPers('A',-1);mod('felicita',3);return [`Feste, ${S.anno>=2008?'chat di gruppo':'telefonate interminabili'} e sabati in centro. Devi sempre essere all'altezza.`,'g']}},
  {l:'Il gruppo dei nerd',fx:()=>{nuovoAmico();cambiaPers('O',2);S.abil.tech=clamp(S.abil.tech+3);return ['Giochi di ruolo, film di fantascienza e battute che capite solo voi.','g']}},
  {l:'Un paio di amici veri, fuori dai gruppi',fx:()=>{const p=nuovoAmico();if(p)p.rapporto=clamp(p.rapporto+15);cambiaPers('A',1);cambiaPers('E',-1);return ['Pochi, ma buoni. Ci sarete gli uni per gli altri per anni.','g']}}]});
ev({id:'ado_bacio',min:13,max:16,once:1,w:1.2,t:'Il primo bacio',x:'A una festa, una persona che ti piace si avvicina sempre di più.',c:[
  {l:'La baci',p:.75,si:{e:{f:7},pers:{E:2,N:-1},r:'Il primo bacio. Goffo, perfetto, indimenticabile.'},no:{e:{f:-4},pers:{N:2},r:'Ti scansa ridendo. Vorresti sparire.'}},
  {l:'Aspetti che sia lei a farlo'.replace('lei','l\'altra persona'),p:.45,si:{e:{f:6},pers:{N:-1},r:'Lo fa. Il cuore ti batte a mille.'},no:{e:{f:-1},pers:{E:-1},r:'La serata finisce così. Ci penserai per settimane.'}},
  {l:'Scappi in bagno per l\'imbarazzo',e:{f:-2},pers:{N:2,E:-2},r:'Quando esci, il momento è passato.'}]});
ev({id:'ado_tradimento_amico',min:14,max:17,once:1,t:'Il messaggio',cond:()=>vivi(['Amico']).length>0,x:d=>{d.p=d.p||amicoV();return `Per sbaglio vedi una chat in cui ${d.p.nome} parla male di te con gli altri.`},c:[
  {l:'Lo affronti a viso aperto',p:.55,si:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto+5);cambiaPers('E',1);cambiaPers('N',-1);return ['Si scusa davvero. Ne uscite più amici di prima.','g']}},no:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto-20);cambiaPers('N',1);return ['Nega tutto. L\'amicizia finisce lì.','b']}}},
  {l:'Lo tagli fuori senza spiegazioni',fx:d=>{d.p.rapporto=clamp(d.p.rapporto-25);cambiaPers('A',-2);cambiaPers('E',-1);return ['Smetti di rispondergli. Lui non capisce, o fa finta.','b']}},
  {l:'Lo perdoni senza dire niente',fx:d=>{cambiaPers('A',2);cambiaPers('N',1);return ['Fai finta di non aver visto. Ma qualcosa resta.','']}}]});
ev({id:'ado_delusione',min:14,max:17,once:1,t:'Il cuore spezzato',x:'La persona con cui ti sentivi da mesi ti scrive che «è meglio restare amici».',c:[
  {l:'Piangi tutta la notte e scrivi lettere che non manderai',e:{f:-5,arte:2},pers:{N:2,O:1},r:'Il dolore diventa poesia. Pessima poesia, ma poesia.'},
  {l:'Esci con gli amici e non ci pensi',e:{f:-1},pers:{E:2,N:-1},r:'Gli amici sono la cura migliore.'},
  {l:'Rispondi «Va bene» e la cancelli ovunque',e:{f:-3},pers:{A:-1,N:1},r:'Orgoglio intatto, cuore no.'},
  {l:'Le chiedi una spiegazione',p:.5,si:{e:{f:-1},pers:{N:-1,C:1},r:'Una conversazione onesta. Fa male, ma capisci.'},no:{e:{f:-3},pers:{N:2},r:'Non risponde mai.'}}]});
ev({id:'ado_orientamento',min:14,max:17,once:1,cond:()=>!!S.orient&&S.orient!=='etero',t:'Chi ti piace',x:'Ti accorgi che le persone che ti attraggono non sono quelle che ti aspettavi.',c:[
  {l:'Lo accetti con serenità',fx:()=>{S.attrazione=S.orient==='bi'?'E':S.sesso;cambiaPers('N',-2);cambiaPers('O',2);mod('felicita',3);return ['Ci metti un po\' a trovare le parole, ma ti senti finalmente te stess'+g('o','a')+'.','g']}},
  {l:'Ne parli con il tuo migliore amico',fx:()=>{S.attrazione=S.orient==='bi'?'E':S.sesso;const p=amicoV();if(p){p.rapporto=clamp(p.rapporto+10);cambiaPers('E',1);cambiaPers('N',-1);return [`${p.nome} ti abbraccia: «E quindi? Sei sempre tu».`,'g']}cambiaPers('N',1);return ['Non hai ancora nessuno con cui parlarne.','']}},
  {l:'Non ci pensi, per ora',pers:{N:1},r:'Ci sarà tempo per capire.'}]});
ev({id:'ado_pressione',min:14,max:17,once:1,t:'Il gruppo',x:'I tuoi amici vogliono prendere in giro un ragazzo della classe e ti chiedono di unirti.',c:[
  {l:'Ti rifiuti e lo difendi',p:.7,si:{e:{k:5},pers:{A:2,N:-1,E:1},r:'Il gruppo si ferma. Il ragazzo ti ringrazia con lo sguardo.'},no:{e:{k:4,f:-3},pers:{A:2},r:'Ti prendono in giro per una settimana. Ma tu sai chi sei.'}},
  {l:'Ti unisci per non restare fuori',e:{k:-4},pers:{A:-2,N:1},r:'Ridi con gli altri. A casa non ti senti fiero di te.'.replace('fiero','fier{o}')},
  {l:'Ti allontani senza dire niente',pers:{E:-1},r:'Non partecipi, ma neanche fermi niente.'}]});
ev({id:'ado_pigiama',min:13,max:15,once:1,t:'La notte insonne',x:'Dormi da un amico. Alle tre di notte qualcuno propone di uscire di nascosto.',c:[
  {l:'Esci con loro',p:.65,si:{e:{f:5},pers:{O:1,C:-2,E:1},r:'Il paese di notte è un altro mondo. Rientrate alle cinque.'},no:{fx:()=>{relGenitori(-6);cambiaPers('C',-1);return ['Il padre del tuo amico vi becca al cancello. Telefonata ai tuoi.','b']}}},
  {l:'Resti a dormire',pers:{C:2},r:'Domani racconteranno tutto. Tu dormi bene.'},
  {l:'Proponi un film horror invece',e:{f:3},pers:{E:1,A:1},r:'Nessuno dorme comunque. Per altri motivi.'}]});

/* ---------- Famiglia ---------- */
ev({id:'ado_telefono',min:13,max:16,once:1,t:'Il telefono',cond:()=>famG().length>0,x:'Scopri che tua madre ha letto le tue chat.',c:[
  {l:'Urli e sbatti la porta',fx:()=>{relGenitori(-8);cambiaPers('A',-2);cambiaPers('N',1);return ['Per tre giorni in casa non volano nemmeno i saluti.','b']}},
  {l:'Le chiedi perché con calma',fx:()=>{relGenitori(3);cambiaPers('A',1);cambiaPers('N',-1);return ['Era preoccupata per te. Vi chiarite e vi promettete fiducia.','g']}},
  {l:'Metti una password a tutto e non dici niente',pers:{E:-2,C:1},r:'Da adesso, muri altissimi.'}]});
ev({id:'ado_coprifuoco',min:14,max:17,once:1,t:'Il coprifuoco',cond:()=>famG().length>0,x:'Il sabato devi rientrare a mezzanotte. Tutti i tuoi amici restano fuori fino alle due.',c:[
  {l:'Rientri a mezzanotte',fx:()=>{relGenitori(4);cambiaPers('C',2);return ['Ti perdi la parte migliore della serata, ma i tuoi si fidano di te.','']}},
  {l:'Rientri alle due e speri che dormano',p:.45,si:{e:{f:3},pers:{C:-2},r:'Dormono. Nessuno se ne accorge. Stavolta.'},no:{fx:()=>{relGenitori(-10);mod('felicita',-3);cambiaPers('C',-1);return ['Tua madre ti aspetta seduta in cucina con la luce accesa. Un mese senza uscite.','b']}}},
  {l:'Tratti per l\'una',p:.6,si:{fx:()=>{relGenitori(2);cambiaPers('E',1);cambiaPers('C',1);return ['Concessa. Un buon compromesso.','g']}},no:{pers:{A:-1},r:'«Mezzanotte. Fine della discussione.»'}}]});
ev({id:'ado_lavoro_genitori',min:13,max:17,once:1,t:'I soldi in casa',cond:()=>S.classe!=='agiata'&&famG().length>0,x:'Senti i tuoi parlare: questo mese i soldi non bastano.',c:[
  {l:'Ti offri di trovare un lavoretto',fx:()=>{relGenitori(6);cambiaPers('C',2);cambiaPers('A',1);soldi(P(200));return ['Fai volantinaggio nei weekend. I tuoi si commuovono.','g']}},
  {l:'Rinunci alla gita per non pesare',fx:()=>{relGenitori(3);cambiaPers('A',2);cambiaPers('N',1);mod('felicita',-3);return ['Dici che non ti interessava. Non è vero.','']}},
  {l:'Fai finta di non aver sentito',pers:{N:1},r:'Ma non dormi bene.'}]});
ev({id:'ado_fratello_grande',min:13,max:17,once:1,t:'Tuo fratello',cond:()=>vivi(['Fratello']).some(f=>f.eta>S.eta),x:()=>{const f=vivi(['Fratello']).find(x=>x.eta>S.eta);return `${f.nome} ti chiede di coprirl${gp(f,'o','a')} con i vostri genitori: stasera non dorme a casa.`},c:[
  {l:'Lo copri',fx:()=>{const f=vivi(['Fratello']).find(x=>x.eta>S.eta);f.rapporto=clamp(f.rapporto+10);ricorda(f,'L\'hai copert'+gp(f,'o','a')+' con i genitori');cambiaPers('A',1);return ['Vi siete alleati. D\'ora in poi siete una squadra.','g']}},
  {l:'Lo dici ai tuoi',fx:()=>{const f=vivi(['Fratello']).find(x=>x.eta>S.eta);f.rapporto=clamp(f.rapporto-15);ricorda(f,'L\'hai tradit'+gp(f,'o','a')+' con i genitori');cambiaPers('C',1);cambiaPers('A',-2);return [`${f.nome} non ti parla per un mese.`,'b']}},
  {l:'Gli chiedi qualcosa in cambio',fx:()=>{const f=vivi(['Fratello']).find(x=>x.eta>S.eta);f.rapporto=clamp(f.rapporto+2);cambiaPers('A',-1);cambiaPers('E',1);soldi(P(20));return [`${eur(P(20))} e la sua felpa preferita per un mese.`,'']}}]});
ev({id:'ado_nonno_storia',min:13,max:17,once:1,t:'La storia del nonno',cond:()=>vivi(['Nonno']).length>0,x:d=>{d.p=d.p||pick(vivi(['Nonno']));return `${d.p.nome} ti racconta di quando aveva la tua età e se ne andò di casa per lavorare.`},c:[
  {l:'Lo ascolti fino alla fine e fai domande',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);cambiaPers('A',1);cambiaPers('O',1);return ['Scopri un pezzo della tua famiglia che non conoscevi.','g']}},
  {l:'Registri la storia per non dimenticarla',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+10);cambiaPers('C',1);cambiaPers('O',1);return ['Un giorno quella registrazione varrà più di tutto.','g']}},
  {l:'Guardi il telefono mentre parla',fx:d=>{d.p.rapporto=clamp(d.p.rapporto-5);cambiaPers('A',-1);return ['Il nonno se ne accorge e smette di raccontare.','b']}}]});

/* ---------- Scuola ---------- */
ev({id:'ado_prof',min:14,max:17,once:1,t:'Il professore',x:'C\'è un professore che sembra avercela con te.',c:[
  {l:'Studi il doppio per smentirlo',e:{voto:5},pers:{C:2,N:1},r:'All\'ultima interrogazione ti mette nove. Senza commenti.'},
  {l:'Gli chiedi un colloquio',p:.6,si:{e:{voto:3},pers:{E:1,N:-1},r:'Scopri che ti considerava svogliat{o}. Ora vi capite.'},no:{pers:{N:1},r:'«Si impegni di più.» Fine della conversazione.'}},
  {l:'Smetti di studiare la sua materia',e:{voto:-6},pers:{C:-2,A:-1},r:'Debito a settembre.'}]});
ev({id:'ado_ansia_esame',min:14,max:17,once:1,t:'La notte prima',x:'Domani c\'è il compito più importante dell\'anno e non riesci a dormire.',c:[
  {l:'Ripassi fino alle quattro',e:{voto:2,s:-2},pers:{C:1,N:2},r:'Sai tutto, ma hai gli occhi a palla.'},
  {l:'Chiudi i libri e dormi',e:{voto:2},pers:{N:-2},r:'La mattina sei lucid{o}. Funziona.'},
  {l:'Scrivi ai compagni per farti coraggio',pers:{E:2},r:'Siete tutti nella stessa barca, ed è consolante.'}]});
ev({id:'ado_giornalino',min:14,max:17,once:1,t:'Il giornalino della scuola',x:'Cercano qualcuno per il giornalino della scuola.',c:[
  {l:'Ti proponi come direttore',p:.6,si:{e:{f:3},pers:{E:2,C:2},r:'Prima uscita: 200 copie, tutte esaurite.'},no:{e:{f:-1},pers:{E:1},r:'Ti prendono come redattore. Si comincia da lì.'}},
  {l:'Scrivi un articolo scomodo sulla mensa',e:{arte:2},pers:{O:2,A:-1},r:'Il preside non gradisce. Gli studenti sì.'},
  {l:'Fai le vignette',e:{arte:3,f:2},pers:{O:2},r:'Le tue vignette finiscono sui muri di tutta la scuola.'}]});
ev({id:'ado_scambio',min:15,max:17,once:1,t:'Lo scambio all\'estero',x:'La scuola offre tre mesi di scambio in Irlanda, con una famiglia del posto.',c:[
  {l:'Parti',costo:()=>P(1500),fx:()=>{S.abil.lingue=clamp(S.abil.lingue+12);cambiaPers('O',3);cambiaPers('E',1);cambiaPers('N',-1);segnaVita('viaggio');mod('felicita',6);return ['Tre mesi di pioggia, scones e un inglese che non sapevi di avere.','g']}},
  {l:'Hai paura di stare lontano da casa',pers:{N:1,O:-1},r:'Lo racconteranno gli altri, al ritorno.'},
  {l:'Costa troppo per la tua famiglia',cond:()=>S.classe==='umile',fx:()=>{cambiaPers('N',1);mod('felicita',-2);return ['Ci provi con una borsa di studio, ma non basta.','']}}]});
ev({id:'ado_scelta_futuro',min:15,max:17,once:1,t:'Che cosa farai',x:'All\'incontro di orientamento ti chiedono cosa vuoi fare dopo il diploma.',c:[
  {l:'Hai un piano preciso',e:{voto:2},pers:{C:3},r:'Facoltà, città e lavoro. Ti invidiano tutti.'},
  {l:'Tante idee, nessuna certezza',pers:{O:2,N:1},r:'Medico, regista, archeologo. O tutti e tre.'},
  {l:'Vuoi lavorare subito e guadagnare',pers:{C:1,O:-1},r:'Basta libri: vuoi la tua indipendenza.'},
  {l:'Non ci vuoi pensare',pers:{C:-2},r:'Mancano ancora anni. Più o meno.'}]});
ev({id:'ado_ripetente',min:14,max:17,once:1,t:'A rischio',cond:()=>iscritto()&&S.scuola.voto<45,x:'I voti sono pessimi. Se continui così, perdi l\'anno.',c:[
  {l:'Chiedi aiuto a un compagno bravo',fx:()=>{S.scuola.voto=clamp(S.scuola.voto+10);nuovoAmico(true);cambiaPers('E',1);cambiaPers('C',1);return ['Pomeriggi in biblioteca insieme. Recuperi, e trovi un amico.','g']}},
  {l:'Ti chiudi in camera a studiare',e:{voto:8},pers:{C:3},r:'Due mesi duri. Il recupero arriva.'},
  {l:'Tanto la scuola non fa per te',e:{voto:-3},pers:{C:-2,N:1},r:'Smetti di provarci.'}]});
ev({id:'ado_talento',min:13,max:17,once:1,t:'Un talento',x:'Un insegnante ti ferma dopo la lezione: «Hai un talento, sai?»',c:[
  {l:'Ci credi e ti impegni',e:{f:3,arte:2,musica:2},pers:{C:2,N:-2},r:'Per la prima volta qualcuno ha visto qualcosa in te.'},
  {l:'Pensi che lo dica a tutti',pers:{N:1},r:'Non ci credi. Ma la frase ti resta in testa.'},
  {l:'Lo racconti a casa, orgoglios{o}',fx:()=>{relGenitori(4);cambiaPers('E',1);mod('felicita',4);return ['Tua madre lo racconta a tutte le zie.','g']}}]});

/* ---------- Rischi e libertà ---------- */
ev({id:'ado_motorino_amico',min:14,max:17,once:1,t:'Il motorino',x:'Un amico ti offre un passaggio sul motorino. Il casco è uno solo.',c:[
  {l:'Sali senza casco',p:.85,si:{e:{f:3},pers:{C:-2,N:-1},r:'Il vento in faccia. Andata bene.'},no:{e:{s:-12,f:-5},pers:{C:2,N:2},r:'Una buca, una caduta, un gesso. Ci penserai due volte.'}},
  {l:'Vai a piedi',pers:{C:2},r:'Arrivi dopo, ma tutto intero.'.replace('intero','inter{o}')},
  {l:'Lo convinci ad andare a piedi insieme',pers:{A:1,E:1},r:'Una chiacchierata lunghissima lungo la strada.'}]});
ev({id:'ado_festa_alcol',min:15,max:17,once:1,t:'La festa in casa',x:'A una festa a casa di un compagno un ragazzo sta male per aver bevuto troppo.',c:[
  {l:'Chiami il 112',fx:()=>{S.karma=clamp(S.karma+6);cambiaPers('C',2);cambiaPers('A',2);return ['L\'ambulanza arriva in dieci minuti. Gli hai probabilmente salvato la vita.','g']}},
  {l:'Lo assisti tu finché sta meglio',p:.8,si:{e:{k:4},pers:{A:2,N:-1},r:'Acqua, posizione laterale e tanta pazienza. Si riprende.'},no:{e:{k:2,f:-4},pers:{N:2},r:'Peggiora. Alla fine arriva l\'ambulanza, e il panico.'}},
  {l:'Te ne vai prima che arrivino guai',e:{k:-4},pers:{A:-2,C:-1},r:'Il giorno dopo scopri che è finito in ospedale.'}]});
ev({id:'ado_soldi_facili',min:15,max:17,once:1,t:'I soldi facili',x:'Un ragazzo più grande ti offre 50 € per consegnare un pacchetto senza fare domande.',c:[
  {l:'Rifiuti',pers:{C:2,A:1},r:'Non vuoi sapere cosa c\'era dentro.'},
  {l:'Accetti',p:.7,si:{e:{m:50,k:-5},fx:()=>{S.crim.exp=(S.crim.exp||0)+1;cambiaPers('C',-2);cambiaPers('A',-1)},r:'Cinquanta euro in dieci minuti. Troppo facile.'},no:{e:{k:-5},pr:'droga'}},
  {l:'Lo racconti a un adulto',fx:()=>{cambiaPers('C',2);cambiaPers('A',-1);S.karma=clamp(S.karma+3);return ['L\'adulto avverte la polizia. Ti senti un po\' spia, un po\' giust'+g('o','a')+'.','']}}]});
ev({id:'ado_fumo_amici',min:14,max:17,once:1,t:'La canna',x:'Al parco gira una canna. Tutti ti guardano.',c:[
  {l:'Fai un tiro',e:{f:2},pers:{O:2,C:-2},r:'Ridi per un\'ora di niente. Poi fame infinita.'},
  {l:'Passi',pers:{C:2},r:'«Come vuoi.» Nessuno insiste. La pressione era tutta nella tua testa.'},
  {l:'Te ne vai',pers:{C:1,E:-1},r:'Il gruppo ti saluta freddo.'}]});
ev({id:'ado_social_foto',min:13,max:17,once:1,t:'La foto',x:'Qualcuno ha pubblicato una tua foto imbarazzante. Ha già cento commenti.',c:[
  {l:'La commenti con autoironia',p:.7,si:{e:{f:2},pers:{N:-2,E:1},r:'La tua battuta diventa il commento più votato.'},no:{e:{f:-3},pers:{N:1},r:'Peggiora tutto.'}},
  {l:'La segnali e chiedi di toglierla',p:.6,si:{pers:{C:1},r:'Viene rimossa in un giorno.'},no:{e:{f:-3},pers:{N:2},r:'Resta online. Ogni notifica è una fitta.'}},
  {l:'Chiudi i social per un mese',e:{f:-1},pers:{E:-2,N:1},r:'Un mese offline. Quasi un sollievo.'}]});
ev({id:'ado_notte_videogiochi',min:13,max:16,once:1,t:'Ancora una partita',x:'È l\'una di notte. Domani c\'è scuola. La squadra online ti aspetta.',c:[
  {l:'Ancora una partita',e:{voto:-2,tech:1},pers:{C:-2},r:'Diventano sei. A scuola dormi sul banco.'},
  {l:'Spegni e vai a dormire',pers:{C:2},r:'La squadra perde senza di te. Sopravvivranno.'},
  {l:'Fai una diretta e guadagni follower',cond:()=>S.social.attivo,fx:()=>{S.social.follower+=r(20,200);cambiaPers('E',2);cambiaPers('C',-1);return ['Duecento persone ti guardano giocare alle due di notte.','']}}]});
ev({id:'ado_viaggio_solo',min:16,max:17,once:1,t:'Il primo viaggio da soli',x:'Con tre amici organizzate un weekend al mare senza genitori.',c:[
  {l:'Organizzi tutto tu',costo:()=>P(150),e:{f:6},pers:{C:2,E:1},r:'Treni, ostello, spesa. Tutto perfetto. Ti chiamano «la mamma del gruppo».'},
  {l:'Ti fai trascinare e basta',costo:()=>P(150),e:{f:5},pers:{C:-1,E:1},r:'Perdi il treno del ritorno. Ne vale la pena.'},
  {l:'I tuoi non ti lasciano andare',fx:()=>{relGenitori(-4);cambiaPers('N',1);mod('felicita',-3);return ['Guardi le loro foto da casa.','b']}}]});
ev({id:'ado_volontariato',min:14,max:17,once:1,t:'Il centro anziani',x:'La scuola propone un pomeriggio a settimana in un centro per anziani.',c:[
  {l:'Ci vai con entusiasmo',e:{k:5},pers:{A:3},r:'Il signor Giuseppe ti insegna a giocare a scopa. Lo batti solo a giugno.'},
  {l:'Ci vai solo per i crediti scolastici',e:{k:2},pers:{C:1},r:'Ma il terzo pomeriggio ti accorgi che ti diverti.'},
  {l:'Preferisci di no',pers:{A:-1},r:'Altri ci andranno.'}]});
ev({id:'ado_patentino',min:14,max:15,once:1,t:'Il patentino',x:'Puoi fare il patentino per il motorino.',c:[
  {l:'Studi i quiz con metodo',p:.85,si:{e:{f:3},fl:'patentino',pers:{C:2},r:'Zero errori. Il motorino ora è solo questione di soldi.'},no:{e:{f:-2},pers:{N:1},r:'Bocciat{o} per due errori. Riproverai.'}},
  {l:'Vai all\'esame senza studiare',p:.4,si:{e:{f:3},fl:'patentino',pers:{C:-1,N:-1},r:'Passato per miracolo.'},no:{e:{f:-3},pers:{C:-1},r:'Bocciat{o}. Era prevedibile.'}},
  {l:'Non ti interessa, preferisci la bici',e:{sport:2},pers:{O:-1,C:1},r:'Gambe d\'acciaio e zero benzina.'}]});
ev({id:'ado_rabbia',min:13,max:17,once:1,t:'La rabbia',x:'Per una sciocchezza ti sale una rabbia che non riconosci.',c:[
  {l:'Tiri un pugno al muro',e:{s:-3},pers:{N:2,A:-2},r:'Nocche gonfie e un buco nel cartongesso.'},
  {l:'Esci a correre finché passa',e:{sport:2,s:1},pers:{N:-2,C:1},r:'Dieci chilometri. La rabbia resta sull\'asfalto.'},
  {l:'Scrivi tutto quello che senti',e:{arte:1},pers:{O:1,N:-1},r:'Rileggendolo, capisci che non era rabbia: era tristezza.'},
  {l:'Te la prendi con chi c\'è',fx:()=>{const p=genV()||fratV();if(p){p.rapporto=clamp(p.rapporto-8);ricorda(p,'Te la sei pres'+g('o','a')+' con lui senza motivo'.replace('lui',gp(p,'lui','lei')))}cambiaPers('A',-2);return ['Chiedi scusa solo il giorno dopo.','b']}}]});
ev({id:'ado_compleanno18',min:17,max:17,once:1,w:2,t:'Quasi diciott\'anni',x:'Manca poco ai diciott\'anni. Cosa vuoi per il grande giorno?',c:[
  {l:'Una festa enorme',costo:()=>P(400),e:{f:5},pers:{E:2},r:'Musica, amici e un discorso dei tuoi che ti fa piangere.'},
  {l:'I soldi per la patente',fx:()=>{S.fatti.regaloPatente=1;soldi(P(700));cambiaPers('C',1);return ['Pratico. Sarai liber'+g('o','a')+' di guidare presto.','']}},
  {l:'Un viaggio con il tuo migliore amico',costo:()=>P(500),fx:()=>{const p=amicoV();if(p)p.rapporto=clamp(p.rapporto+10);cambiaPers('O',2);segnaVita('viaggio');mod('felicita',6);return ['Una settimana in giro per l\'Europa con lo zaino in spalla.','g']}},
  {l:'Niente: non ami essere al centro dell\'attenzione',pers:{E:-2},r:'Una pizza con i tuoi. Va benissimo così.'}]});
