/* ================= LAVORO VISSUTO: EVENTI CON IL CAPO E I COLLEGHI (ROADMAP Fase 5.3a) =================
   col_  fatti del lavoro con una persona vera della squadra (c10_squadra.js: capo = d.p, colleghi = d.p e d.q).
         Li apre eventoLavoro() (circa 5–6 in una carriera, vedi COL_EV in fondo) o l'arrivo di un nuovo capo.
   prg_  due catene di 3 passi: il progetto importante (prg_avvio → prg_imprevisto → prg_consegna, apre emergenti() al posto di
         capo_progetto) e la riorganizzazione (prg_riorg1 → prg_riorg2 → prg_riorg3). I dati passano in d.x, il capo in d.p.
   Gli sportivi hanno l'allenatore e i compagni: gli eventi che non vanno bene per una squadra hanno ok:!sport nella lista. */
const memb=()=>{const s=squadra();return [s.capo,...s.colleghi].filter(Boolean)};
const relSq=v=>memb().forEach(p=>relD(p,v));
const qDi=d=>{const q=d.q||(d.x&&d.x.q?persona(d.x.q):null);return q&&q.vivo?q:null};
const chiCapo=p=>lavInCorso(p)?`${gp(p,'il tuo '+nomeCapoDi(p),'la tua '+nomeCapoDi(p))} ${p.nome}`:p.nome;
const tuoColl=p=>sportSq()?gp(p,'il tuo compagno di squadra','la tua compagna di squadra'):gp(p,'il tuo collega','la tua collega');

/* ---------- Il capo ---------- */
ev({id:'col_capo_nota',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'Due minuti?',x:d=>`${cap(chiCapo(d.p))} ti ferma in corridoio: «Hai due minuti?» Ha notato come hai gestito l'ultimo mese e vuole affidarti qualcosa di più grosso.`,c:[
  {l:'Accetti, anche se è un impegno',sub:'Più responsabilità, più stress',pers:{C:3},fx:d=>{pesa(5,2);S.lavoro.perf=clamp(S.lavoro.perf+6);relD(d.p,6);ricorda(d.p,`${gp(d.p,'Gli','Le')} hai detto sì quando serviva`,2);return [`${d.p.nome} annuisce: «Sapevo di poter contare su di te.»`,'g']}},
  {l:'Accetti, ma a una condizione',sub:'Chiedi di essere pagat{o} di più',pers:{E:2},fx:d=>{if(chance(.5+capoEsito()*.1+pz('E')*.1)){S.lavoro.stip=Math.round(S.lavoro.stip*1.04);relD(d.p,3);return [`Ci pensa un giorno, poi torna con un +4% e una pacca sulla spalla. ${cap(gp(d.p,'lui','lei'))} apprezza chi sa quanto vale.`,'g']}relD(d.p,-4);S.lavoro.perf=clamp(S.lavoro.perf-1);return [`«Ne riparliamo.» Non se ne riparla più, e ${d.p.nome} ti guarda diversamente.`,'b']}},
  {l:'Dici di no: sei già al limite',pers:{N:1,C:-1},fx:d=>{S.bis.stress=clamp(S.bis.stress-3);relD(d.p,-3);return [`${d.p.nome} capisce, o finge. L'incarico va a un altro.`,'']}}]});

