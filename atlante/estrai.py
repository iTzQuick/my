import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
import json,re
from playwright.sync_api import sync_playwright
import sys;sys.path.insert(0,str(ROOT/'atlante'))
from mappe import COND,PC,PF
srcEv=open(ROOT/'src'/'d_eventi.js').read()+'\n'+open(ROOT/'src'/'d2_eventi2.js').read()+'\n'+open(ROOT/'src'/'d3_emergenti.js').read()+'\n'+open(ROOT/'src'/'d4_infanzia.js').read()+'\n'+open(ROOT/'src'/'d5_adolescenza.js').read()+'\n'+open(ROOT/'src'/'d6_adulti.js').read()+'\n'+open(ROOT/'src'/'d7_vita_italiana.js').read()+'\n'+open(ROOT/'src'/'d8_ritmo.js').read()+'\n'+open(ROOT/'src'/'d9_piccoli.js').read()+'\n'+open(ROOT/'src'/'d10_ragazzi.js').read()+'\n'+open(ROOT/'src'/'d11_vita_adulta.js').read()+'\n'+open(ROOT/'src'/'d12_catene.js').read()+'\n'+open(ROOT/'src'/'d13_persone.js').read()+'\n'+open(ROOT/'src'/'e2_lusso.js').read()
sez={};cur='Sistema'
for line in srcEv.split('\n'):
    m=re.match(r"/\* -+ (.+?) -+ \*/",line.strip())
    if m: cur=m.group(1); continue
    for i in re.findall(r"ev\(\{id:'(\w+)'",line): sez[i]=cur
