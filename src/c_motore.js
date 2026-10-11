/* ================= MOTORE ================= */
const KEY='vitamia_save_v4';
const KEEP='keep';
const $=s=>document.querySelector(s);
const r=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const chance=p=>Math.random()<p;
const clamp=(v,lo=0,hi=100)=>Math.max(lo,Math.min(hi,Math.round(v)));
const fmtEuro=new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
/* fino al 2001 si paga in lire: 1 euro = 1.936,27 lire (gli importi del gioco sono sempre euro dell'anno, qui si convertono) */
const LIRE=1936.27,migliaia=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
function lire(n){let x=Math.round((n||0)*LIRE);const a=Math.abs(x);x=a>=1e6?Math.round(x/1e4)*1e4:a>=1e4?Math.round(x/1e3)*1e3:Math.round(x/50)*50;return (x<0?'-':'')+migliaia(Math.abs(x))+'\u00a0lire'}
const eur=n=>S&&S.anno<2002?lire(n):fmtEuro.format(Math.round(n||0));
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
function pesata(arr){const t=arr.reduce((s,x)=>s+x[1],0);let x=Math.random()*t;for(const [it,w] of arr){x-=w;if(x<=0)return it}return arr.length?arr[arr.length-1][0]:null}
let S=null,coda=[],tab='vita',sheetOpen=false,toastT=null;
const g=(m,f)=>(S&&S.sesso==='F')?f:m;
const gp=(p,m,f)=>(p&&p.sesso==='F')?f:m;
const STAT={f:'felicita',s:'salute',i:'intelligenza',a:'aspetto'};
function mod(k,d){S[k]=clamp(S[k]+d)}
/* Passi frazionari su valori interi (rapporti 0–100): clamp() arrotonda e farebbe sparire i cali sotto 0,5.
   passo(.4) vale 1 nel 40% dei casi e 0 nel resto: in media il calo è quello giusto. */
const passo=d=>Math.trunc(d)+(Math.random()<Math.abs(d%1)?Math.sign(d):0);
function relD(p,d){p.rapporto=clamp(p.rapporto+passo(d))}
/* Dolore e preoccupazioni che pesano davvero: stress subito e una tensione che dura qualche mese */
function pesa(st,ten){if(!S.bis)return;S.bis.stress=clamp(S.bis.stress+st);S.tensione=(S.tensione||0)+(ten||0)}
function soldi(d){S.soldi=Math.round(S.soldi+d)}
function log(t,k){if(S&&S.log.length)S.log[S.log.length-1].righe.push({t:prezzi(t),k:k||''})}
function nuovoBloccoLog(){
  const L=S.log;
  if(L.length&&!L[L.length-1].righe.length&&L.length>1)L.pop();
  L.push({t:S.t,anno:S.anno,mese:S.mese,eta:S.eta,righe:[]});
}
function val(v){return Array.isArray(v)?r(v[0],v[1]):(typeof v==='function'?v():v)}
function segno(v){return Array.isArray(v)?v[0]+v[1]:(typeof v==='number'?v:0)}

function eff(o,d){
  for(const k in o){
    const v=val(o[k]);
    if(STAT[k])mod(STAT[k],v);
    else if(k==='k')S.karma=clamp(S.karma+v);
    else if(k==='m')soldi(typeof o[k]==='function'?v:P(v));   // importi scritti ai prezzi del 2026
    else if(k in ABIL)S.abil[k]=clamp(S.abil[k]+v);
    else if(k==='voto')S.scuola.voto=clamp(S.scuola.voto+v);
    else if(k==='perf'){if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+v)}
    else if(k==='rel'){if(d&&d.p){d.p.rapporto=clamp(d.p.rapporto+v);if(d.p.intim!==undefined)d.p.intim=clamp(d.p.intim+v*.5);d.p.ultimo=S.t}}
    else if(k==='bev')beve(v);
    else if(k==='gio')gioca(v);
  }
}
function beve(n){S.fatti.bev=(S.fatti.bev||0)+n;if(!S.dip.alcol&&S.eta>=16&&S.fatti.bev>=6&&chance(Math.max(.02,.1+pz('N')*.07-pz('C')*.07))){S.dip.alcol=true;log('Ti accorgi che bevi troppo spesso: hai un problema con l\'alcol.','b')}}
function gioca(n){S.fatti.gio=(S.fatti.gio||0)+n;if(!S.dip.gioco&&S.fatti.gio>=12&&chance(.25)){S.dip.gioco=true;log('Il gioco d\'azzardo è diventato una dipendenza.','b')}}

/* ---------- Testi con segnaposto ---------- */
function ruoloLabel(p){
  if(p.lav&&(p.ruolo==='Conoscente'||(p.ruolo==='Amico'&&lavInCorso(p))))return etichettaLav(p);
  switch(p.ruolo){
    case 'Fratello':return gp(p,'Fratello','Sorella');
    case 'Nonno':return gp(p,'Nonno','Nonna');
    case 'Figlio':return gp(p,'Figlio','Figlia');
    case 'Partner':return gp(p,'Fidanzato','Fidanzata');
    case 'Coniuge':return gp(p,'Marito','Moglie');
    case 'Amico':return p.best?gp(p,'Migliore amico','Migliore amica'):p.cella?gp(p,'Compagno di cella','Compagna di cella'):gp(p,'Amico','Amica');
    case 'Zio':return gp(p,'Zio','Zia');
    case 'Cugino':return gp(p,'Cugino','Cugina');
    case 'Suocero':return gp(p,'Suocero','Suocera');
    case 'Cognato':return gp(p,'Cognato','Cognata');
    case 'Patrigno':return gp(p,'Patrigno','Matrigna');
    case 'Nemico':return gp(p,'Nemico','Nemica');
    default:return p.ruolo;
  }
}
const tuoR=p=>gp(p,'tuo','tua')+' '+ruoloLabel(p).toLowerCase();
const tratto=p=>TRATTI[p.tr]?TRATTI[p.tr][p.sesso==='F'?1:0]:'';
function T(s,d){
  if(typeof s==='function')s=s(d||{});
  if(!s)return '';
  const p=d&&d.p;
  return s.replace(/\{(\w+)\}/g,(m,k)=>{
    switch(k){
      case 'o':return g('o','a');
      case 'P':return p?p.nome:'';
      case 'po':return gp(p,'o','a');
      case 'lui':return gp(p,'lui','lei');
      case 'Lui':return gp(p,'Lui','Lei');
      case 'gli':return gp(p,'gli','le');
      case 'Gli':return gp(p,'Gli','Le');
      case 'lo':return gp(p,'lo','la');
      case 'Lo':return gp(p,'Lo','La');
      case 'tuo':return p?tuoR(p):'';
      case 'Tuo':return p?cap(tuoR(p)):'';
      case 'nonno':return g('nonno','nonna');
      case 'xe':return eur(d&&d.x);
      default:return d&&d[k]!==undefined?d[k]:m;
    }
  });
}

/* ---------- Persone ---------- */
/* Un nome libero adatto alla generazione (annoN = anno di nascita; senza, una persona di circa 25 anni meno di te) */
function nomeLibero(sesso,annoN){
  const usati=new Set([S.nome,...S.relazioni.map(p=>p.nome)]);
  const L=nomiPer(sesso,annoN!==undefined?annoN:S.anno-Math.max(0,S.eta-2));
  for(let i=0;i<10;i++){const n=pick(L);if(!usati.has(n))return n}
  return pick(L);
}
/* Chi non è di famiglia (amici, colleghi, partner) può essere di origine straniera, se nato dal 1975 */
const ESTRANEI=['Amico','Partner','Nemico','Conoscente'];
function nomeEstraneo(sesso,annoN){if(annoN<1975||!chance(.08))return null;const g0=pick(NOMI_STRANIERI);return {nome:pick(g0[sesso==='F'?'F':'M']),cognome:pick(g0.c)}}
function nuovaPersona(ruolo,sesso,eta,cognome,x){
  const aN=S.anno-Math.max(0,eta),st=!cognome&&ESTRANEI.includes(ruolo)&&!(x&&x.nome)?nomeEstraneo(sesso,aN):null;
  const p={id:S.nextId++,ruolo,sesso,nome:st?st.nome:nomeLibero(sesso,aN),cognome:cognome||(st?st.cognome:pick(COGNOMI)),eta:Math.max(0,eta),rapporto:r(55,85),vivo:true,tr:0,da:S.t,mn:eta<=0&&S.t>0?S.mese:r(0,11)};
  Object.assign(p,x||{});
  if(!p.pers)p.pers=x&&x.tr!==undefined?persDaTr(x.tr):nuovoCarattere(x&&x.genitori);
  delete p.genitori;
  if(!x||x.tr===undefined)p.tr=trDaPers(p.pers);
  initNpc(p);
  S.relazioni.push(p);if(ruolo==='Partner')orePartnerAuto();
  if(S.gruppi&&['Amico','Conoscente'].includes(ruolo)&&!p.cella)assegnaGruppo(p,x&&x.dove,x&&x.via);
  return p;
}
const vivi=ruoli=>S.relazioni.filter(p=>p.vivo&&ruoli.includes(p.ruolo));
const genitoriVivi=()=>vivi(['Madre','Padre']).length>0;
const partnerAttuale=()=>S.relazioni.find(p=>p.vivo&&(p.ruolo==='Partner'||p.ruolo==='Coniuge'));
const convivente=()=>{const p=partnerAttuale();return !!(p&&p.conv)};
function relGenitori(dv){vivi(['Madre','Padre']).forEach(p=>p.rapporto=clamp(p.rapporto+dv))}
/* Gli amici sono più spesso dello stesso sesso (circa due su tre), a ogni età */
const sessoAmico=()=>chance(.65)?S.sesso:(S.sesso==='M'?'F':'M');
function relAmici(dv){vivi(['Amico']).forEach(p=>p.rapporto=clamp(p.rapporto+dv))}
function nuovoAmico(silenzio){
  if(vivi(['Amico']).length>=12)return null;
  const ses=sessoAmico();
  const p=nuovaPersona('Amico',ses,Math.max(4,S.eta+r(-3,3)),null,{rapporto:r(50,72)});
  if(!silenzio)log(`Fai amicizia con ${p.nome}.`,'g');
  return p;
}
function convivi(p){
  p.conv=true;p.lontano=false;p.dove=null;
  if(S.casa.tipo==='genitori'||S.casa.tipo==='figlio'){S.casa=affittoBase('Bilocale');log(`Tu e ${p.nome} prendete un bilocale in affitto insieme.`,'g')}
}

