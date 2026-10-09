/* ================= DATI DEI NUOVI SISTEMI ================= */

/* ---------- Borsa ---------- */
const TITOLI=[
  {id:'etf',n:'ETF Mondo',set:'Fondo indicizzato',vol:.12,drift:.05,div:0},
  {id:'banca',n:'Banca del Corso',set:'Banche',vol:.25,drift:.035,div:.05},
  {id:'auto',n:'Autovia',set:'Automobili',vol:.28,drift:.03,div:.03},
  {id:'tech',n:'TechNova',set:'Tecnologia',vol:.42,drift:.08,div:0},
  {id:'energia',n:'Energia Verde Italia',set:'Energia',vol:.22,drift:.045,div:.04},
  {id:'moda',n:'Atelier Milano',set:'Moda e lusso',vol:.3,drift:.05,div:.02},
  {id:'pasta',n:'Pastificio Bruni',set:'Alimentare',vol:.14,drift:.035,div:.035},
  {id:'farma',n:'Farmaceutica Leone',set:'Salute',vol:.24,drift:.055,div:.02},
  {id:'cripto',n:'Bitmoneta',set:'Criptovaluta',vol:.85,drift:-.02,div:0}
];

/* ---------- Aziende ----------
 domanda: clienti/anno per sede a prezzo medio · scontrino: spesa media · margine: quota che resta dopo le materie prime
 cap: clienti serviti da una persona all'anno · affitto: per sede · stip: RAL di un dipendente · aprire: costo di una nuova sede */
const AZIENDE=[
  {id:'shop',n:'Negozio online',costo:8000,sk:'tech',domanda:1500,scontrino:45,margine:.35,cap:2500,affitto:3000,stip:25000,aprire:6000,cliente:'ordini',mult:3},
  {id:'agenzia',n:'Agenzia di comunicazione',costo:20000,sk:'arte',domanda:25,scontrino:6000,margine:.9,cap:12,affitto:12000,stip:30000,aprire:15000,cliente:'clienti',mult:3},
  {id:'estetico',n:'Centro estetico',costo:35000,sk:'arte',domanda:3500,scontrino:45,margine:.8,cap:1800,affitto:14000,stip:20000,aprire:30000,cliente:'clienti',mult:3},
  {id:'startup',n:'Startup tecnologica',costo:40000,sk:'tech',domanda:400,scontrino:600,margine:.85,cap:150,affitto:15000,stip:38000,aprire:30000,cliente:'abbonati',mult:8},
  {id:'edile',n:'Impresa edile',costo:50000,sk:'tech',domanda:20,scontrino:25000,margine:.45,cap:4,affitto:8000,stip:28000,aprire:40000,cliente:'cantieri',mult:3},
  {id:'bar',n:'Bar',costo:60000,sk:'cucina',domanda:18000,scontrino:6,margine:.65,cap:9000,affitto:18000,stip:22000,aprire:50000,cliente:'clienti',mult:3},
  {id:'pizzeria',n:'Pizzeria',costo:90000,sk:'cucina',domanda:9000,scontrino:18,margine:.6,cap:5000,affitto:24000,stip:22000,aprire:70000,cliente:'coperti',mult:3},
  {id:'negozio',n:'Negozio di quartiere',costo:30000,sk:'cucina',domanda:12000,scontrino:25,margine:.28,cap:8000,affitto:12000,stip:20000,aprire:25000,cliente:'clienti',mult:3},
  {id:'palestra',n:'Palestra',costo:90000,sk:'sport',domanda:500,scontrino:500,margine:.9,cap:250,affitto:30000,stip:22000,aprire:80000,cliente:'iscritti',mult:3}
];
const PREZZI_AZ={basso:{n:'Bassi',k:.8,d:1.3},medio:{n:'Nella media',k:1,d:1},alto:{n:'Alti',k:1.25,d:.75}};
const QUALITA_AZ={base:{n:'Base',costo:0,rep:-3},buona:{n:'Buona',costo:.04,rep:3},top:{n:'Eccellente',costo:.09,rep:8}};
const MKT_AZ=[{v:0,n:'Nessuna pubblicità',d:1},{v:5000,n:'Volantini e social',d:1.12},{v:20000,n:'Campagna locale',d:1.3},{v:50000,n:'Campagna nazionale',d:1.5}];
const COMPENSI=[0,15000,30000,50000,80000,120000];

