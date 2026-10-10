/* ================= PERSONE VERE: EVENTI (ROADMAP, Fase 2) =================
   leg_  la vita sociale tra le tue persone (gruppi, coppie e liti tra amici, tua madre e il partner…), aperti da meseSociale()
   mem_  i ricordi che tornano (chi non dimentica), aperti da bisognoAiuto()
   edu_  lo stile da genitore: le scelte hanno gen:{cal,reg} (calore e regole) e segnano il carattere dei figli
   cop_  la coppia di lunga data: decisioni insieme, crisi, terapia di coppia */
const gruppoDi=d=>(S.gruppi||[]).find(g=>g.id===d.g);
const altro=d=>persona(d.q)||{nome:'l\'altra persona',sesso:'M',rapporto:50,pers:{O:50,C:50,E:50,A:50,N:50}};
const nomi=L=>L.length<=1?(L[0]||''):L.slice(0,-1).join(', ')+' e '+L[L.length-1];

/* ---------- Gruppi ---------- */
function occasioneGruppo(G){
  const tipo=G.k.split(':')[0];
  if(['asilo','elementari','medie'].includes(tipo))return 'organizza la festa di fine anno della classe';
  if(tipo==='superiori'||tipo==='universita')return 'organizza una serata tutti insieme';
  if(tipo==='lavoro')return 'organizza la cena di reparto';
  if(tipo==='genitori')return 'organizza la pizzata dei genitori con i bambini';
  if(tipo==='corso')return 'organizza la cena di fine corso';
  if(tipo==='quartiere'||tipo==='vicino')return 'organizza la festa del cortile';
  if(tipo==='online')return 'organizza il primo raduno dal vivo';
  if(tipo==='carcere')return 'organizza una partita a carte in cortile';
  return 'organizza una serata';
}
ev({id:'leg_gruppo',link:1,k:'Il tuo gruppo',t:d=>{const G=gruppoDi(d);return G?G.n:'Il gruppo'},x:d=>{const G=gruppoDi(d);if(!G)return 'Il gruppo si ritrova.';const M=membriVivi(G).map(x=>x.nome);return `Qualcuno ${occasioneGruppo(G)}. Ci saranno ${nomi(M.slice(0,4))}${M.length>4?' e altri':''}.`},c:[
  {l:'Ci vai',pers:{E:1},costo:()=>S.eta>=18?P(30):0,fx:d=>{const G=gruppoDi(d);if(G)membriVivi(G).forEach(m=>{m.rapporto=clamp(m.rapporto+r(3,6));m.ultimo=S.t});S.bis.soc=clamp(S.bis.soc+10);mod('felicita',3);return [varia('grupSi',['Si ride, si mangia troppo e qualcuno racconta una storia che non sapevi.','Una serata semplice: le persone giuste, nessuna fretta.','A fine serata qualcuno propone di rifarlo ogni mese. Lo dite tutti, come sempre.','Foto di gruppo venuta male, ricordo venuto benissimo.']),'g']}},
  {l:'Lo organizzi tu',pers:{E:2,C:1},costo:()=>S.eta>=18?P(60):0,fx:d=>{const G=gruppoDi(d);if(G)membriVivi(G).forEach(m=>{m.rapporto=clamp(m.rapporto+r(5,9));m.ultimo=S.t;ricorda(m,'Hai organizzato la serata del gruppo',1)});S.bis.soc=clamp(S.bis.soc+12);S.bis.energia=clamp(S.bis.energia-6);mod('felicita',5);return ['Liste, messaggi, una tavolata lunghissima. Diventi il collante del gruppo.','g']}},
  {l:'Non vai',pers:{E:-1},fx:d=>{const G=gruppoDi(d);if(G)membriVivi(G).forEach(m=>relD(m,-2));return ['Vedi le foto il giorno dopo. Ti sembrano tutti un po\' più vicini tra loro.','']}}]});
ev({id:'leg_rimpatriata',link:1,k:'Una rimpatriata',t:d=>{const G=gruppoDi(d);return G?`${G.n}, anni dopo`:'La rimpatriata'},x:d=>{const G=gruppoDi(d);if(!G)return 'Una rimpatriata.';const a=Math.round((S.t-(G.fine||G.dal))/12);const M=membriVivi(G).map(x=>x.nome);return `Sono passati ${a} anni. Qualcuno ritrova tutti e organizza una rimpatriata: ci saranno ${nomi(M.slice(0,4))}.`},c:[
  {l:'Ci vai',pers:{E:1,O:1},costo:()=>P(40),fx:d=>{const G=gruppoDi(d);if(!G)return ['Una bella serata.','g'];const M=membriVivi(G);M.forEach(m=>{m.rapporto=clamp(m.rapporto+r(6,12));m.ultimo=S.t});mod('felicita',6);S.bis.soc=clamp(S.bis.soc+12);
    const conR=M.map(m=>[m,ricordoDi(m,1,5)||ricordoDi(m,-1,5)]).filter(x=>x[1]);
    if(conR.length){const [m,ri]=pick(conR);ritorno(m,ri,'rimpatriata');const pos=vRic(ri)>0;if(!pos)m.rapporto=clamp(m.rapporto-6);return [pos?`Capelli bianchi e pance, ma le risate sono le stesse. ${m.nome} a un certo punto alza il bicchiere: si ricorda ancora di quando ${ri.s.charAt(0).toLowerCase()+ri.s.slice(1)}.`:`Capelli bianchi e pance, ma le risate sono le stesse. Solo ${m.nome} resta un po' freddo: non ha dimenticato, ${quanto(ri)}: ${ri.s.toLowerCase()}.`.replace('freddo',gp(m,'freddo','fredda')),pos?'g':'']}
    return ['Capelli bianchi e pance, ma le risate sono le stesse. Vi promettete di rivedervi presto, e questa volta forse sarà vero.','g']}},
  {l:'Preferisci ricordarli com\'erano',pers:{E:-1},fx:()=>{mod('felicita',-1);return ['Guardi le foto della serata. Sono cambiati tutti. Anche tu.','']}}]});

