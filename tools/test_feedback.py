"""Riproduce le segnalazioni del primo giro di prova (ottobre 2026) e controlla che siano risolte.
Uso: python build.py && python tools/test_feedback.py"""
import pathlib, json, sys
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8')
JS=r'''()=>{
 const out={},nuova=(ses)=>{nuovaVita({sesso:ses||'F',nome:'Prova',cognome:'Test',citta:'Roma',prov:'RM'});coda.length=0};
 const opzioni=()=>[...document.querySelectorAll('#shA button')].map(b=>b.textContent);
 const chiudi=()=>{sheetOpen=false;document.querySelector('#scrim').hidden=true};
 // 1. a 0 anni niente barzellette: con la mamma solo coccole
 nuova();const ma=vivi(['Madre'])[0];apriPersona(ma.id);out.zeroAnni=opzioni().filter(x=>/Parla|coccol/i.test(x));chiudi();
 // 6. a 6 anni con un amico di 8 non si parla di lavoro
 S.eta=6;const am=nuovaPersona('Amico','M',8,null,{});apriPersona(am.id);[...document.querySelectorAll('#shA button')].find(b=>/Parla/.test(b.textContent)).click();
 out.temi6anni=opzioni().filter(x=>!/Chiudi|Torna/.test(x));chiudi();
 // 2,5,11. chi ti cerca: a 1 anno nessun messaggio; a 7 anni frasi da bambino; i genitori con cui vivi non «passano a trovarti»
 S.eta=1;out.cerca1anno=cercaTesto(am);S.eta=7;out.cerca7anni=[cercaTesto(am),cercaTesto(ma)];S.eta=30;S.casa={tipo:'affitto'};out.cerca30=cercaTesto(ma);
 // 10,12,13. lutti, animali e amicizie chiuse alzano lo stress
 S.eta=30;S.bis.stress=20;const nonna=nuovaPersona('Nonno','F',85,null,{rapporto:80});mortePersona(nonna);out.stressLutto=[20,S.bis.stress];
 S.bis.stress=20;const f2=nuovaPersona('Amico','F',30,null,{rapporto:70});apriPersona(f2.id);[...document.querySelectorAll('#shA button')].find(b=>/Chiudi l/.test(b.textContent)).click();out.stressAmicizia=[20,S.bis.stress];chiudi();
 // 15. la sorella vive a Barcellona: mi trasferisco lì
 const so=nuovaPersona('Fratello','F',33,null,{lontano:true,dove:'Barcellona'});vaiA('Barcellona',null);out.barcellona={lontano:so.lontano,dove:so.dove,mamma:[ma.lontano,ma.dove]};
 // 16. follower: un vecchio salvataggio con 6,4 milioni di miliardi
 S.social.attivo=true;S.social.follower=6402756782857664;save();load();out.followerCaricati=S.social.follower;
 S.social.follower=1000;S.routine={social:20};for(let i=0;i<12*60;i++){const f0=S.social.follower;S.social.follower=f0+crescita(f0,f0*20*.004*.9+20*5)}out.follower60anni=S.social.follower;out.tetto=tettoFollower();
 // 17. amici: quanti dello stesso sesso
 let stesso=0;for(let i=0;i<400;i++)if(candidatoAmico().sesso==='F')stesso++;out.amiciStessoSesso=stesso/400;
 // 19. uno zio al 100% senza contatti per due anni
 const zio=nuovaPersona('Zio','M',50,null,{rapporto:100});zio.ultimo=S.t-12;let v=[];for(let i=0;i<24;i++){S.t++;const non=S.t-(zio.ultimo||0);relD(zio,-(non>=6?.5:non>=3?.2:0));if(zio.rapporto>=95)relD(zio,-.35)}out.zioDopo2anni=zio.rapporto;
 // 18. il vicino
 coda.length=0;const nemPrima=vivi(['Nemico']).length;const c=EV.vicino.c[0];applica(c.no,{});out.vicinoNemico=[nemPrima,vivi(['Nemico']).length,vivi(['Nemico']).slice(-1)[0].sesso];
 // 4. separazione di una zia: si dice chi è il partner
 const zia=nuovaPersona('Zio','F',45,null,{rapporto:70,coppia:'sposato',pNome:'Giovanni'});S.log[S.log.length-1].righe=[];zia.coppia='separato';annuncia(zia,`${cap(tuoR(zia))} ${zia.nome} si separa ${partnerDi(zia,true)}.`,'b');out.separazione=S.log[S.log.length-1].righe.slice(-1)[0].t;
 return out;
}'''
with sync_playwright() as p:
    b=p.chromium.launch();errs=[];pg=b.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto((ROOT/'dist'/'vitamia.html').as_uri());pg.wait_for_timeout(300)
    r=pg.evaluate(JS)
    for k,v in r.items():print(f'{k}: {v}')
    print('errori',errs);b.close()
