/* ================= LA VITA DI TUTTI I GIORNI (26–65) =================
   Eventi che nascono da come vivi in quel momento (ROADMAP, Fase 1.3): il mutuo e la casa, i figli adolescenti,
   i genitori che invecchiano, i colleghi, la salute che cambia, la stanchezza. Ognuno ha una condizione sullo stato. */
const mutuoMio=()=>S.prop.find(p=>p.mutuo&&p.mutuo.residuo>0);
const figliTra=(a,b)=>vivi(['Figlio']).filter(f=>f.eta>=a&&f.eta<=b&&!f.fuori&&!f.conEx);
const diProprieta=()=>S.casa.tipo==='proprieta';
const inCasaMia=()=>['affitto','proprieta'].includes(S.casa.tipo);

/* ---------- Casa e mutuo ---------- */
ev({id:'mez_tassi',min:25,max:70,rip:8,cond:()=>!!mutuoVar()&&!!S.fatti.rataSu&&S.t-S.fatti.rataSu.t<=12,t:'La rata sale',x:()=>{const s=S.fatti.rataSu;return `La banca ti scrive: il tuo mutuo è a tasso variabile e con i tassi in salita la rata passa da ${eur(s.da/12)} a ${eur(s.a/12)} al mese.`},c:[
  {l:'Chiedi di passare al tasso fisso',p:.55,si:{fx:()=>{const m=mutuoVar();if(m){const M=m.mutuo;M.tipo='fisso';M.tasso=tassoMutuo('fisso');M.rata=rataMutuo(M.residuo,Math.max(1,M.anni),M.tasso)}},pers:{C:2},r:'Un\'altra banca ti offre il fisso. Da adesso la rata non cambierà più.'},no:{fx:()=>{pesa(4,2)},pers:{N:1},r:'Nessuna banca accetta. La rata resta alta, e dipende dai tassi.'}},
  {l:'Estingui una parte del debito',sub:()=>eur(P(15000)),costo:()=>P(15000),pers:{C:2},fx:()=>{const m=mutuoVar();if(m){const M=m.mutuo;M.residuo=Math.max(0,M.residuo-P(15000));M.rata=M.residuo>0?rataMutuo(M.residuo,Math.max(1,M.anni),M.tasso):0}},r:'Meno debito, rata più leggera. I risparmi si assottigliano.'},
  {l:'Stringi la cinghia',pers:{N:1},fx:()=>{pesa(6,3)},r:'Meno cene fuori, niente vacanze lunghe. A fine mese si fanno i conti.'}]});
ev({id:'mez_condominio',min:28,max:90,rip:8,cond:diProprieta,t:'L\'assemblea di condominio',x:'Assemblea straordinaria: bisogna rifare la facciata. La tua quota sarebbe di circa 4.000 €.',c:[
  {l:'Voti a favore',sub:()=>eur(P(4000)),costo:()=>P(4000),pers:{C:1,A:1},fx:()=>{const c=casaMia();if(c)c.valore=Math.round(c.valore*1.03)},r:'Sei mesi di impalcature. Alla fine il palazzo è bellissimo e la casa vale un po\' di più.'},
  {l:'Voti contro e dai battaglia',pers:{A:-2,E:1},p:.35,si:{r:'Convinci la maggioranza: se ne riparlerà fra due anni. Il vicino del terzo non ti saluta più.'},no:{fx:()=>soldi(-P(4000)),r:'Passa lo stesso. Paghi, e in più ti sei fatt{o} dei nemici sul pianerottolo.'}},
  {l:'Non ci vai e deleghi l\'amministratore',pers:{E:-1},fx:()=>soldi(-P(4000)),r:'Decidono gli altri, paghi tu. Così funziona il condominio.'}]});
ev({id:'mez_caldaia',min:22,max:90,rip:10,cond:inCasaMia,t:'La caldaia',x:'Gennaio, meno due gradi fuori. La caldaia si blocca e non riparte.',c:[
  {l:'Chiami il tecnico subito',sub:()=>diProprieta()?eur(P(2500)):'Paga il padrone di casa',pers:{C:1},fx:()=>{if(diProprieta()){const x=P(2500);soldi(-x);return [`Caldaia da cambiare: ${eur(x)}. Ma dopo tre giorni la casa è di nuovo calda.`,'']}S.bis.stress=clamp(S.bis.stress+4);return ['Il padrone di casa ci mette una settimana a mandare qualcuno. Dormi con due piumoni.','']}},
  {l:'Provi a sistemarla da sol{o} con un tutorial',p:.35,si:{pers:{O:1,C:1},e:{f:3},r:'Premi il tasto giusto, purghi il termosifone, e riparte. Ti senti un ingegnere.'},no:{fx:()=>{soldi(-P(diProprieta()?2900:300));S.bis.stress=clamp(S.bis.stress+5)},pers:{O:1},r:'Peggiori le cose. Il tecnico ride, poi ti fa il conto.'}},
  {l:'Stufetta e coperte finché si può',pers:{C:-1},fx:()=>{S.bis.stress=clamp(S.bis.stress+3);if(chance(.3))ammala('Influenza',1)},r:'Una settimana in casa con il cappotto. Rimandare costa.'}]});