/* ---------- Coppie, liti e gelosie tra le tue persone ---------- */
ev({id:'leg_coppia',link:1,k:'Amici',t:d=>`${d.p.nome} ${eNome(altro(d).nome)}`,x:d=>`${d.p.nome} ${eNome(altro(d).nome)} si sono messi insieme. Te lo dicono quasi in coro, un po' imbarazzati.`.replace('messi',d.p.sesso==='F'&&altro(d).sesso==='F'?'messe':'messi'),c:d=>{const b=altro(d);const cotta=single()&&amorePossibile&&amorePossibile(d.p)&&d.p.rapporto>=65;return [
  {l:'Sei content{o} per loro',pers:{A:2},fx:()=>{d.p.rapporto=clamp(d.p.rapporto+4);b.rapporto=clamp(b.rapporto+4);return ['«Ve l\'avevo detto io!» (non l\'avevi detto). Brindisi per la coppia nuova.','g']}},
  {l:'Ti senti un po\' di troppo',pers:{N:1,E:-1},fx:()=>{S.bis.soc=clamp(S.bis.soc-5);return ['Le uscite a tre diventano uscite a due più uno. Ti ci abituerai.','']}},
  ...(cotta?[{l:`Ti piaceva ${d.p.nome}, e non l'hai mai detto`,pers:{N:2},fx:()=>{mod('felicita',-6);pesa(5,3);return ['Sorridi e fai gli auguri. A casa, la sera, un po\' meno.','b']}}]:[])]}});
ev({id:'leg_lasciati',link:1,k:'Amici',t:d=>`${d.p.nome} ${eNome(altro(d).nome)} si lasciano`,x:d=>`È finita tra ${d.p.nome} ${eNome(altro(d).nome)}. Tutti e due ti chiamano per raccontarti la loro versione.`,c:d=>{const b=altro(d);return [
  {l:d0=>`Stai vicino ${aNome(d.p.nome)}`,pers:{A:1},fx:()=>{d.p.rapporto=clamp(d.p.rapporto+8);ricorda(d.p,gp(d.p,'Gli','Le')+' sei stat'+g('o','a')+' vicin'+g('o','a')+' quando si è lasciat'+gp(d.p,'o','a'),2);b.rapporto=clamp(b.rapporto-6);ricorda(b,'Hai preso le parti dell\'altr'+gp(d.p,'o','a')+' quando vi siete lasciati',-1);return [`Serate a parlare con ${d.p.nome}. ${b.nome} lo viene a sapere e si fa sentire meno.`,'']}},
  {l:d0=>`Stai vicino ${aNome(b.nome)}`,pers:{A:1},fx:()=>{b.rapporto=clamp(b.rapporto+8);d.p.rapporto=clamp(d.p.rapporto-6);ricorda(d.p,'Hai preso le parti dell\'altr'+gp(b,'o','a')+' quando vi siete lasciati',-1);return [`Stai con ${b.nome}. ${d.p.nome} ci resta male.`,'']}},
  {l:'Resti neutrale e ascolti entrambi',pers:{A:2,N:-1},fx:()=>{d.p.rapporto=clamp(d.p.rapporto+2);b.rapporto=clamp(b.rapporto+2);S.bis.energia=clamp(S.bis.energia-6);return ['Due versioni, entrambe vere a metà. Sei stanc{o}, ma nessuno si sente tradito.'.replace('stanc{o}',g('stanco','stanca')),'g']}}]}});
