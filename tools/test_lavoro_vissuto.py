"""Fase 5.3a — lavoro vissuto: il capo e 2–3 colleghi sono persone vere finché resti in quel lavoro.
Controlla: la squadra nasce con l'assunzione (capo subito, colleghi nei primi 3 mesi), non sbiadisce mentre lavori, sta nel gruppo
lavoro:<id>:<da>, resta (amici) o sbiadisce (ex colleghi) quando il lavoro finisce, non c'è per partita IVA / cariche elettive /
lavoretti senza posto fisso / chi ha un'azienda, c'è per part-time e sportivi (allenatore e compagni), i salvataggi vecchi si
completano in silenzio; poi 40 vite giocate dal pilota automatico: mai due capi, nessuna persona orfana, quanti eventi col_ e prg_.

    python tools/test_lavoro_vissuto.py        # prove + 40 vite
    python tools/test_lavoro_vissuto.py 80
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
 const nuova=(eta,job)=>{
   nuovaVita({sesso:pick(['M','F']),nome:'Prova',cognome:'Test',citta:'Roma',prov:'RM'});
   S.eta=eta;S.anno=S.annoNascita+eta;S.scuola.stato='finita';S.istr.liv=2;S.casa={tipo:'affitto',n:'Monolocale',costo:P(6000)};S.soldi=P(30000);
   S.relazioni=S.relazioni.filter(p=>['Madre','Padre','Nonno'].includes(p.ruolo));coda.length=0;
   if(job)assumi(JOB[job]);
 };
 const ric=()=>squadra();
 // 1) assunzione: il capo subito, i colleghi nei primi tre mesi
 nuova(30,'imp');
 const L=S.lavoro;
 if(!L||!L.sq)ko.push('assunzione: nessuna squadra (contratto '+(L&&L.contratto&&L.contratto.t)+')');
 else{
  if(!ric().capo)ko.push('assunzione: manca il capo');
  if(ric().colleghi.length!==0)ko.push('assunzione: i colleghi non devono esserci subito');
  const n=L.sq.n,visti=[];
  for(let m=1;m<=4;m++){mese();risolvi();if(!S.lavoro||S.lavoro.da!==L.da)break;visti.push(ric().colleghi.length)}
  if(S.lavoro&&S.lavoro.da===L.da&&visti[2]<Math.min(n,3)&&visti[3]<n)ko.push('colleghi nei primi 3 mesi: '+visti.join(','));
  const G=(S.gruppi||[]).find(g=>g.k===`lavoro:${L.id}:${L.da}`);
  if(!G)ko.push('manca il gruppo lavoro');
  else for(const p of S.relazioni.filter(lavInCorso))if(!G.m.includes(p.id))ko.push(p.nome+' non è nel gruppo lavoro');
 }
 // 2) non sbiadiscono, mai due capi, rapporto vivo
 nuova(28,'imp');completaSquadra(true);
 let minRap=100,max=0,capi=0;
 for(let m=0;m<96&&S.vivo&&S.lavoro;m++){
   mese();risolvi();if(!S.lavoro)break;
   const s=ric();if(s.capo===null&&S.lavoro.sq&&!S.lavoro.sq.capoT&&m>3){/* in attesa del successore */}
   const capiN=S.relazioni.filter(p=>lavInCorso(p)&&p.lav.r==='capo').length;if(capiN>1)ko.push('due capi in corso');
   max=Math.max(max,s.colleghi.length);for(const p of S.relazioni.filter(lavInCorso)){minRap=Math.min(minRap,p.rapporto);if(p.rimuovi)ko.push(p.nome+' marcato da rimuovere')}
 }
 if(max>3)ko.push('più di 3 colleghi: '+max);
 if(minRap<5)ko.push('rapporto che sbiadisce al lavoro: '+minRap);
 // 3) il lavoro finisce: chi era vicino resta amico, gli altri sbiadiscono
 nuova(30,'imp');completaSquadra(true);
 const squad=S.relazioni.filter(lavInCorso);squad.forEach((p,i)=>p.rapporto=i===0?80:20);
 const amico0=squad[0];
 licenzia('Prova',true);mese();risolvi();
 if(amico0.ruolo!=='Amico')ko.push('chi era vicino non è rimasto amico: '+amico0.ruolo);
 if(squad.slice(1).some(p=>p.ruolo!=='Conoscente'||!p.lav.fine))ko.push('gli altri non sono ex colleghi');
 if(!/^Ex /.test(ruoloLabel(squad[1]))&&squad[1].ruolo==='Conoscente')ko.push('etichetta ex collega: '+ruoloLabel(squad[1]));
 for(let m=0;m<30;m++){mese();risolvi()}
 const restati=squad.slice(1).filter(p=>S.relazioni.includes(p)&&p.ruolo==='Conoscente');
 if(restati.length)ko.push('gli ex colleghi non sbiadiscono: '+restati.length);
 // 4) chi non ha la squadra, chi sì
 const prova=(job,att,att2)=>{nuova(30);if(att2)att2();assumi(JOB[job]);return S.lavoro&&S.lavoro.sq};
 for(const j of ['avv','taxi'])if(prova(j))ko.push(j+' (partita IVA): non dovrebbe avere la squadra');
 if(prova('poli'))ko.push('carica elettiva con la squadra');
 for(const j of ['vol','rip'])if(prova(j))ko.push(j+' (lavoretto): non dovrebbe avere la squadra');
 nuova(30);S.azienda={id:'shop',n:'Negozio',sedi:1,dip:0,cassa:0,anni:1,rep:50,compenso:0};assumi(JOB.imp);if(S.lavoro.sq)ko.push('con un\'azienda: non dovrebbe avere la squadra');S.azienda=null;
 for(const j of ['cam','bpt','cass'])if(!prova(j))ko.push(j+' (dipendente, anche part-time): manca la squadra');
 nuova(30,'cass');S.lavoro.ptv=true;completaSquadra(true);if(!squadra().capo)ko.push('part-time: manca il capo');
 if(!prova('calc'))ko.push('sportivo: manca la squadra');
 else{completaSquadra(true);const s=ric();if(!/Allenator/.test(ruoloLabel(s.capo)))ko.push('sportivo: capo '+ruoloLabel(s.capo));if(!/squadra/.test(ruoloLabel(s.colleghi[0])))ko.push('sportivo: compagno '+ruoloLabel(s.colleghi[0]))}
 // 5) salvataggio vecchio: nessuna squadra, nessun diario
 nuova(35,'imp');completaSquadra(true);
 S.relazioni=S.relazioni.filter(p=>!p.lav);delete S.lavoro.sq;const righe=S.log[S.log.length-1].righe.length;
 aggiornaStato();
 if(!ric().capo||ric().colleghi.length<2)ko.push('migrazione: squadra incompleta');
 if(S.log[S.log.length-1].righe.length!==righe)ko.push('migrazione: ha scritto nel diario');
 // 6) il capo conta
 nuova(30,'imp');completaSquadra(true);const c=ric().capo;
 c.pers.A=90;c.pers.N=10;c.pers.C=80;c.rapporto=85;const buono=capoEsito(),sb=soddLavoro();
 c.pers.A=10;c.pers.N=90;c.pers.C=20;c.rapporto=15;const cattivo=capoEsito(),sc=soddLavoro();
 if(!(buono>.8&&cattivo<-.8))ko.push(`capoEsito ${buono}/${cattivo}`);
 if(!(sb-sc>=15))ko.push(`soddisfazione col capo buono/cattivo: ${sb}/${sc}`);
 // 7) persone nella lista e nella scheda
 nuova(30,'imp');completaSquadra(true);
 const el=document.createElement('div');renderPersone(el);if(!/Al lavoro/.test(el.innerHTML))ko.push('scheda Persone senza «Al lavoro»');
 return {errs,ko};
}'''
JS_VITE = r'''(N)=>{
 const errs=[],ko=[];window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 const conta={};let titolo='';
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;const t=document.querySelector('#shT').textContent;if(document.querySelector('#shA button.opt')){const id=Object.keys(EV).find(k=>/^(col|prg)_/.test(k)&&(typeof EV[k].t==='function'?EV[k].t():EV[k].t)===t);if(id)conta[id]=(conta[id]||0)+1}if(!AP.scegli()){sheetOpen=false;break}}};
 const ris=[];
 for(let v=0;v<N;v++){
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
   let k=0,mesiL=0,conSq=0,maxCapi=0;const prima=Object.assign({},conta);
   while(S.vivo&&k<1500){k++;AP.mese();risolvi();mese();risolvi();
     if(S.lavoro){mesiL++;if(S.lavoro.sq)conSq++;const cp=S.relazioni.filter(p=>lavInCorso(p)&&p.lav.r==='capo').length;maxCapi=Math.max(maxCapi,cp);if(cp>1)ko.push('due capi');
       if(typeof INV!=='undefined'){const i=INV.controlla().filter(z=>/squadra|capo|collega/.test(z[0]));if(i.length)ko.push(i.map(z=>z.join(': ')).join(' | '))}}}
   const orfani=S.relazioni.filter(p=>p.vivo&&p.lav&&!p.lav.via&&!p.lav.fine&&!lavInCorso(p)).length;
   const n=Object.keys(conta).reduce((s,k2)=>s+(conta[k2]-(prima[k2]||0)),0);
   ris.push({eta:S.eta,mesiL,conSq,n,orfani,maxCapi});
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
    m = lambda k: sum(x[k] for x in V)/len(V)
    lavorate = [x for x in V if x['mesiL'] > 0]
    print(f"{len(V)} vite, {len(lavorate)} con un lavoro: eventi col_/prg_ per vita {m('n'):.1f}; mesi di lavoro con la squadra {100*sum(x['conSq'] for x in V)/max(1,sum(x['mesiL'] for x in V)):.0f}%; persone orfane {sum(x['orfani'] for x in V)}")
    print('eventi:', ', '.join(f"{k} {c/len(V):.1f}" for k, c in sorted(v['conta'].items(), key=lambda z: -z[1])))
print('violazioni nelle vite:', v['ko'] or 'nessuna ✓')
print('errori JS:', (r['errs'] + pe + v['errs']) or 'nessuno')
bad = r['ko'] or v['ko'] or r['errs'] or pe or v['errs'] or any(x['orfani'] or x['maxCapi'] > 1 for x in V)
sys.exit(1 if bad else 0)
