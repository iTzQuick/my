/* ================= RITMO DELL'ANNO (ROADMAP, Fase 1) =================
   Il calendario non ripete gli stessi eventi ogni anno. Negli anni «normali» Natale, ferie, Capodanno ed elezioni
   diventano una riga di diario costruita dalla tua situazione (con chi sei, dove vivi, le tue abitudini);
   un evento vero arriva quando c'è una novità (il primo Natale in coppia, le prime ferie con un neonato,
   la sedia vuota dopo un lutto…) oppure, di rado, per rimettere in discussione un'abitudine.
   Qui ci sono anche i modelli di incontro: si conosce gente in tanti modi diversi (INC, usato da incontri()). */

/* ---------- Testi del diario per gli anni «normali» ---------- */
const TESTI_R={
  natPiccoli:['A Natale ti interessa più la carta dei regali che i regali.','Il tuo Natale: un fiocco in testa e tutti che ti passano di braccio in braccio.','Tiri giù una pallina dall\'albero. Poi un\'altra. Poi quasi l\'albero.','Ti addormenti sotto il tavolo durante la tombola.','Il regalo più bello? La scatola in cui era impacchettato.'],
  natBimbi:['La notte di Natale non riesci a dormire: senti dei rumori in salotto.','Scrivi la letterina con dodici richieste e due errori di ortografia.','Al pranzo di Natale ti fanno recitare la poesia in piedi sulla sedia.','Tombola con i cugini: vinci un ambo e cinquanta centesimi.','Il presepe lo fai tu: le pecore sono più grandi della capanna.','Natale dai nonni: il pranzo dura quattro ore, tu ne passi tre sotto il tavolo con i cugini.','Apri i regali alle sei di mattina e svegli tutta la casa.','Il panettone ha i canditi. Li togli uno a uno, con pazienza.','La sera di Natale giochi a carte con gli zii e impari a barare.'],
  natRagazzi:['Natale in famiglia: le zie vogliono sapere tutto dei voti e se «c\'è qualcuno».','Il pranzo di Natale dura così tanto che a un certo punto è già ora di cena.','Tombola fino a mezzanotte: tuo zio legge i numeri con la smorfia.','La Vigilia esci con gli amici, a Natale sei a tavola con i parenti. Equilibrio perfetto.','Ti regalano un maglione. Lo indosserai una volta, davanti a chi te l\'ha regalato.','Santo Stefano: avanzi, film e un divano che ti tiene in ostaggio.','Il cugino più piccolo ti segue tutto il giorno. Alla fine ti fa anche simpatia.'],
  natFigli:['Natale con i bambini: alle sei di mattina sono già sotto l\'albero a strappare la carta.','La Vigilia la passi a montare un giocattolo con le istruzioni in undici lingue, nessuna chiara.','Il regalo più richiesto era introvabile. Lo trovi il 23, in un centro commerciale a quaranta chilometri.','Recita di Natale a scuola: il tuo bambino fa la pecora numero tre. Ti commuovi lo stesso.','I bambini scrivono la letterina a Babbo Natale. Tu prendi appunti di nascosto.','Pranzo dai nonni con i bambini su di giri: al ritorno dormono in macchina, tu quasi.','Lasciate latte e biscotti per Babbo Natale. Li mangi tu, alle due di notte.'],
  natCoppia:['Vigilia da una famiglia, pranzo dall\'altra: due cenoni in due giorni e una cintura da allentare.','Quest\'anno tocca alla famiglia di {P}: hanno cucinato per trenta, siete in nove.','Natale in coppia: albero piccolo, regali scambiati sotto il plaid, auguri ai parenti al telefono.','Tu e {P} vi regalate la stessa cosa senza saperlo. Ridete per mezz\'ora.','Natale a casa vostra con tutti i parenti: il tavolo allungato con quello del terrazzo.','Vi eravate promessi «niente regali quest\'anno». Nessuno dei due ha mantenuto la promessa.'],
  natDaiTuoi:['Natale dai tuoi: tua madre ti chiede tre volte se mangi abbastanza.','Torni nella tua vecchia cameretta: i poster sono ancora lì.','A tavola arriva la domanda di rito: «E tu, quando ti sistemi?»','Pranzo dai tuoi, tombola con i cugini e avanzi da portare a casa per una settimana.','Tuo padre racconta di nuovo la storia di quando eri piccol{o}. Ridete tutti, anche tu.','Natale in famiglia: fratelli, cognati, nipoti e un cane che ruba il cotechino.'],
  natDaiFigli:['Natale dai figli: per la prima volta non cucini tu. Controlli tutto lo stesso.','I figli fanno a turno per invitarti: quest\'anno tocca al più grande.','A tavola sei tu a raccontare le storie di quando erano piccoli. Nessuno ti ferma.','Porti il tuo dolce di sempre. Lo finiscono prima del panettone.'],
  natNonni:['Natale con i nipoti: la tombola la vince sempre il più piccolo, chissà come.','I nipoti ti saltano addosso appena apri la porta. Vale tutto l\'anno.','Prepari una busta per ogni nipote, come facevano i tuoi nonni con te.','Il nipote più grande ti spiega il suo videogioco. Non capisci niente, ma annuisci.','Fai la pasta a mano con i nipoti: ne mangiano metà cruda.'],
  natSolo:['Natale tranquillo: qualche telefonata e il panettone diviso in quattro giorni.','Pranzo di Natale da un\'amica che non vuole lasciarti sol{o}.','Natale da sol{o}: un bel film, una lasagna e nessuno che ti chiede niente.','Fai un giro in centro tra le luci e ti fermi a guardare il presepe vivente.','Il 25 sembra un lunedì qualsiasi. Fa un po\' male, poi passa.'],
  natCarcere:['Natale in carcere: un panettone diviso in sei e una telefonata di dieci minuti a casa.','A Natale la mensa serve il pandoro. Nessuno ha voglia di parlare.','Natale dietro le sbarre: qualcuno canta, qualcuno piange in silenzio.'],
  capodanno:['Capodanno in piazza: botti, abbracci tra sconosciuti e un freddo cane.','Mezzanotte sul divano con il concerto in TV. A mezzanotte e un quarto dormi già.','Cenone con gli amici, lenticchie per i soldi e un brindisi di troppo.','Capodanno in montagna: fiaccolata, vin brulé e piedi gelati.','Il conto alla rovescia lo sbagliate tutti, come ogni anno.','Tombola, cotechino e lenticchie: la mezzanotte ti trova con l\'ultima cartella in mano.','Un Capodanno tranquillo: proprio quello che volevi.','Primo gennaio: lenticchie avanzate e buoni propositi rimandati a febbraio.','Festa a casa di amici: alle due si balla, alle tre si lavano i piatti.','Il discorso di fine anno del Presidente, poi lo spumante: tradizione rispettata.'],
  capRagazzi:['Il primo Capodanno fuori con gli amici: rientro all\'una e mezza, trattato per settimane.','Capodanno con i cugini: botti in cortile e lenticchie che nessuno mangia.','A mezzanotte sei in piazza con la tua compagnia. I tuoi chiamano alle 00:05.','Cenone in famiglia, poi tutti a casa di un amico a giocare a carte fino alle due.'],
  estateR:['Estate al mare con la compagnia: falò in spiaggia e una chitarra stonata.','Estate in città: pomeriggi al parco e serate in piazza fino a tardi.','Campo scuola in montagna: niente rete e amicizie per la vita.','Un mese dai nonni al paese: il bar della piazza è il centro del mondo.','Vacanza studio in Inghilterra: torni dicendo «sorry» a tutti.','Agosto in spiaggia con i tuoi: dormi fino a mezzogiorno, ogni giorno.','Estate in bicicletta con gli amici: chilometri, gelati e ginocchia sbucciate.','Un\'estate a leggere sotto l\'ombrellone. Dieci libri, uno più bello dell\'altro.'],
  ferieLavoro:['Agosto in ufficio: aria condizionata, silenzio e nessuna riunione.','Lavori anche ad agosto, come ogni anno. La città è tua, il tempo libero no.','Ferragosto al lavoro: il panino sulla panchina sa di vacanza mancata.'],
  ferieNo:['Quest\'anno niente vacanze: i conti non tornano. Qualche gita in giornata e tanta pazienza.','Ferie a casa per forza: il ventilatore è la tua spiaggia.','Agosto in città, senza soldi per partire. Ti consoli con il gelato.']
};
/* Il piatto di Natale cambia da regione a regione */
const TRAD_NATALE={
  'Emilia-Romagna':['Tortellini in brodo: la nonna li ha chiusi a mano, uno per uno.','Cappelletti in brodo e bollito con la mostarda.'],
  'Lombardia':['Il panettone del forno sotto casa: guai a chi nomina il pandoro.','Il cappone ripieno della tradizione, come ogni anno.'],
  'Piemonte':['Agnolotti del plin e bollito misto con il bagnetto verde.'],
  'Veneto':['Il pandoro è nato a Verona, e a tavola lo ricorda qualcuno ogni anno.','Baccalà mantecato la Vigilia, brodo di cappone a Natale.'],
  'Liguria':['Ravioli al tocco e il pandolce genovese.'],
  'Toscana':['Crostini neri, poi panforte e ricciarelli a fine pranzo.'],
  'Lazio':['La Vigilia di magro: baccalà fritto e broccoli. A Natale l\'abbacchio.'],
  'Campania':['Il capitone la Vigilia, struffoli e roccocò sul vassoio dei dolci.','Una gita a San Gregorio Armeno per una statuina nuova del presepe.','L\'insalata di rinforzo, che dura tutte le feste.'],
  'Puglia':['Le cartellate col vincotto e le pettole della Vigilia.'],
  'Calabria':['La Vigilia si mangia di magro: baccalà, stocco e zeppole.'],
  'Sicilia':['La Vigilia si gioca a carte fino a tardi, tra buccellati e torrone.','Sfincione la Vigilia e cassata a Natale.'],
  'Sardegna':['Porceddu arrosto e dolci di mandorla della nonna.','Culurgiones fatti in casa e papassini a fine pranzo.'],
  Nord:['Il cappone in brodo, come ogni anno.','Polenta, baccalà e un panettone gigante.'],
  Centro:['Cappelletti in brodo e tombola fino a tardi.'],
  Sud:['La Vigilia si mangia di magro: baccalà fritto e verdure in pastella.','Il presepe occupa mezzo salotto: ogni anno una statuina nuova.'],
  Isole:['Cenone di pesce e dolci di mandorla.']
};
/* lavori con i turni anche a Natale */
const TURNI=['cam','cuoco','oss','pol','vvf','inf','med','cara','gdf','mil','taxi','badante','cass','bpt','rec','hostess','pilota','aut','camion'];

