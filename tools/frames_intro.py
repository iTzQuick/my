"""Fotogrammi dell'intro a istanti precisi (ferma le animazioni con la Web Animations API) → grafica/intro_frames_<tema>.png
Uso: python tools/frames_intro.py [light|dark]"""
import pathlib, sys, base64
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()+'?intro=1'
TEMA=sys.argv[1] if len(sys.argv)>1 else 'light'
T=[0.25,0.7,1.0,1.3,1.6,1.9,2.15,2.35,2.6,2.85,3.2,3.6,4.6]
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={'width':390,'height':844},color_scheme=TEMA)
    pg.goto(GAME); pg.wait_for_timeout(150)
    pg.evaluate("()=>{window.setTimeout=()=>0}")   # l'intro non si rimuove da sola mentre fotografiamo
    shots=[]
    for t in T:
        pg.evaluate("(t)=>document.getAnimations().forEach(a=>{a.pause();a.currentTime=t*1000})",t)
        pg.wait_for_timeout(30)
        f=ROOT/'grafica'/f'_f{t}.png'
        pg.screenshot(path=str(f),clip={'x':35,'y':262,'width':320,'height':300}); shots.append((t,f))
    # foglio di contatto
    html='<body style="margin:0;background:#888;display:grid;grid-template-columns:repeat(5,320px);gap:4px;font:12px monospace">'+''.join(
        f'<div style="position:relative"><img src="data:image/png;base64,{base64.b64encode(f.read_bytes()).decode()}"><span style="position:absolute;left:6px;top:4px;background:#000;color:#fff;padding:1px 4px">{t}s</span></div>' for t,f in shots)+'</body>'
    pg2=b.new_page(viewport={'width':1620,'height':920}); pg2.set_content(html); pg2.wait_for_timeout(200)
    pg2.screenshot(path=str(ROOT/'grafica'/f'intro_frames_{TEMA}.png'),full_page=True)
    for _,f in shots: f.unlink()
    b.close()
print('ok')
