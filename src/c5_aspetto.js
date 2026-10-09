/* ================= ASPETTO: il volto stilizzato che invecchia con te =================
   S.look e p.look = {pelle, capelli, taglio, occhi, maglia, barba} (indici nelle tavolozze; taglio e barba sono id).
   Attenzione: S.aspetto è la statistica (bellezza 0–100), il volto è S.look. */
const PELLE=['#F7DAC4','#EEC5A2','#DBA67E','#BE8157','#915C3B','#61402B'];
const CAPELLI=[['Neri','#241C18'],['Castano scuro','#4C3123'],['Castani','#7B5132'],['Ramati','#A8552D'],['Biondi','#D9B46F'],['Biondo cenere','#BCA78B']];
const OCCHI=[['Marroni','#5B3A22'],['Nocciola','#8B6A2E'],['Verdi','#4E7A4A'],['Azzurri','#4A84B8'],['Grigi','#7C8B97']];
const TAGLI=[['corti','Corti'],['rasati','Rasati'],['mossi','Mossi'],['caschetto','Caschetto'],['lunghi','Lunghi'],['raccolti','Raccolti'],['ricci','Ricci']];
const BARBE=[['no','Niente'],['corta','Barba'],['baffi','Baffi']];
const MAGLIE=['#2244D6','#21894F','#C98400','#C2386A','#C23B25','#6B4FC8','#1B8A8A','#3A4654'];

const pesaIdx=w=>{let t=w.reduce((a,b)=>a+b,0),x=Math.random()*t;for(let i=0;i<w.length;i++){x-=w[i];if(x<=0)return i}return 0};
function lookCasuale(sesso){
  return {pelle:pesaIdx([3,4,3,1.4,.9,.6]),capelli:pesaIdx([20,35,25,4,10,6]),occhi:pesaIdx([55,15,12,12,6]),
    taglio:sesso==='F'?pick(['lunghi','lunghi','caschetto','raccolti','ricci','mossi','corti']):pick(['corti','corti','rasati','mossi','ricci']),
    barba:sesso==='M'?pick(['no','no','no','corta','corta','baffi']):'no',maglia:r(0,MAGLIE.length-1)};
}
/* Genetica semplice: si somiglia ai genitori, con qualche sorpresa */
function lookFiglio(m,p,sesso){
  m=m||lookCasuale('F');p=p||lookCasuale('M');
  const occhi=(m.occhi===0||p.occhi===0)&&chance(.65)?0:chance(.9)?pick([m.occhi,p.occhi]):r(0,OCCHI.length-1);
  return {pelle:Math.max(0,Math.min(PELLE.length-1,Math.round((m.pelle+p.pelle)/2+(chance(.3)?pick([-1,1]):0)))),
    capelli:chance(.85)?pick([m.capelli,p.capelli]):r(0,CAPELLI.length-1),occhi,
    taglio:lookCasuale(sesso).taglio,barba:'no',maglia:r(0,MAGLIE.length-1)};
}
/* Chi non ha ancora un volto (salvataggi vecchi, persone nate in gioco) lo riceve qui */
function lookDi(p){
  if(!p)return lookCasuale('M');
  if(p===S){if(!S.look)S.look=lookCasuale(S.sesso);return S.look}
  if(!p.look){
    if(['Figlio','Nipote'].includes(p.ruolo)){const pa=S.relazioni.find(x=>['Coniuge','Ex','Partner'].includes(x.ruolo));p.look=lookFiglio(lookDi(S),pa&&lookDi(pa),p.sesso)}
    else p.look=lookCasuale(p.sesso);
  }
  return p.look;
}

function mixHex(a,b,t){const h=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16));const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
const coloreCapelli=(L,eta)=>{const c=CAPELLI[L.capelli][1];if(eta<42)return c;if(eta>=78)return '#E2DFDA';return mixHex(c,'#B7B4B0',Math.min(.9,(eta-42)/30))};