ev({id:'mez_bolletta',min:20,max:95,once:1,cond:()=>S.anno===2022&&inCasaMia(),t:'La bolletta',x:'Arriva la bolletta della luce e del gas: è più del doppio dell\'anno scorso. Con la guerra in Ucraina i prezzi dell\'energia sono esplosi.',c:[
  {l:'Abbassi i termosifoni a 19 gradi',pers:{C:2},fx:()=>{soldi(-P(400));S.bis.stress=clamp(S.bis.stress+2)},r:'Maglione in casa e lavatrici di notte. La bolletta dopo è più umana.'},
  {l:'Cambi fornitore',p:.6,si:{fx:()=>soldi(-P(300)),pers:{C:1,O:1},r:'Un contratto a prezzo bloccato: un affare, per una volta.'},no:{fx:()=>soldi(-P(900)),pers:{N:1},r:'Ti fai convincere da un venditore porta a porta. Il contratto nuovo è peggio del vecchio.'}},
  {l:'Paghi e non ci pensi',fx:()=>soldi(-P(800)),pers:{C:-1},r:'Il conto in banca accusa il colpo.'}]});
ev({id:'mez_lavatrice',min:22,max:90,rip:12,cond:inCasaMia,t:'La lavatrice',x:'La lavatrice fa un rumore di aereo in decollo, poi si ferma. Con dentro tutto il bucato.',c:[
  {l:'La ripari',sub:()=>eur(P(180)),costo:()=>P(180),pers:{C:1},r:'Il tecnico sostituisce un pezzo. Ripartita, per ora.'},
  {l:'Ne compri una nuova',sub:()=>eur(P(500)),costo:()=>P(500),pers:{O:1},r:'Classe energetica A, quaranta programmi. Ne userai due.'},
  {l:'Lavanderia a gettoni per un mese',pers:{O:1,E:1},fx:()=>soldi(-P(60)),r:'Un mese di lavanderia: scopri che è un posto pieno di storie.'}]});

/* ---------- Figli che crescono ---------- */
ev({id:'mez_figlio_superiori',min:30,max:65,chi:['Figlio'],pc:p=>p.eta===13&&!p.fuori&&!p.conEx,t:'Che scuola sceglie {P}?',x:'{Tuo} {P} finisce le medie. I prof consigliano un istituto tecnico, {lui} vorrebbe il liceo artistico.',c:[
  {l:'Decide {lui}',pers:{A:2,O:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6);d.p.voto=clamp((d.p.voto||60)+3)},r:'Si iscrive all\'artistico. Torna a casa con le mani sporche di colori e gli occhi accesi.'},
  {l:'{Lo} convinci a seguire i prof',pers:{C:2,A:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-4)},r:'Va al tecnico, e va bene. Ma a volte {lo} vedi disegnare di nascosto.'},
  {l:'Andate insieme agli open day',pers:{C:1,A:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3)},r:'Quattro scuole in due settimane. Alla fine sceglie, ed è una scelta pensata.'}]});
ev({id:'mez_figlio_camera',min:32,max:70,chi:['Figlio'],pc:p=>p.eta>=14&&p.eta<=19&&!p.fuori&&!p.conEx,t:'La porta chiusa',x:'Da settimane {P} esce dalla camera solo per mangiare. Videogiochi, cuffie, la porta sempre chiusa.',c:[
  {l:'Bussi e ti siedi sul letto a parlare',pers:{A:2,E:1},p:()=>.5+pz('A')*.2,si:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);ricorda(d.p,'Hai bussato alla sua porta quando ne aveva bisogno')},r:'All\'inizio risposte a monosillabi. Poi, dopo un\'ora, ti racconta di un periodo difficile a scuola.'},no:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto-2)},r:'«Dai, esci.» Ci riproverai.'}},
  {l:'Proponi di parlarne con uno psicologo',pers:{C:1,O:1},costo:()=>P(500),fx:d=>{d.p.umore=clamp((d.p.umore||50)+15);d.p.rapporto=clamp(d.p.rapporto+3)},r:'Dopo qualche seduta la porta resta aperta più spesso.'},
  {l:'Stacchi il wifi',pers:{C:1,A:-2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-8);ricorda(d.p,'Gli hai staccato internet'.replace('Gli',gp(d.p,'Gli','Le')))},r:'Una guerra fredda di tre giorni. Poi esce in salotto, ma solo per farti notare quanto è arrabbiat{po}.'}]});
ev({id:'mez_figlio_coming_out',min:35,max:75,once:1,chi:['Figlio'],pc:p=>p.eta>=15&&p.eta<=28&&!p.coming&&orientNpc(p)!=='etero',t:'Una cosa importante',x:d=>`${d.p.nome} ti chiede di sederti. Ha gli occhi lucidi. «Devo dirti una cosa: ${orientNpc(d.p)==='bi'?'mi piacciono sia i ragazzi sia le ragazze':'mi piacciono '+(d.p.sesso==='F'?'le ragazze':'i ragazzi')}.»`,c:[
  {l:'{Lo} abbracci forte',pers:{A:3,O:2},fx:d=>{d.p.coming=1;d.p.rapporto=clamp(d.p.rapporto+12);ricorda(d.p,'L\'hai abbracciat'+gp(d.p,'o','a')+' quando ti ha detto chi è')},r:'«Lo sapevo da un po\'. Ti voglio bene uguale. Anzi, di più.» Piange, ma di sollievo.'},
  {l:'Dici che ti serve un po\' di tempo',pers:{N:1},fx:d=>{d.p.coming=1;d.p.rapporto=clamp(d.p.rapporto-3)},r:'Ci pensi per giorni. Poi, una sera, cucini il suo piatto preferito. È il tuo modo di dirlo.'},
  {l:'Reagisci male',pers:{A:-3,O:-2},fx:d=>{d.p.coming=1;d.p.rapporto=clamp(d.p.rapporto-25);ricorda(d.p,'Hai reagito male quando ti ha detto chi è');pesa(5,3)},r:'Volano parole che non si possono riprendere. La distanza durerà a lungo.'}]});
