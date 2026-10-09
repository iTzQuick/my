"""Diagramma di flusso completo di «my» → dist/flusso-my.html
Fonti: atlante/dati.json (eventi, scelte, esiti, condizioni tradotte) + scan_collegamenti.py (chi apre cosa, dal codice).
Uso: python build.py && cd atlante && python estrai.py && python flusso.py"""
import json, pathlib, html, re, collections
from scan_collegamenti import scan
ROOT=pathlib.Path(__file__).resolve().parent.parent
D=json.load(open(ROOT/'atlante'/'dati.json',encoding='utf-8'))
EVS=D['ev']; EVI={e['id']:e for e in EVS}
for e in EVS:
    if not e.get('t'):
        prima=next((t for c in e['scelte'] for o in (c.get('si'),c.get('esito')) if o for t in (o.get('testi') or [])),'')
        e['t']=('Seguito: «'+prima[:38].rstrip()+('…' if len(prima)>38 else '')+'»') if prima else f"Seguito ({e['id']})";e['senza_titolo']=True
ARCHI=[a for a in scan() if a['a'] in EVI]
esc=lambda s:html.escape(str(s if s is not None else ''),quote=True)

# ---------- capitoli ----------
CAP=[('nascita','Nascita',None,None),('c0','Primi anni',0,5),('c6','Infanzia',6,12),('c13','Adolescenza',13,17),('c18','Giovane adulto',18,25),
     ('c26','Adulto',26,40),('c41','Mezza età',41,65),('c66','Terza età',66,130),('azioni','Le tue azioni',None,None),('sempre','In ogni momento',None,None),('fine','Morte e finali',None,None)]
ETA_VOLTO={'azioni':30,'nascita':0,'c0':3,'c6':9,'c13':15,'c18':22,'c26':33,'c41':52,'c66':75,'sempre':40,'fine':88}
def cap_eta(m):
    for k,n,a,b in CAP:
        if a is not None and a<=m<=b:return k
    return 'c66'
# capitolo di default per gli eventi aperti dal motore senza età
FN_CAP={'fineScuola':'c13','fineCorso':'c18','iscrizione':'c18','azScuola':'c18','tappe':'c6','sceltaAspir':'c18','nuovaVita':'c0','esciCarcere':'sempre'}
def capitolo(e,visti=None):
    if e.get('min') is not None:return cap_eta(e['min'])
    visti=visti or set();visti.add(e['id'])
    for a in ARCHI:
        if a['a']==e['id']:
            if a['tipo_da']=='ev' and a['da'] in EVI and a['da'] not in visti:return capitolo(EVI[a['da']],visti)
            if a['tipo_da']=='fn' and a['da'] in FN_CAP:return FN_CAP[a['da']]
    return 'sempre'

# ---------- binari del motore (per colore e raggruppamento) ----------
BINARIO={'fineScuola':'Scuola e studi','fineCorso':'Scuola e studi','iscrizione':'Scuola e studi','azScuola':'Scuola e studi','inizioScuola':'Scuola e studi',
 'mesePartner':'Coppia e amore','annoRelazioni':'Coppia e amore','incontri':'Coppia e amore','cercaAmore':'Coppia e amore','apriPersona':'Coppia e amore','disco':'Coppia e amore','liscio':'Coppia e amore',
 'vitaNpc':'Le persone intorno a te','compleannoNpc':'Le persone intorno a te','mortePersona':'Le persone intorno a te',
 'azLavoro':'Lavoro','annoAzienda':'Soldi e azienda','finanzeMese':'Soldi e azienda','ammala':'Salute','annoMondo':'Il mondo','calendario':'Calendario',
 'compleanno':'Crescita e tappe','tappe':'Crescita e tappe','sceltaAspir':'Crescita e tappe','nuovaVita':'Crescita e tappe','esciCarcere':'Giustizia, carcere, clan','annoClan':'Giustizia, carcere, clan','emergenti':'Stati che diventano eventi'}

