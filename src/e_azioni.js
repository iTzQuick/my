/* ================= AZIONI ================= */
function fatto(k){return !!S.azioni[k]}
function cdAzione(k){
  if(/^c_/.test(k))return k==='c_palestra'?2:12;
  if(/^(esame_|corso_)/.test(k))return 6;
  if(/^crim_/.test(k))return 3;
  if(/^mis_/.test(k))return 4;
  if(/^post_/.test(k))return 2;
  if(/sposa$/.test(k))return 6;
  if(k==='clan')return 6;
  const T0={collega:2,att_vacanza:3,att_chirurgia:12,att_terme:2,att_psi:6,att_clinica:3,att_patente:2,att_provino:3,att_libro:24,att_prodotti:12,att_benef:6,compra_fol:6,aumento:6,promo:4,nuoviamici:2};
  return T0[k]||1;
}
function segnaAz(k){S.azioni[k]=1;S.cdAz[k]=S.t+cdAzione(k)}
function attesa(k){const m=(S.cdAz[k]||0)-S.t;return m<=1?'Fatto questo mese':`Riprova tra ${m} mesi`}
const stanco=()=>`Sei troppo stanc${g('o','a')}: riposa un po' o alleggerisci la settimana.`;
function una(k,costo,fn,en){
  return ()=>{
    if(S.azioni[k])return [attesa(k)+'.','x'];
    en=en===undefined?5:en;
    if(en&&S.bis&&S.bis.energia<en+4)return [stanco(),'x'];
    if(costo&&S.soldi<costo)return [`Non hai abbastanza soldi (servono ${eur(costo)}).`,'x'];
    segnaAz(k);if(costo)soldi(-costo);if(en&&S.bis)S.bis.energia=clamp(S.bis.energia-en);return fn();
  };
}
/* Azione lanciata da una scheda: mostra un messaggio breve */
function azione(fn){
  const res=fn();
  if(res===KEEP)return;
  if(res===null){next();return}
  if(res&&res[0]){if(res[1]!=='x')log(res[0],res[1]);toast(res[0])}
  save();render();
}
function rataMutuo(P,anni,i){return Math.round(P*i/(1-Math.pow(1+i,-anni)))}

/* ---------- Studi ---------- */
function iscriviUni(fac,sede){
  const f=FACOLTA.find(x=>x.n===fac);
  if(f.test){const p=Math.max(.05,Math.min(.95,.5+(S.intelligenza-f.test)/40));if(!chance(p)){mod('felicita',-8);return [`Non superi il test d'ingresso di ${fac}. Puoi riprovare l'anno prossimo dalla scheda Studi, o scegliere un'altra facoltà.`,'b']}}
  Object.assign(S.scuola,{stato:'universita',tipo:fac,anni:f.anni,cu:!!f.cu,voto:clamp(35+S.intelligenza/2+r(-10,10)),fuori:0,diff:f.d||.5,sk:f.sk||null});
  S.fatti.fuorisede=!!sede;
  if(sede){mod('felicita',6);nuovoAmico()}else if(chance(.5))nuovoAmico();
  return [`Ti iscrivi a ${fac}${sede?` e ti trasferisci a ${sede} da fuori sede`:''}. Benvenut${g('o','a')} all'università!`,'g'];
}
function azScuola(k){
  const sc=S.scuola;
  if(k==='studia')return azione(una('studia',0,()=>{eff({voto:[2,4],f:-1});S.bis.stress=clamp(S.bis.stress+4);if(chance(.3))mod('intelligenza',1);return ['Una settimana di ripasso intenso. Il prossimo compito va meglio.','g']},12));
  if(k==='ripetizioni')return azione(una('ripetizioni',P(120),()=>{eff({voto:[2,4]});return ['Un mese di ripetizioni. Qualcosa inizia a tornare.','g']},4));
  if(k==='marina')return azione(una('marina',0,()=>{eff({voto:[-3,-1],f:[2,4]});if(chance(.25)){relGenitori(-8);mod('felicita',-6);return ['Ti beccano. Punizione: niente telefono per un mese.','b']}return ['Una giornata al parco invece che in classe.','']}));
  if(k==='vita_uni')return azione(una('vita_uni',0,()=>{eff({f:[3,5],voto:-1});S.bis.soc=clamp(S.bis.soc+8);if(chance(.35))nuovoAmico();return ['Feste, aule studio e aperitivi universitari.','g']}));
  if(k==='cambia')return showSheet({k:'Studi',t:'Cambi facoltà?',p:`Lasci ${sc.tipo} e ricominci da capo con un altro corso.`,chiudi:true,scelte:[
    {l:'Sì, cambio',fx:()=>{sc.stato='finita';coda.unshift({e:EV.uni,d:{}});return null}}]});
  if(k==='lascia')return showSheet({k:'Studi',t:'Abbandoni gli studi?',p:'Non otterrai il titolo di studio.',chiudi:true,scelte:[
    {l:'Sì, lascio',fx:()=>{const t=sc.tipo;sc.stato='finita';S.fatti.fuorisede=false;mod('felicita',-2);return [`Hai lasciato ${t}.`,'b']}}]});
}
function iscrizione(k){
  const I=S.istr,sc=S.scuola;
  if(k==='uni'){coda.unshift({e:EV.uni,d:{}});return next()}
  if(k==='its'){coda.unshift({e:EV.its,d:{}});return next()}
  if(k==='serale')return azione(()=>{Object.assign(sc,{stato:'serale',tipo:'Diploma serale',anni:3,voto:clamp(40+S.intelligenza/3),diff:.4,sk:null,boc:0});return ['Ti iscrivi alle superiori serali: tre anni per il diploma, anche lavorando.','g']});
  if(k==='magistrale'){
    const tri=I.lauree.filter(l=>l.liv==='triennale'&&!I.lauree.some(m=>m.n===l.n&&m.liv!=='triennale'));
    return showSheet({k:'Studi',t:'Laurea magistrale',p:'Due anni per specializzarti.',chiudi:true,scelte:tri.map(l=>({l:`Magistrale in ${l.n}`,fx:()=>{Object.assign(sc,{stato:'magistrale',tipo:l.n,anni:2,voto:clamp(45+S.intelligenza/2+r(-8,8)),fuori:0,diff:.6,sk:null});return [`Ti iscrivi alla magistrale in ${l.n}.`,'g']}}))});
  }
  if(k==='master')return showSheet({k:'Studi',t:'Master',p:`Un anno, ${eur(P(8000))}. Alcuni ruoli da manager lo richiedono.`,chiudi:true,scelte:[
    {l:'Master in Business Administration',costo:()=>P(8000),fx:()=>{Object.assign(sc,{stato:'master',tipo:'Business Administration',anni:1,voto:60,fuori:0});return ['Ti iscrivi al master.','g']}}]});
  if(k==='dottorato'){
    const mag=I.lauree.filter(l=>l.liv!=='triennale');
    return showSheet({k:'Studi',t:'Dottorato di ricerca',p:'Tre anni con borsa di studio. Serve superare la selezione.',chiudi:true,scelte:mag.map(l=>({l:`Dottorato in ${l.n}`,p:()=>Math.min(.85,(l.voto-85)/30+S.intelligenza/300),
      si:{fx:()=>{Object.assign(sc,{stato:'dottorato',tipo:l.n,anni:3,voto:70,fuori:0});return [`Vinci il posto da dottorand${g('o','a')} in ${l.n}!`,'g']}},no:{e:{f:-4},r:'Non passi la selezione. Puoi riprovare l\'anno prossimo.'}}))});
  }
  if(k==='spec')return showSheet({k:'Studi',t:'Specializzazione medica',p:'Quattro anni con contratto retribuito. Serve superare il concorso nazionale.',chiudi:true,scelte:SPECIALIZZAZIONI.map(s=>({l:s,p:()=>.35+S.intelligenza/250,
    si:{fx:()=>{if(S.lavoro){pagaTFR();S.storico.push(S.lavoro.nome);S.lavoro=null}Object.assign(sc,{stato:'spec',tipo:s,anni:4,voto:70,fuori:0});return [`Entri in specializzazione in ${s}!`,'g']}},no:{e:{f:-5},r:'Non passi il concorso. Riprova l\'anno prossimo.'}}))});
}
function esameStato(n){
  const A=ABILITAZIONI.find(x=>x.n===n);
  return azione(una('esame_'+n,P(400),()=>{
    if(chance(A.p+(S.intelligenza-50)/200)){S.istr.abil.push(n);mod('felicita',10);return [`Superi l'esame di Stato: ora sei abilitat${g('o','a')} come ${n.toLowerCase()}!`,'g']}
    mod('felicita',-6);return ['Non superi l\'esame di Stato. Riprova l\'anno prossimo.','b'];
  }));
}
function abilitazioneDisponibile(A){
  if(S.istr.abil.includes(A.n))return null;
  if(!haLaurea([A.lau],4))return null;
  if(A.n==='Avvocato'&&!(S.lavoro&&S.lavoro.id==='avv'&&S.lavoro.anni>=1))return 'Serve almeno un anno di pratica come praticante avvocato';
  return '';
}
function faiCorso(id){
  const c=CORSI.find(x=>x.id===id);
  const manca=c.req?mancanti(c.req):[];if(manca.length)return azione(()=>[`Per iscriverti serve: ${manca.join(', ')}.`,'x']);
  return azione(una('corso_'+id,P(c.costo),()=>{
    const p=typeof c.p==='function'?c.p():c.p;
    if(c.sk)eff(c.sk);
    if(!chance(p))return [`Non superi l'esame finale di: ${c.n.toLowerCase()}. Hai comunque imparato qualcosa.`,'b'];
    if(c.cert&&!S.istr.cert.includes(c.cert))S.istr.cert.push(c.cert);
    mod('felicita',3);return [`Completi: ${c.n.toLowerCase()}.${c.cert?` Ottieni: ${c.cert}.`:''}`,'g'];
  }));
}
function cambiaHobby(){
  showSheet({k:'Tempo libero',t:'Attività e hobby',p:'Ogni anno l\'attività scelta migliora un\'abilità. Costa circa 450 € l\'anno (da piccolo pagano i tuoi).',chiudi:true,scelte:[
    ...HOBBY.map(h=>({l:h.n,sub:ABIL[h.sk]+(S.hobby===h.id?' · attuale':''),disabled:S.hobby===h.id,fx:()=>{S.hobby=h.id;return [`Ora pratichi: ${h.n.toLowerCase()}.`,'g']}})),
    {l:'Nessuna attività',disabled:!S.hobby,fx:()=>{S.hobby=null;return ['Lasci l\'attività. Più tempo libero.','']}}]});
}