ev({id:'mez_figlio_paghetta',min:30,max:65,chi:['Figlio'],pc:p=>p.eta>=12&&p.eta<=15&&!p.fuori&&!p.conEx,t:'La paghetta',x:'{P} sostiene che tutti i compagni prendono il doppio di paghetta. Si apre la trattativa.',c:[
  {l:'Raddoppi, in cambio di qualche lavoretto in casa',pers:{A:1,C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+4);soldi(-P(120))},r:'Il prato non è mai stato così tagliato.'},
  {l:'Resta com\'è: i soldi vanno guadagnati',pers:{C:2,A:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-3)},r:'Musi lunghi per una settimana. Poi trova un lavoretto: fa la spesa alla vicina.'},
  {l:'{Gli} apri un conto per ragazzi',pers:{C:2,O:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+2);soldi(-P(50))},r:'Una carta tutta sua e un\'app per vedere quanto spende. Lezione di vita.'}]});
ev({id:'mez_figlio_fidanzato',min:35,max:70,chi:['Figlio'],pc:p=>p.eta>=16&&p.eta<=22&&!p.fuori&&!p.conEx,t:'A cena con il nuovo amore',x:'{P} porta a cena per la prima volta la persona con cui sta insieme.',c:[
  {l:'Accogli il nuovo arrivo come uno di famiglia',pers:{A:2,E:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6)},r:'Cena allegra. Alla fine ti chiedono la ricetta del sugo. Promozione piena.'},
  {l:'Fai il terzo grado',pers:{A:-2,C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-5)},r:'Lavoro, famiglia, intenzioni. {P} ti fulmina con lo sguardo per tutta la cena.'},
  {l:'Racconti aneddoti imbarazzanti di quando {P} era piccol{po}',pers:{E:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-2);mod('felicita',3)},r:'Ridono tutti, tranne {P}. Che però, sotto sotto, sorride.'}]});
ev({id:'mez_figlio_estero',min:42,max:75,chi:['Figlio'],pc:p=>p.eta>=22&&p.eta<=32&&!p.lontano,t:'Parte per l\'estero',x:'{P} ha trovato lavoro a Berlino: stipendio doppio rispetto all\'Italia. Parte tra un mese.',c:[
  {l:'{Lo} incoraggi, anche se ti si stringe il cuore',pers:{A:2,O:1},fx:d=>{d.p.lontano=true;d.p.dove='Berlino';d.p.rapporto=clamp(d.p.rapporto+6);mod('felicita',-3);pesa(3,1)},r:'All\'aeroporto fai il brav{o} fino al controllo. Poi in macchina piangi.'},
  {l:'Provi a convincer{lo} a restare',pers:{A:-1,N:1},p:.25,si:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto-4)},r:'Resta. Ogni tanto, a cena, ti chiedi se hai fatto bene.'},no:{fx:d=>{d.p.lontano=true;d.p.dove='Berlino';d.p.rapporto=clamp(d.p.rapporto-6)},r:'Parte lo stesso, con un po\' di amarezza nella valigia.'}},
  {l:'Le videochiamate della domenica',pers:{C:1},fx:d=>{d.p.lontano=true;d.p.dove='Berlino';d.p.rapporto=clamp(d.p.rapporto+2)},r:'Ogni domenica alle sette, puntuale. Ti fa vedere la sua cucina, i colleghi, la neve.'}]});
ev({id:'mez_figlio_affitto',min:45,max:80,chi:['Figlio'],pc:p=>p.eta>=24&&p.eta<=38&&p.fuori,t:'Un aiuto per l\'affitto',x:'{P} ti chiama: tra affitto e stipendio basso, questo mese non ce la fa.',c:[
  {l:'{Gli} fai un bonifico',sub:()=>eur(P(600)),costo:()=>P(600),pers:{A:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6);ricorda(d.p,'L\'hai aiutat'+gp(d.p,'o','a')+' a pagare l\'affitto')},r:'«Te li restituisco.» Non importa. Ma lo farà.'},
  {l:'{Lo} aiuti a fare un bilancio delle spese',pers:{C:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+2)},r:'Un pomeriggio con un foglio di calcolo. Scoprite tre abbonamenti inutili.'},
  {l:'È ora che si arrangi',pers:{A:-2,C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-8);ricorda(d.p,'Non l\'hai aiutat'+gp(d.p,'o','a')+' quando era in difficoltà')},r:'Si arrangia. Ma per un po\' le telefonate si diradano.'}]});
