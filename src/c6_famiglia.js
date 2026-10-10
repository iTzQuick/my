/* ================= FAMIGLIA: fertilità, gravidanza, adozione, separazione =================
   Numeri da ANALISI.md: concepimento per ciclo ≈ 25% sotto i 30 anni, 20% dopo, 5% a 40, 1% dopo i 45;
   aborto spontaneo 10–20% delle gravidanze riconosciute (oltre il 50% dopo i 45); gemelli 1,4% dei parti; cesareo 3 su 10. */

/* Probabilità di concepire in un mese di tentativi, secondo l'età della donna (e un po' quella dell'uomo) */
function fertilitaMese(etaDonna,etaUomo){
  const e=etaDonna;
  let p=e<18?.15:e<30?.25:e<35?.2:e<38?.15:e<40?.11:e<43?.06:e<45?.025:e<48?.01:0;
  if(etaUomo>45)p*=.85;
  return p;
}
const rischioAborto=e=>e<20?.15:e<30?.1:e<35?.12:e<40?.18:e<45?.33:.53;
/* Procreazione assistita: successo per ciclo, indicativo (legge 40/2004: solo coppie di sesso diverso, sposate o conviventi) */
const successoPMA=e=>e<35?.3:e<38?.24:e<40?.17:e<43?.1:e<46?.03:0;
/* Chi può restare incinta nella coppia: ritorna {eta della donna, eta dell'uomo} o null */
function coppiaFertile(p){
  if(!p||S.sesso===p.sesso)return null;
  return S.sesso==='F'?{donna:S.eta,uomo:p.eta}:{donna:p.eta,uomo:S.eta};
}
const inGravidanza=()=>!!S.gravidanza;

