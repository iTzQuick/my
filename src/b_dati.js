'use strict';
/* ================= DATI ================= */
const NOMI_M=['Luca','Marco','Alessandro','Matteo','Lorenzo','Andrea','Francesco','Giuseppe','Davide','Simone','Federico','Riccardo','Gabriele','Tommaso','Stefano','Antonio','Salvatore','Giovanni','Pietro','Emanuele','Leonardo','Edoardo','Nicolò','Samuele','Diego','Christian','Filippo','Mattia','Daniele','Vincenzo','Giorgio','Paolo','Roberto','Enrico','Michele','Fabio','Alberto','Claudio','Massimo','Raffaele'];
const NOMI_F=['Giulia','Sofia','Chiara','Francesca','Martina','Sara','Alessia','Valentina','Aurora','Elisa','Giorgia','Federica','Beatrice','Ilaria','Noemi','Anna','Carla','Rosa','Marta','Serena','Ginevra','Alice','Emma','Greta','Camilla','Viola','Arianna','Elena','Paola','Laura','Silvia','Roberta','Cristina','Lucia','Teresa','Monica','Barbara','Daniela','Simona','Irene'];
const COGNOMI=['Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','Conti','De Luca','Mancini','Costa','Giordano','Rizzo','Lombardi','Moretti','Barbieri','Fontana','Santoro','Caruso','Ferraro','Galli','Martini','Leone','Longo','Gentile','Martinelli','Vitale','Lombardo','Serra','Coppola','De Santis','D\'Angelo','Marchetti','Parisi','Villa','Cattaneo','Fabbri','Bellini','Ferri','Testa'];
/* Nomi per generazione (anno di nascita): una nonna non si chiama Ginevra e un neonato del 2024 non si chiama Massimo.
   Gli ultimi sono i primi nomi dati in Italia nel 2024 (ISTAT); le generazioni precedenti sono indicative. */