ev({id:'leg_lite',link:1,k:'Amici',t:d=>`${d.p.nome} contro ${altro(d).nome}`,x:d=>`${d.p.nome} ${eNome(altro(d).nome)} hanno litigato di brutto e non si parlano più. Ognuno vorrebbe che tu stessi dalla sua parte.`,c:d=>{const b=altro(d);return [
  {l:'Provi a farli fare pace',pers:{A:2,E:1},p:()=>.35+pz('A')*.15+pz('E')*.1,si:{fx:()=>{const L=legameTra(d.p,b);if(L)L.f=clamp(L.f+25);d.p.rapporto=clamp(d.p.rapporto+5);b.rapporto=clamp(b.rapporto+5);ricorda(d.p,'Hai fatto fare pace al gruppo',1)},r:'Una pizza in tre, un silenzio lunghissimo, poi qualcuno ride. Pace fatta.'},no:{fx:()=>{d.p.rapporto=clamp(d.p.rapporto-2);b.rapporto=clamp(b.rapporto-2)},r:'Finite tutti e tre a urlare. Almeno ci hai provato.'}},
  {l:d0=>`Dai ragione ${aNome(d.p.nome)}`,pers:{A:-1},fx:()=>{d.p.rapporto=clamp(d.p.rapporto+6);ricorda(d.p,'Hai preso le sue difese',1);b.rapporto=clamp(b.rapporto-8);ricorda(b,'Non hai preso le sue difese',-1);return [`${d.p.nome} ti è grat${gp(d.p,'o','a')}. ${b.nome} un po' meno.`,'']}},
  {l:d0=>`Dai ragione ${aNome(b.nome)}`,pers:{A:-1},fx:()=>{b.rapporto=clamp(b.rapporto+6);ricorda(b,'Hai preso le sue difese',1);d.p.rapporto=clamp(d.p.rapporto-8);ricorda(d.p,'Non hai preso le sue difese',-1);return [`${b.nome} ti ringrazia. ${d.p.nome} si offende.`,'']}},
  {l:'Non ti immischi',pers:{E:-1},fx:()=>{const L=legameTra(d.p,b);if(L)L.f=clamp(L.f-15);return ['Li vedi separatamente per un po\'. Il gruppo è più piccolo, adesso.','']}}]}});
ev({id:'leg_madre_partner',link:1,k:'Famiglia',t:'Tua madre e {P}',x:d=>`Tua madre e ${d.p.nome} non si sopportano. Ogni pranzo della domenica è una partita a scacchi, e tu sei la scacchiera.`,c:d=>{const m=altro(d);return [
  {l:'Difendi {P}',pers:{A:-1,E:1},fx:()=>{d.p.imp=clamp((d.p.imp||50)+6);d.p.intim=clamp((d.p.intim||50)+4);m.rapporto=clamp(m.rapporto-8);ricorda(m,'Hai difeso il partner contro di lei',-1);return [`${d.p.nome} lo apprezza moltissimo. Tua madre ti tiene il muso per settimane.`,'']}},
  {l:'Dai ragione a tua madre',pers:{A:1,N:1},fx:()=>{m.rapporto=clamp(m.rapporto+5);d.p.imp=clamp((d.p.imp||50)-8);d.p.intim=clamp((d.p.intim||50)-5);ricorda(d.p,'Hai dato ragione a tua madre contro di '+gp(d.p,'lui','lei'),-2);return [`Tua madre è soddisfatta. In macchina, al ritorno, ${d.p.nome} non dice una parola.`,'b']}},
  {l:'Li fai parlare, a quattr\'occhi',pers:{A:2,O:1},p:.5,si:{fx:()=>{const L=legame(d.p,m,'amici',60);m.rapporto=clamp(m.rapporto+3);d.p.intim=clamp((d.p.intim||50)+3)},r:'Un caffè lunghissimo. Escono che si danno del tu e si scambiano una ricetta.'},no:{fx:()=>{pesa(4,2)},r:'Peggio di prima. Ma almeno ora si dicono le cose in faccia.'}},
  {l:'Diradi i pranzi in famiglia',pers:{E:-1},fx:()=>{m.rapporto=clamp(m.rapporto-3);return ['Una domenica al mese invece di quattro. La tregua regge.','']}}]}});
ev({id:'leg_gelosia',link:1,k:'Coppia',t:'Gelosia',x:d=>`${d.p.nome} non sopporta il tuo rapporto con ${altro(d).nome}. «Vi sentite tutti i giorni. Non ti sembra un po' troppo?»`,c:d=>{const b=altro(d);return [
  {l:'Coinvolgi {P}: uscite tutti insieme',pers:{E:1,A:1},fx:()=>{legame(d.p,b,'amici',affNpc(d.p,b));d.p.intim=clamp((d.p.intim||50)+3);return affNpc(d.p,b)>=50?[`Una cena a tre: ${d.p.nome} e ${b.nome} scoprono di andare d'accordo. Gelosia sparita.`,'g']:[`Una cena a tre un po' rigida. Ma almeno ora ${d.p.nome} sa chi è ${b.nome}.`,'']}},
  {l:d0=>`Vedi meno ${b.nome}`,pers:{A:1,N:1},fx:()=>{b.rapporto=clamp(b.rapporto-10);ricorda(b,'Ti sei allontanat'+g('o','a')+' per gelosia del tuo partner',-1);d.p.imp=clamp((d.p.imp||50)+4);return [`${b.nome} se ne accorge e ci resta male. ${d.p.nome} si tranquillizza.`,'']}},
  {l:'Dici che non hai niente da nascondere',pers:{A:-1,E:1},fx:()=>{d.p.intim=clamp((d.p.intim||50)-4);return ['Hai ragione tu, forse. Ma la discussione lascia un po\' di freddo.','']}}]}});

