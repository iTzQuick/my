# my — analisi completa: cosa manca e cosa non va

*8 ottobre 2026. Basata su: il diagramma di flusso (`dist/flusso-my.html`), una lettura del codice, **440 vite simulate** con il nuovo strumento `tools/realismo.py` e ricerche su dati ISTAT, Eurostat, ISS, INPS e studi di psicologia (fonti in fondo).*

Questa è la lista di lavoro per avvicinare **my** a una vita umana vera. Completa la [ROADMAP](ROADMAP.md): la roadmap dice *in che ordine* lavorare, questo documento dice *che cosa* fare, con i numeri veri da usare.

> **Aggiornamento del 9 ottobre 2026: le correzioni sono fatte.** Tutto il punto 3 (errori e incoerenze) e i passi 1–5, 7 e 9 dell'ordine di lavoro sono nel gioco. La tabella «prima e dopo» è al punto 2bis. Restano da fare le **aggiunte** del punto 4 e del punto 5 (nuovi lavori, animali, viaggi, regioni, feste, sanità, eventi per età), cioè i passi 6, 8, 10 e 11.
> Rileggendo il codice ho trovato tre cose che avevo valutato male:
> - **La matrigna esisteva già**, tramite l'evento «Una nuova persona».
> - **La RSA a 800 € al mese era la parte a carico della famiglia**, dopo la pensione del genitore. Ora il costo è esplicito: retta piena, quota coperta da pensione e accompagnamento, quota che resta a te.
> - **Le scelte senza nessun effetto erano 42 su 1.133 (3,7%), non il 15%.** L'Atlante non vedeva il campo `pers`. Ora sono 5, volutamente: «cerco lavoro» e «non è il tuo tipo».
>
> Anche San Valentino c'era già, come riga del diario.

Legenda: 🔴 alta · 🟠 media · 🟢 bassa priorità. Impegno: **S** una sessione, **M** 2–4, **L** 5 o più. ✗ = lontano dalla realtà, ~ = da tarare, ✓ = già realistico.
Dove un dato non l'ho potuto verificare lo scrivo: *(da verificare)*.

---

## 1. In breve: le 12 cose più importanti

1. 🔴 **Il passato non è la storia vera.** Chi nasce nel 2005 ha il 2020 senza pandemia ma magari una pandemia nel 2013, e l'Italia «vince i Mondiali» a caso anche negli anni in cui non si è qualificata. In più i **prezzi partono sempre da quelli di oggi**: chi nasce nel 2000 paga nel 2000 i prezzi del 2026, e arrivato al 2026 li paga quasi il doppio.
2. 🔴 **I figli nascono all'istante.** Non ci sono gravidanza, parto, congedo, aborto spontaneo o gemelli. La probabilità resta al 50% ogni mese fino a 46 anni, mentre nella realtà a 40 anni è circa il 5% per ciclo. L'adozione è concessa anche a chi la legge italiana la vieta.
3. 🔴 **Si muore «nel sonno».** Il 54% delle morti è «serenamente, nel sonno» e solo il 3% è per tumore, contro il 26% della realtà. Le donne muoiono prima degli uomini (82,5 contro 84), mentre in Italia vivono 4 anni di più. Un tumore non guarisce mai, mentre nella realtà ne guarisce circa la metà.
4. 🔴 **Il lavoro è troppo facile.** Lavora il 94% tra 20 e 64 anni, contro il 67,6% reale. I NEET sono il 3% invece del 13,3%. Non cambia niente tra Nord e Sud né tra uomo e donna. Mancano i lavori più diffusi: colf e badanti, agricoltura, artigiani, maestre.
5. 🔴 **Pensioni e sussidi non sono quelli italiani.**
   - L'Assegno di inclusione va a chiunque non lavori.
   - Mancano la NASpI, l'assegno sociale e la pensione di reversibilità.
   - Se a 67 anni non hai un lavoro, non prendi la pensione.
   - L'IRPEF 2026 è ancora al 35% invece del 33%.
6. 🔴 **Si esce di casa a 24 anni (in Italia a 30,2) e quasi nessuno vive con i genitori a 30.** In parte dipende dal pilota automatico, ma il gioco non dà motivi per restare.
7. 🔴 **Ci sono testi fuori età.**
   - A 6 anni un «collega» ti offre la focaccia.
   - A 10 e 12 anni c'è la birra.
   - A 5 anni guardi il telefono, a 8 mandi un messaggio con le emoji.
   - Un «video virale» arriva senza un profilo social.
8. 🟠 **La famiglia segue un modello di trent'anni fa.**
   - Le coppie dello stesso sesso si sposano «in chiesa», mentre in Italia esiste l'unione civile.
   - Tutte le coppie delle altre persone sono uomo-donna.
   - Non esiste la matrigna.
   - Le altre persone hanno figli solo se sono sposate, mentre il 43,2% dei bambini nasce fuori dal matrimonio.
9. 🟠 **Il carattere invecchia al contrario.** L'emotività (N) sale di 5 punti nella vita adulta, mentre gli studi dicono che scende tra i 20 e i 40 anni. L'attaccamento è «sicuro» nell'80% dei casi, contro circa il 60% reale. Dopo i 70 anni lo stress è quasi zero (2 su 100).
10. 🟠 **Badante e RSA costano la metà del vero.** Nel gioco 13.800 € e 9.600 € l'anno, nella realtà circa 19–21.000 € e 16–25.000 €.
11. 🟠 **Contenuti scoperti.**
    - Il primo anno di vita non ha nessun evento.
    - Ci sono solo 7 catene.
    - Una scelta su sette non ha conseguenze visibili.
    - Ci sono 4 animali, 6 mete di viaggio e 10 hobby.
    - I nomi sono uguali per tutte le generazioni: la nonna può chiamarsi Ginevra, il neonato del 2024 Massimo.
12. 🟢 **C'è codice da pulire.**
    - Una funzione richiama se stessa all'infinito: oggi la salva solo l'ordine dei file.
    - Una funzione annuale non viene più chiamata.
    - Una vecchia lista di imprevisti non si usa più.

**Cosa è già realistico** (da non rompere):
- gli stipendi per età (RAL mediana a 30/40/60 anni: 27.900 / 34.200 / 35.900 €, quasi uguale a JobPricing);
- l'età al primo matrimonio (34,5 uomini, 34 donne; in Italia 34,8 e 32,8);
- i figli per donna (1,13–1,28 contro 1,18);
- l'età al primo figlio (32–34 contro 32,7 al parto);
- la quota di vite con un animale (58% contro 54,5% delle famiglie);
- i 7.904 comuni con i prezzi delle case per regione;
- l'ordine del mese e il carattere «da te / non è da te».

---

## 2. my confrontato con l'Italia

Misurato con `python tools/realismo.py 200` (200 vite del pilota automatico). Una seconda prova da 240 vite dà gli stessi valori, con un margine di qualche punto.
**Attenzione:** il pilota automatico non è una persona normale. Cerca lavoro quasi ogni mese, non lascia mai la scuola, esce di casa appena può e si sposa nel 90% dei casi. Nella colonna «Perché» indico se lo scarto viene dal gioco, dal pilota o da entrambi.

