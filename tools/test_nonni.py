"""Fase 5.2 (ultimo blocco) — i nonni con la storia dell'epoca: una storia a testa secondo l'anno di nascita, il sesso e la regione del lato
(materno o paterno); si racconta in nonno_storie e ado_nonno_storia e torna al funerale. Poi N vite col pilota automatico.

    python tools/test_nonni.py        # prove + 40 vite
    python tools/test_nonni.py 80
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
 const nuova=(anno,citta,prov)=>{
   nuovaVita({sesso:'M',nome:'Prova',cognome:'Test',citta:citta||'Roma',prov:prov||'RM',anno:anno});
   S.eta=70;S.anno=anno+70;S.annoNascita=anno;S.t=70*12+6;S.mese=(S.meseNascita+6)%12;S.relazioni=[];S.gruppi=[];S.legami=[];S.fatti.cittaNascita=citta||'Roma';S.fatti.provNascita=prov||'RM';S.fatti.latiNonni={};coda.length=0;S.futuri.length=0;
 };
 const nonno=(sesso,nasc,cog)=>{const n=nuovaPersona('Nonno',sesso,S.anno-nasc,cog||null,{rapporto:70});return n};
 const apri=(id,d)=>{coda.push({e:EV[id],d:d||{}});next();return [...document.querySelectorAll('#shA button:not([disabled])')]};
 const chiudi=()=>{let g=0;while(!document.querySelector('#scrim').hidden&&g++<20){const b=document.querySelector('#shA button:not([disabled])');if(!b)break;b.click()}};
 // 1) ogni storia vale solo per i suoi anni di nascita, e i testi sono in ordine (niente undefined, NaN, segnaposto sbagliati, date fuori epoca)
 const REGS=['Lombardia','Piemonte','Veneto','Friuli-Venezia Giulia','Toscana','Marche','Lazio','Campania','Calabria','Sicilia','Puglia','Basilicata'];
 for(const s of STORIE_NONNI){
   for(let nasc=s.da;nasc<=s.a;nasc+=1){
     for(const m of [true,false]){
       if(s.sesso&&(s.sesso==='M')!==m)continue;
       for(const reg of REGS){for(const id of [0,1,2,3,4,5]){
         const c={p:{id,sesso:m?'M':'F'},nasc,reg,z:ZONA_REG[reg],nord:true,sudNato:false,m,id};
         if(s.w(c)<=0)continue;
         for(const k of ['x','q','f']){
           let t;try{t=s[k](c)}catch(e){ko.push(s.id+'.'+k+': '+e.message);continue}
           if(typeof t!=='string'||/undefined|NaN|\[object|\$\{/.test(t))ko.push(s.id+'.'+k+' testo rotto: '+t);
           if(k!=='x'&&/\{[A-Za-z]+\}/.test(t))ko.push(s.id+'.'+k+' segnaposto: '+t.slice(0,60));
           if(k==='x'&&!/^\{Tuo\} \{P\} /.test(t))ko.push(s.id+'.x non inizia con «{Tuo} {P}»');
           if(k==='x'&&/\{(?!Tuo\}|P\})[A-Za-z]+\}/.test(t))ko.push(s.id+'.x segnaposto: '+t.slice(0,60));
           if(annoTesto(t)>nasc+45)ko.push(s.id+'.'+k+': parola del '+annoTesto(t)+' per un nonno nato nel '+nasc);
           // nei testi delle nonne niente desinenze maschili (nel domandare «Gli» diventa «Le», come in testoStoria)
           if(!m&&/\b(fiero|ragazzo|rimasto|tornato|partito|nato|sposato|stanco|contento)\b|\bda bambino\b|\be lui\b/i.test(k==='q'?t.replace(/^Gli /,'Le '):t))ko.push(s.id+'.'+k+' (nonna): desinenza maschile: '+t.match(/\b(fiero|ragazzo|rimasto|tornato|partito|nato|sposato|stanco|contento)\b|\bda bambino\b|\be lui\b/i)[0]);
           // almeno 16 anni alla data di ogni fatto citato (tranne i ricordi da bambini: Mondiali 1982 ed euro 2002)
           if(!['mondiali82','euro'].includes(s.id))for(const y of (t.match(/\b(19\d\d|20\d\d)\b/g)||[]))if(+y-nasc<16)ko.push(s.id+'.'+k+': il fatto del '+y+' a '+(+y-nasc)+' anni (nato nel '+nasc+')');
           // e quando il testo dichiara l'età («Aveva N anni», «a N anni») dev'essere almeno 16
           for(const mm of t.matchAll(/(?:Aveva|, a) (\d+) anni/g))if(+mm[1]<16)ko.push(s.id+'.'+k+': età dichiarata '+mm[1]+' (nato nel '+nasc+')');
         }
       }}
     }
   }
 }
 // le date dei fatti: coerenza con l'età
 {const mb=metaId('charleroi');for(let nasc=1912;nasc<=1933;nasc++){const c={p:{id:2,sesso:'M'},nasc,reg:'Abruzzo',z:'Sud',nord:true,m:true,id:2};const t=STORIE_NONNI.find(s=>s.id==='belgio').x(c);const mm=t.match(/nel (\d{4}), a (\d+) anni/);
   if(!mm||+mm[1]<mb.da||+mm[1]>mb.a||+mm[2]<16||+mm[2]>45||+mm[1]-nasc!==+mm[2])ko.push('belgio '+nasc+': '+(mm&&mm[0]));
   if(!/Marcinelle|Bois du Cazier/.test(STORIE_NONNI.find(s=>s.id==='belgio').q(c)))ko.push('belgio: manca Marcinelle')}}
 {for(let nasc=1870;nasc<=1896;nasc++){const c={p:{id:0,sesso:'M'},nasc,reg:'Campania',z:'Sud',nord:true,m:true,id:0};const t=STORIE_NONNI.find(s=>s.id==='america').x(c);const mm=t.match(/nel (\d{4}) salì/);
   if(!mm||+mm[1]<1900||+mm[1]>1913||+mm[1]-nasc<16)ko.push('america '+nasc+': '+(mm&&mm[0]))}}
 // 2) la storia giusta per il nonno giusto
 const prova=(anno,citta,prov,sesso,nasc,id)=>{nuova(anno,citta,prov);const n=nonno(sesso,nasc);return storiaNonno(n)};
 let x=prova(1990,'Milano','MI','M',1920);if(!x)ko.push('nessuna storia');
 for(const [nasc,att] of [[1880,['guerra1','america','bottega']],[1912,['guerra2','belgio','america','germania','bottega','boom']],[1960,['fabbrica70','lavoro80','mondiali82','mutuo','euro','bottega']],[1985,['mutuo','euro','bottega']]]){
   const visti=new Set();for(let i=0;i<150;i++){nuova(nasc+50,'Milano','MI');const n=nonno(i%2?'M':'F',nasc);const s=storiaNonno(n);if(s)visti.add(s.id)}
   for(const v of visti)if(!att.includes(v))ko.push('nasc '+nasc+': storia '+v+' non prevista');
   if(visti.size<Math.min(att.length,3))ko.push('nasc '+nasc+': poche storie ('+[...visti]+')');
 }
 // chi nasce dopo il 2000 ha almeno 3 storie possibili, non solo la bottega
 {const vis=new Set();for(let a=2000;a<=2026;a+=2)for(let i=0;i<40;i++){nuova(a,'Roma','RM');const n=nonno(i%2?'M':'F',a-50-(i%12));const s=storiaNonno(n);if(s)vis.add(s.id)}
  if(vis.size<4)ko.push('nati dopo il 2000: solo '+[...vis])}
 // il terremoto: solo in Friuli e in Campania/Basilicata; la mezzadria al Centro; i nonni del Sud al Nord; la terra al Sud
 for(const [citta,prov,reg,id] of [['Udine','UD','Friuli-Venezia Giulia','terremoto'],['Avellino','AV','Campania','terremoto'],['Siena','SI','Toscana','mezzadria']]){
   let n=0;for(let i=0;i<120;i++){nuova(1975,citta,prov);const nn=nonno('M',id==='mezzadria'?1930:1950);const s=storiaNonno(nn);if(s&&s.id===id)n++}
   if(n<10)ko.push(id+' a '+citta+': '+n+'/120');}
 for(const [citta,prov] of [['Roma','RM'],['Milano','MI']]){let n=0;for(let i=0;i<120;i++){nuova(1975,citta,prov);const s=storiaNonno(nonno('M',1950));if(s&&['terremoto','mezzadria'].includes(s.id))n++}if(n)ko.push('terremoto/mezzadria a '+citta+': '+n)}
 {let n=0,t=0;for(let i=0;i<300;i++){nuova(1975,'Milano','MI');const nn=nonno('M',1930);const s=storiaNonno(nn);t++;if(s&&s.id==='mezzadria')n++}if(n)ko.push('mezzadria a Milano')}
 // 3) le regioni dei lati: di solito la tua; al Nord (nonni nati 1920-1945) un lato su quattro viene dal Sud
 {let lati=0,sud=0,incoerenti=0,altri=0;
  for(let i=0;i<400;i++){nuova(1975,'Milano','MI');const mM=nonno('M',1930,'Rossi'),mF=nonno('F',1932),pM=nonno('M',1928,S.cognome),pF=nonno('F',1930);
    const rr=[mM,mF,pM,pF].map(p=>{storiaNonno(p);return p.reg});
    if(rr[0]!==rr[1]||rr[2]!==rr[3])incoerenti++;
    for(const r of [rr[0],rr[2]]){lati++;if(sudReg(r))sud++;else if(r!=='Lombardia')altri++}}
  const q=sud/lati;if(q<.17||q>.33)ko.push('lati del Sud al Nord: '+(q*100).toFixed(0)+'% (atteso ~25%)');if(incoerenti)ko.push('i due nonni dello stesso lato hanno regioni diverse: '+incoerenti);if(altri)ko.push('regioni né tue né del Sud: '+altri)}
 {let sud=0;for(let i=0;i<200;i++){nuova(1975,'Napoli','NA');const n=nonno('M',1930);storiaNonno(n);if(n.reg!=='Campania')sud++}if(sud)ko.push('al Sud il lato cambia regione: '+sud)}
 {let sud=0;for(let i=0;i<200;i++){nuova(1975,'Milano','MI');const n=nonno('M',1890);storiaNonno(n);if(n.reg!=='Lombardia')sud++}if(sud)ko.push('nonni fuori dal 1920-1945 cambiano regione: '+sud)}
 {let sn=0,tn=0;for(let i=0;i<300;i++){nuova(1975,'Milano','MI');const n=nonno('M',1930);const s=storiaNonno(n);if(sudReg(n.reg)){tn++;if(s.id==='sud_nord')sn++}}if(tn&&sn<tn*.5)ko.push('nonni del Sud nati al Nord senza «dal Sud al Nord»: '+sn+'/'+tn)}
 {let n=0;for(let i=0;i<300;i++){nuova(1975,'Napoli','NA');const s=storiaNonno(nonno('M',1930));if(s&&s.id==='sud_nord')n++}if(n)ko.push('«dal Sud al Nord» per un giocatore nato al Sud: '+n)}
 // 4) una storia per nonno, e non cambia
 nuova(1975,'Milano','MI');const n1=nonno('M',1930);const a1=storiaNonno(n1).id;for(let i=0;i<20;i++)if(storiaNonno(n1).id!==a1)ko.push('la storia cambia');
 // 5) gli eventi: ogni storia, ogni scelta
 for(const s of STORIE_NONNI){
   const prep=()=>{nuova(1960+Math.min(40,Math.max(0,s.da-1920)),'Milano','MI');S.eta=12;S.anno=S.annoNascita+12;const n=nonno(s.sesso||'M',Math.min(s.a,Math.max(s.da,1930)));S.anno=Math.max(S.anno,n.nasc+50);n.storia=s.id;n.nasc=Math.min(s.a,Math.max(s.da,1930));n.reg=s.id==='terra_sud'?'Calabria':s.id==='sud_nord'?'Calabria':s.id==='mezzadria'?'Toscana':s.id==='terremoto'?'Campania':'Veneto';return n};
   for(let k=0;k<5;k++){const n=prep();const bs=apri('nonno_storie',{p:n});if(!bs.length){ko.push(s.id+': nonno_storie senza scelte');break}
     const tx=document.body.innerText;if(/\{[A-Za-z]+\}|undefined|NaN/.test(tx))ko.push(s.id+': nonno_storie testo con segnaposto: '+tx.slice(0,80));
     if(bs.length<3&&S.eta>=9)ko.push(s.id+': nonno_storie scelte '+bs.length);
     if(k<bs.length)bs[k].click();chiudi();coda.length=0}
   {const n=prep();S.eta=12;n.nv={raccontata:1};const bs=apri('nonno_storie',{p:n});if(!/ancora la sua storia/.test(document.body.innerText))ko.push(s.id+': secondo racconto');chiudi();coda.length=0;
    n.nv={raccontata:1,domande:1};apri('nonno_storie',{p:n});if(!/a memoria/.test(document.body.innerText))ko.push(s.id+': secondo racconto dopo le domande');chiudi();coda.length=0}
   for(let k=0;k<3;k++){const n=prep();S.eta=15;S.fatti['ev_ado_nonno_storia']=false;const bs=apri('ado_nonno_storia',{p:n});if(bs.length!==3)ko.push(s.id+': ado_nonno_storia scelte '+bs.length);
     if(/\{[A-Za-z]+\}|undefined|NaN/.test(document.body.innerText))ko.push(s.id+': ado_nonno_storia segnaposto');
     if(bs[k])bs[k].click();chiudi();coda.length=0;if(k<2&&!(n.nv&&n.nv.raccontata))ko.push(s.id+': ado non segna la storia raccontata')}
 }
 // 6) il funerale: una riga con la storia, e se l'avevi ascoltata lo dice
 for(const s of STORIE_NONNI){nuova(1975,'Milano','MI');S.eta=30;S.anno=S.annoNascita+30;const n=nonno(s.sesso||'M',Math.min(s.a,Math.max(s.da,1930)));n.storia=s.id;n.nasc=Math.min(s.a,Math.max(s.da,1930));n.nv={raccontata:1};
   S.log=[{t:S.t,anno:S.anno,mese:S.mese,eta:S.eta,righe:[]}];mortePersona(n);const rig=S.log[S.log.length-1].righe.map(r=>r.t).join(' | ');
   if(!/Al funerale di /.test(rig)||!/Tu sai da dove viene/.test(rig))ko.push(s.id+': funerale: '+rig.slice(0,120))}
 // nonno senza storia (nato altrove / morto da tempo) non rompe niente
 nuova(1975,'Milano','MI');const mo=nonno('M',1930);mo.vivo=false;mo.mortoT=S.t-100;S.log=[{t:S.t,anno:S.anno,mese:S.mese,eta:S.eta,righe:[]}];funeraleNonno(mo);
 const vecchio=nonno('F',1925);delete vecchio.nasc;delete vecchio.storia;if(!storiaNonno(vecchio))ko.push('un nonno di un vecchio salvataggio non ha storia');
 return {errs,ko:[...new Set(ko)].slice(0,40)};
}'''
JS_VITE = r'''(N)=>{
 const errs=[],ko=[];window.save=()=>{};window.toast=()=>{};window.render=()=>{};
 const risolvi=()=>{let g=0;while(sheetOpen&&g<40){g++;if(!AP.scegli()){sheetOpen=false;break}}};
 const ris=[];
 for(let v=0;v<N;v++){
  try{
   const x=pick(['M','F']);const cc=comuneCaso();
   nuovaVita({sesso:x,nome:pick(x==='M'?NOMI_M:NOMI_F),cognome:pick(COGNOMI),citta:cc.n,prov:cc.s,anno:1950+Math.floor(Math.random()*77)});
   let k=0;
   while(S.vivo&&k<1500&&S.eta<40){k++;AP.mese();risolvi();mese();risolvi();
     if(typeof INV!=='undefined'){const i=INV.controlla();if(i.length)ko.push(i.slice(0,2).map(z=>z.join(': ')).join(' | '))}}
   const nn=S.relazioni.filter(p=>p.ruolo==='Nonno');
   ris.push({anno:S.annoNascita,n:nn.length,con:nn.filter(p=>p.storia).length,raccontate:nn.filter(p=>p.nv&&p.nv.raccontata).length,ids:nn.filter(p=>p.storia).map(p=>p.storia),funerali:S.log.filter(b=>b.righe.some(r=>/Al funerale di/.test(r.t))).length});
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
    from collections import Counter
    c = Counter(i for x in V for i in x['ids'])
    print(f"{len(V)} vite fino ai 40 anni: nonni con storia {sum(x['con'] for x in V)}/{sum(x['n'] for x in V)} · raccontate {sum(x['raccontata'] if False else x['raccontate'] for x in V)} · funerali con la storia {sum(x['funerali'] for x in V)}")
    print('storie assegnate:', ', '.join(f'{k} {n}' for k, n in c.most_common()))
print('violazioni nelle vite:', v['ko'] or 'nessuna ✓')
print('errori JS:', (r['errs'] + pe + v['errs']) or 'nessuno')
sys.exit(1 if r['ko'] or v['ko'] or r['errs'] or pe or v['errs'] else 0)
