"""Archivio dei salvataggi (ROADMAP 0.3): partite vere di versioni vecchie, ricaricate a ogni modifica.

  python tools/archivio_salvataggi.py
      Carica ogni file di tools/salvataggi/ nella versione attuale (dist/vitamia.html), in due modi:
      dalla memoria del browser (come all'apertura del gioco) e con «Carica partita».
      Poi apre tutte le schede e gioca 24 mesi col pilota automatico, controllando gli invarianti.
      Deve finire con «tutti i salvataggi funzionano».

  python tools/archivio_salvataggi.py crea <etichetta> [gioco.html]
      Gioca con quella versione del gioco (di solito una vecchia: git show <commit>:dist/vitamia.html > vecchia.html)
      e salva nell'archivio una partita a 1, 9, 16, 28, 45 e 72 anni: tools/salvataggi/<etichetta>_<età>anni.my
      Se il pilota automatico di oggi non va d'accordo con la versione vecchia, usa il suo:
      git show <commit>:tools/autopilota.js > ap_vecchio.js e poi AP_FILE=ap_vecchio.js

I file sono codici «VITAMIA1Z:…» come quelli di «Salva → Scarica il file» (vanno bene anche i .my
scaricati dal telefono e i codici incollati in un .txt: per esempio la partita di Noemi)."""
import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
import sys, json, base64, gzip
from playwright.sync_api import sync_playwright
DIR=ROOT/'tools'/'salvataggi'
import os
AP=open(os.environ.get('AP_FILE') or ROOT/'tools'/'autopilota.js').read()   # per una versione vecchia: AP_FILE=il suo autopilota.js
INV=open(ROOT/'tools'/'invarianti.js').read()
ETA=[1,9,16,28,45,72]

def json_da(testo):
    """Codice VITAMIA1Z/J o JSON → testo JSON dello stato (come statoDaCodice nel gioco)."""
    t=testo.strip()
    if t.startswith('{'): return t
    tipo,_,dati=t.partition(':')
    raw=base64.b64decode(''.join(dati.split()))
    return gzip.decompress(raw).decode('utf-8') if tipo=='VITAMIA1Z' else raw.decode('utf-8')

def crea(etichetta,gioco):
    DIR.mkdir(exist_ok=True)
    JS=r'''async (ETA)=>{
     window.render=()=>{};window.save=()=>{};window.toast=()=>{};
     const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
     const out={};
     for(const e of ETA){
      for(let tent=0;tent<20&&!out[e];tent++){
       const x=pick(['M','F']);const cc=comuneCaso();
       nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
       let k=0;while(S.vivo&&S.eta<e&&k<1200){k++;AP.mese();risolvi();mese();risolvi()}
       if(S.vivo&&S.eta>=e)out[e]=await codiceDa(S);
      }
     }
     return out;
    }'''
    with sync_playwright() as p:
        b=p.chromium.launch();pg=b.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(_pl.Path(gioco).resolve().as_uri());pg.wait_for_timeout(300)
        pg.add_script_tag(content=AP)
        r=pg.evaluate(JS,ETA);b.close()
    for e,cod in r.items():
        f=DIR/f'{etichetta}_{e}anni.my';f.write_text(cod,encoding='utf-8');print('scritto',f.relative_to(ROOT),len(cod)//1024,'KB')
    print('errs',errs)

def prova():
    files=sorted(x for x in DIR.iterdir() if x.suffix in ('.my','.vitamia','.txt','.json'))
    if not files: print('archivio vuoto: usa «crea»');return
    GAME=(ROOT/'dist'/'vitamia.html').as_uri()
    GIOCA=r'''(stato)=>{
     const err=[],inv=new Set();
     try{caricaStato(JSON.parse(stato))}catch(e){return {err:['Carica partita: '+e.message]}}
     for(const t of ['vita','scuola','lavoro','persone','beni','attivita']){try{tab=t;render()}catch(e){err.push('scheda '+t+': '+e.message)}}
     window.render=()=>{};window.save=()=>{};window.toast=()=>{};
     const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
     const eta0=S.eta;let mesi=0;
     try{for(;mesi<24&&S.vivo;mesi++){AP.mese();risolvi();mese();risolvi();if(S.vivo)for(const [c,m] of INV.controlla())if(![...inv].some(x=>x.startsWith(c+':')))inv.add(c+': '+m)}}   // un esempio per tipo
     catch(e){err.push(`mese ${mesi}: ${e.message} | ${(e.stack||'').split('\n').slice(1,3).join(' / ')}`)}
     return {err,inv:[...inv].slice(0,6),eta0,eta:S.eta,mesi,vivo:S.vivo};
    }'''
    rotti=0
    with sync_playwright() as p:
        b=p.chromium.launch()
        for f in files:
            try: stato=json_da(f.read_text(encoding='utf-8'))
            except Exception as e: print(f'✗ {f.name}: file illeggibile ({e})');rotti+=1;continue
            ctx=b.new_context();pe=[]
            # 1) dalla memoria del browser, come quando si riapre il gioco
            ctx.add_init_script('try{if(!sessionStorage.getItem("x")){sessionStorage.setItem("x",1);localStorage.setItem("vitamia_save_v4",'+json.dumps(stato)+')}}catch(e){}')
            pg=ctx.new_page();pg.on('pageerror',lambda e:pe.append(str(e)))
            pg.goto(GAME);pg.wait_for_timeout(300)
            ok_mem=pg.evaluate('!!(S&&S.nome)')
            pg.add_script_tag(content=AP);pg.add_script_tag(content=INV)
            # 2) con «Carica partita», poi tutte le schede e 24 mesi
            r=pg.evaluate(GIOCA,stato);ctx.close()
            err=(r.get('err') or [])+pe+([] if ok_mem else ['il gioco non la riprende dalla memoria del browser'])
            if err: rotti+=1;print(f'✗ {f.name}');[print('    ',e) for e in err[:6]]
            else: print(f"✓ {f.name}: {r['eta0']} → {r['eta']} anni, {r['mesi']} mesi{'' if r['vivo'] else ' (morto nel frattempo)'}")
            for x in r.get('inv',[]): print('     invariante (può venire da un errore della versione vecchia):',x)
        b.close()
    print('\ntutti i salvataggi funzionano' if not rotti else f'\n{rotti} salvataggi rotti su {len(files)}')

if len(sys.argv)>1 and sys.argv[1]=='crea':
    crea(sys.argv[2],sys.argv[3] if len(sys.argv)>3 else ROOT/'dist'/'vitamia.html')
else:
    prova()