ev({id:'mez_figlio_maturita',min:36,max:70,chi:['Figlio'],pc:p=>p.eta===18&&!p.fuori&&!p.conEx,t:'La maturità di {P}',x:'Domani {P} ha la prima prova della maturità. Stanotte non dorme, e tu nemmeno.',c:[
  {l:'Prepari la colazione dei campioni',pers:{A:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+4);d.p.voto=clamp((d.p.voto||60)+2)},r:'Esce di casa con un cornetto in mano e un sorriso tirato. Andrà bene.'},
  {l:'Racconti della tua maturità',pers:{E:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3)},r:'Ride della traccia che avevi scelto tu. Per un attimo si dimentica l\'ansia.'},
  {l:'{Lo} lasci in pace',pers:{E:-1},r:'A volte il silenzio è il regalo migliore.'}]});

/* ---------- Genitori che invecchiano ---------- */
ev({id:'mez_gen_caduta',min:35,max:75,chi:['Madre','Padre'],pc:p=>p.eta>=75,t:'La caduta',x:'{Tuo} {P} è cadut{po} in bagno. Frattura del femore: operazione e settimane di riabilitazione.',c:[
  {l:'Prendi le ferie e stai con {lui}',pers:{A:3},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+10);ricorda(d.p,'Sei rimast'+g('o','a')+' con lui in ospedale'.replace('lui',gp(d.p,'lui','lei')));S.bis.energia=clamp(S.bis.energia-12);if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-3)},r:'Corridoi d\'ospedale, caffè della macchinetta, mani strette. Torna a camminare, piano piano.'},
  {l:'Organizzi i turni con i parenti',cond:()=>vivi(['Fratello','Zio','Cugino']).length>0,pers:{C:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+5);S.bis.stress=clamp(S.bis.stress+4)},r:'Un foglio condiviso, un turno a testa. Funziona, quasi sempre.'},
  {l:'Paghi una badante per la convalescenza',sub:()=>eur(P(2400)),costo:()=>P(2400),pers:{C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+1)},r:'Due mesi di assistenza a casa. Tu passi la domenica.'}]});
ev({id:'mez_gen_patente',min:40,max:75,chi:['Madre','Padre'],pc:p=>p.eta>=80,t:'Le chiavi della macchina',x:d=>`${cap(tuoR(d.p))} ${d.p.nome} ha ${d.p.eta} anni e guida ancora. L'altro giorno ha preso un paletto in retromarcia, e ha detto che si era spostato il paletto.`,c:[
  {l:'{Gli} parli con delicatezza',pers:{A:2,C:1},p:.55,si:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto-2)},r:'Ci vuole una settimana, ma accetta. Da oggi la spesa la fate insieme il sabato.'},no:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto-6)},r:'«Io guido da sessant\'anni!» Le chiavi restano dove sono. Per ora.'}},
  {l:'Nascondi le chiavi',pers:{A:-2,C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-10);ricorda(d.p,'Gli hai nascosto le chiavi della macchina'.replace('Gli',gp(d.p,'Gli','Le')))},r:'Un mese di musi lunghi. Ma dormi più tranquill{o}.'},
  {l:'Lasci correre',pers:{A:1,C:-1},fx:()=>pesa(3,1),r:'Ogni volta che squilla il telefono, ti si gela il sangue.'}]});
ev({id:'mez_gen_smarrito',min:40,max:80,chi:['Madre','Padre'],pc:p=>p.eta>=78&&p.malattia!=='Demenza',t:'Si è pers{po}',x:'{Tuo} {P} è uscit{po} a comprare il pane ed è rimast{po} due ore sedut{po} su una panchina, senza ricordarsi la strada di casa.',c:[
  {l:'Prenoti una visita dal geriatra',pers:{C:2},fx:d=>{if(chance(.6)){d.p.malato=3;d.p.malattia='Demenza';return [`La diagnosi è un inizio di demenza. Con le cure giuste ${d.p.nome} potrà stare a casa ancora a lungo. Ma va organizzato tutto.`,'b']}return ['Era un episodio di stanchezza e di pressione bassa. Questa volta.','']}},
  {l:'{Gli} metti un localizzatore al polso',pers:{C:1,O:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-1)},r:'Ora sai sempre dov\'è, ma la paura non se ne va.'},
  {l:'Pensi che sia l\'età',pers:{N:-1},fx:()=>pesa(2,1),r:'Ti convinci che sia normale. Una parte di te sa che non lo è.'}]});
ev({id:'mez_gen_casa',min:45,max:80,chi:['Madre','Padre'],pc:p=>p.eta>=78&&p.coppia==='vedovo',t:'La casa è troppo grande',x:'Da quando è rimast{po} sol{po}, {P} vive in una casa troppo grande, con le scale e i ricordi.',c:[
  {l:'{Lo} porti a vivere con te',cond:inCasaMia,pers:{A:3},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+12);S.bis.stress=clamp(S.bis.stress+6);const pa=partnerAttuale();if(pa&&pa.conv)pa.intim=clamp(pa.intim-4)},r:'Una stanza in più occupata, una presenza in più a cena. Fatica e tenerezza, insieme.'},
  {l:'Cercate un appartamento vicino a te',pers:{C:2,A:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6)},r:'Due stanze al piano terra, a cinque minuti da te. Un trasloco pieno di scatoloni e di storie.'},
  {l:'Rispetti la sua scelta di restare',pers:{A:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+2);pesa(2,1)},r:'«Qui ci sono tutti i miei ricordi.» Fai mettere un corrimano sulle scale.'}]});
