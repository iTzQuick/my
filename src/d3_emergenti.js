/* ================= EVENTI CHE NASCONO DALLA VITA ================= */
function aggiungiOre(id,h){
  const lib=oreLibere()-oreRoutine();
  const x=h>0?Math.min(h,Math.max(0,lib)):h;
  S.routine[id]=Math.max(0,(S.routine[id]||0)+x);return x;
}
const famIn=()=>S.relazioni.filter(p=>p.vivo&&['Madre','Padre','Fratello','Nonno','Figlio','Coniuge','Partner','Patrigno'].includes(p.ruolo));
function relGruppo(L,a,b){L.forEach(p=>{p.rapporto=clamp(p.rapporto+r(a,b));p.ultimo=S.t})}

/* ---------- Calendario ---------- */
ev({id:'natale_cal',link:1,k:'Dicembre',t:'Natale',x:()=>{
  const sp=S.relazioni.some(p=>p.vivo&&p.ruolo==='Suocero');
  return S.eta<14?'Arriva Natale. Albero, regali, parenti che ti pizzicano le guance.':`Arriva Natale. ${sp?'Quest\'anno tocca decidere con quale famiglia passarlo. ':''}Come lo vuoi vivere?`},
  c:()=>S.eta<14?[
    {l:'Aiuta a fare l\'albero',fx:()=>{relGruppo(famIn(),2,5);mod('felicita',4);return ['Le palline più belle le appendi tu.','g']}},
    {l:'Scuoti tutti i pacchetti per indovinare i regali',fx:()=>{mod('felicita',3);return [pick(['Indovini: è un pigiama.','Indovini: sono calzini. Di nuovo.','Non indovini: è proprio il regalo che volevi!']),'']}},
    {l:'Resta in camera a giocare',fx:()=>{relGruppo(famIn(),-2,0);return ['I parenti chiedono di te a ogni portata.','']}}]:[
    {l:'Pranzo con tutta la famiglia',sub:'Tanta gente, tante portate',fx:()=>{const L=famIn();relGruppo(L,2,6);S.bis.soc=clamp(S.bis.soc+10);const x=P(40)*Math.max(1,L.length);soldi(-x);
      if(chance(.25-pz('A')*.1)){const t=pick(L);if(t){t.rapporto=clamp(t.rapporto-8);ricorda(t,'Avete litigato a Natale');return [`Tra il secondo e il dolce scoppia una discussione con ${t.nome}. Regali: ${eur(x)}.`,'b']}}
      mod('felicita',pz('E')>0?6:2);return [`Una giornata lunghissima, piena di risate. Regali: ${eur(x)}.`,'g']}},
    {l:'Natale tranquillo, in pochi',sub:'Divano, film e panettone',fx:()=>{S.bis.stress=clamp(S.bis.stress-10);S.bis.energia=clamp(S.bis.energia+10);mod('felicita',pz('E')<0?6:2);return ['Pigiama fino a sera. Esattamente ciò che ti serviva.','g']}},
    {l:'Aiuta alla mensa dei poveri',sub:'Il pranzo di Natale per chi è solo',fx:()=>{S.karma=clamp(S.karma+5);mod('felicita',4+pz('A')*3);segnaVita('volontariato');return ['Servi duecento pasti. Torni a casa stanc'+g('o','a')+' e felice.','g']}},
    {l:'Parti per una capitale europea',sub:()=>eur(P(900)),costo:()=>P(900),fx:()=>{mod('felicita',6);S.bis.stress=clamp(S.bis.stress-12);famIn().filter(p=>['Madre','Padre'].includes(p.ruolo)).forEach(p=>p.rapporto=clamp(p.rapporto-4));return ['Mercatini, vin brulé e strade illuminate. Tua madre non l\'ha presa benissimo.','g']}}]});
ev({id:'propositi',link:1,k:'Gennaio',t:'I buoni propositi',x:d=>`Inizia il ${S.anno}. ${({forma:'Le scale di casa sembrano ogni giorno più lunghe.',schermi:'Ultimamente passi ore e ore davanti agli schermi.',soldi:'Il conto in banca è in rosso da un po\'.',studio:'I voti non promettono niente di buono.'})[d.m]||''} Quale proposito fai per quest'anno?`.replace('  ',' '),c:[
  {l:'Più sport',sub:'+3 ore a settimana',fx:()=>{const x=aggiungiOre('sport',3);S.proposito={id:'sport',d:x,n:'più sport',anno:S.anno};return [x?varia('pSport',['Scarpe nuove e grandi intenzioni.','Ti iscrivi a un corso di nuoto. Sul serio, stavolta.','Prima corsetta del 2: dopo un chilometro rimpiangi tutto.','Scarichi un\'app di allenamento con un istruttore che urla.']).replace('del 2','dell\'anno'):'Non hai ore libere: ci penserai.','']}},
  {l:'Meno telefono e serie TV',sub:'−4 ore di schermi',fx:()=>{const x=Math.min(4,S.routine.schermi||0);S.routine.schermi=(S.routine.schermi||0)-x;S.proposito={id:'schermi',d:-x,n:'meno schermi',anno:S.anno};return [varia('pSch',['Disinstalli due app. Per ora.','Metti il telefono in un\'altra stanza la sera.','Imposti un limite di tempo sulle app. Lo ignori dopo due giorni.','Riscopri i giochi da tavolo.']),'']}},
  {l:'Studiare o leggere di più',sub:'+3 ore di studio',fx:()=>{const x=aggiungiOre('studio',3);S.proposito={id:'studio',d:x,n:'studiare di più',anno:S.anno};return [varia('pStu',['Una pila di libri sul comodino.','Ti iscrivi in biblioteca, dopo anni.','Un quaderno nuovo per gli appunti. Bellissimo, per ora vuoto.','Ti dai l\'obiettivo di un libro al mese.']),'']}},
  {l:'Risparmiare',sub:'−2 ore di uscite',cond:()=>S.eta>=16,fx:()=>{const x=Math.min(2,S.routine.uscite||0);S.routine.uscite=(S.routine.uscite||0)-x;S.proposito={id:'uscite',d:-x,n:'risparmiare',anno:S.anno};return [varia('pRis',['Apri un foglio Excel con le spese. Lo guardi con orgoglio.','Un salvadanaio a forma di maiale, come da bambino.','Cancelli due abbonamenti che non usavi.','Decidi di cucinare a casa invece di ordinare.']),'']}},
  {l:'Nessun proposito',sub:'Tanto non li mantieni mai',fx:()=>{S.proposito=null;return ['Almeno sei onest'+g('o','a')+'.','']}}]});
