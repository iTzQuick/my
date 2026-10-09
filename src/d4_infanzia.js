/* ================= INFANZIA: GLI EVENTI CHE FORMANO IL CARATTERE =================
 Ogni scelta può avere pers:{O,C,E,A,N} — piccoli spostamenti del carattere, più forti da piccoli. */
const famG=()=>S.relazioni.filter(p=>p.vivo&&['Madre','Padre','Patrigno'].includes(p.ruolo));
const nonnoV=()=>vivi(['Nonno'])[0];
const fratV=()=>vivi(['Fratello'])[0];

/* ---------- Primi anni (1–2) ---------- */
ev({id:'inf_nanna',min:1,max:2,once:1,w:1.4,t:'La nanna',x:'Sono le tre di notte e sei sveglissim{o}.',c:[
  {l:'Piangi finché non arriva qualcuno',e:{f:2},pers:{E:2,N:1},r:'Mamma arriva, ti prende in braccio e ti addormenti sulla sua spalla.'},
  {l:'Canticchi da sol{o} nel lettino',e:{f:1},pers:{O:2,N:-1},r:'Inventi una canzone di tre note e ti riaddormenti.'},
  {l:'Ti arrampichi fuori dal lettino',e:{s:-1},pers:{O:2,C:-2},r:'Ti trovano sedut{o} sul tappeto a mangiare un calzino.'}]});
ev({id:'inf_primopasso',min:1,max:2,once:1,w:1.2,t:'In piedi',x:'Ti aggrappi al divano. Le gambe tremano.',c:[
  {l:'Molla la presa e cammina',p:.6,si:{e:{f:4},pers:{N:-2,E:1},r:'Tre passi e un applauso fortissimo.'},no:{e:{f:-1},pers:{N:1},r:'Atterri sul pannolino. Si riprova domani.'}},
  {l:'Meglio gattonare ancora un po\'',e:{f:1},pers:{C:1,N:1},r:'Gattoni velocissim{o}: perché complicarsi la vita?'}]});
ev({id:'inf_giocattolo',min:1,max:3,once:1,t:'Il giocattolo nuovo',x:'Ti regalano un cubo pieno di forme da infilare nei buchi giusti.',c:[
  {l:'Provi tutte le forme finché non entrano',e:{i:2},pers:{C:2},r:'Ci metti un pomeriggio, ma il triangolo alla fine entra.'},
  {l:'Lanci le forme per la stanza',e:{f:2},pers:{C:-1,E:1},r:'Il cubo diventa una batteria. I vicini protestano.'},
  {l:'Preferisci la scatola',e:{f:2},pers:{O:2},r:'La scatola diventa una casa, una nave e un cappello.'}]});
ev({id:'inf_estranei',min:1,max:2,once:1,t:'Una faccia nuova',x:'Un\'amica di mamma vuole prenderti in braccio.',c:[
  {l:'Sorridi e le tiri gli orecchini',e:{f:2},pers:{E:2,A:1},r:'«Che bimb{o} socievole!»'},
  {l:'Nascondi la faccia nel collo di mamma',pers:{E:-2,N:1},r:'Ci vuole mezz\'ora prima che tu la guardi.'},
  {l:'La fissi seri{o} senza muovere un muscolo',pers:{N:-1,O:1},r:'Un esame lungo e attento. Promossa, forse.'}]});
ev({id:'inf_bagnetto',min:1,max:3,once:1,t:'Il bagnetto',x:'È ora del bagnetto.',c:[
  {l:'Schizzi acqua dappertutto',e:{f:3},pers:{E:1,C:-1},r:'Il bagno è allagato, tu sei felicissim{o}.'},
  {l:'Ti metti a piangere',e:{f:-1},pers:{N:2},r:'L\'acqua è sempre troppo calda o troppo fredda.'},
  {l:'Giochi in silenzio con la paperella',e:{f:1},pers:{C:1,O:1},r:'Passi venti minuti a farla tuffare.'}]});
ev({id:'inf_parola',min:1,max:2,once:1,t:'Una parola nuova',x:'A cena tutti parlano e tu vuoi dire la tua.',c:[
  {l:'Ripeti l\'ultima parola che hai sentito',e:{i:1},pers:{O:1,E:1},r:'Purtroppo era una parolaccia di papà.'},
  {l:'Indichi le cose e aspetti che te le nominino',e:{i:2},pers:{C:1},r:'Impari «acqua», «luce» e «gatto» in una sera.'},
  {l:'Batti il cucchiaio sul tavolo',e:{f:1},pers:{E:1,A:-1},r:'Tutti si girano. Ottenuta l\'attenzione.'}]});

/* ---------- Prima infanzia (2–5) ---------- */
ev({id:'inf_nido',min:2,max:3,once:1,w:1.2,t:'Il primo giorno al nido',x:'Mamma ti lascia al nido e si avvia verso la porta.',c:[
  {l:'Ti aggrappi alla sua gamba',e:{f:-2},pers:{N:2,E:-1},r:'Ci vogliono due settimane prima che tu la lasci andare.'},
  {l:'Corri subito dagli altri bambini',e:{f:3},pers:{E:2,N:-1},r:'Mamma ci rimane quasi male: non ti sei nemmeno girat{o}.'},
  {l:'Osservi tutto da un angolo',pers:{O:1,E:-1},r:'A fine giornata sai il nome di tutti, anche se non hai parlato con nessuno.'}]});
ev({id:'inf_perche',min:3,max:5,once:1,t:'Perché?',x:'Hai scoperto la parola «perché». Papà ti spiega che il cielo è blu per via della luce.',c:[
  {l:'«Perché?»',e:{i:2},pers:{O:3},r:'Venti «perché» dopo, papà ti compra un libro sulla luce.'},
  {l:'Annuisci e torni a giocare',pers:{O:-1,C:1},r:'Il cielo è blu, va bene così.'},
  {l:'Inventi tu una spiegazione',e:{f:2},pers:{O:2,E:1},r:'Secondo te il cielo è blu perché l\'hanno dipinto le nuvole.'}]});
ev({id:'inf_vaso',min:3,max:6,once:1,t:'Il vaso',x:'Giocando a palla in salotto rompi il vaso preferito della nonna.',c:[
  {l:'Lo dici subito',e:{k:3},pers:{C:2,A:1},r:'Ti sgridano, ma ti fanno anche i complimenti per la sincerità.'},
  {l:'Dai la colpa al gatto',p:.5,si:{e:{f:1,k:-2},pers:{A:-2,C:-1},r:'Il gatto viene punito. Ti senti un po\' in colpa.'},no:{e:{f:-3,k:-2},pers:{N:1},r:'Il gatto era fuori. Doppia punizione.'}},
  {l:'Nascondi i cocci sotto il divano',p:.35,si:{pers:{C:-2,N:1},r:'Per ora nessuno se ne accorge. Per ora.'},no:{e:{f:-3},pers:{N:2},r:'Li trovano dopo dieci minuti. Niente cartoni per una settimana.'}}]});
