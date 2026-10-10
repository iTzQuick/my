/* ================= INTERFACCIA ================= */
let soloDisponibili=false;
function toast(t){const el=$('#toast');el.textContent=t;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,3200)}
function hue(str){let h=0;for(const c of str)h=(h*31+c.charCodeAt(0))%360;return h}
function bar(v,col){return `<span class="bar"><i style="width:${clamp(v)}%;background:var(${col})"></i></span>`}
function kv(a,b,cls){return `<div class="kv"><span>${a}</span><b${cls?` class="${cls}"`:''}>${b}</b></div>`}

/* ---------- Foglio ---------- */
function showSheet(o){
  sheetOpen=true;$('#scrim').hidden=false;
  const d=o.d||{};
  $('#shK').textContent=o.k||'';$('#shT').textContent=o.t||'';
  const V0=$('#shV');if(V0){const fp=d.p&&d.p.vivo&&d.p.id&&d.p.nome?d.p:null,fc=!fp&&d.cand&&d.cand.look?d.cand:null;
    V0.innerHTML=fp?volto(lookDi(fp),fp.eta,fp.sesso):fc?volto(fc.look,fc.eta,fc.sesso):'';V0.hidden=!fp&&!fc}
  const P=$('#shP');P.textContent=prezzi(o.p)||'';P.className='';P.hidden=!o.p;
  const A=$('#shA');A.innerHTML='';
  let sc=(o.scelte||[]).filter(c=>!c.cond||c.cond(d));
  // niente scelte fuori epoca (telefonini nel 1970, euro nel 1990…), purché ne resti almeno una
  if(S&&S.vivo&&!o.meta){const ok=sc.filter(c=>annoScelta(c)<=S.anno&&!fuoriEpoca(typeof c.l==='function'?T(c.l,d):''));if(ok.length)sc=ok}
  let attivi=0;
  const clic=c=>{
    const res=o.d?conCausa(o.t,()=>scegli(c,d)):scegli(c,d);
    if(res===KEEP)return;
    if(res===null){next();return}
    if(res&&res[0]&&res[1]!=='x')log(res[0],res[1]);
    save();risultato(res||['','']);
  };
  if(o.cerca){
    const w=document.createElement('div');w.className='cerca';
    w.innerHTML=`<input id="shQ" type="search" class="search-in" placeholder="${esc(o.cerca.ph)}" autocomplete="off" aria-label="Cerca"><div class="opts" id="shR"></div>`;
    A.appendChild(w);
    const I=w.querySelector('#shQ'),Rr=w.querySelector('#shR');
    const draw=()=>{Rr.innerHTML='';const L=o.cerca.trova(I.value);if(!L.length)Rr.innerHTML='<div class="note">Nessun risultato.</div>';L.forEach(c=>{const b=document.createElement('button');b.className='opt';b.innerHTML=esc(c.l)+(c.sub?`<small>${esc(c.sub)}</small>`:'');b.onclick=()=>clic(c);Rr.appendChild(b)})};
    I.oninput=draw;draw();attivi++;
  }
  sc.forEach(c=>{
    const b=document.createElement('button');b.className='opt';
    const lab=prezzi(T(c.l,d)),cs=costoScelta(c,d);const sub=c.sub!==undefined?prezzi(T(c.sub,d)):(cs?eur(cs):'');
    const povero=cs&&S.soldi<cs;
    const inc=etichettaIncl(Object.assign({},c,{l:lab,sub:sub}));
    b.innerHTML=esc(lab)+(inc?` <em class="incl${inc==='da te'?' ok':''}">${inc}</em>`:'')+(sub||povero?`<small>${esc(sub)}${povero?(sub?' · ':'')+'non hai abbastanza soldi':''}</small>`:'');
    b.disabled=!!c.disabled||!!povero;if(!b.disabled)attivi++;
    b.onclick=()=>clic(c);
    A.appendChild(b);
  });
  if(o.chiudi||!attivi){const b=document.createElement('button');b.className='opt close';b.textContent=attivi?'Chiudi':'Continua';b.onclick=()=>next();A.appendChild(b)}
  $('.sheet').scrollTop=0;
  if(!o.cerca)setTimeout(()=>{const f=A.querySelector('button:not(:disabled)');f&&f.focus({preventScroll:true})},30);
}
function risultato(res){
  if(!res[0]){next();return}
  const P=$('#shP');P.textContent=prezzi(res[0]);P.className=res[1]==='x'?'':(res[1]||'');P.hidden=false;
  const A=$('#shA');A.innerHTML='';
  const b=document.createElement('button');b.className='btn';b.textContent='Continua';b.onclick=()=>next();A.appendChild(b);
  b.focus({preventScroll:true});
  render();
}
function next(){
  if(coda.length&&S&&S.vivo){
    const q=coda.shift(),e=q.e,d=q.d||{};
    if(d.p&&!d.p.vivo)return next();
    if(e.cond&&!d._fut&&e.id!=='processo'&&!e.cond(d))return next();
    const scelte=typeof e.c==='function'?e.c(d):(e.c||[]);
    if(!e.link&&(fuoriEpoca(T(e.t,d))||fuoriEpoca(T(e.x,d))))return next();   // un evento casuale fuori epoca si salta
    showSheet({k:`${dataStr()} · ${S.eta} ${S.eta===1?'anno':'anni'}`+(e.k?' · '+T(e.k,d):''),t:T(e.t,d),p:T(e.x,d),scelte,d});
    return;
  }
  sheetOpen=false;$('#scrim').hidden=true;render();
  if(momentiDaMostrare.length&&S&&S.vivo)mostraMomento();
}

/* ---------- Testata ---------- */
function occupazione(){
  if(!S.vivo)return '—';
  if(S.carcere>0)return `Detenut${g('o','a')}`;
  const sc=S.scuola;
  if(S.lavoro)return S.lavoro.nome;
  const st={universita:g('Universitario','Universitaria'),magistrale:g('Universitario','Universitaria'),dottorato:`Dottorand${g('o','a')}`,master:g('Studente','Studentessa')+' di master',its:g('Studente','Studentessa')+' ITS',spec:`Specializzand${g('o','a')}`,serale:g('Studente serale','Studentessa serale'),superiori:g('Studente','Studentessa'),elementari:g('Alunno','Alunna'),medie:g('Alunno','Alunna'),asilo:'Scuola dell\'infanzia'}[sc.stato];
  if(st)return st;
  if(S.eta<3)return 'In fasce';
  if(S.pensione)return g('Pensionato','Pensionata');
  if(S.azienda)return g('Imprenditore','Imprenditrice');
  if(S.social.follower>=50000)return 'Influencer';
  return S.eta<18?'Nessuna':g('Disoccupato','Disoccupata');
}
function renderTop(){
  const T0=$('#top');
  if(!S){T0.innerHTML='';return}
  const h=hue(S.nome+S.cognome);
  const stat=(l,k,c)=>`<div class="stat"><div class="stat-top"><span class="stat-l">${l}</span><span class="stat-v">${S[k]}</span></div>${bar(S[k],c)}</div>`;
  T0.innerHTML=`<div class="idcard">
    <div class="id-head"><span>CARTA DI VITA · GEN. ${S.gen}</span><span class="id-btns"><button id="btnSalva">Salva</button><button id="btnNuova">Nuova vita</button></span></div>
    <div class="id-body">
      <button class="avatar con-volto" id="btnCarattere" title="Il tuo carattere" aria-label="Il tuo carattere">${volto(lookDi(S),S.eta,S.sesso)}</button>
      <div class="id-main">
        <p class="id-name">${esc(S.nome)} ${esc(S.cognome)}</p>
        <div class="id-grid">
          <div class="id-f"><span class="l">Età · data</span><span class="v">${S.eta} ${S.eta===1?'anno':'anni'} · ${MESE(S.mese).slice(0,3).toLowerCase()} ${S.anno}</span></div>
          <div class="id-f"><span class="l">Residenza</span><span class="v">${esc(nomeLuogo(S.citta,S.prov))}</span></div>
          <div class="id-f"><span class="l">Occupazione</span><span class="v">${esc(occupazione())}</span></div>
          <div class="id-f"><span class="l">Conto</span><span class="v${S.soldi<0?' neg':''}">${eur(S.soldi)}</span></div>
        </div>
      </div>
    </div></div>
    <div class="stats${S.fama>0?' cinque':''}">${stat('Salute','salute','--salute')}${stat('Felicità','felicita','--felicita')}${stat(S.fama>0?'Intell.':'Intelletto','intelligenza','--intel')}${stat('Aspetto','aspetto','--aspetto')}${S.fama>0?stat('Fama','fama','--accent'):''}</div>`;
  $('#btnCarattere').onclick=mostraCarattere;
  $('#btnSalva').onclick=apriSalvataggi;
  $('#btnNuova').onclick=()=>showSheet({meta:1,k:'Nuova vita',t:'Vuoi ricominciare?',p:S.vivo?'La vita attuale andrà persa.':'Inizi una vita completamente nuova.',chiudi:true,scelte:[{l:'Sì, ricomincia da zero',fx:()=>{S=null;coda=[];save();sheetOpen=false;$('#scrim').hidden=true;render();return KEEP}}]});
}