/* ---------- Istruzione ---------- */
const TIT=['Nessun titolo','Licenza media','Diploma','Laurea','Laurea magistrale','Dottorato'];
const STUDI=['elementari','medie','superiori','universita','magistrale','dottorato','master','its','serale','spec'];
const iscritto=()=>STUDI.includes(S.scuola.stato);
const rankL=l=>l.liv==='triennale'?3:4;
function haLaurea(campi,liv){liv=liv||3;return S.istr.lauree.some(l=>(!campi||campi.includes(l.n))&&rankL(l)>=liv)}
function titoloLabel(){
  const I=S.istr;
  if(I.dott)return `Dottorato in ${I.dott}`;
  if(I.lauree.length){const l=I.lauree[I.lauree.length-1];return `${l.liv==='triennale'?'Laurea':'Laurea magistrale'} in ${l.n}`}
  if(I.liv>=2)return `Diploma (${I.dip})`;
  return TIT[I.liv];
}
function elenco(a){return a.length<=2?a.join(' o '):a.slice(0,2).join(', ')+' o simili'}
function mancanti(q){
  const m=[];if(!q)return m;
  if(q.tit&&S.istr.liv<q.tit)m.push(TIT[q.tit]);
  if(q.lau&&!haLaurea(q.lau,q.liv))m.push((q.liv>=4?'Laurea magistrale in ':'Laurea in ')+elenco(q.lau));
  if(q.dip&&S.istr.dip!==q.dip)m.push(q.dip);
  if(q.cert&&!S.istr.cert.includes(q.cert))m.push(q.cert);
  if(q.abil&&!S.istr.abil.includes(q.abil))m.push('Abilitazione da '+q.abil.toLowerCase());
  if(q.dott&&!S.istr.dott)m.push('Dottorato di ricerca');
  if(q.master&&!S.istr.master)m.push('Master');
  if(q.spec&&!S.istr.spec)m.push('Specializzazione medica');
  if(q.sk&&S.abil[q.sk[0]]<q.sk[1])m.push(`${ABIL[q.sk[0]]} almeno ${q.sk[1]}`);
  if(q.int&&S.intelligenza<q.int)m.push(`Intelletto almeno ${q.int}`);
  if(q.sal&&S.salute<q.sal)m.push(`Salute almeno ${q.sal}`);
  if(q.fed&&S.fedina.length)m.push('Fedina penale pulita');
  if(q.patente&&!S.patente)m.push('Patente B');
  if(q.eta&&(S.eta<q.eta[0]||S.eta>q.eta[1]))m.push(`Età ${q.eta[0]}–${q.eta[1]}`);
  if(q.or&&!q.or.some(x=>mancanti(x).length===0))m.push(q.or.map(x=>mancanti(x).join(' e ')).join(' oppure '));
  return m;
}

/* ---------- Lavoro ---------- */
const stipLiv=(j,i)=>Math.round(j.stip*(j.m||MOLT)[i]*ip());
const nomeJob=(j,i,p)=>{const n=j.liv[i];const f=p?p.sesso==='F':S.sesso==='F';return (f&&n[1])?n[1]:n[0]};
function requisitiJob(j){
  const m=mancanti(j.req);
  if(!j.pt&&S.eta<18)m.unshift('Maggiore età');
  if(['dottorato','spec'].includes(S.scuola.stato))m.unshift('Incompatibile con '+(S.scuola.stato==='spec'?'la specializzazione':'il dottorato'));
  if(!j.pt&&['elementari','medie','superiori'].includes(S.scuola.stato))m.unshift('Prima finisci la scuola');
  return m;
}
function assumi(j){
  const primo=!S.fatti.primoLavoro&&!S.lavoro&&!S.storico.length&&!j.pt&&S.vivo&&S.eta>=15;
  if(S.lavoro){pagaTFR();S.storico.push(S.lavoro.nome)}
  S.naspi=null;S.sfl=null;
  let liv=0;if(j.boost&&S.istr.cert.includes(j.boost.cert))liv=j.boost.liv;
  S.lavoro={id:j.id,da:S.t,liv,anniLiv:0,anni:0,perf:60,stip:Math.round(stipLiv(j,liv)*(1+r(-3,6)/100)*fattoreGenere()*fattoreZona(j)),nome:nomeJob(j,liv),contratto:contrattoIniziale(j,liv)};
  if(chance(ptIniziale(j)))S.lavoro.ptv=true;
  if(S.vivo)log(`Contratto: ${descrContratto(S.lavoro).toLowerCase()}${S.lavoro.ptv&&S.lavoro.contratto.t!=='piva'&&!/part-time/.test(descrContratto(S.lavoro))?' · part-time':''}.`,'h');
  S.ultimoLavoro=S.lavoro.nome;
  if(!j.pt)S.fatti.primoLavoro=1;
  if(primo)momento('lavoro',{tit:S.lavoro.nome,sub:descrContratto(S.lavoro),txt:`Stipendio: ${eur(ralEff(S.lavoro)/12)} lordi al mese. Il primo lavoro vero.`});
  iniziaSquadra(false);   // il capo e i colleghi (c10_squadra.js)
}
/* vol: lo lasci tu (niente NASpI) */
function licenzia(testo,vol){if(!S.lavoro)return;const L=S.lavoro;log(testo,vol?'h':'b');pagaTFR();S.storico.push(L.nome);S.lavoro=null;if(!vol){mod('felicita',-12);pesa(10,5);if(!isPiva(L))avviaNaspi(L);if(S.legami)bisognoAiuto('lavoro');if(S.eta>=22&&S.eta<=55&&chance(.15))futuro(.25,'car_settore',{})}}   // la partita IVA non ha la NASpI
function lavoroPerFiglio(p){
  if(p.studio&&p.studio.startsWith('laurea:')){const f=p.studio.slice(7);const ok=LAVORI.filter(j=>j.req&&j.req.lau&&j.req.lau.includes(f)&&!j.req.abil&&!j.req.liv);if(ok.length)return pick(ok).id;return 'imp'}
  if(p.studio==='diploma')return pick(['imp','tec','com','agi','rec','cam','ope','segr','cass','callc','post','agcom']);
  return pick(['cam','com','mag','ope','rider','mur','puli','bracc','idra','elet','mecc','pane','colf','badante']);
}

/* ---------- Scelte ed effetti ---------- */
function futuro(anni,id,d){S.futuri.push({t:S.t+Math.max(1,Math.round(anni*12+r(-4,4))),id,pid:d&&d.p?d.p.id:null,x:d?d.x:undefined})}
const costoScelta=(c,d)=>typeof c.costo==='function'?c.costo(d||{}):(c.costo||0);
function scegli(c,d){
  d=d||{};
  const costo=costoScelta(c,d);
  if(costo){if(S.soldi<costo)return ['Non hai abbastanza soldi.','x'];soldi(-costo)}
  effettoIncl(c);
  let b=c;
  if(c.p!==undefined){const p=typeof c.p==='function'?c.p(d):c.p;b=chance(pIncl(c,p))?c.si:c.no}
  return applica(b||{},d);
}
/* Una scelta che plasma il carattere: ritorna « Ti rende un po' più …» se il cambiamento si nota */
function applicaPers(o){
  if(!S.pers)return '';
  const pl=plasticita(S.eta),sp=[];
  for(const k in o){
    let v=o[k]*pl;
    // da adulti, spingere un tratto già estremo ancora più in là è più difficile
    if(S.eta>=18&&Math.sign(v)===Math.sign(S.pers[k]-50))v*=Math.max(.25,1-Math.abs(S.pers[k]-50)/60);
    cambiaPers(k,v);
    if(Math.abs(v)>=1.5||(Math.abs(o[k])>=3&&Math.abs(v)>=.9))sp.push(cambioPers(k,v));
  }
  return sp.length?` Ti rende un po' più ${sp.slice(0,2).join(' e ')}.`:'';
}
function applica(b,d){
  if(b.gen)cambiaGen(b.gen);
  if(b.x!==undefined)d.x=b.x;
  if(b.fx){const rv=b.fx(d);if(rv===null||rv===KEEP)return rv;if(Array.isArray(rv))return b.pers&&rv[1]!=='x'?[rv[0]+applicaPers(b.pers),rv[1]]:rv}
  if(b.e)eff(b.e,d);
  if(b.fl)S.fatti[b.fl]=true;
  const carT=b.pers?applicaPers(b.pers):'';
  if(b.fut)futuro(b.fut[0],b.fut[1],d);
  if(b.pr)processo(b.pr);
  let k=b.k;
  if(k===undefined){const e=b.e||{};const v=segno(e.f)+segno(e.s)+(e.m?Math.sign(segno(e.m))*3:0)+(e.rel?Math.sign(segno(e.rel))*2:0);k=v>0?'g':v<0?'b':''}
  return [T(b.r||'',d)+carT,k];
}