ev({id:'inf_altalena',min:3,max:6,once:1,t:'L\'altalena',x:'Al parco c\'è una sola altalena e un bambino ci sta sopra da un quarto d\'ora.',c:[
  {l:'Aspetti il tuo turno',pers:{A:2,C:1},r:'Alla fine tocca a te, e ti spingono altissim{o}.'},
  {l:'Gli chiedi di fare a turno',p:.65,si:{e:{f:2},pers:{E:2,A:1},r:'Fate a turno e diventate amici per un pomeriggio.'},no:{e:{f:-1},pers:{E:1},r:'Ti fa la linguaccia e resta lì.'}},
  {l:'Lo spingi giù',e:{k:-3},pers:{A:-3,C:-1},r:'Piange. Sua madre ti guarda malissimo. Tua madre anche.'},
  {l:'Vai sullo scivolo',e:{f:1},pers:{O:1},r:'Lo scivolo è più divertente, in fondo.'}]});
ev({id:'inf_disegno',min:3,max:6,once:1,t:'Il disegno della famiglia',x:'All\'asilo la maestra chiede di disegnare la tua famiglia.',c:[
  {l:'Disegni tutti, anche il pesce rosso',e:{arte:2},pers:{C:1,A:1},r:'Il disegno finisce attaccato al frigorifero.'},
  {l:'Disegni la famiglia come draghi',e:{arte:3,f:2},pers:{O:3},r:'La maestra chiama i tuoi genitori, un po\' preoccupata e un po\' divertita.'},
  {l:'Non ti va di disegnare',pers:{C:-1,E:-1},r:'Fai un cerchio e lo chiami «la casa».'}]});
ev({id:'inf_verdura',min:3,max:6,once:1,t:'Le zucchine',x:'Nel piatto ci sono le zucchine. Le odi.',c:[
  {l:'Le mangi lo stesso',e:{s:1},pers:{C:2,A:1},r:'Le finisci con una smorfia. Ti meriti il gelato.'},
  {l:'Le nascondi sotto il tovagliolo',p:.4,si:{e:{f:1},pers:{C:-1,O:1},r:'Missione riuscita.'},no:{e:{f:-2},pers:{N:1},r:'Ti scoprono. Zucchine anche a cena.'}},
  {l:'Fai sciopero della fame',e:{f:-1},pers:{A:-2,C:1},r:'Resisti fino alle cinque. Poi crolli sulla merenda.'}]});
ev({id:'inf_supermercato',min:3,max:6,once:1,t:'Perso al supermercato',x:'Ti giri e i tuoi non ci sono più. Intorno solo scaffali altissimi.',c:[
  {l:'Chiedi aiuto a una commessa',e:{f:1},pers:{E:2,N:-1},r:'Ti chiamano all\'altoparlante. Ti senti famos{o}.'},
  {l:'Resti ferm{o} dove sei e aspetti',pers:{C:2},r:'Come ti avevano insegnato. Ti ritrovano in due minuti.'},
  {l:'Scoppi a piangere',e:{f:-3},pers:{N:3},r:'Per mesi al supermercato terrai la mano a tutti.'},
  {l:'Ne approfitti per esplorare',e:{f:2},pers:{O:2,C:-2},r:'Ti trovano nel reparto giocattoli con tre pacchi di caramelle aperti.'}]});
ev({id:'inf_amico_immaginario',min:3,max:6,once:1,t:'L\'amico invisibile',x:'Da qualche giorno parli con un amico che vedi solo tu. Si chiama Bubù.',c:[
  {l:'Lo presenti a tutti',e:{f:2},pers:{O:2,E:1},r:'A tavola gli mettono anche il piatto.'},
  {l:'Lo tieni segreto',pers:{O:2,E:-2},r:'Bubù sa tutto di te. Nessun altro lo sa.'},
  {l:'Lo saluti per sempre',pers:{C:1,O:-1},r:'Bubù se ne va in vacanza e non torna più.'}]});
ev({id:'inf_bugia',min:4,max:7,once:1,t:'La prima bugia',x:'Hai mangiato tutti i biscotti. La mamma chiede chi è stato.',c:[
  {l:'Confessi',e:{k:2},pers:{A:1,C:2},r:'Ti tolgono i biscotti per una settimana, ma ti abbracciano.'},
  {l:'Dici che è stato tuo fratello',cond:()=>!!fratV(),fx:()=>{const f=fratV();f.rapporto=clamp(f.rapporto-6);ricorda(f,'Gli hai dato la colpa dei biscotti'.replace('Gli',gp(f,'Gli','Le')));cambiaPers('A',-2);return [`${f.nome} viene sgridat${gp(f,'o','a')} al posto tuo. Non te lo perdonerà presto.`,'b']}},
  {l:'Dici che è stato un ladro',e:{f:1},pers:{O:2,C:-1},r:'Racconti di un ladro in pigiama. Nessuno ci crede, ma ridono tutti.'}]});
ev({id:'inf_formica',min:3,max:7,once:1,t:'Le formiche',x:'In giardino c\'è una fila lunghissima di formiche.',c:[
  {l:'Le segui per vedere dove vanno',e:{i:2},pers:{O:2,C:1},r:'Trovi il formicaio. Ci passi tutto il pomeriggio.'},
  {l:'Le schiacci',e:{k:-1},pers:{A:-2},r:'Una vittoria facile e un po\' triste.'},
  {l:'Porti loro le briciole',e:{f:2,k:1},pers:{A:2},r:'Diventi l\'amic{o} delle formiche.'}]});
ev({id:'inf_temporale',min:3,max:6,once:1,t:'Il temporale',x:'Un tuono fortissimo fa tremare i vetri.',c:[
  {l:'Corri nel lettone',fx:()=>{famG().forEach(p=>p.rapporto=clamp(p.rapporto+3));cambiaPers('N',1);cambiaPers('A',1);return ['Dormi in mezzo ai tuoi. Il temporale non fa più paura.','g']}},
  {l:'Guardi i fulmini dalla finestra',e:{f:2},pers:{O:2,N:-2},r:'Conti i secondi tra lampo e tuono, come ti ha insegnato il nonno.'},
  {l:'Ti nascondi sotto le coperte',e:{f:-1},pers:{N:2,E:-1},r:'Resti lì sotto finché non smette.'}]});