/* ---------- Vita ---------- */
function statoTags(){
  const t=[];
  if(S.carcere>0)t.push(['In carcere: '+S.carcere+(S.carcere===1?' anno':' anni'),1]);
  if(S.latitante)t.push(['Latitante',1]);
  if(S.fedina.length)t.push(['Fedina penale sporca',1]);
  if(S.dip.fumo)t.push([g('Fumatore','Fumatrice'),1]);
  if(S.dip.alcol)t.push(['Problema con l\'alcol',1]);
  if(S.dip.gioco)t.push(['Dipendenza dal gioco',1]);
  S.malattie.forEach(m=>t.push([m.n,1]));
  if(S.crim.clan)t.push([`${cap(GRADI_CLAN[S.crim.clan.grado])} nel clan`,1]);
  if(S.patente)t.push(['Patente B',0]);
  return t;
}
function needBar(l,v,col,inv){const c=inv?(v>=70?'--bad':v>=45?'--felicita':'--salute'):(v<30?'--bad':v<55?'--felicita':col);return `<div class="need"><div class="stat-top"><span class="stat-l">${l}</span><span class="stat-v">${Math.round(v)}</span></div>${bar(v,c)}</div>`}
function renderVita(V){
  const tags=statoTags(),M=S.mondo,B=S.bis;
  const st=[];if(M.crisi)st.push('Crisi economica');if(M.boom)st.push('Boom economico');if(M.pandemia)st.push('Pandemia');if(M.bolla)st.push('Bolla immobiliare');
  const ult=M.notizie.slice(-2).reverse();
  const ora=`<div class="ora"><div class="mondo-h"><span>${dataStr()}</span><span>${S.fatti.ultimoMese!==undefined&&S.eta>=18?`Ultimo mese ${S.fatti.ultimoMese>=0?'+':''}${eur(S.fatti.ultimoMese)}`:''}</span></div>
    <div class="frase">${esc(umoreFrase())}</div>
    ${!SALVA.locale&&!SALVA.db?`<div class="avviso">Questo browser non conserva la partita: se chiudi la pagina la perdi. <button class="chip" id="btnAvvSalva">Salvala</button></div>`:''}
    ${S.eta>=3?`<div class="needs">${needBar('Energia',B.energia,'--salute')}${needBar('Stress',B.stress,'',1)}${needBar('Socialità',B.soc,'--aspetto')}${needBar('Forma',B.forma,'--intel')}</div>`:''}
    <div class="row-btns"><button class="chip" id="btnCar">Carattere: ${esc(descrPers(S.pers,S.sesso))}</button>${S.eta>=6&&S.carcere===0?'<button class="chip" id="btnSett">La tua settimana</button>':''}${(S.momenti||[]).length?`<button class="chip" id="btnMom">I tuoi momenti (${S.momenti.length})</button>`:''}</div>
    <div class="row-btns ff"><span class="meta">Avanti veloce</span><button class="chip" data-ff="3">3 mesi</button><button class="chip" data-ff="6">6 mesi</button><button class="chip" data-ff="12">1 anno</button></div></div>`;
  const mondo=`<div class="mondo"><div class="mondo-h"><span>Il mondo · ${S.anno}</span><span>Inflazione ${(M.infl*100).toFixed(1).replace('.',',')}% · prezzi ×${M.ip.toFixed(2).replace('.',',')}</span></div>${st.length?`<div class="tags">${st.map(x=>`<span class="tag bad">${x}</span>`).join('')}</div>`:''}${ult.map(n=>`<div class="news"><b>${n.anno}</b> ${esc(n.t)}</div>`).join('')}</div>`;
  // diario: raggruppa per anno di età
  const anni=[];
  for(const b of S.log){
    const eta=b.eta!==undefined?b.eta:0;
    let A=anni[anni.length-1];
    if(!A||A.eta!==eta){A={eta,anno:b.anno,mesi:[]};anni.push(A)}
    if(b.righe.length||b===S.log[S.log.length-1])A.mesi.push(b);
  }
  const diario=anni.map(A=>`<div class="year"><div class="age">${A.eta}<small>${A.anno||''}</small></div><div class="lines">${
    A.mesi.length?A.mesi.map(m=>`${m.mese!==undefined&&m.righe.length?`<div class="mese-l">${MESE(m.mese)}${m.anno!==A.anno?' '+m.anno:''}</div>`:''}${m.righe.length?m.righe.map(l=>`<div class="line ${l.k}">${esc(l.t)}</div>`).join(''):'<div class="empty-line">Un mese tranquillo.</div>'}`).join(''):'<div class="empty-line">Un anno tranquillo.</div>'}</div></div>`).join('');
  V.innerHTML=(S.eta>=6?mondo:'')+diario+(tags.length?`<div class="tags" style="padding:10px 0 2px">${tags.map(([n,b])=>`<span class="tag${b?' bad':''}">${esc(n)}</span>`).join('')}</div>`:'')+ora;
  const bc=$('#btnCar');if(bc)bc.onclick=mostraCarattere;
  const bav=$('#btnAvvSalva');if(bav)bav.onclick=apriSalvataggi;
  const bm=$('#btnMom');if(bm)bm.onclick=()=>filmVita(false);
  const bs=$('#btnSett');if(bs)bs.onclick=()=>{tab='attivita';attTab='settimana';render();$('#view').scrollTop=0};
  V.querySelectorAll('[data-ff]').forEach(b=>b.onclick=()=>avanti(+b.dataset.ff));
  requestAnimationFrame(()=>{V.scrollTop=V.scrollHeight});
}
/* Com'eri e cosa ti ha cambiato */
function storiaCarattere(){
  let t='';
  const piu=(k,v)=>'più '+cambioPers(k,v);
  const H=(S.persStoria||[]).filter(h=>h.eta>=12&&h.eta<=S.eta-6);
  const ref=(S.eta>=25&&H.find(h=>h.eta===18))||H[0];
  if(ref){
    const dif=B5.map(b=>[b.k,S.pers[b.k]-ref.p[b.k]]).filter(([,v])=>Math.abs(v)>=5).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3).map(([k,v])=>piu(k,v));
    t+=`\n\nRispetto a quando avevi ${ref.eta} anni `+(dif.length?`sei ${dif.length>1?dif.slice(0,-1).join(', ')+' e '+dif[dif.length-1]:dif[0]}.`:`sei rimast${S.sesso==='F'?'a':'o'} quasi la stessa persona.`);
  }
  if(S.persBase){
    const tmp=B5.map(b=>[b.k,S.pers[b.k]-S.persBase[b.k]]).filter(([,v])=>Math.abs(v)>=4).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,2).map(([k,v])=>piu(k,v));
    if(tmp.length)t+=`\n\nPer quello che hai vissuto di recente, in questo periodo sei ${tmp.join(' e ')} del solito. Col tempo, in parte, passerà.`;
  }
  const L=(S.persSegni||[]).filter(x=>x.c).map(x=>({...x,m:Object.values(x.d).reduce((s,v)=>s+Math.abs(v),0)})).filter(x=>x.m>=1.2).sort((a,b)=>b.m-a.m);
  // da bambini il carattere cambia molto di più: le svolte da adulto hanno uno spazio tutto loro
  const top=[...L.filter(x=>x.eta<18).slice(0,S.eta>=25?3:6),...L.filter(x=>x.eta>=18).slice(0,4)].sort((a,b)=>a.t-b.t);
  if(top.length)t+='\n\nCosa ti ha cambiato:\n'+top.map(x=>{
    const qu=x.eta<1?`Da neonat${S.sesso==='F'?'a':'o'}`:`A ${x.eta} ann${x.eta===1?'o':'i'}`;
    const ch=Object.entries(x.d).filter(([,v])=>Math.abs(v)>=.6).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,2).map(([k,v])=>piu(k,v)).join(' e ');
    return `· ${qu} — ${x.c}: ${ch}`;
  }).join('\n');
  return t;
}
function mostraCarattere(){
  const p=S.pers,f=S.sesso==='F'?1:0;
  const righe=B5.map(b=>{const v=Math.round(p[b.k]);const lab=v>=62?b.hi[v>=78?1:0][f]:v<=38?b.lo[v<=22?1:0][f]:'Nella media';return `${b.n}: ${v}/100 · ${lab}. ${v>=62?b.dhi:v<=38?b.dlo:'Né un estremo né l\'altro.'}`});
  const it=interessi().slice(0,3).map(x=>RIASEC[x[0]]).join(', ');
  const A=S.att?ATTACCAMENTI[S.att]:null;
  const txt=righe.join('\n\n')+(A?`\n\nStile di attaccamento: ${A.n.toLowerCase()}. ${A.d}`:'')+(S.eta>=10?`\n\nInteressi (codice Holland ${codiceRiasec()}): ${it.toLowerCase()}. I lavori in linea con i tuoi interessi ti danno più soddisfazione.`:'')+(S.aspir?`\n\nAspirazioni: ${S.aspir.map(id=>T(ASPIR[id].n).toLowerCase()+((S.aspOk||[]).includes(id)?' (realizzata)':'')).join(', ')}.`:'')+storiaCarattere()+'\n\nIl carattere guida le tue reazioni: le scelte «da te» ti costano meno, quelle «non è da te» ti stressano di più. Cambia lentamente con l\'età e con quello che vivi.';
  const txtG=f?txt.replace(/da solo\b/g,'da sola').replace(/\blo (stanca|spegne)/g,'la $1'):txt;   // le descrizioni dei tratti sono scritte al maschile
  showSheet({k:'Carattere',t:`${S.nome}: ${descrPers(p,S.sesso)}`,p:txtG,chiudi:true,scelte:[]});
}