# ---------- passaggi automatici (verificati nel codice) ----------
TAPPE={
 'azioni':['Oltre agli eventi, ogni mese puoi agire dai menu delle schede (Studi, Lavoro, Persone, Beni, Tempo)','Molte azioni hanno un\'età minima, un costo, l\'energia e un\'attesa prima di poterle ripetere','Dopo ogni azione si torna al mese: niente fa avanzare il tempo tranne «+1 mese»'],
 'nascita':['Certificato di nascita: sesso, nome, comune, data (dal 2000 a oggi), famiglia e aspetto, oppure «Vita a caso»',
            'Il carattere nasce dai genitori (45% della loro media) più il caso','Si generano fratelli maggiori, nonni, zii e cugini',
            'Se la mamma ha meno di 38 anni: 45% che nasca un fratellino entro 1–6 anni',
            'Il mondo parte dai prezzi veri dell\'anno di nascita; fino al 2026 segue la storia vera (euro, crisi del 2008, lockdown 2020…)'],
 'c0':['1 anno: prima parola · 2 anni: primi passi','3 anni: scuola dell\'infanzia','4 anni: si forma lo stile di attaccamento (calore dei genitori, emotività, separazioni)','Fino a 6 anni la settimana la decidono i genitori'],
 'c6':['6 anni: elementari (70%: un nuovo amico) e scelta dell\'hobby','Dai 6 anni decidi le ore della settimana','11 anni: medie (60%: un nuovo amico)','12 anni: prima «foto» del carattere'],
 'c13':['14 anni: puoi aprire un profilo social (prima serve il consenso dei genitori)','14 anni: patentino AM per lo scooter 50','14 anni: esame di terza media → scelta delle superiori','Dai 16 anni: incontri romantici, discoteca','Fine superiori → «Dopo il diploma»'],
 'c18':['18 anni: maggiore età; nasce l\'equilibrio del carattere','Tra 18 e 60 anni: scegli le aspirazioni','Patente, lavoro, casa, prestiti e Borsa dai 18','Fine università → dopo la triennale / magistrale'],
 'c26':['Maturazione: coscienziosità e amicalità salgono, emotività scende (soprattutto tra 20 e 40 anni)','Coppia: convivenza (dopo 1,5 anni, rapporto ≥65) → nozze o unione civile (dopo 2 anni di convivenza, rapporto ≥70)','Figli: tentativi ogni mese (fertilità secondo l\'età), gravidanza di 9 mesi, a volte aborto spontaneo o gemelli; procreazione assistita; adozione solo da sposati da 3 anni','Separazione → divorzio dopo 6 o 12 mesi; affido dei figli e mantenimento','Chi perde il lavoro senza volerlo: TFR e NASpI'],
 'c41':['Dai 42 anni capelli grigi, dai 55 rughe','Quando muoiono entrambi i genitori: eredità e, spesso, la casa di famiglia da dividere con i fratelli','Pensione contributiva: a 67 anni con 20 di contributi, o con 42 anni e 10 mesi (41 e 10 le donne) a qualsiasi età; anche senza lavoro'],
 'c66':['Dopo i 70: apertura ed estroversione calano un po\'','Senza contributi sufficienti: assegno sociale','Il rischio di morte cresce di circa il 10% ogni anno; per le donne è più basso (vivono circa 4 anni in più)','Malattie dell\'età: pressione alta, diabete, demenza, cuore'],
 'sempre':['Eventi aperti dal motore o da altri eventi, senza un\'età propria','Ogni mese: 16% di evento casuale sotto i 13 anni, 13% fino a 17, 8,5% da adulti; 4,5% con una persona; al massimo 3 in coda'],
}

# ---------- misure ----------
EW,CW,OW=232,214,300; GX1=EW+26; GX2=GX1+CW+26; BUSX=GX2+OW+34; COLW=BUSX+70; COLGAP=140
RH=22  # altezza riga scelta/esito
def tronca(s,n):
    s=re.sub(r'\s+',' ',str(s or '')).strip()
    return s if len(s)<=n else s[:n-1].rstrip()+'…'
def effetti(x):
    return ' · '.join(f"{e['k']} {e['v']}" for e in (x.get('eff') or [])[:4])
def tono(x):
    s=0
    for e in x.get('eff') or []:
        v=str(e['v']);neg=e.get('neg')
        if e['k'] in('Felicità','Salute','Karma','Soldi','Rapporto'):s+=-1 if neg else 1
    return 'g' if s>0 else 'b' if s<0 else 'n'

