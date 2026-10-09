"""Fotografa la schermata di creazione (ogni scheda), il timbro e la presentazione → grafica/crea_<tema>.png
Uso: python tools/shot_crea.py [light|dark]"""
import pathlib, sys, base64
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
TEMA=sys.argv[1] if len(sys.argv)>1 else 'light'
U=(ROOT/'dist'/'vitamia.html').as_uri()
with sync_playwright() as p:
    b=p.chromium.launch();errs=[]
    pg=b.new_page(viewport={'width':390,'height':844},color_scheme=TEMA)
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(U+'?anim=1');pg.wait_for_timeout(400)
    pg.evaluate("()=>{localStorage.clear()}")
    shots=[]
    def shot(nome,full=False):
        f=ROOT/'grafica'/f'_{nome}.png';pg.screenshot(path=str(f),full_page=full);shots.append((nome,f))
    shot('tu')
    pg.click('[data-et="dove"]');pg.fill('#iCom','grad');pg.wait_for_timeout(100);shot('dove')
    pg.click('#sugg [data-i="0"]');pg.click('[data-et="famiglia"]');pg.wait_for_timeout(100);pg.evaluate("()=>document.querySelector('.ed').scrollIntoView()");shot('famiglia')
    pg.click('[data-et="aspetto"]');pg.wait_for_timeout(100);pg.evaluate("()=>document.querySelector('.ed').scrollIntoView()");shot('aspetto')
    pg.evaluate("()=>document.querySelector('#view').scrollTop=0")
    pg.click('#btnNasci');pg.wait_for_timeout(420);shot('timbro')
    pg.wait_for_timeout(700);shot('battito')
    pg.wait_for_timeout(1400);shot('benvenuto')
    pg.click('#btnInizia');pg.wait_for_timeout(600);shot('gioco')
    html='<body style="margin:0;background:#777;display:grid;grid-template-columns:repeat(4,390px);gap:6px;font:13px monospace">'+''.join(
        f'<div style="position:relative"><img style="width:390px" src="data:image/png;base64,{base64.b64encode(f.read_bytes()).decode()}"><span style="position:absolute;left:6px;top:4px;background:#000;color:#fff;padding:1px 5px">{n}</span></div>' for n,f in shots)+'</body>'
    pg2=b.new_page(viewport={'width':1580,'height':900});pg2.set_content(html);pg2.wait_for_timeout(300)
    pg2.screenshot(path=str(ROOT/'grafica'/f'crea_{TEMA}.png'),full_page=True)
    for _,f in shots:f.unlink()
    b.close()
print('errori',errs)