/* ---------- Studi ---------- */
function renderScuola(V){
  const I=S.istr,sc=S.scuola;let h='<div class="sec">Titoli di studio</div><div class="panel">';
  h+=kv('Titolo più alto',esc(titoloLabel()));
  if(I.liv>=2&&I.dip)h+=kv('Diploma',esc(I.dip));
  I.lauree.forEach(l=>h+=kv(`${l.liv==='triennale'?'Laurea triennale':l.liv==='ciclo unico'?'Laurea a ciclo unico':'Laurea magistrale'}`,`${esc(l.n)} · ${l.voto}/110`));
  if(I.dott)h+=kv('Dottorato',esc(I.dott));
  if(I.master)h+=kv('Master','Sì');
  if(I.spec)h+=kv('Specializzazione',esc(I.spec));
  const tg=[...I.cert,...I.abil.map(a=>'Abilitazione: '+a)];
  if(tg.length)h+=`<div class="tags">${tg.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`;
  h+='</div>';
  if(S.carcere>0){V.innerHTML=h+'<div class="sec">Percorso</div><div class="panel"><div class="meta">In carcere puoi studiare dalla scheda Attività.</div></div>';return}
  if(iscritto()){
    const nomi={elementari:'Scuola elementare',medie:'Scuola media',superiori:sc.tipo,serale:'Superiori serali',universita:sc.tipo,magistrale:`Magistrale in ${sc.tipo}`,dottorato:`Dottorato in ${sc.tipo}`,master:`Master in ${sc.tipo}`,its:sc.tipo,spec:`Specializzazione in ${sc.tipo}`};
    const tipo={universita:sc.cu?'Laurea a ciclo unico':'Laurea triennale',magistrale:'Università',dottorato:'Ricerca',master:'Post-laurea',its:'Post-diploma',spec:'Medicina',superiori:'Scuola superiore'}[sc.stato]||'Scuola dell\'obbligo';
    const trenta=['universita','magistrale','master','its'].includes(sc.stato);
    const media=trenta?`${(18+sc.voto*.12).toFixed(1)}/30`:['dottorato','spec'].includes(sc.stato)?`${sc.voto}%`:`${(4+sc.voto*.06).toFixed(1)}/10`;
    h+=`<div class="sec">Percorso attuale</div><div class="panel"><h3>${esc(nomi[sc.stato])}</h3><div class="meta">${tipo}${sc.anni>0&&!['elementari','medie'].includes(sc.stato)?` · ${sc.anni===1?'ultimo anno':`ancora ${sc.anni} anni`}`:''}${S.fatti.fuorisede?' · fuori sede':''}${sc.fuori?' · fuori corso':''}</div>`;
    h+=kv(['dottorato','spec'].includes(sc.stato)?'Andamento':'Media voti',media)+bar(sc.voto,'--accent');
    const b=[['studia','Settimana di ripasso',fatto('studia')]];
    if(['elementari','medie','superiori','serale'].includes(sc.stato))b.push(['ripetizioni',`Un mese di ripetizioni · ${eur(P(120))}`,fatto('ripetizioni')]);
    if(['elementari','medie','superiori'].includes(sc.stato))b.push(['marina','Marina la scuola',fatto('marina')]);
    if(['universita','magistrale'].includes(sc.stato))b.push(['vita_uni','Vita universitaria',fatto('vita_uni')]);
    if(sc.stato==='universita')b.push(['cambia','Cambia facoltà',false]);
    if(!['elementari','medie'].includes(sc.stato)&&!(sc.stato==='superiori'&&S.eta<16))b.push(['lascia','Lascia',false,1]);
    h+=`<div class="row-btns">${b.map(([k,l,dis,w])=>`<button class="chip${w?' warn':''}" data-sc="${k}" ${dis?'disabled':''}>${l}</button>`).join('')}</div></div>`;
  }else if(S.eta<6){h+=`<div class="sec">Percorso</div><div class="panel"><div class="meta">${S.eta<3?'Sei ancora troppo piccol'+g('o','a')+' per la scuola.':'Frequenti la scuola dell\'infanzia. Le elementari iniziano a 6 anni.'}</div></div>`}
  const isc=[];
  if(!iscritto()&&S.eta>=18){
    if(I.liv>=2)isc.push(['uni','Iscriviti all\'università','Triennale o ciclo unico']);
    if(I.lauree.some(l=>l.liv==='triennale'&&!I.lauree.some(m=>m.n===l.n&&m.liv!=='triennale')))isc.push(['magistrale','Laurea magistrale','Due anni dopo la triennale']);
    if(I.liv>=3&&!I.master)isc.push(['master','Master',`Un anno · ${eur(P(8000))}`]);
    if(I.liv>=4&&!I.dott)isc.push(['dottorato','Dottorato di ricerca','Tre anni con borsa']);
    if(I.liv>=2)isc.push(['its','ITS','Due anni, molto pratico']);
    if(I.liv<2)isc.push(['serale','Diploma serale','Tre anni, compatibile col lavoro']);
    if(I.abil.includes('Medico')&&!I.spec)isc.push(['spec','Specializzazione medica','Quattro anni retribuiti']);
  }
  if(isc.length)h+=`<div class="sec">Iscriviti</div><div class="list">${isc.map(([k,n,d])=>`<div class="job"><div><div class="jn">${n}</div><div class="jm">${d}</div></div><button class="chip pri" data-isc="${k}">Iscriviti</button></div>`).join('')}</div>`;
  const es=ABILITAZIONI.map(A=>[A,abilitazioneDisponibile(A)]).filter(([,x])=>x!==null);
  if(es.length&&!iscritto())h+=`<div class="sec">Esami di Stato</div><div class="list">${es.map(([A,x])=>`<div class="job"><div><div class="jn">${A.desc}</div><div class="${x?'jr':'jm'}">${x||eur(P(400))+' · serve per esercitare la professione'}</div></div><button class="chip pri" data-es="${A.n}" ${x||fatto('esame_'+A.n)?'disabled':''}>${fatto('esame_'+A.n)?'Fatto':'Sostieni'}</button></div>`).join('')}</div>`;
  if(S.eta>=6){
    h+=`<div class="sec">Corsi e certificazioni</div><div class="list">${CORSI.filter(c=>S.anno>=(DAL_CORSO[c.id]||0)).map(c=>{const ho=c.cert&&I.cert.includes(c.cert);const manca=c.req?mancanti(c.req):[];const lock=S.eta<c.min||manca.length>0;const f=fatto('corso_'+c.id);
      return `<div class="job"><div><div class="jn">${c.n}</div><div class="jm">${eur(P(c.costo))}${c.cert?` · ${c.cert}`:''}${c.sk?` · +${ABIL[Object.keys(c.sk)[0]]}`:''}${S.eta<c.min?` · dai ${c.min} anni`:manca.length?` · serve: ${esc(manca.join(', '))}`:''}</div></div><button class="chip" data-corso="${c.id}" ${ho||lock||f?'disabled':''}>${ho?'Ottenuto':f?'Fatto':'Iscriviti'}</button></div>`}).join('')}</div>`;
  }
  const hb=HOBBY.find(x=>x.id===S.hobby);
  h+=`<div class="sec"><span>Abilità</span></div><div class="panel"><div class="skills">${Object.keys(ABIL).map(k=>`<div><div class="kv"><span>${ABIL[k]}</span><b>${S.abil[k]}</b></div>${bar(S.abil[k],'--accent')}</div>`).join('')}</div>`;
  if(S.eta>=5)h+=`<div class="kv"><span>Attività pomeridiana: <b style="font-weight:600">${hb?hb.n:'nessuna'}</b></span></div><div class="row-btns"><button class="chip" id="btnHobby">${hb?'Cambia attività':'Scegli un\'attività'}</button></div>`;
  h+='<div class="meta">Le abilità aprono carriere speciali: calciatore, pallavolista, ciclista, tennista, musicista, chef, grafico.</div></div>';
  V.innerHTML=h;
  V.querySelectorAll('[data-sc]').forEach(b=>b.onclick=()=>azScuola(b.dataset.sc));
  V.querySelectorAll('[data-isc]').forEach(b=>b.onclick=()=>iscrizione(b.dataset.isc));
  V.querySelectorAll('[data-es]').forEach(b=>b.onclick=()=>esameStato(b.dataset.es));
  V.querySelectorAll('[data-corso]').forEach(b=>b.onclick=()=>faiCorso(b.dataset.corso));
  const hbb=$('#btnHobby');if(hbb)hbb.onclick=cambiaHobby;
}

