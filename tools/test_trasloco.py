"""Traslochi: chi vive nella tua nuova città non è «lontano», anche se è un Ex, un Conoscente o un Nemico.
Il difetto: una partner non convivente diventa «lontano» quando ti trasferisci; se poi vi lasciate (Ex) e torni in quella città,
dopoTrasloco saltava gli Ex e restava «lontano» con dove = la tua città (invariante «lontano ma nella tua città»).

    python tools/test_trasloco.py
"""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
INV = (ROOT/'tools'/'invarianti.js').read_text(encoding='utf-8')
JS = r'''()=>{
 const ko=[];window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 for(const ruolo of ['Ex','Conoscente','Nemico']){
  nuovaVita({sesso:'M',nome:'Prova',cognome:'Test',citta:'Roma',prov:'RM'});
  S.eta=30;S.anno=S.annoNascita+30;S.casa={tipo:'affitto',n:'Monolocale',costo:P(6000)};
  const p=nuovaPersona('Partner','F',29,null,{rapporto:60});   // non convive
  vaiA('Milano','MI');                                        // ti trasferisci: lei resta a Roma, quindi «lontano»
  if(!p.lontano||p.dove!=='Roma')ko.push(ruolo+': prima del cambio di ruolo dovrebbe essere lontano a Roma ('+p.lontano+','+p.dove+')');
  p.ruolo=ruolo;                                             // vi lasciate / diventa un'altra cosa
  vaiA('Roma','RM');                                         // torni nella sua città
  if(p.lontano||p.dove)ko.push(ruolo+': dopo il ritorno è ancora lontano ('+p.lontano+', dove '+p.dove+')');
  const v=INV.controlla().filter(x=>/lontano/.test(x[0]));if(v.length)ko.push(ruolo+': invariante '+v.map(x=>x.join(': ')).join(' | '));
 }
 return ko;
}'''
with sync_playwright() as pw:
    b = pw.chromium.launch(); pe = []
    pg = b.new_page(); pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300); pg.add_script_tag(content=INV)
    ko = pg.evaluate(JS)
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
print('PROVE:', ko or 'tutte superate ✓')
print('errori JS:', pe or 'nessuno')
sys.exit(1 if ko or pe else 0)
