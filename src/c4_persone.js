/* ================= PERSONE CON UNA VITA PROPRIA ================= */
const NUCLEO=['Madre','Padre','Patrigno','Fratello','Figlio','Partner','Coniuge','Nonno'];
const vicino=p=>NUCLEO.includes(p.ruolo)||p.rapporto>=55||p.best;
function affinita(p){
  if(!p||!p.pers||!S.pers)return 50;
  const a=p.pers,b=S.pers;
  return clamp(62-Math.abs(a.O-b.O)*.25-Math.abs(a.C-b.C)*.15-Math.abs(a.E-b.E)*.1+(a.A-50)*.22+(b.A-50)*.1-(a.N-50)*.15-(b.N-50)*.1);
}
function ricorda(p,t){if(!p)return;p.ricordi=p.ricordi||[];p.ricordi.push({t:S.t,s:t});if(p.ricordi.length>8)p.ricordi.shift()}
function initNpc(p){
  if(p.umore===undefined)p.umore=r(45,80);
  if(p.ultimo===undefined)p.ultimo=S?S.t:0;
  if(!p.ricordi)p.ricordi=[];
  if(p.stato===undefined){
    const e=p.eta;
    p.stato=e<6?'bambino':e<19?'studente':e<25?(chance(.4)?'studente':chance(.8)?'lavora':'disoccupato'):e<67?(chance(.82)?'lavora':chance(.5)?'disoccupato':'casa'):'pensione';
    if(p.stato==='lavora'&&!p.lavoro)p.lavoro=lavoroPerNpc(p);
  }
  if(p.coppia===undefined){
    const e=p.eta;
    p.coppia=e<18?'single':e<26?(chance(.35)?'coppia':'single'):e<70?pesata([['sposato',55],['coppia',15],['single',18],['separato',12]]):pesata([['sposato',55],['vedovo',30],['single',15]]);
    if(p.coppia==='sposato'&&e>=25)p.figliN=pesata([[0,20],[1,35],[2,35],[3,10]]);
    if(p.sposato)p.coppia='sposato';
  }
  if(['Partner','Coniuge'].includes(p.ruolo)&&p.dal===undefined)p.dal=S?S.t:0;
  if(['Partner','Coniuge'].includes(p.ruolo)&&p.intim===undefined){
    p.intim=clamp(p.rapporto-8);p.pass=clamp(p.rapporto+12);p.imp=clamp(p.ruolo==='Coniuge'?p.rapporto+10:p.rapporto-25);
  }
}
/* Un lavoro per una persona del gioco: diffuso come in Italia (DIFFUSIONE), con la quota di donne di ogni mestiere (DONNE) */
function lavoroPerNpc(p){
  const L=LAVORI.filter(j=>!j.pt&&!j.nascosto&&DIFFUSIONE[j.id]);
  const pesi=L.map(j=>{const f=DONNE[j.id]!==undefined?DONNE[j.id]:.42;const ses=p.sesso==='F'?f/.42:(1-f)/.58;return [j.id,DIFFUSIONE[j.id]*ses*(j.req&&j.req.lau?(p.pers&&p.pers.C>55?1.4:.6):1)]});
  return pesata(pesi);
}
const lavoroNpc=p=>p.lavoro&&JOB[p.lavoro]?nomeJob(JOB[p.lavoro],0,p).toLowerCase():'';
function statoNpc(p){
  const e=p.eta,f=p.sesso==='F';
  if(p.stato==='bambino')return e<3?'piccol'+(f?'a':'o'):'all\'asilo';
  if(p.stato==='studente')return e<11?'alle elementari':e<14?'alle medie':e<19?'alle superiori':'all\'università';
  if(p.stato==='lavora')return lavoroNpc(p)||'lavora';
  if(p.stato==='disoccupato')return f?'disoccupata':'disoccupato';
  if(p.stato==='pensione')return f?'in pensione':'in pensione';
  if(p.stato==='casa')return 'si occupa della casa';
  return '';
}
function coppiaNpc(p){
  if(['Partner','Coniuge','Ex','Nemico','Conoscente'].includes(p.ruolo))return '';
  const f=p.sesso==='F';
  const c={single:f?'single':'single',coppia:p.pNome?`fidanzat${f?'a':'o'} con ${p.pNome}`:`fidanzat${f?'a':'o'}`,sposato:p.pNome?`sposat${f?'a':'o'} con ${p.pNome}`:`sposat${f?'a':'o'}`,separato:f?'separata':'separato',vedovo:f?'vedova':'vedovo'}[p.coppia]||'';
  return c+(p.figliN?` · ${p.figliN} ${p.figliN===1?'figlio':'figli'}`:'');
}

