# my — guida al progetto

Il gioco si chiama **«my»** (minuscolo; motto «una vita, mese per mese»). «VitaMia» era il nome di lavoro: resta solo nei nomi interni (cartella, `dist/vitamia.html`, chiave `vitamia_save_v4`, prefisso `VITAMIA1Z:` dei codici) per non rompere salvataggi e strumenti. Nei testi visibili usa sempre «my».

Simulatore di vita in italiano, ispirato a BitLife ma pensato come **simulatore vero**: il tempo scorre **mese per mese**, il personaggio ha un **carattere** (Big Five), decide come usare le **ore della settimana**, e le **persone intorno hanno una vita propria**. È un gioco personale di Davide, non pubblicato su store. Tutto il gioco è **un unico file HTML** senza dipendenze (solo i Google Fonts).

Lingua: **tutti i testi del gioco sono in italiano**, con un tono misto realistico/ironico. Rispondi all'utente in italiano.

---

## Avvio rapido

```bash
python build.py                 # unisce src/ → dist/vitamia.html (+ dist/all.js)
# apri dist/vitamia.html nel browser: si gioca e si salva in localStorage
```

Controlli automatici (servono Python 3 e Playwright: `pip install playwright` poi `python -m playwright install chromium`; nel contenitore cloud di Claude Code il Chromium c'è già: `pip install playwright==1.56.0`, senza `playwright install`):

```bash
node -e "new Function(require('fs').readFileSync('dist/all.js','utf8'))"   # sintassi JS
python tools/fuzz.py 3          # clic casuali su tutta l'interfaccia per 3 vite, con gli invarianti dopo ogni mese: deve dare errs [], inv [], oltre []
python tools/invarianti.py 200  # 200 vite controllate ogni mese (numeri validi, età e famiglia credibili, coppie, «lontano»…) + picchi di patrimonio, follower, azienda, Borsa: deve dare 0 violazioni
python tools/archivio_salvataggi.py  # ricarica i salvataggi di versioni vecchie (tools/salvataggi/) e gioca 24 mesi: «tutti i salvataggi funzionano»
python tools/sim.py 40          # 40 vite giocate dal pilota automatico: statistiche di bilanciamento
python tools/test_salva.py      # salvataggio su file / codice e ricaricamento in un browser senza memoria
python tools/test_eventi.py ad_  # apre ogni evento con quel prefisso e clicca ogni risposta (M e F): stampa testi, esiti, errori
python tools/test_feedback.py   # riproduce le segnalazioni delle prove su telefono (età, stress, rapporti, follower…)
python tools/test_novita.py     # ricchezza, animali, amici→amore, attività per beni ed età, ferie a pagamento (+ schermate in grafica/)
python tools/realismo.py 200     # 200 vite confrontate con i dati italiani (ISTAT, Eurostat…): età alla morte, uscita di casa, lavoro, figli, cause di morte
python tools/lint_testi.py      # testi: parole da grandi da piccoli, segnaposto non risolti, g()/gp() senza personaggio, importi senza P(), «l{lo}»: deve dare 0 segnalazioni
python tools/eta_azioni.py      # cosa si vede a 1, 4, 9, 15 e 17 anni in ogni scheda → tools/eta_azioni_out.md (per decidere le età minime)
python tools/test_italia.py     # regole italiane: gravidanza, separazione e affido, adozione, eredità della casa, pensione, NASpI e TFR, storia vera, IRPEF, unione civile
python tools/test_lavori.py     # lavori e contratti: requisiti raggiungibili, mestieri come in Italia, concorsi, elezioni, contratti a termine, partita IVA, part-time, divario, congedi
python tools/ritmo.py 40        # Fase 1: eventi possibili per fascia d'età, catene di almeno 3 passi, eventi che si ripetono più di 10 volte per vita → «FASE 1: FATTA ✓»
python tools/test_ritmo.py      # apre ogni evento cal_ e inc_ (o un altro prefisso: pic_ bim_ rag_ mez_ cat_ leg_ mem_ edu_ cop_) nella situazione giusta, M e F, e clicca ogni risposta (-v per leggere i testi)
python tools/persone.py 40      # Fase 2: amici stretti legati ad altre persone (≥95%), ricordi di 10 anni prima che tornano (≥5 per vita), gruppi, stile da genitore → «FASE 2: FATTA ✓»
python tools/italia_vera.py 25  # Fase 3: vite nate nel 1950, 1965, 1980, 2000 (o anni scelti: italia_vera.py 25 1955 1970): anacronismi → «nessuno ✓», lire, pensione per anno, naja, occupati e stipendi per zona, screening, cassa integrazione, emigrati
```

**Dopo ogni modifica:** `build.py` → controllo sintassi → `fuzz.py` → `lint_testi.py` (se tocchi testi o prezzi) → `invarianti.py` (almeno 100 vite se tocchi persone, famiglia, coppia o soldi) → `archivio_salvataggi.py` (se tocchi lo stato o i salvataggi) → `sim.py` (almeno 40 vite se tocchi formule o probabilità; `realismo.py` con 400+ vite se tocchi salute, morte, lavoro o famiglia: con meno vite la media dell'età alla morte oscilla di ±1,5 anni) → `italia_vera.py` se scrivi testi legati a un'epoca o tocchi leggi, prezzi, lavoro e territorio.

Su Windows, se l'uscita va in un file, metti `PYTHONIOENCODING=utf-8` davanti (i ✓ e i ⚠ dei controlli altrimenti fanno fallire la stampa).

### Modelli e impegno (per consumare meno)
Davide usa un abbonamento claude.ai: il limite si consuma più in fretta con Opus e con i ragionamenti lunghi. Il modello lo sceglie lui (`/model`, oppure `opusplan`: Opus per il piano, Sonnet per il codice); queste sono le regole per scegliere e per lavorare senza sprechi.
- **Sonnet**: il lavoro normale (eventi nuovi, testi, correzioni, controlli, piccole funzioni).
- **Opus**: progettare una fase nuova della ROADMAP, errori difficili da trovare, bilanciamento delle formule. Se un compito è da Opus e la sessione usa un modello più piccolo, diglielo prima di iniziare.
- **Haiku**: domande veloci, riassunti, cercare dove sta una cosa nel codice.
- **Sotto-agenti**: per lanciare i controlli lunghi (`fuzz.py`, `invarianti.py`, `sim.py`, `realismo.py`, `italia_vera.py`) e riassumerne l'esito puoi usare un sotto-agente con `model: haiku` ed `effort: low`; per cercare nel codice un `Explore` con `model: haiku`. Non per i lavori brevi: un sotto-agente parte da zero e rilegge tutto.
- **Controlli**: lancia solo quelli che servono per quello che hai toccato (vedi «Dopo ogni modifica»), con il numero di vite indicato, non di più; dall'uscita leggi solo la coda (`| tail`) o le righe con ✗ ed errori.
- **Letture**: non rileggere file interi grandi (`dist/`, `b2_comuni.js`, `c_motore.js`): cerca con `grep` e leggi solo le righe che servono.

---

## Struttura

```
VitaMia/
├─ build.py              unisce i file di src/ nell'ordine giusto
├─ src/                  sorgenti (l'ordine conta: vedi FILES in build.py)
│  ├─ a_shell.html       <title>, CSS (temi chiaro/scuro con variabili), markup di base, barra in basso
│  ├─ b_dati.js          nomi, città, scuole, facoltà, corsi, HOBBY, LAVORI/JOB, case, auto, MALATTIE, REATI, TRATTI
│  ├─ b2_comuni.js       7.904 comuni ISTAT (stringa compatta) + PROVINCE
│  ├─ b3_luoghi.js       comuni(), cittaInfo(), luogo(), prezzi al m² per regione
│  ├─ b4_dati2.js        Borsa (TITOLI), aziende, crimini, clan, social (POST), partiti, colloqui, quiz, TEMI di dialogo
│  ├─ c_motore.js        stato S, helpers, persone base, scuola, lavoro, bilancio, giustizia, CICLO MENSILE mese(), salvataggio locale e migrazioni
│  ├─ c2_sistemi.js      mondo (inflazione, crisi), tasse IRPEF/INPS, Borsa, prestiti, azienda, fama/social, crimine/clan, carcere, nemici, zii/suoceri, dialoghi, colloqui, concorsi
│  ├─ c3_vita.js         CARATTERE (Big Five), attaccamento, interessi RIASEC, ROUTINE settimanale, BISOGNI, salute mensile, scelte «da te», impulsi, calendario, aspirazioni, testi vari (varia/TESTI)
│  ├─ c4_persone.js      vita degli NPC mese per mese, coppia (intimità/passione/impegno), contatti, richieste, incontri, genitori
│  ├─ c5_aspetto.js      il VOLTO stilizzato: tavolozze, lookCasuale/lookFiglio (genetica), lookDi(p), volto(look,eta,sesso) → SVG che invecchia
│  ├─ c6_famiglia.js     FAMIGLIA: fertilità per età, gravidanza (aborto spontaneo, gemelli, congedi), procreazione assistita, adozione (legge 184), separazione → divorzio, mantenimento, orientamento delle persone
│  ├─ c8_legami.js       PERSONE VERE: gruppi (S.gruppi), legami tra le tue persone (S.legami), ricordi con un segno e ritorni, chi non dimentica (bisognoAiuto), contesto delle persone, stile da genitore (S.genit), vita sociale del mese (meseSociale)
│  ├─ c7_italia.js       ITALIA: prezzi e storia vera dal 1950 al 2026, TFR, NASpI, ADI/SFL, pensione contributiva, assegno sociale, reversibilità, badante e RSA, eredità della casa; in fondo la Fase 3: zone (stipendi, occupazione, costo della vita, emigrazione), cassa integrazione, addizionali, assegno unico, successione, tassi dei mutui, screening e liste d'attesa
│  ├─ c9_epoca.js        ITALIA VERA (Fase 3.1): EPOCA (da che anno ha senso ogni parola), filtro degli anacronismi, lavori e corsi per anno, pensione con le regole dell'anno, divorzio, unione civile, voto a 21 anni, naja
│  ├─ d_eventi.js        eventi «classici» (definisce EV e ev())
│  ├─ d2_eventi2.js      eventi aggiuntivi: catene, regionali, storici, rari
│  ├─ d3_emergenti.js    calendario, coppia, richieste delle persone, incontri, eventi dallo stato (burnout…), diagnosi, aspirazioni
│  ├─ d4_infanzia.js     65 eventi 1–12 anni che FORMANO IL CARATTERE
│  ├─ d5_adolescenza.js  36 eventi 13–17 anni che formano il carattere
│  ├─ d6_adulti.js       31 eventi 18+ con scelte che formano il carattere (lavoro, coppia, figli, vecchiaia)
│  ├─ d7_vita_italiana.js eventi delle regole italiane: affido dei figli, divorzio definitivo, adozione, la casa dei genitori
│  ├─ d8_ritmo.js        RITMO DELL'ANNO: Natale, ferie, Capodanno ed elezioni (evento solo se c'è una novità, se no una riga di diario), 14 modelli di incontro (INC)
│  ├─ d9_piccoli.js      62 eventi 1–6 anni (pic_)
│  ├─ d10_ragazzi.js     eventi 6–17 anni (bim_, rag_): scuola, sacramenti (catechismo → comunione → cresima), pubertà, adolescenza
│  ├─ d11_vita_adulta.js eventi 22–80 anni legati alla vita del mese (mez_): mutuo e casa, figli adolescenti, genitori anziani, colleghi, salute, stanchezza
│  ├─ d12_catene.js      22 catene di 3–4 passi (cat_): la ristrutturazione, la vertenza, il figlio che torna a casa, il randagio, il romanzo…
│  ├─ d13_persone.js     eventi della Fase 2: leg_ (gruppi, coppie e liti tra amici, tua madre e il partner, gelosia), mem_aiuto, edu_ (stile da genitore), cop_ (decisioni, soldi, crisi, terapia, vent'anni insieme)
│  ├─ d14_italia.js      eventi della Fase 3: naja e congedo, cassa integrazione (ita_cig), tornare al Sud (ita_ritorno), la lettera dell'ASL (ita_screening), la lista d'attesa e la visita (ita_attesa, ita_visita)
│  ├─ e_azioni.js        azioni del giocatore (studi, lavoro, azienda, persone, amore, case, auto, attività, carcere)
│  ├─ e2_lusso.js        ricchezza e lascito (collezioni, beneficenza, onorificenze, fondazione, borse, esperienze, traguardi), cura degli animali, da amici a innamorati, attività per beni ed età
│  ├─ f2_crea.js         schermata di creazione: certificato di nascita dal vivo + editor (Tu · Nascita · Famiglia · Aspetto), «Nasci» con timbro, battito e presentazione
│  ├─ app/               manifest, service worker e icone della web app installabile (copiati in dist/app/)
│  ├─ g_salva.js         salvataggi: localStorage, file, codice da copiare, salvataggio online (solo come artifact)
│  ├─ f_ui.js            interfaccia: render di tutte le schede, fogli (showSheet), carattere, settimana, creazione, morte, logo e intro
│  └─ f3_momenti.js      MOMENTI CHIAVE a tutto schermo (laurea, primo lavoro, matrimonio, nascita, pensione) e «il film della tua vita»
├─ tools/
│  ├─ autopilota.js      pilota automatico guidato dal carattere (usato da test e Atlante)
│  ├─ fuzz.py  sim.py  test_salva.py  test_eventi.py
│  ├─ invarianti.js / .py  cose che non devono mai succedere, controllate ogni mese (usato anche da fuzz.py) + picchi delle crescite
│  ├─ archivio_salvataggi.py + salvataggi/   partite di versioni vecchie da ricaricare («crea <etichetta> vecchia.html» per aggiungerne)
│  ├─ eta_azioni.py      bottoni visibili a ogni età → tools/eta_azioni_out.md
│  ├─ frames_intro.py    fotogrammi dell'intro a istanti precisi → grafica/intro_frames_<tema>.png
│  ├─ esporta_grafica.py PNG di logo e icona + video dell'intro (webm, chiaro e scuro) in grafica/
│  ├─ shot_crea.py       foto di ogni scheda della creazione, del timbro e della presentazione → grafica/crea_<tema>.png
│  ├─ icone_app.py  test_app.py   icone della web app / prova della web app offline
│  ├─ realismo.py        tabella «my contro l'Italia» (vedi ANALISI.md)
│  ├─ lint_testi.py  test_italia.py  test_lavori.py   controllo dei testi per età / regole italiane / lavori
│  ├─ ritmo.py  test_ritmo.py   misura della Fase 1 (fasce d'età, catene, ripetizioni) / prova forzata degli eventi nuovi
│  ├─ persone.py         misura della Fase 2 (legami degli amici stretti, ricordi che tornano, stile da genitore)
│  ├─ italia_vera.py     misura della Fase 3 (anacronismi per epoca, lire, pensioni, naja, zone, screening, cassa integrazione)
│  ├─ galleria_volti.py  tutti i tagli × età × carnagioni → grafica/volti.png
├─ atlante/              generatore dell'«Atlante di VitaMia» (database + grafici di tutto il gioco)
│  ├─ estrai.py          legge EV, lavori, dati… dal gioco compilato → atlante/dati.json
│  ├─ mappe.py           traduzioni leggibili delle condizioni degli eventi (COND, PC, PF)
│  ├─ simula.py          600 vite con il pilota automatico → atlante/sim.json (≈4 minuti)
│  ├─ derivati.py        statistiche per i grafici → atlante/derivati.json
│  ├─ pagina.html        la pagina dell'Atlante (Chart.js da CDN); build.py ci inietta i JSON
│  └─ build.py           → dist/atlante-vitamia.html
├─ grafica/             logo-my.svg / -scuro.svg, icona-my.svg (+ PNG), intro-my.webm, fogli dei fotogrammi
└─ dist/                 file pronti: vitamia.html, atlante-vitamia.html, app/ + my-app.zip (web app per il telefono)
```

Non c'è un bundler: i file sono script «classici» concatenati, quindi **tutto è globale**. Le funzioni si possono usare in un file caricato prima, purché vengano chiamate a runtime (non al caricamento).

---

## Il modello

### Stato
Una sola variabile globale `S` (salvata come JSON, chiave `vitamia_save_v4`; `load()` migra da v2/v3). Campi principali:
- tempo: `t` (mesi dalla nascita), `mese` (0–11), `anno`, `meseNascita`, `eta`, `annoNascita`
- statistiche 0–100: `salute`, `felicita`, `intelligenza`, `aspetto`, `karma`
- **carattere** `pers {O,C,E,A,N}` 0–100, `att` (sicuro/ansioso/evitante/timoroso), `aspir`, `aspOk`
- **bisogni** `bis {energia,stress,soc,forma}`, `sonno` (ore a notte), `routine {id: ore/settimana}`, `tensione`
- `relazioni[]` (persone, vedi sotto), `scuola`, `istr`, `lavoro`, `azienda`, `casa`, `prop`, `veicoli`, `prestiti`, `borsa`, `social`, `fama`, `crim`, `galera`, `carcere`, `malattie`, `dip`, `fatti` (contatori e flag vari), `futuri` (conseguenze rimandate), `log` (diario: un blocco per mese `{t,anno,mese,eta,righe[]}`), `azioni`+`cdAz` (azioni già fatte e attese).

### Il mese — `mese()` in c_motore.js (ordine esatto)
1. `t++`, avanza mese/anno, pulisce le azioni scadute, nuovo blocco di diario
2. **gennaio** → `inizioAnno()`: mondo/Borsa, fama, nemici, beni, azienda, clan, pensioni e stipendi rivalutati, bilancio dell'anno
3. **mese di nascita** → `eta++`, `compleanno()`: tappe, maturazione del carattere, attaccamento a 4 anni, aspirazioni a 18, pensione
4. carcere → `meseNpc()` (vita degli altri) → `chiudiGruppi()` + `meseSociale()` (gruppi, coppie e liti tra le tue persone, scelte da genitore) → `meseFamiglia()` (tentativi, gravidanza, parto) → animali → scuola → `calendario()` (settembre inizio scuola, giugno fine anno; Natale, ferie, Capodanno in d8_ritmo.js) → `storiaMese()` (fatti veri fino al 2026)
5. `meseLavoro()` → `meseItalia()` (TFR, contributi, NASpI, SFL) → `normalizzaRoutine()` → `meseRoutine()` (effetti delle ore) → `bisogni()` → `finanzeMese()` → `meseSalute()`
6. conseguenze rimandate (`S.futuri`, in mesi) → `controllaMorte()` (rischio annuo diviso sui 12 mesi)
7. eventi: `eventiMese()` (casuali: 16% sotto 13 anni, 13% fino a 17, 8,5% adulti; con persone 4,5%) → `emergenti()` → `impulsi()`; massimo 3 in coda

In `compleanno()` arriva anche la pensione: con un lavoro si apre l'evento `pensione`, senza lavoro parte da sola (`vaiInPensione`).

Il vecchio sistema era annuale: molte formule annuali sono rimaste e vengono **divise per 12** (es. `bilancio()` è annuo, `bilancioMese()` lo divide; lo stipendio è /13 con la tredicesima a dicembre).

### Carattere (c3_vita.js)
- `pz(k)` = (tratto − 50)/50, da −1 a +1. Usalo nelle formule.
- Nascita: 50 + 45% × (media dei genitori − 50) + caso. `cambiaPers(k,d)` lo sposta; `segnaVita(tipo)` applica le esperienze (lutto, carcere, terapia…); `maturazione()` a ogni compleanno.
- I tratti sono **con i decimali** (`clampF`): non usare `clamp()` su `S.pers`, arrotonda e cancella i cambiamenti sotto 0,5 (fino al 2026 la maturazione di A e N non funzionava per questo).
- **Negli eventi** una scelta può avere `pers:{E:2,N:-1}`: `applicaPers()` lo moltiplica per `plasticita(eta)` (×1,5 sotto 7 anni, ×1,2 fino a 12, ×0,8 fino a 17, ×0,6 fino a 29, ×0,45 fino a 49, ×0,35 fino a 69, ×0,3 dopo). L'esito aggiunge «Ti rende un po' più …» se il cambio effettivo è ≥1,5, oppure se il valore scritto è ≥3 (quindi **negli eventi adulti usa 3–4 per le scelte che devono lasciare il segno**, 1–2 per quelle che spostano in silenzio). Da adulti, spingere un tratto già estremo ancora più in là rende meno.
- `pers` funziona anche se la scelta ha un `fx` che ritorna `[testo,tipo]` (il «Ti rende…» viene aggiunto al testo). Dentro un `fx` puoi chiamare `applicaPers({N:3})`, che ritorna la frase.
- **Equilibrio adulto** (`maturazione()`): a 18 anni nasce `S.persBase`. Ogni anno il carattere rientra del 6% verso l'equilibrio e l'equilibrio si avvicina del 2% al carattere: un singolo evento (un lutto) pesa per qualche anno e ne resta circa un quarto; scelte ripetute nella stessa direzione cambiano davvero la persona. La maturazione (C e A salgono, N scende fino ai 65; O ed E calano dopo i 70) sposta entrambi.
- **Memoria del carattere**: `fotoCarattere()` salva `S.persStoria` a 12, 18, 30, 40… anni; ogni cambiamento fatto mentre è attiva una «causa» (`conCausa(titolo,fn)`: il titolo dell'evento in `showSheet`, il nome dell'esperienza in `segnaVita`) finisce in `S.persSegni`. La scheda Carattere (`storiaCarattere()` in f_ui.js) mostra «Rispetto a quando avevi 18 anni sei…», «in questo periodo sei più … del solito» (distanza da `persBase`) e «Cosa ti ha cambiato».
- **«da te» / «non è da te»**: `inclinazione(c)` legge le parole chiave della risposta (`INCL`) e il carattere. Le scelte contro carattere costano stress ed energia e riescono meno (`pIncl`). Per togliere l'etichetta a un menu di sistema: `_incl:0` sulla scelta.

### Salute e morte (c3_vita.js, dati in b_dati.js)
- **Malattie**: lievi (`MALATTIE[1]`, per i bambini `MAL_BIMBI` + varicella una volta: circa 2 l'anno sotto i 6 anni, una ogni due anni da adulti), acute (`[2]`), croniche che crescono con l'età (pressione alta, diabete, artrosi, asma, emicrania, BPCO dei fumatori, cardiopatia), **tumori per tipo** (`TUMORI`: peso per sesso, età minima, `sopr` = sopravvivenza a 5 anni, `m` = rischio annuo), insufficienza cardiaca, cirrosi, **demenza** (dai 65 anni), **depressione** e **disturbo d'ansia** (umore basso, emotività, stress, solitudine). Il peso sulla salute è `pesoMal(m)`: le croniche comuni pesano poco.
- **Tumori**: incidenza per età e sesso (circa 1 uomo su 2 e 1 donna su 3 entro gli 84 anni, AIRC). La diagnosi offre le cure (servizio sanitario o clinica privata) → `avviaCura()` → dopo 4–12 mesi remissione con probabilità `probRemissione()` (tipo, età, salute, screening) oppure la malattia avanza e si riprova. Le visite e la clinica **non** guariscono i tumori; lo screening li trova prima (`m.screen`, +10%).
- **Morte**: rischio annuo = `morteP()` (Gompertz × `fattoreSesso`: 0,9 uomini, 0,62 donne) × `K_GIOCATORE` (0,4) + rischio di ogni malattia (`rischioMalattia`, `MORTALI`) + alcol. La **causa** (`causaMorte()`) è una malattia in proporzione al suo rischio, oppure una causa tipica dell'età. Con 600 vite: età media alla morte uomini ~82, donne ~84–86; cause: cuore e vasi ~35%, tumori ~25%, respiratorie ~9%, demenze ~8% (Italia 2023: 30 / 26 / 8 / 5).
- Le persone del gioco usano `morteP(eta,salute,sesso)` senza il fattore del giocatore.

### Regole italiane e storia (c6_famiglia.js, c7_italia.js, d7_vita_italiana.js)
- **Prezzi per anno**: tutti gli importi sono scritti ai prezzi del 2026. `mondoBase(annoNascita)` parte da `ipAnno(anno)` (inflazione vera ISTAT: `INFL_PRIMA` 1950–1999, `INFL_VERA` 2000–2025): chi nasce nel 1960 trova i prezzi del 1960. **Fino al 2001 si paga in lire**: `eur()` mostra le lire (1 € = 1.936,27 lire, `lire()` in c_motore.js); gli importi interni restano euro dell'anno. Fino al 2026 (`ANNO_OGGI`) `annoMondo()` usa l'inflazione vera e **non inventa** crisi, pandemie, Mondiali, terremoti o elezioni: li porta `storiaMese()` (`STORIA`: euro 2002, Mondiali 2006, crisi 2008 e 2011, terremoti, unioni civili 2016, lockdown marzo 2020, Europei 2021, Ucraina 2022, alluvione 2023…; `ELEZIONI_VERE`). Dopo il 2026 il mondo è casuale come prima (elezioni ogni 5 anni dal 2027).
- **IRPEF per anno** (`SCAGLIONI` in c2_sistemi.js): 5 aliquote fino al 2021, 23/25/35/43 nel 2022–23, 23/35/43 nel 2024–25, 23/33/43 dal 2026; dopo il 2026 gli scaglioni seguono i prezzi (`fattoreFisco`). **Addizionali** in `netto()` con `aliqAddiz()`: regionale dal 1998 secondo la regione (`ADD_REG`: 1–2,6%, più alta dove c'è il debito della sanità), comunale dal 1999 (0,6%, 0,8% nelle città sopra i 100.000 abitanti); prima del 1998 niente.
- **Lavori** (`LAVORI` in b_dati.js, 81): oltre ai classici ci sono i mestieri più diffusi in Italia (colf, badante, bracciante, idraulico, elettricista, meccanico, falegname, panettiere, pasticcere, macellaio, autotrasportatore, cassiere, pulizie, call center, segretario, estetista), scuola (educatore di nido, maestra), divise (carabiniere, militare, finanziere), servizi (portalettere, tassista, guida turistica, animatore, bagnino, assistente di volo, pilota), professioni (veterinario, dentista, fisioterapista, notaio, magistrato, agente di commercio, data scientist), la **politica** e tre sport (pallavolo, ciclismo, tennis). Campi dei lavori: `ore` (settimanali, se non 40), `conc` + `cdiff` (concorso, con difficoltà: notaio 0,2, magistrato 0,25), `elez` (si entra con `elezione()`: costo della campagna, probabilità da fama, karma, estroversione; ogni 5 anni la rielezione in `meseLavoro`). Le persone del gioco ricevono un lavoro pesato con `DIFFUSIONE` (migliaia di occupati, indicativi) e `DONNE` (quota femminile): tanti operai e impiegati, pochi notai. Rischio di incidente sul lavoro: `MANUALI` (c3_vita.js). Servono facoltà (Scienze della formazione primaria, Scienze dell'educazione, Medicina veterinaria, Odontoiatria, Fisioterapia, Statistica), esami di Stato (veterinario, odontoiatra) e corsi (`CORSI` può avere `req`, il costo passa da `P()`): patente C e CQC, estetista, bagnino, assistente di volo, scuola di volo, guida turistica, licenza taxi. Il «Negozio di quartiere» è un'attività in proprio (`AZIENDE`).
- **Contratti** (c7_italia.js, `L.contratto`): all'assunzione `contrattoIniziale()` sceglie **a tempo determinato** (circa 7 assunzioni su 10 da giovani, 3–24 mesi), **apprendistato** (sotto i 30 anni, 36 mesi), **tempo indeterminato** (concorsi pubblici e una parte delle assunzioni), **partita IVA** (`PIVA`: avvocato, commercialista, architetto, psicologo, notaio, agente, guida, tassista, personal trainer, artisti; `PIVA_LIV`: idraulico, meccanico, panettiere… quando si mettono in proprio), **carica elettiva** (politica). `meseContratto()` ogni mese: a termine → proroga (fino a 24 mesi, max 4), stabilizzazione (più facile a 24 mesi e con buon rendimento) o fine con NASpI; insegnanti con supplenze annuali fino al ruolo; sportivi con rinnovi di 2 anni; apprendistato → conferma nel 75% dei casi; tempo indeterminato → ~4% l'anno di licenziamenti e chiusure (di più sotto i 35 anni e nelle crisi). La partita IVA ha il regime forfettario (`nettoPiva`: 78% di redditività, 26% di contributi, imposta 5% per 5 anni poi 15%, fino a 85.000 €), niente TFR, tredicesima e NASpI, contributi più bassi per la pensione. Con un contratto a termine la banca rifiuta quasi sempre il mutuo; con la partita IVA servono 2 anni. L'incertezza aggiunge stress (a termine +4).
- **Part-time** (`L.ptv`: 60% di ore e stipendio, `ralEff(L)` = stipendio vero): si chiede dalla scheda Lavoro (`chiediPartTime`, l'azienda può dire di no) e si torna a tempo pieno (`tornaTempoPieno`). Alcuni lavori sono spesso solo part-time (`PT_LAVORO`: cassa, pulizie, call center, colf, commercio…) e quei posti vanno soprattutto alle donne (`ptIniziale`: ×2,5 donne; part-time involontario 13,7% delle occupate contro 4,6% degli uomini).
- **Divario uomo-donna**: a parità di lavoro l'offerta per le donne è il 4% più bassa (`fattoreGenere`; ISTAT: 5,6% orario nel 2022); ai livelli alti le promozioni sono un po' più lente per le donne e lo sono per tutti in part-time e in congedo (`fattoreCarriera`). Soprattutto pesano i figli: congedo di maternità 5 mesi all'80%, poi l'evento `rientro_lavoro` (tempo pieno, part-time, altri mesi di congedo parentale, dimissioni con la NASpI nel primo anno del bambino); per i papà l'evento `congedo_padre` (3 mesi all'80% o solo i 10 giorni obbligatori); la compagna che lavora lascia il lavoro per 1–4 anni nel 20% dei casi. Con il pilota automatico: part-time 15% delle donne e 6% degli uomini tra 25 e 54 anni, reddito mediano delle donne circa il 10% più basso (in Italia 30% / 7,5% e −29% in un anno).
- **Lavoro**: il colloquio dipende da zona (Nord +3/4 punti, Centro −4, Sud e Isole −20/22: al Sud si trova lavoro con meno della metà della facilità), età e crisi. `licenzia(testo, vol)`: se non lo lasci tu (`vol`), parte la **NASpI** (`avviaNaspi`: 75% dello stipendio con tetto, metà dei mesi lavorati negli ultimi 48 in `S.lav48`, −3% al mese dal sesto). Il **TFR** matura ogni mese (`L.tfr`) e si incassa a ogni fine lavoro (`pagaTFR`).
- **Sussidi** (`vociWelfare` nel bilancio): ADI dal 2024 solo con minori, over 60 o disabili; reddito di cittadinanza 2019–2023; **SFL** (attività «Corso con il Supporto formazione e lavoro», 500 € × 12 mesi); **assegno sociale** dai 67 anni con redditi bassi; **reversibilità** (60% della pensione del coniuge morto, ridotta con redditi alti; finisce con nuove nozze); **mantenimento** dei figli dopo una separazione.
- **Pensione con le regole dell'anno** (`requisitiPensione()` in c9_epoca.js): prima del 1993 vecchiaia a 60 anni (55 le donne) con 15 di contributi e anzianità con 35; riforma Amato 1993–2000; 65/60 anni e quote nel 2001–2011; Fornero 2012–2018; dal 2019 67 anni, quota 100/102/103. Chi ha contributi prima del 1996 ha una quota **retributiva** (2% dell'ultimo stipendio per ogni anno: `retributivo()`, `S.anniRetr`, `S.montRetr`, `S.fatti.ultimaRAL`). Prima del 1982 la «liquidazione», poi il TFR; la disoccupazione ha il nome dell'epoca (`nomeDisoccupazione`).
- **Pensione contributiva**: `S.montante` cresce del 33% dello stipendio lordo (24% del compenso da imprenditore) e si rivaluta ogni anno; `pensioneMaturata()`: vecchiaia a 67 anni con 20 di contributi, anticipata con 42 anni e 10 mesi (41 e 10 le donne), a 71 anni bastano 5; importo = montante × `COEFF_TRASF` (2025–26) al netto delle tasse. `S.pensione` è netta annua (13 mensilità).
- **Famiglia**: «Provate ad avere un figlio» avvia `S.provano`; ogni mese `fertilitaMese(età della donna)` (25% sotto i 30, 5% a 40, 1% dopo i 45) → `S.gravidanza` (9 mesi, aborto spontaneo al 2° mese secondo l'età, gemelli 1,4%, cesareo 30%, congedo di maternità 5 mesi all'80%). Dopo un anno di tentativi: **procreazione assistita** (solo coppie di sesso diverso, legge 40). **Adozione** (`avviaAdozione`): solo coniugi di sesso diverso sposati da 3 anni (`p.nozze`), differenza d'età entro 45–55 anni, attesa di anni (`S.adozione`, eventi `adozione_arriva`/`adozione_niente`). **Separazione** (`divorzia` in c6): avvocati, metà dei risparmi fatti durante il matrimonio (`p.soldiNozze`), divorzio dopo 6 o 12 mesi (`inSeparazione()` blocca nuove nozze), evento `affido` con i figli minorenni (vivono con te, con l'altro genitore o a settimane alterne; `S.mantenimento`, `f.conEx`, `f.alterni`). Coppie dello stesso sesso: **unione civile** (niente chiesa, niente adozione).
- **Orientamento**: il giocatore ha `S.orient` dalla nascita (94% etero, 3% omo, 3% bi, indicativo): l'evento «Chi ti piace» arriva solo a chi non è etero. Le persone del gioco: `orientNpc(p)`, `p.pSesso` (sesso del loro compagno), `coppiaStessoSesso(p)`; hanno figli anche se non sposate (43% dei nati in Italia).
- **Eredità**: quando muoiono entrambi i genitori, `ereditaGenitori()`: soldi secondo la classe e, spesso, la **casa di famiglia** (evento `eredita_casa`: tenerla liquidando i fratelli, affittarla, venderla e dividere, lasciarla ai fratelli; imposta di successione oltre 1 milione a testa). La città di nascita è in `S.fatti.cittaNascita`.
- **Epoche** (c9_epoca.js, Fase 3.1): si nasce dal 1950. `STORIA` va dal 1951 (alluvione del Polesine, Carosello, il Sessantotto, la crisi del petrolio, il referendum sul divorzio, le Brigate Rosse, Italia campione del mondo nel 1982, Chernobyl, Mani pulite, l'euro…), `ELEZIONI_VERE` dal 1953; divorzio dal 1971 (`divorzioPossibile`), unione civile da giugno 2016, voto a 21 anni fino al 1975 (`etaVoto`), **naja** per i ragazzi nati fino al 1985 (`controllaNaja`, eventi `naja`/`naja_congedo`: 15, 12 o 10 mesi, obiezione dal 1972, riforma), social dal 2008, console dal 1985, lavori e corsi che non esistevano (`DAL_LAVORO`, `DAL_CORSO`). I fogli di sistema hanno `meta:1`.
- **Territorio** (Fase 3.6, fondo di c7_italia.js): `zonaMia()` (con `luogoC()`, il luogo ricordato finché non cambi città). A parità di lavoro lo stipendio vale `fattoreZona(j)` (Nord-ovest 1,06 · Nord-est 1,03 · Centro 1 · Sud 0,92 · Isole 0,91; 1 per concorsi, cariche elettive e contratti nazionali `CONTR_NAZ`: scuola, sanità pubblica, Poste); le persone del gioco lavorano secondo `occZona()` (quota di occupati 86–88% al Nord, 60–62% al Sud, più licenziamenti e meno assunzioni al Sud; vale anche per la stabilizzazione dei tuoi contratti a termine); «Spesa e bollette» × `costoZona()` (Sud −10%). Chi lascia il Sud tra i 18 e i 45 anni è **emigrato** (`marcaEmigrazione` in `dopoTrasloco`, `S.fatti.emigrato={t,da,prov}`); dopo 5 anni, e di nuovo da pensionato, l'evento `ita_ritorno` (tornare, tornare lavorando da remoto dal 2020, restare).
- **Cassa integrazione** (Fase 3.2): `puoCIG()` (contratto stabile, settori privati, non concorsi né partite IVA, non nei 24 mesi dopo l'ultima) → `chiediCIG()` → evento `ita_cig` (aspettare, fare un corso, prendere l'incentivo e andarsene). Arriva di rado (~1% l'anno), di più nelle crisi (metà dei licenziamenti per crisi diventa prima cassa integrazione) e nel lockdown del 2020. `S.lavoro.cig` = mesi che restano: niente valutazioni né promozioni, nel bilancio «Cassa integrazione (INPS)» = 80% con il tetto (`nettoCIG`); alla fine si torna al lavoro o l'azienda chiude (20%, 35% in crisi). `S.fatti.cigN` conta i mesi.
- **Assegni per i figli** (`assegnoFigli()` in `vociWelfare`): da marzo 2022 l'**Assegno unico** (57,5–201 € al mese per minore secondo l'ISEE), prima gli **assegni familiari** (solo dipendenti e pensionati, fino a 110 € al mese per figlio, a zero oltre un certo reddito); metà se il partner vive con te. L'**ISEE** stimato (`iseeStima`) si vede nella scheda Beni dal 1998.
- **Successione legittima** (`quoteSuccessione(X)`): coniuge e un figlio ½ ciascuno, coniuge e più figli ⅓ al coniuge, solo coniuge ⅔ (⅓ a genitori o fratelli), poi genitori e fratelli; chi convive senza nozze non eredita. Il necrologio la mostra («Eredità»), «Continua come…» dà al figlio la sua quota meno l'imposta (`impostaSucc`: 4% oltre un milione, niente nel 2001–2006).
- **Mutui** (Fase 3.4): all'acquisto si sceglie **tasso fisso** o **variabile** con i tassi medi veri dell'anno (`TASSI_MUTUO` 1950–2026, `tassoMutuo(tipo)`; dopo il 2026 si muovono da soli in `annoTassi`). `p.mutuo = {residuo, rata (annua), anni, tipo, tasso}`; ogni gennaio `annoMutuo(p)` ricalcola la rata del variabile e, se sale di oltre il 10%, apre `mez_tassi` (passare al fisso, estinguere una parte, stringere la cinghia; al massimo ogni 2 anni). I mutui dei salvataggi vecchi sono fissi al 3,5%.
- **Sanità** (Fase 3.5): a 14 anni il medico di base (prima del 1979 «della mutua»: `prezzi()` cambia «il Servizio sanitario» e «medico di base» in «mutua» nei testi mostrati prima del 1979); **screening dell'ASL** (`SCREEN`, `meseScreening()` in `meseItalia`): mammografia 50–69 anni ogni 2 dal 1999, Pap test (test HPV dal 2016 sopra i 30) 25–64 ogni 3 dal 1996, colon 50–69 ogni 2 dal 2005; gli inviti arrivano meno al Sud (`INVITO_ZONA`); il primo apre `ita_screening`, poi si va per abitudine (`S.fatti.scrAbit`) con una riga di diario; `S.fatti.screening` li conta e `S.fatti.screenT` fa trovare prima i tumori (+10% di remissione). **Liste d'attesa**: «Visita specialistica» apre `ita_attesa` con i mesi della tua zona (`mesiAttesa`: 1–3 al Nord, 3–8 al Sud e nelle Isole): aspettare con il ticket, intramoenia (dal 1999), privato, un'altra regione.
- **Costi veri**: figli secondo il reddito della famiglia (`costoFiglio`: 7.800–21.000 € l'anno), badante (~20.000 €) e RSA (~20.000 €) con la parte coperta da pensione e accompagnamento (`costoAssistenza`).
- **Nomi per generazione** (`NOMI_GEN`, `nomiPer(sesso, annoNascita)`): nonni, genitori e figli hanno i nomi della loro epoca; amici, colleghi e partner nati dal 1975 sono di origine straniera nell'8% dei casi (`NOMI_STRANIERI`, `nomeEstraneo`).
- Salvataggi vecchi: `aggiornaStato()` (in `load()`) stima `S.montante`, `S.lav48`, `S.orient` e la città di nascita.

### Settimana e bisogni
- `obblighi()` = ore fisse (sonno, scuola, lavoro, spostamenti, casa, figli, assistenza); `oreLibere()` = 168 − obblighi.
- `ATT_R` = attività della settimana (sport, amici, famiglia, partner, figli, hobby, studio, uscite, schermi, social, extra, volontariato). `meseRoutine()` ne applica gli effetti; `contatti()` distribuisce le ore sulle persone.
- `bisogni()` calcola gli **obiettivi** di socialità, energia, stress, umore e ci si avvicina ogni mese di una percentuale. `mod('felicita',x)` dà una scossa che poi rientra.

### Persone (c4_persone.js)
Ogni persona ha `pers`, `tr` (tratto riassuntivo usato dai dialoghi), `mn` (mese di nascita), `stato` (lavora/disoccupato/studente/pensione…), `lavoro`, `coppia`, `pNome`, `figliN`, `malato`, `lontano`, `ricordi[]`, `ultimo` (ultimo contatto), `prestito`; i partner hanno `intim/pass/imp`.
- `meseNpc()`: invecchiano nel loro mese, muoiono, i rapporti calano senza contatto, `vitaNpc()` fa succedere le cose (lavoro, amori, figli, malattie, traslochi) e può aprire **richieste** (`richiesta('r_prestito',p)`, max una ogni 2 mesi).
- `ricorda(p,testo,v)` lascia un ricordo che la persona mostra nella sua scheda; `v` (da −3 a +3) dice quanto conta: senza, lo deduce `valenza(testo)` dalle parole («Non…», «Hai rifiutato…», «litigato» sono negativi; «prestato», «ospitat…», «vicin…» sono forti). Il testo è dal tuo punto di vista («Gli hai prestato 300 €»).
- `affinita(p)` confronta i caratteri; `mesePartner(p)` gestisce la coppia: tre mesi sotto il 40% aprono `cop_crisi`; la terapia di coppia (`S.terapia`, 6 mesi) aiuta mese dopo mese e finisce con `cop_terapia_fine`.

### Persone vere (c8_legami.js, d13_persone.js — ROADMAP Fase 2)
- **Gruppi** (`S.gruppi = [{id,k,n,m:[ids],dal,fine}]`): ogni amico o conoscente nuovo entra nel gruppo del posto in cui l'hai conosciuto (`assegnaGruppo`, da `nuovaPersona` con `x.dove`; senza, la tua vita di adesso: la classe, i colleghi, il quartiere). Chiavi: `elementari`, `superiori`, `lavoro:<id>:<da>`, `genitori:<figlio>`, `corso:<hobby>`, `quartiere:<città>`… `gruppoAttivo(G)` dice se ne fai ancora parte; quando non più, `G.fine` (servirà alla rimpatriata, `leg_rimpatriata`, 10+ anni dopo). Frequentare un amico porta un po' di tempo anche al suo gruppo (`contattoGruppo`).
- **Legami** (`S.legami = [{a,b,t,f,dal}]`, t: amici, coppia, ex): tra persone del gioco, non con te. `siConoscono(a,b)`: legame, stesso gruppo, famiglia, partner che vive con te (dopo un anno conosce i tuoi amici stretti), amici d'infanzia (conoscono i tuoi genitori). Alle tue feste di compleanno gli amici ancora «soli» si conoscono (`presentaAmici`), al matrimonio tutti. Due amici single e compatibili si possono mettere insieme (`formaCoppiaNpc`: `p.pId` reciproco) e lasciare (`separaNpc`).
- **I ricordi tornano**: nel gruppo le voci girano (`voci`: un ricordo forte cambia anche il rapporto con gli altri del gruppo); nei momenti difficili (lutto, licenziamento, diagnosi grave, separazione, carcere) si fa avanti chi hai aiutato (`bisognoAiuto` → `mem_aiuto`, al massimo ogni 2 anni); chiedendo soldi o prestiti contano i ricordi (`memoriaAiuto`, `rifiutoRicordo`); ai compleanni tondi, al matrimonio, quando una persona muore, nelle rimpatriate, nei 20 anni di nozze e quando un figlio compie 18 anni torna un ricordo vecchio. `ritorno(p,m)` lo conta in `S.fatti.ritorni` se è di almeno 10 anni prima.
- **Contesto** (`contestoNpc(p)`: lutto, malattia, neonato, separazione, disoccupato, lavoro nuovo, nuovo amore, trasferimento, pensione; date in `p.luttoT`, `p.lavT`, `p.neoT`, `p.sepT`, `p.nuovoT`, `p.trasfT`, `p.pensT`): compare nella scheda della persona («In questo periodo…») e apre argomenti di conversazione dedicati (`TEMI` con `c:p=>…`, sempre per primi), compreso «Parlate di chi conoscete tutti e due».
- **Stile da genitore** (`S.genit = {cal, reg, st}`): calore e regole (modello di Baumrind: autorevole, permissivo, autoritario, distaccato). Si muovono piano verso il tuo carattere e le ore con i figli, e con le scelte degli eventi `edu_` (`gen:{cal,reg}` sulla scelta, applicato da `applica()`; `eduMese()` ne propone una ogni tanto finché i figli vivono con te). Ogni anno `crescitaFiglio(p)` sposta il carattere dei figli secondo lo stile (`STILE_GEN`); a 18 anni `bilancioFiglio(p)` racconta com'è diventato e quanto ti somiglia. Nella scheda Persone: «Come genitore sei…».
- **Volti per tutti**: nella lista delle persone, in alto a destra nei fogli che riguardano una persona (`d.p`) o chi stai conoscendo (`d.cand.look`), al funerale nel necrologio (`funerale()`: chi viene e il ricordo che ha di te).
- Salvataggi vecchi: `iniziaLegami()` (in `aggiornaStato`) mette amici e conoscenti nei gruppi secondo `p.dove`.

### Eventi
Definizione: `ev({id, min, max, w, once, rip, cond, chi, pc, link, auto, prig, t, x, k, c})`
- `min/max` età; `w` peso; `once` una volta per vita; `rip` anni prima di ripetersi; `cond()` condizione; `chi:['Amico',…]` evento con una persona (in `d.p`); `link:1` solo se aperto da altro codice (non estratto a caso); `prig` solo in carcere.
- `t` titolo, `x` testo (stringa o `d=>…`), `c` scelte (array o `d=>array`).
- Scelta: `l` etichetta, `sub`, `cond`, `costo`, `p`+`si`/`no` (probabilità), oppure `e` (effetti: `f s i a k m voto perf rel bev gio` + abilità), `r` testo dell'esito, `pers` carattere, `fl` flag, `fut:[anni,id]` conseguenza rimandata, `pr:'reato'` processo, `fx(d)` codice libero che ritorna `[testo,'g'|'b'|'']`, `null` (chiude) o `KEEP` (lascia aperto il foglio).
- Segnaposto nei testi: `{o}` desinenza del giocatore (o/a), `{P}` nome della persona, `{po}` sua desinenza, `{lui} {Lui} {gli} {Gli} {lo} {Lo} {tuo} {Tuo}`, `{xe}` importo, `{nonno}`. Si risolvono in `t`, `x`, `l`, `sub` e `r` (passano da `T()`), **non** nei testi ritornati da un `fx`: lì scrivi i nomi (`${d.p.nome}`) o usa `T('…{o}…',d)`.

### Ritmo, incontri e momenti (ROADMAP Fase 1: d8–d12, f3_momenti.js)
- **Calendario senza ripetizioni** (`natale()`, `ferieAgosto()`, `capodanno()`, `elezioniPolitiche()` in d8_ritmo.js): ogni anno c'è una riga di diario costruita dalla situazione (con chi sei, i figli piccoli, i nipoti, il piatto della tua regione `TRAD_NATALE`, le tue ferie abituali `S.fatti.ferieAbit` con il costo per persona `costoFerie()`); un evento vero arriva solo con una **novità** (primo Natale in coppia o con il neonato, la «sedia vuota» dopo un lutto, il primo Natale lontano, da nonno, il turno a Natale; prime ferie tra amici, in coppia, con il neonato, da pensionato, dopo una separazione, figli che non vengono più, soldi che non bastano) oppure, di rado, per rimettere in discussione un'abitudine (`ferie` ogni 6+ anni, `natale_cal` ogni 6+, `propositi` ogni 5–7 anni, prima se c'è un motivo: forma, schermi, conto in rosso, voti). Alle elezioni la prima volta si sceglie, poi si vota per abitudine (`S.fatti.voto`) e solo 3 volte su 10 si riapre la scelta. «Il conto è in rosso» e «Sommerso dai debiti» tornano dopo 1, 2, 3, 4 anni.
- **Incontri** (`incontri()` in c4, modelli `INC` in d8): 14 modi di conoscere qualcuno (`inc_scuola`, `inc_parco` per i piccoli, `inc_lavoro`, `inc_tramite` un amico di un amico, `inc_vicino`, `inc_treno`, `inc_cane`, `inc_genitori` fuori da scuola, `inc_corso`, `inc_festa`, `inc_volont`, `inc_online`, `inc_quartiere` dai 60 anni, `inc_viaggio` ad agosto), pesati da come passi la settimana; da single, dai 16 anni, una parte diventa `incontro_rom`. Chi ha già tanta gente intorno conosce meno persone nuove. `faiAmicizia(d,bonus,testo)` e `conosci(testo)` sono le risposte comuni.
- **Catene** (d12_catene.js): ogni passo successivo è un evento `link` aperto con `fut:[anni,id]` o `futuro(anni,id,d)`; i dati passano in `d.x`, la persona in `d.p`. La condizione del passo si ricontrolla quando arriva.
- **Persone morte negli eventi**: `next()` salta un evento se `d.p` non è vivo. Per parlare di chi non c'è più usa un altro campo (`d.m`, come in `cal_natale_lutto`). `mortePersona` segna `p.mortoT`; la fine di una coppia segna `S.fatti.fineCoppiaT`; ogni persona nuova ha `p.da` (da quando la conosci).
- **Momenti chiave** (f3_momenti.js): `momento(tipo,{tit,sub,txt,pids})` li registra in `S.momenti`; laurea, primo lavoro, matrimonio, figlio e pensione si aprono a tutto schermo quando si chiude il foglio (`momentiDaMostrare`, in `next()`; l'avanti veloce si ferma), diploma, prima casa e primo nipote restano solo per il film. Alla morte parte una volta «Il film della tua vita» (`filmVita`: i momenti con il volto all'età di allora), poi resta un bottone nel necrologio; dalla scheda Vita, «I tuoi momenti». Come l'intro, non si aprono nei test automatici: per vederli `?anim=1`.

---

## Convenzioni importanti (errori già fatti: non ripeterli)
- **Genere:** `g('o','a')` e `gp(p,…)` leggono `S`, che al caricamento è `null`. **Mai** usarli dentro testi costanti di eventi (dà sempre il maschile): usa i segnaposto `{o}` / `{po}` oppure costruisci il testo dentro una funzione.
- Non scrivere `l{lo}` (diventa «vederllo»): scrivi `veder{lo}`.
- **Prezzi:** ogni importo in euro passa da `P(x)` (inflazione, dal livello vero dell'anno di nascita). Se il prezzo dipende dall'oggetto, mettilo accanto all'oggetto (vedi `ACQUISTI`, `IMPREVISTI`): mai un importo casuale slegato dal testo. Gli importi scritti a mano sono **ai prezzi del 2026** e vengono convertiti da soli in due casi: `m:` negli effetti degli eventi (`eff()` applica `P()`; una funzione `m:()=>…` deve ritornare già l'importo vero) e i «N €» con lo spazio normale nei testi mostrati (`prezzi()` in fogli, esiti, diario e descrizioni delle attività; `eur()` usa lo spazio non separabile, quindi non converte due volte). Tutto il resto va scritto con `P()`: `costo:()=>P(3000)` nelle scelte (un `costo:3000` numerico **non** passa da `P`), `soldi(-P(400))`, `eur(P(8000))`, `S.soldi>=P(1000)`. Le attività (`ATTIVITA`, con `sez:`) e le tabelle in `b_*.js` passano da `P()` quando si pagano. `lint_testi.py` segnala gli importi dimenticati. Nei quiz con i conti scrivi «euro», non «€».
- **Il passato è vero:** fino al 2026 non inventare fatti storici o economici nel mondo del gioco; un fatto vero va in `STORIA` (c7_italia.js) con anno e mese. Le tecnologie seguono l'anno (`S.anno`): niente smartphone ai bambini prima del 2010.
- **Anacronismi** (si nasce dal 1950): la tabella `EPOCA` (c9_epoca.js) dice da che anno ha senso ogni parola (telefonino 1995, euro 2002, social 2008, podcast 2015…). Gli eventi casuali, le scelte e le frasi di `varia` con una parola «del futuro» non compaiono prima (`annoEvento`, `annoScelta`, `soloEpoca`); per un'idea legata a un'epoca che non ha una parola chiave metti `dal:anno` sull'evento o sulla scelta. **I testi ritornati da un `fx` non vengono filtrati**: lì scegli tu il testo secondo `S.anno` (es. `S.anno>=2015?'podcast':'musica'`). Parola nuova d'epoca → aggiungila a `EPOCA`. `italia_vera.py` deve dare «ANACRONISMI: nessuno ✓».
- **Lavoro perso:** usa `licenzia(testo)` (NASpI, TFR, stress) o `licenzia(testo,true)` se lo lascia il giocatore; mai `S.lavoro=null` senza `pagaTFR()`.
- **Leggi italiane:** coppie dello stesso sesso → unione civile; adozione solo da coniugi sposati da 3 anni; social dai 14 anni; scooter 50 con il patentino AM dai 14, il 125 con la patente.
- **Testi che si ripetono** (Natale, ferie, regali…): usa `varia('chiave', TESTI.lista)` che evita le frasi usate di recente.
- **Azioni del giocatore:** `una(chiave, costo, fn, energia)` gestisce attesa ed energia; le attese sono in `cdAzione()` (es. colpi 3 mesi, esami 6). Ogni attività costa energia.
- **Dopo un `fx` che deve applicare anche `e`/`r`/`pers`**, non ritornare `null` (chiuderebbe il foglio saltando gli effetti): non ritornare niente.
- `S.relazioni` contiene anche i morti (`vivo:false`): usa `vivi(['Ruolo'])`.
- **Valori interi e passi piccoli:** `clamp()` arrotonda. Per cali/aumenti sotto 1 punto sui rapporti usa `relD(p,d)` (passo casuale con la media giusta, `passo(d)`); per il carattere `cambiaPers`. Con `clamp(x-.4)` il calo non avviene mai (era il bug dei rapporti «fermi al 100%»).
- **Testi adatti all'età e alla situazione:** il giocatore può avere 0 anni. Niente telefono/meme sotto i 12, niente caffè sotto i 16, niente «passa a trovarti» con chi vive con te (`convive(p)`). Le frasi di chi ti cerca sono in `CERCA` + `cercaTesto(p)`; gli argomenti di dialogo (`TEMI`) hanno `min`/`max` (età tua) e `pmin` (età dell'altro); sotto i 3 anni con la famiglia c'è solo «Fatti coccolare».
- **Le cose dolorose pesano:** oltre a `mod('felicita',…)` (che rientra), usa `pesa(stress,tensione)` per lutti, animali, amicizie e relazioni chiuse.
- **Amici e candidati:** `candidato()` è per gli incontri romantici (sesso secondo l'attrazione; età da `etaAmore()`: da minorenni coetanei, ±2 anni, da adulti dai 18 in su); per gli amici usa `candidatoAmico()`/`sessoAmico()` (2 su 3 dello stesso sesso).
- **Età credibili:** chi nasce durante il gioco (`nuovaPersona` con età 0) compie gli anni nel mese in cui nasce; i fratelli alla nascita sono distanziati di almeno 15 mesi; i cugini hanno almeno 20 anni meno dello zio; i suoceri di un partner anziano possono non esserci. `invarianti.py` controlla queste regole.
- **Traslochi del giocatore:** dopo aver cambiato `S.citta` chiama `dopoTrasloco(vecchiaCitta)` (chi vive nella nuova città smette di essere «lontano», chi resta nella vecchia lo diventa).
- **Crescite composte:** ogni cosa che si moltiplica ogni mese deve avere un tetto (vedi follower: `tettoFollower()`, massimo `CAP_FOLLOWER` = 40 milioni; prima arrivavano a milioni di miliardi e con le collaborazioni rendevano soldi infiniti).
- Le funzioni dei sistemi sono pensate per il mese: se aggiungi qualcosa di annuale, mettilo in `inizioAnno()` o in `compleanno()`.
- **Nomi e vocali:** «ad Arianna», «ed Elia»: usa `aNome(n)` ed `eNome(n)` quando una preposizione precede un nome.
- **Prefissi degli eventi:** controlla che il prefisso nuovo non sia già usato (nel 2026 `soc_` era già dei social e `gen_` dei genitori: gli eventi della Fase 2 sono `leg_`, `mem_`, `edu_`, `cop_`).
- **Nomi globali:** tutti i file condividono lo stesso spazio di nomi. Prima di creare una funzione o una costante nuova controlla che non esista già (`grep -n "const nome\|function nome" src/*.js`): nel 2026 `casaPropria` era già usata in e_azioni.js.
- **Eventi che si ripetono:** un evento di calendario o di stato non deve arrivare più di ~10 volte in una vita (`ritmo.py` lo misura). Se succede spesso, trasformalo in una riga di diario con `varia()` e tieni l'evento per le novità.

### Come aggiungere un evento
```js
ev({id:'bam_esempio',min:7,max:10,once:1,t:'Il titolo',x:'Il testo, con la desinenza {o}.',c:[
  {l:'Scelta coraggiosa',p:.6,si:{e:{f:3},pers:{N:-2,E:1},r:'Va bene.'},no:{e:{f:-2},pers:{N:1},r:'Va male.'}},
  {l:'Scelta prudente',pers:{C:2},r:'Nessun rischio.'},
  {l:'Scelta con una persona',cond:()=>vivi(['Amico']).length>0,fx:()=>{const a=pick(vivi(['Amico']));a.rapporto=clamp(a.rapporto+5);ricorda(a,'…');return [`Con ${a.nome}…`,'g']}}]});
```
Poi: build → fuzz → prova l'evento forzandolo (`coda=[{e:EV.bam_esempio,d:{}}];next()` dalla console).

---

## Bilanciamento: valori di riferimento
Con `python tools/sim.py 120` (pilota automatico, ottobre 2026) i valori attuali sono circa:
- età mediana alla morte **~86–90** (media ~84–87; con 120 vite oscilla di 2–3 anni); con `realismo.py 400`: media uomini ~81, donne ~86
- patrimonio reale mediano a fine vita **~230.000 €** (molti ereditano la casa dei genitori; dal 2026 le ferie e i regali di Natale si pagano ogni anno)
- tra 25 e 60 anni: felicità **~70**, stress **~22**, energia **~67**, socialità **~84**
- correlazioni (carattere a 18 anni → media 25–60): Emotività → felicità −0,4 / stress +0,8; le altre tra 0 e +0,2 sulla felicità
- stili di attaccamento: ~55% sicuro, ~29% evitante, ~12% ansioso, ~3% timoroso (dato reale: 59 / 25 / 11)
- carattere dai 18 anni a fine vita (media): C **+13**, A **+13**, N **−7** (cala soprattutto tra 20 e 40 anni), O ed E **−3/−4**; ~19 «svolte» da adulto per vita. `sim.py` stampa queste righe: se un tratto deriva di +20 o più, qualcosa si accumula senza rientrare.
- `realismo.py 600`: figli per donna ~1,1, matrimoni finiti ~39%, primo matrimonio ~35–37 anni, con i genitori a 30 anni ~40%, occupati 20–64 anni ~76%, NEET ~18%, pensione a ~67 anni.

Se una modifica sposta molto questi numeri, è probabile un errore. Il pilota automatico (`tools/autopilota.js`) dal 2026 ha preferenze decise una volta per vita (`S.fatti.apNozze`, `apFigli`, `apAttivo`), cura sempre i tumori, a volte lascia la scuola e sceglie a chi è attratto secondo `S.orient`; resta più «facile» della vita vera sul lavoro (troppi occupati) e trova sempre un partner (93% in coppia a 35 anni).

---

## Logo e intro
- **Logo**: «my» tracciato a linea tonda (spessore 18 su viewBox 200×160). La **m** sono gli alti e bassi; la **y** è una persona con le braccia alzate (gamba `M157 140V99`, braccia verso 133,53 e 181,53) e la **testa** è un punto ambra (157,38 r10). Colori: tratto `--accent`, testa `--felicita` (si adattano al tema scuro). In gioco: `logoSvg()` in f_ui.js (schermata di creazione); favicon SVG in a_shell.html.
- **Intro** (5 s, markup e CSS in a_shell.html, avvio `intro()` in f_ui.js): nasce un punto che batte due volte → 12 tacche (i mesi) → il punto salta e diventa la testa mentre la m si traccia e la y si alza e apre le braccia → 5 coriandoli (i cinque tratti) → motto → dissolvenza. Si salta con un tocco o un tasto. **Non parte** con «riduci movimento» né nei test automatici (`navigator.webdriver`); per vederla nei test: `dist/vitamia.html?intro=1`. I tempi sono nei `animation-delay` del CSS: se li cambi, aggiorna il commento in testa al blocco e il `setTimeout` di 5050 ms.

## Creazione e volto
- **Creazione** (f2_crea.js): la bozza vive in `C` (S è ancora `null`: niente `g()`/`gp()`, usa `gC(m,f)`). Il certificato (`htmlCert`) si ridisegna a ogni modifica; toccando una sua parte si apre la scheda giusta dell'editor. Anno di nascita **dal 1950 a oggi**: fino al 2026 il mondo segue la storia vera (prezzi, lire fino al 2001, fatti, leggi, tecnologie dell'epoca). `datiVita()` → `nuovaVita(o)` con `anno, meseN, giorno, look, note, fam{classe,madre,padre,fratelli}`; senza questi campi (simulazioni, «Vita a caso» nei test) tutto resta casuale come prima.
- **«Nasci»** (`nasci()`): timbro sul certificato → punto ambra che batte (come nell'intro) → si apre sulla presentazione «Benvenut* al mondo» (volto, famiglia con i volti, somiglianze, primi tratti) → «Inizia a vivere». Nei test automatici (`navigator.webdriver`) si salta tutto e si nasce subito; per vederla: `?anim=1`.
- **Volto** (c5_aspetto.js): `S.look`/`p.look = {pelle,capelli,occhi,maglia (indici), taglio, barba}`. **Non confonderlo con `S.aspetto`**, che è la statistica di bellezza. Le persone senza volto (salvataggi vecchi, nati in gioco) lo ricevono da `lookDi(p)`: figli e nipoti somigliano a te e al partner. Il volto compare nella carta d'identità del gioco (cambia con l'età: neonato, bambino, adulto, capelli grigi dai 42, rughe dai 55, bianchi verso gli 80).

## Ricchezza, animali, amore (e2_lusso.js)
- **Ricchezza e lascito** (scheda Beni, compare da ~200.000 € di patrimonio): `S.lusso = {coll, donato (euro reali), fond, borse, onori, esp}` via `LX()`. Quattro **collezioni** da 6 pezzi (valore che cambia ogni anno in `annoLusso()`, conta nel `patrimonio()`), **beneficenza** con onorificenze (Socio benemerito 100 mila, Cavaliere 1 milione con karma ≥55, Commendatore 10 milioni), **fondazione** (1 milione, effetto ogni anno, citata nel necrologio), **borse di studio** (lettera di ringraziamento anni dopo), **esperienze di lusso** (sezione «Lusso» delle attività; rendono il 40% in meno ogni volta), **traguardi** visibili (`traguardi()`). Aiuti alla famiglia nel menu delle persone (bonifico, casa a un figlio).
- **Animali**: `a = {id,t,nome,eta,max,leg,sal,pappa}` (`initAnimale` per i vecchi salvataggi). Ogni mese `meseAnimali()`: se non gli dai da mangiare per 2 mesi e vivi da solo, perde salute e legame (può ammalarsi o scappare); se c'è qualcuno in casa ci pensa lui. Il legame dà umore (`legameAnimali()`) e pesa nel lutto. Nomi sempre diversi (`nomeAnimale`).
- **Da amici a innamorati**: `amorePossibile(p)` (ti attrae, età compatibile, sei single), `ricambia(p)` (orientamento dell'altro, `p.orient`), `dichiarati(p)`, `diventaPartner(p)`; evento `amico_confessa`.
- **Attività**: possono avere `max` (età massima) e `da` (prezzo «da …» quando il costo vero si sceglie dopo, come la Vacanza). Sezioni «Con quello che hai» (auto e patente, moto, barca, yacht, giardino, casa tua) e «Per la tua età» (parco giochi, pigiama party, luna park… bocce, liscio, guardare i cantieri). Le barche (`Gommone`, `Barca a vela`, `Yacht`) non contano come auto in `haAuto()`.

## Salvataggi (g_salva.js)
- In locale: `localStorage` (`save()` a ogni mese).
- Pulsante «Salva»: **file** `.my` (si caricano anche i vecchi `.vitamia`) o **codice** da copiare (`VITAMIA1Z:` + JSON gzip in base64), e caricamento da file/codice.
- **«Segnala un problema»** (nel foglio «Salva»): copia negli appunti la versione (`VERSIONE`, impronta dei sorgenti scritta da `build.py`), la situazione del personaggio, il diario degli ultimi 3 mesi e il codice della partita, da incollare in chat. Con il codice si ricarica esattamente la partita (e la si può aggiungere a `tools/salvataggi/`).
- **Online**: funziona solo quando il gioco gira come *artifact* su claude.ai, tramite `window.claude.use('db')` + `use('user')` + `use('downloads')`. Fuori da claude.ai `window.claude` non esiste e il codice lo ignora. Chi apre il link condiviso senza permessi di scrittura non può salvare online: per lui restano file e codice.

## Repository
Il progetto è su GitHub: **https://github.com/iTzQuick/my** (pubblico, ramo `main`), così Davide ci lavora anche dal telefono, per esempio con Claude Code sul web. La radice della repo è questa cartella (`VitaMia/`).
- Dopo una modifica: `build.py` → controlli → commit → push. Si rifanno e si caricano anche `dist/` (gioco, app, Atlante, diagramma), così si scaricano anche dal telefono.
- **Non vanno nella repo** (vedi `.gitignore`): `dist/all.js`, `tools/*_out.json`, le schermate di prova nella radice, le cartelle `tmp_*`.
- È pubblica: non metterci dati personali. I commit usano l'indirizzo «noreply» di GitHub.
- `netlify.toml` dice a Netlify di pubblicare `dist/app`: se il sito Netlify è collegato alla repo, ogni push con `dist/` aggiornato aggiorna l'app. Senza questo file Netlify pubblicava la radice e dava «Page not found».

## Pubblicazione
- **App sul telefono (iPhone di Davide)**: `build.py` prepara anche `dist/app/` (index.html con manifest, icone, `sw.js`) e `dist/my-app.zip`. Si pubblica su **Netlify**: la prima volta trascinando `dist/app` su app.netlify.com/drop; per aggiornare, `python build.py` e poi si trascina di nuovo `dist/app` nella pagina «Deploys» dello stesso sito. Su iPhone: Safari → Condividi → «Aggiungi alla schermata Home». Il service worker (`src/app/sw.js`, versione = hash della build) fa funzionare il gioco offline: la pagina prende prima la rete (aggiornamenti), senza rete la copia salvata; i Google Fonts restano in cache. Prova in locale: `python tools/test_app.py` (manifest, SW, gioco offline). Icone: `python tools/icone_app.py` (solo se cambia il logo).
- I salvataggi dell'app sono separati da quelli dell'artifact su claude.ai (origini diverse): per spostare una partita, «Salva → Copia il codice» da una parte e «Carica partita → Incolla un codice» dall'altra.
- **Artifact su claude.ai** (con `db`, `user`, `downloads`): Claude Code non può pubblicarlo; per aggiornare il link condiviso, carica `dist/vitamia.html` in una chat con Claude e chiedi di ripubblicarlo sullo stesso artifact.
- La pagina ha `<!doctype html>` e `<meta charset="utf-8">` (aggiunti nel 2026: prima era in modalità compatibilità e i server che non dichiarano UTF-8 storpiavano gli accenti).

## Atlante
```bash
python build.py                    # prima il gioco
cd atlante && python estrai.py     # dati.json (eventi, scelte, lavori…)
python simula.py 600               # sim.json (≈4 min)
python derivati.py && python build.py   # → dist/atlante-vitamia.html
```
**Diagramma di flusso** (`dist/flusso-my.html`, stile Detroit: capitoli della vita, eventi → scelte → esiti, ricongiunzioni, catene, finali): dopo `estrai.py` lancia `python flusso.py` nella cartella atlante. Lo generano `flusso.py` (impaginazione), `scan_collegamenti.py` (chi apre ogni evento, letto dal codice: eventi, funzioni del motore, attività) e `flusso_pagina.html` (pagina con zoom, ricerca, dettagli e pannello «Il motore»). I passaggi automatici dei capitoli (`TAPPE` in flusso.py) e le cause di morte sono scritti a mano dal codice: se cambi scuola, pensione, morte o eredità, aggiornali lì.
Se aggiungi un file di eventi in `src/`, aggiungilo anche alla lettura delle sezioni in `atlante/estrai.py` (variabile `srcEv`; ci sono già `d7_vita_italiana.js` e `d14_italia.js`). Se aggiungi condizioni nuove, traducile in `atlante/mappe.py` (altrimenti l'Atlante mostra il codice).

---

## Numeri attuali
764 eventi, ~2.120 risposte (~1.200 con `pers`); eventi possibili per età (`ritmo.py`): 0–5 → 104, 6–12 → 190, 13–17 → 160, 18–25 → 231, 26–40 → 261, 41–65 → 266, 66+ → 192; 29 catene di almeno 3 passi; nessun evento oltre le 10 volte per vita (i più frequenti: propositi, Natale, ferie ~7–8). 81 lavori, 22 facoltà, 19 corsi, 9 attività in proprio, 48 attività, 7.904 comuni; si nasce dal 1950 (storia vera fino al 2026).

## Idee e cose da fare
La roadmap completa, con priorità e criteri di «fatto», è in **ROADMAP.md** (fasi 0–7: zero errori, ritmo, persone, Italia vera, corpo e mente, scopo, interfaccia, misura del realismo). La lista dettagliata di cosa manca e cosa non va (errori con il punto del codice, dati veri da usare, fonti) è in **ANALISI.md** (ottobre 2026): le correzioni del punto 3 sono fatte; restano le aggiunte del punto 4 (animali, viaggi, regioni, feste, sanità…); i nuovi lavori del punto 4.6, i contratti di lavoro e il divario uomo-donna sono fatti.
- Carattere da adulti: fatto (d6_adulti.js, `pers` sulle richieste delle persone e su ~25 eventi adulti classici). Si potrebbe estendere ad altri eventi di d_eventi/d2 (per ora solo quelli dove la scelta dice chiaramente qualcosa del carattere).
- Fase 1 (ritmo e varietà) fatta nell'ottobre 2026: calendario, incontri, eventi 26–65, infanzia e adolescenza, catene, momenti chiave.
- Fase 2 (persone vere) fatta nell'ottobre 2026: gruppi e legami tra le persone, ricordi che tornano, conversazioni nel contesto, stile da genitore, crisi e terapia di coppia, volti. Prossime nella ROADMAP: Fasi 5, 4, 6.
- Fase 3 (Italia vera) fatta nell'ottobre 2026: si nasce dal 1950 con le lire e la storia vera, nessun anacronismo, pensioni con le regole dell'anno, naja, zone (stipendi, occupazione, costo della vita, emigrazione e ritorno), cassa integrazione, addizionali, assegno unico, ISEE, successione legittima, mutuo fisso o variabile con i tassi veri, screening dell'ASL, liste d'attesa, «mutua» prima del 1979.
- Più eventi per la terza età legati alla vita del mese (nipoti, salute, solitudine, il circolo).
- Un «pilota automatico» giocabile: far vivere il personaggio da solo secondo il carattere (la base c'è in `tools/autopilota.js`).
- Simulazione di «tutti i tipi di persona» (Big Five × attaccamento × interessi): l'idea di partenza del progetto, mai avviata.
