/* ================= ITALIA: storia vera, prezzi, lavoro e welfare, pensioni, eredità =================
   Fonti e numeri in ANALISI.md. Fino al 2026 (ANNO_OGGI) il mondo segue la storia vera; dopo è inventato. */
const ANNO_OGGI=2026;

/* ---------- Prezzi: inflazione vera (ISTAT, indice NIC, media annua) ---------- */
/* 1950–1954: coefficienti FOI (Camera di commercio di Cremona); 1955–1999: ISTAT, indice NIC, media annua (rivaluta.it) */
const INFL_PRIMA={1950:-1.3,1951:9.7,1952:4.2,1953:1.9,1954:2.7,1955:2.3,1956:3.4,1957:1.3,1958:2.9,1959:-.5,1960:2.4,1961:2.1,1962:4.7,1963:7.5,1964:5.9,1965:4.5,1966:2.3,1967:3.7,1968:1.3,1969:2.7,1970:5,1971:4.8,1972:5.7,1973:10.8,1974:19.2,1975:17,1976:16.7,1977:17,1978:12.1,1979:14.8,1980:21.2,1981:17.8,1982:16.5,1983:14.7,1984:10.8,1985:9.2,1986:5.8,1987:4.7,1988:5.1,1989:6.3,1990:6.5,1991:6.3,1992:5.3,1993:4.6,1994:4.1,1995:5.2,1996:4,1997:2,1998:2,1999:1.7};
const INFL_VERA={2000:2.5,2001:2.7,2002:2.5,2003:2.7,2004:2.2,2005:1.9,2006:2.1,2007:1.8,2008:3.3,2009:.8,2010:1.5,2011:2.8,2012:3.0,2013:1.2,2014:.2,2015:.1,2016:-.1,2017:1.2,2018:1.2,2019:.6,2020:-.2,2021:1.9,2022:8.1,2023:5.7,2024:1.0,2025:1.5};
/* Livello dei prezzi a gennaio di un anno rispetto a oggi (2026 = 1). Tutti gli importi del gioco sono scritti ai prezzi di oggi. */
function ipAnno(a){let x=1;for(let y=Math.max(1950,a);y<ANNO_OGGI;y++)x/=1+(INFL_VERA[y]??INFL_PRIMA[y]??0)/100;return x}
const passato=()=>S.anno<=ANNO_OGGI;