/* ---------- Chi non dimentica ---------- */
const ricordoT=d=>(d.p.ricordi||[]).find(m=>m.t===d.mt)||ricordoDi(d.p,1);
ev({id:'mem_aiuto',link:1,k:'Chi non dimentica',t:'{P} si fa viv{po}',x:d=>{const m=ricordoT(d);return `${MOTIVI_AIUTO[d.x]||'Ti senti a terra'}. ${d.p.nome} si fa viv${gp(d.p,'o','a')}: non ha dimenticato${m?`, ${quanto(m)}: ${m.s.charAt(0).toLowerCase()+m.s.slice(1)}`:''}. «Adesso tocca a me.»`},c:[
  {l:'Accetti il suo aiuto',pers:{A:1,N:-1},fx:d=>{const m=ricordoT(d);ritorno(d.p,m,'aiuto');d.p.rapporto=clamp(d.p.rapporto+6);S.bis.stress=clamp(S.bis.stress-10);mod('felicita',4);
    if(d.x==='lavoro'){S.fatti.cercaAltro=S.t;const x=P(r(400,1200));soldi(x);return [`${d.p.nome} ti presta ${eur(x)} senza fretta di riaverli e ti passa il contatto di chi cerca personale.`,'g']}
    if(d.x==='carcere')return [`${d.p.nome} viene a trovarti ogni mese. Il colloquio del giovedì diventa la cosa più importante della settimana.`,'g'];
    return [pick([`Per settimane ${d.p.nome} passa con la spesa, ti trascina fuori, risponde al telefono a qualsiasi ora.`,`${d.p.nome} si prende qualche giorno e ti sta vicino. Non serve dire niente.`]),'g']}},
  {l:'Ringrazi, ma preferisci cavartela',pers:{E:-1,C:1},fx:d=>{const m=ricordoT(d);ritorno(d.p,m,'aiuto');d.p.rapporto=clamp(d.p.rapporto+2);return ['«Se cambi idea, io ci sono.» Lo sai. Ed è già tanto.','']}},
  {l:'Ti commuovi e {lo} abbracci',pers:{A:1,E:1},fx:d=>{const m=ricordoT(d);ritorno(d.p,m,'aiuto');d.p.rapporto=clamp(d.p.rapporto+8);mod('felicita',6);S.bis.stress=clamp(S.bis.stress-6);ricorda(d.p,'Vi siete stati vicini nei momenti difficili',1);return ['Certe cose tornano indietro. Non te l\'aspettavi, e proprio per questo vale doppio.','g']}}]});

/* ---------- Crescere i figli: lo stile da genitore ---------- */
const figlioCasa=(a,b)=>{const f=p=>p.eta>=a&&p.eta<=b&&!p.fuori&&!p.conEx;f.desc=`il figlio ha ${a}–${b} anni e vive con te`;return f};
ev({id:'edu_capriccio',min:20,max:55,w:2.5,rip:2,chi:['Figlio'],pc:figlioCasa(2,5),t:'Il capriccio',x:'Al supermercato {P} si butta per terra: vuole le caramelle della cassa. Tutti vi guardano.',c:[
  {l:'Non cedi, con calma',gen:{reg:4,cal:1},fx:d=>{cambiaPersNpc(d.p,'C',1.5)},r:'Dieci minuti di urla, poi passa. La prossima volta ci prova un po\' meno.'},
  {l:'Cedi, per non dare spettacolo',gen:{reg:-4,cal:1},fx:d=>{cambiaPersNpc(d.p,'C',-1.5);d.p.rapporto=clamp(d.p.rapporto+2)},r:'Caramelle e silenzio. {P} ha imparato una cosa nuova, e non è quella giusta.'},
  {l:'Alzi la voce',gen:{reg:3,cal:-3},fx:d=>{cambiaPersNpc(d.p,'N',1.5);d.p.rapporto=clamp(d.p.rapporto-2)},r:'Smette subito, spaventat{po}. Ti senti peggio tu.'}]});
ev({id:'edu_buio',min:20,max:55,w:2.5,rip:2,chi:['Figlio'],pc:figlioCasa(3,7),t:'Il mostro nell\'armadio',x:'Sono le due di notte. {P} è in piedi accanto al letto: ha paura del buio e vuole dormire con voi.',c:[
  {l:'{Lo} fai dormire nel lettone',gen:{cal:3,reg:-2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3)},r:'Dorme in diagonale, con un piede nel tuo fianco. Per settimane.'},
  {l:'Lucina, una storia, poi nel suo letto',gen:{cal:2,reg:2},fx:d=>{cambiaPersNpc(d.p,'N',-1.5);ricorda(d.p,'Hai scacciato i mostri dall\'armadio',1)},r:'Controllate insieme l\'armadio: niente mostri. Si addormenta tenendoti la mano.'},
  {l:'Deve imparare: nel suo letto, porta chiusa',gen:{cal:-3,reg:3},fx:d=>{cambiaPersNpc(d.p,'N',1.5)},r:'Piange per un\'ora, poi si addormenta. La lucina resta accesa per anni.'}]});
