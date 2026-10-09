"""Prova i lavori: ogni requisito esiste davvero (facoltà, certificati, esami di Stato), ogni lavoro è raggiungibile,
le persone del gioco hanno mestieri distribuiti come in Italia, concorsi difficili ed elezioni funzionano.
Uso: python tools/test_lavori.py"""
import pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT/'dist'/'vitamia.html').as_uri()
JS = r'''
()=>{
 window.render=()=>{};window.save=()=>{};window.toast=()=>{};
 const out=[],errs=[];window.addEventListener('error',e=>errs.push(e.message));
 const ok=(n,c,info)=>out.push(`${c?'OK     ':'ERRORE '} ${n}${info!==undefined?' · '+info:''}`);
 const fac=new Set(FACOLTA.map(f=>f.n)),cert=new Set([...CORSI.map(c=>c.cert).filter(Boolean),...ITS.map(i=>i.cert),'OSS']),abil=new Set(ABILITAZIONI.map(a=>a.n));
 const dip=new Set(SUPERIORI.map(s=>s.n));
 // 1. ogni requisito esiste
 const rotti=[];
 const controlla=(id,q)=>{if(!q)return;(q.lau||[]).forEach(x=>{if(!fac.has(x))rotti.push(id+': facoltà '+x)});if(q.cert&&!cert.has(q.cert))rotti.push(id+': certificato '+q.cert);
   if(q.abil&&!abil.has(q.abil))rotti.push(id+': esame '+q.abil);if(q.dip&&!dip.has(q.dip))rotti.push(id+': diploma '+q.dip);(q.or||[]).forEach(x=>controlla(id,x))};
 for(const j of LAVORI){controlla(j.id,j.req);for(const k in (j.promo||{}))controlla(j.id+' promo',j.promo[k])}
 for(const a of ABILITAZIONI)if(!fac.has(a.lau))rotti.push('esame '+a.n+': facoltà '+a.lau);
 ok('Tutti i requisiti esistono (facoltà, certificati, esami)',!rotti.length,rotti.join('; '));
 // 2. ogni lavoro è raggiungibile da qualcuno con tutti i titoli giusti
 nuovaVita({sesso:'F',nome:'Anna',cognome:'Rossi',citta:'Milano',prov:'MI'});
 const base=JSON.stringify(S);const nonRagg=[];
 for(const j of LAVORI){
  S=JSON.parse(base);S.anno=2030;S.salute=90;S.intelligenza=90;S.patente=true;S.fedina=[];S.scuola.stato='finita';
  for(const k in S.abil)S.abil[k]=96;
  S.istr={liv:5,dip:'Liceo artistico',lauree:FACOLTA.map(f=>({n:f.n,liv:f.cu?'ciclo unico':'magistrale',voto:110})),cert:[...cert],abil:[...abil],master:true,dott:'Fisica',spec:'Cardiologia'};
  const r=j.req&&j.req.eta?j.req.eta:[18,99];S.eta=Math.max(18,r[0]);
  if(j.nascosto)S.fatti[j.nascosto]=1;
  const m=requisitiJob(j);if(m.length)nonRagg.push(j.id+': '+m.join(', '));
 }
 ok(`Tutti i ${LAVORI.length} lavori sono raggiungibili`,!nonRagg.length,nonRagg.join('; '));
 // 3. le persone del gioco: lavori diffusi come in Italia
 S=JSON.parse(base);const cnt={},donne={};
 for(let i=0;i<6000;i++){const ses=i%2?'F':'M';const id=lavoroPerNpc({sesso:ses,pers:{C:r(20,80)}});cnt[id]=(cnt[id]||0)+1;if(ses==='F')donne[id]=(donne[id]||0)+1}
 const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>`${nomeJob(JOB[k],0)} ${Math.round(v/60)}%`);
 ok('I lavori più diffusi tra le persone sono quelli comuni',['ope','imp','com'].every(k=>Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,6).map(x=>x[0]).includes(k)),top.join(', '));
 ok('Le badanti sono quasi tutte donne',(donne.badante||0)/(cnt.badante||1)>.8,Math.round(100*(donne.badante||0)/(cnt.badante||1))+'%');
 ok('Nessun notaio tra i primi 30',!Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,30).some(x=>x[0]==='notaio'));
 // 4. concorso difficile: il notaio quasi mai, l'impiegato comunale spesso
 const pConc=(j,giuste)=>Math.max(.02,Math.min(.9,(.06+giuste*.24+.05)*(j.cdiff||1)));
 ok('Concorso da notaio molto più difficile',pConc(JOB.notaio,3)<.2&&pConc(JOB.comu,3)>.7,`3 risposte giuste: notaio ${Math.round(pConc(JOB.notaio,3)*100)}%, comunale ${Math.round(pConc(JOB.comu,3)*100)}%`);
 // 5. elezioni: si apre la candidatura, con un costo
 S=JSON.parse(base);S.eta=40;S.anno=2040;S.soldi=1e5;S.fama=30;sheetOpen=false;
 candidati('poli');const t=document.querySelector('#shT').textContent,bt=[...document.querySelectorAll('#shA button')].map(b=>b.textContent).join(' | ');
 ok('Politica: ci si candida alle elezioni',t==='Ti candidi?'&&/Candidati/.test(bt),bt);
 // 6. RAL d'ingresso (prezzi di oggi) dei lavori nuovi
 const nuovi=['colf','badante','bracc','idra','elet','mecc','pane','camion','cass','puli','segr','este','edu','maes','cara','post','taxi','hostess','pilota','vet','dent','fisio','notaio','magis','ds','poli'];
 S.mondo.ip=1;out.push('RAL d\'ingresso: '+nuovi.map(k=>`${nomeJob(JOB[k],0)} ${Math.round(stipLiv(JOB[k],0)/1000)}k`).join(', '));
 // 7. contratti all'assunzione: tanti a termine da giovani, meno dopo
 const quote=(eta)=>{const c={};S=JSON.parse(base);S.eta=eta;for(let i=0;i<2000;i++){const t=contrattoIniziale(JOB.imp,0).t;c[t]=(c[t]||0)+1}return Object.entries(c).map(([k,v])=>k+' '+Math.round(v/20)+'%').join(', ')};
 const q25=quote(25),q45=quote(45);
 ok('Contratti all\'assunzione: a 25 anni più a termine che a 45',parseInt((q25.match(/det (\d+)/)||[0,0])[1])>parseInt((q45.match(/det (\d+)/)||[0,0])[1]),`25 anni: ${q25} · 45 anni: ${q45}`);
 // 8. a termine: proroghe fino a 24 mesi, poi stabilizzazione o fine
 let fini=0,ind=0,mesiMax=0;
 for(let v=0;v<300;v++){S=JSON.parse(base);S.eta=28;S.t=336;assumi(JOB.imp);S.lavoro.contratto={t:'det',fine:S.t+6,mesi:0,pror:0};S.lavoro.perf=60;let m=0;
  while(S.lavoro&&S.lavoro.contratto.t==='det'&&m<60){m++;S.t++;meseContratto()}
  if(!S.lavoro)fini++;else if(S.lavoro.contratto.t==='ind')ind++;mesiMax=Math.max(mesiMax,m)}
 ok('Un contratto a termine non dura oltre 24 mesi più l\'ultima proroga',mesiMax<=36,`stabilizzati ${Math.round(ind/3)}%, a casa ${Math.round(fini/3)}%, durata massima ${mesiMax} mesi`);
 // 9. partita IVA: niente NASpI né TFR, netto paragonabile a uno stipendio
 S=JSON.parse(base);S.eta=35;S.t=420;S.lav48=new Array(48).fill(1);assumi(JOB.avv);const pv=isPiva(S.lavoro);licenzia('prova');
 ok('Avvocato con partita IVA: alla fine niente NASpI',pv&&!S.naspi);
 out.push(`Netto annuo su 30.000 € lordi: dipendente ${eur(netto(30000))}, partita IVA (primi 5 anni) ${eur(nettoPiva(30000,{contratto:{da:S.t}}))}`);
 // 10. part-time: ore e stipendio al 60%
 S=JSON.parse(base);S.eta=35;assumi(JOB.imp);S.lavoro.contratto={t:'ind'};const h0=oreLavoro(),l0=ralEff(S.lavoro);S.lavoro.ptv=true;
 ok('Part-time: ore e stipendio al 60%',oreLavoro()===Math.round(h0*.6)&&Math.abs(ralEff(S.lavoro)-l0*.6)<1,`${h0} → ${oreLavoro()} ore`);
 // 11. divario: le donne assunte con circa il 4% in meno a parità di lavoro
 const media=ses=>{let t=0;for(let i=0;i<400;i++){S=JSON.parse(base);S.sesso=ses;S.eta=30;assumi(JOB.imp);t+=S.lavoro.stip}return t/400};
 const gm=media('M'),gf=media('F');ok('Stipendio d\'ingresso donne circa 4% più basso',gf<gm&&gf>gm*.93,`${Math.round((1-gf/gm)*100)}%`);
 // 12. la mamma che lavora: congedo, poi la scelta del rientro; il papà: il congedo parentale
 S=JSON.parse(base);S.sesso='F';S.eta=32;S.t=384;assumi(JOB.imp);S.lavoro.contratto={t:'ind'};
 const pa=nuovaPersona('Coniuge','M',33,null,{rapporto:80,conv:true,nozze:S.t-40});S.gravidanza={pid:pa.id,t0:S.t-9,parto:S.t,gem:false,ses:'F',madreEta:32,tu:true,ok:1,eco:1};
 coda.length=0;meseFamiglia();const c0=S.fatti.congedo-S.t;let rientro=false;for(let i=0;i<6;i++){S.t++;coda.length=0;meseItalia();if(coda.some(q=>q.e.id==='rientro_lavoro'))rientro=true}
 ok('Mamma: 5 mesi di congedo, poi la scelta del rientro',c0===5&&rientro);
 S=JSON.parse(base);S.sesso='M';S.eta=32;S.t=384;assumi(JOB.imp);S.lavoro.contratto={t:'ind'};
 const ma=nuovaPersona('Coniuge','F',31,null,{rapporto:80,conv:true,nozze:S.t-40,stato:'lavora'});S.gravidanza={pid:ma.id,t0:S.t-9,parto:S.t,gem:false,ses:'M',madreEta:31,tu:false,ok:1,eco:1};
 coda.length=0;meseFamiglia();ok('Papà: la scelta del congedo parentale',coda.some(q=>q.e.id==='congedo_padre'));
 return {out,errs};
}
'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 400, 'height': 820})
    pe = []; pg.on('pageerror', lambda e: pe.append(str(e)))
    pg.goto(GAME); pg.wait_for_timeout(300)
    r = pg.evaluate(JS); b.close()
sys.stdout.reconfigure(encoding='utf-8')
print('\n'.join(r['out'])); print('errs', r['errs'], pe[:3])