/* chi c'è con te alle feste */
function casaFeste(){
  const pa=partnerAttuale(),figliCasa=vivi(['Figlio']).filter(f=>!f.fuori&&!f.conEx);
  return {pa,figliCasa,piccoli:figliCasa.filter(f=>f.eta<12),nip:vivi(['Nipote']).filter(n=>n.eta<14)};
}

/* ---------- Natale ---------- */
function natale(){
  const e=S.eta,F=S.fatti;
  if(S.carcere>0){log(varia('natCarc',TESTI_R.natCarcere),'b');return}
  if(e<1){log('Il tuo primo Natale: dormi per tutto il pranzo e ti svegli giusto in tempo per la carta dei regali.','g');return}
  if(!coda.length){
    const nov=novitaNatale();
    if(nov){coda.push(nov);return}
    if(e>=4&&S.t-(F.natT||-999)>=72&&chance(.25)){F.natT=S.t;coda.push({e:EV.natale_cal,d:{}});return}
  }
  riassuntoNatale();
}
function novitaNatale(){
  const e=S.eta,F=S.fatti,pa=partnerAttuale();
  const PL={Coniuge:5,Figlio:5,Partner:4,Madre:4,Padre:4,Fratello:3,Nonno:2};
  const lutto=S.relazioni.filter(p=>!p.vivo&&!p.natL&&PL[p.ruolo]&&p.mortoT!==undefined&&S.t-p.mortoT>=1&&S.t-p.mortoT<12&&(!['Nonno','Fratello'].includes(p.ruolo)||p.rapporto>=65)).sort((a,b)=>PL[b.ruolo]-PL[a.ruolo])[0];
  if(lutto&&e>=6&&S.t-(F.natLuttoT||-999)>=24){lutto.natL=1;F.natLuttoT=S.t;return {e:EV.cal_natale_lutto,d:{m:lutto}}}
  const neo=vivi(['Figlio']).find(f=>f.eta===0&&!f.conEx);
  if(neo&&!F.natFiglio&&e>=16){F.natFiglio=1;return {e:EV.cal_natale_figlio,d:{p:neo}}}
  if(pa&&F.natP!==pa.id&&e>=16){F.natP=pa.id;return {e:EV.cal_natale_coppia,d:{p:pa}}}
  if(e>=14&&e<=17&&!F.natRag&&S.casa.tipo==='genitori'&&chance(.4)){F.natRag=1;return {e:EV.cal_natale_ragazzi,d:{}}}
  if(e>=19&&!F.natLontano&&S.casa.tipo!=='genitori'&&genitoriVivi()&&F.cittaNascita&&S.citta!==F.cittaNascita){F.natLontano=1;return {e:EV.cal_natale_lontano,d:{}}}
  const nip=vivi(['Nipote']).filter(n=>n.eta<=6).sort((a,b)=>a.eta-b.eta)[0];
  if(nip&&!F.natNonno){F.natNonno=1;return {e:EV.cal_natale_nonno,d:{p:nip}}}
  if(S.lavoro&&TURNI.includes(S.lavoro.id)&&S.t-(F.natTurnoT||-999)>=60&&chance(.35)){F.natTurnoT=S.t;return {e:EV.cal_natale_turno,d:{}}}
  if(e>=25&&!pa&&S.casa.tipo!=='genitori'&&!genitoriVivi()&&!vivi(['Figlio','Fratello']).some(f=>!f.lontano)&&S.t-(F.natSoloT||-999)>=96){F.natSoloT=S.t;return {e:EV.cal_natale_solo,d:{}}}
  return null;
}
function riassuntoNatale(){
  const e=S.eta,{pa,piccoli,nip}=casaFeste();let k,L;
  if(e<4){k='natPic';L=TESTI_R.natPiccoli}
  else if(e<14){k='natBim';L=TESTI_R.natBimbi}
  else if(S.casa.tipo==='genitori'&&e<30){k='natRag';L=TESTI_R.natRagazzi}
  else if(piccoli.length){k='natFig';L=TESTI_R.natFigli}
  else if(nip.length&&e>=50){k='natNon';L=TESTI_R.natNonni}
  else if(pa){k='natCop';L=TESTI_R.natCoppia}
  else if(genitoriVivi()){k='natTuoi';L=TESTI_R.natDaiTuoi}
  else if(vivi(['Figlio']).length){k='natDaiF';L=TESTI_R.natDaiFigli}
  else{k='natSolo';L=TESTI_R.natSolo}
  let t=T(varia(k,L),{p:pa});
  const Lg=luogo(),tr=TRAD_NATALE[Lg.reg]||TRAD_NATALE[Lg.zona];
  if(tr&&e>=4&&chance(.35))t+=' '+varia('trad',tr);
  const fam=famIn().filter(p=>!p.lontano||convive(p));
  if(k==='natSolo'){mod('felicita',pz('E')>0?-3:0);S.bis.soc=clamp(S.bis.soc+2)}
  else{relGruppo(fam.slice(0,10),0,2);mod('felicita',2+(pz('E')>0?1:0));S.bis.soc=clamp(S.bis.soc+6)}
  if(e>=18&&k!=='natSolo'){const x=P(25)*Math.max(2,Math.min(12,fam.length+piccoli.length));soldi(-x);t+=` Regali: ${eur(x)}.`}
  log(t,k==='natSolo'?'':'g');
}

