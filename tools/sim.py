import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
import os
GAME=_pl.Path(os.environ['GAME']).resolve().as_uri() if os.environ.get('GAME') else (ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
import json, sys
from playwright.sync_api import sync_playwright
N=int(sys.argv[1]) if len(sys.argv)>1 else 20
AP=open(ROOT/'tools'/'autopilota.js').read()
JS=r'''
(N)=>{
 const errs=[];const out=[];const evc={};const bisA=[];
 const realRender=render;window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 const t0=performance.now();
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;const id=(document.querySelector('#shT').textContent||'').slice(0,30);evc[id]=(evc[id]||0)+1;if(!AP.scegli()){errs.push('sheet vuoto: '+id);sheetOpen=false;break}}};
 for(let v=0;v<N;v++){
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
   let p18=null,k=0,sumB={e:0,s:0,so:0,f:0,n:0},parts=0;
   while(S.vivo&&k<1500){
     k++;
     AP.mese();risolvi();if(S.eta===18&&!p18)p18={...S.pers};
     mese();risolvi();
     if(S.eta>=25&&S.eta<=60){sumB.e+=S.bis.energia;sumB.s+=S.bis.stress;sumB.so+=S.bis.soc;sumB.f+=S.felicita;sumB.n++}
   }
   const n=Math.max(1,sumB.n);
   out.push({eta:S.eta,causa:S.causa,fel:Math.round(sumB.f/n),en:Math.round(sumB.e/n),st:Math.round(sumB.s/n),so:Math.round(sumB.so/n),sal:S.salute,pat:Math.round(patrimonio()/S.mondo.ip),lav:S.ultimoLavoro,tit:S.istr.liv,amici:vivi(['Amico']).length,con:S.relazioni.some(p=>p.ruolo==='Coniuge'),ex:S.relazioni.filter(p=>p.ruolo==='Ex').length,figli:S.relazioni.filter(p=>p.ruolo==='Figlio').length,fed:S.fedina.length,pers:S.pers,p18,svolte:(S.persSegni||[]).filter(x=>x.eta>=18&&x.c&&Object.values(x.d).some(v=>Math.abs(v)>=.9)).length,cause:(S.persSegni||[]).filter(x=>x.eta>=18&&x.c&&Object.values(x.d).some(v=>Math.abs(v)>=.9)).map(x=>x.c),att:S.att,mesi:k,log:S.log.reduce((s,b)=>s+b.righe.length,0),casa:S.prop.length});
  }catch(e){errs.push(e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' / '))}
 }
 window.render=realRender;
 return {out,errs,ms:performance.now()-t0,ev:Object.entries(evc).sort((a,b)=>b[1]-a[1]).slice(0,45)};
}
'''
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    pg.add_script_tag(content=AP)
    r=pg.evaluate(JS,N)
    b.close()
o=r['out'];json.dump(r,open(ROOT/'tools'/'sim_out.json','w'))
print('ms',round(r['ms']),'vite/s',round(N/(r['ms']/1000),2))
print('errs',r['errs'][:6],errs[:4])
import statistics as st
from collections import Counter
if o:
    e=[x['eta'] for x in o]; print('eta morte mediana',st.median(e),'media',round(st.mean(e),1),'min',min(e),'max',max(e))
    print('patrimonio reale: mediana',st.median([x['pat'] for x in o]),'p25',sorted(x['pat'] for x in o)[len(o)//4],'p75',sorted(x['pat'] for x in o)[3*len(o)//4])
    for k in ['fel','en','st','so']: print(k,'25-60 anni media',round(st.mean([x[k] for x in o]),1))
    print('coniuge %',round(100*sum(x['con'] for x in o)/len(o)),'ex medi',round(st.mean([x['ex'] for x in o]),1),'figli medi',round(st.mean([x['figli'] for x in o]),2),'fedina %',round(100*sum(1 for x in o if x['fed'])/len(o)),'casa %',round(100*sum(1 for x in o if x['casa'])/len(o)))
    print('titolo',Counter(x['tit'] for x in o).most_common())
    print('eventi per vita',round(sum(c for _,c in r['ev'])/len(o)))
    print(Counter(x['causa'] for x in o).most_common(6))
    print(Counter(x['lav'] for x in o).most_common(10))
    print([ (a,round(c/len(o),1)) for a,c in r['ev'][:30]])
    q=[x for x in o if x['p18']]
    if q:
        print('carattere 18 anni -> fine vita (%d vite)'%len(q))
        for k in 'OCEAN':
            a=[x['p18'][k] for x in q]; b=[x['pers'][k] for x in q]
            print('  %s  media %.0f -> %.0f   dev.std %.1f -> %.1f   cambio medio |%.1f|   estremi(|v-50|) %.1f -> %.1f'%(k,st.mean(a),st.mean(b),st.pstdev(a),st.pstdev(b),st.mean(abs(y-x) for x,y in zip(a,b)),st.mean(abs(v-50) for v in a),st.mean(abs(v-50) for v in b)))
        print('  svolte da adulto per vita (scelte che spostano il carattere):',round(st.mean(x['svolte'] for x in q),1))
        cc=Counter(c for x in q for c in x['cause'])
        print('  cause più frequenti:',[(c,round(n/len(q),1)) for c,n in cc.most_common(14)])
    def corr(a,b):
        ma,mb=st.mean(a),st.mean(b);sa,sb=st.pstdev(a),st.pstdev(b)
        return round(sum((x-ma)*(y-mb) for x,y in zip(a,b))/len(a)/(sa*sb),2) if sa and sb else 0
    print('correlazioni (carattere a 18 anni -> media 25-60):',{k:(corr([x['p18'][k] for x in q],[x['fel'] for x in q]),corr([x['p18'][k] for x in q],[x['st'] for x in q])) for k in 'OCEAN'},'(felicità, stress)')
    print('attaccamento',Counter(x['att'] for x in o).most_common())