ev({id:'col_capo_scarica',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'Il post-it',x:d=>`Sulla tua scrivania c'è una pratica che non è tua, con un post-it di ${d.p.nome}, ${gp(d.p,'il tuo '+nomeCapoDi(d.p),'la tua '+nomeCapoDi(d.p))}: «Urgente, grazie!» È la terza volta questo mese.`,c:[
  {l:'La fai e basta',pers:{A:1,C:1},fx:d=>{pesa(5,2);S.lavoro.perf=clamp(S.lavoro.perf+2);relD(d.p,2);ricorda(d.p,'Ti ha scaricato un lavoro non suo',-1);return ['La consegni il giorno dopo. Nessuno ti ringrazia, ma almeno è finita.','']}},
  {l:'La riporti con garbo: non è tua',pers:{E:2,C:1},p:.6,si:{fx:d=>{relD(d.p,3);S.lavoro.perf=clamp(S.lavoro.perf+1);return [`${d.p.nome} resta un attimo in silenzio: «Hai ragione, scusa.» Da allora ci pensa due volte.`,'g']}},no:{fx:d=>{relD(d.p,-6);S.lavoro.perf=clamp(S.lavoro.perf-3);return [`«Non è questo lo spirito di squadra.» ${cap(gp(d.p,'lui','lei'))} se la lega al dito.`,'b']}}},
  {l:'La passi a un collega',pers:{A:-3},fx:d=>{const c=pick(squadra().colleghi);if(c){relD(c,-8);ricorda(c,'Ti ha passato una pratica che non era sua',-2)}return [`${c?c.nome+' la prende senza dire niente':'Qualcuno la prende'}. Tu ti senti ${g('furbo','furba')} per un'ora, poi un po' meno.`,'']}}]});

ev({id:'col_straordinari',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'Venerdì, le sei e cinquanta',x:d=>`${cap(chiCapo(d.p))} si avvicina alla tua scrivania con la faccia di chi sta per chiedere un favore: serve qualcuno che resti fino a tardi per chiudere la consegna.`,c:[
  {l:'Resti',sub:()=>`Pagati ${eur(P(90))} in più`,pers:{C:2},fx:d=>{soldi(P(90));pesa(5,1);S.lavoro.perf=clamp(S.lavoro.perf+3);relD(d.p,4);ricorda(d.p,'Si è fermato quando serviva',2);return ['Alle nove spegnete le luci insieme. Il lunedì te lo ricordano con un caffè.','g']}},
  {l:'Ti scusi: hai un impegno',pers:{C:-1},fx:d=>{relD(d.p,-2);return [`«Nessun problema», dice ${d.p.nome}. Si capisce che il problema c'è.`,'']}},
  {l:'Contratti: recuperi giovedì',pers:{E:1},p:.55,si:{fx:d=>{relD(d.p,2);return ['Ti fermi un po\' e il giovedì esci alle quattro. Equilibrio, raro.','g']}},no:{fx:d=>{relD(d.p,-3);return ['«I recuperi non si fanno in questo periodo.» Resti lo stesso, un po\' più arrabbiat'+g('o','a')+'.','b']}}}]});

ev({id:'col_nuovo_capo',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:()=>sportSq()?'Il nuovo allenatore':'Il nuovo capo',x:d=>{const p=d.p,sport=sportSq(),diff=S.eta-p.eta;
  return `${sport?gp(p,'Il nuovo allenatore','La nuova allenatrice'):gp(p,'Il nuovo responsabile','La nuova responsabile')} è ${p.nome} ${p.cognome}, ${p.eta} anni${diff>=10?`: ${diff} anni meno di te e un sacco di entusiasmo`:diff<=-12?': ha più esperienza di tutti noi messi insieme':''}. Sembra ${descrPers(p.pers,p.sesso)}. Nei primi giorni cambia l'orario ${sport?'degli allenamenti':'delle riunioni'} e impara i nomi di tutti.`},c:[
  {l:'Ti presenti con una proposta',sub:'Farti notare subito',pers:{E:3,O:1},p:.6,si:{fx:d=>{relD(d.p,8);S.lavoro.perf=clamp(S.lavoro.perf+3);return [`${d.p.nome} annota tutto: «Mi servono persone così.»`,'g']}},no:{fx:d=>{relD(d.p,-3);return ['«Interessante, ne parliamo più avanti.» Non succederà.','']}}},
  {l:'Lo osservi prima di esporti',pers:{C:2},fx:d=>{relD(d.p,2);return ['Dopo un mese sai già come ragiona. Utile.','g']}},
  {l:'Pensi che non cambierà niente',pers:{O:-1},fx:()=>['Cambia qualcosa, ma non quello che pensavi.','']}]});