ev({id:'ferie',link:1,k:'Agosto',t:'Le ferie d\'agosto',x:()=>{const pa=partnerAttuale();return `Agosto: la città si svuota.${pa?` ${pa.nome} aspetta di sapere dove andate.`:''} Che fai?`},c:()=>[
  {l:'Al mare',sub:()=>`Una settimana in Puglia · ${eur(costoFerie('mare'))}`,costo:()=>costoFerie('mare'),fx:()=>ferie(8,15,varia('mare',TESTI.mare),'mare')},
  {l:'In montagna',sub:()=>`Sentieri e rifugi in Trentino · ${eur(costoFerie('monti'))}`,costo:()=>costoFerie('monti'),fx:()=>{S.bis.forma=clamp(S.bis.forma+4);return ferie(7,18,varia('monti',TESTI.monti),'monti')}},
  {l:'Viaggio all\'estero',sub:()=>`Due settimane in un posto nuovo · ${eur(costoFerie('estero'))}`,costo:()=>costoFerie('estero'),fx:()=>{segnaVita('viaggio');S.abil.lingue=clamp(S.abil.lingue+2);return ferie(10+pz('O')*4,14,varia('estero',TESTI.estero),'estero')}},
  {l:'Resta a casa a riposare',sub:'Gratis',fx:()=>ferie(3+(pz('E')<0?3:0),10,varia('casaF',TESTI.casa),'casa')},
  {l:'Lavora anche ad agosto',sub:'Più soldi, niente riposo',cond:()=>!!S.lavoro,fx:()=>{S.fatti.ferieAbit='lavoro';const x=P(r(400,900));soldi(x);S.bis.stress=clamp(S.bis.stress+6);if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+4);return [`Ufficio deserto e aria condizionata. Guadagni ${eur(x)} in più.`,'']}}]});
/* id: l'abitudine che resta per gli anni seguenti (riassuntoFerie in d8_ritmo.js) */
function ferie(f,st,t,id){if(id)S.fatti.ferieAbit=id;mod('felicita',Math.round(f));S.bis.stress=clamp(S.bis.stress-st);S.bis.energia=clamp(S.bis.energia+15);const pa=partnerAttuale();if(pa){pa.intim=clamp((pa.intim||50)+4);pa.pass=clamp((pa.pass||50)+6)}return [t,'g']}
ev({id:'compleanno_tondo',link:1,k:'Compleanno',t:'Un compleanno importante',x:()=>`Compi ${S.eta} anni. Come festeggi?`,c:[
  {l:'Una grande festa con tutti',sub:()=>eur(P(400)),costo:()=>P(400),fx:()=>{relGruppo(vivi(['Amico']).slice(0,6),3,7);S.bis.soc=clamp(S.bis.soc+15);mod('felicita',6+pz('E')*4);return ['Musica, torta enorme e un discorso imbarazzante di un amico.','g']}},
  {l:'Cena con pochi intimi',sub:()=>eur(P(120)),costo:()=>P(120),fx:()=>{mod('felicita',5);relGruppo(famIn().slice(0,3),2,4);return ['Poche persone, quelle giuste.','g']}},
  {l:'Nessuna festa, giornata come le altre',fx:()=>{mod('felicita',pz('E')<-.2?3:-2);return ['Spegni il telefono. Gli auguri li leggi domani.','']}}]});
ev({id:'compleanno_npc',link:1,k:'Compleanno',t:'Il compleanno di {P}',x:d=>`${d.p.nome} compie ${d.p.eta} anni.`,c:[
  {l:'Organizza una festa a sorpresa',sub:()=>eur(P(150)),costo:()=>P(150),cond:()=>S.eta>=14,fx:d=>{const ok=chance(.75+ppz(d.p,'E')*.2);d.p.rapporto=clamp(d.p.rapporto+(ok?r(8,14):-3));ricorda(d.p,ok?'Gli hai fatto una festa a sorpresa':'La festa a sorpresa non è piaciuta');return ok?[`${d.p.nome} si commuove. Serata indimenticabile.`,'g']:[`${d.p.nome} odia le sorprese, e si vede.`,'b']}},
  {l:'Un regalo pensato',sub:()=>eur(P(60)),costo:()=>P(60),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+r(4,9));return [varia('regalo',TESTI.regalo),'g']}},
  {l:'Un messaggio di auguri',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+1);return [varia('msg',TESTI.messaggio),'']}},
  {l:'Te ne dimentichi',fx:d=>{d.p.rapporto=clamp(d.p.rapporto-r(4,9));ricorda(d.p,'Ti sei dimenticat'+g('o','a')+' del suo compleanno');return [`${d.p.nome} ci rimane male, e te lo fa notare.`,'b']}}]});

/* ---------- La coppia ---------- */
ev({id:'lite_coppia',link:1,k:'Coppia',t:'Litigio con {P}',x:d=>{
  const m=S.soldi<0?'i soldi':S.att==='ansioso'?'la gelosia':S.bis.stress>65?'lo stress che ti porti a casa':(d.p.oreMese||0)<4?'il poco tempo insieme':pick(['le faccende di casa','le vacanze','i parenti','come spendere i soldi']);
  d.x=m;return `Discussione accesa con ${d.p.nome}. Il motivo, stavolta: ${m}.`},c:[
  {l:'Chiarisci con calma',sub:'Ascolta, poi spiega',fx:d=>{const ok=chance(.55+pz('A')*.2+ppz(d.p,'A')*.2);d.p.intim=clamp(d.p.intim+(ok?5:-2));S.tensione=(S.tensione||0)+(ok?0:4);return ok?['Parlate fino a tardi. Ne uscite più vicini.','g']:['Ci provi, ma restate sulle vostre posizioni.','']}},
  {l:'Tieni il punto',sub:'Hai ragione tu',fx:d=>{d.p.intim=clamp(d.p.intim-6);d.p.imp=clamp(d.p.imp-3);S.tensione=(S.tensione||0)+6;ricorda(d.p,`Avete litigato per ${d.x}`);return ['Nessuno cede. Due giorni di silenzio in casa.','b']}},
  {l:'Chiedi scusa per primo',fx:d=>{d.p.intim=clamp(d.p.intim+3);d.p.imp=clamp(d.p.imp+2);return [`${d.p.nome} ti abbraccia. Lite finita.`,'g']}},
  {l:'Esci di casa sbattendo la porta',fx:d=>{d.p.pass=clamp(d.p.pass-4);d.p.imp=clamp(d.p.imp-6);S.tensione=(S.tensione||0)+5;return ['Fai un giro di due ore. Al ritorno l\'aria è gelida.','b']}}]});
