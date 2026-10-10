/* ================= EVENTI =================
 Campi evento: id, min, max, w (peso), once, rip (anni prima di ripetersi), cond(d), chi (ruoli persona), pc(p), link (solo come conseguenza), prig (in carcere), auto (conseguenza silenziosa)
 t titolo, x testo, c scelte. Segnaposto: {o} desinenza tua, {P} nome persona, {po} desinenza persona, {Tuo}/{tuo} "Tua sorella", {lui} {gli} {lo}, {xe} importo
 Scelta: l, sub, cond, costo, p + si/no, oppure e (effetti), r (testo), fl (flag), fut [anni,id], pr (reato), fx(d) */
const EV={};
const ev=o=>{EV[o.id]=o};
const hobbySk=()=>{const h=HOBBY.find(x=>x.id===S.hobby);return h?h.sk:null};
const haAuto=()=>S.veicoli.some(v=>!/Scooter|Gommone|Barca|Yacht/.test(v.n));   // le barche non sono auto
const lavora=()=>S.lavoro&&!JOB[S.lavoro.id].pt;
const single=()=>!partnerAttuale();

/* ---------- Eventi di sistema ---------- */
ev({id:'scelta_hobby',link:1,t:"Un'attività per il pomeriggio",x:"I tuoi genitori vogliono iscriverti a un'attività dopo la scuola. Cosa scegli? Quello che pratichi da piccolo può diventare il tuo futuro.",
  c:()=>[...HOBBY.map(h=>({l:h.n,sub:ABIL[h.sk],fx:()=>{S.hobby=h.id;return [`Ti iscrivi a: ${h.n.toLowerCase()}. Ogni anno migliorerai un po'.`,'g']}})),{l:'Niente, preferisco giocare',e:{f:3},r:'Pomeriggi liberi, divano e cartoni animati.'}]});
ev({id:'superiori',link:1,t:'Che scuola superiore scegli?',x:'Hai finito le medie. Le superiori durano cinque anni e decidono molte delle strade future.',
  c:()=>SUPERIORI.map(s=>({l:s.n,sub:s.desc,fx:()=>{Object.assign(S.scuola,{stato:'superiori',tipo:s.n,anni:5,diff:s.d,sk:s.sk,boc:0});if(chance(.6))nuovoAmico();return [`Ti iscrivi al ${s.n}. Si parte a settembre.`,'']}}))});
ev({id:'dopo_diploma',link:1,t:'E adesso?',x:'Hai il diploma in tasca. Cosa fai della tua vita?',c:[
  {l:"Vado all'università",fx:()=>{coda.unshift({e:EV.uni,d:{}});return null}},
  {l:'Mi iscrivo a un ITS',sub:'Due anni, molto pratico',fx:()=>{coda.unshift({e:EV.its,d:{}});return null}},
  {l:'Cerco subito lavoro',r:'Le offerte di lavoro sono nella scheda Lavoro.'},
  {l:'Faccio il servizio civile',e:{m:6500,k:8,f:3},r:'Un anno in una casa famiglia. Rimborso di 6.500 € e tanta umanità.'},
  {l:'Anno sabbatico in giro per il mondo',costo:()=>P(3000),e:{f:10,lingue:8},fx:()=>{nuovoAmico()},r:"Zaino in spalla tra Australia e Sud-est asiatico."}]});
ev({id:'uni',link:1,t:'Quale facoltà?',x:()=>`Le tasse universitarie per la tua famiglia sono di ${eur(tasseUni())} l'anno${pagatoDaiGenitori()?', le pagano i tuoi genitori':''}. Alcune facoltà hanno il test d'ingresso.`,
  c:()=>FACOLTA.map(f=>({l:f.n,sub:`${f.cu?'Ciclo unico, ':''}${f.anni} anni${f.test?" · test d'ingresso":''}`,fx:d=>{d.fac=f.n;coda.unshift({e:EV.sede,d});return null}}))});
ev({id:'sede',link:1,t:'Dove studi?',x:d=>`Puoi studiare ${d.fac} nella tua città o andare fuori sede. Fuori sede costa circa 6.500 € l'anno in più, ma è un'esperienza di vita.`,
  c:d=>{const c=CITTA.filter(x=>x.n!==S.citta&&['Bologna','Milano','Roma','Padova','Torino','Napoli','Firenze','Pisa'].includes(x.n)).slice(0,3);
    return [{l:`A ${S.citta}`,sub:'Resti vicino a casa',fx:()=>iscriviUni(d.fac,null)},...c.map(x=>({l:`Fuori sede a ${x.n}`,fx:()=>iscriviUni(d.fac,x.n)}))]}});
ev({id:'its',link:1,t:'Quale ITS?',x:'Gli ITS sono scuole post-diploma di due anni, molto legate alle aziende.',
  c:()=>ITS.map(t=>({l:t.n,sub:`Ottieni: ${t.cert}`,fx:()=>{Object.assign(S.scuola,{stato:'its',tipo:t.n,anni:2,voto:clamp(45+S.intelligenza/3),diff:.45,sk:t.sk,fuori:0});return [`Ti iscrivi all'${t.n}.`,'g']}}))});
ev({id:'dopo_triennale',link:1,t:'Laurea triennale: e ora?',x:d=>`Hai la laurea triennale in ${d.x}. Molti lavori richiedono la magistrale.`,c:[
  {l:d=>`Magistrale in ${d.x}`,sub:'Due anni',fx:d=>{Object.assign(S.scuola,{stato:'magistrale',tipo:d.x,anni:2,voto:clamp(S.scuola.voto+r(-5,5)),fuori:0});return [`Ti iscrivi alla magistrale in ${d.x}.`,'g']}},
  {l:'Un master di un anno',sub:()=>eur(P(8000)),costo:()=>P(8000),fx:d=>{Object.assign(S.scuola,{stato:'master',tipo:d.x,anni:1,voto:60,fuori:0});return ['Ti iscrivi a un master. Costoso, ma apre porte.','g']}},
  {l:'Basta studiare, cerco lavoro',r:'Le offerte di lavoro sono nella scheda Lavoro.'}]});
ev({id:'dopo_magistrale',link:1,t:'E dopo la laurea?',x:d=>`Hai la laurea magistrale in ${d.x}.${['Medicina','Giurisprudenza','Psicologia','Economia','Architettura'].includes(d.x)?" Ricorda l'esame di Stato nella scheda Studi.":''}`,c:[
  {l:'Provo il dottorato di ricerca',sub:"Tre anni con borsa. Serve un voto alto.",p:()=>(S.fatti.ultimoVoto||90)>=105?.75:(S.fatti.ultimoVoto||90)>=100?.4:.1,
    si:{fx:d=>{Object.assign(S.scuola,{stato:'dottorato',tipo:d.x,anni:3,voto:70,fuori:0});return [`Vinci un posto da dottorand${g('o','a')} con borsa!`,'g']}},no:{e:{f:-4},r:'Non passi la selezione per il dottorato.'}},
  {l:'Un master',sub:()=>eur(P(8000)),costo:()=>P(8000),fx:d=>{Object.assign(S.scuola,{stato:'master',tipo:d.x,anni:1,voto:60,fuori:0});return ['Ti iscrivi a un master.','g']}},
  {l:'Cerco lavoro',r:'Le offerte di lavoro sono nella scheda Lavoro.'}]});
ev({id:'pensione',link:1,t:'La pensione',x:()=>`Hai ${S.eta} anni e ${Math.floor(S.contributi)} anni di contributi: puoi andare in pensione ${pensioneMaturata()==='anticipata'?'anticipata':'di vecchiaia'}. Con il sistema contributivo prenderesti circa ${eur(pensioneCalcolata()/13)} netti al mese per 13 mensilità; restando al lavoro i contributi crescono e il coefficiente migliora.`,c:[
  {l:'Vado in pensione',fx:()=>{if(!S.lavoro)return ['Non hai più un lavoro.','x'];vaiInPensione();mod('felicita',10);pesa(6,2);return ["Festa d'addio con i colleghi. Inizia la pensione!",'g']}},
  {l:'Continuo ancora un anno',fx:()=>{S.fatti['pens'+S.eta]=1},r:'Ancora un anno. Ne riparliamo.'}]});
ev({id:'scout',link:1,t:'Un osservatore in tribuna',x:"Un osservatore di una squadra professionistica ti ha visto giocare e vuole farti un provino.",c:[
  {l:'Fai il provino',p:()=>.25+S.abil.sport/180,si:{fl:'scoutOk',fx:()=>{S.fatti.scout=1},e:{f:12},r:"Ti prendono! Puoi firmare con una squadra di Serie C dalla scheda Lavoro."},no:{fl:'scout',e:{f:-8},r:'Giornata no. Ti ringraziano, ma non ti prendono.'}},
  {l:'Preferisco studiare',fl:'scout',r:'Il calcio resterà una passione.'}]});
ev({id:'talent',link:1,t:'Talent show',x:"Ti invitano alle selezioni di un talent show musicale in TV.",c:[
  {l:'Partecipa',p:()=>S.abil.musica/140,si:{fl:'talent',e:{f:12,musica:6,m:10000},fx:()=>{if(!S.lavoro||JOB[S.lavoro.id].pt)assumi(JOB.mus)},r:"Arrivi in finale! Firmi un contratto discografico e incassi 10.000 €."},no:{fl:'talent',e:{f:-6},r:'Eliminat{o} alla prima puntata. Il pubblico non ha capito.'}},
  {l:'Non fa per me',fl:'talent',r:'Continui a suonare per passione.'}]});
ev({id:'nasce_fratello',link:1,cond:()=>vivi(['Madre']).length>0,t:'Novità in famiglia',x:'I tuoi genitori ti annunciano che arriverà un fratellino o una sorellina.',c:[
  {l:'Che bello!',fx:()=>{const p=nuovaPersona('Fratello',pick(['M','F']),0,S.cognome,{rapporto:r(65,90)});return [`È nat${gp(p,'o','a')} ${p.nome}!`,'g']}},
  {l:'Uffa, ero meglio da sol{o}',fx:()=>{const p=nuovaPersona('Fratello',pick(['M','F']),0,S.cognome,{rapporto:r(40,60)});mod('felicita',-2);return [`È nat${gp(p,'o','a')} ${p.nome}. Ora devi dividere tutto.`,'']}}]});
ev({id:'div_richiesta',link:1,t:'Una brutta notizia',x:d=>`${d.p.nome} ti dice che il vostro matrimonio è finito e chiede il divorzio.`,c:[
  {l:'Prova a salvare il matrimonio',p:.35,si:{e:{rel:30,f:2},r:'Terapia di coppia e tanta pazienza. Ci riprovate.'},no:{fx:d=>divorzia(d.p)}},
  {l:'Accetta',fx:d=>divorzia(d.p)}]});

ev({id:'debiti',link:1,t:'Sommerso dai debiti',x:()=>`Hai ${eur(-S.soldi)} di debiti e la banca ti chiede di rientrare.`,c:[
  {l:'Vendi quello che possiedi',cond:()=>S.prop.length||S.veicoli.length||valoreBorsa()||S.azienda,fx:()=>{let t=0;for(const p of S.prop){t+=Math.round(p.valore*.85)-(p.mutuo?p.mutuo.residuo:0)}for(const c of S.veicoli)t+=Math.round(c.valore*.8)-(c.prestito?c.prestito.rata*c.prestito.anni:0);t+=valoreBorsa()+(S.azienda?valoreAzienda(S.azienda):0);
    if(S.casa.tipo==='proprieta')S.casa=genitoriVivi()?{tipo:'genitori'}:affittoBase('Monolocale');S.prop=[];S.veicoli=[];S.borsa={};S.costoBorsa={};S.azienda=null;soldi(t);mod('felicita',-10);return [`Vendi tutto e recuperi ${eur(t)}. Ricominci da capo.`,'b']}},
  {l:'Chiedi aiuto alla famiglia',cond:()=>genitoriVivi()&&S.classe!=='umile',p:.55,si:{fx:()=>{soldi(Math.round(-S.soldi*.6));relGenitori(-10)},e:{f:-4},r:'I tuoi genitori coprono gran parte del debito. Ti senti in imbarazzo.'},no:{e:{f:-6},fx:()=>relGenitori(-8),r:'Non possono aiutarti. La situazione resta pesante.'}},
  {l:'Procedura di sovraindebitamento',sub:'Il debito viene cancellato, ma per 7 anni niente mutui',fx:()=>{S.soldi=0;S.fatti.crif=S.eta;mod('felicita',-12);S.karma=clamp(S.karma-3);return ["Il tribunale ti libera dai debiti. Per sette anni le banche non ti faranno credito.",'b']}}]});

/* ---------- Infanzia (0-5) ---------- */
ev({id:'spinaci',min:1,max:4,t:'A tavola',x:'La mamma ti mette davanti un piatto di spinaci.',c:[
  {l:'Mangia tutto',e:{s:3},r:'Braccio di Ferro sarebbe fiero di te.'},
  {l:'Sputali sul tavolo',e:{f:2,k:-1},r:'Il muro della cucina ora è verde.'},
  {l:'Fai i capricci',e:{f:-1},r:'Niente dolce per stasera.'}]});
ev({id:'muro',min:2,max:6,t:'Pennarelli',x:'Hai trovato i pennarelli indelebili di tuo padre.',c:[
  {l:'Disegna sul muro del salotto',e:{arte:6,f:4},fx:()=>relGenitori(-4),r:"Un capolavoro. I tuoi genitori non sono d'accordo."},
  {l:'Disegna su un foglio',e:{arte:4,f:2},r:'Il disegno finisce attaccato al frigo.'}]});
