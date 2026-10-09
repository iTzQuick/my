"""Prova le novità del secondo giro di feedback: ricchezza e lascito, animali, da amici a innamorati, attività per beni ed età, ferie a pagamento.
Uso: python build.py && python tools/test_novita.py   (salva anche grafica/novita_*.png)"""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8')
JS=r'''()=>{
 const o={};const chiudi=()=>{sheetOpen=false;document.querySelector('#scrim').hidden=true;coda.length=0};
 const btn=re=>[...document.querySelectorAll('#shA button')].find(b=>re.test(b.textContent));
 nuovaVita({sesso:'F',nome:'Noemi',cognome:'Prova',citta:'Roma',prov:'RM'});coda.length=0;
 // ferie: costano
 S.eta=30;S.casa={tipo:'affitto',n:'Bilocale',costo:6000};S.soldi=10000;coda.push({e:EV.ferie,d:{}});next();btn(/mare/).click();o.ferie=10000-S.soldi;chiudi();
 tab='attivita';attTab='svago';render();o.cardVacanza=[...document.querySelectorAll('#view .act')].find(b=>/Vacanza/.test(b.textContent)).textContent;
 // animali: 4 cani, nomi diversi
 S.animali=[];for(let i=0;i<4;i++)adotta(ANIMALI[0]);o.nomiCani=S.animali.map(a=>a.nome);
 // da sola, senza dar da mangiare per 3 mesi
 const a=S.animali[0];const sal0=a.sal;for(let i=0;i<3;i++)meseAnimali();o.cagnoNonNutrito={salute:[sal0,a.sal],legame:a.leg,fame:a.pappa};
 apriAnimale(0);o.schedaCane=[...document.querySelectorAll('#shA button')].map(b=>b.textContent);btn(/Dai da mangiare/).click();o.dopoPappa=a.pappa;chiudi();
 // da amici a innamorati
 S.attrazione=null;const am=nuovaPersona('Amico','M',31,null,{rapporto:90});am.orient='etero';apriPersona(am.id);o.opzioneAmore=!!btn(/Dichiara/);
 let ok=0;for(let i=0;i<200;i++){const p=nuovaPersona('Amico','M',30,null,{rapporto:90,orient:'etero'});if(dichiarati(p)[1]==='g'){ok++;p.ruolo='Ex'}}o.dichiarazioniRiuscite=ok/200;chiudi();
 S.relazioni.filter(p=>p.ruolo==='Partner').forEach(p=>p.ruolo='Ex');
 const am2=nuovaPersona('Amico','M',30,null,{rapporto:80,orient:'etero'});coda.push({e:EV.amico_confessa,d:{p:am2}});next();btn(/Anche tu/).click();o.confessione=am2.ruolo;chiudi();
 // ricchezza
 S.soldi=P(20000000);S.karma=70;const pat0=patrimonio();apriCollezione('arte');btn(/Compra/).click();chiudi();o.collezione=[S.lusso.coll.arte.length,patrimonio()-pat0];
 o.dona=[dona(P(1000000))[0],S.lusso.onori];
 for(let i=0;i<5;i++){S.lusso.coll.orologi=S.lusso.coll.orologi||[];}
 tab='beni';render();o.traguardi=traguardi().filter(x=>x[2]).map(x=>x[0]);
 o.esperienze=ATTIVITA.filter(x=>x.sez==='Lusso'&&(!x.cond||x.cond())).map(x=>x.n);
 // attività per età e per beni
 const vis=()=>ATTIVITA.filter(x=>(!x.max||S.eta<=x.max)&&S.eta>=x.min&&(!x.cond||x.cond())).map(x=>x.id);
 S.eta=5;o.a5anni=vis().filter(x=>['parco','lunapark','disco','bocce'].includes(x));
 S.eta=70;o.a70anni=vis().filter(x=>['parco','bocce','liscio','cantiere'].includes(x));
 S.eta=30;S.veicoli=[];S.patente=true;o.gitaSenzaAuto=vis().includes('gita');S.veicoli.push({id:S.nextId++,n:'Utilitaria nuova',valore:15000,stato:100,costo:1000});o.gitaConAuto=vis().includes('gita');
 S.veicoli=[{id:S.nextId++,n:'Yacht',valore:1500000,stato:100,costo:90000}];o.yachtNonEAuto=[haAuto(),haBarca(),vis().includes('crociera_yacht')];
 return o;
}'''
with sync_playwright() as p:
    b=p.chromium.launch();errs=[];pg=b.new_page(viewport={'width':390,'height':844})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto((ROOT/'dist'/'vitamia.html').as_uri());pg.wait_for_timeout(300)
    r=pg.evaluate(JS)
    for k,v in r.items():print(f'{k}: {v}')
    # schermate: beni da ricca, animali in persone, scheda animale
    pg.evaluate("()=>{S.eta=45;S.veicoli=[];sheetOpen=false;document.querySelector('#scrim').hidden=true;tab='beni';render();const v=document.querySelector('#view');const s=[...v.querySelectorAll('.sec')].find(x=>/Ricchezza/.test(x.textContent));v.scrollTop=s.offsetTop-10}")
    pg.wait_for_timeout(150);pg.screenshot(path=str(ROOT/'grafica'/'novita_ricchezza.png'))
    pg.evaluate("()=>{tab='persone';render();const v=document.querySelector('#view');v.scrollTop=v.scrollHeight}");pg.wait_for_timeout(150);pg.screenshot(path=str(ROOT/'grafica'/'novita_animali.png'))
    pg.evaluate("()=>{apriAnimale(1)}");pg.wait_for_timeout(150);pg.screenshot(path=str(ROOT/'grafica'/'novita_scheda_animale.png'))
    print('errori',errs);b.close()