/* ---------- Ferie d'agosto ---------- */
const FERIE={mare:{c:900,f:8,st:15,T:'mare'},monti:{c:750,f:7,st:18,T:'monti'},estero:{c:1800,f:10,st:14,T:'estero'},casa:{c:0,f:3,st:10,T:'casa'}};
/* una vacanza costa di più in tanti: il partner che vive con te conta come una persona, ogni figlio minorenne un po' meno */
function costoFerie(id){const F0=FERIE[id];if(!F0||!F0.c)return 0;const {pa,figliCasa}=casaFeste();const n=1+(pa&&pa.conv?1:0)+figliCasa.filter(f=>f.eta<18).length*.6;return Math.round(P(F0.c)*(.6+.4*n))}
function ferieAgosto(){
  const e=S.eta,F=S.fatti;
  if(S.carcere>0)return;
  if(e<14){log(varia('estateB',TESTI.estateB),'g');return}
  if(e<18){
    if(e>=15&&!F.lavEstivo&&!coda.length&&chance(.35)){F.lavEstivo=1;coda.push({e:EV.cal_lavoretto,d:{}});return}
    log(varia('estateR',TESTI_R.estateR),'g');mod('felicita',2);S.bis.stress=clamp(S.bis.stress-6);return}
  if(!coda.length){
    const nov=novitaFerie();if(nov){coda.push(nov);return}
    if(!F.ferieAbit||(S.t-(F.ferieT||-999)>=72&&chance(.3))){F.ferieT=S.t;coda.push({e:EV.ferie,d:{}});return}
  }
  riassuntoFerie();
}
function novitaFerie(){
  const e=S.eta,F=S.fatti,pa=partnerAttuale();
  if(e<=25&&!F.ferieAmici&&vivi(['Amico']).filter(a=>!a.lontano).length>=2&&chance(.6)){F.ferieAmici=1;return {e:EV.cal_ferie_amici,d:{}}}
  const neo=vivi(['Figlio']).find(f=>f.eta<=1&&!f.conEx);
  if(neo&&!F.ferieBimbo){F.ferieBimbo=1;return {e:EV.cal_ferie_bimbo,d:{p:neo}}}
  if(pa&&F.ferieP!==pa.id){F.ferieP=pa.id;return {e:EV.cal_ferie_coppia,d:{p:pa}}}
  if(S.pensione&&!F.feriePens){F.feriePens=1;return {e:EV.cal_ferie_pensione,d:{}}}
  if(!pa&&F.fineCoppiaT!==undefined&&S.t-F.fineCoppiaT<=24&&!F.ferieSola){F.ferieSola=1;return {e:EV.cal_ferie_sola,d:{}}}
  const gr=vivi(['Figlio']).find(f=>f.eta>=15&&f.eta<=18&&!f.fuori&&!f.conEx);
  if(gr&&!F.ferieGrandi){F.ferieGrandi=1;return {e:EV.cal_ferie_grandi,d:{p:gr}}}
  const ab=F.ferieAbit;
  if(ab&&FERIE[ab]&&FERIE[ab].c&&S.soldi<costoFerie(ab)&&S.t-(F.ferieSoldiT||-999)>=48){F.ferieSoldiT=S.t;return {e:EV.cal_ferie_soldi,d:{x:ab}}}
  return null;
}
function riassuntoFerie(){
  const F=S.fatti;let id=F.ferieAbit||'casa';
  if(id==='lavoro'){if(S.lavoro){const x=P(r(400,900));soldi(x);S.bis.stress=clamp(S.bis.stress+3);log(`${varia('ferieLav',TESTI_R.ferieLavoro)} Guadagni ${eur(x)} in più.`,'');return}id='casa'}
  const F0=FERIE[id]||FERIE.casa,c=costoFerie(id);
  if(c&&S.soldi<c){log(varia('ferieNo',TESTI_R.ferieNo),'b');mod('felicita',-1);S.bis.stress=clamp(S.bis.stress-4);return}
  const {pa,figliCasa}=casaFeste(),kids=figliCasa.filter(f=>f.eta<14);
  const pre=kids.length?(pa?`Ferie in famiglia con ${pa.nome} e ${kids.length>1?'i bambini':kids[0].nome}. `:`Ferie con ${kids.length>1?'i bambini':kids[0].nome}. `):pa?`Ferie con ${pa.nome}. `:'';
  soldi(-c);mod('felicita',Math.round(F0.f*.6+(id==='estero'?pz('O')*2:0)));S.bis.stress=clamp(S.bis.stress-Math.round(F0.st*.8));S.bis.energia=clamp(S.bis.energia+12);
  if(pa){pa.intim=clamp((pa.intim||50)+2);pa.pass=clamp((pa.pass||50)+3)}
  if(id==='estero')S.fatti.viaggi=(S.fatti.viaggi||0)+1;
  log(pre+varia(F0.T,TESTI[F0.T])+(c?` Spesa: ${eur(c)}.`:''),'g');
}

/* ---------- Capodanno e buoni propositi ---------- */
function motivoProposito(){if(S.bis.forma<35)return 'forma';if(rOre('schermi')>=20)return 'schermi';if(S.soldi<0&&S.eta>=18)return 'soldi';if(iscritto()&&S.scuola.voto<45)return 'studio';return null}
function capodanno(){
  const e=S.eta,F=S.fatti;
  if(e<14||S.carcere>0)return;
  const m=motivoProposito();
  if(!coda.length&&(F.propT===undefined||(S.t-F.propT>=(m?60:84)&&chance(m?.4:.25)))){F.propT=S.t;coda.push({e:EV.propositi,d:{m}});return}
  log(e<18?varia('capR',TESTI_R.capRagazzi):varia('cap',TESTI_R.capodanno),'');
}

/* ---------- Elezioni: la prima volta si sceglie, poi spesso si vota per abitudine ---------- */
const conArt=pt=>/^[AEIOU]/.test(pt)?"l'"+pt:'il '+pt;
function elezioniPolitiche(){
  if(S.eta<18||S.carcere>0)return;
  const F=S.fatti;
  if(!F.voto||chance(.3)){coda.push({e:EV.elezioni,d:{}});return}
  const vince=pick(PARTITI),v=F.voto;
  notizia(`Elezioni: vince ${conArt(vince)}.`);
  if(v==='no')log('Si vota per il Parlamento. Anche stavolta resti a casa.','');
  else if(v==='bianca')log('Si vota per il Parlamento: scheda bianca, come l\'ultima volta.','');
  else{log(`Si vota per il Parlamento: voti ${conArt(v)}, come sempre.${vince===v?' E stavolta vince!':''}`,vince===v?'g':'');if(vince===v)mod('felicita',2)}
}

/* ================= EVENTI DEL CALENDARIO (solo quando c'è una novità) ================= */
/* ---------- Calendario: Natale ---------- */
ev({id:'cal_natale_coppia',link:1,k:'Dicembre',t:'Il primo Natale insieme',x:d=>{const s=S.relazioni.some(p=>p.vivo&&p.ruolo==='Suocero');return `È il primo Natale con ${d.p.nome}. ${s||genitoriVivi()?'Le famiglie sono due, il 25 dicembre uno solo.':'Per la prima volta tocca a voi decidere come festeggiare.'}`},c:[
  {l:'Dai tuoi',cond:()=>genitoriVivi(),fx:d=>{relGenitori(4);d.p.imp=clamp((d.p.imp||50)+2);return [`Tua madre ha già apparecchiato un posto in più. ${d.p.nome} si conquista tutti al secondo piatto.`,'g']}},
  {l:'Dalla famiglia di {P}',pers:{A:1,O:1},fx:d=>{d.p.intim=clamp((d.p.intim||50)+4);d.p.imp=clamp((d.p.imp||50)+3);vivi(['Suocero']).forEach(p=>p.rapporto=clamp(p.rapporto+5));relGenitori(-2);return ['Ti studiano tutti dalla testa ai piedi. Alla tombola sei già «uno di famiglia».','g']}},
  {l:'Vigilia da una parte, Natale dall\'altra',pers:{C:1},fx:d=>{relGenitori(2);d.p.imp=clamp((d.p.imp||50)+3);S.bis.stress=clamp(S.bis.stress+6);return ['Due cenoni in due giorni. Il 26 non riesci ad alzarti dal divano.','']}},
  {l:'Solo voi due',pers:{E:-1},fx:d=>{d.p.pass=clamp((d.p.pass||50)+6);relGenitori(-4);mod('felicita',4);return ['Albero storto, cena improvvisata e nessuno che vi chiede quando vi sposate.','g']}},
  {l:'Ognuno con la sua famiglia, per quest\'anno',fx:d=>{d.p.intim=clamp((d.p.intim||50)-2);relGenitori(2);return ['Vi scambiate gli auguri a mezzanotte. È presto per mescolare i parenti.','']}}]});