ev({id:'inf_regalo_amico',min:4,max:7,once:1,t:'Il compleanno di Luca',x:'Alla festa di un compagno, lui scarta il tuo regalo: è lo stesso gioco che volevi tu.',c:[
  {l:'Sei content{o} per lui',e:{k:2},pers:{A:2},r:'Ci giocate insieme tutto il pomeriggio.'},
  {l:'Chiedi se te lo presta',p:.6,si:{e:{f:2},pers:{E:1},r:'Te lo presta per una settimana.'},no:{e:{f:-2},pers:{N:1},r:'«È mio!» Ti va di traverso la torta.'}},
  {l:'Fai il muso tutta la festa',e:{f:-2},pers:{A:-2,N:1},r:'Torni a casa senza aver mangiato la torta.'}]});
ev({id:'inf_dottore',min:2,max:6,once:1,t:'Il vaccino',x:'Il pediatra prepara la puntura.',c:[
  {l:'Guardi l\'ago e non fiati',e:{f:1},pers:{N:-2,C:1},r:'«Che coraggio!» Ti regalano un adesivo.'},
  {l:'Urli prima ancora che ti tocchi',e:{f:-1},pers:{N:2,E:1},r:'Ti sentono fino in sala d\'attesa.'},
  {l:'Chiedi a cosa serve',e:{i:1},pers:{O:2},r:'Il pediatra ti spiega i microbi. Diventa il tuo argomento preferito.'}]});
ev({id:'inf_recita_asilo',min:4,max:6,once:1,t:'La recita dell\'asilo',x:'Ti danno la parte dell\'albero. Ha una sola battuta: «fruscio».',c:[
  {l:'Fai l\'albero più bello della storia',e:{f:2,arte:1},pers:{C:2},r:'Frusci con un\'intensità commovente.'},
  {l:'Improvvisi un balletto',e:{f:3},pers:{E:3,O:1},r:'Ruba la scena. Il video gira per anni nei gruppi di famiglia.'},
  {l:'Ti blocchi sul palco',e:{f:-2},pers:{N:2,E:-2},r:'La maestra fruscia al posto tuo.'}]});
ev({id:'inf_regole',min:3,max:6,once:1,t:'Il gioco di gruppo',x:'All\'asilo si gioca a «Un, due, tre, stella!» e qualcuno bara.',c:[
  {l:'Lo dici alla maestra',pers:{C:2,A:-1},r:'Il furbetto viene escluso. Qualcuno ti chiama spia.'},
  {l:'Bari anche tu',e:{f:1},pers:{C:-2,A:-1},r:'Vinci, ma non è la stessa cosa.'},
  {l:'Proponi di ricominciare da capo',pers:{A:2,E:1},r:'Tutti d\'accordo. Diventi quell{o} che decide le regole.'}]});
ev({id:'inf_cucina',min:4,max:7,once:1,t:'In cucina con la nonna',cond:()=>!!nonnoV(),x:'La nonna prepara la pasta fatta in casa e ti mette un grembiule.',c:[
  {l:'Impari a impastare',e:{cucina:4,f:2},fx:()=>{const n=nonnoV();if(n)n.rapporto=clamp(n.rapporto+5);cambiaPers('C',1);return ['Le tue tagliatelle sono storte ma buonissime.','g']}},
  {l:'Ti sporchi di farina dalla testa ai piedi',e:{f:3},pers:{O:1,C:-1},r:'Sembri un fantasma. La nonna ride fino alle lacrime.'},
  {l:'Rubi la pasta cruda',e:{f:1},pers:{C:-1},r:'Mal di pancia garantito.'}]});
ev({id:'inf_fratello_nuovo',min:2,max:6,once:1,t:'Il nuovo arrivato',cond:()=>vivi(['Fratello']).some(f=>f.eta<S.eta),x:'In casa c\'è un fratellino o una sorellina, e tutti guardano solo lui.',c:[
  {l:'Lo aiuti a dargli il biberon',e:{k:2},pers:{A:2,C:1},r:'Ti senti grande e importante.'},
  {l:'Torni a fare il neonato anche tu',e:{f:-1},pers:{N:2},r:'Vuoi il ciuccio, il passeggino e le coccole.'},
  {l:'Lo ignori e giochi per conto tuo',pers:{E:-1,O:1},r:'Ti costruisci un mondo tutto tuo con i Lego.'}]});
ev({id:'inf_animale_morto',min:4,max:8,once:1,t:'Il pesce rosso',x:'Una mattina il pesce rosso galleggia a pancia in su.',c:[
  {l:'Organizzi un funerale',e:{f:-2},pers:{A:2,O:1},r:'Discorso, fiori e una croce di stecchini in giardino.'},
  {l:'Chiedi dove vanno i pesci',e:{i:1},pers:{O:2},r:'Ne nasce una lunga conversazione sulla vita e la morte.'},
  {l:'Chiedi un cane al posto del pesce',e:{f:1},pers:{A:-1,E:1},r:'Ci provi. Per ora è no.'}]});
ev({id:'inf_tv',min:3,max:6,once:1,t:'I cartoni',x:'Hai il telecomando in mano e nessuno ti guarda.',c:[
  {l:'Guardi cartoni per tre ore',e:{f:2},pers:{C:-2},r:'Ti trovano con gli occhi a forma di schermo.'},
  {l:'Spegni e vai a costruire una pista per le macchinine',e:{i:1},pers:{O:2,C:1},r:'La pista attraversa tutta la casa.'},
  {l:'Chiami qualcuno a guardarli con te',e:{f:2},pers:{E:2,A:1},r:'Divano, coperta e un pacco di biscotti.'}]});
ev({id:'inf_mare_onde',min:4,max:7,once:1,t:'Le onde',x:'Al mare le onde sono alte e gli altri bambini fanno a gara a chi va più lontano.',c:[
  {l:'Vai più lontano di tutti',p:.7,si:{e:{f:3},pers:{N:-2,E:1},r:'Vinci la gara e ti senti invincibile.'},no:{e:{f:-3,s:-2},pers:{N:2},r:'Un\'onda ti travolge. Bevi mezzo mare.'}},
  {l:'Resti dove si tocca',pers:{C:2},r:'Fai un castello di sabbia enorme, al sicuro.'},
  {l:'Chiedi a qualcuno di insegnarti a nuotare',e:{sport:2},pers:{O:1,C:1},r:'Prima lezione di nuoto. Bevi solo un po\' di mare.'}]});
