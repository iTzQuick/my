"""Legge i sorgenti di my e trova chi apre ogni evento: un altro evento (scelta, conseguenza «fut») o una funzione del motore.
Ritorna archi {da, tipo_da ('ev'|'fn'), a, come ('apre'|'richiesta'|'dopo'), codice (riga sorgente), file}."""
import pathlib, re
ROOT=pathlib.Path(__file__).resolve().parent.parent
def files():
    b=(ROOT/'build.py').read_text(encoding='utf-8')
    m=re.search(r"FILES=\[(.*?)\]",b,re.S)
    return re.findall(r"'([^']+\.js)'",m.group(1))
PAT=[(r"EV\.(\w+)",'apre'),(r"richiesta\('(\w+)'",'richiesta'),(r"fut:\[[^\]]*?'(\w+)'\]",'dopo'),(r"futuro\([^)]*?'(\w+)'",'dopo'),(r"S\.futuri\.push\(\{[^}]*?id:'(\w+)'",'dopo')]
def scan():
    archi=[]
    for f in files():
        t=(ROOT/'src'/f).read_text(encoding='utf-8')
        ctx=[(m.start(),'ev',m.group(1)) for m in re.finditer(r"ev\(\{id:'(\w+)'",t)]
        ctx+=[(m.start(),'fn',m.group(1)) for m in re.finditer(r"(?m)^function (\w+)\s*\(",t)]
        ctx+=[(m.start(),'fn',m.group(1)) for m in re.finditer(r"(?m)^(?:const|let) (\w+)\s*=\s*(?:\([^)]*\)|\w+)\s*=>",t)]
        ctx+=[(m.start(),'att',m.group(1)) for m in re.finditer(r"\{sez:'[^']*',id:'(\w+)'",t)]   # attività del giocatore
        ctx.sort()
        for pat,come in PAT:
            for m in re.finditer(pat,t):
                a=m.group(1)
                prima=[c for c in ctx if c[0]<=m.start()]
                if not prima:continue
                _,tipo,da=prima[-1]
                if tipo=='ev' and da==a:continue
                ini=t.rfind('\n',0,m.start())+1;fine=t.find('\n',m.end());riga=t[ini:fine].strip()
                k=m.start()-ini
                pezzo=riga[max(0,k-110):k+70]
                archi.append({'da':da,'tipo_da':tipo,'a':a,'come':come,'codice':pezzo,'file':f})
    # niente doppioni identici
    vis=set();out=[]
    for x in archi:
        key=(x['da'],x['a'],x['come'])
        if key in vis:continue
        vis.add(key);out.append(x)
    return out
if __name__=='__main__':
    import sys,collections;sys.stdout.reconfigure(encoding='utf-8')
    A=scan();print(len(A),'collegamenti')
    print(collections.Counter(x['da'] for x in A if x['tipo_da']=='fn').most_common())
