/* ================= CREAZIONE: il certificato di nascita che si compila dal vivo ================= */
let C=null;   // la bozza della nuova vita (S qui è ancora null: niente g()/gp(), si usa gC)
const gC=(m,f)=>C.ses==='F'?f:m;
const CLASSI=[['umile','Modesta'],['media','Media'],['agiata','Benestante']];
const SEGNI=['urla molto','fissa il soffitto con aria critica','ha già il naso del nonno','dorme solo in braccio','stringe fortissimo il dito di chiunque','starnutisce come un adulto','sembra già annoiat{o}','ha un ciuffo ribelle','sorride nel sonno (dicono sia aria)','ha guardato l\'ostetrica come per giudicarla','mangia ogni tre ore, puntuale come un orologio svizzero','si calma solo con la lavatrice accesa'];
const normTxt=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const annoOggi=()=>new Date().getFullYear();
const giorniMese=(a,m)=>new Date(a,m+1,0).getDate();

/* nomi della generazione giusta: annoN = anno di nascita della persona */
const nomeGen=(ses,annoN)=>pick(nomiPer(ses,annoN));
function nomeNuovo(ses,usati,annoN){const L=nomiPer(ses,annoN);for(let i=0;i<10;i++){const n=pick(L);if(!usati.includes(n))return n}return pick(L)}
/* Età dei fratelli più grandi, con le regole degli invarianti (tools/invarianti.js): almeno 15 mesi tra loro e da te (mesiFratelli),
   la madre aveva almeno 15 anni e il padre almeno 16 alla loro nascita (con i mesi la soglia vera è 14 e 15: qui si resta larghi). */
const maxEtaFr=()=>Math.max(0,Math.min(12,C.fam.madre.eta-15,C.fam.padre.eta-16));
const etaFrOk=ages=>ages.every(a=>a>=1&&a<=maxEtaFr())&&!!mesiFratelli(ages,false);
function fratelloNuovo(){
  const F=C.fam,ok=[];for(let a=1;a<=maxEtaFr();a++)if(etaFrOk(F.fratelli.map(f=>f.eta).concat(a)))ok.push(a);
  if(!ok.length)return null;
  const ses=pick(['M','F']),usati=[C.nome,F.madre.nome,F.padre.nome,...F.fratelli.map(f=>f.nome)],eta=pick(ok);
  return {sesso:ses,nome:nomeNuovo(ses,usati,C.anno-eta),eta};
}
/* dopo aver cambiato l'età di un genitore: ogni fratello va portato a un'età valida (la più vicina), se non ce n'è esce */
function adattaFratelli(){
  const F=C.fam,tenuti=[];
  for(const f of F.fratelli){
    const a0=Math.min(f.eta,maxEtaFr()),prova=a=>etaFrOk(tenuti.map(x=>x.eta).concat(a));let trovata=0;
    for(let k=a0;k>=1&&!trovata;k--)if(prova(k)){f.eta=k;trovata=1}
    for(let k=a0+1;k<=maxEtaFr()&&!trovata;k++)if(prova(k)){f.eta=k;trovata=1}
    if(trovata)tenuti.push(f);
  }
  F.fratelli=tenuti;
}
function famCasuale(){
  const me=r(21,40);
  const F={classe:pesata([['umile',30],['media',55],['agiata',15]]),madre:{nome:nomeGen('F',C.anno-me),cognome:pick(COGNOMI),eta:me,look:lookCasuale('F')},padre:null,fratelli:[]};
  const pe=clamp(me+r(-3,7),20,60);F.padre={nome:nomeGen('M',C.anno-pe),eta:pe,look:lookCasuale('M')};
  C.fam=F;const n=pesata([[0,40],[1,40],[2,15],[3,5]]);
  for(let i=0;i<n&&me>=20;i++){const f=fratelloNuovo();if(!f)break;F.fratelli.push(f)}
}
function noteCasuali(){C.note={ora:`${String(r(0,23)).padStart(2,'0')}:${String(r(0,59)).padStart(2,'0')}`,peso:(r(26,42)/10).toFixed(1).replace('.',','),lung:r(47,54),segno:pick(SEGNI)}}
function bozzaCasuale(){
  const ses=pick(['M','F']),cc=comuneCaso(),a=annoOggi();
  C={ses,nome:nomeGen(ses,a),cognome:pick(COGNOMI),com:cc.n,prov:cc.s,anno:a,mese:new Date().getMonth(),giorno:r(1,28),num:r(120,9800),tab:(C&&C.tab)||'tu',fam:null};
  famCasuale();noteCasuali();C.look=lookFiglio(C.fam.madre.look,C.fam.padre.look,ses);
}
function datiVita(){
  const F=C.fam;
  return {sesso:C.ses,nome:C.nome.trim()||nomeGen(C.ses,C.anno),cognome:C.cognome.trim()||pick(COGNOMI),citta:C.com,prov:C.prov,anno:C.anno,meseN:C.mese,giorno:C.giorno,look:C.look,
    note:C.note,fam:{classe:F.classe,madre:{...F.madre,nome:F.madre.nome.trim()||nomeGen('F',C.anno-F.madre.eta),cognome:F.madre.cognome.trim()||pick(COGNOMI)},padre:{...F.padre,nome:F.padre.nome.trim()||nomeGen('M',C.anno-F.padre.eta)},fratelli:F.fratelli.map(f=>({...f,nome:f.nome.trim()||nomeGen(f.sesso,C.anno-f.eta)}))}};
}