const NOMI_GEN={
  M:[[1965,['Giuseppe','Giovanni','Antonio','Mario','Luigi','Francesco','Angelo','Vincenzo','Pietro','Salvatore','Carlo','Franco','Domenico','Bruno','Paolo','Michele','Giorgio','Aldo','Sergio','Luciano','Renato','Gino','Enzo','Raffaele','Umberto']],
     [1985,['Marco','Andrea','Massimo','Roberto','Stefano','Alessandro','Paolo','Luca','Giuseppe','Fabio','Francesco','Davide','Daniele','Maurizio','Claudio','Antonio','Simone','Riccardo','Alberto','Fabrizio','Emanuele','Giorgio','Michele','Enrico','Vincenzo']],
     [2000,['Andrea','Marco','Alessandro','Luca','Matteo','Davide','Simone','Francesco','Federico','Lorenzo','Stefano','Daniele','Michele','Gabriele','Riccardo','Christian','Nicola','Mattia','Giuseppe','Emanuele','Fabio','Antonio','Giovanni','Alberto','Filippo']],
     [2015,['Alessandro','Andrea','Matteo','Lorenzo','Francesco','Gabriele','Mattia','Luca','Riccardo','Davide','Leonardo','Tommaso','Federico','Edoardo','Simone','Marco','Giuseppe','Antonio','Pietro','Filippo','Nicolò','Samuele','Diego','Christian','Giovanni']],
     [1e4,['Leonardo','Edoardo','Tommaso','Mattia','Alessandro','Francesco','Lorenzo','Gabriele','Riccardo','Andrea','Matteo','Diego','Giuseppe','Antonio','Pietro','Nicolò','Filippo','Samuele','Giovanni','Christian','Enea','Elia','Achille','Thomas','Giacomo']]],
  F:[[1965,['Maria','Anna','Giuseppina','Rosa','Angela','Giovanna','Teresa','Lucia','Carmela','Caterina','Francesca','Antonietta','Carla','Elena','Concetta','Rita','Margherita','Franca','Paola','Luisa','Bruna','Adriana','Graziella','Gabriella','Lina']],
     [1985,['Francesca','Laura','Barbara','Monica','Elena','Silvia','Simona','Paola','Roberta','Cristina','Daniela','Maria','Elisabetta','Federica','Sabrina','Manuela','Valentina','Alessandra','Antonella','Chiara','Claudia','Stefania','Patrizia','Raffaella','Michela']],
     [2000,['Giulia','Francesca','Sara','Martina','Chiara','Valentina','Federica','Silvia','Elisa','Alessia','Ilaria','Elena','Laura','Serena','Roberta','Veronica','Giorgia','Jessica','Michela','Alice','Erica','Arianna','Marta','Anna','Claudia']],
     [2015,['Giulia','Sofia','Martina','Chiara','Sara','Aurora','Alessia','Giorgia','Alice','Francesca','Elisa','Gaia','Beatrice','Anna','Emma','Greta','Noemi','Ginevra','Matilde','Camilla','Arianna','Viola','Elena','Asia','Rebecca']],
     [1e4,['Sofia','Aurora','Ginevra','Vittoria','Giulia','Beatrice','Ludovica','Matilde','Alice','Emma','Giorgia','Anna','Chiara','Nicole','Camilla','Bianca','Gaia','Greta','Martina','Sara','Azzurra','Rebecca','Arianna','Viola','Noemi']]]
};
const nomiPer=(ses,anno)=>NOMI_GEN[ses==='F'?'F':'M'].find(x=>anno<x[0])[1];
/* Persone di origine straniera (il 9,4% dei residenti nel 2026): le comunità più numerose */
const NOMI_STRANIERI=[
  {M:['Andrei','Alexandru','Mihai'],F:['Ioana','Andreea','Alexandra'],c:['Popescu','Ionescu','Popa']},
  {M:['Ermal','Arben','Klajdi'],F:['Elira','Anisa','Klea'],c:['Hoxha','Shehu','Gashi']},
  {M:['Mohamed','Youssef','Amine'],F:['Fatima','Salma','Aya'],c:['El Idrissi','Benali','Alaoui']},
  {M:['Wei','Hao','Jun'],F:['Mei','Ying','Lin'],c:['Hu','Chen','Zhou']},
  {M:['Andriy','Oleh','Taras'],F:['Olena','Oksana','Iryna'],c:['Shevchenko','Kovalenko','Bondarenko']}
];
const CITTA=[
  {n:'Torino',mq:2100},{n:'Milano',mq:5200},{n:'Roma',mq:3600},{n:'Napoli',mq:2700},{n:'Palermo',mq:1600},
  {n:'Bologna',mq:3500},{n:'Firenze',mq:4000},{n:'Genova',mq:2000},{n:'Bari',mq:2400},{n:'Venezia',mq:4500},
  {n:'Verona',mq:2600},{n:'Catania',mq:1500},{n:'Cagliari',mq:2600},{n:'Trieste',mq:2200},{n:'Perugia',mq:1600},
  {n:'Lecce',mq:1700},{n:'Padova',mq:2500},{n:'Brescia',mq:2300},{n:'Pescara',mq:2000},{n:'Trento',mq:3300}
];
const CITTA_ESTERE=[{n:'Londra',mq:9500},{n:'Berlino',mq:5000},{n:'Barcellona',mq:4400},{n:'Parigi',mq:10000},{n:'Amsterdam',mq:7000}];

const MESI=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const TRATTI=[['Generoso','Generosa'],['Geloso','Gelosa'],['Divertente','Divertente'],['Ambizioso','Ambiziosa'],['Pigro','Pigra'],['Premuroso','Premurosa'],['Lunatico','Lunatica'],['Testardo','Testarda'],['Timido','Timida'],['Avventuroso','Avventurosa'],['Leale','Leale'],['Egoista','Egoista']];
const TR={GENEROSO:0,GELOSO:1,DIVERTENTE:2,AMBIZIOSO:3,PIGRO:4,PREMUROSO:5,LUNATICO:6,TESTARDO:7,TIMIDO:8,AVVENTUROSO:9,LEALE:10,EGOISTA:11};
const ABIL={sport:'Sport',musica:'Musica',arte:'Arte',cucina:'Cucina',tech:'Tecnologia',lingue:'Lingue'};