/* ---------- Nuova vita ---------- */
function statoBase(o){
  const anno=new Date().getFullYear();
  const mn=o.meseNascita!==undefined?o.meseNascita:r(0,11);
  const aN=o.annoNascita||anno;
  const eta=o.eta||0;
  return {v:4,t:o.t||0,anno:o.anno||aN+eta,mese:o.mese!==undefined?o.mese:mn,meseNascita:mn,pers:o.pers||nuovoCarattere(),att:o.att||null,look:o.look||null,persStoria:[],persSegni:[],persBase:null,sonno:sonnoDefault(eta),routine:{},bis:BIS0(),tensione:0,proposito:null,umoreTarget:60,
    nome:o.nome,cognome:o.cognome,sesso:o.sesso,citta:o.citta,prov:o.prov||null,mondo:o.mondo||mondoBase(aN),eta,annoNascita:aN,gen:o.gen||1,cdAz:{},
    salute:r(65,100),felicita:r(60,100),intelligenza:o.int||r(20,95),aspetto:o.asp||r(20,95),karma:50,soldi:o.soldi||0,classe:o.classe||'media',
    abil:{sport:r(0,12),musica:r(0,12),arte:r(0,12),cucina:r(0,8),tech:r(0,8),lingue:r(0,8)},hobby:null,
    scuola:{stato:'nessuna',tipo:'',anni:0,voto:50,boc:0,fuori:0},
    istr:{liv:0,dip:'',lauree:[],cert:[],abil:[],master:false,dott:'',spec:''},
    lavoro:null,storico:[],ultimoLavoro:'',contributi:0,pensione:0,azienda:null,borsa:{},costoBorsa:{},prestiti:[],social:{attivo:false,follower:0,comprati:0},fama:0,crim:{exp:0,noto:0,clan:null,colpi:0},galera:null,
    casa:{tipo:'genitori'},prop:[],veicoli:[],mercato:null,
    patente:false,fedina:[],carcere:0,latitante:false,dip:{fumo:false,alcol:false,gioco:false},
    malattie:[],relazioni:[],animali:[],fatti:{},ultimi:{},futuri:[],azioni:{},log:[{t:o.t||0,anno:o.anno||aN+eta,mese:o.mese!==undefined?o.mese:mn,eta,righe:[]}],nextId:1,vivo:true,causa:'',attrazione:null,orient:pesata([['etero',94],['omo',3],['bi',3]])};
}
/* o: {sesso,nome,cognome,citta,prov} e, dalla schermata di creazione, anche
   anno, meseN, giorno, look, note {ora,peso,segno}, fam {classe, madre{nome,cognome,eta,look}, padre{nome,eta,look}, fratelli[{sesso,nome,eta}]} */
/* Fratelli più grandi scelti nella creazione (età in anni): mesi di vita di ciascuno alla tua nascita, o null se le età non vanno.
   Le regole sono quelle di tools/invarianti.js: ognuno ad almeno 15 mesi dagli altri e da te (niente gemelli). Con casuale=true i mesi
   dentro l'anno sono a caso (l'ultimo tentativo è il più stretto possibile, che riesce se le età vanno). */
function mesiFratelli(ages,casuale){
  const ord=ages.map((a,i)=>i).sort((x,y)=>ages[x]-ages[y]);
  for(let t=0;t<40;t++){
    const out=[];let prima=0,ok=true;
    for(const i of ord){const lo=Math.max(12*ages[i],prima+15),hi=12*ages[i]+11;if(lo>hi){ok=false;break}
      out[i]=casuale&&t<39?r(lo,hi):lo;prima=out[i]}
    if(ok)return out;
    if(!casuale)break;
  }
  return null;
}
function nuovaVita(o){
  const F=o.fam||{};
  const classe=F.classe||pesata([['umile',30],['media',55],['agiata',15]]);
  S=statoBase({...o,classe,annoNascita:o.anno,meseNascita:o.meseN});
  S.giornoNascita=o.giorno||r(1,28);if(o.note)S.fatti.nascita=o.note;
  S.fatti.cittaNascita=S.citta;S.fatti.provNascita=S.prov;
  const FM=F.madre||{},FP=F.padre||{};
  const madre=nuovaPersona('Madre','F',FM.eta||r(21,40),FM.cognome,FM.nome?{nome:FM.nome}:null);
  const padre=nuovaPersona('Padre','M',FP.eta||clamp(madre.eta+r(-3,7),20,60),S.cognome,FP.nome?{nome:FP.nome}:null);
  madre.look=FM.look||lookCasuale('F');padre.look=FP.look||lookCasuale('M');
  S.look=o.look||lookFiglio(madre.look,padre.look,S.sesso);
  S.pers=nuovoCarattere([madre,padre]);
  madre.stato=chance(.62)?'lavora':'casa';padre.stato=chance(.9)?'lavora':'disoccupato';
  madre.coppia=padre.coppia='sposato';
  S.fatti.intesaGenitori=clamp(70-Math.abs(madre.pers.A-padre.pers.A)*.2-(madre.pers.N+padre.pers.N-100)*.3+(madre.pers.A+padre.pers.A-100)*.25+r(-15,15));
  const fr=[];
  if(F.fratelli){const mm=mesiFratelli(F.fratelli.map(x=>x.eta),true);   // mese di nascita dei fratelli scelti: ≥15 mesi di distanza
    F.fratelli.forEach((x,i)=>fr.push(nuovaPersona('Fratello',x.sesso,x.eta,S.cognome,Object.assign({nome:x.nome,rapporto:r(50,85),genitori:[madre,padre]},mm?{mn:(S.mese-mm[i]%12+12)%12}:{}))))}
  else{const nFr=pesata([[0,40],[1,40],[2,15],[3,5]]),maxM=Math.min(12,madre.eta-19)*12+11,usati=[0];
    for(let i=0;i<nFr&&maxM>=15;i++){let m=0;for(let g=0;g<30&&!m;g++){const x=r(15,maxM);if(usati.every(u=>Math.abs(u-x)>=15))m=x}if(!m)break;   // mesi di vita del fratello
      usati.push(m);fr.push(nuovaPersona('Fratello',pick(['M','F']),Math.floor(m/12),S.cognome,{rapporto:r(50,85),genitori:[madre,padre],mn:(S.mese-m%12+12)%12}))}}
  for(const f of fr)f.look=lookFiglio(madre.look,padre.look,f.sesso);
  [[madre,null],[padre,S.cognome]].forEach(([gen,cog])=>{
    const base=gen.eta+r(22,32);
    if(base<92&&chance(.8))nuovaPersona('Nonno','M',base+r(0,3),cog||pick(COGNOMI),{rapporto:r(65,95)});
    if(base<95&&chance(.85))nuovaPersona('Nonno','F',base+r(-2,1),pick(COGNOMI),{rapporto:r(65,95)});
  });
  if(madre.eta<38&&chance(.45))S.futuri.push({eta:r(1,6),id:'nasce_fratello'});
  creaZii(madre,null);creaZii(padre,S.cognome);
  const cl={umile:'una famiglia dalle condizioni modeste',media:'una famiglia della classe media',agiata:'una famiglia benestante'}[classe];
  const L0=luogo();
  log(`Sei nat${g('o','a')} a ${S.citta}${L0.prov&&L0.prov!==S.citta?`, in provincia di ${L0.prov}`:''} (${L0.reg}), il ${S.giornoNascita} ${MESI[S.mese]} ${S.annoNascita}, in ${cl}.`);
  log(`Tua madre si chiama ${madre.nome} ${madre.cognome}, tuo padre ${padre.nome} ${padre.cognome}.`);
  const zii=vivi(['Zio']).length,cug=vivi(['Cugino']).length;
  if(zii)log(`Hai ${zii} ${zii===1?'zio o zia':'zii'}${cug?` e ${cug} ${cug===1?'cugino':'cugini'}`:''}.`,'h');
  if(fr.length)log(fr.length===1?`Hai ${gp(fr[0],'un fratello','una sorella')} più grande: ${fr[0].nome}.`:`Hai ${fr.length} fratelli più grandi: ${fr.map(f=>f.nome).join(', ')}.`);
  log(`Sei ${descrPers(S.pers,S.sesso)}: lo scoprirai crescendo, e il tuo carattere cambierà con quello che vivrai.`,'h');
  log('Premi «+1 mese» per far passare il tempo. Dai 6 anni decidi tu come usare le ore libere di ogni settimana.','h');
  log('Col pulsante «Salva» in alto puoi scaricare la partita o copiarne il codice, per riprenderla anche su un altro telefono.','h');
  S.routine=routineDefault();
  tab='vita';coda=[];save();render();
}
function patrimonio(X){
  X=X||S;let t=X.soldi+valoreBorsa(X)-residuoPrestiti(X);
  for(const p of X.prop)t+=p.valore-(p.mutuo?p.mutuo.residuo:0);
  for(const c of X.veicoli)t+=c.valore-(c.prestito?c.prestito.rata*c.prestito.anni:0);
  if(X.azienda)t+=valoreAzienda(X.azienda);
  t+=valoreCollezioni(X);
  return Math.round(t);
}
function continuaCome(pid){
  const old=S,f=old.relazioni.find(p=>p.id===pid);if(!f)return;
  const figli=old.relazioni.filter(p=>p.vivo&&p.ruolo==='Figlio');
  const qs=quoteSuccessione(old).find(x=>x[0]===f),lordo=Math.max(0,patrimonio(old)*.96*(qs?qs[1]:1/Math.max(1,figli.length)));   // successione legittima
  const quota=Math.round(lordo-impostaSucc(lordo));
  const classe=quota>300000?'agiata':quota>40000?'media':'umile';
  const look=lookDi(f);
  S=statoBase({nome:f.nome,cognome:f.cognome,sesso:f.sesso,citta:old.citta,prov:old.prov,mondo:old.mondo,eta:f.eta,annoNascita:old.anno-f.eta-(old.mese<(f.mn||0)?1:0),anno:old.anno,mese:old.mese,meseNascita:f.mn||0,t:f.eta*12,pers:f.pers,look,gen:old.gen+1,soldi:quota,classe,
    int:clamp(old.intelligenza+r(-25,20),5,100),asp:clamp(old.aspetto+r(-25,20),5,100)});
  S.nextId=old.nextId;
  const con=old.relazioni.find(p=>p.vivo&&p.ruolo==='Coniuge');
  if(con)S.relazioni.push({...con,ruolo:con.sesso==='F'?'Madre':'Padre',rapporto:r(55,90),conv:false});
  figli.filter(p=>p.id!==pid).forEach(p=>S.relazioni.push({...p,ruolo:'Fratello',rapporto:r(45,85)}));
  old.relazioni.filter(p=>p.vivo&&(p.ruolo==='Madre'||p.ruolo==='Padre')).forEach(p=>S.relazioni.push({...p,ruolo:'Nonno',rapporto:r(55,90)}));
  old.relazioni.filter(p=>p.vivo&&p.ruolo==='Nipote'&&p.gen===pid).forEach(p=>S.relazioni.push({...p,ruolo:'Figlio',rapporto:r(65,95)}));
  if(f.sposato&&f.eta>=22)nuovaPersona('Coniuge',f.sesso==='F'?'M':'F',f.eta+r(-3,3),null,{rapporto:r(55,85),conv:true});
  const e=S.eta,sc=S.scuola;
  if(e>=14)S.istr.liv=1;
  if(e>=3&&e<6)sc.stato='asilo';
  else if(e>=6&&e<11){sc.stato='elementari';sc.voto=f.voto||55}
  else if(e>=11&&e<14){sc.stato='medie';sc.voto=f.voto||55}
  else if(e>=14&&e<19){const t=pick(SUPERIORI);Object.assign(sc,{stato:'superiori',tipo:t.n,anni:19-e,voto:f.voto||55,diff:t.d,sk:t.sk})}
  else if(e>=19){sc.stato='finita';
    if(f.studio&&f.studio!=='licenza'){S.istr.liv=2;S.istr.dip=pick(SUPERIORI).n}
    if(f.studio&&f.studio.startsWith('laurea:')){S.istr.liv=3;S.istr.lauree.push({n:f.studio.slice(7),liv:'triennale',voto:r(90,110)})}
    if(f.lavoro&&JOB[f.lavoro]&&e>=20){S.fatti.primoLavoro=1;assumi(JOB[f.lavoro]);S.lavoro.anni=Math.max(0,e-24)}
  }
  if(e>=25||(e>=18&&!S.relazioni.some(p=>p.ruolo==='Madre'||p.ruolo==='Padre'))){S.casa=affittoBase('Bilocale');if(S.relazioni.some(p=>p.ruolo==='Coniuge'))S.relazioni.find(p=>p.ruolo==='Coniuge').conv=true}
  if(e>=18&&chance(.7))S.patente=true;
  S.fatti.hobbyChiesto=e>6;
  S.routine=routineDefault();if(S.eta>=4)formaAttaccamento();
  log(`Continui la storia della famiglia come ${S.nome}, ${g('figlio','figlia')} di ${old.nome}. Generazione ${S.gen}.`,'g');
  if(quota>0)log(`Erediti ${eur(quota)}${qs&&qs[1]<1?`: la tua parte (${Math.round(qs[1]*100)}%) secondo la legge`:''}.`,'g');
  tab='vita';coda=[];save();render();
}