ev({id:'mez_gen_ottanta',min:45,max:70,chi:['Madre','Padre'],pc:p=>p.eta===80,t:'Ottant\'anni',x:'{Tuo} {P} compie ottant\'anni. La famiglia vuole organizzare qualcosa.',c:[
  {l:'Una grande festa a sorpresa',sub:()=>eur(P(800)),costo:()=>P(800),pers:{E:2,A:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+10);mod('felicita',5);relGruppo(famIn(),2,4)},r:'Cugini arrivati da lontano, una torta con le foto di una vita. {P} non smette di sorridere.'},
  {l:'Un album con le foto di tutta la vita',pers:{A:2,C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8)},r:'Ci metti un mese a raccogliere le foto. {P} lo sfoglia per ore, raccontando ogni pagina.'},
  {l:'Un pranzo tranquillo, in famiglia',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+4)},r:'Il suo piatto preferito e le solite storie. Esattamente quello che voleva.'}]});
ev({id:'mez_sandwich',min:35,max:58,rip:8,cond:()=>figliTra(0,13).length>0&&vivi(['Madre','Padre']).some(p=>p.eta>=75),t:'In mezzo',x:'La mattina porti i bambini a scuola, il pomeriggio accompagni i tuoi genitori alle visite. La sera crolli.',c:[
  {l:'Chiedi aiuto: non puoi fare tutto da sol{o}',pers:{E:1,N:-1},fx:()=>{S.bis.stress=clamp(S.bis.stress-8);vivi(['Fratello']).forEach(f=>f.rapporto=clamp(f.rapporto-1))},r:'Una vicina, un fratello, una baby-sitter. Respiri un po\'.'},
  {l:'Tieni duro',pers:{C:1,N:2},fx:()=>{pesa(8,3);S.bis.energia=clamp(S.bis.energia-10)},r:'Vai avanti. Non sai bene come, ma vai avanti.'},
  {l:'Ti prendi una sera solo per te',pers:{N:-1},fx:()=>{S.bis.stress=clamp(S.bis.stress-6);mod('felicita',3)},r:'Un cinema da sol{o}. Ti senti in colpa per dieci minuti, poi benissimo.'}]});

/* ---------- Lavoro e colleghi ---------- */
ev({id:'mez_merito',min:24,max:66,rip:8,cond:()=>!!S.lavoro&&!JOB[S.lavoro.id].pt,t:'Il merito',x:d=>{if(d.n===undefined)d.n=pick(squadra().colleghi)||null;return d.n?`In riunione ${d.n.nome} presenta come sua l'idea che ${gp(d.n,'gli','le')} avevi raccontato davanti alla macchinetta.`:'In riunione un collega presenta come sua l\'idea che gli avevi raccontato davanti alla macchinetta.'},c:[
  {l:'Lo fai notare, con calma, davanti a tutti',pers:{E:2,A:-1},p:.6,si:{e:{perf:5},r:'«Ne avevamo parlato insieme, giusto?» Il capo capisce al volo.'},no:{e:{perf:-1},pers:{N:1},r:'Il collega nega con un sorriso. Clima gelido per mesi.'}},
  {l:'Ne parli dopo con il capo',pers:{C:1},e:{perf:3},r:'Il capo prende nota. La prossima idea la mandi per email, con la data.'},
  {l:'Lasci perdere',pers:{A:1,N:1},e:{perf:-2},r:'Il collega viene promosso sei mesi dopo. Coincidenze.'}]});
ev({id:'mez_capo_giovane',min:42,max:66,once:1,cond:()=>!!S.lavoro&&!JOB[S.lavoro.id].pt&&!squadra().capo,t:'Il nuovo capo',x:'Il nuovo responsabile ha quindici anni meno di te e dice spesso «facciamo sinergia».',c:[
  {l:'Gli offri la tua esperienza',pers:{A:2,O:1},e:{perf:4},r:'Diventi il suo punto di riferimento. Lui porta le idee, tu sai dove sono le trappole.'},
  {l:'Lo aspetti al varco',pers:{A:-2},e:{perf:-3},r:'Sbaglia una scadenza e tu non lo avvisi. Il clima in ufficio peggiora per tutti.'},
  {l:'Fai il tuo e basta',pers:{E:-1},r:'Le riunioni si allungano, il tuo lavoro resta lo stesso.'}]});
ev({id:'mez_messaggio_sera',min:22,max:66,rip:6,cond:()=>!!S.lavoro&&S.anno>=2015,t:'Il messaggio delle 22',x:'Sono le dieci di sera. Il capo scrive nel gruppo di lavoro: «Domattina mi servirebbe la presentazione aggiornata».',c:[
  {l:'Rispondi e ci lavori fino a mezzanotte',pers:{C:2,N:1},fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+4);S.bis.stress=clamp(S.bis.stress+6);S.bis.energia=clamp(S.bis.energia-6)},r:'Presentazione perfetta. Gli occhi un po\' meno.'},
  {l:'Rispondi domattina',pers:{N:-1},fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-1)},r:'Alle otto e mezza la prepari in fretta. Va bene lo stesso.'},
  {l:'Proponi una regola: niente messaggi dopo le 20',pers:{E:1,C:1},p:.5,si:{fx:()=>{S.bis.stress=clamp(S.bis.stress-4)},r:'I colleghi ti ringraziano in privato. Il capo, dopo qualche resistenza, accetta.'},no:{fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-3)},r:'«Qui siamo una squadra, eh.» La regola non passa.'}}]});
