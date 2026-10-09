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

---

## Fase 0 — Zero errori (🔴, da fare per prima, M)
Le prove di Noemi hanno mostrato che gli errori più frequenti non sono crash, ma **incoerenze**: testi non adatti all'età, genere sbagliato, numeri che esplodono, rapporti bloccati. Si possono trovare in automatico.

| # | Cosa | Come | Fatto quando |
|---|---|---|---|
| 0.1 | ✅ in parte (parole per età) · **Controllore dei testi** (`tools/lint_testi.py`) | Legge tutti gli eventi e le azioni e segnala: `g()`/`gp()` in testi costanti, segnaposto non risolti (`{…}` rimasti), `l{lo}`, importi scritti a mano senza `P()`, parole da adulti (caffè, telefono, lavoro, alcol, partner, mutuo) in eventi o azioni accessibili sotto una certa età. | 0 segnalazioni, ed è nei controlli dopo ogni modifica |
| 0.2 | **Invarianti ogni mese** nel fuzz e nella simulazione | Dopo ogni `mese()` si controlla: statistiche tra 0 e 100, nessun `NaN`/`Infinity`, soldi e follower finiti, al massimo un coniuge vivo, genitori più vecchi dei figli di almeno 15 anni, fratelli con età plausibili, nessun partner adulto per un minorenne, nessun evento su persone morte, animali con nomi diversi, niente «lontano» con chi vive nella tua città. | 1.000 vite senza violazioni |
| 0.3 | **Salvataggi d'archivio** | Una cartella `tools/salvataggi/` con partite vere di versioni vecchie (anche quella di Noemi). A ogni build si caricano tutte e si giocano 24 mesi. | Nessun salvataggio rotto |
| 0.4 | **Controllo crescite composte** | La simulazione stampa massimo e 99° percentile di patrimonio, follower, valore dell'azienda, borsa e collezioni, e avvisa se superano soglie realistiche. | Nessun valore «infinito» in 1.000 vite |
| 0.5 | **Revisione per età di tutte le azioni** | Ogni bottone del gioco ha un'età minima esplicita, e un rapporto per fascia (0–2, 3–5, 6–12, 13–17) elenca cosa si vede. | Revisione fatta con Davide |
| 0.6 | **Famiglia credibile alla nascita** | Fratelli distanziati di almeno ~15 mesi (gemelli rari), età dei genitori coerenti, nonni e zii plausibili. | Coperto da 0.2 |
| 0.7 | **«Segnala un problema» nel gioco** | Un bottone che copia negli appunti il diario degli ultimi 3 mesi e lo stato, da incollare in chat. | Usato nelle prossime prove |

---

## Fase 1 — Ritmo e varietà (🔴, M)
Oggi una vita media ha circa 460 eventi, ma alcuni si ripetono troppo (dati della simulazione, per vita):

| Evento | Volte per vita |
|---|---|
| Una persona nuova | 77 |
| Le ferie d'agosto | 54 |
| I buoni propositi | 48 |
| Natale | 34 |

- 1.1 **Eventi del calendario non ogni anno**: le ferie e Natale diventano un riassunto nel diario negli anni «normali», ed eventi veri solo quando c'è una novità (primo Natale col partner, ferie col neonato…).
- 1.2 **Incontri vari**: dieci modelli diversi invece di uno (lo conosci tramite un amico, ti siede accanto in treno, è il nuovo vicino…) e frequenza che cala se hai già tante persone.
- 1.3 **Più eventi tra i 26 e i 65 anni legati alla vita del mese**: mutuo, figli adolescenti, genitori che invecchiano, colleghi, salute, stanchezza.
- 1.4 **Catene lunghe**: oggi sono 7. Obiettivo 25 (la causa di lavoro, la ristrutturazione infinita, il figlio che torna a casa a 35 anni…).
- 1.5 **Momenti chiave «cinematici»** come la nascita (timbro, animazione, presentazione): laurea, primo lavoro, matrimonio, nascita di un figlio, pensione, morte con il «film della vita».

*Fatto quando*: nessun evento casuale supera le 10 volte per vita (escluse le scelte del giocatore), e ogni fascia d'età ha almeno 150 eventi possibili.

---

## Fase 2 — Persone vere (🔴, L) — il cuore del simulatore
- 2.1 **Le persone si conoscono tra loro**: amici in comune, gruppi (la compagnia del liceo, i colleghi, i genitori della scuola), coppie tra persone del gioco, gelosie e conflitti tra loro.
- 2.2 **Memoria che conta**: i ricordi (`ricordi[]`) cambiano davvero le reazioni (chi hai aiutato ti aiuta, chi hai tradito non si fida).
- 2.3 **Conversazioni nel contesto**: argomenti che dipendono da quello che sta vivendo l'altro (lutto, nuovo lavoro, figlio appena nato, malattia).
- 2.4 **Crescere i figli**: il tuo stile da genitore (presente, severo, permissivo) forma il loro carattere; adolescenza dei figli; figli che ti somigliano anche nel carattere.
- 2.5 **La coppia matura**: decisioni condivise (dove vivere, figli, soldi), crisi, tradimenti, terapia di coppia, separazione con affidamento e assegno.
- 2.6 **Volti per tutti**: nella scheda Persone, nella presentazione dei nuovi incontri e nel necrologio.

*Fatto quando*: in una vita simulata ogni amico stretto ha almeno un legame con un'altra persona del gioco, e le scelte di 10 anni prima tornano almeno 5 volte.

---

## Fase 3 — Italia vera (🟠, L)
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
- 5.1 **Aspirazioni con progressi visibili** (oggi realizzata sì/no) e traguardi per ogni aspirazione, non solo per la ricchezza.
- 5.2 **Vecchiaia piena**: nipoti, viaggi, volontariato, solitudine, testamento dettagliato (a chi lasci cosa), «ultimo desiderio».
- 5.3 **Lavoro vissuto**: colleghi e capo come persone persistenti, progetti, scelte di carriera (cambiare settore, mettersi in proprio, emigrare).
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
2. **Fase 1** (ritmo): è il miglioramento che si sente di più giocando.
3. **Fase 2** (persone): la differenza tra un BitLife e un simulatore vero.
4. Poi Fasi 5, 4, 3, 6, secondo quello che emerge dalle prove con Noemi.

Ogni fase si chiude con: build → controlli → simulazione → prova sul telefono (Netlify) → feedback.