/* ---------- Istruzione ---------- */
const SUPERIORI=[
  {n:'Liceo scientifico',d:.62,sk:null,desc:'Matematica e scienze'},
  {n:'Liceo classico',d:.65,sk:null,desc:'Latino, greco e filosofia'},
  {n:'Liceo linguistico',d:.55,sk:'lingue',desc:'Tre lingue straniere'},
  {n:'Liceo artistico',d:.5,sk:'arte',desc:'Disegno e storia dell\'arte'},
  {n:'Liceo scientifico sportivo',d:.55,sk:'sport',desc:'Scienze e tanto sport'},
  {n:'Istituto tecnico informatico',d:.55,sk:'tech',desc:'Programmazione e reti'},
  {n:'Istituto tecnico economico',d:.5,sk:null,desc:'Ragioneria e contabilità'},
  {n:'Istituto alberghiero',d:.4,sk:'cucina',desc:'Cucina e accoglienza'},
  {n:'Istituto professionale',d:.35,sk:null,desc:'Meccanica ed elettronica'}
];
const FACOLTA=[
  {n:'Informatica',anni:3,d:.6,sk:'tech'},
  {n:'Ingegneria',anni:3,d:.72,sk:'tech'},
  {n:'Economia',anni:3,d:.55},
  {n:'Giurisprudenza',anni:5,cu:1,d:.65},
  {n:'Medicina',anni:6,cu:1,d:.75,test:72},
  {n:'Farmacia',anni:5,cu:1,d:.65},
  {n:'Architettura',anni:3,d:.6,test:50,sk:'arte'},
  {n:'Psicologia',anni:3,d:.55},
  {n:'Lettere',anni:3,d:.5},
  {n:'Lingue',anni:3,d:.5,sk:'lingue'},
  {n:'Scienze della comunicazione',anni:3,d:.45},
  {n:'Biologia',anni:3,d:.6},
  {n:'Matematica',anni:3,d:.75},
  {n:'Scienze motorie',anni:3,d:.45,sk:'sport'},
  {n:'Infermieristica',anni:3,d:.5,test:40},
  {n:'Scienze politiche',anni:3,d:.5}
];
const ITS=[
  {n:'ITS Digitale',cert:'Programmazione',sk:'tech'},
  {n:'ITS Logistica',cert:'Tecnico della logistica',sk:null},
  {n:'ITS Turismo e ospitalità',cert:'Cuoco professionista',sk:'cucina'}
];
const SPECIALIZZAZIONI=['Cardiologia','Pediatria','Chirurgia generale','Dermatologia','Psichiatria','Anestesia','Ortopedia'];
const ABILITAZIONI=[
  {n:'Avvocato',lau:'Giurisprudenza',p:.35,desc:'Esame da avvocato'},
  {n:'Medico',lau:'Medicina',p:.8,desc:'Abilitazione alla professione medica'},
  {n:'Psicologo',lau:'Psicologia',liv:4,p:.6,desc:'Esame di Stato da psicologo'},
  {n:'Commercialista',lau:'Economia',liv:4,p:.4,desc:'Esame da commercialista'},
  {n:'Architetto',lau:'Architettura',liv:4,p:.6,desc:'Esame di Stato da architetto'}
];
const CORSI=[
  {id:'b2',n:'Corso di inglese B2',costo:900,min:15,cert:'Inglese B2',sk:{lingue:18},p:()=>.5+S.intelligenza/250},
  {id:'spagnolo',n:'Corso di spagnolo',costo:700,min:14,cert:'Spagnolo B1',sk:{lingue:12},p:.75},
  {id:'haccp',n:'Attestato HACCP',costo:150,min:16,cert:'HACCP',p:.95},
  {id:'muletto',n:'Patentino del muletto',costo:300,min:18,cert:'Patentino muletto',p:.9},
  {id:'oss',n:'Corso OSS',costo:1500,min:18,cert:'OSS',p:.8},
  {id:'parr',n:'Corso di acconciatura',costo:2500,min:16,cert:'Acconciatore',sk:{arte:8},p:.85},
  {id:'cucina',n:'Scuola di cucina professionale',costo:3500,min:16,cert:'Cuoco professionista',sk:{cucina:22},p:.8},
  {id:'pt',n:'Certificazione personal trainer',costo:1200,min:18,cert:'Personal trainer',sk:{sport:8},p:()=>S.abil.sport>40?.85:.45},
  {id:'coding',n:'Bootcamp di programmazione',costo:4500,min:18,cert:'Programmazione',sk:{tech:22},p:()=>.3+S.intelligenza/150},
  {id:'foto',n:'Corso di fotografia',costo:900,min:14,sk:{arte:14},p:1},
  {id:'musica',n:'Lezioni private di musica',costo:1000,min:6,sk:{musica:14},p:1},
  {id:'teatro',n:'Corso di recitazione',costo:800,min:12,sk:{arte:10},p:1}
];
const HOBBY=[
  {id:'calcio',n:'Calcio',sk:'sport',s:1},
  {id:'nuoto',n:'Nuoto',sk:'sport',s:2},
  {id:'basket',n:'Pallacanestro',sk:'sport',s:1},
  {id:'danza',n:'Danza',sk:'sport',a:1},
  {id:'musica',n:'Scuola di musica',sk:'musica'},
  {id:'disegno',n:'Corso di disegno',sk:'arte'},
  {id:'teatro',n:'Teatro',sk:'arte'},
  {id:'robotica',n:'Club di robotica',sk:'tech'},
  {id:'cucina',n:'Corso di cucina',sk:'cucina'},
  {id:'lingue',n:'Lingue straniere',sk:'lingue'}
];

