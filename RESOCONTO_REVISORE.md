# Resoconto per la sessione «revisore» di my

Questo file serve a una nuova sessione di Claude che deve aiutare Davide **come revisore e consigliere**, non come sviluppatore. Leggi prima `CLAUDE.md` e `ROADMAP.md`: qui c'è solo quello che non sta lì.

Aggiornato all'11 ottobre 2026, ultimo commit su `main`: `d1eedcc` (rappresentazione dei figli premorti).

---

## 1. Il tuo ruolo

Davide sviluppa «my» con **Sonnet** in Claude Code, dal **terminale del PC (Windows, PowerShell)**, oppure dall'iPhone con l'app. Tu **non scrivi il codice**: Davide incolla qui quello che Sonnet gli scrive, cioè piani, domande e resoconti, e tu:

1. **Verifichi su GitHub** quello che Sonnet dice di aver fatto. `git fetch origin main`, `git log --oneline -5 origin/main`, `git show --stat <commit>`, `git show origin/main:<file>` e `grep`. Non fidarti del resoconto: guarda il codice.
2. **Rivedi i piani prima dell'ok**: errori storici e legali, scelte che spostano il realismo, piani troppo grandi da dividere in più commit.
3. **Rispondi alle domande** che Sonnet fa a Davide, con una raccomandazione chiara per ognuna.
4. **Prepari un messaggio da incollare** a Sonnet, in un riquadro, breve e completo: correzioni, risposte numerate, ordine dei commit e controlli da lanciare.

Lingua: **italiano**. Tono diretto e conciso. Davide legge spesso dal telefono, quindi niente muri di testo.

## 2. Come lavora Davide (preferenze)

- **Consumi**: usa un abbonamento claude.ai e vuole spendere poco. Sonnet per il lavoro normale, Opus o opusplan solo per progettare fasi o per errori difficili (vedi «Modelli e impegno» in CLAUDE.md). Consigliagli `/clear` o una sessione nuova a ogni fase: con contesti oltre i 150.000 token il consumo sale molto.
- **Un commit per blocco**, push su `main` dopo i controlli. Mai PR.
- **Prima di tutto `git pull origin main`**: Davide lavora sia dal PC sia da sessioni cloud. Una volta Sonnet ha lavorato su una copia ferma da giorni e non trovava `c12_estero.js`. Se Sonnet dice che un file «non esiste», la prima ipotesi è la copia vecchia.
- Sul PC ha già sistemato Remote Control (`claude rc`): ha tolto `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` da `~/.claude/settings.json` e ha fatto `/login` con l'account claude.ai. Playwright e Chromium sono installati.

## 3. Errori che Sonnet ha già fatto (controlla sempre questi)

- **Date storiche sbagliate o approssimate.** Corrette finora:
  - Libera circolazione dei lavoratori CEE: **dall'autunno 1968** (regolamento 1612/68). Tra il 1961 e il 1968 era graduale. Il 1° luglio 1968 è l'unione doganale.
  - **Regno Unito**: permesso di lavoro prima del 1973, libera circolazione dal **1973 al 2020**, visto dal **2021** (non «dal 2016»).
  - **Belgio, miniere**: dal 23 giugno 1946 al **1956**, poi stop dopo Marcinelle (8 agosto 1956, 262 morti, 136 italiani). Dal 1968 il Belgio è una meta CEE normale.
  - **Germania**: accordo del 20 dicembre 1955. **Svizzera**: permessi da stagionale fino al **2002**; gli stagionali lasciavano la famiglia a casa (i «bambini proibiti»).
  - **Spagna** nella CEE dal 1986 (libera circolazione piena dal 1992), **Irlanda** dal 1973.
  - **Mezzadria**: niente nuovi contratti dal 1964, abolita del tutto nel 1982.
- **Esclusioni che diventano disparità**: voleva escludere il part-time dai colleghi, il che li avrebbe tolti soprattutto alle donne.
- **Tappe o soglie che non coincidono con il codice esistente**: per esempio un'aspirazione la cui ultima tappa andava oltre `ok()`, o «continenti» che il gioco non conta.
- **Piani troppo grandi**: proponi sempre di dividere (5.3 è diventata 5.3a, b e c; la 5.2 quattro blocchi).
- **Indebolire un controllo per farlo passare**: quando un invariante «viene tollerato», controlla che resti un controllo vero (per esempio la tolleranza di un mese sui colleghi orfani era giusta).
- **Leggi italiane**: verifica le quote. La legittima in `c13_vecchiaia.js` è corretta: ⅓+⅓, ¼+½, ½ o ⅔ ai figli, ½ al coniuge con ¼ ai genitori, ⅓ ai soli genitori. La rappresentazione dei figli premorti (artt. 467–468) è stata aggiunta in `d1eedcc`.

