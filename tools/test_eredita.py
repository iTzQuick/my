"""Fase 5.4 — eredità tra generazioni: chi continua come un figlio riceve la sua parte vera di quello che il genitore lascia.
Prove: la seconda generazione parte pulita (famiglia, coniuge, orientamento, classe), il riparto torna al centesimo (quello che ricevono
TUTTI gli eredi + imposte + spese − debiti rimasti scoperti = massa netta; nessuno riceve più della sua quota; imposta sul netto dei debiti),
l'eredità di debiti (accettare, beneficio d'inventario, rinuncia; minorenni; pilota automatico; foglio perso), la parte del genitore rimasto
(S.fatti.eredAttesa) e i salvataggi che non ce l'hanno. Poi N vite: la prima generazione muore, la seconda gioca 30 anni con gli invarianti.

    python tools/test_eredita.py        # prove + 20 vite
    python tools/test_eredita.py 40
"""
import pathlib, sys
from collections import Counter
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
AP = (ROOT/'tools'/'autopilota.js').read_text(encoding='utf-8')
INV = (ROOT/'tools'/'invarianti.js').read_text(encoding='utf-8')
N = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 20
JS_BASE = r'''()=>{
 const ko=[],errs=[];window.addEventListener('error',e=>errs.push(e.message));
 window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 const near=(a,b,e)=>Math.abs(a-b)<=(e||1e-9);
 const TIT="Un'eredità di debiti";
 const aperto=()=>!document.querySelector('#scrim').hidden;
 const titolo=()=>(document.querySelector('#shT')||{}).textContent||'';
 const bottoni=()=>[...document.querySelectorAll('#shA button:not([disabled])')].filter(b=>!b.classList.contains('close'));
 const chiudi=()=>{let g=0;while(aperto()&&g++<20){const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}};
 const diario=()=>S.log.map(b=>b.righe.map(r=>r.t).join(' | ')).join(' | ');
 // chi muore: nato nel 1950, ha E anni (l'anno è 1950+E)
 const base=E=>{nuovaVita({sesso:'M',nome:'Aldo',cognome:'Prova',citta:'Milano',prov:'MI',anno:1950});S.eta=E;S.anno=1950+E;S.t=E*12+3;S.mese=(S.meseNascita+3)%12;
   S.relazioni=[];S.gruppi=[];S.legami=[];coda.length=0;S.futuri.length=0;S.citta='Bologna';S.prov='BO';
   S.soldi=0;S.prop=[];S.veicoli=[];S.prestiti=[];S.borsa={};S.azienda=null;S.lusso=null;S.testamento=null;S.lavoro=null};
 const fam=o=>{const E=S.eta,F={nip:[]};
   if(o.con)F.con=nuovaPersona('Coniuge','F',E-2,null,{rapporto:80,conv:true});
   F.figli=(o.figli||[]).map((d,i)=>{const f=nuovaPersona('Figlio',i%2?'F':'M',E-d,S.cognome,{});f.coppia='single';return f});
   if(o.premorto){const m=nuovaPersona('Figlio','M',E-25,S.cognome,{});m.vivo=false;F.orfani=[nuovaPersona('Nipote','F',20,null,{gen:m.id}),nuovaPersona('Nipote','M',17,null,{gen:m.id})]}
   for(let i=0;i<(o.nipErede||0);i++)F.nip.push(nuovaPersona('Nipote','M',3+3*i,null,{gen:F.figli[0].id}));
   if(o.madre)nuovaPersona('Madre','F',E+22,null,{});
   if(o.fratello)F.fratello=nuovaPersona('Fratello','M',E-3,S.cognome,{});
   if(o.amico)F.amico=nuovaPersona('Amico','M',E,null,{rapporto:90});
   F.pid=F.figli.length?F.figli[0].id:null;return F};
 const casa=(v,mutuo)=>({id:S.nextId++,tipo:'Trilocale',citta:S.citta,valore:v,stato:60,...(mutuo?{mutuo:{residuo:mutuo,rata:Math.round(mutuo/12),anni:12,tipo:'fisso',tasso:3.5}}:{})});
 // 0 benestante · 1 beni e debiti · 2 più debiti che beni · 3 niente · 4 milionario con il mutuo
 const beni=k=>{S.prop=[];S.prestiti=[];S.veicoli=[];S.lusso=null;S.soldi=0;
   if(k===0){S.soldi=P(180000);S.prop=[casa(P(260000))]}
   if(k===1){S.soldi=P(30000);S.prop=[casa(P(240000),P(90000))];S.prestiti=[{n:'Prestito personale',residuo:P(12000),rata:P(3000),anni:4,tasso:.085}];LX().coll.orologi=[{i:0,v:P(7000)}];
     S.veicoli=[{id:S.nextId++,n:'Utilitaria',valore:P(6000),stato:60,costo:0,prestito:{rata:P(1500),anni:2}}]}
   if(k===2){S.soldi=-P(40000);S.prestiti=[{n:'Prestito personale',residuo:P(60000),rata:P(9000),anni:5,tasso:.085}];S.veicoli=[{id:S.nextId++,n:'Utilitaria',valore:P(5000),stato:50,costo:0}]}
   if(k===4){S.soldi=P(400000);S.prop=[casa(P(4200000),P(1500000))]}};
 // il conto deve tornare: quello che ricevono tutti + imposte + spese − debiti scoperti = massa netta; nessuno oltre la sua quota
 const conto=(R,tag)=>{const N=R.M.netto,sx=R.righe.reduce((s,r)=>s+r.x,0);
   if(sx+R.imposte+R.spese-R.scoperto!==N)ko.push(tag+': il conto non torna ('+sx+' + '+R.imposte+' + '+R.spese+' − '+R.scoperto+' ≠ '+N+')');
   if(Math.abs(N-patrimonio())>1||R.M.attivo-R.M.passivo!==N)ko.push(tag+': massa netta '+N+' ≠ patrimonio '+patrimonio());
   if(R.spese<0||R.imposte<0||R.scoperto<0||(N>=0&&R.scoperto!==0))ko.push(tag+': spese/imposte/scoperto '+[R.spese,R.imposte,R.scoperto]);
   if(R.righe.length&&!near(R.righe.reduce((s,r)=>s+r.q,0),1))ko.push(tag+': le quote non sommano a 1');
   let it=0;
   for(const r of R.righe){it+=r.imposta;
     if(N>0){if(r.x>r.q*N+1e-6||r.x<0)ko.push(tag+': '+r.p.ruolo+' riceve '+r.x+' con quota '+(r.q*N).toFixed(0));
       if(r.lordo>r.q*N+1e-6)ko.push(tag+': imposta calcolata su più del netto');
       if(r.imposta!==Math.min(r.lordo,impostaEredita(r.lordo,r.p.ruolo)))ko.push(tag+': imposta di '+r.p.ruolo+' '+r.imposta)}
     else if(r.x>0||r.x<r.q*N-1)ko.push(tag+': '+r.p.ruolo+' con '+r.x+' di debiti, quota '+(r.q*N).toFixed(0))}
   if(it!==R.imposte)ko.push(tag+': somma delle imposte');
   return R};
 const FAM=[{con:1,figli:[28]},{con:1,figli:[28,31,34]},{con:1,figli:[28,31,34],nipErede:2},{figli:[28,31],premorto:1},{figli:[28]},{figli:[28],nipErede:1},
   {con:1,figli:[28],madre:1,fratello:1,nipErede:1},{figli:[28,30],madre:1,fratello:1,amico:1}];

 // 1) il riparto: ogni famiglia × ogni patrimonio × testamento × scelta, nel 1998, nel 2003 (niente imposta) e nel 2030
 for(const E of [80,48,53])for(let fi=0;fi<FAM.length;fi++)for(let k=0;k<5;k++)for(let tv=0;tv<5;tv++){
   base(E);const F=fam(FAM[fi]);beni(k);
   const dest=[null,F.amico&&[{pid:F.amico.id}],[{ente:'beneficenza'}],[{nipoti:1}],F.figli[1]&&[{pid:F.figli[1].id}]][tv];
   if(tv&&!dest)continue;if(dest)S.testamento={t:0,eta:S.eta,dest};
   const tag=`E${E} fam${fi} beni${k} test${tv}`,R={};
   try{for(const sc of ['pura','beneficio','rinuncia'])R[sc]=conto(ripartoEredita(S,F.pid,sc),tag+' '+sc)}catch(e){ko.push(tag+': '+e.message);continue}
   const N=R.pura.M.netto;
   if(!R.pura.mia||R.pura.mia.q<=0)ko.push(tag+': il figlio non è tra gli eredi');
   if(R.rinuncia.mia)ko.push(tag+': chi rinuncia è ancora erede');
   if(N>0&&JSON.stringify(R.pura.righe.map(r=>r.x))!==JSON.stringify(R.beneficio.righe.map(r=>r.x)))ko.push(tag+': con beni il beneficio d\'inventario cambia le parti');
   if(N<0){if(R.pura.mia.x>=0)ko.push(tag+': accettando non arrivano debiti');if(R.beneficio.righe.some(r=>r.x)||R.rinuncia.righe.some(r=>r.x))ko.push(tag+': debiti senza accettare');
     if(R.pura.righe.some(r=>r.x&&r.p.id!==F.pid))ko.push(tag+': debiti a una persona del gioco')}
   if(E===53&&R.pura.imposte)ko.push(tag+': imposta nel 2003');
   // la rinuncia: al tuo posto i tuoi figli (rappresentazione), altrimenti la parte va agli altri
   const qr=p=>{const r=R.rinuncia.righe.find(z=>z.p.id===p.id);return r?r.q:0},qp=p=>{const r=R.pura.righe.find(z=>z.p.id===p.id);return r?r.q:0};
   if(F.nip.length&&!tv&&!near(F.nip.reduce((s,p)=>s+qr(p),0),R.pura.mia.q))ko.push(tag+': rinuncia, ai figli del rinunciante '+F.nip.reduce((s,p)=>s+qr(p),0)+' invece di '+R.pura.mia.q);
   if(!F.nip.length)for(const r of R.pura.righe)if(r.p.id!==F.pid&&qr(r.p)<r.q-1e-9)ko.push(tag+': rinuncia, la parte di '+r.p.ruolo+' cala');
   if(!F.nip.length&&!tv&&F.figli.length>1&&!near(F.figli.slice(1).reduce((s,p)=>s+qr(p)-qp(p),0)+(F.orfani||[]).reduce((s,p)=>s+qr(p)-qp(p),0),R.pura.mia.q))ko.push(tag+': rinuncia, la parte non va ai fratelli');
 }
 // l'imposta: sul netto dei debiti, 4% oltre un milione in linea retta; 6% oltre 100.000 € ai fratelli; 8% agli altri; niente agli enti e allo Stato
 {base(80);const F=fam({figli:[28]});beni(4);const R=ripartoEredita(S,F.pid),m=R.mia,att=Math.round((m.lordo-P(1e6))*.04),lorda=Math.round((Math.floor(R.M.attivo*.96)-P(1e6))*.04);
  if(m.imposta!==att||att<=0)ko.push('imposta del figlio '+m.imposta+' invece di '+att);if(m.imposta>=lorda)ko.push('imposta calcolata sul lordo dei debiti');
  if(m.lordo!==R.M.netto-R.spese)ko.push('figlio unico: lordo '+m.lordo);
  base(80);fam({fratello:1});beni(0);let r=conto(ripartoEredita(S,null),'solo fratello').righe[0];if(r.p.ruolo!=='Fratello'||r.imposta!==Math.round(Math.max(0,r.lordo-P(1e5))*.06)||!r.imposta)ko.push('imposta del fratello '+r.imposta);
  base(80);let G=fam({amico:1});beni(0);S.testamento={t:0,eta:80,dest:[{pid:G.amico.id}]};r=conto(ripartoEredita(S,null),'solo amico').righe[0];if(r.p.ruolo!=='Amico'||r.imposta!==Math.round(r.lordo*.08))ko.push('imposta dell\'amico '+r.imposta);
  base(80);fam({});beni(0);S.testamento={t:0,eta:80,dest:[{ente:'beneficenza'}]};r=conto(ripartoEredita(S,null),'beneficenza').righe[0];if(r.p.ruolo!=='Ente'||r.imposta)ko.push('la beneficenza paga l\'imposta');
  base(80);fam({});beni(0);r=conto(ripartoEredita(S,null),'nessun erede').righe[0];if(!r||r.p.ruolo!=='Stato'||r.imposta)ko.push('senza eredi non va allo Stato');
  base(80);G=fam({figli:[28]});beni(0);r=conto(ripartoEredita(S,G.pid,'rinuncia'),'figlio unico che rinuncia').righe[0];if(!r||r.p.ruolo!=='Stato')ko.push('figlio unico che rinuncia: '+(r&&r.p.ruolo))}

 // 2) la seconda generazione parte pulita (commit 0): famiglia, campi copiati, coniuge, orientamento, classe; poi 24 mesi con gli invarianti
 const gioca=(mesi,tag)=>{try{for(let m=0;m<mesi&&S.vivo;m++){mese();chiudi();const v=INV.controlla();if(v.length){ko.push(tag+' inv mese '+m+': '+v.slice(0,2).map(z=>z.join(': ')).join(' | '));break}}}
   catch(e){errs.push(tag+': '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' / '))}coda.length=0;sheetOpen=false;document.querySelector('#scrim').hidden=true};
 const FAMIGLIA=['Madre','Padre','Fratello','Nonno','Figlio'];
 for(let i=0;i<60;i++){
   base(i%2?80:48);const E=S.eta,min=i%4===0;S.soldi=P(i%3===0?900000:i%3===1?120000:5000);
   const mo=nuovaPersona('Coniuge','F',E-2,null,{rapporto:80,conv:true});mo.nozze=300;mo.soldiNozze=1000;ricorda(mo,'Le hai regalato un anello');
   const f=nuovaPersona('Figlio','M',min?16:E-26,S.cognome,{});
   f.sesso=i%2?'F':'M';f.coppia=min?'single':'sposato';if(i%3)f.pNome='Marta';if(i%5===0){f.pSesso=f.sesso;f.orient='omo'}
   f.pId=99999;f.nv={x:1};ricorda(f,'Gli hai regalato una casa');f.casaRegalata=true;f.luttoT=S.t-5;
   const f2=nuovaPersona('Figlio','F',E-30,S.cognome,{});ricorda(f2,'Hai litigato');f2.lav={id:'x'};
   if(!min){const np=nuovaPersona('Nipote','M',E>60?12:1,null,{gen:f.id});np.nv={a:1}}
   nuovaPersona('Madre','F',E+22,null,{});
   const R0=conto(ripartoEredita(S,f.id),'gen2 '+i);
   continuaCome(f.id);
   if(aperto())ko.push('gen2: un foglio aperto senza debiti: '+titolo());
   const R=S.relazioni,by=r=>R.filter(p=>p.ruolo===r);
   if(S.soldi!==R0.mia.x)ko.push('gen2: soldi '+S.soldi+' invece di '+R0.mia.x);
   if(S.t!==S.eta*12+(S.mese-S.meseNascita+12)%12)ko.push('gen2: '+S.t+' mesi di vita a '+S.eta+' anni (i mesi dopo il compleanno non contano)');
   if(S.fatti.cittaNascita!=='Bologna'||S.fatti.provNascita!=='BO')ko.push('cittaNascita: '+S.fatti.cittaNascita);
   for(const p of R){if(!FAMIGLIA.includes(p.ruolo))continue;
     if((p.ricordi||[]).length)ko.push('ricordi copiati: '+p.ruolo);
     for(const k of ['lav','nv','nozze','soldiNozze','intim','gen','casaRegalata','conv'])if(p[k]!==undefined)ko.push('campo copiato '+k+' su '+p.ruolo);
     if(p.ultimo!==S.t)ko.push('ultimo non aggiornato');if(p.da>S.t)ko.push('da nel futuro: '+p.ruolo);
     if(p.pId)ko.push('pId orfano su '+p.ruolo)}
   if(by('Madre').length!==1||by('Fratello').length!==1||by('Nonno').length!==1)ko.push('famiglia: '+R.map(p=>p.ruolo).join(','));
   const co=by('Coniuge');
   if(f.coppia==='sposato'){
     if(co.length!==1)ko.push('coniuge mancante');
     else{if(i%3&&co[0].nome!=='Marta')ko.push('nome del coniuge: '+co[0].nome);
       if((i%5===0)!==(co[0].sesso===S.sesso))ko.push('sesso del coniuge');
       if(!co[0].conv||S.casa.tipo==='genitori')ko.push('coniuge convivente ma casa dei genitori');
       if(by('Figlio').length!==1)ko.push('figlio dell\'erede mancante')}
     if(i%5===0){if(S.orient!=='omo'||S.attrazione!==S.sesso)ko.push('orientamento: '+S.orient+'/'+S.attrazione)}
     else if(S.orient!=='etero'||S.attrazione)ko.push('orientamento etero atteso: '+S.orient+'/'+S.attrazione);
   }else{if(co.length)ko.push('coniuge per un sedicenne');if(S.attrazione)ko.push('attrazione a 16 anni')}
   const q=S.soldi,att=q>P(300000)?'agiata':q>P(40000)?'media':'umile';if(S.classe!==att)ko.push('classe '+S.classe+' con '+q);
   const iv=INV.controlla();if(iv.length)ko.push('gen2 inv: '+iv.slice(0,2).map(z=>z.join(': ')).join(' | '));
   gioca(24,'gen2 '+i);
 }

 // 3) con dei beni: la tua parte, quella del genitore rimasto messa da parte, il riassunto
 {base(80);const F=fam({con:1,figli:[28,31,34],nipErede:1});beni(1);const R=conto(ripartoEredita(S,F.pid),'con beni'),rc=R.righe.find(r=>r.p.id===F.con.id);
  continuaCome(F.pid);const E=S.fatti.eredita,A=S.fatti.eredAttesa;
  if(aperto())ko.push('con beni: foglio aperto');
  if(!E||E.x!==R.mia.x||E.attivo!==R.M.attivo||E.passivo!==R.M.passivo||E.netto!==R.M.netto||!near(E.q,R.mia.q)||E.scelta!=='pura'||E.pend||E.debito)ko.push('con beni: riassunto '+JSON.stringify(E));
  if(!A||A.pid!==F.con.id||A.x!==rc.x||!(A.x>0))ko.push('con beni: parte del genitore rimasto '+JSON.stringify(A));
  if(S.soldi!==R.mia.x||S.prestiti.length)ko.push('con beni: soldi '+S.soldi+', prestiti '+S.prestiti.length);
  if(!/Erediti/.test(diario())||!/lascia beni per/.test(diario()))ko.push('con beni: diario '+diario().slice(0,200))}

 // 4) più debiti che beni, da adulto: tre scelte; solo chi accetta e paga porta a casa la sua parte di debiti
 for(const [fi,o] of [[0,{con:1,figli:[28,31]}],[1,{figli:[28],nipErede:1}],[2,{figli:[28]}],[3,{figli:[28,31,34]}]])for(let sc=0;sc<3;sc++){
   base(80);const F=fam(o);beni(2);const tag='debiti fam'+fi+' scelta'+sc;
   const R=conto(ripartoEredita(S,F.pid,'pura'),tag);conto(ripartoEredita(S,F.pid,'beneficio'),tag);conto(ripartoEredita(S,F.pid,'rinuncia'),tag);
   continuaCome(F.pid);const E=S.fatti.eredita,deb=-R.mia.x;
   if(!aperto()||titolo()!==TIT){ko.push(tag+': il foglio non si apre ('+titolo()+')');continue}
   const bs=bottoni();if(bs.length!==3){ko.push(tag+': scelte '+bs.length);chiudi();continue}
   if(!/beneficio/.test(bs[1].textContent))ko.push(tag+': il beneficio d\'inventario non è tra le scelte');
   if(!E.pend||E.debito!==deb||!(deb>0)||S.soldi!==0)ko.push(tag+': prima della scelta '+JSON.stringify(E)+' soldi '+S.soldi);
   if(/undefined|NaN|\{[A-Za-z]+\}/.test(document.querySelector('#shP').textContent+document.querySelector('#shA').textContent))ko.push(tag+': testo rotto');
   const fr=vivi(['Fratello']),prima=fr.reduce((s,p)=>s+p.rapporto,0);
   bs[sc].click();chiudi();
   if(E.pend||E.scelta!==['pura','beneficio','rinuncia'][sc])ko.push(tag+': scelta '+E.scelta);
   if(sc===0){if(S.prestiti.length!==1||S.prestiti[0].residuo!==deb||E.debito!==deb||!(S.prestiti[0].rata>0))ko.push(tag+': debito ereditato '+JSON.stringify(S.prestiti))}
   else if(S.prestiti.length||E.debito)ko.push(tag+': debiti senza averli accettati');
   if(S.soldi!==0)ko.push(tag+': soldi '+S.soldi);
   if(sc===2&&fr.length&&!vivi(['Figlio']).length&&fr.reduce((s,p)=>s+p.rapporto,0)>=prima)ko.push(tag+': i fratelli non se la prendono');
   if(S.fatti.eredAttesa&&S.fatti.eredAttesa.x)ko.push(tag+': il genitore rimasto eredita da un\'eredità di debiti');
   successionePendente();if(coda.some(q=>q.e.id==='ered_debiti'))ko.push(tag+': la domanda torna dopo la scelta');
   gioca(24,tag);
 }
 // minorenne: beneficio d'inventario per legge, nessuna scelta e nessun debito
 {base(48);const F=fam({con:1,figli:[32]});beni(2);continuaCome(F.pid);const E=S.fatti.eredita;
  if(S.eta!==16||aperto()||E.scelta!=='beneficio'||E.pend||E.debito||S.prestiti.length||S.soldi!==0)ko.push('minorenne: '+JSON.stringify(E)+' foglio '+aperto());
  if(!/beneficio d'inventario/.test(diario()))ko.push('minorenne: manca la riga di diario');gioca(24,'minorenne')}
 // il foglio perso (partita ricaricata prima di scegliere): la domanda torna
 {base(80);const F=fam({figli:[28]});beni(2);continuaCome(F.pid);
  sheetOpen=false;document.querySelector('#scrim').hidden=true;coda.length=0;S=JSON.parse(JSON.stringify(S));
  successionePendente();successionePendente();
  if(coda.filter(q=>q.e.id==='ered_debiti').length!==1)ko.push('foglio perso: la domanda non torna (una volta)');
  next();if(!aperto()||titolo()!==TIT)ko.push('foglio perso: non si riapre');else{bottoni()[1].click();chiudi()}
  if(S.fatti.eredita.pend||S.fatti.eredita.scelta!=='beneficio')ko.push('foglio perso: scelta '+S.fatti.eredita.scelta)}
 // il pilota automatico sa scegliere
 {const viste=new Set();
  for(let i=0;i<60;i++){base(80);const F=fam({figli:[28,31]});beni(2);continuaCome(F.pid);S.pers.C=i%2?90:40;S.pers.A=i%2?90:40;
    let g=0;while(sheetOpen&&g++<10)AP.scegli();const E=S.fatti.eredita;
    if(E.pend||!E.scelta){ko.push('pilota: scelta non fatta');break}viste.add(E.scelta);
    if((E.scelta==='pura')!==(S.prestiti.length===1))ko.push('pilota: debito e scelta non coincidono')}
  if(viste.size<2)ko.push('pilota: sceglie sempre '+[...viste])}

 // 5) quando muore anche il genitore rimasto: la sua parte vera, niente casa estratta a caso
 for(let i=0;i<12;i++){base(80);const F=fam({con:1,figli:[28,31,34]});beni(i%2);continuaCome(F.pid);
   const A=S.fatti.eredAttesa,n=vivi(['Fratello']).length+1,lordo=Math.floor((A.x-Math.round(A.x*.04))/n),att=lordo-Math.min(lordo,impostaSucc(lordo));
   const prima=S.soldi,madre=vivi(['Madre'])[0];coda.length=0;mortePersona(madre);
   if(S.soldi-prima!==att||!(att>0))ko.push('genitore rimasto: '+(S.soldi-prima)+' invece di '+att);
   if(S.fatti.eredAttesa)ko.push('genitore rimasto: eredAttesa resta');
   if(coda.some(q=>q.e.id==='eredita_casa')||/dai tuoi genitori\./.test(diario()))ko.push('genitore rimasto: è partita la vecchia eredità');
   if(att*n>A.x)ko.push('genitore rimasto: divisi più soldi di quelli che aveva');coda.length=0}
 {base(80);const F=fam({con:1,figli:[28]});beni(2);continuaCome(F.pid);bottoni()[1].click();chiudi();const prima=S.soldi;coda.length=0;mortePersona(vivi(['Madre'])[0]);
  if(S.soldi!==prima||coda.some(q=>q.e.id==='eredita_casa'))ko.push('genitore rimasto senza beni: '+(S.soldi-prima))}
 // un salvataggio vecchio della seconda generazione non ha eredAttesa: vale la vecchia regola (soldi secondo la classe, a volte la casa)
 {let vecchia=0,casaV=0;for(let i=0;i<20;i++){base(80);const F=fam({con:1,figli:[28]});beni(0);continuaCome(F.pid);delete S.fatti.eredAttesa;S.classe='agiata';coda.length=0;
    mortePersona(vivi(['Madre'])[0]);if(/Erediti [^|]* dai tuoi genitori\./.test(diario()))vecchia++;if(coda.some(q=>q.e.id==='eredita_casa'))casaV++;coda.length=0}
  if(vecchia!==20||!casaV)ko.push('salvataggio vecchio: vecchia eredità '+vecchia+'/20, casa '+casaV)}
 // prima generazione: niente eredAttesa, tutto come prima
 {nuovaVita({sesso:'F',nome:'Ada',cognome:'Prova',citta:'Roma',prov:'RM',anno:1980});S.eta=40;S.anno=2020;S.t=480;coda.length=0;
  if(S.fatti.eredAttesa||S.fatti.eredita)ko.push('prima generazione con eredAttesa');
  vivi(['Madre','Padre']).forEach(p=>{p.vivo=false});ereditaGenitori();if(!/dai tuoi genitori\./.test(diario()))ko.push('prima generazione: eredità dei genitori cambiata');coda.length=0}
 return {errs:[...new Set(errs)].slice(0,8),ko:[...new Set(ko)].slice(0,25)};
}'''
JS_VITE = r'''(N)=>{
 const errs=[],ko=[];window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
 const conto=(X,pid)=>{for(const sc of ['pura','beneficio','rinuncia']){const R=ripartoEredita(X,pid,sc),n=R.M.netto,sx=R.righe.reduce((s,r)=>s+r.x,0);
   if(sx+R.imposte+R.spese-R.scoperto!==n)ko.push('il conto non torna ('+sc+'): '+[sx,R.imposte,R.spese,R.scoperto,n]);
   for(const r of R.righe)if(n>0?r.x>r.q*n+1e-6:r.x>0||r.x<r.q*n-1)ko.push('oltre la quota ('+sc+'): '+r.p.ruolo+' '+r.x+' su '+(r.q*n).toFixed(0))}};
 const ris=[];
 for(let v=0;v<N;v++){
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s,anno:1950+Math.floor(Math.random()*40)});
   let k=0;while(S.vivo&&k<1500){k++;AP.mese();risolvi();mese();risolvi()}
   const eredi=S.relazioni.filter(p=>p.vivo&&p.ruolo==='Figlio'),riga={eta:S.eta,eredi:eredi.length};
   if(S.vivo||!eredi.length){ris.push(riga);continue}
   riga.forzata=v%4===3;if(riga.forzata)S.soldi-=Math.max(0,patrimonio())+P(r(20000,150000));   // una vita su quattro: più debiti che beni
   const f=pick(eredi),old=S;conto(old,f.id);
   const R=ripartoEredita(old,f.id),tetto=R.mia?Math.max(0,R.mia.q*R.M.netto):0;riga.netto=R.M.netto;
   continuaCome(f.id);risolvi();
   const E=S.fatti.eredita;riga.scelta=E&&(E.netto<0?(S.eta<18?'minorenne':E.scelta):'beni');riga.x=E?E.x:0;riga.etaErede=S.eta;riga.attesa=!!S.fatti.eredAttesa;
   if(!E||E.pend||!E.scelta)ko.push('scelta non fatta: '+JSON.stringify(E));
   if(S.soldi>tetto+1)ko.push('l\'erede parte con '+S.soldi+', la quota era '+tetto.toFixed(0));
   if(S.gen!==2)ko.push('generazione '+S.gen);
   let m=0;
   while(S.vivo&&m<360){m++;AP.mese();risolvi();mese();risolvi();
     const i=INV.controlla();if(i.length){ko.push('gen 2, mese '+m+': '+i.slice(0,2).map(z=>z.join(': ')).join(' | '));break}}
   riga.mesi=m;riga.attesaFine=!!S.fatti.eredAttesa;
   if(riga.attesa&&S.log.some(b=>b.righe.some(z=>/dai tuoi genitori\./.test(z.t))))ko.push('con eredAttesa è partita la vecchia eredità dei genitori');
   ris.push(riga);
  }catch(e){errs.push(e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' / '))}
 }
 return {errs:[...new Set(errs)].slice(0,8),ko:[...new Set(ko)].slice(0,8),ris};
}'''
with sync_playwright() as pw:
    b = pw.chromium.launch(); pe = []
    pg = b.new_page(viewport={'width': 400, 'height': 820}); pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300); pg.add_script_tag(content=AP); pg.add_script_tag(content=INV)
    r = pg.evaluate(JS_BASE)
    pg2 = b.new_page(viewport={'width': 400, 'height': 820}); pg2.on('pageerror', lambda e: pe.append(str(e)))
    pg2.goto(GAME); pg2.wait_for_timeout(300); pg2.add_script_tag(content=AP); pg2.add_script_tag(content=INV)
    v = pg2.evaluate(JS_VITE, N)
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
print('PROVE:', r['ko'] or 'tutte superate ✓')
V = v['ris']; G = [x for x in V if 'mesi' in x]
if V:
    c = Counter(x['scelta'] for x in G)
    print(f"{len(V)} vite: {sum(1 for x in V if x['eredi'])} con figli vivi, {len(G)} continuate come un figlio ({sum(1 for x in G if x['forzata'])} con i debiti forzati) · "
          f"mesi giocati dalla seconda generazione {sum(x['mesi'] for x in G)}")
    print('eredità:', ', '.join(f'{k} {n}' for k, n in c.most_common()) or '—',
          f"· con un genitore rimasto {sum(1 for x in G if x['attesa'])}, morto nei 30 anni {sum(1 for x in G if x['attesa'] and not x['attesaFine'])}")
print('violazioni nelle vite:', v['ko'] or 'nessuna ✓')
print('errori JS:', (r['errs'] + pe + v['errs']) or 'nessuno')
sys.exit(1 if r['ko'] or v['ko'] or r['errs'] or pe or v['errs'] else 0)
