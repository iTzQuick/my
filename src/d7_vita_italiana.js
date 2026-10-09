/* ================= EVENTI: famiglia e regole italiane (separazione, adozione, eredità) ================= */

/* ---------- Separazione con figli minorenni ---------- */
ev({id:'affido',link:1,k:'Famiglia',t:'I figli',x:d=>{const n=vivi(['Figlio']).filter(f=>f.eta<18&&!f.conEx).length;return `Tu e ${d.p.nome} vi separate e avete ${n===1?'un figlio minorenne':n+' figli minorenni'}. Per legge l'affido è condiviso: dovete decidere con chi vivranno.`},c:[
  {l:'Vivono con te',sub:'L\'altro genitore ti versa un assegno di mantenimento',_incl:0,fx:d=>{
    const fg=vivi(['Figlio']).filter(f=>f.eta<18&&!f.conEx);fg.forEach(f=>{f.alterni=false;f.rapporto=clamp(f.rapporto+4)});
    mantenimento(d.p.id,fg,1);d.p.rapporto=clamp(d.p.rapporto-5);
    return [`I figli restano con te. ${d.p.nome} li vedrà nei fine settimana e ti verserà un assegno di mantenimento.`,'']}},
  {l:'Vivono con {P}',sub:'Tu versi l\'assegno di mantenimento e li vedi nei fine settimana',_incl:0,fx:d=>{
    const fg=vivi(['Figlio']).filter(f=>f.eta<18&&!f.conEx);fg.forEach(f=>{f.conEx=true;f.rapporto=clamp(f.rapporto-6)});
    mantenimento(d.p.id,fg,-1);pesa(8,4);
    let t=`I figli vanno a vivere con ${d.p.nome}. Tu verserai un assegno di mantenimento e li vedrai nei fine settimana.`;
    const mia=casaMia();
    if(mia){S.fatti.casaAssegnata={pid:mia.id,a:d.p.id};S.casa=affittoBase('Bilocale');t+=` La casa resta a loro finché i figli non crescono: tu prendi un bilocale in affitto.`}
    else if(S.casa.tipo==='affitto'){S.casa=affittoBase('Bilocale');t+=' Lasci a loro la casa e cerchi un bilocale.'}
    return [t,'b']}},
  {l:'Una settimana a testa',sub:'Collocamento alternato: niente assegno, le spese a metà',_incl:0,fx:d=>{
    const fg=vivi(['Figlio']).filter(f=>f.eta<18&&!f.conEx);fg.forEach(f=>{f.alterni=true});
    return ['Una settimana da te, una dall\'altro genitore. Zaini che vanno e vengono, ma i figli vi vedono entrambi.','']}}]});
ev({id:'divorzio_definitivo',link:1,auto:{fx:()=>{S.fatti.separazione=null},r:'Il divorzio da {P} è definitivo.',k:'h'}});

/* ---------- Adozione ---------- */
ev({id:'adozione_arriva',link:1,k:'Famiglia',t:'La telefonata',x:d=>d.p&&d.p.vivo&&d.p.ruolo==='Coniuge'?(S.adozione&&S.adozione.tipo==='int'?'L\'ente vi chiama: c\'è un bambino che vi aspetta, dall\'altra parte del mondo. Si parte tra un mese.':'Il Tribunale per i minorenni vi chiama: c\'è un bambino per voi.'):'La domanda di adozione decade: non siete più una coppia sposata.',c:d=>{
  const ok=d.p&&d.p.vivo&&d.p.ruolo==='Coniuge';
  if(!ok)return [{l:'Va bene',fx:()=>{S.adozione=null;return ['La domanda viene archiviata.','']}}];
  return [{l:'Che gioia!',fx:()=>{
    const int=S.adozione&&S.adozione.tipo==='int';S.adozione=null;
    const eta=Math.max(int?r(1,7):r(0,4),Math.min(S.eta,d.p.eta)-45);
    const cog=S.sesso==='M'?S.cognome:(d.p.sesso==='M'?d.p.cognome:S.cognome);
    const f=nuovaPersona('Figlio',pick(['M','F']),eta,cog,{rapporto:r(60,85),adottato:true});
    mod('felicita',14);d.p.rapporto=clamp(d.p.rapporto+10);segnaVita('figlio');pesa(5,2);
    return [`${f.nome}, ${eta} ${eta===1?'anno':'anni'}, entra nella vostra famiglia. All'inizio ti guarda in silenzio, poi ti prende la mano.`,'g']}}]}});
