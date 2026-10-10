"""Ritmo e varietà (ROADMAP, Fase 1): quanti eventi possibili ha ogni fascia d'età, quante catene ci sono
e quali eventi si ripetono troppo in una vita giocata dal pilota automatico.

    python tools/ritmo.py        # 30 vite
    python tools/ritmo.py 80

«Fatto» quando: ogni fascia ha almeno 150 eventi possibili (0–5 almeno 100: a quell'età si sceglie poco),
le catene (un evento che ne apre altri, per almeno 3 passi) sono almeno 25 e nessun evento supera le 10 volte per vita.
"""
import pathlib as _pl, os, sys, json
ROOT=_pl.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')
from playwright.sync_api import sync_playwright
N=int(sys.argv[1]) if len(sys.argv)>1 else 30
AP=open(ROOT/'tools'/'autopilota.js').read()
FASCE=[(0,5,100),(6,12,150),(13,17,150),(18,25,150),(26,40,150),(41,65,150),(66,110,150)]
STAT=r'''
(F)=>{
 const L=Object.values(EV);const ids=new Set(L.map(e=>e.id));
 const fasce=F.map(([a,b])=>{const c=L.filter(e=>!e.link&&!e.prig&&e.min!==undefined&&e.min<=b&&e.max>=a);return {a,b,n:c.length,casuali:c.filter(e=>!e.chi).length,persone:c.filter(e=>e.chi).length}});
 // collegamenti: fut:[n,'id'], futuro(n,'id'), EV.id dentro testi e scelte
 const testo=e=>{let s='';const v=x=>{if(x==null)return;if(typeof x==='function')s+=x.toString()+'\n';else if(Array.isArray(x))x.forEach(v);else if(typeof x==='object')Object.values(x).forEach(v);else if(typeof x==='string')s+=x+'\n'};v(e.c);v(e.auto);v(e.x);return s};
 const out={};
 for(const e of L){const s=testo(e);const t=new Set();
   for(const m of s.matchAll(/EV\.([a-z0-9_]+)/gi))t.add(m[1]);
   for(const m of s.matchAll(/futuro\((?:[^,()]|\([^()]*\))+,\s*'([a-z0-9_]+)'/gi))t.add(m[1]);
   const fut=x=>{if(!x||typeof x!=='object')return;if(Array.isArray(x)){x.forEach(fut);return}if(Array.isArray(x.fut)&&typeof x.fut[1]==='string')t.add(x.fut[1]);Object.values(x).forEach(v=>{if(v&&typeof v==='object')fut(v)})};
   if(Array.isArray(e.c))fut(e.c);fut(e.auto);
   out[e.id]=[...t].filter(x=>ids.has(x)&&x!==e.id&&EV[x].link)}
 const prof=(id,vis)=>{if(vis.has(id))return 0;vis.add(id);let m=0;for(const x of out[id]||[])m=Math.max(m,prof(x,new Set(vis)));return 1+m};
 const catene=L.filter(e=>!e.link&&!e.prig).map(e=>[e.id,e.t,prof(e.id,new Set())]).filter(x=>x[2]>=3).sort((a,b)=>b[2]-a[2]);
 return {fasce,catene,tot:L.length};
}
'''
VITE=r'''
(N)=>{
 const errs=[];const evc={};window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 const risolvi=(vis)=>{let g=0;while(sheetOpen&&g<40){g++;const id=(document.querySelector('#shT').textContent||'').slice(0,40);if(document.querySelector('#shA button.opt')&&!vis.has(g+id)){evc[id]=(evc[id]||0)+1;vis.add(g+id)}if(!AP.scegli()){errs.push('vuoto: '+id);sheetOpen=false;break}}};
 for(let v=0;v<N;v++){
  try{const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
   let k=0;while(S.vivo&&k<1500){k++;AP.mese();risolvi(new Set());mese();risolvi(new Set())}
  }catch(e){errs.push(e.message)}
 }
 return {evc,errs};
}
'''
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    perr=[]; pg.on('pageerror',lambda e: perr.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    st=pg.evaluate(STAT,[[a,b] for a,b,_ in FASCE])
    pg.add_script_tag(content=AP)
    vi=pg.evaluate(VITE,N) if N>0 else {'evc':{},'errs':[]}
    b.close()
print('eventi in tutto:',st['tot'])
print('eventi possibili per fascia (casuali + con una persona):')
ok=True
for f,(a,b_,soglia) in zip(st['fasce'],FASCE):
    s='✓' if f['n']>=soglia else '✗'; ok&=f['n']>=soglia
    print(f"  {a:>2}–{b_:<3} {f['n']:>4}  ({f['casuali']} casuali, {f['persone']} con una persona)  obiettivo {soglia} {s}")
c=st['catene']
print(f"catene di almeno 3 passi: {len(c)} (obiettivo 25) {'✓' if len(c)>=25 else '✗'}")
for i,t,pr in c: print(f"  {pr} passi · {t} ({i})")
ok&=len(c)>=25
if N>0:
    rip=sorted(((n/N,t) for t,n in vi['evc'].items()),reverse=True)
    sopra=[(round(v,1),t) for v,t in rip if v>10]
    print(f'\n{N} vite · eventi più frequenti (volte per vita):')
    for v,t in rip[:20]: print(f'  {v:5.1f}  {t}')
    print('oltre 10 per vita:',sopra or 'nessuno ✓'); ok&=not sopra
    print('errori',vi['errs'][:5],perr[:3])
print('\nFASE 1:', 'FATTA ✓' if ok else 'non ancora')