/* ---------- I colleghi ---------- */
ev({id:'col_copri',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'Mi copri?',x:d=>`${cap(tuoColl(d.p))} ${d.p.nome} ti scrive: ${d.x.c}. Ti chiede se giovedì puoi coprire il suo turno o tenere d'occhio le sue scadenze.`,c:[
  {l:'Certo, ti copro',sub:'Una mano oggi, una domani',pers:{A:3},fx:d=>{pesa(3,1);relD(d.p,8);ricorda(d.p,`${gp(d.p,"L'hai coperto","L'hai coperta")} quando ne aveva bisogno`,3);return [`${d.p.nome} ti ringrazia con un dolce per tutto l'ufficio. «Ti devo una.»`,'g']}},
  {l:'Solo se mi copri tu un\'altra volta',pers:{C:1},fx:d=>{relD(d.p,2);return [`Patto fatto. ${d.p.nome} lo scrive su un foglio, per sicurezza.`,'']}},
  {l:'Mi dispiace, non posso',pers:{A:-1},fx:d=>{relD(d.p,-5);ricorda(d.p,`${gp(d.p,'Gli','Le')} hai detto di no quando chiedeva aiuto`,-2);return ['Ti senti in colpa fino a pranzo. Poi passa.','']}}]});

ev({id:'col_promosso',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:()=>sportSq()?'Il posto da titolare':'Il posto che volevi',x:d=>sportSq()
  ?`Il mister sceglie ${d.p.nome} come titolare. Il tuo posto, quello che ti sembrava ormai tuo.`
  :`${cap(tuoColl(d.p))} ${d.p.nome} viene promoss${gp(d.p,'o','a')}. Era anche il posto che volevi tu, e lo sai bene.`,c:[
  {l:'Ti complimenti davvero',pers:{A:3},fx:d=>{relD(d.p,6);ricorda(d.p,'Si è congratulato con sincerità',3);return [`${d.p.nome} resta di sasso: «Grazie. Non me l'aspettavo da te.»`,'g']}},
  {l:'Sorridi a denti stretti',pers:{N:1},fx:d=>{pesa(4,1);S.lavoro.perf=clamp(S.lavoro.perf-1);return ['Il sorriso regge fino alle sei. Poi crolla in macchina.','b']}},
  {l:'Chiedi conto a chi decide',pers:{E:2,C:1},p:.5,si:{fx:()=>{S.lavoro.perf=clamp(S.lavoro.perf+4);S.lavoro.anniLiv=Math.max(S.lavoro.anniLiv,1);return ['Ti ascoltano. Non cambia la scelta, ma si ricorderanno di te la prossima volta.','g']}},no:{fx:()=>{S.lavoro.perf=clamp(S.lavoro.perf-3);return ['«Non è il momento di parlarne.» Il tono ti dice tutto.','b']}}}]});

ev({id:'col_licenziato',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'Una scatola di cartone',x:d=>`${cap(tuoColl(d.p))} ${d.p.nome} esce dall'ufficio del capo con una scatola di cartone in mano. L'azienda taglia, e stavolta tocca a ${gp(d.p,'lui','lei')}. L'ufficio è silenzioso.`,c:[
  {l:'{Lo} saluti con un abbraccio e il tuo numero',pers:{A:3},fx:d=>{salutaVia(d.p);relD(d.p,10);ricorda(d.p,'Si è ricordato di te quando se n\'è andato',3);return [`${d.p.nome} ti scrive il giorno dopo: «Non è un addio, vero?» Non lo è.`,'g']}},
  {l:'Organizzi un saluto con tutti',pers:{E:3,A:1},fx:d=>{salutaVia(d.p);pesa(2,0);relD(d.p,7);relSq(2);return ['Un regalo comune, una torta e una busta di biglietti. Il capo fa finta di niente.','g']}},
  {l:'Ti dispiace, ma niente di più',fx:d=>{salutaVia(d.p);return [`${d.p.nome} se ne va. Il giorno dopo la sua scrivania è già vuota.`,'']}},
  {l:'Pensi: e se capitasse a me?',pers:{N:2},fx:d=>{salutaVia(d.p);pesa(6,3);S.fatti.cercaAltro=S.t;return ['Quella sera aggiorni il curriculum. Non si sa mai.','b']}}]});