/* ---------- Lavoro ---------- */
function renderLavoro(V){
  if(S.eta<14){V.innerHTML='<div class="sec">Lavoro</div><div class="panel"><div class="meta">Potrai fare i primi lavoretti dai 14 anni e il part-time dai 16. Il lavoro vero inizia a 18 anni.</div></div>';return}
  if(S.carcere>0){V.innerHTML='<div class="sec">Lavoro</div><div class="panel"><div class="meta">Sei in carcere. Puoi lavorare in lavanderia dalla scheda Attività.</div></div>';return}
  let h='<div class="sec">Il tuo lavoro</div>';
  const L=S.lavoro;
  if(L){const j=JOB[L.id];const nx=L.liv<j.liv.length-1?nomeJob(j,L.liv+1):null;
    const nm=nx?mancanti(j.promo&&j.promo[L.liv+1]):[];
    h+=`<div class="panel"><h3>${esc(L.nome)}</h3><div class="meta">${j.pt?'Part-time · ':''}${L.anni} ${L.anni===1?'anno':'anni'} in azienda · livello ${L.liv+1} di ${j.liv.length}</div>
    ${isPiva(L)?`${kv(j.var?'Compensi medi (lordi annui)':'Compensi (lordi annui)',eur(ralEff(L)))}${kv('Netto al mese',eur(nettoPiva(ralEff(L),L)/12))}${kv('Tasse e contributi',`<span style="font-weight:400;color:var(--muted)">regime forfettario: contributi INPS e imposta sostitutiva · niente tredicesima, ${S.anno>=1982?'TFR':'liquidazione'} e ${S.anno>=2015?'NASpI':'sussidio di disoccupazione'}</span>`)}`
     :`${kv(j.var?'Guadagno medio (lordo annuo)':L.ptv?'RAL in part-time (lordo annuo)':'RAL (lordo annuo)',eur(ralEff(L)))}${kv('Netto al mese (13 mensilità)',eur(netto(ralEff(L))/13))}${(()=>{const t=tasseDettaglio(ralEff(L));return kv('Tasse e contributi',`<span style="font-weight:400;color:var(--muted)">IRPEF ${eur(t.irpef)} · INPS ${eur(t.inps)} · addizionali ${eur(t.addiz)}</span>`)})()}`}
    ${nx?kv('Prossimo livello',esc(nx)+(nm.length?` <span style="color:var(--bad);font-weight:400">· serve ${esc(nm.join(', '))}</span>`:'')):''}
    ${kv('Contratto',descrContratto(L))}${kv('Rendimento',L.perf+'%')}${bar(L.perf,'--salute')}${kv('Soddisfazione',soddLavoro()+'%')}${bar(soddLavoro(),'--felicita')}<div class="meta">Affinità con i tuoi interessi: ${matchLavoro(L.id)}% · ${oreLavoro()} ore a settimana</div>
    <div class="row-btns">
      <button class="chip" data-lv="sodo" ${fatto('sodo')?'disabled':''}>Dai il massimo questo mese</button>
      <button class="chip" data-lv="aumento" ${fatto('aumento')?'disabled':''}>Chiedi un aumento</button>
      ${nx?`<button class="chip" data-lv="promo" ${fatto('promo')?'disabled':''}>Chiedi una promozione</button>`:''}
      <button class="chip" data-lv="collega" ${fatto('collega')?'disabled':''}>Fai amicizia con un collega</button>
      ${!j.pt&&!isPiva(L)&&!j.elez?(L.ptv?`<button class="chip" data-lv="tempopieno" ${fatto('tempopieno')?'disabled':''}>Torna a tempo pieno</button>`:`<button class="chip" data-lv="parttime" ${fatto('parttime')?'disabled':''}>Chiedi il part-time</button>`):''}
      ${pensioneMaturata()?'<button class="chip pri" data-lv="pensione">Vai in pensione</button>':''}
      <button class="chip warn" data-lv="licenziati">Licenziati</button>
    </div></div>`;
  }else if(S.pensione)h+=`<div class="panel"><h3>In pensione</h3>${kv('Pensione netta al mese',eur(S.pensione/13)+' × 13')}${kv('Anni di contributi',Math.floor(S.contributi))}</div>`;
  else h+=`<div class="panel"><div class="meta">Non hai un lavoro. Le offerte sono qui sotto: i requisiti dipendono da studi, certificazioni e abilità.</div>${S.contributi?kv('Anni di contributi',Math.floor(S.contributi)):''}${S.naspi?kv(cap(S.naspi.nome||'NASpI'),`${eur(naspiMese())} al mese · ancora ${S.naspi.mesi-S.naspi.m} mesi`):''}${S.sfl?kv('Supporto formazione e lavoro',`${eur(P(500))} al mese · ancora ${S.sfl.mesi-S.sfl.m} mesi`):''}</div>`;
  if(S.eta>=18){
    h+='<div class="sec">Attività in proprio</div>';
    if(S.azienda){const A=S.azienda,T0=AZ(A.id),u=A.ultimo,pv=calcolaAzienda(A,true);
      const ch=(k,l,w)=>`<button class="chip${w?' warn':''}" data-az="${k}">${l}</button>`;
      h+=`<div class="panel"><h3>${esc(A.n)}</h3><div class="meta">${esc(A.tipo)} · ${A.anni} ${A.anni===1?'anno':'anni'} · ${A.sedi} ${A.sedi===1?'sede':'sedi'} · ${A.dip} dipendent${A.dip===1?'e':'i'}</div>
      ${kv('Cassa',eur(A.cassa),A.cassa<0?'neg':'')}${kv('Valore stimato',eur(valoreAzienda(A)))}${kv('Reputazione',A.rep+'%')}${bar(A.rep,'--felicita')}
      <div class="meta" style="margin-top:4px">Previsione per il prossimo anno</div>
      ${kv(cap(T0.cliente)+' richiesti',`${nf(pv.domanda)} su ${nf(pv.cap)} che riuscite a servire`,pv.domanda>pv.cap*1.1?'neg':'')}
      ${kv('Incassi','+'+eur(pv.ricavi),'pos')}${kv('Merci e materie prime','−'+eur(pv.materie),'neg')}${kv('Personale','−'+eur(pv.personale),'neg')}${kv('Affitti','−'+eur(pv.affitti),'neg')}${kv('Qualità e pubblicità','−'+eur(pv.qual+pv.mkt),'neg')}${kv('Il tuo compenso','−'+eur(pv.compenso),'neg')}${kv('Tasse sugli utili','−'+eur(pv.tasse),'neg')}
      <div class="kv tot"><span>Utile previsto</span><b class="${pv.utile>=0?'pos':'neg'}">${eur(pv.utile)}</b></div>
      ${u?`<div class="meta">Anno scorso: ${nf(u.clienti)} ${T0.cliente}, utile ${eur(u.utile)}.</div>`:''}
      ${pv.domanda>pv.cap*1.1?'<div class="meta" style="color:var(--bad)">Troppa richiesta per il personale che hai: assumi, o la reputazione cala.</div>':''}
      <div class="row-btns">${ch('prezzi','Prezzi: '+PREZZI_AZ[A.prezzo].n.toLowerCase())}${ch('qualita','Qualità: '+QUALITA_AZ[A.qualita].n.toLowerCase())}${ch('mkt',MKT_AZ[A.mkt].n)}${ch('compenso','Compenso: '+eur(A.compenso))}${ch('assumi','Assumi')}${ch('licenzia','Licenzia')}${ch('sede','Apri una sede · '+eur(P(T0.aprire)))}${A.sedi>1?ch('chiudisede','Chiudi una sede'):''}${ch('inietta','Versa fino a '+eur(P(10000)))}${ch('preleva','Preleva gli utili')}${ch('vendi','Vendi',1)}${ch('chiudi','Chiudi',1)}</div></div>`}
    else h+=`<div class="panel"><div class="meta">Apri un bar, una pizzeria, una palestra o una startup. Decidi prezzi, qualità, pubblicità, dipendenti e sedi.</div><button class="btn ghost" id="btnImpresa">Apri un'attività</button></div>`;
  }
  if(!S.pensione){
    const vis=LAVORI.filter(j=>(!j.nascosto||S.fatti[j.nascosto])&&lavoroInEpoca(j));
    const righe=vis.map(j=>({j,m:requisitiJob(j)})).filter(x=>!soloDisponibili||!x.m.length);
    h+=`<div class="sec"><span>Offerte di lavoro</span><button class="chip" id="btnFiltro" style="padding:2px 10px;font-size:11px;font-family:var(--f-body);letter-spacing:0;text-transform:none">${soloDisponibili?'Mostra tutte':'Solo disponibili'}</button></div><div class="list">`;
    h+=righe.length?righe.map(({j,m})=>{const mio=L&&L.id===j.id,f=fatto('job_'+j.id);
      return `<div class="job"><div><div class="jn">${esc(nomeJob(j,0))}</div><div class="jm">${eur(stipLiv(j,0))} RAL${S.eta>=14?` · affinità ${matchLavoro(j.id)}%`:''}${j.pt?' · part-time':''}${j.conc?(j.cdiff?' · concorso molto difficile':' · concorso pubblico'):''}${PIVA.includes(j.id)?' · partita IVA':''}${j.elez?' · si entra con le elezioni':''}${j.var?' · variabile':''} · carriera fino a ${esc(nomeJob(j,j.liv.length-1).toLowerCase())}</div>${m.length&&!mio?`<div class="jr">Serve: ${esc(m.slice(0,2).join(' · '))}</div>`:''}</div><button class="chip${!m.length&&!mio&&!f?' pri':''}" data-job="${j.id}" ${m.length||f||mio?'disabled':''}>${mio?'Il tuo':f?'Inviata':m.length?'Bloccato':j.conc?'Concorso':'Candidati'}</button></div>`}).join(''):'<div class="note" style="padding:12px 0">Nessuna offerta disponibile per ora. Studia o fai un corso per sbloccarne altre.</div>';
    h+='</div>';
    if(S.eta>=16)h+='<div class="meta">In Italia i contratti a termine sono il 15% (quasi il 30% sotto i 35 anni). A parità di ora le donne guadagnano circa il 5% in meno, in un anno quasi il 30% in meno: pesano part-time, figli e carriere più lente (ISTAT, INPS).</div>';
  }
  V.innerHTML=h;
  V.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>azLavoro(b.dataset.lv));
  V.querySelectorAll('[data-az]').forEach(b=>b.onclick=()=>azAzienda(b.dataset.az));
  V.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>candidati(b.dataset.job));
  const bi=$('#btnImpresa');if(bi)bi.onclick=apriAzienda;
  const bf=$('#btnFiltro');if(bf)bf.onclick=()=>{soloDisponibili=!soloDisponibili;render()};
}