ev({id:'trascurato',link:1,k:'Coppia',t:'{P} si sente trascurat{po}',x:d=>`«Non ci vediamo mai», ti dice ${d.p.nome}. Ultimamente passate pochissimo tempo insieme.`,c:[
  {l:'Prometti più tempo insieme',sub:'+4 ore a settimana con il partner',fx:d=>{const x=aggiungiOre('partner',4);d.p.intim=clamp(d.p.intim+(x?4:-2));return x?['Segnate in agenda una sera a settimana tutta vostra.','g']:['Lo prometti, ma la settimana è già piena.','b']}},
  {l:'Organizza un weekend romantico',sub:()=>eur(P(350)),costo:()=>P(350),fx:d=>{d.p.pass=clamp(d.p.pass+10);d.p.intim=clamp(d.p.intim+5);return ['Due giorni sul lago, solo voi due.','g']}},
  {l:'Spiega che è un periodo pieno',fx:d=>{const ok=chance(.4+ppz(d.p,'A')*.3);d.p.intim=clamp(d.p.intim+(ok?1:-4));return ok?[`${d.p.nome} capisce. Per ora.`,'']:[`${d.p.nome} non sembra convint${gp(d.p,'o','a')}.`,'b']}},
  {l:'Ignora la lamentela',fx:d=>{d.p.imp=clamp(d.p.imp-6);d.p.intim=clamp(d.p.intim-5);ricorda(d.p,'Si è sentit'+gp(d.p,'o','a')+' trascurat'+gp(d.p,'o','a'));return ['Cambi discorso. Non funziona.','b']}}]});
ev({id:'proposta_conv',link:1,k:'Coppia',t:'Andiamo a vivere insieme?',x:d=>`${d.p.nome} ti propone di andare a vivere insieme.`,c:[
  {l:'Sì, cerchiamo casa',fx:d=>{convivi(d.p);d.p.imp=clamp(d.p.imp+12);d.p.rapporto=clamp(d.p.rapporto+5);mod('felicita',6);return [`Tu e ${d.p.nome} andate a vivere insieme!`,'g']}},
  {l:'Aspettiamo ancora un po\'',fx:d=>{d.p.imp=clamp(d.p.imp-4);return [`${d.p.nome} dice che va bene, ma ci resta male.`,'']}},
  {l:'Non me la sento',sub:'Ho bisogno dei miei spazi',fx:d=>{d.p.imp=clamp(d.p.imp-10);d.p.intim=clamp(d.p.intim-5);ricorda(d.p,'Hai detto di no alla convivenza');return ['Il silenzio in macchina dice tutto.','b']}}]});
ev({id:'proposta_nozze',link:1,k:'Coppia',cond:()=>!inSeparazione(),t:'Una proposta',x:d=>`Durante una cena, ${d.p.nome} tira fuori un anello. «Mi vuoi sposare?»`,c:[
  {l:'Sì!',fx:d=>{coda.unshift({e:EV.matrimonio,d:{p:d.p}});return null}},
  {l:'Ho bisogno di tempo',fx:d=>{d.p.imp=clamp(d.p.imp-8);d.p.intim=clamp(d.p.intim-4);return [`${d.p.nome} rimette l'anello in tasca.`,'b']}},
  {l:'No',fx:d=>{d.p.imp=clamp(d.p.imp-25);d.p.intim=clamp(d.p.intim-15);ricorda(d.p,'Hai rifiutato la sua proposta');mod('felicita',-5);return ['Un momento terribile per entrambi.','b']}}]});

/* ---------- Richieste delle persone ---------- */
ev({id:'r_malato',link:1,k:'Famiglia e amici',t:'{P} sta male',x:d=>`${d.p.nome} è malat${gp(d.p,'o','a')}: ${String(d.p.malattia||'una brutta malattia').toLowerCase()}.`,c:[
  {l:'Vai a trovar{lo} ogni settimana',pers:{A:2},sub:'Ti costa tempo ed energie',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+r(8,14));d.p.umore=clamp(d.p.umore+15);S.bis.energia=clamp(S.bis.energia-10);S.karma=clamp(S.karma+3);ricorda(d.p,'Sei stat'+g('o','a')+' vicin'+g('o','a')+' quando stava male');return [`${d.p.nome} non dimenticherà che c'eri.`,'g']}},
  {l:'Una telefonata ogni tanto',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+2);return ['Ti tieni aggiornat'+g('o','a')+' dai parenti.','']}},
  {l:'Non riesci a veder{lo} così',pers:{A:-1,N:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-6);ricorda(d.p,'Non sei andat'+g('o','a')+' a trovarl'+gp(d.p,'o','a'));return ['Rimandi la visita, una settimana dopo l\'altra.','b']}}]});
ev({id:'r_assistenza',link:1,k:'Famiglia',t:'{P} non è più autosufficiente',x:d=>`${d.p.nome} ha ${d.p.eta} anni e non riesce più a vivere da sol${gp(d.p,'o','a')}. Bisogna decidere.`,c:[
  {l:'Te ne occupi tu',pers:{A:3,C:1},sub:'12 ore a settimana del tuo tempo',fx:d=>{S.fatti.assisti=d.p.id;d.p.rapporto=clamp(d.p.rapporto+12);S.karma=clamp(S.karma+5);normalizzaRoutine();return ['Spesa, medicine, visite. Il tuo tempo libero si accorcia, ma lo fai volentieri.','g']}},
  {l:'Assumi una badante',sub:d=>{const c=costoAssistenza(d.p,'badante');return `Circa ${eur(c.tot/12)} al mese con contratto e contributi: ${eur(c.copre/12)} li coprono pensione e indennità di accompagnamento, a te ne restano ${eur(c.resta/12)}`},fx:d=>{S.fatti.badante=d.p.id;return ['Arriva Oksana: è bravissima, e cucina meglio di tutti.','']}},
  {l:'Una RSA',pers:{C:1},sub:d=>{const c=costoAssistenza(d.p,'rsa');return `Retta di circa ${eur(c.tot/12)} al mese: ${eur(c.copre/12)} li coprono pensione e accompagnamento, a te ne restano ${eur(c.resta/12)}`},fx:d=>{S.fatti.rsa=d.p.id;d.p.rapporto=clamp(d.p.rapporto-8);ricorda(d.p,'L\'hai portat'+gp(d.p,'o','a')+' in una RSA');mod('felicita',-4);return ['La struttura è pulita e gentile. Ma i sensi di colpa restano.','']}},
  {l:'Se ne occupino i tuoi fratelli',pers:{A:-2},cond:()=>vivi(['Fratello']).length>0,fx:d=>{vivi(['Fratello']).forEach(f=>{f.rapporto=clamp(f.rapporto-10);ricorda(f,'Hai lasciato a loro il genitore da assistere')});return ['I tuoi fratelli accettano, ma te lo rinfacceranno a ogni Natale.','b']}}]});