ev({id:'cal_natale_figlio',link:1,k:'Dicembre',t:'Il primo Natale di {P}',x:d=>`${d.p.nome} non capisce niente di quello che succede, ma tutti hanno comprato un regalo per ${gp(d.p,'lui','lei')}. È il suo primo Natale.`,c:[
  {l:'Foto di rito con il cappellino da Babbo Natale',fx:d=>{mod('felicita',5);relGenitori(3);return ['Duecento foto. Una è venuta bene, e finisce incorniciata dai nonni.','g']}},
  {l:'Tutti da voi, così {lui} non si stanca',pers:{A:1,E:1},costo:()=>P(150),fx:d=>{relGruppo(famIn(),2,5);S.bis.stress=clamp(S.bis.stress+6);return [`Venti persone in salotto. ${d.p.nome} dorme beat${gp(d.p,'o','a')} in mezzo al caos.`,'g']}},
  {l:'Natale tranquillo, solo voi',pers:{E:-1},fx:()=>{mod('felicita',4);S.bis.stress=clamp(S.bis.stress-6);S.bis.energia=clamp(S.bis.energia+6);return ['Il regalo più bello: una notte di sonno quasi intera.','g']}}]});
/* d.m è la persona morta (non d.p: next() salta gli eventi legati a una persona che non c'è più) */
const mortoDi=d=>d.m||S.relazioni.find(p=>!p.vivo&&p.natL)||{nome:'chi non c\'è più',sesso:'M'};
ev({id:'cal_natale_lutto',link:1,k:'Dicembre',t:'La sedia vuota',x:d=>{const m=mortoDi(d);return `È il primo Natale senza ${m.nome}. A tavola qualcuno ha apparecchiato anche per ${gp(m,'lui','lei')}, per abitudine.`},c:[
  {l:d=>`${gp(mortoDi(d),'Lo','La')} ricordate insieme, con le sue storie`,pers:{A:1,N:-1},fx:d=>{relGruppo(famIn(),2,4);S.bis.stress=clamp(S.bis.stress-6);mod('felicita',2);return [`Si ride e si piange nello stesso minuto, ricordando ${mortoDi(d).nome}. Fa bene.`,'g']}},
  {l:'Fate finta di niente, per i più piccoli',pers:{N:1},fx:()=>{pesa(4,1);return ['Tutto come sempre. Tranne quel posto vuoto che nessuno nomina.','']}},
  {l:'Una visita al cimitero, la mattina',pers:{A:1},fx:d=>{const m=mortoDi(d);S.bis.stress=clamp(S.bis.stress-3);mod('felicita',1);return [`Porti una stella di Natale a ${m.nome} e ${gp(m,'gli','le')} racconti com'è andato l'anno.`,'']}},
  {l:'Quest\'anno niente Natale',pers:{E:-1,N:1},fx:()=>{relGruppo(famIn(),-3,0);mod('felicita',-3);pesa(3,2);return ['Luci spente alle nove. Il Natale ricomincerà l\'anno prossimo.','b']}}]});
ev({id:'cal_natale_lontano',link:1,k:'Dicembre',t:'Si torna a casa per Natale?',x:()=>`Vivi a ${S.citta}. I tuoi ti aspettano a ${S.fatti.cittaNascita} per Natale.`,c:[
  {l:'Treno pieno e valigia piena',costo:()=>P(180),fx:()=>{relGenitori(6);mod('felicita',5);return ['Tua madre ti rimanda indietro con la valigia piena di cibo. Pesa il doppio dell\'andata.','g']}},
  {l:'Inviti i tuoi a venire da te',pers:{C:1},costo:()=>P(120),fx:()=>{relGenitori(4);S.bis.stress=clamp(S.bis.stress+4);return ['Tuo padre critica la caldaia, tua madre riordina gli armadi. Ma siete insieme.','g']}},
  {l:'Quest\'anno resti qui',pers:{E:-1},fx:()=>{relGenitori(-5);mod('felicita',-2);return [S.anno>=2010?'Pranzo di Natale in videochiamata. Tua nonna parla allo schermo a dieci centimetri.':'Una lunga telefonata a casa. Tua madre fa finta che vada bene.','']}}]});
ev({id:'cal_natale_nonno',link:1,k:'Dicembre',t:'Il primo Natale da {nonno}',x:d=>`${d.p.nome} ha ${d.p.eta?d.p.eta+(d.p.eta===1?' anno':' anni'):'pochi mesi'} ed è il primo Natale che passate insieme.`,c:[
  {l:'Ti travesti da Babbo Natale',pers:{E:2,O:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+8);mod('felicita',6);return [`${d.p.nome} ti riconosce dalle scarpe. Fa finta di niente, per te.`,'g']}},
  {l:'Il regalo più grande di tutti',costo:()=>P(200),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+5);vivi(['Figlio']).forEach(f=>f.rapporto=clamp(f.rapporto-1));return [`I genitori ti guardano storto: «Così ${gp(d.p,'lo','la')} vizi.» Esatto.`,'g']}},
  {l:'{Gli} insegni la tombola',pers:{A:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6);mod('felicita',4);return [`Vince ${d.p.nome}, naturalmente. Con un po' del tuo aiuto.`,'g']}}]});
ev({id:'cal_natale_turno',link:1,k:'Dicembre',t:'Il turno di Natale',x:()=>`Il calendario dei turni è uscito: il 25 dicembre tocca a te. ${S.lavoro?`Lavori come ${S.lavoro.nome.toLowerCase()}: `:''}c'è chi deve esserci anche a Natale.`,c:[
  {l:'Lavori, con il panettone in pausa',pers:{C:2,A:1},fx:()=>{const x=P(120);soldi(x);if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+3);relGruppo(famIn(),-2,0);return [`Un Natale diverso, tra colleghi e auguri di chi passa. Il festivo vale ${eur(x)} in più.`,'']}},
  {l:'Chiedi a un collega di scambiare',p:.6,si:{pers:{E:1},fx:()=>{relGruppo(famIn(),1,3)},r:'Il collega accetta: in cambio ti prendi Capodanno. Natale in famiglia salvo.'},no:{fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-2)},r:'Nessuno vuole scambiare. Lavori, e con il muso lungo.'}},
  {l:'Ti dai malato',pers:{C:-2,A:-1},p:.7,si:{fx:()=>{relGruppo(famIn(),1,3)},r:'Natale in famiglia. Il giorno dopo eviti lo sguardo del capo turno.'},no:{fx:()=>{if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf-10)},r:'Ti chiamano dal lavoro mentre sei a tavola. Ti hanno scoperto: richiamo scritto.'}}]});
ev({id:'cal_natale_solo',link:1,k:'Dicembre',t:'Natale da sol{o}',x:'Quest\'anno a Natale non ti aspetta nessuno. Niente genitori, niente partner, nessuna tavolata.',c:[
  {l:'Accetti l\'invito di un amico',cond:()=>vivi(['Amico']).length>0,pers:{E:1},fx:()=>{const a=pick(vivi(['Amico']));a.rapporto=clamp(a.rapporto+6);ricorda(a,'Ti ha invitato a Natale');S.bis.soc=clamp(S.bis.soc+10);mod('felicita',4);return [`La famiglia di ${a.nome} ti accoglie come ${g('un cugino ritrovato','una cugina ritrovata')}.`,'g']}},
  {l:'Volontariato alla mensa',pers:{A:2},fx:()=>{S.karma=clamp(S.karma+4);mod('felicita',3);S.bis.soc=clamp(S.bis.soc+8);return ['Servi il pranzo a chi è più solo di te. A fine giornata ti senti a casa.','g']}},
  {l:'Ti godi la solitudine',sub:'Film, lasagna e coperta',fx:()=>{mod('felicita',pz('E')<0?4:-2);S.bis.stress=clamp(S.bis.stress-6);return ['Nessuno ti chiede niente. Un lusso, quasi.','']}},
  {l:'Ti lasci prendere dalla malinconia',pers:{N:1},fx:()=>{mod('felicita',-5);pesa(4,2);return ['Le luci delle finestre degli altri fanno più male del previsto.','b']}}]});