/* ---------- La storia vera, mese per mese ---------- */
const inReg0=(...rr)=>()=>rr.includes(luogo().reg);
const STORIA=[
  {a:1951,m:10,t:'Il Po rompe gli argini: il Polesine finisce sott\'acqua.',ev:'alluvione',dove:inReg0('Veneto')},
  {a:1954,m:0,t:'Nasce la televisione italiana: la RAI trasmette il primo programma. Chi ha un televisore invita i vicini.'},
  {a:1956,m:0,t:'Olimpiadi invernali a Cortina d\'Ampezzo.'},
  {a:1957,m:1,t:'Arriva Carosello: dopo la pubblicità, tutti i bambini a letto.'},
  {a:1957,m:6,t:'Esce la Fiat Nuova 500: l\'automobile diventa per tutti.'},
  {a:1960,m:7,t:'Olimpiadi di Roma: Abebe Bikila vince la maratona a piedi nudi sull\'Appia Antica.'},
  {a:1963,m:9,t:'Il disastro del Vajont: una frana nel lago della diga e l\'onda cancella Longarone.'},
  {a:1964,m:9,t:'Inaugurata l\'Autostrada del Sole: da Milano a Napoli senza un semaforo.'},
  {a:1966,m:10,t:'L\'Arno esonda: Firenze sott\'acqua. Da tutto il mondo arrivano gli «angeli del fango».',ev:'alluvione',dove:inReg0('Toscana')},
  {a:1968,m:2,t:'Il Sessantotto: occupazioni nelle università e nei licei, cortei in tutte le città.'},
  {a:1969,m:6,t:'L\'uomo sbarca sulla Luna: mezza Italia resta sveglia davanti alla televisione.'},
  {a:1969,m:11,t:'Una bomba in piazza Fontana, a Milano: comincia la stagione degli «anni di piombo».'},
  {a:1970,m:4,t:'Approvato lo Statuto dei lavoratori.'},
  {a:1970,m:5,t:'Italia-Germania 4-3 ai Mondiali in Messico: la «partita del secolo».',fx:()=>{if(S.eta>=6)mod('felicita',3)}},
  {a:1970,m:11,t:'Approvata la legge sul divorzio.'},
  {a:1973,m:11,t:'Crisi del petrolio: austerità e domeniche a piedi, le strade sono delle biciclette.',fx:()=>{S.mondo.crisi=2}},
  {a:1974,m:4,t:'Referendum sul divorzio: vince il «no» all\'abrogazione. Il divorzio resta.'},
  {a:1976,m:4,t:'Il terremoto del Friuli: quasi mille morti, paesi interi da ricostruire.',ev:'terremoto',dove:inReg0('Friuli-Venezia Giulia')},
  {a:1978,m:2,t:'Le Brigate Rosse rapiscono Aldo Moro in via Fani.'},
  {a:1978,m:4,t:'Aldo Moro viene ucciso. Lo stesso mese il Parlamento approva la legge 194.'},
  {a:1978,m:11,t:'Nasce il Servizio sanitario nazionale: cure per tutti, non più le mutue.'},
  {a:1980,m:7,t:'Una bomba nella sala d\'aspetto della stazione di Bologna: 85 morti.'},
  {a:1980,m:10,t:'Il terremoto dell\'Irpinia.',ev:'terremoto',dove:inReg0('Campania','Basilicata')},
  {a:1982,m:6,t:'L\'Italia è campione del mondo in Spagna! Pertini esulta in tribuna, Tardelli urla dopo il gol.',fx:()=>{if(S.eta>=4)mod('felicita',5)}},
  {a:1986,m:3,t:'Il disastro di Chernobyl: per settimane niente verdura a foglia e latte fresco.'},
  {a:1989,m:10,t:'Cade il muro di Berlino.'},
  {a:1990,m:5,t:'I Mondiali si giocano in Italia: le «notti magiche» e i gol di Totò Schillaci.',fx:()=>{if(S.eta>=4)mod('felicita',2)}},
  {a:1992,m:1,t:'Arrestato Mario Chiesa: comincia Mani pulite, l\'inchiesta su Tangentopoli.'},
  {a:1992,m:4,t:'Strage di Capaci: la mafia uccide Giovanni Falcone, la moglie e la scorta.'},
  {a:1992,m:6,t:'Strage di via D\'Amelio: ucciso Paolo Borsellino.'},
  {a:1992,m:8,t:'La lira esce dallo SME e si svaluta: arriva una manovra «lacrime e sangue».',fx:()=>{S.mondo.crisi=2}},
  {a:1994,m:6,t:'Mondiali negli Stati Uniti: l\'Italia perde la finale ai rigori, Baggio sbaglia l\'ultimo.'},
  {a:1997,m:8,t:'Terremoto in Umbria e nelle Marche: crolla parte della volta della basilica di Assisi.',ev:'terremoto',dove:inReg0('Umbria','Marche')},
  {a:1999,m:0,t:'Nasce l\'euro, per ora solo nelle banche: in tasca restano le lire fino al 2002.'},
  {a:2002,m:0,t:'Arriva l\'euro: un euro vale 1.936,27 lire. Per mesi tutti rifanno i conti a mente.'},
  {a:2005,m:0,t:'Il servizio militare non è più obbligatorio: niente più naja.'},
  {a:2006,m:6,t:'L\'Italia è campione del mondo! Finale ai rigori a Berlino, notte di festa in tutte le piazze.',fx:()=>{if(S.eta>=4)mod('felicita',5)}},
  {a:2008,m:8,t:'Fallisce la banca americana Lehman Brothers: comincia la grande crisi finanziaria.',fx:()=>{S.mondo.crisi=2}},
  {a:2009,m:3,t:'Un terremoto devasta L\'Aquila.',ev:'terremoto',dove:inReg0('Abruzzo')},
  {a:2011,m:10,t:'Crisi dello spread: lo Stato taglia la spesa e alza le tasse. Arriva la riforma delle pensioni.',fx:()=>{S.mondo.crisi=3}},
  {a:2012,m:4,t:'Due forti scosse di terremoto colpiscono l\'Emilia.',ev:'terremoto',dove:inReg0('Emilia-Romagna')},
  {a:2016,m:4,t:'Approvata la legge sulle unioni civili: anche le coppie dello stesso sesso possono unirsi in Comune.'},
  {a:2016,m:7,t:'Un terremoto distrugge Amatrice e i paesi intorno.',ev:'terremoto',dove:inReg0('Lazio','Marche','Umbria','Abruzzo')},
  {a:2018,m:7,t:'A Genova crolla il ponte Morandi.'},
  {a:2019,m:3,t:'Parte il reddito di cittadinanza.'},
  {a:2020,m:1,t:'Un nuovo virus arriva in Italia: comincia la pandemia.',fx:()=>{S.mondo.pandemia=2}},
  {a:2020,m:2,t:'Lockdown: l\'Italia intera resta a casa.',ev:'lockdown',dove:()=>S.eta>=3},
  {a:2021,m:6,t:'L\'Italia è campione d\'Europa! Rigori a Wembley e caroselli fino all\'alba.',fx:()=>{if(S.eta>=4)mod('felicita',4)}},
  {a:2022,m:1,t:'La Russia invade l\'Ucraina. Bollette e prezzi schizzano in alto.'},
  {a:2022,m:2,t:'Arriva l\'Assegno unico per i figli.'},
  {a:2023,m:4,t:'Un\'alluvione mette in ginocchio la Romagna.',ev:'alluvione',dove:inReg0('Emilia-Romagna')},
  {a:2024,m:0,t:'Il reddito di cittadinanza lascia il posto all\'Assegno di inclusione.'},
  {a:2026,m:1,t:'Olimpiadi invernali a Milano e Cortina.'}
];
const ELEZIONI_VERE=[[1953,5],[1958,4],[1963,3],[1968,4],[1972,4],[1976,5],[1979,5],[1983,5],[1987,5],[1992,3],[1994,2],[1996,3],[2001,4],[2006,3],[2008,3],[2013,1],[2018,2],[2022,8]];
function storiaMese(){
  if(!passato())return;
  for(const s of STORIA){
    if(s.a!==S.anno||s.m!==S.mese)continue;
    notizia(s.t);if(s.fx)s.fx();
    if(s.ev&&EV[s.ev]&&(!s.dove||s.dove())&&S.carcere===0)coda.push({e:EV[s.ev],d:{}});
  }
  if(ELEZIONI_VERE.some(([a,m])=>a===S.anno&&m===S.mese))elezioniPolitiche();
}

/* ---------- Contratti di lavoro ----------
   A termine: 14,7% dei dipendenti nel 2024, 28% sotto i 35 anni (ISTAT); al massimo 24 mesi, poi o si viene stabilizzati o si resta a casa.
   Apprendistato sotto i 30 anni (3 anni, poi quasi sempre la conferma). Partita IVA per le professioni (regime forfettario fino a 85.000 €).
   Il part-time si può chiedere (60% di ore e stipendio): in Italia lo fa il 30% delle donne occupate e il 7,5% degli uomini. */