ev({id:'r_lavoro_perso',link:1,k:'Amici e famiglia',t:'{P} ha perso il lavoro',x:d=>`${d.p.nome} ti chiama: ha perso il lavoro ed è a pezzi.`,c:[
  {l:'Ascolta{lo} e consola{lo}',pers:{A:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6);d.p.umore=clamp(d.p.umore+10);return ['Parlate per un\'ora. Si sente meno sol'+gp(d.p,'o','a')+'.','g']}},
  {l:'Aiuta{lo} a cercare un nuovo lavoro',pers:{A:2,C:1},sub:'Ci vuole tempo',fx:d=>{S.bis.energia=clamp(S.bis.energia-8);d.p.rapporto=clamp(d.p.rapporto+8);if(chance(.4)){d.p.stato='lavora';d.p.lavoro=lavoroPerNpc(d.p);ricorda(d.p,'Gli hai trovato lavoro'.replace('Gli',gp(d.p,'Gli','Le')));return [`Grazie a un tuo contatto, ${d.p.nome} trova un posto come ${lavoroNpc(d.p)}!`,'g']}return ['Mandate venti curriculum insieme. Ora si aspetta.','']}},
  {l:'Dì che hai da fare',pers:{A:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-5);return ['Chiudi la chiamata in fretta.','b']}}]});
ev({id:'r_prestito',link:1,k:'Soldi',t:'{P} ti chiede un prestito',x:d=>{d.x=d.x||P(r(5,30)*100);return `${d.p.nome} è in difficoltà e ti chiede ${eur(d.x)}. «Te li ridò appena posso, giuro.»`},c:[
  {l:'Presta i soldi',pers:{A:2,C:-1},fx:d=>{if(S.soldi<d.x)return ['Non hai abbastanza soldi.','x'];soldi(-d.x);d.p.prestito=(d.p.prestito||0)+d.x;d.p.rapporto=clamp(d.p.rapporto+8);ricorda(d.p,`Gli hai prestato ${eur(d.x)}`.replace('Gli',gp(d.p,'Gli','Le')));return [`Presti ${eur(d.x)} a ${d.p.nome}. Chissà se li rivedrai.`,'']}},
  {l:'Presta la metà',fx:d=>{const x=Math.round(d.x/2);if(S.soldi<x)return ['Non hai abbastanza soldi.','x'];soldi(-x);d.p.prestito=(d.p.prestito||0)+x;d.p.rapporto=clamp(d.p.rapporto+3);return [`Gli dai ${eur(x)}: più di così non puoi.`.replace('Gli',gp(d.p,'Gli','Le')),'']}},
  {l:'Rifiuta con gentilezza',pers:{A:-1,C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-(ppz(d.p,'A')<0?12:5));ricorda(d.p,'Non gli hai prestato i soldi'.replace('gli',gp(d.p,'gli','le')));return [ppz(d.p,'A')<0?`${d.p.nome} se la lega al dito.`:`${d.p.nome} dice che capisce.`,'b']}}]});
ev({id:'r_matrimonio',link:1,k:'Inviti',t:'{P} si sposa!',x:d=>`${d.p.nome} ${coppiaStessoSesso(d.p)?'celebra l\'unione civile con':'si sposa con'} ${d.p.pNome||'la persona che ama'} e ti invita alla festa.`,c:[
  {l:'Vai e fai un bel regalo',sub:()=>eur(P(250)),costo:()=>P(250),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);S.bis.soc=clamp(S.bis.soc+10);mod('felicita',4);if(single()&&S.eta>=18&&chance(.3)){coda.unshift({e:EV.incontro,d:{x:'matrimonio'}})}return ['Commozione, balli e confetti.','g']}},
  {l:'Vai con un regalo modesto',sub:()=>eur(P(80)),costo:()=>P(80),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3);mod('felicita',2);return ['Una bella festa. Il risotto era freddo.','g']}},
  {l:'Inventa una scusa e non vai',pers:{E:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-10);ricorda(d.p,'Non sei venut'+g('o','a')+' al suo matrimonio');return ['Ti perdi la festa, e qualcosa di più.','b']}}]});
ev({id:'r_separazione',link:1,k:'Amici e famiglia',t:'{P} si è lasciat{po}',x:d=>`${d.p.nome} si è appena lasciat${gp(d.p,'o','a')} e sta malissimo.`,c:[
  {l:'Passa la serata con {lui}',pers:{A:1,E:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);d.p.umore=clamp(d.p.umore+12);S.bis.energia=clamp(S.bis.energia-6);return ['Gelato, film tristi e tante parole.','g']}},
  {l:'Ospita{lo} da te per qualche settimana',pers:{A:3},cond:()=>!['genitori','carcere','figlio'].includes(S.casa.tipo),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+14);ricorda(d.p,'L\'hai ospitat'+gp(d.p,'o','a')+' quando si è lasciat'+gp(d.p,'o','a'));S.tensione=(S.tensione||0)+3;const pa=partnerAttuale();if(pa&&pa.conv)pa.intim=clamp(pa.intim-4);return ['Il divano diventa il suo letto per un mese. Ti sarà grat'+gp(d.p,'o','a')+' per sempre.','g']}},
  {l:'Un messaggio di conforto',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+1);return ['«Se ti serve qualcosa, ci sono.»','']}}]});
ev({id:'r_trasloco',link:1,k:'Amici e famiglia',t:'{P} se ne va',x:d=>`${d.p.nome} ti annuncia che si trasferisce a ${d.p.dove||'un\'altra città'} per lavoro.`,c:[
  {l:'Organizza una cena d\'addio',pers:{E:1},sub:()=>eur(P(60)),costo:()=>P(60),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);return [`Brindisi, abbracci e promesse di ${S.anno>=2010?'videochiamate':S.anno>=1995?'telefonate':'lettere'}.`,'g']}},
  {l:'Prometti di andar{lo} a trovare',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3);d.p.promessa=S.t;return ['Lo segni in agenda. A matita.','']}},
  {l:'Ci rimani male e non dici niente',pers:{N:1,E:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-4);mod('felicita',-3);return ['Il saluto è più freddo di quanto vorresti.','b']}}]});
ev({id:'r_sfogo',link:1,k:'Amici e famiglia',t:'{P} ha bisogno di parlare',x:d=>`${d.p.nome} ti scrive alle undici di sera: «Sei sveglio? Ho bisogno di parlare.»`.replace('sveglio',g('sveglio','sveglia')),c:[
  {l:'Chiama{lo} subito',pers:{A:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+7);d.p.umore=clamp(d.p.umore+12);S.bis.energia=clamp(S.bis.energia-5);ricorda(d.p,'L\'hai ascoltat'+gp(d.p,'o','a')+' in un momento difficile');return ['Parlate fino all\'una. Domani sarai a pezzi, ma ne valeva la pena.','g']}},
  {l:'Rispondi che ne parlate domani',fx:d=>{d.p.rapporto=clamp(d.p.rapporto-1);return ['Il giorno dopo vi vedete per un caffè.','']}},
  {l:'Fai finta di dormire',pers:{A:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-6);return ['Spegni il telefono. Un po\' di senso di colpa.','b']}}]});