ev({id:'inf_vicina',min:4,max:7,once:1,t:'La signora del piano di sotto',x:'La vicina anziana vive da sola e ti saluta sempre dal balcone.',c:[
  {l:'Le porti un disegno',e:{k:3,f:2},pers:{A:2,E:1},r:'Lo appende in cucina. Da quel giorno ti regala caramelle alla menta.'},
  {l:'Ti nascondi dietro la mamma',pers:{E:-2},r:'Lei sorride lo stesso.'},
  {l:'Le fai le boccacce',e:{k:-2},pers:{A:-2,E:1},r:'Ti sgridano. La signora fa finta di non aver visto.'}]});
ev({id:'inf_lettura',min:4,max:6,once:1,t:'Le lettere',x:'Scopri che le lettere sui cartelli formano parole.',c:[
  {l:'Le leggi tutte, una per una',e:{i:3},pers:{O:2,C:1},r:'In macchina leggi ad alta voce ogni insegna. Tutti impazziscono.'},
  {l:'Ti basta che te le leggano',pers:{O:-1},r:'Hai tempo per imparare.'},
  {l:'Inventi un alfabeto segreto',e:{i:2,f:2},pers:{O:3,E:-1},r:'Lo capisci solo tu, e va benissimo così.'}]});
ev({id:'inf_capriccio',min:2,max:5,once:1,t:'Il capriccio',x:'Al negozio vuoi un pupazzo e la risposta è no.',c:[
  {l:'Ti butti per terra e urli',p:.25,si:{e:{f:2},pers:{A:-2,C:-1},r:'Funziona. Pessimo precedente.'},no:{e:{f:-2},pers:{N:1,A:-1},r:'Torni a casa senza pupazzo e con una brutta figura.'}},
  {l:'Proponi un patto: fai il bravo per una settimana',p:.6,si:{e:{f:3},pers:{C:2},r:'Una settimana da sant{o}. Il pupazzo è tuo.'},no:{pers:{C:1},r:'«Vedremo.» Che vuol dire no.'}},
  {l:'Lo saluti e te ne vai',pers:{N:-1,C:1},r:'Ci pensi tutta la sera, ma non dici niente.'}]});
ev({id:'inf_nonno_lavoro',min:4,max:8,once:1,t:'Il laboratorio del nonno',cond:()=>vivi(['Nonno']).some(n=>n.sesso==='M'),x:'Il nonno ti porta nella sua officina piena di attrezzi.',c:[
  {l:'Lo aiuti ad aggiustare una sedia',fx:()=>{const n=vivi(['Nonno']).find(x=>x.sesso==='M');if(n)n.rapporto=clamp(n.rapporto+6);cambiaPers('C',2);S.abil.tech=clamp(S.abil.tech+2);return ['La sedia traballa ancora, ma il nonno dice che è perfetta.','g']}},
  {l:'Smonti una radio per vedere cosa c\'è dentro',e:{tech:3,i:1},pers:{O:3,C:-1},r:'Non torna più come prima, ma ora sai cos\'è un transistor.'},
  {l:'Ti annoi e vuoi tornare a casa',pers:{O:-1,E:1},r:'Il nonno ci resta un po\' male.'}]});
ev({id:'inf_maschere',min:4,max:9,once:1,t:'Carnevale',x:'Per Carnevale puoi scegliere il costume.',c:[
  {l:'Il supereroe del momento',e:{f:2},pers:{E:1},r:'In classe siete in cinque vestiti uguali.'},
  {l:'Un costume inventato da te',e:{arte:2,f:3},pers:{O:3},r:'Sei un «pomodoro astronauta». Nessuno capisce, tutti ammirano.'},
  {l:'Niente costume, non ti piace travestirti',pers:{E:-2},r:'Ti limiti a lanciare coriandoli agli altri.'}]});
ev({id:'inf_nonni_estate',min:4,max:8,once:1,t:'Un mese dai nonni',cond:()=>vivi(['Nonno']).length>0,x:'I tuoi lavorano e ti mandano un mese in campagna dai nonni.',c:[
  {l:'Ti godi galline, orto e bicicletta',fx:()=>{vivi(['Nonno']).forEach(n=>n.rapporto=clamp(n.rapporto+8));cambiaPers('O',1);mod('felicita',4);return ['Torni abbronzat'+g('o','a')+', con le ginocchia sbucciate e mille storie.','g']}},
  {l:'Ti manca casa e piangi ogni sera',e:{f:-3},pers:{N:2},r:'La nonna ti consola con le frittelle. Funziona solo in parte.'},
  {l:'Fai amicizia con i bambini del paese',e:{f:3},fx:()=>{nuovoAmico();cambiaPers('E',2);return ['Una banda di ragazzini in bicicletta, tutta l\'estate.','g']}}]});

/* ---------- Bambini (6–9) ---------- */
ev({id:'bam_compagno_banco',min:6,max:7,once:1,w:1.3,t:'Il compagno di banco',x:'Primo giorno di prima elementare: devi scegliere dove sederti.',c:[
  {l:'Vicino al bambino che sta da solo',fx:()=>{const p=nuovoAmico(true);cambiaPers('A',2);return [p?`Si chiama ${p.nome}. Diventa il tuo compagno di banco per cinque anni.`:'Vi capite al volo.','g']}},
  {l:'Al primo banco, vicino alla maestra',e:{voto:4},pers:{C:2,E:-1},r:'Non ti sfugge niente di quello che dice.'},
  {l:'In fondo, vicino alla finestra',e:{f:1},pers:{C:-2,O:1},r:'Il cortile è molto più interessante della lavagna.'}]});
ev({id:'bam_tabelline',min:7,max:9,once:1,t:'Le tabelline',x:'Domani c\'è la verifica sulla tabellina del sette.',c:[
  {l:'La ripeti fino a cena',e:{voto:5},pers:{C:2},r:'Sette per otto cinquantasei. Lo sai anche nel sonno.'},
  {l:'Ti inventi una canzoncina per ricordarla',e:{voto:4,musica:1},pers:{O:2},r:'Tutta la classe la canterà per anni.'},
  {l:'Speri nella fortuna',e:{voto:-4},pers:{C:-2},r:'La fortuna non conosce la tabellina del sette.'}]});