/* ---------- Persone ---------- */
function personaRow(p){
  const h=hue(p.nome+p.cognome);
  const info=[ruoloLabel(p),p.vivo?`${p.eta} ${p.eta===1?'anno':'anni'}`:gp(p,'Deceduto','Deceduta')];
  if(p.vivo&&p.conv)info.push('convivete');
  else if(p.vivo&&p.ruolo!=='Ex'&&p.pers)info.push(descrPers(p.pers,p.sesso));
  if(p.vivo&&!['Ex','Nemico','Conoscente','Partner','Coniuge'].includes(p.ruolo)&&p.eta>=18){const st=p.malato>=2?'malat'+gp(p,'o','a'):p.nonAuto?'non autosufficiente':p.stato==='disoccupato'?statoNpc(p):p.lontano?'vive lontano':'';if(st)info.push(st)}
  if(p.mezzo)info[0]=gp(p,'Fratellastro','Sorellastra');
  if(p.gemello)info[0]=gp(p,'Gemello','Gemella');
  const nem=p.ruolo==='Nemico';
  return `<button class="person${p.vivo?'':' dead'}" data-p="${p.id}" ${p.vivo?'':'disabled'}><span class="pa volto-mini">${volto(lookDi(p),p.eta,p.sesso)}</span><span class="pi"><span class="pn">${p.frequente?'★ ':''}${esc(p.nome)} ${esc(p.cognome)}</span><span class="pr">${info.join(' · ')}</span></span>${p.vivo&&p.ruolo!=='Ex'?(nem?`<span class="pb" title="Rancore">${p.rancore||50}%${bar(p.rancore||50,'--bad')}</span>`:`<span class="pb">${p.rapporto}%${bar(p.rapporto,'--aspetto')}</span>`):''}</button>`;
}
function renderPersone(V){
  const R=x=>S.relazioni.filter(p=>x.includes(p.ruolo));
  const ord=['Madre','Padre','Patrigno','Fratello'];
  const fam=R(ord).sort((a,b)=>ord.indexOf(a.ruolo)-ord.indexOf(b.ruolo));
  const amore=R(['Partner','Coniuge']),figli=R(['Figlio','Nipote']),amici=R(['Amico']).sort((a,b)=>(b.best?1:0)-(a.best?1:0)),ex=R(['Ex']);
  const nonni=R(['Nonno']),zii=R(['Zio','Cugino']).sort((a,b)=>a.ruolo.localeCompare(b.ruolo)),acq=R(['Suocero','Cognato']),nem=R(['Nemico']);
  const gruppo=(t,L)=>L.length?`<div class="sec">${t}</div><div class="list">${L.map(personaRow).join('')}</div>`:'';
  let h='<div class="sec">Famiglia</div>'+(fam.length?`<div class="list">${fam.map(personaRow).join('')}</div>`:'<div class="note">Nessun familiare in vita.</div>');
  h+=gruppo('Nonni',nonni)+gruppo('Zii e cugini',zii)+gruppo('Famiglia acquisita',acq);
  h+='<div class="sec">Amore</div>';
  if(amore.length)h+=`<div class="list">${amore.map(personaRow).join('')}</div>`;
  if(!amore.some(p=>p.vivo)&&S.carcere===0)h+=S.eta>=18?`<button class="btn" id="btnAmore" style="margin-top:${amore.length?8:0}px">Cerca l'amore</button>`:'<div class="note">Potrai cercare l\'amore dai 18 anni.</div>';
  if(figli.length){h+=`<div class="sec">Figli e nipoti</div>`;
    if(S.genit&&figli.some(f=>f.ruolo==='Figlio'&&f.eta<18&&!f.fuori)){const G=S.genit,st=STILE_GEN[stileGen()];h+=`<div class="panel gen"><div class="kv"><span>Come genitore sei</span><b>${st.n}</b></div><div class="meta">Affetto ${Math.round(G.cal)} · regole ${Math.round(G.reg)}: ${esc(st.d)}.</div></div>`}
    h+=`<div class="list">${figli.map(personaRow).join('')}</div>`}
  h+=`<div class="sec">Amici</div>${amici.length?`<div class="list">${amici.map(personaRow).join('')}</div>`:'<div class="note">Non hai ancora amici.</div>'}`;
  if(S.eta>=6&&S.carcere===0)h+=`<button class="btn ghost" id="btnAmici" style="margin-top:8px" ${fatto('nuoviamici')?'disabled':''}>${fatto('nuoviamici')?attesa('nuoviamici'):'Fai nuove amicizie'}</button>`;
  h+=gruppo('Conoscenti',R(['Conoscente']));
  const gr=(S.gruppi||[]).map(G=>[G,membriVivi(G).filter(x=>['Amico','Conoscente'].includes(x.ruolo))]).filter(x=>x[1].length>=2);
  if(gr.length)h+=`<div class="sec">I tuoi gruppi</div><div class="panel">${gr.map(([G,M])=>`<div class="kv"><span>${esc(G.n)}${gruppoAttivo(G)?'':' <small class="meta">· di una volta</small>'}</span><b class="meta">${esc(nomi(M.slice(0,4).map(x=>x.nome)))}${M.length>4?' e altri':''}</b></div>`).join('')}</div>`;
  h+=gruppo('Nemici',nem);
  if(ex.length)h+=`<div class="sec">Ex</div><div class="list">${ex.map(personaRow).join('')}</div>`;
  h+='<div class="sec">Animali</div>';
  if(S.animali.length)h+=`<div class="list">${S.animali.map((a,i)=>`<button class="person" data-an="${i}"><span class="pa obj">${a.t[0]}</span><span class="pi"><span class="pn">${esc(a.nome)}</span><span class="pr">${a.t} · ${a.eta} ${a.eta===1?'anno':'anni'}${(a.pappa||0)>=1?' · ha fame':''}</span></span><span class="pb">${initAnimale(a).leg}%${bar(a.leg,'--felicita')}</span></button>`).join('')}</div>`;
  if(S.eta>=8&&S.carcere===0&&S.animali.length<4)h+=`<button class="btn ghost" id="btnAnimale" style="margin-top:8px">Adotta un animale</button>`;
  else if(!S.animali.length)h+='<div class="note">Nessun animale.</div>';
  V.innerHTML=h;
  V.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>apriPersona(+b.dataset.p));
  V.querySelectorAll('[data-an]').forEach(b=>b.onclick=()=>apriAnimale(+b.dataset.an));
  const a=$('#btnAmore');if(a)a.onclick=cercaAmore;
  const am=$('#btnAmici');if(am)am.onclick=nuoveAmicizie;
  const an=$('#btnAnimale');if(an)an.onclick=adottaAnimale;
}