ev({id:'col_cena',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'La cena del reparto',x:'Il reparto ha chiuso una consegna e qualcuno propone una cena per festeggiare. Il locale è già prenotato.',c:[
  {l:'Resti fino all\'ultimo brindisi',sub:()=>eur(P(30)),costo:()=>P(30),pers:{E:3},fx:()=>{S.bis.soc=clamp(S.bis.soc+7);mod('felicita',3);relSq(3);const c=squadra().capo;if(c&&chance(.18)){relD(c,-5);return ['Verso mezzanotte dici una cosa sul capo che non dovevi dire, e che il capo sente. Tutti ridono, quasi tutti.','b']}return ['Si finisce a cantare in piazza. Ci si guarda in modo diverso, il lunedì.','g']}},
  {l:'Vieni, ma torni presto',sub:()=>eur(P(30)),costo:()=>P(30),fx:()=>{relSq(1);S.bis.soc=clamp(S.bis.soc+3);return ['Un piatto, due chiacchiere, un taxi condiviso. Giusto il necessario.','']}},
  {l:'Salti: sei stanc{o}',pers:{E:-1},fx:()=>{relSq(-1);S.bis.stress=clamp(S.bis.stress-2);return ['Pigiama e divano. Il lunedì ti raccontano di tutto quello che ti sei perso.','']}}]});

ev({id:'col_confida',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'Una confidenza',x:d=>`${cap(tuoColl(d.p))} ${d.p.nome} ti prende da parte in pausa: ${d.x.c}. Non lo ha detto a nessun altro.`,c:[
  {l:'Lo ascolti per un\'ora',sub:'Anche se hai da fare',pers:{A:3},fx:d=>{pesa(2,1);relD(d.p,10);ricorda(d.p,`${gp(d.p,'Lo','La')} hai ascoltato quando ne aveva bisogno`,3);return [`${d.p.nome} ti ringrazia con gli occhi lucidi. Da oggi tra voi c'è qualcosa in più di un caffè.`,'g']}},
  {l:'Gli dai due consigli pratici',pers:{C:1},fx:d=>{relD(d.p,4);return [`Utile e concreto: ${gp(d.p,'lui','lei')} prende appunti e ti ringrazia due giorni dopo.`,'']}},
  {l:'Hai una scadenza: ne parlate dopo',fx:d=>{relD(d.p,-2);return ['«Certo, dopo.» Il dopo non arriva mai, per tutti e due.','']}}]});

ev({id:'col_lite',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'Non si parlano più',x:d=>{const q=qDi(d);return `${d.p.nome} e ${q.nome} non si parlano più dopo la riunione di ieri. A pranzo ognuno ti racconta la sua versione, e hanno entrambi un po' ragione.`},c:[
  {l:'Parli con tutti e due',pers:{A:2,E:1},p:.5,si:{fx:d=>{const q=qDi(d);relD(d.p,4);relD(q,4);return [`Dopo un caffè a tre si chiariscono. ${d.p.nome} e ${q.nome} ti guardano come uno che ha salvato il reparto.`,'g']}},no:{fx:d=>{const q=qDi(d);relD(d.p,-3);relD(q,-3);pesa(3,1);return [`Ti sei ${g('messo','messa')} in mezzo e adesso ce l'hanno un po' con te.`,'b']}}},
  {l:'Stai dalla parte di quello che ti è più vicino',pers:{A:-1},fx:d=>{const q=qDi(d),a=d.p.rapporto>=q.rapporto?d.p:q,b=a===d.p?q:d.p;relD(a,6);relD(b,-6);return [`${a.nome} ti è grato. ${b.nome} smette di salutarti per due settimane.`,'']}},
  {l:'Non ti schieri',pers:{N:-1},fx:()=>['Mangi il tuo panino fingendo di non aver sentito niente. Funziona, più o meno.','']}]});