ev({id:'bam_figurine',min:6,max:10,once:1,t:'Le figurine',x:'Ti manca una sola figurina per finire l\'album, e ce l\'ha un compagno.',c:[
  {l:'Gli offri dieci doppie in cambio',p:.7,si:{e:{f:4},pers:{C:1,E:1},r:'Album completo! Lo mostri a tutti.'},no:{e:{f:-1},r:'Non vuole cederla per nessun motivo.'}},
  {l:'Gliela rubi dallo zaino',p:.6,si:{e:{f:1,k:-4},pers:{A:-3,C:-1},r:'Album completo, ma ogni volta che lo guardi ti senti stran{o}.'},no:{e:{f:-4,k:-3},pers:{N:1},r:'Ti scoprono. Figuraccia davanti a tutta la classe.'}},
  {l:'Lasci perdere: l\'album va bene anche così',pers:{N:-1,A:1},r:'Un buco nell\'ultima pagina. Pazienza.'}]});
ev({id:'bam_gita',min:6,max:10,once:1,t:'La gita',x:'Gita di classe allo zoo. La maestra dice di restare in fila.',c:[
  {l:'Resti in fila e prendi appunti',e:{i:1,voto:2},pers:{C:2},r:'Scopri che le giraffe dormono pochissimo.'},
  {l:'Ti allontani per vedere i pinguini',p:.6,si:{e:{f:3},pers:{O:2,C:-2},r:'I pinguini valevano la ramanzina.'},no:{e:{f:-3},pers:{N:1},r:'Ti cercano per mezz\'ora. Telefonata a casa.'}},
  {l:'Fai ridere tutti imitando le scimmie',e:{f:3},pers:{E:3},r:'Il pullman al ritorno è uno spettacolo comico.'}]});
ev({id:'bam_nuovo_compagno',min:6,max:10,once:1,t:'Il compagno nuovo',x:'Arriva in classe un bambino che non parla ancora bene l\'italiano. Tutti lo guardano.',c:[
  {l:'Lo inviti a giocare a pallone',fx:()=>{const p=nuovoAmico(true);cambiaPers('A',2);cambiaPers('O',1);S.abil.lingue=clamp(S.abil.lingue+2);return [p?`Impari da ${p.nome} qualche parola della sua lingua. Diventate amici.`:'Giocate tutta la ricreazione.','g']}},
  {l:'Lo osservi da lontano',pers:{E:-1},r:'Non sai bene come comportarti.'},
  {l:'Ridi delle sue parole sbagliate con gli altri',e:{k:-3},pers:{A:-3},r:'Ridono tutti. Lui no.'}]});
ev({id:'bam_cotta',min:7,max:10,once:1,t:'La prima cotta',x:'C\'è qualcuno in classe che ti fa diventare ross{o} ogni volta che ti guarda.',c:[
  {l:'Gli lasci un bigliettino anonimo',e:{f:2},pers:{O:1,N:1},r:'Passi una settimana a sperare che capisca chi è stato.'},
  {l:'Glielo dici in faccia',p:.4,si:{e:{f:6},pers:{E:2,N:-2},r:'Ti regala metà della sua merenda. È amore.'},no:{e:{f:-5},pers:{N:2},r:'Ride e lo dice a tutti. Giornata da dimenticare.'}},
  {l:'Lo tieni per te',pers:{E:-2},r:'Lo scrivi solo nel diario, con il lucchetto.'}]});
ev({id:'bam_bici_rubata',min:7,max:12,once:1,t:'La bici',x:'Fuori da scuola qualcuno ti ruba la bicicletta.',c:[
  {l:'Lo dici subito ai tuoi',fx:()=>{famG().forEach(p=>p.rapporto=clamp(p.rapporto+2));cambiaPers('A',1);return ['Fate denuncia insieme. La bici non torna, ma ti senti protett'+g('o','a')+'.','']}},
  {l:'La cerchi per tutto il quartiere',p:.3,si:{e:{f:6},pers:{C:2,N:-1},r:'La trovi legata a un palo: la riprendi!'},no:{e:{f:-3},pers:{C:1},r:'Tre giorni di ricerche. Niente.'}},
  {l:'Ti chiudi in camera e piangi',e:{f:-4},pers:{N:2},r:'Era la tua bici preferita.'}]});
ev({id:'bam_squadra',min:6,max:10,once:1,t:'Le squadre',x:'In palestra due capitani scelgono le squadre. Tu sei tra gli ultimi.',c:[
  {l:'Giochi al massimo per farglielo pagare',e:{sport:2},pers:{C:1,A:-1,N:-1},r:'Fai tre gol. La prossima volta ti sceglieranno subito.'},
  {l:'Ti viene il magone',e:{f:-3},pers:{N:2,E:-1},r:'Non giochi bene. Non ti importa nemmeno.'},
  {l:'Ci ridi su',e:{f:1},pers:{N:-2,E:1},r:'«Il migliore si sceglie per ultimo.» Ridono anche i capitani.'}]});
ev({id:'bam_diario',min:7,max:12,once:1,t:'Il diario segreto',x:'Ti regalano un diario con il lucchetto.',c:[
  {l:'Ci scrivi ogni sera',e:{i:1},pers:{O:2,C:2},r:'Pagine e pagine. Rileggerle da grande sarà bellissimo.'},
  {l:'Ci disegni fumetti',e:{arte:3},pers:{O:3},r:'Il diario diventa un fumetto a puntate.'},
  {l:'Lo usi per tre giorni e lo dimentichi',pers:{C:-2},r:'Lo ritroverai tra vent\'anni in cantina.'}]});
ev({id:'bam_genitori_litigano',min:6,max:12,once:1,t:'Le voci dalla cucina',cond:()=>famG().length>=2,x:'Una sera senti i tuoi litigare forte in cucina.',c:[
  {l:'Entri e chiedi di smettere',fx:()=>{cambiaPers('E',1);cambiaPers('A',1);famG().forEach(p=>p.rapporto=clamp(p.rapporto+2));S.fatti.intesaGenitori=clamp((S.fatti.intesaGenitori||60)+3);return ['Smettono subito e ti abbracciano. «Va tutto bene.»','']}},
  {l:'Ti metti le cuffie e non pensi',pers:{N:1,E:-1},r:'La musica copre tutto.'},
  {l:'Ti convinci che sia colpa tua',e:{f:-5},fx:()=>{S.fatti.famigliaDifficile=1;cambiaPers('N',3);return ['Non è colpa tua. Ma ci vorranno anni per capirlo.','b']}}]});