JS=r'''(args)=>{const [COND,PC,PF,SEZ]=args;
const src=f=>typeof f==='function'?f.toString():null;
const LBL={f:'Felicità',s:'Salute',i:'Intelletto',a:'Aspetto',k:'Karma',m:'Soldi',voto:'Media scolastica',perf:'Rendimento al lavoro',rel:'Rapporto con la persona',bev:'Bevute (rischio alcol)',gio:'Giocate (rischio dipendenza)',...ABIL};
const tok=s=>String(s).replace(/\{o\}/g,'o/a').replace(/\{po\}/g,'o/a').replace(/\{P\}/g,'‹nome›').replace(/\{Tuo\}/g,'Tuo/Tua ‹ruolo›').replace(/\{tuo\}/g,'tuo/tua ‹ruolo›').replace(/\{lui\}/g,'lui/lei').replace(/\{Lui\}/g,'Lui/Lei').replace(/\{gli\}/g,'gli/le').replace(/\{Gli\}/g,'Gli/Le').replace(/\{lo\}/g,'lo/la').replace(/\{nonno\}/g,'nonno/a').replace(/\{xe\}/g,'‹importo›').replace(/\{x\}/g,'‹…›');
// stato fittizio
nuovaVita({sesso:'M',nome:'Esempio',cognome:'Rossi',citta:'Torino'});
S.eta=30;S.soldi=50000;assumi(JOB.tec);Object.assign(S.scuola,{stato:'superiori',tipo:'Liceo scientifico',anni:2,voto:62});
S.veicoli=[{id:900,n:'Utilitaria usata',valore:4000,stato:70,costo:1100}];S.animali=[{t:'Cane',nome:'Rocky',eta:3,max:12}];S.contributi=30;
const mockP={id:-1,nome:'‹nome›',cognome:'',sesso:'M',ruolo:'Amico',rapporto:50,eta:30,tr:0,vivo:true,pers:{O:50,C:50,E:50,A:50,N:50},intim:50,pass:50,imp:50,ricordi:[],stato:'lavora',coppia:'coppia',pNome:'‹nome›',malattia:'Polmonite',dove:'Milano',oreMese:3};
const mockD=()=>({p:{...mockP},x:'‹…›',fac:'Informatica',cand:{sesso:'F',nome:'‹nome›',cognome:'',eta:30,asp:60,tr:2,pers:{O:50,C:50,E:50,A:50,N:50}}});
const evalTxt=(t,d)=>{if(typeof t!=='function')return tok(t||'');try{const v=T(t,d);return v+' (esempio)'}catch(e){return '(testo che cambia in base alla situazione)'}};
function eff(e){if(!e)return [];return Object.entries(e).map(([k,v])=>({k:LBL[k]||k,v:Array.isArray(v)?`${v[0]>0?'+':''}${v[0]}…${v[1]>0?'+':''}${v[1]}`:typeof v==='function'?'variabile':(v>0?'+':'')+v,neg:Array.isArray(v)?(v[0]+v[1]<0):v<0,soldi:k==='m'}))}
function testiFx(s){const out=[];const re=/return \[\s*(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')/g;let m;while((m=re.exec(s))){let t=m[1].slice(1,-1).replace(/\$\{[^}]*\}/g,'…').replace(/\\'/g,"'");if(t&&t!=='x')out.push(tok(t))}
  const re2=/(?:chiudiRelazione\([^,]+,|licenzia\()\s*('(?:[^'\\]|\\.)*'|`[^`]*`)/g;while((m=re2.exec(s)))out.push(tok(m[1].slice(1,-1).replace(/\$\{[^}]*\}/g,'…')));return out}
function tagFx(s){if(!s)return [];const t=[];const R=(re,f)=>{let m;const g=new RegExp(re,'g');while((m=g.exec(s)))t.push(f(m))};
 R("nuovoAmico\\(",()=>'Nuovo amico');
 R("relGenitori\\((-?\\d+)\\)",m=>`Rapporto con i genitori ${+m[1]>0?'+':''}${m[1]}`);
 R("relAmici\\((-?\\d+)\\)",m=>`Rapporto con gli amici ${+m[1]>0?'+':''}${m[1]}`);
 R("ammala\\('([^']+)',(\\d)\\)",m=>`Malattia: ${m[1]}`);
 R("processo\\('(\\w+)'\\)",m=>`Processo per ${REATI[m[1]].n.toLowerCase()}`);
 R("assumi\\(",()=>'Vieni assunto/a');R("licenzia\\(",()=>'Perdi il lavoro');R("entraCarcere\\(",()=>'Carcere');
 R("S\\.dip\\.fumo=true",()=>'Inizi a fumare (−2 salute all\'anno)');
 R("coda\\.unshift\\(\\{e:EV\\.(\\w+)",m=>`Apre l'evento «${EV[m[1]]&&typeof EV[m[1]].t==='string'?EV[m[1]].t:m[1]}»`);
 R("S\\.prop\\.push",()=>'Ricevi una proprietà');R("S\\.veicoli\\.push",()=>'Ricevi un veicolo');R("S\\.veicoli\\.shift",()=>'Perdi il veicolo');
 R("S\\.animali\\.shift",()=>"Perdi l'animale");R("chiudiRelazione\\(",()=>'Fine della relazione');R("divorzia\\(",()=>'Divorzio');
 R("convivi\\(",()=>'Andate a convivere');R("nasceFiglio\\(",()=>'Possibile nascita di un figlio');R("sposa\\(",()=>'Matrimonio');
 R("iscriviUni\\(",()=>"Iscrizione all'università");R("S\\.citta=",()=>'Cambi città');R("S\\.carcere\\+\\+",()=>'+1 anno di carcere');
 R("S\\.lavoro\\.stip\\*([\\d.]+)",m=>`Stipendio ×${m[1].replace('.',',')}`);R("S\\.inv\\.crypto",()=>'Criptovalute');R("adotta\\(",()=>'Adotti un animale');
 R("S\\.casa=",()=>'Cambi casa');R("S\\.hobby=",()=>'Cambia l\'attività pomeridiana');R("Object\\.assign\\(S\\.scuola",()=>'Iscrizione a un corso di studi');
 R("nuovaPersona\\('(\\w+)'",m=>({Fratello:'Nasce un fratello o una sorella',Figlio:'Nuovo figlio',Nipote:'Nasce un nipote',Partner:'Nuovo partner'})[m[1]]||'Nuova persona');
 R("mod\\('(\\w+)',(-?\\d+)\\)",m=>`${({felicita:'Felicità',salute:'Salute',intelligenza:'Intelletto',aspetto:'Aspetto'})[m[1]]} ${+m[2]>0?'+':''}${m[2]}`);
 R("soldi\\(",()=>'Soldi (importo variabile)');R("S\\.malattie=S\\.malattie\\.filter",()=>'Può guarire una malattia');
 R("p\\.ruolo='Partner'|ruolo='Partner'",()=>'Tornate insieme');R("S\\.relazioni=S\\.relazioni\\.filter",()=>'La persona esce dalla tua vita');
 R("S\\.fatti\\.terapia",()=>'Terapia per le malattie croniche');R("S\\.dip\\[",()=>'Puoi uscire dalla dipendenza');
 R("S\\.istr\\.abil\\.push",()=>'Ottieni l\'abilitazione');R("S\\.patente=true",()=>'Ottieni la patente');R("S\\.latitante=true",()=>'Diventi latitante');
 R("creaNemico\\(",()=>'Ti fai un nemico');R("vaiA\\(",()=>'Cambi città');R("notizia\\(",()=>'Notizia dal mondo');R("danniCasa\\(",()=>'Danni alla casa');
 R("S\\.fama=clamp\\(S\\.fama\\+(\\d+)",m=>`Fama +${m[1]}`);R("S\\.social\\.follower",()=>'Follower');R("S\\.azienda\\.cassa\\+=",()=>'Soldi in cassa all\'azienda');R("S\\.azienda\\.cassa-=",()=>'Spese per l\'azienda');
 R("S\\.azienda\\.rep=clamp\\(S\\.azienda\\.rep([+-]\\d+)",m=>`Reputazione azienda ${m[1]}`);R("S\\.azienda=null",()=>'L\'azienda chiude o viene venduta');R("lasciaClan\\(true",()=>'Collabori con la giustizia');
 R("lealta\\+(\\d+)",m=>`Lealtà al clan +${m[1]}`);R("futuro\\(",()=>'Conseguenza negli anni successivi');R("avvicinaClan\\(",()=>'Entri nella malavita');R("S\\.galera\\.condotta\\+\\+",()=>'Buona condotta +1');R("S\\.fatti\\.provino=true",()=>'Puoi fare carriera da attore');
 R("assumi\\(JOB\\.(\\w+)\\)",m=>`Lavoro: ${JOB[m[1]]?JOB[m[1]].liv[0][0]:m[1]}`);
 const BN={O:'Apertura',C:'Coscienziosità',E:'Estroversione',A:'Amicalità',N:'Emotività'};
 R("segnaVita\\('(\\w+)'\\)",m=>{const x=SEGNA[m[1]];return x?'Carattere: '+Object.entries(x).map(([k,v])=>`${BN[k]} ${v>0?'+':''}${String(v).replace('.',',')}`).join(', '):'Esperienza che conta'});
 R("aggiungiOre\\('(\\w+)',(-?\\d+)\\)",m=>`Settimana: ${+m[2]>0?'+':''}${m[2]} ore di ${(ATT_R.find(a=>a.id===m[1])||{n:m[1]}).n.toLowerCase()}`);
 R("S\\.bis\\.stress=clamp\\(S\\.bis\\.stress([+-])(\\d+)",m=>`Stress ${m[1]==='+'?'+':'−'}${m[2]}`);
 R("S\\.bis\\.energia=clamp\\(S\\.bis\\.energia([+-])(\\d+)",m=>`Energia ${m[1]==='+'?'+':'−'}${m[2]}`);
 R("S\\.bis\\.soc=clamp\\(S\\.bis\\.soc\\+(\\d+)",m=>`Socialità +${m[1]}`);
 R("S\\.bis\\.forma=clamp\\(S\\.bis\\.forma\\+(\\d+)",m=>`Forma +${m[1]}`);
 R("ricorda\\(",()=>'La persona se lo ricorderà');
 for(const [k,l] of [['intim','Intimità'],['pass','Passione'],['imp','Impegno']])R("\\."+k+"=clamp\\(([^;]*?)\\)(?=;|\\})",m=>/\?/.test(m[1])?`${l} variabile`:`${l} ${(m[1].match(/([+-]\d+)\s*$/)||['','±'])[1]}`);
 R("\\.prestito=",()=>'Ti deve dei soldi (può restituirli)');R("S\\.fatti\\.assisti=",()=>'Assisti tu: 12 ore a settimana');R("S\\.fatti\\.badante=",()=>'Badante: circa 1.150 € al mese');R("S\\.fatti\\.rsa=",()=>'RSA: circa 800 € al mese');
 R("nuovoConoscente\\(",()=>'Nuovo conoscente');R("S\\.tensione=",()=>'Tensione: più stress per qualche mese');R("S\\.routine\\.(\\w+)=",m=>`Cambia la settimana (${(ATT_R.find(a=>a.id===m[1])||{n:m[1]}).n.toLowerCase()})`);
 R("S\\.proposito=",()=>'Buon proposito (lo mantieni in base alla Coscienziosità)');R("appuntamento\\(",()=>'Appuntamento: può nascere una relazione');R("S\\.aspir=",()=>'Aspirazione di vita');R("S\\.fatti\\.terapiaCron",()=>'Terapia continuativa');
 R("p\\.lavoro=lavoroPerNpc",()=>'La persona trova lavoro');R("creaNemico\\('lite'",()=>'Può diventare un nemico');R("S\\.fatti\\.crif",()=>'Niente prestiti per 7 anni');
 return [...new Set(t)]}
function pInfo(p,d){if(p===undefined)return null;if(typeof p==='number')return {txt:Math.round(p*100)+'%',media:p,min:p,max:p};
 const s=src(p);const calc=(st,ab,rap,cl,uv)=>{const bk=JSON.parse(JSON.stringify({i:S.intelligenza,a:S.aspetto,s:S.salute,k:S.karma,ab:S.abil,c:S.classe,u:S.fatti.ultimoVoto}));
  S.intelligenza=S.aspetto=S.salute=S.karma=st;for(const k in S.abil)S.abil[k]=ab;S.classe=cl;S.fatti.ultimoVoto=uv;const dd=mockD();dd.p.rapporto=rap;
  let v;try{v=p(dd)}catch(e){v=null}S.intelligenza=bk.i;S.aspetto=bk.a;S.salute=bk.s;S.karma=bk.k;S.abil=bk.ab;S.classe=bk.c;S.fatti.ultimoVoto=bk.u;return v==null?null:Math.max(0,Math.min(1,v))};
 return {txt:PF[s]||s,src:s,media:calc(50,30,50,'media',100),min:calc(0,0,0,'umile',80),max:calc(100,100,100,'agiata',110)}}
function esito(b){if(!b)return null;const fs=src(b.fx);const testi=[];if(b.r)testi.push(tok(b.r));if(fs)testi.push(...testiFx(fs));
 return {eff:eff(b.e),testi:[...new Set(testi)].filter(Boolean),extra:tagFx(fs).concat(b.fl?[]:[]),fut:b.fut?{anni:b.fut[0],id:b.fut[1]}:null,pr:b.pr?REATI[b.pr].n:null}}
function scelta(c,d){const o={l:evalTxt(c.l,d).replace(' (esempio)',''),sub:c.sub!==undefined?evalTxt(c.sub,d).replace(' (esempio)',''):null,costo:(()=>{try{return typeof c.costo==='function'?c.costo(d):(c.costo||0)}catch(e){return 0}})(),cond:c.cond?(COND[src(c.cond).replace(/^CH:/,'')]||src(c.cond)):null};
 if(c.p!==undefined){o.p=pInfo(c.p,d);o.si=esito(c.si);o.no=esito(c.no)}else o.esito=esito(c);return o}
const ev=[];
for(const e of Object.values(EV)){const d=mockD();if(e.chi)d.p.ruolo=e.chi[0];
 let cs=[];try{cs=typeof e.c==='function'?e.c(d):(e.c||[])}catch(err){cs=[]}
 const sc=cs.map(c=>scelta(c,d));if(e.auto){const a=scelta(e.auto,d);a.l='Succede da sola, senza scelta';sc.push(a)}
 ev.push({id:e.id,sez:SEZ[e.id]||'Sistema',t:evalTxt(e.t,d).replace(' (esempio)',''),x:evalTxt(e.x,d),min:e.min,max:e.max,w:e.w||1,once:!!e.once,rip:e.rip||(e.chi?4:6),link:!!e.link,auto:!!e.auto,prig:!!e.prig,chi:e.chi||null,
  cond:e.cond?(e.cond.desc||COND[src(e.cond)]||src(e.cond)):null,pc:e.pc?(e.pc.desc||PC[src(e.pc)]||src(e.pc)):null,scelte:sc,dinamica:typeof e.c==='function'})}
// chi apre chi (conseguenze)
const lab=q=>{if(!q)return '';const t=[];if(q.tit)t.push(TIT[q.tit]);if(q.lau)t.push((q.liv>=4?'Laurea magistrale in ':'Laurea in ')+q.lau.join(' / '));if(q.dip)t.push('Diploma: '+q.dip);if(q.cert)t.push(q.cert);if(q.abil)t.push('Abilitazione da '+q.abil.toLowerCase());if(q.dott)t.push('Dottorato');if(q.master)t.push('Master');if(q.spec)t.push('Specializzazione medica');if(q.sk)t.push(`${ABIL[q.sk[0]]} ≥ ${q.sk[1]}`);if(q.int)t.push(`Intelletto ≥ ${q.int}`);if(q.sal)t.push(`Salute ≥ ${q.sal}`);if(q.fed)t.push('Fedina pulita');if(q.patente)t.push('Patente B');if(q.eta)t.push(`Età ${q.eta[0]}–${q.eta[1]>90?'∞':q.eta[1]}`);if(q.or)t.push('('+q.or.map(lab).join(' oppure ')+')');return t.join(' + ')};
const lavori=LAVORI.map(j=>({id:j.id,riasec:JOB_RIASEC[j.id]||'C',ore:(()=>{const b=S.lavoro;S.lavoro={id:j.id,liv:0};const o=oreLavoro();S.lavoro=b;return o})(),livelli:j.liv.map((n,i)=>({m:n[0],f:n[1]||n[0],ral:stipLiv(j,i),netto:Math.round(netto(stipLiv(j,i))/13)})),pt:!!j.pt,conc:!!j.conc,var:!!j.var,nascosto:!!j.nascosto,req:lab(j.req)||'Nessun requisito',promo:j.promo?Object.entries(j.promo).map(([i,q])=>`Per diventare ${j.liv[i][0].toLowerCase()}: ${lab(q)}`):[]}));
const corsi=CORSI.map(c=>({n:c.n,costo:c.costo,min:c.min,cert:c.cert||'',sk:c.sk?Object.entries(c.sk).map(([k,v])=>`${ABIL[k]} +${v}`).join(', '):'',p:pInfo(c.p,{})}));
const att=ATTIVITA.map(a=>({sez:a.sez,n:a.n,d:a.d,costo:a.costo,min:a.min,ripeti:!!a.ripeti,en:a.en===undefined?8:a.en,cd:a.ripeti?0:cdAzione('att_'+a.id),cond:a.cond?src(a.cond):null,extra:tagFx(src(a.fx)),testi:testiFx(src(a.fx))}));
const attC=AZ_CARCERE.map(a=>({n:a.n,d:a.d}));
const citta=CITTA.concat(CITTA_ESTERE).map(c=>({n:c.n,mq:c.mq,estero:!CITTA.includes(c),affitti:AFFITTI.map(a=>({t:a.t,anno:affittoBase(a.t,c.n).costo})),case:CASE_TIPI.map(t=>({t:t.t,mq:t.mq,prezzo:Math.round(t.mq*c.mq*(t.k||1)*(.75+80/400)/1000)*1000}))}));
const nuovo={b5:B5,attacc:ATTACCAMENTI,riasec:RIASEC,attR:ATT_R.map(a=>({id:a.id,n:a.n,d:a.d,min:a.min,cond:a.cond?src(a.cond):null})),
 aspir:Object.entries(ASPIR).map(([id,A])=>({id,n:tok(A.n),ok:src(A.ok),w:src(A.w),tappe:A.tappe.map(t=>({n:tok(t.n),d:tok(t.d),c:t.c===A.ok?'(= il sogno è realizzato)':src(t.c)}))})),
 incl:INCL.map(([k,sg,re])=>({k,sg,parole:re.source.replace(/^\\b\(|\)$/g,'').split('|').map(w=>w.replace(/\\/g,''))})),
 segna:SEGNA,cd:['crim_x','mis_x','post_x','esame_x','corso_x','c_condotta','c_palestra','aumento','promo','nuoviamici','collega','compra_fol','clan'].map(k=>[k,cdAzione(k)])};
return {ev,lavori,...nuovo,corsi,att,attC,citta,
 superiori:SUPERIORI,facolta:FACOLTA,its:ITS,spec:SPECIALIZZAZIONI,abilitazioni:ABILITAZIONI.map(a=>({n:a.n,lau:a.lau,p:a.p,desc:a.desc})),hobby:HOBBY.map(h=>({n:h.n,sk:ABIL[h.sk]})),
 imprese:AZIENDE.map(a=>({n:a.n,costo:a.costo,sk:ABIL[a.sk],domanda:a.domanda,scontrino:a.scontrino,margine:a.margine,cap:a.cap,affitto:a.affitto,stip:a.stip,aprire:a.aprire,cliente:a.cliente,mult:a.mult})),
 titoli:TITOLI,crimini:CRIMINI.map(c=>({n:c.n,d:c.d,min:c.min,p:c.p,b:c.b,reato:REATI[c.reato].n,exp:c.exp,k:c.k,sk:c.sk?ABIL[c.sk]:null})),missioni:MISSIONI,gradi:GRADI_CLAN,quiz:QUIZ,domGen:DOMANDE_GEN,domSet:DOMANDE_SET,temi:TEMI.map(t=>({l:(typeof t.l==='function'?t.l({p:{nome:'…',pNome:'la persona che frequenta',dove:'la sua nuova città'}}):t.l).replace('{po}','o/a')+(t.c?' (quando serve)':''),ok:t.ok.map(i=>TRATTI[i][0]),ko:t.ko.map(i=>TRATTI[i][0]),solo:t.solo||null})),partiti:PARTITI,regMq:REG_MQ,nComuni:comuni().length,nProvince:PROVINCE.length,post:POST,prezziAz:PREZZI_AZ,qualitaAz:QUALITA_AZ,mktAz:MKT_AZ,compensi:COMPENSI,auto:AUTO,animali:ANIMALI,malattie:MALATTIE,reati:Object.entries(REATI).map(([k,v])=>({id:k,n:v.n,g:v.g,patente:!!v.patente})),tratti:TRATTI.map(t=>t[0]+(t[1]!==t[0]?' / '+t[1]:'')),
 nomi:{m:NOMI_M.length,f:NOMI_F.length,cognomi:COGNOMI.length},mete:METE}}'''
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(GAME);pg.wait_for_timeout(200)
    data=pg.evaluate(JS,[COND,PC,PF,sez]);b.close()
print('errs',errs)
json.dump(data,open(ROOT/'atlante'/'dati.json','w'),ensure_ascii=False)
ev=data['ev']
print(len(ev),'eventi', sum(len(e['scelte']) for e in ev),'scelte')
raw=[e['id'] for e in ev if (e['cond'] or '').startswith('(') or (e['cond'] or '').startswith('d=>') or (e['pc'] or '').startswith('p=>')]
print('cond non tradotte',raw)
print([ (c['l'],c['cond']) for e in ev for c in e['scelte'] if c['cond'] and ('=>' in c['cond'])])
print([ (e['id'],c['p']['txt']) for e in ev for c in e['scelte'] if c.get('p') and '=>' in c['p']['txt']])
import collections;print(collections.Counter(e['sez'] for e in ev))
print(json.dumps(ev[40],ensure_ascii=False)[:1500])
