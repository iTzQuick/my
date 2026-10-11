/* ================= NONNI CON LA STORIA DELL'EPOCA (ROADMAP Fase 5.2, ultimo blocco) =================
   Ogni nonno ha una sola storia, scelta alla prima volta che serve (pigra, come la regione) secondo il suo anno di nascita (S.anno − età),
   il sesso e la regione del suo lato di famiglia. Si racconta in `nonno_storie` e `ado_nonno_storia` (d_eventi.js, d5_adolescenza.js)
   e ritorna al suo funerale (`funeraleNonno`, da `mortePersona`).
   p.nasc = anno di nascita, p.reg = regione, p.storia = id. S.fatti.latiNonni = {m, p}: la regione del lato materno e paterno. */

const ZONA_REG={'Abruzzo':'Sud','Basilicata':'Sud','Calabria':'Sud','Campania':'Sud','Emilia-Romagna':'Nord-est','Friuli-Venezia Giulia':'Nord-est','Lazio':'Centro','Liguria':'Nord-ovest','Lombardia':'Nord-ovest','Marche':'Centro','Molise':'Sud','Piemonte':'Nord-ovest','Puglia':'Sud','Sardegna':'Isole','Sicilia':'Isole','Toscana':'Centro','Trentino-Alto Adige/Südtirol':'Nord-est','Umbria':'Centro',"Valle d'Aosta/Vallée d'Aoste":'Nord-ovest','Veneto':'Nord-est'};
const SUD_PESI=[['Campania',3],['Puglia',3],['Sicilia',3],['Calabria',2],['Abruzzo',1],['Basilicata',1],['Sardegna',1],['Molise',.5]];
const sudReg=reg=>{const z=ZONA_REG[reg];return z==='Sud'||z==='Isole'};
const nordReg=reg=>{const z=ZONA_REG[reg];return z==='Nord-ovest'||z==='Nord-est'};

const regGiocatore=()=>cittaInfo(S.fatti.cittaNascita||S.citta,S.fatti.provNascita||S.prov).reg;
/* nonni nati nello stesso lato: i primi due creati (madre) sono il lato materno, i due successivi (padre) il paterno; il nonno paterno ha il tuo cognome.
   Senza di lui non si distinguono i lati: tutti dalla stessa regione. */
function latoNonno(p){
  const nn=S.relazioni.filter(x=>x.ruolo==='Nonno'),pm=nn.find(x=>x.sesso==='M'&&x.cognome===S.cognome);
  return pm&&p.id>=pm.id?'p':'m';
}
const nascNonno=p=>{
  if(p.nasc!==undefined)return p.nasc;
  if(p.vivo||(p.mortoT!==undefined&&S.t-p.mortoT<=1)){p.nasc=S.anno-p.eta;return p.nasc}
  return null;
};
/* la regione del lato: di solito la tua; se sei nato al Nord, un lato su quattro (se il nonno è nato tra il 1920 e il 1945) viene dal Sud */
function regNonno(p,nasc){
  if(p.reg)return p.reg;
  const F=S.fatti;F.latiNonni=F.latiNonni||{};const lato=latoNonno(p);
  if(!F.latiNonni[lato]){
    const r0=regGiocatore();let R=r0;
    if(nordReg(r0)&&nasc>=1920&&nasc<=1945&&chance(.25))R=pesata(SUD_PESI);
    F.latiNonni[lato]=R;
  }
  p.reg=F.latiNonni[lato];return p.reg;
}
function ctxNonno(p){
  const nasc=p.nasc,reg=p.reg||regNonno(p,nasc);
  return {p,nasc,reg,z:ZONA_REG[reg]||'Centro',nord:nordReg(regGiocatore()),sudNato:sudReg(regGiocatore()),m:p.sesso==='M',id:p.id};
}
/* tasso fisso medio dei mutui nell'anno (TASSI_MUTUO, c7_italia.js) */
function tassoFissoAnno(a){
  const T=TASSI_MUTUO;let i=T.findIndex(x=>x[0]>=a);if(i<0)i=T.length-1;
  const B=T[i],A=T[Math.max(0,i-1)];return B[0]===a||i===0?B[1]:A[1]+(B[1]-A[1])*(a-A[0])/(B[0]-A[0]);
}
const metaId=id=>META_EMI.find(m=>m.id===id);   // metaDi() cerca per nome della città
const CENTRO_MEZZ=['Toscana','Umbria','Marche','Emilia-Romagna'];
const FABBRICHE_NO=['alla Fiat, a Mirafiori','all\'Olivetti di Ivrea','alla Pirelli di Milano','in una fabbrica di Sesto San Giovanni'];
const BOTTEGHE_M=[['falegname','Dalle sue mani uscivano sedie, armadi e culle che in paese durano ancora.','Sulla bara hanno messo un metro da falegname, come voleva.'],
  ['panettiere','Si alzava alle tre di notte, d\'inverno e d\'estate: la farina gli entrava fin dentro i pensieri.','In chiesa si sentiva ancora, tra l\'incenso, un profumo di pane.'],
  ['calzolaio','Riparava le scarpe di tutto il rione e le restituiva con una battuta in più.','La vecchia insegna della bottega è rimasta lì ancora per mesi, senza che nessuno la togliesse.'],
  ['fabbro','Batteva il ferro a mano, e ogni cancello del quartiere ha una sua firma nascosta.','Il suono dell\'incudine, quel giorno, mancava a tutto il rione.'],
  ['barbiere','Tagliava i capelli a tre generazioni di maschi del paese, e li giudicava tutti.','Il suo ultimo cliente ha pagato il taglio e l\'ha lasciato sul bancone, in memoria.']];