ev({id:'r_lite',link:1,k:'Amici e famiglia',t:'Scintille con {P}',x:d=>`Un commento di ${d.p.nome} ti fa saltare i nervi. ${ppz(d.p,'A')<0?gp(d.p,'È uno','È una')+' che non le manda a dire.':''}`,c:[
  {l:'Lascia correre',pers:{A:1,N:-1},fx:d=>{return ['Respiri e cambi argomento.','']}},
  {l:'Chiarisci subito, con calma',pers:{N:-1},fx:d=>{const ok=chance(.6+pz('A')*.15);d.p.rapporto=clamp(d.p.rapporto+(ok?4:-3));return ok?['Vi chiarite. Meglio così.','g']:['Non vi capite. Resta un po\' di freddo.','']}},
  {l:'Rispondi male',pers:{A:-2,N:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-r(10,18));ricorda(d.p,'Avete litigato pesantemente');if(d.p.rapporto<12&&chance(.4)){creaNemico('lite',d.p);return [`La lite degenera: ${d.p.nome} ora ce l'ha a morte con te.`,'b']}return ['Volano parole grosse.','b']}}]});
ev({id:'r_invito',link:1,k:'Amici',t:'{P} ti invita',x:d=>{d.x=d.x||pick(['a un concerto','a una cena da lui con altri amici','a un weekend in campeggio','a una partita allo stadio','a una mostra']);return `${d.p.nome} ti invita ${d.x.replace('lui',gp(d.p,'lui','lei'))}.`},c:[
  {l:'Accetta',pers:{E:1},sub:()=>eur(P(50)),costo:()=>P(50),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6);S.bis.soc=clamp(S.bis.soc+10);S.bis.energia=clamp(S.bis.energia-6*(1-pz('E')));mod('felicita',3+pz('E')*2);if(chance(.25)){const c=candidato();const n=nuovoConoscente(c,'tramite '+d.p.nome);return [`${varia('serata',TESTI.serata)} Conosci anche ${n.nome}.`,'g']}return [varia('serata',TESTI.serata),'g']}},
  {l:'Declina: preferisci restare a casa',pers:{E:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-2);S.bis.energia=clamp(S.bis.energia+4);return ['Divano e coperta. Nessun rimpianto.','']}}]});
ev({id:'r_sparito',link:1,k:'Amici',t:'Che fine hai fatto?',x:d=>`${d.p.nome} ti scrive: «Ehi, è una vita che non ci vediamo! Sei sparit${g('o','a')}.»`,c:[
  {l:'Fissa subito una cena',pers:{E:1},sub:()=>eur(P(35)),costo:()=>P(35),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+10);d.p.ultimo=S.t;return ['Come se non fosse passato un giorno.','g']}},
  {l:'Rispondi «Ci sentiamo presto!»',fx:d=>{d.p.rapporto=clamp(d.p.rapporto-2);return ['Presto quando, non si sa.','']}},
  {l:'Ignora il messaggio',fx:d=>{d.p.rapporto=clamp(d.p.rapporto-10);return ['La spunta blu resta lì.','b']}}]});

/* ---------- Incontri ---------- */
function candidatoAmico(){const c=candidato();const s=sessoAmico();if(s!==c.sesso){c.sesso=s;c.nome=nomeLibero(s,S.anno-c.eta)}return c}
function candidatoEta(){return Math.max(S.eta<18?Math.max(6,S.eta-2):18,S.eta+r(-5,5))}
ev({id:'incontro_amico',link:1,k:'Persone nuove',t:'Una persona nuova',x:d=>{const c=d.cand||(d.cand=Object.assign(candidatoAmico(),{eta:candidatoEta()}));d.af=affinita(c);
  return `${cap(doveTesto(d.x))} conosci ${c.nome}, ${c.eta} anni. Sembra ${descrPers(c.pers,c.sesso)}.${d.af>=62?' Vi trovate subito.':d.af<45?' Non siete molto simili.':''}`},c:[
  {l:'Fai amicizia',sub:'Proponi di rivedervi',fx:d=>{const c=d.cand;if(chance(.35+d.af/150+pz('E')*.12)){const p=nuovaPersona('Amico',c.sesso,c.eta,c.cognome,{nome:c.nome,pers:c.pers,tr:c.tr,rapporto:r(42,58),dove:d.x});S.bis.soc=clamp(S.bis.soc+5);return [`Tu e ${p.nome} diventate amici.`,'g']}const n=nuovoConoscente(c,d.x);return [`Vi scambiate il numero, ma per ora ${n.nome} resta un conoscente.`,'']}},
  {l:()=>S.eta<12?'Le vostre mamme si scambiano il numero':S.eta<14?'Vi date appuntamento al parco':'Scambiate il numero',fx:d=>{const n=nuovoConoscente(d.cand,d.x);return [`${n.nome} entra tra i tuoi conoscenti.`,'']}},
  {l:'Saluta e basta',fx:()=>['Vi salutate. Ognuno per la sua strada.','']}]});
ev({id:'incontro_rom',link:1,k:'Persone nuove',t:'Scatta qualcosa',x:d=>{
  const c=d.cand||(d.cand=candidato());d.af=affinita(c);
  return `${cap(doveTesto(d.x))} incontri ${c.nome}, ${c.eta} anni: ${descrPers(c.pers,c.sesso)}. Vi guardate più del normale.${d.af>=62?' Sembrate fatti per capirvi.':''}`},c:[
  {l:'Chiedi di uscire',fx:d=>appuntamento(d.cand,(d.af-50)/250+({uscite:.04,hobby:.08,volont:.08,lavoro:-.03}[d.x]||0))},
  {l:'Aspetta che si faccia avanti',fx:d=>{if(chance(.2+(d.af-50)/200+(d.cand.pers.E-50)/250))return appuntamento(d.cand,.1);const n=nuovoConoscente(d.cand,d.x);return [`Non succede niente. ${n.nome} resta tra i tuoi conoscenti.`,'']}},
  {l:'Lascia perdere',fx:()=>['Meglio di no. Per ora.','']}]});

/* ---------- Eventi che nascono dallo stato ---------- */
ev({id:'burnout',link:1,k:'Salute',t:'Non ce la fai più',x:'Da mesi sei sotto pressione. Ti svegli già stanc{o}, ti dimentichi le cose, ti tremano le mani. Il medico parla di burnout.',c:[
  {l:'Un mese di malattia',sub:'Stacchi davvero',fx:()=>{S.bis.stress=clamp(S.bis.stress-35);S.bis.energia=clamp(S.bis.energia+25);if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-8);return ['Un mese di silenzio, passeggiate e sonno. Ti riprendi piano piano.','g']}},
  {l:'Riduci gli impegni',sub:'Niente lavoro extra, meno studio',fx:()=>{S.routine.extra=0;S.routine.studio=Math.min(S.routine.studio||0,3);S.bis.stress=clamp(S.bis.stress-15);return ['Tagli tutto il superfluo. Si respira meglio.','g']}},
  {l:'Inizia una terapia',sub:()=>eur(P(900)),costo:()=>P(900),fx:()=>{S.bis.stress=clamp(S.bis.stress-25);segnaVita('terapia');return ['Impari a riconoscere i segnali e a dire qualche no.','g']}},
  {l:'Stringi i denti',fx:()=>{mod('salute',-8);mod('felicita',-8);segnaVita('burnout');return ['Vai avanti come se niente fosse. Il corpo presenta il conto.','b']}}]});