| Indicatore | my | Italia (fonte) | | Perché |
|---|---|---|---|---|
| Età alla morte, uomini (mediana) | 84 | speranza di vita 81,7 (ISTAT 2025) | ~ | gioco |
| Età alla morte, donne (mediana) | 82,5 | speranza di vita 85,7 (ISTAT 2025) | ✗ | gioco: `morteP` non conosce il sesso |
| Morti per tumore | 3% | 26,3% (ISTAT, cause di morte 2023) | ✗ | gioco |
| Morti per malattie del cuore e dei vasi | ≈ 28% (infarto, ictus, insufficienza) | 30% | ✓ | |
| Morti «nel sonno», senza causa | 54% | non è una causa: servono demenze (5%), malattie respiratorie (8%), cadute… | ✗ | gioco |
| Hanno avuto un tumore | 12% | ≈ 1 uomo su 2 e 1 donna su 3 entro gli 84 anni (AIRC) | ✗ | gioco |
| Hanno avuto la depressione | 1% | sintomi depressivi: 6% degli adulti e 9% degli over 65 in un dato momento (ISS-PASSI 2023–24) | ✗ | gioco |
| Età di uscita di casa | 24 | 30,2 (Eurostat 2025) | ✗ | pilota + gioco |
| Con i genitori a 30 anni | 1% | circa metà | ✗ | pilota + gioco |
| Primo matrimonio: uomini / donne | 34,5 / 34 | 34,8 / 32,8 (ISTAT 2024) | ✓ | |
| Mai sposati | 10% | con i tassi del 2024 si sposerebbe entro i 50 anni il 37% degli uomini e il 42% delle donne | ✗ | pilota |
| Matrimoni finiti | 21% | 75.014 separazioni e 77.364 divorzi in un anno, contro 173.272 nozze (2024) | ~ | |
| Figli per donna | 1,28 (1,13 nella prova da 240) | 1,18 (2024), 1,14 (2025) | ✓ | |
| Senza figli a fine vita | 43% | circa 1 su 4 *(da verificare)* | ~ | troppi senza figli, e chi li ha ne ha tanti |
| Laureati (tra chi arriva a 30 anni) | 16% | 31,6% tra 25 e 34 anni (donne 38,5%, uomini 25,0%) | ✗ | gioco + pilota |
| Senza diploma | 0% | 9,8% lascia presto la scuola (18–24 anni); 33% tra 25 e 64 anni | ✗ | pilota + nessuna spinta all'abbandono |
| Occupati tra 20 e 64 anni | 94% | 67,6% (Nord 69,8%, Sud 50,0%) | ✗ | gioco + pilota |
| NEET tra 15 e 29 anni | 3% | 13,3% (2025), 20% tra 25 e 29 | ✗ | gioco + pilota |
| Reddito uomini / donne | uguale | dipendenti privati: 27.967 / 19.833 € (INPS 2024, part-time compreso) | ✗ | gioco |
| RAL a 30 / 40 / 60 anni | 27.900 / 34.200 / 35.900 € | 29.900 / 33.000 / 35.900 € (JobPricing 2025) | ✓ | |
| Casa di proprietà a 50 anni | 59% | 70,8% delle famiglie (2021); 81,6% delle persone (2024) | ~ | |
| Fumatori a 30 anni | 12% | 18,6% dai 14 anni in su (uomini 22%, donne 15%) | ~ | |
| Hanno avuto un animale | 58% | 54,5% delle famiglie (Assalco 2026) | ✓ | |
| Felicità per età | 66 da ragazzi → 73 tra 30 e 69 → 56 dopo i 90 | «molto soddisfatti»: 60,8% a 14–17 anni → 40,1% dopo i 75 (ISTAT 2024) | ~ | nella realtà i ragazzi sono i più soddisfatti (misure non identiche) |
| Stress medio dopo i 70 anni | 2 su 100 | — | ✗ | non è credibile: lutti, salute, solitudine |
| Stile di attaccamento | ≈ 80% sicuro, 12% ansioso, 5% evitante | 59% sicuro, 25% evitante, 11% ansioso (campione nazionale USA, Mickelson 1997) | ✗ | gioco |
| Emotività (N) dai 18 anni a fine vita | +5 | scende, soprattutto tra 20 e 40 anni (Roberts 2006) | ✗ | gioco |
| Ultimo lavoro | 26% «Art director» | — | ✗ | pilota + catalogo di lavori povero |

---

## 2bis. Dopo le correzioni (9 ottobre 2026)

Misurato con `python tools/realismo.py 600`, con il pilota automatico reso più «umano» (preferenze decise una volta per vita, cura sempre i tumori, a volte lascia la scuola).

| Indicatore | Prima | Dopo | Italia |
|---|---|---|---|
| Età media alla morte, uomini / donne | ≈ 81 / 81 (nessuna differenza) | **81,8 / 84,3** | 81,7 / 85,7 |
| Morti per tumore | 3% | **25%** | 26% |
| Morti per cuore e vasi | ≈ 28% (+ 54% «nel sonno») | **35%** («nel sonno» 5%) | 30% |
| Morti per malattie respiratorie / demenze | — | **9% / 8%** | 8% / 5% |
| Figli per donna | 1,13–1,28 | **1,1** (con gravidanza, fertilità per età, aborti spontanei) | 1,14–1,18 |
| Matrimoni finiti | 21% | **39%** | circa 4 su 10 |
| Con i genitori a 30 anni | 1% | **40%** | circa metà |
| Occupati 20–64 anni | 94% | **76%** | 67,6% |
| NEET 15–29 anni | 3% | **18%** | 13,3% |
| Età di pensionamento | 64 (solo con un lavoro) | **67** (anche senza lavoro, contributivo) | 67 |
| Attaccamento sicuro / evitante / ansioso | 80 / 5 / 12 | **55 / 29 / 12** | 59 / 25 / 11 |
| Emotività (N) dai 18 anni a fine vita | +5 | **−7** | scende tra 20 e 40 anni |
| Stress medio dopo i 70 anni | 2 | **9–15** | — |

Resta lontano dal vero:
- **Occupati, perché il pilota trova sempre lavoro.** Il gioco ora ha zone, età, crisi e lavori che finiscono, ma il pilota cerca molto più di una persona media.
- **Laureati: 40% contro 31,6%.**
- **Primo matrimonio: 36–37 anni contro 33–35.**
- **In coppia a 35 anni: 93% contro circa il 70%.** Il pilota trova sempre un partner.

---

## 3. Errori e incoerenze trovati

### 3.1 Testi fuori età o fuori situazione (🔴, S)
Regola di CLAUDE.md: niente telefono sotto i 12 anni, niente caffè sotto i 16.
- [focaccia](src/d2_eventi2.js:166) (6–90 anni): «*Il collega* ti propone la colazione dei veri liguri…» anche a 6 anni. La persona deve cambiare con l'età: la nonna, un compagno, un collega.
- [calcetto](src/d_eventi.js:218) (12–55): «Birra offerta dai perdenti» a 12 anni.
- [derby](src/d2_eventi2.js:172) (10–85): «Guardala al bar: birra, urla…» a 10 anni, e a 10 anni vai in curva da solo.
- [nonno_storie](src/d_eventi.js:441) (5–30): «Guardi il telefono» a 5 anni.
  - Anche «storie di guerra» è un problema: chi nasce dopo il 2010 ha nonni nati quasi tutti dopo la guerra. Serve controllare l'anno di nascita del nonno.
- [ami_compleanno](src/d_eventi.js:493) (8–90): «Manda un messaggio… emoji» a 8 anni.
- [virale](src/d_eventi.js:221) e [hater](src/d_eventi.js:176): non richiedono un profilo social, mentre gli eventi «Social» lo richiedono.
  - In più in Italia l'età per iscriversi da soli a un social è 14 anni; nel gioco l'attività «Social network» parte a 13.
- ~~ado_notte_videogiochi~~: la scelta «Fai una diretta» aveva già la condizione del profilo social (falso allarme).
- **Per non ricadere nell'errore:** lo script di controllo usato qui va trasformato in `tools/lint_testi.py`, come prevede la roadmap al punto 0.1. Deve girare dopo ogni build.

### 3.2 Regole che contraddicono la legge o la realtà italiana (🔴, S–M)
- **Coppie dello stesso sesso:** il [matrimonio](src/d_eventi.js:574) offre «Matrimonio in chiesa con 150 invitati» e «Fuga a Las Vegas». In Italia esiste l'**unione civile** (legge 76/2016), che si celebra in Comune.
- **Adozione** ([e_azioni.js:206](src/e_azioni.js:206)):
  - Nel gioco è aperta anche alle coppie conviventi non sposate e a quelle dello stesso sesso. Costa 8.000 € e riesce subito nel 60% dei casi.
  - In Italia (legge 184/1983) possono adottare solo i coniugi sposati da almeno 3 anni (conta anche la convivenza prima delle nozze). La differenza d'età con il bambino deve essere tra 18 e 45 anni, e l'attesa è di anni.
- **Pensione** ([c_motore.js:380](src/c_motore.js:380), [d_eventi.js:40](src/d_eventi.js:40)):
  - Arriva solo se hai un lavoro quando compi l'età: chi è disoccupato a 67 anni non riceve niente.
  - L'importo è una percentuale dell'ultimo stipendio, come nel vecchio sistema retributivo. Chi nasce dal 2000 è invece tutto nel **contributivo**: conta quanto hai versato in tutta la vita.
  - Le regole vere: **vecchiaia** a 67 anni con almeno 20 anni di contributi, oppure **anticipata** con 42 anni e 10 mesi di contributi (41 e 10 mesi per le donne), a qualsiasi età. Dal 2027 si aggiunge 1 mese.
  - Chi non ha abbastanza contributi riceve l'**assegno sociale**: 538,69 € al mese per 13 mensilità nel 2025.
  - Manca la **reversibilità**: alla morte del coniuge spetta una quota della sua pensione, di regola il 60%.
