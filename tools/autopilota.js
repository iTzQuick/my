// Pilota automatico guidato dal carattere (solo per test e simulazioni).
// Da ottobre 2026 è più «umano» (vedi ANALISI.md): cerca lavoro meno spesso, a volte lascia la scuola,
// esce di casa più tardi, non tutti vogliono sposarsi o avere figli (preferenze decise una volta per vita).
window.AP={
 pref(){
  const F=S.fatti;
  if(F.apNozze===undefined)F.apNozze=chance(.6+pz('A')*.15);
  if(F.apFigli===undefined)F.apFigli=pesata([[0,22],[1,30],[2,38],[3,10]]);
  return F;
 },
 scegli(){
  const bs=[...document.querySelectorAll('#shA button:not([disabled])')];
  if(!bs.length)return false;
  const vere=bs.filter(b=>!b.classList.contains('close'));
  const L=vere.length?vere:bs;
  // dopo il diploma: circa metà si iscrive all'università (di più con buoni voti e famiglia agiata)
  const tit=(document.querySelector('#shT')||{}).textContent||'';
  if(tit==='E adesso?'){
   const uni=L.find(b=>/università/i.test(b.textContent));
   const pu=.27+((S.scuola.voto||50)-55)/150+({umile:-.12,media:0,agiata:.15}[S.classe]||0);
   if(uni&&chance(pu)){uni.click();return true}
   const lav=L.find(b=>/lavoro/i.test(b.textContent));if(lav&&chance(.7)){lav.click();return true}
  }
  const F=this.pref();
  // a chi sei attratt*: secondo l'orientamento (S.orient), non a caso
  const bU=L.find(x=>x.textContent.startsWith('Uomini')),bD=L.find(x=>x.textContent.startsWith('Donne'));
  if(bU&&bD){const o=S.orient||'etero';const t=o==='bi'?L.find(x=>x.textContent.startsWith('Entrambi')):((o==='omo')===(S.sesso==='M')?bU:bD);(t||bD).click();return true}
  if(tit==='La diagnosi'&&chance(.95)){const b=L.find(x=>/cure|Curati|Terapia|terapia/.test(x.textContent));if(b){b.click();return true}}
  if(tit==='Una proposta'&&!F.apNozze){const b=L.find(x=>/tempo|^No/.test(x.textContent));if(b){b.click();return true}}
  if(tit==='Un figlio?'&&vivi(['Figlio']).length>=F.apFigli){const b=L.find(x=>/Non ancora|Non voglio/.test(x.textContent));if(b){b.click();return true}}
  let best=null,bv=-9;
  for(const b of L.filter(x=>!/Cambia preferenze/.test(x.textContent))){const em=b.querySelector('em.incl');let v=Math.random()*1.2;if(em)v+=em.classList.contains('ok')?1:-1;if(v>bv){bv=v;best=b}}
  best.click();return true;
 },
 routine(){
  if(S.eta<6||S.carcere>0)return;
  const P0=S.pers;S.routine={};
  const fig=vivi(['Figlio']).some(p=>p.eta<18&&!p.fuori);
  const w={sport:.3+P0.C/150,amici:.2+P0.E/90,famiglia:.3+P0.A/200,hobby:S.hobby?.3+P0.O/150:0,studio:iscritto()?.7+P0.C/90:.1+P0.O/300,uscite:S.eta>=14?P0.E/140:0,schermi:.3+(100-P0.C)/200,volont:S.eta>=14?P0.A/450:0,partner:partnerAttuale()?1.1:0,figli:fig?1.4:0,extra:S.soldi<0&&S.eta>=16?.7:0,social:S.social.attivo?.15:0};
  const cap={sport:8,studio:22,schermi:14,uscite:10,volont:6,extra:10,hobby:8,amici:12,famiglia:10,partner:12,figli:20,social:5};
  const lib=Math.max(0,oreLibere()-14);
  const av=ATT_R.filter(a=>attDisponibile(a)&&w[a.id]);
  const W=av.reduce((s,a)=>s+w[a.id],0)||1;
  for(const a of av)S.routine[a.id]=Math.min(cap[a.id]||10,Math.floor(lib*w[a.id]/W));
  normalizzaRoutine();
 },
 mese(){
  if(S.mese===S.meseNascita||S.t%6===0)this.routine();
  if(S.carcere>0)return;
  const e=S.eta,F=this.pref();
  // a volte si lascia la scuola: voti bassi, poca voglia (in Italia il 9,8% tra 18 e 24 anni)
  if(S.scuola.stato==='superiori'&&e>=16&&S.scuola.voto<55&&chance(.01-pz('C')*.005)){S.scuola.stato='finita';log('Lasci la scuola.','b');return}
  if(['universita','magistrale'].includes(S.scuola.stato)&&S.scuola.voto<55&&chance(.01-pz('C')*.005)){S.scuola.stato='finita';log('Lasci l\'università.','b');return}
  // non tutti cercano lavoro: c'è chi resta a casa con i figli piccoli e chi smette di cercare (in Italia un terzo tra 15 e 64 anni è inattivo)
  if(F.apAttivo===undefined)F.apAttivo=chance(.7);
  const piccoli=vivi(['Figlio']).some(f=>f.eta<6&&!f.conEx)&&convivente();
  if(e>=18&&!S.lavoro&&!iscritto()&&!S.pensione&&e<64&&chance((.25+pz('C')*.1)*(F.apAttivo?1:.04)*(piccoli?.35:1))){
    const L=LAVORI.filter(j=>!requisitiJob(j).length&&!fatto('job_'+j.id)&&!j.nascosto);
    if(L.length){const sc=j=>stipLiv(j,0)*(.6+matchLavoro(j.id)/250)*(j.pt?.45:1)*(.8+Math.random()*.8);const b=L.sort((a,b)=>sc(b)-sc(a))[0];candidati(b.id);return}
  }
  if(e>=21&&S.lavoro&&JOB[S.lavoro.id].pt&&!iscritto()&&chance(.08)){
    const L=LAVORI.filter(j=>!j.pt&&!requisitiJob(j).length&&!fatto('job_'+j.id)&&!j.nascosto);
    if(L.length){candidati(pick(L).id);return}
  }
  // uscire di casa: in Italia in media a 30 anni
  if(S.casa.tipo==='genitori'&&e>=23&&S.lavoro&&!JOB[S.lavoro.id].pt&&S.soldi>P(6000)&&chance(e<28?.004:e<32?.012:.03)){cercaAffitto();return}
  if(e>=20&&e<50&&single()&&chance(.03+S.pers.E/3000)){cercaAmore();return}
  const pa=partnerAttuale();
  if(pa&&e>=22&&e<45&&(pa.ruolo==='Coniuge'||pa.conv)&&vivi(['Figlio']).length<F.apFigli&&!S.provano&&!S.gravidanza&&chance(.08)){apriPersona(pa.id);const b=[...document.querySelectorAll('#shA button:not([disabled])')].find(x=>/avere un figlio/i.test(x.textContent));if(b)b.click();else next();return}
  if(pa&&vivi(['Figlio']).length>=F.apFigli&&S.provano&&chance(.2)){S.provano=null;return}
  if(pa&&pa.ruolo==='Partner'&&!pa.conv&&e>=27&&pa.rapporto>=55&&chance(.02)){apriPersona(pa.id);const b=[...document.querySelectorAll('#shA button:not([disabled])')].find(x=>/vivere insieme/i.test(x.textContent));if(b)b.click();else next();return}
  if(pa&&pa.ruolo==='Partner'&&pa.conv&&e>=27&&pa.rapporto>=60&&F.apNozze&&chance(.018)){apriPersona(pa.id);const b=[...document.querySelectorAll('#shA button:not([disabled])')].find(x=>/sposarti/i.test(x.textContent));if(b)b.click();else next();return}
  if(S.soldi>P(30000)&&e>=30&&!casaMia()&&chance(.015)){compraCasa();return}
  if(S.malattie.some(m=>m.g===2)&&chance(.3)){faiAttivita(S.soldi>P(5000)?'clinica':'spec');return}
 }
};