/* ---------- Lavori ----------
 liv: nomi per livello [maschile, femminile]; stip: RAL al primo livello; m: moltiplicatori per livello
 req: requisiti (tit, lau, liv, dip, cert, or, sk, int, sal, fed, eta, patente, abil, dott, master)
 pt: part-time compatibile con lo studio; conc: si entra per concorso; var: reddito variabile; promo: requisiti per salire di livello */
const MOLT=[1,1.35,1.8,2.6];
const LAVORI=[
  {id:'vol',liv:[['Volantinaggio']],stip:2500,pt:1,req:{eta:[14,99]}},
  {id:'rip',liv:[['Ripetizioni private']],stip:4000,pt:1,req:{eta:[16,99],int:65}},
  {id:'bpt',liv:[['Barista part-time']],stip:7000,pt:1,req:{eta:[16,99]}},
  {id:'cpt',liv:[['Commesso part-time','Commessa part-time']],stip:8000,pt:1,req:{eta:[16,99]}},
  {id:'rider',liv:[['Rider']],stip:13000,req:{}},
  {id:'cam',liv:[['Cameriere','Cameriera'],['Capo sala'],['Maître']],stip:16000,req:{}},
  {id:'com',liv:[['Commesso','Commessa'],['Capo reparto'],['Store manager'],['Area manager']],stip:17000,req:{},promo:{2:{tit:2}}},
  {id:'mag',liv:[['Magazziniere','Magazziniera'],['Carrellista'],['Capo turno'],['Responsabile logistica']],stip:18500,req:{},promo:{1:{cert:'Patentino muletto'}},boost:{cert:'Tecnico della logistica',liv:2}},
  {id:'ope',liv:[['Operaio','Operaia'],['Operaio specializzato','Operaia specializzata'],['Capo reparto']],stip:21000,req:{tit:1}},
  {id:'mur',liv:[['Muratore','Muratrice'],['Capocantiere']],stip:20000,req:{sal:50}},
  {id:'aut',liv:[['Autista'],['Autista di linea']],stip:22000,req:{patente:1,fed:1}},
  {id:'oss',liv:[['Operatore socio-sanitario','Operatrice socio-sanitaria'],['Coordinatore OSS','Coordinatrice OSS']],stip:21000,req:{cert:'OSS'}},
  {id:'cuoco',liv:[['Cuoco','Cuoca'],['Sous chef'],['Chef'],['Chef stellato','Chef stellata']],stip:22000,req:{or:[{dip:'Istituto alberghiero'},{cert:'Cuoco professionista'}]},promo:{3:{sk:['cucina',70]}}},
  {id:'parr',liv:[['Parrucchiere','Parrucchiera'],['Hair stylist']],stip:16000,req:{cert:'Acconciatore'}},
  {id:'pt',liv:[['Personal trainer']],stip:22000,req:{or:[{cert:'Personal trainer'},{lau:['Scienze motorie']}]}},
  {id:'imp',liv:[['Impiegato amministrativo','Impiegata amministrativa'],['Responsabile amministrativo','Responsabile amministrativa']],stip:24000,req:{tit:2}},
  {id:'rec',liv:[['Receptionist d\'hotel'],['Front office manager']],stip:21000,req:{tit:2,or:[{cert:'Inglese B2'},{dip:'Liceo linguistico'},{lau:['Lingue']}]}},
  {id:'tec',liv:[['Tecnico informatico','Tecnica informatica'],['Sistemista'],['Responsabile IT']],stip:26000,req:{or:[{dip:'Istituto tecnico informatico'},{cert:'Programmazione'},{lau:['Informatica','Ingegneria']}]}},
  {id:'agi',liv:[['Agente immobiliare'],['Responsabile di agenzia']],stip:24000,req:{tit:2},var:1},
  {id:'gra',liv:[['Grafico','Grafica'],['Art director']],stip:24000,req:{or:[{dip:'Liceo artistico'},{lau:['Architettura','Scienze della comunicazione']},{sk:['arte',60]}]}},
  {id:'pol',liv:[['Agente di polizia'],['Ispettore di polizia','Ispettrice di polizia'],['Commissario','Commissaria']],stip:27000,conc:1,req:{tit:2,fed:1,sal:55,eta:[18,32]},promo:{2:{tit:3}}},
  {id:'vvf',liv:[['Vigile del fuoco'],['Caposquadra'],['Caporeparto']],stip:26000,conc:1,req:{tit:2,fed:1,sal:65,eta:[18,30]}},
  {id:'comu',liv:[['Impiegato comunale','Impiegata comunale'],['Funzionario','Funzionaria'],['Dirigente comunale']],stip:25000,conc:1,req:{tit:2,fed:1},promo:{2:{tit:3}}},
  {id:'ins',liv:[['Insegnante precario','Insegnante precaria'],['Insegnante di ruolo'],['Dirigente scolastico','Dirigente scolastica']],stip:24000,req:{lau:['Lettere','Matematica','Lingue','Biologia','Scienze motorie','Ingegneria','Informatica','Psicologia'],liv:4,fed:1}},
  {id:'inf',liv:[['Infermiere','Infermiera'],['Coordinatore infermieristico','Coordinatrice infermieristica']],stip:30000,req:{lau:['Infermieristica']}},
  {id:'pro',liv:[['Programmatore junior','Programmatrice junior'],['Sviluppatore senior','Sviluppatrice senior'],['Tech lead'],['CTO']],stip:30000,req:{or:[{lau:['Informatica','Ingegneria','Matematica']},{cert:'Programmazione'}]}},
  {id:'gio',liv:[['Giornalista praticante'],['Giornalista'],['Caporedattore','Caporedattrice'],['Direttore di giornale','Direttrice di giornale']],stip:22000,req:{lau:['Lettere','Scienze della comunicazione','Scienze politiche','Lingue']}},
  {id:'mkt',liv:[['Marketing specialist'],['Marketing manager'],['Direttore marketing','Direttrice marketing']],stip:28000,req:{lau:['Economia','Scienze della comunicazione']}},
  {id:'cons',liv:[['Consulente junior'],['Consulente senior'],['Manager'],['Partner']],stip:32000,req:{lau:['Economia','Ingegneria','Matematica'],int:60}},
  {id:'comm',liv:[['Commercialista'],['Titolare di studio']],stip:40000,req:{lau:['Economia'],liv:4,abil:'Commercialista'}},
  {id:'avv',liv:[['Praticante avvocato','Praticante avvocata'],['Avvocato','Avvocata'],['Socio di studio legale','Socia di studio legale']],stip:15000,m:[1,2.7,6],req:{lau:['Giurisprudenza'],fed:1},promo:{1:{abil:'Avvocato'}}},
  {id:'psi',liv:[['Psicologo','Psicologa'],['Psicoterapeuta']],stip:30000,req:{lau:['Psicologia'],liv:4,abil:'Psicologo'}},
  {id:'ing',liv:[['Ingegnere junior','Ingegnera junior'],['Ingegnere senior','Ingegnera senior'],['Direttore tecnico','Direttrice tecnica']],stip:34000,req:{lau:['Ingegneria'],liv:4}},
  {id:'arc',liv:[['Architetto','Architetta'],['Titolare di studio']],stip:30000,req:{lau:['Architettura'],liv:4,abil:'Architetto'}},
  {id:'far',liv:[['Farmacista'],['Direttore di farmacia','Direttrice di farmacia']],stip:34000,req:{lau:['Farmacia']}},
  {id:'bio',liv:[['Biologo di laboratorio','Biologa di laboratorio'],['Responsabile di laboratorio']],stip:28000,req:{lau:['Biologia']}},
  {id:'med',liv:[['Medico','Medica'],['Medico specialista','Medica specialista'],['Primario','Primaria']],stip:55000,m:[1,1.4,2.2],req:{lau:['Medicina'],abil:'Medico'},promo:{1:{spec:1}}},
  {id:'ric',liv:[['Ricercatore universitario','Ricercatrice universitaria'],['Professore associato','Professoressa associata'],['Professore ordinario','Professoressa ordinaria']],stip:32000,req:{dott:1}},
  {id:'man',liv:[['Manager'],['Direttore generale','Direttrice generale'],['Amministratore delegato','Amministratrice delegata']],stip:55000,m:[1,1.8,4],req:{tit:3,master:1,int:65}},
  {id:'mus',liv:[['Musicista di strada'],['Turnista'],['Cantautore','Cantautrice'],['Star della musica']],stip:6000,m:[1,4,10,60],var:1,req:{sk:['musica',55]},promo:{3:{sk:['musica',85]}}},
  {id:'crea',liv:[['Content creator'],['Influencer'],['Star del web']],stip:3000,m:[1,10,45],var:1,req:{eta:[14,99]}},
  {id:'calc',liv:[['Calciatore di Serie C','Calciatrice di Serie C'],['Calciatore di Serie B','Calciatrice di Serie B'],['Calciatore di Serie A','Calciatrice di Serie A'],['Campione internazionale','Campionessa internazionale']],stip:40000,m:[1,3.5,20,60],nascosto:'scoutOk',req:{sk:['sport',70],eta:[16,34]},promo:{2:{sk:['sport',82]},3:{sk:['sport',92]}}}
];
const JOB={};LAVORI.forEach(j=>JOB[j.id]=j);
const IMPRESE=[
  {id:'shop',n:'Negozio online',costo:8000,sk:'tech'},
  {id:'agenzia',n:'Agenzia di comunicazione',costo:20000,sk:'arte'},
  {id:'startup',n:'Startup tecnologica',costo:40000,sk:'tech'},
  {id:'bar',n:'Bar',costo:60000,sk:'cucina'},
  {id:'palestra',n:'Palestra',costo:90000,sk:'sport'},
  {id:'ristorante',n:'Ristorante',costo:150000,sk:'cucina'}
];

