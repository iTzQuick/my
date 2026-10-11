"""Fase 5.3b — scelte di carriera: cambiare settore (car_settore → car_corso → car_nuovo) e mettersi in proprio (car_proprio, car_collega_via).
Controlla: i settori possibili escludono quello di adesso e i lavori che chiedono titoli; il corso costa, riesce 3 volte su 4; le 3 proposte
assumono dal livello 0 con +8 di soddisfazione per 3 anni; la partita IVA nello stesso mestiere (solo PIVA_LIV, dal livello 1) cambia il
contratto e fa partire il reddito al 70%; l'attività di AZIENDE si finanzia con i risparmi e il TFR e il collega diventa amico e primo
dipendente; le esclusioni (azienda già aperta, sportivi, soldi che non bastano, epoca); cambiare azienda con il collega. Poi 40 vite.

    python tools/test_carriera.py        # prove + 40 vite
    python tools/test_carriera.py 80
"""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
AP = (ROOT/'tools'/'autopilota.js').read_text(encoding='utf-8')
INV = (ROOT/'tools'/'invarianti.js').read_text(encoding='utf-8')
N = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 40
JS_BASE = r'''async ()=>{
 const ko=[],errs=[];window.addEventListener('error',e=>errs.push(e.message));
 window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
 const nuova=(eta,job,anno)=>{
   nuovaVita({sesso:pick(['M','F']),nome:'Prova',cognome:'Test',citta:'Roma',prov:'RM'});
   S.eta=eta;S.anno=anno||S.annoNascita+eta;S.scuola.stato='finita';S.istr.liv=2;S.casa={tipo:'affitto',n:'Monolocale',costo:P(6000)};S.soldi=P(30000);
   S.relazioni=S.relazioni.filter(p=>['Madre','Padre','Nonno'].includes(p.ruolo));coda.length=0;S.futuri.length=0;
   if(job){assumi(JOB[job]);completaSquadra(true)}
 };
 const apri=(id,d)=>{coda.push({e:EV[id],d:d||{}});next();return [...document.querySelectorAll('#shA button:not([disabled])')]};
 const chiudi=()=>{let g=0;while(!document.querySelector('#scrim').hidden&&g++<20){const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}};
 // 1) settori possibili
 nuova(30,'imp');
 const cur=letteraJob('imp'),sp=settoriPossibili();
 if(sp.includes(cur))ko.push('settore: include quello di adesso '+cur);
 if(!sp.length)ko.push('settore: nessun settore possibile');
 for(const l of sp){const J=lavoriSettore(l);if(!J.length)ko.push('settore '+l+' senza lavori');
   for(const j of J){if(!aggirabile(j.req))ko.push(j.id+': chiede titoli che non hai');if(j.pt||j.conc||j.elez)ko.push(j.id+': lavoro non adatto')}}
 nuova(30,'imp',1962);
 for(const l of settoriPossibili())for(const j of lavoriSettore(l))if(!lavoroInEpoca(j))ko.push(j.id+' nel 1962');
 // 2) il flusso: scelta → corso → esame → tre proposte → nuovo lavoro
 nuova(30,'imp');S.soldi=P(20000);
 let bs=apri('car_settore');
 if(bs.length!==sp.length+1)ko.push('car_settore: '+bs.length+' scelte per '+sp.length+' settori');
 const prima=S.soldi;bs[0].click();chiudi();
 if(Math.abs((prima-S.soldi)-P(COSTO_CORSO))>2)ko.push('il corso costa '+(prima-S.soldi));
 if(!S.futuri.some(f=>f.id==='car_corso'))ko.push('il corso non è in programma');
 // l'esame riesce 3 volte su 4
 let ok=0;const L0=settoriPossibili()[0];
 for(let i=0;i<400;i++){coda.length=0;S.futuri.length=0;S.soldi=P(20000);const x=esameCorso({x:{l:L0,f:0}});if(x===null)ok++}
 if(ok<400*.68||ok>400*.82)ko.push('esame riuscito '+ok+'/400');
 coda.length=0;S.futuri.length=0;
 // bocciati: si riprova pagando
 bs=apri('car_corso',{x:{l:L0,f:1}});if(bs.length!==2||!/Ripeti/.test(bs[0].textContent))ko.push('car_corso dopo la bocciatura: '+bs.map(b=>b.textContent).join('|'));
 chiudi();
 // le tre proposte
 nuova(30,'imp');
 S.t+=12;bs=apri('car_nuovo',{x:{l:L0}});
 if(bs.length<1||bs.length>3)ko.push('car_nuovo: '+bs.length+' proposte');
 const vecchio=S.lavoro,vecchiDa=vecchio.da;
 bs[0].click();chiudi();
 let L=S.lavoro;
 if(!L||L.da===vecchiDa)ko.push('car_nuovo: non ti assumono');
 else{
  if(letteraJob(L.id)!==L0)ko.push('car_nuovo: settore '+letteraJob(L.id)+' invece di '+L0);
  if(L.liv>1)ko.push('car_nuovo: livello '+L.liv);
  if(L.cambioSett===undefined)ko.push('car_nuovo: manca cambioSett');
  const con=soddLavoro();const c=L.cambioSett;delete L.cambioSett;const senza=soddLavoro();L.cambioSett=c;
  if(con-senza<5)ko.push(`soddisfazione col cambio di settore: ${con} contro ${senza}`);
  S.t+=40;const dopo=soddLavoro();if(dopo>senza+1&&dopo!==senza)ko.push('il bonus dura più di 3 anni');S.t-=40;
  mese();risolvi();
  if(S.relazioni.some(p=>p.lav&&p.lav.da===vecchiDa&&lavInCorso(p)))ko.push('i vecchi colleghi sono ancora in squadra');
 }
 // 3) in proprio: partita IVA
 nuova(32,null);assumi(JOB.idra);S.lavoro.liv=1;S.lavoro.anni=3;S.lavoro.tfr=P(8000);completaSquadra(true);S.soldi=P(10000);
 let o=opzioniProprio();
 if(!o.some(x=>x.k==='piva'))ko.push('piva non offerta a un idraulico di livello 1');
 if(!o.some(x=>x.k==='az'&&x.t.id==='edile'))ko.push('impresa edile non offerta');
 const tfr=tfrNetto(),s0=S.soldi,costoPiva=costoProprio(o.find(x=>x.k==='piva'));
 const rs=avviaProprio(o.find(x=>x.k==='piva'));
 L=S.lavoro;
 if(rs[1]!=='g'||!isPiva(L)||L.proprioT===undefined)ko.push('piva: contratto '+JSON.stringify(L.contratto)+' '+rs[0]);
 if(Math.abs((S.soldi-s0)-(tfr-costoPiva))>3)ko.push(`piva: soldi ${S.soldi-s0} invece di ${tfr-costoPiva}`);
 const f0=ralEff(L)/L.stip;S.t+=24;const f24=ralEff(L)/L.stip;S.t+=36;const f60=ralEff(L)/L.stip;S.t-=60;
 if(Math.abs(f0-.7)>.01||Math.abs(f24-1)>.01||Math.abs(f60-1.15)>.01)ko.push(`reddito in proprio ${f0.toFixed(2)}/${f24.toFixed(2)}/${f60.toFixed(2)}`);
 mese();risolvi();if(S.lavoro&&S.lavoro.sq)ko.push('con la partita IVA la squadra deve chiudersi');
 if(!S.futuri.some(f=>f.id==='car_proprio2'))ko.push('manca car_proprio2');
 if(opzioniProprio().some(x=>x.k==='piva'))ko.push('piva offerta a chi è già in partita IVA');
 // 4) in proprio: un'attività con il collega
 nuova(33,null);assumi(JOB.cuoco);S.lavoro.liv=1;S.lavoro.anni=3;S.lavoro.tfr=P(6000);completaSquadra(true);S.soldi=P(30000);
 const q=squadra().colleghi[0];q.rapporto=70;
 o=opzioniProprio();const piz=o.find(x=>x.k==='az'&&x.t.id==='pizzeria');
 if(!piz)ko.push('pizzeria non offerta a un cuoco');
 else{
  const cp=costoProprio(piz);if(Math.abs(cp-P(AZIENDE.find(a=>a.id==='pizzeria').costo*.85))>2)ko.push('sconto del 15% non applicato');
  S.soldi=P(1000);S.lavoro.tfr=0;const nope=avviaProprio(piz,q.id);
  if(nope[1]!=='x'||S.azienda||!S.lavoro)ko.push('apre senza soldi: '+nope[0]);
  S.soldi=P(100000);S.lavoro.tfr=P(6000);
  const r2=avviaProprio(piz,q.id);
  if(r2[1]!=='g'||!S.azienda||S.lavoro)ko.push('azienda non aperta: '+r2[0]);
  else{if(S.azienda.dip!==1)ko.push('il collega non è il primo dipendente');if(q.ruolo!=='Amico')ko.push('il collega non è diventato amico: '+q.ruolo);if(lavInCorso(q))ko.push('il collega è ancora in squadra')}
  if(opzioniProprio().length)ko.push('con un\'azienda aperta non si offre altro');
 }
 // 5) esclusioni
 nuova(30,'calc');if(proprioPossibile())ko.push('uno sportivo non si mette in proprio');
 nuova(30,'idra');S.lavoro.liv=1;S.lavoro.anni=1;if(proprioPossibile())ko.push('con 1 anno di lavoro non si mette in proprio');
 nuova(30,'pro',1990);S.lavoro.anni=3;if(opzioniProprio().length)ko.push('nel 1990 un\'azienda online/startup non esiste: '+opzioniProprio().map(x=>x.t&&x.t.id).join(','));
 // 6) cambiare azienda con il collega
 nuova(34,'imp');S.lavoro.liv=1;S.lavoro.anni=6;S.t+=24;const stip0=S.lavoro.stip,da0=S.lavoro.da;const p0=squadra().colleghi[0];p0.rapporto=70;
 bs=apri('car_collega_via',{p:p0});
 const lab=bs.map(b=>b.textContent);if(lab.length<2)ko.push('car_collega_via: '+lab.join('|'));
 const altra=bs.find(b=>/altra azienda/.test(b.textContent));altra.click();chiudi();
 L=S.lavoro;
 if(L.da===da0)ko.push('altra azienda: lavoro non cambiato');
 if(L.liv!==1)ko.push('altra azienda: livello '+L.liv);
 if(Math.abs(L.stip-stip0*1.1)>stip0*.02)ko.push('altra azienda: stipendio '+L.stip+' da '+stip0);
 if(!lavInCorso(p0))ko.push('il collega non è nella nuova squadra');
 // 7) la lista COL_EV non esplode in nessuna situazione
 nuova(35,'imp');for(const e of COL_EV){try{e.ok(squadra(),S.lavoro);if(typeof e.w==='function')e.w()}catch(x){ko.push(e.id+': '+x.message)}}
 nuova(35,null);
 return {errs,ko};
}'''
JS_VITE = r'''(N)=>{
 const errs=[],ko=[];window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 const conta={};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;const t=document.querySelector('#shT').textContent;if(document.querySelector('#shA button.opt')){const id=Object.keys(EV).find(k=>/^car_/.test(k)&&(typeof EV[k].t==='function'?EV[k].t():EV[k].t)===t);if(id)conta[id]=(conta[id]||0)+1}if(!AP.scegli()){sheetOpen=false;break}}};
 const ris=[];
 for(let v=0;v<N;v++){
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
   let k=0,piva=0,az=0,sett=0;
   while(S.vivo&&k<1500){k++;AP.mese();risolvi();mese();risolvi();
     if(S.lavoro&&S.lavoro.proprioT!==undefined)piva=1;if(S.azienda)az=1;if(S.fatti.cambiSett)sett=S.fatti.cambiSett;
     if(typeof INV!=='undefined'){const i=INV.controlla().filter(z=>/squadra|capo|collega/.test(z[0]));if(i.length)ko.push(i.map(z=>z.join(': ')).join(' | '))}}
   ris.push({eta:S.eta,piva,az,sett});
  }catch(e){errs.push(e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' / '))}
 }
 return {errs,ko:[...new Set(ko)].slice(0,6),ris,conta};
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
V = v['ris']
if V:
    print(f"{len(V)} vite: eventi car_ per vita " + ', '.join(f"{k} {c/len(V):.2f}" for k, c in sorted(v['conta'].items(), key=lambda z: -z[1])))
    print(f"  hanno cambiato settore {100*sum(1 for x in V if x['sett'])/len(V):.0f}% · in partita IVA {100*sum(x['piva'] for x in V)/len(V):.0f}% · con un'azienda {100*sum(x['az'] for x in V)/len(V):.0f}% (nel gioco l'azienda si apre anche da sola)")
print('violazioni nelle vite:', v['ko'] or 'nessuna ✓')
print('errori JS:', (r['errs'] + pe + v['errs']) or 'nessuno')
sys.exit(1 if r['ko'] or v['ko'] or r['errs'] or pe or v['errs'] else 0)
