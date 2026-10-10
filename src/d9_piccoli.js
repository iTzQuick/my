/* ================= PRIMI ANNI (1–6): ALTRI MOMENTI CHE FORMANO IL CARATTERE =================
   Si aggiungono a d4_infanzia.js (ROADMAP, Fase 1: almeno 100 eventi possibili sotto i 6 anni).
   Da piccoli il carattere si sposta di più (plasticita: ×1,5 sotto i 7 anni): valori pers 1–3. */
const haAnimale=t=>S.animali.some(a=>!t||a.t===t);

/* ---------- 1–2 anni ---------- */
ev({id:'pic_ciuccio',min:1,max:3,once:1,t:'Il ciuccio',x:'Mamma ha deciso: è ora di dire addio al ciuccio.',c:[
  {l:'Lo regali alla fata dei ciucci',e:{f:1},pers:{C:2,N:-1},r:'In cambio arriva un pupazzo nuovo. Affare fatto.'},
  {l:'Lo nascondi sotto il cuscino',pers:{O:1,C:-1,N:1},r:'Lo trovano dopo una settimana. Era il tuo piccolo segreto.'},
  {l:'Piangi tre notti di fila',e:{f:-2},pers:{N:2,E:1},r:'Alla quarta notte ti addormenti esaust{o}. Il ciuccio è un ricordo.'}]});
ev({id:'pic_dentini',min:1,max:2,once:1,t:'I dentini',x:'Stanno spuntando i dentini e ti fa male tutto. Mordicchi qualsiasi cosa.',c:[
  {l:'Mordi il dito di papà',pers:{A:-1,E:1},r:'Papà urla più forte di te. Per un attimo ti passa il male, dal ridere.'},
  {l:'Mordicchi l\'anello di gomma freddo',e:{f:1},pers:{C:1,N:-1},r:'Il freddo calma tutto. Ti addormenti con l\'anello in bocca.'},
  {l:'Vuoi solo stare in braccio',e:{f:-1},pers:{N:1,E:1},r:'Una notte intera in braccio, camminando avanti e indietro in corridoio.'}]});
ev({id:'pic_pappa',min:1,max:2,once:1,t:'La pappa nuova',x:'Oggi nel piatto c\'è una cosa verde. Mai vista prima.',c:[
  {l:'La sputi con grande eleganza',pers:{O:-2,A:-1},r:'Il passato di verdure arriva fino alla parete.'},
  {l:'Apri la bocca come un uccellino',e:{s:1},pers:{O:2,A:1},r:'Ne vuoi ancora. La nonna è commossa.'},
  {l:'Vuoi tenere tu il cucchiaio',pers:{C:1,O:1},r:'Metà sul bavaglino, metà sul pavimento, un po\' anche in bocca.'}]});
ev({id:'pic_pupazzo',min:1,max:3,once:1,t:'Il pupazzo',x:'Il tuo coniglio di pezza viene ovunque con te. Oggi lo avete dimenticato al parco.',c:[
  {l:'Piangi finché non tornano a cercarlo',e:{f:-1},pers:{N:2,A:1},r:'Papà torna al parco con la torcia alle dieci di sera. Lo trova sulla panchina.'},
  {l:'Ti consoli con un altro pupazzo',pers:{N:-2,O:1},r:'Il coniglio viene sostituito da un orso. Sei più pratic{o} di quanto pensassero.'},
  {l:'Non dormi finché non torna',pers:{C:1,N:1},r:'Ritrovato all\'alba. Da oggi gli cuciono il tuo nome sull\'orecchio.'}]});
ev({id:'pic_aspirapolvere',min:1,max:2,once:1,t:'Il mostro rumoroso',x:'Dall\'armadio esce un mostro che ruggisce e si mangia le briciole: l\'aspirapolvere.',c:[
  {l:'Scappi in braccio a mamma',pers:{N:2},r:'Per mesi, quando esce l\'aspirapolvere, tu sparisci.'},
  {l:'Lo attacchi con il cucchiaio',e:{f:2},pers:{N:-2,E:1},r:'Il mostro si arrende. Tu sei un eroe.'},
  {l:'Lo guardi con curiosità',pers:{O:2},r:'Dopo un po\' vuoi spingerlo tu. Ti lasciano fare.'}]});
ev({id:'pic_cassetti',min:1,max:3,once:1,t:'I cassetti',x:'Hai scoperto che i cassetti della cucina si aprono.',c:[
  {l:'Svuoti quello delle pentole',e:{f:2},pers:{O:2,C:-1},r:'Un concerto di coperchi. I vicini apprezzano meno.'},
  {l:'Apri e chiudi, apri e chiudi',pers:{C:1},r:'Venti minuti di concentrazione assoluta. Poi ti pizzichi un dito.'},
  {l:'Ti nascondi dentro l\'armadio',pers:{E:-1,O:1},r:'Ti trovano addormentat{o} tra gli asciugamani.'}]});
ev({id:'pic_neve',min:1,max:4,once:1,cond:()=>luogo().zona!=='Isole',t:'La prima neve',x:'Fuori è tutto bianco. Per la prima volta tocchi la neve.',c:[
  {l:'Ti tuffi a pancia in giù',e:{f:4},pers:{E:2,N:-1},r:'Il pupazzo di neve più piccolo e storto della storia. È tuo.'},
  {l:'La assaggi',pers:{O:2},r:'Sa di niente, ma è freddissima. Ne vuoi ancora.'},
  {l:'Piangi: è fredda e bagnata',e:{f:-1},pers:{N:2},r:'Torni dentro dopo trenta secondi. La neve la guardi dalla finestra.'}]});