ev({id:'bam_responsabilita',min:7,max:11,once:1,t:'La pianta della classe',x:'La maestra ti affida la pianta della classe per le vacanze di Natale.',c:[
  {l:'La curi come un tesoro',e:{k:2},pers:{C:3},r:'Torna a scuola più verde di prima. La maestra ti affida anche il registro delle presenze.'},
  {l:'Te ne dimentichi',e:{f:-2},pers:{C:-2},r:'Torna a scuola un bastoncino secco. Imbarazzo totale.'},
  {l:'Le parli ogni giorno',e:{f:2},pers:{O:2,A:1},r:'Giuri che ti risponde.'}]});
ev({id:'bam_scommessa',min:8,max:12,once:1,t:'La sfida',x:'Un compagno ti sfida a saltare dal muretto più alto del cortile.',c:[
  {l:'Salti',p:.65,si:{e:{f:3},pers:{N:-2,E:1,C:-1},r:'Atterri in piedi. Leggenda del cortile.'},no:{e:{s:-6,f:-2},pers:{C:1},r:'Ti slogi la caviglia. Un mese con la stampella.'}},
  {l:'Dici che è una cosa stupida',pers:{C:2,A:-1},r:'Ti prendono in giro per un giorno. Ma hai due caviglie intere.'},
  {l:'Rilanci con una sfida più furba',e:{f:2},pers:{O:2,E:1},r:'«Chi fa più palleggi.» Vinci tu, ovviamente.'}]});
ev({id:'bam_ingiustizia',min:7,max:11,once:1,t:'La punizione ingiusta',x:'La maestra punisce tutta la classe per colpa di uno solo.',c:[
  {l:'Protesti a nome di tutti',p:.5,si:{e:{f:3},pers:{E:2,A:-1,N:-1},r:'La maestra ci ripensa. Per una settimana tutti vogliono sedersi vicino a te.'},no:{e:{f:-2,voto:-2},pers:{A:-1},r:'Ti becchi una nota in più.'}},
  {l:'Accetti in silenzio',pers:{A:1,C:1,E:-1},r:'Le regole sono regole.'},
  {l:'Convinci il colpevole a confessare',e:{k:2},pers:{A:2,E:1},r:'Ci vuole coraggio, ma confessa. Punizione tolta a tutti.'}]});
ev({id:'bam_stelle',min:7,max:12,once:1,t:'Le stelle',x:'In campagna, di notte, il cielo è pieno di stelle.',c:[
  {l:'Chiedi i nomi delle costellazioni',e:{i:2},pers:{O:3},r:'L\'Orsa Maggiore, Cassiopea, Orione. Ti appassioni allo spazio.'},
  {l:'Esprimi un desiderio su una stella cadente',e:{f:3},pers:{O:1,N:-1},r:'Non puoi dirlo, altrimenti non si avvera.'},
  {l:'Hai sonno e vuoi tornare dentro',pers:{O:-1},r:'Le stelle saranno lì anche domani.'}]});
ev({id:'bam_cane_scuola',min:6,max:10,once:1,t:'Il cane in cortile',x:'Un cane randagio entra nel cortile della scuola. I bambini scappano urlando.',c:[
  {l:'Ti avvicini piano e gli porgi la mano',p:.8,si:{e:{f:4,k:2},pers:{N:-2,A:2},r:'Ti lecca la mano. Lo chiamate Ricreazione.'},no:{e:{f:-3},pers:{N:2},r:'Ringhia. Torni di corsa dentro.'}},
  {l:'Chiami un bidello',pers:{C:2},r:'Il cane finisce al canile e trova una famiglia. Ti senti responsabile.'},
  {l:'Scappi con gli altri',pers:{N:1,E:1},r:'Urli anche tu, per solidarietà.'}]});

/* ---------- Bambini grandi (9–12) ---------- */
ev({id:'bam_segreto_amico',min:9,max:12,once:1,t:'Il segreto',cond:()=>vivi(['Amico']).length>0,x:d=>{d.p=d.p||pick(vivi(['Amico']));return `${d.p.nome} ti confida un segreto e ti fa giurare di non dirlo a nessuno.`},c:[
  {l:'Lo mantieni',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);ricorda(d.p,'Hai mantenuto il suo segreto');cambiaPers('A',1);cambiaPers('C',1);return ['Il vostro legame diventa fortissimo.','g']}},
  {l:'Lo racconti a un altro amico',fx:d=>{d.p.rapporto=clamp(d.p.rapporto-15);ricorda(d.p,'Hai raccontato il suo segreto');cambiaPers('A',-2);return [`Il segreto fa il giro della classe. ${d.p.nome} non ti parla per un mese.`,'b']}},
  {l:'Lo scrivi nel diario',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3);cambiaPers('O',1);return ['Al sicuro, con il lucchetto.','']}}]});
ev({id:'bam_paghetta',min:9,max:12,once:1,t:'La prima paghetta',x:'I tuoi decidono di darti 10 € a settimana.',c:[
  {l:'Li metti nel salvadanaio',e:{m:60},pers:{C:3},r:'In tre mesi hai abbastanza per il gioco che volevi.'},
  {l:'Li spendi subito in caramelle e figurine',e:{f:3},pers:{C:-2},r:'Il venerdì sei già al verde.'},
  {l:'Compri un regalo per la mamma',fx:()=>{const m=vivi(['Madre'])[0];if(m)m.rapporto=clamp(m.rapporto+6);cambiaPers('A',2);return ['Una tazza con scritto «Mamma migliore del mondo». La usa ancora.','g']}}]});
ev({id:'bam_compito_copiato',min:9,max:12,once:1,t:'Il compito in classe',x:'Il tuo compagno di banco ti chiede di fargli copiare la verifica.',c:[
  {l:'Gli fai copiare',p:.7,si:{e:{f:1},pers:{A:2,C:-1},r:'Prendete lo stesso voto. Ti sarà riconoscente.'},no:{e:{voto:-6},pers:{N:1},r:'La maestra vi scopre: zero a tutti e due.'}},
  {l:'Rifiuti',pers:{C:2,A:-1},r:'Ti tiene il broncio per due giorni.'},
  {l:'Gli spieghi gli esercizi all\'intervallo',e:{voto:2,k:2},pers:{A:2,E:1},r:'La volta dopo ce la fa da solo.'}]});
