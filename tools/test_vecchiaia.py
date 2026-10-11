"""Fase 5.2 — vecchiaia piena. Blocco 1: testamento (legittima protetta, quota disponibile libera, l'evento `testamento` come ingresso)
e ultimo desiderio (scelta verso 75–80 anni, realizzazione, necrologio). Poi N vite col pilota automatico.

    python tools/test_vecchiaia.py        # prove + 40 vite
    python tools/test_vecchiaia.py 80
"""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
AP = (ROOT/'tools'/'autopilota.js').read_text(encoding='utf-8')
INV = (ROOT/'tools'/'invarianti.js').read_text(encoding='utf-8')
N = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 40
JS_BASE = r'''async ()=>{
 const ko=[],errs=[];window.addEventListener('error',e=>errs.push(e.message));
 window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 const nuova=(eta,anno)=>{
   nuovaVita({sesso:'M',nome:'Prova',cognome:'Test',citta:'Roma',prov:'RM'});
   S.eta=eta;S.anno=anno||2026;S.annoNascita=S.anno-eta;S.t=eta*12+6;S.mese=(S.meseNascita+6)%12;S.scuola.stato='finita';S.casa={tipo:'affitto',n:'Monolocale',costo:P(6000)};S.soldi=P(40000);
   S.relazioni=[];coda.length=0;S.futuri.length=0;
 };
 const pers=(ruolo,eta,sesso,rapp)=>nuovaPersona(ruolo,sesso||'F',eta,null,{rapporto:rapp||70});
 const apri=(id,d)=>{coda.push({e:EV[id],d:d||{}});next();return [...document.querySelectorAll('#shA button:not([disabled])')]};
 const chiudi=()=>{let g=0;while(!document.querySelector('#scrim').hidden&&g++<20){const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}};
 const somma=q=>q.reduce((s,x)=>s+x[1],0);
 const q1=q=>Math.abs(somma(q)-1)<1e-9;
 const near=(a,b)=>Math.abs(a-b)<1e-9;
 // 1) la legittima (c.c. artt. 536-544)
 nuova(70);let c=pers('Coniuge',68,'F'),f=pers('Figlio',40,'M');
 let L=legittima();if(!near(L.find(x=>x[0]===c)[1],1/3)||!near(L.find(x=>x[0]===f)[1],1/3))ko.push('coniuge e un figlio: 1/3 + 1/3');
 let f2=pers('Figlio',38,'F');L=legittima();if(!near(L.find(x=>x[0]===c)[1],1/4)||!near(L.find(x=>x[0]===f)[1],1/4)||!near(somma(L),.75))ko.push('coniuge e due figli: 1/4 + 1/2');
 c.vivo=false;L=legittima();if(!near(somma(L),2/3)||!near(L[0][1],1/3))ko.push('due figli: 2/3 in tutto');
 f2.vivo=false;L=legittima();if(!near(somma(L),.5))ko.push('un figlio: 1/2');
 nuova(70);c=pers('Coniuge',68,'F');L=legittima();if(!near(somma(L),.5))ko.push('solo coniuge: 1/2');
 pers('Madre',92,'F');L=legittima();if(!near(somma(L),.75))ko.push('coniuge e un genitore: 1/2 + 1/4');
 nuova(70);pers('Fratello',65,'M');pers('Amico',70,'F');if(legittima().length)ko.push('fratelli e amici non hanno la legittima');
 if(!near(quotaDisponibile(),1))ko.push('senza legittimari la disponibile è tutto');
 // 2) quote con il testamento
 nuova(75);c=pers('Coniuge',72,'F');f=pers('Figlio',45,'M');f2=pers('Figlio',42,'F');const n1=pers('Nipote',10,'F'),n2=pers('Nipote',8,'M');let am=pers('Amico',74,'M',90);
 let q=quoteSuccessione();if(!q1(q)||q.length!==3)ko.push('per legge: somma '+somma(q));
 S.testamento={t:S.t,eta:S.eta,dest:[{nipoti:1}]};q=quoteSuccessione();
 if(!q1(q))ko.push('ai nipoti: somma '+somma(q));
 if(q.find(x=>x[0]===c)[1]<.25-1e-9||q.find(x=>x[0]===f)[1]<.25-1e-9)ko.push('la legittima non può scendere sotto la quota riservata');
 if(!near(q.find(x=>x[0]===n1)[1],.125)||!near(q.find(x=>x[0]===n2)[1],.125))ko.push('i nipoti dividono la disponibile (1/4): '+q.map(x=>x[1]).join(','));
 S.testamento.dest=[{pid:am.id}];q=quoteSuccessione();if(!q1(q)||!near(q.find(x=>x[0]===am)[1],.25))ko.push('amico: 1/4');
 am.vivo=false;q=quoteSuccessione();if(!q1(q)||q.length!==3)ko.push('destinatario morto: si torna alla legge');
 S.testamento.dest=[{ente:'beneficenza'}];q=quoteSuccessione();if(!q1(q)||!q.some(x=>x[0].ruolo==='Ente'))ko.push('beneficenza');
 if(!/La beneficenza 25%/.test(testoSuccessione()))ko.push('testo: '+testoSuccessione());
 S.testamento.dest=[{ente:'fondazione'}];if(!q1(quoteSuccessione())||quoteSuccessione().some(x=>x[0].ruolo==='Ente'))ko.push('fondazione inesistente: ignorata');
 S.testamento.dest=[{pid:f.id}];q=quoteSuccessione();if(!near(q.find(x=>x[0]===f)[1],.5))ko.push('al figlio: 1/4 + 1/4');
 nuova(80);const a2=pers('Amico',79,'M',90);S.testamento={t:0,eta:80,dest:[{pid:a2.id}]};q=quoteSuccessione();if(q.length!==1||!near(q[0][1],1))ko.push('senza legittimari, tutto all\'amico');
 // 3) l'evento: Fai testamento -> scelta -> S.testamento
 nuova(70);c=pers('Coniuge',68,'F');f=pers('Figlio',40,'M');pers('Nipote',9,'F');S.soldi=P(5000);
 let bs=apri('testamento');const txt=document.body.innerText;
 if(!/legittima/.test(txt)||!/per legge/.test(txt))ko.push('testamento: testo senza legittima');
 bs.find(b=>/Fai testamento/.test(b.textContent)).click();
 if(S.soldi!==P(5000)-P(500))ko.push('il testamento costa P(500): '+S.soldi);
 chiudi();
 if(!S.testamento)ko.push('dopo «Fai testamento» arriva la scelta della parte libera');
 coda.length=0;bs=apri('testamento_dispo');
 const et=bs.map(b=>b.textContent);if(!et.some(t=>/Come prevede la legge/.test(t))||!et.some(t=>/nipoti/.test(t))||!et.some(t=>/beneficenza/i.test(t)))ko.push('opzioni: '+et.join('|'));
 bs.find(b=>/nipoti/.test(b.textContent)).click();chiudi();
 if(!S.testamento||!S.testamento.dest.length||!S.fatti.testamento)ko.push('S.testamento non salvato');
 // non ora: si riprova dopo 5 anni, al massimo 2 volte in tutto
 nuova(66);pers('Figlio',35,'M');S.fatti.testEta=66;S.carcere=0;S.fatti.desEta=99;let volte=0;
 for(let e=66;e<=85;e++){S.eta=e;coda.length=0;vecchiaiaAnno();if(coda.some(x=>x.e===EV.testamento))volte++}
 if(volte!==2)ko.push('«Non ora»: proposto '+volte+' volte invece di 2');
 nuova(70);S.fatti.testEta=66;S.fatti.desEta=99;S.testamento={t:0,eta:70,dest:[]};coda.length=0;vecchiaiaAnno();if(coda.length)ko.push('già fatto: non si ripropone');
 nuova(70);S.fatti.testamento=true;delete S.testamento;aggiornaStato();if(!S.testamento||S.testamento.dest.length)ko.push('migrazione del vecchio testamento');
 // un destinatario muore: testamento_rivedi
 nuova(70);f=pers('Figlio',40,'M');pers('Nipote',9,'F');am=pers('Amico',70,'F',90);S.testamento={t:0,eta:70,dest:[{pid:am.id}]};S.futuri.length=0;mortePersona(am);
 if(!S.futuri.some(x=>x.id==='testamento_rivedi'))ko.push('morto il destinatario: serve testamento_rivedi');
 bs=apri('testamento_rivedi',{x:{nome:'Anna'}});if(bs.length<2)ko.push('testamento_rivedi senza scelte');chiudi();
 // «Continua come»: la quota del figlio segue il testamento
 nuova(78);S.soldi=P(500000);c=pers('Coniuge',75,'F');f=pers('Figlio',48,'M');pers('Nipote',12,'F');S.testamento={t:0,eta:78,dest:[{nipoti:1}]};
 const qf=quoteSuccessione().find(x=>x[0]===f)[1];if(!near(qf,1/3))ko.push('quota del figlio con coniuge e nipoti: '+qf);
 // 4) l'ultimo desiderio: proposta, scelta, realizzazione, necrologio
 const prov=(setup,k)=>{nuova(77);S.fatti.testEta=99;setup();
   if(!desideriPossibili().includes(k)){ko.push('desiderio «'+k+'» non possibile nella situazione di prova');return}
   let bs=apri('ult_desiderio');
   if(bs.length<2)ko.push('ult_desiderio con meno di 2 scelte');
   const idx=Object.keys(DES).filter(x=>desideriPossibili().includes(x)).indexOf(k);
   bs[idx].click();chiudi();
   const D=S.fatti.desiderio;if(!D||D.id!==k){ko.push('desiderio '+k+' non salvato: '+JSON.stringify(D));return}
   if(!S.futuri.some(x=>x.id==='ult_realizza'))ko.push(k+': ult_realizza non programmato');
   S.vivo=false;S.causa='nel sonno';const V=document.querySelector('#view');renderMorte(V);
   if(!/Non fece in tempo/.test(V.innerText))ko.push(k+': necrologio senza «Non fece in tempo»');
   S.vivo=true;
   const fu=S.futuri.find(x=>x.id==='ult_realizza');const dd={x:fu.x};if(fu.pid)dd.p=S.relazioni.find(p=>p.id===fu.pid);
   S.soldi=P(40000);bs=apri('ult_realizza',dd);
   if(bs.length<2){ko.push(k+': ult_realizza senza scelte');return}
   bs[0].click();chiudi();
   if(!S.fatti.desiderio.fatto)ko.push(k+': non realizzato');
   S.vivo=false;const V2=document.querySelector('#view');renderMorte(V2);if(!/Realizzato/.test(V2.innerText))ko.push(k+': necrologio senza «Realizzato»');S.vivo=true;
 };
 prov(()=>{S.fatti.cittaNascita='Bari';S.fatti.provNascita='BA';S.citta='Roma';pers('Figlio',45,'F')},'luogo');
 prov(()=>{pers('Fratello',70,'M',10)},'pace');
 prov(()=>{pers('Figlio',45,'F');pers('Nipote',10,'F');pers('Fratello',70,'M',80)},'tavola');
 prov(()=>{pers('Figlio',45,'F')},'viaggio');
 prov(()=>{pers('Nipote',10,'F')},'memorie');
 prov(()=>{const c=pers('Coniuge',70,'F');c.vivo=false},'tomba');
 nuova(77);S.soldi=0;if(desideriPossibili().includes('viaggio'))ko.push('viaggio senza soldi');
 if(desideriPossibili().some(k=>['tavola','pace','memorie','tomba'].includes(k)))ko.push('desideri senza persone: '+desideriPossibili());
 // la proposta compare una volta, tra i 75 e gli 88 anni
 nuova(75);S.fatti.testEta=99;S.fatti.desEta=75;pers('Figlio',45,'F');S.soldi=P(40000);let n=0;
 for(let e=70;e<=90;e++){S.eta=e;coda.length=0;vecchiaiaAnno();if(coda.some(x=>x.e===EV.ult_desiderio)){n++;if(e<75||e>88)ko.push('proposto a '+e);S.fatti.desiderioRif=1}}
 if(n!==1)ko.push('ult_desiderio proposto '+n+' volte');
 // 5) tutti i testi si aprono
 nuova(77);pers('Figlio',45,'F');pers('Nipote',10,'F');
 for(const id of ['testamento','testamento_dispo','testamento_rivedi','ult_desiderio','ult_realizza']){
   try{for(let i=0;i<3;i++){S.testamento=S.testamento||{t:0,eta:70,dest:[]};S.fatti.desiderio=S.fatti.desiderio||{id:'memorie',testo:'x',t:0};S.fatti.desiderio.fatto=0;apri(id,{x:{nome:'Anna'}});chiudi()}}catch(x){ko.push(id+': '+x.message)}}
 return {errs,ko};
}'''
JS_VITE = r'''(N)=>{
 const errs=[],ko=[];window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
 const ris=[];
 for(let v=0;v<N;v++){
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s,anno:1950+Math.floor(Math.random()*60)});
   let k=0,test=0,des='';
   while(S.vivo&&k<1500){k++;AP.mese();risolvi();mese();risolvi();
     if(S.testamento)test=1;if(S.fatti.desiderio)des=S.fatti.desiderio.fatto?'fatto':'no';
     if(S.eta>=70){const q=quoteSuccessione();if(q.length&&Math.abs(q.reduce((s,y)=>s+y[1],0)-1)>1e-6)ko.push('quote non sommano a 1: '+q.reduce((s,y)=>s+y[1],0))}
     if(typeof INV!=='undefined'){const i=INV.controlla();if(i.length)ko.push(i.slice(0,2).map(z=>z.join(': ')).join(' | '))}}
   ris.push({eta:S.eta,test,des,rif:S.fatti.desiderioRif?1:0});
  }catch(e){errs.push(e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' / '))}
 }
 return {errs,ko:[...new Set(ko)].slice(0,6),ris};
}'''
with sync_playwright() as pw:
    b = pw.chromium.launch(); pe = []
    pg = b.new_page(viewport={'width': 400, 'height': 820}); pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300); pg.add_script_tag(content=AP); pg.add_script_tag(content=INV)
    r = pg.evaluate(JS_BASE)
    pg2 = b.new_page(viewport={'width': 400, 'height': 820}); pg2.on('pageerror', lambda e: pe.append(str(e)))
    pg2.goto(GAME); pg2.wait_for_timeout(300); pg2.add_script_tag(content=AP); pg2.add_script_tag(content=INV)
    v = pg2.evaluate(JS_VITE, N)
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
print('PROVE:', r['ko'] or 'tutte superate ✓')
V = v['ris']
if V:
    old = [x for x in V if x['eta'] >= 70]
    print(f"{len(V)} vite, {len(old)} oltre i 70 anni: testamento fatto {100*sum(x['test'] for x in old)/max(1,len(old)):.0f}% · ultimo desiderio scelto {100*sum(1 for x in old if x['des'])/max(1,len(old)):.0f}% (realizzato {sum(1 for x in old if x['des']=='fatto')}, non ce l'ha fatta {sum(1 for x in old if x['des']=='no')}) · «nessuno» {sum(x['rif'] for x in old)}")
print('violazioni nelle vite:', v['ko'] or 'nessuna ✓')
print('errori JS:', (r['errs'] + pe + v['errs']) or 'nessuno')
sys.exit(1 if r['ko'] or v['ko'] or r['errs'] or pe or v['errs'] else 0)
