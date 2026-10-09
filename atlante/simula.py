import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
import json,sys,time
from playwright.sync_api import sync_playwright
AP=open(ROOT/'tools'/'autopilota.js').read()
SETUP=r'''()=>{window.render=()=>{};window.toast=()=>{};window.save=()=>{};
window.CNT={};const on=next;
window.next=function(){if(coda.length&&S&&S.vivo){const id=coda[0].e.id;CNT[id]=(CNT[id]||0)+1}return on()};
window.AGG={vivi:[],pat:[]};for(const k of ['sal','fel','int','asp','en','st','soc','forma'])AGG[k]=[];
for(let a=0;a<=110;a++){for(const k of ['sal','fel','int','asp','en','st','soc','forma','vivi'])AGG[k][a]=0;AGG.pat[a]=[]}
const ec=entraCarcere;window.entraCarcere=n=>{S.fatti._carc=(S.fatti._carc||0)+n;return ec(n)};
const dv=divorzia;window.divorzia=p=>{S.fatti._div=(S.fatti._div||0)+1;return dv(p)};
}'''
LIFE=r'''(n)=>{const out=[];
const ris=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
for(let i=0;i<n;i++){
 const x=pick(['M','F']);const cc=comuneCaso();
 nuovaVita({sesso:x,nome:'Sim',cognome:pick(COGNOMI),citta:cc.n,prov:cc.s});
 const pers0={...S.pers};
 let maxStip=0,lavId=null,fumo=false,alcol=false,casa=false,k=0,ultEta=-1,partner=0,amiciMax=0,b={f:0,s:0,e:0,so:0,n:0},burn=0,solo=0;
 while(S.vivo&&k<1500){
   k++;AP.mese();ris();mese();ris();
   if(!S.vivo)break;
   if(S.dip.fumo)fumo=true;if(S.dip.alcol)alcol=true;if(S.prop.length)casa=true;
   if(S.lavoro&&S.lavoro.stip/S.mondo.ip>maxStip){maxStip=S.lavoro.stip/S.mondo.ip;lavId=S.lavoro.id}
   amiciMax=Math.max(amiciMax,vivi(['Amico']).length);
   if(S.eta>=25&&S.eta<=60){b.f+=S.felicita;b.s+=S.bis.stress;b.e+=S.bis.energia;b.so+=S.bis.soc;b.n++}
   if(S.eta!==ultEta){ultEta=S.eta;const a=S.eta;if(a<=110){AGG.vivi[a]++;AGG.sal[a]+=S.salute;AGG.fel[a]+=S.felicita;AGG.int[a]+=S.intelligenza;AGG.asp[a]+=S.aspetto;AGG.en[a]+=S.bis.energia;AGG.st[a]+=S.bis.stress;AGG.soc[a]+=S.bis.soc;AGG.forma[a]+=S.bis.forma;if(a%5===0)AGG.pat[a].push(Math.round(patrimonio()/S.mondo.ip))}}
 }
 const nb=Math.max(1,b.n);
 out.push({eta:S.eta,causa:S.causa,liv:S.istr.liv,sposato:!!S.fatti.sposato,div:S.fatti._div||0,figli:S.relazioni.filter(p=>p.ruolo==='Figlio').length,pat:Math.round(patrimonio()/S.mondo.ip),fed:S.fedina.length,carc:S.fatti._carc||0,
  lav:lavId,maxStip:Math.round(maxStip),fama:S.fama,fol:S.social.follower,az:!!S.azienda,clan:!!S.crim.clan,casa,fumo,alcol,amici:amiciMax,classe:S.classe,sesso:S.sesso,pens:!!S.pensione,
  pers:pers0,att:S.att,aspir:S.aspir||[],aspOk:S.aspOk||[],fel:Math.round(b.f/nb),st:Math.round(b.s/nb),en:Math.round(b.e/nb),soc:Math.round(b.so/nb),ex:S.relazioni.filter(p=>p.ruolo==='Ex').length,sep:!!S.fatti.genitoriSeparati,burn:S.fatti.burnT!==undefined,depr:false});
}
return out}'''
N=int(sys.argv[1]) if len(sys.argv)>1 else 600
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(GAME);pg.wait_for_timeout(200)
    pg.add_script_tag(content=AP);pg.evaluate(SETUP)
    out=[];t=time.time()
    for k in range(N//25):
        out+=pg.evaluate(LIFE,25)
        print(k,len(out),round(time.time()-t),flush=True)
    cnt=pg.evaluate('CNT');agg=pg.evaluate('AGG')
    b.close()
print('errs',errs[:3])
json.dump({'vite':out,'cnt':cnt,'agg':agg,'n':len(out)},open(ROOT/'atlante'/'sim.json','w'))
