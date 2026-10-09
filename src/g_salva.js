/* ================= SALVATAGGI: browser, file, codice, online ================= */
const SALVA={locale:false,db:null,uid:null,dl:null,cloud:null,ultimoCloud:0,sporco:false,timer:null};
try{localStorage.setItem('vm_test','1');SALVA.locale=localStorage.getItem('vm_test')==='1';localStorage.removeItem('vm_test')}catch(e){SALVA.locale=false}

const b64da=buf=>{let s='';const u=new Uint8Array(buf);for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
const b64a=s=>{const b=atob(s);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u};
async function codiceDa(X){
  const t=JSON.stringify(X);
  try{if(typeof CompressionStream!=='undefined'){const st=new Blob([t]).stream().pipeThrough(new CompressionStream('gzip'));return 'VITAMIA1Z:'+b64da(await new Response(st).arrayBuffer())}}catch(e){}
  return 'VITAMIA1J:'+b64da(new TextEncoder().encode(t));
}
async function statoDaCodice(c){
  c=String(c||'').trim();
  if(c.startsWith('{'))return JSON.parse(c);
  const m=c.match(/^VITAMIA1([ZJ]):([A-Za-z0-9+/=\s]+)$/);
  if(!m)throw new Error('formato');
  const u=b64a(m[2].replace(/\s+/g,''));
  if(m[1]==='Z'){const st=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(st).text())}
  return JSON.parse(new TextDecoder().decode(u));
}
function caricaStato(X){
  if(!X||typeof X!=='object'||!X.nome||!Array.isArray(X.relazioni))throw new Error('stato');
  S=X;if(S.v===2)migra(S);if(S.v===3)migra3();
  if(S.v!==4)throw new Error('versione');
  if(S.social&&S.social.follower>CAP_FOLLOWER)S.social.follower=CAP_FOLLOWER;
  aggiornaStato();
  coda=[];tab='vita';sheetOpen=false;$('#scrim').hidden=true;save(true);render();
}
const nomeFile=()=>`my-${(S.nome+'-'+S.cognome).toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${S.eta}anni.my`;   // i vecchi .vitamia si caricano ancora

/* ---------- Online (solo per chi può scrivere nell'artifact) ---------- */
async function initOnline(){
  if(!window.claude||!claude.use)return;
  try{SALVA.dl=await claude.use('downloads')}catch(e){}
  try{
    const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);
    if(!db||!user)return;
    const uid=await user.id();if(!uid)return;
    SALVA.db=db;SALVA.uid=uid;
    const snap=await db.doc(`data/users/${uid}/partite`).get();
    if(snap&&snap.exists){const d=snap.data();SALVA.cloud=d&&d.z?d:null}
    if(!S&&SALVA.cloud)render();
    else if(S&&SALVA.cloud&&SALVA.cloud.t>(S.fatti._salvatoT||0)+60000&&SALVA.cloud.chi!==(S.nome+S.cognome+S.annoNascita)){render()}
  }catch(e){SALVA.db=null}
}
async function salvaOnline(){
  if(!SALVA.db||!SALVA.uid||!S)return false;
  try{
    const z=await codiceDa(S);
    if(z.length>240000)return false;
    const d={z,t:Date.now(),nome:S.nome+' '+S.cognome,eta:S.eta,anno:S.anno,mese:S.mese,vivo:S.vivo,chi:S.nome+S.cognome+S.annoNascita};
    await SALVA.db.doc(`data/users/${SALVA.uid}/partite`).set(d);
    SALVA.cloud=d;SALVA.ultimoCloud=Date.now();SALVA.sporco=false;return true;
  }catch(e){if(e&&(e.code==='invalid_argument'||e.code==='revoked'||e.code==='not_granted'))SALVA.db=null;return false}
}
function pianificaOnline(){
  if(!SALVA.db)return;SALVA.sporco=true;
  if(SALVA.timer)return;
  const att=Math.max(4000,30000-(Date.now()-SALVA.ultimoCloud));
  SALVA.timer=setTimeout(()=>{SALVA.timer=null;if(SALVA.sporco)salvaOnline()},att);
}
addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&SALVA.sporco)salvaOnline()});
addEventListener('pagehide',()=>{if(SALVA.sporco)salvaOnline()});