/* ---------- Tempo passato con le persone ---------- */
function contatti(){
  const amiciH=rOre('amici')+rOre('uscite')*.3,famH=rOre('famiglia'),parH=rOre('partner'),figH=rOre('figli');
  const am=vivi(['Amico']).filter(p=>!p.cella);
  if(amiciH>0&&am.length){
    const fr=am.filter(p=>p.frequente);
    const base=(fr.length?fr:[...am].sort((a,b)=>b.rapporto-a.rapporto));
    const n=Math.max(1,Math.min(base.length,Math.round(amiciH/2.5),5));
    const sel=base.slice(0,n),h=amiciH/n;
    for(const p of sel){p.rapporto=clamp(p.rapporto+Math.min(7,h*1.1)*(p.lontano?.45:1)*(.7+affinita(p)/170));p.ultimo=S.t}
  }
  const fam=S.relazioni.filter(p=>p.vivo&&['Madre','Padre','Patrigno','Fratello','Nonno'].includes(p.ruolo));
  const aCasa=S.casa.tipo==='genitori';
  for(const p of fam){
    let h=famH/Math.max(1,fam.length)*(p.ruolo==='Nonno'?.7:1)+(aCasa&&p.ruolo!=='Nonno'&&!p.fuori?2.5:0);
    if(h>0){p.rapporto=clamp(p.rapporto+Math.min(5,h*.7)*(p.lontano?.5:1));p.ultimo=S.t}
  }
  const zii=vivi(['Zio','Cugino']);if(famH>=6&&zii.length&&chance(.2)){const z=pick(zii);z.rapporto=clamp(z.rapporto+3);z.ultimo=S.t}
  const fig=vivi(['Figlio']).filter(p=>!p.fuori||p.eta>=18);
  if(fig.length){
    const h=figH/Math.max(1,fig.filter(p=>p.eta<18).length);
    for(const p of fig){
      if(p.eta<18){p.rapporto=clamp(p.rapporto+Math.min(5,h*.35)-(h<3?2:0));if(p.eta>=6&&h>=4)p.voto=clamp((p.voto||50)+.4);p.ultimo=S.t}
      else if(famH>0){p.rapporto=clamp(p.rapporto+Math.min(4,famH/fam.length*.6||1));p.ultimo=S.t}
    }
  }
  const pa=partnerAttuale();
  if(pa){pa.oreMese=parH+(convivente()?5:0);pa.ultimo=S.t}
}