const PIVA=['avv','comm','arc','psi','notaio','agcom','guida','taxi','pt','mus','att','crea'];
const PIVA_LIV={idra:2,elet:2,mecc:2,fale:2,pane:2,macel:2,past:2,este:2,fisio:2,vet:2,dent:2,bracc:2,camion:2};   // il livello in cui ci si mette in proprio
const STAGIONALI=['anim','bagn','bracc'];
const SPORTIVI=['calc','volley','cicl','tennis'];
const ralEff=L=>L?L.stip*(L.ptv?.6:1):0;                     // stipendio vero, con il part-time
const isPiva=L=>!!(L&&L.contratto&&L.contratto.t==='piva');
const fattoreGenere=()=>S.sesso==='F'?.96:1;                 // a parità di ora le donne guadagnano circa il 5% in meno (ISTAT 2022: 5,6%)
function contrattoIniziale(j,liv){
  if(j.elez)return {t:'carica'};
  if(PIVA.includes(j.id)||(PIVA_LIV[j.id]!==undefined&&liv>=PIVA_LIV[j.id]))return {t:'piva',da:S.t};
  if(['ins','maes'].includes(j.id))return {t:'det',fine:S.t+12,mesi:0,pror:0,scuola:1};
  if(j.conc)return {t:'ind'};
  if(SPORTIVI.includes(j.id))return {t:'det',fine:S.t+24,mesi:0,pror:0,sport:1};
  if(STAGIONALI.includes(j.id)||j.pt)return {t:'det',fine:S.t+(j.pt?12:6),mesi:0,pror:0};
  const e=S.eta,pA=e<30&&!(j.req&&j.req.lau)?.15:0,pD=e<30?.7:e<45?.6:.5,x=Math.random();   // circa 7 assunzioni su 10 sono a termine
  if(x<pA)return {t:'app',fine:S.t+36};
  if(x<pA+pD)return {t:'det',fine:S.t+pick([3,6,6,12,12,24]),mesi:0,pror:0};
  return {t:'ind'};
}
function descrContratto(L){const s=descrContratto0(L);return L&&L.cig>0?s+` · in cassa integrazione (${L.cig} ${L.cig===1?'mese':'mesi'})`:s}
function descrContratto0(L){
  const c=L&&L.contratto;if(!c)return 'Tempo indeterminato';
  const quando=t=>{const k=S.mese+(t-S.t);return `${MESI[((k%12)+12)%12]} ${S.anno+Math.floor(k/12)}`};
  const pt=L.ptv?' · part-time':'';
  if(c.t==='det')return `A tempo determinato fino a ${quando(c.fine)}${c.pror?` (proroga ${c.pror})`:''}${pt}`;
  if(c.t==='app')return `Apprendistato fino a ${quando(c.fine)}${pt}`;
  if(c.t==='piva')return `Partita IVA${(S.t-(c.da||S.t))<60?' · regime forfettario al 5% (primi 5 anni)':' · regime forfettario'}`;
  if(c.t==='carica')return 'Carica elettiva: ogni 5 anni si vota';
  return 'Tempo indeterminato'+pt;
}
/* ogni mese: scadenze, proroghe, stabilizzazioni, licenziamenti. Ritorna true se il lavoro è finito */
function meseContratto(){
  const L=S.lavoro;if(!L)return false;
  if(!L.contratto)L.contratto={t:'ind'};
  const c=L.contratto,M=S.mondo;
  if(c.t==='det'){
    c.mesi=(c.mesi||0)+1;if(S.t<c.fine)return false;
    if(c.scuola){if(L.liv>=1){L.contratto={t:'ind'};log('Passi di ruolo: ora sei a tempo indeterminato.','g');mod('felicita',8);return false}
      if(chance(.9)){c.fine=S.t+12;c.pror=(c.pror||0)+1;log('Anche quest\'anno arriva la supplenza: altro contratto fino a giugno, poi si vedrà.','h');return false}
      licenzia('Quest\'anno la supplenza non arriva.');return true}
    if(c.sport){if(chance(.7+(L.perf-60)/300)){c.fine=S.t+24;log('La squadra ti rinnova il contratto per altri due anni.','g');return false}licenzia('La squadra non ti rinnova il contratto.');return true}
    const pInd=Math.max(.03,Math.min(.8,(c.mesi>=24?.25:.05)+(L.perf-60)/250+(M.crisi?-.1:0)+(M.boom?.08:0)))*occZona().stab;
    if(!STAGIONALI.includes(L.id)&&!JOB[L.id].pt&&chance(pInd)){L.contratto={t:'ind'};mod('felicita',8);S.bis.stress=clamp(S.bis.stress-6);log('Ti trasformano il contratto: tempo indeterminato! Finalmente.','g');return false}
    if(c.mesi<24&&(c.pror||0)<4&&chance(.6)){const n=pick([6,12]);c.fine=S.t+n;c.pror=(c.pror||0)+1;log(`Il contratto a termine viene prorogato di ${n} mesi.`,'h');return false}
    licenzia(STAGIONALI.includes(L.id)?'Finisce la stagione, e con lei il contratto.':'Il contratto a termine scade e non viene rinnovato.');return true;
  }
  if(c.t==='app'&&S.t>=c.fine){
    if(chance(.75+(L.perf-60)/200)){L.contratto={t:'ind'};log('Finisce l\'apprendistato: ti confermano a tempo indeterminato.','g');mod('felicita',6);return false}
    licenzia('Finisce l\'apprendistato e non ti confermano.');return true;
  }
  if(c.t==='ind'&&!JOB[L.id].conc&&chance(.0035*(M.crisi?2:1)*(S.eta<35?1.8:1)*occZona().perdi))   // licenziamenti e chiusure: circa 4% l'anno
{if(puoCIG()&&chance(.4)){chiediCIG();return false}licenzia(pick(['L\'azienda chiude e resti senza lavoro.','Riorganizzazione: il tuo posto viene tagliato.']));return true}
  return false;
}
/* Netto della partita IVA: regime forfettario (78% di redditività, 26% di contributi, imposta al 5% per 5 anni, poi 15%) fino a 85.000 € */
function nettoPiva(l,L){
  if(l<=0)return 0;
  if(l<=85000*fattoreFisco()){const imp=l*.78,contr=imp*.26,anni=(S.t-((L&&L.contratto&&L.contratto.da)||S.t))/12;return Math.round(l-contr-(imp-contr)*(anni<5?.05:.15))}
  return Math.round(netto(l)*.9);
}
/* Part-time imposto: in commercio, pulizie, ristorazione e assistenza molti posti sono solo part-time, e li accettano soprattutto donne
   (part-time involontario: 13,7% delle occupate contro 4,6% degli occupati, ISTAT 2024) */
const PT_LAVORO={cass:.45,puli:.5,callc:.45,colf:.4,com:.3,cam:.3,este:.3,edu:.3,oss:.2,segr:.15,inf:.1,imp:.1,badante:.15,past:.15,pane:.1,maes:.1,mag:.1};
const ptIniziale=j=>j.pt||j.conc||j.elez||PIVA.includes(j.id)?0:Math.min(.75,(PT_LAVORO[j.id]||.06)*(S.sesso==='F'?2.5:1));
/* Part-time a richiesta: l'azienda può dire di no (più facile con un figlio piccolo) */
function chiediPartTime(maternita){
  const L=S.lavoro;if(!L)return ['Non hai un lavoro.','x'];if(L.ptv)return ['Sei già in part-time.','x'];
  if(JOB[L.id].pt||isPiva(L))return ['Con questo lavoro gli orari li decidi già tu.','x'];
  if(chance(maternita||vivi(['Figlio']).some(f=>f.eta<12&&!f.conEx)?.8:.55)){L.ptv=true;return [`${maternita?'Rientri':'Passi'} in part-time: circa ${oreLavoro()} ore a settimana e il 60% dello stipendio. Più tempo per la vita, meno soldi, e la carriera rallenta.`,'']}
  return ['L\'azienda dice di no: per il tuo ruolo serve il tempo pieno.','b'];
}
function tornaTempoPieno(){const L=S.lavoro;if(!L||!L.ptv)return ['Lavori già a tempo pieno.','x'];if(chance(.5)){L.ptv=false;return ['Torni a tempo pieno: più ore, stipendio intero.','g']}return ['Per ora non c\'è un posto a tempo pieno: riprova più avanti.','b']}
/* Le carriere: più lente in part-time e durante il congedo; per le donne, ai livelli alti, un po' più lente («soffitto di cristallo») */
const fattoreCarriera=L=>(L.ptv?.5:1)*(S.sesso==='F'&&L.liv>=1?.85:1)*(S.fatti.congedo>S.t?0:1);