ev({id:'cal_natale_ragazzi',link:1,k:'Dicembre',t:'Natale e Santo Stefano',x:'I tuoi vogliono tutti a pranzo dai parenti, gli amici organizzano la tombolata la sera di Santo Stefano.',c:[
  {l:'Pranzo coi parenti e tombolata con gli amici',pers:{C:1,E:1},fx:()=>{relGenitori(2);S.bis.soc=clamp(S.bis.soc+8);S.bis.energia=clamp(S.bis.energia-6);return ['Due feste in due giorni. Il 27 dormi fino a mezzogiorno.','g']}},
  {l:'Fai la faccia lunga per tutto il pranzo',pers:{A:-2},fx:()=>{relGenitori(-3);return ['Tua madre ti chiede tre volte che cos\'hai. «Niente.»','b']}},
  {l:'Organizzi tu la tombolata, a casa',pers:{E:2,C:1},costo:()=>P(20),fx:()=>{S.bis.soc=clamp(S.bis.soc+10);mod('felicita',4);vivi(['Amico']).slice(0,4).forEach(a=>a.rapporto=clamp(a.rapporto+3));return ['Casa piena, cartelle sparse ovunque e tua nonna che vince tutto.','g']}}]});

/* ---------- Calendario: le ferie d'agosto ---------- */
ev({id:'cal_ferie_amici',link:1,k:'Agosto',t:'Le prime vacanze tra amici',x:'Per la prima volta in vacanza senza la famiglia: tu, gli amici, un budget ridicolo e troppe idee.',c:[
  {l:'Interrail per l\'Europa',costo:()=>P(700),pers:{O:3,E:1},fx:()=>{S.abil.lingue=clamp(S.abil.lingue+2);segnaVita('viaggio');mod('felicita',8);S.bis.stress=clamp(S.bis.stress-12);vivi(['Amico']).slice(0,3).forEach(a=>a.rapporto=clamp(a.rapporto+5));return ['Sei paesi, quattordici treni e una notte in stazione a Lubiana. Indimenticabile.','g']}},
  {l:'Un\'isola greca in tenda',costo:()=>P(550),pers:{E:2},fx:()=>{mod('felicita',7);S.bis.stress=clamp(S.bis.stress-12);vivi(['Amico']).slice(0,3).forEach(a=>a.rapporto=clamp(a.rapporto+5));return ['Gyros, spiagge e una tenda che non si chiude. Il miglior agosto di sempre.','g']}},
  {l:'Riviera, discoteche e piadine',costo:()=>P(450),pers:{E:2,C:-1},fx:()=>{mod('felicita',6);eff({bev:1});vivi(['Amico']).slice(0,3).forEach(a=>a.rapporto=clamp(a.rapporto+4));return ['Dormite di giorno e vivete di notte. Torni con tre chili in più e due amici nuovi.','g']}},
  {l:'Non parti: lavori per mettere da parte',pers:{C:2},fx:()=>{const x=P(r(600,900));soldi(x);mod('felicita',-2);return [`Le foto degli altri fanno male, il conto in banca un po' meno: ${eur(x)} messi da parte.`,'']}}]});
ev({id:'cal_ferie_coppia',link:1,k:'Agosto',t:'Le prime vacanze insieme',x:d=>`Prima vacanza con ${d.p.nome}. È il test vero: dieci giorni insieme, ventiquattro ore su ventiquattro.`,c:[
  {l:'Al mare',sub:()=>eur(costoFerie('mare')),costo:()=>costoFerie('mare'),fx:d=>{S.fatti.ferieAbit='mare';const ok=chance(.45+affinita(d.p)/200);d.p.intim=clamp((d.p.intim||50)+(ok?6:-3));d.p.pass=clamp((d.p.pass||50)+6);mod('felicita',ok?7:2);return ok?['Ombrellone, libri e cene sul porto. Tornate più innamorati di prima.','g']:['A uno piace la prima fila sotto l\'ombrellone, all\'altro gli scogli deserti. Qualche discussione, ma va.','']}},
  {l:'Un viaggio avventuroso',sub:()=>eur(costoFerie('estero')),costo:()=>costoFerie('estero'),pers:{O:2},fx:d=>{S.fatti.ferieAbit='estero';segnaVita('viaggio');const ok=chance(.4+affinita(d.p)/200+ppz(d.p,'O')*.15);d.p.pass=clamp((d.p.pass||50)+(ok?10:-2));d.p.intim=clamp((d.p.intim||50)+(ok?5:-4));mod('felicita',ok?9:1);return ok?['Zaino in spalla, un autobus perso e una notte sotto le stelle. Vi scoprite una squadra.','g']:[`Lo zaino pesa, i treni sono in ritardo e ${d.p.nome} odia gli ostelli. Tornate stanchi e un po' più distanti.`,'b']}},
  {l:'Una settimana dai parenti di {P}, al paese',pers:{A:1},fx:d=>{vivi(['Suocero']).forEach(p=>p.rapporto=clamp(p.rapporto+6));d.p.imp=clamp((d.p.imp||50)+4);mod('felicita',3);return [`La nonna di ${d.p.nome} ti chiede quando vi sposate. Il primo giorno, a colazione.`,'g']}}]});
ev({id:'cal_ferie_bimbo',link:1,k:'Agosto',t:'Le prime ferie con {P}',x:'Macchina carica fino al tetto: passeggino, lettino da campeggio, scaldabiberon. Per una settimana di vacanza.',c:[
  {l:'Al mare con il passeggino',sub:()=>eur(costoFerie('mare')),costo:()=>costoFerie('mare'),fx:d=>{S.fatti.ferieAbit='mare';mod('felicita',5);S.bis.stress=clamp(S.bis.stress-4);return [`${d.p.nome} dorme sotto l'ombrellone. Voi no, ma va bene così.`,'g']}},
  {l:'Dai nonni, che vi danno una mano',cond:()=>genitoriVivi()||vivi(['Suocero']).length>0,pers:{A:1},fx:d=>{relGenitori(5);vivi(['Suocero']).forEach(p=>p.rapporto=clamp(p.rapporto+4));S.bis.stress=clamp(S.bis.stress-10);S.bis.energia=clamp(S.bis.energia+12);return [`I nonni se ${gp(d.p,'lo','la')} contendono. Voi dormite fino alle nove: un miracolo.`,'g']}},
  {l:'Restate a casa: è troppo complicato',pers:{O:-1},fx:()=>{S.bis.stress=clamp(S.bis.stress-2);mod('felicita',-1);return ['Agosto in città con un neonato e un ventilatore. Il prossimo anno, si vedrà.','']}}]});
ev({id:'cal_ferie_pensione',link:1,k:'Agosto',t:'Agosto da pensionat{o}',x:'Per la prima volta le ferie non finiscono: agosto è uguale a settembre. E a settembre i prezzi scendono.',c:[
  {l:'Una crociera nel Mediterraneo',costo:()=>P(2200),pers:{E:1},fx:()=>{S.fatti.ferieAbit='estero';segnaVita('viaggio');mod('felicita',8);S.bis.soc=clamp(S.bis.soc+10);return ['Buffet a tutte le ore, sei porti in dieci giorni e un ballo di gruppo sul ponte.','g']}},
  {l:'Un mese al mare con i nipoti',cond:()=>vivi(['Nipote']).some(n=>n.eta<14),pers:{A:2},fx:()=>{vivi(['Nipote']).forEach(n=>n.rapporto=clamp(n.rapporto+8));S.bis.energia=clamp(S.bis.energia-10);mod('felicita',7);S.fatti.ferieAbit='mare';return [T('Secchielli, gelati e nessun pisolino. Torni distrutt{o} e felice.'),'g']}},
  {l:'Parti a settembre, in bassa stagione',pers:{C:1},fx:()=>{S.fatti.ferieAbit='mare';mod('felicita',4);S.bis.stress=clamp(S.bis.stress-6);return ['Spiaggia vuota, prezzi dimezzati e l\'acqua ancora calda. Perché non l\'hai fatto prima?','g']}},
  {l:'Resti in città: finalmente è silenziosa',fx:()=>{S.fatti.ferieAbit='casa';S.bis.stress=clamp(S.bis.stress-5);return ['Parcheggi ovunque e il bar tutto per te.','']}}]});