/* ---------- Crimini ---------- */
Object.assign(REATI,{
  borseggio:{n:'Borseggio',g:2},
  truffaweb:{n:'Truffa informatica',g:2},
  rapina:{n:'Rapina',g:4},
  contrabbando:{n:'Contrabbando',g:2},
  associazione:{n:'Associazione per delinquere',g:4},
  ricettazione:{n:'Ricettazione',g:2},
  diffamazione:{n:'Diffamazione',g:1},
  usura:{n:'Usura',g:3}
});
const CRIMINI=[
  {id:'tacc',n:'Taccheggio',d:'Qualcosa dagli scaffali',min:12,p:.72,b:[20,150],reato:'taccheggio',exp:1,k:-3},
  {id:'vandal',n:'Vandalismo',d:'Graffiti e cassonetti',min:12,p:.7,b:[0,0],reato:'graffiti',exp:1,k:-2,f:3},
  {id:'borse',n:'Borseggio',d:'In metro, all\'ora di punta',min:14,p:.55,b:[50,500],reato:'borseggio',exp:2,k:-5},
  {id:'web',n:'Truffa online',d:'Falsi annunci di vendita',min:16,p:.45,sk:'tech',b:[500,6000],reato:'truffaweb',exp:2,k:-6},
  {id:'contr',n:'Contrabbando',d:'Sigarette senza bollo',min:18,p:.55,b:[2000,10000],reato:'contrabbando',exp:2,k:-4},
  {id:'autof',n:'Furto d\'auto',d:'Un\'auto lasciata aperta',min:18,p:.42,b:[2000,12000],reato:'furto',exp:3,k:-6},
  {id:'apt',n:'Furto in appartamento',d:'Una villa in vacanza',min:18,p:.42,b:[1000,18000],reato:'furto',exp:3,k:-8},
  {id:'rapina',n:'Rapina in banca',d:'Il colpo della vita',min:20,p:.18,b:[30000,250000],reato:'rapina',exp:6,k:-12}
];
const GRADI_CLAN=['Ragazzo di strada','Esattore','Uomo di fiducia','Luogotenente','Capo del clan'];
const MISSIONI=[
  {id:'palo',n:'Fai da palo',d:'Basso rischio',p:.88,b:[500,2000],arr:.04,lealta:4},
  {id:'crediti',n:'Riscuoti i crediti',d:'Rischio medio',p:.7,b:[2000,8000],arr:.1,lealta:7},
  {id:'merce',n:'Trasporta la merce',d:'Rischio medio',p:.65,b:[4000,15000],arr:.14,lealta:8},
  {id:'bisca',n:'Gestisci una bisca',d:'Entrate regolari',p:.75,b:[6000,20000],arr:.12,lealta:6,grado:1},
  {id:'colpo',n:'Il colpo grosso',d:'Un magazzino pieno di merce',p:.4,b:[30000,120000],arr:.3,lealta:15,grado:2}
];
const BANDE=['quelli del terzo braccio','la banda del cortile','i vecchi del braccio nord'];