/* ---------- Il certificato ---------- */
function htmlCert(){
  const F=C.fam,pr=PROV[C.prov]||{n:C.prov,r:''};
  const fr=F.fratelli.length?F.fratelli.map(f=>`${esc(f.nome||'…')}, ${f.eta} ${f.eta===1?'anno':'anni'}`).join(' · '):gC('Primogenito','Primogenita');
  const cl={umile:'modesta',media:'della classe media',agiata:'benestante'}[F.classe];
  return `<div class="cert-h"><div><span class="cert-k">Certificato di nascita</span><span class="cert-n">N. ${C.anno} / ${String(C.num).padStart(4,'0')} · Comune di ${esc(C.com)}</span></div>
    <button class="cert-dado" id="btnMescola" aria-label="Rimescola tutto" title="Rimescola tutto">${ICO_DADO}</button></div>
  <div class="cert-main">
    <button class="cert-foto" data-tab="aspetto" aria-label="Modifica l'aspetto">${volto(C.look,0,C.ses)}</button>
    <div class="cert-chi">
      <button class="cert-nome" data-tab="tu">${esc(C.nome||'…')} ${esc(C.cognome||'…')}</button>
      <button class="cert-riga" data-tab="dove">${gC('nato','nata')} il <b>${C.giorno} ${MESI[C.mese]} ${C.anno}</b>, alle ${C.note.ora}<br>a <b>${esc(C.com)}</b> (${esc(C.prov)}), ${esc(pr.r)}</button>
    </div>
  </div>
  <button class="cert-fam" data-tab="famiglia">
    <span class="cert-l">${gC('Figlio','Figlia')} di</span>
    <span class="cert-gens"><span class="cert-gen"><span class="mini">${volto(F.madre.look,F.madre.eta,'F',{sfondo:false})}</span><span><b>${esc(F.madre.nome||'…')} ${esc(F.madre.cognome||'')}</b><small>${F.madre.eta} anni</small></span></span>
    <span class="cert-gen"><span class="mini">${volto(F.padre.look,F.padre.eta,'M',{sfondo:false})}</span><span><b>${esc(F.padre.nome||'…')} ${esc(C.cognome||'')}</b><small>${F.padre.eta} anni</small></span></span></span>
    <span class="cert-l">${F.fratelli.length?(F.fratelli.length===1?(F.fratelli[0].sesso==='M'?'Fratello':'Sorella'):'Fratelli'):'Fratelli'}</span><span class="cert-v">${fr}</span>
    <span class="cert-l">Famiglia</span><span class="cert-v">${cl}</span>
  </button>
  <div class="cert-note">Peso ${C.note.peso} kg · ${C.note.lung} cm · Segni particolari: ${C.note.segno.replace(/\{o\}/g,gC('o','a'))}</div>`;
}
const ICO_DADO='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="8.5" cy="8.5" r="1.3"/><circle cx="15.5" cy="15.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="15.5" cy="8.5" r="1.3"/><circle cx="8.5" cy="15.5" r="1.3"/></svg>';