/* ---------- Passare un mese ---------- */
function pulisciAzioni(){if(!S.cdAz)S.cdAz={};for(const k in S.azioni){if((S.cdAz[k]||0)<=S.t){delete S.azioni[k];delete S.cdAz[k]}}}
function mese(silenzioso){
  if(!S||!S.vivo||sheetOpen)return;
  S.t++;S.mese++;if(S.mese>11){S.mese=0;S.anno++}
  S.mercato=null;pulisciAzioni();
  nuovoBloccoLog();
  if(S.mese===0)inizioAnno();
  if(S.mese===S.meseNascita){S.eta++;S.log[S.log.length-1].eta=S.eta;compleanno()}
  if(S.carcere>0)meseCarcere();
  meseNpc();
  chiudiGruppi();meseSociale();
  meseFamiglia();
  meseAnimali();
  if(S.carcere===0)meseScuola();
  calendario();
  storiaMese();
  meseLavoro();meseSquadra();
  meseItalia();
  normalizzaRoutine();
  meseRoutine();
  bisogni();
  finanzeMese();
  meseSalute();
  if(S.latitante&&chance(.03)){S.latitante=false;log('La polizia ti trova: la latitanza è finita.','b');entraCarcere(r(3,5))}
  for(const f of S.futuri)if(f.t===undefined)f.t=S.t+Math.max(1,((f.eta||S.eta)-S.eta)*12);
  const due=S.futuri.filter(f=>f.t<=S.t);S.futuri=S.futuri.filter(f=>f.t>S.t);
  for(const f of due){
    const e=EV[f.id];if(!e)continue;
    const d={x:f.x,_fut:1};
    if(f.pid){d.p=S.relazioni.find(p=>p.id===f.pid);if(!d.p||!d.p.vivo)continue}
    if(e.cond&&!e.cond(d))continue;
    if(e.auto){const res=conCausa(T(e.t,d),()=>scegli(e.auto,d));if(res&&res[0])log(res[0],res[1])}
    else coda.push({e,d});
  }
  if(controllaMorte()){render();return}
  eventiMese();
  emergenti();
  impulsi();
  if(coda.length>3)coda=coda.slice(0,3);
  save();render();next();
}
function inizioAnno(){
  annoMondo();if(S.montante){const k=1+S.mondo.infl+.005;S.montante=Math.round(S.montante*k);if(S.montRetr)S.montRetr=Math.round(S.montRetr*k)}
  if(S.anno===1996&&S.contrib95===undefined)S.contrib95=S.contributi||0;annoFama();annoNemici();annoBeni();annoLusso();
  if(S.azienda)annoAzienda();
  if(S.crim.clan)annoClan();
  if(S.pensione)S.pensione=Math.round(S.pensione*(1+S.mondo.infl*.9));
  const L=S.lavoro;if(L)L.stip=Math.round(L.stip*(1+S.mondo.infl*.8+r(0,2)/100));
  if(S.fatti.bilAnno!==undefined&&S.eta>=18)log(`Bilancio dell'anno ${S.anno-1}: ${S.fatti.bilAnno>=0?'+':''}${eur(S.fatti.bilAnno)}.`,'h');
  S.fatti.bilAnno=0;
}
function compleanno(){
  tappe();maturazione();if([12,18,30,40,50,60,70,80,90].includes(S.eta))fotoCarattere();S.fatti.bev=Math.max(0,(S.fatti.bev||0)-1);S.fatti.gio=Math.max(0,(S.fatti.gio||0)-2);
  if(S.eta===4&&!S.att)formaAttaccamento();
  if(S.eta===6||S.eta===14||S.eta===19){const d=routineDefault();for(const k in d)if(S.routine[k]===undefined)S.routine[k]=d[k]}
  const sd=sonnoDefault(S.eta),sv=sonnoDefault(S.eta-1);if(S.sonno===sv&&sd!==sv)S.sonno=sd;
  if(S.eta>=35&&chance(.6))mod('aspetto',-1);
  if(S.eta>=72)mod('intelligenza',-r(0,1));
  const h=HOBBY.find(x=>x.id===S.hobby);
  if(h&&h.id==='calcio'&&S.abil.sport>=70&&S.eta>=15&&S.eta<=21&&!S.fatti.scout&&chance(.5))coda.push({e:EV.scout,d:{}});
  if(h&&h.id==='musica'&&S.abil.musica>=65&&S.eta>=16&&S.eta<=35&&!S.fatti.talent&&chance(.35))coda.push({e:EV.talent,d:{}});
  const L=S.lavoro;
  if(!S.pensione&&S.carcere===0&&pensioneMaturata()){
    if(L&&!S.fatti['pens'+S.eta])coda.push({e:EV.pensione,d:{}});
    else if(!L&&!S.azienda)vaiInPensione(true);
  }
  if(S.eta>=6&&S.eta%5===0&&S.eta<=90&&!coda.length&&chance(.5))coda.push({e:EV.compleanno_tondo,d:{}});
  if(S.carcere===0)presentaAmici(S.eta<14?'Alla tua festa':'Alla tua cena di compleanno');
  if(S.eta>=30&&S.eta%10===0)auguriDalPassato();
  if(S.eta>=18&&S.eta<=60&&!S.aspir&&S.carcere===0)coda.push({e:EV.aspirazioni,d:{}});
  else if(S.aspir&&S.eta>=25&&S.eta<=75&&S.carcere===0&&coda.length<2&&S.eta-(S.fatti.aspEta||18)>=(aspAttive().length?9:4)&&aspLiberi().length&&chance(.5)){const da=S.fatti.aspEta||18;S.fatti.aspEta=S.eta;coda.push({e:EV.asp_ripensa,d:{da}})}
  controllaNaja();
}
function tappe(){
  const e=S.eta;
  if(e===1)log(`Dici la tua prima parola: «${pick(['mamma','papà','pappa','no','nonna','acqua'])}».`);
  if(e===2)log('Muovi i primi passi in corridoio, tra gli applausi di tutti.');
  if(e===18)log('Compi 18 anni: sei maggiorenne!','g');
  if(e===6&&!S.fatti.hobbyChiesto){S.fatti.hobbyChiesto=1;coda.push({e:EV.scelta_hobby,d:{}})}
  if(e===50)log('Mezzo secolo! Gli amici ti organizzano una festa a sorpresa.','g');
  if(e===100){log('Cento anni! Il sindaco viene a farti gli auguri.','g');mod('felicita',10)}
  if(e>=10&&e%10===0&&e!==50&&e!==100)log(`Compi ${e} anni.`,'h');
}
function morteP(eta,sal,sesso){return Math.min(.95,.00034*Math.exp(.095*Math.max(0,eta-30))*fattoreSesso(sesso)+Math.max(0,45-sal)/400)}
function mortePersona(p){
  p.vivo=false;p.mortoT=S.t;const conv=p.conv;p.conv=false;
  if(['Coniuge','Partner'].includes(p.ruolo))S.fatti.fineCoppiaT=S.t;
  if(['Madre','Padre'].includes(p.ruolo)){const o=S.relazioni.find(x=>x.vivo&&x.ruolo===(p.ruolo==='Madre'?'Padre':'Madre'));if(o&&o.coppia==='sposato')o.coppia='vedovo'}
  const lutto={Madre:18,Padre:18,Coniuge:22,Partner:18,Figlio:30,Fratello:14,Nonno:8,Amico:8,Ex:2,Nipote:12,Zio:4,Cugino:4,Suocero:4,Cognato:3,Patrigno:10,Nemico:0}[p.ruolo]??6;
  if(p.ruolo==='Nemico'){log(`${p.nome}, ${gp(p,'il tuo nemico','la tua nemica')}, è mort${gp(p,'o','a')}.`,'h');return}
  if(p.ruolo==='Zio'&&chance(.15)){const q=r(5,60)*1000;soldi(q);log(`${cap(tuoR(p))} ${p.nome} ti lascia ${eur(q)} in eredità.`,'g')}
  mod('felicita',-r(lutto-4,lutto));if(lutto>=14||p.rapporto>=70)segnaVita('lutto');
  pesa(Math.round(lutto*.7*(.6+p.rapporto/250)),Math.round(lutto/3));
  log(`${cap(tuoR(p))} ${p.nome} è mort${gp(p,'o','a')} a ${p.eta} anni.`,'b');
  if(S.legami)luttoPerChi(p);
  if(S.legami&&vicino(p)){const m=ricordoDi(p,1,10);if(m&&chance(.6)){log(`${p.nome} non aveva mai dimenticato una cosa di ${quanto(m)}: ${m.s.charAt(0).toLowerCase()+m.s.slice(1)}. Lo raccontava a tutti.`,'h');ritorno(p,m,'addio')}}
  if(lutto>=14&&S.legami)bisognoAiuto('lutto',p);
  if((p.ruolo==='Madre'||p.ruolo==='Padre')&&!genitoriVivi())ereditaGenitori();
  if(p.ruolo==='Nonno'&&chance(.4)){const q={umile:500,media:3000,agiata:15000}[S.classe]*r(1,4);soldi(q);log(`${cap(tuoR(p))} ti lascia ${eur(q)} in eredità.`,'g')}
  if(p.ruolo==='Coniuge'){log(`Rimani vedov${g('o','a')}.`,'b');avviaReversibilita(p)}
  if(conv&&S.casa.tipo==='affitto')log('Ora devi pagare l\'affitto da sol'+g('o','a')+'.','h');
}
function annoFiglio(p){
  if(p.voto===undefined)p.voto=r(30,90);
  crescitaFiglio(p);if(p.eta===18&&!p.conEx)bilancioFiglio(p);
  if(p.eta===6)log(`${p.nome} inizia le elementari.`,'h');
  if(p.eta>=6&&p.eta<=19)p.voto=clamp(p.voto+r(-6,6)+(p.rapporto>70?1:-1));
  if(p.eta===19){p.studio=p.voto>35?'diploma':'licenza';if(p.studio==='diploma'){log(`${p.nome} si diploma. Che orgoglio!`,'g');mod('felicita',4);if(chance(.15+p.voto/200))p.uni=pick(FACOLTA).n}}
  if(p.uni&&p.eta===23){p.studio='laurea:'+p.uni;log(`${p.nome} si laurea in ${p.uni}!`,'g');mod('felicita',6);p.uni=null}
  if(!p.lavoro&&p.eta>=20&&p.eta<=34&&!p.uni&&chance(.3)){p.lavoro=lavoroPerFiglio(p);log(`${p.nome} trova lavoro come ${nomeJob(JOB[p.lavoro],0,p).toLowerCase()}.`,'h')}
  if(!p.fuori&&p.eta>=19&&chance(p.eta>=27?.4:.12)){p.fuori=true;log(`${p.nome} va a vivere da sol${gp(p,'o','a')}.`,'h')}
}
const etaScol=()=>S.anno-S.annoNascita;
function meseScuola(){if(iscritto())S.scuola.mesiAnno=(S.scuola.mesiAnno||0)+1}
function inizioScuola(){
  const sc=S.scuola,e=etaScol();
  if(e>=3&&e<6&&sc.stato==='nessuna'){sc.stato='asilo';log('Inizi la scuola dell\'infanzia.')}
  else if(e>=6&&(sc.stato==='asilo'||(sc.stato==='nessuna'&&e<9))){sc.stato='elementari';sc.voto=clamp(40+S.intelligenza/2+r(-10,10));sc.diff=.4;sc.cl=1;log('Primo giorno di elementari. Zaino nuovo e un po\' di ansia.');if(chance(.7))nuovoAmico()}
  else if(sc.stato==='elementari'&&e>=11){sc.stato='medie';sc.diff=.5;sc.cl=1;log('Inizi le scuole medie.');if(chance(.6))nuovoAmico()}
  else if(iscritto()&&!['asilo'].includes(sc.stato)&&S.eta<25)log(varia('scuola',TESTI.scuola),'h');
}
function fineScuola(){
  const sc=S.scuola,e=etaScol();
  if(sc.stato==='medie'&&e>=14){
    const giud=sc.voto>=85?'10 e lode':sc.voto>=75?'9':sc.voto>=62?'8':sc.voto>=50?'7':'6';
    S.istr.liv=1;sc.stato='finita';sc.mesiAnno=0;log(`Superi l'esame di terza media con ${giud}.`,'g');coda.push({e:EV.superiori,d:{}});return;
  }
  if(!iscritto()||sc.stato==='asilo')return;
  const diff=sc.diff||.5;
  sc.voto=clamp(sc.voto+(S.intelligenza-50)/16-(diff-.5)*10+r(-4,4)+(S.felicita<25?-4:0)+(S.lavoro&&!JOB[S.lavoro.id].pt&&sc.stato!=='serale'?-4:0)+(S.dip.alcol?-4:0)+pz('C')*3);
  mod('intelligenza',r(0,2));
  if(sc.sk)S.abil[sc.sk]=clamp(S.abil[sc.sk]+r(1,4));
  if(['elementari','medie'].includes(sc.stato)){sc.mesiAnno=0;log(`Pagella di fine anno: media del ${(4+sc.voto*.06).toFixed(1).replace('.',',')}.`,sc.voto>=50?'':'b');return}
  if((sc.mesiAnno||0)<6){sc.mesiAnno=0;return}
  sc.mesiAnno=0;
  sc.anni--;
  if(sc.stato==='superiori'&&sc.anni>0&&sc.voto<28&&chance(.5)){sc.anni++;sc.boc++;sc.voto=clamp(sc.voto+15);mod('felicita',-8);segnaVita('licenziato');log(`Sei stat${g('o','a')} bocciat${g('o','a')}: ripeti l'anno.`,'b');return}
  if(sc.stato==='universita'&&S.fatti.borsa===undefined&&S.classe==='umile')S.fatti.borsa=sc.voto>=55;
  if(sc.anni<=0)fineCorso();
}
function fineCorso(){
  const sc=S.scuola,I=S.istr,st=sc.stato;
  if(st==='superiori'||st==='serale'){
    if(sc.voto<35&&sc.boc<2){sc.anni=1;sc.boc++;mod('felicita',-10);log(`Non superi la maturità. Dovrai ripetere l'ultimo anno.`,'b');return}
    const v=Math.min(100,Math.round(60+sc.voto*.4+r(-3,3)));
    I.liv=Math.max(I.liv,2);I.dip=st==='serale'?'Istituto tecnico economico':sc.tipo;sc.stato='finita';mod('felicita',8);
    const lodeD=v===100&&chance(.4);
    log(`Maturità superata: diploma ${st==='serale'?'serale ':''}di ${I.dip} con ${v}/100${lodeD?' e lode':''}.`,'g');
    momento('diploma',{tit:`Diploma: ${I.dip}`,sub:`${v}/100${lodeD?' e lode':''}`});
    if(st==='superiori')coda.push({e:EV.dopo_diploma,d:{}});
    return;
  }
  if(st==='universita'||st==='magistrale'){
    if(sc.voto<35&&sc.fuori<2){sc.anni=1;sc.fuori++;mod('felicita',-5);log('Ti mancano ancora degli esami: vai fuori corso.','b');return}
    const v=Math.min(110,Math.round(66+sc.voto*.44));
    const liv=st==='magistrale'?'magistrale':(sc.cu?'ciclo unico':'triennale');
    I.lauree.push({n:sc.tipo,liv,voto:v});I.liv=Math.max(I.liv,liv==='triennale'?3:4);
    sc.stato='finita';S.fatti.fuorisede=false;S.fatti.borsa=undefined;mod('felicita',12);segnaVita('laurea');
    const lode=v===110&&chance(.5);
    log(`Ti laurei ${liv==='triennale'?'':'(magistrale) '}in ${sc.tipo} con ${v}/110${lode?' e lode':''}. Corona d'alloro e festa con tutti.`,'g');
    momento('laurea',{tit:`${g('Dottore','Dottoressa')} in ${sc.tipo}`,sub:`${v}/110${lode?' e lode':''} · laurea ${liv}`,txt:'Corona d\'alloro, foto con i parenti e una festa che non dimenticherai.'});
    S.fatti.ultimoVoto=v;
    coda.push({e:liv==='triennale'?EV.dopo_triennale:EV.dopo_magistrale,d:{x:sc.tipo}});
    return;
  }
  if(st==='dottorato'){I.dott=sc.tipo;I.liv=5;sc.stato='finita';mod('felicita',10);log(`Discuti la tesi di dottorato: ora sei dottor${g('e','essa')} di ricerca in ${sc.tipo}.`,'g');return}
  if(st==='master'){I.master=true;sc.stato='finita';mod('felicita',5);log(`Concludi il master in ${sc.tipo}.`,'g');return}
  if(st==='its'){const t=ITS.find(x=>x.n===sc.tipo);if(t&&!I.cert.includes(t.cert))I.cert.push(t.cert);I.liv=Math.max(I.liv,2);sc.stato='finita';mod('felicita',6);log(`Ti diplomi all'${sc.tipo}.`,'g');return}
  if(st==='spec'){I.spec=sc.tipo;sc.stato='finita';mod('felicita',8);log(`Ti specializzi in ${sc.tipo}.`,'g');if(S.lavoro&&S.lavoro.id==='med'&&S.lavoro.liv===0){S.lavoro.liv=1;S.lavoro.stip=stipLiv(JOB.med,1);S.lavoro.nome=nomeJob(JOB.med,1);S.ultimoLavoro=S.lavoro.nome}return}
}
function meseLavoro(){
  const L=S.lavoro;if(!L)return;
  const j=JOB[L.id];
  L.mesi=(L.mesi||0)+1;if(L.mesi%12===0){L.anni++;L.anniLiv++}
  S.contributi+=(j.pt?.5:1)/12;
  if(j.elez){L.mandato=(L.mandato||0)+1;if(L.mandato>=60){L.mandato=0;if(chance(.5+L.perf/250+S.fama/400))log(`Alle elezioni vieni rielett${g('o','a')}: altri cinque anni.`,'g');else{licenzia(`Alle elezioni non vieni rielett${g('o','a')}: il mandato finisce.`,true);mod('felicita',-8);return}}}
  if(L.cig>0){meseCIG(L);return}   // in cassa integrazione: niente valutazioni né promozioni
  if((S.anno===2020&&S.mese>=2&&S.mese<=4||S.anno>ANNO_OGGI&&S.mondo.pandemia)&&puoCIG()&&chance(.25))chiediCIG(true);
  else if(puoCIG()&&chance(S.mondo.crisi?.008:.001))chiediCIG();
  if(S.mondo.crisi&&!j.conc&&!j.var&&chance(.011)){if(puoCIG()&&chance(.5))chiediCIG();else{licenzia('La crisi colpisce la tua azienda: sei tra i licenziati.');segnaVita('licenziato');return}}
  if(S.mondo.pandemia&&['cam','bpt','cuoco','parr','pt','este','anim','guida','hostess','bagn'].includes(L.id)&&chance(.02)){licenzia('Con la pandemia il locale chiude e perdi il lavoro.');segnaVita('licenziato');return}
  if(meseContratto())return;
  if(S.fatti.congedo>S.t)return;   // in congedo: niente valutazioni né promozioni
  const sod=soddLavoro();
  L.perf=clamp(L.perf+(r(-7,5)+(S.felicita<30?-4:0)+(S.dip.alcol?-6:0)+(S.salute<30?-4:0))/3.5+pz('C')*.7+(S.bis.energia<30?-1:0)+(S.bis.stress>80?-1:0)+(sod-50)/90);
  if(L.liv<j.liv.length-1&&L.perf>=70&&L.anniLiv>=2&&chance((.3+(L.perf-70)/100+capoEsito()*.05)/12*fattoreCarriera(L))&&mancanti(j.promo&&j.promo[L.liv+1]).length===0){
    L.liv++;L.anniLiv=0;L.mesi=0;L.stip=Math.round(stipLiv(j,L.liv)*(1+r(0,8)/100)*fattoreGenere()*fattoreZona(j));if(PIVA_LIV[j.id]===L.liv&&!isPiva(L)){L.contratto={t:'piva',da:S.t};log('Ti metti in proprio: apri la partita IVA.','h')}L.nome=nomeJob(j,L.liv);S.ultimoLavoro=L.nome;
    mod('felicita',8);segnaVita('promozione');log(`Promozione! Ora sei ${L.nome.toLowerCase()}, con una RAL di ${eur(L.stip)}.`,'g');
  }
  if(L.perf<20&&chance(.04)){licenzia(`Sei stat${g('o','a')} licenziat${g('o','a')}: il tuo rendimento era troppo basso.`);segnaVita('licenziato');return}
}
function tasseUni(){return P({umile:200,media:1800,agiata:3200}[S.classe])}
function pagatoDaiGenitori(){return genitoriVivi()&&S.classe!=='umile'&&S.eta<=28}
/* Quanto costa un figlio in un anno: da circa 7.800 € (reddito basso) a 21.000 € (reddito alto), prezzi di oggi */
function costoFiglio(){
  const L=S.lavoro,red=(L?netto(ralEff(L)):0)+(S.pensione||0)+(S.azienda?netto(S.azienda.compenso||0):0)+(convivente()?P(20000):0);
  return P(Math.max(7800,Math.min(21000,7800+(red/ip()-26500)*.32)));
}
function bilancio(simula){
  const v=[];const add=(n,x)=>{x=Math.round(x||0);if(x)v.push([n,x])};
  const conv=convivente(),L=S.lavoro;
  if(L){const j=JOB[L.id],pv=isPiva(L);let l=ralEff(L);if(j.var&&!simula)l=l*r(40,170)/100;if(L.cig>0&&!pv&&!j.var)add('Cassa integrazione (INPS)',nettoCIG(L));else add(pv?'Compensi da partita IVA (netti)':j.var?'Guadagni (variabili)':'Stipendio netto',pv?nettoPiva(l,L):netto(l))}
  if(S.pensione)add('Pensione',S.pensione);
  if(S.scuola.stato==='dottorato')add('Borsa di dottorato',P(16000));
  if(S.scuola.stato==='spec')add('Contratto di specializzazione',P(23000));
  if(['universita','magistrale'].includes(S.scuola.stato)&&S.fatti.borsa)add('Borsa di studio',P(3500));
  if(S.eta>=10&&S.eta<=17&&genitoriVivi())add('Paghetta',P({umile:150,media:350,agiata:1000}[S.classe]));
  if(S.azienda)add(`Compenso da ${S.azienda.n}`,simula?netto(S.azienda.compenso):annoAzienda());
  const dv=dividendi();if(dv)add('Dividendi (netti)',dv);
  if(S.social.attivo){const rs=redditoSocial();if(rs)add('Collaborazioni social',simula?rs:Math.round(rs*r(70,130)/100))}
  if(S.crim.clan&&S.carcere===0)add('Entrate in nero dal clan',simula?P([0,3000,9000,25000,70000][S.crim.clan.grado]):annoClan());
  for(const p of S.prop)if(p.affittata)add(`Affitto incassato, netto cedolare (${p.tipo})`,p.valore*.045*.79);
  for(const p of S.prestiti)add(p.n,-p.rata);
  const bad=S.fatti.badante&&S.relazioni.find(x=>x.id===S.fatti.badante&&x.vivo);if(bad)add(`Badante per ${bad.nome} (la tua parte)`,-costoAssistenza(bad,'badante').resta);else S.fatti.badante=0;
  const rsa=S.fatti.rsa&&S.relazioni.find(x=>x.id===S.fatti.rsa&&x.vivo);if(rsa)add(`Retta della RSA per ${rsa.nome} (la tua parte)`,-costoAssistenza(rsa,'rsa').resta);else S.fatti.rsa=0;
  if(S.fatti.assisti&&!S.relazioni.some(x=>x.id===S.fatti.assisti&&x.vivo))S.fatti.assisti=0;
  if(S.fatti.addettoStampa)add('Addetto stampa',-P(15000));
  for(const p of S.prop){if(p.mutuo)add(`Rata mutuo (${p.tipo})`,-p.mutuo.rata);add(`Manutenzione e tasse (${p.tipo})`,-p.valore*(S.casa.pid===p.id?.004:.008))}
  if(S.carcere>0)return v;
  const ab=S.casa;
  if(ab.tipo==='affitto')add(`Affitto: ${ab.n}`,-ab.costo*(conv?.5:1));
  if(['affitto','proprieta'].includes(ab.tipo))add('Spesa e bollette',-P(8400)*costoZona()*(conv?.6:1));
  if(S.eta>=18)add('Spese personali',-P(ab.tipo==='genitori'||ab.tipo==='figlio'?1500:3600));
  if(ab.tipo==='genitori'&&S.eta>=25&&S.lavoro&&!JOB[S.lavoro.id].pt)add('Contributo a casa dei genitori',-P(1800));
  for(const c of S.veicoli){add(`${c.n}: assicurazione e bollo`,-c.costo);if(c.prestito)add(`Rata ${c.n}`,-c.prestito.rata)}
  const figli=S.relazioni.filter(p=>p.vivo&&p.ruolo==='Figlio'&&p.eta<25&&!p.fuori&&!p.conEx).reduce((s,p)=>s+(p.alterni?.5:1),0);
  if(figli)add(`Figli a carico (${figli})`,-costoFiglio()*figli*(conv?.5:1));
  if(S.animali.length)add('Animali',-P(500)*S.animali.length);
  if(['universita','magistrale'].includes(S.scuola.stato)&&!pagatoDaiGenitori()){add('Tasse universitarie',-tasseUni());if(S.fatti.fuorisede)add('Affitto da fuori sede',-P(6500))}
  if(S.dip.fumo)add('Sigarette',-P(1600));
  if(S.dip.alcol)add('Alcol',-P(1200));
  if(S.dip.gioco)add('Gioco d\'azzardo',simula?-P(3500):-P(r(1000,8000)));
  if(S.soldi<0)add('Interessi sul debito',S.soldi*.06);
  vociWelfare(add);
  return v;
}
const IMPREVISTI=[
  {t:'il dentista',p:[120,900]},{t:'si rompe la lavatrice',p:[350,650],c:()=>!['genitori','carcere'].includes(S.casa.tipo)},{t:'una multa per divieto di sosta',p:[42,90]},
  {t:'una multa per eccesso di velocità',p:[170,850],c:()=>haAuto()},{t:'si rompe il frigorifero',p:[400,900],c:()=>!['genitori','carcere'].includes(S.casa.tipo)},
  {t:'un regalo di nozze',p:[100,300]},{t:'il veterinario',p:[80,600],c:()=>S.animali.length>0},{t:'occhiali nuovi',p:[120,450]},
  {t:'il meccanico',p:[200,1200],c:()=>S.veicoli.length>0},{t:'la caldaia',p:[150,1100],c:()=>!!casaMia()},{t:'lo schermo del telefono rotto',p:[90,280]},
  {t:'una visita privata',p:[100,250]},{t:'il computer non si accende più',p:[150,700]},{t:'un\'infiltrazione dal tetto',p:[300,2500],c:()=>!!casaMia()}
];
function bilancioMese(simula){
  const v=bilancio(true),dic=S.mese===11,out=[];
  for(const [n,x] of v){
    let y;
    if(n==='Stipendio netto')y=x/13*(dic?2:1)*(S.fatti.congedo>S.t?(S.fatti.congedoQuota||.8):1);
    else if(n==='Guadagni (variabili)')y=x/12*(simula?1:r(30,180)/100);
    else if(n.startsWith('Compensi da partita IVA'))y=x/12*(simula?1:r(70,130)/100);
    else if(n==='Collaborazioni social')y=x/12*(simula?1:r(60,140)/100);
    else y=x/12;
    out.push([n==='Stipendio netto'&&dic?'Stipendio netto e tredicesima':n,Math.round(y)]);
  }
  if(!simula&&S.eta>=18&&S.carcere===0&&chance(.07)){const L=IMPREVISTI.filter(x=>!x.c||x.c());const x=pick(L);out.push(['Imprevisto: '+x.t,-P(r(x.p[0],x.p[1]))])}
  return out;
}
function finanzeMese(){
  const v=bilancioMese(false);let t=0;for(const [,x] of v){soldi(x);t+=x}
  t+=(S.fatti.extraMese||0)-(S.fatti.spesaSvago||0);
  S.fatti.ultimoMese=t;S.fatti.bilAnno=(S.fatti.bilAnno||0)+t;
  if(S.soldi<-P(5000)&&S.eta>=18&&chance(.08))log('I debiti ti tolgono il sonno.','b');
  if(S.soldi<-P(25000)&&S.eta>=18&&!coda.some(q=>q.e.id==='debiti')&&S.t-(S.fatti.debitiT||-99)>=Math.min(48,12*(1+(S.fatti.debitiV||0)))){S.fatti.debitiT=S.t;S.fatti.debitiV=(S.fatti.debitiV||0)+1;coda.push({e:EV.debiti,d:{}})}
}
function casaMia(){return S.casa.tipo==='proprieta'?S.prop.find(p=>p.id===S.casa.pid):null}
function affittoBase(t,citta,prov){const a=AFFITTI.find(x=>x.t===t)||AFFITTI[1];const c=citta?cittaInfo(citta,prov):luogo();return {tipo:'affitto',n:a.t,costo:Math.round(a.mq*c.mq*.075*(a.k||1)*ip()/100)*100}}
function annoBeni(){
  annoTassi();
  for(const p of S.prop){
    const M=S.mondo;p.valore=Math.round(p.valore*(1+M.infl+(M.bolla?.06:0)-(M.crisi?.05:0)+r(-3,3)/100));p.stato=clamp(p.stato-r(1,4));
    if(p.mutuo){annoMutuo(p);p.mutuo.residuo=Math.round(p.mutuo.residuo*(1+p.mutuo.tasso)-p.mutuo.rata);p.mutuo.anni--;
      if(p.mutuo.anni<=0||p.mutuo.residuo<=0){p.mutuo=null;log(`Hai finito di pagare il mutuo (${p.tipo.toLowerCase()})!`,'g');mod('felicita',8)}}
    if(p.affittata&&chance(.08)){soldi(-Math.round(p.valore*.03));log(`L'inquilino del ${p.tipo.toLowerCase()} non paga da mesi.`,'b')}
  }
  annoPrestiti();
  if(S.casa.tipo==='affitto')S.casa.costo=Math.round(S.casa.costo*(1+S.mondo.infl));
  for(const c of S.veicoli){c.costo=Math.round(c.costo*(1+S.mondo.infl));c.valore=Math.round(c.valore*.86);c.stato=clamp(c.stato-r(3,9));if(c.prestito){c.prestito.anni--;if(c.prestito.anni<=0){c.prestito=null;log(`Hai finito di pagare le rate (${c.n.toLowerCase()}).`,'h')}}}
  const ab=S.casa;
  if(S.eta>=30&&ab.tipo==='genitori'&&genitoriVivi())mod('felicita',-2);
  if(ab.tipo==='affitto'&&ab.n==='Stanza in condivisione'&&S.eta>=28)mod('felicita',-1);
  const mia=casaMia();if(mia){mod('felicita',mia.lusso?2:1);if(mia.stato<30)mod('felicita',-2)}
  if(S.veicoli.length)mod('felicita',1);
}
const haMal=n=>S.malattie.some(m=>m.n===n);
function ammala(n,gr){if(haMal(n))return;S.malattie.push({n,g:gr,t:S.t});if(gr>=4&&S.legami&&S.eta>=18)bisognoAiuto('malattia');log(gr===1?`Ti ammali: ${n.toLowerCase()}.`:`Ti diagnosticano: ${n.toLowerCase()}.`,gr===1?'h':'b');if(gr>=2&&S.vivo&&S.eta>=1&&!coda.some(q=>q.e.id==='diagnosi'))coda.push({e:EV.diagnosi,d:{x:n}})}
function controllaMorte(){
  if(!chance(morteMese()))return false;
  muori(causaMorte());return true;
}
function muori(c){S.vivo=false;S.causa=c;coda=[];log(`Sei mort${g('o','a')} a ${S.eta} anni, ${c}.`,'b');save()}

