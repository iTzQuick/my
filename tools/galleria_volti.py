"""Galleria di volti (tutti i tagli, età, carnagioni) → grafica/volti.png. Uso: python tools/galleria_volti.py [light|dark]"""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
TEMA=sys.argv[1] if len(sys.argv)>1 else 'light'
JS=r'''()=>{
 const g=document.createElement('div');g.style.cssText='position:fixed;inset:0;z-index:99;background:var(--bg);padding:10px;display:grid;grid-template-columns:repeat(8,1fr);gap:8px;overflow:auto';
 const eta=[0,6,15,30,45,60,72,85];
 const righe=[['corti','M',1,1,0,'no'],['rasati','M',3,0,0,'corta'],['mossi','M',0,4,3,'baffi'],['ricci','M',4,0,0,'no'],['lunghi','F',1,2,2,'no'],['caschetto','F',2,4,3,'no'],['raccolti','F',5,0,0,'no'],['ricci','F',0,3,1,'no']];
 for(const [t,s,pe,ca,oc,ba] of righe)for(const e of eta){const L={pelle:pe,capelli:ca,occhi:oc,taglio:t,barba:ba,maglia:(pe+ca)%8};const d=document.createElement('div');d.style.cssText='border-radius:10px;overflow:hidden;background:var(--surface)';d.innerHTML=volto(L,e,s)+`<div style="font:10px monospace;text-align:center;color:var(--muted)">${t} ${s} ${e}</div>`;g.appendChild(d)}
 document.body.appendChild(g);
}'''
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':900,'height':1200},color_scheme=TEMA)
    pg.goto((ROOT/'dist'/'vitamia.html').as_uri());pg.wait_for_timeout(300);pg.evaluate(JS);pg.wait_for_timeout(100)
    pg.screenshot(path=str(ROOT/'grafica'/'volti.png'),full_page=True);b.close()
print('ok')