ev({id:'pic_bolle',min:1,max:3,once:1,t:'Le bolle di sapone',x:'Il nonno soffia le bolle di sapone in giardino.',c:[
  {l:'Le insegui per tutto il prato',e:{f:3,s:1},pers:{E:1},r:'Corri finché non ti siedi per terra senza fiato, ridendo.'},
  {l:'Vuoi soffiare tu',pers:{C:1,O:1},r:'Ci vogliono dieci tentativi. All\'undicesimo esce una bolla gigante.'},
  {l:'Le scoppi una per una con il dito',pers:{C:2},r:'Nessuna sfugge. Metodic{o} fin da piccol{o}.'}]});
ev({id:'pic_candelina',min:1,max:1,once:1,t:'Una candelina',x:'Primo compleanno: tutti cantano attorno a una torta con una candelina sola.',c:[
  {l:'Infili la mano nella torta',e:{f:3},pers:{O:1,C:-1},r:'La foto più bella dell\'album: tu, la torta e la panna fino ai gomiti.'},
  {l:'Ti spaventi per il coro',pers:{N:1,E:-1},r:'Tanti auguri a te, tra le lacrime. Poi la torta aggiusta tutto.'},
  {l:'Batti le mani più forte di tutti',e:{f:2},pers:{E:2},r:'Applaudi anche dopo, a ogni cosa. La festa è tua e lo sai.'}]});
ev({id:'pic_telecomando',min:1,max:3,once:1,t:'Il telecomando',x:'Il telecomando è sul divano. Nessuno ti guarda.',c:[
  {l:'Premi tutti i tasti',pers:{O:1,C:-1},r:'La TV parla in tedesco per tre giorni.'},
  {l:'Lo porti a papà come un trofeo',e:{f:1},pers:{A:2},r:'«Grazie!» Lo riporti altre dodici volte.'},
  {l:'Lo nascondi e guardi tutti cercarlo',pers:{A:-1,O:1},r:'Lo trovano nel cesto dei giocattoli dopo un\'ora. Tu ridi da un angolo.'}]});
ev({id:'pic_passeggino',min:1,max:2,once:1,t:'In passeggino',x:'Passeggiata in centro. Dal passeggino vedi passare un sacco di gente.',c:[
  {l:'Saluti tutti i passanti',e:{f:2},pers:{E:2,A:1},r:'Mezzo quartiere ti saluta. Una signora ti regala una caramella.'},
  {l:'Ti addormenti beat{o}',pers:{N:-1},r:'Il rumore del traffico ti culla meglio di qualsiasi ninna nanna.'},
  {l:'Vuoi scendere e camminare',pers:{C:1,E:1},r:'Dieci passi, poi vuoi di nuovo il passeggino. Ma hai deciso tu.'}]});
ev({id:'pic_ninna',min:1,max:3,once:1,cond:()=>!!nonnoV(),t:'La ninna nanna',x:'Ti mettono a letto i nonni. La nonna canta una ninna nanna che cantava anche a tua madre.',c:[
  {l:'Ti addormenti alla seconda strofa',pers:{N:-1,A:1},r:'Non sentirai mai la fine. Nessuno l\'ha mai sentita.'},
  {l:'Canti con lei, a modo tuo',e:{f:2},pers:{E:1,O:1},r:'Un duetto stonato e bellissimo.'},
  {l:'La vuoi sempre uguale, cento volte',pers:{C:2,O:-1},r:'Se la nonna cambia una parola, la correggi.'}]});
ev({id:'pic_specchio',min:1,max:2,once:1,t:'Lo specchio',x:'Nello specchio del corridoio c\'è un bambino che ti guarda.',c:[
  {l:'Gli dai un bacio',e:{f:2},pers:{A:1,E:1},r:'Il bambino ti bacia anche lui. Diventate amici.'},
  {l:'Fai le smorfie per mezz\'ora',e:{f:2},pers:{O:1,E:1},r:'Il bambino è bravissimo: le rifà tutte uguali.'},
  {l:'Ti nascondi: chi è quello?',pers:{N:1},r:'Ci vogliono settimane prima di capire che sei tu.'}]});
ev({id:'pic_libro',min:1,max:3,once:1,t:'Il libro cartonato',x:'Ti regalano un libro con le pagine di cartone e tanti animali.',c:[
  {l:'Lo sfogli da sol{o} indicando gli animali',e:{i:2},pers:{O:1,C:1},r:'«Mucca!» Era un cane, ma il concetto c\'è.'},
  {l:'Lo mordi',pers:{C:-1},r:'Gli angoli non saranno più gli stessi.'},
  {l:'Lo porti a mamma: «Ancora!»',e:{i:1,f:1},pers:{E:1,A:1},r:'Diciassette letture di fila. Mamma lo sa a memoria.'}]});
ev({id:'pic_micio',min:1,max:4,once:1,cond:()=>haAnimale(),t:'L\'animale di casa',x:d=>{const a=S.animali[0];return `${a.nome}, ${a.t==='Gatto'?'il gatto':a.t==='Cane'?'il cane':'l\'animale'} di casa, dorme sul tappeto.`},c:[
  {l:'Lo tiri per la coda',e:{f:-2},pers:{A:-2},r:'Un soffio e uno sguardo offeso. Hai capito la lezione.'},
  {l:'Lo accarezzi piano, come ti hanno insegnato',e:{f:3},pers:{A:2,C:1},r:'Fa le fusa, o almeno ci prova. Da oggi dorme vicino a te.'},
  {l:'Gli offri la tua pappa',pers:{A:1,O:1},r:'Apprezza moltissimo. Mamma molto meno.'}]});