ev({id:'mare',min:2,max:6,once:1,t:'Il mare',x:'Per la prima volta vedi il mare.',c:[
  {l:'Corri in acqua',e:{f:6,sport:2},r:'Schizzi, risate e sabbia ovunque.'},
  {l:"Resta sotto l'ombrellone",e:{f:1},r:"Il mare ti sembra troppo grande. L'anno prossimo, forse."}]});
ev({id:'cane_vicini',min:3,max:9,t:'Il cane dei vicini',x:'Il cane dei vicini ti corre incontro scodinzolando.',c:[
  {l:'Accarezzalo',p:.8,si:{e:{f:4},r:'Ti lecca la faccia. Nuovo migliore amico.'},no:{e:{s:-6,f:-4},r:'Ti morde la mano. Niente di grave, ma che spavento.'}},
  {l:'Scappa',e:{f:-1},r:'Corri a nasconderti dietro la mamma.'}]});
ev({id:'asilo_gioco',min:3,max:5,t:"All'asilo",x:'Un bambino ti strappa di mano il gioco preferito.',c:[
  {l:'Riprendilo con la forza',e:{f:2,k:-2},r:'Te lo riprendi. La maestra ti mette in castigo.'},
  {l:'Chiama la maestra',e:{k:1},r:'La maestra vi insegna a fare a turno.'},
  {l:'Scoppia a piangere',e:{f:-3},r:'Piangi finché non arriva la merenda.'}]});
ev({id:'babbo',min:5,max:8,once:1,t:'Babbo Natale',x:"Scopri i regali nascosti nell'armadio dei tuoi genitori.",c:[
  {l:'Fai finta di non sapere niente',e:{f:3,i:1},r:'La notte di Natale reciti la parte alla perfezione.'},
  {l:'Dillo a tutti a scuola',e:{f:-2,k:-1},r:'Hai rovinato la magia a mezza classe.'}]});
ev({id:'paura_buio',min:3,max:7,once:1,t:'Il mostro',x:"Sei sicur{o} che sotto il letto ci sia un mostro.",c:[
  {l:'Chiama i genitori',fx:()=>relGenitori(3),e:{f:2},r:'Papà controlla con la torcia: nessun mostro.'},
  {l:'Affrontalo da sol{o}',p:.6,si:{e:{f:4,i:1},r:'Guardi sotto il letto. Solo un calzino. Ti senti coraggios{o}.'},no:{e:{f:-3},r:'Un rumore! Passi la notte sotto le coperte.'}}]});

/* ---------- Bambini (6-12) ---------- */
ev({id:'bici',min:5,max:9,once:1,t:'Senza rotelle',x:'Tuo padre toglie le rotelle alla bici.',c:[
  {l:'Pedala!',p:.7,si:{e:{f:5,sport:4},r:'Dopo tre cadute vai dritt{o} fino in fondo alla via.'},no:{e:{s:-4,f:-2},r:'Ginocchia sbucciate. Riprovi domani.'}},
  {l:'Non sono pront{o}',e:{f:-1},r:'Le rotelle tornano al loro posto.'}]});
ev({id:'merenda',min:6,max:11,t:'Merenda rubata',x:"All'intervallo un compagno di classe ti ruba la merenda.",c:[
  {l:'Riprenditela',p:.5,si:{e:{f:5,k:-2},r:'Te la riprendi. Il compagno non ci riprova più.'},no:{e:{s:-5,f:-5},r:'Finisce male: torni a casa con un livido sul braccio.'}},
  {l:'Dillo alla maestra',e:{f:2,k:2},r:'La maestra lo mette in castigo e ti restituisce la merenda.'},
  {l:'Lascia perdere',e:{f:-4},r:"Passi l'intervallo a stomaco vuoto."}]});
ev({id:'compiti_estate',min:6,max:13,t:'Compiti delle vacanze',x:'È luglio e hai un libro intero di compiti delle vacanze.',c:[
  {l:'Falli subito',e:{voto:6,f:-2,i:1},r:"Ad agosto sei liber{o} come l'aria."},
  {l:'Copiali da un compagno a settembre',e:{voto:2,k:-2},r:'Copi tutto in una notte. Nessuno se ne accorge.'},
  {l:'Non farli',e:{voto:-7,f:4},r:'Estate perfetta. Settembre un po\' meno.'}]});
ev({id:'recita',min:6,max:10,once:1,t:'La recita di Natale',x:'La maestra ti offre la parte principale nella recita.',c:[
  {l:'Accetta',p:()=>.4+S.aspetto/250+S.abil.arte/200,si:{e:{f:6,arte:6},r:'Applausi a scena aperta. Tua madre piange.'},no:{e:{f:-4,arte:2},r:'Dimentichi la battuta e resti immobile sul palco.'}},
  {l:"Preferisco fare l'albero",e:{f:1},r:'Un albero molto convincente.'}]});
ev({id:'olimpiadi',min:9,max:18,cond:()=>iscritto(),t:'Olimpiadi di matematica',x:'La scuola cerca studenti per le Olimpiadi di matematica.',c:[
  {l:'Partecipa',p:()=>S.intelligenza/120,si:{e:{f:6,i:3,voto:6},fl:'olimpiadi',r:'Arrivi tra i primi dieci della regione!'},no:{e:{f:-2,i:1},r:'Gli esercizi erano impossibili. Però hai imparato qualcosa.'}},
  {l:'No, grazie',pers:{O:-1},r:"Lasci l'onore a qualcun altro."}]});
ev({id:'console',min:8,max:15,once:1,t:'La console',x:'Per il compleanno ricevi una console per videogiochi.',c:[
  {l:'Gioca tutto il giorno',e:{f:6,voto:-6,tech:5},fl:'gamer',r:'Livello 99. In pagella un po\' meno.'},
  {l:'Gioca con moderazione',e:{f:4,tech:2},r:"Un'ora al giorno, dopo i compiti."}]});
ev({id:'soldi_borsa',min:7,max:13,t:'Tentazione',x:'Nel portafoglio della mamma, lasciato sul tavolo, ci sono 20 €.',c:[
  {l:'Prendili',p:.55,si:{e:{m:20,k:-4},r:'Nessuno se ne accorge. Per ora.'},no:{e:{k:-4,f:-6},fx:()=>relGenitori(-10),r:'Ti scoprono subito. Un mese senza uscire.'}},
  {l:'Lasciali dove sono',e:{k:2},r:'Non è roba tua.'}]});
ev({id:'smartphone',min:10,max:13,once:1,cond:()=>S.anno>=2010,t:'Lo smartphone',x:'In classe hanno tutti lo smartphone tranne te.',c:[
  {l:'Insisti con i tuoi genitori',p:()=>S.classe==='umile'?.35:.7,si:{e:{f:6},r:'Dopo settimane di suppliche, arriva il telefono!'},no:{e:{f:-4},r:'«Quando sarai più grande.»'}},
  {l:'Compralo con la paghetta',costo:()=>P(200),e:{f:5},r:"Te lo compri da sol{o}. Che soddisfazione."},
  {l:'Fanne a meno',e:{i:2},r:'Leggi più libri dei tuoi compagni.'}]});
ev({id:'festa_compleanno',min:6,max:12,t:'La tua festa',x:'Per il tuo compleanno puoi fare una festa.',c:[
  {l:'Invita tutta la classe',e:{f:6},fx:()=>{nuovoAmico()},r:'Trenta bambini in casa. Tua madre è distrutta, tu felicissim{o}.'},
  {l:'Solo pochi amici',e:{f:4},fx:()=>relAmici(6),r:'Pizza e film con gli amici più stretti.'}]});
ev({id:'nota',min:9,max:16,cond:()=>iscritto(),t:'La nota',x:'Ti mettono una nota sul registro per aver chiacchierato.',c:[
  {l:'Falsifica la firma dei genitori',p:.5,si:{e:{k:-3},r:'Firma perfetta. Nessuno se ne accorge.'},no:{e:{k:-3,f:-6},fx:()=>relGenitori(-8),r:'La prof chiama a casa. Doppia punizione.'}},
  {l:'Fai firmare la nota',e:{f:-2},fx:()=>relGenitori(-3),r:'Una ramanzina e passa.'}]});
ev({id:'criceto',min:6,max:10,once:1,t:'Il criceto della classe',x:"La maestra cerca qualcuno che tenga il criceto della classe durante le vacanze.",c:[
  {l:'Portalo a casa',p:.75,si:{e:{f:5,k:3},r:'Lo riporti a scuola sano e grassottello.'},no:{e:{f:-5},r:'Scappa dalla gabbia e lo ritrovate dopo tre giorni dentro il divano.'}},
  {l:'Lascia stare',e:{f:-1},r:'Lo prende un tuo compagno.'}]});
ev({id:'campeggio',min:8,max:14,once:1,t:'Campo estivo',x:'Puoi andare due settimane al campo estivo in montagna.',c:[
  {l:'Parti',e:{f:6,sport:3},fx:()=>{nuovoAmico()},r:'Falò, escursioni e un nuovo amico per la vita.'},
  {l:'Resti a casa',e:{f:-1},r:'Estate in città.'}]});
ev({id:'torneo',min:8,max:18,cond:()=>hobbySk()==='sport',t:'La finale',x:'La tua squadra arriva in finale del torneo regionale.',c:[
  {l:'Dai il massimo',p:()=>.3+S.abil.sport/150,si:{e:{f:8,sport:4},r:'Vincete! Ti portano in trionfo.'},no:{e:{f:-3,sport:2},r:'Perdete ai rigori. Che rabbia.'}},
  {l:'Resta in panchina',e:{f:-2},r:'Guardi la partita dalla panchina.'}]});
ev({id:'saggio',min:7,max:18,cond:()=>S.hobby==='musica',t:'Il saggio',x:'C\'è il saggio di fine anno della scuola di musica.',c:[
  {l:'Suona da solista',p:()=>.3+S.abil.musica/130,si:{e:{f:7,musica:5},r:'Standing ovation in sala parrocchiale.'},no:{e:{f:-4,musica:2},r:"Sbagli l'attacco. Nessuno se ne accorge, tranne te."}},
  {l:'Suona nel gruppo',e:{f:3,musica:2},r:'Più sicuro, e ti diverti.'}]});
ev({id:'concorso_disegno',min:8,max:35,cond:()=>S.abil.arte>=35,t:'Concorso di pittura',x:"C'è un concorso di pittura per giovani artisti.",c:[
  {l:'Partecipa',p:()=>S.abil.arte/130,si:{e:{f:7,arte:5,m:300},r:'Primo premio: 300 € e il tuo quadro esposto in Comune.'},no:{e:{f:-2,arte:2},r:"Menzione d'onore. Va bene lo stesso."}},
  {l:'Non ti senti pront{o}',pers:{N:1},r:"Sarà per l'anno prossimo."}]});
ev({id:'pagella',min:7,max:13,cond:()=>iscritto(),t:'La pagella',x:()=>`Arriva la pagella. La tua media è ${Math.max(4,S.scuola.voto/10).toFixed(1)}.`,c:[
  {l:'Mostrala con orgoglio',cond:()=>S.scuola.voto>=60,e:{f:5},fx:()=>relGenitori(6),r:'I tuoi ti portano a mangiare la pizza.'},
  {l:'Nascondila nello zaino',cond:()=>S.scuola.voto<60,p:.3,si:{e:{f:2},r:'Te la cavi. Per ora.'},no:{e:{f:-5},fx:()=>relGenitori(-8),r:'La trovano. Niente console per un mese.'}},
  {l:'Prometti di impegnarti di più',e:{voto:4,f:-1},r:'Il prossimo quadrimestre andrà meglio.'}]});
ev({id:'nonno_pesca',min:6,max:13,once:1,cond:()=>vivi(['Nonno']).some(p=>p.sesso==='M'),t:'A pesca col nonno',x:'Il nonno ti porta a pescare al lago, alle cinque del mattino.',c:[
  {l:'Vai',e:{f:5},fx:()=>vivi(['Nonno']).forEach(p=>p.rapporto=clamp(p.rapporto+10)),r:'Prendete una trota e una storia da raccontare per anni.'},
  {l:'Resta a letto',e:{f:1},fx:()=>vivi(['Nonno']).forEach(p=>p.rapporto=clamp(p.rapporto-5)),r:'Il nonno ci va da solo.'}]});

/* ---------- Adolescenza (13-17) ---------- */
ev({id:'sigaretta',min:13,max:20,cond:()=>!S.dip.fumo,t:'Alla fermata del bus',x:'Un amico ti offre una sigaretta alla fermata del bus.',c:[
  {l:'Accetta',fx:()=>{S.dip.fumo=true},e:{s:-4,f:2,k:-1},r:'Tossisci, ma fai finta di niente. Inizi a fumare. Il conto arriverà con gli anni.'},
  {l:'Rifiuta',e:{s:1},r:'«No grazie.» Fine della storia.'}]});
ev({id:'birra',min:14,max:17,t:'Al parchetto',x:'Al parchetto i ragazzi più grandi ti passano una birra.',c:[
  {l:'Bevi',p:.75,si:{e:{f:3,bev:1},r:'Ti senti grande. Ti gira un po\' la testa.'},no:{e:{f:-6,bev:1},fx:()=>relGenitori(-10),r:'Tuo padre passa di lì in macchina. Disastro.'}},
  {l:'Rifiuta',e:{k:1},r:'«Sono a posto così.»'}]});
