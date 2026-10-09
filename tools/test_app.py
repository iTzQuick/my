"""Prova la web app installabile (dist/app) servita su localhost: manifest, service worker, funzionamento offline.
Uso: python build.py && python tools/test_app.py"""
import pathlib, threading, functools, http.server, json, sys
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8')
H=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT/'dist'/'app'))
H.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),H);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
U=f'http://localhost:{port}/'
with sync_playwright() as p:
    b=p.chromium.launch();errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True)
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(U);pg.wait_for_timeout(500)
    man=pg.evaluate("async()=>{const r=await fetch(document.querySelector('link[rel=manifest]').href);return r.json()}")
    print('manifest:',man['short_name'],man['display'],[i['src'] for i in man['icons']])
    print('icona iPhone:',pg.evaluate("async()=>(await fetch('apple-touch-icon.png')).status"))
    pg.evaluate("async()=>{await navigator.serviceWorker.ready}")
    pg.wait_for_timeout(800)
    print('service worker attivo:',pg.evaluate("()=>!!navigator.serviceWorker.controller||'(attivo dal prossimo caricamento)'"))
    pg.reload();pg.wait_for_timeout(800)
    print('controllato dal SW:',pg.evaluate("()=>!!navigator.serviceWorker.controller"))
    print('cache:',pg.evaluate("async()=>{const o={};for(const k of await caches.keys())o[k]=(await (await caches.open(k)).keys()).length;return o}"))
    ctx.set_offline(True)
    pg.reload();pg.wait_for_timeout(1200)
    pg.evaluate("()=>{const i=document.querySelector('#intro');if(i)i.remove()}")
    print('OFFLINE: certificato visibile:',pg.locator('#cert').count(),'· titolo:',pg.title())
    pg.click('#btnRnd');pg.wait_for_timeout(300)
    for _ in range(4):
        pg.click('#btnAnno');pg.wait_for_timeout(80)
        while pg.locator('#scrim').is_visible():pg.locator('#shA button:not([disabled])').first.click();pg.wait_for_timeout(50)
    print('OFFLINE: si gioca, età/mese:',pg.evaluate("()=>[S.nome,S.eta,S.mese]"))
    pg.screenshot(path=str(ROOT/'grafica'/'app_offline.png'))
    print('errori',errs)
    b.close()
srv.shutdown()