/* ---------- L'editor sotto il certificato ---------- */
const TAB_C=[['tu','Tu'],['dove','Nascita'],['famiglia','Famiglia'],['aspetto','Aspetto']];
const dadoBtn=(id,t)=>`<button class="dado" id="${id}" aria-label="${t}" title="${t}">${ICO_DADO}</button>`;
const stepper=(id,v,suf)=>`<span class="step"><button class="chip" data-st="${id}" data-d="-1" aria-label="Meno">−</button><b>${v}${suf||''}</b><button class="chip" data-st="${id}" data-d="1" aria-label="Più">+</button></span>`;
function htmlEditor(){
  const F=C.fam;
  if(C.tab==='tu')return `
    <div class="field"><label>Sesso</label><div class="seg"><button data-ses="M" aria-pressed="${C.ses==='M'}">Maschio</button><button data-ses="F" aria-pressed="${C.ses==='F'}">Femmina</button></div></div>
    <div class="field"><label for="iNome">Nome</label><div class="in-d"><input id="iNome" value="${esc(C.nome)}" maxlength="20" autocomplete="off">${dadoBtn('dNome','Un altro nome')}</div></div>
    <div class="field"><label for="iCog">Cognome</label><div class="in-d"><input id="iCog" value="${esc(C.cognome)}" maxlength="20" autocomplete="off">${dadoBtn('dCog','Un altro cognome')}</div></div>`;
  if(C.tab==='dove'){
    const gm=giorniMese(C.anno,C.mese),A=[];for(let a=annoOggi();a>=1950;a--)A.push(a);
    return `
    <div class="field"><label for="iCom">Comune di nascita</label><div class="in-d cerca-com"><input id="iCom" type="search" value="${esc(C.com)} (${esc(C.prov)})" autocomplete="off" placeholder="Scrivi il nome del comune">${dadoBtn('dCom','Un comune a caso')}<div class="sugg" id="sugg" hidden></div></div>
      <div class="note">Uno qualsiasi dei ${nf(comuni().length)} comuni d'Italia.</div></div>
    <div class="field"><label>Data di nascita</label><div class="tre">
      <select id="iG" aria-label="Giorno">${Array.from({length:gm},(_,i)=>`<option ${i+1===C.giorno?'selected':''}>${i+1}</option>`).join('')}</select>
      <select id="iM" aria-label="Mese">${MESI.map((m,i)=>`<option value="${i}" ${i===C.mese?'selected':''}>${m}</option>`).join('')}</select>
      <select id="iA" aria-label="Anno">${A.map(a=>`<option ${a===C.anno?'selected':''}>${a}</option>`).join('')}</select></div>
      <div class="note">Puoi nascere dal 1950 a oggi: fino al 2001 si paga in lire, e ogni epoca ha i suoi fatti e le sue leggi.</div></div>`;
  }
  if(C.tab==='famiglia')return `
    <div class="field"><label>Condizione della famiglia</label><div class="seg tre-seg">${CLASSI.map(([k,n])=>`<button data-cl="${k}" aria-pressed="${F.classe===k}">${n}</button>`).join('')}</div></div>
    <div class="field"><label>Mamma</label><div class="two"><input id="iMN" value="${esc(F.madre.nome)}" maxlength="20" aria-label="Nome della mamma"><input id="iMC" value="${esc(F.madre.cognome)}" maxlength="20" aria-label="Cognome della mamma"></div>
      <div class="rrow"><span class="jm">Età alla tua nascita</span>${stepper('em',F.madre.eta,' anni')}</div></div>
    <div class="field"><label>Papà</label><input id="iPN" value="${esc(F.padre.nome)}" maxlength="20" aria-label="Nome del papà">
      <div class="rrow"><span class="jm">Età alla tua nascita</span>${stepper('ep',F.padre.eta,' anni')}</div></div>
    <div class="field"><label>Fratelli e sorelle più grandi</label><div class="rrow"><span class="jm">${F.fratelli.length?'Quanti (a destra la loro età)':'Nessuno: sei il primo figlio'.replace('il primo figlio',gC('il primo figlio','la prima figlia'))}</span>${stepper('nf',F.fratelli.length)}</div>
      ${F.fratelli.map((f,i)=>`<div class="fr-riga"><input data-frn="${i}" value="${esc(f.nome)}" maxlength="20" aria-label="Nome"><button class="chip" data-frs="${i}">${f.sesso==='M'?'Fratello':'Sorella'}</button>${stepper('fe'+i,f.eta)}</div>`).join('')}${F.fratelli.length?'<div class="note">Tra un fratello e l\'altro, e tra loro e te, passa almeno un anno e tre mesi; le età dipendono anche da quelle dei tuoi genitori.</div>':''}</div>
    <button class="btn ghost" id="dFam">${ICO_DADO} Un'altra famiglia</button>`;
  // aspetto
  const L=C.look;
  const sw=(k,arr,col)=>`<div class="sw-row" role="group">${arr.map((x,i)=>`<button class="sw" data-lk="${k}" data-v="${i}" aria-pressed="${L[k]===i}" aria-label="${col?x[0]:'Tono '+(i+1)}" style="background:${col?x[1]:x}"></button>`).join('')}</div>`;
  return `
    <div class="anteprime">${[[0,'Oggi'],[8,'A 8 anni'],[30,'A 30 anni'],[75,'A 75 anni']].map(([e,t])=>`<figure>${volto(L,e,C.ses)}<figcaption>${t}</figcaption></figure>`).join('')}</div>
    <div class="field"><label>Carnagione</label>${sw('pelle',PELLE)}</div>
    <div class="field"><label>Capelli</label>${sw('capelli',CAPELLI,1)}
      <div class="tags tagli">${TAGLI.map(([k,n])=>`<button class="chip" data-tg="${k}" aria-pressed="${L.taglio===k}">${n}</button>`).join('')}</div></div>
    ${C.ses==='M'?`<div class="field"><label>Da grande</label><div class="tags tagli">${BARBE.map(([k,n])=>`<button class="chip" data-bb="${k}" aria-pressed="${L.barba===k}">${n}</button>`).join('')}</div></div>`:''}
    <div class="field"><label>Occhi</label>${sw('occhi',OCCHI,1)}</div>
    <div class="field"><label>Colore preferito</label>${sw('maglia',MAGLIE)}</div>
    <button class="btn ghost" id="dLook">${ICO_DADO} Somiglia ai genitori</button>`;
}