ev({id:'edu_compiti',min:24,max:60,w:2.5,rip:2,chi:['Figlio'],pc:figlioCasa(6,10),t:'I compiti',x:'{P} ha una pagina di problemi di matematica e nessuna voglia di farli.',c:[
  {l:'Glieli fai tu, così si fa prima',gen:{cal:1,reg:-3},fx:d=>{cambiaPersNpc(d.p,'C',-1.5);d.p.voto=clamp((d.p.voto||50)+1)},r:'Dieci minuti e fatto. La maestra scrive «Ottimo lavoro!»: complimenti a te.'},
  {l:'Ti siedi accanto e {lo} aiuti a ragionare',gen:{cal:3,reg:2},fx:d=>{cambiaPersNpc(d.p,'C',1.5);d.p.voto=clamp((d.p.voto||50)+3);d.p.rapporto=clamp(d.p.rapporto+3)},r:'Un\'ora lunghissima. Ma alla fine il problema lo risolve da sol{po}, e si vede quanto è fier{po}.'},
  {l:'Si arrangia: tu hai da fare',gen:{cal:-2,reg:-1},fx:d=>{d.p.voto=clamp((d.p.voto||50)-1);cambiaPersNpc(d.p,'N',.8)},r:'Li fa male e di corsa. Domani si vedrà.'}]});
ev({id:'edu_bugia',min:24,max:62,w:2.5,rip:2,chi:['Figlio'],pc:figlioCasa(7,13),t:'La bugia',x:'Scopri che {P} ti ha mentito: il compito di storia non era andato bene, era un quattro.',c:[
  {l:'Punizione: un mese senza uscire',gen:{reg:4,cal:-2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-4);cambiaPersNpc(d.p,'C',1)},r:'Mese lunghissimo per tutti. La prossima bugia sarà più difficile da scoprire.'},
  {l:'Ne parlate: perché non me l\'hai detto?',gen:{cal:3,reg:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3);cambiaPersNpc(d.p,'A',1);ricorda(d.p,'Hai capito invece di punire',1)},r:'«Avevo paura che ti arrabbiassi.» Ci pensi tutta la sera.'},
  {l:'Lasci correre',gen:{reg:-3},fx:d=>{cambiaPersNpc(d.p,'C',-1)},r:'Un quattro non è la fine del mondo. Una bugia però sì, un pochino.'}]});
ev({id:'edu_sport',min:25,max:60,w:2.5,rip:2,chi:['Figlio'],pc:figlioCasa(7,12),t:'Voglio smettere',x:'Dopo due mesi di nuoto {P} vuole smettere: «È noioso e l\'acqua è fredda.»',c:[
  {l:'Si finisce l\'anno, poi si vedrà',gen:{reg:3,cal:1},fx:d=>{cambiaPersNpc(d.p,'C',2)},r:'Finisce l\'anno brontolando. A giugno vince una medaglia e cambia idea.'},
  {l:'Provate insieme un altro sport',gen:{cal:3},fx:d=>{cambiaPersNpc(d.p,'O',1.5);d.p.rapporto=clamp(d.p.rapporto+3)},r:'Basket, poi danza, poi scherma. Alla quarta prova trova quello giusto.'},
  {l:'Smette subito',gen:{reg:-3},fx:d=>{cambiaPersNpc(d.p,'C',-1.5)},r:'Il borsone resta in un angolo. Il divano vince.'}]});
ev({id:'edu_schermi',min:28,max:62,w:2.5,rip:2,chi:['Figlio'],pc:p=>figlioCasa(9,14)(p)&&S.anno>=2010,t:'Lo schermo',x:'{P} passa i pomeriggi davanti al telefono. A cena risponde a monosillabi, con un occhio sullo schermo.',c:[
  {l:'Regole chiare per tutti: niente schermi a tavola',gen:{reg:3,cal:2},fx:d=>{cambiaPersNpc(d.p,'C',1);d.p.voto=clamp((d.p.voto||50)+2)},r:'Valgono anche per te, ed è la parte difficile. Dopo un mese a cena si parla di nuovo.'},
  {l:'Glielo togli per una settimana',gen:{reg:4,cal:-3},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-6);ricorda(d.p,'Gli hai tolto il telefono per una settimana'.replace('Gli',gp(d.p,'Gli','Le')),-1)},r:'Una settimana di guerra fredda. Poi tutto torna come prima.'},
  {l:'Lasci stare: lo fanno tutti',gen:{reg:-3},fx:d=>{cambiaPersNpc(d.p,'C',-1);d.p.voto=clamp((d.p.voto||50)-2)},r:'Lo schermo vince. Anche il tuo, a dire il vero.'}]});