/* ---------- Lavoro: mesi lavorati, TFR, NASpI ---------- */
/* Ogni mese: storico degli ultimi 48 mesi (per la NASpI), TFR che matura, montante dei contributi (per la pensione) */
function meseItalia(){
  S.lav48=(S.lav48||[]).concat(S.lavoro?1:0).slice(-48);
  const L=S.lavoro;
  if(L){const m0=S.montante||0;if(isPiva(L))S.montante=m0+ralEff(L)*.78*.26/12;else{L.tfr=(L.tfr||0)+ralEff(L)/13.5/12;S.montante=m0+ralEff(L)*.33/12}
    S.fatti.ultimaRAL=ralEff(L);
    if(retributivo()&&!isPiva(L)){S.anniRetr=(S.anniRetr||0)+(JOB[L.id].pt?.5:1)/12;S.montRetr=(S.montRetr||0)+(S.montante-m0)}}
  if(S.azienda&&S.azienda.compenso)S.montante=(S.montante||0)+S.azienda.compenso*.24/12;
  if(S.naspi){S.naspi.m++;if(S.naspi.m>S.naspi.mesi||S.lavoro){if(!S.lavoro)log(`Finisce ${S.naspi.nome&&S.naspi.nome!=='NASpI'?(S.naspi.nome==='ASpI'?'l\'ASpI':'l\'indennità di disoccupazione'):'la NASpI'}.`,'h');S.naspi=null}}
  if(S.sfl){S.sfl.m++;if(S.sfl.m>S.sfl.mesi||S.lavoro){if(!S.lavoro)log('Finisce il corso, e con lui il Supporto formazione e lavoro.','h');S.sfl=null}}
  if(S.fatti.congedo&&S.fatti.congedo===S.t+1&&S.sesso==='F'&&S.lavoro&&!JOB[S.lavoro.id].pt&&S.t-(S.fatti.rientroT||-99)>12){S.fatti.rientroT=S.t;coda.push({e:EV.rientro_lavoro,d:{}})}
  if(S.fatti.congedo&&S.fatti.congedo===S.t){S.fatti.congedo=0;S.fatti.congedoQuota=0;log('Finisce il congedo: si torna al lavoro.','h')}
  meseScreening();controllaRitorno();
}
/* La liquidazione (TFR) quando un lavoro finisce, per qualsiasi motivo */
function pagaTFR(){
  const L=S.lavoro;if(!L||!L.tfr)return;
  const x=Math.round(L.tfr*.77);L.tfr=0;if(x<50)return;
  soldi(x);log(`Ricevi ${S.anno>=1982?'il TFR, la liquidazione':'la liquidazione'}: ${eur(x)} netti.`,'g');
}
/* NASpI: a chi perde il lavoro senza averlo lasciato. Il 75% dello stipendio (con un tetto), per metà dei mesi lavorati negli ultimi 4 anni */
/* prima della NASpI (2015): ASpI nel 2013–2014, prima ancora l'indennità di disoccupazione ordinaria, molto più bassa e più corta
   (circa: fino al 1987 poche lire al giorno, poi il 7,5% e il 20–30% dello stipendio, il 40% dal 2001, il 50–60% dal 2005–2008) */
const nomeDisoccupazione=()=>S.anno>=2015?'NASpI':S.anno>=2013?'ASpI':'indennità di disoccupazione';
function avviaNaspi(L){
  const n=(S.lav48||[]).reduce((s,x)=>s+x,0);
  if(n<3||!L)return;
  const lordo=ralEff(L)/12,soglia=P(1460),cap=P(1585),a=S.anno;
  let imp,mesi;
  if(a>=2013){imp=Math.min(cap,lordo<=soglia?lordo*.75:soglia*.75+(lordo-soglia)*.25);mesi=a>=2015?Math.min(24,Math.floor(n/2)):Math.min(S.eta>=55?14:12,Math.floor(n/2))}
  else{const q=a<1988?.05:a<2001?.25:a<2005?.4:a<2008?.5:.6;imp=Math.min(cap,lordo*q);mesi=S.eta>=50?(a<2001?9:12):(a<2001?6:8)}
  S.naspi={mesi,imp:Math.round(imp*.88),m:0,over55:S.eta>=55,nome:nomeDisoccupazione()};
  log(`Fai domanda ${a>=2013?'di '+S.naspi.nome:"per l'indennità di disoccupazione"}: circa ${eur(S.naspi.imp)} netti al mese per ${S.naspi.mesi} mesi${a>=2015?' (dal sesto mese cala del 3% ogni mese)':''}.`,'h');
}
const naspiMese=()=>S.naspi?Math.round(S.naspi.imp*(S.naspi.nome&&S.naspi.nome!=='NASpI'?1:Math.pow(.97,Math.max(0,S.naspi.m-(S.naspi.over55?7:5))))):0;

/* ---------- Pensioni (sistema contributivo, chi nasce dal 2000) ----------
   Vecchiaia a 67 anni con 20 di contributi; anticipata con 42 anni e 10 mesi (41 e 10 le donne) a qualsiasi età;
   a 71 anni bastano 5 anni. Importo = montante × coefficiente di trasformazione (biennio 2025–2026). */
