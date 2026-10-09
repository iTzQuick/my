"""Prova forzata di eventi: apre ogni evento (per prefisso id) e clicca ogni risposta, da maschio e da femmina.
Uso: python tools/test_eventi.py ad_        → stampa testi ed esiti, e gli errori JS."""
import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
import json, sys
from playwright.sync_api import sync_playwright
PRE=sys.argv[1] if len(sys.argv)>1 else 'ad_'
JS=r'''
(PRE)=>{
 const errs=[];window.addEventListener('error',e=>errs.push(e.message));
 document.querySelector('#btnRnd').click();
 const base=JSON.stringify(S);
 const out=[];
 const ids=Object.keys(EV).filter(id=>id.startsWith(PRE));
 for(const id of ids){
  const e=EV[id];
  for(const ses of ['M','F'])for(let i=0;i<6;i++){
   S=JSON.parse(base);coda.length=0;
   S.sesso=ses;S.eta=Math.max(e.min,Math.min(e.max,e.min+10));S.soldi=100000;S.pensione=S.eta>=62?1200:0;
   S.casa={tipo:'affitto'};S.istr.liv=3;S.veicoli.push({id:S.nextId++,n:'Utilitaria',valore:8000,stato:90,costo:600});
   if(S.eta<62)assumi(LAVORI.find(j=>j.id==='imp'));
   let p=null;
   if(e.chi){
    const ru=e.chi[0];
    const et=ru==='Figlio'?(id.includes('bullo')?12:id.includes('sitter')?35:25):ru==='Madre'||ru==='Padre'?S.eta+28:S.eta;
    p=nuovaPersona(ru,i%2?'F':'M',et,null,{rapporto:ru==='Madre'?20:50});
    if(id.includes('sitter'))nuovaPersona('Nipote','M',5,null,{gen:p.id});
   }
   if(id==='ad_casa_vuota'){const c=nuovaPersona('Coniuge','F',S.eta,null,{});c.vivo=false}
   const d={_fut:1};if(p)d.p=p;
   coda.push({e,d});next();
   const bs=[...document.querySelectorAll('#shA button:not([disabled])')];
   if(i>=bs.length)break;
   const tit=document.querySelector('#shT').textContent,txt=document.querySelector('#shP').textContent,lab=bs[i].textContent;
   bs[i].click();
   const res=document.querySelector('#shP').textContent;
   out.push(`${id} [${ses}] ${tit} | ${txt}\n   → ${lab}\n   = ${res}`);
   while(!document.querySelector('#scrim').hidden){const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}
  }
 }
 return {errs,out};
}
'''
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':400,'height':820})
    errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    r=pg.evaluate(JS,PRE)
    sys.stdout.reconfigure(encoding='utf-8')
    print('\n'.join(r['out']))
    print('errs',r['errs'],errs[:5])
    b.close()
