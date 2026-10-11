/* ================= EMIGRARE (ROADMAP Fase 5.3c) =================
   car_estero (partire?) → car_estero2 (i primi mesi) → car_estero3 (tre anni dopo: stabilirsi, il permesso B e la famiglia, tornare).
   car_marcinelle (8 agosto 1956, solo per chi lavora in miniera a Charleroi). Le funzioni e le mete per epoca sono in c12_estero.js. */

/* le proposte si calcolano una volta e restano in d.x.o (x.meta = una meta scelta dal giocatore, x.off = c'è un'offerta di lavoro vera) */
function offerteDi(d){
  d.x=d.x||{};
  if(!d.x.o){const m=d.x.meta?META_EMI.find(k=>k.id===d.x.meta):null;d.x.o=m?[offertaMeta(m)]:offerteEstero()}
  return d.x.o;
}
ev({id:'car_estero',link:1,k:'Emigrare',t:'Partire?',cond:()=>S.eta>=16&&S.eta<=62&&!S.pensione&&S.carcere===0&&!S.fatti.estero&&!S.azienda&&metaDisponibili().length>0,
  x:d=>{
    const o=offerteDi(d),m=d.x.meta?META_EMI.find(k=>k.id===d.x.meta):null;
    if(m){const ric=requisitiMeta(m);
      return `${m.nota} ${ric.length?`Per ora ti manca: ${ric.join(', ')}.`:'Partire vuol dire rifarsi una vita da zero: una casa, un lavoro, degli amici.'}${m.visto&&S.anno>=m.visto?' Dal 2021, dopo la Brexit, per lavorare nel Regno Unito serve un visto, e di solito un datore di lavoro che ti sponsorizzi.':''}`}
    return S.anno<1985?'Dalle lettere di chi è già partito, e dai racconti al bar, sai che all\'estero cercano gente che abbia voglia di lavorare. Pagano meglio, e il posto c\'è.'
      :'Un conoscente partito qualche anno fa ti scrive: dove lavora cercano gente, e pagano meglio che qui. Ti basterebbe fare la valigia.';
  },
  c:d=>{
    const o=offerteDi(d),out=[];
    for(const f of o){
      const m=META_EMI.find(k=>k.id===f.m),j=JOB[f.j],ric=requisitiMeta(m);
      if(ric.length){out.push({l:`${m.n}: non ancora`,sub:`Ti manca: ${ric.join(', ')}`,_incl:0,fx:()=>[`Per ${m.n} ti manca ancora: ${ric.join(', ')}.`,'']});continue}
      out.push({l:`${m.n} (${m.paese}): ${nomeJob(j,f.liv).toLowerCase()}`,
        sub:()=>`${eur(stipEstero(f))} RAL · ${eur(costoEstero(m))} per partire${stagMeta(m)?' · permesso da stagionale: la famiglia resta a casa':''}`,
        cond:()=>S.soldi>=costoEstero(m),pers:{O:3,E:1},fx:d=>avviaEstero(f,d.x)});
    }
    return out.concat([{l:'Resti dove sei',_incl:0,pers:{C:2},r:'Le valigie restano nell\'armadio. Forse un\'altra volta.'}]);
  }});