/* ---------- 2–4 anni ---------- */
ev({id:'pic_no',min:2,max:3,once:1,t:'«No!»',x:'Hai imparato una parola potentissima: «No».',c:[
  {l:'Dici di no a tutto, anche al gelato',pers:{A:-2,E:1},r:'Poi piangi perché non ti danno il gelato. È complicato avere due anni.'},
  {l:'Dici no, poi ci ripensi',pers:{O:1},r:'«No.» Pausa. «Sì.» La trattativa è la tua arte.'},
  {l:'Lo dici solo ai broccoli',pers:{C:1},r:'Con i broccoli la guerra continuerà per anni.'}]});
ev({id:'pic_vasino',min:2,max:3,once:1,t:'Il vasino',x:'In bagno è comparso un vasino a forma di paperella.',c:[
  {l:'Ci riesci al primo colpo',e:{f:3},pers:{C:2,N:-1},r:'Applausi da tutta la famiglia. Non sei mai stat{o} così fier{o}.'},
  {l:'Meglio il pannolino ancora un po\'',pers:{C:-1,N:1},r:'Non c\'è fretta, dice la pediatra. Mamma sospira.'},
  {l:'Lo usi come cappello',e:{f:2},pers:{O:2,C:-1},r:'Era pulito, per fortuna. La foto gira tra tutti i parenti.'}]});
ev({id:'pic_vestiti',min:2,max:4,once:1,t:'Mi vesto da sol{o}',x:'Stamattina vuoi scegliere tu cosa metterti.',c:[
  {l:'Stivali di gomma e costume da bagno',e:{f:3},pers:{O:2,C:-1},r:'A dicembre. Ti lasciano fare fino al portone.'},
  {l:'Ci metti mezz\'ora, ma ce la fai',pers:{C:2},r:'La maglietta è al rovescio, ma l\'hai messa tu.'},
  {l:'Ti fai vestire, in silenzio',pers:{E:-1,A:1},r:'Ci pensano i grandi. Tu pensi ad altro.'}]});
ev({id:'pic_pozzanghere',min:2,max:5,once:1,t:'Le pozzanghere',x:'Ha piovuto tutta la notte e hai gli stivali di gomma nuovi.',c:[
  {l:'Salti nella più grande',e:{f:4},pers:{E:1,O:1,C:-1},r:'Fradici{o} fino alle orecchie. Il giorno più bello della settimana.'},
  {l:'Le giri intorno con attenzione',pers:{C:2},r:'Neanche una goccia sugli stivali nuovi.'},
  {l:'Ci butti dentro i sassi',pers:{O:1},r:'Il sasso piccolo fa «plic», quello grande fa «splash». Scienza.'}]});
ev({id:'pic_morso',min:2,max:4,once:1,t:'Il camion rosso',x:'All\'asilo un bambino ti strappa di mano il camion rosso.',c:[
  {l:'Lo mordi',pers:{A:-3,N:1},r:'Il camion torna a te. La maestra chiama mamma.'},
  {l:'Corri dalla maestra',pers:{C:1,A:1},r:'La maestra spiega che si gioca a turno. Il turno tuo arriva dopo.'},
  {l:'Ne prendi un altro',e:{f:1},pers:{N:-2,A:1},r:'Il camion blu va benissimo. Anzi, è più veloce.'}]});
ev({id:'pic_mio',min:2,max:5,once:1,t:'È mio!',x:'Un\'amichetta vuole giocare con le tue costruzioni.',c:[
  {l:'Gliele presti, anche se ti costa',pers:{A:3},r:'Costruite una torre altissima. Insieme è più divertente, chi l\'avrebbe detto.'},
  {l:'Le stringi forte: sono tue',pers:{A:-2,N:1},r:'Restano tue. E resti da sol{o} a giocarci.'},
  {l:'Proponi di fare una città insieme',e:{f:2},pers:{A:1,E:2},r:'Una città intera sul tappeto. Il sindaco sei tu.'}]});
ev({id:'pic_lettone',min:2,max:5,once:1,t:'Il lettone',x:'È notte, la tua cameretta è buia e il lettone dei grandi è a pochi passi.',c:[
  {l:'Ti infili nel lettone',e:{f:2},pers:{N:1,E:1},r:'Ogni notte, alle tre. Papà finisce a dormire nel tuo letto.'},
  {l:'Resti nel tuo lettino, con la lucina accesa',pers:{N:-1,C:1},r:'La lucina a forma di luna ti tiene compagnia.'},
  {l:'Ti addormenti sul tappeto davanti alla loro porta',pers:{O:1,N:1},r:'Ti ritrovano lì la mattina, con il pupazzo e la coperta.'}]});
ev({id:'pic_parrucchiere',min:2,max:5,once:1,t:'Dal parrucchiere',x:'Il primo taglio di capelli dal parrucchiere vero, sulla sedia alta.',c:[
  {l:'Stai fermissim{o} per avere la caramella',pers:{C:2},r:'Un taglio perfetto e una caramella alla fragola.'},
  {l:'Piangi a ogni forbiciata',e:{f:-2},pers:{N:2},r:'Il taglio è un po\' storto. Le foto pure.'},
  {l:'Racconti tutta la tua vita al parrucchiere',e:{f:2},pers:{E:2},r:'Ora sa tutto della tua famiglia. Anche cose che non doveva sapere.'}]});
