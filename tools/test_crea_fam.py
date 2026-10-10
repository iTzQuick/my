"""Editor «Famiglia» della creazione: clic casuali su età dei genitori, numero e età dei fratelli e «Un'altra famiglia».
Dopo ogni clic le età devono rispettare le regole degli invarianti (fratelli ad almeno 15 mesi tra loro e da te, madre ≥ 15 anni e padre ≥ 16
alla nascita di ognuno, mesiFratelli() possibile); ogni 5 clic si fa nascere il personaggio e INV.controlla() non deve trovare niente.

    python tools/test_crea_fam.py        # 1500 clic
    python tools/test_crea_fam.py 4000
"""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
INV = (ROOT/'tools'/'invarianti.js').read_text(encoding='utf-8')
N = int(sys.argv[1]) if len(sys.argv) > 1 else 1500
JS = r'''async (N)=>{
 const ko=[],errs=[];window.addEventListener('error',e=>errs.push(e.message));window.save=()=>{};
 const clic=s=>{const bs=[...document.querySelectorAll(s)];if(bs.length)pick(bs).click()};
 document.querySelector('[data-et="famiglia"]').click();await new Promise(r=>setTimeout(r,300));
  if(!document.querySelector('#dFam'))return {ko:['scheda Famiglia non aperta: '+C.tab],errs,nati:0,maxFr:0};
 let nati=0,maxFr=0;
 for(let i=0;i<N;i++){
  const t=Math.random();
  if(t<.04)clic('#dFam');else clic('[data-st]');
  const F=C.fam,ages=F.fratelli.map(f=>f.eta);
  maxFr=Math.max(maxFr,ages.length);
  if(!etaFrOk(ages))ko.push(`dopo ${i} clic: età non valide ${JSON.stringify(ages)} (madre ${F.madre.eta}, padre ${F.padre.eta})`);
  if(F.padre.eta<18||F.madre.eta<18||F.madre.eta>46||F.padre.eta>65)ko.push('genitori fuori limiti');
  if(i%5===0){
   const S0=S;
   try{nuovaVita(datiVita());nati++;
    const v=INV.controlla().filter(x=>/fratelli|troppo|vecch/.test(x[0]));
    if(v.length)ko.push(`nato con ${JSON.stringify(ages)}, madre ${F.madre.eta}, padre ${F.padre.eta}: ${v.map(x=>x.join(': ')).join(' | ')}`);
   }catch(e){errs.push(e.message)}
   S=S0;
  }
  if(ko.length>5)break;
 }
 // fase 2: tutte le combinazioni di età dei genitori, fino a 4 fratelli, poi genitori che «ringiovaniscono» di colpo
 const nasce=(et)=>{const S0=S;try{nuovaVita(datiVita());nati++;const v=INV.controlla().filter(x=>/fratelli|troppo|vecch/.test(x[0]));
   if(v.length)ko.push(`${et}: ${v.map(x=>x.join(': ')).join(' | ')}`)}catch(e){errs.push(e.message)}S=S0};
 for(let em=18;em<=46;em+=2)for(let ep=18;ep<=65;ep+=3){
  const F=C.fam;F.madre.eta=em;F.padre.eta=ep;F.fratelli=[];
  for(let k=0;k<4;k++){const f=fratelloNuovo();if(!f)break;F.fratelli.push(f)}
  maxFr=Math.max(maxFr,F.fratelli.length);
  const a1=F.fratelli.map(f=>f.eta);
  if(!etaFrOk(a1))ko.push(`madre ${em}, padre ${ep}: ${JSON.stringify(a1)}`);
  nasce(`madre ${em}, padre ${ep}, fratelli ${JSON.stringify(a1)}`);
  F.padre.eta=18;F.madre.eta=Math.max(18,em-10);adattaFratelli();
  const a2=F.fratelli.map(f=>f.eta);
  if(!etaFrOk(a2))ko.push(`dopo il calo dei genitori: ${JSON.stringify(a1)} → ${JSON.stringify(a2)}`);
  nasce(`dopo il calo: ${JSON.stringify(a2)}`);
  if(ko.length>5)break;
 }
 return {ko,errs,nati,maxFr};
}'''
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 400, 'height': 820})
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    pg.evaluate("()=>localStorage.clear()")
    pg.add_script_tag(content=INV)
    r = pg.evaluate(JS, N)
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
print(f"{N} clic, {r['nati']} personaggi creati, fino a {r['maxFr']} fratelli")
print('violazioni:', r['ko'][:6] or 'nessuna ✓')
print('errori JS:', (r['errs'] + pe) or 'nessuno')
sys.exit(1 if r['ko'] or r['errs'] or pe else 0)
