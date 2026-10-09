import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
import json, sys
from playwright.sync_api import sync_playwright
N=int(sys.argv[1]) if len(sys.argv)>1 else 3
INV=open(ROOT/'tools'/'invarianti.js').read()   # controlli dopo ogni mese (ROADMAP 0.2)
JS=r'''
async (N)=>{
 const errs=[];window.addEventListener('error',e=>errs.push(e.message));
 const tabs=['vita','scuola','lavoro','persone','beni','attivita'];
 const click=el=>{try{el.click()}catch(e){errs.push('click:'+e.message)}};
 let vite=0,mesi=0,azioni=0;const inv=[],invVisti=new Set(),pk={};
 const controlla=()=>{if(!S||!S.vivo)return;for(const [c,m] of INV.controlla()){const k=c+'|'+m;if(invVisti.has(k))continue;invVisti.add(k);if(inv.length<20)inv.push(`${S.eta} anni: ${c}: ${m}`)}INV.picchi(pk)};
 const origErr=console.error;
 for(let v=0;v<N&&!errs.length;v++){
  const r0=document.querySelector('#btnRnd');if(r0)click(r0);
  let k=0;
  while(k<4000&&!errs.length){
   k++;
   if(!document.querySelector('#scrim').hidden){
     const b=[...document.querySelectorAll('#shA button:not([disabled])')];
     if(!b.length){errs.push('sheet vuoto: '+document.querySelector('#shT').textContent);break}
     const sc=document.querySelector('#shQ');if(sc&&Math.random()<.5){sc.value=pick(['ro','mi','na','san','to']);sc.dispatchEvent(new Event('input'))}
     click(pick(b));continue;
   }
   if(document.querySelector('.obit')){vite++;const er=document.querySelector('[data-erede]');if(er&&Math.random()<.4)click(er);else click(document.querySelector('#btnRinasci'));break}
   if(Math.random()<.5){
     const t=pick(tabs);click(document.querySelector(`.tab[data-tab="${t}"]`));
     const c=[...document.querySelectorAll('#view button:not([disabled])')].filter(b=>b.id!=='btnNuova');
     if(c.length){click(pick(c));azioni++;continue}
   }
   click(document.querySelector('#btnAnno'));mesi++;controlla();
  }
 }
 const oltre=Object.keys(INV.SOGLIE).filter(k=>!(pk[k]<=INV.SOGLIE[k])).map(k=>`${k} ${pk[k]}`);
 return {errs,inv,oltre,vite,mesi,azioni,stato:S?{eta:S.eta,vivo:S.vivo}:null};
}
'''
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':400,'height':820})
    errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    pg.add_script_tag(content=INV)
    r=pg.evaluate(JS,N)
    print(json.dumps(r)[:1500]); print('pageerrors',errs[:5])
    pg.screenshot(path='fuzz2.png')
    b.close()
