/* ================= ITALIA: storia vera, prezzi, lavoro e welfare, pensioni, eredità =================
   Fonti e numeri in ANALISI.md. Fino al 2026 (ANNO_OGGI) il mondo segue la storia vera; dopo è inventato. */
const ANNO_OGGI=2026;

/* ---------- Prezzi: inflazione vera (ISTAT, indice NIC, media annua) ---------- */
const INFL_VERA={2000:2.5,2001:2.7,2002:2.5,2003:2.7,2004:2.2,2005:1.9,2006:2.1,2007:1.8,2008:3.3,2009:.8,2010:1.5,2011:2.8,2012:3.0,2013:1.2,2014:.2,2015:.1,2016:-.1,2017:1.2,2018:1.2,2019:.6,2020:-.2,2021:1.9,2022:8.1,2023:5.7,2024:1.0,2025:1.5};
/* Livello dei prezzi a gennaio di un anno rispetto a oggi (2026 = 1). Tutti gli importi del gioco sono scritti ai prezzi di oggi. */
function ipAnno(a){let x=1;for(let y=Math.max(2000,a);y<ANNO_OGGI;y++)x/=1+(INFL_VERA[y]||0)/100;return x}
const passato=()=>S.anno<=ANNO_OGGI;

/* ---------- La storia vera, mese per mese ---------- */
const inReg0=(...rr)=>()=>rr.includes(luogo().reg);
const STORIA=[
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
const ELEZIONI_VERE=[[2001,4],[2006,3],[2008,3],[2013,1],[2018,2],[2022,8]];
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
function descrContratto(L){
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
    const pInd=Math.max(.03,Math.min(.8,(c.mesi>=24?.25:.05)+(L.perf-60)/250+(M.crisi?-.1:0)+(M.boom?.08:0)));
    if(!STAGIONALI.includes(L.id)&&!JOB[L.id].pt&&chance(pInd)){L.contratto={t:'ind'};mod('felicita',8);S.bis.stress=clamp(S.bis.stress-6);log('Ti trasformano il contratto: tempo indeterminato! Finalmente.','g');return false}
    if(c.mesi<24&&(c.pror||0)<4&&chance(.6)){const n=pick([6,12]);c.fine=S.t+n;c.pror=(c.pror||0)+1;log(`Il contratto a termine viene prorogato di ${n} mesi.`,'h');return false}
    licenzia(STAGIONALI.includes(L.id)?'Finisce la stagione, e con lei il contratto.':'Il contratto a termine scade e non viene rinnovato.');return true;
  }
  if(c.t==='app'&&S.t>=c.fine){
    if(chance(.75+(L.perf-60)/200)){L.contratto={t:'ind'};log('Finisce l\'apprendistato: ti confermano a tempo indeterminato.','g');mod('felicita',6);return false}
    licenzia('Finisce l\'apprendistato e non ti confermano.');return true;
  }
  if(c.t==='ind'&&!JOB[L.id].conc&&chance(.0035*(M.crisi?2:1)*(S.eta<35?1.8:1)))   // licenziamenti e chiusure: circa 4% l'anno
{licenzia(pick(['L\'azienda chiude e resti senza lavoro.','Riorganizzazione: il tuo posto viene tagliato.']));return true}
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
  if(L){if(isPiva(L))S.montante=(S.montante||0)+ralEff(L)*.78*.26/12;else{L.tfr=(L.tfr||0)+ralEff(L)/13.5/12;S.montante=(S.montante||0)+ralEff(L)*.33/12}}
  if(S.azienda&&S.azienda.compenso)S.montante=(S.montante||0)+S.azienda.compenso*.24/12;
  if(S.naspi){S.naspi.m++;if(S.naspi.m>S.naspi.mesi||S.lavoro){if(!S.lavoro)log('Finisce la NASpI.','h');S.naspi=null}}
  if(S.sfl){S.sfl.m++;if(S.sfl.m>S.sfl.mesi||S.lavoro){if(!S.lavoro)log('Finisce il corso, e con lui il Supporto formazione e lavoro.','h');S.sfl=null}}
  if(S.fatti.congedo&&S.fatti.congedo===S.t+1&&S.sesso==='F'&&S.lavoro&&!JOB[S.lavoro.id].pt&&S.t-(S.fatti.rientroT||-99)>12){S.fatti.rientroT=S.t;coda.push({e:EV.rientro_lavoro,d:{}})}
  if(S.fatti.congedo&&S.fatti.congedo===S.t){S.fatti.congedo=0;S.fatti.congedoQuota=0;log('Finisce il congedo: si torna al lavoro.','h')}
}
/* La liquidazione (TFR) quando un lavoro finisce, per qualsiasi motivo */
function pagaTFR(){
  const L=S.lavoro;if(!L||!L.tfr)return;
  const x=Math.round(L.tfr*.77);L.tfr=0;if(x<50)return;
  soldi(x);log(`Ricevi il TFR, la liquidazione: ${eur(x)} netti.`,'g');
}
/* NASpI: a chi perde il lavoro senza averlo lasciato. Il 75% dello stipendio (con un tetto), per metà dei mesi lavorati negli ultimi 4 anni */
function avviaNaspi(L){
  const n=(S.lav48||[]).reduce((s,x)=>s+x,0);
  if(n<3||!L)return;
  const lordo=ralEff(L)/12,soglia=P(1460),cap=P(1585);
  const imp=Math.min(cap,lordo<=soglia?lordo*.75:soglia*.75+(lordo-soglia)*.25);
  S.naspi={mesi:Math.min(24,Math.floor(n/2)),imp:Math.round(imp*.88),m:0,over55:S.eta>=55};
  log(`Fai domanda di NASpI: circa ${eur(S.naspi.imp)} netti al mese per ${S.naspi.mesi} mesi (dal sesto mese cala del 3% ogni mese).`,'h');
}
const naspiMese=()=>S.naspi?Math.round(S.naspi.imp*Math.pow(.97,Math.max(0,S.naspi.m-(S.naspi.over55?7:5)))):0;

/* ---------- Pensioni (sistema contributivo, chi nasce dal 2000) ----------
   Vecchiaia a 67 anni con 20 di contributi; anticipata con 42 anni e 10 mesi (41 e 10 le donne) a qualsiasi età;
   a 71 anni bastano 5 anni. Importo = montante × coefficiente di trasformazione (biennio 2025–2026). */
const COEFF_TRASF={57:4.204,58:4.308,59:4.419,60:4.536,61:4.661,62:4.795,63:4.936,64:5.088,65:5.250,66:5.423,67:5.608,68:5.808,69:6.024,70:6.258,71:6.510};
function pensioneMaturata(){
  const c=S.contributi||0,e=S.eta;
  if(e>=S.mondo.pensEta&&c>=20)return 'vecchiaia';
  if(c>=(S.sesso==='F'?41.83:42.83))return 'anticipata';
  if(e>=S.mondo.pensEta+4&&c>=5)return 'vecchiaia';
  return '';
}
function nettoPensione(l){if(l<=0)return 0;const t=Math.max(0,irpef(l)-detrazione(l))+l*.02;return Math.round(l-t)}
function pensioneCalcolata(){
  const k=COEFF_TRASF[Math.max(57,Math.min(71,S.eta))]/100;
  return nettoPensione((S.montante||0)*k);
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
  if(S.naspi)add('NASpI (disoccupazione)',naspiMese()*12);
  if(S.sfl)add('Supporto formazione e lavoro',P(500)*12);
  if(S.reversibilita)add('Pensione di reversibilità',S.reversibilita);
  const su=sussidio();if(su)add(su.n,su.x);
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
