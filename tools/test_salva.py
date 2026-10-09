import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':400,'height':820},accept_downloads=True)
    pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('bloccato')}})")
    pg.goto(GAME);pg.wait_for_timeout(300)
    pg.click('#btnRnd')
    for i in range(30):
        while pg.locator('#scrim').is_visible(): pg.locator('#shA button:not([disabled])').first.click()
        pg.click('#btnAnno')
    while pg.locator('#scrim').is_visible(): pg.locator('#shA button:not([disabled])').first.click()
    pg.screenshot(path='sv_avviso.png')
    prima=pg.evaluate("JSON.stringify({n:S.nome,e:S.eta,t:S.t,r:S.relazioni.length,l:S.log.length})")
    pg.click('#btnSalva');pg.wait_for_timeout(200);pg.screenshot(path='sv_sheet.png')
    with pg.expect_download() as d:
        pg.locator('#shA button',has_text='Scarica il file').click()
    path=d.value.path();fn=d.value.suggested_filename;print('file',fn)
    codice=open(path).read();print('lunghezza codice',len(codice),codice[:20])
    # nuova pagina: carica da file
    pg2=ctx.new_page();pg2.on('pageerror',lambda e:errs.append(str(e)))
    pg2.goto(GAME);pg2.wait_for_timeout(300)
    pg2.click('#btnCarica');pg2.wait_for_timeout(200);pg2.screenshot(path='sv_carica.png')
    with pg2.expect_file_chooser() as fc:
        pg2.locator('#shA button',has_text='Scegli il file').click()
    fc.value.set_files(path);pg2.wait_for_timeout(800)
    dopo=pg2.evaluate("S&&JSON.stringify({n:S.nome,e:S.eta,t:S.t,r:S.relazioni.length,l:S.log.length})")
    print('prima',prima);print('dopo ',dopo)
    # incolla codice
    ctx3=b.new_context(viewport={'width':400,'height':820});pg3=ctx3.new_page();pg3.on('pageerror',lambda e:errs.append(str(e)));pg3.goto(GAME);pg3.wait_for_timeout(300)
    pg3.click('#btnCarica');pg3.locator('#shA button',has_text='Incolla').click();pg3.wait_for_timeout(200)
    pg3.fill('#shCod',codice);pg3.screenshot(path='sv_incolla.png');pg3.click('#shCodOk');pg3.wait_for_timeout(800)
    print('incolla',pg3.evaluate("S&&JSON.stringify({n:S.nome,e:S.eta,t:S.t})"))
    pg3.click('#btnAnno');pg3.wait_for_timeout(200)
    print('errs',errs)
    b.close()