ev({id:'cal_ferie_sola',link:1,k:'Agosto',t:'Le prime ferie da sol{o}',x:'È la prima estate da quando la tua storia è finita. Per anni le vacanze erano «noi». Adesso?',c:[
  {l:'Un viaggio di gruppo organizzato',costo:()=>P(1300),pers:{E:2,O:1},fx:()=>{segnaVita('viaggio');mod('felicita',6);S.bis.soc=clamp(S.bis.soc+12);const c=candidatoAmico();c.eta=Math.max(18,S.eta+r(-8,8));const n=nuovoConoscente(c,'viaggio');return [`Dodici sconosciuti, un pullman e una guida simpatica. Torni con il numero di ${n.nome}.`,'g']}},
  {l:'Un viaggio da sol{o}, finalmente',costo:()=>P(1500),pers:{O:3,N:-2},fx:()=>{segnaVita('viaggio');mod('felicita',7);S.bis.stress=clamp(S.bis.stress-12);return ['Scopri che stai bene in tua compagnia. Una scoperta enorme.','g']}},
  {l:'Dalla tua famiglia',cond:()=>genitoriVivi()||vivi(['Fratello']).length>0,pers:{A:1},fx:()=>{relGenitori(5);vivi(['Fratello']).forEach(f=>f.rapporto=clamp(f.rapporto+4));mod('felicita',3);return ['Nessuno ti chiede niente, tutti ti coccolano un po\'. Serviva.','g']}},
  {l:'Resti a casa a leccarti le ferite',pers:{N:1,E:-1},fx:()=>{mod('felicita',-3);pesa(3,1);return ['Agosto lungo e silenzioso. Ma a settembre stai un po\' meglio.','b']}}]});
ev({id:'cal_ferie_grandi',link:1,k:'Agosto',t:'Vengono ancora in vacanza?',x:d=>`${d.p.nome} ha ${d.p.eta} anni e quest'anno vorrebbe andare in vacanza con gli amici, non con voi.`,c:[
  {l:'Va bene, con qualche regola',pers:{A:1,N:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+6);S.bis.stress=clamp(S.bis.stress+3);return ['Un messaggio al giorno, concordato. Ne arrivano due in dieci giorni.','g']}},
  {l:'Si viene in famiglia, punto',pers:{C:1,A:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-6);ricorda(d.p,'Non l\'hai lasciat'+gp(d.p,'o','a')+' partire con gli amici');return ['Dieci giorni di musi lunghi sotto l\'ombrellone.','b']}},
  {l:'Un compromesso: una settimana a testa',pers:{A:1,C:1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3);return ['Prima la famiglia, poi gli amici. Tutti scontenti a metà, quindi va benissimo.','']}}]});
ev({id:'cal_ferie_soldi',link:1,k:'Agosto',t:'Quest\'anno non si parte?',x:d=>`Le solite ferie ${({mare:'al mare',monti:'in montagna',estero:'all\'estero'})[d.x]||''} costerebbero ${eur(costoFerie(d.x))}. Sul conto ne hai ${eur(S.soldi)}.`,c:[
  {l:'Vacanze a casa, con le gite in giornata',pers:{C:1},fx:()=>{S.bis.stress=clamp(S.bis.stress-4);mod('felicita',-1);return ['Il lago a un\'ora di macchina, panini e asciugamano: un\'avventura low cost.','']}},
  {l:'Parti lo stesso, con la carta di credito',pers:{C:-2},fx:d=>{const c=costoFerie(d.x);soldi(-c);mod('felicita',5);S.bis.stress=clamp(S.bis.stress-10);return [`Una settimana bellissima. A settembre arriva l'estratto conto: ${eur(c)}.`,'']}},
  {l:'Ospite dai parenti al mare',cond:()=>vivi(['Zio','Cugino','Nonno','Fratello']).length>0,pers:{A:1},fx:()=>{mod('felicita',3);S.bis.stress=clamp(S.bis.stress-8);return ['La zia ti cede la stanza degli ospiti. In cambio: lavare i piatti per dieci giorni.','g']}}]});
ev({id:'cal_lavoretto',link:1,k:'Estate',t:'Il primo lavoretto estivo',x:'Un amico di famiglia cerca qualcuno per l\'estate. Sono i primi soldi guadagnati da te.',c:[
  {l:'In gelateria',pers:{C:2,E:1},fx:()=>{const x=P(r(700,1100));soldi(x);S.bis.energia=clamp(S.bis.energia-8);return [`Tre mesi a fare coni e coppette: il braccio destro più forte del sinistro e ${eur(x)} in tasca.`,'g']}},
  {l:'Alla raccolta della frutta',pers:{C:3},fx:()=>{const x=P(r(600,900));soldi(x);mod('salute',1);S.bis.energia=clamp(S.bis.energia-12);return [`Sveglia alle cinque, schiena a pezzi e ${eur(x)} guadagnati con fatica. Ora sai cosa vuol dire.`,'g']}},
  {l:'Animatore al centro estivo',pers:{E:3,A:1},fx:()=>{const x=P(r(500,800));soldi(x);S.bis.soc=clamp(S.bis.soc+10);return [`Trenta bambini urlanti e una canzone del ballo di gruppo che non ti uscirà più dalla testa. ${eur(x)}.`,'g']}},
  {l:'No, l\'estate è per riposare',pers:{C:-1},fx:()=>{mod('felicita',2);S.bis.stress=clamp(S.bis.stress-6);return ['Spiaggia, amici e nessuna sveglia. I soldi li chiederai ai tuoi.','']}}]});

/* ================= INCONTRI: tanti modi di conoscere qualcuno =================
   incontri() (c4_persone.js) sceglie un modello in base a come passi il tempo: w() è il peso, eta() l'età di chi conosci,
   rom la probabilità che da single (dai 16 anni) diventi un incontro romantico (incontro_rom). */