ev({id:'car_estero2',link:1,k:'Emigrare',t:'I primi mesi',cond:()=>!!S.fatti.estero&&S.fatti.estero.n===S.citta,
  x:d=>{const E=S.fatti.estero,L=S.lavoro;
    if(L&&L.miniera)return `Sei mesi nel pozzo: la sveglia prima dell'alba, il buio, la polvere nera nei capelli anche la domenica. Dei compagni non capisci metà delle parole, ma sulla paga non ci sono equivoci.`;
    const fam=(E.fam||[]).map(persona).filter(p=>p&&p.vivo);
    if(E.stag)return `Sei mesi a ${E.n}, con il permesso da stagionale. Il lavoro è duro e la baracca è fredda${fam.length?`; a casa ${fam.length>1?'ti aspettano':'ti aspetta'} ${fam.map(p=>p.nome).join(' e ')}, e le lettere ci mettono una settimana`:''}.`;
    return `Sei mesi a ${E.n}. La lingua la capisci a metà, il caffè non sa di niente e la sera, tornando a casa, ti manca il tuo paese.`},
  c:d=>{const E=S.fatti.estero,fam=(E.fam||[]).map(persona).filter(p=>p&&p.vivo),figli=fam.filter(p=>p.ruolo==='Figlio'&&p.eta<18),
      casa=vivi(['Madre','Padre','Partner','Coniuge']).filter(p=>!convive(p)||p.lontano);
    return [
    {l:'Studi la lingua la sera',pers:{C:2},fx:()=>{S.abil.lingue=clamp(S.abil.lingue+5);S.bis.energia=clamp(S.bis.energia-6);return ['Un libro di grammatica e un dizionario consumato. Dopo qualche settimana capisci anche quello che dicono al bar.','g']}},
    {l:'Cerchi gli altri italiani',pers:{E:2,A:1},fx:()=>{S.bis.soc=clamp(S.bis.soc+12);mod('felicita',3);S.abil.lingue=clamp(S.abil.lingue+1);
      const p=chance(.7)?nuovoAmico(true):null;
      return [p?`Il circolo degli italiani, la domenica: una partita a carte, un piatto di pasta. Conosci ${p.nome}.`:'Il circolo degli italiani, la domenica: una partita a carte, un piatto di pasta e, per qualche ora, sembra di essere a casa.','g']}},
    {l:'Ti butti tra la gente del posto',pers:{O:3,E:1},fx:()=>{S.abil.lingue=clamp(S.abil.lingue+4);mod('felicita',-1);S.bis.soc=clamp(S.bis.soc+6);
      const p=chance(.4)?nuovoAmico(true):null;
      return [p?`All'inizio è un esame continuo, poi arrivano le battute. Conosci ${p.nome}, che ti corregge ogni volta che sbagli.`:'All\'inizio è un esame continuo, poi arrivano le battute e i primi inviti a cena.','g']}},
    {l:'Mandi metà dello stipendio a casa',cond:()=>casa.length>0&&S.soldi>=P(1200),pers:{A:2},fx:()=>{const p=pick(casa);soldi(-P(1200));relD(p,8);ricorda(p,'Ti ha mandato i soldi da lontano',3);mod('felicita',2);S.karma=clamp(S.karma+1);return [`Il vaglia parte ogni mese: ${p.nome} lo aspetta più della tua lettera.`,'g']}},
    {l:'Fai venire di nascosto un figlio',sub:'Il permesso non lo prevede',cond:()=>E.stag&&figli.length>0,pers:{E:2,C:-2},fx:()=>{
      const f=figli[0];
      if(chance(.25)){vaiA(E.da,E.prov);mod('felicita',-6);return [`Un vicino ti denuncia. Ti danno ventiquattr'ore per lasciare il paese, e perdi il posto.`,'b']}
      f.conEx=false;f.lontano=false;f.dove=null;E.fam=(E.fam||[]).filter(id=>id!==f.id);mod('felicita',5);pesa(6,3);
      return [`${f.nome} vive nascost${gp(f,'o','a')} in baracca: non può uscire, non può andare a scuola, non può parlare ad alta voce. Ma è con te. Succedeva a tanti: li chiamarono i «bambini proibiti».`,'g']}}];}});