/* ---------- Beni ---------- */
function renderBeni(V){
  const v=bilancioMese(true);const sv=costoRoutineMese();if(sv)v.push(['Svago e attività della settimana',-sv]);if(S.fatti.extraMese)v.push(['Lavoro extra (ultimo mese)',S.fatti.extraMese]);const tot=v.reduce((s,x)=>s+x[1],0);
  let h=`<div class="sec">Finanze</div><div class="panel">${kv('Conto corrente',eur(S.soldi),S.soldi<0?'neg':'')}${kv('Patrimonio netto',eur(patrimonio()))}${kv('Prezzi rispetto alla tua nascita','×'+S.mondo.ip.toFixed(2).replace('.',','))}${S.eta>=18&&S.anno>=1998?kv('ISEE (stima)',eur(iseeStima())):''}`;
  if(v.length){h+=`<div class="meta" style="margin-top:4px">Bilancio previsto per ${MESI[(S.mese+1)%12]}</div>${v.map(([n,x])=>kv(esc(n),(x>0?'+':'')+eur(x),x>0?'pos':'neg')).join('')}<div class="kv tot"><span>Totale</span><b class="${tot>=0?'pos':'neg'}">${tot>=0?'+':''}${eur(tot)}</b></div>`}
  h+='</div>';
  const ab=S.casa,mia=casaMia();
  const desc=ab.tipo==='genitori'?'Vivi con i tuoi genitori':ab.tipo==='figlio'?'Vivi a casa di tuo figlio':ab.tipo==='carcere'?'Sei in carcere':ab.tipo==='affitto'?`${ab.n} in affitto · ${eur(ab.costo/12)} al mese`:mia?`${mia.tipo} di tua proprietà`:'—';
  h+=`<div class="sec">Dove vivi</div><div class="panel"><h3>${esc(desc)}</h3><div class="meta">${esc(nomeLuogo(S.citta,S.prov))} · ${esc(luogo().reg)} · case a ${eur(luogo().mq*S.mondo.mattone)} al m²${convivente()?` · con ${esc(partnerAttuale().nome)}`:''}</div>`;
  if(S.eta>=18&&S.carcere===0){
    h+='<div class="row-btns">';
    h+='<button class="chip" id="btnAffitto">Cerca casa in affitto</button><button class="chip pri" id="btnCompraCasa">Compra casa</button>';
    if(genitoriVivi()&&ab.tipo!=='genitori')h+='<button class="chip" id="btnGenitori">Torna dai genitori</button>';
    h+='</div>';
  }else if(S.eta<18)h+='<div class="meta">Potrai andare a vivere da sol'+g('o','a')+' a 18 anni.</div>';
  h+='</div>';
  if(S.prop.length)h+=`<div class="sec">Proprietà</div><div class="list">${S.prop.map(p=>`<button class="person" data-prop="${p.id}"><span class="pa obj">⌂</span><span class="pi"><span class="pn">${esc(p.tipo)}</span><span class="pr">${esc(p.citta)} · ${eur(p.valore)}${p.mutuo?' · mutuo':''}${p.affittata?' · affittata':''}${S.casa.pid===p.id&&S.casa.tipo==='proprieta'?' · ci vivi':''}</span></span><span class="pb">${p.stato}%${bar(p.stato,'--salute')}</span></button>`).join('')}</div>`;
  h+=htmlRicchezza();
  h+='<div class="sec">Veicoli</div>';
  if(S.veicoli.length)h+=`<div class="list">${S.veicoli.map(c=>`<button class="person" data-car="${c.id}"><span class="pa obj">▸</span><span class="pi"><span class="pn">${esc(c.n)}</span><span class="pr">${c.valore?eur(c.valore):'Aziendale'}${c.prestito?' · a rate':''}</span></span><span class="pb">${c.stato}%${bar(c.stato,'--salute')}</span></button>`).join('')}</div>`;
  else h+='<div class="note">Nessun veicolo.</div>';
  if(S.eta>=16&&S.carcere===0)h+=`<button class="btn ghost" id="btnAuto" style="margin-top:8px">Vai dal concessionario</button>`;
  if(S.eta>=18){
    const pr=S.prestiti;
    h+=`<div class="sec">Prestiti</div><div class="panel">${pr.length?pr.map((p,i)=>kv(`${esc(p.n)} · ${p.anni} anni`,`${eur(p.residuo)} <span style="font-weight:400;color:var(--muted)">· rata ${eur(p.rata)}</span>`)+`<div class="row-btns"><button class="chip" data-est="${i}" ${S.soldi<p.residuo?'disabled':''}>Estingui ${eur(p.residuo)}</button></div>`).join(''):'<div class="meta">Nessun prestito. La banca presta fino a 5 anni all\'8,5% se hai un lavoro stabile e le rate restano sotto il 35% dello stipendio netto.</div>'}
      <div class="row-btns">${[5000,15000,30000].map(x=>`<button class="chip" data-pres="${x}">Chiedi ${eur(x)}</button>`).join('')}</div></div>`;
    h+=`<div class="sec"><span>Borsa</span><span>Valore ${eur(valoreBorsa())}</span></div><div class="list">${TITOLI.map(t=>{const q=S.borsa[t.id]||0,v=Math.round(q*S.mondo.prezzi[t.id]),x=S.mondo.var[t.id],c=S.costoBorsa[t.id]||0;
      return `<div class="job wrap"><div><div class="jn">${esc(t.n)} <span class="jm">· ${esc(t.set)}</span></div><div class="jm">Prezzo ${S.mondo.prezzi[t.id].toLocaleString('it-IT',{maximumFractionDigits:2})} ${x!==undefined?`<span style="color:var(${x>=0?'--good':'--bad'})">${x>=0?'+':''}${(x*100).toFixed(0)}%</span>`:''}${t.div?` · dividendo ${(t.div*100).toFixed(1).replace('.',',')}%`:''}${q?` · tuoi ${eur(v)} <span style="color:var(${v>=c?'--good':'--bad'})">(${v>=c?'+':''}${eur(v-c)})</span>`:''}</div></div>
      <div class="row-btns"><button class="chip" data-buy="${t.id}" data-imp="1000">+1.000 €</button><button class="chip" data-buy="${t.id}" data-imp="10000">+10.000 €</button>${q?`<button class="chip warn" data-sell="${t.id}">Vendi</button>`:''}</div></div>`}).join('')}</div>
      <div class="note">Sui guadagni di vendita e sui dividendi paghi il 26% di tasse.</div>`;
  }
  V.innerHTML=h;
  const on=(id,fn)=>{const b=$('#'+id);if(b)b.onclick=fn};
  on('btnAffitto',cercaAffitto);on('btnCompraCasa',compraCasa);on('btnGenitori',tornaGenitori);on('btnAuto',concessionario);
  V.querySelectorAll('[data-prop]').forEach(b=>b.onclick=()=>apriProp(+b.dataset.prop));
  V.querySelectorAll('[data-car]').forEach(b=>b.onclick=()=>apriVeicolo(+b.dataset.car));
  legaRicchezza(V);
  V.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>azione(()=>compraTitolo(b.dataset.buy,+b.dataset.imp)));
  V.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>azione(()=>vendiTitolo(b.dataset.sell)));
  V.querySelectorAll('[data-pres]').forEach(b=>b.onclick=()=>azione(()=>chiediPrestito(+b.dataset.pres)));
  V.querySelectorAll('[data-est]').forEach(b=>b.onclick=()=>azione(()=>{const p=S.prestiti[+b.dataset.est];if(!p||S.soldi<p.residuo)return ['Non hai abbastanza soldi.','x'];soldi(-p.residuo);S.prestiti.splice(+b.dataset.est,1);return ['Prestito estinto.','g']}));
}