/* ---------- Giustizia ---------- */
function processo(id){if(!REATI[id])id='furto';coda.unshift({e:evProcesso(id),d:{}})}
function evProcesso(id){
  const R=REATI[id];
  return {id:'processo',k:'Giustizia',t:S.eta<18?'Tribunale per i minorenni':'In tribunale',x:`Sei accusat${g('o','a')} di: ${R.n.toLowerCase()}.`,c:[
    {l:'Avvocato d\'ufficio',sub:'Gratis, ma meno efficace',fx:()=>sentenza(id,.25,false)},
    {l:'Avvocato privato',sub:()=>eur(P(4000)),costo:()=>P(4000),fx:()=>sentenza(id,.55,false)},
    {l:'Patteggia',sub:'Ammetti la colpa e ottieni uno sconto',fx:()=>sentenza(id,0,true)}]};
}
function sentenza(id,pa,patt){
  const R=REATI[id];
  if(S.eta<18){S.karma=clamp(S.karma-5);return ['Il giudice ti affida ai servizi sociali per un anno di messa alla prova. Se righi dritto, la fedina penale resta pulita.','b']}
  if(chance(pa))return [`Assolt${g('o','a')}! Esci dal tribunale a testa alta.`,'g'];
  S.fedina.push(R.n);S.karma=clamp(S.karma-6);mod('felicita',-8);
  let pat='';if(R.patente&&S.patente){S.patente=false;S.fatti.sospesa=S.eta;pat=' Ti ritirano la patente.'}
  if(R.g===1){const m=patt?300:700;soldi(-m);return [`Condannat${g('o','a')} a una multa di ${eur(m)}. Ora la tua fedina penale è sporca.${pat}`,'b']}
  if(R.g===2){if(patt){soldi(-P(1500));return [`Patteggi: ${eur(P(1500))} di multa e lavori di pubblica utilità. Fedina penale sporca.${pat}`,'b']}return [`Condannat${g('o','a')} a 8 mesi con la condizionale. Niente carcere, ma la fedina penale è sporca.${pat}`,'b']}
  const anni=R.g===3?r(1,3):r(3,7);const n=Math.max(0,anni-(patt?2:0));
  if(n===0)return [`Patteggi una pena sospesa. Eviti il carcere per un soffio.${pat}`,'b'];
  entraCarcere(n);return [`Il giudice ti condanna a ${n} ${n===1?'anno':'anni'} di carcere.${pat}`,'b'];
}
function entraCarcere(n){
  S.carcere=n;S.galera={pena:n,scontata:0,condotta:0,banda:null,rispetto:0,studio:0};
  S.relazioni.filter(p=>p.cella).forEach(p=>{p.cella=false});
  nuovaPersona('Amico',S.sesso,Math.max(18,S.eta+r(-10,15)),null,{rapporto:r(25,50),cella:true});
  if(S.lavoro){pagaTFR();S.storico.push(S.lavoro.nome);S.lavoro=null;log('Perdi il lavoro.','b')}
  if(S.casa.tipo!=='proprieta')S.casa={tipo:'carcere'};
  if(iscritto()){S.scuola.stato='finita';log('Devi abbandonare gli studi.','b')}
  const pa=partnerAttuale();if(pa&&chance(.5)){pa.ruolo='Ex';pa.conv=false;log(`${pa.nome} ti lascia.`,'b')}
  log(`Vieni condannat${g('o','a')} a ${n} ${n===1?'anno':'anni'} di carcere.`,'b');if(S.legami)bisognoAiuto('carcere');mod('felicita',-20);segnaVita('carcere');
}
function meseCarcere(){const G=S.galera;if(G){G.mesi=(G.mesi||0)+1;if(G.mesi%12===0)annoCarcere()}else{S.fatti.mc=(S.fatti.mc||0)+1;if(S.fatti.mc%12===0)annoCarcere()}}
function annoCarcere(){if(S.galera)S.galera.scontata++;S.carcere--;mod('felicita',-4);if(S.carcere>0)log(`Un altro anno in carcere. ${S.carcere===1?'Manca un anno':`Mancano ${S.carcere} anni`}.`,'h');else esciCarcere()}
function esciCarcere(){
  S.carcere=0;mod('felicita',12);log(`Esci di prigione. Sei di nuovo liber${g('o','a')}.`,'g');
  if(S.galera&&S.galera.banda)S.fatti.exBanda=1;S.galera=null;
  coda.push({e:EV.reinserimento,d:{}});
  if(S.casa.tipo==='carcere')S.casa=genitoriVivi()?{tipo:'genitori'}:affittoBase('Stanza in condivisione');
}