ev({id:'mez_festa_pensione',min:30,max:62,rip:10,cond:()=>!!S.lavoro,t:'La festa di pensionamento',x:'Va in pensione il collega più anziano dell\'ufficio, quello che c\'era da sempre. Ti chiedono di dire due parole.',c:[
  {l:'Un discorso commovente',pers:{E:2,A:1},fx:()=>{S.bis.soc=clamp(S.bis.soc+6);mod('felicita',3)},r:'Ti trema la voce sul finale. Lui ti abbraccia e ti regala la sua tazza.'},
  {l:'Un discorso pieno di aneddoti divertenti',pers:{E:2,O:1},fx:()=>{S.bis.soc=clamp(S.bis.soc+6)},r:'Tutto l\'ufficio ride, lui più di tutti.'},
  {l:'Lasci parlare un altro',pers:{E:-2},r:'Applaudi in fondo. Pensi a quando toccherà a te.'}]});
ev({id:'mez_riunione',min:22,max:66,rip:6,cond:()=>!!S.lavoro&&!JOB[S.lavoro.id].pt,t:'La riunione',x:'Terza riunione della giornata. Si discute da un\'ora di un argomento che poteva essere un messaggio di due righe.',c:[
  {l:'Proponi di chiudere con tre decisioni',pers:{C:2,E:1},e:{perf:3},r:'Dieci minuti dopo siete fuori. Ti guardano come un eroe.'},
  {l:'Lavori di nascosto al computer',pers:{C:1,A:-1},r:'Finisci due cose mentre gli altri parlano. Nessuno se ne accorge.'},
  {l:'Ti perdi nei tuoi pensieri',pers:{O:1,C:-1},r:'Hai progettato mentalmente le prossime vacanze. Alla fine ti chiedono un parere: improvvisi.'}]});
ev({id:'mez_aggiornamento',min:30,max:60,rip:10,cond:()=>!!S.lavoro,t:'Il corso di aggiornamento',x:'L\'azienda propone un corso serale sui nuovi strumenti digitali. Facoltativo, ma «molto apprezzato».',c:[
  {l:'Ti iscrivi e lo segui tutto',pers:{O:2,C:2},fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+6);S.bis.energia=clamp(S.bis.energia-6);mod('intelligenza',1)},r:'Tre mesi di serate. Ma ora sei la persona a cui tutti chiedono aiuto.'},
  {l:'Lo segui, ma con la testa altrove',pers:{C:-1},fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+2)},r:'Attestato in tasca. Contenuti, pochi.'},
  {l:'Non ti interessa',pers:{O:-2},fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-2)},r:'Le serate restano tue. I programmi nuovi, un mistero.'}]});

/* ---------- Corpo che cambia, salute, stanchezza ---------- */
ev({id:'mez_menopausa',min:47,max:55,once:1,cond:()=>S.sesso==='F',t:'Le vampate',x:'Vampate di calore in riunione, notti in bianco, umore sulle montagne russe. Il corpo sta entrando in menopausa.',c:[
  {l:'Ne parli con la ginecologa',pers:{C:1,N:-1},fx:()=>{S.bis.stress=clamp(S.bis.stress-6);mod('salute',1)},r:'Ti spiega cosa succede e quali cure ci sono. Sapere aiuta moltissimo.'},
  {l:'Più movimento e meno caffè',pers:{C:2},fx:()=>{S.bis.forma=clamp(S.bis.forma+5);mod('salute',2)},r:'Camminate veloci la mattina. Le notti migliorano un po\'.'},
  {l:'Ne ridi con le amiche',pers:{E:2,N:-1},fx:()=>{S.bis.soc=clamp(S.bis.soc+6);mod('felicita',2)},r:'Scoprite di avere tutte gli stessi sintomi. Il gruppo diventa «Le Vampate».'}]});
ev({id:'mez_prostata',min:52,max:70,once:1,cond:()=>S.sesso==='M',t:'Il controllo',x:'Il medico di base, al momento dei saluti: «Alla sua età, un controllo della prostata andrebbe fatto.»',c:[
  {l:'Prenoti subito la visita',pers:{C:2},fx:()=>{mod('salute',1);S.fatti.screening=(S.fatti.screening||0)+1},r:'Tutto a posto. Il prossimo controllo fra due anni, e lo segni in agenda.'},
  {l:'Rimandi: ti imbarazza',pers:{N:1,C:-1},r:'Lo metti in fondo alla lista. Molto in fondo.'},
  {l:'Ci vai e convinci anche un amico',cond:()=>vivi(['Amico']).length>0,pers:{A:1,C:1},fx:()=>{const a=pick(vivi(['Amico']));a.rapporto=clamp(a.rapporto+4);mod('salute',1)},r:'Sala d\'attesa in due, battute per sdrammatizzare. Tutto bene per entrambi.'}]});