ev({id:'adozione_niente',link:1,auto:{fx:()=>{S.adozione=null;pesa(8,4);mod('felicita',-6)},r:'Dopo anni di attesa la chiamata non arriva. L\'adozione resta un sogno.',k:'b'}});

/* ---------- La casa dei genitori ---------- */
const quotaFratelli=d=>Math.round(d.x*(d.n-1)/d.n);
function prendiCasaEreditata(d,affittala){
  const p={id:S.nextId++,tipo:d.tipo,citta:d.citta,valore:d.x,stato:r(35,80),affittata:!!affittala};
  S.prop.push(p);soldi(-P(1500)-tassaSuccessione(d.x));
  if(!affittala&&S.citta===d.citta&&S.casa.tipo!=='proprieta')S.casa={tipo:'proprieta',pid:p.id};
  return p;
}
function lasciCasaGenitori(t){if(S.casa.tipo==='genitori'){S.casa=affittoBase('Monolocale');return t+' Prendi un monolocale in affitto.'}return t}
ev({id:'eredita_casa',link:1,k:'Famiglia',t:'La casa di famiglia',x:d=>`I tuoi genitori lasciano la casa di famiglia a ${d.citta}: un ${d.tipo.toLowerCase()} che vale circa ${eur(d.x)}.${d.n>1?` Siete ${d.n} figli: a ognuno spetta una quota di ${eur(d.x/d.n)}.`:' Sei figli'+g('o','a')+' unic'+g('o','a')+': è tutta tua.'}`,c:[
  {l:d=>d.n>1?'La tieni e liquidi i tuoi fratelli':'La tieni e ci vai a vivere',sub:d=>d.n>1?`Devi dare ${eur(quotaFratelli(d))} ai fratelli, più le spese di successione`:'Spese di successione e notaio',
    cond:d=>S.citta===d.citta||S.casa.tipo==='genitori',costo:d=>quotaFratelli(d),_incl:0,fx:d=>{
    prendiCasaEreditata(d,false);if(d.n>1)vivi(['Fratello']).forEach(f=>{f.rapporto=clamp(f.rapporto+2)});mod('felicita',6);
    return ['La casa dove sei cresciut'+g('o','a')+' adesso è tua. Ogni stanza ha un ricordo.','g']}},
  {l:'La tieni e la dai in affitto',sub:d=>d.n>1?`Devi dare ${eur(quotaFratelli(d))} ai fratelli`:'Un reddito in più ogni anno',costo:d=>quotaFratelli(d),_incl:0,fx:d=>{
    prendiCasaEreditata(d,true);return [lasciCasaGenitori('La affitti: ogni mese entra qualcosa, e la casa resta in famiglia.'),'g']}},
  {l:d=>d.n>1?'La vendete e dividete':'La vendi',sub:d=>`Ti restano circa ${eur(d.x*.95/d.n)}`,_incl:0,fx:d=>{
    const q=Math.round(d.x*.95/d.n);soldi(q-tassaSuccessione(d.x/d.n));
    return [lasciCasaGenitori(`Firmate dal notaio. Incassi ${eur(q)}. Svuotare quella casa è la parte più difficile.`),'']}},
  {l:'La lasci ai tuoi fratelli',sub:'Ti pagano la tua quota, un po\' scontata',cond:d=>d.n>1,_incl:0,fx:d=>{
    const q=Math.round(d.x/d.n*.85);soldi(q);vivi(['Fratello']).forEach(f=>{f.rapporto=clamp(f.rapporto+6)});
    return [lasciCasaGenitori(`I tuoi fratelli tengono la casa e ti pagano ${eur(q)}.`),'g']}}]});