/* ---------- Attività ---------- */
let attTab='settimana';
function costoRoutineMese(){
  const e=S.eta;let t=0;
  if(e>=14){if(rOre('sport')>=3)t+=P(e>=18?35:20);if(rOre('uscite'))t+=P(e>=18?9:4)*rOre('uscite')*4.3;if(rOre('amici')&&e>=16)t+=P(2.5)*rOre('amici')*4.3;if(S.hobby&&rOre('hobby')&&(e>=18||!genitoriVivi()))t+=P(38)}
  return Math.round(t*(1.2-S.pers.C/250));
}
function renderSettimana(){
  if(S.eta<6)return '<div class="panel"><div class="meta">Fino a 6 anni sono i tuoi genitori a decidere come passi le giornate.</div></div>';
  if(S.carcere>0)return '<div class="panel"><div class="meta">In carcere le giornate le decide il regolamento.</div></div>';
  normalizzaRoutine();
  const ob=obblighi(),lib=oreLibere(),us=oreRoutine(),rip=lib-us;
  let h=`<div class="sec"><span>Ore fisse a settimana</span><span>su 168</span></div><div class="panel">${ob.map(([n,x])=>kv(esc(n),x+' h')).join('')}<div class="kv tot"><span>Ore libere</span><b>${lib} h</b></div>
    <div class="rrow"><div><div class="jn">Sonno a notte</div><div class="jm">${S.sonno<7?'Poco: meno energia, più stress':S.sonno>8.5&&S.eta>=18?'Tanto: meno ore libere':'Giusto'}</div></div><div class="step"><button class="chip" data-sonno="-0.5" ${S.sonno<=5?'disabled':''} aria-label="Meno sonno">−</button><b>${String(S.sonno).replace('.',',')} h</b><button class="chip" data-sonno="0.5" ${S.sonno>=10||rip<3.5?'disabled':''} aria-label="Più sonno">+</button></div></div></div>`;
  h+=`<div class="sec"><span>Come usi il tempo libero</span><span>${us} h usate</span></div><div class="list">`;
  for(const a of ATT_R){
    if(S.eta<a.min||(a.cond&&!a.cond()))continue;
    const v=S.routine[a.id]||0;
    h+=`<div class="rrow"><div><div class="jn">${esc(nomeAttR(a))}</div><div class="jm">${esc(a.d)}</div></div><div class="step"><button class="chip" data-r="${a.id}" data-d="-1" ${v<=0?'disabled':''} aria-label="Meno">−</button><b>${v} h</b><button class="chip" data-r="${a.id}" data-d="1" ${rip<1?'disabled':''} aria-label="Più">+</button></div></div>`;
  }
  h+=`</div><div class="panel" style="margin-top:10px">${kv('Riposo e tempo per te',`${rip} h`)}${bar(Math.min(100,rip*2.5),rip<10?'--bad':'--salute')}<div class="meta">${rip<10?'Quasi nessun momento per te: l\'energia scende e lo stress sale.':'Il tempo che resta ricarica le energie.'} ${pz('C')<-.2?'Sei poco costante: delle ore di sport e studio che pianifichi ne farai solo una parte.':''}</div>${S.eta>=14?kv('Costo stimato al mese',eur(costoRoutineMese())):''}</div>`;
  return h;
}
function renderAttivita(V){
  let h='';
  if(S.malattie.length)h+=`<div class="sec">Salute</div><div class="panel">${S.malattie.map(m=>kv(esc(m.n),['','Lieve','Grave','Cronica','Gravissima'][m.g],'neg')).join('')}<div class="meta">Il medico di base cura le malattie lievi. Per quelle gravi servono lo specialista o la clinica. Le croniche si tengono sotto controllo con la terapia ogni anno.</div></div>`;
  const card=(a,lock,done,attr,costo,key)=>`<button class="act" ${attr} ${lock||done?'disabled':''}><span class="n">${a.n}</span><span class="d">${lock?`Dai ${a.min} anni`:prezzi(a.d)||''}</span><span class="c">${done?attesa(key):(costo?eur(costo):a.da?'da '+eur(P(a.da)):'Gratis')}${!done&&a.en!==0?` · energia ${a.en>0||a.en===undefined?'−':'+'}${Math.abs(a.en===undefined?8:a.en)}`:''}</span></button>`;
  if(S.carcere>0){
    const G=S.galera||{pena:S.carcere,scontata:0,condotta:0};
    h+=`<div class="sec">In carcere</div><div class="panel">${kv('Pena',`${G.pena} ${G.pena===1?'anno':'anni'}`)}${kv('Scontati',G.scontata)}${kv('Anni di buona condotta',G.condotta)}${G.banda?kv('Banda',esc(G.banda)):''}</div>
    <div class="grid2" style="margin-top:10px">${AZ_CARCERE.map(a=>card(Object.assign({en:0},a),false,fatto('c_'+a.id),`data-carc="${a.id}"`,0,'c_'+a.id)).join('')}</div>`;
    V.innerHTML=h;V.querySelectorAll('[data-carc]').forEach(b=>b.onclick=()=>faiAttivita(b.dataset.carc,true));return;
  }
  const tabs=[['settimana','Settimana'],['svago','Attività'],['social','Social'],['crimine','Crimine']];
  h+=`<div class="seg att-seg" role="tablist">${tabs.map(([k,l])=>`<button role="tab" data-at="${k}" aria-pressed="${attTab===k}">${l}</button>`).join('')}</div>`;
  if(attTab==='settimana')h+=renderSettimana();
  if(attTab==='svago'){
    const sez=[...new Set(ATTIVITA.map(a=>a.sez))];
    for(const s0 of sez){
      const acts=ATTIVITA.filter(a=>a.sez===s0&&(!a.max||S.eta<=a.max)&&(!a.cond||a.cond())&&!fuoriEpoca(a.n+' '+(a.d||'')));
      if(!acts.length)continue;
      h+=`<div class="sec">${s0}</div><div class="grid2">${acts.map(a=>card(a,S.eta<a.min,!a.ripeti&&fatto('att_'+a.id),`data-att="${a.id}"`,P(a.costo),'att_'+a.id)).join('')}</div>`;
    }
  }
  if(attTab==='social'){
    const so=S.social;
    if(S.anno<2008)h+='<div class="panel"><div class="meta">I social network in Italia arrivano verso il 2008. Per ora la fama si conquista in TV, sui giornali o in piazza.</div></div>';
    else if(S.eta<14)h+='<div class="panel"><div class="meta">Potrai aprire un profilo social a 14 anni: in Italia prima serve il consenso dei genitori.</div></div>';
    else if(!so.attivo)h+=`<div class="panel"><h3>Non hai un profilo</h3><div class="meta">Con tanti follower arrivano sponsor, fama e qualche guaio. Da 5.000 follower i marchi iniziano a pagarti.</div><button class="btn" id="btnApriSocial">Apri un profilo</button></div>`;
    else{
      h+=`<div class="panel"><div class="big">${nf(so.follower)}</div><div class="meta">follower · fama ${S.fama}/100${redditoSocial()?` · circa ${eur(redditoSocial())} l'anno dalle collaborazioni`:''}</div></div>
      <div class="sec">Pubblica</div><div class="grid2">${POST.map(pp=>card({n:pp.n,d:pp.d,min:13,en:0},false,fatto('post_'+pp.id),`data-post="${pp.id}"`,0,'post_'+pp.id)).join('')}
      ${card({n:'Compra 5.000 follower',d:'Rischi di farti scoprire',min:13,en:0},false,fatto('compra_fol'),'data-compra="1"',P(500),'compra_fol')}</div>
      <button class="btn ghost" id="btnChiudiSocial" style="margin-top:10px">Chiudi il profilo</button>`;
    }
  }
  if(attTab==='crimine'){
    const C=S.crim;
    h+=`<div class="panel"><div class="meta">Ogni colpo riuscito porta soldi ed esperienza. Se va male, il 70% delle volte ti arrestano. Il karma scende sempre.</div>${kv('Esperienza criminale',C.exp)}${kv('Colpi riusciti',C.colpi)}</div>
    <div class="sec">Colpi</div><div class="grid2">${CRIMINI.map(c=>`<button class="act" data-crim="${c.id}" ${S.eta<c.min||fatto('crim_'+c.id)?'disabled':''}><span class="n">${c.n}</span><span class="d">${S.eta<c.min?`Dai ${c.min} anni`:c.d}</span><span class="c">${fatto('crim_'+c.id)?attesa('crim_'+c.id):c.b[1]?`${eur(P(c.b[0]))}–${eur(P(c.b[1]))}`:'Solo per il brivido'}</span></button>`).join('')}</div>`;
    h+='<div class="sec">Malavita</div>';
    if(C.clan){const K=C.clan;
      h+=`<div class="panel"><h3>${esc(cap(K.nome))}</h3>${kv('Grado',`${GRADI_CLAN[K.grado]} (${K.grado+1} di ${GRADI_CLAN.length})`)}${kv('Lealtà',K.lealta+'%')}${bar(K.lealta,'--felicita')}${kv('Missioni compiute',K.missioni)}<div class="meta">Sotto il 25% di lealtà il capo inizia a sospettare di te.</div></div>
      <div class="grid2" style="margin-top:10px">${MISSIONI.map(m=>{const lock=K.grado<(m.grado||0);return `<button class="act" data-mis="${m.id}" ${lock||fatto('mis_'+m.id)?'disabled':''}><span class="n">${m.n}</span><span class="d">${lock?`Serve il grado ${GRADI_CLAN[m.grado].toLowerCase()}`:m.d}</span><span class="c">${fatto('mis_'+m.id)?attesa('mis_'+m.id):`${eur(P(m.b[0]))}–${eur(P(m.b[1]))}`}</span></button>`}).join('')}</div>
      <button class="btn ghost" id="btnLasciaClan" style="margin-top:10px">Esci dal clan</button>`;
    }else h+=`<div class="panel"><div class="meta">${S.eta<18?'Sei troppo giovane.':C.exp<4?'Ti serve più esperienza (almeno 4) perché qualcuno si fidi di te.':'Qualcuno ha sentito parlare di te.'}</div><button class="btn ghost" id="btnClan" ${S.eta<18||fatto('clan')?'disabled':''}>Avvicinati alla malavita</button></div>`;
  }
  V.innerHTML=h;
  V.querySelectorAll('[data-at]').forEach(b=>b.onclick=()=>{attTab=b.dataset.at;render()});
  V.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const id=b.dataset.r,d=+b.dataset.d;S.routine[id]=Math.max(0,(S.routine[id]||0)+d);if(oreRoutine()>oreLibere())S.routine[id]-=d;save();render()});
  V.querySelectorAll('[data-sonno]').forEach(b=>b.onclick=()=>{S.sonno=Math.max(5,Math.min(10,S.sonno+(+b.dataset.sonno)));normalizzaRoutine();save();render()});
  V.querySelectorAll('[data-att]').forEach(b=>b.onclick=()=>faiAttivita(b.dataset.att));
  V.querySelectorAll('[data-post]').forEach(b=>b.onclick=()=>azione(()=>pubblica(b.dataset.post)));
  V.querySelectorAll('[data-crim]').forEach(b=>b.onclick=()=>azione(()=>commettiCrimine(b.dataset.crim)));
  V.querySelectorAll('[data-mis]').forEach(b=>b.onclick=()=>azione(()=>missione(b.dataset.mis)));
  const on=(id,fn)=>{const b=$('#'+id);if(b)b.onclick=fn};
  on('btnApriSocial',()=>azione(()=>{S.social={attivo:true,follower:r(20,150),comprati:0};return ['Apri il tuo profilo. I primi follower sono amici e parenti.','g']}));
  on('btnChiudiSocial',()=>showSheet({k:'Social',t:'Chiudi il profilo?',p:'Perderai tutti i follower.',chiudi:true,scelte:[{l:'Chiudi',fx:()=>{S.social={attivo:false,follower:0,comprati:0};return ['Profilo chiuso. Che pace.','']}}]}));
  const cf=V.querySelector('[data-compra]');if(cf)cf.onclick=()=>azione(una('compra_fol',P(500),()=>{S.social.follower+=5000;S.social.comprati=1;return ['Arrivano 5.000 follower nuovi. Nessuno di loro commenta mai.','']}));
  on('btnClan',()=>azione(una('clan',0,avvicinaClan)));
  on('btnLasciaClan',()=>showSheet({k:'Malavita',t:'Uscire dal clan',p:'Dal clan non si esce facilmente.',chiudi:true,scelte:[{l:'Chiedi di andartene',sub:'45% di riuscita',fx:()=>lasciaClan(false)},{l:'Collabora con la giustizia',sub:'Ti proteggono, ma devi cambiare città',fx:()=>lasciaClan(true)}]}));
}

/* ---------- Logo e intro ---------- */
const logoSvg=()=>`<svg class="logo" viewBox="6 22 190 132" aria-hidden="true"><path class="tr" d="M20 104V71a21 21 0 0 1 42 0v33M62 71a21 21 0 0 1 42 0v33M157 140V99M157 99L133 53M157 99L181 53"/><circle class="testa" cx="157" cy="38" r="10"/></svg>`;
function intro(){
  const el=$('#intro');if(!el)return;
  const forza=/[?&]intro(=|&|$)/.test(location.search);
  const ridotto=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!forza&&(navigator.webdriver||ridotto)){el.remove();return}   // niente intro nei test automatici e con «riduci movimento»
  const via=()=>{if(!el.isConnected)return;el.classList.add('via');setTimeout(()=>el.remove(),320)};
  el.onclick=via;addEventListener('keydown',via,{once:true});
  setTimeout(()=>el.remove(),5050);
}

/* ---------- Creazione e necrologio ---------- */
/* al funerale: le persone che ti volevano più bene, con il ricordo più forte che avevano di te */
function funerale(){
  const L=S.relazioni.filter(p=>p.vivo&&!['Nemico','Conoscente','Ex'].includes(p.ruolo)&&p.eta>=6).sort((a,b)=>(b.rapporto+bilancioRicordi(b)*4)-(a.rapporto+bilancioRicordi(a)*4)).slice(0,6);
  if(!L.length)return '';
  return `<div class="funerale"><div class="sec">Al funerale</div>${L.map(p=>{const m=ricordoDi(p,1);return `<div class="fun-p"><span class="volto-mini">${volto(lookDi(p),p.eta,p.sesso)}</span><span><b>${esc(p.nome)}</b> <small class="meta">${esc(ruoloLabel(p).toLowerCase())}</small>${m?`<br><small>Ricorda: ${esc(minus(m.s))}.</small>`:''}</span></div>`}).join('')}</div>`;
}
function renderMorte(V){
  const figli=S.relazioni.filter(p=>p.ruolo==='Figlio');
  const nip=S.relazioni.filter(p=>p.ruolo==='Nipote').length;
  const con=S.relazioni.find(p=>p.vivo&&p.ruolo==='Coniuge');
  const ricordo=S.karma>=65?`Sarà ricordat${g('o','a')} come una persona generosa e buona.`:S.karma<=35?'Non tutti ne sentiranno la mancanza.':`Lascia un bel ricordo in chi l'ha conosciut${g('o','a')}.`;
  const eredi=figli.filter(p=>p.vivo);
  V.innerHTML=`<div class="obit"><div class="cross">✝</div><h2>${esc(S.nome)} ${esc(S.cognome)}</h2><div class="yrs">${S.annoNascita} – ${S.annoNascita+S.eta}</div>
  <p>Si è ${g('spento','spenta')} a ${S.eta} anni, ${esc(S.causa)}. ${ricordo}</p>
  <div class="facts">
   ${kv('Carattere',esc(descrPers(S.pers,S.sesso)))}
   ${S.aspir?kv('Sogni realizzati',`${(S.aspOk||[]).length} su ${S.aspir.length}`):''}
   ${kv('Titolo di studio',esc(titoloLabel()))}
   ${kv('Ultimo lavoro',esc(S.ultimoLavoro||'Nessuno'))}
   ${kv('Patrimonio',eur(patrimonio()))}
   ${patrimonio()>0?kv('Eredità',esc(testoSuccessione())):''}
   ${kv('Coniuge',con?esc(con.nome):'—')}
   ${kv('Figli',figli.length)}${nip?kv('Nipoti',nip):''}
   ${kv('Fedina penale',S.fedina.length?'Sporca':'Pulita')}
   ${S.lusso&&S.lusso.onori.length?kv('Onorificenze',esc(S.lusso.onori.join(', '))):''}
   ${S.lusso&&S.lusso.fond?kv('Lascia',`la Fondazione ${esc(S.cognome)}`):''}
   ${S.lusso&&S.lusso.donato>=1000?kv('Ha donato',eur(S.lusso.donato*S.mondo.ip)):''}
   ${S.fama>0?kv('Fama',S.fama+'/100'):''}${S.social.follower?kv('Follower',nf(S.social.follower)):''}
   ${kv('Ultima residenza',esc(nomeLuogo(S.citta,S.prov)))}
  </div>
  ${funerale()}
  <div class="btns"><button class="btn ghost" id="btnFilm">Il film della tua vita</button>${eredi.map(p=>`<button class="btn" data-erede="${p.id}">Continua come ${esc(p.nome)} (${p.eta} anni)</button>`).join('')}
  <button class="btn ${eredi.length?'ghost':''}" id="btnRinasci">Vivi una vita nuova</button></div></div>`;
  V.querySelectorAll('[data-erede]').forEach(b=>b.onclick=()=>continuaCome(+b.dataset.erede));
  momentiDaMostrare=[];$('#btnFilm').onclick=()=>filmVita(true);
  if(!S.filmVisto&&animMomenti()){S.filmVisto=1;save();setTimeout(()=>filmVita(true),600)}
  $('#btnRinasci').onclick=()=>{S=null;save();render()};
}
function render(){
  renderTop();
  const V=$('#view'),N=$('#nav');
  if(!S){N.hidden=true;renderCrea(V);return}
  if(!S.vivo){N.hidden=true;renderMorte(V);return}
  N.hidden=false;
  document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.tab===tab));
  const st=V.scrollTop;
  ({vita:renderVita,scuola:renderScuola,lavoro:renderLavoro,persone:renderPersone,beni:renderBeni,attivita:renderAttivita})[tab](V);
  if(tab!=='vita')V.scrollTop=st;
}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{tab=t.dataset.tab;render();$('#view').scrollTop=0});
$('#btnAnno').onclick=()=>{tab='vita';mese()};
intro();load();render();initOnline();