function renderCrea(V){
  if(!C)bozzaCasuale();
  V.innerHTML=`<div class="crea">
    <div class="crea-top">${logoSvg()}<span class="sr">my</span><div class="crea-top-b">
      ${SALVA.cloud?`<button class="chip" id="btnRiprendi">Riprendi ${esc(SALVA.cloud.nome)}, ${SALVA.cloud.eta} anni</button>`:''}
      <button class="chip" id="btnCarica">Carica partita</button></div></div>
    <p class="crea-motto">Una vita intera, mese per mese. Compila il tuo certificato di nascita, o lascia fare al caso.</p>
    <section class="cert" id="cert" aria-label="Certificato di nascita"></section>
    <div class="ed"><div class="ed-tabs" role="tablist">${TAB_C.map(([k,n])=>`<button role="tab" data-et="${k}">${n}</button>`).join('')}</div><div class="ed-p" id="edP"></div></div>
    <div class="crea-cta"><button class="btn" id="btnNasci">Nasci</button><button class="btn ghost" id="btnRnd">${ICO_DADO} Vita a caso</button></div>
  </div>`;
  const brp=$('#btnRiprendi');if(brp)brp.onclick=riprendiOnline;
  $('#btnCarica').onclick=()=>showSheet({meta:1,k:'Carica una partita',t:'Da dove la prendi?',p:'Scegli il file che avevi scaricato, oppure incolla il codice che avevi copiato.',chiudi:true,scelte:[{l:'Scegli il file di salvataggio',_incl:0,fx:()=>{caricaFile();return null}},{l:'Incolla un codice',_incl:0,fx:()=>{incollaCodice();return KEEP}}]});
  V.querySelectorAll('[data-et]').forEach(b=>b.onclick=()=>{C.tab=b.dataset.et;disegnaEd()});
  $('#btnNasci').onclick=()=>nasci(datiVita());
  $('#btnRnd').onclick=()=>{bozzaCasuale();disegnaCert();disegnaEd();nasci(datiVita())};
  disegnaCert();disegnaEd();
}
function disegnaCert(){
  const el=$('#cert');if(!el)return;el.innerHTML=htmlCert();
  el.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{C.tab=b.dataset.tab;disegnaEd();$('.ed').scrollIntoView({behavior:'smooth',block:'nearest'})});
  $('#btnMescola').onclick=e=>{e.stopPropagation();bozzaCasuale();disegnaCert();disegnaEd()};
}
function disegnaEd(){
  const P=$('#edP');if(!P)return;P.innerHTML=htmlEditor();
  document.querySelectorAll('[data-et]').forEach(b=>b.setAttribute('aria-selected',b.dataset.et===C.tab));
  const F=C.fam,su=()=>disegnaCert(),tutto=()=>{disegnaCert();disegnaEd()};
  const on=(sel,ev,fn)=>{const el=P.querySelector(sel);if(el)el[ev]=fn};
  // Tu
  P.querySelectorAll('[data-ses]').forEach(b=>b.onclick=()=>{if(C.ses===b.dataset.ses)return;C.ses=b.dataset.ses;C.nome=nomeNuovo(C.ses,[]);const t=lookCasuale(C.ses);C.look.taglio=t.taglio;C.look.barba=t.barba;tutto()});
  on('#iNome','oninput',e=>{C.nome=e.target.value;su()});on('#iCog','oninput',e=>{C.cognome=e.target.value;su()});
  on('#dNome','onclick',()=>{C.nome=nomeNuovo(C.ses,[C.nome]);tutto()});on('#dCog','onclick',()=>{C.cognome=pick(COGNOMI);tutto()});
  // Quando e dove
  const I=P.querySelector('#iCom'),SG=P.querySelector('#sugg');
  if(I){
    I.onfocus=()=>I.select();
    I.oninput=()=>{const q=normTxt(I.value.replace(/\s*\(.*$/,'').trim());if(q.length<2){SG.hidden=true;return}
      const L=comuni(),a=[],b=[];for(const c of L){const n=normTxt(c.n);if(n.startsWith(q))a.push(c);else if(b.length<20&&n.includes(q))b.push(c);if(a.length>=6)break}
      const R=[...a.sort((x,y)=>y.p-x.p),...b].slice(0,6);
      SG.innerHTML=R.length?R.map((c,i)=>`<button data-i="${i}">${esc(c.n)} <small>${esc((PROV[c.s]||{}).n||c.s)} · ${esc((PROV[c.s]||{}).r||'')}</small></button>`).join(''):'<div class="note">Nessun comune con questo nome.</div>';SG.hidden=false;
      SG.querySelectorAll('[data-i]').forEach(x=>x.onclick=()=>{const c=R[+x.dataset.i];C.com=c.n;C.prov=c.s;tutto()})};
    I.onkeydown=e=>{if(e.key==='Enter'){const f=SG.querySelector('[data-i]');if(f)f.click()}};
  }
  on('#dCom','onclick',()=>{const c=comuneCaso();C.com=c.n;C.prov=c.s;tutto()});
  const dt=()=>{C.giorno=Math.min(C.giorno,giorniMese(C.anno,C.mese));tutto()};
  on('#iG','onchange',e=>{C.giorno=+e.target.value;su()});on('#iM','onchange',e=>{C.mese=+e.target.value;dt()});on('#iA','onchange',e=>{C.anno=+e.target.value;dt()});
  // Famiglia
  P.querySelectorAll('[data-cl]').forEach(b=>b.onclick=()=>{F.classe=b.dataset.cl;tutto()});
  on('#iMN','oninput',e=>{F.madre.nome=e.target.value;su()});on('#iMC','oninput',e=>{F.madre.cognome=e.target.value;su()});on('#iPN','oninput',e=>{F.padre.nome=e.target.value;su()});
  P.querySelectorAll('[data-frn]').forEach(x=>x.oninput=()=>{F.fratelli[+x.dataset.frn].nome=x.value;su()});
  P.querySelectorAll('[data-frs]').forEach(x=>x.onclick=()=>{const f=F.fratelli[+x.dataset.frs];f.sesso=f.sesso==='M'?'F':'M';f.nome=nomeNuovo(f.sesso,[]);tutto()});
  P.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.st,d=+b.dataset.d;
    if(id==='em'){F.madre.eta=clamp(F.madre.eta+d,18,46);adattaFratelli()}
    else if(id==='ep'){F.padre.eta=clamp(F.padre.eta+d,18,65);adattaFratelli()}
    else if(id==='nf'){if(d>0&&F.fratelli.length<4){const f=fratelloNuovo();if(f)F.fratelli.push(f)}if(d<0)F.fratelli.pop()}
    else if(id.startsWith('fe')){   // salta le età non valide (già prese da un altro fratello o troppo vicine)
      const i=+id.slice(2),f=F.fratelli[i],altri=F.fratelli.filter((_,j)=>j!==i).map(x=>x.eta);
      for(let a=f.eta+d;a>=1&&a<=maxEtaFr();a+=d)if(etaFrOk(altri.concat(a))){f.eta=a;break}}
    tutto()});
  on('#dFam','onclick',()=>{famCasuale();C.look=lookFiglio(F.madre.look,F.padre.look,C.ses);tutto()});
  // Aspetto
  P.querySelectorAll('[data-lk]').forEach(b=>b.onclick=()=>{C.look[b.dataset.lk]=+b.dataset.v;tutto()});
  P.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>{C.look.taglio=b.dataset.tg;tutto()});
  P.querySelectorAll('[data-bb]').forEach(b=>b.onclick=()=>{C.look.barba=b.dataset.bb;tutto()});
  on('#dLook','onclick',()=>{const m=C.look.maglia;C.look=lookFiglio(C.fam.madre.look,C.fam.padre.look,C.ses);C.look.maglia=m;tutto()});
}