function iniziaTentativi(p){S.provano={pid:p.id,t0:S.t};return ['Decidete di provarci. Adesso è una questione di tempo, e un po\' di fortuna.','g']}
function concepisci(p,pma){
  const c=coppiaFertile(p);if(!c)return;
  S.provano=null;
  const gem=chance(pma?.066:c.donna>=35?.02:.012);
  S.gravidanza={pid:p.id,t0:S.t,parto:S.t+9,gem,ses:pick(['M','F']),madreEta:c.donna,tu:S.sesso==='F'};
  mod('felicita',10);p.rapporto=clamp(p.rapporto+5);
  log(S.sesso==='F'?'Il test è positivo: aspetti un bambino!':`${p.nome} ti mostra il test: è positivo. Aspettate un bambino!`,'g');
}
/* Ogni mese: tentativi, gravidanza, parto */
function meseFamiglia(){
  if(S.adozione&&S.t-S.adozione.t0>60)S.adozione=null;
  const G=S.gravidanza;
  if(G){
    const p=S.relazioni.find(x=>x.id===G.pid);
    const m=S.t-G.t0;
    if(m>=2&&!G.ok){
      G.ok=1;
      if(chance(rischioAborto(G.madreEta))){
        S.gravidanza=null;mod('felicita',-12);pesa(14,6);if(p&&p.vivo)p.rapporto=clamp(p.rapporto+3);
        log(G.tu?'Al secondo mese perdi il bambino. Un dolore di cui si parla poco, e che pesa tanto.':`Al secondo mese ${p?p.nome:'la tua compagna'} perde il bambino. Un dolore di cui si parla poco, e che pesa tanto.`,'b');
        if(p&&p.vivo&&p.conv)S.provano={pid:p.id,t0:S.t};
        return;
      }
    }
    if(m===4&&!G.eco){G.eco=1;log(`Ecografia: ${G.gem?'sono due!':G.ses==='F'?'sarà una femmina.':'sarà un maschio.'}`,'g')}
    if(S.t>=G.parto){
      S.gravidanza=null;
      const ces=chance(.3),n=G.gem?2:1,nati=[];
      for(let i=0;i<n;i++)nati.push(nasceFiglio(p,i?pick(['M','F']):G.ses,true));
      const nomi=nati.map(f=>f.nome).join(' e ');
      momento('figlio',{tit:nomi,sub:n===2?'Due gemelli':`È nat${gp(nati[0],'o','a')}`,txt:`${n===2?'Pesano':'Pesa'} ${nati.map(()=>(r(n===2?22:28,n===2?30:40)/10).toFixed(1).replace('.',',')).join(' e ')} kg.${ces?' Parto cesareo, ma state tutti bene.':''}`,pids:nati.map(f=>f.id)});
      log(`${n===2?`Sono nati due gemelli: ${nomi}!`:`È nat${gp(nati[0],'o','a')} ${nomi}!`}${ces?' Parto cesareo, ma state tutti bene.':''}`,'g');
      if(p&&p.vivo&&!['Partner','Coniuge'].includes(p.ruolo))nati.forEach(f=>{if(!G.tu)f.conEx=true});
      if(S.lavoro&&!JOB[S.lavoro.id].pt&&!isPiva(S.lavoro)){
        if(G.tu){S.fatti.congedo=S.t+5;S.fatti.congedoQuota=.8;log('Inizi il congedo di maternità: 5 mesi all\'80% dello stipendio.','h')}
        else coda.push({e:EV.congedo_padre,d:{}});
      }
      // la compagna che lavora: a volte lascia il lavoro per qualche anno (nel 2024 si sono dimesse 42.237 madri, quasi sempre per i figli)
      if(!G.tu&&p&&p.vivo&&p.stato==='lavora'&&chance(.2)){p.stato='casa';p.tornaLav=S.t+r(12,48);log(`${p.nome} lascia il lavoro per stare con ${G.gem?'i bambini':'il bambino'}.`,'h')}
    }
    return;
  }
  if(S.provano){
    const p=S.relazioni.find(x=>x.id===S.provano.pid);
    const c=p&&p.vivo&&(p.ruolo==='Coniuge'||(p.ruolo==='Partner'&&p.conv))?coppiaFertile(p):null;
    if(!c){S.provano=null;return}
    if(chance(fertilitaMese(c.donna,c.uomo)))return concepisci(p);
    const da=S.t-S.provano.t0;
    if(da===12)log('È un anno che ci provate. Il medico vi parla di esami e di procreazione assistita.','h');
    if(da>=48){S.provano=null;log('Dopo quattro anni smettete di provarci. Ognuno lo vive a modo suo.','h');pesa(6,3)}
  }
}

/* ---------- Adozione (legge 184/1983): coniugi sposati da almeno 3 anni, differenza d'età tra 18 e 45 anni (fino a 55 per uno dei due) ---------- */
function puoAdottare(p){
  if(!p||p.ruolo!=='Coniuge'||!p.vivo||S.sesso===p.sesso)return 'Possono adottare solo i coniugi sposati (di sesso diverso)';
  if(S.adozione)return 'C\'è già una domanda in corso';
  if(S.t-(p.nozze!==undefined?p.nozze:-999)<36)return 'Servono almeno 3 anni di matrimonio';
  if(Math.min(S.eta,p.eta)>55)return 'La differenza d\'età con il bambino sarebbe troppa';
  return '';
}
function avviaAdozione(p){
  const no=puoAdottare(p);if(no)return [no+'.','x'];
  showSheet({k:'Adozione',t:'Che percorso scegliete?',p:'Prima c\'è la domanda al Tribunale per i minorenni: colloqui con i servizi sociali e, se va bene, il decreto di idoneità.',chiudi:true,scelte:[
    {l:'Adozione nazionale',sub:'Gratuita, ma i bambini adottabili sono pochi: si aspetta anni, e non sempre arriva',_incl:0,fx:()=>{
      S.adozione={pid:p.id,tipo:'naz',t0:S.t};const ok=chance(.35);
      S.futuri.push({t:S.t+(ok?r(24,48):48),id:ok?'adozione_arriva':'adozione_niente',pid:p.id});
      return ['Presentate la domanda. Ora si aspetta.','']}},
    {l:'Adozione internazionale',sub:`Con un ente autorizzato · circa ${eur(P(20000))} tra pratiche e viaggi`,costo:P(20000),_incl:0,fx:()=>{
      S.adozione={pid:p.id,tipo:'int',t0:S.t};const ok=chance(.75);
      S.futuri.push({t:S.t+(ok?r(24,42):42),id:ok?'adozione_arriva':'adozione_niente',pid:p.id});
      return ['Scegliete un ente e iniziate le pratiche. Ci vorranno anni.','']}}]});
  return KEEP;
}

