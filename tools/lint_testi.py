"""Controllore dei testi (ROADMAP 0.1): cerca parole da grandi negli eventi che possono capitare da piccoli.
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
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    r = pg.evaluate(JS, [[k, v] for k, v in PAROLE.items()]); b.close()
sys.stdout.reconfigure(encoding='utf-8')
visti = set(); prob = []
for x in r:
    if any(x['parola'].lower().startswith(w) for w in ECCEZIONI.get(x['id'], [])): continue
    k = (x['id'], x['dove'], x['parola'].lower())
    if k in visti: continue
    visti.add(k); prob.append(x)
for x in prob: print(f"{x['id']:26} {x['a']:>2} anni · {x['dove']:6} · «{x['parola']}» · {x['t']}")
print(f'{len(prob)} segnalazioni', 'errori JS:', pe[:3])
sys.exit(1 if prob or pe else 0)