ev({id:'car_estero3',link:1,k:'Emigrare',t:'Tre anni dopo',cond:()=>!!S.fatti.estero&&S.fatti.estero.n===S.citta,
  x:d=>{const E=S.fatti.estero,L=S.lavoro,fam=(E.fam||[]).map(persona).filter(p=>p&&p.vivo);
    if(E.stag)return `Dopo tre anni di stagioni consecutive l'ufficio degli stranieri ti propone il permesso B: annuale, rinnovabile, e soprattutto con il diritto di chiamare la famiglia.${fam.length?` ${fam.map(p=>p.nome).join(' e ')} ${fam.length>1?'aspettano':'aspetta'} solo questo.`:''}`;
    return `Sono passati tre anni da quando sei partit${g('o','a')}. A ${E.n} hai una casa, un lavoro${L?` da ${L.nome.toLowerCase()}`:''} e ormai ti capiscono quando parli. Ma casa, quella vera, dov'è?`},
  c:d=>{const E=S.fatti.estero,fam=(E.fam||[]).map(persona).filter(p=>p&&p.vivo),L=S.lavoro;
    const fuoriStag=()=>{if(E.stag){E.stag=0;if(L)L.stip=Math.round(L.stip/.75)}};
    return [
    {l:'Chiami la famiglia',sub:()=>`${eur(P(2500))} per la casa e il trasloco`,cond:()=>E.stag&&fam.length>0&&S.soldi>=P(2500),pers:{A:2},fx:()=>{soldi(-P(2500));fuoriStag();ricongiungi();S.casa=affittoBase('Bilocale');mod('felicita',12);S.bis.soc=clamp(S.bis.soc+10);
      return [`Per la prima volta in tre anni vi ritrovate tutti insieme. La casa è piccola, ma ha una porta sola, e a chiuderla siete voi.`,'g']}},
    {l:'Prendi il permesso B',sub:'Più stipendio, una casa vera',cond:()=>E.stag&&fam.length===0,pers:{C:1},fx:()=>{fuoriStag();S.casa=affittoBase('Monolocale');mod('felicita',4);return ['Il permesso B cambia tutto: un contratto vero, una stanza tutta per te, la possibilità di restare.','g']}},
    {l:'Ti stabilisci qui',cond:()=>!E.stag,pers:{O:2,C:1},fx:()=>{E.fermo=1;S.abil.lingue=clamp(S.abil.lingue+3);mod('felicita',4);return [`Rinnovi il contratto di affitto e cambi la residenza. ${E.n} non è casa, ma comincia a somigliarle.`,'g']}},
    {l:'Torni in Italia',sub:()=>`Torni a ${E.da}`,pers:{A:1,O:-1},fx:()=>{const da=E.da,prov=E.prov;vaiA(da,prov);mod('felicita',4);return [`Torni a ${da}. Dopo tre anni la lingua, i sapori e i volti ti sembrano più piccoli e più cari.`,'g']}}];}});

/* ---------- Marcinelle: 8 agosto 1956 (in STORIA per tutti; l'evento solo per chi lavora in miniera a Charleroi) ---------- */
ev({id:'car_marcinelle',link:1,k:'Storia',t:'Marcinelle',cond:()=>true,
  x:d=>{const c=squadra().colleghi;d.x=d.x||{};if(d.x.p===undefined)d.x.p=c.length?pick(c).id:0;const p=d.x.p?persona(d.x.p):null;
    return `L'8 agosto 1956, nel pozzo del Bois du Cazier a Marcinelle, un incendio a più di mille metri sotto terra intrappola i minatori. I morti saranno 262, e 136 sono italiani. Tu non eri in quel turno.${p?` ${p.nome}, con cui lavoravi, sì.`:''}`},
  c:d=>[
    {l:'Aspetti con gli altri al cancello',_incl:0,pers:{A:2},fx:d=>{const p=d.x.p?persona(d.x.p):null;
      if(p&&p.vivo){mortePersona(p);ricorda(p,'È morto a Marcinelle',-3)}
      pesa(14,6);mod('felicita',-10);segnaVita('lutto');
      return ['Per giorni nessuno parla. Il cancello, le donne, le liste dei nomi. Dopo, niente è più come prima.','b']}},
    {l:'Torni in Italia',_incl:0,pers:{N:2},fx:d=>{const p=d.x.p?persona(d.x.p):null;if(p&&p.vivo)mortePersona(p);const E=S.fatti.estero,da=E?E.da:S.citta,pr=E?E.prov:S.prov;
      if(E)vaiA(da,pr);pesa(14,6);mod('felicita',-8);return ['Fai la valigia in una notte. In Italia dirai a tutti che in fondo a quel pozzo non ci scendi più.','b']}}]});

COL_EV.push(
  {id:'car_estero',w:2,rip:8,ok:()=>S.eta>=20&&S.eta<=45&&!S.fatti.estero&&!S.azienda&&!sportSq()&&metaPossibili().length>0&&(S.fatti.cercaAltro!==undefined||soddLavoro()<62),d:()=>({x:{off:1}})});
