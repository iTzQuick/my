"""Controllore dei testi (ROADMAP 0.1).
1. Parole da grandi negli eventi che possono capitare da piccoli (sotto).
2. Testi di tutti gli eventi (M e F, a tre età): segnaposto non risolti ({…}), «undefined», «NaN», «[object».
3. g()/gp() chiamati senza personaggio (testi costanti: darebbero sempre il maschile).
4. Nel codice: importi scritti a mano senza P() (costo:, soldi(), eur(), una(), soglie su S.soldi) e «l{lo}».
Per le parole da grandi:
Per ogni evento con età minima sotto i 16 anni, prova ogni età da min a 15: valuta titolo, testo, etichette ed esiti
(anche quelli scritti come funzioni) e salta le scelte la cui condizione è falsa a quell'età.
Uso: python tools/lint_testi.py   → elenco dei problemi; esce con codice 1 se ce ne sono.
Le eccezioni motivate sono in ECCEZIONI (id evento → parole ammesse)."""
import pathlib, sys, json
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
# parola (regex) → età minima a cui può comparire
PAROLE = {
    r'\b(telefon\w*|cellular\w*|smartphone|messaggi\w*|chat|whatsapp|emoji|meme|social|follower|online)\b': 12,
    r'\b(caff[eè]|cappuccin\w*|espresso)\b': 14,
    r'\b(birr\w*|vino|alcol\w*|ubriac\w*|spritz|aperitiv\w*|sigarett\w*|cocktail)\b': 13,
    r'\b(collega|colleghi|ufficio|stipendio|mutuo|affitto|bollett\w*|capo reparto)\b': 15,
    r'\b(patente|guidi|al volante)\b': 16,
    r'\b(sesso|letto con)\b': 16,
}
# eventi in cui la parola è voluta (l'evento parla proprio di quello, a quell'età)
ECCEZIONI = {
    'smartphone': ['telefon', 'smartphone', 'social', 'chat'],     # «Lo smartphone» (10–13 anni): il primo telefono
    'bam_cellulare_ritrovato': ['telefon', 'cellular'],             # trovi un telefono per terra
    'sigaretta': ['sigarett'],                                       # la prima sigaretta offerta alla fermata (13+)
    'ado_telefono': ['telefon', 'chat'],
    'bam_gita': ['telefonat'],                                      # è la maestra che telefona a casa
    'bam_nonno_malato': ['telefon'],                                # con il telefono di mamma
}
JS = r'''
(PAROLE)=>{
 window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 nuovaVita({sesso:'M',nome:'Luca',cognome:'Rossi',citta:'Bologna',prov:'BO'});coda.length=0;
 const base=JSON.stringify(S);const out=[];
 const txt=(v,d)=>{try{return typeof v==='function'?String(v(d)||''):String(v||'')}catch(e){return ''}};
 for(const id in EV){
  const e=EV[id];if(e.min===undefined||e.min>=16)continue;
  for(let a=Math.max(e.min,0);a<=Math.min(e.max,15);a++){
   for(const ses of ['M','F']){
    S=JSON.parse(base);S.eta=a;S.sesso=ses;S.anno=S.annoNascita+a;
    let d={};
    if(e.chi){const ru=e.chi[0];d.p=nuovaPersona(ru,'F',ru==='Nonno'?a+60:ru==='Madre'||ru==='Padre'?a+30:a,null,{})}
    try{if(e.cond&&!e.cond(d))continue}catch(err){continue}
    if(e.pc&&d.p){try{if(!e.pc(d.p))continue}catch(err){continue}}
    const pezzi=[['titolo',txt(e.t,d)],['testo',txt(e.x,d)]];
    let sc=[];try{sc=typeof e.c==='function'?e.c(d):(e.c||[])}catch(err){}
    for(const c of sc){
     try{if(c.cond&&!c.cond(d))continue}catch(err){continue}
     pezzi.push(['scelta',txt(c.l,d)]);
     for(const b of [c,c.si,c.no])if(b&&b.r)pezzi.push(['esito',txt(b.r,d)]);
    }
    for(const [dove,t] of pezzi)for(const [rx,min] of PAROLE){if(a>=min)continue;const m=t.match(new RegExp(rx,'i'));if(m)out.push({id,a,dove,parola:m[0],t:t.slice(0,90)})}
   }
  }
 }
 return out;
}
'''
JS_TESTI = r'''
()=>{
 window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 nuovaVita({sesso:'M',nome:'Luca',cognome:'Rossi',citta:'Bologna',prov:'BO'});coda.length=0;
 const base=JSON.stringify(S);const out=[];
 const BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
 const txt=(v,d)=>{try{return prezzi(T(v,d))}catch(e){return ''}};
 for(const id in EV){
  const e=EV[id];const lo=Math.max(e.min||0,0),hi=Math.min(e.max===undefined?95:e.max,95);
  for(const a of [...new Set([lo,Math.round((lo+hi)/2),hi])])for(const ses of ['M','F']){
   S=JSON.parse(base);S.eta=a;S.sesso=ses;S.anno=S.annoNascita+a;
   let d={};
   if(e.chi){const ru=e.chi[0];d.p=nuovaPersona(ru,ses==='M'?'F':'M',ru==='Nonno'?a+60:ru==='Madre'||ru==='Padre'?a+30:ru==='Figlio'?Math.max(0,a-30):a,null,{})}
   try{if(e.cond&&!e.cond(d))continue}catch(err){continue}
   if(e.pc&&d.p){try{if(!e.pc(d.p))continue}catch(err){continue}}
   const pezzi=[['titolo',txt(e.t,d)],['testo',txt(e.x,d)]];
   let sc=[];try{sc=typeof e.c==='function'?e.c(d):(e.c||[])}catch(err){}
   for(const c of sc){
    try{if(c.cond&&!c.cond(d))continue}catch(err){continue}
    pezzi.push(['scelta',txt(c.l,d)]);if(c.sub!==undefined)pezzi.push(['sub',txt(c.sub,d)]);
    for(const b of [c,c.si,c.no])if(b&&b.r)pezzi.push(['esito',txt(b.r,d)]);
   }
   for(const [dove,t] of pezzi){const m=t.match(BAD);if(m&&!(e.link&&m[0]==='undefined'))out.push({id,a,dove,parola:m[0],t:t.slice(0,90)})}   // gli eventi «link» ricevono i dati (d.x) da chi li apre
  }
 }
 return out;
}
'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    r = pg.evaluate(JS, [[k, v] for k, v in PAROLE.items()])
    r_testi = pg.evaluate(JS_TESTI)
    # g()/gp() senza personaggio: una copia del gioco che li registra quando S (o la persona) manca
    html = (ROOT/'dist'/'vitamia.html').read_text(encoding='utf-8')
    G0, GP0 = "const g=(m,f)=>(S&&S.sesso==='F')?f:m;", "const gp=(p,m,f)=>(p&&p.sesso==='F')?f:m;"
    assert G0 in html and GP0 in html, 'definizioni di g/gp cambiate: aggiorna lint_testi.py'
    html = html.replace(G0, "const g=(m,f)=>{if(!S&&m!==f)(window._gNull=window._gNull||[]).push('g('+JSON.stringify(m)+','+JSON.stringify(f)+')');return (S&&S.sesso==='F')?f:m};")
    html = html.replace(GP0, "const gp=(p,m,f)=>{if(!p&&m!==f)(window._gNull=window._gNull||[]).push('gp(…,'+JSON.stringify(m)+','+JSON.stringify(f)+')');return (p&&p.sesso==='F')?f:m};")
    import tempfile, os
    fd, tmp = tempfile.mkstemp(suffix='.html'); os.close(fd); pathlib.Path(tmp).write_text(html, encoding='utf-8')
    pg2 = b.new_page(); pg2.goto(pathlib.Path(tmp).as_uri()); pg2.wait_for_timeout(300)
    r_genere = pg2.evaluate("[...new Set(window._gNull||[])]"); os.unlink(tmp)
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
visti = set(); prob = []
for x in r:
    if any(x['parola'].lower().startswith(w) for w in ECCEZIONI.get(x['id'], [])): continue
    k = (x['id'], x['dove'], x['parola'].lower())
    if k in visti: continue
    visti.add(k); prob.append(x)
for x in prob: print(f"{x['id']:26} {x['a']:>2} anni · {x['dove']:6} · «{x['parola']}» · {x['t']}")
# testi con pezzi non risolti
visti_t = set()
for x in r_testi:
    k = (x['id'], x['dove'], x['parola'])
    if k in visti_t: continue
    visti_t.add(k); prob.append(x)
    print(f"{x['id']:26} {x['a']:>2} anni · {x['dove']:6} · non risolto «{x['parola']}» · {x['t']}")
# genere fisso: g()/gp() valutati al caricamento
for c in r_genere:
    prob.append(c); print(f"genere fisso: {c} chiamato senza personaggio (usa {{o}}/{{po}} o un testo dentro una funzione)")
# controlli sul codice
import re
REGOLE = [
    (r"costo:[1-9]\d*(?=[,}])", 'costo scritto a mano: usa costo:()=>P(…)'),
    (r"(?<![\w.])eur\(\d+\)", 'eur() di un numero: usa eur(P(…))'),
    (r"(?<![\w.])soldi\(-?\d+\)", 'soldi() di un numero: usa soldi(P(…))'),
    (r"(?<![\w.])una\([^,]+,[1-9]\d*,", 'una() con un costo scritto a mano: usa P(…)'),
    (r"S\.soldi\s*[<>]=?\s*-?\d{3,}", 'soglia sui soldi scritta a mano: usa P(…)'),
    (r"l\{lo\}", '«l{lo}» diventa «…llo»: scrivi veder{lo}'),
]
for f in sorted((ROOT/'src').glob('*.js')):
    if f.name.startswith('b'): continue       # tabelle di dati: i prezzi passano da P() quando si usano
    for i, ln in enumerate(f.read_text(encoding='utf-8').split('\n'), 1):
        if '{sez:' in ln or re.match(r"\s*\{id:'\w+',n:'", ln) or ln.lstrip().startswith(('/*', '//', '*')): continue   # attività: il costo passa da P() quando si paga
        for rx, msg in REGOLE:
            for m in re.finditer(rx, ln):
                prob.append(m.group(0)); print(f"{f.name}:{i} · {msg} · {m.group(0)}")
print(f'{len(prob)} segnalazioni', 'errori JS:', pe[:3])
sys.exit(1 if prob or pe else 0)