ev({id:'solitudine',link:1,k:'Socialità',t:'Ti senti sol{o}',x:()=>`Da mesi passi pochissimo tempo con gli altri. ${pz('E')>0?'Per te, che hai bisogno della gente, è dura.':'Anche per te, che stai bene da sol'+g('o','a')+', comincia a essere troppo.'}`,c:[
  {l:'Chiama una persona cara',fx:()=>{const p=[...S.relazioni].filter(x=>x.vivo&&!['Nemico','Ex','Conoscente'].includes(x.ruolo)).sort((a,b)=>b.rapporto-a.rapporto)[0];if(!p)return ['Scorri la rubrica. Non sai chi chiamare.','b'];p.rapporto=clamp(p.rapporto+8);p.ultimo=S.t;S.bis.soc=clamp(S.bis.soc+15);return [`Chiami ${p.nome}. Vi vedete il giorno dopo.`,'g']}},
  {l:'Iscriviti a un gruppo',sub:'+3 ore di volontariato a settimana',cond:()=>S.eta>=14,fx:()=>{aggiungiOre('volont',3);const c=candidato();c.eta=candidatoEta();const n=nuovoConoscente(c,'volont');return [`Ti iscrivi a un'associazione. Il primo giorno conosci ${n.nome}.`,'g']}},
  {l:'Va bene così',fx:()=>{segnaVita('solitudine');mod('felicita',-4);return ['Ti dici che va bene così.','b']}}]});
ev({id:'conto_rosso',link:1,k:'Soldi',t:'Il conto è in rosso',x:()=>`Da tre mesi spendi più di quanto guadagni. Il conto segna ${eur(S.soldi)}.`,c:[
  {l:'Taglia uscite e svago',fx:()=>{S.routine.uscite=0;S.routine.amici=Math.min(S.routine.amici||0,3);mod('felicita',-3);return ['Niente aperitivi per un po\'. Il conto ringrazia.','']}},
  {l:'Fai ore extra',sub:'+6 ore di lavoro extra a settimana',cond:()=>S.eta>=16,fx:()=>{const x=aggiungiOre('extra',6);return [x?'Più lavoro, meno tempo libero.':'Non hai ore libere da dedicare al lavoro extra.','']}},
  {l:'Chiedi aiuto ai genitori',cond:()=>genitoriVivi(),fx:()=>{const g0=pick(vivi(['Madre','Padre']));if(chance(.3+g0.rapporto/200)&&S.classe!=='umile'){const x=P(r(5,20)*100);soldi(x);g0.rapporto=clamp(g0.rapporto-3);return [`${g0.nome} ti fa un bonifico di ${eur(x)}. Con la predica inclusa.`,'']}g0.rapporto=clamp(g0.rapporto-5);return [`${g0.nome} dice che è ora che impari a gestirti.`,'b']}},
  {l:'Fai finta di niente',fx:()=>{S.tensione=(S.tensione||0)+5;return [S.anno>=2010?'Non apri l\'app della banca.':'Non apri gli estratti conto che arrivano per posta.','b']}}]});
ev({id:'medico_forma',link:1,k:'Salute',t:'Il medico è chiaro',x:'Alla visita il medico ti misura la pressione e scuote la testa: «Lei si muove troppo poco.»',c:[
  {l:'Cammina mezz\'ora al giorno',sub:'+3 ore di sport',fx:()=>{const x=aggiungiOre('sport',3);return [x?`Scarpe comode e ${S.anno>=2015?'podcast':'musica'} nelle orecchie.`:'Non trovi il tempo. Per ora.','']}},
  {l:'Iscriviti in palestra',sub:'+5 ore di sport',fx:()=>{const x=aggiungiOre('sport',5);return [x?'Abbonamento annuale. Stavolta ci vai davvero.':'La settimana è piena: niente palestra.','']}},
  {l:'Annuisci e non cambi niente',fx:()=>{mod('salute',-2);return ['«Sì sì, dottore.»','']}}]});
ev({id:'console',link:1,k:'Famiglia',t:'Niente console',x:'I tuoi genitori hanno visto la pagella: troppe ore davanti allo schermo. Vogliono toglierti la console.',c:[
  {l:'Accetta',sub:'Gli schermi scendono a 4 ore',fx:()=>{S.routine.schermi=Math.min(S.routine.schermi||0,4);relGenitori(4);return ['Torna fuori la bicicletta.','']}},
  {l:'Proponi un patto',sub:'Prima i compiti, poi i giochi',fx:()=>{if(chance(.6)){S.routine.schermi=Math.min(S.routine.schermi||0,8);aggiungiOre('studio',2);relGenitori(3);return ['Patto accettato. Firmato su un foglio a quadretti.','g']}S.routine.schermi=0;return ['Non ci cascano: console in cantina.','b']}},
  {l:'Protesta e sbatti la porta',fx:()=>{S.routine.schermi=0;relGenitori(-8);return ['Console sequestrata per un mese.','b']}}]});
ev({id:'lavoro_pesa',link:1,k:'Lavoro',t:'Il lavoro ti pesa',x:()=>`Fai ${S.lavoro.nome.toLowerCase()}, ma non è il lavoro per te. Ogni lunedì mattina è più difficile. ${'Il tuo profilo di interessi è '+codiceRiasec()+': '+interessi().slice(0,2).map(x=>RIASEC[x[0]].toLowerCase()).join(' e ')+'.'}`,c:[
  {l:'Inizia a guardarti intorno',fx:()=>{S.fatti.cercaAltro=S.t;return ['Aggiorni il curriculum. Le offerte sono nella scheda Lavoro.','']}},
  {l:'Parla con il capo',fx:()=>{const L=S.lavoro,c=squadra().capo,n=c?c.nome:'Il capo';if(chance(.4+pz('E')*.15+capoEsito()*.1)){L.perf=clamp(L.perf+5);if(c)relD(c,3);return [`${n} ti affida compiti più adatti a te.`,'g']}if(c)relD(c,-1);return ['«Qui facciamo tutti un po\' di tutto.»','b']}},
  {l:'Pensi di cambiare strada',sub:'Un corso di riqualificazione e un altro settore',cond:()=>settoriPossibili().length>0,pers:{O:2},fx:()=>{coda.unshift({e:EV.car_settore,d:{}});return null}},
  {l:'Pensi di metterti in proprio',cond:()=>proprioPossibile(),pers:{E:2},fx:()=>{coda.unshift({e:EV.car_proprio,d:{x:{}}});return null}},
  {l:'Tieni duro',fx:()=>{S.tensione=(S.tensione||0)+4;return ['Lo stipendio arriva il 27. Si va avanti.','']}}]});
