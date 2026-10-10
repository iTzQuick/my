"""Fase 5.1 — aspirazioni con progressi visibili.
Controlla: ogni aspirazione ha almeno 3 tappe e l'ultima coincide con ok(); le tappe scattano una sola volta, danno +2 di
felicità (il sogno intero +12) e non si perdono; i salvataggi vecchi (senza aspTappe) si caricano; il foglio «I tuoi sogni»;
gli eventi asp_ (ripensare i sogni: al massimo 3 ancora aperti, quello lasciato esce dalla lista); quante volte, in una vita
giocata dal pilota automatico, arriva «Che cosa vuoi, adesso?» (circa ogni 10 anni dopo i 25).

    python tools/test_aspir.py        # 1 prova + 30 vite
    python tools/test_aspir.py 60     # 60 vite
"""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
N = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 30
AP = (ROOT/'tools'/'autopilota.js').read_text(encoding='utf-8')
JS_BASE = r'''
()=>{
 const errs=[],ko=[];window.addEventListener('error',e=>errs.push(e.message));
 window.save=()=>{};window.toast=()=>{};
 document.querySelector('#btnRnd').click();
 const rnd=window.render;window.render=()=>{};
 const nuova=()=>{S.eta=30;S.anno=S.annoNascita+30;S.vivo=true;S.aspir=null;S.aspOk=[];S.aspTappe=null;S.fatti.volMesi=0;S.fatti.affMesi=0;S.fatti.sereni=0;S.fatti.viaggi=0;S.fama=0;S.karma=50;S.soldi=0;S.prop=[];S.casa={tipo:'genitori'};S.lavoro=null;S.azienda=null;S.istr.liv=1;S.relazioni=S.relazioni.filter(p=>!['Figlio','Coniuge','Partner'].includes(p.ruolo));S.felicita=60};
 // 1) struttura
 for(const [id,A] of Object.entries(ASPIR)){
   if(A.tappe.length<3)ko.push(id+': meno di 3 tappe');
   if(A.tappe[A.tappe.length-1].c!==A.ok)ko.push(id+': l\'ultima tappa non è ok()');
   for(const t of A.tappe)if(!t.n||!t.d)ko.push(id+': tappa senza nome o descrizione');
 }
 // 2) per ogni sogno, porto la vita in situazioni successive e guardo le tappe
 const passi={
  viaggi:[()=>S.fatti.viaggi=1,()=>S.fatti.viaggi=3,()=>S.fatti.viaggi=6],
  serenita:[()=>S.fatti.sereni=12,()=>S.fatti.sereni=30,()=>S.fatti.sereni=60],
  fama:[()=>S.fama=10,()=>S.fama=25,()=>S.fama=40],
  altri:[()=>S.karma=60,()=>S.karma=75,()=>S.karma=85],
  sapere:[()=>S.istr.liv=2,()=>S.istr.liv=3,()=>S.istr.liv=4],
  ricchezza:[()=>S.soldi=P(130000),()=>S.soldi=P(260000),()=>S.soldi=P(520000)],
  casa:[()=>S.casa={tipo:'affitto',n:'Monolocale',costo:P(6000)},()=>S.fatti.affMesi=12,()=>{const pr={id:'p1',tipo:'Casa',valore:P(150000),n:'Casa'};S.prop=[pr];S.casa={tipo:'proprieta',pid:'p1'}}],
  carriera:[()=>{assumi(LAVORI[0]);S.lavoro.contratto={t:'ind'};S.lavoro.liv=0},()=>S.lavoro.liv=1,()=>S.lavoro.liv=2],
  famiglia:[()=>nuovaPersona('Partner','F',30,S.cognome,{conv:true,rapporto:80}),()=>nuovaPersona('Figlio','M',1,S.cognome,{rapporto:90}),()=>{}]
 };
 for(const id of Object.keys(ASPIR)){
   nuova();S.aspir=[id];aspAvvia(id);
   const n=ASPIR[id].tappe.length;
   if(aspTappeDi(id).some(Boolean))ko.push(id+': tappe già segnate in una vita vuota');
   let prev=0;
   for(let i=0;i<n;i++){
     passi[id][i]();
     if(id==='famiglia'&&i===2){/* il partner e il figlio ci sono già: basta che il passo precedente le abbia fatte scattare insieme */}
     const f0=S.felicita;
     meseAspir();
     const a=aspTappeDi(id),fatte=a.filter(Boolean).length;
     if(fatte<i+1)ko.push(`${id}: dopo il passo ${i+1} le tappe fatte sono ${fatte}`);
     const df=S.felicita-f0;
     if(i<n-1&&i===fatte-1&&df!==2)ko.push(`${id}: tappa ${i+1} dà ${df} di felicità invece di 2`);
     if(i===n-1&&!S.aspOk.includes(id))ko.push(id+': non risulta realizzata');
     const pr=aspProg(id);if(pr+1e-9<prev)ko.push(`${id}: l'avanzamento scende (${prev}→${pr})`);prev=pr;
     const f1=S.felicita;meseAspir();if(S.felicita!==f1&&!S.aspOk.includes(id))ko.push(id+': la stessa tappa premiata due volte');
   }
   if(Math.abs(aspProg(id)-1)>1e-9)ko.push(id+': a sogno realizzato l\'avanzamento non è 100%');
   const t=testoSogni();if(!t.includes('✓')||/\{\w+\}|undefined|NaN/.test(t))ko.push(id+': foglio sogni sbagliato: '+t.slice(0,80));
 }
 // 3) tappe che non si perdono: il sogno «casa» dopo un trasloco dai genitori
 nuova();S.aspir=['casa'];aspAvvia('casa');S.casa={tipo:'affitto',n:'Monolocale',costo:P(6000)};meseAspir();
 S.casa={tipo:'genitori'};meseAspir();if(!aspTappeDi('casa')[0])ko.push('casa: la tappa «fuori di casa» si perde');
 // 4) salvataggio vecchio: senza aspTappe
 nuova();S.aspir=['viaggi','sapere'];S.istr.liv=3;S.fatti.viaggi=2;S.aspTappe=undefined;aggiornaStato();
 const tt=aspTappeDi('sapere');if(!(tt[0]&&tt[1]&&!tt[2]))ko.push('migrazione: tappe del sapere '+JSON.stringify(tt));
 const f2=S.felicita;meseAspir();if(S.felicita!==f2)ko.push('migrazione: le tappe vecchie danno felicità');
 // 5) eventi asp_
 const apri=(id,d)=>{coda.push({e:EV[id],d:d||{}});next();return [...document.querySelectorAll('#shA button:not([disabled])')]};
 const chiudi=()=>{let g=0;while(!document.querySelector('#scrim').hidden&&g++<20){const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}};
 nuova();S.aspir=['viaggi','sapere'];aspAvvia('viaggi');aspAvvia('sapere');
 let bs=apri('asp_ripensa',{da:18});
 const testi=document.querySelector('#shP').textContent;if(/\{\w+\}|undefined|NaN/.test(testi))ko.push('asp_ripensa: testo '+testi.slice(0,80));
 const lab=bs.map(b=>b.textContent);
 if(!lab.some(l=>/nuovo sogno/.test(l))||!lab.some(l=>/cambio uno/.test(l)))ko.push('asp_ripensa: scelte '+lab.join('|'));
 bs.find(b=>/nuovo sogno/.test(b.textContent)).click();
 bs=[...document.querySelectorAll('#shA button:not([disabled])')];
 if(!bs.length)ko.push('asp_nuovo: nessuna scelta');
 bs.find(b=>/Fare carriera/.test(b.textContent)).click();chiudi();
 if(!S.aspir.includes('carriera')||S.aspir.length!==3)ko.push('asp_nuovo: '+JSON.stringify(S.aspir));
 bs=apri('asp_ripensa',{da:28});
 if(bs.some(b=>/nuovo sogno/.test(b.textContent)))ko.push('asp_ripensa: offre un quarto sogno con 3 aperti');
 bs.find(b=>/cambio uno/.test(b.textContent)).click();
 bs=[...document.querySelectorAll('#shA button:not([disabled])')];
 bs.find(b=>/Vedere il mondo/.test(b.textContent)).click();
 bs=[...document.querySelectorAll('#shA button:not([disabled])')];
 bs.find(b=>/Una casa tutta mia/.test(b.textContent)).click();chiudi();
 if(S.aspir.includes('viaggi')||!S.aspir.includes('casa')||S.aspir.length!==3)ko.push('asp_cambia: '+JSON.stringify(S.aspir));
 // i sogni già realizzati non si possono lasciare e non contano tra i tre aperti
 S.aspOk=['sapere'];
 bs=apri('asp_ripensa',{da:28});if(!bs.some(b=>/nuovo sogno/.test(b.textContent)))ko.push('asp_ripensa: un sogno realizzato conta tra i tre aperti');
 bs.find(b=>/cambio uno/.test(b.textContent)).click();
 bs=[...document.querySelectorAll('#shA button:not([disabled])')];if(bs.some(b=>/Studiare e capire/.test(b.textContent)))ko.push('asp_cambia: si può lasciare un sogno già realizzato');
 chiudi();
 // 6) il foglio e la scheda Carattere
 mostraSogni();const p=document.querySelector('#shP').textContent;if(!/%/.test(p))ko.push('foglio sogni senza percentuali');chiudi();
 window.render=rnd;
 return {errs,ko};
}
'''
JS_VITE = r'''
(N)=>{
 const errs=[];window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 let rip=0;
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(document.querySelector('#shA button.opt')&&document.querySelector('#shT').textContent==='Che cosa vuoi, adesso?')rip++;if(!AP.scegli()){errs.push('foglio vuoto');sheetOpen=false;break}}};
 const ris=[];
 for(let v=0;v<N;v++){
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
   rip=0;let k=0,att3=true;
   while(S.vivo&&k<1500){k++;AP.mese();risolvi();mese();risolvi();if(S.aspir&&aspAttive().length>3)att3=false}
   const tt=Object.values(S.aspTappe||{}).reduce((s,a)=>s+a.filter(z=>z&&!z.pre).length,0);
   ris.push({rip,eta:S.eta,tappe:tt,ok:(S.aspOk||[]).length,n:(S.aspir||[]).length,att3,lasciati:S.fatti.aspLasciati||0});
  }catch(e){errs.push(e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' / '))}
 }
 return {errs,ris};
}
'''
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 400, 'height': 820})
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    r = pg.evaluate(JS_BASE)
    pg2 = b.new_page(viewport={'width': 400, 'height': 820})
    pg2.on('pageerror', lambda e: pe.append(str(e)))
    pg2.goto(GAME); pg2.wait_for_timeout(300)
    pg2.add_script_tag(content=AP)
    v = pg2.evaluate(JS_VITE, N)
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
print('PROVE:', r['ko'] or 'tutte superate ✓')
print('errori JS:', (r['errs'] + pe + v['errs']) or 'nessuno')
V = v['ris']
if V:
    m = lambda k: sum(x[k] for x in V)/len(V)
    adulti = [x for x in V if x['eta'] >= 35]
    print(f"{len(V)} vite: età media {m('eta'):.0f}; «Che cosa vuoi, adesso?» {m('rip'):.1f} a vita (tra 0 e 6 attesi); tappe raggiunte {m('tappe'):.1f}; sogni realizzati {m('ok'):.1f} su {m('n'):.1f}; sogni lasciati {m('lasciati'):.2f}")
    print('mai più di 3 sogni aperti:', 'sì ✓' if all(x['att3'] for x in V) else 'NO ✗')
sys.exit(1 if r['ko'] or r['errs'] or pe or v['errs'] or not all(x['att3'] for x in V) else 0)