nodi=[]   # per tooltip/ricerca: {i, tipo, id, titolo, testo}
def nodo(tipo,eid,titolo,testo):
    nodi.append({'tipo':tipo,'id':eid,'titolo':titolo,'testo':testo});return len(nodi)-1

svg=[]; linee=[]; archi_svg=[]
pos={}   # id evento -> (x,y) del nodo evento (porta d'ingresso a sinistra)
uscite=collections.defaultdict(list)  # id evento -> [(x,y) di esiti con fut/apre]

def T(x,y,s,cls='',anchor=None,extra=''):
    a=f' text-anchor="{anchor}"' if anchor else ''
    return f'<text x="{x:.0f}" y="{y:.0f}" class="{cls}"{a}{extra}>{esc(s)}</text>'

def disegna_evento(e,x,y):
    """disegna un evento con le sue scelte e i suoi esiti; ritorna l'altezza usata"""
    sc=e['scelte'];righe=[]
    for c in sc:
        if 'si' in c and c.get('si') is not None: righe.append((c,[('si',c['si'],c['p']['txt'] if c.get('p') else ''),('no',c.get('no') or {},'')]))
        else: righe.append((c,[('es',c.get('esito') or {},'')]))
    if e.get('dinamica') and not sc: righe=[(None,[])]
    conds_n=(1 if e.get('cond') else 0)+(1 if e.get('chi') else 0)
    h=max(40+13*conds_n,sum(max(1,len(o))*RH+6 for _,o in righe)+4 if righe else 44)
    auto=e.get('auto');link=e.get('link')
    cls='ev auto' if auto else 'ev link' if link else 'ev'
    meta=[]
    if e.get('min') is not None:meta.append(f"{e['min']}–{e['max']} anni" if e.get('max') and e['max']<120 else f"da {e['min']} anni")
    if e.get('once'):meta.append('una volta')
    elif e.get('rip') and not link:meta.append(f"ogni ≥{e['rip']} anni")
    if e.get('w') not in (None,1):meta.append(f"peso {e['w']}")
    if auto:meta.append('automatico')
    elif link:meta.append('collegato')
    if e.get('prig'):meta.append('solo in carcere')
    conds=[]
    if e.get('cond'):conds.append('se: '+e['cond'])
    if e.get('chi'):conds.append('con: '+', '.join(e['chi'])+(f" ({e['pc']})" if e.get('pc') else ''))
    da=[a for a in ARCHI if a['a']==e['id']]
    tip=f"{e.get('t') or e['id']}\n{e.get('x') or ''}\n\n" + '\n'.join(conds) + ('\nAperto da: '+'; '.join(f"{a['da']} ({'evento' if a['tipo_da']=='ev' else 'attività' if a['tipo_da']=='att' else 'motore'})" for a in da) if da else '') + f"\nid: {e['id']} · categoria: {e['sez']}"
    i=nodo('evento',e['id'],e.get('t') or e['id'],tip)
    pos[e['id']]=(x,y+16)
    svg.append(f'<g class="{cls}" data-i="{i}" data-ev="{esc(e["id"])}"><rect x="{x}" y="{y}" width="{EW}" height="{34+13*min(2,len(conds))}" rx="3"/>'
               +T(x+9,y+15,tronca(e.get('t') or e['id'],34),'t1')+T(x+9,y+28,tronca(' · '.join(meta),44),'t2')
               +''.join(T(x+9,y+41+13*k,tronca(cnd,44),'t3') for k,cnd in enumerate(conds[:2]))
               +(f'<circle cx="{x-6}" cy="{y+16}" r="4" class="ingr"/>' if da else '')+'</g>')
    cy=y+2
    if righe==[(None,[])]:
        j=nodo('incerto',e['id'],'Scelte generate durante il gioco','Le scelte di questo evento vengono create al momento (per esempio dalle persone o dai soldi che hai): non si possono elencare in anticipo.')
        svg.append(f'<g class="ch incerto" data-i="{j}"><rect x="{x+GX1}" y="{cy}" width="{CW}" height="{RH-4}" rx="2"/>'+T(x+GX1+8,cy+13,'Scelte generate al momento (?)','t4')+'</g>')
        linee.append(f'M{x+EW} {y+16} H{x+GX1}');linee.append(f'M{x+GX1+CW} {cy+9} H{BUSX+x}')
        return h
    for c,outs in righe:
        bh=max(1,len(outs))*RH
        lab=c['l'] if c else ''
        tip=f"Scelta: {lab}"+(f"\n{c['sub']}" if c.get('sub') else '')+(f"\nCompare se: {c['cond']}" if c.get('cond') else '')+(f"\nCosto: {c['costo']} €" if c.get('costo') else '')
        j=nodo('scelta',e['id'],lab,tip)
        ccls='ch auto2' if lab.startswith('Succede da sola') else 'ch'
        svg.append(f'<g class="{ccls}" data-i="{j}"><rect x="{x+GX1}" y="{cy+bh/2-9}" width="{CW}" height="18" rx="2"/>'+T(x+GX1+8,cy+bh/2+4,tronca(lab,33),'t4')
                   +(f'<text x="{x+GX1+CW-6}" y="{cy+bh/2+4}" class="t5" text-anchor="end">⚑</text>' if c.get('cond') else '')+'</g>')
        linee.append(f'M{x+EW} {y+16} C{x+EW+14} {y+16} {x+GX1-14} {cy+bh/2} {x+GX1} {cy+bh/2}')
        oy=cy
        for k,(tipo,o,pr) in enumerate(outs):
            testo=(o.get('testi') or [''])[0] if o else ''
            ef=effetti(o) if o else ''
            fut=o.get('fut') if o else None;proc=o.get('pr') if o else None
            extra=[]
            if fut and fut.get('id'):extra.append(f"⏳ dopo ~{fut['anni']} anni: {tronca((EVI.get(fut['id']) or {}).get('t') or fut['id'],22)}")
            if proc:extra.append('⚖ processo: '+str(proc))
            ex=o.get('extra') or [] if o else []
            riga=(ef+(' — ' if ef and testo else '')+testo) if (ef or testo) else ('esito calcolato dal codice (?)')
            tono_=tono(o) if o else 'n'
            prob=pr if tipo=='si' else ('altrimenti' if tipo=='no' else '')
            tipT=('Probabilità: '+pr+'\n' if pr else '')+('Altrimenti:\n' if tipo=='no' else '')+(ef+'\n' if ef else '')+'\n'.join(o.get('testi') or [] if o else [])+('\n'+'\n'.join(ex) if ex else '')+('\n'+'\n'.join(extra) if extra else '')
            if not (ef or testo):tipT+='\n(Il testo o l\'effetto di questo esito è calcolato dal codice al momento: non verificabile a priori.)'
            j=nodo('esito',e['id'],riga,tipT)
            inc=' incerto' if not (ef or testo) else ''
            svg.append(f'<g class="out {tono_}{inc}" data-i="{j}"><rect x="{x+GX2}" y="{oy+2}" width="{OW}" height="{RH-4}" rx="2"/><rect x="{x+GX2}" y="{oy+2}" width="3" height="{RH-4}" class="bar"/>'
                       +T(x+GX2+9,oy+15,tronca(riga,52),'t4')+(T(x+GX2+OW-6,oy+15,'⏳' if fut else '⚖' if proc else '','t5','end'))+'</g>')
            if prob:svg.append(T(x+GX2-5,oy+15,prob,'t6','end'))
            linee.append(f'M{x+GX1+CW} {cy+bh/2} C{x+GX1+CW+12} {cy+bh/2} {x+GX2-12} {oy+RH/2} {x+GX2} {oy+RH/2}')
            linee.append(f'M{x+GX2+OW} {oy+RH/2} H{x+BUSX}')
            if fut and fut.get('id'):uscite[e['id']].append((x+GX2+OW,oy+RH/2,fut['id'],'dopo'))
            oy+=RH
        cy+=bh+6
    return h