/* ---------- Fama e social ---------- */
LAVORI.push({id:'att',liv:[['Comparsa'],['Attore di spot','Attrice di spot'],['Attore di fiction','Attrice di fiction'],['Attore di cinema','Attrice di cinema'],['Star internazionale']],stip:8000,m:[1,3,7,20,70],var:1,nascosto:'provino',req:{eta:[16,99]},promo:{2:{sk:['arte',45]},3:{sk:['arte',65]},4:{sk:['arte',85]}}});
JOB.att=LAVORI[LAVORI.length-1];
{const i=LAVORI.findIndex(j=>j.id==='crea');if(i>=0){LAVORI.splice(i,1);delete JOB.crea}}
const POST=[
  {id:'foto',n:'Pubblica una foto',d:'Conta l\'aspetto',sk:'a'},
  {id:'video',n:'Pubblica un video',d:'Contano arte e tecnologia',sk:'v'},
  {id:'diretta',n:'Fai una diretta',d:'Conta quanto sei simpatico',sk:'k'},
  {id:'opinione',n:'Scrivi un\'opinione forte',d:'Può esplodere o ritorcersi contro',sk:'o'}
];
const PARTITI=['Partito del Progresso','Alleanza per la Tradizione','Movimento dei Cittadini','Unione Verde'];