ev({id:'edu_fratelli',min:28,max:60,w:2.5,rip:2,chi:['Figlio'],pc:p=>figlioCasa(4,12)(p)&&vivi(['Figlio']).filter(figlioCasa(3,14)).length>=2,t:'Fratelli',x:d=>{const o=vivi(['Figlio']).find(f=>f!==d.p&&figlioCasa(3,14)(f));d.q=o?o.id:null;return `${d.p.nome} ${eNome(o?o.nome:'suo fratello')} litigano per tutto: il telecomando, il posto in macchina, l'ultimo biscotto.`},c:[
  {l:'Li separi e punisci entrambi',gen:{reg:3,cal:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-2);const o=persona(d.q);if(o)o.rapporto=clamp(o.rapporto-2)},r:'Silenzio in casa. Per un\'ora.'},
  {l:'Li lasci risolvere da soli',gen:{cal:1,reg:1},fx:d=>{cambiaPersNpc(d.p,'A',1);const o=persona(d.q);if(o)cambiaPersNpc(o,'A',1)},r:'Trattative, alleanze, tradimenti. Alla fine trovano un accordo che nessun adulto capisce.'},
  {l:'Difendi il più piccolo',gen:{cal:1,reg:-1},fx:d=>{const o=persona(d.q);const gr=o&&o.eta>d.p.eta?o:d.p;gr.rapporto=clamp(gr.rapporto-5);ricorda(gr,'Hai sempre preso le parti del più piccolo',-1)},r:'Il più grande se lo ricorderà per anni. Lo dirà anche al pranzo di Natale, da adulto.'}]});
ev({id:'edu_cuore',min:30,max:65,w:2.5,rip:2,chi:['Figlio'],pc:figlioCasa(13,17),t:'Il cuore spezzato',x:'{P} è chius{po} in camera da due giorni. La prima storia d\'amore è finita.',c:[
  {l:'Gelato, divano e ascolto',gen:{cal:4},fx:d=>{cambiaPersNpc(d.p,'N',-1);d.p.rapporto=clamp(d.p.rapporto+6);ricorda(d.p,gp(d.p,'Gli','Le')+' sei stat'+g('o','a')+' vicin'+g('o','a')+' per il primo cuore spezzato',1)},r:'Non dice quasi niente. Poi, all\'improvviso, racconta tutto. Ti senti un genitore fortunato.'},
  {l:'«Passerà, ne troverai altri cento»',gen:{cal:-1},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-2)},r:'Hai ragione, ma non è quello che voleva sentirsi dire.'},
  {l:'{Lo} spingi a uscire con gli amici',gen:{cal:1,reg:1},fx:d=>{cambiaPersNpc(d.p,'E',1)},r:'Esce controvoglia, torna sorridendo. Gli amici a volte curano meglio dei genitori.'}]});
ev({id:'edu_uscita',min:30,max:65,w:2.5,rip:2,chi:['Figlio'],pc:figlioCasa(14,16),t:'La prima uscita di sera',x:'Sabato c\'è una festa e {P} chiede di tornare a mezzanotte. È la prima volta.',c:[
  {l:'Mezzanotte, con un messaggio quando arriva',gen:{cal:2,reg:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3);cambiaPersNpc(d.p,'C',1)},r:'Il messaggio arriva alle 21:04: «Arrivat{po}». Alle 23:58 la chiave gira nella porta.'},
  {l:'Alle dieci, non un minuto di più',gen:{reg:4,cal:-2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-5);ricorda(d.p,'Alla sua prima festa l\'hai fatt'+gp(d.p,'o','a')+' tornare alle dieci',-1)},r:'Torna alle dieci, l\'unic{po} della festa. Non ti parla per due giorni.'},
  {l:'Quando vuole: ti fidi',gen:{reg:-4,cal:1},fx:d=>{cambiaPersNpc(d.p,'C',-1);if(chance(.3)){pesa(4,2);return ['Rientra alle tre, senza avvisare. Tu sei sveglio dall\'una.'.replace('sveglio',g('sveglio','sveglia')),'b']}return ['Torna all\'una e mezza, felice. Hai fatto bene a fidarti, stavolta.','']}}]});
ev({id:'edu_capelli',min:28,max:62,w:2.5,once:1,chi:['Figlio'],pc:figlioCasa(13,15),t:'I capelli verdi',x:'{P} torna a casa con i capelli verdi. Ha fatto tutto da sol{po}, con un\'amica, in bagno.',c:[
  {l:'È una sua scelta: va bene',gen:{cal:3,reg:-1},fx:d=>{cambiaPersNpc(d.p,'O',1.5);d.p.rapporto=clamp(d.p.rapporto+4)},r:'Ti chiede cosa ne pensi. «Sei tu.» Sorride come non faceva da mesi.'},
  {l:'Domani dal parrucchiere a sistemare',gen:{reg:3,cal:-3},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-6);ricorda(d.p,'Le hai fatto tingere di nuovo i capelli'.replace('Le',gp(d.p,'Gli','Le')),-1)},r:'Il verde se ne va. Il broncio, per un bel po\', no.'},
  {l:'Ridete insieme del bagno tutto verde',gen:{cal:2},fx:d=>{d.p.rapporto=clamp(d.p.rapporto+3)},r:'La vasca resterà verdina per sempre. Diventa una storia di famiglia.'}]});