const BOTTEGHE_F=[['sarta','Cuciva abiti da sposa e vestiti da lutto con lo stesso rigore, e conosceva le misure di mezzo paese.','Sulla bara, un metro da sarta e un ditale d\'argento.'],
  ['parrucchiera','Nel suo salotto-negozio si sapevano tutte le storie del paese prima dei giornali.','Le sue clienti storiche sono venute tutte pettinate, e tutte piangevano ordinatamente.'],
  ['merciaia','Aveva bottoni di ogni tipo, e per ogni problema una soluzione fatta di filo e pazienza.','Il negozio è stato chiuso per giorni, con un cartello: «Per lutto».']];

/* Ogni storia: id, da/a (anno di nascita del nonno), sesso (opzionale), w(ctx) = peso (0 = non adatta), x(ctx) = il racconto, che inizia con
   «{Tuo} {P}», q(ctx) = cosa dice se gli fai domande, f(ctx) = una riga per il funerale, ric = il ricordo che ti resta.
   Tutto fuori da x senza segnaposto. Le date sono vere. */
const STORIE_NONNI=[
  {id:'guerra1',da:1870,a:1899,w:()=>3,ric:'Ti ha raccontato la Grande Guerra',
    x:c=>c.m?`{Tuo} {P} ti racconta la Grande Guerra. Fu chiamato ${c.nasc>=1899?'nel 1917, a diciotto anni, uno dei «ragazzi del \'99»':c.nasc>=1896?'nel 1916':'nel 1915'}. ${c.z==='Nord-est'?'Il fronte passava a pochi chilometri da casa: dopo Caporetto, nell\'ottobre del 1917, la famiglia dovette scappare, profuga.':'Lo mandarono sul Carso: freddo, fango e la paura che ti prendeva alla gola quando suonava l\'ordine di uscire dalla trincea.'}`
       :`{Tuo} {P} ti racconta la Grande Guerra vista da casa: gli uomini al fronte, le donne nei campi e nelle stalle, e il postino che tutti temevano di veder arrivare con una busta. ${c.z==='Nord-est'?'Dopo Caporetto, nell\'ottobre del 1917, la sua famiglia fuggì profuga, con un carro e poche cose.':'Per quattro anni portò avanti la terra con le sorelle e la madre.'}`,
    q:c=>c.m?'Gli chiedi com\'è tornare. «Nel 1919. Con una medaglia di latta e una tosse che non è più passata. La guerra, ti dico, non la vince nessuno.»':'Le chiedi se ha avuto paura. «Più che altro, fame. E nel \'18 è arrivata anche la spagnola: ha portato via più gente delle bombe.»',
    f:c=>c.m?'Sulla bara hanno appoggiato il nastrino da combattente: i vecchi del paese si sono messi sull\'attenti.':'Il parroco ha ricordato gli anni della guerra, i campi lavorati da sola, i figli cresciuti senza nessuno.'},
  {id:'guerra2',da:1905,a:1927,w:()=>3,ric:'Ti ha raccontato la Seconda guerra',
    x:c=>{
      if(!c.m)return `{Tuo} {P} ti racconta la guerra vista dalle donne: ${c.id%2?'sfollata in campagna, perché le città erano bombardate: «Si correva al rifugio con la sorella in braccio, e c\'era sempre un bambino che non voleva svegliarsi»':'staffetta partigiana dopo l\'8 settembre del 1943, con la bicicletta e un messaggio nascosto nel manubrio'}.`;
      const k=c.nasc>=1923?2:c.id%3;
      return `{Tuo} {P} ti racconta la Seconda guerra. ${k===0?'Fu in Russia: la ritirata dell\'inverno del 1943, settimane a piedi nella neve, dove chi si fermava non si rialzava più.':k===1?'L\'8 settembre del 1943, dopo l\'armistizio, i tedeschi lo portarono in Germania: internato per quasi due anni, fino all\'estate del 1945.':'Dopo l\'8 settembre del 1943 salì in montagna con i partigiani: fino al 25 aprile del 1945, tra boschi e inverni senza scarpe.'}`;
    },
    q:c=>c.m?'Gli chiedi com\'è tornare. «Pesavo poco più di quaranta chili. Per tutta la vita non ho lasciato niente nel piatto, e il pane lo tenevo da parte.»':'Le chiedi se l\'ha rivisto, quel tempo. «Quando il fratello tornò dal fronte lo riconobbi solo dalla voce.»',
    f:c=>c.m?'Al funerale è arrivato un vecchio compagno, con la medaglia sul cappotto e gli occhi rossi.':'Le amiche di una vita sono venute tutte, e si ricordavano ancora il nome delle sue sorelle.'},
  {id:'america',da:1870,a:1896,w:c=>c.m?(sudReg(c.reg)?3:['Veneto','Friuli-Venezia Giulia','Piemonte'].includes(c.reg)?2:.6):(sudReg(c.reg)?2:.5),ric:'Ti ha raccontato l\'emigrazione in America',
    x:c=>{
      const a=Math.max(1900,Math.min(1913,c.nasc+22)),dest=['New York','Buenos Aires','San Paolo'][c.id%3],porto=sudReg(c.reg)?pick(['Napoli','Palermo']):'Genova';
      return c.m?`{Tuo} {P} ti racconta di quando andò in America: nel ${a} salì a ${porto} su un piroscafo, venti giorni di mare in terza classe, diretto a ${dest}. ${dest==='New York'?'Sbarcato a Ellis Island, la visita dei medici, un segno di gesso sul cappotto e la paura di essere rimandato indietro.':dest==='Buenos Aires'?'Sbarcato a Buenos Aires, il cielo era enorme, la lingua quasi uguale e la terra più grande di qualsiasi sogno.':'A San Paolo, in una fazenda, a raccogliere il caffè con altre cento famiglie italiane.'}`
        :`{Tuo} {P} ti racconta l\'America vista da chi restò: suo padre partì nel ${a} per ${dest}, e lei ogni mese aspettava il postino, con i pochi soldi spediti e le righe scritte da un altro, perché lui non sapeva scrivere.`;
    },
    q:c=>!c.m?'Le chiedi se ha rivisto suo padre. «Una volta sola, anni dopo, quando tornò per qualche settimana. Non lo riconobbi subito.»':c.id%2?'Gli chiedi se è tornato. «Dopo la guerra, con un orologio d\'oro e due parole di inglese. Qui nessuno mi ha creduto, ma l\'orologio era vero.»':'Gli chiedi se è tornato. «No. Ho messo su famiglia là. Ci sono ancora cugini d\'America che a Natale ci mandano gli auguri.»',
    f:()=>'In chiesa qualcuno ha cantato un canto che non si sentiva più: l\'aveva portato lui dall\'altra parte dell\'oceano.'},
  {id:'belgio',da:1912,a:1933,sesso:'M',w:c=>sudReg(c.reg)||c.reg==='Abruzzo'?3:['Veneto','Friuli-Venezia Giulia'].includes(c.reg)?2.5:.8,ric:'Ti ha raccontato le miniere del Belgio',
    x:c=>{
      const m=metaId('charleroi'),a=Math.max(m.da,Math.min(m.a,c.nasc+m.etaMin+3));
      return `{Tuo} {P} ti racconta le miniere del Belgio: nel ${a}, a ${a-c.nasc} anni, partì per ${m.n}. ${m.nota} Sotto terra, a centinaia di metri, si lavorava con il caldo e la polvere; la sera si dormiva nelle baracche, in sei per stanza.`;
    },
    q:c=>`Gli chiedi di Marcinelle. L'8 agosto 1956, nella miniera del Bois du Cazier, morirono 262 minatori, 136 italiani. ${c.id%2?'«Quel giorno non ero di turno. Conoscevo molti di loro per nome, e per anni non ne ho parlato.»':'«Ero già tornato, da un anno. Ma ogni 8 agosto accendo una candela per quelli rimasti là sotto.»'}`,
    f:()=>'Davanti alla bara un vecchio compagno di miniera ha tolto il cappello e ha detto solo: «Era dei nostri».'},
  {id:'germania',da:1921,a:1950,w:c=>sudReg(c.reg)||['Veneto','Friuli-Venezia Giulia','Trentino-Alto Adige/Südtirol'].includes(c.reg)?2:1,ric:'Ti ha raccontato quando andò a lavorare all\'estero',
    x:c=>{
      const col=c.id%2===0,m=metaId(col?'colonia':'zurigo'),a=Math.max(m.da,Math.min(1970,c.nasc+22));
      return c.m?(col?`{Tuo} {P} ti racconta di quando andò a lavorare in Germania: nel ${a} partì per ${m.n}. ${m.nota} Alla stazione, in fila per la visita medica, con un numero sul cappotto; poi la fabbrica e le baracche, la minestra scaldata sul fornello.`
        :`{Tuo} {P} ti racconta di quando andò a lavorare in Svizzera: nel ${a} partì per ${m.n}, con il permesso da stagionale. ${m.nota} Moglie e figli non potevano raggiungerlo; i bambini nati là, di nascosto, restavano chiusi in casa per non farsi sentire.`)
        :`{Tuo} {P} ti racconta di quando andò a lavorare a ${m.n}, nel ${a}, ${col?'in una fabbrica tessile':'in una fabbrica di cioccolato'}: la sera cucinava per tutti i compagni di baracca, e il primo inverno fu il più lungo della sua vita.`;
    },
    q:c=>'Gli chiedi dei soldi. «Quasi tutto lo stipendio andava a casa, un vaglia ogni mese. Con quei soldi, in paese, hanno costruito la casa che ancora si vede dalla piazza.»',
    f:()=>'Nella giacca gli hanno messo, come voleva, il vecchio libretto di lavoro: il documento di una vita fatta di partenze.'},
  {id:'sud_nord',da:1920,a:1945,w:c=>sudReg(c.reg)&&c.nord?9:0,ric:'Ti ha raccontato quando lasciò il Sud',
    x:c=>{
      const a=Math.max(1955,Math.min(1963,c.nasc+22)),cit=c.id%2?'Torino':'Milano';
      return `{Tuo} {P} ti racconta di quando lasciò ${c.reg} per ${cit}, nel ${a}: arrivò con la valigia di cartone e l'indirizzo di un cugino. ${c.m?`C'erano i cartelli «Non si affitta ai meridionali», ma il lavoro in fabbrica c'era: ${c.id%2?'alla Fiat, a Mirafiori':'in un\'officina della cintura'}; la sera dormiva in una stanza con altri tre.`:`Lo raggiunse quando lui trovò un alloggio: una stanza e una cucina, e il lavoro a cottimo in una sartoria della periferia.`}`;
    },
    q:c=>'Ti ripete sempre la stessa frase: «Il Sud me lo sono portato dentro, il Nord mi ha dato la casa. Per un po\' si fa fatica a dire quale dei due è casa.»',
    f:c=>`Il funerale si è fatto al Nord, ma la bara è ripartita per ${c.reg}: è tornat${c.m?"o":"a"} giù a riposare.`},
  {id:'terra_sud',da:1905,a:1932,w:c=>sudReg(c.reg)&&c.sudNato?3:0,ric:'Ti ha raccontato quando ebbe la terra',
    x:c=>`{Tuo} {P} ti racconta la fame di terra: ${c.m?'bracciante senza un metro suo, ogni mattina all\'alba in piazza per farsi scegliere per la giornata':'figlia di braccianti, nei campi a giornata fin da bambina'}. Poi, con ${c.reg==='Calabria'?'la legge Sila del maggio 1950':'la riforma agraria del 1950'}, la famiglia ebbe un pezzo di terra: pochi ettari di pietre, ma suoi.`,
    q:c=>`Gli chiedi come andò. «La terra è come una persona: ti ripaga se ti ci metti d\'accordo. Due dei miei figli sono partiti per il Nord, io sono rimast${c.m?'o':'a'} a guardare gli ulivi.»`,
    f:()=>'In paese hanno chiuso i negozi: «Era uno di quelli che la terra l\'ha avuta davvero».'},
  {id:'mezzadria',da:1905,a:1942,w:c=>CENTRO_MEZZ.includes(c.reg)?5:0,ric:'Ti ha raccontato la mezzadria',
    x:c=>`{Tuo} {P} ti racconta il podere: nacque in una famiglia di mezzadri, quindici persone sotto un solo capoccia, metà del raccolto al padrone. «Una legge del 1964 ha vietato i nuovi contratti; una del 1982 ha chiuso gli ultimi.» Negli anni del boom i figli se ne andarono in fabbrica, e il podere si spense.`,
    q:()=>'Gli chiedi del podere. «Oggi è un agriturismo. Lo guardo dal bar e dico: che roba. Prima ci lavoravano quindici persone, adesso ci vengono a camminare.»',
    f:()=>'Per portarlo al cimitero hanno scelto la strada tra i campi, quella che costeggiava il suo podere.'},
  {id:'boom',da:1925,a:1940,w:c=>nordReg(c.reg)||ZONA_REG[c.reg]==='Centro'?3:.8,ric:'Ti ha raccontato il boom degli anni Sessanta',
    x:c=>{const fb=FABBRICHE_NO[c.id%FABBRICHE_NO.length];return `{Tuo} {P} ti racconta l'Italia del miracolo economico: ${c.m?`il turno ${nordReg(c.reg)?fb:'in una fabbrica di provincia'}, il cottimo e la mensa`:`in fabbrica c'erano più donne di quanto si dica: lei alla catena, poi a casa a stirare`}. Nel 1960, l'anno delle Olimpiadi di Roma, comprarono il primo frigorifero; la televisione si guardava al bar o dal vicino.`},
    q:c=>c.m?'Gli chiedi del primo stipendio fisso. «Una rivoluzione. Con quello comprammo la 600 a rate, cinquanta rate, e sposai tua nonna.»':'Le chiedi del primo stipendio. «Il primo lo diedi tutto a mia madre. Il secondo mi comprai un paio di scarpe. Il terzo, un fidanzato.»',
    f:()=>'I compagni di fabbrica sono venuti con la giacca buona e il fazzoletto del sindacato al collo.'},
  {id:'fabbrica70',da:1945,a:1960,w:()=>3,ric:'Ti ha raccontato la fabbrica e il sindacato',
    x:c=>`{Tuo} {P} ti racconta la fabbrica negli anni Settanta: il turno di notte, il cartellino e il sindacato in assemblea. ${c.nasc<=1951?`Nell'autunno caldo del 1969, a ${1969-c.nasc} anni, fece i suoi primi scioperi: per mesi la busta paga fu più leggera, e ne è ancora ${c.m?'fiero':'fiera'}.`:c.nasc<=1952?'Entrò a lavorare quando lo Statuto dei lavoratori, del maggio 1970, era appena legge: per la prima volta in fabbrica qualcuno chiedeva il parere degli operai.':`Entrò in fabbrica nel ${c.nasc+18}, a diciotto anni: lo Statuto dei lavoratori era già legge da qualche anno, e i più anziani raccontavano com'era prima.`}`,
    q:()=>'Gli chiedi se ne è valsa la pena. «Le ore di sciopero ce le ricordiamo tutti. Ma oggi, quando il capo mi chiama per nome, lo faccio notare: prima non lo faceva.»',
    f:()=>'Alle esequie c\'era una bandiera del sindacato, piegata con cura, come una cosa di famiglia.'},
  {id:'sessantotto',da:1946,a:1952,w:()=>1.5,ric:'Ti ha raccontato il Sessantotto',
    x:c=>`{Tuo} {P} ti racconta il Sessantotto: il 1º marzo 1968, a Valle Giulia, gli scontri tra studenti e polizia. ${c.m?'Lui era in piazza, o più spesso in assemblea fino a notte':'Lei andava alle assemblee con i capelli lunghi e un libro sotto il braccio, quando i genitori credevano fosse in biblioteca'}. «Volevamo cambiare il mondo: poi abbiamo cambiato soprattutto noi stessi.»`,
    q:()=>'Gli chiedi se rifarebbe tutto. «Non tutto. Ma le notti passate a discutere sì, tutte: erano le migliori della mia vita.»',
    f:()=>'Qualcuno ha cantato, a mezza voce, un canto di quegli anni; gli altri si sono guardati e hanno sorriso.'},
  {id:'terremoto',da:1945,a:1960,w:c=>c.reg==='Friuli-Venezia Giulia'||c.reg==='Campania'||c.reg==='Basilicata'?5:0,ric:'Ti ha raccontato il terremoto',
    x:c=>c.reg==='Friuli-Venezia Giulia'?`{Tuo} {P} ti racconta il terremoto del Friuli: la sera del 6 maggio 1976, alle nove, la terra tremò e quasi mille persone morirono. Aveva ${1976-c.nasc} anni e scavò a mani nude con i vicini; poi, per anni, nei prefabbricati. La ricostruzione fu «com'era e dov'era», e la promessa fu mantenuta.`
      :`{Tuo} {P} ti racconta il terremoto dell'Irpinia: la sera del 23 novembre 1980, alle sette e mezza, la terra tremò e morirono quasi tremila persone. Aveva ${1980-c.nasc} anni; i soccorsi tardarono, e per giorni si scavò con le mani. Il giornale titolò «Fate presto».`,
    q:()=>'Gli chiedi come ci si sente. «Nei primi giorni non ci si sente niente. Dopo, ogni sera, ti accorgi di dormire con le scarpe vicino al letto. Qualcuno lo fa ancora.»',
    f:()=>'Al funerale tutto il paese era in piedi, e nessuno se n\'è andato prima della fine.'},
  {id:'lavoro80',da:1958,a:1968,w:()=>2,ric:'Ti ha raccontato gli anni Ottanta',
    x:c=>`{Tuo} {P} ti racconta gli anni Ottanta: ${c.nasc>=1962?'il primo lavoro, con un contratto di formazione e lavoro, una novità di quegli anni':'il lavoro di quegli anni, con già qualche anno di fabbrica o di ufficio alle spalle'}, le fabbriche che chiudevano e i negozi che si riempivano, e tutti che compravano a rate. Nel febbraio del 1984 il «decreto di San Valentino» tagliò la scala mobile, e nelle assemblee volavano parole grosse.`,
    q:()=>'Gli chiedi com\'era. «Sembrava che tutto fosse possibile, e anche che tutto fosse in vendita. Aveva ragione chi diceva "stai attento": la festa è durata meno di quanto credevamo.»',
    f:c=>`Hanno messo sulla bara il vecchio tesserino dell'azienda, quello con la foto ${c.m?'di un ragazzo con i baffi':'di una ragazza con i capelli cotonati'}.`},
  {id:'mutuo',da:1955,a:1990,w:()=>3,ric:'Ti ha raccontato la sua prima casa',
    x:c=>{const a=Math.min(2025,c.nasc+30),t=Math.round(tassoFissoAnno(a)*2)/2;return `{Tuo} {P} ti racconta la prima casa: la comprò nel ${a}, con un prestito della banca al ${String(t).replace('.',',')}% l'anno. ${t>=9?'La rata mangiava quasi metà di quello che guadagnava, e i conti si facevano a sera, sul retro di una busta.':'I tassi erano bassi, ma il contratto era precario: alla banca servivano garanzie, e le trovò con le firme dei genitori.'}`},
    q:()=>'Gli chiedi se è stato difficile. «Le prime sere, in una casa vuota con la lampadina nuda, pensavo: ce l\'abbiamo fatta. Poi arrivò la bolletta, e capii che cominciava tutto adesso.»',
    f:()=>'La casa che aveva comprato era piena di gente: l\'ultima volta che si riempì così fu per un matrimonio.'},
  {id:'mondiali82',da:1955,a:1975,w:()=>2,ric:'Ti ha raccontato i Mondiali del 1982',
    x:c=>`{Tuo} {P} ti racconta i Mondiali del 1982. L'11 luglio, a Madrid, l'Italia batté la Germania Ovest 3 a 1 e diventò campione del mondo per la terza volta. ${c.nasc<=1966?'La guardò con gli amici, in piazza, davanti al televisore del bar':`La guardò da ${c.m?'bambino':'bambina'}, sulle gambe del padre`}. Il presidente Pertini, in tribuna, saltò dalla gioia; poi i caroselli con le bandiere e i clacson, tutta la notte.`,
    q:()=>'Gli chiedi chi fosse il suo preferito. «Rossi, ovvio, e Zoff, e Tardelli con quell\'urlo. Ma il mio preferito era Pertini, con la pipa e la gioia di un bambino.»',
    f:()=>'Su un lato della sala, quasi per scherzo, qualcuno ha appeso la sciarpa azzurra del 1982.'},
  {id:'euro',da:1958,a:1992,w:()=>2.5,ric:'Ti ha raccontato quando arrivò l\'euro',
    x:c=>c.nasc<=1975?`{Tuo} {P} ti racconta l'arrivo dell'euro: il 1º gennaio 2002, 1.936,27 lire per un euro. Per mesi fece i conti a mente, dividendo per duemila: il caffè costava mille lire, cioè cinquanta centesimi, e sembrava un furto. Una banconota da diecimila lire è ancora nel cassetto.`
      :`{Tuo} {P} ti racconta l'arrivo dell'euro: il 1º gennaio 2002, ricorda le monete nuove, lucide, e i genitori che sbuffavano davanti ai prezzi. Per tanto tempo i vecchi parlavano ancora in lire, e ${c.m?'lui':'lei'} li guardava come se venissero da un altro pianeta.`,
    q:()=>'Gli chiedi quanto è cambiato. «I prezzi, tanto. Ma anche il modo di contare: da allora i soldi sono più piccoli, e le cose che compri non lo sono.»',
    f:()=>'Alla fine, nel suo portafoglio hanno trovato una banconota da mille lire piegata in quattro: non l\'aveva mai spesa.'},
  {id:'bottega',da:1880,a:1992,w:()=>1,ric:'Ti ha raccontato il suo lavoro',
    x:c=>{
      if(c.nasc>=1960)return `{Tuo} {P} ti racconta della sua attività: dopo anni da dipendente aprì ${['un negozio di quartiere','un\'officina','un bar'][c.id%3]}, con un prestito della banca e le notti a fare i conti. Nei primi anni lavorava quattordici ore, e la domenica faceva la contabilità sul tavolo di cucina.`;
      const B=(c.m?BOTTEGHE_M:BOTTEGHE_F)[c.id%(c.m?BOTTEGHE_M:BOTTEGHE_F).length];
      return `{Tuo} {P} ti racconta della sua bottega: ${c.m?'faceva il':'faceva la'} ${B[0]}. ${B[1]}`;
    },
    q:()=>'Gli chiedi se rifarebbe lo stesso lavoro. «Subito. Era mio, anche quando non era facile. Le cose fatte con le mani hanno un modo di restare.»',
    f:c=>c.nasc>=1960?'Sul bancone del suo locale hanno lasciato un mazzo di fiori e il cartello «Chiuso per lutto».':(c.m?BOTTEGHE_M:BOTTEGHE_F)[c.id%(c.m?BOTTEGHE_M:BOTTEGHE_F).length][2]}
];

/* la storia del nonno (la sceglie alla prima richiesta); k = 'x' (racconto), 'q' (se fai domande), 'f' (funerale), 'ric' (ricordo) */
function storiaNonno(p){
  if(!p||p.ruolo!=='Nonno')return null;
  if(!p.storia){
    const nasc=nascNonno(p);if(nasc===null||nasc===undefined)return null;
    const c=ctxNonno(p);
    const ok=STORIE_NONNI.filter(s=>nasc>=s.da&&nasc<=s.a&&(!s.sesso||s.sesso===p.sesso)).map(s=>[s,Math.max(0,s.w(c))]).filter(x=>x[1]>0);
    p.storia=ok.length?pesata(ok).id:'bottega';
  }
  return STORIE_NONNI.find(s=>s.id===p.storia)||null;
}
function testoStoria(p,k){
  const s=storiaNonno(p);if(!s)return '';
  if(k==='ric')return s.ric;
  const c=ctxNonno(p);let t=s[k](c);if(k==='q'&&!c.m)t=t.replace(/^Gli /,'Le ');return t;
}
/* al funerale di un nonno torna la sua storia */
function funeraleNonno(p){
  const t=testoStoria(p,'f');if(!t)return;
  log(`Al funerale di ${p.nome}: ${t}${nv(p,'raccontata')?' Tu sai da dove viene.':''}`,'h');
}
