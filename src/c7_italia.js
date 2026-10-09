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
  if(ELEZIONI_VERE.some(([a,m])=>a===S.anno&&m===S.mese)&&S.eta>=18&&S.carcere===0)coda.push({e:EV.elezioni,d:{}});
}

/* ---------- Lavoro: mesi lavorati, TFR, NASpI ---------- */
/* Ogni mese: storico degli ultimi 48 mesi (per la NASpI), TFR che matura, montante dei contributi (per la pensione) */
function meseItalia(){
  S.lav48=(S.lav48||[]).concat(S.lavoro?1:0).slice(-48);
  const L=S.lavoro;
  if(L){L.tfr=(L.tfr||0)+L.stip/13.5/12;S.montante=(S.montante||0)+L.stip*.33/12}
  if(S.azienda&&S.azienda.compenso)S.montante=(S.montante||0)+S.azienda.compenso*.24/12;
  if(S.naspi){S.naspi.m++;if(S.naspi.m>S.naspi.mesi||S.lavoro){if(!S.lavoro)log('Finisce la NASpI.','h');S.naspi=null}}
  if(S.sfl){S.sfl.m++;if(S.sfl.m>S.sfl.mesi||S.lavoro){if(!S.lavoro)log('Finisce il corso, e con lui il Supporto formazione e lavoro.','h');S.sfl=null}}
  if(S.fatti.congedo&&S.fatti.congedo===S.t){S.fatti.congedo=0;log('Finisce il congedo di maternità: si torna al lavoro.','h')}
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
  const lordo=L.stip/12,soglia=P(1460),cap=P(1585);
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
  const mio=(S.lavoro?S.lavoro.stip:0)+(S.pensione||0),min=P(7800);
  const rid=mio>5*min?.5:mio>4*min?.6:mio>3*min?.75:1;
  S.reversibilita=Math.round(pensioneNpc(p)*.6*rid);
  log(`Ti spetta la pensione di reversibilità di ${p.nome}: ${eur(S.reversibilita/13)} al mese.`,'h');
}

/* ---------- Sussidi ---------- */
/* Un ISEE approssimato: redditi della famiglia + 20% dei risparmi, diviso per la scala di equivalenza */
function minoriConTe(){return vivi(['Figlio']).filter(f=>f.eta<18&&!f.fuori&&!f.conEx).length}
function iseeStima(){
  const pa=partnerAttuale(),conv=pa&&pa.conv;
  const red=(S.lavoro?netto(S.lavoro.stip):0)+(S.pensione||0)+(conv?(pa.stato==='lavora'?P(20000):0):0)+(S.prop.filter(p=>p.affittata).reduce((s,p)=>s+p.valore*.045,0));
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
  const red=S.lavoro?netto(S.lavoro.stip):0;
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
    const red=(S.pensione||0)+(S.reversibilita||0)+(S.lavoro?netto(S.lavoro.stip):0)+S.prop.filter(p=>p.affittata).reduce((s,p)=>s+p.valore*.045*.79,0)+(S.azienda?netto(S.azienda.compenso||0):0);
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