ev({id:'bam_sport_gara',min:9,max:12,once:1,t:'La gara',x:'Alla gara di corsa sei in testa, ma un compagno inciampa vicino a te.',c:[
  {l:'Ti fermi ad aiutarlo',e:{k:4,f:2},pers:{A:3},r:'Arrivate ultimi insieme. Tutto lo stadio applaude.'},
  {l:'Continui e vinci',e:{f:3,sport:2},pers:{A:-1,C:1},r:'Medaglia d\'oro. Lui si rialza da solo.'},
  {l:'Rallenti per vedere se sta bene, poi riparti',e:{f:1},pers:{A:1},r:'Arrivi terz{o}. Una buona via di mezzo.'}]});
ev({id:'bam_videogioco',min:9,max:12,once:1,t:'Il videogioco',x:'Ti regalano una console. Il primo livello è difficilissimo.',c:[
  {l:'Ci provi finché non lo superi',e:{tech:3},pers:{C:2,N:-1},r:'Al cinquantesimo tentativo ce la fai. Urlo di vittoria.'},
  {l:'Lanci il controller',e:{f:-2},pers:{N:2,A:-1},r:'Il controller sopravvive. La tua pazienza no.'},
  {l:'Chiedi aiuto a un amico più bravo',e:{tech:2},pers:{E:2,A:1},r:'Pomeriggi interi a giocare insieme.'}]});
ev({id:'bam_trasloco_amico',min:9,max:12,once:1,t:'L\'amico che se ne va',cond:()=>vivi(['Amico']).length>0,x:d=>{d.p=d.p||pick(vivi(['Amico']));return `${d.p.nome} ti dice che la sua famiglia si trasferisce in un\'altra città.`},c:[
  {l:'Prometti di scrivervi ogni settimana',fx:d=>{d.p.lontano=true;d.p.rapporto=clamp(d.p.rapporto+5);cambiaPers('A',1);cambiaPers('C',1);return ['Vi scrivete per anni. Una vera amicizia a distanza.','g']}},
  {l:'Fai finta che non ti importi',fx:d=>{d.p.lontano=true;cambiaPers('N',1);cambiaPers('E',-1);return ['Dentro ti si spezza qualcosa, ma non lo dici.','b']}},
  {l:'Organizzi una festa d\'addio',fx:d=>{d.p.lontano=true;d.p.rapporto=clamp(d.p.rapporto+8);cambiaPers('E',2);mod('felicita',2);return ['Torta, palloncini e un album di foto di voi due.','g']}}]});
ev({id:'bam_cellulare_ritrovato',min:9,max:12,once:1,t:'Il portafoglio',x:'Al parco trovi un portafoglio con dentro 50 €.',c:[
  {l:'Lo porti ai vigili',e:{k:6},pers:{C:2,A:2},r:'Il proprietario ti regala 10 € e una stretta di mano.'},
  {l:'Tieni i soldi e butti il portafoglio',e:{m:50,k:-6},pers:{A:-3,C:-1},r:'Cinquanta euro. Un peso nello stomaco che dura giorni.'},
  {l:'Lo dai ai tuoi e decidete insieme',fx:()=>{famG().forEach(p=>p.rapporto=clamp(p.rapporto+3));cambiaPers('A',1);S.karma=clamp(S.karma+4);return ['Lo riportate insieme. Papà è fiero di te.','g']}}]});
ev({id:'bam_esperimento',min:9,max:12,once:1,t:'L\'esperimento',x:'Hai visto in TV come costruire un vulcano con bicarbonato e aceto.',c:[
  {l:'Lo costruisci in cucina',p:.6,si:{e:{i:2,f:3},pers:{O:3},r:'L\'eruzione è spettacolare. Anche il disastro sul pavimento.'},no:{e:{f:-1},pers:{O:2,C:-1},r:'Esplode troppo presto. Aceto sulle tende.'}},
  {l:'Lo prepari per la scuola, con cartellone e spiegazione',e:{voto:4,i:2},pers:{C:3,O:1},r:'Il professore lo mostra alle altre classi.'},
  {l:'Lo guardi e basta',pers:{O:-1},r:'In TV sembra più facile.'}]});
ev({id:'bam_presa_in_giro',min:9,max:12,once:1,t:'Il soprannome',x:'In classe ti hanno dato un soprannome che non ti piace per niente.',c:[
  {l:'Ci ridi sopra e lo fai tuo',e:{f:1},pers:{N:-2,E:2},r:'Se non ti offende, smette di funzionare. Infatti dopo un mese non lo usa più nessuno.'},
  {l:'Rispondi con un soprannome peggiore',pers:{A:-2,E:1},r:'Guerra di soprannomi. Nessun vincitore.'},
  {l:'Ci soffri in silenzio',e:{f:-5},pers:{N:3,E:-2},r:'Ogni mattina andare a scuola è un po\' più pesante.'},
  {l:'Ne parli con i tuoi',fx:()=>{famG().forEach(p=>p.rapporto=clamp(p.rapporto+4));cambiaPers('N',-1);return ['Parlano con la maestra. Il soprannome sparisce.','g']}}]});
ev({id:'bam_scout',min:8,max:12,once:1,t:'Gli scout',x:'Un amico ti propone di entrare negli scout.',c:[
  {l:'Ci vai',fx:()=>{nuovoAmico();cambiaPers('E',2);cambiaPers('C',1);cambiaPers('A',1);S.abil.sport=clamp(S.abil.sport+2);return ['Tende, nodi, fuochi e canzoni. Torni ogni sabato pien'+g('o','a')+' di fango e felice.','g']}},
  {l:'No, preferisci stare a casa',pers:{E:-2},r:'Il sabato è fatto per i fumetti.'},
  {l:'Ci provi ma la prima uscita sotto la pioggia ti basta',e:{s:-1},pers:{O:1,C:-1},r:'Mai più.'}]});
ev({id:'bam_nonno_malato',min:7,max:12,once:1,t:'Il nonno in ospedale',cond:()=>vivi(['Nonno']).length>0,x:d=>{d.p=d.p||pick(vivi(['Nonno']));return `${d.p.nome} è in ospedale. I bambini non potrebbero entrare.`},c:[
  {l:'Gli fai un disegno da portare',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);cambiaPers('A',2);return ['Il disegno resta appeso sul comodino fino alle dimissioni.','g']}},
  {l:'Insisti per vederlo',p:.5,si:{fx:d=>{d.p.rapporto=clamp(d.p.rapporto+10);cambiaPers('E',1);cambiaPers('N',-1);return ['Un\'infermiera ti fa entrare di nascosto. Il nonno sorride tutto il pomeriggio.','g']}},no:{e:{f:-2},r:'Ti fermano al reparto. Lo saluti dalla finestra.'}},
  {l:'Hai paura degli ospedali',e:{f:-2},pers:{N:2},r:'Lo chiami con il telefono di mamma. Gli basta sentire la tua voce.'}]});