ev({id:'col_neonato',link:1,cond:()=>!!S.lavoro,k:'Lavoro',t:'La colletta',x:d=>`${cap(tuoColl(d.p))} ${d.p.nome} annuncia ${gp(d.p,'che sta per diventare papà','che aspetta un bambino')}, e in due giorni la scrivania è piena di bigliettini. Qualcuno ha già iniziato a raccogliere i soldi per il regalo.`,c:[
  {l:'Dai la tua parte',sub:()=>eur(P(20)),costo:()=>P(20),pers:{A:1},fx:d=>{relD(d.p,3);return ['Tutti firmano il biglietto. Il tuo messaggio è il più breve e il più sincero.','g']}},
  {l:'La organizzi tu',sub:()=>eur(P(25)),costo:()=>P(25),pers:{E:2,A:2},fx:d=>{relD(d.p,6);relSq(1);ricorda(d.p,'Hai organizzato la colletta per il suo bambino',3);return [`Passeggino scelto, biglietto firmato da tutti. ${d.p.nome} si commuove davanti alla scrivania.`,'g']}},
  {l:'Stavolta passi',pers:{A:-1},fx:d=>{relD(d.p,-1);return ['Nessuno dice niente. Qualcuno se lo ricorderà.','']}}]});

/* ---------- Prima catena: il progetto importante ---------- */
ev({id:'prg_avvio',link:1,k:'Un progetto',t:'Un progetto importante',x:d=>{const q=qDi(d);return `${cap(chiCapo(d.p))} ti chiama in ufficio: ${q?`vuole affidarti un progetto delicato, tre mesi di lavoro con un cliente esigente, e vuole che lo segua con ${q.nome}`:'vuole affidarti un progetto delicato, tre mesi di lavoro con un cliente esigente'}. Se va bene, si parla di promozione.`},cond:()=>!!S.lavoro,c:[
  {l:'Lo guidi tu, dividendo i compiti',sub:'Tre mesi intensi',pers:{C:3},fx:d=>{pesa(8,2);futuro(.3,'prg_imprevisto',{p:d.p,x:{q:d.x&&d.x.q,m:'guida',s:1}});return [`Prepari una lavagna con i compiti di ognuno. ${d.p.nome} guarda la lavagna e sorride.`,'g']}},
  {l:'Lavori fianco a fianco con il collega',pers:{E:2,A:1},fx:d=>{const q=qDi(d);pesa(6,1);if(q){relD(q,5);ricorda(q,'Avete lavorato insieme a un progetto grosso',2)}futuro(.3,'prg_imprevisto',{p:d.p,x:{q:d.x&&d.x.q,m:'insieme',s:1}});return ['Vi vedete ogni mattina alle otto, lavagna e caffè. Funziona, più o meno.','g']}},
  {l:'Fai tutto da solo, che è più sicuro',pers:{C:2,A:-2},fx:d=>{pesa(11,3);futuro(.3,'prg_imprevisto',{p:d.p,x:{q:d.x&&d.x.q,m:'solo',s:0}});return ['Notti, lunedì mattina e nessuno a cui chiedere. Ma è tutto tuo.','']}},
  {l:'Rifiuti: hai già troppo da fare',pers:{N:1,C:-1},fx:d=>{S.lavoro.perf=clamp(S.lavoro.perf-3);relD(d.p,-5);return [`${d.p.nome} annuisce, ma lo segna da qualche parte.`,'']}}]});