ev({id:'festa_nascosto',min:14,max:17,t:'La festa proibita',x:'I tuoi non ti lasciano andare alla festa di sabato.',c:[
  {l:'Esci di nascosto dalla finestra',p:.6,si:{e:{f:7},r:'Serata epica. Rientri alle 3 senza farti beccare.'},no:{e:{f:-6},fx:()=>relGenitori(-12),r:'Ti aspettano in salotto con la luce accesa.'}},
  {l:'Obbedisci',e:{f:-3},fx:()=>relGenitori(5),r:'Ti consoli con una serie TV.'}]});
ev({id:'copiare',min:13,max:26,cond:()=>iscritto(),t:'Il compito',x:()=>['universita','magistrale'].includes(S.scuola.stato)?"All'esame scritto il tuo vicino ti mostra il foglio con le soluzioni.":'Durante il compito in classe il compagno ti passa le risposte.',c:[
  {l:'Copia',p:.72,si:{e:{voto:7,k:-2},r:'Voto altissimo. Nessuno sospetta niente.'},no:{e:{voto:-12,f:-5,k:-2},r:'Ti beccano. Compito annullato e una brutta figura.'}},
  {l:'Fai da sol{o}',e:{k:2,voto:1},r:'Te la cavi con le tue forze.'}]});
ev({id:'interrogazione',min:14,max:19,cond:()=>S.scuola.stato==='superiori',t:'Interrogazione a sorpresa',x:'Il prof di matematica chiama il tuo nome. Non hai aperto libro.',c:[
  {l:'Bluffa',p:()=>S.intelligenza/130,si:{e:{voto:8},r:'Improvvisi alla grande. Il prof ti mette 7.'},no:{e:{voto:-10},r:'Il prof non ci casca. Tre.'}},
  {l:'Ammetti di non aver studiato',e:{voto:-4,k:1},r:"Apprezza l'onestà, ma ti mette 4."},
  {l:'Fingi un malore',p:.4,si:{r:'Ti mandano in infermeria. Salvat{o}, per oggi.',k:'g'},no:{e:{voto:-8},r:'Nessuno ti crede. Domani interrogazione doppia.'}}]});
ev({id:'gita',min:15,max:19,once:1,cond:()=>S.scuola.stato==='superiori',t:'Gita scolastica',x:'La classe organizza la gita a Praga.',c:[
  {l:'Partecipa',costo:()=>P(350),e:{f:9},fx:()=>{nuovoAmico()},r:'Tre giorni a Praga e zero ore di sonno. Ricordi per sempre.'},
  {l:'Resta a casa',e:{f:-3},r:'Guardi le storie degli altri dal divano.'}]});
ev({id:'bulli',min:11,max:16,t:'Nel corridoio',x:'Alcuni ragazzi più grandi prendono in giro un compagno di classe.',c:[
  {l:'Difendilo',p:.65,si:{e:{f:4,k:5},fx:()=>{nuovoAmico()},r:'Se ne vanno. Il tuo compagno diventa tuo amico.'},no:{e:{s:-4,k:5},r:'Prendi uno spintone, ma hai fatto la cosa giusta.'}},
  {l:'Chiama un professore',e:{k:3},r:'Il preside convoca i bulli.'},
  {l:'Fai finta di niente',e:{k:-3,f:-2},r:"Guardi da un'altra parte. Ci ripensi per giorni."}]});
ev({id:'occupazione',min:15,max:19,cond:()=>S.scuola.stato==='superiori',t:'Occupazione',x:'Gli studenti occupano la scuola per protesta.',c:[
  {l:'Partecipa',e:{f:5,voto:-3},fx:()=>{nuovoAmico()},r:'Assemblee, chitarre e notti in palestra.'},
  {l:'Resta a casa a studiare',e:{voto:3},r:'Approfitti per recuperare.'}]});
ev({id:'rappresentante',min:14,max:19,once:1,cond:()=>S.scuola.stato==='superiori',t:'Elezioni a scuola',x:"Potresti candidarti come rappresentante d'istituto.",c:[
  {l:'Candidati',p:()=>.25+S.aspetto/250+S.karma/250,si:{e:{f:7,i:1},fl:'leader',r:'Elett{o} con il 60% dei voti!'},no:{e:{f:-3},r:'Perdi per pochi voti.'}},
  {l:'Non fa per me',pers:{E:-1},r:'Voti per un altro.'}]});
ev({id:'lavoretto_estivo',min:15,max:19,t:'Lavoro estivo',x:'Uno stabilimento balneare cerca ragazzi per l\'estate.',c:[
  {l:'Accetta',e:{m:1800,f:-1,k:1},fl:'esperienza',r:'Tre mesi di lettini e ombrelloni: 1.800 € in tasca.'},
  {l:"Goditi l'estate",e:{f:5},r:'Mare, amici e niente sveglia.'}]});
ev({id:'hater',min:14,max:30,cond:()=>S.social.attivo,t:'Commenti cattivi',x:'Qualcuno scrive commenti cattivi sotto una tua foto.',c:[
  {l:'Rispondi a tono',e:{f:-2,k:-1},r:'La discussione degenera. Non ne valeva la pena.'},
  {l:'Blocca e parlane con un amico',e:{f:1},r:'Ti senti subito meglio.'},
  {l:'Cancella la foto',e:{f:-3},r:'Peccato, era una bella foto.'}]});
ev({id:'taccheggio',min:13,max:25,t:'La sfida',x:'Un amico ti sfida a rubare una felpa in un negozio del centro.',c:[
  {l:'Accetta la sfida',p:.6,si:{e:{f:2,k:-6},r:'Esci con la felpa sotto la giacca. Il cuore batte a mille.'},no:{e:{k:-6,f:-4},pr:'taccheggio',r:"L'allarme suona. Ti ferma la vigilanza."}},
  {l:'Rifiuta',e:{k:2},r:'«Fallo tu, se ci tieni.»'}]});
ev({id:'graffiti',min:14,max:22,t:'Bomboletta',x:"Gli amici vogliono fare un graffito sul muro della stazione, di notte.",c:[
  {l:'Vai con loro',p:.7,si:{e:{f:5,arte:4,k:-3},r:'Il giorno dopo tutti parlano del vostro murale.'},no:{e:{k:-3},pr:'graffiti',r:'Arriva la polizia ferroviaria.'}},
  {l:'Proponi un muro legale',e:{arte:3,k:2},r:'Il Comune vi concede un muro. Bel lavoro.'},
  {l:'Resta a casa',pers:{C:1},r:'Non è il tuo genere.'}]});
ev({id:'motorino',min:14,max:17,once:1,t:'Lo scooter',x:'Vorresti uno scooter per andare a scuola.',c:[
  {l:'Chiedilo ai tuoi genitori',p:()=>({umile:.15,media:.45,agiata:.85})[S.classe],si:{fx:()=>{S.veicoli.push({id:S.nextId++,n:'Scooter 50',valore:1800,stato:100,costo:()=>P(300)});S.fatti.patentino=true},e:{f:8},r:"Patentino fatto, arriva lo scooter! Libertà su due ruote."},no:{e:{f:-3},r:'«Costa troppo e poi è pericoloso.»'}},
  {l:'Usa la bici',e:{s:2},r:'Gambe d\'acciaio.'}]});
ev({id:'maturita_ansia',min:18,max:21,cond:()=>S.scuola.stato==='superiori'&&S.scuola.anni<=1,t:'La maturità',x:'Mancano due mesi alla maturità.',c:[
  {l:'Studia giorno e notte',e:{voto:9,f:-4,s:-2},r:'Notti sui libri e tanto caffè.'},
  {l:'Ripassa con calma',e:{voto:4},r:'Un ripasso costante, senza panico.'},
  {l:'Affidati alla fortuna',p:.35,si:{r:'Escono proprio gli argomenti che sapevi!',k:'g'},no:{e:{voto:-8},r:'Tracce difficilissime. Ti tocca improvvisare.'}}]});
ev({id:'diciotto',min:18,max:18,once:1,t:'I tuoi 18 anni',x:'Compi 18 anni. Come festeggi?',c:[
  {l:'Festa in grande',e:{f:8,bev:1},fx:()=>{nuovoAmico()},r:'Locale affittato, torta a tre piani e la foto con tutti.'},
  {l:'Cena in famiglia',e:{f:4,m:200},fx:()=>relGenitori(8),r:'La nonna ti regala una busta: 200 €.'},
  {l:'Weekend con gli amici',costo:()=>P(300),e:{f:7},fx:()=>relAmici(8),r:'Due giorni al mare, solo voi.'}]});
ev({id:'viaggio_maturita',min:19,max:20,once:1,cond:()=>S.istr.liv>=2,t:'Il viaggio dopo la maturità',x:'Gli amici organizzano una settimana in Grecia.',c:[
  {l:'Parti',costo:()=>P(700),e:{f:10,bev:1},fx:()=>relAmici(8),r:'Mykonos, spiagge e tramonti. Estate indimenticabile.'},
  {l:'Resta a casa',e:{f:-2},r:'Lavori un po\' e risparmi.'}]});

/* ---------- Università e giovani adulti ---------- */
ev({id:'erasmus',min:19,max:28,once:1,cond:()=>['universita','magistrale'].includes(S.scuola.stato),t:'Erasmus',x:"Puoi fare sei mesi di Erasmus a Valencia. Costa circa 2.000 € di spese.",c:[
  {l:'Parti',costo:()=>P(2000),e:{f:12,i:3,lingue:12},fl:'erasmus',fx:()=>{nuovoAmico()},r:'Sei mesi di spagnolo, paella e amicizie da tutta Europa.'},
  {l:'Resta in Italia',pers:{O:-1},r:'Magari alla magistrale.'}]});
ev({id:'esame_difficile',min:19,max:30,cond:()=>['universita','magistrale'].includes(S.scuola.stato),t:"L'esame impossibile",x:"Hai provato tre volte l'esame più difficile del corso. Domani c'è il quarto appello.",c:[
  {l:'Studia tutta la notte',p:()=>S.intelligenza/110,si:{e:{voto:8,f:5},r:'Passato con 27! Festa grande.'},no:{e:{voto:-4,f:-5,s:-2},r:'Bocciat{o} di nuovo. Il prof ti dice «ci vediamo a giugno».'}},
  {l:'Rimanda al prossimo appello',e:{voto:-3},r:'Rimandi. Il carico di esami cresce.'},
  {l:'Cambia piano di studi',e:{voto:2,i:-1},r:"Sostituisci l'esame con uno più facile."}]});
ev({id:'coinquilino',min:18,max:35,cond:()=>S.fatti.fuorisede||(S.casa.tipo==='affitto'&&S.casa.n==='Stanza in condivisione'),t:'Il coinquilino',x:'Il tuo coinquilino non lava mai i piatti e porta gente a casa ogni sera.',c:[
  {l:'Parlagli con calma',p:.6,si:{e:{f:3},fx:()=>{nuovoAmico()},r:'Vi chiarite e diventate amici.'},no:{e:{f:-3},r:'Ti risponde male. La convivenza è tesa.'}},
  {l:'Lava tu',e:{f:-2,k:1},r:'Pace in casa, ma che fatica.'},
  {l:'Nascondigli i piatti puliti',e:{f:2,k:-1},r:'Piccola vendetta. Funziona.'}]});
ev({id:'festa',min:16,max:30,t:'Sabato sera',x:'Sei invitat{o} a una festa a casa di amici.',c:[
  {l:"Balla fino all'alba",e:{f:[5,9],s:-1,bev:1},r:'Serata memorabile. La domenica un po\' meno.'},
  {l:'Fai conoscenza con gente nuova',p:.7,si:{e:{f:4},fx:()=>{nuovoAmico()},r:'Esci con un nuovo amico.'},no:{e:{f:-1},r:'Conversazioni imbarazzanti vicino al frigo.'}},
  {l:'Resta a casa',e:{i:1},r:'Serie TV e pigiama.'}]});
ev({id:'calcetto',min:12,max:55,t:'Calcetto del giovedì',x:'Gli amici ti chiamano: manca uno per il calcetto di stasera.',c:[
  {l:'Gioca',p:.85,si:{e:{s:3,f:4,sport:2},fx:()=>relAmici(3),r:()=>`Vincete 7 a 5. ${S.eta<16?'Il gelato lo':'La birra la'} offrono i perdenti.`},no:{e:{s:-8},fx:()=>{ammala('Distorsione alla caviglia',1)},r:'Segni e ti storti la caviglia esultando.'}},
  {l:'Stasera no',e:{f:-1},r:'Ti scrivono «sei sparit{o}» nel gruppo.'}]});
ev({id:'virale',min:14,max:40,once:1,cond:()=>S.social.attivo,t:'Video virale',x:'Un tuo video sui social sta facendo migliaia di visualizzazioni.',c:[
  {l:"Cavalca l'onda",e:{m:[200,2000],f:8,a:2},fl:'virale',r:'Ti scrivono due marchi per una collaborazione.'},
  {l:'Cancellalo',pers:{E:-1},r:"Meglio restare nell'ombra."}]});
ev({id:'tatuaggio',min:16,max:45,once:1,t:'Il tatuaggio',x:'Da mesi pensi a un tatuaggio.',c:[
  {l:'Fallo',costo:()=>P(180),p:.85,si:{e:{f:5,a:2},r:'Ti sta benissimo.'},no:{e:{f:-4,a:-3},r:'Il tatuatore ha sbagliato una lettera.'}},
  {l:'Meglio di no',pers:{O:-1},r:"Magari l'anno prossimo."}]});