ev({id:'bam_classifica',min:10,max:12,once:1,t:'Il voto più alto',x:'Prendi il voto più alto della classe. Un compagno ti prende in giro: «Studi troppo!»',c:[
  {l:'Te ne vanti',e:{f:2},pers:{A:-2,E:1},r:'Ti guardano storto. Il voto però resta.'},
  {l:'Ti offri di aiutare chi ha preso male',e:{k:3},pers:{A:2,E:1},r:'Diventi il punto di riferimento della classe.'},
  {l:'Inizi a fingere di studiare meno',e:{voto:-3},pers:{N:2,C:-1},r:'Pur di non essere pres{o} in giro.'}]});
ev({id:'bam_strumento',min:8,max:12,once:1,t:'Lo strumento',x:'A scuola si può scegliere uno strumento per il laboratorio di musica.',c:[
  {l:'Il violino: difficile ma bellissimo',e:{musica:4},pers:{C:2,O:1},r:'I primi mesi sembra un gatto arrabbiato. Poi migliora.'},
  {l:'La batteria',e:{musica:3,f:2},pers:{E:2,C:-1},r:'I vicini ti odiano. Tu ti senti una rockstar.'},
  {l:'Il flauto, come tutti',e:{musica:1},pers:{O:-1,A:1},r:'Inno alla gioia, versione flauto dolce.'}]});
ev({id:'bam_animale_casa',min:8,max:12,once:1,t:'Il criceto',cond:()=>S.casa.tipo==='genitori',x:'I tuoi accettano di prendere un criceto, ma solo se te ne occupi tu.',c:[
  {l:'Prometti e mantieni',fx:()=>{S.animali.push({t:'Criceto',nome:pick(['Nocciolina','Biscotto','Pallino','Ciambella']),eta:0,max:3});cambiaPers('C',3);mod('felicita',5);return ['Gabbia sempre pulita, acqua fresca ogni giorno. I tuoi sono stupiti.','g']}},
  {l:'Prometti, poi se ne occupa la mamma',fx:()=>{S.animali.push({t:'Criceto',nome:pick(['Nocciolina','Biscotto','Pallino','Ciambella']),eta:0,max:3});cambiaPers('C',-2);const m=vivi(['Madre'])[0];if(m)m.rapporto=clamp(m.rapporto-3);return ['Il criceto sta benissimo. Grazie alla mamma.','']}},
  {l:'Ci ripensi: è una responsabilità troppo grande',pers:{C:1,N:1},r:'Forse il prossimo anno.'}]});
ev({id:'bam_tradimento',min:10,max:12,once:1,t:'L\'invito mancato',x:'Un compagno a cui tieni tanto fa una festa e non ti invita.',c:[
  {l:'Gli chiedi perché',p:.6,si:{e:{f:2},pers:{E:1,N:-1},r:'Era un errore della mamma con gli inviti. Vai alla festa.'},no:{e:{f:-3},pers:{N:1},r:'Risponde vago. Qualcosa si è rotto.'}},
  {l:'Fai finta di niente',e:{f:-2},pers:{E:-1,N:1},r:'Il sabato sera ti sembra lunghissimo.'},
  {l:'Organizzi una festa tua lo stesso giorno',e:{f:2},pers:{E:2,A:-2},r:'Metà classe viene da te. Vendetta servita.'}]});
ev({id:'bam_responsabile_fratello',min:9,max:12,once:1,t:'Il fratellino',cond:()=>vivi(['Fratello']).some(f=>f.eta<S.eta),x:'I tuoi escono e ti lasciano a badare a tuo fratello minore per un\'ora.',c:[
  {l:'Lo fai giocare e lo metti a letto',fx:()=>{const f=vivi(['Fratello']).find(x=>x.eta<S.eta);if(f)f.rapporto=clamp(f.rapporto+6);cambiaPers('C',2);cambiaPers('A',1);return ['Quando tornano, dorme. Ti fanno i complimenti.','g']}},
  {l:'Lo metti davanti alla TV e giochi alla console',pers:{C:-1},r:'Un\'ora tranquilla. Nessuno si fa male.'},
  {l:'Inventate insieme una caccia al tesoro',fx:()=>{const f=vivi(['Fratello']).find(x=>x.eta<S.eta);if(f)f.rapporto=clamp(f.rapporto+10);cambiaPers('O',2);cambiaPers('E',1);mod('felicita',3);return ['La casa è sottosopra, ma vi siete divertiti tantissimo.','g']}}]});
ev({id:'bam_concorso_tema',min:9,max:12,once:1,t:'Il tema',x:'Il tema in classe è: «Cosa vuoi fare da grande?».',c:[
  {l:'L\'astronauta, e spieghi come ci arriverai',e:{voto:3,i:1},pers:{O:2,C:2},r:'Il tema viene letto ad alta voce in classe.'},
  {l:'Lo stesso lavoro dei tuoi genitori',fx:()=>{famG().forEach(p=>p.rapporto=clamp(p.rapporto+3));cambiaPers('O',-1);cambiaPers('A',1);return ['I tuoi lo leggono e si commuovono.','g']}},
  {l:'Il ricco, così non lavori',e:{f:1},pers:{C:-1,E:1},r:'La maestra ride, poi ti mette un sei e mezzo.'},
  {l:'Non lo sai, e lo scrivi',pers:{O:1,N:1},r:'Un tema sincero e un po\' malinconico. Otto.'}]});
ev({id:'bam_regola_casa',min:9,max:12,once:1,t:'L\'orario',x:'I tuoi ti dicono di tornare a casa per le sette. Al parco state giocando la partita decisiva.',c:[
  {l:'Torni alle sette in punto',fx:()=>{famG().forEach(p=>p.rapporto=clamp(p.rapporto+3));cambiaPers('C',2);return ['La tua squadra perde senza di te. Però i tuoi si fidano.','']}},
  {l:'Finisci la partita e corri',p:.5,si:{e:{f:3},pers:{C:-1},r:'Arrivi alle sette e dieci. Nessuno se ne accorge.'},no:{fx:()=>{relGenitori(-5);cambiaPers('C',-1);mod('felicita',-2);return ['Ritardo di mezz\'ora. Una settimana senza parco.','b']}}},
  {l:'Chiami per chiedere mezz\'ora in più',p:.7,si:{e:{f:2},pers:{A:1,E:1},r:'Concessa. Segni il gol della vittoria.'},no:{pers:{C:1},r:'«No.» Torni a casa brontolando.'}}]});