const INC={
  scuola:{w:()=>iscritto()&&S.scuola.stato!=='asilo'?4:0,eta:()=>S.eta<19?Math.max(6,S.eta+r(-1,1)):Math.max(18,S.eta+r(-2,3)),rom:.25},
  parco:{w:()=>S.eta>=3&&S.eta<=7?3:0,eta:()=>Math.max(3,S.eta+r(-1,1)),rom:0},
  lavoro:{w:()=>S.lavoro?3:0,eta:()=>Math.max(18,S.eta+r(-8,8)),rom:.2},
  tramite:{w:()=>S.eta>=10&&vivi(['Amico']).some(a=>a.rapporto>=50&&!a.lontano)?1+rOre('amici')*.4:0,eta:()=>candidatoEta(),rom:.4},
  vicino:{w:()=>S.eta>=6?.8:0,eta:()=>S.eta<14?Math.max(6,S.eta+r(-2,2)):Math.max(18,S.eta+r(-10,10)),rom:.2},
  treno:{w:()=>S.eta>=16&&(S.lavoro||iscritto())?1:0,eta:()=>Math.max(16,S.eta+r(-6,6)),rom:.35},
  cane:{w:()=>S.animali.some(a=>a.t==='Cane')?2:0,eta:()=>Math.max(S.eta<18?8:18,S.eta+r(-10,10)),rom:.3},
  genitori:{w:()=>vivi(['Figlio']).some(f=>f.eta>=3&&f.eta<=13&&!f.fuori&&!f.conEx)?2.5:0,eta:()=>Math.max(22,S.eta+r(-7,7)),rom:.1},
  corso:{w:()=>rOre('hobby')*.5+(rOre('sport')>=3?rOre('sport')*.3:0),eta:()=>candidatoEta(),rom:.45},
  festa:{w:()=>S.eta>=14?rOre('uscite')*.8:0,eta:()=>candidatoEta(),rom:.5},
  volont:{w:()=>rOre('volont')*1.3,eta:()=>Math.max(14,S.eta+r(-12,12)),rom:.4},
  online:{w:()=>S.eta>=14&&S.anno>=2008?Math.min(3,(rOre('social')+rOre('schermi'))*.12):0,eta:()=>candidatoEta(),rom:.35},
  quartiere:{w:()=>S.eta>=60?2.5:0,eta:()=>Math.max(55,S.eta+r(-8,8)),rom:.2},
  viaggio:{w:()=>S.mese===7&&S.eta>=16&&['mare','monti','estero'].includes(S.fatti.ferieAbit)?3:0,eta:()=>candidatoEta(),rom:.5}
};
Object.assign(DOVE,{lavoro:['in pausa pranzo','alla macchinetta del caffè','a una riunione con un altro ufficio'],tramite:['a cena da un amico','alla festa di compleanno di un amico'],vicino:['sul pianerottolo','in ascensore','davanti alle cassette della posta'],treno:['sul treno del mattino','in fila alla stazione','sul regionale in ritardo'],cane:['al parco dei cani','durante la passeggiata con il cane'],genitori:['all\'uscita di scuola dei bambini','alla festa di compleanno di un compagno di classe dei bambini'],corso:['al corso','in palestra'],festa:['a una festa','in un locale','a un aperitivo','a un concerto'],online:['in un gruppo online sulla tua passione','in una partita online'],quartiere:['al bar sotto casa','al circolo','al mercato'],viaggio:['in vacanza','in un ostello','sul traghetto']});
/* chi incontri: un possibile amico dell'età giusta per quel posto */
function candInc(x){const c=candidatoAmico();const m=INC[x];if(m&&m.eta){c.eta=m.eta();c.nome=nomeLibero(c.sesso,S.anno-c.eta)}return c}
function prepInc(d){const c=d.cand||(d.cand=candInc(d.x));if(d.af===undefined)d.af=affinita(c);return c}
const affTesto=d=>d.af>=62?' Vi trovate subito.':d.af<45?' Non siete molto simili.':'';
function faiAmicizia(d,bonus,testo,extra){
  const c=d.cand;
  if(chance(.35+d.af/150+pz('E')*.12+(bonus||0))){
    const p=nuovaPersona('Amico',c.sesso,c.eta,c.cognome,Object.assign({nome:c.nome,pers:c.pers,tr:c.tr,rapporto:r(42,58),dove:d.x},extra||{}));S.bis.soc=clamp(S.bis.soc+5);
    return [(testo||'Tu e {N} diventate {amici}.').replace(/\{N\}/g,p.nome).replace('{amici}',S.sesso==='F'&&p.sesso==='F'?'amiche':'amici'),'g']}
  const n=nuovoConoscente(c,d.x);return [`Vi rivedete un paio di volte, ma per ora ${n.nome} resta tra i tuoi conoscenti.`,'']
}
const conosci=(testo)=>d=>{const n=nuovoConoscente(d.cand,d.x);return [(testo||'{N} entra tra i tuoi conoscenti.').replace(/\{N\}/g,n.nome),'']};
/* ---------- Incontri: tanti modi di conoscere qualcuno ---------- */
ev({id:'inc_scuola',link:1,k:'Persone nuove',t:()=>['universita','magistrale','dottorato','master'].includes(S.scuola.stato)?'In aula studio':'All\'intervallo',x:d=>{const c=prepInc(d);
  if(['universita','magistrale','dottorato','master'].includes(S.scuola.stato))return `In aula studio ${c.nome}, ${c.eta} anni, ti chiede di tenere d'occhio le sue cose mentre prende un caffè. Prepara il tuo stesso esame.${affTesto(d)}`;
  if(S.eta<11)return `All'intervallo ${c.nome} ti offre metà della sua merenda. È nell'altra sezione e gioca a nascondino meglio di tutti.${affTesto(d)}`;
  return `${c.nome}, ${S.eta<14?'della sezione accanto':'di un\'altra classe'}, ti chiede gli appunti di storia. Sembra ${descrPers(c.pers,c.sesso)}.${affTesto(d)}`},c:[
  {l:()=>S.eta<11?'Proponi di giocare insieme':'Proponi di studiare insieme',pers:{E:1},fx:d=>faiAmicizia(d,.05)},
  {l:d=>S.eta<11?'Vi salutate ogni mattina':`${gp(d.cand,'Gli','Le')} presti gli appunti e basta`,fx:conosci()},
  {l:'Fai finta di non sentire',pers:{E:-1},fx:()=>['Torni ai tuoi pensieri.','']}]});
ev({id:'inc_parco',link:1,k:'Persone nuove',t:'Al parco giochi',x:d=>{const c=prepInc(d);return `Al parco ${c.nome}, ${c.eta} anni, ti presta la paletta senza che tu gliela chieda.`},c:[
  {l:'Costruite insieme un castello di sabbia',pers:{E:1,A:1},fx:d=>faiAmicizia(d,.15,'Tu e {N} costruite un castello enorme. Da oggi siete inseparabili al parco.')},
  {l:'Ti tieni la paletta e scappi',pers:{A:-2},fx:()=>{mod('felicita',1);return ['Un pomeriggio da pirata. La mamma ti fa restituire la paletta.','']}},
  {l:'Vi rivedete al parco ogni tanto',fx:conosci('Ogni volta che andate al parco cerchi {N} con lo sguardo.')}]});
ev({id:'inc_lavoro',link:1,k:'Persone nuove',t:'In pausa pranzo',x:d=>{const c=prepInc(d);return `In pausa pranzo ti siedi accanto a ${c.nome}, ${c.eta} anni, ${gp(c,'arrivato','arrivata')} da poco in un altro reparto. Sembra ${descrPers(c.pers,c.sesso)}.${affTesto(d)}`},c:[
  {l:'Proponi di pranzare insieme anche domani',pers:{E:1},fx:d=>faiAmicizia(d,.05,'Il pranzo con {N} diventa un appuntamento fisso. E poi anche la pizza del venerdì.')},
  {l:'Gli spieghi come funziona l\'azienda',pers:{A:2},fx:d=>{const x=faiAmicizia(d,.12,'Gli dai qualche dritta sui capi e sulle macchinette rotte: {N} non lo dimentica. Diventate amici.'.replace('Gli',gp(d.cand,'Gli','Le')));if(S.lavoro)S.lavoro.perf=clamp(S.lavoro.perf+1);return x}},
  {l:'Vi salutate in corridoio',fx:conosci()},
  {l:'Torni al tuo panino in silenzio',pers:{E:-1},fx:()=>['La pausa pranzo resta tua.','']}]});
ev({id:'inc_tramite',link:1,k:'Persone nuove',t:'A cena da {P}',x:d=>{const c=prepInc(d);return `A cena da ${d.p.nome} c'è anche ${c.nome}, ${c.eta} anni, ${gp(c,'un suo vecchio amico','una sua vecchia amica')}. ${d.af>=55?'Avete un sacco di cose in comune.':'Parlate un po\' di tutto.'}`},c:[
  {l:'Organizzate una serata tutti e tre',pers:{E:1},costo:()=>P(40),fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3);return faiAmicizia(d,.2,'Una serata a tre che diventa un\'abitudine: anche {N} entra nel giro.')}},
  {l:'Vi scambiate il numero',fx:conosci()},
  {l:'Passi la sera a parlare solo con {P}',fx:d=>{d.p.rapporto=clamp(d.p.rapporto+2);return ['Vi raccontate tutto come sempre. L\'altra persona se ne va presto.','']}}]});
ev({id:'inc_vicino',link:1,k:'Persone nuove',t:'Sul pianerottolo',x:d=>{const c=prepInc(d);return S.eta<14?`Nel tuo palazzo arriva una famiglia nuova: ${c.nome} ha ${c.eta} anni e un pallone nuovo.`:`Sul pianerottolo trovi ${c.nome}, ${c.eta} anni, tra gli scatoloni del trasloco: ${gp(c,'è appena arrivato','è appena arrivata')} nel palazzo.`},c:[
  {l:()=>S.eta<14?'Scendi a giocare in cortile':'Dai una mano con gli scatoloni',pers:{A:2},fx:d=>faiAmicizia(d,.12,S.eta<14?'Partite infinite in cortile: tu e {N} siete i padroni del palazzo.':'Tre ore di scatoloni e una pizza sul pavimento: {N} è il vicino che tutti vorrebbero.')},
  {l:()=>S.eta<14?'Lo guardi dalla finestra':'Ti presenti e torni a casa',fx:conosci()},
  {l:'Fai finta di non vedere',cond:()=>S.eta>=14,pers:{E:-1,A:-1},fx:()=>['Il nuovo vicino resta un cognome sul campanello.','']}]});
