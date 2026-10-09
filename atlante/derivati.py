import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
import json,math,statistics as st,collections as C
D=json.load(open(ROOT/'atlante'/'dati.json'));S=json.load(open(ROOT/'atlante'/'sim.json'))
v=S['vite'];n=len(v);ev=D['ev']
out={}
rand=[e for e in ev if not e['link'] and not e['chi'] and not e['prig'] and e['min'] is not None]
pers=[e for e in ev if e['chi']]
out['perEta']={'eta':list(range(0,101)),'casuali':[sum(1 for e in rand if e['min']<=a<=e['max']) for a in range(101)],'persone':[sum(1 for e in pers if e['min']<=a<=e['max']) for a in range(101)]}
cnt=S['cnt'];out['freq']={k:round(c/n,2) for k,c in cnt.items()}
out['eventiVita']=round(sum(cnt.values())/n)
def morteP(a,s): return min(.95,.00034*math.exp(.095*max(0,a-30))+max(0,45-s)/400)
ages=list(range(0,111))
def surv(s):
    p=1;r=[]
    for a in ages: r.append(round(p*100,1)); p*=1-morteP(a,s)
    return r
out['sopravv']={'eta':ages,'sim':[round(100*sum(1 for x in v if x['eta']>=a)/n,1) for a in ages],'s85':surv(85),'s40':surv(40)}
bins=list(range(0,111,5));h=[0]*len(bins)
for x in v: h[min(len(bins)-1,x['eta']//5)]+=1
out['etaMorte']={'bins':[f"{b}–{b+4}" for b in bins],'n':h,'media':round(st.mean(x['eta'] for x in v),1),'mediana':st.median(x['eta'] for x in v)}
out['cause']=C.Counter(x['causa'] for x in v).most_common()
A=S['agg'];viv=A['vivi'];traj={'eta':[]}
K=['sal','fel','int','asp','en','st','soc','forma']
for k in K: traj[k]=[]
for a in range(0,101):
    if viv[a]<20: continue
    traj['eta'].append(a)
    for k in K: traj[k].append(round(A[k][a]/viv[a],1))
out['traj']=traj
pat={'eta':[],'p10':[],'p50':[],'p90':[]}
for a in range(0,101,5):
    L=sorted(A['pat'][a])
    if len(L)<20: continue
    pat['eta'].append(a);pat['p10'].append(L[len(L)//10]);pat['p50'].append(L[len(L)//2]);pat['p90'].append(L[9*len(L)//10])
out['pat']=pat
pc=lambda f,L=v:round(100*sum(1 for x in L if f(x))/max(1,len(L)),1)
out['esiti']=[['Diploma',pc(lambda x:x['liv']>=2)],['Laurea',pc(lambda x:x['liv']>=3)],['Laurea magistrale',pc(lambda x:x['liv']>=4)],['Casa di proprietà',pc(lambda x:x['casa'])],['Sposati almeno una volta',pc(lambda x:x['sposato'])],['Divorziati',pc(lambda x:x['div']>0)],['Con figli',pc(lambda x:x['figli']>0)],['Genitori separati',pc(lambda x:x['sep'])],['Almeno un burnout',pc(lambda x:x['burn'])],['Arrivati alla pensione',pc(lambda x:x['pens'])],['Hanno fumato',pc(lambda x:x['fumo'])],['Problemi con l\'alcol',pc(lambda x:x['alcol'])],['Fedina penale sporca',pc(lambda x:x['fed']>0)],['Finiti in carcere',pc(lambda x:x['carc']>0)]]
jobs={j['id']:j for j in D['lavori']}
out['lavori']=[[jobs[k]['livelli'][0]['m'] if k else 'Nessun lavoro',round(100*c/n,1)] for k,c in C.Counter(x['lav'] for x in v).most_common(12)]
real=sorted(x['pat'] for x in v)
out['patReale']={'p10':real[n//10],'p50':real[n//2],'p90':real[9*n//10]}
cl=lambda x:max(.0,min(1,x))
I=list(range(0,101,5))
out['prob']={'int':I,'serie':[
 ['Test di Medicina',[round(100*max(.05,min(.95,.5+(i-72)/40))) for i in I]],
 ['Colloquio, risposte nella media',[round(100*max(.04,min(.92,.42+(i-50)/200))) for i in I]],
 ['Colloquio, risposte ottime',[round(100*max(.04,min(.92,.42+(i-50)/200+.36))) for i in I]],
 ['Esame della patente',[round(100*cl(.45+i/200)) for i in I]],
 ['Esame da avvocato',[round(100*cl(.35+(i-50)/200)) for i in I]]]}
def irpef(i):
    t=min(i,28000)*.23
    if i>28000:t+=(min(i,50000)-28000)*.35
    if i>50000:t+=(i-50000)*.43
    return t
def detr(r):
    if r<=15000:return 1955
    if r<=28000:return 1910+1190*(28000-r)/13000
    if r<=50000:return 1910*(50000-r)/22000
    return 0
rows=[]
for l in range(10000,150001,5000):
    inps=l*.0919;imp=l-inps;ir=max(0,irpef(imp)-detr(imp));ad=imp*.02;rows.append([l,round(l-inps-ir-ad),round(inps),round(ir),round(ad)])
out['tasse']=rows
out['extra']=[['Hanno un\'azienda alla fine',pc(lambda x:x.get('az'))],['Nel clan alla fine',pc(lambda x:x.get('clan'))],['Con più di 10.000 follower',pc(lambda x:x.get('fol',0)>10000)],['Con fama sopra 20',pc(lambda x:x.get('fama',0)>20)]]
# ---- carattere ----
def corr(a,b):
    ma,mb=st.mean(a),st.mean(b);sa=st.pstdev(a);sb=st.pstdev(b)
    return round(sum((x-ma)*(y-mb) for x,y in zip(a,b))/len(a)/(sa*sb),2) if sa and sb else 0
car={}
for k in 'OCEAN':
    gruppi={'basso':[x for x in v if x['pers'][k]<40],'medio':[x for x in v if 40<=x['pers'][k]<=60],'alto':[x for x in v if x['pers'][k]>60]}
    car[k]={g:{'n':len(L),'fel':round(st.mean(x['fel'] for x in L),1) if L else None,'st':round(st.mean(x['st'] for x in L),1) if L else None,'soc':round(st.mean(x['soc'] for x in L),1) if L else None,
        'eta':round(st.mean(x['eta'] for x in L),1) if L else None,'pat':st.median(x['pat'] for x in L) if L else None,'spos':pc(lambda x:x['sposato'],L),'lau':pc(lambda x:x['liv']>=3,L),'fed':pc(lambda x:x['fed']>0,L)} for g,L in gruppi.items()}
    P=[x['pers'][k] for x in v]
    car[k]['r']={m:corr(P,[float(x[m]) for x in v]) for m in ['fel','st','soc','eta','pat']}
out['carattere']=car
att=C.Counter(x['att'] for x in v if x['att'])
out['attacc']={a:{'pct':round(100*c/n,1),'fel':round(st.mean(x['fel'] for x in v if x['att']==a),1),'div':pc(lambda x:x['div']>0,[x for x in v if x['att']==a]),'spos':pc(lambda x:x['sposato'],[x for x in v if x['att']==a])} for a,c in att.items()}
asp={}
for x in v:
    for a in x['aspir']:
        asp.setdefault(a,[0,0]);asp[a][0]+=1
        if a in x['aspOk']:asp[a][1]+=1
nAsp=sum(1 for x in v if x['aspir'])
out['aspir']={a:{'scelta':round(100*c[0]/max(1,nAsp),1),'ok':round(100*c[1]/max(1,c[0]),1)} for a,c in asp.items()}
out['medie']={k:round(st.mean(x[k] for x in v),1) for k in ['fel','st','en','soc']}
out['n']=n
json.dump(out,open(ROOT/'atlante'/'derivati.json','w'),ensure_ascii=False)
print(out['etaMorte']['media'],out['etaMorte']['mediana'],out['patReale'],'eventi/vita',out['eventiVita'])
print(out['esiti']);print(out['lavori'][:6]);print(out['medie'])
for k in 'OCEAN': print(k,out['carattere'][k]['r'],{g:(d['fel'],d['st']) for g,d in out['carattere'][k].items() if g!='r'})
print(out['attacc']);print(out['aspir'])