ev({id:'capo_progetto',link:1,k:'Lavoro',t:'Un progetto importante',x:'Il capo ti chiama in ufficio: vuole affidarti un progetto delicato. Se va bene, si parla di promozione.',c:[
  {l:'Accetta',sub:'Tre mesi intensi',fx:()=>{const L=S.lavoro;S.bis.stress=clamp(S.bis.stress+12);if(chance(.45+pz('C')*.25+S.intelligenza/400)){L.perf=clamp(L.perf+15);L.anniLiv=Math.max(L.anniLiv,2);return ['Il progetto è un successo. Il tuo nome gira ai piani alti.','g']}L.perf=clamp(L.perf-8);return ['Scadenze mancate e una riunione imbarazzante.','b']}},
  {l:'Rifiuta: hai già troppo da fare',fx:()=>{S.lavoro.perf=clamp(S.lavoro.perf-3);return ['Il capo annuisce, ma lo segna da qualche parte.','']}}]});

function emergenti(){
  if(S.carcere>0||S.eta<6)return;
  const B=S.bis,F=S.fatti;
  F.stressAlto=B.stress>=82?(F.stressAlto||0)+1:0;
  F.soloN=B.soc<25&&S.eta>=13?(F.soloN||0)+1:0;
  F.rossoN=S.soldi<0&&(F.ultimoMese||0)<0&&S.eta>=18?(F.rossoN||0)+1:0;
  if(coda.length)return;
  if(F.stressAlto>=3&&(S.lavoro||iscritto())&&S.t-(F.burnT||-99)>=18){F.burnT=S.t;coda.push({e:EV.burnout,d:{}});return}
  if(F.soloN>=4&&S.t-(F.soloT||-99)>=12){F.soloT=S.t;coda.push({e:EV.solitudine,d:{}});return}
  if(F.rossoN>=3&&S.t-(F.rossoT||-99)>=Math.min(48,12*(1+(F.rossoV||0)))){F.rossoT=S.t;F.rossoV=(F.rossoV||0)+1;coda.push({e:EV.conto_rosso,d:{}});return}   // la seconda volta dopo 2 anni, poi 3, poi 4: nel frattempo resta la riga nel bilancio
  if(S.eta>=30&&B.forma<30&&chance(.02)&&S.t-(F.medT||-99)>=24){F.medT=S.t;coda.push({e:EV.medico_forma,d:{}});return}
  if(S.anno>=1985&&S.eta>=9&&S.eta<17&&rOre('schermi')>=14&&iscritto()&&S.scuola.voto<48&&genitoriVivi()&&S.casa.tipo==='genitori'&&chance(.15)&&S.t-(F.consT||-99)>=12){F.consT=S.t;coda.push({e:EV.console,d:{}});return}
  if(S.lavoro&&!JOB[S.lavoro.id].pt&&soddLavoro()<38&&chance(.04)&&S.t-(F.pesaT||-99)>=18){F.pesaT=S.t;coda.push({e:EV.lavoro_pesa,d:{}});return}
  if(S.lavoro&&!JOB[S.lavoro.id].pt&&S.lavoro.perf>=70&&chance(.012+pz('C')*.008)&&S.t-(F.progT||-99)>=24){F.progT=S.t;const sq=squadra();if(sq.capo&&sq.colleghi.length)coda.push({e:EV.prg_avvio,d:{p:sq.capo,x:{q:pick(sq.colleghi).id}}});else coda.push({e:EV.capo_progetto,d:{}});return}
  if(S.sonno<6.5&&B.energia<35&&chance(.15))log('Dormi troppo poco: ti trascini per tutta la giornata.','b');
  incontri();
}

/* ---------- Diagnosi ---------- */
ev({id:'diagnosi',link:1,k:'Salute',t:'La diagnosi',x:d=>{const m=S.malattie.find(z=>z.n===d.x);d.g=m?m.g:2;
  if(m&&m.tum&&m.linee)return `Le cure non sono bastate: ${d.x.toLowerCase()} è ancora lì. I medici propongono una nuova terapia, con meno probabilità di riuscire.`;
  if(m&&m.tum){const t=TUMORE[m.n]||TUMORE.Tumore;return `Gli esami non lasciano dubbi: ${d.x.toLowerCase()}${m.screen?', preso in tempo grazie ai controlli':''}. ${t.sopr>=.8?'Oggi nella maggior parte dei casi se ne guarisce.':t.sopr>=.5?'Le cure funzionano in molti casi.':'È uno dei tumori più difficili da curare.'}`}
  return d.g===4?`Gli esami non lasciano dubbi: ${d.x.toLowerCase()}. È una cosa seria: non si guarisce, ma con le cure si vive meglio e più a lungo.`:d.g===3?`Il medico ti spiega che ${d.x.toLowerCase()} è una condizione cronica: non passa, ma si può tenere sotto controllo.`:`Il medico ti diagnostica: ${d.x.toLowerCase()}. Serve una cura.`},
  c:d=>{const m=()=>S.malattie.find(z=>z.n===d.x);const gr=()=>(m()||{g:2}).g;
   const cura=(p,t1,t2)=>{if(!m())return ['Per fortuna era meno grave del previsto.','g'];if(chance(p)){S.malattie=S.malattie.filter(z=>z.n!==d.x);mod('salute',r(3,8));mod('felicita',6);return [t1,'g']}mod('salute',-r(2,6));return [t2,'b']};
   const tum=()=>{const x=m();return !!(x&&x.tum)};
   return [
    {l:'Inizia le cure con il Servizio sanitario',sub:'Chirurgia e terapie, gratis ma con le attese',cond:tum,_incl:0,fx:()=>{const x=m();if(!x)return ['Per fortuna era meno grave del previsto.','g'];avviaCura(x,false);S.bis.stress=clamp(S.bis.stress+10);return ['Inizi le cure: mesi di ospedale, terapie e attese. Accanto a te chi ti vuole bene.','']}},
    {l:'Curati in una clinica privata',sub:()=>eur(P(9000)),costo:()=>P(9000),cond:tum,_incl:0,fx:()=>{const x=m();if(!x)return ['Per fortuna era meno grave del previsto.','g'];avviaCura(x,true);S.bis.stress=clamp(S.bis.stress+6);return ['Medici bravissimi e tempi più rapidi. Le cure iniziano subito.','']}},
    {l:'Terapia e controlli',sub:'Farmaci e visite regolari',cond:()=>gr()===4&&!tum(),_incl:0,fx:()=>{const x=m();if(x)x.ctrl=1;S.fatti.terapiaCron=true;return ['Non si guarisce, ma con farmaci e controlli si vive meglio e più a lungo.','g']}},
    {l:'Curati con il Servizio sanitario',sub:'Gratis, ma con i tempi della sanità pubblica',cond:()=>gr()===2,fx:()=>{S.bis.stress=clamp(S.bis.stress+8);return cura(gr()===4?.42+S.salute/500:.75,'Mesi di visite, liste d\'attesa e cure. Ma ce l\'hai fatta: sei guarit'+g('o','a')+'.','Le cure non bastano. La malattia resta, e andrà seguita.')}},
    {l:'Vai in una clinica privata',sub:()=>eur(P(gr()===4?9000:2500)),cond:()=>gr()===2,fx:()=>{const c=P(gr()===4?9000:2500);if(S.soldi<c)return [`Servono ${eur(c)}.`,'x'];soldi(-c);return cura(gr()===4?.62+S.salute/500:.92,'Cure rapide e ottimi medici. Guarisci.','Nemmeno la clinica riesce a sconfiggerla del tutto.')}},
    {l:'Inizia una terapia continuativa',sub:'Un controllo e i farmaci ogni mese',cond:()=>gr()===3,fx:()=>{S.fatti.terapiaCron=true;return ['Pastiglie la mattina e controlli regolari. La tieni a bada.','g']}},
    {l:'Rimanda: ora non è il momento',fx:()=>{S.tensione=(S.tensione||0)+5;return ['Ci penserai più avanti. Forse troppo avanti.','b']}}]}});