ev({id:'pic_palloncino',min:2,max:5,once:1,t:'Il palloncino',x:'Il palloncino a forma di cuore ti scappa di mano e sale verso il cielo.',c:[
  {l:'Piangi guardandolo salire',e:{f:-2},pers:{N:2},r:'Lo segui con gli occhi finché diventa un puntino.'},
  {l:'Lo saluti: va a trovare le nuvole',e:{f:1},pers:{O:2,N:-1},r:'Da oggi ogni nuvola a forma di cuore è la sua.'},
  {l:'Ne vuoi subito un altro',pers:{C:-1,E:1},r:'Ne arriva un altro. Stavolta te lo legano al polso.'}]});
ev({id:'pic_scivolo',min:2,max:4,once:1,t:'Lo scivolo grande',x:'Al parco c\'è lo scivolo dei bambini grandi.',c:[
  {l:'Scendi a testa in giù',p:.7,si:{e:{f:4},pers:{N:-2,E:1,C:-1},r:'Velocissim{o}! Lo rifai venti volte.'},no:{e:{f:-2,s:-1},pers:{N:1,C:-1},r:'Un bernoccolo in fronte. Ma lo rifai lo stesso.'}},
  {l:'Lo risali al contrario',pers:{O:1,C:-1},r:'Gli altri bambini protestano. Tu sei già in cima.'},
  {l:'Aspetti che scendano tutti, poi vai',pers:{C:1,A:1},r:'Turni rispettati, discesa perfetta.'}]});
ev({id:'pic_puntura',min:2,max:6,once:1,t:'L\'ape',x:'Un\'ape ti punge il dito mentre raccogli un fiore.',c:[
  {l:'Piangi fortissimo',e:{f:-2},pers:{N:1},r:'Ghiaccio, bacio sul dito e tanta solidarietà.'},
  {l:'Vuoi vedere dov\'è finita l\'ape',pers:{O:2,N:-1},r:'Il nonno ti spiega che è morta per difendersi. Ci pensi tutto il giorno.'},
  {l:'Da oggi scappi da tutto ciò che vola',pers:{N:2},r:'Anche dalle farfalle. Soprattutto dalle farfalle.'}]});

/* ---------- 3–6 anni ---------- */
ev({id:'pic_fattoria',min:3,max:6,once:1,t:'La fattoria',x:'Gita alla fattoria didattica con l\'asilo.',c:[
  {l:'Dai da mangiare alla capra',e:{f:3},pers:{N:-2,O:1},r:'La capra ti mangia anche un pezzo di grembiule. Esperienza indimenticabile.'},
  {l:'Stai lontan{o} dalle galline',pers:{N:2},r:'Le galline ti guardano con aria minacciosa. Hai ragione tu.'},
  {l:'Vuoi portare a casa un coniglio',pers:{A:1,O:1},r:'La risposta è no. La chiederai per altri tre anni.'}]});
ev({id:'pic_dentista',min:3,max:6,once:1,t:'Il dentista',x:'Prima visita dal dentista. Una poltrona che si alza e si abbassa.',c:[
  {l:'Apri la bocca senza paura',e:{s:1},pers:{N:-2,C:1},r:'Nessuna carie e un adesivo per il coraggio.'},
  {l:'Ti chiudi a riccio',pers:{N:2,E:-1},r:'Il dentista riesce a contarti i denti solo mentre sbadigli.'},
  {l:'Chiedi a cosa serve ogni attrezzo',e:{i:1},pers:{O:2},r:'Dieci minuti di domande. Il dentista ti propone di fare il dentista da grande.'}]});
ev({id:'pic_burattini',min:3,max:6,once:1,t:'I burattini',x:'In piazza c\'è il teatro dei burattini. Pulcinella non vede il lupo dietro di lui.',c:[
  {l:'Urli «È dietro di te!»',e:{f:3},pers:{E:2},r:'Lo urlano tutti i bambini, ma tu più forte. Pulcinella ti ringrazia.'},
  {l:'Ti nascondi dietro la mamma',pers:{N:1},r:'Il lupo era di legno, ma non si sa mai.'},
  {l:'Dopo lo spettacolo vuoi vedere come funzionano',e:{i:1},pers:{O:2,C:1},r:'Il burattinaio ti fa infilare la mano dentro Pulcinella. Magia svelata.'}]});
ev({id:'pic_cinema',min:3,max:6,once:1,t:'Il primo cinema',x:'Per la prima volta al cinema: lo schermo è enorme e il buio pure.',c:[
  {l:'Guardi tutto a bocca aperta',e:{f:3},pers:{O:2},r:'I popcorn restano lì, intatti. Non ti sei pers{o} niente.'},
  {l:'Ti addormenti a metà',pers:{N:-1},r:'Ti svegli per i titoli di coda e chiedi se è già finito.'},
  {l:'Fai domande ad alta voce tutto il tempo',pers:{E:2,A:-1},r:'Tutta la fila dietro ora conosce la trama. E te.'}]});
ev({id:'pic_mantello',min:3,max:6,once:1,t:'Il mantello',x:'Hai un mantello da supereroe. Il divano sembra altissimo.',c:[
  {l:'Ti lanci dal divano',p:.65,si:{e:{f:4},pers:{E:1,N:-2,C:-1},r:'Atterraggio perfetto sui cuscini. Sei invincibile.'},no:{e:{f:-1,s:-2},pers:{N:1,C:-1},r:'Atterraggio sul tavolino. Un bernoccolo e un mantello sequestrato.'}},
  {l:'Salvi i pupazzi da un incendio immaginario',e:{f:2},pers:{O:2,A:1},r:'Tutti salvi. Il pompiere più coraggioso del condominio.'},
  {l:'Lo porti all\'asilo tutti i giorni',pers:{O:1,C:1},r:'Per due mesi non te lo togli. Neanche per dormire.'}]});
