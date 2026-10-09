"""Misura il realismo: gioca N vite con il pilota automatico e confronta il corso della vita con i dati italiani.
Uso: python tools/realismo.py 200   (≈ 1 minuto ogni 40 vite)
Stampa una tabella «gioco vs Italia» e salva i dati grezzi in tools/realismo_out.json.
I valori «Italia» sono riferimenti ISTAT/Eurostat recenti (vedi ANALISI.md per le fonti)."""
import pathlib, os, json, sys, statistics as st
from collections import Counter
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
N = int(sys.argv[1]) if len(sys.argv) > 1 else 60
AP = (ROOT/'tools'/'autopilota.js').read_text(encoding='utf-8')
JS = r'''
(N)=>{
 const errs=[],out=[];
 window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 let evEta={};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;evEta[S.eta]=(evEta[S.eta]||0)+1;if(!AP.scegli()){sheetOpen=false;break}}};
 for(let v=0;v<N;v++){
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
   evEta={};
   const L={sesso:x,classe:S.classe,primo:{},stato:{},ral:{},casa:{},fumo:{},amici:{},mal:new Set(),coniugi:new Set(),div:0,ved:0,citta:new Set([S.citta]),estero:0,animMax:0,figliNati:0,pensEta:null,pensRap:null,ultNetto:0,genMorte:{},umore:{},ctr:{},ptv:{},redd:{}};
   const prima=(k)=>{if(L.primo[k]===undefined)L.primo[k]=S.eta};
   let k=0;
   while(S.vivo&&k<1500){
     k++;AP.mese();risolvi();mese();risolvi();
     const pa=partnerAttuale();
     if(pa)prima('partner');
     if(S.mese===S.meseNascita&&S.eta===35){L.coppia35=pa?1:0;L.conv35=pa&&pa.conv?1:0}
     if(S.relazioni.some(p=>p.vivo&&p.conv))prima('conv');
     for(const p of S.relazioni){
       if(p.ruolo==='Coniuge'&&p.vivo){if(!L.coniugi.has(p.id)){L.coniugi.add(p.id);prima('nozze')}}
       if(L.coniugi.has(p.id)&&p.ruolo==='Ex'&&!p._div){p._div=1;L.div++}
       if(L.coniugi.has(p.id)&&p.ruolo==='Coniuge'&&!p.vivo&&!p._ved){p._ved=1;L.ved++;if(L.primo.vedovo===undefined)L.primo.vedovo=S.eta}
       if((p.ruolo==='Madre'||p.ruolo==='Padre')&&!p.vivo&&L.genMorte[p.ruolo]===undefined)L.genMorte[p.ruolo]=S.eta;
     }
     const fig=S.relazioni.filter(p=>p.ruolo==='Figlio').length;if(fig>0)prima('figlio');L.figliNati=Math.max(L.figliNati,fig);
     if(S.casa.tipo!=='genitori'&&S.eta>=14)prima('fuoriCasa');
     if(S.pensione&&L.pensEta===null){L.pensEta=S.eta;L.pensRap=L.ultNetto?S.pensione/L.ultNetto:null}
     if(S.lavoro)L.ultNetto=netto(S.lavoro.stip);
     S.malattie.forEach(m=>L.mal.add(m.n));
     L.citta.add(S.citta);if(cittaInfo&&(()=>{try{return cittaInfo(S.citta).estero}catch(e){return false}})())L.estero=1;
     L.animMax=Math.max(L.animMax,S.animali.length);
     if(S.istr.liv>=2)prima('diploma');if(S.istr.liv>=3)prima('laurea');
     {const dk=Math.floor(S.eta/10)*10;const u=L.umore[dk]||(L.umore[dk]={f:0,s:0,st:0,n:0});u.f+=S.felicita;u.s+=S.salute;u.st+=S.bis.stress;u.n++}
     if(S.mese===S.meseNascita){
       const e=S.eta;
       if(S.lavoro){L.ctr[e]=S.lavoro.contratto?S.lavoro.contratto.t:'ind';L.ptv[e]=S.lavoro.ptv?1:0;L.redd[e]=Math.round(ralEff(S.lavoro)/S.mondo.ip)}
       L.stato[e]=S.carcere>0?'carcere':S.pensione?'pens':S.lavoro?(JOB[S.lavoro.id].pt?'pt':'lav'):S.azienda?'az':iscritto()?'stud':'nulla';
       if([25,30,40,50,60].includes(e)&&S.lavoro)L.ral[e]=Math.round(S.lavoro.stip/S.mondo.ip);
       if([30,40,50,65,80].includes(e))L.casa[e]=S.casa.tipo;
       if([20,30,50].includes(e))L.fumo[e]=!!S.dip.fumo;
       if([10,15,20,30,50,70].includes(e))L.amici[e]=vivi(['Amico']).length;
     }
   }
   L.eta=S.eta;L.causa=S.causa;L.mal=[...L.mal];L.coniugi=L.coniugi.size;L.citta=L.citta.size;L.tit=S.istr.liv;L.lavoro=S.ultimoLavoro;L.evEta=evEta;L.fed=S.fedina.length;
   L.pat=Math.round(patrimonio()/S.mondo.ip);
   out.push(L);
  }catch(e){errs.push(e.message+' | '+(e.stack||'').split('\n').slice(0,2).join(' / '))}
 }
 return {out,errs};
}
'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    pg.add_script_tag(content=AP)
    r = pg.evaluate(JS, N)
    b.close()
o = r['out']
for x in o:
    for f in ('stato', 'ral', 'casa', 'fumo', 'amici', 'evEta', 'umore', 'ctr', 'ptv', 'redd'):
        x[f] = {int(k): v for k, v in x[f].items()}
json.dump(r, open(ROOT/'tools'/'realismo_out.json', 'w', encoding='utf-8'))
sys.stdout.reconfigure(encoding='utf-8')
print('vite', len(o), 'errori', r['errs'][:5], pe[:3])
def med(a): return round(st.median(a), 1) if a else '—'
def pc(n, d): return f'{round(100*n/d)}%' if d else '—'
M = [x for x in o if x['sesso'] == 'M']; F = [x for x in o if x['sesso'] == 'F']
righe = []
def R(nome, gioco, italia): righe.append((nome, str(gioco), italia))
R('Età alla morte, uomini (mediana)', med([x['eta'] for x in M]), 'speranza di vita 81,7 (ISTAT 2025)')
R('Età alla morte, donne (mediana)', med([x['eta'] for x in F]), 'speranza di vita 85,7 (ISTAT 2025)')
R('Morti prima dei 50 anni', pc(sum(1 for x in o if x['eta'] < 50), len(o)), 'pochi % (non verificato)')
R('Età prima convivenza/uscita di casa', med([x['primo']['fuoriCasa'] for x in o if 'fuoriCasa' in x['primo']]), "30,2 anni (Eurostat 2025; donne 29,2, uomini ≈ 31)")
R('Ancora con i genitori a 30 anni', pc(sum(1 for x in o if x['casa'].get(30) == 'genitori'), sum(1 for x in o if 30 in x['casa'])), 'circa metà (età media d\'uscita 30,2)')
R('In coppia a 35 anni', pc(sum(x.get('coppia35',0) for x in o), sum(1 for x in o if 'coppia35' in x)), 'circa 7 su 10 vivono in coppia tra 35 e 44 anni (da verificare)')
R('Convivono a 35 anni', pc(sum(x.get('conv35',0) for x in o), sum(1 for x in o if 'conv35' in x)), '—')
R('Età al primo matrimonio, uomini', med([x['primo']['nozze'] for x in M if 'nozze' in x['primo']]), '34,8 (ISTAT 2024)')
R('Età al primo matrimonio, donne', med([x['primo']['nozze'] for x in F if 'nozze' in x['primo']]), '32,8 (ISTAT 2024)')
R('Mai sposati a fine vita', pc(sum(1 for x in o if x['coniugi'] == 0), len(o)), 'primo-nuzialità 372 uomini e 422 donne su 1.000 (2024)')
R('Matrimoni finiti in divorzio', pc(sum(x['div'] for x in o), sum(x['coniugi'] for x in o)), '75.014 separazioni e 77.364 divorzi contro 173.272 nozze (2024)')
R('Vedovi/e almeno una volta', pc(sum(1 for x in o if x['ved']), sum(1 for x in o if x['coniugi'])), 'molto più le donne (vivono 4 anni di più)')
R('Figli per donna', round(st.mean([x['figliNati'] for x in F]), 2) if F else '—', '1,18 (2024) → 1,14 (2025)')
R('Età della madre al primo figlio', med([x['primo']['figlio'] for x in F if 'figlio' in x['primo']]), 'età media al parto 32,7 (2025, tutti i figli)')
R('Senza figli a fine vita', pc(sum(1 for x in o if x['figliNati'] == 0), len(o)), 'circa 1 su 4 (non verificato)')
tit = Counter(x['tit'] for x in o if x['eta'] >= 30)
R('Laureati (tra chi arriva a 30)', pc(sum(v for k, v in tit.items() if k >= 3), sum(tit.values())), '31,6% tra 25–34 anni (2024)')
R('Senza diploma (tra chi arriva a 30)', pc(sum(v for k, v in tit.items() if k <= 1), sum(tit.values())), '33,3% tra 25–64; 9,8% abbandoni tra 18–24 (2024)')
def quota(stati, a, b, cerca):
    n = d = 0
    for x in o:
        for e, s in x['stato'].items():
            if a <= e <= b:
                d += 1; n += s in cerca
    return n, d
n, d = quota(None, 20, 64, ('lav', 'pt', 'az')); R('Occupati tra 20 e 64 anni', pc(n, d), '67,6% (2025; Nord 69,8%, Sud 50,0%; donne ≈ 54% tra 15–64)')
n, d = quota(None, 15, 29, ('nulla',)); R('NEET tra 15 e 29 anni (né lavoro né studio)', pc(n, d), '13,3% (2025), 20% tra 25–29')
n, d = quota(None, 15, 24, ('pt', 'lav', 'az', 'stud')); R('Tra 15 e 24 anni: lavora o studia', pc(n, d), '—')
for k, rif in ((30, '29.900 € a 25–34'), (40, '33.000 € a 35–44'), (60, '35.900 € a 55–64')):
    v = [x['ral'].get(k) for x in o]
    v = [y for y in v if y]
    R(f'RAL a {k} anni (mediana, euro di oggi)', med(v), f'RAL media {rif} (JobPricing 2025)')
R('Età di pensionamento', med([x['pensEta'] for x in o if x['pensEta']]), '67 (vecchiaia) o 42a10m di contributi (anticipata)')
R('Pensione / ultimo netto', med([round(x['pensRap'], 2) for x in o if x['pensRap']]), 'dipende dai contributi di tutta la vita (contributivo)')
R('Senza pensione (morti dopo i 70)', pc(sum(1 for x in o if not x['pensEta'] and x['eta'] > 70), sum(1 for x in o if x['eta'] > 70)), 'chi non ha i contributi ha l\'assegno sociale (538 €/mese, 2025)')
def quotaCtr(a, b, tipo):
    n = d = 0
    for x in o:
        for e, t in x['ctr'].items():
            if a <= e <= b and t != 'piva' and t != 'carica':
                d += 1; n += t == tipo
    return n, d
print('Contratti tra 20 e 34 anni:', Counter(t for x in o for e, t in x['ctr'].items() if 20 <= e <= 34).most_common())
n, d = quotaCtr(20, 64, 'det'); R('Dipendenti a termine (20–64 anni)', pc(n, d), '14,7% dei dipendenti (ISTAT 2024)')
n, d = quotaCtr(18, 34, 'det'); R('Dipendenti a termine sotto i 35 anni', pc(n, d), '28,1% degli occupati sotto i 35 (2024)')
for ses, rif in (('M', '7,5%'), ('F', '30,0%')):
    g = [x for x in o if x['sesso'] == ses]; n = sum(1 for x in g for e, v in x['ptv'].items() if 25 <= e <= 54 and v); d = sum(1 for x in g for e, v in x['ptv'].items() if 25 <= e <= 54)
    R(f'In part-time tra 25 e 54 anni ({"uomini" if ses == "M" else "donne"})', pc(n, d), f'{rif} degli occupati (ISTAT 2024, tutte le età)')
rm = [v for x in M for e, v in x['redd'].items() if 25 <= e <= 59 and v]; rf = [v for x in F for e, v in x['redd'].items() if 25 <= e <= 59 and v]
if rm and rf: R('Reddito da lavoro 25–59 anni: uomini / donne (mediana)', f'{round(st.median(rm)/1000,1)}k / {round(st.median(rf)/1000,1)}k ({round((1-st.median(rf)/st.median(rm))*100)}% in meno)', 'medie 27.967 / 19.833 € nel privato (−29%, INPS 2024)')   # la mediana: le carriere da star rendono la media instabile
n = sum(1 for x in o if x['casa'].get(50) == 'proprieta'); d = sum(1 for x in o if 50 in x['casa'])
R('Casa di proprietà a 50 anni', pc(n, d), '70,8% delle famiglie (2021); 81,6% delle persone (2024)')
R('Fumatori a 30 anni', pc(sum(1 for x in o if x['fumo'].get(30)), sum(1 for x in o if 30 in x['fumo'])), '18,6% dai 14 anni (2025; uomini ≈ 22%, donne ≈ 15%)')
R('Con fedina penale sporca', pc(sum(1 for x in o if x['fed']), len(o)), 'dato non verificato')
R('Amici a 30 / 50 / 70 anni (media)', ' / '.join(str(round(st.mean([x['amici'][e] for x in o if e in x['amici']]), 1)) if any(e in x['amici'] for x in o) else '—' for e in (30, 50, 70)), 'cerchia stretta ≈ 5 (teoria di Dunbar)')
R('Hanno vissuto all\'estero', pc(sum(x['estero'] for x in o), len(o)), '144.000 emigrati all\'anno (2025): non confrontabile')
R('Hanno avuto un animale', pc(sum(1 for x in o if x['animMax'] > 0), len(o)), '54,5% delle famiglie ha un animale (Assalco 2026)')
R('Età alla morte della madre (mediana)', med([x['genMorte']['Madre'] for x in o if 'Madre' in x['genMorte']]), '—')
print()
w = max(len(a) for a, _, _ in righe)
for a, g, i in righe:
    print(f'{a:<{w}}  {g:>14}   Italia: {i}')
print()
cause = Counter(x['causa'] for x in o)
print('Cause di morte:', [(c, pc(n, len(o))) for c, n in cause.most_common(12)])
import re as _re
def gruppo(c):
    c = c or ''
    for g, rx in (('tumori', 'tumore|linfoma|leucemia'), ('cuore e vasi', 'infarto|ictus|cardiaca|malore'), ('respiratorie', 'polmon|respirator'), ('demenze', 'demenza'), ('incidenti e cadute', 'incidente|caduta'), ('nel sonno', 'sonno')):
        if _re.search(rx, c): return g
    return 'altre'
gr = Counter(gruppo(x['causa']) for x in o)
print('Cause raggruppate:', [(g, pc(n, len(o))) for g, n in gr.most_common()], '· Italia 2023: cuore e vasi 30%, tumori 26%, respiratorie 8%, demenze 5%')
print('Età media alla morte: uomini', round(st.mean([x['eta'] for x in M]), 1) if M else '—', '· donne', round(st.mean([x['eta'] for x in F]), 1) if F else '—', '· Italia: speranza di vita 81,7 / 85,7')
mal = Counter(m for x in o for m in x['mal'])
print('Malattie avute (quota di vite):', [(m, pc(n, len(o))) for m, n in mal.most_common(25)])
ev = Counter()
for x in o:
    for e, n in x['evEta'].items(): ev[e // 10 * 10] += n
print('Finestre (eventi+scelte) per anno di vita, per decennio:', {f'{k}-{k+9}': round(v / max(1, sum(1 for x in o if x['eta'] >= k)) / 10, 1) for k, v in sorted(ev.items())})
print('Ultimo lavoro:', Counter(x['lavoro'] for x in o).most_common(12))

um = {}
for x in o:
    for k, u in x['umore'].items():
        a = um.setdefault(k, [0, 0, 0, 0]); a[0] += u['f']; a[1] += u['s']; a[2] += u['st']; a[3] += u['n']
print('Felicità / salute / stress medi per decennio:', {f'{k}-{k+9}': (round(a[0]/a[3]), round(a[1]/a[3]), round(a[2]/a[3])) for k, a in sorted(um.items())})
print("Italia: «molto soddisfatti» 60,8% a 14–17 anni → 40,1% dopo i 75 (ISTAT 2024): la soddisfazione cala con l'età")