/* ---------- La coppia: intimità, passione, impegno ---------- */
function mesePartner(p){
  const h=p.oreMese||0,anni=(S.t-(p.dal||S.t))/12;
  const att=S.att||'sicuro';
  p.intim=clamp(p.intim+Math.min(6,h*.3)-1+(affinita(p)-50)*.03);
  p.pass=clamp(p.pass+(28+Math.min(40,h*3.2)-p.pass)*.06-Math.min(1.2,anni*.04)+(S.bis&&S.bis.energia>55?.3:-.3));
  p.imp=clamp(p.imp+(p.conv?.5:.2)+(p.ruolo==='Coniuge'?.3:0)-(att==='evitante'?.6:0)-(att==='timoroso'?.4:0));
  let conflitto=(100-p.pers.A)*.03+(100-S.pers.A)*.025+(p.pers.N-50)*.03+(S.bis?S.bis.stress-40:0)*.04+(S.soldi<0?1.5:0)+(att==='ansioso'?1.2:0)+(att==='timoroso'?1:0)-(affinita(p)-50)*.05;
  conflitto=Math.max(0,conflitto);
  const prima=p.rapporto;
  const base=clamp(p.intim*.45+p.pass*.25+p.imp*.3-conflitto*2.2);
  p.rapporto=clamp(p.rapporto+(base-p.rapporto)*.3);
  if(conflitto>4.5&&chance(.12)&&!coda.length)coda.push({e:EV.lite_coppia,d:{p}});
  else if(h<3&&prima>40&&chance(.08)&&!coda.length)coda.push({e:EV.trascurato,d:{p}});
  if(p.ruolo==='Partner'&&!p.conv&&anni>=1.5&&p.rapporto>=65&&p.imp>=60&&chance(.03)&&S.eta>=19&&!coda.length&&S.carcere===0)coda.push({e:EV.proposta_conv,d:{p}});
  if(p.ruolo==='Partner'&&p.conv&&anni>=2&&p.rapporto>=70&&p.imp>=70&&chance(.025)&&!coda.length)coda.push({e:EV.proposta_nozze,d:{p}});
  if(p.ruolo==='Partner'&&p.rapporto<18&&chance(.25)){p.ruolo='Ex';p.conv=false;mod('felicita',-12);pesa(Math.round(8+prima/8),5);ricorda(p,'Vi siete lasciati');log(`${p.nome} ti lascia: «Non funziona più tra noi».`,'b');if(S.att==='ansioso')segnaVita('divorzio')}
  if(p.ruolo==='Coniuge'&&(p.rapporto<12&&chance(.05)||chance(.0011*(1+pz('N')*.5)*(1+ppz(p,'N')*.5)*(1.5-affinita(p)/100)))&&!coda.some(q=>q.e.id==='div_richiesta'))coda.push({e:EV.div_richiesta,d:{p}});
}

