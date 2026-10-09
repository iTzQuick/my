"""Prova le regole «italiane» aggiunte nell'ottobre 2026: gravidanza, separazione e affido, adozione, eredità della casa,
pensione contributiva e assegno sociale, NASpI e TFR, storia vera e prezzi per anno, IRPEF per anno, unione civile.
Uso: python tools/test_italia.py   → stampa ogni scenario con OK / ERRORE e gli errori JS."""
import pathlib, sys, json
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
JS = r'''
()=>{
 const out=[],errs=[];window.addEventListener('error',e=>errs.push(e.message));
 window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 const ok=(n,c,info)=>out.push(`${c?'OK     ':'ERRORE '} ${n}${info!==undefined?' · '+info:''}`);
 const vita=(o)=>{nuovaVita(Object.assign({sesso:'F',nome:'Anna',cognome:'Rossi',citta:'Bologna',prov:'BO'},o||{}));coda.length=0;sheetOpen=false};
 const avanzaMesi=n=>{for(let i=0;i<n;i++){sheetOpen=false;coda.length=0;mese();}};
 const righe=()=>S.log.flatMap(b=>b.righe.map(r=>r.t));
 const clicca=(re)=>{const b=[...document.querySelectorAll('#shA button:not([disabled])')].find(x=>re.test(x.textContent));if(b){b.click();return true}return false};
 const chiudi=()=>{let g=0;while(!document.querySelector('#scrim').hidden&&g<10){g++;const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}sheetOpen=false};
 // 1. prezzi veri per anno di nascita
 vita({anno:2000});ok('Prezzi del 2000 più bassi di oggi',S.mondo.ip<.75&&S.mondo.ip>.5,S.mondo.ip.toFixed(3));
 // 2. storia vera: nato nel 2005, il lockdown arriva nel 2020
 vita({anno:2005,meseN:0});S.mondo.notizie=[];
 const origNext=window.next;window.next=()=>{const lk=coda.find(q=>q.e.id==='lockdown');if(lk)S.fatti.lockdownVisto=S.anno*100+S.mese;coda.length=0;sheetOpen=false};
 for(let i=0;i<12*21+3&&S.vivo;i++){sheetOpen=false;coda.length=0;mese()}
 window.next=origNext;
 const nt=S.mondo.notizie.map(n=>n.anno+': '+n.t.slice(0,40));
 ok('Lockdown nel marzo 2020',S.fatti.lockdownVisto===202002,S.fatti.lockdownVisto);
 ok('Mondiali 2006 ed Europei 2021 nelle notizie',nt.some(t=>t.startsWith('2006')&&/campione del mondo/.test(t))&&nt.some(t=>t.startsWith('2021')&&/campione d/.test(t)));
 ok('Nessuna pandemia inventata prima del 2026',!S.mondo.notizie.some(n=>/Pandemia: un nuovo virus/.test(n.t)));
 ok('Prezzi a inizio 2026 ≈ quelli di oggi',Math.abs(S.mondo.ip-1)<.03,S.mondo.ip.toFixed(3)+' · '+S.anno+' · vivo '+S.vivo+' '+(S.causa||''));
 // 3. IRPEF per anno
 S.anno=2021;const i21=irpef(40000);S.anno=2023;const i23=irpef(40000);S.anno=2025;const i25=irpef(40000);S.anno=2026;const i26=irpef(40000);
 ok('IRPEF su 40.000 €: 2021 > 2023, 2025 = 23/35, 2026 = 23/33',i25===6440+12000*.35&&i26===6440+12000*.33&&i21>i26,[i21,i23,i25,i26].map(Math.round).join(' / '));
 // 4. gravidanza: donna di 30 anni sposata
 vita({anno:2000});S.eta=30;S.anno=2030;S.t=360;S.casa={tipo:'affitto',n:'Bilocale',costo:9000};assumi(LAVORI.find(j=>j.id==='imp'));
 const m=nuovaPersona('Coniuge','M',32,null,{rapporto:85,conv:true,nozze:S.t-48});
 iniziaTentativi(m);let mesi=0;while(!S.gravidanza&&mesi<60){mesi++;S.t++;meseFamiglia()}
 ok('Concepimento a 30 anni entro qualche mese',!!S.gravidanza,mesi+' mesi');
 if(S.gravidanza){const n0=vivi(['Figlio']).length;let k=0;while(S.gravidanza&&k<12){k++;S.t++;meseFamiglia()}
   const n1=vivi(['Figlio']).length;ok('Nasce dopo 9 mesi (o aborto spontaneo al 2° mese)',n1>n0||righe().some(t=>/perdi il bambino/.test(t)),`${k} mesi, figli ${n0}→${n1}`);
   ok('Congedo di maternità se nasce',n1===n0||S.fatti.congedo>0,S.fatti.congedo)}
 // fertilità per età
 const prova=(eta)=>{let tot=0;for(let v=0;v<400;v++){let mm=0;while(mm<12&&!chance(fertilitaMese(eta,eta+2)))mm++;if(mm<12)tot++}return tot/400};
 const f25=prova(25),f40=prova(40),f46=prova(46);
 ok('Incinta entro un anno: 25 anni ≈ 90%, 40 ≈ 50%, 46 ≈ 10%',f25>.85&&f40>.35&&f40<.65&&f46<.2,[f25,f40,f46].map(x=>Math.round(x*100)+'%').join(' / '));
 // 5. separazione con figli minori
 vita({anno:2000,sesso:'M'});S.eta=40;S.anno=2040;S.t=480;S.soldi=50000;
 const mo=nuovaPersona('Coniuge','F',39,null,{rapporto:20,conv:true,nozze:S.t-120,soldiNozze:10000});
 const f1=nuovaPersona('Figlio','M',8,S.cognome,{});const f2=nuovaPersona('Figlio','F',12,S.cognome,{});
 const res=divorzia(mo);
 ok('Separazione: soldi divisi e divorzio rimandato',S.soldi<50000&&inSeparazione()&&mo.ruolo==='Ex',res[0].slice(0,90));
 ok('Evento affido in coda',coda.some(q=>q.e.id==='affido'));
 coda=coda.filter(q=>q.e.id==='affido');next();const tA=document.querySelector('#shP').textContent;clicca(/Vivono con (?!te)/);chiudi();
 ok('Figli con l\'altro genitore → mantenimento versato',(S.mantenimento||[]).some(x=>x.segno<0)&&f1.conEx,tA.slice(0,80));
 const voci=[];bilancio(true).forEach(([n,x])=>voci.push(n+' '+Math.round(x)));
 ok('Il mantenimento compare nel bilancio',voci.some(v=>/Mantenimento versato/.test(v)),voci.filter(v=>/Mantenimento|Figli/.test(v)).join('; '));
 // 6. adozione secondo la legge
 vita({anno:2000});S.eta=36;S.anno=2036;S.t=432;S.soldi=60000;
 const sp=nuovaPersona('Coniuge','M',37,null,{rapporto:80,conv:true,nozze:S.t-12});
 ok('Adozione negata se sposati da meno di 3 anni',!!puoAdottare(sp),puoAdottare(sp));
 sp.nozze=S.t-40;ok('Adozione possibile dopo 3 anni',!puoAdottare(sp));
 const conv=nuovaPersona('Partner','F',36,null,{rapporto:80,conv:true});ok('Coppia convivente non sposata: niente adozione',!!puoAdottare(conv));conv.vivo=false;
 avviaAdozione(sp);clicca(/Adozione internazionale/);chiudi();
 ok('Domanda avviata e arrivo tra 2 e 4 anni',!!S.adozione&&S.futuri.some(f=>/adozione_/.test(f.id)&&f.t-S.t>=24),S.futuri.map(f=>f.id+'@'+(f.t-S.t)).join(','));
 // 7. eredità della casa dei genitori
 vita({anno:2000,classe:'media',fam:{classe:'media'}});S.eta=50;S.anno=2050;S.t=600;S.classe='agiata';S.casa={tipo:'genitori'};
 vivi(['Fratello']).forEach(f=>f.vivo=false);const fr=nuovaPersona('Fratello','F',48,S.cognome,{});
 vivi(['Madre','Padre']).forEach(p=>{p.vivo=false});coda.length=0;ereditaGenitori();
 ok('La casa dei genitori diventa un\'eredità da decidere',coda.some(q=>q.e.id==='eredita_casa'),coda.map(q=>q.e.id).join(','));
 const qE=coda.find(q=>q.e.id==='eredita_casa');if(qE){S.soldi=1e6;coda=[qE];next();const tx=document.querySelector('#shP').textContent;
   clicca(/liquidi|vai a vivere/);chiudi();ok('Tieni la casa e liquidi il fratello',S.casa.tipo==='proprieta'&&S.prop.length===1,tx.slice(0,100))}
 // 8. pensione contributiva senza lavoro e assegno sociale
 vita({anno:2000});S.eta=66;S.anno=2066;S.t=792;S.mese=S.meseNascita-1<0?11:S.meseNascita-1;S.contributi=25;S.montante=P(250000);S.lavoro=null;
 avanzaMesi(1);ok('A 67 anni con 25 anni di contributi la pensione arriva anche senza lavoro',S.pensione>0,eur(S.pensione/13)+' al mese');
 vita({anno:2000});S.eta=67;S.anno=2067;S.t=804;S.contributi=8;S.montante=P(40000);S.lavoro=null;S.pensione=0;
 const v2=[];bilancio(true).forEach(([n,x])=>v2.push(n));ok('Senza contributi sufficienti: assegno sociale',v2.includes('Assegno sociale'),v2.join(', '));
 // 9. NASpI e TFR
 vita({anno:2000});S.eta=35;S.anno=2035;S.t=420;assumi(LAVORI.find(j=>j.id==='imp'));S.lav48=new Array(48).fill(1);S.lavoro.tfr=P(15000);const s0=S.soldi;
 licenzia('Licenziamento di prova.');ok('TFR pagato e NASpI per 24 mesi',S.soldi>s0&&S.naspi&&S.naspi.mesi===24,S.naspi?eur(S.naspi.imp)+' al mese':'');
 const v3=[];bilancio(true).forEach(([n,x])=>v3.push(n+' '+Math.round(x)));ok('NASpI nel bilancio',v3.some(v=>/NASpI/.test(v)),v3.filter(v=>/NASpI|Assegno|Reddito/.test(v)).join('; '));
 // 10. unione civile per le coppie dello stesso sesso
 vita({anno:2000,sesso:'F'});S.eta=30;S.anno=2030;S.soldi=100000;const lei=nuovaPersona('Partner','F',30,null,{rapporto:90,conv:true});
 coda=[{e:EV.matrimonio,d:{p:lei}}];next();const lab=[...document.querySelectorAll('#shA button')].map(b=>b.textContent).join(' | ');
 ok('Unione civile, niente chiesa',/Unione civile/.test(lab)&&!/chiesa/.test(lab),lab.slice(0,120));chiudi();
 return {out,errs};
}
'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 400, 'height': 820})
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    r = pg.evaluate(JS)
    sys.stdout.reconfigure(encoding='utf-8')
    print('\n'.join(r['out']))
    print('errs', r['errs'], pe[:5])
    b.close()
