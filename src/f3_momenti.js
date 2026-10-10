/* ================= MOMENTI CHIAVE E FILM DELLA VITA (ROADMAP, Fase 1.5) =================
   momento(tipo,o) registra i passaggi importanti in S.momenti. Laurea, primo lavoro, matrimonio, nascita di un figlio
   e pensione si aprono anche a tutto schermo (come la nascita: un simbolo che si anima, i volti, una frase), appena
   si chiude il foglio dell'evento. Diploma, prima casa e primo nipote si registrano in silenzio: servono al film.
   Alla morte parte «il film della tua vita»: i momenti uno dopo l'altro, con il tuo volto che invecchia.
   Nei test automatici (navigator.webdriver) non si apre niente; per vederli: dist/vitamia.html?anim=1. */
let momentiDaMostrare=[];
const animMomenti=()=>!navigator.webdriver||/[?&]anim(=|&|$)/.test(location.search);
const MOM={
  laurea:{k:'Laurea'},lavoro:{k:'Il primo lavoro'},matrimonio:{k:'Un sì'},figlio:{k:'Una nascita'},pensione:{k:'La pensione'},
  diploma:{k:'Diploma',muto:1},casa:{k:'Casa tua',muto:1},nipote:{k:'Un nipote',muto:1},sogno:{k:'Un sogno',muto:1},nascita:{k:'La nascita',muto:1},fine:{k:'Fine',muto:1}
};
function momento(tipo,o){
  if(!S||!MOM[tipo])return;
  const m=Object.assign({tipo,t:S.t,anno:S.anno,mese:S.mese,eta:S.eta,citta:S.citta},o||{});
  S.momenti=S.momenti||[];S.momenti.push(m);if(S.momenti.length>40)S.momenti.splice(1,1);
  if(!MOM[tipo].muto&&animMomenti())momentiDaMostrare.push(m);
}
/* simboli disegnati a linea, con i colori del tema */
const EMBLEMA={
  laurea:'<svg viewBox="0 0 120 96" aria-hidden="true"><path class="em-a" d="M60 16 112 38 60 60 8 38Z" fill="var(--ink)"/><path class="em-b" d="M30 48v18c0 9 60 9 60 0V48L60 60Z" fill="var(--ink)" opacity=".8"/><path class="em-c" d="M104 42v24" stroke="var(--felicita)" stroke-width="4" stroke-linecap="round"/><circle class="em-c" cx="104" cy="70" r="6" fill="var(--felicita)"/></svg>',
  lavoro:'<svg viewBox="0 0 120 96" aria-hidden="true"><path class="em-a" d="M60 6 46 30M60 6l14 24" stroke="var(--muted)" stroke-width="3" fill="none" stroke-linecap="round"/><rect class="em-b" x="30" y="28" width="60" height="62" rx="9" fill="var(--surface)" stroke="var(--accent)" stroke-width="4"/><circle class="em-c" cx="60" cy="52" r="10" fill="var(--felicita)"/><path class="em-c" d="M44 78c4-9 28-9 32 0" stroke="var(--accent)" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
  matrimonio:'<svg viewBox="0 0 120 96" aria-hidden="true"><circle class="em-r1" cx="48" cy="52" r="24" stroke="var(--felicita)" stroke-width="7" fill="none"/><circle class="em-r2" cx="74" cy="52" r="24" stroke="var(--accent)" stroke-width="7" fill="none"/><path class="em-c" d="M48 22l6-8 6 8-6 6z" fill="var(--felicita)"/></svg>',
  figlio:'<svg viewBox="0 0 120 96" aria-hidden="true"><circle class="em-batt" cx="60" cy="48" r="18" fill="var(--felicita)"/></svg>',
  pensione:'<svg viewBox="0 0 120 96" aria-hidden="true"><circle class="em-sole" cx="60" cy="66" r="26" fill="var(--felicita)"/><rect x="0" y="66" width="120" height="30" fill="var(--bg)"/><path class="em-a" d="M14 70h92M30 80h60M46 90h28" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/></svg>',
  diploma:'<svg viewBox="0 0 120 96" aria-hidden="true"><rect x="22" y="30" width="76" height="40" rx="20" fill="var(--surface)" stroke="var(--ink)" stroke-width="4"/><path d="M60 30v40" stroke="var(--aspetto)" stroke-width="5"/></svg>',
  casa:'<svg viewBox="0 0 120 96" aria-hidden="true"><path d="M20 48 60 16l40 32v38H20Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/><rect x="50" y="58" width="20" height="28" fill="var(--felicita)"/></svg>',
  nipote:'<svg viewBox="0 0 120 96" aria-hidden="true"><circle cx="46" cy="50" r="16" fill="var(--felicita)"/><circle cx="76" cy="56" r="10" fill="var(--aspetto)"/></svg>',
  nascita:'<svg viewBox="0 0 120 96" aria-hidden="true"><circle class="em-batt" cx="60" cy="48" r="14" fill="var(--felicita)"/></svg>',
  fine:'<svg viewBox="0 0 120 96" aria-hidden="true"><path d="M60 14v68M38 34h44" stroke="var(--muted)" stroke-width="5" stroke-linecap="round"/></svg>'
};
const coriandoli=()=>`<div class="m-cor" aria-hidden="true">${['--felicita','--accent','--aspetto','--salute','--intel'].map((c,i)=>`<i style="background:var(${c});left:${14+i*17}%;animation-delay:${.15+i*.12}s"></i>`).join('')}</div>`;
function voltiMomento(m){
  const ids=m.pids||[],out=[];
  // il tuo volto all'età di quel momento, poi le persone (con la loro età di allora)
  if(m.tipo!=='figlio'||!ids.length)out.push(volto(lookDi(S),m.eta,S.sesso));
  for(const id of ids){const p=S.relazioni.find(x=>x.id===id);if(p)out.push(volto(lookDi(p),Math.max(0,p.eta-(S.eta-m.eta)),p.sesso))}
  return out.length?`<div class="m-volti">${out.map(v=>`<span>${v}</span>`).join('')}</div>`:'';
}
function htmlMomento(m){
  const quando=`${MESE(m.mese||0)} ${m.anno} · ${m.eta} ${m.eta===1?'anno':'anni'}${m.citta?' · '+esc(m.citta):''}`;
  return `<div class="m-box">${['laurea','matrimonio','figlio'].includes(m.tipo)?coriandoli():''}
    <div class="m-emb">${EMBLEMA[m.tipo]||''}</div>${voltiMomento(m)}
    <p class="m-k">${esc(MOM[m.tipo].k)}</p><h2>${esc(m.tit||'')}</h2>${m.sub?`<p class="m-sub">${esc(m.sub)}</p>`:''}${m.txt?`<p class="m-txt">${esc(m.txt)}</p>`:''}
    <p class="m-quando">${quando}</p><button class="btn m-btn">Continua</button></div>`;
}
function mostraMomento(){
  const m=momentiDaMostrare.shift();if(!m||!S||!S.vivo){momentiDaMostrare=[];return}
  const ov=document.createElement('div');ov.className='momento m-'+m.tipo;ov.setAttribute('role','dialog');ov.innerHTML=htmlMomento(m);
  document.body.appendChild(ov);
  const b=ov.querySelector('.m-btn');setTimeout(()=>b.focus({preventScroll:true}),400);
  b.onclick=()=>{ov.classList.add('via');setTimeout(()=>{ov.remove();if(momentiDaMostrare.length)mostraMomento()},350)};
}

