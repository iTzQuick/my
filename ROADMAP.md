# my — roadmap verso un simulatore di vita completo

*Ottobre 2026 · stato di partenza: 456 eventi, 46 attività, 42 lavori, 17 ruoli di persone, carattere Big Five con equilibrio adulto, volto che invecchia, app installabile su iPhone.*

«Perfetto al 100% e senza errori» non si può dimostrare, ma si può **misurare**. Questa roadmap ha quindi due binari:
1. **Affidabilità**: controlli automatici che trovano gli errori prima dei giocatori. Si fa subito e si tiene sempre acceso.
2. **Realismo**: ogni sistema confrontato con la vita vera, con numeri bersaglio (ISTAT) che la simulazione deve rispettare.

Ogni fase ha una priorità (🔴 alta · 🟠 media · 🟢 bassa), una stima di impegno (S = una sessione, M = 2–4, L = 5+) e un criterio per dire «fatto».

> **Ottobre 2026:** l'analisi completa del gioco (errori con il punto del codice, confronto con i dati italiani, contenuti da aggiungere, fonti) è in [ANALISI.md](ANALISI.md). La tabella della Fase 7 ora si misura con `python tools/realismo.py 200`.
>
> **9 ottobre 2026:** fatte le correzioni del punto 3 di ANALISI.md. Nel gioco ci sono ora:
> - salute e morte realistiche;
> - storia vera fino al 2026;
> - welfare e pensioni italiane;
> - gravidanza, adozione e separazioni;
> - nomi per generazione.
>
> Il controllo dei testi (0.1) esiste: `tools/lint_testi.py`, per ora solo per le parole da grandi. I risultati prima e dopo sono al punto 2bis di ANALISI.md.
>
> **9 ottobre 2026, sera — Fase 0 quasi chiusa:** invarianti ogni mese (`tools/invarianti.py`, anche dentro `fuzz.py`), archivio di 18 salvataggi di 3 versioni vecchie (`tools/archivio_salvataggi.py`), picchi delle crescite, lint dei testi completo, «Segnala un problema». Gli invarianti hanno trovato e fatto correggere 6 errori (fratelli nati a pochi mesi, partner adulti per ragazzi di 15–17 anni, suoceri di 129 anni, cugini con zii troppo giovani, conviventi «lontani», lavoro sotto l'età minima nel controllo); il lint ha trovato ~110 importi che non seguivano l'inflazione e un segnaposto sbagliato. Resta la 0.5 (età delle azioni), da decidere insieme con `tools/eta_azioni_out.md`.

> **10 ottobre 2026 — Fase 1 fatta:** calendario senza ripetizioni (Natale, ferie, Capodanno, elezioni), 14 modi di conoscere qualcuno, 36 eventi della vita del mese tra i 26 e i 65 anni, 62 eventi 1–6 anni e ~75 tra i 6 e i 17 (con sacramenti e pubertà), 22 catene nuove (29 in tutto), momenti chiave a tutto schermo e il film della vita. `tools/ritmo.py` dice «FASE 1: FATTA ✓».

> **10 ottobre 2026 — Fase 2 fatta:** gruppi e legami tra le persone, ricordi con un segno che tornano anni dopo, conversazioni su quello che l'altro sta vivendo, stile da genitore che forma il carattere dei figli, crisi e terapia di coppia, volti dappertutto. `tools/persone.py` dice «FASE 2: FATTA ✓».

> **10 ottobre 2026, sera — Fase 3 fatta:** si nasce dal 1950 con le lire e la storia vera, nessun anacronismo, pensioni con le regole dell'anno, naja, cassa integrazione, addizionali, assegno unico e ISEE, successione legittima, mutuo fisso o variabile con i tassi veri, screening dell'ASL e liste d'attesa, stipendi e lavoro per zona, emigrazione dal Sud. `tools/italia_vera.py` dice «ANACRONISMI: nessuno ✓».

---

## Fase 0 — Zero errori (🔴, da fare per prima, M)
Le prove di Noemi hanno mostrato che gli errori più frequenti non sono crash, ma **incoerenze**: testi non adatti all'età, genere sbagliato, numeri che esplodono, rapporti bloccati. Si possono trovare in automatico.

| # | Cosa | Come | Fatto quando |
|---|---|---|---|
| 0.1 | ✅ fatto · **Controllore dei testi** (`tools/lint_testi.py`) | Legge tutti gli eventi e le azioni e segnala: `g()`/`gp()` in testi costanti, segnaposto non risolti (`{…}` rimasti), `l{lo}`, importi scritti a mano senza `P()`, parole da adulti (caffè, telefono, lavoro, alcol, partner, mutuo) in eventi o azioni accessibili sotto una certa età. | 0 segnalazioni, ed è nei controlli dopo ogni modifica |
| 0.2 | ✅ fatto (`invarianti.py`, 200 vite pulite) · **Invarianti ogni mese** nel fuzz e nella simulazione | Dopo ogni `mese()` si controlla: statistiche tra 0 e 100, nessun `NaN`/`Infinity`, soldi e follower finiti, al massimo un coniuge vivo, genitori più vecchi dei figli di almeno 15 anni, fratelli con età plausibili, nessun partner adulto per un minorenne, nessun evento su persone morte, animali con nomi diversi, niente «lontano» con chi vive nella tua città. | 1.000 vite senza violazioni |
| 0.3 | ✅ fatto (18 partite di 3 versioni; manca quella di Noemi: basta il suo codice) · **Salvataggi d'archivio** | Una cartella `tools/salvataggi/` con partite vere di versioni vecchie (anche quella di Noemi). A ogni build si caricano tutte e si giocano 24 mesi. | Nessun salvataggio rotto |
| 0.4 | ✅ fatto (in `invarianti.py` e `fuzz.py`; il pilota automatico non usa azienda, social e collezioni: li prova solo il fuzz) · **Controllo crescite composte** | La simulazione stampa massimo e 99° percentile di patrimonio, follower, valore dell'azienda, borsa e collezioni, e avvisa se superano soglie realistiche. | Nessun valore «infinito» in 1.000 vite |
| 0.5 | 🟡 rapporto pronto (`tools/eta_azioni.py`), da rivedere insieme · **Revisione per età di tutte le azioni** | Ogni bottone del gioco ha un'età minima esplicita, e un rapporto per fascia (0–2, 3–5, 6–12, 13–17) elenca cosa si vede. | Revisione fatta con Davide |
| 0.6 | ✅ fatto · **Famiglia credibile alla nascita** | Fratelli distanziati di almeno ~15 mesi (gemelli rari), età dei genitori coerenti, nonni e zii plausibili. | Coperto da 0.2 |
| 0.7 | ✅ fatto (foglio «Salva») · **«Segnala un problema» nel gioco** | Un bottone che copia negli appunti il diario degli ultimi 3 mesi e lo stato, da incollare in chat. | Usato nelle prossime prove |

---

## Fase 1 — Ritmo e varietà (🔴, M) — ✅ fatta il 10 ottobre 2026
Prima una vita media aveva eventi che si ripetevano troppo (simulazione, volte per vita): «Una persona nuova» ~43, le ferie d'agosto ~29, i buoni propositi ~25, Natale ~18, il conto in rosso ~15, le elezioni ~14. Dopo la Fase 1 (`python tools/ritmo.py 40`): nessun evento oltre le 10 volte; i più frequenti sono propositi, Natale e ferie (~8), poi gli incontri, divisi in 14 modelli.

| | Prima | Dopo |
|---|---|---|
| Eventi possibili 0–5 anni | 42 | 104 |
| 6–12 | 109 | 190 |
| 13–17 | 129 | 160 |
| 18–25 / 26–40 / 41–65 / 66+ | 204 / 202 / 199 / 152 | 224 / 247 / 252 / 189 |
| Catene di almeno 3 passi | 5 | 29 |
| Finestre da cliccare per anno, da adulti | ~11 | ~10 (Natale e ferie normali vanno nel diario) |

- 1.1 ✅ **Calendario senza ripetizioni** (d8_ritmo.js): Natale, ferie, Capodanno ed elezioni sono una riga di diario costruita dalla situazione (con chi sei, figli, nipoti, piatto della regione, ferie abituali con il costo per persona) e diventano un evento solo con una novità: primo Natale in coppia, con il neonato, da nonno, lontano da casa, «la sedia vuota» dopo un lutto, il turno a Natale, Natale da soli; prime ferie tra amici, in coppia, con il neonato, da pensionato, dopo una separazione, figli che non vengono più, soldi che non bastano. Alle elezioni si vota per abitudine.
- 1.2 ✅ **Incontri vari**: 14 modelli (a scuola, al parco, in pausa pranzo, tramite un amico, sul pianerottolo, in treno, al parco dei cani, fuori da scuola dei figli, al corso, a una festa, al volontariato, online, al bar sotto casa, in vacanza), pesati da come passi la settimana; chi ha già tante persone intorno ne conosce meno.
- 1.3 ✅ **Vita del mese tra i 26 e i 65 anni** (d11_vita_adulta.js, 36 eventi): la rata che sale (2022–23), il condominio, la caldaia, la bolletta del 2022; figli che scelgono la scuola, si chiudono in camera, fanno coming out, partono per l'estero, chiedono aiuto per l'affitto; genitori che cadono, non devono più guidare, si perdono, restano soli in una casa troppo grande; colleghi che rubano il merito, il capo più giovane, i messaggi delle 22; menopausa, prostata, insonnia, il 730.
- 1.4 ✅ **Catene lunghe**: 29 (obiettivo 25). Nuove: la ristrutturazione infinita, la vertenza di lavoro, il figlio che torna a casa, il randagio, la capanna (con il patto vent'anni dopo), l'orto, il romanzo, il primo amore ritrovato, la bottega del nonno, il figlio e la canna, il coro, il rudere in collina, il crociato, lo studente giapponese, la tesi, la vicina Ada, la compagnia teatrale, la maratona, il furto d'identità, i gattini, il viaggio dei sogni, l'amico depresso, i sacramenti, la lettera a sé stessi.
- 1.5 ✅ **Momenti chiave** (f3_momenti.js): laurea, primo lavoro, matrimonio, nascita, pensione a tutto schermo (simbolo animato, volti, frase); alla morte «Il film della tua vita» con il volto che invecchia; dalla scheda Vita, «I tuoi momenti».
- Anche l'infanzia e l'adolescenza (d9_piccoli.js, d10_ragazzi.js): 62 eventi 1–6 anni, ~75 eventi 6–17 con i sacramenti (catechismo → comunione → cresima, in due famiglie su tre), la pubertà, l'esame di terza media, il debito, lo sciopero per il clima, l'alternanza scuola-lavoro, il tema scritto dall'intelligenza artificiale.

*Fatto quando*: nessun evento casuale supera le 10 volte per vita, ogni fascia d'età ha almeno 150 eventi possibili (0–5 anni almeno 100: a quell'età si sceglie poco) e le catene sono almeno 25. Lo controlla `python tools/ritmo.py 40`.

---

## Fase 2 — Persone vere (🔴, L) — ✅ fatta il 10 ottobre 2026
Misura: `python tools/persone.py 60` → amici stretti legati ad altre persone del gioco **100%** (obiettivo 95%), ricordi di almeno 10 anni prima che tornano **~10 per vita** (obiettivo 5).

- 2.1 ✅ **Le persone si conoscono tra loro** (c8_legami.js): ognuno entra nel gruppo in cui l'hai conosciuto (la classe delle elementari, la compagnia del liceo, i colleghi, i genitori della classe di tuo figlio, il corso, il quartiere…); frequentare un amico fa vedere anche il suo gruppo; alle tue feste gli amici si conoscono tra loro, al matrimonio tutti. Due amici si possono mettere insieme e lasciare (e tu scegli da che parte stare), due amici litigano (fai da paciere o scegli), tua madre e il partner non si sopportano, il partner è geloso del tuo migliore amico. Le cene del gruppo e, dieci anni dopo, le rimpatriate.
- 2.2 ✅ **Memoria che conta**: ogni ricordo ha un segno (da −3 a +3). Nel gruppo le voci girano; nei momenti difficili (lutto, licenziamento, diagnosi, separazione, carcere) si fa avanti chi hai aiutato («Adesso tocca a me»); chi hai ferito ti nega un prestito ricordandoti perché; ai compleanni tondi, al matrimonio, ai funerali, nelle rimpatriate e nei vent'anni di nozze tornano ricordi di tanti anni prima.
- 2.3 ✅ **Conversazioni nel contesto**: lutto, malattia, neonato, separazione, ricerca di lavoro, lavoro nuovo, nuovo amore, trasferimento, pensione aprono argomenti dedicati (sempre per primi); «Parlate di chi conoscete tutti e due» porta notizie sugli altri. La scheda di ogni persona dice cosa sta vivendo, in che gruppo è e chi conosce.
- 2.4 ✅ **Crescere i figli**: lo stile da genitore (calore e regole: autorevole, permissivo, autoritario, distaccato) parte dal tuo carattere e dalle ore con i figli, si muove con 11 eventi di scelte educative (il capriccio, il mostro nell'armadio, i compiti, la bugia, lo sport, lo schermo, i fratelli, il cuore spezzato, la prima uscita, i capelli verdi, lo scooter) e ogni anno sposta il carattere dei figli; a 18 anni il bilancio: com'è diventato, quanto ti somiglia. Con il pilota automatico i figli di genitori autorevoli arrivano a 18 anni con coscienziosità ~65 ed emotività ~44, quelli di genitori permissivi ~45 e ~53.
- 2.5 ✅ **La coppia matura**: decisioni insieme (il lavoro in un'altra città, la casa più grande, il conto comune, i pranzi dai suoceri), i soldi, la crisi (tre mesi sotto il 40%), la terapia di coppia vera (sei mesi, poi l'esito), i vent'anni insieme. La separazione con affidamento e assegno c'era già.
- 2.6 ✅ **Volti per tutti**: nella lista delle persone, nei fogli degli eventi con una persona e degli incontri, al funerale nel necrologio.

*Fatto quando*: in una vita simulata ogni amico stretto ha almeno un legame con un'altra persona del gioco, e le scelte di 10 anni prima tornano almeno 5 volte. Lo controlla `python tools/persone.py 40`.

---

## Fase 3 — Italia vera (🟠, L) — ✅ fatta il 10 ottobre 2026
- 3.1 **Anni prima del 2000**: lira fino al 2001, tecnologia per decennio (niente smartphone prima del 2007, social dopo il 2004), fatti storici veri (euro, crisi del 2008, pandemia del 2020) e futuro generato dopo il presente.
- 3.2 **Lavoro all'italiana**: contratti (indeterminato, determinato, partita IVA), NASpI, cassa integrazione, TFR, concorsi pubblici, precariato realistico per età e regione.
- 3.3 **Pensioni e tasse precise**: contributi veri, età e importi aggiornati, ISEE e bonus, successione ereditaria secondo legge.
- 3.4 **Casa**: condominio, IMU, mutuo variabile o fisso, ristrutturazioni, case dei nonni ereditate tra fratelli.
- 3.5 **Sanità**: Servizio sanitario e privato, liste d'attesa, screening per età (mammografia, colonscopia, PSA), medicina di base.
- 3.6 **Differenze regionali**: stipendi, costo della vita, servizi, emigrazione dal Sud.

---

## Fase 4 — Corpo e mente (🟠, M)
- 4.1 Sonno, alimentazione, peso, attività fisica con effetti sulla salute a lungo termine.
- 4.2 Gravidanza vera (9 mesi, congedi, asilo nido), fertilità per età, menopausa.
- 4.3 Salute mentale come percorso: ansia, depressione, burnout, con cure e ricadute.
- 4.4 Dipendenze con un ciclo realistico: inizio, abuso, recupero, ricaduta.
- 4.5 Disabilità e invecchiamento: autonomia, badanti, RSA vissute anche dalla tua parte.

---

## Fase 5 — Scopo a ogni età (🟠, M)
- 5.1 ✅ **Aspirazioni con progressi visibili**: ogni sogno è una scala di 3 tappe (l'ultima è il sogno), con barra e tappe nel foglio «I tuoi sogni»; si possono ripensare dai 25 anni, al massimo 3 aperti. Fatta (ottobre 2026): vedi «Aspirazioni» in CLAUDE.md, `tools/test_aspir.py`.
- 5.2 **Vecchiaia piena**: nipoti, viaggi, volontariato, solitudine, testamento dettagliato (a chi lasci cosa), «ultimo desiderio».
- 5.3 **Lavoro vissuto**: colleghi e capo come persone persistenti, progetti, scelte di carriera (cambiare settore, mettersi in proprio, emigrare).
  - 5.3a ✅ capo e 2–3 colleghi come persone (`p.lav`, gruppo `lavoro:<id>:<da>`), eventi `col_` e `prg_` (ottobre 2026: vedi CLAUDE.md «Lavoro vissuto»).
  - 5.3b scelte di carriera `car_`: cambiare settore (RIASEC), mettersi in proprio (partita IVA e attività), emigrare (mete e regole per epoca).
- 5.4 **Eredità tra generazioni**: giocare come figlio con la casa, i debiti, i rancori e le collezioni dei genitori.

---

## Fase 6 — Interfaccia (🟢, M)
- 6.1 **Linea della vita**: grafico di felicità, salute e soldi negli anni, e album dei ricordi con i momenti chiave.
- 6.2 **Prima partita guidata**: un mini tutorial nei primi 6 anni.
- 6.3 **Salvataggio nel cloud anche per l'app** (oggi solo nell'artifact): per esempio un codice da sincronizzare.
- 6.4 **Impostazioni**: velocità, temi sensibili (lutti, malattie, crimine), dimensione del testo.
- 6.5 **Accessibilità**: contrasti, lettori di schermo, tasti.

---

## Fase 7 — Misurare il realismo (🔴, S, parte con la Fase 0 e resta sempre)
Una **tabella di realismo** che la simulazione stampa a ogni build, confrontando 1.000 vite con i dati veri. Valori indicativi da verificare sul sito ISTAT:

| Indicatore | Italia (circa) | Gioco oggi |
|---|---|---|
| Aspettativa di vita | uomini ~81, donne ~85 | mediana 83–85 senza differenza per sesso |
| Età al primo matrimonio | ~33 donne, ~35 uomini | da misurare |
| Figli per donna | ~1,2 | 1,2 ✓ |
| Laureati tra 25 e 64 anni | ~20% | ~19% ✓ |
| Persone mai sposate a 50 anni | ~1 su 4 | ~1 su 5 |
| Separazioni ogni 100 matrimoni | ~30–40 | da misurare |
| Disoccupazione | ~7%, di più tra i giovani e al Sud | da misurare |
| Reddito mediano | ~22–25.000 € lordi l'anno | da misurare |

*Fatto quando*: tutti gli indicatori stanno entro ±20% dal dato vero (il pilota automatico conta: andrà reso più «umano», per esempio meno sposi e lavori più vari).

---

## Ordine consigliato
1. **Fase 0 + Fase 7** (affidabilità e misura): sono le fondamenta, e ogni cosa dopo diventa più sicura.
2. ✅ **Fase 1** (ritmo): fatta il 10 ottobre 2026.
3. ✅ **Fase 2** (persone): fatta il 10 ottobre 2026.
4. ✅ **Fase 3** (Italia vera): fatta il 10 ottobre 2026.
5. Poi Fasi 5, 4, 6, secondo quello che emerge dalle prove con Noemi.

Ogni fase si chiude con: build → controlli → simulazione → prova sul telefono (Netlify) → feedback.