ev({id:'guida_bevuto',min:18,max:70,rip:12,cond:()=>S.patente&&haAuto(),t:'Dopo la festa',x:'Hai bevuto qualche bicchiere, ma devi tornare a casa in macchina.',c:[
  {l:'Guida lo stesso',p:.72,si:{e:{k:-4,bev:1},r:'Arrivi a casa. Ti è andata bene, stavolta.',k:''},no:{e:{k:-4},fx:()=>{if(chance(.15)){S.fatti.incidenteGrave=1;mod('salute',-25);processo('stradale');return ['Perdi il controllo dell\'auto. Un incidente terribile: un\'altra persona non ce l\'ha fatta.','b']}processo('ebbrezza')},r:'Posto di blocco. Alcoltest positivo.'}},
  {l:'Chiama un taxi',costo:()=>P(45),e:{k:2},r:'Scelta saggia. Recuperi l\'auto domani.'},
  {l:'Dormi da un amico',e:{f:1},fx:()=>relAmici(3),r:'Divano scomodo, coscienza pulita.'}]});
ev({id:'rissa',min:18,max:40,t:'In discoteca',x:'In discoteca un ragazzo ubriaco ti spinge e ti rovescia il drink addosso.',c:[
  {l:'Reagisci',p:.45,si:{pers:{A:-3,N:-1},e:{f:2,k:-3},r:'Lo spingi via. Ti guarda male, ma se ne va.'},no:{pers:{A:-3,N:1},e:{s:-6,k:-4},pr:'rissa',r:'Volano pugni. Arrivano i carabinieri.'}},
  {l:'Chiama la sicurezza',e:{k:1},r:'La sicurezza lo accompagna fuori.'},
  {l:'Lascia perdere',pers:{A:1,N:-1},e:{f:-2},r:'Te ne vai a casa. Serata rovinata.'}]});
ev({id:'nero',min:18,max:55,cond:()=>!lavora(),t:'Lavoro in nero',x:'Un conoscente ti offre 3.000 € in contanti per un mese di lavoro, senza contratto.',c:[
  {l:'Accetta',p:.8,si:{e:{m:3000,k:-3},r:'Un mese di lavoro e i soldi in una busta.'},no:{e:{m:3000,k:-3},pr:'nero',r:"Controllo dell'Ispettorato del lavoro proprio quel giorno."}},
  {l:'Rifiuta',e:{k:2},r:'Preferisci un contratto vero.'}]});
ev({id:'crypto',min:18,max:65,cond:()=>S.soldi>=P(1000),t:'La criptovaluta',x:'Un amico giura che una nuova criptovaluta farà ×10 entro un anno.',c:[
  {l:'Investi 1.000 €',costo:()=>P(1000),x:1000,fut:[1,'crypto_esito'],r:'Compri i tuoi primi token. Ora non resta che aspettare.',k:''},
  {l:'Non ci credo',pers:{C:1},r:'Ti tieni stretti i tuoi soldi.'}]});
ev({id:'piramide',min:20,max:75,cond:()=>S.soldi>=P(1500),t:'Un business sicuro',x:'Ti propongono un «business» in cui guadagni reclutando altre persone. Quota d\'ingresso: 1.500 €.',c:[
  {l:'Entra',costo:()=>P(1500),fut:[1,'piramide_esito'],e:{k:-2},r:'Ti regalano una spilla e un manuale motivazionale.',k:''},
  {l:'Rifiuta',e:{i:1},r:'Puzza di truffa lontano un chilometro.'}]});
ev({id:'truffa_sms',min:25,max:90,cond:()=>S.soldi>P(200),t:'Un SMS strano',x:'«Gentile cliente, il suo conto è bloccato. Clicchi qui per sbloccarlo.»',c:[
  {l:'Clicca il link',fx:()=>{const x=Math.round(S.soldi*r(15,40)/100);soldi(-x);mod('felicita',-8);return [`Era una truffa. Ti hanno portato via ${eur(x)}.`,'b']}},
  {l:'Cancella il messaggio',e:{i:1},r:'Tentativo di phishing evitato.'}]});
ev({id:'vicino',min:22,max:90,cond:()=>S.casa.tipo!=='genitori',t:'Il vicino di sopra',x:'Il vicino del piano di sopra sposta i mobili ogni notte alle due.',c:[
  {l:'Vai a parlargli',p:.6,si:{e:{f:3},r:'Si scusa: lavora di notte. Promette di fare più piano.'},no:{e:{f:-3},fx:()=>{const n=creaNemico('vicino',null,'M');log(`${n.nome}, il vicino di sopra, ora è tra i tuoi nemici.`,'b')},r:'Ti risponde male. La guerra è iniziata.'}},
  {l:"Scrivi all'amministratore",e:{f:1},r:'Arriva un avviso in bacheca. Per un po\' funziona.'},
  {l:'Sopporta',e:{f:-4,s:-1},r:'Tappi per le orecchie e occhiaie.'}]});
ev({id:'volontariato',min:16,max:85,t:'Mensa solidale',x:"L'associazione di quartiere cerca volontari per la mensa solidale.",c:[
  {l:'Partecipa',e:{k:6,f:5},fx:()=>{if(chance(.4))nuovoAmico()},r:'Servi cento pasti in una sera. Torni a casa stanc{o} e content{o}.'},
  {l:'Non ho tempo',e:{k:-1},r:"Sarà per un'altra volta."}]});
ev({id:'multa_velox',min:18,max:85,cond:()=>S.patente&&haAuto(),t:'Autovelox',x:'Ti arriva una multa: andavi a 78 all\'ora dove il limite era 50.',c:[
  {l:'Paga entro 5 giorni',e:{m:-120},r:'Paghi con lo sconto. Lezione imparata.'},
  {l:'Fai ricorso',p:.3,si:{e:{f:4},r:'Il giudice di pace annulla la multa: il cartello non era visibile.'},no:{e:{m:-340},r:'Ricorso respinto. Ora paghi il doppio.'}}]});
ev({id:'auto_guasta',min:18,max:90,cond:()=>S.veicoli.length>0,t:'Guasto',x:()=>`La tua ${S.veicoli[0].n.toLowerCase()} non parte più. Il meccanico chiede 900 €.`,c:[
  {l:'Fai riparare',costo:()=>P(900),fx:()=>{S.veicoli[0].stato=clamp(S.veicoli[0].stato+30)},r:'Batteria, cinghia e «già che c\'eravamo» i freni.',k:''},
  {l:'Rottamala',fx:()=>{const v=S.veicoli.shift();return [`Addio ${v.n.toLowerCase()}. Ora ti muovi coi mezzi.`,'b']}},
  {l:'Prova a ripararla da sol{o}',p:()=>.2+S.abil.tech/150,si:{e:{f:5,tech:3},r:'Un tutorial su YouTube e riparte!'},no:{e:{m:-1300,f:-3},r:'Peggiori la situazione. Ora il meccanico chiede 1.300 €.'}}]});
ev({id:'tamponamento',min:18,max:90,cond:()=>S.patente&&haAuto(),t:'Tamponamento',x:'Un\'auto ti tampona al semaforo. Niente di grave.',c:[
  {l:'Constatazione amichevole',e:{f:-1},r:'Moduli firmati, ci pensa l\'assicurazione.'},
  {l:'Fingi il colpo di frusta',p:.55,si:{e:{m:3500,k:-6},r:"L'assicurazione ti risarcisce 3.500 €."},no:{e:{k:-6},pr:'truffa',r:"Il perito scopre la messinscena e ti denuncia."}}]});
ev({id:'quiz_tv',min:18,max:75,once:1,t:'Quiz in TV',x:'Ti chiamano per partecipare a un quiz televisivo.',c:[
  {l:'Partecipa',p:()=>S.intelligenza/120,si:{fx:()=>{const x=r(5,60)*1000;soldi(x);mod('felicita',12);return [`Vinci ${eur(x)}! Ti riconoscono pure al bar.`,'g']}},no:{e:{f:-3},r:'Esci alla prima domanda: «In che anno è caduto il Muro di Berlino?»'}},
  {l:'Rifiuta',pers:{E:-1},r:'Le telecamere ti mettono ansia.'}]});
ev({id:'reality',min:18,max:32,once:1,cond:()=>S.aspetto>=65,t:'Il reality',x:'Ti propongono di partecipare a un reality show su un\'isola.',c:[
  {l:'Partecipa',p:.5,si:{e:{f:8,a:3,m:15000},fl:'famoso',r:'Arrivi in finale. 15.000 € e migliaia di follower.'},no:{e:{f:-6,a:1},r:'Esci dopo una settimana tra le polemiche.'}},
  {l:'No grazie',pers:{E:-1},r:'Preferisci la tua privacy.'}]});
ev({id:'concerto',min:15,max:55,t:'Il concerto',x:'Il tuo cantante preferito fa un concerto a Milano.',c:[
  {l:'Compra il biglietto',costo:()=>P(90),e:{f:7},r:'Canti tutte le canzoni a squarciagola.'},
  {l:'Rinuncia',e:{f:-1},r:'Lo guardi nelle storie degli amici.'}]});
ev({id:'telefono_rotto',min:14,max:70,t:'Smartphone in acqua',x:'Ti cade lo smartphone nel lavandino pieno.',c:[
  {l:'Compra un modello nuovo',costo:()=>P(900),e:{f:3},r:'Nuovo di zecca.'},
  {l:'Mettilo nel riso',p:.3,si:{e:{f:4},r:'Il giorno dopo si riaccende. Miracolo!'},no:{e:{f:-2,m:-200},r:'Niente da fare. Ne compri uno usato.'}},
  {l:'Compra un usato',costo:()=>P(200),r:'Funziona, più o meno.',k:''}]});
ev({id:'idea_app',min:18,max:50,cond:()=>S.abil.tech>=30,t:"Un'idea",x:"Ti viene un'idea per un'app che potrebbe funzionare.",c:[
  {l:'Lavoraci di notte per un anno',p:()=>S.abil.tech/180+S.intelligenza/400,si:{fx:()=>{const x=r(10,80)*1000;soldi(x);mod('felicita',12);S.abil.tech=clamp(S.abil.tech+8);return [`Un'azienda compra la tua app per ${eur(x)}!`,'g']}},no:{e:{f:-4,s:-2,tech:6},r:"L'app non decolla. Però hai imparato tantissimo."}},
  {l:'Lascia perdere',pers:{O:-1},r:'Qualcun altro la farà al posto tuo.'}]});
ev({id:'zio_eredita',min:25,max:70,once:1,t:"Un'eredità inattesa",x:'Uno zio lontano ti lascia in eredità un casale in campagna. Però ci sono 8.000 € di debiti da saldare.',c:[
  {l:'Accetta',fx:()=>{soldi(-P(8000));const c=cittaInfo(S.citta);S.prop.push({id:S.nextId++,tipo:'Casale in campagna',citta:S.citta,valore:Math.round(200*c.mq*.45),stato:35});mod('felicita',6);return ['Ora possiedi un casale. Va sistemato, ma è tuo. Lo trovi nella scheda Beni.','g']}},
  {l:"Rinuncia all'eredità",pers:{C:1},r:'Niente debiti, niente casale.'}]});
ev({id:'lotto',min:18,max:95,w:.5,t:'Un sogno',x:'Sogni tre numeri precisi: 7, 23 e 61.',c:[
  {l:'Giocali al Lotto',costo:()=>P(10),p:.03,si:{e:{m:25000,f:15},r:'Escono tutti e tre! Vinci 25.000 €.'},no:{e:{gio:1},r:'Esce il 62. Per un soffio.'}},
  {l:'Sono solo sogni',pers:{C:1},r:'Al risveglio te ne dimentichi.'}]});
ev({id:'furto_casa',min:20,max:95,cond:()=>['affitto','proprieta'].includes(S.casa.tipo)&&!S.fatti.allarme,t:'I ladri',x:'Torni a casa e trovi la porta forzata. Sono entrati i ladri.',c:[
  {l:"Installa un allarme",fx:()=>{const x=r(500,4000);soldi(-x-1500);S.fatti.allarme=1;mod('felicita',-5);return [`Ti hanno portato via ${eur(x)} di oggetti. Spendi altri 1.500 € per l'allarme: non succederà più.`,'b']}},
  {l:'Pazienza',fx:()=>{const x=r(500,4000);soldi(-x);mod('felicita',-7);return [`Ti hanno portato via ${eur(x)} di oggetti.`,'b']}}]});
ev({id:'cantina',min:20,max:95,w:.5,cond:()=>!!casaMia(),t:'Il temporale',x:'Un temporale violento allaga la cantina.',c:[
  {l:'Chiama una ditta',costo:()=>P(900),r:'In due giorni è tutto asciutto.',k:''},
  {l:'Pulisci da sol{o}',e:{s:-3,f:-2},r:'Un weekend con secchio e stracci.'}]});
ev({id:'matrimonio_amico',min:24,max:50,cond:()=>vivi(['Amico']).length>0,t:'Testimone',x:'Il tuo migliore amico si sposa e ti chiede di fargli da testimone.',c:[
  {l:'Accetta',costo:()=>P(400),e:{f:8},fx:()=>relAmici(10),r:'Discorso commovente, regalo e lacrime in chiesa.'},
  {l:'Inventa una scusa',e:{f:-3,k:-2},fx:()=>relAmici(-12),r:'Ci rimane malissimo.'}]});