/* ---------- Lavoro ---------- */
function candidati(id){
  const j=JOB[id];
  if(fatto('job_'+id))return toast('Ti sei già candidat'+g('o','a')+' per questo lavoro questo mese.');
  if(requisitiJob(j).length)return toast('Non hai i requisiti.');
  segnaAz('job_'+id);
  if(j.elez)return elezione(j);
  if(j.conc)return concorso(j);
  colloquio(j);
}
function azLavoro(k){
  const L=S.lavoro;if(!L)return;
  const j=JOB[L.id];
  if(k==='sodo')return azione(una('sodo',0,()=>{eff({perf:[2,5]});S.bis.stress=clamp(S.bis.stress+5);return ['Un mese a testa bassa, sempre in anticipo. Il capo se ne accorge.','g']},14));
  if(k==='aumento')return azione(una('aumento',0,()=>{if(L.perf>65&&chance(.5)){L.stip=Math.round(L.stip*1.07);return [`Aumento ottenuto! Nuova RAL: ${eur(L.stip)}.`,'g']}L.perf=clamp(L.perf-4);return ['«Non è il momento», ti risponde il capo.','b']}));
  if(k==='promo')return azione(una('promo',0,()=>{
    if(L.liv>=j.liv.length-1)return ['Sei già al livello più alto.','x'];
    const m=mancanti(j.promo&&j.promo[L.liv+1]);if(m.length)return [`Per salire di livello ti serve: ${m.join(', ')}.`,'x'];
    if(L.anniLiv>=1&&chance((L.perf-45)/70*fattoreCarriera(L))){L.liv++;L.anniLiv=0;L.stip=Math.round(stipLiv(j,L.liv)*(1+r(0,6)/100)*fattoreGenere()*fattoreZona(j));if(PIVA_LIV[j.id]===L.liv&&!isPiva(L))L.contratto={t:'piva',da:S.t};L.nome=nomeJob(j,L.liv);S.ultimoLavoro=L.nome;mod('felicita',8);return [`Promozione! Ora sei ${L.nome.toLowerCase()}.`,'g']}
    L.perf=clamp(L.perf-3);return ['Per ora la promozione va a un collega.','b'];
  }));
  if(k==='collega')return azione(una('collega',0,()=>{if(chance(.35)){const p=nuovoAmico(true);if(p)return [`Fai amicizia con ${p.nome}, ${gp(p,'un collega','una collega')}.`,'g']}return ['Pausa caffè un po\' imbarazzante.','']}));
  if(k==='licenziati')return showSheet({k:'Lavoro',t:'Ti licenzi?',p:`Lasci il posto da ${L.nome.toLowerCase()}.`,chiudi:true,scelte:[
    {l:'Sì, mi licenzio',sub:()=>`Ricevi ${S.anno>=1982?'il TFR':'la liquidazione'}, ma chi si dimette non ha ${S.anno>=2015?'la NASpI':'il sussidio di disoccupazione'}`,fx:()=>{pagaTFR();S.storico.push(L.nome);S.lavoro=null;mod('felicita',3);return ['Hai dato le dimissioni. Si volta pagina.','']}}]});
  if(k==='pensione'){coda.unshift({e:EV.pensione,d:{}});return next()}
  if(k==='parttime')return azione(una('parttime',0,()=>chiediPartTime(false)));
  if(k==='tempopieno')return azione(una('tempopieno',0,()=>tornaTempoPieno()));
}
function apriAzienda(){
  showSheet({k:'Imprenditoria',t:'Apri un\'attività',p:'Gestirai prezzi, qualità, pubblicità, dipendenti e sedi. Se la cassa va troppo in rosso, fallisci.',chiudi:true,scelte:AZIENDE.map(t=>({l:t.n,sub:`${eur(P(t.costo))} · conta ${ABIL[t.sk]}`,costo:P(t.costo),fx:()=>{nuovaAzienda(t);mod('felicita',6);return [`Apri ${S.azienda.n}. In bocca al lupo!`,'g']}}))});
}
function azAzienda(k){
  const A=S.azienda;if(!A)return;const T0=AZ(A.id);
  const set=(t,sub,lista)=>showSheet({k:A.n,t,p:sub,chiudi:true,scelte:lista});
  if(k==='prezzi')return set('Prezzi','Prezzi bassi portano più clienti, prezzi alti più guadagno su ognuno.',Object.entries(PREZZI_AZ).map(([id,v])=>({l:v.n,sub:`Spesa media ×${String(v.k).replace('.',',')} · clienti ×${String(v.d).replace('.',',')}`,disabled:A.prezzo===id,fx:()=>{A.prezzo=id;return [`Prezzi: ${v.n.toLowerCase()}.`,'']}})));
  if(k==='qualita')return set('Qualità','La qualità costa una parte degli incassi, ma fa crescere la reputazione.',Object.entries(QUALITA_AZ).map(([id,v])=>({l:v.n,sub:`${Math.round(v.costo*100)}% degli incassi · reputazione ${v.rep>0?'+':''}${v.rep} l'anno`,disabled:A.qualita===id,fx:()=>{A.qualita=id;return [`Qualità: ${v.n.toLowerCase()}.`,'']}})));
  if(k==='mkt')return set('Pubblicità','Più pubblicità, più clienti.',MKT_AZ.map((m,i)=>({l:m.n,sub:`${eur(P(m.v))} l'anno · clienti ×${String(m.d).replace('.',',')}`,disabled:A.mkt===i,fx:()=>{A.mkt=i;return [`Pubblicità: ${m.n.toLowerCase()}.`,'']}})));
  if(k==='compenso')return set('Il tuo compenso','Quanto ti paghi ogni anno. Esce dalla cassa dell\'azienda.',COMPENSI.map(c=>({l:c?eur(c)+' lordi':'Niente',sub:c?`${eur(netto(c))} netti`:'Lasci tutto in azienda',disabled:A.compenso===c,fx:()=>{A.compenso=c;return [`Compenso: ${c?eur(c):'nessuno'}.`,'']}})));
  if(k==='assumi')return azione(()=>{const c=P(1500);A.dip++;A.cassa-=c;return [`Assumi una persona. Selezione e formazione: ${eur(c)}. Ora avete ${A.dip} dipendent${A.dip===1?'e':'i'}.`,'']});
  if(k==='licenzia')return azione(()=>{if(A.dip<=0)return ['Non hai dipendenti.','x'];const c=Math.round(T0.stip*.3*ip());A.dip--;A.cassa-=c;A.rep=clamp(A.rep-2);return [`Licenzi un dipendente. Liquidazione: ${eur(c)}.`,'']});
  if(k==='sede')return azione(()=>{const c=P(T0.aprire);if(A.cassa>=c)A.cassa-=c;else if(S.soldi>=c)soldi(-c);else return [`Per aprire una sede servono ${eur(c)}, in cassa o sul tuo conto.`,'x'];A.sedi++;return [`Apri la sede numero ${A.sedi}. Ricordati di assumere personale.`,'g']});
  if(k==='chiudisede')return azione(()=>{if(A.sedi<=1)return ['Hai una sola sede.','x'];A.sedi--;return ['Chiudi una sede.','']});
  if(k==='inietta')return azione(()=>{const x=Math.min(Math.max(0,S.soldi),P(10000));if(x<=0)return ['Non hai soldi da versare.','x'];soldi(-x);A.cassa+=x;return [`Versi ${eur(x)} nella cassa dell'azienda.`,'']});
  if(k==='preleva')return azione(()=>{if(A.cassa<=0)return ['La cassa è vuota.','x'];const x=A.cassa;A.cassa=0;soldi(Math.round(x*.74));return [`Prelevi ${eur(x)} di utili. Dopo le tasse sui dividendi ti restano ${eur(x*.74)}.`,'g']});
  if(k==='vendi')return set('Vendi l\'azienda?',`Valutazione: ${eur(valoreAzienda(A))}.`,[{l:'Vendi',fx:()=>{const v=valoreAzienda(A);soldi(v);S.azienda=null;return [`Vendi ${A.n} per ${eur(v)}.`,v>=A.investito?'g':'b']}}]);
  if(k==='chiudi')return set('Chiudi l\'azienda?',A.cassa<0?`Dovrai coprire tu i debiti: ${eur(-A.cassa)}.`:`Ti restano ${eur(A.cassa)} di cassa.`,[{l:'Chiudi',fx:()=>{soldi(A.cassa);S.azienda=null;mod('felicita',-4);return [`Chiudi ${A.n}.`,'b']}}]);
}

