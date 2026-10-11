/* ================= EVENTI DELL'EREDITÀ TRA GENERAZIONI (ROADMAP Fase 5.4) =================
   Blocco 1: `ered_debiti`, quando il genitore lascia più debiti che beni. La logica è in c15_eredita.js; lo apre `apriSuccessione()`
   appena continui come un figlio maggiorenne (per i minorenni la legge sceglie il beneficio d'inventario). */

const genitoreMorto=()=>{const E=S.fatti.eredita||{};return E.daS==='F'?'tua madre':'tuo padre'};
ev({id:'ered_debiti',link:1,k:'Famiglia',t:'Un\'eredità di debiti',cond:()=>!!(S.fatti.eredita&&S.fatti.eredita.pend),
  x:()=>{const E=S.fatti.eredita;return `Dal notaio i conti di ${genitoreMorto()} sono presto fatti: beni per ${eur(E.attivo)}, debiti per ${eur(E.passivo)}. Venduto tutto, ne restano da pagare. La tua parte è il ${Math.round(E.q*100)}%: ${eur(E.debito)} di debiti che l'eredità non copre. Puoi accettare e pagare di tasca tua, accettare «con beneficio d'inventario» (rispondi solo con quello che erediti, cioè niente) oppure rinunciare.`},
  c:()=>{
    const E=S.fatti.eredita,figli=vivi(['Figlio']),fr=vivi(['Fratello']);
    return [
      {l:'Accetti e paghi i debiti',sub:`${eur(E.debito)} in ${ANNI_DEB} anni: ${eur(rataMutuo(E.debito,ANNI_DEB,TASSO_DEB))} l'anno`,_incl:0,pers:{C:3,A:1},fx:()=>{
        const deb=scegliEredita('pura');S.karma=clamp(S.karma+5);mod('felicita',-3);pesa(4,1);
        return [`Firmi. I creditori di ${genitoreMorto()} diventano i tuoi: ${eur(deb)}, una rata alla volta. Nessuno potrà dire che in famiglia non si pagano i debiti.`,'']}},
      {l:'Accetti con beneficio d\'inventario',sub:'Non erediti niente e non devi niente: ai creditori vanno solo i suoi beni',_incl:0,pers:{C:2},fx:()=>{
        scegliEredita('beneficio');
        return ['Il notaio fa l\'inventario, i beni vanno ai creditori e i conti si chiudono lì. Resti erede, ma dei debiti non ti arriva niente: le spese le paga l\'eredità.','g']}},
      {l:'Rinunci all\'eredità',sub:figli.length?'La tua parte, debiti compresi, passa ai tuoi figli':fr.length?'La tua parte, debiti compresi, passa agli altri eredi':'Niente beni e niente debiti',_incl:0,fx:()=>{
        scegliEredita('rinuncia');
        if(figli.length)return [`Firmi la rinuncia in tribunale. Per legge al tuo posto subentrano i tuoi figli: ${figli.some(f=>f.eta<18)?'per i minorenni decide il giudice, che accetta con beneficio d\'inventario':'dovranno accettare con beneficio d\'inventario o rinunciare anche loro'}. Altre carte, altri bolli, ma nessun debito.`,''];
        if(fr.length){fr.forEach(f=>relD(f,-4));return ['Firmi la rinuncia in tribunale: non sei più erede. La tua parte, con i suoi debiti, torna sul tavolo dei tuoi fratelli, che non la prendono bene.','']}
        return ['Firmi la rinuncia in tribunale: non sei più erede. Niente beni, niente debiti, e nemmeno una fotografia da portare via.','']}}];
  }});