ev({id:'mez_insonnia',min:30,max:70,rip:6,cond:()=>S.bis.stress>=50,t:'Le tre di notte',x:'Sono le tre di notte e sei sveglissim{o}. La testa gira su lavoro, soldi, cose da fare.',c:[
  {l:'Ti alzi e scrivi tutto su un foglio',pers:{C:2,N:-1},fx:()=>{S.bis.stress=clamp(S.bis.stress-5)},r:'Messe su carta, le preoccupazioni sembrano più piccole. Ti riaddormenti alle quattro.'},
  {l:'Prendi il telefono',pers:{C:-1,N:1},fx:()=>{S.bis.energia=clamp(S.bis.energia-6)},r:'Alle cinque stai guardando video di gente che restaura mobili. La giornata sarà lunga.'},
  {l:'Da domani niente schermi dopo le dieci',pers:{C:2},fx:()=>{S.routine.schermi=Math.max(0,(S.routine.schermi||0)-3);S.bis.energia=clamp(S.bis.energia+4)},r:'Un libro invece del telefono. Dopo una settimana dormi meglio.'}]});
ev({id:'mez_bilancia',min:35,max:65,once:1,cond:()=>S.bis.forma<45,t:'La bilancia',x:'Dalla bilancia arriva un numero che non vedevi da mai: otto chili in più rispetto a cinque anni fa.',c:[
  {l:'Ti iscrivi a un gruppo di cammino',pers:{E:1,C:1},fx:()=>{aggiungiOre('sport',3);S.bis.forma=clamp(S.bis.forma+4)},r:'Il martedì e il giovedì, con un gruppo di sconosciuti diventati amici.'},
  {l:'Cambi alimentazione',pers:{C:2},fx:()=>{mod('salute',2);S.bis.forma=clamp(S.bis.forma+3)},r:'Meno pane, più verdure. Il nutrizionista è contento, tu un po\' affamat{o}.'},
  {l:'Cambi bilancia',pers:{C:-2,O:1},e:{f:1},r:'Quella nuova segna due chili in meno. Problema risolto.'}]});
ev({id:'mez_domenica',min:24,max:62,rip:8,cond:()=>!!S.lavoro&&soddLavoro()<50,t:'La domenica sera',x:'Domenica, le otto di sera. Ti prende quella sensazione di peso: domani è lunedì.',c:[
  {l:'Programmi qualcosa di bello per lunedì sera',pers:{O:1,C:1},fx:()=>{mod('felicita',2)},r:'Una pizza con gli amici il lunedì. La settimana sembra più corta.'},
  {l:'Inizi a guardare offerte di lavoro',pers:{O:2},fx:()=>{S.fatti.cercaAltro=S.t},r:'Tre annunci interessanti. Le offerte sono nella scheda Lavoro.'},
  {l:'Ti distrai con una serie TV',pers:{N:1},fx:()=>{S.bis.stress=clamp(S.bis.stress+2)},r:'Quattro episodi. Lunedì arriva lo stesso, e tu sei pure stanc{o}.'}]});
ev({id:'mez_dentista',min:32,max:75,once:1,t:'Il preventivo',x:'Il dentista ti consegna il preventivo per un impianto: 2.500 €. Il servizio pubblico ha liste d\'attesa di otto mesi.',c:[
  {l:'Paghi e lo fai subito',sub:()=>eur(P(2500)),costo:()=>P(2500),pers:{C:1},fx:()=>mod('salute',2),r:'Un sorriso nuovo. E un conto più leggero.'},
  {l:'Aspetti il servizio pubblico',pers:{C:1,N:1},fx:()=>{S.bis.stress=clamp(S.bis.stress+3);mod('salute',1)},r:'Otto mesi diventano undici. Ma alla fine paghi solo il ticket.'},
  {l:'Vai in Croazia, dove costa la metà',sub:()=>eur(P(1400)),costo:()=>P(1400),pers:{O:2},fx:()=>mod('salute',1),r:'Tre giorni a Fiume tra studio dentistico e lungomare. Turismo dentale.'}]});
ev({id:'mez_ponte',min:25,max:62,rip:6,cond:()=>!!S.lavoro&&S.bis.stress>=45,t:'Il ponte',x:'C\'è un ponte di quattro giorni in arrivo. Sei stanc{o} come non mai.',c:[
  {l:'Un weekend fuori, anche vicino',sub:()=>eur(P(300)),costo:()=>P(300),pers:{O:1},fx:()=>{S.bis.stress=clamp(S.bis.stress-12);mod('felicita',4)},r:'Un borgo a due ore da casa, un agriturismo, nessuna email. Torni un\'altra persona.'},
  {l:'Quattro giorni di divano',pers:{E:-1},fx:()=>{S.bis.stress=clamp(S.bis.stress-8);S.bis.energia=clamp(S.bis.energia+10)},r:'Sonno, film e pasta al pomodoro. Senza vergogna.'},
  {l:'Lavori anche al ponte per portarti avanti',pers:{C:2,N:1},fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+3);S.bis.stress=clamp(S.bis.stress+4)},r:'Sei avanti di una settimana. E stanc{o} di un mese.'}]});