/* ---------- Persone ---------- */
const FRASI=['Parlate per ore di tutto e di niente.','Ridete ricordando vecchie storie.','Scopri qualcosa di nuovo su di {lui}.','Una chiacchierata che ti mette di buon umore.'];
function apriPersona(id){
  const p=S.relazioni.find(x=>x.id===id);if(!p||!p.vivo)return;
  const R=p.ruolo,o=[];
  const opt=(l,key,costo,fn,en,sub)=>o.push({l,sub:sub||(costo?eur(costo):''),disabled:fatto(p.id+key),fx:una(p.id+key,costo,fn,en)});
  const rel=(a,b)=>{const d=r(a,b);p.rapporto=clamp(p.rapporto+d);p.ultimo=S.t;if(p.intim!==undefined){p.intim=clamp(p.intim+d*.5);p.pass=clamp(p.pass+d*.4)}};
  if(R==='Conoscente'){
    opt('Proponi di vedervi','vedi',0,()=>{if(chance(.3+affinita(p)/200+pz('E')*.12+(p.rapporto-30)/150)){p.ruolo='Amico';p.rapporto=clamp(p.rapporto+15);p.ultimo=S.t;return [`${S.eta<12?'Un pomeriggio al parco e diventate inseparabili.':S.eta<18?'Un gelato diventa un pomeriggio intero.':'Un caffè diventa una serata intera.'} Tu e ${p.nome} ora siete amici.`,'g']}p.rapporto=clamp(p.rapporto+4);return [`${p.nome} è gentile, ma ha sempre da fare.`,'']},6);
    if(S.eta>=16&&single()&&(S.attrazione==='E'||S.attrazione===p.sesso||(!S.attrazione&&p.sesso!==S.sesso)))opt('Chiedi di uscire','esci_c',0,()=>{const c={nome:p.nome,cognome:p.cognome,sesso:p.sesso,eta:p.eta,asp:r(30,90),pers:p.pers,tr:p.tr};S.relazioni=S.relazioni.filter(x=>x!==p);return appuntamento(c,.05)},6);
    o.push({l:'Lascia perdere',fx:()=>{S.relazioni=S.relazioni.filter(x=>x!==p);return [`${p.nome} esce dai tuoi contatti.`,'']}});
    return showSheet({k:`Conoscente · ${p.eta} anni`,t:`${p.nome} ${p.cognome}`,p:schedaPersona(p),chiudi:true,scelte:o,d:{p}});
  }
  if(R==='Nemico'){
    opt('Prova a fare pace','pace',0,()=>{if(chance(.2+S.karma/300-(p.rancore||50)/400)){p.ruolo='Conoscente';p.rimuovi=true;S.relazioni=S.relazioni.filter(x=>x!==p);mod('felicita',5);S.karma=clamp(S.karma+3);return [`Tu e ${p.nome} vi stringete la mano. La guerra è finita.`,'g']}p.rancore=clamp((p.rancore||50)+5);return [`${p.nome} ti ride in faccia.`,'b']});
    opt('Provocal'+gp(p,'o','a'),'provoca',0,()=>{p.rancore=clamp((p.rancore||50)+15);mod('felicita',3);S.karma=clamp(S.karma-2);return ['Una frecciatina ben piazzata. Soddisfazione, ma ora è ancora più arrabbiat'+gp(p,'o','a')+'.','']});
    opt('Ignoral'+gp(p,'o','a'),'ignora',0,()=>{p.rancore=clamp((p.rancore||50)-r(5,12));return ['Fai finta che non esista. Funziona, piano piano.','g']});
    if((p.rancore||0)>=60&&S.eta>=18)opt('Denuncia per stalking','denuncia',0,()=>{if(chance(.4)){S.relazioni=S.relazioni.filter(x=>x!==p);mod('felicita',6);return [`Il giudice impone a ${p.nome} di starti lontan${gp(p,'o','a')}.`,'g']}return ['Le prove non bastano. La denuncia viene archiviata.','b']});
    const info0=[`${ruoloLabel(p)} · ${p.eta} anni`,tratto(p)];
    return showSheet({k:info0.join(' · '),t:`${p.nome} ${p.cognome}`,p:`Rancore: ${p.rancore||50}%`,chiudi:true,scelte:o,d:{p}});
  }
  if(R==='Ex'){
    opt('Scrivi un messaggio','msg',0,()=>{if(single()&&chance(.25)){p.ruolo='Partner';p.rapporto=55;mod('felicita',6);return [`Vi rivedete e tornate insieme!`,'g']}rel(-3,3);return [`${p.nome} risponde in modo freddo.`,'']});
    o.push({l:'Dimentica',fx:()=>{S.relazioni=S.relazioni.filter(x=>x!==p);return [`Cancelli il numero di ${p.nome}.`,'']}});
  }else{
    if(R==='Partner'||R==='Coniuge'){
      opt('Appuntamento romantico','date',80,()=>{rel(6,12);mod('felicita',4);return ['Cena a lume di candela.','g']});
      opt('Weekend romantico','weekend',600,()=>{rel(10,16);mod('felicita',7);return ['Due giorni in una baita in montagna.','g']});
    }else if(R==='Amico'){
      if(S.eta<14)opt('Giocate insieme','esci',0,()=>{rel(6,12);mod('felicita',r(3,6));return [pick(['Costruite una capanna in cortile.','Pomeriggio di videogiochi a casa sua.','Partita a pallone fino al tramonto.','Inventate un gioco con regole che capite solo voi.','Scambio di figurine: affare fatto.']),'g']});
      else if(S.eta<18)opt('Uscite insieme','esci',15,()=>{rel(6,12);mod('felicita',r(3,6));return [pick(['Gelato e giro in centro.','Pomeriggio al campetto.','Serata film a casa sua.','Un giro in bici senza meta.']),'g']});
      else opt('Uscite insieme','esci',30,()=>{rel(6,12);mod('felicita',r(3,6));return [pick(['Aperitivo e chiacchiere.','Pizza e partita.','Una passeggiata in centro.','Serata giochi da tavolo.']),'g']});
    }else opt('Passate del tempo insieme','tempo',0,()=>{rel(5,11);mod('felicita',r(1,4));return [`Una bella giornata con ${p.nome}.`,'g']});
    if(S.eta<3){if(['Madre','Padre','Patrigno','Nonno','Fratello','Zio'].includes(R))opt('Fatti coccolare','coccole',0,()=>{rel(4,9);mod('felicita',3);return [pick(['Ti addormenti in braccio a {P}.','{P} ti fa il solletico finché non ridi a crepapelle.','{P} ti canta una ninna nanna stonatissima.','Giocate a cucù per mezz\'ora.']).replace('{P}',p.nome),'g']})}
    else o.push({l:`Parla con ${p.nome}`,sub:'Scegli tu l\'argomento',fx:()=>parla(p)});
    if(S.eta>=8)opt('Fai un regalo','regalo',R==='Partner'||R==='Coniuge'?150:60,()=>{rel(6,12);return [`${p.nome} apprezza molto il regalo.`,'g']});
    if(['Madre','Padre','Nonno'].includes(R)&&S.eta>=6)opt('Chiedi dei soldi','soldi',0,()=>{
      const pp=p.rapporto/150*(p.tr===TR.GENEROSO?1.3:p.tr===TR.EGOISTA?.6:1)*memoriaAiuto(p);
      if(chance(pp)){const x=r(20,60)*(S.eta<18?1:6)*({umile:.6,media:1,agiata:3}[S.classe]);soldi(x);return [`${p.nome} ti dà ${eur(x)}.`,'g']}
      rel(-5,-2);return [rifiutoRicordo(p)||'«I soldi non crescono sugli alberi.»','b']});
    // da ricchi si può aiutare la famiglia
    if(S.eta>=25&&['Madre','Padre','Fratello','Figlio','Nipote','Nonno'].includes(R)&&p.eta>=18&&S.soldi>=P(60000))opt('Fai un bonifico generoso','bonif',P(20000),()=>{rel(8,14);ricorda(p,'Gli hai fatto un regalo importante'.replace('Gli',gp(p,'Gli','Le')));return [`${p.nome} ti chiama commoss${gp(p,'o','a')}: «Non dovevi».`,'g']},0);
    if(R==='Figlio'&&p.eta>=20&&!p.casaRegalata&&S.soldi>=P(400000))opt('Regala una casa','casareg',P(250000),()=>{p.casaRegalata=true;rel(18,25);mod('felicita',8);ricorda(p,'Gli hai regalato una casa'.replace('Gli',gp(p,'Gli','Le')));return [`Consegni a ${p.nome} le chiavi di un appartamento. Non riesce a dire niente, poi ti abbraccia.`,'g']},0);
    if(['Madre','Padre','Nonno'].includes(R)&&p.eta>=75&&S.eta>=18)opt(`Prenditi cura di ${gp(p,'lui','lei')}`,'cura',0,()=>{rel(10,16);mod('felicita',-1);S.karma=clamp(S.karma+4);return [`Passi molto tempo con ${p.nome}. Ti è grat${gp(p,'o','a')}.`,'g']});
    if(R==='Amico'){
      if(S.eta>=18)opt('Invita in vacanza','vac',1000,()=>{rel(12,18);mod('felicita',8);return [`Una settimana in Sardegna con ${p.nome}.`,'g']});
      if(S.eta>=18)opt('Chiedi un prestito','prest',0,()=>{if(chance(p.rapporto/140*memoriaAiuto(p))){const x=P(r(5,20)*100);soldi(x);rel(-4,-1);return [`${p.nome} ti presta ${eur(x)}.${aiutoRicordo(p)}`,'g']}rel(-6,-3);return [rifiutoRicordo(p)||`${p.nome} dice che non può.`,'b']});
      if(amorePossibile(p)&&p.rapporto>=45)opt('Dichiara i tuoi sentimenti','ama',0,()=>dichiarati(p),4,'Rischi di rovinare l\'amicizia');
      if(!p.best&&p.rapporto>=85&&!vivi(['Amico']).some(x=>x.best))opt('Proponi di essere migliori amici','best',0,()=>{if(chance(.45+(p.rapporto-85)/40+(affinita(p)-50)/250)){p.best=true;mod('felicita',6);return [`Ora tu e ${p.nome} siete migliori amici!`,'g']}relD(p,-4);mod('felicita',-2);return [`${p.nome} sorride: «Ma siamo già amici, che bisogno c'è di dirlo?» Ci rimani un po' male.`,'b']});
    }
    if(R==='Partner'){
      if(S.eta>=18&&!p.conv)opt('Andate a vivere insieme','conv',0,()=>{if(chance(p.rapporto/100)){convivi(p);rel(6,10);mod('felicita',6);return [`Tu e ${p.nome} andate a vivere insieme!`,'g']}rel(-6,-2);return [`${p.nome} dice che è ancora presto.`,'']});
      const ucNo=p.sesso===S.sesso&&!unioneCivilePossibile();
      if(S.eta>=18)o.push({l:'Chiedi di sposarti',sub:ucNo?'Per le coppie dello stesso sesso la legge arriva nel 2016':inSeparazione()?'Prima deve arrivare il divorzio':'',disabled:ucNo||fatto(p.id+'sposa')||inSeparazione(),fx:()=>{segnaAz(p.id+'sposa');if(p.rapporto>=60&&chance(.8)){coda.unshift({e:EV.matrimonio,d:{p}});return null}p.rapporto=clamp(p.rapporto-12);mod('felicita',-6);return [`${p.nome} dice che non è pront${gp(p,'o','a')}.`,'b']}});
    }
    if((R==='Partner'&&p.conv||R==='Coniuge')&&S.eta>=18){
      const cf=coppiaFertile(p);
      if(cf&&cf.donna<=50&&!inGravidanza()){
        if(!S.provano)opt('Provate ad avere un figlio','figlio',0,()=>iniziaTentativi(p),0,'Ogni mese c\'è una possibilità, che cala con l\'età');
        else o.push({l:'Smettete di provarci',sub:`Ci provate da ${S.t-S.provano.t0} mesi`,fx:()=>{S.provano=null;return ['Per ora basta così.','']}});
        if(S.provano&&(S.t-S.provano.t0>=12||(cf.donna>=35&&S.t-S.provano.t0>=6))&&cf.donna<=46)opt('Procreazione assistita','pma',P(4500),()=>{if(chance(successoPMA(cf.donna))){concepisci(p,true);return null}pesa(6,3);mod('felicita',-4);return ['Il ciclo di procreazione assistita non va a buon fine. Si può riprovare.','b']},6,`Un ciclo in un centro privato · ${eur(P(4500))}`);
      }
      if(inGravidanza())o.push({l:'In attesa del bambino',sub:`Il parto è previsto tra ${Math.max(0,S.gravidanza.parto-S.t)} mesi`,disabled:true});
      if(R==='Coniuge'&&S.sesso!==p.sesso&&S.eta<=60&&!S.adozione)o.push({l:'Avviate un\'adozione',sub:puoAdottare(p)||'Domanda al Tribunale per i minorenni',disabled:!!puoAdottare(p),fx:()=>avviaAdozione(p)});
    }
    if((R==='Coniuge'||R==='Partner'&&p.conv)&&!S.terapia)o.push({l:'Proponete una terapia di coppia',sub:`Sei mesi, circa ${eur(P(80))} a seduta`,fx:()=>{if(chance(.55+ppz(p,'A')*.2+(p.imp-50)/150)){S.terapia={pid:p.id,fine:S.t+6,t0:S.t};p.imp=clamp(p.imp+4);return [`${p.nome} accetta. Martedì la prima seduta.`,'']}p.intim=clamp(p.intim-3);return [`«Non abbiamo bisogno di uno psicologo», dice ${p.nome}.`,'b']}});
    if(S.terapia&&S.terapia.pid===p.id)o.push({l:'In terapia di coppia',sub:`Ancora ${Math.max(0,S.terapia.fine-S.t)} mesi`,disabled:true});
    if(R==='Figlio'||R==='Nipote'){
      if(p.eta<10)opt('Leggi una favola','favola',0,()=>{rel(6,10);mod('felicita',3);return [`${p.nome} si addormenta prima della fine.`,'g']});
      if(R==='Figlio'&&p.eta>=6&&p.eta<=18)opt('Aiuta con i compiti','compiti',0,()=>{rel(4,8);p.voto=clamp((p.voto||50)+r(4,9));return ['Un pomeriggio sui libri insieme.','g']});
      if(p.eta>=10&&p.eta<=17)opt('Dai la paghetta','paghetta',300,()=>{rel(5,10);return [`${p.nome} è content${gp(p,'o','a')}.`,'g']});
      if(R==='Figlio'&&p.eta>=25&&S.eta>=60)opt('Chiedi un aiuto economico','aiuto',0,()=>{if(chance(p.rapporto/130*memoriaAiuto(p))){const x=r(10,50)*100;soldi(x);return [`${p.nome} ti aiuta con ${eur(x)}.`,'g']}rel(-6,-2);return [rifiutoRicordo(p)||`${p.nome} è in difficoltà anche ${gp(p,'lui','lei')}.`,'b']});
    }
    opt('Litiga','litiga',0,()=>{rel(-18,-8);mod('felicita',-3);if(p.rapporto<10&&['Amico','Cugino','Cognato','Zio','Suocero'].includes(p.ruolo)&&chance(.4)){creaNemico('lite',p);return [`La lite con ${p.nome} degenera. Ora siete nemici.`,'b']}return [`Volano parole grosse con ${p.nome}.`,'b']});
    if(R==='Amico')o.push({l:'Chiudi l\'amicizia',fx:()=>{S.relazioni=S.relazioni.filter(x=>x!==p);mod('felicita',-3-Math.round(p.rapporto/25));pesa(Math.round(3+p.rapporto/10),2);return [`Non sei più amic${g('o','a')} di ${p.nome}.`,'b']}});
    if(R==='Partner')o.push({l:`Lascia ${p.nome}`,fx:()=>chiudiRelazione(p,'Hai chiuso la relazione con {P}.')});
    if(R==='Coniuge')o.push({l:divorzioPossibile()?'Chiedi il divorzio':'Chiedi la separazione',_incl:0,fx:()=>divorzia(p)});
  }
  if(R==='Amico')o.unshift({l:p.frequente?'Smetti di vederl'+gp(p,'o','a')+' spesso':'Vedil'+gp(p,'o','a')+' spesso',sub:p.frequente?'Le ore con gli amici andranno anche ad altri':'Le tue ore con gli amici andranno soprattutto a '+gp(p,'lui','lei'),fx:()=>{p.frequente=!p.frequente;apriPersona(p.id);return KEEP}});
  const info=[`${ruoloLabel(p)} · ${p.eta} anni`];
  if(p.ruolo==='Figlio'&&p.eta>=19)info.push(p.studio&&p.studio.startsWith('laurea:')?'Laureat'+gp(p,'o','a'):p.studio==='diploma'?'Diplomat'+gp(p,'o','a'):'');
  if(p.conv)info.push('Convivete');
  showSheet({k:info.filter(Boolean).join(' · '),t:`${p.nome} ${p.cognome}`,p:schedaPersona(p),chiudi:true,scelte:o,d:{p}});
}
function schedaPersona(p){
  const r0=[];
  r0.push(`Carattere: ${descrPers(p.pers,p.sesso)}${p.ruolo!=='Nemico'?` · affinità con te ${affinita(p)}%`:''}`);
  const st=statoNpc(p),cp=coppiaNpc(p);
  if(st||cp)r0.push(cap([st,cp].filter(Boolean).join(' · ')));
  const cx=S.legami&&contestoNpc(p);if(cx&&cx.id!=='malato')r0.push(`In questo periodo ${cx.s}`);
  if(p.malato)r0.push(`Sta poco bene${p.malattia?': '+p.malattia.toLowerCase():''}`);
  if(p.nonAuto)r0.push('Non è più autosufficiente');
  if(p.lontano)r0.push(`Vive lontano${p.dove?', a '+p.dove:''}`);
  if(p.intim!==undefined&&['Partner','Coniuge'].includes(p.ruolo))r0.push(`Intimità ${p.intim} · passione ${p.pass} · impegno ${p.imp}`);
  if(p.ruolo==='Nemico')r0.push(`Rancore: ${p.rancore||50}%`);else r0.push(`Rapporto: ${p.rapporto}%`+(S.t-(p.ultimo||0)>=3&&!p.conv?` · non vi vedete da ${S.t-(p.ultimo||0)} mesi`:''));
  if(p.prestito)r0.push(`Ti deve ${eur(p.prestito)}`);
  const rc=(p.ricordi||[]).slice(-2).reverse();
  if(rc.length)r0.push('Si ricorda: '+rc.map(x=>x.s.toLowerCase()).join('; ')+'.');
  if(S.legami&&!['Nemico'].includes(p.ruolo)){
    const gr=gruppiDi(p).map(g=>g.n);if(gr.length)r0.push(`Gruppo: ${gr.join(', ')}`);
    const co=conoscentiDi(p).filter(x=>!FAM_LEG.includes(x.ruolo)||!FAM_LEG.includes(p.ruolo)).slice(0,5).map(x=>x.nome);if(co.length)r0.push(`Conosce anche ${nomi(co)}`);
  }
  return r0.join('\n');
}
/* Da minorenni ci si innamora di coetanei (al massimo 2 anni di differenza), da adulti di adulti */
function etaAmore(){return S.eta<18?Math.max(11,S.eta+r(-2,2)):Math.max(18,S.eta+r(-5,5))}
function candidato(){
  const ses=S.attrazione==='E'?pick(['M','F']):(S.attrazione||(S.sesso==='M'?'F':'M'));
  const pers=nuovoCarattere(),eta=etaAmore(),st=nomeEstraneo(ses,S.anno-eta);return {sesso:ses,nome:st?st.nome:nomeLibero(ses,S.anno-eta),cognome:st?st.cognome:pick(COGNOMI),eta,asp:r(20,98),pers,tr:trDaPers(pers)};
}
function appuntamento(c,bonus){
  if(!c)return ['Non c\'era nessuno.','x'];
  const p=Math.max(.06,Math.min(.88,.3+(S.aspetto-c.asp)/150+S.felicita/400+S.karma/500+S.fama/300+(affinita(c)-50)/200+pz('E')*.06+(bonus||0)));
  if(chance(p)){const n=nuovaPersona('Partner',c.sesso,c.eta,c.cognome,{nome:c.nome,tr:c.tr,pers:c.pers,look:c.look,rapporto:r(55,78)});S.relazioni=S.relazioni.filter(x=>!(x.ruolo==='Conoscente'&&x.nome===c.nome&&x.cognome===c.cognome));mod('felicita',10);return [`${n.nome} dice di sì! Ora state insieme.`,'g']}
  mod('felicita',-4);return [`${c.nome} ti dice gentilmente che non è interessat${c.sesso==='F'?'a':'o'}.`,'b'];
}
function cercaAmore(){
  if(!S.attrazione)return showSheet({k:'Amore',t:'Chi ti attrae?',p:'Puoi cambiarlo quando vuoi.',chiudi:true,scelte:[
    {l:'Uomini',fx:()=>{S.attrazione='M';cercaAmore();return KEEP}},{l:'Donne',fx:()=>{S.attrazione='F';cercaAmore();return KEEP}},{l:'Entrambi',fx:()=>{S.attrazione='E';cercaAmore();return KEEP}}]});
  const amici=vivi(['Amico']);
  showSheet({k:'Amore',t:"Cerca l'amore",p:'Dove vuoi conoscere qualcuno?',chiudi:true,scelte:[
    {l:'App di incontri',sub:'Tre profili da scegliere',disabled:fatto('app'),fx:()=>{segnaAz('app');const cs=[candidato(),candidato(),candidato()];
      showSheet({k:'App di incontri',t:'Scegli un profilo',p:'Il successo dipende dal tuo aspetto, da quanto sei felice e da quanto sei una brava persona.',chiudi:true,scelte:cs.map(c=>({l:`${c.nome}, ${c.eta} anni`,sub:`${tratto(c)} · aspetto ${c.asp}/100`,fx:()=>appuntamento(c)}))});return KEEP}},
    {l:'Esci in un locale',sub:()=>eur(P(40)),costo:()=>P(40),disabled:fatto('locale'),fx:()=>{segnaAz('locale');eff({bev:1});coda.unshift({e:EV.incontro,d:{}});return null}},
    {l:'Fatti presentare da un amico',sub:amici.length?'Più probabilità di successo':'Ti serve almeno un amico',disabled:!amici.length||fatto('presenta'),fx:()=>{segnaAz('presenta');coda.unshift({e:EV.incontro,d:{x:'amico'}});return null}},
    {l:'Cambia preferenze',fx:()=>{S.attrazione=null;cercaAmore();return KEEP}}]});
}
function sposa(p,fel){
  p.ruolo='Coniuge';if(!p.conv)convivi(p);p.rapporto=clamp(p.rapporto+10);p.imp=clamp((p.imp||60)+20);mod('felicita',fel);segnaVita('matrimonio');S.fatti.sposato=true;creaSuoceri(p);
  p.nozze=S.t;p.soldiNozze=S.soldi;pesa(6,2);
  presentaAmici('Al matrimonio',true);
  {const L=S.relazioni.filter(x=>x.vivo&&x!==p&&['Amico','Fratello','Cugino','Zio','Nonno'].includes(x.ruolo)).map(x=>[x,ricordoDi(x,1,5)]).filter(x=>x[1]);
   if(L.length){const [x,m]=pick(L);log(`Al matrimonio c'è anche ${x.nome}, che si ricorda ancora di ${quanto(m)}: ${m.s.charAt(0).toLowerCase()+m.s.slice(1)}.`,'g');ritorno(x,m,'matrimonio')}}
  momento('matrimonio',{tit:`${S.nome} e ${p.nome}`,sub:p.sesso===S.sesso?'Unione civile':'Sposi',txt:pick(['Il sì più emozionante della tua vita, e un pranzo che finisce a mezzanotte.','Riso, lacrime, il primo ballo e una zia che piange più di tutti.','Fiori, promesse e un brindisi con tutte le persone che ami.']),pids:[p.id]});   // anche i cambiamenti belli stressano (Holmes e Rahe: matrimonio 50 su 100)
  return [p.sesso===S.sesso?`Celebrate l'unione civile! Il giorno più bello della tua vita insieme a ${p.nome}.`:`Vi sposate! Il giorno più bello della tua vita insieme a ${p.nome}.`,'g'];
}
function nasceFiglio(p,ses,silenzio){
  ses=ses||pick(['M','F']);
  const cog=S.sesso==='M'?S.cognome:(p&&p.sesso==='M'?p.cognome:S.cognome);
  const f=nuovaPersona('Figlio',ses,0,cog,{rapporto:r(80,100),genitori:p?[S,p]:[S]});
  mod('felicita',15);if(p&&p.vivo)p.rapporto=clamp(p.rapporto+8);segnaVita('figlio');pesa(5,2);
  if(silenzio)return f;
  return [`È nat${gp(f,'o','a')} ${f.nome}! Benvenut${gp(f,'o','a')} al mondo.`,'g'];
}
function chiudiRelazione(p,testo){
  if(p.ruolo==='Coniuge')return divorzia(p);
  p.ruolo='Ex';p.conv=false;S.fatti.fineCoppiaT=S.t;mod('felicita',-6);if(S.legami)bisognoAiuto('separazione',p);pesa(Math.round(6+p.rapporto/8),4);rimuoviSuoceri(p);
  return [T(testo,{p}),'b'];
}
function nuoveAmicizie(){
  azione(una('nuoviamici',0,()=>{
    const dove=S.eta<14?'al parco giochi':S.eta<19?'a scuola':S.eta<65?pick(['in un\'associazione sportiva','a un corso serale','con un gruppo di escursionismo','in un circolo culturale']):'al circolo degli anziani';
    if(chance(.7)){const p=nuovoAmico(true);if(p)return [`Conosci ${p.nome} ${dove}. Diventate amici.`,'g']}
    return [`Ci provi ${dove}, ma non scatta la scintilla con nessuno.`,''];
  }));
}
function adotta(A){
  const a=initAnimale({t:A.t,nome:nomeAnimale(A),eta:r(0,3),max:r(A.max[0],A.max[1])});
  S.animali.push(a);mod('felicita',8);
  return [`Accogli in casa ${a.nome}, ${A.t==='Gatto'?'un gatto':A.t==='Cane'?'un cane':A.t==='Coniglio'?'un coniglio':'un pappagallo'}.`,'g'];
}
function adottaAnimale(){
  showSheet({k:'Animali',t:'Adotta un animale',p:'Ogni animale costa circa 500 € l\'anno, ma rende più felici.',chiudi:true,scelte:ANIMALI.map(A=>({l:`${A.t}`,sub:eur(P(A.t==='Pappagallo'?300:120)),costo:P(A.t==='Pappagallo'?300:120),fx:()=>{if(S.eta<18&&chance(.5))return ['I tuoi genitori dicono di no.','b'];return adotta(A)}}))});
}
/* apriAnimale(): in e2_lusso.js (legame, pappa, cure) */