/* ---------- Eventi dell'anno ---------- */
function eleggibile(e){
  if(e.link||e.chi||e.prig)return false;
  if(e.min===undefined||S.eta<e.min||S.eta>e.max)return false;
  if(e.once&&S.fatti['ev_'+e.id])return false;
  const u=S.ultimi[e.id];if(u!==undefined&&S.eta-u<(e.rip||6))return false;
  if(coda.some(q=>q.e===e))return false;
  if(e.cond&&!e.cond({}))return false;
  if(annoEvento(e)>S.anno)return false;      // niente anacronismi (c9_epoca.js)
  return true;
}
function segna(e){S.ultimi[e.id]=S.eta;if(e.once)S.fatti['ev_'+e.id]=true}
function aggiungiCasuale(){const ok=Object.values(EV).filter(eleggibile);if(!ok.length)return;const e=pesata(ok.map(x=>[x,x.w||1]));segna(e);coda.push({e,d:{}})}
function aggiungiPersona(){
  const opz=[];
  for(const e of Object.values(EV)){
    if(!e.chi||e.link)continue;
    if(S.eta<e.min||S.eta>e.max)continue;
    if(e.once&&S.fatti['ev_'+e.id])continue;
    const u=S.ultimi[e.id];if(u!==undefined&&S.eta-u<(e.rip||4))continue;
    if(e.cond&&!e.cond({}))continue;
    if(annoEvento(e)>S.anno)continue;
    const ps=S.relazioni.filter(p=>p.vivo&&e.chi.includes(p.ruolo)&&(!e.pc||e.pc(p)));
    if(ps.length)opz.push([{e,ps},e.w||1]);
  }
  if(!opz.length)return;
  const sel=pesata(opz);segna(sel.e);coda.push({e:sel.e,d:{p:pick(sel.ps)}});
}
function aggiungiPrigione(){
  const ok=Object.values(EV).filter(e=>e.prig&&(S.ultimi[e.id]===undefined||S.eta-S.ultimi[e.id]>=2));
  if(!ok.length)return;const e=pick(ok);segna(e);coda.push({e,d:{}});
}
function eventiMese(){
  if(S.carcere>0){if(chance(.06))aggiungiPrigione();return}
  if(S.eta<1)return;
  if(chance(S.eta<13?.16:S.eta<18?.13:.085))aggiungiCasuale();
  if(chance(.045))aggiungiPersona();
}