ev({id:'edu_lavoretto',min:32,max:65,w:2.5,once:1,chi:['Figlio'],pc:figlioCasa(15,17),t:'Lo scooter',x:'{P} vuole lo scooter. Propone di lavorare d\'estate per pagarne metà.',c:[
  {l:'{Lo} incoraggi: metà tu, metà {lui}',gen:{cal:1,reg:2},sub:()=>eur(P(900)),costo:()=>P(900),fx:d=>{cambiaPersNpc(d.p,'C',2);d.p.rapporto=clamp(d.p.rapporto+4)},r:'Un\'estate in gelateria e lo scooter arriva a settembre. Lo lava ogni domenica.'},
  {l:'Prima la scuola, poi si vedrà',gen:{reg:3},fx:d=>{d.p.rapporto=clamp(d.p.rapporto-3)},r:'Niente lavoretto, niente scooter. Pazienza, dice. Ma non sembra pazienza.'},
  {l:'Glielo compri tu',gen:{cal:2,reg:-3},sub:()=>eur(P(1800)),costo:()=>P(1800),fx:d=>{cambiaPersNpc(d.p,'C',-1.5);d.p.rapporto=clamp(d.p.rapporto+5)},r:'Felicità immediata. Lo graffia la prima settimana.'}]});

/* ---------- La coppia di lunga data ---------- */
const DECISIONI=[
  {x:'A {P} hanno offerto un lavoro migliore in un\'altra città, a tre ore da qui.',si:'Ne parlate per notti intere. Alla fine trovate una via di mezzo: un anno di prova, poi si decide insieme.'},
  {x:'{P} vorrebbe una casa più grande, tu preferiresti risparmiare.',si:'Fate i conti insieme, con un foglio di calcolo e tanta pazienza. Una stanza in più, ma senza svenarvi.'},
  {x:'{P} propone un conto in comune per tutte le spese. Tu non sei convint{o}.',si:'Un conto comune per la casa e ognuno il suo per il resto. Funziona.'},
  {x:'La famiglia di {P} vorrebbe vedervi a pranzo ogni domenica.',si:'Una domenica sì e una no, alternando le famiglie. Tutti scontenti a metà: è un buon compromesso.'}];
ev({id:'cop_decisione',min:24,max:70,rip:5,chi:['Partner','Coniuge'],pc:p=>p.conv,t:'Una decisione insieme',x:d=>{d.i=d.i!==undefined?d.i:r(0,DECISIONI.length-1);return T(DECISIONI[d.i].x,d)},c:[
  {l:'Decidete insieme, a metà strada',pers:{A:2,C:1},fx:d=>{d.p.intim=clamp((d.p.intim||50)+5);d.p.imp=clamp((d.p.imp||50)+4);ricorda(d.p,'Avete deciso insieme le cose importanti',1);return [T(DECISIONI[d.i||0].si,d),'g']}},
  {l:'Fai valere la tua idea',pers:{A:-2,E:1},fx:d=>{d.p.intim=clamp((d.p.intim||50)-4);d.p.imp=clamp((d.p.imp||50)-4);ricorda(d.p,'Hai deciso tu per tutti e due',-1);return ['Vinci la discussione. La serata, un po\' meno.','']}},
  {l:'Lasci decidere a {lui}',pers:{A:1,N:1},fx:d=>{d.p.intim=clamp((d.p.intim||50)+2);pesa(2,1);return [`${d.p.nome} è content${gp(d.p,'o','a')}. Tu, più o meno: lo saprai fra qualche mese.`,'']}}]});
ev({id:'cop_soldi',min:24,max:75,rip:8,chi:['Partner','Coniuge'],pc:p=>p.conv&&p.pers&&Math.abs(p.pers.C-S.pers.C)>=25,t:'I soldi',x:d=>d.p.pers.C>S.pers.C?'{P} tiene un quaderno con tutte le spese di casa. Le tue sono sottolineate in rosso.':'{P} ha comprato l\'ennesima cosa inutile online. Il conto comune piange.',c:[
  {l:'Un budget mensile, deciso insieme',pers:{C:2,A:1},fx:d=>{d.p.intim=clamp((d.p.intim||50)+3);d.p.imp=clamp((d.p.imp||50)+3)},r:'Una cifra per la casa, una per i risparmi, una a testa per i capricci. Litigate molto meno.'},
  {l:'Litigate, come sempre',pers:{A:-1,N:1},fx:d=>{d.p.intim=clamp((d.p.intim||50)-4);pesa(3,2)},r:'La solita discussione, con le solite frasi. Cambiano solo le cifre.'},
  {l:'Lasci perdere: ognuno è fatto a modo suo',pers:{A:1},fx:d=>{d.p.intim=clamp((d.p.intim||50)+1)},r:'Fai finta di non vedere. Funziona finché il conto regge.'}]});
