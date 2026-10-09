"""Genera le icone della web app installabile in src/app/ (da rifare solo se cambia il logo).
Uso: python tools/icone_app.py"""
import pathlib
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'src'/'app'; OUT.mkdir(parents=True,exist_ok=True)
D="M20 104V71a21 21 0 0 1 42 0v33M62 71a21 21 0 0 1 42 0v33M157 140V99M157 99L133 53M157 99L181 53"
def svg(rx,tx,ty,sc,hx,hy,hr):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="{rx}" fill="#2244D6"/>'
            f'<g transform="translate({tx} {ty}) scale({sc})"><path d="{D}" fill="none" stroke="#fff" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/></g>'
            f'<circle cx="{hx}" cy="{hy}" r="{hr}" fill="#F0B43A"/></svg>')
NORMALE=svg(0,7,11,.43,74.5,27.3,4.5)            # iPhone arrotonda da solo gli angoli: quadrato pieno
TONDA=svg(24,7,11,.43,74.5,27.3,4.5)             # Android «any»
MASK=svg(0,15.8,19.2,.34,69.2,32.1,3.6)          # Android «maskable»: tutto dentro il cerchio centrale
ICONE=[('apple-touch-icon.png',180,NORMALE),('icona-192.png',192,TONDA),('icona-512.png',512,TONDA),('icona-maskable-512.png',512,MASK)]
with sync_playwright() as p:
    b=p.chromium.launch()
    for nome,px,s in ICONE:
        pg=b.new_page(viewport={'width':px,'height':px})
        tag='<svg width="%d" height="%d" style="display:block" '%(px,px)
        pg.set_content('<body style="margin:0;background:transparent">'+s.replace('<svg ',tag,1)+'</body>')
        pg.screenshot(path=str(OUT/nome),omit_background=True);pg.close()
    b.close()
print('ok',[n for n,_,_ in ICONE])