/* ---------- Mese per ogni persona ---------- */
function meseNpc(){
  meseGenitori();
  const lista=S.relazioni.filter(p=>p.vivo);
  for(const p of lista){
    if(!p.pers){p.pers=persDaTr(p.tr);initNpc(p)}
    if(S.mese===p.mn){p.eta++;compleannoNpc(p)}
    if(!p.vivo)continue;
    const q=morteP(p.eta,p.malato===3?30:p.malato===2?55:72,p.sesso);
    if(p.eta>=30&&chance(1-Math.pow(1-q,1/12))){mortePersona(p);continue}
    // decadimento dei rapporti
    if(S.casa.tipo==='genitori'&&['Madre','Padre','Patrigno','Fratello'].includes(p.ruolo)&&!p.fuori&&!(p.ruolo==='Padre'&&S.fatti.genitoriSeparati&&chance(.5)))p.ultimo=S.t;
    if(S.eta<6&&['Madre','Padre','Patrigno'].includes(p.ruolo)&&chance(.5))relD(p,1);   // prima +0,5 veniva arrotondato a +1: si tiene il calore effettivo di sempre
    const non=S.t-(p.ultimo||0);
    // cali con passo(): prima clamp() arrotondava e i cali sotto 0,5 (zii, cugini, figli adulti) non avvenivano mai
    if(p.ruolo==='Amico')relD(p,-(non>=2?1.6:.6)*(p.lontano?1.3:1));
    else if(['Zio','Cugino','Suocero','Cognato'].includes(p.ruolo))relD(p,-(non>=6?.5:non>=3?.2:0));
    else if(['Madre','Padre','Fratello','Nonno','Patrigno'].includes(p.ruolo))relD(p,-(non>=3?.6:0));
    else if(p.ruolo==='Figlio'&&p.eta>=18)relD(p,-(non>=4?.5:0));
    else if(p.ruolo==='Conoscente')relD(p,-1.5);
    // un rapporto perfetto si consuma un po' anche frequentandosi: al 100% si resta solo con cura costante
    if(p.rapporto>=95&&S.eta>=14&&!['Partner','Coniuge'].includes(p.ruolo))relD(p,-.35);
    if(['Partner','Coniuge'].includes(p.ruolo))mesePartner(p);
    p.umore=clamp(p.umore+(60+ppz(p,'E')*8-ppz(p,'N')*15-p.umore)*.2+r(-4,4));
    vitaNpc(p);
    // chi ti cerca
    if(['Amico','Fratello','Madre','Padre','Nonno','Cugino','Figlio'].includes(p.ruolo)&&p.rapporto>=35&&chance(.012+p.pers.E*.0004)){
      p.rapporto=clamp(p.rapporto+2);p.ultimo=S.t;
      const ct=chance(.2)&&cercaTesto(p);if(ct)log(`${p.nome} ${ct}.`,'h');
    }
  }
  // pulizia
  for(const p of S.relazioni){
    if(!p.vivo)continue;
    if(p.ruolo==='Amico'&&p.rapporto<8&&!p.cella){p.rimuovi=true;log(`Tu e ${p.nome} vi siete persi di vista.`,'h')}
    if(p.ruolo==='Conoscente'&&p.rapporto<5)p.rimuovi=true;
  }
  const ex=S.relazioni.filter(p=>p.ruolo==='Ex');
  if(ex.length>4)ex.slice(0,ex.length-4).forEach(p=>p.rimuovi=true);
  S.relazioni=S.relazioni.filter(p=>!p.rimuovi);
}
/* Chi ti cerca: frasi diverse secondo la tua età e se vivete insieme (niente meme a un anno, niente «passa a trovarti» se abitate insieme) */
const CERCA={
  bimboAmico:['ti invita a giocare a casa sua','ti presta il suo gioco preferito','ti regala un disegno','ti fa vedere la sua collezione di figurine','ti aspetta all\'uscita per giocare in cortile'],
  bimboGrande:['ti legge una storia prima di dormire','ti porta al parco','gioca con te tutto il pomeriggio','ti insegna una canzoncina','ti porta a prendere un gelato'],
  bimboNonno:['ti porta un gelato','ti racconta una storia di quando era giovane','ti insegna un gioco di carte','ti dà una caramella di nascosto'],
  casa:['ti prepara il tuo piatto preferito','ti chiede com\'è andata la giornata','ti lascia un biglietto sul frigo','ti trascina a vedere un film sul divano','ti chiede una mano in cucina e finite a chiacchierare'],
  ragazzo:['ti scrive per vedervi dopo la scuola','ti manda un meme alle due di notte','ti manda un vocale di sei minuti','ti chiama solo per raccontarti una giornata assurda','ti invita a fare un giro in centro'],
  adulto:['ti chiama per sapere come stai','ti manda un messaggio vocale di sei minuti','passa a trovarti senza avvisare','ti scrive per prendere un caffè','ti manda un meme alle due di notte','ti chiama solo per raccontarti una giornata assurda','ti porta una torta fatta in casa']
};
function convive(p){return (['Madre','Padre','Patrigno','Fratello','Nonno'].includes(p.ruolo)&&S.casa.tipo==='genitori'&&!p.fuori&&!p.lontano)||(['Partner','Coniuge'].includes(p.ruolo)&&p.conv)||(p.ruolo==='Figlio'&&!p.fuori)}
function cercaTesto(p){
  if(S.eta<4)return null;
  if(convive(p))return varia('cerca_casa',S.eta<12&&['Madre','Padre','Patrigno','Fratello'].includes(p.ruolo)?CERCA.bimboGrande:CERCA.casa);
  if(S.eta<12)return varia('cerca_bimbo',p.ruolo==='Nonno'?CERCA.bimboNonno:p.eta<16?CERCA.bimboAmico:CERCA.bimboGrande);
  if(S.eta<18)return varia('cerca_ragazzo',p.eta<20?CERCA.ragazzo:CERCA.adulto.filter(x=>!x.includes('caffè')));
  return varia('cerca',CERCA.adulto);
}
/* «la zia Giorgia si separa dal marito Giovanni»: il partner di una persona non è sempre stato presentato */
const partnerDi=(p,sposati)=>`${(p.pSesso||(p.sesso==='F'?'M':'F'))==='M'?(sposati?'dal marito':'dal compagno'):(sposati?'dalla moglie':'dalla compagna')} ${p.pNome||''}`.trim();
/* un nuovo compagno o una nuova compagna per una persona del gioco, del sesso giusto per il suo orientamento */
function nuovoCompagnoNpc(p){const ps=sessoCompagnoNpc(p);p.pSesso=ps;p.pNome=pick(nomiPer(ps,S.anno-p.eta+r(-3,3)));p.coppia='coppia';p.dalC=S.t}
function compleannoNpc(p){
  if(p.ruolo==='Figlio')annoFiglio(p);
  const e=p.eta;
  if(p.stato==='bambino'&&e>=6)p.stato='studente';
  if(p.stato==='studente'&&e>=19&&p.ruolo!=='Figlio'&&chance(e>=24?.9:.4)){p.stato=chance(.85)?'lavora':'disoccupato';if(p.stato==='lavora')p.lavoro=lavoroPerNpc(p)}
  if(p.ruolo==='Figlio'&&p.eta>=19&&p.lavoro)p.stato='lavora';
  if(p.stato==='lavora'&&e>=67){p.stato='pensione';if(vicino(p))log(`${p.nome} va in pensione.`,'h')}
  if(vicino(p)&&S.carcere===0&&['Madre','Padre','Partner','Coniuge','Figlio','Fratello'].includes(p.ruolo)||p.best){
    if(!coda.length&&chance(['Partner','Coniuge','Figlio'].includes(p.ruolo)||p.best?.12:.04)&&S.eta>=6)coda.push({e:EV.compleanno_npc,d:{p}});
    else if(chance(.25)&&['Partner','Coniuge','Figlio'].includes(p.ruolo))log(`${p.nome} compie ${e} anni.`,'h');
  }
}
function annuncia(p,t,k){if(vicino(p)){log(t,k||'h');return true}return false}
function richiesta(id,p){
  if(coda.length||S.carcere>0||S.eta<14)return false;
  if(S.t-(S.fatti.richT||-9)<2)return false;
  if(!EV[id])return false;
  S.fatti.richT=S.t;coda.push({e:EV[id],d:{p}});return true;
}
function meseGenitori(){
  const m=S.relazioni.find(p=>p.ruolo==='Madre'),pa=S.relazioni.find(p=>p.ruolo==='Padre');
  if(!m||!pa||!m.vivo||!pa.vivo||m.coppia!=='sposato'||S.fatti.genitoriSeparati)return;
  const intesa=S.fatti.intesaGenitori!==undefined?S.fatti.intesaGenitori:60;
  if(chance(.0011*(1+(55-intesa)/30))){
    S.fatti.genitoriSeparati=true;m.coppia=pa.coppia='separato';m.pNome=pa.pNome=null;
    if(S.eta<25){mod('felicita',-12);segnaVita('lutto');S.tensione=(S.tensione||0)+8}
    log(S.eta<18?'I tuoi genitori si separano. Da ora vivrai con tua madre e vedrai tuo padre nei fine settimana.':'I tuoi genitori si separano dopo tanti anni insieme.','b');
    if(S.eta<18)pa.rapporto=clamp(pa.rapporto-8);
  }
}
function vitaNpc(p){
  const e=p.eta,A=p.pers,M=S.mondo;
  if(p.ruolo==='Nemico'||p.ruolo==='Conoscente')return;
  // salute
  if(!p.malato&&e>=8&&chance(.0015+Math.max(0,e-45)*.0003)){
    p.malato=pesata([[1,60],[2,30],[3,e>55?14:3]]);
    const n=p.malato===3?(chance(.75)?tumorePer(p.sesso,Math.max(30,e),false).n:pick(['Insufficienza cardiaca','Demenza'])):pick(MALATTIE[p.malato]);p.malattia=n;
    if(p.malato>=2&&vicino(p)){if(!richiesta('r_malato',p))log(`${p.nome} si ammala: ${n.toLowerCase()}.`,'b')}
  }else if(p.malato&&chance(p.malato===1?.5:p.malato===2?.12:.03)){if(p.malato>=2)annuncia(p,`${p.nome} è guarit${gp(p,'o','a')}.`,'g');p.malato=0;p.malattia=null}
  // autosufficienza degli anziani
  if(e>=78&&!p.nonAuto&&['Madre','Padre','Nonno'].includes(p.ruolo)&&chance(.004+(e-78)*.0008)){p.nonAuto=true;if(S.eta>=18&&p.ruolo!=='Nonno')richiesta('r_assistenza',p);else annuncia(p,`${p.nome} non è più autosufficiente: serve qualcuno che l${gp(p,'o','a')} assista.`,'b')}
  if(e<18||p.ruolo==='Figlio'&&e<19)return;
  // lavoro
  if(p.stato==='casa'&&p.tornaLav&&S.t>=p.tornaLav){p.stato='lavora';p.tornaLav=0;if(!p.lavoro)p.lavoro=lavoroPerNpc(p);annuncia(p,`${p.nome} torna a lavorare.`,'h')}
  if(p.stato==='lavora'&&chance(.003+(M.crisi?.012:0)+(A.C<35?.002:0))){p.stato='disoccupato';p.umore=clamp(p.umore-20);
    if(!(p.rapporto>=50&&chance(.3)&&richiesta('r_lavoro_perso',p)))annuncia(p,`${p.nome} ha perso il lavoro.`,'b')}
  else if(p.stato==='disoccupato'&&chance(.05*(.5+A.C/100)*(M.crisi?.5:M.boom?1.5:1))){p.stato='lavora';p.lavoro=lavoroPerNpc(p);annuncia(p,`${p.nome} ha trovato lavoro come ${lavoroNpc(p)}.`,'g')}
  else if(p.stato==='lavora'&&chance(.002*(A.C/50))){annuncia(p,`${p.nome} ha avuto una promozione.`,'g');p.umore=clamp(p.umore+10)}
  // amore
  if(['Partner','Coniuge','Ex'].includes(p.ruolo))return;
  if(['Madre','Padre','Patrigno','Nonno'].includes(p.ruolo)){
    if(p.coppia==='separato'&&p.eta<65&&!p.pNome&&chance(.006*(.5+A.E/100))){nuovoCompagnoNpc(p);
      if(p.ruolo==='Madre'&&S.eta<16&&!vivi(['Patrigno']).length&&chance(.5)){const pt=nuovaPersona('Patrigno',p.pSesso,p.eta+r(-4,6),null,{nome:p.pNome,rapporto:r(30,60)});log(`Tua madre va a vivere con ${pt.nome}. Ora in casa c'è anche ${gp(pt,'lui','lei')}.`,'h')}
      else annuncia(p,`${p.nome} ha una nuova relazione con ${p.pNome}.`,'h')}
    return;
  }
  if(['single','separato','vedovo'].includes(p.coppia)&&e<65&&chance(.01*(.5+A.E/100))){nuovoCompagnoNpc(p);annuncia(p,`${cap(tuoR(p))} ${p.nome} ha una nuova relazione con ${p.pNome}.`,'h')}
  else if(p.coppia==='coppia'&&S.t-(p.dalC||0)>=20&&e>=23&&e<60&&chance(.012)){p.coppia='sposato';
    if(vicino(p)&&!richiesta('r_matrimonio',p))annuncia(p,`${cap(tuoR(p))} ${p.nome} ${coppiaStessoSesso(p)?'celebra l\'unione civile con':'si sposa con'} ${p.pNome||'la persona che ama'}.`,'g');
    if(p.ruolo==='Fratello'&&!S.relazioni.some(x=>x.famDi===p.id))nuovaPersona('Cognato',p.pSesso||(p.sesso==='M'?'F':'M'),p.eta+r(-3,3),null,{rapporto:r(40,70),famDi:p.id,nome:p.pNome||undefined})}
  else if(['coppia','sposato'].includes(p.coppia)&&chance(.003*(1+(A.N-50)/60-(A.A-50)/80))){const sp=p.coppia==='sposato';p.coppia='separato';p.umore=clamp(p.umore-25);
    if(!(p.rapporto>=55&&chance(.4)&&richiesta('r_separazione',p)))annuncia(p,`${cap(tuoR(p))} ${p.nome} si ${sp?'separa':'lascia'} ${partnerDi(p,sp)}.`,'b')}
  if(['sposato','coppia'].includes(p.coppia)&&!coppiaStessoSesso(p)&&e<44&&(p.figliN||0)<4&&chance(p.coppia==='sposato'?.009:S.t-(p.dalC||0)>=18?.006:0)){p.figliN=(p.figliN||0)+1;
    if(['Fratello'].includes(p.ruolo)){annuncia(p,`${p.nome} ha avuto ${pick(['un bambino','una bambina'])}: sei diventat${g('o','a')} zi${g('o','a')}!`,'g');mod('felicita',4)}
    else annuncia(p,`${p.nome} ha avuto ${pick(['un bambino','una bambina'])}.`,'g')}
  // trasloco
  if(!p.lontano&&e>=20&&e<50&&['Amico','Fratello','Cugino','Figlio'].includes(p.ruolo)&&chance(.0018)){p.lontano=true;
    const dove=pick(['Milano','Londra','Berlino','Bologna','Roma','Torino','Barcellona','Parigi','Amsterdam','Dublino'].filter(x=>x!==S.citta));p.dove=dove;
    if(!(p.rapporto>=60&&richiesta('r_trasloco',p)))annuncia(p,`${p.nome} si trasferisce a ${dove}.`,'h')}
  // momenti difficili e richieste
  if(p.rapporto>=45&&p.umore<30&&chance(.04))richiesta('r_sfogo',p);
  if(p.stato==='disoccupato'&&p.rapporto>=50&&A.C<50&&chance(.015))richiesta('r_prestito',p);
  if(p.prestito>0&&chance(.04+A.C*.0012)){const x=p.prestito;p.prestito=0;soldi(x);p.rapporto=clamp(p.rapporto+3);log(`${p.nome} ti restituisce i ${eur(x)} che ${gp(p,'gli','le')} avevi prestato.`,'g')}
  if(['Amico','Cugino','Fratello','Cognato'].includes(p.ruolo)&&p.rapporto>=30&&p.rapporto<70&&chance(.006*(1+(50-A.A)/40)*(1+(50-S.pers.A)/60)))richiesta('r_lite',p);
  if(p.ruolo==='Amico'&&p.rapporto>=55&&chance(.01*(.6+A.E/100)))richiesta('r_invito',p);
  if(p.ruolo==='Amico'&&S.t-(p.ultimo||0)>=6&&p.rapporto>=40&&chance(.08))richiesta('r_sparito',p);
}