ev({id:'prg_imprevisto',link:1,k:'Un progetto',t:'A metà strada',x:d=>{const q=qDi(d),k=(d.x.k=d.x.k||pick(['cliente','malattia','budget']));
  return k==='cliente'?'Il cliente cambia le regole a metà strada: nuovi requisiti, stessa data di consegna.'
    :k==='malattia'?`${q?q.nome+' si ammala':'Un collega chiave si ammala'} proprio nella settimana più dura. Il lavoro non si ferma, la persona sì.`
    :'Il budget viene tagliato di un terzo. «Dovete fare lo stesso lavoro con meno risorse.»'},cond:()=>!!S.lavoro,c:[
  {l:'Rilanci: notti e caffè',pers:{C:2,N:1},fx:d=>{pesa(9,2);const ok=chance(.5+pz('C')*.2);futuro(.25,'prg_consegna',{p:d.p,x:{...d.x,s:d.x.s+(ok?1:-1)}});return [ok?'Dormi quattro ore a notte, ma tieni botta.':'Ti sfinisci e sbagli proprio dove non dovevi.',ok?'g':'b']}},
  {l:'Chiedi una mano a chi ti sta intorno',pers:{A:2,E:1},fx:d=>{const q=qDi(d);if(q){relD(q,4)}relSq(1);const ok=chance(.7);futuro(.25,'prg_consegna',{p:d.p,x:{...d.x,s:d.x.s+(ok?1:0)}});return [ok?'Tutti danno una mano, e il reparto si accorge di essere una squadra.':'Qualcuno aiuta, qualcuno no. Si va avanti lo stesso.',ok?'g':'']}},
  {l:'Chiedi più tempo al capo',pers:{E:1},fx:d=>{const ok=chance(.5+capoEsito()*.15);if(!ok)relD(d.p,-5);futuro(.25,'prg_consegna',{p:d.p,x:{...d.x,s:d.x.s+(ok?1:-1)}});return [ok?`${d.p.nome} ti concede due settimane. Ti senti capito.`:`«Non possiamo.» ${cap(gp(d.p,'lui','lei'))} non è contento della richiesta.`,ok?'g':'b']}}]});

ev({id:'prg_consegna',link:1,k:'Un progetto',t:'La consegna',x:d=>`È il giorno della consegna. ${qDi(d)?`Tu, ${qDi(d).nome}`:'Tu'} e il resto del reparto avete dato tutto quello che avevate. ${d.p.nome} aspetta in sala riunioni con il cliente.`,cond:()=>!!S.lavoro,c:[
  {l:'Presenti tu il lavoro',pers:{E:2},fx:d=>consegna(d,1)},
  {l:'Lasci la parola al collega',pers:{A:2},fx:d=>consegna(d,2)},
  {l:'Lasci presentare il capo',pers:{A:1,E:-1},fx:d=>consegna(d,3)}]});
function consegna(d,mod3){
  const L=S.lavoro,q=qDi(d);if(!L)return ['Il progetto si chiude senza di te.',''];
  const v=(d.x.s||0)+(L.perf-60)/40+r(-8,8)/10+(mod3===1?.2:0);
  const capo=d.p;
  if(v>=1.4){
    L.perf=clamp(L.perf+14);L.anniLiv=Math.max(L.anniLiv,2);relD(capo,10);if(q)relD(q,6);mod('felicita',6);
    ricorda(capo,'Il progetto è stato un successo grazie a te',3);
    return [`Il cliente firma. ${capo.nome} ti stringe la mano davanti a tutti${q?` e cita anche ${q.nome}`:''}. Il tuo nome gira ai piani alti.`,'g'];
  }
  if(v>=0){
    L.perf=clamp(L.perf+5);relD(capo,3);if(q)relD(q,3);
    return ['Il cliente è soddisfatto, a metà. Qualcosa da rivedere, ma il progetto si chiude e nessuno si fa male.','g'];
  }
  L.perf=clamp(L.perf-9);relD(capo,-8);pesa(5,2);
  ricorda(capo,'Il progetto è andato male',-2);
  return [`Il cliente non è contento e ${capo.nome} lo sa. Nei giorni dopo si cerca qualcuno a cui dare la colpa.`,'b'];
}