ev({id:'maratona',min:18,max:65,t:'La sfida',x:'Un amico ti sfida a correre la mezza maratona della città.',c:[
  {l:'Allenati e corri',p:()=>S.salute/110,si:{pers:{C:3,N:-1},e:{s:6,f:7,sport:4},r:'21 chilometri e una medaglia al collo.'},no:{pers:{C:1},e:{s:-5},r:'Crampi al km 14. Finisci camminando.'}},
  {l:'Rifiuta',e:{s:-1},r:'Meglio il divano.'}]});
ev({id:'cammino',min:20,max:70,once:1,t:'Il Cammino',x:'Ti propongono di fare il Cammino di Santiago a piedi: 800 chilometri.',c:[
  {l:'Parti con lo zaino',pers:{O:4,N:-1},costo:()=>P(1200),e:{f:12,s:5,lingue:3},fx:()=>{nuovoAmico()},r:'Un mese a piedi. Torni divers{o}.'},
  {l:'Forse un giorno',pers:{O:-1},r:'Resta nella lista dei desideri.'}]});
ev({id:'casa_genitori',min:26,max:35,cond:()=>S.casa.tipo==='genitori'&&genitoriVivi(),t:'Ancora a casa',x:'Tua madre ti chiede, con gentilezza, quando pensi di andare a vivere da sol{o}.',c:[
  {l:'Prometti di cercare casa',e:{f:-1},r:'Dai un\'occhiata agli annunci nella scheda Beni.'},
  {l:'Contribuisci alle spese',costo:()=>P(2400),fx:()=>relGenitori(8),r:'200 € al mese. In casa torna il sereno.',k:'g'},
  {l:'Fai finta di non sentire',fx:()=>relGenitori(-8),e:{f:-2},r:'Il clima a cena si fa teso.'}]});

ev({id:'colpo_fulmine',min:18,max:70,w:1.6,cond:()=>single()&&S.carcere===0,t:'Colpo di fulmine',x:()=>pick(['In treno ti siedi davanti a una persona che ti sorride.','In palestra qualcuno ti chiede di fare coppia per un esercizio.','Al supermercato tu e una persona vi contendete l\'ultimo pacco di pasta.','A una festa di amici qualcuno ti fissa da tutta la sera.']),c:[
  {l:'Fatti avanti',fx:()=>{coda.unshift({e:EV.incontro,d:{}});return null}},
  {l:'Lascia perdere',e:{f:-1},r:'Il momento passa.'}]});

/* ---------- Lavoro ---------- */
ev({id:'collega',min:18,max:65,cond:()=>lavora(),t:'Il nuovo collega',x:'Un nuovo collega ti invita a pranzo il primo giorno.',c:[
  {l:'Accetta',pers:{E:2},e:{f:3},fx:()=>{nuovoAmico()},r:'Scopri che avete un sacco di cose in comune.'},
  {l:'Mangio alla scrivania',pers:{E:-2,C:1},e:{perf:2},r:'Più lavoro, meno chiacchiere.'}]});
ev({id:'capo',min:18,max:67,cond:()=>lavora(),t:'Il capo',x:'Il tuo capo ti urla contro davanti a tutti per un errore non tuo.',c:[
  {l:'Rispondi a tono',p:.45,si:{pers:{A:-2,N:-2},e:{perf:6,f:4},r:'Il capo si scusa. I colleghi ti guardano con rispetto.'},no:{pers:{A:-2,N:2},fx:()=>{licenzia('Il capo ti licenzia in tronco.');return ['Sei fuori. Licenziamento immediato.','b']}}},
  {l:'Incassa in silenzio',pers:{A:1,N:3},e:{f:-6},r:'Torni a casa con un nodo in gola.'},
  {l:'Segnala alle risorse umane',p:.6,si:{pers:{C:2,N:-1},e:{f:5,perf:2},r:'Il capo viene richiamato. Giustizia è fatta.'},no:{pers:{C:1,N:2},e:{perf:-6,f:-3},r:'Le risorse umane insabbiano tutto. Ora il capo ce l\'ha con te.'}}]});
ev({id:'straordinari',min:18,max:67,cond:()=>lavora(),t:'Il weekend',x:'Ti chiedono di lavorare anche sabato e domenica per una consegna urgente.',c:[
  {l:'Accetta',pers:{C:2},e:{perf:7,f:-3,m:400},r:'Weekend in ufficio. Il capo se lo ricorderà.'},
  {l:'Rifiuta',e:{perf:-4,f:2},r:'Il weekend è sacro.'}]});
ev({id:'cena_aziendale',min:18,max:67,cond:()=>lavora(),t:'La cena aziendale',x:'Alla cena aziendale il vino scorre a fiumi.',c:[
  {l:'Lasciati andare',p:.55,si:{pers:{C:-2,E:2},e:{f:6,perf:3,bev:1},r:'Karaoke con il direttore. Ora siete amici.'},no:{pers:{C:-2,N:1},e:{perf:-8,f:-4,bev:1},r:'Dici al direttore cosa pensi davvero di lui.'}},
  {l:'Resta lucid{o}',pers:{C:2},e:{perf:2},r:'Fai bella figura con tutti.'}]});
ev({id:'headhunter',min:24,max:58,cond:()=>lavora()&&S.intelligenza>45,t:'Un headhunter',x:'Un headhunter ti propone lo stesso ruolo in un\'azienda concorrente, con il 25% di stipendio in più.',c:[
  {l:'Accetta',fx:()=>{S.lavoro.stip=Math.round(S.lavoro.stip*1.25);S.lavoro.perf=60;S.lavoro.anniLiv=0;mod('felicita',4);return ['Cambi azienda. Nuova scrivania, stipendio più alto.','g']}},
  {l:"Usa l'offerta per chiedere un aumento",p:.5,si:{fx:()=>{S.lavoro.stip=Math.round(S.lavoro.stip*1.12)},e:{f:4},r:'Il tuo capo rilancia: +12%.'},no:{e:{perf:-6},r:'Il capo non apprezza il ricatto.'}},
  {l:'Rifiuta',e:{perf:2},r:'Resti fedele alla tua azienda.'}]});
ev({id:'crisi',min:20,max:65,cond:()=>lavora()&&!JOB[S.lavoro.id].conc,t:"L'azienda è in crisi",x:"L'azienda annuncia tagli. Ti offrono una buonuscita se ti dimetti.",c:[
  {l:'Prendi la buonuscita',fx:()=>{const x=Math.round(S.lavoro.stip*.6);soldi(x);licenzia('Lasci l\'azienda con la buonuscita.');return [`Incassi ${eur(x)} e lasci il lavoro.`,'']}},
  {l:'Resta e speri',p:.6,si:{e:{perf:4},r:'Ti salvi dai tagli.'},no:{fx:()=>{licenzia('Rientri nei tagli: sei licenziat'+g('o','a')+'.');return ['Licenziat'+g('o','a')+' senza buonuscita.','b']}}}]});
ev({id:'trasferta',min:22,max:60,cond:()=>lavora(),t:'Trasferta',x:'Ti propongono sei mesi di trasferta a Dubai per un progetto importante.',c:[
  {l:'Parti',pers:{O:3},e:{perf:12,m:6000,f:3,lingue:4},fx:()=>{const p=partnerAttuale();if(p)p.rapporto=clamp(p.rapporto-12)},r:'Esperienza enorme e indennità di 6.000 €.'},
  {l:'Rifiuta',pers:{O:-1},e:{perf:-3},r:'Resti a casa.'}]});
ev({id:'colloquio_gratis',min:18,max:35,cond:()=>!S.lavoro&&S.carcere===0,t:'Il colloquio',x:'Al colloquio ti chiedono di lavorare un mese gratis «in prova».',c:[
  {l:'Accetta',p:.4,si:{fx:()=>{assumi(JOB[pick(['imp','com','cam','mag'])]);return [`Dopo il mese ti assumono come ${S.lavoro.nome.toLowerCase()}!`,'g']}},no:{e:{f:-6},r:'Alla fine del mese ti ringraziano e ti salutano.'}},
  {l:'Rifiuta',e:{k:1},r:'Il lavoro si paga.'}]});
ev({id:'evasione_fisc',min:25,max:75,cond:()=>!!S.azienda,t:'Il commercialista',x:'Il commercialista ti suggerisce di «dimenticare» qualche fattura per pagare meno tasse.',c:[
  {l:'Fallo',p:.7,si:{e:{m:8000,k:-5},r:'Risparmi 8.000 €. Per ora nessuno se ne accorge.'},no:{e:{k:-5},pr:'evasione',r:'Arriva la Guardia di Finanza.'}},
  {l:'Paga tutto',e:{k:3},r:'Sonni tranquilli.'}]});
ev({id:'premio_prod',min:20,max:66,cond:()=>lavora()&&S.lavoro.perf>=75,t:'Premio di produzione',x:'Grazie al tuo ottimo lavoro ti spetta un premio di produzione.',c:[
  {l:'Incassalo',e:{m:[1500,4000],f:5},r:'Bonifico in arrivo!'},
  {l:'Convertilo in welfare aziendale',e:{m:[2000,4500],f:3},r:'Buoni spesa e palestra pagata.'}]});
ev({id:'smart_working',min:20,max:66,cond:()=>lavora(),t:'Smart working',x:"L'azienda ti propone due giorni a settimana da casa.",c:[
  {l:'Accetta',e:{f:5},r:'Pigiama sotto, camicia sopra.'},
  {l:'Preferisco l\'ufficio',e:{perf:2},fx:()=>{if(chance(.4))nuovoAmico()},r:'Ti piace stare con i colleghi.'}]});

/* ---------- Salute ed età adulta ---------- */
ev({id:'colesterolo',min:38,max:80,t:'Le analisi',x:'Dalle analisi del sangue risulta il colesterolo alto.',c:[
  {l:'Cambia alimentazione e muoviti di più',e:{s:4,f:-2},r:'Meno fritti, più camminate. Il medico è soddisfatto.'},
  {l:'Ignora',fut:[r(3,7),'infarto'],r:'Sono solo numeri.',k:''}]});
ev({id:'screening',min:45,max:80,t:'Prevenzione',x:'Il medico ti consiglia uno screening di prevenzione.',c:[
  {l:'Fai gli esami',e:{s:2},fx:()=>{S.fatti.screenT=S.t;const tm=S.malattie.find(m=>m.tum&&!m.cura);if(tm){tm.screen=1;coda.unshift({e:EV.diagnosi,d:{x:tm.n}});return ['Gli esami trovano qualcosa. Il medico vuole parlarti subito.','b']}},r:'Tutto a posto. Ora sei più tranquill{o}.'},
  {l:'Rimanda',fut:[r(2,5),'screening_saltato'],r:'Lo farai l\'anno prossimo. Forse.',k:''}]});
ev({id:'mal_schiena',min:30,max:80,t:'La schiena',x:'Ti si blocca la schiena mentre allacci le scarpe.',c:[
  {l:'Fisioterapia',costo:()=>P(600),e:{s:4},r:'Dieci sedute e torni come prima.'},
  {l:'Riposo e antidolorifici',e:{s:-2},r:'Passa, ma tornerà.'},
  {l:'Inizia pilates',costo:()=>P(400),e:{s:5,sport:3},r:'La schiena ringrazia, anche negli anni a venire.'}]});
ev({id:'occhiali',min:40,max:60,once:1,t:'Le braccia corte',x:'Per leggere il menù devi allontanarlo sempre di più.',c:[
  {l:'Compra gli occhiali',costo:()=>P(250),e:{i:1},r:'Ci vedi di nuovo benissimo.'},
  {l:'Allunga le braccia',e:{f:-1},r:'Negare è inutile.'}]});
ev({id:'crisi_mezza_eta',min:42,max:55,once:1,t:'Crisi di mezza età',x:'Ti svegli e ti chiedi cosa hai fatto della tua vita.',c:[
  {l:'Compra una moto',pers:{C:-2,O:1},costo:()=>P(14000),fx:()=>{S.veicoli.push({id:S.nextId++,n:'Moto sportiva',valore:14000,stato:100,costo:()=>P(900)})},e:{f:10},r:'Il vento in faccia risolve tutto. Quasi.'},
  {l:'Inizia un nuovo hobby',pers:{O:3},e:{f:6,arte:5,musica:5},r:'Lezioni di chitarra a 47 anni. Perché no?'},
  {l:'Parlane con chi ami',pers:{A:1,N:-3},e:{f:5},fx:()=>{const p=partnerAttuale();if(p)p.rapporto=clamp(p.rapporto+10)},r:'Una lunga chiacchierata e ti senti meglio.'}]});
ev({id:'palestra_promo',min:18,max:60,t:"Promozione in palestra",x:"La palestra sotto casa offre l'abbonamento annuale a metà prezzo.",c:[
  {l:'Iscriviti e vai davvero',costo:()=>P(200),e:{s:6,a:3,sport:4},r:'Un anno costante. Lo specchio ringrazia.'},
  {l:'Iscriviti e non andare mai',costo:()=>P(200),e:{f:-1},r:'Hai finanziato la palestra.'},
  {l:'No',e:{s:1},r:'Corri al parco, gratis.'}]});
ev({id:'cane_trovato',min:8,max:85,cond:()=>S.animali.length<3,t:'Un cucciolo',x:'Davanti al portone c\'è un cucciolo abbandonato che trema.',c:[
  {l:'Adottalo',fx:()=>{if(S.eta<18&&chance(.4))return ['I tuoi genitori dicono di no. Lo porti al canile.',''];return adotta(pick(ANIMALI.slice(0,2)))}},
  {l:'Portalo al canile',e:{k:3},r:'I volontari troveranno una famiglia per lui.'},
  {l:'Tira dritto',e:{k:-3,f:-1},r:'Ci pensi per tutta la sera.'}]});