# ---------- azioni libere del giocatore (menu delle schede) ----------
SRC=ROOT/'src'
def corpo_fn(file,nome):
    t=(SRC/file).read_text(encoding='utf-8');i=t.index('function '+nome+'(');j=t.find('\nfunction ',i+10);return t[i:j if j>0 else len(t)]
def azioni_menu():
    G=collections.OrderedDict()
    for a in D['att']:
        meta=[f"da {a['min']} anni" if a.get('min') else 'a ogni età']
        if a.get('costo'):meta.append(f"{a['costo']} €")
        if a.get('cd') and a['cd']>1:meta.append(f"attesa {a['cd']} mesi")
        cnd=a.get('cond') or ''
        if '=>' in cnd:cnd='se (codice): '+cnd.replace('()=>','')
        G.setdefault('Tempo · Attività · '+a['sez'],[]).append((a['n'],' · '.join(meta),cnd,a.get('d') or ''))
    for a in D.get('attC',[]):G.setdefault('Tempo · In carcere',[]).append((a['n'],'solo in carcere','',a.get('d') or ''))
    # persone: etichette e condizioni scritte nel codice di apriPersona
    body=corpo_fn('e_azioni.js','apriPersona');ruolo='tutti'
    for riga in body.split('\n'):
        m=re.search(r"R==='(\w+)'|\[([^\]]+)\]\.includes\(R\)",riga)
        if m and 'opt(' not in riga.split(m.group(0))[0][-5:]:ruolo=(m.group(1) or m.group(2).replace("'",'').replace(',',', '))
        for mm in re.finditer(r"(?:if\(([^{]*?)\))?opt\('([^']+)'",riga):
            cond=(mm.group(1) or '').strip()
            G.setdefault('Persone',[]).append((mm.group(2).replace('Ignoral','Ignoralo/a').replace('Provocal','Provocalo/a'),'con: '+ruolo,('se (codice): '+cond) if cond else '',''))
    # studi, lavoro: bottoni [chiave, etichetta] nelle schede
    for fn,nome in [('renderScuola','Studi'),('renderLavoro','Lavoro'),('renderBeni','Beni')]:
        b=corpo_fn('f_ui.js',fn);vis=set()
        for mm in re.finditer(r"\['(\w+)','([A-ZÀ-Ú][^'`$]{2,40})'",b):
            if mm.group(2) in vis:continue
            vis.add(mm.group(2));G.setdefault(nome,[]).append((mm.group(2),'scheda '+nome,'',''))
        for mm in re.finditer(r'id="btn\w+"[^>]*>([A-ZÀ-Ú][^<>$`{}]{2,40})</button>',b):
            if mm.group(1) in vis:continue
            vis.add(mm.group(1));G.setdefault(nome,[]).append((mm.group(1),'scheda '+nome,'',''))
    return G
