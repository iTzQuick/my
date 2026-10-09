"""Invarianti (ROADMAP 0.2): N vite del pilota automatico, controllate dopo ogni mese.
Uso: python tools/invarianti.py 200      → deve finire con «0 violazioni» e nessun «⚠».
Stampa anche massimo e 99° percentile delle cose che crescono da sole (ROADMAP 0.4).
Le regole sono in tools/invarianti.js (usato anche da fuzz.py)."""
import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
import os
GAME=_pl.Path(os.environ['GAME']).resolve().as_uri() if os.environ.get('GAME') else (ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
import json, sys
from playwright.sync_api import sync_playwright
N=int(sys.argv[1]) if len(sys.argv)>1 else 100
AP=open(ROOT/'tools'/'autopilota.js').read()
INV=open(ROOT/'tools'/'invarianti.js').read()
JS=r'''
(N)=>{
 const errs=[],viol={},picchi=[];let mesi=0;
 window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
 for(let v=0;v<N;v++){
  const visti=new Set(),pk={};picchi.push(pk);
  const controlla=quando=>{for(const [c,m] of INV.controlla()){
    const key=c+'|'+m.replace(/[0-9.]+/g,'#');if(visti.has(key))continue;visti.add(key);   // una volta per vita
    const x=viol[c]||(viol[c]={n:0,vite:new Set(),es:[]});x.n++;x.vite.add(v);
    if(x.es.length<4)x.es.push(`vita ${v}, ${S.anno}, ${S.eta} anni (${quando}): ${m}`);
  }};
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
   controlla('nascita');
   let k=0;
   while(S.vivo&&k<1500){k++;mesi++;AP.mese();risolvi();mese();controlla('mese');risolvi();if(S.vivo)controlla('dopo gli eventi');INV.picchi(pk)}
  }catch(e){errs.push(e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' / '))}
 }
 const r={};for(const c in viol)r[c]={n:viol[c].n,vite:viol[c].vite.size,es:viol[c].es};
 return {mesi,errs,viol:r,picchi,soglie:INV.SOGLIE};
}
'''
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    perr=[]
    pg.on('pageerror',lambda e: perr.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    pg.add_script_tag(content=AP); pg.add_script_tag(content=INV)
    r=pg.evaluate(JS,N)
    b.close()
print(f"{N} vite, {r['mesi']} mesi")
tot=0
for c,x in sorted(r['viol'].items(),key=lambda kv:-kv[1]['vite']):
    tot+=x['n']
    print(f"\n✗ {c}: {x['n']} volte in {x['vite']} vite su {N}")
    for e in x['es']: print('   ',e)
# crescite composte: valori reali (ai prezzi dell'anno di nascita), il massimo raggiunto in ogni vita
print('\nPicchi per vita (euro reali; ⚠ = oltre una soglia realistica):')
avvisi=0
for k,soglia in r['soglie'].items():
    v=sorted(float('inf') if x.get(k) is None else x[k] for x in r['picchi'])   # NaN arriva come None
    if not v: continue
    p99=v[min(len(v)-1,int(len(v)*.99))];mx=v[-1]
    oltre=sum(1 for x in v if not x<=soglia);avvisi+=oltre
    print(f"  {k:<11} mediana {v[len(v)//2]:>14,.0f}   99° perc. {p99:>16,.0f}   massimo {mx:>16,.0f}   {'⚠ '+str(oltre)+' vite oltre '+format(soglia,',.0f') if oltre else 'ok'}".replace(',','.'))
print(f"\n{tot} violazioni" if tot else '\n0 violazioni', f"· {avvisi} avvisi di crescita" if avvisi else '')
print('errs',r['errs'][:5],perr[:5])