/* ---------- Colloqui ---------- */
const DOMANDE_GEN=[
  {q:'Perché vuoi lavorare con noi?',a:[['Conosco bene l\'azienda e quello che fate',2],['Mi serve uno stipendio',-1],['Ci lavora un mio amico',0],['Cerco un posto dove crescere',1]]},
  {q:'Qual è il tuo difetto più grande?',a:[['Faccio fatica a dire di no, ma sto imparando a organizzarmi',2],['Sono troppo perfezionista',0],['Non ne ho',-2],['Arrivo spesso in ritardo',-2]]},
  {q:'Dove ti vedi tra cinque anni?',a:[['Con più responsabilità, qui dentro',2],['Seduto alla sua scrivania',1,'rischio'],['Non lo so',-1],['In spiaggia ai Caraibi',-2]]},
  {q:'Raccontami di un conflitto con un collega.',a:[['Ne abbiamo parlato con calma e abbiamo trovato una soluzione',2],['Ho chiesto al capo di intervenire',0],['Non ho mai litigato con nessuno',-1],['Gliel\'ho fatta pagare',-2]]},
  {q:'Quanto vorresti guadagnare?',a:[['Quello che offre il mercato per questo ruolo',1],['Il più possibile',-1],['Quello che mi offrite va bene',0,'umile'],['Il 30% in più della vostra offerta',1,'azzardo']]},
  {q:'Hai domande per noi?',a:[['Com\'è una giornata tipo in questo ruolo?',2],['Quante ferie ho?',-1],['No, nessuna',-1],['Si può lavorare da casa?',0]]},
  {q:'Qual è il tuo punto di forza?',a:[['Imparo in fretta',1,'int'],['So lavorare in squadra',1],['Dormo benissimo',-2],['Sono il migliore in tutto',-1]]},
  {q:'Come reagisci sotto pressione?',a:[['Faccio una lista di priorità e procedo',2],['Lavoro anche di notte',0],['Vado in panico',-2],['Delego tutto',-1]]}
];
const DOMANDE_SET={
  tech:[{q:'Cos\'è un database?',a:[['Un archivio organizzato di dati',2],['Un tipo di virus',-2],['Un programma per scrivere testi',-1]]},{q:'Il sito di un cliente è lentissimo. Da dove parti?',a:[['Misuro dove si perde tempo prima di cambiare qualcosa',2],['Compro un server più potente',0],['Riavvio tutto e spero',-1]]}],
  vendita:[{q:'Vendimi questa penna.',a:[['Prima le chiedo per cosa le serve una penna',2],['Le elenco le caratteristiche',1],['È una penna. Scrive.',-1]]},{q:'Un cliente indeciso sta per andarsene.',a:[['Gli chiedo cosa lo frena e rispondo a quello',2],['Gli faccio subito uno sconto',0],['Lo lascio andare',-1]]}],
  ristorazione:[{q:'Un cliente si lamenta del piatto.',a:[['Mi scuso e lo faccio rifare subito',2],['Gli spiego che il piatto è così',-1],['Chiamo il titolare',0]]},{q:'Sabato sera, sala piena e un collega malato.',a:[['Riorganizzo i tavoli e accelero',2],['Faccio quello che posso',0],['Vado via anch\'io',-2]]}],
  sanita:[{q:'Un paziente è agitato e non vuole la terapia.',a:[['Lo ascolto e gli spiego con calma',2],['Insisto finché la prende',-1],['Chiamo subito il medico',1]]},{q:'Ti accorgi di un errore di un collega.',a:[['Lo segnalo subito, la sicurezza viene prima',2],['Faccio finta di niente',-2],['Ne parlo con lui in privato',1]]}],
  fisico:[{q:'Lavoreresti anche nel weekend e su turni?',a:[['Sì, nessun problema',2],['Solo se pagato di più',1],['No',-2]]},{q:'Un collega non rispetta le norme di sicurezza.',a:[['Glielo faccio notare e avviso il responsabile',2],['Sono affari suoi',-1],['Faccio come lui, si va più veloci',-2]]}],
  legale:[{q:'Un cliente ti chiede di chiudere un occhio su un errore nei conti.',a:[['Rifiuto e gli spiego i rischi',2],['Per questa volta va bene',-2],['Ne parlo con il mio responsabile',1]]},{q:'Hai due scadenze nello stesso giorno.',a:[['Le comunico subito e propongo un piano',2],['Ne salto una',-1],['Lavoro tutta la notte',0]]}],
  scuola:[{q:'Uno studente disturba di continuo.',a:[['Gli parlo da solo e cerco di capire il motivo',2],['Lo mando dal preside',0],['Alzo la voce',-1]]}],
  creativo:[{q:'Mostraci un tuo lavoro.',a:[['Presenti il tuo portfolio migliore',2,'arte'],['Improvvisi qualcosa sul momento',0,'arte'],['Non ho niente da mostrare',-2]]}]
};
const SETTORE_JOB={colf:'fisico',badante:'sanita',bracc:'fisico',idra:'fisico',elet:'tech',mecc:'fisico',fale:'fisico',pane:'ristorazione',past:'ristorazione',macel:'vendita',camion:'fisico',cass:'vendita',puli:'fisico',callc:'vendita',segr:'legale',este:'creativo',edu:'scuola',maes:'scuola',post:'fisico',taxi:'fisico',guida:'vendita',anim:'creativo',bagn:'fisico',hostess:'vendita',pilota:'tech',vet:'sanita',dent:'sanita',fisio:'sanita',agcom:'vendita',ds:'tech',tec:'tech',pro:'tech',ing:'tech',com:'vendita',cpt:'vendita',agi:'vendita',rec:'vendita',mkt:'vendita',cam:'ristorazione',bpt:'ristorazione',cuoco:'ristorazione',inf:'sanita',med:'sanita',oss:'sanita',far:'sanita',psi:'sanita',bio:'sanita',mag:'fisico',ope:'fisico',mur:'fisico',aut:'fisico',rider:'fisico',avv:'legale',comm:'legale',cons:'legale',imp:'legale',man:'legale',ins:'scuola',rip:'scuola',ric:'scuola',gra:'creativo',gio:'creativo',mus:'creativo',parr:'creativo',att:'creativo'};
/* Quiz di cultura generale per i concorsi pubblici: [domanda, risposta giusta, sbagliata, sbagliata] */
const QUIZ=[
  ['In che anno è entrata in vigore la Costituzione italiana?','1948','1946','1950'],
  ['Quanti articoli ha la Costituzione italiana?','139','120','150'],
  ['Chi promulga le leggi in Italia?','Il Presidente della Repubblica','Il Presidente del Consiglio','Il Senato'],
  ['Qual è il capoluogo del Molise?','Campobasso','Isernia','Termoli'],
  ['Qual è il capoluogo della Basilicata?','Potenza','Matera','Melfi'],
  ['Quanti anni dura il mandato del Presidente della Repubblica?','7','5','6'],
  ['Quante sono le regioni italiane?','20','21','19'],
  ['Qual è il fiume più lungo d\'Italia?','Il Po','Il Tevere','L\'Adige'],
  ['Chi ha scritto la Divina Commedia?','Dante Alighieri','Francesco Petrarca','Giovanni Boccaccio'],
  ['Quanto fa il 15% di 200?','30','15','35'],
  ['Quanto fa 7 × 8?','56','54','64'],
  ['Quale organo vota la fiducia al Governo?','Il Parlamento','Il Presidente della Repubblica','La Corte costituzionale'],
  ['In che anno gli italiani scelsero la Repubblica con il referendum?','1946','1948','1945'],
  ['Chi ha dipinto la Gioconda?','Leonardo da Vinci','Michelangelo','Raffaello'],
  ['Qual è la capitale dell\'Australia?','Canberra','Sydney','Melbourne'],
  ['Quanti deputati siedono alla Camera dopo la riforma del 2020?','400','630','500'],
  ['Un prodotto da 80 euro scontato del 25% costa…','60 euro','55 euro','65 euro'],
  ['Quale elemento chimico ha il simbolo Fe?','Ferro','Fluoro','Fosforo'],
  ['In che anno è caduto il muro di Berlino?','1989','1991','1987'],
  ['Chi ha scritto «I promessi sposi»?','Alessandro Manzoni','Giovanni Verga','Ugo Foscolo'],
  ['Quanti minuti ci sono in 3 ore e mezza?','210','190','230'],
  ['Qual è il lago più grande d\'Italia?','Il lago di Garda','Il lago Maggiore','Il lago di Como'],
  ['Qual è il pianeta più vicino al Sole?','Mercurio','Venere','Marte'],
  ['Qual è il numero successivo: 2, 4, 8, 16…?','32','24','20'],
  ['Qual è il capoluogo della Calabria?','Catanzaro','Reggio Calabria','Cosenza'],
  ['Qual è l\'isola più grande del Mediterraneo?','La Sicilia','La Sardegna','Cipro'],
  ['Chi elegge il Presidente della Repubblica?','Il Parlamento in seduta comune','I cittadini','Il Governo'],
  ['Quanto vale il numero romano XL?','40','60','90'],
  ['Quale regione ha come capoluogo Aosta?','Valle d\'Aosta','Piemonte','Trentino-Alto Adige'],
  ['Se 3 operai fanno un lavoro in 6 giorni, quanti giorni servono a 6 operai?','3','12','6']
];