def disegna_azioni(x,y):
    for gr,L in azioni_menu().items():
        y0=y;y+=34
        for n,meta,cond,dsc in L:
            j=nodo('azione','',n,f"{n}\n{dsc}\n{meta}"+(f"\nCompare se: {cond}" if cond else '')+("\n(condizione letta dal codice: può dipendere anche da altre cose)" if cond.startswith('se (codice)') else ''))
            hh=18+(12 if cond else 0)
            svg.append(f'<g class="ch az" data-i="{j}"><rect x="{x}" y="{y}" width="{EW+GX1+CW-30}" height="{hh}" rx="2"/>'+T(x+8,y+13,tronca(n,40),'t4')+T(x+EW+GX1+CW-38,y+13,tronca(meta,40),'t7','end')
                       +(T(x+8,y+26,tronca(cond,84),'t8') if cond else '')+'</g>')
            linee.append(f'M{x+EW+GX1+CW-30} {y+9} H{x+BUSX}')
            y+=hh+6
        svg.insert(0,f'<g class="grp"><rect x="{x-14}" y="{y0}" width="{BUSX+20}" height="{y-y0+4}" rx="2"/><path d="M{x-14} {y0+14}V{y0} H{x+6} M{x-14} {y} V{y+4} H{x+6}" class="br"/>'+T(x-4,y0+24,gr.upper()+f'  ·  {len(L)}','gl')+'</g>')
        y+=26
    return y