/* ---------- Incontri ---------- */
/* Quattordici modi di conoscere qualcuno (INC in d8_ritmo.js): a scuola, al lavoro, tramite un amico, sul pianerottolo,
   in treno, al parco dei cani, fuori dalla scuola dei figli… Il modello dipende da come passi il tempo.
   Chi ha già tanta gente intorno conosce meno persone nuove (sat). */
function incontri(){
  if(S.eta<3||S.carcere>0||coda.length)return;
  const ctx=Object.keys(INC).map(id=>[id,INC[id].w()]).filter(x=>x[1]>0);
  if(!ctx.length)return;
  const tot=ctx.reduce((s,x)=>s+x[1],0);
  const n=vivi(['Amico','Conoscente']).filter(p=>!p.lontano).length;
  const sat=n<3?1.3:n<7?1:n<12?.6:n<18?.35:.15;
  if(!chance(Math.min(.07,tot*.0024*(.6+S.pers.E/100))*sat))return;
  const x=pesata(ctx),m=INC[x],d={x};
  if(x==='tramite')d.p=pick(vivi(['Amico']).filter(a=>a.rapporto>=50&&!a.lontano));
  const rom=S.eta>=16&&single()&&m.rom&&chance(m.rom);
  coda.push({e:rom?EV.incontro_rom:EV['inc_'+x],d});
}
const DOVE={uscite:['a una festa','in un locale','a un aperitivo','a un concerto'],hobby:['al corso','in palestra, tra un esercizio e l\'altro','al tuo gruppo di '+'hobby'],volont:['al volontariato','a una raccolta fondi'],sport:['al campo','in piscina','al parco, correndo'],amici:['a cena da amici','a una grigliata tra amici'],lavoro:['al lavoro','in pausa caffè','a una riunione'],scuola:['a scuola','in classe','in biblioteca']};
function doveTesto(x){if(x==='hobby'){const hb=HOBBY.find(z=>z.id===S.hobby);return hb?`al corso di ${hb.n.toLowerCase()}`:'al corso'}return pick(DOVE[x]||['in giro'])}
function nuovoConoscente(c,dove){
  return nuovaPersona('Conoscente',c.sesso,c.eta,c.cognome,{nome:c.nome,pers:c.pers,tr:c.tr,rapporto:r(25,40),dove});
}

function orePartnerAuto(){
  if(!S.routine||S.eta<14||(S.routine.partner||0)>0)return;
  let lib=oreLibere()-oreRoutine();
  if(lib<4){const t=Math.min(S.routine.schermi||0,4-lib);S.routine.schermi=(S.routine.schermi||0)-t;lib+=t}
  S.routine.partner=Math.max(0,Math.min(4,lib));
}