/* ---------- Il film della vita ---------- */
function scenaFilm(m){
  const fine=m.tipo==='fine';
  return `<div class="f-scena${fine?' f-fine':''}"><div class="f-anno">${m.anno}</div><div class="f-eta">${m.eta} ${m.eta===1?'anno':'anni'}</div>
    <div class="f-volto">${volto(lookDi(S),m.eta,S.sesso)}</div>
    <h3>${esc(m.tit||MOM[m.tipo].k)}</h3>${m.sub?`<p>${esc(m.sub)}</p>`:''}</div>`;
}
function scenePerFilm(conFine){
  const nasc={tipo:'nascita',anno:S.annoNascita,mese:S.meseNascita,eta:0,tit:`Nasci a ${S.fatti.cittaNascita||S.citta}`,sub:S.giornoNascita?`${S.giornoNascita} ${MESI[S.meseNascita]} ${S.annoNascita}`:''};
  const L=[nasc].concat((S.momenti||[]).filter(m=>m.tipo!=='nascita'));
  if(conFine)L.push({tipo:'fine',anno:S.anno,eta:S.eta,tit:`${S.nome} ${S.cognome}`,sub:`${S.annoNascita} – ${S.anno}. Si è ${g('spento','spenta')} ${S.causa}.`});
  return L;
}
function filmVita(conFine){
  const L=scenePerFilm(conFine);if(!L.length)return;
  const ov=document.createElement('div');ov.className='film';ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Il film della tua vita');
  ov.innerHTML=`<p class="f-tit">Il film della tua vita</p><div class="f-schermo" aria-live="polite"></div><div class="f-punti">${L.map(()=>'<i></i>').join('')}</div><div class="f-tasti"><button class="chip" id="fIndietro" aria-label="Scena precedente">‹</button><button class="chip" id="fChiudi">Chiudi</button><button class="chip" id="fAvanti" aria-label="Scena successiva">›</button></div>`;
  document.body.appendChild(ov);
  const sch=ov.querySelector('.f-schermo'),pt=[...ov.querySelectorAll('.f-punti i')];let i=0,timer=null;
  const vai=k=>{i=Math.max(0,Math.min(L.length-1,k));sch.innerHTML=scenaFilm(L[i]);pt.forEach((x,j)=>x.className=j<=i?'on':'');clearTimeout(timer);if(i<L.length-1)timer=setTimeout(()=>vai(i+1),i===0?2600:2300)};
  const chiudi=()=>{clearTimeout(timer);ov.classList.add('via');setTimeout(()=>ov.remove(),350)};
  ov.querySelector('#fAvanti').onclick=()=>vai(i+1);ov.querySelector('#fIndietro').onclick=()=>vai(i-1);ov.querySelector('#fChiudi').onclick=chiudi;
  ov.addEventListener('keydown',e=>{if(e.key==='Escape')chiudi();if(e.key==='ArrowRight')vai(i+1);if(e.key==='ArrowLeft')vai(i-1)});
  vai(0);setTimeout(()=>ov.querySelector('#fChiudi').focus({preventScroll:true}),100);
}