ev({id:'pic_scarpe_grandi',min:3,max:6,once:1,t:'Le scarpe dei grandi',x:'Nell\'armadio ci sono le scarpe eleganti dei grandi e una cravatta.',c:[
  {l:'Sfili per casa con le scarpe col tacco',e:{f:3},pers:{E:2,O:1},r:'Una sfilata rumorosissima sul parquet. Applausi.'},
  {l:'Metti la cravatta e fai una riunione con i pupazzi',e:{f:2},pers:{O:2,C:1},r:'All\'ordine del giorno: biscotti per tutti. Approvato.'},
  {l:'Rimetti tutto a posto prima che ti vedano',pers:{C:2,A:-1},r:'Nessuno saprà mai niente. Quasi.'}]});
ev({id:'pic_orto',min:3,max:6,once:1,cond:()=>!!nonnoV(),t:'L\'orto del nonno',x:d=>{const n=nonnoV();return `${n?n.nome:'Il nonno'} ti porta nell'orto e ti dà un seme di zucchina.`},c:[
  {l:'Lo pianti e lo controlli ogni giorno',e:{i:1},pers:{C:2},r:'Dopo due settimane spunta una piantina. La chiami per nome.'},
  {l:'Strappi tutto quello che è verde',pers:{C:-1,O:1},r:'Anche l\'insalata del nonno. Ti perdona, dopo un po\'.'},
  {l:'Ti mangi le fragole ancora acerbe',pers:{C:-2,E:1},r:'Acide da piangere. Ne mangi un\'altra.'}]});
ev({id:'pic_gelato',min:3,max:6,once:1,t:'Il gelato caduto',x:'Al primo morso, la pallina di gelato cade per terra.',c:[
  {l:'Piangi disperat{o}',e:{f:-2},pers:{N:2},r:'Una tragedia. Il gelataio, commosso, te ne regala un altro.'},
  {l:'Ridi e dai la colpa al cono',e:{f:1},pers:{N:-2,O:1},r:'Il cono era chiaramente difettoso. Lo dici a tutti.'},
  {l:'Accetti un assaggio del gelato degli altri',pers:{A:1,E:1},r:'Un cucchiaino da tutti: alla fine hai assaggiato quattro gusti.'}]});
ev({id:'pic_perso_spiaggia',min:3,max:6,once:1,t:'Pers{o} in spiaggia',x:'Torni dal bagnasciuga e tutti gli ombrelloni sono uguali. Dove sono i tuoi?',c:[
  {l:'Chiedi aiuto al bagnino',pers:{C:2,E:1},r:'Il bagnino ti mette sulla torretta e ti chiama con il megafono. Momento di gloria.'},
  {l:'Piangi sotto un ombrellone a caso',e:{f:-2},pers:{N:2},r:'Una famiglia ti adotta per mezz\'ora, con focaccia. Poi arriva mamma, pallidissima.'},
  {l:'Continui a fare castelli finché ti trovano',pers:{N:-2,O:1},r:'Ti trovano tranquill{o}, a scavare. Loro sono quelli spaventati.'}]});
ev({id:'pic_nascondino',min:3,max:6,once:1,t:'Nascondino',x:'Si gioca a nascondino in tutta la casa dei nonni.',c:[
  {l:'Ti nascondi benissimo',pers:{C:1,E:-1},r:'Così bene che dopo un\'ora smettono di cercarti. Esci tu, offes{o}.'},
  {l:'Ridi e ti fai trovare subito',e:{f:2},pers:{E:2},r:'Nascondersi è bello, essere trovati ancora di più.'},
  {l:'Sbirci mentre conti',pers:{A:-1,C:-1},r:'Vinci tre volte di fila. Poi ti scoprono.'}]});
ev({id:'pic_fiaba',min:3,max:6,once:1,t:'La fiaba della buonanotte',x:'È ora della fiaba. Quella del lupo e dei tre porcellini, di nuovo.',c:[
  {l:'La vuoi uguale, guai a cambiare una parola',pers:{C:2,O:-1},r:'Se papà salta una riga, te ne accorgi subito.'},
  {l:'Inventi tu il finale',e:{i:1},pers:{O:3},r:'Nel tuo finale il lupo apre una pasticceria con i porcellini.'},
  {l:'Ti addormenti prima del lupo',pers:{N:-1},r:'Non saprai mai come va a finire. Va bene così.'}]});
ev({id:'pic_lucciole',min:3,max:7,once:1,t:'Le lucciole',x:'Sera d\'estate in campagna: il prato si riempie di lucciole.',c:[
  {l:'Le chiudi in un barattolo',pers:{O:1,A:-1},r:'Il nonno ti convince a liberarle prima di dormire. Si spengono e si riaccendono, in fila, nel buio.'},
  {l:'Le guardi in silenzio',e:{f:3},pers:{O:2,N:-1},r:'Uno dei ricordi più belli che avrai. Non lo sai ancora.'},
  {l:'Le rincorri per tutto il prato',e:{f:2,s:1},pers:{E:1},r:'Non ne prendi neanche una. Che importa.'}]});