/* ---------- Aspirazioni ---------- */
function sceltaAspir(primo){
  return Object.entries(ASPIR).filter(([id])=>id!==primo).map(([id,A])=>({l:T(A.n),_incl:Math.max(-1,Math.min(1,A.w()*1.6)),fx:()=>{
    if(!primo){S.aspir=[id];aspAvvia(id);S.fatti.aspEta=S.eta;coda.unshift({e:EV.aspirazioni2,d:{x:id}});return null}
    S.aspir=[primo,id];aspAvvia(primo);aspAvvia(id);return [`Le tue aspirazioni: ${T(ASPIR[primo].n).toLowerCase()} e ${T(A.n).toLowerCase()}. Realizzarle ti renderà più felice; mancarle, col tempo, pesa.`,'g']}}));
}
ev({id:'aspirazioni',link:1,k:'Diventare grandi',t:'Che cosa vuoi dalla vita?',x:'Sei maggiorenne. Tra tutte le cose che una vita può dare, qual è quella che conta di più per te?',c:()=>sceltaAspir(null)});
ev({id:'aspirazioni2',link:1,k:'Diventare grandi',t:'E poi?',x:d=>`Al primo posto: ${T(ASPIR[d.x].n).toLowerCase()}. Che cos'altro desideri?`,c:d=>sceltaAspir(d.x)});

/* ---------- Ripensare i sogni ---------- */
// dai 25 anni, circa ogni 10 (si apre da compleanno() in c_motore.js): al massimo 3 sogni ancora da realizzare
const aspLiberi=()=>Object.keys(ASPIR).filter(id=>!(S.aspir||[]).includes(id)&&!ASPIR[id].ok());
const aspStato=id=>{const A=ASPIR[id];return `${T(A.n).toLowerCase()} (${(S.aspOk||[]).includes(id)?'realizzato':Math.round(aspProg(id)*100)+'%'})`};
ev({id:'asp_ripensa',link:1,k:'Quello che vuoi',t:'Che cosa vuoi, adesso?',x:d=>{
  const anni=S.eta-(d.da||18);
  return `Sono passati ${anni>=8?'una decina d\'anni':anni+' anni'} da quando hai deciso che cosa conta di più. Rileggi i tuoi sogni: ${(S.aspir||[]).map(aspStato).join(', ')}. Sono ancora quelli?`},c:()=>[
  {l:'Aggiungo un nuovo sogno',sub:'Al massimo tre sogni da realizzare insieme',cond:()=>aspAttive().length<3&&aspLiberi().length>0,_incl:0,fx:()=>{coda.unshift({e:EV.asp_nuovo,d:{x:null}});return null}},
  {l:'Ne cambio uno',sub:'Quello che hai fatto resta tuo',cond:()=>aspAttive().length>0&&aspLiberi().length>0,_incl:0,fx:()=>{coda.unshift({e:EV.asp_cambia,d:{}});return null}},
  {l:'Resto sulla mia strada',cond:()=>aspAttive().length>0,_incl:0,pers:{C:1},r:'I sogni sono quelli di sempre. Cambiano i passi, non la direzione.'},
  {l:'Va bene così',cond:()=>aspAttive().length===0,_incl:0,pers:{N:-1},fx:()=>{mod('felicita',2);return ['Hai quello che volevi. Per ora non ti serve altro, e non è poco.','g']}}]});
ev({id:'asp_cambia',link:1,k:'Quello che vuoi',t:'Che cosa lasci andare?',x:'Non si può inseguire tutto. Quale dei sogni ancora aperti lasci andare?',c:()=>aspAttive().map(id=>({l:T(ASPIR[id].n),sub:`${Math.round(aspProg(id)*100)}% della strada`,_incl:0,fx:()=>{coda.unshift({e:EV.asp_nuovo,d:{x:id}});return null}}))
  .concat([{l:'Ci ripenso',_incl:0,r:'Per ora resta tutto com\'è.'}])});
const aspNuovoTesto=(x,id)=>`${x?`Lasci andare ${T(ASPIR[x].n).toLowerCase()}. Da ora`:'Da ora'} vuoi anche questo: ${T(ASPIR[id].n).toLowerCase()}.`;
ev({id:'asp_nuovo',link:1,k:'Quello che vuoi',t:'E adesso?',x:d=>d.x?`Lasci andare ${T(ASPIR[d.x].n).toLowerCase()}. Che cosa desideri, al suo posto?`:'Che cosa desideri, in più?',c:d=>aspLiberi().map(id=>{const A=ASPIR[id];return {l:T(A.n),_incl:Math.max(-1,Math.min(1,A.w()*1.6)),fx:()=>{
  S.aspir=(S.aspir||[]).filter(z=>z!==d.x);if(d.x)S.fatti.aspLasciati=(S.fatti.aspLasciati||0)+1;
  S.aspir.push(id);aspAvvia(id);
  return [aspNuovoTesto(d.x,id),'g']}}}).concat([{l:'Ci ripenso',_incl:0,r:'Per ora resta tutto com\'è.'}])});