/* ---------- File e codice ---------- */
async function scaricaFile(){
  const txt=await codiceDa(S);const fn=nomeFile();
  if(SALVA.dl){
    try{await SALVA.dl.save({filename:fn,data:txt});S.fatti._fileT=S.t;save();return ['File di salvataggio scaricato. Per riprendere: «Carica una partita» → scegli il file.','g']}
    catch(e){if(e&&e.code==='cancelled')return ['Download annullato.','x']}
  }
  try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);S.fatti._fileT=S.t;save();return ['Se il download non parte, usa «Copia il codice».','']}
  catch(e){return ['Il download non è disponibile qui: usa «Copia il codice».','x']}
}
async function copiaCodice(){
  const c=await codiceDa(S);
  try{await navigator.clipboard.writeText(c);S.fatti._fileT=S.t;save();return [`Codice copiato (${Math.round(c.length/1000)} mila caratteri). Incollalo in una nota o mandatelo in chat: per riprendere, «Carica una partita» → «Incolla un codice».`,'g']}
  catch(e){mostraCodice(c);return KEEP}
}
function mostraCodice(c){
  showSheet({k:'Salvataggio',t:'Il tuo codice',p:'Non è stato possibile copiarlo da solo. Tieni premuto nel riquadro, seleziona tutto e copia.',chiudi:true,scelte:[]});
  const t=document.createElement('textarea');t.className='codice';t.readOnly=true;t.value=c;$('#shA').prepend(t);setTimeout(()=>{t.focus();t.select()},50);
}
function caricaFile(){
  const i=document.createElement('input');i.type='file';i.accept='.my,.vitamia,.txt,.json,text/plain,application/json';
  i.onchange=async()=>{const f=i.files&&i.files[0];if(!f)return;try{caricaStato(await statoDaCodice(await f.text()));toast('Partita caricata!')}catch(e){toast('Questo file non è un salvataggio di my valido.')}};
  i.click();
}
function incollaCodice(){
  showSheet({k:'Carica una partita',t:'Incolla il codice',p:'Incolla qui il codice di salvataggio che avevi copiato.',chiudi:true,scelte:[]});
  const w=document.createElement('div');w.className='cerca';
  w.innerHTML='<textarea class="codice" id="shCod" placeholder="VITAMIA1…" aria-label="Codice di salvataggio"></textarea><button class="btn" id="shCodOk">Carica</button>';
  $('#shA').prepend(w);
  $('#shCodOk').onclick=async()=>{try{caricaStato(await statoDaCodice($('#shCod').value));toast('Partita caricata!')}catch(e){toast('Codice non valido: controlla di averlo incollato tutto.')}};
  setTimeout(()=>$('#shCod').focus(),50);
}
async function riprendiOnline(){
  if(!SALVA.cloud)return;
  try{caricaStato(await statoDaCodice(SALVA.cloud.z));toast('Partita ripresa!')}catch(e){toast('Il salvataggio online non si legge.')}
}
function statoSalvataggio(){
  const r=[];
  r.push(SALVA.locale?'In questo browser: la partita si salva da sola a ogni mese.':'In questo browser la partita NON resta salvata: chiudendo la pagina si perde.');
  if(SALVA.db)r.push(`Online, sul tuo account: attivo${SALVA.cloud?` (ultimo salvataggio ${new Date(SALVA.cloud.t).toLocaleString('it-IT',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})})`:''}.`);
  else r.push('Online: non disponibile per chi apre il gioco da un link condiviso.');
  r.push('Per non perdere mai la partita, o per continuarla su un altro telefono, scarica il file o copia il codice.');
  return r.join('\n\n');
}
function apriSalvataggi(){
  const sc=[
    {l:'Scarica il file di salvataggio',sub:'Lo ricarichi quando vuoi, anche su un altro dispositivo',fx:()=>{scaricaFile().then(r=>{if(r){toast(r[0])}});return null}},
    {l:'Copia il codice di salvataggio',sub:'Da incollare in una nota o in chat',fx:()=>{copiaCodice().then(r=>{if(r&&r!==KEEP)toast(r[0])});return null}},
    {l:'Carica una partita da file',fx:()=>{caricaFile();return null}},
    {l:'Incolla un codice',fx:()=>{incollaCodice();return KEEP}}
  ];
  if(SALVA.db)sc.unshift({l:'Salva online adesso',sub:'Sul tuo account claude.ai',fx:()=>{salvaOnline().then(ok=>toast(ok?'Salvato online.':'Salvataggio online non riuscito.'));return null}});
  sc.forEach(c=>c._incl=0);
  showSheet({k:'Salvataggio',t:'La tua partita',p:statoSalvataggio(),chiudi:true,scelte:sc});
}