# ---------- impaginazione per capitoli ----------
per_cap=collections.defaultdict(list)
for e in EVS:per_cap[capitolo(e)].append(e)
X0=60;Y_SPINA=420;Y_COL=Y_SPINA+260
colx={};altezze={}
ritratti=[]
x=X0
for k,n,a,b in CAP:
    colx[k]=x
    evs=per_cap.get(k,[])
    y=Y_COL
    # passaggi automatici
    tp=TAPPE.get(k,[])
    if tp:
        svg.append(f'<g class="grp tappe"><rect x="{x-12}" y="{y-26}" width="{EW+GX1+CW+18}" height="{len(tp)*24+40}" rx="2"/>'+T(x,y-8,'PASSAGGI AUTOMATICI','gl')+'</g>')
        for t in tp:
            j=nodo('tappa',k,t,t)
            svg.append(f'<g class="tp" data-i="{j}"><rect x="{x}" y="{y+4}" width="{EW+GX1+CW-6}" height="18" rx="2"/>'+T(x+8,y+17,tronca(t,78),'t4')+'</g>');y+=24
        y+=40
    if k=='azioni':
        y=disegna_azioni(x,y)
    # eventi per categoria
    gruppi=collections.OrderedDict()
    for e in sorted(evs,key=lambda e:(e['sez'],e.get('min') or 0,e['id'])):gruppi.setdefault(e['sez'],[]).append(e)
    for sez,lst in gruppi.items():
        y0=y;y+=34
        for e in lst:
            h=disegna_evento(e,x,y);y+=h+10
        svg.insert(0,f'<g class="grp"><rect x="{x-14}" y="{y0}" width="{BUSX-GX2+GX2+20}" height="{y-y0+4}" rx="2"/><path d="M{x-14} {y0+14}V{y0} H{x+6} M{x-14} {y-0} V{y+4} H{x+6}" class="br"/>'+T(x-4,y0+24,sez.upper()+f'  ·  {len(lst)}','gl')+'</g>')
        y+=26
    altezze[k]=y
    # ricongiunzione
    if evs or k=='azioni':
        svg.append(f'<path d="M{x+BUSX} {Y_COL-30} V{y}" class="bus"/>'+T(x+BUSX+8,Y_COL-36,'↩ RICONGIUNZIONE','bl')+T(x+BUSX+8,Y_COL-22,'torna al mese','t2'))
        svg.append(f'<path d="M{x+BUSX} {Y_COL-30} V{Y_SPINA+80}" class="bus"/>')
    x+=COLW+COLGAP
W=x+300

# ---------- finale: morte e necrologio ----------
fx=colx['fine'];fy=Y_COL
MORTE=[('Una delle malattie che hai','Tumori (per tipo, con la loro sopravvivenza), insufficienza cardiaca, demenza, diabete, BPCO… in proporzione al loro rischio','b'),
       ('Incidente · malore improvviso','Sotto i 30 anni (incidente sul lavoro solo per i lavori manuali)','b'),
       ('Infarto · ictus · polmonite · infezione · rene','Dai 30 anni in su, sempre più spesso con l\'età','b'),
       ('«Serenamente, nel sonno» · una caduta','Soprattutto dopo gli 80 anni','n')]
j=nodo('auto','morte','Ogni mese: rischio di morte','Rischio annuo = 0,4 × 0,034% × e^(0,095 × (età − 30)) × (0,62 per le donne, 0,9 per gli uomini) + (45 − salute)/400 se la salute è sotto 45 + il rischio di ogni malattia (tumori secondo il tipo, insufficienza cardiaca 8%, demenza 2,5%…) + 1% con dipendenza dall\'alcol. Diviso sui 12 mesi. La causa viene scelta in proporzione ai rischi.\n(funzioni morteP, morteMese, causaMorte in c3_vita.js e c_motore.js)')
svg.append(f'<g class="ev auto" data-i="{j}"><rect x="{fx}" y="{fy}" width="{EW}" height="52" rx="3"/>'+T(fx+9,fy+16,'Ogni mese: rischio di morte','t1')+T(fx+9,fy+30,'cresce con l\'età, scende con la salute','t2')+T(fx+9,fy+43,'+ il rischio di ogni malattia','t3')+'</g>')
yy=fy
for t,c,tn in MORTE:
    j=nodo('esito','morte',t,c)
    svg.append(f'<g class="out {tn}" data-i="{j}"><rect x="{fx+GX1}" y="{yy}" width="{CW+OW}" height="34" rx="2"/><rect x="{fx+GX1}" y="{yy}" width="3" height="34" class="bar"/>'+T(fx+GX1+10,yy+14,t,'t1')+T(fx+GX1+10,yy+27,c,'t2')+'</g>')
    linee.append(f'M{fx+EW} {fy+20} C{fx+EW+14} {fy+20} {fx+GX1-14} {yy+17} {fx+GX1} {yy+17}');yy+=44