/* ---------- Soldi e burocrazia ---------- */
ev({id:'mez_730',min:24,max:70,rip:8,cond:()=>!!S.lavoro&&!isPiva(S.lavoro),t:'Il 730',x:'È la stagione della dichiarazione dei redditi. Il CAF ha la coda fino in strada; il precompilato è online.',c:[
  {l:'Lo fai al CAF con tutti gli scontrini',pers:{C:2},fx:()=>{const x=P(r(150,450));soldi(x);return [`Spese mediche, interessi del mutuo, palestra dei figli: a luglio arriva un rimborso di ${eur(x)}.`,'g']}},
  {l:'Accetti il precompilato così com\'è',pers:{C:-1},fx:()=>{const x=P(r(30,120));soldi(x);return [`Due clic. Rimborso di ${eur(x)}: forse potevi ottenere di più.`,'']}},
  {l:'Lo dimentichi',pers:{C:-2},fx:()=>{S.bis.stress=clamp(S.bis.stress+3)},r:'Te ne ricordi a ottobre. Il rimborso arriverà l\'anno prossimo, se tutto va bene.'}]});
ev({id:'mez_auto_vecchia',min:30,max:80,rip:10,cond:()=>haAuto(),t:'L\'auto ha quindici anni',x:'Il meccanico scuote la testa: frizione, distribuzione e gomme. Ripararla costa quasi quanto vale.',c:[
  {l:'La ripari un\'ultima volta',sub:()=>eur(P(1800)),costo:()=>P(1800),pers:{C:1,O:-1},r:'Ancora un paio d\'anni insieme, vecchia mia.'},
  {l:'Ne compri una usata',sub:()=>eur(P(9000)),costo:()=>P(9000),pers:{C:1},fx:()=>{const v=S.veicoli.find(x=>!/Scooter|Gommone|Barca|Yacht/.test(x.n));if(v){v.stato=95;v.valore=P(9000)}},r:'Un\'utilitaria di cinque anni, tenuta bene. Il vecchio catorcio lo saluti con un po\' di nostalgia.'},
  {l:'Rinunci all\'auto: bici e mezzi pubblici',cond:()=>luogo().p>=100000,pers:{O:2},fx:()=>{const i=S.veicoli.findIndex(x=>!/Scooter|Gommone|Barca|Yacht/.test(x.n));if(i>=0)S.veicoli.splice(i,1);S.bis.forma=clamp(S.bis.forma+3)},r:'All\'inizio è dura. Dopo tre mesi non torneresti più indietro.'}]});

/* ---------- La coppia di lunga data ---------- */
ev({id:'mez_routine',min:35,max:65,rip:8,cond:()=>{const p=partnerAttuale();return !!(p&&p.ruolo==='Coniuge'&&p.nozze!==undefined&&S.t-p.nozze>=96)},t:'La routine',x:()=>{const p=partnerAttuale();return `Con ${p.nome} parlate soprattutto di bollette, spesa e orari dei figli. Vi ricordate quando parlavate di tutto?`},c:[
  {l:'Una sera a settimana solo per voi',pers:{C:1,A:1},fx:()=>{const p=partnerAttuale();aggiungiOre('partner',3);p.intim=clamp(p.intim+6);p.pass=clamp(p.pass+5)},r:'Il giovedì è vostro: cinema, cena o una passeggiata. Ritrovate il filo.'},
  {l:'Un weekend a sorpresa',sub:()=>eur(P(400)),costo:()=>P(400),pers:{O:1,E:1},fx:()=>{const p=partnerAttuale();p.pass=clamp(p.pass+10);p.intim=clamp(p.intim+4)},r:'Una città d\'arte, una camera con vista. Sembrate due ragazzi.'},
  {l:'La routine è anche sicurezza',pers:{O:-1},fx:()=>{const p=partnerAttuale();p.pass=clamp(p.pass-3);p.imp=clamp(p.imp+2)},r:'Non tutto deve essere una favola. Ma un po\' di scintilla manca.'}]});
ev({id:'mez_amici_figli',min:30,max:45,once:1,cond:()=>figliTra(0,6).length>0&&vivi(['Amico']).some(a=>!a.figliN),t:'Gli amici senza figli',x:'Gli amici senza figli organizzano aperitivi alle nove di sera. Tu alle nove stai leggendo una fiaba per la terza volta.',c:[
  {l:'Ogni tanto ti prendi la serata',pers:{E:1},fx:()=>{vivi(['Amico']).slice(0,3).forEach(a=>a.rapporto=clamp(a.rapporto+4));S.bis.soc=clamp(S.bis.soc+6)},r:'Una volta al mese, con la baby-sitter. Torni a casa a mezzanotte, felice e distrutt{o}.'},
  {l:'Li inviti a pranzo da voi, con i bambini',pers:{A:1,O:1},fx:()=>{vivi(['Amico']).slice(0,3).forEach(a=>a.rapporto=clamp(a.rapporto+3))},r:'Scoprono che i tuoi figli sono simpatici. Alcuni ne escono traumatizzati.'},
  {l:'Lasci che le amicizie cambino',pers:{O:1,E:-1},fx:()=>{vivi(['Amico']).filter(a=>!a.figliN).forEach(a=>a.rapporto=clamp(a.rapporto-6))},r:'Nuovi amici: i genitori dei compagni di scuola. Altri discorsi, altre risate.'}]});
