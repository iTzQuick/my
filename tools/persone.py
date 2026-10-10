"""Persone vere (ROADMAP, Fase 2): N vite giocate dal pilota automatico, misurando
- gli amici stretti (rapporto ≥60 o migliore amico) che hanno almeno un legame con un'altra persona del gioco
  (stesso gruppo, legame esplicito, famiglia), controllati a 25, 35, 45, 55 e 65 anni;
- i ricordi di almeno 10 anni prima che tornano in gioco (S.fatti.ritorni) e dove tornano;
- gruppi, legami, coppie tra amici, eventi leg_/mem_/edu_/cop_ per vita, stile da genitore e carattere dei figli.

    python tools/persone.py 40

«Fatto» quando: almeno il 95% degli amici stretti è legato a qualcuno e i ritorni sono almeno 5 per vita (media).
"""
import pathlib, sys, json, statistics as st
from collections import Counter
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
N = int(sys.argv[1]) if len(sys.argv) > 1 else 30
AP = (ROOT/'tools'/'autopilota.js').read_text(encoding='utf-8')
JS = r'''
(N)=>{
 const errs=[],vite=[];window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 const cnt={};const n0=next;window.next=function(){if(coda.length){const q=coda[0];const id=q.e.id;if(/^(leg|mem|edu|cop)_/.test(id))cnt[id]=(cnt[id]||0)+1}return n0.apply(this,arguments)};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
 for(let v=0;v<N;v++){
  try{const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
   const campioni=[];let k=0,stiliFigli=[];
   while(S.vivo&&k<1500){k++;AP.mese();risolvi();const e0=S.eta;mese();risolvi();
     if(S.vivo&&S.eta!==e0&&[25,35,45,55,65].includes(S.eta)){const C=amiciStretti();campioni.push({eta:S.eta,n:C.length,leg:C.filter(legatoAqualcuno).length,soli:C.filter(a=>!legatoAqualcuno(a)).map(a=>a.dove||'?')})}
     for(const f of vivi(['Figlio']))if(f.eta===18&&f.mn===S.mese&&S.genit&&f.pers&&!f.conEx&&!f._vist){f._vist=1;stiliFigli.push({st:stileGen(),p:{...f.pers}})}
   }
   const L=S.legami||[];
   vite.push({eta:S.eta,ritorni:S.fatti.ritorni||0,dove:(S.ritorni||[]).filter(r=>r.t-r.da>=120).map(r=>r.dove),campioni,gruppi:(S.gruppi||[]).length,leg:Counter0(L.map(l=>l.t)),stile:S.genit?stileGen():null,figli:stiliFigli,genScelte:S.genit?S.genit.st.length:0});
  }catch(e){errs.push(e.message+' | '+(e.stack||'').split('\n').slice(0,2).join(' / '))}
 }
 function Counter0(a){const o={};a.forEach(x=>o[x]=(o[x]||0)+1);return o}
 return {vite,errs,cnt};
}
'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    pg.add_script_tag(content=AP)
    r = pg.evaluate(JS, N)
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
V = r['vite']
camp = [c for v in V for c in v['campioni']]
tot = sum(c['n'] for c in camp); leg = sum(c['leg'] for c in camp)
quota = leg/tot if tot else 1
print(f"{len(V)} vite · errori {r['errs'][:3]} {pe[:3]}")
print(f"Amici stretti legati ad altre persone del gioco: {leg}/{tot} = {quota:.0%} (obiettivo 95%)")
for e in [25, 35, 45, 55, 65]:
    L = [c for c in camp if c['eta'] == e]
    if L: print(f"  a {e} anni: in media {st.mean(c['n'] for c in L):.1f} amici stretti, legati il {sum(c['leg'] for c in L)/max(1,sum(c['n'] for c in L)):.0%}")
soli = Counter(d for c in camp for d in c['soli'])
if soli: print('  amici stretti senza legami, per dove li hai conosciuti:', soli.most_common(8))
rit = [v['ritorni'] for v in V]
print(f"Ricordi di almeno 10 anni prima che tornano: media {st.mean(rit):.1f} per vita, mediana {st.median(rit)} (obiettivo 5)")
print('  dove tornano:', Counter(d for v in V for d in v['dove']).most_common())
print('Gruppi per vita:', round(st.mean(v['gruppi'] for v in V), 1), '· legami:', dict(sum((Counter(v['leg']) for v in V), Counter())))
print('Eventi della Fase 2 (volte per vita):', [(k, round(n/len(V), 2)) for k, n in sorted(r['cnt'].items(), key=lambda x: -x[1])])
print('Stile da genitore a fine vita:', Counter(v['stile'] for v in V if v['stile']).most_common(), '· scelte da genitore per vita:', round(st.mean(v['genScelte'] for v in V), 1))
F = [f for v in V for f in v['figli']]
if F:
    for s in ['autorevole', 'permissivo', 'autoritario', 'distaccato']:
        L = [f['p'] for f in F if f['st'] == s]
        if L: print(f"  figli a 18 anni con un genitore {s} ({len(L)}): " + '  '.join(f"{k} {st.mean(x[k] for x in L):.0f}" for k in 'OCEAN'))
ok = quota >= .95 and st.mean(rit) >= 5
print('\nFASE 2:', 'FATTA ✓' if ok else 'non ancora')