ny=yy+30
j=nodo('auto','necrologio','Necrologio','Il necrologio riassume la vita: carattere, sogni realizzati, titolo, ultimo lavoro, patrimonio, coniuge, figli, nipoti, fedina, onorificenze, fondazione, donazioni.')
svg.append(f'<g class="ev auto" data-i="{j}"><rect x="{fx}" y="{ny}" width="{EW}" height="40" rx="3"/>'+T(fx+9,ny+16,'Necrologio','t1')+T(fx+9,ny+30,'il riassunto della vita','t2')+'</g>')
for t,c,_ in MORTE:pass
linee.append(f'M{fx+GX1+CW+OW} {fy+17} H{fx+GX1+CW+OW+20} V{ny+20} H{fx+EW}')
FIN=[('CONTINUA COME UN FIGLIO','Per ogni figlio vivo: si gioca la generazione successiva, con la sua età, il suo carattere e una quota di eredità (patrimonio ÷ figli vivi)','Se hai almeno un figlio vivo'),
     ('NUOVA VITA','Si torna al certificato di nascita: una vita nuova, da zero','Sempre possibile')]
fy2=ny+70
for t,c,cond in FIN:
    j=nodo('finale','fine',t,c+'\nCondizione: '+cond)
    svg.append(f'<g class="fin" data-i="{j}"><rect x="{fx+GX1}" y="{fy2}" width="{CW+OW}" height="58" rx="2"/>'+T(fx+GX1+14,fy2+22,t,'ft')+T(fx+GX1+14,fy2+38,tronca(c,80),'t2')+T(fx+GX1+14,fy2+51,'se: '+cond,'t3')+'</g>')
    linee.append(f'M{fx+EW} {ny+20} C{fx+EW+14} {ny+20} {fx+GX1-14} {fy2+29} {fx+GX1} {fy2+29}');fy2+=72
altezze['fine']=fy2

# ---------- spina: capitoli ----------
spina=[]
prev=None
for k,n,a,b in CAP:
    x=colx[k];evs=per_cap.get(k,[])
    sc=sum(len(e['scelte']) for e in evs)
    eta=('' if a is None else f'{a}–{b} anni' if b<130 else f'da {a} anni')
    dopo=0
    if a is not None:dopo=sum(1 for e in EVS if e.get('min') is not None and e['min']<a and (e.get('max') or 0)>=a)
    sub=(f'{len(evs)} eventi · {sc} scelte'+(f' · +{dopo} eventi iniziati prima' if dopo else '')) if evs else ''
    j=nodo('capitolo',k,n,f'{n} {eta}\n{sub}')
    ritratti.append((x+6,Y_SPINA-118,ETA_VOLTO[k]))
    spina.append(f'<g class="cap" data-i="{j}" data-cap="{k}"><polygon points="{x-4},{Y_SPINA-122} {x+152},{Y_SPINA-122} {x+124},{Y_SPINA-6} {x-32},{Y_SPINA-6}" class="foto"/>'
                 f'<rect x="{x-6}" y="{Y_SPINA}" width="{EW+40}" height="46" rx="2"/>'+T(x+6,Y_SPINA+20,n.upper(),'ct')+T(x+6,Y_SPINA+36,eta+(' · ' if eta and sub else '')+sub,'cs')+'</g>')
    if prev is not None:
        px=colx[prev]+EW+34
        spina.append(f'<path d="M{px} {Y_SPINA+23} H{x-6}" class="sp"/>')
        etiche={'azioni':'',"c0":'nasci','c6':'compi 6 anni','c13':'compi 13 anni','c18':'compi 18 anni','c26':'compi 26 anni','c41':'compi 41 anni','c66':'compi 66 anni','sempre':'','fine':'muori (a qualsiasi età)'}
        if etiche.get(k):spina.append(T((px+x)/2,Y_SPINA+16,etiche[k],'sl','middle'))
    prev=k
    # loop del mese
    if k not in('nascita','fine'):
        spina.append(f'<path d="M{x+EW+34} {Y_SPINA+10} c40 -60 120 -60 120 0" class="loop"/>'+T(x+EW+94,Y_SPINA-34,'+1 mese','sl','middle'))