/* ---------- Dialoghi ----------
 ok/ko: caratteri (indici di TRATTI) che reagiscono bene o male · solo: ruoli per cui compare */
const TEMI=[
  {id:'ricordi',min:8,l:'Ricordate i vecchi tempi',ok:[TR.LEALE,TR.PREMUROSO,TR.DIVERTENTE],ko:[TR.LUNATICO],si:'Ridete di cose successe anni fa.',no:'{P} non ha voglia di parlare del passato.'},
  {id:'lavoro',min:16,pmin:16,l:'Parlate di lavoro',ok:[TR.AMBIZIOSO],ko:[TR.PIGRO],si:'{P} ti dà un consiglio utile sul lavoro.',no:'{P} sbadiglia. Il lavoro {gli} interessa poco.'},
  {id:'gossip',min:10,l:'Spettegolate su qualcuno',ok:[TR.DIVERTENTE,TR.EGOISTA],ko:[TR.LEALE,TR.PREMUROSO],si:'Pettegolezzi succosi. Vi divertite un mondo.',no:'{P} ti guarda male: non ama chi parla alle spalle.'},
  {id:'sogni',min:6,l:'Parlate dei vostri sogni',ok:[TR.AVVENTUROSO,TR.AMBIZIOSO],ko:[TR.PIGRO],si:'Scoprite di avere sogni simili.',no:'{P} trova i sogni una perdita di tempo.'},
  {id:'barzelletta',min:4,l:'Racconta una barzelletta',ok:[TR.DIVERTENTE,TR.AVVENTUROSO],ko:[TR.TESTARDO,TR.LUNATICO],si:'{P} ride fino alle lacrime.',no:'Silenzio imbarazzante. Non ha riso nessuno.'},
  {id:'complimento',min:4,l:'Fai un complimento',ok:[TR.TIMIDO,TR.GENEROSO,TR.PREMUROSO],ko:[TR.EGOISTA],si:'{P} arrossisce e sorride.',no:'«Lo so già», risponde {P}.'},
  {id:'consiglio',min:6,l:'Chiedi un consiglio',ok:[TR.PREMUROSO,TR.GENEROSO,TR.LEALE],ko:[TR.EGOISTA,TR.PIGRO],si:'{P} ti ascolta e ti dà un consiglio prezioso.',no:'{P} cambia subito argomento.'},
  {id:'segreto',min:6,l:'Confida un segreto',ok:[TR.LEALE,TR.PREMUROSO],ko:[TR.EGOISTA,TR.DIVERTENTE],si:'{P} custodirà il tuo segreto. Vi sentite più vicini.',no:'Una settimana dopo il tuo segreto lo sanno tutti.'},
  {id:'attualita',min:14,pmin:12,l:'Parlate di attualità',ok:[TR.AMBIZIOSO,TR.LEALE],ko:[TR.TESTARDO,TR.LUNATICO],si:'Una bella discussione, anche se non la pensate uguale.',no:'Finisce in una discussione accesa.'},
  {id:'scherzo',min:5,l:'Prendil{po} in giro',ok:[TR.DIVERTENTE],ko:[TR.TIMIDO,TR.LUNATICO,TR.TESTARDO,TR.EGOISTA],si:'{P} sta al gioco e ti risponde a tono.',no:'{P} se la prende sul serio.'},
  {id:'scuse',min:4,l:'Chiedi scusa',ok:[TR.GENEROSO,TR.PREMUROSO,TR.LEALE],ko:[TR.TESTARDO],si:'{P} accetta le tue scuse. Il clima migliora.',no:'«Le scuse non bastano», dice {P}.',basso:1},
  {id:'gioco',min:3,max:13,l:'Proponi un gioco',ok:[TR.DIVERTENTE,TR.AVVENTUROSO,TR.GENEROSO],ko:[TR.PIGRO],si:'Giocate finché non vi chiamano per cena.',no:'{P} non ha voglia di giocare a quello.'},
  {id:'cartoni',min:3,max:12,l:'Parlate dei cartoni animati',ok:[TR.DIVERTENTE,TR.TIMIDO],ko:[TR.AMBIZIOSO],si:'Scoprite di avere lo stesso cartone preferito.',no:'{P} dice che quello è un cartone per piccoli.'},
  {id:'domande',min:3,max:8,l:'Fai mille domande',ok:[TR.PREMUROSO,TR.GENEROSO,TR.LEALE],ko:[TR.LUNATICO,TR.EGOISTA],si:'{P} risponde a tutte, anche a «perché il cielo è blu».',no:'Alla quindicesima domanda {P} ti dice di andare a giocare.'},
  {id:'futuro_coppia',l:'Parlate del vostro futuro insieme',ok:[TR.PREMUROSO,TR.LEALE,TR.AMBIZIOSO],ko:[TR.AVVENTUROSO,TR.EGOISTA],si:'Fate progetti fino a notte fonda.',no:'{P} si irrigidisce: il futuro {gli} fa paura.',solo:['Partner','Coniuge']},
  {id:'scuola_fig',l:'Chiedi come va a scuola',ok:[TR.AMBIZIOSO,TR.TIMIDO],ko:[TR.PIGRO,TR.LUNATICO],si:'{P} ti racconta tutto, felice che te ne interessi.',no:'«Bene.» Fine della conversazione.',solo:['Figlio','Nipote'],etaMax:19}
];
