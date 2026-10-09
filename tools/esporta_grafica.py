"""Esporta la grafica di «my»: PNG del logo e dell'icona (da grafica/*.svg) e il video dell'intro (grafica/intro-my.webm).
Uso: python tools/esporta_grafica.py   (prima: python build.py)"""
import pathlib, shutil
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
G=ROOT/'grafica'
with sync_playwright() as p:
    b=p.chromium.launch()
    # PNG: logo chiaro/scuro su fondo trasparente, icona 512 e 1024
    for nome,w,h in [('logo-my',1520,1056),('logo-my-scuro',1520,1056),('icona-my',1024,1024)]:
        pg=b.new_page(viewport={'width':w,'height':h})
        svg=(G/f'{nome}.svg').read_text(encoding='utf-8').replace('width="','data-w="',1).replace('height="','data-h="',1)
        svg=svg.replace('<svg ','<svg style="width:100%;height:100%;display:block" ',1)
        pg.set_content(f'<body style="margin:0;background:transparent"><div style="width:{w}px;height:{h}px">{svg}</div></body>')
        pg.screenshot(path=str(G/f'{nome}.png'),omit_background=True); pg.close()
    # video dell'intro, verticale da telefono, in entrambi i temi
    for tema in ['light','dark']:
        ctx=b.new_context(viewport={'width':540,'height':960},color_scheme=tema,record_video_dir=str(G/'_vid'),record_video_size={'width':540,'height':960})
        pg=ctx.new_page(); pg.goto((ROOT/'dist'/'vitamia.html').as_uri()+'?intro=1'); pg.wait_for_timeout(5600)
        v=pg.video.path(); ctx.close()
        shutil.move(v,G/f'intro-my{"-scuro" if tema=="dark" else ""}.webm')
    shutil.rmtree(G/'_vid',ignore_errors=True)
    b.close()
print('ok')