/* ---------- «Nasci»: timbro, battito, presentazione ---------- */
function nasci(o){
  const anim=!navigator.webdriver||/[?&]anim(=|&|$)/.test(location.search);
  C=null;
  if(!anim){nuovaVita(o);return}
  const cert=$('#cert');
  if(cert){
    const d=`${o.giorno} ${MESI[o.meseN].slice(0,3)} ${o.anno}`.toUpperCase();
    cert.insertAdjacentHTML('beforeend',`<div class="timbro" aria-hidden="true"><b>${o.sesso==='F'?'NATA':'NATO'}</b><span>${esc(d)}</span><span>${esc(o.citta.toUpperCase().slice(0,22))}</span></div>`);
    cert.classList.add('timbrato');
  }
  document.querySelectorAll('#btnNasci,#btnRnd').forEach(b=>b.disabled=true);
  const ov=document.createElement('div');ov.className='nascita';ov.id='nascita';ov.innerHTML='<div class="n-dot"></div><div class="benv" id="benv"></div>';
  setTimeout(()=>{
    document.body.appendChild(ov);
    setTimeout(()=>{nuovaVita(o);$('#benv').innerHTML=htmlBenvenuto();$('#btnInizia').onclick=()=>{ov.classList.add('via');setTimeout(()=>ov.remove(),400)}},700);
    setTimeout(()=>ov.classList.add('apri'),1450);
  },cert?650:0);
}
function htmlBenvenuto(){
  const ma=vivi(['Madre'])[0],pa=vivi(['Padre'])[0],fr=vivi(['Fratello']);
  const fam=[[ma,'mamma'],[pa,'papà'],...fr.map(f=>[f,gp(f,'fratello','sorella')])].filter(x=>x[0]);
  // somiglianze raggruppate per genitore: «gli occhi e i capelli di tua madre»
  const L=lookDi(S),da={madre:[],padre:[]};
  const chi=k=>ma&&ma.look&&ma.look[k]===L[k]?'madre':pa&&pa.look&&pa.look[k]===L[k]?'padre':null;
  const co=chi('occhi'),cc=chi('capelli');if(co)da[co].push('gli occhi');if(cc)da[cc].push('i capelli');
  const parti=[['madre','tua madre'],['padre','tuo padre']].filter(([k])=>da[k].length).map(([k,n])=>`${da[k].join(' e ')} di ${n}`);
  const car=ma&&pa?(B5.reduce((s,b)=>s+Math.abs(S.pers[b.k]-ma.pers[b.k]),0)<B5.reduce((s,b)=>s+Math.abs(S.pers[b.k]-pa.pers[b.k]),0)?'tua madre':'tuo padre'):null;
  const somiglia=parti.length?`Hai ${parti.join(', ')}${car?` e, dicono, il carattere di ${car}`:''}.`:`Non somigli a nessuno dei due. La nonna giura che sei identic${g('o','a')} allo zio.`;
  const cl={umile:'Una famiglia dalle condizioni modeste.',media:'Una famiglia della classe media.',agiata:'Una famiglia benestante.'}[S.classe];
  return `<div class="benv-foto">${volto(L,0,S.sesso)}</div>
    <p class="benv-k">${S.giornoNascita} ${MESI[S.meseNascita]} ${S.annoNascita} · ${esc(S.citta)}</p>
    <h2>Benvenut${g('o','a')} al mondo,<br>${esc(S.nome)}.</h2>
    <p class="benv-p">${esc(somiglia)}</p>
    <div class="benv-sec">La tua famiglia</div>
    <div class="benv-fam">${fam.map(([p,r])=>`<figure>${volto(lookDi(p),p.eta,p.sesso)}<figcaption><b>${esc(p.nome)}</b>${r}, ${p.eta}</figcaption></figure>`).join('')}</div>
    <p class="benv-p muted">${cl}</p>
    <div class="benv-sec">Il tuo carattere</div>
    <div class="tags">${aggettivi(S.pers,S.sesso,3).map(a=>`<span class="tag">${esc(a)}</span>`).join('')||'<span class="tag">equilibrat'+g('o','a')+'</span>'}</div>
    <p class="benv-p muted">Lo scoprirai crescendo: cambierà con quello che vivrai.</p>
    <button class="btn" id="btnInizia">Inizia a vivere</button>`;
}