ev({id:'pic_maestra',min:3,max:5,once:1,t:'L\'aiutante della maestra',x:'La maestra cerca qualcuno che la aiuti a distribuire i bicchieri della merenda.',c:[
  {l:'Alzi la mano per prim{o}',e:{f:2},pers:{C:2,E:1},r:'Distribuisci i bicchieri con aria importantissima.'},
  {l:'Ti vergogni e guardi per terra',pers:{E:-2,N:1},r:'Ci va un altro bambino. Tu lo guardi e un po\' ti dispiace.'},
  {l:'Ti offri e dai ordini a tutti',pers:{E:2,A:-1},r:'«Tu siediti! Tu aspetta!» Ti tolgono l\'incarico dopo due minuti.'}]});
ev({id:'pic_riposino',min:3,max:5,once:1,t:'Il riposino',x:'Dopo pranzo, all\'asilo, tutti sulle brandine per il riposino.',c:[
  {l:'Dormi come un sasso',pers:{N:-1},r:'Ti devono svegliare per la merenda.'},
  {l:'Chiacchieri sottovoce con il vicino',e:{f:2},pers:{E:2,C:-1},r:'Sottovoce si fa per dire. La maestra vi separa.'},
  {l:'Fai finta di dormire e conti le mattonelle',pers:{C:1,O:1},r:'Sono centoquarantadue. Lo sai solo tu.'}]});
ev({id:'pic_bimbo_nuovo',min:3,max:6,once:1,t:'Il bambino nuovo',x:'All\'asilo arriva un bambino che non parla ancora italiano.',c:[
  {l:'Gli insegni i nomi dei colori',e:{i:1},pers:{A:2,O:1},r:'In un mese dice «rosso», «blu» e il tuo nome. Siete amici.'},
  {l:'Giochi con lui senza bisogno di parole',e:{f:2},pers:{A:1,E:1},r:'Il pallone parla tutte le lingue.'},
  {l:'Stai con i tuoi soliti amici',pers:{A:-1,E:-1},r:'Il bambino nuovo gioca da solo per un po\'. Poi trova altri amici.'}]});
ev({id:'pic_befana',min:3,max:7,once:1,t:'La calza della Befana',x:'La mattina dell\'Epifania nella calza c\'è anche un pezzo di carbone. Di zucchero, ma pur sempre carbone.',c:[
  {l:'Prometti di essere più buon{o}',pers:{C:1,A:1},r:'La promessa dura fino all\'ora di pranzo. Ma era sincera.'},
  {l:'Te lo mangi subito',e:{f:2},pers:{C:-1},r:'Il carbone più dolce del mondo. La punizione non funziona.'},
  {l:'Chiedi come fa la Befana a entrare in casa',e:{i:1},pers:{O:2},r:'Le risposte dei grandi non ti convincono. Indaghi per settimane.'}]});
ev({id:'pic_uovo',min:3,max:7,once:1,t:'L\'uovo di Pasqua',x:'A Pasqua ti regalano un uovo di cioccolato grande come la tua testa.',c:[
  {l:'Lo rompi subito per la sorpresa',e:{f:2},pers:{O:1,C:-1},r:'Dentro c\'è un portachiavi a forma di pulcino. Delusione, poi cioccolato.'},
  {l:'Lo dividi con tutti',pers:{A:2},r:'Un pezzo a ognuno, anche al cane. No, al cane no.'},
  {l:'Lo conservi intero per una settimana',pers:{C:3},r:'Lo guardi ogni giorno. Quando lo apri, il cioccolato è ancora più buono.'}]});
ev({id:'pic_rotelle',min:3,max:5,once:1,t:'Le rotelle',x:'Hai la tua prima bicicletta, con le rotelle.',c:[
  {l:'Pedali più forte che puoi',e:{f:3,s:1},pers:{E:1},r:'Il cortile è la tua pista. Le rotelle fanno un rumore terribile.'},
  {l:'Chiedi di togliere una rotella',pers:{N:-2,O:1},r:'Un po\' storto, ma vai. Il papà corre dietro di te.'},
  {l:'Preferisci il monopattino',pers:{O:1},r:'La bici resta in garage. Il monopattino diventa un\'estensione del tuo piede.'}]});
ev({id:'pic_sabbia',min:3,max:5,once:1,t:'La sabbia negli occhi',x:'Al parco un bambino ti tira una manciata di sabbia.',c:[
  {l:'Gliela tiri anche tu',pers:{A:-2},r:'Guerra di sabbia. Finisce con due bambini in lacrime e due mamme in discussione.'},
  {l:'Corri a piangere dai grandi',e:{f:-1},pers:{N:1},r:'Ti lavano gli occhi con l\'acqua della fontanella.'},
  {l:'Gli dici «Non si fa!»',pers:{C:1,E:1},r:'Ti guarda sorpreso e si scusa. Funziona più di quanto pensassi.'}]});
ev({id:'pic_macchina',min:3,max:6,once:1,t:'Il secchio e la spugna',x:'Papà lava la macchina in cortile e ti dà una spugna.',c:[
  {l:'Lavi con impegno ogni ruota',pers:{C:2},r:'Le ruote non sono mai state così pulite. Il resto dell\'auto sì.'},
  {l:'Lavi anche il cane',e:{f:2},pers:{O:2,C:-1},r:'Il cane non era d\'accordo. Ora è pulitissimo e offeso.'},
  {l:'Fai la doccia a papà con la canna',e:{f:3},pers:{E:2,A:-1},r:'Guerra d\'acqua in cortile. La vincete tutti e due.'}]});