## 4. Cosa è fatto (ROADMAP)

- **Fase 0** (zero errori): fatta, tranne la 0.5 (età minime delle azioni, da rivedere con Davide con `tools/eta_azioni_out.md`) e il salvataggio di Noemi da aggiungere all'archivio.
- **Fasi 1, 2, 3**: fatte.
- **Fase 5**:
  - **5.1** aspirazioni con tappe: `3b4e432`.
  - **5.3** lavoro vissuto:
    - **5.3a** capo e colleghi come persone, eventi `col_` e `prg_`: `1ef0a13`, `4dd58a7`.
    - **5.3b** cambiare settore e mettersi in proprio (`car_`): `effe7f2`, più il pilota che sceglie la partita IVA in `932eea6`.
    - **5.3c** emigrare, con le mete per epoca in `META_EMI` (`src/c12_estero.js`): `ad70db1`.
  - **5.2** vecchiaia:
    - testamento con legittima e ultimo desiderio: `203e53e`;
    - nipoti con una vita propria: `25fe0f2`;
    - circolo, volontariato e solitudine: `e5cb470`;
    - viaggi da anziano: `b03f99a`;
    - rappresentazione dei figli premorti: `d1eedcc`.
- **Correzioni lungo la strada**:
  - editor «Famiglia» con età dei fratelli valide: `0d55d55`;
  - coppie tra minorenni al massimo a 2 anni di distanza: `f149584`;
  - `next()` che ricontrolla i passi delle catene (`_ric`): `ca9d03f`;
  - Ex non più «lontani» nella stessa città: `5be142f`.

## 5. In corso adesso

**Nonni con la storia dell'epoca**: Sonnet ha il piano approvato con queste modifiche.
- Una storia per nonno, scelta secondo il suo anno di nascita e la regione, in un file nuovo `c14_nonni.js` con la tabella `STORIE_NONNI`. Si raccontano in `nonno_storie` e `ado_nonno_storia` e compaiono al funerale.
- Storie con date vere:
  - Prima guerra (nati prima del 1900) e Seconda guerra (1915–1927);
  - America (inizio Novecento);
  - Belgio 1946–56 con Marcinelle (nati circa 1910–1935, riusa `META_EMI`);
  - Germania e Svizzera 1955–70, dal Sud al Nord negli anni '50–'60;
  - mezzadria;
  - la fabbrica del boom e la bottega.
- **Più due storie per i nonni giovani**, chiesti da te:
  - nati circa 1945–1960: il Sessantotto, l'autunno caldo del 1969, la fabbrica e il sindacato; per regione il Friuli 1976 e l'Irpinia 1980;
  - nati circa 1960–1980: il lavoro negli anni '80, il mutuo con tassi alti, i Mondiali 1982, l'euro.
- **Regione per lato** (materno e paterno), assegnata «pigra»: per chi nasce al Nord circa 1 lato su 4 viene dal Sud, se i nonni sono nati tra il 1920 e il 1945.

Quando arriva il resoconto, verifica il commit, le date e l'assenza di anacronismi (`italia_vera.py`).

## 6. Cosa resta (in ordine consigliato)

1. **5.4 Eredità tra generazioni**: giocare come figlio con la casa, i debiti, i rancori e le collezioni dei genitori. «Continua come…» esiste già e usa `quoteSuccessione`.
2. **A fine Fase 5**: `realismo.py 400` (non è stato lanciato sulla 5.2) e `simula.py 600` per aggiornare le statistiche dell'Atlante (sono ancora quelle vecchie).
3. **Fase 4** (corpo e mente): 4.5 non autosufficienza del giocatore (badante, RSA, stare da un figlio; riusare `costoAssistenza`), salute mentale con ricadute, dipendenze.
4. **Fase 6** (interfaccia), **0.5** (età delle azioni, da fare con Davide davanti al gioco).
5. Idee aperte: i gemelli come scelta nell'editor di creazione; l'oltreoceano (Argentina, USA, Australia) per l'emigrazione; il pilota automatico accetta troppo (circolo e volontariato oltre il 50% degli over 75 nelle simulazioni, 23% delle vite che cambiano settore). Va reso più «umano».

## 7. Modello di risposta che funziona

Quando Davide incolla un piano di Sonnet:

1. Una riga su cosa hai verificato («è su GitHub», «le quote sono giuste»).
2. Le correzioni, con il motivo in una riga ciascuna.
3. Le risposte alle domande di Sonnet, numerate come le sue.
4. Un riquadro **«Messaggio da incollare»**, autosufficiente, che cominci con `git pull origin main` se c'è il dubbio che la copia sia vecchia.