/* ---------- Beni ---------- */
const CASE_TIPI=[
  {t:'Monolocale',mq:35},{t:'Bilocale',mq:55},{t:'Trilocale',mq:85},{t:'Quadrilocale',mq:110},
  {t:'Villetta con giardino',mq:150,lusso:1},{t:'Attico con terrazzo',mq:130,lusso:1,k:1.5},{t:'Casale in campagna',mq:200,k:.45}
];
const AFFITTI=[{t:'Stanza in condivisione',mq:18,k:1.1},{t:'Monolocale',mq:35},{t:'Bilocale',mq:55},{t:'Trilocale',mq:85}];
const AUTO=[
  {n:'Scooter 50',p:1900,costo:300,min:14,am:1},       // basta il patentino AM (dai 14 anni)
  {n:'Scooter 125',p:2800,costo:350,min:18},            // serve la patente (la B basta)
  {n:'Utilitaria usata',p:4500,costo:1100},
  {n:'Utilitaria nuova',p:15000,costo:1000},
  {n:'Station wagon',p:26000,costo:1400},
  {n:'Auto elettrica',p:34000,costo:700},
  {n:'SUV',p:38000,costo:1900},
  {n:'Moto sportiva',p:14000,costo:900},
  {n:'Berlina di lusso',p:65000,costo:3000},
  {n:'Auto sportiva',p:110000,costo:5000},
  {n:'Gommone',p:9000,costo:600,noPat:1},
  {n:'Barca a vela',p:65000,costo:4000,noPat:1},
  {n:'Yacht',p:1500000,costo:90000,noPat:1}
];
const ANIMALI=[
  {t:'Cane',nomi:['Rocky','Birba','Lilly','Pippo','Fido','Kira','Maya','Zeus','Argo','Lola','Toby','Nina','Bobo','Polpetta','Ugo','Stella'],max:[11,16]},
  {t:'Gatto',nomi:['Briciola','Pepe','Oliva','Mirtillo','Nuvola','Ciccio','Luna','Tigre','Micia','Fuffi','Romeo','Pantera','Zucchero','Gnocco','Salem','Mimì'],max:[12,19]},
  {t:'Coniglio',nomi:['Batuffolo','Carotina','Neve','Fiocco','Tappo','Cannella','Bianchina','Trottola'],max:[7,11]},
  {t:'Pappagallo',nomi:['Rio','Kiwi','Coco','Pedro','Lorito','Mango','Pistacchio','Ugo'],max:[15,30]}
];