/* ---------- Seconda catena: la riorganizzazione ---------- */
ev({id:'prg_riorg1',link:1,k:'La riorganizzazione',t:'Girano delle voci',x:'Alla macchinetta del caffè si parla a bassa voce: l\'azienda sta per riorganizzare i reparti. Nessuno sa niente, ma tutti sanno qualcosa.',cond:()=>!!S.lavoro,c:[
  {l:'Chiedi al capo cosa succede',pers:{E:2},fx:d=>{const ok=chance(.5+capoEsito()*.2);if(d.p)relD(d.p,ok?3:-2);futuro(.5,'prg_riorg2',{p:d.p,x:{a:ok?1:0}});return [ok?`${d.p.nome} ti dice quello che può: «Non preoccuparti, parleremo con tutti.»`:'«Non so niente», risponde. Non sembra vero.',ok?'g':'b']}},
  {l:'Ti fai vedere di più',pers:{C:2},fx:d=>{pesa(4,1);if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+3);futuro(.5,'prg_riorg2',{p:d.p,x:{a:1}});return ['Prima in ufficio, ultimo a uscire. Se ne accorgono.','']}},
  {l:'Aggiorni il curriculum, per sicurezza',pers:{N:1,O:1},fx:d=>{S.fatti.cercaAltro=S.t;futuro(.5,'prg_riorg2',{p:d.p,x:{a:2}});return ['Non si sa mai. Lo apri e lo chiudi quattro volte in una settimana.','']}},
  {l:'Fai finta di niente',pers:{E:-1},fx:d=>{futuro(.5,'prg_riorg2',{p:d.p,x:{a:0}});return ['Le voci passano. Poi tornano, più forti.','']}}]});

ev({id:'prg_riorg2',link:1,k:'La riorganizzazione',t:'I colloqui',x:d=>`${cap(chiCapo(d.p))} convoca tutti, uno alla volta. Il tuo turno è alle quattro. In sala riunioni c'è un foglio con scritti dei nomi, e il tuo è stato cancellato e riscritto.`,cond:()=>!!S.lavoro,c:[
  {l:'Ti presenti preparat{o}, con i numeri',pers:{C:3},fx:d=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+2);futuro(.4,'prg_riorg3',{p:d.p,x:{a:d.x.a,m:1}});return ['Porti un foglio con i risultati degli ultimi due anni. Il capo annuisce a lungo.','g']}},
  {l:'Dici cosa vorresti fare davvero',pers:{E:2,O:2},fx:d=>{futuro(.4,'prg_riorg3',{p:d.p,x:{a:d.x.a,m:2}});return ['Parli di quello che ti interessa, non di quello che ti hanno assegnato. Qualcuno ascolta.','']}},
  {l:'Ascolti e basta',pers:{A:1,E:-1},fx:d=>{futuro(.4,'prg_riorg3',{p:d.p,x:{a:d.x.a,m:0}});return ['«Le faremo sapere.» Esci con la sensazione di non aver detto niente.','']}}]});

ev({id:'prg_riorg3',link:1,k:'La riorganizzazione',t:'Il nuovo assetto',x:()=>`Arriva ${S.anno>=1999?'l\'email':'la circolare'} con il nuovo organigramma. Ti serve un respiro lungo prima di ${S.anno>=1999?'aprirla':'leggerla'}.`,cond:()=>!!S.lavoro,c:[
  {l:()=>S.anno>=1999?'La apri':'La leggi',fx:d=>{
    const L=S.lavoro,x=d.x||{};
    if(!L)return ['Nel frattempo hai cambiato strada: la riorganizzazione non ti riguarda più.',''];
    const j=JOB[L.id];
    const punti=(x.a||0)*.4+(x.m===1?.6:x.m===2?.3:0)+(L.perf-60)/60+capoEsito()*.3+r(-6,6)/10-(S.mondo.crisi?.5:0);
    if(punti>=.9&&L.liv<j.liv.length-1&&mancanti(j.promo&&j.promo[L.liv+1]).length===0){
      L.liv++;L.anniLiv=0;L.stip=Math.round(stipLiv(j,L.liv)*(1+r(0,6)/100)*fattoreGenere()*fattoreZona(j));L.nome=nomeJob(j,L.liv);S.ultimoLavoro=L.nome;mod('felicita',8);
      return [`Nel nuovo organigramma c'è il tuo nome, un livello sopra. Diventi ${L.nome.toLowerCase()}, con una RAL di ${eur(L.stip)}.`,'g'];
    }
    if(punti>=.1){mod('felicita',2);return ['Il tuo nome è dove l\'aspettavi, con qualche collega nuovo accanto. Cambiano le scrivanie, il lavoro resta quello.','']}
    if(punti>=-.6||!L.contratto||L.contratto.t!=='ind'){L.perf=clamp(L.perf-3);pesa(4,2);return ['Ti spostano in un altro reparto, con un capo che non conosci. Non è una punizione, ma ci somiglia.','b']}
    licenzia('Nella riorganizzazione il tuo posto viene tagliato.');segnaVita('licenziato');soldi(P(3000));
    return [`Il tuo posto non c'è più. Ti offrono un incentivo di ${eur(P(3000))} e una stretta di mano.`,'b'];
  }}]});