ev({id:'animale_scappato',min:6,max:95,cond:()=>S.animali.length>0,t:'È scappato',x:()=>`${S.animali[0].nome} è scappato dal giardino.`,c:[
  {l:'Cercalo tutta la notte',p:.8,si:{e:{f:4},r:"Lo ritrovi al parco che gioca con un piccione."},no:{fx:()=>{const a=S.animali.shift();mod('felicita',-10);return [`Di ${a.nome} nessuna traccia. Ti manca tanto.`,'b']}}},
  {l:'Appendi volantini',p:.6,si:{e:{f:3},r:'Una signora lo riporta il giorno dopo.'},no:{fx:()=>{const a=S.animali.shift();mod('felicita',-10);return [`${a.nome} non torna più.`,'b']}}}]});
ev({id:'buca',min:18,max:90,cond:()=>haAuto(),t:'La buca',x:'Prendi una buca enorme e la ruota si squarcia.',c:[
  {l:'Ripara e basta',costo:()=>P(250),r:'Gomma nuova.',k:''},
  {l:'Fai causa al Comune',p:.35,si:{e:{m:600,f:3},r:'Il Comune ti risarcisce 600 €.'},no:{e:{m:-350},r:'Causa persa e spese legali.'}}]});
ev({id:'festa_paese',min:6,max:95,t:'La festa del paese',x:'C\'è la festa del santo patrono con la banda e i fuochi d\'artificio.',c:[
  {l:'Vai',e:{f:4},fx:()=>{if(chance(.25))nuovoAmico()},r:'Porchetta, zucchero filato e fuochi.'},
  {l:'Resta a casa',pers:{E:-1},r:'Senti i botti dal balcone.'}]});
ev({id:'vacanza_offerta',min:18,max:85,cond:()=>S.soldi>=P(800),t:'Offerta last minute',x:'Trovi un volo e hotel per le Canarie a 800 €.',c:[
  {l:'Prenota subito',costo:()=>P(800),e:{f:9,s:2},fx:()=>{const p=partnerAttuale();if(p)p.rapporto=clamp(p.rapporto+6)},r:'Una settimana di sole a novembre.'},
  {l:'Risparmia',e:{f:-1},r:'Il conto in banca ringrazia.'}]});
ev({id:'auto_aziendale',min:28,max:65,once:1,cond:()=>S.lavoro&&S.lavoro.liv>=2,t:"L'auto aziendale",x:"Con la promozione ti offrono un'auto aziendale.",c:[
  {l:'Accetta',fx:()=>{S.veicoli.push({id:S.nextId++,n:'Berlina aziendale',valore:0,stato:100,costo:0});mod('felicita',6);return ['Ti consegnano le chiavi di una berlina nuova.','g']}},
  {l:'Preferisco un aumento',e:{m:3000},r:'Un premio in busta paga.'}]});

/* ---------- Terza età ---------- */
ev({id:'pensione_hobby',min:62,max:95,cond:()=>!S.lavoro,t:'Tempo libero',x:'Hai finalmente tempo per te. Come lo usi?',c:[
  {l:"Coltiva l'orto",pers:{C:2,O:-1},e:{f:5,s:2,cucina:3},r:'Pomodori, zucchine e basilico a chilometro zero.'},
  {l:'Bocce al circolo',pers:{E:3},e:{f:4},fx:()=>{nuovoAmico()},r:'Nuovi amici e partite accese.'},
  {l:'Università della terza età',pers:{O:3},e:{i:3,f:3},r:'Lezioni di storia dell\'arte il martedì.'},
  {l:'Volontariato',pers:{A:3},e:{k:6,f:4},r:'Accompagni i bambini a scuola come nonno vigile.'}]});
ev({id:'truffa_anziani',min:70,max:100,t:'Il finto tecnico',x:'Uno sconosciuto alla porta dice di essere un tecnico del gas e deve controllare la casa.',c:[
  {l:'Fallo entrare',p:.3,si:{r:'Era davvero un tecnico. Che sollievo.',k:''},no:{fx:()=>{const x=r(500,3000);soldi(-x);mod('felicita',-8);return [`Mentre controllava, il complice ti ha rubato ${eur(x)}.`,'b']}}},
  {l:'Chiama i carabinieri',e:{f:4,k:2},r:'Lo arrestano. Era un truffatore.'}]});
ev({id:'testamento',min:65,max:100,once:1,t:'Il testamento',x:'Il notaio ti consiglia di fare testamento.',c:[
  {l:'Fallo',costo:()=>P(500),fl:'testamento',e:{f:2},r:'Tutto in ordine. Ti senti più leggero.'},
  {l:'Non ora',pers:{C:-1},r:'Ci penserai.'}]});
ev({id:'caduta',min:72,max:100,t:'Una caduta',x:'Scivoli sul pavimento bagnato del bagno.',c:[
  {l:'Fisioterapia',costo:()=>P(800),e:{s:-4},r:'Qualche mese di esercizi e torni in piedi.'},
  {l:'Stringi i denti',e:{s:-10},r:'Ci metti tanto a riprenderti.'}]});
ev({id:'ballo',min:60,max:90,t:'Serata danzante',x:'Al circolo organizzano una serata di ballo liscio.',c:[
  {l:'Balla tutta la sera',pers:{E:3},e:{f:6,s:1},fx:()=>{if(single()&&chance(.2)){coda.unshift({e:EV.incontro,d:{x:'ballo'}});}},r:'Valzer, tango e mazurka.'},
  {l:'Guarda gli altri',pers:{E:-1},e:{f:2},r:'Ti godi la musica dal tavolo.'}]});
ev({id:'tecnologia_anziani',min:68,max:100,t:'Il tablet',x:'I nipoti ti regalano un tablet.',c:[
  {l:'Impara a usarlo',pers:{O:3},e:{i:2,tech:5,f:3},r:'Ora fai le videochiamate e guardi le ricette su YouTube.'},
  {l:'Usalo come tagliere',pers:{O:-2},e:{f:1},r:'Funziona benissimo per il formaggio.'}]});

/* ---------- Conseguenze (link) ---------- */
ev({id:'crypto_esito',link:1,auto:{p:.3,si:{fx:d=>{const x=d.x*r(3,12);S.borsa.cripto=(S.borsa.cripto||0)+x/S.mondo.prezzi.cripto;S.costoBorsa.cripto=(S.costoBorsa.cripto||0)+d.x;return [`La criptovaluta che hai comprato l'anno scorso esplode: ora vale ${eur(x)}! La trovi negli investimenti.`,'g']}},no:{e:{f:-5},r:"La criptovaluta dell'anno scorso è crollata a zero. Addio 1.000 €.",k:'b'}}});
ev({id:'piramide_esito',link:1,auto:{p:.15,si:{e:{m:2500},r:'Il «business» ti fa guadagnare 2.500 €. Ma molti dei tuoi amici ci hanno perso.',k:'g'},no:{e:{f:-6},fx:()=>relAmici(-8),r:'Lo schema piramidale crolla. Hai perso tutto e anche qualche amico a cui l\'avevi proposto.',k:'b'}}});
ev({id:'infarto',link:1,auto:{p:.4,si:{e:{s:-25},fx:()=>{if(chance(.3))ammala('Insufficienza cardiaca',4);else ammala('Cardiopatia ischemica',3)},r:'Hai un infarto. Ti salvano in tempo, ma il cuore non sarà più quello di prima: il colesterolo che avevi ignorato ti ha presentato il conto.',k:'b'},no:{r:''}}});
ev({id:'screening_saltato',link:1,auto:{p:.25,si:{fx:()=>{ammalaTumore(tumorePer(S.sesso,Math.max(45,S.eta),S.dip.fumo),true)},r:'Un problema che uno screening avrebbe trovato in tempo ora è grave.',k:'b'},no:{r:''}}});
ev({id:'restituzione',link:1,auto:{p:d=>.3+d.p.rapporto/200,si:{fx:d=>{soldi(d.x||500)},e:{rel:5},r:'{P} ti restituisce i soldi che ti doveva ({xe}).',k:'g'},no:{e:{rel:-18,f:-3},r:'{P} non ti ha mai restituito i {xe}. Il rapporto si incrina.',k:'b'}}});
ev({id:'affare_esito',link:1,auto:{p:.45,si:{fx:d=>{soldi(d.x*3)},e:{rel:8,f:8},r:'L\'attività aperta con {P} va alla grande: ti spettano {xe} moltiplicati per tre!',k:'g'},no:{e:{rel:-10,f:-6},r:"L'attività con {P} chiude. Hai perso i {xe} investiti.",k:'b'}}});
ev({id:'tradimento_scoperto',link:1,cond:d=>d.p&&['Partner','Coniuge'].includes(d.p.ruolo),t:'Scoperto',x:"{P} ha trovato i messaggi. Sa del tradimento.",c:[
  {l:'Chiedi perdono',p:d=>d.p.rapporto/160,si:{e:{rel:-30,f:-6},r:'{P} ti perdona, ma niente sarà più come prima.'},no:{fx:d=>chiudiRelazione(d.p,'{P} ti lascia. Le valigie sono già sul pianerottolo.')}},
  {l:'Nega tutto',p:.35,si:{e:{rel:-10,k:-3},r:'{P} decide di crederti. Per ora.'},no:{fx:d=>chiudiRelazione(d.p,'Le prove sono schiaccianti. {P} ti lascia.')}}]});
ev({id:'latitante_preso',link:1,auto:{p:.3,si:{fx:()=>{S.latitante=false;entraCarcere(r(3,5))},r:'Ti arrestano durante un controllo stradale.',k:'b'},no:{r:''}}});

/* ---------- Eventi con persone ---------- */
ev({id:'gen_pranzo',min:18,max:75,chi:['Madre','Padre'],t:'Pranzo della domenica',x:'{Tuo} {P} ti invita a pranzo domenica.',c:[
  {l:'Vai',pers:{A:1},e:{rel:8,f:2},r:'Lasagne, chiacchiere e avanzi da portare a casa.'},
  {l:'Inventa una scusa',pers:{A:-1},e:{rel:-6},r:'{P} ci rimane male.'}]});
ev({id:'gen_malato',min:25,max:85,chi:['Madre','Padre'],pc:p=>p.eta>=65,t:'Un momento difficile',x:'{Tuo} {P} non sta bene e ha bisogno di assistenza quotidiana.',c:[
  {l:'Te ne occupi tu',e:{rel:15,f:-4,k:6,perf:-6},r:'Mesi difficili ma preziosi. {P} non lo dimenticherà.'},
  {l:'Paga una badante',costo:()=>P(12000),e:{rel:5},r:'Trovi una persona fidata che si prende cura di {lui}.'},
  {l:'Lascia che se ne occupino altri',e:{rel:-15,k:-4},r:'Ti senti in colpa.'}]});
ev({id:'gen_soldi',min:18,max:65,chi:['Madre','Padre'],cond:()=>S.classe==='umile'&&S.soldi>=P(800),t:'Le bollette',x:'{Tuo} {P} ha difficoltà a pagare le bollette e ti chiede 800 €.',c:[
  {l:'Aiutal{po}',costo:()=>P(800),e:{rel:12,k:4},r:'{P} ti abbraccia forte.'},
  {l:'Non posso',e:{rel:-10},r:'Non insiste, ma lo vedi deluso.'}]});
ev({id:'gen_separazione',min:6,max:17,once:1,chi:['Padre'],cond:()=>vivi(['Madre']).length>0,t:'I tuoi genitori',x:'Da mesi i tuoi genitori litigano. Una sera ti dicono che si separano.',c:[
  {l:'Prova a farli riconciliare',p:.3,si:{e:{f:4},r:'Dopo una lunga crisi, decidono di riprovarci.'},no:{fl:'separati',e:{f:-8},r:'Si separano lo stesso. Ora hai due case.'}},
  {l:'Accetti la decisione',fl:'separati',e:{f:-5},r:'Vivrai una settimana da papà e una da mamma.'},
  {l:'Ti chiudi in camera',fl:'separati',e:{f:-10,voto:-5},r:'Per un po\' non parli con nessuno.'}]});
ev({id:'gen_consiglio',min:14,max:45,chi:['Madre','Padre'],t:'Un consiglio',x:'{Tuo} {P} ti dà un consiglio non richiesto sulla tua vita.',c:[
  {l:'Ascolta',e:{rel:5,i:1},r:'Dopotutto non aveva tutti i torti.'},
  {l:'Rispondi male',e:{rel:-8},r:'Porta sbattuta.'}]});
ev({id:'nonno_storie',min:5,max:30,chi:['Nonno'],t:'I racconti',x:'{Tuo} {P} ti racconta di quando era giovane.',c:[
  {l:'Ascolta con attenzione',e:{rel:10,i:1,f:2},r:d=>`Storie ${S.anno-d.p.eta<1940?'di guerra, di emigrazione':S.anno-d.p.eta<1960?'del dopoguerra, della prima televisione':'degli anni Settanta, delle radio libere'} e di balli in piazza.`},
  {l:'Guardi il telefono',cond:()=>S.eta>=12,e:{rel:-6},r:'{P} se ne accorge e si interrompe.'},
  {l:'Ti distrai a giocare',cond:()=>S.eta<12,e:{rel:-3},r:'{P} sorride e ti lascia giocare.'}]});
