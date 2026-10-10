"""Italia vera (ROADMAP, Fase 3): vite nate in anni diversi (dal 1950) giocate dal pilota automatico.
Controlla:
- ANACRONISMI: ogni testo mostrato (fogli, scelte, esiti, diario) viene confrontato con la tabella EPOCA (c9_epoca.js):
  nessuna parola deve comparire prima del suo anno (telefonini nel 1975, euro nel 1990, social nel 2003…);
- lire fino al 2001 e euro dopo; pensione con le regole dell'anno; naja per i nati fino al 1985;
- territorio, sanità e lavoro (se presenti): occupati e stipendi per zona, screening, emigrazione dal Sud, cassa integrazione.

    python tools/italia_vera.py 12            # 12 vite per ognuno degli anni 1950, 1965, 1980, 2000
    python tools/italia_vera.py 6 1950 1958   # anni scelti
"""
import pathlib, sys, json, statistics as st
from collections import Counter, defaultdict
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
arg = [a for a in sys.argv[1:]]
N = int(arg[0]) if arg else 10
ANNI = [int(a) for a in arg[1:]] or [1950, 1965, 1980, 2000]
AP = (ROOT/'tools'/'autopilota.js').read_text(encoding='utf-8')
JS = r'''
([N,ANNI])=>{
 const errs=[],ana=[],vite=[];window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 const chk=(t,dove)=>{if(!S||!t)return;const a=annoTesto(t);if(a>S.anno){let w='';for(const [rx,y] of EPOCA)if(y===a){const m=t.match(rx);if(m){w=m[0];break}}ana.push({anno:S.anno,dal:a,w,dove,t:t.slice(0,110)})}};
 const l0=log;window.log=function(t,k){if(k!=='n')chk(t,'diario');return l0(t,k)};   // le notizie della storia introducono le cose nuove: non contano
 const s0=showSheet;window.showSheet=function(o){const r=s0(o);chk(document.querySelector('#shT').textContent,'titolo: '+(o.t||''));chk(document.querySelector('#shP').textContent,'testo: '+(o.t||''));document.querySelectorAll('#shA button').forEach(b=>chk(b.textContent,'scelta: '+(o.t||'')));return r};
 const r0=risultato;window.risultato=function(res){if(res&&res[0])chk(res[0],'esito: '+(document.querySelector('#shT').textContent||''));return r0(res)};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
 for(const anno of ANNI)for(let v=0;v<N;v++){
  try{const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s,anno,meseN:r(0,11)});
   const V={anno,sesso:x,zona:luogo().zona,lire:null,euro:null,pens:null,naja:null,campioni:[]};
   let k=0;
   while(S.vivo&&k<1500){k++;AP.mese();risolvi();mese();risolvi();
     if(S.anno===1990&&S.mese===0&&V.lire===null)V.lire=eur(1000);
     if(S.anno===2010&&S.mese===0&&V.euro===null)V.euro=eur(1000);
     if(S.pensione&&V.pens===null)V.pens={anno:S.anno,eta:S.eta,contr:Math.round(S.contributi||0),tipo:S.fatti.pensioneTipo,retr:Math.round(S.anniRetr||0)};
     if(S.mese===S.meseNascita&&[30,40,50].includes(S.eta))V.campioni.push({eta:S.eta,zona:luogo().zona,lav:!!S.lavoro,ral:S.lavoro?Math.round(ralEff(S.lavoro)/S.mondo.ip):0});
   }
   V.naja=S.fatti.naja||null;V.screen=S.fatti.screening||0;V.cig=S.fatti.cigN||0;V.emig=S.fatti.emigrato||0;V.eta=S.eta;
   vite.push(V);
  }catch(e){errs.push(anno+': '+e.message+' | '+(e.stack||'').split('\n').slice(0,2).join(' / '))}
 }
 return {ana,vite,errs};
}
'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    pg.add_script_tag(content=AP)
    r = pg.evaluate(JS, [N, ANNI])
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
V = r['vite']; A = r['ana']
print(f"{len(V)} vite (nate nel {', '.join(map(str, ANNI))}) · errori {r['errs'][:3]} {pe[:3]}")
print(f"\nANACRONISMI: {len(A)} testi fuori epoca")
per = Counter((a['w'].lower(), a['dal']) for a in A)
for (w, d), n in per.most_common(25): print(f"  {n:4} × «{w}» (dal {d})")
dove = Counter(a['dove'].split(':')[0]+': '+a['dove'].split(': ',1)[-1][:40] for a in A)
for d, n in dove.most_common(25): print(f"  {n:4}  {d}")
for a in A[:12]: print(f"   {a['anno']} «{a['w']}» · {a['dove'][:50]} · {a['t']}")
lire = [v['lire'] for v in V if v['lire']]; euro = [v['euro'] for v in V if v['euro']]
if lire: print('\nMille euro di oggi nel 1990:', lire[0], '· nel 2010:', euro[0] if euro else '—')
P = [v['pens'] for v in V if v['pens']]
for a in ANNI:
    L = [v['pens'] for v in V if v['anno'] == a and v['pens']]
    if L: print(f"Nati nel {a}: pensione a {st.median(x['eta'] for x in L)} anni (mediana), nel {st.median(x['anno'] for x in L)}, {st.median(x['contr'] for x in L)} anni di contributi, {st.median(x['retr'] for x in L)} nel retributivo · {Counter(x['tipo'] for x in L).most_common()}")
nj = Counter(v['naja'] for v in V if v['sesso'] == 'M' and v['anno'] <= 1985)
if nj: print('Naja (maschi nati fino al 1985):', nj.most_common())
C = [c for v in V for c in v['campioni']]
if C:
    for z in ['Nord-ovest', 'Nord-est', 'Centro', 'Sud', 'Isole']:
        L = [c for c in C if c['zona'] == z]
        if L: print(f"  {z:10} occupati {sum(c['lav'] for c in L)/len(L):.0%} · stipendio mediano {st.median([c['ral'] for c in L if c['lav']] or [0]):.0f} € di oggi ({len(L)} campioni)")
print('Screening fatti per vita:', round(st.mean(v['screen'] for v in V), 1), '· mesi di cassa integrazione:', round(st.mean(v['cig'] for v in V), 1), '· emigrati dal Sud:', sum(1 for v in V if v['emig']))
ok = len(A) == 0
print('\nANACRONISMI:', 'nessuno ✓' if ok else 'da sistemare')