ev({id:'cop_crisi',link:1,k:'Coppia',t:'La crisi',x:'Con {P} non va da mesi. Litigate per tutto, oppure non vi parlate affatto. Una sera {lui} lo dice ad alta voce: «Così non funziona.»',c:[
  {l:'Proponi una terapia di coppia',sub:()=>`Sei mesi, circa ${eur(P(80))} a seduta`,pers:{A:2,O:1},fx:d=>{S.terapia={pid:d.p.id,fine:S.t+6,t0:S.t};d.p.imp=clamp((d.p.imp||50)+5);return [`${d.p.nome} accetta. Il primo appuntamento è martedì: tutti e due nervosi, sulla stessa scomoda poltroncina.`,'']}},
  {l:'Parlate davvero, tutta la notte',pers:{E:1,A:1},p:d=>.35+pz('A')*.15+ppz(d.p,'A')*.15,si:{fx:d=>{d.p.intim=clamp((d.p.intim||50)+10);d.p.rapporto=clamp(d.p.rapporto+10);ricorda(d.p,'Avete salvato la vostra storia parlando una notte intera',2)},r:'Alle quattro del mattino state ancora parlando. Per la prima volta da mesi, vi ascoltate.'},no:{fx:d=>{d.p.intim=clamp((d.p.intim||50)-5);pesa(4,2)},r:'Vi dite tutto, anche le cose che non si dicono. All\'alba siete più lontani di prima.'}},
  {l:'Una pausa di riflessione',pers:{N:1},fx:d=>{d.p.pass=clamp((d.p.pass||50)+6);d.p.imp=clamp((d.p.imp||50)-6);pesa(5,3);return ['Qualche settimana separati per capire. La casa è silenziosissima.','']}},
  {l:'È finita',pers:{N:1},fx:d=>chiudiRelazione(d.p,'Vi lasciate. Dopo anni, con {P} finisce qui.')}]});
ev({id:'cop_terapia_fine',link:1,k:'Coppia',t:'Sei mesi dopo',x:'Ultima seduta di terapia di coppia. La psicologa vi chiede: «Allora, come state?»',c:d=>{const ok=chance(.45+pz('A')*.15+ppz(d.p,'A')*.15+((d.p.imp||50)-50)/200);d.ok=ok;return ok?[
  {l:'Meglio. Molto meglio.',pers:{A:2,N:-2},fx:()=>{d.p.intim=clamp((d.p.intim||50)+15);d.p.imp=clamp((d.p.imp||50)+10);d.p.rapporto=clamp(d.p.rapporto+12);ricorda(d.p,'Avete fatto insieme la terapia di coppia e ne siete usciti',2);mod('felicita',8);return ['Avete imparato a litigare senza ferirvi. Ogni tanto ve lo ricordate a vicenda, ridendo.','g']}}]:[
  {l:'Vi lasciate, ma senza odio',pers:{A:1},fx:()=>{const t=chiudiRelazione(d.p,'La terapia vi ha aiutato a capire che è meglio lasciarsi. Vi salutate senza rancore.');d.p.rancore=0;return t}},
  {l:'Ci riprovate lo stesso',pers:{C:1,N:1},fx:()=>{d.p.imp=clamp((d.p.imp||50)+4);pesa(5,3);return ['Non è cambiato molto. Ma nessuno dei due ha voglia di arrendersi.','']}}]}});
ev({id:'cop_vent_anni',min:40,max:95,once:1,chi:['Coniuge'],pc:p=>p.nozze!==undefined&&S.t-p.nozze>=240,t:'Vent\'anni insieme',x:'Vent\'anni di matrimonio con {P}. Stasera, a cena, tirate fuori le foto.',c:[
  {l:'Ricordate i momenti più belli',pers:{A:1},fx:d=>{const m=ricordoDi(d.p,1,10);d.p.intim=clamp((d.p.intim||50)+6);d.p.pass=clamp((d.p.pass||50)+6);mod('felicita',6);if(m){ritorno(d.p,m,'anniversario');return [`Ridete, vi commuovete. ${d.p.nome} si ricorda di una cosa di tanti anni fa: ${m.s.charAt(0).toLowerCase()+m.s.slice(1)}.`,'g']}return ['Ridete, vi commuovete. Eravate così giovani.','g']}},
  {l:'Vi dite anche le cose difficili',pers:{O:1,A:1},fx:d=>{const m=ricordoDi(d.p,-1,10);d.p.imp=clamp((d.p.imp||50)+4);if(m){ritorno(d.p,m,'anniversario');m.v=Math.min(0,(m.v||-1)+1);return [`${d.p.nome} confessa che non ha mai dimenticato una cosa: ${m.s.charAt(0).toLowerCase()+m.s.slice(1)}. Ne parlate. Finalmente.`,'']}return ['Anche le crisi, anche i silenzi. Siete ancora qui, ed è questo il punto.','g']}}]});