ev({id:'nonno_soldi',min:6,max:18,chi:['Nonno'],t:'Di nascosto',x:'{Tuo} {P} ti allunga 50 € di nascosto: «Non dirlo a nessuno».',c:[
  {l:'Mettili da parte',e:{m:50,rel:3},r:'Il salvadanaio cresce.'},
  {l:'Spendili subito',e:{f:6,rel:3},r:'Figurine e gelato per tutti.'}]});
ev({id:'nonna_ricetta',min:15,max:50,once:1,chi:['Nonno'],pc:p=>p.sesso==='F',t:'La ricetta',x:'{Tuo} {P} vuole insegnarti a fare il ragù della domenica.',c:[
  {l:'Impara',e:{f:6,cucina:10,rel:10},r:'Sei ore sul fuoco, ma ora il segreto è tuo.'},
  {l:'Non ho tempo',e:{rel:-5},r:'«Va bene, sarà per un\'altra volta…»'}]});
ev({id:'fra_litigio',min:6,max:17,chi:['Fratello'],t:'Fratelli',x:'{Tuo} {P} ha usato le tue cose senza chiedere.',c:[
  {l:'Litiga',e:{rel:-8,f:-2},r:'Urla, porte sbattute e una settimana senza parlarvi.'},
  {l:'Fai pace',e:{rel:5,k:1},r:'Alla fine vi fate una risata.'},
  {l:'Fai la spia ai genitori',e:{rel:-10,k:-1},r:'{P} viene punit{po}. E ti odia un pochino.'}]});
ev({id:'fra_soldi',min:20,max:70,chi:['Fratello'],pc:p=>p.eta>=18,cond:()=>S.soldi>=P(2000),t:'Un prestito in famiglia',x:'{Tuo} {P} ti chiede 2.000 € per un problema urgente.',c:[
  {l:'Presta i soldi',costo:()=>P(2000),x:2000,e:{rel:10},fut:[1,'restituzione'],r:'Bonifico fatto.',k:''},
  {l:'Rifiuta',e:{rel:-8},r:'«Pensavo di poter contare su di te.»'}]});
ev({id:'fra_matrimonio',min:18,max:70,chi:['Fratello'],pc:p=>p.eta>=24&&!p.sposato,t:'Un matrimonio in famiglia',x:'{Tuo} {P} si sposa e ti chiede di fare da testimone.',c:[
  {l:'Accetta',costo:()=>P(500),e:{rel:12,f:5},fx:d=>{d.p.sposato=true},r:'Un discorso che fa piangere tutti.'},
  {l:'Rifiuta',e:{rel:-15},fx:d=>{d.p.sposato=true},r:'{P} sceglie un altro testimone.'}]});
ev({id:'fra_nipote',min:20,max:80,chi:['Fratello'],pc:p=>(p.sposato||['coppia','sposato'].includes(p.coppia))&&!coppiaStessoSesso(p)&&p.eta>=25&&p.eta<=45&&!p.figli,t:'Diventi zi{o}!',x:'{Tuo} {P} aspetta un bambino.',c:[
  {l:'Regala la culla',costo:()=>P(300),e:{rel:10,f:6},fx:d=>{d.p.figli=1},r:'Diventi zi{o}! Il bambino è bellissimo.'},
  {l:'Manda gli auguri',e:{f:4,rel:2},fx:d=>{d.p.figli=1},r:'Diventi zi{o}!'}]});
ev({id:'fra_eredita',link:1,t:"L'eredità",x:'{Tuo} {P} contesta la divisione dell\'eredità dei vostri genitori.',c:[
  {l:'Dividete in parti uguali',e:{rel:6,k:3},r:'Fate pace davanti al notaio.'},
  {l:'Pretendi la parte più grande',p:.5,si:{e:{m:[5000,20000],rel:-35,k:-4},r:'Ottieni di più, ma il rapporto con {tuo} è rovinato.'},no:{e:{m:-3000,rel:-30},r:'Causa persa e spese legali.'}},
  {l:'Lascia tutto a {lui}',fx:d=>{const x=Math.min(S.soldi,10000);soldi(-x);d.p.rapporto=clamp(d.p.rapporto+20);S.karma=clamp(S.karma+6);return [`Rinunci a ${eur(x)}. {P} non sa come ringraziarti.`.replace('{P}',d.p.nome),'g']}}]});
ev({id:'ami_prestito',min:16,max:85,chi:['Amico'],cond:()=>S.soldi>=P(500),t:'Un favore',x:'{Tuo} {P} ti chiede 500 € in prestito. Giura che te li ridà presto.',c:[
  {l:'Prestali',costo:()=>P(500),x:500,e:{rel:6},fut:[1,'restituzione'],r:'Bonifico fatto. Vedremo.',k:''},
  {l:'Rifiuta',e:{rel:-8},r:'{P} non la prende benissimo.'}]});
ev({id:'ami_matrimonio',min:22,max:65,chi:['Amico'],pc:p=>p.eta>=24&&!p.sposato,t:'Partecipazioni',x:'{Tuo} {P} si sposa e ti invita al matrimonio.',c:[
  {l:'Vai e fai un bel regalo',costo:()=>P(250),e:{rel:10,f:5},fx:d=>{d.p.sposato=true;if(single()&&chance(.25))coda.unshift({e:EV.incontro,d:{x:'matrimonio'}})},r:'Balli fino a notte fonda.'},
  {l:'Non puoi andare',e:{rel:-10},fx:d=>{d.p.sposato=true},r:'Mandi un regalo, ma {P} ci tiene a te e ci resta male.'}]});
ev({id:'ami_trasloco',min:20,max:60,chi:['Amico'],t:'Trasloco',x:'{Tuo} {P} ti chiede una mano per il trasloco. Quarto piano, senza ascensore.',c:[
  {l:'Aiutal{po}',e:{rel:9,s:-1},r:'Divano, frigo e pizza alla fine.'},
  {l:'Hai la schiena a pezzi',e:{rel:-5},r:'Una scusa poco credibile.'}]});
ev({id:'ami_confida',min:13,max:85,chi:['Amico'],t:'Un periodo difficile',x:'{Tuo} {P} ti confida che sta passando un periodo molto difficile.',c:[
  {l:'Stai vicino a {lui}',e:{rel:12,k:4,f:-1},r:'Passate la notte a parlare. {P} ti ringrazia di cuore.'},
  {l:'Consigliagli di parlare con uno psicologo',e:{rel:6,k:3},r:'{P} prende appuntamento. Un primo passo importante.'},
  {l:'Cambia discorso',e:{rel:-10},r:'{P} si chiude in sé.'}]});
ev({id:'ami_affare',min:24,max:60,chi:['Amico'],cond:()=>S.soldi>=P(10000),t:'Un affare',x:'{Tuo} {P} ti propone di aprire insieme un food truck. Servono 10.000 €.',c:[
  {l:'Entra in società',costo:()=>P(10000),x:10000,fut:[2,'affare_esito'],e:{rel:8},r:'Firmate in un bar, su un tovagliolo. Poi dal notaio.',k:''},
  {l:'Rifiuta',e:{rel:-4},r:'Non è il momento.'}]});
ev({id:'ami_alle_spalle',min:13,max:60,chi:['Amico'],t:'Alle tue spalle',x:'Scopri che {tuo} {P} parla male di te alle spalle.',c:[
  {l:'Affrontal{po}',p:.5,si:{e:{rel:5},r:'Era un malinteso. Vi chiarite.'},no:{e:{rel:-25,f:-4},r:'Litigata furiosa.'}},
  {l:"Chiudi l'amicizia",fx:d=>{S.relazioni=S.relazioni.filter(x=>x!==d.p);mod('felicita',-3);return [`Non vedrai più ${d.p.nome}.`,'b']}},
  {l:'Fai finta di niente',e:{f:-3,rel:-5},r:'Il dubbio ti resta.'}]});
ev({id:'ami_vacanza',min:16,max:55,chi:['Amico'],t:'Vacanza tra amici',x:'{Tuo} {P} organizza una settimana a Ibiza.',c:[
  {l:'Vai',costo:()=>P(900),e:{f:9,rel:9,bev:1},r:'Spiagge, feste e una foto che non mostrerai mai ai tuoi.'},
  {l:'Rinuncia',e:{rel:-4},r:'Guardi le foto dal divano.'}]});
ev({id:'ami_presenta',min:18,max:55,chi:['Amico'],cond:()=>single(),t:'Un appuntamento al buio',x:'{Tuo} {P} vuole presentarti una persona che secondo {lui} è perfetta per te.',c:[
  {l:'Accetta',fx:d=>{coda.unshift({e:EV.incontro,d:{x:'amico'}});d.p.rapporto=clamp(d.p.rapporto+3);return null}},
  {l:'No grazie',e:{rel:-2},r:'Preferisci fare da sol{o}.'}]});
ev({id:'ami_compleanno',min:8,max:90,chi:['Amico'],t:'Il compleanno',x:'È il compleanno di {tuo} {P}.',c:[
  {l:'Organizza una festa a sorpresa',costo:()=>P(150),e:{rel:14,f:4},r:'{P} si commuove.'},
  {l:'Manda un messaggio',cond:()=>S.eta>=12,e:{rel:1},r:'Un cuore e una torta in emoji.'},
  {l:'Fai un disegno per {lui}',cond:()=>S.eta<12,e:{rel:5,arte:1},r:'{P} lo appende sopra il letto.'},
  {l:'Te ne dimentichi',e:{rel:-8},r:'Te ne ricordi due giorni dopo.'}]});
ev({id:'par_gelosia',min:18,max:80,chi:['Partner','Coniuge'],pc:p=>p.tr===TR.GELOSO||p.rapporto<50,t:'Gelosia',x:'{P} ti controlla il telefono mentre dormi.',c:[
  {l:'Affronta la questione',p:.5,si:{e:{rel:4},r:'Una discussione sincera. {P} promette di fidarsi di più.'},no:{e:{rel:-12,f:-4},r:'Litigate fino alle tre di notte.'}},
  {l:'Rassicural{po}',e:{rel:3,f:-2},r:'Mostri tutto. {P} si scusa.'},
  {l:'Chiudi la relazione',fx:d=>chiudiRelazione(d.p,'Basta gelosie: chiudi con {P}.')}]});
ev({id:'par_convivenza',min:18,max:55,chi:['Partner'],pc:p=>!p.conv&&p.rapporto>=55,t:'Vivere insieme',x:'{P} ti chiede di andare a vivere insieme.',c:[
  {l:'Sì!',fx:d=>{convivi(d.p)},e:{rel:12,f:7},r:'Scatoloni, IKEA e la prima litigata per l\'armadio.'},
  {l:'È troppo presto',e:{rel:-8},r:'{P} accetta, ma ci resta male.'}]});
ev({id:'par_proposta',min:20,max:65,chi:['Partner'],pc:p=>p.rapporto>=62&&(p.sesso!==S.sesso||unioneCivilePossibile()),t:'La proposta',x:'A cena, {P} si inginocchia con un anello: «Vuoi sposarmi?»',c:[
  {l:'Sì!',fx:d=>{coda.unshift({e:EV.matrimonio,d});return null}},
  {l:'Ho bisogno di tempo',e:{rel:-15},r:'Un silenzio imbarazzante. Il ristorante intero vi guarda.'},
  {l:'No',fx:d=>chiudiRelazione(d.p,'Dici di no. {P} se ne va in lacrime.')}]});
ev({id:'par_figlio',min:22,max:45,chi:['Coniuge','Partner'],pc:p=>p.conv&&p.rapporto>=55&&!!coppiaFertile(p),cond:()=>!S.provano&&!S.gravidanza,t:'Un figlio?',x:'{P} ti dice che vorrebbe un figlio.',c:[
  {l:'Proviamoci',e:{rel:6},fx:d=>{iniziaTentativi(d.p)},r:'Da questo mese ci provate. Può volerci un po\'.'},
  {l:'Non ancora',e:{rel:-8},r:'{P} rispetta la tua scelta, ma ci soffre.'},
  {l:'Non voglio figli',e:{rel:-18},r:'Una conversazione difficile.'}]});
ev({id:'par_tentazione',min:18,max:65,chi:['Partner','Coniuge'],t:'Tentazione',x:'Durante una trasferta, una persona affascinante ci prova con te.',c:[
  {l:'Cedi alla tentazione',e:{f:3,k:-8},fut:[r(1,3),'tradimento_scoperto'],r:'Torni a casa con il senso di colpa.',k:''},
  {l:'Resta fedele',e:{k:3,rel:3},r:'Torni da {P} con un regalo dalla trasferta.'}]});
ev({id:'par_tradito',min:18,max:75,chi:['Partner','Coniuge'],pc:p=>p.rapporto<45,t:'Il tradimento',x:'Scopri che {P} ti tradisce da mesi.',c:[
  {l:'Perdona',e:{rel:10,f:-10},r:'Decidi di provarci ancora. Fa male.'},
  {l:'Chiudi la relazione',fx:d=>chiudiRelazione(d.p,'Chiudi con {P}. Tante lacrime, ma è la scelta giusta.')}]});
ev({id:'par_anniversario',min:18,max:90,chi:['Partner','Coniuge'],t:"L'anniversario",x:'Oggi è il vostro anniversario.',c:[
  {l:'Cena in un ristorante stellato',costo:()=>P(300),e:{rel:12,f:4},r:'Una serata perfetta.'},
  {l:'Fiori e cioccolatini',costo:()=>P(40),e:{rel:5},r:'Un pensiero gradito.'},
  {l:'Te ne dimentichi',e:{rel:-14},r:'{P} ti guarda a lungo. Poi va a letto senza dire niente.'}]});