ev({id:'pic_dottore',min:3,max:6,once:1,t:'Il dottore dei pupazzi',x:'Hai una valigetta da dottore e un sacco di pazienti di pezza.',c:[
  {l:'Curi tutti con i cerotti veri',pers:{A:2,C:1},r:'Ventidue cerotti su undici pupazzi. La scatola è finita.'},
  {l:'Fai le iniezioni a tutti',pers:{O:1,A:-1},r:'I pupazzi ti temono. Il gatto si nasconde.'},
  {l:'Apri il reparto chirurgia',e:{i:1},pers:{O:2},r:'L\'orsetto ora ha il pancione cucito con il filo da cucina. Sta benissimo.'}]});
ev({id:'pic_trenino',min:3,max:6,once:1,t:'Il trenino',x:'Ti regalano un trenino di legno con i binari da montare.',c:[
  {l:'Costruisci un percorso lunghissimo',e:{i:1},pers:{C:2,O:1},r:'Dalla cameretta al bagno, passando sotto il divano.'},
  {l:'Lo fai deragliare apposta',e:{f:2},pers:{O:1,C:-1},r:'Gli incidenti sono la parte più divertente.'},
  {l:'Lo fai guidare anche al tuo amico',pers:{A:2},r:'Uno guida, l\'altro fa il capostazione. Poi vi scambiate.'}]});
ev({id:'pic_disegno_nonni',min:3,max:6,once:1,cond:()=>!!nonnoV(),t:'Un disegno per i nonni',x:'Domani arrivano i nonni. Prepari una sorpresa.',c:[
  {l:'Un disegno con tutta la famiglia',pers:{A:2},r:'Il nonno lo appende in cucina. Ci resterà per vent\'anni.'},
  {l:'Uno spettacolo di canzoni',e:{f:2},pers:{E:2},r:'Tre canzoni, quattro inchini e un bis richiesto dalla nonna.'},
  {l:'Una torta di fango in giardino',pers:{O:2,C:-1},r:'Il nonno fa finta di assaggiarla. Che attore.'}]});
ev({id:'pic_castagne',min:3,max:7,once:1,t:'Le castagne',x:'Domenica in collina a raccogliere castagne.',c:[
  {l:'Ne raccogli più di tutti',e:{s:1},pers:{C:1,E:1},r:'Un cestino pieno. La sera, castagne arrosto per tutti.'},
  {l:'Ti pungi con un riccio',e:{f:-1},pers:{N:1},r:'Le castagne sono belle, i ricci no. Lezione imparata.'},
  {l:'Le regali una per una a chi incontri',pers:{A:2},r:'Torni a casa con il cestino vuoto e il cuore pieno.'}]});
ev({id:'pic_presepe',min:3,max:7,once:1,t:'Il presepe',x:'In casa si fa il presepe e quest\'anno puoi aiutare.',c:[
  {l:'Metti i dinosauri nel presepe',e:{f:2},pers:{O:3,C:-1},r:'Un tirannosauro veglia sulla capanna. Nessuno ha il coraggio di toglierlo.'},
  {l:'Sistemi le pecore in fila perfetta',pers:{C:2},r:'Pecore in fila per tre, a distanza regolare. Un presepe militare.'},
  {l:'Ogni giorno avvicini un po\' i Re Magi',pers:{C:1,O:1},r:'Arrivano alla capanna giusto il 6 gennaio. Precisione assoluta.'}]});
ev({id:'pic_luna_park',min:3,max:6,once:1,t:'Il luna park',x:'Le giostre sono arrivate in paese.',c:[
  {l:'Sali sulla giostra più veloce per piccoli',e:{f:4},pers:{N:-2,E:1},r:'Giri, urli e chiedi di rifarla subito.'},
  {l:'Vuoi solo lo zucchero filato',e:{f:2},pers:{C:-1,E:1},r:'Appiccicoso fino alle sopracciglia. Felicità pura.'},
  {l:'Piangi sui cavalli del carosello',e:{f:-1},pers:{N:2},r:'I cavalli andavano piano, ma erano tanti.'}]});
ev({id:'pic_aereo',min:3,max:6,once:1,cond:()=>S.classe!=='umile',t:'Il primo aereo',x:'Si parte per le vacanze in aereo. Dal finestrino si vedono le nuvole.',c:[
  {l:'Guardi le nuvole dall\'alto',e:{f:3},pers:{O:2},r:'Sembrano panna. Chiedi se si può scendere a toccarle.'},
  {l:'Ti fanno male le orecchie',e:{f:-1},pers:{N:1},r:'Mamma ti dà una caramella da succhiare. Funziona a metà.'},
  {l:'Fai amicizia con l\'assistente di volo',e:{f:2},pers:{E:2},r:'Ti regalano le ali di plastica da pilota. Le porti per un mese.'}]});
ev({id:'pic_cantina',min:4,max:6,once:1,t:'La cantina',x:'Bisogna scendere in cantina a prendere una bottiglia d\'acqua. La luce è fioca.',c:[
  {l:'Ci scendi con la torcia',e:{f:2},pers:{N:-2,O:1},r:'Trovi l\'acqua, un vecchio triciclo e il coraggio.'},
  {l:'Non ci scendi neanche mort{o}',pers:{N:2},r:'In cantina vivono i mostri. È scientifico.'},
  {l:'Ci vai solo se viene qualcuno con te',pers:{E:1,A:1},r:'Mano nella mano, è tutta un\'altra cantina.'}]});
