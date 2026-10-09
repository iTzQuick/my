"""Cosa si può fare a ogni età (ROADMAP 0.5): per 1, 4, 9, 15 e 17 anni gioca una vita fino a quell'età
col pilota automatico, apre tutte le schede e il menu di una persona di famiglia, ed elenca i bottoni visibili
(✓ si può, ✗ disattivato). Scrive tools/eta_azioni_out.md, da rivedere insieme per decidere le età minime.
Uso: python tools/eta_azioni.py"""
import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
from playwright.sync_api import sync_playwright
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
AP=open(ROOT/'tools'/'autopilota.js').read()
ETA=[1,4,9,15,17]
SCHEDE=['vita','scuola','lavoro','persone','beni','attivita']
NOMI={'vita':'Vita','scuola':'Studi','lavoro':'Lavoro','persone':'Persone','beni':'Beni','attivita':'Tempo'}
JS_GIOCA=r'''(e)=>{
 const realR=render;window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
 for(let t=0;t<20;t++){
  const x=pick(['M','F']);const cc=comuneCaso();
  nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
  let k=0;while(S.vivo&&S.eta<e&&k<400){k++;AP.mese();risolvi();mese();risolvi()}
  if(S.vivo&&S.eta>=e)break;
 }
 coda=[];sheetOpen=false;document.querySelector('#scrim').hidden=true;window.render=realR;render();
 return `${S.nome}, ${S.eta} anni, ${S.anno}, ${S.scuola.stato}, casa: ${S.casa.tipo}`;
}'''
JS_BOTTONI=r'''(sel)=>[...document.querySelectorAll(sel)].map(b=>((b.disabled?'✗ ':'✓ ')+b.innerText.replace(/\s+/g,' ').trim()).slice(0,110)).filter(t=>t.length>2)'''
righe=['# Cosa si può fare a ogni età','','Generato da `python tools/eta_azioni.py` (ROADMAP 0.5). ✓ si può fare · ✗ si vede ma è disattivato.','']
with sync_playwright() as p:
    b=p.chromium.launch();errs=[]
    for e in ETA:
        pg=b.new_page(viewport={'width':400,'height':820});pg.on('pageerror',lambda x:errs.append(str(x)))
        pg.goto(GAME);pg.wait_for_timeout(300);pg.add_script_tag(content=AP)
        chi=pg.evaluate(JS_GIOCA,e)
        righe+=[f'## {e} anni','',f'*{chi}*','']
        for s in SCHEDE:
            pg.click(f'.tab[data-tab="{s}"]');pg.wait_for_timeout(50)
            bs=pg.evaluate(JS_BOTTONI,'#view button')
            righe.append(f'**{NOMI[s]}**: '+(' · '.join(bs) if bs else '(niente)'))
            righe.append('')
            if s=='attivita':   # le sotto-schede di «Tempo»
                for sub in ['Attività','Social','Crimine']:
                    t=pg.locator('#view button',has_text=sub).first
                    if not t.count(): continue
                    t.click();pg.wait_for_timeout(50)
                    bs=pg.evaluate(JS_BOTTONI,'#view button');testo=pg.locator('#view').inner_text().replace('\n',' ')[:300]
                    righe+=[f'**Tempo → {sub}**: '+(' · '.join(x for x in bs if not any(x[2:].startswith(w) for w in ('Settimana','Attività','Social','Crimine'))) or '(nessun bottone)'),f'> {testo}','']
        # il menu di una persona di famiglia (la prima della lista)
        pg.click('.tab[data-tab="persone"]');pg.wait_for_timeout(50)
        per=pg.locator('#view button.person').first
        if per.count():
            nome=per.inner_text().split('\n')[0];per.click();pg.wait_for_timeout(80)
            bs=pg.evaluate(JS_BOTTONI,'#shA button')
            righe+=[f'**Menu di {nome}**: '+' · '.join(bs),'']
        pg.close()
    b.close()
out=ROOT/'tools'/'eta_azioni_out.md';out.write_text('\n'.join(righe),encoding='utf-8')
print('scritto',out.relative_to(ROOT),'· errori JS:',errs[:3])