ev({id:'par_trasferimento',min:22,max:60,chi:['Partner','Coniuge'],pc:p=>p.conv,t:'Un\'offerta lontano',x:'{P} riceve un\'ottima offerta di lavoro in un\'altra città.',c:[
  {l:'Trasferitevi insieme',fx:d=>{const c=pick(comuni().filter(x=>x.p>60000&&x.n!==S.citta));const da=S.citta;S.citta=c.n;S.prov=c.s;dopoTrasloco(da);S.mercato=null;if(S.casa.tipo==='affitto')S.casa=affittoBase(S.casa.n);if(S.lavoro&&!JOB[S.lavoro.id].var){licenzia('Lasci il lavoro per trasferirti.')}d.p.rapporto=clamp(d.p.rapporto+12);return [`Vi trasferite a ${c.n}. Nuova città, nuova vita.`,'']}},
  {l:'Relazione a distanza',e:{rel:-12,f:-3},r:'Weekend alterni e tanti treni.'},
  {l:'Chiedi di rifiutare',e:{rel:-18},r:'{P} rinuncia. Te lo ricorderà a ogni litigio.'}]});
ev({id:'par_suoceri',min:20,max:70,chi:['Partner','Coniuge'],t:'I suoceri',x:'I genitori di {P} vengono a cena da voi per la prima volta.',c:[
  {l:'Cucina tu',p:()=>.3+S.abil.cucina/120,si:{e:{rel:8,f:4,cucina:3},r:'Chiedono il bis. Promoss{o}.'},no:{e:{rel:-4,cucina:2},r:'Il risotto sa di bruciato. Sorrisi di cortesia.'}},
  {l:'Ordina sushi',costo:()=>P(90),e:{rel:2},r:'Nessun rischio, nessuna gloria.'}]});
ev({id:'par_vacanza',min:18,max:85,chi:['Partner','Coniuge'],t:'Viaggio di coppia',x:'{P} propone un viaggio insieme a Parigi.',c:[
  {l:'Partite',costo:()=>P(1200),e:{rel:12,f:8},r:'Torre Eiffel, croissant e foto ovunque.'},
  {l:'Non possiamo permettercelo',e:{rel:-3},r:'Weekend a casa con un film.'}]});
ev({id:'fig_voto',min:25,max:70,chi:['Figlio'],pc:p=>p.eta>=7&&p.eta<=18,t:'Brutto voto',x:'{Tuo} {P} porta a casa un brutto voto.',c:[
  {l:'Punizione',e:{rel:-8},fx:d=>{d.p.voto=clamp((d.p.voto||50)+3)},r:'Niente telefono per due settimane.'},
  {l:'Aiutal{po} con i compiti',e:{rel:8,f:-1},fx:d=>{d.p.voto=clamp((d.p.voto||50)+8)},r:'Pomeriggi insieme sui libri. Il prossimo voto è un 8.'},
  {l:'Lascia correre',fx:d=>{d.p.voto=clamp((d.p.voto||50)-4)},r:'«Capita.»'}]});
ev({id:'fig_cellulare',min:25,max:65,chi:['Figlio'],pc:p=>p.eta>=9&&p.eta<=14,t:'Il primo smartphone',x:'{Tuo} {P} vuole uno smartphone come tutti i compagni.',c:[
  {l:'Compralo',costo:()=>P(400),e:{rel:8},r:'Salti di gioia per tutta la casa.'},
  {l:'Non ancora',e:{rel:-6},r:'Porta sbattuta.'}]});
ev({id:'fig_bullismo',min:25,max:65,chi:['Figlio'],pc:p=>p.eta>=8&&p.eta<=15,t:'Problemi a scuola',x:'Scopri che {tuo} {P} viene preso di mira da alcuni compagni.',c:[
  {l:'Parla con la scuola',e:{rel:10,k:2},r:'La scuola interviene. {P} torna a sorridere.'},
  {l:'Iscrivil{po} a un corso di autodifesa',costo:()=>P(300),e:{rel:6},r:'{P} acquista sicurezza.'},
  {l:'Minimizza',e:{rel:-10},r:'{P} si sente sol{po}.'}]});
ev({id:'fig_ribelle',min:30,max:70,chi:['Figlio'],pc:p=>p.eta>=14&&p.eta<=17,t:'Alle tre di notte',x:'{Tuo} {P} rientra alle tre di notte senza avvisare.',c:[
  {l:'Punizione esemplare',e:{rel:-8},r:'Un mese senza uscire.'},
  {l:'Parlane con calma',p:.6,si:{e:{rel:6},r:'{P} si scusa. Vi capite meglio.'},no:{e:{rel:-4},r:'«Tanto non capisci niente!»'}},
  {l:'Lascia perdere',e:{rel:2},fx:d=>{d.p.voto=clamp((d.p.voto||50)-5)},r:'Fai finta di dormire.'}]});
ev({id:'fig_universita',min:35,max:75,chi:['Figlio'],pc:p=>p.eta>=18&&p.eta<=20&&p.studio==='diploma'&&!p.uni,t:'Fuori sede',x:'{Tuo} {P} vuole studiare all\'università in un\'altra città.',c:[
  {l:'Paga tu affitto e tasse',costo:()=>P(8000),e:{rel:12},fx:d=>{d.p.uni=pick(FACOLTA).n;d.p.fuori=true},r:'{P} parte con le valigie e un po\' di magone.'},
  {l:'Meglio la città vicino casa',e:{rel:-4},fx:d=>{d.p.uni=pick(FACOLTA).n},r:'{P} si iscrive vicino a casa.'}]});
ev({id:'fig_matrimonio',min:40,max:85,chi:['Figlio'],pc:p=>p.eta>=24&&!p.sposato,t:'Si sposa!',x:'{Tuo} {P} ti annuncia che si sposa.',c:[
  {l:'Contribuisci alle spese',costo:()=>P(5000),e:{rel:12,f:8},fx:d=>{d.p.sposato=true},r:'Un matrimonio bellissimo.'},
  {l:'Partecipa e basta',e:{rel:2,f:6},fx:d=>{d.p.sposato=true},r:'Ti commuovi durante il sì.'}]});
ev({id:'fig_casa',min:45,max:85,chi:['Figlio'],pc:p=>p.eta>=26&&p.eta<=45,cond:()=>S.soldi>=P(20000),t:'La prima casa',x:'{Tuo} {P} ti chiede un aiuto per l\'anticipo della casa.',c:[
  {l:'Regala 20.000 €',costo:()=>P(20000),e:{rel:18,k:3},r:'{P} ti abbraccia commoss{po}.'},
  {l:'Presta 20.000 €',costo:()=>P(20000),x:20000,e:{rel:10},fut:[3,'restituzione'],r:'Firmate una scrittura privata.',k:''},
  {l:'Non posso',e:{rel:-8},r:'{P} capisce, ma resta delus{po}.'}]});
ev({id:'fig_nipote',min:45,max:95,chi:['Figlio'],pc:p=>p.eta>=24&&p.eta<=45&&(p.sposato||['coppia','sposato'].includes(p.coppia))&&!coppiaStessoSesso(p),t:'Diventi {nonno}!',x:'{Tuo} {P} aspetta un bambino.',c:[
  {l:'Che gioia!',fx:d=>{const n=nuovaPersona('Nipote',pick(['M','F']),0,d.p.sesso==='M'?d.p.cognome:pick(COGNOMI),{rapporto:r(70,95),gen:d.p.id});mod('felicita',12);if(!S.fatti.primoNipote){S.fatti.primoNipote=1;momento('nipote',{tit:n.nome,sub:g('Diventi nonno','Diventi nonna'),pids:[n.id]})}return [`È nat${gp(n,'o','a')} ${n.nome}. Sei ${g('nonno','nonna')}!`,'g']}}]});
ev({id:'fig_ospita',min:70,max:100,chi:['Figlio'],pc:p=>p.eta>=30&&p.rapporto>=50,cond:()=>S.casa.tipo!=='figlio',t:'Vieni a stare da noi',x:'{Tuo} {P} ti propone di andare a vivere da {lui}.',c:[
  {l:'Accetta',e:{f:6,rel:8},fx:()=>{S.casa={tipo:'figlio'}},r:'Ti trasferisci da {P}. I nipoti sono felicissimi.'},
  {l:'Preferisco casa mia',e:{rel:-2},r:'Grazie, ma te la cavi ancora benissimo.'}]});
ev({id:'nip_visita',min:50,max:100,chi:['Nipote'],t:'Visita',x:'{Tuo} {P} viene a trovarti.',c:[
  {l:'Racconta una storia',e:{rel:10,f:5},r:'{P} ascolta a bocca aperta.'},
  {l:'Dagli la paghetta',costo:()=>P(50),e:{rel:12,f:3},r:'«Non dirlo a mamma e papà.»'}]});
ev({id:'ex_ritorno',min:18,max:80,chi:['Ex'],pc:p=>etaCompatibile(p),cond:()=>single(),t:'Un messaggio',x:'{P}, la tua ex fiamma, ti scrive: «Mi manchi».',c:[
  {l:'Riprova',p:.5,si:{fx:d=>{d.p.ruolo='Partner';d.p.rapporto=55},e:{f:7},r:'Tornate insieme!'},no:{e:{f:-5},r:'Dopo due settimane vi ricordate perché vi eravate lasciati.'}},
  {l:'Ignora',pers:{N:-1},r:'Il passato resta nel passato.'},
  {l:'Blocca',fx:d=>{S.relazioni=S.relazioni.filter(x=>x!==d.p)},r:'Numero bloccato.'}]});

/* ---------- Amore ---------- */
ev({id:'incontro',link:1,t:'Un incontro',x:d=>{const c=d.cand||(d.cand=candidato());const dove={amico:'Il tuo amico vi presenta a cena.',matrimonio:'Al matrimonio ti siedono accanto a una persona interessante.',ballo:'Alla serata danzante qualcuno ti invita a ballare.'}[d.x]||'Conosci una persona interessante.';return `${dove}\n${c.nome}, ${c.eta} anni. ${tratto(c)}. Aspetto ${c.asp}/100.`},c:[
  {l:'Chiedi di uscire',fx:d=>appuntamento(d.cand)},
  {l:'Non è il tuo tipo',r:'Vi salutate cordialmente.'}]});
const unioneCivile=d=>!!(d&&d.p&&d.p.sesso===S.sesso);
ev({id:'matrimonio',link:1,t:d=>unioneCivile(d)?'L\'unione civile':'Il matrimonio',x:d=>unioneCivile(d)?'Per le coppie dello stesso sesso c\'è l\'unione civile (legge 76/2016): si celebra in Comune. Come volete festeggiare?':'Che matrimonio volete?',c:[
  {l:'Rito civile semplice',sub:()=>eur(P(3000)),costo:()=>P(3000),cond:d=>!unioneCivile(d),fx:d=>sposa(d.p,6)},
  {l:'Matrimonio in chiesa con 150 invitati',sub:()=>eur(P(25000)),costo:()=>P(25000),cond:d=>!unioneCivile(d),fx:d=>sposa(d.p,12)},
  {l:'Matrimonio da sogno in una villa sul lago',sub:()=>eur(P(60000)),costo:()=>P(60000),cond:d=>!unioneCivile(d),fx:d=>sposa(d.p,18)},
  {l:'Fuga d\'amore a Las Vegas',sub:()=>eur(P(1500)),costo:()=>P(1500),cond:d=>!unioneCivile(d),fx:d=>sposa(d.p,8)},
  {l:'Unione civile in Comune, poi festa con gli amici',sub:()=>eur(P(3000)),costo:()=>P(3000),cond:unioneCivile,fx:d=>sposa(d.p,8)},
  {l:'Unione civile e festa da sogno in una villa sul lago',sub:()=>eur(P(60000)),costo:()=>P(60000),cond:unioneCivile,fx:d=>sposa(d.p,18)},
  {l:'Solo in Comune con due testimoni',sub:'Gratis',fx:d=>sposa(d.p,4)}]});

/* ---------- In carcere ---------- */
ev({id:'cella',prig:1,t:'Il compagno di cella',x:'Il tuo compagno di cella ti propone un affare: contrabbandare sigarette.',c:[
  {l:'Accetta',p:.6,si:{e:{m:500,k:-4},r:'Guadagni qualcosa. Nessuno se ne accorge.'},no:{fx:()=>{S.carcere++;return ['Vi scoprono. Ti aggiungono un anno di pena.','b']}}},
  {l:'Rifiuta',e:{k:2},r:'Vuoi uscire il prima possibile.'}]});
ev({id:'mensa',prig:1,t:'Tensione in mensa',x:'In mensa un detenuto ti provoca davanti a tutti.',c:[
  {l:'Reagisci',p:.5,si:{e:{f:3},r:'Da oggi nessuno ti dà più fastidio.'},no:{e:{s:-12},r:'Finisci in infermeria.'}},
  {l:'Ignoralo',e:{f:-3},r:'Abbassi lo sguardo e mangi in silenzio.'}]});
ev({id:'colloquio_carcere',prig:1,t:'Il colloquio',x:'È giorno di colloquio con i familiari.',c:[
  {l:'Chiedi ai tuoi di venire',fx:()=>{const gv=vivi(['Madre','Padre']);if(!gv.length)return ['Non viene nessuno.','b'];relGenitori(5);mod('felicita',6);return ['Tua madre ti porta una torta fatta in casa.','g']}},
  {l:'Preferisci non farti vedere così',e:{f:-3},r:'Rimani in cella.'}]});