- **Sussidi** ([c_motore.js:557](src/c_motore.js:557)):
  - Nel gioco l'«Assegno di inclusione» (6.000 € l'anno) va a chiunque abbia tra 18 e 67 anni, non lavori e abbia meno di 6.000 €.
  - Nella realtà l'**ADI** spetta solo alle famiglie con minori, disabili o persone sopra i 60 anni, con ISEE sotto 10.140 €. Arriva a 541,67 € al mese per 18 mesi, rinnovabili.
  - Gli altri ricevono il **SFL**: 500 € al mese per un massimo di 12 mesi, solo se seguono un corso.
  - Chi perde il lavoro prende la **NASpI**: il 75% della retribuzione, fino a 1.562 € al mese nel 2025, per la metà delle settimane lavorate negli ultimi 4 anni e al massimo 24 mesi. Nel gioco manca del tutto.
- **IRPEF** ([c2_sistemi.js:36](src/c2_sistemi.js:36)): la seconda aliquota è ancora al 35%. Dal 2026 è al **33%** (legge 199/2025). Le aliquote andrebbero legate all'anno del gioco.
- **Scooter 125 «senza patente» a 16 anni** ([b_dati.js:155](src/b_dati.js:155)): serve la patente A1, che si prende dai 16 anni, oppure la B. Senza patente si guida solo il 50 cc, con il patentino AM dai 14 anni.
- **Eredità dai genitori** ([c_motore.js:404](src/c_motore.js:404)):
  - È una cifra a caso secondo la classe sociale, mai la loro casa. Se vivevi con loro, alla loro morte vai in affitto in un monolocale.
  - Nella realtà erediti la casa, in parte con i fratelli.
  - Mancano la **successione** (franchigia di 1 milione per coniuge e figli, poi il 4%) e la **legittima** (quote riservate a coniuge e figli che il testamento non può togliere).
- **Divorzio** ([e_azioni.js](src/e_azioni.js), funzione `divorzia`):
  - Nel gioco perdi il 40% dei risparmi più 3.000 € in un colpo solo.
  - In Italia prima c'è la separazione, poi il divorzio: dopo 6 mesi se consensuale, dopo 12 se giudiziale.
  - Nella realtà ci sono anche l'**affidamento condiviso** dei figli, l'**assegno di mantenimento** e la casa assegnata al genitore con cui vivono i figli.
- **Fertilità** ([e_azioni.js:204](src/e_azioni.js:204)): il 50% ogni mese vale per qualsiasi donna fino a 46 anni. I valori reali per ciclo:
  - circa il 25% sotto i 30 anni;
  - circa il 20% dopo i 30;
  - circa il 5% a 40 anni;
  - circa l'1% dopo i 45.
