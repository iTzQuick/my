/* ================= LUOGHI ================= */
const REG_BREVE=r=>r.replace('/Südtirol','').replace("/Vallée d'Aoste",'');
const REG_MQ={'Lombardia':2300,'Lazio':2400,'Trentino-Alto Adige':2900,'Liguria':2500,'Toscana':2500,"Valle d'Aosta":2500,'Veneto':1900,'Emilia-Romagna':1900,'Campania':1800,'Piemonte':1450,'Friuli-Venezia Giulia':1500,'Marche':1400,'Umbria':1300,'Abruzzo':1300,'Puglia':1400,'Sardegna':1900,'Sicilia':1200,'Basilicata':1100,'Calabria':1000,'Molise':1000};
const PROV={};PROVINCE.forEach(p=>{p.r=REG_BREVE(p.r);PROV[p.s]=p});
const REGIONI=[...new Set(PROVINCE.map(p=>p.r))].sort((a,b)=>a.localeCompare(b,'it'));
let _COM=null;
function comuni(){if(!_COM)_COM=COMUNI_RAW.split(';').map(x=>{const [n,s,p]=x.split('|');return {n,s,p:+p}});return _COM}
function trovaComune(n,s){const L=comuni();return L.find(c=>c.n===n&&(!s||c.s===s))||L.find(c=>c.n===n)||null}
function capoluogo(s){const L=comuni().filter(c=>c.s===s);const pn=PROV[s]&&PROV[s].n;return L.find(c=>c.n===pn)||L.sort((a,b)=>b.p-a.p)[0]}
function comuneCaso(){const L=comuni();let t=0;for(const c of L)t+=Math.sqrt(c.p);let x=Math.random()*t;for(const c of L){x-=Math.sqrt(c.p);if(x<=0)return c}return L[0]}
function cittaInfo(n,s){
  const big=CITTA.find(c=>c.n===n);const est=CITTA_ESTERE.find(c=>c.n===n);
  if(est)return {n,mq:est.mq,reg:'Estero',zona:'Estero',estero:true,p:1000000};
  const c=trovaComune(n,s||(S&&S.citta===n?S.prov:null));
  const pr=c?PROV[c.s]:null;
  const reg=pr?pr.r:'Lazio';
  let mq;
  if(big)mq=big.mq;else{const pop=c?c.p:20000;mq=Math.round((REG_MQ[reg]||1500)*Math.max(.6,Math.min(1.25,.65+.13*Math.log10(Math.max(pop,300)/1000)))/10)*10}
  return {n,mq,reg,zona:pr?pr.z:'Centro',s:c?c.s:null,p:c?c.p:0,prov:pr?pr.n:''};
}
function luogo(){return cittaInfo(S.citta,S.prov)}
function nomeLuogo(n,s){const est=CITTA_ESTERE.find(c=>c.n===n);if(est)return n;return s?`${n} (${s})`:n}
function cercaLuoghi(q,esteri){
  q=q.trim().toLowerCase();const out=[];
  if(esteri)for(const c of CITTA_ESTERE)if(!q||c.n.toLowerCase().includes(q))out.push({n:c.n,s:null,estero:true,p:1e6});
  if(!q){CITTA.forEach(c=>{const x=trovaComune(c.n);if(x)out.push(x)});return out}
  const L=comuni();const pre=[],mid=[];
  for(const c of L){const nl=c.n.toLowerCase();if(nl.startsWith(q))pre.push(c);else if(nl.includes(q))mid.push(c)}
  pre.sort((a,b)=>b.p-a.p);mid.sort((a,b)=>b.p-a.p);
  return out.concat(pre,mid);
}