/* ---------- Beni ---------- */
function mercato(){
  if(S.mercato&&S.mercato.eta===S.eta)return S.mercato;
  const c=luogo(),casa=[],mt=S.mondo.mattone;
  for(let i=0;i<5;i++){const t=pick(CASE_TIPI);const stato=r(30,100);casa.push({t:t.t,mq:t.mq,stato,lusso:!!t.lusso,prezzo:Math.round(t.mq*c.mq*mt*(t.k||1)*(.75+stato/400)*r(90,112)/100/1000)*1000})}
  const auto=AUTO.map(a=>({...a,prezzo:Math.round(a.p*ip()*r(92,108)/100/100)*100,costo:P(a.costo)}));
  S.mercato={eta:S.eta,casa,auto};return S.mercato;
}
function cercaAffitto(){
  showSheet({k:`Affitti a ${S.citta}`,t:'Cerca casa in affitto',p:convivente()?'Vivi con il tuo partner: l\'affitto lo dividete a metà.':'Oltre all\'affitto ci sono circa '+eur(P(11000))+' l\'anno di spesa e bollette.',chiudi:true,scelte:AFFITTI.map(a=>{const b=affittoBase(a.t);return {l:a.t,sub:`${eur(b.costo)} l'anno (${eur(b.costo/12)} al mese)`,fx:()=>{S.casa=b;mod('felicita',S.eta<30?6:3);return [`Ti trasferisci: ${a.t.toLowerCase()} in affitto a ${S.citta}.`,'g']}}})});
}
function tornaGenitori(){
  showSheet({k:'Casa',t:'Torni dai tuoi genitori?',p:'Risparmi l\'affitto, ma perdi un po\' di indipendenza.',chiudi:true,scelte:[{l:'Sì',fx:()=>{const pa=partnerAttuale();if(pa&&pa.conv){pa.conv=false;pa.rapporto=clamp(pa.rapporto-15)}S.casa={tipo:'genitori'};mod('felicita',-3);relGenitori(4);return ['Torni nella tua vecchia cameretta.','']}}]});
}
function compraCasa(){
  const M=mercato();
  showSheet({k:`Case in vendita a ${S.citta}`,t:'Compra casa',p:'Notaio e tasse: 5% del prezzo. Con il mutuo serve un anticipo del 20% più le spese, e un lavoro stabile.',chiudi:true,scelte:M.casa.map((h,i)=>({l:`${h.t} · ${h.mq} m²`,sub:`${eur(h.prezzo)} · condizioni ${h.stato}%`,fx:()=>{dettaglioCasa(i);return KEEP}}))});
}
function dettaglioCasa(i){
  const M=mercato(),h=M.casa[i];if(!h)return;
  const spese=Math.round(h.prezzo*.05),ant=Math.round(h.prezzo*.2),tf=tassoMutuo('fisso'),tv=tassoMutuo('var'),rataF=rataMutuo(h.prezzo-ant,25,tf),rataV=rataMutuo(h.prezzo-ant,25,tv);
  const L=S.lavoro,nettoAnn=L&&!JOB[L.id].pt?(isPiva(L)?nettoPiva(ralEff(L),L):netto(ralEff(L))):0,ctr=L&&L.contratto?L.contratto.t:'';
  const compra=(mutuo,tipo)=>{const rata=tipo==='var'?rataV:rataF;
    M.casa.splice(i,1);
    const p={id:S.nextId++,tipo:h.t,citta:S.citta,valore:h.prezzo,stato:h.stato,lusso:h.lusso,mutuo:mutuo?{residuo:h.prezzo-ant,rata,anni:25,tipo,tasso:tipo==='var'?tv:tf}:null};
    S.prop.push(p);if(!S.fatti.primaCasa){S.fatti.primaCasa=1;momento('casa',{tit:`${h.t} a ${S.citta}`,sub:mutuo?'Con un mutuo di 25 anni':'Pagata in contanti'})}
    let t=`Compri un ${h.t.toLowerCase()} a ${S.citta}${mutuo?` con un mutuo a tasso ${tipo==='var'?'variabile':'fisso'} da ${eur(rata)} l'anno per 25 anni`:''}.`;
    if(S.casa.tipo!=='proprieta'){S.casa={tipo:'proprieta',pid:p.id};t+=' Ti trasferisci subito.'}
    mod('felicita',12);return [t,'g'];
  };
  const banca=tipo=>{const rata=tipo==='var'?rataV:rataF;
      if(!nettoAnn){soldi(ant+spese);return ['La banca rifiuta: serve un lavoro stabile (non part-time).','b']}
      if(ctr==='det'&&chance(.75)){soldi(ant+spese);return ['La banca rifiuta: con un contratto a termine serve un garante o un tempo indeterminato.','b']}
      if(ctr==='piva'&&L.anni<2){soldi(ant+spese);return ['La banca vuole almeno due anni di dichiarazioni dei redditi con la partita IVA.','b']}
      if(rata>nettoAnn*.35){soldi(ant+spese);return [`La banca rifiuta: la rata supera il 35% del tuo stipendio netto (${eur(nettoAnn)}).`,'b']}
      if(S.fedina.length&&chance(.4)){soldi(ant+spese);return ['La banca rifiuta: i tuoi precedenti penali non la convincono.','b']}
      if(S.fatti.crif!==undefined&&S.eta-S.fatti.crif<7){soldi(ant+spese);return ['La banca rifiuta: sei segnalat'+g('o','a')+' come cattivo pagatore dopo il sovraindebitamento.','b']}
      return compra(true,tipo)};
  showSheet({k:'Annuncio',t:`${h.t} · ${h.mq} m²`,p:`Prezzo: ${eur(h.prezzo)}\nCondizioni: ${h.stato}%\nSpese notarili: ${eur(spese)}`,chiudi:true,scelte:[
    {l:'Paga in contanti',sub:eur(h.prezzo+spese),costo:h.prezzo+spese,fx:()=>compra(false)},
    {l:`Mutuo a tasso fisso (${pctStr(tf)})`,sub:`Anticipo ${eur(ant+spese)} · rata ${eur(rataF)} l'anno per 25 anni, sempre uguale`,costo:ant+spese,fx:()=>banca('fisso')},
    {l:`Mutuo a tasso variabile (${pctStr(tv)} oggi)`,sub:`Anticipo ${eur(ant+spese)} · rata ${eur(rataV)} l'anno, che segue i tassi`,costo:ant+spese,fx:()=>banca('var')}]});
}
function apriProp(id){
  const p=S.prop.find(x=>x.id===id);if(!p)return;
  const qui=S.casa.tipo==='proprieta'&&S.casa.pid===id;
  const vendita=Math.round(p.valore*(.7+.3*p.stato/100));
  const o=[];
  if(!qui&&S.carcere===0)o.push({l:'Trasferisciti qui',fx:()=>{p.affittata=false;S.casa={tipo:'proprieta',pid:p.id};mod('felicita',4);return [`Ti trasferisci nel tuo ${p.tipo.toLowerCase()}.`,'g']}});
  if(!qui&&!p.affittata)o.push({l:'Affittala',sub:`Circa ${eur(p.valore*.045)} l'anno`,fx:()=>{p.affittata=true;return [`Trovi un inquilino per il ${p.tipo.toLowerCase()}.`,'g']}});
  if(p.affittata)o.push({l:'Smetti di affittarla',fx:()=>{p.affittata=false;return ['L\'inquilino se ne va.','']}});
  const cr=Math.round(p.valore*.12/100)*100;
  o.push({l:'Ristruttura',sub:eur(cr),costo:cr,disabled:p.stato>=95,fx:()=>{p.stato=100;p.valore=Math.round(p.valore*1.08);mod('felicita',4);return ['Lavori finiti: sembra nuova.','g']}});
  if(p.mutuo)o.push({l:'Estingui il mutuo',sub:eur(p.mutuo.residuo),costo:p.mutuo.residuo,fx:()=>{p.mutuo=null;mod('felicita',8);return ['Mutuo estinto. La casa è tutta tua.','g']}});
  o.push({l:'Vendi',sub:`Incassi circa ${eur(vendita-(p.mutuo?p.mutuo.residuo:0))}`,fx:()=>{
    const netto0=vendita-(p.mutuo?p.mutuo.residuo:0);soldi(netto0);S.prop=S.prop.filter(x=>x!==p);
    let t=`Vendi il ${p.tipo.toLowerCase()} e incassi ${eur(netto0)}.`;
    if(qui){S.casa=affittoBase(convivente()?'Bilocale':'Monolocale');t+=' Ti trasferisci in affitto.'}
    return [t,netto0>=0?'g':'b']}});
  showSheet({k:`${p.citta}${qui?' · ci vivi':''}${p.affittata?' · affittata':''}`,t:p.tipo,p:`Valore: ${eur(p.valore)}\nCondizioni: ${p.stato}%${p.mutuo?`\nMutuo residuo: ${eur(p.mutuo.residuo)} (${p.mutuo.anni} anni, ${eur(p.mutuo.rata)} l'anno${p.mutuo.tasso?`, tasso ${p.mutuo.tipo==='var'?'variabile':'fisso'} ${pctStr(p.mutuo.tasso)}`:''})`:''}`,chiudi:true,scelte:o});
}
function concessionario(){
  const M=mercato();
  showSheet({k:'Concessionario',t:'Compra un veicolo',p:S.patente?'Puoi pagare in contanti o a rate in 5 anni (anticipo 20%).':S.fatti.patentino?'Con il patentino AM puoi guidare solo lo scooter 50.':"Senza patente non puoi guidare: dai 14 anni c'è il patentino per lo scooter 50.",chiudi:true,scelte:M.auto.map(a=>{
    const blocco=S.eta<(a.min||18)?`Dai ${a.min||18} anni`:a.am?(!S.patente&&!S.fatti.patentino?'Serve il patentino AM':''):(!a.noPat&&!S.patente)?'Serve la patente B':'';
    return {l:a.n,sub:blocco||`${eur(a.prezzo)} · ${eur(a.costo)} l'anno di assicurazione e bollo`,disabled:!!blocco,fx:()=>{dettaglioAuto(a);return KEEP}}})});
}
function dettaglioAuto(a){
  const ant=Math.round(a.prezzo*.2),rata=rataMutuo(a.prezzo-ant,5,.07);
  const aggiungi=pr=>{S.veicoli.push({id:S.nextId++,n:a.n,valore:a.prezzo,stato:100,costo:a.costo,prestito:pr?{rata,anni:5}:null});mod('felicita',a.prezzo>50000?12:6);return [`Ritiri il veicolo nuovo: ${a.n.toLowerCase()}. Che emozione!`,'g']};
  showSheet({k:'Concessionario',t:a.n,p:`Prezzo: ${eur(a.prezzo)}`,chiudi:true,scelte:[
    {l:'Paga in contanti',sub:eur(a.prezzo),costo:a.prezzo,fx:()=>aggiungi(false)},
    {l:'Finanziamento in 5 anni',sub:`Anticipo ${eur(ant)} · rata ${eur(rata)} l'anno`,costo:ant,fx:()=>{if(!S.lavoro){soldi(ant);return ['La finanziaria rifiuta: serve un lavoro.','b']}return aggiungi(true)}}]});
}
function apriVeicolo(id){
  const c=S.veicoli.find(x=>x.id===id);if(!c)return;
  const vend=Math.round(c.valore*(.6+.4*c.stato/100))-(c.prestito?c.prestito.rata*c.prestito.anni:0);
  const tag=Math.max(150,Math.round(c.valore*.05/10)*10);
  showSheet({k:`Valore ${eur(c.valore)} · condizioni ${c.stato}%`,t:c.n,p:c.prestito?`Rate residue: ${c.prestito.anni} da ${eur(c.prestito.rata)}`:'',chiudi:true,scelte:[
    {l:'Fai un giro',disabled:fatto('giro'+id),fx:una('giro'+id,0,()=>{if(c.stato<25&&chance(.2)){mod('salute',-10);c.stato=clamp(c.stato-20);return ['Si rompono i freni in curva. Un brutto spavento e qualche livido.','b']}mod('felicita',4);return ['Finestrini giù e musica alta.','g']})},
    {l:'Tagliando completo',sub:eur(tag),costo:tag,disabled:c.stato>=95,fx:()=>{c.stato=100;return ['Il meccanico la rimette a nuovo.','g']}},
    ...(c.valore>0?[{l:'Vendi',sub:`Incassi circa ${eur(vend)}`,fx:()=>{soldi(vend);S.veicoli=S.veicoli.filter(x=>x!==c);return [`Vendi ${c.n.toLowerCase()} e incassi ${eur(vend)}.`,vend>=0?'':'b']}}]:[{l:'Restituisci',fx:()=>{S.veicoli=S.veicoli.filter(x=>x!==c);return ['Restituisci il veicolo.','']}}])]});
}
function trasferisciti(){
  const ext=S.abil.lingue>=40||S.istr.cert.includes('Inglese B2');
  showSheet({k:'Trasloco',t:'Dove vuoi vivere?',p:`Cerca tra tutti i comuni italiani. Se hai un lavoro dipendente lo perdi e le amicizie si allentano.${ext?' Puoi anche andare all\'estero.':' Per l\'estero ti servono le lingue (abilità 40 o inglese B2).'}`,chiudi:true,
    cerca:{ph:'Cerca un comune: Lecce, Bra, Cefalù…',trova:q=>cercaLuoghi(q,ext).filter(c=>!(c.n===S.citta&&c.s===S.prov)).slice(0,30).map(c=>{const inf=cittaInfo(c.n,c.s);return {l:nomeLuogo(c.n,c.s),sub:`${inf.estero?'Estero':inf.reg}${c.p&&!inf.estero?` · ${nf(c.p)} abitanti`:''} · case ${eur(inf.mq*S.mondo.mattone)} al m²`,fx:()=>vaiA(c.n,c.s)}})}});
}
/* Dopo un trasloco: chi vive già nella nuova città non è più «lontano»; chi resta nella vecchia lo diventa */
function dopoTrasloco(da){
  marcaEmigrazione(da);
  for(const p of S.relazioni){
    if(!p.vivo||['Nemico','Conoscente','Ex'].includes(p.ruolo)||convive(p))continue;
    if(p.lontano&&p.dove===S.citta){p.lontano=false;p.dove=null;p.rapporto=clamp(p.rapporto+5);log(`Ora tu e ${p.nome} vivete nella stessa città.`,'g')}
    else if(!p.lontano&&da&&da!==S.citta){p.lontano=true;p.dove=da}
  }
}
function vaiA(n,s){
  const da=S.citta;
  S.citta=n;S.prov=s||null;S.mercato=null;
  if(S.casa.tipo==='proprieta')S.casa=affittoBase(convivente()?'Bilocale':'Monolocale');
  else if(S.casa.tipo==='affitto')S.casa=affittoBase(S.casa.n);
  else S.casa=affittoBase('Monolocale');
  if(S.lavoro&&!JOB[S.lavoro.id].var)licenzia('Lasci il lavoro per trasferirti.',true);
  relAmici(-15);mod('felicita',3);dopoTrasloco(da);
  return [`Ti trasferisci a ${nomeLuogo(n,s)}. Una nuova vita comincia.`,'g'];
}

/* ---------- Attività ---------- */
function cura(p2,p4){
  const curate=[];
  S.malattie=S.malattie.filter(m=>{
    if(m.g===4&&!m.tum&&chance(p4+.3))m.ctrl=1;   // cuore e fegato non guariscono: le cure li tengono sotto controllo
    if(m.g===1||(m.g===2&&chance(p2))){curate.push(m.n);return false}
    return true;
  });
  const cron=S.malattie.filter(m=>m.g===3);
  if(cron.length)S.fatti.terapiaAnno=S.anno;
  if(curate.length)mod('salute',r(4,8)+curate.length*2);
  let t=curate.length?`Curat${g('o','a')}: ${curate.join(', ').toLowerCase()}.`:'';
  if(cron.length)t+=` Terapia per ${cron.map(m=>m.n.toLowerCase()).join(', ')}: quest'anno non peggiorerà.`;
  const rest=S.malattie.filter(m=>m.g!==3);
  if(rest.length)t+=` Restano da curare: ${rest.map(m=>m.n.toLowerCase()).join(', ')}.`;
  if(!S.malattie.length&&!curate.length)t='Check-up completo: sei in buona salute.';
  return [t.trim(),curate.length?'g':(rest.length?'b':'g')];
}
const METE=[{n:'Weekend a Roma',c:400,f:5},{n:'Una settimana in Puglia',c:1200,f:9},{n:'Crociera nel Mediterraneo',c:2500,f:12},{n:'New York',c:3500,f:14,l:4},{n:'Giappone',c:5000,f:16,l:3},{n:'Maldive',c:7000,f:18}];
const ATTIVITA=[
  {sez:'Salute',id:'medico',n:'Medico di base',d:'Visita gratuita',costo:0,min:0,fx:()=>cura(.3,0)},
  {sez:'Salute',id:'spec',n:'Visita specialistica',d:'Con il Servizio sanitario (e la sua lista d\'attesa) o a pagamento',costo:0,min:0,fx:()=>{coda.unshift({e:EV.ita_attesa,d:{m:mesiAttesa()}});return null}},
  {sez:'Salute',id:'clinica',n:'Clinica privata',d:'Le cure migliori',costo:2500,min:0,fx:()=>{const r0=cura(.9,.4);mod('salute',3);return r0}},
  {sez:'Salute',id:'psi',n:'Psicologo',d:'Sei mesi di sedute',costo:900,min:10,en:4,fx:()=>{eff({f:[6,12]});segnaVita('terapia');S.tensione=Math.max(0,(S.tensione||0)-6);if(S.att&&S.att!=='sicuro'&&chance(.25)){S.att='sicuro';log('La terapia ti aiuta a fidarti di più degli altri.','g')}if(haMal('Depressione')&&chance(.5)){S.malattie=S.malattie.filter(m=>m.n!=='Depressione');return ['Un anno di terapia. La depressione è alle spalle.','g']}return ['Parlare con qualcuno ti aiuta a vedere le cose con più chiarezza.','g']}},
  {sez:'Salute',id:'fumo',n:'Smetti di fumare',d:'Cerotti e forza di volontà',costo:150,min:12,cond:()=>S.dip.fumo,fx:()=>{if(chance(.4)){S.dip.fumo=false;mod('salute',5);return ['Hai smesso di fumare! I polmoni ringraziano.','g']}mod('felicita',-3);return ['Resisti tre settimane, poi ricominci.','b']}},
  {sez:'Salute',id:'serd',n:'Percorso di recupero',d:'Per alcol o gioco',costo:0,min:14,cond:()=>S.dip.alcol||S.dip.gioco,fx:()=>{const k=S.dip.alcol?'alcol':'gioco';if(chance(.45)){S.dip[k]=false;S.fatti[k==='alcol'?'bev':'gio']=0;mod('felicita',8);return [`Esci dalla dipendenza ${k==='alcol'?"dall'alcol":'dal gioco'}. Un traguardo enorme.`,'g']}return ['Ci provi, ma è dura. Continua il percorso.','']}},
  {sez:'Benessere',id:'medita',n:'Ritiro di meditazione',d:'Un weekend di silenzio',costo:120,min:14,fx:()=>{eff({f:[2,6]});S.bis.stress=clamp(S.bis.stress-12);return [`Respiri, rallenti. Ti senti più seren${g('o','a')}.`,'g']}},
  {sez:'Benessere',id:'biblio',n:'Biblioteca',d:'Un pomeriggio tra i libri',costo:0,min:6,en:3,fx:()=>{eff({i:[0,2]});return ['Esci con due romanzi e un saggio in prestito.','g']}},
  {sez:'Benessere',id:'terme',n:'Giornata alle terme',d:'Relax totale',costo:200,min:16,en:-10,fx:()=>{eff({f:[5,8],s:1});S.bis.stress=clamp(S.bis.stress-15);return ['Piscine calde e massaggio. Rinat'+g('o','a')+'.','g']}},
  {sez:'Tempo libero',id:'disco',n:'Discoteca',d:'Fino alle 5',costo:40,min:16,en:14,fx:()=>{eff({f:[4,8],bev:1});S.bis.soc=clamp(S.bis.soc+8+pz('E')*6);if(single()&&S.eta>=18&&chance(.3)){coda.unshift({e:EV.incontro,d:{}});return null}if(chance(.2)){const p=nuovoAmico(true);if(p)return [`Balli tutta la notte e conosci ${p.nome}.`,'g']}return ['Musica a palla fino all\'alba.','g']}},
  {sez:'Tempo libero',id:'cinema',n:'Cinema',d:'Ultimo film uscito',costo:10,min:6,en:3,fx:()=>{eff({f:[1,3]});return [pick(['Un thriller da brividi.','Una commedia che ti fa piangere dal ridere.','Un film d\'autore. Ti sei addormentat'+g('o','a')+'.']),'g']}},
  {sez:'Tempo libero',id:'vacanza',n:'Vacanza',d:'Scegli la meta',costo:0,da:400,min:18,en:0,fx:()=>{showSheet({k:'Vacanza',t:'Dove vai?',p:partnerAttuale()?`Partirai con ${partnerAttuale().nome}.`:'',chiudi:true,scelte:METE.map(m=>m.n.endsWith(S.citta)?{...m,n:m.n.replace(S.citta,S.citta==='Firenze'?'Napoli':'Firenze')}:m).map(m=>({l:m.n,sub:eur(P(m.c)),costo:P(m.c),fx:()=>{segnaAz('att_vacanza');eff({f:m.f,lingue:m.l||0});S.bis.stress=clamp(S.bis.stress-20);S.bis.energia=clamp(S.bis.energia+15);if(chance(.3))segnaVita('viaggio');const pa=partnerAttuale();if(pa)pa.rapporto=clamp(pa.rapporto+8);return [`${m.n}: ricordi che durano tutta la vita.`,'g']}}))});delete S.azioni.att_vacanza;return KEEP}},
  {sez:'Fortuna',id:'gratta',n:'Gratta e Vinci',d:'Biglietto da 5 €',costo:5,min:18,ripeti:1,fx:()=>{eff({gio:1});
    if(chance(.0005)){soldi(P(500000));mod('felicita',30);return ['Non ci credi: hai vinto 500.000 €!','g']}
    if(chance(.01)){soldi(P(500));mod('felicita',6);return ['Hai vinto 500 €!','g']}
    if(chance(.2)){soldi(P(10));return ['Vinci 10 €. Hai raddoppiato.','g']}
    return [`Niente. Ritenta, sarai più fortunat${g('o','a')}.`,'']}},
  {sez:'Fortuna',id:'scommessa',n:'Scommessa sportiva',d:'Schedina da 20 €',costo:20,min:18,ripeti:1,fx:()=>{eff({gio:1});if(chance(.12)){const x=r(4,30)*20;soldi(x);return [`La schedina è vincente: ${eur(x)}!`,'g']}return ['Ti tradisce l\'ultima partita, al 90°.','']}},
  {sez:'Fortuna',id:'casino',n:'Casinò',d:'Una serata a Sanremo',costo:500,min:18,fx:()=>{eff({gio:2});if(chance(.35)){const x=r(6,30)*100;soldi(x);mod('felicita',6);return [`Serata fortunata alla roulette: vinci ${eur(x)}!`,'g']}mod('felicita',-3);return ['Il banco vince sempre.','b']}},
  {sez:'Altro',id:'sfl',n:'Corso con il Supporto formazione e lavoro',d:'500 € al mese per un anno, se segui un corso',costo:0,min:18,max:59,cond:()=>puoSFL(),fx:()=>{S.sfl={mesi:12,m:0};S.fatti.sflT=S.t;eff({i:1});return [`Ti iscrivi a un corso di formazione: per un anno ricevi ${eur(P(500))} al mese.`,'g']}},
  {sez:'Altro',id:'patentino',n:'Patentino AM',d:'Per lo scooter 50, dai 14 anni',costo:150,min:14,cond:()=>!S.fatti.patentino&&!S.patente,fx:()=>{if(chance(.6+S.intelligenza/300)){S.fatti.patentino=true;mod('felicita',4);return ['Patentino preso: ora puoi guidare lo scooter 50.','g']}mod('felicita',-2);return [`Bocciat${g('o','a')} ai quiz per un soffio. Riproverai.`,'b']}},
  {sez:'Altro',id:'patente',n:'Esame di guida',d:'Patente B',costo:700,min:18,cond:()=>!S.patente&&!(S.fatti.sospesa&&S.eta-S.fatti.sospesa<2),fx:()=>{if(chance(.45+S.intelligenza/200)){S.patente=true;mod('felicita',8);return ['Patente presa! Il mondo ora è più grande.','g']}mod('felicita',-4);return [`Bocciat${g('o','a')}: hai preso un cordolo in parcheggio.`,'b']}},
  {sez:'Altro',id:'chirurgia',n:'Chirurgia estetica',d:'Un ritocco',costo:5000,min:18,fx:()=>{if(chance(.85)){eff({a:[8,16]});return ['Il chirurgo ha fatto un ottimo lavoro.','g']}eff({a:[-12,-5],f:-6});return ['Qualcosa è andato storto. Non ti riconosci allo specchio.','b']}},
  {sez:'Altro',id:'trasloco',n:'Cambia città',d:'Trasferisciti altrove',costo:0,min:18,fx:()=>{trasferisciti();return KEEP}}
];
const AZ_CARCERE=[
  {id:'condotta',n:'Buona condotta',d:'Può ridurre la pena'},
  {id:'studia',n:'Studia',d:'Diploma in 3 anni, laurea in 4'},
  {id:'palestra',n:'Palestra del carcere',d:'Pesi e flessioni'},
  {id:'lavora',n:'Lavora in carcere',d:'Lavanderia: 1.800 € l\'anno'},
  {id:'cucina',n:'Corso di cucina',d:'Può darti l\'attestato da cuoco'},
  {id:'banda',n:'Unisciti a una banda',d:'Protezione, ma anche guai'},
  {id:'permesso',n:'Permesso premio',d:'Dopo un anno, con buona condotta'},
  {id:'udienza',n:'Libertà condizionale',d:'Dopo metà pena'},
  {id:'evasione',n:'Pianifica l\'evasione',d:'Tre modi, tutti rischiosi'}
];
ATTIVITA.push(
  {sez:'Spettacolo',id:'provino',n:'Fai un provino',d:'Cinema, TV e pubblicità',costo:0,min:16,cond:()=>!(S.lavoro&&S.lavoro.id==='att'),fx:()=>{
    if(!chance(.1+S.abil.arte/250+S.aspetto/300+S.fama/300)){mod('felicita',-3);return [pick(['«Grazie, le faremo sapere.»','Il regista ti interrompe dopo due battute.','Cercavano qualcuno più alto.']),'b']}
    S.fatti.provino=true;
    if(requisitiJob(JOB.att).length)return ['Il provino va bene! Ti richiameranno quando avrai finito la scuola. Trovi la carriera nella scheda Lavoro.','g'];
    assumi(JOB.att);mod('felicita',8);return ['Ti prendono come comparsa in una fiction. Inizia la carriera da attore!'.replace('attore',g('attore','attrice')),'g']}},
  {sez:'Spettacolo',id:'ospitata',n:'Ospitata in TV',d:'Un salotto televisivo',costo:0,min:16,cond:()=>S.fama>=20,fx:()=>{const x=P(S.fama*150);soldi(x);S.fama=clamp(S.fama+2);return [`Racconti la tua vita in prima serata. Cachet: ${eur(x)}.`,'g']}},
  {sez:'Spettacolo',id:'libro',n:'Scrivi un libro',d:'La tua autobiografia',costo:0,min:18,cond:()=>S.fama>=25&&!S.fatti.libro,fx:()=>{S.fatti.libro=1;if(chance(.6)){const x=P(S.fama*900);soldi(x);return [`Il libro entra in classifica. Diritti d'autore: ${eur(x)}.`,'g']}return ['Il libro vende poche copie. Tua madre ne ha comprate dieci.','b']}},
  {sez:'Spettacolo',id:'prodotti',n:'Linea di prodotti',d:'Profumi e magliette col tuo nome',costo:20000,min:18,cond:()=>S.fama>=35,fx:()=>{if(chance(.3+S.fama/200)){const x=P(S.fama*1500);soldi(x);return [`I fan comprano tutto: incassi ${eur(x)}.`,'g']}return ['I magazzini restano pieni. Investimento perso.','b']}},
  {sez:'Spettacolo',id:'benef',n:'Beneficenza pubblica',d:'Una raccolta fondi',costo:10000,min:18,cond:()=>S.fama>=15,fx:()=>{eff({k:8,f:5});S.fama=clamp(S.fama+2);return ['Raccogli fondi per un ospedale pediatrico. I giornali ne parlano bene.','g']}},
  {sez:'Spettacolo',id:'stampa',n:'Assumi un addetto stampa',d:'15.000 € l\'anno, protegge dagli scandali',costo:0,min:18,cond:()=>S.fama>=30&&!S.fatti.addettoStampa,fx:()=>{S.fatti.addettoStampa=1;return ['Ora qualcuno gestisce la tua immagine.','g']}}
);
function faiAttivita(id,carcere){
  if(carcere){
    if(id==='evasione')return showSheet({k:'Carcere',t:'Come vuoi evadere?',p:'Se ti scoprono, due anni in più.',chiudi:true,scelte:[
      {l:'Scava un tunnel',sub:'10% di riuscita',fx:()=>evadi('tunnel')},
      {l:'Corrompi una guardia',sub:'15.000 € · 35% di riuscita',fx:()=>evadi('guardia')},
      {l:'Nasconditi nel furgone della lavanderia',sub:'15% di riuscita',fx:()=>evadi('furgone')}]});
    return azione(()=>azCarcere(id));
  }
  const a=ATTIVITA.find(x=>x.id===id);
  const key='att_'+id,costo=P(a.costo),en=a.en===undefined?8:a.en;
  if(!a.ripeti&&S.azioni[key])return toast(attesa(key)+'.');
  if(en>0&&S.bis.energia<en+4)return toast(stanco());
  if(costo&&S.soldi<costo)return toast(`Non hai abbastanza soldi (servono ${eur(costo)}).`);
  if(!a.ripeti)segnaAz(key);
  if(costo)soldi(-costo);
  S.bis.energia=clamp(S.bis.energia-en);
  azione(a.fx);
}
