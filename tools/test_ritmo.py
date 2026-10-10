"""Prova degli eventi della Fase 1 (ritmo): calendario (cal_), incontri (inc_) e, con un prefisso, qualsiasi altro gruppo.
Per ogni evento prepara la situazione giusta (età, partner, neonato, lutto, nipoti, cane, lavoro a turni…),
lo apre da maschio e da femmina e clicca ogni risposta. Segnala errori JS e testi non risolti.

    python tools/test_ritmo.py            # cal_ e inc_
    python tools/test_ritmo.py pic_ -v    # un altro prefisso, stampando testi ed esiti
"""
import pathlib, sys, json
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
PRE = [a for a in sys.argv[1:] if not a.startswith('-')] or ['cal_', 'inc_']
VERB = '-v' in sys.argv
JS = r'''
(PRE)=>{
 const errs=[];window.addEventListener('error',e=>errs.push(e.message));
 window.save=()=>{};
 document.querySelector('#btnRnd').click();
 const base=JSON.stringify(S);
 const out=[],bad=[],salt=new Set();
 const BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
 // età di prova: dentro i limiti dell'evento (gli eventi «link» non ne hanno: si usa quella indicata qui)
 const ETA={cat_ritorno:62,cat_ritorno2:63,cat_ritorno3:64,cat_canna:45,cat_canna2:46,cat_canna3:46,cat_capanna4:30,lettera_ritorno:26,lettera_promessa:31,cat_tesi:23,cat_tesi2:23,cat_tesi3:24,cat_ospite:16,cat_ospite2:16,cat_ospite3:19,mez_figlio_estero:52,mez_figlio_affitto:58,mez_gen_patente:55,mez_gen_casa:55,mez_gen_smarrito:52,mez_capo_giovane:48,mez_menopausa:50,mez_prostata:58,cal_natale_ragazzi:15,cal_lavoretto:16,cal_ferie_amici:20,cal_natale_nonno:66,cal_ferie_pensione:68,cal_natale_figlio:32,cal_ferie_bimbo:32,cal_ferie_grandi:48,
   inc_parco:4,inc_quartiere:66,inc_genitori:38};
 const ids=Object.keys(EV).filter(id=>PRE.some(p=>id.startsWith(p)));
 for(const id of ids){
  const e=EV[id];
  for(const ses of ['M','F'])for(let i=0;i<7;i++){
   S=JSON.parse(base);coda.length=0;S.sesso=ses;S.attrazione=ses==='M'?'F':'M';
   let eta=ETA[id]||(e.min!==undefined?Math.max(e.min,Math.min(e.max,e.min+6)):35);
   if(id==='inc_scuola')eta=[8,16,21][i%3];
   S.eta=eta;S.anno=S.annoNascita+eta;S.soldi=60000;
   if(eta>=6&&eta<11)S.scuola.stato='elementari';else if(eta<14&&eta>=11)S.scuola.stato='medie';else if(eta<19&&eta>=14)S.scuola.stato='superiori';else if(eta>=19&&eta<24)S.scuola.stato=id==='inc_scuola'?'universita':'finita';
   if(eta>=19&&id!=='inc_scuola'){S.scuola.stato='finita';S.casa={tipo:'affitto'};assumi(LAVORI.find(j=>j.id==='inf'))}
   if(eta>=67){S.lavoro=null;S.pensione=P(16000)}
   S.relazioni.forEach(p=>{if(['Madre','Padre'].includes(p.ruolo))p.eta=eta+30;if(p.ruolo==='Nonno')p.eta=eta+60});
   if(eta>=60)S.relazioni.filter(p=>['Madre','Padre','Nonno'].includes(p.ruolo)).forEach(p=>{p.vivo=false;p.mortoT=S.t-30});
   const amico=nuovaPersona('Amico',ses,eta,null,{rapporto:70});nuovaPersona('Amico',ses==='M'?'F':'M',eta,null,{rapporto:60});
   S.animali.push(initAnimale({t:'Cane',nome:'Argo',eta:3,max:14}));
   S.routine.hobby=3;S.routine.uscite=3;S.routine.volont=2;S.routine.social=4;S.fatti.ferieAbit='mare';S.fatti.cittaNascita='Lecce';
   let p=null;const d={_fut:1};
   const partner=()=>{const x=nuovaPersona(eta>=30?'Coniuge':'Partner',ses==='M'?'F':'M',eta,null,{rapporto:70,conv:true,intim:60,pass:60,imp:60});nuovaPersona('Suocero','F',eta+30,null,{famDi:x.id});return x};
   if(/coppia/.test(id))p=partner();
   if(/figlio|bimbo/.test(id)){partner();p=nuovaPersona('Figlio',i%2?'F':'M',0,S.cognome,{rapporto:90})}
   if(/grandi/.test(id)){partner();p=nuovaPersona('Figlio','F',16,S.cognome,{rapporto:70})}
   if(/genitori/.test(id)){partner();nuovaPersona('Figlio','M',7,S.cognome,{rapporto:80})}
   if(/nonno/.test(id)){const f=nuovaPersona('Figlio','M',36,S.cognome,{rapporto:70,fuori:true});p=nuovaPersona('Nipote',i%2?'F':'M',2,S.cognome,{rapporto:80,gen:f.id})}
   if(/lutto/.test(id)){const m=S.relazioni.find(x=>x.ruolo===(i%2?'Madre':'Padre'));if(m){m.vivo=false;m.mortoT=S.t-4;d.m=m}}
   if(/tramite/.test(id))p=amico;
   const prop=()=>{const c={id:S.nextId++,tipo:'Bilocale',valore:200000};S.prop.push(c);S.casa={tipo:'proprieta',pid:c.id}};
   if(/^cat_ristrutt|^cat_vicina/.test(id))prop();
   if(/^cat_rudere/.test(id)){S.soldi=200000;S.prop.push({id:S.nextId++,tipo:'Casale in collina',valore:40000,stato:20,rudere:1})}
   if(/^cat_bottega/.test(id)){const n=S.relazioni.find(x=>x.ruolo==='Nonno');if(n)n.vivo=false;else nuovaPersona('Nonno','M',90,S.cognome,{vivo:false})}
   if(/^cat_tesi/.test(id)){S.scuola.stato='universita';S.scuola.anni=1;S.lavoro=null}
   if(/^cat_crociato|^cat_maratona/.test(id))S.routine.sport=4;
   if(/^cat_randagio3/.test(id))S.animali.push(initAnimale({t:'Cane',nome:'Briciola',eta:3,max:14}));
   if(/^cat_randagio$/.test(id))S.animali=[];
   if(/^cat_ospite$/.test(id)){S.casa={tipo:'genitori'};S.classe='media'}
   if(/^cat_primo_amore3/.test(id)&&i%2)partner();
   if(/^cat_sogno$/.test(id))S.fatti.viaggi=0;
   if(/^cat_orto$/.test(id)){S.citta='Bologna';S.prov='BO'}
   if(/^cat_romanzo$/.test(id))S.pers.O=75;
   if(id==='cat_romanzo3'||id==='cat_teatro3'||id==='cat_crociato3'||id==='cat_tesi2'||id==='cat_sogno3')d.x=['editore','self','prot','cam','bravo','famoso','rinviato','subito'][i%8];
   const CHI={mez_figlio_superiori:['Figlio',13],mez_figlio_camera:['Figlio',16],mez_figlio_coming_out:['Figlio',18],mez_figlio_paghetta:['Figlio',13],mez_figlio_fidanzato:['Figlio',17],mez_figlio_estero:['Figlio',26],mez_figlio_affitto:['Figlio',28],mez_figlio_maturita:['Figlio',18],
     mez_gen_caduta:['Madre',80],mez_gen_patente:['Padre',83],mez_gen_smarrito:['Madre',82],mez_gen_casa:['Padre',84],mez_gen_ottanta:['Madre',80],cat_ritorno:['Figlio',33],cat_ritorno2:['Figlio',34],cat_ritorno3:['Figlio',35],cat_canna:['Figlio',15],cat_canna2:['Figlio',16],cat_canna3:['Figlio',16],cat_amico_buio:['Amico',40],cat_amico_buio2:['Amico',40],cat_amico_buio3:['Amico',40]};
   if(CHI[id]){const [ru,et]=CHI[id];p=nuovaPersona(ru,i%2?'F':'M',et,S.cognome,{rapporto:60});if(ru==='Figlio'){p.fuori=id==='mez_figlio_affitto'||id==='cat_ritorno'||id==='cat_ritorno3';p.orient='omo'}if(id==='mez_gen_casa')p.coppia='vedovo'}
   if(/pensione/.test(id))nuovaPersona('Nipote','M',6,null,{rapporto:80});
   if(/sola/.test(id)){S.fatti.fineCoppiaT=S.t-6}
   if(id==='cal_ferie_soldi'){d.x='mare';S.soldi=100}
   if(id==='propositi')d.m=['forma','schermi','soldi','studio',null][i%5];
   if(p)d.p=p;
   if(id.startsWith('inc_'))d.x=id.slice(4);
   const SETUP={bim_catechismo:()=>{S.fatti.famRel=1},bim_ciclo:()=>{S.sesso='F'},bim_voce:()=>{S.sesso='M'},rag_terza_media:()=>{S.scuola.stato='medie'},
     rag_motorino_rubato:()=>{S.veicoli.push({id:S.nextId++,n:'Scooter 50',valore:1800,stato:100,costo:300})},rag_ripetizioni:()=>{S.scuola.voto=70},rag_debito:()=>{S.scuola.voto=40},
     rag_agonismo:()=>{S.abil.sport=60},mez_tassi:()=>{S.anno=2022;const c={id:S.nextId++,tipo:'Bilocale',valore:200000,mutuo:{residuo:150000,rata:9000,anni:20}};S.prop.push(c);S.casa={tipo:'proprieta',pid:c.id}},
     mez_condominio:()=>{const c={id:S.nextId++,tipo:'Bilocale',valore:200000};S.prop.push(c);S.casa={tipo:'proprieta',pid:c.id}},
     mez_bolletta:()=>{S.anno=2022},mez_menopausa:()=>{S.sesso='F'},mez_prostata:()=>{S.sesso='M'},mez_insonnia:()=>{S.bis.stress=70},mez_bilancia:()=>{S.bis.forma=30},mez_ponte:()=>{S.bis.stress=60},
     mez_domenica:()=>{S.fatti.capoCattivo=1},mez_sandwich:()=>{nuovaPersona('Figlio','M',6,S.cognome,{});S.relazioni.filter(x=>['Madre','Padre'].includes(x.ruolo)).forEach(x=>{x.eta=80;x.vivo=true})},
     mez_routine:()=>{const c=nuovaPersona('Coniuge',S.sesso==='M'?'F':'M',eta,null,{conv:true,intim:50,pass:50,imp:50});c.nozze=S.t-120},
     mez_amici_figli:()=>{nuovaPersona('Figlio','F',3,S.cognome,{})},
     bim_castello_letto:()=>{nuovaPersona('Fratello','M',Math.max(1,eta-2),S.cognome,{rapporto:70})},rag_presenta:()=>{nuovaPersona('Partner',S.sesso==='M'?'F':'M',eta,null,{rapporto:60})}};
   if(SETUP[id])SETUP[id]();
   if(/fratello_grande/.test(id))nuovaPersona('Fratello','F',eta+4,S.cognome,{rapporto:70});
   if(!e.link&&e.cond&&!e.cond(d)){salt.add(id);break}
   if(e.auto){for(let k=0;k<4;k++){const res=scegli(e.auto,Object.assign({},d));const t=(res&&res[0])||'';const m=t.match(BAD);if(m)bad.push(`${id} [${ses}] auto: «${m[0]}» in ${t.slice(0,100)}`);out.push(`${id} [${ses}, ${eta} anni] (automatico)
   = ${t}`)}break}
   coda.push({e,d});next();
   const bs=[...document.querySelectorAll('#shA button:not([disabled])')];
   if(i>=bs.length)break;
   const tit=document.querySelector('#shT').textContent,txt=document.querySelector('#shP').textContent,lab=bs[i].textContent;
   bs[i].click();
   const res=document.querySelector('#shP').textContent;
   for(const [dove,t] of [['titolo',tit],['testo',txt],['scelta',lab],['esito',res]]){const m=t.match(BAD);if(m)bad.push(`${id} [${ses}] ${dove}: «${m[0]}» in ${t.slice(0,100)}`)}
   out.push(`${id} [${ses}, ${eta} anni] ${tit} | ${txt}\n   → ${lab}\n   = ${res}`);
   let g=0;while(!document.querySelector('#scrim').hidden&&g++<20){const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}
  }
 }
 return {errs,out,bad,n:ids.length,salt:[...salt]};
}
'''
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 400, 'height': 820})
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    r = pg.evaluate(JS, PRE)
    b.close()
sys.stdout.reconfigure(encoding='utf-8')
if VERB: print('\n'.join(r['out']))
print(f"{r['n']} eventi, {len(r['out'])} risposte provate")
print('saltati (condizione falsa nella prova):', r['salt'] or 'nessuno')
print('testi non risolti:', r['bad'] or 'nessuno')
print('errori JS:', r['errs'] + pe or 'nessuno')
sys.exit(1 if r['bad'] or r['errs'] or pe else 0)
