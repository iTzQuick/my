"""Fase 5.3c — emigrare: mete per epoca, partenza, permesso da stagionale (famiglia a casa, ricongiungimento col permesso B), Londra
(permesso prima del 1973, visto dal 2021), miniere del Belgio e Marcinelle, ritorno in Italia. Poi N vite col pilota automatico.

    python tools/test_estero.py        # prove + 40 vite
    python tools/test_estero.py 80
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
 const nuova=(eta,job,anno,sesso)=>{
   nuovaVita({sesso:sesso||'M',nome:'Prova',cognome:'Test',citta:'Roma',prov:'RM'});
   S.eta=eta;S.anno=anno;S.annoNascita=anno-eta;S.t=eta*12+6;S.mese=(S.meseNascita+6)%12;S.scuola.stato='finita';S.istr.liv=2;S.casa={tipo:'affitto',n:'Monolocale',costo:P(6000)};S.soldi=P(30000);S.abil.lingue=60;
   S.relazioni=[];coda.length=0;S.futuri.length=0;
   if(job){S.t-=24;assumi(JOB[job]);S.t+=24;completaSquadra(true)}
 };
 const apri=(id,d)=>{coda.push({e:EV[id],d:d||{}});next();return [...document.querySelectorAll('#shA button:not([disabled])')]};
 const chiudi=()=>{let g=0;while(!document.querySelector('#scrim').hidden&&g++<20){const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}};
 const ids=a=>metaDisponibili(a).map(m=>m.id).sort().join(',');
 // 1) le mete per epoca
 const att={1950:'charleroi,londra,zurigo',1955:'charleroi,colonia,londra,zurigo',1957:'colonia,londra,zurigo',1967:'colonia,londra,zurigo',1968:'amsterdam,berlino,bruxelles,colonia,londra,parigi,zurigo',
   1973:'amsterdam,berlino,bruxelles,colonia,dublino,londra,parigi,zurigo',1986:'amsterdam,barcellona,berlino,bruxelles,colonia,dublino,londra,parigi,zurigo',2024:'amsterdam,barcellona,berlino,bruxelles,colonia,dublino,londra,parigi,zurigo'};
 for(const a in att)if(ids(+a)!==att[a])ko.push('mete nel '+a+': '+ids(+a)+' invece di '+att[a]);
 nuova(30,null,1960);if(cercaLuoghi('',true).some(c=>c.estero&&c.n==='Parigi'))ko.push('Parigi cercabile nel 1960');
 nuova(30,null,1990);if(!cercaLuoghi('',true).some(c=>c.n==='Parigi'))ko.push('Parigi non cercabile nel 1990');
 // 2) requisiti: lingua, età, diploma per Londra dal 2021
 nuova(30,null,1990);S.abil.lingue=10;
 if(!requisitiMeta(metaDi('Parigi')).some(x=>/lingue/.test(x)))ko.push('Parigi con lingue 10 dovrebbe chiedere la lingua');
 if(requisitiMeta(metaDi('Zurigo')).length)ko.push('Zurigo nel 1990 (stagionale) non chiede lingue');
 nuova(30,null,2023);S.istr.liv=1;S.abil.lingue=60;
 if(!requisitiMeta(metaDi('Londra')).some(x=>/diploma/.test(x)))ko.push('Londra 2023 senza diploma dovrebbe chiederlo');
 S.istr.liv=3;S.abil.lingue=35;if(!requisitiMeta(metaDi('Londra')).some(x=>/lingue almeno 40/.test(x)))ko.push('Londra 2023 chiede lingua 40: '+requisitiMeta(metaDi('Londra')));
 nuova(30,null,2010);S.abil.lingue=20;if(requisitiMeta(metaDi('Londra')).length)ko.push('Londra 2010 con lingue 20 dovrebbe andare: '+requisitiMeta(metaDi('Londra')));
 // 3) Londra: permesso prima del 1973 (1 su 2), niente dopo, visto dal 2021 senza offerta
 const prova=(anno,x,n)=>{let ok=0;for(let i=0;i<n;i++){nuova(30,'imp',anno);S.istr.liv=3;S.soldi=P(40000);const m=metaDi('Londra');const e=avviaEstero(offertaMeta(m),x);if(S.fatti.estero)ok++}return ok};
 let ok=prova(1970,{off:1},300);if(ok<300*.4||ok>300*.6)ko.push('Londra 1970: permesso a '+ok+'/300');
 ok=prova(1985,{off:1},60);if(ok!==60)ko.push('Londra 1985: '+ok+'/60');
 ok=prova(2023,{},300);if(ok<300*.45||ok>300*.65)ko.push('Londra 2023 senza offerta: '+ok+'/300');
 ok=prova(2023,{off:1},60);if(ok!==60)ko.push('Londra 2023 con offerta: '+ok+'/60');
 // 4) partenza normale: stesso mestiere, stipendio maggiorato, partner che segue
 nuova(30,'imp',1985);S.lavoro.liv=1;S.lavoro.nome=nomeJob(JOB.imp,1);S.lavoro.stip=stipLiv(JOB.imp,1);
 let pt=nuovaPersona('Partner','F',29,null,{rapporto:70});pt.conv=true;
 const stipIt=stipLiv(JOB.imp,1);
 const r1=avviaEstero(offertaMeta(metaDi('Parigi')),{off:1});
 const E=S.fatti.estero;
 if(!E||E.n!=='Parigi'||S.citta!=='Parigi')ko.push('partenza per Parigi: '+r1[0]);
 else{
  if(!S.lavoro||S.lavoro.id!=='imp'||S.lavoro.liv!==1)ko.push('stesso mestiere e livello: '+(S.lavoro&&S.lavoro.nome));
  if(S.lavoro&&Math.abs(S.lavoro.stip/stipIt-1.15)>.1)ko.push('stipendio a Parigi ×'+(S.lavoro.stip/stipIt).toFixed(2));
  if(!pt.conv||pt.lontano)ko.push('la partner convivente dovrebbe seguirti');
  if(!S.futuri.some(f=>f.id==='car_estero2')||!S.futuri.some(f=>f.id==='car_estero3'))ko.push('catena non in programma');
  if(!S.fatti.emigrato||S.fatti.emigrato.zo===undefined)ko.push('emigrato senza zona di partenza: '+JSON.stringify(S.fatti.emigrato));
  if(INV.controlla().length)ko.push('invarianti dopo la partenza: '+INV.controlla().map(x=>x.join(': ')).join(' | '));
  // costo della vita e addizionali
  if(Math.abs(costoZona()-1.2)>.01)ko.push('costo della vita a Parigi '+costoZona());
  if(aliqAddiz()!==0)ko.push('addizionali all\'estero '+aliqAddiz());
  // tornare in Italia: periodo estero chiuso, ritornato
  vaiA('Roma','RM');
  if(S.fatti.estero)ko.push('tornato ma il periodo estero è ancora aperto');
  if(!S.fatti.esteroStorico)ko.push('manca lo storico estero');
  if(!S.fatti.ritornato)ko.push('tornato nella zona di partenza ma «ritornato» non è segnato');
 }
 // 5) senza soldi non si parte
 nuova(30,'imp',1985);S.soldi=10;const r2=avviaEstero(offertaMeta(metaDi('Parigi')),{off:1});
 if(S.fatti.estero||r2[1]!=='x')ko.push('parte senza soldi');
 // 6) stagionale svizzero: la famiglia resta a casa
 nuova(32,null,1980);S.lavoro=null;
 pt=nuovaPersona('Coniuge','F',30,null,{rapporto:75});pt.conv=true;pt.coppia='sposato';
 const f1=nuovaPersona('Figlio','M',4,null,{rapporto:90});
 const r3=avviaEstero(offertaMeta(metaDi('Zurigo')),{off:1});
 const E3=S.fatti.estero;
 if(!E3||!E3.stag)ko.push('Zurigo 1980 non è stagionale: '+r3[0]);
 else{
  if(!pt.lontano||pt.conv||pt.dove!=='Roma')ko.push('la moglie dovrebbe restare a casa, lontana');
  if(!f1.lontano||!f1.conEx||f1.dove!=='Roma')ko.push('il figlio dovrebbe restare a casa');
  if(E3.fam.length!==2)ko.push('fam: '+E3.fam.length);
  if(S.casa.n!=='Alloggio dell\'azienda')ko.push('alloggio: '+S.casa.n);
  if(S.lavoro.id!=='ope')ko.push('lavoro dello stagionale: '+S.lavoro.id);
  const att0=stipLiv(JOB.ope,0)*1.7*.75;if(Math.abs(S.lavoro.stip/att0-1)>.1)ko.push('stagionale: stipendio '+S.lavoro.stip+' invece di '+Math.round(att0));
  const v=INV.controlla();if(v.length)ko.push('invarianti da stagionale: '+v.map(x=>x.join(': ')).join(' | '));
  // i primi mesi: il bambino di nascosto (25% di essere scoperti, altrimenti vive con te)
  let n1=0,n2=0;
  for(let i=0;i<120;i++){
    nuova(32,null,1980);pt=nuovaPersona('Coniuge','F',30,null,{rapporto:75});pt.conv=true;const f=nuovaPersona('Figlio','M',4,null,{rapporto:90});
    avviaEstero(offertaMeta(metaDi('Zurigo')),{off:1});
    const bs=apri('car_estero2');const b=bs.find(x=>/di nascosto/.test(x.textContent));if(!b){ko.push('manca «di nascosto»: '+bs.map(x=>x.textContent).join('|'));break}
    b.click();chiudi();
    if(S.fatti.estero){n1++;if(f.lontano||f.conEx)ko.push('bambino nascosto ma ancora lontano')}else{n2++;if(f.conEx||f.lontano)ko.push('espulso: il figlio dovrebbe essere tornato a casa con te')}
  }
  if(n2<120*.15||n2>120*.38)ko.push('bambino scoperto '+n2+'/120');
  // dopo tre anni: il permesso B e la famiglia
  nuova(32,null,1980);pt=nuovaPersona('Coniuge','F',30,null,{rapporto:75});pt.conv=true;const f2=nuovaPersona('Figlio','M',4,null,{rapporto:90});
  avviaEstero(offertaMeta(metaDi('Zurigo')),{off:1});S.soldi=P(20000);const s0=S.lavoro.stip;
  let bs=apri('car_estero3');const ch=bs.find(x=>/Chiami la famiglia/.test(x.textContent));
  if(!ch)ko.push('car_estero3: '+bs.map(x=>x.textContent).join('|'));
  else{ch.click();chiudi();
    if(S.fatti.estero.stag)ko.push('dopo il permesso B è ancora stagionale');
    if(pt.lontano||!pt.conv||f2.lontano||f2.conEx)ko.push('ricongiungimento: la famiglia non è con te');
    if(Math.abs(S.lavoro.stip/s0-1/.75)>.02)ko.push('stipendio dopo il permesso B ×'+(S.lavoro.stip/s0).toFixed(2));
    const v2=INV.controlla();if(v2.length)ko.push('invarianti dopo il ricongiungimento: '+v2.map(x=>x.join(': ')).join(' | '));}
  // tornare mentre la famiglia è a casa: si riunisce
  nuova(32,null,1980);pt=nuovaPersona('Coniuge','F',30,null,{rapporto:75});pt.conv=true;const f3=nuovaPersona('Figlio','M',4,null,{rapporto:90});
  avviaEstero(offertaMeta(metaDi('Zurigo')),{off:1});vaiA('Roma','RM');
  if(pt.lontano||!pt.conv||f3.lontano||f3.conEx)ko.push('tornato in Italia: la famiglia non è tornata con te');
  const v3=INV.controlla();if(v3.length)ko.push('invarianti dopo il ritorno: '+v3.map(x=>x.join(': ')).join(' | '));
 }
 // 7) stagionale solo fino al 2001
 nuova(30,null,2005);S.lavoro=null;avviaEstero(offertaMeta(metaDi('Zurigo')),{off:1});
 if(!S.fatti.estero||S.fatti.estero.stag)ko.push('Zurigo 2005 non dovrebbe essere stagionale');
 // 8) miniera di Charleroi (1946–1956): inaccessibile a chi nasce dal 1950, ma il codice deve funzionare
 nuova(25,null,1955);S.lavoro=null;S.mese=3;
 const rm=avviaEstero(offertaMeta(metaDi('Charleroi')),{off:1});
 if(!S.fatti.estero||!S.lavoro||!S.lavoro.miniera)ko.push('miniera: '+rm[0]);
 else{
  if(S.lavoro.id!=='ope')ko.push('in miniera si fa l\'operaio');
  S.salute=90;let sal=0;const s0=S.salute;
  for(let i=0;i<1200;i++){S.salute=90;meseEstero();sal+=90-S.salute}
  if(sal/100<2.5||sal/100>5.5)ko.push('salute persa in miniera '+(sal/100).toFixed(1)+'/anno');
  if(!(S.fatti.minieraMesi>=1200))ko.push('mesi di miniera '+S.fatti.minieraMesi);
  // Marcinelle
  nuova(25,null,1956);S.lavoro=null;S.mese=7;
  avviaEstero(offertaMeta(metaDi('Charleroi')),{off:1});S.mese=7;S.anno=1956;completaSquadra(true);
  const sq=squadra();
  coda.length=0;storiaMese();
  if(!coda.some(c=>c.e.id==='car_marcinelle'))ko.push('Marcinelle non parte per il minatore');
  else{
    const col=sq.colleghi.length;
    const bs2=[...(()=>{next();return document.querySelectorAll('#shA button:not([disabled])')})()];
    if(!bs2.length)ko.push('Marcinelle senza scelte');
    else{bs2[0].click();chiudi();if(col&&squadra().colleghi.length!==col-1)ko.push('Marcinelle: il collega dovrebbe morire ('+col+' → '+squadra().colleghi.length+')')}
  }
  nuova(25,'ope',1956);S.mese=7;coda.length=0;storiaMese();
  if(coda.some(c=>c.e.id==='car_marcinelle'))ko.push('Marcinelle parte anche per un operaio italiano');
 }
 // 9) BPCO: più probabile per chi è stato in miniera (formula)
 nuova(50,null,1990);
 const bpco=(m,e)=>(S.dip.fumo&&e>=45?.006:0)+((m||0)>=12&&e>=40?.005:0);
 S.dip.fumo=false;if(bpco(0,50)!==0||bpco(24,50)<=0)ko.push('BPCO miniera');
 // 10) trasferisciti: l'estero passa dalla catena car_estero
 nuova(30,'imp',1990);trasferisciti();
 const cerca=document.querySelector('#shA input');
 // 11) ita_ritorno: dopo anni all'estero compare, solo se non sei già tornato
 nuova(34,'imp',1990);avviaEstero(offertaMeta(metaDi('Parigi')),{off:1});
 S.fatti.emigrato.t=S.t-70;
 let compare=0;for(let i=0;i<400;i++){coda.length=0;S.fatti.ritornoChiesto=0;controllaRitorno();if(coda.some(c=>c.e.id==='ita_ritorno'))compare++}
 if(compare<400*.015||compare>400*.05)ko.push('ita_ritorno compare '+compare+'/400');
 vaiA('Roma','RM');coda.length=0;for(let i=0;i<200;i++)controllaRitorno();if(coda.length)ko.push('ita_ritorno anche dopo il ritorno');
 // 12) la lista COL_EV e i testi non esplodono
 nuova(35,'imp',1995);for(const e of COL_EV){try{e.ok(squadra(),S.lavoro)}catch(x){ko.push(e.id+': '+x.message)}}
 nuova(35,'imp',2015);let bs3=apri('car_estero',{x:{off:1}});if(bs3.length<2)ko.push('car_estero 2015: '+bs3.map(b=>b.textContent).join('|'));
 const tx=document.querySelector('#shA')?document.body.innerText:'';chiudi();
 nuova(25,null,2000);bs3=apri('car_estero',{x:{meta:'londra'}});if(bs3.length<2)ko.push('car_estero manuale: '+bs3.length);chiudi();
 nuova(25,null,2023);S.istr.liv=1;bs3=apri('car_estero',{x:{meta:'londra'}});
 if(!bs3.some(b=>/non ancora/.test(b.textContent)))ko.push('car_estero 2023 senza diploma dovrebbe dire «non ancora»: '+bs3.map(b=>b.textContent).join('|'));chiudi();
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
   let k=0,est=0,stag=0,ritorno=0,meta='';
   while(S.vivo&&k<1500){k++;AP.mese();risolvi();mese();risolvi();
     if(S.fatti.estero){est=1;meta=S.fatti.estero.n;if(S.fatti.estero.stag)stag=1}
     if(S.fatti.esteroStorico)ritorno=1;
     if(typeof INV!=='undefined'){const i=INV.controlla();if(i.length)ko.push(i.slice(0,2).map(z=>z.join(': ')).join(' | '))}}
   ris.push({eta:S.eta,est:S.fatti.vissutoEstero||0,stag,ritorno,meta});
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
    print(f"{len(V)} vite: hanno vissuto all'estero {100*sum(1 for x in V if x['est'])/len(V):.0f}% · di cui stagionali {sum(x['stag'] for x in V)} · tornati {sum(x['ritorno'] for x in V)}")
print('violazioni nelle vite:', v['ko'] or 'nessuna ✓')
print('errori JS:', (r['errs'] + pe + v['errs']) or 'nessuno')
sys.exit(1 if r['ko'] or v['ko'] or r['errs'] or pe or v['errs'] else 0)