const COEFF_TRASF={57:4.204,58:4.308,59:4.419,60:4.536,61:4.661,62:4.795,63:4.936,64:5.088,65:5.250,66:5.423,67:5.608,68:5.808,69:6.024,70:6.258,71:6.510};
function pensioneMaturata(){
  const c=S.contributi||0,e=S.eta,R=requisitiPensione();
  if(e>=R.vec&&c>=R.vecC)return 'vecchiaia';
  if(c>=R.ant)return 'anticipata';
  if(R.quota&&c>=R.quota[0]&&e>=R.quota[1])return 'anticipata';
  if(e>=Math.max(R.vec,67)+4&&c>=5)return 'vecchiaia';
  return '';
}
function nettoPensione(l){if(l<=0)return 0;const t=Math.max(0,irpef(l)-detrazione(l))+l*.02;return Math.round(l-t)}
function pensioneCalcolata(){
  const k=COEFF_TRASF[Math.max(57,Math.min(71,S.eta))]/100;
  // gli anni nel retributivo valgono il 2% dell'ultimo stipendio l'uno; il resto è contributivo
  const retr=(S.anniRetr||0)*.02*(S.fatti.ultimaRAL||0);
  return nettoPensione(Math.max(0,(S.montante||0)-(S.montRetr||0))*k+retr);
}
function vaiInPensione(auto){
  const tipo=pensioneMaturata();
  pagaTFR();
  if(S.lavoro){S.storico.push(S.lavoro.nome);S.lavoro=null}
  S.pensione=Math.max(1,pensioneCalcolata());S.fatti.pensioneTipo=tipo;
  log(`${auto?'Arriva la pensione':'Vai in pensione'} (${tipo==='anticipata'?'anticipata':'di vecchiaia'}, ${Math.round(S.contributi)} anni di contributi): ${eur(S.pensione/13)} netti al mese per 13 mensilità.`,'g');
  momento('pensione',{tit:'In pensione',sub:`Dopo ${Math.round(S.contributi)} anni di contributi`,txt:`${eur(S.pensione/13)} netti al mese. ${S.ultimoLavoro?`L'ultimo giorno da ${S.ultimoLavoro.toLowerCase()}: una torta, un regalo dai colleghi e la scrivania vuota.`:'Da domani il tempo è tutto tuo.'}`});
}
/* Assegno sociale: dai 67 anni a chi ha redditi bassi (7.101 € l'anno nel 2026) */
const ASSEGNO_SOCIALE=7101;
/* La pensione di una persona del gioco (per la reversibilità e per pagare la badante o la RSA) */
function pensioneNpc(p){
  if(p.pensioneNpc)return p.pensioneNpc;
  const j=JOB[p.lavoro]||null;
  let l=j?stipLiv(j,1)*.6:0;
  if(!j&&p.stato==='casa')l=0;
  p.pensioneNpc=Math.max(P(ASSEGNO_SOCIALE),nettoPensione(l));
  return p.pensioneNpc;
}
/* Reversibilità: il 60% della pensione del coniuge, ridotta se hai già redditi alti */
function avviaReversibilita(p){
  if(p.eta<40&&p.stato!=='pensione')return;
  const mio=ralEff(S.lavoro)+(S.pensione||0),min=P(7800);
  const rid=mio>5*min?.5:mio>4*min?.6:mio>3*min?.75:1;
  S.reversibilita=Math.round(pensioneNpc(p)*.6*rid);
  log(`Ti spetta la pensione di reversibilità di ${p.nome}: ${eur(S.reversibilita/13)} al mese.`,'h');
}

/* ---------- Sussidi ---------- */
/* Un ISEE approssimato: redditi della famiglia + 20% dei risparmi, diviso per la scala di equivalenza */
function minoriConTe(){return vivi(['Figlio']).filter(f=>f.eta<18&&!f.fuori&&!f.conEx).length}
function iseeStima(){
  const pa=partnerAttuale(),conv=pa&&pa.conv;
  const red=(S.lavoro?netto(ralEff(S.lavoro)):0)+(S.pensione||0)+(conv?(pa.stato==='lavora'?P(20000):0):0)+(S.prop.filter(p=>p.affittata).reduce((s,p)=>s+p.valore*.045,0));
  const n=1+(conv?1:0)+minoriConTe();
  const scala=[1,1,1.57,2.04,2.46,2.85][Math.min(5,n)];
  return (red+Math.max(0,S.soldi)*.2)/scala;
}
/* ADI (dal 2024): solo famiglie con minori, over 60 o disabili. Reddito di cittadinanza (2019–2023): tutte le famiglie povere */
function sussidio(){
  if(S.eta<18||S.carcere>0||S.pensione||S.lavoro&&!JOB[S.lavoro.id].pt||S.azienda||S.crim.clan)return null;
  if(iscritto()&&S.eta<26)return null;
  const a=S.anno;if(a<2019)return null;
  const rdc=a<2024,min=minoriConTe(),pa=partnerAttuale();
  if(!rdc&&!(min>0||S.eta>=60))return null;
  if(S.eta>=S.mondo.pensEta)return null;
  if(iseeStima()>P(10140)||S.soldi>P(6000+2000*min))return null;
  const scala=1+(S.eta>=60?.4:0)+Math.min(2,min)*.15+Math.max(0,min-2)*.1+(pa&&pa.conv&&min?.4:0);
  const red=S.lavoro?netto(ralEff(S.lavoro)):0;
  const aff=S.casa.tipo==='affitto'?Math.min(P(3360),S.casa.costo*(convivente()?.5:1)):0;
  const x=Math.max(0,P(rdc?6000:6500)*Math.min(2.2,scala)-red)+aff;
  return x>0?{n:rdc?'Reddito di cittadinanza':'Assegno di inclusione',x:Math.round(x)}:null;
}
/* SFL (da settembre 2023): 500 € al mese per 12 mesi a chi ha 18–59 anni, non ha minori né NASpI e segue un corso */
function puoSFL(){return S.anno>=2023&&S.eta>=18&&S.eta<=59&&!S.lavoro&&!S.naspi&&!S.sfl&&!iscritto()&&minoriConTe()===0&&iseeStima()<=P(10140)&&S.t-(S.fatti.sflT||-99)>=24}
/* Tutte le voci di welfare nel bilancio dell'anno (importi annui) */
function vociWelfare(add){
  if(S.naspi)add(S.naspi.nome&&S.naspi.nome!=='NASpI'?(S.naspi.nome==='ASpI'?'ASpI (disoccupazione)':'Indennità di disoccupazione'):'NASpI (disoccupazione)',naspiMese()*12);
  if(S.sfl)add('Supporto formazione e lavoro',P(500)*12);
  if(S.reversibilita)add('Pensione di reversibilità',S.reversibilita);
  const su=sussidio();if(su)add(su.n,su.x);
  const af=assegnoFigli();if(af)add(af.n,af.x);
  if(S.eta>=S.mondo.pensEta&&S.carcere===0){
    const red=(S.pensione||0)+(S.reversibilita||0)+(S.lavoro?netto(ralEff(S.lavoro)):0)+S.prop.filter(p=>p.affittata).reduce((s,p)=>s+p.valore*.045*.79,0)+(S.azienda?netto(S.azienda.compenso||0):0);
    if(red<P(ASSEGNO_SOCIALE))add('Assegno sociale',P(ASSEGNO_SOCIALE)-red);
  }
  voceMantenimento(add);
}

/* ---------- Badante e RSA: costo vero, una parte la pagano pensione e indennità di accompagnamento ---------- */
const COSTO_ASSIST={badante:20000,rsa:20000};   // badante convivente con contratto ≈ 18.900–20.700 € l'anno; RSA: quota sociale ≈ 1.300–2.100 € al mese
function costoAssistenza(p,tipo){
  const tot=P(COSTO_ASSIST[tipo]),copre=Math.min(tot,P(6600)+pensioneNpc(p)*.5);
  return {tot,copre,resta:Math.max(0,Math.round(tot-copre))};
}

/* ---------- Eredità dei genitori: i soldi e, spesso, la casa ---------- */
/* Quote di famiglie proprietarie per reddito: dal 43% (più povere) al 94% (più ricche) — Banca d'Italia 2022 */
function ereditaGenitori(){
  const fr=vivi(['Fratello']);const n=fr.length+1;
  const b={umile:[2000,15000],media:[25000,110000],agiata:[180000,700000]}[S.classe];
  const cash=Math.round(P(r(b[0],b[1]))/n);
  if(cash>0){soldi(cash);log(`Erediti ${eur(cash)} dai tuoi genitori.`,'g')}
  const casa=chance({umile:.55,media:.8,agiata:.94}[S.classe]);
  const cn=S.fatti.cittaNascita||S.citta,cp=S.fatti.provNascita||S.prov;
  if(casa){
    const c=cittaInfo(cn,cp),tipo=S.classe==='agiata'?'Quadrilocale':'Trilocale',mq=tipo==='Quadrilocale'?110:85;
    const valore=Math.round(mq*c.mq*S.mondo.mattone*r(85,105)/100/1000)*1000;
    coda.push({e:EV.eredita_casa,d:{x:valore,n,citta:cn,prov:cp,tipo}});
  }else if(S.casa.tipo==='genitori'&&S.eta>=18){S.casa=affittoBase('Monolocale');log('La casa dei tuoi era in affitto: prendi un monolocale tutto tuo.','h')}
  if(fr.length&&chance(.25))coda.push({e:EV.fra_eredita,d:{p:pick(fr)}});
}
/* Imposta di successione: franchigia di 1 milione a testa per coniuge e figli, poi il 4% */
const tassaSuccessione=quota=>Math.max(0,quota-P(1e6))*.04;

/* ================= ITALIA VERA: TERRITORIO, LAVORO, TASSE, CASA, SANITÀ (ROADMAP, Fase 3.2–3.6) ================= */
/* il luogo in cui vivi, ricordato finché non cambi città (luogo() cerca tra 7.904 comuni) */
let _luogoC=null;
function luogoC(){const k=S.citta+'|'+S.prov;if(!_luogoC||_luogoC.k!==k)_luogoC={k,v:luogo()};return _luogoC.v}
const zonaMia=()=>S&&S.citta?luogoC().zona:'Centro';
const alSud=z=>z==='Sud'||z==='Isole';

/* ---------- 3.6 Differenze regionali ---------- */
/* Stipendi a parità di lavoro (Banca d'Italia, ISTAT: al Sud e nelle Isole circa il 9% in meno, al Nord-ovest il 6% in più).
   I concorsi pubblici e le cariche elettive hanno contratti nazionali: uguali ovunque. */
const ZONA_STIP={'Nord-ovest':1.06,'Nord-est':1.03,Centro:1,Sud:.92,Isole:.91};
const CONTR_NAZ=['ins','maes','ric','inf','med','post'];   // scuola, sanità pubblica, Poste: contratti nazionali anche senza concorso nel gioco
function fattoreZona(j){return j&&(j.conc||j.elez||CONTR_NAZ.includes(j.id))?1:(ZONA_STIP[zonaMia()]||1)}
/* Occupazione (ISTAT 2023, 20–64 anni: Nord ~76%, Centro ~72%, Mezzogiorno ~52%): quota di chi lavora tra le persone
   del gioco, rischio di perdere il lavoro, facilità di trovarlo, stabilizzazione dei contratti a termine */
const OCC_ZONA={'Nord-ovest':{occ:.86,perdi:.85,trova:1.15,stab:1.1},'Nord-est':{occ:.88,perdi:.8,trova:1.2,stab:1.15},Centro:{occ:.82,perdi:1,trova:1,stab:1},
  Sud:{occ:.62,perdi:1.4,trova:.55,stab:.75},Isole:{occ:.6,perdi:1.5,trova:.5,stab:.7}};
const occZona=()=>OCC_ZONA[zonaMia()]||OCC_ZONA.Centro;
/* costo della vita (spesa e bollette): al Sud i prezzi sono più bassi di circa il 10% (ISTAT, parità di potere d'acquisto regionali) */
const COSTO_ZONA={'Nord-ovest':1.05,'Nord-est':1.04,Centro:1,Sud:.9,Isole:.91};
const costoZona=()=>COSTO_ZONA[zonaMia()]||1;
/* chi lascia il Sud per il Centro-Nord o l'estero tra i 18 e i 45 anni è emigrato; se torna giù, è tornato (da dopoTrasloco) */
function marcaEmigrazione(da){
  if(!S||!da)return;const c0=cittaInfo(da),z1=zonaMia();
  if(!S.fatti.emigrato&&alSud(c0.zona)&&!alSud(z1)&&S.eta>=18&&S.eta<=45)S.fatti.emigrato={t:S.t,da,prov:c0.s||null};
  else if(S.fatti.emigrato&&!S.fatti.ritornato&&alSud(z1))S.fatti.ritornato=S.t;
}
/* dopo almeno 5 anni lontano, la domanda: tornare giù? (e di nuovo, una volta, da pensionato) */
function controllaRitorno(){
  const em=S.fatti.emigrato;if(!em||S.fatti.ritornato||S.carcere>0||alSud(zonaMia()))return;
  const prima=!S.fatti.ritornoChiesto&&S.t-em.t>=60,pens=S.fatti.ritornoChiesto===1&&S.pensione&&!S.fatti.ritornoPens;
  if((prima||pens)&&chance(1/36)){if(pens)S.fatti.ritornoPens=1;S.fatti.ritornoChiesto=1;coda.push({e:EV.ita_ritorno,d:{}})}
}
/* i lavori che si possono fare da remoto (dal 2020) */
const REMOTO=['imp','pro','tec','ds','mkt','gra','gio','cons','comm','segr','callc','ing','arc'];

/* ---------- 3.2 Cassa integrazione: l'azienda in difficoltà sospende il lavoro e l'INPS paga circa l'80% dello stipendio, con un tetto ---------- */
const CIG_NO=['colf','badante','taxi','guida','bagn','anim','rider','post','avv','comm','cons','psi','notaio','magis','agcom','crea'];
function puoCIG(){
  const L=S.lavoro;if(!L||L.cig>0||S.t-(L.cigT===undefined?-99:L.cigT)<24)return false;
  const j=JOB[L.id],c=L.contratto||{t:'ind'};
  return !j.conc&&!j.elez&&!j.pt&&!j.var&&['ind','app'].includes(c.t)&&!CIG_NO.includes(L.id)&&['fisico','tech','vendita','ristorazione','legale'].includes(SETTORE_JOB[L.id]);
}
function chiediCIG(covid){S.lavoro.cigT=S.t;coda.push({e:EV.ita_cig,d:{covid:covid?1:0}})}
function avviaCIG(m){const L=S.lavoro;if(!L)return;L.cig=m;L.cigT=S.t}
/* massimale 2025: circa 1.390 € lordi al mese */
function nettoCIG(L){return netto(Math.min(ralEff(L)/13*.8,P(1393))*12)}
function meseCIG(L){
  L.cig--;S.fatti.cigN=(S.fatti.cigN||0)+1;S.bis.stress=clamp(S.bis.stress+1);
  if(L.cig>0)return;
  if(chance(S.mondo.crisi?.35:.2)){licenzia('Finita la cassa integrazione, l\'azienda chiude: resti senza lavoro.');segnaVita('licenziato');return}
  log('Finisce la cassa integrazione: si torna al lavoro a orario pieno.','g');mod('felicita',4);
}

/* ---------- 3.3 Tasse, assegni per i figli, successione ---------- */
/* Addizionali IRPEF: la regionale dal 1998 (aliquote medie per un reddito medio, MEF 2025: più alte dove c'è il debito della
   sanità), la comunale dal 1999 (0,6–0,8%). Prima del 2012 la regionale base era 0,9% invece di 1,23%. */
const ADD_REG={"Valle d'Aosta":1.23,Piemonte:2.3,Liguria:1.8,Lombardia:1.5,'Trentino-Alto Adige':1.23,Veneto:1.23,'Friuli-Venezia Giulia':1,'Emilia-Romagna':1.9,Toscana:1.9,
  Umbria:1.9,Marche:1.5,Lazio:2.6,Abruzzo:1.9,Molise:2.6,Campania:2.4,Puglia:1.8,Basilicata:1.4,Calabria:2.4,Sicilia:1.23,Sardegna:1.23};
function aliqAddiz(){
  if(!S||!S.anno||!S.citta)return .02;
  const L=luogoC();if(L.estero||S.anno<1998)return 0;
  return (ADD_REG[L.reg]||1.5)/100*(S.anno<2012?.75:1)+(S.anno<1999?0:L.p>=100000?.008:.006);
}
/* Assegno unico (da marzo 2022): per ogni figlio minorenne da 57,5 € (ISEE alto o assente) a 201 € al mese (ISEE fino a 17.227 €).
   Prima gli assegni familiari, solo a dipendenti e pensionati, più bassi con i redditi più alti.
   Con il partner in casa se ne conta metà, come il costo dei figli. */
function assegnoFigli(){
  const n=minoriConTe();if(!n||S.carcere>0)return null;
  const meta=convivente()?.5:1,isee=iseeStima();
  if(S.anno>2022||S.anno===2022&&S.mese>=2){const lo=P(17227),hi=P(45939),m=isee<=lo?201:isee>=hi?57.5:201-(isee-lo)/(hi-lo)*143.5;return {n:'Assegno unico per i figli',x:Math.round(P(m)*12*n*meta)}}
  const L=S.lavoro;if(!(L&&!isPiva(L)&&!JOB[L.id].pt||S.pensione))return null;
  const q=Math.max(0,Math.min(1,(P(35000)-isee)/P(23000)));
  return q>0?{n:'Assegni familiari',x:Math.round(P(110)*q*12*n*meta)}:null;
}
/* Successione legittima (codice civile, artt. 565–586), senza testamento: coniuge (o unito civilmente) e un figlio metà a testa;
   coniuge e più figli: un terzo al coniuge e il resto ai figli; solo il coniuge: due terzi a lui e un terzo ai genitori o ai fratelli;
   né coniuge né figli: genitori e fratelli. Chi convive senza essere sposato non eredita. */
function quoteSuccessione(X){
  X=X||S;const v=R=>X.relazioni.filter(p=>p.vivo&&R.includes(p.ruolo));
  const con=v(['Coniuge'])[0],figli=v(['Figlio']),gen=v(['Madre','Padre']),fr=v(['Fratello']),q=[];
  if(figli.length){const qc=con?(figli.length===1?1/2:1/3):0;if(con)q.push([con,qc]);for(const f of figli)q.push([f,(1-qc)/figli.length])}
  else if(con){const a=gen.length?gen:fr;q.push([con,a.length?2/3:1]);for(const x of a)q.push([x,1/3/a.length])}
  else if(gen.length&&fr.length){for(const x of gen)q.push([x,.5/gen.length]);for(const x of fr)q.push([x,.5/fr.length])}
  else{const a=gen.length?gen:fr;for(const x of a)q.push([x,1/a.length])}
  return q;
}
function testoSuccessione(){
  const q=quoteSuccessione();if(!q.length)return 'ad altri parenti o, se non ce ne sono, allo Stato';
  const rel=p=>({Coniuge:gp(p,'marito','moglie'),Figlio:gp(p,'figlio','figlia'),Madre:'madre',Padre:'padre',Fratello:gp(p,'fratello','sorella')})[p.ruolo]||'';
  return q.map(([p,x])=>`${p.nome} (${rel(p)}) ${Math.round(x*100)}%`).join(' · ');
}
/* imposta di successione per coniuge e figli: 4% oltre un milione a testa (abolita dal 2001 al 2006) */
const impostaSucc=x=>S.anno>=2001&&S.anno<2007?0:Math.round(Math.max(0,x-P(1e6))*.04);

/* ---------- 3.4 Mutui: tassi medi dei nuovi mutui per anno (Banca d'Italia; prima del 1999 indicativi) [anno, fisso, variabile] ---------- */
const TASSI_MUTUO=[[1950,7,7],[1960,7,7],[1970,9,9],[1975,14,14],[1980,18,18],[1985,15,14],[1990,13.5,13],[1993,12.5,12],[1995,11.5,11],[1997,8,7.5],[1998,6.5,5.5],[1999,5.5,4.2],
  [2000,6.2,5.6],[2002,5.4,4.5],[2003,4.8,3.6],[2005,4.2,3.4],[2006,4.6,4.3],[2007,5.4,5.4],[2008,5.8,5.6],[2009,5,2.6],[2010,4.4,2.2],[2011,5,3],[2012,5.2,3.4],[2013,4.6,3.2],
  [2014,3.8,2.8],[2015,2.9,2.1],[2016,2.2,1.7],[2017,2.2,1.6],[2018,2,1.5],[2019,1.6,1.3],[2020,1.3,1.2],[2021,1.3,1.1],[2022,2.5,1.9],[2023,4,4.9],[2024,3.3,4.6],[2025,3,3.6],[2026,3.1,3.4]];
function tassoMutuo(tipo){
  const a=S.anno,k=tipo==='var'?2:1;
  if(a>ANNO_OGGI){const M=S.mondo;if(!M.tassi)M.tassi={f:3.1,v:3.4};return (tipo==='var'?M.tassi.v:M.tassi.f)/100}
  let i=TASSI_MUTUO.findIndex(x=>x[0]>=a);if(i<0)i=TASSI_MUTUO.length-1;
  const B=TASSI_MUTUO[i],A=TASSI_MUTUO[Math.max(0,i-1)];
  const v=B[0]===a||i===0?B[k]:A[k]+(B[k]-A[k])*(a-A[0])/(B[0]-A[0]);
  return Math.round(v*10)/1000;
}
/* dopo il 2026 i tassi si muovono da soli intorno al 3–4% (salgono nelle crisi) */
function annoTassi(){
  if(S.anno<=ANNO_OGGI)return;const M=S.mondo;if(!M.tassi)M.tassi={f:3.1,v:3.4};
  M.tassi.v=Math.round(Math.max(.5,Math.min(8,M.tassi.v+(3.4-M.tassi.v)*.2+r(-6,6)/10+(M.crisi?.4:0)))*10)/10;   // tornano piano verso il 3-4%
  M.tassi.f=Math.round(Math.max(1,Math.min(8,M.tassi.f*.6+(M.tassi.v+.4)*.4+r(-2,2)/10))*10)/10;
}
const pctStr=x=>(Math.round(x*1000)/10).toString().replace('.',',')+'%';
const mutuoVar=()=>S.prop.find(p=>p.mutuo&&p.mutuo.residuo>0&&p.mutuo.tipo==='var');
/* ogni gennaio: il variabile segue i tassi e la rata si ricalcola (se sale di più del 10%, la lettera della banca) */
function annoMutuo(p){
  const m=p.mutuo;if(m.tasso===undefined){m.tasso=.035;m.tipo='fisso'}
  if(m.tipo!=='var'||m.anni<=0)return;
  const r0=m.rata;m.tasso=tassoMutuo('var');m.rata=rataMutuo(m.residuo,m.anni,m.tasso);
  if(m.rata>r0*1.1&&S.t-(S.fatti.rataSu?S.fatti.rataSu.t:-99)>=24){S.fatti.rataSu={t:S.t,da:r0,a:m.rata};coda.push({e:EV.mez_tassi,d:{}})}
  else if(Math.abs(m.rata-r0)>r0*.03)log(`Mutuo variabile: con il tasso al ${pctStr(m.tasso)} la rata ${m.rata>r0?'sale':'scende'} a ${eur(m.rata/12)} al mese.`,m.rata>r0?'b':'g');
}

/* ---------- 3.5 Sanità: medico di base, screening dell'ASL, liste d'attesa ---------- */
/* screening organizzati (Ministero della Salute): mammografia 50–69 anni ogni 2, Pap test 25–64 ogni 3 (test HPV dai 30 anni),
   colon-retto 50–69 ogni 2. Gli inviti arrivano meno al Sud (copertura più bassa). */
const SCREEN=[{id:'mx',n:'alla mammografia',s:'F',min:50,max:69,ogni:24,dal:1999,tum:'Tumore al seno'},{id:'pap',n:'al Pap test',s:'F',min:25,max:64,ogni:36,dal:1996},
  {id:'colon',n:'all\'esame per il tumore del colon',min:50,max:69,ogni:24,dal:2005,tum:'Tumore al colon'}];
const INVITO_ZONA={'Nord-ovest':.9,'Nord-est':.95,Centro:.8,Sud:.5,Isole:.5};
function faiScreening(id){
  const sc=S.fatti.scr||(S.fatti.scr={}),x=SCREEN.find(s=>s.id===id);sc[id]=S.t;S.fatti.screenT=S.t;S.fatti.screening=(S.fatti.screening||0)+1;
  const tm=x&&x.tum&&S.malattie.find(m=>m.n===x.tum&&!m.cura);
  if(tm){tm.screen=1;coda.unshift({e:EV.diagnosi,d:{x:tm.n}});return true}
  return false;
}
function meseScreening(){
  if(!S.vivo||S.carcere>0)return;
  if(S.eta===14&&S.mese===S.meseNascita&&!S.fatti.medico){const dott=chance(.45)?'la dottoressa':'il dottor';S.fatti.medico=1;
    log(S.anno<1979?`Da quest'anno ti visita il medico della mutua: ${dott} ${pick(COGNOMI)}.`:`Lasci il pediatra: il tuo medico di base ora è ${dott} ${pick(COGNOMI)}.`,'h')}
  const sc=S.fatti.scr||(S.fatti.scr={});
  for(const x of SCREEN){
    if(x.s&&x.s!==S.sesso||S.eta<x.min||S.eta>x.max||S.anno<x.dal)continue;
    if(S.t-(sc[x.id]===undefined?-999:sc[x.id])<x.ogni)continue;
    if(!chance((INVITO_ZONA[zonaMia()]||.8)/6))continue;
    sc[x.id]=S.t;
    const n=x.id==='pap'&&S.anno>=2016&&S.eta>=30?'al test HPV':x.n;
    if(S.fatti.scrAbit===undefined||S.fatti.scrAbit===0&&S.t-(S.fatti.scrChiesto||0)>=60){coda.push({e:EV.ita_screening,d:{id:x.id,n}});return}
    if(S.fatti.scrAbit&&chance(.92)){if(!faiScreening(x.id))log(`Arriva la lettera dell'ASL e vai ${n}. ${pick(['Tutto a posto.','Esito negativo: ci si rivede al prossimo invito.','Nessuna sorpresa, per fortuna.'])}`,'h')}
    else log(`Arriva la lettera dell'ASL per l'invito ${n}: la lasci sul mobile dell'ingresso e te ne dimentichi.`,'');
    return;
  }
}
/* liste d'attesa per una visita specialistica con il Servizio sanitario, in mesi */
const ATTESA_ZONA={'Nord-ovest':[1,3],'Nord-est':[1,2],Centro:[2,4],Sud:[3,7],Isole:[3,8]};
function mesiAttesa(){const a=ATTESA_ZONA[zonaMia()]||[2,4];return r(a[0],a[1])}