/* ---------- Quando e con chi: eventoLavoro() (c10_squadra.js) sceglie qui, circa una volta ogni 7–8 anni per evento ---------- */
const soloColl=sq=>!sportSq()&&sq.colleghi.length>0;
const unColl=sq=>({p:pick(sq.colleghi)});
const COL_EV=[
  {id:'col_capo_nota',w:3,rip:5,ok:sq=>!!sq.capo&&!sportSq(),d:sq=>({p:sq.capo})},
  {id:'col_capo_scarica',w:2,rip:6,ok:sq=>!!sq.capo&&!sportSq()&&(sq.capo.pers.A<55||sq.capo.pers.C<45),d:sq=>({p:sq.capo})},
  {id:'col_straordinari',w:2,rip:6,ok:sq=>!!sq.capo&&!sportSq()&&S.lavoro.contratto&&S.lavoro.contratto.t!=='piva',d:sq=>({p:sq.capo})},
  {id:'col_copri',w:3,rip:4,ok:soloColl,d:sq=>{const p=pick(sq.colleghi);return {p,x:{c:p.figliN>0&&chance(.6)?'il bambino ha la febbre e deve restare a casa':pick(['ha una visita medica che non riesce a spostare','è in pieno trasloco e non ce la fa','deve accompagnare la madre in ospedale'])}}}},
  {id:'col_promosso',w:2,rip:6,ok:sq=>sq.colleghi.length>0,d:unColl},
  {id:'col_licenziato',w:()=>1+(S.mondo.crisi?3:0),rip:6,ok:soloColl,d:unColl},
  {id:'col_cena',w:2,rip:5,ok:sq=>!sportSq()&&sq.colleghi.length>=2&&S.soldi>=P(60)&&S.eta>=20,d:()=>({})},
  {id:'col_confida',w:3,rip:4,ok:sq=>sq.colleghi.length>0,d:sq=>{const p=pick(sq.colleghi);return {p,x:{c:pick(['si sta separando e non sa a chi dirlo','non dorme da settimane per i soldi','ha avuto un\'offerta da un\'altra azienda e non sa se accettare','ha ricevuto una diagnosi che non ha ancora detto a casa'])}}}},
  {id:'col_lite',w:2,rip:5,ok:sq=>sq.colleghi.length>=2,d:sq=>{const c=sq.colleghi.slice().sort(()=>Math.random()-.5);return {p:c[0],q:c[1]}}},
  {id:'col_neonato',w:1,rip:4,ok:sq=>!sportSq()&&sq.colleghi.some(p=>p.eta>=24&&p.eta<=42&&!(p.neoT&&S.t-p.neoT<24)),d:sq=>{const p=pick(sq.colleghi.filter(p=>p.eta>=24&&p.eta<=42&&!(p.neoT&&S.t-p.neoT<24)));p.figliN=(p.figliN||0)+1;p.neoT=S.t;return {p}}},
  {id:'prg_riorg1',w:()=>8+(S.mondo.crisi?4:0),rip:8,ok:sq=>!!sq.capo&&!sportSq()&&S.lavoro.contratto&&S.lavoro.contratto.t==='ind'&&S.lavoro.anni>=2&&!JOB[S.lavoro.id].conc,d:sq=>({p:sq.capo})}
];
const salutaVia=p=>{p.lav.via=S.t;p.stato='disoccupato';p.lavT=0};