/* ---------- Salute ---------- */
const MALATTIE={
  1:['Influenza','Bronchite','Mal di schiena','Gastrite','Otite','Tonsillite','Congiuntivite','Distorsione alla caviglia'],
  2:['Polmonite','Ernia del disco','Calcoli renali','Ulcera','Frattura al braccio'],
  3:['Diabete di tipo 2','Ipertensione','Asma','Artrosi','Emicrania cronica'],
  4:['Tumore','Insufficienza cardiaca']
};
/* Malattie dei bambini (molto più frequenti che negli adulti); la varicella si prende una volta sola */
const MAL_BIMBI=['Raffreddore','Otite','Influenza','Gastroenterite','Bronchite','Tonsillite','Scarlattina'];
/* Tumori per tipo: w = peso tra uomini e donne, sopr = sopravvivenza a 5 anni (AIOM, valori indicativi),
   m = rischio di morte in un anno se la malattia non è in remissione. «Tumore» generico = salvataggi vecchi. */
const TUMORI=[
  {n:'Tumore al seno',w:{M:0,F:40},sopr:.88,m:.04,min:25},
  {n:'Tumore alla prostata',w:{M:28,F:0},sopr:.91,m:.03,min:50},
  {n:'Tumore al colon',w:{M:16,F:15},sopr:.65,m:.12,min:30},
  {n:'Tumore al polmone',w:{M:18,F:9},fumo:3,sopr:.16,m:.45,min:35},
  {n:'Tumore alla vescica',w:{M:12,F:3},fumo:2,sopr:.79,m:.06,min:40},
  {n:'Tumore al pancreas',w:{M:5,F:6},sopr:.11,m:.6,min:40},
  {n:'Tumore allo stomaco',w:{M:6,F:4},sopr:.32,m:.3,min:40},
  {n:'Linfoma',w:{M:6,F:6},sopr:.67,m:.1},
  {n:'Tumore alla tiroide',w:{M:2,F:8},sopr:.93,m:.02,min:15},
  {n:'Leucemia',w:{M:4,F:3},sopr:.5,m:.2},
  {n:'Tumore al cervello',w:{M:3,F:3},sopr:.4,m:.3},
  {n:'Tumore',w:{M:0,F:0},sopr:.6,m:.12}
];
const TUMORE=Object.fromEntries(TUMORI.map(t=>[t.n,t]));
/* Malattie che possono portare alla morte: rischio in un anno */
const MORTALI={'Insufficienza cardiaca':.08,'Cirrosi epatica':.15,'Demenza':.025,'Cardiopatia ischemica':.02,'BPCO':.05,'Diabete di tipo 2':.005,'Ipertensione':.002};
const CAUSE={'Insufficienza cardiaca':'per un\'insufficienza cardiaca','Polmonite':'per le complicazioni di una polmonite','Infarto':'per un infarto','Cirrosi epatica':'per una cirrosi epatica','Demenza':'per le complicazioni della demenza','BPCO':'per una malattia cronica dei polmoni','Diabete di tipo 2':'per le complicazioni del diabete','Ipertensione':'per un ictus','Cardiopatia ischemica':'per un nuovo infarto'};
const causaTumore=n=>n==='Tumore'?'a causa di un tumore':n==='Linfoma'?'per un linfoma':n==='Leucemia'?'per una leucemia':'per un '+n.toLowerCase();

/* ---------- Reati ---------- */
const REATI={
  taccheggio:{n:'Furto in un negozio',g:1},
  rissa:{n:'Rissa',g:2},
  ebbrezza:{n:'Guida in stato di ebbrezza',g:2,patente:1},
  truffa:{n:'Truffa assicurativa',g:2},
  nero:{n:'Lavoro irregolare',g:1},
  evasione:{n:'Evasione fiscale',g:3},
  stradale:{n:'Omicidio stradale',g:4,patente:1},
  graffiti:{n:'Danneggiamento',g:1},
  furto:{n:'Furto',g:3},droga:{n:'Spaccio di stupefacenti',g:3}
};