# ---------- archi tra eventi ----------
for a in ARCHI:
    if a['a'] not in pos:continue
    tx,ty=pos[a['a']]
    if a['tipo_da']=='ev' and a['da'] in pos:
        sx,sy=pos[a['da']];sx+=EW
        cls='arco ev'
    else:continue
    mx=(sx+tx)/2
    archi_svg.append(f'<path d="M{sx} {sy} C{sx+200} {sy} {tx-200} {ty} {tx-6} {ty}" class="{cls}" data-da="{esc(a["da"])}" data-a="{esc(a["a"])}"/>')
for eid,L in uscite.items():
    for (sx,sy,tid,come) in L:
        if tid in pos:
            tx,ty=pos[tid]
            archi_svg.append(f'<path d="M{sx} {sy} C{sx+260} {sy} {tx-260} {ty} {tx-6} {ty}" class="arco dopo" data-da="{esc(eid)}" data-a="{esc(tid)}"/>')

# ---------- pannello motore (chi apre gli eventi collegati) ----------
motore=collections.OrderedDict()
for a in ARCHI:
    if a['tipo_da'] in('fn','att'):motore.setdefault(BINARIO.get(a['da'],'Altro'),[]).append(a)
mot_txt=[]
for b,L in motore.items():
    mot_txt.append({'b':b,'r':[{'da':a['da'],'tipo':a['tipo_da'],'a':a['a'],'t':(EVI[a['a']].get('t') or a['a']),'cod':a['codice'],'file':a['file']} for a in L]})

H=max(altezze.values())+200
tot_sc=sum(len(e['scelte']) for e in EVS)
capdati=[]
for k,n,a,b in CAP:
    evs=per_cap.get(k,[])
    capdati.append({'k':k,'n':n,'x':colx[k],'eta':('' if a is None else f'{a}–{b} anni' if b<130 else f'da {a} anni'),'ev':len(evs),'sc':sum(len(e['scelte']) for e in evs),'tappe':TAPPE.get(k,[]),'v':ETA_VOLTO[k],'prima':(sum(1 for e in EVS if e.get('min') is not None and e['min']<a and (e.get('max') or 0)>=a) if a is not None else 0)})
dati={'capdati':capdati,'nodi':nodi,'archi':[{'da':a['da'],'tipo':a['tipo_da'],'a':a['a'],'come':a['come'],'cod':a['codice'],'t':(EVI[a['a']].get('t') or a['a'])} for a in ARCHI],'motore':mot_txt,'cap':[{'k':k,'n':n,'x':colx[k]} for k,n,a,b in CAP],'W':W,'H':H,
      'ritratti':ritratti,'stat':{'ev':len(EVS),'sc':tot_sc,'ar':len(ARCHI),'link':sum(1 for e in EVS if e.get('link')),'auto':sum(1 for e in EVS if e.get('auto')),'din':sum(1 for e in EVS if e.get('dinamica'))}}
corpo='\n'.join(svg)
pag=(ROOT/'atlante'/'flusso_pagina.html').read_text(encoding='utf-8')
volto_js=(ROOT/'src'/'c5_aspetto.js').read_text(encoding='utf-8')
out=pag.replace('/*DATI*/',json.dumps(dati,ensure_ascii=False)).replace('<!--SPINA-->','\n'.join(spina)).replace('<!--CORPO-->',corpo)\
       .replace('<!--LINEE-->',''.join(f'<path d="{d}"/>' for d in linee)).replace('<!--ARCHI-->','\n'.join(archi_svg)).replace('/*VOLTO*/',volto_js)\
       .replace('__W__',str(int(W))).replace('__H__',str(int(H)))
(ROOT/'dist').mkdir(exist_ok=True)
(ROOT/'dist'/'flusso-my.html').write_text(out,encoding='utf-8')
print('dist/flusso-my.html',round(len(out)/1024),'KB ·',len(nodi),'nodi ·',len(ARCHI),'collegamenti ·',f'{W:.0f}×{H:.0f}px')