- **Le altre persone**:
  - Le loro nuove coppie sono sempre uomo-donna ([c4_persone.js:213](src/c4_persone.js:213)), anche se hanno un orientamento (`p.orient`).
  - Il nuovo compagno della madre diventa «Patrigno». *(Correzione: la nuova compagna del padre, «Matrigna», nasce già con l'evento «Una nuova persona»; mancano solo i fratellastri.)*
  - Hanno figli solo se sono sposate ([c4_persone.js:224](src/c4_persone.js:224), e anche [fig_nipote](src/d_eventi.js:557) e [fra_nipote](src/d_eventi.js:460)), mentre nel 2024 il **43,2%** dei bambini è nato fuori dal matrimonio.
- **Il mondo** ([c2_sistemi.js:18](src/c2_sistemi.js:18)):
  - Una pandemia può arrivare in qualunque anno, con l'1,2% di probabilità.
  - L'Italia «vince i Mondiali» con il 7% di probabilità in ogni anno dei Mondiali, anche nel 2010–2022 (in realtà nel 2018 e nel 2022 non si è qualificata).
  - Si vota negli anni multipli di 5, con partiti inventati. Le politiche vere ci sono state nel 2001, 2006, 2008, 2013, 2018 e 2022.
- **Vacanze** ([e_azioni.js:420](src/e_azioni.js:420)): «Weekend a Roma» viene proposto anche a chi vive a Roma. La Vacanza parte dai 18 anni, quindi da piccolo non si va mai in vacanza con la famiglia, tranne con l'evento «ferie d'agosto».
- **Il partner che ti lascia** ([c4_persone.js:99](src/c4_persone.js:99)) toglie felicità ma non usa `pesa()`, quindi lo stress non sale. È lo stesso errore segnalato da Noemi per le amicizie.

### 3.3 Numeri da correggere (🟠, S)
| Cosa | Nel gioco | Valore reale |
|---|---|---|
| Badante ([c_motore.js:536](src/c_motore.js:536)) | 13.800 €/anno | ≈ 18.900 € (2025) – 20.700 € (2026) con contratto, contributi, tredicesima e TFR |
| RSA ([c_motore.js:537](src/c_motore.js:537)) | 9.600 €/anno *(era la parte della famiglia dopo la pensione del genitore: ora è calcolata)* | quota a carico della famiglia in una RSA accreditata: 1.300–1.900 €/mese; retta mediana ≈ 2.100 €/mese; privata 2.500–4.000 € |
| Figli a carico | 7.500 € per figlio, uguale per tutti | da 0 a 18 anni 118.000 € (reddito basso), 176.000 € (medio), 322.000 € (alto): ≈ 6.600 / 9.800 / 17.900 € l'anno (Federconsumatori); primo anno 7.400–17.600 € (2024) |
| Malattie lievi ([c3_vita.js:349](src/c3_vita.js:349)) | ≈ 5% l'anno a 20 anni | raffreddori e influenze ogni anno; i bambini molto di più |
| Prezzi all'anno di nascita ([c2_sistemi.js:4](src/c2_sistemi.js:4)) | l'indice parte da 1 alla nascita, qualunque sia l'anno | deve seguire l'indice dei prezzi ISTAT per gli anni passati e partire dal valore vero dell'anno |

### 3.4 Codice da sistemare (🟢, S)
- [c_motore.js:447](src/c_motore.js:447) `function meseAnimali(){ meseAnimali(); }` richiama se stessa all'infinito. Oggi funziona solo perché [e2_lusso.js:129](src/e2_lusso.js:129) la ridefinisce più avanti: se cambia l'ordine dei file, il gioco si blocca. Va cancellata.
- [c_motore.js:417](src/c_motore.js:417) `annoRelazioni()` non viene più chiamata: è codice morto con regole vecchie. La sua parte `annoFiglio()` invece si usa ancora e va spostata.
- In `bilancio()` ([c_motore.js:546](src/c_motore.js:546)) la vecchia lista di imprevisti (con il «veterinario» anche senza animali) non si usa più, perché `bilancio()` viene chiamato solo con `simula=true`. La lista giusta è `IMPREVISTI`.
- **Scelte senza conseguenze:** 176 risposte su 1.135 (15%) non mostrano nessun effetto nell'Atlante. *(Correzione: contando dal gioco erano 42 su 1.133; ora 5.)*
  - Sono soprattutto i «No grazie», «Lascia perdere», «Resta a casa».
  - Alcune hanno effetti calcolati nel codice che l'Atlante non vede *(da verificare caso per caso)*.
  - Nella vita anche dire di no costa o fa guadagnare qualcosa: tempo, energia, un rimpianto, un rapporto che si raffredda.

---

## 4. Cosa manca, area per area

### 4.1 Nascita, gravidanza e figli (🔴, L)
- **Gravidanza di 9 mesi** come stato (`S.gravidanza`). Le tappe da raccontare:
  - test positivo;
  - prima ecografia;
  - sesso del bambino;
  - scelta del nome;
  - nausee, stanchezza e smart working;
  - corso preparto;
  - parto: in Italia circa 3 su 10 sono cesarei (CeDAP 2023);
  - primi giorni a casa.
- **Fertilità per età** (valori al punto 3.2) e, per una parte delle coppie, **infertilità**. Poi la **procreazione assistita** (PMA), un percorso con costi e successo che dipendono dall'età.
- **Aborto spontaneo**: dal 10 al 20% delle gravidanze riconosciute, oltre il 50% dopo i 45 anni. Va vissuto come un lutto, con `pesa()`.
- **Gemelli**: l'1,4% dei parti (circa 1 su 70–80), di più dopo i 40 anni e con la PMA.
- **Congedi**:
  - maternità: 5 mesi all'80%;
  - paternità: 10 giorni al 100%;
  - congedo parentale.
  - Effetto sulla carriera, più forte per le madri: è una delle cause del divario di reddito.
- **Costi per età e classe** (valori al punto 3.3), più il **nido** con le liste d'attesa e l'**Assegno Unico** per i figli fino a 21 anni, che dipende dall'ISEE (dal 2022).
- **Adozione secondo la legge** (punto 3.2). Due percorsi: nazionale, oppure internazionale con viaggi e costi.
- **Crescere i figli** (roadmap 2.4):
  - il tuo stile da genitore forma il loro carattere;
  - i figli si ammalano e servono permessi;
  - i nonni fanno da baby-sitter;
  - adolescenza;
  - i figli restano a casa fino a circa 30 anni, mentre oggi vanno via tra i 19 e i 27 ([c_motore.js:445](src/c_motore.js:445)).
- **Gravidanza non pianificata, contraccezione, IVG (legge 194)**: sono temi delicati ma fanno parte della vita. La proposta è attivarli solo con un'impostazione «temi sensibili» (roadmap 6.4), da decidere con Davide.
- **Primo anno di vita**: oggi non ha nessun evento, e a 1 anno ce ne sono solo 7. Momenti possibili:
  - il primo sorriso;
  - la prima notte intera;
  - lo svezzamento;
  - il pediatra;
  - le vaccinazioni (in Italia 10 sono obbligatorie per andare al nido) *(numero da verificare)*;
  - il battesimo, se la famiglia è religiosa.

### 4.2 Corpo, salute e morte (🔴, L)
- **Mortalità per sesso**: le donne vivono circa 4 anni in più (85,7 contro 81,7 nel 2025). Basta un fattore in `morteP()`, che oggi usa solo età e salute.
- **La causa di morte deve venire dalle malattie avute**, non da un sorteggio con «nel sonno» dopo gli 82 anni. Le proporzioni reali da raggiungere:
  - malattie del cuore e dei vasi: 30%;
  - tumori: 26%;
  - malattie respiratorie: 8%;
  - demenze: 5% (7% nelle donne, 3% negli uomini);
  - poi diabete, cadute e incidenti.
  - Sotto i 30 anni circa metà delle morti è per cause violente, come incidenti e suicidi (ISTAT).
- **Tumori veri**:
  - Tipi diversi: seno (1 donna su 8), prostata, colon-retto, polmone (molto legato al fumo), vescica.
  - Rischio nella vita di 1 su 2 per gli uomini e 1 su 3 per le donne.
  - Circa la metà guarisce. Oggi il grado 4 non guarisce mai ([c3_vita.js:345](src/c3_vita.js:345)).
  - Cure (chemio, chirurgia), «remissione» e controlli negli anni.
- **Screening per età e sesso**, che oggi è un unico evento generico. I programmi italiani (età indicative, variano da regione a regione):
  - mammografia tra 50 e 69 anni;
  - Pap test e test HPV tra 25 e 64;
  - sangue occulto per il colon tra 50 e 69/74.
- **Demenza e Alzheimer**: colpiscono circa l'8% degli over 65 e oltre il 20% degli over 80 (ISS).
  - Per il giocatore: ultimi anni con memoria che cede. Il diario può confondere i nomi, i menu si semplificano e c'è chi si prende cura di te.
  - Per le altre persone: la richiesta di assistenza diventa più specifica.
- **Salute mentale**:
  - **Depressione**: oggi arriva solo con felicità sotto 22 per 6 mesi ([c3_vita.js:355](src/c3_vita.js:355)), cioè nell'1% delle vite. Nella realtà ne ha i sintomi il 6% degli adulti e il 9% degli over 65 in un dato momento, e circa 1 persona su 10 nel corso della vita *(da verificare)*.
  - Mancano ansia e attacchi di panico, disturbi alimentari, ADHD, DSA (dislessia), autismo.
  - Il burnout c'è già.
  - Le cure (psicologo, farmaci) e le **ricadute** vanno trattate come un percorso, non come un clic (roadmap 4.3).
- **Malattie dell'infanzia**: varicella, scarlattina, otiti, pidocchi, mani-piedi-bocca, raffreddori continui al nido. Oggi un bambino si ammala pochissimo.
- **Stili di vita**:
  - **Peso**: il 46,4% degli adulti è in sovrappeso o obeso, l'11,6% obeso.
  - **Sedentarietà**: 30,8%.
  - **Alcol a rischio**: 15,1%.
  - **Sigaretta elettronica**: 7,4%.
  - Il gioco ha già fumo, alcol e gioco d'azzardo; mancano peso, dieta e sigaretta elettronica.
  - **Coscienziosità e salute**: chi è più coscienzioso fuma meno, fa i controlli e vive più a lungo. Oggi C non entra nella formula della salute.
- **Sanità italiana**:
  - medico di base;
  - pediatra fino a 14 anni (o 16);
  - ticket ed esenzioni;
  - liste d'attesa e pubblico contro privato;
  - pronto soccorso;
  - dentista e apparecchio da ragazzi;
  - farmacia.
- **Pubertà** (prime mestruazioni, voce, acne, imbarazzo) e **menopausa** tra 45 e 55 anni: oggi assenti.
- **Disabilità**, dalla nascita o arrivata dopo: invalidità civile, legge 104 (permessi), indennità di accompagnamento, barriere architettoniche.
- **Infortuni sul lavoro** (muratore, magazziniere, autista) e **incidenti domestici**. Le cadute degli anziani ci sono già.

### 4.3 Mente, carattere e comportamento (🟠, M)
I modelli scientifici da usare come riferimento:
- **Big Five e maturità** (Roberts, Walton e Viechtbauer 2006, 92 campioni longitudinali):
  - coscienziosità, stabilità emotiva (cioè meno N) e «dominanza sociale» salgono soprattutto **tra i 20 e i 40 anni**;
  - apertura e «vitalità sociale» salgono in adolescenza e calano in vecchiaia;
  - la gradevolezza cresce soprattutto da anziani.
  - In my N sale di 5: va rafforzato il calo di N nella `maturazione()` tra 20 e 40 anni, e va fatto rientrare di più il peso dei lutti.
- **Dal carattere agli esiti**:
  - C → salute, longevità, lavoro;
  - N → depressione, separazioni;
  - E → numero di amici e partner, felicità;
  - A → coppie stabili, meno liti;
  - O → studio, viaggi, cambiamenti.
  - In my oggi contano soprattutto N sulla felicità e C su scuola e lavoro.
- **Attaccamento**:
  - Distribuzione reale con 3 stili: circa 59% sicuro, 25% evitante, 11% ansioso.
  - Con 4 stili: 42–57% sicuro, 10–17% preoccupato, 12–19% distanziante, 15–26% timoroso.
  - È stabile in circa 7 casi su 10 *(fonte secondaria)*: può cambiare con una relazione sicura o con la terapia. Il gioco oggi lo decide a 4 anni per sempre.
- **Stress da eventi di vita** (scala di Holmes e Rahe, 43 eventi in «punti di cambiamento»). Anche i cambiamenti belli stressano. I valori:
  - morte del coniuge 100; divorzio 73; separazione 65; carcere 63; lutto in famiglia 63;
  - malattia 53; **matrimonio 50**; licenziamento 47; **pensione 45**; gravidanza 40; nuovo membro in famiglia 39;
  - mutuo 31; un figlio che va via di casa 29; trasloco 20; vacanze 13; Natale 12.
  - È un buon riferimento per tarare `pesa()`. In my oggi il matrimonio dà N −2 e nessuno stress, e la pensione dà +12 di felicità.
- **Adattamento** (set point): la gioia del matrimonio rientra in qualche anno, mentre disoccupazione e vedovanza lasciano un segno che non sparisce del tutto. `mod()` fa già rientrare le scosse, ma serve un **«segno» lento** per i fatti grandi.
- **Soddisfazione per età**: in Italia cala con l'età, dai 14–17 anni (60,8% molto soddisfatti) ai 75 e più (40,1%). Il gioco invece ha gli adolescenti meno felici degli adulti.
- **Vecchiaia**: stress quasi zero dopo i 70 anni non è credibile. Mancano solitudine, paura della malattia, lutti a catena e soldi contati.
- **Tappe di Erikson** come lista di controllo dei temi per età:
  - fiducia (0–1): oggi vuoto;
  - autonomia (1–3);
  - iniziativa (3–6);
  - operosità (6–12);
  - identità (12–18): c'è;
  - intimità (18–40);
  - generatività (40–65): c'è in parte (figli, apprendista);
  - integrità (65+): c'è in parte (lettera, testamento).
- **Bisogni di fondo** (teoria dell'autodeterminazione: autonomia, competenza, relazione): sono la base per lo «scopo» della Fase 5. Un mese senza nessuno dei tre dovrebbe pesare.
- **Dipendenze**: un ciclo realistico di inizio, abuso, tentativo di smettere, ricaduta e recupero (roadmap 4.4). Oggi ci sono fumo, alcol e gioco come interruttori.

### 4.4 Persone, coppia e famiglia (🔴, L — vedi roadmap Fase 2)
- **Famiglie di oggi**:
  - coppie che non si sposano e hanno figli (43,2% dei nati);
  - famiglie ricomposte con **matrigna**, **fratellastri** e figli del partner;
  - genitori single;
  - **genero e nuora**, bisnonni, padrino e madrina.
- **Le altre persone come persone vere**:
  - **colleghi e capo** che restano;
  - **vicini** che restano: oggi il vicino è solo un evento o un nemico;
  - **compagni di classe** come gruppo;
  - insegnanti, coinquilini;
  - amici che si conoscono tra loro (roadmap 2.1).
- **Coppie dello stesso sesso** anche tra le altre persone, e l'unione civile.
- **Italia multietnica**:
  - il 9,4% dei residenti è straniero (2026) e il 21,8% dei nati ha almeno un genitore straniero (2024);
  - compagni di scuola, colleghi e partner di origine straniera, coppie miste;
  - seconde generazioni, cittadinanza a 18 anni per chi è nato in Italia.
- **Nomi per generazione** ([b_dati.js:3](src/b_dati.js:3)):
  - Oggi c'è un'unica lista per tutti, e mancano nomi diffusissimi come **Maria**.
  - Servono almeno tre liste: nonni, genitori, figli nati dopo il 2015.
  - Per i figli di genitori stranieri i nomi più dati nel 2024 sono Rayan, Adam, Amir, Sara, Amira.
- **Amore**:
  - app di incontri (dal 2012 circa) e coppie a distanza (c'è);
  - convivenza come scelta stabile;
  - separazione con figli (punto 3.2);
  - gelosia e tradimenti (ci sono).
- **Violenza in famiglia e relazioni tossiche**: tema da trattare con cura, solo con l'impostazione «temi sensibili».

### 4.5 Scuola e università (🟠, M)
- **Superiori mancanti**: liceo delle **scienze umane** (tra i più scelti), musicale e coreutico, tecnico per il turismo, **CAT** (ex geometri), agrario, meccanica ed elettronica, professionale socio-sanitario, **IeFP** (qualifica in 3 anni o diploma professionale in 4).
- **Cose molto italiane**:
  - **«rimandato a settembre»** (sospensione del giudizio);
  - bocciature anche alle medie;
  - maturità vera: prima prova, seconda prova, orale, voto in centesimi;
  - **PCTO** (ex alternanza scuola-lavoro);
  - scuole paritarie;
  - DSA con il piano personalizzato;
  - tempo pieno e mensa.
- **Abbandono**: il 9,8% tra 18 e 24 anni lascia presto, di più i maschi (12,2% contro 7,1%). Oggi nessuno lascia la scuola da solo: servono motivi come voti bassi, famiglia umile o un lavoro.
- **Facoltà mancanti**:
  - **Scienze della formazione primaria** (per diventare maestra);
  - Veterinaria, Odontoiatria, Fisioterapia e le altre professioni sanitarie;
  - Fisica, Chimica, Statistica, Filosofia, Storia, Beni culturali, Design, DAMS, Agraria, Scienze dell'educazione, Servizio sociale;
  - **AFAM** (Conservatorio, Accademia di belle arti);
  - università telematiche.
- **Università**:
  - esami in trentesimi e sessioni;
  - tesi;
  - test d'ingresso aggiornati (per Medicina c'è stata una riforma nel 2025 *(da verificare)*);
  - Erasmus, fuori sede, borse, fuori corso, laurea con festa (ci sono già).
- **Laureati**: in my 16%, in Italia il 31,6% tra 25 e 34 anni. Le donne si laureano molto più degli uomini (38,5% contro 25,0%).

### 4.6 Lavoro (🔴, L)
- **Mercato del lavoro vero**:
  - **Per area**: occupazione al 69,8% al Nord e al 50,0% al Sud; disoccupazione al 3,8% al Nord e all'11,1% al Sud.
  - **Per età**: disoccupazione giovanile intorno al 20%.
  - **Per sesso**: lavora poco più di una donna su due tra 15 e 64 anni (53,8%).
  - Oggi la probabilità del colloquio ([c2_sistemi.js:275](src/c2_sistemi.js:275)) non conosce né regione né età né sesso.
- **Contratti**:
  - tempo indeterminato;
  - **tempo determinato che scade**;
  - apprendistato, **stage e tirocinio**, somministrazione;
  - **partita IVA**, lavoro intermittente;
  - **part-time involontario**.
  - Poi rinnovi, licenziamenti, dimissioni, NASpI, cassa integrazione, sindacato, sciopero.
- **Divario uomo-donna**: 27.967 € contro 19.833 € di media nel privato (INPS 2024), soprattutto per part-time e maternità.
- **Lavori da aggiungere** (oggi 42; i più diffusi in Italia mancano):
  - **colf e badanti** (817.403 nel 2024, l'89% donne);
  - **agricoltura** (circa 1 milione di operai agricoli e 415.000 autonomi);
  - **artigiani**: idraulico, elettricista, meccanico, falegname, panettiere, pasticcere, macellaio;
  - autotrasportatore, cassiere, addetto alle pulizie, operatore di call center, segretario;
  - estetista;
  - **educatrice di nido e maestra**;
  - **carabiniere, militare, guardia di finanza**;
  - postino, tassista, guida turistica, animatore, bagnino, assistente di volo, pilota;
  - **veterinario, dentista, fisioterapista, notaio, magistrato**;
  - commerciante con negozio proprio, agente di commercio;
  - data scientist, creator (dal social);
  - sindaco o politico come carriera;
  - sportivi di altri sport (pallavolo, ciclismo, tennis).
  - **Per tarare la distribuzione:** tra i dipendenti il 54,7% è operaio, il 36,2% impiegato e il 4,3% quadro o dirigente. Oggi il 26% delle vite finisce «Art director».
- **Insegnante**: oggi serve solo la laurea magistrale. Il percorso vero è laurea, abilitazione (60 CFU) e poi concorso o supplenze dalle graduatorie *(dettagli da verificare)*.
- **Lavoro vissuto** (roadmap 5.3): progetti, cambi di settore, mettersi in proprio, emigrare.

### 4.7 Soldi, tasse e welfare (🔴, M)
- **Tasse**:
  - IRPEF per anno (33% dal 2026);
  - addizionali regionali e comunali, oggi un 2% fisso;
  - detrazioni;
  - 730 (c'è come evento);
  - **ISEE**, che serve per università, nido, ADI, Assegno Unico e borse.
- **Welfare**:
  - Assegno Unico;
  - NASpI;
  - ADI e SFL corretti;
  - assegno sociale;
  - pensione contributiva con il minimo di 20 anni;
  - reversibilità;
  - **TFR** (la liquidazione) quando finisce un lavoro;
  - fondo pensione;
  - bonus.
- **Mutuo**: oggi è sempre a tasso fisso del 3,5% ([c_motore.js:592](src/c_motore.js:592)). Mancano tasso fisso o variabile, i tassi che cambiano negli anni (come il rialzo del 2022–2023), l'anticipo e la regola della rata non oltre un terzo del reddito.
- **Successione, legittima e donazioni** (punto 3.2).
- **Spese italiane che mancano**:
  - condominio;
  - TARI;
  - canone RAI;
  - revisione e tagliando dell'auto;
  - abbonamenti (telefono, streaming, palestra);
  - bollette che seguono l'anno (caro energia del 2022).
- **Costi da aggiornare**: badante, RSA, figli (punto 3.3). Il costo degli animali, oggi 500 € l'anno uguale per tutte le specie, è *da verificare*: un cane costa più di un gatto.

### 4.8 Casa e vita quotidiana (🟠, M)
- **Uscita di casa** a circa 30 anni (donne 29,2, uomini circa 31). Per molti si esce di casa quando ci si sposa o si va a convivere: servono motivi per restare (costi, comodità, genitori) e motivi per andare (lavoro, coppia, liti).
- **Condominio**: assemblee, vicini, lavori straordinari.
- **Casa**:
  - **casa dei nonni ereditata** tra fratelli;
  - seconda casa al mare;
  - ristrutturazioni e bonus;
  - sfratto e morosità;
  - affitti brevi.
- **Paese o città**: nei piccoli comuni pesano pendolarismo, servizi lontani e il fatto che tutti si conoscono. Nelle città pesano affitti, traffico e anonimato.
- **Vita di tutti i giorni**: SPID, carta d'identità, code in posta, guasti in casa, bollette.

### 4.9 Tempo libero, sport e hobby (🟢, M)
- **Hobby da adulti**: oggi ci sono 10 attività e si scelgono da bambini. Da aggiungere:
  - padel, palestra, ciclismo, escursionismo, yoga, ballo (latino, liscio);
  - pesca, orto e giardino, cucina;
  - club del libro, fotografia, coro e banda, giochi da tavolo, **carte** (briscola, scopa), **fantacalcio**, bricolage;
  - volontariato in Protezione civile o Croce Rossa.
- **Infanzia**: **oratorio e parrocchia**, centro estivo (Grest), catechismo.
- **Tifo**:
  - squadra del cuore scelta da piccoli;
  - abbonamento allo stadio;
  - Champions League;
  - Giro d'Italia, MotoGP e F1 la domenica;
  - Sanremo (c'è come «Festival della Canzone»).
- **Uscite**: pizza del sabato, aperitivo, sagre, concerti, cinema (ci sono in parte).

### 4.10 Viaggi (🟠, S–M)
- **Mete reali** (estate 2025: 63% solo in Italia, 20% solo all'estero, 17% entrambe; agosto è il mese più scelto):
  - **Italia**: Sardegna, Sicilia e Puglia; Dolomiti; Roma, Napoli; Jesolo, Riccione, Capri, Gallipoli, Lampedusa.
  - **Estero, Europa**: **Spagna** (Barcellona, Ibiza, Tenerife, Palma), **Grecia** (Zante, Creta, Mykonos), Parigi, Lisbona, Londra, Amsterdam, Malta, **Albania** (in forte crescita).
  - **Lungo raggio**: Sharm el-Sheikh, New York, Bangkok, Istanbul, Marrakech, Tokyo, Zanzibar, Bali.
  - **Inverno**: montagna (46,6% a Natale e Capodanno).
  - Le crociere ci sono già.
- **Come si viaggia**:
  - con chi: famiglia con bambini, coppia, amici, da soli;
  - viaggio di nozze;
  - Interrail;
  - campeggio;
  - gite di classe e Erasmus (ci sono);
  - **ferie** (di solito almeno 4 settimane l'anno per chi è dipendente *(da verificare per contratto)*);
  - costi moltiplicati per le persone;
  - imprevisti come volo cancellato, scottatura, valigia persa (quest'ultima c'è).
- **Da piccoli** si va in vacanza con la famiglia, secondo i soldi dei genitori.
- **Mai proporre la propria città** come meta.

### 4.11 Animali (🟠, S–M)
- **In Italia**:
  - il 54,5% delle famiglie ha un animale, il 28,7% un cane e il 26,7% un gatto;
  - per numero: pesci 25,3 milioni, gatti 11, cani 9,1, uccelli 4,1, rettili e anfibi 2,7, piccoli mammiferi 1,4 (Assalco 2026).
- **Specie da aggiungere** (oggi cane, gatto, coniglio, pappagallo): **pesce rosso o acquario**, **tartaruga**, **criceto**, porcellino d'India, canarino e cocorita, furetto, geco.
- **Vita con un animale**:
  - adottare dal canile o dal gattile oppure comprare;
  - razza e taglia (i cani piccoli vivono di più);
  - **microchip e anagrafe canina**;
  - vaccini e sterilizzazione, veterinario;
  - chi lo tiene quando parti;
  - le **passeggiate del cane** come ore di movimento nella settimana;
  - il cane come compagnia per chi vive solo;
  - i regolamenti di condominio;
  - costi diversi per specie.

### 4.12 Luoghi: l'Italia regione per regione (🟠, M)
- **Economia per regione**:
  - occupazione e disoccupazione (punto 4.6);
  - RAL media: Nord 34.119 €, Centro 32.746 €, Sud e Isole 29.777 € (JobPricing 2025);
  - prezzi delle case (ci sono già).
  - Oggi la regione cambia i prezzi ma non le possibilità di lavoro.
- **Eventi regionali** (oggi 26):
  - Il **Friuli-Venezia Giulia** non ne ha nessuno: per esempio la bora a Trieste e le osmize sul Carso *(da verificare)*.
  - Liguria, Lombardia fuori da Milano, Veneto fuori da Venezia, Valle d'Aosta, Molise e Alto Adige ne hanno pochi o li condividono. Per l'Alto Adige c'è anche il bilinguismo.
  - Obiettivo: almeno 2 eventi per regione, da scrivere con Davide.
- **Emigrare**:
  - Le mete reali degli italiani all'estero sono Germania, Regno Unito, **Svizzera**, Francia e Spagna. Nel gioco la Svizzera manca.
  - La vita all'estero: lingua, iscrizione all'AIRE, nostalgia, decidere se tornare.

### 4.13 La storia vera e il tempo (🔴, M)
Chi nasce tra il 2000 e il 2026 ha un passato vero. Proposta: un **calendario storico** per gli anni fino a oggi, e il mondo casuale solo per il futuro.

| Anno | Fatto | Effetto nel gioco |
|---|---|---|
| 2002 | Arriva l'euro in contanti | notizia, prezzi |
| 2005 | Sospesa la leva obbligatoria | nessuna naja |
| 2006 | **Italia campione del mondo** (Berlino) | festa in piazza |
| 2007–2009 | Nasce l'iPhone; arrivano WhatsApp e Instagram (2009–2010) | da qui i telefoni dei ragazzi |
| 2008–2009 | Crisi finanziaria | licenziamenti, Borsa |
| 2009 | Terremoto dell'Aquila | evento in Abruzzo |
| 2011–2012 | Crisi dello spread, riforma delle pensioni | regole pensione, crisi |
| 2012 | Terremoto in Emilia | evento regionale |
| 2016 | Terremoti nel Centro Italia; **unioni civili** | evento; nuova regola di coppia |
| 2018 | Crollo del ponte Morandi; l'Italia fuori dai Mondiali | notizia (Genova) |
| 2019 | Reddito di cittadinanza (poi sostituito dall'ADI nel 2024) | sussidi per anno |
| 2020 | **Pandemia e lockdown** (marzo–maggio), didattica a distanza | evento obbligatorio per tutti |
| 2021 | **Italia campione d'Europa** | festa |
| 2022 | Guerra in Ucraina, caro bollette, inflazione alta; nasce l'Assegno Unico | bollette, prezzi |
| 2023 | Alluvione in Emilia-Romagna | evento regionale |
| 2026 | Olimpiadi invernali Milano-Cortina; IRPEF al 33% | notizia, tasse |

*Le date sono note, ma vanno ricontrollate una per una prima di scriverle nel gioco.*

Per tutti gli anni passati servono anche **prezzi e stipendi veri per anno**: l'indice dei prezzi ISTAT al posto di `ip = 1` alla nascita. La tecnologia va legata all'anno: lo smartphone dal 2007, le app e i social dopo.

### 4.14 Vecchiaia e fine vita (🟠, M)
- **Per il giocatore**:
  - perdita di autonomia;
  - badante o RSA;
  - figli che si dividono la cura (oggi questo esiste solo per i tuoi genitori);
  - demenza (punto 4.2);
  - solitudine;
  - vedovanza con reversibilità;
  - nipoti (ci sono).
- **Testamento vero**: a chi lasci la casa e i soldi, nel rispetto della legittima. Lasciti, liti tra eredi.
- **Funerale e ricordo** (roadmap 1.5): chi viene, cosa dicono, il «film della vita».

### 4.15 Calendario e cultura (🟢, S)
- **Feste che mancano**:
  - Capodanno vero (oggi ci sono i propositi);
  - Befana;
  - San Valentino;
  - **Pasqua e Pasquetta** (la gita fuori porta);
  - 25 aprile, 1° maggio (il concertone), 2 giugno;
  - **Ferragosto**;
  - il rientro a settembre;
  - Halloween;
  - il 2 novembre al cimitero;
  - Black Friday e saldi.
- **Sacramenti**, se la famiglia è religiosa: battesimo, **prima comunione** (circa 9 anni), **cresima**. Il matrimonio civile ormai è il 61,3% dei matrimoni (2024).
- **Religione e fede** come scelta che cambia nella vita. Oggi c'è un solo evento, «Domande grandi».

---

## 5. Contenuti pronti da usare

### 5.1 Eventi da scrivere, per età
- **0–1 anno** (oggi 0 eventi): primo sorriso, notte intera, svezzamento, primo dentino, pediatra, battesimo, primo bagno al mare.
- **6–12**:
  - prima comunione;
  - varicella e pidocchi;
  - oratorio, centro estivo;
  - la squadra del cuore;
  - genitori che si separano (c'è);
  - arriva un compagno straniero;
  - rimproveri per i compiti.
- **13–17**:
  - prime mestruazioni e voce che cambia;
  - apparecchio ai denti;
  - rimandato a settembre;
  - PCTO;
  - patentino AM;
  - prima cotta (c'è);
  - coming out;
  - ansia da social.
- **18–29**:
  - patente B (foglio rosa, guide, esame di teoria e di pratica);
  - primo contratto a termine che scade;
  - stage non pagato;
  - Erasmus (c'è);
  - app di incontri;
  - coinquilini (ci sono);
  - primo stipendio;
  - colloqui;
  - restare o emigrare (in parte c'è).
- **30–49**:
  - gravidanza e parto;
  - nido e liste d'attesa;
  - mutuo;
  - figli malati e permessi;
  - promozione o cambio di lavoro;
  - genitori che invecchiano;
  - separazione con figli;
  - crisi di coppia.
- **50–65**:
  - menopausa;
  - screening;
  - figli che non escono di casa;
  - genitori non autosufficienti (c'è);
  - prepensionamento o uscita concordata;
  - nipoti;
  - licenziamento a 55 anni.
- **65+**:
  - pensione (c'è);
  - vedovanza;
  - nipoti al parco (c'è);
  - truffe (ci sono);
  - demenza di un coniuge;
  - la casa troppo grande;
  - badante;
  - l'ultimo viaggio;
  - testamento.
- **Catene nuove** (oggi 7, obiettivo 25):
  - il mutuo a tasso variabile;
  - la causa di lavoro;
  - la ristrutturazione infinita;
  - il figlio che torna a casa a 35 anni;
  - il concorso pubblico (bando, prove, graduatoria, chiamata dopo anni);
  - la malattia lunga (diagnosi, cure, remissione);
  - l'eredità dei nonni contesa tra fratelli;
  - la PMA.

### 5.2 Parole chiave della vita italiana (da usare nei testi)
- **Scuola**: nido, materna, elementari, medie, «esame di terza media», superiori, maturità, «rimandato a settembre», debito, PCTO, gita, interrogazione, compito in classe, nota sul registro, ricreazione, zaino, diario.
- **Università**: CFU, appello, sessione, «trenta e lode», tesi, fuori corso, fuori sede, Erasmus, laurea triennale e magistrale, dottorato, «corona d'alloro».
- **Lavoro**: RAL, netto in busta paga, tredicesima, quattordicesima, TFR, contratto a termine, tempo indeterminato, partita IVA, stage, tirocinio, apprendistato, NASpI, cassa integrazione, sindacato, sciopero, smart working, CCNL, concorso, graduatoria.
- **Soldi e Stato**: IRPEF, 730, ISEE, Assegno Unico, ADI, SFL, SPID, CIE, bollettino, F24, IMU, TARI, canone RAI, bollo auto, revisione, condominio.
- **Salute**: medico di base, pediatra, ricetta, ticket, esenzione, CUP, lista d'attesa, pronto soccorso, codice bianco/verde/giallo/rosso, legge 104, invalidità, accompagnamento, RSA, badante, caregiver.
- **Famiglia**: convivenza, unione civile, rito civile o religioso, testimoni, bomboniere, battesimo, comunione, cresima, padrino e madrina, separazione consensuale, affido condiviso, assegno di mantenimento, reversibilità, successione, legittima, testamento.
- **Vita sociale**: aperitivo, pizza del sabato, sagra, festa del patrono, Pasquetta, Ferragosto, calcetto, fantacalcio, briscola, oratorio, Grest, gruppo WhatsApp della classe, pranzo della domenica.

### 5.3 Nomi per generazione
- **Nonni** (nati circa 1935–1965): Maria, Giuseppina, Anna, Rosa, Carla, Franca, Lucia, Teresa; Giuseppe, Giovanni, Antonio, Mario, Luigi, Franco, Salvatore, Vincenzo. *(Lista indicativa, da controllare con le statistiche ISTAT sui nomi per anno di nascita.)*
- **Genitori** (nati circa 1965–2000): oggi la lista attuale va quasi bene. Marco, Luca, Andrea, Alessandro, Davide, Simone; Francesca, Chiara, Sara, Valentina, Federica, Silvia.
- **Figli nati dopo il 2015**: i primi dieci del 2024 secondo ISTAT.
  - Maschi: Leonardo, Edoardo, Tommaso, Mattia, Alessandro, Francesco, Lorenzo, Gabriele, Riccardo, Andrea.
  - Femmine: Sofia, Aurora, Ginevra, Vittoria, Giulia, Beatrice, Ludovica, Matilde, Alice, Emma.
- **Figli di genitori stranieri** (2024): Rayan, Adam, Amir, Liam; Sofia, Sara, Amira.

---

## 6. Ordine di lavoro consigliato

Ogni passo si chiude con: build → sintassi → `fuzz.py` → `sim.py` → **`realismo.py 200`**. Il criterio per dire «fatto» è un valore della tabella al punto 2 che entra nel ±20% del dato vero.

| Passo | Cosa | Priorità | Impegno | Fatto quando | Stato (9/10/2026) |
|---|---|---|---|---|---|
| 1 | **Correzioni veloci**: testi del punto 3.1 + `lint_testi.py`; IRPEF 33%; scooter; unione civile; adozione; costi di badante e RSA; codice del punto 3.4; «Weekend a Roma»; `pesa()` quando il partner ti lascia | 🔴 | S | 0 segnalazioni del lint, fuzz pulito | ✅ fatto (più patentino AM, SFL, nomi per generazione, orientamento dalla nascita) |
| 2 | **Welfare e pensioni**: NASpI, ADI e SFL corretti, assegno sociale, pensione contributiva anche senza lavoro, reversibilità, successione | 🔴 | M | nessun over 70 senza reddito | ✅ fatto |
| 3 | **Morte e malattie**: mortalità per sesso, cause di morte dalle malattie, tumori per tipo e guaribili, demenza, depressione e ansia, malattie lievi frequenti, screening | 🔴 | M | donne +3–5 anni; tumori 20–30% delle morti; «nel sonno» sotto il 10% | ✅ fatto (manca solo l'ansia «come percorso» con ricadute) |
| 4 | **Storia vera e prezzi per anno** (punto 4.13), nomi per generazione | 🔴 | M | chi nasce nel 2005 vive il lockdown a 15 anni | ✅ fatto |
| 5 | **Gravidanza e figli** (punto 4.1) | 🔴 | L | fertilità per età; il 10–20% delle gravidanze finisce in un aborto spontaneo; congedi | ✅ fatto (gravidanza, PMA, adozione, congedi; non i figli malati e i permessi) |
| 6 | **Lavoro vero**: regioni, sesso, contratti, catalogo dei lavori | 🔴 | L | occupati 60–75%, NEET 10–16%, divario uomo-donna visibile | 🟡 in parte: zone, età, crisi, lavori che finiscono; mancano contratti, divario uomo-donna, nuovi lavori |
| 7 | **Pilota automatico più umano** (roadmap 7): meno ricerche di lavoro, abbandoni della scuola, uscita di casa più tardi, meno matrimoni | 🔴 | S | la tabella misura il gioco, non il pilota | ✅ fatto |
| 8 | **Persone e famiglie di oggi** (punto 4.4 + roadmap Fase 2) | 🔴 | L | figli fuori dal matrimonio ≈ 40%; coppie dello stesso sesso tra le altre persone | 🟡 in parte: coppie dello stesso sesso e figli fuori dal matrimonio; mancano gruppi di amici, colleghi e vicini persistenti |
| 9 | **Carattere e comportamento** (punto 4.3) | 🟠 | M | N scende tra 20 e 40 anni; attaccamento ≈ 60% sicuro; stress da anziani tra 15 e 25 | ✅ fatto |
| 10 | **Contenuti**: eventi del punto 5.1, catene, scelte con conseguenze | 🟠 | L | ≥ 10 eventi possibili a ogni età, 25 catene, scelte senza effetto sotto il 5% | 🟡 in parte: scelte con conseguenze sì; eventi nuovi e catene no |
| 11 | **Viaggi, animali, hobby, regioni, feste** (punti 4.9–4.15) | 🟢 | M | 20 mete, 8 specie, 25 hobby, 2 eventi per regione | ⬜ da fare |

I punti 1, 2, 3 e 7 si possono fare subito e insieme spostano la maggior parte delle righe ✗ della tabella.

---

## 7. Cosa non ho potuto verificare
- Quota di persone **senza figli** a fine vita e quota di **condannati** in Italia: non ho trovato un dato affidabile.
- **Depressione nel corso della vita** (circa 1 su 10): non l'ho ricontrollata.
- **Costo annuo degli animali** per specie: Assalco dà il mercato totale (5,3 miliardi), non la spesa per animale.
- **Vaccinazioni obbligatorie**, **ferie minime per contratto**, **riforma dell'accesso a Medicina**, **percorso per diventare insegnante**: sono regole che cambiano spesso, da controllare prima di scriverle.
- **Eventi regionali** proposti (bora, osmize…): sono esempi, da scegliere e verificare con Davide.
- **Scelte senza conseguenze**: alcune hanno effetti nel codice (`fx`) che l'Atlante non mostra, quindi il 15% è un valore massimo.
- I numeri del gioco vengono dal **pilota automatico**: finché non diventa più umano (passo 7), alcune righe mescolano il gioco e il pilota.

---

## 8. Fonti
- ISTAT, [Indicatori demografici – Anno 2025](https://www.istat.it/wp-content/uploads/2026/03/Report_Indicatori-demografici_Anno-2025.pdf): speranza di vita, fecondità, età al parto, stranieri residenti.
- ISTAT, [Natalità e fecondità – Anno 2024](https://www.istat.it/wp-content/uploads/2025/10/Natalita-e-fecondita-della-popolazione-residente_Anno-2024.pdf): nati fuori dal matrimonio, genitori stranieri, nomi.
- ISTAT, [Matrimoni, unioni civili, separazioni e divorzi – Anno 2024](https://www.istat.it/wp-content/uploads/2026/01/MATRIMONI-UNIONI-SEPARAZIONI-DIVORZI_anno-2024.pdf).
- ISTAT, [Cause di morte in Italia – Anno 2023](https://www.istat.it/wp-content/uploads/2026/05/Report-cause-di-morte_Anno-2023.pdf); sintesi su [Sanità Informazione](https://www.sanitainformazione.it/italia-mortalita-2023-cardiovascolari-tumori-causano-57-dei-decessi-salgono-infettive-diabete/).
- ISTAT, [Livelli di istruzione e ritorni occupazionali – Anno 2024](https://www.istat.it/wp-content/uploads/2025/12/Report-Livelli-di-istruzione-e-ritorni-occupazionali-Anno-2024.pdf).
- ISTAT, [Il mercato del lavoro – IV trimestre 2025](https://www.istat.it/wp-content/uploads/2026/03/Mercato-del-lavoro-IV-trim_2025.pdf); NEET 2025 su [Affaritaliani](https://www.affaritaliani.it/economia/notizie-aziende/neet-in-italia-sono-in-calo-nel-2025-la-quota-scende-al-133-la-ricerca-di-intesa-sanpaolo-fondazione-cariplo-e-tobagi.html).
- ISTAT, [Fattori di rischio per la salute – Anno 2025](https://www.istat.it/comunicato-stampa/fattori-di-rischio-per-la-salute-peso-sedentarieta-fumo-e-alcol-anno-2025/).
- ISTAT, [Soddisfazione dei cittadini – Anno 2024](https://www.istat.it/wp-content/uploads/2025/05/Report_Soddifazione-dei-cittadini-per-le-condizioni-di-vita_Anno-2024.pdf).
- Eurostat via [Skuola.net](https://www.skuola.net/news/a-che-eta-si-va-a-vivere-da-soli-italia-30-anni.html) e [Geopop](https://www.geopop.it/ragazzi-via-di-casa-dopo-i-30-anni-italia-tra-le-ultime-in-europa/): età di uscita dalla casa dei genitori.
- AIOM-AIRTUM, [I numeri del cancro in Italia 2024](https://www.aiom.it/wp-content/uploads/2024/12/2024_NDC-def.pdf); [AIRC](https://www.airc.it/area-stampa/un-uomo-su-due-a-rischio-di-cancro-nel-corso-della-vita-prevenzione-e-ricerca-le-risposte-di-fondazione-airc).
- ISS, [Epidemiologia delle demenze](https://demenze.iss.it/epidemiologia/); [sintomi depressivi PASSI 2023–24](https://www.iss.it/en/-/salute-mentale-sintomi-di-depressione-per-il-6-degli-adulti-e-il-9-degli-over-65-cresce-la-domanda-di-cura).
- Fertilità e gravidanza: [Fertilab](https://www.fertilab.it/news/probabilita-gravidanza-20-30-40-anni/), [Healthdesk](https://www.healthdesk.it/prevenzione/rischio-aborto-spontaneo-aumenta-et-mamma), [CeDAP 2023](https://www.epicentro.iss.it/materno/cedap-2023), [Treccani, gemelli](https://www.treccani.it/enciclopedia/gemelli_(Universo-del-Corpo)/).
- Federconsumatori, [costo di un figlio](https://federconsumatori.it/famiglia-mantenere-un-figlio-da-0-a-18-anni-ha-un-costo-medio-di-175-64272-euro/).
- INPS, [Osservatorio lavoratori domestici 2024](https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2025.06.osservatorio-sui-lavoratori-domestici-pubblicati-i-dati-2024.html); [Osservatorio mondo agricolo 2024](https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2025.11.osservatorio-sul-mondo-agricolo-i-dati-del-2024.html); [Osservatorio dipendenti privati 2024](https://www.dottrinalavoro.it/notizie-c/inps-osservatorio-sui-lavoratori-dipendenti-del-settore-privato-2024).
- JobPricing, RAL per età e area, via [Money.it](https://www.money.it/media-stipendi-in-italia-nel-2026-dati) e [JP Salary Outlook 2026](https://jpcondivisi.s3.eu-west-1.amazonaws.com/Whitepaper-guide+e+altri+documenti+/Up+to+date/JP+Salary+Outlook_ed_I.pdf).
- Pensioni: [Itinerari Previdenziali](https://www.itinerariprevidenziali.it/il-punto/legge-di-bilancio-pensioni-requisiti-2025/), [requisiti dal 2027](https://www.itinerariprevidenziali.it/il-punto/pensioni-2027-aumento-requisiti/), [assegno sociale](https://www.dequo.it/articoli/assegno-sociale).
- Sussidi: [ADI, Ministero del Lavoro](https://www.lavoro.gov.it/temi-e-priorita/decreto-lavoro/Pagine/assegno-di-inclusione), [SFL, ACLI](https://www.patronato.acli.it/supporto-formazione-lavoro-novita-e-requisiti-2025/), [NASpI, Altroconsumo](https://www.altroconsumo.it/soldi/lavoro-pensione/news/naspi-disoccupazione).
- IRPEF 2026: [Fiscomania](https://fiscomania.com/aliquote-irpef/).
- Badante e RSA: [Badacare](https://badacare.com/costo-badante-convivente/), [Centro Fiscale 2026](https://centrofiscale.com/costo-badante-convivente-2026/), [Curalune 2026](https://www.curalune.com/it/articoli/rsa-italia-quante-sono-dove-quanto-costano-studio-2026), [CercaRSA](https://www.cercarsa.com/calcola-costi).
- Casa: [QuiFinanza su dati ISTAT-Confedilizia](https://quifinanza.it/mercato-immobiliare/case-di-proprieta-italia-dati-2025/942332/), [Il Sole 24 Ore](https://www.ilsole24ore.com/art/istat-l-80percento-italiani-vive-una-casa-proprieta-ma-spesso-piccola-e-ristrutturare--ADzmTJPC).
- Animali: [Rapporto Assalco-Zoomark](https://www.zoomark.it/media/zoomark/pressrelease/2025/comunicati%20stampa/Rapporto_Assalco_-_Zoomark_2025_-_Sintesi.pdf), [Il Messaggero 2026](https://www.ilmessaggero.it/animali/animali_domestici_italia_famiglie_rapporto_assalco_zoomark_2026-9580238.html).
- Viaggi: [Sky TG24, estate 2025](https://tg24.sky.it/lifestyle/2025/07/01/mete-vacanze-estate-2025), [Qualitytravel, agosto 2025](https://www.qualitytravel.it/agosto-2025-gli-italiani-scelgono-spagna-grecia-e-isole/173188), [Forbes, mete 2026](https://forbes.it/2025/11/07/viaggi-mete-preferite-italiani-2026).
- Nomi: [Sky TG24, nomi 2024](https://tg24.sky.it/cronaca/2025/11/05/nomi-italia-2024).
- Psicologia: Roberts, Walton e Viechtbauer (2006), [Psychological Bulletin](https://eric.ed.gov/?id=EJ735270); Mickelson, Kessler e Shaver (1997) e altri studi sull'attaccamento, riassunti [qui](https://hilainie.com/research/attachment-style-statistics/); [Holmes e Rahe](https://en.wikipedia.org/wiki/Holmes_and_Rahe_Stress_Scale).