/* ---------- Salvataggio ---------- */
function save(){try{if(S)localStorage.setItem(KEY,JSON.stringify(S));else localStorage.removeItem(KEY)}catch(e){}if(S&&typeof pianificaOnline==='function')pianificaOnline()}
function load(){
  try{
    let t=localStorage.getItem(KEY),old=false;
    if(!t){t=localStorage.getItem('vitamia_save_v3');old=!!t}
    if(!t){t=localStorage.getItem('vitamia_save_v2');old=!!t}
    if(t){S=JSON.parse(t);if(S&&S.v===2)migra(S);if(S&&S.v===3)migra3();if(!S||S.v!==4)S=null}
    if(S&&S.social&&S.social.follower>CAP_FOLLOWER)S.social.follower=CAP_FOLLOWER;   // partite con i follower «infiniti» di prima
    if(S)aggiornaStato();
  }catch(e){S=null}
}
/* Campi aggiunti nell'ottobre 2026 (welfare, pensioni, eredità): li stima per le partite salvate prima */
function aggiornaStato(){
  if(S.montante===undefined)S.montante=Math.round((S.contributi||0)*(S.lavoro?S.lavoro.stip:P(25000))*.33*1.1);
  if(!S.lav48)S.lav48=[];
  if(S.aspir&&!S.aspTappe)S.aspir.forEach(id=>{if(ASPIR[id])aspAvvia(id)});
  if(S.lavoro&&!S.lavoro.contratto)S.lavoro.contratto=PIVA.includes(S.lavoro.id)?{t:'piva',da:S.t-60}:{t:'ind'};
  if(!S.orient)S.orient=S.attrazione?(S.attrazione==='E'?'bi':S.attrazione===S.sesso?'omo':'etero'):pesata([['etero',94],['omo',3],['bi',3]]);
  if(!S.fatti.cittaNascita){S.fatti.cittaNascita=S.citta;S.fatti.provNascita=S.prov}
  iniziaLegami();
  if(S.lavoro&&S.lavoro.sq===undefined)iniziaSquadra(true);   // salvataggi vecchi: capo e colleghi senza diario
}
function migra3(){
  const X=S;
  X.v=4;X.meseNascita=r(0,11);X.mese=X.meseNascita;X.anno=X.annoNascita+X.eta;X.t=X.eta*12;
  X.pers=nuovoCarattere();X.sonno=sonnoDefault(X.eta);X.bis=BIS0();X.tensione=0;X.proposito=null;X.umoreTarget=X.felicita;X.cdAz={};X.azioni={};
  X.log=X.log.map(b=>({t:b.eta*12,anno:X.annoNascita+b.eta,mese:X.meseNascita,eta:b.eta,righe:b.righe}));
  for(const p of X.relazioni){if(!p.pers)p.pers=persDaTr(p.tr);if(p.mn===undefined)p.mn=r(0,11);initNpc(p);if(['Madre','Padre'].includes(p.ruolo))p.coppia=X.relazioni.some(x=>x.ruolo==='Patrigno')?'separato':'sposato'}
  for(const f of X.futuri)f.t=X.t+Math.max(1,(f.eta-X.eta)*12);
  X.att=null;if(X.eta>=4)formaAttaccamento();
  X.routine=routineDefault();normalizzaRoutine();
  log('La tua vita continua nella nuova versione: ora il tempo scorre mese per mese e hai un carattere.','h');
}
function migra(X){
  const c=trovaComune(X.citta);X.prov=c?c.s:null;
  X.mondo=mondoBase();X.borsa={};X.costoBorsa={};X.prestiti=[];
  if(X.inv){if(X.inv.fondo){X.borsa.etf=X.inv.fondo/100;X.costoBorsa.etf=X.inv.fondo}if(X.inv.crypto){X.borsa.cripto=X.inv.crypto/100;X.costoBorsa.cripto=X.inv.crypto}delete X.inv}
  const map={shop:'shop',agenzia:'agenzia',startup:'startup',bar:'bar',palestra:'palestra',ristorante:'pizzeria'};
  if(X.impresa){const t=AZIENDE.find(a=>a.id===(map[X.impresa.id]||'shop'));X.azienda={id:t.id,n:X.impresa.n,tipo:t.n,sedi:1,dip:0,prezzo:'medio',qualita:'buona',mkt:0,compenso:15000,cassa:0,rep:50,anni:X.impresa.anni||0,investito:X.impresa.investito,ultimo:null}}
  else X.azienda=null;delete X.impresa;
  X.social={attivo:false,follower:0,comprati:0};X.fama=0;X.crim={exp:0,noto:0,clan:null,colpi:0};X.galera=X.carcere>0?{pena:X.carcere,scontata:0,condotta:0,banda:null,rispetto:0,studio:0}:null;
  if(X.lavoro&&X.lavoro.id==='crea'){X.lavoro=null;X.social={attivo:true,follower:5000,comprati:0}}
  X.v=3;
}