ev({id:'pic_festa_mamma',min:4,max:6,once:1,t:'La festa della mamma',x:'All\'asilo si prepara un regalo per la festa della mamma.',c:[
  {l:'Un lavoretto con le tue mani',pers:{A:2,C:1},r:'Una cornice di pasta colorata. Mamma la terrà per sempre.'},
  {l:'Raccogli i fiori del giardino del vicino',pers:{A:1,C:-1},r:'Un mazzo bellissimo. Il vicino un po\' meno felice.'},
  {l:'Le prepari la colazione da sol{o}',pers:{A:1,O:1},r:'Latte ovunque, pane un po\' bruciato. La colazione migliore della sua vita.'}]});
ev({id:'pic_contare',min:4,max:6,once:1,t:'Fino a cento',x:'La sfida della settimana: contare fino a cento.',c:[
  {l:'Ci arrivi, e vuoi andare a mille',e:{i:2},pers:{C:2,O:1},r:'A trecentoquaranta ti fermano per la cena.'},
  {l:'Ti fermi a ventinove e ricominci',pers:{N:1},r:'Il trenta è un mistero. Lo scoprirai domani.'},
  {l:'Conti in inglese, come nei cartoni',e:{i:1},pers:{O:2},r:'Fino a «twenty», poi vai a fantasia.'}]});
ev({id:'pic_punti',min:3,max:6,once:1,t:'I punti',x:'Cadi dalla panchina e ti fai un taglio sul mento. Si va al pronto soccorso.',c:[
  {l:'Stringi i denti',e:{s:-1},pers:{N:-2,C:1},r:'Tre punti senza una lacrima. Il dottore ti dà un diploma di coraggio.'},
  {l:'Urli finché non ti promettono un gelato',e:{s:-1},pers:{N:1,E:1},r:'Tre punti e un gelato. Scambio equo.'},
  {l:'Chiedi di vedere i punti allo specchio',e:{s:-1},pers:{O:2,N:-1},r:'Sembri un pirata. Ne vai fier{o}.'}]});
ev({id:'pic_carrello',min:3,max:6,once:1,t:'Il carrello',x:'Al supermercato ti fanno spingere il carrello.',c:[
  {l:'Ci metti di nascosto i biscotti',pers:{C:-1,O:1},r:'Li scoprono alla cassa. Uno dei due pacchi passa lo stesso.'},
  {l:'Lo spingi con attenzione',pers:{C:2},r:'Neanche una caviglia investita. Promozione a «aiutante della spesa».'},
  {l:'Fai un capriccio per le caramelle alla cassa',p:.3,si:{e:{f:2},pers:{A:-1,N:1},r:'Funziona. Le caramelle alla cassa sono messe lì apposta.'},no:{e:{f:-2},pers:{N:1},r:'Niente caramelle e una lunga predica in macchina.'}}]});
ev({id:'pic_chiesa',min:3,max:6,once:1,t:'A messa',x:'La nonna ti porta a messa la domenica mattina.',c:[
  {l:'Conti le candele',pers:{C:1},r:'Sono trentasei. La messa dura un\'ora: le conti dodici volte.'},
  {l:'Canti fortissimo, stonat{o}',e:{f:2},pers:{E:2},r:'Il parroco sorride. Le signore della prima fila un po\' meno.'},
  {l:'Fai mille domande sottovoce',e:{i:1},pers:{O:2},r:'La nonna risponde a tutte, con pazienza. Anche a quelle difficili.'}]});
ev({id:'pic_piscina',min:3,max:5,once:1,t:'In piscina',x:'Primo giorno al corso di acquaticità per bambini.',c:[
  {l:'Ti tuffi senza pensarci',e:{f:3,s:1},pers:{N:-2,E:1},r:'Riemergi sputacchiando e ridendo. L\'istruttrice ti chiama «pesciolino».'},
  {l:'Resti attaccat{o} al bordo',pers:{N:2},r:'Ci vogliono quattro lezioni per mollare il bordo. Alla quinta galleggi.'},
  {l:'Galleggi a stella marina',e:{f:2},pers:{O:1,N:-1},r:'Guardi il soffitto e ti senti leggerissim{o}.'}]});
ev({id:'pic_fratello_grande',min:3,max:6,once:1,cond:()=>vivi(['Fratello']).some(f=>f.eta>S.eta),t:'Come i grandi',x:d=>{const f=vivi(['Fratello']).filter(x=>x.eta>S.eta)[0];return `${f.nome} fa i compiti al tavolo della cucina. Tu vuoi fare i compiti come ${gp(f,'lui','lei')}.`},c:[
  {l:'Scarabocchi su un quaderno «da grande»',e:{i:1},pers:{C:1,O:1},r:'Pagine piene di segni misteriosi. Sono compiti importantissimi.'},
  {l:'Disturbi finché non ti fanno giocare',pers:{E:1,A:-1},r:'Vieni cacciat{o} dalla cucina due volte.'},
  {l:'Guardi in silenzio, affascinat{o}',pers:{O:1,E:-1},r:'Impari tre lettere solo guardando.'}]});
ev({id:'pic_cagnolino',min:2,max:5,once:1,cond:()=>!haAnimale('Cane'),t:'Il cagnolino del parco',x:'Al parco un cagnolino ti viene incontro scodinzolando.',c:[
  {l:'Lo accarezzi piano',e:{f:3},pers:{A:1,N:-1},r:'Ti lecca la faccia. Da oggi chiedi un cane a ogni compleanno.'},
  {l:'Scappi dietro la panchina',pers:{N:2},r:'Il cagnolino era alto come le tue scarpe, ma non si sa mai.'},
  {l:'Gli tiri un bastoncino',e:{f:2},pers:{E:1,O:1},r:'Lo riporta. Lo tiri di nuovo. Andate avanti per mezz\'ora.'}]});
