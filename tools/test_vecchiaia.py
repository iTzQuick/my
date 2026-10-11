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
   S.relazioni=[];S.gruppi=[];S.legami=[];coda.length=0;S.futuri.length=0;
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
 // 6) nipoti con una vita propria
 nuova(65);S.soldi=P(50000);let fi=pers('Figlio',35,'F',80);fi.coppia='sposato';let nn=nasceNipote(fi);
 if(nn.ruolo!=='Nipote'||nn.gen!==fi.id||nn.eta!==0)ko.push('nasceNipote');
 if(!coda.some(x=>x.e===EV.fig_nipote))ko.push('nasceNipote non apre fig_nipote');
 coda.length=0;
 for(const stile of ['presente','richiesta','distante']){nuova(65);fi=pers('Figlio',35,'F',80);nn=nasceNipote(fi);coda.length=0;const b=apri('fig_nipote',{p:fi,x:{n:nn.id}});
   const i=['presente','richiesta','distante'].indexOf(stile);if(b.length!==3){ko.push('fig_nipote: '+b.length+' scelte');continue}b[i].click();chiudi();
   if(S.fatti.nonnoStile!==stile)ko.push('nonnoStile '+stile+' -> '+S.fatti.nonnoStile);if(!S.fatti.primoNipote)ko.push('momento primoNipote')}
 const EVN=[['nip_dai_nonni',6],['nip_comunione',9],['nip_tema',9],['nip_segreto',15],['nip_diciotto',18],['nip_soldi',22],['nip_laurea',24],['nip_nozze',30],['nip_pronipote',32]];
 for(const [id,eta] of EVN){
   for(let i=0;i<3;i++){nuova(75);S.soldi=P(50000);fi=pers('Figlio',45,'F',80);const n=nuovaPersona('Nipote',i===1?'M':'F',eta,null,{rapporto:75,gen:fi.id});if(n.id%3===0)n.id++;
     const e=EV[id];if(!e){ko.push(id+' manca');break}
     if(!e.link){if(!(e.pc?e.pc(n):true))ko.push(id+': pc falso a '+eta+' anni (rapporto '+n.rapporto+')');if(S.eta<e.min||S.eta>e.max)ko.push(id+': età '+S.eta+' fuori da min/max')}
     const bs=apri(id,{p:n});if(bs.length<1){ko.push(id+': senza scelte');continue}
     for(let k=0;k<bs.length;k++){nuova(75);S.soldi=P(50000);fi=pers('Figlio',45,'F',80);const m=nuovaPersona('Nipote',i===1?'M':'F',eta,null,{rapporto:75,gen:fi.id});const b2=apri(id,{p:m});if(b2[k])b2[k].click();chiudi()}
     const n2=nuovaPersona('Nipote','F',eta,null,{rapporto:75,gen:fi.id});apri(id,{p:n2});if(!['nip_diciotto'].includes(id)&&!nv(n2,id.replace('nip_','').slice(0,4)==='dai_'?'x':{nip_comunione:'com',nip_tema:'tema',nip_segreto:'segr',nip_soldi:'soldi',nip_laurea:'lau',nip_nozze:'noz',nip_pronipote:'pron'}[id]||'x')&&id!=='nip_dai_nonni')ko.push(id+': non segna p.nv');chiudi()}
 }
 // a 18 anni compare nip_diciotto, una volta sola
 nuova(75);fi=pers('Figlio',45,'F',80);nn=nuovaPersona('Nipote','F',18,null,{rapporto:75,gen:fi.id});coda.length=0;annoNipote(nn);annoNipote(nn);if(coda.filter(x=>x.e===EV.nip_diciotto).length!==1)ko.push('nip_diciotto: '+coda.length);
 // segreto detto ai genitori: il nipote si arrabbia, il genitore no
 nuova(75);fi=pers('Figlio',45,'F',60);nn=nuovaPersona('Nipote','M',15,null,{rapporto:80,gen:fi.id});let b3=apri('nip_segreto',{p:nn});b3[2].click();chiudi();
 if(!(nn.rapporto<70)||!(fi.rapporto>=60))ko.push('segreto svelato: nipote '+nn.rapporto+' figlio '+fi.rapporto);
 // un figlio senza coppia non ha nipoti; con coppia, nel tempo, sì
 nuova(60);fi=pers('Figlio',30,'F',80);fi.coppia='sposato';fi.pId=undefined;let ha=0;for(let i=0;i<3000&&!ha;i++){S.t++;vitaNpc(fi);if(S.relazioni.some(p=>p.ruolo==='Nipote'))ha=1}
 if(!ha)ko.push('un figlio sposato non ha mai nipoti in 250 anni');
 // 7) circolo, volontariato, solitudine
 const prova=(id,setup,d)=>{let n=1;for(let k=0;k<n;k++){setup();const bs=apri(id,d?JSON.parse(JSON.stringify(d)):{});n=bs.length;if(!n){ko.push(id+': nessuna scelta');return}if(bs[k])bs[k].click();chiudi();coda.length=0}};
 const conCirc=()=>{nuova(70);iscriviCircolo(CIRCOLI[0])};
 const conVol=()=>{nuova(70);iniziaVol(VOL[0])};
 for(const c of CIRCOLI){nuova(70);iscriviCircolo(c);const soci=sociCircolo();if(!S.circolo||!circoloAttivo()||soci.length<3||soci.length>4)ko.push('iscrizione '+c.id+': '+soci.length+' soci');
   if(soci.some(p=>p.ruolo!=='Conoscente'||p.eta<62))ko.push('soci del circolo '+c.id);if((S.routine.amici||0)<3)ko.push('il circolo toglie ore agli amici: '+S.routine.amici)}
 prova('circ_iscrizione',()=>nuova(70));
 nuova(70);let bi=apri('circ_iscrizione');if(bi.length<5)ko.push('circ_iscrizione: '+bi.length+' scelte');chiudi();
 nuova(1960+70-70,1962);let bu=apri('circ_iscrizione');if(bu.some(b=>/università/.test(b.textContent)))ko.push('università della terza età prima del 1975');chiudi();
 prova('circ_torneo',conCirc);prova('circ_presidente',conCirc);prova('circ_sedia',conCirc,{x:{nome:'Gino'}});prova('circ_chiude',conCirc);
 conCirc();S.circolo.chiude=1;apri('circ_chiude');chiudi();
 // i soci diventano amici, il circolo non sbiadisce, chi muore apre «un posto libero» (al massimo ogni 18 mesi)
 conCirc();const soci0=sociCircolo().map(p=>p.id);for(let i=0;i<60;i++){vecchiaiaMese()}
 if(!sociCircolo().some(p=>p.ruolo==='Amico'))ko.push('nessun socio è diventato amico in 5 anni');
 conCirc();S.futuri.length=0;coda.length=0;let sc=sociCircolo();mortePersona(sc[0]);if(!coda.some(x=>x.e===EV.circ_sedia))ko.push('morte di un socio: circ_sedia');
 coda.length=0;mortePersona(sc[1]);if(coda.some(x=>x.e===EV.circ_sedia))ko.push('due «posti liberi» di fila');
 conCirc();for(const p of sociCircolo())p.vivo=false;S.circolo.dal=S.t-48;let ch=0;for(let i=0;i<300;i++){coda.length=0;S.circolo.chiude=0;vecchiaiaEventi();if(coda.some(x=>x.e===EV.circ_chiude)){ch=1;break}}if(!ch)ko.push('circolo senza soci: non chiude mai');
 // volontariato
 prova('vol_inizio',()=>{nuova(70);S.karma=60});
 nuova(70);const haAuto0=volPossibili().some(v=>v.id==='trasporto');if(haAuto0&&!haAuto())ko.push('trasporto senza auto');
 conVol();if(!volAttivo()||S.routine.volont<1)ko.push('iniziaVol: ore '+S.routine.volont);
 prova('vol_storia',conVol);prova('vol_stanco',conVol);prova('vol_targa',conVol);prova('vol_giovane',conVol);
 // solitudine
 const sola=()=>{nuova(70);S.bis.soc=10;pers('Figlio',40,'M',70);for(let i=0;i<3;i++){const a=pers('Amico',70,'M');a.vivo=false}};
 prova('sol_silenzio',sola);prova('sol_agenda',sola);prova('sol_animale',()=>{sola();S.animali=[]});
 prova('sol_anniversario',sola,{x:{nome:'Anna',anni:2}});
 sola();if(!/sol_agenda/.test(JSON.stringify(Array.from({length:80},()=>eventoSolitudine()))))ko.push('sol_agenda non compare con 3 amici morti');
 nuova(40);if(eventoSolitudine()!=='solitudine')ko.push('sotto i 65 anni resta l\'evento di prima');
 // a cadenza: la solitudine non si ripete più di 10 volte
 nuova(65);S.fatti.desEta=99;S.fatti.testEta=99;let ns=0;
 for(let i=0;i<12*35;i++){S.t++;S.eta=65+Math.floor(i/12);S.bis.soc=10;S.fatti.soloN=9;S.fatti.stressAlto=0;coda.length=0;emergenti();if(coda.some(x=>['sol_silenzio','sol_agenda','sol_animale','solitudine'].includes(x.e.id)))ns++}
 if(ns>10)ko.push('solitudine: '+ns+' volte in 35 anni (massimo 10)');if(ns<4)ko.push('solitudine: solo '+ns+' volte in 35 anni');
 // vedovo: anniversario nel mese giusto, al massimo 6
 nuova(70);const vv=pers('Coniuge',70,'F');mortePersona(vv);vv.mortoT=S.t;let an=0;for(let i=0;i<12*10;i++){S.t++;coda.length=0;if(vecchiaiaEventi()&&coda.some(x=>x.e===EV.sol_anniversario))an++}
 if(an!==6)ko.push('sol_anniversario '+an+' volte invece di 6');
 // proposte annuali: circolo e volontariato a chi è libero tra 60 e 80 anni
 let c1=0,v1=0;for(let i=0;i<400;i++){nuova(66);S.lavoro=null;S.pensione=1000;S.karma=60;S.bis.soc=30;vecchiaiaAnno2();if(coda.some(x=>x.e===EV.circ_iscrizione))c1++;if(coda.some(x=>x.e===EV.vol_inizio))v1++}
 if(c1<30||v1<10)ko.push('proposte annuali: circolo '+c1+'/400, volontariato '+v1+'/400');
 nuova(50);S.lavoro=null;vecchiaiaAnno2();if(coda.length)ko.push('circolo a 50 anni');
 // 8) viaggi da anziano
 const sano=()=>{nuova(70);S.salute=80;S.soldi=P(60000)};
 nuova(70);S.salute=80;if(!viaggiabile())ko.push('viaggiabile a 70 anni e 80 di salute');S.salute=30;if(viaggiabile())ko.push('viaggiabile con salute 30');S.salute=80;S.fatti.viaggiFine=1;if(viaggiabile())ko.push('viaggiabile dopo viaggiFine');
 nuova(55);S.salute=90;if(viaggiabile())ko.push('viaggiabile a 55 anni');
 prova('vi_gruppo',()=>{sano();pers('Amico',70,'M',80)});prova('vi_gruppo',sano);
 prova('vi_crociera',()=>{sano();pers('Partner',68,'F',80);S.relazioni[0].conv=true;S.relazioni[0].ruolo='Coniuge';pers('Nipote',12,'F',80)});
 prova('vi_crociera',sano);
 if(annoEvento(EV.vi_crociera)<1980)ko.push('crociera senza dal:1980');
 prova('vi_radici',()=>{sano();S.fatti.cittaNascita='Bari';S.fatti.provNascita='BA';S.citta='Roma';pers('Figlio',45,'F')});
 prova('vi_radici',()=>{sano();S.fatti.esteroStorico={id:'colonia',n:'Colonia',t:0,a:100};pers('Nipote',12,'F',80)});
 sano();S.fatti.cittaNascita='Bari';S.citta='Roma';if(!EV.vi_radici.cond())ko.push('vi_radici dovrebbe essere possibile');
 S.fatti.desiderio={id:'luogo',testo:'x',t:0};if(EV.vi_radici.cond())ko.push('vi_radici con il desiderio «luogo» già scelto');
 sano();S.fatti.cittaNascita=S.citta;if(EV.vi_radici.cond())ko.push('vi_radici senza nessuna radice altrove');
 {let k=0;for(let i=0;i<3;i++){sano();fi=pers('Figlio',45,'F',80);const n=nuovaPersona('Nipote','F',15,null,{rapporto:75,gen:fi.id});const bs=apri('vi_nipote',{p:n});if(bs.length!==3)ko.push('vi_nipote: '+bs.length+' scelte');if(bs[i])bs[i].click();chiudi();if(!nv(n,'viag'))ko.push('vi_nipote non segna p.nv');if(i<2&&!S.fatti.viaggiAnz)ko.push('vi_nipote non conta il viaggio')}
  sano();S.fatti.nonnoStile='distante';fi=pers('Figlio',45,'F',80);const nd=nuovaPersona('Nipote','F',15,null,{rapporto:75,gen:fi.id});if(EV.vi_nipote.pc(nd)||(EV.vi_nipote.cond&&EV.vi_nipote.cond({})&&EV.vi_nipote.pc(nd)))ko.push('vi_nipote con un nonno distante')}
 for(let i=0;i<3;i++){sano();const c=pers('Coniuge',72,'F',80);c.nozze=S.t-600;if(!EV.vi_nozze_oro.pc(c))ko.push('vi_nozze_oro pc');const bs=apri('vi_nozze_oro',{p:c});if(bs.length!==3)ko.push('vi_nozze_oro: '+bs.length);if(bs[i])bs[i].click();chiudi()}
 sano();{const c=pers('Coniuge',72,'F',80);c.nozze=S.t-590;if(EV.vi_nozze_oro.pc(c))ko.push('nozze d\'oro a 49 anni e 10 mesi')}
 prova('vi_stop',()=>{sano();S.fatti.viaggiAnz=3});
 // l'ultimo viaggio: una volta, solo se hai viaggiato
 nuova(72);S.salute=30;S.fatti.viaggiAnz=2;S.fatti.testEta=99;S.fatti.desEta=99;coda.length=0;vecchiaiaAnno();if(!coda.some(x=>x.e===EV.vi_stop))ko.push('vi_stop non compare');
 coda.length=0;vecchiaiaAnno();if(coda.length)ko.push('vi_stop compare due volte');
 nuova(72);S.salute=30;S.fatti.testEta=99;S.fatti.desEta=99;coda.length=0;vecchiaiaAnno();if(coda.some(x=>x.e===EV.vi_stop))ko.push('vi_stop senza viaggi');
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
   const nips=S.relazioni.filter(p=>p.ruolo==='Nipote');ris.push({eta:S.eta,test,des,rif:S.fatti.desiderioRif?1:0,nip:nips.length,pas:nips.reduce((a,p)=>a+Object.keys(p.nv||{}).length,0),stile:S.fatti.nonnoStile||'',circ:S.circolo?1:0,circAnni:S.circolo?Math.round((S.t-S.circolo.dal)/12):0,vol:S.volont?1:0,volMesi:S.fatti.volMesi||0,sol:S.fatti.soloV||0,viag:S.fatti.viaggiAnz||0,stop:S.fatti.viaggiFine?1:0});
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
if V:
    cn = [x for x in V if x['nip']]
    print(f"nipoti: {len(cn)} vite su {len(V)} hanno nipoti (in media {sum(x['nip'] for x in cn)/max(1,len(cn)):.1f}), passi vissuti per vita con nipoti {sum(x['pas'] for x in cn)/max(1,len(cn)):.1f}; stile: " + ', '.join(f"{k} {sum(1 for x in cn if x['stile']==k)}" for k in ('presente','richiesta','distante')))
if V:
    ol = [x for x in V if x['eta'] >= 75]
    print(f"oltre i 75 anni ({len(ol)} vite): circolo {100*sum(x['circ'] for x in ol)/max(1,len(ol)):.0f}% · volontariato {100*sum(x['vol'] for x in ol)/max(1,len(ol)):.0f}% · solitudine ripetuta (media {sum(x['sol'] for x in ol)/max(1,len(ol)):.1f}, massimo {max([x['sol'] for x in ol] or [0])})")
if V:
    ol = [x for x in V if x['eta'] >= 75]
    print(f"viaggi da anziano ({len(ol)} vite oltre i 75): almeno uno {100*sum(1 for x in ol if x['viag'])/max(1,len(ol)):.0f}% · in media {sum(x['viag'] for x in ol)/max(1,len(ol)):.1f} · massimo {max([x['viag'] for x in ol] or [0])} · «l'ultimo viaggio» {sum(x['stop'] for x in ol)}")
print('violazioni nelle vite:', v['ko'] or 'nessuna ✓')
print('errori JS:', (r['errs'] + pe + v['errs']) or 'nessuno')
sys.exit(1 if r['ko'] or v['ko'] or r['errs'] or pe or v['errs'] else 0)