/* ---------- Separazione e divorzio ----------
   Prima la separazione (si vive divisi subito), poi il divorzio: dopo 6 mesi se consensuale, 12 se giudiziale (legge 55/2015).
   Comunione dei beni (il regime di partenza per legge): metà di quanto risparmiato durante il matrimonio va all'altro. */
function divorzia(p){
  const giud=(p.rancore||0)>50||chance(.2);
  const avv=P(giud?r(6000,15000):r(1500,3000));
  const base=p.soldiNozze!==undefined?p.soldiNozze:Math.round(S.soldi*.2);
  const quota=Math.max(0,Math.round((S.soldi-avv-base)*.5));
  soldi(-avv-quota);
  p.ruolo='Ex';p.conv=false;p.exConiuge=true;S.fatti.fineCoppiaT=S.t;mod('felicita',-12);segnaVita('divorzio');pesa(16,6);rimuoviSuoceri(p);if(chance(.3))p.rancore=r(40,70);
  S.fatti.separazione={pid:p.id,fino:S.t+(giud?12:6)};
  futuro(giud?1:.5,'divorzio_definitivo',{p});
  const minori=vivi(['Figlio']).filter(f=>f.eta<18&&!f.conEx);
  minori.forEach(f=>f.rapporto=clamp(f.rapporto-10));
  if(minori.length)coda.unshift({e:EV.affido,d:{p}});
  return [`Tu e ${p.nome} vi separate${giud?' davanti al giudice':' di comune accordo'}. Avvocati: ${eur(avv)}${quota?`; con la divisione dei risparmi del matrimonio vanno a ${p.nome} altri ${eur(quota)}`:''}. Il divorzio arriverà tra ${giud?'un anno':'sei mesi'}.`,'b'];
}
const inSeparazione=()=>!!(S.fatti.separazione&&S.fatti.separazione.fino>S.t);
/* L'assegno di mantenimento per i figli (circa 250 € al mese per figlio, indicativo) finché non hanno 21 anni */
function mantenimento(pid,figli,segno){S.mantenimento=(S.mantenimento||[]).filter(m=>m.pid!==pid);S.mantenimento.push({pid,figli:figli.map(f=>f.id),segno,annuo:3000})}
function voceMantenimento(add){
  if(!S.mantenimento)return;
  S.mantenimento=S.mantenimento.filter(m=>m.figli.some(id=>{const f=S.relazioni.find(x=>x.id===id);return f&&f.vivo&&f.eta<21}));
  for(const m of S.mantenimento){const n=m.figli.filter(id=>{const f=S.relazioni.find(x=>x.id===id);return f&&f.vivo&&f.eta<21}).length;
    if(n)add(m.segno>0?`Mantenimento ricevuto per i figli (${n})`:`Mantenimento versato per i figli (${n})`,m.segno*P(m.annuo)*n)}
}

/* ---------- Le persone del gioco: orientamento e coppie ---------- */
/* Distribuzione indicativa (nessun dato ISTAT recente affidabile): la maggioranza etero, pochi omosessuali e bisessuali */
function orientNpc(p){if(!p.orient)p.orient=pesata([['etero',94],['omo',3],['bi',3]]);return p.orient}
function sessoCompagnoNpc(p){const o=orientNpc(p),altro=p.sesso==='F'?'M':'F';return o==='omo'?p.sesso:o==='bi'&&chance(.3)?p.sesso:altro}
const coppiaStessoSesso=p=>!!p.pSesso&&p.pSesso===p.sesso;