ev({id:'inc_treno',link:1,k:'Persone nuove',t:'Accanto a te sul treno',x:d=>{const c=prepInc(d);return `Sul treno del mattino ${c.nome}, ${c.eta} anni, sta leggendo il libro che hai appena finito. Alza gli occhi e sorride.`},c:[
  {l:'Commenti il finale',pers:{E:1,O:1},fx:d=>faiAmicizia(d,.05,'Mezz\'ora di discussione sul finale. Da quel giorno, tu e {N} prendete sempre lo stesso vagone.')},
  {l:'Vi scambiate i contatti alla fermata',fx:conosci()},
  {l:'Ti rimetti le cuffie',pers:{E:-1},fx:()=>['Il treno arriva in ritardo, come sempre.','']}]});
ev({id:'inc_cane',link:1,k:'Persone nuove',t:'Al parco dei cani',x:d=>{const c=prepInc(d);const a=S.animali.find(x=>x.t==='Cane');return `${a?a.nome:'Il tuo cane'} e il cane di ${c.nome} giocano insieme come vecchi amici. Ogni sera, alla stessa ora.`},c:[
  {l:'Proponi di fare le passeggiate insieme',pers:{E:1},fx:d=>faiAmicizia(d,.15,'Le passeggiate con {N} diventano il momento migliore della giornata. Anche per i cani.')},
  {l:'Chiacchierate solo di cani',fx:conosci()},
  {l:'Cambi orario: preferisci la calma',pers:{E:-1},fx:()=>['Il parco alle sei del mattino è tutto tuo.','']}]});
ev({id:'inc_genitori',link:1,k:'Persone nuove',t:'Fuori da scuola',x:d=>{const c=prepInc(d);const f=vivi(['Figlio']).find(x=>x.eta>=3&&x.eta<=13&&!x.fuori)||{nome:'tuo figlio'};d.f=f.nome;return `All'uscita di scuola ${c.nome}, ${gp(c,'il papà','la mamma')} di un compagno di ${f.nome}, ti chiede se sabato i bambini possono giocare insieme.`},c:[
  {l:'Sabato da voi, merenda per tutti',pers:{A:1,E:1},costo:()=>P(20),fx:d=>faiAmicizia(d,.15,'I bambini giocano, voi parlate per tre ore. Tu e {N} diventate amici di famiglia.')},
  {l:'Ti aggiunge al gruppo dei genitori',fx:conosci('Entri nel gruppo dei genitori della classe: duecento messaggi al giorno. {N} è tra i pochi che scrivono cose utili.')},
  {l:'Dici che siete sempre impegnati',pers:{E:-1},fx:()=>{vivi(['Figlio']).filter(x=>x.eta<14).forEach(x=>x.rapporto=clamp(x.rapporto-2));return ['Il bambino ci resta male. Sabato lo passate sul divano.','b']}}]});
ev({id:'inc_corso',link:1,k:'Persone nuove',t:()=>rOre('hobby')>=rOre('sport')?'Al corso':'In palestra',x:d=>{const c=prepInc(d);return rOre('hobby')>=rOre('sport')?`${cap(doveTesto('hobby'))} ti mettono in coppia con ${c.nome}, ${c.eta} anni. Sembra ${descrPers(c.pers,c.sesso)}.${affTesto(d)}`:`In palestra ${c.nome}, ${c.eta} anni, ti chiede di tenergli i pesi. Poi vi ritrovate a chiacchierare per mezz'ora.`.replace('tenergli',gp(c,'tenergli','tenerle'))},c:[
  {l:'Proponi di vedervi anche fuori',pers:{E:1},fx:d=>faiAmicizia(d,.08)},
  {l:'Siete compagni di corso, e basta',fx:conosci()},
  {l:'Ti concentri su quello che fai',pers:{C:1,E:-1},fx:()=>[T('Migliori in fretta. Da sol{o}.'),'']}]});
ev({id:'inc_festa',link:1,k:'Persone nuove',t:'A una festa',x:d=>{const c=prepInc(d);return `Alla festa di un amico di un amico conosci ${c.nome}, ${c.eta} anni. Sembra ${descrPers(c.pers,c.sesso)}.${affTesto(d)}`},c:[
  {l:'Passate la serata a ridere insieme',pers:{E:2},fx:d=>faiAmicizia(d,.1,'Vi ritrovate a ridere in cucina fino all\'una. Tu e {N} diventate {amici}.')},
  {l:'Vi seguite sui social',cond:()=>S.anno>=2008,fx:conosci()},
  {l:'Vi scambiate il numero',cond:()=>S.anno<2008,fx:conosci()},
  {l:'Torni dal tuo gruppo',fx:()=>['Una bella festa, gente nuova, ma resti con i tuoi.','']}]});
ev({id:'inc_volont',link:1,k:'Persone nuove',t:'Al volontariato',x:d=>{const c=prepInc(d);d.dove=d.dove||pick(['al banco alimentare','al canile','al doposcuola per i bambini','alla raccolta dei vestiti usati']);return `Fai il turno ${d.dove} con ${c.nome}, ${c.eta} anni. Lavorate bene insieme.`},c:[
  {l:'Vi fermate a parlare dopo il turno',pers:{E:1,A:1},fx:d=>faiAmicizia(d,.15)},
  {l:'Vi rivedete al prossimo turno',fx:conosci()},
  {l:'Fai il tuo e torni a casa',fx:()=>['Un turno faticoso e utile.','']}]});
ev({id:'inc_online',link:1,k:'Persone nuove',t:'Online',x:d=>{const c=prepInc(d);return `In un gruppo online sulla tua passione ${c.nome} commenta sempre i tuoi messaggi. Avete gli stessi gusti e lo stesso umorismo. Ha ${c.eta} anni e vive non lontano da te.`},c:[
  {l:'Proponi di vedervi dal vivo',pers:{O:1,E:1},p:.8,si:{fx:d=>faiAmicizia(d,.1,'Dal vivo {N} è proprio come online. Anzi, meglio.')},no:{fx:()=>{mod('felicita',-2);return ['All\'appuntamento non si presenta nessuno. Il profilo sparisce il giorno dopo.','b']}}},
  {l:'Restate amici a distanza',fx:conosci('Vi scrivete ogni tanto: {N} è il tuo contatto preferito del gruppo.')},
  {l:'Esci dal gruppo',pers:{E:-1},fx:()=>['Troppe notifiche. Silenzio.','']}]});
ev({id:'inc_quartiere',link:1,k:'Persone nuove',t:'Al bar sotto casa',x:d=>{const c=prepInc(d);return `Al bar sotto casa ${c.nome}, ${c.eta} anni, commenta il giornale ad alta voce. Su una cosa ha ragione, su tutte le altre no.`},c:[
  {l:'Ti siedi al suo tavolino',pers:{E:1},fx:d=>faiAmicizia(d,.1,'Il caffè delle dieci con {N} diventa un rito. Discutete di tutto, d\'accordo su niente.')},
  {l:'Una partita a carte ogni tanto',fx:conosci('Briscola il giovedì: {N} bara, ma con stile.')},
  {l:'Leggi il tuo giornale',pers:{E:-1},fx:()=>['La pagina dello sport, in pace.','']}]});
ev({id:'inc_viaggio',link:1,k:'Persone nuove',t:'In viaggio',x:d=>{const c=prepInc(d);d.da=d.da||pick(['Torino','Napoli','Bari','Firenze','Verona','Palermo','Trieste','Cagliari','Genova','Bologna'].filter(x=>x!==S.citta));return `In vacanza conosci ${c.nome}, ${c.eta} anni, che viene da ${d.da}. Vi ritrovate allo stesso tavolo ogni sera.`},c:[
  {l:'Promettete di rivedervi',pers:{E:1,O:1},fx:d=>faiAmicizia(d,.05,'Ci rivediamo, ci rivediamo… E invece sì: tu e {N} restate in contatto anche da lontano.',{lontano:true,dove:d.da})},
  {l:'Un saluto e un indirizzo',fx:conosci()},
  {l:'Un bel ricordo e basta',fx:()=>['Le amicizie delle vacanze restano in vacanza.','']}]});