/* Il volto: viewBox 100×120. Fasi: neonato (<2), bambino (<13), ragazzo (<18), adulto, anziano (rughe da 55, capelli bianchi verso gli 80) */
function volto(L,eta,sesso,o){
  L=L||lookCasuale(sesso);o=o||{};eta=eta||0;
  const pelle=PELLE[L.pelle]||PELLE[1],cap=coloreCapelli(L,eta),occ=OCCHI[L.occhi]?OCCHI[L.occhi][1]:OCCHI[0][1],ma=MAGLIE[L.maglia]||MAGLIE[0];
  const ombra='rgba(60,30,20,.16)';
  const sfondo=o.sfondo===false?'':`<rect width="100" height="120" fill="${ma}" opacity=".14"/>`;
  let s='';
  if(eta<2){
    // neonato: testa tonda, ciuffo, tutina
    s+=`<path d="M22 120c0-20 12-30 28-30s28 10 28 30z" fill="${ma}"/>`;
    s+=`<circle cx="21" cy="64" r="6" fill="${pelle}"/><circle cx="79" cy="64" r="6" fill="${pelle}"/>`;
    s+=`<circle cx="50" cy="62" r="30" fill="${pelle}"/>`;
    s+=`<path d="M46 33c1-7 8-9 11-4" fill="none" stroke="${cap}" stroke-width="3.2" stroke-linecap="round"/>`;
    s+=`<circle cx="33" cy="72" r="6" fill="#F08C8C" opacity=".35"/><circle cx="67" cy="72" r="6" fill="#F08C8C" opacity=".35"/>`;
    s+=`<circle cx="40" cy="63" r="3.3" fill="#2B211C"/><circle cx="60" cy="63" r="3.3" fill="#2B211C"/><circle cx="41" cy="62" r="1" fill="#fff"/><circle cx="61" cy="62" r="1" fill="#fff"/>`;
    s+=`<path d="M46 73q4 3 8 0" fill="none" stroke="#9C4B3E" stroke-width="2" stroke-linecap="round"/>`;
    return `<svg class="volto" viewBox="0 0 100 120" aria-hidden="true">${sfondo}${s}</svg>`;
  }
  const bimbo=eta<13,adulto=eta>=18;
  // il bambino ha la testa più grande rispetto al corpo
  const T=bimbo?'translate(50 56) scale(1.1) translate(-50 -53)':eta<18?'translate(50 54) scale(1.04) translate(-50 -53)':'';
  // capelli dietro la testa
  const dietro={caschetto:`<path d="M21 52c0-26 15-35 29-35s29 9 29 35v24q0 4-4 4H25q-4 0-4-4z"/>`,
    lunghi:`<path d="M20 52c0-27 15-36 30-36s30 9 30 36l2 46q-16 7-32 5-16 2-32-5z"/>`,
    raccolti:`<circle cx="50" cy="17" r="10"/>`}[L.taglio]||'';
  const davanti={corti:`<path d="M26 50c-2-24 14-30 26-29 14 0 25 9 22 29-4-10-14-16-26-15-10 0-18 7-22 15z"/>`,
    rasati:`<path d="M27 46c1-18 13-23 23-23s22 5 23 23c-7-10-39-10-46 0z" opacity=".55"/>`,
    mossi:`<path d="M23 56c-5-26 13-39 29-38 18 0 32 14 25 38-3-10-5-14-11-18-8 4-22 4-30 0-6 4-10 10-13 18z"/>`,
    caschetto:`<path d="M27 46c0-18 13-24 23-24 12 0 23 6 23 24-7-8-15-10-23-9-8-1-16 1-23 9z"/>`,
    lunghi:`<path d="M26 50c-1-22 14-29 26-29 12 0 23 8 22 27-8-14-24-18-34-12-7 4-11 8-14 14z"/>`,
    raccolti:`<path d="M26 48c0-20 13-26 24-26s24 6 24 26c-6-9-15-12-24-12s-18 3-24 12z"/>`,
    ricci:`<g><circle cx="30" cy="40" r="9"/><circle cx="36" cy="30" r="10"/><circle cx="47" cy="24" r="11"/><circle cx="59" cy="25" r="10"/><circle cx="69" cy="32" r="10"/><circle cx="72" cy="43" r="8"/><circle cx="27" cy="50" r="6"/><circle cx="74" cy="51" r="6"/></g>`}[L.taglio]||'';
  // capelli dietro: prima del collo e delle spalle (i capelli lunghi cadono dietro, non coprono il collo)
  s+=`<g transform="${T}"><g fill="${cap}">${dietro}</g></g>`;
  // corpo
  s+=bimbo?`<path d="M20 120c0-18 13-27 30-27s30 9 30 27z" fill="${ma}"/>`:`<path d="M14 120c0-22 16-32 36-32s36 10 36 32z" fill="${ma}"/>`;
  s+=`<rect x="43" y="72" width="14" height="${bimbo?24:20}" rx="6" fill="${pelle}"/>`;
  s+=`<g transform="${T}">`;
  s+=`<circle cx="26" cy="55" r="5" fill="${pelle}"/><circle cx="74" cy="55" r="5" fill="${pelle}"/>`;
  s+=`<ellipse cx="50" cy="52" rx="24" ry="${bimbo?27:29}" fill="${pelle}"/>`;
  if(bimbo)s+=`<circle cx="36" cy="63" r="5" fill="#F08C8C" opacity=".28"/><circle cx="64" cy="63" r="5" fill="#F08C8C" opacity=".28"/>`;
  // occhi
  s+=`<circle cx="41" cy="54" r="3.4" fill="#fff"/><circle cx="59" cy="54" r="3.4" fill="#fff"/><circle cx="41" cy="54.3" r="2.6" fill="${occ}"/><circle cx="59" cy="54.3" r="2.6" fill="${occ}"/><circle cx="41" cy="54.3" r="1.2" fill="#1E1714"/><circle cx="59" cy="54.3" r="1.2" fill="#1E1714"/>`;
  if(!bimbo)s+=`<path d="M36 47.5q5-2.5 10 0M54 47.5q5-2.5 10 0" fill="none" stroke="${cap}" stroke-width="2.2" stroke-linecap="round"/>`;
  s+=`<path d="M50 57q-2.5 5 .5 6.5" fill="none" stroke="${ombra}" stroke-width="2" stroke-linecap="round"/>`;
  if(eta>=55)s+=`<path d="M33.5 52.5l-3-1.2M33.5 56l-3 1.2M66.5 52.5l3-1.2M66.5 56l3 1.2" stroke="${ombra}" stroke-width="1.3" stroke-linecap="round"/>`;
  if(eta>=68)s+=`<path d="M42 37q8-2.5 16 0M44 41q6-1.5 12 0" fill="none" stroke="${ombra}" stroke-width="1.3" stroke-linecap="round"/>`;
  const barba=adulto&&sesso==='M'?L.barba:'no';
  if(barba==='corta')s+=`<path d="M27 55c1 19 11 27 23 27s22-8 23-27c-3 10-11 14-23 14s-20-4-23-14z" fill="${cap}" opacity=".92"/>`;
  s+=`<path d="M44 ${barba==='corta'?65:66}q6 5 12 0" fill="none" stroke="#8E4A3C" stroke-width="2.2" stroke-linecap="round"/>`;
  if(barba==='baffi')s+=`<path d="M42 63.5q8-5 16 0-4 3-8 1-4 2-8-1z" fill="${cap}"/>`;
  s+=`<g fill="${cap}">${davanti}</g>`;
  s+='</g>';
  return `<svg class="volto" viewBox="0 0 100 120" aria-hidden="true">${sfondo}${s}</svg>`;
}
